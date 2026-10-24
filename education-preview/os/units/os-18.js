(function(root) {
  'use strict';
  const lesson = {
  "id": "os-18",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "3",
  "title": "Create, replace, wait and terminate",
  "subtitle": "اتبع Parent وChild؛ فرّق بين Process جديدة وProgram جديد جوا نفس Process.",
  "sources": [
    {
      "id": "current-ch3",
      "title": "Chapter 3 · Processes",
      "driveId": "1h7se1OzceqGrKcmWtsOpb09WDBGuJT9s",
      "url": "https://drive.google.com/file/d/1h7se1OzceqGrKcmWtsOpb09WDBGuJT9s/view",
      "sha256": "7501cd4c2e06b1c09fedc2e7788d47df86786c263f68e0e268dc887c1b73444b",
      "slides": [
        18,
        19,
        20,
        21,
        22,
        23,
        24
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-18-family",
      "title": "Process creation and process trees",
      "eyebrow": "01 · مين أنشأ مين؟",
      "summary": "Creation establishes parent–child relationships, identified by PIDs.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            18,
            19
          ]
        }
      ],
      "paragraphs": [
        "OS لازم يوفّر طريقة لإنشاء Process وإنهائها. لما Process تنشئ واحدة تانية، الأولى Parent والتانية Child. لو Child أنشأت غيرها، العلاقات دي تعمل Process tree. PID يميّز العملية؛ مش لازم تحفظ أرقام شجرة Linux المرسومة في سلايد 19.",
        "مشاركة الموارد ممكن تكون كلها أو جزء منها أو مفيش، حسب النموذج والآلية. وفي التنفيذ Parent وChild ممكن يتقدموا بالتزامن، أو Parent يستنى Child. Concurrent مش شرط نفس اللحظة على CPU واحدة.",
        "مفيش في السلايد خطوة إنشاء واحدة نقدر نعمم إنها أول خطوة داخل كل OS. هنا بنتعلم العلاقات والاختيارات اللي المصدر عرضها."
      ]
    },
    {
      "id": "os-18-fork-exec",
      "title": "UNIX/POSIX: fork creates; exec replaces",
      "eyebrow": "02 · إنشاء مختلف عن استبدال",
      "summary": "fork creates a child; a successful exec replaces the caller’s program image.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            20,
            21
          ]
        }
      ],
      "paragraphs": [
        "في مثال UNIX/POSIX، fork() ينشئ Child. عند النجاح يرجّع Child PID للـParent، ويرجّع 0 داخل Child. الاتنين بيكملوا بعد fork لكن في عمليتين مختلفتين. عند الفشل يرجّع قيمة سالبة ومفيش Child اتكوّنت من الطلب ده.",
        "Child بتبدأ بنسخة من حالة البرنامج ضمن نموذج الإنشاء، لكن مش مطابقة تمامًا للـParent: ليها PID مختلف ونتيجة fork مختلفة. اسم duplicate في السلايد مش معناه إن كل الصفات واحدة.",
        "exec يستبدل Program image للـProcess اللي نادته. لو Child نادت exec بنجاح، نفس Child PID يكمل ببرنامج جديد. exec لا ينشئ Child جديدة، ومش لازم دايمًا يسبقه fork.",
        "في كود سلايد 21، Child تنفّذ execlp لتشغيل /bin/ls. النجاح مايرجعش للكود القديم بعد exec. لو exec فشل، ممكن يرجع؛ السلايد مختصر ومش بيعرض معالجة الفشل دي. هنا بنقرأ الكود، مش بنشغّل أوامر على جهازك."
      ]
    },
    {
      "id": "os-18-wait",
      "title": "Read the parent branch and wait",
      "eyebrow": "03 · Parent يكمل إمتى؟",
      "summary": "wait can collect a child’s termination status; it need not always block.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            21,
            23,
            24
          ]
        }
      ],
      "paragraphs": [
        "في سلايد 21، Parent يدخل الفرع اللي نتيجة fork فيه موجبة، وينادي wait(NULL)، وبعده يطبع Child Complete. نفترض إن إنشاء Child نجح وإن Parent عنده Child واحدة في المثال، وإن wait نجحت.",
        "لو Child لسه شغّالة، wait ممكن يوقف Parent لحد انتهاء Child. لو Child خلصت بالفعل وحالتها لسه متاحة، wait ممكن يرجع فورًا. في سلايد 24، wait(&status) بيرجع PID للـChild المنتهية ويقدّم معلومات الحالة.",
        "ترتيب تشغيل Parent وChild بعد fork مش مضمون من الكود وحده. اللي نقدر نستنتجه في المثال الناجح إن طباعة Parent بعد wait الناجحة تأتي بعد انتهاء Child؛ مش إن Parent لازم يبدأ أو Child لازم تبدأ الأول."
      ]
    },
    {
      "id": "os-18-windows",
      "title": "Read the Windows API example",
      "eyebrow": "04 · نفس الهدف بواجهة مختلفة",
      "summary": "The Windows example creates a process and then waits on its process handle.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            22
          ]
        }
      ],
      "paragraphs": [
        "سلايد 22 بيعرض Windows API: يجهّز STARTUPINFO وPROCESS_INFORMATION، وبعدين CreateProcess يطلب تشغيل برنامج. لو الإنشاء فشل يدخل مسار رسالة الخطأ ويرجع؛ ده مثال مستقل عن fork.",
        "عند النجاح، المثال يستنى انتهاء العملية باستخدام WaitForSingleObject على Process handle، وبعدها يقفل الـHandles بـCloseHandle. Process handle مرجع للنظام؛ مش هو Child PID المتغيّر اللي شفناه في كود UNIX.",
        "مسار mspaint الموجود في الصورة جزء من مثال السلايد، مش وعد بوجوده على كل Windows ولا تمرين تنفيذ هنا. تفاصيل Windows وUNIX مختلفة؛ ماينفعش نعمم fork على كل OS."
      ]
    },
    {
      "id": "os-18-termination",
      "title": "Finishing and requesting termination",
      "eyebrow": "05 · إنهاء العملية مش انتظارها",
      "summary": "The OS reclaims process resources; termination policy depends on the system.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            23,
            24
          ]
        }
      ],
      "paragraphs": [
        "Process ممكن تخلص وتطلب من OS إنهاءها باستخدام exit في نموذج السلايد. OS يسترجع موارد التنفيذ، ومعلومات الحالة ممكن يقرأها Parent عبر wait. إنهاء Child وقراءة نتيجتها خطوتين مختلفتين.",
        "Parent قد يطلب إنهاء Child لو عدّت حدود مواردها أو المهمة مابقتش مطلوبة. السلايد بيسمي الإجراء abort بشكل عام؛ مانتعاملش مع الاسم ده كواجهة موحدة لإنهاء Child على كل منصة.",
        "بعض الأنظمة حسب السلايد تمنع استمرار الأبناء بعد نهاية Parent: Cascading termination يشمل الأبناء والأحفاد. دي سياسة لبعض الأنظمة، مش نتيجة إجبارية في كل OS."
      ]
    },
    {
      "id": "os-18-zombie-orphan",
      "title": "Correct the compressed zombie/orphan wording",
      "eyebrow": "06 · خلصت ولا لسه شغّالة؟",
      "summary": "A zombie is terminated and unreaped; an orphan has lost its original parent.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            24
          ]
        }
      ],
      "paragraphs": [
        "تصحيح لصياغة سلايد 24 المختصرة، في نموذج UNIX المعتاد للاحتفاظ بحالة Child: Zombie هي Child انتهت ولسه Parent ماجمعش حالة انتهائها. اللي فاضل معلومات Kernel بسيطة، مش Process شغّالة بتنفّذ البرنامج.",
        "Child لسه حية وParent ماعملش wait لحد دلوقتي؟ دي مش Zombie لمجرد إن wait مااتنادتش. لازم تفرّق بين انتهاء Child وعدم جمع حالتها.",
        "Orphan عادة Child حية مات الـParent الأصلي بتاعها. في Linux بتتربط بـParent بديل زي init أو Subreaper؛ مش شرط دائمًا PID 1. ده غير Zombie، ودي مش قاعدة إن كل Parent يموت لازم Child تتقتل.",
        "التصحيح هنا يمنع الخلط في التعريفات؛ مش بنضيف تفاصيل Signals أو قواعد خاصة لم يشرحها المصدر."
      ]
    }
  ],
  "visualizations": [
    {
      "id": "os-18-fork-timeline",
      "conceptId": "os-18-fork-exec",
      "title": "UNIX example: fork → exec → exit → wait returns",
      "description": "كل سطر Process مختلفة بعد fork، ونفس Child تفضل بنفس PID بعد exec.",
      "legend": "نفترض fork وexec وwait كلهم نجحوا، وParent ليها Child واحدة. P وC رموز PID مختلفة وليست أرقام قياس. اتجاه السهم لليمين ترتيب أحداث؛ السهم بين السطرين إنشاء أو إخطار انتهاء، مش مشاركة ذاكرة. Parent تنادي wait قبل انتهاء Child في هذا المسار الممكن فقط؛ العرض مش زمن فعلي.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            20,
            21,
            23,
            24
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 820 510\" role=\"img\" aria-label=\"UNIX example: fork → exec → exit → wait returns\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"8\" markerHeight=\"8\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#24516c\"/></marker></defs><rect width=\"820\" height=\"510\" fill=\"#ffffff\"/><g font-family=\"Arial, sans-serif\" fill=\"#17394e\"><text x=\"25\" y=\"40\" text-anchor=\"start\" font-size=\"20\">Educational success path · not a guaranteed scheduler order</text><text x=\"25\" y=\"100\" text-anchor=\"start\" font-size=\"20\">Parent PID P</text><text x=\"265\" y=\"300\" text-anchor=\"start\" font-size=\"20\">Child PID C</text><g data-node=\"fork\"><rect x=\"25\" y=\"135\" width=\"180\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"115\" y=\"163\" text-anchor=\"middle\" font-size=\"20\">fork() succeeds</text><text x=\"115\" y=\"189\" text-anchor=\"middle\" font-size=\"20\">P receives C</text></g><g data-node=\"wait\"><rect x=\"265\" y=\"135\" width=\"205\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"367.5\" y=\"163\" text-anchor=\"middle\" font-size=\"20\">wait()</text><text x=\"367.5\" y=\"189\" text-anchor=\"middle\" font-size=\"20\">Parent blocked here</text></g><g data-node=\"resume\"><rect x=\"590\" y=\"135\" width=\"210\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"695\" y=\"163\" text-anchor=\"middle\" font-size=\"20\">wait returns C</text><text x=\"695\" y=\"189\" text-anchor=\"middle\" font-size=\"20\">Parent continues</text></g><g data-node=\"child\"><rect x=\"25\" y=\"335\" width=\"180\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"115\" y=\"363\" text-anchor=\"middle\" font-size=\"20\">Child starts</text><text x=\"115\" y=\"389\" text-anchor=\"middle\" font-size=\"20\">fork returns 0</text></g><g data-node=\"exec\"><rect x=\"265\" y=\"335\" width=\"205\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"367.5\" y=\"363\" text-anchor=\"middle\" font-size=\"20\">exec succeeds</text><text x=\"367.5\" y=\"389\" text-anchor=\"middle\" font-size=\"20\">New image · PID C</text></g><g data-node=\"exit\"><rect x=\"590\" y=\"335\" width=\"210\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"695\" y=\"363\" text-anchor=\"middle\" font-size=\"20\">Child exits</text><text x=\"695\" y=\"389\" text-anchor=\"middle\" font-size=\"20\">Status available</text></g><g data-node=\"parent-wait\"><path d=\"M205 170 L265 170\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g><g data-node=\"fork-child\"><path d=\"M115 205 L115 335\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"180\" y=\"270\" text-anchor=\"middle\" font-size=\"18\">create child</text></g><g data-node=\"child-exec\"><path d=\"M205 370 L265 370\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g><g data-node=\"exec-exit\"><path d=\"M470 370 L590 370\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g><g data-node=\"exit-wait\"><path d=\"M695 335 L695 205\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"750\" y=\"275\" text-anchor=\"middle\" font-size=\"18\">status</text></g><text x=\"410\" y=\"465\" text-anchor=\"middle\" font-size=\"20\">exec replaces the caller; it does not create a third process.</text></g></svg>",
      "steps": [
        {
          "id": "os-18-fork-timeline-step-1",
          "title": "fork succeeds",
          "detail": "PID P وPID C مختلفين. Parent بتشوف C كنتيجة fork، وChild بتشوف 0.",
          "focus": [
            "fork",
            "fork-child",
            "child"
          ]
        },
        {
          "id": "os-18-fork-timeline-step-2",
          "title": "Two independent paths",
          "detail": "في المسار ده Parent نادت wait وهي مستنية Child. ترتيب التشغيل الأول مش مضمون.",
          "focus": [
            "parent-wait",
            "wait",
            "child"
          ]
        },
        {
          "id": "os-18-fork-timeline-step-3",
          "title": "Replace the child image",
          "detail": "Child تشغّل exec بنجاح؛ البرنامج يتغيّر لكن نفس PID C يفضل موجود.",
          "focus": [
            "child-exec",
            "exec"
          ]
        },
        {
          "id": "os-18-fork-timeline-step-4",
          "title": "Finish and collect",
          "detail": "Child تنتهي، وwait الناجحة ترجع للـParent بحالتها؛ بعدها Parent تكمل.",
          "focus": [
            "exec-exit",
            "exit",
            "exit-wait",
            "resume"
          ]
        }
      ]
    },
    {
      "id": "os-18-termination-cases",
      "conceptId": "os-18-zombie-orphan",
      "title": "Two different events: child exit and parent exit",
      "description": "قارن حدثين منفصلين بدل ما تربط أي غياب لـwait بكلمة Zombie.",
      "legend": "كل صف حالة مستقلة في نموذج UNIX المعتاد. الأسهم ترتيب أحداث؛ الألوان للتفريق فقط. صف Zombie يفترض الاحتفاظ بحالة الطفل لحد جمعها، وصف Orphan يفترض بقاء Child حية بعد نهاية Parent. لا يعمّم الشكل سياسة Cascading termination أو إعادة الأبوة على كل OS.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            24
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 820 440\" role=\"img\" aria-label=\"Two different events: child exit and parent exit\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"8\" markerHeight=\"8\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#24516c\"/></marker></defs><rect width=\"820\" height=\"440\" fill=\"#ffffff\"/><g font-family=\"Arial, sans-serif\" fill=\"#17394e\"><text x=\"25\" y=\"40\" text-anchor=\"start\" font-size=\"20\">Case A: child terminates before its status is collected</text><g data-node=\"child-exit\"><rect x=\"25\" y=\"75\" width=\"220\" height=\"75\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"135\" y=\"103\" text-anchor=\"middle\" font-size=\"20\">Child terminates</text><text x=\"135\" y=\"129\" text-anchor=\"middle\" font-size=\"20\">Execution finished</text></g><g data-node=\"zombie\"><rect x=\"300\" y=\"75\" width=\"220\" height=\"75\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"410\" y=\"103\" text-anchor=\"middle\" font-size=\"20\">Zombie</text><text x=\"410\" y=\"129\" text-anchor=\"middle\" font-size=\"20\">Status not collected</text></g><g data-node=\"reaped\"><rect x=\"575\" y=\"75\" width=\"220\" height=\"75\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"685\" y=\"103\" text-anchor=\"middle\" font-size=\"20\">Parent collects status</text><text x=\"685\" y=\"129\" text-anchor=\"middle\" font-size=\"20\">Child reaped</text></g><g data-node=\"to-zombie\"><path d=\"M245 112 L300 112\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g><g data-node=\"to-reaped\"><path d=\"M520 112 L575 112\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g><text x=\"25\" y=\"235\" text-anchor=\"start\" font-size=\"20\">Case B: original parent terminates while child remains alive</text><g data-node=\"parent-exit\"><rect x=\"25\" y=\"270\" width=\"220\" height=\"75\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"135\" y=\"298\" text-anchor=\"middle\" font-size=\"20\">Original parent exits</text></g><g data-node=\"orphan\"><rect x=\"300\" y=\"270\" width=\"220\" height=\"75\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"410\" y=\"298\" text-anchor=\"middle\" font-size=\"20\">Orphan</text><text x=\"410\" y=\"324\" text-anchor=\"middle\" font-size=\"20\">Child still alive</text></g><g data-node=\"new-parent\"><rect x=\"575\" y=\"270\" width=\"220\" height=\"75\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"685\" y=\"298\" text-anchor=\"middle\" font-size=\"20\">Linux: reparented</text><text x=\"685\" y=\"324\" text-anchor=\"middle\" font-size=\"20\">init or subreaper</text></g><g data-node=\"to-orphan\"><path d=\"M245 307 L300 307\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g><g data-node=\"to-parent\"><path d=\"M520 307 L575 307\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g></g></svg>",
      "steps": [
        {
          "id": "os-18-termination-cases-step-1",
          "title": "Zombie needs child termination",
          "detail": "المفتاح إن Child خلصت ولسه حالتها مااتجمعتش؛ مش مجرد إن Parent ماعملش wait.",
          "focus": [
            "child-exit",
            "to-zombie",
            "zombie"
          ]
        },
        {
          "id": "os-18-termination-cases-step-2",
          "title": "Collect the status",
          "detail": "في النموذج المعتاد Parent تجمع الحالة بانتظار ناجح، فيتم Reaping.",
          "focus": [
            "to-reaped",
            "reaped"
          ]
        },
        {
          "id": "os-18-termination-cases-step-3",
          "title": "Orphan is a different event",
          "detail": "Parent الأصلي انتهى وChild لسه حية؛ في Linux فيه Parent بديل، ومش شرط PID 1 في كل حالة.",
          "focus": [
            "parent-exit",
            "to-orphan",
            "orphan",
            "to-parent",
            "new-parent"
          ]
        }
      ]
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-18-fork-results",
      "type": "mcq",
      "placement": "os-18-fork-exec",
      "objective": "After successful fork(), what does the parent receive as the return value?",
      "prerequisites": [
        "os-18-fork-exec"
      ],
      "prompt": "After successful fork(), what does the parent receive as the return value?",
      "options": [
        {
          "id": "os-18-fork-results-o1",
          "text": "0"
        },
        {
          "id": "os-18-fork-results-o2",
          "text": "The new child’s PID"
        },
        {
          "id": "os-18-fork-results-o3",
          "text": "The parent’s own PID"
        }
      ],
      "correctOptionId": "os-18-fork-results-o2",
      "feedback": {
        "os-18-fork-results-o1": "0 هي النتيجة داخل Child؛ Parent بتاخد Child PID.",
        "os-18-fork-results-o2": "صح؛ Parent بتاخد PID الخاص بالـChild الجديدة، وChild بتاخد 0.",
        "os-18-fork-results-o3": "النتيجة داخل Parent هي PID بتاع Child، مش PID بتاع Parent نفسها."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
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
      "id": "os-18-exec-identity",
      "type": "mcq",
      "placement": "os-18-fork-exec",
      "objective": "Child PID C successfully calls exec. What changes?",
      "prerequisites": [
        "os-18-fork-exec"
      ],
      "prompt": "Child PID C successfully calls exec. What changes?",
      "options": [
        {
          "id": "os-18-exec-identity-o1",
          "text": "Its program image changes; PID C remains."
        },
        {
          "id": "os-18-exec-identity-o2",
          "text": "It creates another child PID automatically."
        },
        {
          "id": "os-18-exec-identity-o3",
          "text": "It becomes the parent process."
        }
      ],
      "correctOptionId": "os-18-exec-identity-o1",
      "feedback": {
        "os-18-exec-identity-o1": "صح؛ exec استبدال داخل نفس Caller. عملية الإنشاء كانت fork قبلها في المثال.",
        "os-18-exec-identity-o2": "exec الناجحة مش إنشاء Process؛ هي تحميل Program image جديدة داخل Caller.",
        "os-18-exec-identity-o3": "علاقة Parent وChild مش بتتبدل بمجرد exec؛ اللي بيتغير Program image."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
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
      "id": "os-18-fork-failure",
      "type": "mcq",
      "placement": "os-18-fork-exec",
      "objective": "In the slide’s code, fork returns a negative value. Which branch applies?",
      "prerequisites": [
        "os-18-fork-exec"
      ],
      "prompt": "In the slide’s code, fork returns a negative value. Which branch applies?",
      "options": [
        {
          "id": "os-18-fork-failure-o1",
          "text": "The child executes ls."
        },
        {
          "id": "os-18-fork-failure-o2",
          "text": "The parent waits for the newly created child."
        },
        {
          "id": "os-18-fork-failure-o3",
          "text": "The error branch reports failure; this call created no child."
        }
      ],
      "correctOptionId": "os-18-fork-failure-o3",
      "feedback": {
        "os-18-fork-failure-o1": "فرع Child نتيجته 0؛ القيمة السالبة هنا فشل إنشاء.",
        "os-18-fork-failure-o2": "مفيش Child جديدة من fork الفاشلة عشان يستناها في مسار النجاح.",
        "os-18-fork-failure-o3": "صح؛ القيمة السالبة تدخل فرع الخطأ، ومش بنفترض وجود Child من الطلب ده."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            21
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-18-wait-always-blocks",
      "type": "true-false",
      "placement": "os-18-wait",
      "objective": "A successful wait must always spend time blocked before returning.",
      "prerequisites": [
        "os-18-wait"
      ],
      "prompt": "A successful wait must always spend time blocked before returning.",
      "options": [
        {
          "id": "os-18-wait-always-blocks-o1",
          "text": "True · صح"
        },
        {
          "id": "os-18-wait-always-blocks-o2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-18-wait-always-blocks-o2",
      "feedback": {
        "os-18-wait-always-blocks-o1": "الانتظار الفعلي يعتمد على حالة Child؛ ممكن تكون خلصت قبل النداء.",
        "os-18-wait-always-blocks-o2": "غلط؛ لو Child انتهت وحالتها متاحة، wait ممكن ترجع فورًا بالمعلومات."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            21,
            24
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-18-windows-creation",
      "type": "mcq",
      "placement": "os-18-windows",
      "objective": "Which call creates the process in the slide’s Windows example?",
      "prerequisites": [
        "os-18-windows"
      ],
      "prompt": "Which call creates the process in the slide’s Windows example?",
      "options": [
        {
          "id": "os-18-windows-creation-o1",
          "text": "CreateProcess"
        },
        {
          "id": "os-18-windows-creation-o2",
          "text": "WaitForSingleObject"
        },
        {
          "id": "os-18-windows-creation-o3",
          "text": "CloseHandle"
        }
      ],
      "correctOptionId": "os-18-windows-creation-o1",
      "feedback": {
        "os-18-windows-creation-o1": "صح؛ CreateProcess طلب الإنشاء. الانتظار وإغلاق الـHandles وظائف منفصلة.",
        "os-18-windows-creation-o2": "WaitForSingleObject هنا ينتظر Process handle بعد إنشاء ناجح؛ مش الإنشاء نفسه.",
        "os-18-windows-creation-o3": "CloseHandle يقفل المراجع بعد استخدامها؛ مش طلب تشغيل Process."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
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
      "id": "os-18-live-zombie",
      "type": "true-false",
      "placement": "os-18-zombie-orphan",
      "objective": "A still-running child is a zombie simply because its parent has not called wait.",
      "prerequisites": [
        "os-18-zombie-orphan"
      ],
      "prompt": "A still-running child is a zombie simply because its parent has not called wait.",
      "options": [
        {
          "id": "os-18-live-zombie-o1",
          "text": "True · صح"
        },
        {
          "id": "os-18-live-zombie-o2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-18-live-zombie-o2",
      "feedback": {
        "os-18-live-zombie-o1": "لازم الطفل يكون انتهى أولًا. غياب wait لوحده مع Child حية لا يجعلها Zombie.",
        "os-18-live-zombie-o2": "غلط؛ Zombie في النموذج المعتاد Child انتهت ولسه حالتها مااتجمعتش."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
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
      "id": "os-18-orphan-case",
      "type": "mcq",
      "placement": "os-18-zombie-orphan",
      "objective": "A child remains alive after its original parent exits. What is the relevant introductory term?",
      "prerequisites": [
        "os-18-zombie-orphan"
      ],
      "prompt": "A child remains alive after its original parent exits. What is the relevant introductory term?",
      "options": [
        {
          "id": "os-18-orphan-case-o1",
          "text": "Zombie solely because wait was not called"
        },
        {
          "id": "os-18-orphan-case-o2",
          "text": "Orphan"
        },
        {
          "id": "os-18-orphan-case-o3",
          "text": "A successful exec"
        }
      ],
      "correctOptionId": "os-18-orphan-case-o2",
      "feedback": {
        "os-18-orphan-case-o1": "Zombie مرتبطة بانتهاء Child وعدم جمع حالتها؛ هنا Child لسه حية.",
        "os-18-orphan-case-o2": "صح؛ Orphan فقدت Parent الأصلي. في Linux تتربط بـParent بديل حسب النظام.",
        "os-18-orphan-case-o3": "exec يغير Program image للـCaller؛ مش اسم فقدان Parent."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
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
      "id": "os-18-cascading-universal",
      "type": "true-false",
      "placement": "os-18-termination",
      "objective": "Every operating system must terminate all children when a parent exits.",
      "prerequisites": [
        "os-18-termination"
      ],
      "prompt": "Every operating system must terminate all children when a parent exits.",
      "options": [
        {
          "id": "os-18-cascading-universal-o1",
          "text": "True · صح"
        },
        {
          "id": "os-18-cascading-universal-o2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-18-cascading-universal-o2",
      "feedback": {
        "os-18-cascading-universal-o1": "السلايد نفسه يقول Some operating systems؛ ماينفعش نعممها على كل منصة.",
        "os-18-cascading-universal-o2": "غلط؛ Cascading termination سياسة لبعض الأنظمة، مش قانون عام لكل OS."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            23,
            24
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-18-fork-order",
      "type": "mcq",
      "placement": "os-18-wait",
      "objective": "Assume fork and wait succeed, with one child. What ordering does the parent’s code establish?",
      "prerequisites": [
        "os-18-wait"
      ],
      "prompt": "Assume fork and wait succeed, with one child. What ordering does the parent’s code establish?",
      "options": [
        {
          "id": "os-18-fork-order-o1",
          "text": "The parent must execute before the child."
        },
        {
          "id": "os-18-fork-order-o2",
          "text": "The child must execute before the parent."
        },
        {
          "id": "os-18-fork-order-o3",
          "text": "The parent prints Child Complete after wait has collected the child’s termination."
        }
      ],
      "correctOptionId": "os-18-fork-order-o3",
      "feedback": {
        "os-18-fork-order-o1": "ترتيب الاختيار بعد fork مش مضمون من الكود؛ wait هي اللي بتحدد شرط الطباعة.",
        "os-18-fork-order-o2": "ممكن Parent يبدأ وينادي wait قبل Child؛ ترتيب البداية مش مضمون.",
        "os-18-fork-order-o3": "صح؛ في افتراض النجاح وChild واحدة، الطباعة بعد wait الناجحة مرتبطة بانتهاء Child."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            21
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
      "id": "os-18-term-parent-process",
      "term": "Parent process",
      "translation": "العملية المنشئة",
      "definition": "A process that creates a child process.",
      "explanation": "عملية أنشأت غيرها؛ ممكن تكمل أو تستنى حسب البرنامج والنظام.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            19
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-18-term-child-process",
      "term": "Child process",
      "translation": "العملية المنشأة",
      "definition": "A process created by another process.",
      "explanation": "ليها PID خاص، وممكن تنشئ أبناء تانيين.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            19,
            20
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-18-term-pid",
      "term": "PID",
      "translation": "معرّف العملية",
      "definition": "An identifier used to identify and manage a process.",
      "explanation": "رقم العملية؛ نفس اسم البرنامج ممكن يكون ليه أكتر من PID.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            19
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-18-term-process-tree",
      "term": "Process tree",
      "translation": "شجرة العمليات",
      "definition": "Parent–child creation relationships arranged as a tree.",
      "explanation": "الخطوط بتقول مين أنشأ مين، مش مين Running دلوقتي.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            19
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-18-term-fork",
      "term": "fork",
      "translation": "إنشاء طفل في UNIX",
      "definition": "A UNIX/POSIX operation creating a child process.",
      "explanation": "عند النجاح Parent تاخد Child PID، وChild تاخد 0.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            20,
            21
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-18-term-exec",
      "term": "exec",
      "translation": "استبدال برنامج العملية",
      "definition": "An operation replacing the calling process program image on success.",
      "explanation": "نفس Process ونفس PID، لكن تعليمات وبيانات البرنامج اتغيرت.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            20,
            21
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-18-term-program-image",
      "term": "Program image",
      "translation": "صورة البرنامج في العملية",
      "definition": "The program code and associated process memory contents used for execution.",
      "explanation": "exec تستبدل اللي العملية هتتنفّذه؛ مش بتنقلها لدور Parent.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            20
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-18-term-wait",
      "term": "wait",
      "translation": "انتظار وجمع حالة طفل",
      "definition": "An operation that can obtain a terminated child’s status and PID.",
      "explanation": "ممكن يستنى، أو يرجع فورًا لو الطفل خلص وحالته متاحة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            21,
            23,
            24
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-18-term-exit-status",
      "term": "Exit status",
      "translation": "حالة الانتهاء",
      "definition": "Information reporting how a process terminated.",
      "explanation": "Parent ممكن يعرف نتيجة انتهاء Child عبر wait.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            23,
            24
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-18-term-exit",
      "term": "exit",
      "translation": "إنهاء العملية",
      "definition": "The operation through which a process requests termination in the slide model.",
      "explanation": "العملية تخلص، وOS يسترجع مواردها مع إبقاء ما يلزم للحالة في النموذج.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            23
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-18-term-createprocess",
      "term": "CreateProcess",
      "translation": "إنشاء عملية في مثال Windows",
      "definition": "The Windows API operation used to create the process in the slide.",
      "explanation": "واجهة Windows في المثال؛ مش اسم تاني لـfork.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            22
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-18-term-process-handle",
      "term": "Process handle",
      "translation": "مرجع لعملية في Windows",
      "definition": "A reference used by the Windows example to wait on a process.",
      "explanation": "الكود بيستنى على pi.hProcess وبعدين يقفل الـHandle.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            22
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-18-term-zombie",
      "term": "Zombie",
      "translation": "طفل انتهى ولم تجمع حالته",
      "definition": "A terminated child whose status has not yet been reaped in the ordinary UNIX model.",
      "explanation": "مش برنامج لسه شغّال؛ الطفل خلص وفاضل سجل حالة بسيط.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            24
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-18-term-orphan",
      "term": "Orphan",
      "translation": "طفل فقد والده الأصلي",
      "definition": "A live child whose original parent has terminated.",
      "explanation": "في Linux بتتربط بـParent بديل؛ ده غير Zombie.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            24
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-18-term-reap",
      "term": "Reap",
      "translation": "جمع حالة الطفل المنتهي",
      "definition": "Collecting termination status so the retained child record can be released.",
      "explanation": "الطفل انتهى، وParent تجمع نتيجته في النموذج المعتاد.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            24
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-18-term-subreaper",
      "term": "Subreaper",
      "translation": "عملية بديلة لاستقبال الأبناء",
      "definition": "A Linux process that can become the parent of orphaned descendants.",
      "explanation": "ذكرناه بس عشان مانقولش إن Parent البديل لازم دايمًا PID 1.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            24
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-18-term-cascading-termination",
      "term": "Cascading termination",
      "translation": "إنهاء متتابع للأبناء",
      "definition": "Termination of a process’s descendants under a system policy described by the slide.",
      "explanation": "سياسة لبعض الأنظمة؛ مش حكم عام لكل OS.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            24
          ]
        }
      ],
      "kind": "source-concept"
    }
  ]
};
  if (typeof module === 'object' && module.exports) module.exports = lesson;
  if (typeof window !== 'undefined') window.OSPilotLesson = lesson;
})(typeof window !== 'undefined' ? window : globalThis);
