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
  p.load('js/shared/content-search.js');
  return p;
}

test('content-search: module exports and factory function', () => {
  const { context } = setup();
  assert.ok(context.PortalContentSearch, 'window.PortalContentSearch singleton should exist');
  assert.equal(typeof context.PortalContentSearch.normalize, 'function');
  assert.equal(typeof context.PortalContentSearch.isProgressEligible, 'function');
  assert.equal(typeof context.PortalContentSearch.getItemStatus, 'function');
  assert.equal(typeof context.PortalContentSearch.computeRank, 'function');
  assert.equal(typeof context.PortalContentSearch.search, 'function');
});

test('content-search: Arabic normalization handles alef, diacritics, tatweel, and letter variants', () => {
  const { context } = setup();
  const norm = context.PortalContentSearch.normalize;

  // Alef variants
  assert.equal(norm('أحمد'), 'احمد');
  assert.equal(norm('إبراهيم'), 'ابراهيم');
  assert.equal(norm('آلة'), 'اله');
  assert.equal(norm('ٱستماع'), 'استماع');

  // Tashkeel / diacritics stripping
  assert.equal(norm('أَنْظِمَةُ التَّشْغِيلِ'), 'انظمه التشغيل');
  assert.equal(norm('مُحَاضَرَةٌ'), 'محاضره');
  assert.equal(norm('قَاعِدَةُ بَيَانَاتٍ'), 'قاعده بيانات');

  // Tatweel (kashida) stripping
  assert.equal(norm('قــــاعـــدة'), 'قاعده');
  assert.equal(norm('تــــطــــبـــيـــق'), 'تطبيق');

  // Alef maqsura to yaa and taa marbuta to haa
  assert.equal(norm('مستشفى'), 'مستشفي');
  assert.equal(norm('الكترونية'), 'الكترونيه');

  // Case normalization & trim
  assert.equal(norm('  Data Structure  '), 'data structure');
  assert.equal(norm('CS211'), 'cs211');

  // Null and undefined safety
  assert.equal(norm(null), '');
  assert.equal(norm(undefined), '');
});

test('content-search: progress eligibility correctly identifies lectures and sections', () => {
  const { context } = setup();
  const search = context.PortalContentSearch;
  const catalog = context.PortalCatalog;

  const lectureEntry = catalog.get('["database-systems","lecture","2"]');
  assert.ok(lectureEntry);
  assert.equal(search.isProgressEligible(lectureEntry), true);

  const sectionEntry = catalog.get('["database-systems","section","1"]');
  assert.ok(sectionEntry);
  assert.equal(search.isProgressEligible(sectionEntry), true);

  // ID 0 item
  const id0Entry = catalog.get('["data-structure","lecture","0"]');
  assert.ok(id0Entry);
  assert.equal(search.isProgressEligible(id0Entry), true);

  // Videos, resources, assignments are not eligible progress items
  const videoEntries = catalog.list().filter(e => e.kind === 'videos');
  if (videoEntries.length > 0) {
    assert.equal(search.isProgressEligible(videoEntries[0]), false);
  }

  const resourceEntries = catalog.list().filter(e => e.kind === 'resources');
  if (resourceEntries.length > 0) {
    assert.equal(search.isProgressEligible(resourceEntries[0]), false);
  }

  const assignmentEntries = catalog.list().filter(e => e.kind === 'assignments');
  if (assignmentEntries.length > 0) {
    assert.equal(search.isProgressEligible(assignmentEntries[0]), false);
  }
});

test('content-search: ranking tiers prioritize exact code/title over prefix and descriptions', () => {
  const { context } = setup();
  const search = context.PortalContentSearch;

  // Search for exact course code "IS211"
  const is211Results = search.search({ query: 'IS211' });
  assert.ok(is211Results.length > 0);
  assert.equal(is211Results[0].code, 'IS211');

  // Exact title match ranks higher than general description match
  const dbLec2 = context.PortalCatalog.get('["database-systems","lecture","2"]');
  assert.ok(dbLec2);
  const titleResults = search.search({ query: dbLec2.title });
  assert.ok(titleResults.length > 0);
  assert.equal(titleResults[0].key, dbLec2.key, 'Exact title match must be ranked first');

  // Prefix query
  const prefixResults = search.search({ query: 'قواعد' });
  assert.ok(prefixResults.length > 0);
  assert.equal(prefixResults[0].courseId, 'database-systems');

  // Query tokens in title should rank higher than only in description
  const results = search.search({ query: 'stack' });
  assert.ok(results.length > 0);
  const firstTitle = context.PortalContentSearch.normalize(results[0].title);
  assert.ok(firstTitle.includes('stack'));
});

test('content-search: ranking tiers test - exact code/title (Tier 1) vs prefix (Tier 2) vs phrase (Tier 3) vs topics/description (Tier 5/6)', () => {
  const { context } = setup();

  const mockCatalog = {
    list() {
      return [
        {
          key: '["test","lecture","desc-only"]',
          code: 'TEST101',
          title: 'Unrelated Lecture',
          arabicTitle: null,
          displayCourseName: 'Testing',
          courseName: 'Testing Course',
          description: 'This is an exact-keyword inside the description',
          topics: ['general'],
          actions: [{ id: 'drive' }],
          kind: 'lectures',
          type: 'lecture'
        },
        {
          key: '["test","lecture","exact-title"]',
          code: 'TEST102',
          title: 'exact-keyword',
          arabicTitle: null,
          displayCourseName: 'Testing',
          courseName: 'Testing Course',
          description: 'Other description',
          topics: ['general'],
          actions: [{ id: 'drive' }],
          kind: 'lectures',
          type: 'lecture'
        },
        {
          key: '["test","lecture","prefix-title"]',
          code: 'TEST103',
          title: 'exact-keyword and more',
          arabicTitle: null,
          displayCourseName: 'Testing',
          courseName: 'Testing Course',
          description: 'Other description',
          topics: ['general'],
          actions: [{ id: 'drive' }],
          kind: 'lectures',
          type: 'lecture'
        },
        {
          key: '["test","lecture","topic-match"]',
          code: 'TEST104',
          title: 'Another Subject',
          arabicTitle: null,
          displayCourseName: 'Testing',
          courseName: 'Testing Course',
          description: 'Other description',
          topics: ['exact-keyword'],
          actions: [{ id: 'drive' }],
          kind: 'lectures',
          type: 'lecture'
        }
      ];
    }
  };

  const customSearch = context.PortalContentSearch.createContentSearch({ catalog: mockCatalog });
  const results = customSearch.search({ query: 'exact-keyword' });

  assert.equal(results.length, 4);
  assert.equal(results[0].key, '["test","lecture","exact-title"]', 'Tier 1 (exact title) must be first');
  assert.equal(results[1].key, '["test","lecture","prefix-title"]', 'Tier 2 (prefix title) must be second');
  assert.equal(results[2].key, '["test","lecture","topic-match"]', 'Tier 5 (topic match) must be third');
  assert.equal(results[3].key, '["test","lecture","desc-only"]', 'Tier 6 (description match) must be fourth');
});

test('content-search: deterministic tie-breaking maintains catalog order for equal ranks', () => {
  const { context } = setup();
  const search = context.PortalContentSearch;

  // Empty query with allTas: true returns all available items in catalog order
  const emptyResults = search.search({ query: '', allTas: true });
  const allCatalog = context.PortalCatalog.list().filter(e => e.actions.length > 0);
  assert.equal(emptyResults[0].key, allCatalog[0].key);
  assert.equal(emptyResults.length, allCatalog.length);

  // Run same query multiple times, order must be identical
  const run1 = search.search({ query: 'data' }).map(e => e.key);
  const run2 = search.search({ query: 'data' }).map(e => e.key);
  assert.deepEqual(run1, run2);
});

test('content-search: completion-status filtering returns only matching eligible items', () => {
  const { context } = setup();
  const search = context.PortalContentSearch;
  const state = context.PortalStudyState;
  const progress = context.PortalStudyProgress;

  const lecKey = '["database-systems","lecture","4"]';
  // Initially not-started
  const notStartedResults = search.search({ courseId: 'database-systems', status: 'not-started' });
  assert.ok(notStartedResults.some(e => e.key === lecKey));

  // Eligible items only: no videos, assignments, or resources in status filter
  assert.ok(notStartedResults.every(e => e.type === 'lecture' || e.type === 'section'));

  // Now mark lecture 4 as completed
  progress.setManualComplete(lecKey, true);

  const completedResults = search.search({ courseId: 'database-systems', status: 'completed' });
  assert.ok(completedResults.some(e => e.key === lecKey));

  // It should no longer be in not-started
  const notStartedAfter = search.search({ courseId: 'database-systems', status: 'not-started' });
  assert.ok(!notStartedAfter.some(e => e.key === lecKey));

  // In-progress test
  const lec2Key = '["database-systems","lecture","2"]';
  state.updateItem(lec2Key, { startedAt: new Date().toISOString() });
  const inProgressResults = search.search({ courseId: 'database-systems', status: 'in-progress' });
  assert.ok(inProgressResults.some(e => e.key === lec2Key));
});

test('content-search: non-progress types never receive fabricated completion', () => {
  const { context } = setup();
  const search = context.PortalContentSearch;

  // Search with status: 'completed' should never contain resources, videos, or assignments
  const completedAll = search.search({ status: 'completed' });
  for (const item of completedAll) {
    assert.ok(item.type === 'lecture' || item.type === 'section', `Item ${item.key} with type ${item.type} must not be in completed results`);
  }

  // Same for 'in-progress' and 'not-started'
  const inProgressAll = search.search({ status: 'in-progress' });
  for (const item of inProgressAll) {
    assert.ok(item.type === 'lecture' || item.type === 'section');
  }

  const notStartedAll = search.search({ status: 'not-started' });
  for (const item of notStartedAll) {
    assert.ok(item.type === 'lecture' || item.type === 'section');
  }
});

test('content-search: combination of course, kind, status, and TA filters works accurately', () => {
  const { context } = setup();
  const search = context.PortalContentSearch;

  // Filter by course + sections + allTas
  const ownSections = search.search({ courseId: 'database-systems', kind: 'sections', allTas: false });
  const allSections = search.search({ courseId: 'database-systems', kind: 'sections', allTas: true });
  assert.ok(allSections.length >= ownSections.length);

  // Filter by interactive kind
  const interactive = search.search({ kind: 'interactive' });
  assert.equal(interactive.length, 25, 'Interactive kind should find 25 local lessons');
  assert.ok(interactive.every(e => Boolean(e.study || e.module)));
});
