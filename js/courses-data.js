/**
 * ==============================================================================
 * ملَف البيانات المركزي لمنصة مواد الذكاء الاصطناعي - الترم الثاني
 * ==============================================================================
 * يتضمن روابط Google Drive المباشرة لجميع المحاضرات بدون الحاجة لتحميلها محلياً،
 * بالإضافة لقوائم تشغيل وشروحات الفيديو والمواقع التفاعلية لكل مادة.
 */

const PORTAL_CONFIG = {
  creator: "Eng. Ahmed Amir",
  creatorArabic: "أحمد أمير",
  driveMasterFolder: "https://drive.google.com/drive/folders/11q-xu1rb5IoIE-lL1pMjHXqfut9Tq2hU", // المجلد الرئيسي لكافة المواد
  semester: "الترم الثاني 2026",
  faculty: "كلية الحاسبات والمعلومات - جامعة الزقازيق",
  department: "قسم الذكاء الاصطناعي (AI)"
};

const COURSES_DATA = [
  // ============================================================================
  // 1. معمارية الحاسوب وتنظيمه (Computer Architecture)
  // ============================================================================
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
    githubRepo: "https://github.com/ahm-333/computer-architecture-study",
    driveFolderUrl: "https://drive.google.com/drive/folders/1cw9D5TplznX1HGf1dWh_C_-pu3ZjrJSS",
    driveFolderId: "1cw9D5TplznX1HGf1dWh_C_-pu3ZjrJSS",
    sectionsDriveFolderUrl: "https://drive.google.com/drive/folders/1YGFJKH5JSPEBVDfu9LjFobj4H9WOUkwa",
    sectionsDriveFolderTitle: "مجلد درايف السكاشن (م. أمل مجدي)",
    sectionsDriveFolders: [
      {
        title: "درايف م. أمل مجدي",
        url: "https://drive.google.com/drive/folders/1YGFJKH5JSPEBVDfu9LjFobj4H9WOUkwa",
        color: "from-cyan-600 to-blue-600"
      },
      {
        title: "درايف م. تقى مصطفى",
        url: "https://drive.google.com/drive/folders/1szFwBUCE8t9-iRjzInLvHtoqUuA_UgQi",
        color: "from-teal-600 to-emerald-600"
      }
    ],

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

    // شروحات الفيديو وقوائم التشغيل المعتمدة (من ملف Studying Resources)
    videoExplanations: [
      {
        id: 1,
        title: "بلاي ليست د. أحمد الحسيني - شرح معمارية الحاسوب",
        subtitle: "COA | Chapter 01 Part 01 بالعربي - تغطية شاملة للمفاهيم الأساسية",
        url: "https://youtu.be/_Z4BcXL1n7Y?si=ymcnFKlzjdkVynKU",
        type: "playlist",
        typeArabic: "قائمة تشغيل",
        language: "عربي",
        author: "د. أحمد الحسيني",
        badge: "شرح معتمد وموصى به"
      },
      {
        id: 2,
        title: "قائمة تشغيل شرح السلايدات كاملة (Slides Walkthrough)",
        subtitle: "شرح تفصيلي خطوة بخطوة لسلايدات William Stallings المعتمدة",
        url: "https://www.youtube.com/playlist?list=PLXePmNcQcs2aAdjH3ZGHd-VXhs6xC9pMR",
        type: "playlist",
        typeArabic: "قائمة تشغيل كاملة",
        language: "شرح شامل",
        author: "قائمة تشغيل السلايدات",
        badge: "تغطية كاملة للمنهج"
      },
      {
        id: 3,
        title: "الفرق بين تنظيم ومعمارية الحاسوب (Organization vs Architecture)",
        subtitle: "COA Course - Ch1 - Difference between Computer organization && Computer Architecture",
        url: "https://youtu.be/qVoalfx83HA?si=IO-Fmkujybq2nN4_",
        type: "video",
        typeArabic: "فيديو شرح",
        language: "عربي",
        author: "مصدر عربي 1",
        badge: "تأسيس المفاهيم"
      },
      {
        id: 4,
        title: "شرح الفصل الأول: التنظيم والمعمارية الجزء الأول",
        subtitle: "COA | CH 1 | Part 1 | Organization and Architecture",
        url: "https://youtu.be/oE7Ejyksy7g?si=Yw_BzYpHp7of5Gx3",
        type: "video",
        typeArabic: "فيديو شرح",
        language: "عربي",
        author: "مصدر عربي 2",
        badge: "شرح مبسط"
      },
      {
        id: 5,
        title: "شرح سكشن 3 عملي - م. أمل مجدي (معالج 8086 وتطبيقات الأسمبلي)",
        subtitle: "شرح فيديو مسجل مباشر من المعيدة م. أمل مجدي لتطبيقات سكشن 3 وتوضيح مفاهيم معالج 8086",
        url: "https://drive.google.com/file/d/1Y3aE7t3cJKOiN-Je5Q0fWkw9uAUviPw7/view?usp=sharing",
        type: "video",
        typeArabic: "فيديو شرح المعيدة",
        language: "عربي",
        author: "م. أمل مجدي",
        badge: "سكشن 3 عملي"
      }
    ],

    // محاضرات المادة على Google Drive
    lectures: [
      {
        id: 1,
        chapter: "Chapter 1",
        title: "Basic Concepts and Computer Evolution",
        arabicTitle: "المفاهيم الأساسية وتطور الحاسوب",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 1,
        date: "المحاضرة 1",
        fileType: "pdf",
        pages: 57,
        size: "Google Drive PDF",
        driveId: "1yxIxo6vVc-0lhyzTYdWwY5nV9pSuLkDX",
        driveViewUrl: "https://drive.google.com/file/d/1yxIxo6vVc-0lhyzTYdWwY5nV9pSuLkDX/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1yxIxo6vVc-0lhyzTYdWwY5nV9pSuLkDX/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1yxIxo6vVc-0lhyzTYdWwY5nV9pSuLkDX",
        pdfUrl: "https://drive.google.com/file/d/1yxIxo6vVc-0lhyzTYdWwY5nV9pSuLkDX/preview",
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
        notes: "سلايدات المحاضرة المعتمدة الرسمية على Google Drive"
      },
      {
        id: 2,
        chapter: "Chapter 3",
        title: "A Top-Level View of Computer Function and Interconnection",
        arabicTitle: "نظرة عامة على وظائف الحاسوب والتوصيلات الداخلية وخطوط النقل",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 2,
        date: "المحاضرة 2",
        fileType: "pdf",
        pages: 46,
        size: "Google Drive PDF",
        driveId: "1HBg9R9bgySgBTH-VNm724tPNNe1YQDN-",
        driveViewUrl: "https://drive.google.com/file/d/1HBg9R9bgySgBTH-VNm724tPNNe1YQDN-/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1HBg9R9bgySgBTH-VNm724tPNNe1YQDN-/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1HBg9R9bgySgBTH-VNm724tPNNe1YQDN-",
        pdfUrl: "https://drive.google.com/file/d/1HBg9R9bgySgBTH-VNm724tPNNe1YQDN-/preview",
        studyManualUrl: "https://ahm-333.github.io/computer-architecture-study/",
        topics: [
          "Computer Components & Function",
          "Instruction Cycle",
          "Interrupts",
          "Interconnection Structures",
          "Data / Address / Control Bus",
          "Point-to-Point Interconnect (QPI)",
          "PCI Express"
        ],
        notes: "سلايدات المحاضرة المعتمدة الرسمية على Google Drive • ملحوظة دراسية: لفهم أعمق لمعمارية المعالج والمسجلات (8086)، يتوفر في مسار السكشن شرح م. تقى مصطفى المفصل (46 صفحة) للشرح المتعمق كما يُشرح في السكشن، والملف المختصر لتلخيص فائدة كل Register."
      },
      {
        id: 3,
        chapter: "Chapter 4",
        title: "Cache Memory",
        arabicTitle: "الذاكرة المخبأة (الكاش)",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 3,
        date: "المحاضرة 3",
        fileType: "pdf",
        pages: 56,
        size: "2.7 MB",
        pdfUrl: "materials/arch/Arch_Lecture_03_Chapter4_Cache_Memory.pdf",
        studyManualUrl: "https://ahm-333.github.io/computer-architecture-study/",
        topics: [
          "Memory Hierarchy & Locality",
          "Cache Principles",
          "Mapping Function (Direct, Associative, Set-Associative)",
          "Replacement Algorithms (LRU, FIFO, LFU)",
          "Write Policies (Write-through / Write-back)"
        ],
        notes: "سلايدات William Stallings - 10th Edition مدعومة في منصة الشرح"
      },
      {
        id: 4,
        chapter: "Chapter 5",
        title: "Internal Memory",
        arabicTitle: "الذاكرة الداخلية",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 4,
        date: "المحاضرة 4",
        fileType: "pdf",
        pages: 38,
        size: "2.3 MB",
        pdfUrl: "materials/arch/Arch_Lecture_04_Chapter5_Internal_Memory.pdf",
        studyManualUrl: "https://ahm-333.github.io/computer-architecture-study/",
        topics: [
          "Semiconductor Main Memory",
          "DRAM vs SRAM",
          "ROM Types (PROM, EPROM, EEPROM, Flash)",
          "Synchronous DRAM (SDRAM) & DDR"
        ],
        notes: "سلايدات William Stallings - 10th Edition"
      }
    ],
    sections: [
      {
        id: 1,
        title: "Introduction to Assembly Language & 8086 Architecture",
        arabicTitle: "مقدمة في لغة التجميع ومعمارية معالج 8086 وسجلاته",
        ta: "م. أمل مجدي",
        week: 1,
        date: "السكشن الأول",
        fileType: "pptx",
        size: "775 KB",
        driveId: "1EZFJTaosFkt2G4XizJEaLRvHPPqORnWr",
        driveViewUrl: "https://drive.google.com/file/d/1EZFJTaosFkt2G4XizJEaLRvHPPqORnWr/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1EZFJTaosFkt2G4XizJEaLRvHPPqORnWr/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1EZFJTaosFkt2G4XizJEaLRvHPPqORnWr",
        sheetUrl: "https://drive.google.com/file/d/1EZFJTaosFkt2G4XizJEaLRvHPPqORnWr/view",
        topics: [
          "Microprocessor Architecture (8086)",
          "Assembly Language Basics",
          "Bus Interface Unit (BIU) & Execution Unit (EU)",
          "General Purpose Registers (AX, BX, CX, DX)"
        ],
        notes: "سلايدات الشرح الرسمية للسكشن الأول من إعداد م. أمل مجدي"
      },
      {
        id: 2,
        title: "8086 Registers, Memory Segmentation & Instructions",
        arabicTitle: "مسجلات المعالج 8086، تقسيم الذاكرة، وبداية تعليمات الأسمبلي",
        ta: "م. أمل مجدي",
        week: 2,
        date: "السكشن الثاني",
        fileType: "pptx",
        size: "1.1 MB",
        driveId: "1vGk8UhssF0uYFmdAL6NVyiL13jCFWcsG",
        driveViewUrl: "https://drive.google.com/file/d/1vGk8UhssF0uYFmdAL6NVyiL13jCFWcsG/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1vGk8UhssF0uYFmdAL6NVyiL13jCFWcsG/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1vGk8UhssF0uYFmdAL6NVyiL13jCFWcsG",
        sheetUrl: "https://drive.google.com/file/d/1vGk8UhssF0uYFmdAL6NVyiL13jCFWcsG/view",
        topics: [
          "Segment Registers (CS, DS, SS, ES)",
          "Pointer & Index Registers (SP, BP, SI, DI)",
          "Physical Address Calculation",
          "Basic Move & Arithmetic Instructions"
        ],
        notes: "سلايدات الشرح للسكشن الثاني - تطبيق ومسائل على حساب العناوين الفيزيائية"
      },
      {
        id: 3,
        title: "8086 Assembly Programming & Instructions - Part 1",
        arabicTitle: "برمجة لغة التجميع لمعالج 8086 - الجزء الأول وتطبيقات عملية",
        ta: "م. أمل مجدي",
        week: 3,
        date: "السكشن الثالث",
        fileType: "pptx",
        size: "1.0 MB",
        driveId: "1m28ITfMhJvhbVcFi70pO4qckl6fKiq2X",
        driveViewUrl: "https://drive.google.com/file/d/1m28ITfMhJvhbVcFi70pO4qckl6fKiq2X/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1m28ITfMhJvhbVcFi70pO4qckl6fKiq2X/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1m28ITfMhJvhbVcFi70pO4qckl6fKiq2X",
        sheetUrl: "https://drive.google.com/file/d/1m28ITfMhJvhbVcFi70pO4qckl6fKiq2X/view",
        videoUrl: "https://drive.google.com/file/d/1Y3aE7t3cJKOiN-Je5Q0fWkw9uAUviPw7/view?usp=sharing",
        videoPreviewUrl: "https://drive.google.com/file/d/1Y3aE7t3cJKOiN-Je5Q0fWkw9uAUviPw7/preview",
        videoTitle: "فيديو شرح سكشن 3 - م. أمل مجدي",
        videoSubtitle: "شرح تفصيلي لتطبيقات معالج 8086 والأسمبلي بصوت وشرح م. أمل مجدي",
        topics: [
          "Writing Assembly Code in 8086",
          "Data Transfer Instructions (MOV, XCHG)",
          "Arithmetic Instructions (ADD, SUB, INC, DEC)",
          "Flags Register & Conditional Operations"
        ],
        notes: "يحتوي هذا السكشن على فيديو شرح مسجل بصوت م. أمل مجدي للمشاهدة المباشرة داخل المنصة"
      },
      {
        id: 4,
        title: "Lab 1: Introduction to Assembly Language",
        arabicTitle: "اللاب الأول: مقدمة في لغة التجميع وأنواع لغات البرمجة",
        ta: "م. تقى مصطفى",
        week: 1,
        date: "اللاب 1 (م. تقى)",
        tag: "Lab 1",
        subTag: "م. تقى",
        fileType: "pdf",
        pages: 19,
        size: "613 KB",
        driveId: "1iQC5oJI3nmAb7_KDxiN3eNIi0fm4Zkno",
        driveViewUrl: "https://drive.google.com/file/d/1iQC5oJI3nmAb7_KDxiN3eNIi0fm4Zkno/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1iQC5oJI3nmAb7_KDxiN3eNIi0fm4Zkno/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1iQC5oJI3nmAb7_KDxiN3eNIi0fm4Zkno",
        sheetUrl: "https://drive.google.com/file/d/1iQC5oJI3nmAb7_KDxiN3eNIi0fm4Zkno/view",
        topics: [
          "Introduction to Assembly Language",
          "Machine Language vs Assembly vs High-Level Languages",
          "Basic Concepts of 8086 Programming"
        ],
        notes: "سلايدات اللاب الأول لمادة معمارية الحاسوب - مدخل إلى لغات الآلة ولغة التجميع 8086 من إعداد م. تقى مصطفى"
      },
      {
        id: 5,
        title: "The Intel 8086 Microprocessor - Registers & Architecture (Labs 2 & 3)",
        arabicTitle: "ملخص مسجلات معالج 8086 واستخداماتها (لاب 2 و 3) - النسخة المختصرة",
        ta: "م. تقى مصطفى",
        week: 2,
        date: "اللاب 2 و 3 (م. تقى)",
        tag: "Lab 2-3",
        subTag: "مختصر",
        fileType: "pdf",
        pages: 22,
        size: "497 KB",
        driveId: "1mC9dcWW78kOPXeu6mI1scey7FbrKDG-N",
        driveViewUrl: "https://drive.google.com/file/d/1mC9dcWW78kOPXeu6mI1scey7FbrKDG-N/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1mC9dcWW78kOPXeu6mI1scey7FbrKDG-N/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1mC9dcWW78kOPXeu6mI1scey7FbrKDG-N",
        sheetUrl: "https://drive.google.com/file/d/1mC9dcWW78kOPXeu6mI1scey7FbrKDG-N/view",
        topics: [
          "General Purpose Registers (AX, BX, CX, DX)",
          "Segment Registers (CS, DS, SS, ES)",
          "Pointer & Index Registers (SP, BP, SI, DI)",
          "Flags Register (Status & Control Flags)",
          "Summary & Purpose of Each 8086 Register"
        ],
        notes: "وفي دي مختصرة شوية لو بس عايزين فايدة كل register"
      },
      {
        id: 6,
        title: "Intel 8086: Memory, Segments, Registers and Instruction Execution",
        arabicTitle: "معمارية معالج 8086، تقسيم الذاكرة والمسجلات - النسخة التفصيلية الشاملة",
        ta: "م. تقى مصطفى",
        week: 2,
        date: "الشرح التفصيلي (م. تقى)",
        tag: "Full Ref",
        subTag: "شرح مفصل",
        fileType: "pdf",
        pages: 46,
        size: "223 KB",
        driveId: "1oU0ZrkmZbdnGEIWzSVZt_xDT-3O0Ji01",
        driveViewUrl: "https://drive.google.com/file/d/1oU0ZrkmZbdnGEIWzSVZt_xDT-3O0Ji01/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1oU0ZrkmZbdnGEIWzSVZt_xDT-3O0Ji01/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1oU0ZrkmZbdnGEIWzSVZt_xDT-3O0Ji01",
        sheetUrl: "https://drive.google.com/file/d/1oU0ZrkmZbdnGEIWzSVZt_xDT-3O0Ji01/view",
        topics: [
          "8086 Internal Architecture (BIU & EU)",
          "Memory Segmentation (Code, Data, Stack, Extra)",
          "Physical Address Calculation (Segment * 10H + Offset)",
          "Registers in Detail & Functions",
          "Instruction Fetch & Execution"
        ],
        notes: "دي تفصيلية اوي هتفيدكم لو عايزين تفهمو كويس زي ما بيتشرح في السكشن بالتفصيل"
      }
    ],
    assignments: [],
    resources: [
      {
        id: 1,
        title: "مذكرة معمارية وسجلات 8086 التفصيلية (الشرح الشامل)",
        type: "مذكرة تفصيلية",
        year: "م. تقى مصطفى (46 صفحة)",
        size: "223 KB",
        notes: "دي تفصيلية اوي هتفيدكم لو عايزين تفهمو كويس زي ما بيتشرح في السكشن بالتفصيل",
        fileUrl: "https://drive.google.com/file/d/1oU0ZrkmZbdnGEIWzSVZt_xDT-3O0Ji01/view"
      },
      {
        id: 2,
        title: "ملخص وظائف مسجلات 8086 السريع (فائدة كل Register)",
        type: "ملخص سريع",
        year: "م. تقى مصطفى (22 صفحة)",
        size: "497 KB",
        notes: "وفي دي مختصرة شوية لو بس عايزين فايدة كل register",
        fileUrl: "https://drive.google.com/file/d/1mC9dcWW78kOPXeu6mI1scey7FbrKDG-N/view"
      }
    ],
    practicalResources: [
      {
        id: 1,
        title: "برنامج ومحاكي EMU8086 (8086 Microprocessor Emulator)",
        type: "أداة برمجة (Emulator Software)",
        year: "بيئة العملي الرسمية",
        size: "3.1 MB",
        notes: "حزمة المحاكي الرسمية المعتمدة مع السيريال والترخيص (License Key) لتشغيل وتتبع أكواد الأسمبلي",
        fileUrl: "https://drive.google.com/uc?export=download&id=1roSMR_VkbORg_-GER3lNixN8scDh18FO",
        folderUrl: "https://drive.google.com/drive/folders/17TawpKA53wJlCOrQdTu5qqsN6TgLxfUd",
        licenseKey: "سيريال التفعيل متوفر داخل مجلد Emulator (ملف License Key.txt)",
        badge: "ضروري للعملي"
      }
    ]
  },

  // ============================================================================
  // 2. رسم بالحاسوب (Computer Graphics)
  // ============================================================================
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
    driveFolderUrl: "https://drive.google.com/drive/folders/15mZ5OhNCsUm77gZjveH6HAOXTzc9QHwA",
    driveFolderId: "15mZ5OhNCsUm77gZjveH6HAOXTzc9QHwA",

    explanationSite: {
      url: "https://drive.google.com/drive/folders/15mZ5OhNCsUm77gZjveH6HAOXTzc9QHwA",
      title: "مستودع محاضرات وشروحات مادة الرسم بالحاسوب",
      description: "سلايدات المحاضرات الرسمية المعتمدة لدفعة الحاسبات والذكاء الاصطناعي مع شروحات عملية باللغتين العربية والإنجليزية.",
      status: "متصل بـ Google Drive",
      features: [
        "سلايدات رسمية لخوارزميات DDA و Bresenham و Midpoint",
        "شروحات فيديو عملية لتثبيت بيئة CodeBlocks و Freeglut",
        "دورات OpenGL متقدمة باللغتين العربية والإنجليزية"
      ]
    },

    // شروحات الفيديو وقوائم التشغيل المعتمدة (من ملف Studying Resources)
    videoExplanations: [
      {
        id: 1,
        title: "بلاي ليست م. أحمد سلطان - خوارزميات الرسم بالحاسوب و OpenGL",
        subtitle: "#2 Computer Graphics- DDA Line Algorithm Example and Code using openGL بالعربي",
        url: "https://youtu.be/Dn5If4zcDeI?si=OUGXLWeFLOtA7Usn",
        type: "playlist",
        typeArabic: "قائمة تشغيل عملية",
        language: "عربي",
        author: "أحمد سلطان",
        badge: "شرح خوارزميات وكود"
      },
      {
        id: 2,
        title: "دورة الرسم بالحاسوب بالعربي (أشهر شرح) - إعداد Codeblocks و Freeglut",
        subtitle: "1 - Computer Graphics in Arabic || Install Codeblocks and Freeglut",
        url: "https://youtu.be/DItMw3CAkuU?si=UJp5pVwuvyiJNm3t",
        type: "video",
        typeArabic: "فيديو وتطبيق",
        language: "عربي",
        author: "أشهر مصدر عربي للمادة",
        badge: "تثبيت بيئة العمل"
      },
      {
        id: 3,
        title: "OpenGL Course - Create 3D and 2D Graphics With C++ (freeCodeCamp)",
        subtitle: "دورة احترافية شاملة للرسم ثنائي وثلاثي الأبعاد باستخدام OpenGL ولغة C++",
        url: "https://youtu.be/45MIykWJ-C4?si=Ffxsz3BS3CEjin0f",
        type: "video",
        typeArabic: "دورة مكثفة",
        language: "English",
        author: "freeCodeCamp",
        badge: "شرح إنجليزي شامل"
      },
      {
        id: 4,
        title: "OpenGL with C++: Intro and Setup (The Cherno)",
        subtitle: "السلسلة الشهيرة للمهندس The Cherno لتأسيس وبرمجة رسوميات OpenGL الحديثة",
        url: "https://youtu.be/4m9RHfdUU_M?si=c6J1ULf6ZTTrU3hS",
        type: "playlist",
        typeArabic: "قائمة تشغيل",
        language: "English",
        author: "The Cherno",
        badge: "مستوى متقدم"
      }
    ],

    // محاضرات المادة على Google Drive
    lectures: [
      {
        id: 1,
        chapter: "Lecture 1",
        title: "Introduction to Computer Graphics",
        arabicTitle: "مقدمة في الرسم بالحاسوب ومفاهيمه وتطبيقاته الحديثة",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 1,
        date: "المحاضرة 1",
        fileType: "pdf",
        pages: 35,
        size: "Google Drive PDF",
        driveId: "1Wzhbg1Qvqf17M2TYy3LfAAkyOLb1M_ji",
        driveViewUrl: "https://drive.google.com/file/d/1Wzhbg1Qvqf17M2TYy3LfAAkyOLb1M_ji/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1Wzhbg1Qvqf17M2TYy3LfAAkyOLb1M_ji/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1Wzhbg1Qvqf17M2TYy3LfAAkyOLb1M_ji",
        pdfUrl: "https://drive.google.com/file/d/1Wzhbg1Qvqf17M2TYy3LfAAkyOLb1M_ji/preview",
        topics: [
          "What is Computer Graphics?",
          "Applications: CAD, Presentation Graphics, Virtual Reality, Visualization",
          "Image Processing vs Computer Graphics",
          "Graphics Pipeline & Display Technologies Overview"
        ],
        notes: "سلايدات المحاضرة المعتمدة الرسمية لعام 2024-2025 على Google Drive"
      },
      {
        id: 2,
        chapter: "Lecture 2",
        title: "Basic Concepts & Graphic Displays",
        arabicTitle: "المفاهيم الأساسية وشاشات العرض الرسومية (Raster vs Random Scan)",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 2,
        date: "المحاضرة 2",
        fileType: "pdf",
        pages: 42,
        size: "Google Drive PDF",
        driveId: "1R4yUCGrZbiFwiTp55dZ1jDkIQOs1uoMh",
        driveViewUrl: "https://drive.google.com/file/d/1R4yUCGrZbiFwiTp55dZ1jDkIQOs1uoMh/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1R4yUCGrZbiFwiTp55dZ1jDkIQOs1uoMh/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1R4yUCGrZbiFwiTp55dZ1jDkIQOs1uoMh",
        pdfUrl: "https://drive.google.com/file/d/1R4yUCGrZbiFwiTp55dZ1jDkIQOs1uoMh/preview",
        topics: [
          "Cathode Ray Tube (CRT) Principles",
          "Raster Scan Displays & Frame Buffer",
          "Random Scan (Vector) Displays",
          "Color CRT & Shadow Mask Method",
          "Flat Panel Displays & Resolution Concepts"
        ],
        notes: "سلايدات المحاضرة المعتمدة الرسمية لعام 2024-2025 على Google Drive"
      },
      {
        id: 3,
        chapter: "Lecture 3",
        title: "Output Primitives & Line Drawing Algorithms",
        arabicTitle: "الرسم الأساسي وخوارزميات رسم الخط المستقيم (DDA & Bresenham)",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 3,
        date: "المحاضرة 3",
        fileType: "pdf",
        pages: 48,
        size: "Google Drive PDF",
        driveId: "1GyZrogRCLyJiuTh0vBY-olOwY-BADYt6",
        driveViewUrl: "https://drive.google.com/file/d/1GyZrogRCLyJiuTh0vBY-olOwY-BADYt6/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1GyZrogRCLyJiuTh0vBY-olOwY-BADYt6/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1GyZrogRCLyJiuTh0vBY-olOwY-BADYt6",
        pdfUrl: "https://drive.google.com/file/d/1GyZrogRCLyJiuTh0vBY-olOwY-BADYt6/preview",
        topics: [
          "Scan Conversion & Rasterization",
          "Digital Differential Analyzer (DDA) Algorithm",
          "Bresenham's Line Drawing Algorithm",
          "Derivation of Decision Parameter",
          "Slope Conditions (|m| < 1 & |m| > 1)"
        ],
        notes: "سلايدات المحاضرة المعتمدة الرسمية لعام 2024-2025 على Google Drive"
      },
      {
        id: 4,
        chapter: "Lecture 4",
        title: "Output Primitives: Circle Drawing Algorithms",
        arabicTitle: "خوارزميات رسم الدائرة (خوارزمية نقطة المنتصف Midpoint Circle)",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 4,
        date: "المحاضرة 4",
        fileType: "pdf",
        pages: 36,
        size: "Google Drive PDF",
        driveId: "16Jne0nkFuOXmIFqPGtq-3gh78RwiQ3XI",
        driveViewUrl: "https://drive.google.com/file/d/16Jne0nkFuOXmIFqPGtq-3gh78RwiQ3XI/view",
        drivePreviewUrl: "https://drive.google.com/file/d/16Jne0nkFuOXmIFqPGtq-3gh78RwiQ3XI/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=16Jne0nkFuOXmIFqPGtq-3gh78RwiQ3XI",
        pdfUrl: "https://drive.google.com/file/d/16Jne0nkFuOXmIFqPGtq-3gh78RwiQ3XI/preview",
        topics: [
          "Properties of Circles",
          "Eight-Way Symmetry of a Circle",
          "Midpoint Circle Algorithm Derivation",
          "Initial Decision Parameter P0",
          "Step-by-step Pixel Selection & Examples"
        ],
        notes: "سلايدات المحاضرة المعتمدة الرسمية على Google Drive"
      },
      {
        id: 5,
        chapter: "Lecture 5",
        title: "Output Primitives: Ellipse Drawing Algorithms",
        arabicTitle: "خوارزميات رسم القطع الناقص (خوارزمية نقطة المنتصف Midpoint Ellipse)",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 5,
        date: "المحاضرة 5",
        fileType: "pdf",
        pages: 34,
        size: "Google Drive PDF",
        driveId: "19n0MoSKaI6x2mU1aEuF5WENPTCiLjIHz",
        driveViewUrl: "https://drive.google.com/file/d/19n0MoSKaI6x2mU1aEuF5WENPTCiLjIHz/view",
        drivePreviewUrl: "https://drive.google.com/file/d/19n0MoSKaI6x2mU1aEuF5WENPTCiLjIHz/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=19n0MoSKaI6x2mU1aEuF5WENPTCiLjIHz",
        pdfUrl: "https://drive.google.com/file/d/19n0MoSKaI6x2mU1aEuF5WENPTCiLjIHz/preview",
        topics: [
          "Properties of Ellipses & Four-Way Symmetry",
          "Midpoint Ellipse Algorithm",
          "Region 1 vs Region 2 Decision Parameters",
          "Derivative and Boundary Conditions",
          "Tracing and Computational Examples"
        ],
        notes: "سلايدات المحاضرة المعتمدة الرسمية (Updated) على Google Drive"
      }
    ],
    sections: [],
    assignments: [],
    resources: []
  },

  // ============================================================================
  // 3. أنظمة قواعد البيانات (Database Systems)
  // ============================================================================
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
    driveFolderUrl: "https://drive.google.com/drive/folders/1OeDIo5P8CtBvfigYkXK2YNHloaH_0hgn",
    driveFolderId: "1OeDIo5P8CtBvfigYkXK2YNHloaH_0hgn",

    explanationSite: {
      url: "https://drive.google.com/drive/folders/1OeDIo5P8CtBvfigYkXK2YNHloaH_0hgn",
      title: "مستودع محاضرات ومراجع نظم قواعد البيانات",
      description: "المحاضرات الرسمية المعتمدة مع كتاب المرجع الأساسي Elmasri & Navathe وشروحات فيديو ممتازة لـ ERD و Mapping و SQL.",
      status: "متصل بـ Google Drive",
      features: [
        "سلايدات المحاضرات الرسمية بصيغة PowerPoint",
        "نسخة رقمية كاملة من مرجع Elmasri المعتمد",
        "شروحات تفصيلية لـ ERD والتحويل لجداول علائقية"
      ]
    },

    // شروحات الفيديو وقوائم التشغيل المعتمدة (من ملف Studying Resources)
    videoExplanations: [
      {
        id: 1,
        title: "بلاي ليست د. محمد الدسوقي - أساسيات وتصميم قواعد البيانات",
        subtitle: "01 - Chapter 1 - Database and Database Users - شرح أكاديمي راقٍ وبسيط",
        url: "https://youtu.be/yLc0Yp5QZlU?si=79y_U7OiNtx21-SS",
        type: "playlist",
        typeArabic: "قائمة تشغيل",
        language: "عربي",
        author: "د. محمد الدسوقي",
        badge: "شرح أكاديمي متميز"
      },
      {
        id: 2,
        title: "شرح مخطط الكيانات والعلاقات (ERD) خطوة بخطوة - أحمد الجندي",
        subtitle: "04 - شرح Entity Relationship Diagram (ERD) خطوة بخطوة | تصميم قواعد البيانات بالعربي",
        url: "https://youtu.be/VQGiO38c_EM?si=iTNvMlq2O-rJJUtq",
        type: "video",
        typeArabic: "فيديو وتطبيق",
        language: "عربي",
        author: "أحمد الجندي",
        badge: "شرح عملي للـ ERD"
      },
      {
        id: 3,
        title: "من ERD إلى جداول: خطوات الـ Mapping بالتفصيل - أحمد الجندي",
        subtitle: "06- من ERD إلى جداول: خطوات الـ Mapping بالتفصيل وقواعد الربط والمفاتيح",
        url: "https://youtu.be/YuRmghkoaRI?si=DlKsb46S8bAs9vQa",
        type: "video",
        typeArabic: "فيديو شرح",
        language: "عربي",
        author: "أحمد الجندي",
        badge: "التحويل للجداول Relational"
      }
    ],

    // محاضرات المادة على Google Drive
    lectures: [
      {
        id: 1,
        chapter: "Chapter 1",
        title: "Databases and Database Users",
        arabicTitle: "مقدمة قواعد البيانات والمستخدمين ومكونات الـ DBMS",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 1,
        date: "المحاضرة 1",
        fileType: "ppt",
        pages: 35,
        size: "PowerPoint",
        driveId: "13UfB_WbVKRPdsfFYXjM0iDDLN_RveU_q",
        driveViewUrl: "https://drive.google.com/file/d/13UfB_WbVKRPdsfFYXjM0iDDLN_RveU_q/view",
        drivePreviewUrl: "https://drive.google.com/file/d/13UfB_WbVKRPdsfFYXjM0iDDLN_RveU_q/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=13UfB_WbVKRPdsfFYXjM0iDDLN_RveU_q",
        pdfUrl: "https://drive.google.com/file/d/13UfB_WbVKRPdsfFYXjM0iDDLN_RveU_q/preview",
        topics: [
          "Database and DBMS Definition",
          "Traditional File Processing vs DBMS",
          "Characteristics of the Database Approach",
          "Database Users, Actors on the Scene & Workers Behind",
          "When NOT to use a DBMS"
        ],
        notes: "ملف المحاضرة 1 الرسمي المعتمد (DBLec1.ppt) على Google Drive"
      },
      {
        id: 2,
        chapter: "Chapter 1-2",
        title: "Database System Concepts and Architecture",
        arabicTitle: "مفاهيم وبنية نظم قواعد البيانات والمعمارية ثلاثية الطبقات",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 2,
        date: "المحاضرة 2",
        fileType: "ppt",
        pages: 30,
        size: "30 شريحة (مع شرح تفاعلي)",
        driveId: "1pPnSfUyBRANVkDT2DYa32ZaNe2Zo6Txa",
        driveViewUrl: "https://drive.google.com/file/d/1pPnSfUyBRANVkDT2DYa32ZaNe2Zo6Txa/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1pPnSfUyBRANVkDT2DYa32ZaNe2Zo6Txa/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1pPnSfUyBRANVkDT2DYa32ZaNe2Zo6Txa",
        pdfUrl: "https://drive.google.com/file/d/1pPnSfUyBRANVkDT2DYa32ZaNe2Zo6Txa/preview",
        topics: [
          "Data Models, Schemas, and Instances",
          "Three-Schema Architecture & Data Independence",
          "Logical vs Physical Data Independence",
          "DBMS Languages (DDL, DML, DCL)",
          "Classification of Database Management Systems"
        ],
        notes: "ملف المحاضرة 2 الرسمي المعتمد (DBLec2 ch 1.ppt) متوفر بشرح تفاعلي ذكي لكل شريحة وتريكات الامتحان وكويزات فورية."
      },
      {
        id: 3,
        chapter: "Chapter 3",
        title: "Data Modeling Using the Entity-Relationship (ER) Model",
        arabicTitle: "نمذجة البيانات ومخطط الكيانات والعلاقات (ERD)",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 3,
        date: "المحاضرة 3",
        fileType: "ppt",
        pages: 44,
        size: "PowerPoint",
        driveId: "1E84yksi_nJRsjvY5Geh3-oxgS01RiJIm",
        driveViewUrl: "https://drive.google.com/file/d/1E84yksi_nJRsjvY5Geh3-oxgS01RiJIm/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1E84yksi_nJRsjvY5Geh3-oxgS01RiJIm/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1E84yksi_nJRsjvY5Geh3-oxgS01RiJIm",
        pdfUrl: "https://drive.google.com/file/d/1E84yksi_nJRsjvY5Geh3-oxgS01RiJIm/preview",
        topics: [
          "Conceptual Data Models for Database Design",
          "Entity Types, Entity Sets, Attributes and Keys",
          "Relationship Types, Sets, Roles, and Structural Constraints",
          "Weak Entity Types & Identifying Relationships",
          "ER Diagrams, Naming Conventions and Design Issues"
        ],
        notes: "ملف المحاضرة 3 الرسمي المعتمد (lec 3 ch 2.ppt) على Google Drive"
      },
      {
        id: 4,
        chapter: "Textbook",
        title: "Fundamentals of Database Systems (Elmasri & Navathe)",
        arabicTitle: "الكتاب والمرجع المعتمد الرسمي لمادة قواعد البيانات",
        doctor: "كتاب المادة المعتمد",
        doctorNote: "جميع المجموعات",
        week: 0,
        date: "المرجع الشامل",
        fileType: "pdf",
        pages: 1272,
        size: "الكتاب الكامل PDF",
        driveId: "1dBRO0N1bFyMUnPgfYlO31cLYsUfQnIX3",
        driveViewUrl: "https://drive.google.com/file/d/1dBRO0N1bFyMUnPgfYlO31cLYsUfQnIX3/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1dBRO0N1bFyMUnPgfYlO31cLYsUfQnIX3/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1dBRO0N1bFyMUnPgfYlO31cLYsUfQnIX3",
        pdfUrl: "https://drive.google.com/file/d/1dBRO0N1bFyMUnPgfYlO31cLYsUfQnIX3/preview",
        topics: [
          "Complete coverage of ER Model, Relational Model & SQL",
          "Normalization Theory & Functional Dependencies",
          "Transaction Processing & Concurrency Control",
          "Indexing & Query Optimization Techniques"
        ],
        notes: "المرجع العالمي الشهير Fundamentals of Database Systems - Elmasri على Google Drive"
      }
    ],
    sections: [],
    assignments: [],
    resources: []
  },

  // ============================================================================
  // 4. تراكيب البيانات والخوارزميات (Data Structure)
  // ============================================================================
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
    driveFolderUrl: "https://drive.google.com/drive/folders/1gQrSrTFNGcauZk5Fdf8y3xsDQ466oK84",
    driveFolderId: "1gQrSrTFNGcauZk5Fdf8y3xsDQ466oK84",
    sectionsDriveFolderUrl: "https://drive.google.com/drive/folders/1p1zE6XWM2uYRn7_MnnkN51IL_HWirf-m",
    sectionsDriveFolderTitle: "درايف م.م. أحمد حسام",
    sectionsDriveFolders: [
      {
        title: "درايف م.م. أحمد حسام (السكاشن والتاسكات)",
        url: "https://drive.google.com/drive/folders/1p1zE6XWM2uYRn7_MnnkN51IL_HWirf-m",
        color: "from-amber-600 to-orange-600"
      }
    ],

    explanationSite: {
      url: "https://drive.google.com/drive/folders/1gQrSrTFNGcauZk5Fdf8y3xsDQ466oK84",
      title: "مستودع محاضرات وسلايدات تراكيب البيانات",
      description: "سلايدات المحاضرات الرسمية المعتمدة لجميع دفعات الذكاء الاصطناعي والحاسبات مع شروحات وقوائم تشغيل ممتازة بلغة C++.",
      status: "متصل بـ Google Drive",
      features: [
        "سلايدات رسمية ومحدثة من Lecture 0 إلى Stacks",
        "شروحات باللغة العربية مع د. محمد الدسوقي وقنوات متخصصة",
        "دورات عالمية باللغة الإنجليزية لتراكيب البيانات والخوارزميات"
      ]
    },

    // شروحات الفيديو وقوائم التشغيل المعتمدة (من ملف Studying Resources)
    videoExplanations: [
      {
        id: 1,
        title: "شرح تراكيب البيانات بالعربي - Arrays & Data Structures",
        subtitle: "Data Structures 1 - In Arabic - شرح تراكيب البيانات 1 - Data Structures | Arrays",
        url: "https://youtu.be/9fRN5QtvfTg?si=1nfAR3PUhatnd4n7",
        type: "video",
        typeArabic: "فيديو وتطبيق",
        language: "عربي",
        author: "مصدر عربي ممتاز",
        badge: "شرح ممتاز جداً"
      },
      {
        id: 2,
        title: "بلاي ليست د. محمد الدسوقي - تراكيب البيانات بلغة C++",
        subtitle: "01 - | C++ Data Structures | - | why Data Structures ? | - | تراكيب البيانات |",
        url: "https://youtu.be/jGP19W5IObA?si=PAIVo7RVKTXTnBeZ",
        type: "playlist",
        typeArabic: "قائمة تشغيل كاملة",
        language: "عربي",
        author: "د. محمد الدسوقي",
        badge: "الأكثر شمولاً بالعربي"
      },
      {
        id: 3,
        title: "دورة تراكيب البيانات والخوارزميات باللغة الإنجليزية (عبد الباري / متقدم)",
        subtitle: "Master Data Structures and Algorithms with high visual clarity and problem-solving",
        url: "https://youtu.be/xX5iOYCJmBI?si=Hyse_Vdh3Cj9jZS3",
        type: "video",
        typeArabic: "دورة مكثفة",
        language: "English",
        author: "Abdul Bari / YouTube",
        badge: "شرح إنجليزي عالمي"
      },
      {
        id: 4,
        title: "دورة تراكيب البيانات الكاملة للمبتدئين والمتقدمين (freeCodeCamp)",
        subtitle: "Complete Data Structures and Algorithms Course with animated trace and code",
        url: "https://youtu.be/_T42E9RkWVQ?si=KwX4qnoeYyJc6bm0",
        type: "video",
        typeArabic: "دورة شاملة",
        language: "English",
        author: "freeCodeCamp",
        badge: "كورس كامل مجاني"
      }
    ],

    // محاضرات المادة على Google Drive
    lectures: [
      {
        id: 0,
        chapter: "Lecture 0",
        title: "Course Overview & C++ Foundations",
        arabicTitle: "المحاضرة 0: نظرة عامة ومتطلبات المادة وتأسيس لغة C++",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 1,
        date: "المحاضرة 0 (تمهيدية)",
        fileType: "pdf",
        pages: 28,
        size: "Google Drive PDF",
        driveId: "15ex8H917WPT1ekf1-jjuwIMaJxdmy_lQ",
        driveViewUrl: "https://drive.google.com/file/d/15ex8H917WPT1ekf1-jjuwIMaJxdmy_lQ/view",
        drivePreviewUrl: "https://drive.google.com/file/d/15ex8H917WPT1ekf1-jjuwIMaJxdmy_lQ/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=15ex8H917WPT1ekf1-jjuwIMaJxdmy_lQ",
        pdfUrl: "https://drive.google.com/file/d/15ex8H917WPT1ekf1-jjuwIMaJxdmy_lQ/preview",
        topics: [
          "Course Objectives, Topics & Grading Scheme",
          "Why study Data Structures and Algorithms?",
          "C++ Review: Classes, Objects, Pointers & Memory Management",
          "Dynamic Memory Allocation (new & delete)"
        ],
        notes: "سلايدات المحاضرة التمهيدية الرسمية على Google Drive"
      },
      {
        id: 1,
        chapter: "Lecture 1",
        title: "Introduction to Data Structures, Arrays & Templates",
        arabicTitle: "المحاضرة 1: مقدمة هياكل البيانات، المصفوفات والـ Templates",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 2,
        date: "المحاضرة 1",
        fileType: "pdf",
        pages: 53,
        size: "Google Drive PDF",
        driveId: "1RTyXb8d6VnwPE9L507uJdvfolhn5b5sM",
        driveViewUrl: "https://drive.google.com/file/d/1RTyXb8d6VnwPE9L507uJdvfolhn5b5sM/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1RTyXb8d6VnwPE9L507uJdvfolhn5b5sM/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1RTyXb8d6VnwPE9L507uJdvfolhn5b5sM",
        pdfUrl: "https://drive.google.com/file/d/1RTyXb8d6VnwPE9L507uJdvfolhn5b5sM/preview",
        topics: [
          "Definition of Data Structure & Operations",
          "Abstract Data Types (ADT) - Stack & Queue",
          "Primitive vs Non-Primitive Data Types",
          "One-Dimensional & Multidimensional Arrays",
          "C++ Function & Class Templates (Box & Pair Examples)"
        ],
        notes: "سلايدات المحاضرة 1 الرسمية المعتمدة على Google Drive"
      },
      {
        id: 2,
        chapter: "Lecture 2",
        title: "Linked Lists (SLL, DLL, Circular)",
        arabicTitle: "المحاضرة 2: القوائم المترابطة (Singly, Doubly, Circular)",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 3,
        date: "المحاضرة 2",
        fileType: "pdf",
        pages: 37,
        size: "Google Drive PDF",
        driveId: "1PrljFyWlMKzTQxR6TGKvqEDmCbMrBfhL",
        driveViewUrl: "https://drive.google.com/file/d/1PrljFyWlMKzTQxR6TGKvqEDmCbMrBfhL/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1PrljFyWlMKzTQxR6TGKvqEDmCbMrBfhL/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1PrljFyWlMKzTQxR6TGKvqEDmCbMrBfhL",
        pdfUrl: "https://drive.google.com/file/d/1PrljFyWlMKzTQxR6TGKvqEDmCbMrBfhL/preview",
        topics: [
          "Memory Representation: Arrays vs Linked Lists",
          "Node Structure & Singly Linked List (SLL)",
          "Insertion (Beginning, End, Arbitrary Position)",
          "Deletion (First, Last, by Value)",
          "Doubly Linked List (DLL) & Circular Linked List (CLL)"
        ],
        notes: "سلايدات المحاضرة 2 الرسمية المعتمدة على Google Drive"
      },
      {
        id: 3,
        chapter: "Lecture 3",
        title: "Recursion & Backtracking Algorithms",
        arabicTitle: "المحاضرة 3: الاستدعاء الذاتي (Recursion) وخوارزمية التراجع",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 4,
        date: "المحاضرة 3",
        fileType: "pdf",
        pages: 41,
        size: "Google Drive PDF",
        driveId: "1SDQEwv9AEd9KcWCyPpReo7uUqE53GKs6",
        driveViewUrl: "https://drive.google.com/file/d/1SDQEwv9AEd9KcWCyPpReo7uUqE53GKs6/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1SDQEwv9AEd9KcWCyPpReo7uUqE53GKs6/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1SDQEwv9AEd9KcWCyPpReo7uUqE53GKs6",
        pdfUrl: "https://drive.google.com/file/d/1SDQEwv9AEd9KcWCyPpReo7uUqE53GKs6/preview",
        topics: [
          "Base Case vs General Case in Recursion",
          "Call Stack Frame & Execution Tracing",
          "Classic Tracing: Factorial & Fibonacci",
          "Recursion with Data Structures (Reverse Print, Search)",
          "Backtracking Principles & The 8-Queens Puzzle"
        ],
        notes: "سلايدات المحاضرة 3 الرسمية المعتمدة على Google Drive"
      },
      {
        id: 4,
        chapter: "Lecture 4",
        title: "Stacks Data Structure & Applications",
        arabicTitle: "المحاضرة 4: هيكل المكدس (Stacks) وتطبيقاته البرمجية",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 5,
        date: "المحاضرة 4",
        fileType: "pdf",
        pages: 45,
        size: "Google Drive PDF",
        driveId: "13JEkHCpNQXXwGtbQd9KdeIzMKmCaCbDS",
        driveViewUrl: "https://drive.google.com/file/d/13JEkHCpNQXXwGtbQd9KdeIzMKmCaCbDS/view",
        drivePreviewUrl: "https://drive.google.com/file/d/13JEkHCpNQXXwGtbQd9KdeIzMKmCaCbDS/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=13JEkHCpNQXXwGtbQd9KdeIzMKmCaCbDS",
        pdfUrl: "https://drive.google.com/file/d/13JEkHCpNQXXwGtbQd9KdeIzMKmCaCbDS/preview",
        topics: [
          "LIFO (Last In First Out) Principle",
          "Stack ADT Operations: push(), pop(), top()/peek(), isEmpty()",
          "Array-based Stack Implementation",
          "Linked-list Stack Implementation",
          "Applications: Balanced Parentheses & Infix to Postfix Conversion"
        ],
        notes: "سلايدات المحاضرة 4 الرسمية المعتمدة على Google Drive"
      }
    ],
    sections: [
      {
        id: 1,
        title: "Introduction to Arrays in C++ - Beginners Teaching",
        arabicTitle: "السكشن 1: مدخل ومفاهيم مصفوفات C++ وتطبيقاتها العملية",
        ta: "م.م. أحمد حسام",
        week: 1,
        date: "السكشن الأول",
        fileType: "pptx",
        size: "79 KB",
        driveId: "1wk9oInrFML104qGkkFFlhb6gP6jcpOLe",
        driveViewUrl: "https://drive.google.com/file/d/1wk9oInrFML104qGkkFFlhb6gP6jcpOLe/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1wk9oInrFML104qGkkFFlhb6gP6jcpOLe/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1wk9oInrFML104qGkkFFlhb6gP6jcpOLe",
        sheetUrl: "https://drive.google.com/file/d/1wk9oInrFML104qGkkFFlhb6gP6jcpOLe/view",
        localFile: "materials/ds/Section_1_Arrays_Beginners_Teaching_Presentation.pptx",
        hasTask: true,
        taskTitle: "تاسك 1: 20 مسألة عملية متدرجة على مصفوفات C++",
        topics: [
          "Array Declaration, Initialization & Syntax in C++",
          "Memory Layout, Contiguous Allocation & Indexing",
          "Accessing, Updating & Traversing Elements with Loops",
          "Array Operations: Sum, Average, Max, Min & Linear Search",
          "2D Array (Matrices) Concept & Traversal Introduction"
        ],
        notes: "سلايدات الشرح الرسمية للسكشن الأول من إعداد م.م. أحمد حسام. يوجد شيت تاسك عملي مخصص (20 مسألة متدرجة) بقسم التكليفات بالأسفل."
      },
      {
        id: 0,
        tag: "Rev",
        subTag: "C++",
        title: "C++ Foundations & Revision - Beginners Teaching",
        arabicTitle: "مراجعة وتأسيس لغة C++ لسكاشن تراكيب البيانات",
        ta: "م.م. أحمد حسام",
        week: 1,
        date: "مراجعة تمهيدية",
        fileType: "pptx",
        size: "86 KB",
        driveId: "1C-7-6sPIecltpupe99XMNw88JQEzIlQp",
        driveViewUrl: "https://drive.google.com/file/d/1C-7-6sPIecltpupe99XMNw88JQEzIlQp/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1C-7-6sPIecltpupe99XMNw88JQEzIlQp/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1C-7-6sPIecltpupe99XMNw88JQEzIlQp",
        sheetUrl: "https://drive.google.com/file/d/1C-7-6sPIecltpupe99XMNw88JQEzIlQp/view",
        localFile: "materials/ds/CPlusPlus_Revision_Beginners_Teaching_Final.pptx",
        topics: [
          "C++ Syntax, Variables, Data Types & Scope",
          "Input/Output Streams (cin, cout) & Best Practices",
          "Control Flow: Conditions (if/else, switch) & Loops (for, while)",
          "Functions & Parameter Passing (Pass-by-value vs Reference)",
          "Pointers & Direct Memory Addressing Fundamentals"
        ],
        notes: "سلايدات مراجعة تأسيسية متكاملة للغة C++ من إعداد م.م. أحمد حسام لتثبيت الأساس البرمجي قبل تراكيب البيانات."
      }
    ],
    assignments: [
      {
        id: 1,
        number: 1,
        title: "Task 1: 20 Progressive C++ Array Tasks (Array Practice)",
        arabicTitle: "تاسك السكشن 1: 20 مسألة عملية متدرجة على مصفوفات C++",
        status: "متاح",
        deadline: "متابعة مع المعيد في السكشن القادم",
        ta: "م.م. أحمد حسام",
        pages: 5,
        size: "77 KB",
        fileType: "pdf",
        driveId: "1rLUdeP0zDuERtcxUG-MUc0ur0LQmCClW",
        fileUrl: "https://drive.google.com/file/d/1rLUdeP0zDuERtcxUG-MUc0ur0LQmCClW/view",
        driveViewUrl: "https://drive.google.com/file/d/1rLUdeP0zDuERtcxUG-MUc0ur0LQmCClW/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1rLUdeP0zDuERtcxUG-MUc0ur0LQmCClW/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1rLUdeP0zDuERtcxUG-MUc0ur0LQmCClW",
        localFile: "materials/ds/DS_Section_01_Tasks_Arrays_Practice.pdf",
        pdfUrl: "https://drive.google.com/file/d/1rLUdeP0zDuERtcxUG-MUc0ur0LQmCClW/preview",
        details: "شيت عملي شامل من إعداد م.م. أحمد حسام يضم 20 مسألة برمجية متدرجة الصعوبة مقسمة عبر 4 مستويات؛ من المبادئ الأولية والـ Indexing حتى مصفوفات ثنائية الأبعاد (2D Arrays).",
        rules: "حل جميع المسائل باستخدام مصفوفات C++ العادية وحلقات التكرار (Loops) فقط. لا يُسمح باستخدام vector أو map أو set أو دوال الترتيب الجاهزة (built-in sorting) إلا بتصريح المعيد.",
        levels: [
          {
            level: "Level 1 - Foundations",
            arabicLevel: "المستوى 1: الأساسيات والتعريف والتكرار (5 مسائل)",
            tasks: [
              "1. Weekly temperature tracker (تخزين وطباعة وتعديل حرارة 7 أيام)",
              "2. First, middle, and last (قراءة 7 أرقام وطباعة الأول والأوسط والأخير بالـ index)",
              "3. Reverse display (طباعة 10 عناصر بالعكس بدون مصفوفة إضافية)",
              "4. Transform every value (مضاعفة كل عنصر في 2 وطباعة المصفوفة قبل وبعد)",
              "5. Simple inventory update (تحديث كميات 8 منتجات بالتحقق من الـ index)"
            ]
          },
          {
            level: "Level 2 - Calculations and Search",
            arabicLevel: "المستوى 2: العمليات الحسابية والبحث الخطي (5 مسائل)",
            tasks: [
              "6. Sum and average (حساب المجموع والمتوسط الحسابي بنوع كسر عشري)",
              "7. Maximum and minimum (إيجاد أكبر وأصغر قيمة وموقع أول ظهور لهما)",
              "8. Even and odd counter (عد العناصر الزوجية والفردية وتحديد الفئة الأكبر)",
              "9. Search all occurrences (بحث خطي Linear Search وطباعة جميع مواقع ظهور العنصر)",
              "10. Values above average (حساب القيم التي تفوق المتوسط وعددها)"
            ]
          },
          {
            level: "Level 3 - Transformations",
            arabicLevel: "المستوى 3: التكرار والترتيب والفرز (5 مسائل)",
            tasks: [
              "11. Second-largest distinct value (إيجاد ثاني أكبر قيمة فريدة بدون ترتيب المصفوفة)",
              "12. Frequency table (جدول تكرار كل قيمة بدون استخدام Map أو Set)",
              "13. Unique values only (طباعة القيم الفريدة دون تكرار بنفس ترتيب الظهور الأول)",
              "14. Rotate right (تدوير عناصر المصفوفة لليمين بمقدار خانة أو أكثر)",
              "15. Sort and merge (فرز مصفوفتين ودمجهما في مصفوفة مرتبة بدون دوال جاهزة)"
            ]
          },
          {
            level: "Level 4 - 2D Array Challenges",
            arabicLevel: "المستوى 4: تحديات المصفوفات ثنائية الأبعاد (5 مسائل)",
            tasks: [
              "16. Row and column reports (حساب مجاميع الصفوف والأعمدة لمصفوفة 3x4 وتحديد أكبر صف)",
              "17. Diagonal analysis (حساب مجموع القطر الرئيسي والثانوي وتحديد الأكبر)",
              "18. Matrix transpose (تدوير المصفوفة وتحويل الصفوف إلى أعمدة)",
              "19. Matrix addition (جمع مصفوفتين متطابقتي الأبعاد وتخزين الناتج في مصفوفة ثالثة)",
              "20. Student grade dashboard (سجل درجات الطلاب: إجمالي ومتوسط كل طالب واختبار، وأعلى درجة)"
            ]
          }
        ]
      }
    ],
    resources: [],
    practicalResources: [
      {
        id: 1,
        title: "سلايدات مراجعة وتأسيس C++ (Revision Slides)",
        type: "سلايدات مراجعة",
        year: "م.م. أحمد حسام",
        size: "86 KB",
        notes: "سلايدات تمهيدية ومراجعة مكثفة لقواعد لغة C++ الأساسية لسكاشن تراكيب البيانات",
        fileUrl: "https://drive.google.com/file/d/1C-7-6sPIecltpupe99XMNw88JQEzIlQp/view",
        folderUrl: "https://drive.google.com/drive/folders/1p1zE6XWM2uYRn7_MnnkN51IL_HWirf-m",
        badge: "مراجعة مهمة"
      },
      {
        id: 2,
        title: "شيت المهام والتكليفات العملية (20 Progressive Array Tasks)",
        type: "شيت تكليفات",
        year: "م.م. أحمد حسام (5 صفحات)",
        size: "77 KB",
        notes: "شيت الـ 20 مسألة العملية المتدرجة على المصفوفات في C++ (المستويات الأربعة)",
        fileUrl: "https://drive.google.com/file/d/1rLUdeP0zDuERtcxUG-MUc0ur0LQmCClW/view",
        folderUrl: "https://drive.google.com/drive/folders/1p1zE6XWM2uYRn7_MnnkN51IL_HWirf-m",
        badge: "تاسك سكشن 1"
      }
    ]
  },

  // ============================================================================
  // 5. أنظمة التشغيل (Operating System)
  // ============================================================================
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
    driveFolderUrl: "https://drive.google.com/drive/folders/1lZPnaH3syw1aVSCB01MuH_62w9xvkeNZ",
    driveFolderId: "1lZPnaH3syw1aVSCB01MuH_62w9xvkeNZ",

    explanationSite: {
      url: "https://drive.google.com/drive/folders/1lZPnaH3syw1aVSCB01MuH_62w9xvkeNZ",
      title: "مستودع محاضرات وشروحات أنظمة التشغيل",
      description: "المحاضرات الرسمية المعتمدة مع شروحات عملية لتثبيت نظام Linux Ubuntu على VirtualBox وأفضل شروحات اليوتيوب.",
      status: "متصل بـ Google Drive",
      features: [
        "سلايدات رسميّة Chapter 1 و Chapter 2 بصيغة PowerPoint",
        "دليل فيديو عملي لإعداد Ubuntu على VirtualBox للعملي",
        "شروحات باللغة العربية مع م. أحمد حجاج وحسن الأنصاري"
      ]
    },

    // شروحات الفيديو وقوائم التشغيل المعتمدة (من ملف Studying Resources)
    videoExplanations: [
      {
        id: 1,
        title: "تثبيت وتجهيز نظام Ubuntu OS على برنامج VirtualBox للعملي",
        subtitle: "1- Installing ubuntu OS on VirtualBox - خطوة بخطوة للسكشن والعملي",
        url: "https://youtu.be/np_3cK_n1ic?si=yqeETqhS8phdQTFk",
        type: "video",
        typeArabic: "دليل عملي",
        language: "عربي",
        author: "شرح إعداد اللاب",
        badge: "ضروري للمعمل"
      },
      {
        id: 2,
        title: "بلاي ليست م. أحمد حجاج - نظم التشغيل (Operating Systems)",
        subtitle: "01–Operating Systems | Ch1-1 | Introduction | نظم التشغيل | مقدمة + أهداف الكورس",
        url: "https://youtu.be/NzyuxPtrRRM?si=Wx3UitD_sB5J0NrE",
        type: "playlist",
        typeArabic: "قائمة تشغيل شاملة",
        language: "عربي",
        author: "م. أحمد حجاج",
        badge: "شرح ممتاز جداً"
      },
      {
        id: 3,
        title: "بلاي ليست حسن الأنصاري - شرح أنظمة التشغيل",
        subtitle: "Operating System Chapter 1 part 1 - شرح وافٍ لمفاهيم نظم التشغيل",
        url: "https://youtu.be/qLxlWgm-N50?si=Cb2uJ6JKtNRCiWE2",
        type: "playlist",
        typeArabic: "قائمة تشغيل",
        language: "عربي",
        author: "حسن الأنصاري",
        badge: "شرح مفصل"
      },
      {
        id: 4,
        title: "كورس نظم التشغيل بالعربي - ما هي أنظمة التشغيل؟",
        subtitle: "Operating Systems In Arabic - What are Operating systems? - chapter 1 Part 1",
        url: "https://youtu.be/BW90V5-J4a0?si=SJQ4CZOXCaZMdY-_",
        type: "video",
        typeArabic: "فيديو تأسيسي",
        language: "عربي",
        author: "مصدر عربي",
        badge: "تأسيس المفاهيم"
      }
    ],

    // محاضرات المادة على Google Drive
    lectures: [
      {
        id: 1,
        chapter: "Chapter 1",
        title: "Introduction to Operating Systems",
        arabicTitle: "المحاضرة 1: مقدمة في أنظمة التشغيل، أهدافها، وبنية النظام",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 1,
        date: "المحاضرة 1",
        fileType: "pptx",
        pages: 45,
        size: "PowerPoint PPTX",
        driveId: "14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M",
        driveViewUrl: "https://drive.google.com/file/d/14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M/view",
        drivePreviewUrl: "https://drive.google.com/file/d/14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M",
        pdfUrl: "https://drive.google.com/file/d/14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M/preview",
        topics: [
          "What Operating Systems Do (User View vs System View)",
          "Computer System Organization & Architecture",
          "Interrupt Handling & Storage Structure",
          "Operating-System Operations (Dual-Mode, Timer)",
          "Resource Management: Process, Memory, Storage Management"
        ],
        notes: "سلايدات الفصل الأول الرسمية المعتمدة (Chapter1.pptx) على Google Drive"
      },
      {
        id: 2,
        chapter: "Chapter 2",
        title: "Operating-System Structures & System Calls",
        arabicTitle: "المحاضرة 2: هياكل نظم التشغيل، استدعاءات النظام (System Calls)، والخدمات",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 2,
        date: "المحاضرة 2",
        fileType: "pptx",
        pages: 50,
        size: "PowerPoint PPTX",
        driveId: "1DDEour98ioHVMAHbTVzHy_hfgR-zpaTW",
        driveViewUrl: "https://drive.google.com/file/d/1DDEour98ioHVMAHbTVzHy_hfgR-zpaTW/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1DDEour98ioHVMAHbTVzHy_hfgR-zpaTW/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1DDEour98ioHVMAHbTVzHy_hfgR-zpaTW",
        pdfUrl: "https://drive.google.com/file/d/1DDEour98ioHVMAHbTVzHy_hfgR-zpaTW/preview",
        topics: [
          "Operating-System Services (UI, Program Execution, I/O)",
          "User Operating-System Interface (CLI & GUI)",
          "System Calls: Concept, APIs, and Parameter Passing",
          "Types of System Calls (Process, File, Device, Info, Comm)",
          "Operating-System Design & Architecture (Monolithic vs Microkernel)"
        ],
        notes: "سلايدات الفصل الثاني الرسمية المعتمدة (Chapter2.pptx) على Google Drive"
      }
    ],
    sections: [],
    assignments: [],
    resources: []
  },

  // ============================================================================
  // 6. كتابة التقارير الفنية والأكاديمية (Report Writing)
  // ============================================================================
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
    driveFolderUrl: "https://drive.google.com/drive/folders/1VqzBZS2Bf8Okx-vKTCINkXzeT_vA2TLh",
    driveFolderId: "1VqzBZS2Bf8Okx-vKTCINkXzeT_vA2TLh",

    explanationSite: {
      url: "https://drive.google.com/drive/folders/1VqzBZS2Bf8Okx-vKTCINkXzeT_vA2TLh",
      title: "مستودع محاضرات ومراجع كتابة التقارير الفنية",
      description: "المحاضرات الرسمية المعتمدة مع كتاب المرجع الأساسي وقوائم تشغيل ممتازة لشرح مهارات العرض وصياغة التقارير.",
      status: "متصل بـ Google Drive",
      features: [
        "سلايدات المحاضرات الرسمية 1 و 2 و 3 بصيغة PPTX و PDF",
        "المرجع الأكاديمي المعتمد (Book.pdf) لتوثيق المشاريع",
        "شروحات فيديو ممتازة مع د. إبراهيم أسامة ود. الشيماء طنطاوي"
      ]
    },

    // شروحات الفيديو وقوائم التشغيل المعتمدة (من ملف Studying Resources)
    videoExplanations: [
      {
        id: 1,
        title: "كورس كتابة التقارير الفنية - د. إبراهيم أسامة",
        subtitle: "Course Orientation - Introduction to Technical Writing مقدمة عن كتابة التقارير",
        url: "https://youtu.be/qv6ZE2_kkHs?si=5POuFNVYvl-90Amw",
        type: "playlist",
        typeArabic: "قائمة تشغيل",
        language: "عربي",
        author: "د. إبراهيم أسامة",
        badge: "شرح أكاديمي ممتاز"
      },
      {
        id: 2,
        title: "مهارات كتابة التقارير والعرض الفعال - د. الشيماء طنطاوي",
        subtitle: "Report Writing and Presentation Skills [Introduction] مقدمة كتابة التقارير ومهارات العرض",
        url: "https://youtu.be/mdjyeHaWCgU?si=UR85e-OqMTTX4_Wo",
        type: "playlist",
        typeArabic: "قائمة تشغيل",
        language: "عربي",
        author: "د. الشيماء طنطاوي",
        badge: "شرح مهارات العرض"
      }
    ],

    // محاضرات المادة على Google Drive
    lectures: [
      {
        id: 1,
        chapter: "Lecture 1",
        title: "Introduction to Technical & Report Writing",
        arabicTitle: "المحاضرة 1: مقدمة في كتابة التقارير الفنية وأهداف التوثيق",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 1,
        date: "المحاضرة 1",
        fileType: "pptx",
        pages: 32,
        size: "PowerPoint PPTX",
        driveId: "1pn1-irVDmYKJOWAanLjfPw0LdyE6XEUX",
        driveViewUrl: "https://drive.google.com/file/d/1pn1-irVDmYKJOWAanLjfPw0LdyE6XEUX/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1pn1-irVDmYKJOWAanLjfPw0LdyE6XEUX/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1pn1-irVDmYKJOWAanLjfPw0LdyE6XEUX",
        pdfUrl: "https://drive.google.com/file/d/1pn1-irVDmYKJOWAanLjfPw0LdyE6XEUX/preview",
        topics: [
          "What is Technical Writing?",
          "Characteristics of Effective Reports (Accuracy, Clarity, Conciseness)",
          "Audience Analysis & Purpose Definition",
          "Stages of the Writing Process (Planning, Drafting, Revising)"
        ],
        notes: "سلايدات المحاضرة 1 الرسمية المعتمدة على Google Drive"
      },
      {
        id: 2,
        chapter: "Lecture 2",
        title: "Report Structure, Organization & Professional Style",
        arabicTitle: "المحاضرة 2: هيكل التقرير الأكاديمي، التنظيم والأسلوب اللغوي",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 2,
        date: "المحاضرة 2",
        fileType: "pptx",
        pages: 36,
        size: "PowerPoint PPTX",
        driveId: "1XhZX2FcPXOWaulPdg9EV3C8ryJobKqb0",
        driveViewUrl: "https://drive.google.com/file/d/1XhZX2FcPXOWaulPdg9EV3C8ryJobKqb0/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1XhZX2FcPXOWaulPdg9EV3C8ryJobKqb0/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1XhZX2FcPXOWaulPdg9EV3C8ryJobKqb0",
        pdfUrl: "https://drive.google.com/file/d/1XhZX2FcPXOWaulPdg9EV3C8ryJobKqb0/preview",
        topics: [
          "Standard Sections: Title Page, Abstract, Table of Contents",
          "Introduction, Methodology, Results and Discussion",
          "Conclusion, Recommendations and Appendices",
          "Professional Academic Tone and Grammar Rules"
        ],
        notes: "سلايدات المحاضرة 2 الرسمية المعتمدة على Google Drive"
      },
      {
        id: 3,
        chapter: "Lecture 3",
        title: "Data Presentation, Visuals, Graphs & Layout",
        arabicTitle: "المحاضرة 3: عرض البيانات والرسوم البيانية وتنسيق الجداول",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 3,
        date: "المحاضرة 3",
        fileType: "pptx",
        pages: 40,
        size: "PowerPoint PPTX",
        driveId: "1dxl9Yo5JxitLH5UYIb-Yy5zQp620KHfn",
        driveViewUrl: "https://drive.google.com/file/d/1dxl9Yo5JxitLH5UYIb-Yy5zQp620KHfn/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1dxl9Yo5JxitLH5UYIb-Yy5zQp620KHfn/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1dxl9Yo5JxitLH5UYIb-Yy5zQp620KHfn",
        pdfUrl: "https://drive.google.com/file/d/1dxl9Yo5JxitLH5UYIb-Yy5zQp620KHfn/preview",
        topics: [
          "Integrating Visual Elements (Tables, Bar Charts, Line Graphs)",
          "Captions, Labeling and In-text Referencing",
          "Document Typography and Layout Design",
          "Avoiding Visual Distortions and Misinterpretations"
        ],
        notes: "سلايدات المحاضرة 3 الرسمية المعتمدة على Google Drive"
      },
      {
        id: 4,
        chapter: "Lecture 3 (Notes)",
        title: "Report Writing Summary & Guidelines",
        arabicTitle: "المحاضرة 3 (ملف PDF): ملخص إرشادات وقوالب كتابة التقرير",
        doctor: "سلايدات موحدة للدفعة",
        doctorNote: "B1 • B2 • B3",
        week: 3,
        date: "المحاضرة 3 (ملخص PDF)",
        fileType: "pdf",
        pages: 25,
        size: "Google Drive PDF",
        driveId: "1dqrlm4fiQfriXf-tiQs8UCniiQPQJUue",
        driveViewUrl: "https://drive.google.com/file/d/1dqrlm4fiQfriXf-tiQs8UCniiQPQJUue/view",
        drivePreviewUrl: "https://drive.google.com/file/d/1dqrlm4fiQfriXf-tiQs8UCniiQPQJUue/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=1dqrlm4fiQfriXf-tiQs8UCniiQPQJUue",
        pdfUrl: "https://drive.google.com/file/d/1dqrlm4fiQfriXf-tiQs8UCniiQPQJUue/preview",
        topics: [
          "Summary of Essential Report Guidelines",
          "Citation Formatting (IEEE & APA)",
          "Checklist Before Final Submission"
        ],
        notes: "نسخة PDF جاهزة للمعاينة المباشرة (lecture 3 report writing.pdf) على Google Drive"
      },
      {
        id: 5,
        chapter: "Textbook",
        title: "Technical Report Writing & Presentation Skills Book",
        arabicTitle: "كتاب ومرجع المادة الرسمي في كتابة التقارير ومهارات العرض",
        doctor: "كتاب المادة المعتمد",
        doctorNote: "جميع المجموعات",
        week: 0,
        date: "المرجع المعتمد",
        fileType: "pdf",
        pages: 310,
        size: "الكتاب الكامل PDF",
        driveId: "15D-XOsX3l2dK-yg5uDUcHhQd6inSa6yh",
        driveViewUrl: "https://drive.google.com/file/d/15D-XOsX3l2dK-yg5uDUcHhQd6inSa6yh/view",
        drivePreviewUrl: "https://drive.google.com/file/d/15D-XOsX3l2dK-yg5uDUcHhQd6inSa6yh/preview",
        driveDownloadUrl: "https://drive.google.com/uc?export=download&id=15D-XOsX3l2dK-yg5uDUcHhQd6inSa6yh",
        pdfUrl: "https://drive.google.com/file/d/15D-XOsX3l2dK-yg5uDUcHhQd6inSa6yh/preview",
        topics: [
          "Comprehensive Guide to Engineering and Scientific Writing",
          "Structuring Proposals, Technical Reports, and Theses",
          "Presentation Skills, Slide Design and Oral Delivery"
        ],
        notes: "الكتاب الأكاديمي المعتمد للمادة (Book.pdf) على Google Drive"
      }
    ],
    sections: [],
    assignments: [],
    resources: []
  }
];

if (typeof window !== "undefined") {
  window.PORTAL_CONFIG = PORTAL_CONFIG;
  window.COURSES_DATA = COURSES_DATA;
}
