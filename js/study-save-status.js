/**
 * Accessible Save Status Notification Component
 * Displays and screen-reader announces storage status conditions (session-only, corrupt, unsupported version)
 */
(function (root) {
  'use strict';

  function getHost() {
    return document.getElementById('study-save-status');
  }

  function render(status) {
    const host = getHost();
    if (!host) return;

    if (status === 'persistent') {
      host.hidden = true;
      host.innerHTML = '';
      return;
    }

    host.hidden = false;

    if (status === 'session') {
      host.className = 'study-save-status study-save-status-warning';
      host.innerHTML = `
        <div class="study-save-status-content flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold">
          <div class="flex items-center gap-2">
            <i data-lucide="alert-circle" class="w-4 h-4 shrink-0 text-amber-500" aria-hidden="true"></i>
            <span>التخزين المحلي غير متاح أو ممتلئ؛ يتم حفظ تقدمك في هذه الجلسة فقط.</span>
          </div>
        </div>
      `;
    } else if (status === 'corrupt') {
      host.className = 'study-save-status study-save-status-danger';
      host.innerHTML = `
        <div class="study-save-status-content flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold">
          <div class="flex items-center gap-2">
            <i data-lucide="alert-triangle" class="w-4 h-4 shrink-0 text-red-500" aria-hidden="true"></i>
            <span>بيانات المذاكرة المحفوظة تالفة؛ تم إيقاف الحفظ التلقائي لحمايتها.</span>
          </div>
        </div>
      `;
    } else if (status === 'unsupported-version') {
      host.className = 'study-save-status study-save-status-warning';
      host.innerHTML = `
        <div class="study-save-status-content flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold">
          <div class="flex items-center gap-2">
            <i data-lucide="info" class="w-4 h-4 shrink-0 text-amber-500" aria-hidden="true"></i>
            <span>إصدار بيانات المذاكرة أحدث من هذا الموقع؛ تم إيقاف الحفظ لمنع التعارض.</span>
          </div>
        </div>
      `;
    }

    if (root.lucide && typeof root.lucide.createIcons === 'function') {
      root.lucide.createIcons({ root: host });
    }
  }

  function init() {
    if (root.PortalStudyState) {
      root.PortalStudyState.subscribe(({ status }) => {
        render(status);
      });
      render(root.PortalStudyState.getStatus());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  const api = {
    init,
    render
  };

  root.PortalStudySaveStatus = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
