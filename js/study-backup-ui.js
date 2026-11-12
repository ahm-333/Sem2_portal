/* Accessible modal UI for Study Backup export, inspection, preview, and atomic restore. */
(function () {
  'use strict';

  let stagedBytes = null;
  let stagedPreview = null;
  let readSequence = 0;

  function escapeText(value) {
    return String(value ?? '');
  }

  function formatTimestamp(iso) {
    if (!iso) return 'غير محدد';
    const ms = Date.parse(iso);
    if (!Number.isFinite(ms)) return escapeText(iso);
    try {
      return new Intl.DateTimeFormat('ar-EG', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(ms));
    } catch {
      return iso.slice(0, 16).replace('T', ' ');
    }
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 بايت';
    if (bytes < 1024) return bytes + ' بايت';
    return (bytes / 1024).toFixed(1) + ' كيلوبايت';
  }

  function injectBackupModalHTML() {
    if (document.getElementById('study-backup-modal')) return;

    const modalHTML = `
      <div id="study-backup-modal" class="backup-modal-overlay hidden" aria-hidden="true">
        <div class="backup-modal-box" id="study-backup-box">
          <div class="backup-modal-header">
            <div class="backup-modal-title-wrap">
              <span class="backup-modal-icon" aria-hidden="true">
                <i data-lucide="archive" class="w-5 h-5"></i>
              </span>
              <div>
                <h2 id="study-backup-modal-heading">النسخة الاحتياطية لتقدم المذاكرة</h2>
                <p class="backup-modal-subtitle">صدّر سجل المذاكرة والاختبارات في ملف محلي أو استرجعه بعد المعاينة.</p>
              </div>
            </div>
            <button type="button" id="close-backup-modal" class="backup-close-btn" aria-label="إغلاق نافذة النسخ الاحتياطي">
              <i data-lucide="x" class="w-5 h-5" aria-hidden="true"></i>
            </button>
          </div>

          <div data-study-save-notice role="status" aria-live="polite" aria-atomic="true" hidden></div>
          <div id="backup-status-banner" class="backup-status" role="status" aria-live="polite" tabindex="-1" hidden></div>

          <div class="backup-modal-body">
            <section class="backup-card" aria-labelledby="backup-current-heading">
              <div class="backup-card-head">
                <h3 id="backup-current-heading">الحالة الحالية على المتصفح</h3>
                <span id="backup-storage-pill" class="backup-storage-pill">متاح</span>
              </div>
              <div id="backup-current-summary" class="backup-metrics-grid"></div>
            </section>

            <section class="backup-card" aria-labelledby="backup-export-heading">
              <h3 id="backup-export-heading">1. تحميل نسخة احتياطية</h3>
              <p class="backup-card-desc">يحفظ التقدم الحالي وسجل الاختبارات ومواضع الدروس وعلامات الأقسام في ملف واحد بحد أقصى 1 ميجابايت.</p>
              <button type="button" id="backup-export-btn" class="backup-btn-primary">
                <i data-lucide="download" class="w-4 h-4" aria-hidden="true"></i>
                <span>تحميل النسخة الاحتياطية</span>
              </button>
            </section>

            <section class="backup-card" aria-labelledby="backup-restore-heading">
              <h3 id="backup-restore-heading">2. استرجاع نسخة من ملف</h3>
              <p class="backup-card-desc">اختر ملف نسخة احتياطية بصيغة قياسية للمعاينة أولًا. لن يتغير أي شيء قبل تأكيدك اليدوي.</p>
              <div class="backup-file-field">
                <label for="backup-file-input" class="backup-file-label">ملف النسخة الاحتياطية (JSON بحد أقصى 1 ميجابايت)</label>
                <input id="backup-file-input" type="file" accept=".json,application/json" class="backup-file-input">
              </div>

              <div id="backup-preview-panel" class="backup-preview-box" hidden>
                <div class="backup-warning-box" role="note">
                  <i data-lucide="alert-triangle" class="w-4 h-4" aria-hidden="true"></i>
                  <span>تحذير: عند التأكيد سيتم استبدال سجل المذاكرة ومواضع الدروس وعلامات الأقسام الحالية بمحتوى الملف فقط، ولن تتأثر بيانات الشعبة أو الثيم أو المؤقت.</span>
                </div>
                <p id="backup-preview-meta" class="backup-preview-meta"></p>
                <p id="backup-preview-notes" class="backup-preview-notes" hidden></p>
                <div class="backup-compare-wrap">
                  <table class="backup-compare-table">
                    <thead>
                      <tr>
                        <th scope="col">العنصر</th>
                        <th scope="col">الحالي على جهازك</th>
                        <th scope="col">الموجود في الملف</th>
                      </tr>
                    </thead>
                    <tbody id="backup-compare-body"></tbody>
                  </table>
                </div>
                <div class="backup-confirm-actions">
                  <button type="button" id="backup-confirm-restore-btn" class="backup-btn-primary">
                    <i data-lucide="rotate-ccw" class="w-4 h-4" aria-hidden="true"></i>
                    <span>تأكيد الاسترجاع الآن</span>
                  </button>
                  <button type="button" id="backup-cancel-restore-btn" class="backup-btn-secondary">إلغاء</button>
                </div>
              </div>
            </section>

            <details class="backup-manifest-details" open>
              <summary>نطاق النسخة الاحتياطية وما يتم استثناؤه</summary>
              <div id="backup-manifest-grid" class="backup-manifest-grid"></div>
            </details>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    if (window.PortalUI && typeof window.PortalUI.icons === 'function') {
      window.PortalUI.icons(document.getElementById('study-backup-modal'));
    }
  }

  function showStatus(tone, text, moveFocus = false) {
    const banner = document.getElementById('backup-status-banner');
    if (!banner) return;
    banner.className = 'backup-status backup-status-' + (tone || 'info');
    banner.textContent = text;
    banner.hidden = false;
    if (moveFocus) {
      banner.focus({ preventScroll: true });
    }
  }

  function clearStatus() {
    const banner = document.getElementById('backup-status-banner');
    if (!banner) return;
    banner.hidden = true;
    banner.textContent = '';
    banner.className = 'backup-status';
  }

  function clearStagedPreview() {
    stagedBytes = null;
    stagedPreview = null;
    const panel = document.getElementById('backup-preview-panel');
    const notes = document.getElementById('backup-preview-notes');
    const body = document.getElementById('backup-compare-body');
    const input = document.getElementById('backup-file-input');
    const confirmBtn = document.getElementById('backup-confirm-restore-btn');
    if (panel) panel.hidden = true;
    if (notes) {
      notes.hidden = true;
      notes.textContent = '';
    }
    if (body) body.innerHTML = '';
    if (input) input.value = '';
    if (confirmBtn) {
      const span = confirmBtn.querySelector('span');
      if (span) span.textContent = 'تأكيد الاسترجاع الآن';
    }
  }

  function metricCard(label, value) {
    const div = document.createElement('div');
    div.className = 'backup-metric-item';
    const strong = document.createElement('strong');
    strong.textContent = String(value);
    const span = document.createElement('span');
    span.textContent = label;
    div.append(strong, span);
    return div;
  }

  function renderManifest() {
    const service = window.PortalStudyBackup;
    const grid = document.getElementById('backup-manifest-grid');
    if (!service || !grid) return;
    const manifest = service.getCoverageManifest();
    grid.innerHTML = '';

    const buildColumn = (title, entries, className) => {
      const box = document.createElement('div');
      box.className = 'backup-manifest-col ' + className;
      const heading = document.createElement('h4');
      heading.textContent = title;
      const list = document.createElement('ul');
      for (const entry of entries) {
        const li = document.createElement('li');
        const label = document.createElement('span');
        label.textContent = entry.label;
        const code = document.createElement('code');
        code.setAttribute('dir', 'ltr');
        code.textContent = entry.keys.join(' ، ');
        li.append(label, code);
        list.appendChild(li);
      }
      box.append(heading, list);
      return box;
    };

    grid.append(
      buildColumn('بيانات مشمولة في النسخة:', manifest.included, 'backup-manifest-included'),
      buildColumn('بيانات مستثناة (تظل كما هي):', manifest.excluded, 'backup-manifest-excluded')
    );
  }

  function refreshCurrentSummary() {
    const service = window.PortalStudyBackup;
    const container = document.getElementById('backup-current-summary');
    const pill = document.getElementById('backup-storage-pill');
    const exportBtn = document.getElementById('backup-export-btn');
    const fileInput = document.getElementById('backup-file-input');
    const confirmBtn = document.getElementById('backup-confirm-restore-btn');
    if (!service || !container) return;

    const status = service.getStatusSummary();
    container.innerHTML = '';

    if (!status.ok) {
      if (pill) {
        pill.textContent = 'متوقف لحماية البيانات';
        pill.className = 'backup-storage-pill is-danger';
      }
      if (exportBtn) exportBtn.disabled = true;
      if (fileInput) fileInput.disabled = true;
      if (confirmBtn) confirmBtn.disabled = true;
      showStatus('error', status.message || 'البيانات الحالية غير سليمة وتم إيقاف التعديل.');
      return status;
    }

    if (exportBtn) exportBtn.disabled = false;
    if (fileInput) fileInput.disabled = false;
    if (confirmBtn) confirmBtn.disabled = false;

    if (pill) {
      pill.textContent = status.writable ? 'حفظ دائم جاهز' : 'وضع الجلسة المؤقتة (التصدير فقط)';
      pill.className = 'backup-storage-pill ' + (status.writable ? 'is-ok' : 'is-warn');
    }

    const s = status.summary;
    container.append(
      metricCard('دروس مبدوءة', s.startedCount),
      metricCard('دروس مكتملة', s.completedCount),
      metricCard('مواضع القراءة', s.readerCount),
      metricCard('اختبارات محفوظة', s.quizCount),
      metricCard('مواضع مستقلة', s.bridgeCount),
      metricCard('علامات الأقسام', s.checkCount)
    );
    return status;
  }

  function renderPreview(preview) {
    const panel = document.getElementById('backup-preview-panel');
    const meta = document.getElementById('backup-preview-meta');
    const notes = document.getElementById('backup-preview-notes');
    const tbody = document.getElementById('backup-compare-body');
    if (!panel || !meta || !tbody || !preview) return;

    const cur = preview.current || {
      itemCount: 0,
      completedCount: 0,
      readerCount: 0,
      quizCount: 0,
      bridgeCount: 0,
      checkCount: 0,
      orphanCount: 0
    };
    const inc = preview.incoming;
    meta.textContent = 'تاريخ إنشاء النسخة: ' + formatTimestamp(preview.exportedAt) +
      ' — إصدار التنسيق v' + (preview.formatVersion || 1) +
      ' (مخطط السجل v' + (preview.schemaVersion || 1) + ')';

    const warnings = [];
    if (inc.staleQuizCount > 0) {
      warnings.push('يحتوي الملف على ' + inc.staleQuizCount + ' اختبار من إصدار أسئلة سابق؛ سيتم الاحتفاظ بالدرجات المكتملة ومسح المسودة غير المتطابقة.');
    }
    if (inc.orphanCount > 0) {
      warnings.push('يحتوي الملف على ' + inc.orphanCount + ' سجل غير منشور حاليًا وسيُحفظ بأمان دون إظهاره في الإجماليات.');
    }
    if (warnings.length) {
      notes.textContent = warnings.join(' ');
      notes.hidden = false;
    } else {
      notes.textContent = '';
      notes.hidden = true;
    }

    tbody.innerHTML = '';
    const rows = [
      ['الدروس المسجلة', cur.itemCount, inc.itemCount],
      ['الدروس المكتملة', cur.completedCount, inc.completedCount],
      ['مواضع القراءة', cur.readerCount || 0, inc.readerCount || 0],
      ['سجلات الكويز', cur.quizCount, inc.quizCount],
      ['مواضع الدروس المستقلة', cur.bridgeCount, inc.bridgeCount],
      ['علامات الأقسام المحلية', cur.checkCount, inc.checkCount]
    ];
    if ((cur.orphanCount || 0) > 0 || (inc.orphanCount || 0) > 0) {
      rows.push(['سجلات غير منشورة', cur.orphanCount || 0, inc.orphanCount || 0]);
    }
    for (const [label, curVal, incVal] of rows) {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.setAttribute('scope', 'row');
      th.textContent = label;
      const tdCur = document.createElement('td');
      tdCur.textContent = String(curVal);
      const tdInc = document.createElement('td');
      tdInc.textContent = String(incVal);
      tr.append(th, tdCur, tdInc);
      tbody.appendChild(tr);
    }

    panel.hidden = false;
    if (window.PortalUI && typeof window.PortalUI.icons === 'function') {
      window.PortalUI.icons(panel);
    }
  }

  function handleExport() {
    const service = window.PortalStudyBackup;
    if (!service) return;
    const res = service.exportBackup();
    if (!res.ok) {
      showStatus('error', res.message || 'تعذر إنشاء النسخة الاحتياطية.', true);
      refreshCurrentSummary();
      return;
    }

    if (typeof globalThis.Blob === 'function' && globalThis.URL && typeof globalThis.URL.createObjectURL === 'function') {
      const blob = new globalThis.Blob([res.json], { type: 'application/json;charset=utf-8' });
      const href = globalThis.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = res.fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        link.remove();
        if (typeof globalThis.URL.revokeObjectURL === 'function') {
          globalThis.URL.revokeObjectURL(href);
        }
      }, 1000);
    }

    showStatus('success', 'تم تجهيز وتحميل النسخة الاحتياطية (' + res.fileName + ' — ' + formatBytes(res.bytes) + ').');
  }

  function readFileBytes(file) {
    if (typeof file.arrayBuffer === 'function') {
      return file.arrayBuffer().then(buf => new Uint8Array(buf));
    }
    return new Promise((resolve, reject) => {
      if (typeof globalThis.FileReader !== 'function') {
        reject(new Error('FileReader unavailable'));
        return;
      }
      const reader = new globalThis.FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result));
      reader.onerror = () => reject(reader.error || new Error('File read error'));
      reader.readAsArrayBuffer(file);
    });
  }

  async function handleFileSelect(event) {
    const service = window.PortalStudyBackup;
    const input = event.target;
    const file = input?.files?.[0];
    const token = ++readSequence;

    stagedBytes = null;
    stagedPreview = null;
    const panel = document.getElementById('backup-preview-panel');
    if (panel) panel.hidden = true;

    if (!file || !service) return;

    // Pre-read byte limit before loading large files into memory.
    if (typeof file.size === 'number' && file.size > service.MAX_BYTES) {
      if (input) input.value = '';
      showStatus('error', 'حجم الملف أكبر من الحد المسموح (1 ميجابايت). تم رفض الملف لحماية المتصفح.', true);
      return;
    }
    if (file.size === 0) {
      if (input) input.value = '';
      showStatus('error', 'الملف المختار فاضي ولا يحتوي على نسخة احتياطية.', true);
      return;
    }

    let bytes;
    try {
      bytes = await readFileBytes(file);
    } catch {
      if (token === readSequence) {
        if (input) input.value = '';
        showStatus('error', 'تعذر قراءة الملف المختار.', true);
      }
      return;
    }
    if (token !== readSequence) return;

    const inspected = service.inspectBackup(bytes);
    if (!inspected.ok) {
      if (input) input.value = '';
      showStatus('error', inspected.message || 'الملف غير صالح وتم رفضه بدون تغيير أي بيانات.', true);
      return;
    }

    stagedBytes = bytes;
    stagedPreview = inspected.preview;
    renderPreview(stagedPreview);
    clearStatus();
    showStatus('info', 'تمت قراءة الملف ومعاينته بنجاح. راجع المقارنة ثم اضغط "تأكيد الاسترجاع الآن" للتطبيق.');
    const confirmBtn = document.getElementById('backup-confirm-restore-btn');
    if (confirmBtn) confirmBtn.focus({ preventScroll: true });
  }

  function handleConfirmRestore() {
    const service = window.PortalStudyBackup;
    if (!service || !stagedBytes || !stagedPreview) return;

    const res = service.restoreBackup(stagedBytes, {
      confirmed: true,
      expectedRevision: stagedPreview.revisionToken
    });

    if (!res.restored) {
      if (res.reason === 'concurrent_change' && res.refreshedPreview) {
        stagedPreview = res.refreshedPreview;
        renderPreview(stagedPreview);
        refreshCurrentSummary();
        const confirmBtn = document.getElementById('backup-confirm-restore-btn');
        const span = confirmBtn?.querySelector('span');
        if (span) span.textContent = 'تأكيد الاسترجاع بعد التحديث';
        showStatus('warning', res.message || 'حصل تعديل جديد في تبويب آخر أثناء المعاينة. راجع الأرقام المحدّثة ثم أكد لو أردت الاستبدال.', true);
        return;
      }
      refreshCurrentSummary();
      showStatus('error', res.message || 'تعذر إتمام الاسترجاع، وظلت بياناتك الحالية بدون أي تغيير.', true);
      return;
    }

    clearStagedPreview();
    refreshCurrentSummary();
    showStatus('success', 'تم استرجاع النسخة الاحتياطية بنجاح مع الحفاظ على الشعبة والثيم وبيانات الجلسة.', true);
    window.dispatchEvent(new CustomEvent('portal:study-backup-restored', { detail: res }));
  }

  function openModal() {
    injectBackupModalHTML();
    const modal = document.getElementById('study-backup-modal');
    if (!modal || !window.PortalDialog) return;

    clearStagedPreview();
    clearStatus();
    renderManifest();
    refreshCurrentSummary();

    modal.setAttribute('aria-hidden', 'false');
    window.PortalDialog.open(modal, {
      initialFocus: '#close-backup-modal',
      onClose: () => {
        readSequence++;
        clearStagedPreview();
        modal.setAttribute('aria-hidden', 'true');
      }
    });
    if (window.PortalUI && typeof window.PortalUI.icons === 'function') {
      window.PortalUI.icons(modal);
    }
  }

  function closeModal() {
    const modal = document.getElementById('study-backup-modal');
    if (!modal || !window.PortalDialog) return;
    window.PortalDialog.close(modal);
  }

  function init() {
    injectBackupModalHTML();

    document.addEventListener('click', event => {
      const openTrigger = event.target.closest('[data-open-backup-modal]');
      if (openTrigger) {
        if (openTrigger.closest('#student-profile-modal') && window.ProfileModal && typeof window.ProfileModal.close === 'function') {
          window.ProfileModal.close();
        }
        openModal();
        return;
      }

      if (event.target.closest('#close-backup-modal')) {
        closeModal();
        return;
      }
      if (event.target.closest('#backup-export-btn')) {
        handleExport();
        return;
      }
      if (event.target.closest('#backup-confirm-restore-btn')) {
        handleConfirmRestore();
        return;
      }
      if (event.target.closest('#backup-cancel-restore-btn')) {
        readSequence++;
        clearStagedPreview();
        showStatus('info', 'تم إلغاء الاسترجاع وظلت بياناتك الحالية كما هي.', true);
        return;
      }
      const modal = document.getElementById('study-backup-modal');
      if (modal && event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('change', event => {
      if (event.target && event.target.id === 'backup-file-input') {
        handleFileSelect(event);
      }
    });

    if (window.PortalStudyState && typeof window.PortalStudyState.subscribe === 'function') {
      window.PortalStudyState.subscribe(() => {
        const modal = document.getElementById('study-backup-modal');
        if (modal && !modal.classList.contains('hidden')) {
          refreshCurrentSummary();
        }
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.PortalStudyBackupUI = { open: openModal, close: closeModal };
})();
