const assert = require('node:assert/strict');
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
  await scenario('power-mobile-timer-start-fits-and-tabs-use-arrow-keys', async ({page, go}) => {
    await settled(page); await go('subject.html?id=database-systems');
    await page.locator('#portal-timer-nav-btn').click();
    const start = await page.locator('#study-timer-toggle-btn').boundingBox();
    assert(start && start.y + start.height < 780, 'start timer is visible at 360 × 800 without scrolling');
    const header = await page.locator('.power-modal-header').boundingBox();
    assert(header.height < 200, 'mobile modal chrome stays compact');
    await page.locator('[data-power-tab="timer"]').focus();
    await page.keyboard.press('End');
    assert.equal(await page.locator('[data-power-tab="notifications"]').getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('[role="tab"][tabindex="0"]').count(), 1);
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
