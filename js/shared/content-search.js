/* Studio resource search, rank-tier sorting, and progress-status filtering.
 * Reuses the canonical catalog, existing normalization, and Study 06 progress semantics.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const api = factory();
    const instance = api.createContentSearch();
    instance.createContentSearch = api.createContentSearch;
    root.PortalContentSearch = instance;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function createContentSearch(options = {}) {
    function getDep(name, defaultGlobal) {
      if (options[name] !== undefined) return options[name];
      if (typeof window !== 'undefined' && window[defaultGlobal] !== undefined) {
        return window[defaultGlobal];
      }
      return null;
    }

    const catalog = getDep('catalog', 'PortalCatalog');
    const progress = getDep('progress', 'PortalStudyProgress');
    const studentProfile = getDep('studentProfile', 'StudentProfile');

    function normalize(value) {
      return String(value ?? '')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, '')
        .replace(/[إأآٱ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .trim();
    }

    function isProgressEligible(entry) {
      if (!entry) return false;
      return (entry.type === 'lecture' || entry.type === 'section') &&
        entry.kind !== 'resources' &&
        entry.kind !== 'videos' &&
        entry.kind !== 'assignments';
    }

    function getItemStatus(key, entry) {
      const itemEntry = entry || (catalog && typeof catalog.get === 'function' ? catalog.get(key) : null);
      if (!isProgressEligible(itemEntry)) return null;
      if (progress && typeof progress.getStatus === 'function') {
        return progress.getStatus(key);
      }
      return 'not-started';
    }

    function computeRank(queryNorm, tokens, entry) {
      if (!tokens.length) return 0;

      const normCode = normalize(entry.code);
      const normTitle = normalize(entry.title);
      const normArabicTitle = normalize(entry.arabicTitle);
      const normDisplayCourse = normalize(entry.displayCourseName);
      const normCourse = normalize(entry.courseName);
      const normTopics = (entry.topics || []).map(normalize);
      const normDescription = normalize(entry.description);

      // Tier 1: Exact code or exact title
      if (normCode === queryNorm || normTitle === queryNorm || (normArabicTitle && normArabicTitle === queryNorm)) {
        return 1;
      }

      // Tier 2: Prefix on code or title
      if ((normCode && normCode.startsWith(queryNorm)) ||
          (normTitle && normTitle.startsWith(queryNorm)) ||
          (normArabicTitle && normArabicTitle.startsWith(queryNorm))) {
        return 2;
      }

      // Tier 3: Contiguous full query phrase in title
      if ((normTitle && normTitle.includes(queryNorm)) ||
          (normArabicTitle && normArabicTitle.includes(queryNorm))) {
        return 3;
      }

      // Tier 4: All query tokens found in title, course name, or code terms
      const titleBlob = [normTitle, normArabicTitle, normCode, normDisplayCourse, normCourse].filter(Boolean).join(' ');
      if (tokens.every(token => titleBlob.includes(token))) {
        return 4;
      }

      // Tier 5: Topics contain full query or all tokens
      const topicsBlob = normTopics.join(' ');
      if (topicsBlob.includes(queryNorm) || tokens.every(token => topicsBlob.includes(token))) {
        return 5;
      }

      // Tier 6: Description contains all tokens
      if (tokens.every(token => normDescription.includes(token))) {
        return 6;
      }

      // Tier 7: Any other match (e.g. combined fields)
      return 7;
    }

    function search(criteria = {}) {
      if (!catalog || typeof catalog.list !== 'function') return [];

      const query = String(criteria.query || '');
      const queryNorm = normalize(query);
      const tokens = queryNorm.split(/\s+/).filter(Boolean);

      const courseId = criteria.courseId || 'all';
      const kind = criteria.kind || 'all';
      const status = criteria.status || 'all';
      const allTas = Boolean(criteria.allTas);
      const explicitProfile = criteria.explicitProfile || null;

      const allEntries = catalog.list();
      const matches = [];

      for (let i = 0; i < allEntries.length; i++) {
        const entry = allEntries[i];
        if (!entry.actions || !entry.actions.length) continue;

        // 1. Course filter
        if (courseId !== 'all' && entry.courseId !== courseId) continue;

        // 2. Kind filter
        if (kind !== 'all') {
          if (kind === 'interactive') {
            if (!entry.study && !entry.module) continue;
          } else if (entry.kind !== kind) {
            continue;
          }
        }

        // 3. TA filter
        if (!allTas && entry.ta) {
          if (studentProfile && typeof studentProfile.getCourseStaff === 'function' && typeof studentProfile.isTaMatch === 'function') {
            const staff = explicitProfile ? studentProfile.getCourseStaff(entry.courseId, explicitProfile) : studentProfile.getCourseStaff(entry.courseId);
            if (staff && !studentProfile.isTaMatch(entry.ta, staff.ta)) {
              continue;
            }
          }
        }

        // 4. Progress status filter
        if (status !== 'all') {
          if (!isProgressEligible(entry)) continue;
          const itemStatus = getItemStatus(entry.key, entry);
          if (itemStatus !== status) continue;
        }

        // 5. Query matching
        if (tokens.length > 0) {
          const fullText = normalize([
            entry.title,
            entry.arabicTitle,
            entry.displayCourseName,
            entry.courseName,
            entry.code,
            entry.description,
            ...(entry.topics || [])
          ].join(' '));

          if (!tokens.every(token => fullText.includes(token))) {
            continue;
          }
        }

        const rank = computeRank(queryNorm, tokens, entry);
        matches.push({
          entry,
          rank,
          index: i
        });
      }

      // Sort by rank ascending, breaking ties by catalog index (stable determinism)
      matches.sort((a, b) => {
        if (a.rank !== b.rank) {
          return a.rank - b.rank;
        }
        return a.index - b.index;
      });

      return matches.map(m => m.entry);
    }

    return {
      normalize,
      isProgressEligible,
      getItemStatus,
      computeRank,
      search,
      createContentSearch
    };
  }

  return {
    createContentSearch
  };
});
