const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const siteRoot = process.env.PORTAL_STATIC_DIR === 'dist' ? path.join(root, 'dist') : root;
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

  const go = async route => {
    await page.goto(new URL(route, base).href, { waitUntil: 'load' });
  };

  try {
    await fn({ page, context, go, errors });
    results.push({ name, passed: true });
    console.log('PASS', name);
  } catch (e) {
    results.push({ name, passed: false, error: e.stack, errors });
    await page.screenshot({ path: path.join(output, 'lesson-cg2-' + name + '.png') }).catch(() => {});
    console.log('FAIL', name, e.message.slice(0, 180));
  } finally {
    await context.close();
  }
}

// Helper to compute contrast ratio between foreground and effective background
async function measureElementContrast(page, target) {
  return page.evaluate((tgt) => {
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
        el = Array.from(document.querySelectorAll('body *:not(script):not(style)')).find(node => node.children.length === 0 && (node.textContent || '').includes(search));
      } else {
        el = document.querySelector(tgt);
      }
    }
    if (!el) return 0;
    const fg = parseRgba(getComputedStyle(el).color);
    const bg = getBg(el);
    const l1 = lum(fg), l2 = lum(bg);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }, target);
}

async function register({ scenario: testScenario }) {
  // Scenario 1: Verify all 4 sections exist, formulas, graphics, and zero external requests
  await testScenario('cg2-retain-all-four-sections-questions-formulas-and-graphics', async ({ page, go, errors }) => {
    await go('study/cg/chapter-2.html');

    assert.equal(errors.length, 0, 'No uncaught page errors on load: ' + errors.join('; '));

    // Verify main page title and header
    const title = await page.title();
    assert(title.includes('Chapter 2') || title.includes('الفصل الثاني'), 'Page title reflects Chapter 2');

    // Verify sections sec1, sec2, sec3, sec4, sec5 exist
    for (let i = 1; i <= 5; i++) {
      const sec = page.locator('#sec' + i);
      assert.equal(await sec.count(), 1, `Section #sec${i} exists in DOM`);
    }

    // Default active section is Part 1 (#sec1)
    assert(await page.locator('#sec1').isVisible(), 'Section 1 is visible by default');

    // Verify SVG graphics in Part 2
    const svgs = page.locator('#sec2 svg');
    assert(await svgs.count() >= 1, 'At least one SVG graphic exists in Part 2');

    // Verify math & formula contents in Part 4 (RGB buffer calculations & Opacity)
    // Switch to Part 4
    await page.locator('[data-target="sec4"]').click();
    assert(await page.locator('#sec4').isVisible(), 'Section 4 is visible after tab switch');

    const sec4Text = await page.locator('#sec4').innerText();
    assert(sec4Text.includes('1280') && sec4Text.includes('1024'), 'Resolution 1280x1024 formula preserved');
    assert(sec4Text.includes('16,777,216') || sec4Text.includes('16M'), '16M colors / 2^24 preserved');
    assert(sec4Text.includes('350') && sec4Text.includes('780'), 'Visible spectrum wavelengths 350-780nm preserved');
    assert(sec4Text.includes('Opacity') || sec4Text.includes('الشفافية'), 'Opacity / Transparency preserved');
  });

  // Scenario 2: Verify question bank has all 48 questions with exact IDs and ammiya feedback
  await testScenario('cg2-questions-preservation-identities-and-ammiya', async ({ page, go }) => {
    await go('study/cg/chapter-2.html');

    // Inspect window.QUIZ_QUESTIONS or page question bank
    const questions = await page.evaluate(() => {
      return window.QUIZ_QUESTIONS || [];
    });

    assert.equal(questions.length, 48, 'Must have exactly 48 authored questions');

    // Verify section distribution: sec1: 11, sec2: 12, sec3: 12, sec4: 13
    const p1Count = questions.filter(q => q.section === 'sec1').length;
    const p2Count = questions.filter(q => q.section === 'sec2').length;
    const p3Count = questions.filter(q => q.section === 'sec3').length;
    const p4Count = questions.filter(q => q.section === 'sec4').length;

    assert.equal(p1Count, 11, 'Part 1 must have 11 questions');
    assert.equal(p2Count, 12, 'Part 2 must have 12 questions');
    assert.equal(p3Count, 12, 'Part 3 must have 12 questions');
    assert.equal(p4Count, 13, 'Part 4 must have 13 questions');

    // Verify first and last IDs and that all have Egyptian Arabic explanations
    assert.equal(questions[0].id, 'c2_p1_mcq1', 'First question ID is c2_p1_mcq1');
    assert.equal(questions[47].id, 'c2_p4_tf5', 'Last question ID is c2_p4_tf5');

    for (const q of questions) {
      assert(q.ammiya && q.ammiya.length > 5, `Question ${q.id} must have authored Egyptian Arabic explanation`);
      assert(Array.isArray(q.options) && q.options.length >= 2, `Question ${q.id} must have options array`);
      assert(typeof q.correct === 'number', `Question ${q.id} must have numeric correct index`);
    }
  });

  // Scenario 3: Interactive practice, answering questions, and reset
  await testScenario('cg2-interactive-quiz-practice-and-reset', async ({ page, go }) => {
    await go('study/cg/chapter-2.html');

    // Part 1 quiz container
    const sec1Quiz = page.locator('#quiz-sec1');
    assert.equal(await sec1Quiz.count(), 1, '#quiz-sec1 container exists');

    // Click an option in the first question
    const firstOption = page.locator('#quiz-sec1 .quiz-option-btn').first();
    await firstOption.click();

    // Verify explanation box appears
    const expBox = page.locator('#quiz-sec1 .quiz-explanation');
    assert(await expBox.count() >= 1, 'Explanation box is displayed after answering');
    assert(await expBox.first().isVisible(), 'Explanation is visible');

    // Switch to section 5 (Comprehensive quiz bank)
    await page.locator('[data-target="sec5"]').click();
    assert(await page.locator('#sec5').isVisible(), 'Section 5 (Comprehensive Quiz) is visible');

    // Check all 48 question cards in #quiz-all
    const allCards = page.locator('#quiz-all .quiz-card');
    assert.equal(await allCards.count(), 48, '#quiz-all renders all 48 question cards');

    // Reset button
    const resetBtn = page.locator('#btnResetAllQuizzes');
    await resetBtn.click();

    // After reset, no explanation should be visible
    const remainingExp = page.locator('#quiz-all .quiz-explanation');
    assert.equal(await remainingExp.count(), 0, 'Resetting clears all answer explanations');
  });

  // Scenario 4: Reading layout, theme switching, contrast and BiDi
  await testScenario('cg2-reading-layout-theme-contrast-and-bidi', async ({ page, go }) => {
    await go('study/cg/chapter-2.html');

    // Check BiDi: document body is rtl, en-block / math-box are ltr
    const bodyDir = await page.evaluate(() => document.documentElement.dir || document.body.dir);
    assert.equal(bodyDir, 'rtl', 'Document direction must be RTL');

    const ltrBlocks = page.locator('.en-block, .slide-quote, .math-box');
    assert(await ltrBlocks.count() >= 4, 'LTR blocks exist for English quotes/math');
    const firstLtrDir = await ltrBlocks.first().evaluate(el => getComputedStyle(el).direction);
    assert.equal(firstLtrDir, 'ltr', 'English/Math blocks must have LTR direction');

    // Theme toggles
    const btnLight = page.locator('#btnThemeWhite, #btnLightMode');
    const btnDark = page.locator('#btnThemeDark, #btnDarkMode');
    const btnReading = page.locator('#btnThemeSepia, #btnReadingMode');

    // Test Dark mode
    await btnDark.first().click();
    let darkContrast = await measureElementContrast(page, 'h2');
    assert(darkContrast >= 4.5, `Dark mode heading contrast must be >= 4.5 (got ${darkContrast.toFixed(2)})`);

    // Test Reading mode
    await btnReading.first().click();
    let readingContrast = await measureElementContrast(page, 'h2');
    assert(readingContrast >= 4.5, `Reading mode heading contrast must be >= 4.5 (got ${readingContrast.toFixed(2)})`);

    // Test Light mode
    await btnLight.first().click();
    let lightContrast = await measureElementContrast(page, 'h2');
    assert(lightContrast >= 4.5, `Light mode heading contrast must be >= 4.5 (got ${lightContrast.toFixed(2)})`);

    // Font scale
    const btnFontInc = page.locator('#btnFontInc');
    const btnFontDec = page.locator('#btnFontDec');
    if (await btnFontInc.count() > 0) {
      await btnFontInc.click();
      await btnFontDec.click();
    }
  });

  // Scenario 5: Responsive mobile viewports (390px and 320px) without horizontal overflow
  await testScenario('cg2-mobile-responsive-and-accessibility', async ({ page, go }) => {
    // Test 390px width
    await page.setViewportSize({ width: 390, height: 844 });
    await go('study/cg/chapter-2.html');

    let scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    let clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    assert(scrollWidth <= clientWidth + 2, `No horizontal overflow at 390px (scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth})`);

    // Test 320px narrow width
    await page.setViewportSize({ width: 320, height: 568 });
    await go('study/cg/chapter-2.html');

    scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    assert(scrollWidth <= clientWidth + 2, `No horizontal overflow at 320px (scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth})`);
  });

  await testScenario('cg2-footer-navigation-and-course-link', async ({ page, go, errors }) => {
    await go('study/cg/chapter-2.html');
    const courseLink = page.locator('.study-portal-bar nav a');
    const next = page.locator('#sec1').getByRole('button', { name: /انتقل للجزء الثاني/ });
    await next.press('Enter');
    assert(await page.locator('#sec2').isVisible(), 'Footer Next opens Part 2');
    const previous = page.locator('#sec2').getByRole('button', { name: /الجزء الأول/ });
    await previous.press('Enter');
    assert(await page.locator('#sec1').isVisible(), 'Footer Previous opens Part 1');
    assert.deepEqual(errors, [], 'Footer navigation reports no script errors');
    assert.equal(new URL(await courseLink.evaluate(link => link.href)).searchParams.get('id'), 'computer-graphics');
  });

  await testScenario('cg2-mobile-table-scroll-stays-inside-lesson', async ({ page, go }) => {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 568 });
      await go('study/cg/chapter-2.html');
      await page.locator('.tab-btn[data-target="sec3"]').press('Enter');
      const table = page.locator('#sec3 table');
      const scroller = table.locator('..');
      await scroller.focus();
      const start = await scroller.evaluate(el => el.scrollLeft);
      await page.keyboard.press('ArrowLeft');
      await page.waitForFunction(initial => document.activeElement.scrollLeft < initial, start, { timeout: 1500 });
      assert.equal(await page.evaluate(() => window.scrollX), 0, `At ${width}px the document must not scroll sideways`);
    }
  }, { reducedMotion: 'reduce' });

  await testScenario('cg2-mobile-header-course-link-has-hit-area', async ({ page, go }) => {
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 568 });
      await go('study/cg/chapter-2.html');
      const link = page.locator('#mainReadingHeader').getByRole('link', { name: /الرجوع إلى صفحة مقرر رسوميات الحاسب/ });
      const area = await link.boundingBox();
      assert(area?.width >= 40 && area.height >= 40, `Header link must be usable at ${width}px`);
      await link.click({ trial: true });
    }
  });

  await testScenario('cg2-quiz-deep-links', async ({ page, go }) => {
    for (const route of ['study/cg/chapter-2.html', '/study/cg/chapter-2.html']) {
      await go(route + '#sec5');
      assert(await page.locator('#quiz-all').isVisible(), 'Section fragment opens the quiz');
      await go(route + '#quiz-all');
      await page.locator('#quiz-all').waitFor({ state: 'visible' });
      assert(!(await page.locator('#sec1').isVisible()), 'Deep links only show the active section');
    }
  });

  await testScenario('cg2-keyboard-feedback-and-contrast', async ({ page, go }) => {
    await go('study/cg/chapter-2.html');
    const card = page.locator('#quiz-sec1 .quiz-card').first();
    const firstOption = card.getByRole('button').first();
    await firstOption.press('Space');
    assert(await firstOption.evaluate(button => button === document.activeElement), 'Answer retains keyboard focus');
    const liveStatus = page.locator('[role="status"]').filter({ hasText: /إجابة/ });
    assert.equal(await liveStatus.count(), 1, 'An answer updates a live status');

    await page.locator('#btnThemeDark').click();
    const wrongOption = card.getByRole('button').nth(3);
    await wrongOption.press('Enter');
    for (const status of ['incorrect', 'correct']) {
      const option = await measureElementContrast(page, '#quiz-sec1 .opt-' + status);
      assert(option >= 4.5, `Dark mode ${status} option contrast must be >= 4.5 (got ${option.toFixed(2)})`);
      await card.locator('.opt-' + status).press('Enter');
      const feedback = await measureElementContrast(page, '#quiz-sec1 .status-' + status);
      assert(feedback >= 4.5, `Dark mode ${status} feedback contrast must be >= 4.5 (got ${feedback.toFixed(2)})`);
    }
  });

  await testScenario('cg2-mobile-font-controls', async ({ page, go }) => {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await go('study/cg/chapter-2.html');
      const paragraph = page.locator('#sec1 p.ar-block').first();
      const readSize = () => paragraph.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
      const initialSize = await readSize();
      await page.locator('#btnFontInc').click();
      assert((await readSize()) > initialSize, `A+ enlarges the reading text at ${width}px`);
      await page.locator('#btnFontDec').click();
      assert.equal(await readSize(), initialSize, `A− restores the reading text at ${width}px`);
    }
  });

  await testScenario('cg2-reduced-motion-section-navigation', async ({ page, go }) => {
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 568 });
      await go('study/cg/chapter-2.html');
      const control = page.locator('.tabs-nav [data-target="sec2"]');
      const heading = await control.evaluate(button => {
        button.focus();
        button.click();
        const target = document.querySelector('#sec2 h2');
        const rect = target.getBoundingClientRect();
        return {
          focused: target === document.activeElement,
          unobscured: rect.top >= document.querySelector('#mainReadingHeader').getBoundingClientRect().bottom,
          onScreen: rect.bottom <= window.innerHeight
        };
      });
      assert.deepEqual(heading, { focused: true, unobscured: true, onScreen: true },
        `The selected section receives focus and is visible immediately at ${width}px`);
    }
  }, { reducedMotion: 'reduce' });

  await testScenario('cg2-readable-diagram-and-bidi-score', async ({ page, go }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await go('study/cg/chapter-2.html');
    const badge = page.locator('#scoreBadge');
    assert.equal(await badge.evaluate(el => getComputedStyle(el).direction), 'ltr');
    const englishHeading = page.locator('#sec1 h2 :is(bdi, [dir="ltr"])').last();
    assert.equal(await englishHeading.innerText(), '(Graphics System Architecture & API Functions)');

    await page.locator('.tab-btn[data-target="sec2"]').press('Enter');
    const caption = page.locator('#sec2 figcaption').filter({ hasText: 'Non-Simple Polygon' });
    assert(await caption.isVisible(), 'The diagram label is visible as a caption at 320px');
    assert((await caption.evaluate(el => parseFloat(getComputedStyle(el).fontSize))) >= 14);
  });

  await testScenario('cg2-navigation-and-content-contrast-in-all-themes', async ({ page, go }) => {
    await go('study/cg/chapter-2.html');
    for (const theme of ['light', 'dark', 'reading']) {
      await page.locator('#study-shell-theme').selectOption(theme);
      assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
      await page.locator('.tab-btn[data-target="sec4"]').press('Enter');
      for (const target of ['#sec4 [data-section-link="sec5"]', '#scoreBadge', '#sec4 .math-expr']) {
        const ratio = await measureElementContrast(page, target);
        assert(ratio >= 4.5, `${theme} contrast for ${target} was ${ratio.toFixed(2)}:1`);
      }
    }
  });

  // Visual verification and screenshot captures across modes and viewports
  await testScenario('cg2-visual-verification-and-screenshots', async ({ page, go }) => {
    const shotDir = path.join(root, 'test-results');
    fs.mkdirSync(shotDir, { recursive: true });

    // 1. Desktop Light Mode (1440x900)
    await page.setViewportSize({ width: 1440, height: 900 });
    await go('study/cg/chapter-2.html');
    await page.locator('#btnThemeWhite').click();
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(shotDir, 'cg2-desktop-light.png'), fullPage: false });

    // 2. Desktop Dark Mode (1440x900)
    await page.locator('#btnThemeDark').click();
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(shotDir, 'cg2-desktop-dark.png'), fullPage: false });

    // 3. Desktop Reading Mode (1440x900)
    await page.locator('#btnThemeSepia').click();
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(shotDir, 'cg2-desktop-reading.png'), fullPage: false });

    // 4. Mobile Light Mode (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#btnThemeWhite').click();
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(shotDir, 'cg2-mobile-light.png'), fullPage: false });

    // 5. Mobile Dark Mode (390x844)
    await page.locator('#btnThemeDark').click();
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(shotDir, 'cg2-mobile-dark.png'), fullPage: false });

    // 6. Mobile Reading Mode (390x844)
    await page.locator('#btnThemeSepia').click();
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(shotDir, 'cg2-mobile-reading.png'), fullPage: false });
  });
}

async function runStandalone() {
  server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname).replace(/^\/Sem2_portal\//, '/');
    const target = path.resolve(siteRoot, '.' + relative + (relative.endsWith('/') ? 'index.html' : ''));
    if (!target.startsWith(siteRoot + path.sep)) {
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
        '.png': 'image/png'
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
  console.log(`\n${results.length - failed.length}/${results.length} CG Chapter 2 scenarios passed`);
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
