/* Study-only persistence: validate in memory, publish one immutable operation atomically.
 * Legacy v1 fields remain read-only input. No preference keys or old bytes are rewritten.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PortalStudyState = factory().createStudyState();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const SCHEMA_VERSION = 1;
  const STANDALONE_VERSION = 1;
  const PREFIX = 'sem2_study_v1:';
  const OPS = PREFIX + 'op:';
  const STANDALONE_BRIDGE_PREFIX = 'sem2_standalone_v1:';
  const STANDALONE_CHECK_PREFIX = 'sem2_standalone_check_v1:';
  const BRIDGE_ANCHOR_RE = /^[\w.-]*$/;
  const CHECK_ID_RE = /^[\w-]+$/;
  const TYPES = ['lecture', 'section', 'assignment', 'video', 'theory-resource', 'practical-resource', 'explanation-site'];
  const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
  const clone = value => JSON.parse(JSON.stringify(value));
  const text = value => typeof value === 'string' && value.length > 0;
  const integer = value => Number.isSafeInteger(value) && value >= 0;
  const forbidden = key => ['__proto__', 'constructor', 'prototype'].includes(key);
  const object = value => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const proto = Object.getPrototypeOf(value);
    return proto === null || Object.getPrototypeOf(proto) === null;
  };
  const fields = (value, names) => object(value) && Object.keys(value).every(key => names.includes(key));
  const optional = (value, key, valid) => !own(value, key) || valid(value[key]);
  const date = value => text(value) && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
  function safeTree(value, seen = new Set()) {
    if (value === null || ['string', 'boolean'].includes(typeof value)) return true;
    if (typeof value === 'number') return Number.isFinite(value);
    if ((!object(value) && !Array.isArray(value)) || seen.has(value)) return false;
    for (let proto = value; proto; proto = Object.getPrototypeOf(proto)) {
      if (Object.getOwnPropertyDescriptor(proto, 'toJSON')) return false;
    }
    const descriptors = Object.getOwnPropertyDescriptors(value);
    if (Object.getOwnPropertySymbols(value).length || Object.entries(descriptors).some(([key, descriptor]) => key !== 'length' && (!descriptor.enumerable || !own(descriptor, 'value')))) return false;
    if (Array.isArray(value) && (Object.keys(value).length !== value.length || !Object.keys(value).every((key, i) => key === String(i)))) return false;
    seen.add(value);
    const safe = Object.keys(value).every(key => !forbidden(key) && safeTree(value[key], seen));
    seen.delete(value);
    return safe;
  }
  function stage(value, valid) {
    try {
      if (!safeTree(value) || !valid(value)) return null;
      const normalized = clone(value);
      return safeTree(normalized) && valid(normalized) ? normalized : null;
    } catch { return null; }
  }
  function canonical(key) {
    if (!text(key)) return false;
    try {
      const parts = JSON.parse(key);
      return Array.isArray(parts) && parts.length === 3 && parts.every(text) && TYPES.includes(parts[1]) && JSON.stringify(parts) === key;
    } catch { return false; }
  }
  function result(value) {
    return fields(value, ['version', 'score', 'total', 'completedAt']) && text(value.version) && integer(value.score) && integer(value.total) && value.score <= value.total && date(value.completedAt);
  }
  function reader(value) {
    return fields(value, ['slideId', 'tab', 'updatedAt']) && (integer(value.slideId) || (text(value.slideId) && /^\d+$/.test(value.slideId))) && ['explanation', 'original', 'quiz'].includes(value.tab) && date(value.updatedAt);
  }
  function quiz(value) {
    return fields(value, ['version', 'answers', 'activeQuestionId', 'completedVersions', 'lastCompleted', 'bestCompleted', 'archivedResults']) &&
      text(value.version) && object(value.answers) && Object.entries(value.answers).every(([id, choice]) => text(id) && integer(choice)) &&
      optional(value, 'activeQuestionId', id => text(id) || integer(id)) &&
      optional(value, 'completedVersions', xs => Array.isArray(xs) && xs.every(text)) &&
      optional(value, 'lastCompleted', result) && optional(value, 'bestCompleted', result) &&
      optional(value, 'archivedResults', xs => Array.isArray(xs) && xs.every(result));
  }
  function item(value) {
    return fields(value, ['startedAt', 'manualComplete', 'reader', 'quiz']) &&
      optional(value, 'startedAt', date) && optional(value, 'manualComplete', x => typeof x === 'boolean') &&
      optional(value, 'reader', reader) && optional(value, 'quiz', quiz);
  }
  function lastUsed(value) {
    return fields(value, ['key', 'actionId', 'updatedAt']) && canonical(value.key) && text(value.actionId) && date(value.updatedAt);
  }
  function snapshot(value) {
    return fields(value, ['schemaVersion', 'items', 'lastUsed']) && value.schemaVersion === SCHEMA_VERSION &&
      object(value.items) && Object.entries(value.items).every(([key, state]) => canonical(key) && item(state)) &&
      optional(value, 'lastUsed', x => x === null || lastUsed(x));
  }
  const checkKeyPair = (lessonKey, checkId) => JSON.stringify([lessonKey, checkId]);
  const validCheckId = id => text(id) && CHECK_ID_RE.test(id) && !forbidden(id);
  const standaloneDate = value => typeof value === 'string' && (value === '' || date(value) || (/^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value))));
  function standaloneBridge(value) {
    return fields(value, ['version', 'anchor', 'updatedAt', 'checks']) && value.version === STANDALONE_VERSION &&
      optional(value, 'anchor', a => typeof a === 'string' && BRIDGE_ANCHOR_RE.test(a)) &&
      optional(value, 'updatedAt', standaloneDate) &&
      optional(value, 'checks', cs => Array.isArray(cs) && cs.every(id => validCheckId(id)));
  }
  function standaloneCheck(value) {
    return fields(value, ['version', 'checked']) && value.version === STANDALONE_VERSION && typeof value.checked === 'boolean';
  }
  function standaloneBundle(value, allowBaseline = true) {
    return fields(value, allowBaseline ? ['bridges', 'checks', 'baseline'] : ['bridges', 'checks']) &&
      object(value.bridges) && Object.entries(value.bridges).every(([key, entry]) => canonical(key) && standaloneBridge(entry)) &&
      object(value.checks) && Object.entries(value.checks).every(([key, group]) => canonical(key) && object(group) &&
        Object.entries(group).every(([checkId, entry]) => validCheckId(checkId) && standaloneCheck(entry))) &&
      (!allowBaseline || optional(value, 'baseline', base => object(base) && Object.entries(base).every(([pk, sig]) =>
        text(pk) && (pk.startsWith(STANDALONE_BRIDGE_PREFIX) || pk.startsWith(STANDALONE_CHECK_PREFIX)) && text(sig))));
  }
  function fnvDigest(raw) {
    let hash = 2166136261;
    for (let i = 0; i < raw.length; i++) {
      hash ^= raw.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return raw.length + ':' + (hash >>> 0).toString(16);
  }
  function operation(value, id) {
    if (!object(value) || !own(value, 'schemaVersion') || value.schemaVersion !== SCHEMA_VERSION || !Number.isSafeInteger(value.clock) || value.clock < 1 || value.id !== id) return false;
    if (value.kind === 'replace-bundle') return fields(value, ['schemaVersion', 'clock', 'id', 'kind', 'value', 'standalone']) && snapshot(value.value) && standaloneBundle(value.standalone, true);
    if (value.kind === 'standalone-bridge') return fields(value, ['schemaVersion', 'clock', 'id', 'kind', 'key', 'value']) && canonical(value.key) && standaloneBridge(value.value);
    if (value.kind === 'standalone-check') return fields(value, ['schemaVersion', 'clock', 'id', 'kind', 'key', 'checkId', 'value']) && canonical(value.key) && validCheckId(value.checkId) && standaloneCheck(value.value);
    if (!fields(value, ['schemaVersion', 'clock', 'id', 'kind', 'key', 'patch', 'value'])) return false;
    if (value.kind === 'update') return canonical(value.key) && item(value.patch) && !own(value, 'value');
    if (value.kind === 'lastUsed') return lastUsed(value.value) && !own(value, 'key') && !own(value, 'patch');
    return value.kind === 'replace' && snapshot(value.value) && !own(value, 'key') && !own(value, 'patch');
  }
  function apply(state, op) {
    if (op.kind === 'replace' || op.kind === 'replace-bundle') return clone(op.value);
    if (op.kind === 'lastUsed') state.lastUsed = clone(op.value);
    else if (op.kind === 'update') state.items[op.key] = {...state.items[op.key], ...clone(op.patch)};
    return state;
  }
  function applyStandalone(standaloneState, op) {
    if (op.kind === 'replace-bundle') {
      return {
        bridges: clone(op.standalone.bridges),
        checks: clone(op.standalone.checks),
        baseline: op.standalone.baseline ? clone(op.standalone.baseline) : {},
        resolvedBridges: new Set(),
        resolvedChecks: new Set()
      };
    }
    if (op.kind === 'standalone-bridge') {
      standaloneState.bridges[op.key] = clone(op.value);
      standaloneState.resolvedBridges.add(op.key);
    } else if (op.kind === 'standalone-check') {
      if (!own(standaloneState.checks, op.key)) standaloneState.checks[op.key] = {};
      standaloneState.checks[op.key][op.checkId] = clone(op.value);
      standaloneState.resolvedChecks.add(checkKeyPair(op.key, op.checkId));
    }
    return standaloneState;
  }
  function createStudyState(options = {}) {
    let storage = options.storage;
    if (!storage) {
      try { storage = typeof window !== 'undefined' ? window.localStorage : null; }
      catch { storage = null; }
    }
    const writer = globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    let sequence = 0, clock = 0, status = 'persistent', standaloneStatus = 'persistent', sessionOnly = false;
    let committed = {schemaVersion: SCHEMA_VERSION, items: {}}, pending = [];
    let standaloneCommitted = {bridges: {}, checks: {}}, physDigests = {};
    let bridgeKeyStatuses = new Map(), checkKeyStatuses = new Map();
    let maxCommittedClock = 0, lastCommittedOpId = '';
    const subscribers = new Set();

    function readPhysicalStandalone() {
      const empty = (readStatus) => ({
        status: readStatus,
        bridges: {},
        checks: {},
        digests: {},
        bridgeKeyStatuses: new Map(),
        checkKeyStatuses: new Map()
      });
      if (!storage) return empty('session');
      try {
        let readStatus = 'persistent';
        const bridges = {}, checks = {}, digests = {};
        const bridgeStatuses = new Map(), checkStatuses = new Map();
        const elevate = next => {
          if (next === 'corrupt' || readStatus === 'persistent') readStatus = next;
        };
        for (let i = 0; i < storage.length; i++) {
          const physical = storage.key(i);
          if (!physical) continue;
          if (physical.startsWith(STANDALONE_BRIDGE_PREFIX)) {
            const raw = storage.getItem(physical);
            if (raw === null) continue;
            let lessonKey;
            try { lessonKey = decodeURIComponent(physical.slice(STANDALONE_BRIDGE_PREFIX.length)); }
            catch { elevate('corrupt'); continue; }
            if (!canonical(lessonKey)) { elevate('corrupt'); continue; }
            let parsed;
            try { parsed = JSON.parse(raw); }
            catch { bridgeStatuses.set(lessonKey, 'corrupt'); elevate('corrupt'); continue; }
            if (!object(parsed) || !safeTree(parsed)) { bridgeStatuses.set(lessonKey, 'corrupt'); elevate('corrupt'); continue; }
            if (own(parsed, 'version') && parsed.version !== STANDALONE_VERSION) {
              bridgeStatuses.set(lessonKey, 'unsupported-version'); elevate('unsupported-version'); continue;
            }
            if (!standaloneBridge(parsed)) { bridgeStatuses.set(lessonKey, 'corrupt'); elevate('corrupt'); continue; }
            const digest = fnvDigest(raw);
            bridges[lessonKey] = {physicalKey: physical, digest, value: clone(parsed)};
            digests[physical] = digest;
            bridgeStatuses.set(lessonKey, 'ok');
          } else if (physical.startsWith(STANDALONE_CHECK_PREFIX)) {
            const raw = storage.getItem(physical);
            if (raw === null) continue;
            const rest = physical.slice(STANDALONE_CHECK_PREFIX.length);
            const sep = rest.indexOf(':');
            if (sep <= 0) { elevate('corrupt'); continue; }
            let lessonKey, checkId;
            try {
              lessonKey = decodeURIComponent(rest.slice(0, sep));
              checkId = decodeURIComponent(rest.slice(sep + 1));
            } catch { elevate('corrupt'); continue; }
            if (!canonical(lessonKey) || !validCheckId(checkId)) { elevate('corrupt'); continue; }
            const pair = checkKeyPair(lessonKey, checkId);
            let parsed;
            try { parsed = JSON.parse(raw); }
            catch { checkStatuses.set(pair, 'corrupt'); elevate('corrupt'); continue; }
            if (!object(parsed) || !safeTree(parsed)) { checkStatuses.set(pair, 'corrupt'); elevate('corrupt'); continue; }
            if (own(parsed, 'version') && parsed.version !== STANDALONE_VERSION) {
              checkStatuses.set(pair, 'unsupported-version'); elevate('unsupported-version'); continue;
            }
            if (!standaloneCheck(parsed)) { checkStatuses.set(pair, 'corrupt'); elevate('corrupt'); continue; }
            const digest = fnvDigest(raw);
            if (!own(checks, lessonKey)) checks[lessonKey] = {};
            checks[lessonKey][checkId] = {physicalKey: physical, digest, value: clone(parsed)};
            digests[physical] = digest;
            checkStatuses.set(pair, 'ok');
          }
        }
        return {status: readStatus, bridges, checks, digests, bridgeKeyStatuses: bridgeStatuses, checkKeyStatuses: checkStatuses};
      } catch {
        return empty('session');
      }
    }

    function mergePhysicalStandalone(standaloneState, phys) {
      for (const [lessonKey, entry] of Object.entries(phys.bridges)) {
        if (standaloneState.resolvedBridges.has(lessonKey)) continue;
        if (standaloneState.baseline === null || standaloneState.baseline[entry.physicalKey] !== entry.digest) {
          standaloneState.bridges[lessonKey] = clone(entry.value);
        }
      }
      for (const [lessonKey, group] of Object.entries(phys.checks)) {
        for (const [checkId, entry] of Object.entries(group)) {
          if (standaloneState.resolvedChecks.has(checkKeyPair(lessonKey, checkId))) continue;
          if (standaloneState.baseline === null || standaloneState.baseline[entry.physicalKey] !== entry.digest) {
            if (!own(standaloneState.checks, lessonKey)) standaloneState.checks[lessonKey] = {};
            standaloneState.checks[lessonKey][checkId] = clone(entry.value);
          }
        }
      }
    }

    function readCommitted() {
      const phys = readPhysicalStandalone();
      if (!storage) return {status: 'session', standaloneStatus: phys.status, phys};
      try {
        const rawMeta = storage.getItem(PREFIX + 'meta');
        let state = {schemaVersion: SCHEMA_VERSION, items: {}};
        let standaloneState = {bridges: {}, checks: {}, baseline: null, resolvedBridges: new Set(), resolvedChecks: new Set()};
        const ops = [], legacy = [];
        let maxClock = 0;
        if (rawMeta !== null) {
          const meta = JSON.parse(rawMeta);
          if (!object(meta) || !safeTree(meta)) return {status: 'corrupt', standaloneStatus: phys.status, phys};
          if (meta.schemaVersion !== SCHEMA_VERSION) return {status: 'unsupported-version', standaloneStatus: phys.status, phys};
          if (!fields(meta, ['schemaVersion', 'lastUsed']) || !optional(meta, 'lastUsed', x => x === null || lastUsed(x))) return {status: 'corrupt', standaloneStatus: phys.status, phys};
          if (meta.lastUsed) state.lastUsed = clone(meta.lastUsed);
        }
        for (let i = 0; i < storage.length; i++) {
          const physical = storage.key(i);
          if (!physical?.startsWith(PREFIX) || physical === PREFIX + 'meta') continue;
          const raw = storage.getItem(physical);
          if (raw === null) continue;
          const value = JSON.parse(raw);
          if (!safeTree(value)) return {status: 'corrupt', standaloneStatus: phys.status, phys};
          if (physical.startsWith(OPS)) {
            if (object(value) && own(value, 'schemaVersion') && value.schemaVersion !== SCHEMA_VERSION) return {status: 'unsupported-version', standaloneStatus: phys.status, phys};
            if (!operation(value, physical.slice(OPS.length))) return {status: 'corrupt', standaloneStatus: phys.status, phys};
            ops.push(value); maxClock = Math.max(maxClock, value.clock);
          } else {
            const match = physical.match(/^sem2_study_v1:item:(.+):(base|reader|quiz)$/);
            if (!match) return {status: 'corrupt', standaloneStatus: phys.status, phys};
            const key = decodeURIComponent(match[1]);
            if (!canonical(key)) return {status: 'corrupt', standaloneStatus: phys.status, phys};
            const part = match[2] === 'base' ? value : {[match[2]]: value};
            if (!item(part) || (match[2] === 'base' && Object.keys(part).some(k => !['startedAt', 'manualComplete'].includes(k)))) return {status: 'corrupt', standaloneStatus: phys.status, phys};
            legacy.push({key, part});
          }
        }
        for (const {key, part} of legacy) state.items[key] = {...state.items[key], ...part};
        ops.sort((a, b) => a.clock - b.clock || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
        for (const op of ops) {
          state = apply(state, op);
          standaloneState = applyStandalone(standaloneState, op);
        }
        mergePhysicalStandalone(standaloneState, phys);
        const lastOpId = ops.length ? ops[ops.length - 1].id : '';
        return {
          status: 'persistent',
          standaloneStatus: phys.status,
          state,
          standalone: {bridges: standaloneState.bridges, checks: standaloneState.checks},
          maxClock,
          lastOpId,
          phys
        };
      } catch (error) {
        return {status: error instanceof SyntaxError || error instanceof URIError ? 'corrupt' : 'session', standaloneStatus: phys.status, phys};
      }
    }
    function refresh() {
      const read = readCommitted();
      if (read.state) { committed = read.state; clock = Math.max(clock, read.maxClock); maxCommittedClock = read.maxClock; lastCommittedOpId = read.lastOpId || ''; }
      if (read.standalone) standaloneCommitted = read.standalone;
      if (read.phys) {
        physDigests = read.phys.digests;
        bridgeKeyStatuses = read.phys.bridgeKeyStatuses;
        checkKeyStatuses = read.phys.checkKeyStatuses;
      }
      status = read.status === 'persistent' && sessionOnly ? 'session' : read.status;
      standaloneStatus = read.standaloneStatus === 'persistent' && sessionOnly ? 'session' : read.standaloneStatus;
      return read;
    }
    function current() {
      let state = clone(committed);
      for (const op of pending) state = apply(state, op);
      return state;
    }
    function currentStandalone() {
      let state = {bridges: clone(standaloneCommitted.bridges), checks: clone(standaloneCommitted.checks), baseline: null, resolvedBridges: new Set(), resolvedChecks: new Set()};
      for (const op of pending) state = applyStandalone(state, op);
      return {bridges: state.bridges, checks: state.checks};
    }
    function computeRevision(read) {
      const sortedDigests = Object.entries(read?.phys?.digests || physDigests).sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
      return fnvDigest(JSON.stringify([
        read ? read.status : status,
        read ? read.standaloneStatus : standaloneStatus,
        read?.maxClock ?? maxCommittedClock,
        read?.lastOpId ?? lastCommittedOpId,
        read?.state || committed,
        read?.standalone || standaloneCommitted,
        sortedDigests
      ]));
    }
    function getRevisionToken() {
      const read = refresh();
      return computeRevision(read);
    }
    function getSnapshot() { refresh(); return current(); }
    function getStandaloneSnapshot() { refresh(); return currentStandalone(); }
    function getItem(key) {
      if (!canonical(key)) return null;
      const state = getSnapshot();
      return own(state.items, key) ? state.items[key] : null;
    }
    function getStatus() { refresh(); return status; }
    function getStandaloneStatus() { refresh(); return standaloneStatus; }
    function getStandaloneBridgeState(key) {
      refresh();
      if (!canonical(key)) return {status: 'invalid', bridge: null};
      const keyStatus = bridgeKeyStatuses.get(key);
      if (keyStatus === 'corrupt' || keyStatus === 'unsupported-version') return {status: keyStatus, bridge: null};
      const bridges = currentStandalone().bridges;
      return own(bridges, key) ? {status: 'ok', bridge: clone(bridges[key])} : {status: 'missing', bridge: null};
    }
    function getStandaloneBridge(key) { return getStandaloneBridgeState(key).bridge; }
    function getStandaloneCheckState(key, checkId) {
      refresh();
      if (!canonical(key) || !validCheckId(checkId)) return {status: 'invalid', check: null};
      const pair = checkKeyPair(key, checkId);
      const keyStatus = checkKeyStatuses.get(pair);
      if (keyStatus === 'corrupt' || keyStatus === 'unsupported-version') return {status: keyStatus, check: null};
      const checks = currentStandalone().checks;
      const value = own(checks, key) && own(checks[key], checkId) ? checks[key][checkId] : null;
      return value ? {status: 'ok', check: clone(value)} : {status: 'missing', check: null};
    }
    function getStandaloneCheck(key, checkId) { return getStandaloneCheckState(key, checkId).check; }
    function notify() {
      const value = current();
      for (const listener of subscribers) {
        try { listener({snapshot: clone(value), status}); }
        catch (error) { console.error('PortalStudyState subscriber error:', error); }
      }
    }
    function publish(kind, payload, replace = false, expectedRevision) {
      const liveRead = refresh();
      if (replace && expectedRevision !== undefined && expectedRevision !== computeRevision(liveRead)) {
        return {saved: false, reason: 'concurrent_change'};
      }
      const op = {schemaVersion: SCHEMA_VERSION, clock: ++clock, id: writer + '.' + (++sequence), kind, ...payload};
      let raw;
      try {
        raw = JSON.stringify(op);
        const serialized = JSON.parse(raw);
        if (!safeTree(serialized) || !operation(serialized, op.id)) return {saved: false, reason: 'invalid_candidate'};
      } catch { return {saved: false, reason: 'invalid_candidate'}; }
      if (liveRead.status === 'corrupt' || liveRead.status === 'unsupported-version') {
        if (!replace) pending.push(op);
        notify(); return {saved: false, reason: liveRead.status, scope: 'journal'};
      }
      if (kind === 'replace-bundle' && (liveRead.standaloneStatus === 'corrupt' || liveRead.standaloneStatus === 'unsupported-version')) {
        return {saved: false, reason: liveRead.standaloneStatus, scope: 'standalone'};
      }
      if (storage && (!sessionOnly || replace) && liveRead.status === 'persistent') {
        try {
          // The sole publication point: a failed setItem leaves all active bytes intact.
          storage.setItem(OPS + op.id, raw);
          if (replace) {pending = []; sessionOnly = false;}
          refresh(); notify(); return {saved: true};
        } catch (error) {
          if (!replace) pending.push(op);
          if (kind !== 'replace-bundle') {sessionOnly = true; status = 'session';}
          notify(); return {saved: false, reason: error?.name === 'QuotaExceededError' ? 'quota' : 'session'};
        }
      }
      if (!replace) pending.push(op);
      if (kind !== 'replace-bundle') {sessionOnly = true; status = 'session';}
      notify();
      return {saved: false, reason: 'session'};
    }
    function updateItem(key, patch) {
      if (key === null || key === undefined) throw new TypeError('PortalStudyState.updateItem: key is required');
      const prepared = stage(patch, item);
      if (!canonical(key) || !prepared) return {saved: false, reason: 'invalid_item'};
      return publish('update', {key, patch: prepared});
    }
    function setLastUsed(value) {
      const prepared = stage(value, v => fields(v, ['key', 'actionId', 'updatedAt']) && canonical(v.key) && text(v.actionId) && optional(v, 'updatedAt', date));
      if (!prepared) return {saved: false, reason: 'invalid_last_used'};
      const next = {...prepared, updatedAt: prepared.updatedAt || new Date().toISOString()};
      if (!lastUsed(next)) return {saved: false, reason: 'invalid_last_used'};
      return publish('lastUsed', {value: next});
    }
    function setStandaloneBridge(key, bridgeData) {
      const prepared = stage(bridgeData, standaloneBridge);
      if (!canonical(key) || !prepared) return {saved: false, reason: 'invalid_bridge'};
      const existing = getStandaloneBridgeState(key);
      if (existing.status === 'corrupt' || existing.status === 'unsupported-version') return {saved: false, reason: existing.status};
      const res = publish('standalone-bridge', {key, value: prepared});
      if (res.saved && storage) {
        try { storage.setItem(STANDALONE_BRIDGE_PREFIX + encodeURIComponent(key), JSON.stringify(prepared)); refresh(); } catch { /* Committed op log already persisted atomically. */ }
      }
      return res;
    }
    function setStandaloneCheck(key, checkId, value) {
      const normalized = typeof value === 'boolean' ? {version: STANDALONE_VERSION, checked: value} : value;
      const prepared = stage(normalized, standaloneCheck);
      if (!canonical(key) || !validCheckId(checkId) || !prepared) return {saved: false, reason: 'invalid_check'};
      const existing = getStandaloneCheckState(key, checkId);
      if (existing.status === 'corrupt' || existing.status === 'unsupported-version') return {saved: false, reason: existing.status};
      const res = publish('standalone-check', {key, checkId, value: prepared});
      if (res.saved && storage) {
        try { storage.setItem(STANDALONE_CHECK_PREFIX + encodeURIComponent(key) + ':' + encodeURIComponent(checkId), JSON.stringify(prepared)); refresh(); } catch { /* Committed op log already persisted atomically. */ }
      }
      return res;
    }
    function replaceAll(candidate) {
      const prepared = stage(candidate, snapshot);
      if (!prepared) return {saved: false, reason: 'invalid_candidate'};
      return publish('replace', {value: prepared}, true);
    }
    function replaceBundle(candidate) {
      if (!object(candidate) || !safeTree(candidate)) return {saved: false, reason: 'invalid_candidate'};
      const preparedStudy = stage(candidate.studyState, snapshot);
      const preparedStandalone = stage(candidate.standalone || {bridges: {}, checks: {}}, x => standaloneBundle(x, false));
      if (!preparedStudy || !preparedStandalone) return {saved: false, reason: 'invalid_candidate'};
      const liveRead = refresh();
      if (liveRead.status === 'corrupt' || liveRead.status === 'unsupported-version') {
        return {saved: false, reason: liveRead.status, scope: 'journal'};
      }
      if (liveRead.standaloneStatus === 'corrupt' || liveRead.standaloneStatus === 'unsupported-version') {
        return {saved: false, reason: liveRead.standaloneStatus, scope: 'standalone'};
      }
      const standalonePayload = {bridges: preparedStandalone.bridges, checks: preparedStandalone.checks, baseline: clone(physDigests)};
      return publish('replace-bundle', {value: preparedStudy, standalone: standalonePayload}, true, candidate.expectedRevision);
    }
    function subscribe(listener) {
      if (typeof listener !== 'function') throw new TypeError('PortalStudyState.subscribe requires a function');
      subscribers.add(listener); return () => subscribers.delete(listener);
    }
    refresh();
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('storage', event => {
        if (event.key === null || event.key?.startsWith(PREFIX) || event.key?.startsWith(STANDALONE_BRIDGE_PREFIX) || event.key?.startsWith(STANDALONE_CHECK_PREFIX)) {
          refresh(); notify();
        }
      });
    }
    return {
      getSnapshot, getItem, getStatus, updateItem, setLastUsed, replaceAll, subscribe,
      getStandaloneSnapshot, getStandaloneStatus, getStandaloneBridgeState, getStandaloneBridge, setStandaloneBridge,
      getStandaloneCheckState, getStandaloneCheck, setStandaloneCheck, getRevisionToken, replaceBundle
    };
  }
  return {createStudyState, SCHEMA_VERSION};
});
