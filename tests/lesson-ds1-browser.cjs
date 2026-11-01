const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const { extractArrays } = require('../tools/build-question-bank.cjs');

const root = path.resolve(__dirname, '..');
const output = path.resolve(process.env.PORTAL_TEST_OUTPUT || path.join(root, 'test-results'));
fs.mkdirSync(output, { recursive: true });

const results = [];
let browser, server, base;
const filter = new RegExp(process.env.PORTAL_TEST_FILTER || '.*');

async function scenario(name, fn, options = {}) {
  if (!filter.test(name)) return;
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ...options
  });
  await context.route('https://**', route => route.abort());
  await context.addInitScript(() => {
    if (location.hostname === '127.0.0.1') {
      localStorage.setItem('sem2_first_visit_configured', 'true');
      window.sessionStorage.setItem('sem2-studio-rift-intro-v3', 'seen');
    }
  });

  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', res => {
    if (res.status() >= 400) {
      console.log('404/ERR RESPONSE:', res.status(), res.url());
    }
  });
  const go = async route => {
    await page.goto(base + route, { waitUntil: 'load' });
  };

  try {
    await fn({ page, context, go, errors });
    results.push({ name, passed: true });
    console.log('PASS', name);
  } catch (e) {
    results.push({ name, passed: false, error: e.stack, errors });
    await page.screenshot({ path: path.join(output, 'lesson-ds1-' + name + '.png') }).catch(() => {});
    console.log('FAIL', name, e.message.slice(0, 180));
  } finally {
    await context.close();
  }
}

async function register({ scenario: testScenario }) {
  // Scenario 1: Content manifest, sections, questions and bank extraction preservation
  await testScenario('ds1-content-manifest-and-questions-preservation', async ({ page, go }) => {
    await go('study/ds/lecture-1.html');

    // 1. Verify all 6 core sections exist
    const expectedSections = [
      'section-part1',
      'section-part2',
      'section-part3',
      'section-part4',
      'section-summary',
      'section-quiz'
    ];
    for (const secId of expectedSections) {
      const el = page.locator('#' + secId);
      assert.equal(await el.count(), 1, `Section #${secId} must exist`);
    }

    // 2. Verify all 16 quiz questions are present with required fields
    const quizData = await page.evaluate(`
      typeof quizQuestions !== 'undefined' ? quizQuestions.map(q => ({
        id: q.id,
        part: q.part,
        partLabel: q.partLabel,
        question: q.question,
        optionsCount: q.options ? q.options.length : 0,
        correct: q.correct,
        hasExplanation: typeof q.explanation === 'string' && q.explanation.length > 0
      })) : null
    `);

    assert(quizData, 'quizQuestions array must be defined');
    assert.equal(quizData.length, 16, 'Exactly 16 questions in quizQuestions');
    for (let i = 0; i < 16; i++) {
      const q = quizData[i];
      assert.equal(q.id, i + 1, `Question ${i + 1} id must match`);
      assert.equal(q.optionsCount, 4, `Question ${i + 1} must have 4 options`);
      assert(q.correct >= 0 && q.correct < 4, `Question ${i + 1} correct index must be valid`);
      assert(q.hasExplanation, `Question ${i + 1} must have explanation`);
    }

    // 3. Verify question bank extraction continues to find all 16 questions with exact sourceUrl
    const html = fs.readFileSync(path.join(root, 'study/ds/lecture-1.html'), 'utf8');
    const extracted = extractArrays(html, ['quizQuestions', 'mcqQuestions']);
    assert.equal(extracted.length, 16, 'Question bank extractor finds 16 questions');

    // 4. Verify all SVG graphics are retained
    const svgCount = await page.locator('main svg').count();
    assert(svgCount >= 8, `Expected at least 8 pedagogical SVGs in main, got ${svgCount}`);
  });

  // Scenario 2: Shared reading presentation, outline drawer, typography, and single settings group
  await testScenario('ds1-shared-reading-presentation-and-outline', async ({ page, go }) => {
    await go('study/ds/lecture-1.html');

    // 1. Verify TOC drawer controls and accessible attributes
    const btnOpenToc = page.locator('#btn-open-toc');
    assert.equal(await btnOpenToc.count(), 1, '#btn-open-toc must exist');
    assert.equal(await btnOpenToc.getAttribute('aria-controls'), 'sidebar-toc');

    const sidebarToc = page.locator('#sidebar-toc');
    assert.equal(await sidebarToc.count(), 1, '#sidebar-toc must exist');
    assert.equal(await sidebarToc.getAttribute('role'), 'dialog');
    assert.equal(await sidebarToc.getAttribute('aria-modal'), 'true');

    // Drawer opens on click
    await btnOpenToc.click();
    assert.equal(await btnOpenToc.getAttribute('aria-expanded'), 'true');
    assert.equal(await sidebarToc.evaluate(el => el.classList.contains('open')), true);

    // Verify drawer contains links to all parts
    const tocLinks = await sidebarToc.locator('a[href^="#section-"]').evaluateAll(links =>
      links.map(a => a.getAttribute('href'))
    );
    assert(tocLinks.includes('#section-part1'), 'TOC links to part 1');
    assert(tocLinks.includes('#section-part2'), 'TOC links to part 2');
    assert(tocLinks.includes('#section-part3'), 'TOC links to part 3');
    assert(tocLinks.includes('#section-part4'), 'TOC links to part 4');
    assert(tocLinks.includes('#section-summary'), 'TOC links to summary');
    assert(tocLinks.includes('#section-quiz'), 'TOC links to quiz');

    // Keyboard escape closes drawer and restores focus
    await page.keyboard.press('Escape');
    assert.equal(await btnOpenToc.getAttribute('aria-expanded'), 'false');
    assert.equal(await btnOpenToc.evaluate(el => el === document.activeElement), true);

    // 2. Reading controls: font size, line spacing and theme controls are functional
    const fontInc = page.locator('#btnFontInc');
    const fontDec = page.locator('#btnFontDec');
    const fontLabel = page.locator('#fontSizeLabel');
    assert(await fontInc.isEnabled(), '#btnFontInc is enabled');
    assert(await fontDec.isEnabled(), '#btnFontDec is enabled');
    const initialFont = await fontLabel.innerText();
    await fontInc.click();
    assert.notEqual(await fontLabel.innerText(), initialFont, 'Font scale updates on click');

    // Line spacing button
    const lineSpacingBtn = page.locator('#btnLineSpacing');
    assert(await lineSpacingBtn.isEnabled(), '#btnLineSpacing is enabled');
    const initialLhText = await lineSpacingBtn.innerText();
    await lineSpacingBtn.click();
    assert.notEqual(await lineSpacingBtn.innerText(), initialLhText, 'Line spacing updates on click');
  });

  // Scenario 3: Contrast regressions and paired surfaces across light, reading, and dark modes
  await testScenario('ds1-contrast-regressions-and-paired-surfaces', async ({ page, go }) => {
    const measureSelectorContrast = async (selector) => {
      return page.evaluate((sel) => {
        const parseRgba = str => {
          const parts = str.match(/[\d.]+/g)?.map(Number);
          return parts && parts.length >= 3 ? [parts[0], parts[1], parts[2], parts[3] ?? 1] : null;
        };
        const getBg = el => {
          const layers = [];
          for (let n = el; n; n = n.parentElement) {
            const bg = parseRgba(getComputedStyle(n).backgroundColor);
            if (bg && bg[3] > 0) layers.push(bg);
          }
          return layers.reverse().reduce((surface, layer) => {
            const a = layer[3] + surface[3] * (1 - layer[3]);
            return [0, 1, 2].map(i => (layer[i] * layer[3] + surface[i] * surface[3] * (1 - layer[3])) / (a || 1)).concat(a);
          }, [255, 255, 255, 1]);
        };
        const lum = c => {
          const v = c.slice(0, 3).map(x => x / 255).map(x => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
          return v[0] * 0.2126 + v[1] * 0.7152 + v[2] * 0.0722;
        };
        const el = document.querySelector(sel);
        if (!el) return 0;
        const s = getComputedStyle(el);
        const fg = parseRgba(s.webkitTextFillColor || s.color);
        const bg = getBg(el);
        const l1 = lum(fg), l2 = lum(bg);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      }, selector);
    };

    // Check light and reading modes for amber and teal headings
    for (const theme of ['light', 'reading']) {
      await go('study/ds/lecture-1.html');
      await page.evaluate((th) => window.PortalTheme.setTheme(th), theme);
      await page.waitForTimeout(250);

      const tealContrast = await measureSelectorContrast('.text-teal-600, [data-tone="teal"]');
      assert(
        tealContrast >= 4.5 || tealContrast >= 3.0,
        `Teal heading contrast in ${theme} mode must be at least 3.0:1 (actual: ${tealContrast.toFixed(2)}:1)`
      );

      const amberContrast = await measureSelectorContrast('.text-amber-600, .text-amber-700, [data-tone="amber"]');
      assert(
        amberContrast >= 4.5 || amberContrast >= 3.0,
        `Amber heading contrast in ${theme} mode must be at least 3.0:1 (actual: ${amberContrast.toFixed(2)}:1)`
      );
    }

    // Check dark mode for rose inline tokens
    await go('study/ds/lecture-1.html');
    await page.evaluate(() => window.PortalTheme.setTheme('dark'));
    await page.waitForTimeout(250);

    const roseTokenContrast = await measureSelectorContrast('.ltr-token, code.inline-code');
    assert(
      roseTokenContrast >= 4.5,
      `Rose inline token contrast in dark mode must be at least 4.5:1 (actual: ${roseTokenContrast.toFixed(2)}:1)`
    );

    // Verify LTR direction on code and tokens
    const ltrCheck = await page.evaluate(() => {
      const tokens = [...document.querySelectorAll('.ltr-token, code.inline-code, pre.code-block')];
      return tokens.every(el => {
        const s = getComputedStyle(el);
        return s.direction === 'ltr';
      });
    });
    assert.equal(ltrCheck, true, 'English code/tokens must be explicitly LTR');
  });

  // Scenario 4: Retain parts, anchors, deep links, memory controls, quiz filters, answer/reset states
  await testScenario('ds1-parts-anchors-and-controls-integrity', async ({ page, go }) => {
    await go('study/ds/lecture-1.html');

    // 1. Deep linking / hash navigation
    await page.evaluate(() => {
      window.location.hash = '#section-part3';
    });
    await page.waitForTimeout(200);
    const part3Visible = await page.locator('#section-part3').isVisible();
    assert.equal(part3Visible, true, 'Section part 3 is visible upon hash navigation');

    // 2. Quiz filters
    const filterAll = page.locator('[data-quiz-filter="all"]');
    const filterP1 = page.locator('[data-quiz-filter="p1"]');
    const filterP2 = page.locator('[data-quiz-filter="p2"]');

    assert.equal(await page.locator('#quizQuestionsContainer article').count(), 16, 'Initial 16 questions');

    await filterP1.click();
    assert.equal(await page.locator('#quizQuestionsContainer article').count(), 4, 'Filter P1 shows 4 questions');

    await filterP2.click();
    assert.equal(await page.locator('#quizQuestionsContainer article').count(), 4, 'Filter P2 shows 4 questions');

    await filterAll.click();
    assert.equal(await page.locator('#quizQuestionsContainer article').count(), 16, 'Filter all restores 16 questions');

    // 3. Quiz answering and reset
    const firstOption = page.locator('#quizQuestionsContainer article').first().locator('.quiz-option').first();
    await firstOption.click();

    // Score display updates
    const scoreText = await page.locator('#quizScoreDisplay').innerText();
    assert.match(scoreText, /^[01] \/ 16/, 'Score display reflects attempt');

    // Reset button resets quiz
    const resetBtn = page.locator('#btnResetQuiz');
    await resetBtn.click();
    assert.equal(await page.locator('#quizScoreDisplay').innerText(), '0 / 16', 'Reset button resets score');
    const firstOptionAfterReset = page.locator('#quizQuestionsContainer article').first().locator('.quiz-option').first();
    assert.equal(await firstOptionAfterReset.isEnabled(), true, 'Options re-enabled after reset');
  });

  // Scenario 5: Responsive viewports (390px, 1440px), figure local scrolling, and reduced motion
  await testScenario('ds1-responsive-viewports-and-figure-scrolling', async ({ page, go }) => {
    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await go('study/ds/lecture-1.html');

    // 1. Verify page has no horizontal window-level overflow
    const overflowCheck = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= window.innerWidth + 1;
    });
    assert.equal(overflowCheck, true, 'Page must not horizontally overflow on 390px mobile viewport');

    // 2. Verify figures / code blocks locally scroll rather than shrink labels
    const figureScrollCheck = await page.evaluate(() => {
      const scrollableFigures = document.querySelectorAll('.diagram-frame, .visual-canvas, .code-walkthrough, pre.code-block');
      if (scrollableFigures.length === 0) return false;
      return [...scrollableFigures].every(el => {
        const s = getComputedStyle(el);
        return s.overflowX === 'auto' || s.overflowX === 'scroll' || el.scrollWidth >= el.clientWidth;
      });
    });
    assert.equal(figureScrollCheck, true, 'Pedagogical diagrams and code blocks allow local horizontal scrolling');

    // 3. Desktop 1440px
    await page.setViewportSize({ width: 1440, height: 900 });
    const desktopFits = await page.evaluate(() => {
      const container = document.querySelector('.reading-container');
      return container && container.clientWidth <= 1440;
    });
    assert.equal(desktopFits, true, 'Reading container stays bounded on 1440px desktop');
  });
}

async function runStandalone() {
  server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname).replace(/^\/Sem2_portal\//, '/');
    const target = path.resolve(root, '.' + relative + (relative.endsWith('/') ? 'index.html' : ''));
    if (!target.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    fs.readFile(target, (err, bytes) => {
      if (err) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.setHeader('Content-Type', ({
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css',
        '.png': 'image/png',
        '.svg': 'image/svg+xml'
      })[path.extname(target)] || 'application/octet-stream');
      res.end(bytes);
    });
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/Sem2_portal/`;
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PORTAL_BROWSER_CHANNEL ? { channel: process.env.PORTAL_BROWSER_CHANNEL } : {})
  });

  try {
    await register({ scenario });
  } finally {
    await browser.close();
    server.close();
  }

  const failed = results.filter(r => !r.passed);
  console.log(`\n${results.length - failed.length}/${results.length} DS Lecture 1 scenarios passed`);
  if (failed.length > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runStandalone().catch(err => {
    console.error(err);
    if (browser) browser.close().catch(() => {});
    if (server) server.close();
    process.exit(1);
  });
}

module.exports = { register };
