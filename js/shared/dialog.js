/* Shared focus, background and scroll lifecycle for every portal dialog. */
(function () {
  const stack = [];
  const previousInert = new Map();
  let previousOverflow = '';
  let previousOverflowClass = false;
  const focusable = 'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function controls(element) {
    return [...element.querySelectorAll(focusable)].filter(item => !item.inert && item.getClientRects().length);
  }
  function syncBackground() {
    const top = stack.at(-1);
    if (top) {
      for (const child of document.body.children) {
        if (!previousInert.has(child)) previousInert.set(child, child.inert);
        child.inert = !child.contains(top.element);
      }
      document.body.style.overflow = 'hidden';
      document.body.classList.add('overflow-hidden');
    } else {
      for (const [element, inert] of previousInert) element.inert = inert;
      previousInert.clear();
      document.body.style.overflow = previousOverflow;
      document.body.classList.toggle('overflow-hidden', previousOverflowClass);
    }
  }
  function open(element, options = {}) {
    if (!element || stack.some(entry => entry.element === element)) return;
    if (!stack.length) {
      previousOverflow = document.body.style.overflow;
      previousOverflowClass = document.body.classList.contains('overflow-hidden');
    }
    const trigger = document.activeElement;
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-modal', 'true');
    const heading = element.querySelector('h2,h3');
    if (heading) {
      if (!heading.id) heading.id = element.id + '-heading';
      element.setAttribute('aria-labelledby', heading.id);
    } else if (!element.hasAttribute('aria-label')) element.setAttribute('aria-label', 'نافذة');
    element.classList.remove('hidden');
    element.setAttribute('tabindex', '-1');
    stack.push({element, trigger, onClose: options.onClose});
    syncBackground();
    (element.querySelector(options.initialFocus || '[autofocus]') || controls(element)[0] || element).focus({preventScroll:true});
  }
  function close(element) {
    const index = stack.findIndex(entry => entry.element === element);
    if (index < 0) return;
    const [entry] = stack.splice(index, 1);
    element.classList.add('hidden');
    element.removeAttribute('aria-modal');
    if (entry.onClose) entry.onClose();
    syncBackground();
    if (entry.trigger && entry.trigger.isConnected && !entry.trigger.closest('[inert]')) entry.trigger.focus({preventScroll:true});
    else if (stack.length) (controls(stack.at(-1).element)[0] || stack.at(-1).element).focus({preventScroll:true});
  }
  document.addEventListener('keydown', function (event) {
    const top = stack.at(-1);
    if (!top) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      close(top.element);
    } else if (event.key === 'Tab') {
      const items = controls(top.element);
      const index = items.indexOf(document.activeElement);
    // Programmatic heading/article focus inside the dialog is a valid native Tab starting point.
    if (index === -1 && document.activeElement !== top.element && top.element.contains(document.activeElement)) return;
      if (!items.length || (event.shiftKey && index <= 0) || (!event.shiftKey && (index < 0 || index === items.length - 1))) {
        event.preventDefault();
        const next = event.shiftKey ? items.at(-1) : items[0];
        (next || top.element).focus();
      }
    }
  }, true);
  window.PortalDialog = {open, close};
})();
