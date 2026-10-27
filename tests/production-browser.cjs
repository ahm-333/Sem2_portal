// Test the actual published artifact, including bundles, lazy content and its public boundary.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../dist');
async function main(){
  assert(fs.existsSync(path.join(root,'index.html')),'run npm run package first');
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.json':'application/json','.webmanifest':'application/manifest+json'};
  const server=http.createServer((req,res)=>{
    const relative=new URL(req.url,'http://local').pathname.replace(/^\/Sem2_portal\//,'/');
    const file=path.resolve(root,'.'+relative+(relative.endsWith('/')?'index.html':''));
    if(!file.startsWith(root+path.sep)||relative.split('/').some(part=>part.startsWith('.'))){res.writeHead(404);res.end();return;}
    fs.readFile(file,(error,bytes)=>{if(error){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('X-Content-Type-Options','nosniff');res.end(bytes);});
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=process.env.PORTAL_RELEASE_URL || `http://127.0.0.1:${server.address().port}/`;
  const browser=await chromium.launch({headless:true,...(process.env.PORTAL_BROWSER_CHANNEL?{channel:process.env.PORTAL_BROWSER_CHANNEL}:{})});
  let cases=0;
  try{
    for(const prefix of ['',...(process.env.PORTAL_RELEASE_URL?[]:['Sem2_portal/'])])for(const width of [390,1440]){
      const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
      await context.addInitScript(()=>{localStorage.setItem('sem2_first_visit_configured','true');});
      const external=[];
      await context.route('https://**',r=>{
        if(new URL(r.request().url()).origin===new URL(base).origin)return r.continue();
        external.push(r.request().url());return r.abort();
      });
      // Vercel serves this endpoint; the local static server has no analytics service.
      if(!process.env.PORTAL_RELEASE_URL)await context.route('**/_vercel/insights/script.js',route=>route.fulfill({contentType:'application/javascript',body:'window.__analyticsScriptLoaded = true;'}));
      const page=await context.newPage(),errors=[],missing=[];
      page.on('pageerror',error=>errors.push(error.message));
      page.on('response',res=>{if(res.url().startsWith(base)&&res.status()>=400)missing.push(res.url());});
      await page.goto(base+prefix+'index.html');await page.locator('#courses-grid article').first().waitFor();
      assert.equal(await page.locator('#courses-grid article').count(),6);
      assert.equal(await page.locator('#library-results .studio-library-row').count(),0);
      assert.equal(await page.locator('script[defer][src^="assets/"]').count(),1,'production has one application bundle');
      const platformHost=/(?:^|\.)vercel\.app$/i.test(new URL(base).hostname);
      assert.equal(await page.locator('script[defer][src="/_vercel/insights/script.js"]').count(),platformHost?1:0,'platform analytics is requested only on its supported deployment');
      if(!process.env.PORTAL_RELEASE_URL)assert.equal(await page.evaluate(()=>window.__analyticsScriptLoaded),undefined,'static previews do not request missing platform services');
      const courses=await page.evaluate(()=>window.COURSES_DATA.map(course=>course.id));
      for(const id of courses){
        await page.goto(base+prefix+'subject.html?id='+id);await page.locator('.course-atlas').waitFor({state:'visible'});
        assert.equal(await page.locator('.atlas-branches button').count(),5);
        assert.equal(await page.locator('i[data-lucide]').count(),0,'all icons are present in the small icon bundle');
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
        if(id==='database-systems'){
          assert.equal(await page.evaluate(()=>!!window.LECTURE_EXPLANATIONS),false,'full study data remains lazy');
          await page.locator('[data-open-study-lecture="2"]').first().click();
          await page.locator('#study-slides-feed .slide-study-card').first().waitFor();
          await page.locator('#study-tab-btn-quiz').click();await page.locator('.full-quiz-opt-btn').first().waitFor();
          await page.locator('#full-q-1 .full-quiz-opt-btn').filter({hasText:'Traditional applications (Numeric and Textual databases)'}).click();
          assert.equal(await page.locator('#full-quiz-score-val').innerText(),'1 / 20','the packaged quiz grades the authored correct answer after choice presentation');
          await page.keyboard.press('Escape');
        }
        // Exercise the actual bundled loader and all six course banks, not only source scripts.
        await page.locator('[data-open-power-tool="midterm"]').click();
        await page.locator('#start-midterm-btn:enabled').waitFor();
        await page.locator('#start-midterm-btn').click();
        await page.locator('.midterm-q-prompt').waitFor();
        await page.locator('[data-midterm-opt="0"]').click();
        await page.locator('#midterm-submit-btn').click();
        await page.locator('#midterm-confirm-submit').click();
        await page.locator('#midterm-result-banner').waitFor();
        await page.keyboard.press('Escape');
        if(['computer-graphics','report-writing'].includes(id)){
          assert(await page.locator('.is-upcoming-tool').isDisabled());
          assert.equal(await page.locator('[data-open-power-tool="interactive"]').count(),0);
        }
        cases++;
      }
      if(width===1440){
        for(let unit=1;unit<=19;unit++){
          await page.goto(base+prefix+`education-preview/os/?unit=os-${String(unit).padStart(2,'0')}`);
          await page.locator('#glossary-content article').last().waitFor();cases++;
        }
        for(const folder of ['arch','db','ds'])for(const file of fs.readdirSync(path.join(root,'study',folder)).filter(name=>name.endsWith('.html'))){
          await page.goto(base+prefix+`study/${folder}/${file}`);assert(await page.locator('h1').first().isVisible());cases++;
        }
      }
      assert.deepEqual(errors,[]);
      assert.deepEqual(missing,[]);
      assert.deepEqual(external,[],'core routes, fonts, diagrams and icons are independent of external CDNs');
      await context.close();
    }
    for(const file of ['automation/README.md','tools/package-site.cjs','docs/STUDIO-REVIEW.md','package.json','tests/browser.cjs']){
      const response=await fetch(new URL(file,base));assert.equal(response.status,404,file);cases++;
    }
    console.log(`PASS packaged release: ${cases} routes/boundaries, bundles, six courses, lazy reader/quiz, 19 OS units, standalone chapters, mobile and desktop.`);
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
