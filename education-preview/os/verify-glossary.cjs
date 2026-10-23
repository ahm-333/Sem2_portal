const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.OS_PREVIEW_URL||'http://127.0.0.1:8765/education-preview/os/';
const out=path.resolve(__dirname,'../../test-results/education/os-pilot/language-revision-20261023');
(async()=>{
 const browser=await chromium.launch(require('./browser-options.cjs'));
 try{
  for(const width of [390,1280]){
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(6000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base);await page.locator('#kernel').waitFor();
   await page.getByRole('link',{name:'كل المصطلحات',exact:true}).click();
   const glossary=page.getByRole('region',{name:'Key terms · كل المصطلحات',exact:true});await glossary.waitFor();
   const required=['Hardware','Resource','CPU','RAM / Main memory','Storage','Input/Output (I/O)','Program','User','Application program','Operating system (OS)','Kernel','System program','Resource allocator','Control program','User view','System view','Compiler','Web browser','Word processor'];
   for(const term of required){const card=glossary.getByRole('article',{name:term,exact:true});await card.waitFor();assert.ok(await card.locator('.term-definition[lang=en][dir=ltr]').innerText());assert.ok(await card.locator('.term-translation[lang=ar]').innerText());assert.ok(await card.locator('.term-explanation[lang=ar]').innerText());}
   assert.equal(await glossary.getByRole('article').count(),required.length);
   assert.deepEqual(await glossary.getByRole('article',{name:'Hardware',exact:true}).locator('.term-explanation bdi[lang=en][dir=ltr]').allTextContents(),['CPU','RAM'],'Inline English terms must retain their reading direction and language inside Egyptian explanations');
   assert.equal(await page.locator('.lesson-paper>section').last().getAttribute('id'),'glossary','Glossary must be the final lesson section');
   await page.locator('#glossary').scrollIntoViewIfNeeded();await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(out,`glossary-${width}.png`)});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Glossary must fit the viewport');
   assert.deepEqual(errors,[]);await context.close();
  }
  console.log('PASS glossary: 19 English definitions, Arabic meanings/explanations, accessible final section and 390/1280px layouts.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
