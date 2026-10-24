(function(root) {
  'use strict';
  const lesson = {
  "id": "os-06",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "1",
  "title": "Multiprogramming and time sharing",
  "subtitle": "CPU مش لازم يفضل مستني برنامج واقف على I/O.",
  "sources": [
    {
      "id": "current-ch1",
      "title": "Chapter 1 · Introduction",
      "driveId": "14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M",
      "url": "https://drive.google.com/file/d/14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M/view",
      "sha256": "c81ae8d50d261ffbd4c78ebf75b42f3f980c50298bba19b32f5779b3d1745e7b",
      "slides": [
        22,
        23
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-06-multiprogramming",
      "title": "Run another job while one waits",
      "eyebrow": "01 · نفهمها بمثال",
      "summary": "Multiprogramming keeps several jobs available so the CPU can work when one job waits.",
      "paragraphs": [
        "برنامج A طلب قراءة بيانات وبقى مستني <bdi lang=\"en\">I/O</bdi>. لو مفيش غيره، CPU ممكن يقعد من غير شغل. مع <bdi lang=\"en\">Multiprogramming</bdi>، فيه Jobs تانية جاهزة؛ الـOS يختار واحدة وينفّذها بدل ما يستنى A.",
        "الـ<bdi lang=\"en\">Job</bdi> هنا شغل له Code وData. مجموعة من Jobs النظام بتبقى في Memory، مش لازم كل الشغل الموجود. الـ<bdi lang=\"en\">Job scheduling</bdi> يختار Job للتشغيل في شرح السلايد؛ ولو كذا برنامج جاهز للـCPU، نحتاج <bdi lang=\"en\">CPU scheduling</bdi> للاختيار بينهم.",
        "سلايد 23 بيرسم OS وJobs 1–4 في Main memory. وجودهم في Memory مش معناه إن Single CPU بينفّذهم كلهم في نفس اللحظة. الهدف تقليل الخمول؛ كلمة “always” في السلايد مش ضمان إن CPU عمره ما يبقى Idle لو مفيش شغل جاهز."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22,
            23
          ]
        }
      ]
    },
    {
      "id": "os-06-timesharing",
      "title": "Frequent switching supports interaction",
      "eyebrow": "02 · نفهمها بمثال",
      "summary": "Time sharing extends multiprogramming with frequent CPU switching for interactive use.",
      "paragraphs": [
        "إنت بتكتب في برنامج، وحد تاني بيستخدم برنامج تاني. <bdi lang=\"en\">Time sharing / multitasking</bdi> يخلي CPU يبدّل بسرعة بين الشغل بحيث كل مستخدم يقدر يتفاعل مع برنامجه. مش لازم نستنى كل Job تخلص بالكامل.",
        "الـ<bdi lang=\"en\">Response time</bdi> هو وقت انتظار أول استجابة بعد الطلب، مش وقت انتهاء الشغل كله. السلايد بيذكر أقل من ثانية كهدف تفاعلي في شرحه؛ مش وعد بزمن كل عملية على كل جهاز.",
        "الـ<bdi lang=\"en\">Process</bdi> برنامج أثناء التنفيذ. في نظام بــCPU واحدة، التبديل السريع بين Processes يدي تفاعل وتداخل في التقدّم؛ ده مش تنفيذ تعليمات مستخدمين في نفس اللحظة على نفس Core."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22
          ]
        }
      ]
    },
    {
      "id": "os-06-memory-fit",
      "title": "Not every process must fit in memory all at once",
      "eyebrow": "03 · نفهمها بمثال",
      "summary": "Swapping moves processes in and out; virtual memory allows execution without complete residency.",
      "paragraphs": [
        "لو Processes مش كلها سايعة في Memory، السلايد بيقدّم فكرتين: <bdi lang=\"en\">Swapping</bdi> ينقل Processes لبرّه Memory ويرجّعها علشان تشتغل، و<bdi lang=\"en\">Virtual memory</bdi> يسمح بتشغيل Process مش موجودة بالكامل في Main memory.",
        "ده تمهيد للفكرة بس: مش معنى Virtual memory إن مفيش تعليمات أو بيانات محتاجة تكون في Memory وقت استخدامها. ومش معنى الرسم إن كل جهاز لازم يقسّم Memory لأربع Jobs متساوية."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22,
            23
          ]
        }
      ],
      "clarification": "مقاس 512M في رسم المصدر مثال قديم لتخطيط Memory، مش سعة مطلوبة ولا وصف لجهازك. هنا بنستخدم رسم نوعي من غير سعة مفروضة."
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-06-waiting-job",
      "type": "mcq",
      "placement": "os-06-multiprogramming",
      "objective": "Apply multiprogramming to an I/O wait.",
      "prerequisites": [
        "os-06-multiprogramming"
      ],
      "prompt": "On one CPU, A waits for I/O and B is ready in memory. Which action supports multiprogramming’s efficiency goal?",
      "options": [
        {
          "id": "os-06-waiting-job-1",
          "text": "Run B while A waits"
        },
        {
          "id": "os-06-waiting-job-2",
          "text": "Require the CPU to remain idle until A finishes I/O"
        },
        {
          "id": "os-06-waiting-job-3",
          "text": "Execute A’s and B’s instructions simultaneously on that one CPU"
        }
      ],
      "correctOptionId": "os-06-waiting-job-1",
      "feedback": {
        "os-06-waiting-job-1": "صح؛ نستغل CPU في Job جاهزة بدل ما يفضل مستني I/O الخاص بـA.",
        "os-06-waiting-job-2": "ده يهدر فرصة شغل جاهز؛ هو العكس من الهدف في المثال.",
        "os-06-waiting-job-3": "في المثال CPU واحدة؛ بنبدّل بين Jobs، مش بنفترض تنفيذ تعليمتين مستخدم في نفس اللحظة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22,
            23
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-06-all-memory-running",
      "type": "true-false",
      "placement": "os-06-multiprogramming",
      "objective": "Distinguish residency from simultaneous execution.",
      "prerequisites": [
        "os-06-multiprogramming"
      ],
      "prompt": "Every job shown in the source’s memory-layout diagram must be executing on the CPU at the same instant.",
      "options": [
        {
          "id": "os-06-all-memory-running-true",
          "text": "True · صح"
        },
        {
          "id": "os-06-all-memory-running-false",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-06-all-memory-running-false",
      "feedback": {
        "os-06-all-memory-running-true": "غلط؛ الرسم يوضح وجود Jobs في Memory. الاختيار والتنفيذ على CPU حاجة تانية.",
        "os-06-all-memory-running-false": "بالضبط؛ موجودة في Memory مش معناها Running كلها في نفس اللحظة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22,
            23
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-06-interactive",
      "type": "mcq",
      "placement": "os-06-timesharing",
      "objective": "Recognize time sharing’s purpose.",
      "prerequisites": [
        "os-06-timesharing"
      ],
      "prompt": "Which description best captures time sharing?",
      "options": [
        {
          "id": "os-06-interactive-3",
          "text": "Keep the whole system permanently below one second for every task"
        },
        {
          "id": "os-06-interactive-1",
          "text": "Switch CPU work frequently enough to support interactive use"
        },
        {
          "id": "os-06-interactive-2",
          "text": "Finish every job before accepting any interaction from another"
        }
      ],
      "correctOptionId": "os-06-interactive-1",
      "feedback": {
        "os-06-interactive-1": "صح؛ بنقسّم فرص التشغيل علشان المستخدمين يقدروا يتفاعلوا.",
        "os-06-interactive-2": "ده مش التبديل المتكرر المقصود في Time sharing.",
        "os-06-interactive-3": "السلايد بيذكر هدف Response time، مش ضمان لزمن إنهاء أي مهمة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-06-virtual-memory",
      "type": "true-false",
      "placement": "os-06-memory-fit",
      "objective": "Interpret the introductory virtual-memory claim.",
      "prerequisites": [
        "os-06-memory-fit"
      ],
      "prompt": "Virtual memory allows a process to execute without its entire program being resident in main memory at once.",
      "options": [
        {
          "id": "os-06-virtual-memory-true",
          "text": "True · صح"
        },
        {
          "id": "os-06-virtual-memory-false",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-06-virtual-memory-true",
      "feedback": {
        "os-06-virtual-memory-true": "صح؛ ده وصف السلايد. الأجزاء المطلوبة للتنفيذ لسه لازم تبقى متاحة وقت استخدامها.",
        "os-06-virtual-memory-false": "دي صح؛ Virtual memory بتسمح بعدم وجود البرنامج كاملًا في Memory في نفس الوقت."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22
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
      "id": "os-06-glossary-job",
      "term": "Job",
      "translation": "شغل من Code وData",
      "definition": "A unit of work including program code and data in the source’s batch overview.",
      "explanation": "ممكن يكون منتظر أو جاهز؛ مش لازم شغّال دلوقتي.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-06-glossary-multiprogramming",
      "term": "Multiprogramming",
      "translation": "تجهيز Jobs متعددة لتقليل خمول CPU",
      "definition": "Keeping several jobs available so another can run when one waits.",
      "explanation": "A تستنى I/O فنختار B لو جاهزة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22,
            23
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-06-glossary-batch",
      "term": "Batch system",
      "translation": "نظام بيعالج Jobs",
      "definition": "A system organized around jobs rather than continuous interactive use.",
      "explanation": "السلايد بيستخدمه في تمهيد Multiprogramming.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-06-glossary-job-scheduling",
      "term": "Job scheduling",
      "translation": "اختيار Job للتشغيل",
      "definition": "Selecting a job for execution in the source’s introductory account.",
      "explanation": "بنختار من الشغل المتاح حسب إدارة النظام.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-06-glossary-cpu-scheduling",
      "term": "CPU scheduling",
      "translation": "اختيار اللي ياخد CPU",
      "definition": "Choosing among processes ready to run on the CPU.",
      "explanation": "وجود أكتر من Ready process يستدعي اختيار.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-06-glossary-timesharing",
      "term": "Time sharing / multitasking",
      "translation": "تبديل متكرر يسمح بالتفاعل",
      "definition": "Frequent CPU switching among jobs to support interactive computing.",
      "explanation": "كل مستخدم يلاقي فرصة يتفاعل مع برنامجه.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-06-glossary-response",
      "term": "Response time",
      "translation": "وقت انتظار الاستجابة",
      "definition": "The delay from a request to an initial response.",
      "explanation": "مش لازم يساوي زمن انتهاء كل الحساب.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-06-glossary-process",
      "term": "Process",
      "translation": "برنامج أثناء التنفيذ",
      "definition": "A program in execution.",
      "explanation": "ده المصطلح اللي هنستخدمه لما نتكلم عن برنامج شغّال.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-06-glossary-swapping",
      "term": "Swapping",
      "translation": "نقل Processes من وإلى Memory",
      "definition": "Moving processes out of and back into memory so they can run.",
      "explanation": "السلايد بيقدّمه كحل لما Processes مش كلها سايعة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-06-glossary-virtual-memory",
      "term": "Virtual memory",
      "translation": "تشغيل من غير وجود البرنامج كله في Memory",
      "definition": "A mechanism allowing execution without a process being entirely resident in main memory.",
      "explanation": "الأجزاء المطلوبة وقت التنفيذ لازم تتاح، مش بنستغنى عن Memory.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-06-glossary-io",
      "term": "I/O",
      "translation": "إدخال وإخراج",
      "definition": "Input/output activity involving devices.",
      "explanation": "قراءة ملف مثال انتظار ممكن يتيح تشغيل Job تانية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-06-glossary-memory",
      "term": "Main memory",
      "translation": "ذاكرة العمل الرئيسية",
      "definition": "Working storage holding the OS and available jobs in the source layout.",
      "explanation": "وجود Job هنا مش إثبات إنها بتستخدم CPU حالًا.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            23
          ]
        }
      ],
      "kind": "prerequisite"
    }
  ],
  "visualizations": [
    {
      "id": "os-06-cpu-timeline",
      "conceptId": "os-06-multiprogramming",
      "title": "One CPU: waiting is not running",
      "description": "تتبّع A وB: لما A تستنى I/O، B تستخدم CPU في المثال.",
      "legend": "الوقت من الشمال لليمين؛ عرض القطع توضيحي مش قياس. صف CPU فيه مهمة واحدة كل مرة. صف Device I/O شغل جهاز مستقل ممكن يتزامن مع CPU. نفترض A وB موجودين في Memory وB جاهزة عند انتظار A؛ مش خوارزمية Scheduling كاملة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            22,
            23
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 400\" role=\"img\"><defs><marker id=\"arrow\" markerWidth=\"9\" markerHeight=\"9\" refX=\"8\" refY=\"4\" orient=\"auto\"><path d=\"M0 0 L8 4 L0 8 Z\" fill=\"#315e72\"/></marker></defs><rect width=\"760\" height=\"400\" fill=\"#f8fbfc\"/><text x=\"25\" y=\"45\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Illustrative timeline · time →</text><text x=\"25\" y=\"115\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">CPU</text><g data-node=\"a-first\"><rect x=\"150\" y=\"70\" width=\"165\" height=\"70\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"232.5\" y=\"112\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">A runs</text></g><g data-node=\"b-run\"><rect x=\"320\" y=\"70\" width=\"220\" height=\"70\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"430\" y=\"112\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">B runs</text></g><g data-node=\"a-return\"><rect x=\"545\" y=\"70\" width=\"180\" height=\"70\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"635\" y=\"112\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">A runs again</text></g><text x=\"25\" y=\"220\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Device I/O</text><g data-node=\"a-io\"><rect x=\"320\" y=\"170\" width=\"220\" height=\"70\" rx=\"12\" fill=\"#fff0ce\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"430\" y=\"212\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">A waits for I/O</text></g><text x=\"160\" y=\"290\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">A and B remain jobs in memory</text><path d=\"M150 335 L725 335\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><text x=\"437.5\" y=\"326\" text-anchor=\"middle\" font-size=\"18\" font-family=\"Arial, sans-serif\" fill=\"#163745\">time</text></svg>",
      "steps": [
        {
          "id": "os-06-cpu-timeline-step-1",
          "title": "A uses the CPU",
          "detail": "A بتنفّذ تعليمات على CPU.",
          "focus": [
            "a-first"
          ]
        },
        {
          "id": "os-06-cpu-timeline-step-2",
          "title": "A waits; B runs",
          "detail": "A مستنية I/O والجهاز شغّال عليه، بينما B تستخدم CPU. الانتظار مش استخدام CPU.",
          "focus": [
            "a-io",
            "b-run"
          ]
        },
        {
          "id": "os-06-cpu-timeline-step-3",
          "title": "A can run again",
          "detail": "بعد انتهاء I/O واختيار A للتشغيل، تكمّل على CPU. انتهاء I/O لوحده مش بيضمن إنها التالية فورًا.",
          "focus": [
            "a-return"
          ]
        }
      ]
    }
  ]
};
  if (typeof module !== 'undefined' && module.exports) module.exports = lesson;
  if (root) root.OSPilotLesson = lesson;
})(typeof window !== 'undefined' ? window : null);
