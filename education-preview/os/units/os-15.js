(function(root) {
  'use strict';
  const lesson = {
  "id": "os-15",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "3",
  "title": "Threads and a Linux process record",
  "subtitle": "أكتر من مسار تنفيذ؛ والسجل اللي النظام بيتابع بيه العملية.",
  "sources": [
    {
      "id": "current-ch3",
      "title": "Chapter 3 · Processes",
      "driveId": "1h7se1OzceqGrKcmWtsOpb09WDBGuJT9s",
      "url": "https://drive.google.com/file/d/1h7se1OzceqGrKcmWtsOpb09WDBGuJT9s/view",
      "sha256": "7501cd4c2e06b1c09fedc2e7788d47df86786c263f68e0e268dc887c1b73444b",
      "slides": [
        11,
        12
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-15-threads",
      "title": "More than one thread of control",
      "eyebrow": "01 · أكتر من مكان في التنفيذ",
      "summary": "A process can have multiple threads, each with execution details.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            11
          ]
        }
      ],
      "paragraphs": [
        "تخيّل برنامج محتاج يكمّل شغل في مسارين. لحد هنا رسمنا Process بمسار تنفيذ واحد؛ Thread هي مسار تحكم جوه الـProcess. لما يبقى فيه أكتر من Thread، محتاجين نتابع مكان كل مسار، ومنها Program counter بتاعه.",
        "Multiple threads مش نفس معنى Multiple processes. هنا بنتكلم عن مسارات داخل Process واحدة؛ السلايد بينبّه إن تخزين تفاصيل التنفيذ لازم يتسع لأكتر من مسار.",
        "وجود Threads كتير مش ضمان إن كلها بتتنفّذ في نفس اللحظة. في مثال CPU واحدة بيتبادلوا التنفيذ؛ التنفيذ المتزامن فعليًا محتاج موارد معالجة مناسبة. ده توضيح للفرق، مش إضافة خوارزمية Scheduling."
      ]
    },
    {
      "id": "os-15-linux-record",
      "title": "Read the historical task_struct illustration",
      "eyebrow": "02 · اسم العملية مش كفاية",
      "summary": "The slide illustrates Linux process information with a C structure.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            12
          ]
        }
      ],
      "paragraphs": [
        "سلايد 12 من مادة ©2013 بيعرض task_struct كطريقة لتوضيح سجل Process في Linux. اقرأه كمثال تعليمي؛ مش قائمة حقول مضمونة لكل إصدار Linux دلوقتي، ولا كود جاهز للنسخ والتشغيل.",
        "pid يعرّف الـProcess، وstate يصف حالتها، ومعلومة Scheduling بتساعد تنظيم التنفيذ. parent وchildren يربطوا العملية بشجرة العيلة، وfiles للملفات المفتوحة، وmm لمعلومات Address space.",
        "الروابط بين السجلات في الرسم مش معناها إن كل العمليات Running. current في الصورة بيشير للسجل الخاص بالعملية اللي بتتنفّذ في المثال."
      ]
    }
  ],
  "visualizations": [
    {
      "id": "os-15-thread-records",
      "conceptId": "os-15-threads",
      "title": "One process, two execution paths",
      "description": "نفس حد الـProcess جواه مسارين، ولكل مسار موضع متابعة.",
      "legend": "الحد الخارجي Process واحدة. الصندوقان Threads مختلفتان؛ PC A وPC B مكان التعليمة الجاية لكل مسار، مش عنوانين حقيقيين. الأسهم من سجل Thread لموضعه معناها متابعة تنفيذ. المثال لا يدّعي تنفيذًا متوازيًا على CPU واحدة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            11
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 820 440\" role=\"img\" aria-label=\"One process, two execution paths\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"8\" markerHeight=\"8\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#24516c\"/></marker></defs><rect width=\"820\" height=\"440\" fill=\"#ffffff\"/><g font-family=\"Arial, sans-serif\" fill=\"#17394e\"><rect x=\"65\" y=\"45\" width=\"690\" height=\"330\" rx=\"18\" fill=\"#f5faff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"410\" y=\"80\" text-anchor=\"middle\" font-size=\"20\">One process · educational model</text><g data-node=\"thread-a\"><rect x=\"100\" y=\"120\" width=\"260\" height=\"80\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"230\" y=\"148\" text-anchor=\"middle\" font-size=\"20\">Thread A</text><text x=\"230\" y=\"174\" text-anchor=\"middle\" font-size=\"20\">Execution details for A</text></g><g data-node=\"thread-b\"><rect x=\"460\" y=\"120\" width=\"260\" height=\"80\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"590\" y=\"148\" text-anchor=\"middle\" font-size=\"20\">Thread B</text><text x=\"590\" y=\"174\" text-anchor=\"middle\" font-size=\"20\">Execution details for B</text></g><g data-node=\"pc-a\"><rect x=\"100\" y=\"275\" width=\"260\" height=\"60\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"230\" y=\"303\" text-anchor=\"middle\" font-size=\"20\">PC A: next instruction</text></g><g data-node=\"pc-b\"><rect x=\"460\" y=\"275\" width=\"260\" height=\"60\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"590\" y=\"303\" text-anchor=\"middle\" font-size=\"20\">PC B: next instruction</text></g><g data-node=\"track-a\"><path d=\"M230 200 L230 275\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"300\" y=\"243\" text-anchor=\"middle\" font-size=\"18\">track A</text></g><g data-node=\"track-b\"><path d=\"M590 200 L590 275\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"660\" y=\"243\" text-anchor=\"middle\" font-size=\"18\">track B</text></g></g></svg>",
      "steps": [
        {
          "id": "os-15-thread-records-step-1",
          "title": "One thread",
          "detail": "نموذج Process البسيط كان فيه مسار واحد وProgram counter واحد.",
          "focus": [
            "thread-a",
            "pc-a"
          ]
        },
        {
          "id": "os-15-thread-records-step-2",
          "title": "Another thread",
          "detail": "مسار تاني محتاج تفاصيل متابعة تانية؛ PC A مش بديل عن PC B.",
          "focus": [
            "thread-b",
            "pc-b"
          ]
        },
        {
          "id": "os-15-thread-records-step-3",
          "title": "One process boundary",
          "detail": "الصندوقين داخل نفس Process. ده لوحده مش بيقول عندنا كام CPU أو إن التنفيذ متوازي.",
          "focus": [
            "thread-a",
            "thread-b"
          ]
        }
      ]
    },
    {
      "id": "os-15-linux-record-map",
      "conceptId": "os-15-linux-record",
      "title": "Reading the slide’s task_struct record",
      "description": "دي روابط معلومات في نموذج السلايد، مش حركة CPU ولا نموذج لكود Kernel حالي.",
      "legend": "السجل الأوسط هو Process في المثال. الأسهم بتشير لمعلومات/علاقات بيحتفظ بيها النظام؛ Parent وChild عمليات أخرى. تقسيم الحقول هنا لتسهيل القراءة، ومش Layout ذاكرة فعلي أو مواصفة Linux حالية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            12
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 820 440\" role=\"img\" aria-label=\"Reading the slide’s task_struct record\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"8\" markerHeight=\"8\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#24516c\"/></marker></defs><rect width=\"820\" height=\"440\" fill=\"#ffffff\"/><g font-family=\"Arial, sans-serif\" fill=\"#17394e\"><g data-node=\"record\"><rect x=\"280\" y=\"70\" width=\"260\" height=\"125\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"410\" y=\"98\" text-anchor=\"middle\" font-size=\"20\">task_struct illustration</text><text x=\"410\" y=\"124\" text-anchor=\"middle\" font-size=\"20\">PID · state</text><text x=\"410\" y=\"150\" text-anchor=\"middle\" font-size=\"20\">Scheduling information</text></g><g data-node=\"parent\"><rect x=\"20\" y=\"80\" width=\"210\" height=\"60\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"125\" y=\"108\" text-anchor=\"middle\" font-size=\"20\">Parent record</text></g><g data-node=\"children\"><rect x=\"590\" y=\"80\" width=\"210\" height=\"60\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"695\" y=\"108\" text-anchor=\"middle\" font-size=\"20\">Child records</text></g><g data-node=\"files\"><rect x=\"115\" y=\"285\" width=\"250\" height=\"60\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"240\" y=\"313\" text-anchor=\"middle\" font-size=\"20\">Open-file information</text></g><g data-node=\"memory\"><rect x=\"455\" y=\"285\" width=\"250\" height=\"60\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"580\" y=\"313\" text-anchor=\"middle\" font-size=\"20\">Address-space information</text></g><g data-node=\"parent-link\"><path d=\"M280 110 L230 110\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g><g data-node=\"children-link\"><path d=\"M540 110 L590 110\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g><g data-node=\"files-link\"><path d=\"M345 195 L240 285\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g><g data-node=\"memory-link\"><path d=\"M475 195 L580 285\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g><text x=\"410\" y=\"395\" text-anchor=\"middle\" font-size=\"20\">2013 teaching illustration · not current kernel source</text></g></svg>",
      "steps": [
        {
          "id": "os-15-linux-record-map-step-1",
          "title": "Identify and schedule",
          "detail": "PID والحالة ومعلومات Scheduling أوصاف عن Process، مش كود التطبيق نفسه.",
          "focus": [
            "record"
          ]
        },
        {
          "id": "os-15-linux-record-map-step-2",
          "title": "Follow relationships",
          "detail": "parent وchildren بيربطوا سجلات عمليات بعلاقات إنشاء؛ مش معناها كلهم شغّالين.",
          "focus": [
            "parent-link",
            "parent",
            "children-link",
            "children"
          ]
        },
        {
          "id": "os-15-linux-record-map-step-3",
          "title": "Find resources",
          "detail": "files وmm بيساعدوا في الوصول لمعلومات ملفات وعناوين Process.",
          "focus": [
            "files-link",
            "files",
            "memory-link",
            "memory"
          ]
        }
      ]
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-15-thread-pc",
      "type": "mcq",
      "placement": "os-15-threads",
      "objective": "A process gains a second thread. What must the model now track?",
      "prerequisites": [
        "os-15-threads"
      ],
      "prompt": "A process gains a second thread. What must the model now track?",
      "options": [
        {
          "id": "os-15-thread-pc-o1",
          "text": "Only one execution location for both threads"
        },
        {
          "id": "os-15-thread-pc-o2",
          "text": "Execution details, including a program counter, for each thread"
        },
        {
          "id": "os-15-thread-pc-o3",
          "text": "A second copy of the whole operating system"
        }
      ],
      "correctOptionId": "os-15-thread-pc-o2",
      "feedback": {
        "os-15-thread-pc-o1": "كل مسار محتاج نعرف وصل لفين؛ PC واحد مش بيوصف مكانين مختلفين.",
        "os-15-thread-pc-o2": "صح؛ تعدد Threads محتاج تفاصيل تنفيذ لكل مسار، ومنها Program counter.",
        "os-15-thread-pc-o3": "Threads داخل Process؛ مش معناها تشغيل OS تاني."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            11
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-15-threads-parallel",
      "type": "true-false",
      "placement": "os-15-threads",
      "objective": "Having two threads guarantees simultaneous execution on one CPU.",
      "prerequisites": [
        "os-15-threads"
      ],
      "prompt": "Having two threads guarantees simultaneous execution on one CPU.",
      "options": [
        {
          "id": "os-15-threads-parallel-o1",
          "text": "True · صح"
        },
        {
          "id": "os-15-threads-parallel-o2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-15-threads-parallel-o2",
      "feedback": {
        "os-15-threads-parallel-o1": "عدد Threads مش هو عدد وحدات المعالجة؛ على CPU واحدة مش بينفّذوا تعليمات في نفس اللحظة.",
        "os-15-threads-parallel-o2": "غلط؛ على CPU واحدة المسارات ممكن تتبادل التنفيذ. العدد وحده مش دليل Parallel execution."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            11
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-15-record-parent",
      "type": "mcq",
      "placement": "os-15-linux-record",
      "objective": "In the historical Linux illustration, which information describes the process family relationship?",
      "prerequisites": [
        "os-15-linux-record"
      ],
      "prompt": "In the historical Linux illustration, which information describes the process family relationship?",
      "options": [
        {
          "id": "os-15-record-parent-o1",
          "text": "parent and children"
        },
        {
          "id": "os-15-record-parent-o2",
          "text": "files only"
        },
        {
          "id": "os-15-record-parent-o3",
          "text": "mm only"
        }
      ],
      "correctOptionId": "os-15-record-parent-o1",
      "feedback": {
        "os-15-record-parent-o1": "صح؛ parent وchildren روابط علاقة الإنشاء بين العمليات في المثال.",
        "os-15-record-parent-o2": "files معلومات عن الملفات المفتوحة، مش شجرة العمليات.",
        "os-15-record-parent-o3": "mm مرتبط بمساحة العناوين، مش علاقة Parent وChild."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            12
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-15-historical-fields",
      "type": "true-false",
      "placement": "os-15-linux-record",
      "objective": "The task_struct field list on the 2013 slide is a guaranteed current Linux layout.",
      "prerequisites": [
        "os-15-linux-record"
      ],
      "prompt": "The task_struct field list on the 2013 slide is a guaranteed current Linux layout.",
      "options": [
        {
          "id": "os-15-historical-fields-o1",
          "text": "True · صح"
        },
        {
          "id": "os-15-historical-fields-o2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-15-historical-fields-o2",
      "feedback": {
        "os-15-historical-fields-o1": "دي صورة تعليمية قديمة؛ لا يصح نفترض نفس الأسماء والـLayout في كل Linux حالي.",
        "os-15-historical-fields-o2": "غلط؛ نستخدمها لتفسير أنواع المعلومات. تفاصيل Linux تتغير، والسلايد مش مواصفة إصدار حالي."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            12
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
      "id": "os-15-term-thread",
      "term": "Thread",
      "translation": "مسار تنفيذ",
      "definition": "A thread of control within a process.",
      "explanation": "مسار نتابع تعليمته الجاية وحالة تنفيذه جوه Process.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            11
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-15-term-program-counter",
      "term": "Program counter",
      "translation": "مؤشر التعليمة",
      "definition": "A record of the next instruction location for an execution path.",
      "explanation": "كل مسار محتاج نعرف هيكمل منين.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            11
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-15-term-task-struct",
      "term": "task_struct",
      "translation": "سجل عملية في مثال Linux",
      "definition": "The C structure used to illustrate Linux process representation on the slide.",
      "explanation": "مثال لتجميع معلومات العملية؛ مش كود حالي مضمون.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            12
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-15-term-pid",
      "term": "PID",
      "translation": "معرّف العملية",
      "definition": "An identifier for a process.",
      "explanation": "رقم يميّز Process عن غيرها؛ مش اسم البرنامج.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            12
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-15-term-parent",
      "term": "Parent",
      "translation": "العملية المنشئة",
      "definition": "A process that created another process.",
      "explanation": "السجل بيحتفظ بعلاقة العملية اللي أنشأت دي.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            12
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-15-term-address-space",
      "term": "Address space",
      "translation": "مساحة عناوين",
      "definition": "The memory address range associated with a process.",
      "explanation": "mm في المثال مرتبط بمعلومات ذاكرة العملية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            12
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-15-term-parallel-execution",
      "term": "Parallel execution",
      "translation": "تنفيذ في نفس اللحظة",
      "definition": "Execution occurring simultaneously on processing resources.",
      "explanation": "Threads كتير ممكن تتبادل CPU واحدة؛ التوازي الفعلي محتاج موارد مناسبة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            11
          ]
        }
      ],
      "kind": "prerequisite"
    }
  ]
};
  if (typeof module === 'object' && module.exports) module.exports = lesson;
  if (typeof window !== 'undefined') window.OSPilotLesson = lesson;
})(typeof window !== 'undefined' ? window : globalThis);
