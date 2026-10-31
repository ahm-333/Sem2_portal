/**
 * PortalLessonPractice (js/lesson-practice.js)
 * Combines access to Database Systems practice without mixing banks or grades:
 * 1. Topic Practice: 34 questions (Lec 2) / 20 questions (Lec 3) from chapter HTML / COURSE_QUESTION_BANK.
 * 2. Full Lecture Quiz: 20 questions (Lec 2) / 30 questions (Lec 3) hosted via PortalStudyQuiz (Issue #8 contract).
 * 3. Slide-Local Questions: 30 questions (Lec 2) / 32 questions (Lec 3) from slide walkthrough data.
 *
 * Owned by Issue #33 under Epic #27.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.PortalLessonPractice = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function injectPracticeStyles() {
    if (typeof document === 'undefined' || document.getElementById('portal-practice-styles')) return;
    const style = document.createElement('style');
    style.id = 'portal-practice-styles';
    style.textContent = `
      .practice-hub-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .practice-group-tab {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1rem;
        border-radius: 0.875rem;
        font-size: 0.8125rem;
        font-weight: 700;
        border: 1px solid var(--border-subtle, #cbd5e1);
        background: var(--bg-surface, #ffffff);
        color: var(--text-main, #0f172a);
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .practice-group-tab:hover {
        border-color: #4f46e5;
        background: var(--bg-card-hover, #f8fafc);
      }
      .practice-group-tab.is-active {
        background: #4338ca !important;
        border-color: #3730a3 !important;
        color: #ffffff !important;
      }
      .practice-group-tab:focus-visible {
        outline: 2px solid #b34e13;
        outline-offset: 2px;
      }
      .practice-group-tab .tab-badge {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.6875rem;
        padding: 0.125rem 0.5rem;
        border-radius: 9999px;
        background: rgba(0, 0, 0, 0.08);
      }
      .practice-group-tab.is-active .tab-badge {
        background: rgba(255, 255, 255, 0.12) !important;
        color: #ffffff !important;
      }
      .practice-filter-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.375rem 0.75rem;
        border-radius: 0.625rem;
        font-size: 0.75rem;
        font-weight: 700;
        border: 1px solid var(--border-subtle, #cbd5e1);
        background: var(--bg-surface, #ffffff);
        color: var(--text-main, #334155);
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .practice-filter-pill:hover {
        border-color: #6366f1;
      }
      .practice-filter-pill.is-active {
        background: #4338ca !important;
        border-color: #3730a3 !important;
        color: #ffffff !important;
      }
      .practice-filter-pill:focus-visible {
        outline: 2px solid #b34e13;
        outline-offset: 2px;
      }
      .topic-opt-btn, .slide-micro-opt-btn {
        width: 100%;
        text-align: left;
        direction: ltr;
        padding: 0.875rem 1rem;
        border-radius: 0.75rem;
        border: 1px solid var(--border-subtle, #cbd5e1);
        background: var(--bg-card, #ffffff);
        color: var(--text-main, #0f172a);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8125rem;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        transition: all 0.15s ease;
      }
      .topic-opt-btn:hover:not([disabled]), .slide-micro-opt-btn:hover:not([disabled]) {
        border-color: #4f46e5;
        background: #f1f5f9;
      }
      .topic-opt-btn:focus-visible, .slide-micro-opt-btn:focus-visible {
        outline: 2px solid #b34e13;
        outline-offset: 2px;
      }
      .topic-opt-btn.is-correct, .slide-micro-opt-btn.is-correct {
        border-color: #059669 !important;
        background: rgba(16, 185, 129, 0.15) !important;
        color: #065f46 !important;
        font-weight: 700;
      }
      .topic-opt-btn.is-wrong, .slide-micro-opt-btn.is-wrong {
        border-color: #e11d48 !important;
        background: rgba(244, 63, 94, 0.15) !important;
        color: #9f1239 !important;
        text-decoration: line-through;
        font-weight: 700;
      }
      .topic-opt-btn.is-dimmed, .slide-micro-opt-btn.is-dimmed {
        opacity: 0.45;
        cursor: default;
      }
      .topic-opt-btn[disabled], .slide-micro-opt-btn[disabled] {
        cursor: default;
      }
      html[data-theme="dark"] .practice-group-tab {
        border-color: #334155;
        background: #1e293b;
        color: #f8fafc;
      }
      html[data-theme="dark"] .practice-group-tab.is-active {
        background: #4338ca !important;
        color: #ffffff !important;
      }
      html[data-theme="dark"] .practice-filter-pill {
        border-color: #334155;
        background: #1e293b;
        color: #e2e8f0;
      }
      html[data-theme="dark"] .practice-filter-pill.is-active {
        background: #4338ca !important;
        color: #ffffff !important;
      }
      html[data-theme="dark"] .topic-opt-btn, html[data-theme="dark"] .slide-micro-opt-btn {
        border-color: #334155;
        background: #0f172a;
        color: #f8fafc;
      }
      html[data-theme="dark"] .topic-opt-btn:hover:not([disabled]), html[data-theme="dark"] .slide-micro-opt-btn:hover:not([disabled]) {
        background: #1e293b;
        border-color: #818cf8;
      }
      html[data-theme="dark"] .topic-opt-btn.is-correct, html[data-theme="dark"] .slide-micro-opt-btn.is-correct {
        color: #34d399 !important;
        border-color: #10b981 !important;
      }
      html[data-theme="dark"] .topic-opt-btn.is-wrong, html[data-theme="dark"] .slide-micro-opt-btn.is-wrong {
        color: #fb7185 !important;
        border-color: #f43f5e !important;
      }
      html[data-theme="reading"] .practice-group-tab {
        border-color: #ced8c8;
        background: #fcfdf7;
        color: #2b3c35;
      }
      html[data-theme="reading"] .practice-group-tab.is-active {
        background: #2b573e !important;
        border-color: #1f422e !important;
        color: #ffffff !important;
      }
      html[data-theme="reading"] .practice-filter-pill {
        border-color: #ced8c8;
        background: #fcfdf7;
        color: #2b3c35;
      }
      html[data-theme="reading"] .practice-filter-pill.is-active {
        background: #2b573e !important;
        border-color: #1f422e !important;
        color: #ffffff !important;
      }
      html[data-theme="reading"] .topic-opt-btn, html[data-theme="reading"] .slide-micro-opt-btn {
        border-color: #ced8c8;
        background: #fcfdf7;
        color: #2b3c35;
      }
      html[data-theme="reading"] .topic-opt-btn:hover:not([disabled]), html[data-theme="reading"] .slide-micro-opt-btn:hover:not([disabled]) {
        background: #e0eadc;
        border-color: #34634d;
      }
      html[data-theme="reading"] .topic-opt-btn.is-correct, html[data-theme="reading"] .slide-micro-opt-btn.is-correct {
        color: #1b7a42 !important;
        border-color: #1b7a42 !important;
      }
      html[data-theme="reading"] .topic-opt-btn.is-wrong, html[data-theme="reading"] .slide-micro-opt-btn.is-wrong {
        color: #a51d34 !important;
        border-color: #a51d34 !important;
      }
    `;
    document.head.appendChild(style);
  }

  function createPracticeHost(container, options = {}) {
    injectPracticeStyles();

    let currentLectureKey = null;
    let currentBanks = null;
    let activeGroup = 'topic'; // 'topic' | 'full' | 'slides'
    let fullQuizRendered = false;

    // Independent in-memory view states (survive tab/outline changes)
    const topicSessionState = {
      answers: {}, // originalId -> selectedOptionIndex
      filter: 'all',
      filterTitle: 'all'
    };

    const slideSessionState = {
      answers: {} // slideQuestionId -> selectedOptionIndex
    };

    function getLetters() {
      return ['A', 'B', 'C', 'D', 'E', 'F'];
    }

    function presentQuestion(question, group) {
      if (window.PortalQuizChoices && typeof window.PortalQuizChoices.present === 'function') {
        return window.PortalQuizChoices.present(question, group + ':' + question.id + ':' + question.question);
      }
      return question;
    }

    function renderGroupTabs(banks) {
      return `
        <div class="practice-hub-header mb-6 pb-4 border-b border-[var(--border-subtle)]">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">DB PRACTICE HUB</span>
              </div>
              <h2 class="text-lg sm:text-xl font-extrabold text-[var(--text-main)]">بنك الأسئلة والتدريب الموحد</h2>
              <p class="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
                ${banks.counts.total} سؤالاً موزعة حسب سياق المذاكرة دون خلط بنوك الأسئلة أو دمج الدرجات.
              </p>
            </div>
            <div class="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] self-start sm:self-auto">
              إجمالي الأسئلة: <span class="text-indigo-600 dark:text-indigo-400 font-extrabold">${banks.counts.total}</span>
            </div>
          </div>

          <!-- Group Tabs Navigation -->
          <div class="practice-nav-tabs mt-4 flex flex-wrap gap-2" role="tablist" aria-label="أقسام التدريب">
            <button type="button" class="practice-group-tab ${activeGroup === 'topic' ? 'is-active' : ''}" data-practice-group-tab="topic" role="tab" aria-selected="${activeGroup === 'topic' ? 'true' : 'false'}" aria-controls="topic-practice-view">
              <i data-lucide="book-open" class="w-4 h-4"></i>
              <span>تدريب موضوعات الشرح</span>
              <span class="tab-badge">${banks.counts.topic} سؤال</span>
            </button>
            <button type="button" class="practice-group-tab ${activeGroup === 'full' ? 'is-active' : ''}" data-practice-group-tab="full" role="tab" aria-selected="${activeGroup === 'full' ? 'true' : 'false'}" aria-controls="full-quiz-view">
              <i data-lucide="award" class="w-4 h-4"></i>
              <span>كويز المحاضرة الشامل</span>
              <span class="tab-badge">${banks.counts.full} سؤال</span>
            </button>
            <button type="button" class="practice-group-tab ${activeGroup === 'slides' ? 'is-active' : ''}" data-practice-group-tab="slides" role="tab" aria-selected="${activeGroup === 'slides' ? 'true' : 'false'}" aria-controls="slide-questions-view">
              <i data-lucide="presentation" class="w-4 h-4"></i>
              <span>أسئلة السلايدات الفردية</span>
              <span class="tab-badge">${banks.counts.slides} سؤال</span>
            </button>
          </div>
        </div>
      `;
    }

    function renderTopicFilterPills(questions) {
      const blocksMap = new Map();
      questions.forEach(q => {
        const title = q.topic || 'عام';
        if (!blocksMap.has(title)) {
          blocksMap.set(title, 0);
        }
        blocksMap.set(title, blocksMap.get(title) + 1);
      });

      let html = `
        <div class="flex flex-wrap items-center gap-2 mb-5 pb-3 border-b border-[var(--border-subtle)]" role="group" aria-label="تصفية أسئلة الموضوعات">
          <span class="text-xs font-bold text-[var(--text-muted)]">تصفية حسب الموضوع:</span>
          <button type="button" class="practice-filter-pill ${topicSessionState.filter === 'all' ? 'is-active' : ''}" data-topic-filter="all" data-topic-title="all">
            <span>كل الأسئلة (${questions.length})</span>
          </button>
      `;

      let bIndex = 1;
      for (const [title, count] of blocksMap.entries()) {
        const filterKey = 'b' + bIndex;
        const isActive = topicSessionState.filter === filterKey;
        html += `
          <button type="button" class="practice-filter-pill ${isActive ? 'is-active' : ''}" data-topic-filter="${filterKey}" data-topic-title="${escapeHtml(title)}">
            <span>${escapeHtml(title)} (${count})</span>
          </button>
        `;
        bIndex++;
      }

      html += `</div>`;
      return html;
    }

    function renderTopicCards(questions) {
      const letters = getLetters();
      let filteredQuestions = questions;
      if (topicSessionState.filter !== 'all' && topicSessionState.filterTitle !== 'all') {
        filteredQuestions = questions.filter(q => (q.topic || 'عام') === topicSessionState.filterTitle);
      }

      return filteredQuestions.map((q, idx) => {
        const selected = topicSessionState.answers[q.originalId];
        const isAnswered = selected !== undefined;
        const presented = presentQuestion(q, 'topic');
        const isCorrect = isAnswered && selected === presented.correct;

        let optionsHtml = '';
        presented.options.forEach((optText, optIdx) => {
          let btnClasses = 'topic-opt-btn';
          let badgeIcon = '';

          if (isAnswered) {
            btnClasses += ' is-disabled';
            if (optIdx === presented.correct) {
              btnClasses += ' is-correct';
              badgeIcon = '<span class="text-emerald-700 dark:text-emerald-300 font-bold text-xs">✓ صحيح</span>';
            } else if (optIdx === selected) {
              btnClasses += ' is-wrong';
              badgeIcon = '<span class="text-rose-700 dark:text-rose-300 font-bold text-xs">✗ اختيارك</span>';
            } else {
              btnClasses += ' is-dimmed';
            }
          }

          optionsHtml += `
            <button type="button" class="${btnClasses}" data-qid="${q.originalId}" data-opt="${optIdx}" dir="ltr" ${isAnswered ? 'disabled' : ''}>
              <span class="flex-1 font-mono text-xs sm:text-sm text-left font-medium">
                <strong class="text-indigo-600 dark:text-indigo-400 mr-2 font-bold font-mono">(${letters[optIdx]})</strong>
                ${escapeHtml(optText)}
              </span>
              ${badgeIcon}
            </button>
          `;
        });

        return `
          <div class="topic-practice-card p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4" data-card-qid="${q.originalId}">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
              <span class="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 font-tajawal">
                ${escapeHtml(q.topic || 'الموضوع')}
              </span>
              <span class="text-xs font-mono font-bold text-[var(--text-muted)]">Question #${idx + 1} (${q.originalId})</span>
            </div>
            <p class="font-mono text-sm sm:text-base font-semibold text-[var(--text-main)] leading-relaxed" dir="ltr">
              ${escapeHtml(presented.question)}
            </p>
            <div class="space-y-2 pt-1">
              ${optionsHtml}
            </div>
            ${isAnswered ? `
              <div class="topic-feedback mt-3 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200' : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'} text-xs sm:text-sm leading-relaxed" role="status">
                <strong class="block mb-1 font-bold">${isCorrect ? '🎯 إجابة صحيحة وممتازة!' : '💡 التوضيح وفكرة السؤال:'}</strong>
                <span>${escapeHtml(presented.explanation)}</span>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }

    function renderTopicPracticeGroup(questions) {
      let answeredCount = 0;
      let scoreCount = 0;

      questions.forEach(q => {
        const ans = topicSessionState.answers[q.originalId];
        if (ans !== undefined) {
          answeredCount++;
          if (ans === presentQuestion(q, 'topic').correct) scoreCount++;
        }
      });

      const filterPillsHtml = renderTopicFilterPills(questions);
      const cardsHtml = renderTopicCards(questions);

      return `
        <div id="topic-practice-view" class="practice-group-view ${activeGroup === 'topic' ? '' : 'hidden'}">
          <!-- Top score bar -->
          <div class="practice-score-bar flex flex-wrap items-center justify-between gap-3 p-4 mb-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <div class="flex items-center gap-3">
              <span id="topic-practice-score" class="text-xs sm:text-sm font-bold text-[var(--text-main)]">
                النتيجة: <strong class="text-emerald-700 dark:text-emerald-300 font-mono text-base">${scoreCount}</strong> من <span class="font-mono">${answeredCount}</span> مجاب (إجمالي ${questions.length})
              </span>
            </div>
            <button type="button" id="btn-reset-topic-practice" class="workspace-btn-secondary text-xs py-1.5 px-3">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
              <span>إعادة تعيين المحاولة</span>
            </button>
          </div>

          <div id="topic-filter-pills-container">
            ${filterPillsHtml}
          </div>

          <div class="space-y-4" id="topic-cards-container">
            ${cardsHtml}
          </div>
        </div>
      `;
    }

    function renderSlideCards(slideQuestions) {
      const letters = getLetters();

      return slideQuestions.map((s) => {
        const selected = slideSessionState.answers[s.id];
        const isAnswered = selected !== undefined;
        const presented = presentQuestion(s, 'slide');
        const isCorrect = isAnswered && selected === presented.correct;

        let optionsHtml = '';
        presented.options.forEach((optText, optIdx) => {
          let btnClasses = 'slide-micro-opt-btn';
          let badgeIcon = '';

          if (isAnswered) {
            btnClasses += ' is-disabled';
            if (optIdx === presented.correct) {
              btnClasses += ' is-correct';
              badgeIcon = '<span class="text-emerald-700 dark:text-emerald-300 font-bold text-xs">✓ صحيح</span>';
            } else if (optIdx === selected) {
              btnClasses += ' is-wrong';
              badgeIcon = '<span class="text-rose-700 dark:text-rose-300 font-bold text-xs">✗ اختيارك</span>';
            } else {
              btnClasses += ' is-dimmed';
            }
          }

          optionsHtml += `
            <button type="button" class="${btnClasses}" data-slide-id="${s.id}" data-opt="${optIdx}" dir="ltr" ${isAnswered ? 'disabled' : ''}>
              <span class="flex-1 font-mono text-xs sm:text-sm text-left font-medium">
                <strong class="text-purple-600 dark:text-purple-400 mr-2 font-bold font-mono">(${letters[optIdx]})</strong>
                ${escapeHtml(optText)}
              </span>
              ${badgeIcon}
            </button>
          `;
        });

        return `
          <div class="slide-micro-card p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4" data-slide-qid="${s.id}">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                  شريحة #${s.slideNum}
                </span>
                <span class="text-xs font-bold text-[var(--text-main)]">${escapeHtml(s.slideTitle)}</span>
              </div>
              <button type="button" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1" data-jump-slide="${s.slideNum}">
                <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                <span>عرض الشريحة وشرحها</span>
              </button>
            </div>
            <p class="font-mono text-sm sm:text-base font-semibold text-[var(--text-main)] leading-relaxed" dir="ltr">
              ${escapeHtml(presented.question)}
            </p>
            <div class="space-y-2 pt-1">
              ${optionsHtml}
            </div>
            ${isAnswered ? `
              <div class="slide-micro-feedback mt-3 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200' : 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'} text-xs sm:text-sm leading-relaxed" role="status">
                <strong class="block mb-1 font-bold">${isCorrect ? '🎉 إجابة صحيحة وممتازة!' : '💡 توضيح وتريكة الامتحان:'}</strong>
                <span>${escapeHtml(presented.explanation)}</span>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }

    function renderSlideQuestionsGroup(slideQuestions) {
      const cardsHtml = renderSlideCards(slideQuestions);

      return `
        <div id="slide-questions-view" class="practice-group-view ${activeGroup === 'slides' ? '' : 'hidden'}">
          <div class="p-3.5 mb-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm text-[var(--text-main)] flex items-center justify-between gap-3">
            <span>
              💡 هذه الأسئلة مستخرجة مباشرة من الشرائح وتختبر تفاصيل كل شريحة بشكل مستقل.
            </span>
            <button type="button" id="btn-reset-slide-questions" class="workspace-btn-secondary text-xs py-1 px-2.5">
              <span>إعادة تعيين</span>
            </button>
          </div>
          <div class="space-y-4" id="slide-cards-container">
            ${cardsHtml}
          </div>
        </div>
      `;
    }

    function renderFullQuizGroup() {
      return `
        <div id="full-quiz-view" class="practice-group-view ${activeGroup === 'full' ? '' : 'hidden'}">
          <div class="p-3.5 mb-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs sm:text-sm text-[var(--text-main)] flex items-center gap-2.5">
            <i data-lucide="shield-check" class="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0"></i>
            <p>
              <strong>كويز شامل للمحاضرة:</strong> يرتبط هذا الاختبار مباشرة بحفظ تقدم المحاضرة واستكمالها عند الإجابة على كل الأسئلة (حتى مع وجود أخطاء).
            </p>
          </div>
          <div id="full-quiz-host" class="a1-quiz-wrapper"></div>
        </div>
      `;
    }

    function initFullQuizHost(lectureKey, banks) {
      const host = document.getElementById('full-quiz-host');
      if (!host || !window.PortalStudyQuiz) return;

      const canonicalKey = (window.PortalCatalog && typeof window.PortalCatalog.key === 'function')
        ? window.PortalCatalog.key('database-systems', 'lecture', String(lectureKey))
        : JSON.stringify(['database-systems', 'lecture', String(lectureKey)]);

      let quizVersion = null;
      if (window.PortalCatalog) {
        quizVersion = window.PortalCatalog.get(canonicalKey)?.study?.quizVersion || null;
      }
      if (!quizVersion) {
        quizVersion = lectureKey === '2' ? '0f77d6ceae5a' : '48a62c7c8272';
      }

      const quizData = {
        fullQuiz: banks.fullQuizQuestions
      };

      const quizContext = {
        key: canonicalKey,
        quizVersion
      };

      const instance = window.PortalStudyQuiz.create(host);
      instance.render(quizData, quizContext);
      fullQuizRendered = true;
    }

    function updateTopicDisplay(banks) {
      const containerEl = document.getElementById('topic-cards-container');
      if (containerEl) {
        containerEl.innerHTML = renderTopicCards(banks.topicQuestions);
      }

      // Update pills
      const pillsContainer = document.getElementById('topic-filter-pills-container');
      if (pillsContainer) {
        pillsContainer.innerHTML = renderTopicFilterPills(banks.topicQuestions);
      }

      // Update score display
      let answeredCount = 0;
      let scoreCount = 0;
      banks.topicQuestions.forEach(q => {
        const ans = topicSessionState.answers[q.originalId];
        if (ans !== undefined) {
          answeredCount++;
          if (ans === presentQuestion(q, 'topic').correct) scoreCount++;
        }
      });
      const scoreEl = document.getElementById('topic-practice-score');
      if (scoreEl) {
        scoreEl.innerHTML = `النتيجة: <strong class="text-emerald-700 dark:text-emerald-300 font-mono text-base">${scoreCount}</strong> من <span class="font-mono">${answeredCount}</span> مجاب (إجمالي ${banks.topicQuestions.length})`;
      }

      if (window.PortalUI && typeof window.PortalUI.icons === 'function') {
        window.PortalUI.icons(container);
      }
    }

    function updateSlideDisplay(banks) {
      const containerEl = document.getElementById('slide-cards-container');
      if (containerEl) {
        containerEl.innerHTML = renderSlideCards(banks.slideQuestions);
      }
      if (window.PortalUI && typeof window.PortalUI.icons === 'function') {
        window.PortalUI.icons(container);
      }
    }

    function bindDelegatedEvents() {
      // Single event listener on container via delegation
      container.addEventListener('click', (e) => {
        // 1. Group tab switching
        const tab = e.target.closest('[data-practice-group-tab]');
        if (tab && container.contains(tab)) {
          const group = tab.getAttribute('data-practice-group-tab');
          switchGroup(group);
          return;
        }

        // 2. Topic practice option selection
        const optBtn = e.target.closest('.topic-opt-btn:not([disabled])');
        if (optBtn && container.contains(optBtn)) {
          const qid = Number(optBtn.getAttribute('data-qid'));
          const optIdx = Number(optBtn.getAttribute('data-opt'));
          if (topicSessionState.answers[qid] === undefined) {
            topicSessionState.answers[qid] = optIdx;
            updateTopicDisplay(currentBanks);
          }
          return;
        }

        // 3. Topic filter pill
        const filterPill = e.target.closest('[data-topic-filter]');
        if (filterPill && container.contains(filterPill)) {
          const filter = filterPill.getAttribute('data-topic-filter');
          const title = filterPill.getAttribute('data-topic-title') || 'all';
          topicSessionState.filter = filter;
          topicSessionState.filterTitle = title;
          updateTopicDisplay(currentBanks);
          return;
        }

        // 4. Reset topic practice
        const resetTopic = e.target.closest('#btn-reset-topic-practice');
        if (resetTopic && container.contains(resetTopic)) {
          topicSessionState.answers = {};
          updateTopicDisplay(currentBanks);
          return;
        }

        // 5. Slide micro question option selection
        const slideOpt = e.target.closest('.slide-micro-opt-btn:not([disabled])');
        if (slideOpt && container.contains(slideOpt)) {
          const sid = slideOpt.getAttribute('data-slide-id');
          const optIdx = Number(slideOpt.getAttribute('data-opt'));
          if (slideSessionState.answers[sid] === undefined) {
            slideSessionState.answers[sid] = optIdx;
            updateSlideDisplay(currentBanks);
          }
          return;
        }

        // 6. Reset slide questions
        const resetSlide = e.target.closest('#btn-reset-slide-questions');
        if (resetSlide && container.contains(resetSlide)) {
          slideSessionState.answers = {};
          updateSlideDisplay(currentBanks);
          return;
        }

        // 7. Jump to slide detail link
        const jumpLink = e.target.closest('[data-jump-slide]');
        if (jumpLink && container.contains(jumpLink)) {
          const num = jumpLink.getAttribute('data-jump-slide');
          if (typeof options.onJumpSlide === 'function') {
            options.onJumpSlide(num);
          } else if (window.LessonWorkspace && typeof window.LessonWorkspace.showSlide === 'function') {
            window.LessonWorkspace.showSlide(num);
          }
        }
      });
    }

    function switchGroup(group) {
      activeGroup = group;

      // Update tabs
      container.querySelectorAll('[data-practice-group-tab]').forEach(tab => {
        const matches = tab.getAttribute('data-practice-group-tab') === group;
        if (matches) {
          tab.classList.add('is-active');
          tab.setAttribute('aria-selected', 'true');
        } else {
          tab.classList.remove('is-active');
          tab.setAttribute('aria-selected', 'false');
        }
      });

      // Update group visibility
      const topicView = container.querySelector('#topic-practice-view');
      const fullView = container.querySelector('#full-quiz-view');
      const slideView = container.querySelector('#slide-questions-view');

      if (topicView) topicView.classList.toggle('hidden', group !== 'topic');
      if (fullView) fullView.classList.toggle('hidden', group !== 'full');
      if (slideView) slideView.classList.toggle('hidden', group !== 'slides');

      if (group === 'full' && !fullQuizRendered && currentBanks) {
        initFullQuizHost(currentLectureKey, currentBanks);
      }
    }

    async function mount(lectureKey, allExplanations) {
      currentLectureKey = lectureKey;

      if (!window.PortalLessonSource) {
        throw new Error('PortalLessonSource is required to mount practice');
      }

      // Load resources if not present
      const resources = await window.PortalLessonSource.loadPracticeResources();
      if (!resources.ok) throw new Error(resources.message);

      const banks = window.PortalLessonSource.getPracticeBanks(lectureKey, allExplanations);
      if (!banks) {
        container.innerHTML = `
          <div class="p-8 text-center text-rose-600">
            <p>تعذر تجهيز بنوك الأسئلة للمحاضرة المحددة.</p>
          </div>
        `;
        return;
      }

      currentBanks = banks;

      const headerHtml = renderGroupTabs(banks);
      const topicHtml = renderTopicPracticeGroup(banks.topicQuestions);
      const fullHtml = renderFullQuizGroup();
      const slideHtml = renderSlideQuestionsGroup(banks.slideQuestions);

      container.innerHTML = `
        <div class="practice-hub-wrapper">
          ${headerHtml}
          ${topicHtml}
          ${fullHtml}
          ${slideHtml}
        </div>
      `;

      if (activeGroup === 'full') {
        initFullQuizHost(lectureKey, banks);
      }

      if (window.PortalUI && typeof window.PortalUI.icons === 'function') {
        window.PortalUI.icons(container);
      }
    }

    bindDelegatedEvents();

    return {
      mount,
      switchGroup,
      getActiveGroup: () => activeGroup
    };
  }

  return {
    create: createPracticeHost
  };
});
