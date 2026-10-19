const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium} = require('playwright');
const root=path.resolve(__dirname,'..');
const output=path.resolve(process.env.PORTAL_TEST_OUTPUT || path.join(root,'test-results'));
fs.mkdirSync(output,{recursive:true});
const results=[];
let browser,server,base;
const filter=new RegExp(process.env.PORTAL_TEST_FILTER || '.*');
async function scenario(name,fn,options={}) {
  if(!filter.test(name))return;
  const context=await browser.newContext({viewport:{width:1440,height:900},...options});
  await context.addInitScript(()=>{if(location.hostname==='127.0.0.1')localStorage.setItem('sem2_first_visit_configured','true');});
  const page=await context.newPage();page.setDefaultTimeout(6000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const go=async route=>{await page.goto(base+route,{waitUntil:'load'});};
  try{await fn({page,context,go,errors});results.push({name,passed:true});console.log('PASS',name);}
  catch(e){results.push({name,passed:false,error:e.stack,errors});await page.screenshot({path:path.join(output,name+'.png')}).catch(()=>{});console.log('FAIL',name,e.message.slice(0,180));}
  finally{await context.close();}
}
async function main(){
  server=http.createServer((req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const relative=decodeURIComponent(url.pathname).replace(/^\/Sem2_portal\//,'/');
    const target=path.resolve(root,'.'+relative+(relative.endsWith('/')?'index.html':''));
    if(!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    fs.readFile(target,(err,bytes)=>{if(err){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.png':'image/png','.pdf':'application/pdf'})[path.extname(target)]||'application/octet-stream');res.end(bytes);});
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base=`http://127.0.0.1:${server.address().port}/Sem2_portal/`;
  browser=await chromium.launch({headless:true,...(process.env.PORTAL_BROWSER_CHANNEL?{channel:process.env.PORTAL_BROWSER_CHANNEL}:{})});
  await scenario('dynamic-profile-buttons',async({page,go})=>{
    await go('subject.html?id=computer-architecture&track=section');await page.evaluate(()=>StudentProfile.set('B3',10));
    for(let i=0;i<3;i++){await page.locator('#sections-filter-container [data-open-profile-modal]').click();await page.locator('#student-profile-modal').waitFor({state:'visible'});await page.locator('#close-profile-modal').click();await page.locator('#student-profile-modal').waitFor({state:'hidden'});await page.locator('[data-ta-filter="all"]').click();}
  });
  await scenario('profile-dialog-focus',async({page,go})=>{
    await go('index.html');const button=page.locator('[data-open-profile-modal]').first();await button.click();
    assert(await page.locator('#student-profile-modal').evaluate(el=>el.contains(document.activeElement)));
    assert.equal(await page.locator('#student-profile-modal').getAttribute('role'),'dialog');
    await page.keyboard.press('Shift+Tab');assert(await page.locator('#student-profile-modal').evaluate(el=>el.contains(document.activeElement)));
    await page.keyboard.press('Escape');await page.locator('#student-profile-modal').waitFor({state:'hidden'});assert(await button.evaluate(el=>el===document.activeElement));
  });
  await scenario('quiz-metadata-and-direction',async({page,go})=>{
    await go('subject.html?id=database-systems');await page.locator('[data-open-study-lecture="3"]').first().click();await page.locator('#lecture-study-modal').waitFor({state:'visible'});await page.locator('#study-tab-btn-quiz').click();
    assert(!/undefined|null/.test(await page.locator('#study-full-quiz-view').innerText()));
    assert.equal(await page.locator('.full-quiz-opt-btn').first().evaluate(x=>getComputedStyle(x).direction),'ltr');
  });
  for(const width of [360,390,412])await scenario('mobile-'+width,async({page,go})=>{
    await go('index.html');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1));
    await go('subject.html?id=database-systems');await page.locator('[data-open-study-lecture="2"]').first().tap();await page.locator('#lecture-study-modal').waitFor({state:'visible'});
    for(const theme of ['dark','light','reading']){
      await page.evaluate(t=>PortalTheme.setTheme(t),theme);
      const rect=await page.locator('#study-modal-close').boundingBox();assert(rect.x>=0&&rect.x+rect.width<=width+1);
      await page.locator('#study-tab-btn-quiz').tap();await page.locator('#study-tab-btn-slides').tap();
    }
    await page.locator('#study-modal-close').tap();await page.locator('#lecture-study-modal').waitFor({state:'hidden'});
  },{viewport:{width,height:844},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/155.0.0.0 Mobile Safari/537.36'});
  await scenario('blocked-storage',async({page,go,errors})=>{
    await page.addInitScript(()=>{if(location.hostname==='127.0.0.1'){Storage.prototype.getItem=()=>{throw new Error('blocked')};Storage.prototype.setItem=()=>{throw new Error('blocked')};}});
    await go('index.html');await page.locator('[data-open-profile-modal]').first().click();await page.locator('input[value="B2"]').locator('..').click();await page.locator('#profile-selection-form button[type="submit"]').click();await page.locator('#student-profile-modal').waitFor({state:'hidden'});
    assert.equal(await page.locator('#courses-grid article').count(),6);assert.equal(await page.evaluate(()=>StudentProfile.get().group),'B2');await page.locator('[data-theme-btn="reading"]').click();assert.equal(await page.evaluate(()=>PortalTheme.getTheme()),'reading');assert.deepEqual(errors,[]);
  });
  await scenario('offline-cdn',async({page,go,errors})=>{
    await page.route('https://**',r=>r.abort());await go('subject.html?id=database-systems');
    assert.equal(await page.locator('#lectures-list .btn-preview-pdf').count(),3);
    assert(!await page.locator('#track-panel-section').isVisible());assert(!await page.locator('#pdf-modal').isVisible());assert.deepEqual(errors,[]);
  });
  await scenario('drive-folder-no-iframe',async({page,go})=>{
    await go('subject.html?id=computer-graphics');assert(!await page.locator('#toggle-preview-btn').isVisible());assert.equal(await page.locator('#exp-iframe').getAttribute('src'),'');assert((await page.locator('#exp-main-btn').innerText()).includes('مجلد'));
  });
  await scenario('invalid-track',async({page,go})=>{
    await go('subject.html?id=computer-architecture&track=bogus#assignments-section-panel');assert(await page.locator('#track-panel-lecture').isVisible());assert(new URL(page.url()).searchParams.get('track')==='lecture');assert(new URL(page.url()).hash==='#assignments-section-panel');
  });
  await scenario('clipboard-fallback',async({page,go,errors})=>{
    await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{get:()=>undefined}));await go('subject.html?id=computer-architecture');await page.locator('#share-btn').click();await page.locator('#copy-link-fallback').waitFor({state:'visible'});assert((await page.locator('#copy-link-value').inputValue()).includes('computer-architecture'));await page.keyboard.press('Escape');assert.deepEqual(errors,[]);
  });
  await scenario('study-dialog-focus',async({page,go})=>{
    await go('subject.html?id=database-systems');const open=page.locator('[data-open-study-lecture="2"]').first();await open.click();await page.locator('#lecture-study-modal').waitFor({state:'visible'});assert(await page.locator('#lecture-study-modal').evaluate(el=>el.contains(document.activeElement)));await page.keyboard.press('Shift+Tab');assert(await page.locator('#lecture-study-modal').evaluate(el=>el.contains(document.activeElement)));await page.keyboard.press('Escape');assert(await open.evaluate(el=>el===document.activeElement));
  });
  await scenario('lazy-study-data-and-quiz',async({page,go})=>{
    await go('subject.html?id=database-systems');assert(!await page.evaluate(()=>performance.getEntriesByType('resource').some(x=>x.name.includes('lecture-explanations-data'))));await page.locator('[data-open-study-lecture="2"]').first().click();await page.locator('#lecture-study-modal').waitFor({state:'visible'});assert.equal(await page.locator('.full-quiz-opt-btn').count(),0);await page.locator('#study-tab-btn-quiz').click();assert.equal(await page.locator('.full-quiz-opt-btn').count(),80);
  });
  await scenario('quiz-preserves-other-question-nodes',async({page,go})=>{
    await go('subject.html?id=database-systems');await page.locator('[data-open-study-lecture="2"]').first().click();await page.locator('#lecture-study-modal').waitFor({state:'visible'});await page.locator('#study-tab-btn-quiz').click();await page.evaluate(()=>window.otherQuestion=document.getElementById('full-q-2'));await page.locator('.full-quiz-opt-btn[data-qid="1"]').first().click();assert(await page.evaluate(()=>window.otherQuestion===document.getElementById('full-q-2')));await page.locator('#full-quiz-reset-btn').click();assert.equal(await page.locator('#full-quiz-score-val').innerText(),'0 / 20');
  });
  fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify(results,null,2));
  console.log(`${results.filter(x=>x.passed).length}/${results.length} scenarios passed`);
  if(results.some(x=>!x.passed))process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));});
