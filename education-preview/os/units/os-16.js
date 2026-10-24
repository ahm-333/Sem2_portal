(function(root){'use strict';const lesson={
  "id": "os-16",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "3",
  "title": "Scheduling queues and scheduler roles",
  "subtitle": "مين جاهز؟ مين مستني جهاز؟ ومين بياخد قرار مختلف؟",
  "sources": [
    {
      "id": "current-ch3",
      "title": "Chapter 3 · Processes",
      "driveId": "1h7se1OzceqGrKcmWtsOpb09WDBGuJT9s",
      "url": "https://drive.google.com/file/d/1h7se1OzceqGrKcmWtsOpb09WDBGuJT9s/view",
      "sha256": "7501cd4c2e06b1c09fedc2e7788d47df86786c263f68e0e268dc887c1b73444b",
      "slides": [
        13,
        14,
        15,
        16
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-16-queues",
      "title": "Follow the reason for queueing",
      "eyebrow": "01 · الطابور مش حالة واحدة",
      "summary": "Queues group processes by what they are waiting for.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            13,
            14
          ]
        }
      ],
      "paragraphs": [
        "في النموذج ده Job queue بتجمع كل العمليات في النظام. Ready queue للعمليات الموجودة في Main memory والجاهزة تاخد CPU. Device queue للي مستني I/O device معيّن.",
        "Scheduler بيختار من الجاهزين مين يتنفّذ بعد كده. Process شغّالة تطلب I/O فتدخل طابور الجهاز، وبعد اكتماله ترجع Ready. لو Time slice خلصت وهي لسه جاهزة تكمل، ترجع Ready مباشرة.",
        "رسم سلايد 14 فيه كمان انتظار حدث زي Interrupt أو انتظار Child. رجوع العملية مرتبط بانتهاء سبب الانتظار. إنشاء Child لوحده مش معناه إن Parent لازم يقف؛ مسار الرسم ده يوضّح حالة Parent اختار يستنى Child."
      ]
    },
    {
      "id": "os-16-schedulers",
      "title": "Three different scheduling decisions",
      "eyebrow": "02 · مش كل اختيار اسمه نفس الدور",
      "summary": "CPU selection, admission and swapping are different roles.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            15
          ]
        }
      ],
      "paragraphs": [
        "Short-term scheduler أو CPU scheduler يختار العملية الجاهزة اللي هتاخد CPU بعد كده. القرار ده متكرر، فلازم يبقى سريع.",
        "Long-term scheduler يختار عمليات تدخل Ready queue، وبيتحكم في Degree of multiprogramming: عدد العمليات الموجودة في الذاكرة ضمن النموذج. استدعاؤه أقل تكرارًا من Short-term؛ مش كل نظام فيه نفس الأدوار المنفصلة.",
        "Medium-term scheduler ممكن يتضاف لتقليل العدد في الذاكرة: يخرج Process للديسك مؤقتًا، وبعدين يرجعها تكمل. ده Swapping، ومش معناه إن العملية انتهت.",
        "السلايد يدي milliseconds مقابل seconds/minutes لتوضيح فرق التكرار. دي أمثلة شرح للدور، مش قياسات لجهازك أو ضمانات زمنية."
      ]
    },
    {
      "id": "os-16-bound",
      "title": "CPU-bound versus I/O-bound",
      "eyebrow": "03 · وقته رايح في إيه؟",
      "summary": "CPU bursts alternate with I/O waits; a scheduling pause need not finish a burst.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            16
          ]
        }
      ],
      "paragraphs": [
        "CPU burst هي مرحلة حساب قبل ما العملية تحتاج تستنى I/O؛ انتهاء Time slice ممكن يوقّف تنفيذها مؤقتًا من غير ما مرحلة الحساب نفسها تكون خلصت. برنامج الحسابات الكتير غالبًا CPU-bound: عنده مراحل CPU طويلة نسبيًا.",
        "I/O-bound بيقضي وقت أكتر في I/O من الحساب، وعنده CPU bursts قصيرة كتير. مثلًا يحسب شوية وبعدين يستنى بيانات. التصنيف عن نمط الشغل، مش إن I/O-bound مش بيستخدم CPU خالص."
      ]
    }
  ],
  "visualizations": [
    {
      "id": "os-16-queue-paths",
      "conceptId": "os-16-queues",
      "title": "Queue paths on one CPU",
      "description": "الأسهم مسارات ممكنة لنفس Process؛ اختار سبب ترك CPU وشوف هترجع إزاي.",
      "legend": "Ready queue جاهزة للتنفيذ، وDevice queue انتظار I/O، وCPU المورد اللي بينفّذ. الأسهم انتقال Process لا ترتيب أولويات. نفترض CPU واحدة وجهاز واحد للتوضيح؛ Time slice هنا مثال Time sharing بلا خوارزمية اختيار.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            13,
            14
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 820 440\" role=\"img\" aria-label=\"Queue paths on one CPU\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"8\" markerHeight=\"8\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#24516c\"/></marker></defs><rect width=\"820\" height=\"440\" fill=\"#ffffff\"/><g font-family=\"Arial, sans-serif\" fill=\"#17394e\"><g data-node=\"ready\"><rect x=\"35\" y=\"90\" width=\"230\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"150\" y=\"118\" text-anchor=\"middle\" font-size=\"20\">Ready queue</text><text x=\"150\" y=\"144\" text-anchor=\"middle\" font-size=\"20\">A · B · C (example)</text></g><g data-node=\"cpu\"><rect x=\"530\" y=\"90\" width=\"200\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"630\" y=\"118\" text-anchor=\"middle\" font-size=\"20\">CPU</text><text x=\"630\" y=\"144\" text-anchor=\"middle\" font-size=\"20\">One running process</text></g><g data-node=\"device-queue\"><rect x=\"450\" y=\"290\" width=\"320\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"610\" y=\"318\" text-anchor=\"middle\" font-size=\"20\">Device queue → I/O device</text><text x=\"610\" y=\"344\" text-anchor=\"middle\" font-size=\"20\">Wait for I/O completion</text></g><g data-node=\"dispatch\"><path d=\"M265 125 L530 125\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"395\" y=\"105\" text-anchor=\"middle\" font-size=\"18\">CPU scheduler selects</text></g><g data-node=\"io-request\"><path d=\"M630 160 L630 290\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"700\" y=\"235\" text-anchor=\"middle\" font-size=\"18\">I/O request</text></g><g data-node=\"io-complete\"><path d=\"M450 325 L150 325 L150 160\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"290\" y=\"305\" text-anchor=\"middle\" font-size=\"18\">I/O complete</text></g><g data-node=\"time-slice\"><path d=\"M730 125 L790 125 L790 45 L150 45 L150 90\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"450\" y=\"30\" text-anchor=\"middle\" font-size=\"18\">Time slice expires → ready again</text></g></g></svg>",
      "steps": [
        {
          "id": "os-16-queue-paths-step-1",
          "title": "Select from ready",
          "detail": "لو جاهزة ومستنية CPU، مكانها Ready queue. Scheduler يختار واحدة للتنفيذ.",
          "focus": [
            "ready",
            "dispatch",
            "cpu"
          ]
        },
        {
          "id": "os-16-queue-paths-step-2",
          "title": "Wait for a device",
          "detail": "طلب I/O يخرج العملية لمسار انتظار الجهاز. Ready مختلفة عن انتظار I/O.",
          "focus": [
            "cpu",
            "io-request",
            "device-queue"
          ]
        },
        {
          "id": "os-16-queue-paths-step-3",
          "title": "Come back ready",
          "detail": "بعد اكتمال I/O، ترجع Ready؛ مش بتقفز مباشرة للتنفيذ.",
          "focus": [
            "device-queue",
            "io-complete",
            "ready"
          ]
        },
        {
          "id": "os-16-queue-paths-step-4",
          "title": "Still ready, but time is up",
          "detail": "انتهاء Time slice يرجّعها Ready لو لسه قادرة تكمل، من غير شرط I/O.",
          "focus": [
            "cpu",
            "time-slice",
            "ready"
          ]
        }
      ]
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-16-which-queue",
      "type": "mcq",
      "placement": "os-16-queues",
      "objective": "A process cannot proceed until its disk I/O completes. Which queue fits this reason for waiting?",
      "prerequisites": [
        "os-16-queues"
      ],
      "prompt": "A process cannot proceed until its disk I/O completes. Which queue fits this reason for waiting?",
      "options": [
        {
          "id": "os-16-which-queue-o1",
          "text": "Ready queue"
        },
        {
          "id": "os-16-which-queue-o2",
          "text": "Device queue"
        },
        {
          "id": "os-16-which-queue-o3",
          "text": "The CPU itself"
        }
      ],
      "correctOptionId": "os-16-which-queue-o2",
      "feedback": {
        "os-16-which-queue-o1": "Ready معناها قادرة تكمل لكن مستنية CPU؛ هنا البيانات لسه ماوصلتش.",
        "os-16-which-queue-o2": "صح؛ سبب الانتظار I/O device، فمكانها Device queue في النموذج.",
        "os-16-which-queue-o3": "CPU بينفّذ تعليمات؛ العملية دي مستنية الجهاز، مش بتتنفّذ."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            13,
            14
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-16-cpu-selection",
      "type": "mcq",
      "placement": "os-16-schedulers",
      "objective": "Which scheduler makes the frequent decision about the next ready process to execute?",
      "prerequisites": [
        "os-16-schedulers"
      ],
      "prompt": "Which scheduler makes the frequent decision about the next ready process to execute?",
      "options": [
        {
          "id": "os-16-cpu-selection-o1",
          "text": "Long-term scheduler"
        },
        {
          "id": "os-16-cpu-selection-o2",
          "text": "Medium-term scheduler"
        },
        {
          "id": "os-16-cpu-selection-o3",
          "text": "Short-term scheduler"
        }
      ],
      "correctOptionId": "os-16-cpu-selection-o3",
      "feedback": {
        "os-16-cpu-selection-o1": "Long-term دوره إدخال العمليات للـReady queue، مش كل قرار CPU التالي.",
        "os-16-cpu-selection-o2": "Medium-term مرتبط بإخراج الذاكرة وإرجاعها في Swapping.",
        "os-16-cpu-selection-o3": "صح؛ Short-term أو CPU scheduler بيختار من الجاهزين، وقراره متكرر فلازم سريع."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            15
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-16-swap-exit",
      "type": "true-false",
      "placement": "os-16-schedulers",
      "objective": "Swapping a process out of memory means that the process has terminated.",
      "prerequisites": [
        "os-16-schedulers"
      ],
      "prompt": "Swapping a process out of memory means that the process has terminated.",
      "options": [
        {
          "id": "os-16-swap-exit-o1",
          "text": "True · صح"
        },
        {
          "id": "os-16-swap-exit-o2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-16-swap-exit-o2",
      "feedback": {
        "os-16-swap-exit-o1": "العملية ممكن ترجع من الديسك وتكمل؛ Termination معناها انتهى التنفيذ، ودي حاجة تانية.",
        "os-16-swap-exit-o2": "غلط؛ Swapping إخراج مؤقت للديسك مع إمكانية الرجوع واستكمال التنفيذ."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            15
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-16-bound-pattern",
      "type": "mcq",
      "placement": "os-16-bound",
      "objective": "Which pattern best matches an I/O-bound process in this model?",
      "prerequisites": [
        "os-16-bound"
      ],
      "prompt": "Which pattern best matches an I/O-bound process in this model?",
      "options": [
        {
          "id": "os-16-bound-pattern-o1",
          "text": "Many short CPU bursts separated by I/O"
        },
        {
          "id": "os-16-bound-pattern-o2",
          "text": "No CPU use at all"
        },
        {
          "id": "os-16-bound-pattern-o3",
          "text": "Few very long computation bursts"
        }
      ],
      "correctOptionId": "os-16-bound-pattern-o1",
      "feedback": {
        "os-16-bound-pattern-o1": "صح؛ I/O بياخد وقت أكبر، وبتحتاج CPU لفترات قصيرة متكررة.",
        "os-16-bound-pattern-o2": "I/O-bound لسه محتاجة CPU. الاسم عن أغلب الوقت، مش إلغاء الحساب.",
        "os-16-bound-pattern-o3": "ده أقرب لوصف CPU-bound: حسابات أكتر وفترات CPU طويلة نسبيًا."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            16
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-16-fork-always-waits",
      "type": "true-false",
      "placement": "os-16-queues",
      "objective": "Creating a child always forces the parent to wait for that child.",
      "prerequisites": [
        "os-16-queues"
      ],
      "prompt": "Creating a child always forces the parent to wait for that child.",
      "options": [
        {
          "id": "os-16-fork-always-waits-o1",
          "text": "True · صح"
        },
        {
          "id": "os-16-fork-always-waits-o2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-16-fork-always-waits-o2",
      "feedback": {
        "os-16-fork-always-waits-o1": "السهم بيوضح Parent مستني Child في المثال؛ الإنشاء لوحده مش شرط توقف Parent.",
        "os-16-fork-always-waits-o2": "غلط؛ مسار الانتظار في الرسم حالة ممكنة. Parent ممكن يكمل بالتزامن أو يختار الانتظار."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            14
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
      "id": "os-16-term-scheduler",
      "term": "Scheduler",
      "translation": "منظّم اختيار التنفيذ",
      "definition": "A component that selects processes for execution or admission.",
      "explanation": "لازم تسأل أنهي دور: اختيار CPU ولا إدخال للذاكرة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            13,
            15
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-16-term-job-queue",
      "term": "Job queue",
      "translation": "طابور كل العمليات",
      "definition": "The set of all processes in the system in the slide model.",
      "explanation": "النموذج بيجمع فيه العمليات عمومًا، مش الجاهزة بس.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            13
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-16-term-ready-queue",
      "term": "Ready queue",
      "translation": "طابور الجاهزين",
      "definition": "Processes in main memory that are ready and waiting to execute.",
      "explanation": "قادرين يكملوا ومستنيين دور CPU.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            13
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-16-term-device-queue",
      "term": "Device queue",
      "translation": "طابور جهاز",
      "definition": "Processes waiting for an I/O device.",
      "explanation": "مستنيين جهاز يخلّص سبب انتظارهم.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            13
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-16-term-short-term-scheduler",
      "term": "Short-term scheduler",
      "translation": "منظّم المعالج",
      "definition": "The scheduler selecting the next process to execute on the CPU.",
      "explanation": "اختيار متكرر من الجاهزين، فلازم سريع.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            15
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-16-term-long-term-scheduler",
      "term": "Long-term scheduler",
      "translation": "منظّم الإدخال",
      "definition": "The scheduler selecting processes to bring into the ready queue.",
      "explanation": "بيتحكم في عدد العمليات المدخلة للنظام في النموذج.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            15
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-16-term-medium-term-scheduler",
      "term": "Medium-term scheduler",
      "translation": "منظّم الإخراج المؤقت",
      "definition": "An optional scheduler that swaps processes out and later back in.",
      "explanation": "يخفف عدد العمليات في الذاكرة مؤقتًا؛ مش بيعتبرها انتهت.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            15
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-16-term-degree-of-multiprogramming",
      "term": "Degree of multiprogramming",
      "translation": "عدد العمليات في الذاكرة",
      "definition": "The number of processes in memory in this scheduling model.",
      "explanation": "ده العدد اللي Long-term بيتحكم فيه بالنموذج.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            15
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-16-term-swapping",
      "term": "Swapping",
      "translation": "إخراج وإرجاع مؤقت",
      "definition": "Moving a process out to disk and later back to memory to continue.",
      "explanation": "Process تخرج مؤقتًا، وبعد الرجوع تكمل التنفيذ.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            15
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-16-term-cpu-burst",
      "term": "CPU burst",
      "translation": "فترة استخدام المعالج",
      "definition": "A phase of CPU computation between I/O waits; preemption can pause an unfinished burst.",
      "explanation": "مرحلة حساب بين فترات انتظار I/O. ممكن تتقسم على أكتر من مرة تشغيل لو الجدولة وقّفت العملية مؤقتًا.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            16
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-16-term-i-o-bound",
      "term": "I/O-bound",
      "translation": "شغله أغلبه إدخال وإخراج",
      "definition": "A process spending more time on I/O, with many short CPU bursts.",
      "explanation": "بيحسب شوية كتير، وبينهم احتياج أو انتظار I/O.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            16
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-16-term-cpu-bound",
      "term": "CPU-bound",
      "translation": "شغله أغلبه حسابات",
      "definition": "A process spending more time computing, with relatively long CPU bursts.",
      "explanation": "الحسابات واخدة أغلب وقته، مقارنة بانتظار I/O.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            16
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-16-term-time-slice",
      "term": "Time slice",
      "translation": "فترة دور المعالج",
      "definition": "A limited turn of CPU time in a time-sharing example.",
      "explanation": "لو الدور خلص وهي لسه جاهزة، ترجع Ready؛ مش مدة ثابتة في الدرس.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            14
          ]
        }
      ],
      "kind": "prerequisite"
    }
  ]
};if(typeof module==='object'&&module.exports)module.exports=lesson;else root.OSPilotLesson=lesson;})(typeof window!=='undefined'?window:globalThis);
