const pendingSource = require('./pending-schedule.json');

function validateData({courses, schedule, explanations}, existsFile) {
  const errors = [], pending = [];
  const ids = new Set();
  function fail(message) { errors.push(message); }
  function unique(list, key, label) {
    const seen = new Set();
    for (const item of list) {
      if (item[key] === undefined) continue;
      if (seen.has(item[key])) fail(`Duplicate ${label}: ${item[key]}`);
      seen.add(item[key]);
    }
  }
  function walk(value) {
    if (typeof value === 'string') {
      if (value.startsWith('materials/') && !existsFile(value)) fail('Missing file: ' + value);
      if (/^(javascript|data|vbscript):/i.test(value.trim())) fail('Unsafe URL: ' + value);
    } else if (value && typeof value === 'object') Object.values(value).forEach(walk);
  }
  function question(q, label) {
    if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || !Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length) fail(`Invalid answer or question: ${label}`);
  }
  for (const course of courses) {
    if (ids.has(course.id)) fail('Duplicate course: ' + course.id);
    ids.add(course.id);
    for (const key of ['id','code','name','arabicName','category','shortDesc']) if (typeof course[key] !== 'string' || !course[key]) fail(`Missing ${course.id}.${key}`);
    if (!course.explanationSite || typeof course.explanationSite.url !== 'string') fail('Missing explanationSite: ' + course.id);
    for (const field of ['lectures','sections','assignments','resources','practicalResources','videoExplanations']) {
      if (course[field] && !Array.isArray(course[field])) fail(`Expected array: ${course.id}.${field}`);
      else unique(course[field] || [],'id',`${course.id}.${field}`);
    }
  }
  for (const [section, records] of Object.entries(schedule.tasBySection)) {
    for (const [sourceKey, value] of Object.entries(records)) {
      if (ids.has(sourceKey)) continue;
      const source = pendingSource.find(item => item.section === Number(section) && item.sourceKey === sourceKey);
      if (!source) fail(`Unknown timetable key: ${section}.${sourceKey}`);
      else if (JSON.stringify(value) !== JSON.stringify({ta:source.ta,slot:source.slot,room:source.room})) fail(`Changed unconfirmed timetable record: ${section}.${sourceKey}`);
      else pending.push(source);
    }
  }
  for (const [courseId, lectures] of Object.entries(explanations)) {
    const course = courses.find(item => item.id === courseId);
    if (!course) { fail('Unknown explanation course: ' + courseId); continue; }
    for (const [lectureId, lecture] of Object.entries(lectures)) {
      if (!(course.lectures || []).some(item => String(item.id) === lectureId)) fail('Unknown explanation lecture: ' + lectureId);
      if (lecture.totalSlides !== lecture.slides.length) fail('Incorrect slide count: ' + lectureId);
      unique(lecture.slides,'num',`${courseId}.${lectureId}.slides`);
      const nums = new Set(lecture.slides.map(slide => slide.num));
      for (const slide of lecture.slides) if (slide.quiz) question(slide.quiz, `${lectureId}.slide${slide.num}`);
      unique(lecture.fullQuiz || [],'id',`${courseId}.${lectureId}.questions`);
      for (const q of lecture.fullQuiz || []) {
        question(q,`${lectureId}.question${q.id}`);
        if (q.slideNum !== undefined && !nums.has(q.slideNum)) fail(`Invalid slideNum: ${lectureId}.question${q.id}`);
      }
    }
  }
  walk({courses,explanations});
  return {errors,pending};
}
module.exports = {validateData};
