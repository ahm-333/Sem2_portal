/**
 * ==============================================================================
 * منطق صفحة المادة: تقسيم المادة إلى مسارين (طريق المحاضرة وطريق السكشن)
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  if (!window.COURSES_DATA || window.COURSES_DATA.length === 0) {
    console.error("بيانات المواد غير متوفرة!");
    return;
  }

  // 1. استخراج معرف المادة والمسار المختار من الرابط
  const urlParams = new URLSearchParams(window.location.search);
  let courseId = urlParams.get("id");
  let activeTrack = urlParams.get("track") || "lecture"; // إما "lecture" أو "section"

  if (!courseId) {
    courseId = window.COURSES_DATA[0].id;
  }

  const course = window.COURSES_DATA.find((c) => c.id === courseId);

  if (!course) {
    document.getElementById("main-content").innerHTML = `
      <div class="text-center py-20">
        <div class="w-20 h-20 mx-auto rounded-3xl glass-panel flex items-center justify-center text-red-400 mb-6 border">
          <i data-lucide="alert-triangle" class="w-10 h-10"></i>
        </div>
        <h2 class="text-2xl font-bold text-[var(--text-main)] mb-2">عذراً، لم نتمكن من العثور على هذه المادة!</h2>
        <p class="text-sm text-[var(--text-muted)] mb-8">قد يكون الرابط غير صحيح أو تم تحديث اسم المادة.</p>
        <a href="index.html" class="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all">
          العودة لجميع المواد
        </a>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // 2. تحديث عنوان الصفحة
  document.title = `${course.name} (${course.arabicName}) | بوابة الترم الثاني`;

  // 3. ملء القائمة المنسدلة للانتقال السريع
  const quickSelect = document.getElementById("quick-course-select");
  if (quickSelect) {
    quickSelect.innerHTML = window.COURSES_DATA.map(
      (c) => `<option value="${c.id}" ${c.id === course.id ? "selected" : ""}>${c.name} - ${c.code}</option>`
    ).join("");

    quickSelect.addEventListener("change", function () {
      window.location.href = `subject.html?id=${this.value}&track=${activeTrack}`;
    });
  }

  // 4. تعبئة بيانات المادة الثابتة
  document.getElementById("nav-subject-name").textContent = course.name;
  document.getElementById("nav-subject-code").textContent = `${course.code} • ${course.arabicName}`;
  document.getElementById("crumb-subject-name").textContent = course.name;

  document.getElementById("subject-title-en").textContent = course.name;
  document.getElementById("subject-title-ar").textContent = course.arabicName;
  document.getElementById("subject-desc").textContent = course.shortDesc;
  document.getElementById("subject-badge-code").textContent = course.code;
  document.getElementById("subject-category").textContent = course.category;

  const iconMap = {
    cpu: "cpu",
    palette: "palette",
    database: "database",
    network: "network",
    terminal: "terminal",
    "file-text": "file-text"
  };
  const iconName = iconMap[course.icon] || "book";
  const iconBox = document.getElementById("subject-icon-box");
  if (iconBox) {
    iconBox.className = `w-16 h-16 rounded-2xl bg-gradient-to-tr ${course.accentColor} flex items-center justify-center text-white shadow-lg flex-shrink-0 icon-box-modern`;
    iconBox.innerHTML = `<i data-lucide="${iconName}" class="w-8 h-8"></i>`;
  }

  // 5. تعبئة بطاقة موقع الشرح المعتمد (الأساس في طريق المحاضرة)
  document.getElementById("exp-title").textContent = course.explanationSite.title;
  document.getElementById("exp-desc").textContent = course.explanationSite.description;
  document.getElementById("exp-status").textContent = course.explanationSite.status || "متاح الآن";
  
  const expMainBtn = document.getElementById("exp-main-btn");
  expMainBtn.href = course.explanationSite.url;

  const expFeatures = document.getElementById("exp-features");
  if (expFeatures && course.explanationSite.features) {
    expFeatures.innerHTML = course.explanationSite.features.map(
      (feat) => `
        <div class="flex items-center gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-surface)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
          <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 flex-shrink-0"></i>
          <span>${feat}</span>
        </div>
      `
    ).join("");
  }

  // تفعيل المعاينة الحية لموقع الشرح (Iframe Preview)
  const togglePreviewBtn = document.getElementById("toggle-preview-btn");
  const previewContainer = document.getElementById("preview-container");
  const closePreviewBtn = document.getElementById("close-preview-btn");
  const expIframe = document.getElementById("exp-iframe");

  if (togglePreviewBtn && previewContainer && expIframe) {
    togglePreviewBtn.addEventListener("click", function () {
      const isHidden = previewContainer.classList.contains("hidden");
      if (isHidden) {
        expIframe.src = course.explanationSite.url;
        previewContainer.classList.remove("hidden");
        togglePreviewBtn.classList.add("bg-indigo-600", "text-white");
        previewContainer.scrollIntoView({ behavior: "smooth" });
      } else {
        previewContainer.classList.add("hidden");
        expIframe.src = "";
        togglePreviewBtn.classList.remove("bg-indigo-600", "text-white");
      }
    });

    if (closePreviewBtn) {
      closePreviewBtn.addEventListener("click", function () {
        previewContainer.classList.add("hidden");
        expIframe.src = "";
        togglePreviewBtn.classList.remove("bg-indigo-600", "text-white");
      });
    }
  }

  // 5.2 رندر شروحات ومصادر المادة وقوائم التشغيل (Video Explanations & Playlists)
  const videoList = document.getElementById("video-explanations-list");
  const badgeVideosCount = document.getElementById("badge-videos-count");
  const videoModal = document.getElementById("video-modal");
  const videoFrame = document.getElementById("video-modal-frame");
  const videoTitle = document.getElementById("video-modal-title");
  const videoSubtitle = document.getElementById("video-modal-subtitle");
  const videoOpenNew = document.getElementById("video-modal-open-new");
  const videoClose = document.getElementById("video-modal-close");

  function getYouTubeEmbedUrl(url) {
    if (!url) return "";
    if (url.includes("/embed/")) return url;
    if (url.includes("drive.google.com/file/d/")) {
      return url.replace(/\/view(\?.*)?$/, "/preview");
    }
    const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (playlistMatch) {
      return `https://www.youtube.com/embed/videoseries?list=${playlistMatch[1]}&autoplay=1`;
    }
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) {
      return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`;
    }
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`;
    }
    return url;
  }

  function openVideoModal(url, title, subtitle) {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile || !videoModal || !videoFrame) {
      window.open(url, "_blank", "noopener");
      return;
    }
    const embedUrl = getYouTubeEmbedUrl(url);
    videoFrame.src = embedUrl;
    if (videoTitle) videoTitle.textContent = title || "مشاهدة الشرح";
    if (videoSubtitle) videoSubtitle.textContent = subtitle || "معاينة مباشرة";
    if (videoOpenNew) {
      videoOpenNew.href = url;
      const isDrive = url.includes("drive.google.com");
      const span = videoOpenNew.querySelector("span");
      if (span) span.textContent = isDrive ? "فتح في Google Drive" : "فتح في YouTube";
    }
    videoModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    if (window.lucide) window.lucide.createIcons();
  }

  function closeVideoModal() {
    if (!videoModal || !videoFrame) return;
    videoModal.classList.add("hidden");
    videoFrame.src = "";
    document.body.classList.remove("overflow-hidden");
  }

  if (videoClose) {
    videoClose.addEventListener("click", closeVideoModal);
  }
  if (videoModal) {
    videoModal.addEventListener("click", function (e) {
      if (e.target === videoModal) closeVideoModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && videoModal && !videoModal.classList.contains("hidden")) {
      closeVideoModal();
    }
  });

  const videos = course.videoExplanations || [];
  if (badgeVideosCount) {
    badgeVideosCount.textContent = `${videos.length} مصادر شرح`;
  }

  if (videoList) {
    if (videos.length === 0) {
      videoList.innerHTML = createEmptyNotice(
        "شروحات الفيديو وقوائم التشغيل",
        "سيتم إضافة المزيد من الشروحات وقوائم التشغيل الخاصة بالمادة قريباً."
      );
    } else {
      videoList.innerHTML = videos.map((vid) => {
        return `
          <div class="glass-panel p-5 sm:p-6 rounded-3xl border flex flex-col justify-between gap-4 card-hover-effect">
            <div>
              <div class="flex items-center justify-between gap-2 mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold flex items-center gap-1">
                    <i data-lucide="youtube" class="w-3 h-3"></i>
                    <span>${vid.typeArabic || "فيديو شرح"}</span>
                  </span>
                  <span class="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                    ${vid.language || "عربي"}
                  </span>
                </div>
                ${vid.badge ? `<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">${vid.badge}</span>` : ""}
              </div>

              <h4 class="text-sm sm:text-base font-bold text-[var(--text-main)] mb-1 leading-snug">${vid.title}</h4>
              <p class="text-xs text-[var(--text-muted)] leading-relaxed mb-2">${vid.subtitle || ""}</p>
              ${vid.author ? `
                <div class="text-[11px] text-[var(--text-dim)] flex items-center gap-1.5 font-medium mt-1">
                  <i data-lucide="user-check" class="w-3.5 h-3.5 text-red-400"></i>
                  <span>المحاضر / المصدر: <strong>${vid.author}</strong></span>
                </div>
              ` : ""}
            </div>

            <div class="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
              <button 
                type="button" 
                data-play-url="${vid.url}"
                data-play-title="${vid.title}"
                data-play-subtitle="${vid.subtitle || ""}"
                class="btn-play-video flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer btn-smooth"
              >
                <i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i>
                <span>مشاهدة الشرح</span>
              </button>

              <a 
                href="${vid.url}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="p-2.5 rounded-xl glass-panel border text-xs font-bold text-[var(--text-main)] hover:bg-red-600 hover:text-white transition-all flex items-center justify-center btn-smooth"
                title="فتح في تطبيق YouTube"
              >
                <i data-lucide="external-link" class="w-4 h-4"></i>
              </a>

              <button 
                type="button" 
                data-copy-url="${vid.url}"
                class="btn-copy-link p-2.5 rounded-xl glass-panel border text-xs font-medium text-[var(--text-muted)] hover:text-indigo-400 transition-all flex items-center justify-center btn-smooth"
                title="نسخ رابط الشرح"
              >
                <i data-lucide="copy" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `;
      }).join("");

      // إعداد أزرار تشغيل الفيديو
      videoList.querySelectorAll(".btn-play-video").forEach((btn) => {
        btn.addEventListener("click", function () {
          const url = this.getAttribute("data-play-url");
          const title = this.getAttribute("data-play-title");
          const sub = this.getAttribute("data-play-subtitle");
          openVideoModal(url, title, sub);
        });
      });

      // إعداد أزرار نسخ الرابط
      videoList.querySelectorAll(".btn-copy-link").forEach((btn) => {
        btn.addEventListener("click", function () {
          const url = this.getAttribute("data-copy-url");
          navigator.clipboard.writeText(url).then(() => {
            const toast = document.getElementById("toast");
            if (toast) {
              const span = toast.querySelector("span");
              const original = span.textContent;
              span.textContent = "تم نسخ رابط الشرح بنجاح!";
              toast.classList.remove("opacity-0", "pointer-events-none");
              setTimeout(() => {
                toast.classList.add("opacity-0", "pointer-events-none");
                span.textContent = original;
              }, 2500);
            }
          });
        });
      });
    }
  }

  // 6. رندر محتوى طريق المحاضرة (Lectures & Theory Resources)
  const lecturesCount = course.lectures ? course.lectures.length : 0;
  const badgeLecturesCount = document.getElementById("badge-lectures-count");
  if (badgeLecturesCount) badgeLecturesCount.textContent = `${lecturesCount} محاضرات`;

  // ربط زر مجلد Google Drive الكامل للمادة
  const courseDriveFolderBtn = document.getElementById("course-drive-folder-link");
  if (courseDriveFolderBtn) {
    courseDriveFolderBtn.href = course.driveFolderUrl || (window.PORTAL_CONFIG && window.PORTAL_CONFIG.driveMasterFolder) || "https://drive.google.com/drive/folders/11q-xu1rb5IoIE-lL1pMjHXqfut9Tq2hU";
  }

  // إعداد نافذة معاينة الـ PDF والمستندات المضمنة
  const pdfModal = document.getElementById("pdf-modal");
  const pdfFrame = document.getElementById("pdf-modal-frame");
  const pdfTitle = document.getElementById("pdf-modal-title");
  const pdfSubtitle = document.getElementById("pdf-modal-subtitle");
  const pdfOpenNew = document.getElementById("pdf-modal-open-new");
  const pdfDownload = document.getElementById("pdf-modal-download");
  const pdfClose = document.getElementById("pdf-modal-close");

  function openPdfModal(fileUrl, title, subtitle, filename, downloadUrl, viewUrl) {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile || !pdfModal || !pdfFrame) {
      window.open(viewUrl || fileUrl, "_blank", "noopener");
      return;
    }

    let frameUrl = fileUrl;
    if (frameUrl.includes("drive.google.com/file/d/") && !frameUrl.includes("/preview")) {
      frameUrl = frameUrl.replace(/\/view(\?.*)?$/, "/preview");
    }

    pdfFrame.src = frameUrl;
    if (pdfTitle) pdfTitle.textContent = title || "سلايدات المحاضرة";
    if (pdfSubtitle) pdfSubtitle.textContent = subtitle || "معاينة مباشرة";
    if (pdfOpenNew) pdfOpenNew.href = viewUrl || fileUrl;
    if (pdfDownload) {
      pdfDownload.href = downloadUrl || fileUrl;
      pdfDownload.setAttribute("download", filename || "lecture.pdf");
    }
    pdfModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    if (window.lucide) window.lucide.createIcons();
  }

  function closePdfModal() {
    if (!pdfModal || !pdfFrame) return;
    pdfModal.classList.add("hidden");
    pdfFrame.src = "";
    document.body.classList.remove("overflow-hidden");
  }

  if (pdfClose) {
    pdfClose.addEventListener("click", closePdfModal);
  }
  if (pdfModal) {
    pdfModal.addEventListener("click", function (e) {
      if (e.target === pdfModal) {
        closePdfModal();
      }
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (pdfModal && !pdfModal.classList.contains("hidden")) {
        closePdfModal();
      }
      if (studyModal && !studyModal.classList.contains("hidden")) {
        closeSmartStudyModal();
      }
    }
  });

  // ============================================================================
  // المذاكرة والشرح الذكي للمحاضرات (Smart Lecture Study Modal)
  // ============================================================================
  const studyModal = document.getElementById("lecture-study-modal");
  const studyModalContainer = document.getElementById("study-modal-container");
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
  let activeStudyTab = "slides"; // "slides" or "quiz"

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
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function switchStudyTab(tab) {
    activeStudyTab = tab;
    if (tab === "slides") {
      if (studyTabBtnSlides) studyTabBtnSlides.classList.add("active");
      if (studyTabBtnQuiz) studyTabBtnQuiz.classList.remove("active");
      if (studySlidesView) studySlidesView.classList.remove("hidden");
      if (studyFullQuizView) studyFullQuizView.classList.add("hidden");
    } else {
      if (studyTabBtnSlides) studyTabBtnSlides.classList.remove("active");
      if (studyTabBtnQuiz) studyTabBtnQuiz.classList.add("active");
      if (studySlidesView) studySlidesView.classList.add("hidden");
      if (studyFullQuizView) studyFullQuizView.classList.remove("hidden");
    }
    if (window.lucide) window.lucide.createIcons();
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
    studyModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  function renderFullQuiz(data) {
    if (!studyFullQuizView) return;
    const questions = data.fullQuiz || [];
    if (questions.length === 0) {
      studyFullQuizView.innerHTML = `
        <div class="text-center py-16">
          <p class="text-sm text-[var(--text-muted)]">جاري إعداد بنك الأسئلة الشامل للمحاضرة قريباً!</p>
        </div>
      `;
      return;
    }

    let userAnswers = {};
    let score = 0;

    function buildQuizHtml() {
      const answeredCount = Object.keys(userAnswers).length;
      return `
        <div class="max-w-4xl mx-auto space-y-6">
          
          <!-- بطاقة رأس الكويز الشامل وعداد النتيجة -->
          <div class="glass-panel p-5 sm:p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-indigo-500/5 to-cyan-500/5 shadow-xl">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold shadow-lg shadow-amber-500/25 flex-shrink-0 icon-box-modern">
                  <i data-lucide="award" class="w-6 h-6"></i>
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-black text-[var(--text-main)] flex flex-wrap items-center gap-2">
                    <span>اختبار التقييم الشامل للمحاضرة كاملة</span>
                    <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 dark:text-amber-300 font-mono font-bold">${questions.length} سؤال امتحاني</span>
                  </h3>
                  <p class="text-xs text-[var(--text-muted)] mt-1">أسئلة اختيار من متعدد (MCQ) باللغة الإنجليزية من واقع امتحانات وسلايدات د. محمد ماهر مع تفسير فوري بالعامية ومصطلحات المادة</p>
                </div>
              </div>

              <!-- عداد النتيجة الفوري وزر الإعادة -->
              <div class="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                <div class="glass-panel px-4 py-2 rounded-2xl border border-[var(--border-subtle)] text-center bg-[var(--bg-surface)]">
                  <span class="text-[10px] text-[var(--text-dim)] font-bold block">الدرجة الحالية</span>
                  <span id="full-quiz-score-val" class="text-lg font-black text-amber-500 font-mono">${score} / ${questions.length}</span>
                </div>
                <button id="full-quiz-reset-btn" type="button" class="px-3.5 py-2.5 rounded-xl glass-panel border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-muted)] hover:text-rose-500 hover:border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer" title="إعادة الاختبار من البداية">
                  <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                  <span>إعادة</span>
                </button>
              </div>
            </div>

            <!-- شريط الأسئلة السريع للقفز -->
            <div class="mt-5 pt-4 border-t border-[var(--border-subtle)]">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-bold text-[var(--text-muted)]">خريطة الأسئلة (اضغط للقفز لأي سؤال):</span>
                <span class="text-[10px] font-mono font-bold text-[var(--text-dim)]">${answeredCount} من ${questions.length} تم حله</span>
              </div>
              <div class="flex items-center gap-1.5 flex-wrap">
                ${questions.map((q) => {
                  let pillStyle = "glass-panel text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-subtle)]";
                  if (userAnswers[q.id] !== undefined) {
                    pillStyle = userAnswers[q.id] === q.correct 
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40 font-black"
                      : "bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/40 font-black";
                  }
                  return `
                    <button 
                      type="button" 
                      data-jump-q="full-q-${q.id}" 
                      class="q-map-pill w-8 h-8 rounded-xl text-xs font-mono font-bold border transition-all flex items-center justify-center cursor-pointer ${pillStyle}"
                    >
                      ${q.id}
                    </button>
                  `;
                }).join("")}
              </div>
            </div>
          </div>

          <!-- قائمة الأسئلة -->
          <div class="space-y-6">
            ${questions.map((q) => {
              const answered = userAnswers[q.id] !== undefined;
              const userChoice = userAnswers[q.id];
              return `
                <div id="full-q-${q.id}" class="glass-panel p-5 sm:p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-md space-y-4" data-qid="${q.id}">
                  
                  <!-- هيدر السؤال -->
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
                    <div class="flex items-center gap-2.5">
                      <span class="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 font-mono font-bold text-xs flex items-center justify-center border border-indigo-500/20">
                        Q${q.id}
                      </span>
                      <span class="text-xs font-bold text-[var(--text-main)] font-mono">${q.topic}</span>
                    </div>
                    <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 font-mono font-bold self-start sm:self-auto border border-indigo-500/20">
                      Slide #${q.slideNum}
                    </span>
                  </div>

                  <!-- نص السؤال بالإنجليزية -->
                  <div class="p-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-left dir-ltr">
                    <p class="text-xs sm:text-sm font-bold text-[var(--text-main)] font-sans leading-relaxed">${q.question}</p>
                  </div>

                  <!-- خيارات السؤال -->
                  <div class="space-y-2 quiz-full-options">
                    ${q.options.map((opt, optIdx) => {
                      let optClass = "border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-main)] hover:border-indigo-500 cursor-pointer";
                      if (answered) {
                        if (optIdx === q.correct) {
                          optClass = "border-emerald-600 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold cursor-default";
                        } else if (optIdx === userChoice) {
                          optClass = "border-rose-600 bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold cursor-default";
                        } else {
                          optClass = "border-[var(--border-subtle)] opacity-50 cursor-default";
                        }
                      }
                      return `
                        <button 
                          type="button" 
                          class="full-quiz-opt-btn w-full text-left dir-ltr p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between gap-3 ${optClass}"
                          data-qid="${q.id}"
                          data-opt-idx="${optIdx}"
                          ${answered ? "disabled" : ""}
                        >
                          <span class="flex-1 font-sans">${opt}</span>
                          <span class="w-6 h-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center text-[11px] font-mono font-bold flex-shrink-0">
                            ${String.fromCharCode(65 + optIdx)}
                          </span>
                        </button>
                      `;
                    }).join("")}
                  </div>

                  <!-- صندوق التفسير الفوري بالعامية المصرية ومصطلحات المادة -->
                  ${answered ? `
                    <div class="p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed text-right dir-rtl animate-fade-in ${
                      userChoice === q.correct
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200"
                    }">
                      <div class="flex items-start gap-2.5">
                        <span class="text-xl flex-shrink-0">${userChoice === q.correct ? "🎉" : "💡"}</span>
                        <div>
                          <strong class="font-black block mb-1 ${userChoice === q.correct ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}">
                            ${userChoice === q.correct ? "إجابة صحيحة يا بطل!" : "ركز في التريكة دي:"}
                          </strong>
                          <p class="leading-relaxed font-medium">${q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ` : ""}

                </div>
              `;
            }).join("")}
          </div>

          <!-- بطاقة التقييم النهائي للكويز -->
          <div id="full-quiz-summary-card" class="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 text-center space-y-4 bg-gradient-to-b from-indigo-500/5 to-purple-500/10 ${
            answeredCount === questions.length ? "" : "hidden"
          }">
            <div class="w-16 h-16 mx-auto rounded-3xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center text-3xl shadow-inner">
              🏆
            </div>
            <div>
              <h4 class="text-lg font-black text-[var(--text-main)] mb-1">انتهى الاختبار الشامل للمحاضرة!</h4>
              <p class="text-xs text-[var(--text-muted)]">إليك تقرير نتيجتك وتقييم فهمك لمحتوى السلايدات:</p>
            </div>
            <div class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
              <span class="text-xs font-bold text-[var(--text-muted)]">الدرجة النهائية:</span>
              <span class="text-2xl font-black text-indigo-500 font-mono">${score} / ${questions.length}</span>
              <span class="text-xs font-bold text-emerald-500 font-mono">(${Math.round((score / questions.length) * 100)}%)</span>
            </div>
            <p class="text-sm font-bold text-[var(--text-main)] max-w-md mx-auto leading-relaxed">
              ${score >= 17 ? "عاش جداً يا هندسة! إنت كده هضمت المحاضرة بالكامل ومستعد لأي سؤال ميدتيرم أو فاينل 🚀" : "مستوى كويس جداً! راجع الأسئلة اللي غلطت فيها وخلي بالك من التريكات."}
            </p>
          </div>

        </div>
      `;
    }

    function attachFullQuizListeners() {
      studyFullQuizView.querySelectorAll(".full-quiz-opt-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          const qid = parseInt(this.getAttribute("data-qid"), 10);
          const optIdx = parseInt(this.getAttribute("data-opt-idx"), 10);
          const qObj = questions.find(q => q.id === qid);
          if (!qObj || userAnswers[qid] !== undefined) return;

          userAnswers[qid] = optIdx;
          if (optIdx === qObj.correct) {
            score++;
          }

          studyFullQuizView.innerHTML = buildQuizHtml();
          attachFullQuizListeners();

          const targetQEl = document.getElementById(`full-q-${qid}`);
          if (targetQEl) {
            targetQEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          if (window.lucide) window.lucide.createIcons();
        });
      });

      studyFullQuizView.querySelectorAll(".q-map-pill").forEach(pill => {
        pill.addEventListener("click", function () {
          const targetId = this.getAttribute("data-jump-q");
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });

      const resetBtn = document.getElementById("full-quiz-reset-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          userAnswers = {};
          score = 0;
          studyFullQuizView.innerHTML = buildQuizHtml();
          attachFullQuizListeners();
          studyFullQuizView.scrollTop = 0;
          if (window.lucide) window.lucide.createIcons();
        });
      }

      if (window.lucide) window.lucide.createIcons();
    }

    studyFullQuizView.innerHTML = buildQuizHtml();
    attachFullQuizListeners();
  }

  function openSmartStudyModal(courseId, lectureId) {
    if (!studyModal || !studySlidesFeed) return;
    const allExp = window.LECTURE_EXPLANATIONS || (typeof LECTURE_EXPLANATIONS !== "undefined" ? LECTURE_EXPLANATIONS : null);
    const data = allExp && allExp[courseId] && allExp[courseId][lectureId];
    if (!data) {
      alert("عذراً، محتوى الشرح التفاعلي لهذه المحاضرة قيد التجهيز وسيتم إتاحته قريباً!");
      return;
    }

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
          const targetId = this.getAttribute("data-jump-to");
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    }

    // بناء بطاقات التغذية المستمرة للشرائح
    studySlidesFeed.innerHTML = data.slides.map((s) => {
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
                class="quiz-opt-btn w-full text-left dir-ltr p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-main)] hover:border-indigo-500 hover:bg-[var(--bg-card-hover)] transition-all flex items-center justify-between gap-3 group cursor-pointer" 
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

    // بناء وتشغيل الكويز الشامل في تاب منفصل
    renderFullQuiz(data);

    // تتبع التمرير لمؤشر التقدم في تغذية السلايدات
    studySlidesFeed.onscroll = function () {
      const scrollTop = studySlidesFeed.scrollTop;
      const scrollHeight = studySlidesFeed.scrollHeight - studySlidesFeed.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      if (studyProgressBar) {
        studyProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }
    };

    studyModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    studySlidesFeed.scrollTop = 0;
    if (studyProgressBar) studyProgressBar.style.width = "0%";
    if (window.lucide) window.lucide.createIcons();
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

  const lecturesList = document.getElementById("lectures-list");
  if (lecturesList) {
    if (lecturesCount === 0) {
      lecturesList.innerHTML = createEmptyNotice(
        "سجل المحاضرات النظري",
        "المحتوى قيد التجهيز - سيتم إضافة سلايدات المحاضرات وروابط Google Drive فور توفرها."
      );
    } else {
      lecturesList.innerHTML = course.lectures.map((lec) => {
        const previewUrl = lec.drivePreviewUrl || lec.pdfUrl || lec.slidesUrl || "#";
        const viewUrl = lec.driveViewUrl || lec.pdfUrl || lec.slidesUrl || "#";
        const downloadUrl = lec.driveDownloadUrl || lec.pdfUrl || "#";
        const filename = `${course.name}_Lecture_${lec.id}.${lec.fileType || 'pdf'}`;
        
        const allExp = window.LECTURE_EXPLANATIONS || (typeof LECTURE_EXPLANATIONS !== "undefined" ? LECTURE_EXPLANATIONS : null);
        const smartStudyData = allExp && allExp[course.id] && allExp[course.id][lec.id];

        const fileTypeLabel = (lec.fileType || 'pdf').toUpperCase();
        const fileTypeBadgeColor = fileTypeLabel === 'PDF' 
          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
          : 'bg-orange-500/10 text-orange-400 border-orange-500/20';

        const topicsHtml = lec.topics && lec.topics.length > 0 ? `
          <div class="mt-3 pt-3 border-t border-[var(--border-subtle)]">
            <span class="text-[11px] font-bold text-[var(--text-dim)] block mb-1.5 flex items-center gap-1.5">
              <i data-lucide="list-checks" class="w-3.5 h-3.5 text-indigo-400"></i>
              أبرز المحاور والمفاهيم في هذه المحاضرة:
            </span>
            <div class="flex flex-wrap gap-1.5">
              ${lec.topics.map(t => `<span class="text-[11px] px-2.5 py-0.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]">${t}</span>`).join("")}
            </div>
          </div>
        ` : "";

        return `
          <div class="glass-panel p-5 sm:p-6 rounded-3xl border flex flex-col justify-between gap-5 card-hover-effect">
            <div class="flex items-start gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-bold flex flex-col items-center justify-center text-xs flex-shrink-0 shadow-md font-mono icon-box-modern">
                <span>L${lec.id}</span>
                ${lec.chapter ? `<span class="text-[9px] opacity-80">${lec.chapter.replace("Chapter ", "Ch").replace("Lecture ", "Lec ")}</span>` : ""}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1.5">
                  <span class="text-xs font-bold text-indigo-400">${lec.date || `المحاضرة ${lec.id}`}</span>
                  <span class="text-[11px] text-[var(--text-dim)] font-mono">• أسبوع ${lec.week || lec.id}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${fileTypeBadgeColor}">
                    ${fileTypeLabel}
                  </span>
                  ${lec.driveId ? `
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                      <i data-lucide="cloud" class="w-3 h-3"></i>
                      <span>متصل بـ Drive</span>
                    </span>
                  ` : ""}
                  ${lec.doctor ? `
                    <span class="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold flex items-center gap-1">
                      <i data-lucide="graduation-cap" class="w-3 h-3"></i>
                      ${lec.doctor} ${lec.doctorNote ? `(${lec.doctorNote})` : ""}
                    </span>
                  ` : ""}
                  ${lec.pages ? `<span class="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">${lec.pages} صفحة</span>` : ""}
                </div>

                <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h4 class="text-base font-bold text-[var(--text-main)]">${lec.title}</h4>
                  ${smartStudyData ? `
                    <button 
                      type="button" 
                      data-open-study-course="${course.id}" 
                      data-open-study-lecture="${lec.id}" 
                      class="btn-open-smart-study inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-md shadow-purple-500/20 transition-all btn-smooth cursor-pointer"
                    >
                      <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                      <span>✨ الشرح وتفكيك السلايدات (${smartStudyData.totalSlides} شريحة)</span>
                    </button>
                  ` : ""}
                </div>
                <p class="text-xs font-semibold text-[var(--text-muted)] mb-2">${lec.arabicTitle || ""}</p>
                ${lec.notes ? `<p class="text-xs text-[var(--text-dim)] bg-[var(--bg-surface)] p-2.5 rounded-xl border border-[var(--border-subtle)] leading-relaxed">💡 <strong>ملاحظة:</strong> ${lec.notes}</p>` : ""}
                ${topicsHtml}
              </div>
            </div>

            <!-- أزرار المعاينة والتحميل وموقع الشرح -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
              <div class="flex flex-wrap items-center gap-2">
                ${smartStudyData ? `
                  <!-- زر المذاكرة التفاعلية -->
                  <button 
                    type="button"
                    data-open-study-course="${course.id}"
                    data-open-study-lecture="${lec.id}"
                    class="btn-open-smart-study px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shadow-purple-500/25 cursor-pointer btn-smooth"
                    title="تصفح الشريحة وتحتها تفكيكها الكامل وتريكات الامتحان وكويز تدريبي بالإنجليزي"
                  >
                    <i data-lucide="sparkles" class="w-4 h-4 text-purple-200"></i>
                    <span>مذاكرة السلايدات والشرح التفاعلي</span>
                  </button>
                ` : ""}

                <!-- زر المعاينة داخل الصفحة -->
                <button 
                  type="button"
                  data-preview-file="${previewUrl}"
                  data-preview-title="${lec.title}"
                  data-preview-subtitle="${lec.arabicTitle || ""}"
                  data-preview-filename="${filename}"
                  data-preview-download="${downloadUrl}"
                  data-preview-view="${viewUrl}"
                  class="btn-preview-pdf px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer btn-smooth"
                >
                  <i data-lucide="eye" class="w-4 h-4"></i>
                  <span>معاينة السلايدات</span>
                </button>

                <!-- زر فتح في Google Drive -->
                <a 
                  href="${viewUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="px-3.5 py-2 rounded-xl glass-panel border text-xs font-bold text-[var(--text-main)] hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm btn-smooth"
                  title="فتح في Google Drive في نافذة جديدة"
                >
                  <i data-lucide="external-link" class="w-3.5 h-3.5 text-indigo-400"></i>
                  <span>فتح في Drive</span>
                </a>

                <!-- زر تحميل مباشر للملف -->
                <a 
                  href="${downloadUrl}" 
                  download="${filename}"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm btn-smooth"
                  title="تحميل مباشر من Google Drive"
                >
                  <i data-lucide="download" class="w-3.5 h-3.5"></i>
                  <span>تحميل مباشر</span>
                </a>
              </div>

              <!-- رابط موقع الشرح التفاعلي -->
              ${lec.studyManualUrl ? `
                <a 
                  href="${lec.studyManualUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="px-3.5 py-2 rounded-xl glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm btn-smooth"
                >
                  <i data-lucide="sparkles" class="w-3.5 h-3.5 text-cyan-400"></i>
                  <span>موقع الشرح التفاعلي</span>
                </a>
              ` : ""}
            </div>
          </div>
        `;
      }).join("");

      // ربط أزرار المعاينة بالنافذة المنبثقة
      lecturesList.querySelectorAll(".btn-preview-pdf").forEach((btn) => {
        btn.addEventListener("click", function () {
          const file = this.getAttribute("data-preview-file");
          const title = this.getAttribute("data-preview-title");
          const sub = this.getAttribute("data-preview-subtitle");
          const fname = this.getAttribute("data-preview-filename");
          const dUrl = this.getAttribute("data-preview-download");
          const vUrl = this.getAttribute("data-preview-view");
          openPdfModal(file, title, sub, fname, dUrl, vUrl);
        });
      });

      // ربط أزرار المذاكرة الذكية والشرح التفاعلي
      lecturesList.querySelectorAll(".btn-open-smart-study").forEach((btn) => {
        btn.addEventListener("click", function () {
          const cid = this.getAttribute("data-open-study-course");
          const lid = parseInt(this.getAttribute("data-open-study-lecture"), 10);
          openSmartStudyModal(cid, lid);
        });
      });
    }
  }

  // 6. بنك مذكرات وامتحانات النظري (Theory Resources) مع التصفية الذكية حسب معيد السكشن
  const theoryResourcesList = document.getElementById("theory-resources-list");
  let theoryFilterMode = "my-ta"; // "my-ta" or "all"

  function getStudentStaff() {
    if (window.StudentProfile) {
      return window.StudentProfile.getCourseStaff(course.id);
    }
    return {
      group: "B1",
      section: 1,
      doctor: course.doctor || "أستاذ المادة",
      lectureTime: "مواعيد المحاضرة",
      lectureHall: "المدرج",
      ta: course.ta || "معيد السكشن",
      sectionSlot: "مواعيد السكشن",
      sectionRoom: "المعمل"
    };
  }

  function renderTheoryResources() {
    if (!theoryResourcesList) return;
    const staff = getStudentStaff();
    const studentTa = staff.ta;
    const allResources = course.resources || [];

    if (allResources.length === 0) {
      theoryResourcesList.className = "";
      theoryResourcesList.innerHTML = createEmptyNotice(
        "بنك امتحانات وملخصات النظري",
        "المحتوى قيد الإعداد - سيتم رفع نماذج الامتحانات السابقة ومذكرات القوانين فور إرسالها."
      );
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    let filteredResources = allResources;
    if (theoryFilterMode === "my-ta") {
      filteredResources = allResources.filter(r => !r.ta || (window.StudentProfile && window.StudentProfile.isTaMatch(r.ta, studentTa)));
    }

    const hasOtherTaResources = allResources.some(r => r.ta && window.StudentProfile && !window.StudentProfile.isTaMatch(r.ta, studentTa));

    if (filteredResources.length === 0) {
      theoryResourcesList.className = "";
      theoryResourcesList.innerHTML = `
        <div class="glass-panel p-6 sm:p-7 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 text-center my-3 space-y-3">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <i data-lucide="archive" class="w-6 h-6"></i>
          </div>
          <h4 class="text-sm font-bold text-[var(--text-main)]">
            لا توجد مذكرات مرفوعة حالياً لمعيد سكشنك المعتمد (${studentTa})
          </h4>
          <p class="text-xs text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
            ${hasOtherTaResources ? 'تتوفر مذكرات وملخصات مفيدة مرفوعة من معيدي السكاشن الأخرى يمكنك الاطلاع عليها والاستفادة منها.' : 'سيتم إضافة المذكرات ونماذج الامتحانات فور توفرها.'}
          </p>
          ${hasOtherTaResources ? `
            <button type="button" class="btn-toggle-all-theory px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer btn-smooth">
              <i data-lucide="eye" class="w-4 h-4"></i>
              <span>عرض جميع مذكرات المادة لكافة المعيدين</span>
            </button>
          ` : ''}
        </div>
      `;

      const toggleBtn = theoryResourcesList.querySelector(".btn-toggle-all-theory");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
          theoryFilterMode = "all";
          renderTheoryResources();
        });
      }
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    theoryResourcesList.className = "grid grid-cols-1 md:grid-cols-2 gap-4";
    const resourcesCardsHtml = filteredResources.map((res) => `
      <div class="glass-panel p-5 rounded-2xl border flex flex-col justify-between gap-4 card-hover-effect">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs flex-shrink-0 border border-indigo-500/20">
            <i data-lucide="file-check" class="w-5 h-5"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                ${res.type}
              </span>
              <span class="text-[11px] text-[var(--text-dim)] font-mono">${res.year}</span>
              ${res.ta ? `
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  ${res.ta}
                </span>
              ` : ''}
            </div>
            <h4 class="text-xs sm:text-sm font-bold text-[var(--text-main)] mb-1">${res.title}</h4>
            ${res.notes ? `
              <div class="my-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-1.5 leading-relaxed">
                <i data-lucide="message-square" class="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5"></i>
                <span>💡 <strong>ملاحظة:</strong> ${res.notes}</span>
              </div>
            ` : ""}
            <span class="text-[11px] text-[var(--text-dim)] font-mono">${res.size || ""}</span>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <a 
            href="${res.fileUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm btn-smooth"
            title="فتح الملف في Google Drive"
          >
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            <span>فتح المذكرة</span>
          </a>
        </div>
      </div>
    `).join("");

    const switchNoticeHtml = (theoryFilterMode === "all" && hasOtherTaResources) ? `
      <div class="col-span-full p-3 rounded-2xl glass-panel border border-[var(--border-subtle)] flex items-center justify-between gap-3 text-xs">
        <span class="text-[var(--text-muted)] flex items-center gap-1.5">
          <i data-lucide="users" class="w-3.5 h-3.5 text-indigo-400"></i>
          <span>يتم الآن عرض مذكرات جميع المعيدين. يمكنك التبديل لعرض مذكرات معيد سكشنك فقط.</span>
        </span>
        <button type="button" class="btn-toggle-my-theory text-indigo-400 hover:underline font-bold flex items-center gap-1 cursor-pointer">
          <span>مذكرات سكشنك فقط</span>
          <i data-lucide="chevron-left" class="w-3 h-3"></i>
        </button>
      </div>
    ` : (theoryFilterMode === "my-ta" && hasOtherTaResources ? `
      <div class="col-span-full p-3 rounded-2xl glass-panel border border-[var(--border-subtle)] flex items-center justify-between gap-3 text-xs">
        <span class="text-[var(--text-muted)] flex items-center gap-1.5">
          <i data-lucide="filter" class="w-3.5 h-3.5 text-cyan-400"></i>
          <span>معروض مذكرات معيد سكشنك (${studentTa}). يتوفر مذكرات لمعيدين آخرين.</span>
        </span>
        <button type="button" class="btn-toggle-all-theory text-indigo-400 hover:underline font-bold flex items-center gap-1 cursor-pointer">
          <span>عرض جميع المذكرات</span>
          <i data-lucide="chevron-left" class="w-3 h-3"></i>
        </button>
      </div>
    ` : "");

    theoryResourcesList.innerHTML = resourcesCardsHtml + switchNoticeHtml;

    const btnAll = theoryResourcesList.querySelector(".btn-toggle-all-theory");
    if (btnAll) {
      btnAll.addEventListener("click", function () {
        theoryFilterMode = "all";
        renderTheoryResources();
      });
    }

    const btnMy = theoryResourcesList.querySelector(".btn-toggle-my-theory");
    if (btnMy) {
      btnMy.addEventListener("click", function () {
        theoryFilterMode = "my-ta";
        renderTheoryResources();
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // 7. رندر محتوى طريق السكشن (Sections, Assignments, Practical Resources)
  // تصفية ذكية حسب معيد سكشن الطالب لضمان ظهور ملفات معيده المعتمد فقط افتراضياً
  let selectedTa = "my-ta";

  const sectionsDriveContainer = document.getElementById("sections-drive-folders-container");
  const sectionsFilterContainer = document.getElementById("sections-filter-container");
  const sectionsList = document.getElementById("sections-list");
  const assignmentsList = document.getElementById("assignments-list");
  const practicalResourcesList = document.getElementById("practical-resources-list");
  const badgeSectionsCount = document.getElementById("badge-sections-count");
  const badgeAssignmentsCount = document.getElementById("badge-assignments-count");
  const quickBadgeAssignments = document.getElementById("quick-badge-assignments");

  // 7.1 رندر أزرار مجلدات درايف الخاصة بالسكاشن حسب معيد السكشن
  function renderSectionsDriveFolders(filteredCount) {
    if (!sectionsDriveContainer) return;
    const staff = getStudentStaff();
    const studentTa = staff.ta;

    let visibleFolders = [];
    if (course.sectionsDriveFolders && course.sectionsDriveFolders.length > 0) {
      if (selectedTa === "all") {
        visibleFolders = course.sectionsDriveFolders;
      } else if (selectedTa === "my-ta") {
        visibleFolders = course.sectionsDriveFolders.filter(
          (f) => !f.ta || (window.StudentProfile && window.StudentProfile.isTaMatch(f.ta, studentTa))
        );
      } else {
        visibleFolders = course.sectionsDriveFolders.filter(
          (f) => !f.ta || (window.StudentProfile && window.StudentProfile.isTaMatch(f.ta, selectedTa))
        );
      }
    }

    let driveButtonsHtml = "";
    if (visibleFolders.length > 0) {
      driveButtonsHtml = visibleFolders.map(folder => `
        <a 
          href="${folder.url}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r ${folder.color || 'from-cyan-600 to-emerald-600'} hover:opacity-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md btn-smooth"
          title="تصفح ${folder.title} على Google Drive"
        >
          <i data-lucide="folder-symlink" class="w-3.5 h-3.5"></i>
          <span>${folder.title}</span>
        </a>
      `).join("");
    } else if (course.sectionsDriveFolderUrl && (selectedTa === "all" || !course.sectionsDriveFolders || course.sectionsDriveFolders.length === 0)) {
      driveButtonsHtml = `
        <a 
          href="${course.sectionsDriveFolderUrl}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md btn-smooth"
          title="تصفح مجلد السكاشن على Google Drive"
        >
          <i data-lucide="folder-symlink" class="w-3.5 h-3.5"></i>
          <span>${course.sectionsDriveFolderTitle || "مجلد درايف السكاشن"}</span>
        </a>
      `;
    }

    const countNumber = typeof filteredCount === "number" ? filteredCount : (course.sections ? course.sections.length : 0);
    const countLabel = selectedTa === "my-ta" ? `${countNumber} سكاشن (معيد سكشنك)` : `${countNumber} سكاشن`;
    const badgeHtml = `<span class="text-xs px-3 py-1 rounded-full glass-panel border text-cyan-400 font-mono font-bold" id="badge-sections-count">${countLabel}</span>`;
    
    sectionsDriveContainer.innerHTML = badgeHtml + driveButtonsHtml;
    if (window.lucide) window.lucide.createIcons();
  }

  // 7.2 شريط التصفية الذكي بين معيد السكشن وجميع المعيدين
  function renderSectionsFilterBar() {
    if (!sectionsFilterContainer) return;
    const staff = getStudentStaff();
    const studentTa = staff.ta;
    const allSections = course.sections || [];

    if (allSections.length === 0) {
      sectionsFilterContainer.classList.add("hidden");
      return;
    }

    const uniqueTas = [...new Set(allSections.map(s => s.ta).filter(Boolean))];
    const mySectionsCount = allSections.filter(s => window.StudentProfile && window.StudentProfile.isTaMatch(s.ta, studentTa)).length;
    const isMyTaActive = selectedTa === "my-ta";
    const isAllActive = selectedTa === "all";

    const cleanShortName = studentTa.replace(/^(م\.م\.|م\.|د\.)\s*/, "");

    sectionsFilterContainer.classList.remove("hidden");
    sectionsFilterContainer.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-panel border bg-[var(--bg-surface)]">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-bold text-[var(--text-dim)] px-1.5 flex items-center gap-1.5">
            <i data-lucide="filter" class="w-3.5 h-3.5 text-cyan-400"></i>
            <span>تصفية السكاشن:</span>
          </span>

          <!-- زر معيد السكشن الحالي للطالب -->
          <button 
            type="button" 
            data-ta-filter="my-ta" 
            class="ta-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer btn-smooth ${
              isMyTaActive 
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md' 
                : 'glass-panel border text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-cyan-500/30'
            }"
            title="عرض ملفات معيد سكشنك فقط (${studentTa})"
          >
            <i data-lucide="user-check" class="w-3.5 h-3.5 ${isMyTaActive ? 'text-white' : 'text-cyan-400'}"></i>
            <span>معيد سكشنك: ${cleanShortName}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
              isMyTaActive ? 'bg-white/20 text-white' : 'bg-cyan-500/10 text-cyan-400'
            }">
              ${mySectionsCount > 0 ? mySectionsCount : 'غير متوفر'}
            </span>
          </button>

          <!-- زر جميع المعيدين -->
          <button 
            type="button" 
            data-ta-filter="all" 
            class="ta-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer btn-smooth ${
              isAllActive 
                ? 'bg-cyan-600 text-white shadow-md' 
                : 'glass-panel border text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-cyan-500/30'
            }"
            title="عرض جميع السكاشن والملفات المرفوعة لكافة المعيدين"
          >
            <i data-lucide="users" class="w-3.5 h-3.5 ${isAllActive ? 'text-white' : 'text-[var(--text-dim)]'}"></i>
            <span>جميع المعيدين (${allSections.length})</span>
          </button>

          <!-- أزرار المعيدين الفردية إذا توفر أكثر من معيد -->
          ${uniqueTas.length > 1 ? uniqueTas.map(ta => {
            const count = allSections.filter(s => s.ta === ta).length;
            const isSelected = selectedTa === ta;
            const isStudentThisTa = window.StudentProfile && window.StudentProfile.isTaMatch(ta, studentTa);
            return `
              <button 
                type="button" 
                data-ta-filter="${ta}" 
                class="ta-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer btn-smooth ${
                  isSelected 
                    ? 'bg-cyan-600 text-white shadow-md' 
                    : 'glass-panel border text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-cyan-500/30'
                }"
              >
                <span>${ta}</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-500/10 text-[var(--text-dim)]'
                }">${count}</span>
                ${isStudentThisTa ? '<span class="w-2 h-2 rounded-full bg-emerald-400" title="معيد سكشنك الحالي"></span>' : ''}
              </button>
            `;
          }).join("") : ""}
        </div>

        <button data-open-profile-modal class="text-xs text-cyan-400 hover:underline font-bold flex items-center gap-1 cursor-pointer">
          <i data-lucide="settings-2" class="w-3.5 h-3.5"></i>
          <span>تغيير السكشن (${staff.section})</span>
        </button>
      </div>
    `;

    sectionsFilterContainer.querySelectorAll(".ta-filter-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        selectedTa = this.getAttribute("data-ta-filter");
        renderAllSectionTrack();
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // 7.3 رندر قائمة سكاشن العملي
  function renderSectionsList() {
    if (!sectionsList) return;
    const staff = getStudentStaff();
    const studentTa = staff.ta;
    const allSections = course.sections || [];

    if (allSections.length === 0) {
      sectionsList.innerHTML = createEmptyNotice(
        "شيتات وسكاشن العملي",
        "المحتوى قيد التجهيز - سيتم رفع شيتات المعيدين وأكواد البرمجة فور إرسال محتوى المادة."
      );
      renderSectionsDriveFolders(0);
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    let filteredSections = [];
    if (selectedTa === "all") {
      filteredSections = allSections;
    } else if (selectedTa === "my-ta") {
      filteredSections = allSections.filter(s => window.StudentProfile && window.StudentProfile.isTaMatch(s.ta, studentTa));
    } else {
      filteredSections = allSections.filter(s => window.StudentProfile && window.StudentProfile.isTaMatch(s.ta, selectedTa));
    }

    renderSectionsDriveFolders(filteredSections.length);

    if (filteredSections.length === 0) {
      if (selectedTa === "my-ta") {
        sectionsList.innerHTML = `
          <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 text-center my-4 space-y-4">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <i data-lucide="info" class="w-7 h-7"></i>
            </div>
            <div class="max-w-lg mx-auto">
              <h4 class="text-base font-bold text-[var(--text-main)] mb-1.5">
                معيد سكشنك المعتمد (${studentTa}) لم يقم برفع ملفات أو شيتات خاصة به بعد
              </h4>
              <p class="text-xs text-[var(--text-muted)] leading-relaxed">
                حسب جدول الكلية، سكشن ${staff.section} مسند إلى (${studentTa}). لضمان عدم تأخرك وتسهيل المذاكرة، يمكنك استعراض الملفات والشيتات المرفوعة من معيدي السكاشن الأخرى.
              </p>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button type="button" class="btn-switch-all-tas px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer btn-smooth">
                <i data-lucide="eye" class="w-4 h-4"></i>
                <span>استعراض ملفات معيدي السكاشن الأخرى (${allSections.length} ملفات)</span>
              </button>
              <button type="button" data-open-profile-modal class="px-4 py-2.5 rounded-xl glass-panel border text-xs font-bold text-[var(--text-muted)] hover:text-cyan-400 transition-all flex items-center gap-1.5 cursor-pointer btn-smooth">
                <i data-lucide="settings-2" class="w-4 h-4"></i>
                <span>تعديل السكشن المختار</span>
              </button>
            </div>
          </div>
        `;

        const switchBtn = sectionsList.querySelector(".btn-switch-all-tas");
        if (switchBtn) {
          switchBtn.addEventListener("click", function() {
            selectedTa = "all";
            renderAllSectionTrack();
          });
        }
      } else {
        sectionsList.innerHTML = createEmptyNotice(
          "شيتات وسكاشن العملي",
          "لا توجد ملفات متوفرة تحت هذا المعيد حالياً."
        );
      }
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    sectionsList.innerHTML = filteredSections.map((sec) => {
      const previewUrl = sec.drivePreviewUrl || sec.sheetUrl || "#";
      const viewUrl = sec.driveViewUrl || sec.sheetUrl || "#";
      const downloadUrl = sec.driveDownloadUrl || sec.sheetUrl || "#";
      const filename = `${course.name}_Section_${sec.id}.${sec.fileType || 'pptx'}`;
      const fileTypeLabel = (sec.fileType || 'pptx').toUpperCase();
      const fileTypeBadgeColor = fileTypeLabel === 'PDF' 
        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
        : 'bg-orange-500/10 text-orange-400 border-orange-500/20';

      const tagText = sec.tag || `S${sec.id}`;
      const subTagText = sec.subTag || `Sec ${sec.id}`;
      const isAhmed = sec.ta && (sec.ta.includes("أحمد") || sec.ta.includes("حسام"));
      const isToqa = sec.ta && sec.ta.includes("تقى");
      const taBadgeClass = isAhmed
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : isToqa
          ? "bg-teal-500/10 text-teal-300 border-teal-500/20"
          : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      const iconGradient = isAhmed
        ? "from-amber-600 to-orange-500"
        : isToqa
          ? "from-teal-600 to-emerald-500"
          : "from-cyan-600 to-teal-500";
      const taRoleLabel = (sec.ta && (sec.ta.includes("أحمد") || sec.ta.includes("محمد") || sec.ta.includes("م.م."))) ? "المعيد" : "المعيدة";

      const isMyTaSec = window.StudentProfile && window.StudentProfile.isTaMatch(sec.ta, studentTa);

      const topicsHtml = sec.topics && sec.topics.length > 0 ? `
        <div class="mt-3 pt-3 border-t border-[var(--border-subtle)]">
          <span class="text-[11px] font-bold text-[var(--text-dim)] block mb-1.5 flex items-center gap-1.5">
            <i data-lucide="list-checks" class="w-3.5 h-3.5 text-cyan-400"></i>
            المواضيع والتطبيقات المغطاة في هذا السكشن:
          </span>
          <div class="flex flex-wrap gap-1.5">
            ${sec.topics.map(t => `<span class="text-[11px] px-2.5 py-0.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]">${t}</span>`).join("")}
          </div>
        </div>
      ` : "";

      return `
        <div class="glass-panel p-5 sm:p-6 rounded-3xl border flex flex-col justify-between gap-5 card-hover-effect">
          <div class="flex items-start gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${iconGradient} text-white font-bold flex flex-col items-center justify-center text-xs flex-shrink-0 shadow-md font-mono icon-box-modern">
              <span>${tagText}</span>
              <span class="text-[9px] opacity-80">${subTagText}</span>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-1.5">
                <span class="text-xs font-bold text-cyan-400">${sec.date || `السكشن ${sec.id}`}</span>
                <span class="text-[11px] text-[var(--text-dim)] font-mono">• أسبوع ${sec.week || sec.id}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${fileTypeBadgeColor}">
                  ${fileTypeLabel}
                </span>
                ${sec.pages ? `<span class="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">${sec.pages} صفحة</span>` : ""}
                ${sec.driveId ? `
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                    <i data-lucide="cloud" class="w-3 h-3"></i>
                    <span>متصل بـ Drive</span>
                  </span>
                ` : ""}
                ${sec.ta ? `
                  <span class="text-[11px] px-2.5 py-0.5 rounded-full ${taBadgeClass} border font-bold flex items-center gap-1">
                    <i data-lucide="user-check" class="w-3 h-3"></i>
                    <span>${taRoleLabel}: ${sec.ta}</span>
                    ${isMyTaSec ? '<span class="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">معيد سكشنك</span>' : ''}
                  </span>
                ` : ""}
                ${sec.videoUrl ? `
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold flex items-center gap-1 animate-pulse">
                    <i data-lucide="video" class="w-3 h-3"></i>
                    <span>فيديو شرح مسجل</span>
                  </span>
                ` : ""}
                ${sec.size ? `<span class="text-[11px] px-2 py-0.5 rounded-full bg-gray-500/10 text-[var(--text-muted)] border border-gray-500/20 font-mono">${sec.size}</span>` : ""}
              </div>

              <h4 class="text-base font-bold text-[var(--text-main)] mb-1">${sec.title}</h4>
              <p class="text-xs font-semibold text-[var(--text-muted)] mb-2">${sec.arabicTitle || ""}</p>
              ${sec.notes ? `
                <div class="mt-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 leading-relaxed">
                  <i data-lucide="message-square" class="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5"></i>
                  <div class="text-xs">
                    <span class="font-bold text-amber-400 block mb-0.5">توجيه وملاحظة ${taRoleLabel} (${sec.ta || ''}):</span>
                    <span class="text-[var(--text-main)] font-semibold">${sec.notes}</span>
                  </div>
                </div>
              ` : ""}
              ${topicsHtml}
            </div>
          </div>

          <!-- أزرار المعاينة وفيديو الشرح والتحميل -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <div class="flex flex-wrap items-center gap-2">
              <button 
                type="button"
                data-preview-file="${previewUrl}"
                data-preview-title="${sec.title}"
                data-preview-subtitle="${sec.arabicTitle || ""}"
                data-preview-filename="${filename}"
                data-preview-download="${downloadUrl}"
                data-preview-view="${viewUrl}"
                class="btn-preview-pdf px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer btn-smooth"
              >
                <i data-lucide="eye" class="w-4 h-4"></i>
                <span>معاينة السلايدات</span>
              </button>

              ${sec.videoUrl ? `
                <button 
                  type="button"
                  data-play-url="${sec.videoUrl}"
                  data-play-title="${sec.videoTitle || `شرح ${sec.title}`}"
                  data-play-subtitle="${sec.videoSubtitle || (sec.ta ? `تقديم المعيدة: ${sec.ta}` : '')}"
                  class="btn-play-video px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer btn-smooth"
                >
                  <i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i>
                  <span>مشاهدة فيديو الشرح</span>
                </button>
              ` : ""}

              <a 
                href="${viewUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="px-3.5 py-2 rounded-xl glass-panel border text-xs font-bold text-[var(--text-main)] hover:bg-cyan-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm btn-smooth"
                title="فتح الملف في Google Drive"
              >
                <i data-lucide="external-link" class="w-3.5 h-3.5 text-cyan-400"></i>
                <span>فتح في Drive</span>
              </a>

              <a 
                href="${downloadUrl}" 
                download="${filename}"
                target="_blank" 
                rel="noopener noreferrer" 
                class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm btn-smooth"
                title="تحميل مباشر من Google Drive"
              >
                <i data-lucide="download" class="w-3.5 h-3.5"></i>
                <span>تحميل مباشر</span>
              </a>

              ${sec.codeUrl ? `
                <a 
                  href="${sec.codeUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="px-3.5 py-2 rounded-xl glass-panel border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm btn-smooth"
                >
                  <i data-lucide="code" class="w-3.5 h-3.5"></i>
                  <span>الكود البرمجي</span>
                </a>
              ` : ""}

              ${sec.hasTask ? `
                <a 
                  href="#assignments-section-panel" 
                  class="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm btn-smooth"
                  title="الانتقال إلى قسم التكليفات والتاسكات"
                >
                  <i data-lucide="clipboard-check" class="w-4 h-4 text-amber-400"></i>
                  <span>شيت التاسك المطلوب</span>
                </a>
              ` : ""}
            </div>
          </div>
        </div>
      `;
    }).join("");

    sectionsList.querySelectorAll(".btn-preview-pdf").forEach((btn) => {
      btn.addEventListener("click", function () {
        const file = this.getAttribute("data-preview-file");
        const title = this.getAttribute("data-preview-title");
        const sub = this.getAttribute("data-preview-subtitle");
        const fname = this.getAttribute("data-preview-filename");
        const dUrl = this.getAttribute("data-preview-download");
        const vUrl = this.getAttribute("data-preview-view");
        openPdfModal(file, title, sub, fname, dUrl, vUrl);
      });
    });

    sectionsList.querySelectorAll(".btn-play-video").forEach((btn) => {
      btn.addEventListener("click", function () {
        const url = this.getAttribute("data-play-url");
        const title = this.getAttribute("data-play-title");
        const sub = this.getAttribute("data-play-subtitle");
        openVideoModal(url, title, sub);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // 7.4 رندر التكليفات والمشاريع المطلوبة
  function renderAssignmentsList() {
    if (!assignmentsList) return;
    const staff = getStudentStaff();
    const studentTa = staff.ta;
    const allAssignments = course.assignments || [];

    if (allAssignments.length === 0) {
      assignmentsList.innerHTML = createEmptyNotice(
        "التكليفات والمشاريع العملية",
        "لا توجد تكليفات مطلوبة حالياً - سيتم إدراج المهام ومواعيد التسليم فور الإعلان عنها من المعيد أو الدكتور."
      );
      if (badgeAssignmentsCount) badgeAssignmentsCount.textContent = "0 تكليفات";
      if (quickBadgeAssignments) quickBadgeAssignments.textContent = "0";
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    let filteredAssignments = [];
    if (selectedTa === "all") {
      filteredAssignments = allAssignments;
    } else if (selectedTa === "my-ta") {
      filteredAssignments = allAssignments.filter(a => !a.ta || (window.StudentProfile && window.StudentProfile.isTaMatch(a.ta, studentTa)));
    } else {
      filteredAssignments = allAssignments.filter(a => !a.ta || (window.StudentProfile && window.StudentProfile.isTaMatch(a.ta, selectedTa)));
    }

    if (badgeAssignmentsCount) {
      badgeAssignmentsCount.textContent = `${filteredAssignments.length} تكليفات`;
    }
    if (quickBadgeAssignments) {
      quickBadgeAssignments.textContent = filteredAssignments.length;
    }

    if (filteredAssignments.length === 0) {
      assignmentsList.innerHTML = `
        <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 bg-amber-500/5 text-center my-4 space-y-3">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <i data-lucide="clipboard-check" class="w-6 h-6"></i>
          </div>
          <h4 class="text-sm sm:text-base font-bold text-[var(--text-main)]">
            لا توجد تكليفات مطلوبة حالياً لسكشن ${staff.section} (${studentTa})
          </h4>
          <p class="text-xs text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
            معيد سكشنك المعتمد لم يقم برفع تكليف خاص بعد. يتوفر تكليف متاح من معيدي السكاشن الأخرى يمكنك الاطلاع عليه والتمرن منه.
          </p>
          <button type="button" class="btn-switch-assignments-all px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer btn-smooth">
            <i data-lucide="eye" class="w-4 h-4"></i>
            <span>عرض تكليفات السكاشن الأخرى للتمرن</span>
          </button>
        </div>
      `;

      const btn = assignmentsList.querySelector(".btn-switch-assignments-all");
      if (btn) {
        btn.addEventListener("click", function() {
          selectedTa = "all";
          renderAllSectionTrack();
        });
      }
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    assignmentsList.innerHTML = filteredAssignments.map((task) => {
      const statusColors = {
        "متاح": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        "قريباً": "bg-amber-500/10 text-amber-400 border-amber-500/20",
        "منتهي": "bg-red-500/10 text-red-400 border-red-500/20"
      };
      const colorClass = statusColors[task.status] || statusColors["قريباً"];

      const previewUrl = task.localFile || task.drivePreviewUrl || task.fileUrl || "#";
      const viewUrl = task.driveViewUrl || task.fileUrl || "#";
      const downloadUrl = task.driveDownloadUrl || task.localFile || task.fileUrl || "#";
      const filename = `${course.name}_Task_${task.number || task.id}.${task.fileType || 'pdf'}`;
      const fileTypeLabel = (task.fileType || 'pdf').toUpperCase();

      const isMyTask = !task.ta || (window.StudentProfile && window.StudentProfile.isTaMatch(task.ta, studentTa));

      const levelsHtml = task.levels && task.levels.length > 0 ? `
        <div class="mt-4 pt-3 border-t border-[var(--border-subtle)]">
          <span class="text-xs font-bold text-[var(--text-dim)] block mb-2.5 flex items-center gap-1.5">
            <i data-lucide="layers" class="w-3.5 h-3.5 text-amber-400"></i>
            أقسام ومستويات مسائل التكليف (${task.levels.length} مستويات • 20 مسألة عملية متدرجة):
          </span>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            ${task.levels.map(lvl => `
              <div class="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs font-bold text-amber-400">${lvl.arabicLevel || lvl.level}</span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">${lvl.tasks ? lvl.tasks.length : 5} مسائل</span>
                </div>
                <ul class="text-[11px] text-[var(--text-muted)] space-y-1">
                  ${lvl.tasks ? lvl.tasks.map(t => `<li class="flex items-start gap-1.5"><span class="text-amber-400 font-bold">•</span><span>${t}</span></li>`).join("") : ""}
                </ul>
              </div>
            `).join("")}
          </div>
        </div>
      ` : "";

      const rulesHtml = task.rules ? `
        <div class="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 leading-relaxed">
          <i data-lucide="info" class="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5"></i>
          <div class="text-xs">
            <span class="font-bold text-amber-400 block mb-0.5">تعليمات وقواعد الحل (${task.ta || 'المعيد'}):</span>
            <span class="text-[var(--text-main)] font-semibold">${task.rules}</span>
          </div>
        </div>
      ` : "";

      return `
        <div class="glass-panel p-5 sm:p-6 rounded-3xl border flex flex-col justify-between gap-5 card-hover-effect">
          <div class="flex items-start gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-bold flex flex-col items-center justify-center text-xs flex-shrink-0 shadow-md font-mono icon-box-modern">
              <span>Task</span>
              <span class="text-[9px] opacity-80">${task.number || task.id}</span>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-1.5">
                <span class="text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${colorClass}">
                  ${task.status}
                </span>
                <span class="text-xs text-[var(--text-dim)] flex items-center gap-1 font-mono">
                  <i data-lucide="clock" class="w-3 h-3"></i>
                  الموعد النهائي: ${task.deadline}
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border bg-red-500/10 text-red-400 border-red-500/20">
                  ${fileTypeLabel}
                </span>
                ${task.pages ? `<span class="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">${task.pages} صفحات</span>` : ""}
                ${task.driveId ? `
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                    <i data-lucide="cloud" class="w-3 h-3"></i>
                    <span>متصل بـ Drive</span>
                  </span>
                ` : ""}
                ${task.ta ? `
                  <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold flex items-center gap-1">
                    <i data-lucide="user-check" class="w-3 h-3"></i>
                    <span>المعيد: ${task.ta}</span>
                    ${isMyTask ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">معيد سكشنك</span>' : '<span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">للتمرن</span>'}
                  </span>
                ` : ""}
                ${task.size ? `<span class="text-[11px] px-2 py-0.5 rounded-full bg-gray-500/10 text-[var(--text-muted)] border border-gray-500/20 font-mono">${task.size}</span>` : ""}
              </div>

              <h4 class="text-base font-bold text-[var(--text-main)] mb-1">${task.title}</h4>
              <p class="text-xs font-semibold text-amber-400 mb-2">${task.arabicTitle || ""}</p>
              <p class="text-xs text-[var(--text-dim)] leading-relaxed">${task.details || ""}</p>

              ${rulesHtml}
              ${levelsHtml}
            </div>
          </div>

          <!-- أزرار المعاينة والتحميل ومجلد درايف -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <div class="flex flex-wrap items-center gap-2">
              <button 
                type="button"
                data-preview-file="${previewUrl}"
                data-preview-title="${task.title}"
                data-preview-subtitle="${task.arabicTitle || ""}"
                data-preview-filename="${filename}"
                data-preview-download="${downloadUrl}"
                data-preview-view="${viewUrl}"
                class="btn-preview-pdf px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer btn-smooth"
              >
                <i data-lucide="eye" class="w-4 h-4"></i>
                <span>معاينة شيت التكليف</span>
              </button>

              <a 
                href="${viewUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="px-3.5 py-2 rounded-xl glass-panel border text-xs font-bold text-[var(--text-main)] hover:bg-amber-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm btn-smooth"
                title="فتح التكليف في Google Drive"
              >
                <i data-lucide="external-link" class="w-3.5 h-3.5 text-amber-400"></i>
                <span>فتح في Google Drive</span>
              </a>
            </div>

            <a 
              href="${downloadUrl}" 
              download="${filename}"
              target="_blank" 
              rel="noopener noreferrer" 
              class="px-3.5 py-2 rounded-xl glass-panel border text-xs font-bold text-[var(--text-main)] hover:bg-amber-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm btn-smooth"
              title="تحميل ملف التكليف"
            >
              <i data-lucide="download" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>تحميل PDF</span>
            </a>
          </div>
        </div>
      `;
    }).join("");

    assignmentsList.querySelectorAll(".btn-preview-pdf").forEach((btn) => {
      btn.addEventListener("click", function () {
        const file = this.getAttribute("data-preview-file");
        const title = this.getAttribute("data-preview-title");
        const sub = this.getAttribute("data-preview-subtitle");
        const fname = this.getAttribute("data-preview-filename");
        const dUrl = this.getAttribute("data-preview-download");
        const vUrl = this.getAttribute("data-preview-view");
        openPdfModal(file, title, sub, fname, dUrl, vUrl);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // 7.5 رندر المصادر العملية ونماذج الكويزات
  function renderPracticalResourcesList() {
    if (!practicalResourcesList) return;
    const staff = getStudentStaff();
    const studentTa = staff.ta;
    const allPractical = course.practicalResources || [];

    if (allPractical.length === 0) {
      practicalResourcesList.className = "";
      practicalResourcesList.innerHTML = createEmptyNotice(
        "نماذج اختبارات العملي وأسئلة اللاب",
        "المحتوى قيد التجهيز - سيتم إضافة نماذج امتحانات العملي السابقة وأكواد التجارب قريباً."
      );
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    let filteredPractical = allPractical;
    if (selectedTa === "my-ta") {
      filteredPractical = allPractical.filter(r => !r.ta || (window.StudentProfile && window.StudentProfile.isTaMatch(r.ta, studentTa)));
    } else if (selectedTa !== "all") {
      filteredPractical = allPractical.filter(r => !r.ta || (window.StudentProfile && window.StudentProfile.isTaMatch(r.ta, selectedTa)));
    }

    const hasOtherPractical = allPractical.some(r => r.ta && window.StudentProfile && !window.StudentProfile.isTaMatch(r.ta, studentTa));

    if (filteredPractical.length === 0) {
      practicalResourcesList.className = "";
      practicalResourcesList.innerHTML = `
        <div class="glass-panel p-6 rounded-3xl border text-center my-4">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
            <i data-lucide="cpu" class="w-6 h-6"></i>
          </div>
          <h4 class="text-sm font-bold text-[var(--text-main)] mb-1">لا توجد مصادر عملي خاصة بمعيد سكشنك حالياً</h4>
          <p class="text-xs text-[var(--text-muted)] mb-3">يتوفر مصادر وتدريبات مرفوعة لمعيدي سكاشن أخرى يمكنك الاستفادة منها.</p>
          <button type="button" class="btn-toggle-all-practical px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-sm">
            عرض كافة المصادر العملية
          </button>
        </div>
      `;

      const btn = practicalResourcesList.querySelector(".btn-toggle-all-practical");
      if (btn) {
        btn.addEventListener("click", () => {
          selectedTa = "all";
          renderAllSectionTrack();
        });
      }
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    practicalResourcesList.className = "grid grid-cols-1 md:grid-cols-2 gap-4";
    practicalResourcesList.innerHTML = filteredPractical.map((res) => `
      <div class="glass-panel p-5 rounded-2xl border flex items-center justify-between gap-4 card-hover-effect">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs flex-shrink-0 border border-cyan-500/20 icon-box-modern">
            <i data-lucide="cpu" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                ${res.type || "أداة عملي"}
              </span>
              ${res.ta ? `<span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold font-mono">${res.ta}</span>` : ""}
              ${res.badge ? `<span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">${res.badge}</span>` : ""}
            </div>
            <h4 class="text-xs sm:text-sm font-bold text-[var(--text-main)] mb-1">${res.title}</h4>
            <p class="text-xs text-[var(--text-muted)] line-clamp-2">${res.notes || ""}</p>
            ${res.licenseKey ? `<span class="text-[10px] text-amber-400 block mt-1 font-mono font-bold">🔑 ${res.licenseKey}</span>` : ""}
          </div>
        </div>

        <div class="flex items-center gap-1.5 flex-shrink-0">
          ${res.folderUrl ? `
            <a 
              href="${res.folderUrl}" 
              target="_blank" 
              class="p-2.5 rounded-xl glass-panel border text-xs font-bold flex items-center justify-center hover:bg-cyan-600 hover:text-white transition-all btn-smooth"
              title="فتح مجلد الأداة في Google Drive"
            >
              <i data-lucide="folder" class="w-4 h-4 text-cyan-400"></i>
            </a>
          ` : ""}
          <a 
            href="${res.fileUrl}" 
            target="_blank" 
            class="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm btn-smooth"
            title="تحميل مباشر"
          >
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span>تحميل</span>
          </a>
        </div>
      </div>
    `).join("");

    if (window.lucide) window.lucide.createIcons();
  }

  // دالة مجمعة لتحديث كافة أجزاء مسار السكشن معاً
  function renderAllSectionTrack() {
    renderSectionsFilterBar();
    renderSectionsList();
    renderAssignmentsList();
    renderPracticalResourcesList();
  }

  // الاستدعاء المبدئي لرندر النظري والعملي
  renderTheoryResources();
  renderAllSectionTrack();

  // 8. تحديث معلومات الدكتور والمعيد والجدول بناءً على بروفايل الطالب
  function updateStaffAndScheduleInfo() {
    const staff = window.StudentProfile ? window.StudentProfile.getCourseStaff(course.id) : {
      group: "B1",
      section: 1,
      doctor: course.doctor,
      lectureTime: "مواعيد المحاضرة",
      lectureHall: "المدرج",
      ta: course.ta,
      sectionSlot: "مواعيد السكشن",
      sectionRoom: "المعمل"
    };

    // تحديث أعلى الصفحة
    const docEl = document.getElementById("subject-doctor");
    if (docEl) docEl.textContent = `${staff.doctor} (${staff.lectureHall})`;

    const taEl = document.getElementById("subject-ta");
    if (taEl) taEl.textContent = `${staff.ta} (${staff.sectionRoom})`;

    // تحديث بانر موعد المحاضرة
    const lectureDesc = document.getElementById("lecture-slot-desc");
    if (lectureDesc) {
      lectureDesc.innerHTML = `يوم <strong>${staff.lectureTime}</strong> في قاعة <strong class="text-indigo-400 font-mono">${staff.lectureHall}</strong> مع أستاذ المادة <strong>${staff.doctor}</strong>.`;
    }

    // تحديث بانر موعد السكشن
    const sectionDesc = document.getElementById("section-slot-desc");
    if (sectionDesc) {
      sectionDesc.innerHTML = `يوم <strong>${staff.sectionSlot}</strong> في معمل <strong class="text-cyan-400 font-mono">${staff.sectionRoom}</strong> مع معيد السكشن <strong>${staff.ta}</strong>.`;
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // 9. منطق التبديل بين المسارين (طريق المحاضرة | طريق السكشن)
  const trackButtons = document.querySelectorAll(".track-btn");
  const lecturePanel = document.getElementById("track-panel-lecture");
  const sectionPanel = document.getElementById("track-panel-section");

  function switchTrack(trackKey) {
    activeTrack = trackKey;

    trackButtons.forEach((btn) => {
      const isTarget = btn.getAttribute("data-track") === trackKey;
      if (trackKey === "lecture") {
        if (isTarget) {
          btn.className = "track-btn active-track-lecture p-4 sm:p-5 rounded-2xl border text-right flex items-center gap-4 transition-all";
        } else {
          btn.className = "track-btn p-4 sm:p-5 rounded-2xl border text-right flex items-center gap-4 transition-all border-[var(--border-subtle)] hover:border-cyan-500/40 text-[var(--text-muted)]";
        }
      } else {
        if (isTarget) {
          btn.className = "track-btn active-track-section p-4 sm:p-5 rounded-2xl border text-right flex items-center gap-4 transition-all";
        } else {
          btn.className = "track-btn p-4 sm:p-5 rounded-2xl border text-right flex items-center gap-4 transition-all border-[var(--border-subtle)] hover:border-indigo-500/40 text-[var(--text-muted)]";
        }
      }
    });

    if (trackKey === "lecture") {
      lecturePanel.classList.remove("hidden");
      sectionPanel.classList.add("hidden");
    } else {
      lecturePanel.classList.add("hidden");
      sectionPanel.classList.remove("hidden");
    }

    // تحديث الـ URL
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("track", trackKey);
    window.history.replaceState({}, "", newUrl);

    if (window.lucide) window.lucide.createIcons();
  }

  trackButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const trackKey = this.getAttribute("data-track");
      switchTrack(trackKey);
    });
  });

  // التفعيل الأولي للمسار المختار من الرابط
  switchTrack(activeTrack);

  // 10. زر مشاركة الرابط
  const shareBtn = document.getElementById("share-btn");
  const toast = document.getElementById("toast");

  if (shareBtn && toast) {
    shareBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.classList.remove("opacity-0", "pointer-events-none");
        setTimeout(() => {
          toast.classList.add("opacity-0", "pointer-events-none");
        }, 2500);
      }).catch(() => {
        prompt("انسخ الرابط التالي:", window.location.href);
      });
    });
  }

  // الاستماع لتغيير المجموعة والسكشن وتحديث الصفحة فوراً
  window.addEventListener("studentProfileChanged", function () {
    updateStaffAndScheduleInfo();
    selectedTa = "my-ta";
    theoryFilterMode = "my-ta";
    renderTheoryResources();
    renderAllSectionTrack();
  });

  // التطبيق الأولي
  updateStaffAndScheduleInfo();

  function createEmptyNotice(title, desc) {
    return `
      <div class="glass-panel p-8 rounded-3xl border text-center my-4">
        <div class="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
          <i data-lucide="inbox" class="w-6 h-6"></i>
        </div>
        <h4 class="text-sm font-bold text-[var(--text-main)] mb-1">${title}</h4>
        <p class="text-xs text-[var(--text-muted)]">${desc}</p>
      </div>
    `;
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
});
