/* Shared navigation and preferences for the original standalone teaching pages. */
(function () {
  'use strict';
  function init() {
    const root = document.documentElement;
    const path = window.location.pathname;
    if (/\/study\/(arch|db|ds)\/index\.html$/.test(path)) root.setAttribute('data-study-index','');
    const course = path.includes('/ds/') ? ['data-structure','هياكل البيانات'] : path.includes('/db/') ? ['database-systems','قواعد البيانات'] : path.includes('/arch/') ? ['computer-architecture','معمارية الحاسب'] : ['operating-system','نظم التشغيل'];
    root.setAttribute('data-study-course',course[0]);
    const shell = document.createElement('header');
    shell.className = 'study-portal-bar';
    shell.innerHTML = '<a class="study-shell-brand" href="../../index.html" aria-label="Kernal — الصفحة الرئيسية"><span aria-hidden="true"></span><b lang="en">Kernal</b></a>' +
      '<nav aria-label="التنقل في المقرر"><a href="../../subject.html?id=' + course[0] + '&kind=lectures">' + course[1] + '</a><span aria-hidden="true">/</span><span>شرح تفاعلي</span></nav>' +
      '<label class="study-theme-control" for="study-shell-theme"><span>المظهر</span><select id="study-shell-theme"><option value="light">فاتح</option><option value="dark">داكن</option><option value="reading">قراءة</option></select></label>';
    document.body.prepend(shell);
    const main = document.querySelector('main');
    if (main) {
      if (!main.id) main.id = 'study-main';
      main.tabIndex = -1;
      const skip = document.createElement('a');
      skip.className = 'study-shell-skip';
      skip.href = '#' + main.id;
      skip.textContent = 'تخطّى إلى الشرح';
      document.body.prepend(skip);
    }
    const selector = shell.querySelector('select');
    function syncTheme() {
      const theme = root.dataset.theme || 'light';
      document.body.classList.remove('theme-white','theme-light','theme-sepia','theme-dark');
      document.body.classList.add(theme === 'dark' ? 'theme-dark' : theme === 'reading' ? 'theme-sepia' : 'theme-white');
      if (theme === 'light') document.body.classList.add('theme-light');
      selector.value = theme;
      const active = {btnThemeSepia:'reading',btnThemeWhite:'light',btnThemeLight:'light',btnThemeDark:'dark','btn-theme-sepia':'reading','btn-theme-light':'light','btn-theme-dark':'dark'};
      Object.entries(active).forEach(([id,value]) => {
        const button = document.getElementById(id);
        if (button) {
          button.setAttribute('aria-pressed',String(theme === value));
          button.setAttribute('aria-label',value === 'reading' ? 'وضع القراءة' : value === 'dark' ? 'المظهر الداكن' : 'المظهر الفاتح');
          if (!button.textContent.trim()) button.textContent = value === 'reading' ? 'قراءة' : value === 'dark' ? 'داكن' : 'فاتح';
        }
      });
    }
    selector.addEventListener('change',() => window.PortalTheme.setTheme(selector.value));
    // Delegate after the original handlers, including handlers that replace body.className.
    document.addEventListener('click',event => {
      const button = event.target.closest('button');
      if (!button) return;
      const id = button.id;
      if (/^btnTheme|^btn-theme-/.test(id)) {
        const value = /Sepia|sepia/.test(id) ? 'reading' : /Dark|dark/.test(id) ? 'dark' : 'light';
        window.PortalTheme.setTheme(value);
        syncTheme();
      }
    });
    new MutationObserver(syncTheme).observe(root,{attributes:true,attributeFilter:['data-theme']});
    window.addEventListener('pageshow',syncTheme);
    syncTheme();
    // The existing standalone title and lesson controls stay in place.
    document.querySelectorAll('body > header:not(.study-portal-bar)').forEach(header => header.classList.add('study-native-header'));
    document.querySelectorAll('[title]').forEach(control => {
      if (control.matches('button,a') && !control.textContent.trim() && !control.getAttribute('aria-label')) control.setAttribute('aria-label',control.title);
    });
    if (path.includes('/education-preview/os/')) {
      document.querySelectorAll('.brand bdi').forEach(brand => {brand.textContent = 'Kernal';});
      document.title = document.title.replace('Study Hub','Kernal');
    }
    const drawer = document.getElementById('sidebar-toc');
    const opener = document.getElementById('btn-open-toc');
    const backdrop = document.getElementById('toc-backdrop');
    if (drawer && opener && backdrop) {
      let expanded = false;
      let previousFocus = null;
      let previousOverflow = '';
      const inertSiblings = new Map();
      drawer.setAttribute('role','dialog');
      drawer.setAttribute('aria-modal','true');
      drawer.setAttribute('aria-label','فهرس المحاضرة');
      opener.setAttribute('aria-controls',drawer.id);
      const focusable = () => [...drawer.querySelectorAll('button,a[href],input,select,[tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
      function syncDrawer() {
        const open = drawer.classList.contains('open');
        drawer.inert = !open;
        drawer.setAttribute('aria-hidden',String(!open));
        opener.setAttribute('aria-expanded',String(open));
        if (open === expanded) return;
        expanded = open;
        if (open) {
          previousFocus = document.activeElement;
          previousOverflow = document.body.style.overflow;
          document.body.style.overflow = 'hidden';
          [...document.body.children].forEach(el => {
            if (el === drawer || el === backdrop || el.tagName === 'SCRIPT') return;
            inertSiblings.set(el,el.inert);
            el.inert = true;
          });
          focusable()[0]?.focus({preventScroll:true});
          window.requestAnimationFrame(() => window.requestAnimationFrame(() => {if (expanded) focusable()[0]?.focus({preventScroll:true});}));
        } else {
          inertSiblings.forEach((value,el) => {el.inert = value;});
          inertSiblings.clear();
          document.body.style.overflow = previousOverflow;
          if (previousFocus?.isConnected) previousFocus.focus();
        }
      }
      function closeDrawer() {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
        syncDrawer();
      }
      opener.addEventListener('click',syncDrawer);
      drawer.addEventListener('transitionend',event => {
        if (event.target === drawer && expanded && !drawer.contains(document.activeElement)) focusable()[0]?.focus({preventScroll:true});
      });
      document.getElementById('btn-close-toc')?.addEventListener('click',closeDrawer);
      backdrop.addEventListener('click',closeDrawer);
      drawer.addEventListener('click',event => {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;
        closeDrawer();
        const target = document.getElementById(link.hash.slice(1));
        if (target) {target.tabIndex = -1;target.focus({preventScroll:true});}
      });
      document.addEventListener('keydown',event => {
        if (!expanded) return;
        if (event.key === 'Escape') {event.preventDefault();closeDrawer();}
        if (event.key === 'Tab') {
          const items = focusable(), first = items[0], last = items.at(-1);
          if (event.shiftKey && document.activeElement === first) {event.preventDefault();last?.focus();}
          else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first?.focus();}
        }
      });
      new MutationObserver(syncDrawer).observe(drawer,{attributes:true,attributeFilter:['class']});
      syncDrawer();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
