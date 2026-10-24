const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const out=path.resolve(__dirname,'../test-results/education/os-course/logo');fs.mkdirSync(out,{recursive:true});
const origin=process.env.PORTAL_ORIGIN||'http://127.0.0.1:8765/';
(async()=>{const browser=await chromium.launch(require('../education-preview/os/browser-options.cjs'));try{
 const context=await browser.newContext();await context.addInitScript(()=>{localStorage.setItem('sem2_first_visit_configured','true');window.sessionStorage.setItem('sem2-studio-rift-intro-v3','seen');});
 const reference=await context.newPage();await reference.goto(origin+'education-preview/os/');
 const expected=await reference.locator('.brand-mark').evaluate(e=>{const s=getComputedStyle(e);return{width:s.width,height:s.height,radius:s.borderRadius,background:s.backgroundColor,shadow:s.boxShadow};});
 for(const width of [360,390,1440])for(const route of ['index.html','subject.html?id=operating-system']){
  const page=await context.newPage({viewport:{width,height:900}});await page.setViewportSize({width,height:900});await page.goto(origin+route);await page.locator('.a1-brand-mark').waitFor();
  assert.equal(await page.locator('.a1-brand-mark svg').count(),0,'Original header must use the accepted simple mark, not the previous processor SVG');
  assert.equal(await page.locator('.a1-brand').getAttribute('href'),'index.html');
  for(const theme of ['light','dark','reading']){await page.evaluate(t=>{document.documentElement.dataset.theme=t;},theme);const actual=await page.locator('.a1-brand-mark').evaluate(e=>{const s=getComputedStyle(e);return{width:s.width,height:s.height,radius:s.borderRadius,background:s.backgroundColor,shadow:s.boxShadow};});assert.deepEqual(actual,expected,`Preview mark identity on ${route}/${width}/${theme}`);}
  await page.screenshot({path:path.join(out,`${route.startsWith('subject')?'subject':'home'}-${width}.png`)});await page.close();
 }
 await context.close();console.log('PASS accepted logo: original home/subject, 360/390/1440px and all three themes; brand navigation preserved.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
