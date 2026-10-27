const assert = require('node:assert/strict');

async function prepare(page) {
  await page.addInitScript(() => {
    localStorage.setItem('sem2_first_visit_configured','true');
    sessionStorage.setItem('sem2-studio-rift-intro-v3','seen');
  });
}

async function register({scenario}) {
  for (const width of [1440,390]) {
    await scenario('course-refinements-information-keeps-hero-compact-' + width, async ({page,go}) => {
      await prepare(page);
      await go('subject.html?id=data-structure');
      const hero = page.locator('.course-atlas');
      const height = (await hero.boundingBox()).height;
      const group = page.locator('.a1-course-context');
      await group.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert(await group.getAttribute('open') !== null,'group/timetable information is disclosed by keyboard');
      assert(await group.locator('#subject-doctor-info').isVisible(),'real course staff is retained');
      assert(await group.locator('#lecture-time-banner').isVisible(),'lecture timetable is retained');
      const expanded = (await hero.boundingBox()).height;
      assert(Math.abs(expanded - height) <= 1,'opening course information keeps the hero compact (' + height + ' -> ' + expanded + ')');
      if (width === 1440) {
        const panel = await group.boundingBox();
        const lecture = await group.locator('#lecture-time-banner').boundingBox();
        const section = await group.locator('#section-time-banner').boundingBox();
        assert(panel.height <= 360 && Math.abs(lecture.x - section.x) > 200,'expanded staff/timetables use the available desktop width without a tall empty panel (' + panel.height + 'px)');
      }
      await page.locator('.a1-course-overview summary').click();
      assert(await page.locator('#subject-desc').isVisible(),'About course remains available');
      assert.equal(await group.getAttribute('open'),null,'only the requested information is expanded');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),true,'expanded information fits the viewport');
    },{viewport:{width,height:900}});
  }
  await scenario('course-refinements-picker-shows-names-codes-and-keyboard-navigation', async ({page,go}) => {
    await prepare(page);
    await go('subject.html?id=database-systems&track=section&kind=sections');
    const trigger = page.locator('#atlas-course-picker-trigger');
    assert.equal(await trigger.count(),1,'course picker has a visible labelled trigger');
    await trigger.focus();
    await page.keyboard.press('Enter');
    const menu = page.locator('#atlas-course-menu');
    assert(await menu.isVisible(),'student can inspect the actual course menu');
    assert.equal(await menu.locator('[role="menuitem"]').count(),6);
    assert((await menu.innerText()).includes('أنظمة قواعد البيانات'));
    assert((await menu.innerText()).includes('Database Systems'));
    assert((await menu.innerText()).includes('IS211'));
    assert((await menu.innerText()).includes('CS213'));
    assert(await menu.locator('[aria-current="page"]').evaluate(el => el === document.activeElement),'opening focuses the current course');
    await page.keyboard.press('ArrowDown');
    assert(await menu.locator('a[href*="id=data-structure"]').evaluate(el => el === document.activeElement),'arrow keys move to the following course');
    await page.keyboard.press('End');
    assert(await menu.locator('[role="menuitem"]').last().evaluate(el => el === document.activeElement),'End reaches the last course');
    await page.keyboard.press('Home');
    assert(await menu.locator('[role="menuitem"]').first().evaluate(el => el === document.activeElement),'Home reaches the first course');
    await page.keyboard.press('Escape');
    assert.equal(await menu.isVisible(),false);
    assert(await trigger.evaluate(el => el === document.activeElement),'Escape restores focus to the picker');
    await trigger.click();
    await page.locator('#subject-title-en').click();
    assert.equal(await menu.isVisible(),false,'outside click dismisses the course menu');
    await trigger.click();
    await menu.locator('a[href*="id=data-structure"]').click();
    await page.waitForURL(/id=data-structure/);
    assert.equal(new URL(page.url()).searchParams.get('kind'),'sections');
    assert.equal(new URL(page.url()).searchParams.get('track'),'section');
  });
  await scenario('course-refinements-numbered-source-rows-have-no-moving-connector', async ({page,go}) => {
    await prepare(page);
    await go('subject.html?id=data-structure');
    for (const kind of ['lectures','sections','videos','assignments','resources']) {
      await page.locator('button[data-resource-kind="' + kind + '"]').click();
      const markers = page.locator('.a1-family-panel:not([hidden]) .atlas-source-marker');
      assert(await markers.count() > 0,kind + ': numbered source rows are retained');
      const lines = await markers.evaluateAll(elements => elements.filter(el => {
        const style = getComputedStyle(el,'::after');
        return !['none','normal'].includes(style.content) && style.display !== 'none' && Number.parseFloat(style.borderLeftWidth) > 0 && Number.parseFloat(style.height) > 0;
      }).length);
      assert.equal(lines,0,kind + ': no grey/dashed connector is painted below any source number');
      const marker = markers.first();
      await marker.locator('..').hover();
      await page.waitForTimeout(450);
      assert.equal(await marker.evaluate(el => getComputedStyle(el).transform),'none',kind + ': row numbers remain steady on hover');
    }
  });
  await scenario('course-refinements-mobile-menu-and-disclosures-have-readable-controls', async ({page,go}) => {
    const {auditActionContrast} = require('./control-contrast.cjs');
    await prepare(page);
    await go('subject.html?id=report-writing');
    for (const theme of ['light','dark','reading']) {
      await page.evaluate(value => window.PortalTheme.setTheme(value),theme);
      await page.locator('#atlas-course-picker-trigger').click();
      const menu = page.locator('#atlas-course-menu');
      const box = await menu.boundingBox();
      assert(box.x >= 0 && box.x + box.width <= 360 && box.y >= 0 && box.y + box.height <= 900,'actual course menu fits a narrow phone');
      assert.deepEqual(await page.evaluate(auditActionContrast,'#atlas-course-menu'),[],theme + ': readable bilingual names and course codes');
      await page.keyboard.press('Escape');
      await page.locator('.a1-course-context summary').click();
      assert.deepEqual(await page.evaluate(auditActionContrast,'.atlas-info'),[],theme + ': readable information and profile actions');
      await page.locator('.a1-course-context summary').click();
    }
  },{viewport:{width:360,height:900}});
}

module.exports = {register};
