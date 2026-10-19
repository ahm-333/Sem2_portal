/* Theory and practical track rendering, with one instance of filter state. */
(function () {
  function create(course) {
    const createEmptyNotice = window.PortalUI.emptyNotice;
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
      window.PortalUI.icons(theoryResourcesList);
      return;
    }

    let filteredResources = allResources;
    if (theoryFilterMode === "my-ta") {
      filteredResources = window.StudentProfile.filterItemsForTa(allResources, "my-ta", studentTa, true);
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
      window.PortalUI.icons(theoryResourcesList);
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

    window.PortalUI.icons(theoryResourcesList);
  }

  // 7. رندر محتوى طريق السكشن (Sections, Assignments, Practical Resources)
  // تصفية ذكية حسب معيد سكشن الطالب لضمان ظهور ملفات معيده المعتمد فقط افتراضياً
  let selectedTa = "my-ta";

  const sectionsDriveContainer = document.getElementById("sections-drive-folders-container");
  const sectionsFilterContainer = document.getElementById("sections-filter-container");
  const sectionsList = document.getElementById("sections-list");
  const assignmentsList = document.getElementById("assignments-list");
  const practicalResourcesList = document.getElementById("practical-resources-list");
  const badgeAssignmentsCount = document.getElementById("badge-assignments-count");
  const quickBadgeAssignments = document.getElementById("quick-badge-assignments");

  // 7.1 رندر أزرار مجلدات درايف الخاصة بالسكاشن حسب معيد السكشن
  function renderSectionsDriveFolders(filteredCount) {
    if (!sectionsDriveContainer) return;
    const staff = getStudentStaff();
    const studentTa = staff.ta;

    const visibleFolders = window.StudentProfile.filterItemsForTa(course.sectionsDriveFolders || [], selectedTa, studentTa, true);

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
    window.PortalUI.icons(sectionsDriveContainer);
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

    window.PortalUI.icons(sectionsFilterContainer);
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
      window.PortalUI.icons(sectionsList);
      return;
    }

    const filteredSections = window.StudentProfile.filterItemsForTa(allSections, selectedTa, studentTa);

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
      window.PortalUI.icons(sectionsList);
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





    window.PortalUI.icons(sectionsList);
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
      window.PortalUI.icons(assignmentsList);
      return;
    }

    const filteredAssignments = window.StudentProfile.filterItemsForTa(allAssignments, selectedTa, studentTa, true);

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
      window.PortalUI.icons(assignmentsList);
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



    window.PortalUI.icons(assignmentsList);
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
      window.PortalUI.icons(practicalResourcesList);
      return;
    }

    const filteredPractical = window.StudentProfile.filterItemsForTa(allPractical, selectedTa, studentTa, true);

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
      window.PortalUI.icons(practicalResourcesList);
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

    window.PortalUI.icons(practicalResourcesList);
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


    return {resetFilters() {
      selectedTa = "my-ta";
      theoryFilterMode = "my-ta";
      renderTheoryResources();
      renderAllSectionTrack();
    }};
  }
  window.PortalSubjectContent = {create};
})();
