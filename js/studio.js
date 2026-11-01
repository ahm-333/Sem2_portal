/* Studio navigation and resource discovery over the existing, authoritative catalog. */
(function () {
  'use strict';
  const home = document.body.dataset.page === 'home';
  const currentId = new URL(window.location.href).searchParams.get('id') || (!home ? window.COURSES_DATA[0]?.id : null);
  const themes = [
    ['computer-architecture', 'var(--course-blue)', '#4264ae'],
    ['computer-graphics', 'var(--course-purple)', '#8153a9'],
    ['database-systems', 'var(--course-mint)', '#33785c'],
    ['data-structure', 'var(--course-peach)', '#a36b2f'],
    ['operating-system', 'var(--course-pink)', '#a85375'],
    ['report-writing', 'var(--course-sky)', '#387998']
  ];
  const icons = {lectures: 'book-open', sections: 'notebook-pen', videos: 'play', assignments: 'clipboard-list', resources: 'folder-open'};
  const labels = {lectures: 'محاضرة', sections: 'سكشن', videos: 'فيديو', assignments: 'تكليف', resources: 'مصدر'};
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  function palette(id) {
    const theme = themes.find(value => value[0] === id) || themes[0];
    return `--course-wash:${theme[1]};--course-tone:${theme[2]}`;
  }
  const href = hash => (home ? '' : 'index.html') + hash;
  const navigation = [
    ['#courses-section', 'layout-grid', 'مساحة المذاكرة'],
    ['#library', 'library', 'مكتبة المصادر'],
    ['#continue', 'history', 'كمّل رحلتك'],
    ['#schedule-section', 'calendar-days', 'جدول الجامعة']
  ];
  function navigationHtml(mobile) {
    return navigation.map(([hash, icon, label]) => `<a href="${href(hash)}" data-studio-nav="${hash}"><i data-lucide="${icon}" aria-hidden="true"></i><span>${mobile && hash === '#courses-section' ? 'المواد' : label}</span></a>`).join('');
  }
  function shell() {
    const rail = document.createElement('aside');
    rail.className = 'studio-rail'; rail.setAttribute('aria-label', 'التنقل ومساحة المذاكرة');
    rail.innerHTML = `<nav aria-label="الأقسام الرئيسية">${navigationHtml(false)}</nav><div class="studio-rail-courses"><h2>مواد الترم</h2>${window.COURSES_DATA.map(course => `<a href="subject.html?id=${escape(course.id)}" ${currentId === course.id ? 'aria-current="page"' : ''} style="${palette(course.id)}"><span class="studio-course-dot" aria-hidden="true"></span><bdi lang="en">${escape(window.PortalPresentation.course(course).name)}</bdi></a>`).join('')}</div><div class="studio-rail-note"><i data-lucide="sprout" aria-hidden="true"></i><p>مش لازم تخلص كل حاجة.<br>المهم تبدأ بحاجة.</p><small>خطوة صغيرة، كل يوم.</small></div>`;
    document.querySelector('body > header').after(rail);
    const mobile = document.createElement('nav'); mobile.className = 'studio-mobile-nav'; mobile.setAttribute('aria-label', 'الأقسام الرئيسية على الموبايل'); mobile.innerHTML = navigationHtml(true); document.body.append(mobile);
    window.PortalUI.icons(rail); window.PortalUI.icons(mobile);
    document.addEventListener('keydown', event => {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input,textarea,select,[contenteditable="true"]') || document.querySelector('[aria-modal="true"]')) return;
      event.preventDefault();
      if (home) {
        if (window.location.hash === '#library') document.getElementById('library-query').focus();
        else {
          window.addEventListener('hashchange', () => window.requestAnimationFrame(() => document.getElementById('library-query').focus()), {once: true});
          window.location.hash = '#library';
        }
      }
      else window.location.href = 'index.html#library';
    });
  }
  function courseSummaryHtml(courseId) {
    if (!window.PortalStudyProgress) return '';
    const summary = window.PortalStudyProgress.getCourseSummary(courseId);
    if (!summary) return '';
    const course = window.COURSES_DATA?.find(c => c.id === courseId);
    const courseName = course ? (window.PortalPresentation?.course(course)?.name || course.name) : courseId;
    return `<div class="studio-course-summary" data-course-summary="${escape(courseId)}" aria-label="ملخص إنجاز المحتوى المنشور لمادة ${escape(courseName)}">
      <div class="studio-summary-header">
        <span class="studio-summary-title">إنجاز المحتوى المنشور</span>
        <span class="studio-summary-percent">${summary.percent}%</span>
      </div>
      <div class="studio-summary-bar" role="progressbar" aria-valuenow="${summary.percent}" aria-valuemin="0" aria-valuemax="100" aria-label="نسبة إنجاز ${escape(courseName)}">
        <div class="studio-summary-bar-fill" style="width:${summary.percent}%"></div>
      </div>
      <div class="studio-summary-metrics">
        <div class="studio-summary-metric metric-lectures">
          <span class="metric-label"><i data-lucide="book-open" aria-hidden="true"></i>المحاضرات</span>
          <span class="metric-counts"><strong class="count-done">${summary.lectures.completed}</strong> مكتمل <span class="count-divider">•</span> <span class="count-left">${summary.lectures.remaining} متبقٍ</span></span>
        </div>
        <div class="studio-summary-metric metric-sections">
          <span class="metric-label"><i data-lucide="notebook-pen" aria-hidden="true"></i>السكاشن</span>
          <span class="metric-counts"><strong class="count-done">${summary.sections.completed}</strong> مكتمل <span class="count-divider">•</span> <span class="count-left">${summary.sections.remaining} متبقٍ</span></span>
        </div>
      </div>
      <p class="studio-summary-scope"><small><span class="scope-text">${escape(summary.scope)}</span> <span class="grade-disclaimer">(مؤشر إنجاز للمحتوى المنشور ولا يعبر عن الدرجات أو إتقان المادة).</span></small></p>
    </div>`;
  }
  function updateCourseSummaries() {
    for (const article of document.querySelectorAll('#courses-grid [data-course-id]')) {
      const courseId = article.dataset.courseId;
      if (!courseId) continue;
      let summaryEl = article.querySelector('.studio-course-summary');
      const html = courseSummaryHtml(courseId);
      if (!html) continue;
      if (!summaryEl) {
        const quick = article.querySelector('.studio-quick-actions');
        if (quick) {
          quick.insertAdjacentHTML('beforebegin', html);
        } else {
          article.insertAdjacentHTML('beforeend', html);
        }
        summaryEl = article.querySelector('.studio-course-summary');
        if (summaryEl && window.PortalUI && typeof window.PortalUI.icons === 'function') {
          window.PortalUI.icons(summaryEl);
        }
      } else {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const newSummary = temp.firstElementChild;
        if (newSummary) {
          summaryEl.replaceWith(newSummary);
          if (window.PortalUI && typeof window.PortalUI.icons === 'function') {
            window.PortalUI.icons(newSummary);
          }
        }
      }
    }
  }
  function decorateCourses() {
    for (const article of document.querySelectorAll('#courses-grid [data-course-id]')) {
      article.style.cssText = palette(article.dataset.courseId);
      if (!article.querySelector('.studio-quick-actions')) {
        const quick = document.createElement('div'); quick.className = 'studio-quick-actions';
        const id = encodeURIComponent(article.dataset.courseId);
        quick.innerHTML = `<a href="subject.html?id=${id}&kind=lectures" aria-label="محاضرات ${escape(window.PortalPresentation.course(window.COURSES_DATA.find(c => c.id === article.dataset.courseId)).name)}"><i data-lucide="book-open" aria-hidden="true"></i>محاضرات</a><a href="subject.html?id=${id}&track=section&kind=sections" aria-label="سكاشن ${escape(window.PortalPresentation.course(window.COURSES_DATA.find(c => c.id === article.dataset.courseId)).name)}"><i data-lucide="notebook-pen" aria-hidden="true"></i>سكاشن</a>`;
        article.append(quick);
        if (window.PortalUI && typeof window.PortalUI.icons === 'function') {
          window.PortalUI.icons(quick);
        }
      }
    }
    updateCourseSummaries();
  }
  function statusBadge(entry) {
    if (!window.PortalContentSearch || !window.PortalContentSearch.isProgressEligible(entry)) return '';
    const status = window.PortalContentSearch.getItemStatus(entry.key, entry);
    if (!status) return '';
    const text = status === 'completed' ? 'مكتمل' : status === 'in-progress' ? 'قيد المذاكرة' : 'لم تبدأ';
    return ` <span class="studio-status-badge status-${escape(status)}" role="status">${escape(text)}</span>`;
  }
  function resourceRow(entry, options = {}) {
    const url = window.PortalContentLinks.href(entry.key, options);
    const badge = statusBadge(entry);
    return `<a class="studio-library-row" href="${escape(url)}" style="${palette(entry.courseId)}"><span><i data-lucide="${icons[entry.kind] || 'file-text'}" aria-hidden="true"></i></span><div><h3 dir="auto">${escape(entry.title)}</h3><p><bdi lang="en">${escape(entry.displayCourseName)}</bdi> / ${escape(labels[entry.kind] || 'مصدر')}${entry.arabicTitle ? ' / ' + escape(entry.arabicTitle) : ''}${entry.ta ? ' / ' + escape(entry.ta) : ''}${badge}</p></div><span>${entry.study || entry.module ? 'افتح الشرح' : 'افتح المصدر'}<i data-lucide="arrow-up-left" aria-hidden="true"></i></span></a>`;
  }
  function resumeOptions(entry, item, last) {
    if (!entry) return {};
    let bridge;
    try {
      const saved = JSON.parse(window.PortalStorage.getItem('sem2_standalone_v1:' + encodeURIComponent(entry.key)));
      if (saved?.version === 1 && typeof saved.anchor === 'string' && /^[\w.-]+$/.test(saved.anchor) && saved.updatedAt === item?.reader?.updatedAt) bridge = saved;
    } catch { /* A malformed standalone marker cannot override the validated reader. */ }
    let actionId = null;
    if (last?.actionId) {
      if (window.PortalContentNavigation && typeof window.PortalContentNavigation.resolveAction === 'function') {
        const resolved = window.PortalContentNavigation.resolveAction(entry.key, last.actionId);
        if (resolved?.valid) actionId = last.actionId;
      } else if (entry.actions?.some(a => a.id === last.actionId)) {
        actionId = last.actionId;
      }
    }
    if (!actionId) {
      if (entry.module && (!entry.study || bridge)) actionId = 'standalone-study';
      else if (entry.study) actionId = 'internal-study';
      else if (entry.actions?.[0]) actionId = entry.actions[0].id;
    }
    const options = actionId ? {actionId} : {};
    if (item?.reader) {
      if (item.reader.slideId !== undefined && item.reader.slideId !== null) {
        options.slide = item.reader.slideId;
      }
      if (item.reader.tab) {
        options.tab = item.reader.tab;
      }
    }
    if (bridge?.anchor) options.anchor = bridge.anchor;
    return options;
  }
  function readingHistory() {
    const state = window.PortalStudyState;
    if (!state) return;
    const snapshot = state.getSnapshot();
    const last = snapshot.lastUsed;
    const entry = last?.key && window.PortalCatalog ? window.PortalCatalog.get(last.key) : null;
    const resume = document.getElementById('studio-resume');
    if (resume) {
      if (entry) {
        resume.hidden = false;
        resume.innerHTML = `<a class="studio-resume-link" href="${escape(window.PortalContentLinks.href(entry.key, resumeOptions(entry, snapshot.items[entry.key], last)))}"><i data-lucide="history" aria-hidden="true"></i><div><strong>كمّل من آخر مرة</strong><p dir="auto">${escape(entry.title)}</p></div><span>كمّل المذاكرة</span><i data-lucide="arrow-left" aria-hidden="true"></i></a>`;
      } else if (last) {
        resume.hidden = false;
        resume.innerHTML = `<div class="studio-resume-recovery" role="status"><i data-lucide="alert-circle" aria-hidden="true"></i><div><strong>المصدر السابق لم يعد متاحاً</strong><p>تم تحديث خطة المواد أو إزالة هذا المحتوى. يمكنك استكشاف المصادر الحالية أو متابعة مادة أخرى.</p></div><a href="#library" class="studio-button">استكشف المصادر</a></div>`;
      } else {
        resume.hidden = true;
        resume.innerHTML = '';
      }
      if (window.PortalUI && typeof window.PortalUI.icons === 'function') {
        window.PortalUI.icons(resume);
      }
    }
    const continueResults = document.getElementById('continue-results');
    if (continueResults) {
      const history = Object.entries(snapshot.items || {})
        .filter(([, item]) => item.startedAt || item.reader || item.quiz)
        .sort((a, b) => String(b[1].reader?.updatedAt || b[1].startedAt || '').localeCompare(String(a[1].reader?.updatedAt || a[1].startedAt || '')))
        .map(([key, item]) => ({entry: window.PortalCatalog ? window.PortalCatalog.get(key) : null, item}))
        .filter(value => Boolean(value.entry));
      continueResults.innerHTML = history.length
        ? history.map(({entry: value, item}) => resourceRow(value, resumeOptions(value, item, last?.key === value.key ? last : null))).join('')
        : `<div class="studio-empty"><i data-lucide="book-open" aria-hidden="true"></i><h3>أول خطوة لسه قدّامك</h3><p>لما تبدأ شرح أو تدريب، هتلاقيه هنا عشان ترجع له بسهولة.</p><a href="#library" class="studio-button">استكشف المصادر</a></div>`;
      if (window.PortalUI && typeof window.PortalUI.icons === 'function') {
        window.PortalUI.icons(continueResults);
      }
    }
  }
  function library() {
    const query = document.getElementById('library-query');
    const courseSelect = document.getElementById('library-course');
    const kind = document.getElementById('library-kind');
    const statusSelect = document.getElementById('library-status');
    const allTas = document.getElementById('library-all-tas');
    const clear = document.getElementById('library-clear');
    let dirty = true;
    for (const course of window.COURSES_DATA) { const option = document.createElement('option'); option.value = course.id; option.textContent = window.PortalPresentation.course(course).name; courseSelect.append(option); }
    function render() {
      dirty = true;
      if (document.getElementById('studio-library').hidden) return;
      dirty = false;
      const searchEngine = window.PortalContentSearch;
      const entries = searchEngine ? searchEngine.search({
        query: query.value,
        courseId: courseSelect.value,
        kind: kind.value,
        status: statusSelect ? statusSelect.value : 'all',
        allTas: allTas.checked
      }) : [];
      const results = document.getElementById('library-results');
      document.getElementById('library-result-count').textContent = `${entries.length} مصدر متاح${query.value.trim() ? ' لبحثك' : ''}`;
      clear.hidden = !query.value;
      results.innerHTML = entries.length ? entries.map(entry => resourceRow(entry, entry.study ? {actionId: 'internal-study'} : entry.module ? {actionId: 'standalone-study'} : {})).join('') : '<div class="studio-empty"><i data-lucide="search-x" aria-hidden="true"></i><h3>مفيش مصادر مطابقة</h3><p>جرّب كلمة أقل، غيّر المادة أو نوع المصدر أو حالة المذاكرة، أو اعرض مصادر كل المعيدين.</p><button class="studio-button" id="library-reset">مسح البحث والفلاتر</button></div>';
      document.getElementById('library-reset')?.addEventListener('click', () => {
        query.value = '';
        courseSelect.value = 'all';
        kind.value = 'all';
        if (statusSelect) statusSelect.value = 'all';
        allTas.checked = false;
        render();
        query.focus();
      });
      window.PortalUI.icons(results);
    }
    query.addEventListener('input', render);
    courseSelect.addEventListener('change', render);
    kind.addEventListener('change', render);
    if (statusSelect) statusSelect.addEventListener('change', render);
    allTas.addEventListener('change', render);
    clear.addEventListener('click', () => { query.value = ''; render(); query.focus(); });
    window.addEventListener('studentProfileChanged', render);
    window.addEventListener('portal:progress-changed', render);
    window.addEventListener('portal:view-changed', () => { if (dirty) render(); });
    render();
  }
  function homeViews() {
    const sections = {courses: ['.a1-welcome', '#courses-section'], library: ['#studio-library'], continue: ['#studio-continue'], schedule: ['#schedule-section']};
    function show() {
      const hash = window.location.hash || '#courses-section';
      const view = ({'#library': 'library', '#continue': 'continue', '#schedule-section': 'schedule'})[hash] || 'courses';
      for (const [name, selectors] of Object.entries(sections)) for (const selector of selectors) document.querySelector(selector).hidden = name !== view;
      document.body.dataset.studioView = view;
      for (const link of document.querySelectorAll('[data-studio-nav]')) {
        if (link.dataset.studioNav === (view === 'courses' ? '#courses-section' : hash)) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
      }
      if (view === 'continue') readingHistory();
      window.dispatchEvent(new CustomEvent('portal:view-changed', {detail:{view}}));
    }
    window.addEventListener('hashchange', show); show();
    document.querySelector('.studio-hero a[href="#courses-section"]').addEventListener('click', event => {
      event.preventDefault();
      const jump = () => {
        document.getElementById('courses-section').scrollIntoView({block: 'start', behavior: document.body.dataset.motion === 'on' ? 'smooth' : 'instant'});
        document.getElementById('search-input').focus({preventScroll: true});
      };
      if (window.location.hash === '#courses-section') jump();
      else { window.addEventListener('hashchange', () => window.requestAnimationFrame(jump), {once: true}); window.location.hash = '#courses-section'; }
    });
    document.getElementById('studio-reset-courses').addEventListener('click', () => { document.querySelector('[data-filter="all"]').click(); document.getElementById('clear-search').click(); document.getElementById('search-input').focus(); });
    const grid = document.getElementById('courses-grid');
    const observer = new window.MutationObserver(decorateCourses); observer.observe(grid, {childList: true}); decorateCourses();
    window.addEventListener('pagehide', () => observer.disconnect());
    window.addEventListener('pageshow', () => { observer.observe(grid, {childList: true}); decorateCourses(); });
    readingHistory();
    if (window.PortalStudyState && typeof window.PortalStudyState.subscribe === 'function') {
      window.PortalStudyState.subscribe(() => {
        readingHistory();
        updateCourseSummaries();
      });
    }
    window.addEventListener('portal:progress-changed', () => {
      updateCourseSummaries();
      readingHistory();
    });
    window.addEventListener('studentProfileChanged', () => {
      updateCourseSummaries();
    });
    library();
  }
  function subjectView() {
    const course = window.COURSES_DATA.find(value => value.id === currentId);
    if (!course) return;
    document.body.style.cssText = palette(course.id);
    const switcher = document.getElementById('quick-course-select'); switcher.className = 'studio-course-switch'; switcher.setAttribute('aria-label', 'الانتقال إلى مادة أخرى');
    const previousContainer = switcher.parentElement;
    document.querySelector('.a1-course-heading-panel')?.append(switcher);
    previousContainer.remove();
    for (const button of document.querySelectorAll('button[data-resource-kind]')) {
      const icon = document.createElement('i'); icon.dataset.lucide = icons[button.dataset.resourceKind]; icon.setAttribute('aria-hidden', 'true'); button.prepend(icon);
    }
    window.PortalUI.icons(document.querySelector('.a1-resource-tabs'));
    const share = document.getElementById('share-btn');
    if (share) document.querySelector('.a1-course-breadcrumb')?.append(share);
    const parsed = window.PortalContentLinks.parse(window.location);
    const entry = parsed.isValid && window.PortalCatalog.get(parsed.item);
    if (entry?.study && parsed.actionId === 'internal-study') {
      document.querySelector(`[data-open-study-lecture="${Number(entry.id)}"]`)?.click();
    }
  }
  const api = { resumeOptions, readingHistory, decorateCourses, updateCourseSummaries };
  window.PortalStudio = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
  document.addEventListener('DOMContentLoaded', () => { shell(); if (home) homeViews(); else subjectView(); });
})();
