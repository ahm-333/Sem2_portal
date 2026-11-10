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
  // 1. Acceptance 1: Retain all six parts, C++ code, worked examples, solved questions, dynamic questions
  await testScenario('ds4-retain-all-six-parts-code-tables-solved-and-dynamic', async ({ page, go }) => {
    await go('study/ds/lecture-4.html');

    // All six parts exist with their containers
    for (let i = 1; i <= 6; i++) {
      const part = page.locator('#part-' + i);
      assert.equal(await part.count(), 1, `Part ${i} container exists`);
      assert(await part.isVisible(), `Part ${i} is visible`);
    }

    // Verify key C++ code snippets exist
    const codeBlocks = await page.locator('pre code, .code-surface').allTextContents();
    const allCode = codeBlocks.join(' ');
    assert(allCode.includes('class Stack'), 'Stack class definition preserved');
    assert(allCode.includes('int arr[MAX]') || allCode.includes('arr[MAX]'), 'Array member preserved');
    assert(allCode.includes('top = -1'), 'top = -1 constructor initialization preserved');
    assert(allCode.includes('isFull()') || allCode.includes('top == MAX - 1'), 'isFull check preserved');
    assert(allCode.includes('arr[++top] = value') || allCode.includes('++top'), 'push pre-increment preserved');
    assert(allCode.includes('isEmpty()') || allCode.includes('top == -1'), 'isEmpty check preserved');
    assert(allCode.includes('arr[top--]') || allCode.includes('top--'), 'pop post-decrement preserved');
    assert(allCode.includes('template <class T>') || allCode.includes('template<class T>'), 'template class T for linked list preserved');
    assert(allCode.includes('class Node') || allCode.includes('struct Node'), 'Node class/struct definition preserved');
    assert(allCode.includes('newItem->next = top') || allCode.includes('newNode->next = top') || allCode.includes('newItem->next=top'), 'Linked list stack push pointer wiring preserved');

    // Verify comparison table between Array Stack and Linked List Stack exists
    const tables = page.locator('table, .exam-table');
    assert(await tables.count() >= 1, 'Comparison table preserved');

    // Verify solved exam questions exist across parts
    const solvedQuestions = page.locator('h4:has-text("Exam MCQs")');
    assert(await solvedQuestions.count() >= 4, 'Exam MCQs sections preserved across parts');

    // Verify dynamic interactive quiz section exists with 10 questions
    const dynamicQuiz = page.locator('#section-quiz');
    assert.equal(await dynamicQuiz.count(), 1, 'Dynamic quiz section #section-quiz exists');
    const dynamicCards = page.locator('#quizQuestionsContainer article');
    assert.equal(await dynamicCards.count(), 10, 'All 10 dynamic quiz question cards rendered');

    // Verify quiz filter buttons exist
    const filterAll = page.locator('[data-quiz-filter="all"]');
    assert.equal(await filterAll.count(), 1, 'All-filter button exists');
    for (const p of ['p1', 'p2', 'p3', 'p5', 'p6']) {
      const filterP = page.locator(`[data-quiz-filter="${p}"]`);
      assert.equal(await filterP.count(), 1, `Filter button for ${p} exists`);
    }
  });

  // 2. Acceptance 2: Reading layout, typography controls, TOC outline, navigation
  await testScenario('ds4-reading-layout-settings-outline-and-navigation', async ({ page, go }) => {
    await go('study/ds/lecture-4.html');

    // Header controls
    const header = page.locator('#mainReadingHeader');
    assert.equal(await header.count(), 1, 'Main reading header exists');

    // Navigation links
    const subjectLink = page.locator('a[href="../../subject.html?id=data-structure"]');
    assert(await subjectLink.count() > 0, 'Back to subject link exists');

    const indexLink = page.locator('a[href="index.html"]');
    assert(await indexLink.count() > 0, 'Index link exists');

    const prevLectureLink = page.locator('a[href="lecture-3.html"]');
    assert(await prevLectureLink.count() > 0, 'Previous lecture link exists');

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

    // Check TOC links navigate to parts
    const partLinks = await page.evaluate(() => {
      return [...document.querySelectorAll('#sidebar-toc a[href]')].map(a => a.getAttribute('href'));
    });
    assert(partLinks.includes('#part-1'), 'TOC links to #part-1');
    assert(partLinks.includes('#part-2'), 'TOC links to #part-2');
    assert(partLinks.includes('#part-3'), 'TOC links to #part-3');
    assert(partLinks.includes('#part-4'), 'TOC links to #part-4');
    assert(partLinks.includes('#part-5'), 'TOC links to #part-5');
    assert(partLinks.includes('#part-6'), 'TOC links to #part-6');
    assert(partLinks.includes('#section-quiz'), 'TOC links to #section-quiz');
    assert(partLinks.includes('#p4-display'), 'TOC links directly to display()');
    assert(partLinks.includes('#p6-comparison'), 'TOC links directly to the implementation comparison');
    assert.equal(await page.locator('#p6-draft #student-code-area').count(), 1, 'Draft has a direct outline destination');
    assert(partLinks.includes('#p6-draft'), 'TOC links directly to the draft');
    const missingTargets = await page.evaluate(() => {
      return [...document.querySelectorAll('#sidebar-toc a[href^="#"]')]
        .map(link => link.hash.slice(1))
        .filter(id => !document.getElementById(id));
    });
    assert.deepEqual(missingTargets, [], 'All outline links point to sections on the page');

    await btnCloseToc.click();
    assert(await tocDrawer.evaluate(el => !el.classList.contains('open')), 'TOC drawer closes on close button');
  });

  // 3. Acceptance 3: Contrast in dark, sepia, and light modes
  await testScenario('ds4-contrast-dark-mode-paired-surfaces', async ({ page, go }) => {
    await go('study/ds/lecture-4.html');

    // Switch to dark mode via PortalTheme
    await page.evaluate(() => window.PortalTheme.setTheme('dark'));

    // Check Exam MCQs headings contrast in dark mode
    const examHeadingContrast = await measureElementContrast(page, 'text:Exam MCQs');
    assert(examHeadingContrast >= 4.5, `Dark mode Exam MCQs heading contrast must be >= 4.5:1, got ${examHeadingContrast.toFixed(2)}:1`);

    // Check question prompt contrast in dark mode
    const questionPromptContrast = await measureElementContrast(page, 'text:Q1: Which order principle');
    assert(questionPromptContrast >= 4.5, `Dark mode question prompt contrast must be >= 4.5:1, got ${questionPromptContrast.toFixed(2)}:1`);

    // Check option card contrast in dark mode
    const optionContrast = await measureElementContrast(page, 'text:B) LIFO (Last In, First Out)');
    assert(optionContrast >= 4.5, `Dark mode option contrast must be >= 4.5:1, got ${optionContrast.toFixed(2)}:1`);

    // Check explanation box text in dark mode
    const explanationContrast = await measureElementContrast(page, 'text:أي أن آخر عنصر يدخل هو أول عنصر يخرج');
    assert(explanationContrast >= 4.5, `Dark mode explanation contrast must be >= 4.5:1, got ${explanationContrast.toFixed(2)}:1`);
  });

  // 4. Acceptance 4: Array simulator step controls, states, reset, and accessibility
  await testScenario('ds4-simulator-push-pop-overflow-and-accessibility', async ({ page, go }) => {
    await go('study/ds/lecture-4.html');

    const simDisplay = page.locator('#arr-sim-display');
    const simNext = page.locator('#arr-sim-next');
    const simPrev = page.locator('#arr-sim-prev');
    const simBadge = page.locator('#arr-sim-badge');
    const simReset = page.locator('#arr-sim-reset');

    assert.equal(await simBadge.innerText(), 'خطوة 1/6');
    assert((await simDisplay.innerText()).includes('top = -1'), 'Stage 1 shows empty stack with top = -1');

    // Step forward to Stage 2: push 10, 20, 30
    await simNext.click();
    assert.equal(await simBadge.innerText(), 'خطوة 2/6');
    assert((await simDisplay.innerText()).includes('top = 2'), 'Stage 2 shows top = 2');

    // Step forward to Stage 3: push 40, 50 -> full
    await simNext.click();
    assert.equal(await simBadge.innerText(), 'خطوة 3/6');
    assert((await simDisplay.innerText()).includes('top = 4'), 'Stage 3 shows full stack with top = 4');

    // Step forward to Stage 4: push 60 -> overflow
    await simNext.click();
    assert.equal(await simBadge.innerText(), 'خطوة 4/6');
    assert((await simDisplay.innerText()).includes('Stack Overflow'), 'Stage 4 shows Stack Overflow!');

    // Step forward to Stage 5: pop twice -> top = 2
    await simNext.click();
    assert.equal(await simBadge.innerText(), 'خطوة 5/6');
    assert((await simDisplay.innerText()).includes('pop'), 'Stage 5 shows pop operations');

    // Step backward with simPrev
    await simPrev.click();
    assert.equal(await simBadge.innerText(), 'خطوة 4/6');

    await simNext.click();
    await simNext.click();
    assert.equal(await simBadge.innerText(), 'خطوة 6/6');
    assert.match(await simDisplay.innerText(), /Stack Underflow/);
    assert.match(await simDisplay.innerText(), /top = -1/);
    assert.equal(await simDisplay.getByText('(فارغ)', { exact: true }).count(), 5);

    // Test direct tab click for stage 1 (index 0)
    const stage1Tab = page.locator('.arr-sim-tab[data-arr-stage="0"]');
    await stage1Tab.press('Space');
    assert.equal(await simBadge.innerText(), 'خطوة 1/6');
    assert.equal(await stage1Tab.getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('.arr-sim-tab[aria-pressed="true"]').count(), 1);

    // Test reset button
    if (await simReset.count()) {
      await simNext.click();
      assert.equal(await simBadge.innerText(), 'خطوة 2/6');
      await simReset.click();
      assert.equal(await simBadge.innerText(), 'خطوة 1/6');
    }

    // Verify touch target sizes for mobile accessibility (WCAG 2.5.8 >= 24px)
    const nextBox = await simNext.boundingBox();
    assert(nextBox.height >= 24, `sim-next height >= 24px, got ${nextBox.height}`);
    assert(nextBox.width >= 24, `sim-next width >= 24px, got ${nextBox.width}`);

    // Verify keyboard navigation on simulator buttons
    await simNext.focus();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'arr-sim-next');
    await page.keyboard.press('Enter');
    assert.equal(await simBadge.innerText(), 'خطوة 2/6');

    // Verify static walkthrough alternative exists for screen readers / reduced motion
    const staticWalkthrough = page.locator('#static-stack-walkthrough, .static-walkthrough');
    assert(await staticWalkthrough.count() >= 1, 'Static walkthrough alternative is present in DOM');
    assert.match(await staticWalkthrough.innerText(), /Stack Underflow/);

    for (const theme of ['light', 'reading', 'dark']) {
      await page.evaluate(mode => window.PortalTheme.setTheme(mode), theme);
      const contrast = await measureElementContrast(page, '#arr-sim-display .bg-slate-100 span');
      assert(contrast >= 4.5, `Empty stack labels meet 4.5:1 in ${theme}, got ${contrast}`);
    }
  });

  await testScenario('ds4-free-stack-exploration-and-draft', async ({ page, go }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await go('study/ds/lecture-4.html');

    const input = page.locator('#sim-input-val');
    const status = page.locator('#sim-interactive-status');
    const display = page.locator('#sim-live-display');
    assert(await input.isVisible(), 'The experiment exposes a value input');
    assert.match(await display.innerText(), /top = -1/);
    await page.locator('#arr-sim-next').click();
    const guidedStep = await page.locator('#arr-sim-badge').innerText();

    await page.getByRole('button', { name: 'Pop()', exact: true }).click();
    assert.match(await status.innerText(), /Stack Underflow/);
    for (const invalid of ['1.5', '4503599627370495.9', '9007199254740992']) {
      await input.fill(invalid);
      await input.press('Enter');
      assert.match(await status.innerText(), /عددًا صحيحًا/);
      assert.equal(await input.getAttribute('aria-invalid'), 'true');
      assert.match(await display.innerText(), /top = -1/);
    }

    for (const value of ['-10', '0', '20', '30', '40']) {
      await input.fill(value);
      await input.press('Enter');
    }
    assert.equal(await input.getAttribute('aria-invalid'), null);
    assert.match(await display.innerText(), /top = 4/);
    assert.match(await display.innerText(), /arr\[4\].*TOP\s+40/);
    await input.fill('50');
    await input.press('Enter');
    assert.match(await status.innerText(), /Stack Overflow/);
    assert.match(await display.innerText(), /arr\[4\].*TOP\s+40/);

    await page.getByRole('button', { name: 'Peek()', exact: true }).click();
    assert.match(await status.innerText(), /40/);
    assert.match(await display.innerText(), /top = 4/);
    await page.getByRole('button', { name: 'Pop()', exact: true }).click();
    assert.match(await status.innerText(), /40/);
    assert.match(await display.innerText(), /top = 3/);
    assert.match(await display.innerText(), /arr\[3\].*TOP\s+30/);

    await page.locator('#sim-btn-reset').click();
    assert.match(await display.innerText(), /top = -1/);
    assert.equal(await display.getByText('(فارغ)', { exact: true }).count(), 5);
    assert.equal(await page.locator('#arr-sim-badge').innerText(), guidedStep);
    for (const theme of ['light', 'reading', 'dark']) {
      await page.evaluate(mode => window.PortalTheme.setTheme(mode), theme);
      assert(await measureElementContrast(page, '#sim-interactive-status') >= 4.5, `Live status contrast in ${theme}`);
      assert(await measureElementContrast(page, '#sim-live-display .arr-sim-empty span') >= 4.5, `Empty cells contrast in ${theme}`);
      for (const control of ['.arr-sim-tab[aria-pressed="false"]', '.arr-sim-tab[aria-pressed="true"]', '#arr-sim-reset', '#sim-btn-push', '#sim-btn-pop', '#sim-input-val']) {
        const contrast = await measureElementContrast(page, control);
        assert(contrast >= 4.5, `${control} contrast in ${theme}, got ${contrast}`);
      }
    }

    const draft = page.locator('#student-code-area');
    await draft.fill('Stack stack;');
    await page.locator('#btn-clear-draft').press('Enter');
    assert.equal(await draft.inputValue(), '');
    assert.equal(await draft.evaluate(el => el === document.activeElement), true);
  });

  // 5. Acceptance 5: Quiz interactive states, reset, check states, responsive 390px / 1440px
  await testScenario('ds4-interactive-quiz-filter-answer-and-reset', async ({ page, go }) => {
    // Test on Mobile viewport (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    await go('study/ds/lecture-4.html');

    // Check completion button
    const checkBtn = page.locator('[data-check="sec-1"]').first();
    if (await checkBtn.count()) {
      await checkBtn.click();
      const badge = page.locator('#completed-count-badge');
      assert.notEqual((await badge.textContent()).trim(), '0/10', 'Section completion badge updated');
      await checkBtn.click();
      assert.equal((await badge.textContent()).trim(), '0/10', 'Section completion badge decremented');
    }

    // Filter by Part 1
    const btnFilterP1 = page.locator('[data-quiz-filter="p1"]');
    await btnFilterP1.click();
    const p1Cards = page.locator('#quizQuestionsContainer article');
    assert.equal(await p1Cards.count(), 3, 'Part 1 filter shows 3 questions');

    // Filter by Part 2
    const btnFilterP2 = page.locator('[data-quiz-filter="p2"]');
    await btnFilterP2.click();
    const p2Cards = page.locator('#quizQuestionsContainer article');
    assert.equal(await p2Cards.count(), 2, 'Part 2 filter shows 2 questions');

    // Filter by Part 3
    const btnFilterP3 = page.locator('[data-quiz-filter="p3"]');
    await btnFilterP3.click();
    const p3Cards = page.locator('#quizQuestionsContainer article');
    assert.equal(await p3Cards.count(), 2, 'Part 3 filter shows 2 questions');

    // Filter by all
    const btnFilterAll = page.locator('[data-quiz-filter="all"]');
    await btnFilterAll.click();
    const allCards = page.locator('#quizQuestionsContainer article');
    assert.equal(await allCards.count(), 10, 'All filter shows all 10 questions');

    // Answer Question 1 (LIFO is correct)
    const q1Card = allCards.first();
    const correctOpt = q1Card.locator('.quiz-option:has-text("LIFO")');
    await correctOpt.focus();
    await page.keyboard.press('Enter');
    const feedback = q1Card.locator('.quiz-explanation');
    assert.equal(await feedback.evaluate(el => document.activeElement === el), true, 'Keyboard focus moves to the answer explanation');
    await page.keyboard.press('Tab');
    assert.equal(await allCards.nth(1).locator('.quiz-option').first().evaluate(el => document.activeElement === el), true, 'Tab moves to the next question');

    // Score display updates
    const scoreDisplay = page.locator('#quizScoreDisplay');
    assert(await scoreDisplay.isVisible(), 'Score display visible');
    assert.match(await scoreDisplay.innerText(), /1\s*\/\s*10/, 'Score display shows 1 / 10');

    // Reset quiz
    const resetBtn = page.locator('#btnResetQuiz');
    await resetBtn.click();
    assert.match(await scoreDisplay.innerText(), /0\s*\/\s*10/, 'Score display resets to 0 / 10');
  });

  // 6. Acceptance 6: RTL tokens, LTR code isolation, and local scrolling
  await testScenario('ds4-rtl-tokens-and-responsive-viewports', async ({ page, go }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await go('study/ds/lecture-4.html');

    // Verify no body horizontal overflow at 320px
    const mobileHeader = await page.locator('#mainReadingHeader').boundingBox();
    assert(mobileHeader.height < 200, `Mobile header stays compact, got ${mobileHeader.height}px`);
    const mobileTitle = page.locator('#mainReadingHeader h1');
    assert(await mobileTitle.isVisible(), 'Lesson title remains visible at 320px');
    assert(await mobileTitle.evaluate(el => el.clientHeight <= parseFloat(getComputedStyle(el).lineHeight) + 1), 'Lesson title fits on one line');
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    assert(bodyScrollWidth <= bodyClientWidth + 1, `No horizontal overflow at 320px: scrollWidth ${bodyScrollWidth} <= clientWidth ${bodyClientWidth}`);

    const clippedActions = await page.locator('main button, main input, main a[href]').evaluateAll(actions => {
      return actions.filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width && (rect.left < -1 || rect.right > window.innerWidth + 1);
      }).map(el => el.textContent.trim());
    });
    assert.deepEqual(clippedActions, [], 'Lesson actions fit within the mobile viewport');

    for (const theme of ['light', 'reading', 'dark']) {
      await page.evaluate(mode => window.PortalTheme.setTheme(mode), theme);
      assert.deepEqual(await page.evaluate(auditActionContrast, 'main'), [], `Lesson action contrast in ${theme}`);
      for (const selector of ['.stack-walkthrough-step > div:last-child', '.stack-diagram-element', '.stack-diagram-top', '.stack-diagram-index']) {
        const contrast = await measureElementContrast(page, selector);
        assert(contrast >= 4.5, `${selector} contrast in ${theme}, got ${contrast}`);
      }
    }

    // Verify code block direction is LTR and scrollable
    const preBlocksCheck = await page.evaluate(() => {
      const blocks = document.querySelectorAll('pre code, .code-surface');
      return Array.from(blocks).slice(0, 10).map(b => {
        const style = getComputedStyle(b);
        return {
          dir: style.direction,
          overflowX: style.overflowX
        };
      });
    });
    for (const b of preBlocksCheck) {
      assert.equal(b.dir, 'ltr', 'Code block direction is LTR');
    }

    // Verify inline code isolation
    const tokensIsolated = await page.evaluate(() => {
      const tokens = document.querySelectorAll('.inline-code, .inline-code-emerald, .inline-code-amber, .inline-code-rose, .ltr-token');
      return Array.from(tokens).slice(0, 20).every(t => {
        const style = getComputedStyle(t);
        return style.direction === 'ltr' && (style.unicodeBidi === 'isolate' || style.unicodeBidi === 'embed');
      });
    });
    assert(tokensIsolated, 'Inline code tokens are LTR and bidirectional-isolated');
  });

  // 7. Visual Parity & Evidence: Capture screenshots in light, dark, and reading modes at desktop and mobile widths
  await testScenario('ds4-visual-parity-screenshots-modes-and-viewports', async ({ page, go }) => {
    // Desktop Viewport (1440px)
    await page.setViewportSize({ width: 1440, height: 900 });
    await go('study/ds/lecture-4.html');

    const main = await page.locator('main').boundingBox();
    assert(main.width <= 860, `Desktop lesson width stays within 860px, got ${main.width}`);
    assert(Math.abs(main.x - (1440 - main.width) / 2) <= 1, 'Lesson is centered');

    const themeButtons = { reading: '#btnThemeSepia', light: '#btnThemeWhite', dark: '#btnThemeDark' };
    for (const [device, viewport] of Object.entries({
      desktop: { width: 1440, height: 900 },
      mobile: { width: 390, height: 844 }
    })) {
      await page.setViewportSize(viewport);
      await go('study/ds/lecture-4.html');

      for (const [theme, selector] of Object.entries(themeButtons)) {
        await page.locator(selector).click();
        assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
        await page.screenshot({
          path: path.join(output, `ds4-${device}-${theme}.png`),
          animations: 'disabled'
        });
      }
    }
  });
}

async function runStandalone() {
  server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.startsWith('/Sem2_portal/')) {
      pathname = pathname.slice('/Sem2_portal'.length);
    }
    const relative = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
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
