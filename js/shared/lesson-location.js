/**
 * PortalLessonLocation (js/shared/lesson-location.js)
 * Deep authoritative location parsing, alias normalization, ambiguity resolution,
 * and canonical URL generation for the unified Database Systems lesson workspace.
 *
 * Owned by Issue #34 under Epic #27.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.PortalLessonLocation = factory().PortalLessonLocation;
    root.createLessonLocation = factory().createLessonLocation;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const BRIDGE_REGEX = /^[\w.-]+$/;
  const CHECK_REGEX = /^[\w-]+$/;

  function normalizeAnchor(raw) {
    if (typeof raw !== 'string') return null;
    let trimmed = raw.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('#')) trimmed = trimmed.slice(1);
    if (!trimmed) return null;

    // Reject dangerous or invalid schemes/characters
    if (/[/\\?&=<>"'`\s]/.test(trimmed)) return null;

    // Practice / Quiz aliases
    if (trimmed === 'practice' || trimmed === 'practice-hub' || trimmed === 'quiz' || trimmed === 'quiz-section') {
      return 'practice';
    }

    // Tab aliases
    if (trimmed === 'explanation' || trimmed === 'tab-explanation') return 'explanation';
    if (trimmed === 'original' || trimmed === 'tab-original') return 'original';

    // Slide aliases
    const slideMatch = trimmed.match(/^(?:slide(?:-card)?[:\-_]?|slide-)(\d+)$/i);
    if (slideMatch) {
      const num = Number(slideMatch[1]);
      if (Number.isSafeInteger(num) && num > 0) return 'slide-' + num;
    }

    // Topic block aliases
    const topicMatch = trimmed.match(/^(?:topic[:\-_]?block[:\-_]?|topic[:\-_]|block[:\-_]|section[:\-_]|sec[:\-_])(\d+|[\w-]+)$/i);
    if (topicMatch) {
      let id = topicMatch[1];
      if (/^\d+$/.test(id)) id = 'block-' + id;
      if (id.startsWith('topic-')) id = id.slice(6);
      return 'topic-' + id;
    }

    // General alphanumeric anchor check
    if (BRIDGE_REGEX.test(trimmed)) {
      return trimmed;
    }

    return null;
  }

  function formatBridgeAnchor(type, id) {
    if (type === 'topic') {
      if (id === null || id === undefined) return 'topic-block-1';
      let str = String(id).trim();
      if (str.startsWith('#')) str = str.slice(1);
      if (/^\d+$/.test(str)) str = 'block-' + str;
      if (!str.startsWith('topic-')) str = 'topic-' + str;
      return BRIDGE_REGEX.test(str) ? str : 'topic-block-1';
    }
    if (type === 'slide') {
      const num = Number(id);
      const safeNum = Number.isSafeInteger(num) && num > 0 ? num : 1;
      return 'slide-' + safeNum;
    }
    if (type === 'practice') return 'practice';
    if (type === 'explanation') return 'explanation';
    if (type === 'original') return 'original';

    const normalized = normalizeAnchor(String(id || ''));
    return normalized && BRIDGE_REGEX.test(normalized) ? normalized : '';
  }

  function validateBridge(bridge) {
    if (!bridge || typeof bridge !== 'object') return { ok: false, reason: 'invalid_object' };
    if (bridge.version !== 1) return { ok: false, reason: 'unsupported_version' };
    if (typeof bridge.anchor !== 'string') return { ok: false, reason: 'invalid_anchor_type' };
    if (bridge.anchor && !BRIDGE_REGEX.test(bridge.anchor)) return { ok: false, reason: 'invalid_anchor_format' };
    if (typeof bridge.updatedAt !== 'string') return { ok: false, reason: 'invalid_updatedAt_type' };
    if (bridge.updatedAt && !Number.isFinite(Date.parse(bridge.updatedAt))) return { ok: false, reason: 'invalid_timestamp' };
    if (!Array.isArray(bridge.checks)) return { ok: false, reason: 'invalid_checks_type' };
    if (bridge.checks.some(c => typeof c !== 'string' || !CHECK_REGEX.test(c))) return { ok: false, reason: 'invalid_check_id' };

    const allowed = ['version', 'anchor', 'updatedAt', 'checks'];
    if (Object.keys(bridge).some(k => !allowed.includes(k))) return { ok: false, reason: 'unknown_fields' };

    return { ok: true, bridge };
  }

  function resolveLectureKey(raw) {
    if (!raw) return null;
    const str = String(raw);
    if (str === '2' || str === '3') return str;
    if (str.includes('chapter-1') || str.includes('lecture-1')) return '2';
    if (str.includes('chapter-2') || str.includes('lecture-2')) return '3';
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed) && parsed[0] === 'database-systems') {
        const id = String(parsed[2]);
        if (id === '2' || id === '3') return id;
      }
    } catch (_) {}
    return null;
  }

  function resolveLocation(options = {}) {
    const { url, lastUsed, studyItem, bridge, lectureKey: _lectureKey } = options;

    // 1. Explicit URL check (URL wins)
    if (url) {
      let urlObj = null;
      try {
        if (typeof url === 'string') {
          urlObj = new URL(url, 'http://localhost/');
        } else if (url && typeof url.href === 'string') {
          urlObj = new URL(url.href, 'http://localhost/');
        }
      } catch (_) {}

      if (urlObj) {
        const hash = urlObj.hash ? urlObj.hash.slice(1) : '';
        const params = urlObj.searchParams;

        // Slide parameter
        const slideParam = params.get('slide');
        if (slideParam) {
          const num = Number(slideParam);
          if (Number.isSafeInteger(num) && num > 0) {
            return {
              view: 'slides',
              topicId: null,
              slideNum: num,
              tab: 'explanation',
              anchor: 'slide-' + num,
              source: 'url'
            };
          }
        }

        // View parameter
        const viewParam = params.get('view');
        if (viewParam === 'practice' || hash === 'practice' || hash === 'practice-hub' || hash === 'quiz' || hash === 'quiz-section') {
          return {
            view: 'practice',
            topicId: null,
            slideNum: null,
            tab: 'quiz',
            anchor: 'practice',
            source: 'url'
          };
        }
        if (viewParam === 'slides') {
          return {
            view: 'slides',
            topicId: null,
            slideNum: 1,
            tab: 'explanation',
            anchor: 'slide-1',
            source: 'url'
          };
        }

        // Section parameter
        const sectionParam = params.get('section');
        if (sectionParam) {
          const secNum = Number(sectionParam);
          if (Number.isSafeInteger(secNum) && secNum > 0) {
            return {
              view: 'topics',
              topicId: 'block-' + secNum,
              slideNum: null,
              tab: 'explanation',
              anchor: 'topic-block-' + secNum,
              source: 'url'
            };
          }
        }

        // Hash check
        if (hash) {
          const normHash = normalizeAnchor(hash);
          if (normHash) {
            if (normHash === 'practice') {
              return {
                view: 'practice',
                topicId: null,
                slideNum: null,
                tab: 'quiz',
                anchor: 'practice',
                source: 'url'
              };
            }
            if (normHash.startsWith('slide-')) {
              const num = Number(normHash.slice(6));
              return {
                view: 'slides',
                topicId: null,
                slideNum: Number.isSafeInteger(num) ? num : 1,
                tab: 'explanation',
                anchor: normHash,
                source: 'url'
              };
            }
            if (normHash.startsWith('topic-')) {
              const topicId = normHash.slice(6);
              return {
                view: 'topics',
                topicId,
                slideNum: null,
                tab: 'explanation',
                anchor: normHash,
                source: 'url'
              };
            }
            return {
              view: 'topics',
              topicId: normHash,
              slideNum: null,
              tab: 'explanation',
              anchor: normHash,
              source: 'url'
            };
          }
        }
      }
    }

    // 2. Saved state disambiguation
    const validBridge = validateBridge(bridge).ok ? bridge : null;
    const actionId = lastUsed?.actionId;
    const reader = studyItem?.reader;
    const bridgeAnchor = validBridge?.anchor ? normalizeAnchor(validBridge.anchor) : null;

    // Check timestamps for disambiguation
    const bridgeTime = validBridge?.updatedAt ? Date.parse(validBridge.updatedAt) : 0;
    const readerTime = reader?.updatedAt ? Date.parse(reader.updatedAt) : 0;
    const bridgeIsNewer = bridgeTime > 0 && bridgeTime > readerTime;
    const readerIsNewer = readerTime > 0 && readerTime > bridgeTime;

    // Originating action check
    if (actionId === 'standalone-study' || (!actionId && bridgeIsNewer)) {
      if (bridgeAnchor) {
        if (bridgeAnchor === 'practice') {
          return {
            view: 'practice',
            topicId: null,
            slideNum: null,
            tab: 'quiz',
            anchor: 'practice',
            source: 'bridge'
          };
        }
        if (bridgeAnchor.startsWith('slide-')) {
          const num = Number(bridgeAnchor.slice(6));
          return {
            view: 'slides',
            topicId: null,
            slideNum: Number.isSafeInteger(num) ? num : 1,
            tab: 'explanation',
            anchor: bridgeAnchor,
            source: 'bridge'
          };
        }
        if (bridgeAnchor.startsWith('topic-')) {
          const topicId = bridgeAnchor.slice(6);
          return {
            view: 'topics',
            topicId,
            slideNum: null,
            tab: 'explanation',
            anchor: bridgeAnchor,
            source: 'bridge'
          };
        }
        return {
          view: 'topics',
          topicId: bridgeAnchor,
          slideNum: null,
          tab: 'explanation',
          anchor: bridgeAnchor,
          source: 'bridge'
        };
      }

      // Standalone wrote section index + 1 to reader.slideId
      if (reader && reader.slideId !== undefined && reader.slideId !== null) {
        const secIndex = Number(reader.slideId);
        if (Number.isSafeInteger(secIndex) && secIndex > 0) {
          const blockId = 'block-' + secIndex;
          return {
            view: 'topics',
            topicId: blockId,
            slideNum: null,
            tab: 'explanation',
            anchor: 'topic-' + blockId,
            source: 'reader'
          };
        }
      }
    }

    if (actionId === 'internal-study' || (!actionId && readerIsNewer)) {
      if (reader?.tab === 'quiz') {
        return {
          view: 'practice',
          topicId: null,
          slideNum: null,
          tab: 'quiz',
          anchor: 'practice',
          source: 'reader'
        };
      }
      if (reader && reader.slideId !== undefined && reader.slideId !== null) {
        const slideNum = Number(reader.slideId);
        if (Number.isSafeInteger(slideNum) && slideNum > 0) {
          return {
            view: 'slides',
            topicId: null,
            slideNum,
            tab: reader.tab === 'original' ? 'original' : 'explanation',
            anchor: 'slide-' + slideNum,
            source: 'reader'
          };
        }
      }
    }

    // If bridge has explicit anchor even without lastUsed
    if (bridgeAnchor) {
      if (bridgeAnchor === 'practice') {
        return {
          view: 'practice',
          topicId: null,
          slideNum: null,
          tab: 'quiz',
          anchor: 'practice',
          source: 'bridge'
        };
      }
      if (bridgeAnchor.startsWith('slide-')) {
        const num = Number(bridgeAnchor.slice(6));
        return {
          view: 'slides',
          topicId: null,
          slideNum: Number.isSafeInteger(num) ? num : 1,
          tab: 'explanation',
          anchor: bridgeAnchor,
          source: 'bridge'
        };
      }
      const topicId = bridgeAnchor.startsWith('topic-') ? bridgeAnchor.slice(6) : bridgeAnchor;
      return {
        view: 'topics',
        topicId,
        slideNum: null,
        tab: 'explanation',
        anchor: bridgeAnchor.startsWith('topic-') ? bridgeAnchor : 'topic-' + bridgeAnchor,
        source: 'bridge'
      };
    }

    // Reader fallback if present
    if (reader) {
      if (reader.tab === 'quiz') {
        return {
          view: 'practice',
          topicId: null,
          slideNum: null,
          tab: 'quiz',
          anchor: 'practice',
          source: 'reader'
        };
      }
      const num = Number(reader.slideId);
      if (Number.isSafeInteger(num) && num > 0) {
        return {
          view: 'slides',
          topicId: null,
          slideNum: num,
          tab: reader.tab === 'original' ? 'original' : 'explanation',
          anchor: 'slide-' + num,
          source: 'reader'
        };
      }
    }

    // Default honest fallback
    return {
      view: 'topics',
      topicId: 'block-1',
      slideNum: null,
      tab: 'explanation',
      anchor: 'topic-block-1',
      source: 'default',
      isAmbiguous: Boolean(options && (bridge || studyItem || lastUsed))
    };
  }

  function toWorkspaceUrl(lectureKey, locationOptions, baseUrl) {
    let rawKey = lectureKey;
    let options = locationOptions || {};

    if (typeof locationOptions === 'string') {
      try {
        const u = new URL(locationOptions, 'http://localhost/');
        if (!rawKey) rawKey = resolveLectureKey(u.pathname);
        const hash = u.hash ? u.hash.slice(1) : '';
        const params = u.searchParams;
        options = {
          anchor: hash || undefined,
          slide: params.get('slide') || undefined,
          section: params.get('section') || undefined,
          view: params.get('view') || undefined
        };
        if (hash === 'quiz-section' || hash === 'quiz' || hash === 'practice') {
          options.view = 'practice';
        }
      } catch (_) {
        options = {};
      }
    }

    const key = resolveLectureKey(rawKey) || '2';
    const params = new URLSearchParams();
    params.set('lecture', key);

    let hash = '';

    if (options.view === 'practice' || options.tab === 'quiz' || options.anchor === 'practice' || options.anchor === 'quiz-section') {
      params.set('view', 'practice');
    } else if (options.slide !== undefined && options.slide !== null) {
      const num = Number(options.slide);
      if (Number.isSafeInteger(num) && num > 0) {
        params.set('slide', String(num));
      }
    } else if (options.section !== undefined && options.section !== null) {
      const secNum = Number(options.section);
      if (Number.isSafeInteger(secNum) && secNum > 0) {
        hash = '#topic-block-' + secNum;
      }
    } else if (options.anchor) {
      const norm = normalizeAnchor(options.anchor);
      if (norm) {
        if (norm === 'practice') {
          params.set('view', 'practice');
        } else {
          hash = '#' + norm;
        }
      }
    }

    let basePath = 'study/db/lesson.html';
    if (baseUrl) {
      try {
        const b = new URL(baseUrl, 'http://localhost/');
        if (b.pathname.includes('/study/db/')) {
          basePath = 'lesson.html';
        }
      } catch (_) {}
    }

    return basePath + '?' + params.toString() + hash;
  }

  function createLessonLocation(context = {}) {
    return {
      normalizeAnchor,
      formatBridgeAnchor,
      validateBridge,
      resolveLocation,
      toWorkspaceUrl
    };
  }

  const defaultInstance = createLessonLocation();

  return {
    PortalLessonLocation: defaultInstance,
    createLessonLocation
  };
});
