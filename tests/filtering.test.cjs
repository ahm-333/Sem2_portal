const test=require('node:test');
const assert=require('node:assert/strict');
const {portal}=require('./helpers.cjs');
const items=[{id:1,ta:'م. أمل مجدي'},{id:2,ta:'م. تقى مصطفى'},{id:3}];
test('one filtering rule supports my TA, another TA and all materials',()=>{
  const {context}=portal();const select=context.StudentProfile.filterItemsForTa.bind(context.StudentProfile);
  assert.deepEqual(Array.from(select(items,'my-ta','م.م. أمل مجدي'),x=>x.id),[1]);
  assert.deepEqual(Array.from(select(items,'م. تقى مصطفى','م.م. أمل مجدي'),x=>x.id),[2]);
  assert.deepEqual(Array.from(select(items,'all','م.م. أمل مجدي'),x=>x.id),[1,2,3]);
});
test('general resources remain visible while section-only resources do not',()=>{
  const {context}=portal();
  assert.deepEqual(Array.from(context.StudentProfile.filterItemsForTa(items,'my-ta','م.م. أمل مجدي',true),x=>x.id),[1,3]);
  assert.deepEqual(Array.from(context.StudentProfile.filterItemsForTa([], 'my-ta',null,true)),[]);
});
