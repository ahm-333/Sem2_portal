const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch(require('./browser-options.cjs'));
  try{
    const page=await browser.newPage();await page.goto(process.env.OS_PREVIEW_URL||'http://127.0.0.1:8765/education-preview/os/');await page.locator('#kernel').waitFor();
    // A screen reader's language context must follow the actual question/answer language.
    const languages=await page.locator('.question label span').evaluateAll(list=>list.map(e=>({text:e.textContent,lang:e.closest('[lang]')?.lang})));
    assert.equal(languages.length,28);
    assert.ok(languages.every(e=>e.lang==='en'),'English options must declare their language for assistive technology');
    for(const id of ['users-machines','control-guarantee']){
      const parts=await page.locator(`[data-question="${id}"] label [lang=ar]`).allTextContents();
      assert.deepEqual(parts,['صح','غلط'],'Arabic true/false glosses retain Arabic language');
    }
    const q=page.locator('[data-question="control-guarantee"]');await q.getByLabel('True · صح',{exact:true}).check();await q.getByRole('button',{name:'راجع الإجابة',exact:true}).click();
    assert.equal(await q.locator('.feedback [lang=ar]').textContent(),'غلط');
    console.log('PASS language: 28 English options and bilingual true/false correction have appropriate language contexts.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
