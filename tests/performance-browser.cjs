const assert = require('node:assert/strict');

async function register({scenario}) {
  async function configured(page) {
    await page.addInitScript(() => {
      localStorage.setItem('sem2_first_visit_configured','true');
      window.sessionStorage.setItem('sem2-studio-rift-intro-v3','seen');
    });
  }
  await scenario('performance-no-legacy-course-paint-during-slow-boot', async ({page,go}) => {
    await configured(page);
    let release, requested;
    const blocked = new Promise(resolve => { release=resolve; });
    const arrived = new Promise(resolve => { requested=resolve; });
    await page.route('**/js/studio-course.js', async route => {requested();await blocked;await route.continue();});
    const navigation = go('subject.html?id=database-systems');
    try {
      await arrived;
      await page.waitForTimeout(150);
      assert.equal(await page.locator('#main-content').evaluate(el=>getComputedStyle(el).visibility),'hidden','unfinished legacy layout must never paint');
    } finally {release();await navigation;}
    await page.locator('.course-atlas').waitFor({state:'visible'});
    assert.equal(await page.locator('#subject-title-en').innerText(),'Database Systems');
  });
  await scenario('performance-library-is-created-on-first-use', async ({page,go}) => {
    await configured(page);await go('index.html');
    assert.equal(await page.locator('#library-results .studio-library-row').count(),0,'closed library should not build invisible rows');
    await page.locator('.studio-rail nav a[href="#library"]').click();
    await page.locator('#library-results .studio-library-row').first().waitFor();
    await page.locator('#library-kind').selectOption('interactive');
    assert.equal(await page.locator('#library-results .studio-library-row').count(),25,'all 25 available local lessons appear after the first library entry');
  });
  await scenario('performance-background-canvas-pauses-under-dialog', async ({page,go}) => {
    await page.addInitScript(()=>{
      window.energyDraws=0;
      const clear=window.CanvasRenderingContext2D.prototype.clearRect;
      window.CanvasRenderingContext2D.prototype.clearRect=function(...args){if(this.canvas.classList.contains('studio-energy'))window.energyDraws++;return clear.apply(this,args);};
    });
    await configured(page);await go('subject.html?id=database-systems');
    await page.waitForFunction(()=>document.querySelector('.course-atlas').classList.contains('energy-awake'));
    await page.locator('[data-open-study-lecture="2"]').first().click();
    await page.locator('#lecture-study-modal').waitFor({state:'visible'});
    await page.waitForFunction(()=>!document.querySelector('.course-atlas').classList.contains('energy-awake'),null,{timeout:1500});
    const paused=await page.evaluate(()=>window.energyDraws);
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(()=>window.energyDraws),paused,'covered canvas performs no drawing');
    await page.keyboard.press('Escape');
    // Opening a source can scroll its heading offscreen. Closing the dialog must not
    // restart a scene that is still outside the viewport; resume only after returning.
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>!document.querySelector('.course-atlas').classList.contains('energy-awake'));
    const offscreen=await page.evaluate(()=>window.energyDraws);
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(()=>window.energyDraws),offscreen,'offscreen canvas remains paused after closing the reader');
    await page.locator('.course-atlas').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector('.course-atlas').classList.contains('energy-awake'));
    await page.waitForFunction(count=>window.energyDraws>count,offscreen);
  }, {viewport:{width:1440,height:400}});
  await scenario('performance-script-failure-and-no-js-fail-open', async ({page,context,go}) => {
    await configured(page);
    await page.route('**/js/studio-course.js',route=>route.abort());
    await go('subject.html?id=database-systems');
    await page.locator('#main-content').waitFor({state:'visible'});
    assert.equal(await page.locator('[data-open-study-lecture="2"]').count()>0,true);
    const fallback=await context.browser().newContext({javaScriptEnabled:false});
    try {
      const staticPage=await fallback.newPage();await staticPage.goto(page.url());
      assert(await staticPage.locator('#main-content').isVisible());
      assert(await staticPage.locator('a[href="index.html"]').first().isVisible());
    } finally {await fallback.close();}
  });
}
module.exports={register};
