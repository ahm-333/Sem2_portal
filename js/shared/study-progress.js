/* Published-item progress and profile-aware course summaries.
 * Canonical lecture and section keys are counted once. Videos, assignments,
 * resources, and OS theory units do not enter denominators.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortalStudyProgress = factory().createStudyProgress();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SCOPE_DECLARATION = 'المحتوى المنشور على المنصة، ولا يشمل كامل المنهج الجامعي أو إتقان المادة';

  function createStudyProgress(options = {}) {
    function getDep(name, defaultGlobal) {
      if (options[name] !== undefined) return options[name];
      if (typeof window !== 'undefined' && window[defaultGlobal] !== undefined) {
        return window[defaultGlobal];
      }
      return null;
    }

    const catalog = getDep('catalog', 'PortalCatalog');
    const state = getDep('state', 'PortalStudyState');
    const courses = getDep('courses', 'COURSES_DATA') || [];
    const studentProfile = getDep('studentProfile', 'StudentProfile');
    const _scheduleConfig = getDep('scheduleConfig', 'SCHEDULE_CONFIG');

    function resolveKey(courseId, type, id) {
      if (catalog && typeof catalog.key === 'function') {
        return catalog.key(courseId, type, id);
      }
      return JSON.stringify([String(courseId), String(type), String(id)]);
    }

    function getEntry(key) {
      if (catalog && typeof catalog.get === 'function') {
        return catalog.get(key);
      }
      return null;
    }

    function getItemState(key) {
      if (state && typeof state.getItem === 'function') {
        return state.getItem(key);
      }
      return null;
    }

    function getStatus(key) {
      if (!key) return 'not-started';
      const entry = getEntry(key);
      const item = getItemState(key);

      const hasFullQuiz = Boolean(entry?.study?.hasFullQuiz);

      if (hasFullQuiz) {
        const quizVersion = entry?.study?.quizVersion;
        const quiz = item?.quiz;
        const questionCount = entry?.study?.questionCount || 0;

        const isCompletedVersion = Boolean(
          quizVersion && (
            (Array.isArray(quiz?.completedVersions) && quiz.completedVersions.includes(quizVersion)) ||
            (quiz?.lastCompleted && quiz.lastCompleted.version === quizVersion) ||
            (quiz?.version === quizVersion && quiz?.answers && questionCount > 0 && Object.keys(quiz.answers).length >= questionCount)
          )
        );

        if (isCompletedVersion) {
          return 'completed';
        }
      } else {
        if (Boolean(item?.manualComplete) === true) {
          return 'completed';
        }
      }

      const hasActivity = Boolean(
        item?.startedAt ||
        item?.reader ||
        (item?.quiz && Object.keys(item.quiz).length > 0) ||
        item?.manualComplete === false
      );

      return hasActivity ? 'in-progress' : 'not-started';
    }

    function getItemProgress(key) {
      const entry = getEntry(key);
      const item = getItemState(key);
      const status = getStatus(key);
      const hasFullQuiz = Boolean(entry?.study?.hasFullQuiz);

      return {
        key,
        status,
        isComplete: status === 'completed',
        isInProgress: status === 'in-progress',
        hasFullQuiz,
        canManualComplete: !hasFullQuiz,
        score: item?.quiz?.lastCompleted?.score,
        total: item?.quiz?.lastCompleted?.total,
        completedAt: item?.quiz?.lastCompleted?.completedAt
      };
    }

    function setManualComplete(key, value) {
      if (!key) return { saved: false, reason: 'invalid_key' };
      const entry = getEntry(key);

      if (entry?.study?.hasFullQuiz) {
        return { saved: false, reason: 'has_full_quiz' };
      }

      if (!state || typeof state.updateItem !== 'function') {
        return { saved: false, reason: 'no_state' };
      }

      const existing = getItemState(key);
      const patch = { manualComplete: Boolean(value) };
      if (!existing?.startedAt) {
        patch.startedAt = new Date().toISOString();
      }

      const result = state.updateItem(key, patch);

      if (result.saved && typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent !== 'undefined') {
        window.dispatchEvent(new CustomEvent('portal:progress-changed', {
          detail: { key, manualComplete: Boolean(value), status: getStatus(key) }
        }));
      }

      return result;
    }

    function getCourseSummary(courseId, explicitProfile) {
      const course = (courses || []).find(c => c.id === courseId);
      if (!course) {
        return {
          courseId,
          scope: SCOPE_DECLARATION,
          lectures: { total: 0, completed: 0, remaining: 0, inProgress: 0 },
          sections: { total: 0, completed: 0, remaining: 0, inProgress: 0 },
          total: { total: 0, completed: 0, remaining: 0, inProgress: 0 },
          percent: 0
        };
      }

      // Respect StudentProfile for stored vs explicit profile
      let normProfile = null;
      let studentTa = null;

      if (explicitProfile && studentProfile) {
        normProfile = studentProfile.normalize(explicitProfile);
        const sessions = studentProfile.getSectionSessions(courseId, normProfile.section);
        studentTa = sessions[0] ? sessions[0].ta : null;
      } else if (studentProfile) {
        normProfile = studentProfile.get();
        const staff = studentProfile.getCourseStaff(courseId);
        studentTa = staff ? staff.ta : null;
      }

      // 1. Lectures: canonical published lecture keys
      const lectureKeys = new Set(
        (course.lectures || []).map(lec => resolveKey(courseId, 'lecture', lec.id))
      );

      let lecCompleted = 0;
      let lecInProgress = 0;
      for (const key of lectureKeys) {
        const s = getStatus(key);
        if (s === 'completed') lecCompleted++;
        else if (s === 'in-progress') lecInProgress++;
      }
      const lecRemaining = Math.max(0, lectureKeys.size - lecCompleted);

      // 2. Sections: canonical published section keys matching student's TA
      const rawSections = course.sections || [];
      const matchedSections = studentProfile && studentTa
        ? studentProfile.filterItemsForTa(rawSections, 'my-ta', studentTa)
        : [];

      const sectionKeys = new Set(
        matchedSections.map(sec => resolveKey(courseId, 'section', sec.id))
      );

      let secCompleted = 0;
      let secInProgress = 0;
      for (const key of sectionKeys) {
        const s = getStatus(key);
        if (s === 'completed') secCompleted++;
        else if (s === 'in-progress') secInProgress++;
      }
      const secRemaining = Math.max(0, sectionKeys.size - secCompleted);

      // 3. Combined totals
      const totalCount = lectureKeys.size + sectionKeys.size;
      const completedCount = lecCompleted + secCompleted;
      const remainingCount = lecRemaining + secRemaining;
      const inProgressCount = lecInProgress + secInProgress;
      const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      return {
        courseId,
        scope: SCOPE_DECLARATION,
        lectures: {
          total: lectureKeys.size,
          completed: lecCompleted,
          remaining: lecRemaining,
          inProgress: lecInProgress
        },
        sections: {
          total: sectionKeys.size,
          completed: secCompleted,
          remaining: secRemaining,
          inProgress: secInProgress
        },
        total: {
          total: totalCount,
          completed: completedCount,
          remaining: remainingCount,
          inProgress: inProgressCount
        },
        percent
      };
    }

    function subscribe(listener) {
      if (state && typeof state.subscribe === 'function') {
        return state.subscribe(listener);
      }
      return () => {};
    }

    return {
      getStatus,
      getItemProgress,
      setManualComplete,
      getCourseSummary,
      subscribe
    };
  }

  return {
    createStudyProgress
  };
});
