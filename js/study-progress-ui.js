/* User interface for study progress: course summary and row status controls.
 * Ensures WCAG 2.2 AA accessibility, keyboard operability, and theme synchronization.
 */
(function (root) {
  'use strict';

  function createProgressUI() {
    function getProgressService() {
      return root.PortalStudyProgress || null;
    }

    function statusLabel(status) {
      switch (status) {
        case 'completed': return 'مكتمل';
        case 'in-progress': return 'جارٍ';
        default: return 'لم يبدأ';
      }
    }

    function renderCourseSummary(container, courseId, explicitProfile) {
      const service = getProgressService();
      if (!service || !container) return;

      const summary = service.getCourseSummary(courseId, explicitProfile);

      const percentChip = container.querySelector('#atlas-progress-percent-chip');
      if (percentChip) percentChip.textContent = summary.percent + '%';

      const quickVal = document.querySelector('#atlas-course-progress-badge .atlas-progress-quick-val');
      if (quickVal) quickVal.textContent = summary.percent + '%';

      const barFill = container.querySelector('.atlas-progress-bar-fill');
      if (barFill) barFill.style.width = summary.percent + '%';

      const meter = container.querySelector('.atlas-progress-bar-container');
      if (meter) meter.setAttribute('aria-valuenow', String(summary.percent));

      const scopeEl = container.querySelector('#atlas-progress-scope');
      if (scopeEl) scopeEl.textContent = summary.scope;

      const lecCard = container.querySelector('#atlas-progress-lectures-card');
      if (lecCard) {
        lecCard.innerHTML = `
          <h4>المحاضرات المنشورة</h4>
          <p class="atlas-card-stats"><strong class="atlas-card-completed">${summary.lectures.completed}</strong> من ${summary.lectures.total} مكتملة</p>
          <small class="atlas-card-remaining">متبقي: ${summary.lectures.remaining}</small>
        `;
      }

      const secCard = container.querySelector('#atlas-progress-sections-card');
      if (secCard) {
        secCard.innerHTML = `
          <h4>السكاشن المنشورة (حسب سكشنك)</h4>
          <p class="atlas-card-stats"><strong class="atlas-card-completed">${summary.sections.completed}</strong> من ${summary.sections.total} مكتملة</p>
          <small class="atlas-card-remaining">متبقي: ${summary.sections.remaining}</small>
        `;
      }
    }

    function decorateRow(row) {
      const service = getProgressService();
      if (!service || !row) return;

      const key = row.getAttribute('data-content-key') || row.dataset.contentKey;
      if (!key) return;

      // Only decorate lecture and section rows
      try {
        const parts = JSON.parse(key);
        if (!Array.isArray(parts) || !['lecture', 'section'].includes(parts[1])) return;
      } catch { return; }

      const progress = service.getItemProgress(key);

      // 1. Badge in row copy
      const copy = row.querySelector('.a1-source-copy');
      if (copy) {
        let badge = copy.querySelector('.atlas-progress-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'atlas-progress-badge';
          badge.setAttribute('role', 'status');
          const meta = copy.querySelector('.a1-source-meta');
          if (meta) meta.before(badge);
          else copy.append(badge);
        }
        const cls = `atlas-progress-badge status-${progress.status}`;
        if (badge.className !== cls) badge.className = cls;
        const txt = statusLabel(progress.status);
        if (badge.textContent !== txt) badge.textContent = txt;
      }

      // 2. Action button in actions
      const actions = row.querySelector('.a1-source-actions');
      if (actions) {
        let btn = actions.querySelector('[data-progress-manual]');
        if (progress.canManualComplete) {
          if (!btn) {
            btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'atlas-manual-complete-btn';
            btn.dataset.progressManual = key;
            actions.prepend(btn);
          }
          const pressed = String(progress.isComplete);
          if (btn.getAttribute('aria-pressed') !== pressed) btn.setAttribute('aria-pressed', pressed);
          btn.classList.toggle('is-complete', progress.isComplete);
          const btnTxt = progress.isComplete ? '✓ مكتمل' : 'تحديد كمكتمل';
          if (btn.textContent !== btnTxt) btn.textContent = btnTxt;
          const ariaLabel = progress.isComplete ? 'تراجع عن اكتمال هذا المحتوى' : 'تحديد هذا المحتوى كمكتمل';
          if (btn.getAttribute('aria-label') !== ariaLabel) btn.setAttribute('aria-label', ariaLabel);
        } else if (btn) {
          btn.remove();
        }
      }
    }

    function decorateAllRows(rootElement = document) {
      const rows = rootElement.querySelectorAll('#lectures-list .a1-source-row, #sections-list .a1-source-row');
      rows.forEach(decorateRow);
    }

    function init(options = {}) {
      const courseId = options.courseId || new URL(window.location.href).searchParams.get('id');
      const progressPanel = document.getElementById('atlas-course-progress-panel');

      function updateAll() {
        if (progressPanel && courseId) {
          renderCourseSummary(progressPanel, courseId);
        }
        decorateAllRows();
      }

      // Event delegation for manual complete buttons
      document.addEventListener('click', event => {
        const btn = event.target.closest('[data-progress-manual]');
        if (!btn) return;
        const key = btn.dataset.progressManual;
        const isPressed = btn.getAttribute('aria-pressed') === 'true';
        const service = getProgressService();
        if (service) {
          service.setManualComplete(key, !isPressed);
        }
      });

      // Synchronize with state changes
      window.addEventListener('portal:progress-changed', updateAll);
      window.addEventListener('studentProfileChanged', updateAll);
      window.addEventListener('portal:content-ready', () => {
        decorateAllRows();
        if (progressPanel && courseId) renderCourseSummary(progressPanel, courseId);
      });
      window.addEventListener('portal:family-changed', () => decorateAllRows());
      window.addEventListener('storage', event => {
        if (event.key && event.key.startsWith('sem2_study_v1:')) {
          updateAll();
        }
      });

      const service = getProgressService();
      if (service && typeof service.subscribe === 'function') {
        service.subscribe(updateAll);
      }

      updateAll();
    }

    return {
      statusLabel,
      renderCourseSummary,
      decorateRow,
      decorateAllRows,
      init
    };
  }

  const defaultUI = createProgressUI();
  root.PortalStudyProgressUI = defaultUI;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortalStudyProgressUI: defaultUI, createProgressUI };
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
