/* Content URL generation and parsing for Study Hub items. */
(function () {
  const LOCAL_STUDY_SELECTOR = '[data-open-study-lecture],[data-os-course-link],[data-standalone-study-link][data-action-id="standalone-study"]';

  function getUnifiedDbLectureId(entry, key) {
    if (entry) {
      if (entry.courseId === 'database-systems' && entry.type === 'lecture') {
        const id = String(entry.id);
        if (id === '2' || id === '3') return id;
      }
      return null;
    }
    if (typeof key === 'string') {
      try {
        const parsed = JSON.parse(key);
        if (
          Array.isArray(parsed) &&
          parsed.length === 3 &&
          parsed[0] === 'database-systems' &&
          parsed[1] === 'lecture' &&
          (parsed[2] === '2' || parsed[2] === '3')
        ) {
          return parsed[2];
        }
      } catch (_) {}
    }
    return null;
  }

  function isUnifiedDbLecture(entry, key) {
    return Boolean(getUnifiedDbLectureId(entry, key));
  }

  function createContentLinks(context = {}) {
    function getCatalog() {
      if (context.catalog) return context.catalog;
      if (typeof window !== 'undefined' && window.PortalCatalog) return window.PortalCatalog;
      return null;
    }

    function normalizeDbAnchor(raw) {
      if (typeof raw !== 'string') return '';
      const trimmed = raw.trim().replace(/^#/, '');
      if (!trimmed || !/^[\w.:-]+$/.test(trimmed)) return '';
      if (context.location?.normalizeAnchor) return context.location.normalizeAnchor(trimmed) || trimmed;
      if (typeof window !== 'undefined' && window.PortalLessonLocation?.normalizeAnchor) {
        return window.PortalLessonLocation.normalizeAnchor(trimmed) || trimmed;
      }
      if (trimmed === 'practice' || trimmed === 'practice-hub' || trimmed === 'quiz' || trimmed === 'quiz-section') {
        return 'practice';
      }
      if (trimmed === 'explanation' || trimmed === 'tab-explanation') return 'explanation';
      if (trimmed === 'original' || trimmed === 'tab-original') return 'original';
      const slideMatch = trimmed.match(/^(?:slide(?:-card)?[:\-_]?|slide-)(\d+)$/i);
      if (slideMatch) {
        const num = Number(slideMatch[1]);
        if (Number.isSafeInteger(num) && num > 0) return 'slide-' + num;
      }
      if (trimmed === 'mainContainer' || trimmed === 'topic-mainContainer') return 'topic-block-1';
      if (trimmed === 'topic-add' || trimmed === 'block-add') return 'topic-block-add';
      const topicMatch = trimmed.match(/^(topic[:\-_]?block[:\-_]?|topic[:\-_]|block[:\-_]|section[:\-_]|sec[:\-_])(\d+|[\w-]+)$/i);
      if (topicMatch) {
        let id = topicMatch[2];
        if (/block/i.test(topicMatch[1]) || /^\d+$/.test(id)) id = 'block-' + id;
        if (id.startsWith('topic-')) id = id.slice(6);
        return 'topic-' + id;
      }
      return /^[\w.-]+$/.test(trimmed) ? trimmed : '';
    }

    function href(key, options = {}) {
      const catalog = getCatalog();
      const entry = catalog ? catalog.get(key) : null;

      const dbLecId = getUnifiedDbLectureId(entry, key);

      if (dbLecId && options.actionId === 'standalone-study') {
        const defaultModuleUrl = dbLecId === '3' ? 'study/db/lesson.html?lecture=3' : 'study/db/lesson.html?lecture=2';
        const rawUrl = entry?.module?.url || defaultModuleUrl;
        const url = new URL(rawUrl, 'http://localhost/');
        const slideNum = Number(options.slide);
        const sectionNum = Number(options.section);
        const anchor = normalizeDbAnchor(options.anchor);
        if (options.tab === 'quiz' || anchor === 'practice') {
          url.searchParams.set('view', 'practice');
        } else if (anchor) {
          if (anchor.startsWith('slide-')) {
            const slideFromAnchor = Number(anchor.slice(6));
            if (Number.isSafeInteger(slideFromAnchor) && slideFromAnchor > 0) {
              url.searchParams.set('slide', String(slideFromAnchor));
              if (options.tab === 'original') url.searchParams.set('tab', 'original');
            } else {
              url.hash = anchor;
            }
          } else if (anchor === 'original') {
            url.searchParams.set('tab', 'original');
          } else if (anchor !== 'explanation') {
            url.hash = anchor;
          }
        } else if (Number.isSafeInteger(slideNum) && slideNum > 0) {
          url.searchParams.set('slide', String(slideNum));
          if (options.tab === 'original') url.searchParams.set('tab', 'original');
        } else if (Number.isSafeInteger(sectionNum) && sectionNum > 0) {
          const loc = context.location || (typeof window !== 'undefined' ? window.PortalLessonLocation : null);
          if (loc?.toWorkspaceUrl) {
            return loc.toWorkspaceUrl(dbLecId, { section: sectionNum, tab: options.tab });
          }
          url.searchParams.set('section', String(sectionNum));
        } else if (options.tab === 'original') {
          url.searchParams.set('tab', 'original');
        }
        return url.pathname.slice(1) + url.search + url.hash;
      }

      if (entry?.module && options.actionId === 'standalone-study') {
        const url = new URL(entry.module.url, 'http://localhost/');
        const section = Number(options.section ?? options.slide);
        if (typeof options.anchor === 'string' && /^[\w.-]+$/.test(options.anchor)) url.hash = options.anchor;
        else if (Number.isSafeInteger(section) && section > 0) url.searchParams.set('section', section);
        return url.pathname.slice(1) + url.search + url.hash;
      }

      let courseId = entry?.courseId;
      let track = entry?.track || 'lecture';
      let kind = entry?.kind || 'lectures';

      if (!entry && typeof key === 'string') {
        try {
          const arr = JSON.parse(key);
          if (Array.isArray(arr) && arr.length >= 3) {
            courseId = arr[0];
          }
        } catch (_) {}
      }

      if (!courseId) return 'subject.html';

      const params = new URLSearchParams();
      params.set('id', courseId);
      params.set('track', track);
      params.set('kind', kind);
      params.set('item', key);

      if (options.actionId) {
        params.set('action', String(options.actionId));
      }
      if (options.slide != null) {
        const slideNum = Number(options.slide);
        if (Number.isSafeInteger(slideNum) && slideNum > 0) {
          params.set('slide', String(slideNum));
        }
      }
      if (options.tab && ['explanation', 'original', 'quiz'].includes(options.tab)) {
        params.set('tab', options.tab);
      }

      return 'subject.html?' + params.toString();
    }

    function parse(urlOrLocation) {
      const fallback = {
        isValid: false,
        courseId: null,
        track: null,
        kind: null,
        item: null,
        actionId: null,
        slide: null,
        tab: null
      };

      if (!urlOrLocation) return fallback;

      let urlObj;
      try {
        if (typeof urlOrLocation === 'string') {
          urlObj = new URL(urlOrLocation, 'http://localhost/');
        } else if (urlOrLocation && typeof urlOrLocation.href === 'string') {
          urlObj = new URL(urlOrLocation.href, 'http://localhost/');
        } else if (urlOrLocation && typeof urlOrLocation.search === 'string') {
          urlObj = new URL('http://localhost/' + urlOrLocation.search);
        }
      } catch (_) {
        return fallback;
      }

      if (!urlObj) return fallback;

      const courseId = urlObj.searchParams.get('id');
      const track = urlObj.searchParams.get('track');
      const kind = urlObj.searchParams.get('kind');
      const rawItem = urlObj.searchParams.get('item');
      let item = null;
      let isValid = false;

      if (rawItem) {
        try {
          const parsed = JSON.parse(rawItem);
          if (Array.isArray(parsed) && parsed.length === 3 && parsed.every(value => typeof value === 'string' && value.length > 0) && JSON.stringify(parsed) === rawItem) {
            item = rawItem;
            const entry = getCatalog()?.get(item);
            isValid = Boolean(entry && entry.courseId === courseId);
          }
        } catch (_) {
          isValid = false;
        }
      }

      const actionId = urlObj.searchParams.get('action');
      const rawSlide = urlObj.searchParams.get('slide');
      let slide = null;
      if (rawSlide != null) {
        const num = Number(rawSlide);
        if (Number.isSafeInteger(num) && num > 0) {
          slide = num;
        }
      }

      const rawTab = urlObj.searchParams.get('tab');
      let tab = null;
      if (rawTab && ['explanation', 'original', 'quiz'].includes(rawTab)) {
        tab = rawTab;
      }

      return {
        isValid: isValid && Boolean(courseId),
        courseId,
        track,
        kind,
        item,
        actionId,
        slide,
        tab
      };
    }

    return {
      href,
      parse,
      isUnifiedDbLecture,
      LOCAL_STUDY_SELECTOR
    };
  }

  const defaultLinks = createContentLinks();

  if (typeof window !== 'undefined') {
    window.PortalContentLinks = defaultLinks;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      PortalContentLinks: defaultLinks,
      createContentLinks
    };
  }
})();
