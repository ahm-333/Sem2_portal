/* Presentation metadata only. Course IDs, source content and URLs stay authoritative. */
(function () {
  const courses = {
    'computer-architecture': {name: 'Computer Architecture', icon: 'cpu'},
    'computer-graphics': {name: 'Computer Graphics', icon: 'shapes'},
    'database-systems': {name: 'Database Systems', icon: 'database'},
    'data-structure': {name: 'Data Structures', icon: 'network'},
    'operating-system': {name: 'Operating Systems', icon: 'panels-top-left'},
    'report-writing': {name: 'Report Writing', icon: 'file-text'}
  };
  const inner = '<g fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M11 6H7v20h4M21 6h4v20h-4M16 3v6m0 14v6M3 16h6m14 0h6"/><rect x="11" y="11" width="10" height="10" rx="2.5"/><path d="m14 16 2 2 3-4"/></g>';
  window.PORTAL_MARK_INNER = inner;
  window.PORTAL_COURSE_ICONS = Object.values(courses).map(course => course.icon);
  window.PortalPresentation = {
    course: course => courses[course.id] || {name: course.name, icon: course.icon || 'book'},
    byCode: code => courses[Object.keys(courses).find(id => window.COURSES_DATA?.find(c => c.id === id)?.code === code)]
  };
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.a1-brand-mark').forEach(el => {
      el.replaceChildren();
      el.setAttribute('aria-hidden', 'true');
    });
  });
})();
