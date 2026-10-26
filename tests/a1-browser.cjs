/* A1 behavior regression suite; uses real Chrome and the production entrypoints. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium} = require('playwright');
const {resource,question,details} = require('./journey-helpers.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'test-results', 'a1');
const results = [];
const filter = new RegExp(process.env.PORTAL_A1_FILTER || '.*');
let browser, server, base;
async function scenario(name, fn, options = {}) {
  if (!filter.test(name)) return;
  const context = await browser.newContext({viewport: {width: 1440, height: 900}, ...options});
  await context.route('https://**', route => route.abort());
  const page = await context.newPage();
  const errors = [];
  page.setDefaultTimeout(6000);
  page.on('pageerror', error => errors.push(error.message));
  try {
    await fn({page, context, go: route => page.goto(base + route), errors});
    assert.deepEqual(errors, [], 'no page errors');
    results.push({name, passed: true});
    console.log('PASS', name);
  } catch (error) {
    results.push({name, passed: false, error: error.stack, errors});
    await page.screenshot({path: path.join(output, name + '-failure.png')}).catch(() => {});
    console.log('FAIL', name, error.message.slice(0, 220));
  } finally { await context.close(); }
}
async function settled(page) {
  await page.addInitScript(() => {
    localStorage.setItem('sem2_first_visit_configured', 'true');
    window.sessionStorage.setItem('sem2-studio-rift-intro-v3', 'seen');
  });
}
async function main() {
  fs.mkdirSync(output, {recursive: true});
  server = http.createServer((request, response) => {
    const relative = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\/Sem2_portal\//, '/');
    const target = path.resolve(root, '.' + relative + (relative.endsWith('/') ? 'index.html' : ''));
    if (!target.startsWith(root + path.sep)) { response.writeHead(403); response.end(); return; }
    fs.readFile(target, (error, bytes) => {
      if (error) { response.writeHead(404); response.end(); return; }
      response.setHeader('Content-Type', ({'.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2'})[path.extname(target)] || 'application/octet-stream');
      response.end(bytes);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/Sem2_portal/`;
  browser = await chromium.launch({headless: true,
    // Hosted CI has no physical GPU; keep the WebGL path reproducible in isolation.
    args: process.env.CI ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : [],
    ...(fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe') ? {executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'} : {})});
  await require('./studio-scroll-intro.cjs').register({scenario});
  await require('./studio-features.cjs').register({scenario});
  await require('./power-tools-browser.cjs').register({scenario});
  await require('./study-shell-browser.cjs').register({scenario});
  await require('./study-integration-browser.cjs').register({scenario});
  await require('./release-features-browser.cjs').register({scenario});
  await require('./performance-browser.cjs').register({scenario});
  await scenario('a1-shell-and-real-course-actions', async ({page, go}) => {
    await settled(page); await go('index.html');
    assert.equal(await page.locator('body > header').evaluate(el => getComputedStyle(el).position), 'fixed');
    assert.equal(await page.locator('#courses-grid article').count(), 6);
    assert.equal(await page.locator('#courses-grid h3').first().evaluate(el => getComputedStyle(el).fontSize), '20px');
    assert.equal(await page.locator('#courses-grid article').first().locator('.a1-course-link').count(), 1);
    await page.locator('#search-input').fill('Database Systems');
    assert.equal(await page.locator('#courses-grid article').count(), 1);
    assert((await page.locator('#courses-grid').innerText()).includes('Database Systems'));
    await page.locator('#clear-search').click();
    assert.equal(await page.locator('#courses-grid article').count(), 6);
    assert.equal(await page.locator('.preview-bar,.resume,[data-cursor-choice]').count(), 0);
  });


  await scenario('a1-action-content-has-visible-contrast', async ({page, go}) => {
    await settled(page); await go('index.html#schedule-section'); await page.evaluate(() => window.PortalTheme.setTheme('light'));
    await page.waitForTimeout(350);
    const {auditActionContrast} = require('./control-contrast.cjs');
    assert.deepEqual(await page.evaluate(auditActionContrast, '#schedule-section'), [], 'schedule actions must have readable text/icons on the actual surface');
    await go('subject.html?id=computer-architecture&track=lecture'); await page.evaluate(() => window.PortalTheme.setTheme('light')); await page.waitForTimeout(350);
    await resource(page, 'videos');
    const external = page.locator('#video-explanations-list a[title="فتح في تطبيق YouTube"]').first();
    assert(await external.locator('svg').count(), 'video external-link icon exists');
    assert.deepEqual(await page.evaluate(auditActionContrast, '#video-explanations-list'), [], 'video actions must have readable text/icons on the actual surface');
  });
  await scenario('a1-all-icon-placeholders-resolve', async ({page, go}) => {
    await settled(page);
    for (const course of require('../docs/A1-CONTENT-BASELINE.json').courses) {
      await go('subject.html?id=' + course.id);
      assert.deepEqual(await page.locator('i[data-lucide]').evaluateAll(xs => xs.map(x => x.dataset.lucide)), [], course.id + ': every requested icon must actually render');
    }
  });
  await scenario('a1-journey-course-first-home-and-timetable', async ({page, go}) => {
    await settled(page); await go('index.html');
    assert.equal(await page.locator('#courses-grid .a1-course-link').count(), 6);
    assert.equal(await page.locator('#courses-grid .a1-course-staff').count(), 0, 'staff belongs in course context, not every home tile');
    assert.equal(await page.locator('#schedule-section').isVisible(), false);
    await page.locator('.studio-rail nav a[href="#schedule-section"]').click();
    await page.locator('#schedule-section').waitFor({state: 'visible'});
    assert(await page.locator('#schedule-section').isVisible());
    assert.equal(await page.locator('#courses-section').isVisible(), false);
    await page.locator('.studio-rail nav a[href="#courses-section"]').click();
    await page.locator('#courses-section').waitFor({state: 'visible'});
    assert(await page.locator('#courses-section').isVisible());
    await page.locator('#courses-grid .a1-course-link').first().click();
    assert(new URL(page.url()).pathname.endsWith('/subject.html'));
  });
  await scenario('a1-journey-one-resource-family-at-a-time', async ({page, go}) => {
    await settled(page); await go('subject.html?id=computer-architecture');
    assert(await page.locator('#lectures-list').isVisible());
    assert.equal(await page.locator('#video-explanations-list').isVisible(), false);
    await page.locator('[data-resource-kind="videos"]').click();
    assert(await page.locator('#video-explanations-list').isVisible());
    assert.equal(await page.locator('#lectures-list').isVisible(), false);
    await page.locator('[data-resource-kind="sections"]').click();
    assert(await page.locator('#sections-list').isVisible());
    assert.equal(new URL(page.url()).searchParams.get('track'), 'section');
    await page.locator('[data-resource-kind="resources"]').click();
    assert(await page.locator('#exp-main-btn').isVisible());
  });
  await scenario('a1-journey-focused-reader-and-one-question', async ({page, go}) => {
    await settled(page); await go('subject.html?id=database-systems');
    await page.locator('[data-open-study-lecture="2"]').first().click();
    await page.locator('#slide-card-1').waitFor();
    assert.equal(await page.locator('.slide-study-card:visible').count(), 1);
    await page.locator('[data-reader-step="next"]').click();
    assert(await page.locator('#slide-card-2').isVisible());
    assert.equal(await page.locator('#slide-card-1').isVisible(), false);
    await page.locator('[data-reader-mode="slide"]').click();
    await page.locator('#slide-card-2 img').waitFor({state: 'visible'});
    assert(await page.locator('#slide-card-2 img').isVisible());
    await page.locator('#study-tab-btn-quiz').click();
    assert.equal(await page.locator('[data-qid].glass-panel:visible').count(), 1);
    await page.locator('[data-quiz-step="next"]').click();
    assert(await page.locator('#full-q-2').isVisible());
    assert.equal(await page.locator('#full-q-1').isVisible(), false);
  });
  await scenario('a1-journey-default-course-and-real-reader-zoom', async ({page, go}) => {
    await settled(page); await go('subject.html');
    assert.equal(await page.locator('.a1-resource-tabs').count(), 1, 'bare subject URL keeps the existing default-course behavior');
    await go('subject.html?id=database-systems');
    await page.locator('[data-open-study-lecture="2"]').first().click();
    const paragraph = page.locator('#slide-card-1 [data-reader-part="explanation"] p').first();
    await paragraph.waitFor();
    const normal = await paragraph.evaluate(el => Number.parseFloat(getComputedStyle(el).fontSize));
    await page.locator('#study-font-zoom-in').click();
    const larger = await paragraph.evaluate(el => Number.parseFloat(getComputedStyle(el).fontSize));
    assert(larger > normal, `font zoom must actually enlarge reading text (${normal} -> ${larger})`);
    await page.locator('#study-font-zoom-in').click();
    assert(await paragraph.evaluate(el => Number.parseFloat(getComputedStyle(el).fontSize)) > larger);
  });
  await scenario('a1-journey-back-and-switch-course-retain-source-kind', async ({page, go}) => {
    await settled(page); await go('subject.html?id=computer-architecture');
    await resource(page, 'videos'); await resource(page, 'sections'); await page.goBack();
    await page.waitForFunction(() => document.body?.dataset.resourceKind === 'videos');
    await page.locator('#quick-course-select').selectOption('computer-graphics');
    await page.waitForFunction(() => document.body?.dataset.resourceKind === 'videos');
    assert(await page.locator('#video-explanations-list').isVisible());
    assert((await page.locator('#subject-title-en').innerText()).includes('Computer Graphics'));
  });
  await scenario('a1-journey-saved-theme-and-quiz-reset-focus', async ({page, go}) => {
    await settled(page); await page.addInitScript(() => localStorage.setItem('sem2_portal_theme', 'light'));
    await page.route('**/js/theme.js*', async route => {
      await new Promise(resolve => setTimeout(resolve, 200));
      await route.continue();
    });
    await go('subject.html?id=database-systems');
    assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(245, 246, 251)', 'saved light theme must be applied before the content paints');
    await page.locator('[data-open-study-lecture="2"]').first().click(); await page.locator('#study-tab-btn-quiz').click();
    await page.locator('#full-quiz-reset-btn').click();
    assert(await page.locator('#full-q-1').evaluate(el => el === document.activeElement || el.contains(document.activeElement)), 'reset returns keyboard focus to question one');
  });
  await scenario('a1-journey-keyboard-continues-in-current-content', async ({page, go}) => {
    await settled(page); await go('subject.html?id=database-systems');
    await page.locator('[data-open-study-lecture="2"]').first().click(); await page.locator('[data-reader-step="next"]').click();
    await page.keyboard.press('Tab');
    assert(await page.evaluate(() => !!document.activeElement.closest('.a1-reader-body')), 'Tab from the selected slide must continue in the reading pane');
    await page.locator('#study-tab-btn-quiz').click(); await page.locator('[data-quiz-step="next"]').click();
    await page.keyboard.press('Tab');
    assert(await page.locator('#full-q-2').evaluate(el => el.contains(document.activeElement)), 'Tab from the current question must reach its answer options');
    await page.locator('#lecture-study-modal').evaluate(el => { const tail = document.createElement('p'); tail.tabIndex = -1; el.append(tail); tail.focus(); });
    await page.keyboard.press('Tab');
    assert(await page.locator('#lecture-study-modal').evaluate(el => el.contains(document.activeElement)), 'non-tabbable internal focus at the boundary still wraps inside the dialog');
  });
  await scenario('a1-journey-mobile-outline-follows-current-slide', async ({page, go}) => {
    await settled(page); await go('subject.html?id=database-systems');
    await page.locator('[data-open-study-lecture="2"]').first().click();
    for (let i = 0; i < 12; i++) await page.locator('[data-reader-step="next"]').click();
    const pill = await page.locator('.study-jump-pill[aria-current="step"]').boundingBox();
    const rail = await page.locator('#study-jump-bar').boundingBox();
    assert(pill.x >= rail.x - 1 && pill.x + pill.width <= rail.x + rail.width + 1, 'selected slide 13 is visible in its outline');
  }, {viewport: {width: 360, height: 900}});
  await scenario('a1-journey-mobile-primary-material-reachable', async ({page, go}) => {
    // Exercise the existing fallback on hosts without Windows' Segoe UI too.
    await page.route('**/*.css*', async route => {
      const response = await route.fetch();
      await route.fulfill({response, body: (await response.text()).replaceAll("'Segoe UI'", 'Arial')});
    });
    await settled(page); await go('subject.html?id=database-systems');
    await page.evaluate(() => document.fonts.ready);
    const action = await page.locator('[data-atlas-start]').boundingBox();
    assert(action && action.y + action.height <= 900, 'the first real lecture action is visible without scrolling through repeated section introductions');
  }, {viewport: {width: 360, height: 900}});
  for (const width of [360, 1440]) for (const theme of ['light', 'dark', 'reading']) await scenario(`a1-all-action-states-${width}-${theme}`, async ({page, go}) => {
    const {auditActionContrast} = require('./control-contrast.cjs');
    const courses = require('../docs/A1-CONTENT-BASELINE.json').courses;
    await settled(page);
    await page.addInitScript(value => localStorage.setItem('sem2_portal_theme', value), theme);
    const problems = [], observations = [], covered = new Set();
    const routes = ['index.html', 'index.html#schedule-section', ...courses.flatMap(c => ['lectures', 'sections', 'videos', 'assignments', 'resources'].map(kind => `subject.html?id=${c.id}&track=${['sections','assignments'].includes(kind) ? 'section' : 'lecture'}&kind=${kind}`))];
    for (const route of routes) {
      await go(route);
      const context = page.locator('.a1-course-context');
      if (await context.count() && !await context.evaluate(el => el.open)) await context.locator('summary').click();
      const initial = await page.evaluate(auditActionContrast);
      problems.push(...initial.map(issue => ({route, state: 'default', ...issue})));
      const probes = await page.evaluate(() => {
        const seen = new Set(), indices = [];
        [...document.querySelectorAll('button,a[href],summary,select,input')].forEach((el, i) => {
          if (!el.getClientRects().length || getComputedStyle(el).visibility !== 'visible' || el.disabled || !el.className.includes('hover:')) return;
          const colors = []; for (let parent = el; parent; parent = parent.parentElement) colors.push(getComputedStyle(parent).backgroundColor);
          const signature = el.tagName + '|' + el.className + '|' + getComputedStyle(el).color + '|' + colors.join('/');
          if (!seen.has(signature)) { seen.add(signature); indices.push({index: i, signature}); }
        });
        return indices;
      });
      const controls = page.locator('button,a[href],summary,select,input');
      let tested = 0;
      for (const {index, signature} of probes) {
        if (covered.has(signature)) continue;
        covered.add(signature); tested++;
        const control = controls.nth(index);
        await control.evaluate(el => { el.scrollIntoView({block: 'center'}); el.setAttribute('data-contrast-probe', 'active'); });
        await control.hover();
        const hover = await page.evaluate(auditActionContrast, '[data-contrast-probe="active"]');
        problems.push(...hover.map(issue => ({route, state: 'hover', ...issue})));
        await page.mouse.move(1, 1); await page.keyboard.press('Tab'); await control.focus();
        const focus = await page.evaluate(auditActionContrast, '[data-contrast-probe="active"]');
        problems.push(...focus.map(issue => ({route, state: 'focus', ...issue})));
        // Exercise real :active painting without following the link or invoking its action.
        await page.evaluate(() => document.addEventListener('click', event => { event.preventDefault(); event.stopImmediatePropagation(); }, {capture: true, once: true}));
        await control.hover(); await page.mouse.down();
        const active = await page.evaluate(auditActionContrast, '[data-contrast-probe="active"]');
        problems.push(...active.map(issue => ({route, state: 'active', ...issue})));
        await page.mouse.up();
        await control.evaluate(el => el.removeAttribute('data-contrast-probe'));
      }
      observations.push({route, defaultIssues: initial.length, interactionVariants: tested});
    }
    fs.writeFileSync(path.join(output, `control-audit-${width}-${theme}.json`), JSON.stringify({observations, problems}, null, 2));
    assert.equal(problems.length, 0, `${problems.length} action contrast failures; first: ${JSON.stringify(problems.slice(0, 2))}`);
  }, {viewport: {width, height: 900}, reducedMotion: 'reduce'});
  for (const width of [360, 1440]) for (const theme of ['light', 'dark', 'reading']) await scenario(`a1-dialog-action-states-${width}-${theme}`, async ({page, go}) => {
    const {auditActionContrast} = require('./control-contrast.cjs');
    await settled(page); await page.addInitScript(value => localStorage.setItem('sem2_portal_theme', value), theme);
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', {get: () => undefined}));
    const problems = [];
    const check = async (selector, state) => {
      const issues = await page.evaluate(auditActionContrast, selector);
      problems.push(...issues.map(issue => ({state, ...issue})));
    };
    await go('subject.html?id=database-systems');
    await page.locator('header [data-open-profile-modal]').click();
    await check('#student-profile-modal', 'profile');
    await page.keyboard.press('Tab'); await page.locator('input[name="student_group"][value="B2"]').focus();
    if (await page.locator('input[name="student_group"][value="B2"]').evaluate(el => getComputedStyle(el.nextElementSibling).outlineStyle) === 'none') problems.push({state: 'profile-keyboard-focus', name: 'group radio', issue: 'no visible focus on the custom control'});
    await page.keyboard.press('Escape');
    await page.locator('[data-open-study-lecture="2"]').first().click();
    await page.locator('#study-slides-feed img').first().waitFor({state: 'attached'});
    await check('#lecture-study-modal', 'reader-and-slide-quiz');
    await page.locator('#study-tab-btn-quiz').click();
    await check('#lecture-study-modal', 'quiz-unanswered');
    const answers = await page.evaluate(() => window.LECTURE_EXPLANATIONS['database-systems'][2].fullQuiz.slice(0, 2).map(q => ({id: q.id, correct: q.correct, count: q.options.length})));
    await page.locator(`.full-quiz-opt-btn[data-qid="${answers[0].id}"][data-opt-idx="${answers[0].correct}"]`).click();
    await question(page, answers[1].id);
    await page.locator(`.full-quiz-opt-btn[data-qid="${answers[1].id}"][data-opt-idx="${(answers[1].correct + 1) % answers[1].count}"]`).click();
    await check('#lecture-study-modal', 'quiz-correct-and-wrong');
    await page.keyboard.press('Escape');
    await page.locator('#share-btn').click(); await page.locator('#copy-link-fallback').waitFor();
    await check('#copy-link-fallback', 'clipboard-fallback'); await page.keyboard.press('Escape');
    await page.locator('#lectures-list [data-preview-file]').first().click();
    await page.locator('#pdf-modal').waitFor(); await check('#pdf-modal', 'pdf'); await page.keyboard.press('Escape');
    await resource(page, 'videos');
    await page.locator('#video-explanations-list [data-play-url]').first().click();
    await page.locator('#video-modal').waitFor(); await check('#video-modal', 'video'); await page.keyboard.press('Escape');
    fs.writeFileSync(path.join(output, `dialog-control-audit-${width}-${theme}.json`), JSON.stringify({problems}, null, 2));
    assert.equal(problems.length, 0, `${problems.length} dialog contrast failures; first: ${JSON.stringify(problems.slice(0, 2))}`);
  }, {viewport: {width, height: 900}, reducedMotion: 'reduce'});
  await scenario('a1-user-button-examples-rendered', async ({page, go}) => {
    const {auditActionContrast} = require('./control-contrast.cjs');
    await settled(page); await page.addInitScript(() => localStorage.setItem('sem2_portal_theme', 'light'));
    const examples = [
      {route: 'index.html#schedule-section', selector: '#schedule-section [data-open-profile-modal]', scope: '#schedule-section', name: 'schedule'},
      {route: 'subject.html?id=computer-architecture&track=lecture', selector: '#video-explanations-list a[title="فتح في تطبيق YouTube"]', scope: '#video-explanations-list', name: 'video-external'},
      {route: 'subject.html?id=computer-graphics&track=lecture', selector: '#lectures-list a[title="فتح في Google Drive في نافذة جديدة"]', scope: '#lectures-list', name: 'drive-external'}
    ];
    for (const example of examples) {
      await go(example.route); await page.waitForTimeout(350);
      await page.locator('header [data-open-profile-modal]').click();
      await page.locator('input[name="student_section"][value="2"]').locator('..').click();
      await page.locator('#profile-selection-form button[type="submit"]').click();
      if (example.name === 'video-external') await resource(page, 'videos');
      const control = page.locator(example.selector).first();
      await control.evaluate(el => el.scrollIntoView({block: 'center'}));
      await control.hover(); await page.waitForTimeout(350);
      assert.deepEqual(await page.evaluate(auditActionContrast, example.scope), [], example.name + ' content remains readable under real motion/hover settings');
      await page.screenshot({path: path.join(output, `fixed-${example.name}-1440.png`)});
    }
  });






  await scenario('a1-no-intro-for-reduced-motion', async ({page, go}) => {
    await settled(page); await go('index.html?intro=processor');
    assert.equal(await page.locator('.processor-intro').count(), 0);
    assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').filter(x => /ScrollTrigger|InertiaPlugin|processor-intro\.js/.test(x.name)).length), 0);
  }, {reducedMotion: 'reduce'});
  await scenario('a1-no-intro-with-unavailable-session-storage', async ({page, go}) => {
    await page.addInitScript(() => { Storage.prototype.getItem = () => { throw new Error('blocked'); }; Storage.prototype.setItem = () => { throw new Error('blocked'); }; });
    await go('index.html');
    assert.equal(await page.locator('.processor-intro').count(), 0);
    await page.locator('#student-profile-modal').waitFor({state: 'visible'});
    await page.keyboard.press('Escape');
    assert(await page.locator('body > header').isVisible());
  });
  await scenario('a1-current-source-actions-parity', async ({page, go}) => {
    await settled(page);
    const baseline = require('../docs/A1-CONTENT-BASELINE.json');
    for (const course of baseline.courses) {
      await go('subject.html?id=' + course.id);
      assert.equal(await page.locator('#quick-course-select option').count(), 6);
      assert.equal(await page.locator('#exp-main-btn').getAttribute('href'), course.explanationSite.url);
      assert.equal(await page.locator('#course-drive-folder-link').getAttribute('href'), course.driveFolderUrl);
      assert.deepEqual(await page.locator('#video-explanations-list [data-play-url]').evaluateAll(xs => xs.map(x => x.dataset.playUrl)), course.videoExplanations.map(x => x.url));
      assert.deepEqual(await page.locator('#lectures-list [data-preview-file]').evaluateAll(xs => xs.map(x => x.dataset.previewFile)), course.lectures.map(x => x.drivePreviewUrl || x.pdfUrl || x.slidesUrl || '#'));
      for (const lecture of course.lectures) if (lecture.studyManualUrl) assert(await page.locator('#lectures-list a').evaluateAll((xs, url) => xs.some(x => x.getAttribute('href') === url), lecture.studyManualUrl));
      await resource(page, 'resources');
      const allTheory = page.locator('.btn-toggle-all-theory');
      if (await allTheory.count()) await allTheory.click();
      for (const item of course.resources || []) assert(await page.locator('#theory-resources-list a').evaluateAll((xs, url) => xs.some(x => x.getAttribute('href') === url), item.fileUrl));
      await resource(page, 'sections');
      if (await page.locator('[data-ta-filter="all"]').count()) await page.locator('[data-ta-filter="all"]').click();
      assert.deepEqual(await page.locator('#sections-list [data-preview-file]').evaluateAll(xs => xs.map(x => x.dataset.previewFile)), course.sections.map(x => x.drivePreviewUrl || x.sheetUrl || '#'));
      await resource(page, 'resources');
      for (const item of course.practicalResources || []) {
        const allPractical = page.locator('.btn-toggle-all-practical');
        if (await allPractical.count()) await allPractical.click();
        assert(await page.locator('#practical-resources-list a').evaluateAll((xs, url) => xs.some(x => x.getAttribute('href') === url), item.fileUrl));
      }
      await resource(page, 'assignments');
      await details(page, '#assignments-list');
      for (const assignment of course.assignments || []) {
        assert((await page.locator('#assignments-list').innerText()).includes(assignment.title));
        assert((await page.locator('#assignments-list').innerText()).includes(assignment.deadline));
      }
      if (!await page.locator('.a1-course-context').evaluate(el => el.open)) await page.locator('.a1-course-context>summary').click();
      for (let section = 1; section <= 12; section++) {
        const expectedDoctor = await page.evaluate(s => {
          window.StudentProfile.set('B' + Math.ceil(s / 4), s);
          const courseId = new URLSearchParams(window.location.search).get('id');
          return window.StudentProfile.getCourseStaff(courseId).doctor;
        }, section);
        await resource(page, 'lectures');
        assert(await page.locator('#track-panel-lecture').isVisible());
        assert((await page.locator('#subject-doctor').innerText()).includes(expectedDoctor));
        await resource(page, 'sections');
        assert(await page.locator('#track-panel-section').isVisible());
      }
    }
  });
  await scenario('a1-header-and-dialog-controls-fit-mobile', async ({page, go}) => {
    await settled(page);
    for (const width of [360, 390, 412]) {
      await page.setViewportSize({width, height: 900}); await go('subject.html?id=database-systems');
      for (const selector of ['#share-btn', '#cycle-theme-btn', 'header [data-open-profile-modal]']) {
        const rect = await page.locator(selector).boundingBox();
        assert(rect && rect.x >= 0 && rect.x + rect.width <= width + 1, selector + ' fits ' + width);
      }
      const profile = await page.locator('header [data-open-profile-modal]').boundingBox();
      for (const selector of ['.a1-brand strong', '.a1-brand-mark']) if (await page.locator(selector).isVisible()) {
        const brand = await page.locator(selector).boundingBox();
        assert(brand.x >= profile.x + profile.width || brand.x + brand.width <= profile.x, selector + ' must not overlap profile at ' + width);
      }
      await page.locator('[data-open-study-lecture="2"]').first().click();
      for (const selector of ['#study-font-zoom-in', '#study-font-zoom-out', '#study-modal-close', '#study-modal-fullscreen', '#study-tab-btn-quiz']) {
        const rect = await page.locator(selector).boundingBox();
        assert(rect && rect.x >= 0 && rect.x + rect.width <= width + 1 && rect.y >= 0 && rect.y + rect.height <= 900, selector + ' fits ' + width);
      }
      await page.locator('#study-modal-close').click();
    }
  });
  await scenario('a1-200-percent-reflow-and-keyboard', async ({page, go}) => {
    await settled(page);
    // 1440x900 physical desktop at 200%: 720x450 CSS viewport, DPR 2.
    await go('index.html');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.className), 'a1-skip');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'main-content');
    await page.screenshot({path: path.join(output, 'reflow-200-percent.png')});
    await go('subject.html?id=database-systems');
    await page.locator('[data-open-study-lecture="3"]').first().click();
    await page.locator('#study-slides-feed img').first().waitFor({state: 'attached'});
    assert.equal(await page.locator('#study-slides-feed img').count(), 32);
    await page.locator('#study-tab-btn-quiz').click();
    assert.equal(await page.locator('.full-quiz-opt-btn').count(), 120);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#lecture-study-modal').isVisible(), false);
  }, {viewport: {width: 720, height: 450}, deviceScaleFactor: 2});
  // Static capture matrix: motion has dedicated interactive cases; keep software-GPU screenshots deterministic.
  for (const width of [360, 390, 412, 768, 1024, 1440]) await scenario('a1-rendered-' + width, async ({page, go}) => {
    await settled(page); await go('index.html');
    for (const theme of ['light', 'dark', 'reading']) {
      await page.evaluate(value => window.PortalTheme.setTheme(value), theme);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
      assert.equal(await page.locator('#courses-grid h3').first().evaluate(el => getComputedStyle(el).fontSize), width <= 760 ? '18px' : '20px');
      assert.equal(await page.locator('#courses-grid article').count(), 6);
      await page.screenshot({animations: 'disabled', timeout: 30000, path: path.join(output, `home-${width}-${theme}.png`), fullPage: true});
      if (theme === 'light') await page.screenshot({animations: 'disabled', timeout: 30000, path: path.join(output, `home-${width}-viewport.png`)});
    }
    if (width < 1024) assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').filter(x => /ScrollTrigger|InertiaPlugin|processor-intro\.js/.test(x.name)).length), 0);
    await go('subject.html?id=database-systems');
    await page.evaluate(() => window.PortalTheme.setTheme('light'));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    await page.screenshot({animations: 'disabled', timeout: 30000, path: path.join(output, `subject-${width}.png`), fullPage: true});
    await page.locator('[data-open-study-lecture="2"]').first().click();
    await page.locator('#study-slides-feed img').first().waitFor({state: 'attached'});
    assert.equal(await page.locator('#study-slides-feed img').count(), 30);
    await page.screenshot({animations: 'disabled', timeout: 30000, path: path.join(output, `reader-${width}.png`)});
    await page.locator('#study-font-zoom-in').click();
    assert(await page.locator('#study-slides-feed').evaluate(el => el.classList.contains('study-font-lg')));
    await page.locator('#study-font-zoom-out').click();
    await page.locator('#study-tab-btn-quiz').click();
    assert.equal(await page.locator('.full-quiz-opt-btn').count(), 80);
    await page.screenshot({animations: 'disabled', timeout: 30000, path: path.join(output, `quiz-${width}.png`)});
    await page.locator('#study-modal-close').click();
    assert.equal(await page.locator('#lecture-study-modal').isVisible(), false);
  }, {viewport: {width, height: 900}, reducedMotion: 'reduce', ...(width <= 412 ? {hasTouch: true, isMobile: true} : {})});
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
  fs.writeFileSync(path.join(output, process.env.PORTAL_A1_REPORT || 'results.json'), JSON.stringify({results}, null, 2));
  if (results.some(result => !result.passed)) process.exitCode = 1;
});
