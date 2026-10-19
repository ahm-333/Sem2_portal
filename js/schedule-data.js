/**
 * ==============================================================================
 * بيانات الجدول الدراسي الموحد وقسم الذكاء الاصطناعي - جامعة الزقازيق
 * ==============================================================================
 * المجموعات: B1 (سكاشن 1-4) | B2 (سكاشن 5-8) | B3 (سكاشن 9-12)
 * مستخرجة بدقة من جدول الكلية المعتمد للترم الثاني 2026
 */

const SCHEDULE_CONFIG = {
  groups: {
    B1: { id: "B1", name: "مجموعة B1", sections: [1, 2, 3, 4] },
    B2: { id: "B2", name: "مجموعة B2", sections: [5, 6, 7, 8] },
    B3: { id: "B3", name: "مجموعة B3", sections: [9, 10, 11, 12] }
  },

  // بيانات الدكاترة والمحاضرات حسب المجموعة
  doctorsByGroup: {
    "computer-architecture": {
      B1: {
        doctor: "أ.د. نبيل علي محمد علي لاشين",
        time: "السبت • الفترة الرابعة (1:45 - 3:15)",
        hall: "مدرج الإدريسي"
      },
      B2: {
        doctor: "أ.د. نبيل علي محمد علي لاشين",
        time: "الثلاثاء • الفترة الأولى (8:30 - 10:00)",
        hall: "قاعة الدور الثالث"
      },
      B3: {
        doctor: "أ.د. نبيل علي لاشين - د. أحمد سامي عبد السلام",
        time: "السبت • الفترة الأولى (8:30 - 10:00)",
        hall: "مدرج الخوارزمي"
      }
    },

    "computer-graphics": {
      B1: {
        doctor: "د. ياسمين خضر",
        time: "الثلاثاء • الفترة الثالثة (12:00 - 1:30)",
        hall: "مدرج الإدريسي"
      },
      B2: {
        doctor: "د. ياسمين خضر",
        time: "الأحد • الفترة الرابعة (1:45 - 3:15)",
        hall: "مدرج الإدريسي"
      },
      B3: {
        doctor: "أ.د. خالد محمد حسني - د. صفا السعيد عبد الكريم",
        time: "السبت • الفترة الثالثة (12:00 - 1:30)",
        hall: "مدرج الخوارزمي"
      }
    },

    "database-systems": {
      B1: {
        doctor: "أ.د. نبيل مصطفى - د. أحمد سامي عبد السلام",
        time: "الثلاثاء • الفترة الأولى (8:30 - 10:00)",
        hall: "مدرج 3"
      },
      B2: {
        doctor: "أ.د. نبيل مصطفى - د. أحمد سامي عبد السلام",
        time: "الثلاثاء • الفترة الثانية (10:15 - 11:45)",
        hall: "مدرج 3"
      },
      B3: {
        doctor: "أ.د. أحمد سامي محمد عبد السلام",
        time: "السبت • الفترة الثانية (10:15 - 11:45)",
        hall: "مدرج زويل"
      }
    },

    "data-structure": {
      B1: {
        doctor: "د. ليلى عبد الفتاح شوقي إبراهيم",
        time: "الخميس • الفترة الأولى (8:30 - 10:00)",
        hall: "مدرج الإدريسي"
      },
      B2: {
        doctor: "د. أحمد صلاح عبد المطلب",
        time: "الأحد • الفترة الأولى (8:30 - 10:00)",
        hall: "مدرج زويل"
      },
      B3: {
        doctor: "د. أحمد صلاح عبد المطلب",
        time: "الأربعاء • الفترة الأولى (8:30 - 10:00)",
        hall: "مدرج الإدريسي"
      }
    },

    "operating-system": {
      B1: {
        doctor: "د. شروق الأمير محمد عطيه",
        time: "الخميس • الفترة الثانية (10:15 - 11:45)",
        hall: "مدرج زويل"
      },
      B2: {
        doctor: "د. شروق الأمير محمد عطيه",
        time: "الخميس • الفترة الثالثة (12:00 - 1:30)",
        hall: "مدرج زويل"
      },
      B3: {
        doctor: "د. شروق الأمير محمد عطيه الشاذلي",
        time: "الاثنين • الفترة الثانية (10:15 - 11:45)",
        hall: "المدرج الرئيسي"
      }
    },

    "report-writing": {
      B1: {
        doctor: "د. سمر لطفي عبد العزيز الحاوي",
        time: "الثلاثاء • الفترة الرابعة (1:45 - 3:15)",
        hall: "مدرج 1"
      },
      B2: {
        doctor: "د. صفا السعيد محمد عبد الكريم",
        time: "الأحد • الفترة الثانية (10:15 - 11:45)",
        hall: "المدرج الرئيسي"
      },
      B3: {
        doctor: "هيئة التدريس - قسم التقارير",
        time: "السبت • الفترة الرابعة (1:45 - 3:15)",
        hall: "المدرج الرئيسي"
      }
    }
  },

  // بيانات المعيدين والسكاشن حسب كل سكشن (1 إلى 12)
  tasBySection: {
    // ----------------- مجموعة B1 -----------------
    1: {
      "database-systems": { ta: "م.م. ميرنا مجدي محمد حلمي الفخراني", slot: "السبت • 8:30 - 10:00", room: "معمل M2" },
      "operating-system": { ta: "م. أحمد شكري", slot: "السبت • 12:00 - 1:30", room: "م15" },
      "computer-architecture": { ta: "م.م. أمل مجدي", slot: "الاثنين • 8:30 - 10:00", room: "م16" },
      "data-structure": { ta: "م.م. أحمد حسام سلامه درويش الحداد", slot: "الاثنين • 12:00 - 1:30", room: "م12" },
      "computer-graphics": { ta: "م. شيماء مجدي عبد المنعم بنديري", slot: "الثلاثاء • 10:15 - 11:45", room: "م19" }
    },
    2: {
      "database-systems": { ta: "م.م. ميرنا مجدي محمد حلمي الفخراني", slot: "السبت • 10:15 - 11:45", room: "معمل M2" },
      "computer-architecture": { ta: "م.م. أمل مجدي", slot: "السبت • 3:30 - 5:00", room: "م20" },
      "data-structure": { ta: "م.م. أحمد حسام سلامه درويش الحداد", slot: "الثلاثاء • 3:30 - 5:00", room: "م16" },
      "computer-graphics": { ta: "م. شيماء مجدي عبد المنعم بنديري", slot: "الأربعاء • 8:30 - 10:00", room: "معمل M3" },
      "operating-system": { ta: "م. أحمد شكري", slot: "الأربعاء • 10:15 - 11:45", room: "م6" }
    },
    3: {
      "data-structure": { ta: "م. هاجر جمال", slot: "السبت • 10:15 - 11:45", room: "م2" },
      "database-systems": { ta: "م.م. ميرنا مجدي محمد حلمي الفخراني", slot: "السبت • 3:30 - 5:00", room: "معمل M2" },
      "computer-architecture": { ta: "م. تقى مصطفى", slot: "الثلاثاء • 10:15 - 11:45", room: "م9" },
      "computer-graphics": { ta: "م. شيماء مجدي عبد المنعم بنديري", slot: "الثلاثاء • 3:30 - 5:00", room: "م19" },
      "operating-system": { ta: "م. أحمد شكري", slot: "الخميس • 1:45 - 3:15", room: "م6" }
    },
    4: {
      "computer-graphics": { ta: "م. شيماء مجدي عبد المنعم بنديري", slot: "السبت • 8:30 - 10:00", room: "م6" },
      "operating-system": { ta: "م.م. عبد الرحمن فتحي عبد الرحمن صومع", slot: "السبت • 10:15 - 11:45", room: "معمل M3" },
      "database-systems": { ta: "م.م. ميرنا مجدي محمد حلمي الفخراني", slot: "السبت • 12:00 - 1:30", room: "معمل M2" },
      "computer-architecture": { ta: "م. تقى مصطفى", slot: "الثلاثاء • 3:30 - 5:00", room: "م9" },
      "data-structure": { ta: "م. أحمد شكري", slot: "الخميس • 12:00 - 1:30", room: "م6" }
    },

    // ----------------- مجموعة B2 -----------------
    5: {
      "data-structure": { ta: "م. أحمد شكري", slot: "السبت • 8:30 - 10:00", room: "م19" },
      "operating-system": { ta: "م. أحمد شكري", slot: "السبت • 10:15 - 11:45", room: "م19" },
      "database-systems": { ta: "م.م. ميرنا مجدي محمد حلمي الفخراني", slot: "السبت • 1:45 - 3:15", room: "معمل M2" },
      "computer-architecture": { ta: "م.م. أمل مجدي", slot: "الأحد • 3:30 - 5:00", room: "م11" },
      "computer-graphics": { ta: "م. آية عطيه", slot: "الخميس • 10:15 - 11:45", room: "م16" }
    },
    6: {
      "computer-graphics": { ta: "م. رحمه أحمد", slot: "الأحد • 3:30 - 5:00", room: "معمل الذكاء الاصطناعي" },
      "computer-graphics-2": { ta: "م. آية عطيه", slot: "الأربعاء • 10:15 - 11:45", room: "م15" },
      "operating-system": { ta: "م.م. عبد الرحمن فتحي عبد الرحمن صومع", slot: "الأربعاء • 12:00 - 1:30", room: "م18" },
      "computer-architecture": { ta: "م.م. أمل مجدي", slot: "الأربعاء • 1:45 - 3:15", room: "م11" },
      "database-systems": { ta: "م.م. حسن حسن محمد محمد", slot: "الأربعاء • 3:30 - 5:00", room: "م14" },
      "data-structure": { ta: "م. أحمد شكري", slot: "الخميس • 8:30 - 10:00", room: "م6" }
    },
    7: {
      "operating-system": { ta: "م.م. عبد الرحمن فتحي عبد الرحمن صومع", slot: "الأحد • 3:30 - 5:00", room: "م15" },
      "computer-architecture": { ta: "م. تقى مصطفى", slot: "الثلاثاء • 12:00 - 1:30", room: "م9" },
      "database-systems": { ta: "م.م. حسن حسن محمد محمد", slot: "الثلاثاء • 3:30 - 5:00", room: "م4" },
      "operating-system-2": { ta: "م.م. عبد الرحمن فتحي عبد الرحمن صومع", slot: "الخميس • 8:30 - 10:00", room: "م20" },
      "data-structure": { ta: "م. فاطمة محمود", slot: "الخميس • 10:15 - 11:45", room: "معمل الذكاء الاصطناعي" }
    },
    8: {
      "computer-architecture": { ta: "م. تقى مصطفى", slot: "الاثنين • 8:30 - 10:00", room: "معمل M3" },
      "data-structure": { ta: "م. فاطمة محمود", slot: "الاثنين • 10:15 - 11:45", room: "معمل الذكاء الاصطناعي" },
      "computer-graphics": { ta: "م. رحمه أحمد", slot: "الثلاثاء • 12:00 - 1:30", room: "م6" },
      "database-systems": { ta: "م.م. حسن حسن محمد محمد", slot: "الخميس • 10:15 - 11:45", room: "م14" }
    },

    // ----------------- مجموعة B3 -----------------
    9: {
      "operating-system": { ta: "م.م. عبد الرحمن فتحي عبد الرحمن صومع", slot: "الأحد • 8:30 - 10:00", room: "م19" },
      "computer-graphics": { ta: "م. آية عطيه", slot: "الأحد • 12:00 - 1:30", room: "م16" },
      "computer-architecture": { ta: "م.م. أمل مجدي", slot: "الاثنين • 12:00 - 1:30", room: "م16" },
      "data-structure": { ta: "م. فاطمة محمود", slot: "الأربعاء • 12:00 - 1:30", room: "معمل الذكاء الاصطناعي" },
      "database-systems": { ta: "م.م. حسن حسن محمد محمد", slot: "الأربعاء • 1:45 - 3:15", room: "م14" }
    },
    10: {
      "operating-system": { ta: "م. أحمد شكري", slot: "السبت • 3:30 - 5:00", room: "م15" },
      "data-structure": { ta: "م. فاطمة محمود", slot: "الاثنين • 8:30 - 10:00", room: "معمل الذكاء الاصطناعي" },
      "database-systems": { ta: "م.م. حسن حسن محمد محمد", slot: "الثلاثاء • 10:15 - 11:45", room: "م4" },
      "computer-graphics": { ta: "م. آية عطيه", slot: "الثلاثاء • 12:00 - 1:30", room: "م2" },
      "computer-architecture": { ta: "م. شاهده أحمد", slot: "الأربعاء • 12:00 - 1:30", room: "م16" },
      "operating-system-2": { ta: "م.م. عبد الرحمن فتحي عبد الرحمن صومع", slot: "الأربعاء • 1:45 - 3:15", room: "م18" }
    },
    11: {
      "computer-architecture": { ta: "م. شاهده أحمد", slot: "الاثنين • 8:30 - 10:00", room: "م9" },
      "database-systems": { ta: "م.م. حسن حسن محمد محمد", slot: "الأربعاء • 12:00 - 1:30", room: "م14" },
      "data-structure": { ta: "م. فاطمة محمود", slot: "الأربعاء • 1:45 - 3:15", room: "معمل الذكاء الاصطناعي" },
      "computer-graphics": { ta: "م. رحمه أحمد", slot: "الأربعاء • 3:30 - 5:00", room: "معمل M1" }
    },
    12: {
      "computer-architecture": { ta: "م. شاهده أحمد", slot: "الاثنين • 12:00 - 1:30", room: "م9" },
      "data-structure": { ta: "م. فاطمة محمود", slot: "الاثنين • 3:30 - 5:00", room: "معمل الذكاء الاصطناعي" },
      "database-systems": { ta: "م.م. حسن حسن محمد محمد", slot: "الأربعاء • 10:15 - 11:45", room: "م14" },
      "computer-graphics": { ta: "م. رحمه أحمد", slot: "الأربعاء • 1:45 - 3:15", room: "معمل M1" },
      "operating-system": { ta: "م.م. عبد الرحمن فتحي عبد الرحمن صومع", slot: "الأربعاء • 3:30 - 5:00", room: "م18" }
    }
  }
};

// إدارة حالة اختيار الطالب وحفظها في localStorage
const StudentProfile = {
  KEY: "sem2_student_profile",

  get() {
    try {
      const saved = localStorage.getItem(this.KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // افتراضي: B1 و سكشن 1
    return { group: "B1", section: 1 };
  },

  set(group, section) {
    const data = { group: String(group), section: parseInt(section, 10) };
    localStorage.setItem(this.KEY, JSON.stringify(data));
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function" && typeof CustomEvent !== "undefined") {
      window.dispatchEvent(new CustomEvent("studentProfileChanged", { detail: data }));
    }
  },

  // دالة لتنظيف وتوحيد أسماء المعيدين والألقاب لتسهيل المطابقة الدقيقة
  normalizeArabic(text) {
    if (!text) return "";
    return text
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/[\u064B-\u065F\u0670]/g, "") // remove diacritics
      .replace(/م\.م\./g, "")
      .replace(/م\./g, "")
      .replace(/د\./g, "")
      .replace(/أ\.د\./g, "")
      .replace(/مهندس[ة]?/g, "")
      .replace(/دكتور[ة]?/g, "")
      .replace(/\s+/g, " ")
      .trim();
  },

  // دالة للتحقق من مطابقة اسم المعيد الخاص بالسكشن مع معيد الملف أو السكشن
  isTaMatch(itemTa, studentTa) {
    if (!itemTa || !studentTa) return false;
    if (itemTa === "all" || studentTa === "all") return true;

    const n1 = this.normalizeArabic(itemTa);
    const n2 = this.normalizeArabic(studentTa);

    if (n1 === n2 || n1.includes(n2) || n2.includes(n1)) return true;

    // معالجة الكلمات المميزة الخاصة بكل معيد لمنع تداخل الأسماء المتشابهة (مثل أحمد حسام مقابل أحمد شكري)
    const distinctiveNames = [
      { key: "تقي", check: (s) => s.includes("تقي") },
      { key: "امل", check: (s) => s.includes("امل") },
      { key: "شاهده", check: (s) => s.includes("شاهده") },
      { key: "احمد حسام", check: (s) => s.includes("حسام") || (s.includes("احمد") && s.includes("حسام")) },
      { key: "احمد شكري", check: (s) => s.includes("شكري") || (s.includes("احمد") && s.includes("شكري")) },
      { key: "هاجر", check: (s) => s.includes("هاجر") },
      { key: "فاطمه", check: (s) => s.includes("فاطمه") },
      { key: "شيماء", check: (s) => s.includes("شيماء") },
      { key: "ميرنا", check: (s) => s.includes("ميرنا") },
      { key: "صومع", check: (s) => s.includes("صومع") },
      { key: "حسن", check: (s) => s.includes("حسن") },
      { key: "ايه", check: (s) => s.includes("ايه") },
      { key: "رحمه", check: (s) => s.includes("رحمه") }
    ];

    for (const item of distinctiveNames) {
      if (item.check(n1) && item.check(n2)) return true;
    }

    return false;
  },

  // دالة لجلب معلومات الدكتور والمعيد الخاصة بمادة معينة بناءً على البروفايل
  getCourseStaff(courseId) {
    const profile = this.get();
    const groupDoctors = SCHEDULE_CONFIG.doctorsByGroup[courseId] || {};
    const doctorInfo = groupDoctors[profile.group] || {
      doctor: "د. أستاذ المادة",
      time: "مواعيد المحاضرة",
      hall: "المدرج"
    };

    const sectionTAs = SCHEDULE_CONFIG.tasBySection[profile.section] || {};
    const taInfo = sectionTAs[courseId] || {
      ta: "م. معيد السكشن",
      slot: "مواعيد السكشن",
      room: "المعمل"
    };

    return {
      group: profile.group,
      section: profile.section,
      doctor: doctorInfo.doctor,
      lectureTime: doctorInfo.time,
      lectureHall: doctorInfo.hall,
      ta: taInfo.ta,
      sectionSlot: taInfo.slot,
      sectionRoom: taInfo.room
    };
  },

  // دالة لجلب الجدول الأسبوعي الكامل للطالب المختار مرتباً حسب الأيام
  getWeeklySchedule() {
    const profile = this.get();
    const days = [
      { key: "sat", name: "السبت", items: [] },
      { key: "sun", name: "الأحد", items: [] },
      { key: "mon", name: "الاثنين", items: [] },
      { key: "tue", name: "الثلاثاء", items: [] },
      { key: "wed", name: "الأربعاء", items: [] },
      { key: "thu", name: "الخميس", items: [] }
    ];

    // إضافة المحاضرات حسب المجموعة
    const courses = window.COURSES_DATA || [];
    courses.forEach((c) => {
      const doc = (SCHEDULE_CONFIG.doctorsByGroup[c.id] || {})[profile.group];
      if (doc && doc.time) {
        const dayMatch = days.find((d) => doc.time.includes(d.name));
        if (dayMatch) {
          dayMatch.items.push({
            type: "lecture",
            typeLabel: "محاضرة نظري",
            courseName: c.name,
            arabicName: c.arabicName,
            code: c.code,
            time: doc.time.replace(/.*•\s*/, ""),
            place: doc.hall,
            instructor: doc.doctor,
            accentColor: c.accentColor
          });
        }
      }

      // إضافة السكاشن حسب السكشن
      const tasObj = SCHEDULE_CONFIG.tasBySection[profile.section] || {};
      const taData = tasObj[c.id];
      if (taData && taData.slot) {
        const dayMatch = days.find((d) => taData.slot.includes(d.name));
        if (dayMatch) {
          dayMatch.items.push({
            type: "section",
            typeLabel: "سكشن عملي",
            courseName: c.name,
            arabicName: c.arabicName,
            code: c.code,
            time: taData.slot.replace(/.*•\s*/, ""),
            place: taData.room,
            instructor: taData.ta,
            accentColor: c.accentColor
          });
        }
      }
    });

    return days;
  }
};

// تصدير للـ Window و Node.js
if (typeof window !== "undefined") {
  window.SCHEDULE_CONFIG = SCHEDULE_CONFIG;
  window.StudentProfile = StudentProfile;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SCHEDULE_CONFIG, StudentProfile };
}
