const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const { packageSite } = require('../tools/package-site.cjs');
const { extractArrays } = require('../tools/build-question-bank.cjs');

const root = path.resolve(__dirname, '..');
const release = path.join(root, 'dist');
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
  await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin
    ? route.continue()
    : route.abort());
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
      errors.push(`HTTP ${res.status()}: ${res.url()}`);
    }
  });
  const go = async route => {
    await page.goto(base + route, { waitUntil: 'load' });
  };

  try {
    await fn({ page, context, go, errors });
    assert.deepEqual(errors, [], 'No page or local resource errors');
    results.push({ name, passed: true });
    console.log('PASS', name);
  } catch (e) {
    results.push({ name, passed: false, error: e.stack, errors });
    await page.screenshot({ path: path.join(output, 'lesson-cg1-' + name + '.png') }).catch(() => {});
    console.log('FAIL', name, e.message.slice(0, 180));
  } finally {
    await context.close();
  }
}

async function register({ scenario: testScenario }) {
  // Scenario 1: Content manifest, sections, 59 questions, figures, formulas, and widgets
  await testScenario('cg1-content-manifest-and-questions-preservation', async ({ page, go }) => {
    await go('study/cg/chapter-1.html');

    // 1. Verify all 4 teaching sections + conceptual quiz + complete question bank exist
    const expectedSections = ['sec1', 'sec2', 'sec3', 'sec4', 'sec5', 'sec6'];
    for (const secId of expectedSections) {
      const el = page.locator('#' + secId);
      assert.equal(await el.count(), 1, `Section #${secId} must exist`);
    }

    // 2. Verify all 59 authored quiz questions are present with required identities
    const quizData = await page.evaluate(`
      typeof QUIZ_QUESTIONS !== 'undefined' ? QUIZ_QUESTIONS.map(q => ({
        id: q.id,
        section: q.section,
        type: q.type,
        qEn: q.qEn || q.question,
        optionsCount: q.options ? q.options.length : 0,
        correct: q.correct,
        hasAmmiya: typeof (q.ammiya || q.explanation) === 'string' && (q.ammiya || q.explanation).length > 0
      })) : null
    `);

    assert(quizData, 'QUIZ_QUESTIONS array must be defined');
    assert.equal(quizData.length, 59, 'Exactly 59 authored questions in QUIZ_QUESTIONS');

    const bySec = {};
    for (const q of quizData) {
      bySec[q.section] = (bySec[q.section] || 0) + 1;
      assert(q.optionsCount >= 2, `Question ${q.id} must have at least 2 options`);
      assert(q.correct >= 0 && q.correct < q.optionsCount, `Question ${q.id} correct index valid`);
      assert(q.hasAmmiya, `Question ${q.id} must have authored explanation`);
    }

    assert.equal(bySec['sec1'], 12, 'Section 1 has 12 questions (6 MCQ + 6 TF)');
    assert.equal(bySec['sec2'], 11, 'Section 2 has 11 questions (6 MCQ + 5 TF)');
    assert.equal(bySec['sec3'], 10, 'Section 3 has 10 questions (5 MCQ + 5 TF)');
    assert.equal(bySec['sec4'], 11, 'Section 4 has 11 questions (6 MCQ + 5 TF)');
    assert.equal(bySec['sec5'], 15, 'Section 5 has 15 questions (Easy conceptual quiz)');

    // 3. Verify question bank extractor can find all 59 questions via AST
    const html = fs.readFileSync(path.join(root, 'study/cg/chapter-1.html'), 'utf8');
    const extracted = extractArrays(html, ['QUIZ_QUESTIONS', 'quizQuestions', 'mcqQuestions']);
    assert.equal(extracted.length, 59, 'Question bank extractor finds all 59 questions');

    // 4. Verify both SVGs are present in main
    const svgs = page.locator('main svg');
    assert((await svgs.count()) >= 2, 'At least 2 pedagogical SVGs in main');

    // 5. Verify Rods vs Cones comparison table exists
    const table = page.locator('table');
    assert((await table.count()) >= 1, 'Comparison table exists in Part 4');
    const tableText = await table.first().innerText();
    assert(tableText.includes('Scotopic') || tableText.includes('Rods'), 'Table includes Rods/Scotopic comparison');

    // 6. Verify interactive pixel depth calculator widget
    const depthReadout = page.locator('#depthReadout');
    assert.equal(await depthReadout.count(), 1, '#depthReadout must exist');
    await page.evaluate(() => window.showPixelDepth(1));
    const text1 = await depthReadout.innerText();
    assert(text1.includes('1') && text1.includes('2'), '1-bit shows 2 colors');

    await page.evaluate(() => window.showPixelDepth(24));
    const text24 = await depthReadout.innerText();
    assert(text24.includes('24') && (text24.includes('16,777,216') || text24.includes('16.7')), '24-bit shows 16.7M colors');

    // 7. Verify formulas use semantic markup and no unparsed TeX delimiters ($$ or raw math)
    const formulaElements = await page.locator('[role="math"], .math-formula').count();
    assert(formulaElements >= 2, 'Formulas rendered with semantic math markup');
  });

  // Scenario 2: Shared reading presentation, outline drawer, typography, and controls
  await testScenario('cg1-shared-reading-presentation-and-outline', async ({ page, go }) => {
    await go('study/cg/chapter-1.html');

    assert.equal(await page.locator('#mainReadingHeader').evaluate(el => getComputedStyle(el).position), 'sticky');
    assert.equal(await page.locator('#mainReadingHeader > div').evaluate(el => getComputedStyle(el).display), 'flex');
    assert.equal(await page.locator('#mainReadingHeader a svg').evaluate(el => el.getBoundingClientRect().width), 12);
    const breadcrumb = page.locator('.study-portal-bar nav a');
    assert.match(await breadcrumb.getAttribute('href'), /subject\.html\?id=computer-graphics&kind=lectures$/);
    assert.equal(await breadcrumb.innerText(), 'الرسم بالحاسوب');

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

    // Verify drawer contains links to all sections
    const tocLinks = await sidebarToc.locator('a[href^="#sec"]').evaluateAll(links =>
      links.map(a => a.getAttribute('href'))
    );
    assert(tocLinks.includes('#sec1'), 'TOC links to sec1');
    assert(tocLinks.includes('#sec2'), 'TOC links to sec2');
    assert(tocLinks.includes('#sec3'), 'TOC links to sec3');
    assert(tocLinks.includes('#sec4'), 'TOC links to sec4');
    assert(tocLinks.includes('#sec5'), 'TOC links to sec5');
    assert(tocLinks.includes('#sec6'), 'TOC links to sec6');

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
    assert.equal(await lineSpacingBtn.count(), 1, '#btnLineSpacing must exist');
    const initialLhText = await lineSpacingBtn.innerText();
    const prose = page.locator('#sec1 p.ar-block').first();
    const initialLineHeight = await prose.evaluate(el => parseFloat(getComputedStyle(el).lineHeight));
    await lineSpacingBtn.click();
    assert(await prose.evaluate(el => parseFloat(getComputedStyle(el).lineHeight)) < initialLineHeight);
    assert.notEqual(await lineSpacingBtn.innerText(), initialLhText, 'Line spacing updates on click');
  });

  // Scenario 3: Contrast regressions and paired surfaces across light, reading, and dark modes
  await testScenario('cg1-contrast-regressions-and-paired-surfaces', async ({ page, go }) => {
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

    // Check light and reading modes
    for (const theme of ['light', 'reading']) {
      await go('study/cg/chapter-1.html');
      await page.evaluate((th) => window.PortalTheme.setTheme(th), theme);
      await page.waitForTimeout(200);

      const headingContrast = await measureSelectorContrast('h1, h2');
      assert(
        headingContrast >= 3.0,
        `Heading contrast in ${theme} mode must be at least 3.0:1 (actual: ${headingContrast.toFixed(2)}:1)`
      );

      const bodyContrast = await measureSelectorContrast('p, li');
      assert(
        bodyContrast >= 4.5,
        `Body text contrast in ${theme} mode must be at least 4.5:1 (actual: ${bodyContrast.toFixed(2)}:1)`
      );
    }

    // Check dark mode
    await go('study/cg/chapter-1.html');
    await page.evaluate(() => window.PortalTheme.setTheme('dark'));
    await page.waitForTimeout(200);

    const darkHeadingContrast = await measureSelectorContrast('h1, h2');
    assert(
      darkHeadingContrast >= 3.0,
      `Dark heading contrast must be at least 3.0:1 (actual: ${darkHeadingContrast.toFixed(2)}:1)`
    );

    const darkBodyContrast = await measureSelectorContrast('p, li');
    assert(
      darkBodyContrast >= 4.5,
      `Dark body text contrast must be at least 4.5:1 (actual: ${darkBodyContrast.toFixed(2)}:1)`
    );

    assert(await measureSelectorContrast('.tab-btn.active') >= 4.5, 'Active section label is legible in dark mode');

    // Verify LTR direction on English terms and code tokens
    const ltrCheck = await page.evaluate(() => {
      const tokens = [...document.querySelectorAll('.ltr-inline, .ltr-token, code.inline-code, pre.code-block, .font-mono')];
      if (tokens.length === 0) return true;
      return tokens.every(el => {
        const s = getComputedStyle(el);
        return s.direction === 'ltr';
      });
    });
    assert.equal(ltrCheck, true, 'English technical tokens must be explicitly LTR');
  });

  // Scenario 4: Section practice, full bank view, answering, and reset synchronization
  await testScenario('cg1-practice-and-quiz-interaction', async ({ page, go }) => {
    await go('study/cg/chapter-1.html');

    // 1. Initial state: score is 0 / 59
    const scoreBadge = page.locator('#scoreBadge');
    assert.equal(await scoreBadge.count(), 1, '#scoreBadge must exist');
    const initialScore = await scoreBadge.innerText();
    assert.match(initialScore, /^0\s*\/\s*59/, 'Initial score is 0 / 59');

    // 2. Answer question p1_mcq1 in Section 1
    const p1Container = page.locator('#quiz-sec1');
    assert.equal(await p1Container.count(), 1, '#quiz-sec1 must exist');
    const firstOption = p1Container.locator('article').first().locator('button.quiz-opt-btn, .quiz-option').nth(1);
    await firstOption.focus();
    await page.keyboard.press('Enter');
    assert(await firstOption.evaluate(el => el === document.activeElement), 'Answer keeps keyboard focus');
    assert.match(await page.locator('#quiz-answer-status').textContent(), /إجابة صحيحة/);

    // 3. Verify userAnswers updated in page state
    const answerState = await page.evaluate(() => window.userAnswers['p1_mcq1']);
    assert.equal(answerState, 1, 'Answer recorded for p1_mcq1');

    // 4. Verify score badge updated
    const updatedScore = await scoreBadge.innerText();
    assert.match(updatedScore, /^1\s*\/\s*59/, 'Score badge reflects correct answer');

    // 5. Verify the same question in Section 6 (#quiz-all) also reflects answered state
    const allContainer = page.locator('#quiz-all');
    assert.equal(await allContainer.count(), 1, '#quiz-all must exist');
    const sameCardInAll = allContainer.locator('article[data-qid="p1_mcq1"], [id*="p1_mcq1"]');
    assert.equal(await sameCardInAll.count(), 1, 'Question card p1_mcq1 exists in #quiz-all view');
    const explanationText = await sameCardInAll.innerText();
    assert(explanationText.includes('الإجابة') || explanationText.includes('الصح'), 'Explanation shown in #quiz-all');

    // 6. Reset button resets state
    const resetBtn = page.locator('#btnResetAllQuizzes');
    assert.equal(await resetBtn.count(), 1, '#btnResetAllQuizzes must exist');
    await resetBtn.click();
    const resetScore = await scoreBadge.innerText();
    assert.match(resetScore, /^0\s*\/\s*59/, 'Score badge reset to 0 / 59');
  });

  // Scenario 5: Responsive viewports (320px, 390px, 1440px) and offline integrity
  await testScenario('cg1-responsive-viewports-and-offline-integrity', async ({ page, go }) => {
    // 1. Mobile 320px
    await page.setViewportSize({ width: 320, height: 600 });
    await go('study/cg/chapter-1.html');
    const overflow320 = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= window.innerWidth + 1;
    });
    assert.equal(overflow320, true, 'Page must not horizontally overflow on 320px viewport');

    const camera = page.locator('#sec3 svg');
    assert(await camera.isVisible(), 'Camera figure renders with third-party requests blocked');
    const rays = await camera.locator('polyline').evaluateAll(lines =>
      lines.map(line => Array.from(line.points, ({ x, y }) => [x, y]))
    );
    assert.deepEqual(rays.map(ray => ray[1]), [[270, 110], [270, 110]], 'Both rays pass through the aperture');
    assert(rays.every(ray => ray[2][0] === 488), 'Both rays end on the film plane');
    const formula = page.getByRole('math', { name: '350 nanometers to 780 nanometers' });
    assert(await formula.isVisible());
    assert.match(await formula.innerText(), /350 nm\s+to\s+780 nm/);

    // 2. Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    const overflow390 = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= window.innerWidth + 1;
    });
    assert.equal(overflow390, true, 'Page must not horizontally overflow on 390px viewport');

    // 3. Verify diagrams and tables have horizontal scrollability on mobile
    const scrollContainers = await page.locator('.overflow-x-auto, .diagram-frame, .table-container').count();
    assert(scrollContainers >= 2, 'Tables and diagrams wrapped in responsive scroll containers');

    // 4. Desktop 1440px
    await page.setViewportSize({ width: 1440, height: 900 });
    const desktopFits = await page.evaluate(() => {
      const container = document.querySelector('.reading-container');
      return container && container.clientWidth <= 1440;
    });
    assert.equal(desktopFits, true, 'Reading container stays bounded on 1440px desktop');
  });
}

async function runStandalone() {
  packageSite();
  server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname).replace(/^\/Sem2_portal\//, '/');
    const target = path.resolve(release, '.' + relative + (relative.endsWith('/') ? 'index.html' : ''));
    if (!target.startsWith(release + path.sep)) {
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
        '.woff2': 'font/woff2',
        '.png': 'image/png',
        '.svg': 'image/svg+xml'
      })[path.extname(target)] || 'application/octet-stream');
      res.end(bytes);
    });
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

  browser = await chromium.launch({
    headless: true,
    ...(process.env.PORTAL_BROWSER_CHANNEL ? { channel: process.env.PORTAL_BROWSER_CHANNEL } : {})
  });

  try {
    for (const prefix of ['', 'Sem2_portal/']) {
      base = 'http://127.0.0.1:' + server.address().port + '/' + prefix;
      const label = prefix ? 'subpath' : 'root';
      await register({ scenario: (name, fn, options) => scenario(label + '-' + name, fn, options) });
    }
  } finally {
    await browser.close();
    server.close();
  }

  const failed = results.filter(r => !r.passed);
  console.log(`\n${results.length - failed.length}/${results.length} CG Chapter 1 scenarios passed`);
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
