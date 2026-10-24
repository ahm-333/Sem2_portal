(function(root){'use strict';const lesson={
  "id": "os-14",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "3",
  "title": "Process states, PCB and context switch",
  "subtitle": "مستني CPU ولا مستني ملف؟ وإزاي نكمل بعد التبديل؟",
  "sources": [
    {
      "id": "current-ch3",
      "title": "Chapter 3 · Processes",
      "driveId": "1h7se1OzceqGrKcmWtsOpb09WDBGuJT9s",
      "url": "https://drive.google.com/file/d/1h7se1OzceqGrKcmWtsOpb09WDBGuJT9s/view",
      "sha256": "7501cd4c2e06b1c09fedc2e7788d47df86786c263f68e0e268dc887c1b73444b",
      "slides": [
        7,
        8,
        9,
        10
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-14-states",
      "title": "Ready is different from waiting",
      "eyebrow": "01 · مستني إيه بالضبط؟",
      "summary": "Ready waits for a CPU; waiting waits for an event.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            7
          ]
        }
      ],
      "paragraphs": [
        "برنامج الحساب جاهز يكمل بس CPU مش متاح: دي Ready. برنامج طلب قراءة ملف ولسه البيانات مجتش: دي Waiting. الاتنين مش Running، لكن سبب الوقوف مختلف.",
        "New معناها العملية بيتجهّز إنشاؤها. Running معناها تعليماتها بتتنفّذ، وTerminated معناها خلصت. بعد اكتمال I/O، العملية ترجع Ready؛ بعدها Scheduler يختارها عشان تبقى Running.",
        "من Running ممكن ترجع Ready لما التنفيذ يتسحب منها، أو Waiting لما تحتاج I/O أو حدث، أو Terminated لما تخلص. الرسم بيشرح نموذج الحالات الخمس؛ مش كل Interrupt لازم يعمل نفس الانتقال."
      ]
    },
    {
      "id": "os-14-pcb",
      "title": "Process Control Block (PCB)",
      "eyebrow": "02 · دفتر حالة كل Process",
      "summary": "The OS keeps per-process information in a PCB.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            8
          ]
        }
      ],
      "paragraphs": [
        "لو CPU هيسيب Process ويروح لواحدة تانية، محتاج يرجع الأولى من نفس المكان. PCB بيحتفظ بمعلومات زي Process state وProgram counter وCPU registers.",
        "PCB فيه كمان CPU scheduling information زي الأولوية ومؤشرات الطوابير، وMemory-management information عن الذاكرة، وAccounting information زي CPU time، وI/O status زي الأجهزة والملفات المفتوحة.",
        "يعني PCB مش مجرد اسم للبرنامج أو نسخة من الكود؛ ده سجل معلومات النظام عن Process معيّنة."
      ]
    },
    {
      "id": "os-14-switch",
      "title": "Save A, restore B",
      "eyebrow": "03 · التبديل له شغل وتكلفة",
      "summary": "A process context switch saves one context and restores another.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            9,
            10
          ]
        }
      ],
      "paragraphs": [
        "في مثال CPU واحدة: Process A شغّالة، والنظام قرر يشغّل B. يحفظ حالة A في PCB بتاعتها، ويحمّل الحالة المحفوظة لـB، وبعدها B تكمل من Program counter بتاعها.",
        "وقت Save/restore هو Context-switch overhead: شغل إدارة لازم، لكن مش تنفيذ لشغل التطبيق نفسه. مدته بتعتمد على Hardware والتفاصيل اللي النظام بيحفظها؛ مفيش رقم ثابت في الدرس.",
        "توضيح مهم: دخول Kernel mode مش لوحده Context switch بين عمليتين. ممكن A تطلب خدمة وتدخل Kernel وبعدين ترجع A نفسها. التبديل بين Processes هنا معناه A تتوقف وB تتنفّذ."
      ]
    }
  ],
  "visualizations": [
    {
      "id": "os-14-state-graph",
      "conceptId": "os-14-states",
      "title": "Five-state process graph",
      "description": "اتبع السهم بشرطه. اكتمال الحدث يرجّع العملية جاهزة، مش شغّالة فورًا.",
      "legend": "كل صندوق حالة لنفس Process. الأسهم انتقالات مسموحة في النموذج الخماسي فقط؛ نفترض CPU واحدة. Interrupt/preemption المقصود في السهم هو اللي يعيد العملية إلى Ready، مش أي Interrupt.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            7
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 820 440\" role=\"img\" aria-label=\"Five-state process graph\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"8\" markerHeight=\"8\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#24516c\"/></marker></defs><rect width=\"820\" height=\"440\" fill=\"#ffffff\"/><g font-family=\"Arial, sans-serif\" fill=\"#17394e\"><g data-node=\"new\"><rect x=\"25\" y=\"45\" width=\"135\" height=\"50\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"92.5\" y=\"73\" text-anchor=\"middle\" font-size=\"20\">New</text></g><g data-node=\"ready\"><rect x=\"235\" y=\"160\" width=\"145\" height=\"55\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"307.5\" y=\"188\" text-anchor=\"middle\" font-size=\"20\">Ready</text></g><g data-node=\"running\"><rect x=\"520\" y=\"160\" width=\"145\" height=\"55\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"592.5\" y=\"188\" text-anchor=\"middle\" font-size=\"20\">Running</text></g><g data-node=\"terminated\"><rect x=\"645\" y=\"45\" width=\"165\" height=\"50\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"727.5\" y=\"73\" text-anchor=\"middle\" font-size=\"20\">Terminated</text></g><g data-node=\"waiting\"><rect x=\"365\" y=\"340\" width=\"165\" height=\"55\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"447.5\" y=\"368\" text-anchor=\"middle\" font-size=\"20\">Waiting</text></g><g data-node=\"admit\"><path d=\"M160 72 L305 72 L305 160\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"225\" y=\"57\" text-anchor=\"middle\" font-size=\"18\">admitted</text></g><g data-node=\"dispatch\"><path d=\"M380 180 L520 180\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"450\" y=\"163\" text-anchor=\"middle\" font-size=\"18\">dispatch</text></g><g data-node=\"preempt\"><path d=\"M590 160 L590 112 L305 112 L305 160\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"455\" y=\"100\" text-anchor=\"middle\" font-size=\"18\">interrupt / preempt</text></g><g data-node=\"io-wait\"><path d=\"M590 215 L590 300 L490 340\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"670\" y=\"275\" text-anchor=\"middle\" font-size=\"18\">I/O or event wait</text></g><g data-node=\"io-done\"><path d=\"M365 365 L305 365 L305 215\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"186\" y=\"300\" text-anchor=\"middle\" font-size=\"18\">I/O / event done</text></g><g data-node=\"exit\"><path d=\"M665 187 L730 187 L730 95\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"760\" y=\"145\" text-anchor=\"middle\" font-size=\"18\">exit</text></g></g></svg>",
      "steps": [
        {
          "id": "os-14-state-graph-step-1",
          "title": "Ready to running",
          "detail": "جاهزة للتنفيذ؛ Scheduler يختارها وياخدها للـCPU.",
          "focus": [
            "ready",
            "dispatch",
            "running"
          ]
        },
        {
          "id": "os-14-state-graph-step-2",
          "title": "Wait for an event",
          "detail": "لما تطلب I/O وتحتاج نتيجته، تخرج من Running إلى Waiting.",
          "focus": [
            "running",
            "io-wait",
            "waiting"
          ]
        },
        {
          "id": "os-14-state-graph-step-3",
          "title": "Event done, then wait for CPU",
          "detail": "البيانات وصلت؛ ترجع Ready. لسه محتاجة Dispatch عشان تتنفّذ.",
          "focus": [
            "waiting",
            "io-done",
            "ready"
          ]
        },
        {
          "id": "os-14-state-graph-step-4",
          "title": "Finish or lose the CPU",
          "detail": "لو خلصت تروح Terminated؛ لو اتسحب CPU وهي جاهزة تكمل، ترجع Ready.",
          "focus": [
            "preempt",
            "exit",
            "terminated"
          ]
        }
      ]
    },
    {
      "id": "os-14-save-restore",
      "conceptId": "os-14-switch",
      "title": "One CPU: process A to process B",
      "description": "الخطوات بترتّب شغل CPU واحدة؛ مفيش قياس زمني في عرض الصناديق.",
      "legend": "المراحل من الشمال لليمين بتوضح تسلسل التنفيذ؛ الأسهم الأفقية نقل تنفيذ أو تحكم. الأسهم الرأسية Save/Load بتنقل معلومات الحالة من وإلى PCB، مش بتشغّل الـPCB. الحفظ والاستعادة شغل Kernel؛ عرض المراحل متساوي للتوضيح ومش قياس زمني.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            8,
            9,
            10
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 820 440\" role=\"img\" aria-label=\"One CPU: process A to process B\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"8\" markerHeight=\"8\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#24516c\"/></marker></defs><rect width=\"820\" height=\"440\" fill=\"#ffffff\"/><g font-family=\"Arial, sans-serif\" fill=\"#17394e\"><g data-node=\"a-run\"><rect x=\"20\" y=\"65\" width=\"170\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"105\" y=\"93\" text-anchor=\"middle\" font-size=\"20\">A running</text><text x=\"105\" y=\"119\" text-anchor=\"middle\" font-size=\"20\">CPU executes A</text></g><g data-node=\"save\"><rect x=\"220\" y=\"65\" width=\"170\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"305\" y=\"93\" text-anchor=\"middle\" font-size=\"20\">Kernel: save A</text><text x=\"305\" y=\"119\" text-anchor=\"middle\" font-size=\"20\">PC + registers</text></g><g data-node=\"restore\"><rect x=\"420\" y=\"65\" width=\"170\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"505\" y=\"93\" text-anchor=\"middle\" font-size=\"20\">Kernel: restore B</text><text x=\"505\" y=\"119\" text-anchor=\"middle\" font-size=\"20\">Saved context</text></g><g data-node=\"b-run\"><rect x=\"620\" y=\"65\" width=\"180\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"710\" y=\"93\" text-anchor=\"middle\" font-size=\"20\">B running</text><text x=\"710\" y=\"119\" text-anchor=\"middle\" font-size=\"20\">CPU executes B</text></g><g data-node=\"a-save\"><path d=\"M190 100 L220 100\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g><g data-node=\"save-restore\"><path d=\"M390 100 L420 100\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g><g data-node=\"restore-b\"><path d=\"M590 100 L620 100\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g><g data-node=\"pcb-a\"><rect x=\"220\" y=\"220\" width=\"170\" height=\"60\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"305\" y=\"248\" text-anchor=\"middle\" font-size=\"20\">PCB A</text><text x=\"305\" y=\"274\" text-anchor=\"middle\" font-size=\"20\">Saved A context</text></g><g data-node=\"pcb-b\"><rect x=\"420\" y=\"220\" width=\"170\" height=\"60\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"505\" y=\"248\" text-anchor=\"middle\" font-size=\"20\">PCB B</text><text x=\"505\" y=\"274\" text-anchor=\"middle\" font-size=\"20\">Saved B context</text></g><g data-node=\"save-data\"><path d=\"M305 135 L305 220\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"347\" y=\"187\" text-anchor=\"middle\" font-size=\"18\">save</text></g><g data-node=\"load-data\"><path d=\"M505 220 L505 135\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"550\" y=\"187\" text-anchor=\"middle\" font-size=\"18\">load</text></g><text x=\"410\" y=\"330\" text-anchor=\"middle\" font-size=\"20\">Contrast: A user → A kernel → A user</text><text x=\"410\" y=\"366\" text-anchor=\"middle\" font-size=\"20\">Mode change alone does not imply A → B</text></g></svg>",
      "steps": [
        {
          "id": "os-14-save-restore-step-1",
          "title": "Save the outgoing process",
          "detail": "النظام يحفظ اللي يحتاجه عشان A تعرف تكمل بعدين، في PCB A.",
          "focus": [
            "a-run",
            "save",
            "pcb-a",
            "save-data"
          ]
        },
        {
          "id": "os-14-save-restore-step-2",
          "title": "Restore the incoming process",
          "detail": "يحمّل حالة B المحفوظة من PCB B. دي عملية تانية، مش تغيير اسم A.",
          "focus": [
            "pcb-b",
            "load-data",
            "restore"
          ]
        },
        {
          "id": "os-14-save-restore-step-3",
          "title": "Continue B",
          "detail": "بعد Restore، CPU ينفّذ B. خطوات الإدارة نفسها Overhead بالنسبة لشغل التطبيق.",
          "focus": [
            "restore-b",
            "b-run"
          ]
        },
        {
          "id": "os-14-save-restore-step-4",
          "title": "Compare a mode change",
          "detail": "A تدخل Kernel وترجع A: ده Mode transition، ومش كفاية نسميه تبديل بين عمليتين.",
          "focus": [
            "a-run"
          ]
        }
      ]
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-14-io-complete",
      "type": "mcq",
      "placement": "os-14-states",
      "objective": "A waiting process finishes its I/O. In the five-state graph, what is its next state?",
      "prerequisites": [
        "os-14-states"
      ],
      "prompt": "A waiting process finishes its I/O. In the five-state graph, what is its next state?",
      "options": [
        {
          "id": "os-14-io-complete-o1",
          "text": "Running immediately"
        },
        {
          "id": "os-14-io-complete-o2",
          "text": "Ready"
        },
        {
          "id": "os-14-io-complete-o3",
          "text": "New"
        }
      ],
      "correctOptionId": "os-14-io-complete-o2",
      "feedback": {
        "os-14-io-complete-o1": "اكتمال I/O بيخليها جاهزة. لازم Scheduler يديها CPU قبل Running.",
        "os-14-io-complete-o2": "صح؛ الحدث خلص فترجع Ready، وبعد Dispatch ممكن تبقى Running.",
        "os-14-io-complete-o3": "New خاصة بالإنشاء. الـProcess هنا كانت موجودة ومستنية I/O."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
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
      "id": "os-14-resume-record",
      "type": "mcq",
      "placement": "os-14-pcb",
      "objective": "Which PCB information helps resume at the correct instruction?",
      "prerequisites": [
        "os-14-pcb"
      ],
      "prompt": "Which PCB information helps resume at the correct instruction?",
      "options": [
        {
          "id": "os-14-resume-record-o1",
          "text": "Program counter and CPU registers"
        },
        {
          "id": "os-14-resume-record-o2",
          "text": "Only the executable filename"
        },
        {
          "id": "os-14-resume-record-o3",
          "text": "Only the number of open files"
        }
      ],
      "correctOptionId": "os-14-resume-record-o1",
      "feedback": {
        "os-14-resume-record-o1": "صح؛ مكان التعليمة والقيم المحفوظة يساعدوا في استكمال التنفيذ.",
        "os-14-resume-record-o2": "اسم الملف مش كفاية تعرف وصلت لأنهي تعليمة أو قيم Registers.",
        "os-14-resume-record-o3": "الملفات المفتوحة مهمة ضمن I/O status، لكنها مش بديل لحالة CPU."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
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
      "id": "os-14-mode-is-switch",
      "type": "true-false",
      "placement": "os-14-switch",
      "objective": "Every return from kernel mode must resume a different process.",
      "prerequisites": [
        "os-14-switch"
      ],
      "prompt": "Every return from kernel mode must resume a different process.",
      "options": [
        {
          "id": "os-14-mode-is-switch-o1",
          "text": "True · صح"
        },
        {
          "id": "os-14-mode-is-switch-o2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-14-mode-is-switch-o2",
      "feedback": {
        "os-14-mode-is-switch-o1": "الدخول والخروج من Kernel مش دليل لوحده على تغيير Process؛ ممكن A نفسها تكمل.",
        "os-14-mode-is-switch-o2": "غلط؛ ممكن نفس A تدخل Kernel وتكمل. Context switch بين Processes يحتاج تبديل من A إلى B."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            9,
            10
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-14-overhead",
      "type": "mcq",
      "placement": "os-14-switch",
      "objective": "During save/restore for a process switch, what is the CPU doing?",
      "prerequisites": [
        "os-14-switch"
      ],
      "prompt": "During save/restore for a process switch, what is the CPU doing?",
      "options": [
        {
          "id": "os-14-overhead-o1",
          "text": "Application work for both processes at once"
        },
        {
          "id": "os-14-overhead-o2",
          "text": "Necessary OS work rather than the processes’ application work"
        },
        {
          "id": "os-14-overhead-o3",
          "text": "Nothing at all"
        }
      ],
      "correctOptionId": "os-14-overhead-o2",
      "feedback": {
        "os-14-overhead-o1": "في المثال CPU واحدة؛ Save/restore إدارة سياق، مش شغل التطبيقين بالتوازي.",
        "os-14-overhead-o2": "صح؛ ده شغل OS لازم، لكن محسوب Overhead بالنسبة لتقدم شغل التطبيقات.",
        "os-14-overhead-o3": "CPU مش واقف؛ بينفّذ شغل الحفظ والاسترجاع، حتى لو التطبيقات مش بتتقدم."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            10
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
      "id": "os-14-term-ready",
      "term": "Ready",
      "translation": "جاهز للمعالج",
      "definition": "A process state waiting to be assigned a processor.",
      "explanation": "قادر يكمل لكن دوره على CPU لسه مجاش.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            7
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-14-term-waiting",
      "term": "Waiting",
      "translation": "انتظار حدث",
      "definition": "A process state waiting for an event such as I/O completion.",
      "explanation": "مش مستني دوره بس؛ محتاج حدث يحصل قبل ما يقدر يكمل.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            7
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-14-term-running",
      "term": "Running",
      "translation": "قيد التنفيذ",
      "definition": "A process state in which instructions are being executed.",
      "explanation": "CPU بينفّذ تعليمات الـProcess حاليًا.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            7
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-14-term-new",
      "term": "New",
      "translation": "قيد الإنشاء",
      "definition": "The state of a process being created.",
      "explanation": "النظام بيجهّز Process جديدة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            7
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-14-term-terminated",
      "term": "Terminated",
      "translation": "انتهى التنفيذ",
      "definition": "The state of a process that has finished execution.",
      "explanation": "العملية خلصت، مش مجرد مستنية CPU.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            7
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-14-term-pcb",
      "term": "PCB",
      "translation": "سجل التحكم في العملية",
      "definition": "The OS record of information associated with a process.",
      "explanation": "فيه حالتها ومعلومات CPU والذاكرة وI/O وغيرها.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            8
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-14-term-context-switch",
      "term": "Context switch",
      "translation": "تبديل سياق التنفيذ",
      "definition": "Saving the old process state and loading another process state.",
      "explanation": "نحفظ A ونرجع حالة B عشان B تكمل.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            9,
            10
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-14-term-overhead",
      "term": "Overhead",
      "translation": "تكلفة الإدارة",
      "definition": "Work required for management rather than application progress.",
      "explanation": "وقت لازم لإدارة التبديل، لكن مش بيكمّل حسابات البرنامج نفسه.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            10
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-14-term-program-counter",
      "term": "Program counter",
      "translation": "مؤشر التعليمة",
      "definition": "The location of the next instruction to execute.",
      "explanation": "السجل ده يساعد النظام يعرف يكمل منين.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            8
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-14-term-mode-transition",
      "term": "Mode transition",
      "translation": "انتقال وضع التنفيذ",
      "definition": "A change between user and kernel execution modes.",
      "explanation": "نفس Process ممكن تطلب خدمة وترجع تكمل؛ مش شرط تبديل Process.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            9,
            10
          ]
        }
      ],
      "kind": "prerequisite"
    }
  ]
};if(typeof module==='object'&&module.exports)module.exports=lesson;else root.OSPilotLesson=lesson;})(typeof window!=='undefined'?window:globalThis);
