/**
 * PortalStudyState - Versioned study state boundary with multi-tab reconciliation
 * and graceful degradation across storage failures.
 *
 * Physical schema:
 *   sem2_study_v1:meta -> { schemaVersion: 1, lastUsed?: { key, actionId, updatedAt } }
 *   sem2_study_v1:item:<encodedKey>:base -> { startedAt, manualComplete, ... }
 *   sem2_study_v1:item:<encodedKey>:reader -> { slideId, tab, updatedAt }
 *   sem2_study_v1:item:<encodedKey>:quiz -> { version, answers, activeQuestionId, completedVersions, ... }
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortalStudyState = factory().createStudyState();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SCHEMA_VERSION = 1;
  const PREFIX = 'sem2_study_v1:';
  const META_KEY = PREFIX + 'meta';
  const ITEM_PREFIX = PREFIX + 'item:';

  function deepClone(value) {
    if (value === null || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map(deepClone);
    const result = {};
    for (const key of Object.keys(value)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      result[key] = deepClone(value[key]);
    }
    return result;
  }

  function isForbiddenKey(key) {
    return key === '__proto__' || key === 'constructor' || key === 'prototype';
  }

  function encodeItemKey(canonicalKey) {
    return encodeURIComponent(String(canonicalKey));
  }

  function decodeItemKey(encodedKey) {
    try {
      return decodeURIComponent(encodedKey);
    } catch {
      return encodedKey;
    }
  }

  function createStudyState(options = {}) {
    let rawStorage = options.storage;
    if (!rawStorage) {
      try {
        rawStorage = typeof window !== 'undefined' ? window.localStorage : null;
      } catch {
        rawStorage = null;
      }
    }

    const subscribers = new Set();
    const items = new Map(); // canonicalKey -> itemState
    let lastUsed = null;
    let status = 'persistent'; // 'persistent' | 'session' | 'corrupt' | 'unsupported-version'

    function notifySubscribers() {
      const snap = getSnapshot();
      for (const sub of subscribers) {
        try {
          sub({ snapshot: snap, status });
        } catch (e) {
          if (typeof console !== 'undefined' && console.error) {
            console.error('PortalStudyState subscriber error:', e);
          }
        }
      }
    }

    // Initialize state from storage
    function init() {
      items.clear();
      lastUsed = null;
      status = 'persistent';

      if (!rawStorage) {
        status = 'session';
        return;
      }

      try {
        const studyKeys = [];
        const len = rawStorage.length ?? 0;
        for (let i = 0; i < len; i++) {
          const k = rawStorage.key(i);
          if (k && k.startsWith(PREFIX)) {
            studyKeys.push(k);
          }
        }

        // Process meta key first
        const rawMeta = rawStorage.getItem(META_KEY);
        if (rawMeta !== null) {
          try {
            const meta = JSON.parse(rawMeta);
            if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
              status = 'corrupt';
              return;
            }
            if (meta.schemaVersion !== SCHEMA_VERSION) {
              status = 'unsupported-version';
              return;
            }
            if (meta.lastUsed && typeof meta.lastUsed === 'object') {
              lastUsed = {
                key: String(meta.lastUsed.key),
                actionId: String(meta.lastUsed.actionId),
                updatedAt: String(meta.lastUsed.updatedAt)
              };
            }
          } catch {
            status = 'corrupt';
            return;
          }
        }

        // Process item keys
        const itemRegex = /^sem2_study_v1:item:(.+):(base|reader|quiz)$/;
        for (const k of studyKeys) {
          const match = k.match(itemRegex);
          if (!match) continue;

          const rawVal = rawStorage.getItem(k);
          if (rawVal === null) continue;

          let parsedVal;
          try {
            parsedVal = JSON.parse(rawVal);
          } catch {
            status = 'corrupt';
            return;
          }

          if (parsedVal === null || typeof parsedVal !== 'object') {
            status = 'corrupt';
            return;
          }

          const rawKey = match[1];
          const fieldType = match[2];
          const canonicalKey = decodeItemKey(rawKey);

          if (isForbiddenKey(canonicalKey)) continue;

          let currentItem = items.get(canonicalKey);
          if (!currentItem) {
            currentItem = Object.create(null);
            items.set(canonicalKey, currentItem);
          }

          if (fieldType === 'reader') {
            currentItem.reader = parsedVal;
          } else if (fieldType === 'quiz') {
            currentItem.quiz = parsedVal;
          } else if (fieldType === 'base') {
            for (const prop of Object.keys(parsedVal)) {
              if (!isForbiddenKey(prop)) {
                currentItem[prop] = parsedVal[prop];
              }
            }
          }
        }
      } catch {
        status = 'session';
      }
    }

    init();

    // Cross-tab storage listener
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('storage', event => {
        if (!event.key) {
          init();
          notifySubscribers();
          return;
        }

        if (!event.key.startsWith(PREFIX)) return;

        if (event.key === META_KEY) {
          if (!event.newValue) {
            lastUsed = null;
          } else {
            try {
              const meta = JSON.parse(event.newValue);
              if (meta && meta.lastUsed) {
                lastUsed = meta.lastUsed;
              }
            } catch {
              status = 'corrupt';
            }
          }
          notifySubscribers();
          return;
        }

        const match = event.key.match(/^sem2_study_v1:item:(.+):(base|reader|quiz)$/);
        if (match) {
          const canonicalKey = decodeItemKey(match[1]);
          const fieldType = match[2];
          if (isForbiddenKey(canonicalKey)) return;

          let currentItem = items.get(canonicalKey);
          if (!event.newValue) {
            if (currentItem) {
              if (fieldType === 'reader') delete currentItem.reader;
              else if (fieldType === 'quiz') delete currentItem.quiz;
            }
          } else {
            try {
              const parsed = JSON.parse(event.newValue);
              if (!currentItem) {
                currentItem = Object.create(null);
                items.set(canonicalKey, currentItem);
              }
              if (fieldType === 'reader') {
                currentItem.reader = parsed;
              } else if (fieldType === 'quiz') {
                currentItem.quiz = parsed;
              } else if (fieldType === 'base') {
                for (const prop of Object.keys(parsed)) {
                  if (!isForbiddenKey(prop)) currentItem[prop] = parsed[prop];
                }
              }
            } catch {
              status = 'corrupt';
            }
          }
          notifySubscribers();
        }
      });
    }

    function getStatus() {
      return status;
    }

    function getSnapshot() {
      const snap = {
        schemaVersion: SCHEMA_VERSION,
        items: {}
      };

      for (const [key, val] of items.entries()) {
        if (isForbiddenKey(key)) continue;
        snap.items[key] = deepClone(val);
      }

      if (lastUsed) {
        snap.lastUsed = deepClone(lastUsed);
      }

      return snap;
    }

    function getItem(key) {
      if (key === null || key === undefined) return null;
      const strKey = String(key);
      if (isForbiddenKey(strKey)) return null;

      const item = items.get(strKey);
      return item ? deepClone(item) : null;
    }

    function persistItemField(canonicalKey, fieldType, data) {
      if (status !== 'persistent' || !rawStorage) return false;
      const physicalKey = `${ITEM_PREFIX}${encodeItemKey(canonicalKey)}:${fieldType}`;
      try {
        if (data === undefined) {
          rawStorage.removeItem(physicalKey);
        } else {
          rawStorage.setItem(physicalKey, JSON.stringify(data));
        }
        return true;
      } catch (e) {
        status = 'session';
        return false;
      }
    }

    function persistMeta() {
      if (status !== 'persistent' || !rawStorage) return false;
      try {
        const meta = {
          schemaVersion: SCHEMA_VERSION,
          lastUsed: lastUsed || null
        };
        rawStorage.setItem(META_KEY, JSON.stringify(meta));
        return true;
      } catch {
        status = 'session';
        return false;
      }
    }

    function updateItem(key, patch) {
      if (key === null || key === undefined) {
        throw new TypeError('PortalStudyState.updateItem: key is required');
      }

      const strKey = String(key);
      if (isForbiddenKey(strKey)) {
        return { saved: false, reason: 'forbidden_key' };
      }

      let currentItem = items.get(strKey);
      if (!currentItem) {
        currentItem = Object.create(null);
        items.set(strKey, currentItem);
      }

      let hasBaseChange = false;
      let hasReaderChange = false;
      let hasQuizChange = false;

      if (patch && typeof patch === 'object') {
        for (const prop of Object.keys(patch)) {
          if (isForbiddenKey(prop)) continue;
          if (prop === 'reader') {
            currentItem.reader = deepClone(patch.reader);
            hasReaderChange = true;
          } else if (prop === 'quiz') {
            currentItem.quiz = deepClone(patch.quiz);
            hasQuizChange = true;
          } else {
            currentItem[prop] = deepClone(patch[prop]);
            hasBaseChange = true;
          }
        }
      }

      let allSaved = true;
      let failReason;

      if (status === 'corrupt' || status === 'unsupported-version') {
        notifySubscribers();
        return { saved: false, reason: status };
      }

      if (status === 'persistent' && rawStorage) {
        // Ensure meta exists
        persistMeta();

        if (hasReaderChange) {
          const ok = persistItemField(strKey, 'reader', currentItem.reader);
          if (!ok) { allSaved = false; failReason = 'quota'; }
        }
        if (hasQuizChange) {
          const ok = persistItemField(strKey, 'quiz', currentItem.quiz);
          if (!ok) { allSaved = false; failReason = 'quota'; }
        }
        if (hasBaseChange || (!hasReaderChange && !hasQuizChange)) {
          const baseData = Object.create(null);
          for (const prop of Object.keys(currentItem)) {
            if (prop !== 'reader' && prop !== 'quiz' && !isForbiddenKey(prop)) {
              baseData[prop] = currentItem[prop];
            }
          }
          const ok = persistItemField(strKey, 'base', baseData);
          if (!ok) { allSaved = false; failReason = 'quota'; }
        }
      } else {
        allSaved = false;
        failReason = 'session';
      }

      notifySubscribers();
      return allSaved ? { saved: true } : { saved: false, reason: failReason || 'session' };
    }

    function setLastUsed(value) {
      if (!value || typeof value !== 'object' || !value.key || !value.actionId) {
        return { saved: false, reason: 'invalid_last_used' };
      }

      lastUsed = {
        key: String(value.key),
        actionId: String(value.actionId),
        updatedAt: String(value.updatedAt || new Date().toISOString())
      };

      if (status === 'corrupt' || status === 'unsupported-version') {
        notifySubscribers();
        return { saved: false, reason: status };
      }

      let saved = false;
      if (status === 'persistent' && rawStorage) {
        saved = persistMeta();
      }

      notifySubscribers();
      return saved ? { saved: true } : { saved: false, reason: 'session' };
    }

    function subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('PortalStudyState.subscribe requires a function');
      }
      subscribers.add(listener);
      return function unsubscribe() {
        subscribers.delete(listener);
      };
    }

    function replaceAll(candidate) {
      if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
        return { saved: false, reason: 'invalid_candidate' };
      }
      if (candidate.schemaVersion !== SCHEMA_VERSION) {
        return { saved: false, reason: 'unsupported_version' };
      }
      if (!candidate.items || typeof candidate.items !== 'object' || Array.isArray(candidate.items)) {
        return { saved: false, reason: 'invalid_items' };
      }

      // Snapshot storage and in-memory state for atomic rollback
      const storageSnapshot = new Map();
      const previousItems = new Map();
      for (const [k, v] of items.entries()) {
        previousItems.set(k, deepClone(v));
      }
      const previousLastUsed = lastUsed ? deepClone(lastUsed) : null;
      const previousStatus = status;

      if (rawStorage) {
        try {
          const len = rawStorage.length ?? 0;
          for (let i = 0; i < len; i++) {
            const k = rawStorage.key(i);
            if (k && k.startsWith(PREFIX)) {
              storageSnapshot.set(k, rawStorage.getItem(k));
            }
          }
        } catch {
          // If we cannot even read storage, fail without mutation
          return { saved: false, reason: 'storage_denied' };
        }
      }

      // Build staging map
      const stagedWrites = new Map();
      const candidateMeta = {
        schemaVersion: SCHEMA_VERSION,
        lastUsed: candidate.lastUsed ? {
          key: String(candidate.lastUsed.key),
          actionId: String(candidate.lastUsed.actionId),
          updatedAt: String(candidate.lastUsed.updatedAt)
        } : null
      };
      stagedWrites.set(META_KEY, JSON.stringify(candidateMeta));

      for (const [key, itemVal] of Object.entries(candidate.items)) {
        if (isForbiddenKey(key) || !itemVal || typeof itemVal !== 'object') continue;
        const encodedKey = encodeItemKey(key);

        const baseData = Object.create(null);
        for (const prop of Object.keys(itemVal)) {
          if (prop !== 'reader' && prop !== 'quiz' && !isForbiddenKey(prop)) {
            baseData[prop] = itemVal[prop];
          }
        }
        stagedWrites.set(`${ITEM_PREFIX}${encodedKey}:base`, JSON.stringify(baseData));

        if (itemVal.reader && typeof itemVal.reader === 'object') {
          stagedWrites.set(`${ITEM_PREFIX}${encodedKey}:reader`, JSON.stringify(itemVal.reader));
        }
        if (itemVal.quiz && typeof itemVal.quiz === 'object') {
          stagedWrites.set(`${ITEM_PREFIX}${encodedKey}:quiz`, JSON.stringify(itemVal.quiz));
        }
      }

      // Apply staged writes atomically
      try {
        if (!rawStorage) throw new Error('No storage');

        // Write all staged keys
        for (const [k, v] of stagedWrites.entries()) {
          rawStorage.setItem(k, v);
        }

        // Remove any old study keys not in the staged set
        for (const k of storageSnapshot.keys()) {
          if (!stagedWrites.has(k)) {
            rawStorage.removeItem(k);
          }
        }

        // Commit in-memory
        items.clear();
        for (const [key, itemVal] of Object.entries(candidate.items)) {
          if (!isForbiddenKey(key) && itemVal && typeof itemVal === 'object') {
            items.set(key, deepClone(itemVal));
          }
        }
        lastUsed = candidateMeta.lastUsed;
        status = 'persistent';
        notifySubscribers();
        return { saved: true };
      } catch (err) {
        // Rollback storage to snapshot
        if (rawStorage) {
          try {
            // Remove newly added keys
            for (const k of stagedWrites.keys()) {
              if (!storageSnapshot.has(k)) {
                rawStorage.removeItem(k);
              }
            }
            // Restore previous values
            for (const [k, v] of storageSnapshot.entries()) {
              rawStorage.setItem(k, v);
            }
          } catch {
            // Best effort rollback
          }
        }

        // In-memory state remains untouched
        items.clear();
        for (const [k, v] of previousItems.entries()) {
          items.set(k, v);
        }
        lastUsed = previousLastUsed;
        status = previousStatus;

        return { saved: false, reason: err?.name === 'QuotaExceededError' ? 'quota' : 'denied' };
      }
    }

    return {
      getStatus,
      getSnapshot,
      getItem,
      updateItem,
      setLastUsed,
      subscribe,
      replaceAll,
      _init: init
    };
  }

  return {
    createStudyState,
    SCHEMA_VERSION
  };
});
