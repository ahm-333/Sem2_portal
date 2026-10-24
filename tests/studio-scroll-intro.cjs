const assert = require('node:assert/strict');

async function register({scenario}) {
  await scenario('processor-intro-mount-and-skip', async ({page, go}) => {
    await page.addInitScript(() => localStorage.setItem('sem2_first_visit_configured', 'true'));
    await go('index.html');
    await page.locator('.processor-intro').waitFor();
    assert.equal(await page.locator('.processor-node').count(), 6);
    assert.equal(await page.locator('[data-processor-skip]').count(), 1);
    await page.evaluate(() => {
      const t = window.ScrollTrigger.getById('sem2-processor-intro');
      window.scrollTo(0, t.end - 10);
      window.ScrollTrigger.update();
    });
    await page.locator('[data-processor-skip]').waitFor({state: 'visible'});
    await page.locator('[data-processor-skip]').click();
    await page.locator('.processor-intro').waitFor({state: 'detached'});
    assert(await page.locator('.studio-hero').isVisible());
  });

  await scenario('processor-real-drag-inertia-keyboard-and-charge', async ({page, go}) => {
    await page.addInitScript(() => localStorage.setItem('sem2_first_visit_configured', 'true'));
    await go('index.html?intro=processor');
    await page.locator('.processor-node').first().waitFor();
    const node = page.locator('.processor-node').first();
    const box = await node.boundingBox();
    const original = await page.evaluate(() => window.processorDiagnostics().positions[0]);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    for (let i = 1; i <= 7; i++) {
      await page.mouse.move(box.x + box.width / 2 + i * 17, box.y + box.height / 2 - i * 3);
      await page.waitForTimeout(15);
    }
    await page.mouse.up();
    assert(await node.evaluate(el => !!window.Draggable?.get(el)?.tween?.isActive()), 'real inertia tween is active after release');
    await page.waitForTimeout(1200);
    const moved = await page.evaluate(() => window.processorDiagnostics().positions[0]);
    assert(moved.x > original.x + 50);

    for (const point of await page.evaluate(() => window.processorDiagnostics().positions)) {
      assert(point.x >= 0 && point.x <= 990 && point.y >= 0 && point.y <= 486);
    }

    await node.focus();
    await page.keyboard.press('ArrowLeft');
    assert((await page.evaluate(() => window.processorDiagnostics().positions[0])).x < moved.x);

    await page.evaluate(() => {
      const t = window.ScrollTrigger.getById('sem2-processor-intro');
      window.scrollTo(0, t.start + (t.end - t.start) * 0.95);
      window.ScrollTrigger.update();
    });
    await page.waitForTimeout(700);
    assert.equal(await page.locator('.chip-trace-live').count(), 48);
    assert.equal(await page.locator('.die-cell').count(), 49);
    assert(await page.locator('.die-cell').evaluateAll(xs => xs.every(x => Number(x.style.opacity) > 0.95)));
  });

  await scenario('studio-scroll-intro-real-scroll-and-studio-return', async ({page, go}) => {
    await page.addInitScript(() => localStorage.setItem('sem2_first_visit_configured', 'true'));
    await go('index.html');
    await page.locator('.processor-intro').waitFor();
    assert.equal(await page.locator('.processor-node').count(), 6);
    assert.equal(await page.locator('body>header').isVisible(), false);
    assert.equal(await page.locator('.studio-rail').isVisible(), false);
    assert.equal(await page.locator('.studio-rail').evaluate(el => el.inert), true);

    await page.evaluate(() => {
      const trigger = window.ScrollTrigger.getById('sem2-processor-intro');
      window.scrollTo(0, trigger.end);
      window.ScrollTrigger.update();
    });
    await page.waitForTimeout(300);
    assert.equal(await page.locator('.processor-intro').isVisible(), true);
    assert.equal(await page.locator('[data-processor-enter]').isVisible(), true);

    await page.locator('[data-processor-enter]').click();
    await page.locator('.processor-intro').waitFor({state: 'detached'});
    assert(await page.locator('.studio-hero').isVisible());
    assert(await page.locator('.studio-rail').isVisible());
    assert.equal(await page.locator('body>header').evaluate(el => el.inert), false);
    assert.equal(await page.locator('.studio-rail').evaluate(el => el.inert), false);
    assert.equal(await page.locator('.studio-motion-toggle,.studio-play-button').count(), 0);
    await page.waitForFunction(() => document.querySelector('.studio-hero').classList.contains('energy-awake'));
  });

  await scenario('studio-scroll-intro-default-session-and-forced-replay', async ({page, go}) => {
    await page.addInitScript(() => localStorage.setItem('sem2_first_visit_configured', 'true'));
    await go('index.html');
    await page.locator('.processor-intro').waitFor();
    await page.evaluate(() => {
      const t = window.ScrollTrigger.getById('sem2-processor-intro');
      window.scrollTo(0, t.end - 10);
      window.ScrollTrigger.update();
    });
    await page.locator('[data-processor-skip]').waitFor({state: 'visible'});
    await page.locator('[data-processor-skip]').click();
    await page.locator('.processor-intro').waitFor({state: 'detached'});
    await go('subject.html?id=database-systems');
    await go('index.html');
    assert.equal(await page.locator('.processor-intro').count(), 0);
    await go('index.html?intro=processor');
    await page.locator('.processor-intro').waitFor();
    await page.evaluate(() => {
      const t = window.ScrollTrigger.getById('sem2-processor-intro');
      window.scrollTo(0, t.end - 10);
      window.ScrollTrigger.update();
    });
    await page.locator('[data-processor-skip]').waitFor({state: 'visible'});
    await page.locator('[data-processor-skip]').click();
    assert(await page.locator('body>header').isVisible());
  });

  await scenario('studio-scroll-intro-onboarding-and-resize-cleanup', async ({page, go}) => {
    await go('index.html');
    await page.locator('.processor-intro').waitFor();
    assert.equal(await page.locator('#student-profile-modal').isVisible(), false);
    await page.evaluate(() => {
      const t = window.ScrollTrigger.getById('sem2-processor-intro');
      window.scrollTo(0, t.end - 10);
      window.ScrollTrigger.update();
    });
    await page.locator('[data-processor-skip]').waitFor({state: 'visible'});
    await page.locator('[data-processor-skip]').click();
    await page.locator('#student-profile-modal').waitFor({state: 'visible'});
    await page.keyboard.press('Escape');
    await go('index.html?intro=processor');
    await page.locator('.processor-intro').waitFor();
    await page.setViewportSize({width: 768, height: 900});
    await page.locator('.processor-intro').waitFor({state: 'detached'});
    assert.equal(await page.locator('.studio-mobile-nav').evaluate(el => el.inert), false);
    assert(await page.locator('.studio-mobile-nav').isVisible());
  });

  await scenario('studio-scroll-intro-asset-failure-leaves-navigation-usable', async ({page, go}) => {
    await page.addInitScript(() => localStorage.setItem('sem2_first_visit_configured', 'true'));
    await page.route('**/ScrollTrigger.min.js', route => route.abort());
    await go('index.html');
    await page.waitForFunction(() => !window.PortalIntro.isActive());
    assert(await page.locator('body>header').isVisible());
    assert.equal(await page.locator('main').evaluate(el => el.inert), false);
    assert.equal(await page.locator('.studio-rail').evaluate(el => el.inert), false);
    await page.locator('.studio-rail a[href="#library"]').click();
    await page.locator('#studio-library').waitFor({state: 'visible'});
  });

  for (const route of ['index.html#library', 'index.html#continue', 'index.html#schedule-section']) {
    await scenario('studio-scroll-intro-bypasses-' + route.split('#')[1], async ({page, go}) => {
      await page.addInitScript(() => localStorage.setItem('sem2_first_visit_configured', 'true'));
      await go(route);
      assert.equal(await page.locator('.processor-intro').count(), 0);
      assert.equal(await page.evaluate(() => window.PortalIntro.isActive()), false);
    });
  }
}

module.exports = {register};
