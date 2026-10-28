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
test('authoritative university schedule confirms sections 6, 7, 8, 10, 11 and leaves zero unconfirmed entries',()=>{
  const {context}=portal();
  for(let s=1; s<=12; s++){
    assert.equal(context.StudentProfile.getUnconfirmedScheduleEntries(s).length, 0, `Section ${s} has unconfirmed entries`);
  }
  const sec6Graphics=context.SCHEDULE_CONFIG.tasBySection[6]['computer-graphics'];
  assert.equal(sec6Graphics.ta, 'م. آية عطيه');
  assert.equal(sec6Graphics.slot, 'الأربعاء • 10:15 - 11:45');
  assert.equal(sec6Graphics.room, 'م15');

  const sec7Graphics=context.SCHEDULE_CONFIG.tasBySection[7]['computer-graphics'];
  assert.equal(sec7Graphics.ta, 'م. رحمه أحمد');
  assert.equal(sec7Graphics.slot, 'الأحد • 3:30 - 5:00');
  assert.equal(sec7Graphics.room, 'معمل الذكاء الاصطناعي');

  const sec7OS=context.SCHEDULE_CONFIG.tasBySection[7]['operating-system'];
  assert.equal(sec7OS.ta, 'م.م. عبد الرحمن فتحي عبد الرحمن صومع');
  assert.equal(sec7OS.slot, 'الخميس • 8:30 - 10:00');
  assert.equal(sec7OS.room, 'م20');

  const sec8OS=context.SCHEDULE_CONFIG.tasBySection[8]['operating-system'];
  assert.equal(sec8OS.ta, 'م.م. عبد الرحمن فتحي عبد الرحمن صومع');
  assert.equal(sec8OS.slot, 'الأحد • 3:30 - 5:00');
  assert.equal(sec8OS.room, 'م15');

  const sec10OS=context.SCHEDULE_CONFIG.tasBySection[10]['operating-system'];
  assert.equal(sec10OS.ta, 'م.م. عبد الرحمن فتحي عبد الرحمن صومع');
  assert.equal(sec10OS.slot, 'الأربعاء • 1:45 - 3:15');
  assert.equal(sec10OS.room, 'م18');

  const sec11OS=context.SCHEDULE_CONFIG.tasBySection[11]['operating-system'];
  assert.equal(sec11OS.ta, 'م. أحمد شكري');
  assert.equal(sec11OS.slot, 'السبت • 3:30 - 5:00');
  assert.equal(sec11OS.room, 'م15');
});
test('synthetic unconfirmed records are surfaced without assigning them to a different course',()=>{
  const {context}=portal();
  context.SCHEDULE_CONFIG.tasBySection[6]['computer-graphics-2'] = {ta: 'Fixture', slot: 'الأحد • 3:30', room: 'R'};
  const entries=context.StudentProfile.getUnconfirmedScheduleEntries(6);
  assert.equal(entries.length,1);assert.equal(entries[0].sourceKey,'computer-graphics-2');
});
test('an unavailable section schedule is explicitly marked unavailable',()=>{
  const {context}=portal();context.StudentProfile.set('B1',1);
  const staff=context.StudentProfile.getCourseStaff('report-writing');
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
