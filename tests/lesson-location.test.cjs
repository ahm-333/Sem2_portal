const { test } = require('node:test');
const assert = require('node:assert/strict');

test('PortalLessonLocation: module exports and factory', () => {
  const { PortalLessonLocation, createLessonLocation } = require('../js/shared/lesson-location.js');
  assert.equal(typeof PortalLessonLocation, 'object');
  assert.equal(typeof createLessonLocation, 'function');
  assert.equal(typeof PortalLessonLocation.normalizeAnchor, 'function');
  assert.equal(typeof PortalLessonLocation.formatBridgeAnchor, 'function');
  assert.equal(typeof PortalLessonLocation.resolveLocation, 'function');
  assert.equal(typeof PortalLessonLocation.toWorkspaceUrl, 'function');
  assert.equal(typeof PortalLessonLocation.validateBridge, 'function');
});

test('PortalLessonLocation: normalizeAnchor normalizes old aliases to canonical namespaced anchors', () => {
  const { PortalLessonLocation } = require('../js/shared/lesson-location.js');
  const norm = PortalLessonLocation.normalizeAnchor;

  // Topic anchors
  assert.equal(norm('block-1'), 'topic-block-1');
  assert.equal(norm('#block-1'), 'topic-block-1');
  assert.equal(norm('topic-block-1'), 'topic-block-1');
  assert.equal(norm('#topic-block-1'), 'topic-block-1');
  assert.equal(norm('topic:block-1'), 'topic-block-1');
  assert.equal(norm('section-1'), 'topic-block-1');
  assert.equal(norm('#section-1'), 'topic-block-1');
  assert.equal(norm('sec-3'), 'topic-block-3');

  // Slide anchors
  assert.equal(norm('slide-5'), 'slide-5');
  assert.equal(norm('#slide-5'), 'slide-5');
  assert.equal(norm('slide-card-5'), 'slide-5');
  assert.equal(norm('#slide-card-5'), 'slide-5');
  assert.equal(norm('slide:5'), 'slide-5');

  // Practice & Quiz anchors
  assert.equal(norm('practice'), 'practice');
  assert.equal(norm('#practice'), 'practice');
  assert.equal(norm('practice-hub'), 'practice');
  assert.equal(norm('#practice-hub'), 'practice');
  assert.equal(norm('quiz-section'), 'practice');
  assert.equal(norm('#quiz-section'), 'practice');
  assert.equal(norm('quiz'), 'practice');
  assert.equal(norm('#quiz'), 'practice');

  // Tab anchors
  assert.equal(norm('explanation'), 'explanation');
  assert.equal(norm('original'), 'original');

  // Valid characters invariant: must match /^[\w.-]+$/
  for (const raw of ['block-1', 'slide-5', 'practice', 'quiz-section', 'topic-block-2']) {
    const res = norm(raw);
    assert.match(res, /^[\w.-]+$/, `Anchor ${res} must conform to sem2_standalone_v1 bridge format`);
  }

  // Corrupt / unsafe / unknown anchors return null
  assert.equal(norm(null), null);
  assert.equal(norm(undefined), null);
  assert.equal(norm(''), null);
  assert.equal(norm('   '), null);
  assert.equal(norm('javascript:alert(1)'), null);
  assert.equal(norm('<script>'), null);
  assert.equal(norm('path/traversal'), null);
});

test('PortalLessonLocation: formatBridgeAnchor builds safe bridge anchors conforming to bridge regex', () => {
  const { PortalLessonLocation } = require('../js/shared/lesson-location.js');
  const fmt = PortalLessonLocation.formatBridgeAnchor;

  assert.equal(fmt('topic', 'block-1'), 'topic-block-1');
  assert.equal(fmt('topic', 2), 'topic-block-2');
  assert.equal(fmt('slide', 7), 'slide-7');
  assert.equal(fmt('practice'), 'practice');
  assert.equal(fmt('explanation'), 'explanation');
  assert.equal(fmt('original'), 'original');

  // Ensure outputs strictly pass bridge validation
  assert.match(fmt('topic', 'block-1'), /^[\w.-]+$/);
  assert.match(fmt('slide', 7), /^[\w.-]+$/);
  assert.match(fmt('practice'), /^[\w.-]+$/);
});

test('PortalLessonLocation: resolveLocation resolves study-session section ordinal vs slide number ambiguity', () => {
  const { PortalLessonLocation } = require('../js/shared/lesson-location.js');

  // Ambiguity Case 1: study-session wrote section index + 1 to reader.slideId with actionId: standalone-study
  // Number 7 here means section index 7 (e.g. block-7), NOT slide 7!
  const legacyStandalone = PortalLessonLocation.resolveLocation({
    lectureKey: '2',
    lastUsed: {
      key: '["database-systems","lecture","2"]',
      actionId: 'standalone-study',
      updatedAt: '2026-11-08T10:00:00Z'
    },
    studyItem: {
      reader: {
        slideId: 7,
        tab: 'explanation',
        updatedAt: '2026-11-08T10:00:00Z'
      }
    },
    bridge: {
      version: 1,
      anchor: 'block-7',
      updatedAt: '2026-11-08T10:00:00Z',
      checks: []
    }
  });

  assert.equal(legacyStandalone.view, 'topics');
  assert.equal(legacyStandalone.topicId, 'block-7');
  assert.equal(legacyStandalone.anchor, 'topic-block-7');
  assert.equal(legacyStandalone.slideNum, null, 'Must NOT interpret section ordinal 7 as slide 7');
  assert.equal(legacyStandalone.source, 'bridge');

  // Ambiguity Case 2: Standalone session wrote section index 4, but bridge anchor was lost/empty
  const standaloneNoBridge = PortalLessonLocation.resolveLocation({
    lectureKey: '2',
    lastUsed: {
      key: '["database-systems","lecture","2"]',
      actionId: 'standalone-study',
      updatedAt: '2026-11-08T10:00:00Z'
    },
    studyItem: {
      reader: {
        slideId: 4,
        tab: 'explanation',
        updatedAt: '2026-11-08T10:00:00Z'
      }
    },
    bridge: null
  });

  assert.equal(standaloneNoBridge.view, 'topics');
  assert.equal(standaloneNoBridge.topicId, 'block-4');
  assert.equal(standaloneNoBridge.anchor, 'topic-block-4');
  assert.equal(standaloneNoBridge.slideNum, null, '1-based section index 4 must map to topic block 4, not slide 4');

  // Ambiguity Case 3: Modal study-reader wrote actual slide 7 with actionId: internal-study
  const modalReader = PortalLessonLocation.resolveLocation({
    lectureKey: '2',
    lastUsed: {
      key: '["database-systems","lecture","2"]',
      actionId: 'internal-study',
      updatedAt: '2026-11-08T10:00:00Z'
    },
    studyItem: {
      reader: {
        slideId: 7,
        tab: 'explanation',
        updatedAt: '2026-11-08T10:00:00Z'
      }
    },
    bridge: null
  });

  assert.equal(modalReader.view, 'slides');
  assert.equal(modalReader.slideNum, 7);
  assert.equal(modalReader.anchor, 'slide-7');
  assert.equal(modalReader.source, 'reader');

  // Ambiguity Case 4: Modal reader saved tab: quiz
  const modalQuiz = PortalLessonLocation.resolveLocation({
    lectureKey: '2',
    lastUsed: {
      key: '["database-systems","lecture","2"]',
      actionId: 'internal-study',
      updatedAt: '2026-11-08T10:00:00Z'
    },
    studyItem: {
      reader: {
        slideId: 2,
        tab: 'quiz',
        updatedAt: '2026-11-08T10:00:00Z'
      }
    }
  });

  assert.equal(modalQuiz.view, 'practice');
  assert.equal(modalQuiz.anchor, 'practice');
  assert.equal(modalQuiz.tab, 'quiz');

  // Ambiguity Case 5: Timestamp tie-breaking
  // Standalone was updated LATER than modal reader
  const timestampBridgeWins = PortalLessonLocation.resolveLocation({
    lectureKey: '2',
    studyItem: {
      reader: {
        slideId: 5,
        tab: 'explanation',
        updatedAt: '2026-11-08T09:00:00Z'
      }
    },
    bridge: {
      version: 1,
      anchor: 'topic-block-2',
      updatedAt: '2026-11-08T11:00:00Z',
      checks: []
    }
  });
  assert.equal(timestampBridgeWins.view, 'topics');
  assert.equal(timestampBridgeWins.topicId, 'block-2');

  // Modal was updated LATER than standalone bridge
  const timestampReaderWins = PortalLessonLocation.resolveLocation({
    lectureKey: '2',
    lastUsed: {
      key: '["database-systems","lecture","2"]',
      actionId: 'internal-study',
      updatedAt: '2026-11-08T12:00:00Z'
    },
    studyItem: {
      reader: {
        slideId: 10,
        tab: 'explanation',
        updatedAt: '2026-11-08T12:00:00Z'
      }
    },
    bridge: {
      version: 1,
      anchor: 'topic-block-2',
      updatedAt: '2026-11-08T10:00:00Z',
      checks: []
    }
  });
  assert.equal(timestampReaderWins.view, 'slides');
  assert.equal(timestampReaderWins.slideNum, 10);
});

test('PortalLessonLocation: resolveLocation prioritizes explicit valid URL over saved state', () => {
  const { PortalLessonLocation } = require('../js/shared/lesson-location.js');

  const savedState = {
    lectureKey: '2',
    lastUsed: { key: '["database-systems","lecture","2"]', actionId: 'internal-study' },
    studyItem: { reader: { slideId: 12, tab: 'explanation' } },
    bridge: { version: 1, anchor: 'slide-12', updatedAt: '2026-11-08T10:00:00Z', checks: [] }
  };

  // 1. Explicit hash #block-3 overrides saved slide 12
  const resHash = PortalLessonLocation.resolveLocation({
    ...savedState,
    url: 'http://localhost/study/db/lesson.html?lecture=2#block-3'
  });
  assert.equal(resHash.view, 'topics');
  assert.equal(resHash.topicId, 'block-3');
  assert.equal(resHash.anchor, 'topic-block-3');
  assert.equal(resHash.source, 'url');

  // 2. Explicit param ?slide=3 overrides saved slide 12
  const resSlide = PortalLessonLocation.resolveLocation({
    ...savedState,
    url: 'http://localhost/study/db/lesson.html?lecture=2&slide=3'
  });
  assert.equal(resSlide.view, 'slides');
  assert.equal(resSlide.slideNum, 3);
  assert.equal(resSlide.anchor, 'slide-3');
  assert.equal(resSlide.source, 'url');

  // 3. Explicit param ?section=5 overrides saved state
  const resSection = PortalLessonLocation.resolveLocation({
    ...savedState,
    url: 'http://localhost/study/db/lesson.html?lecture=2&section=5'
  });
  assert.equal(resSection.view, 'topics');
  assert.equal(resSection.topicId, 'block-5');
  assert.equal(resSection.anchor, 'topic-block-5');
  assert.equal(resSection.source, 'url');

  // 4. Explicit hash #quiz-section or ?view=practice overrides saved state
  const resQuiz = PortalLessonLocation.resolveLocation({
    ...savedState,
    url: 'http://localhost/study/db/lesson.html?lecture=2#quiz-section'
  });
  assert.equal(resQuiz.view, 'practice');
  assert.equal(resQuiz.anchor, 'practice');
  assert.equal(resQuiz.source, 'url');
});

test('PortalLessonLocation: toWorkspaceUrl converts legacy DB links into canonical workspace URLs', () => {
  const { PortalLessonLocation } = require('../js/shared/lesson-location.js');
  const toUrl = PortalLessonLocation.toWorkspaceUrl;

  // Chapter 1 -> lecture 2
  assert.equal(toUrl('2', { anchor: 'block-3' }), 'study/db/lesson.html?lecture=2#topic-block-3');
  assert.equal(toUrl('2', { slide: 5 }), 'study/db/lesson.html?lecture=2&slide=5');
  assert.equal(toUrl('2', { view: 'practice' }), 'study/db/lesson.html?lecture=2&view=practice');
  assert.equal(toUrl('2', { tab: 'quiz' }), 'study/db/lesson.html?lecture=2&view=practice');

  // Converting old chapter-1.html URL string
  assert.equal(toUrl(null, 'study/db/chapter-1.html#block-2'), 'study/db/lesson.html?lecture=2#topic-block-2');
  assert.equal(toUrl(null, 'study/db/chapter-1.html?section=4'), 'study/db/lesson.html?lecture=2#topic-block-4');
  assert.equal(toUrl(null, 'study/db/chapter-1.html#quiz-section'), 'study/db/lesson.html?lecture=2&view=practice');

  // Chapter 2 -> lecture 3
  assert.equal(toUrl(null, 'study/db/chapter-2.html#block-5'), 'study/db/lesson.html?lecture=3#topic-block-5');
  assert.equal(toUrl(null, 'study/db/chapter-2.html?section=1'), 'study/db/lesson.html?lecture=3#topic-block-1');

  // Preserves base path if baseUrl provided
  assert.equal(toUrl('2', { anchor: 'block-1' }, 'http://localhost/Sem2_portal/study/db/chapter-1.html'), 'lesson.html?lecture=2#topic-block-1');
});

test('PortalLessonLocation: validateBridge preserves sem2_standalone_v1 shape and validates checks', () => {
  const { PortalLessonLocation } = require('../js/shared/lesson-location.js');
  const { validateBridge } = PortalLessonLocation;

  // Valid bridge object
  const valid = {
    version: 1,
    anchor: 'topic-block-3',
    updatedAt: '2026-11-08T10:00:00.000Z',
    checks: ['chk-1', 'chk-2']
  };
  const validated = validateBridge(valid);
  assert.equal(validated.ok, true);
  assert.deepEqual(validated.bridge, valid);

  // Rejects invalid version
  assert.equal(validateBridge({ version: 2, anchor: 'a', updatedAt: '', checks: [] }).ok, false);

  // Rejects unknown property (strict anti-pollution / storage schema protection)
  assert.equal(validateBridge({ ...valid, extraField: 'bad' }).ok, false);

  // Rejects invalid characters in anchor (e.g. colons or slashes)
  assert.equal(validateBridge({ ...valid, anchor: 'topic:block:1' }).ok, false);

  // Rejects invalid checks
  assert.equal(validateBridge({ ...valid, checks: [123] }).ok, false);
  assert.equal(validateBridge({ ...valid, checks: ['bad/slash'] }).ok, false);
});

test('PortalLessonLocation: corruption safety preserves raw state and defaults gracefully', () => {
  const { PortalLessonLocation } = require('../js/shared/lesson-location.js');

  // Completely corrupt input
  const corrupt = PortalLessonLocation.resolveLocation({
    lectureKey: '2',
    lastUsed: { key: 'invalid-key', actionId: 'unknown' },
    studyItem: { reader: { slideId: 'corrupted_string', tab: 'invalid_tab' } },
    bridge: { version: 99, anchor: '###invalid###' }
  });

  assert.equal(corrupt.view, 'topics');
  assert.equal(corrupt.source, 'default');
  assert.equal(corrupt.isAmbiguous, true);
});
