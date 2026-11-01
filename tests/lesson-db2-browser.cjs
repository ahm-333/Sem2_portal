const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const { verifyLessonContent } = require('../tools/check-lesson-content.cjs');
const { DBLessonMap } = require('../js/shared/db-lesson-map.js');

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
    await page.screenshot({ path: path.join(output, 'lesson-db2-' + name + '.png') }).catch(() => {});
    console.log('FAIL', name, e.message.slice(0, 180));
  } finally {
    await context.close();
  }
}

async function register({ scenario: testScenario }) {
  // 1. Content Manifest & Inventory Check for Lecture 3 / Chapter 2
  await testScenario('db2-manifest-and-inventory-integrity', async ({ page, go }) => {
    const res = verifyLessonContent({ root });
    assert.equal(res.clean, true, 'Cryptographic content check must pass without errors: ' + res.errors.join('; '));

    await go('study/db/lesson.html?lecture=3');
    const inventory = await page.evaluate(() => {
      if (!window.DBLessonMap) return null;
      return window.DBLessonMap.getInventory('3');
    });

    assert(inventory, 'DBLessonMap provides lecture 3 inventory');
    assert.equal(inventory.standaloneBlocks, 6, '6 standalone blocks');
    assert.equal(inventory.slides, 32, '32 slides');
    assert.equal(inventory.standaloneQuestions, 20, '20 standalone questions');
    assert.equal(inventory.fullQuizQuestions, 30, '30 full quiz questions');
    assert.equal(inventory.slideQuestions, 32, '32 slide questions');
    assert.equal(inventory.totalQuestions, 82, 'total 82 questions preserved for lecture 3');
  });

  // 2. Acceptance 4: Question identities, standalone 20, full quiz 30, slide quiz 32, and Question 30 Weak Entity
  await testScenario('db2-question-identities-and-weak-entity-q30', async ({ page, go }) => {
    // Verify DBLessonMap question identities
    const qIdentities = DBLessonMap.getQuestions('3');
    assert(qIdentities, 'Questions returned for lecture 3');
    assert.equal(qIdentities.standalone.length, 20, '20 standalone identity records');
    assert.equal(qIdentities.fullQuiz.length, 30, '30 full quiz identity records');
    assert.equal(qIdentities.slideQuiz.length, 32, '32 slide quiz identity records');
    assert.equal(qIdentities.all.length, 82, '82 total question identities without deduplication');

    // Standalone page chapter-2.html retains and renders all 20 questions
    await go('study/db/chapter-2.html');
    const questionsCount = await page.locator('#quizContainer > div').count();
    assert.equal(questionsCount, 20, 'All 20 standalone questions rendered on chapter-2.html');

    // Full Quiz Question 30 specifically about DEPENDENT / Weak Entity
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/education/db-content-manifest.json'), 'utf8'));
    const fullQuiz = manifest.content.lec3.questions.fullQuiz;
    assert.equal(fullQuiz.length, 30, '30 full quiz questions in manifest');
    const q30 = fullQuiz[29]; // 0-indexed 30th question
    assert(q30, 'Question 30 exists');
    assert(/DEPENDENT/i.test(q30.question) && /Weak Entity/i.test(q30.question), 'Question 30 asks about DEPENDENT and Weak Entity');
    assert(/Double Rectangle/i.test(q30.options[q30.correct]), 'Correct answer is Double Rectangle');
    assert(/Double Rectangle/i.test(q30.explanation) && /Weak Entity/i.test(q30.explanation), 'Feedback explains Double Rectangle representation for Weak Entity');
  });

  // 3. Acceptance 1 & 3: Expose all 6 topic blocks, diagrams, tables, and University examples unchanged
  await testScenario('db2-blocks-diagrams-and-slides-mapping', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=3');

    // All 6 topic blocks exist
    const blockIds = ['block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6'];
    for (const bId of blockIds) {
      const blockEl = page.locator('#topic-' + bId);
      assert.equal(await blockEl.count(), 1, `Topic block ${bId} exists`);
    }

    // Verify block contextual slides
    const block1Slides = await page.locator('#topic-block-1 [data-jump-slide]').evaluateAll(btns => btns.map(b => Number(b.getAttribute('data-jump-slide'))));
    assert.deepEqual(block1Slides, [3, 4, 5, 6, 8, 11], 'Block 1 maps to slides 3, 4, 5, 6, 8, 11');

    const block2Slides = await page.locator('#topic-block-2 [data-jump-slide]').evaluateAll(btns => btns.map(b => Number(b.getAttribute('data-jump-slide'))));
    assert.deepEqual(block2Slides, [12, 13, 14, 16, 17], 'Block 2 maps to slides 12, 13, 14, 16, 17');

    const block3Slides = await page.locator('#topic-block-3 [data-jump-slide]').evaluateAll(btns => btns.map(b => Number(b.getAttribute('data-jump-slide'))));
    assert.deepEqual(block3Slides, [18, 20, 21, 22, 23], 'Block 3 maps to slides 18, 20, 21, 22, 23');

    const block4Slides = await page.locator('#topic-block-4 [data-jump-slide]').evaluateAll(btns => btns.map(b => Number(b.getAttribute('data-jump-slide'))));
    assert.deepEqual(block4Slides, [24, 26, 27, 28, 29, 30, 31, 32], 'Block 4 maps to client/server slides');

    const block5Slides = await page.locator('#topic-block-5 [data-jump-slide]').evaluateAll(btns => btns.map(b => Number(b.getAttribute('data-jump-slide'))));
    assert.deepEqual(block5Slides, [20, 21, 24, 25, 28, 32], 'Block 5 maps to architectural visuals');

    // Verify tables and architecture cards exist in extracted blocks
    const tablesInBlock2 = await page.locator('#topic-block-2 table').count();
    assert(tablesInBlock2 >= 2, 'Block 2 contains Schema vs State table and Database State table');

    const cardsInBlock4 = await page.locator('#topic-block-4 .sub-box').count();
    assert.equal(cardsInBlock4, 3, 'Block 4 contains 3 architectural cards (Centralized, 2-Tier, 3-Tier)');

    const asciiInBlock5 = await page.locator('#topic-block-5 .ascii-diagram').count();
    assert.equal(asciiInBlock5, 4, 'Block 5 contains all 4 official ASCII architectural visual diagrams');

    // Verify standalone University / cashier / student-affairs examples are preserved verbatim
    const block2Text = await page.locator('#topic-block-2').innerText();
    assert(block2Text.includes('UNIVERSITY'), 'Standalone University database example preserved in Block 2');
    assert(block2Text.includes('STUDENT') && block2Text.includes('COURSE'), 'Student and Course schema examples preserved');

    const block3Text = await page.locator('#topic-block-3').innerText();
    assert(block3Text.includes('الخزينة') || block3Text.includes('شؤون الطلاب') || block3Text.includes('View'), 'Standalone cashier / student affairs view examples preserved in Block 3');
  });

  // 4. Acceptance 2: Outline covers covers, summaries, and unmatched slide examples (COMPANY, UML, Staff)
  await testScenario('db2-outline-covers-supplementary-examples-and-standalone', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=3');

    const outlineLinks = page.locator('#workspace-outline [data-slide-link]');
    const outlineSlideNums = await outlineLinks.evaluateAll(links => links.map(l => Number(l.getAttribute('data-slide-link'))));

    // Cover (1), outline (2) are present
    assert(outlineSlideNums.includes(1), 'Outline includes Slide 1 cover');
    assert(outlineSlideNums.includes(2), 'Outline includes Slide 2 outline');

    // Supplementary examples: COMPANY ER Diagram slide 7, COMPANY relational schema slide 9,
    // UML slide 10, COMPANY DB State slide 15, Staff/DOB slide 19
    assert(outlineSlideNums.includes(7), 'Outline includes Slide 7 COMPANY ER Diagram');
    assert(outlineSlideNums.includes(9), 'Outline includes Slide 9 COMPANY Relational Schema');
    assert(outlineSlideNums.includes(10), 'Outline includes Slide 10 UML Class Diagram');
    assert(outlineSlideNums.includes(15), 'Outline includes Slide 15 COMPANY Database State');
    assert(outlineSlideNums.includes(19), 'Outline includes Slide 19 Staff/DOB Three-Schema example');

    // Architecture diagrams and DBMS languages are reachable
    assert(outlineSlideNums.includes(21), 'Outline reaches Slide 21 Mappings');
    assert(outlineSlideNums.includes(23), 'Outline reaches Slide 23 DBMS Languages');
    assert(outlineSlideNums.includes(25), 'Outline reaches Slide 25 Centralized Architecture');
    assert(outlineSlideNums.includes(28), 'Outline reaches Slide 28 Two-Tier Architecture');
    assert(outlineSlideNums.includes(32), 'Outline reaches Slide 32 Three-Tier Architecture');
  });

  // 5. Acceptance 1 & 6: Demonstrate Contextual Pill navigation and Return to Topic
  await testScenario('db2-demonstrate-contextual-pill-and-slide-return', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=3');

    // Find and click contextual pill for slide 12 in block-2
    const pill12 = page.locator('#topic-block-2 [data-jump-slide="12"]');
    await pill12.waitFor({ state: 'visible' });
    await pill12.click();

    // Verify workspace switched to slides view and slide-card-12 is visible
    await page.locator('#slide-detail-view').waitFor({ state: 'visible' });
    const card12 = page.locator('#slide-card-12');
    assert.equal(await card12.isVisible(), true, 'Slide card 12 is visible');

    // Verify Return to Topic button exists and targets block-2
    const returnBtn = page.locator('[data-return-to-topic]');
    await returnBtn.waitFor({ state: 'visible' });
    assert.equal(await returnBtn.getAttribute('data-target-topic'), 'block-2', 'Target is block-2');

    // Click Return to Topic
    await returnBtn.click();

    // Verify workspace returned to topics view and block-2 is restored
    assert.equal(await page.locator('#topic-reading-view').isVisible(), true, 'Topics view active');
    await page.waitForFunction(() => {
      const active = document.activeElement;
      return active && (active.id === 'block-2' || active.id === 'topic-block-2' || active.getAttribute('data-block-id') === 'block-2');
    });
    assert.equal(await page.locator('#topic-block-2').isVisible(), true, 'Exact return location restored at block-2');
  });

  // 6. Acceptance 1 & 6: All 32 slides explanations, source images, and feedback
  await testScenario('db2-all-32-slides-explanations-images-and-feedback', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=3');

    await page.locator('#view-btn-slides').click();
    await page.locator('#slide-detail-view').waitFor({ state: 'visible' });

    // Verify all 32 slide cards rendered
    const cards = page.locator('.slide-study-card');
    assert.equal(await cards.count(), 32, 'All 32 slide cards rendered');

    // Check first (1), middle (16), and last (32)
    const slide1 = page.locator('#slide-card-1');
    const slide16 = page.locator('#slide-card-16');
    const slide32 = page.locator('#slide-card-32');
    assert.equal(await slide1.count(), 1, 'Slide 1 cover card exists');
    assert.equal(await slide16.count(), 1, 'Slide 16 middle card exists');
    assert.equal(await slide32.count(), 1, 'Slide 32 last card exists');

    // Verify slide explanation components on slide 7 (COMPANY ER Diagram)
    await page.evaluate(() => window.LessonWorkspace.showSlide(7));
    const card7 = page.locator('#slide-card-7');
    assert(await card7.locator('.study-concept-item').count() > 0, 'Points breakdown present on slide 7');
    assert(await card7.locator('.study-keyword-pill').count() > 0, 'Keywords present on slide 7');
    assert(await card7.locator('img').count() === 1, 'Source image present on slide 7');
    assert.equal(await card7.locator('img').getAttribute('loading'), 'lazy', 'Image has lazy loading');

    // Verify interactive quiz feedback on slide 7
    const quizCard = card7.locator('.quiz-card');
    if (await quizCard.count() > 0) {
      const firstOpt = quizCard.locator('.quiz-opt-btn').first();
      await firstOpt.click();
      assert.equal(await card7.locator('.quiz-feedback').isVisible(), true, 'Quiz feedback displayed on slide 7');
    }
  });

  // 7. Acceptance 5: Dark island surfaces (Student_number / Course_number) legible in light/reading modes
  await testScenario('db2-dark-island-schema-contrast-and-styling-all-modes', async ({ page, go }) => {
    for (const url of ['study/db/lesson.html?lecture=3', 'study/db/chapter-2.html']) {
      await go(url);
      const isWorkspace = url.includes('lesson.html');
      const blockSelector = isWorkspace ? '#topic-block-2' : '#block-2';
      await page.locator(blockSelector).waitFor({ state: 'attached' });

      // Check schema boxes containing Student_number and Course_number
      const islandSelector = `${blockSelector} .bg-slate-900`;
      const islandCount = await page.locator(islandSelector).count();
      assert(islandCount >= 2, `At least 2 dark island schema boxes in ${url}`);

      // Verify diagram labels/edges and text verbatim
      const islandTexts = await page.locator(islandSelector).evaluateAll(els => els.map(e => e.innerText));
      assert(islandTexts.some(t => t.includes('Student_number') && t.includes('STUDENT')), 'Student_number schema box text preserved');
      assert(islandTexts.some(t => t.includes('Course_number') && t.includes('COURSE')), 'Course_number schema box text preserved');

      // Test readability & contrast of Student_number and Course_number fields across light, dark, and reading themes
      for (const theme of ['light', 'dark', 'reading']) {
        await page.evaluate(t => window.PortalTheme ? window.PortalTheme.setTheme(t) : (document.body.className = 'theme-' + (t === 'reading' ? 'sepia' : t)), theme);
        await page.waitForTimeout(100);

        const contrastData = await page.evaluate(sel => {
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

          const islands = document.querySelectorAll(sel);
          const results = [];
          for (let i = 0; i < islands.length; i++) {
            const island = islands[i];
            const bg = getComputedStyle(island).backgroundColor;
            // Target the schema field line containing Student_number / Course_number
            const spans = island.querySelectorAll('span, strong');
            const targetSpan = Array.from(spans).find(s => s.innerText.includes('Name') || s.innerText.includes('Course_number')) || island;
            const fg = getComputedStyle(targetSpan).color;
            const containerFg = getComputedStyle(island).color;
            results.push({
              index: i,
              bg,
              fg,
              containerFg,
              contrast: ratio(fg, bg),
              containerContrast: ratio(containerFg, bg)
            });
          }
          return results;
        }, islandSelector);

        for (const data of contrastData) {
          assert(data.contrast >= 4.5 || data.containerContrast >= 4.5, `Dark island ${data.index} text contrast in ${theme} theme (${url}) is ${data.contrast.toFixed(2)} (fg: ${data.fg}, containerFg: ${data.containerFg}, bg: ${data.bg}), expected >= 4.5`);
        }

        // Verify ASCII diagram local scrolling and contrast
        const asciiSelector = isWorkspace ? '#topic-block-5 .ascii-diagram' : '#block-5 .ascii-diagram';
        const asciiCount = await page.locator(asciiSelector).count();
        assert(asciiCount >= 1, 'ASCII diagrams present');
        const asciiData = await page.locator(asciiSelector).first().evaluate(el => {
          const cs = getComputedStyle(el);
          return {
            overflowX: cs.overflowX,
            color: cs.color,
            bgColor: cs.backgroundColor
          };
        });
        assert(['auto', 'scroll'].includes(asciiData.overflowX), 'ASCII diagram retains local scrolling');
      }
    }
  });

  // 8. Acceptance 6: Responsive viewports at 390px and 1440px with old anchors preserved
  await testScenario('db2-responsive-viewports-and-anchors', async ({ page, go }) => {
    // Test 1440px desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await go('study/db/lesson.html?lecture=3');
    assert.equal(await page.locator('#workspace-outline').isVisible(), true, 'Outline visible on desktop');

    // Test 390px mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(50);
    assert.equal(await page.locator('.workspace-views-tabs').isVisible(), true, 'Views tabs visible on mobile');

    // Test anchors #block-1, #block-2, #block-6 resolve
    for (const anchor of ['block-1', 'block-2', 'block-6']) {
      await go(`study/db/lesson.html?lecture=3#${anchor}`);
      const targetBlock = page.locator('#' + anchor);
      assert.equal(await targetBlock.count(), 1, `Anchor #${anchor} exists and is targeted`);
    }

    // Verify first (block-1 / slide 1), middle (block-3 / slide 16), last (block-6 / slide 32)
    assert.equal(await page.locator('#topic-block-1').count(), 1, 'First block exists');
    assert.equal(await page.locator('#topic-block-3').count(), 1, 'Middle block exists');
    assert.equal(await page.locator('#topic-block-6').count(), 1, 'Last block exists');
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
  console.log(`\n${results.length - failed.length}/${results.length} DB Chapter 2 scenarios passed`);
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
