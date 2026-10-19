const test=require('node:test');
const assert=require('node:assert/strict');
const {portal}=require('./helpers.cjs');

test('Saturday classes for B1/1 are chronological, not course-ordered',()=>{
  const {context}=portal();context.StudentProfile.set('B1',1);
  const day=context.StudentProfile.getWeeklySchedule().find(x=>x.key==='sat');
  assert.deepEqual(Array.from(day.items,x=>x.time),['8:30 - 10:00','12:00 - 1:30','الفترة الرابعة (1:45 - 3:15)']);
});
test('multiple confirmed sessions for one course are retained',()=>{
  const {context}=portal();context.StudentProfile.set('B1',1);
  context.SCHEDULE_CONFIG.tasBySection[1]['computer-architecture']=[
    {ta:'Fixture A',slot:'الاثنين • 8:30 - 10:00',room:'R1'},
    {ta:'Fixture A',slot:'الأربعاء • 1:45 - 3:15',room:'R2'}
  ];
  const items=context.StudentProfile.getWeeklySchedule().flatMap(x=>x.items).filter(x=>x.type==='section'&&x.code==='CS221');
  assert.equal(items.length,2);
  assert.equal(context.StudentProfile.getCourseStaff('computer-architecture').ta,'Fixture A');
});
test('unconfirmed source records are surfaced without assigning them to a different course',()=>{
  const {context}=portal();const entries=context.StudentProfile.getUnconfirmedScheduleEntries(6);
  assert.equal(entries.length,1);assert.equal(entries[0].sourceKey,'computer-graphics-2');
  assert.equal(context.SCHEDULE_CONFIG.tasBySection[6]['computer-graphics-2'].ta,'م. آية عطيه');
});
test('an unavailable section schedule is explicitly marked unavailable',()=>{
  const {context}=portal();context.StudentProfile.set('B2',8);
  const staff=context.StudentProfile.getCourseStaff('operating-system');
  assert.equal(staff.hasSectionSchedule,false);
  assert.equal(staff.sectionSlot,'موعد السكشن غير متوفر');
});
test('all profile schedules return valid days and finite chronological order',()=>{
  const {context}=portal();
  for(const group of Object.values(context.SCHEDULE_CONFIG.groups))for(const section of group.sections){
    context.StudentProfile.set(group.id,section);
    for(const day of context.StudentProfile.getWeeklySchedule()){
      const starts=Array.from(day.items,x=>context.StudentProfile.startMinutes(x.time));
      assert(starts.every(Number.isFinite));assert.deepEqual(starts,[...starts].sort((a,b)=>a-b));
    }
  }
});
