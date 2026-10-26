const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const settle=page=>page.addInitScript(()=>{localStorage.setItem('sem2_first_visit_configured','true');sessionStorage.setItem('sem2-studio-rift-intro-v3','seen');});
exports.register=async({scenario})=>{
  await scenario('release-standalone-lessons-open-from-local-files-without-script-errors',async({page})=>{
    await settle(page);
    await page.goto(pathToFileURL(path.resolve(__dirname,'../study/ds/lecture-1.html')).href);
    await page.locator('.study-shell-brand').waitFor();
    assert.match(await page.locator('h1').innerText(),/هياكل البيانات/);
    assert(await page.locator('#btnFontInc').isEnabled());
  });
  await scenario('release-os-chapter-links-open-the-selected-chapter',async({page,go})=>{
    await settle(page);
    for(const [chapter,unit]of [[2,'os-09'],[3,'os-13']]){
      await go('subject.html?id=operating-system');await page.locator('[data-open-power-tool="interactive"]').click();
      await page.locator('#interactive-units-list a').nth(chapter-1).click();
      await page.locator('#lesson-content .lesson-section').first().waitFor();
      assert.equal(new URL(page.url()).searchParams.get('unit'),unit);
      assert.match(await page.locator('.lesson-label').innerText(),new RegExp(unit.toUpperCase()));
    }
  });
  await scenario('release-stack-download-is-cpp-source-not-the-recorded-video',async({page,go})=>{
    await settle(page);await go('subject.html?id=data-structure&kind=sections');
    await page.evaluate(()=>window.StudentProfile.set('B1',1));
    for(const id of [6,7,8]){
      const key=JSON.stringify(['data-structure','section',String(id)]);
      const row=page.locator('[data-content-key]').filter({has:page.locator('a[href="materials/ds/Stack_DynamicStack.cpp"]')});
      assert(await row.count()>=3,'each Stack part offers the actual C++ download');
      const exact=page.locator('[data-content-key]').filter({has:page.locator('h4')});
      const code=await exact.evaluateAll((rows,key)=>{const row=rows.find(r=>r.dataset.contentKey===key);return row?.querySelector('a[href="materials/ds/Stack_DynamicStack.cpp"]')?.getAttribute('href');},key);
      assert.equal(code,'materials/ds/Stack_DynamicStack.cpp');
    }
    const file=await page.request.get(new URL('materials/ds/Stack_DynamicStack.cpp',page.url()).href);
    assert.equal(file.status(),200);assert.match(await file.text(),/class\s+DynamicStack/);
  });
  await scenario('release-notification-focuses-the-added-resource',async({page,go})=>{
    await settle(page);await go('subject.html?id=data-structure');await page.evaluate(()=>window.StudentProfile.set('B1',1));await page.locator('#portal-notif-bell-btn').click();
    await page.locator('[data-mark-notif-read="notif-ds-sec4-stack"]').click();
    const key=JSON.stringify(['data-structure','section','6']);
    assert.equal(new URL(page.url()).searchParams.get('item'),key);
    await page.waitForFunction(key=>document.activeElement?.dataset.contentKey===key,key).catch(async error=>{
      const view=await page.evaluate(()=>({active:document.activeElement.outerHTML.slice(0,400),notices:[...document.querySelectorAll('[role="alert"],.btn-reveal-hidden-ta')].map(e=>e.innerText),keys:[...document.querySelectorAll('#sections-list [data-content-key]')].map(e=>e.dataset.contentKey)}));
      throw new Error(error.message+' '+JSON.stringify(view));
    });
  });
  await scenario('release-static-host-does-not-request-a-missing-vercel-analytics-endpoint',async({page,go})=>{
    const requests=[];page.on('request',request=>{if(request.url().includes('/_vercel/insights/'))requests.push(request.url());});
    await settle(page);await go('subject.html?id=database-systems');await page.waitForTimeout(100);
    assert.deepEqual(requests,[],'local/static deployment must not request an unavailable platform endpoint');
  });
  await scenario('release-platform-analytics-loads-once-on-supported-host',async({page})=>{
    let requests=0;
    const source=fs.readFileSync(path.resolve(__dirname,'../js/analytics.js'),'utf8');
    await page.route('https://quality-preview.vercel.app/**',async route=>{
      const pathname=new URL(route.request().url()).pathname;
      if(pathname==='/js/analytics.js')return route.fulfill({contentType:'text/javascript',body:source});
      if(pathname==='/_vercel/insights/script.js'){
        requests++;return route.fulfill({contentType:'text/javascript',body:'window.insightsLoaded=true;'});
      }
      return route.fulfill({contentType:'text/html',body:'<!doctype html><title>Platform preview</title><script defer src="/js/analytics.js"></script><main>Preview</main>'});
    });
    await page.goto('https://quality-preview.vercel.app/');await page.waitForFunction(()=>window.insightsLoaded);
    await page.addScriptTag({content:source});
    assert.equal(requests,1,'the supported endpoint is requested once, including bootstrap replay');
  });
};
