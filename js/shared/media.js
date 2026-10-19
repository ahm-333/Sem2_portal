/* Provider links, delegated preview actions and a copy fallback shared by every list. */
(function () {
  function safeURL(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value, document.baseURI);
      return ['https:', 'http:', 'file:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  }
  function embedURL(value) {
    const safe = safeURL(value);
    if (!safe) return '';
    const url = new URL(safe);
    if (url.hostname === 'drive.google.com') {
      const match = url.pathname.match(/^\/file\/d\/([\w-]+)/);
      if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    if (['youtube.com','www.youtube.com','youtu.be','www.youtu.be'].includes(url.hostname)) {
      const list = url.searchParams.get('list');
      if (list && /^[\w-]+$/.test(list)) return `https://www.youtube.com/embed/videoseries?list=${list}&autoplay=1`;
      const id = url.hostname.includes('youtu.be') ? url.pathname.slice(1) : url.searchParams.get('v');
      if (id && /^[\w-]+$/.test(id)) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return safe;
  }
  function canPreviewSite(value) {
    const safe = safeURL(value);
    return !!safe && !(new URL(safe).hostname === 'drive.google.com' && new URL(safe).pathname.startsWith('/drive/folders/'));
  }
  function sanitizeLinks(root) {
    root.querySelectorAll('a[href]').forEach(link => {
      if (!safeURL(link.getAttribute('href'))) {
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
      }
      if (link.target === '_blank') link.rel = 'noopener noreferrer';
    });
  }
  const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  function openPreview(kind, value) {
    const source = safeURL(value.url);
    const view = safeURL(value.viewUrl || source);
    if (!source || !view) return;
    if (isMobile()) { window.open(view, '_blank', 'noopener'); return; }
    const modal = document.getElementById(kind + '-modal');
    const frame = document.getElementById(kind + '-modal-frame');
    if (!modal || !frame) { window.open(view, '_blank', 'noopener'); return; }
    frame.src = embedURL(source);
    const title = document.getElementById(kind + '-modal-title');
    const subtitle = document.getElementById(kind + '-modal-subtitle');
    if (title) title.textContent = value.title || 'معاينة';
    if (subtitle) subtitle.textContent = value.subtitle || 'يمكنك فتح المحتوى في نافذة خارجية إذا تعذرت المعاينة';
    const external = document.getElementById(kind + '-modal-open-new');
    if (external) {
      external.href = view;
      if (kind === 'video') external.querySelector('span').textContent = new URL(view).hostname === 'drive.google.com' ? 'فتح في Google Drive' : 'فتح الفيديو خارجيًا';
    }
    const download = document.getElementById(kind + '-modal-download');
    if (download) { download.href = safeURL(value.downloadUrl || source); download.setAttribute('download', value.filename || 'lecture.pdf'); }
    window.PortalDialog.open(modal, {onClose: () => frame.removeAttribute('src')});
  }
  function copyFallback(url) {
    let modal = document.getElementById('copy-link-fallback');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'copy-link-fallback';
      modal.className = 'fixed inset-0 z-[150] bg-black/70 flex items-center justify-center p-4 hidden';
      modal.innerHTML = '<div class="glass-panel w-full max-w-lg p-6 rounded-2xl border space-y-4"><h3 id="copy-link-heading" class="font-bold">انسخ الرابط يدويًا</h3><p class="text-sm">تعذر النسخ التلقائي. حدّد الرابط وانسخه من هنا.</p><input id="copy-link-value" aria-label="الرابط المطلوب نسخه" dir="ltr" readonly class="w-full p-3 rounded-xl border bg-[var(--bg-surface)] text-[var(--text-main)] text-sm"><button type="button" class="px-4 py-2 rounded-xl bg-indigo-600 text-white">إغلاق</button></div>';
      document.body.append(modal);
      modal.querySelector('button').addEventListener('click', () => window.PortalDialog.close(modal));
      modal.addEventListener('click', event => { if (event.target === modal) window.PortalDialog.close(modal); });
    }
    modal.querySelector('input').value = url;
    window.PortalDialog.open(modal, {initialFocus: '#copy-link-value'});
    modal.querySelector('input').select();
  }
  let toastTimer;
  async function copyLink(value) {
    const url = safeURL(value);
    if (!url) return false;
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      const toast = document.getElementById('toast');
      if (toast) {
        toast.querySelector('span').textContent = 'تم نسخ الرابط بنجاح';
        toast.classList.remove('opacity-0','pointer-events-none');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.add('opacity-0','pointer-events-none'), 2500);
      }
      return true;
    } catch { copyFallback(url); return false; }
  }
  document.addEventListener('DOMContentLoaded', () => {
    for (const kind of ['pdf','video']) {
      const modal = document.getElementById(kind + '-modal');
      const close = document.getElementById(kind + '-modal-close');
      if (close) close.addEventListener('click', () => window.PortalDialog.close(modal));
      if (modal) modal.addEventListener('click', event => {if (event.target === modal) window.PortalDialog.close(modal);});
    }
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-preview-file],[data-play-url],[data-copy-url]');
      if (!button) return;
      if (button.hasAttribute('data-copy-url')) { copyLink(button.dataset.copyUrl); return; }
      if (button.hasAttribute('data-play-url')) { openPreview('video', {url:button.dataset.playUrl,title:button.dataset.playTitle,subtitle:button.dataset.playSubtitle}); return; }
      openPreview('pdf', {url:button.dataset.previewFile,title:button.dataset.previewTitle,subtitle:button.dataset.previewSubtitle,filename:button.dataset.previewFilename,viewUrl:button.dataset.previewView,downloadUrl:button.dataset.previewDownload});
    });
  });
  window.PortalMedia = {safeURL, embedURL, canPreviewSite, copyLink, sanitizeLinks};
})();
