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
        const slideNum = parseInt(options.slide, 10);
        if (!isNaN(slideNum) && slideNum > 0) {
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
          if (Array.isArray(parsed) && parsed.length === 3 && typeof parsed[0] === 'string' && typeof parsed[1] === 'string') {
            item = rawItem;
            isValid = true;
          }
        } catch (_) {
          isValid = false;
        }
      }

      const actionId = urlObj.searchParams.get('action');
      const rawSlide = urlObj.searchParams.get('slide');
      let slide = null;
      if (rawSlide != null) {
        const num = parseInt(rawSlide, 10);
        if (!isNaN(num) && num > 0) {
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
