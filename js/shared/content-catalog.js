/* Content identity and unified catalog for Study Hub features. */
(function () {
  function formatKey(courseId, type, id) {
    if (courseId === null || courseId === undefined || !type || id === null || id === undefined) {
      throw new TypeError('PortalCatalog.key requires valid courseId, type and id');
    }
    return JSON.stringify([String(courseId), String(type), String(id)]);
  }

  function sanitizeDescription(desc) {
    if (!desc) return '';
    return String(desc).replace(/سيريال.*$/i, '').trim();
  }

  function createCatalog(context = {}) {
    const courses = context.courses || [];
    const studyCatalog = context.studyCatalog || {};
    const presentation = context.presentation || null;
    const modules = context.modules || [];

    const entriesByKey = new Map();
    const allEntries = [];

    function addEntry(entry) {
      entriesByKey.set(entry.key, entry);
      allEntries.push(entry);
    }

    courses.forEach(course => {
      const courseId = course.id;
      const courseName = course.name;
      const displayCourseName = (presentation && typeof presentation.course === 'function'
        ? presentation.course(course)?.name
        : course.name) || course.name;
      const code = course.code || '';

      // 1. Lectures
      (course.lectures || []).forEach(item => {
        const id = item.id;
        const key = formatKey(courseId, 'lecture', id);
        const study = studyCatalog[courseId]?.[id] ? Object.assign({}, studyCatalog[courseId][id]) : null;
        const actions = [];
        if (study) {
          actions.push({ id: 'internal-study', type: 'internal', label: 'المذاكرة التفاعلية' });
        }
        if (item.driveViewUrl) actions.push({ id: 'driveViewUrl', field: 'driveViewUrl', url: item.driveViewUrl, label: 'عرض على Drive' });
        if (item.drivePreviewUrl) actions.push({ id: 'drivePreviewUrl', field: 'drivePreviewUrl', url: item.drivePreviewUrl, label: 'معاينة Drive' });
        if (item.driveDownloadUrl) actions.push({ id: 'driveDownloadUrl', field: 'driveDownloadUrl', url: item.driveDownloadUrl, label: 'تحميل من Drive' });
        if (item.pdfUrl && item.pdfUrl !== item.driveViewUrl && item.pdfUrl !== item.drivePreviewUrl) {
          actions.push({ id: 'pdfUrl', field: 'pdfUrl', url: item.pdfUrl, label: 'ملف PDF' });
        }
        if (item.studyManualUrl) actions.push({ id: 'studyManualUrl', field: 'studyManualUrl', url: item.studyManualUrl, label: 'موقع الشرح' });

        addEntry({
          key,
          courseId,
          type: 'lecture',
          id,
          courseName,
          displayCourseName,
          code,
          title: item.title || '',
          arabicTitle: item.arabicTitle || null,
          description: item.notes || '',
          topics: Array.isArray(item.topics) ? item.topics.slice() : [],
          ta: null,
          track: 'lecture',
          kind: 'lectures',
          actions,
          study
        });
      });

      // 2. Sections
      (course.sections || []).forEach(item => {
        const id = item.id;
        const key = formatKey(courseId, 'section', id);
        const actions = [];
        if (item.driveViewUrl) actions.push({ id: 'driveViewUrl', field: 'driveViewUrl', url: item.driveViewUrl, label: 'عرض على Drive' });
        if (item.drivePreviewUrl) actions.push({ id: 'drivePreviewUrl', field: 'drivePreviewUrl', url: item.drivePreviewUrl, label: 'معاينة Drive' });
        if (item.driveDownloadUrl) actions.push({ id: 'driveDownloadUrl', field: 'driveDownloadUrl', url: item.driveDownloadUrl, label: 'تحميل من Drive' });
        if (item.sheetUrl && item.sheetUrl !== item.driveViewUrl) actions.push({ id: 'sheetUrl', field: 'sheetUrl', url: item.sheetUrl, label: 'شيت السكشن' });
        if (item.videoUrl) actions.push({ id: 'videoUrl', field: 'videoUrl', url: item.videoUrl, label: 'فيديو الشرح' });
        if (item.localFile) actions.push({ id: 'localFile', field: 'localFile', url: item.localFile, label: 'ملف محلي' });

        addEntry({
          key,
          courseId,
          type: 'section',
          id,
          courseName,
          displayCourseName,
          code,
          title: item.title || '',
          arabicTitle: item.arabicTitle || null,
          description: item.notes || '',
          topics: Array.isArray(item.topics) ? item.topics.slice() : [],
          ta: item.ta || null,
          track: 'section',
          kind: 'sections',
          actions,
          study: null
        });
      });

      // 3. Assignments
      (course.assignments || []).forEach(item => {
        const id = item.id;
        const key = formatKey(courseId, 'assignment', id);
        const actions = [];
        if (item.fileUrl) actions.push({ id: 'fileUrl', field: 'fileUrl', url: item.fileUrl, label: 'ملف التكليف' });
        if (item.driveViewUrl) actions.push({ id: 'driveViewUrl', field: 'driveViewUrl', url: item.driveViewUrl, label: 'عرض على Drive' });
        if (item.drivePreviewUrl) actions.push({ id: 'drivePreviewUrl', field: 'drivePreviewUrl', url: item.drivePreviewUrl, label: 'معاينة Drive' });
        if (item.driveDownloadUrl) actions.push({ id: 'driveDownloadUrl', field: 'driveDownloadUrl', url: item.driveDownloadUrl, label: 'تحميل من Drive' });
        if (item.localFile) actions.push({ id: 'localFile', field: 'localFile', url: item.localFile, label: 'ملف محلي' });

        addEntry({
          key,
          courseId,
          type: 'assignment',
          id,
          courseName,
          displayCourseName,
          code,
          title: item.title || '',
          arabicTitle: item.arabicTitle || null,
          description: item.notes || item.description || '',
          topics: Array.isArray(item.topics) ? item.topics.slice() : [],
          ta: item.ta || null,
          track: 'section',
          kind: 'assignments',
          actions,
          study: null
        });
      });

      // 4. Videos
      (course.videoExplanations || []).forEach(item => {
        const id = item.id;
        const key = formatKey(courseId, 'video', id);
        const actions = [];
        if (item.url) actions.push({ id: 'url', field: 'url', url: item.url, label: 'مشاهدة الفيديو' });

        addEntry({
          key,
          courseId,
          type: 'video',
          id,
          courseName,
          displayCourseName,
          code,
          title: item.title || '',
          arabicTitle: item.subtitle || null,
          description: [item.author, item.badge].filter(Boolean).join(' • '),
          topics: [],
          ta: null,
          track: 'lecture',
          kind: 'videos',
          actions,
          study: null
        });
      });

      // 5. Theory Resources
      (course.resources || []).forEach(item => {
        const id = item.id;
        const key = formatKey(courseId, 'theory-resource', id);
        const actions = [];
        if (item.fileUrl) actions.push({ id: 'fileUrl', field: 'fileUrl', url: item.fileUrl, label: 'عرض الملف' });

        addEntry({
          key,
          courseId,
          type: 'theory-resource',
          id,
          courseName,
          displayCourseName,
          code,
          title: item.title || '',
          arabicTitle: null,
          description: item.notes || '',
          topics: [],
          ta: item.ta || null,
          track: 'lecture',
          kind: 'resources',
          actions,
          study: null
        });
      });

      // 6. Practical Resources
      (course.practicalResources || []).forEach(item => {
        const id = item.id;
        const key = formatKey(courseId, 'practical-resource', id);
        const actions = [];
        if (item.fileUrl) actions.push({ id: 'fileUrl', field: 'fileUrl', url: item.fileUrl, label: 'تحميل/عرض الملف' });
        if (item.folderUrl) actions.push({ id: 'folderUrl', field: 'folderUrl', url: item.folderUrl, label: 'مجلد Drive' });

        addEntry({
          key,
          courseId,
          type: 'practical-resource',
          id,
          courseName,
          displayCourseName,
          code,
          title: item.title || '',
          arabicTitle: null,
          description: sanitizeDescription(item.notes),
          topics: [],
          ta: item.ta || null,
          track: 'section',
          kind: 'resources',
          actions,
          study: null
        });
      });

      // 7. Explanation Site
      if (course.explanationSite && course.explanationSite.url) {
        const key = formatKey(courseId, 'explanation-site', 'site');
        const actions = [{ id: 'url', field: 'url', url: course.explanationSite.url, label: 'زيارة موقع الشرح' }];

        addEntry({
          key,
          courseId,
          type: 'explanation-site',
          id: 'site',
          courseName,
          displayCourseName,
          code,
          title: course.explanationSite.title || 'منصة الشرح التفاعلي',
          arabicTitle: null,
          description: course.explanationSite.description || '',
          topics: Array.isArray(course.explanationSite.features) ? course.explanationSite.features.slice() : [],
          ta: null,
          track: 'lecture',
          kind: 'resources',
          actions,
          study: null
        });
      }
    });

    modules.forEach(lesson => {
      const existing = entriesByKey.get(lesson.key);
      if (existing) {
        existing.module = lesson;
        existing.actions.unshift({id: 'standalone-study', type: 'internal', url: lesson.url, label: 'الشرح التفاعلي'});
        return;
      }
      const course = courses.find(value => value.id === lesson.courseId);
      if (!course) return;
      addEntry({key: lesson.key, courseId: course.id, type: lesson.type, id: lesson.id,
        courseName: course.name, displayCourseName: presentation?.course(course)?.name || course.name,
        code: course.code || '', title: lesson.title, arabicTitle: null, description: '', topics: [],
        ta: null, track: 'lecture', kind: 'resources', study: null, module: lesson,
        actions: [{id: 'standalone-study', type: 'internal', url: lesson.url, label: 'الشرح التفاعلي'}]});
    });

    return {
      key: formatKey,
      list: () => allEntries.slice(),
      get: (lookupKey) => {
        if (typeof lookupKey !== 'string') return null;
        return entriesByKey.get(lookupKey) || null;
      }
    };
  }

  const catalog = {
    key: formatKey,
    createCatalog
  };

  if (typeof window !== 'undefined') {
    window.PortalCatalog = createCatalog({
      courses: window.COURSES_DATA || [],
      studyCatalog: window.STUDY_CATALOG || {},
      modules: window.PortalStudyModules || [],
      presentation: window.PortalPresentation || null
    });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      createCatalog,
      PortalCatalog: catalog
    };
  }
})();
