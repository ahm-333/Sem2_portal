/**
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
  // مادة قواعد البيانات (database-systems) - المحاضرة 2
  // ============================================================================
  "database-systems": {
    2: {
      courseId: "database-systems",
      lectureId: 2,
      courseName: "Database Systems (IS211)",
      lectureTitle: "Database System Concepts and Architecture",
      lectureArabicTitle: "مفاهيم وهيكلية أنظمة قواعد البيانات ومعمارية الـ Three-Schema",
      totalSlides: 30,
      slides: [
        {
          num: 1,
          title: "Database systems - Course Overview",
          arabicTitle: "غلاف المحاضرة وبيانات المادة",
          image: "materials/slides/db-lec2/slide_1.png",
          coreSummary: "المحاضرة تقديم د. أسماء حنفي علي غنيمي - أستاذ مساعد بقسم نظم المعلومات بكلية الحاسبات والمعلومات جامعة الزقازيق.",
          explanationIntro: "شريحة الافتتاح والتعريف بالمقرر؛ مادة أنظمة قواعد البيانات هي الأساس الجوهري لأي مهندس برمجيات أو متخصص في الذكاء الاصطناعي، إذ لا يمكن بناء أي نظام ذكي أو تطبيق عملي دون إدارة وتخزين بياناته بكفاءة وموثوقية.",
          points: [
            {
              badge: "Course",
              title: "طبيعة المقرر وأهميته",
              desc: "المقرر يربط بين الفهم المعماري النظري لكيفية عمل محركات قواعد البيانات، وبين التطبيق العملي للغة SQL وتصميم المخططات."
            },
            {
              badge: "Department",
              title: "القسم الأكاديمي المشرف",
              desc: "قسم نظم المعلومات (Information Systems) بكلية الحاسبات والمعلومات - جامعة الزقازيق."
            }
          ],
          keywords: [
            { en: "Information Systems", ar: "نظم المعلومات" },
            { en: "Database Systems", ar: "أنظمة قواعد البيانات" }
          ],
          tricks: "المفاهيم النظرية في هذا الفصل هي محل أسئلة الـ Multiple Choice وأسئلة الصح والخطأ في امتحانات الميدتيرم والفاينل، خاصة الفروق بين المصطلحات الأساسية.",
          quiz: {
            question: "Which academic department is responsible for delivering this Database Systems course?",
            options: [
              "Information Systems Department (IS)",
              "Computer Science Department (CS)",
              "Basic Science Department"
            ],
            correct: 0,
            explanation: "The course is presented by the Information Systems Department (IS) at the Faculty of Computers and Informatics."
          }
        },
        {
          num: 2,
          title: "Database Concepts & Course Objectives",
          arabicTitle: "أهداف المقرر والمفاهيم الأساسية",
          image: "materials/slides/db-lec2/slide_2.png",
          coreSummary: "المقرر يركز على أساسيات تصميم ونمذجة وتطبيق أنظمة قواعد البيانات، لغات الـ DBMS والـ Data Models، وتقنيات تنفيذ الأنظمة.",
          explanationIntro: "توضح الدكتورة هنا الأهداف التعليمية للمقرر؛ الهدف ليس مجرد كتابة استعلامات SQL عادية، بل فهم كيفية تصميم قاعدة البيانات من الصفر واختيار النموذج الأنسب واستيعاب تقنيات المعالجة الداخلية للمحرك.",
          points: [
            {
              badge: "1. Modeling",
              title: "نمذجة البيانات (Data Modeling)",
              desc: "تحويل متطلبات العالم الحقيقي إلى مخططات مفاهيمية مثل مخطط الكيانات والعلاقات (ERD)."
            },
            {
              badge: "2. Design",
              title: "التصميم والتطبيع (Database Design & Normalization)",
              desc: "هيكلة الجداول بطريقة تمنع تكرار البيانات وتضمن تكاملها وسلامتها المنطقية."
            },
            {
              badge: "3. Implementation",
              title: "تقنيات التنفيذ (Implementation Techniques)",
              desc: "فهم كيفية عمل الـ Storage، والـ Indexing، ومعالجة المعاملات (Transactions) والأمان."
            }
          ],
          keywords: [
            { en: "Database Modeling", ar: "نمذجة قواعد البيانات" },
            { en: "Database Design", ar: "تصميم قواعد البيانات" },
            { en: "Implementation Techniques", ar: "تقنيات التنفيذ والتطبيق" }
          ],
          tricks: "ركز على أن Database Design يسبق مرحلة الـ Implementation، وأي خطأ في مرحلة التصميم يكلف وقتاً كبيراً في مرحلة التشغيل الفعلي.",
          quiz: {
            question: "What is the primary prerequisite step before implementing a database in a DBMS?",
            options: [
              "Database Modeling and Conceptual Design",
              "Writing backend application code",
              "Purchasing dedicated server hardware"
            ],
            correct: 0,
            explanation: "Conceptual modeling and proper database design must always precede database implementation and deployment."
          }
        },
        {
          num: 3,
          title: "Fundamental Database Definitions",
          arabicTitle: "المفاهيم والتعريفات الخمسة الأساسية",
          image: "materials/slides/db-lec2/slide_3.png",
          coreSummary: "التعريفات الجوهرية الخمسة: Data، و Database، و Mini-world (UoD)، و DBMS، و Database System.",
          explanationIntro: "هذه الشريحة من أهم شرائح المحاضرة على الإطلاق، وتتكرر منها أسئلة المصطلحات وأسئلة الصح والخطأ؛ إليك تفكيك كل مفهوم بدقة:",
          points: [
            {
              badge: "1. Data",
              title: "البيانات (Data)",
              desc: "حقائق معروفة ومسجلة ولها معنى ضمني (Known facts that can be recorded and have implicit meaning)."
            },
            {
              badge: "2. Database",
              title: "قاعدة البيانات (Database)",
              desc: "مجموعة من البيانات المترابطة منطقياً (Collection of logically related data) لخدمة غرض محدد."
            },
            {
              badge: "3. Mini-world",
              title: "العالم المصغر (Mini-world / UoD)",
              desc: "الجزء من العالم الحقيقي الذي نمثله ونخزن بياناته في النظام (مثل بيانات طلاب جامعة الزقازيق)."
            },
            {
              badge: "4. DBMS",
              title: "نظام إدارة قواعد البيانات (DBMS)",
              desc: "حزمة برمجية متكاملة تتيح إنشاء وصيانة وتحديث قاعدة البيانات والتحكم في الوصول إليها."
            },
            {
              badge: "5. Database System",
              title: "نظام قاعدة البيانات المتكامل (Database System)",
              desc: "المعادلة الشاملة: برنامج الـ DBMS + البيانات المخزنة + التطبيقات البرمجية التابعة لها."
            }
          ],
          keywords: [
            { en: "Data", ar: "حقائق مسجلة ذات معنى ضمني" },
            { en: "Database", ar: "مجموعة بيانات مترابطة منطقياً" },
            { en: "Mini-world (UoD)", ar: "العالم المصغر الممثل في النظام" },
            { en: "DBMS", ar: "حزمة برمجيات إدارة قاعدة البيانات" },
            { en: "Database System", ar: "نظام قاعدة البيانات المتكامل" }
          ],
          tricks: "انتبه لصيغة الأسئلة: لو قال لك مجموعة بيانات عشوائية ليست Database لأن شرطها 'Logically Related Data'، ولو قال لك Data بدون معنى تكون معلومة ناقصة لأن تعريفها 'Implicit Meaning'.",
          quiz: {
            question: "According to Elmasri & Navathe, which of the following best defines 'Data'?",
            options: [
              "Known facts that can be recorded and have an implicit meaning",
              "Any random collection of numbers without context",
              "A software package used to facilitate queries",
              "A compiled programming binary"
            ],
            correct: 0,
            explanation: "Data is formally defined as known facts that can be recorded and that have an implicit meaning."
          }
        },
        {
          num: 4,
          title: "Simplified Database System Environment",
          arabicTitle: "البيئة المبسطة لنظام قواعد البيانات",
          image: "materials/slides/db-lec2/slide_4.png",
          coreSummary: "المخطط الهيكلي يوضح تفاعل المستخدمين والبرامج مع الـ DBMS، ومكونات الـ Software، والـ Stored Database Definition (Catalog) وقاعدة البيانات المخزنة.",
          explanationIntro: "يوضح هذا المخطط المعماري كيفية سريان الطلبات والاستعلامات داخل النظام من المستخدم وحتى وسائط التخزين:",
          points: [
            {
              badge: "Layer 1",
              title: "المستخدمون والتطبيقات (Users / Application Programs)",
              desc: "الطبقة الخارجية التي ترسل استعلامات ومعاملات (Queries & Transactions) للتعامل مع البيانات."
            },
            {
              badge: "Layer 2",
              title: "برمجيات الـ DBMS (DBMS Software)",
              desc: "تتضمن معالج الاستعلامات (Query Processor) وبرمجيات الوصول إلى البيانات وتطبيق شروط الأمان والتكامل."
            },
            {
              badge: "Layer 3",
              title: "فهرس النظام وقاعدة البيانات المخزنة (Catalog & Stored DB)",
              desc: "فصل هيكل ومخطط البيانات (System Catalog / Metadata) عن ملفات البيانات الفعلية المخزنة على القرص."
            }
          ],
          keywords: [
            { en: "System Catalog", ar: "فهرس النظام (Metadata)" },
            { en: "Stored Database", ar: "قاعدة البيانات المخزنة" },
            { en: "Query Processing", ar: "معالجة الاستعلامات" }
          ],
          tricks: "فهرس النظام (Catalog) هو المكان الذي يخزن فيه الـ DBMS وصف البيانات (Metadata). الـ DBMS يقرأ الـ Catalog أولاً قبل أن يصل للبيانات الفعلية.",
          quiz: {
            question: "Where does the DBMS store the schema definitions, data types, and structural constraints?",
            options: [
              "In the Stored System Catalog (Metadata)",
              "Directly inside the application source code",
              "In operating system registry keys"
            ],
            correct: 0,
            explanation: "The DBMS stores complete schema definitions and constraints in the system catalog (metadata repository)."
          }
        },
        {
          num: 5,
          title: "A Typical University Database Example",
          arabicTitle: "مثال تطبيقي: قاعدة بيانات الجامعة",
          image: "materials/slides/db-lec2/slide_5.png",
          coreSummary: "نموذج توضيحي لقاعدة بيانات جامعية تحتوي على 5 ملفات/جداول مترابطة: STUDENT، COURSE، SECTION، GRADE_REPORT، PREREQUISITE.",
          explanationIntro: "تطرح الدكتورة هذا المثال الكلاسيكي لتجسيد فكرة ترابط البيانات المنطقية في العالم الحقيقي؛ فالجامعة هي Mini-world يضم الكيانات والعلاقات التالية:",
          points: [
            {
              badge: "STUDENT",
              title: "جدول الطلاب (Student Record)",
              desc: "يخزن الاسم ورقم الطالب والتخصص والفرقة الدراسية (Name, Student_number, Class, Major)."
            },
            {
              badge: "COURSE & SECTION",
              title: "المقررات والشعب (Course & Section)",
              desc: "بيانات المواد وأرقام المقررات والشعب المنعقدة خلال الفصول الدراسية والقاعات وأسماء المحاضرين."
            },
            {
              badge: "GRADE_REPORT & PREREQUISITE",
              title: "سجل الدرجات والمتطلبات السابقة",
              desc: "ربط كل طالب بالدرجة التي حصل عليها في شعبة معينة، وتحديد المواد المشترطة قبل التسجيل."
            }
          ],
          keywords: [
            { en: "Logical Relationships", ar: "العلاقات المنطقية بين الجداول" },
            { en: "Entity Records", ar: "سجلات الكيانات" },
            { en: "Referential Integrity", ar: "التكامل المرجعي للعلاقات" }
          ],
          tricks: "لاحظ أن العلاقة بين الطالب ودرجته لا يمكن أن توجد بدون وجود رقم طالب صحيح ورقم شعبة صحيح؛ هذا يمهد لمفهوم التكامل المرجعي (Foreign Keys).",
          quiz: {
            question: "In the University database example, which entity connects a student to a specific grade in a course section?",
            options: [
              "GRADE_REPORT",
              "PREREQUISITE",
              "DEPARTMENT"
            ],
            correct: 0,
            explanation: "The GRADE_REPORT entity associates a student with a specific course section and records their letter grade."
          }
        },
        {
          num: 6,
          title: "Main Characteristics of the Database Approach",
          arabicTitle: "الخصائص الأربع الرئيسية لمنهج قواعد البيانات",
          image: "materials/slides/db-lec2/slide_6.png",
          coreSummary: "المقارنة الجوهرية بين نظام الملفات التقليدي ومنهج الـ Database؛ وتلخص في 4 ركائز تمنح الـ DBMS تفوقه الكاسح.",
          explanationIntro: "شريحة محورية جداً تحدد الفارق بين البرمجة القديمة القائمة على الملفات (Traditional File Processing) وبين منهج قواعد البيانات الحديث:",
          points: [
            {
              badge: "1. Self-describing",
              title: "الطبيعة ذاتية الوصف (Self-Describing Nature)",
              desc: "النظام يحتوي على الكتالوج (Metadata) الذي يصف هيكل البيانات وقيودها ذاتياً."
            },
            {
              badge: "2. Independence",
              title: "فصل البرامج عن البيانات (Program-Data Independence)",
              desc: "تغيير طريقة تخزين البيانات لا يفرض إعادة كتابة وتعديل البرامج والتطبيقات."
            },
            {
              badge: "3. Multiple Views",
              title: "دعم وجهات نظر متعددة (Multiple Views)",
              desc: "كل فئة من المستخدمين ترى فقط البيانات المصرح لها بها والملائمة لطبيعة عملها."
            },
            {
              badge: "4. Multi-user OLTP",
              title: "المشاركة ومعالجة المعاملات (Multi-user & Concurrency)",
              desc: "التحكم في وصول مئات المستخدمين لنفس البيانات في نفس اللحظة دون تعارض أو أخطاء."
            }
          ],
          keywords: [
            { en: "Database Approach", ar: "منهج قواعد البيانات" },
            { en: "Program-Data Independence", ar: "استقلالية البرامج عن البيانات" },
            { en: "Multiple Views", ar: "وجهات النظر المتعددة" },
            { en: "Concurrency Control", ar: "التحكم في التزامن" }
          ],
          tricks: "في نظام الملفات القديم، لو غيرت نوع حقل في ملف يجب أن تعيد تعديل كل البرامج التي تقرأه، أما في الـ DBMS فالبرامج معزولة ومستقلة تماماً.",
          quiz: {
            question: "Which of the following is NOT one of the main characteristics of the database approach?",
            options: [
              "Tight coupling of data structures inside application program code",
              "Self-describing nature of a database system",
              "Insulation between programs and data",
              "Support of multiple views of the data"
            ],
            correct: 0,
            explanation: "Tight coupling between programs and data structures is a flaw of traditional file processing, not the database approach."
          }
        },
        {
          num: 7,
          title: "Characteristic 1: Self-Describing Nature of a Database System",
          arabicTitle: "الخاصية الأولى: الطبيعة ذاتية الوصف وفهرس النظام",
          image: "materials/slides/db-lec2/slide_7.png",
          coreSummary: "نظام الـ DBMS لا يخزن البيانات فقط، بل يخزن تعريفاً ووصفاً شاملاً لها داخل الـ DBMS Catalog (البيانات الوصفية - Meta-data).",
          explanationIntro: "ما يميز الـ DBMS أنه ذكي ومكتفٍ بذاته؛ فهو يمتلك خريطة كاملة لما يحتويه دون الرجوع لكود البرامج الخارجية:",
          points: [
            {
              badge: "Definition",
              title: "ما هو الـ System Catalog؟",
              desc: "مستودع داخلي يخزن بنية الجداول، أسماء الحقول، أنواع البيانات، العلاقات، ومحددات الأمان والقيود."
            },
            {
              badge: "Meta-data",
              title: "البيانات الوصفية (Data About Data)",
              desc: "المصطلح العلمي الأكثر تكراراً: البيانات التي تصف طبيعة وهيكل البيانات الأخرى المخزنة."
            },
            {
              badge: "Universality",
              title: "مرونة محرك الـ DBMS العام",
              desc: "نفس برنامج الـ DBMS يستطيع إدارة مستشفى أو بنك أو جامعة، لأن الاختلاف يكون في الـ Meta-data فقط."
            }
          ],
          keywords: [
            { en: "Meta-data", ar: "بيانات عن البيانات (الوصف الهيكلي)" },
            { en: "System Catalog", ar: "فهرس ومستودع النظام" },
            { en: "Schema Description", ar: "وصف المخطط" }
          ],
          tricks: "سؤال امتحان كلاسيكي: 'Meta-data is defined as...' الإجابة النموذجية هي: Data about data (description of the database structure and constraints).",
          quiz: {
            question: "What term describes the database structure and constraint information stored in the DBMS catalog?",
            options: [
              "Meta-data",
              "Transient memory state",
              "Raw binary payloads",
              "Application bytecode"
            ],
            correct: 0,
            explanation: "Meta-data is defined as 'data about data', which describes the structure, types, and constraints of the stored database."
          }
        },
        {
          num: 8,
          title: "Characteristic 2: Insulation Between Programs and Data",
          arabicTitle: "الخاصية الثانية: استقلالية البرامج عن البيانات والعمليات",
          image: "materials/slides/db-lec2/slide_8.png",
          coreSummary: "استقلالية البرامج عن بنية البيانات وطريقة تخزينها (Program-Data Independence) واستقلاليتها عن خوارزميات العمليات (Program-Operation Independence).",
          explanationIntro: "في هذا المفهوم المعماري الحاسم، يضمن النظام عزل طبقة الكود البرمجي عن طبقة التخزين المادي:",
          points: [
            {
              badge: "Data Independence",
              title: "استقلالية البرامج عن البيانات (Program-Data Independence)",
              desc: "هيكل ملف البيانات مخزن في الكتالوج بشكل منفصل عن برامج الوصول؛ لو قمت بإضافة عمود جديد أو تغيير نوع التخزين لا تتوقف البرامج."
            },
            {
              badge: "Operation Independence",
              title: "استقلالية العمليات (Program-Operation Independence)",
              desc: "تحديد واجهة العملية (Interface: اسمها ومدخلاتها) مفصول تماماً عن خوارزمية تنفيذها الداخلية (Implementation)."
            },
            {
              badge: "Data Abstraction",
              title: "تجريد البيانات (Data Abstraction)",
              desc: "المفهوم الشامل الذي يتيح إخفاء تفاصيل التخزين الداخلية المعقدة وعرض رؤية مفاهيمية مبسطة للمطورين."
            }
          ],
          keywords: [
            { en: "Program-Data Independence", ar: "استقلالية البرامج عن البيانات" },
            { en: "Data Abstraction", ar: "تجريد البيانات وإخفاء تعقيد التخزين" },
            { en: "Interface vs Implementation", ar: "فصل الواجهة عن التنفيذ" }
          ],
          tricks: "تذكر دائماً أن Data Abstraction هي المظلة الكبرى التي تحقق خاصيتي Program-Data Independence و Program-Operation Independence.",
          quiz: {
            question: "Which characteristic allows changing internal storage structures without modifying application programs?",
            options: [
              "Program-data independence",
              "Data redundancy",
              "Single-view restriction",
              "Static schema compilation"
            ],
            correct: 0,
            explanation: "Program-data independence ensures that changes to data storage organization do not require altering application programs."
          }
        },
        {
          num: 9,
          title: "Characteristic 3: Support of Multiple Views of the Data",
          arabicTitle: "الخاصية الثالثة: دعم وجهات النظر المتعددة للمستخدمين",
          image: "materials/slides/db-lec2/slide_9.png",
          coreSummary: "توفر الـ Views رؤى مخصصة ومصغرة لقاعدة البيانات؛ بحيث يرى كل مستخدم أو قسم ما يخصه فقط، مع إخفاء باقي البيانات لأسباب أمنية وتشغيلية.",
          explanationIntro: "في أي مؤسسة كبيرة لا يحتاج الجميع لرؤية كل شيء، ومن هنا جاءت فكرة الـ Multiple Views:",
          points: [
            {
              badge: "View Concept",
              title: "ما هي الـ View؟",
              desc: "جدول افتراضي أو منظور مخصص (Subset of database) يتم بناؤه من البيانات الأساسية لتلبية احتياج مجموعة معينة."
            },
            {
              badge: "Security & Privacy",
              title: "الأمان وحماية الخصوصية",
              desc: "المحاسب يرى المرتبات والرسوم، بينما مسؤول شؤون الطلاب يرى الحضور والغياب؛ كل طرف محجوب عنه تفاصيل الطرف الآخر."
            },
            {
              badge: "Virtual / Derived",
              title: "بيانات مشتقة غير مخزنة فيزيائياً",
              desc: "يمكن للـ View أن تعرض حقولاً محسوبة لحظياً (مثل حساب السن من تاريخ الميلاد أو حساب الـ GPA التراكمي)."
            }
          ],
          keywords: [
            { en: "View", ar: "واجهة عرض افتراضية مخصصة" },
            { en: "Virtual Table", ar: "جدول افتراضي مشتق" },
            { en: "Access Control", ar: "التحكم في وصول البيانات" }
          ],
          tricks: "الـ View لا تخزن البيانات مرتين على القرص، بل هي مجرد استعلام مخزن ينتج نتائج افتراضية عند استدعائه (Virtual Data).",
          quiz: {
            question: "A 'View' in a database system is best described as:",
            options: [
              "A subset or virtual representation of the database tailored to specific users",
              "A permanent physical replica of raw database storage",
              "A backup archive stored on magnetic tape",
              "A hardware display configuration"
            ],
            correct: 0,
            explanation: "A view is a virtual table or customized subset of data that presents a tailored perspective to a specific user group."
          }
        },
        {
          num: 10,
          title: "Characteristic 4: Sharing of Data & Multiuser Transaction Processing",
          arabicTitle: "الخاصية الرابعة: مشاركة البيانات ومعالجة المعاملات المتزامنة",
          image: "materials/slides/db-lec2/slide_10.png",
          coreSummary: "معمارية المعالجة المتزامنة تضمن قدرة آلاف المستخدمين على الاستعلام والتحديث معاً بأمان عبر Concurrency Control ومفهوم الـ Transaction.",
          explanationIntro: "تخيل نظام حجز طيران أو حجز قطارات: آلاف المستخدمين يحاولون حجز نفس المقعد في نفس الثانية؛ كيف يمنع الـ DBMS الكوارث؟",
          points: [
            {
              badge: "Concurrency",
              title: "التحكم في التزامن (Concurrency Control)",
              desc: "برمجيات داخل الـ DBMS تضمن ألا يكتب مستخدمان فوق بعضهما أو يحجزا نفس المورد في نفس اللحظة."
            },
            {
              badge: "Transaction",
              title: "مفهوم المعاملة (The Transaction)",
              desc: "مجموعة عمليات يتم تنفيذها كوحدة واحدة لا تتجزأ (إما تنفذ كاملة أو تُلغى كاملة: All or Nothing)."
            },
            {
              badge: "OLTP",
              title: "معالجة المعاملات الفورية (Online Transaction Processing)",
              desc: "الأنظمة التي تدعم آلاف المعاملات في الثانية الواحدة مثل البنوك ومنصات التجارة الإلكترونية."
            }
          ],
          keywords: [
            { en: "Concurrency Control", ar: "التحكم في التزامن وتضارب البيانات" },
            { en: "Transaction", ar: "المعاملة المنطقية الموحدة" },
            { en: "Isolation", ar: "عزل المعاملات المتزامنة" }
          ],
          tricks: "سؤال متكرر: لو لم تكن هناك Concurrency Control، لحدث ما يسمى بالـ Lost Update (أحد التحديثين يمسح الآخر).",
          quiz: {
            question: "What subsystem in a DBMS ensures that concurrent transactions do not interfere with each other?",
            options: [
              "Concurrency Control Software",
              "Graphic User Interface module",
              "Code compiler optimizer",
              "Disk defragmentation utility"
            ],
            correct: 0,
            explanation: "Concurrency control software guarantees that simultaneous user updates maintain data consistency without interference."
          }
        },
        {
          num: 11,
          title: "Database Users: Overview",
          arabicTitle: "تصنيف مستخدمي قواعد البيانات: في المشهد وخلف الكواليس",
          image: "materials/slides/db-lec2/slide_11.png",
          coreSummary: "ينقسم مستخدمو بيئة قواعد البيانات إلى فئتين رئيسيتين: ممثلون على المسرح (Actors on the Scene) وعمال خلف الكواليس (Workers Behind the Scene).",
          explanationIntro: "في هذه الشريحة تقدم الدكتورة التقسيم الهيكلي لجميع الأشخاص المعنيين بمنظومة قواعد البيانات:",
          points: [
            {
              badge: "Category 1",
              title: "الممثلون في المشهد (Actors on the Scene)",
              desc: "الأشخاص الذين يتعاملون مع قاعدة البيانات المحددة للشركة أو الجامعة بشكل مباشر يومياً (DBA، المصممون، المستخدمون، ومطورو البرامج)."
            },
            {
              badge: "Category 2",
              title: "العاملون خلف الكواليس (Workers Behind the Scene)",
              desc: "الأشخاص الذين يصنعون ويطورون برمجيات الـ DBMS نفسها وأدواتها، ولا يهتمون بمحتوى بيانات الشركة."
            }
          ],
          keywords: [
            { en: "Actors on the Scene", ar: "المتعاملون المباشرون مع قاعدة البيانات" },
            { en: "Workers Behind the Scene", ar: "مطورو ومصنعو محركات الـ DBMS" }
          ],
          tricks: "احفظ هذا التصنيف جيداً: مهندس شركة Oracle الذي يبرمج محرك الـ DBMS هو Worker Behind the Scene، أما مهندس الشركة الذي يدير قاعدة بياناتها فهو Actor on the Scene.",
          quiz: {
            question: "Database administrators, database designers, and end users are categorized as:",
            options: [
              "Actors on the Scene",
              "Workers Behind the Scene",
              "System Compiler Architects"
            ],
            correct: 0,
            explanation: "Users who directly design, manage, and query specific database content are designated as Actors on the Scene."
          }
        },
        {
          num: 12,
          title: "Actors on the Scene: Database Administrators (DBA)",
          arabicTitle: "مدير قاعدة البيانات (DBA) - المهام والمسؤوليات",
          image: "materials/slides/db-lec2/slide_12.png",
          coreSummary: "الـ DBA هو المسؤول الأول عن إدارة المورد الحيوي لقاعدة البيانات؛ وتتضمن أدواره منح الصلاحيات ومراقبة الأداء وشراء السيرفرات وعمل النسخ الاحتياطية.",
          explanationIntro: "وظيفة الـ Database Administrator (DBA) هي واحدة من أعلى الوظائف أجراً ومسؤولية في قطاع تكنولوجيا المعلومات؛ إليك أبرز مهامه:",
          points: [
            {
              badge: "1. Access Control",
              title: "منح الصلاحيات والأمان (Authorizing Access)",
              desc: "تحديد من يدخل إلى أي جدول، وتشفير البيانات، وحمايتها من الاختراق والوصول غير المصرح به."
            },
            {
              badge: "2. Performance",
              title: "مراقبة الأداء وضبط الكفاءة (Monitoring Use)",
              desc: "متابعة زمن تنفيذ الاستعلامات وبناء الفهارس (Indexes) وتسريع النظام."
            },
            {
              badge: "3. Hardware & Software",
              title: "إدارة الموارد والترقيات (Acquiring Resources)",
              desc: "تحديد سعة التخزين والذاكرة المطلوبة وشراء تراخيص وتحديثات برمجيات الـ DBMS."
            },
            {
              badge: "4. Recovery",
              title: "النسخ الاحتياطي والتعافي من الكوارث (Backup & Recovery)",
              desc: "وضع خطط استعادة النظام في دقائق حال حدوث عطل مفاجئ أو حريق في السيرفرات."
            }
          ],
          keywords: [
            { en: "Database Administrator (DBA)", ar: "مدير ومسؤول قاعدة البيانات" },
            { en: "Authorizing Access", ar: "إدارة وتصريح أذونات الوصول" },
            { en: "Performance Monitoring", ar: "مراقبة ورفع كفاءة الأداء" }
          ],
          tricks: "الـ DBA لا يصمم منطق الجداول والعلاقات في البداية (هذه مهمة الـ Database Designer)، بل يدير النظام ويحميه ويوفر موارده ويمنح الصلاحيات.",
          quiz: {
            question: "Which role is primarily responsible for authorizing access, monitoring performance, and performing database backups?",
            options: [
              "Database Administrator (DBA)",
              "Casual End User",
              "Graphic Designer",
              "System Hardware Vendor"
            ],
            correct: 0,
            explanation: "The DBA is responsible for user authorization, performance monitoring, security, and backup/recovery procedures."
          }
        },
        {
          num: 13,
          title: "Actors on the Scene: Database Designers",
          arabicTitle: "مصممو قواعد البيانات (Database Designers) - الأدوار والمهام",
          image: "materials/slides/db-lec2/slide_13.png",
          coreSummary: "مصمم قاعدة البيانات مسؤول عن تحديد البيانات الواجب تخزينها، واختيار التراكيب المناسبة، والتواصل مع المستخدمين لتحديد الـ Views والقيود.",
          explanationIntro: "الـ Database Designer هو المعماري الذي يضع المخطط الهندسي لقاعدة البيانات قبل بنائها:",
          points: [
            {
              badge: "Requirement Analysis",
              title: "دراسة وتحديد متطلبات البيانات (Identifying Data)",
              desc: "الجلوس مع إدارات الشركة لفهم كافة البيانات المطلوب تسجيلها وحجمها المتوقع."
            },
            {
              badge: "Structure & Modeling",
              title: "اختيار تراكيب البيانات ونمذجتها",
              desc: "تحديد الجداول والمفاتيح الأساسية (Primary Keys) والمفاتيح الأجنبية (Foreign Keys) والعلاقات."
            },
            {
              badge: "Views Specification",
              title: "تصميم واجهات العرض (Views Definition)",
              desc: "تحديد شكل واجهات البيانات لكل فئة مستخدمين لضمان سهولة التعامل والأمان."
            }
          ],
          keywords: [
            { en: "Database Designer", ar: "مهندس ومصمم قاعدة البيانات" },
            { en: "Data Modeling", ar: "نمذجة هياكل البيانات" },
            { en: "Views Specification", ar: "تحديد وجهات النظر للمستخدمين" }
          ],
          tricks: "المصمم يتفاعل مع المستخدمين 'قبل' وأثناء بناء قاعدة البيانات، ومسؤوليته تنتهي أو تقل بمجرد تسليم التصميم وبدء مرحلة التشغيل التي يتولاها الـ DBA.",
          quiz: {
            question: "Who is responsible for communicating with all prospective users to understand their data requirements and create conceptual schema designs?",
            options: [
              "Database Designers",
              "Hardware Technicians",
              "Standalone End Users",
              "Operating System Vendors"
            ],
            correct: 0,
            explanation: "Database designers specialize in requirements analysis, conceptual data modeling, and schema specification."
          }
        },
        {
          num: 14,
          title: "Actors on the Scene: End Users Categories",
          arabicTitle: "فئات المستخدمين النهائيين الأربعة (End Users)",
          image: "materials/slides/db-lec2/slide_14.png",
          coreSummary: "ينقسم المستخدمون النهائيون إلى 4 فئات رئيسية: Casual و Naive/Parametric و Sophisticated و Standalone.",
          explanationIntro: "هذه الشريحة من أكثر شرائح الامتحان تكراراً في أسئلة المقارنات والمطابقة؛ إليك الفروق الجوهرية بين الفئات الأربع:",
          points: [
            {
              badge: "1. Casual",
              title: "المستخدم العارض (Casual End User)",
              desc: "يدخل النظام بشكل متقطع وغير منتظم (مثل المدير التنفيذي الذي يطلب تقريراً جديداً كل فترة عبر استعلامات متقدمة)."
            },
            {
              badge: "2. Naive / Parametric",
              title: "المستخدم الموجه (Naive or Parametric End User)",
              desc: "يمثل الشريحة الأكبر؛ يكرر نفس المعاملات اليومية المحفوظة عبر واجهة بسيطة (مثل موظف حجز التذاكر أو كاشير البنك)."
            },
            {
              badge: "3. Sophisticated",
              title: "المستخدم المتمرس والخبير (Sophisticated End User)",
              desc: "مهندسون وباحثون وعلماء بيانات يفهمون قدرات الـ DBMS ويكتبون استعلامات معقدة ومخصصة لتحليل البيانات."
            },
            {
              badge: "4. Standalone",
              title: "المستخدم المستقل (Standalone End User)",
              desc: "يستخدم حزم برمجية جاهزة لإدارة قاعدة بياناته الشخصية الخاصة به وحده (مثل برنامج محاسبي لمحل تجاري صغير)."
            }
          ],
          keywords: [
            { en: "Casual Users", ar: "مستخدمون عارضون باحتياجات متغيرة" },
            { en: "Naive / Parametric Users", ar: "مستخدمون نمطيون بمعاملات محددة مسبقاً" },
            { en: "Sophisticated Users", ar: "مستخدمون متمرسون ومحللو بيانات" },
            { en: "Standalone Users", ar: "مستخدمو برامج شخصية مستقلة" }
          ],
          tricks: "ركز على مسمى 'Canned Transactions' (المعاملات المعلبة الجاهزة)؛ هي مرتبطة حصرياً بـ Naive / Parametric Users (مثل موظف حجز الطيران).",
          quiz: {
            question: "Bank tellers and airline reservation agents who constantly run predefined 'canned transactions' are classified as:",
            options: [
              "Naive or Parametric End Users",
              "Sophisticated End Users",
              "Database Designers",
              "Workers Behind the Scene"
            ],
            correct: 0,
            explanation: "Naive or Parametric end users execute standard, preprogrammed queries and canned transactions on a routine basis."
          }
        },
        {
          num: 15,
          title: "Actors on the Scene: System Analysts and Application Programmers",
          arabicTitle: "محللو النظم ومطورو البرامج والتطبيقات",
          image: "materials/slides/db-lec2/slide_15.png",
          coreSummary: "محللو النظم يحددون متطلبات الـ Naive Users، ومبرمجو التطبيقات يكتبون الكود واختبار المعاملات الجاهزة (Canned Transactions).",
          explanationIntro: "فريق هندسة البرمجيات الذي يبني التطبيقات التي تتصل بقاعدة البيانات:",
          points: [
            {
              badge: "System Analysts",
              title: "محللو النظم (System Analysts)",
              desc: "يدرسون متطلبات المستخدمين النهائيين النمطيين ويصممون شكل وتدفق المعاملات المطلوبة لتسهيل عملهم."
            },
            {
              badge: "Application Programmers",
              title: "مبرمجو التطبيقات (Software Engineers)",
              desc: "يطورون البرامج بواجهات الويب والموبايل ويكتبون أكواد الاتصال بقاعدة البيانات واختبارها وتصحيحها."
            }
          ],
          keywords: [
            { en: "System Analysts", ar: "محللو النظم ومتطلبات الأعمال" },
            { en: "Application Programmers", ar: "مبرمجو التطبيقات البرمجية" },
            { en: "Canned Transactions", ar: "المعاملات البرمجية المجهزة مسبقاً" }
          ],
          tricks: "المبرمجون هنا هم مبرمجو التطبيقات (Application Programmers) وليسوا مبرمجي محرك الـ DBMS نفسه.",
          quiz: {
            question: "Who is responsible for determining the requirements of naive end users and designing canned transactions?",
            options: [
              "System Analysts",
              "Hardware Maintenance Crew",
              "Casual Users",
              "Database Vendors"
            ],
            correct: 0,
            explanation: "System analysts analyze business workflows and determine the exact requirements for end-user transactions."
          }
        },
        {
          num: 16,
          title: "Workers Behind the Scene",
          arabicTitle: "العاملون خلف الكواليس: صناع ومطورو برمجيات الـ DBMS",
          image: "materials/slides/db-lec2/slide_16.png",
          coreSummary: "الفئات الثلاث التي تبني بيئة الـ DBMS التحتية: مصممو برمجيات الـ DBMS، مطورو الأدوات، ومشغلو الصيانة والأجهزة.",
          explanationIntro: "هؤلاء هم الجنود المجهولون الذين لا يتعاملون مع قاعدة بيانات بعينها، بل يصنعون البرمجيات والأنظمة الأساسية التي يعمل عليها الجميع:",
          points: [
            {
              badge: "1. Engine Designers",
              title: "مصممو ومنفذو برمجيات الـ DBMS",
              desc: "المهندسون الذين يكتبون كود نظام الـ DBMS نفسه (كود محرك الاستعلامات، المترجم، وتراكيب التخزين مثل مهندسي Oracle و Microsoft)."
            },
            {
              badge: "2. Tool Developers",
              title: "مطورو الأدوات المساعدة (Tool Developers)",
              desc: "بناء أدوات التصميم والمراقبة والـ GUI (مثل برامج SQL Workbench، pgAdmin، وأدوات تصميم الـ ERD)."
            },
            {
              badge: "3. Operators & Maintenance",
              title: "مشغلو الصيانة والدعم الفني",
              desc: "مسؤولو بيئة السيرفرات والأجهزة ونظام التشغيل الذي يعمل عليه الـ DBMS."
            }
          ],
          keywords: [
            { en: "DBMS Implementers", ar: "مطورو ومبرمجو كود محرك الـ DBMS" },
            { en: "Tool Developers", ar: "مطورو أدوات التصميم والمراقبة" },
            { en: "Operators", ar: "مهندسو تشغيل السيرفرات والأجهزة" }
          ],
          tricks: "لو سألك في الامتحان: هل مهندس برمجة أدوات الـ GUI للـ DBMS يعتبر Actor on the scene؟ الإجابة قطعاً: لا، هو Worker Behind the Scene.",
          quiz: {
            question: "Software engineers who design and implement the core DBMS query processor engine are:",
            options: [
              "Workers Behind the Scene",
              "Actors on the Scene",
              "Parametric End Users",
              "Database Designers"
            ],
            correct: 0,
            explanation: "Engineers who build the internal DBMS modules and tools operate 'Behind the Scene' rather than interacting with user databases."
          }
        },
        {
          num: 17,
          title: "Advantages of Using the DBMS Approach",
          arabicTitle: "المزايا الجوهرية لمنهج إدارة قواعد البيانات (الجزء 1)",
          image: "materials/slides/db-lec2/slide_17.png",
          coreSummary: "المزايا الأربع الأولى: السيطرة على تكرار البيانات، تقييد الوصول غير المصرح به، التخزين الدائم للبرمجيات، وتوفير النسخ الاحتياطي.",
          explanationIntro: "لماذا تضحي الشركات بآلاف الدولارات لشراء أنظمة DBMS بدلاً من ملفات Excel العادية؟ إليك الإجابة الحاسمة:",
          points: [
            {
              badge: "1. Redundancy",
              title: "السيطرة على التكرار (Controlling Redundancy)",
              desc: "منع تكرار نفس المعلومة في أكثر من مكان لتوفير المساحة وتجنب تناقض البيانات (Inconsistency)."
            },
            {
              badge: "2. Security",
              title: "تقييد الوصول غير المصرح (Restricting Unauthorized Access)",
              desc: "تطبيق مستويات صلاحيات دقيقة وكلمات سر وتشفير لكل جدول ولكل مستخدم."
            },
            {
              badge: "3. Persistence",
              title: "التخزين الدائم للبيانات البرمجية (Persistent Storage)",
              desc: "حفظ الكائنات البرمجية والبيانات المعقدة بصورة مستقرة وممتدة على وسائط التخزين الدائمة."
            },
            {
              badge: "4. Backup & Recovery",
              title: "توفير النسخ الاحتياطي والاستعادة الذاتية",
              desc: "القدرة على استرجاع النظام لحالته الصحيحة تلقائياً في حال انقطاع الكهرباء أو تعطل البرمجيات."
            }
          ],
          keywords: [
            { en: "Controlling Redundancy", ar: "منع والسيطرة على تكرار البيانات" },
            { en: "Inconsistency", ar: "تناقض البيانات الناتج عن التكرار" },
            { en: "Backup and Recovery", ar: "النسخ الاحتياطي واستعادة الأعطال" }
          ],
          tricks: "المشكلة الكبرى في تكرار البيانات (Redundancy) ليست فقط إهدار مساحة القرص، بل خطر الـ Inconsistency (أن تعدل العنوان في ملف وتنساه في ملف آخر فتصبح البيانات متناقضة).",
          quiz: {
            question: "What is the most severe risk associated with uncontrolled data redundancy?",
            options: [
              "Data inconsistency across multiple copies",
              "Excessive monitor brightness",
              "Keyboard hardware failure",
              "Compiler syntax errors"
            ],
            correct: 0,
            explanation: "Redundancy leads to data inconsistency when updates are made to one copy but neglected in others."
          }
        },
        {
          num: 18,
          title: "Additional DBMS Advantages & Standards",
          arabicTitle: "مزايا إضافية: قيود التكامل وتوحيد المعايير ومرونة التطوير",
          image: "materials/slides/db-lec2/slide_18.png",
          coreSummary: "فرض قيود التكامل (Integrity Constraints)، تمكين الاستنتاج عبر القواعد، توفير واجهات متعددة، وتقليل وقت تطوير التطبيقات.",
          explanationIntro: "مزايا أخرى تجعل نظام الـ DBMS يستحق كل مليم ينفق عليه:",
          points: [
            {
              badge: "Integrity Rules",
              title: "فرض قيود التكامل (Enforcing Integrity Constraints)",
              desc: "منع إدخال بيانات خاطئة منطقياً (مثل منع تسجيل طالب برقم هاتف فارغ، أو إدخال مرتب بالسالب، أو تكرار الرقم القومي)."
            },
            {
              badge: "Standards",
              title: "توحيد المعايير القياسية (Enforcing Standards)",
              desc: "إلزام كل فرق التطوير في المؤسسة بنفس التسميات وصيغ التواريخ وطرق التوثيق."
            },
            {
              badge: "Rapid Development",
              title: "تقليص زمن تطوير البرمجيات (Reduced Application Development Time)",
              desc: "المبرمج لا يضيع وقته في كتابة أكواد التخزين والتشفير والأمان؛ الـ DBMS يقدم كل هذه الخدمات جاهزة."
            }
          ],
          keywords: [
            { en: "Integrity Constraints", ar: "قيود الصحة والسلامة المنطقية" },
            { en: "Standards Enforcement", ar: "توحيد معايير البيانات في المؤسسة" },
            { en: "Up-to-date Information", ar: "حداثة وتزامن البيانات لحظياً" }
          ],
          tricks: "سؤال متكرر: أين يتم حفظ قيود التكامل (Constraints)؟ في الـ System Catalog، وبالتالي يتولى الـ DBMS فرضها تلقائياً على كل تطبيق يتصل به.",
          quiz: {
            question: "Where are data integrity constraints defined and enforced in the database approach?",
            options: [
              "Defined once in the DBMS catalog and enforced automatically for all programs",
              "Hardcoded manually by every individual frontend developer",
              "Maintained verbally by system users",
              "Controlled by internet service providers"
            ],
            correct: 0,
            explanation: "Constraints are stored centrally in the DBMS catalog and enforced automatically on all application queries."
          }
        },
        {
          num: 19,
          title: "When NOT to Use a DBMS",
          arabicTitle: "متى يُمنع أو لا يُنصح باستخدام نظام إدارة قواعد البيانات؟",
          image: "materials/slides/db-lec2/slide_19.png",
          coreSummary: "حالات عدم الجدوى: التكلفة الابتدائية العالية، متطلبات الزمن الحقيقي الصارمة (Strict Real-time)، التطبيقات البسيطة لشخص واحد، ومحدودية الموارد.",
          explanationIntro: "سؤال امتحان كلاسيكي ومفضل لأساتذة المادة: هل استخدام الـ DBMS مفيد دائماً في كل الحالات؟ الإجابة: لا!",
          points: [
            {
              badge: "1. High Overhead",
              title: "التكلفة والعبء الزائد (Overhead Costs)",
              desc: "شراء تراخيص الـ DBMS وسيرفرات باهظة وتعيين DBA ذو راتب عالي قد لا يناسب المشاريع الصغيرة جداً."
            },
            {
              badge: "2. Real-time Systems",
              title: "أنظمة الزمن الحقيقي الحرج (Strict Real-time Constraints)",
              desc: "الأنظمة التي تحتاج استجابة في أجزاء من المايكروثانية (مثل توجيه الصواريخ أو أجهزة التنفس الصناعي)؛ طبقات أمان الـ DBMS تسبب تأخيراً غير مقبول."
            },
            {
              badge: "3. Simple Single-User",
              title: "التطبيقات البسيطة الفردية (Single-User Applications)",
              desc: "تطبيق بسيط لمستخدم واحد لا يحتاج إلى مزايا المشاركة والأمان المعقدة."
            },
            {
              badge: "4. Static Data",
              title: "البيانات الثابتة التي لا تتغير",
              desc: "إذا كانت البيانات ثابتة تماماً بدون تحديثات ولا تتطلب وصولاً متعدد المستخدمين."
            }
          ],
          keywords: [
            { en: "Overhead", ar: "العبء الإضافي في الموارد والتكلفة" },
            { en: "Strict Real-Time", ar: "الأنظمة اللحظية ذات التوقيت الحرج" },
            { en: "Single-User Systems", ar: "الأنظمة الفردية البسيطة" }
          ],
          tricks: "احفظ كلمة (Strict Real-Time Constraints)؛ لأن الـ DBMS يضيف طبقات حماية وتزامن تستهلك وقتاً (Overhead) لا تتحمله الأنظمة اللحظية الصارمة.",
          quiz: {
            question: "Under which of the following circumstances is using a full-fledged DBMS NOT recommended?",
            options: [
              "Embedded systems with strict, microsecond real-time performance constraints",
              "Online banking with millions of concurrent transactions",
              "National healthcare records tracking",
              "Global airline ticketing systems"
            ],
            correct: 0,
            explanation: "Strict real-time systems cannot tolerate the processing overhead introduced by DBMS security and concurrency layers."
          }
        },
        {
          num: 20,
          title: "Data Models: Concept and Constructs",
          arabicTitle: "نماذج البيانات (Data Models): المفاهيم والمكونات",
          image: "materials/slides/db-lec2/slide_20.png",
          coreSummary: "نموذج البيانات هو مجموعة من المفاهيم لوصف بنية قاعدة البيانات وعملياتها وقيودها؛ وتوفر وسيلة التجريد الأساسية للبيانات.",
          explanationIntro: "تنتقل المحاضرة هنا إلى أساس التصميم المعماري: ما هو نموذج البيانات (Data Model)؟",
          points: [
            {
              badge: "Definition",
              title: "تعريف الـ Data Model",
              desc: "مجموعة من المفاهيم والرموز التي تتيح وصف بنية قاعدة البيانات (Data Structure) ونوعياتها وعلاقاتها بصورة تجريدية مفهومة."
            },
            {
              badge: "Constructs",
              title: "المكونات البنائية (Constructs)",
              desc: "العناصر الأساسية لتمثيل البيانات (مثل الكيانات Entities، السمات Attributes، والعلاقات Relationships)."
            },
            {
              badge: "Operations",
              title: "العمليات (Model Operations)",
              desc: "العمليات المحددة لقراءة وتحديث البيانات (Insert, Delete, Update, Retrieve) ومحددات سلوك النظام."
            }
          ],
          keywords: [
            { en: "Data Model", ar: "نموذج وهيكل تمثيل البيانات" },
            { en: "Constructs", ar: "المكونات التأسيسية للنموذج" },
            { en: "Model Operations", ar: "العمليات المسموح بها في النموذج" }
          ],
          tricks: "نموذج البيانات ليس مجرد جداول صامتة؛ بل يتكون دائماً من 3 أركان: تراكيب (Constructs) + عمليات (Operations) + قيود (Constraints).",
          quiz: {
            question: "What are the core components that comprise a complete Data Model?",
            options: [
              "Data structures (constructs), operations, and constraints",
              "Monitor display drivers and CPU clock speeds",
              "Network cable categories and router protocols"
            ],
            correct: 0,
            explanation: "A data model provides constructs for defining structure, permitted operations, and consistency constraints."
          }
        },
        {
          num: 21,
          title: "Categories of Data Models",
          arabicTitle: "تصنيفات نماذج البيانات: المفاهيمي والتطبيقي والفيزيائي",
          image: "materials/slides/db-lec2/slide_21.png",
          coreSummary: "تصنيف مستويات النماذج الثلاثة: Conceptual (عالي المستوى)، Representational/Implementation (مستوى تمثيلي وسيط)، و Physical (منخفض المستوى).",
          explanationIntro: "مقارنة منهجية هامة جداً بين مستويات التجريد الثلاثة لنماذج البيانات:",
          points: [
            {
              badge: "1. Conceptual / High-Level",
              title: "النموذج المفاهيمي (Conceptual Data Model)",
              desc: "أقرب ما يكون لطريقة تفكير المستخدم البشري؛ يصف الكيانات والسمات والعلاقات بدون الدخول في أي تفاصيل تخزين حاسوبية (مثل مخطط ERD)."
            },
            {
              badge: "2. Representational",
              title: "النموذج التمثيلي / التطبيقي (Implementation Model)",
              desc: "المستوى الوسيط المستخدم في معظم محركات الـ DBMS التجارية؛ يفهمه المستخدم ويدعمه الحاسوب (مثل Relational Model القائم على الجداول)."
            },
            {
              badge: "3. Physical / Low-Level",
              title: "النموذج الفيزيائي (Physical Data Model)",
              desc: "يصف كيفية تخزين البيانات فعلياً على القرص الصلب وتنسيق السجلات (Record formats) ومسارات الوصول والفهرسة (Access paths)."
            }
          ],
          keywords: [
            { en: "Conceptual Model", ar: "نموذج مفاهيمي عالي المستوى (قريب للمستخدم)" },
            { en: "Representational Model", ar: "نموذج تمثيلي تطبيقي (مثل النموذج العلائقي)" },
            { en: "Physical Model", ar: "نموذج فيزيائي منخفض المستوى (تخزين القرص)" }
          ],
          tricks: "الـ Entity-Relationship (ER) model يصنف كـ Conceptual Model، بينما الـ Relational model (الجداول ذات الصفوف والأعمدة) يصنف كـ Representational / Implementation Model.",
          quiz: {
            question: "The Relational Model (tables, rows, columns) used in MySQL and Oracle belongs to which category?",
            options: [
              "Representational (Implementation) Data Model",
              "Physical Low-Level Data Model",
              "Purely Conceptual High-Level Model"
            ],
            correct: 0,
            explanation: "Relational models are classified as Representational or Implementation models, bridging concepts with computer representations."
          }
        },
        {
          num: 22,
          title: "Schemas, Instances, and Database State",
          arabicTitle: "المخطط (Schema) مقابل الحالة اللحظية (Instance / State)",
          image: "materials/slides/db-lec2/slide_22.png",
          coreSummary: "الفرق الحاسم بين الـ Schema (الوصف الهيكلي الثابت نادراً) والـ Database State / Instance (محتوى البيانات الفعلي في لحظة زمنية معينة والمتغير باستمرار).",
          explanationIntro: "هذه الشريحة تمثل أحد الأسئلة المضمونة في الامتحان؛ الفرق بين الهيكل والبيانات الفعلية:",
          points: [
            {
              badge: "Database Schema",
              title: "مخطط قاعدة البيانات (The Schema)",
              desc: "الوصف الهيكلي والتصميمي لقاعدة البيانات؛ يحدد أسماء الجداول والأعمدة والقيود، ونادراً جداً ما يتغير بعد إطلاقه (Intension)."
            },
            {
              badge: "Database State / Instance",
              title: "حالة قاعدة البيانات (Database State or Snapshot)",
              desc: "مجموعة البيانات الفعلية المخزنة داخل الجداول في لحظة زمنية معينة؛ تتغير باستمرار مع كل عملية إضافة أو تعديل أو حذف (Extension)."
            },
            {
              badge: "Schema Evolution",
              title: "تطور وتعديل المخطط (Schema Evolution)",
              desc: "التعديل النادر على هيكل المخطط نفسه عند ظهور متطلبات أعمال جديدة في المؤسسة."
            }
          ],
          keywords: [
            { en: "Database Schema (Intension)", ar: "مخطط وهيكل قاعدة البيانات العام" },
            { en: "Database State (Extension)", ar: "حالة البيانات اللحظية المخزنة" },
            { en: "Database Instance / Snapshot", ar: "لقطة البيانات في لحظة زمنية محددة" }
          ],
          tricks: "المخطط يسمى علمياً (Intension) وهو ثابت نادراً ما يتغير، بينما حالة البيانات تسمى (Extension) وتتغير آلاف المرات في اليوم.",
          quiz: {
            question: "The actual data stored in a database at a specific moment in time is termed the:",
            options: [
              "Database State (or Instance / Snapshot)",
              "Database Schema",
              "Static Catalog Specification",
              "Compilation Artifact"
            ],
            correct: 0,
            explanation: "The database state (or instance) represents the actual snapshot of data populated in the database at a given moment."
          }
        },
        {
          num: 23,
          title: "The Three-Schema Architecture",
          arabicTitle: "معمارية المخططات الثلاثية (Three-Schema Architecture)",
          image: "materials/slides/db-lec2/slide_23.png",
          coreSummary: "المعمارية القياسية لشركة ANSI/SPARC لفصل مستويات النظام الثلاثة: Internal Level، Conceptual Level، و External/View Level بهدف تحقيق استقلالية البيانات.",
          explanationIntro: "أشهر معمارية في تاريخ علم قواعد البيانات (ANSI/SPARC Framework)؛ صممت لغرض رئيسي: فصل تطبيقات المستخدم عن قواعد البيانات الفيزيائية:",
          points: [
            {
              badge: "1. Internal Level",
              title: "المستوى الداخلي (Internal / Physical Schema)",
              desc: "يصف تفاصيل التخزين الفيزيائي الحقيقي للملفات على الهارد ديسك ومسارات الفهرسة السريعة."
            },
            {
              badge: "2. Conceptual Level",
              title: "المستوى المفاهيمي (Conceptual Schema)",
              desc: "قلب النظام؛ يصف هيكل قاعدة البيانات بالكامل لجميع المستخدمين (الكيانات، العلاقات، القيود) دون ذكر تفاصيل التخزين الفيزيائي."
            },
            {
              badge: "3. External Level",
              title: "المستوى الخارجي (External Schema / Views)",
              desc: "المستوى الأقرب للمستخدم؛ يصف واجهات العرض المتعددة (Views) الخاصة بكل فئة من المستخدمين."
            }
          ],
          keywords: [
            { en: "Three-Schema Architecture", ar: "معمارية المستويات والمخططات الثلاثية" },
            { en: "Internal Level", ar: "المستوى الداخلي الفيزيائي للتخزين" },
            { en: "Conceptual Level", ar: "المستوى المفاهيمي الشامل لقاعدة البيانات" },
            { en: "External Level", ar: "المستوى الخارجي لوجهات نظر المستخدمين" }
          ],
          tricks: "الهدف الجوهري الأسمى لمعمارية الـ Three-Schema هو دعم وتحقيق خاصية استقلالية البيانات (Data Independence).",
          quiz: {
            question: "Which schema level in the Three-Schema Architecture describes the structure of the entire database for a community of users while hiding physical storage details?",
            options: [
              "Conceptual Schema",
              "Internal Schema",
              "External Schema",
              "Physical Device Driver"
            ],
            correct: 0,
            explanation: "The Conceptual Schema describes whole-database entities, types, and constraints while concealing physical storage."
          }
        },
        {
          num: 24,
          title: "Data Independence in Three-Schema Architecture",
          arabicTitle: "استقلالية البيانات المنطقية والفيزيائية (Logical vs Physical)",
          image: "materials/slides/db-lec2/slide_24.png",
          coreSummary: "المقارنة الذهبية: استقلالية البيانات المنطقية (تغيير الـ Conceptual Schema دون تغيير الـ External) مقابل الفيزيائية (تغيير الـ Internal دون تغيير الـ Conceptual).",
          explanationIntro: "هذه الشريحة هي المصدر الأول لأسئلة الاختيارات والصح والخطأ في امتحانات قواعد البيانات في كل جامعات العالم:",
          points: [
            {
              badge: "Logical Independence",
              title: "استقلالية البيانات المنطقية (Logical Data Independence)",
              desc: "القدرة على تعديل المخطط المفاهيمي (Conceptual Schema) مثل إضافة جدول أو حقل جديد دون الحاجة لتعديل الـ External Schemas أو التطبيقات القائمة."
            },
            {
              badge: "Physical Independence",
              title: "استقلالية البيانات الفيزيائية (Physical Data Independence)",
              desc: "القدرة على تغيير تراكيب التخزين الداخلية والفهارس (Internal Schema) لتسريع الأداء دون الحاجة لتعديل المخطط المفاهيمي (Conceptual Schema)."
            },
            {
              badge: "Difficulty Comparison",
              title: "أيهما أصعب وأكثر تعقيداً؟",
              desc: "تحقيق الاستقلالية المنطقية (Logical) أصعب بكثير من الاستقلالية الفيزيائية (Physical) لأن البرامج تعتمد بشكل مباشر على المنطق."
            }
          ],
          keywords: [
            { en: "Logical Data Independence", ar: "استقلالية البيانات المنطقية (أصعب في التطبيق)" },
            { en: "Physical Data Independence", ar: "استقلالية البيانات الفيزيائية (أسهل وأكثر شيوعاً)" },
            { en: "Schema Mapping", ar: "التحويل والربط بين مستويات المعمارية" }
          ],
          tricks: "سؤال متكرر جداً: 'Logical data independence is harder to achieve than physical data independence' -> الإجابة: True دائماً وأبداً!",
          quiz: {
            question: "The capacity to modify the internal schema (e.g., adding an index) without having to alter the conceptual schema is known as:",
            options: [
              "Physical Data Independence",
              "Logical Data Independence",
              "Static View Independence",
              "Catalog Dependency"
            ],
            correct: 0,
            explanation: "Physical Data Independence allows altering physical storage and indexing structures without modifying conceptual schemas."
          }
        },
        {
          num: 25,
          title: "DBMS Languages: DDL and Schema Definition",
          arabicTitle: "لغات الـ DBMS: لغة تعريف البيانات (DDL) والمخططات",
          image: "materials/slides/db-lec2/slide_25.png",
          coreSummary: "لغة تعريف البيانات (DDL - Data Definition Language) ومترجمها (DDL Compiler) واستخداماتها في صياغة الـ Conceptual والـ Internal Schemas.",
          explanationIntro: "كيف نخاطب الـ DBMS ونخبره بتعريف الجداول والحقول؟ نستخدم عائلة لغات الـ DBMS:",
          points: [
            {
              badge: "DDL Definition",
              title: "لغة تعريف البيانات (Data Definition Language - DDL)",
              desc: "اللغة المخصصة لتعريف وتعديل مخططات وهياكل قاعدة البيانات (مثل أوامر CREATE TABLE، ALTER TABLE، DROP TABLE في الـ SQL)."
            },
            {
              badge: "DDL Compiler",
              title: "مترجم الـ DDL ومخرجاته",
              desc: "يقوم بمعالجة الأوامر وتسجيل الوصف والتعريفات الناتجة مباشرة داخل مستودع الكتالوج (System Catalog / Meta-data)."
            },
            {
              badge: "SDL & VDL",
              title: "لغات التخزين وواجهات العرض (SDL & VDL)",
              desc: "قديماً كانت هناك لغة خاصة بالتخزين (Storage Definition Language - SDL) ولغة لوجهات النظر (View Definition Language - VDL)، واليوم دمجت جميعاً في SQL."
            }
          ],
          keywords: [
            { en: "DDL", ar: "لغة تعريف المخططات والجداول (CREATE, ALTER)" },
            { en: "DDL Compiler", ar: "مترجم أوامر تعريف البيانات" },
            { en: "VDL", ar: "لغة تعريف واجهات العرض (Views)" }
          ],
          tricks: "أوامر الـ DDL تتعامل مع 'الهيكل' (Structure) فقط، ولا تتعامل مع البيانات الفردية داخل الصفوف.",
          quiz: {
            question: "Which language is utilized by the DBA and database designers to specify the conceptual and internal schemas?",
            options: [
              "Data Definition Language (DDL)",
              "Data Manipulation Language (DML)",
              "Hypertext Preprocessor (PHP)",
              "Assembly Instruction Set"
            ],
            correct: 0,
            explanation: "DDL (Data Definition Language) is used to define and modify the conceptual database schema and structures."
          }
        },
        {
          num: 26,
          title: "DBMS Languages: DML (High-Level vs Low-Level)",
          arabicTitle: "لغة معالجة البيانات (DML): اللغات عالية المستوى ومنخفضة المستوى",
          image: "materials/slides/db-lec2/slide_26.png",
          coreSummary: "لغة معالجة البيانات (DML - Data Manipulation Language)؛ والفرق الحاسم بين High-Level (Non-procedural / Set-at-a-time) و Low-Level (Procedural / Record-at-a-time).",
          explanationIntro: "بعد بناء الهيكل، كيف نضيف ونسترجع ونعدل البيانات الفعلية؟ نستخدم لغة الـ DML:",
          points: [
            {
              badge: "DML Purpose",
              title: "هدف لغة الـ DML",
              desc: "تتضمن عمليات استرجاع البيانات (Retrieval)، الإدخال (Insertion)، الحذف (Deletion)، والتعديل (Modification)."
            },
            {
              badge: "High-Level / Non-procedural",
              title: "اللغات عالية المستوى (Declarative / Set-oriented)",
              desc: "مثل لغة SQL؛ تحدد للنظام 'ماذا تريد' (What data to retrieve) دون أن تحدد 'كيف يجلبه'؛ وتتعامل مع مجموعة سجلات كاملة دفعة واحدة (Set-at-a-time)."
            },
            {
              badge: "Low-Level / Procedural",
              title: "اللغات منخفضة المستوى (Record-at-a-time)",
              desc: "تحدد خطوة بخطوة 'كيفية' الوصول للبيانات ويجب تضمينها داخل لغة برمجة عامة للتعامل مع سجل واحد في كل مرة."
            }
          ],
          keywords: [
            { en: "DML", ar: "لغة معالجة واستعلام البيانات (SELECT, INSERT)" },
            { en: "Non-procedural DML", ar: "لغة تصريحية عالية المستوى (Set-at-a-time)" },
            { en: "Procedural DML", ar: "لغة إجرائية منخفضة المستوى (Record-at-a-time)" }
          ],
          tricks: "لغة SQL هي High-level Non-procedural DML لأنها تسترجع مجموعة سجلات كاملة بأمر واحد (Set-at-a-time)، وهذا سؤال امتحان شهير جداً.",
          quiz: {
            question: "A high-level, non-procedural DML such as SQL can retrieve and process data:",
            options: [
              "As a set of records at a time (Set-at-a-time)",
              "Strictly one single record at a time in loops",
              "Only after rebooting the operating system"
            ],
            correct: 0,
            explanation: "High-level non-procedural DMLs (like SQL) specify what to retrieve and operate on sets of records at a time."
          }
        },
        {
          num: 27,
          title: "DBMS Interfaces and Interaction Styles",
          arabicTitle: "واجهات المستخدم في أنظمة قواعد البيانات (DBMS Interfaces)",
          image: "materials/slides/db-lec2/slide_27.png",
          coreSummary: "أنماط واجهات التعامل مع الـ DBMS: القوائم، النماذج، الواجهات الرسومية (GUI)، اللغات الطبيعية، واجهات المستخدم النمطي، وواجهات الـ DBA.",
          explanationIntro: "يقدم الـ DBMS واجهات متعددة تناسب الخلفيات التقنية المختلفة لكل مستخدم:",
          points: [
            {
              badge: "Menu-based & Forms",
              title: "واجهات القوائم والنماذج (Forms-based)",
              desc: "شاشات تفاعلية مريحة للمستخدمين؛ حيث يملأ الموظف نموذجاً جاهزاً (Form) ويضغط حفظ دون كتابة أي استعلامات."
            },
            {
              badge: "GUI & Natural Language",
              title: "الواجهات الرسومية واللغات الطبيعية",
              desc: "الواجهات القائمة على النقر المباشر أو كتابة أسئلة باللغة الإنجليزية العادية ليحولها النظام لاستعلامات."
            },
            {
              badge: "DBA Interfaces",
              title: "واجهات مدير قاعدة البيانات المتقدمة",
              desc: "أدوات متخصصة بصلاحيات عليا لإنشاء الحسابات ومراقبة السيرفرات وإدارة النسخ الاحتياطي وضبط الأداء."
            }
          ],
          keywords: [
            { en: "Forms Interface", ar: "واجهات النماذج والشاشات الجاهزة" },
            { en: "GUI Interface", ar: "واجهات المستخدم الرسومية" },
            { en: "DBA Interfaces", ar: "واجهات وأدوات إدارة النظام الممتازة" }
          ],
          tricks: "المستخدم النمطي (Naive user) يتعامل دائماً إما مع Forms-based interface أو Menu-driven interface لتقليل احتمالات الخطأ البشري.",
          quiz: {
            question: "Which type of DBMS interface is most suitable for naive/parametric users who insert and query routine records daily?",
            options: [
              "Forms-based and menu-driven interfaces",
              "Command-line low-level kernel shells",
              "Binary memory debuggers"
            ],
            correct: 0,
            explanation: "Forms-based and menu interfaces present simple, guided fields that shield naive users from underlying query syntax."
          }
        },
        {
          num: 28,
          title: "Database System Utilities",
          arabicTitle: "البرمجيات والأدوات المساعدة للنظام (Database Utilities)",
          image: "materials/slides/db-lec2/slide_28.png",
          coreSummary: "أدوات المساعدة المتخصصة التي تساعد الـ DBA: برامج التحميل (Loading)، النسخ الاحتياطي (Backup)، إعادة تنظيم التخزين (Reorganization)، والمراقبة (Monitoring).",
          explanationIntro: "يقدم الـ DBMS مجموعة أدوات خدماتية حيوية لإبقاء قاعدة البيانات سليمة وسريعة طوال الوقت:",
          points: [
            {
              badge: "1. Loading Utility",
              title: "أداة تحميل واستيراد البيانات (Loading)",
              desc: "تحويل واستيراد ملفات البيانات القديمة (مثل ملفات Excel أو CSV أو ملفات نصية) وتنسيقها داخل جداول الـ DBMS."
            },
            {
              badge: "2. Backup Utility",
              title: "أداة النسخ الاحتياطي (Backup)",
              desc: "إنشاء نسخ أرشيفية كاملة أو تدريجية على وسائط تخزين خارجية أو سحابية للحماية من الكوارث."
            },
            {
              badge: "3. Reorganization",
              title: "إعادة تنظيم الملفات والفهارس (File Reorganization)",
              desc: "إعادة ترتيب الملفات على الهارد ديسك وإعادة بناء الفهارس (Rebuilding Indexes) لاستعادة السرعة القصوى."
            },
            {
              badge: "4. Monitoring",
              title: "أدوات مراقبة الأداء (Performance Monitoring)",
              desc: "إحصائيات استهلاك المعالج والذاكرة وأبطأ الاستعلامات لمساعدة الـ DBA في اتخاذ قرارات التحسين."
            }
          ],
          keywords: [
            { en: "Loading Utility", ar: "أداة استيراد وتحميل البيانات الضخمة" },
            { en: "Backup Utility", ar: "أداة النسخ الاحتياطي وحفظ البيانات" },
            { en: "Performance Monitoring", ar: "أدوات مراقبة واستهلاك موارد السيرفر" }
          ],
          tricks: "لو سئلت عن أداة إعادة بناء الفهارس بعد عمليات الحذف والفرز الكبيرة، فهي الـ Database Storage Reorganization Utility.",
          quiz: {
            question: "Which database utility is specifically used to convert and import existing raw data files into the database tables?",
            options: [
              "Loading utility",
              "Compiler linker",
              "Monitor driver utility",
              "Audio synthesizer"
            ],
            correct: 0,
            explanation: "The loading utility is designed to parse, format, and load external source files into database tables."
          }
        },
        {
          num: 29,
          title: "Centralized and Client/Server DBMS Architectures",
          arabicTitle: "معماريات الخادم والعميل (Client/Server vs Centralized)",
          image: "materials/slides/db-lec2/slide_29.png",
          coreSummary: "تطور معماريات النشر: من الأنظمة المركزية (Centralized)، إلى معمارية الطبقتين (2-Tier Client/Server)، ثم معمارية الثلاث طبقات (3-Tier / n-Tier Architecture) المستخدمة في الويب.",
          explanationIntro: "كيف يتم توزيع برمجيات قاعدة البيانات والتطبيقات على أجهزة الشبكة في العالم الواقعي؟",
          points: [
            {
              badge: "Centralized",
              title: "المعمارية المركزية القديمة (Centralized DBMS)",
              desc: "كل شيء (الـ DBMS، والبيانات، والتطبيقات، وشاشات العرض) يعمل على جهاز حاسوب رئيسي مركزي واحد (Mainframe)."
            },
            {
              badge: "2-Tier Architecture",
              title: "معمارية الطبقتين (2-Tier Client/Server)",
              desc: "الـ Client يشغل واجهة التطبيق وكود المعالجة، ويتصل مباشرة بسيرفر قاعدة البيانات (Database Server) عبر شبكة داخلية (ODBC/JDBC)."
            },
            {
              badge: "3-Tier / n-Tier",
              title: "معمارية الثلاث طبقات (3-Tier Web Architecture)",
              desc: "المعيار العالمي لتطبيقات الويب والموبايل: Client (متصفح المستخدم) -> Application/Web Server (منطق الأعمال والـ API) -> Database Server (تخزين واسترجاع البيانات)."
            }
          ],
          keywords: [
            { en: "Centralized Architecture", ar: "المعمارية المركزية لجهاز واحد" },
            { en: "2-Tier Architecture", ar: "معمارية الطبقتين (Client يتصل مباشرة بـ DB)" },
            { en: "3-Tier Architecture", ar: "معمارية الثلاث طبقات (Client -> App Server -> DB)" }
          ],
          tricks: "الميزة الكبرى في الـ 3-Tier Architecture هي الأمان؛ فالمستخدم العادي في المتصفح لا يستطيع أبداً الاتصال بقاعدة البيانات مباشرة، بل يمر دائماً عبر Application Server وسيط.",
          quiz: {
            question: "In a typical 3-Tier Client/Server web architecture, what sits between the user's web browser and the database server?",
            options: [
              "Application Server or Web Server (Business Logic Layer)",
              "Physical Hard Disk Array",
              "Raw Cable Hub",
              "Operating System Kernel"
            ],
            correct: 0,
            explanation: "The intermediate Application/Web Server tier executes business logic, processing requests between client browsers and the database."
          }
        },
        {
          num: 30,
          title: "Classification of Database Management Systems",
          arabicTitle: "تصنيف أنظمة إدارة قواعد البيانات (DBMS Classification)",
          image: "materials/slides/db-lec2/slide_30.png",
          coreSummary: "المعايير الأربعة المعتمدة لتصنيف أنظمة الـ DBMS: نموذج البيانات (Data Model)، عدد المستخدمين (Number of Users)، عدد المواقع (Number of Sites)، والتكلفة.",
          explanationIntro: "خاتمة المحاضرة بالمعايير الأكاديمية المعتمدة عالمياً لتصنيف واختيار نظام الـ DBMS المناسب للمشروع:",
          points: [
            {
              badge: "1. Data Model",
              title: "التصنيف حسب نموذج البيانات (الأهم عالمياً)",
              desc: "أنظمة علائقية (Relational مثل MySQL و PostgreSQL)، كائنية (Object-oriented)، أو أنظمة غير علائقية حديثة (NoSQL و Graph Databases)."
            },
            {
              badge: "2. Number of Users",
              title: "التصنيف حسب عدد المستخدمين",
              desc: "أنظمة مستخدم واحد (Single-user) مثل SQLite و MS Access، أو أنظمة متعددة المستخدمين (Multi-user) تدعم ملايين العملاء."
            },
            {
              badge: "3. Distribution",
              title: "التصنيف حسب توزيع السيرفرات (Number of Sites)",
              desc: "أنظمة مركزية (Centralized في سيرفر واحد)، أو أنظمة موزعة (Distributed DBMS عبر عدة دول وسيرفرات متزامنة)، أو سحابية (Cloud-native)."
            },
            {
              badge: "4. Cost & Licensing",
              title: "التصنيف حسب التكلفة والترخيص",
              desc: "أنظمة مفتوحة المصدر مجانية (Open-source مثل PostgreSQL) مقابل أنظمة تجارية كبرى مرخصة بملايين الدولارات (مثل Oracle و IBM DB2)."
            }
          ],
          keywords: [
            { en: "Relational DBMS (RDBMS)", ar: "أنظمة قواعد البيانات العلائقية" },
            { en: "Distributed DBMS (DDBMS)", ar: "أنظمة قواعد البيانات الموزعة" },
            { en: "Single-user vs Multi-user", ar: "مستخدم فردي مقابل متعدد المستخدمين" },
            { en: "Open Source vs Commercial", ar: "مفتوح المصدر مقابل تجاري مدفوع" }
          ],
          tricks: "المعيار الرئيسي والأكثر أهمية تاريخياً في تصنيف الـ DBMS هو: 'The Data Model on which the DBMS is based' (النموذج الذي يستند إليه المحرك).",
          quiz: {
            question: "Historically and fundamentally, what is the primary criterion used to classify Database Management Systems?",
            options: [
              "The underlying Data Model (e.g., Relational, Object-oriented, NoSQL)",
              "The color of the computer server rack",
              "The brand of keyboard used by the developer",
              "The physical size of the computer chassis"
            ],
            correct: 0,
            explanation: "The primary historical criterion for classifying a DBMS is the underlying data model it supports."
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
