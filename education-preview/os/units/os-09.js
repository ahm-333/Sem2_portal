(function(root) {
  'use strict';
  const lesson = {
  "id": "os-09",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "2",
  "title": "خدمات OS: من فتح البرنامج لحماية ملفاتك",
  "subtitle": "OS services · نفهم كل خدمة بموقف واضح، ونفرّق بين توزيع الموارد وتسجيل استخدامها.",
  "sources": [
    {
      "id": "current-ch2",
      "title": "Chapter 2 · Operating-System Structures",
      "driveId": "1DDEour98ioHVMAHbTVzHy_hfgR-zpaTW",
      "url": "https://drive.google.com/file/d/1DDEour98ioHVMAHbTVzHy_hfgR-zpaTW/view",
      "sha256": "7077be5a51357a7fd485d21111e7a296478f7dcfaf98985ccebcc998a349494e",
      "slides": [
        4,
        5
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-09-map",
      "title": "OS services: from a request to useful work",
      "eyebrow": "01 · بتطلب إيه من الجهاز؟",
      "summary": "Interfaces expose ways to request OS services.",
      "paragraphs": [
        "بتفتح برنامج، تقرأ ملف، أو تبعت رسالة لزميلك. ورا الطلبات دي <bdi lang=\"en\">OS services</bdi>: خدمات النظام اللي بتساعد البرامج تشتغل وتستخدم الجهاز.",
        "رسم سلايد 4 بيحط <bdi lang=\"en\">User and system programs</bdi> فوق، والخدمات والـ<bdi lang=\"en\">Hardware</bdi> تحت. الـ<bdi lang=\"en\">User interface</bdi> هي طريقة التعامل: <bdi lang=\"en\">GUI</bdi> فيها أزرار ونوافذ، <bdi lang=\"en\">Command line</bdi> بتكتب فيها أوامر، و<bdi lang=\"en\">Batch</bdi> بتنفّذ مجموعة أوامر. دي أسماء في الرسم، مش درس أوامر.",
        "الـ<bdi lang=\"en\">System calls</bdi> واجهة البرنامج لطلب خدمات من النظام. الرسمة خريطة مسؤوليات، مش معناها إن كل ضغطة زر لازم تعمل <bdi lang=\"en\">System call</bdi>. هنفصّل المسار في الدرس الجاي."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            4
          ]
        }
      ]
    },
    {
      "id": "os-09-work",
      "title": "Program execution, I/O and files",
      "eyebrow": "02 · افتح واحفظ",
      "summary": "OS services support running programs and working with data.",
      "paragraphs": [
        "فتحت برنامج تكتب عليه الواجب؟ <bdi lang=\"en\">Program execution</bdi> تشمل تحميل البرنامج في الذاكرة وتشغيله وإنهاءه، سواء خلص طبيعي أو حصل خطأ.",
        "ضغطت زر في الكيبورد أو قرأت من قرص؟ <bdi lang=\"en\">I/O operations</bdi> بتنقل بيانات من وإلى أجهزة الإدخال والإخراج.",
        "حفظت الملف باسم report.txt أو دوّرت عليه؟ <bdi lang=\"en\">File-system manipulation</bdi> تشمل قراءة الملفات وكتابتها وحذفها والبحث في الملفات والـ<bdi lang=\"en\">Directories</bdi>؛ يعني المجلدات. قراءة ملف ممكن تجمع خدمة ملفات مع عمليات <bdi lang=\"en\">I/O</bdi>."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ]
    },
    {
      "id": "os-09-sharing",
      "title": "Communication, allocation and accounting",
      "eyebrow": "03 · الجهاز مش لبرنامج واحد",
      "summary": "The OS coordinates sharing and records resource use.",
      "paragraphs": [
        "برنامج بعت بيانات لبرنامج على كمبيوتر تاني عبر الشبكة؟ دي <bdi lang=\"en\">Communications</bdi>. البرنامج الشغّال بنسميه <bdi lang=\"en\">Process</bdi>؛ هنا محتاجين الاسم ده بس، وتفصيله في Chapter 3.",
        "برنامج المحاضرة والمتصفح طالبين <bdi lang=\"en\">CPU</bdi> وذاكرة في نفس الوقت؟ <bdi lang=\"en\">Resource allocation</bdi> بتنظّم نصيب كل شغل من الموارد المحدودة.",
        "لو معمل الكلية عايز يعرف كل حساب استخدم قد إيه من الموارد، دي <bdi lang=\"en\">Accounting</bdi>. تسجيل الاستخدام مختلف عن توزيع الموارد نفسه؛ ومش لازم يبقى فاتورة فلوس."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ]
    },
    {
      "id": "os-09-safe",
      "title": "Error detection, protection and security",
      "eyebrow": "04 · الغلطة والصلاحية مش نفس الحاجة",
      "summary": "The OS handles errors and controls access to resources.",
      "paragraphs": [
        "القراءة من جهاز فشلت؟ <bdi lang=\"en\">Error detection</bdi> معناها إن النظام ينتبه للخطأ ويتصرف للتعامل معاه، زي إبلاغ البرنامج إن العملية فشلت. مش وعد إن كل خطأ هيتصلّح.",
        "زميلك حاول يفتح ملف مش مسموحله؟ <bdi lang=\"en\">Protection</bdi> بتنظّم مين يقدر يوصل لأنهي مورد. <bdi lang=\"en\">Security</bdi> تشمل حماية النظام والتحقق من الهوية: <bdi lang=\"en\">Authentication</bdi>.",
        "لما تدخل حسابك، التحقق من هويتك سؤال «إنت مين؟». السماح لحسابك يفتح ملف معين سؤال مختلف: «مسموحلك بإيه؟». الاتنين بيساعدوا على التحكم في الوصول."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ]
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-09-save",
      "type": "mcq",
      "placement": "os-09-work",
      "objective": "Identify file-system manipulation in a familiar scenario.",
      "prerequisites": [
        "os-09-work"
      ],
      "prompt": "A student creates report.txt, then searches for it. Which service best matches these file operations?",
      "options": [
        {
          "id": "os-09-save-1",
          "text": "Accounting"
        },
        {
          "id": "os-09-save-2",
          "text": "File-system manipulation"
        },
        {
          "id": "os-09-save-3",
          "text": "Authentication"
        },
        {
          "id": "os-09-save-4",
          "text": "Resource allocation"
        }
      ],
      "correctOptionId": "os-09-save-2",
      "feedback": {
        "os-09-save-1": "Accounting بتسجّل استخدام الموارد؛ هنا بنتعامل مع ملف.",
        "os-09-save-2": "صح؛ إنشاء ملف والبحث عنه من خدمات File system.",
        "os-09-save-3": "Authentication بتتحقق من الهوية، مش بتبحث عن الملف.",
        "os-09-save-4": "Allocation بتنظّم توزيع الموارد؛ المطلوب هنا عمليات الملف."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-09-usage",
      "type": "mcq",
      "placement": "os-09-sharing",
      "objective": "Separate accounting from allocation.",
      "prerequisites": [
        "os-09-sharing"
      ],
      "prompt": "The lab records how much CPU time each account used. Which service is this?",
      "options": [
        {
          "id": "os-09-usage-1",
          "text": "Communications"
        },
        {
          "id": "os-09-usage-2",
          "text": "Program execution"
        },
        {
          "id": "os-09-usage-3",
          "text": "Accounting"
        },
        {
          "id": "os-09-usage-4",
          "text": "Error detection"
        }
      ],
      "correctOptionId": "os-09-usage-3",
      "feedback": {
        "os-09-usage-1": "Communications تبادل بيانات؛ تسجيل الاستهلاك اسمه Accounting.",
        "os-09-usage-2": "تشغيل البرنامج خدمة تانية؛ هنا بنسجّل استخدامه للموارد.",
        "os-09-usage-3": "صح؛ Accounting بتتابع نوع وكمية الموارد اللي كل مستخدم استخدمها.",
        "os-09-usage-4": "Error detection بتتعامل مع أخطاء؛ مش تسجيل الاستهلاك."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-09-network",
      "type": "mcq",
      "placement": "os-09-sharing",
      "objective": "Recognize network communication between processes.",
      "prerequisites": [
        "os-09-sharing"
      ],
      "prompt": "Two programs exchange information between computers over a network. Which service is most directly involved?",
      "options": [
        {
          "id": "os-09-network-1",
          "text": "Communications"
        },
        {
          "id": "os-09-network-2",
          "text": "Authentication only"
        },
        {
          "id": "os-09-network-3",
          "text": "File deletion only"
        },
        {
          "id": "os-09-network-4",
          "text": "Accounting only"
        }
      ],
      "correctOptionId": "os-09-network-1",
      "feedback": {
        "os-09-network-1": "صح؛ تبادل البيانات بين العمليات عبر الشبكة مثال Communications في السلايد.",
        "os-09-network-2": "التحقق من الهوية ممكن يساعد، لكن تبادل المعلومات نفسه Communications.",
        "os-09-network-3": "مش لازم يكون فيه حذف ملف علشان برنامجين يتواصلوا.",
        "os-09-network-4": "تسجيل الاستهلاك مختلف عن إرسال واستقبال البيانات."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-09-permission",
      "type": "mcq",
      "placement": "os-09-safe",
      "objective": "Distinguish identity checks from resource permissions.",
      "prerequisites": [
        "os-09-safe"
      ],
      "prompt": "The OS verifies a login identity. Which term directly names this check?",
      "options": [
        {
          "id": "os-09-permission-1",
          "text": "Resource allocation"
        },
        {
          "id": "os-09-permission-2",
          "text": "Authentication"
        },
        {
          "id": "os-09-permission-3",
          "text": "I/O completion"
        },
        {
          "id": "os-09-permission-4",
          "text": "File search"
        }
      ],
      "correctOptionId": "os-09-permission-2",
      "feedback": {
        "os-09-permission-1": "توزيع الموارد مش هو إثبات هوية الحساب.",
        "os-09-permission-2": "صح؛ Authentication بتتحقق إنك الشخص أو الحساب اللي بتقول عليه.",
        "os-09-permission-3": "اكتمال نقل البيانات مش التحقق من هوية المستخدم.",
        "os-09-permission-4": "البحث عن ملف مش التحقق من الهوية."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-09-gui",
      "type": "true-false",
      "placement": "os-09-map",
      "objective": "Interpret interfaces in the source service map.",
      "prerequisites": [
        "os-09-map"
      ],
      "prompt": "A GUI is a way for a user to interact with the system.",
      "options": [
        {
          "id": "os-09-gui-1",
          "text": "True · صح"
        },
        {
          "id": "os-09-gui-2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-09-gui-1",
      "feedback": {
        "os-09-gui-1": "صح؛ GUI واجهة بأزرار ونوافذ، ومن طرق التعامل في سلايد 4.",
        "os-09-gui-2": "الجملة صح؛ User interface ممكن تكون GUI أو Command line أو Batch زي الرسم."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            4
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-09-guarantee",
      "type": "true-false",
      "placement": "os-09-safe",
      "objective": "Separate error-handling responsibility from perfect repair.",
      "prerequisites": [
        "os-09-safe"
      ],
      "prompt": "Error detection guarantees that every detected error will be repaired.",
      "options": [
        {
          "id": "os-09-guarantee-1",
          "text": "True · صح"
        },
        {
          "id": "os-09-guarantee-2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-09-guarantee-2",
      "feedback": {
        "os-09-guarantee-1": "غلط؛ النظام ينتبه للخطأ ويتعامل معاه، لكن مش كل خطأ له إصلاح ناجح.",
        "os-09-guarantee-2": "صح؛ ممكن التعامل يكون بإبلاغ البرنامج بالفشل. Error detection مش ضمان إصلاح كل خطأ."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-09-one-service",
      "type": "true-false",
      "placement": "os-09-work",
      "objective": "Recognize that services may participate in the same operation.",
      "prerequisites": [
        "os-09-work"
      ],
      "prompt": "Reading a file can involve both file-system services and I/O operations.",
      "options": [
        {
          "id": "os-09-one-service-1",
          "text": "True · صح"
        },
        {
          "id": "os-09-one-service-2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-09-one-service-1",
      "feedback": {
        "os-09-one-service-1": "صح؛ تنظيم الملف ونقل البيانات من الجهاز ممكن يشتركوا في نفس القراءة.",
        "os-09-one-service-2": "الجملة صح؛ الخدمات مش خانات تمنع إن العملية الواحدة تحتاج أكتر من خدمة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    }
  ],
  "glossary": [
    {
      "id": "os-09-service",
      "term": "OS service",
      "translation": "خدمة بيقدّمها نظام التشغيل",
      "definition": "A capability provided by the OS to support programs or system operation.",
      "explanation": "زي تشغيل برنامج أو التعامل مع ملفات.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            4,
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-interface",
      "term": "User interface",
      "translation": "طريقة تعاملك مع النظام",
      "definition": "A means through which a user interacts with a system.",
      "explanation": "زي GUI أو Command line أو Batch في الرسم.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            4
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-gui",
      "term": "GUI",
      "translation": "واجهة رسومية",
      "definition": "A user interface based on graphical elements.",
      "explanation": "أزرار ونوافذ بتتفاعل معاها.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            4
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-cli",
      "term": "Command-line interface (CLI)",
      "translation": "واجهة بتستقبل أوامر مكتوبة",
      "definition": "A user interface based on textual commands.",
      "explanation": "بتكتب أمر بدل ما تضغط زر؛ هنا بنفهم الاسم بس.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            4
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-batch",
      "term": "Batch interface",
      "translation": "تشغيل أوامر كمجموعة",
      "definition": "An interface for submitting a sequence of commands for execution.",
      "explanation": "مجموعة أوامر تتنفّذ بدل ما تدخل كل واحدة لوحدها.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            4
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-execution",
      "term": "Program execution",
      "translation": "تحميل البرنامج وتشغيله وإنهاؤه",
      "definition": "The service of loading, running, and terminating a program.",
      "explanation": "زي فتح برنامج الواجب ثم قفله.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-io",
      "term": "I/O operations",
      "translation": "نقل البيانات من وإلى الأجهزة",
      "definition": "Operations that transfer data to or from I/O devices.",
      "explanation": "قراءة بيانات من قرص أو إدخال من كيبورد.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-files",
      "term": "File-system manipulation",
      "translation": "عمليات الملفات والمجلدات",
      "definition": "Services for reading, writing, deleting, and searching files and directories.",
      "explanation": "الحفظ والبحث عن report.txt أمثلة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-communications",
      "term": "Communications",
      "translation": "تبادل البيانات بين البرامج الشغالة",
      "definition": "Exchange of information between processes, including over a network.",
      "explanation": "برنامج يبعت بيانات لبرنامج على جهاز تاني.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-allocation",
      "term": "Resource allocation",
      "translation": "توزيع موارد الجهاز",
      "definition": "Assignment of available resources among competing jobs.",
      "explanation": "تنظيم استخدام CPU والذاكرة بين البرامج.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-accounting",
      "term": "Accounting",
      "translation": "تسجيل استخدام الموارد",
      "definition": "Tracking which users use what kinds and amounts of resources.",
      "explanation": "تعرف كل حساب استخدم قد إيه؛ مش توزيع الموارد.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-error",
      "term": "Error detection",
      "translation": "الانتباه للأخطاء والتعامل معاها",
      "definition": "Recognition of errors so that the system can take appropriate action.",
      "explanation": "ممكن يبلغ البرنامج إن القراءة فشلت.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-protection",
      "term": "Protection",
      "translation": "التحكم في الوصول للموارد",
      "definition": "Control of access to system resources.",
      "explanation": "حسابك له صلاحية ملف وحساب تاني لأ.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-security",
      "term": "Security",
      "translation": "حماية النظام من الاستخدام غير المصرح",
      "definition": "Measures that guard the system and its resources against unauthorized use.",
      "explanation": "تشمل التحقق من الهوية وتكمل التحكم في الوصول.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-authentication",
      "term": "Authentication",
      "translation": "التحقق من الهوية",
      "definition": "Verification of a claimed identity.",
      "explanation": "النظام يتأكد إن الحساب ده حسابك.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-09-process",
      "term": "Process",
      "translation": "برنامج وهو بيتنفّذ",
      "definition": "A program in execution.",
      "explanation": "اسم البرنامج الشغّال اللي بيتبادل بيانات؛ التفاصيل بعدين.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            5
          ]
        }
      ],
      "kind": "prerequisite"
    }
  ],
  "visualizations": [
    {
      "id": "os-09-save-path",
      "conceptId": "os-09-map",
      "title": "One save request, several OS services",
      "description": "مثال توضيحي لحفظ ملف؛ التنفيذ الحقيقي ممكن يضم خطوات أكتر.",
      "legend": "البرنامج طالب الحفظ، Services وظائف من النظام، وSSD جزء Hardware. الأسهم لتحت طلب أو اعتماد؛ السهم لفوق نتيجة. الحدود مناطق مسؤولية، مش رسم تفصيلي لوقت CPU.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            4,
            5
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 420\" role=\"img\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#20546e\"/></marker></defs><rect width=\"760\" height=\"420\" fill=\"#f8fcff\"/><g font-family=\"Arial, sans-serif\"><g data-node=\"app\"><rect x=\"180\" y=\"20\" width=\"400\" height=\"60\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"57\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Application: save report.txt</text></g><g data-node=\"request\"><path d=\"M380 80 L380 120\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"470\" y=\"107\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">request</text></g><g data-node=\"entry\"><rect x=\"200\" y=\"120\" width=\"360\" height=\"50\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"152\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">System-call interface</text></g><g data-node=\"dispatch\"><path d=\"M380 170 L380 210\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"services\"><rect x=\"100\" y=\"210\" width=\"560\" height=\"75\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"242\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">File system + protection</text><text x=\"380\" y=\"267\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">I/O + error handling</text></g><g data-node=\"device\"><path d=\"M380 285 L380 325\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"ssd\"><rect x=\"230\" y=\"325\" width=\"300\" height=\"55\" rx=\"9\" fill=\"#e4f2e5\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"359.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Hardware: SSD</text></g><g data-node=\"result\"><path d=\"M660 248 H675 V50\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"715\" y=\"195\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">status</text></g><g data-node=\"return\"><path d=\"M675 50 L590 50\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g></g></svg>",
      "steps": [
        {
          "id": "os-09-save-path-step-1",
          "title": "Request",
          "detail": "البرنامج بيطلب حفظ report.txt من واجهة النظام. مش كل تفاصيل البرنامج خدمة من OS.",
          "focus": [
            "app",
            "entry",
            "request"
          ]
        },
        {
          "id": "os-09-save-path-step-2",
          "title": "Coordinate services",
          "detail": "File system تنظّم عملية الملف؛ Protection تتحقق من السماح، وI/O تتعامل مع نقل البيانات. لو حصل فشل، Error handling تتصرف.",
          "focus": [
            "services"
          ]
        },
        {
          "id": "os-09-save-path-step-3",
          "title": "Return a result",
          "detail": "الـSSD جزء Hardware. نتيجة نجاح أو فشل بترجع للبرنامج؛ ده مثال مختصر للخدمات اللي ممكن تتعاون.",
          "focus": [
            "ssd",
            "result",
            "return"
          ]
        }
      ]
    }
  ]
};
  if(typeof module==='object'&&module.exports) module.exports=lesson;
  else root.OSPilotLesson=lesson;
})(typeof window!=='undefined'?window:globalThis);
