const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createStudyState } = require('../js/shared/study-state.js');

function createMockStorage(initial = {}) {
  const store = new Map(Object.entries(initial).map(([k, v]) => [k, String(v)]));
  const listeners = new Set();
  const stats = { setItemCalls: 0, keysWritten: [] };
  const api = {
    get length() { return store.size; },
    key(index) { return Array.from(store.keys())[index] ?? null; },
    getItem(key) { return store.has(key) ? store.get(key) : null; },
    setItem(key, value) {
      stats.setItemCalls++;
      stats.keysWritten.push(key);
      if (api._quotaOnCall && stats.setItemCalls >= api._quotaOnCall) {
        const err = new Error('QuotaExceededError');
        err.name = 'QuotaExceededError';
        throw err;
      }
      if (api._failWrites) {
        const err = new Error('QuotaExceededError');
        err.name = 'QuotaExceededError';
        throw err;
      }
      store.set(String(key), String(value));
    },
    removeItem(key) { store.delete(String(key)); },
    clear() { store.clear(); },
    _store: store,
    _stats: stats,
    _failWrites: false,
    _quotaOnCall: 0,
    _resetStats() { stats.setItemCalls = 0; stats.keysWritten.length = 0; },
    _subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    _fire(key, newValue) {
      for (const fn of listeners) fn({ key, newValue });
    }
  };
  return api;
}

describe('PortalStudyState atomic cross-store standalone & bundle seam (Slice A)', () => {
  test('replaceBundle commits journal, standalone bridges, and standalone checks in one setItem while keeping snapshot clean', () => {
    const lec0 = JSON.stringify(['computer-architecture', 'lecture', '0']);
    const ds2 = JSON.stringify(['data-structure', 'lecture', '2']);
    const db2 = JSON.stringify(['database-systems', 'lecture', '2']);
    const storage = createMockStorage({
      'sem2_student_profile': JSON.stringify({ group: 'B2', section: 6 }),
      'sem2_portal_theme': 'dark',
      ['sem2_standalone_v1:' + encodeURIComponent(db2)]: JSON.stringify({
        version: 1,
        anchor: 'topic-block-1',
        updatedAt: '2026-10-20T10:00:00Z',
        checks: []
      }),
      ['sem2_standalone_check_v1:' + encodeURIComponent(ds2) + ':sec-1']: JSON.stringify({
        version: 1,
        checked: true
      })
    });

    const state = createStudyState({ storage });
    state.updateItem(db2, { manualComplete: true });
    storage._resetStats();

    const bundle = {
      studyState: {
        schemaVersion: 1,
        items: {
          [lec0]: {
            startedAt: '2026-10-25T12:00:00Z',
            manualComplete: true,
            reader: { slideId: 4, tab: 'explanation', updatedAt: '2026-10-25T12:05:00Z' }
          }
        },
        lastUsed: { key: lec0, actionId: 'internal-study', updatedAt: '2026-10-25T12:05:00Z' }
      },
      standalone: {
        bridges: {
          [ds2]: {
            version: 1,
            anchor: 'section-3',
            updatedAt: '2026-10-25T12:10:00Z',
            checks: ['sec-2']
          }
        },
        checks: {
          [ds2]: {
            'sec-2': { version: 1, checked: true }
          }
        }
      }
    };

    const res = state.replaceBundle(bundle);
    assert.equal(res.saved, true);
    assert.equal(storage._stats.setItemCalls, 1, 'cross-store restore must commit via exactly one setItem call');

    // Journal snapshot stays strictly schemaVersion 1 without standalone leakage
    const snap = state.getSnapshot();
    assert.deepEqual(Object.keys(snap).sort(), ['items', 'lastUsed', 'schemaVersion']);
    assert.equal(snap.items[db2], undefined, 'replaced journal removes prior db2 item');
    assert.equal(snap.items[lec0]?.manualComplete, true);

    // Standalone state reflects atomic bundle replacement (including clearing prior db2 bridge & ds2 sec-1)
    assert.equal(state.getStandaloneBridge(db2), null, 'prior pre-restore bridge is superseded atomically');
    assert.deepEqual(state.getStandaloneBridge(ds2), bundle.standalone.bridges[ds2]);
    assert.equal(state.getStandaloneCheck(ds2, 'sec-1'), null, 'prior check sec-1 is cleared atomically');
    assert.deepEqual(state.getStandaloneCheck(ds2, 'sec-2'), { version: 1, checked: true });

    // Unrelated preference keys stay untouched
    assert.equal(storage.getItem('sem2_student_profile'), JSON.stringify({ group: 'B2', section: 6 }));
    assert.equal(storage.getItem('sem2_portal_theme'), 'dark');
  });

  test('replaceBundle preserves all prior journal and standalone bytes untouched on quota failure', () => {
    const ds2 = JSON.stringify(['data-structure', 'lecture', '2']);
    const db2 = JSON.stringify(['database-systems', 'lecture', '2']);
    const bridgeKey = 'sem2_standalone_v1:' + encodeURIComponent(db2);
    const checkKey = 'sem2_standalone_check_v1:' + encodeURIComponent(ds2) + ':sec-1';
    const storage = createMockStorage({
      [bridgeKey]: JSON.stringify({ version: 1, anchor: 'topic-block-2', updatedAt: '2026-10-20T10:00:00Z', checks: [] }),
      [checkKey]: JSON.stringify({ version: 1, checked: true })
    });
    const state = createStudyState({ storage });
    state.updateItem(db2, { manualComplete: true });
    const storeBefore = new Map(storage._store);
    const snapBefore = state.getSnapshot();
    const standaloneBefore = state.getStandaloneSnapshot();

    storage._failWrites = true;
    const res = state.replaceBundle({
      studyState: { schemaVersion: 1, items: {} },
      standalone: { bridges: {}, checks: {} }
    });

    assert.equal(res.saved, false);
    assert.equal(res.reason, 'quota');
    assert.deepEqual(new Map(storage._store), storeBefore);
    assert.deepEqual(state.getSnapshot(), snapBefore);
    assert.deepEqual(state.getStandaloneSnapshot(), standaloneBefore);
  });

  test('replaceBundle refuses corrupt or future-version standalone bytes without mutating anything', () => {
    const db2 = JSON.stringify(['database-systems', 'lecture', '2']);
    const bridgeKey = 'sem2_standalone_v1:' + encodeURIComponent(db2);
    const checkKey = 'sem2_standalone_check_v1:' + encodeURIComponent(db2) + ':sec-1';

    for (const [k, badRaw, expectedStatus] of [
      [bridgeKey, '{"version":1,', 'corrupt'],
      [bridgeKey, JSON.stringify({ version: 99, anchor: 'topic-block-1', updatedAt: '', checks: [] }), 'unsupported-version'],
      [checkKey, JSON.stringify({ version: 4, checked: true }), 'unsupported-version']
    ]) {
      const storage = createMockStorage({ [k]: badRaw });
      const state = createStudyState({ storage });
      assert.equal(state.getStandaloneStatus(), expectedStatus);
      // Journal status remains independent for non-backup lesson resilience
      assert.equal(state.getStatus(), 'persistent');
      const res = state.replaceBundle({
        studyState: { schemaVersion: 1, items: {} },
        standalone: { bridges: {}, checks: {} }
      });
      assert.equal(res.saved, false);
      assert.equal(res.reason, expectedStatus);
      assert.equal(storage.getItem(k), badRaw);
    }
  });

  test('getRevisionToken changes on concurrent journal or standalone edits and blocks stale replaceBundle', () => {
    const ds2 = JSON.stringify(['data-structure', 'lecture', '2']);
    const storage = createMockStorage();
    const tabA = createStudyState({ storage });
    const tabB = createStudyState({ storage });

    const revBefore = tabA.getRevisionToken();
    tabB.setStandaloneCheck(ds2, 'sec-1', true);
    const revAfter = tabA.getRevisionToken();
    assert.notEqual(revAfter, revBefore);

    const staleAttempt = tabA.replaceBundle({
      studyState: { schemaVersion: 1, items: {} },
      standalone: { bridges: {}, checks: {} },
      expectedRevision: revBefore
    });
    assert.equal(staleAttempt.saved, false);
    assert.equal(staleAttempt.reason, 'concurrent_change');
    assert.equal(tabB.getStandaloneCheck(ds2, 'sec-1')?.checked, true);
  });
});

describe('PortalStudyBackup export, validation, preview, and atomic restore (Slices B & C)', () => {
  function createMockCatalog(entries = []) {
    const map = new Map(entries.map(e => [e.key, e]));
    return {
      key: (courseId, type, id) => JSON.stringify([String(courseId), String(type), String(id)]),
      get: (key) => map.get(key) || null,
      list: () => entries.slice()
    };
  }

  function sampleCatalog() {
    return createMockCatalog([
      {
        key: JSON.stringify(['database-systems', 'lecture', '2']),
        courseId: 'database-systems',
        type: 'lecture',
        id: '2',
        study: {
          totalSlides: 30,
          hasFullQuiz: true,
          quizVersion: '0f77d6ceae5a',
          questionCount: 2,
          questionIds: [1, 2],
          optionCounts: [4, 3]
        }
      },
      {
        key: JSON.stringify(['computer-architecture', 'lecture', '0']),
        courseId: 'computer-architecture',
        type: 'lecture',
        id: '0',
        study: null
      },
      {
        key: JSON.stringify(['data-structure', 'lecture', '2']),
        courseId: 'data-structure',
        type: 'lecture',
        id: '2',
        study: null
      }
    ]);
  }

  function makeValidEnvelope(overrides = {}) {
    const db2 = JSON.stringify(['database-systems', 'lecture', '2']);
    const lec0 = JSON.stringify(['computer-architecture', 'lecture', '0']);
    const ds2 = JSON.stringify(['data-structure', 'lecture', '2']);
    const base = {
      project: 'sem2-portal-study',
      formatVersion: 1,
      schemaVersion: 1,
      exportedAt: '2026-11-12T10:00:00.000Z',
      payload: {
        studyState: {
          schemaVersion: 1,
          items: {
            [db2]: {
              startedAt: '2026-11-10T09:00:00.000Z',
              reader: { slideId: 5, tab: 'explanation', updatedAt: '2026-11-10T09:05:00.000Z' },
              quiz: {
                version: '0f77d6ceae5a',
                answers: { '1': 2 },
                activeQuestionId: 2,
                completedVersions: ['old-v0'],
                lastCompleted: { version: 'old-v0', score: 1, total: 2, completedAt: '2026-11-09T09:00:00.000Z' },
                bestCompleted: { version: 'old-v0', score: 1, total: 2, completedAt: '2026-11-09T09:00:00.000Z' },
                archivedResults: [{ version: 'old-v0', score: 1, total: 2, completedAt: '2026-11-09T09:00:00.000Z' }]
              }
            },
            [lec0]: {
              startedAt: '2026-11-11T08:00:00.000Z',
              manualComplete: true
            }
          },
          lastUsed: { key: db2, actionId: 'internal-study', updatedAt: '2026-11-10T09:05:00.000Z' }
        },
        standalone: {
          bridges: {
            [ds2]: {
              version: 1,
              anchor: 'section-2',
              updatedAt: '2026-11-11T12:00:00.000Z',
              checks: ['sec-1']
            }
          },
          checks: {
            [ds2]: {
              'sec-1': { version: 1, checked: true }
            }
          }
        }
      }
    };
    return Object.assign(base, overrides);
  }

  test('coverage manifest names all included and excluded stores explicitly and enforces MAX_BYTES constant', () => {
    const { createStudyBackup, MAX_BYTES } = require('../js/shared/study-backup.js');
    assert.equal(MAX_BYTES, 1048576);
    const storage = createMockStorage();
    const state = createStudyState({ storage });
    const backup = createStudyBackup({ state, catalog: sampleCatalog() });
    const manifest = backup.getCoverageManifest();

    const incKeys = manifest.included.flatMap(entry => entry.keys);
    const excKeys = manifest.excluded.flatMap(entry => entry.keys);
    assert.ok(incKeys.some(k => k.includes('sem2_study_v1')));
    assert.ok(incKeys.some(k => k.includes('sem2_standalone_v1')));
    assert.ok(incKeys.some(k => k.includes('sem2_standalone_check_v1')));
    for (const expectedExcluded of [
      'sem2_student_profile',
      'sem2_first_visit_configured',
      'sem2_portal_theme',
      'sem2_active_exam_v1',
      'sem2_study_timer_',
      'sem2_read_notifications_v1',
      'sem2_quiz_choices_v1',
      'sem2_ds_question_bank_bookmarks',
      'sem2_cg_chapter'
    ]) {
      assert.ok(excKeys.some(k => k.includes(expectedExcluded)), `Manifest must explicitly exclude ${expectedExcluded}`);
    }
  });

  test('pre-parse size guard rejects >1 MiB UTF-8 strings and byte buffers BEFORE calling JSON.parse', () => {
    const { createStudyBackup, MAX_BYTES } = require('../js/shared/study-backup.js');
    const storage = createMockStorage();
    const state = createStudyState({ storage });
    const backup = createStudyBackup({ state, catalog: sampleCatalog() });

    // Multi-byte Arabic string: < 1,048,576 UTF-16 code units, > 1,048,576 UTF-8 bytes
    const arabicBig = '"' + 'م'.repeat(600000) + '"';
    assert.ok(arabicBig.length < MAX_BYTES);
    assert.ok(Buffer.byteLength(arabicBig, 'utf8') > MAX_BYTES);

    const origParse = JSON.parse;
    let parseCalls = 0;
    JSON.parse = (...args) => { parseCalls++; return origParse(...args); };
    try {
      const resStr = backup.inspectBackup(arabicBig);
      assert.equal(resStr.ok, false);
      assert.equal(resStr.reason, 'file_too_large');

      const oversizedBytes = new Uint8Array(MAX_BYTES + 1);
      oversizedBytes.fill(32);
      const resBytes = backup.inspectBackup(oversizedBytes);
      assert.equal(resBytes.ok, false);
      assert.equal(resBytes.reason, 'file_too_large');

      const resEmpty = backup.inspectBackup('   ');
      assert.equal(resEmpty.ok, false);
      assert.equal(resEmpty.reason, 'empty');

      assert.equal(parseCalls, 0, 'Oversized or empty inputs must be rejected strictly before JSON.parse');
    } finally {
      JSON.parse = origParse;
    }
  });

  test('inspectBackup rejects prototype pollution, unknown fields, bad versions, invalid anchors/urls, and out-of-range quiz choices', () => {
    const { createStudyBackup } = require('../js/shared/study-backup.js');
    const storage = createMockStorage();
    const state = createStudyState({ storage });
    const backup = createStudyBackup({ state, catalog: sampleCatalog() });
    const db2 = JSON.stringify(['database-systems', 'lecture', '2']);
    const ds2 = JSON.stringify(['data-structure', 'lecture', '2']);

    const badPayloads = [
      '{"__proto__":{"polluted":true}}',
      JSON.stringify({ ...makeValidEnvelope(), project: 'other-site' }),
      JSON.stringify({ ...makeValidEnvelope(), formatVersion: 9 }),
      JSON.stringify({ ...makeValidEnvelope(), schemaVersion: 2 }),
      JSON.stringify({ ...makeValidEnvelope(), exportedAt: 'not-a-date' }),
      JSON.stringify({ ...makeValidEnvelope(), extraTop: true }),
      JSON.stringify((() => {
        const env = makeValidEnvelope();
        env.payload.studyState.items['not-canonical'] = { manualComplete: true };
        return env;
      })()),
      JSON.stringify((() => {
        const env = makeValidEnvelope();
        env.payload.studyState.lastUsed.actionId = 'javascript:alert(1)';
        return env;
      })()),
      JSON.stringify((() => {
        const env = makeValidEnvelope();
        env.payload.standalone.bridges[ds2].anchor = 'javascript:alert(1)';
        return env;
      })()),
      JSON.stringify((() => {
        const env = makeValidEnvelope();
        env.payload.standalone.checks[ds2]['bad/check'] = { version: 1, checked: true };
        return env;
      })()),
      JSON.stringify((() => {
        const env = makeValidEnvelope();
        env.payload.studyState.items[db2].quiz.answers = { '999': 0 }; // Unknown questionId for current quizVersion
        return env;
      })()),
      JSON.stringify((() => {
        const env = makeValidEnvelope();
        env.payload.studyState.items[db2].quiz.answers = { '2': 3 }; // Out-of-bounds choice (optionCounts[1] === 3 -> valid 0..2)
        return env;
      })()),
      JSON.stringify((() => {
        const env = makeValidEnvelope();
        env.payload.studyState.items[db2].quiz.lastCompleted = {
          version: '0f77d6ceae5a', score: 1, total: 99, completedAt: '2026-11-10T09:05:00.000Z'
        };
        return env;
      })())
    ];

    for (const raw of badPayloads) {
      const inspected = backup.inspectBackup(raw);
      assert.equal(inspected.ok, false, `Payload should fail validation: ${raw.slice(0, 140)}`);
    }
    assert.equal(({}).polluted, undefined, 'Object.prototype must stay clean');
  });

  test('old quizVersion preserves results and completedVersions while clearing stale draft answers; valid orphan records and ID 0 survive', () => {
    const { createStudyBackup } = require('../js/shared/study-backup.js');
    const storage = createMockStorage();
    const state = createStudyState({ storage });
    const backup = createStudyBackup({ state, catalog: sampleCatalog() });
    const db2 = JSON.stringify(['database-systems', 'lecture', '2']);
    const orphan = JSON.stringify(['archived-course', 'lecture', '7']);

    const env = makeValidEnvelope();
    env.payload.studyState.items[db2].quiz = {
      version: 'stale-v0',
      answers: { '1': 0, '99': 1 },
      activeQuestionId: 99,
      completedVersions: ['stale-v0'],
      lastCompleted: { version: 'stale-v0', score: 5, total: 5, completedAt: '2026-10-01T10:00:00.000Z' },
      bestCompleted: { version: 'stale-v0', score: 5, total: 5, completedAt: '2026-10-01T10:00:00.000Z' },
      archivedResults: [{ version: 'stale-v0', score: 5, total: 5, completedAt: '2026-10-01T10:00:00.000Z' }]
    };
    env.payload.studyState.items[orphan] = {
      startedAt: '2026-10-02T10:00:00.000Z',
      manualComplete: true
    };

    const inspected = backup.inspectBackup(JSON.stringify(env));
    assert.equal(inspected.ok, true);
    assert.equal(inspected.preview.incoming.staleQuizCount, 1);
    assert.equal(inspected.preview.incoming.orphanCount, 1);

    const restored = backup.restoreBackup(JSON.stringify(env), {
      confirmed: true,
      expectedRevision: inspected.preview.revisionToken
    });
    assert.equal(restored.restored, true);

    const dbItem = state.getItem(db2);
    assert.deepEqual(dbItem.quiz.answers, {}, 'Stale quiz answers must not apply to changed quiz questions');
    assert.equal(dbItem.quiz.activeQuestionId, undefined);
    assert.deepEqual(dbItem.quiz.completedVersions, ['stale-v0']);
    assert.equal(dbItem.quiz.lastCompleted.score, 5);
    assert.equal(state.getItem(orphan)?.manualComplete, true, 'Valid orphan item must be preserved');
    assert.equal(state.getItem(JSON.stringify(['computer-architecture', 'lecture', '0']))?.manualComplete, true);
  });

  test('exportBackup excludes profile/theme/timers/exams/legacy keys and refuses corrupt or future-version backing stores', () => {
    const { createStudyBackup } = require('../js/shared/study-backup.js');
    const ds2 = JSON.stringify(['data-structure', 'lecture', '2']);
    const lec0 = JSON.stringify(['computer-architecture', 'lecture', '0']);

    const storage = createMockStorage({
      'sem2_student_profile': JSON.stringify({ group: 'B1', section: 2 }),
      'sem2_portal_theme': 'reading',
      ['sem2_active_exam_v1:' + encodeURIComponent(ds2)]: JSON.stringify({ started: true }),
      'sem2_study_timer_sessions_v1': JSON.stringify([{ mins: 25 }]),
      'sem2_ds_question_bank_bookmarks': JSON.stringify([1, 2]),
      'sem2_cg_chapter1_answers_v1': JSON.stringify({ q1: 'a' })
    });
    const state = createStudyState({ storage });
    state.updateItem(lec0, { manualComplete: true });
    state.setStandaloneBridge(ds2, { version: 1, anchor: 'sec-1', updatedAt: '2026-11-12T08:00:00.000Z', checks: ['c1'] });
    state.setStandaloneCheck(ds2, 'c1', true);

    const backup = createStudyBackup({
      state,
      catalog: sampleCatalog(),
      now: () => '2026-11-12T15:30:00.000Z'
    });
    const exported = backup.exportBackup();
    assert.equal(exported.ok, true);
    assert.equal(exported.fileName, 'sem2-study-backup-2026-11-12.json');
    assert.equal(exported.envelope.project, 'sem2-portal-study');
    assert.equal(exported.envelope.formatVersion, 1);
    assert.equal(exported.envelope.schemaVersion, 1);
    assert.equal(exported.json.includes('sem2_student_profile'), false);
    assert.equal(exported.json.includes('sem2_portal_theme'), false);
    assert.equal(exported.json.includes('sem2_active_exam_v1'), false);
    assert.equal(exported.json.includes('sem2_study_timer_sessions_v1'), false);
    assert.equal(exported.json.includes('sem2_ds_question_bank_bookmarks'), false);
    assert.equal(exported.json.includes('sem2_cg_chapter1_answers_v1'), false);

    // Corrupt standalone store blocks both export and restore without altering raw bytes
    const corruptStorage = createMockStorage({
      ['sem2_standalone_v1:' + encodeURIComponent(ds2)]: '{"version":99}'
    });
    const corruptState = createStudyState({ storage: corruptStorage });
    const corruptBackup = createStudyBackup({ state: corruptState, catalog: sampleCatalog() });
    assert.equal(corruptBackup.exportBackup().ok, false);
    const attemptRestore = corruptBackup.restoreBackup(exported.json, { confirmed: true });
    assert.equal(attemptRestore.restored, false);
    assert.equal(attemptRestore.reason, 'unsupported-version');
    assert.equal(corruptStorage.getItem('sem2_standalone_v1:' + encodeURIComponent(ds2)), '{"version":99}');
  });

  test('restoreBackup requires confirmation, detects concurrent changes, preserves exclusions, and rolls back cleanly on quota error', () => {
    const { createStudyBackup } = require('../js/shared/study-backup.js');
    const ds2 = JSON.stringify(['data-structure', 'lecture', '2']);
    const db2 = JSON.stringify(['database-systems', 'lecture', '2']);
    const storage = createMockStorage({
      'sem2_student_profile': JSON.stringify({ group: 'B3', section: 9 }),
      'sem2_portal_theme': 'dark',
      'sem2_read_notifications_v1': JSON.stringify(['n1']),
      ['sem2_active_exam_v1:' + encodeURIComponent(db2)]: JSON.stringify({ active: true })
    });
    const tabA = createStudyState({ storage });
    const tabB = createStudyState({ storage });
    tabA.setStandaloneCheck(ds2, 'sec-old', true);

    const backupA = createStudyBackup({ state: tabA, catalog: sampleCatalog() });
    const incomingJson = JSON.stringify(makeValidEnvelope());

    // Inspect builds preview without mutating state
    const previewRes = backupA.inspectBackup(incomingJson);
    assert.equal(previewRes.ok, true);
    assert.equal(previewRes.preview.formatVersion, 1);
    assert.equal(previewRes.preview.schemaVersion, 1);
    assert.equal(previewRes.preview.current.checkCount, 1);
    assert.equal(previewRes.preview.incoming.itemCount, 2);
    assert.equal(previewRes.preview.incoming.readerCount, 1);
    assert.equal(previewRes.preview.incoming.quizCount, 1);
    assert.equal(previewRes.preview.incoming.bridgeCount, 1);
    assert.equal(previewRes.preview.incoming.checkCount, 1);
    assert.equal(tabA.getStandaloneCheck(ds2, 'sec-old')?.checked, true);

    // Must not write without confirmed: true
    const unconfirmed = backupA.restoreBackup(incomingJson);
    assert.equal(unconfirmed.restored, false);
    assert.equal(unconfirmed.reason, 'confirmation_required');

    // Simulate concurrent edit by another tab between preview and confirm
    tabB.updateItem(db2, { manualComplete: true });
    const conflict = backupA.restoreBackup(incomingJson, {
      confirmed: true,
      expectedRevision: previewRes.preview.revisionToken
    });
    assert.equal(conflict.restored, false);
    assert.equal(conflict.reason, 'concurrent_change');
    assert.ok(conflict.refreshedPreview);
    assert.equal(conflict.refreshedPreview.current.itemCount, 1);

    // Quota exhaustion during confirmed restore with fresh revision keeps prior bytes intact
    storage._resetStats();
    storage._failWrites = true;
    const storeSnapshotBeforeQuota = new Map(storage._store);
    const quotaFail = backupA.restoreBackup(incomingJson, {
      confirmed: true,
      expectedRevision: conflict.refreshedPreview.revisionToken
    });
    assert.equal(quotaFail.restored, false);
    assert.equal(quotaFail.reason, 'quota');
    assert.deepEqual(new Map(storage._store), storeSnapshotBeforeQuota);

    // Re-enable writes -> single-setItem atomic restore succeeds with fresh revision
    storage._failWrites = false;
    storage._resetStats();
    const revFresh = tabA.getRevisionToken();
    const okRes = backupA.restoreBackup(incomingJson, { confirmed: true, expectedRevision: revFresh });
    assert.equal(okRes.restored, true);
    assert.equal(storage._stats.setItemCalls, 1, 'Complete cross-store restore must use a single setItem commit');

    // Fresh tab reads all restored journal + standalone state consistently
    const freshTab = createStudyState({ storage });
    assert.equal(freshTab.getItem(db2)?.quiz?.answers?.['1'], 2);
    assert.equal(freshTab.getStandaloneBridge(ds2)?.anchor, 'section-2');
    assert.equal(freshTab.getStandaloneCheck(ds2, 'sec-1')?.checked, true);
    assert.equal(freshTab.getStandaloneCheck(ds2, 'sec-old'), null);

    // Excluded keys remained untouched
    assert.equal(storage.getItem('sem2_student_profile'), JSON.stringify({ group: 'B3', section: 9 }));
    assert.equal(storage.getItem('sem2_portal_theme'), 'dark');
    assert.equal(storage.getItem('sem2_read_notifications_v1'), JSON.stringify(['n1']));
    assert.equal(storage.getItem('sem2_active_exam_v1:' + encodeURIComponent(db2)), JSON.stringify({ active: true }));
  });
});

test('confirmed backup restore works without an optional revision token', () => {
  const { createStudyBackup } = require('../js/shared/study-backup.js');
  const state = createStudyState({ storage: createMockStorage() });
  const backup = createStudyBackup({ state });
  const exported = backup.exportBackup();
  const result = backup.restoreBackup(exported.json, { confirmed: true });
  assert.equal(result.restored, true, JSON.stringify(result));
});

test('deeply nested backup input returns a validation error without throwing or writing', () => {
  const { createStudyBackup } = require('../js/shared/study-backup.js');
  const storage = createMockStorage();
  const state = createStudyState({ storage });
  const backup = createStudyBackup({ state });
  const nested = '{"x":'.repeat(10000) + 'null' + '}'.repeat(10000);
  assert.ok(Buffer.byteLength(nested) < backup.MAX_BYTES);
  const result = backup.inspectBackup(nested);
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'unsafe_value');
  assert.equal(backup.restoreBackup(nested, { confirmed: true }).restored, false);
  assert.equal(storage._stats.setItemCalls, 0);
});
