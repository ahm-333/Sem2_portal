const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const { auditActionContrast } = require('./control-contrast.cjs');

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
    await page.screenshot({ path: path.join(output, 'lesson-ds7-' + name + '.png') }).catch(() => {});
    console.log('FAIL', name, e.message.slice(0, 180));
  } finally {
    await context.close();
  }
}

async function register({ scenario: testScenario }) {
  await testScenario('ds7-landmarks-drawer-and-keyboard-navigation', async ({ page, go, errors }) => {
    await go('study/ds/lecture-7.html');
    
    // WCAG 2.4.1: Main landmark and skip link
    const main = page.locator('main#study-main, main.reading-container');
    assert.equal(await main.count(), 1, 'Page must have a <main> landmark container');
    const skipLink = page.locator('.study-shell-skip');
    assert.equal(await skipLink.count(), 1, 'Shared study shell skip link must be present');

    // Drawer dialog and controls
    const opener = page.locator('#btn-open-toc');
    const drawer = page.locator('#sidebar-toc');
    const closeBtn = page.locator('#btn-close-toc');
    const backdrop = page.locator('#toc-backdrop');

    assert.deepEqual(await page.evaluate(auditActionContrast, '#btn-open-toc'), [], 'The table of contents button must be readable');
    assert.equal(await opener.getAttribute('aria-controls'), 'sidebar-toc');
    assert.equal(await drawer.getAttribute('role'), 'dialog');
    assert.equal(await drawer.getAttribute('aria-modal'), 'true');

    // Open drawer with Enter
    await opener.press('Enter');
    assert.equal(await opener.getAttribute('aria-expanded'), 'true');
    assert.equal(await drawer.evaluate(el => el.classList.contains('open')), true);
    assert.equal(await backdrop.evaluate(el => el.classList.contains('open')), true);

    // Focus should be on close button
    const isFocused = locator => locator.evaluate(el => el === document.activeElement);
    assert(await isFocused(closeBtn), 'Focus must land on drawer close button');

    // Shift+Tab wrap to last link
    const lastDrawerLink = drawer.locator('nav a').last();
    await page.keyboard.press('Shift+Tab');
    assert(await isFocused(lastDrawerLink), 'Shift+Tab should wrap to last focusable link in drawer');

    // Tab back to close button
    await page.keyboard.press('Tab');
    assert(await isFocused(closeBtn), 'Tab should wrap back to close button');

    // Escape closes drawer and restores focus
    await page.keyboard.press('Escape');
    assert.equal(await opener.getAttribute('aria-expanded'), 'false');
    assert.equal(await drawer.evaluate(el => el.classList.contains('open')), false);
    assert(await isFocused(opener), 'Focus must return to drawer opener button after Escape');

    // Chapter filter pills
    const pills = page.locator('.chapter-pill');
    assert.equal(await pills.count(), 8, 'Must have 8 chapter pills (all, 6 parts, quiz)');

    const quizPill = page.locator('button[data-target="section-quiz"]');
    await quizPill.press('Space');
    assert.equal(await quizPill.getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#part1').isVisible(), false, 'Part 1 should be hidden when quiz pill is active');
    assert.equal(await page.locator('#section-quiz').isVisible(), true, 'Quiz section must be visible');

    // Opening drawer and clicking a section link reveals that section
    await opener.press('Enter');
    await drawer.locator('a[href="#part6"]').press('Enter');
    await page.waitForURL('**#part6');
    const part6 = page.locator('#part6');
    assert.equal(await part6.isVisible(), true, 'Part 6 section must become visible after drawer link click');
    assert.equal(await page.locator('button[data-target="part6"]').getAttribute('aria-pressed'), 'true');

    assert.deepEqual(errors, []);
  }, { viewport: { width: 390, height: 844 } });

  await testScenario('ds7-reading-controls-and-theme-synchronization', async ({ page, go, errors }) => {
    await go('study/ds/lecture-7.html');

    // Font size controls
    const fontLabel = page.locator('#fontSizeLabel');
    const readingText = page.locator('#part2 h4, #part2 h4 + p, #part6 pre code, #quizContainer article:first-child :is(h3, .quiz-option)');
    const fontSizes = () => readingText.evaluateAll(nodes => nodes.map(el => parseFloat(getComputedStyle(el).fontSize)));
    const initialSizes = await fontSizes();
    assert(initialSizes.length > 0);
    assert.equal(await fontLabel.textContent(), '100%');
    await page.locator('#btnFontInc').press('Enter');
    assert.equal(await fontLabel.textContent(), '110%');
    assert((await fontSizes()).every((size, index) => size > initialSizes[index]), 'Lesson and quiz text must grow');
    await page.locator('#btnFontDec').press('Enter');
    assert.equal(await fontLabel.textContent(), '100%');
    assert.deepEqual(await fontSizes(), initialSizes, 'Returning to 100% must restore the original text sizes');

    // Line spacing
    const academicQuote = page.locator('.academic-quote').first();
    const initialLh = await academicQuote.evaluate(el => parseFloat(getComputedStyle(el).lineHeight));
    const spacingBtn = page.locator('#btnLineSpacing');
    await spacingBtn.press('Enter');
    const modifiedLh = await academicQuote.evaluate(el => parseFloat(getComputedStyle(el).lineHeight));
    assert.notEqual(initialLh, modifiedLh, 'Line spacing toggle must alter computed line height');

    // Theme controls
    const themeSepia = page.locator('#btnThemeSepia');
    const themeWhite = page.locator('#btnThemeWhite');
    const themeDark = page.locator('#btnThemeDark');

    // Switch to Sepia (Reading)
    await themeSepia.press('Enter');
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'reading');
    assert(await page.evaluate(() => document.body.classList.contains('theme-sepia')));
    assert.deepEqual(await page.evaluate(auditActionContrast, '#mainReadingHeader'), []);
    assert.deepEqual(await page.evaluate(auditActionContrast, '#btn-open-toc'), []);

    // Switch to Dark
    await themeDark.press('Enter');
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');
    assert(await page.evaluate(() => document.body.classList.contains('theme-dark')));
    assert.deepEqual(await page.evaluate(auditActionContrast, '#mainReadingHeader'), []);
    assert.deepEqual(await page.evaluate(auditActionContrast, '#btn-open-toc'), []);

    // Switch to White (Light)
    await themeWhite.press('Enter');
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'light');
    assert(await page.evaluate(() => document.body.classList.contains('theme-white')));
    assert.deepEqual(await page.evaluate(auditActionContrast, '#mainReadingHeader'), []);
    assert.deepEqual(await page.evaluate(auditActionContrast, '#btn-open-toc'), []);

    await page.setViewportSize({ width: 320, height: 800 });
    for (let i = 0; i < 4; i++) await page.locator('#btnFontInc').press('Enter');
    assert.equal(await fontLabel.textContent(), '140%');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Maximum text size must fit the narrow viewport');

    assert.deepEqual(errors, []);
  });

  await testScenario('ds7-quiz-interactions-and-screen-reader-announcements', async ({ page, go, errors }) => {
    await go('study/ds/lecture-7.html');

    // Navigate to quiz
    const quizPill = page.locator('button[data-target="section-quiz"]');
    await quizPill.press('Enter');

    // Verify 16 questions
    const questionCards = page.locator('#quizContainer article');
    assert.equal(await questionCards.count(), 16, 'All 16 questions must be present');

    // First question (id 1, correct option is index 2)
    const q1Correct = page.locator('.quiz-option[data-qid="1"][data-opt="2"]');
    await q1Correct.press('Enter');
    assert.equal(await q1Correct.getAttribute('aria-disabled'), 'true');
    assert.equal(await page.locator('#quizContainer .quiz-feedback').count(), 1);

    const statusText = await page.locator('#quizStatus').textContent();
    assert.match(statusText, /إجابة صحيحة/);
    assert.match(statusText, /1 من 16/);

    const scoreDisplay = await page.locator('#quizScoreDisplay').textContent();
    assert.match(scoreDisplay, /1 \/ 16/);

    // Category filtering
    const categoryBtns = page.locator('.quiz-filter-btn');
    assert.equal(await categoryBtns.count(), 4, 'Must have 4 quiz filter buttons (all, basic, traversal, operations)');
    const traversalFilter = page.locator('button[data-quiz-filter="traversal"]');
    await traversalFilter.press('Enter');
    assert.equal(await traversalFilter.getAttribute('aria-pressed'), 'true');

    // Reset quiz
    const resetBtn = page.locator('#btnResetQuiz');
    await resetBtn.press('Enter');
    assert.equal(await page.locator('#quizContainer .quiz-feedback').count(), 0);
    assert.match(await page.locator('#quizStatus').textContent(), /0 من 16/);
    assert.match(await page.locator('#quizScoreDisplay').textContent(), /0 \/ 16/);

    assert.deepEqual(errors, []);
  });

  await testScenario('ds7-content-diagrams-traversals-and-cpp-parity', async ({ page, go, errors }) => {
    await go('study/ds/lecture-7.html');

    // Verify all 4 traversals exist with LTR bdi markers
    const text = await page.locator('main').textContent();
    assert.match(text, /Pre-order/i);
    assert.match(text, /In-order/i);
    assert.match(text, /Post-order/i);
    assert.match(text, /Level-order/i);

    // Verify C++ sample code block
    const cppCode = await page.locator('#part6 pre code').textContent();
    assert.match(cppCode, /struct\s+Node/);
    assert.match(cppCode, /void\s+printPreorder/);
    assert.match(cppCode, /void\s+printInorder/);
    assert.match(cppCode, /void\s+printPostorder/);
    assert.match(cppCode, /void\s+printLevelOrder/);
    assert.match(cppCode, /void\s+deleteTree/);
    assert.match(cppCode, /deleteTree\(root\);/);

    // Verify memory representation diagram
    const ramDiagram = page.locator('.ram-tree');
    assert.equal(await ramDiagram.count(), 1, 'RAM disassembly diagram must exist');
    assert.match(await ramDiagram.textContent(), /0x1000/);

    // Verify terminology tree diagram
    const termDiagram = page.locator('.diagram-frame.lesson-diagram');
    assert(await termDiagram.count() >= 2, 'Lesson diagrams must be present');

    assert.deepEqual(errors, []);
  });

  await testScenario('ds7-subpath-and-static-packaging', async ({ page, go, errors }) => {
    // Check loading under /Sem2_portal/
    await go('Sem2_portal/study/ds/lecture-7.html');
    assert.equal((await page.locator('h1').textContent()).trim(), 'هيكل بيانات الشجرة (Tree Data Structure)');
    assert.deepEqual(errors, []);
  });
}

async function runStandalone() {
  server = http.createServer((req, res) => {
    const rawPath = req.url.split('?')[0];
    const cleanPath = rawPath.replace(/^\/Sem2_portal\//, '/');
    let target = path.join(root, cleanPath === '/' ? 'index.html' : cleanPath);

    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      target = path.join(target, 'index.html');
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
        '.pdf': 'application/pdf',
        '.svg': 'image/svg+xml'
      })[path.extname(target)] || 'application/octet-stream');
      res.end(bytes);
    });
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/`;
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
  console.log(`\n${results.length - failed.length}/${results.length} lesson ds7 scenarios passed`);
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
