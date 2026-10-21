/* Content row revelation and safe deep-link navigation for Study Hub. */
(function () {
  function removeNotices() {
    document.querySelectorAll('.portal-nav-notice').forEach(el => el.remove());
  }

  function showUnavailableNotice(key) {
    removeNotices();
    const container = document.getElementById('materials') || document.querySelector('main');
    if (!container) return;

    const notice = document.createElement('div');
    notice.className = 'portal-nav-notice glass-panel p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 mb-6 text-right flex items-center justify-between gap-4';
    notice.setAttribute('role', 'alert');
    notice.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
          <i data-lucide="alert-triangle" class="w-5 h-5" aria-hidden="true"></i>
        </div>
        <div>
          <h4 class="text-xs sm:text-sm font-bold text-[var(--text-main)]">المحتوى المطلوب غير متوفر حالياً</h4>
          <p class="text-xs text-[var(--text-muted)]">قد يكون تم تحديث الرابط أو إزالة هذا المصدر من خطة المادة.</p>
        </div>
      </div>
      <a href="index.html" class="px-3.5 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-main)] hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1.5 flex-shrink-0">
        <span>العودة للرئيسية</span>
      </a>
    `;
    container.prepend(notice);
    if (window.PortalUI && typeof window.PortalUI.icons === 'function') {
      window.PortalUI.icons(notice);
    }
  }

  function showTaFilterNotice(entry, onReveal) {
    removeNotices();
    const container = document.getElementById('materials') || document.querySelector('main');
    if (!container) return;

    const notice = document.createElement('div');
    notice.className = 'portal-nav-notice glass-panel p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 mb-6 text-right flex flex-col sm:flex-row items-center justify-between gap-4';
    notice.setAttribute('role', 'status');
    notice.innerHTML = `
      <div class="flex items-center gap-3 text-right">
        <div class="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
          <i data-lucide="users" class="w-5 h-5" aria-hidden="true"></i>
        </div>
        <div>
          <h4 class="text-xs sm:text-sm font-bold text-[var(--text-main)]">هذا المصدر مخصص لمعيد آخر</h4>
          <p class="text-xs text-[var(--text-muted)]">تم رفع هذا الملف بواسطة <strong>${entry.ta}</strong>، بينما معيد سكشنك المعتمد مختلف. لم يتم تغيير مجموعتك أو سكشنك.</p>
        </div>
      </div>
      <button type="button" class="btn-reveal-hidden-ta px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 flex-shrink-0 cursor-pointer">
        <i data-lucide="eye" class="w-4 h-4" aria-hidden="true"></i>
        <span>عرض محتوى (${entry.ta}) والتوجه للمصدر</span>
      </button>
    `;
    const btn = notice.querySelector('.btn-reveal-hidden-ta');
    if (btn) {
      btn.addEventListener('click', () => {
        if (typeof onReveal === 'function') onReveal();
      });
    }
    container.prepend(notice);
    if (window.PortalUI && typeof window.PortalUI.icons === 'function') {
      window.PortalUI.icons(notice);
    }
  }

  function findRow(key) {
    const rows = document.querySelectorAll('[data-content-key]');
    for (const row of rows) {
      if (row.getAttribute('data-content-key') === key) {
        return row;
      }
    }
    return null;
  }

  async function reveal(key, options = {}) {
    const focus = options.focus !== false;
    if (!key || typeof key !== 'string') {
      return { found: false, reason: 'invalid_key' };
    }

    const catalog = window.PortalCatalog;
    const entry = catalog ? catalog.get(key) : null;
    if (!entry) {
      showUnavailableNotice(key);
      return { found: false, reason: 'not_found' };
    }

    // 1. Select the correct resource family in the UI
    if (window.PortalJourney && typeof window.PortalJourney.selectFamily === 'function') {
      window.PortalJourney.selectFamily(entry.kind, { push: false });
    } else {
      const trackBtn = document.querySelector(`[data-track="${entry.track}"]`);
      if (trackBtn) trackBtn.click();
    }

    // 2. Check if row is currently visible or hidden by TA filter
    let row = findRow(key);
    if (!row && entry.ta) {
      const staff = window.StudentProfile ? window.StudentProfile.getCourseStaff(entry.courseId) : null;
      const studentTa = staff?.ta;
      if (studentTa && entry.ta !== studentTa) {
        showTaFilterNotice(entry, async () => {
          window.PortalSubjectContent?.current?.showForEntry(entry);
          await new Promise(resolve => setTimeout(resolve, 50));
          const revealedRow = findRow(key);
          if (revealedRow) {
            removeNotices();
            scrollToAndFocus(revealedRow, focus);
          }
        });
        return { found: false, reason: 'hidden_by_ta_filter', ta: entry.ta };
      }
    }

    if (!row) {
      await new Promise(resolve => setTimeout(resolve, 60));
      row = findRow(key);
    }

    if (!row) {
      showUnavailableNotice(key);
      return { found: false, reason: 'row_not_found' };
    }

    removeNotices();
    scrollToAndFocus(row, focus);
    return { found: true, element: row };
  }

  function scrollToAndFocus(row, focus) {
    const header = document.querySelector('header');
    const navHeight = header ? header.getBoundingClientRect().height : 70;
    const rect = row.getBoundingClientRect();
    const targetTop = window.pageYOffset + rect.top - navHeight - 16;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });

    if (focus) {
      if (!row.hasAttribute('tabindex')) {
        row.setAttribute('tabindex', '-1');
      }
      row.focus({ preventScroll: true });
      row.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-2');
      setTimeout(() => {
        row.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-2');
      }, 2500);
    }
  }

  function init() {
    if (typeof window === 'undefined' || !window.location) return;
    if (!window.PortalContentLinks) return;

    function checkAndReveal() {
      const parsed = window.PortalContentLinks.parse(window.location);
      if (parsed.isValid && parsed.item) {
        reveal(parsed.item, { focus: true });
      } else if (new URLSearchParams(window.location.search).has('item')) showUnavailableNotice(parsed.item);
    }

    window.addEventListener('portal:content-ready', () => {
      checkAndReveal();
    });

    window.addEventListener('popstate', () => {
      checkAndReveal();
    });
  }

  const nav = {
    reveal,
    init
  };

  if (typeof window !== 'undefined') {
    window.PortalContentNavigation = nav;
    document.addEventListener('DOMContentLoaded', init);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      PortalContentNavigation: nav
    };
  }
})();
