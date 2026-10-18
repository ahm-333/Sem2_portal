/**
 * ==============================================================================
 * إدارة أوضاع العرض الثلاثة (Themes): Dark / Light / Reading (Sepia)
 * ==============================================================================
 */

(function () {
  const THEME_KEY = "sem2_portal_theme";
  const THEMES = ["dark", "light", "reading"];

  // قراءة الثيم الحالي أو الافتراضي (Dark)
  function getSavedTheme() {
    return localStorage.getItem(THEME_KEY) || "dark";
  }

  // تطبيق الثيم على وسم <html>
  function applyTheme(theme) {
    if (!THEMES.includes(theme)) theme = "dark";
    
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem(THEME_KEY, theme);
    updateThemeUI(theme);
  }

  // تحديث شكل الأزرار والأيقونات حسب الثيم النشط
  function updateThemeUI(theme) {
    const buttons = document.querySelectorAll("[data-theme-btn]");
    buttons.forEach((btn) => {
      const btnTheme = btn.getAttribute("data-theme-btn");
      if (btnTheme === theme) {
        btn.classList.add("active-theme");
        btn.classList.remove("opacity-60");
      } else {
        btn.classList.remove("active-theme");
        btn.classList.add("opacity-60");
      }
    });

    // تحديث أيقونة أو نص مؤشر الثيم العام إذا وجد
    const currentThemeLabel = document.getElementById("current-theme-label");
    if (currentThemeLabel) {
      const labels = {
        dark: "الوضع الليلي 🌙",
        light: "الوضع النهاري ☀️",
        reading: "وضع القراءة 📖"
      };
      currentThemeLabel.textContent = labels[theme] || labels.dark;
    }
  }

  // التنقل السريع بين الأنماط الثلاثة
  function cycleTheme() {
    const current = getSavedTheme();
    const currentIndex = THEMES.indexOf(current);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    applyTheme(THEMES[nextIndex]);
  }

  // تطبيق الثيم فور تحميل السكربت لتفادي وميض الشاشة (Flash of unstyled content)
  const initialTheme = getSavedTheme();
  applyTheme(initialTheme);

  // ربط الأزرار بعد اكتمال تحميل الـ DOM
  document.addEventListener("DOMContentLoaded", function () {
    updateThemeUI(getSavedTheme());

    // أزرار اختيار ثيم محدد
    document.querySelectorAll("[data-theme-btn]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const targetTheme = this.getAttribute("data-theme-btn");
        applyTheme(targetTheme);
      });
    });

    // زر التبديل الدائري (إن وجد)
    const cycleBtn = document.getElementById("cycle-theme-btn");
    if (cycleBtn) {
      cycleBtn.addEventListener("click", cycleTheme);
    }
  });

  // إتاحة الدوال على window
  window.PortalTheme = {
    setTheme: applyTheme,
    cycleTheme: cycleTheme,
    getTheme: getSavedTheme
  };
})();
