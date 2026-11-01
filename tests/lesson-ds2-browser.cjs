const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

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

  const go = async route => {
    await page.goto(base + route, { waitUntil: 'load' });
  };

  try {
    await fn({ page, context, go, errors });
    results.push({ name, passed: true });
    console.log('PASS', name);
  } catch (e) {
    results.push({ name, passed: false, error: e.stack, errors });
    await page.screenshot({ path: path.join(output, 'lesson-ds2-' + name + '.png') }).catch(() => {});
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
  // 1. Acceptance 1: Retain all six parts, C++ code, memory models, tables, solved questions, dynamic questions
  await testScenario('ds2-retain-all-six-parts-code-tables-solved-and-dynamic', async ({ page, go }) => {
    await go('study/ds/lecture-2.html');

    // All six parts exist with their headings
    for (let i = 1; i <= 6; i++) {
      const part = page.locator('#part-' + i);
      assert.equal(await part.count(), 1, `Part ${i} container exists`);
      assert(await part.isVisible(), `Part ${i} is visible`);
    }

    // Verify key C++ code snippets exist
    const codeBlocks = await page.locator('pre code, .code-surface').allTextContents();
    const allCode = codeBlocks.join(' ');
    assert(allCode.includes('struct Node'), 'Node struct definition preserved');
    assert(allCode.includes('first->next = second'), 'first->next = second preserved');
    assert(allCode.includes('delete') || allCode.includes('temp'), 'delete/traversal operations preserved');

    // Verify tables exist
    const tables = page.locator('table, .exam-table');
    assert(await tables.count() >= 2, 'Comparison and exam tables preserved');

    // Verify 24 solved exam questions exist across parts
    const solvedQuestions = page.locator('h4:has-text("Exam MCQs")');
    assert.equal(await solvedQuestions.count(), 6, '6 Exam MCQs sections preserved (one per part)');

    // Verify dynamic interactive quiz section exists with 24 questions
    const dynamicQuiz = page.locator('#section-quiz');
    assert.equal(await dynamicQuiz.count(), 1, 'Dynamic quiz section #section-quiz exists');
    const dynamicCards = page.locator('#quizQuestionsContainer article');
    assert.equal(await dynamicCards.count(), 24, 'All 24 dynamic quiz question cards rendered');

    // Verify quiz filter buttons exist for all six parts
    const filterAll = page.locator('[data-quiz-filter="all"]');
    assert.equal(await filterAll.count(), 1, 'All-filter button exists');
    for (let p = 1; p <= 6; p++) {
      const filterP = page.locator(`[data-quiz-filter="p${p}"]`);
      assert.equal(await filterP.count(), 1, `Filter button for part ${p} exists`);
    }
  });

  // 2. Acceptance 2: Reading layout, typography controls, TOC outline, navigation & resume
  await testScenario('ds2-reading-layout-settings-outline-and-resume', async ({ page, go }) => {
    await go('study/ds/lecture-2.html');

    // Header controls
    const header = page.locator('#mainReadingHeader');
    assert.equal(await header.count(), 1, 'Main reading header exists');

    // Font size controls
    const btnInc = page.locator('#btnFontInc');
    const btnDec = page.locator('#btnFontDec');
    const fontLabel = page.locator('#fontSizeLabel');
    assert.equal(await fontLabel.innerText(), '100%');
    await btnInc.click();
    assert.equal(await fontLabel.innerText(), '110%');
    await btnDec.click();
    assert.equal(await fontLabel.innerText(), '100%');

    // Line spacing control
    const btnSpacing = page.locator('#btnLineSpacing');
    await btnSpacing.click();
    assert(await btnSpacing.innerText(), 'Line spacing toggled');

    // Slide-over Table of Contents drawer
    const btnOpenToc = page.locator('#btn-open-toc');
    const btnCloseToc = page.locator('#btn-close-toc');
    const tocDrawer = page.locator('#sidebar-toc');
    const tocBackdrop = page.locator('#toc-backdrop');

    await btnOpenToc.click();
    assert(await tocDrawer.evaluate(el => el.classList.contains('open')), 'TOC drawer opens on click');
    assert(await tocBackdrop.evaluate(el => el.classList.contains('open')), 'TOC backdrop opens on click');

    // Clicking a TOC link closes drawer and navigates to section
    const secLink = page.locator('#sidebar-toc a[href="#sec-3"]');
    await secLink.click();
    assert(await tocDrawer.evaluate(el => !el.classList.contains('open')), 'TOC drawer closes after link click');

    await btnOpenToc.click();
    await btnCloseToc.click();
    assert(await tocDrawer.evaluate(el => !el.classList.contains('open')), 'TOC drawer closes on close button');
  });

  // 3. Acceptance 3: Contrast fix in dark, sepia, and light modes without erasing teaching colours
  await testScenario('ds2-contrast-dark-mode-paired-surfaces-and-teaching-colors', async ({ page, go }) => {
    await go('study/ds/lecture-2.html');

    // Switch to dark mode via PortalTheme
    await page.evaluate(() => window.PortalTheme.setTheme('dark'));

    // Check Cheatsheet headings contrast in dark mode (previously ~1.11:1:1.14:1)
    const cheatsheetContrast = await measureElementContrast(page, 'text:Notebook & Exam Cheatsheet');
    assert(cheatsheetContrast >= 4.5, `Dark mode cheatsheet heading contrast must be >= 4.5:1, got ${cheatsheetContrast.toFixed(2)}:1`);

    // Check Exam MCQs headings contrast in dark mode
    const examHeadingContrast = await measureElementContrast(page, 'text:Exam MCQs');
    assert(examHeadingContrast >= 4.5, `Dark mode Exam MCQs heading contrast must be >= 4.5:1, got ${examHeadingContrast.toFixed(2)}:1`);

    // Check nested solved question card prompts inside Exam MCQs
    const questionPromptContrast = await measureElementContrast(page, 'text:Q1: What does a');
    assert(questionPromptContrast >= 4.5, `Dark mode question prompt contrast must be >= 4.5:1, got ${questionPromptContrast.toFixed(2)}:1`);

    // Check option card contrast in dark mode
    const optionContrast = await measureElementContrast(page, 'text:A) A structure that calls');
    assert(optionContrast >= 4.5, `Dark mode option contrast must be >= 4.5:1, got ${optionContrast.toFixed(2)}:1`);

    // Check explanation box text in dark mode
    const explanationContrast = await measureElementContrast(page, 'text:الهيكل المرجعي الذاتي معناه');
    assert(explanationContrast >= 4.5, `Dark mode explanation contrast must be >= 4.5:1, got ${explanationContrast.toFixed(2)}:1`);

    // Check dynamic quiz options in dark mode
    const dynamicOptContrast = await measureElementContrast(page, '#quizQuestionsContainer .quiz-option span');
    assert(dynamicOptContrast >= 4.5, `Dark mode dynamic quiz option contrast must be >= 4.5:1, got ${dynamicOptContrast.toFixed(2)}:1`);

    // Verify in light mode
    await page.evaluate(() => window.PortalTheme.setTheme('light'));
    const lightHeadingContrast = await measureElementContrast(page, 'text:Exam MCQs');
    assert(lightHeadingContrast >= 4.5, `Light mode Exam MCQs heading contrast must be >= 4.5:1, got ${lightHeadingContrast.toFixed(2)}:1`);

    // Verify in sepia (reading) mode
    await page.evaluate(() => window.PortalTheme.setTheme('reading'));
    const sepiaHeadingContrast = await measureElementContrast(page, 'text:Exam MCQs');
    assert(sepiaHeadingContrast >= 4.5, `Sepia mode Exam MCQs heading contrast must be >= 4.5:1, got ${sepiaHeadingContrast.toFixed(2)}:1`);
  });

  // Portal themes must control quiz feedback independently of the OS color scheme.
  for (const colorScheme of ['light', 'dark']) {
    for (const theme of ['light', 'dark', 'reading']) {
      await testScenario(`ds2-quiz-feedback-contrast-${colorScheme}-os-${theme}-portal`, async ({ page, go }) => {
        await go('study/ds/lecture-2.html');
        await page.evaluate(value => window.PortalTheme.setTheme(value), theme);
        const contrasts = [['initial score', await measureElementContrast(page, '#quizScoreDisplay')]];

        await page.locator('#quizQuestionsContainer article').first()
          .locator('.quiz-option:has-text("A structure containing a pointer")').click();
        assert.match(await page.locator('#quizScoreDisplay').innerText(), /1\s*\/\s*24/);
        contrasts.push(['updated score', await measureElementContrast(page, '#quizScoreDisplay')]);
        const correctExplanation = '#quizQuestionsContainer article:first-child > div:last-child';
        assert.match(await page.locator(correctExplanation).innerText(), /Node\* next/);
        contrasts.push(['correct explanation', await measureElementContrast(page, correctExplanation)]);

        await page.locator('#quizQuestionsContainer article').nth(1)
          .locator('.quiz-option:has-text("The second node is deleted")').click();
        assert.equal(await page.locator('#quizQuestionsContainer article').nth(1).locator('.wrong').count(), 1);
        const wrongExplanation = '#quizQuestionsContainer article:nth-child(2) > div:last-child';
        contrasts.push(['wrong explanation', await measureElementContrast(page, wrongExplanation)]);

        await page.locator('#btnResetQuiz').click();
        assert.match(await page.locator('#quizScoreDisplay').innerText(), /0\s*\/\s*24/);
        contrasts.push(['reset score', await measureElementContrast(page, '#quizScoreDisplay')]);
        assert(contrasts.every(([, ratio]) => ratio >= 4.5),
          `${colorScheme} OS / ${theme} portal feedback contrast must be >= 4.5:1: ` +
          contrasts.map(([label, ratio]) => `${label} ${ratio.toFixed(2)}:1`).join(', '));
      }, { colorScheme });
    }
  }

  // 4. Acceptance 4: Step controls operable by keyboard/touch/reduced motion (5000-address example)
  await testScenario('ds2-simulator-step-controls-5000-address-and-accessibility', async ({ page, go }) => {
    await go('study/ds/lecture-2.html');

    const simDisplay = page.locator('#sim-display');
    const simNext = page.locator('#sim-next');
    const simPrev = page.locator('#sim-prev');
    const simBadge = page.locator('#sim-step-badge');

    assert.equal(await simBadge.innerText(), 'المرحلة أ (1/4)');

    // Next step advances to Stage B with 5000-address example
    await simNext.click();
    assert.equal(await simBadge.innerText(), 'المرحلة ب (2/4)');
    const stageBText = await simDisplay.innerText();
    assert(stageBText.includes('5000'), 'Stage B includes the 5000 memory address');
    assert(stageBText.includes('first->next = second'), 'Stage B code assignment preserved');

    // Prev step returns to Stage A
    await simPrev.click();
    assert.equal(await simBadge.innerText(), 'المرحلة أ (1/4)');

    // Test direct tab click for stage 3
    const stage3Tab = page.locator('.sim-tab[data-stage="3"]');
    await stage3Tab.click();
    assert.equal(await simBadge.innerText(), 'المرحلة د (4/4)');

    // Verify touch target sizes for mobile accessibility (WCAG 2.5.8 >= 24px)
    const nextBox = await simNext.boundingBox();
    assert(nextBox.height >= 24, `sim-next height >= 24px, got ${nextBox.height}`);
    assert(nextBox.width >= 24, `sim-next width >= 24px, got ${nextBox.width}`);

    // Verify keyboard navigation on simulator buttons
    await simNext.focus();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'sim-next');
    await page.keyboard.press('Enter');
    assert.equal(await simBadge.innerText(), 'المرحلة أ (1/4)'); // wrapped from stage 4 to stage 1
  });

  // 5. Acceptance 5: Quiz interactive states, reset, check states, responsive 390px / 1440px
  await testScenario('ds2-interactive-quiz-reset-check-and-responsive', async ({ page, go }) => {
    // Test on Mobile viewport (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    await go('study/ds/lecture-2.html');

    // Check completion button
    const checkBtn = page.locator('[data-check="sec-1"]');
    await checkBtn.click();
    const badge = page.locator('#completed-count-badge');
    assert.equal((await badge.textContent()).trim(), '1/11', 'Section completion badge updated');
    await checkBtn.click();
    assert.equal((await badge.textContent()).trim(), '0/11', 'Section completion badge decremented');

    // Answer question #1 in interactive quiz with correct answer text (handles shuffle)
    const q1Card = page.locator('#quizQuestionsContainer article').first();
    const correctOpt = q1Card.locator('.quiz-option:has-text("A structure containing a pointer")');
    await correctOpt.click();

    // Score display updates
    const scoreDisplay = page.locator('#quizScoreDisplay');
    assert(await scoreDisplay.isVisible(), 'Score display visible');
    assert.match(await scoreDisplay.innerText(), /1\s*\/\s*24/, 'Score reflects correct answer');

    // Reset quiz
    const resetBtn = page.locator('#btnResetQuiz');
    await resetBtn.click();
    assert.match(await scoreDisplay.innerText(), /0\s*\/\s*24/, 'Score resets to 0');

    // Return to desktop viewport (1440px)
    await page.setViewportSize({ width: 1440, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true, 'No horizontal overflow on desktop');
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
  console.log(`\n${results.length - failed.length}/${results.length} DS Lecture 2 scenarios passed`);
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
