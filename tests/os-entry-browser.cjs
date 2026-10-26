const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const origin=process.env.PORTAL_ORIGIN||'http://127.0.0.1:8765/';
const out=path.resolve(__dirname,'../test-results/education/os-course/portal-entry');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch(require('../education-preview/os/browser-options.cjs'));const results=[];try{
 for(const prefix of ['', 'Sem2_portal/'])for(const width of [390,1440]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});await context.route('https://**',r=>r.abort());
  await context.addInitScript(()=>{localStorage.setItem('sem2_first_visit_configured','true');window.sessionStorage.setItem('sem2-studio-rift-intro-v3','seen');});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(8000);
  const subject=origin+prefix+'subject.html?id=operating-system';
  for(const [chapter,unit] of [[1,'os-01'],[2,'os-09'],[3,'os-13']]){
   await page.goto(subject);const link=page.locator(`[data-os-course-link="${chapter}"]`);await link.waitFor();
   assert.equal(await page.locator('[data-os-course-link]').count(),3);assert.equal(await page.locator('#lectures-list [data-open-study-lecture]').count(),0);
   assert.equal(await link.getAttribute('href'),`education-preview/os/?unit=${unit}`);assert.ok(await link.evaluate(e=>e.classList.contains('a1-action-primary')));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
   if(chapter===1)await page.screenshot({path:path.join(out,`os-subject-${prefix?'pages':'root'}-${width}.png`),fullPage:true});
   await link.click();await page.locator('#glossary-content article').last().waitFor();assert.equal(await page.evaluate(()=>window.OSPilotLesson.id),unit);assert.equal(await page.locator('#course-index a').count(),19);
   assert.equal(new URL(page.url()).pathname,'/'+prefix+'education-preview/os/');
   await page.locator('.study-shell-brand').click();await page.locator('#courses-grid').waitFor();assert.equal(new URL(page.url()).pathname,'/'+prefix+'index.html');
   results.push({prefix,width,chapter,unit,passed:true});
  }
  await page.goto(origin+prefix+'subject.html?id=database-systems');assert.equal(await page.locator('[data-os-course-link]').count(),0);await page.locator('[data-open-study-lecture="2"]').first().click();await page.locator('#lecture-study-modal').waitFor();await page.locator('#study-slides-feed img').first().waitFor({state:'attached'});await page.keyboard.press('Escape');
  assert.deepEqual(errors,[]);await context.close();
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({date:new Date().toISOString(),results,otherSubjectReaderPassed:true},null,2));console.log('PASS OS portal entry: three chapter links, primary actions, real lesson/catalog/home navigation, root/Pages prefixes and mobile/desktop; other-subject reader preserved.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
