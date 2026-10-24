const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium} = require('playwright');
const {resource,question} = require('./journey-helpers.cjs');
const root=path.resolve(__dirname,'..');
const output=path.resolve(process.env.PORTAL_TEST_OUTPUT || path.join(root,'test-results'));
fs.mkdirSync(output,{recursive:true});
const results=[];
const coverage=[];
let browser,server,base;
const filter=new RegExp(process.env.PORTAL_TEST_FILTER || '.*');
async function scenario(name,fn,options={}) {
  if(!filter.test(name))return;
  const context=await browser.newContext({viewport:{width:1440,height:900},...options});
  await context.route('https://**', route => route.abort());
  // Functional regressions start after onboarding; dedicated A1 cases cover the intro itself.
  await context.addInitScript(()=>{if(location.hostname==='127.0.0.1'){localStorage.setItem('sem2_first_visit_configured','true');window.sessionStorage.setItem('sem2-studio-rift-intro-v3','seen');}});
  const page=await context.newPage();page.setDefaultTimeout(6000);
  await page.coverage.startJSCoverage({resetOnNavigation:false});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const go=async route=>{await page.goto(base+route,{waitUntil:'load'});};
  try{await fn({page,context,go,errors});results.push({name,passed:true});console.log('PASS',name);}
  catch(e){results.push({name,passed:false,error:e.stack,errors});await page.screenshot({path:path.join(output,name+'.png')}).catch(()=>{});console.log('FAIL',name,e.message.slice(0,180));}
  finally{coverage.push(...await page.coverage.stopJSCoverage());await context.close();}
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
    await go('index.html');await page.waitForTimeout(650);if(!await page.locator('#student-profile-modal').isVisible())await page.locator('[data-open-profile-modal]').first().click();await page.locator('input[value="B2"]').locator('..').click();await page.locator('#profile-selection-form button[type="submit"]').click();await page.locator('#student-profile-modal').waitFor({state:'hidden'});
    assert.equal(await page.locator('#courses-grid article').count(),6);assert.equal(await page.evaluate(()=>StudentProfile.get().group),'B2');await page.locator('[data-theme-btn="reading"]').click();assert.equal(await page.evaluate(()=>PortalTheme.getTheme()),'reading');assert.deepEqual(errors,[]);
  });
  await scenario('offline-cdn',async({page,go,errors})=>{
    await page.route('https://**',r=>r.abort());await go('subject.html?id=database-systems');
    assert.equal(await page.locator('#lectures-list .btn-preview-pdf').count(),4);
    assert(!await page.locator('#track-panel-section').isVisible());assert(!await page.locator('#pdf-modal').isVisible());assert.deepEqual(errors,[]);
  });
  await scenario('drive-folder-no-iframe',async({page,go})=>{
    await go('subject.html?id=computer-graphics');await resource(page,'resources');assert(!await page.locator('#toggle-preview-btn').isVisible());assert.equal(await page.locator('#exp-iframe').getAttribute('src'),'');assert((await page.locator('#exp-main-btn').innerText()).includes('مجلد'));
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
  await scenario('study-load-retry',async({page,go})=>{
    let attempts=0;await page.route('**/js/lecture-explanations-data.js*',route=>++attempts===1?route.abort():route.continue());
    await go('subject.html?id=database-systems');await page.locator('[data-open-study-lecture="2"]').first().click();await page.locator('#study-retry').waitFor({state:'visible'});await page.locator('#study-retry').click();await page.locator('#study-slides-feed img').first().waitFor({state:'attached'});assert.equal(attempts,2);assert.equal(await page.locator('#study-slides-feed img').count(),30);
  });
  await scenario('closing-study-cancels-late-render',async({page,go})=>{
    await page.route('**/js/lecture-explanations-data.js*',async route=>{const response=await route.fetch();await new Promise(resolve=>setTimeout(resolve,700));await route.fulfill({response});});
    await go('subject.html?id=database-systems');await page.locator('[data-open-study-lecture="2"]').first().click();await page.locator('#study-modal-close').click();await page.waitForTimeout(1000);assert(!await page.locator('#lecture-study-modal').isVisible());assert.equal(await page.locator('#study-slides-feed img').count(),0);
  });
  await scenario('all-courses-profile-matrix',async({page,go,errors})=>{
    await go('index.html');const ids=await page.evaluate(()=>COURSES_DATA.map(c=>c.id));let cases=0;
    for(const id of ids){await go('subject.html?id='+id);for(let section=1;section<=12;section++){
      const result=await page.evaluate(({id,section})=>{StudentProfile.set('B'+Math.ceil(section/4),section);const c=COURSES_DATA.find(x=>x.id===id),staff=StudentProfile.getCourseStaff(id);return {count:document.querySelectorAll('#sections-list .btn-preview-pdf').length,expected:(c.sections||[]).filter(x=>StudentProfile.isTaMatch(x.ta,staff.ta)).length,staff:document.querySelector('#subject-ta').textContent.startsWith(staff.ta)};},{id,section});assert.equal(result.count,result.expected);assert(result.staff);cases++;
    }await resource(page, 'sections');assert(await page.locator('#track-panel-section').isVisible());}
    assert.equal(cases,72);assert.deepEqual(errors,[]);
  });
  await scenario('pdf-video-and-dialog-cleanup',async({page,go})=>{
    await go('subject.html?id=computer-architecture');await page.locator('#lectures-list .btn-preview-pdf').first().click();await page.locator('#pdf-modal').waitFor({state:'visible'});assert((await page.locator('#pdf-modal-frame').getAttribute('src')).endsWith('/preview'));await page.keyboard.press('Escape');assert.equal(await page.locator('#pdf-modal-frame').getAttribute('src'),null);
    await resource(page,'videos');await page.locator('.btn-play-video').first().click();await page.locator('#video-modal').waitFor({state:'visible'});assert((await page.locator('#video-modal-frame').getAttribute('src')).includes('youtube.com/embed/'));await page.locator('#video-modal-close').click();assert.equal(await page.locator('#video-modal-frame').getAttribute('src'),null);
    await resource(page, 'sections');await page.locator('#sections-list .btn-preview-pdf').first().click();await page.locator('#pdf-modal').waitFor({state:'visible'});await page.locator('#pdf-modal-close').click();
    await go('subject.html?id=data-structure&track=section');await resource(page,'assignments');await page.locator('#assignments-list .btn-preview-pdf').first().click();assert((await page.locator('#pdf-modal-frame').getAttribute('src')).includes('materials/ds/'));await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
  });
  await scenario('quiz-scoring-completion-and-reset',async({page,go})=>{
    await go('subject.html?id=database-systems');await page.locator('[data-open-study-lecture="2"]').first().click();await page.locator('#study-tab-btn-quiz').click();const answers=await page.evaluate(()=>LECTURE_EXPLANATIONS['database-systems'][2].fullQuiz.map(q=>({id:q.id,correct:q.correct})));
    assert.equal(await page.locator('#full-quiz-score-val').evaluate(x=>getComputedStyle(x).direction),'ltr');for(const q of answers){await question(page,q.id);await page.locator(`.full-quiz-opt-btn[data-qid="${q.id}"][data-opt-idx="${q.correct}"]`).click();}assert.equal(await page.locator('#full-quiz-score-val').innerText(),'20 / 20');assert(await page.locator('#full-quiz-summary-card').isVisible());assert.equal(await page.locator('#full-quiz-percent').innerText(),'(100%)');await page.locator('#full-quiz-reset-btn').click();assert.equal(await page.locator('#full-quiz-score-val').innerText(),'0 / 20');assert(!await page.locator('#full-quiz-summary-card').isVisible());
    const first=answers[0];await page.locator(`.full-quiz-opt-btn[data-qid="${first.id}"][data-opt-idx="${(first.correct+1)%4}"]`).click();assert.equal(await page.locator('#full-quiz-score-val').innerText(),'0 / 20');assert(await page.locator(`.full-quiz-opt-btn[data-qid="${first.id}"]`).evaluateAll(xs=>xs.every(x=>x.disabled)));
    await page.locator('#study-tab-btn-slides').click();await page.locator('#study-font-zoom-in').click();await page.locator('#study-font-zoom-out').click();await page.locator('#study-modal-fullscreen').click();assert(await page.locator('#lecture-study-modal').evaluate(x=>x.classList.contains('is-fullscreen')));await page.keyboard.press('Escape');
  });
  await scenario('copy-success-and-rejection',async({page,go})=>{
    await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async value=>{window.copiedValue=value;}}}));await go('subject.html?id=computer-architecture');await resource(page,'videos');await page.locator('.btn-copy-link').first().click();assert((await page.evaluate(()=>window.copiedValue)).includes('youtu.be/'));assert(!await page.locator('#copy-link-fallback').count());
    await page.evaluate(()=>navigator.clipboard.writeText=async()=>{throw new Error('denied')});await page.locator('#share-btn').click();await page.locator('#copy-link-fallback').waitFor({state:'visible'});await page.locator('#copy-link-fallback button').click();assert(!await page.locator('#copy-link-fallback').isVisible());
  });
  await scenario('file-mode-study',async({page})=>{
    const {pathToFileURL}=require('node:url');await page.goto(pathToFileURL(path.join(root,'subject.html')).href+'?id=database-systems');await page.locator('[data-open-study-lecture="2"]').first().click();await page.locator('#study-slides-feed img').first().waitFor({state:'attached'});assert.equal(await page.locator('#study-slides-feed img').count(),30);await page.keyboard.press('Escape');
  });
  await scenario('home-search-filters-and-pending-notice',async({page,go})=>{
    await go('index.html');for(const [category,count]of [['all',6],['CS',4],['IS',1],['General',1]]){await page.locator(`[data-filter="${category}"]`).click();assert.equal(await page.locator('#courses-grid article').count(),count);}await page.locator('[data-filter="all"]').click();for(const term of ['CS221','قواعد البيانات','cache']){await page.locator('#search-input').fill(term);assert.equal(await page.locator('#courses-grid article').count(),1);}await page.locator('#search-input').fill('no-such-course');assert(await page.locator('#no-results').isVisible());await page.locator('#clear-search').click();assert.equal(await page.locator('#courses-grid article').count(),6);
    await page.locator('.studio-rail nav a[href="#schedule-section"]').click();await page.locator('#schedule-section').waitFor({state:'visible'});await page.evaluate(()=>StudentProfile.set('B2',6));assert(await page.locator('#schedule-data-notice').isVisible());await page.evaluate(()=>StudentProfile.set('B1',1));assert(!await page.locator('#schedule-data-notice').isVisible());
  });
  await scenario('corrupt-profile-does-not-break-home',async({page,go,errors})=>{
    await page.addInitScript(()=>{if(location.hostname==='127.0.0.1')localStorage.setItem('sem2_student_profile','null');});await go('index.html');assert.equal(await page.locator('#courses-grid article').count(),6);assert.equal(await page.evaluate(()=>StudentProfile.get().group),'B1');assert.deepEqual(errors,[]);
  });
  fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify(results,null,2));
  fs.writeFileSync(path.join(output,'browser-coverage.json'),JSON.stringify(coverage));
  console.log(`${results.filter(x=>x.passed).length}/${results.length} scenarios passed`);
  if(results.some(x=>!x.passed))process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));});
