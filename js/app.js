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
      const countLabel = hasClasses
        ? (day.items.length === 1 ? "فترة واحدة" : day.items.length === 2 ? "فترتان" : `${day.items.length} فترات`)
        : "إجازة";

      return `
        <article class="glass-panel a1-schedule-day ${hasClasses ? 'has-classes' : 'is-off-day'}" aria-label="جدول يوم ${day.name}">
          <div>
            <div class="a1-schedule-day-head">
              <span class="a1-schedule-day-name">
                <i data-lucide="calendar" class="w-4 h-4 text-indigo-400" aria-hidden="true"></i>
                يوم ${day.name}
              </span>
              <span class="a1-schedule-day-pill ${hasClasses ? 'pill-active' : 'pill-off'}">
                ${countLabel}
              </span>
            </div>

            ${hasClasses ? `
              <div class="a1-schedule-items-list space-y-3">
                ${day.items.map((item) => {
                  const isLecture = item.type === "lecture";
                  const courseTitle = window.PortalPresentation.byCode(item.code)?.name || item.courseName;
                  return `
                    <div class="a1-schedule-card ${isLecture ? 'is-lecture' : 'is-section'}">
                      <div class="a1-schedule-card-top">
                        <span class="a1-schedule-type-badge ${isLecture ? 'badge-lecture' : 'badge-section'}">
                          <i data-lucide="${isLecture ? 'graduation-cap' : 'book-open'}" class="w-3 h-3" aria-hidden="true"></i>
                          <span>${item.typeLabel}</span>
                        </span>
                        <span class="a1-schedule-time">
                          <i data-lucide="clock" class="w-3 h-3" aria-hidden="true"></i>
                          <bdi>${item.time}</bdi>
                        </span>
                      </div>

                      <div class="a1-schedule-card-body">
                        <h4 class="a1-schedule-course-name">
                          <bdi lang="en">${courseTitle}</bdi>
                        </h4>
                        <small class="a1-schedule-ar">${item.arabicName}</small>
                      </div>

                      <div class="a1-schedule-card-footer">
                        <span class="a1-schedule-instructor truncate" title="${item.instructor}">
                          <i data-lucide="${isLecture ? 'graduation-cap' : 'user'}" class="w-3.5 h-3.5" aria-hidden="true"></i>
                          <span>${item.instructor}</span>
                        </span>
                        <span class="a1-schedule-room">
                          <i data-lucide="map-pin" class="w-3 h-3" aria-hidden="true"></i>
                          <bdi>${item.place}</bdi>
                        </span>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            ` : `
              <div class="a1-schedule-empty-state">
                <i data-lucide="coffee" class="w-5 h-5 opacity-60" aria-hidden="true"></i>
                <p>لا توجد محاضرات أو سكاشن مجدولة لمجموعتك في هذا اليوم.</p>
              </div>
            `}
          </div>
        </article>
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
