const assert = require('node:assert/strict');
async function register({scenario}) {
  await scenario('rift-legacy-replay-link-opens-new-scene',async({page,go})=>{
    await page.addInitScript(()=>{localStorage.setItem('sem2_first_visit_configured','true');window.sessionStorage.setItem('sem2-studio-rift-intro-v3','seen');});
    await go('index.html?intro=processor');await page.waitForFunction(()=>window.riftDiagnostics?.()?.frames>2);
    assert.equal(await page.locator('.rift-intro').count(),1);
    assert.equal(await page.locator('.processor-intro,.processor-node').count(),0);
    assert.equal(await page.locator('.rift-skip svg').count(),1);
    await page.locator('[data-intro-skip]').click();
  });
  await scenario('rift-webgl-reverse-scroll-pointer-and-context-loss',async({page,go})=>{
    const shaderErrors=[];
    page.on('console',message=>{if(message.type()==='error' && /THREE|shader|GL_INVALID/i.test(message.text()))shaderErrors.push(message.text());});
    await page.addInitScript(()=>localStorage.setItem('sem2_first_visit_configured','true'));
    await go('index.html?intro=rift');await page.waitForFunction(()=>window.riftDiagnostics?.()?.frames>4);
    assert.equal(await page.evaluate(()=>window.riftDiagnostics().mode),'webgl');
    await page.evaluate(()=>{const t=window.ScrollTrigger.getById('sem2-rift-intro');window.scrollTo(0,t.end*.65);window.ScrollTrigger.update();});
    await page.waitForFunction(()=>window.riftDiagnostics().progress>.62);
    await page.evaluate(()=>{const t=window.ScrollTrigger.getById('sem2-rift-intro');window.scrollTo(0,t.end*.25);window.ScrollTrigger.update();});
    await page.waitForFunction(()=>window.riftDiagnostics().progress<.3);
    await page.mouse.move(1200,250);await page.waitForFunction(()=>window.riftDiagnostics().pointer.x>.1);
    await page.mouse.click(750,350);await page.waitForFunction(()=>window.riftDiagnostics().impulse>.1);
    assert.deepEqual(shaderErrors,[],'the live shader programs compile and render without GL errors');
    await page.locator('.rift-stage canvas').dispatchEvent('webglcontextlost');
    await page.waitForFunction(()=>window.riftDiagnostics().mode==='canvas');
    await page.locator('[data-intro-skip]').click();assert(await page.locator('.studio-hero').isVisible());
  });
  await scenario('rift-module-failure-has-a-working-scroll-fallback',async({page,go})=>{
    await page.addInitScript(()=>localStorage.setItem('sem2_first_visit_configured','true'));
    await page.route('**/three.module.js',route=>route.abort());
    await go('index.html?intro=rift');await page.waitForFunction(()=>window.riftDiagnostics?.()?.frames>2);
    assert.equal(await page.evaluate(()=>window.riftDiagnostics().mode),'canvas');
    await page.mouse.wheel(0,1000);await page.waitForFunction(()=>window.riftDiagnostics().progress>.3);
    await page.locator('[data-intro-skip]').click();assert(await page.locator('.studio-rail').isVisible());
  });
  await scenario('rift-cancelled-module-import-cannot-remount-intro',async({page,go})=>{
    await page.addInitScript(()=>localStorage.setItem('sem2_first_visit_configured','true'));
    await page.route('**/three.module.js',async route=>{await page.waitForTimeout(500);await route.continue();});
    const navigation=go('index.html?intro=rift');await page.locator('.rift-intro').waitFor();
    await page.setViewportSize({width:768,height:900});await navigation;await page.waitForTimeout(750);
    assert.equal(await page.locator('.rift-intro').count(),0);
    assert.equal(await page.evaluate(()=>window.riftDiagnostics?.()),null);
    assert.equal(await page.locator('main').evaluate(el=>el.inert),false);
  });
  await scenario('studio-scroll-intro-real-scroll-and-studio-return',async({page,go}) => {
    await page.addInitScript(() => localStorage.setItem('sem2_first_visit_configured','true'));
    await go('index.html?intro=rift');
    await page.locator('.rift-intro').waitFor();await page.waitForFunction(()=>window.riftDiagnostics?.()?.frames>1);
    await page.waitForFunction(()=>window.riftDiagnostics?.()?.frames>2);
    assert.equal(await page.locator('.processor-node,.processor-core').count(),0);
    assert.equal(await page.locator('.rift-stage canvas').count(),1);
    assert.equal(await page.locator('.rift-scene').evaluate(el=>Math.round(el.getBoundingClientRect().top)),0);
    assert.equal(await page.locator('.rift-scene').evaluate(el=>Math.round(el.getBoundingClientRect().width)),1440);
    assert.equal(await page.locator('body>header').isVisible(),false);
    assert.equal(await page.locator('.studio-rail').isVisible(),false);
    assert.equal(await page.locator('.studio-rail').evaluate(el=>el.inert),true);
    assert.equal(await page.evaluate(()=>performance.getEntriesByType('resource').filter(entry=>entry.name.endsWith('/gsap.min.js')).length),1,'reuse the existing GSAP runtime');
    await page.mouse.wheel(0,1050);
    await page.waitForFunction(()=>window.riftDiagnostics().progress>.3);
    assert(await page.evaluate(()=>window.riftDiagnostics().phase)>=1);
    await page.evaluate(()=>{const trigger=window.ScrollTrigger.getById('sem2-rift-intro');window.scrollTo(0,trigger.end+2);window.ScrollTrigger.update();});
    await page.locator('.rift-intro').waitFor({state:'detached'});
    assert(await page.locator('.studio-hero').isVisible());
    assert(await page.locator('.studio-rail').isVisible());
    assert.equal(await page.locator('body>header').evaluate(el=>el.inert),false);
    assert.equal(await page.locator('.studio-rail').evaluate(el=>el.inert),false);
    assert.equal(await page.evaluate(()=>window.ScrollTrigger.getAll().length),0);
    assert.equal(await page.locator('.studio-motion-toggle,.studio-play-button').count(),0);
    await page.waitForFunction(()=>document.querySelector('.studio-hero').classList.contains('energy-awake'));
  });
  await scenario('studio-scroll-intro-default-session-and-forced-replay',async({page,go}) => {
    await page.addInitScript(()=>localStorage.setItem('sem2_first_visit_configured','true'));
    await go('index.html');await page.locator('.rift-intro').waitFor();await page.waitForFunction(()=>window.riftDiagnostics?.()?.frames>1);
    await page.locator('[data-intro-skip]').click();
    await page.locator('.rift-intro').waitFor({state:'detached'});
    await go('subject.html?id=database-systems');await go('index.html');
    assert.equal(await page.locator('.rift-intro').count(),0);
    await go('index.html?intro=rift');await page.locator('.rift-intro').waitFor();await page.waitForFunction(()=>window.riftDiagnostics?.()?.frames>1);
    await page.locator('[data-intro-skip]').click();
    assert(await page.locator('body>header').isVisible());
  });
  await scenario('studio-scroll-intro-onboarding-and-resize-cleanup',async({page,go}) => {
    await go('index.html?intro=rift');await page.locator('.rift-intro').waitFor();await page.waitForFunction(()=>window.riftDiagnostics?.()?.frames>1);
    assert.equal(await page.locator('#student-profile-modal').isVisible(),false);
    await page.locator('[data-intro-skip]').click();
    await page.locator('#student-profile-modal').waitFor({state:'visible'});
    await page.keyboard.press('Escape');
    await go('index.html?intro=rift');await page.locator('.rift-intro').waitFor();await page.waitForFunction(()=>window.riftDiagnostics?.()?.frames>1);
    await page.setViewportSize({width:768,height:900});
    await page.locator('.rift-intro').waitFor({state:'detached'});
    assert.equal(await page.locator('.studio-mobile-nav').evaluate(el=>el.inert),false);
    assert(await page.locator('.studio-mobile-nav').isVisible());
  });
  await scenario('studio-scroll-intro-asset-failure-leaves-navigation-usable',async({page,go}) => {
    await page.addInitScript(()=>localStorage.setItem('sem2_first_visit_configured','true'));
    await page.route('**/ScrollTrigger.min.js',route=>route.abort());
    await go('index.html?intro=rift');
    await page.waitForFunction(()=>!window.PortalIntro.isActive());
    assert(await page.locator('body>header').isVisible());
    assert.equal(await page.locator('main').evaluate(el=>el.inert),false);
    assert.equal(await page.locator('.studio-rail').evaluate(el=>el.inert),false);
    await page.locator('.studio-rail a[href="#library"]').click();
    await page.locator('#studio-library').waitFor({state:'visible'});
  });
  for(const route of ['index.html#library','index.html#continue','index.html#schedule-section']) await scenario('studio-scroll-intro-bypasses-'+route.split('#')[1],async({page,go})=>{
    await page.addInitScript(()=>localStorage.setItem('sem2_first_visit_configured','true'));
    await go(route);
    assert.equal(await page.locator('.rift-intro').count(),0);
    assert.equal(await page.evaluate(()=>window.PortalIntro.isActive()),false);
  });
}
module.exports = {register};
