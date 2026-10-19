/**
 * ==============================================================================
 * منطق الصفحة الرئيسية (Home Page App Logic) مع التخصيص حسب المجموعة والسكشن
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  const coursesGrid = document.getElementById("courses-grid");
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search");
  const resultsCount = document.getElementById("results-count");
  const noResults = document.getElementById("no-results");
  const filterChips = document.querySelectorAll(".filter-chip");
  const scheduleGrid = document.getElementById("weekly-schedule-grid");
  const scheduleTargetLabel = document.getElementById("schedule-target-label");

  let currentCategory = "all";
  let searchQuery = "";

  const iconMap = {
    cpu: "cpu",
    palette: "palette",
    database: "database",
    network: "network",
    terminal: "terminal",
    "file-text": "file-text"
  };

  // رندر بطاقة مادة مخصصة حسب مجموعة وسكشن الطالب
  function createCourseCard(course) {
    const iconName = iconMap[course.icon] || "book";
    const lecturesCount = course.lectures ? course.lectures.length : 0;
    const sectionsCount = course.sections ? course.sections.length : 0;
    const assignmentsCount = course.assignments ? course.assignments.length : 0;
    const videosCount = course.videoExplanations ? course.videoExplanations.length : 0;

    // استخراج معلومات الدكتور والمعيد الخاصة بالطالب الحالي
    const staff = window.StudentProfile ? window.StudentProfile.getCourseStaff(course.id) : {
      doctor: course.doctor,
      ta: course.ta,
      lectureHall: "المدرج",
      sectionRoom: "المعمل"
    };

    return `
      <article class="glass-panel rounded-3xl p-6 border flex flex-col justify-between card-hover-effect relative group">
        
        <!-- رأس البطاقة -->
        <div>
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${course.accentColor} flex items-center justify-center text-white shadow-md icon-box-modern">
              <i data-lucide="${iconName}" class="w-6 h-6"></i>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs px-2.5 py-1 rounded-full font-mono font-bold ${course.badgeColor} border">
                ${course.code}
              </span>
            </div>
          </div>

          <h3 class="text-lg font-bold text-[var(--text-main)] group-hover:text-indigo-400 transition-colors">
            ${course.name}
          </h3>
          <p class="text-xs font-semibold text-[var(--text-muted)] mb-3">
            ${course.arabicName}
          </p>

          <!-- معلومات الدكتور والمعيد المخصصة لمجموعتك وسكشنك -->
          <div class="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] mb-4 text-xs space-y-1.5">
            <div class="flex items-center gap-2 text-[var(--text-main)]">
              <i data-lucide="graduation-cap" class="w-3.5 h-3.5 text-indigo-400 flex-shrink-0"></i>
              <span class="truncate font-semibold" title="${staff.doctor}">${staff.doctor}</span>
              ${staff.lectureHall ? `<span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono flex-shrink-0">${staff.lectureHall}</span>` : ""}
            </div>
            <div class="flex items-center gap-2 text-[var(--text-muted)]">
              <i data-lucide="user-check" class="w-3.5 h-3.5 text-cyan-400 flex-shrink-0"></i>
              <span class="truncate" title="${staff.ta}">${staff.ta}</span>
              ${staff.sectionRoom ? `<span class="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono flex-shrink-0">${staff.sectionRoom}</span>` : ""}
            </div>
          </div>

          <!-- بطاقة موقع الشرح المخصص أو المستودع -->
          <div class="hero-explanation-card p-4 rounded-2xl mb-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                <i data-lucide="globe" class="w-3.5 h-3.5"></i>
                موقع الشرح المعتمد
              </span>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                ${course.explanationSite.status || "متاح"}
              </span>
            </div>
            <h4 class="text-xs font-bold text-[var(--text-main)] mb-1">
              ${course.explanationSite.title}
            </h4>
            <p class="text-[11px] text-[var(--text-muted)] mb-3 line-clamp-2">
              ${course.explanationSite.description}
            </p>
            <a 
              href="${course.explanationSite.url}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r ${course.accentColor} text-white text-xs font-bold shadow-md hover:opacity-95 transition-all btn-smooth"
            >
              <span>فتح موقع الشرح التفاعلي</span>
              <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            </a>
          </div>
        </div>

        <!-- معلومات المحتوى وزر التصفح -->
        <div>
          <!-- شارات الإحصائيات وحالة المحتوى -->
          <div class="flex items-center justify-between text-xs text-[var(--text-dim)] border-t border-[var(--border-subtle)] pt-3 pb-3">
            <span class="flex items-center gap-1.5 font-medium">
              <i data-lucide="cloud" class="w-3.5 h-3.5 text-indigo-400"></i>
              ${lecturesCount > 0 ? `${lecturesCount} محاضرات (Drive)` : '<span class="text-indigo-400/90 font-medium">المحاضرات قريباً</span>'}
            </span>
            <span class="flex items-center gap-1.5 font-medium">
              <i data-lucide="terminal" class="w-3.5 h-3.5 text-cyan-400"></i>
              ${sectionsCount > 0 ? `${sectionsCount} سكاشن عملي (Drive)` : (videosCount > 0 ? `${videosCount} مصادر شرح` : '<span class="text-cyan-400/90 font-medium">السكاشن قريباً</span>')}
            </span>
          </div>

          ${assignmentsCount > 0 ? `
            <a 
              href="subject.html?id=${course.id}&track=section#assignments-section-panel"
              class="mb-3 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 flex items-center justify-between text-xs transition-all"
              title="عرض تكليفات وتاسكات السكشن"
            >
              <span class="text-amber-400 font-bold flex items-center gap-1.5">
                <i data-lucide="clipboard-check" class="w-3.5 h-3.5"></i>
                <span>تاسك السكشن متاح ومطلوب</span>
              </span>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">${assignmentsCount} تكليف</span>
            </a>
          ` : ""}

          <!-- أزرار مساري المادة (طريق المحاضرة وطريق السكشن) -->
          <div class="grid grid-cols-2 gap-2">
            <a 
              href="subject.html?id=${course.id}&track=lecture" 
              class="py-2.5 px-3 rounded-xl glass-panel border border-indigo-500/25 text-xs font-bold text-[var(--text-main)] hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-1.5 shadow-sm btn-smooth"
              title="الدخول لطريق المحاضرة النظري"
            >
              <i data-lucide="graduation-cap" class="w-3.5 h-3.5 text-indigo-400"></i>
              <span>طريق المحاضرة</span>
            </a>

            <a 
              href="subject.html?id=${course.id}&track=section" 
              class="py-2.5 px-3 rounded-xl glass-panel border border-cyan-500/25 text-xs font-bold text-[var(--text-main)] hover:bg-cyan-600 hover:text-white hover:border-cyan-600 transition-all flex items-center justify-center gap-1.5 shadow-sm btn-smooth"
              title="الدخول لطريق السكشن والعملي"
            >
              <i data-lucide="terminal" class="w-3.5 h-3.5 text-cyan-400"></i>
              <span>طريق السكشن</span>
            </a>
          </div>
        </div>

      </article>
    `;
  }

  // تصفية ورندر البطاقات
  function renderCourses() {
    if (!window.COURSES_DATA) return;

    const filtered = window.COURSES_DATA.filter((course) => {
      let matchesCategory = true;
      if (currentCategory === "CS") {
        matchesCategory = course.category.includes("CS") || course.category.includes("حاسب");
      } else if (currentCategory === "IS") {
        matchesCategory = course.category.includes("IS") || course.category.includes("نظم");
      } else if (currentCategory === "General") {
        matchesCategory = course.category.includes("عامة") || course.category.includes("مهارات");
      }

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        course.name.toLowerCase().includes(query) ||
        course.arabicName.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query) ||
        course.shortDesc.toLowerCase().includes(query) ||
        (course.lectures && course.lectures.some((l) => l.title.toLowerCase().includes(query) || l.arabicTitle.includes(query)));

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      coursesGrid.innerHTML = "";
      noResults.classList.remove("hidden");
      resultsCount.textContent = "0 مواد";
    } else {
      noResults.classList.add("hidden");
      coursesGrid.innerHTML = filtered.map(createCourseCard).join("");
      resultsCount.textContent = `${filtered.length} مواد متاحة`;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // رندر جدول المواعيد الأسبوعي المخصص للطالب
  function renderWeeklySchedule() {
    if (!scheduleGrid || !window.StudentProfile) return;

    const profile = window.StudentProfile.get();
    if (scheduleTargetLabel) {
      scheduleTargetLabel.textContent = `مجموعة ${profile.group} • سكشن ${profile.section}`;
    }

    const weeklyDays = window.StudentProfile.getWeeklySchedule();

    scheduleGrid.innerHTML = weeklyDays.map((day) => {
      const hasClasses = day.items && day.items.length > 0;

      return `
        <div class="glass-panel rounded-2xl p-4 sm:p-5 border flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
              <span class="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                <i data-lucide="calendar" class="w-4 h-4 text-indigo-400"></i>
                يوم ${day.name}
              </span>
              <span class="text-[11px] font-mono px-2 py-0.5 rounded-full ${hasClasses ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-[var(--text-dim)]'}">
                ${hasClasses ? `${day.items.length} حصص` : 'إجازة / لا توجد فترات'}
              </span>
            </div>

            ${hasClasses ? `
              <div class="space-y-3">
                ${day.items.map((item) => `
                  <div class="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-indigo-500/30 transition-all">
                    <div class="flex items-center justify-between gap-2 mb-1.5">
                      <span class="text-[10px] px-2 py-0.5 rounded-md font-bold ${item.type === 'lecture' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'}">
                        ${item.typeLabel}
                      </span>
                      <span class="text-xs font-mono text-[var(--text-main)] font-semibold flex items-center gap-1">
                        <i data-lucide="clock" class="w-3 h-3 text-[var(--text-muted)]"></i>
                        ${item.time}
                      </span>
                    </div>

                    <h4 class="text-xs font-bold text-[var(--text-main)] mb-1">
                      ${item.arabicName}
                    </h4>

                    <div class="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)] mt-2">
                      <span class="truncate flex items-center gap-1 text-[var(--text-dim)]" title="${item.instructor}">
                        <i data-lucide="${item.type === 'lecture' ? 'graduation-cap' : 'user'}" class="w-3 h-3"></i>
                        ${item.instructor}
                      </span>
                      <span class="px-1.5 py-0.5 rounded bg-black/20 text-indigo-300 font-mono text-[10px] border border-white/5 flex-shrink-0">
                        ${item.place}
                      </span>
                    </div>
                  </div>
                `).join("")}
              </div>
            ` : `
              <div class="py-6 text-center text-xs text-[var(--text-dim)]">
                <i data-lucide="coffee" class="w-6 h-6 mx-auto mb-2 opacity-50"></i>
                لا توجد محاضرات أو سكاشن مجدولة لمجموعتك وسكشنك في هذا اليوم.
              </div>
            `}
          </div>
        </div>
      `;
    }).join("");

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // أحداث البحث
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      searchQuery = e.target.value;
      if (clearSearchBtn) {
        if (searchQuery.length > 0) {
          clearSearchBtn.classList.remove("hidden");
        } else {
          clearSearchBtn.classList.add("hidden");
        }
      }
      renderCourses();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", function () {
      searchInput.value = "";
      searchQuery = "";
      clearSearchBtn.classList.add("hidden");
      renderCourses();
      searchInput.focus();
    });
  }

  // أزرار الفلترة
  filterChips.forEach((chip) => {
    chip.addEventListener("click", function () {
      filterChips.forEach((c) => {
        c.classList.remove("active-chip", "bg-indigo-600", "text-white", "border-indigo-600");
      });
      this.classList.add("active-chip", "bg-indigo-600", "text-white", "border-indigo-600");
      currentCategory = this.getAttribute("data-filter");
      renderCourses();
    });
  });

  // الاستماع لتغيير بيانات الطالب (المجموعة والسكشن) لإعادة رندر البطاقات والجدول فوراً
  window.addEventListener("studentProfileChanged", function () {
    renderCourses();
    renderWeeklySchedule();
  });

  // الرندر الأولي
  renderCourses();
  renderWeeklySchedule();
});
