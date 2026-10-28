/**
 * ==============================================================================
 * إدارة أوضاع العرض الثلاثة (Themes): Dark / Light / Reading (Sepia)
 * ==============================================================================
 */

(function () {
  const THEME_KEY = "sem2_portal_theme";
  const THEMES = ["dark", "light", "reading"];

  function getStorage() {
    if (typeof window !== "undefined" && window.PortalStorage && typeof window.PortalStorage.getItem === "function") {
      return window.PortalStorage;
    }
    return {
      getItem(key) {
        try { return window.localStorage.getItem(key); } catch (_) { return null; }
      },
      setItem(key, value) {
        try { window.localStorage.setItem(key, String(value)); return true; } catch (_) { return false; }
      }
    };
  }

  // قراءة الثيم الحالي أو الافتراضي (Light)
  function getSavedTheme() {
    try {
      const saved = getStorage().getItem(THEME_KEY);
      return THEMES.includes(saved) ? saved : "light";
    } catch (_) {
      return "light";
    }
  }

  // تطبيق الثيم على وسم <html>
  function applyTheme(theme, options = {}) {
    if (!THEMES.includes(theme)) theme = "light";
    
    const root = typeof document !== "undefined" ? document.documentElement : null;
    if (root) {
      root.setAttribute("data-theme", theme);

      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    if (options.persist !== false) {
      try {
        getStorage().setItem(THEME_KEY, theme);
      } catch (_) {
        // Storage blocked / quota fallback handled by PortalStorage
      }
    }
    updateThemeUI(theme);
  }

  // تحديث شكل الأزرار والأيقونات حسب الثيم النشط
  function updateThemeUI(theme) {
    if (typeof document === "undefined" || typeof document.querySelectorAll !== "function") return;
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
      currentThemeLabel.textContent = labels[theme] || labels.light;
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

  // مزامنة التغييرات القادمة من علامات تبويب أخرى بدون إعادة تحميل
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("storage", function (event) {
      if (!event || event.key !== THEME_KEY) return;
      const newTheme = event.newValue;
      if (!THEMES.includes(newTheme)) return;
      const currentTheme = document.documentElement ? document.documentElement.getAttribute("data-theme") : null;
      if (currentTheme === newTheme) return;
      applyTheme(newTheme, { persist: false });
    });

    // مزامنة الثيم عند العودة للصفحة عبر سجل المتصفح (BFCache / pageshow)
    window.addEventListener("pageshow", function () {
      const saved = getSavedTheme();
      const currentTheme = document.documentElement ? document.documentElement.getAttribute("data-theme") : null;
      if (currentTheme !== saved) {
        applyTheme(saved, { persist: false });
      }
    });
  }

  // ربط الأزرار بعد اكتمال تحميل الـ DOM
  if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
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
  }

  // إتاحة الدوال على window
  if (typeof window !== "undefined") {
    window.PortalTheme = {
      setTheme: applyTheme,
      cycleTheme: cycleTheme,
      getTheme: getSavedTheme
    };
  }
})();
