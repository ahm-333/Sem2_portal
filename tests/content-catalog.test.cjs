const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

// Helper to load courses-data
function loadCoursesData() {
  const code = fs.readFileSync(path.join(root, 'js/courses-data.js'), 'utf8');
  const scope = { window: {} };
  vm.runInNewContext(code, scope);
  return scope.window.COURSES_DATA;
}

// Helper to load a1-identity
function loadPresentation(coursesData) {
  const code = fs.readFileSync(path.join(root, 'js/a1-identity.js'), 'utf8');
  const scope = {
    window: { COURSES_DATA: coursesData },
    document: { addEventListener: () => {}, querySelectorAll: () => [] }
  };
  vm.runInNewContext(code, scope);
  return scope.window.PortalPresentation;
}

test('createCatalog exports and methods', () => {
  const {createCatalog} = require('../js/shared/content-catalog.js');
  assert.equal(typeof createCatalog, 'function');
});

test('PortalCatalog.key rejects null/undefined but preserves 0 and escapes punctuation', () => {
  const {createCatalog} = require('../js/shared/content-catalog.js');
  const catalog = createCatalog({courses: [], studyCatalog: {}});

  assert.throws(() => catalog.key(null, 'lecture', 1), /TypeError/);
  assert.throws(() => catalog.key('cs', null, 1), /TypeError/);
  assert.throws(() => catalog.key('cs', 'lecture', null), /TypeError/);
  assert.throws(() => catalog.key('cs', 'lecture', undefined), /TypeError/);

  // Retain 0
  const keyLec0 = catalog.key('data-structure', 'lecture', 0);
  const keySec0 = catalog.key('data-structure', 'section', 0);
  assert.equal(keyLec0, JSON.stringify(['data-structure', 'lecture', '0']));
  assert.equal(keySec0, JSON.stringify(['data-structure', 'section', '0']));
  assert.notEqual(keyLec0, keySec0);

  // String 0 and Number 0 produce identical keys
  assert.equal(catalog.key('data-structure', 'lecture', '0'), keyLec0);

  // Punctuation and quotes cannot collide
  const keyA = catalog.key('course', 'lecture', 'a","b');
  const keyB = catalog.key('course', 'lecture', 'a');
  assert.notEqual(keyA, keyB);
  assert.equal(JSON.parse(keyA)[2], 'a","b');
});

test('All 6 real courses and 7 source families are indexed correctly', () => {
  const {createCatalog} = require('../js/shared/content-catalog.js');
  const courses = loadCoursesData();
  const presentation = loadPresentation(courses);
  const studyCatalog = {
    'database-systems': {
      '2': {totalSlides: 30, hasFullQuiz: true, quizVersion: '0f77d6ceae5a', questionCount: 20, questionIds: [1], optionCounts: [4]}
    }
  };

  const catalog = createCatalog({courses, studyCatalog, presentation});
  const items = catalog.list();
  assert.ok(items.length > 30, `Expected at least 30 items, got ${items.length}`);

  const types = new Set(items.map(item => item.type));
  assert.ok(types.has('lecture'));
  assert.ok(types.has('section'));
  assert.ok(types.has('assignment'));
  assert.ok(types.has('video'));
  assert.ok(types.has('theory-resource'));
  assert.ok(types.has('practical-resource'));
  assert.ok(types.has('explanation-site'));

  // Data Structures lecture 0 and section 0 resolve
  const dsLec0 = catalog.get(catalog.key('data-structure', 'lecture', 0));
  const dsSec0 = catalog.get(catalog.key('data-structure', 'section', 0));
  assert.ok(dsLec0);
  assert.ok(dsSec0);
  assert.equal(dsLec0.id, 0);
  assert.equal(dsSec0.id, 0);
  assert.equal(dsLec0.type, 'lecture');
  assert.equal(dsSec0.type, 'section');

  // get returns null for unknown key
  assert.equal(catalog.get('["unknown","lecture","999"]'), null);
  assert.equal(catalog.get('invalid-json'), null);

  // Check explanation site fixed id 'site'
  const expSite = catalog.get(catalog.key('computer-architecture', 'explanation-site', 'site'));
  assert.ok(expSite);
  assert.equal(expSite.id, 'site');
  assert.equal(expSite.type, 'explanation-site');

  // Exclude licenseKey from indexing
  const emuResource = catalog.get(catalog.key('computer-architecture', 'practical-resource', 1));
  assert.ok(emuResource);
  assert.equal(emuResource.licenseKey, undefined);
  assert.ok(!JSON.stringify(emuResource.description).includes('License Key.txt'));

  // Internal study action present when study metadata exists
  const dbLec2 = catalog.get(catalog.key('database-systems', 'lecture', 2));
  assert.ok(dbLec2);
  assert.ok(dbLec2.study);
  assert.equal(dbLec2.study.hasFullQuiz, true);
  assert.ok(dbLec2.actions.some(a => a.id === 'internal-study'));
});

test('Quiz metadata calculation is deterministic across LF/CRLF and sensitive to changes', () => {
  const {computeQuizVersion, extractStudyCatalog} = require('../tools/content-catalog.cjs');

  const questionsLF = [
    {id: 1, question: 'What is DB?\nExplain.', options: ['A\n1', 'B\n2'], correct: 0},
    {id: 2, question: 'What is SQL?', options: ['X', 'Y'], correct: 1}
  ];
  const questionsCRLF = [
    {id: 1, question: 'What is DB?\r\nExplain.', options: ['A\r\n1', 'B\r\n2'], correct: 0},
    {id: 2, question: 'What is SQL?', options: ['X', 'Y'], correct: 1}
  ];

  const vLF = computeQuizVersion(questionsLF);
  const vCRLF = computeQuizVersion(questionsCRLF);
  assert.equal(vLF, vCRLF);
  assert.equal(typeof vLF, 'string');
  assert.equal(vLF.length, 12);

  // Changing question text changes version
  const questionsChanged = [
    {id: 1, question: 'What is DB?\nExplain MORE.', options: ['A\n1', 'B\n2'], correct: 0},
    {id: 2, question: 'What is SQL?', options: ['X', 'Y'], correct: 1}
  ];
  assert.notEqual(computeQuizVersion(questionsChanged), vLF);

  // Changing correct choice changes version
  const questionsChangedCorrect = [
    {id: 1, question: 'What is DB?\nExplain.', options: ['A\n1', 'B\n2'], correct: 1},
    {id: 2, question: 'What is SQL?', options: ['X', 'Y'], correct: 1}
  ];
  assert.notEqual(computeQuizVersion(questionsChangedCorrect), vLF);

  // extractStudyCatalog produces correct schema
  const extracted = extractStudyCatalog({
    'course-1': {
      '1': {totalSlides: 10, fullQuiz: questionsLF}
    }
  });
  assert.deepEqual(extracted['course-1']['1'], {
    totalSlides: 10,
    hasFullQuiz: true,
    quizVersion: vLF,
    questionCount: 2,
    questionIds: [1, 2],
    optionCounts: [2, 2]
  });
});
