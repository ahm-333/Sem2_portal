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
        arabicTitle: "المفاهيم الأساسية، بنية فون نيومان وتطور أجيال الحاسوب والمعالجات",
        doctor: "د. نبيل لاشين",
        doctorNote: "مشترك لمجموعات B1, B2, B3",
        week: 1,
        date: "المحاضرة 1",
        pages: 57,
        size: "2.4 MB",
        pdfUrl: "materials/arch/Arch_Lecture_01_Chapter1_Basic_Concepts.pdf",
        slidesUrl: "materials/arch/Arch_Lecture_01_Chapter1_Basic_Concepts.pdf",
        studyManualUrl: "https://ahm-333.github.io/computer-architecture-study/",
        topics: [
          "الفرق بين معمارية وتنظيم الحاسوب (Architecture vs Organization)",
          "البنية الهرمية والوظائف الأربعة (Data processing, Storage, Movement, Control)",
          "حاسوب IAS ومفهوم البرامج المخزنة لعالم الرياضيات فون نيومان (Von Neumann)",
          "مسجلات IAS: MBR, MAR, IR, IBR, PC, AC, MQ ومخطط دورة العمليات",
          "أجيال الحاسبات من الصمامات المفرغة إلى الدوائر المتكاملة الفائقة (ULSI)",
          "قانون مور (Moore's Law) وتطور معالجات Intel (من 4004 إلى Core i7 EE)",
          "الأنظمة المدمجة (Embedded Systems)، معمارية ARM، وإنترنت الأشياء (IoT)",
          "مفاهيم الحوسبة السحابية (IaaS, PaaS, SaaS)"
        ],
        notes: "سلايدات ويليام ستالينجز الرسمية (William Stallings 10th Ed) المعتمدة من د. نبيل لاشين."
      },
      {
        id: 2,
        chapter: "Chapter 3",
        title: "A Top-Level View of Computer Function and Interconnection",
        arabicTitle: "نظرة عليا على وظائف الحاسوب، دورة التنفيذ، المقاطعات وممرات النقل",
        doctor: "د. نبيل لاشين",
        doctorNote: "تتضمن ملاحظات وشروحات الدكتور باللون الأحمر (My notes in red)",
        week: 2,
        date: "المحاضرة 2",
        pages: 46,
        size: "3.2 MB",
        pdfUrl: "materials/arch/Arch_Lecture_02_Chapter3_Computer_Function_Interconnection.pdf",
        slidesUrl: "materials/arch/Arch_Lecture_02_Chapter3_Computer_Function_Interconnection.pdf",
        studyManualUrl: "https://ahm-333.github.io/computer-architecture-study/",
        topics: [
          "مكونات الحاسوب الرئيسية (CPU, Main Memory, I/O Modules, System Bus)",
          "دورة جلب وتنفيذ التعليمات (Fetch Cycle & Execute Cycle)",
          "أصناف المقاطعات الأربعة (Program, Timer, I/O, Hardware failure)",
          "دورة التعليمات مع المقاطعات وكيفية عمل الـ Interrupt Handler",
          "مخططات التوقيت للعمليات المتزامنة وحالات الانتظار القصيرة والطويلة",
          "ممرات النظام الثلاثة: Data Bus (العرض والأداء), Address Bus, Control Bus",
          "توصيلات Point-to-Point وتقنية QPI (طبقات Protocol, Routing, Link, Physical)",
          "معمارية وبروتوكولات PCI Express وحزم الـ TLP والـ DLLP"
        ],
        notes: "سلايدات مركزة ومعدلة بملاحظات د. نبيل لاشين الحمراء التوضيحية لتسهيل استيعاب المقاطعات والـ Bus."
      },
      {
        id: 3,
        chapter: "Chapter 4",
        title: "Cache Memory",
        arabicTitle: "الذاكرة المخبأة (كاش): مبادئ الموضعية، طرق التخطيط، والمسائل المحلولة",
        doctor: "د. نبيل لاشين",
        doctorNote: "تحتوي على مسائل تدريبية محلولة هامة جداً للامتحانات",
        week: 3,
        date: "المحاضرة 3",
        pages: 56,
        size: "2.7 MB",
        pdfUrl: "materials/arch/Arch_Lecture_03_Chapter4_Cache_Memory.pdf",
        slidesUrl: "materials/arch/Arch_Lecture_03_Chapter4_Cache_Memory.pdf",
        studyManualUrl: "https://ahm-333.github.io/computer-architecture-study/",
        topics: [
          "مبدأ الموضعية الزمانية والمكانية (Temporal & Spatial Locality)",
          "الهرمية التخزينية (Memory Hierarchy) وتكلفة وسرعة الوصول والـ Hit Ratio",
          "حسابات الكاش ميس والكاش هيت وأزمنة الوصول (Access time, Latency)",
          "طرق التخطيط الثلاثة بالتفصيل: Direct Mapping, Fully Associative, Set-Associative",
          "قوانين حسابات الحقول: Tag, Index (Line), Offset (Byte)",
          "مسائل عملية محلولة على ذاكرة 4GB ومعالجات Intel Core i7",
          "خوارزميات الاستبدال (LRU, FIFO, LFU, Random) ومفهوم الـ Thrashing",
          "سياسات الكتابة (Write-Through vs Write-Back) ومعالجة الـ Dirty Bit",
          "الكاش متعدد المستويات (L1, L2, L3) والـ Unified vs Split Cache"
        ],
        notes: "محاضرة أساسية تتضمن كافة القوانين والمسائل المحلولة لحسابات الـ Tag والـ Index في الامتحانات."
      },
      {
        id: 4,
        chapter: "Chapter 5",
        title: "Internal Memory",
        arabicTitle: "الذاكرة الداخلية: مقارنة DRAM وSRAM، تصحيح الأخطاء (Hamming) وSDRAM",
        doctor: "د. نبيل لاشين",
        doctorNote: "شرح شامل للذواكر وتطبيقات كود هامينج",
        week: 4,
        date: "المحاضرة 4",
        pages: 38,
        size: "2.3 MB",
        pdfUrl: "materials/arch/Arch_Lecture_04_Chapter5_Internal_Memory.pdf",
        slidesUrl: "materials/arch/Arch_Lecture_04_Chapter5_Internal_Memory.pdf",
        studyManualUrl: "https://ahm-333.github.io/computer-architecture-study/",
        topics: [
          "أنواع ذواكر أشباه الموصلات (Semiconductor Memory Types)",
          "المقارنة الجوهرية بين Dynamic RAM (DRAM) و Static RAM (SRAM)",
          "أنواع ذواكر القراءة فقط: ROM, PROM, EPROM, EEPROM",
          "ذاكرة الفلاش (Flash Memory) والمقارنة الرادارية بين NOR و NAND",
          "تنظيم الشرائح وتوزيع الذاكرة المتشابكة (Interleaved Memory Banks)",
          "تصحيح الأخطاء: Hard Failure مقابل Soft Error",
          "كود هامينج لتصحيح الخطأ الفردي واكتشاف الزوجي (Hamming SEC-DED Code)",
          "تطور ذواكر SDRAM وأجيال DDR1 إلى DDR4 والذواكر غير المتطايرة (ReRAM, PCRAM, STT-RAM)"
        ],
        notes: "سلايدات تفصيلية لتصنيف وتكوين الذواكر الداخلية وخوارزمية فحص وحساب بتات كود هامينج."
      }
    ],
    sections: [],
    assignments: [],
    resources: [
      {
        id: "book-william-stallings",
        title: "William Stallings - Computer Organization and Architecture (10th Edition)",
        type: "الكتاب المعتمد",
        year: "المرجع الأصلي",
        size: "الكتاب كاملاً",
        fileUrl: "https://ahm-333.github.io/computer-architecture-study/",
        desc: "المرجع الدراسي الدولي المعتمد لمقرر تنظيم ومعمارية الحاسوب بالكلية."
      },
      {
        id: "interactive-study-manual",
        title: "منصة الشرح والمذاكرة التفاعلية الشاملة (Live Study Manual)",
        type: "موقع تفاعلي",
        year: "2026",
        size: "Web App",
        fileUrl: "https://ahm-333.github.io/computer-architecture-study/",
        desc: "الدليل التفاعلي الكامل للفصول والمفاهيم مع إمكانية البحث الفوري واختبارات الفهم الذاتي."
      }
    ]
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
