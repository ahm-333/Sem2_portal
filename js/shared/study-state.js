/* Study-only persistence: validate in memory, publish one immutable operation atomically.
 * Legacy v1 fields remain read-only input. No preference keys or old bytes are rewritten.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PortalStudyState = factory().createStudyState();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const SCHEMA_VERSION = 1;
  const PREFIX = 'sem2_study_v1:';
  const OPS = PREFIX + 'op:';
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
  function operation(value, id) {
    if (!fields(value, ['schemaVersion', 'clock', 'id', 'kind', 'key', 'patch', 'value']) || value.schemaVersion !== SCHEMA_VERSION || !Number.isSafeInteger(value.clock) || value.clock < 1 || value.id !== id) return false;
    if (value.kind === 'update') return canonical(value.key) && item(value.patch) && !own(value, 'value');
    if (value.kind === 'lastUsed') return lastUsed(value.value) && !own(value, 'key') && !own(value, 'patch');
    return value.kind === 'replace' && snapshot(value.value) && !own(value, 'key') && !own(value, 'patch');
  }
  function apply(state, op) {
    if (op.kind === 'replace') return clone(op.value);
    if (op.kind === 'lastUsed') state.lastUsed = clone(op.value);
    else state.items[op.key] = {...state.items[op.key], ...clone(op.patch)};
    return state;
  }
  function createStudyState(options = {}) {
    let storage = options.storage;
    if (!storage) {
      try { storage = typeof window !== 'undefined' ? window.localStorage : null; }
      catch { storage = null; }
    }
    const writer = globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    let sequence = 0, clock = 0, status = 'persistent', sessionOnly = false;
    let committed = {schemaVersion: SCHEMA_VERSION, items: {}}, pending = [];
    const subscribers = new Set();

    function readCommitted() {
      if (!storage) return {status: 'session'};
      try {
        const rawMeta = storage.getItem(PREFIX + 'meta');
        let state = {schemaVersion: SCHEMA_VERSION, items: {}};
        const ops = [], legacy = [];
        let maxClock = 0;
        if (rawMeta !== null) {
          const meta = JSON.parse(rawMeta);
          if (!object(meta) || !safeTree(meta)) return {status: 'corrupt'};
          if (meta.schemaVersion !== SCHEMA_VERSION) return {status: 'unsupported-version'};
          if (!fields(meta, ['schemaVersion', 'lastUsed']) || !optional(meta, 'lastUsed', x => x === null || lastUsed(x))) return {status: 'corrupt'};
          if (meta.lastUsed) state.lastUsed = clone(meta.lastUsed);
        }
        for (let i = 0; i < storage.length; i++) {
          const physical = storage.key(i);
          if (!physical?.startsWith(PREFIX) || physical === PREFIX + 'meta') continue;
          const raw = storage.getItem(physical);
          if (raw === null) continue;
          const value = JSON.parse(raw);
          if (!safeTree(value)) return {status: 'corrupt'};
          if (physical.startsWith(OPS)) {
            if (object(value) && own(value, 'schemaVersion') && value.schemaVersion !== SCHEMA_VERSION) return {status: 'unsupported-version'};
            if (!operation(value, physical.slice(OPS.length))) return {status: 'corrupt'};
            ops.push(value); maxClock = Math.max(maxClock, value.clock);
          } else {
            const match = physical.match(/^sem2_study_v1:item:(.+):(base|reader|quiz)$/);
            if (!match) return {status: 'corrupt'};
            const key = decodeURIComponent(match[1]);
            if (!canonical(key)) return {status: 'corrupt'};
            const part = match[2] === 'base' ? value : {[match[2]]: value};
            if (!item(part) || (match[2] === 'base' && Object.keys(part).some(k => !['startedAt', 'manualComplete'].includes(k)))) return {status: 'corrupt'};
            legacy.push({key, part});
          }
        }
        for (const {key, part} of legacy) state.items[key] = {...state.items[key], ...part};
        ops.sort((a, b) => a.clock - b.clock || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
        for (const op of ops) state = apply(state, op);
        return {status: 'persistent', state, maxClock};
      } catch (error) {
        return {status: error instanceof SyntaxError || error instanceof URIError ? 'corrupt' : 'session'};
      }
    }
    function refresh() {
      const read = readCommitted();
      if (read.state) { committed = read.state; clock = Math.max(clock, read.maxClock); }
      status = read.status === 'persistent' && sessionOnly ? 'session' : read.status;
    }
    function current() {
      let state = clone(committed);
      for (const op of pending) state = apply(state, op);
      return state;
    }
    function getSnapshot() { refresh(); return current(); }
    function getItem(key) {
      if (!canonical(key)) return null;
      const state = getSnapshot();
      return own(state.items, key) ? state.items[key] : null;
    }
    function getStatus() { refresh(); return status; }
    function notify() {
      const value = current();
      for (const listener of subscribers) {
        try { listener({snapshot: clone(value), status}); }
        catch (error) { console.error('PortalStudyState subscriber error:', error); }
      }
    }
    function publish(kind, payload, replace = false) {
      refresh();
      const op = {schemaVersion: SCHEMA_VERSION, clock: ++clock, id: writer + '.' + (++sequence), kind, ...payload};
      let raw;
      try {
        raw = JSON.stringify(op);
        const serialized = JSON.parse(raw);
        if (!safeTree(serialized) || !operation(serialized, op.id)) return {saved: false, reason: 'invalid_candidate'};
      } catch { return {saved: false, reason: 'invalid_candidate'}; }
      if (status === 'corrupt' || status === 'unsupported-version') {
        if (!replace) pending.push(op);
        notify(); return {saved: false, reason: status};
      }
      if (storage && (!sessionOnly || replace) && readCommitted().status === 'persistent') {
        try {
          // The sole publication point: a failed setItem leaves all active bytes intact.
          storage.setItem(OPS + op.id, raw);
          if (replace) {pending = []; sessionOnly = false;}
          refresh(); notify(); return {saved: true};
        } catch (error) {
          if (!replace) pending.push(op);
          sessionOnly = true; status = 'session';
          notify(); return {saved: false, reason: error?.name === 'QuotaExceededError' ? 'quota' : 'session'};
        }
      }
      if (!replace) pending.push(op);
      sessionOnly = true; status = 'session'; notify();
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
    function replaceAll(candidate) {
      const prepared = stage(candidate, snapshot);
      if (!prepared) return {saved: false, reason: 'invalid_candidate'};
      return publish('replace', {value: prepared}, true);
    }
    function subscribe(listener) {
      if (typeof listener !== 'function') throw new TypeError('PortalStudyState.subscribe requires a function');
      subscribers.add(listener); return () => subscribers.delete(listener);
    }
    refresh();
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('storage', event => {
        if (event.key === null || event.key?.startsWith(PREFIX)) {refresh(); notify();}
      });
    }
    return {getSnapshot, getItem, getStatus, updateItem, setLastUsed, replaceAll, subscribe};
  }
  return {createStudyState, SCHEMA_VERSION};
});
