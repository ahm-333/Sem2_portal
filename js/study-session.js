/* Standalone lessons share the portal's validated study history. */
(function () {
  'use strict';
  const current = new URL(window.location.href);
  const currentPath = current.pathname.endsWith('/') ? current.pathname + 'index.html' : current.pathname;
  const lesson = (window.PortalStudyModules || []).find(value => {
    const url = new URL(value.url, current.origin + '/');
    return currentPath.endsWith('/' + url.pathname.slice(1)) &&
      (!url.searchParams.has('unit') || (current.searchParams.get('unit') || 'os-01') === url.searchParams.get('unit'));
  });
  if (!lesson || !window.PortalStudyState || !window.PortalStorage) return;
  const state = window.PortalStudyState;
  const storage = window.PortalStorage;
  const bridgeKey = 'sem2_standalone_v1:' + encodeURIComponent(lesson.key);
  let bridge = {version: 1, anchor: '', updatedAt: '', checks: []};
  let warning = '';
  function normalizeBridge(raw) {
    return raw
      ? {
        version: 1,
        anchor: raw.anchor || '',
        updatedAt: raw.updatedAt || '',
        checks: Array.isArray(raw.checks) ? raw.checks.slice() : []
      }
      : {version: 1, anchor: '', updatedAt: '', checks: []};
  }
  const initialBridgeState = typeof state.getStandaloneBridgeState === 'function' ? state.getStandaloneBridgeState(lesson.key) : null;
  if (initialBridgeState) {
    if (initialBridgeState.status === 'corrupt' || initialBridgeState.status === 'unsupported-version') warning = 'corrupt';
    else if (initialBridgeState.status === 'ok' && initialBridgeState.bridge) {
      bridge = normalizeBridge(initialBridgeState.bridge);
    }
  } else {
    try {
      const parsed = JSON.parse(storage.getItem(bridgeKey));
      if (parsed !== null) {
        if (!parsed || parsed.version !== 1 || typeof parsed.anchor !== 'string' || (parsed.anchor && !/^[\w.-]+$/.test(parsed.anchor)) || typeof parsed.updatedAt !== 'string' || (parsed.updatedAt && !Number.isFinite(Date.parse(parsed.updatedAt))) || !Array.isArray(parsed.checks) || parsed.checks.some(id => typeof id !== 'string' || !/^[\w-]+$/.test(id)) || Object.keys(parsed).some(key => !['version', 'anchor', 'updatedAt', 'checks'].includes(key))) warning = 'corrupt';
        else bridge = parsed;
      }
    } catch { warning = 'corrupt'; }
  }
  let bridgeCorrupt = warning === 'corrupt';
  function syncBridgeFromState() {
    if (bridgeCorrupt || typeof state.getStandaloneBridgeState !== 'function') return;
    const live = state.getStandaloneBridgeState(lesson.key);
    if (live.status === 'corrupt' || live.status === 'unsupported-version') {
      bridgeCorrupt = true;
      warn('corrupt');
      return;
    }
    bridge = normalizeBridge(live.status === 'ok' ? live.bridge : null);
  }
  function warn(reason) {
    warning = reason || warning;
    if (!warning || !document.body) return;
    let notice = document.getElementById('study-session-warning');
    if (!notice) {
      notice = document.createElement('p'); notice.id = 'study-session-warning'; notice.setAttribute('role', 'status');
      notice.style.cssText = 'padding:12px;margin:12px;background:#fff3cd;color:#513c06;border:1px solid #8c6d1f;border-radius:8px';
      document.body.prepend(notice);
    }
    notice.textContent = warning === 'corrupt' ? 'بيانات متابعة الدرس المحفوظة مش سليمة. متابعتك الحالية للجلسة دي فقط، والبيانات القديمة محفوظة بدون تغيير.' : 'الحفظ الدائم مش متاح دلوقتي. متابعتك الحالية للجلسة دي فقط، وممكن تختفي بعد قفل الصفحة.';
  }
  function saveBridge() {
    if (bridgeCorrupt) { warn('corrupt'); return false; }
    if (typeof state.setStandaloneBridge === 'function') {
      const res = state.setStandaloneBridge(lesson.key, bridge);
      if (!res?.saved) warn(res?.reason === 'corrupt' || res?.reason === 'unsupported-version' ? 'corrupt' : 'session');
      return Boolean(res?.saved);
    }
    const saved = storage.setItem(bridgeKey, JSON.stringify(bridge));
    if (!saved) warn('session');
    return saved;
  }
  function result(value) { if (!value?.saved) warn(value?.reason || 'session'); return value; }
  function anchors() {
    const ids = new Set();
    for (const link of document.querySelectorAll('a[href^="#"]')) {
      const id = link.getAttribute('href').slice(1);
      if (id && document.getElementById(id)) ids.add(id);
    }
    for (const section of document.querySelectorAll('section[id]')) ids.add(section.id);
    return [...ids];
  }
  const isDb = lesson?.courseId === 'database-systems';
  function recordSection(anchor) {
    const sections = anchors();
    const index = sections.indexOf(anchor);
    if (index < 0 && !document.getElementById(anchor)) return false;
    const updatedAt = new Date().toISOString();
    const loc = window.PortalLessonLocation;
    const bridgeAnchor = (isDb && loc ? loc.formatBridgeAnchor('topic', anchor) : anchor);
    if (isDb) {
      // Zero means no saved slide. The topic position belongs to the bridge.
      const slideId = state.getItem(lesson.key)?.reader?.slideId ?? 0;
      result(state.updateItem(lesson.key, { reader: { slideId, tab: 'explanation', updatedAt } }));
    } else {
      result(state.updateItem(lesson.key, {reader: {slideId: index + 1, tab: 'explanation', updatedAt}}));
    }
    syncBridgeFromState();
    bridge.anchor = bridgeAnchor; bridge.updatedAt = updatedAt; saveBridge();
    result(state.setLastUsed({key: lesson.key, actionId: 'standalone-study', updatedAt}));
    return true;
  }
  function resume() {
    const sections = anchors();
    const number = Number(current.searchParams.get('section'));
    const explicitHash = current.hash.slice(1);
    const anchor = explicitHash || (Number.isSafeInteger(number) && number > 0 ? sections[number - 1] : bridge.anchor);
    const target = anchor && (document.getElementById(anchor) || (isDb && anchor.startsWith('topic-') ? document.getElementById(anchor.slice(6)) : null));
    if (!target) return false;
    const effectiveId = target.id;
    if (effectiveId.startsWith('section-')) {
      const suffix = effectiveId.slice('section-'.length);
      const control = document.getElementById('tab-' + suffix) || [...document.querySelectorAll('.chapter-pill[data-target]')].find(button => button.dataset.target === suffix);
      if (control && (!target.getClientRects().length || !control.classList.contains('active'))) control.click();
    }
    target.scrollIntoView({block: 'start', behavior: 'instant'});
    recordSection(effectiveId);
    return true;
  }
  window.PortalStudySession = {module: lesson, recordSection, resume, status: () => warning || state.getStatus()};
  function start() {
    const item = state.getItem(lesson.key);
    if (!item?.startedAt) result(state.updateItem(lesson.key, {startedAt: new Date().toISOString()}));
    result(state.setLastUsed({key: lesson.key, actionId: 'standalone-study'}));
    warn(warning);
    syncBridgeFromState();
    if (typeof state.subscribe === 'function') state.subscribe(syncBridgeFromState);
    for (const button of document.querySelectorAll('.check-sec-btn[data-check]')) {
      const id = button.dataset.check;
      const checkKey = 'sem2_standalone_check_v1:' + encodeURIComponent(lesson.key) + ':' + encodeURIComponent(id);
      let checked = bridge.checks.includes(id);
      let replaying = false, corrupt = bridgeCorrupt;
      function readCheck(raw) {
        if (raw === null) return false;
        try {
          const value = JSON.parse(raw);
          if (value?.version !== 1 || typeof value.checked !== 'boolean' || Object.keys(value).some(key => !['version', 'checked'].includes(key))) throw new TypeError('Invalid completion');
          return value.checked;
        } catch { corrupt = true; warn('corrupt'); return checked; }
      }
      const savedState = typeof state.getStandaloneCheckState === 'function' ? state.getStandaloneCheckState(lesson.key, id) : null;
      if (savedState) {
        if (savedState.status === 'corrupt' || savedState.status === 'unsupported-version') { corrupt = true; warn('corrupt'); }
        else if (savedState.status === 'ok' && savedState.check) checked = savedState.check.checked;
      } else {
        const saved = storage.getItem(checkKey);
        if (saved !== null) checked = readCheck(saved);
      }
      if (checked) button.click(); // Restore through the lesson's own completion control.
      button.setAttribute('aria-pressed', String(checked));
      button.addEventListener('click', () => {
        checked = !checked; button.setAttribute('aria-pressed', String(checked));
        if (replaying || corrupt) return;
        // Each completion control has its own atomic value: another tab cannot
        // overwrite an independent section with a stale whole-lesson snapshot.
        if (typeof state.setStandaloneCheck === 'function') {
          const res = state.setStandaloneCheck(lesson.key, id, checked);
          if (!res?.saved) warn(res?.reason === 'corrupt' || res?.reason === 'unsupported-version' ? 'corrupt' : 'session');
        } else if (!storage.setItem(checkKey, JSON.stringify({version: 1, checked}))) {
          warn('session');
        }
      });
      if (typeof state.subscribe === 'function') {
        state.subscribe(() => {
          if (corrupt) return;
          const liveState = state.getStandaloneCheckState(lesson.key, id);
          if (liveState.status === 'corrupt' || liveState.status === 'unsupported-version') {
            corrupt = true; warn('corrupt'); return;
          }
          const next = liveState.status === 'ok' && liveState.check ? liveState.check.checked : bridge.checks.includes(id);
          if (next !== checked) { replaying = true; button.click(); replaying = false; }
        });
      }
      window.addEventListener('storage', event => {
        if (event.key !== checkKey && event.key !== null) return;
        const next = readCheck(event.key === null ? null : event.newValue);
        if (next !== checked) { replaying = true; button.click(); replaying = false; }
      });
    }
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (link) recordSection(link.getAttribute('href').slice(1));
      const tab = event.target.closest('.nav-tab[id^="tab-"],.chapter-pill[data-target]');
      if (tab) recordSection('section-' + (tab.dataset.target || tab.id.slice(4)));
    });
    window.addEventListener('hashchange', () => recordSection(window.location.hash.slice(1)));
    let scrollTimer;
    function rememberVisibleSection() {
      const visible = anchors().map(id => ({id, rect: document.getElementById(id).getBoundingClientRect()}))
        .filter(value => value.rect.height > 0 && value.rect.top < window.innerHeight * .6 && value.rect.bottom > 120)
        .sort((a, b) => b.rect.top - a.rect.top)[0];
      if (visible && visible.id !== bridge.anchor) recordSection(visible.id);
    }
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer); scrollTimer = setTimeout(rememberVisibleSection, 160);
    }, {passive: true});
    let restored = false;
    function restore() {
      if (restored) return;
      restored = resume();
    }
    requestAnimationFrame(() => requestAnimationFrame(restore));
    // The OS renderer loads its local lesson asynchronously after DOMContentLoaded.
    const observer = new MutationObserver(() => {
      if (!restored && (current.hash || current.searchParams.has('section') || bridge.anchor)) restore();
    });
    observer.observe(document.body, {childList: true, subtree: true});
    window.addEventListener('pagehide', () => { clearTimeout(scrollTimer); observer.disconnect(); }, {once: true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
