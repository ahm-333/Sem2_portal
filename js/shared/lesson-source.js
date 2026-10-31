/**
 * PortalLessonSource (js/shared/lesson-source.js)
 * Loads, verifies, sanitizes, and extracts reviewed topic blocks from allowlisted chapter HTML.
 * Strictly prevents execution of legacy scripts, event handlers, or arbitrary user URLs.
 *
 * Owned by Issue #30 under Epic #27.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.PortalLessonSource = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const ALLOWED_LECTURES = {
    '2': {
      lectureKey: '2',
      chapterNumber: 1,
      sourceFile: 'chapter-1.html',
      fullUrl: 'study/db/chapter-1.html',
      expectedBlocks: ['block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6', 'block-add']
    },
    '3': {
      lectureKey: '3',
      chapterNumber: 2,
      sourceFile: 'chapter-2.html',
      fullUrl: 'study/db/chapter-2.html',
      expectedBlocks: ['block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6']
    }
  };

  function normalizeKey(key) {
    if (typeof window !== 'undefined' && window.DBLessonMap && typeof window.DBLessonMap.normalizeLectureKey === 'function') {
      return window.DBLessonMap.normalizeLectureKey(key);
    }
    if (!key) return null;
    const str = String(key).trim().toLowerCase();
    if (str === '2' || str === 'chapter-1' || str === 'chapter1' || str === 'db-lec2') return '2';
    if (str === '3' || str === 'chapter-2' || str === 'chapter2' || str === 'db-lec3') return '3';
    return null;
  }

  function isSupported(key) {
    const k = normalizeKey(key);
    return Boolean(k && ALLOWED_LECTURES[k]);
  }

  function getLectureSpec(key) {
    const k = normalizeKey(key);
    return k ? ALLOWED_LECTURES[k] : null;
  }

  function sanitizeNode(node) {
    if (!node || node.nodeType !== 1) return;

    // Remove event handlers and javascript: URLs
    const attrs = Array.from(node.attributes);
    for (const attr of attrs) {
      const name = attr.name.toLowerCase();
      const val = attr.value.trim().toLowerCase();
      if (name.startsWith('on') || val.startsWith('javascript:')) {
        node.removeAttribute(attr.name);
      }
    }

    // Traverse children
    let child = node.firstElementChild;
    while (child) {
      const next = child.nextElementSibling;
      if (child.tagName === 'SCRIPT' || child.tagName === 'IFRAME' || child.tagName === 'OBJECT' || child.tagName === 'EMBED') {
        child.remove();
      } else {
        sanitizeNode(child);
      }
      child = next;
    }
  }

  function extractTopicBlocks(doc, spec) {
    const foundMap = new Map();
    const duplicates = [];

    // Search for elements by id matching expected blocks
    for (const blockId of spec.expectedBlocks) {
      const matches = doc.querySelectorAll(`[id="${blockId}"]`);
      if (matches.length > 1) {
        duplicates.push(blockId);
      }
      if (matches.length >= 1) {
        const el = matches[0].cloneNode(true);
        sanitizeNode(el);
        foundMap.set(blockId, el);
      }
    }

    if (duplicates.length > 0) {
      return {
        ok: false,
        error: 'DUPLICATE_BLOCK',
        duplicateBlockId: duplicates[0],
        message: `تم اكتشاف كتلة شرح مكررة في المصدر: ${duplicates[0]}`
      };
    }

    const missing = spec.expectedBlocks.filter(id => !foundMap.has(id));
    if (missing.length > 0) {
      return {
        ok: false,
        error: 'MISSING_REQUIRED_BLOCK',
        missingBlockId: missing[0],
        message: `كتلة شرح أساسية مفقودة في المصدر: ${missing[0]}`
      };
    }

    // Build structured block records in authored order
    const blocks = spec.expectedBlocks.map((id, index) => {
      const el = foundMap.get(id);
      let title = '';
      const h = el.querySelector('h1, h2, h3, h4');
      if (h) {
        title = h.innerText || h.textContent || '';
      }
      let slides = [];
      if (typeof window !== 'undefined' && window.DBLessonMap && typeof window.DBLessonMap.getTopicBlock === 'function') {
        const mapped = window.DBLessonMap.getTopicBlock(spec.lectureKey, id);
        if (mapped && mapped.slides) slides = [...mapped.slides];
      }

      return {
        id,
        order: index + 1,
        title: title.trim(),
        slides,
        element: el,
        html: el.outerHTML
      };
    });

    return {
      ok: true,
      blocks
    };
  }

  async function loadLessonSource(lectureKey, options = {}) {
    const k = normalizeKey(lectureKey);
    if (!k || !ALLOWED_LECTURES[k]) {
      return {
        ok: false,
        error: 'UNSUPPORTED_LECTURE',
        lectureKey,
        message: 'المحاضرة المطلوبة غير مدعومة حالياً في مساحة المذاكرة الموحدة. المحاضرات المتاحة: 2 و 3.'
      };
    }

    const spec = ALLOWED_LECTURES[k];
    let htmlText = options.htmlText || null;
    const isFileProtocol = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';

    if (!htmlText) {
      const relativeUrl = (document.querySelector('base') ? spec.fullUrl : spec.sourceFile) || spec.sourceFile;
      const fetchFn = options.fetchFn || (typeof fetch !== 'undefined' ? fetch : null);

      if (!fetchFn) {
        return {
          ok: false,
          error: 'FETCH_UNAVAILABLE',
          lectureKey: k,
          message: 'واجهة fetch غير متوفرة في هذه البيئة.'
        };
      }

      try {
        const response = await fetchFn(relativeUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
        htmlText = await response.text();
      } catch (err) {
        if (isFileProtocol) {
          return {
            ok: false,
            error: 'FILE_PROTOCOL_RESTRICTION',
            isLocalFile: true,
            lectureKey: k,
            fallbackUrl: spec.sourceFile,
            message: 'محددات أمان المتصفح تمنع استخراج المحتوى عبر بروتوكول file://. يمكنك فتح ملف الشرح الأصلي مباشرة.'
          };
        }
        return {
          ok: false,
          error: 'NETWORK_ERROR',
          retryable: true,
          lectureKey: k,
          originalError: err.message,
          message: 'تعذر تحميل ملف الشرح من الخادم. يرجى التحقق من الاتصال وإعادة المحاولة.'
        };
      }
    }

    // Parse HTML with DOMParser
    let doc;
    if (options.doc) {
      doc = options.doc;
    } else if (typeof window !== 'undefined' && window.DOMParser) {
      const parser = new window.DOMParser();
      doc = parser.parseFromString(htmlText, 'text/html');
    } else {
      return {
        ok: false,
        error: 'DOMPARSER_UNAVAILABLE',
        lectureKey: k,
        message: 'DOMParser غير متوفر في هذه البيئة.'
      };
    }

    // Extract blocks
    const extraction = extractTopicBlocks(doc, spec);
    if (!extraction.ok) {
      return Object.assign({ lectureKey: k, spec }, extraction);
    }

    return {
      ok: true,
      lectureKey: k,
      spec,
      blocks: extraction.blocks
    };
  }


  const pendingScripts = new Map();

  function loadScript(src, checkFn) {
    if (typeof window === 'undefined') return Promise.resolve();
    if (checkFn && checkFn()) return Promise.resolve();
    const url = new URL(src, document.baseURI).href;
    if (pendingScripts.has(url)) return pendingScripts.get(url);
    const pending = new Promise((resolve, reject) => {
      // Only an in-flight promise can be reused. A settled tag without its
      // expected global is stale (network or execution failure).
      Array.from(document.scripts).find(script => script.src === url)?.remove();
      const script = document.createElement('script');
      script.src = url;
      script.defer = true;
      const fail = message => {
        script.remove();
        reject(new Error(message));
      };
      script.onload = () => {
        if (checkFn && !checkFn()) {
          fail(`Script loaded but check failed for ${src}`);
        } else {
          resolve();
        }
      };
      script.onerror = () => fail(`Could not load script ${src}`);
      document.head.appendChild(script);
    }).finally(() => pendingScripts.delete(url));
    pendingScripts.set(url, pending);
    return pending;
  }

  async function loadPracticeResources(options = {}) {
    if (typeof window === 'undefined') return { ok: true };
    const prefix = options.scriptPrefix || '../../js/';
    try {
      await Promise.all([
        loadScript(`${prefix}shared/quiz-attempt.js`, () => typeof window.PortalQuizAttempt !== 'undefined'),
        loadScript(`${prefix}course-question-bank.js`, () => typeof window.COURSE_QUESTION_BANK !== 'undefined'),
        loadScript(`${prefix}study-quiz.js`, () => typeof window.PortalStudyQuiz !== 'undefined'),
        loadScript(`${prefix}lesson-practice.js`, () => typeof window.PortalLessonPractice !== 'undefined')
      ]);
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: 'PRACTICE_RESOURCE_LOAD_FAILED',
        message: 'تعذر تحميل ملفات بنك الأسئلة والتدريب: ' + err.message
      };
    }
  }

  function mapBankUidToAuthoredId(bankUid) {
    if (!bankUid) return null;
    const str = String(bankUid);
    const lastColon = str.lastIndexOf(':');
    if (lastColon >= 0) {
      const num = Number(str.slice(lastColon + 1));
      return Number.isNaN(num) ? str.slice(lastColon + 1) : num;
    }
    return bankUid;
  }

  function mapAuthoredIdToBankUid(courseId, lectureKey, authoredId) {
    return `subject.html?id=${courseId}&lecture=${lectureKey}:${authoredId}`;
  }

  function getPracticeBanks(lectureKey, allExplanations) {
    const k = normalizeKey(lectureKey);
    if (!k || !ALLOWED_LECTURES[k]) return null;
    const spec = ALLOWED_LECTURES[k];

    // 1. Topic Practice Questions from COURSE_QUESTION_BANK
    const allDbQuestions = (typeof window !== 'undefined' && window.COURSE_QUESTION_BANK)
      ? window.COURSE_QUESTION_BANK['database-systems'] || []
      : [];
    
    const topicQuestions = allDbQuestions.filter(q => q.sourceUrl === spec.fullUrl).map(q => {
      const idParts = q.id.split(':');
      const originalId = idParts.length > 1 ? Number(idParts[1]) : q.id;
      return Object.assign({}, q, {
        originalId,
        provenanceId: q.id
      });
    });

    // 2. Full Lecture Quiz Questions from LECTURE_EXPLANATIONS
    const lecData = allExplanations?.['database-systems']?.[k] || (typeof window !== 'undefined' && window.LECTURE_EXPLANATIONS?.['database-systems']?.[k]);
    const fullQuizSource = lecData?.fullQuiz || [];
    const fullQuizQuestions = fullQuizSource.map(q => {
      const bankUid = `subject.html?id=database-systems&lecture=${k}:${q.id}`;
      return Object.assign({}, q, {
        authoredId: q.id,
        bankUid
      });
    });

    // 3. Slide-Local Micro Questions from LECTURE_EXPLANATIONS.slides
    const slides = lecData?.slides || [];
    const slideQuestions = [];
    for (const s of slides) {
      if (s.quiz) {
        slideQuestions.push({
          id: `db:lec${k}:s${s.num}:quiz`,
          slideNum: s.num,
          slideTitle: s.title,
          slideArabicTitle: s.arabicTitle,
          question: s.quiz.question,
          options: [...s.quiz.options],
          correct: s.quiz.correct,
          explanation: s.quiz.explanation
        });
      }
    }

    return {
      lectureKey: k,
      spec,
      topicQuestions,
      fullQuizQuestions,
      slideQuestions,
      counts: {
        topic: topicQuestions.length,
        full: fullQuizQuestions.length,
        slides: slideQuestions.length,
        total: topicQuestions.length + fullQuizQuestions.length + slideQuestions.length
      }
    };
  }

  return {
    normalizeKey,
    isSupported,
    getLectureSpec,
    loadLessonSource,
    loadPracticeResources,
    getPracticeBanks,
    mapBankUidToAuthoredId,
    mapAuthoredIdToBankUid,
    sanitizeNode
  };
});
