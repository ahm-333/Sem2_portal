(function(root) {
  'use strict';
  const lesson = {
  "id": "os-01",
  "version": "1.1.0",
  "guideVersion": "1.1.0",
  "courseId": "operating-system",
  "lectureId": "1",
  "title": "مين بيعمل إيه جوّه جهازك؟",
  "subtitle": "إنت بتستخدم Word، والـOS بيدير موارد الجهاز. نفهم كل واحد بيعمل إيه، ونفرّق بين OS وKernel.",
  "sources": [
    {
      "id": "current-ch1",
      "title": "Chapter 1 · Introduction",
      "driveId": "14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M",
      "url": "https://drive.google.com/file/d/14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M/view",
      "sha256": "c81ae8d50d261ffbd4c78ebf75b42f3f980c50298bba19b32f5779b3d1745e7b",
      "slides": [
        4,
        5,
        6,
        7,
        8
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    },
    {
      "id": "historical-sheet",
      "title": "Ch1 Questions DrShrouk OS",
      "driveId": "1WkxnixBAGrYr-G9Nzv5FOuurlRsUZxm3",
      "url": "https://drive.google.com/file/d/1WkxnixBAGrYr-G9Nzv5FOuurlRsUZxm3/view",
      "sha256": "9691266905ffab485ccaf40449348830a12c8c5da4d72d2a98519597034e10e9",
      "note": "ورقة أسئلة قديمة؛ مش مثبت إنها امتحان أو إن ليها إجابة رسمية."
    }
  ],
  "concepts": [
    {
      "id": "resources",
      "title": "Hardware resources",
      "eyebrow": "01 · نبدأ بالمصطلحات",
      "summary": "Programs use hardware resources to run.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5
          ]
        }
      ],
      "paragraphs": [
        "خلّينا ناخد مثال: فاتح <bdi lang=\"en\">Word</bdi> و<bdi lang=\"en\">Chrome</bdi> جنب بعض. كل واحد فيهم <bdi lang=\"en\">Program</bdi>: مجموعة تعليمات الجهاز بينفّذها.",
        "البرامج دي محتاجة <bdi lang=\"en\">CPU</bdi> و<bdi lang=\"en\">RAM</bdi> وأجهزة تانية. الأجزاء المادية دي اسمها <bdi lang=\"en\">Hardware</bdi>، واللي البرنامج بيستخدمه منها بنسميه <bdi lang=\"en\">Resource</bdi>."
      ],
      "terms": [
        {
          "term": "CPU",
          "text": "بينفّذ تعليمات البرنامج."
        },
        {
          "term": "RAM",
          "text": "بيكون فيها بيانات وتعليمات البرنامج وهو شغّال."
        },
        {
          "term": "Storage",
          "text": "زي SSD؛ عليه الملفات اللي حفظتها."
        },
        {
          "term": "I/O",
          "text": "زي الكتابة بالكيبورد وعرض الكلام على الشاشة. قراءة ملف من SSD برضه I/O."
        }
      ],
      "clarification": "دي المصطلحات اللي هنحتاجها هنا بس. تعريفها بالإنجليزي ومعناها بالمصري في آخر الدرس."
    },
    {
      "id": "roles",
      "title": "Four components of a computer system",
      "eyebrow": "02 · كل واحد بيعمل إيه؟",
      "summary": "Users use applications; the OS manages hardware use.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            4,
            5
          ]
        }
      ],
      "paragraphs": [
        "إنت الـ<bdi lang=\"en\">User</bdi>، و<bdi lang=\"en\">Word</bdi> هو الـ<bdi lang=\"en\">Application program</bdi>. الـ<bdi lang=\"en\">Operating System (OS)</bdi> بيدير استخدام موارد الجهاز. والـ<bdi lang=\"en\">Hardware</bdi> فيه <bdi lang=\"en\">CPU</bdi> و<bdi lang=\"en\">RAM</bdi> وباقي الأجهزة.",
        "الـ<bdi lang=\"en\">User</bdi> مش لازم يبقى شخص؛ ممكن يبقى آلة أو كمبيوتر تاني، زي ما سلايد 5 بيوضح."
      ]
    },
    {
      "id": "purpose",
      "title": "What does the OS do?",
      "eyebrow": "03 · ليه محتاجينه؟",
      "summary": "The OS helps programs run and manages the system’s resources.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            6,
            7
          ]
        }
      ],
      "paragraphs": [
        "إنت يهمّك البرنامج يبقى سهل ويرد عليك بسرعة. دي <bdi lang=\"en\">User view</bdi>. من ناحية <bdi lang=\"en\">System view</bdi>، الـ<bdi lang=\"en\">OS</bdi> محتاج يدير طلبات البرامج على الموارد المحدودة.",
        "الـ<bdi lang=\"en\">OS</bdi> بيسهّل التعامل مع الجهاز وبيساعد البرامج تشتغل. سلايد 7 بيشرح دوره من ناحيتين:"
      ],
      "roles": [
        {
          "term": "Resource allocator",
          "title": "يوزّع الموارد",
          "text": "Word وChrome محتاجين CPU وRAM. الـOS بينظّم استخدامهم للموارد بكفاءة وعدل. العدل مش لازم يعني نص لكل برنامج."
        },
        {
          "term": "Control program",
          "title": "يتحكّم في تشغيل البرامج",
          "text": "بيتحكّم في تشغيل البرامج علشان يمنع الأخطاء وسوء الاستخدام قدر الإمكان. ده مش ضمان إن أي برنامج مستحيل يغلط."
        }
      ],
      "comparison": "Word بتكتب عليه التقرير وتغيّر شكل الكلام. إدارة استخدام CPU وRAM بين البرامج دي مسؤولية الـOS.",
      "clarification": "User view بتوصف أولويات الاستخدام؛ مش معناها إن مفيش مستخدم بيهتم باستهلاك الموارد."
    },
    {
      "id": "kernel",
      "title": "Kernel, system programs and applications",
      "eyebrow": "04 · نفرّق بينهم",
      "summary": "The kernel is the core of the OS. A bundled tool is not automatically kernel code.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5,
            7,
            8
          ]
        }
      ],
      "paragraphs": [
        "الـ<bdi lang=\"en\">Kernel</bdi> هو الجزء الأساسي في الـ<bdi lang=\"en\">OS</bdi> اللي بيدير موارد الجهاز. ممكن تقفل <bdi lang=\"en\">Word</bdi>، لكن الـ<bdi lang=\"en\">Kernel</bdi> بيفضل موجود طول ما النظام شغّال. ده مش معناه إنه بيستخدم الـ<bdi lang=\"en\">CPU</bdi> بنسبة 100%.",
        "كلمة <bdi lang=\"en\">OS</bdi> ممكن يقصد بيها الـ<bdi lang=\"en\">Kernel</bdi>، أو النظام بكل البرامج اللي جايّة معاه. سلايد 8 بيقول إن مفيش تعريف واحد متفق عليه في كل الحالات.",
        "الـ<bdi lang=\"en\">System programs</bdi> أدوات بتساعدك تستخدم النظام. في مثالنا، برنامج بترتّب بيه ملفاتك جاي مع النظام وبيشتغل برّه الـ<bdi lang=\"en\">Kernel</bdi> يعتبر <bdi lang=\"en\">System program</bdi>؛ و<bdi lang=\"en\">Word</bdi> هو <bdi lang=\"en\">Application program</bdi>. وجود برنامج مع النظام لوحده مش دليل إنه جزء من الـ<bdi lang=\"en\">Kernel</bdi>."
      ],
      "clarification": "البرامج اللي بتيجي مع النظام بتختلف من منتج للتاني. سلايد 4 بيجمع System وApplication programs في طبقة؛ وسلايد 8 بيفرّقهم عن Kernel."
    }
  ],
  "diagram": {
    "id": "role-map",
    "sourceRefs": [
      {
        "sourceId": "current-ch1",
        "slides": [
          4,
          5,
          8
        ]
      }
    ],
    "actors": [
      {
        "id": "user",
        "label": "User",
        "example": "إنت عايز تكتب التقرير.",
        "detail": "إنت هنا الـUser. وفي حالات تانية ممكن كمبيوتر يستخدم النظام بدل شخص."
      },
      {
        "id": "application",
        "label": "Application program",
        "example": "Word: كتابة الكلام وتنسيقه.",
        "detail": "في Word بتكتب وتغيّر حجم الخط. دي وظائف الـApplication اللي بتستخدمه."
      },
      {
        "id": "os",
        "label": "Operating system (OS)",
        "example": "إدارة استخدام CPU وRAM والأجهزة.",
        "detail": "الـOS بيدير موارد الجهاز للبرامج. الـKernel هو الجزء الأساسي فيه."
      },
      {
        "id": "hardware",
        "label": "Hardware",
        "example": "CPU · RAM · SSD · الشاشة",
        "detail": "الـCPU بينفّذ التعليمات. RAM وباقي الأجهزة بتساعد البرنامج يشتغل."
      }
    ],
    "arrowMeaning": "السهم لتحت معناه إن اللي فوق بيعتمد على اللي تحته. في الاستخدام الفعلي النتيجة بترجع للمستخدم، لكن الأسهم هنا مش اتجاه حركة البيانات.",
    "boundary": "دي خريطة توضح مين مسؤول عن إيه، مش ترتيب تنفيذ كل ضغطة ولا شكل أجزاء الجهاز. Kernel جزء من OS، مش مكوّن خامس."
  },
  "scenario": {
    "id": "report-story",
    "sourceRefs": [
      {
        "sourceId": "current-ch1",
        "slides": [
          4,
          5,
          6,
          7
        ]
      }
    ],
    "title": "مثال: بتكتب تقرير على Word",
    "steps": [
      {
        "title": "User",
        "text": "إنت عايز تكتب تقرير، فبتفتح Word. إنت هنا الـUser."
      },
      {
        "title": "Application program",
        "text": "في Word بتكتب جملة وتكبّر الخط. دي وظائف الـApplication اللي بتستخدمه."
      },
      {
        "title": "Operating system",
        "text": "Word وChrome محتاجين CPU وRAM. الـOS بيدير استخدامهم للموارد دي علشان البرامج تقدر تشتغل."
      },
      {
        "title": "Hardware",
        "text": "الـCPU بينفّذ التعليمات، والشاشة بتعرض الكلام. لما تحفظ، الملف بيتكتب على الـSSD."
      }
    ],
    "limit": "ده مثال يوضّح دور كل واحد؛ مش أربع خطوات داخلية بتحصل بالترتيب مع كل ضغطة."
  },
  "historicalItems": [
    {
      "id": "archive-q1",
      "number": 1,
      "originalPrompt": "In the context of operating systems, what is the main purpose of a kernel?",
      "originalOptions": [
        "A. To provide a user interface for interacting with the system",
        "B. To manage the system’s CPU, memory, and other hardware resources",
        "C. To compile and execute user programs",
        "D. To create and manage network connections"
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5,
            7,
            8
          ]
        },
        {
          "sourceId": "historical-sheet",
          "item": 1,
          "page": 1
        }
      ],
      "note": "ده نص السؤال الأصلي. الإجابة اللي هنا إحنا حلّيناها وراجعناها، مش مفتاح إجابة رسمي. كلمة main بتسأل عن الدور الأساسي."
    },
    {
      "id": "archive-q14",
      "number": 14,
      "originalPrompt": "What are the four components of computer system?",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            4,
            5
          ]
        },
        {
          "sourceId": "historical-sheet",
          "item": 14,
          "page": 2
        }
      ],
      "note": "ده نص السؤال الأصلي. الإجابة اللي تحته للمذاكرة، مش نموذج إجابة رسمي."
    }
  ],
  "essayReferences": [
    {
      "id": "four-components-reference",
      "originalId": "archive-q14",
      "prompt": "What are the four components of computer system?",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            4,
            5
          ]
        },
        {
          "sourceId": "historical-sheet",
          "item": 14,
          "page": 2
        }
      ],
      "answer": "The four components are hardware, the operating system, application programs, and users. Hardware provides resources; the OS coordinates their use; applications provide functions for user tasks. Users may be people, machines, or other computers.",
      "explanation": "في مثالنا: إنت الـUser، وWord هو الـApplication. الـOS بيدير الموارد، والـCPU وRAM وباقي الأجهزة هم الـHardware."
    }
  ],
  "questions": [
    {
      "id": "roles-report",
      "type": "mcq",
      "placement": "roles",
      "objective": "Identify the application role in a concrete task.",
      "prerequisites": [
        "resources",
        "roles"
      ],
      "prompt": "In the report example, which component provides the text-formatting functions?",
      "options": [
        {
          "id": "hardware",
          "text": "Hardware"
        },
        {
          "id": "os",
          "text": "Operating system"
        },
        {
          "id": "app",
          "text": "Application program"
        },
        {
          "id": "user",
          "text": "User"
        }
      ],
      "correctOptionId": "app",
      "feedback": {
        "hardware": "الـHardware فيه CPU والأجهزة، لكن تنسيق الكلام وظيفة Word، يعني Application program.",
        "os": "الـOS بيدير موارد الجهاز. تنسيق الكلام وظيفة الـApplication، زي Word.",
        "app": "بالضبط؛ Word هو الـApplication program اللي فيه أدوات الكتابة والتنسيق. الـCPU بينفّذ تعليماته.",
        "user": "إنت بتختار حجم الخط، لكن السؤال عن البرنامج اللي بيوفّرلك أدوات التنسيق: الـApplication."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
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
      "id": "users-machines",
      "type": "true-false",
      "placement": "roles",
      "objective": "Recognize non-human users in the source model.",
      "prerequisites": [
        "roles"
      ],
      "prompt": "In this computer-system model, another computer can be a user.",
      "options": [
        {
          "id": "true",
          "text": "True · صح"
        },
        {
          "id": "false",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "true",
      "feedback": {
        "true": "صح؛ Users ممكن يبقوا أشخاص أو آلات أو أجهزة كمبيوتر تانية، زي ما سلايد 5 بيقول.",
        "false": "دي صح؛ User مش لازم يبقى شخص. ممكن آلة أو أجهزة كمبيوتر تانية تستخدم النظام."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
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
      "id": "allocation-conflict",
      "type": "mcq",
      "placement": "purpose",
      "objective": "Apply resource-allocation responsibility.",
      "prerequisites": [
        "roles",
        "purpose"
      ],
      "prompt": "A browser and a word processor request limited hardware resources. Who coordinates their use across the system?",
      "options": [
        {
          "id": "browser",
          "text": "The browser"
        },
        {
          "id": "os",
          "text": "The operating system"
        },
        {
          "id": "writer",
          "text": "The word processor"
        },
        {
          "id": "user",
          "text": "The user for every request"
        }
      ],
      "correctOptionId": "os",
      "feedback": {
        "browser": "Chrome واحد من البرامج اللي محتاجة موارد. إدارة استخدامها بين البرامج دور الـOS.",
        "os": "صح؛ ده دور الـResource allocator: الـOS بيدير الطلبات على الموارد بكفاءة وعدل.",
        "writer": "Word بتكتب عليه التقرير؛ مش هو اللي بيدير موارد الجهاز لباقي البرامج. ده دور الـOS.",
        "user": "إنت بتختار تفتح أنهي برامج، لكن مش بتوزّع CPU وRAM بنفسك مع كل طلب. الـOS بيتولّى ده."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5,
            7
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "control-guarantee",
      "type": "true-false",
      "placement": "purpose",
      "objective": "Distinguish control goals from an absolute guarantee.",
      "prerequisites": [
        "purpose"
      ],
      "prompt": "Being a control program guarantees that the OS prevents every program error.",
      "options": [
        {
          "id": "true",
          "text": "True · صح"
        },
        {
          "id": "false",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "false",
      "feedback": {
        "true": "غلط؛ الـControl program هدفه يمنع الأخطاء وسوء الاستخدام، لكن ده مش ضمان إنه يمنع كل خطأ.",
        "false": "صح؛ التحكم في تشغيل البرامج بيساعد يمنع الأخطاء وسوء الاستخدام. مش معناه إن الأخطاء مستحيلة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            7
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "view-response",
      "type": "mcq",
      "placement": "mixed",
      "objective": "Distinguish user and system viewpoints in a new observation.",
      "prerequisites": [
        "purpose"
      ],
      "prompt": "A student says, “I want the program to respond quickly and be easy to use.” Which view does this best express?",
      "options": [
        {
          "id": "user-view",
          "text": "User view: convenience and performance"
        },
        {
          "id": "allocator-view",
          "text": "System view: resolving resource conflicts"
        },
        {
          "id": "control-view",
          "text": "System view: controlling program execution"
        },
        {
          "id": "bundle-view",
          "text": "OS definition: what a vendor includes"
        }
      ],
      "correctOptionId": "user-view",
      "feedback": {
        "user-view": "صح؛ الطالب عايز سهولة استخدام واستجابة سريعة. دي User view.",
        "allocator-view": "إدارة الموارد بتأثّر على الأداء، لكن الطالب هنا بيتكلم عن تجربته: User view.",
        "control-view": "التحكم في تشغيل البرامج دور للنظام. كلام الطالب عن سهولة الاستخدام والأداء: User view.",
        "bundle-view": "البرامج اللي بتيجي مع النظام موضوع تاني. الطالب بيتكلم عن تجربة الاستخدام: User view."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            6,
            7
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "historical-kernel",
      "type": "mcq",
      "placement": "mixed",
      "objective": "Identify the broad purpose of the kernel, not a single service.",
      "prerequisites": [
        "roles",
        "purpose",
        "kernel"
      ],
      "prompt": "In the context of operating systems, what is the main purpose of a kernel?",
      "options": [
        {
          "id": "interface",
          "text": "To provide a user interface for interacting with the system"
        },
        {
          "id": "resources",
          "text": "To manage the system’s CPU, memory, and other hardware resources"
        },
        {
          "id": "compile",
          "text": "To compile and execute user programs"
        },
        {
          "id": "network",
          "text": "To create and manage network connections"
        }
      ],
      "correctOptionId": "resources",
      "feedback": {
        "interface": "واجهة الاستخدام بتساعدك تتعامل مع الجهاز، لكن الدور الأساسي للـKernel هنا هو إدارة الموارد.",
        "resources": "صح؛ الدور الأساسي هنا إدارة CPU وmemory وباقي موارد الجهاز. ده حل مستقل، مش مفتاح إجابة رسمي.",
        "compile": "الـCompiler بيترجم الكود. الـKernel بيساعد البرامج تشتغل، لكن الدور الأساسي اللي السؤال بيسأل عنه هو إدارة الموارد.",
        "network": "الاتصالات خدمة محددة. السؤال عن الدور الأساسي للـKernel كله: إدارة موارد الجهاز."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5,
            7,
            8
          ]
        },
        {
          "sourceId": "historical-sheet",
          "item": 1,
          "page": 1
        }
      ],
      "provenance": {
        "kind": "original",
        "originalId": "archive-q1"
      }
    },
    {
      "id": "bundle-kernel",
      "type": "mcq",
      "placement": "mixed",
      "objective": "Diagnose the inference that shipped software must be kernel code.",
      "prerequisites": [
        "kernel"
      ],
      "prompt": "A student says, “This file utility came with the OS, so it must be part of the kernel.” Which reply best evaluates that reasoning?",
      "options": [
        {
          "id": "bundle-defines",
          "text": "The vendor bundle alone determines whether a program is kernel code."
        },
        {
          "id": "all-system",
          "text": "Every system program shipped with an OS belongs to its kernel."
        },
        {
          "id": "apps-only",
          "text": "Only application programs can exist outside the kernel."
        },
        {
          "id": "system-program",
          "text": "System programs can ship with an OS while remaining outside its kernel."
        }
      ],
      "correctOptionId": "system-program",
      "feedback": {
        "bundle-defines": "وجود البرنامج مع حزمة النظام لوحده مش دليل إنه جزء من Kernel. لازم نفرّق بين الحزمة والنواة.",
        "all-system": "System programs هنا برامج منفصلة عن الـKernel، زي ما سلايد 8 بيوضّح.",
        "apps-only": "مش Applications بس اللي برّه Kernel؛ في System programs كمان. عشان كده الاستنتاج مش كفاية.",
        "system-program": "صح؛ ممكن System program ييجي مع الـOS وهو برّه Kernel. وجوده مع النظام مش دليل إنه جزء من النواة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            8
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "four-components-adapted",
      "type": "mcq",
      "placement": "mixed",
      "objective": "Recall the four roles without replacing one by the kernel.",
      "prerequisites": [
        "roles",
        "kernel"
      ],
      "prompt": "Which list gives the four computer-system components in slides 4–5?",
      "options": [
        {
          "id": "devices",
          "text": "CPU, RAM, storage, I/O devices"
        },
        {
          "id": "replaced",
          "text": "Hardware, kernel, system programs, applications"
        },
        {
          "id": "four-roles",
          "text": "Hardware, OS, application programs, users"
        },
        {
          "id": "interfaces",
          "text": "Users, user interface, applications, system programs"
        }
      ],
      "correctOptionId": "four-roles",
      "feedback": {
        "devices": "دي أجزاء وأمثلة للـHardware. السؤال عن المكونات الأربعة للنظام كله.",
        "replaced": "القائمة خلطت أنواع البرامج وشالت Users. المكونات الأربعة: Hardware وOS وApplications وUsers.",
        "four-roles": "صح؛ دي المكونات الأربعة في سلايد 5. الـKernel جزء من الـOS، مش مكوّن خامس.",
        "interfaces": "القائمة ناقصها Hardware وOS. المطلوب Hardware وOS وApplication programs وUsers."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            4,
            5
          ]
        },
        {
          "sourceId": "historical-sheet",
          "item": 14,
          "page": 2
        }
      ],
      "provenance": {
        "kind": "adapted",
        "originalId": "archive-q14",
        "changes": "السؤال الأصلي مقالي. هنا حوّلناه لاختيار من متعدد، والاختيارات اتكتبت للتدريب."
      }
    }
  ],
  "glossary": [
    {
      "id": "hardware",
      "term": "Hardware",
      "translation": "أجزاء الجهاز المادية",
      "definition": "The physical components of a computer system.",
      "explanation": "دي الأجزاء اللي تقدر تلمسها، زي CPU وRAM والشاشة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "resource",
      "term": "Resource",
      "translation": "حاجة البرنامج بيستخدمها من الجهاز",
      "definition": "A computing capability or device that a program uses to do its work.",
      "explanation": "زي قدرة CPU أو مساحة في RAM أو جهاز محتاجه البرنامج.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "cpu",
      "term": "CPU",
      "translation": "المعالج",
      "definition": "The component that executes program instructions.",
      "explanation": "ده اللي بينفّذ تعليمات البرنامج.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "ram",
      "term": "RAM / Main memory",
      "translation": "ذاكرة للبيانات والتعليمات اللي البرامج بتستخدمها وهي شغّالة",
      "definition": "Working memory that holds instructions and data used by running programs.",
      "explanation": "بيكون فيها التعليمات والبيانات اللي البرامج بتستخدمها وهي شغّالة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "storage",
      "term": "Storage",
      "translation": "تخزين الملفات",
      "definition": "Hardware used to keep files for later use.",
      "explanation": "زي SSD؛ عليه الملفات اللي بتحتفظ بيها، حتى بعد ما تقفل البرنامج.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "io",
      "term": "Input/Output (I/O)",
      "translation": "إدخال وإخراج البيانات",
      "definition": "The transfer of data between a computer and its input/output devices.",
      "explanation": "زي لما تكتب بالكيبورد، أو الكلام يظهر على الشاشة، أو تقرأ ملف من SSD.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "program",
      "term": "Program",
      "translation": "برنامج",
      "definition": "A set of instructions that a computer can execute.",
      "explanation": "مجموعة تعليمات الجهاز بينفّذها علشان يعمل حاجة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "user",
      "term": "User",
      "translation": "اللي بيستخدم النظام",
      "definition": "A person, machine, or other computer that uses the system.",
      "explanation": "ممكن يبقى شخص زيك، أو آلة أو كمبيوتر تاني بيستخدم النظام.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "application",
      "term": "Application program",
      "translation": "برنامج بتستخدمه لمهمة معينة",
      "definition": "A program that provides functions for a user’s tasks.",
      "explanation": "زي Word للكتابة أو Chrome لفتح صفحات الويب.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os",
      "term": "Operating system (OS)",
      "translation": "نظام التشغيل",
      "definition": "Software that controls and coordinates hardware use by applications and users.",
      "explanation": "بيدير استخدام البرامج والمستخدمين لموارد الجهاز.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5,
            6
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "kernel",
      "term": "Kernel",
      "translation": "النواة؛ الجزء الأساسي في OS",
      "definition": "The core of an operating system, present during system operation and responsible for basic resource management.",
      "explanation": "الجزء الأساسي اللي بيدير الموارد وبيفضل موجود طول ما النظام شغّال؛ ده مش معناه إنه بيستخدم CPU بنسبة 100%.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5,
            7,
            8
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "system-program",
      "term": "System program",
      "translation": "برنامج مساعد بييجي مع النظام",
      "definition": "A program supplied with the OS to support system use, separate from the kernel in this lesson’s model.",
      "explanation": "زي برنامج بترتّب بيه ملفاتك جاي مع النظام وبيشتغل برّه Kernel في مثالنا. البرامج اللي بتيجي مع النظام بتختلف.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            8
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "allocator",
      "term": "Resource allocator",
      "translation": "دور OS في توزيع الموارد",
      "definition": "The OS role of managing resources and resolving competing requests for efficient and fair use.",
      "explanation": "لو البرامج محتاجة نفس الموارد، الـOS بينظّم استخدامها بكفاءة وعدل.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            7
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "control",
      "term": "Control program",
      "translation": "دور OS في التحكم في تشغيل البرامج",
      "definition": "The OS role of controlling program execution to help prevent errors and improper use.",
      "explanation": "بيتحكّم في تشغيل البرامج علشان يمنع الأخطاء وسوء الاستخدام قدر الإمكان.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            7
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "user-view",
      "term": "User view",
      "translation": "النظام من وجهة نظر اللي بيستخدمه",
      "definition": "A view focused on convenience, ease of use, and performance.",
      "explanation": "زي إنك عايز البرنامج يبقى سهل ويرد عليك بسرعة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            7
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "system-view",
      "term": "System view",
      "translation": "النظام من ناحية إدارة الجهاز",
      "definition": "A view focused on resource management and control of program execution.",
      "explanation": "بنبص للـOS وهو بيدير الموارد وبيتحكّم في تشغيل البرامج.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            7
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "compiler",
      "term": "Compiler",
      "translation": "برنامج بيترجم الكود",
      "definition": "A program that translates source code into another form, often machine code.",
      "explanation": "بيحوّل الكود لشكل تاني. الترجمة دي مش وظيفة الـKernel الأساسية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "browser",
      "term": "Web browser",
      "translation": "متصفح الويب",
      "definition": "An application used to retrieve and display web pages.",
      "explanation": "زي Chrome؛ بتفتح عليه صفحات الويب.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "word-processor",
      "term": "Word processor",
      "translation": "برنامج لكتابة المستندات وتنسيقها",
      "definition": "An application for creating, editing, and formatting text documents.",
      "explanation": "زي Word؛ بتكتب فيه التقرير وتعدّل الكلام وشكله.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            5
          ]
        }
      ],
      "kind": "source-concept"
    }
  ]
};
  if(typeof module==='object'&&module.exports) module.exports=lesson;
  else root.OSPilotLesson=lesson;
})(typeof window!=='undefined'?window:globalThis);
