const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const { buildQuestionBank, extractArrays } = require('../tools/build-question-bank.cjs');

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
    await page.screenshot({ path: path.join(output, 'lesson-ds3-' + name + '.png') }).catch(() => {});
    console.log('FAIL', name, e.message.slice(0, 180));
  } finally {
    await context.close();
  }
}

async function register({ scenario: testScenario }) {
  // 1. Content Manifest, Source Preservation & Question Bank Source Identities
  await testScenario('ds3-content-and-bank-preservation', async ({ page, go }) => {
    const ds3Path = path.join(root, 'study/ds/lecture-3.html');
    const html = fs.readFileSync(ds3Path, 'utf8');

    // Verify all 12 authored questions are preserved in quizQuestions
    const questions = extractArrays(html, ['quizQuestions']);
    assert.equal(questions.length, 12, 'All 12 authored questions preserved in quizQuestions');

    // Verify bank build creates exact source identities
    const bank = buildQuestionBank(root);
    const dsQuestions = bank['data-structure']?.filter(q => q.sourceUrl === 'study/ds/lecture-3.html') || [];
    assert.equal(dsQuestions.length, 12, '12 questions extracted from study/ds/lecture-3.html');
    for (let i = 1; i <= 12; i++) {
      const q = dsQuestions.find(item => item.id === `study/ds/lecture-3.html:${i}`);
      assert(q, `Question ID study/ds/lecture-3.html:${i} exists in question bank`);
      assert(q.question && q.options.length >= 3, `Question ${i} has valid prompt and options`);
      assert(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length, `Question ${i} has valid correct answer`);
      assert(q.explanation && q.explanation.length > 10, `Question ${i} has detailed explanation`);
    }

    // Verify key algorithm code snippets are present in HTML
    assert(html.includes('int fact(int num)'), 'factorial function definition preserved');
    assert(html.includes('int rFibNum(int a, int b, int n)'), 'rFibNum function definition preserved');
    assert(html.includes('int largest(const int list[], int lowerIndex, int upperIndex)'), 'largest function definition preserved');
    assert(html.includes('void reversePrint(Node* current)'), 'reversePrint function definition preserved');

    // Verify execution call values and trace order preserved
    assert(html.includes('fact(4)') && html.includes('4 * fact(3)'), 'fact(4) winding trace preserved');
    assert(html.includes('rFibNum(2, 3, 4)') && html.includes('Result: 5 + 3 = 8'), 'rFibNum(2, 3, 4) trace preserved');
    assert(html.includes('largest(list, 0, 3)') && html.includes('{23, 43, 35, 20}'), 'largest array trace preserved');
    assert(html.includes('reversePrint(first)') && html.includes('Screen Output:  20   15   10   5'), 'reversePrint screen output trace preserved');
  });

  // 2. Shared Outline, Settings, and Reading Hierarchy
  await testScenario('ds3-outline-settings-and-hierarchy', async ({ page, go }) => {
    await go('study/ds/lecture-3.html');

    // Check TOC button and drawer
    const openTocBtn = page.locator('#btn-open-toc');
    await openTocBtn.waitFor({ state: 'visible' });
    const tocDrawer = page.locator('#sidebar-toc');
    assert.equal(await tocDrawer.count(), 1, '#sidebar-toc drawer exists');

    // Click to open TOC drawer
    await openTocBtn.click();
    await page.waitForTimeout(100);
    const isOpen = await page.evaluate(() => {
      const el = document.getElementById('sidebar-toc');
      return el.classList.contains('open') || el.getAttribute('aria-hidden') === 'false';
    });
    assert(isOpen, 'TOC drawer opens when #btn-open-toc is clicked');

    // Check outline links exist in drawer
    const tocLinks = await page.evaluate(() => {
      return [...document.querySelectorAll('#sidebar-toc a[href]')].map(a => a.getAttribute('href'));
    });
    assert(tocLinks.includes('#section-part1'), 'Outline links to #section-part1');
    assert(tocLinks.includes('#section-part2'), 'Outline links to #section-part2');
    assert(tocLinks.includes('#section-part3'), 'Outline links to #section-part3');
    assert(tocLinks.includes('#section-summary'), 'Outline links to #section-summary');
    assert(tocLinks.includes('#section-quiz'), 'Outline links to #section-quiz');

    // Close TOC drawer
    const closeTocBtn = page.locator('#btn-close-toc');
    if (await closeTocBtn.count()) {
      await closeTocBtn.click();
      await page.waitForTimeout(100);
    }

    // Verify navigation links
    const subjectLink = page.locator('a[href="../../subject.html?id=data-structure"]');
    assert(await subjectLink.count() > 0, 'Back to subject link exists');

    const indexLink = page.locator('a[href="index.html"]');
    assert(await indexLink.count() > 0, 'Index link exists');

    const prevLectureLink = page.locator('a[href="lecture-2.html"]');
    assert(await prevLectureLink.count() > 0, 'Previous lecture link exists');

    // Verify authored section order
    const sectionIds = await page.evaluate(() => {
      return [...document.querySelectorAll('main > section.chapter-section')].map(s => s.id);
    });
    assert.deepEqual(sectionIds, [
      'section-part1',
      'section-part2',
      'section-part3',
      'section-summary',
      'section-quiz'
    ], 'Authored section order is strictly preserved');
  });

  // 3. Reading Settings: Font scaling, Line Spacing, and Theme Synchronization
  await testScenario('ds3-reading-settings-and-theme-sync', async ({ page, go }) => {
    await go('study/ds/lecture-3.html');

    // Test font scaling
    const initialSize = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--reading-size').trim());
    await page.locator('#btnFontInc').click();
    const zoomedSize = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--reading-size').trim());
    assert.notEqual(initialSize, zoomedSize, 'Font scaling changes --reading-size');

    const fontLabel = await page.locator('#fontSizeLabel').innerText();
    assert.equal(fontLabel.trim(), '110%', 'Font scale label updated to 110%');

    // Test line spacing toggle
    const initialLh = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--reading-lh').trim());
    await page.locator('#btnLineSpacing').click();
    const newLh = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--reading-lh').trim());
    assert.notEqual(initialLh, newLh, 'Line spacing button updates --reading-lh');

    // Test theme switching
    for (const [btnId, expectedThemeClass] of [
      ['#btnThemeSepia', 'theme-sepia'],
      ['#btnThemeWhite', 'theme-light'],
      ['#btnThemeDark', 'theme-dark']
    ]) {
      const btn = page.locator(btnId);
      if (await btn.count()) {
        await btn.click();
        await page.waitForTimeout(100);
        const hasClass = await page.evaluate(cls => document.body.classList.contains(cls), expectedThemeClass);
        assert(hasClass, `Switching theme with ${btnId} applies ${expectedThemeClass}`);
      }
    }
  });

  // 4. RTL token order, LTR code isolation, and local scrolling
  await testScenario('ds3-rtl-tokens-and-local-scroll', async ({ page, go }) => {
    await go('study/ds/lecture-3.html');

    // Ensure all pre code blocks have direction: ltr and local overflow-x auto
    const preBlocksCheck = await page.evaluate(() => {
      const blocks = document.querySelectorAll('pre.code-block');
      return Array.from(blocks).map(b => {
        const style = getComputedStyle(b);
        return {
          dir: style.direction,
          overflowX: style.overflowX
        };
      });
    });
    assert(preBlocksCheck.length >= 3, 'At least 3 code blocks present');
    for (const b of preBlocksCheck) {
      assert.equal(b.dir, 'ltr', 'Code block direction is LTR');
      assert(['auto', 'scroll'].includes(b.overflowX), 'Code block has locally scrollable overflow');
    }

    // Ensure diagram frames have local scroll capability
    const diagramFramesCheck = await page.evaluate(() => {
      const frames = document.querySelectorAll('.diagram-frame');
      return Array.from(frames).map(f => {
        const style = getComputedStyle(f);
        return style.overflowX;
      });
    });
    assert(diagramFramesCheck.length >= 4, 'Diagram frames present for all SVG diagrams');
    for (const overflow of diagramFramesCheck) {
      assert(['auto', 'scroll'].includes(overflow), 'Diagram frame has locally scrollable overflow');
    }

    // Ensure inline code and tokens are isolated
    const tokensIsolated = await page.evaluate(() => {
      const tokens = document.querySelectorAll('.ltr-token, code.inline-code');
      return Array.from(tokens).slice(0, 20).every(t => {
        const style = getComputedStyle(t);
        return style.direction === 'ltr' && (style.unicodeBidi === 'isolate' || style.unicodeBidi === 'embed');
      });
    });
    assert(tokensIsolated, 'LTR tokens and inline code are bidirectional isolated');
  });

  // 5. Accessible WCAG Contrast for Teal/Amber Headings and Rose Inline Tokens
  await testScenario('ds3-contrast-and-typography-all-modes', async ({ page, go }) => {
    await go('study/ds/lecture-3.html');

    const themes = [
      { name: 'light', btn: '#btnThemeWhite', expectedClass: 'theme-light' },
      { name: 'reading', btn: '#btnThemeSepia', expectedClass: 'theme-sepia' },
      { name: 'dark', btn: '#btnThemeDark', expectedClass: 'theme-dark' }
    ];

    for (const t of themes) {
      const btn = page.locator(t.btn);
      if (await btn.count()) {
        await btn.click();
        await page.waitForTimeout(100);

        const contrastResults = await page.evaluate(() => {
          const parse = str => {
            const m = str.match(/[\d.]+/g);
            return m ? m.map(Number) : [0, 0, 0];
          };
          const lum = rgb => {
            const v = rgb.slice(0, 3).map(c => {
              const s = c / 255;
              return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
            });
            return v[0] * 0.2126 + v[1] * 0.7152 + v[2] * 0.0722;
          };
          const ratio = (fgStr, bgStr) => {
            const l1 = lum(parse(fgStr));
            const l2 = lum(parse(bgStr));
            return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          };

          const check = (selector, isLarge = false) => {
            const elements = document.querySelectorAll(selector);
            return Array.from(elements).map(el => {
              const style = getComputedStyle(el);
              const fg = style.color;
              let parent = el.parentElement;
              let bg = 'rgb(255, 255, 255)';
              while (parent) {
                const pBg = getComputedStyle(parent).backgroundColor;
                if (pBg && pBg !== 'rgba(0, 0, 0, 0)' && !pBg.includes('transparent')) {
                  bg = pBg;
                  break;
                }
                parent = parent.parentElement;
              }
              const cr = ratio(fg, bg);
              return {
                text: el.innerText?.slice(0, 30),
                fg,
                bg,
                cr,
                required: isLarge ? 3.0 : 4.5,
                pass: cr >= (isLarge ? 3.0 : 4.5)
              };
            });
          };

          return {
            tealHeadings: check('h4.text-teal-600, h3.text-teal-600, .walkthrough-teal-title', true),
            amberNotes: check('.word-chip span.text-amber-600, .exam-note-amber', false),
            roseTokens: check('code.inline-code, .ltr-token', false)
          };
        });

        for (const item of contrastResults.tealHeadings) {
          assert(item.cr >= item.required, `Teal heading "${item.text}" contrast in ${t.name} is ${item.cr.toFixed(2)}, expected >= ${item.required}`);
        }
        for (const item of contrastResults.amberNotes) {
          assert(item.cr >= item.required, `Amber note "${item.text}" contrast in ${t.name} is ${item.cr.toFixed(2)}, expected >= ${item.required}`);
        }
        for (const item of contrastResults.roseTokens) {
          assert(item.cr >= item.required, `Rose token "${item.text}" contrast in ${t.name} is ${item.cr.toFixed(2)}, expected >= ${item.required}`);
        }
      }
    }
  });

  // 6. Interactive Quiz States: Filter, Answer, Score, and Reset
  await testScenario('ds3-quiz-filter-answer-and-reset', async ({ page, go }) => {
    await go('study/ds/lecture-3.html');

    // Default renders all 12 questions
    const qCountDefault = await page.locator('#quizQuestionsContainer article.reading-card').count();
    assert.equal(qCountDefault, 12, 'Default quiz renders all 12 questions');

    // Filter by Part 1 (p1)
    await page.locator('button[data-quiz-filter="p1"]').click();
    const qCountP1 = await page.locator('#quizQuestionsContainer article.reading-card').count();
    assert.equal(qCountP1, 4, 'Filtering by p1 renders 4 questions');

    // Filter by Part 2 (p2)
    await page.locator('button[data-quiz-filter="p2"]').click();
    const qCountP2 = await page.locator('#quizQuestionsContainer article.reading-card').count();
    assert.equal(qCountP2, 4, 'Filtering by p2 renders 4 questions');

    // Filter by Part 3 (p3)
    await page.locator('button[data-quiz-filter="p3"]').click();
    const qCountP3 = await page.locator('#quizQuestionsContainer article.reading-card').count();
    assert.equal(qCountP3, 4, 'Filtering by p3 renders 4 questions');

    // Return to all
    await page.locator('button[data-quiz-filter="all"]').click();
    const qCountAll = await page.locator('#quizQuestionsContainer article.reading-card').count();
    assert.equal(qCountAll, 12, 'Filtering by all restores 12 questions');

    // Answering Question 1: option 1 is correct (index 1: "B) To provide a direct solution and terminate the recursion.")
    const q1OptCorrect = page.locator('#quizQuestionsContainer button[data-qid="1"][data-opt="1"]');
    await q1OptCorrect.click();

    // Verify option marked correct
    const optClass = await q1OptCorrect.getAttribute('class');
    assert(optClass.includes('correct'), 'Option 1 marked correct');

    // Verify other options in Question 1 are disabled
    const q1OptOther = page.locator('#quizQuestionsContainer button[data-qid="1"][data-opt="0"]');
    assert(await q1OptOther.isDisabled(), 'Other options for answered question disabled');

    // Score display should show 1 / 12
    const scoreText = await page.locator('#quizScoreDisplay').innerText();
    assert.equal(scoreText.trim(), '1 / 12', 'Score display updated to 1 / 12');

    // Test Reset Quiz button
    await page.locator('#btnResetQuiz').click();
    const scoreAfterReset = await page.locator('#quizScoreDisplay').innerText();
    assert.equal(scoreAfterReset.trim(), '0 / 12', 'Score reset to 0 / 12');

    const q1OptReset = page.locator('#quizQuestionsContainer button[data-qid="1"][data-opt="1"]');
    assert.equal(await q1OptReset.isDisabled(), false, 'Options re-enabled after reset');
  });

  // 7. Responsive Viewports: Mobile (390px) and Desktop (1440px)
  await testScenario('ds3-responsive-viewports-and-sections', async ({ page, go }) => {
    // Test 1440px desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await go('study/ds/lecture-3.html');

    assert.equal(await page.locator('#section-part1').isVisible(), true, 'Part 1 visible on desktop');
    assert.equal(await page.locator('#section-part2').isVisible(), true, 'Part 2 visible on desktop');
    assert.equal(await page.locator('#section-quiz').isVisible(), true, 'Quiz visible on desktop');

    // Test 390px mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(50);

    assert.equal(await page.locator('#section-part1').isVisible(), true, 'Part 1 visible on mobile');
    assert.equal(await page.locator('#section-part2').isVisible(), true, 'Part 2 visible on mobile');
    assert.equal(await page.locator('#section-quiz').isVisible(), true, 'Quiz visible on mobile');

    // Check no window-level horizontal overflow on mobile
    const horizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth + 5;
    });
    assert.equal(horizontalScroll, false, 'No page-level horizontal overflow on mobile viewport');
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
  console.log(`\n${results.length - failed.length}/${results.length} DS Lecture 3 scenarios passed`);
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
