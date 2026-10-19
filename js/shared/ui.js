/* Small shared rendering helpers; existing SVGs are not recreated on every update. */
(function () {
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  }
  function icons(root = document) {
    if (root) window.PortalMedia?.sanitizeLinks(root);
    if (!window.lucide || !root || !root.querySelector('[data-lucide]')) return;
    window.lucide.createIcons({root});
    root.querySelectorAll('svg[data-lucide]').forEach(icon => icon.removeAttribute('data-lucide'));
  }
  function createEmptyNotice(title, desc) {
    return `
      <div class="glass-panel p-8 rounded-3xl border text-center my-4">
        <div class="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
          <i data-lucide="inbox" class="w-6 h-6"></i>
        </div>
        <h4 class="text-sm font-bold text-[var(--text-main)] mb-1">${escapeHtml(title)}</h4>
        <p class="text-xs text-[var(--text-muted)]">${escapeHtml(desc)}</p>
      </div>
    `;
  }
  window.PortalUI = {icons, emptyNotice: createEmptyNotice, escapeHtml};
  document.addEventListener('DOMContentLoaded', () => icons());
})();
