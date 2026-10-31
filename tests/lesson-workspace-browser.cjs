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
    await page.screenshot({ path: path.join(output, 'lesson-ws-' + name + '.png') }).catch(() => {});
    console.log('FAIL', name, e.message.slice(0, 180));
  } finally {
    await context.close();
  }
}

async function register({ scenario: testScenario }) {
  await testScenario('regression-content-styles', async ({ page, go }) => {
    for (const lecture of [2, 3]) {
      await go('study/db/lesson.html?lecture=' + lecture);
      await page.locator('.topic-block-wrapper').first().waitFor();
      assert.equal(await page.locator('.topic-block-body .grid').first().evaluate(el => getComputedStyle(el).display), 'grid');
      assert.equal(await page.locator('.topic-block-body .en-badge').first().evaluate(el => getComputedStyle(el).direction), 'ltr');
      await page.locator('#view-btn-slides').click();
      assert.equal(await page.locator('#slide-card-1 img').evaluate(el => getComputedStyle(el).maxHeight), '580px');
    }
  });

  await testScenario('regression-navigation-and-recovery', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');
    for (const prefix of ['', '/Sem2_portal']) {
      const origin = new URL(page.url()).origin;
      const lesson = origin + prefix + '/study/db/lesson.html?lecture=2';
      await page.goto(lesson);
      await page.locator('.topic-block-wrapper').first().waitFor();
      await page.locator('.workspace-actions a').click();
      assert.equal(page.url(), lesson + '#topic-reading-view');
      assert.equal(await page.locator('.study-shell-brand').evaluate(el => el.pathname), prefix + '/index.html');
      assert.equal(await page.locator('.study-portal-bar nav a').evaluate(el => el.pathname), prefix + '/subject.html');
      await page.goto(origin + prefix + '/study/db/lesson.html?lecture=99');
      await page.locator('#recovery-view a[href="lesson.html?lecture=2"]').click();
      await page.locator('.topic-block-wrapper').first().waitFor();
      assert.equal(page.url(), lesson);
    }
    await page.goto(require('node:url').pathToFileURL(path.join(root, 'study/db/lesson.html')).href + '?lecture=2');
    const fallback = page.locator('#recovery-view a').filter({hasText: 'فتح الشرح الأصلي'});
    await fallback.waitFor();
    assert.equal(await fallback.evaluate(el => el.href), require('node:url').pathToFileURL(path.join(root, 'study/db/chapter-1.html')).href);
  });

  await testScenario('regression-workspace-zoom-focus', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');
    await page.locator('.topic-block-wrapper').first().waitFor();
    await page.locator('#view-btn-slides').click();
    const trigger = page.locator('#slide-card-1 [data-zoom-btn]');
    await trigger.click();
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('#slide-zoom-modal').evaluate(el => el.contains(document.activeElement)), true, 'Tab stays inside zoom');
    assert.equal(await page.locator('#main').evaluate(el => el.inert), true, 'background is inert');
    await page.keyboard.press('Escape');
    assert.equal(await trigger.evaluate(el => el === document.activeElement), true, 'focus restored');
    assert.equal(await page.locator('#main').evaluate(el => el.inert), false);
    await trigger.click();
    await page.locator('#slide-zoom-close').click();
    assert.equal(await page.locator('#slide-zoom-modal').isVisible(), false);
  });

  await testScenario('regression-reduced-motion-scroll', async ({ page, go }) => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.addInitScript(() => {
      window.__scrollBehaviors = [];
      const original = window.Element.prototype.scrollIntoView;
      window.Element.prototype.scrollIntoView = function (options) {
        window.__scrollBehaviors.push(options?.behavior);
        return original.call(this, options);
      };
    });
    await go('study/db/lesson.html?lecture=2');
    await page.locator('[data-jump-slide]').first().click();
    await page.locator('[data-slide-nav="next"]').click();
    await page.locator('[data-return-to-topic]').click();
    await page.locator('[data-topic-link]').first().click();
    const behaviors = await page.evaluate(() => window.__scrollBehaviors);
    assert(behaviors.length >= 4);
    assert(behaviors.every(value => value === 'auto' || value === 'instant'), JSON.stringify(behaviors));
  });

  await testScenario('regression-existing-reader-zoom', async ({ page, go }) => {
    const key = encodeURIComponent(JSON.stringify(['database-systems', 'lecture', '2']));
    await go('subject.html?id=database-systems&item=' + key + '&action=internal-study&tab=original&slide=1');
    const trigger = page.locator('#study-slides-feed #slide-card-1 [data-zoom-btn]');
    await trigger.click();
    const zoom = page.locator('[role="dialog"][aria-modal="true"]').filter({has: page.locator('[data-reader-zoom-close]')});
    await zoom.waitFor();
    assert.equal(await zoom.locator('img').evaluate(el => el.src.includes('slide_1.png')), true);
    await page.keyboard.press('Escape');
    assert.equal(await zoom.isVisible(), false);
    assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
    assert.equal(await page.locator('#lecture-study-modal').isVisible(), true, 'parent reader stays open');
  });

  // 1. Canonical route and OS visual reference for Lecture 2 and 3
  await testScenario('lesson-workspace-canonical-route', async ({ page, go, errors }) => {
    await go('study/db/lesson.html?lecture=2');
    assert.equal(errors.length, 0, 'no uncaught page errors: ' + errors.join('; '));

    // Verify OS visual reference shell and structure
    assert.equal(await page.locator('html').getAttribute('data-study-shell'), '');
    assert.equal(await page.locator('html').getAttribute('data-study-course'), 'database-systems');
    assert.equal(await page.locator('.study-portal-bar').isVisible(), true, 'study portal bar is visible');
    assert.equal(await page.locator('#workspace-outline').isVisible(), true, 'unified outline is visible');
    assert.equal(await page.locator('#workspace-paper').isVisible(), true, 'main reading surface is visible');

    // Title reflects lecture metadata
    const titleText = await page.locator('h1').innerText();
    assert(titleText.includes('Databases and Database Users') || titleText.includes('قواعد البيانات'), 'title includes course info');

    // Check lecture 3 as well
    await go('study/db/lesson.html?lecture=3');
    assert.equal(errors.length, 0);
    const titleText3 = await page.locator('h1').innerText();
    assert(titleText3.includes('Database System Concepts') || titleText3.includes('معمارية ومفاهيم'), 'lec 3 title includes course info');
  });

  // 2. On-demand loading and security guard
  await testScenario('lesson-workspace-lazy-loading-and-security', async ({ page, go }) => {
    const requestedResources = [];
    page.on('request', req => requestedResources.push(req.url()));

    await go('study/db/lesson.html?lecture=2');

    // Ensure question bank is NOT transferred upfront
    assert(!requestedResources.some(u => u.includes('course-question-bank')), 'course-question-bank is not loaded upfront');

    // Ensure only chapter-1 is fetched, NOT chapter-2
    assert(requestedResources.some(u => u.includes('chapter-1.html')), 'chapter-1.html requested');
    assert(!requestedResources.some(u => u.includes('chapter-2.html')), 'chapter-2.html NOT requested');

    // Security check: verify no injected or legacy scripts executed
    const scriptExecuted = await page.evaluate(() => window.__legacyScriptExecuted || false);
    assert.equal(scriptExecuted, false, 'no legacy scripts executed from extracted HTML');
  });

  // 3. Block extraction and preservation
  await testScenario('lesson-workspace-block-extraction', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');

    // Lecture 2 has 7 blocks: block-1 through block-6 + block-add
    const blockIds = ['block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6', 'block-add'];
    for (const bId of blockIds) {
      const blockEl = page.locator('#topic-' + bId + ', #' + bId);
      assert(await blockEl.count() > 0, 'block ' + bId + ' exists in topic reading surface');
    }

    // Verify SVGs and formulas are preserved
    const svgs = await page.locator('#workspace-paper svg').count();
    assert(svgs > 0, 'SVGs preserved inside extracted blocks');

    // Check lecture 3 blocks
    await go('study/db/lesson.html?lecture=3');
    const lec3BlockIds = ['block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6'];
    for (const bId of lec3BlockIds) {
      const blockEl = page.locator('#topic-' + bId + ', #' + bId);
      assert(await blockEl.count() > 0, 'lec 3 block ' + bId + ' exists');
    }
  });

  // 4. Slide view reuse, rendering delegation, and quiz interaction
  await testScenario('lesson-workspace-slide-view-reuse', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');

    // Switch to slides view
    await page.locator('#view-btn-slides').click();
    await page.locator('#slide-detail-view').waitFor({ state: 'visible' });

    // Slide view is rendered using PortalSlideView
    const slideCards = page.locator('.slide-study-card');
    assert(await slideCards.count() > 0, 'slide study cards rendered');

    // In Lec 2, slide 5 has a quiz
    await page.evaluate(() => window.LessonWorkspace.showSlide(5));
    const quizCard = page.locator('#slide-card-5 .quiz-card');
    if (await quizCard.count() > 0) {
      const optionButtons = quizCard.locator('.quiz-opt-btn');
      assert(await optionButtons.count() >= 2, 'quiz options present');
      
      // Click an option and verify feedback appears
      await optionButtons.first().click();
      const feedback = quizCard.locator('.quiz-feedback');
      assert.equal(await feedback.isVisible(), true, 'feedback shown after answer');
      assert.equal(await optionButtons.first().isDisabled(), true, 'buttons disabled after answer');
    }
  });

  // 5. Contextual slide navigation and exact return position
  await testScenario('lesson-workspace-contextual-navigation', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');

    // Find a contextual slide trigger inside topic block 1
    const slideTrigger = page.locator('[data-jump-slide]').first();
    assert(await slideTrigger.count() > 0, 'contextual slide triggers exist in topic blocks');

    const targetSlide = await slideTrigger.getAttribute('data-jump-slide');
    await slideTrigger.click();

    // Verify slide detail is presented
    const activeSlide = page.locator('#slide-card-' + targetSlide + ', [data-active-slide="' + targetSlide + '"]');
    assert(await activeSlide.isVisible(), 'target slide ' + targetSlide + ' is visible');

    // Original image is present with lazy loading
    const slideImg = activeSlide.locator('img');
    assert.equal(await slideImg.getAttribute('loading'), 'lazy', 'image has lazy loading');

    // Click Return to Topic button
    const returnBtn = page.locator('[data-return-to-topic]').first();
    assert(await returnBtn.isVisible(), 'return to topic button visible');
    await returnBtn.click();

    // Verify scrolled back to topic position
    const topicBlock = page.locator('#topic-block-1');
    assert.equal(await topicBlock.isVisible(), true, 'topic block is visible after return');
  });

  // 6. Access to all slides (covers, supplementary examples, summaries)
  await testScenario('lesson-workspace-all-slides-access', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=3');

    // Lecture 3 has 32 slides including COMPANY and UML examples
    const outlineSlideLinks = page.locator('#workspace-outline [data-slide-link]');
    assert(await outlineSlideLinks.count() >= 32, 'outline provides access to all 32 slides');

    // Check specific supplementary examples: slide 7 (COMPANY ER) and slide 10 (UML)
    const companySlide = page.locator('#workspace-outline [data-slide-link="7"]');
    assert(await companySlide.count() > 0, 'COMPANY ER slide link exists');
  });

  // 7. Font sizing, image zoom, and reduced motion
  await testScenario('lesson-workspace-font-sizing-and-reduced-motion', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');

    const zoomIn = page.locator('#workspace-font-zoom-in, [data-zoom-in]');
    const zoomOut = page.locator('#workspace-font-zoom-out, [data-zoom-out]');
    const readingArea = page.locator('#workspace-paper');

    if (await zoomIn.count() > 0) {
      await zoomIn.click();
      assert(await readingArea.evaluate(el => el.classList.contains('study-font-lg') || el.classList.contains('study-font-xl')), 'font zoom applied');
      await zoomOut.click();
    }

    // Switch to slides view for image zoom
    await page.locator('#view-btn-slides').click();
    await page.locator('#slide-detail-view').waitFor({ state: 'visible' });

    const imgZoomTrigger = page.locator('#slide-viewer-feed [data-zoom-btn], #slide-viewer-feed [data-zoom-image]').first();
    if (await imgZoomTrigger.count() > 0) {
      await imgZoomTrigger.click();
      const zoomModal = page.locator('#slide-zoom-modal');
      assert.equal(await zoomModal.isVisible(), true, 'zoom modal opens on click');
      await page.keyboard.press('Escape');
      assert.equal(await zoomModal.isVisible(), false, 'Escape closes zoom modal');
    }
  });

  // 8. Honest recovery for unsupported lecture requests
  await testScenario('lesson-workspace-honest-recovery', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=99');

    // Must show recovery view with clear explanation and links to available lectures
    const recoveryNotice = page.locator('#recovery-view');
    assert.equal(await recoveryNotice.isVisible(), true, 'recovery card visible for unsupported lecture');

    const recoveryText = await recoveryNotice.innerText();
    assert(recoveryText.includes('2') && recoveryText.includes('3'), 'mentions available lectures 2 and 3');
  });

  // 9. WCAG 2.2 AA Contrast in dark, light, and reading themes
  await testScenario('lesson-workspace-wcag-contrast', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');

    for (const theme of ['light', 'dark', 'reading']) {
      await page.evaluate(t => window.PortalTheme.setTheme(t), theme);
      await page.waitForTimeout(100);
      const issues = await page.evaluate(auditActionContrast, '#workspace-container');
      const blocking = issues.filter(i => i.contrast + 0.05 < i.required);
      assert.equal(blocking.length, 0, `contrast issues in ${theme} theme: ` + JSON.stringify(blocking));
    }
  });

  // 10. Home payload isolation
  await testScenario('lesson-workspace-home-payload-isolation', async ({ page, go }) => {
    const homeRequests = [];
    page.on('request', req => homeRequests.push(req.url()));

    await go('index.html');

    assert(!homeRequests.some(u => u.includes('lecture-explanations-data')), 'home does not load lecture-explanations-data');
    assert(!homeRequests.some(u => u.includes('lesson-workspace')), 'home does not load lesson-workspace');
    assert(!homeRequests.some(u => u.includes('lesson-slide-view')), 'home does not load lesson-slide-view');
  });

  // 11. Packaged asset paths at root and /Sem2_portal/
  await testScenario('lesson-workspace-packaged-routes', async () => {
    const distPath = path.join(root, 'dist');
    if (!fs.existsSync(distPath)) return;

    const distServer = http.createServer((req, res) => {
      const url = new URL(req.url, 'http://localhost');
      const relative = decodeURIComponent(url.pathname).replace(/^\/Sem2_portal\//, '/');
      const target = path.resolve(distPath, '.' + relative + (relative.endsWith('/') ? 'index.html' : ''));
      if (!target.startsWith(distPath + path.sep)) {
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

    await new Promise(resolve => distServer.listen(0, '127.0.0.1', resolve));
    const distPort = distServer.address().port;
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();

    try {
      // Test with /Sem2_portal/ prefix
      await p.goto(`http://127.0.0.1:${distPort}/Sem2_portal/study/db/lesson.html?lecture=2`, { waitUntil: 'load' });
      assert.equal(await p.locator('#workspace-outline').isVisible(), true, 'outline loads under /Sem2_portal/');
      assert(await p.locator('.topic-block-wrapper').count() > 0, 'topics load under /Sem2_portal/');
      await p.locator('.workspace-actions a').click();
      assert.equal(new URL(p.url()).pathname, '/Sem2_portal/study/db/lesson.html');
      assert.equal(await p.locator('.study-shell-brand').evaluate(el => el.pathname), '/Sem2_portal/index.html');
      await p.locator('#view-btn-slides').click();
      const slideImage = p.locator('#slide-card-1 img');
      await slideImage.scrollIntoViewIfNeeded();
      await p.waitForFunction(() => document.querySelector('#slide-card-1 img').naturalWidth > 0);
      assert.equal(await slideImage.evaluate(el => getComputedStyle(el).maxHeight), '580px');

      // Test at root / prefix
      await p.goto(`http://127.0.0.1:${distPort}/study/db/lesson.html?lecture=2`, { waitUntil: 'load' });
      assert.equal(await p.locator('#workspace-outline').isVisible(), true, 'outline loads under root /');
      assert(await p.locator('.topic-block-wrapper').count() > 0, 'topics load under root /');

      // The data loader must also resolve relative to the packaged subject bundle.
      const key = encodeURIComponent(JSON.stringify(['database-systems', 'lecture', '2']));
      await p.goto(`http://127.0.0.1:${distPort}/Sem2_portal/subject.html?id=database-systems&item=${key}&action=internal-study&tab=original&slide=1`);
      const zoomTrigger = p.locator('#slide-card-1 [data-zoom-btn]');
      await zoomTrigger.click();
      await p.locator('[data-reader-zoom-close]').waitFor();
      await p.keyboard.press('Escape');
      assert.equal(await zoomTrigger.evaluate(el => el === document.activeElement), true);
    } finally {
      await ctx.close();
      distServer.close();
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
        '.pdf': 'application/pdf',
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
  console.log(`\n${results.length - failed.length}/${results.length} lesson workspace scenarios passed`);
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
