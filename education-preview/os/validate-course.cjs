const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const catalogPath=path.join(__dirname,'course-catalog.js');
assert.ok(fs.existsSync(catalogPath),'Missing complete OS course map');
const catalog=require(catalogPath);
const crypto=require('node:crypto');
const reviewFile=path.join(__dirname,'review-record.json'),review=fs.existsSync(reviewFile)?JSON.parse(fs.readFileSync(reviewFile)):null;
assert.equal(catalog.units.length,19);
assert.equal(new Set(catalog.units.map(x=>x.id)).size,19);
const allQuestions=new Set(),allConcepts=new Set(),coverage={1:[],2:[],3:[]};
for(const unit of catalog.units){
 const file=path.join(__dirname,unit.file);assert.ok(fs.existsSync(file),`Missing unit ${unit.id}`);
 const d=require(file);assert.equal(d.id,unit.id);assert.equal(String(d.lectureId),String(unit.chapter));assert.equal(d.courseId,'operating-system');
 if(unit.reviewed){assert.ok(review,`Missing independent-review record: ${unit.id}`);const record=review.units.find(r=>r.id===unit.id);assert.ok(record,`Unreviewed unit ${unit.id}`);const digest=crypto.createHash('sha256').update(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n')).digest('hex');assert.equal(digest,record.normalizedSha256,`Content changed after independent review: ${unit.id}`);}
 const localIds=new Set(d.concepts.map(x=>x.id));assert.ok(localIds.size===d.concepts.length&&localIds.size>0);
 const sources=new Set(d.sources.map(x=>x.id));const observed=new Set();
 const refs=x=>{assert.ok(x.sourceRefs?.length,`No evidence ${unit.id}/${x.id}`);for(const r of x.sourceRefs){assert.ok(sources.has(r.sourceId));if(r.sourceId===`current-ch${unit.chapter}`){assert.ok(r.slides.every(p=>unit.pages.includes(p)),`Out-of-unit page ${unit.id}`);if(d.concepts.includes(x))r.slides.forEach(p=>observed.add(p));}}};
 for(const c of d.concepts){assert.ok(!allConcepts.has(c.id),`Repeated concept ${c.id}`);allConcepts.add(c.id);refs(c);assert.ok(c.summary&&c.paragraphs.length);}
 assert.deepEqual([...observed].sort((a,b)=>a-b),unit.pages,`Coverage gap ${unit.id}`);coverage[unit.chapter].push(...unit.pages);
 assert.ok(d.questions.some(q=>q.type==='mcq')&&d.questions.some(q=>q.type==='true-false'));
 for(const q of d.questions){assert.ok(!allQuestions.has(q.id),`Repeated item ${q.id}`);allQuestions.add(q.id);refs(q);assert.ok(q.prerequisites.every(x=>localIds.has(x)));assert.ok(['mcq','true-false'].includes(q.type));assert.ok(q.options.length>=2);assert.equal(new Set(q.options.map(o=>o.id)).size,q.options.length);assert.equal(q.options.filter(o=>o.id===q.correctOptionId).length,1);assert.ok(q.options.every(o=>q.feedback[o.id]?.length>10));if(q.type==='true-false')assert.equal(q.options.length,2);assert.ok(['new','original','adapted'].includes(q.provenance.kind));if(q.provenance.kind!=='new')assert.ok(d.historicalItems.some(h=>h.id===q.provenance.originalId));}
 assert.ok(d.glossary?.length);for(const term of d.glossary){refs(term);assert.ok(term.term&&term.definition&&term.translation&&term.explanation);}
 if(unit.id!=='os-01'){
  assert.ok(d.visualizations?.length,`Missing explanatory visual ${unit.id}`);
  for(const v of d.visualizations){refs(v);assert.ok(localIds.has(v.conceptId));assert.ok(v.legend&&v.description&&v.steps?.length>1);assert.match(v.svg,/<svg\b[^>]*viewBox=/);const svgBody=v.svg.replace(/\sxmlns(?:\:[\w-]+)?=["'][^"']+["']/g,'');assert.ok(!/<script|foreignObject|\son\w+=|https?:\/\//i.test(svgBody),`SVG must be static and self-contained: ${v.id}`);const nodes=[...v.svg.matchAll(/data-node=["']([^"']+)["']/g)].map(m=>m[1]);assert.equal(new Set(nodes).size,nodes.length);for(const s of v.steps){assert.ok(s.id&&s.title&&s.detail);assert.ok((s.focus||[]).every(n=>nodes.includes(n)),`Unknown visual focus ${v.id}`);}}
 }
 for(const p of unit.pages){const f=path.join(__dirname,unit.sourceDirectory,`slide-${String(p).padStart(2,'0')}.png`);assert.ok(fs.existsSync(f),`Missing source image ${f}`);}
}
for(const [chapter,last] of [[1,30],[2,23],[3,30]])assert.deepEqual(coverage[chapter],Array.from({length:last-3},(_,i)=>i+4),`Chapter ${chapter} page coverage must have no gaps or overlaps`);
console.log(`PASS OS course: 19 units, 74 source slides, ${allQuestions.size} stable questions, complete feedback/glossaries and explanatory visuals.`);
