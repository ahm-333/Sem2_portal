(function(root){'use strict';const lesson={
  "id": "os-11",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "2",
  "title": "Single-tasking وMultitasking: الصورة بتقول إيه؟",
  "subtitle": "نقرأ مثال MS-DOS وFreeBSD التاريخي، ونفرّق بين وجود البرنامج في الذاكرة وتنفيذه دلوقتي.",
  "sources": [
    {
      "id": "current-ch2",
      "title": "Chapter 2 · Operating-System Structures",
      "driveId": "1DDEour98ioHVMAHbTVzHy_hfgR-zpaTW",
      "url": "https://drive.google.com/file/d/1DDEour98ioHVMAHbTVzHy_hfgR-zpaTW/view",
      "sha256": "7077be5a51357a7fd485d21111e7a296478f7dcfaf98985ccebcc998a349494e",
      "slides": [
        13
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-11-snapshots",
      "title": "Read the historical memory snapshots",
      "eyebrow": "01 · نقرأ الصورة قبل الحكم",
      "summary": "The source compares classic MS-DOS with a multitasking FreeBSD example.",
      "paragraphs": [
        "سلايد 13 من مادة 2013 يقارن مثال <bdi lang=\"en\">MS-DOS</bdi> الكلاسيكي بمثال <bdi lang=\"en\">FreeBSD</bdi>. في عمود MS-DOS وقت البداية، فيه <bdi lang=\"en\">Kernel</bdi> و<bdi lang=\"en\">Command interpreter</bdi> ومساحة فاضية. لما برنامج يشتغل، جزء من المساحة يبقى للـ<bdi lang=\"en\">Process</bdi>.",
        "الـ<bdi lang=\"en\">Command interpreter</bdi> برنامج بيفهم أوامر المستخدم؛ وجوده في الذاكرة مع البرنامج مش معناه إن المثال بقى نظام بيشغّل عدة مهام للمستخدم بالتزامن. المصدر هنا بيقدّم MS-DOS كـ<bdi lang=\"en\">Single-tasking</bdi> في نموذجه المبسّط.",
        "في عمود FreeBSD، شايف عمليات B وC وD موجودة مع Interpreter وKernel ومساحة فاضية. ده مثال <bdi lang=\"en\">Multitasking</bdi>. أحجام وترتيب المربعات للتوضيح، مش عناوين ذاكرة فعلية أو نسب استخدام."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
          ]
        }
      ]
    },
    {
      "id": "os-11-concurrency",
      "title": "Resident is different from running right now",
      "eyebrow": "02 · موجود في الذاكرة مش معناه بينفّذ دلوقتي",
      "summary": "Multitasking permits concurrent progress; memory presence does not prove parallel CPU execution.",
      "paragraphs": [
        "لو بتسمع المحاضرة وفاتح برنامج تكتب فيه ملاحظات، ممكن أكتر من مهمة تتقدم خلال نفس الفترة. على <bdi lang=\"en\">CPU core</bdi> واحد، تعليمات المهام بتاخد أدوار؛ مش كل العمليات لازم تنفّذ في نفس اللحظة. ده توضيح لمعنى <bdi lang=\"en\">Concurrent</bdi>، مش قياس للسلايد.",
        "رسمة FreeBSD بتعرض وجود عدة <bdi lang=\"en\">Processes</bdi> في الذاكرة. لو حد افترض إن وجود 3 مربعات يعني إن 3 عمليات على CPU في نفس اللحظة، الصورة لوحدها مش بتثبت كده. <bdi lang=\"en\">Parallel execution</bdi> محتاجة قدرة تنفيذ متعددة وتفاصيل مش مرسومة هنا.",
        "بنقرأ مثالين تاريخيين تحت افتراضات الرسم، مش بنعمّم على كل أنظمة DOS أو كل نسخة FreeBSD. تفاصيل إنشاء العمليات وجدولتها هتيجي في Chapter 3."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
          ]
        }
      ]
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-11-which-snapshot",
      "type": "mcq",
      "placement": "os-11-snapshots",
      "objective": "Read the FreeBSD snapshot without inferring timing.",
      "prerequisites": [
        "os-11-snapshots"
      ],
      "prompt": "What does the FreeBSD snapshot directly show?",
      "options": [
        {
          "id": "os-11-which-snapshot-1",
          "text": "Several processes present with the kernel and interpreter"
        },
        {
          "id": "os-11-which-snapshot-2",
          "text": "A measured CPU schedule for three cores"
        },
        {
          "id": "os-11-which-snapshot-3",
          "text": "Only one user program can be resident"
        },
        {
          "id": "os-11-which-snapshot-4",
          "text": "Exact memory addresses for each process"
        }
      ],
      "correctOptionId": "os-11-which-snapshot-1",
      "feedback": {
        "os-11-which-snapshot-1": "صح؛ ده اللي مربعات Process B وC وD بتوضحه. توقيت التنفيذ مش مرسوم.",
        "os-11-which-snapshot-2": "دي خريطة ذاكرة مبسطة؛ مفيهاش قياسات توقيت أو عدد Cores.",
        "os-11-which-snapshot-3": "العمود بيعرض عدة Processes موجودة مع بعض.",
        "os-11-which-snapshot-4": "مفيش عناوين فعلية ولا مقياس أحجام في الرسم."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-11-msdos-start",
      "type": "mcq",
      "placement": "os-11-snapshots",
      "objective": "Compare startup and running-program snapshots.",
      "prerequisites": [
        "os-11-snapshots"
      ],
      "prompt": "In the source MS-DOS example, what changes when a program runs?",
      "options": [
        {
          "id": "os-11-msdos-start-1",
          "text": "The kernel is replaced by the user process"
        },
        {
          "id": "os-11-msdos-start-2",
          "text": "A process occupies part of the formerly free memory"
        },
        {
          "id": "os-11-msdos-start-3",
          "text": "The interpreter is replaced completely by the user process"
        },
        {
          "id": "os-11-msdos-start-4",
          "text": "The program is loaded without reducing the formerly free region"
        }
      ],
      "correctOptionId": "os-11-msdos-start-2",
      "feedback": {
        "os-11-msdos-start-1": "Kernel لسه موجود في اللقطة بعد تشغيل البرنامج؛ اللي اتخصص للبرنامج جزء من الذاكرة الحرة.",
        "os-11-msdos-start-2": "صح؛ لقطة (b) فيها Process ومساحة حرة أقل، مع Kernel وInterpreter.",
        "os-11-msdos-start-3": "الـInterpreter لسه ظاهر في لقطة تشغيل البرنامج، مش اتشال كله.",
        "os-11-msdos-start-4": "لقطة تشغيل البرنامج بتبيّن Process أخدت جزء من المساحة اللي كانت Free، فالمساحة الحرة قلّت."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-11-parallel",
      "type": "true-false",
      "placement": "os-11-concurrency",
      "objective": "Separate a memory map from evidence of parallel execution.",
      "prerequisites": [
        "os-11-concurrency"
      ],
      "prompt": "Three process boxes in memory prove that three processes execute CPU instructions at the same instant.",
      "options": [
        {
          "id": "os-11-parallel-1",
          "text": "True · صح"
        },
        {
          "id": "os-11-parallel-2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-11-parallel-2",
      "feedback": {
        "os-11-parallel-1": "غلط؛ وجود العمليات في الذاكرة مش إثبات Parallel execution. الرسم مفيهوش توقيت CPU.",
        "os-11-parallel-2": "صح؛ ممكن العمليات تتشارك Core واحد على أدوار. خريطة الذاكرة مش جدول تنفيذ."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-11-historical",
      "type": "true-false",
      "placement": "os-11-snapshots",
      "objective": "Keep the platform example bounded.",
      "prerequisites": [
        "os-11-snapshots"
      ],
      "prompt": "Slide 13 is a simplified historical platform comparison, not a specification for every current operating system.",
      "options": [
        {
          "id": "os-11-historical-1",
          "text": "True · صح"
        },
        {
          "id": "os-11-historical-2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-11-historical-1",
      "feedback": {
        "os-11-historical-1": "صح؛ المصدر من 2013 وبيستخدم MS-DOS وFreeBSD كأمثلة محددة.",
        "os-11-historical-2": "الجملة صح؛ مانحوّلش المثال التاريخي لقاعدة لكل الأنظمة والإصدارات."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
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
      "id": "os-11-single",
      "term": "Single-tasking",
      "translation": "مهمة مستخدم واحدة في نموذج المثال",
      "definition": "An execution model allowing one user task at a time in the illustrated system.",
      "explanation": "ده وصف مثال MS-DOS الكلاسيكي هنا؛ مش عدد كل قطع الكود في الذاكرة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-11-multi",
      "term": "Multitasking",
      "translation": "تقدّم أكتر من مهمة خلال نفس الفترة",
      "definition": "Support for concurrent execution of multiple tasks.",
      "explanation": "مثال FreeBSD فيه عدة Processes؛ مش شرط تنفذ كلها في نفس اللحظة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-11-interpreter",
      "term": "Command interpreter",
      "translation": "برنامج بيفهم أوامرك",
      "definition": "A program that interprets user commands.",
      "explanation": "ظاهر مع Kernel والبرامج في لقطة الذاكرة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-11-free",
      "term": "Free memory",
      "translation": "مساحة ذاكرة لسه متاحة",
      "definition": "Memory space not occupied by the components shown in the snapshot.",
      "explanation": "حجمها يقل لما نحمّل البرنامج في مثال MS-DOS.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-11-process",
      "term": "Process",
      "translation": "برنامج وهو بيتنفّذ",
      "definition": "A program in execution.",
      "explanation": "كل مربع B أوC أوD يمثل Process مختلفة في المثال.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-11-concurrent",
      "term": "Concurrent execution",
      "translation": "تقدّم مهام خلال فترة مشتركة",
      "definition": "Progress of multiple tasks over an overlapping period of time.",
      "explanation": "ممكن يكون على أدوار في Core واحد.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-11-parallel",
      "term": "Parallel execution",
      "translation": "تنفيذ فعلي في نفس اللحظة",
      "definition": "Execution of multiple instruction streams at the same instant.",
      "explanation": "خريطة الذاكرة لوحدها مش دليل عليه.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-11-kernel",
      "term": "Kernel",
      "translation": "الجزء الأساسي من OS",
      "definition": "The OS core responsible for basic system services and resource management.",
      "explanation": "وجوده مع العمليات مش معناه إن كل المربعات بتنّفذ في نفس اللحظة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
          ]
        }
      ],
      "kind": "prerequisite"
    }
  ],
  "visualizations": [
    {
      "id": "os-11-memory-comparison",
      "conceptId": "os-11-snapshots",
      "title": "Historical snapshots: MS-DOS and FreeBSD",
      "description": "عمودا MS-DOS حالتان لنفس المثال؛ عمود FreeBSD مثال تاني لوجود عدة عمليات.",
      "legend": "المربعات مكوّنات موجودة في الذاكرة. القراءة من فوق لتحت للعرض فقط؛ مفيش أسهم بيانات أو مقياس أحجام أو عناوين أو توقيت CPU. MS-DOS هنا مثال Single-tasking تاريخي؛ FreeBSD مثال Multitasking من سلايد 13.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            13
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 420\" role=\"img\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#20546e\"/></marker></defs><rect width=\"760\" height=\"420\" fill=\"#f8fcff\"/><g font-family=\"Arial, sans-serif\"><text x=\"130\" y=\"30\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">MS-DOS: startup</text><text x=\"380\" y=\"30\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">MS-DOS: program</text><text x=\"630\" y=\"30\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">FreeBSD: example</text><g data-node=\"dos-free\"><rect x=\"25\" y=\"55\" width=\"210\" height=\"165\" rx=\"9\" fill=\"#ffffff\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"130\" y=\"144.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Free memory</text></g><g data-node=\"dos-shell\"><rect x=\"25\" y=\"220\" width=\"210\" height=\"80\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"130\" y=\"254.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Command</text><text x=\"130\" y=\"279.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">interpreter</text></g><g data-node=\"dos-kernel\"><rect x=\"25\" y=\"300\" width=\"210\" height=\"65\" rx=\"9\" fill=\"#e4f2e5\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"130\" y=\"339.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Kernel</text></g><g data-node=\"run-free\"><rect x=\"275\" y=\"55\" width=\"210\" height=\"55\" rx=\"9\" fill=\"#ffffff\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"89.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Free memory</text></g><g data-node=\"run-process\"><rect x=\"275\" y=\"110\" width=\"210\" height=\"110\" rx=\"9\" fill=\"#fff0d2\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"172\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">One user process</text></g><g data-node=\"run-shell\"><rect x=\"275\" y=\"220\" width=\"210\" height=\"80\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"254.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Command</text><text x=\"380\" y=\"279.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">interpreter</text></g><g data-node=\"run-kernel\"><rect x=\"275\" y=\"300\" width=\"210\" height=\"65\" rx=\"9\" fill=\"#e4f2e5\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"339.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Kernel</text></g><g data-node=\"bsd-d\"><rect x=\"525\" y=\"55\" width=\"210\" height=\"50\" rx=\"9\" fill=\"#fff0d2\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"630\" y=\"87\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Process D</text></g><g data-node=\"bsd-free\"><rect x=\"525\" y=\"105\" width=\"210\" height=\"40\" rx=\"9\" fill=\"#ffffff\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"630\" y=\"132\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Free memory</text></g><g data-node=\"bsd-c\"><rect x=\"525\" y=\"145\" width=\"210\" height=\"55\" rx=\"9\" fill=\"#fff0d2\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"630\" y=\"179.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Process C</text></g><g data-node=\"bsd-shell\"><rect x=\"525\" y=\"200\" width=\"210\" height=\"55\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"630\" y=\"234.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Interpreter</text></g><g data-node=\"bsd-b\"><rect x=\"525\" y=\"255\" width=\"210\" height=\"45\" rx=\"9\" fill=\"#fff0d2\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"630\" y=\"284.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Process B</text></g><g data-node=\"bsd-kernel\"><rect x=\"525\" y=\"300\" width=\"210\" height=\"65\" rx=\"9\" fill=\"#e4f2e5\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"630\" y=\"339.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Kernel</text></g></g></svg>",
      "steps": [
        {
          "id": "os-11-memory-comparison-step-1",
          "title": "Startup snapshot",
          "detail": "في بداية مثال MS-DOS، Kernel وCommand interpreter موجودين، وباقي المساحة المرسومة فاضية.",
          "focus": [
            "dos-free",
            "dos-shell",
            "dos-kernel"
          ]
        },
        {
          "id": "os-11-memory-comparison-step-2",
          "title": "Program snapshot",
          "detail": "عند تشغيل برنامج، Process تاخد جزء من الذاكرة المتاحة. دي مقارنة حالتين، مش زمن محسوب.",
          "focus": [
            "run-free",
            "run-process",
            "run-shell",
            "run-kernel"
          ]
        },
        {
          "id": "os-11-memory-comparison-step-3",
          "title": "Multitasking comparison",
          "detail": "FreeBSD المثال فيه B وC وD مع Interpreter وKernel. موجودين مع بعض، لكن مين على CPU دلوقتي مش ظاهر.",
          "focus": [
            "bsd-d",
            "bsd-c",
            "bsd-b",
            "bsd-shell",
            "bsd-kernel"
          ]
        }
      ]
    }
  ]
};if(typeof module==='object'&&module.exports)module.exports=lesson;else root.OSPilotLesson=lesson;})(typeof window!=='undefined'?window:globalThis);
