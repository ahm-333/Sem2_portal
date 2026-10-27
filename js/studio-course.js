/* A real, branching course workspace over the existing source-family controls. */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page !== 'subject') return;
    const courseId = new URL(window.location.href).searchParams.get('id') || window.COURSES_DATA[0]?.id;
    const course = window.COURSES_DATA.find(value => value.id === courseId);
    const heading = document.querySelector('.a1-course-heading-panel');
    const nav = document.querySelector('.a1-resource-tabs');
    if (!course || !heading || !nav) return;
    const names = {lectures:'المحاضرات',sections:'السكاشن',videos:'الفيديو',assignments:'التكليفات',resources:'المراجع'};
    const descriptions = {lectures:'افهم الفكرة. افتح الشرح، أو ارجع للسلايد الأصلي.',sections:'من الفكرة للتطبيق. شيتات وأكواد سكشنك هنا.',videos:'شوف الفكرة بتتشرح، وخدها بالسرعة المناسبة ليك.',assignments:'اعرف المطلوب، وافتح ملفات التكليف من هنا.',resources:'ارجع للأصل. مراجع وأدوات تساعدك تربط الصورة.'};
    heading.classList.add('course-atlas');
    const copy = document.createElement('div'); copy.className = 'atlas-copy';
    while (heading.firstChild) copy.append(heading.firstChild);
    const map = document.createElement('div'); map.className = 'atlas-map';
    const paths = document.createElementNS('http://www.w3.org/2000/svg','svg');
    paths.classList.add('atlas-connections'); paths.setAttribute('aria-hidden','true');
    const core = document.createElement('div'); core.className = 'atlas-core';
    core.innerHTML = '<span class="atlas-core-ring" aria-hidden="true"></span><span class="atlas-core-ring" aria-hidden="true"></span>';
    core.append(copy.querySelector('#subject-icon-box'));
    const coreCaption = document.createElement('span'); coreCaption.className = 'atlas-core-caption'; coreCaption.textContent = course.code; core.append(coreCaption);
    nav.classList.add('atlas-branches');
    for (const button of nav.querySelectorAll('button')) {
      const kind = button.dataset.resourceKind;
      const icon = button.querySelector('svg');
      button.replaceChildren();
      if (icon) button.append(icon);
      const label = document.createElement('span'); label.textContent = names[kind];
      const count = document.createElement('small'); count.dataset.atlasCount = kind;
      button.append(label,count);
    }
    map.append(paths,core,nav); heading.append(copy,map);
    const context = document.querySelector('.a1-course-context'); context.open = false;
    const contextColumns = document.createElement('div'); contextColumns.className = 'atlas-context-columns';
    [...context.children].filter(value => value.tagName !== 'SUMMARY').forEach(value => contextColumns.append(value));
    context.append(contextColumns);
    const info = document.createElement('section'); info.className = 'atlas-info';
    info.setAttribute('aria-label','معلومات المادة ومواعيدها');
    const overview = copy.querySelector('.a1-course-overview');
    info.append(overview,context); heading.after(info);
    for (const disclosure of [overview,context]) {
      disclosure.open = false;
      disclosure.setAttribute('name','atlas-course-information');
      disclosure.addEventListener('toggle',() => {
        if (disclosure.open) [overview,context].filter(value => value !== disclosure).forEach(value => {value.open = false;});
      });
    }
    const controls = document.createElement('div'); controls.className = 'atlas-course-controls';
    const switcher = copy.querySelector('#quick-course-select');
    if (switcher) {
      switcher.before(controls);
      const picker = document.createElement('div'); picker.className = 'atlas-course-picker';
      const trigger = document.createElement('button'); trigger.type = 'button'; trigger.id = 'atlas-course-picker-trigger';
      trigger.setAttribute('aria-haspopup','menu'); trigger.setAttribute('aria-expanded','false'); trigger.setAttribute('aria-controls','atlas-course-menu');
      trigger.setAttribute('aria-label','تغيير المادة، الحالية: ' + course.arabicName + ' ' + course.code);
      const currentName = document.createElement('span'); currentName.className = 'atlas-picker-current-name'; currentName.textContent = course.arabicName;
      const currentCode = document.createElement('bdi'); currentCode.className = 'atlas-picker-current-code'; currentCode.lang = 'en'; currentCode.textContent = course.code;
      const chevron = document.createElement('span'); chevron.setAttribute('aria-hidden','true'); chevron.textContent = '⌄'; chevron.className = 'atlas-picker-chevron';
      trigger.append(currentName,currentCode,chevron);
      const label = document.createElement('span'); label.className = 'atlas-picker-label'; label.textContent = 'تغيير المادة';
      picker.append(label,trigger,switcher); controls.append(picker);
      switcher.classList.add('atlas-native-course-select'); switcher.tabIndex = -1; switcher.setAttribute('aria-hidden','true');
      const menu = document.createElement('div'); menu.id = 'atlas-course-menu'; menu.className = 'atlas-course-menu'; menu.hidden = true;
      menu.setAttribute('role','menu'); menu.setAttribute('aria-label','الانتقال إلى مادة أخرى');
      const links = window.COURSES_DATA.map(value => {
        const link = document.createElement('a'); link.setAttribute('role','menuitem'); link.tabIndex = -1;
        if (value.id === course.id) link.setAttribute('aria-current','page');
        const names = document.createElement('span'); names.className = 'atlas-picker-names';
        const arabic = document.createElement('strong'); arabic.textContent = value.arabicName;
        const english = document.createElement('span'); english.lang = 'en'; english.dir = 'ltr'; english.textContent = window.PortalPresentation.course(value).name;
        const code = document.createElement('bdi'); code.lang = 'en'; code.className = 'atlas-picker-code'; code.textContent = value.code;
        names.append(arabic,english); link.append(names,code); menu.append(link);
        return link;
      });
      document.body.append(menu);
      function closePicker(restore) {
        menu.hidden = true; trigger.setAttribute('aria-expanded','false');
        if (restore) trigger.focus();
      }
      function openPicker() {
        const current = new URL(window.location.href);
        links.forEach((link,index) => {
          const url = new URL('subject.html',current);
          url.searchParams.set('id',window.COURSES_DATA[index].id);
          url.searchParams.set('track',current.searchParams.get('track') || 'lecture');
          if (document.body.dataset.resourceKind) url.searchParams.set('kind',document.body.dataset.resourceKind);
          link.href = url.href;
        });
        menu.hidden = false; trigger.setAttribute('aria-expanded','true');
        const rect = trigger.getBoundingClientRect();
        const width = Math.min(420,window.innerWidth - 32);
        menu.style.width = width + 'px';
        menu.style.left = Math.max(16,Math.min(rect.right - width,window.innerWidth - width - 16)) + 'px';
        const desired = Math.min(menu.scrollHeight,430);
        const below = window.innerHeight - rect.bottom - 16;
        const above = rect.top - 16;
        const up = below < desired && above > below;
        const height = Math.min(desired,up ? above : below);
        menu.style.maxHeight = Math.max(100,height) + 'px';
        menu.style.top = (up ? rect.top - height - 8 : rect.bottom + 8) + 'px';
        const selected = menu.querySelector('[aria-current="page"]') || links[0];
        links.forEach(link => {link.tabIndex = link === selected ? 0 : -1;});
        selected.focus({preventScroll:true});
        selected.scrollIntoView({block:'nearest',behavior:'instant'});
      }
      trigger.addEventListener('click',() => {if (menu.hidden) openPicker(); else closePicker(false);});
      trigger.addEventListener('keydown',event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {event.preventDefault();openPicker();}
      });
      menu.addEventListener('keydown',event => {
        if (event.key === 'Escape') {event.preventDefault();event.stopPropagation();closePicker(true);return;}
        if (event.key === 'Tab') {closePicker(true);return;}
        const index = links.indexOf(document.activeElement);
        let next = index;
        if (event.key === 'ArrowDown') next = (index + 1) % links.length;
        else if (event.key === 'ArrowUp') next = (index - 1 + links.length) % links.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = links.length - 1;
        else return;
        event.preventDefault(); links.forEach((link,i) => {link.tabIndex = i === next ? 0 : -1;}); links[next].focus();
      });
      document.addEventListener('pointerdown',event => {if (!menu.hidden && !menu.contains(event.target) && !trigger.contains(event.target)) closePicker(false);});
      document.addEventListener('scroll',event => {if (!menu.hidden && !menu.contains(event.target)) closePicker(false);},true);
      window.addEventListener('resize',() => closePicker(false));
      window.addEventListener('pagehide',() => closePicker(false));
    } else copy.append(controls);
    const firstSource = document.querySelector('#lectures-list .a1-source-actions .a1-action-primary');
    if (firstSource) {
      const start = document.createElement('button'); start.type = 'button'; start.dataset.atlasStart = 'true';
      start.textContent = firstSource.matches('[data-open-study-lecture],[data-os-course-link]') ? 'ابدأ الشرح' : 'افتح أول مصدر';
      start.addEventListener('click',() => {window.PortalJourney.selectFamily('lectures');document.querySelector('#lectures-list .a1-source-actions .a1-action-primary')?.click();});
      controls.append(start);
    }
    const sourceHeading = document.createElement('div'); sourceHeading.className = 'atlas-collection-heading';
    sourceHeading.innerHTML = '<div><h2 id="atlas-source-title"></h2><p id="atlas-source-description"></p></div><span class="atlas-live-indicator"><span aria-hidden="true"></span>حسب مجموعتك</span>';
    const materials = document.querySelector('.a1-materials'); materials.prepend(sourceHeading);
    document.querySelector('.a1-course-layout').classList.add('atlas-workspace');
    function updateCounts() {
      const count = selector => document.querySelectorAll(selector + ' [data-content-key]').length;
      const counts = {lectures:count('#lectures-list'),sections:count('#sections-list'),videos:count('#video-explanations-list'),assignments:count('#assignments-list'),resources:count('#theory-resources-list')+count('#practical-resources-list')+(course.explanationSite?.url ? 1:0)};
      for (const [kind,count] of Object.entries(counts)) nav.querySelector(`[data-atlas-count="${kind}"]`).textContent = count + ' مصدر';
    }
    function drawConnections() {
      const box = map.getBoundingClientRect();
      if (!box.width || !box.height) return;
      paths.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
      paths.replaceChildren();
      const hub = core.getBoundingClientRect();
      const x = hub.left - box.left + hub.width/2, y = hub.top - box.top + hub.height/2;
      for (const button of nav.querySelectorAll('button')) {
        const rect = button.getBoundingClientRect();
        const endX = rect.left - box.left + rect.width/2, endY = rect.top - box.top + rect.height/2;
        const path = document.createElementNS('http://www.w3.org/2000/svg','path');
        path.setAttribute('d',`M ${x} ${y} C ${(x+endX)/2} ${y}, ${(x+endX)/2} ${endY}, ${endX} ${endY}`);
        path.dataset.branch = button.dataset.resourceKind;
        path.classList.toggle('is-active',button.getAttribute('aria-pressed') === 'true'); paths.append(path);
      }
    }
    function decorateRows() {
      for (const list of materials.querySelectorAll('#lectures-list,#sections-list,#assignments-list,#video-explanations-list,#theory-resources-list,#practical-resources-list')) {
        [...list.querySelectorAll(':scope>.a1-source-row')].forEach((row,index) => {
          if (row.querySelector('.atlas-source-marker')) return;
          const marker = document.createElement('span'); marker.className = 'atlas-source-marker'; marker.setAttribute('aria-hidden','true'); marker.textContent = String(index+1).padStart(2,'0');
          row.prepend(marker);
          if (row.querySelector('[data-open-study-lecture],[data-os-course-link]')) row.classList.add('atlas-has-explanation');
        });
      }
    }
    function selected() {
      const kind = document.body.dataset.resourceKind || 'lectures';
      heading.dataset.activeBranch = kind;
      document.getElementById('atlas-source-title').textContent = names[kind];
      document.getElementById('atlas-source-description').textContent = descriptions[kind];
      paths.querySelectorAll('path').forEach(path => path.classList.toggle('is-active',path.dataset.branch === kind));
      if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.gsap.fromTo(core,{scale:.88},{scale:1,duration:.65,ease:'elastic.out(1,.45)',overwrite:true});
        const panels = [...materials.querySelectorAll('.a1-family-panel')].filter(panel => !panel.hidden && panel.getClientRects().length);
        if (panels.length) window.gsap.fromTo(panels,{x:18},{x:0,duration:.35,ease:'power3.out',clearProps:'transform',overwrite:true});
      }
      decorateRows();
    }
    updateCounts(); selected(); drawConnections();
    const resize = new window.ResizeObserver(drawConnections); resize.observe(map);
    const rows = new window.MutationObserver(() => { decorateRows(); updateCounts(); }); rows.observe(materials,{childList:true,subtree:true});
    window.addEventListener('portal:family-changed',selected);
    window.addEventListener('studentProfileChanged',updateCounts);
    window.addEventListener('portal:sources-changed',updateCounts);
    window.addEventListener('pagehide',() => {resize.disconnect();rows.disconnect();});
    window.addEventListener('pageshow',() => {resize.observe(map);rows.observe(materials,{childList:true,subtree:true});drawConnections();decorateRows();});
  });
})();
