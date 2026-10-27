const assert = require('node:assert/strict');
const path = require('node:path');
async function settled(page) {
  await page.addInitScript(() => {
    localStorage.setItem('sem2_first_visit_configured', 'true');
    sessionStorage.setItem('sem2-studio-rift-intro-v3', 'seen');
  });
}
async function openExam(page, go) {
  await settled(page); await go('subject.html?id=database-systems');
  await page.locator('[data-open-power-tool="midterm"]').click();
  await page.locator('#start-midterm-btn').click();
}
async function reloadTools(page) {
  await page.reload({waitUntil: 'domcontentloaded'});
  await page.locator('#portal-timer-nav-btn').waitFor({state: 'visible'});
}
exports.register = async ({scenario: runScenario}) => {
  // These scenarios exercise timer/data semantics; motion has its own browser suite.
  const scenario = (name, fn, options = {}) => runScenario(name, async ({go, ...context}) => {
    const toolsGo = async route => {
      await go(route, {waitUntil: 'domcontentloaded'});
      await context.page.locator('#portal-timer-nav-btn').waitFor({state: 'visible'});
    };
    await fn({...context, go: toolsGo});
  }, {reducedMotion: 'reduce', ...options});
  await scenario('power-ui-setup-has-clear-lecture-controls-and-visible-start', async ({page, go}) => {
    await settled(page); await go('subject.html?id=data-structure');
    await page.locator('[data-open-power-tool="midterm"]').click();
    await page.locator('#start-midterm-btn:enabled').waitFor();
    await page.screenshot({path: path.resolve(__dirname, '../test-results/a1/power-ui-setup-current.png')});
    const lectures = await page.locator('[data-toggle-scope-lec]').evaluateAll(els => els.map(el => ({height: el.getBoundingClientRect().height, border: getComputedStyle(el).borderTopStyle, width: getComputedStyle(el).borderTopWidth})));
    assert(lectures.every(control => control.height >= 44 && control.border !== 'none' && parseFloat(control.width) >= 1), 'lecture choices have a visible boundary and a finger-sized target');
    const start = await page.locator('#start-midterm-btn').boundingBox();
    assert(start && start.height >= 44 && start.y + start.height <= 800, 'Start is visible on opening the mobile setup');
    const colors = await page.locator('#start-midterm-btn').evaluate(el => [getComputedStyle(el).backgroundColor, getComputedStyle(el.parentElement).backgroundColor]);
    assert.notEqual(colors[0], colors[1], 'Start stands out from its surrounding surface');
    assert.deepEqual(await page.evaluate(require('./control-contrast.cjs').auditActionContrast, '#power-panel-midterm'), []);
    await page.locator('[data-toggle-scope-lec="1"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-toggle-scope-lec="1"]').getAttribute('aria-pressed'), 'false');
    assert(await page.locator('[data-toggle-scope-lec="1"]').evaluate(el => document.activeElement === el), 'lecture selection preserves keyboard focus');
  }, {viewport: {width: 360, height: 800}});
  await scenario('power-ui-exam-navigation-has-visible-active-flag-and-result-states', async ({page, go}) => {
    await openExam(page, go);
    const option = page.locator('[data-midterm-opt]').first();
    const choiceLabel = option.locator('.power-tool-badge');
    const labelBox = await choiceLabel.boundingBox(), answerBox = await option.locator('span').first().boundingBox();
    assert(labelBox.width >= 24 && labelBox.x + labelBox.width <= answerBox.x, 'choice letters have a distinct marker before the answer text');
    assert.equal(await page.locator('#midterm-active-question').getByText(/^1 \/ \d+$/, {exact:true}).evaluate(el => getComputedStyle(el).direction), 'ltr', 'question progress reads current / total in the RTL interface');
    await page.screenshot({path: path.resolve(__dirname, '../test-results/a1/power-ui-exam-current.png')});
    const pills = await page.locator('[data-midterm-jump]').evaluateAll(els => els.map(el => ({height: el.getBoundingClientRect().height, width: el.getBoundingClientRect().width, border: parseFloat(getComputedStyle(el).borderTopWidth)})));
    assert(pills.every(pill => pill.height >= 44 && pill.width >= 44 && pill.border >= 1), 'every question number is a visibly styled touch target');
    assert.equal(await page.locator('[data-midterm-jump="0"]').getAttribute('aria-current'), 'step');
    await page.locator('#midterm-flag-btn').click();
    await page.locator('[data-midterm-jump="1"]').click();
    const flagged = page.locator('[data-midterm-jump="0"]');
    assert((await flagged.getAttribute('aria-label')).includes('للمراجعة'));
    await page.locator('#midterm-submit-btn').click(); await page.locator('#midterm-confirm-submit').click();
    assert.equal(await page.locator('.midterm-q-pill.is-wrong-pill').count(), 10);
    assert.deepEqual(await page.evaluate(require('./control-contrast.cjs').auditActionContrast, '#power-panel-midterm'), []);
  }, {viewport: {width: 360, height: 800}});
  await scenario('power-ui-course-exam-entry-is-distinct-from-focus-timer', async ({page, go}) => {
    await settled(page); await go('subject.html?id=database-systems');
    const exam = page.locator('.course-exam-entry');
    assert.equal(await exam.count(), 1, 'the course has a dedicated practice-exam entry');
    assert((await page.locator('.course-power-bar').boundingBox()).height <= 160, 'course tools stay compact enough to leave room for lecture sources');
    assert((await exam.innerText()).includes('امتحان تدريبي'));
    assert.equal(await exam.locator('[data-open-power-tool="timer"]').count(), 0);
    await exam.locator('[data-open-power-tool="midterm"]').click();
    assert.equal(await page.locator('#power-modal-title').innerText(), 'امتحان الميدتيرم التدريبي');
    assert.equal(await page.locator('.power-modal-tabs').isVisible(), false, 'exam setup has no unrelated timer or notification tabs');
    assert.equal(await page.locator('#power-panel-midterm').getAttribute('role'), 'region');
    assert.equal(await page.locator('#power-panel-midterm').getAttribute('aria-labelledby'), 'power-modal-title');
    await page.locator('#power-modal-close').click();
    await page.locator('#portal-timer-nav-btn').click();
    assert.equal(await page.locator('#power-modal-title').innerText(), 'مؤقت المذاكرة');
    assert.equal(await page.locator('.power-modal-tabs').isVisible(), false);
    await page.locator('#study-timer-toggle-btn').waitFor();
  }, {viewport: {width: 390, height: 844}});
  await scenario('power-new-attempt-varies-options-and-keeps-correct-text-score-after-reload', async ({page, go}) => {
    const answers = {
      'What is the primary goal of Technical Report Writing compared to creative writing?': 'To convey complex technical information clearly, concisely, and accurately to support decision-making',
      'Which type of Abstract includes the actual key findings, numerical results, and main conclusions of the report?': 'Informative Abstract',
      'According to standard technical writing conventions, where should captions be placed for Tables and Figures?': 'Table captions go ABOVE the table; Figure captions go BELOW the figure',
      'How are in-text citations formatted in the IEEE referencing style commonly used in Computer Science and Engineering?': 'Bracketed numbers like [1], [2] numbered in the order they first appear in the text'
    };
    await settled(page); await page.addInitScript(() => { Math.random = () => .125; });
    await go('subject.html?id=report-writing');
    await page.locator('[data-open-power-tool="midterm"]').click();
    await page.locator('#start-midterm-btn').click();
    const layouts = [];
    for (let attempt = 0; attempt < 2; attempt++) {
      const layout = {};
      for (let index = 0; index < 4; index++) {
        await page.locator(`[data-midterm-jump="${index}"]`).click();
        const prompt = await page.locator('.midterm-q-prompt').innerText();
        assert(answers[prompt], 'every displayed report question retains its reviewed answer');
        layout[prompt] = await page.locator('[data-midterm-opt] > span:first-child').allTextContents();
        await page.locator('[data-midterm-opt]').filter({hasText: answers[prompt]}).click();
      }
      layouts.push(layout);
      if (attempt === 0) {
        const prompt = await page.locator('.midterm-q-prompt').innerText();
        await reloadTools(page); await page.locator('[data-open-power-tool="midterm"]').click();
        assert.deepEqual(await page.locator('[data-midterm-opt] > span:first-child').allTextContents(), layout[prompt], 'saved attempt keeps the same option order');
        assert.equal(await page.locator('[data-midterm-opt][aria-pressed="true"]').count(), 1);
      }
      await page.locator('#midterm-submit-btn').click();
      assert((await page.locator('#midterm-result-banner').innerText()).includes('4 من 4 (100%)'), 'correct answer text yields full score after remapping');
      if (attempt === 0) {
        await page.locator('#midterm-new-exam-btn').click();
        await page.evaluate(() => { Math.random = () => .875; });
        await page.locator('#start-midterm-btn').click();
      }
    }
    const goal = 'What is the primary goal of Technical Report Writing compared to creative writing?';
    assert.notDeepEqual(layouts[0][goal], layouts[1][goal], 'new attempts can change answer position when randomness changes');
  });
  for (const width of [360, 1440]) for (const theme of ['light', 'dark', 'reading']) await scenario(`power-ui-readable-${width}-${theme}`, async ({page, go}) => {
    const audit = require('./control-contrast.cjs').auditActionContrast;
    await settled(page); await go('subject.html?id=data-structure');
    if (await page.locator(`[data-theme-btn="${theme}"]`).isVisible()) await page.locator(`[data-theme-btn="${theme}"]`).click();
    else for (let step = 0; step < 3 && await page.locator('html').getAttribute('data-theme') !== theme; step++) await page.locator('#cycle-theme-btn').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
    assert.deepEqual(await page.evaluate(audit, '.course-power-bar'), []);
    await page.locator('[data-open-power-tool="midterm"]').click();
    await page.locator('#start-midterm-btn:enabled').waitFor();
    const start = await page.locator('#start-midterm-btn').boundingBox();
    assert(start && start.y >= 0 && start.y + start.height <= 800, 'setup opens with its start action visible');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    await page.locator('#midterm-count-select').selectOption('5');
    await page.locator('#midterm-timer-select').selectOption('10');
    assert((await page.locator('#midterm-setup-summary').innerText()).includes('5 سؤال · 10 دقيقة'));
    assert(await page.locator('#midterm-timer-select').evaluate(el => document.activeElement === el));
    await page.screenshot({path: path.resolve(__dirname, `../test-results/a1/power-ui-setup-${width}-${theme}.png`)});
    await page.locator('#start-midterm-btn').hover();
    assert.deepEqual(await page.evaluate(audit, '#power-panel-midterm'), [], 'setup labels remain readable under real hover');
    await page.locator('#start-midterm-btn').click();
    await page.locator('[data-midterm-opt="0"]').click();
    await page.locator('#midterm-flag-btn').click();
    await page.locator('[data-midterm-jump="1"]').click();
    assert.deepEqual(await page.evaluate(audit, '#power-panel-midterm'), [], 'active, answered and flagged controls remain readable');
    await page.screenshot({path: path.resolve(__dirname, `../test-results/a1/power-ui-exam-${width}-${theme}.png`)});
    await page.locator('#midterm-submit-btn').click(); await page.locator('#midterm-confirm-submit').click();
    await page.locator('#midterm-new-exam-btn').hover();
    assert.deepEqual(await page.evaluate(audit, '#power-panel-midterm'), [], 'result navigation and the hovered new-exam action remain readable');
    await page.screenshot({path: path.resolve(__dirname, `../test-results/a1/power-ui-result-${width}-${theme}.png`)});
  }, {viewport: {width, height: 800}});
  await scenario('power-shared-focus-pause-reset-and-new-session-supersede-stale-tabs', async ({page, context, go}) => {
    await settled(page); await go('index.html');
    const now = Date.now(); await context.clock.install({time: now});
    await page.locator('#portal-timer-nav-btn').click();
    await page.locator('[data-timer-preset="5"]').click();
    await page.locator('#study-timer-toggle-btn').click();
    const other = await context.newPage(); await settled(other); other.setDefaultTimeout(6000);
    // Playwright's clock belongs to the browser context, so both pages share it.
    await other.goto(page.url(), {waitUntil: 'domcontentloaded'});
    await other.locator('#portal-timer-nav-btn').click();
    await page.locator('#study-timer-toggle-btn').click();
    const paused = await page.locator('#study-timer-big-digits').innerText();
    await other.clock.fastForward(301000);
    await reloadTools(page); await page.locator('#portal-timer-nav-btn').click();
    assert.equal(await page.locator('#study-timer-big-digits').innerText(), paused, 'a stale tab cannot expire the shared paused session');
    assert.equal(await page.locator('#timer-completed-sessions').innerText(), '0');
    assert((await page.locator('#study-timer-toggle-btn').innerText()).includes('ابدأ'));
    await page.locator('[data-timer-preset="45"]').click();
    await other.clock.fastForward(301000);
    await reloadTools(page); await page.locator('#portal-timer-nav-btn').click();
    assert.equal(await page.locator('#study-timer-big-digits').innerText(), '45:00', 'reset supersedes the stale running snapshot');
    await page.locator('#study-timer-toggle-btn').click();
    await other.clock.fastForward(301000);
    await reloadTools(page); await page.locator('#portal-timer-nav-btn').click();
    const remaining = await page.locator('#study-timer-big-digits').innerText();
    assert(remaining >= '39:50' && remaining <= '40:00', 'new session retains its own deadline after another tab advances the old timer');
    assert.equal(await page.locator('#timer-completed-sessions').innerText(), '0');
    assert((await page.locator('#study-timer-toggle-btn').innerText()).includes('إيقاف'));
  });
  await scenario('power-one-shared-focus-session-is-counted-once-across-tabs', async ({page, context, go}) => {
    await settled(page); await go('index.html');
    const now = Date.now();
    await context.clock.install({time: now});
    await page.locator('#portal-timer-nav-btn').click();
    await page.locator('[data-timer-preset="5"]').click();
    await page.locator('#study-timer-toggle-btn').click();
    const other = await context.newPage();
    await settled(other); other.setDefaultTimeout(6000);
    await other.goto(page.url(), {waitUntil: 'domcontentloaded'});
    await other.locator('#portal-timer-nav-btn').click();
    await page.clock.fastForward(301000);
    await other.clock.fastForward(301000);
    await reloadTools(page);
    await page.locator('#portal-timer-nav-btn').click();
    assert.equal(await page.locator('#timer-completed-sessions').innerText(), '1', 'two tabs finishing one shared session count one completion');
    await page.locator('#study-timer-toggle-btn').click();
    await page.clock.fastForward(301000);
    assert.equal(await page.locator('#timer-completed-sessions').innerText(), '2', 'a new focus session counts separately');
  });
  await scenario('power-focus-timer-rejects-a-malformed-future-deadline', async ({page, go}) => {
    await settled(page); await go('index.html');
    await page.locator('#portal-timer-nav-btn').click();
    await page.locator('#study-timer-toggle-btn').click();
    // Browser storage is the approved saved-state boundary; simulate damaged persisted bytes.
    await page.evaluate(() => {
      const key = 'sem2_study_timer_active_v1';
      const saved = JSON.parse(localStorage.getItem(key));
      saved.deadline = Number.MAX_VALUE;
      localStorage.setItem(key, JSON.stringify(saved));
    });
    await reloadTools(page);
    await page.locator('#portal-timer-nav-btn').click();
    assert.equal(await page.locator('#study-timer-big-digits').innerText(), '25:00');
    assert((await page.locator('#study-timer-toggle-btn').innerText()).includes('ابدأ'));
  });
  await scenario('power-every-course-has-complete-lecture-scopes-and-starts', async ({page, go}) => {
    await settled(page);
    const courses = [
      ['data-structure', ['0', '1', '2', '3', '4', '5'], 28],
      ['computer-architecture', ['1', '2', '3', '4', '5'], 25],
      ['computer-graphics', ['1', '2', '3', '4', '5'], 8],
      ['database-systems', ['2', '3', '5'], 100],
      ['operating-system', ['1', '2', '3'], 100],
      ['report-writing', ['1', '2', '3', '4'], 4]
    ];
    for (const [course, lectures, minimum] of courses) {
      await go('subject.html?id=' + course);
      await page.locator('[data-open-power-tool="midterm"]').click();
      await page.locator('#start-midterm-btn:enabled').waitFor();
      assert.deepEqual((await page.locator('[data-toggle-scope-lec]').evaluateAll(els => els.map(el => el.dataset.toggleScopeLec))).sort(), lectures);
      await page.locator('#midterm-count-select').selectOption('all');
      await page.locator('#start-midterm-btn').click();
      assert(await page.locator('[data-midterm-jump]').count() >= minimum, course + ' includes its reviewed expanded bank');
    }
  });
  await scenario('power-db-bank-retains-reviewed-er-question', async ({page, go}) => {
    await settled(page); await go('subject.html?id=database-systems');
    await page.locator('[data-open-power-tool="midterm"]').click();
    await page.locator('[data-toggle-scope-lec="2"]').click();
    await page.locator('[data-toggle-scope-lec="5"]').click();
    await page.locator('#midterm-count-select').selectOption('all');
    await page.locator('#start-midterm-btn').click();
    const prompts = [];
    for (let i = 0; i < await page.locator('[data-midterm-jump]').count(); i++) {
      await page.locator(`[data-midterm-jump="${i}"]`).click();
      prompts.push(await page.locator('.midterm-q-prompt').innerText());
    }
    assert(prompts.includes('In the COMPANY ER diagram (Slide 7), how is a Weak Entity such as DEPENDENT represented?'));
    assert.equal(new Set(prompts.map(text => text.trim().toLowerCase())).size, prompts.length, 'duplicate questions appear only once');
  });
  await scenario('power-malformed-bank-retry-recovers-through-network', async ({page, go}) => {
    await settled(page);
    await page.route('**/js/course-question-bank.js*', route => route.fulfill({contentType: 'text/javascript', body: 'window.COURSE_QUESTION_BANK = {"database-systems": [{question: "Broken", lectureId: "2", options: ["A", "B"], correct: 99}]};'}));
    await go('subject.html?id=database-systems');
    await page.locator('[data-open-power-tool="midterm"]').click();
    await page.locator('#midterm-retry-bank').waitFor();
    await page.unroute('**/js/course-question-bank.js*');
    await page.locator('#midterm-retry-bank').click();
    await page.locator('#start-midterm-btn:enabled').waitFor();
  });
  await scenario('power-exam-deadline-expires-after-reload-and-pause-survives', async ({page, go}) => {
    await openExam(page, go);
    await page.clock.install();
    await page.locator('#midterm-pause-btn').click();
    const paused = await page.locator('#midterm-timer-display').innerText();
    await page.clock.fastForward(20 * 60 * 1000);
    assert.equal(await page.locator('#midterm-timer-display').innerText(), paused);
    await reloadTools(page);
    await page.locator('[data-open-power-tool="midterm"]').click();
    assert((await page.locator('#midterm-pause-btn').innerText()).includes('استئناف'));
    await page.locator('#midterm-pause-btn').click();
    await page.locator('#power-modal-close').click();
    await page.clock.fastForward(16 * 60 * 1000);
    await reloadTools(page);
    await page.locator('[data-open-power-tool="midterm"]').click();
    await page.locator('#midterm-result-banner').waitFor();
    assert((await page.locator('#midterm-result-banner').innerText()).includes('0 من'));
  });
  await scenario('power-storage-failure-shows-local-state-warning', async ({page, go}) => {
    await settled(page); await go('index.html');
    await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('storage blocked'); }; });
    await page.locator('#portal-timer-nav-btn').click();
    await page.locator('#study-timer-toggle-btn').click();
    await page.locator('#power-storage-warning').waitFor();
    assert((await page.locator('#power-storage-warning').innerText()).includes('قد تضيع'));
    assert((await page.locator('#study-timer-toggle-btn').innerText()).includes('إيقاف'));
  });
  await scenario('power-focus-timer-survives-navigation-and-pauses-explicitly', async ({page, go}) => {
    await settled(page); await go('index.html');
    await page.clock.install();
    await page.locator('#portal-timer-nav-btn').click();
    await page.locator('[data-timer-preset="5"]').click();
    await page.locator('#study-timer-toggle-btn').click();
    await page.clock.runFor(3100);
    await go('subject.html?id=database-systems');
    await page.locator('#portal-timer-nav-btn').click();
    const remaining = await page.locator('#study-timer-big-digits').innerText();
    assert(remaining < '05:00' && remaining >= '04:50', 'navigation retains elapsed focus time');
    assert((await page.locator('#study-timer-toggle-btn').innerText()).includes('إيقاف'));
    await page.locator('#study-timer-toggle-btn').click();
    const paused = await page.locator('#study-timer-big-digits').innerText();
    await page.clock.runFor(5000);
    assert.equal(await page.locator('#study-timer-big-digits').innerText(), paused);
  });
  await scenario('power-exam-preserves-keyboard-focus-and-confirms-unfinished-submit', async ({page, go}) => {
    await openExam(page, go);
    await page.locator('[data-midterm-opt="0"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-midterm-opt="0"]').evaluate(el => document.activeElement === el), true);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('[data-midterm-opt="1"]').evaluate(el => document.activeElement === el), true);
    await page.locator('#midterm-submit-btn').click();
    assert.equal(await page.locator('#midterm-result-banner').count(), 0);
    await page.locator('#midterm-cancel-submit').click();
    assert.equal(await page.locator('#midterm-result-banner').count(), 0);
    await page.locator('#midterm-submit-btn').click();
    await page.locator('#midterm-confirm-submit').click();
    await page.locator('#midterm-result-banner').waitFor();
  });
  await scenario('power-exam-balances-selected-lectures', async ({page, go}) => {
    await settled(page); await go('subject.html?id=data-structure');
    await page.locator('[data-open-power-tool="midterm"]').click();
    const selected = await page.locator('[data-toggle-scope-lec][aria-pressed="true"]').allTextContents();
    await page.locator('#midterm-count-select').selectOption('10');
    await page.locator('#start-midterm-btn').click();
    const labels = [];
    for (let i = 0; i < await page.locator('[data-midterm-jump]').count(); i++) {
      await page.locator(`[data-midterm-jump="${i}"]`).click();
      labels.push(await page.locator('#midterm-active-question .smart-card-tag').innerText());
    }
    for (const lecture of selected) assert(labels.some(label => lecture.includes(label)), 'exam must include every selected lecture when its length permits: ' + lecture);
  });
  await scenario('power-notifications-mark-visible-course-and-sync-other-tab', async ({page, context, go}) => {
    await settled(page); await go('subject.html?id=database-systems');
    const other = await context.newPage(); await other.goto(page.url(), {waitUntil: 'domcontentloaded'});
    const initial = Number(await page.locator('#portal-notif-bell-btn [data-notif-unread-badge]').innerText());
    await page.locator('#portal-notif-bell-btn').click();
    await page.locator('[data-notif-scope="course"]').click();
    const visible = await page.locator('[data-notif-id]').count();
    assert(visible > 0 && visible < initial);
    await page.locator('#mark-all-notifs-read').click();
    assert.equal(Number(await page.locator('#portal-notif-bell-btn [data-notif-unread-badge]').innerText()), initial - visible);
    await other.waitForFunction(value => Number(document.querySelector('#portal-notif-bell-btn [data-notif-unread-badge]').textContent) === value, initial - visible);
  });
  await scenario('power-mobile-focused-timer-fits-and-course-tabs-use-arrow-keys', async ({page, go}) => {
    await settled(page); await go('subject.html?id=database-systems');
    await page.locator('#portal-timer-nav-btn').click();
    const start = await page.locator('#study-timer-toggle-btn').boundingBox();
    assert(start && start.y + start.height < 780, 'start timer is visible at 360 × 800 without scrolling');
    const header = await page.locator('.power-modal-header').boundingBox();
    assert(header.height < 200, 'mobile modal chrome stays compact');
    assert.equal(await page.locator('.power-modal-tabs').isVisible(), false);
    await page.locator('#power-modal-close').click();
    await page.locator('[data-open-power-tool="interactive"]').click();
    await page.locator('[data-power-tab="interactive"]').focus();
    await page.keyboard.press('End');
    assert.equal(await page.locator('[data-power-tab="midterm"]').getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('[role="tab"][tabindex="0"]:visible').count(), 1);
    await page.keyboard.press('Home');
    assert.equal(await page.locator('[data-power-tab="interactive"]').getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('[data-power-tab="timer"]').isVisible(), false);
    assert.equal(await page.locator('[data-power-tab="notifications"]').isVisible(), false);
  }, {viewport: {width: 360, height: 800}});
  await scenario('power-bank-failure-is-visible-and-retryable', async ({page, go}) => {
    await settled(page);
    await page.route('**/js/course-question-bank.js*', route => route.abort());
    await go('subject.html?id=database-systems');
    await page.locator('[data-open-power-tool="midterm"]').click();
    await page.locator('#midterm-retry-bank').waitFor();
    assert((await page.locator('#power-panel-midterm').innerText()).includes('غير مكتمل'));
    assert.equal(await page.locator('#start-midterm-btn').isEnabled(), false);
    await page.unroute('**/js/course-question-bank.js*');
    await page.locator('#midterm-retry-bank').click();
    await page.locator('#start-midterm-btn:enabled').waitFor();
    assert.equal(await page.locator('#midterm-retry-bank').count(), 0);
    assert.equal(await page.locator('[data-toggle-scope-lec="2"]').getAttribute('aria-pressed'), 'true', 'retry selects the newly restored lecture bank');
    assert.equal(await page.locator('[data-toggle-scope-lec="3"]').getAttribute('aria-pressed'), 'true');
  });
  await scenario('power-exam-keeps-time-and-saved-answer-after-close-and-reload', async ({page, go}) => {
    await openExam(page, go);
    const first = await page.locator('#midterm-timer-display').innerText();
    await page.locator('[data-midterm-opt="0"]').click();
    await page.locator('#midterm-flag-btn').click();
    await page.locator('#power-modal-close').click();
    await page.waitForTimeout(2100);
    await page.locator('[data-open-power-tool="midterm"]').click();
    assert.notEqual(await page.locator('#midterm-timer-display').innerText(), first, 'closing the modal must not freeze the attempt');
    await page.locator('[data-midterm-jump="1"]').click();
    await reloadTools(page);
    await page.locator('[data-open-power-tool="midterm"]').click();
    assert.equal(await page.locator('[data-midterm-jump="1"]').getAttribute('class'), 'midterm-q-pill is-current');
    await page.locator('[data-midterm-jump="0"]').click();
    assert.equal(await page.locator('[data-midterm-opt="0"]').getAttribute('aria-pressed'), 'true');
    assert((await page.locator('#midterm-flag-btn').innerText()).includes('إزالة'));
    assert.equal(await page.locator('#start-midterm-btn').count(), 0);
  });
};
