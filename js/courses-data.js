/**
 * ==============================================================================
 * ملَف البيانات المركزي لمنصة مواد الذكاء الاصطناعي - الترم الثاني
 * ==============================================================================
 * تم تفريغ المحتوى المؤقت ليكون جاهزاً لإضافة محتوى مادة تلو الأخرى بدقة.
 * يمكنك وضع رابط مستودع GitHub الخاص بك في CONFIG.githubRepo أدناه.
 */

const PORTAL_CONFIG = {
  githubRepo: "https://github.com/ahm-333/Sem2_portal", // مستودع المنصة على GitHub
  semester: "الترم الثاني 2026",
  faculty: "كلية الحاسبات والمعلومات - جامعة الزقازيق",
  department: "قسم الذكاء الاصطناعي (AI)"
};

const COURSES_DATA = [
  {
    id: "computer-architecture",
    code: "CS221",
    name: "Computer Architecture",
    arabicName: "معمارية الحاسوب وتنظيمه",
    shortDesc: "دراسة بنية الحاسوب الداخلية، المعالجات (CPU)، خطوط التنفيذ (Pipelining)، وتنظيم الذاكرة.",
    category: "علوم حاسب (CS)",
    accentColor: "from-blue-600 to-indigo-600",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: "cpu",
    githubRepo: "https://github.com/ahm-333/computer-architecture-study", // رابط مستودع المادة على GitHub
    
    // موقع الشرح المخصص (الأساس)
    explanationSite: {
      url: "https://ahm-333.github.io/computer-architecture-study/",
      title: "منصة الشرح التفاعلي لمعمارية وتنظيم الحاسب",
      description: "الدليل الدراسي التفاعلي الشامل لمادة معمارية الحاسوب؛ يغطي مفاهيم الـ Multicore، الـ Cache، الـ ISA، والـ ALU مع أوضاع قراءة مريحة للعين ونظام تتبع نسبة الإنجاز.",
      status: "متاح الآن",
      features: [
        "دليل تفاعلي متكامل لفصول ومفاهيم المعمارية",
        "أوضاع قراءة ورقية وداكنة مريحة للعين (Reading / Dark / Light)",
        "نظام تتبع نسبة إنجاز المذاكرة ومحرك بحث فوري"
      ]
    },

    lectures: [
      {
        id: 1,
        chapter: "Chapter 1",
        title: "Basic Concepts and Computer Evolution",
        arabicTitle: "المفاهيم الأساسية وتطور الحاسوب",
        doctor: "د. نبيل لاشين",
        doctorNote: "B1 • B2 • B3",
        week: 1,
        date: "المحاضرة 1",
        pages: 57,
        size: "2.4 MB",
        pdfUrl: "materials/arch/Arch_Lecture_01_Chapter1_Basic_Concepts.pdf",
        studyManualUrl: "https://ahm-333.github.io/computer-architecture-study/",
        topics: [
          "Computer Architecture vs Organization",
          "Structure & Function",
          "Multicore Computer Structure",
          "IAS Computer & Registers",
          "Computer Generations",
          "Moore's Law",
          "Embedded Systems & ARM",
          "Cloud Computing"
        ],
        notes: "سلايدات William Stallings - 10th Edition"
      },
      {
        id: 2,
        chapter: "Chapter 3",
        title: "A Top-Level View of Computer Function and Interconnection",
        arabicTitle: "نظرة عامة على وظائف الحاسوب والتوصيلات الداخلية",
        doctor: "د. نبيل لاشين",
        doctorNote: "B1 • B2 • B3",
        week: 2,
        date: "المحاضرة 2",
        pages: 46,
        size: "3.2 MB",
        pdfUrl: "materials/arch/Arch_Lecture_02_Chapter3_Computer_Function_Interconnection.pdf",
        studyManualUrl: "https://ahm-333.github.io/computer-architecture-study/",
        topics: [
          "Computer Components & Function",
          "Instruction Cycle",
          "Interrupts",
          "Interconnection Structures",
          "Data / Address / Control Bus",
          "QPI",
          "PCI Express"
        ],
        notes: "فيها ملاحظات الدكتور باللون الأحمر (My notes are in red)"
      },
      {
        id: 3,
        chapter: "Chapter 4",
        title: "Cache Memory",
        arabicTitle: "الذاكرة المخبأة (الكاش)",
        doctor: "د. نبيل لاشين",
        doctorNote: "B1 • B2 • B3",
        week: 3,
        date: "المحاضرة 3",
        pages: 56,
        size: "2.7 MB",
        pdfUrl: "materials/arch/Arch_Lecture_03_Chapter4_Cache_Memory.pdf",
        studyManualUrl: "https://ahm-333.github.io/computer-architecture-study/",
        topics: [
          "Memory Hierarchy & Locality",
          "Cache Principles",
          "Mapping Function",
          "Direct Mapping",
          "Fully Associative Mapping",
          "Set Associative (4-way example)",
          "Replacement Algorithms",
          "Write Policy",
          "Line Size"
        ],
        notes: "فيها أمثلة على الـ Mapping وملاحظات الدكتور"
      },
      {
        id: 4,
        chapter: "Chapter 5",
        title: "Internal Memory",
        arabicTitle: "الذاكرة الداخلية",
        doctor: "د. نبيل لاشين",
        doctorNote: "B1 • B2 • B3",
        week: 4,
        date: "المحاضرة 4",
        pages: 38,
        size: "2.3 MB",
        pdfUrl: "materials/arch/Arch_Lecture_04_Chapter5_Internal_Memory.pdf",
        studyManualUrl: "https://ahm-333.github.io/computer-architecture-study/",
        topics: [
          "Semiconductor Main Memory",
          "DRAM vs SRAM",
          "Read-Mostly Memory (ROM types)",
          "Flash Memory",
          "Interleaved Memory",
          "Synchronous DRAM (SDRAM)",
          "DDR"
        ],
        notes: "سلايدات William Stallings - 10th Edition"
      }
    ],
    sections: [],
    assignments: [],
    resources: []
  },

  {
    id: "computer-graphics",
    code: "CS222",
    name: "Computer Graphics",
    arabicName: "رسم بالحاسوب",
    shortDesc: "الرسم الثنائي وثلاثي الأبعاد، خوارزميات رسم الخطوط والدوائر، OpenGL، والتحويلات الهندسية.",
    category: "ذكاء اصطناعي وحاسب (AI/CS)",
    accentColor: "from-pink-500 to-rose-600",
    badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    icon: "palette",
    githubRepo: "https://github.com/your-username/computer-graphics",

    explanationSite: {
      url: "#",
      title: "موقع الشرح التفاعلي لمادة رسم بالحاسوب",
      description: "جارٍ ربط وتجهيز موقع الشرح التفاعلي الخاص بالمادة...",
      status: "قريباً",
      features: [
        "مختبر تفاعلي لتجربة خوارزميات الرسم مباشرة",
        "محاكي بصري للتحويلات الهندسية",
        "أمثلة برمجية مباشرة باستخدام WebGL / OpenGL"
      ]
    },

    lectures: [],
    sections: [],
    assignments: [],
    resources: []
  },

  {
    id: "database-systems",
    code: "IS211",
    name: "Data base system",
    arabicName: "أنظمة قواعد البيانات",
    shortDesc: "تصميم قواعد البيانات، مخططات ERD، التطبيع (Normalization)، وكتابة استعلامات SQL المتقدمة.",
    category: "نظم معلومات (IS/AI)",
    accentColor: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: "database",
    githubRepo: "https://github.com/your-username/database-systems",

    explanationSite: {
      url: "#",
      title: "موقع الشرح التفاعلي لقواعد البيانات و SQL",
      description: "جارٍ ربط وتجهيز موقع الشرح التفاعلي الخاص بالمادة...",
      status: "قريباً",
      features: [
        "محرر SQL تفاعلي لتجربة الاستعلامات مع بيانات جاهزة",
        "شرح مرئي مبسط لخطوات الـ Normalization",
        "أدلة تصميم مخططات العلاقات ERD خطوة بخطوة"
      ]
    },

    lectures: [],
    sections: [],
    assignments: [],
    resources: []
  },

  {
    id: "data-structure",
    code: "CS213",
    name: "data structure",
    arabicName: "تراكيب البيانات والخوارزميات",
    shortDesc: "هياكل البيانات الأساسية: Arrays, Linked Lists, Stacks, Queues, Trees, Graphs وتحليل الكفاءة (Big O).",
    category: "أساسيات حاسب وذكاء اصطناعي (Core CS)",
    accentColor: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: "network",
    githubRepo: "https://github.com/your-username/data-structures",

    explanationSite: {
      url: "#",
      title: "موقع الشرح التفاعلي لتراكيب البيانات",
      description: "جارٍ ربط وتجهيز موقع الشرح التفاعلي الخاص بالمادة...",
      status: "قريباً",
      features: [
        "محاكاة بصرية حية للعمليات على القوائم والأشجار (Visualizer)",
        "تحليل زمني ومكاني تفصيلي لتعقيد الخوارزميات",
        "مسائل تدريبية برمجية تدريجية"
      ]
    },

    lectures: [],
    sections: [],
    assignments: [],
    resources: []
  },

  {
    id: "operating-system",
    code: "CS214",
    name: "operating system",
    arabicName: "أنظمة التشغيل",
    shortDesc: "إدارة العمليات (Processes)، الخيوط (Threads)، جدولة المعالج (CPU Scheduling)، وإدارة الذاكرة ومشاكل الـ Deadlock.",
    category: "علوم حاسب (CS)",
    accentColor: "from-purple-600 to-indigo-700",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: "terminal",
    githubRepo: "https://github.com/your-username/operating-systems",

    explanationSite: {
      url: "#",
      title: "موقع الشرح التفاعلي لأنظمة التشغيل",
      description: "جارٍ ربط وتجهيز موقع الشرح التفاعلي الخاص بالمادة...",
      status: "قريباً",
      features: [
        "محاكي رسومي تفاعلي لخوارزميات الجدولة",
        "شرح آليات التزامن ومشاكل الـ Race Conditions والـ Deadlocks",
        "دليل أوامر طرفية Linux Shell وكتابة الـ System Calls"
      ]
    },

    lectures: [],
    sections: [],
    assignments: [],
    resources: []
  },

  {
    id: "report-writing",
    code: "HUM201",
    name: "Report writing",
    arabicName: "كتابة التقارير الفنية والأكاديمية",
    shortDesc: "مهارات الصياغة الأكاديمية والمهنية، توثيق المشاريع البرمجية، كتابة المراجع العلمية، وتجهيز العروض التقديمية.",
    category: "متطلبات عامة ومهارات (General Skills)",
    accentColor: "from-cyan-600 to-blue-700",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    icon: "file-text",
    githubRepo: "https://github.com/your-username/report-writing",

    explanationSite: {
      url: "#",
      title: "دليل كتابة التقارير الفنية والأكاديمية",
      description: "جارٍ ربط وتجهيز موقع الشرح التفاعلي الخاص بالمادة...",
      status: "قريباً",
      features: [
        "قوالب جاهزة للتقارير الهندسية ومشاريع التخرج (Word & LaTeX)",
        "شرح أساليب التوثيق وكتابة المراجع العلمية (IEEE و APA)",
        "أخطاء شائعة في الصياغة وتجنب الانتحال العلمي (Plagiarism)"
      ]
    },

    lectures: [],
    sections: [],
    assignments: [],
    resources: []
  }
];

if (typeof window !== "undefined") {
  window.PORTAL_CONFIG = PORTAL_CONFIG;
  window.COURSES_DATA = COURSES_DATA;
}
