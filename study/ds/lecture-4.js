/**
 * Lecture 4: Stack (Array & Linked List) — Interactive Features & Study Shell Adapter
 */
(function () {
  'use strict';

  // 1. Reading Progress Bar
  const progressBar = document.getElementById('readingProgressBar') || document.getElementById('reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      progressBar.style.width = pct + '%';
    });
  }

  const readingHeader = document.getElementById('mainReadingHeader');
  if (readingHeader) {
    const updateHeaderOffset = () => {
      document.documentElement.style.setProperty('--reader-header-height', readingHeader.offsetHeight + 'px');
    };
    updateHeaderOffset();
    new ResizeObserver(updateHeaderOffset).observe(readingHeader);
  }

  // 2. Slide-Over Table of Contents Drawer
  const sidebarToc = document.getElementById('sidebar-toc');
  const tocBackdrop = document.getElementById('toc-backdrop');
  const btnOpenToc = document.getElementById('btn-open-toc');
  const btnFloatingToc = document.getElementById('btn-floating-toc');
  const btnCloseToc = document.getElementById('btn-close-toc');

  function openToc() {
    if (sidebarToc) sidebarToc.classList.add('open');
    if (tocBackdrop) tocBackdrop.classList.add('open');
    if (btnOpenToc) btnOpenToc.setAttribute('aria-expanded', 'true');
    const firstLink = sidebarToc ? sidebarToc.querySelector('a[href]') : null;
    if (firstLink) firstLink.focus();
  }

  function closeToc() {
    if (sidebarToc) sidebarToc.classList.remove('open');
    if (tocBackdrop) tocBackdrop.classList.remove('open');
    if (btnOpenToc) {
      btnOpenToc.setAttribute('aria-expanded', 'false');
      btnOpenToc.focus();
    }
  }

  if (btnOpenToc) btnOpenToc.addEventListener('click', openToc);
  if (btnFloatingToc) btnFloatingToc.addEventListener('click', openToc);
  if (btnCloseToc) btnCloseToc.addEventListener('click', closeToc);
  if (tocBackdrop) tocBackdrop.addEventListener('click', closeToc);

  document.querySelectorAll('.toc-link').forEach(function (link) {
    link.addEventListener('click', function () {
      closeToc();
    });
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebarToc && sidebarToc.classList.contains('open')) {
      closeToc();
    }
  });

  // 3. Reading Controls: Font Size and Line Spacing
  let currentFontScale = 100;
  const scales = [90, 100, 110, 120, 130];
  const fontDec = document.getElementById('btnFontDec');
  const fontInc = document.getElementById('btnFontInc');
  const fontLabel = document.getElementById('fontSizeLabel');

  function updateFontScale(newScale) {
    currentFontScale = newScale;
    document.documentElement.style.setProperty('--reading-size', (currentFontScale / 100 * 1.15) + 'rem');
    if (fontLabel) fontLabel.textContent = currentFontScale + '%';
    try {
      localStorage.setItem('sem2_reading_scale', String(currentFontScale));
    } catch (_) {}
  }

  if (fontDec && fontInc) {
    fontDec.addEventListener('click', function () {
      const idx = scales.indexOf(currentFontScale);
      if (idx > 0) updateFontScale(scales[idx - 1]);
    });
    fontInc.addEventListener('click', function () {
      const idx = scales.indexOf(currentFontScale);
      if (idx < scales.length - 1) updateFontScale(scales[idx + 1]);
    });
    try {
      const savedScale = parseInt(localStorage.getItem('sem2_reading_scale'), 10);
      if (scales.includes(savedScale)) updateFontScale(savedScale);
    } catch (_) {}
  }

  let lineSpacingTight = false;
  const lineSpacingBtn = document.getElementById('btnLineSpacing');
  if (lineSpacingBtn) {
    lineSpacingBtn.addEventListener('click', function () {
      lineSpacingTight = !lineSpacingTight;
      lineSpacingBtn.setAttribute('aria-pressed', String(lineSpacingTight));
      document.documentElement.style.setProperty('--reading-lh', lineSpacingTight ? '1.75' : '2.15');
      lineSpacingBtn.textContent = lineSpacingTight ? '↕ تباعد مكثف' : '↕ تباعد مريح';
    });
  }

  // 4. Interactive Array Stack Simulator (5 Stages matching Slide 23 & 24)
  function renderStackCells(values, topIdx) {
    let html = '<div class="flex flex-col sm:flex-row items-center justify-center gap-6 py-2" dir="ltr">';
    html += '<div class="px-5 py-2.5 rounded-xl bg-amber-100 border-2 border-amber-600 text-amber-950 font-mono font-black text-base shadow-xs">top = ' + topIdx + '</div>';
    html += '<div class="w-56 border-2 border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-md font-mono">';
    for (let i = 4; i >= 0; i--) {
      const val = i <= topIdx ? values[i] : '(فارغ)';
      const isTop = i === topIdx;
      const rowBg = isTop
        ? 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/60 dark:text-emerald-200 font-black border-l-8 border-l-emerald-700'
        : (i < topIdx
            ? 'bg-sky-50 text-slate-900 dark:bg-sky-950/40 dark:text-sky-200 font-bold'
            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500');
      html += '<div class="p-2.5 border-b border-slate-300 dark:border-slate-700 last:border-b-0 flex items-center justify-between text-xs sm:text-sm ' + rowBg + '">' +
        '<span>arr[' + i + ']' + (isTop ? ' ⬅ TOP' : '') + '</span>' +
        '<span>' + val + '</span>' +
      '</div>';
    }
    html += '</div></div>';
    return html;
  }

  const arrStages = [
    {
      badge: 'خطوة 1/5',
      title: 'المرحلة 1: إنشاء المكدس الفارغ (Stack s;)',
      code: 'Stack s; // Constructor sets top = -1',
      desc: 'في البداية المصفوفة فارغة تماماً، والمتغير top يساوي -1 (خارج حدود الفهارس 0..4):',
      html: renderStackCells([], -1)
    },
    {
      badge: 'خطوة 2/5',
      title: 'المرحلة 2: إضافة 10 ثم 20 ثم 30 (السطور 79–81)',
      code: 's.push(10);  s.push(20);  s.push(30);',
      desc: 'مع كل push، يزيد top بـ 1 أولاً (++top) ثم يدخل الرقم. الآن top = 2 ويشير للرقم 30:',
      html: renderStackCells([10, 20, 30], 2)
    },
    {
      badge: 'خطوة 3/5',
      title: 'المرحلة 3: إضافة 40 ثم 50 — امتلاء المصفوفة (السطران 82–83)',
      code: 's.push(40);  s.push(50); // top reaches MAX - 1 (4)',
      desc: 'وصل top إلى 4 (وهو MAX - 1)، وبذلك امتلأت الخانات الخمسة بالكامل وأصبحت isFull() ترجع true:',
      html: renderStackCells([10, 20, 30, 40, 50], 4)
    },
    {
      badge: 'خطوة 4/5',
      title: 'المرحلة 4: محاولة إضافة 60 وحدوث Stack Overflow! (السطر 84)',
      code: 's.push(60); // Output: Stack Overflow! Cannot push 60',
      desc: 'لأن isFull() رجعت true، يرفض البرنامج إدخال الـ 60 ويطبع رسالة Stack Overflow ويظل top = 4 عند 50:',
      html: renderStackCells([10, 20, 30, 40, 50], 4)
    },
    {
      badge: 'خطوة 5/5',
      title: 'المرحلة 5: تنفيذ s.pop() مرتين ثم s.peek() (السطور 88–91)',
      code: 's.pop(); // 50 popped\ns.pop(); // 40 popped\ns.peek(); // Top is 30',
      desc: 'خرجت 50 ثم خرجت 40 ونزل المؤشر مرتين ليصبح top = 2 واقفاً عند العنصر 30:',
      html: renderStackCells([10, 20, 30], 2)
    }
  ];

  let currentArrStage = 0;
  const arrSimDisplay = document.getElementById('arr-sim-display');
  const arrSimBadge = document.getElementById('arr-sim-badge');
  const arrSimTabs = document.querySelectorAll('.arr-sim-tab');

  function renderArrSim() {
    if (!arrSimDisplay || !arrSimBadge) return;
    const st = arrStages[currentArrStage];
    arrSimBadge.textContent = st.badge;
    arrSimDisplay.innerHTML =
      '<div class="font-black text-emerald-950 dark:text-emerald-300 text-base sm:text-lg">' + st.title + '</div>' +
      '<div class="code-surface whitespace-pre-wrap p-3 rounded-xl border border-slate-700 text-xs sm:text-sm text-emerald-300 font-mono" dir="ltr">' + st.code + '</div>' +
      '<div class="text-sm sm:text-base text-slate-900 dark:text-slate-100 font-bold">' + st.desc + '</div>' +
      '<div class="pt-2 bg-[#faf5e8] dark:bg-slate-800/80 p-4 rounded-xl border border-[#d6cbb5] dark:border-slate-700">' + st.html + '</div>';

    arrSimTabs.forEach(function (tab, idx) {
      tab.setAttribute('aria-pressed', String(idx === currentArrStage));
    });
  }

  const btnPrev = document.getElementById('arr-sim-prev');
  const btnNext = document.getElementById('arr-sim-next');

  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      currentArrStage = (currentArrStage - 1 + arrStages.length) % arrStages.length;
      renderArrSim();
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', function () {
      currentArrStage = (currentArrStage + 1) % arrStages.length;
      renderArrSim();
    });
  }

  arrSimTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      currentArrStage = parseInt(tab.getAttribute('data-arr-stage'), 10);
      renderArrSim();
    });
  });

  renderArrSim();

  // 4b. Interactive Push / Pop / Peek / Reset controls for free exploration
  const interactiveStack = [];
  const liveDisplay = document.getElementById('sim-live-display');
  const MAX_CAPACITY = 5;
  const inputVal = document.getElementById('sim-input-val');
  const btnPush = document.getElementById('sim-btn-push');
  const btnPop = document.getElementById('sim-btn-pop');
  const btnPeek = document.getElementById('sim-btn-peek');
  const btnReset = document.getElementById('sim-btn-reset');
  const statusEl = document.getElementById('sim-interactive-status');

  function updateInteractiveStatus(msg, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'font-mono text-xs font-bold ' + (isError ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400');
  }

  function renderInteractiveCells() {
    if (!liveDisplay) return;
    const topIdx = interactiveStack.length - 1;
    liveDisplay.innerHTML =
      '<div class="font-black text-emerald-950 dark:text-emerald-300 text-base sm:text-lg">تجربة حية تفاعلية للمكدس (Live Interactive Stack)</div>' +
      '<div class="code-surface p-3 rounded-xl border border-slate-700 text-xs sm:text-sm text-emerald-300 font-mono" dir="ltr">// Elements count: ' + interactiveStack.length + ' / ' + MAX_CAPACITY + ' | top = ' + topIdx + '</div>' +
      '<div class="pt-2 bg-[#faf5e8] dark:bg-slate-800/80 p-4 rounded-xl border border-[#d6cbb5] dark:border-slate-700">' + renderStackCells(interactiveStack, topIdx) + '</div>';
  }

  if (btnPush && inputVal) {
    btnPush.addEventListener('click', function () {
      const val = inputVal.valueAsNumber;
      if (!Number.isSafeInteger(val)) {
        updateInteractiveStatus('⚠️ الرجاء إدخال رقم صحيح!', true);
        return;
      }
      if (interactiveStack.length >= MAX_CAPACITY) {
        updateInteractiveStatus('❌ Stack Overflow! لا يمكن إضافة ' + val + '، المكدس ممتلئ!', true);
      } else {
        interactiveStack.push(val);
        updateInteractiveStatus('✅ تم إدخال ' + val + ' بنجاح! top أصبح ' + (interactiveStack.length - 1));
        inputVal.value = val + 10;
        renderInteractiveCells();
      }
    });
  }

  if (btnPop) {
    btnPop.addEventListener('click', function () {
      if (interactiveStack.length === 0) {
        updateInteractiveStatus('❌ Stack Underflow! لا توجد عناصر لحذفها!', true);
      } else {
        const popped = interactiveStack.pop();
        updateInteractiveStatus('✅ تم حذف ' + popped + ' من قمة المكدس! top أصبح ' + (interactiveStack.length - 1));
        renderInteractiveCells();
      }
    });
  }

  if (btnPeek) {
    btnPeek.addEventListener('click', function () {
      if (interactiveStack.length === 0) {
        updateInteractiveStatus('ℹ️ المكدس فارغ تماماً (top = -1)!', true);
      } else {
        const topVal = interactiveStack[interactiveStack.length - 1];
        updateInteractiveStatus('ℹ️ قمة المكدس (Peek) هي: ' + topVal + ' عند الفهرس ' + (interactiveStack.length - 1));
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', function () {
      interactiveStack.length = 0;
      updateInteractiveStatus('🔄 تم تفريغ المكدس وإعادة ضبط top إلى -1');
      renderInteractiveCells();
    });
  }

  renderInteractiveCells();

  const draft = document.getElementById('student-code-area');
  document.getElementById('btn-clear-draft')?.addEventListener('click', () => {
    if (!draft) return;
    draft.value = '';
    draft.focus();
  });

  // 5. Copy Code Buttons
  const toast = document.getElementById('toast');
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('opacity-0', 'translate-y-2');
    setTimeout(function () {
      toast.classList.add('opacity-0', 'translate-y-2');
    }, 2000);
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('تم نسخ الكود بنجاح!');
    } catch (_) {}
    document.body.removeChild(ta);
  }

  document.querySelectorAll('.copy-code-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const code = btn.getAttribute('data-code');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () {
          showToast('تم نسخ الكود بنجاح!');
        }).catch(function () {
          fallbackCopy(code);
        });
      } else {
        fallbackCopy(code);
      }
    });
  });

  // 6. Section Completion Checkmarks
  const completedSections = {};
  const badgeEl = document.getElementById('completed-count-badge');
  const checkBtns = document.querySelectorAll('.check-sec-btn');
  const totalCheckBtns = checkBtns.length || 11;
  if (badgeEl) badgeEl.textContent = '0/' + totalCheckBtns;

  checkBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const id = btn.getAttribute('data-check');
      completedSections[id] = !completedSections[id];
      btn.setAttribute('aria-pressed', String(completedSections[id]));
      btn.textContent = completedSections[id] ? '✓ مكتمل' : '✓ تم الفهم';
      const count = Object.values(completedSections).filter(Boolean).length;
      if (badgeEl) badgeEl.textContent = count + '/' + totalCheckBtns;
    });
  });

  // 7. Dynamic Interactive Quiz Wiring
  const QUIZ_DATA = (typeof window !== 'undefined' && window.quizQuestions) ? window.quizQuestions : (typeof quizQuestions !== 'undefined' ? quizQuestions : []);
  const quizContainer = document.getElementById('quizQuestionsContainer');
  const scoreEl = document.getElementById('quizScoreDisplay');
  const answeredState = {};

  function renderQuestions(filter) {
    if (!quizContainer) return;
    quizContainer.innerHTML = '';
    const filtered = filter === 'all' ? QUIZ_DATA : QUIZ_DATA.filter(q => q.part === filter);

    filtered.forEach(q => {
      const article = document.createElement('article');
      article.className = 'p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4';
      article.dataset.qid = String(q.id);
      article.dataset.part = q.part;

      const header = document.createElement('div');
      header.className = 'flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold';
      header.innerHTML = '<span>' + q.partLabel + '</span>';

      const prompt = document.createElement('h4');
      prompt.className = 'text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 leading-relaxed';
      prompt.textContent = q.question;

      const optionsGrid = document.createElement('div');
      optionsGrid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1';

      const choices = q.options.map((opt, idx) => ({
        text: opt,
        index: idx,
        isCorrect: idx === q.correct
      }));

      const choiceItems = window.QuizChoices && window.QuizChoices.shuffleChoices
        ? window.QuizChoices.shuffleChoices(choices, q.id)
        : choices;

      choiceItems.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'reader-control quiz-option w-full';
        btn.type = 'button';
        btn.innerHTML = '<span>' + choice.text + '</span>';

        btn.addEventListener('click', () => {
          if (answeredState[q.id] !== undefined) return;
          answeredState[q.id] = choice.index;
          updateScore();
          showAnswer().focus();
        });

        optionsGrid.appendChild(btn);
      });

      article.appendChild(header);
      article.appendChild(prompt);
      article.appendChild(optionsGrid);

      function showAnswer() {
        choiceItems.forEach((choice, index) => {
          const option = optionsGrid.children[index];
          option.disabled = true;
          if (choice.isCorrect) option.classList.add('correct');
          else if (choice.index === answeredState[q.id]) option.classList.add('wrong');
        });

        const expBox = document.createElement('div');
        expBox.className = 'quiz-explanation p-3.5 rounded-xl border text-xs sm:text-sm';
        expBox.tabIndex = -1;
        expBox.textContent = q.explanation;
        article.appendChild(expBox);
        return expBox;
      }

      if (answeredState[q.id] !== undefined) showAnswer();
      quizContainer.appendChild(article);
    });
  }

  function updateScore() {
    if (!scoreEl) return;
    const correctCount = Object.entries(answeredState).filter(([id, ans]) => {
      const q = QUIZ_DATA.find(item => item.id === Number(id));
      return q && q.correct === ans;
    }).length;
    scoreEl.textContent = 'النتيجة: ' + correctCount + ' / ' + QUIZ_DATA.length;
  }

  let currentFilter = 'all';
  document.querySelectorAll('.quiz-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quiz-filter-btn').forEach(b => {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      currentFilter = btn.getAttribute('data-quiz-filter');
      renderQuestions(currentFilter);
    });
  });

  const btnResetQuiz = document.getElementById('btnResetQuiz');
  if (btnResetQuiz) {
    btnResetQuiz.addEventListener('click', () => {
      Object.keys(answeredState).forEach(k => delete answeredState[k]);
      updateScore();
      renderQuestions(currentFilter);
    });
  }

  if (QUIZ_DATA.length > 0) {
    renderQuestions('all');
  }

})();