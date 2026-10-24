const fs = require('fs');
const path = require('path');

const slidesData = [
  {
    num: 1,
    title: "Lecture 2: Databases and Database Users",
    arabicTitle: "غلاف المحاضرة وبيانات المقرر (د. محمد ماهر)",
    image: "materials/slides/db-lec2/slide_1.png",
    coreSummary: "المحاضرة الثانية من مقرر أنظمة قواعد البيانات بعنوان 'Databases and Database Users' تقديم د. محمد ماهر وتغطي الفصل الأول من المرجع المعتمد.",
    explanationIntro: "نبدأ في هذه المحاضرة بدراسة الأساس النظري والعملي لعالم قواعد البيانات مع الدكتور محمد ماهر؛ المحاضرة تؤسس لفهم الفارق بين الملفات العادية ونظم قواعد البيانات الحديثة وتستعرض أنواع التطبيقات والمستخدمين ودور الـ DBMS في إدارة البيانات بكفاءة.",
    points: [
      {
        badge: "Lecture Title",
        title: "عنوان المحاضرة والمقرر",
        desc: "Lecture 2: Databases and Database Users، وهي تغطي المحتوى العلمي للفصل الأول من كتاب Fundamentals of Database Systems."
      },
      {
        badge: "Instructor",
        title: "أستاذ المادة",
        desc: "د. محمد ماهر (Dr. Mohamed Maher) - قسم نظم المعلومات."
      },
      {
        badge: "Core Objective",
        title: "الهدف العام للمحاضرة",
        desc: "التعرف على المفاهيم الجوهرية (Data, Database, DBMS)، فهم خصائص Database Approach، والتمييز بين فئات المستخدمين ومزايا النظام."
      }
    ],
    keywords: [
      { en: "Databases and Database Users", ar: "قواعد البيانات ومستخدموها" },
      { en: "Dr. Mohamed Maher", ar: "د. محمد ماهر" },
      { en: "Database Systems", ar: "أنظمة قواعد البيانات" }
    ],
    tricks: "المحاضرة الأولى الفعلية للدفعة تبدأ من هذا المحتوى الخاص بالدكتور محمد ماهر؛ كل أسئلة امتحانات الميدتيرم والفاينل تركز على التعريفات الدقيقة الواردة في هذه الشرائح ومقارنات أنواع المستخدمين.",
    quiz: {
      question: "According to Slide 1, what is the exact title and instructor of this lecture?",
      options: [
        "Lecture 2: Databases and Database Users - Dr. Mohamed Maher",
        "Lecture 1: Introduction to Computer Architecture - Dr. Ali",
        "Lecture 3: Advanced Relational Algebra - Dr. Tarek",
        "Lecture 2: Operating System Internals - Dr. Sara"
      ],
      correct: 0,
      explanation: "Slide 1 clearly presents 'Lecture 2: Databases and Database Users' delivered by Dr. Mohamed Maher."
    }
  },
  {
    num: 2,
    title: "OUTLINE",
    arabicTitle: "مخطط موضوعات المحاضرة",
    image: "materials/slides/db-lec2/slide_2.png",
    coreSummary: "خارطة طريق المحاضرة وتتضمن 10 محاور رئيسية تغطي أنواع قواعد البيانات، التعريفات، وظائف الـ DBMS، المعمارية، والمستخدمين.",
    explanationIntro: "تعرض الشريحة الفهرس والمخطط التفصيلي للمحاضرة؛ يمثل هذا المخطط الهيكل المنطقي الذي سيتم تفكيكه خطوة بخطوة طوال الـ 30 شريحة.",
    points: [
      {
        badge: "Topic 1-3",
        title: "المفاهيم والتطبيقات والوظائف",
        desc: "أنواع قواعد البيانات وتطبيقاتها (Types & Applications)، التعريفات الأساسية (Basic Definitions)، ووظائف الـ DBMS المعتادة."
      },
      {
        badge: "Topic 4-5",
        title: "المثال العملي والخصائص المعمارية",
        desc: "دراسة نموذج عملي لقاعدة بيانات الجامعة (UNIVERSITY Example)، واستعراض الخصائص الجوهرية لمدخل قواعد البيانات (Main Characteristics)."
      },
      {
        badge: "Topic 6-7",
        title: "المستخدمون والمزايا التنافسية",
        desc: "تصنيفات المستخدمين (Types of Database Users)، ومزايا استخدام مدخل قواعد البيانات (Advantages of DB Approach)."
      },
      {
        badge: "Topic 8-10",
        title: "التطور التاريخي والقدرات الممتدة",
        desc: "تطور تكنولوجيا البيانات، توسيع إمكانيات النظم، والحالات التي لا يُفضل فيها استخدام نظم قواعد البيانات."
      }
    ],
    keywords: [
      { en: "Outline", ar: "مخطط المحاضرة" },
      { en: "Database Applications", ar: "تطبيقات قواعد البيانات" },
      { en: "DBMS Functionality", ar: "وظائف نظام إدارة قواعد البيانات" },
      { en: "Database Users", ar: "مستخدمو قواعد البيانات" }
    ],
    tricks: "المخطط يحدد نطاق الامتحان؛ لاحظ أن المقرر يركز على التطبيقات التقليدية (Traditional Applications) مع استعراض شامل لخصائص الـ Database Approach.",
    quiz: {
      question: "Which of the following topics is explicitly listed in the lecture OUTLINE (Slide 2)?",
      options: [
        "Main Characteristics of the Database Approach",
        "Microprocessor Assembly Instruction Set",
        "Bresenham's Circle Drawing Algorithm",
        "CPU Scheduling and Virtual Memory Management"
      ],
      correct: 0,
      explanation: "Slide 2 explicitly lists 'Main Characteristics of the Database Approach' as one of the primary lecture topics."
    }
  },
  {
    num: 3,
    title: "Types of Databases and Database Applications",
    arabicTitle: "أنواع قواعد البيانات وتطبيقاتها (تقليدية وحديثة)",
    image: "materials/slides/db-lec2/slide_3.png",
    coreSummary: "المقارنة بين التطبيقات التقليدية الرقمية/النصية والتطبيقات الحديثة مثل الوسائط والـ GIS والبيانات الحيوية ومستودعات البيانات.",
    explanationIntro: "توضح هذه الشريحة تنوع قواعد البيانات؛ فبينما اعتمدت النظم القديمة على نصوص وأرقام، تطورت التكنولوجيا لتشمل الخرائط والوسائط والجينات، إلا أن مقررنا يركز أساساً على التطبيقات التقليدية.",
    points: [
      {
        badge: "Traditional",
        title: "التطبيقات التقليدية (Traditional Applications)",
        desc: "قواعد البيانات الرقمية والنصية (Numeric and Textual Databases)، مثل سجلات الموظفين والطلاب والحسابات المالية."
      },
      {
        badge: "Modern (1)",
        title: "قواعد بيانات الوسائط والخرائط",
        desc: "قواعد بيانات الوسائط المتعددة (Multimedia Databases: صور وفيديو وصوت)، ونظم المعلومات الجغرافية (GIS: خرائط ومواقع فضائية)."
      },
      {
        badge: "Modern (2)",
        title: "التطبيقات البيولوجية والمستودعات والبيانات الضخمة",
        desc: "قواعد البيانات الجينومية والبيولوجية (Biological & Genome)، مستودعات البيانات (Data Warehouses)، قواعد بيانات الهواتف (Mobile DBs)، النظم اللحظية (Real-time and Active DBs)، والبيانات الضخمة (Bigdata)."
      },
      {
        badge: "Course Scope",
        title: "نطاق وتركيز المقرر الدراسي",
        desc: "ملاحظة هامة جداً أسفل السلايد: 'Our course focuses on traditional applications' (تركيز المقرر على التطبيقات التقليدية)."
      }
    ],
    keywords: [
      { en: "Traditional Applications", ar: "تطبيقات تقليدية" },
      { en: "Numeric and Textual Databases", ar: "قواعد بيانات رقمية ونصية" },
      { en: "Multimedia Databases", ar: "قواعد بيانات الوسائط المتعددة" },
      { en: "GIS", ar: "نظم المعلومات الجغرافية" },
      { en: "Data Warehouses", ar: "مستودعات البيانات" },
      { en: "Bigdata", ar: "البيانات الضخمة" }
    ],
    tricks: "فخ امتحاني مؤكد: قد يسألك 'Does this course focus on Big Data and Multimedia databases?' الإجابة هي (False/No)، لأن الشريحة تنص صراحة على أن المقرر يركز على التطبيقات التقليدية (Numeric & Textual).",
    quiz: {
      question: "According to Slide 3, what is the primary focus of this academic database course?",
      options: [
        "Traditional applications (Numeric and Textual databases)",
        "Biological and Genome Databases exclusively",
        "Advanced Mobile Big Data Streaming",
        "Geographic Information Systems (GIS) mapping"
      ],
      correct: 0,
      explanation: "Slide 3 explicitly states at the bottom: 'Our course focuses on traditional applications' (numeric and textual)."
    }
  },
  {
    num: 4,
    title: "Recent Developments (1)",
    arabicTitle: "التطورات الحديثة: شبكات التواصل ومحركات البحث",
    image: "materials/slides/db-lec2/slide_4.png",
    coreSummary: "كيف غيرت منصات التواصل الاجتماعي ومحركات البحث مفهوم البيانات بجمع مليارات المنشورات والصفحات والصور يومياً.",
    explanationIntro: "تستعرض الشريحة ثورة البيانات الحديثة؛ فالبيانات لم تعد مقتصرة على الجداول المألوفة، بل أصبحت تشمل كل تفاعل بشري إلكتروني عبر المنصات العالمية.",
    points: [
      {
        badge: "Social Media",
        title: "شبكات التواصل الاجتماعي (Social Networks)",
        desc: "منصات مثل Facebook و Twitter و Linked-In تلتقط وتخزن كميات غير مسبوقة من منشورات وتغريدات وصور وفيديوهات ومحادثات المستخدمين."
      },
      {
        badge: "All is Data",
        title: "كل التفاعلات هي بيانات (Constitutes Data)",
        desc: "جميع المنشورات والتفضيلات والصور والروابط بين الأفراد تُعد بيانات حقيقية تتطلب معالجة وتحليلاً وتخزيناً ضخماً."
      },
      {
        badge: "Search Engines",
        title: "محركات البحث (Search Engines)",
        desc: "محركات مثل Google و Bing و Yahoo تجمع وتبني مستودعات وأرشيفات مفهرسة عملاقة لصفحات الويب لخدمة عمليات الاستعلام والبحث الفوري."
      }
    ],
    keywords: [
      { en: "Recent Developments", ar: "التطورات الحديثة" },
      { en: "Social Networks", ar: "شبكات التواصل الاجتماعي" },
      { en: "Search Engines", ar: "محركات البحث" },
      { en: "Web Repository", ar: "مستودع صفحات الويب" }
    ],
    tricks: "منصات التواصل ومحركات البحث تمثل التطبيقات غير التقليدية للبيانات غير المهيكلة (Unstructured Data) التي مهدت لظهور تقنيات الـ NoSQL والـ Big Data.",
    quiz: {
      question: "Why do search engines such as Google, Bing, and Yahoo collect massive repositories of web pages?",
      options: [
        "For searching and indexing purposes",
        "To replace traditional computer operating systems",
        "To eliminate all physical computer memory",
        "To build video games for smartphones"
      ],
      correct: 0,
      explanation: "Slide 4 indicates that search engines collect their own repository of web pages for searching purposes."
    }
  },
  {
    num: 5,
    title: "Basic Definitions",
    arabicTitle: "التعريفات الأساسية: Database, Data, Mini-world, DBMS, DB System",
    image: "materials/slides/db-lec2/slide_5.png",
    coreSummary: "تعريف المصطلحات الخمسة الجوهرية في علم قواعد البيانات: البيانات، قاعدة البيانات، العالم المصغر (UoD)، نظام الإدارة DBMS، ونظام قاعدة البيانات.",
    explanationIntro: "هذه الشريحة من أهم شرائح المقرر على الإطلاق؛ تبني المفردات الدقيقة التي ستستخدمها في كل المحاضرات والامتحانات القادمة.",
    points: [
      {
        badge: "Database",
        title: "قاعدة البيانات (Database)",
        desc: "مجموعة من البيانات المترابطة منطقياً (A collection of related data)."
      },
      {
        badge: "Data",
        title: "البيانات (Data)",
        desc: "حقائق معروفة يمكن تسجيلها ولها معنى ضمني محدد (Known facts that can be recorded and have an implicit meaning)."
      },
      {
        badge: "Mini-world",
        title: "العالم المصغر (Mini-world / Universe of Discourse - UoD)",
        desc: "جزء من العالم الحقيقي تُخزن بياناته في قاعدة البيانات (مثل درجات وسجلات طلاب جامعة). وأي تغيير في العالم المصغر ينعكس مباشرة في قاعدة البيانات."
      },
      {
        badge: "DBMS",
        title: "نظام إدارة قواعد البيانات (DBMS)",
        desc: "حزمة برمجية أو نظام برمجي يسهل إنشاء وصيانة قاعدة بيانات إلكترونية محوسبة (Software package to facilitate creation and maintenance)."
      },
      {
        badge: "Database System",
        title: "نظام قاعدة البيانات (Database System)",
        desc: "برمجيات الـ DBMS مع البيانات نفسها (DBMS software together with data itself)، وفي بعض الأحيان يشمل البرامج التطبيقية أيضاً."
      }
    ],
    keywords: [
      { en: "Database", ar: "قاعدة بيانات" },
      { en: "Data", ar: "بيانات" },
      { en: "Mini-world / UoD", ar: "العالم المصغر / فضاء الحوار" },
      { en: "DBMS", ar: "نظام إدارة قواعد البيانات" },
      { en: "Database System", ar: "نظام قاعدة البيانات" }
    ],
    tricks: "انتبه بشدة للمصطلح 'Universe of Discourse' أو 'UoD'؛ هو الاسم العلمي البديل لـ 'Mini-world'. وتذكر أن الـ DBMS هو البرنامج، بينما الـ Database System هو البرنامج + البيانات المخزنة.",
    quiz: {
      question: "What is the technical definition of 'Data' according to Slide 5?",
      options: [
        "Known facts that can be recorded and have an implicit meaning",
        "A software package that manages hardware components",
        "Random electromagnetic signals without meaning",
        "An interconnected network of computer servers"
      ],
      correct: 0,
      explanation: "Slide 5 defines Data as: 'Known facts that can be recorded and have an implicit meaning.'"
    }
  },
  {
    num: 6,
    title: "Basic Definitions (cont.)",
    arabicTitle: "التعريفات الأساسية: التعريف، البيانات الوصفية، والتعامل مع البيانات",
    image: "materials/slides/db-lec2/slide_6.png",
    coreSummary: "شرح معنى تعريف قاعدة البيانات، مفهوم البيانات الوصفية (Meta-data) والكتالوج، وعمليات معالجة البيانات (الاسترجاع والتعديل).",
    explanationIntro: "توضح الشريحة كيف تبدأ دورة حياة قاعدة البيانات بتحديد البنية والأنواع والقيود، ثم تخزين هذا التوصيف كبيانات وصفية، وتوفير آليات استرجاع وتحديث البيانات عبر التطبيقات.",
    points: [
      {
        badge: "Defining",
        title: "تعريف قاعدة البيانات (Defining a database)",
        desc: "تحديد وتخصيص أنواع البيانات (Data types)، الهياكل التخزينية (Structures)، والقيود والشروط (Constraints) للبيانات المراد حفظها."
      },
      {
        badge: "Meta-data",
        title: "البيانات الوصفية (Meta-data)",
        desc: "معلومات التوصيف والتعريف الخاصة بقاعدة البيانات (Database definition or descriptive info)؛ وتُخزن داخل الـ DBMS في 'كتالوج أو قاموس قاعدة البيانات' (Catalog or Dictionary)."
      },
      {
        badge: "Manipulating",
        title: "معالجة واستخدام البيانات (Manipulating a database)",
        desc: "تشمل: 1) الاسترجاع (Retrieval) عبر الاستعلامات وإنشاء التقارير، 2) التعديل (Modification) كالإضافة والحذف والتحديث، و3) الوصول عبر تطبيقات الويب."
      }
    ],
    keywords: [
      { en: "Defining a database", ar: "تعريف قاعدة البيانات" },
      { en: "Meta-data", ar: "بيانات وصفية" },
      { en: "Catalog / Dictionary", ar: "كتالوج أو قاموس البيانات" },
      { en: "Retrieval", ar: "استرجاع البيانات" },
      { en: "Modification", ar: "تعديل وتحديث" }
    ],
    tricks: "الميتا-داتا (Meta-data) هي 'بيانات تصف البيانات'؛ سؤال امتحان يتكرر دائماً: أين يخزن الـ DBMS هذه البيانات الوصفية؟ الإجابة: في الـ Database Catalog أو Dictionary.",
    quiz: {
      question: "Where is the descriptive meta-data of a database stored by the DBMS?",
      options: [
        "In the database catalog or dictionary",
        "Inside the user application source code",
        "On external paper documentation only",
        "In the computer monitor hardware"
      ],
      correct: 0,
      explanation: "Slide 6 states that Meta-data is stored by the DBMS in the form of a database catalog or dictionary."
    }
  },
  {
    num: 7,
    title: "Basic Definitions (cont.)",
    arabicTitle: "التعريفات الأساسية: مشاركة البيانات، البرامج التطبيقية، والاستعلامات",
    image: "materials/slides/db-lec2/slide_7.png",
    coreSummary: "مفهوم مشاركة قاعدة البيانات بين مستخدمين متزامنين، ودور البرنامج التطبيقي والاستعلام (Query) في استدعاء البيانات.",
    explanationIntro: "تكمل الشريحة التعريفات الأساسية ببيان كيف يتفاعل العالم الخارجي مع قاعدة البيانات من خلال المشاركة المتزامنة والبرامج والاستعلامات الموجهة للمحرك.",
    points: [
      {
        badge: "Sharing",
        title: "مشاركة قاعدة البيانات (Sharing a database)",
        desc: "السماح لعدة مستخدمين وعدة برامج بالوصول المتزامن (Simultaneous Access) إلى قاعدة البيانات في نفس الوقت دون تعارض."
      },
      {
        badge: "Application",
        title: "البرنامج التطبيقي (Application Program)",
        desc: "برنامج حاسوبي يصل إلى قاعدة البيانات عبر إرسال استعلامات وأوامر (Queries) إلى نظام إدارة قواعد البيانات DBMS."
      },
      {
        badge: "Query",
        title: "الاستعلام (Query)",
        desc: "أمر أو طلب موجه للـ DBMS يتسبب في جلب واسترجاع بيانات محددة من قاعدة البيانات (Causes some data to be retrieved)."
      }
    ],
    keywords: [
      { en: "Sharing a database", ar: "مشاركة قاعدة البيانات" },
      { en: "Simultaneous access", ar: "وصول متزامن" },
      { en: "Application program", ar: "برنامج تطبيقي" },
      { en: "Query", ar: "استعلام" }
    ],
    tricks: "البرنامج التطبيقي (Application) لا يقرأ من القرص الصلب مباشرة، بل هو وسيط يرسل الـ Query إلى الـ DBMS، والـ DBMS هو المسؤول الحصري عن قراءة البيانات وإرجاعها.",
    quiz: {
      question: "According to Slide 7, what is an 'Application program' in the context of databases?",
      options: [
        "A program that accesses the database by sending queries to the DBMS",
        "A physical cable connecting the server to the router",
        "A hardware device used to print database tables",
        "The operating system kernel itself"
      ],
      correct: 0,
      explanation: "Slide 7 defines an application program as one that 'Accesses database by sending queries to DBMS.'"
    }
  },
  {
    num: 8,
    title: "Application Activities Against a Database",
    arabicTitle: "أنشطة التطبيقات على قاعدة البيانات (الاستعلامات والمعاملات)",
    image: "materials/slides/db-lec2/slide_8.png",
    coreSummary: "التطبيقات تتفاعل مع قاعدة البيانات بنوعين رئيسيين من الأنشطة: الاستعلامات (Queries) والمعاملات (Transactions)، مع حظر غير المصرح لهم ومواكبة المتطلبات.",
    explanationIntro: "توضح الشريحة العمليات التي تجريها التطبيقات على البيانات؛ فالأمر ينقسم إما إلى قراءة واسترجاع (Query) أو قراءة وتحديث وتوليد بيانات جديدة (Transaction) مع الالتزام الصارم بالأمان وتطوير النظام.",
    points: [
      {
        badge: "Queries",
        title: "الاستعلامات (Queries)",
        desc: "تصل إلى أجزاء مختلفة من البيانات وتصيغ نتيجة الطلب المطلوب (Access data and formulate the result of a request)."
      },
      {
        badge: "Transactions",
        title: "المعاملات (Transactions)",
        desc: "عمليات قد تقرأ بعض البيانات وتقوم بتحديث قيم معينة أو توليد بيانات جديدة وتخزينها في قاعدة البيانات (Read, update values, or generate new data)."
      },
      {
        badge: "Security",
        title: "منع الوصول غير المصرح به",
        desc: "يجب على التطبيقات عدم السماح للمستخدمين غير المخولين (Unauthorized users) بالوصول إلى البيانات أو تعديلها."
      },
      {
        badge: "Evolution",
        title: "مواكبة المتطلبات المتغيرة",
        desc: "يجب أن تواكب التطبيقات متطلبات المستخدمين التي تتغير وتتطور باستمرار (Keep up with changing user requirements)."
      }
    ],
    keywords: [
      { en: "Queries", ar: "استعلامات" },
      { en: "Transactions", ar: "معاملات" },
      { en: "Unauthorized access", ar: "وصول غير مصرح به" },
      { en: "Changing requirements", ar: "متطلبات متغيرة" }
    ],
    tricks: "الفرق الجوهري: الاستعلام (Query) هو عملية قراءة واسترجاع، أما المعاملة (Transaction) فتشمل قراءة وتعديل (Write/Update) لقيم في قاعدة البيانات.",
    quiz: {
      question: "Which activity against a database may read data, update certain values, or generate new data to be stored?",
      options: [
        "Transaction",
        "Simple Query",
        "Monitor Screen Calibration",
        "Keyboard Key Mapping"
      ],
      correct: 0,
      explanation: "Slide 8 defines Transactions as operations that 'may read some data and update certain values or generate new data and store that in the database.'"
    }
  },
  {
    num: 9,
    title: "Additional DBMS Functionality",
    arabicTitle: "الوظائف الإضافية لنظام الـ DBMS (الحماية، الأمان، والصيانة)",
    image: "materials/slides/db-lec2/slide_9.png",
    coreSummary: "وظائف الـ DBMS تتجاوز التخزين والاستعلام لتشمل حماية النظام من الأعطال البرمجية والعتادية، والأمان ضد الاختراق، وصيانة النظام وتطويره.",
    explanationIntro: "تبين هذه الشريحة المهام الحيوية التي يقوم بها محرك الـ DBMS في الخلفية لضمان بقاء البيانات سليمة ومحمية من الانهيار والسرقة، وقابلة للتطور مع متطلبات المؤسسة.",
    points: [
      {
        badge: "System Protection",
        title: "حماية النظام (System Protection)",
        desc: "الحماية ضد أعطال ومشاكل العتاد (Hardware malfunction) أو انهيار وتوقف البرمجيات المفاجئ (Crashes)."
      },
      {
        badge: "Security Protection",
        title: "الحماية الأمنية (Security Protection)",
        desc: "حماية البيانات من الوصول غير المصرح به (Unauthorized) أو الهجمات الخبيثة (Malicious access)."
      },
      {
        badge: "Maintenance",
        title: "صيانة وتطوير النظام (Maintain & Evolve)",
        desc: "إتاحة الفرصة للنظام للتطور والتوسع وتعديل الهياكل كلما تغيرت المتطلبات بمرور الزمن."
      }
    ],
    keywords: [
      { en: "System protection", ar: "حماية النظام من الأعطال" },
      { en: "Hardware/Software crashes", ar: "انهيار العتاد والبرمجيات" },
      { en: "Security protection", ar: "الحماية الأمنية" },
      { en: "System evolution", ar: "تطور وتحديث النظام" }
    ],
    tricks: "احذر الخلط بين System Protection (التعافي من انقطاع الكهرباء وانهيار السيرفرات) و Security Protection (منع المتسللين وتحديد الصلاحيات).",
    quiz: {
      question: "Protecting the database system against hardware or software malfunctions (crashes) is termed as:",
      options: [
        "System protection",
        "Graphic rendering",
        "Network latency",
        "Data normalization"
      ],
      correct: 0,
      explanation: "Slide 9 specifies that System Protection protects against hardware or software malfunction (or crashes)."
    }
  },
  {
    num: 10,
    title: "Simplified database system environment",
    arabicTitle: "معمارية وبيئة نظام قواعد البيانات المبسطة (شكل 1.1)",
    image: "materials/slides/db-lec2/slide_10.png",
    coreSummary: "مخطط معمارية نظام قواعد البيانات المبسط (شكل 1.1): يوضح مسار الطلب من المستخدم والبرامج مروراً بمحرك الـ DBMS وصولاً لقاعدة البيانات والميتا-داتا.",
    explanationIntro: "يعرض هذا الشكل التوضيحي (Figure 1.1) كيف تترابط مكونات نظام قواعد البيانات كطبقات متسلسلة تبدأ من المستخدم وتمر ببرمجيات معالجة الاستعلام والوصول للبيانات.",
    points: [
      {
        badge: "Top Layer",
        title: "المستخدمون والبرامج (Users & Application Programs)",
        desc: "في القمة: المستخدمون والمبرمجون (Users/Programmers) الذين يطلقون استعلامات أو تطبيقات (Application Programs/Queries)."
      },
      {
        badge: "DBMS Core (1)",
        title: "برمجية معالجة الاستعلامات (Software to Process Queries)",
        desc: "المكون البرمجي الأول داخل الـ DBMS الذي يستقبل الاستعلام ويفسره ويحوله لخطة تنفيذية."
      },
      {
        badge: "DBMS Core (2)",
        title: "برمجية الوصول للبيانات (Software to Access Stored Data)",
        desc: "المكون البرمجي الثاني المسؤول عن التخاطب مع وسائط التخزين لجلب وكتابة السجلات الفعلية."
      },
      {
        badge: "Storage Layer",
        title: "طبقة التخزين المزدوجة (Stored DB & Meta-Data)",
        desc: "التخزين ينقسم إلى أسطوانتين: الأولى هي 'Stored Database Definition (Meta-Data)' في الكتالوج، والثانية هي 'Stored Database' التي تحتوي البيانات الحقيقية."
      }
    ],
    keywords: [
      { en: "Simplified DB Environment", ar: "بيئة نظام قواعد البيانات المبسطة" },
      { en: "Process Queries/Programs", ar: "معالجة الاستعلامات والبرامج" },
      { en: "Access Stored Data", ar: "الوصول للبيانات المخزنة" },
      { en: "Meta-Data Catalog", ar: "كتالوج البيانات الوصفية" }
    ],
    tricks: "لاحظ في الرسم: برمجيات الـ DBMS تقرأ من أسطوانة الـ Meta-Data أولاً لمعرفة بنية الجداول ومواقعها، قبل أن تقرأ أو تكتب في أسطوانة الـ Stored Database.",
    quiz: {
      question: "In the simplified database system environment diagram (Figure 1.1), what two distinct storage components are shown at the bottom?",
      options: [
        "Stored Database Definition (Meta-Data) and Stored Database",
        "RAM Cache and Optical Disk",
        "Operating System Kernel and BIOS",
        "Display Buffer and Printer Queue"
      ],
      correct: 0,
      explanation: "Figure 1.1 displays two cylinders at the bottom: 'Stored Database Definition (Meta-Data)' and 'Stored Database'."
    }
  },
  {
    num: 11,
    title: "Example of a Database (with a Conceptual Data Model)",
    arabicTitle: "مثال عملي لقاعدة بيانات جامعية (الكيانات الأساسية)",
    image: "materials/slides/db-lec2/slide_11.png",
    coreSummary: "مثال لقاعدة بيانات تمثل جزءاً من بيئة جامعية (UNIVERSITY) وتحديد الكيانات الواقعية المستهدفة (STUDENTs, COURSEs, SECTIONs, DEPARTMENTs, INSTRUCTORs).",
    explanationIntro: "تبدأ هذه الشريحة في تطبيق المفاهيم النظرية على بيئة واقعية نعيشها جميعاً، وهي بيئة الجامعة، مستعرضة الكيانات التي نحتاج تخزين معلومات عنها.",
    points: [
      {
        badge: "Mini-world",
        title: "العالم المصغر المختار",
        desc: "بيئة الجامعة الأكاديمية (Part of a UNIVERSITY environment)."
      },
      {
        badge: "Entities (1)",
        title: "الطلاب والمقررات",
        desc: "كيان الطلاب (STUDENTs) لتخزين البيانات الشخصية والأكاديمية، وكيان المقررات (COURSEs) لتسجيل المواد الدراسية."
      },
      {
        badge: "Entities (2)",
        title: "الشعب والسكاشن (SECTIONs)",
        desc: "الشعب والفصول الدراسية المنعقدة لكل مادة في فصل دراسي معين (Sections of courses)."
      },
      {
        badge: "Entities (3)",
        title: "الأقسام والمحاضرون",
        desc: "الأقسام الأكاديمية (academic DEPARTMENTs) مثل قسم IS و CS، والمحاضرون وأعضاء هيئة التدريس (INSTRUCTORs)."
      }
    ],
    keywords: [
      { en: "Conceptual Data Model", ar: "نموذج البيانات المفاهيمي" },
      { en: "UNIVERSITY environment", ar: "بيئة الجامعة" },
      { en: "Entities", ar: "الكيانات" },
      { en: "STUDENTs, COURSEs, SECTIONs", ar: "الطلاب، المقررات، الفصول" }
    ],
    tricks: "هذه الكيانات هي الأساس الذي يُبنى عليه النموذج المفاهيمي (Conceptual Model)؛ كل كيان يمثل شيئاً واقعياً موجوداً ومستقلاً في البيئة الجامعية.",
    quiz: {
      question: "Which of the following is NOT listed as a mini-world entity in the UNIVERSITY example on Slide 11?",
      options: [
        "AEROPLANE flight routes",
        "STUDENTs",
        "SECTIONs (of COURSEs)",
        "INSTRUCTORs"
      ],
      correct: 0,
      explanation: "Slide 11 lists STUDENTs, COURSEs, SECTIONs, DEPARTMENTs, and INSTRUCTORs. 'AEROPLANE flight routes' belongs to an airline, not a university."
    }
  },
  {
    num: 12,
    title: "Example of a Database (with a Conceptual Data Model) - Relationships",
    arabicTitle: "العلاقات في قاعدة البيانات الجامعية ونموذج الـ ER",
    image: "materials/slides/db-lec2/slide_12.png",
    coreSummary: "تحديد العلاقات المنطقية التي تربط كيانات الجامعة ببعضها، والتأكيد على استخدام نموذج الـ Entity-Relationship (ER) للتعبير عنها.",
    explanationIntro: "بعد تحديد الكيانات، توضح الشريحة الروابط والعلاقات التي تجمعها معاً (مثل طالب يسجل مادة، دكتور يدرس سكشن)، مشيرة إلى أن مخطط ER هو الأداة المعتمدة لتمثيلها مفاهيمياً.",
    points: [
      {
        badge: "Relation 1-2",
        title: "علاقات الشعب والتسجيل",
        desc: "الشعب والفصول تتبع مقررات محددة (SECTIONs are of specific COURSEs)، والطلاب يسجلون في الشعب (STUDENTs take SECTIONs)."
      },
      {
        badge: "Relation 3-4",
        title: "المتطلبات السابقة والتدريس",
        desc: "المقررات قد يكون لها متطلبات سابقة (COURSEs have prerequisite COURSEs)، والمحاضرون يدرسون الشعب (INSTRUCTORs teach SECTIONs)."
      },
      {
        badge: "Relation 5-6",
        title: "طرح المواد والتخصصات",
        desc: "المقررات تطرح بواسطة أقسام أكاديمية (COURSEs offered by DEPARTMENTs)، والطلاب يتخصصون في أقسام محددة (STUDENTs major in DEPARTMENTs)."
      },
      {
        badge: "Model Note",
        title: "التعبير عبر نموذج الـ ER",
        desc: "ملاحظة هامة: يتم التعبير عن هذه الكيانات والعلاقات عادة باستخدام نموذج مفاهيمي يُدعى ENTITY-RELATIONSHIP (ER) data model."
      }
    ],
    keywords: [
      { en: "Relationships", ar: "العلاقات" },
      { en: "Prerequisite", ar: "متطلب سابق" },
      { en: "Major in", ar: "يتخصص في قسم" },
      { en: "ENTITY-RELATIONSHIP (ER) model", ar: "نموذج الكيانات والعلاقات" }
    ],
    tricks: "سؤال امتحاني جوهري: ما هو النموذج المفاهيمي القياسي لتمثيل الكيانات والعلاقات؟ الإجابة: The Entity-Relationship (ER) data model.",
    quiz: {
      question: "According to Slide 12, what conceptual data model is typically used to express real-world entities and relationships?",
      options: [
        "ENTITY-RELATIONSHIP (ER) data model",
        "Binary Hexadecimal Assembly Model",
        "TCP/IP 4-Layer Network Model",
        "Von Neumann Computer Architecture Model"
      ],
      correct: 0,
      explanation: "Slide 12 specifically states: 'The above entities and relationships are typically expressed in a conceptual data model, such as the ENTITY-RELATIONSHIP data model.'"
    }
  },
  {
    num: 13,
    title: "Example of a simple database (Tables & Data)",
    arabicTitle: "مثال عملي للجداول وسجلات البيانات (شكل 1.2)",
    image: "materials/slides/db-lec2/slide_13.png",
    coreSummary: "نموذج فعلي لقاعدة بيانات علائقية تضم 4 جداول رئيسية: COURSE و SECTION و GRADE_REPORT و PREREQUISITE وتوضح الربط بالمفاتيح.",
    explanationIntro: "ينقلنا هذا الشكل (Figure 1.2) من المفهوم النظري إلى الشكل الفعلي للبيانات المخزنة في جداول ذات صفوف وأعمدة متناسقة.",
    points: [
      {
        badge: "COURSE",
        title: "جدول المقررات (COURSE)",
        desc: "يحتوي على: Course_name (اسم المقرر)، Course_number (رمز المادة مثل CS1310)، Credit_hours (عدد الساعات)، و Department (القسم)."
      },
      {
        badge: "SECTION",
        title: "جدول الشعب الدراسية (SECTION)",
        desc: "يحتوي على: Section_identifier (رقم الشعبة الفريد مثل 85)، Course_number، Semester، Year، و Instructor (اسم الدكتور مثل King أو Knuth)."
      },
      {
        badge: "GRADE_REPORT",
        title: "جدول تقارير الدرجات (GRADE_REPORT)",
        desc: "يربط بين رقم الطالب (Student_number) ورقم الشعبة (Section_identifier) والدرجة المستحقة (Grade: A, B, C)."
      },
      {
        badge: "PREREQUISITE",
        title: "جدول المتطلبات السابقة (PREREQUISITE)",
        desc: "يحدد المادة المطلوبة قبل مادة أخرى عبر زوج من الرموز (Course_number و Prerequisite_number)."
      }
    ],
    keywords: [
      { en: "Relational Tables", ar: "جداول علائقية" },
      { en: "COURSE Table", ar: "جدول المقررات" },
      { en: "SECTION Table", ar: "جدول الشعب" },
      { en: "GRADE_REPORT Table", ar: "جدول تقارير الدرجات" },
      { en: "PREREQUISITE Table", ar: "جدول المتطلبات" }
    ],
    tricks: "لاحظ كيف أن جدول GRADE_REPORT لا يكرر اسم الطالب ولا اسم المادة، بل يكتفي بالأرقام المعرفة (Foreign Keys) لربط السجلات بكفاءة ومنع التكرار.",
    quiz: {
      question: "In the database tables shown in Figure 1.2 (Slide 13), which table records the relationship between a student number and a section identifier to store a Grade?",
      options: [
        "GRADE_REPORT",
        "COURSE",
        "PREREQUISITE",
        "DEPARTMENT_MASTER"
      ],
      correct: 0,
      explanation: "Figure 1.2 shows that GRADE_REPORT contains Student_number, Section_identifier, and Grade."
    }
  },
  {
    num: 14,
    title: "Main Characteristics of the Database Approach",
    arabicTitle: "الخصائص الرئيسية لمدخل قواعد البيانات: الوصف الذاتي واستقلالية البيانات",
    image: "materials/slides/db-lec2/slide_14.png",
    coreSummary: "خاصيتان جوهريتان تميزان الـ Database Approach عن نظم الملفات التقليدية: الطبيعة ذاتية الوصف (Self-describing) واستقلالية البرامج عن البيانات (Program-data independence).",
    explanationIntro: "هذه الشريحة توضح السر الحقيقي لقوة قواعد البيانات مقارنة بالنظم القديمة؛ فالبيانات تصف نفسها داخل كتالوج، وتعديل هيكل البيانات لا يتطلب تعديل أكواد البرامج.",
    points: [
      {
        badge: "Self-Describing",
        title: "الطبيعة ذاتية الوصف (Self-describing nature)",
        desc: "نظام الـ DBMS يحتوي على كتالوج (Catalog) يخزن الوصف الكامل لقاعدة البيانات (هياكل البيانات، أنواعها، والقيود) وهو ما يسمى بالبيانات الوصفية (Meta-data)."
      },
      {
        badge: "Generality",
        title: "عمومية برمجية الـ DBMS",
        desc: "وجود الميتا-داتا في الكتالوج يسمح لبرمجية الـ DBMS بالعمل مع أي تطبيق وأي قاعدة بيانات جديدة دون تغيير في كود محرك الـ DBMS نفسه."
      },
      {
        badge: "Data Independence",
        title: "استقلالية البرامج عن البيانات (Program-data independence)",
        desc: "عزل كامل بين البرامج والبيانات المخزنة؛ يتيح تغيير هياكل البيانات وتنظيم التخزين دون الحاجة لتعديل برامج الوصول الخاصة بـ DBMS."
      }
    ],
    keywords: [
      { en: "Characteristics of DB Approach", ar: "خصائص مدخل قواعد البيانات" },
      { en: "Self-describing nature", ar: "الطبيعة ذاتية الوصف" },
      { en: "DBMS Catalog", ar: "كتالوج الـ DBMS" },
      { en: "Program-data independence", ar: "استقلالية البرامج عن البيانات" }
    ],
    tricks: "في النظم القديمة (File Systems)، كان شكل الملف مكتوباً داخل كود البرنامج (Hardcoded)، فإذا غيرت حجم حقل في الملف تعطل البرنامج بالكامل؛ قواعد البيانات حلت هذه المشكلة تماماً بفضل الـ Program-data independence.",
    quiz: {
      question: "What characteristic of the database approach allows changing data structures and storage organization without changing access programs?",
      options: [
        "Program-data independence",
        "Screen pixel resolution scaling",
        "Magnetic disk rotation speed",
        "Network packet routing"
      ],
      correct: 0,
      explanation: "Slide 14 defines 'Program-data independence' as allowing changing data structures and storage organization without having to change access programs."
    }
  },
  {
    num: 15,
    title: "Example of a simplified database catalog",
    arabicTitle: "مثال لكتالوج قاعدة البيانات المبسط (شكل 1.3)",
    image: "materials/slides/db-lec2/slide_15.png",
    coreSummary: "نموذج عملي لكتالوج النظام يوضح كيف يخزن الـ DBMS بياناته الوصفية في جدولين: RELATIONS (أسماء الجداول وعدد الأعمدة) و COLUMNS (الخصائص والأنواع).",
    explanationIntro: "يوضح هذا الشكل (Figure 1.3) التطبيق العملي لمفهوم الـ Meta-data؛ حيث يقوم الـ DBMS ببناء جداول داخلية خاصة به لتوثيق كل جدول وعمود ينشئه المستخدم.",
    points: [
      {
        badge: "RELATIONS Table",
        title: "جدول العلاقات والكيانات (RELATIONS)",
        desc: "يخزن اسم كل جدول في النظام (مثل STUDENT, COURSE, SECTION...) وعدد الأعمدة الموجودة به (No_of_columns)."
      },
      {
        badge: "COLUMNS Table",
        title: "جدول تفاصيل الأعمدة (COLUMNS)",
        desc: "يخزن اسم العمود (Column_name)، نوع بياناته (Data_type مثل Character(30) أو Integer(1))، والجدول الذي يتبعه (Belongs_to_relation)."
      },
      {
        badge: "Metadata in Practice",
        title: "كيف يرى الـ DBMS قاعدة البيانات؟",
        desc: "عندما تطلب أي استعلام، يقوم محرك الـ DBMS بالرجوع لهذا الكتالوج أولاً ليتأكد من صحة أسماء الأعمدة وأنواع البيانات قبل لمس السجلات."
      }
    ],
    keywords: [
      { en: "Database catalog", ar: "كتالوج قاعدة البيانات" },
      { en: "RELATIONS catalog table", ar: "جدول العلاقات في الكتالوج" },
      { en: "COLUMNS catalog table", ar: "جدول الأعمدة في الكتالوج" },
      { en: "Data_type", ar: "نوع البيانات" }
    ],
    tricks: "لاحظ أن الـ DBMS يعامل الكتالوج كأنه جداول عادية ولكنها مخصصة له (System Tables)؛ الميتا-داتا مخزنة بنفس منطق البيانات العادية.",
    quiz: {
      question: "In the simplified database catalog example (Figure 1.3, Slide 15), what information does the RELATIONS table store?",
      options: [
        "Relation_name and No_of_columns",
        "Student grades and exam scores",
        "The professor's salary and office hours",
        "The operating system version and RAM size"
      ],
      correct: 0,
      explanation: "Figure 1.3 clearly shows the RELATIONS table has two columns: 'Relation_name' and 'No_of_columns'."
    }
  },
  {
    num: 16,
    title: "Main Characteristics (cont.) - Data Abstraction & Operation Independence",
    arabicTitle: "تجريد البيانات واستقلالية العمليات والبرامج",
    image: "materials/slides/db-lec2/slide_16.png",
    coreSummary: "تجريد البيانات (Data Abstraction) يحقق استقلالية البيانات واستقلالية العمليات عبر فصل الواجهة (Interface) عن التنفيذ (Implementation).",
    explanationIntro: "تشرح الشريحة المفهوم المتقدم للـ Data Abstraction؛ فالنظام يوفر رؤية مفاهيمية للبيانات تخفي تفاصيل التخزين، ويفصل مواصفات العمليات عن كود تنفيذها الداخلي.",
    points: [
      {
        badge: "Data Abstraction",
        title: "مفهوم تجريد البيانات (Data Abstraction)",
        desc: "تمكين المستخدم من التعامل مع تمثيل مفاهيمي للبيانات (Conceptual Representation) دون الحاجة لمعرفة تفاصيل التخزين الفيزيائي المعقدة على الأقراص."
      },
      {
        badge: "Independence 1",
        title: "استقلالية البرنامج عن البيانات (Program-data independence)",
        desc: "هيكل ملفات البيانات يُخزن في كتالوج الـ DBMS بشكل منفصل تماماً عن برامج الوصول."
      },
      {
        badge: "Independence 2",
        title: "استقلالية البرنامج عن العمليات (Program-operation independence)",
        desc: "تُحدد العمليات في جزأين: 1) الواجهة (Interface) وتتضمن اسم العملية وأنواع مدخلاتها، 2) التنفيذ (Implementation) الذي يمكن تغييره داخلياً دون المساس بالواجهة."
      }
    ],
    keywords: [
      { en: "Data Abstraction", ar: "تجريد البيانات" },
      { en: "Program-operation independence", ar: "استقلالية البرامج عن العمليات" },
      { en: "Interface vs Implementation", ar: "الواجهة مقابل التنفيذ الداخلي" },
      { en: "Conceptual representation", ar: "تمثيل مفاهيمي" }
    ],
    tricks: "تذكر دائماً أن العمليات تنقسم لـ Interface (الاسم والبارامترات) و Implementation (طريقة الكود)؛ تغيير الـ Implementation لا يؤثر أبداً على البرامج المستدعية طالما ظل الـ Interface ثابتاً.",
    quiz: {
      question: "In Program-operation independence, what consists of the operation name and the data types of its arguments?",
      options: [
        "The Interface",
        "The Physical storage track",
        "The Power supply cable",
        "The CPU register"
      ],
      correct: 0,
      explanation: "Slide 16 explicitly states: 'Interface includes operation name and data types of its arguments.'"
    }
  },
  {
    num: 17,
    title: "Main Characteristics (cont.) - Conceptual View & Multiple Views",
    arabicTitle: "النموذج المفاهيمي ودعم وجهات النظر المتعددة (Multiple Views)",
    image: "materials/slides/db-lec2/slide_17.png",
    coreSummary: "استخدام نموذج البيانات لتقديم رؤية مفاهيمية وإخفاء التخزين، مع دعم وجهات نظر متعددة (Multiple Views) تناسب كل فئة مستخدمين.",
    explanationIntro: "توضح الشريحة كيف يحمي الـ DBMS المستخدمين من تعقيد التخزين باستخدام نماذج البيانات، وكيف يوفر لكل مستخدم زاوية رؤية خاصة به (View) تعرض فقط ما يحتاجه وتحجب ما لا يعنيه.",
    points: [
      {
        badge: "Data Model",
        title: "دور نموذج البيانات (Data Model)",
        desc: "يُستخدم لإخفاء تفاصيل التخزين الفيزيائي وتقديم رؤية مفاهيمية (Conceptual View) للبيانات؛ البرامج تتعامل مع عناصر النموذج وليس مع مسارات القرص الصلب."
      },
      {
        badge: "Multiple Views",
        title: "دعم وجهات نظر متعددة (Support of multiple views)",
        desc: "كل فئة من المستخدمين ترى واجهة أو منظوراً مختلفاً لقاعدة البيانات يعرض فقط البيانات التي تهمهم وتخص عملهم (Data of interest)."
      },
      {
        badge: "Benefits",
        title: "فوائد الـ Multiple Views",
        desc: "تسهيل العمل لكل موظف وتوفير حماية أمنية قوية بمنع الموظفين العاديين من رؤية البيانات المالية أو السرية لزملائهم."
      }
    ],
    keywords: [
      { en: "Conceptual view", ar: "رؤية مفاهيمية" },
      { en: "Data Model constructs", ar: "هياكل نموذج البيانات" },
      { en: "Multiple views of data", ar: "وجهات نظر متعددة للبيانات" }
    ],
    tricks: "الـ View في قواعد البيانات ليست مجرد تصميم شاشة، بل هي جدول افتراضي (Virtual Table) يفلتر البيانات ويخصصها؛ طالب الفرقة الثانية يرى درجاته فقط بينما الكنترول يرى درجات الكلية كلها.",
    quiz: {
      question: "Why does a modern DBMS support multiple views of the data?",
      options: [
        "To allow each user to see only the data of interest to that specific user",
        "To force all users to use the exact same black and white terminal",
        "To increase the power consumption of server hardware",
        "To duplicate all tables ten times across hard drives"
      ],
      correct: 0,
      explanation: "Slide 17 states: 'Each user may see a different view of the database, which describes only the data of interest to that user.'"
    }
  },
  {
    num: 18,
    title: "Main Characteristics (cont.) - Sharing, Concurrency & OLTP",
    arabicTitle: "مشاركة البيانات، التحكم في التزامن، والـ OLTP",
    image: "materials/slides/db-lec2/slide_18.png",
    coreSummary: "المعالجة المتزامنة للمعاملات بين عدة مستخدمين، دور الـ Concurrency Control والـ Recovery Subsystem، وأهمية أنظمة الـ OLTP.",
    explanationIntro: "تتناول هذه الشريحة قلب أنظمة قواعد البيانات المؤسسية؛ حيث تتيح لمئات المستخدمين القراءة والكتابة في نفس الوقت دون تلف البيانات، بفضل آليات التحكم في التزامن والتعافي من الأخطاء.",
    points: [
      {
        badge: "Sharing & Concurrency",
        title: "مشاركة البيانات والمعالجة المتزامنة",
        desc: "السماح لمجموعة مستخدمين متزامنين (Concurrent users) باسترجاع وتحديث قاعدة البيانات في اللحظة ذاتها دون تعارض."
      },
      {
        badge: "Concurrency Control",
        title: "التحكم في التزامن (Concurrency Control)",
        desc: "آلية داخل الـ DBMS تضمن تنفيذ كل معاملة (Transaction) بشكل صحيح تماماً أو التراجع عنها بالكامل (Aborted) لمنع التضارب."
      },
      {
        badge: "Recovery Subsystem",
        title: "النظام الفرعي للتعافي (Recovery Subsystem)",
        desc: "يضمن أن أي معاملة اكتملت بنجاح يتم تسجيل أثرها بشكل دائم وغير قابل للفقد في قاعدة البيانات حتى لو انقطع التيار فوراً."
      },
      {
        badge: "OLTP",
        title: "معالجة المعاملات الفورية (OLTP)",
        desc: "Online Transaction Processing: ركن أساسي في تطبيقات التجارة والبنوك يسمح بتنفيذ مئات المعاملات المتزامنة في الثانية الواحدة."
      }
    ],
    keywords: [
      { en: "Multi-user transaction processing", ar: "معالجة المعاملات لعدة مستخدمين" },
      { en: "Concurrency control", ar: "التحكم في التزامن" },
      { en: "Recovery subsystem", ar: "نظام التعافي الفرعي" },
      { en: "OLTP", ar: "معالجة المعاملات الفورية عبر الإنترنت" }
    ],
    tricks: "سؤال كلاسيكي: ما هو النظام المسؤول عن ضمان بقاء أثر المعاملات المكتملة بشكل دائم؟ الإجابة: The Recovery Subsystem. وما هو اختصار OLTP؟ Online Transaction Processing.",
    quiz: {
      question: "What does the abbreviation 'OLTP' stand for in database systems (Slide 18)?",
      options: [
        "Online Transaction Processing",
        "Optical Laser Transmission Protocol",
        "Offline Terminal Protocol",
        "Operating Logic Track Program"
      ],
      correct: 0,
      explanation: "Slide 18 clearly notes that OLTP stands for Online Transaction Processing, allowing hundreds of concurrent transactions per second."
    }
  },
  {
    num: 19,
    title: "Database Users - Overview",
    arabicTitle: "تصنيفات مستخدمي قواعد البيانات (على المسرح وخلف الكواليس)",
    image: "materials/slides/db-lec2/slide_19.png",
    coreSummary: "تقسيم مستخدمي قواعد البيانات إلى فئتين رئيسيتين: الفاعلون على المسرح (Actors on the Scene) والعاملون خلف الكواليس (Workers Behind the Scene).",
    explanationIntro: "تدخل المحاضرة هنا في تصنيف البشر المتعاملين مع أنظمة البيانات؛ فهناك من يتعامل مع محتوى وتطبيقات قاعدة البيانات مباشرة، وهناك من يبني محرك الـ DBMS والأدوات المساندة له.",
    points: [
      {
        badge: "Category 1",
        title: "الفاعلون على المسرح (Actors on the Scene)",
        desc: "الأشخاص الذين يستخدمون محتوى قاعدة البيانات ويتحكمون فيه فعلياً، ومن يصممون ويطورون ويصينون تطبيقاتها المباشرة."
      },
      {
        badge: "Category 2",
        title: "العاملون خلف الكواليس (Workers Behind the Scene)",
        desc: "الأشخاص الذين يصممون ويطورون برمجيات الـ DBMS نفسها وأدواتها، بالإضافة لمشغلي أنظمة الحواسب والسيرفرات."
      }
    ],
    keywords: [
      { en: "Database Users", ar: "مستخدمو قواعد البيانات" },
      { en: "Actors on the Scene", ar: "الفاعلون على المسرح" },
      { en: "Workers Behind the Scene", ar: "العاملون خلف الكواليس" }
    ],
    tricks: "قاعدة ذهبية للامتحان: إذا كان الشخص يتعامل مع 'بيانات التطبيق' أو 'بناء التطبيق' فهو (Actor on the scene)، أما إذا كان يبني 'محرك الـ DBMS نفسه' أو أدواته فهو (Worker behind the scene).",
    quiz: {
      question: "According to Slide 19, those who actually use and control database content or develop database applications are called:",
      options: [
        "Actors on the Scene",
        "Workers Behind the Scene",
        "Hardware Manufacturers",
        "Passive Observers"
      ],
      correct: 0,
      explanation: "Slide 19 explicitly defines those who use, control, and develop database applications as 'Actors on the Scene'."
    }
  },
  {
    num: 20,
    title: "Database Users – Actors on the Scene (DBA & Designers)",
    arabicTitle: "الفاعلون على المسرح: مدير قاعدة البيانات (DBA) ومصممو النظم",
    image: "materials/slides/db-lec2/slide_20.png",
    coreSummary: "مسؤوليات مدير قاعدة البيانات (DBA) في إدارة الصلاحيات والموارد ومراقبة الأداء، ومسؤوليات مصمم قاعدة البيانات في تحديد الهيكل والقيود.",
    explanationIntro: "تفصل الشريحة أهم وظيفتين قياديتين في بيئة قواعد البيانات؛ الـ DBA صاحب الصلاحيات والمسؤول عن التشغيل والأمان، والـ Designer المسؤول عن الهيكلة والنمذجة الرياضية.",
    points: [
      {
        badge: "DBA",
        title: "مسؤول إدارة قاعدة البيانات (Database Administrator - DBA)",
        desc: "المسؤول عن تفويض ومنح صلاحيات الوصول، تنسيق ومراقبة الاستخدام، توفير موارد العتاد والبرمجيات، والتحكم في كفاءة وسرعة العمليات."
      },
      {
        badge: "DB Designers",
        title: "مصممو قواعد البيانات (Database Designers)",
        desc: "مسؤولون عن تحديد المحتوى، الهيكل الداخلي، القيود والشروط، والمعاملات المطلوبة؛ ويجب عليهم التواصل مع المستخدمين النهائيين لفهم احتياجاتهم."
      }
    ],
    keywords: [
      { en: "Database Administrator (DBA)", ar: "مدير قاعدة البيانات" },
      { en: "Authorizing access", ar: "منح وتفويض الصلاحيات" },
      { en: "Database Designers", ar: "مصممو قواعد البيانات" },
      { en: "Constraints and Structure", ar: "القيود والهياكل" }
    ],
    tricks: "سؤال متكرر: من المسؤول عن 'Authorizing access' وتوفير موارد العتاد؟ الإجابة فوراً: الـ DBA. ومن المسؤول عن 'Define content, structure, constraints'؟ الإجابة: الـ Database Designer.",
    quiz: {
      question: "Who is responsible for authorizing access to the database, coordinating its use, and acquiring software/hardware resources?",
      options: [
        "Database Administrator (DBA)",
        "End User",
        "Operating System Tester",
        "Computer Hardware Assembler"
      ],
      correct: 0,
      explanation: "Slide 20 defines the DBA as responsible for authorizing access, coordinating and monitoring use, and acquiring resources."
    }
  },
  {
    num: 21,
    title: "Database End Users (Casual & Naïve/Parametric)",
    arabicTitle: "المستخدمون النهائيون: العرضيون والوسطاء/البارامتريون",
    image: "materials/slides/db-lec2/slide_21.png",
    coreSummary: "تصنيف المستخدمين النهائيين إلى نوعين: المستخدمون العرضيون (Casual)، والمستخدمون البارامتريون (Naïve/Parametric) أصحاب المعاملات الجاهزة (Canned Transactions).",
    explanationIntro: "تستعرض الشريحة المستخدمين الفعليين للبيانات؛ من يحتاجها نادراً عند الطلب، والشريحة الأضخم في المجتمع التي تنفذ مهام روتينية محددة يومياً كصرافي البنوك ومستخدمي الهواتف.",
    points: [
      {
        badge: "Casual Users",
        title: "المستخدمون العرضيون (Casual End Users)",
        desc: "يصلون إلى قاعدة البيانات من وقت لآخر بصورة متقطعة كلما دعت الحاجة لبيانات معينة (Occasionally when needed)."
      },
      {
        badge: "Naïve / Parametric",
        title: "المستخدمون البارامتريون (Naïve or Parametric Users)",
        desc: "يمثلون الشريحة الأكبر من مستخدمي قواعد البيانات في العالم؛ يستخدمون وظائف محددة ومبرمجة مسبقاً تُعرف بالمعاملات الجاهزة (Canned transactions)."
      },
      {
        badge: "Examples",
        title: "أمثلة على الـ Parametric Users",
        desc: "صرافو البنوك (Bank tellers)، موظفو حجز تذاكر الطيران، مستخدمو تطبيقات الهواتف الذكية (Mobile Apps)، ومستخدمو وسائل التواصل الاجتماعي."
      }
    ],
    keywords: [
      { en: "Casual Users", ar: "مستخدمون عرضيون" },
      { en: "Naïve / Parametric Users", ar: "مستخدمون بارامتريون / سذج" },
      { en: "Canned transactions", ar: "معاملات مبرمجة جاهزة" },
      { en: "Bank tellers", ar: "صرافو البنوك" }
    ],
    tricks: "مصطلح 'Canned Transactions' علامة مميزة دائماً لـ 'Naïve or Parametric Users'؛ هم لا يكتبون استعلامات ولا يعرفون شيئاً عن SQL، بل ينفذون شاشات معدة مسبقاً بإدخال معطيات محددة فقط.",
    quiz: {
      question: "Bank tellers and mobile app users who perform predefined 'canned transactions' fall under which category of end-users?",
      options: [
        "Naïve or Parametric users",
        "Database Administrators",
        "DBMS Kernel Implementors",
        "Hardware Circuit Designers"
      ],
      correct: 0,
      explanation: "Slide 21 states that Naïve or Parametric users make up a large section of the population and use 'canned transactions' (e.g., bank tellers, mobile app users)."
    }
  },
  {
    num: 22,
    title: "Database End Users (cont.) - Sophisticated & Stand-alone",
    arabicTitle: "المستخدمون النهائيون: المتطورون والمستقلون (Sophisticated & Stand-alone)",
    image: "materials/slides/db-lec2/slide_22.png",
    coreSummary: "المستخدمون المتطورون (العلماء والمهندسون والمحللون) وقدراتهم المتقدمة، والمستخدمون المستقلون الذين يديرون قواعد بيانات شخصية بحزم جاهزة.",
    explanationIntro: "تكمل الشريحة تصنيفات المستخدمين النهائيين بالحديث عن الخبراء الذين يستغلون كامل قدرات النظام البرمجية والتحليلية، والمستخدمين العاديين الذين يمتلكون برامج شخصية محلية كبرامج الضرائب والصور.",
    points: [
      {
        badge: "Sophisticated",
        title: "المستخدمون المتطورون (Sophisticated End Users)",
        desc: "يشملون محللي الأعمال، العلماء، والمهندسين؛ على دراية وخبرة عميقة بكامل إمكانيات النظام، ويستخدمون حزم برمجية متقدمة تتفاعل مباشرة مع قاعدة البيانات."
      },
      {
        badge: "Stand-alone",
        title: "المستخدمون المستقلون (Stand-alone Users)",
        desc: "يديرون قواعد بيانات شخصية خاصة بهم باستخدام تطبيقات وحزم برمجية جاهزة للاستخدام (Ready-to-use packaged applications)."
      },
      {
        badge: "Examples",
        title: "أمثلة على الـ Stand-alone Users",
        desc: "مستخدم برنامج إعداد الإقرارات الضريبية (Tax program) الذي ينشئ قاعدة بياناته الداخلية، أو شخص يدير قاعدة بيانات لملفات وصور وفيديوهات عائلته الشخصية."
      }
    ],
    keywords: [
      { en: "Sophisticated Users", ar: "مستخدمون متطورون / محترفون" },
      { en: "Business Analysts & Scientists", ar: "محللو الأعمال والعلماء" },
      { en: "Stand-alone Users", ar: "مستخدمون مستقلون" },
      { en: "Personal databases", ar: "قواعد بيانات شخصية" }
    ],
    tricks: "إذا ذكر في السؤال محلل أعمال أو عالم يستخدم حزم برمجية لتحليل البيانات فهو (Sophisticated User)؛ أما إذا ذكر مستخدم برنامج ضرائب أو صور شخصية فهو (Stand-alone User).",
    quiz: {
      question: "A user who maintains a personal database of family photos using a ready-to-use software package is classified as a:",
      options: [
        "Stand-alone user",
        "Database Administrator (DBA)",
        "System Implementor",
        "Parametric Bank Teller"
      ],
      correct: 0,
      explanation: "Slide 22 gives the example of a user maintaining a database of personal photos/videos as a 'Stand-alone user'."
    }
  },
  {
    num: 23,
    title: "Database Users – Actors on the Scene (cont.) - Analysts & Programmers",
    arabicTitle: "الفاعلون على المسرح: محللو النظم، المبرمجون، ومحللو الأعمال",
    image: "materials/slides/db-lec2/slide_23.png",
    coreSummary: "أدوار محللي النظم في فهم الاحتياجات، مبرمجي التطبيقات في كتابة الأكواد واختبارها، ومحللي الأعمال في استنتاج الرؤى من البيانات الضخمة (Big Data).",
    explanationIntro: "تستعرض هذه الشريحة الفئات الهندسية والبرمجية المسؤولة عن بناء التطبيقات في سوق العمل؛ وهم يمثلون الشريحة الأكبر من القوى العاملة في مجال تكنولوجيا المعلومات (IT).",
    points: [
      {
        badge: "System Analysts",
        title: "محللو النظم (System Analysts)",
        desc: "يفهمون متطلبات المستخدمين (البارامتريين والمتطورين) ويصممون مواصفات التطبيقات والمعاملات الجاهزة (Canned transactions) لتلبية تلك الاحتياجات."
      },
      {
        badge: "Programmers",
        title: "مبرمجو التطبيقات (Application Programmers)",
        desc: "ينفذون ويكتبون البرامج بناءً على المواصفات التي وضعها محللو النظم، ويقومون باختبارها وتصحيح أخطائها (Test & Debug) قبل نشرها للمستخدمين."
      },
      {
        badge: "Business Analysts",
        title: "محللو الأعمال (Business Analysts)",
        desc: "فئة متزايدة الأهمية لتحليل كميات البيانات الضخمة (Big Data) والبيانات اللحظية للمساعدة في اتخاذ قرارات أفضل في التخطيط والإعلانات والتسويق."
      }
    ],
    keywords: [
      { en: "System Analysts", ar: "محللو النظم" },
      { en: "Application Programmers", ar: "مبرمجو التطبيقات" },
      { en: "Business Analysts", ar: "محللو الأعمال" },
      { en: "Big Data decision making", ar: "اتخاذ القرار بناءً على البيانات الضخمة" }
    ],
    tricks: "المحلل (System Analyst) يضع المواصفات والتصميم، بينما المبرمج (Application Programmer) يكتب الكود البرمجي ويختبره؛ ومحلل الأعمال (Business Analyst) يستخرج الرؤى من البيانات الضخمة.",
    quiz: {
      question: "Who is responsible for implementing specifications developed by analysts, testing, and debugging them before deployment?",
      options: [
        "Application Programmers",
        "Stand-alone end users",
        "Hardware circuit technicians",
        "Security guards"
      ],
      correct: 0,
      explanation: "Slide 23 states that Application Programmers 'Implement the specifications developed by analysts and test and debug them before deployment.'"
    }
  },
  {
    num: 24,
    title: "Database Users – Actors behind the Scene",
    arabicTitle: "الفاعلون خلف الكواليس: مصممو الـ DBMS، مطورو الأدوات، ومشغلو النظم",
    image: "materials/slides/db-lec2/slide_24.png",
    coreSummary: "العاملون خلف الكواليس الذين لا يتعاملون مع البيانات مباشرة: مصممو حزم الـ DBMS، مطورو أدوات النمذجة والمراقبة، وفريق التشغيل والصيانة.",
    explanationIntro: "تختتم الشريحة تصنيفات المستخدمين بالتركيز على 'العاملين خلف الكواليس'؛ وهم المهندسون الذين يصنعون محرك قواعد البيانات والبرمجيات المساعدة التي تمكن باقي المطورين من العمل.",
    points: [
      {
        badge: "DBMS Designers",
        title: "مصممو ومنفذو حزم الـ DBMS (System Designers & Implementors)",
        desc: "يصممون وينفذون برمجيات الـ DBMS ووحداتها وواجهاتها، ويجرون اختباراتها لترتبط بنجاح مع لغات البرمجة وأنظمة التشغيل."
      },
      {
        badge: "Tool Developers",
        title: "مطورو الأدوات (Tool Developers)",
        desc: "يصممون ويطورون برمجيات مساندة (Tools) لنمذجة وتصميم قواعد البيانات، ومراقبة الأداء، وتوليد بيانات الاختبار، وبناء الواجهات والمحاكاة."
      },
      {
        badge: "Operators",
        title: "مشغلو النظم وفنيو الصيانة (Operators & Maintenance)",
        desc: "مسؤولون عن التشغيل الفعلي والمستمر وصيانة بيئة العتاد والبرمجيات الخاصة بخوادم قواعد البيانات."
      }
    ],
    keywords: [
      { en: "Actors behind the Scene", ar: "الفاعلون خلف الكواليس" },
      { en: "System Designers and Implementors", ar: "مصممو ومنفذو النظم" },
      { en: "Tool Developers", ar: "مطورو الأدوات المساندة" },
      { en: "Operators and Maintenance Personnel", ar: "مسؤولو التشغيل والصيانة" }
    ],
    tricks: "انتبه: مطور أدوات مراقبة الأداء (Tool Developer) ومبرمج محرك الـ DBMS هما 'Behind the Scene'؛ بينما مبرمج التطبيق الخاص بالجامعة أو البنك هو 'On the Scene'.",
    quiz: {
      question: "Which group of 'Actors behind the Scene' develops software tools for performance monitoring, database modeling, and prototyping?",
      options: [
        "Tool Developers",
        "Casual End Users",
        "System Analysts",
        "Bank Tellers"
      ],
      correct: 0,
      explanation: "Slide 24 defines Tool Developers as those who design and implement software tools for modeling, performance monitoring, prototyping, etc."
    }
  },
  {
    num: 25,
    title: "Advantages of Using the Database Approach",
    arabicTitle: "مزايا مدخل قواعد البيانات: التحكم في تكرار البيانات وتقييد الوصول",
    image: "materials/slides/db-lec2/slide_25.png",
    coreSummary: "الميزة الأولى: التحكم في التكرار وتطبيع البيانات (Normalization) لضمان اتساقها، والميزة الثانية: تقييد الوصول وحظر غير المصرح لهم.",
    explanationIntro: "تبدأ المحاضرة في استعراض المزايا التنافسية الكبرى لنظم قواعد البيانات؛ ولعل أهمها التخلص من كارثة تكرار البيانات وتناقضها التي كانت تحدث في الملفات التقليدية.",
    points: [
      {
        badge: "Redundancy Control",
        title: "التحكم في تكرار البيانات (Controlling Redundancy)",
        desc: "تخزين كل معلومة منطقية (مثل اسم الطالب أو تاريخ ميلاده) في مكان واحد فقط داخل قاعدة البيانات، مما يوفر المساحة ويمنع تضارب البيانات."
      },
      {
        badge: "Normalization",
        title: "تطبيع البيانات (Data Normalization)",
        desc: "الأسلوب العلمي المتبع لتنظيم الجداول ومنع التكرار، وهو ما يضمن اتساق البيانات (Consistency) وتوفير سعة التخزين."
      },
      {
        badge: "Access Restriction",
        title: "تقييد الوصول غير المصرح به (Restricting Unauthorized Access)",
        desc: "حماية البيانات بصلاحيات مشددة بحيث لا يستطيع أحد استخدام الأوامر الحساسة أو التعديل إلا فريق الـ DBA المخول رسمياً."
      }
    ],
    keywords: [
      { en: "Controlling redundancy", ar: "التحكم في التكرار" },
      { en: "Data normalization", ar: "تطبيع وتنظيم البيانات" },
      { en: "Data consistency", ar: "اتساق وتطابق البيانات" },
      { en: "Restricting unauthorized access", ar: "تقييد الوصول غير المصرح به" }
    ],
    tricks: "مصطلح Data Normalization يعني علمياً: تخزين كل معلومة منطقية في مكان واحد فقط لضمان الـ Consistency؛ تكرار البيانات في أنظمة الملفات القديمة كان يؤدي لـ Inconsistency عند تعديل ملف وإهمال الآخر.",
    quiz: {
      question: "Storing each logical data item in only one place in the database to ensure consistency and save storage space is known as:",
      options: [
        "Data normalization",
        "Data encryption scrambling",
        "Screen buffer swapping",
        "Instruction pipelining"
      ],
      correct: 0,
      explanation: "Slide 25 states: 'each logical data item... is stored in only one place in the database. This is known as data normalization, and it ensures consistency and saves storage space.'"
    }
  },
  {
    num: 26,
    title: "Advantages of Using the Database Approach (cont.)",
    arabicTitle: "مزايا مدخل قواعد البيانات: التخزين المستمر، تحسين الاستعلامات، والنسخ الاحتياطي",
    image: "materials/slides/db-lec2/slide_26.png",
    coreSummary: "توفير التخزين المستمر للكائنات، تقنيات البحث والفهارس لتحسين الاستعلامات بكفاءة، خدمات النسخ الاحتياطي والتعافي، وتعدد الواجهات.",
    explanationIntro: "تواصل الشريحة استعراض مزايا قواعد البيانات التقنية؛ من تسريع عمليات البحث بواسطة الفهارس، إلى الحفاظ على كائنات البرمجة دائمية، وضمان عدم ضياع أي بيان بالنسخ الاحتياطي.",
    points: [
      {
        badge: "Persistent Storage",
        title: "التخزين المستمر لكائنات البرامج (Persistent Storage)",
        desc: "مثل قواعد البيانات كائنية التوجه (Object-oriented DBMSs) التي تجعل كائنات لغات البرمجة محفوظة بشكل دائم حتى بعد إغلاق التطبيق."
      },
      {
        badge: "Query Optimization",
        title: "معالجة وتحسين الاستعلامات (Efficient Query Processing)",
        desc: "توفير هياكل تخزين وفهارس (Indexes) ومُحسِّن استعلامات يختار أفضل خطة تنفيذية (Execution Plan) لتسريع جلب النتائج."
      },
      {
        badge: "Backup & Recovery",
        title: "خدمات النسخ الاحتياطي والتعافي",
        desc: "توفير آليات آلية لعمل نسخ احتياطية واستعادة البيانات دون فقدان في حال حدوث أي عطل بالنظام."
      },
      {
        badge: "Multiple Interfaces",
        title: "توفير واجهات استخدام متعددة (Multiple User Interfaces)",
        desc: "تقديم واجهات متنوعة تناسب مختلف المستخدمين (واجهات رسومية GUI للمبتدئين، وواجهات أوامر Command line للمحترفين)."
      }
    ],
    keywords: [
      { en: "Persistent storage", ar: "تخزين دائم ومستمر" },
      { en: "Query processing & optimization", ar: "معالجة وتحسين الاستعلامات" },
      { en: "Indexes", ar: "الفهارس" },
      { en: "Backup and recovery services", ar: "خدمات النسخ الاحتياطي والتعافي" },
      { en: "Multiple user interfaces", ar: "واجهات مستخدم متعددة" }
    ],
    tricks: "المكون المسؤول عن اختيار أفضل مسار لتنفيذ الاستعلام بناءً على الفهارس الموجودة يسمى 'The query processing and optimization module'.",
    quiz: {
      question: "Which DBMS module is responsible for choosing an efficient execution plan for each query based on existing storage structures (like indexes)?",
      options: [
        "The query processing and optimization module",
        "The sound card audio driver",
        "The mechanical cooling fan controller",
        "The keyboard interrupt handler"
      ],
      correct: 0,
      explanation: "Slide 26 mentions: 'The query processing and optimization module of the DBMS is responsible for choosing an efficient query execution plan for each query based on the existing storage structures (e.g. indexes).'"
    }
  },
  {
    num: 27,
    title: "Advantages of Using the Database Approach (cont.)",
    arabicTitle: "مزايا مدخل قواعد البيانات: العلاقات المعقدة، قيود التكامل، والمشغلات (Triggers)",
    image: "materials/slides/db-lec2/slide_27.png",
    coreSummary: "تمثيل العلاقات المعقدة بين البيانات، فرض قيود التكامل (Integrity Constraints)، واستخدام القواعد الإجرائية والمشغلات (Triggers).",
    explanationIntro: "تبرز هذه الشريحة ذكاء نظام قواعد البيانات؛ فهو ليس مجرد مستودع أرقام، بل كيان يفرض قيوداً صارمة لمنع الأخطاء وينفذ استنتاجات وإجراءات تلقائية عند حدوث أحداث معينة.",
    points: [
      {
        badge: "Complex Relations",
        title: "تمثيل العلاقات المعقدة (Representing Complex Relationships)",
        desc: "القدرة على نمذجة علاقات متعددة ومتشابكة بين البيانات بسهولة وبشكل منظم ومترابط."
      },
      {
        badge: "Integrity Constraints",
        title: "فرض قيود التكامل (Enforcing Integrity Constraints)",
        desc: "التحقق التلقائي من سلامة البيانات وصحتها (مثل أن تكون أرقام الطلاب فريدة ولا تتكرر، وألا تقل الدرجة عن الصفر) ورفض أي إدخال خاطئ."
      },
      {
        badge: "Rules & Triggers",
        title: "القواعد الاستنتاجية والمشغلات (Deductive Rules & Triggers)",
        desc: "استخلاص إجراءات واستنتاجات تلقائية من البيانات المخزنة باستخدام القواعد والمشغلات الفعالة (Active rules and triggers) عند وقوع أحداث معينة."
      }
    ],
    keywords: [
      { en: "Complex relationships", ar: "علاقات معقدة" },
      { en: "Integrity constraints", ar: "قيود التكامل وسلامة البيانات" },
      { en: "Deductive rules", ar: "قواعد استنتاجية" },
      { en: "Triggers", ar: "المشغلات التلقائية" }
    ],
    tricks: "قيود التكامل (Integrity Constraints) تُطبق مركزياً بواسطة الـ DBMS؛ وهذا يعني أنه مهما كتب المبرمج في برنامجه، لن يقبل الـ DBMS أي بيان يخالف القيود الموضوعة مسبقاً في الكتالوج.",
    quiz: {
      question: "According to Slide 27, what can be used to draw inferences and automated actions from stored data in a database?",
      options: [
        "Deductive and active rules and triggers",
        "Manual calculations on desktop paper",
        "Power line voltage fluctuations",
        "Operating system shut-down signals"
      ],
      correct: 0,
      explanation: "Slide 27 states: 'Drawing inferences and actions from the stored data using deductive and active rules and triggers.'"
    }
  },
  {
    num: 28,
    title: "Additional Implications of Using the Database Approach",
    arabicTitle: "تداعيات إضافية: فرض المعايير القياسية وتقليص زمن تطوير التطبيقات",
    image: "materials/slides/db-lec2/slide_28.png",
    coreSummary: "فرض المعايير القياسية في المؤسسات الكبرى (لتوحيد التسميات والشاشات والتقارير) وتقليص الزمن الإضافي المطلوب لتطوير وبناء تطبيقات جديدة.",
    explanationIntro: "تتناول الشريحة التأثير الإداري والمؤسسي لمدخل قواعد البيانات؛ حيث يؤدي لتوحيد بيئة العمل ويسرع بشدة من وتيرة بناء الأنظمة الجديدة بفضل وجود بنية بيانات مركزية جاهزة.",
    points: [
      {
        badge: "Enforcing Standards",
        title: "فرض المعايير القياسية (Potential for Enforcing Standards)",
        desc: "أمر حيوي جداً لنجاح المشروعات في المؤسسات والشركات الكبرى؛ وتشمل المعايير: توحيد أسماء عناصر البيانات، صيغ العرض، الشاشات، هياكل التقارير، والبيانات الوصفية (Meta-data)."
      },
      {
        badge: "Reduced Dev Time",
        title: "تقليص زمن تطوير التطبيقات (Reduced Application Development Time)",
        desc: "بمجرد تصميم وإنشاء قاعدة البيانات الرئيسية، يصبح الوقت الإضافي المطلوب لإنشاء أي تطبيق أو شاشة جديدة قصيراً جداً لأن البيانات وبنيتها جاهزة ومفهرسة."
      }
    ],
    keywords: [
      { en: "Enforcing standards", ar: "فرض المعايير القياسية" },
      { en: "Display formats & reports", ar: "صيغ العرض والتقارير" },
      { en: "Reduced development time", ar: "تقليص وقت التطوير" },
      { en: "Incremental time", ar: "الوقت الإضافي المتدرج" }
    ],
    tricks: "المعايير القياسية (Standards) تمنع المشاكل الناتجة عن تسمية الحقل نفسه بأسماء مختلفة بين الأقسام (مثل تكرار حقل رقم الهاتف كـ Tel و Phone)؛ قاعدة البيانات المركزية تفرض اسماً واحداً ومعياراً موحداً للجميع.",
    quiz: {
      question: "Why is the potential for enforcing standards crucial for database applications in large organizations?",
      options: [
        "It standardizes data item names, display formats, screens, and report structures across departments",
        "It forces all employees to purchase the exact same brand of laptop",
        "It prevents all computers from connecting to the internet",
        "It reduces monitor screen refresh rates to save electricity"
      ],
      correct: 0,
      explanation: "Slide 28 explains that standards refer to data item names, display formats, screens, report structures, meta-data, etc., ensuring harmony in large organizations."
    }
  },
  {
    num: 29,
    title: "Additional Implications (cont.) - Flexibility, Current Info & Economies of Scale",
    arabicTitle: "تداعيات إضافية: المرونة، توفر المعلومات اللحظية، والجدوى الاقتصادية",
    image: "materials/slides/db-lec2/slide_29.png",
    coreSummary: "المرونة العالية في تعديل هياكل البيانات مع تطور المتطلبات، توفر معلومات حية ولحظية للأنظمة الفورية (كالتسوق وحجز الطيران)، وتحقيق الجدوى الاقتصادية (Economies of Scale).",
    explanationIntro: "توضح الشريحة المكاسب الاستراتيجية والاقتصادية للمؤسسات؛ فالنظام مرن للتوسع، والمعلومات محدثة في لحظتها لدعم الحجوزات، والموارد مدمجة دون هدر أو تكرار في التكاليف والموظفين.",
    points: [
      {
        badge: "Flexibility",
        title: "المرونة في تغيير هياكل البيانات (Flexibility to Change Structures)",
        desc: "بنية قاعدة البيانات قادرة على التطور والتكيف والتعديل مع ظهور متطلبات واحتياجات جديدة للمؤسسة."
      },
      {
        badge: "Current Info",
        title: "توفر معلومات لحظية ومحدثة (Availability of Current Information)",
        desc: "أمر بالغ الأهمية لأنظمة المعاملات الفورية المباشرة (On-line Transaction Systems) مثل مواقع التسوق الإلكتروني، حجوزات الطيران، والفنادق والسيارات."
      },
      {
        badge: "Economies of Scale",
        title: "الجدوى واقتصاديات الحجم (Economies of Scale)",
        desc: "تجنب الإهدار والتكرار العقيم في الموارد والأجهزة والموظفين عبر دمج وتوحيد البيانات والتطبيقات عبر كافة أقسام المؤسسة في نظام مركزي واحد."
      }
    ],
    keywords: [
      { en: "Flexibility to change data structures", ar: "مرونة تعديل هياكل البيانات" },
      { en: "Current information availability", ar: "توفر معلومات محدثة ولحظية" },
      { en: "Online transaction systems", ar: "أنظمة المعاملات عبر الإنترنت" },
      { en: "Economies of scale", ar: "اقتصاديات الحجم والجدوى الاقتصادية" }
    ],
    tricks: "مصطلح 'Economies of scale' يعني: بدلاً من أن يشتري كل قسم سيرفراته وبرامجه وموظفيه بشكل مستقل ومهدر، دمج كل شيء في قاعدة بيانات مركزية يوفر التكاليف والمجهود بدرجة هائلة.",
    quiz: {
      question: "Which implication describes avoiding wasteful overlap of resources and personnel by consolidating data and applications across departments?",
      options: [
        "Economies of scale",
        "Screen resolution distortion",
        "Thermal CPU throttling",
        "Random memory fragmentation"
      ],
      correct: 0,
      explanation: "Slide 29 explicitly defines 'Economies of scale' as avoiding wasteful overlap of resources and personnel by consolidating data and applications across departments."
    }
  },
  {
    num: 30,
    title: "Lecture Summary",
    arabicTitle: "الملخص الشامل للمحاضرة ومراجعة المحاور العشرة",
    image: "materials/slides/db-lec2/slide_30.png",
    coreSummary: "مراجعة شاملة لجميع الموضوعات العشرة التي تم تغطيتها في المحاضرة، من التطبيقات والتعريفات وحتى المعمارية والمستخدمين والمزايا.",
    explanationIntro: "نصل هنا إلى شريحة الختام والتلخيص؛ تجمع الشريحة الخريطة المعرفية الكاملة لما تم شرحه طوال المحاضرة لتثبيت المفاهيم الأساسية قبل بدء الفصل القادم.",
    points: [
      {
        badge: "Summary 1-3",
        title: "المفاهيم والتطبيقات والوظائف",
        desc: "استعرضنا أنواع قواعد البيانات (التقليدية والحديثة)، التعريفات الأساسية (Data, Database, Mini-world, DBMS, DB System)، ووظائف الـ DBMS لحماية وإدارة وتطوير البيانات."
      },
      {
        badge: "Summary 4-6",
        title: "النموذج والخصائص والمستخدمون",
        desc: "فهمنا نموذج جامعة UNIVERSITY والـ Conceptual ER Model، وخصائص الـ Database Approach (الوصف الذاتي، استقلالية البيانات والعمليات، التجريد، التزامن و OLTP)، وصنفنا المستخدمين على المسرح وخلف الكواليس."
      },
      {
        badge: "Summary 7-10",
        title: "المزايا والتطور وتوسيع النظم",
        desc: "أبرزنا مزايا التطبيع (Normalization)، منع التكرار، تقييد الصلاحيات، الفهارس، التخزين المستمر، فرض المعايير، والجدوى الاقتصادية للمؤسسات."
      }
    ],
    keywords: [
      { en: "Lecture Summary", ar: "ملخص المحاضرة" },
      { en: "Database Approach", ar: "مدخل قواعد البيانات" },
      { en: "Data Normalization", ar: "تطبيع وتنظيم البيانات" },
      { en: "Database Users Classification", ar: "تصنيف مستخدمي قواعد البيانات" },
      { en: "OLTP & Concurrency", ar: "معالجة المعاملات الفورية والتزامن" }
    ],
    tricks: "شريحة التلخيص تكرر الـ 10 محاور المذكورة في شريحة الـ Outline؛ تأكد أنك تستطيع كتابة تعريف كل مصطلح إنجليزي ورد في هذه المحاضرة بدقة لأنها حجر الأساس لكل الميدتيرم والفاينل.",
    quiz: {
      question: "Which of the following is considered a core advantage of using the database approach discussed throughout this lecture?",
      options: [
        "Controlling data redundancy through normalization and ensuring data consistency",
        "Disabling all computer networks to save electrical power",
        "Storing data exclusively in temporary RAM memory that vanishes on power off",
        "Requiring each employee to reinvent their own file format independently"
      ],
      correct: 0,
      explanation: "A cornerstone advantage of the database approach highlighted in the lecture summary is controlling redundancy through normalization and ensuring consistency."
    }
  }
];

const fileContent = `/**
 * ==============================================================================
 * ملف بيانات الشرح التفاعلي الذكي للمحاضرات (Smart Lecture Walkthrough Data)
 * ==============================================================================
 * يحتوي على تفكيك كامل لكل شريحة من شرائح المحاضرة:
 * - صورة السلايد الأصلية بدقة عالية
 * - الشرح المبسط والمنظم بعيداً عن الكلمات المبتذلة
 * - تفكيك المفاهيم المتعددة في بطاقات منفصلة وواضحة (Points breakdown)
 * - الكلمات المفتاحية والمصطلحات الأكاديمية (Keywords)
 * - تريكات وفخاخ الامتحان بتباين وألوان واضحة في كافة الأنماط (Exam Tricks)
 * - كويز تفاعلي فوري باللغة الإنجليزية كما يرد في امتحانات الكلية (English MCQ Quiz)
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
      slides: ${JSON.stringify(slidesData, null, 2)}
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
console.log('Successfully wrote exact 30 slides to js/lecture-explanations-data.js');
