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
    if (e.key === "Escape" && pdfModal && !pdfModal.classList.contains("hidden")) {
      closePdfModal();
    }
  });

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

                <h4 class="text-base font-bold text-[var(--text-main)] mb-1">${lec.title}</h4>
                <p class="text-xs font-semibold text-[var(--text-muted)] mb-2">${lec.arabicTitle || ""}</p>
                ${lec.notes ? `<p class="text-xs text-[var(--text-dim)] bg-[var(--bg-surface)] p-2.5 rounded-xl border border-[var(--border-subtle)] leading-relaxed">💡 <strong>ملاحظة:</strong> ${lec.notes}</p>` : ""}
                ${topicsHtml}
              </div>
            </div>

            <!-- أزرار المعاينة والتحميل وموقع الشرح -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
              <div class="flex flex-wrap items-center gap-2">
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
    }
  }

  // بنك مذكرات وامتحانات النظري (Theory Resources)
  const theoryResourcesList = document.getElementById("theory-resources-list");
  if (theoryResourcesList) {
    if (!course.resources || course.resources.length === 0) {
      theoryResourcesList.className = "";
      theoryResourcesList.innerHTML = createEmptyNotice(
        "بنك امتحانات وملخصات النظري",
        "المحتوى قيد الإعداد - سيتم رفع نماذج الامتحانات السابقة ومذكرات القوانين فور إرسالها."
      );
    } else {
      theoryResourcesList.className = "grid grid-cols-1 md:grid-cols-2 gap-4";
      theoryResourcesList.innerHTML = course.resources.map((res) => `
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
    }
  }

  // 7. رندر محتوى طريق السكشن (Sections, Assignments, Practical Resources)
  const sectionsCount = course.sections ? course.sections.length : 0;
  const badgeSectionsCount = document.getElementById("badge-sections-count");
  if (badgeSectionsCount) badgeSectionsCount.textContent = `${sectionsCount} سكاشن`;

  // ربط أزرار مجلدات درايف السكاشن (م. أمل مجدي و م. تقى مصطفى)
  const sectionsDriveContainer = document.getElementById("sections-drive-folders-container");
  if (sectionsDriveContainer) {
    let driveButtonsHtml = "";
    if (course.sectionsDriveFolders && course.sectionsDriveFolders.length > 0) {
      driveButtonsHtml = course.sectionsDriveFolders.map(folder => `
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
    } else if (course.sectionsDriveFolderUrl) {
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

    const badgeHtml = `<span class="text-xs px-3 py-1 rounded-full glass-panel border text-cyan-400 font-mono font-bold" id="badge-sections-count">${sectionsCount} سكاشن</span>`;
    sectionsDriveContainer.innerHTML = badgeHtml + driveButtonsHtml;
  }

  const sectionsList = document.getElementById("sections-list");
  const sectionsFilterContainer = document.getElementById("sections-filter-container");
  let selectedTa = "all";

  function renderSectionsList() {
    if (!sectionsList) return;

    if (sectionsCount === 0) {
      sectionsList.innerHTML = createEmptyNotice(
        "شيتات وسكاشن العملي",
        "المحتوى قيد التجهيز - سيتم رفع شيتات المعيدين وأكواد البرمجة فور إرسال محتوى المادة."
      );
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const filteredSections = selectedTa === "all"
      ? course.sections
      : course.sections.filter(s => s.ta === selectedTa);

    if (filteredSections.length === 0) {
      sectionsList.innerHTML = createEmptyNotice(
        "شيتات وسكاشن العملي",
        "لا توجد ملفات متوفرة تحت هذا المعيد حالياً."
      );
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
      const isToqa = sec.ta && sec.ta.includes("تقى");
      const taBadgeClass = isToqa
        ? "bg-teal-500/10 text-teal-300 border-teal-500/20"
        : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";

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
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${isToqa ? 'from-teal-600 to-emerald-500' : 'from-cyan-600 to-teal-500'} text-white font-bold flex flex-col items-center justify-center text-xs flex-shrink-0 shadow-md font-mono icon-box-modern">
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
                    <span>المعيدة: ${sec.ta}</span>
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
                    <span class="font-bold text-amber-400 block mb-0.5">توجيه وملاحظة ${sec.ta || 'المعيدة'}:</span>
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
              <!-- زر معاينة السلايدات -->
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

              <!-- زر مشاهدة فيديو الشرح إن وجد -->
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

              <!-- زر فتح في Google Drive -->
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

              <!-- زر تحميل مباشر -->
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
            </div>
          </div>
        </div>
      `;
    }).join("");

    // ربط أزرار معاينة السلايدات في السكاشن
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

    // ربط أزرار تشغيل فيديو السكشن
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

  // إعداد شريط تصفية المعيدات إذا وُجد أكثر من معيد في السكاشن
  if (sectionsFilterContainer && course.sections && course.sections.length > 0) {
    const uniqueTas = [...new Set(course.sections.map(s => s.ta).filter(Boolean))];
    if (uniqueTas.length > 1) {
      sectionsFilterContainer.classList.remove("hidden");
      sectionsFilterContainer.innerHTML = `
        <div class="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl glass-panel border">
          <span class="text-xs font-bold text-[var(--text-dim)] px-2 flex items-center gap-1.5">
            <i data-lucide="filter" class="w-3.5 h-3.5 text-cyan-400"></i>
            تصفية السكاشن حسب المعيدة:
          </span>
          <button type="button" data-ta-filter="all" class="ta-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedTa === 'all' ? 'bg-cyan-600 text-white shadow-sm' : 'glass-panel border text-[var(--text-muted)] hover:text-[var(--text-main)]'}">
            جميع المعيدات (${course.sections.length})
          </button>
          ${uniqueTas.map(ta => {
            const count = course.sections.filter(s => s.ta === ta).length;
            const isSelected = selectedTa === ta;
            return `
              <button type="button" data-ta-filter="${ta}" class="ta-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${isSelected ? 'bg-cyan-600 text-white shadow-sm' : 'glass-panel border text-[var(--text-muted)] hover:text-[var(--text-main)]'}">
                ${ta} (${count})
              </button>
            `;
          }).join("")}
        </div>
      `;

      sectionsFilterContainer.querySelectorAll(".ta-filter-btn").forEach(btn => {
        btn.addEventListener("click", function() {
          selectedTa = this.getAttribute("data-ta-filter");
          renderSectionsList();
          sectionsFilterContainer.querySelectorAll(".ta-filter-btn").forEach(b => {
            const match = b.getAttribute("data-ta-filter") === selectedTa;
            if (match) {
              b.className = "ta-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-cyan-600 text-white shadow-sm";
            } else {
              b.className = "ta-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all glass-panel border text-[var(--text-muted)] hover:text-[var(--text-main)]";
            }
          });
        });
      });
    } else {
      sectionsFilterContainer.classList.add("hidden");
    }
  }

  // الاستدعاء المبدئي لرندر السكاشن
  renderSectionsList();

  // التكليفات والمشاريع
  const assignmentsCount = course.assignments ? course.assignments.length : 0;
  const badgeAssignmentsCount = document.getElementById("badge-assignments-count");
  if (badgeAssignmentsCount) badgeAssignmentsCount.textContent = `${assignmentsCount} تكليفات`;

  const assignmentsList = document.getElementById("assignments-list");
  if (assignmentsList) {
    if (assignmentsCount === 0) {
      assignmentsList.innerHTML = createEmptyNotice(
        "التكليفات والمشاريع العملية",
        "لا توجد تكليفات مطلوبة حالياً - سيتم إدراج المهام ومواعيد التسليم فور الإعلان عنها من المعيد أو الدكتور."
      );
    } else {
      assignmentsList.innerHTML = course.assignments.map((task) => {
        const statusColors = {
          "متاح": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          "قريباً": "bg-amber-500/10 text-amber-400 border-amber-500/20",
          "منتهي": "bg-red-500/10 text-red-400 border-red-500/20"
        };
        const colorClass = statusColors[task.status] || statusColors["قريباً"];

        return `
          <div class="glass-panel p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover-effect">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0 border border-amber-500/20">
                <i data-lucide="clipboard-check" class="w-5 h-5"></i>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${colorClass}">
                    ${task.status}
                  </span>
                  <span class="text-xs text-[var(--text-dim)] flex items-center gap-1 font-mono">
                    <i data-lucide="clock" class="w-3 h-3"></i>
                    الموعد النهائي: ${task.deadline}
                  </span>
                </div>
                <h4 class="text-sm font-bold text-[var(--text-main)] mb-1">${task.title}</h4>
                <p class="text-xs text-[var(--text-muted)] mb-2">${task.arabicTitle || ""}</p>
                <p class="text-xs text-[var(--text-dim)]">${task.details || ""}</p>
              </div>
            </div>

            <div class="pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
              <a 
                href="${task.fileUrl}" 
                target="_blank" 
                class="px-4 py-2.5 rounded-xl glass-panel border text-xs font-bold flex items-center gap-1.5 hover:bg-amber-600 hover:text-white transition-all shadow-sm"
              >
                <i data-lucide="download" class="w-3.5 h-3.5 text-amber-400"></i>
                <span>تحميل تفاصيل التكليف</span>
              </a>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  // بنك أسئلة العملي ونماذج الكويزات وأدوات اللاب
  const practicalResourcesList = document.getElementById("practical-resources-list");
  if (practicalResourcesList) {
    if (!course.practicalResources || course.practicalResources.length === 0) {
      practicalResourcesList.className = "";
      practicalResourcesList.innerHTML = createEmptyNotice(
        "نماذج اختبارات العملي وأسئلة اللاب",
        "المحتوى قيد التجهيز - سيتم إضافة نماذج امتحانات العملي السابقة وأكواد التجارب قريباً."
      );
    } else {
      practicalResourcesList.className = "grid grid-cols-1 md:grid-cols-2 gap-4";
      practicalResourcesList.innerHTML = course.practicalResources.map((res) => `
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
    }
  }

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
