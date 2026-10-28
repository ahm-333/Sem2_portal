/**
 * ==============================================================================
 * منطق صفحة المادة: تقسيم المادة إلى مسارين (طريق المحاضرة وطريق السكشن)
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  const createEmptyNotice = window.PortalUI.emptyNotice;
  if (!window.COURSES_DATA || window.COURSES_DATA.length === 0) {
    console.error("بيانات المواد غير متوفرة!");
    return;
  }

  // 1. استخراج معرف المادة والمسار المختار من الرابط
  const urlParams = new URLSearchParams(window.location.search);
  let courseId = urlParams.get("id");
  let activeTrack = urlParams.get("track") === "section" ? "section" : "lecture";

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
    window.PortalUI.icons();
    return;
  }

  const display = window.PortalPresentation.course(course);

  // 2. تحديث عنوان الصفحة
  document.title = `${display.name} (${course.arabicName}) | Kernal`;

  // 3. ملء القائمة المنسدلة للانتقال السريع
  const quickSelect = document.getElementById("quick-course-select");
  if (quickSelect) {
    quickSelect.innerHTML = window.COURSES_DATA.map(
      (c) => `<option value="${c.id}" ${c.id === course.id ? "selected" : ""}>${window.PortalPresentation.course(c).name} - ${c.code}</option>`
    ).join("");

    quickSelect.addEventListener("change", function () {
      const kind = document.body.dataset.resourceKind;
      window.location.href = `subject.html?id=${this.value}&track=${activeTrack}${kind ? '&kind=' + encodeURIComponent(kind) : ''}`;
    });
  }

  // 4. تعبئة بيانات المادة الثابتة
  const navName = document.getElementById("nav-subject-name");
  const navCode = document.getElementById("nav-subject-code");
  if (navName) navName.textContent = display.name;
  if (navCode) navCode.textContent = `${course.code} • ${course.arabicName}`;
  document.getElementById("crumb-subject-name").textContent = display.name;

  document.getElementById("subject-title-en").textContent = display.name;
  document.getElementById("subject-title-ar").textContent = course.arabicName;
  document.getElementById("subject-desc").textContent = course.shortDesc;
  document.getElementById("subject-badge-code").textContent = course.code;
  document.getElementById("subject-category").textContent = course.category;

  const iconName = display.icon;
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
  const expTitle = document.getElementById("exp-title");
  if (expTitle && course.explanationSite) {
    const siteKey = window.PortalCatalog ? window.PortalCatalog.key(course.id, "explanation-site", "site") : JSON.stringify([String(course.id), "explanation-site", "site"]);
    const expPanel = expTitle.closest(".glass-panel");
    if (expPanel) expPanel.setAttribute("data-content-key", siteKey);
  }

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

  if (!window.PortalMedia.canPreviewSite(course.explanationSite.url)) {
    togglePreviewBtn.hidden = true;
    expMainBtn.querySelector("span").textContent = "فتح مجلد المادة في Google Drive";
  }

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
        const contentKey = window.PortalCatalog ? window.PortalCatalog.key(course.id, "video", vid.id) : JSON.stringify([String(course.id), "video", String(vid.id)]);
        return `
          <div class="glass-panel p-5 sm:p-6 rounded-3xl border flex flex-col justify-between gap-4 card-hover-effect" data-content-key='${contentKey}'>
            <div>
              <div class="flex items-center justify-between gap-2 mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold flex items-center gap-1">
                    <i data-lucide="monitor-play" class="w-3 h-3"></i>
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


      // إعداد أزرار نسخ الرابط

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

  const study = window.PortalStudyReader.create();

  function renderLectures() {
    const lecturesList = document.getElementById("lectures-list");
    if (!lecturesList) return;
    if (lecturesCount === 0) {
      lecturesList.innerHTML = createEmptyNotice(
        "سجل المحاضرات النظري",
        "المحتوى قيد التجهيز - سيتم إضافة سلايدات المحاضرات وروابط Google Drive فور توفرها."
      );
      return;
    }

    const staff = window.StudentProfile ? window.StudentProfile.getCourseStaff(course.id) : null;

    lecturesList.innerHTML = course.lectures.map((lec) => {
      const previewUrl = lec.drivePreviewUrl || lec.pdfUrl || lec.slidesUrl || "#";
      const viewUrl = lec.driveViewUrl || lec.pdfUrl || lec.slidesUrl || "#";
      const downloadUrl = lec.driveDownloadUrl || lec.pdfUrl || "#";
      const filename = `${course.name}_Lecture_${lec.id}.${lec.fileType || 'pdf'}`;
      const contentKey = window.PortalCatalog ? window.PortalCatalog.key(course.id, "lecture", lec.id) : JSON.stringify([String(course.id), "lecture", String(lec.id)]);
      
      const allExp = window.STUDY_CATALOG;
      const osUnit = course.id === "operating-system" ? {1: "os-01", 2: "os-09", 3: "os-13"}[lec.id] : null;
      const smartStudyData = !osUnit && allExp && allExp[course.id] && allExp[course.id][lec.id];
      const catalogEntry = window.PortalCatalog ? window.PortalCatalog.get(contentKey) : null;
      const standaloneUrl = catalogEntry?.module?.url || lec.studyManualUrl || null;
      const hasExplanation = Boolean(smartStudyData || osUnit || standaloneUrl);

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

      const doctorName = (staff && staff.doctor && staff.doctor !== "بيانات المحاضر غير متوفرة")
        ? staff.doctor
        : (lec.doctor || "أستاذ المادة");
      const doctorNote = staff && staff.group
        ? `مجموعتك ${staff.group} • سلايدات موحدة`
        : (lec.doctorNote || "");

      return `
        <div class="glass-panel p-5 sm:p-6 rounded-3xl border flex flex-col justify-between gap-5 card-hover-effect" data-content-key='${contentKey}'>
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
                <span class="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold flex items-center gap-1" title="أستاذ المادة المخصص لمجموعتك في جدول الكلية">
                  <i data-lucide="graduation-cap" class="w-3 h-3"></i>
                  <span>${doctorName}</span>
                  ${doctorNote ? `<span class="text-[9px] opacity-80">(${doctorNote})</span>` : ""}
                </span>
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
              ${osUnit ? `
                <a href="education-preview/os/?unit=${osUnit}" data-os-course-link="${lec.id}"
                  class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm btn-smooth"
                  aria-label="فتح شرح Chapter ${lec.id}: الرسومات والأسئلة والمصطلحات">
                  <i data-lucide="book-open" class="w-4 h-4"></i>
                  <span>فتح الشرح والرسومات والأسئلة</span>
                </a>
              ` : ""}
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
              ${standaloneUrl ? `
                <!-- زر الشرح التفاعلي للمحاضرة -->
                <a 
                  href="${standaloneUrl}"
                  data-standalone-study-link="${lec.id}" 
                  class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shadow-amber-500/25 btn-smooth"
                  title="فتح موقع الشرح التفاعلي للمحاضرة وتفكيك الأكواد والرسومات"
                >
                  <i data-lucide="sparkles" class="w-4 h-4 text-amber-100"></i>
                  <span>الشرح التفاعلي</span>
                </a>
              ` : ""}

              ${(!hasExplanation) ? `
                <!-- زر الشرح غير متوفر حالياً — قريبًا -->
                <button 
                  type="button"
                  disabled
                  aria-disabled="true"
                  data-study-unavailable="true"
                  class="btn-study-disabled a1-action-disabled px-4 py-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] text-xs font-bold flex items-center gap-2 cursor-not-allowed opacity-60 shadow-none"
                  title="الشرح التفاعلي غير متوفر حالياً لهذه المحاضرة — قريبًا"
                  aria-label="الشرح لهذه المحاضرة غير متوفر حالياً — قريبًا"
                >
                  <i data-lucide="clock" class="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true"></i>
                  <span>الشرح — قريبًا</span>
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
          </div>
        </div>
      `;
    }).join("");

    lecturesList.querySelectorAll(".btn-open-smart-study").forEach((btn) => {
      btn.addEventListener("click", function () {
        const cid = this.getAttribute("data-open-study-course");
        const lid = parseInt(this.getAttribute("data-open-study-lecture"), 10);
        study.open(cid, lid);
      });
    });

    window.PortalUI.icons(lecturesList);
  }

  const content = window.PortalSubjectContent.create(course);

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

    window.PortalUI.icons();
  }

  // 9. منطق التبديل بين المسارين (طريق المحاضرة | طريق السكشن)
  const trackButtons = document.querySelectorAll(".track-btn");
  const lecturePanel = document.getElementById("track-panel-lecture");
  const sectionPanel = document.getElementById("track-panel-section");

  function switchTrack(trackKey) {
    trackKey = trackKey === "section" ? "section" : "lecture";
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

    window.PortalUI.icons();
  }

  trackButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const trackKey = this.getAttribute("data-track");
      switchTrack(trackKey);
    });
  });

  // التفعيل الأولي للمسار المختار من الرابط
  switchTrack(activeTrack);

  // A single clipboard path handles sharing and every video link.
  const shareBtn = document.getElementById("share-btn");
  if (shareBtn) shareBtn.addEventListener("click", () => window.PortalMedia.copyLink(window.location.href));

  // الاستماع لتغيير المجموعة والسكشن وتحديث الصفحة فوراً
  window.addEventListener("studentProfileChanged", function () {
    updateStaffAndScheduleInfo();
    renderLectures();
    content.resetFilters();
    window.dispatchEvent(new CustomEvent("portal:content-ready", { detail: { courseId: course.id } }));
  });

  // التطبيق الأولي
  renderLectures();
  updateStaffAndScheduleInfo();


  window.PortalUI.icons();
  window.dispatchEvent(new CustomEvent("portal:content-ready", { detail: { courseId: course.id } }));
});
