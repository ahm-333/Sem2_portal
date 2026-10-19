const fs = require('fs');
const path = require('path');

const slidesData = [
  {
    num: 1,
    title: "Lecture 2: Databases and Database Users",
    arabicTitle: "غلاف المحاضرة وبيانات المقرر (د. محمد ماهر)",
    image: "materials/slides/db-lec2/slide_1.png",
    coreSummary: "المحاضرة الرسمية الأولى للدفعة بتبدأ من هنا بعنوان Databases and Database Users وبيقدمها الدكتور محمد ماهر وبتغطي الشابتر الأول من المرجع الأساسي.",
    explanationIntro: "أهلاً بيك يا بطل في أول محاضرة فعلية لمنهج قواعد البيانات مع الدكتور محمد ماهر؛ السلايد دي هي واجهة المحاضرة وبتحدد عنوان الشابتر: 'Databases and Database Users'. الهدف الأساسي هنا إنك تفهم يعني إيه Database بجد، ومين الناس اللي بيتعاملوا معاها، وليه العالم كله ساب الملفات العادية وبقى شغال بنظم قواعد البيانات الحديثة.",
    points: [
      {
        badge: "المحاضرة والشابتر",
        title: "عنوان المحاضرة في المنهج",
        desc: "المحاضرة رقم 2 في الجدول وهي بتغطي كامل Chapter 1 من كتاب Fundamentals of Database Systems المعتمد."
      },
      {
        badge: "أستاذ المادة",
        title: "د. محمد ماهر (Dr. Mohamed Maher)",
        desc: "أستاذ المادة بقسم نظم المعلومات؛ وسلايداته هي المعتمدة والموحدة لكافة مجموعات الدفعة."
      },
      {
        badge: "خطة الشرح",
        title: "المحتوى اللي هنركز عليه",
        desc: "هنتعلم الفروق الجوهرية بين البيانات التقليدية والحديثة، التعريفات الـ 5 الأساسية، معمارية الـ DBMS، ومين هم الـ Actors on the Scene والـ Workers behind the Scene."
      }
    ],
    keywords: [
      { en: "Databases and Database Users", ar: "قواعد البيانات ومستخدموها" },
      { en: "Dr. Mohamed Maher", ar: "د. محمد ماهر" },
      { en: "Database Systems", ar: "أنظمة قواعد البيانات" }
    ],
    triggers: [
      {
        trigger: "لو سألك عن عنوان الشابتر الأول ومحاضرة د. محمد ماهر في المنهج:",
        choose: "تختار: Databases and Database Users",
        note: "ده المدخل التأسيسي المعتمد للفصل الأول من كتاب Elmasri."
      }
    ],
    tricks: "المحاضرة الأولى الفعلية للدفعة بتبدأ من هنا؛ كل أسئلة الميدتيرم والفاينل النظري بتيجي بالنص من المصطلحات والمقارنات الموجودة في السلايدات دي.",
    quiz: {
      question: "According to Slide 1, what is the exact title and instructor of this lecture?",
      options: [
        "Lecture 2: Databases and Database Users - Dr. Mohamed Maher",
        "Lecture 1: Introduction to Computer Architecture - Dr. Ali",
        "Lecture 3: Advanced Relational Algebra - Dr. Tarek",
        "Lecture 2: Operating System Internals - Dr. Sara"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: الإجابة واضحة ومباشرة من السلايد الأولى؛ المحاضرة بعنوان 'Databases and Database Users' وبيقدمها د. محمد ماهر، وباقي الاختيارات لمواد ودكاترة تانية خالص."
    }
  },
  {
    num: 2,
    title: "OUTLINE",
    arabicTitle: "مخطط موضوعات المحاضرة (الخريطة الذهنية)",
    image: "materials/slides/db-lec2/slide_2.png",
    coreSummary: "فهرس المحاضرة بيوضح الـ 10 محاور الأساسية اللي هندرسهم بالتفصيل من أول أنواع الـ Databases لحد إمتى منستخدمش قواعد بيانات.",
    explanationIntro: "السلايد دي بتديك الخريطة الذهنية (Roadmap) للمحاضرة كلها في 10 نقط أساسية؛ الدكتور ماشي بترتيب منطقي جداً: بيبدأ بالأنواع والتطبيقات، بعدين التعريفات الأساسية ووظائف الـ DBMS، ويديك مثال عملي لجامعة (UNIVERSITY)، بعد كده يدخل في خصائص الـ Database Approach وتصنيف المستخدمين ومزايا النظام وحالات عدم استخدامه.",
    points: [
      {
        badge: "المحاور 1 - 3",
        title: "الأساسيات والمفاهيم",
        desc: "أنواع قواعد البيانات وتطبيقاتها (Types & Applications)، التعريفات الأساسية (Basic Definitions)، ووظائف محرك الـ DBMS المعتادة."
      },
      {
        badge: "المحاور 4 - 5",
        title: "المثال العملي والمعمارية",
        desc: "مثال تطبيقي لجامعة ومقرراتها (UNIVERSITY Example)، والخصائص الجوهرية اللي بتميز الـ Database Approach عن الـ File System."
      },
      {
        badge: "المحاور 6 - 7",
        title: "المستخدمون والمزايا",
        desc: "أنواع مستخدمي قواعد البيانات (Users)، ومزايا الاعتماد على الـ Database Approach في الشركات والمؤسسات."
      },
      {
        badge: "المحاور 8 - 10",
        title: "التطور والحالات الخاصة",
        desc: "تاريخ قواعد البيانات، وتوسيع إمكانياتها، وإمتى منستخدمش DBMS ونكتفي بملفات عادية."
      }
    ],
    keywords: [
      { en: "Outline", ar: "مخطط ومحاور المحاضرة" },
      { en: "Database Applications", ar: "تطبيقات قواعد البيانات" },
      { en: "Characteristics of DB Approach", ar: "خصائص مدخل قواعد البيانات" }
    ],
    triggers: [
      {
        trigger: "لو سألك عن موضوع رئيسي في الـ Outline بيقارن أسلوب قواعد البيانات بنظم الملفات:",
        choose: "تختار: Main Characteristics of the Database Approach",
        note: "ده المحور الخامس في الفهرس وهو أهم جزء نظري في المحاضرة."
      }
    ],
    tricks: "المخطط ده هو فهرس أسئلة الامتحان؛ افتكر دايماً إن الكورس بتاعنا بيركز تحديداً على الـ Traditional Applications زي ما هنشوف في السلايد الجاية.",
    quiz: {
      question: "Which of the following topics is explicitly listed in the lecture OUTLINE (Slide 2)?",
      options: [
        "Main Characteristics of the Database Approach",
        "Microprocessor Assembly Instruction Set",
        "Bresenham's Circle Drawing Algorithm",
        "CPU Scheduling and Virtual Memory Management"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد التانية بتعرض الفهرس ومن ضمنه 'Main Characteristics of the Database Approach'، أما باقي الاختيارات فدي موضوعات معمارية ورسم ونظم تشغيل مش تبعنا هنا."
    }
  },
  {
    num: 3,
    title: "Types of Databases and Database Applications",
    arabicTitle: "أنواع قواعد البيانات وتطبيقاتها (تقليدية وحديثة)",
    image: "materials/slides/db-lec2/slide_3.png",
    coreSummary: "المقارنة بين التطبيقات التقليدية (أرقام ونصوص) والتطبيقات الحديثة، مع تنبيه مهم إن كورس الكلية بيركز على التطبيقات التقليدية.",
    explanationIntro: "هنا الدكتور بيقسم قواعد البيانات لنوعين كبار: التطبيقات التقليدية (Traditional Applications) اللي هي معتمدة على الأرقام والنصوص، والتطبيقات الحديثة (Recent Applications) زي الوسائط المتعددة ونظم الخرائط GIS والجينات والبيانات الضخمة. ولاحظ الجملة الأخيرة اللي تحت خالص لأنها بتيجي تريكة في الامتحانات: 'Our course focuses on traditional applications'.",
    points: [
      {
        badge: "Traditional",
        title: "التطبيقات التقليدية (Traditional Applications)",
        desc: "قواعد البيانات الرقمية والنصية (Numeric and Textual Databases) زي بيانات الطلاب، الحسابات البنكية، وسجلات الموظفين."
      },
      {
        badge: "Recent (1)",
        title: "الوسائط المتعددة والخرائط والجينات",
        desc: "الوسائط (Multimedia: صور وفيديوهات وأصوات)، نظم المعلومات الجغرافية (GIS: خرائط وأقمار صناعية)، وقواعد البيانات البيولوجية والجينومية (Biological and Genome)."
      },
      {
        badge: "Recent (2)",
        title: "المستودعات والبيانات الضخمة",
        desc: "مستودعات البيانات (Data Warehouses)، قواعد بيانات الهواتف (Mobile DBs)، النظم اللحظية (Real-time and Active)، والـ Bigdata."
      },
      {
        badge: "تريكة الكورس",
        title: "نطاق وتركيز المقرر",
        desc: "جملة صريحة في السلايد: 'Our course focuses on traditional applications' (تركيز الكورس بالكامل على التطبيقات التقليدية)."
      }
    ],
    keywords: [
      { en: "Traditional Applications", ar: "تطبيقات تقليدية (أرقام ونصوص)" },
      { en: "Numeric and Textual Databases", ar: "قواعد بيانات رقمية ونصية" },
      { en: "Multimedia Databases", ar: "قواعد بيانات الوسائط المتعددة" },
      { en: "GIS Databases", ar: "نظم المعلومات الجغرافية" },
      { en: "Data Warehouses", ar: "مستودعات البيانات" },
      { en: "Bigdata", ar: "البيانات الضخمة" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'Numeric and Textual Databases'",
        choose: "تختار فوراً: Traditional Applications",
        note: "القواعد الرقمية والنصية هي النوع التقليدي."
      },
      {
        trigger: "لو سألك في الصح والغلط: 'Does our database course focus on Big Data and Multimedia?'",
        choose: "تختار فوراً: False / No",
        note: "لأن السلايد كاتبة بالنص: Our course focuses on traditional applications."
      }
    ],
    tricks: "فخ مشهور جداً: الدكتور ممكن يجيبلك سؤال هل الكورس بيركز على الـ Big Data؟ الإجابة لأ، تركيزنا في الترم ده على الـ Traditional Numeric and Textual Databases.",
    quiz: {
      question: "According to Slide 3, what type of database applications does this course primarily focus on?",
      options: [
        "Traditional applications (Numeric and Textual databases)",
        "Biological and Genome Databases exclusively",
        "Advanced Mobile Big Data Streaming",
        "Geographic Information Systems (GIS) mapping"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد كاتبة تحت بخط واضح 'Our course focuses on traditional applications' يعني التطبيقات الرقمية والنصية التقليدية، مش الـ Genome ولا الـ Big Data."
    }
  },
  {
    num: 4,
    title: "Recent Developments (1)",
    arabicTitle: "التطورات الحديثة: السوشيال ميديا ومحركات البحث",
    image: "materials/slides/db-lec2/slide_4.png",
    coreSummary: "ظهور منصات التواصل ومحركات البحث خلى كل حاجة بنعملها على النت عبارة عن داتا ضخمة محتاجة مستودعات تخزين وفهرسة فورية.",
    explanationIntro: "السلايد دي بتشرح إزاي مفهوم البيانات انفجر في السنين الأخيرة؛ زمان كانت الداتا مجرد جدول فيه اسم ورقم، دلوقتي السوشيال ميديا زي فيسبوك وتويتر ولينكد إن بتجمع بوستات وتغريدات وصور وفيديوهات، وكل بوست أو صورة ده 'Data'. ونفس الكلام محركات البحث زي جوجل وبينج وياهاو بتجمع أرشيف عملاق من صفحات الويب عشان تقدر تبحث فيها في أجزاء من الثانية.",
    points: [
      {
        badge: "Social Media",
        title: "شبكات التواصل الاجتماعي (Social Networks)",
        desc: "منصات زي Facebook و Twitter و Linked-In بتخزن تفاعلات الناس، البوستات، التويتات، الصور، والفيديوهات."
      },
      {
        badge: "مفهوم الداتا",
        title: "All of the above constitutes data",
        desc: "كل اللي بتعمله على السوشيال ميديا بيعتبر 'Data' ولازم تتخزن وتتعالج بكفاءة."
      },
      {
        badge: "Search Engines",
        title: "محركات البحث (Google, Bing, Yahoo)",
        desc: "بتعمل مستودعات وأرشيف ضخم (Repository of web pages) عشان تخدم عمليات البحث الفوري بدقة وسرعة."
      }
    ],
    keywords: [
      { en: "Social Networks", ar: "شبكات التواصل الاجتماعي" },
      { en: "Search Engines", ar: "محركات البحث" },
      { en: "Repository of web pages", ar: "مستودع صفحات الويب" },
      { en: "Constitutes data", ar: "يشكل ويمثل بيانات" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'collect their own repository of web pages for searching purposes'",
        choose: "تختار فوراً: Search Engines (Google, Bing, Yahoo)",
        note: "محركات البحث هي اللي بتجمع الـ web pages repository."
      },
      {
        trigger: "لو سألك عن المنصات اللي بتجمع 'posts, tweets, photos, videos':",
        choose: "تختار: Social Networks (Facebook, Twitter, LinkedIn)",
        note: "كل المحتوى ده بيمثل داتا حديثة غير مهيكلة."
      }
    ],
    tricks: "خد بالك: محركات البحث بتخزن نسخ من صفحات الويب في Repository خاص بيها عشان لما تبحث ترجعلك النتيجة من الفهرس بتاعها مش بتروح تلف على النت كله وقت البحث.",
    quiz: {
      question: "Why do search engines like Google, Bing, and Yahoo collect massive repositories of web pages?",
      options: [
        "For searching and indexing purposes",
        "To replace computer hardware chips",
        "To bypass database security permissions",
        "To convert textual data into electrical power"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: محركات البحث بتجمع صفحات الويب في Repository عشان تستخدمها في البحث والفهرسة (For searching purposes) لما أي مستخدم يدخل يبحث."
    }
  },
  {
    num: 5,
    title: "Basic Definitions",
    arabicTitle: "التعريفات الأساسية: Database, Data, Mini-world, DBMS, DB System",
    image: "materials/slides/db-lec2/slide_5.png",
    coreSummary: "أهم سلايد نظري في الشابتر: بتعرف الـ 5 مصطلحات الجوهرية (قاعدة البيانات، البيانات، العالم المصغر UoD، محرك الـ DBMS، ونظام قاعدة البيانات).",
    explanationIntro: "ركز جداً في السلايد دي لأن بيجي منها أسئلة مضمونة في الميدتيرم والفاينل! الدكتور بيعرف 5 مصطلحات مينفعش طالب حاسبات ميعرفهمش بالمللي: يعني إيه Database؟ مجموعة بيانات مترابطة. يعني إيه Data؟ حقائق معروفة ومسجلة وليها معنى ضمني. يعني إيه Mini-world أو UoD؟ حتة من الواقع بنخزن بياناتها. يعني إيه DBMS؟ البرنامج اللي بيعمل ويدير القاعدة. ويعني إيه Database System؟ البرنامج مع الداتا نفسها.",
    points: [
      {
        badge: "Database",
        title: "قاعدة البيانات (Database)",
        desc: "مجموعة من البيانات المترابطة منطقياً وليها علاقة ببعض (A collection of related data)."
      },
      {
        badge: "Data",
        title: "البيانات (Data)",
        desc: "حقائق معروفة نقدر نسجلها وليها معنى ضمني مفهوم (Known facts that can be recorded and have an implicit meaning)."
      },
      {
        badge: "Mini-world (UoD)",
        title: "العالم المصغر (Universe of Discourse)",
        desc: "جزء من العالم الواقعي بنخزن بياناته عندنا (زي درجات وسجلات طلاب جامعة)؛ وأي تعديل في الواقع بينعكس فوراً في الداتا بيز."
      },
      {
        badge: "DBMS",
        title: "نظام إدارة قواعد البيانات (DBMS)",
        desc: "حزمة برمجية أو سوفت وير (Software package/system) مسؤول عن تسهيل إنشاء وصيانة قاعدة البيانات (Creation and maintenance)."
      },
      {
        badge: "Database System",
        title: "نظام قاعدة البيانات (Database System)",
        desc: "برنامج الـ DBMS ومعاه البيانات المتخزنة نفسها (DBMS software together with data itself)، وساعات بيشمل البرامج التطبيقية كمان."
      }
    ],
    keywords: [
      { en: "Database", ar: "قاعدة بيانات (بيانات مترابطة)" },
      { en: "Data", ar: "بيانات (حقائق مسجلة ذات معنى)" },
      { en: "Mini-world / UoD", ar: "العالم المصغر / فضاء الحوار" },
      { en: "DBMS", ar: "برنامج نظام إدارة قواعد البيانات" },
      { en: "Database System", ar: "النظام المتكامل (البرنامج + الداتا)" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'A collection of related data'",
        choose: "تختار فوراً: Database",
        note: "ده التعريف القياسي لقاعدة البيانات."
      },
      {
        trigger: "لو شوفت: 'Known facts that can be recorded and have an implicit meaning'",
        choose: "تختار فوراً: Data",
        note: "ده التعريف الأكاديمي الحرفي للبيانات."
      },
      {
        trigger: "لو شوفت: 'Some part of the real world' أو جابلك اختصار 'UoD':",
        choose: "تختار فوراً: Mini-world (Universe of Discourse)",
        note: "UoD هي الكلمة المرادفة لـ Mini-world."
      },
      {
        trigger: "لو شوفت: 'software package / system to facilitate creation and maintenance':",
        choose: "تختار فوراً: Database Management System (DBMS)",
        note: "الـ DBMS هو السوفت وير اللي بيدير القاعدة."
      },
      {
        trigger: "لو شوفت: 'The DBMS software together with the data itself':",
        choose: "تختار فوراً: Database System",
        note: "النظام الكامل هو السوفت وير + الداتا."
      }
    ],
    tricks: "أخطر فخ امتحاني: الفرق بين DBMS و Database System! لو قالك 'Software package' بس، تختار DBMS. لو قالك 'Software together with the data itself' تختار Database System.",
    quiz: {
      question: "What technical term describes 'some part of the real world about which data is stored in a database'?",
      options: [
        "Mini-world (Universe of Discourse - UoD)",
        "Operating System Kernel",
        "Network Protocol Buffer",
        "Central Processing Unit"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: الجزء من العالم الواقعي اللي بنخزن بياناته بنسميه Mini-world أو Universe of Discourse (UoD)، زي نظام شؤون الطلاب في الجامعة كده."
    }
  },
  {
    num: 6,
    title: "Basic Definitions (cont.)",
    arabicTitle: "التعريفات الأساسية: تعريف البيانات، الـ Meta-data، والعمليات",
    image: "materials/slides/db-lec2/slide_6.png",
    coreSummary: "إزاي بنعرف الداتا بيز (أنواع وقيود)، يعني إيه Meta-data وتخزينها في الـ Catalog، وعمليات الـ Manipulation (استرجاع وتعديل).",
    explanationIntro: "الدكتور بيكمل الأساسيات: لما تيجي تعمل داتا بيز، أول خطوة هي 'Defining' يعني بتحدد أنواع الأعمدة (Data types) والشروط والقيود (Constraints). الوصف ده كله اسمه 'Meta-data' (يعني داتا بتوصف الداتا)، ومحرك الـ DBMS بيخزنها في جدول خاص بيه اسمه 'Catalog' أو 'Dictionary'. بعد كده بتيجي مرحلة الـ 'Manipulating' اللي هي القراءة (Retrieval) والتعديل (Modification).",
    points: [
      {
        badge: "Defining",
        title: "تعريف قاعدة البيانات (Defining)",
        desc: "تحديد أنواع البيانات (Data types)، الهياكل (Structures)، والقيود والشروط (Constraints) للداتا اللي هتتخزن."
      },
      {
        badge: "Meta-data & Catalog",
        title: "البيانات الوصفية والكتالوج",
        desc: "الـ Meta-data هي توصيف الداتا بيز وقواعدها؛ ومحرك الـ DBMS بيخزنها في 'database catalog or dictionary'."
      },
      {
        badge: "Manipulating",
        title: "التعامل مع البيانات واستخدامها",
        desc: "بيشمل حاجتين: 1) الاسترجاع (Retrieval) عن طريق الاستعلامات والتقارير، 2) التعديل (Modification) بالإدراج والحذف والتحديث (Insert, Delete, Update)، والوصول عبر الويب."
      }
    ],
    keywords: [
      { en: "Defining a database", ar: "تعريف قاعدة البيانات وهياكلها" },
      { en: "Meta-data", ar: "البيانات الوصفية (وصف البيانات)" },
      { en: "Database Catalog / Dictionary", ar: "كتالوج أو قاموس قاعدة البيانات" },
      { en: "Retrieval", ar: "استرجاع وقراءة البيانات" },
      { en: "Modification", ar: "تعديل وتحديث البيانات" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'Database definition or descriptive information' أو 'Data about data':",
        choose: "تختار فوراً: Meta-data",
        note: "الميتا-داتا هي وصف الجداول والأنواع والقيود."
      },
      {
        trigger: "لو سألك: 'Where does the DBMS store the meta-data?':",
        choose: "تختار فوراً: Database catalog or dictionary",
        note: "الكتالوج هو المكان المخصص لتخزين الميتا-داتا في الـ DBMS."
      },
      {
        trigger: "لو جابلك: 'Insertions, deletions and updates to database content':",
        choose: "تختار: Modification (Manipulating)",
        note: "الإضافة والحذف والتعديل تندرج تحت الـ Modification."
      }
    ],
    tricks: "الميتا-داتا (Meta-data) مش داتا عادية بتاعة مستخدمين، دي الكتالوج الإرشادي اللي الـ DBMS بيبص فيه عشان يعرف الجداول معمولة إزاي وأعمدتها إيه.",
    quiz: {
      question: "Where does the DBMS store the database definition and descriptive information (meta-data)?",
      options: [
        "In the database catalog or dictionary",
        "Inside the client's web browser cookies",
        "Directly in the application source code",
        "On external printed paper manuals"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: الـ DBMS بيخزن الـ Meta-data ووصف الجداول في الـ Database Catalog أو الـ Dictionary، ومينفعش تكون في كود التطبيق أو الكوكيز."
    }
  },
  {
    num: 7,
    title: "Basic Definitions (cont.)",
    arabicTitle: "التعريفات الأساسية: مشاركة البيانات، البرامج، والاستعلامات",
    image: "materials/slides/db-lec2/slide_7.png",
    coreSummary: "مفهوم مشاركة قاعدة البيانات بين عدة مستخدمين في نفس الوقت، وإزاي البرنامج التطبيقي بيبعت Query للـ DBMS عشان يجيب الداتا.",
    explanationIntro: "السلايد دي بتوضح نقطتين في غاية الأهمية: يعني إيه 'Sharing a database'؟ يعني النظام بيسمح لمستخدمين وبرامج كتير يدخلوا على نفس قاعدة البيانات في نفس اللحظة (Simultaneously) من غير ما يحصل لخبطة. ويعني إيه 'Query'؟ ده الطلب أو الأمر اللي البرنامج بيبعته للـ DBMS عشان يرجعله داتا معينة.",
    points: [
      {
        badge: "Sharing",
        title: "مشاركة قاعدة البيانات (Sharing)",
        desc: "السماح لعدة مستخدمين وعدة برامج بالوصول في نفس اللحظة (Simultaneously) لقاعدة البيانات بدون تضارب."
      },
      {
        badge: "Application Program",
        title: "البرنامج التطبيقي (Application Program)",
        desc: "البرنامج اللي المبرمج بيكتبه عشان يتصل بالداتا بيز عن طريق إرسال استعلامات (Queries) للـ DBMS."
      },
      {
        badge: "Query",
        title: "الاستعلام (Query)",
        desc: "أمر موجه للـ DBMS بيتسبب في استرجاع وجلب بيانات معينة (Causes some data to be retrieved)."
      }
    ],
    keywords: [
      { en: "Sharing a database", ar: "مشاركة قاعدة البيانات بالتزامن" },
      { en: "Simultaneous access", ar: "وصول متزامن في نفس الوقت" },
      { en: "Application program", ar: "برنامج تطبيقي" },
      { en: "Query", ar: "استعلام وجلب بيانات" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'Allow multiple users and programs to access database simultaneously':",
        choose: "تختار فوراً: Sharing a database",
        note: "المشاركة المتزامنة هي ميزة الـ Sharing."
      },
      {
        trigger: "لو شوفت: 'Causes some data to be retrieved':",
        choose: "تختار فوراً: Query",
        note: "الـ Query هدفه الأساسي جلب واسترجاع البيانات."
      }
    ],
    tricks: "خد بالك إن التطبيق ملوش دعوة بالقرص الصلب ولا الملفات مباشرة؛ هو بيبعت Query للـ DBMS والـ DBMS هو اللي بيروح يجيب الداتا ويرجعها للتطبيق.",
    quiz: {
      question: "According to Slide 7, what is sent by an application program to the DBMS that causes data to be retrieved?",
      options: [
        "A Query",
        "A Hardware interrupt",
        "A Power surge",
        "An Operating system restart signal"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: التطبيق بيتواصل مع الـ DBMS عن طريق الـ Query عشان يسترجع الداتا المطلوبة."
    }
  },
  {
    num: 8,
    title: "Application Activities Against a Database",
    arabicTitle: "أنشطة التطبيقات: الاستعلامات والمعاملات (Queries vs Transactions)",
    image: "materials/slides/db-lec2/slide_8.png",
    coreSummary: "التطبيقات بتتعامل مع الداتا بيز بنوعين من الأنشطة: Queries (للقراءة)، و Transactions (للقراءة والتحديث)، ولازم تمنع غير المصرح لهم وتواكب التغييرات.",
    explanationIntro: "أي برنامج بيشتغل على داتا بيز بيعمل حاجتين رئيسيتين: يا إما بيبعت 'Queries' عشان يقرأ أجزاء من البيانات ويعرض النتيجة للمستخدم، يا إما بينفذ 'Transactions' (معاملات) والمعاملة دي مش بس قراءة، دي بتقرأ وتعدل قيم أو تنشئ داتا جديدة وتخزنها. ولازم التطبيق يضمن حظر أي مستخدم مش معاه تصريح (Unauthorized)، ويكون مرن عشان يواكب متطلبات الشغل اللي بتتغير دايماً.",
    points: [
      {
        badge: "Queries",
        title: "الاستعلامات (Queries)",
        desc: "بتوصل لأجزاء مختلفة من البيانات وتصيغ وتجهز النتيجة المطلوبة لعرضها."
      },
      {
        badge: "Transactions",
        title: "المعاملات (Transactions)",
        desc: "عمليات بتقرأ داتا وتحدث قيم معينة (Update values) أو تنشئ وتخزن بيانات جديدة في قاعدة البيانات."
      },
      {
        badge: "Security & Evolution",
        title: "الأمان ومواكبة المتطلبات",
        desc: "منع أي شخص غير مصرح له (Unauthorized users) من الوصول، ومواكبة رغبات واحتياجات المستخدمين المتغيرة باستمرار."
      }
    ],
    keywords: [
      { en: "Queries", ar: "استعلامات (قراءة وعرض)" },
      { en: "Transactions", ar: "معاملات (قراءة وتحديث وكتابة)" },
      { en: "Unauthorized access", ar: "وصول غير مصرح به" },
      { en: "Changing requirements", ar: "متطلبات متغيرة" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'may read some data and update certain values or generate new data':",
        choose: "تختار فوراً: Transactions",
        note: "المعاملة (Transaction) هي اللي بتعدل وتولد داتا جديدة مش الـ Query العادي."
      },
      {
        trigger: "لو شوفت: 'access different parts of data and formulate the result of a request':",
        choose: "تختار: Queries",
        note: "ده تعريف الاستعلام."
      }
    ],
    tricks: "الفرق بين Query و Transaction في كلمتين: الـ Query استعلام وقراءة، الـ Transaction قراءة وتعديل (Write/Update) لقيم في قاعدة البيانات.",
    quiz: {
      question: "Which database activity involves reading data and updating certain values or generating and storing new data?",
      options: [
        "Transactions",
        "Screen refreshes",
        "Static Queries",
        "Audio synthesis"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: الـ Transactions هي العمليات اللي بتقرأ الداتا وبتعمل Update لقيم معينة أو تخزن داتا جديدة في القاعدة."
    }
  },
  {
    num: 9,
    title: "Additional DBMS Functionality",
    arabicTitle: "الوظائف الإضافية للـ DBMS (الحماية من الأعطال والأمان والصيانة)",
    image: "materials/slides/db-lec2/slide_9.png",
    coreSummary: "وظائف الـ DBMS مش بس تخزين، دي بتشمل حماية النظام من الانهيار (System Protection)، الحماية الأمنية ضد الاختراق (Security)، وتطوير وصيانة النظام.",
    explanationIntro: "محرك الـ DBMS بيعمل شغل تقيل في الخلفية غير مجرد الرد على الاستعلامات؛ أولاً بيوفر 'System protection' ضد أعطال الهاردوير أو انهيار السوفت وير (Crashes). ثانياً بيوفر 'Security protection' عشان يحمي البيانات من الدخول غير المصرح به أو الهجمات الخبيثة (Malicious access). وأخيراً صيانة وتطوير النظام (Maintain & evolve) لمواكبة التغيرات.",
    points: [
      {
        badge: "System Protection",
        title: "حماية النظام (System Protection)",
        desc: "الحماية ضد أعطال الهاردوير أو توقف وانهيار البرمجيات المفاجئ (Hardware/software malfunction or crashes)."
      },
      {
        badge: "Security Protection",
        title: "الحماية الأمنية (Security Protection)",
        desc: "الحماية ضد الوصول غير المصرح به أو الهجمات الضارة والمخترقين (Unauthorized or malicious access)."
      },
      {
        badge: "Maintenance",
        title: "صيانة وتطوير النظام (Maintain the database system)",
        desc: "السماح للنظام بالتطور والتعديل مع تغير متطلبات العمل بمرور الوقت."
      }
    ],
    keywords: [
      { en: "System protection", ar: "حماية النظام من الأعطال والانهيار" },
      { en: "Crashes / Malfunction", ar: "انهيار وأعطال السيرفر والعتاد" },
      { en: "Security protection", ar: "حماية أمنية ضد الاختراق" },
      { en: "Maintain & Evolve", ar: "صيانة وتطوير النظام" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'protection against hardware or software malfunction (or crashes)':",
        choose: "تختار فوراً: System protection",
        note: "حماية الأعطال والانهيار هي حماية نظام (System)."
      },
      {
        trigger: "لو شوفت: 'protection against unauthorized or malicious access':",
        choose: "تختار فوراً: Security protection",
        note: "حماية الصلاحيات ومنع المخترقين هي حماية أمنية (Security)."
      }
    ],
    tricks: "فخ امتحاني: ميز بين System Protection (التعافي من انقطاع الكهرباء أو حرق السيرفر) و Security Protection (منع المتسللين وتحديد الصلاحيات بالباسورد).",
    quiz: {
      question: "Protection against hardware or software malfunction (or crashes) in a DBMS is classified as:",
      options: [
        "System protection",
        "Graphic acceleration",
        "Network load balancing",
        "Application debugging"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: الحماية ضد أعطال الهاردوير أو انهيار البرامج (Crashes) اسمها في السلايد 'System protection'، أما الحماية ضد الهجمات اسمها 'Security protection'."
    }
  },
  {
    num: 10,
    title: "Simplified database system environment",
    arabicTitle: "معمارية وبيئة نظام قواعد البيانات المبسطة (شكل 1.1)",
    image: "materials/slides/db-lec2/slide_10.png",
    coreSummary: "رسمة توضيحية لمعمارية النظام: المستخدمين والبرامج فوق، الـ DBMS في النص بيعالج الاستعلامات والوصول، والأسطوانتين تحت للميتا-داتا والداتا المخزنة.",
    explanationIntro: "الرسمة دي (Figure 1.1) بتوضح إزاي الداتا بتمشي في النظام: فوق خالص عندك الـ Users والـ Programmers، بيبعتوا استعلامات (Queries) أو برامج. الـ DBMS في النص متقسم جزأين: سوفت وير لمعالجة وتفسير الاستعلامات، وسوفت وير للوصول للداتا على الهارد ديسك. وتحت خالص عندك حاجتين منفصلتين: أسطوانة الـ Meta-Data (تعريف الجداول) وأسطوانة الـ Stored Database (الداتا الحقيقية).",
    points: [
      {
        badge: "الطبقة العليا",
        title: "المستخدمون والبرامج (Users & Queries)",
        desc: "المستخدمين والمبرمجين وتطبيقاتهم اللي بتبعت أوامر واستعلامات."
      },
      {
        badge: "قلب الـ DBMS",
        title: "برمجيات الـ DBMS المعمارية",
        desc: "مكون لمعالجة الاستعلامات (Software to Process Queries/Programs) ومكون للوصول الفعلي للتخزين (Software to Access Stored Data)."
      },
      {
        badge: "التخزين المزدوج",
        title: "الميتا-داتا مقابل البيانات المخزنة",
        desc: "أسطوانة للـ Meta-Data (Catalog) عشان الـ DBMS يفهم البنية، وأسطوانة للـ Stored Database اللي فيها بيانات السجلات."
      }
    ],
    keywords: [
      { en: "Simplified DB Environment", ar: "بيئة نظام قواعد البيانات المبسطة" },
      { en: "Process Queries/Programs", ar: "معالجة الاستعلامات والبرامج" },
      { en: "Access Stored Data", ar: "الوصول للبيانات المخزنة" },
      { en: "Stored Database Definition", ar: "تعريف قاعدة البيانات (الميتا-داتا)" }
    ],
    triggers: [
      {
        trigger: "لو سألك عن المكونين التخزينيين اللي موجودين تحت خالص في شكل 1.1:",
        choose: "تختار: Stored Database Definition (Meta-Data) and Stored Database",
        note: "دول الأسطوانتين اللي الـ DBMS بيتعامل معاهم."
      }
    ],
    tricks: "لاحظ إن سهم الدخول بيعدي على معالج الاستعلامات الأول، وبعدين يروح لمكون الوصول للبيانات، وده بدوره بيقرأ من الميتا-داتا عشان يعرف أماكن الحقول قبل ما يلمس الداتا الفعلية.",
    quiz: {
      question: "In the simplified database system environment (Figure 1.1), what component directly interprets and processes application queries before accessing stored data?",
      options: [
        "Software to Process Queries/Programs",
        "Direct Memory Access Chip",
        "The Display Monitor Driver",
        "Hardware Power Supply Unit"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: أول مكون بيستقبل الاستعلامات داخل الـ DBMS ويفسرها هو 'Software to Process Queries/Programs' قبل ما يبعتها لمكون الوصول للداتا."
    }
  },
  {
    num: 11,
    title: "Example of a Database (with a Conceptual Data Model)",
    arabicTitle: "مثال عملي لقاعدة بيانات جامعية (الكيانات الأساسية)",
    image: "materials/slides/db-lec2/slide_11.png",
    coreSummary: "مثال تطبيقي لبيئة جامعة (UNIVERSITY) بنحدد فيه الـ Entities الرئيسية زي الطلاب، المقررات، الشعب، الأقسام، والمحاضرين.",
    explanationIntro: "عشان تفهم النظري صح، الدكتور طبق بمثال واقعي كلنا عارفينه وهو 'جامعة'. الـ Mini-world هنا هو بيئة الجامعة. وسأل سؤال: إيه الكيانات (Entities) اللي محتاجين نخزن عنها بيانات؟ طلع بـ 5 كيانات أساسية: الطلاب (STUDENTs)، المقررات (COURSEs)، السكاشن أو الشعب (SECTIONs)، الأقسام الأكاديمية (DEPARTMENTs)، والدكاترة والمحاضرين (INSTRUCTORs).",
    points: [
      {
        badge: "Mini-world",
        title: "العالم المصغر المختار",
        desc: "جزء من بيئة الجامعة الأكاديمية (Part of a UNIVERSITY environment)."
      },
      {
        badge: "Entities 1",
        title: "الطلاب والمقررات (STUDENTs & COURSEs)",
        desc: "بيانات الطلاب المسجلين بالجامعة، والمقررات والمناهج الدراسية."
      },
      {
        badge: "Entities 2",
        title: "السكاشن والشعب (SECTIONs)",
        desc: "الفصول والشعب المنعقدة لكل مقرر دراسي في ترم معين."
      },
      {
        badge: "Entities 3",
        title: "الأقسام والمحاضرون (DEPARTMENTs & INSTRUCTORs)",
        desc: "الأقسام الأكاديمية (زي قسم IS و CS) وأعضاء هيئة التدريس."
      }
    ],
    keywords: [
      { en: "Conceptual Data Model", ar: "نموذج البيانات المفاهيمي" },
      { en: "UNIVERSITY mini-world", ar: "العالم المصغر للجامعة" },
      { en: "Entities", ar: "الكيانات (جداول البيانات الأساسية)" },
      { en: "SECTIONs", ar: "الشعب والسكاشن الدراسية" }
    ],
    triggers: [
      {
        trigger: "لو سألك عن كيانات الـ Mini-world الخاصة بالجامعة في السلايد:",
        choose: "تختار: STUDENTs, COURSEs, SECTIONs, DEPARTMENTs, INSTRUCTORs",
        note: "دي الكيانات الخمسة المذكورة نصاً في السلايد."
      }
    ],
    tricks: "كل كيان (Entity) من دول هيتحول بعد كده لجدول مستقل في قاعدة البيانات؛ والسكشن (SECTION) هو حالة انعقاد لمادة معينة في فصل دراسي.",
    quiz: {
      question: "Which of the following is explicitly listed as a mini-world entity in the UNIVERSITY database example (Slide 11)?",
      options: [
        "SECTIONs (of COURSEs)",
        "AIRPLANE maintenance logs",
        "ATM cash dispenser cassettes",
        "Railway train schedules"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 11 حددت كيانات بيئة الجامعة ومن ضمنها السكاشن والشعب (SECTIONs of COURSEs)، وباقي الاختيارات لقطارات وطيران ملهاش علاقة بالجامعة."
    }
  },
  {
    num: 12,
    title: "Example of a Database (with a Conceptual Data Model) - Relationships",
    arabicTitle: "العلاقات بين كيانات الجامعة ونموذج الـ ER Model",
    image: "materials/slides/db-lec2/slide_12.png",
    coreSummary: "تحديد العلاقات اللي بتربط الكيانات ببعض (طالب بيسجل مادة، دكتور بيدرس سكشن...) والتأكيد إن المخطط ده بنسميه Entity-Relationship (ER) Model.",
    explanationIntro: "بعد ما عرفنا الكيانات، السلايد دي بتوضح إزاي بيتربطوا ببعض عن طريق العلاقات (Relationships): السكشن يتبع مادة معينة، الطالب بياخد سكشن معين، المادة ليها متطلب سابق (Prerequisite)، الدكتور بيدرس سكشن، القسم بيطرح المادة، والطالب بيتخصص في قسم. والملحوظة الذهبية تحت: العلاقات دي بنعبر عنها بنموذج مفاهيمي اسمه Entity-Relationship (ER) Model.",
    points: [
      {
        badge: "علاقات التسجيل",
        title: "السكاشن والطلاب",
        desc: "السكشن يتبع مادة معينة (SECTIONs are of specific COURSEs)، والطلاب بيسجلوا في السكاشن (STUDENTs take SECTIONs)."
      },
      {
        badge: "التدريس والمتطلبات",
        title: "المتطلبات السابقة والمحاضرون",
        desc: "المقررات ليها متطلب سابق (COURSEs have prerequisite COURSEs)، والدكاترة بيدرسوا السكاشن (INSTRUCTORs teach SECTIONs)."
      },
      {
        badge: "الأقسام والتخصص",
        title: "طرح المواد وتخصص الطلاب",
        desc: "المقررات بيطرحها القسم (COURSEs offered by DEPARTMENTs)، والطلاب بيتخصصوا في أقسام (STUDENTs major in DEPARTMENTs)."
      },
      {
        badge: "النموذج المفاهيمي",
        title: "نموذج الـ ER Model",
        desc: "ملاحظة هامة: كل الكيانات والعلاقات دي بنعبر عنها بنموذج مفاهيمي شهير اسمه ENTITY-RELATIONSHIP (ER) data model."
      }
    ],
    keywords: [
      { en: "Relationships", ar: "العلاقات والروابط بين الكيانات" },
      { en: "Prerequisite COURSEs", ar: "المقررات المتطلبة سابقاً" },
      { en: "Major in DEPARTMENTs", ar: "التخصص في قسم أكاديمي" },
      { en: "ENTITY-RELATIONSHIP (ER) model", ar: "نموذج الكيانات والعلاقات (ER)" }
    ],
    triggers: [
      {
        trigger: "لو سألك: 'What conceptual data model is typically used to express entities and relationships?':",
        choose: "تختار فوراً: ENTITY-RELATIONSHIP (ER) data model",
        note: "نموذج ER هو النموذج المفاهيمي القياسي لتمثيل العلاقات."
      }
    ],
    tricks: "كلمة 'Conceptual Data Model' في امتحانات قواعد البيانات معناها المباشر هو الـ 'Entity-Relationship (ER) model'.",
    quiz: {
      question: "According to Slide 12, entities and relationships in the UNIVERSITY example are typically expressed using which conceptual data model?",
      options: [
        "ENTITY-RELATIONSHIP (ER) data model",
        "Assembly 8086 Instruction Model",
        "OSI 7-Layer Protocol Model",
        "Relational Calculus Tuple Model"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد كاتبة تحت بالمللي: 'The above entities and relationships are typically expressed in a conceptual data model, such as the ENTITY-RELATIONSHIP data model'."
    }
  },
  {
    num: 13,
    title: "Example of a simple database (Tables & Data)",
    arabicTitle: "مثال الجداول وسجلات البيانات الفعلية (شكل 1.2)",
    image: "materials/slides/db-lec2/slide_13.png",
    coreSummary: "شكل الجداول الفعلية (Figure 1.2): 4 جداول (COURSE, SECTION, GRADE_REPORT, PREREQUISITE) بتوضح إزاي الداتا متخزنة ومربوطة ببعض.",
    explanationIntro: "هنا بتشوف تطبيق عملي لجداول حقيقية متخزنة (Figure 1.2)؛ جدول المقررات (COURSE) فيه اسم ورقم وساعات المادة، جدول السكاشن (SECTION) فيه رقم السكشن والمادة والترم والسنة والدكتور، جدول الدرجات (GRADE_REPORT) بيربط رقم الطالب برقم السكشن ويديه الدرجة (A, B, C)، وجدول المتطلبات (PREREQUISITE) بيوضح المادة والمادة المطلوبة قبلها.",
    points: [
      {
        badge: "COURSE",
        title: "جدول المقررات (COURSE)",
        desc: "Course_name، Course_number (زي CS1310)، Credit_hours، و Department (القسم)."
      },
      {
        badge: "SECTION",
        title: "جدول السكاشن (SECTION)",
        desc: "Section_identifier (رقم السكشن زي 85)، Course_number، Semester، Year، و Instructor (اسم الدكتور زي King أو Knuth)."
      },
      {
        badge: "GRADE_REPORT",
        title: "جدول تقارير الدرجات (GRADE_REPORT)",
        desc: "بيربط بين رقم الطالب (Student_number) ورقم السكشن (Section_identifier) ودرجته (Grade)."
      },
      {
        badge: "PREREQUISITE",
        title: "جدول المتطلبات السابقة (PREREQUISITE)",
        desc: "Course_number والمادة اللي لازم ينجح فيها الأول (Prerequisite_number)."
      }
    ],
    keywords: [
      { en: "COURSE Table", ar: "جدول المقررات" },
      { en: "SECTION Table", ar: "جدول الشعب والسكاشن" },
      { en: "GRADE_REPORT Table", ar: "جدول تقرير الدرجات" },
      { en: "PREREQUISITE Table", ar: "جدول المواد السابقة" }
    ],
    triggers: [
      {
        trigger: "لو سألك في الشكل 1.2 عن الجدول اللي بيربط رقم الطالب ورقم السكشن بالدرجة المستحقة:",
        choose: "تختار فوراً: GRADE_REPORT",
        note: "GRADE_REPORT هو جدول الدرجات المشترك."
      }
    ],
    tricks: "لاحظ في جدول GRADE_REPORT إنه مش كاتب اسم الطالب ولا اسم المادة، هو حاطط أرقام المعرفات (Foreign Keys) بس عشان يمنع التكرار (Redundancy).",
    quiz: {
      question: "In Figure 1.2 (Slide 13), which table contains columns for Student_number, Section_identifier, and Grade?",
      options: [
        "GRADE_REPORT",
        "COURSE",
        "PREREQUISITE",
        "INSTRUCTOR_DIRECTORY"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: جدول GRADE_REPORT في الصورة فيه Student_number و Section_identifier و Grade عشان يسجل درجة كل طالب في السكشن بتاعه."
    }
  },
  {
    num: 14,
    title: "Main Characteristics of the Database Approach",
    arabicTitle: "الخصائص الرئيسية: الطبيعة ذاتية الوصف واستقلالية البيانات",
    image: "materials/slides/db-lec2/slide_14.png",
    coreSummary: "أهم خاصيتين بيميزوا الـ Database Approach عن الملفات القديمة: الطبيعة ذاتية الوصف بالكتالوج، وعزل واستقلالية البرامج عن البيانات (Program-data independence).",
    explanationIntro: "السلايد دي بتجاوب على سؤال: إيه اللي يخلينا نعمل داتا بيز ونسيب الفايل سستم القديم؟ خاصيتين عملاقتين: الأولى 'Self-describing nature' يعني قاعدة البيانات بتوصف نفسها بنفسها لأن الـ Catalog مخزن فيه كل التفاصيل والقيود (Meta-data) وده بيخلي الـ DBMS يشتغل مع أي داتا بيز. التانية 'Program-data independence' يعني استقلالية البيانات عن البرامج، تقدر تعدل تنظيم التخزين وتزود أعمدة براحتك من غير ما تضطر تعدل كود البرامج!",
    points: [
      {
        badge: "Self-Describing",
        title: "الطبيعة ذاتية الوصف (Self-describing)",
        desc: "كتالوج الـ DBMS مخزن فيه الوصف الكامل (هياكل، أنواع، وقيود) اللي اسمه Meta-data؛ وده بيخلي برنامج الـ DBMS يقدر يدير أي تطبيق جديد."
      },
      {
        badge: "Data Independence",
        title: "استقلالية البرامج عن البيانات (Program-data independence)",
        desc: "عزل بين بنية التخزين والبرامج؛ تقدر تغير هياكل الجداول من غير ما تغير كود البرامج التطبيقية اللي بتطلب الداتا."
      }
    ],
    keywords: [
      { en: "Self-describing nature", ar: "الطبيعة ذاتية الوصف لقاعدة البيانات" },
      { en: "DBMS Catalog", ar: "كتالوج نظام إدارة قواعد البيانات" },
      { en: "Meta-data", ar: "البيانات الوصفية" },
      { en: "Program-data independence", ar: "استقلالية البرامج عن البيانات" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'Allows changing data structures and storage organization without having to change access programs':",
        choose: "تختار فوراً: Program-data independence",
        note: "ده التعريف الحرفي لاستقلالية البرامج عن البيانات."
      },
      {
        trigger: "لو شوفت: 'A DBMS catalog stores the description of a particular database':",
        choose: "تختار: Self-describing nature of a database system",
        note: "وجود الكتالوج بيخلي النظام ذاتي الوصف."
      }
    ],
    tricks: "زمان في الـ File System، لو كبرت حجم عمود الاسم من 20 لـ 30 حرف، كنت لازم تعيد كتابة وبرمجة كل التطبيقات؛ قواعد البيانات حلت الكارثة دي بفضل الـ Program-data independence.",
    quiz: {
      question: "What characteristic of the database approach allows changing data structures and storage without having to change access programs?",
      options: [
        "Program-data independence",
        "Screen pixel scaling",
        "Network cable buffering",
        "Hard drive rotational latency"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 14 بتعرف 'Program-data independence' بالنص: إنها بتسمح بتغيير الـ data structures وتنظيم التخزين من غير ما نغير برامج الـ DBMS access."
    }
  },
  {
    num: 15,
    title: "Example of a simplified database catalog",
    arabicTitle: "مثال كتالوج قاعدة البيانات المبسط (شكل 1.3)",
    image: "materials/slides/db-lec2/slide_15.png",
    coreSummary: "شكل الكتالوج الداخلي (Figure 1.3): جدول RELATIONS بيخزن أسماء الجداول وعدد الأعمدة، وجدول COLUMNS بيخزن أسماء الأعمدة وأنواعها والجدول التابع له.",
    explanationIntro: "الدكتور هنا بيوريك الكتالوج اللي اتكلمنا عنه شغال إزاي عملياً (Figure 1.3)؛ الـ DBMS بيعمل جدول اسمه 'RELATIONS' بيكتب فيه اسم كل جدول وعدد أعمدته (مثلاً STUDENT عنده 4 أعمدة، COURSE عنده 4)، وجدول تاني اسمه 'COLUMNS' بيكتب فيه اسم العمود ونوع الداتا (Character, Integer) وهو تبع أنهي جدول. يعني الـ DBMS بيعامل الميتا-داتا كأنها جداول برضه!",
    points: [
      {
        badge: "RELATIONS Table",
        title: "جدول العلاقات في الكتالوج (RELATIONS)",
        desc: "بيحتوي على: Relation_name (اسم الجدول) و No_of_columns (عدد الأعمدة)."
      },
      {
        badge: "COLUMNS Table",
        title: "جدول تفاصيل الأعمدة (COLUMNS)",
        desc: "بيحتوي على: Column_name، نوع البيانات Data_type، والجدول اللي بينتمي ليه Belongs_to_relation."
      },
      {
        badge: "فائدة الكتالوج",
        title: "إزاي الـ DBMS بيستفيد منه؟",
        desc: "أي استعلام بتطلبه، محرك الـ DBMS بيبص في الكتالوج ده الأول عشان يتأكد إن الأعمدة دي موجودة والأنواع صحيحة."
      }
    ],
    keywords: [
      { en: "Database catalog example", ar: "مثال كتالوج قاعدة البيانات" },
      { en: "RELATIONS table", ar: "جدول العلاقات (أسماء الجداول وعدد الأعمدة)" },
      { en: "COLUMNS table", ar: "جدول الأعمدة (الأسماء والأنواع والتبعية)" },
      { en: "Data_type", ar: "نوع البيانات المخزنة" }
    ],
    triggers: [
      {
        trigger: "لو سألك عن الجدول في الكتالوج اللي بيخزن 'Column_name, Data_type, Belongs_to_relation':",
        choose: "تختار فوراً: COLUMNS catalog table",
        note: "جدول COLUMNS هو اللي فيه تفاصيل الأعمدة والأنواع."
      },
      {
        trigger: "لو سألك عن الجدول اللي بيخزن 'Relation_name and No_of_columns':",
        choose: "تختار: RELATIONS catalog table",
        note: "جدول RELATIONS فيه أسماء الجداول وعدد الأعمدة."
      }
    ],
    tricks: "الميتا-داتا متخزنة جوه الـ DBMS في صورة جداول عادية جداً؛ يعني النظام بيستخدم آليات الجداول عشان يوصف الجداول التانية!",
    quiz: {
      question: "In the simplified database catalog (Figure 1.3, Slide 15), which table stores the Column_name, Data_type, and Belongs_to_relation?",
      options: [
        "COLUMNS",
        "RELATIONS",
        "STUDENT_GRADES",
        "SYSTEM_LOGS"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: جدول COLUMNS في شكل 1.3 هو اللي متخزن فيه اسم كل عمود ونوع بياناته واسم الجدول اللي بينتمي ليه."
    }
  },
  {
    num: 16,
    title: "Main Characteristics (cont.) - Data Abstraction & Operation Independence",
    arabicTitle: "تجريد البيانات واستقلالية العمليات والبرامج",
    image: "materials/slides/db-lec2/slide_16.png",
    coreSummary: "مفهوم تجريد البيانات (Data Abstraction) واستقلالية العمليات عبر فصل الواجهة (Interface) عن التنفيذ الداخلي (Implementation).",
    explanationIntro: "السلايد دي بتشرح يعني إيه 'Data Abstraction' (تجريد البيانات)؛ الـ DBMS بيديك تمثيل مفاهيمي (Conceptual representation) للداتا يخليك تتعامل معاها بسهولة وميشغلكش هي متخزنة إزاي على الهارد ديسك. وبناءً عليه بتظهر ميزتين: 1) Program-data independence، و2) Program-operation independence؛ العمليات بتتقسم لجزأين: الواجهة (Interface) ودي فيها اسم العملية والـ Arguments، والتنفيذ (Implementation) وده كود نقدر نعدله براحتنا من غير ما نغير الواجهة.",
    points: [
      {
        badge: "Data Abstraction",
        title: "مفهوم تجريد البيانات (Data Abstraction)",
        desc: "تقديم تمثيل مفاهيمي للداتا بيخفي كل التفاصيل المعقدة للتخزين الفيزيائي عن المستخدمين والمبرمجين."
      },
      {
        badge: "استقلالية البيانات",
        title: "Program-data independence",
        desc: "هيكل الملفات متخزن في الكتالوج بمعزل تام ومستقل عن البرامج التطبيقية."
      },
      {
        badge: "استقلالية العمليات",
        title: "Program-operation independence",
        desc: "العمليات بتتقسم لـ: 1) Interface (اسم العملية وأنواع المعاملات)، و 2) Implementation (طريقة التنفيذ اللي نقدر نغيرها براحتنا دون التأثير على الواجهة)."
      }
    ],
    keywords: [
      { en: "Data Abstraction", ar: "تجريد البيانات وإخفاء التعقيد" },
      { en: "Program-operation independence", ar: "استقلالية البرامج عن العمليات" },
      { en: "Interface", ar: "الواجهة (اسم الدالة والبارامترات)" },
      { en: "Implementation", ar: "التنفيذ الداخلي للعملية" },
      { en: "Conceptual representation", ar: "تمثيل مفاهيمي للبيانات" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'includes operation name and data types of its arguments':",
        choose: "تختار فوراً: Interface",
        note: "الـ Interface هو الاسم وأنواع المدخلات."
      },
      {
        trigger: "لو شوفت: 'can be changed without affecting the interface':",
        choose: "تختار فوراً: Implementation",
        note: "التنفيذ الداخلي هو اللي بيتغير من غير ما يكسر الـ Interface."
      }
    ],
    tricks: "قاعدة برمجية مهمة جداً في الامتحانات: في الـ Program-operation independence، تغيير الـ Implementation مبيأثرش على الكود المستدعي طالما الـ Interface فضل ثابت.",
    quiz: {
      question: "In Program-operation independence (Slide 16), what specifies the operation name and the data types of its arguments?",
      options: [
        "The Interface",
        "The Physical storage sector",
        "The Operating system BIOS",
        "The Hardware motherboard"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 16 كاتبة بوضوح: 'Interface includes operation name and data types of its arguments'."
    }
  },
  {
    num: 17,
    title: "Main Characteristics (cont.) - Conceptual View & Multiple Views",
    arabicTitle: "النموذج المفاهيمي ودعم وجهات النظر المتعددة (Multiple Views)",
    image: "materials/slides/db-lec2/slide_17.png",
    coreSummary: "استخدام نموذج البيانات (Data Model) عشان يقدم رؤية مفاهيمية، وميزة الـ Multiple Views اللي بتخلي كل مستخدم يشوف الداتا اللي تهمه بس.",
    explanationIntro: "السلايد دي بتوضح إزاي الـ DBMS بيسهل حياة الناس؛ أولاً بنستخدم 'Data Model' عشان نخفي تفاصيل التخزين والقرص الصلب ونعرض للمستخدمين 'Conceptual View' منظمة، والبرامج بتشاور على النموذج ده مش على مسارات الملفات. ثانياً ميزة رهيبة اسمها 'Support of multiple views of the data'، يعني كل يوزر يقدر يشوف منظور مختلف للقاعدة بيعرض بس الحاجات اللي هو مهتم بيها ومرخص له يشوفها.",
    points: [
      {
        badge: "Data Model",
        title: "دور نموذج البيانات (Data Model)",
        desc: "بيخفي تفاصيل التخزين الفيزيائي ويقدم للمستخدمين رؤية مفاهيمية (Conceptual view) مريحة."
      },
      {
        badge: "Multiple Views",
        title: "دعم وجهات النظر المتعددة (Multiple Views)",
        desc: "كل فئة من المستخدمين بتشوف View مخصصة ليها بتعرض فقط الداتا اللي تهمها (Describes only the data of interest)."
      },
      {
        badge: "الأمان والسهولة",
        title: "الفائدة المباشرة للـ Views",
        desc: "بتسهل الشغل وبتمنع الموظفين العاديين من رؤية البيانات الحساسة أو الخاصة بزملاء تانيين."
      }
    ],
    keywords: [
      { en: "Data Model", ar: "نموذج البيانات" },
      { en: "Conceptual view", ar: "رؤية مفاهيمية" },
      { en: "Multiple views of the data", ar: "وجهات نظر متعددة للبيانات" },
      { en: "Data of interest", ar: "البيانات التي تهم المستخدم فقط" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'Each user may see a different view of the database, which describes only the data of interest':",
        choose: "تختار فوراً: Support of multiple views of the data",
        note: "تعدد وجهات النظر بيخلي كل واحد يشوف الداتا اللي تخصه بس."
      }
    ],
    tricks: "الـ View في قواعد البيانات هي جدول افتراضي (Virtual Table)؛ طالب الجامعة بيدخل يشوف درجاته هو بس، بينما عميد الكلية بيشوف تقارير الكلية كلها.",
    quiz: {
      question: "Why does a modern DBMS support multiple views of the data according to Slide 17?",
      options: [
        "To allow each user to see only the data of interest to that specific user",
        "To duplicate tables twenty times across optical media",
        "To slow down query execution speeds",
        "To require every student to use machine code"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 17 موضحة إن ميزة الـ Multiple views بتسمح لكل يوزر يشوف View بتعرض الداتا اللي تخصه هو بس (Data of interest)."
    }
  },
  {
    num: 18,
    title: "Main Characteristics (cont.) - Sharing, Concurrency & OLTP",
    arabicTitle: "مشاركة البيانات، التحكم في التزامن، والـ OLTP",
    image: "materials/slides/db-lec2/slide_18.png",
    coreSummary: "المعالجة المتزامنة للبيانات مع ضمان عدم التضارب بالـ Concurrency Control، وحفظ العمليات الناجحة بالـ Recovery Subsystem، ومعاملات الـ OLTP الفورية.",
    explanationIntro: "السلايد دي بتشرح عصب قواعد البيانات التجارية؛ لما آلاف الناس بيحجزوا تذاكر طيران أو بيشتروا من أمازون في نفس اللحظة، مين بيمنع التضارب؟ الـ 'Concurrency control' بيضمن إن كل معاملة تتنفذ صح تماماً أو تتلغي خالص (Aborted). ومين بيضمن إن الحجز لو اتأكد ميرجعش يضيع لو السيرفر فصل؟ الـ 'Recovery subsystem'. ومصطلح 'OLTP' (معالجة المعاملات الفورية) بيسمح بتنفيذ مئات المعاملات في الثانية الواحدة.",
    points: [
      {
        badge: "التزامن والمشاركة",
        title: "Sharing & Multi-user Processing",
        desc: "السماح لمستخدمين متزامنين (Concurrent users) بالقراءة والتحديث في نفس الوقت دون تعارض."
      },
      {
        badge: "Concurrency Control",
        title: "التحكم في التزامن (Concurrency Control)",
        desc: "بيضمن إن كل Transaction تتنفذ بنجاح تام أو تتلغي كلها (Aborted) لو حصل أي تضارب."
      },
      {
        badge: "Recovery Subsystem",
        title: "نظام التعافي (Recovery Subsystem)",
        desc: "بيضمن إن أي Transaction اكتملت يتسجل أثرها بشكل دائم في قاعدة البيانات وميضيعش أبداً."
      },
      {
        badge: "OLTP",
        title: "معالجة المعاملات الفورية (Online Transaction Processing)",
        desc: "جزء جوهري في البنوك والتجارة بيسمح بتنفيذ مئات المعاملات المتزامنة كل ثانية."
      }
    ],
    keywords: [
      { en: "Multi-user transaction processing", ar: "معالجة معاملات المستخدمين المتعددين" },
      { en: "Concurrency control", ar: "التحكم في التزامن ومنع التعارض" },
      { en: "Recovery subsystem", ar: "النظام الفرعي للتعافي وحفظ المعاملات" },
      { en: "OLTP", ar: "معالجة المعاملات الفورية عبر الإنترنت" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'guarantees that each transaction is correctly executed or aborted':",
        choose: "تختار فوراً: Concurrency control",
        note: "التحكم في التزامن هو اللي بيضمن نجاح المعاملة أو إلغاءها بالكامل."
      },
      {
        trigger: "لو شوفت: 'ensures each completed transaction has its effect permanently recorded':",
        choose: "تختار فوراً: Recovery subsystem",
        note: "نظام الـ Recovery هو المسؤول عن بقاء المعاملة المكتملة بشكل دائم."
      },
      {
        trigger: "لو سألك عن اختصار 'OLTP':",
        choose: "تختار: Online Transaction Processing",
        note: "OLTP هي معالجة مئات المعاملات المتزامنة في الثانية."
      }
    ],
    tricks: "سؤالين حبايب قلب واضعي الامتحانات: مين بيضمن الـ executed or aborted؟ Concurrency control. ومين بيضمن الـ permanently recorded؟ Recovery subsystem.",
    quiz: {
      question: "Which DBMS component ensures that each completed transaction has its effect permanently recorded in the database?",
      options: [
        "Recovery subsystem",
        "Network bridge",
        "Screen framebuffer",
        "Keyboard scanner"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 18 بتنص صراحة على إن 'Recovery subsystem ensures each completed transaction has its effect permanently recorded in the database'."
    }
  },
  {
    num: 19,
    title: "Database Users - Categories",
    arabicTitle: "تصنيفات مستخدمي قواعد البيانات (على المسرح وخلف الكواليس)",
    image: "materials/slides/db-lec2/slide_19.png",
    coreSummary: "تقسيم البشر اللي بيتعاملوا مع قواعد البيانات لنوعين: الفاعلون على المسرح (Actors on the Scene) والعاملون خلف الكواليس (Workers Behind the Scene).",
    explanationIntro: "الدكتور هنا بيقسم الناس اللي ليهم علاقة بقواعد البيانات لـ فئتين كبار جداً: الأولى 'Actors on the Scene' (الفاعلون على المسرح) ودول اللي بيستخدموا الداتا ويتحكموا فيها أو بيبرمجوا ويصمموا تطبيقات الداتا بيز. التانية 'Workers Behind the Scene' (العاملون خلف الكواليس) ودول بقى اللي بيبنوا محرك الـ DBMS نفسه وأدواته ومشغلي أجهزة السيرفرات.",
    points: [
      {
        badge: "على المسرح",
        title: "الفاعلون على المسرح (Actors on the Scene)",
        desc: "الناس اللي بتتحكم وتستخدم محتوى الداتا بيز فعلياً، واللي بيصمموا ويطوروا برامج وتطبيقات قاعدة البيانات."
      },
      {
        badge: "خلف الكواليس",
        title: "العاملون خلف الكواليس (Workers Behind the Scene)",
        desc: "المهندسون اللي بيصمموا ويبرمجوا سوفت وير الـ DBMS نفسه والأدوات المساندة ليه، ومشغلو أجهزة الكمبيوتر والسيرفرات."
      }
    ],
    keywords: [
      { en: "Database Users", ar: "مستخدمو قواعد البيانات" },
      { en: "Actors on the Scene", ar: "الفاعلون على المسرح (بيتعاملوا مع داتا التطبيق)" },
      { en: "Workers Behind the Scene", ar: "العاملون خلف الكواليس (بيبنوا محرك الـ DBMS)" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'Those who actually use and control the database content, and design applications':",
        choose: "تختار فوراً: Actors on the Scene",
        note: "دول اللي بيتعاملوا مع التطبيقات والمحتوى."
      },
      {
        trigger: "لو شوفت: 'Those who design and develop the DBMS software and related tools':",
        choose: "تختار فوراً: Workers Behind the Scene",
        note: "بناة محرك الـ DBMS نفسه هم عمال خلف الكواليس."
      }
    ],
    tricks: "شفرة الامتحان: لو بيعمل تطبيق لجامعة أو بنك يبقى (On the scene). لو بيبني سوفت وير الـ DBMS زي أوراكل أو MySQL يبقى (Behind the scene).",
    quiz: {
      question: "According to Slide 19, engineers who design and develop the DBMS software package itself belong to which category?",
      options: [
        "Workers Behind the Scene",
        "Actors on the Scene",
        "Casual End Users",
        "Parametric Bank Tellers"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 19 حددت إن اللي بيصمم ويطور برنامج الـ DBMS نفسه وأدواته اسمهم 'Workers Behind the Scene'."
    }
  },
  {
    num: 20,
    title: "Database Users – Actors on the Scene",
    arabicTitle: "الفاعلون على المسرح: مدير قاعدة البيانات (DBA) ومصممو النظم",
    image: "materials/slides/db-lec2/slide_20.png",
    coreSummary: "الفرق بين وظيفتين كبار: الـ DBA (مسؤول الصلاحيات ومراقبة الكفاءة وتوفير الموارد)، والـ Database Designers (مسؤولو تحديد البنية والقيود).",
    explanationIntro: "أول اتنين من الـ Actors on the Scene هما: 1) مدير قاعدة البيانات (DBA - Database Administrator): ده 'الباشا' بتاع النظام؛ هو اللي بيمنع ويدي صلاحيات (Authorizing access)، ويراقب كفاءة التشغيل، ويشتري الهاردوير والسوفت وير المطلوب. 2) مصممو قواعد البيانات (Database Designers): دول المهندسين اللي بيقعدوا مع العملاء ويفهموا احتياجاتهم، ويحددوا هيكل الجداول والـ Constraints والمعاملات المطلوبة.",
    points: [
      {
        badge: "DBA",
        title: "مدير قاعدة البيانات (Database Administrator)",
        desc: "مسؤول عن تفويض ومنح الصلاحيات، مراقبة وتنسيق الاستخدام، توفير موارد العتاد والبرمجيات، ومراقبة كفاءة العمليات."
      },
      {
        badge: "DB Designers",
        title: "مصممو قواعد البيانات (Database Designers)",
        desc: "مسؤولون عن تحديد المحتوى، الهيكل التخزيني، القيود (Constraints)، والمعاملات؛ ولازم يتواصلوا مع الـ End-users لفهم رغباتهم."
      }
    ],
    keywords: [
      { en: "Database Administrator (DBA)", ar: "مدير نظام قاعدة البيانات" },
      { en: "Authorizing access", ar: "منح وتفويض صلاحيات الوصول" },
      { en: "Monitoring efficiency", ar: "مراقبة كفاءة وسرعة العمليات" },
      { en: "Database Designers", ar: "مصممو قواعد البيانات" },
      { en: "Constraints & Functions", ar: "القيود والعمليات" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'authorizing access to the database, acquiring software and hardware resources':",
        choose: "تختار فوراً: Database Administrator (DBA)",
        note: "منح الصلاحيات وشراء الموارد دي مهمة الـ DBA حصراً."
      },
      {
        trigger: "لو شوفت: 'define the content, structure, constraints, and functions':",
        choose: "تختار فوراً: Database Designers",
        note: "تحديد الهيكل والقيود ده شغل مصمم قاعدة البيانات."
      }
    ],
    tricks: "الـ DBA مسؤوليته أمنية وتشغيلية وموارد (Security & Operations)، بينما الـ Designer مسؤوليته تصميم وهيكلة ونمذجة (Structure & Modeling).",
    quiz: {
      question: "Who is responsible for authorizing access to the database, coordinating its use, and acquiring resources (Slide 20)?",
      options: [
        "Database Administrator (DBA)",
        "Database Designer",
        "Casual User",
        "Hardware Assembler"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 20 بتنص على إن المسؤول عن 'Authorizing access' وتوفير الموارد ومراقبة الكفاءة هو الـ Database Administrator (DBA)."
    }
  },
  {
    num: 21,
    title: "Database End Users",
    arabicTitle: "المستخدمون النهائيون: العرضيون والوسطاء/البارامتريون (Canned Transactions)",
    image: "materials/slides/db-lec2/slide_21.png",
    coreSummary: "المستخدمون النهائيون: العرضيون (Casual) بيستخدموا الداتا نادراً، والبارامتريون (Naïve/Parametric) الشريحة الأضخم اللي بتنفذ Canned Transactions زي صرافي البنوك وتطبيقات الموبايل.",
    explanationIntro: "هنا بندخل في المستخدمين النهائيين (End Users)؛ النوع الأول: 'Casual' (عرضي) يعني بيدخل على الداتا بيز كل فين وفين لما يحتاج معلومة معينة. والنوع التاني هو الأهم في الامتحانات: 'Naïve or Parametric'؛ دول بيمثلوا أكبر نسبة من سكان العالم اللي بيستخدموا قواعد بيانات! بيعملوا إيه؟ بيستخدموا دوال ومعاملات جاهزة ومبرمجة مسبقاً اسمها 'Canned transactions'؛ زي موظف البنك اللي شغال على شاشة سحب وإيداع، موظف حجز الطيران، ومستخدمي تطبيقات الموبايل والسوشيال ميديا.",
    points: [
      {
        badge: "Casual Users",
        title: "المستخدمون العرضيون (Casual End Users)",
        desc: "بيوصلوا لقاعدة البيانات بشكل متقطع ونادر عند الحاجة فقط (Occasionally when needed)."
      },
      {
        badge: "Naïve / Parametric",
        title: "المستخدمون البارامتريون (الشريحة الكبرى)",
        desc: "بيشكلوا النسبة الأكبر؛ بيستخدموا معاملات مجهزة مسبقاً بنسميها 'canned transactions' وميعرفوش أي كود أو SQL."
      },
      {
        badge: "أمثلة حية",
        title: "أمثلة على الـ Parametric Users",
        desc: "صرافو البنوك (Bank-tellers)، موظفو حجز التذاكر، مستخدمو تطبيقات الهواتف الذكية (Mobile Apps)، ومستخدمو السوشيال ميديا."
      }
    ],
    keywords: [
      { en: "Casual Users", ar: "مستخدمون عرضيون (وصول متقطع)" },
      { en: "Naïve or Parametric Users", ar: "مستخدمون بارامتريون / سذج" },
      { en: "Canned transactions", ar: "معاملات مبرمجة جاهزة" },
      { en: "Bank-tellers", ar: "صرافو البنوك" },
      { en: "Mobile App Users", ar: "مستخدمو تطبيقات الهواتف" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'canned transactions' أو 'make up a large section of end-user population':",
        choose: "تختار فوراً: Naïve or Parametric users",
        note: "المصطلحين دول علامة مسجلة للـ Naïve/Parametric."
      },
      {
        trigger: "لو جابلك مثال: 'Bank-tellers or reservation clerks' أو 'Mobile App Users':",
        choose: "تختار فوراً: Naïve or Parametric users",
        note: "كل دول بيتعاملوا مع شاشات بمعاملات جاهزة."
      },
      {
        trigger: "لو شوفت: 'access database occasionally when needed':",
        choose: "تختار: Casual users",
        note: "الوصول النادر عند الحاجة هو الـ Casual."
      }
    ],
    tricks: "مصطلح 'Canned Transactions' بيجي في 90% من امتحانات الفاينل! أول ما تشوف الكلمة دي في السؤال اختار فوراً Naïve or Parametric users.",
    quiz: {
      question: "Which category of end-users makes up the largest section of the user population and performs predefined 'canned transactions'?",
      options: [
        "Naïve or Parametric users",
        "Database Administrators",
        "Tool Developers",
        "System Implementors"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 21 واضحة جداً؛ Naïve or Parametric users هما الشريحة الأكبر وبيستخدموا 'canned transactions' زي موظف البنك ومستخدم تطبيق الموبايل."
    }
  },
  {
    num: 22,
    title: "Database End Users (cont.)",
    arabicTitle: "المستخدمون النهائيون: المتطورون والمستقلون (Sophisticated & Stand-alone)",
    image: "materials/slides/db-lec2/slide_22.png",
    coreSummary: "المستخدمون المتطورون (العلماء والمحللون اللي فاهمين النظام كويس)، والمستقلون (اللي بيستخدموا برامج شخصية زي برنامج الضرائب وأرشيف الصور).",
    explanationIntro: "باقي تصنيفات الـ End Users: 1) 'Sophisticated' (المتطورون): دول العلماء، المهندسين، ومحللي الأعمال؛ فاهمين إمكانيات الـ DBMS تماماً وبيستخدموا حزم وسوفت وير متقدم بيشتغل مع قاعدة البيانات مباشرة لاستخراج تحليلات معقدة. 2) 'Stand-alone' (المستقلون): دول بيعملوا قواعد بيانات شخصية خاصة بيهم عن طريق برامج جاهزة، زي اللي بيستخدم برنامج ضرائب بيعمل داتا بيز داخلية، أو حد عامل أرشيف لصور وفيديوهات عيلته.",
    points: [
      {
        badge: "Sophisticated",
        title: "المستخدمون المتطورون (Sophisticated Users)",
        desc: "محللو أعمال، علماء، ومهندسون؛ على دراية كاملة بإمكانيات النظام وبيستخدموا حزم برمجية متقدمة تتعامل مع الداتا المخزنة."
      },
      {
        badge: "Stand-alone",
        title: "المستخدمون المستقلون (Stand-alone Users)",
        desc: "بيديروا قواعد بيانات شخصية (Personal databases) باستخدام برامج وتطبيقات جاهزة للاستخدام."
      },
      {
        badge: "أمثلة حية",
        title: "أمثلة على الـ Stand-alone",
        desc: "مستخدم برنامج الضرائب (Tax program) اللي بينشئ داتا بيز داخلية خاصة بيه، أو شخص عامل داتا بيز لصور وفيديوهات شخصية."
      }
    ],
    keywords: [
      { en: "Sophisticated Users", ar: "مستخدمون متطورون (علماء ومهندسون)" },
      { en: "Business analysts & Scientists", ar: "محللو الأعمال والعلماء" },
      { en: "Stand-alone Users", ar: "مستخدمون مستقلون (قواعد شخصية)" },
      { en: "Personal databases", ar: "قواعد بيانات شخصية" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'business analysts, scientists, engineers, thoroughly familiar with system capabilities':",
        choose: "تختار فوراً: Sophisticated users",
        note: "العلماء والمهندسين اللي فاهمين السيستم هما الـ Sophisticated."
      },
      {
        trigger: "لو شوفت: 'user of a tax program' أو 'database of personal photos and videos':",
        choose: "تختار فوراً: Stand-alone users",
        note: "برامج الضرائب والصور الشخصية مثال مباشر للـ Stand-alone."
      }
    ],
    tricks: "المستخدم المستقل (Stand-alone) بيستخدم برنامج شخصي على لابتوبه لقاعدته هو بس؛ مش شغال على داتا بيز سيرفر بتاع بنك ولا جامعة.",
    quiz: {
      question: "A user who maintains a personal database of photos or uses a tax preparation program is classified as a:",
      options: [
        "Stand-alone user",
        "Database Administrator",
        "System Analyst",
        "Parametric Bank Teller"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 22 ذكرت مثالين للـ Stand-alone users: اللي بيستخدم برنامج ضرائب (tax program)، أو اللي بيدير داتا بيز لصور وفيديوهات شخصية."
    }
  },
  {
    num: 23,
    title: "Database Users – Actors on the Scene (cont.)",
    arabicTitle: "الفاعلون على المسرح: محللو النظم، المبرمجون، ومحللو الأعمال",
    image: "materials/slides/db-lec2/slide_23.png",
    coreSummary: "محللو النظم بيصمموا متطلبات التطبيقات والـ Canned Transactions، مبرمجو التطبيقات بيكتبوا الكود ويختبروه، ومحللو الأعمال بيحللوا الـ Big Data.",
    explanationIntro: "هنا الدكتور بيكلمك عن القوة الضاربة في سوق عمل الـ IT: 1) محللو النظم (System Analysts): بيفهموا احتياجات المستخدمين ويصمموا مواصفات التطبيقات والمعاملات الجاهزة. 2) مبرمجو التطبيقات (Application Programmers): بياخدوا المواصفات دي ويكتبوا الكود ويجربوه ويعملوا Debugging للتأكد من خلوه من المشاكل. 3) محللو الأعمال (Business Analysts): ناس مطلوبين جداً دلوقتي عشان يحللوا كميات البيانات الضخمة (Big Data) عشان الإدارة تاخد قرارات صح في التسويق والتخطيط.",
    points: [
      {
        badge: "System Analysts",
        title: "محللو النظم (System Analysts)",
        desc: "بيفهموا متطلبات المستخدمين وبيصمموا التطبيقات والـ Canned transactions اللي بتلبي طلباتهم."
      },
      {
        badge: "Programmers",
        title: "مبرمجو التطبيقات (Application Programmers)",
        desc: "بينفذوا الأكواد بناءً على مواصفات المحللين، وبيعملوا Test و Debugging قبل إطلاق البرنامج."
      },
      {
        badge: "Business Analysts",
        title: "محللو الأعمال والبيانات الضخمة",
        desc: "بيحللوا كميات الداتا العملاقة (Big Data) والمعلومات اللحظية لدعم اتخاذ القرارات في التخطيط والإعلانات والتسويق."
      }
    ],
    keywords: [
      { en: "System Analysts", ar: "محللو النظم وتصميم المواصفات" },
      { en: "Application Programmers", ar: "مبرمجو التطبيقات (كتابة الكود والاختبار)" },
      { en: "Business Analysts", ar: "محللو الأعمال والبيانات الضخمة" },
      { en: "Big Data decision making", ar: "اتخاذ القرار بناءً على البيانات" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'Implement specifications, test and debug them before deployment':",
        choose: "تختار فوراً: Application Programmers",
        note: "كتابة الكود والـ test والـ debug دي مهمة مبرمج التطبيقات."
      },
      {
        trigger: "لو شوفت: 'understand user requirements and design applications including canned transactions':",
        choose: "تختار فوراً: System Analysts",
        note: "فهم المتطلبات وتصميم مواصفات المعاملات ده شغل محلل النظم."
      },
      {
        trigger: "لو جابلك: 'analyze vast amounts of business data (Big Data) for better decision making':",
        choose: "تختار: Business Analysts",
        note: "محللو الأعمال هما المسؤولين عن تحليل الـ Big Data لاتخاذ القرارات."
      }
    ],
    tricks: "المحلل (Analyst) بيفهم ويصمم الشاشات والمعاملات على الورق، والمبرمج (Programmer) هو اللي بيكتب الكود الفعلي ويختبره ويعالج مشاكله.",
    quiz: {
      question: "Who is responsible for implementing application specifications, testing, and debugging them before deployment?",
      options: [
        "Application Programmers",
        "System Analysts",
        "Stand-alone users",
        "Hardware circuit assemblers"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 23 بتنص على إن 'Application Programmers: Implement the specifications developed by analysts and test and debug them before deployment'."
    }
  },
  {
    num: 24,
    title: "Database Users – Actors behind the Scene",
    arabicTitle: "الفاعلون خلف الكواليس: مصممو الـ DBMS، مطورو الأدوات، ومشغلو النظم",
    image: "materials/slides/db-lec2/slide_24.png",
    coreSummary: "العاملون خلف الكواليس: مصممو محرك الـ DBMS نفسه، مطورو الأدوات المساندة (Tool Developers للنمذجة ومراقبة الأداء)، وفريق التشغيل والصيانة.",
    explanationIntro: "مين الناس الشغالين 'خلف الكواليس' (Behind the Scene)؟ 1) 'System Designers and Implementors': دول اللي بيصمموا ويبرمجوا محرك الـ DBMS نفسه بوحداته وواجهاته ويربطوه بنظام التشغيل. 2) 'Tool Developers': دول اللي بيبنوا برامج مساعدة وأدوات (Tools) لتصميم ونمذجة قواعد البيانات، مراقبة الأداء، وعمل محاكاة. 3) 'Operators and Maintenance Personnel': الفنيين والمهندسين اللي بيديروا تشغيل وصيانة أجهزة السيرفرات والشبكات الخاصة بالداتا بيز.",
    points: [
      {
        badge: "DBMS Implementors",
        title: "مصممو ومنفذو برمجيات الـ DBMS",
        desc: "بيصمموا ويبنوا حزم وبرامج الـ DBMS بوحداتها وواجهاتها واختبارها وتوصيلها بالـ OS والمترجمات."
      },
      {
        badge: "Tool Developers",
        title: "مطورو الأدوات المساندة (Tool Developers)",
        desc: "بيبنوا برمجيات مساعدة (Tools) للنمذجة، مراقبة الأداء (Performance monitoring)، توليد داتا الاختبار، وعمل نماذج أولية."
      },
      {
        badge: "Operators",
        title: "مشغلو النظم وفنيو الصيانة",
        desc: "مسؤولون عن التشغيل الفعلي والمستمر وصيانة بيئة الهاردوير والسوفت وير للنظام."
      }
    ],
    keywords: [
      { en: "System Designers and Implementors", ar: "مصممو ومنفذو حزم الـ DBMS" },
      { en: "Tool Developers", ar: "مطورو الأدوات المساندة للنمذجة والمراقبة" },
      { en: "Performance monitoring tools", ar: "أدوات مراقبة الأداء" },
      { en: "Operators & Maintenance Personnel", ar: "مسؤولو التشغيل والصيانة" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'Design and implement software systems called tools for modeling, performance monitoring, prototyping':",
        choose: "تختار فوراً: Tool Developers",
        note: "مطورو الأدوات هما اللي بيعملوا سوفت وير المراقبة والنمذجة."
      },
      {
        trigger: "لو شوفت: 'Design and implement DBMS packages in the form of modules and interfaces':",
        choose: "تختار فوراً: System Designers and Implementors",
        note: "دول اللي بيبنوا محرك الـ DBMS من الصفر."
      }
    ],
    tricks: "أي حد بيطور حاجة خاصة بمحرك الـ DBMS نفسه أو الأدوات المساعدة بتاعته فهو 'Behind the Scene'؛ لكن اللي بيعمل برنامج حجز المستشفى أو تطبيق الموبايل فهو 'On the Scene'.",
    quiz: {
      question: "Which group of 'Actors behind the Scene' develops software tools for performance monitoring, modeling, and prototyping?",
      options: [
        "Tool Developers",
        "Application Programmers",
        "Casual Users",
        "Bank Tellers"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 24 بتعرف الـ Tool Developers بأنهم اللي بيصمموا الأدوات الخاصة بالـ modeling والـ performance monitoring والـ prototyping."
    }
  },
  {
    num: 25,
    title: "Advantages of Using the Database Approach",
    arabicTitle: "مزايا مدخل قواعد البيانات: التحكم في التكرار (Normalization) والأمان",
    image: "materials/slides/db-lec2/slide_25.png",
    coreSummary: "أهم ميزة: التحكم في تكرار البيانات وتخزين كل معلومة في مكان واحد فقط وهو مفهوم الـ Data Normalization لضمان الاتساق، مع حظر غير المصرح لهم.",
    explanationIntro: "أول ميزة كبرى لمدخل قواعد البيانات: 'Controlling redundancy' (التحكم في التكرار)؛ زمان في الملفات القديمة، اسم الطالب وعنوانه كان بيتكتب في 5 ملفات مختلفة، ولما يغير عنوانه يتعدل في ملف ويتنسي في الباقي ويحصل تضارب كارثي! في الداتا بيز كل حاجة بتتخزن في مكان واحد بس، والعملية دي اسمها 'Data Normalization' وهي اللي بتضمن اتساق البيانات (Consistency) وتوفر المساحة. والميزة التانية هي تقييد الدخول وحظر غير المصرح لهم بأوامر الـ DBA.",
    points: [
      {
        badge: "Controlling Redundancy",
        title: "التحكم في تكرار البيانات",
        desc: "تخزين كل معلومة منطقية (زي اسم الطالب أو تاريخ ميلاده) في مكان واحد فقط داخل قاعدة البيانات."
      },
      {
        badge: "Normalization",
        title: "تطبيع البيانات (Data Normalization)",
        desc: "الأسلوب العلمي لتنظيم الجداول اللي بيمنع التكرار وبيضمن اتساق الداتا (Consistency) ويوفر مساحة التخزين."
      },
      {
        badge: "Restricting Access",
        title: "تقييد الوصول غير المصرح به",
        desc: "حماية البيانات بأذونات وصلاحيات حاسمة؛ الأوامر الحساسة مبيستخدمهاش غير فريق الـ DBA فقط."
      }
    ],
    keywords: [
      { en: "Controlling redundancy", ar: "التحكم في تكرار البيانات" },
      { en: "Data normalization", ar: "تطبيع البيانات (حفظ البيان في مكان واحد)" },
      { en: "Data consistency", ar: "اتساق وتطابق البيانات ومنع التعارض" },
      { en: "Restricting unauthorized access", ar: "تقييد الوصول غير المصرح به" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'each logical data item is stored in only one place in the database':",
        choose: "تختار فوراً: Data Normalization",
        note: "تخزين كل بيان في مكان واحد هو تعريف الـ Data Normalization."
      },
      {
        trigger: "لو سألك: 'What ensures consistency and saves storage space by controlling redundancy?':",
        choose: "تختار فوراً: Data Normalization",
        note: "التطبيع هو اللي بيحقق الـ Consistency وتوفير المساحة."
      }
    ],
    tricks: "مصطلح Data Normalization بيظهر لأول مرة هنا؛ احفظ قاعدته: 'Stored in only one place' = 'Consistency & Storage Savings'.",
    quiz: {
      question: "Storing each logical data item in only one place in the database to ensure consistency and save storage space is known as:",
      options: [
        "Data normalization",
        "Screen buffering",
        "Network packet routing",
        "Direct memory access"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 25 بتقول نصاً: 'This is known as data normalization, and it ensures consistency and saves storage space'."
    }
  },
  {
    num: 26,
    title: "Advantages of Using the Database Approach (cont.)",
    arabicTitle: "مزايا مدخل قواعد البيانات: التخزين المستمر، تحسين الاستعلامات، والنسخ الاحتياطي",
    image: "materials/slides/db-lec2/slide_26.png",
    coreSummary: "توفير تخزين دائم لكائنات البرمجة (Persistent storage)، استخدام الفهارس والـ Query Optimizer لتحسين الاستعلامات، وخدمات النسخ الاحتياطي وتعدد الواجهات.",
    explanationIntro: "مزايا تقنية جبارة في السلايد دي: 1) 'Persistent storage': كائنات لغات البرمجة (Objects) بتفضل متخزنة بشكل دائم ومبتروحش لما البرنامج يقفل زي ما بيحصل في قواعد البيانات كائنية التوجه (OODBMS). 2) تسريع الاستعلامات بفضل وجود الفهارس (Indexes) ومُحسِّن الاستعلامات (Query optimization module) اللي بيختار أسرع وأحسن خطة تنفيذ. 3) خدمات النسخ الاحتياطي والاستعادة التلقائية، و 4) توفير واجهات استخدام متعددة تناسب كل الناس.",
    points: [
      {
        badge: "Persistent Storage",
        title: "التخزين المستمر لكائنات البرامج",
        desc: "قواعد البيانات كائنية التوجه (Object-oriented DBMSs) بتخلي الـ Program Objects متخزنة بشكل دائم على الديسك."
      },
      {
        badge: "Query Optimization",
        title: "تحسين ومعالجة الاستعلامات بكفاءة",
        desc: "محرك الـ DBMS فيه موديول لتحسين الاستعلامات بيختار أفضل خطة تنفيذية (Execution Plan) بناءً على هياكل التخزين والفهارس (Indexes)."
      },
      {
        badge: "Backup & Interfaces",
        title: "النسخ الاحتياطي وتعدد الواجهات",
        desc: "توفير خدمات Backup و Recovery في حالة الحوادث، وتوفير واجهات استخدام متعددة (Multiple User Interfaces)."
      }
    ],
    keywords: [
      { en: "Persistent storage for objects", ar: "تخزين دائم لكائنات البرامج" },
      { en: "Query processing and optimization", ar: "معالجة وتحسين الاستعلامات" },
      { en: "Indexes", ar: "الفهارس لتسريع البحث" },
      { en: "Backup and recovery services", ar: "خدمات النسخ الاحتياطي والتعافي" },
      { en: "Multiple user interfaces", ar: "واجهات مستخدم متعددة" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'module of DBMS responsible for choosing an efficient query execution plan based on indexes':",
        choose: "تختار فوراً: Query processing and optimization module",
        note: "الموديول ده هو اللي بيختار أفضل خطة استعلام."
      },
      {
        trigger: "لو شوفت: 'Object-oriented DBMSs make program objects...':",
        choose: "تختار فوراً: Persistent",
        note: "قواعد بيانات الكائنات بتخلي الـ objects دائمية (Persistent)."
      }
    ],
    tricks: "الفهارس (Indexes) في قواعد البيانات زي فهرس الكتاب بالظبط؛ بتخلي الـ Query Optimizer يلاقي السجلات في ثواني بدل ما يلف على ملايين السجلات صف صف.",
    quiz: {
      question: "Which DBMS module is responsible for choosing an efficient execution plan for each query based on storage structures like indexes?",
      options: [
        "Query processing and optimization module",
        "Screen driver renderer",
        "Keyboard interrupt handler",
        "Operating system swap file"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 26 بتوضح إن 'The query processing and optimization module of the DBMS' هو المسؤول عن اختيار الـ efficient execution plan بناءً على الـ indexes."
    }
  },
  {
    num: 27,
    title: "Advantages of Using the Database Approach (cont.)",
    arabicTitle: "مزايا مدخل قواعد البيانات: العلاقات المعقدة، قيود التكامل، والمشغلات (Triggers)",
    image: "materials/slides/db-lec2/slide_27.png",
    coreSummary: "تمثيل العلاقات المعقدة بين البيانات، فرض قيود التكامل (Integrity Constraints) لمنع الأخطاء تلقائياً، واستخدام الـ Active Rules والـ Triggers لتنفيذ إجراءات فورية.",
    explanationIntro: "السلايد دي بتوضح ذكاء وقوة الـ DBMS؛ أولاً بيقدر يمثل علاقات معقدة جداً ومتشابكة بين الجداول بسهولة. ثانياً بيفرض قيود التكامل (Integrity Constraints) يعني لو حاولت تدخل عمر طالب بالسالب أو رقم مكرر، السيستم هيرفض فوراً ومش هيسمح بوجود بيانات فاسدة. ثالثاً بيقدر ينفذ إجراءات واستنتاجات تلقائية باستخدام القواعد الاستنتاجية والـ Triggers (المشغلات التلقائية) أول ما يحصل حدث معين.",
    points: [
      {
        badge: "علاقات معقدة",
        title: "تمثيل العلاقات المتشابكة",
        desc: "القدرة على نمذجة وتمثيل العلاقات المعقدة بين البيانات (Complex relationships) بدون أي فقدان للروابط."
      },
      {
        badge: "Integrity Constraints",
        title: "فرض قيود التكامل وسلامة البيانات",
        desc: "التحقق التلقائي من الشروط والقيود (زي منع تكرار الـ Primary Key والتأكد من صحة المدخلات) ورفض أي بيان مخالف."
      },
      {
        badge: "Rules & Triggers",
        title: "المشغلات التلقائية والقواعد الاستنتاجية",
        desc: "تنفيذ أفعال وتصرفات تلقائية عند حدوث أحداث معينة باستخدام deductive and active rules and triggers."
      }
    ],
    keywords: [
      { en: "Complex relationships", ar: "علاقات معقدة ومتشابكة" },
      { en: "Integrity constraints", ar: "قيود التكامل وسلامة البيانات" },
      { en: "Deductive rules", ar: "قواعد استنتاجية" },
      { en: "Active rules and triggers", ar: "مشغلات تلقائية وقواعد نشطة" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'Drawing inferences and actions from stored data using...':",
        choose: "تختار فوراً: Deductive and active rules and triggers",
        note: "الـ Rules والـ Triggers هي اللي بتنفذ إجراءات واستنتاجات تلقائية."
      },
      {
        trigger: "لو شوفت: 'Enforcing ... on the database to prevent invalid data':",
        choose: "تختار فوراً: Integrity constraints",
        note: "قيود التكامل هي اللي بتمنع البيانات غير الصحيحة."
      }
    ],
    tricks: "الـ Integrity Constraints بتتطبق على مستوى محرك الـ DBMS نفسه؛ يعني مهما كتب المبرمج في تطبيقه، مستحيل يقدر يدخل بيان بيكسر قيد متسجل في الكتالوج.",
    quiz: {
      question: "According to Slide 27, what features are used to draw inferences and automated actions from stored database data?",
      options: [
        "Deductive and active rules and triggers",
        "Screen brightness calibration",
        "Cooling fan speed governors",
        "Manual notebook checklists"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 27 بتنص على: 'Drawing inferences and actions from the stored data using deductive and active rules and triggers'."
    }
  },
  {
    num: 28,
    title: "Additional Implications of Using the Database Approach",
    arabicTitle: "تداعيات إضافية: فرض المعايير القياسية وتقليص زمن تطوير البرامج",
    image: "materials/slides/db-lec2/slide_28.png",
    coreSummary: "الميزة المؤسسية الأولى: فرض المعايير القياسية (Standards) لتوحيد مسميات الحقول والشاشات والتقارير في الشركات الكبرى، والميزة التانية: تقليص زمن برمجة التطبيقات الجديدة.",
    explanationIntro: "هنا الدكتور بيتكلم عن الفوائد الإدارية والعملية للشركات: 1) 'Enforcing standards' (فرض المعايير القياسية): في المؤسسات والشركات الكبيرة، ده أهم سبب للنجاح؛ لأن الداتا بيز المركزية بتوحد أسماء حقول الداتا (Data item names)، صيغ الشاشات والتقارير وتصميمات صفحات الويب والميتا-داتا، وميبقاش كل قسم شغال بمزاجه. 2) 'Reduced application development time': زمن بناء وتطوير أي برنامج جديد بيقل جداً، لأن البنية والداتا موجودة ومتفهرسة ومحدش بيبدأ من الصفر.",
    points: [
      {
        badge: "Enforcing Standards",
        title: "إمكانية فرض المعايير القياسية",
        desc: "توحيد أسماء عناصر البيانات، صيغ العرض (Display formats)، الشاشات، هياكل التقارير، والبيانات الوصفية (Meta-data) عبر المؤسسة كلها."
      },
      {
        badge: "تقليص زمن التطوير",
        title: "Reduced Application Development Time",
        desc: "الوقت الإضافي المطلوب لإضافة أي برنامج أو تقرير جديد بيقل بنسبة كبيرة لأن بنية البيانات جاهزة وموثقة مسبقاً."
      }
    ],
    keywords: [
      { en: "Enforcing standards", ar: "فرض وتطبيق المعايير القياسية" },
      { en: "Data item names & display formats", ar: "تسميات عناصر البيانات وصيغ العرض" },
      { en: "Report structures", ar: "هياكل التقارير" },
      { en: "Reduced development time", ar: "تقليص زمن تطوير التطبيقات" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'standards refer to data item names, display formats, screens, report structures, meta-data':",
        choose: "تختار فوراً: Enforcing standards",
        note: "ده المحتوى التفصيلي لفرض المعايير القياسية في المؤسسات الكبيرة."
      },
      {
        trigger: "لو شوفت: 'Incremental time to add each new application is reduced':",
        choose: "تختار فوراً: Reduced application development time",
        note: "تقليص وقت إضافة تطبيقات جديدة ناتج عن وجود قاعدة بيانات جاهزة."
      }
    ],
    tricks: "المعايير القياسية (Standards) بتمنع إن قسم الحسابات يسمي الطالب 'Std_ID' وقسم شؤون الطلاب يسميه 'Student_Number'؛ الـ DBMS بيفرض اسم موحد للجميع.",
    quiz: {
      question: "Why is the potential for enforcing standards crucial for the success of database applications in large organizations?",
      options: [
        "It standardizes data item names, display formats, screens, and report structures across the organization",
        "It forces all employees to buy the exact same model of mobile phone",
        "It prevents all database servers from connecting to local networks",
        "It slows down hardware processor clock speeds"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 28 بتوضح إن المعايير القياسية (Standards) بتوحد أسماء حقول البيانات وصيغ الشاشات وهياكل التقارير والميتا-داتا في المؤسسات الضخمة."
    }
  },
  {
    num: 29,
    title: "Additional Implications (cont.) - Flexibility, Current Info & Economies of Scale",
    arabicTitle: "تداعيات إضافية: المرونة، المعلومات اللحظية، والجدوى الاقتصادية (Economies of Scale)",
    image: "materials/slides/db-lec2/slide_29.png",
    coreSummary: "مرونة تعديل هياكل البيانات مع تطور المتطلبات، توفر معلومات حية ولحظية ضرورية لحجوزات الطيران والفنادق، وتحقيق الجدوى الاقتصادية بدمج موارد الأقسام ومنع الهدر.",
    explanationIntro: "3 تداعيات في منتهى الأهمية: 1) 'Flexibility to change data structures': هيكل الداتا بيز مرن ويقدر يتطور ويتعدل مع ظهور متطلبات جديدة في الشغل. 2) 'Availability of current information': البيانات دايماً محدثة ولحظية وده ضروري جداً لأنظمة الحجوزات الفورية (Online transactions) زي حجز الطيران والتسوق والفنادق. 3) 'Economies of scale' (الجدوى واقتصاديات الحجم): بدل ما كل قسم يشتري سيرفرات ويجيب موظفين مستقلين بتكلفة ضخمة، دمج الداتا بيز والتطبيقات في نظام مركزي واحد بيمنع الهدر والتكرار وبيوفر ملايين للمؤسسة.",
    points: [
      {
        badge: "Flexibility",
        title: "مرونة تغيير هياكل البيانات",
        desc: "هيكل قاعدة البيانات قادر يتكيف ويتوسع كل ما ظهرت متطلبات جديدة للمؤسسة دون هدم النظام القديم."
      },
      {
        badge: "Current Info",
        title: "توفر معلومات لحظية ومحدثة",
        desc: "مهمة جداً لأنظمة الحجز المباشر (Online transaction systems) زي التسوق، تذاكر الطيران، الفنادق، وتأجير السيارات."
      },
      {
        badge: "Economies of Scale",
        title: "الجدوى واقتصاديات الحجم (Economies of scale)",
        desc: "تجنب الهدر والتكرار في الموارد والأجهزة والموظفين عبر دمج وتوحيد البيانات والتطبيقات في نظام مركزي موحد."
      }
    ],
    keywords: [
      { en: "Flexibility to change data structures", ar: "مرونة تعديل وتطوير هياكل البيانات" },
      { en: "Availability of current information", ar: "توفر معلومات محدثة ولحظية" },
      { en: "Online transaction systems", ar: "أنظمة المعاملات المباشرة (حجوزات وتسوق)" },
      { en: "Economies of scale", ar: "الجدوى واقتصاديات الحجم وتوفير الموارد" }
    ],
    triggers: [
      {
        trigger: "لو شوفت في السؤال: 'Wasteful overlap of resources and personnel can be avoided by consolidating data across departments':",
        choose: "تختار فوراً: Economies of scale",
        note: "تجنب الهدر والتكرار بدمج البيانات هو تعريف الـ Economies of scale."
      },
      {
        trigger: "لو شوفت: 'Extremely important for on-line transaction systems such as shopping, airline, hotel reservations':",
        choose: "تختار فوراً: Availability of current information",
        note: "أنظمة الحجوزات الفورية بتعتمد كلياً على توفر المعلومات اللحظية المحدثة."
      }
    ],
    tricks: "مصطلح 'Economies of scale' مصطلح اقتصادي يعني بالعربي: لما توحد كل حاجة في مكان واحد، تكلفة الخدمة بتقل وبتوفر أجهزة وموظفين وتمنع التشتت والهدر.",
    quiz: {
      question: "Avoiding wasteful overlap of resources and personnel by consolidating data and applications across departments represents:",
      options: [
        "Economies of scale",
        "Screen resolution distortion",
        "Thermal CPU throttling",
        "RAM memory leakage"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: السلايد 29 بتعرف 'Economies of scale' بأنها تجنب الهدر والتكرار في الموارد والموظفين عن طريق دمج البيانات والتطبيقات عبر الأقسام."
    }
  },
  {
    num: 30,
    title: "Lecture Summary",
    arabicTitle: "الملخص الشامل للمحاضرة ومراجعة المحاور العشرة",
    image: "materials/slides/db-lec2/slide_30.png",
    coreSummary: "سلايد الختام والملخص: بتعيد التذكير بالـ 10 محاور اللي تم شرحها في المحاضرة كخريطة مراجعة نهائية قبل الانتقال للمحاضرة القادمة.",
    explanationIntro: "وصلنا لآخر شريحة يا بطل؛ الشريحة دي بتلخص لك كل اللي اتعلمناه النهاردة: عرفنا أنواع الداتا بيز التقليدية والحديثة، التعريفات الـ 5 الأساسية، وظائف الـ DBMS، مثال الجامعة وجداولها، خصائص الـ Database Approach (الكتالوج واستقلالية البيانات والعمليات والتزامن والـ OLTP)، تصنيفات المستخدمين (على المسرح وخلف الكواليس)، وأخيراً المزايا والتطبيع وتوفير الموارد. كده معاك خريطة الفصل كاملة ومفيش سؤال هيخرج براها!",
    points: [
      {
        badge: "المفاهيم والأنواع",
        title: "الأنواع والتعريفات الأساسية",
        desc: "راجعنا الفرق بين التقليدي والحديث، ومصطلحات Data, Database, Mini-world (UoD), DBMS, Meta-data."
      },
      {
        badge: "الخصائص والمعمارية",
        title: "الخصائص الجوهرية للـ DB Approach",
        desc: "الطبيعة ذاتية الوصف (Catalog)، استقلالية البيانات والعمليات، التجريد (Abstraction)، ودعم وجهات النظر المتعددة والـ OLTP."
      },
      {
        badge: "المستخدمون والمزايا",
        title: "تصنيف المستخدمين والمزايا",
        desc: "Actors on the scene (DBA, Designers, End-users, Programmers) والـ Workers behind the scene، ومزايا التطبيع (Normalization) وفرض المعايير واقتصاديات الحجم."
      }
    ],
    keywords: [
      { en: "Lecture Summary", ar: "ملخص المحاضرة والمراجعة العامة" },
      { en: "Database Approach Recap", ar: "مراجعة خصائص مدخل قواعد البيانات" },
      { en: "Full Chapter Outline", ar: "المخطط الكامل لموضوعات الفصل الأول" }
    ],
    triggers: [
      {
        trigger: "لو سألك عن الميزة الجوهرية اللي بتخلي تعديل بنية التخزين ميكسرش كود البرامج:",
        choose: "تختار فوراً: Program-data independence",
        note: "دي أهم خاصية في منهج قواعد البيانات النظري كله."
      }
    ],
    tricks: "شريحة الـ Summary بتطابق الـ Outline؛ اتأكد إنك دلوقتي تقدر تشرح كل مصطلح إنجليزي منهم وتعرف الـ Trigger بتاعه في الامتحان.",
    quiz: {
      question: "Which cornerstone characteristic of the database approach allows changing data structures without having to modify access programs?",
      options: [
        "Program-data independence",
        "Disabling network connectivity",
        "Using volatile RAM storage only",
        "Manual punch card processing"
      ],
      correct: 0,
      explanation: "التفسير بالعامية: الخاصية الجوهرية اللي راجعناها طوال المحاضرة هي 'Program-data independence' اللي بتعزل ملفات البيانات عن البرامج وتسمح بتعديل الهياكل بدون كسر البرامج."
    }
  }
];

// 20 سؤال شامل للكويز المستقل يغطي كل محاور السلايدات الـ 30
const fullQuizData = [
  {
    id: 1,
    slideNum: 3,
    topic: "Database Types & Course Scope",
    question: "Which category of database applications does this academic course primarily focus on?",
    options: [
      "Traditional applications (Numeric and Textual databases)",
      "Biological and Genome Databases exclusively",
      "Massive Video and Multimedia Streaming only",
      "Advanced Real-time Geographic Information Systems (GIS)"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: السلايد 3 بتنص بوضوح تحت: 'Our course focuses on traditional applications'، يعني القواعد الرقمية والنصية التقليدية مش الجينوم ولا الوسائط الضخمة."
  },
  {
    id: 2,
    slideNum: 4,
    topic: "Recent Developments",
    question: "Why do search engines like Google, Bing, and Yahoo collect massive repositories of web pages?",
    options: [
      "For searching and indexing purposes",
      "To eliminate computer memory caches",
      "To bypass database authentication protocols",
      "To replace relational data models"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: محركات البحث بتجمع أرشيف وصفحات الويب عشان الفهرسة والبحث السريع (Searching and indexing purposes) لما المستخدم يبحث."
  },
  {
    id: 3,
    slideNum: 5,
    topic: "Basic Definitions - Data",
    question: "In database theory, 'Known facts that can be recorded and have an implicit meaning' is the exact definition of:",
    options: [
      "Data",
      "Information Systems",
      "DBMS Engine",
      "Computer Hardware"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: ده التعريف الحرفي والأكاديمي للـ Data في السلايد 5؛ حقائق نقدر نسجلها وليها معنى ضمني مفهوم."
  },
  {
    id: 4,
    slideNum: 5,
    topic: "Basic Definitions - Mini-world",
    question: "What technical term describes 'some part of the real world about which data is stored in a database'?",
    options: [
      "Mini-world (Universe of Discourse - UoD)",
      "Operating System Kernel",
      "Network Protocol Buffer",
      "Database Schema Catalog"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: الجزء من العالم الواقعي اللي بنخزن بياناته بنسميه Mini-world أو Universe of Discourse (UoD)، وزي ما قلنا أي تغيير فيه بينعكس في الداتا بيز."
  },
  {
    id: 5,
    slideNum: 5,
    topic: "Basic Definitions - DBMS",
    question: "A software package or system designed to facilitate the creation and maintenance of a computerized database is called:",
    options: [
      "Database Management System (DBMS)",
      "Spreadsheet Document Viewer",
      "Central Processing Unit",
      "Text Editor Application"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: السوفت وير اللي مسؤول عن إنشاء وصيانة قاعدة البيانات هو الـ DBMS (زي MySQL أو Oracle)."
  },
  {
    id: 6,
    slideNum: 5,
    topic: "Basic Definitions - Database System",
    question: "What constitutes a 'Database System' according to fundamental definitions?",
    options: [
      "The DBMS software together with the data itself (and sometimes applications)",
      "The computer power supply cable alone",
      "An unformatted external storage tape",
      "A printed user instruction manual"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: الـ Database System هو السوفت وير (DBMS) مضافاً إليه البيانات نفسها المتخزنة وتطبيقاتها."
  },
  {
    id: 7,
    slideNum: 6,
    topic: "Meta-data & Catalog",
    question: "Where is database descriptive information and definition (meta-data) stored by the DBMS?",
    options: [
      "In the database catalog or dictionary",
      "Hardcoded inside user application client source code",
      "In temporary RAM buffer cache that erases on reboot",
      "On external paper punch cards"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: الميتا-داتا (Meta-data) بتتخزن حصراً في الـ Database Catalog أو قاموس البيانات (Dictionary) الخاص بالـ DBMS."
  },
  {
    id: 8,
    slideNum: 8,
    topic: "Application Activities - Transactions",
    question: "Which database activity involves reading data, updating certain values, or generating and storing new data?",
    options: [
      "Transactions",
      "Static Read-Only Queries",
      "Monitor Screen Calibration",
      "Keyboard Character Scanning"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: الـ Transaction هي المعاملة اللي بتقرأ وتعدل (Update) قيم أو تولد داتا جديدة وتخزنها، مش مجرد استعلام قراءة عادي."
  },
  {
    id: 9,
    slideNum: 9,
    topic: "Additional Functionality - Protection",
    question: "Protecting the database system against hardware or software malfunction (or crashes) is classified as:",
    options: [
      "System protection",
      "Security protection against hackers",
      "Screen graphic acceleration",
      "Printer spooling management"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: الحماية ضد أعطال الهاردوير وانهيار البرمجيات (Crashes) اسمها في السلايد 9 'System protection'."
  },
  {
    id: 10,
    slideNum: 10,
    topic: "Architecture - Environment",
    question: "In the simplified database system environment diagram (Figure 1.1), which software module processes and compiles queries?",
    options: [
      "Software to Process Queries/Programs",
      "Hardware Bus Controller",
      "Power Regulator Chip",
      "Optical Drive Reader"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: أول مكون برمجي بيستقبل الاستعلامات ويفسرها في شكل 1.1 هو 'Software to Process Queries/Programs'."
  },
  {
    id: 11,
    slideNum: 12,
    topic: "Conceptual Modeling - ER Model",
    question: "Real-world entities and their relationships (like UNIVERSITY entities) are typically expressed in which conceptual model?",
    options: [
      "ENTITY-RELATIONSHIP (ER) data model",
      "Assembly 8086 Instruction Set",
      "TCP/IP Networking Protocol Stack",
      "Von Neumann Hardware Architecture"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: السلايد 12 بتأكد إن الكيانات والعلاقات بنعبر عنها بنموذج مفاهيمي شهير هو الـ Entity-Relationship (ER) model."
  },
  {
    id: 12,
    slideNum: 14,
    topic: "Core Characteristics - Data Independence",
    question: "What characteristic allows changing data structures and storage organization without changing access programs?",
    options: [
      "Program-data independence",
      "Network packet routing",
      "Hard drive rotation latency",
      "Screen aspect ratio scaling"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: ده التعريف الأهم في المحاضرة: استقلالية البرامج عن البيانات (Program-data independence) بتسمح بتعديل هياكل التخزين دون الحاجة لتعديل برامج الوصول."
  },
  {
    id: 13,
    slideNum: 15,
    topic: "Database Catalog Structure",
    question: "In the simplified catalog example (Figure 1.3), which table stores Column_name, Data_type, and Belongs_to_relation?",
    options: [
      "COLUMNS",
      "RELATIONS",
      "GRADE_REPORT",
      "STUDENT_ACCOUNTS"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: جدول COLUMNS في الكتالوج هو اللي متسجل فيه اسم كل عمود ونوع بياناته والجدول التابع ليه."
  },
  {
    id: 14,
    slideNum: 16,
    topic: "Program-Operation Independence",
    question: "In Program-operation independence, which part includes the operation name and the data types of its arguments?",
    options: [
      "The Interface",
      "The Implementation",
      "The Physical Sector Track",
      "The Optical Laser Lens"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: السلايد 16 وضحت إن الـ Interface بيشمل اسم العملية وأنواع الـ arguments، بينما الـ Implementation هو كود التنفيذ اللي نقدر نغيره براحتنا."
  },
  {
    id: 15,
    slideNum: 17,
    topic: "Multiple Views of Data",
    question: "Why does a modern DBMS provide support for multiple views of the data?",
    options: [
      "To allow each user to see only the data of interest to that specific user",
      "To duplicate disk storage needlessly across multiple servers",
      "To restrict network bandwidth speed during peak hours",
      "To force all developers to write machine language"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: السلايد 17 بينت إن الـ Multiple views بتخلي كل فئة من المستخدمين تشوف View خاصة بالبيانات اللي تهمها بس (Data of interest)."
  },
  {
    id: 16,
    slideNum: 18,
    topic: "Concurrency & Recovery Subsystem",
    question: "Which component inside the DBMS ensures that each completed transaction has its effect permanently recorded?",
    options: [
      "Recovery subsystem",
      "Keyboard interrupt buffer",
      "Temporary clipboard stack",
      "Screen display refresh controller"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: السلايد 18 حددت إن الـ 'Recovery subsystem' هو المسؤول عن ضمان بقاء وتسجيل أثر أي معاملة مكتملة بشكل دائم في قاعدة البيانات."
  },
  {
    id: 17,
    slideNum: 20,
    topic: "Database Users - DBA Role",
    question: "Who is primarily responsible for authorizing access, monitoring efficiency, and acquiring software/hardware resources?",
    options: [
      "Database Administrator (DBA)",
      "Application Programmer",
      "Casual End User",
      "Tool Developer"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: منح وتفويض الصلاحيات وتوفير الموارد ومراقبة كفاءة التشغيل دي وظيفة مدير قاعدة البيانات (DBA)."
  },
  {
    id: 18,
    slideNum: 21,
    topic: "Database Users - Naïve/Parametric",
    question: "Bank tellers and mobile app users who perform predefined 'canned transactions' belong to which category?",
    options: [
      "Naïve or Parametric end users",
      "Database Administrators (DBA)",
      "System Implementors",
      "Stand-alone Users"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: صرافو البنوك ومستخدمو الموبايل اللي بيتعاملوا مع معاملات جاهزة (canned transactions) هما Naïve or Parametric users."
  },
  {
    id: 19,
    slideNum: 25,
    topic: "Advantages - Normalization",
    question: "Storing each logical data item in only one place in the database to ensure consistency and save storage space is called:",
    options: [
      "Data normalization",
      "Data encryption scrambling",
      "Memory stack swapping",
      "Processor instruction caching"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: تخزين كل معلومة في مكان واحد فقط لمنع التكرار وضمان الاتساق هو تعريف الـ Data Normalization في السلايد 25."
  },
  {
    id: 20,
    slideNum: 29,
    topic: "Implications - Economies of Scale",
    question: "Avoiding wasteful overlap of resources and personnel by consolidating data and applications across departments describes:",
    options: [
      "Economies of scale",
      "CPU thermal throttling",
      "RAM memory fragmentation",
      "Display resolution scaling"
    ],
    correct: 0,
    explanation: "التفسير بالعامية: دمج البيانات والتطبيقات وتجنب الهدر والتكرار في الموارد والموظفين عبر الأقسام هو تعريف الـ Economies of scale في السلايد 29."
  }
];

const fileContent = `/**
 * ==============================================================================
 * ملف بيانات الشرح التفاعلي الذكي للمحاضرات (Smart Lecture Walkthrough Data)
 * ==============================================================================
 * يحتوي على تفكيك كامل لكل شريحة من شرائح المحاضرة:
 * - صورة السلايد الأصلية بدقة عالية
 * - الشرح بالعامية المصرية الممتعة والذكية مدمجة بمصطلحات السلايدات
 * - تفكيك المفاهيم المتعددة في بطاقات منفصلة وواضحة (Points breakdown)
 * - كود الغش الامتحاني: لو شوفت كذا اختار كذا (Exam Triggers)
 * - الكلمات المفتاحية والمصطلحات الأكاديمية (Keywords)
 * - تريكات وفخاخ الامتحان بتباين وألوان واضحة (Exam Tricks)
 * - كويز تفاعلي فوري بالإنجليزية مع تفسير الإجابة بالعامية المصرية ومصطلحات المادة
 * - كويز شامل على المحاضرة من السلايدات يغطي كل الأجزاء في تاب مستقل (Full Quiz)
 */

const LECTURE_EXPLANATIONS = {
  // ============================================================================
  // مادة قواعد البيانات (database-systems) - المحاضرة 2 (د. محمد ماهر)
  // ============================================================================
  "database-systems": {
    2: {
      courseId: "database-systems",
      lectureId: 2,
      courseName: "Database Systems (IS211)",
      lectureTitle: "Lecture 2: Databases and Database Users",
      lectureArabicTitle: "قواعد البيانات، مستخدمي النظم، وأساسيات معمارية DBMS (د. محمد ماهر)",
      totalSlides: 30,
      slides: ${JSON.stringify(slidesData, null, 2)},
      fullQuiz: ${JSON.stringify(fullQuizData, null, 2)}
    }
  }
};

if (typeof window !== "undefined") {
  window.LECTURE_EXPLANATIONS = LECTURE_EXPLANATIONS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = LECTURE_EXPLANATIONS;
}
`;

fs.writeFileSync(path.join(__dirname, '../js/lecture-explanations-data.js'), fileContent, 'utf-8');
console.log('Successfully wrote updated lecture data with Egyptian Arabic explanations, triggers, and full quiz to js/lecture-explanations-data.js');
