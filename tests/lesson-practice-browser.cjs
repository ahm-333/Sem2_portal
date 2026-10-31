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
  page.setDefaultTimeout(9000);
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
    await page.screenshot({ path: path.join(output, 'practice-' + name + '.png') }).catch(() => {});
    console.log('FAIL', name, e.stack);
  } finally {
    await context.close();
  }
}

async function register({ scenario: testScenario }) {
  // Test 1: Explicit 3 groups, exact counts: 34/20 topic, 20/30 full quiz, 30/32 slide local
  await testScenario('practice-groups-isolation-and-counts', async ({ page, go, errors }) => {
    // Lecture 2
    await go('study/db/lesson.html?lecture=2');
    await page.locator('.topic-block-wrapper').first().waitFor();

    // Check outline practice link and top toolbar practice button
    const practiceNavBtn = page.locator('#view-btn-practice');
    await practiceNavBtn.waitFor();
    await practiceNavBtn.click();

    const practiceHub = page.locator('#practice-hub');
    await practiceHub.waitFor({ state: 'visible' });

    // Verify 3 distinct group tabs exist
    const topicTab = page.locator('[data-practice-group-tab="topic"]');
    const fullTab = page.locator('[data-practice-group-tab="full"]');
    const slidesTab = page.locator('[data-practice-group-tab="slides"]');

    await topicTab.waitFor();
    await fullTab.waitFor();
    await slidesTab.waitFor();

    // Check count badges for Lecture 2: Topic 34, Full 20, Slides 30 (Total 84)
    assert.match(await topicTab.innerText(), /34/);
    assert.match(await fullTab.innerText(), /20/);
    assert.match(await slidesTab.innerText(), /30/);

    // Verify topic questions count rendered
    const topicCards = page.locator('.topic-practice-card');
    assert.equal(await topicCards.count(), 34, 'Lecture 2 must render 34 topic practice questions');

    // Switch to Full Quiz
    await fullTab.click();
    await page.locator('#full-quiz-view').waitFor({ state: 'visible' });
    // Host PortalStudyQuiz renders 20 question cards
    const fullQuizItems = page.locator('#full-quiz-host .a1-quiz-main > [data-qid]');
    assert.equal(await fullQuizItems.count(), 20, 'Lecture 2 must host 20 full quiz questions');

    // Switch to Slide Questions
    await slidesTab.click();
    await page.locator('#slide-questions-view').waitFor({ state: 'visible' });
    const slideCards = page.locator('.slide-micro-card');
    assert.equal(await slideCards.count(), 30, 'Lecture 2 must render 30 slide micro questions');

    // Switch to Lecture 3
    await go('study/db/lesson.html?lecture=3');
    await page.locator('.topic-block-wrapper').first().waitFor();
    await page.locator('#view-btn-practice').click();
    await page.locator('#practice-hub').waitFor({ state: 'visible' });

    // Check count badges for Lecture 3: Topic 20, Full 30, Slides 32 (Total 82)
    assert.match(await page.locator('[data-practice-group-tab="topic"]').innerText(), /20/);
    assert.match(await page.locator('[data-practice-group-tab="full"]').innerText(), /30/);
    assert.match(await page.locator('[data-practice-group-tab="slides"]').innerText(), /32/);

    assert.equal(await page.locator('.topic-practice-card').count(), 20, 'Lecture 3 must render 20 topic practice questions');

    await page.locator('[data-practice-group-tab="full"]').click();
    assert.equal(await page.locator('#full-quiz-host .a1-quiz-main > [data-qid]').count(), 30, 'Lecture 3 must host 30 full quiz questions');

    await page.locator('[data-practice-group-tab="slides"]').click();
    assert.equal(await page.locator('.slide-micro-card').count(), 32, 'Lecture 3 must render 32 slide micro questions');

    assert.equal(errors.length, 0, 'No page errors');
  });

  // Test 2: Topic practice interaction, feedback, score tally, block filtering, and reset
  await testScenario('topic-practice-interaction-and-reset', async ({ page, context, go, errors }) => {
    await context.addInitScript(() => {
      sessionStorage.setItem('sem2_quiz_choices_v1:' + location.pathname + location.search, '0');
    });
    await go('study/db/lesson.html?lecture=2');
    await page.locator('.topic-block-wrapper').first().waitFor();
    await page.locator('#view-btn-practice').click();

    // Verify first topic question has options
    const firstCard = page.locator('.topic-practice-card').first();
    await firstCard.waitFor();
    const options = firstCard.locator('.topic-opt-btn');
    assert.equal(await options.count(), 4);

    // Authored answer 2 moves to displayed position 3 with seed 0.
    // A wrong answer must not earn credit just because it occupies position 2.
    await firstCard.locator('.topic-opt-btn').filter({ hasText: /\)\s*Database\s*$/ }).click();
    assert.equal(await page.locator('#topic-practice-score strong').innerText(), '0');
    assert.doesNotMatch(await firstCard.locator('.topic-feedback strong').innerText(), /إجابة صحيحة/);
    await page.locator('#btn-reset-topic-practice').click();
    const optToClick = firstCard.locator('.topic-opt-btn').filter({ hasText: /\)\s*Data(?:\s|$)/ });
    await optToClick.click();

    // Feedback is shown and buttons disabled
    await firstCard.locator('.topic-feedback').waitFor({ state: 'visible' });
    assert.equal(await optToClick.getAttribute('disabled'), '');
    assert.equal(await firstCard.locator('.topic-opt-btn').first().getAttribute('disabled'), '');

    // Score counter is updated
    assert.equal(await page.locator('#topic-practice-score strong').innerText(), '1');
    assert.equal(await page.locator('#topic-practice-score > span').innerText(), '1');
    assert.match(await firstCard.locator('.topic-feedback strong').innerText(), /إجابة صحيحة/);

    // Filter by block
    const blockBtn = page.locator('[data-topic-filter="b1"]');
    if (await blockBtn.count() > 0) {
      await blockBtn.click();
      assert.equal(await page.locator('.topic-practice-card').count(), 4, 'Block 1 has 4 questions');
      await page.locator('[data-topic-filter="all"]').click();
      assert.equal(await page.locator('.topic-practice-card').count(), 34, 'All has 34 questions');
    }

    // Reset topic practice
    await page.locator('#btn-reset-topic-practice').click();
    assert.equal(await firstCard.locator('.topic-feedback').count(), 0);
    assert.equal(await optToClick.getAttribute('disabled'), null);
    assert.equal(await page.locator('#topic-practice-score strong').innerText(), '0');

    assert.equal(errors.length, 0);
  });

  // Test 3: In-memory view state separation (switching views retains topic session)
  await testScenario('topic-session-retained-across-view-switches', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');
    await page.locator('.topic-block-wrapper').first().waitFor();
    await page.locator('#view-btn-practice').click();

    // Answer question 1
    const card = page.locator('.topic-practice-card').first();
    await card.locator('.topic-opt-btn').filter({ hasText: /\)\s*Data\s*$/ }).click();
    await card.locator('.topic-feedback').waitFor({ state: 'visible' });

    // Switch to Topic reading view
    await page.locator('#view-btn-topics').click();
    assert.equal(await page.locator('#topic-reading-view').isVisible(), true);
    assert.equal(await page.locator('#practice-hub').isVisible(), false);

    // Switch to Slide view
    await page.locator('#view-btn-slides').click();
    assert.equal(await page.locator('#slide-detail-view').isVisible(), true);

    // Switch back to Practice view
    await page.locator('#view-btn-practice').click();
    assert.equal(await page.locator('#practice-hub').isVisible(), true);

    // Verify answered question remains answered with feedback
    const restoredCard = page.locator('.topic-practice-card').first();
    assert.equal(await restoredCard.locator('.topic-feedback').isVisible(), true);
    assert.equal(await restoredCard.locator('.topic-opt-btn').first().getAttribute('disabled'), '');
    assert.equal(await page.locator('#topic-practice-score strong').innerText(), '1');
  });

  // Test 4: Full lecture quiz hosts PortalStudyQuiz, persists to PortalStudyState, and satisfies completion
  await testScenario('full-quiz-layout-and-controls', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');
    await page.locator('.topic-block-wrapper').first().waitFor();
    await page.locator('#view-btn-practice').click();
    await page.locator('[data-practice-group-tab="full"]').click();
    const host = page.locator('#full-quiz-host');
    assert.equal(await host.locator('.a1-quiz-layout').evaluate(el => getComputedStyle(el).display), 'grid');
    assert.equal(await host.locator('.a1-quiz-pagination').evaluate(el => getComputedStyle(el).display), 'flex');
    const map = host.locator('.a1-quiz-map');
    if (!await map.evaluate(el => el.open)) await map.locator('summary').click();
    assert.equal(await host.locator('.a1-question-map').evaluate(el => getComputedStyle(el).display), 'grid');
    assert.equal(await host.locator('.q-map-pill').first().evaluate(el => el.getBoundingClientRect().height >= 44), true);
    await host.locator('[data-jump-q="full-q-20"]').click();
    assert.equal(await host.locator('#full-q-20').isVisible(), true);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await host.locator('.a1-quiz-layout').evaluate(el => getComputedStyle(el).flexDirection), 'column');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  });

  await testScenario('full-quiz-hosting-state-and-completion', async ({ page, go, errors }) => {
    await go('study/db/lesson.html?lecture=2');
    await page.locator('.topic-block-wrapper').first().waitFor();
    await page.locator('#view-btn-practice').click();

    // Switch to Full Quiz
    await page.locator('[data-practice-group-tab="full"]').click();
    const fullQuizContainer = page.locator('#full-quiz-host');
    await fullQuizContainer.waitFor({ state: 'visible' });

    // Verify PortalStudyQuiz rendered 20 question cards
    const questions = fullQuizContainer.locator('.a1-quiz-main > [data-qid]');
    assert.equal(await questions.count(), 20);

    // Answer first question with option to verify state
    const firstQ = questions.first();
    const firstOpt = firstQ.locator('.full-quiz-opt-btn').first();
    await firstOpt.click();

    // Check stored state in PortalStudyState under canonical key
    const storedQuiz = await page.evaluate(() => {
      const canonicalKey = window.PortalCatalog ? window.PortalCatalog.key('database-systems', 'lecture', '2') : JSON.stringify(['database-systems', 'lecture', '2']);
      const item = window.PortalStudyState.getItem(canonicalKey);
      return item?.quiz || null;
    });

    assert(storedQuiz, 'item.quiz must be populated');
    assert.equal(storedQuiz.version, '0f77d6ceae5a', 'Version must match canonical full quiz version');
    assert(storedQuiz.answers['1'] !== undefined, 'Authored question ID 1 must be keyed');
    assert.equal(typeof storedQuiz.answers['1'], 'number', 'Choice index must be integer');

    // Reload page and verify state hydrates
    await go('study/db/lesson.html?lecture=2');
    await page.locator('.topic-block-wrapper').first().waitFor();
    await page.locator('#view-btn-practice').click();
    await page.locator('[data-practice-group-tab="full"]').click();

    const hydratedStored = await page.evaluate(() => {
      const canonicalKey = window.PortalCatalog ? window.PortalCatalog.key('database-systems', 'lecture', '2') : JSON.stringify(['database-systems', 'lecture', '2']);
      return window.PortalStudyState.getItem(canonicalKey)?.quiz || null;
    });
    assert.equal(hydratedStored?.answers['1'], storedQuiz.answers['1'], 'Answers must survive reload');

    // Now test completion rule by seeding 19 answered questions and answering Q20
    await page.evaluate(() => {
      const canonicalKey = window.PortalCatalog ? window.PortalCatalog.key('database-systems', 'lecture', '2') : JSON.stringify(['database-systems', 'lecture', '2']);
      const answers = { '1': 1 };
      for (let i = 2; i <= 19; i++) {
        answers[String(i)] = 0;
      }
      window.PortalStudyState.updateItem(canonicalKey, {
        quiz: {
          version: '0f77d6ceae5a',
          answers,
          activeQuestionId: 20
        }
      });
    });

    await go('study/db/lesson.html?lecture=2');
    await page.locator('.topic-block-wrapper').first().waitFor();
    await page.locator('#view-btn-practice').click();
    await page.locator('[data-practice-group-tab="full"]').click();

    // Answer Q20 to complete the quiz
    const cardQ20 = page.locator('#full-q-20');
    await cardQ20.locator('.full-quiz-opt-btn').first().click();

    // Summary card is visible
    const summaryCard = page.locator('#full-quiz-summary-card');
    await summaryCard.waitFor({ state: 'visible' });

    // Verify completion status in PortalStudyState
    const isComplete = await page.evaluate(() => {
      const canonicalKey = window.PortalCatalog ? window.PortalCatalog.key('database-systems', 'lecture', '2') : JSON.stringify(['database-systems', 'lecture', '2']);
      const q = window.PortalStudyState.getItem(canonicalKey)?.quiz;
      return Boolean(q?.completedVersions?.includes('0f77d6ceae5a'));
    });
    assert.equal(isComplete, true, 'Answering all questions satisfies #8/#10 completion rule');

    assert.equal(errors.length, 0);
  });

  // Test 5: Slide questions isolation: answering does NOT complete full quiz or touch item.quiz
  await testScenario('slide-feedback-matches-shuffled-answer', async ({ page, context, go }) => {
    await context.addInitScript(() => {
      sessionStorage.setItem('sem2_quiz_choices_v1:' + location.pathname + location.search, '0');
    });
    await go('study/db/lesson.html?lecture=2');
    await page.locator('.topic-block-wrapper').first().waitFor();
    await page.locator('#view-btn-practice').click();
    await page.locator('[data-practice-group-tab="slides"]').click();
    const card = page.locator('.slide-micro-card').first();
    await card.locator('.slide-micro-opt-btn').filter({ hasText: 'Introduction to Computer Architecture' }).click();
    assert.doesNotMatch(await card.locator('.slide-micro-feedback strong').innerText(), /إجابة صحيحة/);
    await page.locator('#btn-reset-slide-questions').click();
    await card.locator('.slide-micro-opt-btn').filter({ hasText: 'Databases and Database Users - Dr. Mohamed Maher' }).click();
    assert.match(await card.locator('.slide-micro-feedback strong').innerText(), /إجابة صحيحة/);
    await page.locator('[data-practice-group-tab="topic"]').click();
    await page.locator('[data-practice-group-tab="slides"]').click();
    assert.match(await card.locator('.slide-micro-feedback strong').innerText(), /إجابة صحيحة/);
    await page.locator('#btn-reset-slide-questions').click();
    assert.equal(await card.locator('.slide-micro-feedback').count(), 0);
  });

  await testScenario('slide-questions-isolation-from-full-quiz', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');
    await page.locator('.topic-block-wrapper').first().waitFor();

    // Reset study state for database-systems:lecture:2
    await page.evaluate(() => {
      const canonicalKey = window.PortalCatalog ? window.PortalCatalog.key('database-systems', 'lecture', '2') : JSON.stringify(['database-systems', 'lecture', '2']);
      window.PortalStudyState.updateItem(canonicalKey, { quiz: null });
    });

    await page.locator('#view-btn-practice').click();
    await page.locator('[data-practice-group-tab="slides"]').click();

    // Answer a slide micro question
    const slideCard = page.locator('.slide-micro-card').first();
    const optBtn = slideCard.locator('.slide-micro-opt-btn').first();
    await optBtn.click();
    await slideCard.locator('.slide-micro-feedback').waitFor({ state: 'visible' });

    // Check PortalStudyState: item.quiz must still be null/empty
    const quizState = await page.evaluate(() => {
      const canonicalKey = window.PortalCatalog ? window.PortalCatalog.key('database-systems', 'lecture', '2') : JSON.stringify(['database-systems', 'lecture', '2']);
      return window.PortalStudyState.getItem(canonicalKey)?.quiz || null;
    });
    assert.equal(quizState, null, 'Answering slide questions must not touch full quiz item.quiz');

    // Jump to slide detail link works
    const jumpBtn = slideCard.locator('[data-jump-slide]').first();
    const targetSlideNum = await jumpBtn.getAttribute('data-jump-slide');
    await jumpBtn.click();

    // Switched to slides view focusing the slide card
    assert.equal(await page.locator('#slide-detail-view').isVisible(), true);
    assert.equal(await page.locator('#slide-card-' + targetSlideNum).isVisible(), true);
  });

  // Test 6: Lazy loading of question bank until practice view is activated
  await testScenario('practice-generated-assets', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');
    await page.locator('.topic-block-wrapper').first().waitFor();
    await page.locator('#view-btn-practice').click();
    await page.locator('.topic-practice-card').first().waitFor();
    assert.equal(await page.locator('[data-practice-group-tab="full"] svg').count(), 1);
    assert.equal(await page.locator('#btn-reset-topic-practice svg').count(), 1);
    assert.equal(await page.locator('#full-quiz-view svg.lucide-shield-check').count(), 1);
    assert.equal(await page.locator('.practice-hub-header .rounded-full').evaluate(el => getComputedStyle(el).width), '10px');
  });

  await testScenario('practice-loading-failure-can-retry', async ({ page, context, go, errors }) => {
    const failures = ['course-question-bank.js', 'lesson-practice.js', 'study-quiz.js', 'shared/quiz-attempt.js']
      .map(resource => ({ resource }));
    failures.push({ resource: 'lesson-practice.js', invalidScript: true });
    for (const { resource, invalidScript } of failures) {
      let requests = 0;
      await context.route('**/js/' + resource, route => {
        requests++;
        if (requests !== 1) return route.continue();
        return invalidScript ? route.fulfill({ contentType: 'text/javascript', body: '/* incomplete response */' }) : route.abort();
      });
      await go('study/db/lesson.html?lecture=2');
      await page.locator('.topic-block-wrapper').first().waitFor();
      await page.locator('#view-btn-practice').click();
      await page.locator('#practice-hub [role="alert"]').waitFor();
      assert.equal(await page.locator('.topic-practice-card').count(), 0, 'Do not mount partial banks');
      await page.getByRole('button', { name: 'إعادة المحاولة', exact: true }).click();
      await page.locator('.topic-practice-card').first().waitFor();
      assert.equal(await page.locator('.topic-practice-card').count(), 34);
      assert.equal(requests, 2, resource + ' must be requested again after failure');
      await page.locator('[data-practice-group-tab="full"]').click();
      assert.equal(await page.locator('#full-quiz-host .a1-quiz-main > [data-qid]').count(), 20);
      await context.unroute('**/js/' + resource);
    }
    assert.deepEqual(errors, []);
  });

  await testScenario('practice-concurrent-opens-share-loading', async ({ page, go, errors }) => {
    const requests = [];
    page.on('request', request => requests.push(request.url()));
    await go('study/db/lesson.html?lecture=2');
    await page.locator('.topic-block-wrapper').first().waitFor();
    await page.evaluate(() => Promise.all([
      window.LessonWorkspace.switchView('practice'),
      window.LessonWorkspace.switchView('topics'),
      window.LessonWorkspace.switchView('practice')
    ]));
    assert.equal(await page.locator('.practice-hub-wrapper').count(), 1);
    assert.equal(await page.locator('.topic-practice-card').count(), 34);
    for (const resource of ['course-question-bank.js', 'lesson-practice.js', 'study-quiz.js', 'quiz-attempt.js']) {
      assert.equal(requests.filter(url => url.endsWith('/' + resource)).length, 1, resource + ' must load once');
    }
    assert.equal(await page.locator('#practice-hub').getAttribute('aria-busy'), null);
    assert.deepEqual(errors, []);
  });

  await testScenario('lazy-loading-question-bank-deferred', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2');
    await page.locator('.topic-block-wrapper').first().waitFor();

    // Check if COURSE_QUESTION_BANK is loaded on initial topic reading view
    const initialBankLoaded = await page.evaluate(() => typeof window.COURSE_QUESTION_BANK !== 'undefined');
    assert.equal(initialBankLoaded, false, 'Question bank must not load on initial reading surface');

    // Now switch to practice
    await page.locator('#view-btn-practice').click();
    await page.locator('.topic-practice-card').first().waitFor();

    // Verify it is now loaded
    const afterPracticeLoaded = await page.evaluate(() => typeof window.COURSE_QUESTION_BANK !== 'undefined');
    assert.equal(afterPracticeLoaded, true, 'Question bank loads when practice area is opened');
  });

  // Test 7: WCAG color contrast and keyboard navigation audit across themes
  await testScenario('wcag-contrast-and-keyboard-navigation', async ({ page, go }) => {
    for (const theme of ['light', 'dark', 'reading']) {
      await go('study/db/lesson.html?lecture=2');
      await page.locator('.topic-block-wrapper').first().waitFor();

      await page.evaluate(t => {
        if (window.PortalTheme && typeof window.PortalTheme.set === 'function') {
          window.PortalTheme.set(t);
        } else {
          document.documentElement.setAttribute('data-theme', t);
          if (t === 'dark') document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
        }
      }, theme);

      await page.locator('#view-btn-practice').click();
      await page.locator('.topic-practice-card').first().waitFor();

      // Run contrast audit on practice hub
      const issues = await page.evaluate(auditActionContrast, '#practice-hub');
      assert.deepEqual(issues, [], `Action contrast meets WCAG AA in ${theme} theme`);

      // Keyboard tab cycle through group tabs
      const topicTab = page.locator('[data-practice-group-tab="topic"]');
      await topicTab.focus();
      assert.equal(await topicTab.evaluate(el => el === document.activeElement), true);

      await page.keyboard.press('Tab');
      const fullTab = page.locator('[data-practice-group-tab="full"]');
      assert.equal(await fullTab.evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#full-quiz-view').isVisible(), true);
      assert.deepEqual(await page.evaluate(auditActionContrast, '#full-quiz-host'), [], `Full quiz contrast meets WCAG AA in ${theme} theme`);
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
  console.log(`\n${results.length - failed.length}/${results.length} lesson practice scenarios passed`);
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
