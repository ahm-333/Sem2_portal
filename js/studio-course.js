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
    const info = document.createElement('div'); info.className = 'atlas-info';
    info.append(copy.querySelector('.a1-course-overview'),context); copy.append(info);
    const firstSource = document.querySelector('#lectures-list .a1-source-actions .a1-action-primary');
    if (firstSource) {
      const controls = document.createElement('div'); controls.className = 'atlas-course-controls';
      const start = document.createElement('button'); start.type = 'button'; start.dataset.atlasStart = 'true';
      start.textContent = firstSource.matches('[data-open-study-lecture],[data-os-course-link]') ? 'ابدأ الشرح' : 'افتح أول مصدر';
      start.addEventListener('click',() => {window.PortalJourney.selectFamily('lectures');document.querySelector('#lectures-list .a1-source-actions .a1-action-primary')?.click();});
      const switcher = copy.querySelector('#quick-course-select');
      if (switcher) {switcher.before(controls);controls.append(switcher,start);} else {controls.append(start);copy.append(controls);}
    }
    const sourceHeading = document.createElement('div'); sourceHeading.className = 'atlas-collection-heading';
    sourceHeading.innerHTML = '<div><h2 id="atlas-source-title"></h2><p id="atlas-source-description"></p></div><span class="atlas-live-indicator"><span aria-hidden="true"></span>حسب مجموعتك</span>';
    const materials = document.querySelector('.a1-materials'); materials.prepend(sourceHeading);
    document.querySelector('.a1-course-layout').classList.add('atlas-workspace');
    function updateCounts() {
      const staff = window.StudentProfile.getCourseStaff(courseId);
      const sections = window.StudentProfile.filterItemsForTa(course.sections || [],'my-ta',staff.ta);
      const assignments = window.StudentProfile.filterItemsForTa(course.assignments || [],'my-ta',staff.ta,true);
      const counts = {lectures:course.lectures?.length || 0,sections:sections.length,videos:course.videoExplanations?.length || 0,assignments:assignments.length,resources:(course.resources?.length || 0)+(course.practicalResources?.length || 0)+(course.explanationSite?.url ? 1:0)};
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
    const rows = new window.MutationObserver(decorateRows); rows.observe(materials,{childList:true,subtree:true});
    window.addEventListener('portal:family-changed',selected);
    window.addEventListener('studentProfileChanged',updateCounts);
    window.addEventListener('pagehide',() => {resize.disconnect();rows.disconnect();});
    window.addEventListener('pageshow',() => {resize.observe(map);rows.observe(materials,{childList:true,subtree:true});drawConnections();decorateRows();});
  });
})();
