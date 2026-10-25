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
    const body=html.slice(html.indexOf('<body')).replace('../../js/vendor/mermaid/mermaid.min.js','https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js').replace('../../css/vendor/fontawesome/css/all.min.css','https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
    assert.equal(crypto.createHash('sha256').update(body.replace(/\r\n/g,'\n')).digest('hex'),hash,file);
    assert(!html.includes('cdn.tailwindcss.com'),file);
  }
});
test('mirrored study fonts have their content hash and WOFF2 signature',()=>{
  const dir=path.resolve(__dirname,'../css/fonts/study');
  const files=fs.readdirSync(dir).filter(file=>file.endsWith('.woff2'));
  assert(files.length>0);
  for(const file of files){const bytes=fs.readFileSync(path.join(dir,file));assert.equal(bytes.subarray(0,4).toString(),'wOF2',file);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex').slice(0,20)+'.woff2',file);}
});
