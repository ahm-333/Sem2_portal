/**
 * ==============================================================================
 * ملف بيانات الشرح التفاعلي الذكي للمحاضرات (Smart Lecture Walkthrough Data)
 * ==============================================================================
 * يحتوي على تفكيك كامل لكل شريحة من شرائح المحاضرة:
 * - صورة السلايد الأصلية بدقة عالية
 * - الشرح بالعامية المصرية المبسطة (بالبلدي كده)
 * - الكلمات المفتاحية والمصطلحات الأكاديمية
 * - تريكات الامتحان وفخاخ الأسئلة (Exam Traps)
 * - كويز تفاعلي فوري على السلايد مع التصحيح الفوري
 */

const LECTURE_EXPLANATIONS = {
  // ============================================================================
  // مادة قواعد البيانات (database-systems) - المحاضرة 2
  // ============================================================================
  "database-systems": {
    2: {
      courseId: "database-systems",
      lectureId: 2,
      courseName: "Database Systems (IS211)",
      lectureTitle: "Database System Concepts and Architecture",
      lectureArabicTitle: "مفاهيم وهيكلية أنظمة قواعد البيانات ومستخدميها",
      totalSlides: 30,
      slides: [
        {
          num: 1,
          title: "Database systems - Course Overview",
          arabicTitle: "غلاف المحاضرة وبيانات المادة",
          image: "materials/slides/db-lec2/slide_1.png",
          coreSummary: "المحاضرة تقديم د. أسماء حنفي علي غنيمي - أستاذ مساعد بقسم نظم المعلومات بكلية الحاسبات والمعلومات جامعة الزقازيق.",
          colloquial: "دي شريحة البداية والتعريف بالمادة وأستاذة المادة د. أسماء حنفي.. المادة دي هي العمود الفقري لأي مهندس حاسبات أو ذكاء اصطناعي، لأن مفيش برنامج أو تطبيق موبايل أو موديل AI في العالم بيشتغل بدون ما يخزن بياناته في داتابيز محترمة.",
          keywords: [
            { en: "Information Systems", ar: "نظم المعلومات" },
            { en: "Database Systems", ar: "أنظمة قواعد البيانات" }
          ],
          tricks: "💡 تذكرة: المادة بتعتمد على الفهم وربط المفاهيم النظرية بالتطبيق العملي في الـ SQL اللي هتاخدوه في المعمل.",
          quiz: {
            question: "ما هو القسم الأكاديمي المسؤول عن تدريس مادة أنظمة قواعد البيانات في هذه المحاضرة؟",
            options: [
              "قسم نظم المعلومات (Information Systems)",
              "قسم الحاسبات ونظم التحكم",
              "قسم العلوم الأساسية"
            ],
            correct: 0,
            explanation: "المادة مقدمة من قسم نظم المعلومات (IS Department) بكلية الحاسبات والمعلومات."
          }
        },
        {
          num: 2,
          title: "Database Concepts & Course Objectives",
          arabicTitle: "أهداف المقرر والمفاهيم الأساسية",
          image: "materials/slides/db-lec2/slide_2.png",
          coreSummary: "المقرر يركز على أساسيات تصميم ونمذجة وتطبيق أنظمة قواعد البيانات، لغات الـ DBMS والـ Data Models، وتقنيات تنفيذ الأنظمة.",
          colloquial: "الدكتورة بتوضح هنا هدف المادة: مش مجرد إنك تكتب كلمتين كود SQL وخلاص، الهدف إنك تفهم إزاي تصمم الداتابيز صح من الصفر (Database Design)، وإزاي تختار الـ Data Model المناسب، والتقنيات اللي الـ DBMS بيستخدمها تحت الكابوت عشان ينفذ العمليات بسرعة وأمان.",
          keywords: [
            { en: "Database Modeling", ar: "نمذجة قواعد البيانات" },
            { en: "Database Design", ar: "تصميم قواعد البيانات" },
            { en: "Implementation Techniques", ar: "تقنيات التنفيذ والتطبيق" }
          ],
          tricks: "⚠️ تريكة امتحان: الفرق بين الـ Modeling والـ Implementation.. الـ Modeling هو التصميم المنطقي على الورق (زي الـ ERD)، والـ Implementation هو كتابة الكود وجداول الـ SQL الفعلية على السيرفر.",
          quiz: {
            question: "الهدف الرئيسي لمقرر قواعد البيانات هو التركيز على:",
            options: [
              "فقط حفظ أوامر الـ SQL بدون فهم هيكل النظام",
              "أساسيات النمذجة والتصميم ولغات أنظمة إدارة قواعد البيانات وتقنيات تنفيذها",
              "شراء السيرفرات وضبط إعدادات الويندوز فقط"
            ],
            correct: 1,
            explanation: "الهدف الأكاديمي هو فهم النمذجة (Modeling)، التصميم (Design)، ولغات وتقنيات الـ DBMS."
          }
        },
        {
          num: 3,
          title: "Fundamental Definitions (Data, Database, Mini-World, DBMS)",
          arabicTitle: "التعريفات الجوهرية الأربعة (أهم سلايد بالميدترم)",
          image: "materials/slides/db-lec2/slide_3.png",
          coreSummary: "تعريف الـ Data، الـ Database، الـ Mini-world (Universe of Discourse)، الـ DBMS، والـ Database System.",
          colloquial: "ركز جداً هنا دي أشهر سلايد بييجي منها أسئلة صح وغلط ومصطلح علمي:\n1. Data: حقائق معروفة ومسجلة ولها معنى ضمني (زي اسمك، سنك، درجاتك).\n2. Database: مجموعة بيانات مرتبطة ببعضها منطقياً (مش أي شوية أرقام وخلاص!).\n3. Mini-world: جزء من العالم الحقيقي بنسجل بياناته في السيستم (زي بيانات ودرجات طلبة جامعة الزقازيق).\n4. DBMS: البرنامج أو السوفت وير اللي بيدير الكلام ده كله (زي Oracle أو MySQL أو PostgreSQL).\n5. Database System: هو السوفت وير (DBMS) + البيانات ذاتها (Data) + التطبيقات.",
          keywords: [
            { en: "Data", ar: "حقائق مسجلة ذات معنى ضمني (Implicit Meaning)" },
            { en: "Database", ar: "مجموعة بيانات مترابطة منطقياً (Related Data)" },
            { en: "Mini-world (UoD)", ar: "العالم المصغر من الواقع المُراد تمثيله" },
            { en: "DBMS", ar: "حزمة البرمجيات المسؤولة عن إنشاء وصيانة قاعدة البيانات" },
            { en: "Database System", ar: "برنامج الـ DBMS مضافاً إليه البيانات والتطبيقات" }
          ],
          tricks: "🔥 تريكة امتحان قاتلة: لو قالك في السؤال 'A collection of random data' قوله خطأ فوراً! الداتابيز لازم تكون 'RELATED data' وليها 'implicit meaning'.\nوتريكة تانية: الـ Mini-world بيسموه أحياناً 'Universe of Discourse (UoD)'.",
          quiz: {
            question: "جزء من العالم الحقيقي يتم تخزين بياناته وتمثيله داخل قاعدة البيانات يُعرف بـ:",
            options: [
              "DBMS",
              "Mini-world (Universe of Discourse)",
              "Data Redundancy",
              "File Processing System"
            ],
            correct: 1,
            explanation: "الـ Mini-world هو الجزء المقتطع من الواقع الحقيقي (مثل الجامعة أو المستشفى) المراد تمثيل بياناته."
          }
        },
        {
          num: 4,
          title: "Simplified Database System Environment",
          arabicTitle: "المخطط الهيكلي لبيئة نظام قاعدة البيانات",
          image: "materials/slides/db-lec2/slide_4.png",
          coreSummary: "مخطط يوضح تفاعل المستخدمين والبرامج التطبيقية (Application Programs) مع نظام إدارة قواعد البيانات (DBMS) والتعامل بلغة SQL للوصول لقاعدة البيانات المخزنة.",
          colloquial: "المخطط ده بيوضح القصة ماشية إزاي: الطالب أو المستخدم بيتعامل مع الشاشة والموقع (البرامج التطبيقية).. البرنامج ده لما يعوز داتا بيبعت استعلام بلغة SQL لنظام الـ DBMS.. ونظام الـ DBMS هو المايسترو الوحيد اللي ليه الحق يدخل يقرأ أو يعدل في الملفات وقاعدة البيانات المتخزنة على الهارد ديسك.",
          keywords: [
            { en: "Application Programs", ar: "البرامج التطبيقية وواجهات المستخدم" },
            { en: "DBMS Software", ar: "محرك نظام إدارة قواعد البيانات الوسيط" },
            { en: "Stored Database", ar: "قاعدة البيانات والبيانات الوصفية المخزنة على وسائط التخزين" }
          ],
          tricks: "💡 تريكة فهم: المستخدم العادي أو البرنامج التطبيقي ملوش وصول مباشر للملفات اللي على الهارد! كل الطلبات بتعدي أولاً على حارس البوابة وهو الـ DBMS.",
          quiz: {
            question: "بحسب المخطط المعماري لنظام قواعد البيانات، ما هو الكيان الوسيط الذي يستقبل طلبات البرامج التطبيقية ويتعامل مباشرة مع البيانات المخزنة؟",
            options: [
              "نظام إدارة قواعد البيانات (DBMS)",
              "المستخدم النهائي مباشرة دون وسيط",
              "نظام تشغيل جهاز العميل فقط"
            ],
            correct: 0,
            explanation: "الـ DBMS هو المحرك والوسيط الأساسي بين البرامج التطبيقية ومستودع البيانات الفعلي."
          }
        },
        {
          num: 5,
          title: "Grading and Course Distribution",
          arabicTitle: "توزيع درجات المادة والساعات الأسبوعية",
          image: "materials/slides/db-lec2/slide_5.png",
          coreSummary: "المحاضرة 1.5 ساعة، المعمل 1.5 ساعة. الفاينال 60 درجة، الميدترم 15 درجة، الشفوي (Oral) 10 درجات، العملي (Lab) 15 درجة، المجموع 100 درجة.",
          colloquial: "توزيعة الدرجات واضحة جداً وتعتبر فرصة ذهبية:\n- أعمال السنة والمعمل والشفوي والميدترم عليهم 40 درجة مضمونين لو تابعت السكاشن وسلمت الشيتات.\n- امتحان الفاينال التحريري عليه 60 درجة.\nالمجموع الكلي: 100 درجة.",
          keywords: [
            { en: "Grading Distribution", ar: "توزيع الدرجات: 60 فاينال + 15 ميدترم + 15 عملي + 10 شفوي" }
          ],
          tricks: "💡 نصيحة امتياز: الـ 40 درجة بتوع أعمال السنة والعملي هما اللي بيضمنوا تقدير الـ A+ في المادة، متضيعش كويزات المعمل!",
          quiz: {
            question: "ما هو مجموع درجات أعمال السنة والعملي والشفوي قبل امتحان الفاينال في المقرر؟",
            options: [
              "20 درجة",
              "40 درجة (15 ميدترم + 15 معمل + 10 شفوي)",
              "50 درجة"
            ],
            correct: 1,
            explanation: "أعمال السنة 40 درجة موزعة بين الميدترم (15)، العملي (15)، والشفوي (10)."
          }
        },
        {
          num: 6,
          title: "Textbook & Practical Lab Tools",
          arabicTitle: "المرجع المعتمد للمادة وبيئة العملي",
          image: "materials/slides/db-lec2/slide_6.png",
          coreSummary: "المرجع المعتمد هو كتاب Fundamentals of Database Systems (7th Edition) للمؤلفين Elmasri & Navathe، والعملي يعتمد على Oracle و SQL.",
          colloquial: "كتاب 'Elmasri & Navathe' هو أشهر إنجيل لقواعد البيانات في كليات الحاسبات على مستوى العالم، وكل أسئلة الامتحانات بتيجي من أمثلته وشرحه المعتمد.. وبالنسبة للمعمل هتشتغلوا عملي بـ Oracle SQL لتطبيق الاستعلامات.",
          keywords: [
            { en: "Fundamentals of Database Systems", ar: "مرجع المادة الرسمي (Elmasri & Navathe 7th Ed)" },
            { en: "Oracle SQL", ar: "لغة وبيئة العملي في المعامل" }
          ],
          tricks: "💡 ملحوظة: كتاب Elmasri هو المرجع اللي الدكاترة بيقتبسوا منه مسائل الـ ERD والـ Normalization حرفياً في امتحانات الفاينال.",
          quiz: {
            question: "من هما مؤلفا المرجع الرسمي المعتمد لمقرر قواعد البيانات (Fundamentals of Database Systems)؟",
            options: [
              "Tanenbaum & Stallings",
              "Ramez Elmasri & Shamkant B. Navathe",
              "Cormen & Leiserson"
            ],
            correct: 1,
            explanation: "المرجع العالمي المعتمد هو كتاب البروفيسور رامز المصري وشامكانت نافاثي."
          }
        },
        {
          num: 7,
          title: "Course Topics Overview",
          arabicTitle: "خريطة موضوعات المنهج خلال الترم",
          image: "materials/slides/db-lec2/slide_7.png",
          coreSummary: "المنهج ينقسم إلى 3 أجزاء رئيسية: الجزء 1 (المقدمة والمفاهيم Ch 1-2)، الجزء 2 (النمذجة وتصميم ER Model Ch 3)، الجزء 3 (النموذج العلائقي ولغة SQL والـ Normalization Ch 5, 6, 7, 9, 14).",
          colloquial: "خريطة طريق المنهج متقسمة 3 محطات أساسية:\n1. المحطة الأولى: نفهم يعني إيه داتابيز وهندستها المعمارية.\n2. المحطة التانية: الـ ER Diagrams إزاي ترسم وتصمم كروكي الداتابيز من متطلبات العميل.\n3. المحطة التالتة: تحويل الرسم ده لجداول علائقية وكتابة أوامر SQL وتنظيف الجداول بـ Normalization.",
          keywords: [
            { en: "Conceptual Modeling", ar: "النمذجة المفاهيمية (ER Model)" },
            { en: "Relational Model", ar: "النموذج العلائقي والجداول" },
            { en: "Normalization", ar: "التطبيع وضبط الجداول لمنع التكرار" }
          ],
          tricks: "💡 في الفاينال: النصيب الأكبر من الدرجات بيكون على رسم الـ ERD وتحويله لـ Relational Schema، والـ SQL Queries، ومسائل الـ Normalization.",
          quiz: {
            question: "أي الفصول التالية مخصص لنمذجة البيانات المفاهيمية ورسم مخططات الكيانات والعلاقات (ER Model)؟",
            options: [
              "Chapter 1",
              "Chapter 3 (Part 2)",
              "Chapter 14"
            ],
            correct: 1,
            explanation: "الفصل الثالث (Chapter 3) هو المخصص لدراسة الـ Conceptual Modeling ورسم الـ ER Diagrams."
          }
        },
        {
          num: 8,
          title: "Part 1: Introduction & Evolution of Databases",
          arabicTitle: "الجزء الأول: المفاهيم وتطور التكنولوجيا وأنظمة NoSQL",
          image: "materials/slides/db-lec2/slide_8.png",
          coreSummary: "يغطي الجزء الأول المفاهيم الأساسية، أنواع المستخدمين، مصطلحات الـ DBMS، ومقدمة للتقنيات الحديثة مثل أنظمة NoSQL.",
          colloquial: "الجزء الأول بيأسسك صح: بيعرفك على الفرق بين الأنظمة القديمة والحديثة، وليه ظهرت قواعد بيانات NoSQL في عصر الـ Big Data بعد ما كانت كل الدنيا شغالة Relational بس.",
          keywords: [
            { en: "NoSQL Systems", ar: "قواعد البيانات اللارمزية الحديثة للبيانات الضخمة" },
            { en: "Evolution of DB", ar: "تطور تكنولوجيا قواعد البيانات عبر الزمن" }
          ],
          tricks: "⚡ تريكة شائعة: NoSQL لا تعني 'لا تستخدم SQL' بل تعني 'Not Only SQL' ومصممة للبيانات غير المهيكلة والضخمة.",
          quiz: {
            question: "المصطلح NoSQL في أنظمة قواعد البيانات الحديثة يشير اختصاراً إلى:",
            options: [
              "No SQL Allowed",
              "Not Only SQL",
              "Newer Operational SQL"
            ],
            correct: 1,
            explanation: "المصطلح NoSQL يعني 'Not Only SQL' ويشمل أنظمة تخزين حديثة زي Document و Key-Value."
          }
        },
        {
          num: 9,
          title: "Part 2: Conceptual Data Modeling & ER Diagrams",
          arabicTitle: "الجزء الثاني: تصميم الـ ER ودياجرامات الـ UML",
          image: "materials/slides/db-lec2/slide_9.png",
          coreSummary: "عرض مفاهيم مخطط الكيانات والعلاقات (ER/EER Diagrams) كأداة للتصميم المفاهيمي البدائي، ومقارنتها بترميزات الـ UML Class Diagrams.",
          colloquial: "هنا بنتعلم لغة الرسم الهندسية للداتابيز.. لما العميل يجيلك يقولك 'عايز سيستم مبيعات'، مش بتفتح اللاب تكتب كود علطول! بترسم الأول كيانات (Entities) زي العميل والمنتج، وتحدد العلاقات (Relationships) والخصائص (Attributes).",
          keywords: [
            { en: "Entity-Relationship (ER)", ar: "مخطط الكيانات والعلاقات" },
            { en: "Conceptual Design", ar: "التصميم المفاهيمي عالي المستوى" },
            { en: "UML Class Diagrams", ar: "مخططات الفئات في هندسة البرمجيات" }
          ],
          tricks: "💡 تريكة: الـ ERD هو تصميم مستقل تماماً عن أي سوفت وير (DBMS-independent)! يعني ترسمه وينفع تطبقه في أوراكل أو ماي إس كيو إل أو غيرهم.",
          quiz: {
            question: "مخطط الـ ER Diagram يُعتبر في عملية تصميم قواعد البيانات بمثابة تصميم:",
            options: [
              "تصميم فيزيائي يعتمد على نوع الهارد ديسك (Physical)",
              "تصميم مفاهيمي عالي المستوى مستقل عن نوع السوفت وير (Conceptual)",
              "كود تنفيذي مباشر بلغة الآلة"
            ],
            correct: 1,
            explanation: "الـ ER هو Conceptual Design يركز على منطق العمل والكيانات دون التقيد بنوع الـ DBMS."
          }
        },
        {
          num: 10,
          title: "Part 3: The Relational Data Model & Basic SQL",
          arabicTitle: "الجزء الثالث: النموذج العلائقي ومقدمة لغة SQL",
          image: "materials/slides/db-lec2/slide_10.png",
          coreSummary: "شرح النموذج العلائقي (Relational Model)، قيود التكامل (Integrity Constraints)، لغة الـ SQL القياسية، وتعريف البيانات واستعلاماتها البسيطة.",
          colloquial: "هنا بننزل لأرض الواقع: بنحول الرسوم لجداول (Tables) وصفوف (Rows/Tuples) وأعمدة (Columns/Attributes).. وبنتعلم قيود الأمان زي المفتاح الأساسي (Primary Key) والمفتاح الأجنبي (Foreign Key) اللي بيربط الجداول ببعض.",
          keywords: [
            { en: "Relational Model", ar: "النموذج العلائقي المبني على الجداول والرياضيات" },
            { en: "Integrity Constraints", ar: "قيود التكامل وصحة البيانات (PK, FK, Not Null)" },
            { en: "SQL Standard", ar: "اللغة القياسية للتعامل مع قواعد البيانات العلائقية" }
          ],
          tricks: "⚠️ تريكة امتحان: في الـ Relational Model، كل جدول يسمى رياضياً 'Relation' وكل صف يسمى 'Tuple' وكل عمود يسمى 'Attribute'. احفظ المسميات دي صم!",
          quiz: {
            question: "في النموذج العلائقي (Relational Model)، ماذا يُسمى الصف الواحد (Row) من الناحية النظرية الرياضية؟",
            options: [
              "Relation",
              "Tuple",
              "Domain",
              "Constraint"
            ],
            correct: 1,
            explanation: "الصف يُسمى Tuple، والجدول يُسمى Relation، والعمود يُسمى Attribute."
          }
        },
        {
          num: 11,
          title: "Part 3 (cont.): Advanced SQL & Normalization",
          arabicTitle: "استعلامات SQL المتقدمة، الـ Triggers، والـ Normalization",
          image: "materials/slides/db-lec2/slide_11.png",
          coreSummary: "استعلامات SQL المعقدة، الـ Triggers والـ Views، خوارزميات الـ ER-to-Relational Mapping، ونظرية الـ Normalization في الفصل 14.",
          colloquial: "الجزء المتقدم اللي بيفرق الطالب الشاطر: إزاي تعمل استعلامات معقدة بـ Joins و Subqueries، وتعمل Triggers تنفذ أكواد أوتوماتيك أول ما يحصل حدث معين، ونختم بالـ Normalization عشان نتأكد إن الجداول مفهاش أي تكرار أو أخطاء تعديل وحذف.",
          keywords: [
            { en: "Triggers", ar: "إجراءات تلقائية يتم تفعيلها عند حدوث تعديل أو إضافة" },
            { en: "Views", ar: "جداول افتراضية استعلامية لأغراض الأمان والسهولة" },
            { en: "ER-to-Relational Mapping", ar: "خوارزميات تحويل رسمة الـ ER لجداول فعلية" }
          ],
          tricks: "🔥 سؤال مؤكد بالفاينال: مسائل الـ Normalization (1NF, 2NF, 3NF, BCNF) تأتي عليها مسألة كاملة بـ 15 درجة، فاحرص على فهم الـ Functional Dependencies.",
          quiz: {
            question: "التقنية الرياضية المستخدمة للتأكد من خلو الجداول من التكرار غير المرغوب وتناقضات الحذف والإضافة تُعرف بـ:",
            options: [
              "Data Fragmentation",
              "Normalization (التطبيع)",
              "Canned Transaction",
              "Data Redundancy"
            ],
            correct: 1,
            explanation: "الـ Normalization هي النظرية المسؤولة عن تقسيم الجداول وتنظيمها لمنع التكرار (Redundancy) والشذوذ."
          }
        },
        {
          num: 12,
          title: "University Database Example - Relations",
          arabicTitle: "مثال تطبيقي: قاعدة بيانات الجامعة وجداولها",
          image: "materials/slides/db-lec2/slide_12.png",
          coreSummary: "مثال عملي يوضح قاعدة بيانات الجامعة المكونة من خمسة جداول أساسية: STUDENT, COURSE, SECTION, GRADE_REPORT, PREREQUISITE.",
          colloquial: "الدكتورة بتشرح هنا المثال اللي هيكمل معانا الترم كله: قاعدة بيانات الجامعة.. تخيل إنك بتبرمج سيستم الكلية، هتحتاج جدول للطلبة (STUDENT)، جدول للمواد (COURSE)، جدول للسكاشن والفصول (SECTION)، جدول لشهادات ودرجات الامتحانات (GRADE_REPORT)، وجدول للمتطلبات السابقة لكل مادة (PREREQUISITE).",
          keywords: [
            { en: "Relational Schema", ar: "المخطط الهيكلي للجداول وعلاقاتها" },
            { en: "University DB Example", ar: "قاعدة بيانات الجامعة النموذجية في كتاب المصري" }
          ],
          tricks: "💡 لاحظ العلاقة: جدول الـ PREREQUISITE بيشير لنفس جدول الـ COURSE (علاقة دائرية Recursive Relationship لأن المتطلب السابق هو أصلاً كورس مسجل في الجدول!).",
          quiz: {
            question: "في مثال قاعدة بيانات الجامعة المعتمد، أي الجداول التالية يُخزن المتطلبات السابقة للمواد؟",
            options: [
              "GRADE_REPORT",
              "PREREQUISITE",
              "SECTION",
              "STUDENT"
            ],
            correct: 1,
            explanation: "جدول الـ PREREQUISITE يحتوي على رقم المادة ورقم المادة المتطلب السابق لها (Prerequisite_number)."
          }
        },
        {
          num: 13,
          title: "University Database - Data Records (Tuples)",
          arabicTitle: "البيانات الفعلية المخزنة داخل جداول الجامعة",
          image: "materials/slides/db-lec2/slide_13.png",
          coreSummary: "عرض سجلات حقيقية في جداول STUDENT (مثل الطالب Smith رقمه 17)، COURSE (مادة Intro to CS برمز CS1310)، و SECTION (السكشن 85).",
          colloquial: "بص على السلايد دي كأنها شاشة إكسيل حقيقية: الصف الأول فيه طالب اسمه Smith، ورقم طالب 17، وسنته الدراسية 1، وقسمه CS.. ده اسمه Tuple أو Record.. وكل عمود زي Name أو Student_number ده اسمه Attribute.",
          keywords: [
            { en: "Tuples / Records", ar: "الصفوف والسجلات الفعلية" },
            { en: "Attributes / Fields", ar: "الأعمدة والحقول التي تصف البيانات" },
            { en: "Data Values", ar: "القيم المخزنة في تقاطع الصف مع العمود" }
          ],
          tricks: "⚠️ تريكة: ترتيب الصفوف في الجدول الرياضي غير مهم نهائياً! يعني لو Smith جه في الأول أو في الآخر مش بيأثر على منطق الداتابيز.",
          quiz: {
            question: "في جداول قواعد البيانات العلائقية، هل ترتيب الصفوف (Order of Tuples) يُعتبر ذو أهمية منطقية لقاعدة البيانات؟",
            options: [
              "نعم، يجب أن تكون الصفوف مرتبة إجبارياً بحسب تاريخ الإدخال",
              "لا، ترتيب الصفوف ليس له أي أهمية منطقية في النموذج العلائقي",
              "نعم، الترتيب يغير نتيجة الاستعلام دائماً"
            ],
            correct: 1,
            explanation: "من الخصائص الأساسية للـ Relational Model أن الـ Tuples تمثل مجموعة رياضية (Set) لا يُشترط فيها الترتيب."
          }
        },
        {
          num: 14,
          title: "Database Operations (Queries and Updates)",
          arabicTitle: "العمليات الأساسية على قواعد البيانات: الاستعلام والتعديل",
          image: "materials/slides/db-lec2/slide_14.png",
          coreSummary: "العمليات تنقسم إلى: استرجاع واستعلام (Query / Retrieval) مثل عرض درجات طالب، وتحديثات (Updates) مثل إضافة طالب جديد أو تعديل قسمه.",
          colloquial: "أي حاجة هتعملها على الداتابيز في حياتك بتندرج تحت حاجتين ملهمش تالت:\n1. Queries: قراءة واستعلام بس بدون تغيير في البيانات (زي ما تبحث عن نتيجتك برقم الجلوس).\n2. Updates: تعديل فعلي على البيانات (تشمل: إضافة كورس جديد Insert، حذف طالب اتخرج Delete، أو تعديل عنوان Update).",
          keywords: [
            { en: "Query / Retrieval", ar: "استعلام واسترجاع البيانات دون تعديلها" },
            { en: "Update Operations", ar: "عمليات التحديث: Insert, Delete, Modify" }
          ],
          tricks: "⚡ تريكة في المصطلحات: عمليات الـ CRUD المشهورة في البرمجة تقابل (Create, Read, Update, Delete).. الـ Read هي الـ Query، والباقي هم الـ Updates.",
          quiz: {
            question: "استعلام الطالب عن سجله الأكاديمي ودرجاته في الترم الماضي يُصنف تحت أي نوع من العمليات؟",
            options: [
              "Update Operation",
              "Query (Retrieval) Operation",
              "Schema Modification",
              "Database Destruction"
            ],
            correct: 1,
            explanation: "طلب عرض البيانات وقراءتها دون إجراء أي تغيير يُعد عملية استعلام (Query / Retrieval)."
          }
        },
        {
          num: 15,
          title: "Example of a Simplified Database Catalog (Meta-data)",
          arabicTitle: "مثال مبسط لكتالوج قاعدة البيانات (البيانات الوصفية Meta-data)",
          image: "materials/slides/db-lec2/slide_15.png",
          coreSummary: "كتالوج النظام يحتوي على جدولين: جدول RELATIONS يحدد أسماء الجداول وعدد أعمدتها، وجدول COLUMNS يحدد أسماء الأعمدة وأنواع بياناتها والجدول التابعة له.",
          colloquial: "دي أهم ميزة بتميز الداتابيز عن الملفات العادية: الداتابيز بتعرف نفسها بنفسها! الكتالوج (Catalog أو Data Dictionary) هو جدول خاص بيخزن وصف باقي الجداول.. بيسجل: اسم الجدول إيه؟ فيه كام عمود؟ اسم كل عمود ونوع بياناته إيه؟ البيانات دي اسمها 'Data about Data' أو 'Meta-data'.",
          keywords: [
            { en: "DBMS Catalog", ar: "كتالوج النظام الحافظ لهياكل الجداول" },
            { en: "Meta-data", ar: "بيانات تصف البيانات (Data about Data)" },
            { en: "Data Dictionary", ar: "قاموس البيانات المدمج في النظام" }
          ],
          tricks: "🔥 سؤال امتحان متكرر: ما هو الـ Meta-data؟ إجابته النموذجية في كلمتين: 'Data about data, describing the structure and constraints of the database'.",
          quiz: {
            question: "المعلومات المخزنة داخل كتالوج الـ DBMS والتي تصف أسماء الجداول وأنواع الأعمدة والقيود تُعرف علمياً بـ:",
            options: [
              "Raw Data",
              "Meta-data (البيانات الوصفية)",
              "Temporary Log",
              "Data Redundancy"
            ],
            correct: 1,
            explanation: "الـ Meta-data هي البيانات التي تصف بنية وقواعد وتعاريف قاعدة البيانات ذاتها."
          }
        },
        {
          num: 16,
          title: "Main Characteristics: Data Abstraction & Program-Data Independence",
          arabicTitle: "أهم خصائص قواعد البيانات: استقلالية البرامج عن البيانات",
          image: "materials/slides/db-lec2/slide_16.png",
          coreSummary: "خاصية الـ Data Abstraction تتيح استقلالية البرامج عن البيانات (Program-data independence) وعن العمليات (Program-operation independence) عبر فصل تعريف البيانات في الكتالوج.",
          colloquial: "زمان قبل الداتابيز، لو غيرت نوع عمود من رقم لنص، كنت لازم تعيد كتابة كل البرامج اللي بتقرأ الملف ده من أول وجديد! الداتابيز حلت الكارثة دي بـ 'Program-Data Independence'.. هيكل البيانات متخزن لوحده في الكتالوج، وتقدر تعدل فيه وتضيف أعمدة بدون ما تكسر برامج المستخدمين أو تعيد كتابتها.",
          keywords: [
            { en: "Data Abstraction", ar: "تجريد البيانات وإخفاء تفاصيل التخزين الفيزيائي" },
            { en: "Program-Data Independence", ar: "استقلالية البرامج عن بنية البيانات المخزنة" },
            { en: "Program-Operation Independence", ar: "استقلالية البرامج عن كيفية تنفيذ العمليات" }
          ],
          tricks: "⚡ فخ امتحان خطير: في أنظمة الملفات القديمة (File Systems) الـ Data structure بتكون مكتوبة هاردكود جوه برنامج المستخدم، لكن في الـ DBMS بتكون مفصولة ومخزنة في الـ Catalog.",
          quiz: {
            question: "القدرة على تعديل هيكل وبنية البيانات المخزنة دون الحاجة لتعديل أو إعادة كتابة البرامج التطبيقية التي تصل إليها تُعرف بـ:",
            options: [
              "Program-data independence",
              "Data redundancy",
              "Database replication",
              "Manual filing"
            ],
            correct: 0,
            explanation: "استقلالية البرامج عن البيانات (Program-data independence) تفصل تعريف البيانات عن كود البرامج."
          }
        },
        {
          num: 17,
          title: "Data Abstraction & Support of Multiple Views",
          arabicTitle: "تجريد البيانات ودعم الرؤى المتعددة (Multiple Views)",
          image: "materials/slides/db-lec2/slide_17.png",
          coreSummary: "استخدام الـ Data Model لإخفاء تفاصيل التخزين، وتقديم رؤى مخصصة (Views) لكل مستخدم تقتصر على البيانات التي تخصه فقط.",
          colloquial: "تخيل إن طالب وموظف شؤون طلاب ومدير الحسابات داخلين على نفس الداتابيز:\n- الطالب بيشوف درجاته بس ومش من حقه يشوف درجات زمايله.\n- الحسابات بتشوف المصاريف والمدفوعات وملهاش دعوة بدرجات المواد.\nدي خاصية الـ 'Multiple Views'.. كل فئة من المستخدمين الـ DBMS بيعملها شباك أو منظر خاص بيها للبيانات اللي تهمها وتخص صلاحياتها.",
          keywords: [
            { en: "Multiple Views", ar: "توفير رؤى وواجهات بيانات متعددة ومخصصة لكل مستخدم" },
            { en: "Data Model", ar: "نموذج البيانات الذي يخفي تفاصيل التخزين الفيزيائي المعقدة" }
          ],
          tricks: "💡 في الأمان (Security): خاصية الـ Views بتستخدم كأداة حماية قوية، لأنك بتمنع الموظف إنه يشوف الجداول الحساسة وبتديله View بالبيانات المسموح له بها فقط.",
          quiz: {
            question: "أي خاصية من خصائص الـ DBMS تسمح لكل مستخدم برؤية جزء مخصص ومحدد من البيانات بما يناسب وظيفته وصلاحياته فقط؟",
            options: [
              "Single-user mode",
              "Support of multiple views of the data",
              "File processing lock",
              "Data duplication"
            ],
            correct: 1,
            explanation: "دعم الرؤى المتعددة (Multiple Views) يمنح كل مستخدم شاشة وبيانات مقتطعة ومخصصة لاحتياجاته."
          }
        },
        {
          num: 18,
          title: "Sharing of Data & Multi-user Transaction Processing (OLTP)",
          arabicTitle: "مشاركة البيانات، معالجة المعاملات والتزامن (OLTP)",
          image: "materials/slides/db-lec2/slide_18.png",
          coreSummary: "دعم مئات المستخدمين المتزامنين، التحكم في التزامن (Concurrency control)، الاسترجاع بعد الأعطال (Recovery subsystem)، وتطبيقات الـ OLTP الحية.",
          colloquial: "تخيل اتنين بيحجزوا آخر كرسي في الطيارة في نفس اللحظة بالثانية! لو مفيش نظام داتابيز قوي الكرسي هيتباع للاثنين والسيستم يخرب.. الـ DBMS عنده ميزة الـ 'Concurrency Control' بتضمن إن كل معاملة (Transaction) تتنفذ بدقة ونظام بدون ما يحصل تضارب، ونظام 'Recovery' يرجع الداتا لو النور قطع أو السيرفر هنج فجأة.",
          keywords: [
            { en: "Concurrency Control", ar: "التحكم في التزامن ومنع تضارب العمليات المتزامنة" },
            { en: "Recovery Subsystem", ar: "نظام التعافي وضمان تسجيل العمليات المكتملة بأمان" },
            { en: "OLTP", ar: "معالجة المعاملات الحية عبر الإنترنت (آلاف المعاملات في الثانية)" }
          ],
          tricks: "🔥 تريكة: Concurrency Control بيضمن الـ Isolation، والـ Recovery بيضمن الـ Durability والـ Atomicity (وهي خصائص الـ ACID الشهيرة في الداتابيز).",
          quiz: {
            question: "المكون المسؤول داخل الـ DBMS عن منع حدوث أخطاء وتضارب عند قيام عدة مستخدمين بتعديل نفس البيانات في نفس اللحظة هو:",
            options: [
              "Compiler Subsystem",
              "Concurrency Control Subsystem",
              "View Generator",
              "Storage Allocator"
            ],
            correct: 1,
            explanation: "الـ Concurrency Control هو المسؤول عن إدارة وصول المستخدمين المتزامنين وحماية البيانات من التضارب."
          }
        },
        {
          num: 19,
          title: "Database Users Categories",
          arabicTitle: "تصنيف مستخدمي قواعد البيانات (على المسرح وخلف الكواليس)",
          image: "materials/slides/db-lec2/slide_19.png",
          coreSummary: "المستخدمون ينقسمون إلى فئتين: فاعلون على المسرح (Actors on the Scene) الذين يستخدمون ويصممون محتوى قاعدة البيانات، وعاملون خلف الكواليس (Workers Behind the Scene) الذين يطورون برمجيات الـ DBMS وأدواته.",
          colloquial: "الدكتورة بتشبه مستخدمي الداتابيز بمسرحية كبيرة:\n1. Actors on the Scene (الممثلين على المسرح): دول اللي بيتعاملوا مع محتوى الداتابيز وتطبيقاتها مباشرة (زي الـ DBA، ومصممي الداتابيز، والمستخدمين).\n2. Workers Behind the Scene (عمال الإضاءة والديكور خلف الكواليس): دول مهندسي الشركات اللي برمجوا وصنعوا محرك أوراكل أو مايكروسوفت نفسه ومش مهتمين ببيانات جامعتك بشكل خاص بل بالسيرفر وأدواته.",
          keywords: [
            { en: "Actors on the Scene", ar: "المتعاملون مباشرة مع محتوى وتطبيقات قاعدة البيانات" },
            { en: "Workers Behind the Scene", ar: "المطورون لبرمجيات الـ DBMS والمعدات والأدوات الأساسية" }
          ],
          tricks: "⚠️ تريكة امتحان شائعة جداً: بيجيبلك وظيفة ويسألك هل هي Actor on the scene ولا Worker behind the scene؟ انتبه للفرق!",
          quiz: {
            question: "مطور برامج الـ DBMS نفسه (DBMS System Implementor) يُعتبر ضمن أي فئة من فئات المستخدمين؟",
            options: [
              "Actors on the Scene",
              "Workers Behind the Scene (خلف الكواليس)",
              "Parametric End Users",
              "Casual Users"
            ],
            correct: 1,
            explanation: "مطور برمجيات الـ DBMS هو من صناع النظام خلف الكواليس (Workers Behind the Scene)."
          }
        },
        {
          num: 20,
          title: "Actors on the Scene: Database Administrators & Designers",
          arabicTitle: "الفاعلون على المسرح: مدير قاعدة البيانات ومصممها",
          image: "materials/slides/db-lec2/slide_20.png",
          coreSummary: "مسؤوليات الـ DBA تشمل الصلاحيات، مراقبة الكفاءة، وشراء الموارد. ومسؤوليات الـ Database Designers تشمل تحديد الهيكل والقيود والتواصل مع المستخدمين.",
          colloquial: "قارن بين الاتنين دول كويس جداً:\n- الـ DBA (المدير الكبير): ده المسؤول عن الصلاحيات، الأمان، الباك أب، ومراقبة سرعة وسيرفرات الداتابيز.\n- الـ Database Designer (المهندس المعماري): ده اللي بيقعد مع العملاء يفهم طلباتهم ويصمم الجداول والقيود والعلاقات المناسبة.",
          keywords: [
            { en: "Database Administrator (DBA)", ar: "مدير النظام: الصلاحيات، الأمان، المراقبة والموارد" },
            { en: "Database Designer", ar: "مصمم القاعدة: تحديد البنية والقيود والكيانات" }
          ],
          tricks: "⚡ فخ امتحان: مين اللي بيدي صلاحيات الدخول (Authorizing access)؟ هو الـ DBA فقط وليس المصمم!",
          quiz: {
            question: "من هو الشخص المسؤول عن إعطاء صلاحيات الدخول ومراقبة أداء السيرفرات وإدارة النسخ الاحتياطي في نظام قواعد البيانات؟",
            options: [
              "Database Designer",
              "Database Administrator (DBA)",
              "Tool Developer",
              "Casual End User"
            ],
            correct: 1,
            explanation: "الـ DBA هو صاحب الصلاحيات والمسؤول عن الأمان وإدارة موارد وكفاءة النظام."
          }
        },
        {
          num: 21,
          title: "Database End Users: Casual vs Naïve/Parametric Users",
          arabicTitle: "المستخدمون النهائيون: العرضيون والسطحيون (Parametric)",
          image: "materials/slides/db-lec2/slide_21.png",
          coreSummary: "المستخدمون العرضيون (Casual) يدخلون بين الحين والآخر بطلبات مختلفة، والمستخدمون السطحيون (Naïve/Parametric) يشكلون الغالبية العظمى وينفذون معاملات مجهزة مسبقاً (Canned transactions) مثل موظفي البنوك ومستخدمي تطبيقات الموبايل.",
          colloquial: "ركز في الفرق الجوهري:\n- الـ Casual: زي المدير اللي بيدخل مرة في الشهر يطلب تقرير مبيعات استثنائي.\n- الـ Naïve / Parametric: دول معظم الناس! زي موظف شباك البنك (Bank Teller) أو حجز الطيران أو إنت وأنت بتستخدم إنستجرام وفيسبوك.. بتدوس على أزرار جاهزة مبرمجة سلفاً بتنفذ عمليات بنسميها 'Canned Transactions'.",
          keywords: [
            { en: "Casual End Users", ar: "مستخدمون يدخلون نادراً باستعلامات متنوعة" },
            { en: "Naïve / Parametric Users", ar: "أكبر فئة: يستخدمون معاملات جاهزة مسبقاً (Canned Transactions)" },
            { en: "Canned Transactions", ar: "معاملات برمجية نمطية مسبقة الإعداد والبرمجة" }
          ],
          tricks: "🔥 سؤال امتحان لا يخلو منه أي اختبار: 'Bank tellers and mobile app users are categorized as:' الإجابة فوراً: Naïve or Parametric End Users.",
          quiz: {
            question: "موظفو شبابيك البنوك ومستخدمو تطبيقات التواصل الاجتماعي يُصنفون في قواعد البيانات ضمن:",
            options: [
              "Sophisticated Users",
              "Naïve / Parametric End Users",
              "Database Administrators",
              "Workers Behind the Scene"
            ],
            correct: 1,
            explanation: "هم Parametric Users لأنهم يستخدمون دوال ووظائف جاهزة مسبقاً (Canned Transactions)."
          }
        },
        {
          num: 22,
          title: "Database End Users: Sophisticated vs Stand-alone Users",
          arabicTitle: "المستخدمون المتطورون والمستقلون (Personal DB)",
          image: "materials/slides/db-lec2/slide_22.png",
          coreSummary: "المتطورون (Sophisticated) مثل العلماء ومحللي الأعمال والمهندسين الذين يكتبون استعلامات معقدة. والمستقلون (Stand-alone) يحتفظون بقواعد بيانات شخصية عبر برامج جاهزة مثل برامج الضرائب أو ألبومات الصور.",
          colloquial: "الفئتين الباقيين من الـ End Users:\n- Sophisticated (المحترفين والخبراء): زي علماء البيانات ومحللي الذكاء الاصطناعي، بيكتبوا كود واستعلامات معقدة جداً ويطلعوا نماذج رياضية.\n- Stand-alone (المستقلين): شخص بيستخدم برنامج إدارة صور أو برنامج حسابات شخصية بينزل معاه داتابيز محلية صغيرة على جهازه.",
          keywords: [
            { en: "Sophisticated Users", ar: "علماء ومهندسون ومحللون ملمون بقدرات النظام المتقدمة" },
            { en: "Stand-alone Users", ar: "مستخدمون عاديون لقواعد بيانات شخصية محلية جاهزة" }
          ],
          tricks: "💡 في الأسئلة: Business analysts & scientists -> Sophisticated، بينما الشخص اللي بيستخدم برنامج ضرائب شخصي -> Stand-alone.",
          quiz: {
            question: "محللو الأعمال والعلماء والمهندسون الذين يستغلون كامل إمكانيات الـ DBMS وينفذون استعلامات متقدمة هم:",
            options: [
              "Naïve Users",
              "Stand-alone Users",
              "Sophisticated End Users",
              "System Operators"
            ],
            correct: 2,
            explanation: "هم Sophisticated Users لمعرفتهم المتعمقة بقدرات النظام وقدرتهم على بناء استعلامات تخصصية."
          }
        },
        {
          num: 23,
          title: "System Analysts, Application Programmers & Business Analysts",
          arabicTitle: "محللو النظم ومبرمجو التطبيقات ومحللو البيانات الضخمة",
          image: "materials/slides/db-lec2/slide_23.png",
          coreSummary: "محلل النظم (System Analyst) يفهم متطلبات المستخدم ويحدد المعاملات. مبرمج التطبيقات (Application Programmer) يكتب الكود ويختبره. محلل الأعمال (Business Analyst) يحلل البيانات الضخمة لاتخاذ القرارات.",
          colloquial: "فريق الـ IT المسؤول عن التطبيقات:\n- System Analyst: يقعد مع العميل ويفهم هو محتاج إيه ويرسم خطة النظام.\n- Application Programmer: يترجم الخطة دي لكود وشاشات ويسلمها شغالة ومتجربة.\n- Business Analyst: يمسك الملايين من سجلات البيانات يحللها ويقول للإدارة نعمل عروض على إيه ونكسب إزاي (Big Data Analysis).",
          keywords: [
            { en: "System Analyst", ar: "محلل النظم ومحدد المتطلبات" },
            { en: "Application Programmer", ar: "مبرمج ومطور ومختبر التطبيقات" },
            { en: "Business Analyst", ar: "محلل بيانات الأعمال والـ Big Data لدعم القرار" }
          ],
          tricks: "⚡ لاحظ: هؤلاء الأشخاص يتبعون فئة 'Actors on the Scene' لأنهم يبنون ويستخدمون تطبيقات تتصل بقاعدة البيانات مباشرة.",
          quiz: {
            question: "الشخص المسؤول عن فهم متطلبات المستخدمين وتصميم المعاملات النمطية (Canned Transactions) ليقوم المبرمج بكتابتها هو:",
            options: [
              "System Analyst",
              "Database Operator",
              "Casual User",
              "Tool Developer"
            ],
            correct: 0,
            explanation: "محلل النظم (System Analyst) هو همزة الوصل الذي يحلل المتطلبات ويصمم مواصفات المعاملات."
          }
        },
        {
          num: 24,
          title: "Workers Behind the Scene: Designers, Tool Developers & Operators",
          arabicTitle: "العاملون خلف الكواليس: صناع محركات الـ DBMS ومطورو الأدوات",
          image: "materials/slides/db-lec2/slide_24.png",
          coreSummary: "مصممو الـ DBMS يبنون حزم النظام الأساسية، مطورو الأدوات (Tool Developers) يبنون برامج مساعدة كأدوات التصميم والمراقبة، وفنيو التشغيل (Operators) يديرون السيرفرات والأجهزة.",
          colloquial: "الجنود المجهولين خلف الكواليس:\n- System Designers and Implementers: مهندسي شركة أوراكل أو مايكروسوفت اللي صمموا كود الـ DBMS نفسه ومحرك الـ SQL الداخلي.\n- Tool Developers: اللي بيعملوا برامج مساعدة زي أدوات رسم الـ ERD أو برامج مراقبة أداء السيرفرات (Monitoring Tools).\n- Operators & Maintenance: مسؤولي الهاردوير والكهرباء والتهوية وتبريد الداتا سنتر.",
          keywords: [
            { en: "DBMS Implementers", ar: "مطورو ومبرمجو حزمة الـ DBMS ذاتها" },
            { en: "Tool Developers", ar: "صناع أدوات التصميم والمحاكاة والمراقبة" },
            { en: "Operators & Maintenance", ar: "مسؤولو بيئة التشغيل الفيزيائية وصيانة السيرفرات" }
          ],
          tricks: "🔥 فخ امتحاني: الـ Database Designer هو Actor on the scene، بينما الـ DBMS Designer هو Worker behind the scene! فرق كبير بين مصمم قاعدة بيانات شركة ومصمم محرك الـ DBMS نفسه!",
          quiz: {
            question: "المهندسون الذين يصممون أدوات مساعدة ونمذجة ومراقبة الأداء لأنظمة قواعد البيانات يُصنفون كـ:",
            options: [
              "Tool Developers (خلف الكواليس)",
              "Casual Users",
              "Database Designers (على المسرح)",
              "Parametric Users"
            ],
            correct: 0,
            explanation: "مطورو الأدوات (Tool Developers) هم من فئة العاملين خلف الكواليس (Workers Behind the Scene)."
          }
        },
        {
          num: 25,
          title: "Advantages: Controlling Redundancy & Restricting Unauthorized Access",
          arabicTitle: "مميزات الداتابيز: منع تكرار البيانات وتقييد الوصول غير المصرح به",
          image: "materials/slides/db-lec2/slide_25.png",
          coreSummary: "التحكم في التكرار (Controlling redundancy) يحفظ البيانات في مكان منطقي واحد عبر الـ Normalization مما يوفر المساحة ويمنع التناقض، وتقييد الصلاحيات عبر الـ DBA.",
          colloquial: "أهم ميزتين خلا الداتابيز تكتسح:\n1. منع التكرار (Controlling Redundancy): زمان كل قسم كان بيكتب اسم الطالب وعنوانه في ملف لوحده، لو الطالب غير عنوانه كان بيحصل تضارب فظيع! في الداتابيز الاسم بيتخزن في جدول واحد بس وأي حد بيقرأ منه.\n2. الأمان (Security): مش أي موظف يشوف مرتبات زمايله.. الـ DBA بيحدد مين يقدر يقرأ ومين يقدر يعدل بدقة متناهية.",
          keywords: [
            { en: "Data Redundancy", ar: "تكرار البيانات غير المرغوب فيه ومشاكل التناقض" },
            { en: "Data Normalization", ar: "التطبيع لتخزين كل معلومة في مكان واحد فقط" },
            { en: "Restricting Access", ar: "منع الوصول غير المصرح به وضبط الصلاحيات" }
          ],
          tricks: "⚡ في الامتحانات: تخزين نفس المعلومة في أكثر من مكان يؤدي إلى ظاهرة اسمها 'Data Inconsistency' (تناقض البيانات عند تعديل جهة ونسيان الأخرى).",
          quiz: {
            question: "من أهم مميزات منهجية قواعد البيانات تخزين كل معلومة في مكان واحد فقط لمنع التناقض وتوفير المساحة، وهي عملية تُعرف بـ:",
            options: [
              "Data Redundancy",
              "Data Normalization",
              "Data Duplication",
              "Temporary Logging"
            ],
            correct: 1,
            explanation: "عملية الـ Normalization تضمن تخزين كل بيان في مكانه الصحيح دون تكرار زائد."
          }
        },
        {
          num: 26,
          title: "Advantages: Persistent Storage, Indexes, Backup & Recovery",
          arabicTitle: "المميزات: استمرارية البيانات، الفهارس، والنسخ الاحتياطي",
          image: "materials/slides/db-lec2/slide_26.png",
          coreSummary: "توفير التخزين الدائم لعناصر البرامج (Persistent Storage)، هياكل تخزين متقدمة وفهارس (Indexes) لتسريع الاستعلامات، وخدمات النسخ الاحتياطي والاستعادة التلقائية.",
          colloquial: "مميزات تقنية لا غنى عنها:\n- التخزين الدائم (Persistent): البيانات بتفضل محفوظة ومش بتطير لما البرنامج يقفل.\n- الفهارس (Indexes): زي فهرس الكتاب، الـ DBMS بيعمل فهارس عشان لما تبحث في مليون طالب يلاقي الاسم في جزء من الثانية بدون ما يقعد يلف عليهم واحد واحد!\n- Backup & Recovery: حماية أوتوماتيك للبيانات عند حدوث أي عطل مفاجئ.",
          keywords: [
            { en: "Persistent Storage", ar: "التخزين الدائم غير المتطاير" },
            { en: "Indexes", ar: "الفهارس لتسريع البحث ومعالجة الاستعلامات بكفاءة" },
            { en: "Backup and Recovery", ar: "النسخ الاحتياطي والاستعادة في حالات الطوارئ" }
          ],
          tricks: "💡 وظيفة الـ Indexes في الامتحانات: الغرض الوحيد منها هو 'Efficient Query Processing' وتسريع عمليات البحث والاسترجاع.",
          quiz: {
            question: "ما هو الغرض الأساسي من استخدام هياكل الفهارس (Indexes) في قواعد البيانات؟",
            options: [
              "زيادة استهلاك مساحة الهارد ديسك فقط",
              "تسريع استرجاع البيانات ومعالجة الاستعلامات بكفاءة (Efficient Query Processing)",
              "منع المستخدمين من كتابة لغة SQL"
            ],
            correct: 1,
            explanation: "الفهارس (Indexes) تمكن محرك الـ DBMS من الوصول للبيانات بسرعة هائلة دون الحاجة لمسح كامل الجدول."
          }
        },
        {
          num: 27,
          title: "Advantages: Complex Relationships, Integrity Constraints & Triggers",
          arabicTitle: "المميزات: تمثيل العلاقات المعقدة، قيود التكامل، والـ Triggers",
          image: "materials/slides/db-lec2/slide_27.png",
          coreSummary: "تمثيل العلاقات المعقدة بين البيانات، فرض قيود التكامل تلقائياً (Integrity Constraints)، واستنباط ردود الأفعال عبر القواعد النشطة والـ Triggers.",
          colloquial: "الـ DBMS ذكي جداً:\n- بيقدر يربط علاقات معقدة زي إن الطالب ليه دكتور مشرف، ومسجل في 5 مواد، وكل مادة ليها سكشنين ومواعيد مختلفة.\n- قيود التكامل (Integrity Constraints): بيمنعك تضيف طالب عمره بالسالب، أو تضيف درجة مادة لطالب رقمه مش موجود أصلاً!\n- Triggers: لو رصيد حساب العميل قل عن الصفر يبعت له رسالة تحذيرية أوتوماتيك.",
          keywords: [
            { en: "Complex Relationships", ar: "العلاقات المتشابكة بين الكيانات" },
            { en: "Integrity Constraints", ar: "قواعد صحة وتكامل البيانات الإجبارية" },
            { en: "Active Rules & Triggers", ar: "القواعد النشطة والمشغلات التلقائية للتعامل مع الأحداث" }
          ],
          tricks: "⚠️ تريكة: قيود التكامل (Integrity Constraints) يتم تطبيقها والتأكد منها بواسطة الـ DBMS نفسه وليس كود الواجهة فقط!",
          quiz: {
            question: "القيد الذي يمنع إدخال قيمة درجة لطالب غير مسجل في جدول الطلاب يُعتبر مثالاً على:",
            options: [
              "Data Redundancy",
              "Integrity Constraint (قيد التكامل)",
              "View Expansion",
              "Stand-alone Process"
            ],
            correct: 1,
            explanation: "هو قيد تكامل (Referential Integrity Constraint) يضمن صحة وترابط البيانات بين الجداول."
          }
        },
        {
          num: 28,
          title: "Additional Implications: Enforcing Standards & Reduced Development Time",
          arabicTitle: "آثار إضافية: فرض المعايير القياسية وتقليل وقت التطوير",
          image: "materials/slides/db-lec2/slide_28.png",
          coreSummary: "فرض المعايير القياسية على مستوى المؤسسة (Standards) لأسماء البيانات وشاشات العرض والتقارير، وتقليل الوقت والتكلفة اللازمة لبناء وتطوير تطبيقات جديدة.",
          colloquial: "فوائد على مستوى إدارة الشركات الكبيرة:\n- Enforcing Standards: الشركة كلها بتوحد أسماء الأعمدة والشاشات وصيغ التاريخ، مش كل مبرمج يسمي على مزاجه!\n- Reduced Development Time: لما تحب تعمل تطبيق جديد (زي تطبيق أندرويد لخدمات الطلاب)، الداتابيز جاهزة وبياخد وقت وتكلفة أقل بكتير من لو كنت هتبني كل حاجة من الصفر.",
          keywords: [
            { en: "Enforcing Standards", ar: "توحيد المعايير والمصطلحات في المؤسسة" },
            { en: "Reduced Development Time", ar: "تسريع وتسهيل إطلاق تطبيقات برمجية جديدة" }
          ],
          tricks: "💡 في الشركات الكبرى: توحيد الـ Standards بيسهل دمج بيانات الأقسام المختلفة مع بعضها دون تعارض.",
          quiz: {
            question: "أي من الآتي يُعد من الفوائد الإضافية لمنهجية قواعد البيانات في الشركات الكبرى والمؤسسات؟",
            options: [
              "توحيد وفرض المعايير القياسية لأسماء البيانات وشاشات العرض (Enforcing Standards)",
              "زيادة التكرار والتناقض بين الأقسام",
              "إلزام كل موظف بامتلاك سيرفر خاص"
            ],
            correct: 0,
            explanation: "الـ DBMS يمكن المؤسسة من توحيد المعايير (Standards) وتقليل زمن بناء التطبيقات."
          }
        },
        {
          num: 29,
          title: "Flexibility, Real-time Availability & Economies of Scale",
          arabicTitle: "المرونة، التوافر الفوري للمعلومات واقتصاديات الحجم",
          image: "materials/slides/db-lec2/slide_29.png",
          coreSummary: "مرونة تعديل هياكل البيانات مع تطور المتطلبات، التوافر الفوري للمعلومات في المعاملات الحية (حجوزات الطيران والفنادق)، واقتصاديات الحجم (Economies of scale) بمنع إهدار الموارد.",
          colloquial: "تلات مزايا عملاقة في البزنس:\n1. Flexibility: الكلية قررت تضيف رقم بطاقة الطالب أو رقم الموبايل؟ تقدر تضيف العمود ده في ثانية دون التأثير على السيستم القديم.\n2. Availability of Current Information: ضرورية جداً في مواقع الحجز زي حجز تذاكر الماتشات أو الطيران؛ المقعد اللي بيتحجز بيسمع فوراً عند كل الناس في التو واللحظة.\n3. Economies of scale: دمج السيرفرات وقواعد البيانات بيوفر ملايين الجنيهات كانت هتتصرف على أجهزة متكررة لكل قسم لوحده.",
          keywords: [
            { en: "Flexibility", ar: "مرونة وسهولة تعديل وتطوير هيكل البيانات" },
            { en: "Real-time Availability", ar: "توافر أحدث البيانات لحظياً لكافة الأنظمة المتصلة" },
            { en: "Economies of Scale", ar: "اقتصاديات الحجم وتوفير تكاليف الأجهزة والكوادر" }
          ],
          tricks: "🔥 مثال امتحاني شهير: Online shopping & Airline reservation systems يعتمدون أساساً على خاصية 'Availability of current information'.",
          quiz: {
            question: "أنظمة حجز تذاكر الطيران والفنادق والمتاجر الإلكترونية تعتمد بشكل أساسي على أي من مزايا قواعد البيانات؟",
            options: [
              "Availability of current information (التوافر اللحظي للبيانات المحدثة)",
              "Manual data entry",
              "Batch processing overnight only",
              "Data fragmentation"
            ],
            correct: 0,
            explanation: "لأن أي حجز يجب أن ينعكس في نفس اللحظة لمنع الحجز المزدوج للمقعد."
          }
        },
        {
          num: 30,
          title: "Lecture Summary & When NOT to Use a DBMS",
          arabicTitle: "ملخص المحاضرة ومتى لا نستخدم قواعد البيانات؟ (سؤال فاينال)",
          image: "materials/slides/db-lec2/slide_30.png",
          coreSummary: "ملخص المحاضرة كاملة، وسؤال ذهبي متكرر: متى يُفضل عدم استخدام نظام DBMS؟ (التكلفة العالية، التطبيقات البسيطة جداً، متطلبات الزمن الحقيقي الصارمة Real-time، وعدم الحاجة لمشاركة البيانات).",
          colloquial: "سلايد الختام وأهم سؤال بييجي في نهاية الفاينال: 'هل دايماً لازم نستخدم DBMS؟'\nالإجابة: لأ طبعاً! في حالات مينفعش نستخدم فيها DBMS:\n1. لو التكلفة عالية جداً (Overhead) والسوفت وير غالي وإنت مشروعك تافه وصغير.\n2. لو التطبيق بسيط جداً ومش محتاج حماية ولا تداول (زي مفكرة شخصية).\n3. لو السيستم محتاج Real-Time بالمللي ثانية وميقدرش يستحمل أي تأخير من الـ DBMS (زي أنظمة فرامل العربيات أو صواريخ الفضاء).\n4. لو الداتابيز مستخدم واحد فقط اللي بيستخدمها ومفيش أي حاجة لمشاركتها عبر شبكة.",
          keywords: [
            { en: "High Overhead Cost", ar: "التكلفة العالية للسوفت وير والهاردوير والكوادر" },
            { en: "Strict Real-time Constraints", ar: "الأنظمة ذات المتطلبات اللحظية الصارمة" },
            { en: "When NOT to use DBMS", ar: "حالات عدم استخدام قواعد البيانات" }
          ],
          tricks: "🔥 سؤال فاينال حتمي: 'State two cases where using a DBMS may be unnecessary or undesirable?'\nاحفظ الإجابة دي: 1) High initial investment and overhead cost. 2) Strict real-time constraints that cannot tolerate DBMS overhead.",
          quiz: {
            question: "أي من الحالات التالية يُفضل فيها عدم استخدام نظام إدارة قواعد بيانات معقد (DBMS)؟",
            options: [
              "الأنظمة ذات المتطلبات اللحظية الصارمة (Strict real-time constraints) أو التطبيقات البسيطة لشخص واحد",
              "أنظمة البنوك والمستشفيات العملاقة",
              "مواقع حجز الطيران العالمية"
            ],
            correct: 0,
            explanation: "في الأنظمة ذات السرعة الحرجة الصارمة أو البرامج الشخصية البسيطة، تكلفة وتعقيد الـ DBMS تكون عبئاً غير ضروري (Overhead)."
          }
        }
      ]
    }
  }
};

if (typeof window !== "undefined") {
  window.LECTURE_EXPLANATIONS = LECTURE_EXPLANATIONS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = LECTURE_EXPLANATIONS;
}
