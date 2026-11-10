/**
 * Computer Graphics Chapter 1: Introduction to Graphics Systems
 * Page-local implementation: Quiz engine, Reading controls, TOC Drawer, and Interactive Widgets
 */
(function () {
  'use strict';

  // Ensure QUIZ_QUESTIONS exists
  const quizQuestions = window.quizQuestions || [];
  const QUIZ_QUESTIONS = window.QUIZ_QUESTIONS || quizQuestions;
  window.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
  window.quizQuestions = quizQuestions;

  // 2. STATE AND STORAGE
  const ANSWERS_STORAGE_KEY = 'sem2_cg_chapter1_answers_v1';
  const userAnswers = {};
  window.userAnswers = userAnswers;

  function loadSavedAnswers() {
    try {
      const storage = (window.PortalStorage && typeof window.PortalStorage.getItem === 'function') 
        ? window.PortalStorage 
        : window.localStorage;
      const raw = storage.getItem(ANSWERS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          Object.assign(userAnswers, parsed);
        }
      }
    } catch (_) {}
  }

  function saveAnswers() {
    try {
      const storage = (window.PortalStorage && typeof window.PortalStorage.setItem === 'function') 
        ? window.PortalStorage 
        : window.localStorage;
      storage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(userAnswers));
    } catch (_) {}
  }

  // 3. QUIZ RENDERING
  function renderQuizCard(q, containerPrefix) {
    const answered = userAnswers[q.id];
    const hasAnswered = answered !== undefined;
    const isCorrect = hasAnswered && answered === q.correct;

    const optionsHtml = q.options.map((opt, idx) => {
      let extraClass = '';
      let icon = '⚪';
      if (hasAnswered) {
        if (idx === q.correct) {
          extraClass = 'correct-choice';
          icon = '✅';
        } else if (idx === answered) {
          extraClass = 'incorrect-choice';
          icon = '❌';
        } else {
          extraClass = 'opacity-60';
        }
      }

      return `
        <button type="button"
          data-qid="${q.id}"
          data-option="${idx}"
          class="quiz-opt-btn w-full text-left px-4 py-3 rounded-xl text-sm flex items-center justify-between gap-3 ${extraClass} en-block"
          dir="ltr">
          <span class="font-semibold">${opt}</span>
          <span aria-hidden="true">${icon}</span>
        </button>
      `;
    }).join('');

    const explanationHtml = hasAnswered ? `
      <div class="mt-3 p-4 rounded-xl border-r-4 ${isCorrect ? 'border-emerald-600 bg-emerald-500/10' : 'border-amber-600 bg-amber-500/10'} text-sm space-y-1 ar-block" dir="rtl">
        <div class="font-extrabold ${isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}">
          ${isCorrect ? '✅ إجابة صحيحة! الشرح بالعامية:' : '💡 الشرح والتوضيح بالعامية:'}
        </div>
        <p class="leading-relaxed">${q.ammiya || q.explanation}</p>
      </div>
    ` : '';

    return `
      <article class="card-surface reader-card rounded-2xl p-5 space-y-3 shadow-sm border border-[var(--study-line,#e2e8f0)]" id="${containerPrefix}-${q.id}" data-qid="${q.id}">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400">${q.type === 'MCQ' ? 'Multiple Choice (MCQ)' : 'True or False'}</span>
          ${hasAnswered ? `<span class="text-xs font-bold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}">${isCorrect ? 'صح ✓' : 'خطأ ✗'}</span>` : '<span class="text-xs opacity-60">اضغط على الخيار لإظهار الشرح</span>'}
        </div>
        <p class="font-bold text-base en-block" dir="ltr">${q.qEn || q.question}</p>
        <div class="flex flex-col gap-2 pt-1">
          ${optionsHtml}
        </div>
        ${explanationHtml}
      </article>
    `;
  }

  function renderAllQuizzes() {
    const sections = ['sec1', 'sec2', 'sec3', 'sec4', 'sec5'];
    sections.forEach(secId => {
      const container = document.getElementById('quiz-' + secId);
      if (container) {
        const qs = QUIZ_QUESTIONS.filter(q => q.section === secId);
        container.innerHTML = qs.map(q => renderQuizCard(q, secId)).join('');
      }
    });

    const allContainer = document.getElementById('quiz-all');
    if (allContainer) {
      allContainer.innerHTML = QUIZ_QUESTIONS.map(q => renderQuizCard(q, 'all')).join('');
    }

    const total = QUIZ_QUESTIONS.length;
    const correctCount = QUIZ_QUESTIONS.filter(q => userAnswers[q.id] === q.correct).length;
    const answeredCount = Object.keys(userAnswers).length;

    const scoreBadge = document.getElementById('scoreBadge');
    if (scoreBadge) {
      scoreBadge.textContent = `${correctCount} / ${total}`;
    }

    const prog = document.getElementById('globalQuizProgress');
    if (prog) {
      prog.style.width = `${Math.round((answeredCount / total) * 100)}%`;
    }
  }

  window.handleQuizAnswer = function (qId, optionIdx) {
    const question = QUIZ_QUESTIONS.find(q => q.id === qId);
    if (!question) return;

    const focusedOption = document.activeElement.closest('.quiz-opt-btn');
    const focusedCardId = focusedOption?.closest('article')?.id;
    const focusedOptionIdx = focusedOption?.dataset.option;

    userAnswers[qId] = optionIdx;
    saveAnswers();
    renderAllQuizzes();

    if (focusedCardId) {
      document.getElementById(focusedCardId)
        ?.querySelector(`button[data-option="${focusedOptionIdx}"]`)
        ?.focus({ preventScroll: true });
    }

    const status = document.getElementById('quiz-answer-status');
    if (status) {
      const result = optionIdx === question.correct ? 'إجابة صحيحة' : 'إجابة غير صحيحة';
      status.textContent = `${result}. ${question.ammiya || question.explanation}`;
    }
  };

  // Event delegation for quiz option buttons
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.quiz-opt-btn');
    if (!btn) return;
    const qId = btn.getAttribute('data-qid');
    const optIdx = parseInt(btn.getAttribute('data-option'), 10);
    if (qId && !isNaN(optIdx)) {
      window.handleQuizAnswer(qId, optIdx);
    }
  });

  // 4. INTERACTIVE PIXEL DEPTH CALCULATOR
  window.showPixelDepth = function (bits) {
    const readout = document.getElementById('depthReadout');
    if (!readout) return;
    const colors = Math.pow(2, bits).toLocaleString('en-US');
    let note = '';
    if (bits === 1) note = ' (أبيض وأسود فقط - 1-bit Bitmap)';
    else if (bits === 8) note = ' (256 لون - شاشات الـ Indexed Color)';
    else if (bits === 24) note = ' (حوالي 16.7 مليون لون - Full True Color)';

    readout.textContent = `${bits} bit => 2^${bits} = ${colors} لوناً${note}`;

    document.querySelectorAll('[data-pixel-btn]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(Number(btn.dataset.pixelBtn) === bits));
    });
  };

  // 5. READING CONTROLS: FONT SCALE & LINE SPACING
  const FONT_SCALES = [0.9, 1.0, 1.1, 1.2, 1.3];
  let fontScaleIdx = 1;

  function setFontScale(newIdx) {
    fontScaleIdx = Math.max(0, Math.min(FONT_SCALES.length - 1, newIdx));
    const scale = FONT_SCALES[fontScaleIdx];
    document.documentElement.style.setProperty('--font-scale', String(scale));
    const label = document.getElementById('fontSizeLabel');
    if (label) label.textContent = Math.round(scale * 100) + '%';
  }

  const LINE_SPACINGS = [
    { label: 'تباعد: عادي', lh: '1.75' },
    { label: 'تباعد: مريح', lh: '2.0' },
    { label: 'تباعد: مريح جداً', lh: '2.25' }
  ];
  let lineSpacingIdx = 2;

  function cycleLineSpacing() {
    lineSpacingIdx = (lineSpacingIdx + 1) % LINE_SPACINGS.length;
    const item = LINE_SPACINGS[lineSpacingIdx];
    document.body.style.setProperty('--reading-line-height', item.lh);
    const btn = document.getElementById('btnLineSpacing');
    if (btn) btn.textContent = item.label;
  }

  // 6. TOC DRAWER AND BACKDROP
  function initDrawer() {
    const drawer = document.getElementById('sidebar-toc');
    const opener = document.getElementById('btn-open-toc');
    const closer = document.getElementById('btn-close-toc');
    const backdrop = document.getElementById('toc-backdrop');
    if (!drawer || !opener) return;

    let previousFocus = null;

    function openDrawer() {
      previousFocus = document.activeElement;
      drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      opener.setAttribute('aria-expanded', 'true');
      const firstLink = drawer.querySelector('a, button');
      if (firstLink) firstLink.focus();
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      opener.setAttribute('aria-expanded', 'false');
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus();
      }
    }

    opener.addEventListener('click', openDrawer);
    if (closer) closer.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    drawer.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function () {
        closeDrawer();
      });
    });
  }

  // 7. SECTION TABS SCROLL SYNCHRONIZATION
  function initSectionNav() {
    const tabs = document.querySelectorAll('.tab-btn[data-section]');
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const secId = this.getAttribute('data-section');
        const target = document.getElementById(secId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const secId = entry.target.id;
            tabs.forEach(tab => {
              const matches = tab.getAttribute('data-section') === secId;
              tab.classList.toggle('active', matches);
              if (matches) tab.setAttribute('aria-current', 'true');
              else tab.removeAttribute('aria-current');
            });
          }
        });
      }, { threshold: 0.25 });

      document.querySelectorAll('.chapter-section').forEach(sec => observer.observe(sec));
    }
  }

  function setGraphicsBreadcrumb() {
    // The shared shell does not register Graphics until the catalog wiring change.
    const breadcrumb = document.querySelector('.study-portal-bar nav a');
    if (!breadcrumb) return;
    document.documentElement.dataset.studyCourse = 'computer-graphics';
    breadcrumb.href = '../../subject.html?id=computer-graphics&kind=lectures';
    breadcrumb.textContent = 'الرسم بالحاسوب';
  }

  // 8. INITIALIZATION
  document.addEventListener('DOMContentLoaded', function () {
    setGraphicsBreadcrumb();
    loadSavedAnswers();
    renderAllQuizzes();

    // Reset button
    const btnReset = document.getElementById('btnResetAllQuizzes');
    if (btnReset) {
      btnReset.addEventListener('click', function () {
        document.getElementById('quiz-answer-status').textContent = '';
        Object.keys(userAnswers).forEach(k => delete userAnswers[k]);
        saveAnswers();
        renderAllQuizzes();
      });
    }

    // Font size buttons
    const btnFontInc = document.getElementById('btnFontInc');
    const btnFontDec = document.getElementById('btnFontDec');
    if (btnFontInc) btnFontInc.addEventListener('click', () => setFontScale(fontScaleIdx + 1));
    if (btnFontDec) btnFontDec.addEventListener('click', () => setFontScale(fontScaleIdx - 1));

    // Line spacing button
    const btnLineSpacing = document.getElementById('btnLineSpacing');
    if (btnLineSpacing) btnLineSpacing.addEventListener('click', cycleLineSpacing);

    // Pixel depth calculator buttons
    document.querySelectorAll('[data-pixel-btn]').forEach(btn => {
      btn.addEventListener('click', function () {
        const bits = parseInt(this.getAttribute('data-pixel-btn'), 10);
        if (!isNaN(bits)) window.showPixelDepth(bits);
      });
    });

    initDrawer();
    initSectionNav();
  });
})();
