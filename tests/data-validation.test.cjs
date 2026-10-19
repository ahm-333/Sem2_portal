const test=require('node:test');
const assert=require('node:assert/strict');
const {portal}=require('./helpers.cjs');
const {validateData}=require('../tools/data-validation.cjs');
function fixture(){const env=portal();env.load('js/lecture-explanations-data.js');return JSON.parse(JSON.stringify({courses:env.context.COURSES_DATA,schedule:env.context.SCHEDULE_CONFIG,explanations:env.context.LECTURE_EXPLANATIONS}));}
test('current data is valid with explicit unconfirmed timetable records',()=>{
  const result=validateData(fixture(),()=>true);assert.deepEqual(result.errors,[]);assert.equal(result.pending.length,3);
});
test('duplicate course ids and unknown new timetable keys fail validation',()=>{
  const data=fixture();data.courses.push({...data.courses[0]});data.schedule.tasBySection[1].unknown={ta:'x',slot:'السبت • 8:30',room:'x'};
  const result=validateData(data,()=>true);assert(result.errors.some(x=>x.includes('Duplicate course')));assert(result.errors.some(x=>x.includes('unknown')));
});
test('quiz answer indices and local images are validated',()=>{
  const data=fixture();data.explanations['database-systems'][2].fullQuiz[0].correct=99;
  const result=validateData(data,()=>false);assert(result.errors.some(x=>x.includes('answer')));assert(result.errors.some(x=>x.includes('Missing file')));
});
test('missing optional question metadata is allowed but invalid references fail',()=>{
  const data=fixture();data.explanations['database-systems'][3].fullQuiz[0].slideNum=999;
  assert(validateData(data,()=>true).errors.some(x=>x.includes('slideNum')));
});
test('unconfirmed records cannot be edited invisibly',()=>{
  const data=fixture();data.schedule.tasBySection[6]['computer-graphics-2'].room='changed';
  assert(validateData(data,()=>true).errors.some(x=>x.includes('unconfirmed')));
});
