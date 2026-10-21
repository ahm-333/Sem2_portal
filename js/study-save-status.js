/* Announce study-save failures in the current page or active dialog, never inert background. */
(function (root) {
  'use strict';
  const messages = {
    session: ['warning', 'التخزين المحلي غير متاح أو ممتلئ؛ تغييرات المذاكرة الحالية في ذاكرة الصفحة فقط، وستُفقد عند إغلاقها أو إعادة تحميلها.'],
    corrupt: ['danger', 'بيانات المذاكرة المحفوظة تالفة؛ تم إيقاف الحفظ لحماية النسخة الأصلية.'],
    'unsupported-version': ['warning', 'إصدار بيانات المذاكرة أحدث من هذا الموقع؛ تم إيقاف الحفظ لحماية النسخة الأصلية.']
  };
  let initialized = false, queued = false;
  function render(status) {
    const pageHost = document.getElementById('study-save-status');
    if (!pageHost) return;
    const dialog = [...document.querySelectorAll('[aria-modal="true"]')].find(el => !el.closest('[inert]') && el.getClientRects().length);
    let host = pageHost;
    if (dialog) {
      host = dialog.querySelector('[data-study-save-notice]');
      if (!host) {
        host = document.createElement('div');
        host.setAttribute('data-study-save-notice', '');
        host.setAttribute('role', 'status'); host.setAttribute('aria-live', 'polite'); host.setAttribute('aria-atomic', 'true');
        (dialog.querySelector('.glass-panel') || dialog).prepend(host);
      }
    }
    const message = messages[status];
    for (const notice of [pageHost, ...document.querySelectorAll('[data-study-save-notice]')]) notice.hidden = notice !== host || !message;
    if (!message || host.dataset.saveStatus === status) return;
    host.dataset.saveStatus = status;
    host.className = 'study-save-status study-save-status-' + message[0];
    host.replaceChildren();
    const content = document.createElement('div');
    content.className = 'study-save-status-content px-4 py-2.5 rounded-xl text-xs font-semibold';
    content.textContent = message[1]; host.append(content);
  }
  function init() {
    if (initialized || !root.PortalStudyState) return;
    initialized = true;
    const update = () => render(root.PortalStudyState.getStatus());
    root.PortalStudyState.subscribe(update); update();
    new root.MutationObserver(() => {
      if (queued) return;
      queued = true;
      Promise.resolve().then(() => {queued = false; update();});
    }).observe(document.body, {subtree: true, attributes: true, attributeFilter: ['aria-modal', 'inert']});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  root.PortalStudySaveStatus = {init, render};
})(typeof globalThis !== 'undefined' ? globalThis : this);
