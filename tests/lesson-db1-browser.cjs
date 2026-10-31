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
    await page.screenshot({ path: path.join(output, 'lesson-db1-' + name + '.png') }).catch(() => {});
    console.log('FAIL', name, e.message.slice(0, 180));
  } finally {
    await context.close();
  }
}

async function register({ scenario: testScenario }) {
  // 1. Content Manifest & Inventory Check for Lecture 2
  await testScenario('db1-manifest-and-inventory-integrity', async ({ page, go }) => {
    const res = verifyLessonContent({ root });
    assert.equal(res.clean, true, 'Cryptographic content check must pass without errors: ' + res.errors.join('; '));

    await go('study/db/lesson.html?lecture=2');
    const inventory = await page.evaluate(() => {
      if (!window.DBLessonMap) return null;
      return window.DBLessonMap.getInventory('2');
    });

    assert(inventory, 'DBLessonMap provides lecture 2 inventory');
    assert.equal(inventory.standaloneBlocks, 7, '7 standalone blocks');
    assert.equal(inventory.slides, 30, '30 slides');
    assert.equal(inventory.standaloneQuestions, 34, '34 standalone questions');
    assert.equal(inventory.fullQuizQuestions, 20, '20 full quiz questions');
    assert.equal(inventory.slideQuestions, 30, '30 slide questions');
    assert.equal(inventory.totalQuestions, 84, 'total 84 questions preserved for lecture 2');
  });

  // 2. Acceptance 4: Retain all 34 standalone questions & Fix UI counter (30) -> (34)
  await testScenario('db1-ui-filter-counter-34', async ({ page, go }) => {
    await go('study/db/chapter-1.html');

    const filterBtn = page.locator('[data-qfilter="all"]');
    await filterBtn.waitFor({ state: 'visible' });
    const btnText = await filterBtn.innerText();
    assert.equal(btnText.trim(), 'كل الأسئلة (34)', 'UI filter count updated from stale 30 to actual 34');

    // Verify all 34 questions exist and render
    const questionsCount = await page.evaluate('typeof mcqQuestions !== "undefined" ? mcqQuestions.length : 0');
    assert.equal(questionsCount, 34, 'All 34 standalone questions retained on chapter-1.html');

    // Verify DBLessonMap question identities
    const qIdentities = DBLessonMap.getQuestions('2');
    assert(qIdentities, 'Questions returned for lecture 2');
    assert.equal(qIdentities.standalone.length, 34, '34 standalone identity records');
    assert.equal(qIdentities.fullQuiz.length, 20, '20 full quiz identity records');
    assert.equal(qIdentities.slideQuiz.length, 30, '30 slide quiz identity records');
  });

  // 3. Acceptance 1: Expose all 7 topic blocks & Noncontiguous DBMS/catalog relationship to slides 5-10, 15
  await testScenario('db1-blocks-and-catalog-slides-mapping', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');

    // All 7 topic blocks exist
    const blockIds = ['block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6', 'block-add'];
    for (const bId of blockIds) {
      const blockEl = page.locator('#topic-' + bId);
      assert.equal(await blockEl.count(), 1, `Topic block ${bId} exists`);
    }

    // Verify block-2 contextual slides include noncontiguous slides: 5, 6, 8, 9, 10, 15
    const block2SlidePills = page.locator('#topic-block-2 [data-jump-slide]');
    const pillNums = await block2SlidePills.evaluateAll(list => list.map(el => Number(el.getAttribute('data-jump-slide'))));
    assert.deepEqual(pillNums, [5, 6, 8, 9, 10, 15], 'block-2 matches noncontiguous slides 5, 6, 8, 9, 10, 15');

    // Verify slide 15 is accessible from block-2
    const slide15Pill = page.locator('#topic-block-2 [data-jump-slide="15"]');
    assert.equal(await slide15Pill.count(), 1, 'Slide 15 pill exists in block-2');
    await slide15Pill.click();

    const slide15Card = page.locator('#slide-card-15');
    assert.equal(await slide15Card.isVisible(), true, 'Slide 15 detail card visible after clicking contextual pill');
  });

  // 4. Acceptance 3: Demonstrate Data/Database/Mini-world topic and Slide 5 explanation with precise return
  await testScenario('db1-demonstrate-data-db-miniworld-and-slide5', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');

    // Verify Data/Database/Mini-world topic content in block-1
    const block1Text = await page.locator('#topic-block-1').innerText();
    assert(block1Text.includes('البيانات') && block1Text.includes('العالم المصغر') && block1Text.includes('قاعدة البيانات'), 'Authored topic prose preserved');

    // Verify SVG illustration inside block-1
    const svgIllustration = page.locator('#topic-block-1 svg');
    assert(await svgIllustration.count() >= 1, 'SVG illustration preserved in block-1');

    // Click Slide 5 pill
    const slide5Pill = page.locator('#topic-block-1 [data-jump-slide="5"]');
    await slide5Pill.click();

    // Verify slide 5 explanation is presented
    const slide5Card = page.locator('#slide-card-5');
    assert.equal(await slide5Card.isVisible(), true, 'Slide 5 card is visible');

    const slide5Text = await slide5Card.innerText();
    assert(slide5Text.includes('Basic Definitions'), 'Slide 5 authored title preserved');
    assert(slide5Text.includes('Database'), 'Slide 5 authored wording preserved');

    // Verify Return to Topic button targets block-1
    const returnBtn = page.locator('[data-return-to-topic]');
    assert.equal(await returnBtn.isVisible(), true, 'Return to topic button is visible');
    assert.equal(await returnBtn.getAttribute('data-target-topic'), 'block-1', 'Target is block-1');

    // Click Return to Topic
    await returnBtn.click();

    // Verify workspace returned to topics view and block-1 is focused/restored
    assert.equal(await page.locator('#topic-reading-view').isVisible(), true, 'Topics view active');
    await page.waitForFunction(() => {
      const active = document.activeElement;
      return active && (active.id === 'block-1' || active.id === 'topic-block-1' || active.getAttribute('data-block-id') === 'block-1');
    });
    assert.equal(await page.locator('#topic-block-1').isVisible(), true, 'Exact return location restored at block-1');
  });

  // 5. Acceptance 2: Keep all 30 slide explanations, summaries, points, keywords, triggers, tricks
  await testScenario('db1-all-30-slides-explanations-and-feedback', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');

    await page.locator('#view-btn-slides').click();
    await page.locator('#slide-detail-view').waitFor({ state: 'visible' });

    // Verify 30 slide cards rendered
    const cards = page.locator('.slide-study-card');
    assert.equal(await cards.count(), 30, 'All 30 slide cards rendered');

    // Check slide 1 (cover), slide 2 (outline), and slide 30 (summary)
    const slide1 = page.locator('#slide-card-1');
    const slide2 = page.locator('#slide-card-2');
    const slide30 = page.locator('#slide-card-30');
    assert.equal(await slide1.count(), 1, 'Slide 1 cover card exists');
    assert.equal(await slide2.count(), 1, 'Slide 2 outline card exists');
    assert.equal(await slide30.count(), 1, 'Slide 30 summary card exists');

    // Check slide explanation components on slide 5
    await page.evaluate(() => window.LessonWorkspace.showSlide(5));
    const card5 = page.locator('#slide-card-5');
    assert(await card5.locator('.study-concept-item').count() > 0, 'Points breakdown present');
    assert(await card5.locator('.study-keyword-pill').count() > 0, 'Keywords present');
    assert(await card5.locator('.study-cheat-box, .study-trick-box').count() >= 1, 'Exam triggers / tricks present');
    assert(await card5.locator('img').count() === 1, 'Source image present');
    assert.equal(await card5.locator('img').getAttribute('loading'), 'lazy', 'Image has lazy loading');

    // Slide quiz interactive feedback
    const quizCard = card5.locator('.quiz-card');
    if (await quizCard.count() > 0) {
      const firstOpt = quizCard.locator('.quiz-opt-btn').first();
      await firstOpt.click();
      assert.equal(await card5.locator('.quiz-feedback').isVisible(), true, 'Quiz feedback displayed');
    }
  });

  // 6. Acceptance 5: Catalog Table 1/2 and RELATIONS/COLUMNS surfaces in all modes with shared tokens
  await testScenario('db1-catalog-tables-contrast-and-styling-all-modes', async ({ page, go }) => {
    // Check both workspace and chapter-1 in light, dark, and reading modes
    for (const url of ['study/db/lesson.html?lecture=2', 'study/db/chapter-1.html']) {
      await go(url);
      const isWorkspace = url.includes('lesson.html');
      const tableSelector = isWorkspace ? '[data-block-id="block-2"] table' : '#block-2 table';
      await page.locator(tableSelector).first().waitFor({ state: 'attached' });

      // Verify table values verbatim (Acceptance criteria 5: without editing table values)
      const table1Values = await page.locator(tableSelector).nth(0).evaluate(t => {
        const rows = [...t.querySelectorAll('tbody tr')].map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.trim()));
        return rows;
      });
      assert.deepEqual(table1Values, [
        ['STUDENT', '4'],
        ['COURSE', '4'],
        ['SECTION', '5'],
        ['GRADE_REPORT', '3']
      ], 'Catalog Table 1 (RELATIONS) values verbatim');

      const table2Values = await page.locator(tableSelector).nth(1).evaluate(t => {
        const rows = [...t.querySelectorAll('tbody tr')].map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.trim()));
        return rows;
      });
      assert.deepEqual(table2Values, [
        ['Name', 'Character(30)', 'STUDENT'],
        ['Student_number', 'Integer(4)', 'STUDENT'],
        ['Class', 'Integer(1)', 'STUDENT'],
        ['Major', 'Major_type', 'STUDENT']
      ], 'Catalog Table 2 (COLUMNS) values verbatim');

      // Test readability & contrast across all themes
      for (const theme of ['light', 'dark', 'reading']) {
        await page.evaluate(t => window.PortalTheme.setTheme(t), theme);
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

          const tables = document.querySelectorAll(sel);
          const results = [];
          for (let i = 0; i < tables.length; i++) {
            const table = tables[i];
            const card = table.closest('.rounded-xl, .catalog-table-card') || table.parentElement;
            const cardBg = getComputedStyle(card).backgroundColor;
            const th = table.querySelector('th');
            const td = table.querySelector('td');
            const thColor = getComputedStyle(th).color;
            const thBg = getComputedStyle(th).backgroundColor === 'rgba(0, 0, 0, 0)' ? cardBg : getComputedStyle(th).backgroundColor;
            const tdColor = getComputedStyle(td).color;
            const tdBg = getComputedStyle(td).backgroundColor === 'rgba(0, 0, 0, 0)' ? cardBg : getComputedStyle(td).backgroundColor;

            results.push({
              tableIndex: i,
              thContrast: ratio(thColor, thBg),
              tdContrast: ratio(tdColor, tdBg)
            });
          }
          return results;
        }, tableSelector);

        for (const data of contrastData) {
          assert(data.tdContrast >= 4.5, `Table ${data.tableIndex} td contrast in ${theme} theme (${url}) is ${data.tdContrast.toFixed(2)}, expected >= 4.5`);
          assert(data.thContrast >= 3.0, `Table ${data.tableIndex} th contrast in ${theme} theme (${url}) is ${data.thContrast.toFixed(2)}, expected >= 3.0`);
        }
      }
    }
  });

  // 7. Acceptance 6: Responsive viewports at 390px and 1440px with old anchors preserved
  await testScenario('db1-responsive-viewports-and-anchors', async ({ page, go }) => {
    // Test 1440px desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await go('study/db/lesson.html?lecture=2');
    assert.equal(await page.locator('#workspace-outline').isVisible(), true, 'Outline visible on desktop');

    // Test 390px mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(50);
    assert.equal(await page.locator('.workspace-views-tabs').isVisible(), true, 'Views tabs visible on mobile');

    // Test anchors #block-1, #block-2, #block-add resolve
    for (const anchor of ['block-1', 'block-2', 'block-add']) {
      await go(`study/db/lesson.html?lecture=2#${anchor}`);
      const targetBlock = page.locator('#' + anchor);
      assert.equal(await targetBlock.count(), 1, `Anchor #${anchor} exists and is targeted`);
    }
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
  console.log(`\n${results.length - failed.length}/${results.length} DB Chapter 1 scenarios passed`);
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
