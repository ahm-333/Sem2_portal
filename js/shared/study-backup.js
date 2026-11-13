/* Complete study backup coverage, validation, preview, and atomic restore.
 * Covers sem2_study_v1 (journal), sem2_standalone_v1 (bridges), and sem2_standalone_check_v1 (checks).
 * Excludes student profile, themes, display prefs, power-tool runtime timers/exams, and legacy quiz/bookmark keys.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortalStudyBackup = factory().createStudyBackup();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const PROJECT_ID = 'sem2-portal-study';
  const FORMAT_VERSION = 1;
  const SCHEMA_VERSION = 1;
  const STANDALONE_VERSION = 1;
  const MAX_BYTES = 1048576; // 1 MiB strict pre-parse limit

  const TYPES = ['lecture', 'section', 'assignment', 'video', 'theory-resource', 'practical-resource', 'explanation-site'];
  const KEY_PART_RE = /^[a-zA-Z0-9._-]{1,64}$/;
  const SAFE_ID_RE = /^[a-zA-Z0-9._-]{1,64}$/;
  const QUESTION_ID_RE = /^[a-zA-Z0-9._:-]{1,64}$/;
  const BRIDGE_ANCHOR_RE = /^[\w.-]*$/;
  const CHECK_ID_RE = /^[\w-]+$/;
  const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/;
  const DANGEROUS_SCHEME_RE = /(?:^|[^a-zA-Z0-9])(?:javascript|data|vbscript|file|https?):/i;
  const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

  const COVERAGE_MANIFEST = {
    included: [
      {
        id: 'study-journal',
        label: 'تقدم الدروس والكويزات والبدء وآخر موضع قراءة',
        keys: ['sem2_study_v1:*']
      },
      {
        id: 'standalone-bridges',
        label: 'مواضع وعلامات الدروس المستقلة',
        keys: ['sem2_standalone_v1:*']
      },
      {
        id: 'standalone-checks',
        label: 'علامات الأقسام المحلية داخل الدروس',
        keys: ['sem2_standalone_check_v1:*']
      }
    ],
    excluded: [
      {
        id: 'student-profile',
        label: 'الشعبة والسكشن وإعداد الزيارة الأولى',
        keys: ['sem2_student_profile', 'sem2_first_visit_configured']
      },
      {
        id: 'themes-display',
        label: 'الثيم وتكبير الخط وتباعد الأسطر ورسائل التعريف',
        keys: ['sem2_portal_theme', 'study-arch-theme', 'sem2_theme', 'sem2_cg_font_scale', 'sem2_cg_line_spacing', 'sem2-*-intro-*']
      },
      {
        id: 'power-tools-runtime',
        label: 'حالة الامتحان النشط والمؤقت والإشعارات',
        keys: ['sem2_active_exam_v1:*', 'sem2_study_timer_*', 'sem2_read_notifications_v1']
      },
      {
        id: 'ephemeral-session',
        label: 'ترتيب اختيارات الكويز المؤقت في الجلسة',
        keys: ['sessionStorage sem2_quiz_choices_v1:*']
      },
      {
        id: 'legacy-standalone',
        label: 'إشارات وبنك الأسئلة القديم خارج السجل الموحد',
        keys: ['sem2_ds_question_bank_bookmarks', 'sem2_cg_chapter*_answers_v1']
      },
      {
        id: 'authored-content',
        label: 'ملفات المواد والأسئلة والجدول المرجعية للموقع',
        keys: ['courses-data', 'study-catalog', 'schedule-data']
      }
    ]
  };

  const ERROR_MESSAGES = {
    file_too_large: 'حجم الملف أكبر من الحد المسموح (1 ميجابايت).',
    empty: 'الملف فاضي أو مفيهوش بيانات.',
    invalid_json: 'الملف مش بصيغة JSON صالحة.',
    unsupported_version: 'إصدار النسخة الاحتياطية غير مدعوم في النسخة الحالية من المنصة.',
    invalid_format: 'بنية النسخة الاحتياطية غير صالحة أو تحتوي على حقول غير معروفة.',
    invalid_quiz_answer: 'إجابات الكويز داخل الملف لا تطابق أسئلة النسخة الحالية.',
    unsafe_value: 'الملف يحتوي على قيم غير مسموح بها وتم رفضه لحماية بياناتك.',
    confirmation_required: 'لازم تأكد الاسترجاع يدويًا بعد مراجعة الملخص.',
    corrupt: 'البيانات الحالية على المتصفح تالفة، وتم إيقاف العملية بدون تغييرها لحماية البيانات.',
    'unsupported-version': 'البيانات الحالية على المتصفح من إصدار أحدث، وتم إيقاف العملية بدون تعديل.',
    concurrent_change: 'حصل تعديل جديد في المذاكرة في تبويب تاني أثناء المعاينة. راجع الملخص المحدّث قبل التأكيد.',
    quota: 'مساحة التخزين ممتلئة أو متوقفة دلوقتي، وما تمش تغيير أي بيانات حالية.',
    session: 'الحفظ الدائم غير متاح حاليًا في المتصفح، ومتمش استبدال البيانات.',
    unavailable: 'خدمة حالة المذاكرة غير متاحة حاليًا.'
  };

  const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
  const clone = value => JSON.parse(JSON.stringify(value));
  const isText = value => typeof value === 'string' && value.length > 0;
  const isNonNegInt = value => Number.isSafeInteger(value) && value >= 0;

  function isPlainObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const proto = Object.getPrototypeOf(value);
    return proto === null || Object.getPrototypeOf(proto) === null;
  }

  function hasExactAllowedKeys(obj, allowed, required = allowed) {
    if (!isPlainObject(obj)) return false;
    const keys = Object.keys(obj);
    if (!keys.every(k => allowed.includes(k))) return false;
    return required.every(k => own(obj, k));
  }

  function isIsoDate(value) {
    return isText(value) && ISO_DATE_RE.test(value) && Number.isFinite(Date.parse(value));
  }

  function isStandaloneDate(value) {
    if (typeof value !== 'string') return false;
    if (value === '') return true;
    return isIsoDate(value) || (/^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value)));
  }

  function isSafeToken(value, re = SAFE_ID_RE) {
    return isText(value) && re.test(value) && !FORBIDDEN_KEYS.has(value) && !DANGEROUS_SCHEME_RE.test(value);
  }

  function isCanonicalKey(key) {
    if (!isText(key)) return false;
    try {
      const parts = JSON.parse(key);
      return Array.isArray(parts) && parts.length === 3 &&
        parts.every(p => typeof p === 'string') &&
        KEY_PART_RE.test(parts[0]) && TYPES.includes(parts[1]) && KEY_PART_RE.test(parts[2]) &&
        JSON.stringify(parts) === key;
    } catch {
      return false;
    }
  }

  function safeTree(value, seen = new Set(), depth = 0) {
    // Valid backup records are shallow; reject excessive nesting before recursion can overflow.
    if (depth > 64) return false;
    if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
    if (typeof value === 'number') return Number.isFinite(value);
    if ((!isPlainObject(value) && !Array.isArray(value)) || seen.has(value)) return false;
    for (let proto = value; proto; proto = Object.getPrototypeOf(proto)) {
      if (Object.getOwnPropertyDescriptor(proto, 'toJSON')) return false;
    }
    if (Object.getOwnPropertySymbols(value).length > 0) return false;
    const ownNames = Object.getOwnPropertyNames(value);
    const descriptors = Object.getOwnPropertyDescriptors(value);
    for (const key of ownNames) {
      if (key === 'length' && Array.isArray(value)) continue;
      const desc = descriptors[key];
      if (!desc || !desc.enumerable || !own(desc, 'value')) return false;
      if (FORBIDDEN_KEYS.has(key)) return false;
    }
    if (Array.isArray(value)) {
      if (ownNames.length - 1 !== value.length) return false;
      for (let i = 0; i < value.length; i++) {
        if (!own(value, String(i))) return false;
      }
    }
    seen.add(value);
    const ok = ownNames.every(key => (Array.isArray(value) && key === 'length') || safeTree(value[key], seen, depth + 1));
    seen.delete(value);
    return ok;
  }

  function utf8BytesExceed(text, limit) {
    if (text.length > limit) return true;
    let bytes = 0;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code < 0x80) bytes += 1;
      else if (code < 0x800) bytes += 2;
      else if (code >= 0xd800 && code <= 0xdbff) {
        const next = text.charCodeAt(i + 1);
        if (next >= 0xdc00 && next <= 0xdfff) {
          bytes += 4;
          i++;
        } else {
          bytes += 3;
        }
      } else {
        bytes += 3;
      }
      if (bytes > limit) return true;
    }
    return false;
  }

  function utf8ByteLength(text) {
    if (typeof globalThis.TextEncoder === 'function') {
      return new globalThis.TextEncoder().encode(text).byteLength;
    }
    let bytes = 0;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code < 0x80) bytes += 1;
      else if (code < 0x800) bytes += 2;
      else if (code >= 0xd800 && code <= 0xdbff) {
        const next = text.charCodeAt(i + 1);
        if (next >= 0xdc00 && next <= 0xdfff) { bytes += 4; i++; }
        else bytes += 3;
      } else bytes += 3;
    }
    return bytes;
  }

  function decodeRawInput(rawInput) {
    if (typeof rawInput === 'string') {
      if (utf8BytesExceed(rawInput, MAX_BYTES)) return { ok: false, reason: 'file_too_large' };
      if (!rawInput.trim()) return { ok: false, reason: 'empty' };
      return { ok: true, text: rawInput };
    }
    let view = null;
    if (rawInput instanceof Uint8Array) view = rawInput;
    else if (typeof ArrayBuffer !== 'undefined' && rawInput instanceof ArrayBuffer) view = new Uint8Array(rawInput);
    if (!view) return { ok: false, reason: 'invalid_format' };
    if (view.byteLength === 0) return { ok: false, reason: 'empty' };
    if (view.byteLength > MAX_BYTES) return { ok: false, reason: 'file_too_large' };
    try {
      const text = typeof globalThis.TextDecoder === 'function'
        ? new globalThis.TextDecoder('utf-8', { fatal: true }).decode(view)
        : Buffer.from(view).toString('utf8');
      if (!text.trim()) return { ok: false, reason: 'empty' };
      return { ok: true, text };
    } catch {
      return { ok: false, reason: 'invalid_json' };
    }
  }

  function makeFailure(reason, extra = {}) {
    return {
      ok: false,
      reason,
      code: reason,
      message: ERROR_MESSAGES[reason] || ERROR_MESSAGES.invalid_format,
      ...extra
    };
  }

  function validateResult(res) {
    return hasExactAllowedKeys(res, ['version', 'score', 'total', 'completedAt'], ['version', 'score', 'total', 'completedAt']) &&
      isSafeToken(res.version) &&
      isNonNegInt(res.score) &&
      isNonNegInt(res.total) &&
      res.score <= res.total &&
      isIsoDate(res.completedAt);
  }

  function validateAndNormalizeQuiz(rawQuiz, key, catalog) {
    const allowed = ['version', 'answers', 'activeQuestionId', 'completedVersions', 'lastCompleted', 'bestCompleted', 'archivedResults'];
    if (!hasExactAllowedKeys(rawQuiz, allowed, ['version', 'answers'])) return { ok: false, reason: 'invalid_format' };
    if (!isSafeToken(rawQuiz.version)) return { ok: false, reason: 'unsafe_value' };
    if (!isPlainObject(rawQuiz.answers)) return { ok: false, reason: 'invalid_format' };

    for (const [qId, choice] of Object.entries(rawQuiz.answers)) {
      if (!isSafeToken(qId, QUESTION_ID_RE) || !isNonNegInt(choice)) {
        return { ok: false, reason: 'invalid_quiz_answer' };
      }
    }

    if (own(rawQuiz, 'activeQuestionId')) {
      const activeId = rawQuiz.activeQuestionId;
      const validActive = isNonNegInt(activeId) || isSafeToken(activeId, QUESTION_ID_RE);
      if (!validActive) return { ok: false, reason: 'unsafe_value' };
    }

    if (own(rawQuiz, 'completedVersions')) {
      if (!Array.isArray(rawQuiz.completedVersions) || !rawQuiz.completedVersions.every(v => isSafeToken(v))) {
        return { ok: false, reason: 'invalid_format' };
      }
    }

    if (own(rawQuiz, 'lastCompleted') && !validateResult(rawQuiz.lastCompleted)) return { ok: false, reason: 'invalid_format' };
    if (own(rawQuiz, 'bestCompleted') && !validateResult(rawQuiz.bestCompleted)) return { ok: false, reason: 'invalid_format' };
    if (own(rawQuiz, 'archivedResults')) {
      if (!Array.isArray(rawQuiz.archivedResults) || !rawQuiz.archivedResults.every(validateResult)) {
        return { ok: false, reason: 'invalid_format' };
      }
    }

    const normalized = clone(rawQuiz);
    let staleQuiz = false;
    const entry = catalog && typeof catalog.get === 'function' ? catalog.get(key) : null;
    if (entry && entry.study && entry.study.hasFullQuiz) {
      const catVersion = entry.study.quizVersion;
      const qIds = Array.isArray(entry.study.questionIds) ? entry.study.questionIds : [];
      const optCounts = Array.isArray(entry.study.optionCounts) ? entry.study.optionCounts : [];
      const qCount = entry.study.questionCount || qIds.length;
      const optionCountById = new Map(qIds.map((id, idx) => [String(id), optCounts[idx]]));

      if (normalized.version === catVersion) {
        for (const [qId, choice] of Object.entries(normalized.answers)) {
          if (!optionCountById.has(String(qId))) return { ok: false, reason: 'invalid_quiz_answer' };
          const maxOpts = optionCountById.get(String(qId));
          if (!Number.isSafeInteger(maxOpts) || choice >= maxOpts) return { ok: false, reason: 'invalid_quiz_answer' };
        }
        if (own(normalized, 'activeQuestionId') && !optionCountById.has(String(normalized.activeQuestionId))) {
          return { ok: false, reason: 'invalid_quiz_answer' };
        }
        for (const res of [normalized.lastCompleted, normalized.bestCompleted, ...(normalized.archivedResults || [])]) {
          if (res && res.version === catVersion && res.total !== qCount) {
            return { ok: false, reason: 'invalid_quiz_answer' };
          }
        }
      } else {
        // Quiz version changed since backup: preserve completion & score history, discard obsolete answers.
        staleQuiz = true;
        normalized.answers = {};
        delete normalized.activeQuestionId;
      }
    }

    return { ok: true, quiz: normalized, staleQuiz };
  }

  function validateAndNormalizeItem(rawItem, key, catalog) {
    if (!hasExactAllowedKeys(rawItem, ['startedAt', 'manualComplete', 'reader', 'quiz'], [])) {
      return { ok: false, reason: 'invalid_format' };
    }
    if (own(rawItem, 'startedAt') && !isIsoDate(rawItem.startedAt)) return { ok: false, reason: 'invalid_format' };
    if (own(rawItem, 'manualComplete') && typeof rawItem.manualComplete !== 'boolean') return { ok: false, reason: 'invalid_format' };
    if (own(rawItem, 'reader')) {
      const r = rawItem.reader;
      const slideOk = isNonNegInt(r?.slideId) || (isText(r?.slideId) && /^\d+$/.test(r.slideId));
      if (!hasExactAllowedKeys(r, ['slideId', 'tab', 'updatedAt'], ['slideId', 'tab', 'updatedAt']) ||
          !slideOk || !['explanation', 'original', 'quiz'].includes(r.tab) || !isIsoDate(r.updatedAt)) {
        return { ok: false, reason: 'invalid_format' };
      }
    }
    const out = clone(rawItem);
    let staleQuiz = false;
    if (own(rawItem, 'quiz')) {
      const qRes = validateAndNormalizeQuiz(rawItem.quiz, key, catalog);
      if (!qRes.ok) return qRes;
      out.quiz = qRes.quiz;
      staleQuiz = qRes.staleQuiz;
    }
    return { ok: true, item: out, staleQuiz };
  }

  function normalizeBridgeRecord(rawBridge) {
    if (!hasExactAllowedKeys(rawBridge, ['version', 'anchor', 'updatedAt', 'checks'], ['version'])) {
      return { ok: false, reason: 'invalid_format' };
    }
    if (rawBridge.version !== STANDALONE_VERSION) {
      return { ok: false, reason: Number.isSafeInteger(rawBridge.version) ? 'unsupported_version' : 'invalid_format' };
    }
    const anchor = own(rawBridge, 'anchor') ? rawBridge.anchor : '';
    const updatedAt = own(rawBridge, 'updatedAt') ? rawBridge.updatedAt : '';
    const checks = own(rawBridge, 'checks') ? rawBridge.checks : [];
    if (typeof anchor !== 'string' || !BRIDGE_ANCHOR_RE.test(anchor) || DANGEROUS_SCHEME_RE.test(anchor)) {
      return { ok: false, reason: 'unsafe_value' };
    }
    if (!isStandaloneDate(updatedAt)) return { ok: false, reason: 'invalid_format' };
    if (!Array.isArray(checks) || !checks.every(id => isSafeToken(id, CHECK_ID_RE))) {
      return { ok: false, reason: 'unsafe_value' };
    }
    return {
      ok: true,
      bridge: { version: STANDALONE_VERSION, anchor, updatedAt, checks: checks.slice() }
    };
  }

  function normalizeStandaloneCheck(rawCheck) {
    if (!hasExactAllowedKeys(rawCheck, ['version', 'checked'], ['version', 'checked'])) {
      return { ok: false, reason: 'invalid_format' };
    }
    if (rawCheck.version !== STANDALONE_VERSION) {
      return { ok: false, reason: Number.isSafeInteger(rawCheck.version) ? 'unsupported_version' : 'invalid_format' };
    }
    if (typeof rawCheck.checked !== 'boolean') return { ok: false, reason: 'invalid_format' };
    return { ok: true, check: { version: STANDALONE_VERSION, checked: rawCheck.checked } };
  }

  function isCompletedStudyItem(key, item, catalog) {
    const entry = catalog && typeof catalog.get === 'function' ? catalog.get(key) : null;
    if (entry && entry.study && entry.study.hasFullQuiz) {
      const qv = entry.study.quizVersion;
      const quiz = item?.quiz;
      if (!quiz || !qv) return false;
      if (Array.isArray(quiz.completedVersions) && quiz.completedVersions.includes(qv)) return true;
      if (quiz.lastCompleted && quiz.lastCompleted.version === qv) return true;
      const qIds = entry.study.questionIds;
      const optCounts = entry.study.optionCounts;
      const qCount = entry.study.questionCount || 0;
      return Boolean(
        quiz.version === qv && quiz.answers && qCount > 0 &&
        Array.isArray(qIds) && Array.isArray(optCounts) &&
        qIds.length === qCount && optCounts.length === qCount &&
        qIds.every((id, idx) => {
          const choice = quiz.answers[String(id)];
          return Number.isInteger(choice) && choice >= 0 && choice < optCounts[idx];
        })
      );
    }
    if (item?.manualComplete === true) return true;
    return !entry && Array.isArray(item?.quiz?.completedVersions) && item.quiz.completedVersions.length > 0;
  }

  function summarizeBundle(studyState, standalone, catalog, extra = {}) {
    const items = studyState?.items || {};
    const bridges = standalone?.bridges || {};
    const checks = standalone?.checks || {};
    let completedCount = 0;
    let readerCount = 0;
    let quizCount = 0;
    let startedCount = 0;
    const orphanKeys = new Set();
    const isOrphan = k => Boolean(catalog && typeof catalog.get === 'function' && !catalog.get(k));

    for (const [k, it] of Object.entries(items)) {
      if (it?.startedAt || it?.reader || (it?.quiz && Object.keys(it.quiz).length > 0) || typeof it?.manualComplete === 'boolean') {
        startedCount++;
      }
      if (it?.reader) readerCount++;
      if (it?.quiz) quizCount++;
      if (isCompletedStudyItem(k, it, catalog)) completedCount++;
      if (isOrphan(k)) orphanKeys.add(k);
    }
    for (const k of Object.keys(bridges)) {
      if (isOrphan(k)) orphanKeys.add(k);
    }
    let checkCount = 0;
    for (const [k, group] of Object.entries(checks)) {
      if (isOrphan(k)) orphanKeys.add(k);
      checkCount += Object.keys(group || {}).length;
    }

    return {
      itemCount: Object.keys(items).length,
      startedCount,
      completedCount,
      readerCount,
      quizCount,
      bridgeCount: Object.keys(bridges).length,
      checkCount,
      orphanCount: orphanKeys.size,
      staleQuizCount: extra.staleQuizCount || 0,
      hasLastUsed: Boolean(studyState?.lastUsed)
    };
  }

  function createStudyBackup(options = {}) {
    const getDep = (name, globalName) => {
      if (options[name] !== undefined) return options[name];
      return typeof globalThis[globalName] !== 'undefined' ? globalThis[globalName] : null;
    };
    const state = getDep('state', 'PortalStudyState');
    const catalog = getDep('catalog', 'PortalCatalog');
    const now = typeof options.now === 'function' ? options.now : () => new Date().toISOString();

    function getCoverageManifest() {
      return clone(COVERAGE_MANIFEST);
    }

    function readBackingHealth() {
      if (!state || typeof state.getSnapshot !== 'function' || typeof state.replaceBundle !== 'function') {
        return { ok: false, reason: 'unavailable', scope: 'journal' };
      }
      const journalStatus = typeof state.getStatus === 'function' ? state.getStatus() : 'persistent';
      const standaloneStatus = typeof state.getStandaloneStatus === 'function' ? state.getStandaloneStatus() : 'persistent';
      if (journalStatus === 'corrupt' || journalStatus === 'unsupported-version') {
        return { ok: false, reason: journalStatus, scope: 'journal', journalStatus, standaloneStatus };
      }
      if (standaloneStatus === 'corrupt' || standaloneStatus === 'unsupported-version') {
        return { ok: false, reason: standaloneStatus, scope: 'standalone', journalStatus, standaloneStatus };
      }
      return { ok: true, journalStatus, standaloneStatus };
    }

    function getStatusSummary() {
      const health = readBackingHealth();
      if (!health.ok) {
        return {
          ok: false,
          reason: health.reason,
          scope: health.scope,
          message: ERROR_MESSAGES[health.reason] || ERROR_MESSAGES.corrupt,
          writable: false
        };
      }
      const snap = state.getSnapshot();
      const standalone = typeof state.getStandaloneSnapshot === 'function'
        ? state.getStandaloneSnapshot()
        : { bridges: {}, checks: {} };
      return {
        ok: true,
        writable: health.journalStatus === 'persistent' && health.standaloneStatus === 'persistent',
        journalStatus: health.journalStatus,
        standaloneStatus: health.standaloneStatus,
        revisionToken: typeof state.getRevisionToken === 'function' ? state.getRevisionToken() : '',
        summary: summarizeBundle(snap, standalone, catalog)
      };
    }

    function exportBackup() {
      const health = readBackingHealth();
      if (!health.ok) {
        return makeFailure(health.reason, { scope: health.scope });
      }
      const snap = state.getSnapshot();
      const standalone = typeof state.getStandaloneSnapshot === 'function'
        ? state.getStandaloneSnapshot()
        : { bridges: {}, checks: {} };

      const bridges = {};
      for (const [key, rawBridge] of Object.entries(standalone.bridges || {})) {
        const res = normalizeBridgeRecord(rawBridge);
        if (!res.ok) return makeFailure(res.reason, { scope: 'standalone' });
        bridges[key] = res.bridge;
      }

      const checks = {};
      for (const [key, group] of Object.entries(standalone.checks || {})) {
        checks[key] = {};
        for (const [checkId, rawCheck] of Object.entries(group || {})) {
          const res = normalizeStandaloneCheck(rawCheck);
          if (!res.ok) return makeFailure(res.reason, { scope: 'standalone' });
          checks[key][checkId] = res.check;
        }
      }

      const exportedAt = String(now());
      const envelope = {
        project: PROJECT_ID,
        formatVersion: FORMAT_VERSION,
        schemaVersion: SCHEMA_VERSION,
        exportedAt,
        payload: {
          studyState: snap,
          standalone: { bridges, checks }
        }
      };

      let json = JSON.stringify(envelope, null, 2);
      let bytes = utf8ByteLength(json);
      if (bytes > MAX_BYTES) {
        json = JSON.stringify(envelope);
        bytes = utf8ByteLength(json);
      }
      if (bytes > MAX_BYTES) {
        return makeFailure('file_too_large');
      }

      return {
        ok: true,
        fileName: 'sem2-study-backup-' + exportedAt.slice(0, 10) + '.json',
        bytes,
        json,
        envelope,
        summary: summarizeBundle(snap, envelope.payload.standalone, catalog)
      };
    }

    function inspectBackup(rawInput) {
      const decoded = decodeRawInput(rawInput);
      if (!decoded.ok) return makeFailure(decoded.reason);

      let parsed;
      try {
        parsed = JSON.parse(decoded.text);
      } catch {
        return makeFailure('invalid_json');
      }

      if (!safeTree(parsed)) return makeFailure('unsafe_value');
      if (!hasExactAllowedKeys(parsed, ['project', 'formatVersion', 'schemaVersion', 'exportedAt', 'payload'])) {
        return makeFailure('invalid_format');
      }
      if (parsed.project !== PROJECT_ID) return makeFailure('invalid_format');
      if (parsed.formatVersion !== FORMAT_VERSION) {
        return makeFailure(Number.isSafeInteger(parsed.formatVersion) ? 'unsupported_version' : 'invalid_format');
      }
      if (parsed.schemaVersion !== SCHEMA_VERSION) {
        return makeFailure(Number.isSafeInteger(parsed.schemaVersion) ? 'unsupported_version' : 'invalid_format');
      }
      if (!isIsoDate(parsed.exportedAt)) return makeFailure('invalid_format');
      if (!hasExactAllowedKeys(parsed.payload, ['studyState', 'standalone'])) return makeFailure('invalid_format');

      const rawState = parsed.payload.studyState;
      if (!hasExactAllowedKeys(rawState, ['schemaVersion', 'items', 'lastUsed'], ['schemaVersion', 'items'])) {
        return makeFailure('invalid_format');
      }
      if (rawState.schemaVersion !== SCHEMA_VERSION) {
        return makeFailure(Number.isSafeInteger(rawState.schemaVersion) ? 'unsupported_version' : 'invalid_format');
      }
      if (!isPlainObject(rawState.items)) return makeFailure('invalid_format');

      const items = {};
      let staleQuizCount = 0;
      for (const [key, rawItem] of Object.entries(rawState.items)) {
        if (!isCanonicalKey(key)) return makeFailure('invalid_format');
        const itemRes = validateAndNormalizeItem(rawItem, key, catalog);
        if (!itemRes.ok) return makeFailure(itemRes.reason);
        if (itemRes.staleQuiz) staleQuizCount++;
        items[key] = itemRes.item;
      }

      const studyState = { schemaVersion: SCHEMA_VERSION, items };
      if (own(rawState, 'lastUsed')) {
        if (rawState.lastUsed === null) {
          studyState.lastUsed = null;
        } else {
          const lu = rawState.lastUsed;
          if (!hasExactAllowedKeys(lu, ['key', 'actionId', 'updatedAt']) ||
              !isCanonicalKey(lu.key) || !isSafeToken(lu.actionId) || !isIsoDate(lu.updatedAt)) {
            return makeFailure('invalid_format');
          }
          studyState.lastUsed = clone(lu);
        }
      }

      const rawStandalone = parsed.payload.standalone;
      if (!hasExactAllowedKeys(rawStandalone, ['bridges', 'checks']) ||
          !isPlainObject(rawStandalone.bridges) || !isPlainObject(rawStandalone.checks)) {
        return makeFailure('invalid_format');
      }

      const bridges = {};
      for (const [key, rawBridge] of Object.entries(rawStandalone.bridges)) {
        if (!isCanonicalKey(key)) return makeFailure('invalid_format');
        const bRes = normalizeBridgeRecord(rawBridge);
        if (!bRes.ok) return makeFailure(bRes.reason);
        bridges[key] = bRes.bridge;
      }

      const checks = {};
      for (const [key, rawGroup] of Object.entries(rawStandalone.checks)) {
        if (!isCanonicalKey(key) || !isPlainObject(rawGroup)) return makeFailure('invalid_format');
        checks[key] = {};
        for (const [checkId, rawCheck] of Object.entries(rawGroup)) {
          if (!isSafeToken(checkId, CHECK_ID_RE)) return makeFailure('unsafe_value');
          const cRes = normalizeStandaloneCheck(rawCheck);
          if (!cRes.ok) return makeFailure(cRes.reason);
          checks[key][checkId] = cRes.check;
        }
      }

      const normalizedStandalone = { bridges, checks };
      const incoming = summarizeBundle(studyState, normalizedStandalone, catalog, { staleQuizCount });

      const currentStatus = getStatusSummary();
      const preview = {
        exportedAt: parsed.exportedAt,
        formatVersion: parsed.formatVersion,
        schemaVersion: parsed.schemaVersion,
        studySchemaVersion: rawState.schemaVersion,
        revisionToken: currentStatus.ok ? currentStatus.revisionToken : '',
        backingOk: currentStatus.ok,
        backingReason: currentStatus.ok ? null : currentStatus.reason,
        current: currentStatus.ok ? currentStatus.summary : null,
        incoming,
        manifest: getCoverageManifest()
      };

      return {
        ok: true,
        preview,
        normalized: {
          studyState,
          standalone: normalizedStandalone
        }
      };
    }

    function restoreBackup(rawInput, restoreOptions = {}) {
      const inspected = inspectBackup(rawInput);
      if (!inspected.ok) {
        return { restored: false, ...inspected };
      }
      if (restoreOptions?.confirmed !== true) {
        return { restored: false, ...makeFailure('confirmation_required'), preview: inspected.preview };
      }
      const health = readBackingHealth();
      if (!health.ok) {
        return { restored: false, ...makeFailure(health.reason, { scope: health.scope }), preview: inspected.preview };
      }

      const result = state.replaceBundle({
        studyState: inspected.normalized.studyState,
        standalone: inspected.normalized.standalone,
        ...(restoreOptions.expectedRevision !== undefined ? { expectedRevision: restoreOptions.expectedRevision } : {})
      });

      if (!result.saved) {
        if (result.reason === 'concurrent_change') {
          const refreshed = inspectBackup(rawInput);
          return {
            restored: false,
            ...makeFailure('concurrent_change'),
            refreshedPreview: refreshed.ok ? refreshed.preview : null
          };
        }
        return {
          restored: false,
          ...makeFailure(result.reason || 'session', { scope: result.scope })
        };
      }

      return {
        restored: true,
        summary: inspected.preview.incoming,
        revisionToken: typeof state.getRevisionToken === 'function' ? state.getRevisionToken() : ''
      };
    }

    return {
      MAX_BYTES,
      PROJECT_ID,
      FORMAT_VERSION,
      SCHEMA_VERSION,
      getCoverageManifest,
      getStatusSummary,
      exportBackup,
      inspectBackup,
      restoreBackup
    };
  }

  return {
    MAX_BYTES,
    PROJECT_ID,
    FORMAT_VERSION,
    SCHEMA_VERSION,
    getCoverageManifest: () => clone(COVERAGE_MANIFEST),
    createStudyBackup
  };
});
