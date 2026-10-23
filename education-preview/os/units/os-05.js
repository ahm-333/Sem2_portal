(function(root){'use strict';const lesson={
  "id": "os-05",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "1",
  "title": "Processors, cores and clusters",
  "subtitle": "أكتر من CPU؟ أكتر من Core؟ ولا أكتر من كمبيوتر؟",
  "sources": [
    {
      "id": "current-ch1",
      "title": "Chapter 1 · Introduction",
      "driveId": "14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M",
      "url": "https://drive.google.com/file/d/14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M/view",
      "sha256": "c81ae8d50d261ffbd4c78ebf75b42f3f980c50298bba19b32f5779b3d1745e7b",
      "slides": [
        17,
        18,
        19,
        20,
        21
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-05-multiprocessors",
      "title": "More processors can share the work",
      "eyebrow": "01 · نفهمها بمثال",
      "summary": "Multiprocessor systems use multiple processors in a closely connected system.",
      "paragraphs": [
        "لو عندك أكتر من <bdi lang=\"en\">General-purpose processor</bdi> في نفس النظام، ده <bdi lang=\"en\">Multiprocessor system</bdi>. السلايد بيسمّيه كمان <bdi lang=\"en\">Parallel</bdi> أو <bdi lang=\"en\">Tightly coupled system</bdi>. وجود معالج مخصوص لجهاز معيّن مش هو نفس فكرة إضافة General-purpose processor.",
        "الفوايد المذكورة: <bdi lang=\"en\">Increased throughput</bdi> يعني شغل أكتر يخلص في فترة؛ <bdi lang=\"en\">Economy of scale</bdi> يعني مشاركة بعض الموارد بدل تكرار نظام كامل؛ وزيادة الاعتمادية، زي استمرار جزء من الخدمة عند فشل جزء. ده بيعتمد على التصميم، مش ضمان إن أي عطل يعدّي من غير تأثير.",
        "في <bdi lang=\"en\">Asymmetric multiprocessing</bdi> لكل Processor دور أو مهمة محددة، وقد يبقى فيه Master بينظّم الشغل. في <bdi lang=\"en\">Symmetric multiprocessing (SMP)</bdi> المعالجات تقدر تؤدي نفس أنواع المهام؛ مش معناها إنهم بينفّذوا نفس التعليمة في نفس اللحظة."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            17
          ]
        }
      ],
      "clarification": "الجملة عن انتشار Single processor وازدياد Multiprocessors بتوصف سياق مصدر 2013، مش إحصائية عن الأجهزة الحالية. Throughput الأعلى مش وعد إن برنامج واحد يخلص أسرع بنفس النسبة."
    },
    {
      "id": "os-05-core-boundaries",
      "title": "A core is not a complete separate computer",
      "eyebrow": "02 · نفهمها بمثال",
      "summary": "A multicore design places multiple execution cores on one chip.",
      "paragraphs": [
        "بص لسلايد 18: فيه CPU₀ وCPU₁ وCPU₂، لكل واحد <bdi lang=\"en\">Registers</bdi> و<bdi lang=\"en\">Cache</bdi>، ومتصلين بذاكرة مشتركة. ده مثال <bdi lang=\"en\">SMP</bdi>؛ الرسم بيبيّن مين بيشارك الذاكرة.",
        "سلايد 19 بيحط <bdi lang=\"en\">Core 0</bdi> و<bdi lang=\"en\">Core 1</bdi> جوّه إطار Chip واحد: ده <bdi lang=\"en\">Dual-core</bdi>. كل Core في الرسم له Registers وCache وبيتوصّلوا للـMemory. وجود اتنين Core في Chip مش معناه اتنين كمبيوتر مستقلين.",
        "فرّق كمان بين <bdi lang=\"en\">Multicore</bdi>، و<bdi lang=\"en\">Multi-chip</bdi> اللي فيه أكتر من Chip، و<bdi lang=\"en\">Chassis</bdi> ممكن يجمع أنظمة منفصلة. إطار العلبة لوحده ما يقولش إنهم كلهم Core في نفس Chip."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            18,
            19
          ]
        }
      ],
      "clarification": "ده تصميم توضيحي من السلايد. مش كل تصميم Cache لازم يكون مطابق له؛ المهم حدود Core وChip والنظام."
    },
    {
      "id": "os-05-cluster",
      "title": "A cluster connects separate systems",
      "eyebrow": "03 · نفهمها بمثال",
      "summary": "Clustered systems coordinate multiple computers to provide a service or parallel computation.",
      "paragraphs": [
        "في <bdi lang=\"en\">Cluster</bdi>، الأطراف أنظمة كمبيوتر منفصلة اسمها <bdi lang=\"en\">Nodes</bdi>، متوصلة بـ<bdi lang=\"en\">Interconnect</bdi>. سلايد 21 بيبيّن كمان <bdi lang=\"en\">Storage-area network (SAN)</bdi> يوصلهم بتخزين مشترك. ده مختلف عن Coreين جوّه Chip واحدة.",
        "هدف ممكن يكون <bdi lang=\"en\">High availability</bdi>: الخدمة تستمر لو Node فشلت. في <bdi lang=\"en\">Asymmetric clustering</bdi> فيه جهاز <bdi lang=\"en\">Hot standby</bdi> مستني ياخد الدور. في <bdi lang=\"en\">Symmetric clustering</bdi> أكتر من Node بتشغّل Applications وبتراقب بعضها. دول مصطلحات Clustering؛ ما تخلطهمش بتقسيم مهام Processors في Multiprocessing.",
        "في <bdi lang=\"en\">High-performance computing (HPC)</bdi> بنستخدم Cluster لحسابات كبيرة. البرامج لازم تكون مكتوبة تستفيد من <bdi lang=\"en\">Parallelization</bdi>. توصيل كمبيوترات ببعضه لوحده مش هيخلّي أي برنامج يتقسّم تلقائيًا."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            20,
            21
          ]
        }
      ],
      "clarification": "التخزين المشترك عبر SAN هو التنظيم المعتاد المذكور في السلايد، مش شرط تعريف كل Cluster. استمرار الخدمة يحتاج إعداد ومراقبة وتعامل مناسب مع الأعطال."
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-05-smp-work",
      "type": "mcq",
      "placement": "os-05-multiprocessors",
      "objective": "Interpret symmetric multiprocessing without lockstep confusion.",
      "prerequisites": [
        "os-05-multiprocessors"
      ],
      "prompt": "In SMP, what does “each processor performs all tasks” mean in this introductory comparison?",
      "options": [
        {
          "id": "os-05-smp-work-3",
          "text": "Each processor is necessarily a separate networked computer"
        },
        {
          "id": "os-05-smp-work-1",
          "text": "Processors can perform the same types of work"
        },
        {
          "id": "os-05-smp-work-2",
          "text": "Every processor must execute the identical instruction at the same instant"
        }
      ],
      "correctOptionId": "os-05-smp-work-1",
      "feedback": {
        "os-05-smp-work-1": "صح؛ ده مقابل إسناد دور خاص لكل Processor في Asymmetric multiprocessing.",
        "os-05-smp-work-2": "Symmetric مش معناها Lockstep؛ المعالجات تقدر تشتغل على مهام مختلفة.",
        "os-05-smp-work-3": "ده يخلط SMP بالـCluster؛ المثال هنا Processors في نظام متقارب وذاكرة مشتركة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            17,
            18
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-05-core-is-node",
      "type": "true-false",
      "placement": "os-05-core-boundaries",
      "objective": "Distinguish dual-core chips from clusters.",
      "prerequisites": [
        "os-05-core-boundaries"
      ],
      "prompt": "The two cores in the slide’s dual-core chip are two complete independent cluster computers.",
      "options": [
        {
          "id": "os-05-core-is-node-true",
          "text": "True · صح"
        },
        {
          "id": "os-05-core-is-node-false",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-05-core-is-node-false",
      "feedback": {
        "os-05-core-is-node-true": "غلط؛ دول Coreين في Chip واحدة. Cluster بيربط أنظمة كمبيوتر منفصلة.",
        "os-05-core-is-node-false": "صح اختيارك؛ حدود Chip في سلايد 19 مختلفة عن حدود Computer nodes في سلايد 21."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            19,
            21
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-05-cluster-standby",
      "type": "mcq",
      "placement": "os-05-cluster",
      "objective": "Recognize asymmetric clustering.",
      "prerequisites": [
        "os-05-cluster"
      ],
      "prompt": "A service runs on one computer while another waits in hot-standby mode. Which source description fits?",
      "options": [
        {
          "id": "os-05-cluster-standby-2",
          "text": "Symmetric clustering with every node running applications"
        },
        {
          "id": "os-05-cluster-standby-3",
          "text": "Two cores inside one chip"
        },
        {
          "id": "os-05-cluster-standby-1",
          "text": "Asymmetric clustering"
        }
      ],
      "correctOptionId": "os-05-cluster-standby-1",
      "feedback": {
        "os-05-cluster-standby-1": "صح؛ Node مستنية تتولى الدور لو احتجناها.",
        "os-05-cluster-standby-2": "ده التنظيم اللي فيه Nodes متعددة شغّالة وبتراقب بعضها؛ مش وصف جهاز Standby هنا.",
        "os-05-cluster-standby-3": "دي حدود Multicore، مش جهازين مستقلين أحدهم Standby."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            20
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-05-hpc-requirement",
      "type": "mcq",
      "placement": "os-05-cluster",
      "objective": "Recognize the application requirement for parallel HPC.",
      "prerequisites": [
        "os-05-cluster"
      ],
      "prompt": "What is needed for an application to exploit an HPC cluster’s parallel computation?",
      "options": [
        {
          "id": "os-05-hpc-requirement-3",
          "text": "All nodes must be cores on the same chip"
        },
        {
          "id": "os-05-hpc-requirement-1",
          "text": "The application must be designed to use parallelization"
        },
        {
          "id": "os-05-hpc-requirement-2",
          "text": "No software change is ever needed because a network divides all code"
        }
      ],
      "correctOptionId": "os-05-hpc-requirement-1",
      "feedback": {
        "os-05-hpc-requirement-1": "صح؛ وجود Nodes أكتر لوحده مش بيقسّم أي برنامج تلقائيًا.",
        "os-05-hpc-requirement-2": "الشبكة بتوصل Nodes؛ تقسيم الحساب يحتاج برنامج يستفيد من Parallelization.",
        "os-05-hpc-requirement-3": "Cluster مكوّن من أنظمة منفصلة؛ شرط Chip واحدة مش في تعريفه."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            20,
            21
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-05-throughput",
      "type": "true-false",
      "placement": "os-05-multiprocessors",
      "objective": "Distinguish system throughput from single-job speed.",
      "prerequisites": [
        "os-05-multiprocessors"
      ],
      "prompt": "A potential increase in throughput guarantees that every individual program finishes twice as fast.",
      "options": [
        {
          "id": "os-05-throughput-true",
          "text": "True · صح"
        },
        {
          "id": "os-05-throughput-false",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-05-throughput-false",
      "feedback": {
        "os-05-throughput-true": "غلط؛ Throughput هو كمية الشغل في فترة. تسريع برنامج معيّن بيعتمد على الشغل والتصميم ومش مضمون بنسبة ثابتة.",
        "os-05-throughput-false": "بالضبط؛ Throughput الأعلى لا يثبت تسريع كل برنامج مرتين."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            17
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
      "id": "os-05-glossary-processor",
      "term": "General-purpose processor",
      "translation": "معالج لمهام عامة",
      "definition": "A processor capable of executing varied program workloads.",
      "explanation": "نفرّقه عن معالج مخصص لجهاز أو وظيفة محددة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            17
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-multiprocessor",
      "term": "Multiprocessor system",
      "translation": "نظام فيه أكتر من معالج",
      "definition": "A closely connected computer system using multiple processors.",
      "explanation": "السلايد بيسمّيه كمان Parallel أو Tightly coupled.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            17
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-throughput",
      "term": "Throughput",
      "translation": "كمية الشغل اللي بتخلص في فترة",
      "definition": "The amount of work completed per unit of time.",
      "explanation": "مش هو نفس زمن انتهاء برنامج واحد.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            17
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-scale",
      "term": "Economy of scale",
      "translation": "توفير من مشاركة الموارد",
      "definition": "Cost benefit from sharing resources rather than duplicating complete systems.",
      "explanation": "زي مشاركة بعض مكونات النظام بين Processors.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            17
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-reliability",
      "term": "Graceful degradation / fault tolerance",
      "translation": "استمرار بخدمة أقل أو تحمّل عطل",
      "definition": "Approaches to keeping a system useful when components fail.",
      "explanation": "دي فوايد محتملة حسب التصميم، مش حصانة من أي عطل.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            17
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-smp",
      "term": "Symmetric multiprocessing (SMP)",
      "translation": "معالجات تقدر تؤدي نفس أنواع المهام",
      "definition": "Multiprocessing in which processors can perform the same classes of tasks.",
      "explanation": "مش لازم كل Processor يعمل نفس التعليمة في نفس الوقت.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            17,
            18
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-amp",
      "term": "Asymmetric multiprocessing",
      "translation": "معالجات بأدوار محددة",
      "definition": "Multiprocessing that assigns particular roles or tasks to processors.",
      "explanation": "ممكن يبقى فيه Master؛ ده غير Hot standby في Clustering.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            17
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-core",
      "term": "Core / multicore",
      "translation": "وحدة تنفيذ وأكتر من وحدة في Chip",
      "definition": "A core is an execution unit; a multicore chip contains multiple such cores.",
      "explanation": "سلايد 19 فيه Coreين جوّه إطار Chip واحدة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            19
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-multichip",
      "term": "Multi-chip",
      "translation": "أكتر من شريحة",
      "definition": "An organization using multiple processor chips.",
      "explanation": "Chip مش هي نفسها Core ولا كمبيوتر Cluster كامل.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            19
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-chassis",
      "term": "Chassis",
      "translation": "هيكل أو علبة تجمع مكوّنات",
      "definition": "A physical enclosure that may house multiple separate systems.",
      "explanation": "وجود أنظمة في نفس العلبة مش دليل إنهم Coreين في Chip واحدة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            19
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-cluster",
      "term": "Cluster / node",
      "translation": "مجموعة أنظمة متعاونة وعضو منها",
      "definition": "A cluster coordinates separate computer systems; each member is a node.",
      "explanation": "كل Node كمبيوتر مستقل، وبينهم Interconnect.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            20,
            21
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-interconnect",
      "term": "Interconnect",
      "translation": "وصلة بين الأنظمة",
      "definition": "A communication connection linking cluster computers.",
      "explanation": "الخط بين Computers في سلايد 21.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            21
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-san",
      "term": "Storage-area network (SAN)",
      "translation": "شبكة توصيل بالتخزين",
      "definition": "A network providing access to storage shared by nodes in the source example.",
      "explanation": "المثال بيربط أكتر من Computer بتخزين مشترك.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            20,
            21
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-ha",
      "term": "High availability / hot standby",
      "translation": "استمرار الخدمة وجهاز جاهز للاحتياط",
      "definition": "Availability aims to keep a service accessible; hot standby waits ready to take over.",
      "explanation": "Asymmetric cluster في السلايد فيه Node مستنية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            20
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-symmetric-cluster",
      "term": "Symmetric clustering",
      "translation": "عُقد شغّالة وبتراقب بعض",
      "definition": "Clustering with multiple nodes running applications and monitoring one another.",
      "explanation": "مختلف عن Symmetric multiprocessing رغم تشابه الاسم.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            20
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-hpc",
      "term": "HPC / parallelization",
      "translation": "حسابات عالية الأداء وتقسيم الشغل",
      "definition": "High-performance computing can divide application work across cooperating resources.",
      "explanation": "البرنامج لازم يكون مكتوب يستفيد من التقسيم.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            20
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-05-glossary-register-cache",
      "term": "Registers / cache",
      "translation": "تخزين صغير قريب من التنفيذ",
      "definition": "Small storage structures close to CPU execution in the source diagrams.",
      "explanation": "مرسومين لكل Processor أو Core في أمثلة السلايدات.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            18,
            19
          ]
        }
      ],
      "kind": "prerequisite"
    }
  ],
  "visualizations": [
    {
      "id": "os-05-architecture-boundaries",
      "conceptId": "os-05-core-boundaries",
      "title": "Execution cores versus separate cluster nodes",
      "description": "قارن الإطارات: يسار Chip واحدة؛ يمين كمبيوترات منفصلة وخط اتصال.",
      "legend": "الإطار الكبير يسار هو Chip واحدة، والـCoreين جواه. خطوط الذاكرة واتصال الشبكة بلا رؤوس لأنها وصلات، مش تسلسل تنفيذ. إطار كل Cluster node يمثّل كمبيوتر مستقل. الرسم مثال تنظيمي، مش رسم Scale أو تفاصيل Cache لكل منصة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            18,
            19,
            20,
            21
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 400\" role=\"img\"><defs><marker id=\"arrow\" markerWidth=\"9\" markerHeight=\"9\" refX=\"8\" refY=\"4\" orient=\"auto\"><path d=\"M0 0 L8 4 L0 8 Z\" fill=\"#315e72\"/></marker></defs><rect width=\"760\" height=\"400\" fill=\"#f8fbfc\"/><g data-node=\"chip\"><rect x=\"20\" y=\"65\" width=\"340\" height=\"230\" rx=\"14\" fill=\"#eef0fd\" stroke=\"#616799\" stroke-width=\"3\"/><text x=\"40\" y=\"100\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">One dual-core chip</text></g><g data-node=\"core0\"><rect x=\"40\" y=\"125\" width=\"140\" height=\"130\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"110\" y=\"172\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Core 0</text><text x=\"110\" y=\"197\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Registers</text><text x=\"110\" y=\"222\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Cache</text></g><g data-node=\"core1\"><rect x=\"200\" y=\"125\" width=\"140\" height=\"130\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"270\" y=\"172\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Core 1</text><text x=\"270\" y=\"197\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Registers</text><text x=\"270\" y=\"222\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Cache</text></g><path d=\"M110 255 V310 H270 V255 M190 310 V335\" fill=\"none\" stroke=\"#315e72\" stroke-width=\"3\"/><g data-node=\"shared-memory\"><rect x=\"80\" y=\"340\" width=\"230\" height=\"50\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"195\" y=\"372\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Shared memory</text></g><g data-node=\"node-a\"><rect x=\"420\" y=\"80\" width=\"145\" height=\"105\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"492.5\" y=\"127\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Computer A</text><text x=\"492.5\" y=\"152\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Own CPU/RAM</text></g><g data-node=\"node-b\"><rect x=\"595\" y=\"80\" width=\"145\" height=\"105\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"667.5\" y=\"127\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Computer B</text><text x=\"667.5\" y=\"152\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Own CPU/RAM</text></g><g data-node=\"interconnect\"><path d=\"M565 132 H595\" stroke=\"#315e72\" stroke-width=\"3\"/><text x=\"420\" y=\"45\" fill=\"#163745\" font-size=\"18\" font-family=\"Arial, sans-serif\">Cluster nodes: interconnect</text></g><path d=\"M490 185 V290 H670 V185 M580 290 V320\" fill=\"none\" stroke=\"#315e72\" stroke-width=\"3\"/><g data-node=\"san\"><rect x=\"440\" y=\"325\" width=\"280\" height=\"65\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"580\" y=\"364.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Shared storage via SAN</text></g><text x=\"20\" y=\"35\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Compare organization boundaries</text></svg>",
      "steps": [
        {
          "id": "os-05-architecture-boundaries-step-1",
          "title": "One chip, two cores",
          "detail": "Core 0 وCore 1 جوّه نفس Chip. الذاكرة المشتركة مرسومة برّه إطار الـChip.",
          "focus": [
            "chip",
            "core0",
            "core1",
            "shared-memory"
          ]
        },
        {
          "id": "os-05-architecture-boundaries-step-2",
          "title": "Separate nodes",
          "detail": "Computer A وB كل واحد نظام مستقل له CPU وMemory، بينهم Interconnect.",
          "focus": [
            "node-a",
            "node-b",
            "interconnect"
          ]
        },
        {
          "id": "os-05-architecture-boundaries-step-3",
          "title": "Shared cluster storage",
          "detail": "SAN بتوصل Nodes بالتخزين المشترك في مثال المحاضرة؛ الشبكة مش بتحوّلهم لـCoreين في نفس Chip.",
          "focus": [
            "san",
            "node-a",
            "node-b"
          ]
        }
      ]
    }
  ]
};if(typeof module==='object'&&module.exports)module.exports=lesson;else root.OSPilotLesson=lesson;})(typeof window!=='undefined'?window:globalThis);
