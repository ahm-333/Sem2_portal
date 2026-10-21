/* The approved Flex cursor. Native editing/reading cursors and keyboard use take priority. */
(function () {
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let overlay, tip, tail, frame = 0, visible = false, x = 0, y = 0, tx = 0, ty = 0;
  const nativeZone = target => target?.closest('input,textarea,select,[contenteditable],#study-slides-feed,#study-full-quiz-view,.reading,pre,code');
  function hide() {
    visible = false;
    if (overlay) overlay.hidden = true;
    delete document.body.dataset.cursorPreview;
    window.cancelAnimationFrame(frame); frame = 0;
  }
  function render() {
    frame = 0;
    if (!visible || !overlay) return;
    tx += (x - tx) * .24; ty += (y - ty) * .24;
    if (reduce.matches) { tx = x; ty = y; }
    tail.style.transform = `translate3d(${tx}px,${ty}px,0)`;
    if (Math.abs(x - tx) + Math.abs(y - ty) > .1) frame = window.requestAnimationFrame(render);
  }
  function mount() {
    if (!fine.matches || overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'cursor-study'; overlay.dataset.shape = 'flex';
    overlay.setAttribute('aria-hidden', 'true'); overlay.hidden = true;
    const shape = '<path d="M3 2 5 27l7-7 5 10 5-3-6-10 11-1Z"/>';
    overlay.innerHTML = `<svg class="cursor-accent" viewBox="0 0 36 36">${shape}</svg><svg class="cursor-tip" viewBox="0 0 36 36">${shape}</svg>`;
    document.body.append(overlay); tip = overlay.lastElementChild; tail = overlay.firstElementChild;
  }
  document.addEventListener('pointermove', event => {
    if (!fine.matches || event.pointerType === 'touch' || nativeZone(event.target)) { hide(); return; }
    mount(); if (!overlay) return;
    x = event.clientX; y = event.clientY;
    if (!visible) { tx = x; ty = y; }
    visible = true; overlay.hidden = false; document.body.dataset.cursorPreview = 'flex';
    overlay.dataset.interactive = String(!!event.target.closest('a,button,summary,.processor-node'));
    overlay.dataset.dark = String(!!event.target.closest('.processor-intro') || document.documentElement.dataset.theme === 'dark');
    tip.style.transform = `translate3d(${x}px,${y}px,0)`;
    if (!frame) frame = window.requestAnimationFrame(render);
  }, {passive: true});
  document.addEventListener('pointerdown', () => { if (overlay) overlay.dataset.pressed = 'true'; });
  for (const event of ['pointerup', 'pointercancel']) document.addEventListener(event, () => { if (overlay) overlay.dataset.pressed = 'false'; });
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) hide(); });
  document.addEventListener('keydown', event => { if (event.key === 'Tab') hide(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  window.addEventListener('blur', hide);
  fine.addEventListener('change', () => { hide(); if (!fine.matches) { overlay?.remove(); overlay = null; } });
  reduce.addEventListener('change', hide);
  window.addEventListener('pagehide', () => { hide(); overlay?.remove(); overlay = null; });
})();
