const test = require('node:test');
const assert = require('node:assert/strict');
const {portal} = require('./helpers.cjs');

for (const value of ['null','{}','[]','12','"B1"','{"group":"<b>bad</b>","section":1}']) {
  test('invalid stored profile is normalized: '+value, () => {
    const {context} = portal({saved:{sem2_student_profile:value}});
    assert.equal(JSON.stringify(context.StudentProfile.get()),JSON.stringify({group:'B1',section:1}));
  });
}
test('a section from another group uses the first valid section',()=>{
  const {context}=portal({saved:{sem2_student_profile:'{"group":"B2","section":12}'}});
  assert.equal(JSON.stringify(context.StudentProfile.get()),JSON.stringify({group:'B2',section:5}));
});
test('all twelve valid profiles round trip and dispatch normalized state',()=>{
  const {context,events}=portal();
  for(const g of Object.values(context.SCHEDULE_CONFIG.groups))for(const s of g.sections){context.StudentProfile.set(g.id,String(s));assert.equal(context.StudentProfile.get().section,s);assert.equal(events.at(-1).detail.group,g.id);}
  assert.equal(events.length,12);
});
test('blocked storage still allows profile changes during this session',()=>{
  const {context}=portal({denyRead:true,denyWrite:true});
  assert.doesNotThrow(()=>context.StudentProfile.set('B3',10));
  assert.equal(context.StudentProfile.get().section,10);
});
test('write denial cannot resurrect a stale stored profile',()=>{
  const {context}=portal({denyWrite:true,saved:{sem2_student_profile:'{"group":"B1","section":1}'}});
  context.StudentProfile.set('B2',6);
  assert.equal(context.StudentProfile.get().section,6);
});
test('theme is usable without persistent storage',()=>{
  const env=portal({denyRead:true,denyWrite:true});
  assert.doesNotThrow(()=>env.load('js/theme.js'));
  env.context.PortalTheme.setTheme('reading');
  assert.equal(env.context.PortalTheme.getTheme(),'reading');
  assert.equal(env.attributes['data-theme'],'reading');
});
test('unknown group and invalid writes never cross the public seam',()=>{
  const {context}=portal();context.StudentProfile.set('B99',Infinity);
  assert.equal(context.StudentProfile.get().group,'B1');
  assert.equal(context.StudentProfile.get().section,1);
});
