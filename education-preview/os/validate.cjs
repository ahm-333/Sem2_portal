// Data contract only. Scientific correctness is reviewed independently against sources.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(__dirname,'lesson-data.js');
assert.ok(fs.existsSync(file), 'Missing OS-01 lesson payload');
const data = require(file);
assert.equal(data.id, 'os-01');
assert.equal(data.courseId, 'operating-system');
assert.equal(data.lectureId, '1');
const unique = (items,label) => {
  assert.ok(items.length, `Empty ${label}`);
  assert.ok(items.every(x=>typeof x.id==='string'&&x.id.length),`Invalid ${label} ID`);
  assert.equal(new Set(items.map(x=>x.id)).size,items.length,`Duplicate ${label} ID`);
};
unique(data.sources,'source'); unique(data.concepts,'concept'); unique(data.questions,'question');
assert.ok(data.glossary?.length,'Missing bilingual term glossary');
unique(data.glossary,'glossary');
const sourceIds = new Set(data.sources.map(x=>x.id));
const conceptIds = new Set(data.concepts.map(x=>x.id));
const refs = entity => {
  assert.ok(entity.sourceRefs?.length,`No evidence: ${entity.id}`);
  for(const ref of entity.sourceRefs){
    assert.ok(sourceIds.has(ref.sourceId),`Unknown source: ${entity.id}`);
    if(ref.sourceId==='current-ch1') assert.ok(ref.slides.length&&ref.slides.every(n=>[4,5,6,7,8].includes(n)),`Out-of-slice: ${entity.id}`);
  }
};
for(const s of data.sources){assert.match(s.url,/^https:\/\/drive\.google\.com\/file\/d\//); assert.match(s.sha256,/^[a-f0-9]{64}$/);}
assert.deepEqual([...new Set(data.concepts.flatMap(c=>c.sourceRefs.filter(r=>r.sourceId==='current-ch1').flatMap(r=>r.slides)))].sort(),[4,5,6,7,8]);
for(const c of data.concepts){refs(c);assert.ok(c.title&&c.paragraphs.length);}
for(const term of data.glossary){refs(term);assert.ok(term.term&&term.translation&&term.definition&&term.explanation,`Incomplete glossary entry: ${term.id}`);}
for(const q of data.questions){
  refs(q); assert.ok(['mcq','true-false'].includes(q.type));
  assert.ok(q.prompt&&q.objective&&q.prerequisites.every(x=>conceptIds.has(x)));
  unique(q.options,`options for ${q.id}`);
  assert.equal(q.options.filter(o=>o.id===q.correctOptionId).length,1,`Invalid key: ${q.id}`);
  if(q.type==='true-false') assert.equal(q.options.length,2);
  assert.ok(q.options.every(o=>q.feedback[o.id]?.length>20),`Missing feedback: ${q.id}`);
  assert.ok(['new','original','adapted'].includes(q.provenance.kind));
  if(q.provenance.kind!=='new') {
    const original=data.historicalItems.find(x=>x.id===q.provenance.originalId);
    assert.ok(original?.originalPrompt&&original.sourceRefs.length,`Missing original: ${q.id}`);
  }
}
for(const x of data.historicalItems) refs(x);
for(const x of data.essayReferences){refs(x);assert.ok(x.answer.length>60);}
assert.equal(data.diagram.actors.length,4);
assert.ok(data.diagram.arrowMeaning&&data.diagram.boundary);
refs(data.diagram); refs(data.scenario);
for(const n of [4,5,6,7,8]) assert.ok(fs.existsSync(path.join(__dirname,`sources/slide-${String(n).padStart(2,'0')}.png`)));
console.log(`PASS: ${data.concepts.length} concepts, slides 4-8, ${data.questions.length} items, stable identities, keys, per-option feedback and provenance.`);
