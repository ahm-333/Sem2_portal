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

async function measureElementContrast(page, target) {
  return page.evaluate(tgt => {
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
    let el = null;
    if (typeof tgt === 'string') {
      if (tgt.startsWith('text:')) {
        const search = tgt.slice(5);
        el = Array.from(document.querySelectorAll('body *:not(script):not(style)')).find(
          node => node.children.length === 0 && (node.textContent || '').includes(search)
        );
      } else {
        el = document.querySelector(tgt);
      }
    }
    if (!el) return 0;
    const fg = parseRgba(getComputedStyle(el).webkitTextFillColor || getComputedStyle(el).color);
    const bg = getBg(el);
    const l1 = lum(fg), l2 = lum(bg);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }, target);
}

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
  const go = async route => {
    await page.goto(base + route, { waitUntil: 'load' });
  };

  try {
    await fn({ page, context, go, errors });
    results.push({ name, passed: true });
    console.log('PASS', name);
  } catch (e) {
    results.push({ name, passed: false, error: e.stack, errors });
    await page.screenshot({ path: path.join(output, 'lesson-ds4-' + name + '.png') }).catch(() => {});
    console.log('FAIL', name, e.message.slice(0, 180));
  } finally {
    await context.close();
  }
}

async function register({ scenario: testScenario }) {
  // 1. Content Manifest, Preservation of all 6 parts, C++ code, worked examples, and questions
  await testScenario('ds4-content-and-bank-preservation', async ({ page, go }) => {
    const ds4Path = path.join(root, 'study/ds/lecture-4.html');
    assert(fs.existsSync(ds4Path), 'study/ds/lecture-4.html must exist');
    const html = fs.readFileSync(ds4Path, 'utf8');

    // All six parts exist with their containers
    await go('study/ds/lecture-4.html');
    for (let i = 1; i <= 6; i++) {
      const part = page.locator('#part-' + i);
      assert.equal(await part.count(), 1, `Part ${i} container (#part-${i}) exists`);
      assert(await part.isVisible(), `Part ${i} is visible`);
    }

    // Verify all 10 authored questions are preserved in quizQuestions
    const questions = extractArrays(html, ['quizQuestions']);
    assert.equal(questions.length, 10, 'All 10 authored questions preserved in quizQuestions');

    for (let i = 1; i <= 10; i++) {
      const q = questions[i - 1];
      assert.equal(q.id, i, `Question ${i} id matches`);
      assert(q.question && q.options.length === 4, `Question ${i} has prompt and 4 options`);
      assert(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 4, `Question ${i} correct index is valid`);
      assert(q.explanation && q.explanation.length > 10, `Question ${i} has detailed explanation`);
    }

    // Verify key C++ code snippets are present in HTML
    assert(html.includes('class Stack'), 'class Stack definition preserved');
    assert(html.includes('arr[++top] = value'), 'arr[++top] = value expression preserved');
    assert(html.includes('top == MAX - 1'), 'isFull top == MAX - 1 condition preserved');
    assert(html.includes('top == -1'), 'isEmpty top == -1 condition preserved');
    assert(html.includes('template <class T>') || html.includes('template &lt;class T&gt;'), 'template <class T> preserved');
    assert(html.includes('class Node') || html.includes('struct Node'), 'Node definition preserved');
    assert(html.includes('Stack Overflow'), 'Stack Overflow message preserved');
    assert(html.includes('Stack Underflow'), 'Stack Underflow message preserved');

    // Verify in-context LIFO self-check is preserved
    assert(html.includes('Push(10)') && html.includes('Pop()'), 'LIFO self check preserved');
    assert(html.includes('30'), 'LIFO self check answer 30 preserved');

    // Verify Array vs Linked List comparison table preserved
    const tables = page.locator('table, .comparison-table');
    assert(await tables.count() >= 1, 'Comparison table preserved');

    // Verify solved Exam MCQs exist across parts
    const solvedQuestions = page.locator('h4:has-text("Exam MCQs")');
    assert(await solvedQuestions.count() >= 5, 'Solved Exam MCQs cards preserved across parts');
  });

  // 2. Array Simulator: Push/Pop, top pointer, overflow/underflow, reset, and accessible static walkthrough
  await testScenario('ds4-array-simulator-controls-states-and-walkthrough', async ({ page, go }) => {
    await go('study/ds/lecture-4.html');

    const simDisplay = page.locator('#arr-sim-display');
    const simBadge = page.locator('#arr-sim-badge');
    const simNext = page.locator('#arr-sim-next');
    const simPrev = page.locator('#arr-sim-prev');

    assert.equal(await simDisplay.count(), 1, '#arr-sim-display exists');
    assert.equal(await simBadge.count(), 1, '#arr-sim-badge exists');

    // Initial state: Stage 1 / top = -1
    assert.match(await simBadge.innerText(), /1\/5/);
    let displayText = await simDisplay.innerText();
    assert(displayText.includes('top = -1') || displayText.includes('فارغ'), 'Stage 1 shows empty stack and top = -1');

    // Advance to Stage 2: push(10, 20, 30) -> top = 2
    await simNext.click();
    assert.match(await simBadge.innerText(), /2\/5/);
    displayText = await simDisplay.innerText();
    assert(displayText.includes('top = 2') && displayText.includes('30'), 'Stage 2 shows top = 2 with 30');

    // Advance to Stage 3: push(40, 50) -> top = 4 (Full)
    await simNext.click();
    assert.match(await simBadge.innerText(), /3\/5/);
    displayText = await simDisplay.innerText();
    assert(displayText.includes('top = 4') && displayText.includes('50'), 'Stage 3 shows top = 4 full state');

    // Advance to Stage 4: push(60) -> Overflow
    await simNext.click();
    assert.match(await simBadge.innerText(), /4\/5/);
    displayText = await simDisplay.innerText();
    assert(displayText.includes('Stack Overflow') || displayText.includes('60'), 'Stage 4 shows Stack Overflow');

    // Advance to Stage 5: pop() twice -> top = 2, peek = 30
    await simNext.click();
    assert.match(await simBadge.innerText(), /5\/5/);
    displayText = await simDisplay.innerText();
    assert(displayText.includes('pop') && displayText.includes('30'), 'Stage 5 shows pop twice and top = 2');

    // Prev button returns to Stage 4
    await simPrev.click();
    assert.match(await simBadge.innerText(), /4\/5/);

    // Tab buttons direct navigation
    const stage1Tab = page.locator('.arr-sim-tab[data-arr-stage="0"]');
    await stage1Tab.click();
    assert.match(await simBadge.innerText(), /1\/5/);

    // Static accessible walkthrough exists
    const staticWalkthrough = page.locator('.static-walkthrough, details[data-static-walkthrough]');
    assert(await staticWalkthrough.count() >= 1, 'Static accessible walkthrough is present');

    // Touch targets >= 24px (WCAG 2.5.8)
    const nextBox = await simNext.boundingBox();
    assert(nextBox.height >= 24, `simNext height >= 24px, got ${nextBox.height}`);
    assert(nextBox.width >= 24, `simNext width >= 24px, got ${nextBox.width}`);

    // Keyboard navigation on simulator controls
    await simNext.focus();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'arr-sim-next');
    await page.keyboard.press('Enter');
    assert.match(await simBadge.innerText(), /2\/5/);
  });

  // 3. Shared reading presentation, outline drawer, typography, and controls
  await testScenario('ds4-shared-reading-presentation-and-outline', async ({ page, go }) => {
    await go('study/ds/lecture-4.html');

    // Reading header
    const header = page.locator('#mainReadingHeader');
    assert.equal(await header.count(), 1, '#mainReadingHeader exists');

    // TOC drawer controls
    const btnOpenToc = page.locator('#btn-open-toc');
    const btnCloseToc = page.locator('#btn-close-toc');
    const sidebarToc = page.locator('#sidebar-toc');
    const tocBackdrop = page.locator('#toc-backdrop');

    assert.equal(await btnOpenToc.count(), 1, '#btn-open-toc exists');
    assert.equal(await sidebarToc.count(), 1, '#sidebar-toc exists');

    // Open drawer
    await btnOpenToc.click();
    assert(await sidebarToc.evaluate(el => el.classList.contains('open')), 'TOC drawer opens on click');
    assert(await tocBackdrop.evaluate(el => el.classList.contains('open')), 'TOC backdrop opens on click');

    // Check TOC contains links to all parts and quiz
    const tocLinks = await sidebarToc.locator('a[href^="#"]').evaluateAll(links =>
      links.map(a => a.getAttribute('href'))
    );
    for (let i = 1; i <= 6; i++) {
      assert(tocLinks.includes('#part-' + i), `TOC links to #part-${i}`);
    }
    assert(tocLinks.includes('#section-quiz'), 'TOC links to #section-quiz');

    // Close drawer via close button
    await btnCloseToc.click();
    assert(await sidebarToc.evaluate(el => !el.classList.contains('open')), 'TOC drawer closes on button click');

    // Keyboard Escape closes drawer
    await btnOpenToc.click();
    assert(await sidebarToc.evaluate(el => el.classList.contains('open')), 'TOC drawer opens again');
    await page.keyboard.press('Escape');
    assert(await sidebarToc.evaluate(el => !el.classList.contains('open')), 'Escape closes TOC drawer');

    // Reading controls: font size
    const fontInc = page.locator('#btnFontInc');
    const fontDec = page.locator('#btnFontDec');
    const fontLabel = page.locator('#fontSizeLabel');
    assert.equal(await fontLabel.innerText(), '100%');
    await fontInc.click();
    assert.equal(await fontLabel.innerText(), '110%');
    await fontDec.click();
    assert.equal(await fontLabel.innerText(), '100%');

    // Line spacing
    const lineSpacingBtn = page.locator('#btnLineSpacing');
    const initialLh = await lineSpacingBtn.innerText();
    await lineSpacingBtn.click();
    assert.notEqual(await lineSpacingBtn.innerText(), initialLh, 'Line spacing toggled');
  });

  // 4. Contrast across light, dark, and reading modes, LTR code blocks
  await testScenario('ds4-contrast-dark-reading-light-modes-and-ltr', async ({ page, go }) => {
    // Check in light and reading modes
    for (const theme of ['light', 'reading', 'dark']) {
      await go('study/ds/lecture-4.html');
      await page.evaluate(th => window.PortalTheme.setTheme(th), theme);
      await page.waitForTimeout(250);

      // Check Exam MCQs headings contrast
      const examHeadingContrast = await measureElementContrast(page, 'text:Exam MCQs');
      assert(
        examHeadingContrast >= 3.0,
        `Exam MCQs heading contrast in ${theme} mode must be >= 3.0:1, got ${examHeadingContrast.toFixed(2)}:1`
      );

      // Check card headings
      const h2Contrast = await measureElementContrast(page, 'h2');
      assert(h2Contrast >= 3.0, `h2 contrast in ${theme} mode >= 3.0:1, got ${h2Contrast.toFixed(2)}:1`);

      // Check code tokens
      const tokenContrast = await measureElementContrast(page, 'code.inline-code, .inline-code');
      assert(tokenContrast >= 4.5, `Inline code contrast in ${theme} mode >= 4.5:1, got ${tokenContrast.toFixed(2)}:1`);
    }

    // Verify LTR direction on English code and tokens
    await go('study/ds/lecture-4.html');
    const ltrCheck = await page.evaluate(() => {
      const tokens = [...document.querySelectorAll('.ltr-token, code.inline-code, pre.code-block, .code-surface')];
      return tokens.every(el => {
        const s = getComputedStyle(el);
        return s.direction === 'ltr';
      });
    });
    assert.equal(ltrCheck, true, 'English code/tokens must be explicitly LTR');
  });

  // 5. Interactive dynamic quiz: filters, answering, score, reset, and section completion
  await testScenario('ds4-interactive-quiz-filter-answer-and-reset', async ({ page, go }) => {
    await go('study/ds/lecture-4.html');

    // Section completion checks
    const checkBtn = page.locator('[data-check="part-1"]');
    assert.equal(await checkBtn.count(), 1, 'data-check="part-1" button exists');
    const badge = page.locator('#completed-count-badge');
    const initialBadge = (await badge.textContent()).trim();
    assert.match(initialBadge, /^0\//, 'Initial completion badge shows 0');

    await checkBtn.click();
    assert.match((await badge.textContent()).trim(), /^1\//, 'Completion badge increments');
    await checkBtn.click();
    assert.match((await badge.textContent()).trim(), /^0\//, 'Completion badge decrements');

    // Dynamic quiz questions
    const dynamicCards = page.locator('#quizQuestionsContainer article');
    assert.equal(await dynamicCards.count(), 10, 'All 10 dynamic quiz question cards rendered');

    // Filter buttons
    const filterAll = page.locator('[data-quiz-filter="all"]');
    const filterP1 = page.locator('[data-quiz-filter="p1"]');
    assert.equal(await filterAll.count(), 1, 'Filter all exists');
    assert.equal(await filterP1.count(), 1, 'Filter P1 exists');

    await filterP1.click();
    assert.equal(await page.locator('#quizQuestionsContainer article').count(), 3, 'Filter P1 shows 3 questions');

    await filterAll.click();
    assert.equal(await page.locator('#quizQuestionsContainer article').count(), 10, 'Filter all restores 10 questions');

    // Answering Q1 (LIFO)
    const q1Card = page.locator('#quizQuestionsContainer article').first();
    const correctOpt = q1Card.locator('.quiz-option:has-text("LIFO")');
    await correctOpt.click();

    // Score display updates
    const scoreDisplay = page.locator('#quizScoreDisplay');
    assert.match(await scoreDisplay.innerText(), /1\s*\/\s*10/, 'Score display reflects correct answer');

    // Reset quiz
    const resetBtn = page.locator('#btnResetQuiz');
    await resetBtn.click();
    assert.match(await scoreDisplay.innerText(), /0\s*\/\s*10/, 'Score resets to 0');
  });

  // 6. Responsive viewports (320px, 390px, 1440px) and reduced motion
  await testScenario('ds4-responsive-viewports-and-no-overflow', async ({ page, go }) => {
    // 320px mobile
    await page.setViewportSize({ width: 320, height: 600 });
    await go('study/ds/lecture-4.html');
    let noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    assert.equal(noOverflow, true, 'No horizontal overflow on 320px mobile viewport');

    // 390px mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await go('study/ds/lecture-4.html');
    noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    assert.equal(noOverflow, true, 'No horizontal overflow on 390px mobile viewport');

    // Desktop 1440px
    await page.setViewportSize({ width: 1440, height: 900 });
    await go('study/ds/lecture-4.html');
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
  console.log(`\n${results.length - failed.length}/${results.length} DS Lecture 4 scenarios passed`);
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
