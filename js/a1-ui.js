/* A1 shell, measured fixed navbar, and fail-open processor intro lifecycle. */
(function () {
  const key = 'sem2-studio-rift-intro-v3';
  const desktop = window.matchMedia('(min-width:1024px) and (min-height:620px) and (hover:hover) and (pointer:fine)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const home = document.body.dataset.page === 'home';
  const force = ['rift','processor'].includes(new URLSearchParams(window.location.search).get('intro'));
  let handle = null, timer = 0, generation = 0, pending = false;
  function seen() { try { return window.sessionStorage.getItem(key) === 'seen'; } catch { return true; } }
  function measure() {
    const nav = document.querySelector('body > header');
    const height = nav ? Math.ceil(nav.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--portal-nav-height', height + 'px');
  }
  function shell(active) {
    document.documentElement.classList.toggle('a1-intro-active', active);
    document.body.classList.toggle('a1-intro-active', active);
    document.querySelectorAll('body > header,body > main,body > footer,.a1-mobile-nav,.studio-rail,.studio-mobile-nav').forEach(el => {
      if (active) { if (!('introInert' in el.dataset)) el.dataset.introInert = String(el.inert); el.inert = true; }
      else if ('introInert' in el.dataset) { el.inert = el.dataset.introInert === 'true'; delete el.dataset.introInert; }
    });
  }
  function finish(reason, focus = true) {
    if (!pending && !handle) return;
    generation++; window.clearTimeout(timer);
    handle?.destroy(); handle = null; pending = false;
    document.querySelector('.rift-intro')?.remove();
    shell(false); measure();
    try { window.sessionStorage.setItem(key, 'seen'); } catch { /* entry remains usable */ }
    window.scrollTo({top: 0, behavior: 'instant'});
    window.dispatchEvent(new CustomEvent('portal:intro-end', {detail: {reason}}));
    if (focus && !document.querySelector('[aria-modal="true"]')) document.querySelector('main')?.focus({preventScroll: true});
  }
  window.PortalIntro = {isActive: () => pending || !!handle, dismiss: () => finish("navigation")};
  function load(file, token) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL(file, document.baseURI).href;
      script.onload = () => token === generation ? resolve() : reject(new Error('Intro cancelled'));
      script.onerror = () => reject(new Error('Intro asset unavailable'));
      document.head.append(script);
    });
  }
  async function start() {
    const token = ++generation;
    pending = true; shell(true);
    timer = window.setTimeout(() => finish('timeout'), 12000);
    try {
      for (const file of ['js/vendor/gsap/gsap.min.js', 'js/vendor/gsap/ScrollTrigger.min.js', 'js/rift-intro.js']) {
        if (file.endsWith('/gsap.min.js') && window.gsap) continue;
        await load(file, token);
        if (token !== generation) return;
      }
      window.gsap.registerPlugin(window.ScrollTrigger);
      const mounted = await window.mountRiftIntro({host: document.querySelector('main'), cancelled: () => token !== generation, onSeen: () => {
        window.clearTimeout(timer); timer = window.setTimeout(() => finish('complete'), 550);
      }, onSkip: () => finish('skip')});
      if (token !== generation) { mounted?.destroy(); return; }
      handle = mounted;
      window.clearTimeout(timer);
      // Studio adds its navigation during DOM ready while the intro assets load.
      shell(true);
      if (!handle) finish('unavailable');
    } catch { if (token === generation) finish('unavailable'); }
  }
  document.addEventListener('DOMContentLoaded', () => {
    measure();
    const observer = new window.ResizeObserver(measure);
    observer.observe(document.querySelector('body > header'));
    if (home && ['', '#courses-section'].includes(window.location.hash) && desktop.matches && !reduce.matches && (force || !seen())) start();
    window.addEventListener('pagehide', () => { finish('pagehide', false); observer.disconnect(); });
    window.addEventListener('pageshow', () => { measure(); observer.observe(document.querySelector('body > header')); });
  });
  desktop.addEventListener('change', () => { if (!desktop.matches) finish('viewport'); });
  reduce.addEventListener('change', () => { if (reduce.matches) finish('reduced-motion'); });
})();
