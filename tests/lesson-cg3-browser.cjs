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
    await page.screenshot({ path: path.join(output, 'lesson-cg3-' + name + '.png') }).catch(() => {});
    console.log('FAIL', name, e.message.slice(0, 180));
  } finally {
    await context.close();
  }
}

async function measureSelectorContrast(page, selector) {
  return page.evaluate(sel => {
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
    const fg = parseRgba(el instanceof window.SVGTextElement ? s.fill : (s.webkitTextFillColor || s.color));
    const bg = getBg(el);
    const l1 = lum(fg), l2 = lum(bg);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }, selector);
}

async function register({ scenario: testScenario }) {
  // Scenario 1: Content preservation, 7 sections, 34-vs-28 question audit, provenance handoff, and offline math
  await testScenario('cg3-content-preservation-and-question-audit', async ({ page, go }) => {
    await go('study/cg/chapter-3.html');

    // 1. All 7 sections exist (#sec1..#sec7)
    for (const secId of ['sec1', 'sec2', 'sec3', 'sec4', 'sec5', 'sec6', 'sec7']) {
      assert.equal(await page.locator('#' + secId).count(), 1, `Section #${secId} must exist`);
    }

    // 2. Provenance & handoff note matches Graphics Lecture ID 3 and preserves DDA reference + 34-vs-28 audit
    const provenanceText = await page.locator('#provenanceNote').innerText();
    assert.match(provenanceText, /Lecture 3|المحاضرة 3/, 'Provenance note identifies Lecture ID 3');
    assert.match(provenanceText, /DDA/, 'Provenance note mentions existing DDA material preservation');
    assert.match(provenanceText, /34/, 'Provenance note reports actual 34 authored questions');
    assert.match(provenanceText, /28/, 'Provenance note documents the legacy 28 UI label audit');

    // 3. Audit all 34 authored quiz questions and per-view counts
    const quizData = await page.evaluate(() =>
      Array.isArray(window.QUIZ_QUESTIONS)
        ? window.QUIZ_QUESTIONS.map(q => ({
            id: q.id,
            section: q.section,
            type: q.type,
            qEn: q.qEn || q.question,
            optionsCount: Array.isArray(q.options) ? q.options.length : 0,
            correct: q.correct,
            hasAmmiya: typeof (q.ammiya || q.explanation) === 'string' && (q.ammiya || q.explanation).length > 5
          }))
        : null
    );
    assert(quizData, 'window.QUIZ_QUESTIONS must be defined');
    assert.equal(quizData.length, 34, 'Exactly 34 authored questions in QUIZ_QUESTIONS');
    assert.equal(quizData[0].id, 'q1_1', 'First question ID is q1_1');
    assert.equal(quizData[33].id, 'q6_3', 'Last question ID is q6_3');

    const bySection = {};
    for (const q of quizData) {
      bySection[q.section] = (bySection[q.section] || 0) + 1;
      assert(q.optionsCount >= 2, `Question ${q.id} has >= 2 options`);
      assert(q.correct >= 0 && q.correct < q.optionsCount, `Question ${q.id} has valid correct index`);
      assert(q.hasAmmiya, `Question ${q.id} has Egyptian Arabic explanation`);
    }
    assert.deepEqual(bySection, {
      sec1: 9,
      sec2: 6,
      sec3: 6,
      sec4: 4,
      sec5: 6,
      sec6: 3
    }, 'Per-section question counts match 9 + 6 + 6 + 4 + 6 + 3 = 34');

    // Verify rendered cards in each section container and in #quiz-all
    for (const [secId, expectedCount] of Object.entries(bySection)) {
      const rendered = await page.locator(`#quiz-${secId} article[data-qid]`).count();
      assert.equal(rendered, expectedCount, `#quiz-${secId} renders ${expectedCount} question cards`);
    }
    assert.equal(await page.locator('#quiz-all article[data-qid]').count(), 34, '#quiz-all renders all 34 question cards');
    assert.match(await page.locator('#scoreBadge').innerText(), /^0\s*\/\s*34$/, 'Score badge advertises 0 / 34');
    assert.match(await page.locator('#sec7 h2').innerText(), /34/, 'Section 7 heading advertises 34 questions');

    // Verify AST extractor compatibility for build-question-bank.cjs
    const html = fs.readFileSync(path.join(root, 'study/cg/chapter-3.html'), 'utf8');
    const extracted = extractArrays(html, ['QUIZ_QUESTIONS', 'quizQuestions', 'mcqQuestions']);
    assert.equal(extracted.length, 34, 'Question bank AST extractor finds all 34 questions');

    // 4. Verify all 5 pedagogical SVGs and semantic math formulas exist without unparsed TeX delimiters
    for (const svgId of ['screenCoordSvg', 'jaggiesSvg', 'd1d2Svg', 'examplePlotSvg', 'customSolverSvg']) {
      assert.equal(await page.locator('#' + svgId).count(), 1, `SVG #${svgId} must exist`);
    }
    const bodyText = await page.locator('main').innerText();
    assert(!bodyText.includes('$$'), 'No unparsed $$ TeX delimiters in rendered main content');
    assert(!bodyText.includes('\\frac') && !bodyText.includes('\\Delta'), 'No raw LaTeX commands in rendered main content');
    assert((await page.locator('[role="math"]').count()) >= 15, 'Formulas rendered with semantic role="math"');
  });

  // Scenario 2: Interactive widgets & Bresenham solver boundary cases
  await testScenario('cg3-interactive-widgets-and-solver-boundaries', async ({ page, go }) => {
    await go('study/cg/chapter-3.html');

    // 1. Interactive Screen Coordinate Grid (#screenCoordSvg) click & keyboard
    assert.equal(await page.locator('#coordReadout').innerText(), 'Pixel: (Col X = 2, Scan Line Y = 1)');
    const cell43 = page.locator('#screenCoordSvg .coord-pixel-cell[data-col="4"][data-scan="3"]');
    await cell43.click();
    assert.equal(await page.locator('#coordReadout').innerText(), 'Pixel: (Col X = 4, Scan Line Y = 3)');
    assert.equal(await page.locator('#screenCoordSvg .coord-pixel-cell[data-col="4"][data-scan="3"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#screenCoordSvg .coord-pixel-cell[data-col="2"][data-scan="1"]').getAttribute('aria-pressed'), 'false');

    // Keyboard activation (Enter / Space) on another cell
    const cell00 = page.locator('#screenCoordSvg .coord-pixel-cell[data-col="0"][data-scan="0"]');
    await cell00.focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#coordReadout').innerText(), 'Pixel: (Col X = 0, Scan Line Y = 0)');
    assert.equal(await page.locator('#screenCoordSvg .coord-pixel-cell[data-col="0"][data-scan="0"]').getAttribute('aria-pressed'), 'true');

    // 2. Solved Example (20,10)->(30,18) stepper & tracing table
    assert.equal(await page.locator('#exampleTableBody tr').count(), 10, 'Initial solved example shows all 10 steps (k=0..9)');
    assert.equal(await page.locator('#exStepBadge').innerText(), 'كل الخطوات (10/10)');
    // Verify flat-Y steps at k=2 -> (23, 12) and k=7 -> (28, 16)
    const rowK2 = await page.locator('#exampleTableBody tr').nth(2).innerText();
    assert.match(rowK2, /\(23,\s*12\)/, 'Step k=2 plots (23, 12)');
    const rowK7 = await page.locator('#exampleTableBody tr').nth(7).innerText();
    assert.match(rowK7, /\(28,\s*16\)/, 'Step k=7 plots (28, 16)');

    // Step backward with #btnExPrev
    await page.locator('#btnExPrev').click();
    assert.equal(await page.locator('#exampleTableBody tr').count(), 9, '#btnExPrev steps back to 9 rows');
    assert.match(await page.locator('#exStepBadge').innerText(), /k = 8 \(9\/10\)/);

    // Jump to step 1 via setExStep(1) or clicking first row, then step forward with #btnExNext
    await page.locator('#exampleTableBody tr').first().click();
    assert.equal(await page.locator('#exampleTableBody tr').count(), 1, 'Clicking row 0 sets stepper to step 1');
    assert.match(await page.locator('#exStepBadge').innerText(), /k = 0 \(1\/10\)/);
    assert.equal(await page.locator('#examplePlotSvg circle').count(), 2, 'Step 1 plots start point (20,10) + first chosen pixel (21,11)');

    await page.locator('#btnExNext').click();
    assert.equal(await page.locator('#exampleTableBody tr').count(), 2, '#btnExNext advances to 2 rows');
    assert.match(await page.locator('#exStepBadge').innerText(), /k = 1 \(2\/10\)/);

    // Show all steps with #btnExAll
    await page.locator('#btnExAll').click();
    assert.equal(await page.locator('#exampleTableBody tr').count(), 10, '#btnExAll restores all 10 steps');
    assert.equal(await page.locator('#examplePlotSvg circle').count(), 11, 'All 11 pixels plotted from (20,10) to (30,18)');

    // 3. Custom Bresenham Solver (#sec6): default training problem (2,3)->(7,6)
    const getSolverState = () => page.evaluate(() => ({
      summary: document.getElementById('solverSummaryCards').innerText,
      rows: [...document.querySelectorAll('#customSolverTableBody tr')].map(tr =>
        [...tr.querySelectorAll('td')].map(td => td.innerText.trim())
      ),
      plottedCircles: document.querySelectorAll('#customSolverSvg circle').length
    }));

    let state = await getSolverState();
    assert.match(state.summary, /Δx=5,\s*Δy=3/, 'Default training problem has Δx=5, Δy=3');
    assert.match(state.summary, /p0\s*=\s*1/, 'Default training problem has p0 = 1');
    assert.equal(state.rows.length, 5, 'Training problem has 5 steps (k=0..4)');
    assert.deepEqual(
      state.rows.map(r => [r[0], r[1], r[3]]),
      [
        ['0', '1', '(3, 4)'],
        ['1', '-3', '(4, 4)'],
        ['2', '3', '(5, 5)'],
        ['3', '-1', '(6, 5)'],
        ['4', '5', '(7, 6)']
      ],
      'Training problem (2,3)->(7,6) matches exact Bresenham trace'
    );
    assert.equal(state.plottedCircles, 6, '6 plotted pixels for (2,3)->(7,6)');

    // Preset 2: Lecture example (20,10)->(30,18)
    await page.locator('.preset-line-btn[data-preset-line="20,10,30,18"]').click();
    assert.equal(await page.locator('.preset-line-btn[data-preset-line="20,10,30,18"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('.preset-line-btn[data-preset-line="2,3,7,6"]').getAttribute('aria-pressed'), 'false');
    state = await getSolverState();
    assert.match(state.summary, /Δx=10,\s*Δy=8/);
    assert.match(state.summary, /p0\s*=\s*6/);
    assert.equal(state.rows.length, 10);
    assert.equal(state.rows[2][3], '(23, 12)');
    assert.equal(state.rows[7][3], '(28, 16)');
    assert.equal(state.rows[9][3], '(30, 18)');

    // Preset 3: Steep slope m > 1: (1,1)->(5,8) where Δx=4, Δy=7, p0 = 2Δx - Δy = 1
    await page.locator('.preset-line-btn[data-preset-line="1,1,5,8"]').click();
    assert.equal(await page.locator('.preset-line-btn[data-preset-line="1,1,5,8"]').getAttribute('aria-pressed'), 'true');
    state = await getSolverState();
    assert.match(state.summary, /Δx=4,\s*Δy=7/);
    assert.match(state.summary, /ميل حاد/);
    assert.match(state.summary, /p0\s*=\s*1/);
    assert.equal(state.rows.length, 7, 'Steep line steps along fast axis Y (7 steps)');
    assert.deepEqual(
      state.rows.map(r => [r[0], r[1], r[3]]),
      [
        ['0', '1', '(2, 2)'],
        ['1', '-5', '(2, 3)'],
        ['2', '3', '(3, 4)'],
        ['3', '-3', '(3, 5)'],
        ['4', '5', '(4, 6)'],
        ['5', '-1', '(4, 7)'],
        ['6', '7', '(5, 8)']
      ],
      'Steep slope (1,1)->(5,8) swaps X/Y roles accurately'
    );

    // Boundary Case A: Gentle negative slope (-1 < m < 0): (2,6)->(7,3) where Δx=5, Δy=3, sy=-1
    const runCustomInputs = async (x0, y0, x1, y1) => {
      await page.locator('#inpX0').fill(String(x0));
      await page.locator('#inpY0').fill(String(y0));
      await page.locator('#inpX1').fill(String(x1));
      await page.locator('#inpY1').fill(String(y1));
      await page.locator('#btnSolveCustom').click();
      return getSolverState();
    };

    state = await runCustomInputs(2, 6, 7, 3);
    assert.match(state.summary, /ميل سالب/);
    assert.equal(state.rows.length, 5);
    assert.match(state.rows[0][2], /نقص y/, 'Negative slope decision text explicitly states decrementing y');
    assert.deepEqual(
      state.rows.map(r => r[3]),
      ['(3, 5)', '(4, 5)', '(5, 4)', '(6, 4)', '(7, 3)'],
      'Gentle negative slope (2,6)->(7,3) decrements Y accurately'
    );

    // Boundary Case B: Horizontal line (Δy = 0, m = 0): (2,4)->(6,4)
    state = await runCustomInputs(2, 4, 6, 4);
    assert.match(state.summary, /خط أفقي مباشر/);
    assert.deepEqual(
      state.rows.map(r => r[3]),
      ['(3, 4)', '(4, 4)', '(5, 4)', '(6, 4)'],
      'Horizontal line keeps Y constant and increments X'
    );

    // Boundary Case C: Vertical line (Δx = 0, m = ∞): (5,1)->(5,5)
    state = await runCustomInputs(5, 1, 5, 5);
    assert.match(state.summary, /خط رأسي مباشر/);
    assert.deepEqual(
      state.rows.map(r => r[3]),
      ['(5, 2)', '(5, 3)', '(5, 4)', '(5, 5)'],
      'Vertical line keeps X constant and increments Y'
    );

    // Boundary Case D: Identical endpoints (Δx = 0, Δy = 0): (4,4)->(4,4)
    state = await runCustomInputs(4, 4, 4, 4);
    assert.match(state.summary, /Δx=0,\s*Δy=0/);
    assert.match(state.summary, /نقطة واحدة/);
    assert.equal(state.rows.length, 1, 'Identical endpoints render a single summary row instead of leaving stale rows');
    assert.equal(state.rows[0][3], '(4, 4)');
    assert.equal(state.plottedCircles, 1, 'Identical endpoints plot exactly 1 pixel');
  });

  // Scenario 3: Shared reading shell, TOC drawer, font/spacing controls, theme persistence, deep-linking, and quiz sync
  await testScenario('cg3-shared-reading-theme-and-quiz', async ({ page, go }) => {
    await go('study/cg/chapter-3.html#sec5');

    // 1. Deep-linking to #sec5 activates the corresponding tab
    assert.equal(
      await page.locator('.tab-btn[data-section="sec5"]').getAttribute('aria-current'),
      'true',
      'Deep-linking to #sec5 sets aria-current="true" on tab 5'
    );

    // 2. Course back link and study-portal-bar breadcrumb point to Computer Graphics lectures
    const backHref = await page.locator('#cgCourseLink').getAttribute('href');
    assert.match(backHref, /subject\.html\?id=computer-graphics&kind=lectures/, 'Back link targets Computer Graphics lectures');
    assert.match(await page.locator('.study-portal-bar nav').innerText(), /الرسم بالحاسوب/, 'Portal bar breadcrumb shows Computer Graphics');

    // 3. TOC drawer open, focus move, Escape close, and focus restoration
    const openBtn = page.locator('#btn-open-toc');
    const drawer = page.locator('#sidebar-toc');
    assert.equal(await openBtn.getAttribute('aria-expanded'), 'false');
    await openBtn.click();
    assert.equal(await openBtn.getAttribute('aria-expanded'), 'true');
    assert(await drawer.evaluate(el => el.classList.contains('open')), 'TOC drawer opens');

    await page.keyboard.press('Escape');
    assert.equal(await openBtn.getAttribute('aria-expanded'), 'false');
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'btn-open-toc', 'Closing TOC with Escape returns focus to #btn-open-toc');

    // Open TOC and click link to #sec7
    await openBtn.click();
    await page.locator('#sidebar-toc a[href="#sec7"]').click();
    assert.equal(await openBtn.getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('.tab-btn[data-section="sec7"]').getAttribute('aria-current'), 'true');

    // 4. Font scale and line spacing controls persist
    assert.equal(await page.locator('#fontSizeLabel').innerText(), '100%');
    await page.locator('#btnFontInc').click();
    assert.equal(await page.locator('#fontSizeLabel').innerText(), '108%');
    await page.locator('#btnLineSpacing').click();
    assert.match(await page.locator('#btnLineSpacing').innerText(), /تباعد:\s*واسع للتركيز/);

    // 5. Theme switching (light -> dark -> reading) and synchronization with study-shell select
    for (const [btnId, expectedTheme] of [
      ['#btnThemeDark', 'dark'],
      ['#btnThemeSepia', 'reading'],
      ['#btnThemeLight', 'light'],
      ['#btnThemeDark', 'dark']
    ]) {
      await page.locator(btnId).click();
      assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), expectedTheme);
      assert.equal(await page.locator(btnId).getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('#study-shell-theme').inputValue(), expectedTheme);
    }

    // 6. Quiz answering, focus retention, section-to-all synchronization, persistence across reload, and reset
    // Answer q1_1 correctly (correct index = 1) in #quiz-sec1
    const q1CorrectBtn = page.locator('#quiz-sec1 button[data-q-id="q1_1"][data-opt-idx="1"]');
    await q1CorrectBtn.click();
    assert.equal(await q1CorrectBtn.getAttribute('aria-pressed'), 'true');
    assert(await q1CorrectBtn.evaluate(el => el.classList.contains('correct-choice')), 'Correct choice styled');
    assert.equal(
      await page.evaluate(() => document.activeElement?.getAttribute('data-q-id')),
      'q1_1',
      'Focus stays on the clicked quiz option button after re-render'
    );
    assert.match(await page.locator('#quiz-answer-status').innerText(), /إجابة صحيحة/, 'Live region announces correct answer');
    assert.equal(await page.locator('#scoreBadge').innerText(), '1 / 34');

    // Verify mirrored card in #quiz-all also reflects the answer
    const q1AllBtn = page.locator('#quiz-all button[data-q-id="q1_1"][data-opt-idx="1"]');
    assert.equal(await q1AllBtn.getAttribute('aria-pressed'), 'true', 'Unified #quiz-all mirrors section answer');

    // Answer q1_2 with wrong option (index 0; correct is 1) in #quiz-all
    const q2WrongBtn = page.locator('#quiz-all button[data-q-id="q1_2"][data-opt-idx="0"]');
    await q2WrongBtn.click();
    assert(await q2WrongBtn.evaluate(el => el.classList.contains('incorrect-choice')), 'Incorrect choice styled');
    assert.equal(await page.locator('#scoreBadge').innerText(), '1 / 34', 'Wrong answer does not increment score');
    assert.equal(await page.locator('#globalQuizProgress').getAttribute('aria-valuenow'), '6', 'Progress bar updates (2/34 ≈ 6%)');

    // Reload page and verify theme, font scale, and quiz answers persist
    await page.reload({ waitUntil: 'load' });
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark', 'Dark theme persists across reload');
    assert.equal(await page.locator('#fontSizeLabel').innerText(), '108%', 'Font scale persists across reload');
    assert.equal(await page.locator('#scoreBadge').innerText(), '1 / 34', 'Quiz score persists across reload');
    assert.equal(await page.locator('#quiz-sec1 button[data-q-id="q1_1"][data-opt-idx="1"]').getAttribute('aria-pressed'), 'true');

    // Reset all quizzes
    await page.locator('#btnResetAllQuizzes').click();
    assert.equal(await page.locator('#scoreBadge').innerText(), '0 / 34', 'Reset clears score to 0 / 34');
    assert.equal(await page.locator('#globalQuizProgress').getAttribute('aria-valuenow'), '0');
  });

  // Scenario 4: WCAG 2.2 AA contrast, responsive viewports (320/390/1440), 200% zoom, reduced motion, and visual screenshots
  await testScenario('cg3-wcag-contrast-responsive-and-screenshots', async ({ page, context, go }) => {
    await go('study/cg/chapter-3.html');

    // Trigger both correct and incorrect quiz states so feedback contrast is audited too
    await page.locator('#quiz-sec1 button[data-q-id="q1_1"][data-opt-idx="1"]').click();
    await page.locator('#quiz-sec1 button[data-q-id="q1_2"][data-opt-idx="0"]').click();

    const contrastSelectors = [
      'main h2',
      'main p',
      '.slide-quote p',
      '.math-box .math-formula',
      '#provenanceNote p',
      '#coordReadout',
      '#exStepBadge',
      '#btnExAll',
      '#btnSolveCustom',
      '.preset-line-btn[aria-pressed="true"]',
      '.preset-line-btn[aria-pressed="false"]',
      '.tab-btn.active',
      '.tab-btn:not(.active)',
      '#btnThemeLight',
      '#btnThemeDark',
      '#btnThemeSepia',
      '#scoreBadge',
      '#screenCoordSvg text',
      '#jaggiesSvg text',
      '#d1d2Svg text',
      '#examplePlotSvg text',
      '#customSolverSvg text',
      '#sec1-q1_1 .quiz-opt-btn.correct-choice',
      '#sec1-q1_2 .quiz-opt-btn.incorrect-choice',
      '#sec1-q1_1 .cg-text-emerald',
      '#sec1-q1_2 .cg-text-danger'
    ];

    for (const [themeName, btnSelector] of [
      ['light', '#btnThemeLight'],
      ['dark', '#btnThemeDark'],
      ['reading', '#btnThemeSepia']
    ]) {
      await page.locator(btnSelector).click();
      for (const sel of contrastSelectors) {
        const ratio = await measureSelectorContrast(page, sel);
        const minRatio = sel.includes('h2') ? 3.0 : 4.5;
        assert(
          ratio >= minRatio,
          `WCAG contrast for "${sel}" in ${themeName} theme must be >= ${minRatio}:1 (got ${ratio.toFixed(2)}:1)`
        );
      }

      // Desktop screenshot (1440x900) from top of page
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: path.join(output, `cg3-desktop-1440-${themeName}.png`),
        fullPage: false
      });

      // Mobile screenshot (390x844) from top of page
      await page.setViewportSize({ width: 390, height: 844 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: path.join(output, `cg3-mobile-390-${themeName}.png`),
        fullPage: false
      });
    }

    // Check zero page-level horizontal overflow across 320px, 390px, and 1440px
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth - document.documentElement.clientWidth;
      });
      assert(overflow <= 1, `No page-level horizontal overflow at ${width}px (delta=${overflow})`);
    }

    // Check 200% zoom simulation (720px viewport with --font-scale: 1.35)
    await page.setViewportSize({ width: 720, height: 900 });
    await page.evaluate(() => document.documentElement.style.setProperty('--font-scale', '1.35'));
    const zoomOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    assert(zoomOverflow <= 1, `No page-level horizontal overflow at 200% zoom (delta=${zoomOverflow})`);

    // Check SVG text stays within SVG viewBox bounds (accounting for CTM transforms like rotate(-90))
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const svgId of ['screenCoordSvg', 'jaggiesSvg', 'd1d2Svg', 'examplePlotSvg', 'customSolverSvg']) {
      const boundsOk = await page.evaluate(id => {
        const svg = document.getElementById(id);
        if (!svg) return false;
        const svgRect = svg.getBoundingClientRect();
        return [...svg.querySelectorAll('text')].every(t => {
          const r = t.getBoundingClientRect();
          return (
            r.left >= svgRect.left - 4 &&
            r.top >= svgRect.top - 4 &&
            r.right <= svgRect.right + 4 &&
            r.bottom <= svgRect.bottom + 4
          );
        });
      }, svgId);
      assert(boundsOk, `All <text> labels in #${svgId} fit inside its SVG viewBox`);
    }

    // Check prefers-reduced-motion: reduce collapses transition durations
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const transitionDur = await page.evaluate(() => {
      return getComputedStyle(document.getElementById('sidebar-toc')).transitionDuration;
    });
    assert(
      transitionDur === '0.00001s' || transitionDur === '0s' || parseFloat(transitionDur) <= 0.001,
      `prefers-reduced-motion reduces transition duration (got ${transitionDur})`
    );
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
  console.log(`\n${results.length - failed.length}/${results.length} CG Chapter 3 scenarios passed`);
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

module.exports = { register, measureSelectorContrast };
