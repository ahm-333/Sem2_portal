(function(root){const lesson={
  "id": "os-13",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "3",
  "title": "Program, process and memory",
  "subtitle": "الملف محفوظ على SSD؛ إيه اللي بيزيد لما تشغّله؟",
  "sources": [
    {
      "id": "current-ch3",
      "title": "Chapter 3 · Processes",
      "driveId": "1h7se1OzceqGrKcmWtsOpb09WDBGuJT9s",
      "url": "https://drive.google.com/file/d/1h7se1OzceqGrKcmWtsOpb09WDBGuJT9s/view",
      "sha256": "7501cd4c2e06b1c09fedc2e7788d47df86786c263f68e0e268dc887c1b73444b",
      "slides": [
        4,
        5,
        6
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-13-active",
      "title": "Program versus process",
      "eyebrow": "01 · من ملف لتشغيل",
      "summary": "A program is stored code; a process is a running instance.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            4,
            6
          ]
        }
      ],
      "paragraphs": [
        "عندك ملف برنامج محفوظ على SSD. ده Program: تعليمات محفوظة، مش عملية تنفيذ شغّالة. لما تشغّله من أيقونة أو command line، النظام بيحمّله للتنفيذ وبيكون عندك Process.",
        "لو مستخدمين شغّلوا نفس البرنامج، ممكن يبقى عندك أكتر من Process لنفس الـProgram. كل تشغيل ليه نشاطه وحالته؛ اسم الملف لوحده مش هو حالة التنفيذ.",
        "السلايد بيستخدم Job وProcess بشكل قريب في الشرح. هنا هنقول Process لما نقصد البرنامج وهو بيتنفّذ."
      ]
    },
    {
      "id": "os-13-parts",
      "title": "The process includes execution state",
      "eyebrow": "02 · واقف عند أنهي تعليمة؟",
      "summary": "A process includes code, data and the current CPU state.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            4
          ]
        }
      ],
      "paragraphs": [
        "تخيّل برنامج بيحسب مجموع أرقام. الكود بيقول تعمل إيه، لكن محتاج كمان تعرف وصلت لفين. Program counter بيحدد التعليمة الجاية، وCPU registers فيها قيم بيستخدمها التنفيذ حاليًا.",
        "نموذجنا لحد هنا فيه مسار تنفيذ واحد، بيتقدم تعليمة بعد تعليمة. بعدين هنتعرّف على Threads؛ وجود أكتر من Process مش معناه إن كل واحد بياخد CPU في نفس اللحظة."
      ]
    },
    {
      "id": "os-13-memory",
      "title": "Text, data, heap and stack",
      "eyebrow": "03 · كل نوع بيانات ليه مكان",
      "summary": "The memory picture separates code, global data, dynamic allocation and temporary call data.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            4,
            5
          ]
        }
      ],
      "paragraphs": [
        "Text section فيها تعليمات البرنامج، وData section فيها Global variables. متغيّر عام زي إجمالي الطلبات موجود طول تشغيل البرنامج في المثال.",
        "Heap للذاكرة اللي البرنامج بيطلبها أثناء التشغيل. Stack فيها بيانات مؤقتة مرتبطة باستدعاء الدوال: Function parameters وReturn addresses وLocal variables.",
        "الرسم في السلايد بيبدأ Text عند عنوان قليل، وبعده Data ثم Heap، وStack ناحية العناوين الكبيرة. الأسهم بتوضح اتجاه نمو Heap وStack في النموذج؛ مش بتقيس حجمهم ولا بتوصف كل برنامج على كل جهاز."
      ]
    }
  ],
  "visualizations": [
    {
      "id": "os-13-memory-layout",
      "conceptId": "os-13-memory",
      "title": "An illustrative process memory layout",
      "description": "اقرأ الرسم من العناوين الصغيرة تحت للكبيرة فوق، وميّز بيانات التشغيل عن ملف البرنامج.",
      "legend": "الرسم كله بيوضح أجزاء Address space تصوّري لـProcess واحدة. الأسهم في الفراغ بتوضح اتجاه نمو Heap وStack في رسم السلايد، مش حركة بيانات. مفيش مقياس أحجام أو عناوين فعلية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            4,
            5,
            6
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 820 500\" role=\"img\" aria-label=\"An illustrative process memory layout\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"8\" markerHeight=\"8\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#24516c\"/></marker></defs><rect width=\"820\" height=\"500\" fill=\"#ffffff\"/><g font-family=\"Arial, sans-serif\" fill=\"#17394e\"><text x=\"270\" y=\"32\" text-anchor=\"start\" font-size=\"20\">Higher addresses</text><g data-node=\"stack\"><rect x=\"240\" y=\"48\" width=\"290\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"385\" y=\"76\" text-anchor=\"middle\" font-size=\"20\">Stack</text><text x=\"385\" y=\"102\" text-anchor=\"middle\" font-size=\"20\">Calls, locals, return addresses</text></g><g data-node=\"stack-growth\"><path d=\"M385 118 L385 173\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"650\" y=\"150\" text-anchor=\"middle\" font-size=\"18\">Stack grows down</text></g><text x=\"385\" y=\"215\" text-anchor=\"middle\" font-size=\"20\">Free space</text><g data-node=\"heap-growth\"><path d=\"M385 285 L385 235\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"650\" y=\"265\" text-anchor=\"middle\" font-size=\"18\">Heap grows up</text></g><g data-node=\"heap\"><rect x=\"240\" y=\"285\" width=\"290\" height=\"50\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"385\" y=\"313\" text-anchor=\"middle\" font-size=\"20\">Heap: dynamic allocations</text></g><g data-node=\"data\"><rect x=\"240\" y=\"340\" width=\"290\" height=\"50\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"385\" y=\"368\" text-anchor=\"middle\" font-size=\"20\">Data: global variables</text></g><g data-node=\"text\"><rect x=\"240\" y=\"395\" width=\"290\" height=\"50\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"385\" y=\"423\" text-anchor=\"middle\" font-size=\"20\">Text: program instructions</text></g><text x=\"270\" y=\"475\" text-anchor=\"start\" font-size=\"20\">Lower addresses · diagram only</text></g></svg>",
      "steps": [
        {
          "id": "os-13-memory-layout-step-1",
          "title": "Instructions",
          "detail": "Text فيها الكود؛ ملف الكود على SSD وحده مش حالة Process شغّالة.",
          "focus": [
            "text"
          ]
        },
        {
          "id": "os-13-memory-layout-step-2",
          "title": "Data and allocations",
          "detail": "Global variables في Data، وطلبات ذاكرة أثناء التشغيل في Heap.",
          "focus": [
            "data",
            "heap"
          ]
        },
        {
          "id": "os-13-memory-layout-step-3",
          "title": "Function calls",
          "detail": "Stack بتحتفظ ببيانات الاستدعاءات المؤقتة. اتجاه النمو هنا خاص بالنموذج المرسوم.",
          "focus": [
            "stack",
            "stack-growth",
            "heap-growth"
          ]
        }
      ]
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-13-instances",
      "type": "mcq",
      "placement": "os-13-active",
      "objective": "Two users start the same executable. Which statement can be true?",
      "prerequisites": [
        "os-13-active"
      ],
      "prompt": "Two users start the same executable. Which statement can be true?",
      "options": [
        {
          "id": "os-13-instances-o1",
          "text": "There can be two processes for one program."
        },
        {
          "id": "os-13-instances-o2",
          "text": "The program can have only one process."
        },
        {
          "id": "os-13-instances-o3",
          "text": "Both processes must have the same current execution state."
        }
      ],
      "correctOptionId": "os-13-instances-o1",
      "feedback": {
        "os-13-instances-o1": "صح؛ نفس الـProgram ممكن يبقى ليه أكتر من Process، وكل واحدة لها حالة تنفيذ.",
        "os-13-instances-o2": "السلايد بيذكر تشغيل نفس البرنامج بواسطة أكتر من مستخدم؛ مفيش شرط Process واحدة.",
        "os-13-instances-o3": "تشابه الكود مش معناه إن كل تشغيل واقف عند نفس التعليمة أو بنفس القيم."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            6
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-13-call-data",
      "type": "mcq",
      "placement": "os-13-memory",
      "objective": "In this introductory model, where do function return addresses belong?",
      "prerequisites": [
        "os-13-memory"
      ],
      "prompt": "In this introductory model, where do function return addresses belong?",
      "options": [
        {
          "id": "os-13-call-data-o1",
          "text": "Text section"
        },
        {
          "id": "os-13-call-data-o2",
          "text": "Stack"
        },
        {
          "id": "os-13-call-data-o3",
          "text": "Heap"
        }
      ],
      "correctOptionId": "os-13-call-data-o2",
      "feedback": {
        "os-13-call-data-o1": "Text فيها التعليمات، لكن Return address من بيانات الاستدعاء المؤقتة في Stack.",
        "os-13-call-data-o2": "بالضبط؛ Stack بتحتفظ ببيانات الدوال المؤقتة ومنها عنوان الرجوع.",
        "os-13-call-data-o3": "Heap للطلبات الديناميكية؛ عنوان الرجوع في النموذج من بيانات Stack."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            4,
            5
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-13-next-instruction",
      "type": "mcq",
      "placement": "os-13-parts",
      "objective": "Which records the location of the next instruction to execute?",
      "prerequisites": [
        "os-13-parts"
      ],
      "prompt": "Which records the location of the next instruction to execute?",
      "options": [
        {
          "id": "os-13-next-instruction-o1",
          "text": "Program counter"
        },
        {
          "id": "os-13-next-instruction-o2",
          "text": "Executable filename"
        },
        {
          "id": "os-13-next-instruction-o3",
          "text": "Global variable section"
        }
      ],
      "correctOptionId": "os-13-next-instruction-o1",
      "feedback": {
        "os-13-next-instruction-o1": "صح؛ Program counter بيحدد مكان التعليمة الجاية، وهو جزء من حالة التنفيذ.",
        "os-13-next-instruction-o2": "اسم الملف يعرّف البرنامج، لكنه مش بيقول الـProcess وصلت لأنهي تعليمة.",
        "os-13-next-instruction-o3": "Data section فيها Global variables؛ مكان التعليمة الجاية وظيفة Program counter."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
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
      "id": "os-13-passive",
      "type": "true-false",
      "placement": "os-13-active",
      "objective": "An executable stored on disk is already an active process.",
      "prerequisites": [
        "os-13-active"
      ],
      "prompt": "An executable stored on disk is already an active process.",
      "options": [
        {
          "id": "os-13-passive-o1",
          "text": "True · صح"
        },
        {
          "id": "os-13-passive-o2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-13-passive-o2",
      "feedback": {
        "os-13-passive-o1": "وجود ملف executable مش كفاية؛ Program passive على القرص، وProcess active وقت التنفيذ.",
        "os-13-passive-o2": "غلط؛ ده Program محفوظ. Process هي حالة البرنامج وقت التشغيل."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            6
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
      "id": "os-13-term-program",
      "term": "Program",
      "translation": "برنامج",
      "definition": "A passive set of instructions stored as an executable.",
      "explanation": "الملف المحفوظ فيه تعليمات؛ تشغيله هو اللي يكوّن Process.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            6
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-13-term-process",
      "term": "Process",
      "translation": "برنامج قيد التنفيذ",
      "definition": "A program in execution, including its execution state.",
      "explanation": "تشغيل فعلي للكود ومعاه بياناته ووصل لفين.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            4,
            6
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-13-term-program-counter",
      "term": "Program counter",
      "translation": "مؤشر التعليمة",
      "definition": "The location of the next instruction to execute.",
      "explanation": "لما نكمل تنفيذ، محتاجين نعرف التعليمة الجاية فين.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            4
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-13-term-cpu-register",
      "term": "CPU register",
      "translation": "سجل في المعالج",
      "definition": "A CPU storage location holding current execution values.",
      "explanation": "مكان صغير جوه CPU بيحتفظ بقيم مستخدمة حاليًا.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            4
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-13-term-text-section",
      "term": "Text section",
      "translation": "قسم التعليمات",
      "definition": "The process memory section containing program code.",
      "explanation": "كلمة Text هنا معناها الكود، مش ملف كلام عادي.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            4,
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-13-term-data-section",
      "term": "Data section",
      "translation": "قسم البيانات العامة",
      "definition": "The section containing global variables.",
      "explanation": "متغيّرات عامة البرنامج بيستخدمها خلال تشغيله.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            4,
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-13-term-heap",
      "term": "Heap",
      "translation": "ذاكرة للطلبات الديناميكية",
      "definition": "Memory allocated dynamically during execution.",
      "explanation": "لو البرنامج طلب مساحة وهو شغّال، نموذجنا بيحط الطلبات دي هنا.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            4,
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-13-term-stack",
      "term": "Stack",
      "translation": "مكدس الاستدعاءات",
      "definition": "Memory for temporary call data such as locals and return addresses.",
      "explanation": "بيانات مؤقتة تساعد الدالة تشتغل وترجع للمكان الصح.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            4,
            5
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-13-term-address-space",
      "term": "Address space",
      "translation": "مساحة عناوين",
      "definition": "The range of memory addresses available to a process.",
      "explanation": "العناوين اللي بنوصف بيها أماكن ذاكرة Process؛ الرسم مش أحجام فعلية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            5
          ]
        }
      ],
      "kind": "prerequisite"
    }
  ]
};if(typeof module==="object"&&module.exports)module.exports=lesson;else root.OSPilotLesson=lesson;})(typeof window!=="undefined"?window:globalThis);
