const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const out=path.resolve(__dirname,'../../test-results/education/os-pilot');
const base=process.env.OS_PREVIEW_URL||'http://127.0.0.1:8765/education-preview/os/';
// Literal solution fixtures from the independent source review, not the payload's keys.
const keys={'roles-report':'app','users-machines':'true','allocation-conflict':'os','control-guarantee':'false','view-response':'user-view','historical-kernel':'resources','bundle-kernel':'system-program','four-components-adapted':'four-roles'};
const records=[];
(async()=>{
  const browser=await chromium.launch(require('./browser-options.cjs'));
  try{
    for(const width of [360,390,412,1280]){
      const context=await browser.newContext({viewport:{width,height:900},hasTouch:width<500,isMobile:width<500,reducedMotion:'reduce'});
      await context.route('https://**',route=>route.abort());
      const page=await context.newPage();page.setDefaultTimeout(6000);const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
      assert.equal((await page.goto(base)).status(),200);await page.locator('#kernel').waitFor();await page.evaluate(()=>document.fonts.ready);
      const noOverflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Horizontal overflow at ${width}`);
      await noOverflow();
      assert.equal(await page.locator('textarea,input[type=text]').count(),0);
      assert.equal(await page.locator('.question fieldset legend').count(),8);
      const inputs=await page.locator('input[type=radio]').count();assert.equal(inputs,28);
      assert.ok(await page.locator('input').evaluateAll(list=>list.every(i=>i.labels?.length===1)));
      const tap=page.getByRole('button',{name:'Hardware',exact:true});
      if(width<500)await tap.tap();else{await tap.focus();await page.keyboard.press('Space');}
      assert.equal(await tap.getAttribute('aria-pressed'),'true');assert.match(await page.locator('#role-detail').innerText(),/CPU/);
      const focusStyle=await tap.evaluate(e=>({outline:getComputedStyle(e).outlineWidth,height:e.getBoundingClientRect().height}));
      assert.ok(focusStyle.height>=44);
      if(width===1280)assert.ok(parseFloat(focusStyle.outline)>=3,'Visible keyboard focus');
      await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(out,`preview-${width}-top.png`)});
      await page.locator('#role-map').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,`preview-${width}-diagram.png`)});
      for(const [qid,key]of Object.entries(keys)){
        const box=page.locator(`[data-question="${qid}"]`);
        const options=await box.locator('input').evaluateAll(list=>list.map(i=>i.value));
        for(const option of options){
          await page.getByRole('button',{name:'ابدأ المحاولة من جديد',exact:true}).click();
          await box.locator(`input[value="${option}"]`).check();await box.getByRole('button',{name:'راجع الإجابة',exact:true}).click();
          const text=await box.getByRole('status').innerText();
          assert.match(text,option===key?/إجابة صحيحة/:/إجابة محتاجة تصحيح/);
          assert.ok(text.length>60,'Explanatory feedback');
          await noOverflow();
        }
      }
      // Capture one actual correction state, including full explanation.
      await page.getByRole('button',{name:'ابدأ المحاولة من جديد',exact:true}).click();
      const first=page.locator('[data-question="roles-report"]');
      await first.getByLabel('Operating system',{exact:true}).check();await first.getByRole('button',{name:'راجع الإجابة',exact:true}).click();
      await first.locator('.feedback').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,`preview-${width}-feedback.png`)});
      await page.getByRole('link',{name:'سلايد 8',exact:true}).first().click();
      assert.equal(await page.locator('#source-8').getAttribute('open'),'');
      await page.locator('#source-8 img').evaluate(i=>i.decode());
      assert.equal(await page.locator('#source-8 img').evaluate(i=>i.complete&&i.naturalWidth===1600),true);
      assert.equal(errors.length,0,JSON.stringify(errors));
      records.push({width,optionPaths:28,overflow:false,errors,touch:width<500,sourceAnchorOpens:true});await context.close();
    }
    const context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});
    const page=await context.newPage();await page.goto(base);await page.locator('#kernel').waitFor();
    // Text-only zoom simulation: double every computed text size once, preserving viewport.
    await page.evaluate(()=>{const entries=[...document.querySelectorAll('body,body *')].map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);for(const [e,size]of entries)e.style.fontSize=`${size*2}px`;});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'200% text resize must reflow');
    await page.screenshot({path:path.join(out,'text-zoom-200-top.png')});
    await page.locator('#role-map').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'text-zoom-200-diagram.png')});
    const buttons=await page.locator('button').evaluateAll(list=>list.map(b=>({text:b.textContent,width:b.getBoundingClientRect().width,scroll:b.scrollWidth,client:b.clientWidth})));
    assert.ok(buttons.every(b=>b.scroll<=b.client+1),'Text zoom button clipping');
    records.push({textZoom:'simulated 200% computed font sizes',width:390,overflow:false});await context.close();
    const zoomContext=await browser.newContext({viewport:{width:640,height:450},deviceScaleFactor:2});
    const zoomPage=await zoomContext.newPage();await zoomPage.goto(base);await zoomPage.locator('#kernel').waitFor();
    assert.ok(await zoomPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));records.push({pageZoom:'200% desktop equivalent CSS viewport',width:640});await zoomContext.close();
    // GitHub Pages subpath and no-JS source fallback remain usable.
    const sub=await browser.newContext();const p=await sub.newPage();
    await p.goto(base.replace('/education-preview/','/Sem2_portal/education-preview/'));await p.getByRole('heading',{name:'مين بيعمل إيه جوّه جهازك؟',exact:true}).waitFor();await sub.close();
    const nojs=await browser.newContext({javaScriptEnabled:false});const np=await nojs.newPage();await np.goto(base);
    // Playwright's text selector skips NOSCRIPT subtrees; inspect the visible notice itself.
    const fallback=np.locator('noscript .notice');assert.ok(await fallback.isVisible());assert.match(await fallback.innerText(),/JavaScript/);
    assert.equal(await np.getByRole('link',{name:'المحاضرة الأصلية',exact:true}).count(),1);
    for(const href of await fallback.locator('a').evaluateAll(list=>list.map(a=>a.href))){
      if(new URL(href).origin===new URL(base).origin)assert.equal((await nojs.request.get(href)).status(),200);
      else assert.equal(href,'https://drive.google.com/file/d/14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M/view');
    }
    await nojs.close();
    records.push({subpath:true,noJsSources:true});
    fs.writeFileSync(path.join(out,'layout-results.json'),JSON.stringify({timestamp:new Date().toISOString(),base,records},null,2));
    console.log(`PASS layouts: 360/390/412/1280; 112 option paths; touch/keyboard; sources; text resize; 200% page-zoom equivalent; Pages subpath and no-JS source fallback.`);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
