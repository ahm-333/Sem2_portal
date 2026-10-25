const assert=require('node:assert/strict');
const {test}=require('node:test');
const {runtime}=require('../tools/package-site.cjs');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
test('static release includes all teaching formats and excludes non-runtime files',()=>{
  for(const file of ['js/study-reader.js','css/fonts/alexandria-0.woff2','js/vendor/gsap/GSAP-NOTICE.txt','study/ds/lecture-2.html','materials/slides/db/slide-01.png','education-preview/os/units/os-19.js','education-preview/os/sources/ch3/slide-01.png'])assert(runtime(file),file);
  for(const file of ['automation/docker-compose.yml','.env','docs/DESIGN.md','tests/browser.cjs','package-lock.json','education-preview/os/check.cjs','education-preview/os/units/os-19.review.json','study/private.txt','js/debug.log'])assert(!runtime(file),file);
});
test('standalone teaching bodies remain unchanged across platform line endings',()=>{
  const root=path.resolve(__dirname,'..');
  const baseline=require('../docs/review/performance/content-baseline.json');
  for(const [file,hash] of Object.entries(baseline.files)){
    const html=fs.readFileSync(path.join(root,file),'utf8');
    let body=html.slice(html.indexOf('<body')).replace('../../js/vendor/mermaid/mermaid.min.js','https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js').replace('../../css/vendor/fontawesome/css/all.min.css','https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
    for(const change of baseline.navigationFixes?.[file] || [])body=body.replaceAll(change.after,change.before);
    assert.equal(crypto.createHash('sha256').update(body.replace(/\r\n/g,'\n')).digest('hex'),hash,file);
    assert(!html.includes('cdn.tailwindcss.com'),file);
  }
});
test('every local link in the standalone study pages resolves',()=>{
  const root=path.resolve(__dirname,'..'),missing=[];
  for(const folder of ['arch','db','ds'])for(const name of fs.readdirSync(path.join(root,'study',folder)).filter(file=>file.endsWith('.html'))){
    const file=`study/${folder}/${name}`,html=fs.readFileSync(path.join(root,file),'utf8'),base=new URL('https://portal.local/'+file);
    for(const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)){
      const href=match[1];if(href.startsWith('#')||href.includes('${'))continue;
      const url=new URL(href,base);if(url.origin!==base.origin)continue;
      let target=path.join(root,decodeURIComponent(url.pathname));
      if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
      const relative=path.relative(root,target).split(path.sep).join('/');
      if(!fs.existsSync(target)||!(['index.html','subject.html'].includes(relative)||runtime(relative)))missing.push({file,href});
    }
  }
  assert.deepEqual(missing,[],'standalone navigation must not lead to missing pages');
});
test('mirrored study fonts have their content hash and WOFF2 signature',()=>{
  const dir=path.resolve(__dirname,'../css/fonts/study');
  const files=fs.readdirSync(dir).filter(file=>file.endsWith('.woff2'));
  assert(files.length>0);
  for(const file of files){const bytes=fs.readFileSync(path.join(dir,file));assert.equal(bytes.subarray(0,4).toString(),'wOF2',file);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex').slice(0,20)+'.woff2',file);}
});
