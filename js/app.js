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

  function createCourseCard(course) {
    const display = window.PortalPresentation.course(course);
    const staff = window.StudentProfile.getCourseStaff(course.id);
    const sections = window.StudentProfile.filterItemsForTa(course.sections || [], "my-ta", staff.ta);
    const assignments = window.StudentProfile.filterItemsForTa(course.assignments || [], "my-ta", staff.ta, true);
    return `<article class="a1-course glass-panel" data-course-id="${course.id}">
      <a class="a1-course-link" href="subject.html?id=${course.id}&track=lecture" aria-label="فتح ${display.name}">
        <div class="a1-course-heading"><span class="a1-course-icon"><i data-lucide="${display.icon}" aria-hidden="true"></i></span><bdi class="a1-course-code">${course.code}</bdi></div>
        <div class="a1-course-title"><h3 lang="en" dir="ltr">${display.name}</h3><p>${course.arabicName}</p></div>
        <div class="a1-course-counts"><span>${(course.lectures || []).length} محاضرات ومراجع منشورة</span><span>${sections.length} ملفات سكشن لاختيارك</span></div>
        <span class="a1-course-enter">افتح المادة <i data-lucide="arrow-left" aria-hidden="true"></i></span>
      </a>
      ${assignments.length ? `<a class="a1-assignment-link" href="subject.html?id=${course.id}&track=section#assignments-section-panel">${assignments.length} تكليف لسكشنك</a>` : ""}
    </article>`;
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
        window.PortalPresentation.course(course).name.toLowerCase().includes(query) ||
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

    window.PortalUI.icons(coursesGrid);
  }

  // رندر جدول المواعيد الأسبوعي المخصص للطالب
  function renderWeeklySchedule() {
    if (!scheduleGrid || !window.StudentProfile) return;

    const profile = window.StudentProfile.get();
    if (scheduleTargetLabel) {
      scheduleTargetLabel.textContent = `مجموعة ${profile.group} • سكشن ${profile.section}`;
    }

    const weeklyDays = window.StudentProfile.getWeeklySchedule();

    let notice = document.getElementById("schedule-data-notice");
    if (!notice) {
      notice = document.createElement("p");
      notice.id = "schedule-data-notice";
      notice.className = "mb-4 rounded-xl border border-amber-500/30 p-3 text-xs text-[var(--text-main)]";
      notice.setAttribute("role", "status");
      scheduleGrid.before(notice);
    }
    notice.hidden = window.StudentProfile.getUnconfirmedScheduleEntries().length === 0;
    notice.textContent = "بعض مواعيد هذا السكشن قيد التأكيد. راجع جدول الكلية قبل الاعتماد على الجدول المعروض.";

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
                      <bdi lang="en">${window.PortalPresentation.byCode(item.code)?.name || item.courseName}</bdi><small class="a1-schedule-ar">${item.arabicName}</small>
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

    window.PortalUI.icons(scheduleGrid);
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
