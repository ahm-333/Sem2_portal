(function(root){'use strict';const lesson={
  "id": "os-10",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "2",
  "title": "API وSystem calls: الطلب بيعدّي منين؟",
  "subtitle": "من read() وprintf() لحد Kernel · نتتبّع الطلب والنتيجة، ونفهم Parameters من غير حفظ أعمى.",
  "sources": [
    {
      "id": "current-ch2",
      "title": "Chapter 2 · Operating-System Structures",
      "driveId": "1DDEour98ioHVMAHbTVzHy_hfgR-zpaTW",
      "url": "https://drive.google.com/file/d/1DDEour98ioHVMAHbTVzHy_hfgR-zpaTW/view",
      "sha256": "7077be5a51357a7fd485d21111e7a296478f7dcfaf98985ccebcc998a349494e",
      "slides": [
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-10-api",
      "title": "API and system call: related, different",
      "eyebrow": "01 · البرنامج بيطلب الخدمة إزاي؟",
      "summary": "An API defines callable functions; system calls enter OS services.",
      "paragraphs": [
        "لو بتكتب برنامج يقرأ ملف، مش محتاج تكتب إدارة القرص بنفسك. <bdi lang=\"en\">API — Application Programming Interface</bdi> بتقولك أنهي <bdi lang=\"en\">Functions</bdi> متاحة، تبعتلها إيه من <bdi lang=\"en\">Parameters</bdi>، وتتوقع إيه من <bdi lang=\"en\">Return values</bdi>.",
        "الـ<bdi lang=\"en\">System call</bdi> واجهة برمجية لخدمة من OS. غالبًا البرنامج بيوصل للخدمة من خلال API عالية المستوى ومكتبة مساعدة. لكن مش كل <bdi lang=\"en\">API function</bdi> بتعمل System call مباشرة، ومش لازم العلاقة تبقى واحدة لواحدة.",
        "السلايد بيذكر <bdi lang=\"en\">Win32</bdi> لـWindows، و<bdi lang=\"en\">POSIX API</bdi> لأنظمة زي UNIX وLinux وMac OS X، و<bdi lang=\"en\">Java API</bdi> لبيئة <bdi lang=\"en\">JVM</bdi>. دي أمثلة من مصدر 2013؛ مش مواصفة لكل إصدار موجود دلوقتي. استخدام C أو C++ في الشرح مش شرط إن كل جزء من النظام مكتوب بنفس اللغة."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            6
          ]
        }
      ]
    },
    {
      "id": "os-10-read",
      "title": "Reading the read() interface",
      "eyebrow": "02 · اسم الدالة مش كفاية",
      "summary": "read() takes a descriptor, a destination buffer, and a maximum byte count.",
      "paragraphs": [
        "سلايد 7 بيعرض واجهة UNIX/Linux: <bdi lang=\"en\">ssize_t read(int fd, void *buf, size_t count)</bdi>. مش مطلوب تكتب الكود؛ اقرأ معنى كل جزء. <bdi lang=\"en\">fd</bdi> رقم يعرّف ملف مفتوح، <bdi lang=\"en\">buf</bdi> عنوان مساحة الذاكرة اللي هتستقبل البيانات، و<bdi lang=\"en\">count</bdi> أقصى عدد <bdi lang=\"en\">Bytes</bdi> عايز تقراه.",
        "مثال تعليمي: البرنامج مجهّز Buffer يسع 100 bytes وطلب <bdi lang=\"en\">read(fd, buf, 100)</bdi>. لو رجعت 40، يبقى اتقرت 40 bytes؛ مش لازم ترجع 100. الرقم هنا مثال للتفسير، مش قياس أداء.",
        "في مثال ملف عادي وطلب أكبر من صفر: رجوع 0 معناه وصلنا <bdi lang=\"en\">End of file (EOF)</bdi>؛ ورجوع -1 معناه خطأ. <bdi lang=\"en\">ssize_t</bdi> نوع النتيجة يقدر يمثل -1، و<bdi lang=\"en\">size_t</bdi> نوع عدد bytes المطلوب. السلايد بيعرض <bdi lang=\"en\">unistd.h</bdi> كملف التعريف المطلوب للواجهة.",
        "مهم نفرّق بين البيانات والنتيجة: البيانات بتتحط في buf، والرقم اللي بيرجع بيقول قد إيه اتقرا. مانفترضش إن القيمة الراجعة هي محتوى الملف."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            7
          ]
        }
      ]
    },
    {
      "id": "os-10-dispatch",
      "title": "Interface, call number and return",
      "eyebrow": "03 · من الطلب لتنفيذ Kernel",
      "summary": "A system-call number selects an implementation; results return to the caller.",
      "paragraphs": [
        "في نموذج سلايد 8، كل <bdi lang=\"en\">System call</bdi> ليها رقم، و<bdi lang=\"en\">System-call interface</bdi> تستخدمه علشان تختار المدخل المناسب في جدول. التنفيذ الفعلي للخدمة جوّه <bdi lang=\"en\">Kernel</bdi>. بعدها ترجع <bdi lang=\"en\">Status</bdi> وأي قيم ناتجة.",
        "سلايد 9 يرسم <bdi lang=\"en\">open()</bdi>: التطبيق يطلب، الواجهة توصل للتنفيذ، والنتيجة ترجع. <bdi lang=\"en\">Run-time support library</bdi> بتخفي تفاصيل كتير عن المبرمج؛ عليه يلتزم بالواجهة ويفهم النتيجة، مش يعرف كل تفاصيل Kernel.",
        "العبور من <bdi lang=\"en\">User mode</bdi> إلى <bdi lang=\"en\">Kernel mode</bdi> يغيّر مستوى الصلاحية. في الرسم التعليمي بنفترض إننا رجعنا لنفس البرنامج. العبور لوحده مش دليل إن OS شغّل <bdi lang=\"en\">Process</bdi> تانية؛ ده قرار منفصل."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            8,
            9
          ]
        }
      ]
    },
    {
      "id": "os-10-parameters",
      "title": "Three ways to pass parameters",
      "eyebrow": "04 · الطلب محتاج تفاصيل",
      "summary": "Arguments can be passed in registers, a memory block, or a stack.",
      "paragraphs": [
        "رقم الخدمة مش كفاية: قراءة ملف محتاجة ملف أنهي، نحط البيانات فين، ونقرأ قد إيه. سلايد 10 يعرض 3 طرق عامة لتمرير المعلومات دي للنظام.",
        "<bdi lang=\"en\">Registers</bdi>: تخزين القيم في مساحات صغيرة داخل CPU. سهل، لكن عددها محدود. <bdi lang=\"en\">Memory block / table</bdi>: نحط القيم في بلوك بالذاكرة، ونمرّر عنوان البلوك في Register. <bdi lang=\"en\">Stack</bdi>: البرنامج يدفع القيم <bdi lang=\"en\">Push</bdi> على Stack، والنظام ياخدها <bdi lang=\"en\">Pop</bdi> حسب الاتفاق.",
        "في سلايد 11، <bdi lang=\"en\">X</bdi> عنوان جدول Parameters، مش كل القيم متحشّرة في Register واحد. رقم <bdi lang=\"en\">System call 13</bdi> في الرسم مجرد مثال للسلايد؛ مش رقم ثابت لازم تحفظه لأي نظام.",
        "الـBlock والـStack مش مربوطين بعدد Registers المتاحة، لكن ده مش معناه ذاكرة بلا حدود. الطريقة الفعلية وعدد القيم وترتيبها حسب النظام والواجهة. ذكر Linux وSolaris في السلايد مثال المصدر، مش قاعدة واحدة لكل نداء ولكل معمارية."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            10,
            11
          ]
        }
      ]
    },
    {
      "id": "os-10-library",
      "title": "printf() is a library call",
      "eyebrow": "05 · المكتبة بتساعد قبل Kernel",
      "summary": "Library work may lead to a system call; the two calls are not identical.",
      "paragraphs": [
        "سلايد 12 بيعرض برنامج C بينادي <bdi lang=\"en\">printf(\"Greetings\")</bdi>. <bdi lang=\"en\">Standard C library</bdi> تتعامل مع طلب الإخراج، وفي المسار المرسوم تستخدم <bdi lang=\"en\">write()</bdi> علشان تطلب الكتابة من النظام.",
        "الـLibrary شغّالة هنا في <bdi lang=\"en\">User mode</bdi>؛ عبور الصلاحية عند دخول System call، مش بمجرد إنك ناديت printf. رسمة السلايد مختصرة، فرسمتنا بتوضح الحد ده صراحة.",
        "مانقولش إن كل printf لازم تعمل write واحدة فورًا. الـLibrary ممكن تجمع الإخراج مؤقتًا في <bdi lang=\"en\">Buffer</bdi>، فالتوقيت وعدد النداءات ممكن يختلفوا. الفكرة المطلوبة: API أو Library call مش هي نفسها تنفيذ Kernel، وممكن تستخدم خدمة منه."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            12
          ]
        }
      ]
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-10-api-contract",
      "type": "mcq",
      "placement": "os-10-api",
      "objective": "Identify what an API specifies.",
      "prerequisites": [
        "os-10-api"
      ],
      "prompt": "What does an API tell a programmer?",
      "options": [
        {
          "id": "os-10-api-contract-1",
          "text": "Every internal kernel algorithm"
        },
        {
          "id": "os-10-api-contract-2",
          "text": "Available functions, parameters, and expected return values"
        },
        {
          "id": "os-10-api-contract-3",
          "text": "The physical address of every device"
        },
        {
          "id": "os-10-api-contract-4",
          "text": "Only the graphical appearance of a window"
        }
      ],
      "correctOptionId": "os-10-api-contract-2",
      "feedback": {
        "os-10-api-contract-1": "الخوارزميات الداخلية ممكن تكون مخفية؛ API بتحدد طريقة استخدام الدوال.",
        "os-10-api-contract-2": "صح؛ الدوال والمدخلات والنتائج المتوقعة هي عقد استخدام API.",
        "os-10-api-contract-3": "API مش قائمة عناوين كل الأجهزة المادية.",
        "os-10-api-contract-4": "API مش مقصورة على واجهة رسومية؛ فيه دوال لخدمات كتير."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
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
      "id": "os-10-every-api",
      "type": "true-false",
      "placement": "os-10-api",
      "objective": "Reject a one-to-one API/system-call assumption.",
      "prerequisites": [
        "os-10-api"
      ],
      "prompt": "Every API function directly invokes exactly one system call.",
      "options": [
        {
          "id": "os-10-every-api-1",
          "text": "True · صح"
        },
        {
          "id": "os-10-every-api-2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-10-every-api-2",
      "feedback": {
        "os-10-every-api-1": "غلط؛ ممكن الدالة تشتغل في User mode، أو تستخدم أكتر من نداء. العلاقة مش شرط واحد لواحد.",
        "os-10-every-api-2": "صح؛ API بتحدد واجهة استخدام، مش ضمان إن كل دالة تعمل System call واحدة مباشرة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            6,
            12
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-10-short-read",
      "type": "mcq",
      "placement": "os-10-read",
      "objective": "Interpret a successful read result without confusing data and count.",
      "prerequisites": [
        "os-10-read"
      ],
      "prompt": "In the regular-file example, read(fd, buf, 100) returns 40. What does 40 mean?",
      "options": [
        {
          "id": "os-10-short-read-1",
          "text": "The file descriptor is 40"
        },
        {
          "id": "os-10-short-read-2",
          "text": "40 bytes were read into buf"
        },
        {
          "id": "os-10-short-read-3",
          "text": "40 bytes remain to be read"
        },
        {
          "id": "os-10-short-read-4",
          "text": "The buffer address is 40"
        }
      ],
      "correctOptionId": "os-10-short-read-2",
      "feedback": {
        "os-10-short-read-1": "fd مدخل مستقل؛ النتيجة هنا عدد bytes المقروءة.",
        "os-10-short-read-2": "صح؛ count حد أقصى، والنتيجة بتقول كام byte اتقرا فعلًا.",
        "os-10-short-read-3": "40 هنا عدد bytes اللي اتقرت فعلًا، مش الباقي. count=100 حد أقصى للطلب، مش طول الملف.",
        "os-10-short-read-4": "buf هو عنوان مساحة الذاكرة، لكن النتيجة عدد bytes المقروءة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
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
      "id": "os-10-read-error",
      "type": "mcq",
      "placement": "os-10-read",
      "objective": "Recognize the read error indicator.",
      "prerequisites": [
        "os-10-read"
      ],
      "prompt": "In this read() example, which return value indicates an error?",
      "options": [
        {
          "id": "os-10-read-error-1",
          "text": "0"
        },
        {
          "id": "os-10-read-error-2",
          "text": "A positive byte count"
        },
        {
          "id": "os-10-read-error-3",
          "text": "-1"
        },
        {
          "id": "os-10-read-error-4",
          "text": "The address of buf"
        }
      ],
      "correctOptionId": "os-10-read-error-3",
      "feedback": {
        "os-10-read-error-1": "مع Regular file وcount موجب، 0 معناها وصلنا لنهاية الملف؛ مؤشر الخطأ هنا -1.",
        "os-10-read-error-2": "القيمة الموجبة بتقول عدد bytes المقروءة، مش خطأ.",
        "os-10-read-error-3": "صح؛ -1 مؤشر خطأ في الواجهة المعروضة.",
        "os-10-read-error-4": "عنوان buf واحد من المدخلات؛ القيمة الراجعة -1 هي مؤشر الخطأ في المثال."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
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
      "id": "os-10-call-number",
      "type": "mcq",
      "placement": "os-10-dispatch",
      "objective": "Explain indexed system-call dispatch.",
      "prerequisites": [
        "os-10-dispatch"
      ],
      "prompt": "In the source implementation model, what is the system-call number used for?",
      "options": [
        {
          "id": "os-10-call-number-1",
          "text": "Selecting a table entry for the requested service"
        },
        {
          "id": "os-10-call-number-2",
          "text": "Providing the address of the parameter table"
        },
        {
          "id": "os-10-call-number-3",
          "text": "Replacing the caller with another process every time"
        },
        {
          "id": "os-10-call-number-4",
          "text": "Counting the bytes already read"
        }
      ],
      "correctOptionId": "os-10-call-number-1",
      "feedback": {
        "os-10-call-number-1": "صح؛ الواجهة تستخدم الرقم كـIndex للمدخل المناسب في جدول النداءات.",
        "os-10-call-number-2": "رقم النداء بيختار مدخل الخدمة. عنوان جدول المعاملات X حاجة تانية بتقول البيانات موجودة فين.",
        "os-10-call-number-3": "الرقم بيحدد الخدمة. تغيير Process مش لازم يحصل مع كل System call.",
        "os-10-call-number-4": "عدد bytes نتيجة محتملة لقراءة؛ رقم النداء يحدد الخدمة نفسها."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            8,
            9
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-10-same-process",
      "type": "true-false",
      "placement": "os-10-dispatch",
      "objective": "Separate mode transition from switching processes.",
      "prerequisites": [
        "os-10-dispatch"
      ],
      "prompt": "Entering kernel mode for a system call can return to the same process.",
      "options": [
        {
          "id": "os-10-same-process-1",
          "text": "True · صح"
        },
        {
          "id": "os-10-same-process-2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-10-same-process-1",
      "feedback": {
        "os-10-same-process-1": "صح؛ الرسم بيفترض الرجوع لنفس المستدعي. تغيير الصلاحية مش بالضرورة تبديل Process.",
        "os-10-same-process-2": "الجملة صح؛ دخول Kernel mode وحده ما يثبتش تشغيل Process تانية."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            9
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-10-table",
      "type": "mcq",
      "placement": "os-10-parameters",
      "objective": "Interpret the table address passed in a register.",
      "prerequisites": [
        "os-10-parameters"
      ],
      "prompt": "In slide 11, a register contains X. What is X?",
      "options": [
        {
          "id": "os-10-table-1",
          "text": "All parameter values compressed into one number"
        },
        {
          "id": "os-10-table-2",
          "text": "The address of the parameter table"
        },
        {
          "id": "os-10-table-3",
          "text": "The number of all running programs"
        },
        {
          "id": "os-10-table-4",
          "text": "The result of every system call"
        }
      ],
      "correctOptionId": "os-10-table-2",
      "feedback": {
        "os-10-table-1": "السلايد بيقول إن Register يحمل عنوان الجدول، مش كل محتوياته.",
        "os-10-table-2": "صح؛ النظام يستخدم X علشان يوصل للـParameters في الذاكرة.",
        "os-10-table-3": "X عنوان جدول في المثال، مش عدد البرامج.",
        "os-10-table-4": "X بيتبعت كعنوان قبل تنفيذ الخدمة؛ مش نتيجة كل نداء."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            10,
            11
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-10-unlimited",
      "type": "true-false",
      "placement": "os-10-parameters",
      "objective": "Understand the bounded advantage of memory-based argument passing.",
      "prerequisites": [
        "os-10-parameters"
      ],
      "prompt": "Block and stack methods remove every possible memory limit on parameters.",
      "options": [
        {
          "id": "os-10-unlimited-1",
          "text": "True · صح"
        },
        {
          "id": "os-10-unlimited-2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-10-unlimited-2",
      "feedback": {
        "os-10-unlimited-1": "غلط؛ بتتجنب حد عدد Registers، لكن حجم الذاكرة وقواعد الواجهة لسه موجودين.",
        "os-10-unlimited-2": "صح؛ عبارة السلايد عن عدم التقييد مقصود بيها حد Registers، مش ذاكرة غير محدودة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            10
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-10-library-boundary",
      "type": "mcq",
      "placement": "os-10-library",
      "objective": "Locate the privilege transition in the library example.",
      "prerequisites": [
        "os-10-library"
      ],
      "prompt": "In the illustrated printf-to-write path, which event requires entry into the kernel?",
      "options": [
        {
          "id": "os-10-library-boundary-1",
          "text": "Calling an ordinary formatting function in user space"
        },
        {
          "id": "os-10-library-boundary-2",
          "text": "The system-call entry for the OS write service"
        },
        {
          "id": "os-10-library-boundary-3",
          "text": "Including stdio.h"
        },
        {
          "id": "os-10-library-boundary-4",
          "text": "Declaring main()"
        }
      ],
      "correctOptionId": "os-10-library-boundary-2",
      "feedback": {
        "os-10-library-boundary-1": "تنسيق النص داخل Library مش لوحده دخول Kernel.",
        "os-10-library-boundary-2": "صح؛ طلب خدمة write عن طريق System call هو عبور الحد في الرسم.",
        "os-10-library-boundary-3": "التضمين خطوة تعريفات عند بناء البرنامج، مش تنفيذ خدمة Kernel.",
        "os-10-library-boundary-4": "تعريف main مش هو عبور الصلاحية."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
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
      "id": "os-10-printf-once",
      "type": "true-false",
      "placement": "os-10-library",
      "objective": "Avoid a false immediate one-to-one printf/write rule.",
      "prerequisites": [
        "os-10-library"
      ],
      "prompt": "One printf() call must always cause one immediate write() system call.",
      "options": [
        {
          "id": "os-10-printf-once-1",
          "text": "True · صح"
        },
        {
          "id": "os-10-printf-once-2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-10-printf-once-2",
      "feedback": {
        "os-10-printf-once-1": "غلط؛ Buffering ممكن يغيّر التوقيت وعدد write calls. الرسم بيوضح علاقة، مش ضمان عددي.",
        "os-10-printf-once-2": "صح؛ printf دالة Library، ومش لازم يبقى فيه write واحدة فورية لكل نداء."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
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
      "id": "os-10-api",
      "term": "API",
      "translation": "واجهة برمجة التطبيقات",
      "definition": "A set of callable functions with specified parameters and expected return values.",
      "explanation": "بتعرف تبعت للدالة إيه وتفهم اللي يرجع منها.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            6
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-syscall",
      "term": "System call",
      "translation": "طلب برمجي لخدمة OS",
      "definition": "A programming interface for requesting services provided by the operating system.",
      "explanation": "البرنامج يطلب خدمة من النظام بدل تنفيذ وظيفة Kernel بنفسه.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            6,
            8
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-parameter",
      "term": "Parameter",
      "translation": "تفصيلة الدالة محتاجاها",
      "definition": "An input specified by an interface for a function or system call.",
      "explanation": "زي fd وbuf وcount في read.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            6,
            7,
            10
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-return",
      "term": "Return value",
      "translation": "القيمة الراجعة من الدالة",
      "definition": "A value returned to the caller to report a result or status.",
      "explanation": "زي عدد bytes اللي اتقرت أو -1 لو حصل خطأ.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            6,
            7,
            8
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-descriptor",
      "term": "File descriptor (fd)",
      "translation": "رقم يعرّف ملف مفتوح",
      "definition": "An integer identifying an open file for I/O operations.",
      "explanation": "تبعته لـread علشان تحدد تقرأ منين.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            7
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-buffer",
      "term": "Buffer",
      "translation": "مساحة مؤقتة للبيانات",
      "definition": "A memory area used to hold data for an operation.",
      "explanation": "buf يشاور للمكان اللي البيانات المقروءة هتتحط فيه.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            7,
            12
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-byte",
      "term": "Byte",
      "translation": "وحدة لعد البيانات",
      "definition": "A unit used to specify data sizes and transfer counts.",
      "explanation": "count بيقول أقصى عدد bytes عايز تقراه.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            7
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-10-read",
      "term": "read()",
      "translation": "دالة قراءة البيانات",
      "definition": "A function that attempts to read up to a requested byte count into a buffer.",
      "explanation": "النتيجة ممكن تبقى أقل من count.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            7
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-eof",
      "term": "End of file (EOF)",
      "translation": "نهاية الملف",
      "definition": "The point at which no more file data remains to be read.",
      "explanation": "في مثال ملف عادي وطلب قراءة أكبر من صفر، read ترجع 0 عند النهاية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            7
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-number",
      "term": "System-call number",
      "translation": "رقم تعريف الخدمة",
      "definition": "An identifier used to select a system-call table entry.",
      "explanation": "الرقم يوجّه التنفيذ للخدمة المطلوبة؛ مش رقم أداء.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            8,
            9
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-runtime",
      "term": "Run-time support library",
      "translation": "مكتبة بتساعد البرنامج وقت التشغيل",
      "definition": "Library functions that support programs and hide interface implementation details.",
      "explanation": "بتسهّل الوصول لخدمات النظام حسب الواجهة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            8
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-register",
      "term": "Register",
      "translation": "مكان صغير وسريع داخل CPU",
      "definition": "A small CPU storage location that can hold argument values or an address.",
      "explanation": "ممكن يحمل X عنوان جدول Parameters.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            10,
            11
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-block",
      "term": "Parameter block / table",
      "translation": "بلوك في الذاكرة للمدخلات",
      "definition": "A memory area holding parameters whose address is supplied to the OS.",
      "explanation": "نحط التفاصيل في الجدول ونمرّر مكانه.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            10,
            11
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-stack",
      "term": "Stack parameter passing",
      "translation": "تمرير المدخلات باستخدام Stack",
      "definition": "Passing parameters by pushing them onto a stack for the OS to retrieve.",
      "explanation": "Push يحط القيم وPop ياخدها حسب الاتفاق.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            10
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-printf",
      "term": "printf()",
      "translation": "دالة C لتنسيق الإخراج",
      "definition": "A standard C library function for formatted output.",
      "explanation": "ممكن تعتمد على write، لكنها مش هي System call نفسها.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            12
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-write",
      "term": "write()",
      "translation": "طلب كتابة بيانات",
      "definition": "The OS write service used in the slide’s C-library example.",
      "explanation": "السلايد يوضح Library بتستخدم خدمة النظام للإخراج.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            12
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-mode",
      "term": "User / kernel mode",
      "translation": "مستويات صلاحية التنفيذ",
      "definition": "Execution modes that distinguish restricted user execution from privileged kernel execution.",
      "explanation": "العبور بينهم مش لازم يبدّل Process.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            9,
            12
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-10-posix",
      "term": "POSIX API",
      "translation": "واجهة معيارية لأنظمة متوافقة",
      "definition": "A standardized interface family used by POSIX-based systems.",
      "explanation": "واحدة من أمثلة الواجهات في سلايد 6.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            6
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-size-types",
      "term": "size_t / ssize_t",
      "translation": "نوع عدد البيانات ونوع النتيجة",
      "definition": "Types used for byte counts and signed return counts in the displayed read interface.",
      "explanation": "size_t لـcount؛ ssize_t للنتيجة اللي ممكن تبقى -1 عند الخطأ.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            7
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-win32",
      "term": "Win32 API",
      "translation": "واجهة برمجة لأنظمة Windows في مثال المصدر",
      "definition": "The Windows API family named in the source comparison.",
      "explanation": "مثال منصة مختلفة عن POSIX؛ مش كل الأنظمة لها نفس الواجهة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            6
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-10-jvm",
      "term": "Java virtual machine (JVM)",
      "translation": "بيئة بتشغّل برامج Java",
      "definition": "The execution environment targeted by the Java API example in the source.",
      "explanation": "أسماء الواجهات بتختلف حسب المنصة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            6
          ]
        }
      ],
      "kind": "source-concept"
    }
  ],
  "visualizations": [
    {
      "id": "os-10-request-return",
      "conceptId": "os-10-dispatch",
      "title": "API request and kernel return",
      "description": "مثال open() مبسّط: بنفترض الخدمة رجعت لنفس البرنامج.",
      "legend": "Application وLibrary في User mode. الخط المتقطّع حد الصلاحية؛ System-call interface والـHandler تحت الحد. الأسهم اتجاه الطلب ثم رجوع النتيجة، مش جدول توقيت أو تبديل Processes.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            6,
            8,
            9,
            12
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 420\" role=\"img\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#20546e\"/></marker></defs><rect width=\"760\" height=\"420\" fill=\"#f8fcff\"/><g font-family=\"Arial, sans-serif\"><g data-node=\"app\"><rect x=\"30\" y=\"20\" width=\"300\" height=\"55\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"180\" y=\"54.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Application: open(...)</text></g><g data-node=\"api-call\"><path d=\"M180 75 L180 110\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"library\"><rect x=\"30\" y=\"110\" width=\"300\" height=\"70\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"180\" y=\"139.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">API / library wrapper</text><text x=\"180\" y=\"164.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">User mode</text></g><g data-node=\"privilege\"><path d=\"M20 220 H740\" stroke=\"#a4452b\" stroke-dasharray=\"9 6\" stroke-width=\"3\"/><text x=\"380\" y=\"210\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">Privilege boundary</text></g><g data-node=\"entry\"><path d=\"M180 180 L180 260\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"290\" y=\"242\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">system-call entry</text></g><g data-node=\"table\"><rect x=\"30\" y=\"260\" width=\"300\" height=\"75\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"180\" y=\"292\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Call number i</text><text x=\"180\" y=\"317\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Interface: table[i]</text></g><g data-node=\"select\"><path d=\"M330 298 L430 298\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"380\" y=\"282\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">select</text></g><g data-node=\"handler\"><rect x=\"430\" y=\"260\" width=\"300\" height=\"75\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"580\" y=\"292\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Kernel handler</text><text x=\"580\" y=\"317\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Perform OS service</text></g><g data-node=\"status\"><path d=\"M580 260 L580 145\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"644\" y=\"205\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">status + result</text></g><g data-node=\"return\"><path d=\"M580 145 L330 145\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"app-return\"><path d=\"M280 110 L280 75\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g></g></svg>",
      "steps": [
        {
          "id": "os-10-request-return-step-1",
          "title": "API call",
          "detail": "التطبيق ينادي الواجهة المتفق عليها، والمكتبة تجهّز الطلب. الجزء ده في User mode.",
          "focus": [
            "app",
            "api-call",
            "library"
          ]
        },
        {
          "id": "os-10-request-return-step-2",
          "title": "Kernel entry",
          "detail": "هنا عبور الصلاحية. رقم النداء بيختار المدخل المناسب في جدول النداءات، وبعدها التنفيذ يدخل الـKernel handler المناسب.",
          "focus": [
            "privilege",
            "entry",
            "table",
            "select",
            "handler"
          ]
        },
        {
          "id": "os-10-request-return-step-3",
          "title": "Return",
          "detail": "Status وأي Return values ترجع عبر الواجهة والمكتبة للتطبيق. بنفترض نفس Process؛ مفيش تبديل لبرنامج تاني مرسوم هنا.",
          "focus": [
            "status",
            "return",
            "app-return",
            "library",
            "app"
          ]
        }
      ]
    },
    {
      "id": "os-10-read-contract",
      "conceptId": "os-10-read",
      "title": "read(fd, buf, count): inputs and outputs",
      "description": "مثال افتراضي: Buffer يسع 100 bytes وطلب قراءة لحد 100. رجوع 40 معناه 40 bytes اتقرت.",
      "legend": "المربعات أنواع معلومات، مش أماكن فعلية في CPU. الأسهم الداخلة مدخلات للدالة؛ السهمان الخارجان بيفرّقوا البيانات في Buffer عن Return value. الأرقام للتفسير فقط.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            7
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 420\" role=\"img\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#20546e\"/></marker></defs><rect width=\"760\" height=\"420\" fill=\"#f8fcff\"/><g font-family=\"Arial, sans-serif\"><g data-node=\"fd\"><rect x=\"20\" y=\"25\" width=\"215\" height=\"65\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"127.5\" y=\"52\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">fd</text><text x=\"127.5\" y=\"77\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Open file identity</text></g><g data-node=\"buf\"><rect x=\"272\" y=\"25\" width=\"215\" height=\"65\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"379.5\" y=\"52\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">buf</text><text x=\"379.5\" y=\"77\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Destination address</text></g><g data-node=\"count\"><rect x=\"524\" y=\"25\" width=\"215\" height=\"65\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"631.5\" y=\"52\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">count = 100</text><text x=\"631.5\" y=\"77\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Maximum bytes</text></g><g data-node=\"fd-input\"><path d=\"M128 90 L280 170\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"buf-input\"><path d=\"M380 90 L380 170\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"count-input\"><path d=\"M632 90 L480 170\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"read\"><rect x=\"245\" y=\"170\" width=\"270\" height=\"60\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"207\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">read(fd, buf, 100)</text></g><g data-node=\"data-output\"><path d=\"M300 230 L190 315\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"210\" y=\"270\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">data</text></g><g data-node=\"count-output\"><path d=\"M460 230 L570 315\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"585\" y=\"270\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">return value</text></g><g data-node=\"data\"><rect x=\"35\" y=\"315\" width=\"300\" height=\"75\" rx=\"9\" fill=\"#e4f2e5\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"185\" y=\"347\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">buf now holds</text><text x=\"185\" y=\"372\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">40 bytes of file data</text></g><g data-node=\"result\"><rect x=\"425\" y=\"315\" width=\"300\" height=\"75\" rx=\"9\" fill=\"#fff0d2\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"575\" y=\"347\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">return = 40</text><text x=\"575\" y=\"372\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Actual byte count</text></g></g></svg>",
      "steps": [
        {
          "id": "os-10-read-contract-step-1",
          "title": "Three inputs",
          "detail": "fd يحدد ملف مفتوح؛ buf مكان البيانات؛ count حد أقصى. افترضنا Buffer مناسب للحجم.",
          "focus": [
            "fd",
            "buf",
            "count"
          ]
        },
        {
          "id": "os-10-read-contract-step-2",
          "title": "Read attempt",
          "detail": "read بتحاول تقرأ لحد 100 bytes، مش بتضمن ترجع العدد كله في كل مرة.",
          "focus": [
            "read"
          ]
        },
        {
          "id": "os-10-read-contract-step-3",
          "title": "Two different outputs",
          "detail": "الـ40 bytes نفسهم في buf، لكن القيمة الراجعة رقم 40. لو حصل خطأ، النتيجة -1 بدل عدد موجب.",
          "focus": [
            "data",
            "result"
          ]
        }
      ]
    },
    {
      "id": "os-10-table-address",
      "conceptId": "os-10-parameters",
      "title": "A register can carry a table address",
      "description": "إعادة توضيح لفكرة X في سلايد 11؛ مش تخطيط ذاكرة حقيقي أو رقم نداء ثابت.",
      "legend": "Table X بلوك بيانات في ذاكرة البرنامج، وRegister يحمل عنوانه فقط. السهم الأفقي فوق هو تحميل العنوان؛ الأسهم النازلة تسليم/استخدام العنوان والقيم بواسطة Kernel. حد الصلاحية بيفصل كود المستخدم عن كود Kernel، مش بيمسح بيانات الجدول.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            10,
            11
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 420\" role=\"img\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#20546e\"/></marker></defs><rect width=\"760\" height=\"420\" fill=\"#f8fcff\"/><g font-family=\"Arial, sans-serif\"><g data-node=\"table\"><rect x=\"30\" y=\"35\" width=\"300\" height=\"110\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"180\" y=\"84.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Table X in memory</text><text x=\"180\" y=\"109.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Parameter 1, 2, ...</text></g><g data-node=\"load-address\"><path d=\"M330 90 L430 90\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"380\" y=\"65\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">address X</text></g><g data-node=\"register\"><rect x=\"430\" y=\"35\" width=\"300\" height=\"110\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"580\" y=\"84.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">CPU register</text><text x=\"580\" y=\"109.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Contains address X</text></g><g data-node=\"privilege\"><path d=\"M20 210 H740\" stroke=\"#a4452b\" stroke-dasharray=\"9 6\" stroke-width=\"3\"/><text x=\"380\" y=\"200\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">User code above / Kernel code below</text></g><g data-node=\"address-to-os\"><path d=\"M580 145 L580 280\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"610\" y=\"245\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">X</text></g><g data-node=\"read-values\"><path d=\"M180 145 L180 315\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"95\" y=\"255\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">table values</text></g><g data-node=\"values-to-handler\"><path d=\"M180 315 L430 315\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"handler\"><rect x=\"430\" y=\"280\" width=\"300\" height=\"85\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"580\" y=\"317\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">OS handler</text><text x=\"580\" y=\"342\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Use table parameters</text></g></g></svg>",
      "steps": [
        {
          "id": "os-10-table-address-step-1",
          "title": "Prepare the table",
          "detail": "البرنامج يحط القيم في Table X بالذاكرة. مش لازم كل القيم تتسع في Registers.",
          "focus": [
            "table"
          ]
        },
        {
          "id": "os-10-table-address-step-2",
          "title": "Pass the address",
          "detail": "يحط عنوان X في Register. Register مش شايل نسخة من الجدول كله.",
          "focus": [
            "load-address",
            "register"
          ]
        },
        {
          "id": "os-10-table-address-step-3",
          "title": "Use the parameters",
          "detail": "لما النظام يستقبل الطلب، يستخدم العنوان للوصول للقيم وفق قواعد الواجهة. الرسم مختصر للتحقق من المدخلات؛ مش إذن وصول لأي عنوان عشوائي.",
          "focus": [
            "address-to-os",
            "read-values",
            "values-to-handler",
            "handler"
          ]
        }
      ]
    }
  ]
};if(typeof module==='object'&&module.exports)module.exports=lesson;else root.OSPilotLesson=lesson;})(typeof window!=='undefined'?window:globalThis);
