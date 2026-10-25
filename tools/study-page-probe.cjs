// Compare computed lecture layouts before/after removing the runtime CSS compiler.
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
async function main(){
  const label=process.env.PORTAL_STUDY_LABEL || 'before';
  const base=process.env.PORTAL_STUDY_URL || 'http://127.0.0.1:8877/';
  const dir=path.resolve('test-results/performance/study');fs.mkdirSync(dir,{recursive:true});
  const browser=await chromium.launch({channel:'chrome',headless:true});
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const records=[];
  try{
    for(const folder of ['arch','db','ds'])for(const name of fs.readdirSync('study/'+folder).filter(x=>x.endsWith('.html'))){
      const file=`study/${folder}/${name}`,page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(new URL(file,base).href);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(500);
      const record=await page.evaluate(()=>({title:document.title,styles:[...document.querySelectorAll('body [class]')].map(el=>{
        const s=getComputedStyle(el);return [el.tagName,el.className,...['display','padding','margin','gap','fontSize','fontWeight','fontFamily','color','backgroundColor','borderRadius','textAlign'].map(p=>s[p])];
      })}));
      record.file=file;record.errors=errors;records.push(record);
      await page.screenshot({path:path.join(dir,folder+'-'+name+'-'+label+'.png')});await page.close();console.log(file,errors.length?'ERROR '+errors.join('; '):'OK');
    }
    fs.writeFileSync(path.join(dir,label+'.json'),JSON.stringify(records));
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
