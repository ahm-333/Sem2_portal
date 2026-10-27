const assert = require('node:assert/strict');

async function ready(page) {
  await page.addInitScript(() => {
    localStorage.setItem('sem2_first_visit_configured', 'true');
    window.sessionStorage.setItem('sem2-studio-rift-intro-v3', 'seen');
  });

}

async function register({scenario}) {
  await scenario('integration-os-directory-alias-registers-continue', async ({page, go}) => {
    await ready(page); await go('education-preview/os/?unit=os-09');
    assert.match(new URL(page.url()).pathname, /^\/Sem2_portal\/education-preview\/os\/$/);
    await page.locator('#lesson-content .lesson-section').first().waitFor();
    await go('index.html#continue');
    assert.equal(await page.locator('#continue-results a[href="education-preview/os/index.html?unit=os-09"]').count(), 1);
  });
  await scenario('integration-library-discovers-standalone-lessons', async ({page, go}) => {
    await ready(page); await go('index.html#library');
    await page.locator('#library-kind').selectOption('interactive');
    for (const [course, count, path] of [
      ['data-structure', 3, 'study/ds/lecture-2.html'],
      ['computer-architecture', 1, 'study/arch/chapter-7.html'],
      ['operating-system', 19, 'education-preview/os/index.html?unit=os-19']
    ]) {
      await page.locator('#library-course').selectOption(course);
      assert.equal(await page.locator('#library-results .studio-library-row').count(), count);
      assert(await page.locator(`#library-results a[href="${path}"]`).count(), `interactive library opens ${path}`);
    }
    await page.locator('#library-course').selectOption('computer-graphics');
    assert.equal(await page.locator('#library-results .studio-library-row').count(), 0);
  });
  await scenario('integration-standalone-history-resumes-section', async ({page, go}) => {
    await ready(page); await go('study/ds/lecture-2.html');
    await page.locator('#btn-open-toc').click();
    await page.locator('#sidebar-toc a[href="#sec-4"]').click();
    await go('index.html#continue');
    const resume = page.locator('#continue-results .studio-library-row').first();
    assert.equal(await resume.getAttribute('href'), 'study/ds/lecture-2.html#sec-4');
    await resume.click();
    await page.waitForFunction(() => Math.abs(document.getElementById('sec-4')?.getBoundingClientRect().top) < 400);
    assert.equal(await page.locator('.study-modal[aria-hidden="false"]').count(), 0);
  });
  await scenario('integration-atlas-count-follows-all-ta-sources', async ({page, go}) => {
    await ready(page); await go('subject.html?id=database-systems&kind=sections&track=section');
    await page.evaluate(() => window.StudentProfile.set('B3', 10));
    await page.locator('[data-ta-filter="all"]').click();
    assert.equal(await page.locator('#sections-list [data-content-key]').count(), 11);
    assert.equal(await page.locator('[data-atlas-count="sections"]').innerText(), '11 مصدر');
  });
  await scenario('integration-ds2-checks-survive-reload-and-toggle', async ({page, go}) => {
    await ready(page); await go('study/ds/lecture-2.html');
    const check = page.locator('[data-check="sec-1"]');
    await check.click();
    await page.reload();
    await page.locator('#btn-open-toc').click();
    assert.equal(await page.locator('#completed-count-badge').innerText(), '1/11');
    await page.locator('#btn-close-toc').click();
    assert.equal(await check.getAttribute('aria-pressed'), 'true');
    await check.click(); await page.reload();
    await page.locator('#btn-open-toc').click();
    assert.equal(await page.locator('#completed-count-badge').innerText(), '0/11');
    assert.equal(await check.getAttribute('aria-pressed'), 'false');
  });
  await scenario('integration-reading-scroll-saves-latest-section', async ({page, go}) => {
    await ready(page); await go('study/ds/lecture-2.html');
    await page.locator('#sec-5').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await go('index.html#continue');
    const link = page.locator('#continue-results .studio-library-row').first();
    await link.click();
    await page.waitForFunction(() => {
      const rect = document.getElementById('sec-5')?.getBoundingClientRect();
      return rect && rect.top < 450 && rect.bottom > 100;
    });
  });
  await scenario('integration-item-link-reveals-a-different-ta-without-changing-profile', async ({page, go}) => {
    await ready(page); await go('subject.html?id=data-structure');
    await page.evaluate(() => window.StudentProfile.set('B3', 10));
    const key = JSON.stringify(['data-structure', 'section', '6']);
    await go('subject.html?id=data-structure&track=section&kind=sections&item=' + encodeURIComponent(key));
    await page.locator('.btn-reveal-hidden-ta').click();
    await page.waitForFunction(value => document.activeElement?.dataset.contentKey === value, key);
    assert.equal(await page.locator('[data-ta-filter="my-ta"]').getAttribute('title'), 'عرض ملفات معيد سكشنك فقط (م. فاطمة محمود)');
    const active = page.locator('[data-content-key]:focus');
    assert.equal(await active.locator('a[download]').getAttribute('href'), 'materials/ds/Stack_DynamicStack.cpp');
    assert.equal(await active.locator('a[download]').innerText(), 'تحميل الكود C++');
  });
  await scenario('integration-standalone-shows-storage-failure-without-fake-persistence', async ({page, go}) => {
    await ready(page);
    await page.addInitScript(() => {
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key.startsWith('sem2_study_') || key.startsWith('sem2_standalone_')) throw new window.DOMException('Full', 'QuotaExceededError');
        return set.call(this, key, value);
      };
    });
    await go('study/ds/lecture-2.html');
    assert.match(await page.locator('#study-session-warning').innerText(), /للجلسة دي فقط/);
    await page.locator('[data-check="sec-1"]').click();
    assert.equal(await page.locator('[data-check="sec-1"]').getAttribute('aria-pressed'), 'true');
    await page.reload();
    assert.equal(await page.locator('[data-check="sec-1"]').getAttribute('aria-pressed'), 'false');
    assert.match(await page.locator('#study-session-warning').innerText(), /الحفظ الدائم مش متاح/);
  });
  await scenario('integration-continue-keeps-each-database-reader-mode', async ({page, go}) => {
    await ready(page); await go('study/db/chapter-1.html#block-3');
    await page.waitForTimeout(400);
    await go('study/ds/lecture-1.html');
    await go('index.html#continue');
    assert.equal(await page.locator('#continue-results a[href^="study/db/chapter-1.html"]').count(), 1);
  });
  await scenario('integration-ds2-tabs-merge-checks-and-unchecks', async ({page, context, go}) => {
    await ready(page); await go('study/ds/lecture-2.html');
    const second = await context.newPage();
    await second.goto(page.url());
    await page.locator('[data-check="sec-1"]').click();
    await second.locator('[data-check="sec-2"]').click();
    await page.reload();
    assert.equal(await page.locator('[data-check="sec-1"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('[data-check="sec-2"]').getAttribute('aria-pressed'), 'true');
    await second.locator('[data-check="sec-1"]').click();
    await page.waitForFunction(() => document.querySelector('[data-check="sec-1"]').getAttribute('aria-pressed') === 'false');
    await page.reload();
    assert.equal(await page.locator('[data-check="sec-1"]').getAttribute('aria-pressed'), 'false');
    assert.equal(await page.locator('[data-check="sec-2"]').getAttribute('aria-pressed'), 'true');
    await second.close();
  });
  await scenario('integration-architecture-continue-restores-selected-lesson-tab', async ({page, go}) => {
    await ready(page); await go('study/arch/chapter-7.html');
    await page.locator('#tab-lesson2').click();
    await go('index.html#continue');
    await page.locator('#continue-results .studio-library-row').first().click();
    await page.locator('#section-lesson2').waitFor({state: 'visible'});
    assert.equal(await page.locator('#section-lesson1').isVisible(), false);
  });
}
module.exports = {register};
