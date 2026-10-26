/* Content URL generation and parsing for Study Hub items. */
(function () {
  function createContentLinks(context = {}) {
    function getCatalog() {
      if (context.catalog) return context.catalog;
      if (typeof window !== 'undefined' && window.PortalCatalog) return window.PortalCatalog;
      return null;
    }

    function href(key, options = {}) {
      const catalog = getCatalog();
      const entry = catalog ? catalog.get(key) : null;
      if (entry?.module && options.actionId === 'standalone-study') {
        const url = new URL(entry.module.url, 'http://localhost/');
        const section = Number(options.slide);
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
      parse
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
