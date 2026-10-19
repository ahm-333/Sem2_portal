/**
 * tools/build_lecture3_data.js
 * Builds the complete Smart Walkthrough for Database Systems Lecture 3
 * Chapter 2: Database System Concepts and Architecture (Dr. Mohamed Maher)
 */

const fs = require('fs');
const path = require('path');

const lecture3Data = {
  courseId: "database-systems",
  lectureId: 3,
  courseName: "Database Systems (IS211)",
  lectureTitle: "Lecture 3: Database System Concepts and Architecture",
  lectureArabicTitle: "معمارية نظم قواعد البيانات، نماذج البيانات، ومستويات Schema الثلاثة (د. محمد ماهر)",
  totalSlides: 32,
  slides: [
    {
      num: 1,
      title: "Lecture 3 Ch 2: Database System Concepts and Architecture",
      arabicTitle: "غلاف المحاضرة 3 - معمارية ومفاهيم نظم قواعد البيانات (د. محمد ماهر)",
      image: "materials/slides/db-lec3/slide_1.png",
      coreSummary: "المحاضرة دي بتشرح Chapter 2 من كتاب Elmasri & Navathe وبتغطي معمارية الـ DBMS ونماذج البيانات ومستويات الـ Schemas الثلاثة.",
      explanationIntro: "أهلاً بيك يا بطل في المحاضرة التالتة من مادة قواعد البيانات مع الدكتور محمد ماهر؛ المحاضرة دي بتنقلنا من مجرد تعريفات عامة إلى العمق الحقيقي لمعمارية قواعد البيانات: إزاي الـ DBMS بيصمم من جوة، وإيه هي نماذج البيانات (Data Models)، وليه بنفصل شكل السكيما عن مكان تخزينها الفعلي على الهارد ديسك.",
      points: [
        {
          badge: "الفصل والموضوع",
          title: "Chapter 2: Concepts and Architecture",
          desc: "الفصل التاني في المنهج المعتمد بيركز على الهيكل المعماري لنظم قواعد البيانات وفصل طبقات التجريد."
        },
        {
          badge: "المحاضر",
          title: "د. محمد ماهر (Dr. Mohamed Maher)",
          desc: "أستاذ المادة بقسم نظم المعلومات، ومحاضراته وسلايداته موحدة لجميع مجموعات الدفعة."
        },
        {
          badge: "خريطة المحاضرة",
          title: "المحاور الـ 4 الأساسية",
          desc: "هنتعرف على: نماذج البيانات (Data Models)، الـ Schemas والـ Instances، معمارية المستويات الثلاثة (Three-Schema Architecture)، ومعمارية الخادم والعميل (Client/Server Architectures)."
        }
      ],
      realLifeExample: {
        title: "مهندس المعمارية ضد البنّاء",
        desc: "فكر في الـ DBMS زي عمارة سكنية فخمة: في مهندس معماري بيرسم المخطط، وفي سباك وكهربائي بينفذوا المواسير تحت الأرض، وفي ساكن بيستخدم الشقة بدون ما يشوف المواسير دي. المحاضرة دي بتعلمك دور كل مستوى في قاعدة البيانات."
      },
      triggers: [
        { trigger: "Chapter 2 in Elmasri & Navathe", choose: "Database System Concepts and Architecture" },
        { trigger: "Separation of user applications from physical storage", choose: "Three-Schema Architecture" }
      ],
      keywords: [
        { en: "Data Models", ar: "نماذج البيانات" },
        { en: "Schemas and Instances", ar: "المخططات والحالات" },
        { en: "Three-Schema Architecture", ar: "معمارية المستويات الثلاثة" },
        { en: "Client/Server Architecture", ar: "معمارية العميل والخادم" }
      ],
      tricks: "المحاضرة اسمها Lecture 3 في الترتيب الزمني لكنها بتشرح Chapter 2 في الكتاب المعتمد؛ خلي بالك متتلخبطش بين رقم المحاضرة ورقم الشابتر!",
      quiz: {
        question: "What is the primary focus of Chapter 2 in Database Systems?",
        options: [
          "SQL complex query optimization techniques",
          "Database system concepts, data models, and system architecture",
          "Hardware manufacturing for disk drives",
          "Advanced network routing protocols"
        ],
        correct: 1,
        explanation: "الشابتر بيركز على المفاهيم الأساسية، تصنيفات نماذج البيانات، ومعمارية نظام الـ DBMS وفصل مستويات التجريد."
      }
    },
    {
      num: 2,
      title: "Chapter 2 Outline",
      arabicTitle: "المحاور الرئيسية للفصل الثاني (Course Outline)",
      image: "materials/slides/db-lec3/slide_2.png",
      coreSummary: "جدول موضوعات المحاضرة: نماذج البيانات، معمارية المستويات الثلاثة، لغات الـ DBMS، ومعماريات الخادم والعميل.",
      explanationIntro: "السلايد دي بتلخص خريطة الطريق اللي هنمشي عليها خلال المحاضرة. الموضوعات مترتبة منطقياً: بنبدأ بكيفية تمثيل البيانات نظرياً، ثم إزاي بنهيكل النظام في 3 طبقات، ثم اللغات المستخدمة، وأخيراً التوزيع الفيزيائي على الشبكة.",
      points: [
        {
          badge: "المحور الأول",
          title: "Data Models, Schemas, and Instances",
          desc: "دراسة مفهوم الـ Data Abstraction وفئات نماذج البيانات والفرق الجوهري بين السكيما وحالة الداتابيز."
        },
        {
          badge: "المحور الثاني",
          title: "Three-Schema Architecture & Data Independence",
          desc: "معمارية المستويات الثلاثة (External, Conceptual, Internal) واستقلالية البيانات بنوعيها المنطقي والفيزيائي."
        },
        {
          badge: "المحور الثالث",
          title: "DBMS Languages & Architectures",
          desc: "لغات الـ DBMS (DDL, SDL, VDL, DML) ومعماريات الأنظمة من Centralized إلى 2-Tier و 3-Tier."
        }
      ],
      triggers: [
        { trigger: "Components of Chapter 2 outline", choose: "Data Models, Three-Schema Architecture, Languages, Architectures" }
      ],
      keywords: [
        { en: "Outline", ar: "محاور الفصل" },
        { en: "Data Independence", ar: "استقلالية البيانات" },
        { en: "DBMS Languages", ar: "لغات إدارة قواعد البيانات" }
      ],
      tricks: "الترتيب ده بيخدم الامتحان: الدكتور بيجيب أسئلة مقارنات مباشرة بين محاور السلايد دي، زي الفرق بين Schema و State أو الفرق بين Logical و Physical Data Independence.",
      quiz: {
        question: "Which of the following topics is explicitly covered in the Chapter 2 outline?",
        options: [
          "Distributed Blockchain Consensus",
          "Three-Schema Architecture and Data Independence",
          "Operating System Kernel Compilers",
          "Microprocessor Pipelining Hazards"
        ],
        correct: 1,
        explanation: "معمارية المستويات الثلاثة (Three-Schema Architecture) واستقلالية البيانات هي المحور الرئيسي التاني في الشابتر."
      }
    },
    {
      num: 3,
      title: "Data Models, Schemas, and Instances - Data Abstraction",
      arabicTitle: "تجريد البيانات وإخفاء التعقيدات التخزينية (Data Abstraction)",
      image: "materials/slides/db-lec3/slide_3.png",
      coreSummary: "الـ Data Abstraction يعني إخفاء تفاصيل التخزين والترتيب الداخلي وإبراز الخصائص الجوهرية فقط للمستخدم.",
      explanationIntro: "هنا بندخل في واحد من أهم مفاهيم علوم الحاسب: 'تجريد البيانات' (Data Abstraction). تخيل لو كل مبرمج أو مستخدم علشان يسجل بيانات طالب لازم يعرف السيكتور الفلاني على الهارد ديسك نوعه إيه وحجم البلوك كام بايت! الـ Abstraction جه علشان يريحك من الصداع ده ويخفي كل التفاصيل التخزينية المجهدة ويظهرلك بس الجوهر.",
      points: [
        {
          badge: "التعريف الرسمي",
          title: "Suppression of Details",
          desc: "إخفاء وحجب تفاصيل تنظيم وتخزين البيانات على وسائط التخزين الفيزيائية (Disks)."
        },
        {
          badge: "الهدف والنتيجة",
          title: "Highlighting Essential Features",
          desc: "إبراز الملامح والخصائص الأساسية للبيانات لتحسين فهمها والتعامل معها بسهولة بدون تعقيدات."
        }
      ],
      realLifeExample: {
        title: "قيادة السيارة والـ Dashboard",
        desc: "أنت بتسوق العربية بإنك تضغط على بدال البنزين والفرامل وتبص على عداد السرعة (Essential features)؛ مش محتاج تعرف إزاي الصمامات بتفتح أو الوقود بيتحقن داخل المحرك (Suppression of details)."
      },
      triggers: [
        { trigger: "Suppression of details of data organization and storage", choose: "Data Abstraction" },
        { trigger: "Highlighting essential features for improved understanding", choose: "Data Abstraction" }
      ],
      keywords: [
        { en: "Data Abstraction", ar: "تجريد البيانات" },
        { en: "Suppression of details", ar: "إخفاء التفاصيل التخزينية" },
        { en: "Essential features", ar: "الخصائص الجوهرية" }
      ],
      tricks: "لو جالك في الامتحان: 'Suppression of details' ده تعريف Data Abstraction مباشرة، ومبيخصش نظام الملفات العادي (File System) لأن الـ DBMS هو اللي بيوفر التجريد ده.",
      quiz: {
        question: "What is the primary characteristic of 'Data Abstraction'?",
        options: [
          "Displaying binary machine code directly to end users",
          "Suppression of details of data storage and highlighting essential features",
          "Duplicating data files across multiple hard drives for redundancy",
          "Encrypting all table columns with asymmetric algorithms"
        ],
        correct: 1,
        explanation: "تجريد البيانات (Data Abstraction) هو إخفاء تفاصيل التنظيم والتخزين الفيزيائي وإبراز الملامح الجوهرية فقط للمستخدم."
      }
    },
    {
      num: 4,
      title: "Data Models, Schemas, and Instances - Data Model & Basic Operations",
      arabicTitle: "مفهوم نموذج البيانات والعمليات الأساسية (Data Model & Operations)",
      image: "materials/slides/db-lec3/slide_4.png",
      coreSummary: "نموذج البيانات (Data Model) هو مجموعة مفاهيم لوصف هيكل الداتابيز، وبيوفر العمليات الأساسية (استرجاع وتحديث) والعمليات المعرفة من المستخدم.",
      explanationIntro: "طب إزاي بنحقق الـ Data Abstraction ده على أرض الواقع؟ بنحققه باستخدام حاجة اسمها 'Data Model'. نموذج البيانات ده هو اللغة الهندسية اللي بنوصف بيها هيكل قاعدة البيانات: أنواع البيانات، العلاقات، القيود، والعمليات المسموح تتنفذ عليها.",
      points: [
        {
          badge: "الـ Data Model",
          title: "مجموعة المفاهيم الهيكلية",
          desc: "Collection of concepts describing the structure of a database؛ وهو الوسيلة لتحقيق تجريد البيانات (Achieve data abstraction)."
        },
        {
          badge: "الجانب الديناميكي",
          title: "Basic Operations (الاسترجاع والتحديث)",
          desc: "العمليات الأساسية المحددة للتعامل مع البيانات: Retrievals (قراءة واستعلام) و Updates (إضافة وتعديل وحذف)."
        },
        {
          badge: "عمليات المستخدم",
          title: "User-Defined Operations",
          desc: "السماح لمصمم النظام بتعريف عمليات برمجية خاصة بالكائن؛ زي عملية COMPUTE_GPA اللي بتتطبق على كائن STUDENT."
        }
      ],
      comparison: {
        title: "الجانب الهيكلي (Structural) مقابل الجانب الديناميكي (Behavioral)",
        items: [
          {
            name: "Structure (الهيكل)",
            desc: "أنواع البيانات، الحقول، العلاقات، والقيود اللي بتحكم الجداول.",
            example: "حقل اسم الطالب نوعه String ورقم الطالب Primary Key."
          },
          {
            name: "Behavior / Operations (السلوك)",
            desc: "العمليات المسموحة على الكائن لحساب نتائج أو تحديث حالته.",
            example: "دالة COMPUTE_GPA لحساب المعدل التراكمي للطالب."
          }
        ]
      },
      triggers: [
        { trigger: "Collection of concepts that describe the structure of a database", choose: "Data Model" },
        { trigger: "Provides means to achieve data abstraction", choose: "Data Model" },
        { trigger: "Example of user-defined operation applied to STUDENT", choose: "COMPUTE_GPA" }
      ],
      keywords: [
        { en: "Data Model", ar: "نموذج البيانات" },
        { en: "Basic Operations", ar: "العمليات الأساسية (Retrievals & Updates)" },
        { en: "User-Defined Operations", ar: "عمليات معرفة من المستخدم" },
        { en: "COMPUTE_GPA", ar: "حساب المعدل التراكمي" }
      ],
      tricks: "ركز: الـ Data Model مبيوصفش بس الهيكل الثابت (Structure)؛ ده كمان بيوصف الجانب الديناميكي وسلوك التطبيق (Dynamic aspect or behavior) عبر العمليات المسموحة!",
      quiz: {
        question: "Which of the following is given in the slides as an example of a user-defined operation on a STUDENT object?",
        options: [
          "FORMAT_DISK",
          "COMPUTE_GPA",
          "ALLOCATE_BLOCK",
          "RESTART_SERVER"
        ],
        correct: 1,
        explanation: "السلايد ذكرت نصاً دالة COMPUTE_GPA كمثال على عملية معرفة من المستخدم (User-defined operation) مسموح تطبيقها على كائن الطالب."
      }
    },
    {
      num: 5,
      title: "Categories of Data Models",
      arabicTitle: "تصنيفات نماذج البيانات (Conceptual vs Physical vs Representational)",
      image: "materials/slides/db-lec3/slide_5.png",
      coreSummary: "نماذج البيانات تنقسم إلى 3 فئات: مفاهيمية عالية المستوى (قريبة للمستخدم)، فيزيائية منخفضة المستوى (قريبة للتخزين)، وتمثيلية (حلقة وصل بينهما).",
      explanationIntro: "مش كل الناس بتبص لقاعدة البيانات بنفس الطريقة؛ اليوزر العادي شايف كيانات وأسماء، والمهندس شايف سجلات وجداول، ومهندس الهاردوير شايف Blocks ومسارات على الديسك. علشان كده قسمنا نماذج البيانات لـ 3 فئات أساسية بتلبي كل مستوى.",
      points: [
        {
          badge: "High-level / Conceptual",
          title: "النماذج المفاهيمية عالية المستوى",
          desc: "قريبة جداً من طريقة إدراك وفهم المستخدمين للبيانات (Close to the way many users perceive data)."
        },
        {
          badge: "Low-level / Physical",
          title: "النماذج الفيزيائية منخفضة المستوى",
          desc: "بتوصف تفاصيل التخزين الدقيقة على وسائط التخزين زي الهارد ديسك (How data is stored on computer storage media)."
        },
        {
          badge: "Representational / Implementation",
          title: "النماذج التمثيلية والتنفيذية",
          desc: "حل وسطي وسهل الفهم لليوزر النهائي وفي نفس الوقت شبه الطريقة اللي بتتنظم بيها السجلات في الكمبيوتر."
        }
      ],
      comparison: {
        title: "مقارنة فئات نماذج البيانات الثلاثة",
        items: [
          {
            name: "Conceptual (مفاهيمي)",
            desc: "أعلى مستوى تجريد، يركز على الكيانات والصفات والعلاقات بدون أدنى اهتمام بالتخزين.",
            example: "نموذج الكيانات والعلاقات (ER Model)."
          },
          {
            name: "Representational (تمثيلي)",
            desc: "مستوى وسطي بيستخدم سجلات وجداول، وده المستخدم في معظم نظم الـ DBMS التجارية.",
            example: "النموذج العلائقي (Relational Model - SQL Tables)."
          },
          {
            name: "Physical (فيزيائي)",
            desc: "أدنى مستوى تجريد، يصف أشكال السجلات وترتيبها ومسارات الوصول والفهارس.",
            example: "Record formats, B-Tree indexes, hashing access paths."
          }
        ]
      },
      triggers: [
        { trigger: "Close to the way many users perceive data", choose: "Conceptual / High-level data models" },
        { trigger: "Describe the details of how data is stored on storage media", choose: "Physical / Low-level data models" },
        { trigger: "Easily understood by end users and similar to storage organization", choose: "Representational / Implementation models" }
      ],
      keywords: [
        { en: "Conceptual data models", ar: "نماذج مفاهيمية عالية المستوى" },
        { en: "Physical data models", ar: "نماذج فيزيائية منخفضة المستوى" },
        { en: "Representational data models", ar: "نماذج تمثيلية وسيطة" }
      ],
      tricks: "فخ امتحانات دايماً: لو قالك 'Close to the way users perceive data' تختار Conceptual؛ لو قالك 'Details of storage' تختار Physical؛ لو قالك 'Easily understood AND similar to storage' تختار Representational!",
      quiz: {
        question: "Which category of data models describes the details of how data is physically stored on computer storage media?",
        options: [
          "Conceptual data models",
          "Physical / Low-level data models",
          "High-level models",
          "External views"
        ],
        correct: 1,
        explanation: "النماذج الفيزيائية منخفضة المستوى (Physical/Low-level models) هي التي تصف تفاصيل التخزين على وسائط التخزين الحاسوبية."
      }
    },
    {
      num: 6,
      title: "High-level or Conceptual data models - Concepts",
      arabicTitle: "عناصر النماذج المفاهيمية (Entity, Attribute, Relationship)",
      image: "materials/slides/db-lec3/slide_6.png",
      coreSummary: "النموذج المفاهيمي (وأشهرها ER Model) بيعتمد على 3 عناصر جوهرية: الكيان (Entity)، الخاصية (Attribute)، والعلاقة (Relationship).",
      explanationIntro: "تعال ندخل في تفاصيل النماذج المفاهيمية عالية المستوى؛ أشهر نموذج مفاهيمي في العالم هو 'Entity-Relationship model' (نموذج الكيانات والعلاقات). النموذج ده بيبني قاعدة البيانات كلها من تلات أحجار أساسية واضحة وبسيطة جداً.",
      points: [
        {
          badge: "1. Entity (الكيان)",
          title: "كائن أو مفهوم واقعي",
          desc: "يمثل شيئاً حقيقياً في العالم الواقعي أو مفهوماً له وجود مستقل؛ زي موظف، مشروع، طالب، أو قسم."
        },
        {
          badge: "2. Attribute (الخاصية/الصفة)",
          title: "سمة تصف الكيان",
          desc: "خاصية ذات أهمية تصف الكيان بدقة؛ زي اسم الموظف، تاريخ ميلاده، مرتبه، أو رقم تليفونه."
        },
        {
          badge: "3. Relationship (العلاقة)",
          title: "رابط بين كيانين أو أكثر",
          desc: "تمثل ارتباطاً أو صلة منطقية بين كيانين أو أكتر؛ زي إن الموظف 'يعمل في' قسم، أو الطالب 'يسجل في' مادة."
        }
      ],
      triggers: [
        { trigger: "Represents a real-world object or concept", choose: "Entity" },
        { trigger: "Represents some property of interest that describes an entity", choose: "Attribute" },
        { trigger: "Represents an association among two or more entities", choose: "Relationship" }
      ],
      keywords: [
        { en: "Entity", ar: "كيان (شيء من العالم الواقعي)" },
        { en: "Attribute", ar: "خاصية / سمة تميز الكيان" },
        { en: "Relationship", ar: "علاقة تربط الكيانات" },
        { en: "ER Model", ar: "نموذج الكيانات والعلاقات" }
      ],
      tricks: "احفظ التلات كلمات دول صم: Entity = Real-world object | Attribute = Property | Relationship = Association.",
      quiz: {
        question: "In conceptual data modeling, what represents an association among two or more entities?",
        options: [
          "An Attribute",
          "A Relationship",
          "A Disk Block",
          "A Schema Evolution"
        ],
        correct: 1,
        explanation: "العلاقة (Relationship) هي الرابط أو الارتباط (Association) الذي يجمع بين كيانين أو أكثر."
      }
    },
    {
      num: 7,
      title: "The COMPANY ER Diagram",
      arabicTitle: "مخطط الكيانات والعلاقات الكامل لشركة (COMPANY ER Diagram)",
      image: "materials/slides/db-lec3/slide_7.png",
      coreSummary: "المخطط المرجعي الشهير لشركة: كيانات أساسية، كيان ضعيف (DEPENDENT)، وسمات مركبة ومتعددة ومشتقة ومفاتيح وعلاقات كارديناليتي.",
      explanationIntro: "السلايد دي هي أشهر رسمة في كتاب قواعد البيانات كله! رسمة شركة (COMPANY) بنموذج الـ ER. دي تطبيق عملي لكل الرموز الهندسية اللي هتشوفها في الامتحان؛ الدكتور بيجيب أجزاء منها ويسألك: الشكل ده معناه إيه؟ والخطين دول معناهم إيه؟ تعال نفككها حتة حتة.",
      points: [
        {
          badge: "الهدف من المخطط",
          title: "تمثيل كامل لبيانات الشركة",
          desc: "توضيح الموظفين (EMPLOYEE)، الأقسام (DEPARTMENT)، المشاريع (PROJECT)، والمعالين (DEPENDENT) مع كافة السمات والروابط."
        }
      ],
      diagramDeconstruction: {
        title: "تفكيك عناصر ومخطط الـ ER بالتفصيل الممل:",
        overview: "الرسمة بتوضح 4 كيانات (مستطيلات)، مرتبطة بعلاقات (معينات)، ومحاطة بسمات (أشكال بيضاوية) برموز مختلفة تماماً:",
        parts: [
          {
            symbol: "EMPLOYEE, DEPARTMENT, PROJECT",
            type: "Single Rectangle (مستطيل مفرد)",
            role: "Strong Entity (كيان قوي/أساسي)",
            meaning: "كيان له وجود مستقل وله مفتاح أساسي (Key) خاص به يميزه عن غيره.",
            example: "الموظف له رقم قومي Ssn بيميزه بدون الحاجة لأي كيان تاني."
          },
          {
            symbol: "DEPENDENT",
            type: "Double Rectangle (مستطيل مزدوج)",
            role: "Weak Entity (كيان ضعيف)",
            meaning: "كيان معندوش مفتاح أساسي خاص بيه، ووجوده معتمد كلياً على وجود كيان قوي (الموظف صاحب التأمين).",
            example: "ابن الموظف أو زوجته؛ مينفعش يتسجل في النظام إلا إذا كان والده أو زوجها موظف في الشركة."
          },
          {
            symbol: "Ssn, Number",
            type: "Underlined Oval (شكل بيضاوي تحته خط)",
            role: "Key Attribute (خاصية المفتاح)",
            meaning: "خاصية فريدة لا تتكرر تميز كل سجل داخل الكيان عن غيره.",
            example: "الرقم القومي Ssn للموظف ورقم القسم Number."
          },
          {
            symbol: "Name (Fname, Minit, Lname)",
            type: "Branching Oval (شكل بيضاوي متفرع)",
            role: "Composite Attribute (خاصية مركبة)",
            meaning: "خاصية يمكن تجزئتها إلى أجزاء أصغر ذات معنى مستقل.",
            example: "الاسم الكامل بيتفرع لـ: اسم أول، حرف أول من اسم الأب، واسم العائلة."
          },
          {
            symbol: "Locations",
            type: "Double Oval (شكل بيضاوي مزدوج)",
            role: "Multivalued Attribute (خاصية متعددة القيم)",
            meaning: "خاصية يمكن أن تحتوي على أكثر من قيمة لنفس السجل الواحد.",
            example: "القسم ممكن يكون ليه فروع في القاهرة وإسكندرية والمنصورة في نفس الوقت."
          },
          {
            symbol: "Number_of_employees",
            type: "Dashed Oval (شكل بيضاوي منقط/متقطع)",
            role: "Derived Attribute (خاصية مشتقة)",
            meaning: "خاصية لا تُخزن مباشرة على الديسك، ولكن يتم حسابها تلقائياً من بيانات أخرى.",
            example: "عدد موظفي القسم بنحسبه بعملية COUNT للموظفين التابعين للقسم."
          },
          {
            symbol: "WORKS_FOR (1:N), CONTROLS (1:N), WORKS_ON (M:N), MANAGES (1:1)",
            type: "Diamond (معين)",
            role: "Relationship Types & Cardinalities",
            meaning: "المعين بيوضح نوع العلاقة والنسب العددية بين الكيانات.",
            example: "علاقة WORKS_ON نسبة M:N لأن الموظف يشتغل في كذا مشروع والمشروع فيه كذا موظف ولها خاصية Hours."
          },
          {
            symbol: "SUPERVISION",
            type: "Recursive Relationship",
            role: "علاقة دائرية/انعكاسية",
            meaning: "علاقة من الكيان لنفسه؛ الموظف يلعب دور المشرف (Supervisor بنسبة 1) ودور المرؤوس (Supervisee بنسبة N).",
            example: "مدير الفريق هو نفسه موظف في جدول الموظفين."
          },
          {
            symbol: "DEPENDENTS_OF",
            type: "Double Diamond (معين مزدوج)",
            role: "Identifying Relationship",
            meaning: "العلاقة التعريفية التي تربط الكيان الضعيف (DEPENDENT) بالكيان المالك (EMPLOYEE).",
            example: "رابط الأبوة أو الإعالة بين الموظف وأفراد أسرته."
          }
        ]
      },
      triggers: [
        { trigger: "Double rectangle in ER diagram", choose: "Weak Entity (DEPENDENT)" },
        { trigger: "Double oval in ER diagram", choose: "Multivalued Attribute (Locations)" },
        { trigger: "Dashed oval in ER diagram", choose: "Derived Attribute (Number_of_employees)" },
        { trigger: "Double diamond in ER diagram", choose: "Identifying Relationship" },
        { trigger: "Underlined attribute name in oval", choose: "Key Attribute (Primary Key)" }
      ],
      keywords: [
        { en: "Weak Entity", ar: "كيان ضعيف (مستطيل مزدوج)" },
        { en: "Multivalued Attribute", ar: "خاصية متعددة القيم (بيضاوي مزدوج)" },
        { en: "Derived Attribute", ar: "خاصية مشتقة (بيضاوي منقط)" },
        { en: "Identifying Relationship", ar: "علاقة تعريفية (معين مزدوج)" }
      ],
      tricks: "سؤال مضمون في أي امتحان: الشكل البيضاوي المنقط (Dashed oval) بيعبر عن إيه؟ الإجابة: Derived attribute! والشكل البيضاوي المزدوج (Double oval) بيعبر عن Multivalued attribute!",
      quiz: {
        question: "In the COMPANY ER diagram, how is a 'Derived Attribute' like Number_of_employees represented?",
        options: [
          "With a double rectangle",
          "With a dashed oval",
          "With an underlined diamond",
          "With a double diamond"
        ],
        correct: 1,
        explanation: "الخاصية المشتقة (Derived Attribute) تُمثل دائماً بشكل بيضاوي متقطع أو منقط (Dashed Oval)."
      }
    },
    {
      num: 8,
      title: "Categories of Data Models (cont'd.) - Relational Model",
      arabicTitle: "النموذج العلائقي والبيانات القائمة على السجلات (Relational Model)",
      image: "materials/slides/db-lec3/slide_8.png",
      coreSummary: "النموذج العلائقي (Relational Model) هو الأكثر استخداماً في النظم التجارية، وبيمثل البيانات في هياكل سجلات وجداول (Record-based).",
      explanationIntro: "بعد ما صممنا المخطط المفاهيمي (ERD)، بنيجي للمرحلة اللي بعدها: إزاي نمثله في الـ DBMS التجاري؟ هنا بيظهر 'Relational data model' اللي هو صاحب السيطرة المطلقة على السوق التجاري من السبعينات لحد النهاردة.",
      points: [
        {
          badge: "الأكثر انتشاراً",
          title: "Traditional Commercial DBMSs",
          desc: "النموذج الأكثر استخداماً في أشهر قواعد البيانات زي Oracle و Microsoft SQL Server و PostgreSQL و MySQL."
        },
        {
          badge: "Record-Based",
          title: "هياكل قائمة على السجلات",
          desc: "بيمثل البيانات باستخدام سجلات وجداول ثنائية الأبعاد (صفوف وأعمدة)، وعشان كده بيتسمى 'Record-based data model'."
        }
      ],
      comparison: {
        title: "النموذج المفاهيمي (ERD) مقابل النموذج العلائقي (Relational)",
        items: [
          {
            name: "ER Model (مفاهيمي)",
            desc: "بيستخدم كيانات وأشكال هندسية وعلاقات للتصميم النظري مع العميل.",
            example: "مستطيل EMPLOYEE متصل بمعين WORKS_FOR."
          },
          {
            name: "Relational Model (تنفيذي)",
            desc: "بيحول الكيانات لجداول حقيقية فيها أعمدة وسجلات ومفاتيح أجنبية.",
            example: "جدول EMPLOYEE فيه حقل Dno بيشير لـ Dnumber في جدول DEPARTMENT."
          }
        ]
      },
      triggers: [
        { trigger: "Used most frequently in traditional commercial DBMSs", choose: "Relational data model" },
        { trigger: "Represent data by using record structures", choose: "Record-based data models (Relational)" }
      ],
      keywords: [
        { en: "Relational data model", ar: "النموذج العلائقي" },
        { en: "Record-based models", ar: "نماذج قائمة على السجلات" },
        { en: "Commercial DBMSs", ar: "نظم قواعد البيانات التجارية" }
      ],
      tricks: "لو سألك عن الاسم التاني للنماذج اللي بتنظم البيانات في Records تختار 'Record-based data models'، وأبرز مثال عليها هو الـ Relational model.",
      quiz: {
        question: "Why is the relational data model also referred to as a 'record-based' data model?",
        options: [
          "Because it only records audio and video files",
          "Because it represents data by using record structures (tables of rows)",
          "Because it permanently deletes old records upon startup",
          "Because it cannot support secondary indexes"
        ],
        correct: 1,
        explanation: "يسمى 'Record-based' لأنه يمثل البيانات باستخدام هياكل السجلات (Record structures) أي الجداول والصفوف."
      }
    },
    {
      num: 9,
      title: "Relational Schema Diagram for COMPANY Database",
      arabicTitle: "مخطط الجداول العلائقية للشركة والمفاتيح الأجنبية (Relational Schema)",
      image: "materials/slides/db-lec3/slide_9.png",
      coreSummary: "المخطط العلائقي الكامل: 6 جداول مرتبطة بأسهم تمثل المفاتيح الأجنبية (Foreign Keys) التي تشير إلى المفاتيح الأساسية (Primary Keys).",
      explanationIntro: "السلايد دي بتوضح إزاي حولنا رسمة الـ ERD اللي كانت في شريحة 7 إلى جداول حقيقية (Relational Schema). كل جدول مكتوب اسمه وتحته الحقول، والأسهم دي مش مجرد خطوط زينة، دي قيود التكامل المرجعي (Foreign Keys) اللي بتمنع ضياع البيانات.",
      points: [
        {
          badge: "الجداول الـ 6",
          title: "هيكل الجداول في النظام",
          desc: "EMPLOYEE, DEPARTMENT, DEPT_LOCATIONS, PROJECT, WORKS_ON, DEPENDENT."
        }
      ],
      diagramDeconstruction: {
        title: "تفكيك مخطط الجداول العلائقية والأسهم المرجعية:",
        overview: "كل صندوق يمثل جدولاً، الخط تحت الحقل يعني Primary Key، والسهم الخارج من حقل رايح لخط معناه Foreign Key:",
        parts: [
          {
            symbol: "EMPLOYEE.Ssn",
            type: "Underlined Column",
            role: "Primary Key (المفتاح الأساسي)",
            meaning: "الرقم التعريفي الفريد لكل موظف.",
            example: "123456789 للموظف جون سميث."
          },
          {
            symbol: "Super_ssn -> EMPLOYEE.Ssn",
            type: "Self-referencing Foreign Key",
            role: "مفتاح أجنبي دائري (Recursive)",
            meaning: "حقل يشير إلى نفس الجدول؛ لأن مدير الموظف هو في الأصل موظف آخر مسجل بنفس الجدول.",
            example: "الموظف رقم 1 رئيسه المباشر هو الموظف رقم 8 في نفس جدول EMPLOYEE."
          },
          {
            symbol: "EMPLOYEE.Dno -> DEPARTMENT.Dnumber",
            type: "Foreign Key",
            role: "مفتاح أجنبي يربط القسم",
            meaning: "يربط كل موظف بالقسم الذي يعمل لصالحه.",
            example: "Dno = 5 يعني الموظف يعمل في قسم البحوث (Research)."
          },
          {
            symbol: "DEPARTMENT.Mgr_ssn -> EMPLOYEE.Ssn",
            type: "Foreign Key",
            role: "مدير القسم",
            meaning: "يشير إلى الموظف المسؤول عن إدارة هذا القسم وتاريخ بدء إدارته Mgr_start_date.",
            example: "مدير قسم البحوث هو فرانكلين وونغ."
          },
          {
            symbol: "DEPT_LOCATIONS (Dnumber, Dlocation)",
            type: "Composite Primary Key",
            role: "جدول فروع القسم متعدد القيم",
            meaning: "تحويل الخاصية متعددة القيم (Locations) لجدول مستقل مفتاحه مركب من رقم القسم واسم المكان.",
            example: "قسم 5 له فرع في هيوستن وبيلير وستافورد."
          },
          {
            symbol: "WORKS_ON (Essn, Pno, Hours)",
            type: "Composite Key & Relationship Table",
            role: "جدول ربط علاقة M:N",
            meaning: "علاقة يعمل في (M:N) تحولت لجدول يحمل المفتاحين الأجنبيين وعدد الساعات.",
            example: "الموظف Essn يشتغل على مشروع Pno لعدد Hours أسبوعياً."
          },
          {
            symbol: "DEPENDENT (Essn, Dependent_name)",
            type: "Weak Entity Table",
            role: "جدول الكيان الضعيف",
            meaning: "المفتاح مركب من المفتاح الأجنبي للموظف Essn والاسم الجزئي للمُعال Dependent_name.",
            example: "أبناء الموظف يتم تمييزهم داخل أسرته باسم الابن مع رقم الموظف."
          }
        ]
      },
      triggers: [
        { trigger: "Arrow from Super_ssn pointing back to Ssn in EMPLOYEE", choose: "Recursive / Self-referencing Foreign Key" },
        { trigger: "Table representing M:N relationship with Hours attribute", choose: "WORKS_ON table" },
        { trigger: "Composite key (Essn, Dependent_name) representing weak entity", choose: "DEPENDENT table" }
      ],
      keywords: [
        { en: "Primary Key", ar: "مفتاح أساسي (تحته خط صلب)" },
        { en: "Foreign Key", ar: "مفتاح أجنبي (سهم يشير لجدول آخر)" },
        { en: "Referential Integrity", ar: "التكامل المرجعي" },
        { en: "WORKS_ON", ar: "جدول علاقة متعدد لمتعدد" }
      ],
      tricks: "ركز على السهم اللي طالع من جدول EMPLOYEE وراجع لنفس جدول EMPLOYEE (Super_ssn -> Ssn): ده معناه Self-referencing Foreign Key علشان يمثل علاقة الـ 1:N Supervision!",
      quiz: {
        question: "In the COMPANY relational schema, what does the arrow from Super_ssn to Ssn represent?",
        options: [
          "A composite primary key on the DEPARTMENT table",
          "A recursive (self-referencing) foreign key representing supervision among employees",
          "A physical index pointer stored on disk",
          "An external view definition"
        ],
        correct: 1,
        explanation: "السهم الدائري من Super_ssn إلى Ssn يمثل مفتاحاً أجنبياً ذاتي المرجع (Recursive Foreign Key) لتحديد المشرف المباشر لكل موظف."
      }
    },
    {
      num: 10,
      title: "Object data model & UML Class Diagram",
      arabicTitle: "النموذج الكائني ومخطط الأصناف UML (Object Data Model)",
      image: "materials/slides/db-lec3/slide_10.png",
      coreSummary: "النموذج الكائني (Object Data Model) بيمثل البيانات على هيئة كلاسات وكائنات، ويجمع بين البيانات والوظائف (Methods) باستخدام UML.",
      explanationIntro: "في التسعينات ومع انتشار البرمجة كائنية التوجه (OOP)، ظهر 'Object Data Model'. الميزة هنا إنه بيقرب جداً من النموذج المفاهيمي وبيستخدم لغة النمذجة الموحدة (UML Class Diagrams)؛ الكيان هنا مابقاش مجرد صف في جدول، ده بقى Class فيه بيانات وفيه دوال برمجية (Operations) بتشتغل عليها.",
      points: [
        {
          badge: "المفهوم",
          title: "New Family of Higher-Level Models",
          desc: "عائلة جديدة من نماذج التنفيذ عالية المستوى، قريبة جداً من النماذج المفاهيمية (Closer to conceptual models)."
        },
        {
          badge: "UML Class Diagrams",
          title: "استخدام الـ UML القياسي",
          desc: "تمثيل الكائنات بصناديق مقسمة إلى 3 أقسام: اسم الصنف (Class Name)، السمات والأنواع (Attributes)، والدوال والعمليات (Methods)."
        }
      ],
      diagramDeconstruction: {
        title: "تفكيك مخطط أصناف UML للكائنات:",
        overview: "صناديق الكلاسات بتوضح الأصناف والعمليات وعلاقات التجميع والـ Multiplicity:",
        parts: [
          {
            symbol: "EMPLOYEE & DEPARTMENT Classes",
            type: "Three-compartment box",
            role: "Class Definition",
            meaning: "القسم الأول للاسم، الثاني للخصائص، والثالث للعمليات زي (add_employee, change_manager).",
            example: "كلاس DEPARTMENT فيه عملية change_manager لتحديث المدير تلقائياً."
          },
          {
            symbol: "MANAGES & WORKS_ON",
            type: "Dashed Box / Association Class",
            role: "Association Class (صنف الرابط)",
            meaning: "رابط بين صنفين يحمل خصائص خاصة بالرابطة نفسها زي Start_date أو Hours.",
            example: "ساعات العمل Hours خاصة بارتباط الموظف بالمشروع وليس بالموظف وحده."
          },
          {
            symbol: "Multiplicity (1..1, 0..1, 1..*, 0..*)",
            type: "Range Notation",
            role: "القيود العددية",
            meaning: "تحديد الحد الأدنى والأقصى للاشتراك في العلاقة بدقة هندسية تامة.",
            example: "1..1 يعني يجب أن يرتبط بكائن واحد بالضبط، و 0..* يعني اختياري لعدة كائنات."
          },
          {
            symbol: "Whole <>-- Part",
            type: "Diamond Shape on Line",
            role: "Aggregation / Composition Notation",
            meaning: "يمثل علاقة الاحتواء والتجميع (كائن يحتوي كائنات أخرى كأجزاء منه).",
            example: "القسم يحتوي على مواقع LOCATION تابعة له."
          }
        ]
      },
      triggers: [
        { trigger: "New family of higher-level implementation data models closer to conceptual (UML)", choose: "Object data model" },
        { trigger: "Class box containing attributes and operations/methods", choose: "Object / UML model" }
      ],
      keywords: [
        { en: "Object data model", ar: "نموذج البيانات الكائني" },
        { en: "UML", ar: "لغة النمذجة الموحدة (Unified Modeling Language)" },
        { en: "Multiplicity", ar: "القيود العددية (1..1, 0..*)" },
        { en: "Operations / Methods", ar: "الدوال والعمليات داخل الصنف" }
      ],
      tricks: "ركز في الفرق: الـ Relational model بيخزن بيانات بس (Passive Data)؛ أما الـ Object model بيخزن البيانات ومعاها الدوال والعمليات اللي بتتصرف في البيانات دي (Data + Operations)!",
      quiz: {
        question: "What makes the Object Data Model closer to conceptual models and OOP programming?",
        options: [
          "It permanently stores data on magnetic tape only",
          "It integrates both data attributes and operations/methods within classes using UML",
          "It prohibits the use of primary and foreign keys",
          "It eliminates the need for computer memory"
        ],
        correct: 1,
        explanation: "النموذج الكائني يدمج الخصائص (Attributes) مع الدوال والعمليات (Methods/Operations) داخل كلاسات معتمدة على الـ UML."
      }
    },
    {
      num: 11,
      title: "Categories of Data Models (cont'd.) - Physical Models & Access Paths",
      arabicTitle: "النماذج الفيزيائية ومسارات الوصول والفهارس (Physical Models & Access Paths)",
      image: "materials/slides/db-lec3/slide_11.png",
      coreSummary: "النماذج الفيزيائية بتحدد إزاي الملفات متسجلة على الهارد ديسك، ومسار الوصول (Access Path) زي الفهرس (Index) بيسرع البحث المباشر.",
      explanationIntro: "دلوقتي بننزل لأعمق مستوى في الداتابيز: المستوى الفيزيائي (Physical Data Models). هنا مفيش كلام نظري؛ هنا بنتكلم عن حجم السجل بالبايت، وترتيب البيانات على الديسك، وإزاي السيرفر يلاقي السجل من بين ملايين السجلات في أجزاء من الثانية باستخدام مسارات الوصول والفهارس.",
      points: [
        {
          badge: "Physical Models",
          title: "وصف التخزين كملفات",
          desc: "بتوصف إزاي البيانات بتتخزن كملفات في الكمبيوتر بتمثيل: Record formats (أشكال السجلات)، Record orderings (ترتيبها)، و Access paths (مسارات الوصول)."
        },
        {
          badge: "Access Path",
          title: "مسار الوصول السريع",
          desc: "هيكل برمجي مخصص يجعل عملية البحث عن سجلات معينة داخل قاعدة البيانات سريعة وعالية الكفاءة (Efficient search)."
        },
        {
          badge: "Index (الفهرس)",
          title: "أشهر مثال لمسار الوصول",
          desc: "أبرز تطبيق لمسارات الوصول؛ بيسمح بالوصول المباشر (Direct access) للبيانات باستخدام مصطلح الفهرس أو الكلمة المفتاحية."
        }
      ],
      realLifeExample: {
        title: "فهرس الكتاب الورقي",
        desc: "تخيل كتاب طب فيه 1000 صفحة؛ لو عايز تبحث عن موضوع 'القلب'، لو قرأت الكتاب من أوله لآخره هتاخد ساعات (Linear Scan)، لكن لو روحت للفهرس في آخر الكتاب (Index)، هتلاقي كلمة 'القلب: ص 450' وتروح عليها فوراً في ثانية واحدة (Direct Access)."
      },
      triggers: [
        { trigger: "Structure that makes the search for particular database records efficient", choose: "Access path" },
        { trigger: "Allows direct access to data using an index term or keyword", choose: "Index" },
        { trigger: "Record formats, record orderings, and access paths", choose: "Physical data models" }
      ],
      keywords: [
        { en: "Physical data models", ar: "نماذج البيانات الفيزيائية" },
        { en: "Access path", ar: "مسار الوصول الفعال" },
        { en: "Index", ar: "الفهرس للوصول المباشر" },
        { en: "Record formats", ar: "أشكال السجلات التخزينية" }
      ],
      tricks: "لو سألك في الامتحان: 'An index is an example of what?' الإجابة فوراً: 'An example of an access path'!",
      quiz: {
        question: "What is an 'Index' in the context of physical database models?",
        options: [
          "A high-level conceptual entity",
          "An example of an access path that allows direct access to data records",
          "A user interface presentation screen",
          "A command used to shut down the server"
        ],
        correct: 1,
        explanation: "الفهرس (Index) هو مثال على مسار الوصول (Access path) الذي يتيح الوصول المباشر والفعال للسجلات."
      }
    },
    {
      num: 12,
      title: "Schemas, Instances, and Database State",
      arabicTitle: "الفرق بين السكيما، والحالة، ومخطط السكيما (Schema vs State vs Constructs)",
      image: "materials/slides/db-lec3/slide_12.png",
      coreSummary: "السكيما (Schema) هي الوصف والتصميم الثابت، المخطط (Schema Diagram) رسمتها، الـ Construct كائن فيها، والحالة (State) هي البيانات في لحظة معينة.",
      explanationIntro: "السلايد دي بتأسس لأكتر سؤال بيتكرر في امتحانات الفاينل والميدتيرم: إيه الفرق بين الـ Database Schema والـ Database State؟ السكيما هي الرسم الهندسي والتصميم (مش بتتغير إلا نادراً جداً)، أما الـ State هي البيانات الفعلية اللي جوة الجداول في اللحظة دي بالثانية.",
      points: [
        {
          badge: "Database Schema",
          title: "وصف وهيكل قاعدة البيانات",
          desc: "Description of a database يتم تحديده أثناء مرحلة التصميم، ولا يُتوقع أن يتغير كثيراً (Not expected to change frequently)."
        },
        {
          badge: "Schema Diagram",
          title: "رسمة المخطط الهيكلي",
          desc: "العرض المرئي للسكيما؛ يوضح هيكل كل نوع سجل (Record type structure) لكنه لا يعرض السجلات الفعلية إطلاقاً."
        },
        {
          badge: "Schema Construct",
          title: "كائنات وبنايات السكيما",
          desc: "كل كائن أو عنصر مفرد داخل السكيما؛ زي جدول STUDENT أو جدول COURSE."
        },
        {
          badge: "Database State",
          title: "لقطة البيانات الحالية (Snapshot)",
          desc: "البيانات الفعلية المخزنة داخل قاعدة البيانات في لحظة زمنية معينة (Data at a particular moment in time)."
        }
      ],
      comparison: {
        title: "مقارنة سريعة: Schema مقابل State",
        items: [
          {
            name: "Database Schema (المخطط)",
            desc: "الوصف والهيكل، يُحدد أثناء التصميم، يتغير نادراً جداً (Infrequently).",
            example: "تعريف جدول الطالب بأعمدته: Name, ID, GPA."
          },
          {
            name: "Database State (الحالة/اللقطة)",
            desc: "البيانات المخزنة في لحظة معينة، تتغير باستمرار مع كل عملية إضافة أو تعديل أو حذف.",
            example: "وجود 500 طالب مسجلين اليوم، بكرة ينضم 5 جدد فتتغير الحالة."
          }
        ]
      },
      triggers: [
        { trigger: "Description of a database specified during design, not expected to change frequently", choose: "Database Schema" },
        { trigger: "Displays the structure of record types but not actual instances of records", choose: "Schema diagram" },
        { trigger: "Each object in the schema such as STUDENT or COURSE", choose: "Schema construct" },
        { trigger: "Data in database at a particular moment in time (snapshot)", choose: "Database state" }
      ],
      keywords: [
        { en: "Database Schema", ar: "مخطط/وصف قاعدة البيانات" },
        { en: "Schema Diagram", ar: "رسمة المخطط الهيكلي" },
        { en: "Schema Construct", ar: "كائن المخطط (مثل جدول معين)" },
        { en: "Database State / Snapshot", ar: "حالة قاعدة البيانات / اللقطة اللحظية" }
      ],
      tricks: "انتبه: الـ Schema Diagram بتعرض 'Structure of each record type' بس ومبتعرضش أبداً 'actual instances of records'!",
      quiz: {
        question: "What does a 'Schema Diagram' display according to the slides?",
        options: [
          "All historical log files and server temperatures",
          "The structure of each record type but NOT the actual instances of records",
          "The exact binary representation of records on the hard disk",
          "The compiled machine code of the DBMS"
        ],
        correct: 1,
        explanation: "مخطط السكيما (Schema Diagram) يعرض هيكل كل نوع سجل فقط، ولا يعرض أبداً سجلات البيانات الحقيقية."
      }
    },
    {
      num: 13,
      title: "Figure 2.1: Schema Diagram for UNIVERSITY Database",
      arabicTitle: "مخطط سكيما قاعدة بيانات الجامعة (Schema Diagram of UNIVERSITY Database)",
      image: "materials/slides/db-lec3/slide_13.png",
      coreSummary: "شكل 2.1 في الكتاب: مخطط السكيما لقاعدة بيانات الجامعة يوضح 5 جداول بهياكلها وحقولها فقط دون عرض أي بيانات مسجلة.",
      explanationIntro: "ده الشكل التطبيقي العملي اللي بيوضح لك يعني إيه 'Schema Diagram'. السلايد عارضة 5 جداول خاصة بالجامعة. لاحظ كويس جداً: هل شايف أي طالب اسمه أحمد أو سارة؟ لأ! لأن ده مجرد رسم الهيكل (Names of tables and attributes) فقط لا غير.",
      points: [
        {
          badge: "محتويات الرسمة",
          title: "كائنات السكيما الـ 5 (Schema Constructs)",
          desc: "STUDENT, COURSE, PREREQUISITE, SECTION, GRADE_REPORT."
        }
      ],
      diagramDeconstruction: {
        title: "تفكيك كائنات سكيما الجامعة (UNIVERSITY Constructs):",
        overview: "كل صندوق في الشكل يمثل Schema Construct يحتوي على أسماء الحقول التابعة له:",
        parts: [
          {
            symbol: "STUDENT",
            type: "Schema Construct",
            role: "جدول الطلاب",
            meaning: "هيكل السجل يحتوي على: Name, Student_number, Class, Major.",
            example: "حقول لتخزين اسم الطالب ورقمه وسنته وتخصصه."
          },
          {
            symbol: "COURSE",
            type: "Schema Construct",
            role: "جدول المقررات الدراسية",
            meaning: "هيكل المقرر يحتوي على: Course_name, Course_number, Credit_hours, Department.",
            example: "بيانات المادة وعدد ساعاتها المعتمدة والقسم المسؤول عنها."
          },
          {
            symbol: "PREREQUISITE",
            type: "Schema Construct",
            role: "جدول المتطلبات السابقة للمقررات",
            meaning: "يحتوي على: Course_number, Prerequisite_number.",
            example: "مقرر هياكل البيانات يتطلب اجتياز مقرر البرمجة التأسيسية."
          },
          {
            symbol: "SECTION",
            type: "Schema Construct",
            role: "جدول الشعب الدراسية",
            meaning: "يحتوي على: Section_identifier, Course_number, Semester, Year, Instructor.",
            example: "شعبة رقم 85 لمادة معينة في فصل الخريف مع الدكتور أندرسون."
          },
          {
            symbol: "GRADE_REPORT",
            type: "Schema Construct",
            role: "جدول نتائج وسجلات الدرجات",
            meaning: "يحتوي على: Student_number, Section_identifier, Grade.",
            example: "ربط رقم الطالب بالشعبة الدراسية ودرجته النهائية (A أو B)."
          }
        ]
      },
      triggers: [
        { trigger: "Figure 2.1 schema constructs in UNIVERSITY database", choose: "STUDENT, COURSE, PREREQUISITE, SECTION, GRADE_REPORT" },
        { trigger: "A diagram showing table boxes with column names but empty of data rows", choose: "Schema Diagram" }
      ],
      keywords: [
        { en: "Schema Construct", ar: "كائن السكيما (مثل STUDENT)" },
        { en: "Record type", ar: "نوع وهيكل السجل" },
        { en: "UNIVERSITY Database", ar: "قاعدة بيانات الجامعة" }
      ],
      tricks: "الملاحظة اللي تحت في السلايد مهمة: كلمة Schemas هي الجمع الشائع لـ Schema، لكن الجمع اللاتيني الصحيح في المراجع القديمة هو Schemata!",
      quiz: {
        question: "Which of the following tables is NOT part of the UNIVERSITY schema diagram in Figure 2.1?",
        options: [
          "GRADE_REPORT",
          "PREREQUISITE",
          "PAYROLL_SALARY",
          "SECTION"
        ],
        correct: 2,
        explanation: "جدول PAYROLL_SALARY غير موجود في سكيما الجامعة؛ الجداول الخمسة هي STUDENT, COURSE, PREREQUISITE, SECTION, GRADE_REPORT."
      }
    },
    {
      num: 14,
      title: "Database Schema vs. Database State - Detailed Comparison",
      arabicTitle: "مقارنة دقيقة: سكيما الداتابيز مقابل حالة الداتابيز والحالات الصالحة",
      image: "materials/slides/db-lec3/slide_14.png",
      coreSummary: "الـ State هي محتوى الداتابيز الفعلي في لحظة معينة، الـ Initial State أول ما بنحملها، والـ Valid State هي الحالة المحققة لكافة القيود.",
      explanationIntro: "السلايد دي بتفصل بالمللي مفهوم الـ Database State ومسمياته التانية زي 'Database Instance' أو 'Occurrence' أو 'Snapshot'. وبتعرفنا على مفهومين غاية في الخطورة للامتحانات: الحالة الابتدائية (Initial State) والحالة الصالحة (Valid State).",
      points: [
        {
          badge: "Database State / Instance",
          title: "المحتوى الفعلي اللحظي",
          desc: "البيانات الفعلية المخزنة في لحظة زمنية معينة؛ وممكن تنطبق الكلمة على مستوى السجل الفردي (Record instance) أو الجدول (Table instance)."
        },
        {
          badge: "Initial Database State",
          title: "حالة التحميل الأولى",
          desc: "حالة قاعدة البيانات أول ما بنحمل فيها البيانات لأول مرة بعد الإنشاء (Initially loaded into the system)."
        },
        {
          badge: "Update = New State",
          title: "التغيير المستمر للحالة",
          desc: "في كل مرة بيتنفذ فيها أمر إضافة أو تعديل أو حذف (Update operation)، بنحصل على حالة جديدة تماماً لقاعدة البيانات."
        },
        {
          badge: "Valid State (الحالة الصالحة)",
          title: "الحالة المحققة للقيود",
          desc: "حالة تلبي جميع هياكل وقيود قاعدة البيانات (Satisfies the structure and constraints of the database)."
        }
      ],
      comparison: {
        title: "أنواع حالات قاعدة البيانات",
        items: [
          {
            name: "Initial State (الحالة الابتدائية)",
            desc: "أول حالة لقاعدة البيانات عند إدخال البيانات المبدئية لأول مرة بعد التصميم.",
            example: "إدخال بيانات 10 موظفين افتتاحيين للشركة الجديدة."
          },
          {
            name: "Valid State (الحالة الصالحة)",
            desc: "أي حالة تلتزم تماماً بالقواعد والقيود (زي منع تكرار الـ Primary Key والتكامل المرجعي).",
            example: "كل موظف مرتبط بقسم موجود فعلياً ومرتبه أكبر من الصفر."
          }
        ]
      },
      triggers: [
        { trigger: "Database state when it is initially loaded into the system", choose: "Initial Database State" },
        { trigger: "A state that satisfies the structure and constraints of the database", choose: "Valid State" },
        { trigger: "Every time an update operation is applied", choose: "We get another database state" }
      ],
      keywords: [
        { en: "Database State", ar: "حالة قاعدة البيانات اللحظية" },
        { en: "Database Instance / Snapshot", ar: "لقطة / نسخة لحظية للبيانات" },
        { en: "Initial State", ar: "الحالة الابتدائية عند أول تحميل" },
        { en: "Valid State", ar: "الحالة الصالحة المتوافقة مع القيود" }
      ],
      tricks: "ركز جداً في تعريف Valid State: لو الداتابيز فيها سجل بيكسر قيد المفتاح الأساسي أو قيد الـ Foreign Key تبقى مش Valid State؛ الـ DBMS دوره إنه يمنع أي عملية تخلي الداتابيز تخرج عن الـ Valid State!",
      quiz: {
        question: "What is defined as a database state that satisfies all the structure and constraints of the database?",
        options: [
          "Invalid State",
          "Valid State",
          "Initial State",
          "Static Schema"
        ],
        correct: 1,
        explanation: "الحالة الصالحة (Valid State) هي الحالة التي تحقق وتلبي جميع الهياكل والقيود (Structure and constraints) المحددة للنظام."
      }
    },
    {
      num: 15,
      title: "Figure 5.6: One Possible Database State for COMPANY Database",
      arabicTitle: "حالة فعلية لقاعدة بيانات الشركة بالبيانات الحقيقية (Populated State)",
      image: "materials/slides/db-lec3/slide_15.png",
      coreSummary: "شكل 5.6: مثال حي لحالة قاعدة بيانات شركة مليانة سجلات حقيقية في جداول EMPLOYEE و DEPARTMENT و WORKS_ON وغيرها.",
      explanationIntro: "لو السلايد رقم 9 كانت بتعرض 'Schema' (العظام والهيكل بس بدون لحم)، فالسلايد دي بتعرض 'Database State' باللحم والدم! هنا الجداول مليانة بيانات حقيقية: جون سميث مرتبه 30000، فرانكلين وونغ مرتبه 40000، ودي لقطة للحالة في يوم وتاريخ محدد.",
      points: [
        {
          badge: "توضيح الـ State",
          title: "البيانات المسجلة فعلياً",
          desc: "السلايد بتعرض 8 موظفين في EMPLOYEE، و 3 أقسام في DEPARTMENT، ومواقع الأقسام، وساعات عمل الموظفين في المشاريع."
        }
      ],
      diagramDeconstruction: {
        title: "تفكيك سجلات وحالة الجداول الفعلية في اللحظة الزمنية:",
        overview: "عرض السجلات المسجلة (Tuples) ومطابقتها لقيود التكامل:",
        parts: [
          {
            symbol: "EMPLOYEE Rows",
            type: "Table Instance (محتوى جدول)",
            role: "سجلات الموظفين الـ 8",
            meaning: "كل صف يمثل كائناً حقيقياً؛ جون سميث رئيسه المباشر 333445555 (فرانكلين وونغ)، وقسمه 5.",
            example: "الموظف James Borg رئيسه NULL لأنه المدير العام للشركة."
          },
          {
            symbol: "DEPARTMENT Rows",
            type: "Table Instance",
            role: "سجلات الأقسام الـ 3",
            meaning: "قسم 5 اسمه Research مديره فرانكلين وتاريخ تعيينه كمدير 1988-05-22.",
            example: "المدير Mgr_ssn قيمته مطابقة تماماً لأحد الـ Ssn في جدول EMPLOYEE (تكامل مرجعي)."
          },
          {
            symbol: "WORKS_ON Rows",
            type: "Relationship State",
            role: "توزيع الساعات",
            meaning: "الموظف 123456789 يعمل 32.5 ساعة على مشروع 1 و 7.5 ساعة على مشروع 2.",
            example: "مجموع الساعات للموظف = 40 ساعة عمل كاملة في الأسبوع."
          },
          {
            symbol: "DEPENDENT Rows",
            type: "Weak Entity Instances",
            role: "أفراد الأسرة",
            meaning: "الموظف فرانكلين (333445555) مسجل له 3 معالين: Alice (ابنة)، Theodore (ابن)، Joy (زوجة).",
            example: "جميعهم مرتبطون بنفس رقم الـ Essn التابع للموظف."
          }
        ]
      },
      triggers: [
        { trigger: "Figure showing actual populated rows with John Smith and Franklin Wong", choose: "Database State / Database Instance" },
        { trigger: "James Borg has NULL in Super_ssn", choose: "Top-level Manager with no supervisor" }
      ],
      keywords: [
        { en: "Database State", ar: "حالة قاعدة البيانات الفعلية" },
        { en: "Tuples / Rows", ar: "صفوف السجلات المسجلة" },
        { en: "NULL value", ar: "قيمة غير محددة أو فارغة منطقياً" }
      ],
      tricks: "لاحظ قيمة NULL في خانة Super_ssn عند جيمس بورج: ده معناه إنه التوب مانجر ومعندوش مشرف مباشر؛ دي تريكة مفتاح أجنبي بيقبل NULL!",
      quiz: {
        question: "In the COMPANY database state shown in Figure 5.6, what does a table populated with actual employee names and salaries represent?",
        options: [
          "The Database Schema (Intension)",
          "A Database State / Snapshot (Extension)",
          "A physical hard drive block allocation table",
          "An operating system interrupt vector"
        ],
        correct: 1,
        explanation: "الجدول الممتلئ بالبيانات والأسماء والمرتبات الفعلية يمثل حالة قاعدة البيانات (Database State أو Extension) في لحظة معينة."
      }
    },
    {
      num: 16,
      title: "Schemas, Instances, and Database State (cont'd.) - Evolution & Intension/Extension",
      arabicTitle: "تطور السكيما ومصطلحي Intension و Extension",
      image: "materials/slides/db-lec3/slide_16.png",
      coreSummary: "الـ Schema تسمى Intension وتتغير نادراً (Schema Evolution)، بينما الـ State تسمى Extension وتتغير مع كل تحديث.",
      explanationIntro: "السلايد دي فيها مصطلحين أكاديميين بيعشقهم واضعي الامتحانات: 'Intension' و 'Extension'. كتير من الطلاب بيتلخبطوا بينهم؛ السلايد دي بتديك الكبسولة السحرية للتمييز بينهم بوضوح، وبتشرح يعني إيه 'Schema evolution'.",
      points: [
        {
          badge: "Schema Evolution",
          title: "تطور وتعديل السكيما",
          desc: "التغييرات والتعديلات التي يتم تطبيقها على السكيما كلما تغيرت متطلبات التطبيق (زي إضافة عمود جديد لجدول قديم)."
        },
        {
          badge: "Intension = Schema",
          title: "المصطلح الأكاديمي للسكيما",
          desc: "السكيما يُطلق عليها اسم 'Intension' لأنها تعبر عن القصد والتصميم الهيكلي، وتتغير نادراً جداً (Very infrequently)."
        },
        {
          badge: "Extension = State",
          title: "المصطلح الأكاديمي للحالة",
          desc: "الحالة يُطلق عليها اسم 'Extension' لأنها تمثل الامتداد والبيانات الفعلية في الوجود، وتتغير في كل مرة تُحدّث فيها قاعدة البيانات."
        }
      ],
      comparison: {
        title: "المعادلة الذهبية للامتحان: Intension مقابل Extension",
        items: [
          {
            name: "Intension = Schema",
            desc: "التصميم، الهيكل، القواعد، يتغير نادراً جداً كجزء من Schema Evolution.",
            example: "كود CREATE TABLE في SQL."
          },
          {
            name: "Extension = State",
            desc: "البيانات المسجلة الفعلية، يتغير مع كل INSERT أو UPDATE أو DELETE.",
            example: "السجلات الحالية داخل الجدول في هذه الثانية."
          }
        ]
      },
      triggers: [
        { trigger: "Changes applied to schema as application requirements change", choose: "Schema evolution" },
        { trigger: "Schema is also called", choose: "Intension" },
        { trigger: "State is also called", choose: "Extension" },
        { trigger: "Changes very infrequently", choose: "Database schema (Intension)" },
        { trigger: "Changes every time the database is updated", choose: "Database state (Extension)" }
      ],
      keywords: [
        { en: "Schema evolution", ar: "تطور وتعديل هيكل السكيما" },
        { en: "Intension", ar: "المخطط / القصد الهيكلي (Schema)" },
        { en: "Extension", ar: "البيانات الممتدة / الحالة (State)" }
      ],
      tricks: "احفظها زي اسمك: Intension بحرف I = Schema (ثابتة) | Extension بحرف E = State (بتتغير مع كل عملية تعديل)!",
      quiz: {
        question: "In database terminology, what are the formal terms used for Schema and State respectively?",
        options: [
          "Extension for Schema, and Intension for State",
          "Intension for Schema, and Extension for State",
          "DDL for Schema, and SDL for State",
          "Primary for Schema, and Foreign for State"
        ],
        correct: 1,
        explanation: "السكيما تسمى رسمياً Intension، بينما حالة قاعدة البيانات تسمى Extension."
      }
    },
    {
      num: 17,
      title: "Example of a database state (University Tables)",
      arabicTitle: "مثال على حالة قاعدة بيانات الجامعة (COURSE, SECTION, GRADE_REPORT)",
      image: "materials/slides/db-lec3/slide_17.png",
      coreSummary: "شكل 1.2: حالة مسجلة لقاعدة بيانات الجامعة توضح بيانات المواد والشعب والدرجات والمتطلبات السابقة الفعلية.",
      explanationIntro: "هنا مثال تاني رائع على الـ Database State؛ المرة دي لقاعدة بيانات الجامعة. لاحظ الجداول الأربعة: المواد (COURSE) زي مقدمة علوم الحاسب CS1310، والشعب (SECTION) مع أرقامها والفصول والدكاترة، وشهادات الدرجات (GRADE_REPORT).",
      points: [
        {
          badge: "محتوى الحالة",
          title: "بيانات المواد والشعب",
          desc: "مادة Database رقمها CS3380 وتتبع قسم CS ولها 3 ساعات معتمدة، وتتطلب مسبقاً مادة Data Structures (CS3320)."
        }
      ],
      diagramDeconstruction: {
        title: "تفكيك حالة بيانات الجامعة وعلاقاتها:",
        overview: "كل جدول يعرض بيانات مسجلة فعلياً في حالة معينة:",
        parts: [
          {
            symbol: "COURSE State",
            type: "Table Instance",
            role: "المقررات المسجلة",
            meaning: "4 مقررات: Intro to CS, Data Structures, Discrete Math, Database مع ساعاتها.",
            example: "CS3320 = Data Structures (4 credit hours, CS dept)."
          },
          {
            symbol: "SECTION State",
            type: "Table Instance",
            role: "الشعب الدراسية المنعقدة",
            meaning: "شعبة 85 لمادة MATH2410 في خريف 04 مع الدكتور كينج، وشعبة 102 لمادة CS3320 في ربيع 05 مع الدكتور كنوث (Knuth).",
            example: "Donald Knuth من كبار علماء علوم الحاسب!"
          },
          {
            symbol: "GRADE_REPORT State",
            type: "Table Instance",
            role: "سجل الدرجات",
            meaning: "طالب 17 حصل على B في شعبة 112 وحصل على C في شعبة 119؛ وطالب 8 حصل على A في شعبة 85.",
            example: "تسجيل الدرجات لكل طالب في الشعبة التي حضرها."
          },
          {
            symbol: "PREREQUISITE State",
            type: "Table Instance",
            role: "شروط المقررات",
            meaning: "مادة CS3380 تتطلب مادتين: CS3320 و MATH2410.",
            example: "لا يمكنك التسجيل في قواعد البيانات إلا بعد اجتياز الهياكل والرياضيات المتقطعة."
          }
        ]
      },
      triggers: [
        { trigger: "Figure 1.2 with populated tables of courses and grades", choose: "Database State of University" },
        { trigger: "Student 8 received grade A in section 85", choose: "A record occurrence in GRADE_REPORT" }
      ],
      keywords: [
        { en: "Database State", ar: "حالة قاعدة البيانات" },
        { en: "COURSE instance", ar: "سجل المقرر" },
        { en: "GRADE_REPORT instance", ar: "سجل درجة الطالب" }
      ],
      tricks: "لو جاب لك جدول وفيه بيانات دكاترة ومواد ودرجات وقالك ده سكيما ولا ستيت؟ الإجابة فوراً State لأن فيه بيانات فعلية (Records) مش مجرد أسماء أعمدة!",
      quiz: {
        question: "If a database table displays actual course codes, semesters, instructor names, and student grades, it represents a:",
        options: [
          "Database Schema",
          "Database State (Instance)",
          "Data Definition Language statement",
          "Storage allocation bitmap"
        ],
        correct: 1,
        explanation: "أي عرض يحتوي على قيم حقيقية وأسماء ودرجات يمثل حالة قاعدة البيانات (Database State / Instance)."
      }
    },
    {
      num: 18,
      title: "Three-Schema Architecture and Data Independence",
      arabicTitle: "معمارية المستويات الثلاثة واستقلالية البيانات (Internal, Conceptual, External)",
      image: "materials/slides/db-lec3/slide_18.png",
      coreSummary: "الهدف الأسمى لمعمارية المستويات الثلاثة هو فصل تطبيقات المستخدم عن قاعدة البيانات الفيزيائية، وتتكون من: Internal، Conceptual، و External levels.",
      explanationIntro: "وصلنا للعمود الفقري لمنهج قواعد البيانات: 'Three-Schema Architecture' المقترحة من معهد ANSI/SPARC. ليه اتعملت المعمارية دي؟ لهدف رئيسي واحد: 'فصل تطبيقات المستخدمين والبرامج عن الهارد ديسك وطريقة التخزين الفيزيائية'. علشان لو غيرنا الهارد أو السيرفر، البرامج متقعش ولا تحتاج تتكتب من جديد!",
      points: [
        {
          badge: "الهدف الرئيسي",
          title: "Goal of Three-Schema Architecture",
          desc: "فصل برامج وتطبيقات المستخدمين عن قاعدة البيانات الفيزيائية وطرق تخزينها (Separate user applications from physical database)."
        },
        {
          badge: "1. Internal Level",
          title: "المستوى الداخلي / الفيزيائي",
          desc: "يصف البنية الفيزيائية لتخزين البيانات على الديسك، ومسارات الوصول (Access paths)، ونماذج التخزين التفصيلية."
        },
        {
          badge: "2. Conceptual Level",
          title: "المستوى المفاهيمي الشامل",
          desc: "يصف هيكل قاعدة البيانات بالكامل لجميع المستخدمين، ويركز على الكيانات والعلاقات والقيود ويخفي تفاصيل التخزين الفيزيائي."
        },
        {
          badge: "3. External or View Level",
          title: "المستوى الخارجي / واجهات المستخدمين",
          desc: "يصف الجزء الذي يهم فئة معينة من المستخدمين فقط (User views) ويخفي باقي قاعدة البيانات عنهم لحماية الخصوصية وتسهيل الاستخدام."
        }
      ],
      comparison: {
        title: "المستويات الثلاثة لمعمارية الـ DBMS",
        items: [
          {
            name: "External Level (الخارجي)",
            desc: "واجهات مخصصة لكل مستخدم؛ كل يوزر بيشوف الجزء الخاص بيه بس.",
            example: "الطالب يشوف درجاته فقط وميشوفش مرتبات الدكاترة."
          },
          {
            name: "Conceptual Level (المفاهيمي)",
            desc: "الرؤية الشاملة لكامل قاعدة البيانات؛ تجمع كل الكيانات والقيود بدون تفاصيل التخزين.",
            example: "مخطط سكيما الجامعة بالكامل بجميع الجداول."
          },
          {
            name: "Internal Level (الداخلي)",
            desc: "البنية الفيزيائية على وحدات التخزين، البلوكات، والفهارس.",
            example: "ملفات البيانات على نظام الملفات ومسارات الـ B-Tree Index."
          }
        ]
      },
      triggers: [
        { trigger: "Goal is to separate user applications from the physical database", choose: "Three-Schema Architecture" },
        { trigger: "Describes physical storage structure and access paths", choose: "Internal level" },
        { trigger: "Describes structure of whole database for a community of users, hides physical storage", choose: "Conceptual level" },
        { trigger: "Describes part of the database that a particular user group is interested in", choose: "External or view level" }
      ],
      keywords: [
        { en: "Three-Schema Architecture", ar: "معمارية المستويات الثلاثة" },
        { en: "Internal Level", ar: "المستوى الداخلي (الفيزيائي)" },
        { en: "Conceptual Level", ar: "المستوى المفاهيمي (الشامل)" },
        { en: "External / View Level", ar: "المستوى الخارجي (واجهات المستخدمين)" }
      ],
      tricks: "سؤال كلاسيكي في الميدتيرم: مين المستوى اللي بيخفي تفاصيل التخزين الفيزيائي ويركز على الكيانات والقيود لكامل المجتمع؟ الإجابة: Conceptual Level!",
      quiz: {
        question: "What is the primary goal of the three-schema architecture?",
        options: [
          "To force users to write SQL queries directly in machine code",
          "To separate user applications from the physical database",
          "To eliminate the need for primary keys in tables",
          "To combine all data into a single text file"
        ],
        correct: 1,
        explanation: "الهدف الأساسي لمعمارية المستويات الثلاثة هو فصل تطبيقات المستخدمين عن قاعدة البيانات الفيزيائية."
      }
    },
    {
      num: 19,
      title: "Three-Schema Architecture Concrete Example (Staff Record)",
      arabicTitle: "تطبيق عملي على المستويات الثلاثة (سجل الموظف Staff)",
      image: "materials/slides/db-lec3/slide_19.png",
      coreSummary: "مثال تطبيقي: مستويين خارجيين (External Views) مشتقين من المستوى المفاهيمي (Conceptual)، والمستوى الداخلي (Internal) مكتوب بـ struct C ومسارات وصول.",
      explanationIntro: "السلايد دي بتجسد المعمارية دي بمثال برمجي واقعي لسجل موظف (Staff). بص على الشاشة: المستخدم الأول شايف السن (age) مع إنه مش متخزن في الداتابيز! والمستخدم التاني شايف بيانات الفرع، والمستوى المفاهيمي جامع البيانات دي، والمستوى الداخلي مكتوب كـ C Struct مع فهارس ومؤشرات.",
      points: [
        {
          badge: "الرؤية الخارجية 1",
          title: "External View 1",
          desc: "بتعرض sNo, fName, lName, age, salary؛ وخاصية age بتتحسب تلقائياً من تاريخ الميلاد DOB."
        },
        {
          badge: "الرؤية الخارجية 2",
          title: "External View 2",
          desc: "بتعرض staffNo, lName, branchNo؛ ومحجوب عنها المرتب والسن وتاريخ الميلاد تماماً لحماية الخصوصية."
        },
        {
          badge: "المستوى المفاهيمي",
          title: "Conceptual Level",
          desc: "السجل الكامل: staffNo, fName, lName, DOB, salary, branchNo؛ كل الحقول الحقيقية مجمعة."
        },
        {
          badge: "المستوى الداخلي",
          title: "Internal Level",
          desc: "كود لغة C يوضح struct STAFF مع أحجام المصفوفات char fName[15]، مؤشر للسجل التالي struct STAFF *next، والفهارس index staffNo و index branchNo."
        }
      ],
      diagramDeconstruction: {
        title: "تفكيك مستويات معمارية سجل الموظف:",
        overview: "الرسمة بتوضح إزاي البيانات بتتحول من الرؤية الخارجية وصولاً للتخزين الفيزيائي في الذاكرة:",
        parts: [
          {
            symbol: "External View 1 (sNo, fName, lName, age, salary)",
            type: "User View",
            role: "واجهة شؤون العاملين",
            meaning: "خاصية age هي قيمة مشتقة ومحسوبة في هذه الواجهة فقط اعتماداً على DOB في المستوى المفاهيمي.",
            example: "حساب السن = السنة الحالية - تاريخ الميلاد بدون تخزين السن."
          },
          {
            symbol: "External View 2 (staffNo, lName, branchNo)",
            type: "User View",
            role: "واجهة مدير الفرع",
            meaning: "عرض مقتضب يخفي المرتب لعدم السماح لمدير الفرع بالاطلاع على الرواتب السرية.",
            example: "تحقيق مبدأ الأمان وتقييد الصلاحيات (Security & Privacy)."
          },
          {
            symbol: "Conceptual Level (staffNo, fName, lName, DOB, salary, branchNo)",
            type: "Logical Entity",
            role: "الكيان المفاهيمي الكامل",
            meaning: "يحتوي على كافة الحقول الأصلية غير المشتقة التي تمثل الموظف في النظام.",
            example: "الجدول المركزي في قاعدة البيانات."
          },
          {
            symbol: "Internal Level (struct STAFF { ... })",
            type: "Physical Storage Layout",
            role: "الهيكل التخزيني بلغة C",
            meaning: "تحديد أحجام البايتات الدقيقة ومؤشر الرابط التالي *next لترتيب السجلات وسلاسل التخزين.",
            example: "فهارس الوصول index staffNo و index branchNo للبحث فائق السرعة."
          }
        ]
      },
      triggers: [
        { trigger: "Derived field age computed in External view from DOB in Conceptual level", choose: "External/Conceptual Mapping" },
        { trigger: "struct STAFF with pointers *next and index definitions", choose: "Internal Level representation" }
      ],
      keywords: [
        { en: "User View", ar: "واجهة رؤية المستخدم" },
        { en: "Conceptual Record", ar: "السجل المفاهيمي الكامل" },
        { en: "Internal Storage Struct", ar: "الهيكل التخزيني الفيزيائي الداخلي" }
      ],
      tricks: "لاحظ إن الحقل sNo في View 1 يقابله staffNo في Conceptual Level؛ الـ DBMS بيعمل حاجة اسمها Mapping عشان يربط الاسمين ببعض بدون أي مشكلة!",
      quiz: {
        question: "In the Three-Schema concrete example (Slide 19), how is 'age' in External View 1 provided if it is NOT in the Conceptual level?",
        options: [
          "It is physically stored as an encrypted integer on the disk",
          "It is derived and computed dynamically from DOB (Date of Birth) via Mapping",
          "It is randomly generated by the operating system kernel",
          "It requires rebuilding the entire database schema daily"
        ],
        correct: 1,
        explanation: "حقل العمر age في الواجهة الخارجية يتم حسابه واشتقاقه ديناميكياً من تاريخ الميلاد DOB عبر عملية الـ Mapping بين المستويين."
      }
    },
    {
      num: 20,
      title: "Figure 2.2: The Three-Schema Architecture Diagram",
      arabicTitle: "مخطط معمارية المستويات الثلاثة والتحويلات (Figure 2.2)",
      image: "materials/slides/db-lec3/slide_20.png",
      coreSummary: "شكل 2.2: المخطط المعماري الكامل يوضح End Users في القمة، مستويات Schemas الثلاثة، وعمليات الـ Mapping الفاصلة بينها، وصولاً للديسك.",
      explanationIntro: "دي الرسمة المرجعية لمعمارية الـ Three-Schema. فوق خالص عندنا المستخدمين (End Users)، كل مجموعة ليها External View خاصة بيها. بين كل مستوى والتاني في سهمين رايحين جايين اسمهم 'Mapping' (الربط والتحويل)، وهما السر اللي بيخلي الداتابيز تشتغل بسلاسة وبحرية.",
      points: [
        {
          badge: "عناصر المخطط",
          title: "التسلسل الهرمي للمستويات",
          desc: "End Users -> External Views -> External/Conceptual Mapping -> Conceptual Schema -> Conceptual/Internal Mapping -> Internal Schema -> Stored Database."
        }
      ],
      diagramDeconstruction: {
        title: "تفكيك مخطط معمارية المستويات الثلاثة (Figure 2.2):",
        overview: "المخطط مقسم إلى 3 مستويات تفصل بينها آليات التحويل (Mappings):",
        parts: [
          {
            symbol: "End Users",
            type: "Actors",
            role: "المستخدمون النهائيون",
            meaning: "الطلاب، الموظفون، المحاسبون، والمديرون الذين يستخدمون شاشات التطبيق.",
            example: "طالب يسجل مواده من الموبايل أو موظف خزينة يستعلم عن الرسوم."
          },
          {
            symbol: "External Level (External Views)",
            type: "Schema Level",
            role: "واجهات العرض الخارجية",
            meaning: "تحديد ما يراه كل مستخدم وفقاً لصلاحياته وحاجته فقط.",
            example: "شاشة استعلام الطالب وشاشة تسجيل الدرجات للدكتور."
          },
          {
            symbol: "External/Conceptual Mapping",
            type: "Transformation Process",
            role: "الربط بين الخارجي والمفاهيمي",
            meaning: "تحويل طلبات واستعلامات المستخدم في الـ View إلى أوامر على السكيما المفاهيمية والعكس.",
            example: "تحويل استعلام 'احسب السن' لاستعلام 'اطرح DOB من سنة اليوم'."
          },
          {
            symbol: "Conceptual Level (Conceptual Schema)",
            type: "Schema Level",
            role: "المخطط المفاهيمي المركزي",
            meaning: "التصميم الموحد للبيانات بالكامل بدون أي تفاصيل تخزينية.",
            example: "جداول قاعدة البيانات وعلاقاتها في لغة SQL."
          },
          {
            symbol: "Conceptual/Internal Mapping",
            type: "Transformation Process",
            role: "الربط بين المفاهيمي والفيزيائي",
            meaning: "تحويل عمليات الجداول إلى عمليات قراءة وكتابة لملفات وبلوكات وسجلات الهارد ديسك.",
            example: "تحديد أي بلوك على الديسك وأي فهرس سيتم استخدامه لقراءة سجل الطالب."
          },
          {
            symbol: "Internal Level (Internal Schema)",
            type: "Schema Level",
            role: "المخطط الداخلي التخزيني",
            meaning: "وصف مسارات الوصول والفهارس والتوزيع الفيزيائي.",
            example: "طريقة تخزين السجلات في ملفات متتابعة أو مفهرسة بالـ B-Trees."
          },
          {
            symbol: "Stored Database",
            type: "Physical Storage (Cylinders)",
            role: "قاعدة البيانات المخزنة",
            meaning: "الملفات والبيانات الثنائية المسجلة فعلياً على الأقراص الصلبة ووحدات التخزين.",
            example: "أقراص SSD ومصفوفات الـ RAID في الداتا سنتر."
          }
        ]
      },
      triggers: [
        { trigger: "Figure 2.2 with End Users at top and Stored Database cylinders at bottom", choose: "Three-Schema Architecture diagram" },
        { trigger: "Mapping between External views and Conceptual schema", choose: "External/Conceptual Mapping" },
        { trigger: "Mapping between Conceptual schema and Internal schema", choose: "Conceptual/Internal Mapping" }
      ],
      keywords: [
        { en: "Mappings", ar: "عمليات الربط والتحويل بين المستويات" },
        { en: "Stored Database", ar: "قاعدة البيانات المخزنة فيزيائياً" },
        { en: "Conceptual/Internal Mapping", ar: "الربط المفاهيمي/الداخلي" }
      ],
      tricks: "ركز: عمليتا الـ Mapping هما المسؤولتان عن تحقيق استقلالية البيانات (Data Independence)! لو السؤال سألك إزاي النظام بيحول الطلبات من مستوى للتاني، الإجابة هي Mappings.",
      quiz: {
        question: "In the Three-Schema Architecture diagram (Figure 2.2), what connects the Conceptual Schema to the Internal Schema?",
        options: [
          "External/Conceptual Mapping",
          "Conceptual/Internal Mapping",
          "A dumb terminal network card",
          "A compiler source file"
        ],
        correct: 1,
        explanation: "الربط والتحويل المفاهيمي/الداخلي (Conceptual/Internal Mapping) هو المسؤول عن الربط بين المخطط المفاهيمي والمخطط الداخلي."
      }
    },
    {
      num: 21,
      title: "Three-Schema Architecture Mappings",
      arabicTitle: "عمليات التحويل والربط بين مستويات المعمارية (Schema Mappings)",
      image: "materials/slides/db-lec3/slide_21.png",
      coreSummary: "الـ Mappings مطلوبة لتحويل الطلبات والبيانات بين المستويات، وإعادة تشكيل البيانات المستخرجة من الديسك لتناسب واجهة المستخدم.",
      explanationIntro: "السلايد دي بتوضح دور الـ Mappings بالتفصيل؛ البرامج والتطبيقات بتتعامل مع الـ External Schema، ولما يبعتوا استعلام، الـ DBMS بيقوم محوله ومترجمه لـ Internal Schema علشان يتنفذ على الديسك. وبعد ما الداتا تطلع من الديسك كـ Raw bytes، بيعيد تشكيلها (Reformatting) ويعرضها للمستخدم في صفحة ويب منسقة.",
      points: [
        {
          badge: "تحويل الطلبات",
          title: "Transform Requests & Data",
          desc: "عمليات الـ Mappings مطلوبة لتحويل الاستعلامات والبيانات من مستوى لمستوى أعلى أو أدنى."
        },
        {
          badge: "تنفيذ البرامج",
          title: "Execution via Internal Schema",
          desc: "البرامج تشير للـ External Schema، والـ DBMS هو اللي بيعمل Mapping للـ Internal Schema للتنفيذ الفعلي."
        },
        {
          badge: "إعادة التشكيل",
          title: "Data Reformatting",
          desc: "البيانات المستخرجة من المستوى الداخلي يعاد تشكيلها لتطابق واجهة المستخدم (زي تنسيق نتائج استعلام SQL لعرضها في جدول على صفحة ويب)."
        }
      ],
      triggers: [
        { trigger: "Needed to transform requests and data among schema levels", choose: "Mappings" },
        { trigger: "Formatting the results of an SQL query for display in a Web page", choose: "Data Reformatting via Mappings" }
      ],
      keywords: [
        { en: "Mappings", ar: "عمليات التحويل والربط" },
        { en: "Reformatted", ar: "إعادة تشكيل وتنسيق البيانات" },
        { en: "External View Display", ar: "عرض واجهة المستخدم" }
      ],
      tricks: "المثال الموجود بالسلايد: formatting SQL query results for display in a Web page هو مثال صريح لعملية Reformatting اللي بيعملها الـ DBMS للـ Data المأخوذة من الـ Internal level.",
      quiz: {
        question: "Why are mappings needed among schema levels in a DBMS?",
        options: [
          "To permanently prevent any data from being updated",
          "To transform requests and data between external, conceptual, and internal levels",
          "To force all users to share the exact same screen layout",
          "To replace computer memory with magnetic tape"
        ],
        correct: 1,
        explanation: "عمليات الـ Mappings ضرورية لتحويل الطلبات والبيانات بين مستويات السكيما المختلفة وإعادة تشكيل النتائج للمستخدم."
      }
    },
    {
      num: 22,
      title: "Data Independence (Logical vs. Physical)",
      arabicTitle: "استقلالية البيانات (Logical Data Independence vs Physical Data Independence)",
      image: "materials/slides/db-lec3/slide_22.png",
      coreSummary: "استقلالية البيانات تعني تغيير السكيما في مستوى دون الحاجة لتغيير المستوى الأعلى منه؛ وتنقسم إلى استقلالية منطقية واستقلالية فيزيائية.",
      explanationIntro: "أحد أعظم إنجازات معمارية الـ Three-Schema هو 'Data Independence'. في الأنظمة القديمة، لو غيرت نوع حقل أو ضفت فهرس، كان لازم تعيد برمجة كل التطبيقات من أول وجديد! مع استقلالية البيانات، تقدر تعدل تحت براحتك والطبقات اللي فوق متتأثرش.",
      points: [
        {
          badge: "تعريف Data Independence",
          title: "القدرة على التغيير دون تأثير",
          desc: "القدرة على تغيير السكيما في مستوى معين من نظام قاعدة البيانات دون الاضطرار لتغيير السكيما في المستوى الأعلى التالي."
        },
        {
          badge: "1. Logical Data Independence",
          title: "استقلالية البيانات المنطقية",
          desc: "القدرة على تغيير الـ Conceptual Schema (زي إضافة جدول أو عمود) دون الحاجة لتغيير الـ External Schemas أو البرامج والتطبيقات."
        },
        {
          badge: "2. Physical Data Independence",
          title: "استقلالية البيانات الفيزيائية",
          desc: "القدرة على تغيير الـ Internal Schema (زي تغيير الهارد، إضافة فهارس، أو إعادة تنظيم الملفات) دون الحاجة لتغيير الـ Conceptual Schema أو الـ External Schemas."
        }
      ],
      comparison: {
        title: "المقارنة التاريخية في الامتحانات: Logical vs. Physical Data Independence",
        items: [
          {
            name: "Logical Data Independence",
            desc: "تغيير في المستوى المفاهيمي (Conceptual) دون المساس بالخارجي (External). أصعب في التحقيق وأقل شيوعاً.",
            example: "إضافة جدول جديد اسمه ALUMNI للجامعة، البرامج القديمة الخاصة بتسجيل الطلاب الحاليين تفضل شغالة طبيعي."
          },
          {
            name: "Physical Data Independence",
            desc: "تغيير في المستوى الداخلي (Internal) دون المساس بالمفاهيمي (Conceptual). أسهل بكثير في التحقيق وشائعة جداً.",
            example: "نقل قاعدة البيانات من HDD عادي إلى SSD فائق السرعة وبناء B-Tree Index جديد؛ كود الـ SQL وتطبيقات المستخدم لن تتغير بحرف واحد."
          }
        ]
      },
      triggers: [
        { trigger: "Capacity to change conceptual schema without changing external schemas or programs", choose: "Logical data independence" },
        { trigger: "Capacity to change internal schema without changing conceptual schema", choose: "Physical data independence" },
        { trigger: "Capacity to change schema at one level without changing the next higher level", choose: "Data independence" }
      ],
      keywords: [
        { en: "Data Independence", ar: "استقلالية البيانات" },
        { en: "Logical Data Independence", ar: "استقلالية البيانات المنطقية" },
        { en: "Physical Data Independence", ar: "استقلالية البيانات الفيزيائية" }
      ],
      tricks: "تريكة امتحانات سنوية: مين فيهم أسهل في التحقيق وموجود في كل الـ DBMSs؟ الإجابة: Physical Data Independence! المنطقية أصعب لأن تعديل الجداول أحياناً بياثر على الواجهات المرتبطة بيها.",
      quiz: {
        question: "What is 'Logical Data Independence'?",
        options: [
          "The capacity to change the internal storage devices without rebooting the server",
          "The capacity to change the conceptual schema without having to change external schemas or application programs",
          "The ability of users to query databases without using SQL",
          "The process of backing up files to the cloud automatically"
        ],
        correct: 1,
        explanation: "استقلالية البيانات المنطقية (Logical Data Independence) هي القدرة على تعديل المخطط المفاهيمي دون الاضطرار لتعديل المخططات الخارجية أو البرامج التطبيقية."
      }
    },
    {
      num: 23,
      title: "DBMS Languages (DDL, SDL, VDL, DML)",
      arabicTitle: "لغات نظم قواعد البيانات وتصنيفاتها (DDL, SDL, VDL, DML)",
      image: "materials/slides/db-lec3/slide_23.png",
      coreSummary: "لغات الـ DBMS: لغة تعريف البيانات (DDL)، لغة تعريف التخزين (SDL)، لغة تعريف الواجهات (VDL)، ولغة معالجة البيانات (DML).",
      explanationIntro: "علشان نتعامل مع المستويات دي كلها، بنحتاج لغات متخصصة. في النظري، في 4 لغات مستقلة لكل وظيفة: لغة للتعريف، لغة للتخزين، لغة لواجهات المستخدمين، ولغة لإدخال واسترجاع البيانات. في الأنظمة الحديثة لغة SQL جمعت معظم اللغات دي في لغة واحدة.",
      points: [
        {
          badge: "DDL (Data Definition)",
          title: "لغة تعريف البيانات",
          desc: "تُستخدم لتعريف وتوصيف كلا من السكيما المفاهيمية والداخلية (Defines both schemas)."
        },
        {
          badge: "SDL (Storage Definition)",
          title: "لغة تعريف التخزين",
          desc: "تُستخدم لتحديد وضبط المستوى التخزيني الداخلي (Specifies the internal schema)."
        },
        {
          badge: "VDL (View Definition)",
          title: "لغة تعريف واجهات العرض",
          desc: "تُستخدم لتحديد رؤى وواجهات المستخدمين وعمليات ربطها بالسكيما المفاهيمية (Specifies user views/mappings)."
        },
        {
          badge: "DML (Data Manipulation)",
          title: "لغة معالجة البيانات",
          desc: "تُستخدم للعمليات اليومية على البيانات: الاسترجاع (Retrieval)، الإدخال (Insertion)، الحذف (Deletion)، والتعديل (Modification)."
        }
      ],
      comparison: {
        title: "مقارنة لغات الـ DBMS الأربعة",
        items: [
          {
            name: "DDL (Definition)",
            desc: "تنشئ الهيكل والجداول والقيود.",
            example: "أوامر CREATE TABLE و ALTER TABLE في SQL."
          },
          {
            name: "DML (Manipulation)",
            desc: "تتعامل مع السجلات والبيانات بالداخل.",
            example: "أوامر SELECT و INSERT و UPDATE و DELETE في SQL."
          }
        ]
      },
      triggers: [
        { trigger: "Specifies the internal schema", choose: "SDL (Storage Definition Language)" },
        { trigger: "Specifies user views and their mappings to conceptual schema", choose: "VDL (View Definition Language)" },
        { trigger: "Allows retrieval, insertion, deletion, modification", choose: "DML (Data Manipulation Language)" },
        { trigger: "Defines both conceptual and internal schemas", choose: "DDL (Data Definition Language)" }
      ],
      keywords: [
        { en: "DDL", ar: "لغة تعريف البيانات (Data Definition Language)" },
        { en: "SDL", ar: "لغة تعريف التخزين (Storage Definition Language)" },
        { en: "VDL", ar: "لغة تعريف واجهات العرض (View Definition Language)" },
        { en: "DML", ar: "لغة معالجة البيانات (Data Manipulation Language)" }
      ],
      tricks: "ركز في الحروف الأولى: DDL = Definition (هيكل) | DML = Manipulation (بيانات وعمليات) | SDL = Storage (تخزين داخلي) | VDL = Views (واجهات مستخدمين)!",
      quiz: {
        question: "Which DBMS language is responsible for data retrieval, insertion, deletion, and modification?",
        options: [
          "DDL (Data Definition Language)",
          "SDL (Storage Definition Language)",
          "DML (Data Manipulation Language)",
          "VDL (View Definition Language)"
        ],
        correct: 2,
        explanation: "لغة معالجة البيانات DML (Data Manipulation Language) هي المسؤولة عن عمليات الاسترجاع والإدخال والحذف والتعديل."
      }
    },
    {
      num: 24,
      title: "Centralized and Client/Server Architectures for DBMSs",
      arabicTitle: "المعمارية المركزية لنظم قواعد البيانات (Centralized DBMS Architecture)",
      image: "materials/slides/db-lec3/slide_24.png",
      coreSummary: "في المعمارية المركزية (Centralized)، كل وظائف الـ DBMS وتنفيذ البرامج ومعالجة واجهات المستخدمين بتتم بالكامل على جهاز واحد ضخم (Mainframe).",
      explanationIntro: "دلوقتي بننتقل للمحور الأخير في المحاضرة: البنية الفيزيائية وتوزيع الأجهزة (System Architectures). زمان في الستينات والسبعينات مكنش في كمبيوتر شخصي (PC) على مكاتب الناس؛ كان في جهاز عملاق واحد في الشركة (Mainframe) وكل الناس متصلين بيه بشاشات صماء. دي هي 'Centralized Architecture'.",
      points: [
        {
          badge: "المعمارية المركزية",
          title: "كل شيء على جهاز واحد",
          desc: "All DBMS functionality, application program execution, and user interface processing carried out on one single machine."
        },
        {
          badge: "طريقة الاستخدام",
          title: "Dumb Terminals",
          desc: "المستخدمون يتصلون عبر شاشات عرض ولوحات مفاتيح فقط بدون معالج أو هارد ديسك خاص بهم، وكل الحسابات بتتم على السيرفر المركزي."
        }
      ],
      triggers: [
        { trigger: "All DBMS functionality, applications, and UI carried out on one machine", choose: "Centralized DBMS Architecture" }
      ],
      keywords: [
        { en: "Centralized Architecture", ar: "المعمارية المركزية" },
        { en: "One machine execution", ar: "التنفيذ على جهاز واحد" },
        { en: "Terminals", ar: "الشاشات الطرفية" }
      ],
      tricks: "المعمارية المركزية مفيهاش أي معالجة محلية على جهاز العميل؛ كل حاجة (الـ UI، التطبيق، الداتابيز، والكومبايلر) شغالة على السيرفر المركزي بس.",
      quiz: {
        question: "In a Centralized DBMS Architecture, where are the application programs and DBMS functionality executed?",
        options: [
          "Distributed across thousands of edge client smartphones",
          "Carried out entirely on one central machine",
          "On local GPU graphics chips exclusively",
          "On printer spooler processors"
        ],
        correct: 1,
        explanation: "في المعمارية المركزية، يتم تنفيذ كافة وظائف الـ DBMS والبرامج التطبيقية ومعالجة الواجهات على جهاز مركزي واحد."
      }
    },
    {
      num: 25,
      title: "Figure 2.4: A Physical Centralized Architecture",
      arabicTitle: "مخطط المعمارية المركزية المادية (Figure 2.4)",
      image: "materials/slides/db-lec3/slide_25.png",
      coreSummary: "شكل 2.4: المخطط المادي للمركزية يوضح شاشات العرض (Terminals) متصلة عبر شبكة بصندوق النظام المركزي الحاوي للسوفت وير والهاردوير.",
      explanationIntro: "ده الرسم التوضيحي للمعمارية المركزية (Figure 2.4). بص على الرسمة: فوق خالص في شاشات عرض ومونيتورز (Terminals)، متصلة بشبكة بتوصل للصندوق الكبير اللي جواه كل حاجة: السوفت وير (التطبيقات والـ DBMS والكومبايلر)، ونظام التشغيل، ومكونات الهاردوير (الـ CPU والميموري والديسك).",
      points: [
        {
          badge: "محتويات الرسمة",
          title: "الطبقات الثلاث داخل الصندوق المركزي",
          desc: "Software Layer -> Operating System Layer -> Hardware/Firmware Layer."
        }
      ],
      diagramDeconstruction: {
        title: "تفكيك مخطط المعمارية المركزية المادية (Figure 2.4):",
        overview: "كل الأجهزة الخارجية مجرد وحدات عرض، بينما القلب النابض كله مجمع داخل السيرفر المركزي:",
        parts: [
          {
            symbol: "Terminals (Display Monitors)",
            type: "Dumb Terminal",
            role: "أجهزة العرض الطرفية",
            meaning: "أجهزة مخصصة لعرض النصوص واستقبال مدخلات الكيبورد فقط بدون معالجة محلية.",
            example: "شاشة شباك حجز التذاكر في السبعينات."
          },
          {
            symbol: "Software Compartment",
            type: "Application & System Software",
            role: "حزمة البرمجيات المركزية",
            meaning: "تجمع Application Programs, Terminal Display Control, Text Editors, DBMS, Compilers في نفس الجهاز.",
            example: "كل المبرمجين والمستخدمين يشاركون نفس النسخة من الـ DBMS ومحرر النصوص."
          },
          {
            symbol: "Operating System",
            type: "System Kernel",
            role: "نظام التشغيل المركزي",
            meaning: "يدير تعدد المهام والوصول للموارد بين كافة المستخدمين المتصلين.",
            example: "أنظمة تشغيل Mainframes زي IBM z/OS."
          },
          {
            symbol: "Hardware/Firmware",
            type: "Central Physical Components",
            role: "العتاد المادي الموحد",
            meaning: "يحتوي على System Bus يربط CPU, Memory, Disk, Controllers, I/O Devices.",
            example: "المعالج المركزي والذاكرة المشتركة بين الجميع."
          }
        ]
      },
      triggers: [
        { trigger: "Figure 2.4 with Terminals connected to Software, OS, and Hardware layers in one box", choose: "Physical centralized architecture" }
      ],
      keywords: [
        { en: "Centralized Hardware", ar: "العتاد المركزي" },
        { en: "Terminal Display Control", ar: "التحكم في شاشات العرض" },
        { en: "System Bus", ar: "ناقل النظام المركزي" }
      ],
      tricks: "لاحظ إن المونيتورز متصلة بالسيرفر عشان تاخد منه Display Control؛ مفيش كارت شاشة بيعالج جرافيكس محلياً على جهاز اليوزر!",
      quiz: {
        question: "In Figure 2.4 (Physical Centralized Architecture), which layer directly contains the DBMS and Compilers?",
        options: [
          "The Display Monitor Hardware",
          "The Software layer inside the central machine",
          "The System Bus",
          "The Physical Tape Drive"
        ],
        correct: 1,
        explanation: "طبقة البرمجيات (Software layer) داخل الجهاز المركزي هي التي تحتوي على الـ DBMS والـ Compilers وبرامج التطبيقات."
      }
    },
    {
      num: 26,
      title: "Basic Client/Server Architectures - Specialized Servers",
      arabicTitle: "معمارية العميل والخادم والخوادم المتخصصة (File, Printer, Web Servers)",
      image: "materials/slides/db-lec3/slide_26.png",
      coreSummary: "مع ظهور الشبكات والكمبيوتر الشخصي، تم توزيع المهام على خوادم متخصصة: خادم ملفات، خادم طباعة، وخوادم بريد وويب.",
      explanationIntro: "مع تطور التكنولوجيا في الثمانينات، بدأ يظهر الكمبيوتر الشخصي والشبكات المحلية (LAN). ظهرت فكرة: بدل ما جهاز واحد يعمل كل حاجة، ليه منقسمش الشغل؟ نعمل سيرفر مخصص بس للملفات (File server)، وسيرفر مخصص للطابعات (Printer server)، وسيرفر للويب والإيميل. وده كان بداية عصر الـ Client/Server.",
      points: [
        {
          badge: "File Server",
          title: "خادم الملفات",
          desc: "مسؤول عن حفظ وإدارة وتأمين ملفات أجهزة العملاء على الشبكة (Maintains the files of the client machines)."
        },
        {
          badge: "Printer Server",
          title: "خادم الطباعة",
          desc: "متصل بطابعات متعددة؛ ويستقبل جميع طلبات الطباعة من أجهزة العملاء ويرتبها في طوابير للتنفيذ."
        },
        {
          badge: "Web / Email Servers",
          title: "خوادم الويب والبريد الإلكتروني",
          desc: "خوادم متخصصة في خدمة صفحات الإنترنت وتوصيل وإرسال الرسائل الإلكترونية."
        }
      ],
      triggers: [
        { trigger: "Maintains the files of the client machines", choose: "File server" },
        { trigger: "Connected to various printers and forwards print requests", choose: "Printer server" }
      ],
      keywords: [
        { en: "File Server", ar: "خادم الملفات" },
        { en: "Printer Server", ar: "خادم الطابعات" },
        { en: "Client/Server Architecture", ar: "معمارية العميل والخادم" }
      ],
      tricks: "الخوادم دي متخصصة في وظائف محددة وليست عامة؛ ده فرق جوهري عن السيرفر المركزي اللي كان بيعمل كل حاجة في السلايد السابقة.",
      quiz: {
        question: "What is the primary role of a 'Printer Server' in a basic client/server architecture?",
        options: [
          "Compiling C++ code for clients",
          "Connecting to various printers and handling all client print requests",
          "Executing SQL database transaction commits",
          "Storing database schema definitions"
        ],
        correct: 1,
        explanation: "خادم الطباعة (Printer server) يتصل بمختلف الطابعات ويستقبل ويعالج كافة طلبات الطباعة الواردة من أجهزة العملاء."
      }
    },
    {
      num: 27,
      title: "Basic Client/Server Architectures - Client Machines",
      arabicTitle: "أجهزة العملاء وإمكانيات المعالجة المحلية (Client Machines)",
      image: "materials/slides/db-lec3/slide_27.png",
      coreSummary: "أجهزة العميل توفر للمستخدم واجهات تفاعلية ملائمة وقدرة معالجة محلية (Local processing power) لتشغيل البرامج محلياً.",
      explanationIntro: "طب إيه اللي اتغير في أجهزة العملاء (Client machines)؟ مابقتش مجرد شاشة صماء زي زمان! العميل دلوقتي بقى عنده كمبيوتر حقيقي فيه بروسيسور ورامات وهارد ديسك خاص بيه؛ بيشغل برامج محلياً، وبيعرض واجهات رسومية (GUI) سهلة وملونة، ويطلب من السيرفر الخدمة بس لما يحتاجها.",
      points: [
        {
          badge: "1. واجهات مناسبة",
          title: "Appropriate Interfaces",
          desc: "توفير واجهات رسومية ملائمة ومريحة للمستخدم للاستفادة من خدمات الخوادم المختلفة."
        },
        {
          badge: "2. قوة معالجة محلية",
          title: "Local Processing Power",
          desc: "امتلاك قدرة حوسبية محلية لتشغيل التطبيقات والبرامج على جهاز العميل دون تحميل السيرفر كل شيء."
        }
      ],
      triggers: [
        { trigger: "Provide user with interfaces and local processing power to run local applications", choose: "Client machines" }
      ],
      keywords: [
        { en: "Client machines", ar: "أجهزة العميل" },
        { en: "Local processing power", ar: "قوة المعالجة المحلية" },
        { en: "Appropriate interfaces", ar: "الواجهات الرسومية المناسبة" }
      ],
      tricks: "الميزة الكبرى هنا هي 'Local processing power'؛ ده المفهوم اللي نقل الحوسبة من Mainframe بيتحمل كل الضغط إلى توزيع الجهد على أجهزة الموظفين.",
      quiz: {
        question: "In modern client/server setups, what do client machines provide to the user?",
        options: [
          "Only a dumb screen with no CPU",
          "Appropriate interfaces and local processing power to run local applications",
          "A direct magnetic connection to the disk platters",
          "Permanent replacement for all servers"
        ],
        correct: 1,
        explanation: "أجهزة العميل توفر واجهات ملائمة وقوة معالجة محلية (Local processing power) لتشغيل التطبيقات المحلية."
      }
    },
    {
      num: 28,
      title: "Figures 2.5 & 2.6: Logical & Physical Two-Tier Client/Server Architecture",
      arabicTitle: "المخطط المنطقي والمادي للمعمارية ثنائية الطبقات (Figures 2.5 & 2.6)",
      image: "materials/slides/db-lec3/slide_28.png",
      coreSummary: "شكل 2.5 يوضح الربط المنطقي للعملاء بالخوادم عبر شبكة، وشكل 2.6 يوضح التوزيع المادي: عميل بدون ديسك، عميل بديسك، وسيرفر بديسك.",
      explanationIntro: "السلايد دي بتعرض رسمتين مهمين جداً في كتاب Elmasri: رسمة 2.5 بتوضح المعمارية منطقياً (العملاء متصلين عبر Network بـ Print Server و File Server و DBMS Server). ورسمة 2.6 بتوضح أنواع المواقع المادية (Sites) على الشبكة: موقع 1 عميل بدون ديسك (Diskless)، موقع 2 عميل مع ديسك، موقع 3 سيرفر، وموقع n سيرفر وعميل معاً.",
      points: [
        {
          badge: "Figure 2.5",
          title: "المعمارية المنطقية (Logical)",
          desc: "توزيع الخدمات منطقياً بين أجهزة العملاء والخوادم المتخصصة عبر شبكة اتصال مشتركة."
        },
        {
          badge: "Figure 2.6",
          title: "المعمارية المادية (Physical)",
          desc: "تصنيف الأجهزة المادية المرتبطة بالشبكة حسب امتلاكها لأقراص صلبة ودورها كخادم أو عميل."
        }
      ],
      diagramDeconstruction: {
        title: "تفكيك مخطط المعمارية المادية ثنائية الطبقات (Figure 2.6):",
        overview: "كل موقع (Site) على شبكة الاتصال يمثل نوعاً متميزاً من الأجهزة:",
        parts: [
          {
            symbol: "Site 1: Diskless Client",
            type: "Network Boot Client",
            role: "عميل بدون قرص صلب",
            meaning: "جهاز يحتوي على معالج وذاكرة لكن بدون هارد ديسك؛ يعتمد كلياً على الشبكة للإقلاع وتحميل البرامج.",
            example: "أجهزة معامل الاختبارات أو أجهزة الكول سنتر المؤمنة لمنع نسخ البيانات."
          },
          {
            symbol: "Site 2: Client with Disk",
            type: "Thick / Standard Client",
            role: "عميل مزود بقرص صلب",
            meaning: "كمبيوتر شخصي متكامل يحتوي على هارد ديسك خاص به لتخزين نظام التشغيل والتطبيقات المحلية.",
            example: "لابتوب الموظف في مكتبه."
          },
          {
            symbol: "Site 3: Server",
            type: "Dedicated Server with Disk",
            role: "خادم مخصص مع قرص صلب",
            meaning: "سيرفر قوي مخصص لتقديم خدمات الداتابيز أو الملفات دون استخدام واجهة مستخدم محلية.",
            example: "سيرفر الـ SQL Server المركزي في غرفة الخوادم."
          },
          {
            symbol: "Site n: Server and Client",
            type: "Hybrid / Peer Node",
            role: "خادم وعميل مدمج في جهاز واحد",
            meaning: "جهاز يلعب الدورين في نفس الوقت: يخدم مستخدمه المحلي ويقدم خدمات لأجهزة أخرى على الشبكة.",
            example: "جهاز مشرف الفرع الذي يشغل برنامج الكاشير ويشارك الطابعة مع زملائه."
          }
        ]
      },
      triggers: [
        { trigger: "Site 1 in Figure 2.6", choose: "Diskless Client" },
        { trigger: "Site 2 in Figure 2.6", choose: "Client with Disk" },
        { trigger: "Site 3 in Figure 2.6", choose: "Server with Disk" },
        { trigger: "Site n in Figure 2.6", choose: "Server and Client" }
      ],
      keywords: [
        { en: "Diskless Client", ar: "عميل بدون قرص صلب" },
        { en: "Client with Disk", ar: "عميل مزود بقرص صلب" },
        { en: "Communication Network", ar: "شبكة الاتصالات" }
      ],
      tricks: "ركز في الرسمة 2.6: الموقع 1 (Site 1) صندوقه فاضي من فوق ومفيهوش أسطوانة الديسك، عشان كده اسمه 'Diskless Client'!",
      quiz: {
        question: "In Figure 2.6 of the physical two-tier architecture, what is Site 1 characterized as?",
        options: [
          "A Server with multiple redundant disks",
          "A Diskless Client",
          "A Central Mainframe",
          "A Web Cache Proxy"
        ],
        correct: 1,
        explanation: "الموقع 1 (Site 1) في الشكل 2.6 هو عميل بدون قرص صلب (Diskless Client)."
      }
    },
    {
      num: 29,
      title: "Basic Client/Server Architectures - Client vs. Server Definition",
      arabicTitle: "تعريف دور العميل ودور الخادم (Client vs Server Roles)",
      image: "materials/slides/db-lec3/slide_29.png",
      coreSummary: "العميل هو جهاز المستخدم لتوفير الواجهات والمعالجة المحلية، والسيرفر نظام يوفر خدمات مركزية (ملفات، طباعة، داتابيز) للعملاء.",
      explanationIntro: "السلايد دي بتضع التعريف الحاسم والمحدد لمفهومي 'العميل' (Client) و 'الخادم' (Server). مهم تفهم إن السيرفر مش مجرد جهاز كمبيوتر هاردوير؛ السيرفر هو نظام متكامل من الهاردوير والسوفت وير بيشتغلوا مع بعض لتقديم خدمات مشتركة للعملاء.",
      points: [
        {
          badge: "تعريف Client",
          title: "جهاز المستخدم (User Machine)",
          desc: "يوفر إمكانيات واجهة المستخدم (User interface capabilities) والمعالجة المحلية للبيانات."
        },
        {
          badge: "تعريف Server",
          title: "نظام تقديم الخدمات (System)",
          desc: "نظام يحتوي على عتاد مادي وبرمجيات (Both hardware and software) يقدم خدمات مركزية لأجهزة العملاء زي: الوصول للملفات، الطباعة، الأرشفة، والوصول لقواعد البيانات."
        }
      ],
      comparison: {
        title: "العميل (Client) مقابل الخادم (Server)",
        items: [
          {
            name: "Client (العميل)",
            desc: "طالب الخدمة، يركز على العرض والتفاعل ومعالجة إدخالات المستخدم محلياً.",
            example: "المتصفح أو برنامج المحاسبة المثبت على كمبيوتر المحاسب."
          },
          {
            name: "Server (الخادم)",
            desc: "مقدم الخدمة، يركز على تخزين البيانات، إدارة الصلاحيات، ومعالجة الاستعلامات.",
            example: "جهاز سيرفر Oracle أو SQL Server."
          }
        ]
      },
      triggers: [
        { trigger: "User machine that provides user interface capabilities and local processing", choose: "Client" },
        { trigger: "System containing both hardware and software provides services to client machines", choose: "Server" },
        { trigger: "Services like file access, printing, archiving, or database access", choose: "Server functionalities" }
      ],
      keywords: [
        { en: "Client", ar: "العميل (جهاز المستخدم والواجهات)" },
        { en: "Server", ar: "الخادم (نظام الهاردوير والسوفت وير لتقديم الخدمات)" },
        { en: "Shared Services", ar: "الخدمات المشتركة" }
      ],
      tricks: "ركز في تعريف السيرفر: 'System containing BOTH hardware and software'؛ لو جاب لك في صح وغلط إن السيرفر هاردوير بس تبقى غلط فوراً!",
      quiz: {
        question: "According to the slides, what is a 'Server' defined as?",
        options: [
          "A hardware monitor only with no CPU",
          "A system containing both hardware and software that provides services to client machines",
          "A single SQL statement executed in memory",
          "An external view with no underlying tables"
        ],
        correct: 1,
        explanation: "الخادم (Server) هو نظام متكامل يحتوي على عتاد مادي وبرمجيات يقدم خدمات مشتركة لأجهزة العملاء."
      }
    },
    {
      num: 30,
      title: "Two-Tier Client/Server Architectures for DBMSs",
      arabicTitle: "المعمارية ثنائية الطبقات في قواعد البيانات (2-Tier Architecture)",
      image: "materials/slides/db-lec3/slide_30.png",
      coreSummary: "في معمارية الـ 2-Tier: السيرفر ينفذ استعلامات ومعاملات SQL، والعميل يشغل واجهات المستخدم وبرامج التطبيقات.",
      explanationIntro: "تعال نشوف معمارية الـ Two-Tier (الطبقتين) الخاصة بالـ DBMS. النظام هنا مقسوم نصين بالضبط: النص الأول عند العميل (Client) اللي بيشغل واجهة المستخدم وبرامج التطبيق (زي شاشات إدخال البيانات)، والنص التاني عند السيرفر (Server) اللي بيستقبل أوامر الـ SQL وينفذها ويدير المعاملات (Transactions) والتخزين.",
      points: [
        {
          badge: "مسؤولية السيرفر",
          title: "Server handles SQL & Transactions",
          desc: "الخادم مسؤول عن: تنفيذ الاستعلامات (Query processing)، إدارة المعاملات (Transactions)، وتنفيذ لغة SQL وإرجاع النتائج."
        },
        {
          badge: "مسؤولية العميل",
          title: "Client handles UI & Application",
          desc: "العميل مسؤول عن: برامج واجهة المستخدم (User interface programs)، شاشات الإدخال، وبرامج منطق التطبيق (Application programs)."
        }
      ],
      comparison: {
        title: "توزيع المسؤوليات في معمارية الـ Two-Tier",
        items: [
          {
            name: "جانب العميل (Client Tier)",
            desc: "User interface programs & Application programs (العرض ومنطق التطبيق المباشر).",
            example: "برنامج ديسكتوب (Desktop App) مكتوب بـ C# أو Java يتصل مباشرة بالداتابيز عبر ODBC."
          },
          {
            name: "جانب الخادم (Server Tier)",
            desc: "Query and transaction functionality related to SQL processing (المعالجة والـ SQL).",
            example: "سيرفر SQL Server يستقبل استعلام SELECT وينفذه ويعيد البيانات."
          }
        ]
      },
      triggers: [
        { trigger: "Server handles query and transaction functionality related to SQL processing", choose: "Two-Tier Architecture" },
        { trigger: "Client handles user interface programs and application programs", choose: "Two-Tier Architecture" }
      ],
      keywords: [
        { en: "Two-Tier Architecture", ar: "المعمارية ثنائية الطبقات" },
        { en: "SQL processing", ar: "معالجة لغة الاستعلامات SQL" },
        { en: "Transaction functionality", ar: "إدارة العمليات والمعاملات" }
      ],
      tricks: "عيب الـ 2-Tier إن العميل بيشيل الـ Application programs كاملة فبيتسمى (Fat Client / Thick Client)، ولازم كل جهاز عميل يتثبت عليه تعريف اتصال زي ODBC أو JDBC!",
      quiz: {
        question: "In a Two-Tier Client/Server Architecture for DBMSs, what does the Server specifically handle?",
        options: [
          "Rendering the local desktop GUI widgets",
          "Query and transaction functionality related to SQL processing",
          "Display monitor cathode-ray timing",
          "Physical keyboard key press scanning"
        ],
        correct: 1,
        explanation: "في معمارية الـ Two-Tier، يتولى الخادم مسؤولية معالجة الاستعلامات وإدارة المعاملات وتنفيذ الـ SQL."
      }
    },
    {
      num: 31,
      title: "Three-Tier and n-Tier Architectures for Web Applications",
      arabicTitle: "المعمارية ثلاثية الطبقات والويب (3-Tier & n-Tier Web Architecture)",
      image: "materials/slides/db-lec3/slide_31.png",
      coreSummary: "المعمارية ثلاثية الطبقات تضيف طبقة وسيطة (Application/Web Server) بين العميل والداتابيز لتشغيل برامج التطبيق وتخزين قواعد العمل (Business rules).",
      explanationIntro: "مع ظهور الويب والمواقع العملاقة، الـ 2-Tier مبقتش تنفع؛ مينفعش كل مستخدم يفتح المتصفح يروح يكلم الداتابيز دايركت ويسحب السيرفر كله أو يشوف الباسوردات! هنا ظهرت 'Three-Tier Architecture'. حطينا طبقة وسيطة في النص اسمها 'Application Server' أو 'Web Server'؛ المتصفح بيكلم السيرفر الوسيط، والسيرفر الوسيط هو اللي بيطبق قواعد العمل (Business rules) ويكلم الداتابيز.",
      points: [
        {
          badge: "الطبقة الوسيطة",
          title: "Application Server or Web Server",
          desc: "إضافة طبقة متوسطة تفصل تماماً بين العميل وخادم قاعدة البيانات (Intermediate layer between client and database server)."
        },
        {
          badge: "قواعد العمل",
          title: "Runs Application & Stores Business Rules",
          desc: "الطبقة الوسطى تشغل البرامج التطبيقية وتخزن وتنفذ قواعد العمل (Business rules) زي التأكد من صلاحية العميل وتوافر الرصيد."
        },
        {
          badge: "N-Tier Architecture",
          title: "المعمارية متعددة الطبقات",
          desc: "تقسيم الطبقات بين المستخدم والبيانات إلى مكونات أدق وأصغر (Finer components) زي طبقة أمان، طبقة كاش، وطبقة ميكروسيرفيسز."
        }
      ],
      comparison: {
        title: "الـ 2-Tier مقابل الـ 3-Tier",
        items: [
          {
            name: "Two-Tier (طبقتين)",
            desc: "العميل متصل مباشرة بقاعدة البيانات؛ أمان أقل وأصعب في التحديث لكل عميل.",
            example: "برنامج كاشير قديم يتصل بسيرفر محلي عبر كابل شبكة."
          },
          {
            name: "Three-Tier (3 طبقات)",
            desc: "العميل يكلم خادم الويب فقط، وخادم الويب هو الوسيط مع الداتابيز؛ أمان فائق وسهولة صيانة.",
            example: "موقع التسوق أمازون: المتصفح يكلم Web API و الـ API يكلم الـ Database."
          }
        ]
      },
      triggers: [
        { trigger: "Adds intermediate layer between client and database server", choose: "Three-Tier Architecture" },
        { trigger: "Runs application programs and stores business rules", choose: "Application server / Web server (Middle tier)" },
        { trigger: "Divide layers between user and stored data into finer components", choose: "N-tier architecture" }
      ],
      keywords: [
        { en: "Three-Tier Architecture", ar: "المعمارية ثلاثية الطبقات" },
        { en: "Application Server", ar: "خادم التطبيقات" },
        { en: "Business Rules", ar: "قواعد ومنطق العمل" },
        { en: "N-Tier", ar: "المعمارية متعددة الطبقات" }
      ],
      tricks: "لو سألك مين المسؤول عن تخزين وتنفيذ 'Business Rules' في معمارية الـ 3-Tier؟ الإجابة فوراً: Application Server / Web Server (الطبقة المتوسطة)!",
      quiz: {
        question: "In a Three-Tier Web Architecture, what is the role of the intermediate Application or Web Server layer?",
        options: [
          "It manufactures silicon microchips",
          "It runs application programs and stores business rules between client and database",
          "It permanently disables internet access for clients",
          "It replaces the need for any storage disks"
        ],
        correct: 1,
        explanation: "الطبقة الوسيطة (Application/Web server) تتولى تشغيل البرامج التطبيقية وتخزين وتنفيذ قواعد العمل (Business rules) بين العميل والداتابيز."
      }
    },
    {
      num: 32,
      title: "Figure 2.7: Logical Three-Tier Client/Server Architecture",
      arabicTitle: "مخطط معمارية الطبقات الثلاث وتسمياتها الشائعة (Figure 2.7)",
      image: "materials/slides/db-lec3/slide_32.png",
      coreSummary: "شكل 2.7: المخطط النهائي للمحاضرة يوضح النموذجين الشائعين لتسمية الطبقات الثلاث: (GUI -> Web Server -> DBMS) أو (Presentation -> Business Logic -> Database Services).",
      explanationIntro: "مسك ختام المحاضرة هي الرسمة 2.7 الشهيرة جداً. السلايد بتعرض طريقتين بيعبروا عن نفس المعمارية: النموذج (a) بالمسميات التقنية للأجهزة (Client -> Application Server -> Database Server)، والنموذج (b) بالمسميات الوظيفية للطبقات البرمجية (Presentation Layer -> Business Logic Layer -> Database Services Layer). احفظ الاسمين كويس جداً!",
      points: [
        {
          badge: "النموذج التقني (a)",
          title: "Hardware / Components Nomenclature",
          desc: "1. Client (GUI, Web Interface) <-> 2. Application Server or Web Server (Programs, Web Pages) <-> 3. Database Server (DBMS)."
        },
        {
          badge: "النموذج البرمجي (b)",
          title: "Layered Architectural Nomenclature",
          desc: "1. Presentation Layer (طبقة العرض) <-> 2. Business Logic Layer (منطق العمل) <-> 3. Database Services Layer (خدمات قواعد البيانات)."
        }
      ],
      diagramDeconstruction: {
        title: "تفكيك مخطط الطبقات الثلاث وتسمياتها المتناظرة (Figure 2.7):",
        overview: "المخطط يعرض التناظر الكامل بين التسمية المكوناتية (a) والتسمية الطبقية الوظيفية (b):",
        parts: [
          {
            symbol: "Client <=> Presentation Layer",
            type: "Top Tier",
            role: "طبقة العرض والتفاعل",
            meaning: "المتصفح أو واجهة المستخدم الرسومية (GUI, Web Interface) المسؤولة عن استقبال مدخلات المستخدم وعرض المخرجات.",
            example: "صفحة React أو تطبيق فلاتر على هاتف المستخدم."
          },
          {
            symbol: "Application Server <=> Business Logic Layer",
            type: "Middle Tier",
            role: "طبقة منطق وقواعد العمل",
            meaning: "الخادم الوسيط الحاوي لبرامج التطبيق وصفحات الويب الحسابية التي تطبق شروط وقواعد العمل وتتحقق من البيانات.",
            example: "خادم Node.js أو Spring Boot أو Django."
          },
          {
            symbol: "Database Server <=> Database Services Layer",
            type: "Bottom Tier",
            role: "طبقة خدمات البيانات",
            meaning: "خادم قاعدة البيانات المسؤول عن تخزين البيانات، إدارة الفهارس، تنفيذ استعلامات SQL، وحفظ قيود التكامل.",
            example: "سيرفر PostgreSQL أو Oracle Database."
          }
        ]
      },
      comparison: {
        title: "المسميات المتناظرة في معمارية الـ 3-Tier",
        items: [
          {
            name: "Nomenclature (a)",
            desc: "Client <-> Application Server / Web Server <-> Database Server (تسمية الأجهزة والسيرفرات).",
            example: "الأجهزة في الشبكة."
          },
          {
            name: "Nomenclature (b)",
            desc: "Presentation Layer <-> Business Logic Layer <-> Database Services Layer (تسمية الطبقات البرمجية).",
            example: "معمارية هندسة البرمجيات."
          }
        ]
      },
      triggers: [
        { trigger: "Figure 2.7 model (b) nomenclature", choose: "Presentation Layer -> Business Logic Layer -> Database Services Layer" },
        { trigger: "Middle tier in Figure 2.7 (b)", choose: "Business Logic Layer" },
        { trigger: "Top tier in Figure 2.7 (b)", choose: "Presentation Layer" },
        { trigger: "Bottom tier in Figure 2.7 (b)", choose: "Database Services Layer" }
      ],
      keywords: [
        { en: "Presentation Layer", ar: "طبقة العرض والواجهة" },
        { en: "Business Logic Layer", ar: "طبقة منطق العمل والتطبيق" },
        { en: "Database Services Layer", ar: "طبقة خدمات قاعدة البيانات" }
      ],
      tricks: "سؤال مضمون بنسبة 100%: الطبقة اللي في النص في Figure 2.7 (b) اسمها إيه؟ اسمها Business Logic Layer! والطبقة اللي فوق Presentation والطبقة اللي تحت Database Services Layer.",
      quiz: {
        question: "In Figure 2.7 (b), what is the official name of the middle layer in the three-tier architectural nomenclature?",
        options: [
          "Presentation Layer",
          "Business Logic Layer",
          "Database Services Layer",
          "Physical Media Layer"
        ],
        correct: 1,
        explanation: "في التسمية المعمارية للشكل 2.7 (b)، الطبقة الوسطى تسمى رسمياً طبقة منطق وقواعد العمل (Business Logic Layer)."
      }
    }
  ],
  fullQuiz: [
    {
      id: 1,
      question: "What is the primary definition of 'Data Abstraction' in database systems?",
      options: [
        "Encrypting all database data files using symmetric keys",
        "Suppression of details of data organization and storage, while highlighting essential features",
        "Duplicating tables across multiple servers for load balancing",
        "Converting relational tables into unstructured text files"
      ],
      correct: 1,
      explanation: "تجريد البيانات (Data Abstraction) هو إخفاء تفاصيل التخزين والتنظيم الفيزيائي وإبراز الخصائص الجوهرية الأساسية فقط."
    },
    {
      id: 2,
      question: "Which of the following describes a 'Data Model' according to the course slides?",
      options: [
        "A collection of concepts that describe the structure of a database and provide means to achieve data abstraction",
        "A physical silicon chip inside the hard disk drive controller",
        "A network communication cable protocol",
        "A graphics design tool used for creating user avatars"
      ],
      correct: 0,
      explanation: "نموذج البيانات هو مجموعة من المفاهيم الهيكلية التي تصف بنية قاعدة البيانات وتوفر الوسيلة لتحقيق تجريد البيانات."
    },
    {
      id: 3,
      question: "In a data model, what is the 'dynamic aspect or behavior' of a database application represented by?",
      options: [
        "Disk motor RPM speed",
        "Basic operations (retrievals and updates) and valid user-defined operations",
        "Network cable bandwidth latency",
        "Server room air conditioning temperature"
      ],
      correct: 1,
      explanation: "السلوك الديناميكي لقاعدة البيانات يتمثل في العمليات الأساسية (الاسترجاع والتحديث) والعمليات المعرفة من المستخدم مثل COMPUTE_GPA."
    },
    {
      id: 4,
      question: "Which category of data models is 'close to the way many users perceive data'?",
      options: [
        "Low-level / Physical data models",
        "High-level or Conceptual data models",
        "Storage definition language models",
        "Operating system kernel models"
      ],
      correct: 1,
      explanation: "النماذج المفاهيمية عالية المستوى (Conceptual models) هي الأقرب لطريقة إدراك وفهم المستخدمين للبيانات في العالم الواقعي."
    },
    {
      id: 5,
      question: "Which category of data models describes details of record formats, orderings, and access paths on storage media?",
      options: [
        "Conceptual data models",
        "Physical / Low-level data models",
        "View definition models",
        "Entity-Relationship models"
      ],
      correct: 1,
      explanation: "النماذج الفيزيائية منخفضة المستوى (Physical data models) هي التي تصف تفاصيل أشكال السجلات وترتيبها ومسارات التخزين على الوسائط."
    },
    {
      id: 6,
      question: "Why are Relational data models also called 'record-based' data models?",
      options: [
        "Because they represent data by using record structures (tables of rows)",
        "Because they can only record audio and speech data",
        "Because they prevent records from ever being modified",
        "Because they do not require any memory"
      ],
      correct: 0,
      explanation: "تسمى Record-based لأنها تمثل البيانات باستخدام هياكل السجلات (جداول مكونة من صفوف وسجلات)."
    },
    {
      id: 7,
      question: "What is an 'Access Path' in physical database modeling?",
      options: [
        "The physical hallway path taken by database administrators to enter the server room",
        "A structure that makes the search for particular database records efficient",
        "An encrypted SSL connection between client and router",
        "A backup copy of database transaction logs"
      ],
      correct: 1,
      explanation: "مسار الوصول (Access Path) هو هيكل منظم (زي الفهرس) يجعل البحث عن السجلات داخل قاعدة البيانات سريعاً وفعالاً."
    },
    {
      id: 8,
      question: "An 'Index' in a database is an example of what concept?",
      options: [
        "A high-level conceptual entity",
        "An access path that allows direct access to data using an index term or keyword",
        "An external user interface dialog box",
        "A hardware graphics pipeline processor"
      ],
      correct: 1,
      explanation: "الفهرس (Index) هو أبرز مثال على مسارات الوصول (Access path) ويتيح الوصول المباشر للسجلات باستخدام قيمة مفتاحية."
    },
    {
      id: 9,
      question: "What is a 'Database Schema'?",
      options: [
        "The dynamic content of the database at 5:00 PM today",
        "The description of a database specified during design, which is not expected to change frequently",
        "The compiled binary file of the operating system",
        "A query used to delete all rows from a table"
      ],
      correct: 1,
      explanation: "سكيما قاعدة البيانات هي الوصف والتصميم المحدد أثناء مرحلة البناء، ومن المتوقع ألا تتغير إلا نادراً جداً."
    },
    {
      id: 10,
      question: "What does a 'Schema Diagram' display?",
      options: [
        "The actual populated rows and individual student names",
        "The structure of each record type but not the actual instances of records",
        "The physical disk tracks and sectors allocated to files",
        "The real-time CPU utilization graph"
      ],
      correct: 1,
      explanation: "مخطط السكيما يعرض هيكل كل نوع سجل فقط (أسماء الجداول والأعمدة) ولا يعرض السجلات الحقيقية أو البيانات الفعلية."
    },
    {
      id: 11,
      question: "What is a 'Schema Construct'?",
      options: [
        "A brick used in the data center building",
        "Each object in the schema, such as STUDENT or COURSE",
        "A SQL syntax error during execution",
        "A hardware hard drive failure"
      ],
      correct: 1,
      explanation: "كل كائن أو عنصر مفرد داخل السكيما (مثل جدول STUDENT أو جدول COURSE) يسمى Schema Construct."
    },
    {
      id: 12,
      question: "What is the 'Database State' (also called database instance or snapshot)?",
      options: [
        "The state of the power supply voltage",
        "The actual data stored in the database at a particular moment in time",
        "The original design document approved by management",
        "The programming language compiler version"
      ],
      correct: 1,
      explanation: "حالة قاعدة البيانات (Database State) هي البيانات الفعلية المخزنة في النظام في لحظة زمنية معينة."
    },
    {
      id: 13,
      question: "What is an 'Initial Database State'?",
      options: [
        "The database state when it is initially loaded into the system",
        "A database that has crashed and lost all its data",
        "The state where no schema has been created yet",
        "A backup archive stored on tape"
      ],
      correct: 0,
      explanation: "الحالة الابتدائية هي حالة قاعدة البيانات عند تحميل البيانات إليها لأول مرة بعد مرحلة الإنشاء."
    },
    {
      id: 14,
      question: "What is a 'Valid State' in database management?",
      options: [
        "A state that has been encrypted with SHA-256",
        "A state that satisfies the structure and constraints of the database",
        "A state where all tables have zero rows",
        "A state that is only accessible to system root administrators"
      ],
      correct: 1,
      explanation: "الحالة الصالحة (Valid State) هي الحالة التي تحقق وتلبي كافة القيود الهيكلية وقواعد النزاهة المحددة لقاعدة البيانات."
    },
    {
      id: 15,
      question: "In database terminology, the Schema is called ______ and the State is called ______:",
      options: [
        "Extension, Intension",
        "Intension, Extension",
        "Hardware, Software",
        "Internal, External"
      ],
      correct: 1,
      explanation: "السكيما تسمى رسمياً Intension (الهيكل والقصد)، بينما الحالة تسمى Extension (البيانات والامتداد الفعلي)."
    },
    {
      id: 16,
      question: "What is 'Schema Evolution'?",
      options: [
        "The automatic deletion of old database tables every month",
        "Changes applied to the schema as application requirements change over time",
        "Upgrading the server power supply unit",
        "The transformation of SQL into machine bytecode"
      ],
      correct: 1,
      explanation: "تطور السكيما (Schema Evolution) هو التعديلات التي يتم إدخالها على هيكل السكيما نتيجة لتغير متطلبات التطبيق مع مرور الوقت."
    },
    {
      id: 17,
      question: "What is the primary goal of the Three-Schema Architecture?",
      options: [
        "To merge all application programs into a single executable file",
        "To separate user applications from the physical database",
        "To replace relational databases with flat text files",
        "To eliminate the need for schema mappings"
      ],
      correct: 1,
      explanation: "الهدف الأسمى لمعمارية المستويات الثلاثة هو فصل تطبيقات المستخدمين عن قاعدة البيانات الفيزيائية وطرق تخزينها."
    },
    {
      id: 18,
      question: "Which level of the three-schema architecture describes the physical storage structure and access paths?",
      options: [
        "External Level",
        "Conceptual Level",
        "Internal Level",
        "Application Level"
      ],
      correct: 2,
      explanation: "المستوى الداخلي (Internal Level) هو الذي يصف الهيكل الفيزيائي للتخزين ومسارات الوصول على وسائط التخزين."
    },
    {
      id: 19,
      question: "Which level of the three-schema architecture describes the whole database structure for a community of users while hiding physical details?",
      options: [
        "Internal Level",
        "Conceptual Level",
        "External Level",
        "Physical Level"
      ],
      correct: 1,
      explanation: "المستوى المفاهيمي (Conceptual Level) يصف هيكل قاعدة البيانات بالكامل لجميع المستخدمين ويخفي التفاصيل الفيزيائية."
    },
    {
      id: 20,
      question: "Which level of the three-schema architecture describes the part of the database a particular user group is interested in while hiding the rest?",
      options: [
        "Internal Level",
        "Conceptual Level",
        "External or View Level",
        "Storage Level"
      ],
      correct: 2,
      explanation: "المستوى الخارجي (External/View Level) يصف فقط الجزء الذي يهم فئة معينة من المستخدمين ويحجب باقي البيانات."
    },
    {
      id: 21,
      question: "What is 'Logical Data Independence'?",
      options: [
        "The capacity to change the internal storage media without modifying the conceptual schema",
        "The capacity to change the conceptual schema without having to change external schemas or application programs",
        "The ability to run database queries without a CPU",
        "The process of converting binary data into ASCII text"
      ],
      correct: 1,
      explanation: "استقلالية البيانات المنطقية هي القدرة على تعديل المخطط المفاهيمي (إضافة جداول أو حقول) دون الحاجة لتعديل الواجهات الخارجية أو البرامج."
    },
    {
      id: 22,
      question: "What is 'Physical Data Independence'?",
      options: [
        "The capacity to change the internal schema without having to change the conceptual schema",
        "The capacity to change external views without changing user passwords",
        "The requirement to rewrite SQL queries whenever hard disk sectors change",
        "The ability of users to physically unplug servers during queries"
      ],
      correct: 0,
      explanation: "استقلالية البيانات الفيزيائية هي القدرة على تعديل المخطط الداخلي (تغيير أقراص التخزين أو إضافة فهارس) دون المساس بالسكيما المفاهيمية."
    },
    {
      id: 23,
      question: "Which DBMS language is used to specify the internal schema (storage structure)?",
      options: [
        "VDL (View Definition Language)",
        "SDL (Storage Definition Language)",
        "DML (Data Manipulation Language)",
        "HTML (HyperText Markup Language)"
      ],
      correct: 1,
      explanation: "لغة تعريف التخزين SDL (Storage Definition Language) هي المخصصة لتحديد وضبط المخطط الداخلي (Internal schema)."
    },
    {
      id: 24,
      question: "Which DBMS language specifies user views and their mappings to the conceptual schema?",
      options: [
        "VDL (View Definition Language)",
        "SDL (Storage Definition Language)",
        "DML (Data Manipulation Language)",
        "BIOS (Basic Input Output System)"
      ],
      correct: 0,
      explanation: "لغة تعريف واجهات العرض VDL (View Definition Language) هي المسؤولة عن تحديد رؤى المستخدمين وربطها بالمخطط المفاهيمي."
    },
    {
      id: 25,
      question: "In a Centralized DBMS Architecture, where are the DBMS functionality, application programs, and UI processing executed?",
      options: [
        "Distributed across edge client devices",
        "Carried out entirely on one single machine (Mainframe)",
        "Split equally across three separate database clouds",
        "On printer spooler controllers"
      ],
      correct: 1,
      explanation: "في المعمارية المركزية، يتم تنفيذ كافة وظائف الـ DBMS والتطبيقات ومعالجة الواجهات بالكامل على جهاز مركزي واحد."
    },
    {
      id: 26,
      question: "In a basic client/server architecture, which server maintains the files of the client machines?",
      options: [
        "Print Server",
        "File Server",
        "Web Cache Proxy",
        "Audio Streamer"
      ],
      correct: 1,
      explanation: "خادم الملفات (File Server) هو المسؤول عن حفظ وإدارة وتأمين ملفات أجهزة العملاء."
    },
    {
      id: 27,
      question: "In a Two-Tier Client/Server Architecture for DBMSs, what does the Client machine handle?",
      options: [
        "SQL query compilation and disk storage sector caching",
        "User interface programs and application programs",
        "High-voltage power distribution to disk arrays",
        "Operating system kernel thread dispatching on the server"
      ],
      correct: 1,
      explanation: "في معمارية الطبقتين، يتولى جهاز العميل تشغيل برامج واجهات المستخدم وبرامج التطبيق (UI and Application programs)."
    },
    {
      id: 28,
      question: "In a Three-Tier Web Architecture, what is the role of the intermediate layer (Application Server or Web Server)?",
      options: [
        "It only provides electrical power to the database server",
        "It runs application programs and stores/enforces business rules between client and database",
        "It acts as a physical replacement for RAM memory",
        "It prevents all clients from accessing web pages"
      ],
      correct: 1,
      explanation: "الطبقة الوسيطة (Application/Web server) تشغل البرامج التطبيقية وتخزن وتطبق قواعد العمل (Business rules) وتفصل العميل عن الداتابيز."
    },
    {
      id: 29,
      question: "In Figure 2.7 (b), what are the three architectural tiers called from top to bottom?",
      options: [
        "Client Layer -> File Layer -> Network Layer",
        "Presentation Layer -> Business Logic Layer -> Database Services Layer",
        "Hardware Layer -> Kernel Layer -> Compiler Layer",
        "Input Layer -> Hidden Layer -> Output Layer"
      ],
      correct: 1,
      explanation: "الطبقات الثلاث في الشكل 2.7 (b) هي من الأعلى للأسفل: طبقة العرض (Presentation Layer)، طبقة منطق العمل (Business Logic Layer)، وطبقة خدمات الداتابيز (Database Services Layer)."
    },
    {
      id: 30,
      question: "In the COMPANY ER diagram (Slide 7), how is a Weak Entity such as DEPENDENT represented?",
      options: [
        "With a single oval",
        "With a double rectangle",
        "With a dashed diamond",
        "With a thick single circle"
      ],
      correct: 1,
      explanation: "الكيان الضعيف (Weak Entity) مثل DEPENDENT يُمثل دائماً في مخطط الـ ER بمستطيل مزدوج (Double Rectangle)."
    }
  ]
};

// Merge into js/lecture-explanations-data.js
const targetFilePath = path.join(__dirname, '..', 'js', 'lecture-explanations-data.js');
let fileContent = fs.readFileSync(targetFilePath, 'utf8');

// Check if database-systems has lecture 3
if (fileContent.includes('"database-systems": {')) {
  // Let's inspect how database-systems is declared in lecture-explanations-data.js
  console.log("Found database-systems in lecture-explanations-data.js");
}

// Convert lecture3Data to formatted JS
const lecture3JsStr = JSON.stringify(lecture3Data, null, 2);

// Let's create an injector script or append cleanly
fs.writeFileSync(path.join(__dirname, 'lecture3_payload.json'), lecture3JsStr, 'utf8');
console.log("Lecture 3 payload saved successfully. Size:", lecture3JsStr.length, "bytes");
