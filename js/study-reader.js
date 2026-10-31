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

  let imageZoom;
  function openImageZoom(src, title) {
    if (!imageZoom) {
      imageZoom = document.createElement('div');
      imageZoom.className = 'fixed inset-0 z-[9999] bg-black/90 p-4 hidden';
      imageZoom.setAttribute('aria-label', 'تكبير صورة السلايد');
      imageZoom.innerHTML = '<div class="flex h-full flex-col items-center gap-3"><button type="button" data-reader-zoom-close class="self-end rounded-lg bg-white px-4 py-2 text-black">إغلاق تكبير الصورة</button><img class="min-h-0 max-h-full max-w-full object-contain" alt=""></div>';
      document.body.append(imageZoom);
      imageZoom.querySelector('button').addEventListener('click', () => window.PortalDialog.close(imageZoom));
      imageZoom.addEventListener('click', event => {
        if (event.target === imageZoom || event.target === imageZoom.firstElementChild) window.PortalDialog.close(imageZoom);
      });
    }
    const image = imageZoom.querySelector('img');
    image.src = src;
    image.alt = title || 'صورة السلايد بالحجم الكامل';
    window.PortalDialog.open(imageZoom, {initialFocus: '[data-reader-zoom-close]'});
  }

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
      reader: {slideId: currentLecture.slides[currentSlideIndex].num, tab: Boolean(studyTabBtnQuiz && studyTabBtnQuiz.classList.contains('active')) ? 'quiz' : (readerMode === 'slide' ? 'original' : 'explanation'), updatedAt: new Date().toISOString()}
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
    saveReaderPosition();
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

  async function ensureSlideView() {
    if (window.PortalSlideView) return window.PortalSlideView;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL('js/lesson-slide-view.js', document.baseURI).href;
      script.onload = () => resolve(window.PortalSlideView);
      script.onerror = () => reject(new Error('Failed to load PortalSlideView'));
      document.head.append(script);
    });
  }

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
      const [allExp] = await Promise.all([
        window.PortalStudyLoader.load(),
        ensureSlideView()
      ]);
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

    // بناء بطاقات التغذية المستمرة للشرائح عبر مفوض العرض المشترك
    studySlidesFeed.innerHTML = window.PortalSlideView.renderSlideCards(data.slides, {
      totalSlides: data.totalSlides
    });
    window.PortalSlideView.bindSlideInteractions(studySlidesFeed, {onImageZoom: openImageZoom});

    // The full quiz is built only when its tab is selected.

    studySlidesFeed.querySelectorAll('.slide-study-card').forEach(card => {
      const image = card.querySelector('img');
      if (image) image.parentElement.dataset.readerPart = 'slide';
      card.lastElementChild.dataset.readerPart = 'explanation';
    });
    const savedPosition = window.PortalStudyState.getItem(activeContentKey)?.reader;
    const deepLink = window.PortalContentLinks.parse(window.location);
    const hasExplicitItem = deepLink.isValid && deepLink.item === activeContentKey;
    const requestedSlide = hasExplicitItem && deepLink.slide ? deepLink.slide : savedPosition?.slideId;
    const requestedTab = hasExplicitItem && deepLink.tab ? deepLink.tab : savedPosition?.tab;
    let slideIdx = data.slides.findIndex(slide => Number(slide.num) === Number(requestedSlide));
    if (slideIdx < 0) slideIdx = 0;
    selectSlide(slideIdx);
    if (requestedTab === 'quiz' && data.fullQuiz && data.fullQuiz.length > 0) {
      switchStudyTab('quiz');
    } else if (requestedTab === 'original') {
      switchStudyTab('slides');
      setReaderMode('slide');
    } else {
      switchStudyTab('slides');
      setReaderMode('explanation');
    }
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


    const instance = {open: openSmartStudyModal};
    if (typeof window !== 'undefined' && window.PortalStudyReader) {
      window.PortalStudyReader.current = instance;
    }
    return instance;
  }
  window.PortalStudyReader = {create};
})();
