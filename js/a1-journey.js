/* A1 information architecture over the real portal modules. No demo data or new study storage. */
(function () {
  const entry = new URL(window.location.href);
  function home() {
    const schedule = document.getElementById('schedule-section');
    const courses = document.getElementById('courses-section');
    const welcome = document.querySelector('.a1-welcome');
    function show() {
      const timetable = window.location.hash === '#schedule-section';
      document.body.dataset.homeView = timetable ? 'schedule' : 'courses';
      schedule.hidden = !timetable; courses.hidden = timetable; welcome.hidden = timetable;
      document.querySelectorAll('.a1-desktop-nav a,.a1-mobile-nav a').forEach(link => {
        const active = link.hash === (timetable ? '#schedule-section' : '#courses-section');
        if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
      });
      if (timetable) window.PortalIntro?.dismiss();
    }
    show();
    window.addEventListener('hashchange', () => { show(); window.scrollTo({top: 0, behavior: 'instant'}); document.querySelector('main').focus({preventScroll: true}); });
    const subtitle = courses.querySelector('p');
    if (subtitle) subtitle.textContent = 'اختار المادة، وبعدها نوع المصدر اللي محتاجه.';
  }
  function subject() {
    const main = document.getElementById('main-content');
    const lecture = document.getElementById('track-panel-lecture');
    const section = document.getElementById('track-panel-section');
    if (!main || !lecture || !section) return;
    const courseId = new URL(window.location.href).searchParams.get('id') || window.COURSES_DATA[0]?.id;
    const course = window.COURSES_DATA.find(c => c.id === courseId);
    if (!course) return;
    const byId = id => document.getElementById(id);
    const videos = byId('video-explanations-section');
    const lectures = byId('lectures-list').parentElement;
    const theory = byId('theory-resources-list').parentElement;
    const external = byId('exp-title').closest('.hero-explanation-card');
    const sections = byId('sections-card'), assignments = byId('assignments-section-panel'), practical = byId('practical-resources-panel');
    const kinds = [['lectures', 'المحاضرات'], ['sections', 'السكاشن'], ['videos', 'الفيديو'], ['assignments', 'التكليفات'], ['resources', 'مصادر ومراجع']];
    const heading = byId('subject-title-en').closest('.glass-panel');
    heading.className = 'a1-course-heading-panel';
    const staff = byId('subject-doctor-info').parentElement;
    const context = document.createElement('details'); context.className = 'a1-course-context';
    context.open = window.matchMedia('(min-width:1024px)').matches;
    context.innerHTML = '<summary>مجموعتك ومواعيد المادة</summary>';
    context.append(staff, byId('lecture-time-banner'), byId('section-time-banner'));
    const titleRow = document.createElement('div'); titleRow.className = 'a1-course-title-row';
    const titleCopy = document.createElement('div'); titleCopy.className = 'a1-course-title-copy';
    const titleLine = document.createElement('div'); titleLine.className = 'a1-course-title-line';
    titleLine.append(byId('subject-title-en'), byId('subject-badge-code'));
    titleCopy.append(titleLine, byId('subject-title-ar')); titleRow.append(byId('subject-icon-box'), titleCopy);
    const overview = document.createElement('details'); overview.className = 'a1-course-overview'; overview.innerHTML = '<summary>عن المادة</summary>';
    overview.append(byId('subject-category'), byId('subject-desc')); heading.replaceChildren(titleRow, overview);
    byId('crumb-subject-name').parentElement.parentElement.classList.add('a1-course-breadcrumb');
    const trackButtons = [...document.querySelectorAll('[data-track]')];
    const oldTrackArea = trackButtons[0].parentElement.parentElement;
    const tracks = document.createElement('div'); tracks.className = 'a1-track-tabs'; tracks.setAttribute('aria-label', 'مسار المادة');
    trackButtons.forEach(button => { button.textContent = button.dataset.track === 'lecture' ? 'المحاضرة والنظري' : 'السكشن والعملي'; tracks.append(button); });
    oldTrackArea.replaceWith(tracks);
    const quick = section.querySelector('a[href="#sections-card"]')?.parentElement;
    // The resource tabs replace the duplicated in-page shortcut row; its badge remains live.
    const badge = byId('quick-badge-assignments'); if (badge) { badge.hidden = true; main.append(badge); }
    quick?.remove();
    const nav = document.createElement('nav'); nav.className = 'a1-resource-tabs'; nav.setAttribute('aria-label', 'نوع المصدر');
    nav.innerHTML = kinds.map(([kind, text]) => `<button type="button" data-resource-kind="${kind}" aria-pressed="false">${text}</button>`).join('');
    const materials = document.createElement('section'); materials.className = 'a1-materials';
    const layout = document.createElement('div'); layout.className = 'a1-course-layout';
    tracks.before(layout); materials.append(tracks, nav);
    const filters = byId('sections-filter-container'); materials.append(filters, lecture, section); layout.append(materials, context);
    const cards = [external, videos, lectures, theory, sections, assignments, practical];
    cards.forEach(card => card.classList.add('a1-family-panel'));
    for (const [card, label, count] of [[lectures, 'المحاضرات والمراجع', 'badge-lectures-count'], [videos, 'الفيديوهات', 'badge-videos-count'], [sections, 'السكاشن والشيتات', null], [assignments, 'التكليفات', 'badge-assignments-count'], [theory, 'ملخصات وامتحانات النظري', null], [practical, 'أدوات وامتحانات العملي', null]]) {
      const header = card.firstElementChild, title = header.querySelector('h3');
      if (!title) continue;
      title.textContent = label;
      const caption = document.createElement('div'); caption.className = 'a1-family-caption'; caption.append(title);
      if (count && byId(count)) caption.append(byId(count));
      const folder = card === lectures ? byId('course-drive-folder-link') : null;
      const sectionFolders = card === sections ? byId('sections-drive-folders-container') : null;
      header.className = 'a1-family-heading'; header.replaceChildren(caption);
      if (folder) { folder.setAttribute('aria-label', 'فتح مجلد محاضرات المادة في Google Drive'); folder.querySelector('span')?.classList.add('a1-folder-label'); header.append(folder); }
      if (sectionFolders) header.append(sectionFolders);
    }
    let kind = 'lectures', syncing = false;
    const validKind = value => kinds.some(([name]) => value === name);
    window.PortalJourney = {
      selectFamily: (nextKind, options = {}) => show(nextKind, Boolean(options.push))
    };
    function show(next, push = false) {
      if (!validKind(next)) next = 'lectures';
      const before = window.location.href;
      const currentTrack = new URL(before).searchParams.get('track') || 'lecture';
      const desiredTrack = ['sections', 'assignments'].includes(next) ? 'section' : next === 'resources' ? currentTrack : 'lecture';
      syncing = true; trackButtons.find(button => button.dataset.track === desiredTrack).click(); syncing = false;
      kind = next;
      const visible = ({lectures: [lectures], sections: [sections], videos: [videos], assignments: [assignments], resources: [external, theory, practical]})[kind];
      cards.forEach(card => { card.hidden = !visible.includes(card); });
      lecture.classList.toggle('hidden', !visible.some(card => lecture.contains(card)));
      section.classList.toggle('hidden', !visible.some(card => section.contains(card)));
      filters.dataset.familyHidden = String(!['sections', 'assignments', 'resources'].includes(kind));
      nav.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.resourceKind === kind)));
      document.body.dataset.resourceKind = kind;
      const url = new URL(window.location.href); url.searchParams.set('kind', kind);
      if (push && before !== url.href) { window.history.replaceState(null, '', before); window.history.pushState(null, '', url); }
      else window.history.replaceState(null, '', url);
      window.dispatchEvent(new CustomEvent('portal:family-changed', { detail: { kind, track: desiredTrack } }));
    }
    nav.addEventListener('click', event => { const button = event.target.closest('[data-resource-kind]'); if (button) show(button.dataset.resourceKind, true); });
    trackButtons.forEach(button => button.addEventListener('click', () => { if (!syncing) show(button.dataset.track === 'lecture' ? 'lectures' : 'sections'); }));
    function requested() {
      const value = new URL(window.location.href).searchParams.get('kind');
      if (validKind(value)) return value;
      if (entry.searchParams.get('track') === 'section') {
        if (window.location.hash === '#assignments-section-panel') return 'assignments';
        if (window.location.hash === '#practical-resources-panel') return 'resources';
        return 'sections';
      }
      return 'lectures';
    }
    window.addEventListener('popstate', () => show(requested()));
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#assignments-section-panel') show('assignments');
      if (window.location.hash === '#practical-resources-panel') show('resources');
    });
    const lists = [['lectures-list', course.lectures], ['sections-list', course.sections], ['video-explanations-list', course.videoExplanations], ['assignments-list', course.assignments], ['theory-resources-list', course.resources], ['practical-resources-list', course.practicalResources]];
    function compact(list, items = []) {
      for (const row of [...list.children]) {
        if (row.dataset.a1Row || !row.querySelector('a[href],button')) continue;
        const title = row.querySelector('h4'); if (!title) continue;
        const savedKey = row.getAttribute('data-content-key') || row.dataset.contentKey;
        const item = items.find(value => value.title === title.textContent.trim());
        let subtitle = title.nextElementSibling?.tagName === 'P' ? title.nextElementSibling : null;
        if (!subtitle && (item?.arabicTitle || item?.subtitle)) { subtitle = document.createElement('p'); subtitle.textContent = item.arabicTitle || item.subtitle; }
        const actions = document.createElement('div'); actions.className = 'a1-source-actions';
        let internal = false;
        for (const action of [...row.querySelectorAll('a[href],button')]) {
          if (action.matches('[data-open-study-lecture],[data-os-course-link]')) { if (internal) { action.remove(); continue; } internal = true; action.textContent = 'فتح الشرح'; }
          actions.append(action);
        }
        const primary = actions.querySelector('[data-open-study-lecture],[data-os-course-link]') || actions.querySelector('[data-preview-file]') || actions.querySelector('[data-play-url]') || actions.querySelector('a');
        primary?.classList.add('a1-action-primary');
        const copy = document.createElement('div'); copy.className = 'a1-source-copy'; title.dir = 'auto'; copy.append(title); if (subtitle) copy.append(subtitle);
        const meta = document.createElement('p'); meta.className = 'a1-source-meta';
        meta.textContent = [item?.fileType?.toUpperCase(), item?.ta, internal ? 'شرح داخلي متاح' : null].filter(Boolean).join(' · '); copy.append(meta);
        const details = document.createElement('details'); details.className = 'a1-source-details'; details.innerHTML = '<summary>التفاصيل والمحاور</summary>';
        const original = document.createElement('div'); while (row.firstChild) original.append(row.firstChild); details.append(original);
        row.className = 'a1-source-row'; row.dataset.a1Row = 'true'; if (savedKey) row.setAttribute('data-content-key', savedKey); row.append(copy, actions, details);
      }
    }
    for (const [id, items] of lists) {
      const list = byId(id); compact(list, items);
      const observer = new window.MutationObserver(() => compact(list, items)); observer.observe(list, {childList: true});
      window.addEventListener('pagehide', () => observer.disconnect());
      window.addEventListener('pageshow', () => observer.observe(list, {childList: true}));
    }
    show(requested());
    window.dispatchEvent(new CustomEvent('portal:content-ready', { detail: { courseId: course.id } }));
  }
  document.addEventListener('DOMContentLoaded', () => { if (document.body.dataset.page === 'home') home(); else subject(); });
})();
