/**
 * ==============================================================================
 * إدارة نافذة اختيار وتخصيص المجموعة والسكشن للطالب (Student Group & Section Modal)
 * ==============================================================================
 */

(function () {
  const FIRST_VISIT_FLAG = "sem2_first_visit_configured";

  // توليد كود النافذة المنبثقة وحقنها في الـ DOM
  function injectModalHTML() {
    if (document.getElementById("student-profile-modal")) return;

    const modalHTML = `
      <div id="student-profile-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md hidden opacity-0 transition-opacity duration-300">
        <div class="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl relative transform scale-95 transition-transform duration-300" id="profile-modal-box">
          
          <!-- زر إغلاق -->
          <button id="close-profile-modal" class="absolute top-5 left-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-all">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <!-- رأس النافذة -->
          <div class="text-center mb-6">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg mb-3">
              <i data-lucide="graduation-cap" class="w-7 h-7"></i>
            </div>
            <h3 class="text-xl sm:text-2xl font-bold text-[var(--text-main)] mb-1">تخصيص محتواك الدراسي</h3>
            <p class="text-xs sm:text-sm text-[var(--text-muted)]">حدد مجموعتك وسكشنك لنعرض لك دكاترة محاضراتك ومعيدي سكاشنك وجدولك الأسبوعي بدقة!</p>
          </div>

          <!-- نموذج الاختيار -->
          <form id="profile-selection-form" class="space-y-6">
            
            <!-- 1. اختيار المجموعة -->
            <div>
              <label class="block text-xs font-bold text-[var(--text-main)] mb-2 flex items-center gap-1.5">
                <i data-lucide="users" class="w-4 h-4 text-indigo-400"></i>
                1. اختر المجموعة (Group):
              </label>
              <div class="grid grid-cols-3 gap-3" id="modal-group-options">
                <label class="cursor-pointer">
                  <input type="radio" name="student_group" value="B1" class="peer sr-only">
                  <div class="p-3.5 rounded-2xl border text-center font-bold text-sm glass-panel peer-checked:border-indigo-500 peer-checked:bg-indigo-600 peer-checked:text-white transition-all">
                    مجموعة B1
                    <div class="text-[10px] font-normal opacity-80 mt-0.5">سكاشن 1 - 4</div>
                  </div>
                </label>

                <label class="cursor-pointer">
                  <input type="radio" name="student_group" value="B2" class="peer sr-only">
                  <div class="p-3.5 rounded-2xl border text-center font-bold text-sm glass-panel peer-checked:border-indigo-500 peer-checked:bg-indigo-600 peer-checked:text-white transition-all">
                    مجموعة B2
                    <div class="text-[10px] font-normal opacity-80 mt-0.5">سكاشن 5 - 8</div>
                  </div>
                </label>

                <label class="cursor-pointer">
                  <input type="radio" name="student_group" value="B3" class="peer sr-only">
                  <div class="p-3.5 rounded-2xl border text-center font-bold text-sm glass-panel peer-checked:border-indigo-500 peer-checked:bg-indigo-600 peer-checked:text-white transition-all">
                    مجموعة B3
                    <div class="text-[10px] font-normal opacity-80 mt-0.5">سكاشن 9 - 12</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- 2. اختيار السكشن -->
            <div>
              <label class="block text-xs font-bold text-[var(--text-main)] mb-2 flex items-center gap-1.5">
                <i data-lucide="hash" class="w-4 h-4 text-cyan-400"></i>
                2. اختر السكشن (Section):
              </label>
              <div class="grid grid-cols-4 gap-2.5" id="modal-section-options">
                <!-- يتم تعبئة أزرار السكاشن حسب المجموعة المختارة -->
              </div>
            </div>

            <!-- زر التأكيد -->
            <button 
              type="submit" 
              class="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-sm shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>تأكيد وحفظ التخصيص</span>
              <i data-lucide="check" class="w-4 h-4"></i>
            </button>
          </form>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  // تحديث خيارات السكاشن المعروضة بناءً على المجموعة المختارة
  function updateSectionRadios(group, preselectedSection) {
    const container = document.getElementById("modal-section-options");
    if (!container || !window.SCHEDULE_CONFIG) return;

    const sections = window.SCHEDULE_CONFIG.groups[group]?.sections || [1, 2, 3, 4];
    
    // إذا لم يكن السكشن المختار سابقاً ضمن سكاشن هذه المجموعة، نختار أول سكشن في المجموعة
    let selectedSec = preselectedSection;
    if (!sections.includes(selectedSec)) {
      selectedSec = sections[0];
    }

    container.innerHTML = sections.map((sec) => `
      <label class="cursor-pointer">
        <input type="radio" name="student_section" value="${sec}" ${sec === selectedSec ? "checked" : ""} class="peer sr-only">
        <div class="py-2.5 px-3 rounded-xl border text-center font-mono font-bold text-xs glass-panel peer-checked:border-cyan-500 peer-checked:bg-cyan-600 peer-checked:text-white transition-all">
          سكشن ${sec}
        </div>
      </label>
    `).join("");
  }

  // فتح وإغلاق النافذة
  function openModal() {
    const modal = document.getElementById("student-profile-modal");
    const box = document.getElementById("profile-modal-box");
    if (!modal) return;

    const current = window.StudentProfile.get();
    
    // تحديد الراديو الخاص بالمجموعة
    const groupRadio = modal.querySelector(`input[name="student_group"][value="${current.group}"]`);
    if (groupRadio) groupRadio.checked = true;

    // تحديث أزرار السكاشن
    updateSectionRadios(current.group, current.section);

    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.remove("opacity-0");
      if (box) box.classList.remove("scale-95");
    }, 10);

    if (window.lucide) window.lucide.createIcons();
  }

  function closeModal() {
    const modal = document.getElementById("student-profile-modal");
    const box = document.getElementById("profile-modal-box");
    if (!modal) return;

    modal.classList.add("opacity-0");
    if (box) box.classList.add("scale-95");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }

  // تحديث بادج شريط التنقل (Navbar Badge)
  function updateNavBadge() {
    const profile = window.StudentProfile.get();
    const badges = document.querySelectorAll(".student-profile-badge");
    badges.forEach((b) => {
      b.innerHTML = `
        <span class="inline-flex items-center gap-1.5">
          <i data-lucide="user" class="w-3.5 h-3.5 text-cyan-400"></i>
          <span>مجموعتي: <strong>${profile.group}</strong></span>
          <span class="opacity-40">•</span>
          <span>سكشن <strong>${profile.section}</strong></span>
        </span>
      `;
    });
    if (window.lucide) window.lucide.createIcons();
  }

  // ربط الأحداث
  document.addEventListener("DOMContentLoaded", function () {
    injectModalHTML();
    updateNavBadge();

    // استماع لتغيير المجموعة داخل المودال لتحديث أزرار السكاشن فوراً
    document.addEventListener("change", function (e) {
      if (e.target && e.target.name === "student_group") {
        updateSectionRadios(e.target.value);
      }
    });

    // إرسال النموذج وحفظ التحديد
    const form = document.getElementById("profile-selection-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const selectedGroup = form.querySelector('input[name="student_group"]:checked')?.value || "B1";
        const selectedSection = form.querySelector('input[name="student_section"]:checked')?.value || "1";

        window.StudentProfile.set(selectedGroup, selectedSection);
        localStorage.setItem(FIRST_VISIT_FLAG, "true");
        updateNavBadge();
        closeModal();
      });
    }

    // زر الإغلاق
    const closeBtn = document.getElementById("close-profile-modal");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    // أزرار فتح النافذة
    document.querySelectorAll("[data-open-profile-modal]").forEach((btn) => {
      btn.addEventListener("click", openModal);
    });

    // إغلاق عند النقر في الخلفية
    const modal = document.getElementById("student-profile-modal");
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
      });
    }

    // إذا كانت الزيارة الأولى للطالب، تفتح النافذة تلقائياً لترحيبه وتمكينه من الاختيار
    if (!localStorage.getItem(FIRST_VISIT_FLAG)) {
      setTimeout(openModal, 600);
    }
  });

  window.ProfileModal = {
    open: openModal,
    close: closeModal,
    updateNavBadge: updateNavBadge
  };
})();
