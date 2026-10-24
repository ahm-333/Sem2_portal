(function(root) {
  'use strict';
  const lesson = {
  "id": "os-07",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "1",
  "title": "User mode, kernel mode and the timer",
  "subtitle": "طلب خدمة مش معناه إن Process تانية اشتغلت.",
  "sources": [
    {
      "id": "current-ch1",
      "title": "Chapter 1 · Introduction",
      "driveId": "14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M",
      "url": "https://drive.google.com/file/d/14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M/view",
      "sha256": "c81ae8d50d261ffbd4c78ebf75b42f3f980c50298bba19b32f5779b3d1745e7b",
      "slides": [
        24,
        25
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-07-dual-mode",
      "title": "Hardware enforces different execution privileges",
      "eyebrow": "01 · نفهمها بمثال",
      "summary": "User mode restricts privileged operations; kernel mode permits protected OS operations.",
      "paragraphs": [
        "برنامجك ما ينفعش يغيّر أي إعداد حساس في الجهاز وقت ما يحب. <bdi lang=\"en\">Dual-mode operation</bdi> بيفرّق بين <bdi lang=\"en\">User mode</bdi> و<bdi lang=\"en\">Kernel mode</bdi> علشان يحمي OS وباقي المكوّنات.",
        "الـHardware بيوفّر <bdi lang=\"en\">Mode bit</bdi> يميّز وضع التنفيذ. بعض التعليمات <bdi lang=\"en\">Privileged instructions</bdi>: مسموحة في Kernel mode بس. دي حماية مدعومة من Hardware، مش مجرد اتفاق إن البرنامج يتصرف كويس.",
        "في رسم المحاضرة، User mode بيتكتب <bdi lang=\"en\">mode bit = 1</bdi> وKernel mode بيتكتب <bdi lang=\"en\">mode bit = 0</bdi>. دي قيم نموذج السلايد، مش شرط أرقام أو أسماء أوضاع كل Architecture."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            24,
            25
          ]
        }
      ]
    },
    {
      "id": "os-07-mode-change",
      "title": "A system call can return to the same process",
      "eyebrow": "02 · نفهمها بمثال",
      "summary": "Entering kernel mode changes privilege; switching processes changes whose execution continues.",
      "paragraphs": [
        "البرنامج A محتاج خدمة من OS، فيعمل <bdi lang=\"en\">System call</bdi>. التنفيذ يدخل Kernel mode علشان كود OS ينفّذ الخدمة، وبعدين ممكن يرجع لـA في User mode. هنا غيّرنا <bdi lang=\"en\">Mode</bdi> ورجعنا لنفس <bdi lang=\"en\">Process</bdi>.",
        "الـ<bdi lang=\"en\">Process switch</bdi> حاجة مختلفة: النظام يوقف تنفيذ A مؤقتًا ويكمّل Process تانية B. الـOS ممكن يقرّر ده بعد ما يرجعله التحكم، لكن مش كل System call ولا كل Interrupt لازم يعمل تبديل Process.",
        "فلو حد قال: “دخلنا Kernel، يبقى أكيد B اشتغلت”، نراجع الخطوات: هل اتغيّرت صلاحية التنفيذ بس، ولا اتغيّر كمان البرنامج اللي هنكمّل تنفيذه؟ حفظ معلومات الرجوع للخدمة لوحده ما يثبتش تبديل Process."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            24,
            25
          ]
        }
      ],
      "clarification": "التمييز بين Mode transition وProcess switch توضيح علمي لازم لقراءة الرسم صح؛ تفاصيل حفظ الحالة والـScheduler بتتشرح لاحقًا، ومش مطلوبة هنا."
    },
    {
      "id": "os-07-timer",
      "title": "The timer lets the OS regain control",
      "eyebrow": "03 · نفهمها بمثال",
      "summary": "A privileged timer setup produces an interrupt after an allotted interval.",
      "paragraphs": [
        "لو برنامج دخل <bdi lang=\"en\">Infinite loop</bdi> ومش بيرجع التحكم، نحتاج وسيلة مستقلة عنه. الـOS يضبط <bdi lang=\"en\">Timer</bdi> قبل تشغيله، علشان يطلع Interrupt بعد فترة. ضبط Timer تعليمة Privileged؛ برنامج User mode ما يعدّلهاش بحرّيته.",
        "السلايد بيشرحها كـCounter بيقل مع <bdi lang=\"en\">Physical clock</bdi>. لما يوصل للصفر يطلع Interrupt، والـOS يستعيد التحكم ويقرّر يكمل أو يغيّر الشغل أو ينهي برنامج تجاوز الوقت المسموح حسب سياسة النظام.",
        "Timer مش بيعرف لوحده إن الحساب “غلط”، ومش لازم ينهي البرنامج كل مرة. دوره يضمن فرصة رجوع التحكم بدل الاعتماد على إن البرنامج يسلّمه طوعًا."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            25
          ]
        }
      ]
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-07-same-process",
      "type": "mcq",
      "placement": "os-07-mode-change",
      "objective": "Separate mode transition from process switching.",
      "prerequisites": [
        "os-07-mode-change"
      ],
      "prompt": "A makes a system call, the kernel serves it, and A resumes. Which change is demonstrated?",
      "options": [
        {
          "id": "os-07-same-process-2",
          "text": "A guaranteed switch from A to B"
        },
        {
          "id": "os-07-same-process-3",
          "text": "No mode transition because the process name stayed A"
        },
        {
          "id": "os-07-same-process-1",
          "text": "A mode transition, with no required switch to another process"
        }
      ],
      "correctOptionId": "os-07-same-process-1",
      "feedback": {
        "os-07-same-process-1": "صح؛ دخلنا Kernel ورجعنا لـA نفسها. Process switch يحتاج إننا نكمل Process مختلفة.",
        "os-07-same-process-2": "مفيش B في السيناريو. دخول Kernel مش إثبات تبديل Process.",
        "os-07-same-process-3": "اسم Process ممكن يفضل A مع تغيير صلاحية التنفيذ من User إلى Kernel ثم الرجوع."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            24,
            25
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-07-privileged-user",
      "type": "true-false",
      "placement": "os-07-dual-mode",
      "objective": "Identify enforcement of privileged operations.",
      "prerequisites": [
        "os-07-dual-mode"
      ],
      "prompt": "A normal user-mode program may directly execute every privileged instruction.",
      "options": [
        {
          "id": "os-07-privileged-user-true",
          "text": "True · صح"
        },
        {
          "id": "os-07-privileged-user-false",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-07-privileged-user-false",
      "feedback": {
        "os-07-privileged-user-true": "غلط؛ Privileged instructions متاحة في Kernel mode بس في نموذج Dual mode.",
        "os-07-privileged-user-false": "صح اختيارك؛ Hardware بيفرض الفرق، والبرنامج يطلب الخدمات المناسبة بدل تنفيذ التعليمات الحساسة بحرّيته."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            24
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-07-timer-expiry",
      "type": "mcq",
      "placement": "os-07-timer",
      "objective": "Identify the consequence of timer expiry.",
      "prerequisites": [
        "os-07-timer"
      ],
      "prompt": "In the slide’s timer model, what happens when the counter reaches zero?",
      "options": [
        {
          "id": "os-07-timer-expiry-1",
          "text": "An interrupt lets the OS regain control"
        },
        {
          "id": "os-07-timer-expiry-2",
          "text": "The application automatically receives kernel privileges forever"
        },
        {
          "id": "os-07-timer-expiry-3",
          "text": "The computer must terminate every running program"
        }
      ],
      "correctOptionId": "os-07-timer-expiry-1",
      "feedback": {
        "os-07-timer-expiry-1": "صح؛ OS بعد كده يقرّر التصرف المناسب.",
        "os-07-timer-expiry-2": "Timer ما بيدّيش User program صلاحيات Kernel؛ بيرجّع التحكم للـOS.",
        "os-07-timer-expiry-3": "انتهاء Timer مش أمر بإنهاء كل البرامج. قرار الاستمرار أو الإنهاء منفصل."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            25
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-07-timer-user-reset",
      "type": "true-false",
      "placement": "os-07-timer",
      "objective": "Explain why timer setup is privileged.",
      "prerequisites": [
        "os-07-timer"
      ],
      "prompt": "Allowing any user-mode process to freely reset the timer could undermine the OS’s ability to regain control.",
      "options": [
        {
          "id": "os-07-timer-user-reset-true",
          "text": "True · صح"
        },
        {
          "id": "os-07-timer-user-reset-false",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-07-timer-user-reset-true",
      "feedback": {
        "os-07-timer-user-reset-true": "صح؛ برنامج ممكن يؤجّل Interrupt باستمرار. علشان كده ضبط Timer عملية Privileged في السلايد.",
        "os-07-timer-user-reset-false": "دي صح؛ حرية البرنامج في إعادة ضبط Timer تلغي الغرض من وسيلة رجوع التحكم."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            25
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
      "id": "os-07-glossary-dual-mode",
      "term": "Dual-mode operation",
      "translation": "تنفيذ بوضعين بصلاحيات مختلفة",
      "definition": "An execution model separating user and kernel privileges.",
      "explanation": "الحماية مش مجرد وعد من البرنامج؛ Hardware بيساعد يفرضها.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            24
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-07-glossary-user-mode",
      "term": "User mode",
      "translation": "وضع تنفيذ محدود الصلاحيات",
      "definition": "The restricted execution mode for normal application code.",
      "explanation": "مش بيسمح بتنفيذ التعليمات الحساسة مباشرة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            24
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-07-glossary-kernel-mode",
      "term": "Kernel mode",
      "translation": "وضع تنفيذ بصلاحيات النظام",
      "definition": "The execution mode permitting privileged OS operations.",
      "explanation": "يدخل فيه كود OS لخدمة طلب مناسب؛ مش تصريح مفتوح للبرنامج.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            24
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-07-glossary-mode-bit",
      "term": "Mode bit",
      "translation": "علامة Hardware لوضع التنفيذ",
      "definition": "Hardware state identifying the execution mode in the source model.",
      "explanation": "المصدر بيرسم User=1 وKernel=0؛ تفاصيل الأجهزة بتختلف.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            24,
            25
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-07-glossary-privileged",
      "term": "Privileged instruction",
      "translation": "تعليمة محتاجة Kernel mode",
      "definition": "An instruction executable only in kernel mode in the dual-mode model.",
      "explanation": "زي ضبط Timer في مثال السلايد.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            24,
            25
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-07-glossary-syscall",
      "term": "System call",
      "translation": "طلب خدمة من OS",
      "definition": "A controlled request that enters the kernel to perform an OS service.",
      "explanation": "ممكن يرجع لنفس Process من غير تبديل لواحدة تانية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            24,
            25
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-07-glossary-process-switch",
      "term": "Process switch",
      "translation": "تكملة تنفيذ Process مختلفة",
      "definition": "Changing execution from one process to another.",
      "explanation": "غير تغيير Mode؛ ده توضيح لازم علشان ما نفسّرش الرسم غلط.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            24,
            25
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-07-glossary-process",
      "term": "Process",
      "translation": "برنامج أثناء التنفيذ",
      "definition": "A program in execution.",
      "explanation": "A وB في الرسم أسماء لبرنامجين أثناء التنفيذ.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            24,
            25
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-07-glossary-timer",
      "term": "Timer",
      "translation": "وسيلة Interrupt بعد مدة",
      "definition": "A mechanism configured to generate an interrupt after an interval.",
      "explanation": "بيرجّع التحكم للـOS حتى لو البرنامج ما سلّموش طوعًا.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            25
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-07-glossary-counter",
      "term": "Counter / clock tick",
      "translation": "عدّاد ونبضة ساعة",
      "definition": "A counter decreases with clock ticks and triggers an interrupt at zero in the source model.",
      "explanation": "الأرقام في رسمنا توضيحية، مش قياس زمني.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            25
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-07-glossary-infinite-loop",
      "term": "Infinite loop",
      "translation": "تكرار ما بينتهيش من نفسه",
      "definition": "Execution that keeps repeating without reaching an intended exit.",
      "explanation": "Timer يتيح رجوع التحكم، مش بيصلّح منطق البرنامج لوحده.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            25
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-07-glossary-interrupt",
      "term": "Interrupt",
      "translation": "حدث ينقل التحكم لكود خدمة",
      "definition": "An event transferring execution to a service routine.",
      "explanation": "هنا مصدره Timer بدل جهاز انتهى من I/O.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            25
          ]
        }
      ],
      "kind": "prerequisite"
    }
  ],
  "visualizations": [
    {
      "id": "os-07-mode-versus-process",
      "conceptId": "os-07-mode-change",
      "title": "Two distinct traces: privilege and process identity",
      "description": "اقرأ اسم Process جنب Mode. السطر الأول كله A، والسطر التاني فيه قرار مختلف يكمّل B.",
      "legend": "الأسهم ترتيب انتقال التحكم من الشمال لليمين. السطران سيناريوهان بديلان، مش خطوتان لازم يحصلوا لنفس الطلب. A وB أسماء Processes توضيحية. مستطيل Kernel هو كود OS أثناء الخدمة؛ مش برنامج مستخدم ثالث. لا يعرض تفاصيل حفظ Registers.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            24,
            25
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 400\" role=\"img\"><defs><marker id=\"arrow\" markerWidth=\"9\" markerHeight=\"9\" refX=\"8\" refY=\"4\" orient=\"auto\"><path d=\"M0 0 L8 4 L0 8 Z\" fill=\"#315e72\"/></marker></defs><rect width=\"760\" height=\"400\" fill=\"#f8fbfc\"/><text x=\"25\" y=\"40\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">1. System call; same process continues</text><g data-node=\"a-user\"><rect x=\"25\" y=\"70\" width=\"180\" height=\"85\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"115\" y=\"119.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">A: user mode</text></g><path d=\"M205 112 L280 112\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><text x=\"242.5\" y=\"103\" text-anchor=\"middle\" font-size=\"18\" font-family=\"Arial, sans-serif\" fill=\"#163745\">call</text><g data-node=\"a-kernel\"><rect x=\"285\" y=\"70\" width=\"205\" height=\"85\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"387.5\" y=\"119.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Kernel handles A</text></g><path d=\"M490 112 L555 112\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><text x=\"522.5\" y=\"103\" text-anchor=\"middle\" font-size=\"18\" font-family=\"Arial, sans-serif\" fill=\"#163745\">return</text><g data-node=\"a-resume\"><rect x=\"560\" y=\"70\" width=\"175\" height=\"85\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"647.5\" y=\"119.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">A: user mode</text></g><text x=\"25\" y=\"225\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">2. OS separately chooses a process switch</text><g data-node=\"a-before\"><rect x=\"25\" y=\"255\" width=\"180\" height=\"90\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"115\" y=\"307\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">A: user mode</text></g><path d=\"M205 300 L280 300\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><g data-node=\"schedule\"><rect x=\"285\" y=\"255\" width=\"205\" height=\"90\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"387.5\" y=\"294.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Kernel:</text><text x=\"387.5\" y=\"319.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">select B</text></g><path d=\"M490 300 L555 300\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><g data-node=\"b-user\"><rect x=\"560\" y=\"255\" width=\"175\" height=\"90\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"647.5\" y=\"307\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">B: user mode</text></g></svg>",
      "steps": [
        {
          "id": "os-07-mode-versus-process-step-1",
          "title": "Call from A",
          "detail": "A تطلب خدمة، فيدخل التنفيذ Kernel mode.",
          "focus": [
            "a-user",
            "a-kernel"
          ]
        },
        {
          "id": "os-07-mode-versus-process-step-2",
          "title": "Return to A",
          "detail": "الخدمة تخلص ونكمل A نفسها؛ Mode اتغيّر لكن Process ما اتبدّلتش.",
          "focus": [
            "a-kernel",
            "a-resume"
          ]
        },
        {
          "id": "os-07-mode-versus-process-step-3",
          "title": "A separate choice",
          "detail": "لو النظام اختار يكمل B، ده Process switch بالإضافة لانتقالات Mode المناسبة. مش نتيجة لازمة لكل System call.",
          "focus": [
            "a-before",
            "schedule",
            "b-user"
          ]
        }
      ]
    },
    {
      "id": "os-07-timer-countdown",
      "conceptId": "os-07-timer",
      "title": "Timer: independent return of control",
      "description": "Counter بسيط يوضّح ليه البرنامج مش هو اللي يقرّر يسلّم CPU إمتى.",
      "legend": "الأسهم ترتيب أحداث. القيم 3، 2، 1، 0 مثال تعليمي لوحدات Tick افتراضية؛ مش زمن حقيقي ولا إعداد جهاز. OS يضبط Counter قبل User execution؛ Clock هو اللي يقلّله في نموذج السلايد. Interrupt يرجّع التحكم ولا يفرض قرار إنهاء.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            25
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 400\" role=\"img\"><defs><marker id=\"arrow\" markerWidth=\"9\" markerHeight=\"9\" refX=\"8\" refY=\"4\" orient=\"auto\"><path d=\"M0 0 L8 4 L0 8 Z\" fill=\"#315e72\"/></marker></defs><rect width=\"760\" height=\"400\" fill=\"#f8fbfc\"/><g data-node=\"timer-set\"><rect x=\"25\" y=\"55\" width=\"250\" height=\"85\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"150\" y=\"92\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">OS sets timer</text><text x=\"150\" y=\"117\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Privileged operation</text></g><path d=\"M275 97 L330 97\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><g data-node=\"user-run\"><rect x=\"335\" y=\"55\" width=\"400\" height=\"85\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"535\" y=\"104.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">User process runs</text></g><g data-node=\"clock\"><rect x=\"25\" y=\"225\" width=\"180\" height=\"90\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"115\" y=\"277\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Clock ticks</text></g><path d=\"M205 270 L275 270\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><g data-node=\"counter\"><rect x=\"280\" y=\"225\" width=\"240\" height=\"90\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"400\" y=\"264.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Counter</text><text x=\"400\" y=\"289.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">3 → 2 → 1 → 0</text></g><path d=\"M520 270 L570 270\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><g data-node=\"timer-irq\"><rect x=\"575\" y=\"225\" width=\"160\" height=\"90\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"655\" y=\"264.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Interrupt</text><text x=\"655\" y=\"289.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">OS control</text></g></svg>",
      "steps": [
        {
          "id": "os-07-timer-countdown-step-1",
          "title": "Set before running",
          "detail": "OS يضبط Counter باستخدام صلاحية Kernel قبل تشغيل البرنامج.",
          "focus": [
            "timer-set",
            "user-run"
          ]
        },
        {
          "id": "os-07-timer-countdown-step-2",
          "title": "Clock advances",
          "detail": "Clock يقلّل Counter والبرنامج شغّال؛ مش مستني موافقة البرنامج.",
          "focus": [
            "clock",
            "counter",
            "user-run"
          ]
        },
        {
          "id": "os-07-timer-countdown-step-3",
          "title": "Regain control",
          "detail": "لما Counter يصل للصفر يطلع Interrupt؛ OS يرجعله القرار، ومش لازم ينهي البرنامج.",
          "focus": [
            "counter",
            "timer-irq"
          ]
        }
      ]
    }
  ]
};
  if (typeof module !== 'undefined' && module.exports) module.exports = lesson;
  if (root) root.OSPilotLesson = lesson;
})(typeof window !== 'undefined' ? window : null);
