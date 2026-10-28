const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function setupTestEnvironment() {
  const codeCatalog = fs.readFileSync(path.join(root, 'js/shared/content-catalog.js'), 'utf8');
  const codeCourses = fs.readFileSync(path.join(root, 'js/courses-data.js'), 'utf8');
  const codeA1 = fs.readFileSync(path.join(root, 'js/a1-identity.js'), 'utf8');
  const codeStudyCat = fs.readFileSync(path.join(root, 'js/study-catalog.js'), 'utf8');

  const inMemoryStorage = (() => {
    let store = new Map();
    return {
      getItem(k) { return store.has(k) ? store.get(k) : null; },
      setItem(k, v) { store.set(k, String(v)); return true; },
      removeItem(k) { store.delete(k); },
      clear() { store.clear(); },
      get length() { return store.size; },
      key(i) { return [...store.keys()][i] || null; }
    };
  })();

  const scope = {
    window: {},
    document: { addEventListener: () => {}, querySelectorAll: () => [] }
  };
  vm.runInNewContext(codeCourses, scope);
  vm.runInNewContext(codeA1, scope);
  vm.runInNewContext(codeStudyCat, scope);
  vm.runInNewContext(codeCatalog, scope);

  const { createCatalog } = require('../js/shared/content-catalog.js');
  const catalog = createCatalog({
    courses: scope.window.COURSES_DATA,
    studyCatalog: scope.window.STUDY_CATALOG,
    presentation: scope.window.PortalPresentation
  });

  const { createStudyState } = require('../js/shared/study-state.js');
  const state = createStudyState({ storage: inMemoryStorage });

  return { catalog, state, storage: inMemoryStorage };
}

test('study-activity: record rejects non-canonical or unknown keys', () => {
  const { catalog, state } = setupTestEnvironment();
  const { createStudyActivity } = require('../js/study-activity.js');
  const activity = createStudyActivity({ catalog, state });

  assert.equal(activity.record(null, 'driveViewUrl'), false);
  assert.equal(activity.record('invalid-json', 'driveViewUrl'), false);
  assert.equal(activity.record('["unknown-course","lecture","1"]', 'driveViewUrl'), false);
  assert.equal(Boolean(state.getSnapshot().lastUsed), false);
});

test('study-activity: record rejects unknown action IDs for a valid key', () => {
  const { catalog, state } = setupTestEnvironment();
  const { createStudyActivity } = require('../js/study-activity.js');
  const activity = createStudyActivity({ catalog, state });

  const key = catalog.key('database-systems', 'lecture', '1');
  assert.equal(activity.record(key, 'non-existent-action'), false);
  assert.equal(Boolean(state.getSnapshot().lastUsed), false);
});

test('study-activity: record successfully sets lastUsed and startedAt for canonical key including ID 0', () => {
  const { catalog, state } = setupTestEnvironment();
  const { createStudyActivity } = require('../js/study-activity.js');
  const activity = createStudyActivity({ catalog, state });

  // Test ID 0
  const key0 = catalog.key('data-structure', 'lecture', 0);
  assert.equal(key0, '["data-structure","lecture","0"]');
  const entry0 = catalog.get(key0);
  assert.ok(entry0);
  const action0 = entry0.actions[0].id;

  const result0 = activity.record(key0, action0);
  assert.equal(result0, true);

  const snapshot = state.getSnapshot();
  assert.ok(snapshot.lastUsed);
  assert.equal(snapshot.lastUsed.key, key0);
  assert.equal(snapshot.lastUsed.actionId, action0);
  assert.ok(snapshot.items[key0]?.startedAt);

  // Preserve existing startedAt on subsequent activity
  const originalStartedAt = snapshot.items[key0].startedAt;
  const entry1 = catalog.get(catalog.key('database-systems', 'lecture', '2'));
  const key1 = entry1.key;
  activity.record(key1, 'internal-study');

  assert.equal(state.getSnapshot().lastUsed.key, key1);
  assert.equal(state.getSnapshot().items[key0].startedAt, originalStartedAt);
});

test('content-navigation: resolveAction safely validates action and URL', () => {
  const { catalog } = setupTestEnvironment();
  const { PortalContentNavigation } = require('../js/content-navigation.js');

  const key = catalog.key('database-systems', 'lecture', '2');
  const resolved = PortalContentNavigation.resolveAction(key, 'internal-study', { catalog });
  assert.equal(resolved.valid, true);
  assert.equal(resolved.action.id, 'internal-study');
  assert.equal(resolved.action.type, 'internal');

  // External action
  const driveKey = catalog.key('data-structure', 'lecture', '1');
  const resolvedDrive = PortalContentNavigation.resolveAction(driveKey, 'driveViewUrl', { catalog });
  assert.equal(resolvedDrive.valid, true);
  assert.ok(resolvedDrive.url.startsWith('https://drive.google.com/'));

  // Missing action
  const missingAction = PortalContentNavigation.resolveAction(key, 'bogus-action', { catalog });
  assert.equal(missingAction.valid, false);
  assert.equal(missingAction.reason, 'action_unavailable');

  // Missing item
  const missingItem = PortalContentNavigation.resolveAction('["bad","lecture","99"]', 'driveViewUrl', { catalog });
  assert.equal(missingItem.valid, false);
  assert.equal(missingItem.reason, 'not_found');
});
