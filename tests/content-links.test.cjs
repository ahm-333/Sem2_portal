const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function loadCatalog() {
  const codeCatalog = fs.readFileSync(path.join(root, 'js/shared/content-catalog.js'), 'utf8');
  const codeCourses = fs.readFileSync(path.join(root, 'js/courses-data.js'), 'utf8');
  const codeA1 = fs.readFileSync(path.join(root, 'js/a1-identity.js'), 'utf8');

  const scope = {
    window: {},
    document: { addEventListener: () => {}, querySelectorAll: () => [] },
    URL,
    URLSearchParams
  };
  vm.runInNewContext(codeCourses, scope);
  vm.runInNewContext(codeA1, scope);
  vm.runInNewContext(codeCatalog, scope);

  const {createCatalog} = require('../js/shared/content-catalog.js');
  return createCatalog({
    courses: scope.window.COURSES_DATA,
    studyCatalog: {},
    presentation: scope.window.PortalPresentation
  });
}

test('PortalContentLinks module exports and methods', () => {
  const {PortalContentLinks} = require('../js/shared/content-links.js');
  assert.equal(typeof PortalContentLinks.href, 'function');
  assert.equal(typeof PortalContentLinks.parse, 'function');
});

test('PortalContentLinks.href builds canonical same-site URLs preserving id/track/kind', () => {
  const catalog = loadCatalog();
  const {createContentLinks} = require('../js/shared/content-links.js');
  const links = createContentLinks({catalog});

  // Data Structures lecture 0
  const dsLec0Key = catalog.key('data-structure', 'lecture', 0);
  const hrefLec0 = links.href(dsLec0Key);
  const urlLec0 = new URL(hrefLec0, 'http://localhost/Sem2_portal/');
  assert.equal(urlLec0.pathname.endsWith('subject.html'), true);
  assert.equal(urlLec0.searchParams.get('id'), 'data-structure');
  assert.equal(urlLec0.searchParams.get('track'), 'lecture');
  assert.equal(urlLec0.searchParams.get('kind'), 'lectures');
  assert.equal(urlLec0.searchParams.get('item'), dsLec0Key);

  // Data Structures section 0
  const dsSec0Key = catalog.key('data-structure', 'section', 0);
  const hrefSec0 = links.href(dsSec0Key);
  const urlSec0 = new URL(hrefSec0, 'http://localhost/Sem2_portal/');
  assert.equal(urlSec0.searchParams.get('id'), 'data-structure');
  assert.equal(urlSec0.searchParams.get('track'), 'section');
  assert.equal(urlSec0.searchParams.get('kind'), 'sections');
  assert.equal(urlSec0.searchParams.get('item'), dsSec0Key);

  // With optional action, slide, tab
  const hrefWithOpt = links.href(dsLec0Key, {
    actionId: 'internal-study',
    slide: 5,
    tab: 'quiz'
  });
  const urlOpt = new URL(hrefWithOpt, 'http://localhost/Sem2_portal/');
  assert.equal(urlOpt.searchParams.get('action'), 'internal-study');
  assert.equal(urlOpt.searchParams.get('slide'), '5');
  assert.equal(urlOpt.searchParams.get('tab'), 'quiz');

  // Invalid tab values are rejected safely
  const hrefBadTab = links.href(dsLec0Key, { tab: 'malicious-tab' });
  const urlBadTab = new URL(hrefBadTab, 'http://localhost/Sem2_portal/');
  assert.equal(urlBadTab.searchParams.get('tab'), null);
});

test('PortalContentLinks.parse extracts and validates query fields safely', () => {
  const catalog = loadCatalog();
  const {createContentLinks} = require('../js/shared/content-links.js');
  const links = createContentLinks({catalog});

  const dsLec0Key = catalog.key('data-structure', 'lecture', 0);
  const rawUrl = `http://localhost/Sem2_portal/subject.html?id=data-structure&track=lecture&kind=lectures&item=${encodeURIComponent(dsLec0Key)}&action=internal-study&slide=3&tab=explanation`;

  const parsed = links.parse(rawUrl);
  assert.equal(parsed.isValid, true);
  assert.equal(parsed.courseId, 'data-structure');
  assert.equal(parsed.track, 'lecture');
  assert.equal(parsed.kind, 'lectures');
  assert.equal(parsed.item, dsLec0Key);
  assert.equal(parsed.actionId, 'internal-study');
  assert.equal(parsed.slide, 3);
  assert.equal(parsed.tab, 'explanation');

  // Malformed or unknown item fails safely
  const malformed = links.parse('http://localhost/Sem2_portal/subject.html?id=data-structure&item=%5B%22bad%22');
  assert.equal(malformed.isValid, false);
  assert.equal(malformed.item, null);

  for (const item of ['["data-structure","lecture","999"]', '["data-structure","lecture",{}]', '["data-structure","lecture",0]']) {
    assert.equal(links.parse(`http://localhost/subject.html?id=data-structure&item=${encodeURIComponent(item)}`).isValid, false);
  }
  assert.equal(links.parse(`http://localhost/subject.html?id=computer-architecture&item=${encodeURIComponent(dsLec0Key)}`).isValid, false);
  assert.equal(links.parse(rawUrl.replace('slide=3', 'slide=3junk')).slide, null);

  // Negative or NaN slide fails safely
  const badSlide = links.parse(`http://localhost/Sem2_portal/subject.html?id=data-structure&item=${encodeURIComponent(dsLec0Key)}&slide=-4`);
  assert.equal(badSlide.slide, null);
});

test('Database Systems lesson modules and standalone-study links route to unified lesson.html workspace', () => {
  const modules = require('../js/study-modules.js');
  const db2Mod = modules.find(m => m.key === JSON.stringify(['database-systems', 'lecture', '2']));
  const db3Mod = modules.find(m => m.key === JSON.stringify(['database-systems', 'lecture', '3']));

  assert.equal(db2Mod?.url, 'study/db/lesson.html?lecture=2');
  assert.deepEqual(db2Mod?.aliases, ['study/db/chapter-1.html']);
  assert.equal(db3Mod?.url, 'study/db/lesson.html?lecture=3');
  assert.deepEqual(db3Mod?.aliases, ['study/db/chapter-2.html']);

  const codeCatalog = fs.readFileSync(path.join(root, 'js/shared/content-catalog.js'), 'utf8');
  const codeCourses = fs.readFileSync(path.join(root, 'js/courses-data.js'), 'utf8');
  const codeA1 = fs.readFileSync(path.join(root, 'js/a1-identity.js'), 'utf8');
  const codeModules = fs.readFileSync(path.join(root, 'js/study-modules.js'), 'utf8');
  const codeLocation = fs.readFileSync(path.join(root, 'js/shared/lesson-location.js'), 'utf8');
  const scope = {
    window: {},
    document: { addEventListener: () => {}, querySelectorAll: () => [] },
    URL,
    URLSearchParams
  };
  vm.runInNewContext(codeCourses, scope);
  vm.runInNewContext(codeA1, scope);
  vm.runInNewContext(codeModules, scope);
  vm.runInNewContext(codeCatalog, scope);
  vm.runInNewContext(codeLocation, scope);

  const { createCatalog } = require('../js/shared/content-catalog.js');
  const { createContentLinks } = require('../js/shared/content-links.js');
  const catalogWithModules = createCatalog({
    courses: scope.window.COURSES_DATA,
    studyCatalog: {},
    modules: scope.window.PortalStudyModules,
    presentation: scope.window.PortalPresentation
  });
  const linksWithModules = createContentLinks({ catalog: catalogWithModules, location: scope.window.PortalLessonLocation });
  const fallbackLinks = createContentLinks({ catalog: loadCatalog() });

  const db2Key = catalogWithModules.key('database-systems', 'lecture', 2);
  const db3Key = catalogWithModules.key('database-systems', 'lecture', 3);

  for (const links of [linksWithModules, fallbackLinks]) {
    assert.equal(links.href(db2Key, { actionId: 'standalone-study' }), 'study/db/lesson.html?lecture=2');
    assert.equal(links.href(db3Key, { actionId: 'standalone-study' }), 'study/db/lesson.html?lecture=3');
    assert.equal(
      links.href(db2Key, { actionId: 'standalone-study', anchor: 'block-3' }),
      'study/db/lesson.html?lecture=2#topic-block-3'
    );
    assert.equal(
      links.href(db2Key, { actionId: 'standalone-study', anchor: 'topic-block-3', slide: 3, tab: 'explanation' }),
      'study/db/lesson.html?lecture=2#topic-block-3'
    );
    assert.equal(
      links.href(db2Key, { actionId: 'standalone-study', anchor: 'practice', tab: 'quiz' }),
      'study/db/lesson.html?lecture=2&view=practice'
    );
    assert.equal(
      links.href(db2Key, { actionId: 'standalone-study', slide: 5, tab: 'quiz' }),
      'study/db/lesson.html?lecture=2&view=practice'
    );
    assert.equal(
      links.href(db2Key, { actionId: 'standalone-study', slide: 4, tab: 'original', anchor: 'slide-4' }),
      'study/db/lesson.html?lecture=2&slide=4&tab=original'
    );
    assert.equal(
      links.href(db2Key, { actionId: 'standalone-study', slide: 5, tab: 'explanation', anchor: 'slide-5' }),
      'study/db/lesson.html?lecture=2&slide=5'
    );
    assert.equal(
      links.href(db2Key, { actionId: 'standalone-study', slide: 5, tab: 'explanation' }),
      'study/db/lesson.html?lecture=2&slide=5'
    );
  }

  // Fallback anchor normalization without PortalLessonLocation matches canonical slide/topic aliases
  assert.equal(
    fallbackLinks.href(db2Key, { actionId: 'standalone-study', anchor: 'slide-card-5' }),
    'study/db/lesson.html?lecture=2&slide=5'
  );
  assert.equal(
    fallbackLinks.href(db2Key, { actionId: 'standalone-study', anchor: 'topic-1' }),
    'study/db/lesson.html?lecture=2#topic-block-1'
  );
  assert.equal(
    linksWithModules.href(db2Key, { actionId: 'standalone-study', section: 4, tab: 'explanation' }),
    'study/db/lesson.html?lecture=2#topic-block-3'
  );
  assert.equal(
    linksWithModules.href(db2Key, { actionId: 'standalone-study', section: 9, tab: 'explanation' }),
    'study/db/lesson.html?lecture=2&view=practice'
  );
  assert.equal(
    fallbackLinks.href(db2Key, { actionId: 'standalone-study', section: 4, tab: 'explanation' }),
    'study/db/lesson.html?lecture=2&section=4'
  );

  // DB non-lecture items sharing numeric IDs 2 or 3 (sections, videos, resources) must NOT route to lecture workspace
  const { PortalContentNavigation } = require('../js/content-navigation.js');
  const bareLinks = createContentLinks({});
  for (const nonLecType of ['section', 'video', 'theory-resource', 'practical-resource']) {
    const nonLecKey = JSON.stringify(['database-systems', nonLecType, '2']);
    for (const links of [linksWithModules, fallbackLinks, bareLinks]) {
      const resolvedUrl = links.href(nonLecKey, { actionId: 'standalone-study' });
      assert.equal(resolvedUrl.startsWith('study/db/lesson.html'), false, `${nonLecType} #2 must not route to lesson.html`);
    }
    if (catalogWithModules.get(nonLecKey)) {
      const navResolved = PortalContentNavigation.resolveAction(nonLecKey, 'standalone-study', { catalog: catalogWithModules });
      assert.equal(navResolved.valid, false, `${nonLecType} #2 must not validate standalone-study`);
      assert.equal(navResolved.reason, 'action_unavailable');
    }
  }
  assert.equal(typeof linksWithModules.isUnifiedDbLecture, 'function');
  assert.equal(typeof linksWithModules.LOCAL_STUDY_SELECTOR, 'string');
});


