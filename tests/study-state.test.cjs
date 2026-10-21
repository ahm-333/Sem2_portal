const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// We load the module via require or factory
const { createStudyState } = require('../js/shared/study-state.js');
const fs = require('node:fs');
const vm = require('node:vm');

function createMockStorage(initial = {}, options = {}) {
  const store = new Map(Object.entries(initial));
  return {
    _store: store,
    getItem(key) {
      if (options.throwOnRead) throw new Error('Storage read denied');
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      if (options.throwOnWrite) throw new Error('Storage write denied');
      if (options.quotaExceeded) {
        const err = new Error('Quota exceeded');
        err.name = 'QuotaExceededError';
        throw err;
      }
      store.set(key, String(value));
    },
    removeItem(key) {
      if (options.throwOnWrite) throw new Error('Storage write denied');
      store.delete(key);
    },
    key(index) {
      return Array.from(store.keys())[index] || null;
    },
    get length() {
      return store.size;
    }
  };
}

describe('PortalStudyState Unit Tests', () => {
  test('initial state is empty snapshot with persistent status', () => {
    const storage = createMockStorage();
    const state = createStudyState({ storage });

    assert.equal(state.getStatus(), 'persistent');
    const snapshot = state.getSnapshot();
    assert.deepEqual(snapshot, {
      schemaVersion: 1,
      items: {}
    });
    assert.equal(state.getItem('["c1","lecture","0"]'), null);
  });

  test('normal write, read and reload round-trips correctly', () => {
    const storage = createMockStorage();
    const state1 = createStudyState({ storage });

    const key0 = JSON.stringify(['arch', 'lecture', '0']);
    const writeResult = state1.updateItem(key0, {
      startedAt: '2026-10-21T12:00:00.000Z',
      manualComplete: true,
      reader: { slideId: 4, tab: 'explanation', updatedAt: '2026-10-21T12:05:00.000Z' }
    });

    assert.equal(writeResult.saved, true);
    assert.equal(state1.getStatus(), 'persistent');

    const item = state1.getItem(key0);
    assert.deepEqual(item, {
      startedAt: '2026-10-21T12:00:00.000Z',
      manualComplete: true,
      reader: { slideId: 4, tab: 'explanation', updatedAt: '2026-10-21T12:05:00.000Z' }
    });

    // Reload with a fresh instance on same physical storage
    const state2 = createStudyState({ storage });
    assert.equal(state2.getStatus(), 'persistent');
    assert.deepEqual(state2.getItem(key0), item);
    assert.deepEqual(state2.getSnapshot().items[key0], item);
  });

  test('sibling fields: updating reader preserves quiz and vice versa', () => {
    const storage = createMockStorage();
    const state = createStudyState({ storage });
    const key = JSON.stringify(['db', 'lecture', '1']);

    // Step 1: save reader
    state.updateItem(key, {
      reader: { slideId: 2, tab: 'original', updatedAt: '2026-10-21T12:00:00.000Z' }
    });

    // Step 2: save quiz
    state.updateItem(key, {
      quiz: {
        version: 'qver123',
        answers: { 'q1': 0, 'q2': 1 },
        completedVersions: ['qver123'],
        lastCompleted: { version: 'qver123', score: 2, total: 2, completedAt: '2026-10-21T12:10:00.000Z' }
      }
    });

    const item = state.getItem(key);
    assert.equal(item.reader.slideId, 2);
    assert.equal(item.reader.tab, 'original');
    assert.equal(item.quiz.version, 'qver123');
    assert.deepEqual(item.quiz.answers, { 'q1': 0, 'q2': 1 });

    // Step 3: update reader again - quiz must remain intact
    state.updateItem(key, {
      reader: { slideId: 5, tab: 'quiz', updatedAt: '2026-10-21T12:15:00.000Z' }
    });

    const updated = state.getItem(key);
    assert.equal(updated.reader.slideId, 5);
    assert.equal(updated.quiz.version, 'qver123');
  });

  test('blocked read falls back to session-only memory with session status', () => {
    const storage = createMockStorage({}, { throwOnRead: true });
    const state = createStudyState({ storage });

    assert.equal(state.getStatus(), 'session');
    const key = JSON.stringify(['math', 'lecture', '0']);
    const writeRes = state.updateItem(key, { manualComplete: true });

    assert.equal(writeRes.saved, false);
    assert.equal(state.getItem(key).manualComplete, true);
    assert.equal(state.getStatus(), 'session');
  });

  test('quota exhaustion transitions to session status and keeps unsaved data in memory', () => {
    const storage = createMockStorage();
    const state = createStudyState({ storage });

    const key = JSON.stringify(['ai', 'lecture', '1']);
    // Normal write
    state.updateItem(key, { startedAt: '2026-10-21T10:00:00Z' });
    assert.equal(state.getStatus(), 'persistent');

    // Enable quota failure
    storage.setItem = () => {
      const err = new Error('QuotaExceededError');
      err.name = 'QuotaExceededError';
      throw err;
    };

    const res = state.updateItem(key, {
      manualComplete: true,
      reader: { slideId: 1, tab: 'explanation', updatedAt: '2026-10-21T10:05:00Z' }
    });

    assert.equal(res.saved, false);
    assert.equal(state.getStatus(), 'session');
    assert.equal(state.getItem(key).manualComplete, true);
    assert.equal(state.getItem(key).reader.slideId, 1);
  });

  test('malformed JSON in storage results in corrupt status without overwriting bytes', () => {
    const badJson = '{ invalid: json corrupt ...';
    const storage = createMockStorage({
      'sem2_study_v1:item:%5B%22course%22%2C%22lecture%22%2C%220%22%5D:base': badJson
    });
    const state = createStudyState({ storage });

    assert.equal(state.getStatus(), 'corrupt');
    // Stored bytes are preserved
    assert.equal(storage.getItem('sem2_study_v1:item:%5B%22course%22%2C%22lecture%22%2C%220%22%5D:base'), badJson);

    // Writes must be refused to avoid silently overwriting or losing user data
    const key = JSON.stringify(['course', 'lecture', '0']);
    const res = state.updateItem(key, { manualComplete: true });
    assert.equal(res.saved, false);
    assert.equal(res.reason, 'corrupt');
    assert.equal(storage.getItem('sem2_study_v1:item:%5B%22course%22%2C%22lecture%22%2C%220%22%5D:base'), badJson);
  });

  test('unsupported schemaVersion results in unsupported-version status without overwriting bytes', () => {
    const futureMeta = JSON.stringify({ schemaVersion: 99, lastUsed: null });
    const storage = createMockStorage({
      'sem2_study_v1:meta': futureMeta
    });
    const state = createStudyState({ storage });

    assert.equal(state.getStatus(), 'unsupported-version');
    assert.equal(storage.getItem('sem2_study_v1:meta'), futureMeta);

    const res = state.updateItem('["c","lecture","1"]', { manualComplete: true });
    assert.equal(res.saved, false);
    assert.equal(res.reason, 'unsupported-version');
    assert.equal(storage.getItem('sem2_study_v1:meta'), futureMeta);
  });

  test('prototype pollution keys are safely handled and do not mutate Object prototype', () => {
    const storage = createMockStorage();
    const state = createStudyState({ storage });

    state.updateItem('__proto__', { manualComplete: true });
    state.updateItem('constructor', { manualComplete: true });
    state.updateItem('toString', { manualComplete: true });

    assert.equal(Object.prototype.manualComplete, undefined);
    assert.equal(typeof Object.prototype.toString, 'function');

    assert.equal(Object.prototype.hasOwnProperty.call(state.getSnapshot().items, '__proto__'), false);
  });

  test('two concurrent pages updating different items survive reload', () => {
    const storage = createMockStorage();
    const page1 = createStudyState({ storage });
    const page2 = createStudyState({ storage });

    const key0 = JSON.stringify(['course', 'lecture', '0']);
    const key1 = JSON.stringify(['course', 'lecture', '1']);

    page1.updateItem(key0, { manualComplete: true });
    page2.updateItem(key1, { manualComplete: true });

    // Reload both from physical storage
    const reloaded = createStudyState({ storage });
    assert.equal(reloaded.getItem(key0)?.manualComplete, true);
    assert.equal(reloaded.getItem(key1)?.manualComplete, true);
  });

  test('two concurrent pages updating sibling fields on the same item survive reload', () => {
    const storage = createMockStorage();
    const page1 = createStudyState({ storage });
    const page2 = createStudyState({ storage });

    const key = JSON.stringify(['course', 'lecture', '0']);

    // Page 1 writes reader
    page1.updateItem(key, {
      reader: { slideId: 10, tab: 'quiz', updatedAt: '2026-10-21T14:00:00Z' }
    });

    // Page 2 writes quiz
    page2.updateItem(key, {
      quiz: { version: 'v2', answers: { '1': 2 } }
    });

    // Reload from storage
    const reloaded = createStudyState({ storage });
    const item = reloaded.getItem(key);
    assert.ok(item, 'item exists');
    assert.equal(item.reader?.slideId, 10);
    assert.equal(item.quiz?.version, 'v2');
  });

  test('replaceAll validates and commits atomically, rolling back on failure', () => {
    const storage = createMockStorage({
      'user_theme': 'dark', // Unrelated key must remain intact
      'sem2_study_v1:meta': JSON.stringify({ schemaVersion: 1 }),
      'sem2_study_v1:item:%5B%22old%22%2C%22lecture%22%2C%220%22%5D:base': JSON.stringify({ manualComplete: true })
    });

    const state = createStudyState({ storage });

    const candidate = {
      schemaVersion: 1,
      items: {
        '["new","lecture","1"]': {
          startedAt: '2026-10-21T15:00:00Z',
          manualComplete: true
        }
      },
      lastUsed: { key: '["new","lecture","1"]', actionId: 'internal-study', updatedAt: '2026-10-21T15:00:00Z' }
    };

    // First: test successful replaceAll
    const successRes = state.replaceAll(candidate);
    assert.equal(successRes.saved, true);
    assert.deepEqual(state.getSnapshot(), candidate);
    assert.equal(storage.getItem('user_theme'), 'dark');

    // Second: test failed replaceAll with simulated quota error
    const brokenCandidate = {
      schemaVersion: 1,
      items: {
        '["another","lecture","2"]': { manualComplete: true }
      }
    };

    const persistentBefore = new Map(storage._store);
    // A replacement now publishes once; inject failure at that atomic write.
    storage.setItem = () => {
      const err = new Error('QuotaExceededError');
      err.name = 'QuotaExceededError';
      throw err;
    };

    const failRes = state.replaceAll(brokenCandidate);
    assert.equal(failRes.saved, false);
    // State remains previous candidate, not broken candidate
    assert.deepEqual(state.getSnapshot(), candidate);
    assert.deepEqual(new Map(storage._store), persistentBefore);
    assert.equal(storage.getItem('user_theme'), 'dark');
  });

  test('removed-item state round-trips unchanged', () => {
    const storage = createMockStorage();
    const state1 = createStudyState({ storage });

    const retiredKey = JSON.stringify(['retired-course', 'lecture', '99']);
    state1.updateItem(retiredKey, {
      manualComplete: true,
      quiz: { version: 'archived', answers: {} }
    });

    const state2 = createStudyState({ storage });
    const item = state2.getItem(retiredKey);
    assert.equal(item.manualComplete, true);
    assert.equal(item.quiz.version, 'archived');
  });

  test('subscriptions notify with { snapshot, status } and return working unsubscribe', () => {
    const storage = createMockStorage();
    const state = createStudyState({ storage });

    const notifications = [];
    const unsubscribe = state.subscribe(evt => {
      notifications.push(evt);
    });

    const key = JSON.stringify(['course', 'lecture', '0']);
    state.updateItem(key, { manualComplete: true });

    assert.equal(notifications.length, 1);
    assert.equal(notifications[0].status, 'persistent');
    assert.equal(notifications[0].snapshot.items[key].manualComplete, true);

    unsubscribe();
    state.updateItem(key, { manualComplete: false });
    assert.equal(notifications.length, 1); // No new notification after unsubscribe
  });

  test('setLastUsed updates lastUsed in snapshot and persists', () => {
    const storage = createMockStorage();
    const state = createStudyState({ storage });

    const last = {
      key: JSON.stringify(['os', 'lecture', '2']),
      actionId: 'internal-study',
      updatedAt: '2026-10-21T16:00:00.000Z'
    };

    const res = state.setLastUsed(last);
    assert.equal(res.saved, true);
    assert.deepEqual(state.getSnapshot().lastUsed, last);

    const state2 = createStudyState({ storage });
    assert.deepEqual(state2.getSnapshot().lastUsed, last);
  });

  test('defensive snapshots prevent accidental external mutation', () => {
    const storage = createMockStorage();
    const state = createStudyState({ storage });

    const key = JSON.stringify(['sec', 'lecture', '1']);
    state.updateItem(key, {
      manualComplete: true,
      reader: { slideId: 1, tab: 'explanation', updatedAt: '2026-10-21T10:00:00Z' }
    });

    const snap = state.getSnapshot();
    snap.items[key].manualComplete = false;
    snap.items[key].reader.slideId = 999;

    assert.equal(state.getItem(key).manualComplete, true);
    assert.equal(state.getItem(key).reader.slideId, 1);
  });
});

describe('Study storage acceptance regressions', () => {
  const key = JSON.stringify(['data-structure', 'lecture', '0']);
  const when = '2026-10-21T12:00:00Z';
  const last = {key, actionId: 'internal-study', updatedAt: when};

  function watched(storage) {
    const listeners = [];
    const context = {module: {exports: {}}, console, window: {localStorage: storage,
      addEventListener(type, callback) { if (type === 'storage') listeners.push(callback); }}};
    vm.runInNewContext(fs.readFileSync(require.resolve('../js/shared/study-state.js'), 'utf8'), context);
    const state = context.module.exports.createStudyState({storage});
    return {state, fire(event) { listeners.forEach(fn => fn(event)); }};
  }

  test('failed replacement preserves durable bytes and a freshly loaded last source', () => {
    const storage = createMockStorage();
    const state = createStudyState({storage});
    state.updateItem(key, {manualComplete: true});
    state.setLastUsed(last);
    const before = new Map(storage._store);
    const memory = state.getSnapshot();
    const write = storage.setItem.bind(storage);
    storage.setItem = (physical, value) => {
      if (!physical.endsWith(':meta')) throw new Error('persistent write failure');
      write(physical, value);
    };
    assert.equal(state.replaceAll({schemaVersion: 1, items: {}}).saved, false);
    assert.deepEqual(new Map(storage._store), before);
    assert.deepEqual(state.getSnapshot(), memory);
    assert.deepEqual(createStudyState({storage}).getSnapshot(), memory);
  });

  test('independent base fields survive writes before cross-tab events arrive', () => {
    const storage = createMockStorage();
    const a = createStudyState({storage}), b = createStudyState({storage});
    a.updateItem(key, {startedAt: when});
    b.updateItem(key, {manualComplete: true});
    assert.deepEqual(createStudyState({storage}).getItem(key), {startedAt: when, manualComplete: true});
  });

  test('an item write does not erase another tab latest source', () => {
    const storage = createMockStorage();
    const a = createStudyState({storage}), b = createStudyState({storage});
    a.setLastUsed(last);
    b.updateItem(key, {manualComplete: true});
    assert.deepEqual(createStudyState({storage}).getSnapshot().lastUsed, last);
  });

  test('replacement refuses corrupt and future-version bytes without mutation', () => {
    for (const raw of ['broken JSON', JSON.stringify({schemaVersion: 99})]) {
      const storage = createMockStorage({'sem2_study_v1:meta': raw});
      const state = createStudyState({storage});
      const before = new Map(storage._store);
      assert.equal(state.replaceAll({schemaVersion: 1, items: {}}).saved, false);
      assert.deepEqual(new Map(storage._store), before);
    }
  });

  test('a live newer-schema event blocks subsequent writes', () => {
    const storage = createMockStorage();
    const {state, fire} = watched(storage);
    const raw = JSON.stringify({schemaVersion: 99});
    storage.setItem('sem2_study_v1:meta', raw);
    fire({key: 'sem2_study_v1:meta', newValue: raw});
    assert.equal(state.getStatus(), 'unsupported-version');
    assert.equal(state.updateItem(key, {manualComplete: true}).saved, false);
    assert.equal(storage.getItem('sem2_study_v1:meta'), raw);
  });

  test('replacement is observed as one complete state by another tab', () => {
    const storage = createMockStorage();
    const a = createStudyState({storage});
    a.updateItem(key, {manualComplete: true});
    const before = a.getSnapshot();
    const candidate = {schemaVersion: 1, items: {}, lastUsed: last};
    const observations = [];
    const write = storage.setItem.bind(storage);
    storage.setItem = (k, v) => {write(k, v); observations.push(createStudyState({storage}).getSnapshot());};
    assert.equal(a.replaceAll(candidate).saved, true);
    for (const value of observations) assert.ok(JSON.stringify(value) === JSON.stringify(before) || JSON.stringify(value) === JSON.stringify(candidate), 'no partial replacement may become visible');
  });

  test('another-tab replacement removes deleted items and base fields', () => {
    const storage = createMockStorage();
    const a = createStudyState({storage});
    a.updateItem(key, {startedAt: when, manualComplete: true});
    const {state: b, fire} = watched(storage);
    const before = new Map(storage._store);
    a.replaceAll({schemaVersion: 1, items: {}});
    for (const physical of new Set([...before.keys(), ...storage._store.keys()])) {
      if (before.get(physical) !== storage.getItem(physical)) fire({key: physical, newValue: storage.getItem(physical)});
    }
    assert.equal(b.getItem(key), null);
  });

  test('invalid nested state and cyclic candidates fail without mutation or exceptions', () => {
    const storage = createMockStorage();
    const state = createStudyState({storage});
    state.updateItem(key, {manualComplete: true});
    const before = new Map(storage._store);
    const cyclic = {}; cyclic.self = cyclic;
    for (const item of [[], {reader: {slideId: -1, tab: 'invalid', updatedAt: when}}, {quiz: {version: 'v1', answers: {'1': -1}}}, {manualComplete: 'yes'}, cyclic]) {
      let result;
      assert.doesNotThrow(() => { result = state.replaceAll({schemaVersion: 1, items: {[key]: item}}); });
      assert.equal(result.saved, false);
      assert.deepEqual(new Map(storage._store), before);
    }
    assert.equal(state.updateItem('not-a-canonical-key', {manualComplete: true}).saved, false);
    const sparse = {version: 'v1', answers: {}, completedVersions: new Array(2)};
    assert.equal(state.updateItem(key, {quiz: sparse}).saved, false, 'sparse arrays must not serialize into invalid null entries');
  });

  test('a same-item write during replacement has a durable serial outcome', () => {
    const storage = createMockStorage();
    const a = createStudyState({storage}), b = createStudyState({storage});
    a.updateItem(key, {manualComplete: true});
    const original = storage.setItem.bind(storage);
    let injected = false;
    storage.setItem = (k, v) => {
      original(k, v);
      if (!injected) {injected = true; b.updateItem(key, {reader: {slideId: 3, tab: 'original', updatedAt: when}});}
    };
    const candidate = {schemaVersion: 1, items: {[key]: {manualComplete: false}}};
    assert.equal(a.replaceAll(candidate).saved, true);
    const result = createStudyState({storage}).getItem(key);
    assert.equal(result.manualComplete, false);
    assert.equal(result.reader?.slideId, 3, 'a write after the replacement commit survives');
  });

  test('concurrent same-field ties converge independently of storage key order', () => {
    const entries = [
      ['sem2_study_v1:op:a.1', {schemaVersion: 1, id: 'a.1', clock: 1, kind: 'update', key, patch: {manualComplete: true}}],
      ['sem2_study_v1:op:b.1', {schemaVersion: 1, id: 'b.1', clock: 1, kind: 'update', key, patch: {manualComplete: false}}]
    ];
    for (const order of [entries, [...entries].reverse()]) {
      const storage = createMockStorage(Object.fromEntries(order.map(([k, v]) => [k, JSON.stringify(v)])));
      assert.equal(createStudyState({storage}).getItem(key).manualComplete, false);
    }
  });

  test('remote durable updates do not discard local unsaved fields', () => {
    const storage = createMockStorage();
    const local = createStudyState({storage});
    const write = storage.setItem.bind(storage);
    storage.setItem = () => {throw new Error('denied');};
    local.updateItem(key, {manualComplete: true});
    storage.setItem = write;
    createStudyState({storage}).updateItem(key, {startedAt: when});
    assert.deepEqual(local.getItem(key), {startedAt: when, manualComplete: true});
    assert.equal(local.getStatus(), 'session', 'a later storage event cannot silently mark unsaved changes as saved');
  });

  test('hidden serialization hooks and accessors cannot publish or throw', () => {
    const candidates = [];
    const hooked = {schemaVersion: 1, items: {}};
    Object.defineProperty(hooked, 'toJSON', {value() { return []; }});
    candidates.push(hooked);
    const getter = {schemaVersion: 1};
    Object.defineProperty(getter, 'items', {enumerable: true, get() { throw new Error('accessor executed'); }});
    candidates.push(getter);
    for (const candidate of candidates) {
      const storage = createMockStorage();
      const state = createStudyState({storage});
      state.updateItem(key, {manualComplete: true});
      const before = new Map(storage._store), memory = state.getSnapshot();
      let response;
      assert.doesNotThrow(() => {response = state.replaceAll(candidate);});
      assert.equal(response.saved, false);
      assert.deepEqual(new Map(storage._store), before);
      assert.deepEqual(createStudyState({storage}).getSnapshot(), memory);
      assert.equal(state.getStatus(), 'persistent');
    }
    const storage = createMockStorage(), state = createStudyState({storage});
    const patch = {};
    Object.defineProperty(patch, 'manualComplete', {enumerable: true, get() {throw new Error('getter');}});
    assert.doesNotThrow(() => assert.equal(state.updateItem(key, patch).saved, false));
  });
});
