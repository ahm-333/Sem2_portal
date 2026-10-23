(function(root){'use strict';const lesson={
  "id": "os-08",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "1",
  "title": "Management responsibilities and data movement",
  "subtitle": "إدارة البرامج وMemory والملفات، وتتبع أحدث نسخة من البيانات.",
  "sources": [
    {
      "id": "current-ch1",
      "title": "Chapter 1 · Introduction",
      "driveId": "14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M",
      "url": "https://drive.google.com/file/d/14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M/view",
      "sha256": "c81ae8d50d261ffbd4c78ebf75b42f3f980c50298bba19b32f5779b3d1745e7b",
      "slides": [
        26,
        27,
        28,
        29,
        30
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-08-process-management",
      "title": "The OS manages process activity",
      "eyebrow": "01 · نفهمها بمثال",
      "summary": "Process management includes lifetime, suspension, coordination and communication.",
      "paragraphs": [
        "فاتح برنامجين بيشتغلوا مع بعض. الـOS مش بس بيبدأهم: <bdi lang=\"en\">Process management</bdi> تشمل إنشاء وحذف User وSystem processes، وكمان <bdi lang=\"en\">Suspend / resume</bdi> يعني إيقاف نشاط Process مؤقتًا ثم السماح بتكملته. الإيقاف المؤقت مش حذف.",
        "لو Processes محتاجة ترتّب وصولها لشغل مشترك، الـOS يوفّر آليات <bdi lang=\"en\">Synchronization</bdi>. ولو محتاجة تبعت بيانات أو رسائل لبعض، يوفّر <bdi lang=\"en\">Communication</bdi>. دول وظيفتان مختلفتان حتى لو استخدمناهم مع بعض.",
        "الـOS كمان بيوفّر آليات <bdi lang=\"en\">Deadlock handling</bdi>: التعامل مع وضع Processes فيه مستنية موارد من بعض ومش قادرة تتقدّم. دي خريطة مسؤوليات من السلايد؛ مش شرح خوارزميات الحل."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            26
          ]
        }
      ]
    },
    {
      "id": "os-08-memory-management",
      "title": "Track, allocate and move memory",
      "eyebrow": "02 · نفهمها بمثال",
      "summary": "Memory management decides what is in memory, where it is and when it is needed.",
      "paragraphs": [
        "علشان CPU ينفّذ البرنامج، التعليمات المطلوبة وبياناتها لازم تكون في Memory وقت الاستخدام. مش شرط البرنامج والبيانات كلها تبقى موجودة مرة واحدة.",
        "الـ<bdi lang=\"en\">Memory management</bdi> تتبّع أي أجزاء مستخدمة ومين بيستخدمها، وتقرّر إيه يدخل أو يخرج، وتعمل <bdi lang=\"en\">Allocation</bdi> لمساحة مطلوبة و<bdi lang=\"en\">Deallocation</bdi> لما ما نحتاجهاش. الهدف يشمل استغلال CPU واستجابة المستخدم.",
        "لو برنامج قفل، تحرير مساحة Memory الخاصة بيه مش معناه حذف ملفاته المحفوظة. Memory management وFile-system management ليهم مسؤوليات مختلفة."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            27
          ]
        }
      ]
    },
    {
      "id": "os-08-file-management",
      "title": "Files hide physical storage details",
      "eyebrow": "03 · نفهمها بمثال",
      "summary": "The OS exposes logical files and directories over devices with different physical properties.",
      "paragraphs": [
        "إنت بتفتح <bdi lang=\"en\">notes.txt</bdi> بالاسم، مش بتطلب Track وSector بنفسك. الـOS بيوفّر <bdi lang=\"en\">File</bdi> كوحدة منطقية، والـ<bdi lang=\"en\">File system</bdi> يربطها بالمكان الفعلي في Secondary storage. وسائط التخزين بتختلف في السرعة والسعة ومعدل النقل وطريقة الوصول.",
        "الملفات غالبًا بتتنظّم في <bdi lang=\"en\">Directories</bdi>. إدارة File system تشمل إنشاء وحذف Files وDirectories، وعمليات التعامل معاهم، وربط Files بوسيط التخزين، وعمل <bdi lang=\"en\">Backup</bdi> على تخزين Nonvolatile.",
        "الـ<bdi lang=\"en\">Access control</bdi> يحدد مين يقدر يوصل لإيه في أغلب الأنظمة، مش إن أي برنامج يقرأ أي ملف بحرّيته. وكلمة Nonvolatile معناها الاحتفاظ من غير طاقة؛ مش إنها نسخة Backup تلقائيًا أو إنها ما تتلفش.",
        "<bdi lang=\"en\">Sequential access</bdi> بيعدّي على البيانات بترتيبها؛ <bdi lang=\"en\">Random access</bdi> يسمح بطلب موضع معين من غير قراءة كل اللي قبله. السلايد بيذكرهم كاختلافات بين الوسائط، مش إن كل وسيلة تدعم نفس طريقة الوصول."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            28
          ]
        }
      ]
    },
    {
      "id": "os-08-storage-performance",
      "title": "Compare properties, not timeless benchmark numbers",
      "eyebrow": "04 · نفهمها بمثال",
      "summary": "Access time, bandwidth and capacity answer different questions about storage.",
      "paragraphs": [
        "سلايد 29 بيقارن Registers وCache وMain memory وSSD وMagnetic disk. <bdi lang=\"en\">Access time</bdi> هو وقت الوصول لطلب، و<bdi lang=\"en\">Bandwidth</bdi> كمية البيانات المنقولة في فترة، و<bdi lang=\"en\">Capacity</bdi> مساحة التخزين. سرعة بدء طلب مش هي نفس معدل نقل بيانات كتير.",
        "جدول المصدر من كتاب 2013؛ الأرقام والمقاسات وتقنيات التنفيذ أمثلة تعليمية في سياقه، مش مواصفات حديثة ولا حدود قصوى للأجهزة. هنا نتعلّم المقارنة بين الخصائص من غير حفظ الأرقام كحقيقة ثابتة.",
        "الحركة بين المستويات ممكن تبقى <bdi lang=\"en\">Explicit</bdi> بطلب واضح في البرنامج، أو <bdi lang=\"en\">Implicit</bdi> تتعمل تلقائيًا تحت الواجهة، زي جلب بيانات للـCache. جدول “Managed by” تبسيط للمستويات، مش معنى إن جهة واحدة وحدها مسؤولة عن كل تفصيلة."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            29
          ]
        }
      ],
      "clarification": "تصحيح لخلية في المصدر: سلايد 29 كاتب Main memory = CMOS SRAM؛ ما تحفظهاش كقاعدة عامة. الذاكرة الرئيسية المعتادة في أغلب أجهزة الكمبيوتر بتستخدم DRAM، والـSRAM شائع في Cache المعالج. ده توضيح للخلية، مش موضوع امتحان جديد؛ الأسئلة هنا على خصائص التخزين وحركة البيانات.",
      "clarificationSource": {
        "title": "Samsung Semiconductor · DRAM and SRAM roles",
        "url": "https://semiconductor.samsung.com/dram/"
      }
    },
    {
      "id": "os-08-data-copies",
      "title": "Using a fast copy must not mean using a stale copy",
      "eyebrow": "05 · نفهمها بمثال",
      "summary": "Data can have multiple copies; execution must observe the appropriate current value.",
      "paragraphs": [
        "سلايد 30 يتتبّع القيمة <bdi lang=\"en\">A</bdi> من Disk إلى Main memory إلى Cache إلى Register. ده مسار قراءة مبسّط يوضّح إن نفس المعلومة ممكن يبقى ليها نسخ في كذا مستوى. مش لازم كل قراءة تبدأ من Disk لو نسخة صالحة موجودة بالفعل.",
        "في <bdi lang=\"en\">Multitasking</bdi> لازم إدارة النسخ تمنع استخدام قيمة قديمة غلط. وفي <bdi lang=\"en\">Multiprocessor</bdi>، <bdi lang=\"en\">Cache coherency</bdi> في Hardware بتنسّق نسخ البيانات بين Caches؛ مش شرط كل Cache تحتفظ بكل البيانات أو تتحدّث كلها فورًا. ممكن نسخة قديمة تتعلّم إنها غير صالحة قبل الاستخدام.",
        "في <bdi lang=\"en\">Distributed environment</bdi> النسخ ممكن تكون في كمبيوترات مختلفة، فالموضوع أعقد. السلايد بيأجّل الحلول لفصل تاني؛ المطلوب دلوقتي تعرف المشكلة، مش نفترض إن Cache coherency داخل جهاز بتحل كل نسخ الشبكة."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            30
          ]
        }
      ],
      "clarification": "توضيح Coherency يمنع القراءة الحرفية لعبارة “all CPUs have the most recent value in their cache” كأن كل Cache لازم تحتوي كل قيمة طول الوقت. ما بنقدّمش هنا بروتوكول تنفيذ أو ضمانًا لترتيب كل العمليات المتزامنة."
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-08-management-map",
      "type": "mcq",
      "placement": "os-08-memory-management",
      "objective": "Match memory allocation to the correct responsibility.",
      "prerequisites": [
        "os-08-memory-management"
      ],
      "prompt": "The OS records which process owns a used memory region and frees it when no longer needed. Which responsibility is this?",
      "options": [
        {
          "id": "os-08-management-map-3",
          "text": "Formatting text inside Word"
        },
        {
          "id": "os-08-management-map-1",
          "text": "Memory management"
        },
        {
          "id": "os-08-management-map-2",
          "text": "File-name creation only"
        }
      ],
      "correctOptionId": "os-08-management-map-1",
      "feedback": {
        "os-08-management-map-1": "صح؛ تتبّع الاستخدام وAllocation وDeallocation من مسؤوليات Memory management.",
        "os-08-management-map-2": "إنشاء اسم File من File-system management؛ هنا بنتكلم عن مساحة Memory.",
        "os-08-management-map-3": "تنسيق المستند وظيفة Application، مش تتبّع ملكية Memory بين Processes."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            27
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-08-suspend-delete",
      "type": "true-false",
      "placement": "os-08-process-management",
      "objective": "Distinguish suspending from deleting a process.",
      "prerequisites": [
        "os-08-process-management"
      ],
      "prompt": "Suspending a process necessarily deletes it, so it cannot later resume.",
      "options": [
        {
          "id": "os-08-suspend-delete-true",
          "text": "True · صح"
        },
        {
          "id": "os-08-suspend-delete-false",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-08-suspend-delete-false",
      "feedback": {
        "os-08-suspend-delete-true": "غلط؛ Suspend إيقاف مؤقت، وResume يكمل النشاط. Deletion مسؤولية مختلفة في نفس القائمة.",
        "os-08-suspend-delete-false": "بالضبط؛ الإيقاف المؤقت غير الحذف، وإلا Resume ما كانش هيبقى له معنى هنا."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            26
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-08-file-abstraction",
      "type": "mcq",
      "placement": "os-08-file-management",
      "objective": "Identify the logical file abstraction.",
      "prerequisites": [
        "os-08-file-management"
      ],
      "prompt": "Why can a user open notes.txt without specifying physical disk tracks?",
      "options": [
        {
          "id": "os-08-file-abstraction-2",
          "text": "Every file is permanently stored only in a CPU register"
        },
        {
          "id": "os-08-file-abstraction-3",
          "text": "A directory removes the need for any storage device"
        },
        {
          "id": "os-08-file-abstraction-1",
          "text": "The file system maps logical files onto secondary storage"
        }
      ],
      "correctOptionId": "os-08-file-abstraction-1",
      "feedback": {
        "os-08-file-abstraction-1": "صح؛ واجهة File بتخفي تفاصيل الوسيط، والـOS يدير الربط بالتخزين.",
        "os-08-file-abstraction-2": "Registers للتنفيذ وقليلين جدًا؛ مش تخزين دائم لكل ملفاتك.",
        "os-08-file-abstraction-3": "Directory طريقة تنظيم منطقية؛ البيانات لسه محتاجة تخزين."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            28
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-08-bandwidth-vs-latency",
      "type": "mcq",
      "placement": "os-08-storage-performance",
      "objective": "Distinguish access time from data-transfer rate.",
      "prerequisites": [
        "os-08-storage-performance"
      ],
      "prompt": "Which property describes how much data can be transferred per unit of time?",
      "options": [
        {
          "id": "os-08-bandwidth-vs-latency-3",
          "text": "Access time alone"
        },
        {
          "id": "os-08-bandwidth-vs-latency-1",
          "text": "Bandwidth"
        },
        {
          "id": "os-08-bandwidth-vs-latency-2",
          "text": "Capacity alone"
        }
      ],
      "correctOptionId": "os-08-bandwidth-vs-latency-1",
      "feedback": {
        "os-08-bandwidth-vs-latency-1": "صح؛ كمية بيانات لكل فترة. Access time عن زمن الوصول، وCapacity عن المساحة.",
        "os-08-bandwidth-vs-latency-2": "Capacity تقول مساحة التخزين، مش معدل النقل.",
        "os-08-bandwidth-vs-latency-3": "Access time زمن الوصول لطلب؛ مش كمية البيانات في الثانية."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            29
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-08-stale-copy",
      "type": "mcq",
      "placement": "os-08-data-copies",
      "objective": "Recognize the cache-coherency problem.",
      "prerequisites": [
        "os-08-data-copies"
      ],
      "prompt": "CPU 0 updates A, while CPU 1 holds an older cached copy. What must the system avoid?",
      "options": [
        {
          "id": "os-08-stale-copy-1",
          "text": "Using the stale copy as though it were the valid current value"
        },
        {
          "id": "os-08-stale-copy-2",
          "text": "Ever letting any CPU cache contain different addresses"
        },
        {
          "id": "os-08-stale-copy-3",
          "text": "Using cache at all because all cached data is permanently invalid"
        }
      ],
      "correctOptionId": "os-08-stale-copy-1",
      "feedback": {
        "os-08-stale-copy-1": "صح؛ وجود نسخة سريعة مش كفاية. Coherency تنسّق الصلاحية أو التحديث.",
        "os-08-stale-copy-2": "كل Cache مش لازم تحتوي نفس مجموعة العناوين؛ ده غير مشكلة صلاحية نسخ نفس البيانات.",
        "os-08-stale-copy-3": "Cache مفيدة لو النسخ صالحة. تغيير قيمة معينة مش معناه إن كل Cache بطلت للأبد."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            30
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-08-dated-table",
      "type": "true-false",
      "placement": "os-08-storage-performance",
      "objective": "Read dated numerical examples with appropriate limits.",
      "prerequisites": [
        "os-08-storage-performance"
      ],
      "prompt": "The 2013 slide’s example storage capacities establish permanent maximum capacities for all computers.",
      "options": [
        {
          "id": "os-08-dated-table-true",
          "text": "True · صح"
        },
        {
          "id": "os-08-dated-table-false",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-08-dated-table-false",
      "feedback": {
        "os-08-dated-table-true": "غلط؛ الأرقام أمثلة في سياق المصدر القديم، مش حدود دائمة ولا مواصفات حالية.",
        "os-08-dated-table-false": "صح اختيارك؛ نتعلم معنى المقارنة من غير تحويل أمثلة 2013 لحدود Hardware ثابتة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            29
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
      "id": "os-08-glossary-process",
      "term": "Process",
      "translation": "برنامج أثناء التنفيذ",
      "definition": "A program in execution.",
      "explanation": "الـOS يدير User وSystem processes.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            26
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-08-glossary-process-management",
      "term": "Process management",
      "translation": "إدارة نشاط البرامج أثناء التنفيذ",
      "definition": "OS responsibilities for creating, deleting, suspending and coordinating processes.",
      "explanation": "مش مجرد فتح البرنامج مرة وخلاص.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            26
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-suspend",
      "term": "Suspend / resume",
      "translation": "إيقاف مؤقت وتكملة",
      "definition": "Temporarily stop and later continue process activity.",
      "explanation": "مختلفين عن حذف Process.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            26
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-sync",
      "term": "Synchronization",
      "translation": "تنسيق ترتيب الشغل المشترك",
      "definition": "Mechanisms coordinating related process activities.",
      "explanation": "زي ترتيب الوصول لحاجة مشتركة؛ هنا بنتعلم الدور بس.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            26
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-communication",
      "term": "Process communication",
      "translation": "تبادل معلومات بين Processes",
      "definition": "Mechanisms for exchanging information between processes.",
      "explanation": "تبادل الرسائل غير مجرد ترتيب التنفيذ.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            26
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-deadlock",
      "term": "Deadlock",
      "translation": "انتظار متبادل يمنع التقدّم",
      "definition": "A condition in which processes cannot progress because of resource waits involving one another.",
      "explanation": "السلايد بيذكر مسؤولية التعامل معاه من غير خوارزمية هنا.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            26
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-memory-management",
      "term": "Memory management",
      "translation": "إدارة استخدام Memory",
      "definition": "Tracking memory use and deciding allocation and movement.",
      "explanation": "تحدد مين مستخدم إيه وإمتى نحتاج ندخل أو نخرج أجزاء.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            27
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-allocation",
      "term": "Allocation / deallocation",
      "translation": "حجز مساحة وتحريرها",
      "definition": "Assign memory space when needed and release it when no longer needed.",
      "explanation": "تحرير RAM مش حذف الملفات المحفوظة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            27
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-file",
      "term": "File",
      "translation": "وحدة منطقية للمعلومات",
      "definition": "A logical storage unit abstracting physical storage properties.",
      "explanation": "تفتحه باسمه بدل ما تختار موضعه المادي بنفسك.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            28
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-directory",
      "term": "Directory",
      "translation": "مجلد لتنظيم الملفات",
      "definition": "A structure organizing files and names.",
      "explanation": "إنشاء وحذف Directories ضمن إدارة File system.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            28
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-file-system",
      "term": "File-system management",
      "translation": "إدارة الملفات وربطها بالتخزين",
      "definition": "OS operations managing files, directories and their mapping to storage.",
      "explanation": "اسم الملف واجهة منطقية وراه تخزين فعلي.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            28
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-access-control",
      "term": "Access control",
      "translation": "تحديد مين له صلاحية الوصول",
      "definition": "Rules controlling who may access stored information.",
      "explanation": "وجود File مش تصريح لأي برنامج يقرأها.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            28
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-backup",
      "term": "Backup",
      "translation": "نسخة للحفظ والاسترجاع",
      "definition": "A separate saved copy supporting recovery of information.",
      "explanation": "Nonvolatile وحدها مش معناها إن Backup اتعمل.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            28
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-sequential-random",
      "term": "Sequential / random access",
      "translation": "وصول بالترتيب أو لموضع محدد",
      "definition": "Sequential access follows order; random access can address a chosen location.",
      "explanation": "الوسائط بتختلف في طريقة الوصول المدعومة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            28
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-access-time",
      "term": "Access time",
      "translation": "وقت الوصول لطلب",
      "definition": "The time required to access requested information.",
      "explanation": "غير معدل نقل بيانات كتير خلال فترة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            29
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-bandwidth",
      "term": "Bandwidth",
      "translation": "معدل نقل البيانات",
      "definition": "The amount of data transferred per unit of time.",
      "explanation": "زي كمية بيانات في الثانية؛ مش سعة التخزين.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            29
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-capacity",
      "term": "Capacity",
      "translation": "مساحة التخزين",
      "definition": "The amount of information a storage level can hold.",
      "explanation": "مساحة أكبر مش دليل وحده على وقت وصول أقل.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            29
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-explicit-implicit",
      "term": "Explicit / implicit movement",
      "translation": "نقل بطلب واضح أو تحت الواجهة",
      "definition": "Movement requested directly or performed automatically beneath an interface.",
      "explanation": "البرنامج مش لازم يطلب كل حركة Cache بنفسه.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            29
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-register",
      "term": "Register",
      "translation": "ذاكرة صغيرة داخل CPU",
      "definition": "A small CPU storage location used near instruction execution.",
      "explanation": "آخر مستوى في مسار قراءة A المرسوم.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            29,
            30
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-cache",
      "term": "Cache",
      "translation": "تخزين أسرع لنسخ بيانات",
      "definition": "A faster store holding copies from another storage level.",
      "explanation": "النسخة لازم تبقى صالحة، مش بس سريعة الوصول.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            29,
            30
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-08-glossary-memory",
      "term": "Main memory",
      "translation": "ذاكرة العمل الرئيسية",
      "definition": "Working storage containing instructions and data needed for execution.",
      "explanation": "بين Disk وCache في الرسم المبسّط.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            27,
            29,
            30
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-08-glossary-nonvolatile",
      "term": "Nonvolatile storage",
      "translation": "تخزين يحتفظ بالمحتوى من غير طاقة",
      "definition": "Storage that retains information without continuous power.",
      "explanation": "مش ضمان ضد التلف ولا بديل تلقائي للـBackup.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            28
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-08-glossary-coherency",
      "term": "Cache coherency",
      "translation": "تنسيق صلاحية نسخ Cache",
      "definition": "Hardware coordination of cached copies of shared data in a multiprocessor system.",
      "explanation": "تمنع الاعتماد على نسخة قديمة غير صالحة؛ مش شرط كل Cache فيها كل قيمة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            30
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-distributed",
      "term": "Distributed environment",
      "translation": "أنظمة كمبيوتر متصلة مع بعض",
      "definition": "An environment in which information or work spans multiple computer systems.",
      "explanation": "نسخ A ممكن تبقى في أجهزة مختلفة، وحلولها خارج الجزء ده.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            30
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-08-glossary-multitasking",
      "term": "Multitasking / multiprocessor",
      "translation": "تبديل مهام أو استخدام معالجات متعددة",
      "definition": "Multitasking shares execution among tasks; multiprocessor systems have multiple processors.",
      "explanation": "النسخ محتاجة إدارة في الحالتين، لكن المصطلحين مش نفس المعنى.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            30
          ]
        }
      ],
      "kind": "prerequisite"
    }
  ],
  "visualizations": [
    {
      "id": "os-08-data-migration",
      "conceptId": "os-08-data-copies",
      "title": "Reading A through the storage levels",
      "description": "في البداية نفترض إن A مش في المستويات الأسرع؛ كل سهم بيعمل نسخة متاحة للمستوى التالي.",
      "legend": "الأسهم حركة نسخة A ناحية التنفيذ في مثال قراءة مبسّط، مش نقل القيمة وحذف كل اللي قبلها. نفترض إن النسخ صالحة ومفيش كتابة متزامنة أثناء المسار. لو Cache فيها نسخة صالحة، مش لازم نبدأ من Disk. الرسم مش Benchmark ولا بروتوكول Coherency.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            29,
            30
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 400\" role=\"img\"><defs><marker id=\"arrow\" markerWidth=\"9\" markerHeight=\"9\" refX=\"8\" refY=\"4\" orient=\"auto\"><path d=\"M0 0 L8 4 L0 8 Z\" fill=\"#315e72\"/></marker></defs><rect width=\"760\" height=\"400\" fill=\"#f8fbfc\"/><text x=\"25\" y=\"50\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Illustrative read: A is initially only on disk</text><g data-node=\"disk\"><rect x=\"25\" y=\"120\" width=\"145\" height=\"110\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"97.5\" y=\"169.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Disk</text><text x=\"97.5\" y=\"194.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">A</text></g><path d=\"M170 175 L215 175\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><text x=\"192.5\" y=\"166\" text-anchor=\"middle\" font-size=\"18\" font-family=\"Arial, sans-serif\" fill=\"#163745\">copy</text><g data-node=\"memory\"><rect x=\"220\" y=\"120\" width=\"160\" height=\"110\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"300\" y=\"169.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Main memory</text><text x=\"300\" y=\"194.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">A</text></g><path d=\"M380 175 L425 175\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><text x=\"402.5\" y=\"166\" text-anchor=\"middle\" font-size=\"18\" font-family=\"Arial, sans-serif\" fill=\"#163745\">copy</text><g data-node=\"cache\"><rect x=\"430\" y=\"120\" width=\"135\" height=\"110\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"497.5\" y=\"169.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Cache</text><text x=\"497.5\" y=\"194.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">A</text></g><path d=\"M565 175 L610 175\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><text x=\"587.5\" y=\"166\" text-anchor=\"middle\" font-size=\"18\" font-family=\"Arial, sans-serif\" fill=\"#163745\">copy</text><g data-node=\"register\"><rect x=\"615\" y=\"120\" width=\"120\" height=\"110\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"675\" y=\"169.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Register</text><text x=\"675\" y=\"194.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">A</text></g><text x=\"25\" y=\"295\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Copies may coexist across levels</text><text x=\"25\" y=\"335\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Before reuse: is this copy still valid?</text></svg>",
      "steps": [
        {
          "id": "os-08-data-migration-step-1",
          "title": "Bring data into memory",
          "detail": "A محفوظة على Disk؛ نجهّز نسخة في Main memory في المثال.",
          "focus": [
            "disk",
            "memory"
          ]
        },
        {
          "id": "os-08-data-migration-step-2",
          "title": "Use faster levels",
          "detail": "البيانات تتاح عبر Cache ثم Register قريب من تنفيذ التعليمة؛ مش بنحذف تلقائيًا النسخ اللي قبلها.",
          "focus": [
            "memory",
            "cache",
            "register"
          ]
        },
        {
          "id": "os-08-data-migration-step-3",
          "title": "Check freshness",
          "detail": "وجود نسخ كتير مع تغيير البيانات يخلّي صحة النسخة مهمة. النسخة الأسرع مش مفيدة لو قديمة وغير صالحة.",
          "focus": [
            "cache",
            "register"
          ]
        }
      ]
    },
    {
      "id": "os-08-coherence-problem",
      "conceptId": "os-08-data-copies",
      "title": "A stale copy must not be used as current",
      "description": "مثال تعليمي: CPU 0 كتب A=2، وCPU 1 عنده نسخة أقدم A=1.",
      "legend": "الأرقام قيم بيانات افتراضية مش زمنًا. السهم المتقطّع يعبّر عن تنسيق Hardware بين Caches، مش شرح رسالة بروتوكول معيّن. الإطار الأصفر حالة يجب التعامل معها؛ لازم تمنع استخدام النسخة القديمة كأنها الحالية. لا يفترض الرسم أن جميع Caches تحتفظ بكل قيمة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            30
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 400\" role=\"img\"><defs><marker id=\"arrow\" markerWidth=\"9\" markerHeight=\"9\" refX=\"8\" refY=\"4\" orient=\"auto\"><path d=\"M0 0 L8 4 L0 8 Z\" fill=\"#315e72\"/></marker></defs><rect width=\"760\" height=\"400\" fill=\"#f8fbfc\"/><g data-node=\"writer\"><rect x=\"35\" y=\"70\" width=\"300\" height=\"125\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"185\" y=\"127\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">CPU 0 writes A = 2</text><text x=\"185\" y=\"152\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">New cached value</text></g><g data-node=\"stale\"><rect x=\"425\" y=\"70\" width=\"300\" height=\"125\" rx=\"12\" fill=\"#fff0ce\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"575\" y=\"127\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">CPU 1 cached A = 1</text><text x=\"575\" y=\"152\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Older copy: not current</text></g><path d=\"M335 130 L420 130\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\" stroke-dasharray=\"7 5\"/><text x=\"377.5\" y=\"121\" text-anchor=\"middle\" font-size=\"18\" font-family=\"Arial, sans-serif\" fill=\"#163745\">coordinate</text><g data-node=\"resolve\"><rect x=\"100\" y=\"280\" width=\"560\" height=\"80\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"380\" y=\"327\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Update or invalidate stale copy before reuse</text></g><path d=\"M575 195 L575 275\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><text x=\"35\" y=\"245\" fill=\"#163745\" font-size=\"18\" font-family=\"Arial, sans-serif\">Problem shown; no specific protocol assumed</text></svg>",
      "steps": [
        {
          "id": "os-08-coherence-problem-step-1",
          "title": "A value changes",
          "detail": "CPU 0 كتب قيمة جديدة في المثال؛ مش كل النسخ القديمة تبقى صالحة كده تلقائيًا.",
          "focus": [
            "writer",
            "stale"
          ]
        },
        {
          "id": "os-08-coherence-problem-step-2",
          "title": "Coordinate the copies",
          "detail": "Cache coherency تنسّق صلاحية النسخ؛ القديمة تتحدّث أو ما تتستخدمش قبل جلب قيمة مناسبة.",
          "focus": [
            "stale",
            "resolve"
          ]
        },
        {
          "id": "os-08-coherence-problem-step-3",
          "title": "Keep the scope clear",
          "detail": "ده داخل نظام Multiprocessor. إدارة النسخ بين كمبيوترات موزعة أوسع من الرسم ده.",
          "focus": [
            "writer",
            "resolve"
          ]
        }
      ]
    }
  ]
};if(typeof module==='object'&&module.exports)module.exports=lesson;else root.OSPilotLesson=lesson;})(typeof window!=='undefined'?window:globalThis);
