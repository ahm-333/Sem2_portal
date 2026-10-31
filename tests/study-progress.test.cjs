const test = require('node:test');
const assert = require('node:assert/strict');
const { portal } = require('./helpers.cjs');

function setup(options = {}) {
  const p = portal(options);
  p.context.localStorage.key = i => Array.from(p.saved.keys())[i] || null;
  Object.defineProperty(p.context.localStorage, 'length', {
    get() { return p.saved.size; },
    configurable: true
  });
  p.load('js/study-catalog.js');
  p.load('js/study-modules.js');
  p.load('js/shared/content-catalog.js');
  p.load('js/shared/study-state.js');
  p.load('js/shared/study-progress.js');
  return p;
}

test('study-progress: module exports and factory function', () => {
  const { context } = setup();
  assert.ok(context.PortalStudyProgress, 'window.PortalStudyProgress singleton should exist');
  assert.equal(typeof context.PortalStudyProgress.getStatus, 'function');
  assert.equal(typeof context.PortalStudyProgress.getCourseSummary, 'function');
  assert.equal(typeof context.PortalStudyProgress.setManualComplete, 'function');
  assert.equal(typeof context.PortalStudyProgress.getItemProgress, 'function');
});

test('study-progress: getStatus distinguishes not-started, in-progress, and completed', () => {
  const { context } = setup();
  const progress = context.PortalStudyProgress;
  const state = context.PortalStudyState;
  // DB Lecture 4 has no full quiz; DB Lecture 2 has a full quiz
  const noQuizKey = '["database-systems","lecture","4"]';
  const fullQuizKey = '["database-systems","lecture","2"]';

  // 1. Initially not-started
  assert.equal(progress.getStatus(noQuizKey), 'not-started');
  assert.equal(progress.getStatus(fullQuizKey), 'not-started');

  // 2. Opening / starting transitions to in-progress
  state.updateItem(noQuizKey, { startedAt: new Date().toISOString() });
  assert.equal(progress.getStatus(noQuizKey), 'in-progress');

  // 3. For item without full quiz, manualComplete marks it completed
  const resManual = progress.setManualComplete(noQuizKey, true);
  assert.equal(resManual.saved, true);
  assert.equal(progress.getStatus(noQuizKey), 'completed');

  // 4. Manual undo reverts to in-progress (since startedAt exists)
  progress.setManualComplete(noQuizKey, false);
  assert.equal(progress.getStatus(noQuizKey), 'in-progress');

  // 5. For item WITH full quiz, setManualComplete is rejected
  const resBlocked = progress.setManualComplete(fullQuizKey, true);
  assert.equal(resBlocked.saved, false);
  assert.equal(resBlocked.reason, 'has_full_quiz');
  assert.notEqual(progress.getStatus(fullQuizKey), 'completed');

  // 6. Full quiz: completing all questions marks it completed
  const entry = context.PortalCatalog.get(fullQuizKey);
  assert.ok(entry?.study?.hasFullQuiz);
  const quizVer = entry.study.quizVersion;

  state.updateItem(fullQuizKey, {
    startedAt: new Date().toISOString(),
    quiz: {
      version: quizVer,
      answers: { '1': 0, '2': 1 },
      completedVersions: [quizVer],
      lastCompleted: { version: quizVer, score: 0, total: 20, completedAt: new Date().toISOString() }
    }
  });
  assert.equal(progress.getStatus(fullQuizKey), 'completed');

  // 7. Same-version reset retains earned completion
  state.updateItem(fullQuizKey, {
    quiz: {
      version: quizVer,
      answers: {},
      completedVersions: [quizVer],
      lastCompleted: { version: quizVer, score: 0, total: 20, completedAt: new Date().toISOString() }
    }
  });
  assert.equal(progress.getStatus(fullQuizKey), 'completed');

  // 8. Changed quiz version does NOT inherit completion
  state.updateItem(fullQuizKey, {
    quiz: {
      version: 'changed_v2_99',
      answers: {},
      completedVersions: ['older_hash_123'], // older version not matching current catalog
      lastCompleted: { version: 'older_hash_123', score: 20, total: 20, completedAt: new Date().toISOString() }
    }
  });
  assert.equal(progress.getStatus(fullQuizKey), 'in-progress');
});

test('study-progress: count canonical published lecture/section keys once; exclude videos, resources, OS units', () => {
  const { context } = setup();
  const progress = context.PortalStudyProgress;

  // OS course has 3 lectures, 3 sections (for B1/1 TA), and 19 theory-resource units in study-modules
  const osSummary = progress.getCourseSummary('operating-system', { group: 'B1', section: 1 });
  assert.equal(osSummary.courseId, 'operating-system');
  assert.equal(osSummary.lectures.total, 3, 'OS must count exactly 3 published lectures, not theory resources');
  assert.equal(osSummary.sections.total, 3, 'OS must count exactly 3 published sections for B1/1');
  assert.equal(osSummary.total.total, 6, 'Total must be exactly lectures + sections');
  assert.ok(osSummary.scope.includes('المحتوى المنشور'), 'Summary must declare scope in Arabic');

  // Report Writing has 5 lectures and 0 sections
  const rwSummary = progress.getCourseSummary('report-writing', { group: 'B1', section: 1 });
  assert.equal(rwSummary.lectures.total, 5);
  assert.equal(rwSummary.sections.total, 0);
  assert.equal(rwSummary.total.total, 5);
  assert.equal(rwSummary.sections.completed, 0);
  assert.equal(rwSummary.sections.remaining, 0);
});

test('study-progress: handles ID 0, duplicate links, and ignores orphan records in totals', () => {
  const { context } = setup();
  const progress = context.PortalStudyProgress;
  const state = context.PortalStudyState;

  // Seed storage with orphan records (deleted item, alien course, non-lecture types)
  state.updateItem('["database-systems","lecture","999"]', { manualComplete: true });
  state.updateItem('["non-existent-course","lecture","1"]', { manualComplete: true });
  state.updateItem('["database-systems","video","1"]', { manualComplete: true });
  state.updateItem('["database-systems","assignment","1"]', { manualComplete: true });

  const summary = progress.getCourseSummary('database-systems', { group: 'B1', section: 1 });
  // Database systems has 4 published lectures in courses-data: [2, 3, 4, 5]
  assert.equal(summary.lectures.total, 4);
  assert.equal(summary.lectures.completed, 0, 'Orphan records must not inflate completed counts');
  assert.equal(summary.lectures.remaining, 4);
  assert.equal(summary.percent, 0);

  // Complete one real lecture without full quiz (Lecture 4)
  progress.setManualComplete('["database-systems","lecture","4"]', true);
  const updated = progress.getCourseSummary('database-systems', { group: 'B1', section: 1 });
  assert.equal(updated.lectures.completed, 1);
  assert.equal(updated.lectures.remaining, 3);

  // Data structure has Lecture 0: ID 0 must be counted and handled correctly
  const dsInitial = progress.getCourseSummary('data-structure', { group: 'B1', section: 1 });
  assert.equal(dsInitial.lectures.total, 6);
  assert.equal(dsInitial.lectures.completed, 0);

  const ds0Key = '["data-structure","lecture","0"]';
  progress.setManualComplete(ds0Key, true);
  const dsUpdated = progress.getCourseSummary('data-structure', { group: 'B1', section: 1 });
  assert.equal(dsUpdated.lectures.completed, 1);
  assert.equal(progress.getStatus(ds0Key), 'completed');
});

test('study-progress: explicit profile TA filtering does not save or mutate student profile', () => {
  const { context } = setup();
  const progress = context.PortalStudyProgress;
  const sp = context.StudentProfile;

  // Set current saved profile to B1/1
  sp.set('B1', 1);
  const initialSaved = sp.get();
  assert.equal(initialSaved.group, 'B1');
  assert.equal(initialSaved.section, 1);

  // Query summaries for all 12 sections across 3 groups without saving
  for (let s = 1; s <= 12; s++) {
    const group = s <= 4 ? 'B1' : s <= 8 ? 'B2' : 'B3';
    const sum = progress.getCourseSummary('computer-architecture', { group, section: s });
    assert.equal(sum.lectures.total, 5);
    // Depending on TA assignment: Amal (3), Toqa (4), Shahida (3)
    assert.ok(sum.sections.total === 3 || sum.sections.total === 4);
  }

  // Confirm saved profile in storage is STILL B1/1 untouched!
  const finalSaved = sp.get();
  assert.equal(finalSaved.group, 'B1');
  assert.equal(finalSaved.section, 1);
});

test('study-progress: switching profiles never clears or loses prior progress', () => {
  const { context } = setup();
  const progress = context.PortalStudyProgress;
  const sp = context.StudentProfile;

  // Student in section 1 completes a lecture and a section
  sp.set('B1', 1);
  const sec1Key = '["computer-architecture","section","1"]';
  const lec1Key = '["computer-architecture","lecture","1"]';

  progress.setManualComplete(lec1Key, true);
  progress.setManualComplete(sec1Key, true);

  const sum1 = progress.getCourseSummary('computer-architecture');
  assert.equal(sum1.lectures.completed, 1);
  assert.equal(sum1.sections.completed, 1);

  // Switch to B2/6
  sp.set('B2', 6);
  // Prior lecture progress is preserved!
  const sum2 = progress.getCourseSummary('computer-architecture');
  assert.equal(sum2.lectures.completed, 1);

  // Switch back to B1/1
  sp.set('B1', 1);
  const sum3 = progress.getCourseSummary('computer-architecture');
  assert.equal(sum3.lectures.completed, 1);
  assert.equal(sum3.sections.completed, 1);
});

test('study-progress: per-section native check signals remain independent and do not mark lecture completed', () => {
  const { context } = setup();
  const progress = context.PortalStudyProgress;
  const dsLec2Key = '["data-structure","lecture","2"]';

  // Even if native check was stored in sem2_standalone_check_v1
  context.localStorage.setItem(
    'sem2_standalone_check_v1:' + encodeURIComponent(dsLec2Key) + ':check-1',
    JSON.stringify({ version: 1, checked: true })
  );

  // Lecture 2 status is still not-started (native check does not satisfy lecture completion)
  assert.equal(progress.getStatus(dsLec2Key), 'not-started');
});
