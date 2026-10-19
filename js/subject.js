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
    iconBox.className = `w-16 h-16 rounded-2xl bg-gradient-to-tr ${course.accentColor} flex items-center justify-center text-white shadow-lg flex-shrink-0`;
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

  // 6. رندر محتوى طريق المحاضرة (Lectures & Theory Resources)
  const lecturesCount = course.lectures ? course.lectures.length : 0;
  const badgeLecturesCount = document.getElementById("badge-lectures-count");
  if (badgeLecturesCount) badgeLecturesCount.textContent = `${lecturesCount} محاضرات`;

  // إعداد نافذة معاينة الـ PDF المضمنة
  const pdfModal = document.getElementById("pdf-modal");
  const pdfFrame = document.getElementById("pdf-modal-frame");
  const pdfTitle = document.getElementById("pdf-modal-title");
  const pdfSubtitle = document.getElementById("pdf-modal-subtitle");
  const pdfOpenNew = document.getElementById("pdf-modal-open-new");
  const pdfDownload = document.getElementById("pdf-modal-download");
  const pdfClose = document.getElementById("pdf-modal-close");

  function openPdfModal(fileUrl, title, subtitle, filename) {
    // الموبايل مش بيعرض PDF جوه iframe، فنفتحه مباشرة في تاب جديد
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile || !pdfModal || !pdfFrame) {
      window.open(fileUrl, "_blank", "noopener");
      return;
    }
    pdfFrame.src = fileUrl;
    if (pdfTitle) pdfTitle.textContent = title || "سلايدات المحاضرة";
    if (pdfSubtitle) pdfSubtitle.textContent = subtitle || "معاينة مباشرة";
    if (pdfOpenNew) pdfOpenNew.href = fileUrl;
    if (pdfDownload) {
      pdfDownload.href = fileUrl;
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
        "المحتوى قيد التجهيز - سيتم رفع سلايدات الـ PDF وروابط الفيديوهات والشرح فور إرسال محتوى المادة."
      );
    } else {
      lecturesList.innerHTML = course.lectures.map((lec) => {
        const pdfFile = lec.pdfUrl || lec.slidesUrl || "#";
        const filename = pdfFile.split("/").pop() || `Lecture_${lec.id}.pdf`;
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
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-bold flex flex-col items-center justify-center text-xs flex-shrink-0 shadow-md font-mono">
                <span>L${lec.id}</span>
                ${lec.chapter ? `<span class="text-[9px] opacity-80">${lec.chapter.replace("Chapter ", "Ch")}</span>` : ""}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1.5">
                  <span class="text-xs font-bold text-indigo-400">${lec.date || `المحاضرة ${lec.id}`}</span>
                  <span class="text-[11px] text-[var(--text-dim)] font-mono">• أسبوع ${lec.week || lec.id}</span>
                  ${lec.doctor ? `
                    <span class="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold flex items-center gap-1">
                      <i data-lucide="graduation-cap" class="w-3 h-3"></i>
                      ${lec.doctor} ${lec.doctorNote ? `(${lec.doctorNote})` : ""}
                    </span>
                  ` : ""}
                  ${lec.pages ? `<span class="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">${lec.pages} صفحة</span>` : ""}
                  ${lec.size ? `<span class="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">${lec.size}</span>` : ""}
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
                  data-preview-file="${pdfFile}"
                  data-preview-title="${lec.title}"
                  data-preview-subtitle="${lec.arabicTitle || ""}"
                  data-preview-filename="${filename}"
                  class="btn-preview-pdf px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <i data-lucide="eye" class="w-4 h-4"></i>
                  <span>معاينة السلايدات</span>
                </button>

                <!-- زر فتح في نافذة مستقلة -->
                <a 
                  href="${pdfFile}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="px-3.5 py-2 rounded-xl glass-panel border text-xs font-bold text-[var(--text-main)] hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
                  title="فتح الـ PDF في نافذة جديدة"
                >
                  <i data-lucide="external-link" class="w-3.5 h-3.5 text-indigo-400"></i>
                  <span>نافذة جديدة</span>
                </a>

                <!-- زر تحميل مباشر للملف -->
                <a 
                  href="${pdfFile}" 
                  download="${filename}"
                  class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  title="تحميل السلايدات على جهازك"
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
                  class="px-3.5 py-2 rounded-xl glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
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
          openPdfModal(file, title, sub, fname);
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
        <div class="glass-panel p-5 rounded-2xl border flex items-center justify-between gap-4 card-hover-effect">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs flex-shrink-0 border border-indigo-500/20">
              <i data-lucide="file-check" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                  ${res.type}
                </span>
                <span class="text-[11px] text-[var(--text-dim)] font-mono">${res.year}</span>
              </div>
              <h4 class="text-xs sm:text-sm font-bold text-[var(--text-main)] mb-1">${res.title}</h4>
              <span class="text-[11px] text-[var(--text-dim)] font-mono">${res.size || ""}</span>
            </div>
          </div>

          <a 
            href="${res.fileUrl}" 
            target="_blank" 
            class="p-2.5 rounded-xl glass-panel border text-xs font-bold flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all flex-shrink-0"
            title="تحميل الملف"
          >
            <i data-lucide="download" class="w-4 h-4"></i>
          </a>
        </div>
      `).join("");
    }
  }

  // 7. رندر محتوى طريق السكشن (Sections, Assignments, Practical Resources)
  const sectionsCount = course.sections ? course.sections.length : 0;
  const badgeSectionsCount = document.getElementById("badge-sections-count");
  if (badgeSectionsCount) badgeSectionsCount.textContent = `${sectionsCount} سكاشن`;

  const sectionsList = document.getElementById("sections-list");
  if (sectionsList) {
    if (sectionsCount === 0) {
      sectionsList.innerHTML = createEmptyNotice(
        "شيتات وسكاشن العملي",
        "المحتوى قيد التجهيز - سيتم رفع شيتات المعيدين وأكواد البرمجة فور إرسال محتوى المادة."
      );
    } else {
      sectionsList.innerHTML = course.sections.map((sec) => `
        <div class="glass-panel p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover-effect">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center text-xs flex-shrink-0 border border-cyan-500/20 font-mono">
              S${sec.id}
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold text-cyan-400">سكشن عملي ${sec.id}</span>
                <span class="text-[11px] text-[var(--text-dim)] font-mono">• أسبوع ${sec.week || sec.id}</span>
              </div>
              <h4 class="text-sm font-bold text-[var(--text-main)] mb-1">${sec.title}</h4>
              <p class="text-xs text-[var(--text-muted)] mb-2">${sec.arabicTitle || ""}</p>
              ${sec.notes ? `<p class="text-xs text-[var(--text-dim)] italic">ملاحظات المعيد: ${sec.notes}</p>` : ""}
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
            <a 
              href="${sec.sheetUrl}" 
              target="_blank" 
              class="px-3.5 py-2 rounded-xl glass-panel border text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-600 hover:text-white transition-all shadow-sm"
            >
              <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5 text-cyan-400"></i>
              <span>شيت السكشن</span>
            </a>

            <a 
              href="${sec.codeUrl}" 
              target="_blank" 
              class="px-3.5 py-2 rounded-xl glass-panel border text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            >
              <i data-lucide="code" class="w-3.5 h-3.5 text-emerald-400"></i>
              <span>الكود البرمجي</span>
            </a>
          </div>
        </div>
      `).join("");
    }
  }

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

  // بنك أسئلة العملي ونماذج الكويزات
  const practicalResourcesList = document.getElementById("practical-resources-list");
  if (practicalResourcesList) {
    practicalResourcesList.className = "";
    practicalResourcesList.innerHTML = createEmptyNotice(
      "نماذج اختبارات العملي وأسئلة اللاب",
      "المحتوى قيد التجهيز - سيتم إضافة نماذج امتحانات العملي السابقة وأكواد التجارب قريباً."
    );
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
