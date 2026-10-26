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
  try {
    const parsed = JSON.parse(storage.getItem(bridgeKey));
    if (parsed !== null) {
      if (!parsed || parsed.version !== 1 || typeof parsed.anchor !== 'string' || (parsed.anchor && !/^[\w.-]+$/.test(parsed.anchor)) || typeof parsed.updatedAt !== 'string' || (parsed.updatedAt && !Number.isFinite(Date.parse(parsed.updatedAt))) || !Array.isArray(parsed.checks) || parsed.checks.some(id => typeof id !== 'string' || !/^[\w-]+$/.test(id)) || Object.keys(parsed).some(key => !['version', 'anchor', 'updatedAt', 'checks'].includes(key))) warning = 'corrupt';
      else bridge = parsed;
    }
  } catch { warning = 'corrupt'; }
  const bridgeCorrupt = warning === 'corrupt';
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
  function recordSection(anchor) {
    const sections = anchors();
    const index = sections.indexOf(anchor);
    if (index < 0) return false;
    const updatedAt = new Date().toISOString();
    result(state.updateItem(lesson.key, {reader: {slideId: index + 1, tab: 'explanation', updatedAt}}));
    bridge.anchor = anchor; bridge.updatedAt = updatedAt; saveBridge();
    result(state.setLastUsed({key: lesson.key, actionId: 'standalone-study', updatedAt}));
    return true;
  }
  function resume() {
    const sections = anchors();
    const number = Number(current.searchParams.get('section'));
    const explicitHash = current.hash.slice(1);
    const anchor = explicitHash || (Number.isSafeInteger(number) && number > 0 ? sections[number - 1] : bridge.anchor);
    const target = anchor && document.getElementById(anchor);
    if (!target) return false;
    if (anchor.startsWith('section-')) {
      const suffix = anchor.slice('section-'.length);
      const control = document.getElementById('tab-' + suffix) || [...document.querySelectorAll('.chapter-pill[data-target]')].find(button => button.dataset.target === suffix);
      if (control && (!target.getClientRects().length || !control.classList.contains('active'))) control.click();
    }
    target.scrollIntoView({block: 'start', behavior: 'instant'});
    recordSection(anchor);
    return true;
  }
  window.PortalStudySession = {module: lesson, recordSection, resume, status: () => warning || state.getStatus()};
  function start() {
    const item = state.getItem(lesson.key);
    if (!item?.startedAt) result(state.updateItem(lesson.key, {startedAt: new Date().toISOString()}));
    result(state.setLastUsed({key: lesson.key, actionId: 'standalone-study'}));
    warn(warning);
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
      const saved = storage.getItem(checkKey);
      if (saved !== null) checked = readCheck(saved);
      if (checked) button.click(); // Restore through the lesson's own completion control.
      button.setAttribute('aria-pressed', String(checked));
      button.addEventListener('click', () => {
        checked = !checked; button.setAttribute('aria-pressed', String(checked));
        if (replaying || corrupt) return;
        // Each completion control has its own atomic value: another tab cannot
        // overwrite an independent section with a stale whole-lesson snapshot.
        if (!storage.setItem(checkKey, JSON.stringify({version: 1, checked}))) warn('session');
      });
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
