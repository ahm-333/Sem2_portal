/**
 * LessonWorkspace (js/lesson-workspace.js)
 * Orchestrates the unified Database Systems lesson workspace:
 * - One title, unified outline, settings group, and reading surface (OS visual reference).
 * - Topic reading with contextual slide launchers.
 * - Bidirectional navigation: topic -> slide detail -> original image -> next/prev slide -> return to exact topic position.
 * - Complete slide index (covers, outlines, COMPANY/UML examples, summaries).
 * - Honest recovery for unsupported lectures, missing blocks, network failures, or file:// restrictions.
 *
 * Owned by Issue #30 under Epic #27.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.LessonWorkspace = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  let currentLectureMeta = null;
  let currentLectureData = null;
  let currentBlocks = [];
  let currentSlideIndex = 0;
  let lastTopicAnchor = null;
  let currentFontZoom = 0; // 0: normal, 1: lg, 2: xl
  let currentLectureKey = null;
  let practiceInstance = null;

  function getQueryParam(name) {
    if (typeof window === 'undefined' || !window.location) return null;
    return new URLSearchParams(window.location.search).get(name);
  }

  function setFontZoom(level) {
    currentFontZoom = Math.max(0, Math.min(2, level));
    const paper = document.getElementById('workspace-paper');
    if (!paper) return;
    paper.classList.remove('study-font-lg', 'study-font-xl');
    if (currentFontZoom === 1) paper.classList.add('study-font-lg');
    if (currentFontZoom === 2) paper.classList.add('study-font-xl');
  }

  function openImageZoom(imgSrc, title) {
    const modal = document.getElementById('slide-zoom-modal');
    const img = document.getElementById('slide-zoom-img');
    const titleEl = document.getElementById('slide-zoom-title');
    if (!modal || !img) return;

    img.src = imgSrc;
    img.alt = title || 'تكبير صورة السلايد';
    if (titleEl) titleEl.textContent = title || '';
    modal.hidden = false;
    window.PortalDialog.open(modal, {
      initialFocus: '#slide-zoom-close',
      onClose() { modal.hidden = true; }
    });
  }

  function closeImageZoom() {
    const modal = document.getElementById('slide-zoom-modal');
    if (!modal) return;
    window.PortalDialog.close(modal);
  }

  async function switchView(view) {
    const topicView = document.getElementById('topic-reading-view');
    const slideView = document.getElementById('slide-detail-view');
    const practiceView = document.getElementById('practice-hub');
    const topicBtn = document.getElementById('view-btn-topics');
    const slideBtn = document.getElementById('view-btn-slides');
    const practiceBtn = document.getElementById('view-btn-practice');

    if (view === 'topics') {
      if (topicView) topicView.hidden = false;
      if (slideView) slideView.hidden = true;
      if (practiceView) practiceView.hidden = true;
      if (topicBtn) {
        topicBtn.classList.add('is-active');
        topicBtn.setAttribute('aria-pressed', 'true');
      }
      if (slideBtn) {
        slideBtn.classList.remove('is-active');
        slideBtn.setAttribute('aria-pressed', 'false');
      }
      if (practiceBtn) {
        practiceBtn.classList.remove('is-active');
        practiceBtn.setAttribute('aria-pressed', 'false');
      }
    } else if (view === 'slides') {
      if (topicView) topicView.hidden = true;
      if (slideView) slideView.hidden = false;
      if (practiceView) practiceView.hidden = true;
      if (topicBtn) {
        topicBtn.classList.remove('is-active');
        topicBtn.setAttribute('aria-pressed', 'false');
      }
      if (slideBtn) {
        slideBtn.classList.add('is-active');
        slideBtn.setAttribute('aria-pressed', 'true');
      }
      if (practiceBtn) {
        practiceBtn.classList.remove('is-active');
        practiceBtn.setAttribute('aria-pressed', 'false');
      }
    } else if (view === 'practice') {
      if (topicView) topicView.hidden = true;
      if (slideView) slideView.hidden = true;
      if (practiceView) practiceView.hidden = false;
      if (topicBtn) {
        topicBtn.classList.remove('is-active');
        topicBtn.setAttribute('aria-pressed', 'false');
      }
      if (slideBtn) {
        slideBtn.classList.remove('is-active');
        slideBtn.setAttribute('aria-pressed', 'false');
      }
      if (practiceBtn) {
        practiceBtn.classList.add('is-active');
        practiceBtn.setAttribute('aria-pressed', 'true');
      }

      // Lazily mount practice instance
      if (!practiceInstance && practiceView && currentLectureKey) {
        if (window.PortalLessonSource && typeof window.PortalLessonSource.loadPracticeResources === 'function') {
          await window.PortalLessonSource.loadPracticeResources();
        }
        if (window.PortalLessonPractice && typeof window.PortalLessonPractice.create === 'function') {
          practiceInstance = window.PortalLessonPractice.create(practiceView, {
            onJumpSlide: showSlide
          });
          const allExplanations = {
            'database-systems': {
              [currentLectureKey]: currentLectureData
            }
          };
          await practiceInstance.mount(currentLectureKey, allExplanations);
        }
      }
    }
  }

  function scrollBehavior() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  function showSlide(slideNum, callerAnchor = null) {
    if (!currentLectureData || !currentLectureData.slides) return;
    const num = Number(slideNum);
    const index = currentLectureData.slides.findIndex(s => Number(s.num) === num);
    if (index === -1) return;

    currentSlideIndex = index;
    if (callerAnchor) lastTopicAnchor = callerAnchor;

    switchView('slides');

    const feed = document.getElementById('slide-viewer-feed');
    if (feed) {
      feed.querySelectorAll('.slide-study-card').forEach(card => {
        const matches = Number(card.dataset.slideNum) === num;
        card.hidden = !matches;
      });
    }

    // Update stepper controls
    const prevBtn = document.querySelector('[data-slide-nav="prev"]');
    const nextBtn = document.querySelector('[data-slide-nav="next"]');
    const counter = document.getElementById('slide-stepper-counter');
    const total = currentLectureData.slides.length;

    if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
    if (nextBtn) nextBtn.disabled = currentSlideIndex === total - 1;
    if (counter) counter.textContent = `شريحة ${currentSlideIndex + 1} من ${total}`;

    // Update return button text
    const returnBtn = document.querySelector('[data-return-to-topic]');
    if (returnBtn) {
      returnBtn.hidden = !lastTopicAnchor;
      if (lastTopicAnchor) {
        returnBtn.setAttribute('data-target-topic', lastTopicAnchor);
      }
    }

    // Scroll to top of slide feed & focus card
    const targetCard = document.getElementById('slide-card-' + num);
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
      targetCard.tabIndex = -1;
      targetCard.focus({ preventScroll: true });
    }
  }

  function returnToTopic() {
    if (!lastTopicAnchor) {
      switchView('topics');
      return;
    }
    switchView('topics');

    const targetEl = document.getElementById(lastTopicAnchor) ||
                     document.getElementById('topic-' + lastTopicAnchor) ||
                     document.querySelector(`[data-block-id="${lastTopicAnchor}"]`);

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
      targetEl.tabIndex = -1;
      targetEl.focus({ preventScroll: true });
    }
  }

  function renderRecovery(errorInfo) {
    const recoveryView = document.getElementById('recovery-view');
    const paper = document.getElementById('workspace-paper');
    const toolbar = document.querySelector('.workspace-toolbar');
    const outline = document.getElementById('workspace-outline');

    if (paper) paper.removeAttribute('aria-busy');
    if (toolbar) toolbar.hidden = true;
    if (outline) outline.hidden = true;
    if (document.getElementById('topic-reading-view')) document.getElementById('topic-reading-view').hidden = true;
    if (document.getElementById('slide-detail-view')) document.getElementById('slide-detail-view').hidden = true;

    if (!recoveryView) return;
    recoveryView.hidden = false;

    let title = 'تعذر تحميل المحاضرة';
    let message = errorInfo.message || 'المحاضرة المطلوبة غير متوفرة حالياً.';
    let icon = '⚠️';

    if (errorInfo.isLocalFile) {
      title = 'تنبيه: قيود تشغيل الملفات محلياً (file://)';
      message = 'محددات أمان المتصفح تمنع القراءة المباشرة واستخراج المحتوى عبر بروتوكول file://. يمكنك فتح الشرح الأصلي مباشرة:';
      icon = '📁';
    } else if (errorInfo.error === 'UNSUPPORTED_LECTURE') {
      title = 'محاضرة غير متوفرة في مساحة المذاكرة الموحدة';
      message = 'المحاضرة المطلوبة غير مدعومة حالياً. مساحة المذاكرة الموحدة متاحة حالياً لدروس قواعد البيانات: المحاضرة الثانية (الفصل الأول) والمحاضرة الثالثة (الفصل الثاني).';
      icon = '📚';
    }

    recoveryView.innerHTML = `
      <div class="workspace-recovery-card" role="alert">
        <span class="recovery-icon" aria-hidden="true">${icon}</span>
        <h2>${title}</h2>
        <p>${message}</p>
        <div class="recovery-links">
          ${errorInfo.fallbackUrl ? `
            <a href="${errorInfo.fallbackUrl}" class="workspace-btn-primary">
              <i data-lucide="external-link" class="w-4 h-4"></i>
              <span>فتح الشرح الأصلي</span>
            </a>
          ` : ''}
          <a href="lesson.html?lecture=2" class="workspace-btn-primary">
            <span>المحاضرة 2: Databases and Database Users</span>
          </a>
          <a href="lesson.html?lecture=3" class="workspace-btn-primary">
            <span>المحاضرة 3: Database System Concepts and Architecture</span>
          </a>
          <a href="../../subject.html?id=database-systems" class="workspace-btn-secondary">
            <span>العودة لصفحة المادة (قواعد البيانات)</span>
          </a>
          ${errorInfo.retryable ? `
            <button type="button" class="workspace-btn-secondary" onclick="window.location.reload()">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
              <span>إعادة المحاولة</span>
            </button>
          ` : ''}
        </div>
      </div>
    `;

    if (window.PortalUI && typeof window.PortalUI.icons === 'function') {
      window.PortalUI.icons(recoveryView);
    }
  }

  function renderOutline(items, lectureKey) {
    const outlineEl = document.getElementById('workspace-outline');
    if (!outlineEl) return;

    let html = `
      <div class="lesson-index-header">
        <i data-lucide="compass" class="w-4 h-4 text-indigo-600 dark:text-indigo-400"></i>
        <span>خريطة الدرس</span>
      </div>
      <div class="outline-section">
        <div class="outline-section-title">الموضوعات الأساسية</div>
        <nav class="outline-nav" aria-label="أقسام الدرس">
    `;

    for (const item of items) {
      if (item.kind === 'topic-block') {
        html += `
          <a href="#topic-${item.id}" class="outline-link" data-topic-link="${item.id}">
            <span>${item.title}</span>
          </a>
        `;
        if (item.contextualSlides && item.contextualSlides.length > 0) {
          for (const s of item.contextualSlides) {
            html += `
              <a href="#slide-card-${s.num}" class="outline-sub-link" data-slide-link="${s.num}">
                <span>#${s.num} ${s.title}</span>
              </a>
            `;
          }
        }
      } else if (item.kind === 'supplementary-examples') {
        html += `
          <div class="outline-section-title mt-4">${item.title}</div>
        `;
        for (const s of item.slides || []) {
          html += `
            <a href="#slide-card-${s.num}" class="outline-link" data-slide-link="${s.num}">
              <span>#${s.num} ${s.title}</span>
            </a>
          `;
        }
      } else if (item.kind === 'slide') {
        html += `
          <a href="#slide-card-${item.slideNum}" class="outline-link" data-slide-link="${item.slideNum}">
            <span>#${item.slideNum} ${item.title}</span>
          </a>
        `;
      }
    }

    html += `
        </nav>
      </div>
      <div class="outline-section mt-4 pt-3 border-t border-[var(--study-line)]">
        <div class="outline-section-title">التدريب والأسئلة</div>
        <nav class="outline-nav" aria-label="أقسام التدريب">
          <a href="#practice-hub" class="outline-link font-bold text-indigo-600 dark:text-indigo-400">
            <span>بنك الأسئلة والتدريب</span>
          </a>
        </nav>
      </div>
    `;

    outlineEl.innerHTML = html;

    // Attach click events on outline links
    outlineEl.querySelectorAll('[data-topic-link]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const blockId = link.getAttribute('data-topic-link');
        switchView('topics');
        const target = document.getElementById('topic-' + blockId) || document.getElementById(blockId);
        if (target) {
          target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
          target.focus({ preventScroll: true });
        }
      });
    });

    const practiceOutlineLink = outlineEl.querySelector('a[href="#practice-hub"]');
    if (practiceOutlineLink) {
      practiceOutlineLink.addEventListener('click', e => {
        e.preventDefault();
        switchView('practice');
        const hub = document.getElementById('practice-hub');
        if (hub) {
          hub.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
        }
      });
    }

    outlineEl.querySelectorAll('[data-slide-link]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const num = link.getAttribute('data-slide-link');
        showSlide(num);
      });
    });
  }

  function renderTopicBlocks(blocks, lectureKey) {
    const feed = document.getElementById('lesson-topics-feed');
    if (!feed) return;
    feed.innerHTML = '';

    for (const b of blocks) {
      const section = document.createElement('section');
      section.id = 'topic-' + b.id;
      section.className = 'topic-block-wrapper';
      section.setAttribute('data-block-id', b.id);
      section.tabIndex = -1;

      // Header
      const header = document.createElement('div');
      header.className = 'topic-block-header';
      header.innerHTML = `
        <span class="topic-block-order">الموضوع ${b.order}</span>
        <h2 class="topic-block-title">${b.title}</h2>
      `;
      section.appendChild(header);

      // Contextual slides launcher
      if (b.slides && b.slides.length > 0) {
        const slidesPanel = document.createElement('div');
        slidesPanel.className = 'contextual-slides-panel';
        slidesPanel.innerHTML = `
          <span class="contextual-slides-label">
            <i data-lucide="presentation" class="w-4 h-4"></i>
            <span>السلايدات المرتبطة بهذا الموضوع:</span>
          </span>
          <div class="flex flex-wrap gap-2">
            ${b.slides.map(num => {
              const slideMeta = window.DBLessonMap ? window.DBLessonMap.getSlide(lectureKey, num) : null;
              const title = slideMeta ? slideMeta.title : `Slide #${num}`;
              return `
                <button type="button" class="contextual-slide-pill" data-jump-slide="${num}" data-source-topic="${b.id}" aria-label="عرض تفاصيل الشريحة ${num}: ${title}">
                  <span class="slide-pill-num">#${num}</span>
                  <span class="max-w-[200px] truncate">${title}</span>
                </button>
              `;
            }).join('')}
          </div>
        `;
        section.appendChild(slidesPanel);
      }

      // Extracted sanitized body
      const bodyWrapper = document.createElement('div');
      bodyWrapper.className = 'topic-block-body space-y-4';
      bodyWrapper.id = b.id; // Retain exact original anchor id
      if (b.element) {
        // Clone and append child nodes from extracted element
        Array.from(b.element.children).forEach(child => {
          bodyWrapper.appendChild(child.cloneNode(true));
        });
      } else {
        bodyWrapper.innerHTML = b.html || '';
      }
      section.appendChild(bodyWrapper);
      feed.appendChild(section);
    }

    // Attach click events on contextual slide pills
    feed.querySelectorAll('[data-jump-slide]').forEach(btn => {
      btn.addEventListener('click', () => {
        const num = btn.getAttribute('data-jump-slide');
        const topicId = btn.getAttribute('data-source-topic');
        showSlide(num, topicId);
      });
    });
  }

  async function init() {
    const param = getQueryParam('lecture');
    const lectureKey = window.PortalLessonSource ? window.PortalLessonSource.normalizeKey(param) : (param === '2' || param === '3' ? param : null);

    if (!lectureKey) {
      renderRecovery({
        error: 'UNSUPPORTED_LECTURE',
        lectureKey: param,
        message: 'المحاضرة المطلوبة غير متوفرة في مساحة المذاكرة الموحدة. يرجى اختيار محاضرة صالحة.'
      });
      return;
    }

    const paper = document.getElementById('workspace-paper');
    if (paper) paper.setAttribute('aria-busy', 'true');

    // Get lecture info from DBLessonMap
    if (window.DBLessonMap) {
      currentLectureMeta = window.DBLessonMap.getLectureInfo(lectureKey);
      if (currentLectureMeta) {
        const badgeCode = document.getElementById('lesson-badge-code');
        const badgeText = document.getElementById('lesson-badge-text');
        const titleEl = document.getElementById('lesson-title');
        const scopeEl = document.getElementById('lesson-scope');

        if (badgeCode) badgeCode.textContent = `DB-0${currentLectureMeta.chapterNumber}`;
        if (badgeText) badgeText.textContent = `الفصل ${currentLectureMeta.chapterNumber}`;
        if (titleEl) titleEl.textContent = `${currentLectureMeta.title} • ${currentLectureMeta.arabicTitle}`;
        if (scopeEl) scopeEl.textContent = `من الفصل ${currentLectureMeta.chapterNumber}، ${currentLectureMeta.slidesCount} شريحة و ${currentLectureMeta.blocksCount} موضوعات شرح تفصيلية.`;
        document.title = `${currentLectureMeta.title} | Study Hub`;
      }
    }

    // Load source HTML and slide data
    let sourceResult, allExp;
    try {
      const [src, exp] = await Promise.all([
        window.PortalLessonSource.loadLessonSource(lectureKey),
        window.PortalStudyLoader.load()
      ]);
      sourceResult = src;
      allExp = exp;
    } catch (err) {
      renderRecovery({
        error: 'LOAD_EXCEPTION',
        retryable: true,
        message: 'حدث خطأ أثناء تحميل محتويات المحاضرة: ' + err.message
      });
      return;
    }

    if (!sourceResult || !sourceResult.ok) {
      renderRecovery(sourceResult || { error: 'UNKNOWN_ERROR' });
      return;
    }

    const lecData = allExp ? allExp['database-systems']?.[lectureKey] : null;
    if (!lecData) {
      renderRecovery({
        error: 'SLIDE_DATA_MISSING',
        retryable: true,
        message: 'بيانات شرح الشرائح غير متوفرة لهذه المحاضرة.'
      });
      return;
    }

    currentLectureKey = lectureKey;
    currentBlocks = sourceResult.blocks;
    currentLectureData = lecData;

    // Ensure #practice-hub container exists in #workspace-paper
    let practiceHub = document.getElementById('practice-hub');
    if (!practiceHub && paper) {
      practiceHub = document.createElement('div');
      practiceHub.id = 'practice-hub';
      practiceHub.className = 'practice-hub-container';
      practiceHub.hidden = true;
      paper.appendChild(practiceHub);
    }

    // Ensure #view-btn-practice exists in .workspace-views-tabs
    const viewsTabs = document.querySelector('.workspace-views-tabs');
    let btnPractice = document.getElementById('view-btn-practice');
    if (!btnPractice && viewsTabs) {
      btnPractice = document.createElement('button');
      btnPractice.type = 'button';
      btnPractice.id = 'view-btn-practice';
      btnPractice.className = 'workspace-view-btn';
      btnPractice.setAttribute('aria-pressed', 'false');
      btnPractice.innerHTML = `
        <i data-lucide="award" class="w-4 h-4"></i>
        <span>التدريب والأسئلة</span>
      `;
      viewsTabs.appendChild(btnPractice);
    }
    if (btnPractice) {
      btnPractice.addEventListener('click', () => switchView('practice'));
    }

    if (paper) paper.removeAttribute('aria-busy');

    // Build unified outline
    if (window.DBLessonMap) {
      const outlineItems = window.DBLessonMap.getUnifiedOutline(lectureKey);
      renderOutline(outlineItems, lectureKey);
    }

    // Render topic blocks
    renderTopicBlocks(currentBlocks, lectureKey);

    // Render slides feed
    const slideFeed = document.getElementById('slide-viewer-feed');
    if (slideFeed && window.PortalSlideView) {
      slideFeed.innerHTML = window.PortalSlideView.renderSlideCards(currentLectureData.slides, {
        totalSlides: currentLectureData.totalSlides
      });
      window.PortalSlideView.bindSlideInteractions(slideFeed, {
        onImageZoom: openImageZoom
      });
    }

    // Bind toolbar and view switching
    const btnTopics = document.getElementById('view-btn-topics');
    const btnSlides = document.getElementById('view-btn-slides');
    if (btnTopics) btnTopics.addEventListener('click', () => switchView('topics'));
    if (btnSlides) btnSlides.addEventListener('click', () => {
      switchView('slides');
      showSlide(currentLectureData.slides[0].num);
    });

    // Font zoom controls
    const fontIn = document.getElementById('workspace-font-zoom-in');
    const fontOut = document.getElementById('workspace-font-zoom-out');
    if (fontIn) fontIn.addEventListener('click', () => setFontZoom(currentFontZoom + 1));
    if (fontOut) fontOut.addEventListener('click', () => setFontZoom(currentFontZoom - 1));

    // Slide navigation controls
    const prevBtn = document.querySelector('[data-slide-nav="prev"]');
    const nextBtn = document.querySelector('[data-slide-nav="next"]');
    const returnBtn = document.querySelector('[data-return-to-topic]');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentSlideIndex > 0) {
          showSlide(currentLectureData.slides[currentSlideIndex - 1].num);
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentSlideIndex < currentLectureData.slides.length - 1) {
          showSlide(currentLectureData.slides[currentSlideIndex + 1].num);
        }
      });
    }
    if (returnBtn) {
      returnBtn.addEventListener('click', returnToTopic);
    }

    // Image zoom modal events
    const zoomClose = document.getElementById('slide-zoom-close');
    const zoomModal = document.getElementById('slide-zoom-modal');
    if (zoomClose) zoomClose.addEventListener('click', closeImageZoom);
    if (zoomModal) {
      zoomModal.addEventListener('click', e => {
        if (e.target === zoomModal) closeImageZoom();
      });
    }

    // Handle deep link if slide requested
    const requestedSlide = getQueryParam('slide');
    const requestedView = getQueryParam('view');
    if (requestedSlide) {
      showSlide(requestedSlide);
    } else if (requestedView === 'practice' || (typeof window !== 'undefined' && window.location.hash === '#practice-hub')) {
      switchView('practice');
    } else {
      switchView('topics');
    }

    // Record study activity
    if (window.PortalCatalog && window.PortalStudyState) {
      try {
        const contentKey = window.PortalCatalog.key('database-systems', 'lecture', lectureKey);
        window.PortalStudyState.setLastUsed({ key: contentKey, actionId: 'internal-study' });
      } catch {
        // Safe ignoring if state storage fails
      }
    }

    // Refresh icons
    if (window.PortalUI && typeof window.PortalUI.icons === 'function') {
      window.PortalUI.icons(document.body);
    }
  }

  return {
    init,
    showSlide,
    switchView,
    returnToTopic,
    setFontZoom,
    openImageZoom,
    closeImageZoom
  };
});
