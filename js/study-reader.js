/* Slide walkthrough, navigation and reader controls. */
(function () {
  function create() {
  // ============================================================================
  // المذاكرة والشرح الذكي للمحاضرات (Smart Lecture Study Modal)
  // ============================================================================
  const studyModal = document.getElementById("lecture-study-modal");
  const studyModalClose = document.getElementById("study-modal-close");
  const studyModalTitle = document.getElementById("study-modal-title");
  const studyModalBadge = document.getElementById("study-modal-progress-badge");
  const studyTabBtnSlides = document.getElementById("study-tab-btn-slides");
  const studyTabBtnQuiz = document.getElementById("study-tab-btn-quiz");
  const studyFullQuizBadge = document.getElementById("study-full-quiz-badge");
  const studySlidesView = document.getElementById("study-slides-view");
  const studyFullQuizView = document.getElementById("study-full-quiz-view");
  const studyProgressBar = document.getElementById("study-progress-bar");
  const studyJumpBar = document.getElementById("study-jump-bar");
  const studySlidesFeed = document.getElementById("study-slides-feed");
  const studyFullscreenBtn = document.getElementById("study-modal-fullscreen");
  const studyFontZoomIn = document.getElementById("study-font-zoom-in");
  const studyFontZoomOut = document.getElementById("study-font-zoom-out");

  let isStudyFullscreen = false;
  let currentStudyFontZoom = 0; // 0 = normal, 1 = lg, 2 = xl
  let requestSequence = 0;
  let currentLecture;
  let quizRendered = false;
  let currentSlideIndex = 0;
  let readerMode = "explanation";
  let activeContentKey = null, activeQuizVersion = null, restoringPosition = true;
  function saveReaderPosition() {
    if (restoringPosition || !activeContentKey || !currentLecture) return;
    const existing = window.PortalStudyState.getItem(activeContentKey);
    window.PortalStudyState.updateItem(activeContentKey, {
      startedAt: existing?.startedAt || new Date().toISOString(),
      reader: {slideId: currentLecture.slides[currentSlideIndex].num, tab: readerMode === 'slide' ? 'original' : 'explanation', updatedAt: new Date().toISOString()}
    });
  }
  studyModal.classList.add("a1-reader-workspace");
  const layout = document.createElement("div"); layout.className = "a1-reader-layout";
  const outline = document.createElement("aside"); outline.className = "a1-reader-outline";
  const body = document.createElement("div"); body.className = "a1-reader-body";
  const modes = studyTabBtnSlides.parentElement; modes.classList.add('a1-reader-modes');
  studyTabBtnSlides.dataset.readerMode = 'explanation'; studyTabBtnSlides.textContent = 'الشرح';
  const originalTab = document.createElement('button'); originalTab.type = 'button'; originalTab.className = 'study-nav-tab';
  originalTab.dataset.readerMode = 'slide'; originalTab.textContent = 'السلايد الأصلي'; originalTab.setAttribute('aria-pressed', 'false');
  modes.insertBefore(originalTab, studyTabBtnQuiz);
  const pagination = document.createElement("div"); pagination.className = "a1-reader-pagination";
  pagination.innerHTML = '<button type="button" data-reader-step="prev">السابق</button><span data-reader-position role="status"></span><button type="button" data-reader-step="next">التالي</button>';
  outline.append(studyJumpBar); body.append(studySlidesFeed, pagination); layout.append(outline, body); studySlidesView.append(layout);
  function selectSlide(index, focus = false) {
    if (!currentLecture) return;
    currentSlideIndex = Math.max(0, Math.min(currentLecture.slides.length - 1, index));
    const slide = currentLecture.slides[currentSlideIndex];
    studySlidesFeed.querySelectorAll('.slide-study-card').forEach(card => { card.hidden = Number(card.dataset.slideNum) !== slide.num; });
    studyJumpBar.querySelectorAll('button').forEach(button => {
      const active = button.dataset.jumpTo === 'slide-card-' + slide.num;
      button.className = 'study-jump-pill' + (active ? ' a1-current-slide' : '');
      if (active) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
    });
    const activePill = studyJumpBar.querySelector('[aria-current="step"]');
    if (activePill) {
      const viewport = window.matchMedia('(max-width:760px)').matches ? studyJumpBar : outline;
      const box = viewport.getBoundingClientRect(), pill = activePill.getBoundingClientRect();
      const left = pill.left < box.left ? pill.left - box.left : pill.right > box.right ? pill.right - box.right : 0;
      const top = pill.top < box.top ? pill.top - box.top : pill.bottom > box.bottom ? pill.bottom - box.bottom : 0;
      viewport.scrollBy({left, top, behavior: 'instant'});
    }
    pagination.querySelector('[data-reader-position]').textContent = `سلايد ${currentSlideIndex + 1} من ${currentLecture.slides.length}`;
    pagination.querySelector('[data-reader-step="prev"]').disabled = currentSlideIndex === 0;
    pagination.querySelector('[data-reader-step="next"]').disabled = currentSlideIndex === currentLecture.slides.length - 1;
    studyProgressBar.style.width = `${(currentSlideIndex + 1) / currentLecture.slides.length * 100}%`;
    studySlidesFeed.scrollTop = 0;
    if (focus) { const card = document.getElementById('slide-card-' + slide.num); card.tabIndex = -1; card.focus({preventScroll: true}); }
    saveReaderPosition();
  }
  function setReaderMode(mode) {
    readerMode = mode;
    studySlidesFeed.querySelectorAll('[data-reader-part]').forEach(part => { part.hidden = part.dataset.readerPart !== readerMode; });
    modes.querySelectorAll('[data-reader-mode]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.readerMode === mode)); button.classList.toggle('active', button.dataset.readerMode === mode); });
    studySlidesFeed.scrollTop = 0;
    saveReaderPosition();
  }
  modes.addEventListener('click', event => { const button = event.target.closest('[data-reader-mode]'); if (button) { switchStudyTab("slides"); setReaderMode(button.dataset.readerMode); } });
  pagination.addEventListener('click', event => { const button = event.target.closest('[data-reader-step]'); if (button) selectSlide(currentSlideIndex + (button.dataset.readerStep === 'next' ? 1 : -1), true); });


  function setStudyFontZoom(level) {
    if (!studySlidesFeed) return;
    studySlidesFeed.classList.remove("study-font-lg", "study-font-xl");
    if (level === 1) studySlidesFeed.classList.add("study-font-lg");
    if (level === 2) studySlidesFeed.classList.add("study-font-xl");
    currentStudyFontZoom = level;
  }

  function toggleStudyFullscreen() {
    if (!studyModal) return;
    isStudyFullscreen = !isStudyFullscreen;
    studyModal.classList.toggle("is-fullscreen", isStudyFullscreen);
    const icon = document.getElementById("fullscreen-icon");
    if (icon) {
      icon.setAttribute("data-lucide", isStudyFullscreen ? "minimize-2" : "maximize-2");
      window.PortalUI.icons(studyModal);
    }
  }

  function switchStudyTab(tab) {
    if (tab === "slides") {
      if (studyTabBtnSlides) studyTabBtnSlides.classList.add("active");
      if (studyTabBtnQuiz) studyTabBtnQuiz.classList.remove("active");
      if (studySlidesView) studySlidesView.classList.remove("hidden");
      if (studyFullQuizView) studyFullQuizView.classList.add("hidden");
    } else {
      if (!currentLecture) return;
      if (!quizRendered) {
        renderFullQuiz(currentLecture, { key: activeContentKey, quizVersion: activeQuizVersion });
        quizRendered = true;
      }
      modes.querySelectorAll('[data-reader-mode]').forEach(button => { button.classList.remove('active'); button.setAttribute('aria-pressed', 'false'); });
      if (studyTabBtnQuiz) studyTabBtnQuiz.classList.add("active");
      if (studySlidesView) studySlidesView.classList.add("hidden");
      if (studyFullQuizView) studyFullQuizView.classList.remove("hidden");
    }
    window.PortalUI.icons(studyModal);
  }

  if (studyTabBtnSlides) {
    studyTabBtnSlides.addEventListener("click", () => switchStudyTab("slides"));
  }
  if (studyTabBtnQuiz) {
    studyTabBtnQuiz.addEventListener("click", () => switchStudyTab("quiz"));
  }

  if (studyFullscreenBtn) {
    studyFullscreenBtn.addEventListener("click", toggleStudyFullscreen);
  }
  if (studyFontZoomIn) {
    studyFontZoomIn.addEventListener("click", () => {
      if (currentStudyFontZoom < 2) setStudyFontZoom(currentStudyFontZoom + 1);
    });
  }
  if (studyFontZoomOut) {
    studyFontZoomOut.addEventListener("click", () => {
      if (currentStudyFontZoom > 0) setStudyFontZoom(currentStudyFontZoom - 1);
    });
  }

  function closeSmartStudyModal() {
    if (!studyModal) return;
    window.PortalDialog.close(studyModal);
  }

  const fullQuiz = window.PortalStudyQuiz.create(studyFullQuizView);
  const renderFullQuiz = (data, context) => fullQuiz.render(data, context);

  async function openSmartStudyModal(courseId, lectureId) {
    restoringPosition = true;
    activeContentKey = window.PortalCatalog.key(courseId, 'lecture', lectureId);
    const catalogEntry = window.PortalCatalog ? window.PortalCatalog.get(activeContentKey) : null;
    activeQuizVersion = catalogEntry?.study?.quizVersion || window.STUDY_CATALOG?.[courseId]?.[lectureId]?.quizVersion || null;
    if (!studyModal || !studySlidesFeed) return;
    const sequence = ++requestSequence;
    currentLecture = undefined;
    currentSlideIndex = 0; readerMode = "explanation";
    pagination.querySelectorAll("button").forEach(button => { button.disabled = true; });
    pagination.querySelector("[data-reader-position]").textContent = "";
    quizRendered = false;
    studyFullQuizView.replaceChildren();
    studyTabBtnQuiz.disabled = true;
    switchStudyTab("slides");
    studyJumpBar.replaceChildren();
    studySlidesFeed.innerHTML = '<p role="status" class="py-8 text-center text-sm">جارٍ تحميل شرح المحاضرة…</p>';
    studyModalTitle.textContent = "شرح المحاضرة";
    studyModal.setAttribute("aria-busy", "true");
    window.PortalDialog.open(studyModal, {onClose() {
      requestSequence++;
      studyModal.removeAttribute("aria-busy");
    }});
    let data;
    try {
      const allExp = await window.PortalStudyLoader.load();
      if (sequence !== requestSequence) return;
      data = allExp[courseId]?.[lectureId];
      if (!data) throw new Error("Study lecture unavailable");
    } catch {
      if (sequence !== requestSequence) return;
      studyModal.removeAttribute("aria-busy");
      studySlidesFeed.innerHTML = '<div role="status" class="py-8 text-center space-y-4"><p>تعذر تحميل الشرح. تحقق من الاتصال وحاول مرة أخرى.</p><button id="study-retry" type="button" class="px-4 py-2 bg-indigo-600 text-white rounded-xl">إعادة المحاولة</button></div>';
      document.getElementById("study-retry").addEventListener("click", () => openSmartStudyModal(courseId, lectureId));
      return;
    }
    currentLecture = data;
    studyTabBtnQuiz.disabled = false;
    studyModal.removeAttribute("aria-busy");

    if (studyModalTitle) {
      studyModalTitle.textContent = `${data.lectureTitle} • ${data.lectureArabicTitle || ""}`;
    }
    if (studyModalBadge) {
      studyModalBadge.textContent = `${data.totalSlides} شريحة`;
    }
    if (studyFullQuizBadge && data.fullQuiz) {
      studyFullQuizBadge.textContent = `${data.fullQuiz.length} سؤال`;
    }

    // إعادة التبويب الافتراضي لتاب الشرح
    switchStudyTab("slides");

    // بناء شريط القفز السريع للشرائح
    if (studyJumpBar) {
      studyJumpBar.innerHTML = data.slides.map((s, idx) => `
        <button 
          type="button" 
          data-jump-to="slide-card-${s.num}" 
          class="study-jump-pill px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border cursor-pointer ${
            idx === 0 
              ? 'bg-purple-600 text-white border-purple-500 shadow-sm' 
              : 'glass-panel text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-purple-500/30'
          }"
        >
          <span class="font-mono">#${s.num}</span>
          <span class="text-[11px] font-medium hidden sm:inline max-w-[120px] truncate">${s.title}</span>
        </button>
      `).join("");

      studyJumpBar.querySelectorAll(".study-jump-pill").forEach((btn) => {
        btn.addEventListener("click", function () {
          const number = Number(this.dataset.jumpTo.replace('slide-card-', ''));
          selectSlide(currentLecture.slides.findIndex(slide => slide.num === number), true);
        });
      });
    }

    // بناء بطاقات التغذية المستمرة للشرائح
    studySlidesFeed.innerHTML = data.slides.map((s) => {
      if (s.quiz) s = {...s, quiz: window.PortalQuizChoices.present(s.quiz, 'slide:' + s.num + ':' + s.quiz.question)};
      // تفكيك النقاط المتعددة إذا كانت الشريحة تحوي أكثر من مفهوم
      const pointsHtml = s.points && s.points.length > 0 ? `
        <div class="space-y-2.5 mt-3 pt-3 border-t border-[var(--border-subtle)]">
          <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1.5 flex items-center gap-1.5">
            <i data-lucide="list" class="w-3.5 h-3.5"></i>
            عناصر ومحاور الشريحة بالتفصيل:
          </span>
          <div class="grid grid-cols-1 gap-2.5">
            ${s.points.map(pt => `
              <div class="study-concept-item border p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-start gap-2.5">
                ${pt.badge ? `
                  <span class="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 font-bold text-xs font-mono self-start flex-shrink-0">
                    ${pt.badge}
                  </span>
                ` : ''}
                <div class="flex-1 min-w-0">
                  ${pt.title ? `<h5 class="text-xs sm:text-sm font-extrabold text-[var(--text-main)] mb-1">${pt.title}</h5>` : ''}
                  <p class="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed study-concept-desc">${pt.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : '';

      // تفكيك الرسم أو المخطط قطعة قطعة (Diagram Deconstruction)
      const diagramHtml = s.diagramDeconstruction ? `
        <div class="study-diagram-box p-4 sm:p-5 rounded-2xl border border-sky-500/35 space-y-3.5">
          <div class="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-extrabold text-xs sm:text-sm">
            <i data-lucide="layers" class="w-4 h-4"></i>
            <span>🧩 ${s.diagramDeconstruction.title || "تفكيك الرسم والمخطط حتة حتة (Diagram Deconstruction):"}</span>
          </div>
          ${s.diagramDeconstruction.overview ? `
            <p class="text-xs sm:text-sm text-[var(--text-main)] font-semibold leading-relaxed bg-[var(--bg-surface)] p-3 rounded-xl border border-sky-500/20">
              ${s.diagramDeconstruction.overview}
            </p>
          ` : ""}
          <div class="grid grid-cols-1 gap-2.5">
            ${(s.diagramDeconstruction.parts || []).map(part => `
              <div class="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] flex flex-col sm:flex-row sm:items-start gap-3">
                <div class="flex items-center gap-2 sm:flex-col sm:items-start flex-shrink-0">
                  <span class="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-mono font-black text-xs">
                    ${part.symbol || part.label}
                  </span>
                  ${part.type ? `
                    <span class="text-[10px] text-[var(--text-dim)] font-medium font-mono">${part.type}</span>
                  ` : ""}
                </div>
                <div class="flex-1 min-w-0">
                  <h6 class="text-xs sm:text-sm font-extrabold text-[var(--text-main)] mb-1">${part.role || part.title}</h6>
                  <p class="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-1.5">${part.meaning}</p>
                  ${part.example ? `
                    <div class="text-[11px] font-medium text-sky-600 dark:text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-lg inline-block">
                      💡 <strong>تطبيق عملي:</strong> ${part.example}
                    </div>
                  ` : ""}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : "";

      // مقارنات مباشرة وسريعة (Comparisons: X vs Y)
      const comparisonHtml = s.comparison ? `
        <div class="study-comparison-box p-4 sm:p-5 rounded-2xl border border-purple-500/35 space-y-3">
          <div class="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-extrabold text-xs sm:text-sm">
            <i data-lucide="git-compare" class="w-4 h-4"></i>
            <span>⚖️ ${s.comparison.title || "مقارنة هامة في الامتحان (Comparison):"}</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${(s.comparison.items || []).map(item => `
              <div class="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1.5">
                <span class="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-bold text-xs inline-block">
                  ${item.name}
                </span>
                <p class="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-medium">${item.desc}</p>
                ${item.example ? `
                  <div class="text-[11px] text-[var(--text-dim)] mt-1">📌 <strong>مثال:</strong> ${item.example}</div>
                ` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      ` : "";

      // مثال عملي واقعي يرسخ المفهوم (Real-world practical example)
      const realLifeHtml = s.realLifeExample ? `
        <div class="p-3.5 sm:p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-950 dark:text-emerald-200">
          <div class="flex items-start gap-2.5">
            <span class="text-lg flex-shrink-0">🏢</span>
            <div class="flex-1 min-w-0">
              <strong class="text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-300 block mb-1">
                ${s.realLifeExample.title || "مثال واقعي من الحياة العملية:"}
              </strong>
              <p class="text-xs sm:text-sm leading-relaxed text-[var(--text-main)] font-medium">
                ${s.realLifeExample.desc}
              </p>
            </div>
          </div>
        </div>
      ` : "";

      // شفرة الامتحان: لو شوفت كذا اختار كذا
      const triggersHtml = s.triggers && s.triggers.length > 0 ? `
        <div class="study-cheat-box space-y-2.5">
          <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs sm:text-sm">
            <i data-lucide="target" class="w-4 h-4"></i>
            <span>🎯 شفرة الامتحان (لو شوفت كذا اختار كذا):</span>
          </div>
          <div class="grid grid-cols-1 gap-2">
            ${s.triggers.map(tr => `
              <div class="study-cheat-item flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div class="flex items-center gap-2 text-xs text-[var(--text-main)] font-medium">
                  <span class="text-emerald-500 font-bold">👈</span>
                  <span>${tr.trigger}</span>
                </div>
                <div class="self-start sm:self-auto flex-shrink-0">
                  <span class="text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-mono inline-block">
                    ${tr.choose}
                  </span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : "";

      // الكلمات المفتاحية والمصطلحات
      const keywordsHtml = s.keywords && s.keywords.length > 0 ? `
        <div class="p-3.5 rounded-2xl glass-panel border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div class="flex items-center gap-2 mb-2.5 text-xs font-bold text-indigo-600 dark:text-cyan-400">
            <i data-lucide="key" class="w-3.5 h-3.5"></i>
            <span>المفاهيم والمصطلحات الأساسية:</span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${s.keywords.map(kw => `
              <div class="study-keyword-pill flex items-center gap-2 text-xs">
                <span class="kw-en font-bold font-mono text-indigo-600 dark:text-cyan-300">${kw.en}</span>
                <span class="text-[var(--text-dim)]">←</span>
                <span class="kw-ar font-medium text-[var(--text-main)]">${kw.ar}</span>
              </div>
            `).join("")}
          </div>
        </div>
      ` : "";

      // تريكات الامتحان وفخاخ الأسئلة (عالية التباين بجميع الأوضاع)
      const tricksHtml = s.tricks ? `
        <div class="study-trick-box flex items-start gap-3">
          <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i data-lucide="zap" class="w-4 h-4"></i>
          </div>
          <div class="flex-1 min-w-0">
            <span class="trick-title text-xs sm:text-sm font-extrabold block mb-1">⚡ فخ وتريكة في الامتحان:</span>
            <p class="trick-text text-xs sm:text-sm leading-relaxed">${s.tricks}</p>
          </div>
        </div>
      ` : "";

      // الكويز باللغة الإنجليزية مع التفسير بالعامية المصرية ومصطلحات المادة
      const quizHtml = s.quiz ? `
        <div class="p-4 sm:p-5 rounded-2xl glass-panel border border-indigo-500/30 bg-[var(--bg-surface)] quiz-card" data-correct-idx="${s.quiz.correct}">
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <i data-lucide="help-circle" class="w-4 h-4"></i>
              <span>سؤال متوقع من الامتحانات السابقة (Exam Practice):</span>
            </span>
            <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-mono font-bold border border-indigo-500/20">English MCQ</span>
          </div>
          
          <!-- نص السؤال بالإنجليزي محاذاة لليسار لوضوح القراءة -->
          <div class="p-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] mb-3 dir-ltr text-left">
            <p class="text-xs sm:text-sm font-bold text-[var(--text-main)] leading-relaxed font-sans">${s.quiz.question}</p>
          </div>

          <!-- الخيارات بالإنجليزي -->
          <div class="space-y-2 quiz-options">
            ${s.quiz.options.map((opt, optIdx) => `
              <button 
                type="button" 
                dir="ltr" class="quiz-opt-btn w-full text-left dir-ltr p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-main)] hover:border-indigo-500 hover:bg-[var(--bg-card-hover)] transition-all flex items-center justify-between gap-3 group cursor-pointer" 
                data-option-index="${optIdx}"
              >
                <span class="flex-1 font-sans quiz-opt-text">${opt}</span>
                <span class="w-6 h-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center text-[11px] text-[var(--text-dim)] group-hover:border-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 font-mono font-bold flex-shrink-0 transition-colors">
                  ${String.fromCharCode(65 + optIdx)}
                </span>
              </button>
            `).join("")}
          </div>
          <div class="quiz-feedback hidden mt-3 p-3.5 rounded-xl text-xs leading-relaxed border transition-all text-right dir-rtl" data-explanation="${encodeURIComponent(s.quiz.explanation || "")}"></div>
        </div>
      ` : "";

      const introText = s.explanationIntro || s.colloquial || "";

      return `
        <article id="slide-card-${s.num}" class="glass-panel p-5 sm:p-7 rounded-3xl border border-[var(--border-subtle)] space-y-5 slide-study-card relative overflow-hidden shadow-xl" data-slide-num="${s.num}">
          
          <!-- هيدر الشريحة -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-xl bg-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                #${s.num}
              </span>
              <div>
                <h4 class="text-sm sm:text-base font-extrabold text-[var(--text-main)]">${s.title}</h4>
                <p class="text-xs text-[var(--text-muted)] font-medium">${s.arabicTitle || ""}</p>
              </div>
            </div>
            <span class="text-[11px] px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 font-bold self-start sm:self-auto font-mono">
              الشريحة ${s.num} من ${data.totalSlides}
            </span>
          </div>

          <!-- صورة الشريحة كاملة وتظهر أولاً بشكل بارز -->
          <div class="rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-black/40 shadow-xl relative group">
            <img 
              src="${s.image}" 
              alt="Slide ${s.num}: ${s.title}" 
              class="w-full h-auto object-contain max-h-[580px] mx-auto block" 
              loading="lazy" 
            />
            <div class="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 opacity-85 group-hover:opacity-100 transition-opacity">
              <i data-lucide="presentation" class="w-3.5 h-3.5 text-purple-400"></i>
              <span>Slide #${s.num}</span>
            </div>
          </div>

          <!-- الشرح تحت السلايد مباشرة -->
          <div class="space-y-4 pt-1">
            
            <!-- 1. الشرح وتوضيح الشريحة بالعامية المصرية ومصطلحات المادة -->
            <div class="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
              <div class="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs sm:text-sm">
                <i data-lucide="book-open" class="w-4 h-4"></i>
                <span>شرح السلايد بالعامية المصرية ومصطلحات المقرر:</span>
              </div>
              ${introText ? `<p class="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed font-semibold mb-2.5">${introText}</p>` : ""}
              ${pointsHtml}
              ${s.coreSummary ? `
                <div class="mt-3 pt-3 border-t border-[var(--border-subtle)] text-[11px] sm:text-xs text-[var(--text-muted)] flex items-start gap-2">
                  <i data-lucide="info" class="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5"></i>
                  <span><strong>الخلاصة السريعة:</strong> ${s.coreSummary}</span>
                </div>
              ` : ""}
            </div>

            <!-- تفكيك الرسم والمخطط بالتفصيل إن وجد -->
            ${diagramHtml}

            <!-- المقارنات المباشرة إن وجدت -->
            ${comparisonHtml}

            <!-- المثال العملي الواقعي إن وجد -->
            ${realLifeHtml}

            <!-- 2. شفرة الامتحان (لو شوفت كذا اختار كذا) -->
            ${triggersHtml}

            <!-- 3. الكلمات المفتاحية والمصطلحات -->
            ${keywordsHtml}

            <!-- 4. تريكات وفخاخ الامتحان عالية التباين -->
            ${tricksHtml}

            <!-- 5. الكويز التدريبي باللغة الإنجليزية مع التفسير بالعامية -->
            ${quizHtml}

          </div>
        </article>
      `;
    }).join("");

    // تفاعل الكويزات داخل السلايدات مع التفسير بالعامية المصرية ومصطلحات المادة
    studySlidesFeed.querySelectorAll(".quiz-card").forEach((card) => {
      const correctIdx = parseInt(card.getAttribute("data-correct-idx"), 10);
      const feedbackEl = card.querySelector(".quiz-feedback");
      const rawExplanation = feedbackEl ? decodeURIComponent(feedbackEl.getAttribute("data-explanation") || "") : "";
      const buttons = card.querySelectorAll(".quiz-opt-btn");

      buttons.forEach((btn) => {
        btn.addEventListener("click", function () {
          const selectedIdx = parseInt(this.getAttribute("data-option-index"), 10);
          
          // تعطيل جميع الخيارات بعد الإجابة
          buttons.forEach((b) => {
            b.disabled = true;
            b.classList.remove("hover:border-indigo-500", "hover:bg-[var(--bg-card-hover)]");
            b.classList.add("cursor-default");
          });

          if (selectedIdx === correctIdx) {
            // إجابة صحيحة
            this.classList.add("border-emerald-600", "bg-emerald-500/15", "text-emerald-700", "dark:text-emerald-300");
            const badge = this.querySelector("span:last-child");
            if (badge) {
              badge.classList.add("border-emerald-600", "text-emerald-600", "dark:text-emerald-300", "bg-emerald-500/20");
            }

            if (feedbackEl) {
              feedbackEl.classList.remove("hidden");
              feedbackEl.className = "quiz-feedback mt-3 p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-right dir-rtl animate-fade-in";
              feedbackEl.innerHTML = `
                <div class="flex items-start gap-2.5">
                  <span class="text-xl flex-shrink-0">🎉</span>
                  <div class="flex-1">
                    <strong class="font-extrabold text-emerald-800 dark:text-emerald-300 block mb-1">إجابة صحيحة وممتازة!</strong>
                    <p class="leading-relaxed font-medium">${rawExplanation}</p>
                  </div>
                </div>
              `;
            }
          } else {
            // إجابة خاطئة
            this.classList.add("border-rose-600", "bg-rose-500/15", "text-rose-700", "dark:text-rose-300");
            const badge = this.querySelector("span:last-child");
            if (badge) {
              badge.classList.add("border-rose-600", "text-rose-600", "dark:text-rose-300", "bg-rose-500/20");
            }

            // إبراز الخيار الصحيح
            const correctBtn = card.querySelector(`[data-option-index="${correctIdx}"]`);
            if (correctBtn) {
              correctBtn.classList.add("border-emerald-600/80", "bg-emerald-500/15", "text-emerald-700", "dark:text-emerald-300");
            }

            if (feedbackEl) {
              feedbackEl.classList.remove("hidden");
              feedbackEl.className = "quiz-feedback mt-3 p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200 text-right dir-rtl animate-fade-in";
              feedbackEl.innerHTML = `
                <div class="flex items-start gap-2.5">
                  <span class="text-xl flex-shrink-0">💡</span>
                  <div class="flex-1">
                    <strong class="font-extrabold text-rose-800 dark:text-rose-300 block mb-1">توضيح وتريكة الامتحان:</strong>
                    <p class="leading-relaxed font-medium">${rawExplanation}</p>
                  </div>
                </div>
              `;
            }
          }
        });
      });
    });

    // The full quiz is built only when its tab is selected.

    studySlidesFeed.querySelectorAll('.slide-study-card').forEach(card => {
      const image = card.querySelector('img');
      if (image) image.parentElement.dataset.readerPart = 'slide';
      card.lastElementChild.dataset.readerPart = 'explanation';
    });
    const savedPosition = window.PortalStudyState.getItem(activeContentKey)?.reader;
    const deepLink = window.PortalContentLinks.parse(window.location);
    const requestedSlide = deepLink.item === activeContentKey && deepLink.slide ? deepLink.slide : savedPosition?.slideId;
    const requestedTab = deepLink.item === activeContentKey && deepLink.tab ? deepLink.tab : savedPosition?.tab;
    setReaderMode(requestedTab === 'original' ? 'slide' : 'explanation');
    selectSlide(Math.max(0, data.slides.findIndex(slide => Number(slide.num) === Number(requestedSlide))));
    restoringPosition = false;
    saveReaderPosition();
    window.PortalStudyState.setLastUsed({key: activeContentKey, actionId: 'internal-study'});
    window.PortalUI.icons(studyModal);
  }

  if (studyModalClose) {
    studyModalClose.addEventListener("click", closeSmartStudyModal);
  }
  if (studyModal) {
    studyModal.addEventListener("click", function (e) {
      if (e.target === studyModal) {
        closeSmartStudyModal();
      }
    });
  }


    return {open: openSmartStudyModal};
  }
  window.PortalStudyReader = {create};
})();
