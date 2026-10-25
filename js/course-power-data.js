/**
 * ==============================================================================
 * بيانات الأدوات الذكية: جرس التنبيهات (آخر الإضافات) + الشرح التفاعلي + محاكي الميدتيرم
 * ==============================================================================
 */
(function () {
  'use strict';

  // قائمة آخر الإضافات والتحديثات في المنصة (تظهر في جرس التنبيهات 🔔)
  const PORTAL_NOTIFICATIONS = [
    {
      id: 'notif-ds-sec4-stack',
      isNew: true,
      dateLabel: 'أحدث إضافة 🔥',
      courseId: 'data-structure',
      courseName: 'هياكل البيانات (Data Structures)',
      typeLabel: 'سكشن عملي + 3 فيديوهات + كود C++',
      title: 'السكشن الرابع (الأجزاء 1، 2، 3): تطبيق DynamicStack ودالة Resize',
      desc: 'تمت إضافة فيديوهات الشرح المسجلة (3 أجزاء) والكود البرمجي الكامل لبناء المكدس الديناميكي باستخدام القوالب (Templates) من إعداد م.م. أحمد حسام.',
      url: 'subject.html?id=data-structure&track=section&kind=sections'
    },
    {
      id: 'notif-ds-lec5-queue',
      isNew: true,
      dateLabel: 'جديد ✨',
      courseId: 'data-structure',
      courseName: 'هياكل البيانات (Data Structures)',
      typeLabel: 'محاضرة 5 + سكشن 5',
      title: 'المحاضرة 5 والسكشن 5: هيكل الطابور (Queue ADT & Circular Queue)',
      desc: 'سلايدات المحاضرة الخامسة الرسمية (Queue & Priority Queues) وسلايدات السكشن الخامس من إعداد م. فاطمة محمود.',
      url: 'subject.html?id=data-structure&track=lecture&kind=lectures'
    },
    {
      id: 'notif-ds-interactive',
      isNew: true,
      dateLabel: 'شرح تفاعلي ⚡',
      courseId: 'data-structure',
      courseName: 'هياكل البيانات (Data Structures)',
      typeLabel: 'بوابة الشرح التفاعلي',
      title: 'الشرح التفاعلي الشامل لمحاضرات المصفوفات، Linked Lists (6 أجزاء)، والـ Recursion',
      desc: 'تتبع بصري للمؤشرات والذاكرة والـ Call Stack خطوة بخطوة مع كويزات تدريبية.',
      url: 'study/ds/index.html'
    },
    {
      id: 'notif-db-lec45-er',
      isNew: true,
      dateLabel: 'جديد ✨',
      courseId: 'database-systems',
      courseName: 'نظم قواعد البيانات (Database Systems)',
      typeLabel: 'محاضرة 4 و 5 + شرح تفاعلي',
      title: 'المحاضرة 4 و 5: نمذجة البيانات ومخططات الكيانات والعلاقات (ER Model)',
      desc: 'سلايدات المحاضرتين 4 و 5 (أ.م.د. نبيل مصطفى - د. أحمد سامي) بالإضافة للشرح التفاعلي الكامل للمحاضرتين 2 و 3.',
      url: 'subject.html?id=database-systems&track=lecture&kind=lectures'
    },
    {
      id: 'notif-arch-lec5-io',
      isNew: false,
      dateLabel: 'مضاف حديثاً 📌',
      courseId: 'computer-architecture',
      courseName: 'معمارية الحاسوب (Computer Architecture)',
      typeLabel: 'محاضرة 5 + شرح تفاعلي',
      title: 'المحاضرة 5 (External Memory & I/O) والشرح التفاعلي لشابتر 7 (I/O & DMA)',
      desc: 'سلايدات المحاضرة الخامسة الرسمية (أ.د. نبيل لاشين) وبوابة الشرح التفاعلي لفصل الـ Input/Output والـ DMA.',
      url: 'study/arch/chapter-7.html'
    },
    {
      id: 'notif-os-interactive',
      isNew: false,
      dateLabel: 'مضاف حديثاً 📌',
      courseId: 'operating-system',
      courseName: 'نظم التشغيل (Operating Systems)',
      typeLabel: '19 وحدة تفاعلية',
      title: 'المنصة التفاعلية الكاملة لنظم التشغيل (الفصول 1 و 2 و 3)',
      desc: 'شرح تفاعلي بالرسوم المتحركة لـ Dual-Mode، الـ System Calls، والـ Processes & PCB مع 107 سؤال تدريبي.',
      url: 'education-preview/os/index.html'
    }
  ];

  // بيانات الشرح التفاعلي ومحاكي الميدتيرم لكل مقرر
  const COURSE_POWER_DATA = {
    'data-structure': {
      interactiveHub: {
        mainUrl: 'study/ds/index.html',
        mainLabel: 'فتح بوابة الشرح التفاعلي لهياكل البيانات',
        desc: 'شروحات تفاعلية مصممة خصيصاً لتتبع المؤشرات وحجز الذاكرة والـ Call Stack مع أمثلة C++ وكويزات شاملة.',
        items: [
          { title: 'المحاضرة 1: Arrays, Templates & ADTs', sub: 'شرح تفاعلي + تتبع الذاكرة + كويز 16 سؤال', url: 'study/ds/lecture-1.html' },
          { title: 'المحاضرة 2: Linked Lists (الأجزاء الـ 6 كاملة)', sub: 'تشريح العقد SLL / DLL / CLL بالإضافة والحذف', url: 'study/ds/lecture-2.html' },
          { title: 'المحاضرة 3: Recursion & Memory Tracing', sub: 'تتبع الـ Call Stack، المضروب، فيبوناتشي، و 8-Queens', url: 'study/ds/lecture-3.html' }
        ]
      },
      midtermQuestions: [
        {
          id: 'ds-q1',
          lectureId: '0',
          lectureLabel: 'المحاضرة 0: Pointers & Memory',
          topic: 'Pointers & Dynamic Memory',
          question: 'What happens in C++ if a pointer pointing to dynamically allocated heap memory is reassigned without calling delete first?',
          options: [
            'A compilation error occurs immediately',
            'A Memory Leak occurs because the heap block loses its reference',
            'The operating system garbage collector frees it immediately',
            'A Stack Overflow exception is thrown'
          ],
          correct: 1,
          explanation: 'عند تغيير قيمة المؤشر دون عمل delete للمساحة المحجوزة بـ new على الـ Heap، تظل المساحة محجوزة بدون أي مؤشر يشير إليها، وهو ما يُعرف بـ Memory Leak.'
        },
        {
          id: 'ds-q2',
          lectureId: '0',
          lectureLabel: 'المحاضرة 0: Pointers & Memory',
          topic: 'Dangling Pointers',
          question: 'After executing "delete ptr;", what is "ptr" called if it is not set to nullptr?',
          options: [
            'Wild Pointer',
            'Null Reference',
            'Dangling Pointer',
            'Smart Pointer'
          ],
          correct: 2,
          explanation: 'المؤشر الذي لا يزال يحتفظ بعنوان ذاكرة تم تحريرها بـ delete يُسمى Dangling Pointer، وأفضل ممارسة هي تعيين ptr = nullptr فوراً بعد delete.'
        },
        {
          id: 'ds-q3',
          lectureId: '1',
          lectureLabel: 'المحاضرة 1: Arrays & Templates',
          topic: '2D Array Addressing',
          question: 'Given a 2D array int A[10][20] stored in Row-Major order with Base Address = 1000 and sizeof(int) = 4 bytes, what is the address of A[2][5]?',
          options: [
            '1180',
            '1100',
            '1208',
            '1028'
          ],
          correct: 0,
          explanation: 'في نظام Row-Major: Address(A[i][j]) = Base + (i * N + j) * size = 1000 + (2 * 20 + 5) * 4 = 1000 + 45 * 4 = 1180.'
        },
        {
          id: 'ds-q4',
          lectureId: '1',
          lectureLabel: 'المحاضرة 1: Arrays & Templates',
          topic: 'C++ Templates & ADTs',
          question: 'Which C++ feature allows writing a single class definition (such as DynamicStack<T>) that works with any data type?',
          options: [
            'Virtual Functions',
            'Class Templates (template <typename T>)',
            'Operator Overloading',
            'Friend Classes'
          ],
          correct: 1,
          explanation: 'القوالب (Templates) باستخدام template <typename T> تسمح بإنشاء هياكل بيانات عامة (Generic Data Structures) تعمل مع int أو double أو string دون تكرار الكود.'
        },
        {
          id: 'ds-q5',
          lectureId: '2',
          lectureLabel: 'المحاضرة 2: Linked Lists',
          topic: 'Singly Linked List Insertion',
          question: 'What is the time complexity of inserting a new node at the beginning (head) of a Singly Linked List?',
          options: [
            'O(1)',
            'O(log n)',
            'O(n)',
            'O(n log n)'
          ],
          correct: 0,
          explanation: 'الإضافة في بداية الـ Linked List تتطلب خطوتين ثابتتين فقط (newNode->next = head; head = newNode;)، وبالتالي تعقيدها الزمني O(1).'
        },
        {
          id: 'ds-q6',
          lectureId: '2',
          lectureLabel: 'المحاضرة 2: Linked Lists',
          topic: 'Pointer Order in Insertion',
          question: 'When inserting newNode right after node "curr" in a Singly Linked List, which statement order is correct?',
          options: [
            'curr->next = newNode; newNode->next = curr->next;',
            'newNode->next = curr->next; curr->next = newNode;',
            'newNode->next = head; head->next = curr;',
            'delete curr->next; curr->next = newNode;'
          ],
          correct: 1,
          explanation: 'يجب أولاً ربط newNode ببقية القائمة عبر newNode->next = curr->next ثم جعل curr يشير إلى newNode؛ عكس الترتيب يضيّع عنوان باقي القائمة!'
        },
        {
          id: 'ds-q7',
          lectureId: '2',
          lectureLabel: 'المحاضرة 2: Linked Lists',
          topic: 'Doubly Linked List',
          question: 'Compared to a Singly Linked List, what is the primary advantage of a Doubly Linked List?',
          options: [
            'It uses less memory per node',
            'It allows O(1) random access by index like an array',
            'It allows bidirectional traversal and O(1) deletion of a given node pointer without searching for its predecessor',
            'It does not require dynamic memory allocation'
          ],
          correct: 2,
          explanation: 'وجود مؤشر prev في الـ Doubly Linked List يسمح بالحركة في الاتجاهين وحذف أي عقدة بمعلومية مؤشرها مباشرة في O(1).'
        },
        {
          id: 'ds-q8',
          lectureId: '3',
          lectureLabel: 'المحاضرة 3: Recursion & Call Stack',
          topic: 'Recursion & Call Stack',
          question: 'Which data structure is used internally by the system to manage function calls and local variables during recursion?',
          options: [
            'Priority Queue',
            'System Call Stack (LIFO)',
            'Circular Linked List',
            'Hash Table'
          ],
          correct: 1,
          explanation: 'يستخدم النظام الـ Call Stack (الذي يعمل بمبدأ LIFO) لتخزين Activation Records (المعاملات، المتغيرات المحلية، وعنوان العودة) لكل استدعاء.'
        },
        {
          id: 'ds-q9',
          lectureId: '3',
          lectureLabel: 'المحاضرة 3: Recursion & Call Stack',
          topic: 'Base Case in Recursion',
          question: 'What happens if a recursive function lacks a reachable Base Case?',
          options: [
            'It automatically converts to an iterative loop',
            'It returns 0 by default',
            'It causes infinite recursion leading to a Stack Overflow runtime error',
            'It frees all heap memory'
          ],
          correct: 2,
          explanation: 'غياب الـ Base Case يؤدي إلى استمرار تراكم Stack Frames في الـ Call Stack حتى تمتلئ ذاكرة المكدس ويحدث خطأ Stack Overflow.'
        },
        {
          id: 'ds-q10',
          lectureId: '4',
          lectureLabel: 'المحاضرة 4: Stacks ADT',
          topic: 'Stack Postfix Evaluation',
          question: 'What is the value of the Postfix expression: "6 3 2 + * 4 -"?',
          options: [
            '26',
            '16',
            '34',
            '10'
          ],
          correct: 0,
          explanation: 'ندفع 6 ثم 3 ثم 2. عند (+) نجمع 3+2=5، ثم عند (*) نضرب 6*5=30، ثم ندفع 4، وعند (-) نطرح 30-4 = 26.'
        },
        {
          id: 'ds-q11',
          lectureId: '4',
          lectureLabel: 'المحاضرة 4: Stacks ADT',
          topic: 'DynamicStack Implementation',
          question: 'In an array-based Stack where top starts at -1, what is the condition for Stack Underflow?',
          options: [
            'top == capacity - 1',
            'top == 0',
            'top == -1',
            'top == capacity'
          ],
          correct: 2,
          explanation: 'عندما يبدأ المؤشر top من -1، فإن كون top == -1 يعني أن المكدس فارغ تماماً، ومحاولة عمل pop() أو peek() حينها تسبب Stack Underflow.'
        },
        {
          id: 'ds-q12',
          lectureId: '5',
          lectureLabel: 'المحاضرة 5: Queues & Priority Queues',
          topic: 'Circular Queue Arithmetic',
          question: 'In a Circular Queue of capacity 8, if rear is currently at index 7 and one element is enqueued (assuming space exists), what becomes the new value of rear?',
          options: [
            '8',
            '0',
            '1',
            '-1'
          ],
          correct: 1,
          explanation: 'طبقاً لمعادلة الطابور الدائري: rear = (rear + 1) % capacity = (7 + 1) % 8 = 0.'
        }
      ]
    },

    'computer-architecture': {
      interactiveHub: {
        mainUrl: 'study/arch/index.html',
        mainLabel: 'فتح بوابة الشرح التفاعلي لمعمارية الحاسوب',
        desc: 'دليل فصول معمارية الحاسوب المقررة والشرح التفاعلي الشامل (I/O, Cache, IAS) مع الرسوم الهندسية وبنوك الأسئلة.',
        items: [
          { title: 'الفصل السابع (المحاضرة 5): Input / Output & DMA', sub: 'شرح تفاعلي كامل لـ Programmed I/O، المقاطعات، والـ DMA + 25 سؤال MCQ', url: 'study/arch/chapter-7.html' },
          { title: 'بوابة خريطة المنهج والفصول المقررة والملغية', sub: 'توضيح الأجزاء المقررة والملغية في فصول المعمارية بالتفصيل', url: 'study/arch/index.html' },
          { title: 'منصة الشرح التفاعلي الشامل للمادة', sub: 'الدليل التفاعلي لفصول المعمارية (Cache, Multicore, ISA)', url: 'https://ahm-333.github.io/computer-architecture-study/' }
        ]
      },
      midtermQuestions: [
        {
          id: 'arch-q1',
          lectureId: '1',
          lectureLabel: 'المحاضرة 1: Basic Concepts & IAS',
          topic: 'Architecture vs Organization',
          question: 'Which of the following is considered an attribute of Computer Architecture rather than Computer Organization?',
          options: [
            'Memory technology used (SRAM vs DRAM)',
            'Instruction Set and number of bits used to represent data types',
            'Control signals and hardware adder design',
            'Clock frequency and bus width'
          ],
          correct: 1,
          explanation: 'الـ Architecture تشمل كل ما يراه مبرمج لغة التجميع (Instruction Set، أنواع البيانات، عنونة الذاكرة)، بينما التكنولوجيا وإشارات التحكم تتبع الـ Organization.'
        },
        {
          id: 'arch-q2',
          lectureId: '1',
          lectureLabel: 'المحاضرة 1: Basic Concepts & IAS',
          topic: 'IAS Computer Registers',
          question: 'In the von Neumann IAS computer, which register holds the address of the next instruction pair to be fetched from memory?',
          options: [
            'Instruction Register (IR)',
            'Memory Buffer Register (MBR)',
            'Program Counter (PC)',
            'Multiplier Quotient (MQ)'
          ],
          correct: 2,
          explanation: 'مسجل عداد البرنامج (Program Counter - PC) يحتفظ دائماً بعنوان التعليمة التالية المراد جلبها من الذاكرة.'
        },
        {
          id: 'arch-q3',
          lectureId: '2',
          lectureLabel: 'المحاضرة 2: Instruction Cycle & Buses',
          topic: 'System Bus Lines',
          question: 'If a system has a 16-bit address bus and each addressable memory location holds 1 byte, what is the maximum addressable memory capacity?',
          options: [
            '16 KB',
            '32 KB',
            '64 KB',
            '1 MB'
          ],
          correct: 2,
          explanation: 'عدد العناوين = 2^16 = 65,536 بايت = 64 KB.'
        },
        {
          id: 'arch-q4',
          lectureId: '2',
          lectureLabel: 'المحاضرة 2: Instruction Cycle & Buses',
          topic: 'Interrupts',
          question: 'At what point during the instruction cycle does the processor check for pending interrupts?',
          options: [
            'In the middle of decoding the opcode',
            'At the end of the Execute cycle before fetching the next instruction',
            'Only when the computer is rebooted',
            'Before fetching the operand address'
          ],
          correct: 1,
          explanation: 'يفحص المعالج وجود مقاطعات (Interrupts) بعد انتهاء دورة التنفيذ (Execute Cycle) للتعليمة الحالية وقبل بدء جلب التعليمة التالية.'
        },
        {
          id: 'arch-q5',
          lectureId: '3',
          lectureLabel: 'المحاضرة 3: Cache Memory',
          topic: 'Direct Mapping Address Split',
          question: 'A system has 16 MB of byte-addressable main memory (24-bit address), a 64 KB direct-mapped cache, and a block size of 16 bytes. How many bits are in the Tag, Line, and Word fields respectively?',
          options: [
            'Tag: 8 bits, Line: 12 bits, Word: 4 bits',
            'Tag: 10 bits, Line: 10 bits, Word: 4 bits',
            'Tag: 12 bits, Line: 8 bits, Word: 4 bits',
            'Tag: 8 bits, Line: 14 bits, Word: 2 bits'
          ],
          correct: 0,
          explanation: 'حجم الكتلة = 16 = 2^4 بايت (إذن Word = 4 bits). عدد سطور الكاش = 64KB / 16B = 2^16 / 2^4 = 2^12 سطر (إذن Line = 12 bits). الباقي للـ Tag = 24 - (12 + 4) = 8 bits.'
        },
        {
          id: 'arch-q6',
          lectureId: '3',
          lectureLabel: 'المحاضرة 3: Cache Memory',
          topic: 'Cache Replacement Algorithms',
          question: 'In which cache mapping technique is a replacement algorithm (such as LRU) NOT needed because each block has only one fixed line it can occupy?',
          options: [
            'Fully Associative Mapping',
            'Direct Mapping',
            '4-Way Set Associative Mapping',
            '2-Way Set Associative Mapping'
          ],
          correct: 1,
          explanation: 'في Direct Mapping كل كتلة من الذاكرة لها سطر وحيد محدد (i = j mod m)، فلا يوجد اختيار بين سطور متعددة عند الاستبدال.'
        },
        {
          id: 'arch-q7',
          lectureId: '3',
          lectureLabel: 'المحاضرة 3: Cache Memory',
          topic: 'Cache Write Policies',
          question: 'Which cache write policy updates main memory only when a modified ("dirty") cache block is being replaced?',
          options: [
            'Write Through',
            'Write Back',
            'Write Around',
            'Read Broadcast'
          ],
          correct: 1,
          explanation: 'سياسة Write Back تكتب التعديل في الكاش فقط وتضع علامة Dirty Bit = 1، ولا تحدّث الذاكرة الرئيسية إلا عند طرد السطر من الكاش.'
        },
        {
          id: 'arch-q8',
          lectureId: '4',
          lectureLabel: 'المحاضرة 4: Internal Memory',
          topic: 'SRAM vs DRAM',
          question: 'Which statement accurately compares SRAM and DRAM?',
          options: [
            'DRAM is faster than SRAM and is used for L1 Cache',
            'SRAM uses capacitors and requires periodic charge refreshing',
            'SRAM uses flip-flop latch circuitry, requires no refresh, and is faster than DRAM',
            'Both SRAM and DRAM are non-volatile memories'
          ],
          correct: 2,
          explanation: 'الـ SRAM تعتمد على بوابات Flip-Flops فلا تحتاج إنعاشاً وهي أسرع بكثير من الـ DRAM المعتمدة على المكثفات.'
        },
        {
          id: 'arch-q9',
          lectureId: '5',
          lectureLabel: 'المحاضرة 5: External Memory & I/O',
          topic: 'Direct Memory Access (DMA)',
          question: 'What is the main advantage of Direct Memory Access (DMA) over Interrupt-Driven I/O for transferring large blocks of data?',
          options: [
            'It eliminates the need for main memory',
            'The DMA controller transfers the entire block directly between I/O and memory without involving the CPU for every word',
            'It slows down the system bus to save power',
            'It uses the ALU registers to store disk files'
          ],
          correct: 1,
          explanation: 'وحدة الـ DMA تتولى نقل الكتلة كاملة بين الـ I/O والذاكرة ولا تقاطع المعالج إلا عند انتهاء النقل بالكامل.'
        },
        {
          id: 'arch-q10',
          lectureId: '5',
          lectureLabel: 'المحاضرة 5: External Memory & I/O',
          topic: 'RAID Levels',
          question: 'Which RAID level provides data striping without any redundancy or parity (meaning a single disk failure loses data)?',
          options: [
            'RAID 0',
            'RAID 1',
            'RAID 5',
            'RAID 6'
          ],
          correct: 0,
          explanation: 'مستوى RAID 0 يعتمد على التجزئة (Striping) فقط لرفع الأداء، لكنه لا يوفر أي نسخ احتياطي أو Parity.'
        }
      ]
    },

    'computer-graphics': {
      interactiveHub: {
        mainUrl: 'https://ahm-333.github.io/computer-graphics-study/',
        mainLabel: 'فتح منصة الشرح التفاعلي لرسوميات الحاسوب',
        desc: 'شرح تفاعلي لخوارزميات الرسم (DDA, Bresenham, Midpoint Circle & Ellipse) مع أمثلة التتبع الرقمي للجدول.',
        items: [
          { title: 'منصة الشرح التفاعلي الكاملة (Computer Graphics Study)', sub: 'تغطية شاملة للمحاضرات وخوارزميات الرسم وحل المسائل', url: 'https://ahm-333.github.io/computer-graphics-study/' }
        ]
      },
      midtermQuestions: [
        {
          id: 'cg-q1',
          lectureId: '1',
          lectureLabel: 'المحاضرة 1: Graphics Pipeline',
          topic: 'Computer Graphics vs Image Processing',
          question: 'What is the fundamental difference between Computer Graphics and Image Processing?',
          options: [
            'Computer Graphics synthesizes images from geometric models, while Image Processing analyzes or transforms existing images',
            'Computer Graphics only works in 2D, while Image Processing works in 3D',
            'Image Processing creates 3D meshes from scratch',
            'They are completely identical processes'
          ],
          correct: 0,
          explanation: 'رسوميات الحاسوب (Computer Graphics) تبدأ من بيانات ونماذج هندسية لتوليد صورة، بينما معالجة الصور (Image Processing) تبدأ من صورة موجودة لتحسينها أو استخراج معلومات منها.'
        },
        {
          id: 'cg-q2',
          lectureId: '2',
          lectureLabel: 'المحاضرة 2: Displays & Frame Buffer',
          topic: 'Frame Buffer Calculation',
          question: 'How many megabytes (MB) are required for a Frame Buffer of resolution 1024 × 768 with 24 bits per pixel (True Color)?',
          options: [
            '1.5 MB',
            '2.25 MB',
            '3.0 MB',
            '6.0 MB'
          ],
          correct: 1,
          explanation: 'الحجم بالبايت = 1024 × 768 × (24 / 8) = 1024 × 768 × 3 بايت. بالقسمة على (1024 × 1024) = (768 × 3) / 1024 = 2.25 MB.'
        },
        {
          id: 'cg-q3',
          lectureId: '3',
          lectureLabel: 'المحاضرة 3: DDA & Bresenham Line',
          topic: 'DDA Algorithm',
          question: 'Using the DDA line algorithm to draw a line from (2, 3) to (12, 8), how many steps are required and what are (x_inc, y_inc)?',
          options: [
            'steps = 5, x_inc = 2, y_inc = 1',
            'steps = 10, x_inc = 1, y_inc = 0.5',
            'steps = 10, x_inc = 0.5, y_inc = 1',
            'steps = 12, x_inc = 1, y_inc = 1'
          ],
          correct: 1,
          explanation: 'dx = 12 - 2 = 10، و dy = 8 - 3 = 5. عدد الخطوات steps = max(|10|, |5|) = 10. إذن x_inc = 10/10 = 1، و y_inc = 5/10 = 0.5.'
        },
        {
          id: 'cg-q4',
          lectureId: '3',
          lectureLabel: 'المحاضرة 3: DDA & Bresenham Line',
          topic: 'Bresenham Initial Decision Parameter',
          question: 'In Bresenham\'s Line Drawing Algorithm for a line with dx = 10 and dy = 6 (where 0 < m < 1), what is the initial decision parameter P0?',
          options: [
            'P0 = 2',
            'P0 = 4',
            'P0 = -4',
            'P0 = 16'
          ],
          correct: 0,
          explanation: 'معادلة معامل القرار الابتدائي في Bresenham هي: P0 = 2*dy - dx = 2*(6) - 10 = 12 - 10 = 2.'
        },
        {
          id: 'cg-q5',
          lectureId: '3',
          lectureLabel: 'المحاضرة 3: DDA & Bresenham Line',
          topic: 'Bresenham Advantage',
          question: 'Why is Bresenham\'s line algorithm preferred over the DDA algorithm in hardware implementations?',
          options: [
            'It uses only integer addition, subtraction, and bit-shifting (multiplication by 2), avoiding floating-point arithmetic',
            'It can draw curves without segments',
            'It does not require a Frame Buffer',
            'It calculates square roots at every pixel'
          ],
          correct: 0,
          explanation: 'تتميز خوارزمية Bresenham بأنها تعتمد كلياً على الأعداد الصحيحة (Integer Arithmetic) دون قسمة أو تقريب عشري.'
        },
        {
          id: 'cg-q6',
          lectureId: '4',
          lectureLabel: 'المحاضرة 4: Midpoint Circle',
          topic: 'Midpoint Circle Symmetry',
          question: 'If the point (3, 7) lies on a circle centered at the origin (0, 0), how many symmetric points in total (including itself) are plotted using Circle Symmetry?',
          options: [
            '2 points',
            '4 points',
            '8 points',
            '16 points'
          ],
          correct: 2,
          explanation: 'تعتمد الدائرة على التماثل الثماني (8-Way Symmetry): (±3, ±7) و (±7, ±3) أي 8 نقاط.'
        },
        {
          id: 'cg-q7',
          lectureId: '4',
          lectureLabel: 'المحاضرة 4: Midpoint Circle',
          topic: 'Midpoint Circle Decision Parameter',
          question: 'For a circle of radius r = 10 centered at (0, 0), what is the integer initial decision parameter P0 = 1 - r at the starting point (0, 10)?',
          options: [
            '-9',
            '-10',
            '9',
            '-8'
          ],
          correct: 0,
          explanation: 'P0 = 1 - r = 1 - 10 = -9.'
        },
        {
          id: 'cg-q8',
          lectureId: '5',
          lectureLabel: 'المحاضرة 5: Midpoint Ellipse',
          topic: 'Midpoint Ellipse Region Transition',
          question: 'In the Midpoint Ellipse Algorithm, what condition triggers the transition from Region 1 to Region 2 in the first quadrant?',
          options: [
            'x == y',
            '2 * ry^2 * x >= 2 * rx^2 * y (where the tangent slope becomes <= -1)',
            'P1 < 0',
            'y == ry'
          ],
          correct: 1,
          explanation: 'ننتقل من المنطقة الأولى (Region 1) إلى المنطقة الثانية (Region 2) عندما يصبح ميل المماس مساوياً أو أشد انحداراً من -1، أي عندما يتحقق الشرط: 2 * ry^2 * x >= 2 * rx^2 * y.'
        }
      ]
    },

    'database-systems': {
      interactiveHub: {
        mainUrl: 'study/db/index.html',
        mainLabel: 'فتح بوابة الشرح التفاعلي لقواعد البيانات',
        desc: 'شروحات تفاعلية شريحة بشريحة مع تفكيك المخططات المعمارية (Three-Schema & DBMS) وكويزات تفاعلية.',
        items: [
          { title: 'المحاضرة 2 (Chapter 1): Databases and Database Users', sub: 'شرح تفاعلي لـ 30 شريحة + كويز 20 سؤال', lectureReaderId: '2', url: 'study/db/chapter-1.html' },
          { title: 'المحاضرة 3 (Chapter 2): Database System Concepts & Architecture', sub: 'شرح تفاعلي لـ 32 شريحة + كويز 30 سؤال', lectureReaderId: '3', url: 'study/db/chapter-2.html' }
        ]
      },
      midtermQuestions: [
        {
          id: 'db-extra-1',
          lectureId: '5',
          lectureLabel: 'المحاضرة 4 و 5: ER Data Modeling',
          topic: 'ER Attributes',
          question: 'In ER modeling, how is an attribute like "Age" (which can be calculated automatically from "Birth_Date") classified and drawn?',
          options: [
            'Composite attribute in a double rectangle',
            'Derived attribute in a dashed oval',
            'Multivalued attribute in a double oval',
            'Key attribute with an underlined name'
          ],
          correct: 1,
          explanation: 'الخاصية التي تُحسب قيمتها من خاصية أخرى تُسمى Derived Attribute وتُرسم داخل شكل بيضاوي متقطع (Dashed Oval).'
        },
        {
          id: 'db-extra-2',
          lectureId: '5',
          lectureLabel: 'المحاضرة 4 و 5: ER Data Modeling',
          topic: 'Weak Entity Types',
          question: 'Which statement MUST be true for a Weak Entity Type in an ER diagram?',
          options: [
            'It has no attributes at all',
            'It has partial participation in its identifying relationship',
            'It has total participation in its identifying relationship with the owner entity type',
            'It cannot have a partial key (discriminator)'
          ],
          correct: 2,
          explanation: 'الكيان الضعيف لا يمكن أن يوجد بدون الكيان المالك له، لذلك تكون مشاركته في علاقة التعريف (Identifying Relationship) كلية دائماً (Total Participation — خط مزدوج).'
        }
      ]
    },

    'operating-system': {
      interactiveHub: {
        mainUrl: 'education-preview/os/index.html',
        mainLabel: 'فتح المنصة التفاعلية لنظم التشغيل (19 وحدة)',
        desc: 'رحلة تفاعلية كاملة تغطي الفصول الثلاثة الأولى بالرسوم المتحركة، مختبر الـ Kernel، و 107 سؤال تدريبي.',
        items: [
          { title: 'الفصل الأول: مقدمة نظم التشغيل والـ Dual-Mode', sub: 'وحدات العتاد، المقاطعات، والتخزين', url: 'education-preview/os/index.html#chapter-1' },
          { title: 'الفصل الثاني: تراكيب نظم التشغيل والـ System Calls', sub: 'استدعاءات النظام وهياكل النواة', url: 'education-preview/os/index.html#chapter-2' },
          { title: 'الفصل الثالث: العمليات (Processes, PCB & IPC)', sub: 'جدولة العمليات، الـ Context Switch، والـ fork()', url: 'education-preview/os/index.html#chapter-3' }
        ]
      },
      midtermQuestions: [
        {
          id: 'os-q1',
          lectureId: '1',
          lectureLabel: 'الفصل 1: Introduction & Dual-Mode',
          topic: 'Dual-Mode Operation',
          question: 'What happens if a user application attempts to execute a privileged instruction while the processor is in User Mode (mode bit = 1)?',
          options: [
            'The processor silently ignores the instruction and continues',
            'The hardware traps to the operating system kernel as an illegal instruction',
            'The mode bit automatically changes to 0 and executes it without OS intervention',
            'The computer powers off immediately'
          ],
          correct: 1,
          explanation: 'عند محاولة تنفيذ تعليمة مميزة (Privileged Instruction) في User Mode، يرفضها العتاد ويولّد Trap إلى نظام التشغيل لإيقاف العملية المخالفة.'
        },
        {
          id: 'os-q2',
          lectureId: '1',
          lectureLabel: 'الفصل 1: Introduction & Dual-Mode',
          topic: 'Timer Interrupt',
          question: 'Why does an operating system use a hardware Timer that generates periodic interrupts?',
          options: [
            'To prevent a user program from getting stuck in an infinite loop and monopolizing the CPU',
            'To increase the size of main memory',
            'To replace the need for disk storage',
            'To compile C programs faster'
          ],
          correct: 0,
          explanation: 'المؤقت (Timer) يضمن استعادة نظام التشغيل للتحكم في المعالج بشكل دوري ومنع أي برنامج من احتكار الـ CPU للأبد.'
        },
        {
          id: 'os-q3',
          lectureId: '2',
          lectureLabel: 'الفصل 2: System Calls & OS Structures',
          topic: 'Microkernel Architecture',
          question: 'What is a primary benefit of a Microkernel operating system design?',
          options: [
            'All services run inside kernel space for zero context-switch overhead',
            'Easier extensibility and higher reliability since most services run as user-level processes',
            'It eliminates the need for interprocess communication (IPC)',
            'It does not use virtual memory'
          ],
          correct: 1,
          explanation: 'في تصميم الـ Microkernel تعمل معظم الخدمات في User Space، فإذا تعطلت خدمة مثل File Server لا تنهار النواة بالكامل.'
        },
        {
          id: 'os-q4',
          lectureId: '3',
          lectureLabel: 'الفصل 3: Processes & IPC',
          topic: 'fork() System Call',
          question: 'If a program executes 3 consecutive fork() calls without any conditionals, how many total processes (including the original parent) will exist?',
          options: [
            '3',
            '4',
            '6',
            '8'
          ],
          correct: 3,
          explanation: 'عدد العمليات الكلي بعد n من نداءات fork() المتتالية يساوي 2^n = 2^3 = 8 عمليات (الأب الأصلي + 7 عمليات أبناء).'
        },
        {
          id: 'os-q5',
          lectureId: '3',
          lectureLabel: 'الفصل 3: Processes & IPC',
          topic: 'Context Switch',
          question: 'During a Context Switch between Process P0 and Process P1, what must the operating system kernel do?',
          options: [
            'Delete P0 from disk and recompile P1',
            'Save the state of P0 into PCB0 and load the saved state of P1 from PCB1',
            'Format the cache memory and reboot the I/O bus',
            'Run both processes simultaneously on the same single register set without saving'
          ],
          correct: 1,
          explanation: 'أثناء الـ Context Switch يحفظ النظام حالة مسجلات المعالج للعملية الحالية في الـ PCB الخاص بها، ويحمّل حالة العملية الجديدة من الـ PCB الخاص بها.'
        },
        {
          id: 'os-q6',
          lectureId: '3',
          lectureLabel: 'الفصل 3: Processes & IPC',
          topic: 'Zombie vs Orphan Process',
          question: 'What is a Zombie process in UNIX/Linux systems?',
          options: [
            'A process whose parent has terminated while it is still running',
            'A process that has completed execution, but still has an entry in the process table because its parent has not yet called wait()',
            'A background daemon that manages network sockets',
            'A process blocked waiting for keyboard input'
          ],
          correct: 1,
          explanation: 'العملية الـ Zombie هي عملية أنهت تنفيذها، لكن سجلها في جدول العمليات لم يُحذف بعد لأن عملية الأب لم تقرأ حالة خروجها عبر wait().'
        }
      ]
    },

    'report-writing': {
      interactiveHub: {
        mainUrl: 'https://ahm-333.github.io/technical-writing-study/',
        mainLabel: 'فتح منصة الشرح التفاعلي لكتابة التقارير الفنية',
        desc: 'شرح تفاعلي لمعايير الكتابة الفنية (5 Cs)، هيكلة التقارير الهندسية، وتوثيق المراجع بنظام IEEE و APA.',
        items: [
          { title: 'منصة الشرح التفاعلي الكاملة (Technical Report Writing)', sub: 'تغطية شاملة للمحاضرات الـ 4 والأمثلة التطبيقية', url: 'https://ahm-333.github.io/technical-writing-study/' }
        ]
      },
      midtermQuestions: [
        {
          id: 'rw-q1',
          lectureId: '1',
          lectureLabel: 'المحاضرة 1: Intro & Audience Analysis',
          topic: 'Technical Writing Purpose',
          question: 'What is the primary goal of Technical Report Writing compared to creative writing?',
          options: [
            'To entertain the reader using figurative metaphors and suspense',
            'To convey complex technical information clearly, concisely, and accurately to support decision-making',
            'To write as many pages as possible using complex vocabulary',
            'To hide experimental errors from management'
          ],
          correct: 1,
          explanation: 'الهدف الأساسي للكتابة الفنية هو نقل المعلومات التقنية بدقة ووضوح وإيجاز لمساعدة القارئ في الفهم واتخاذ القرار.'
        },
        {
          id: 'rw-q2',
          lectureId: '2',
          lectureLabel: 'المحاضرة 2: Report Structure & Tone',
          topic: 'Informative vs Descriptive Abstract',
          question: 'Which type of Abstract includes the actual key findings, numerical results, and main conclusions of the report?',
          options: [
            'Descriptive Abstract',
            'Informative Abstract',
            'Table of Contents',
            'Appendix Glossary'
          ],
          correct: 1,
          explanation: 'الملخص الإخباري (Informative Abstract) يلخص المشكلة والمنهجية وأهم النتائج الرقمية والاستنتاجات، بعكس الملخص الوصفي الذي يكتفي بذكر عناوين الموضوعات.'
        },
        {
          id: 'rw-q3',
          lectureId: '3',
          lectureLabel: 'المحاضرة 3: Visuals, Tables & Graphs',
          topic: 'Tables vs Figures Captions',
          question: 'According to standard technical writing conventions, where should captions be placed for Tables and Figures?',
          options: [
            'Table captions go ABOVE the table; Figure captions go BELOW the figure',
            'Both Table and Figure captions go inside the footer',
            'Table captions go BELOW the table; Figure captions go ABOVE the figure',
            'Captions are optional in engineering reports'
          ],
          correct: 0,
          explanation: 'معيار التوثيق الهندسي العالمي يضع عنوان الجدول (Table Caption) أعلى الجدول، وعنوان الشكل التوضيحي (Figure Caption) أسفل الشكل.'
        },
        {
          id: 'rw-q4',
          lectureId: '4',
          lectureLabel: 'المحاضرة 4: Citations (IEEE/APA)',
          topic: 'IEEE Citation Style',
          question: 'How are in-text citations formatted in the IEEE referencing style commonly used in Computer Science and Engineering?',
          options: [
            '(Author, Year) in alphabetical order',
            'Bracketed numbers like [1], [2] numbered in the order they first appear in the text',
            'Superscript Roman numerals at the end of the chapter',
            'Full URLs pasted inside every sentence'
          ],
          correct: 1,
          explanation: 'يعتمد نظام IEEE على وضع أرقام بين قوسين مربعين [1]، [2] مرتبة حسب أول ظهور للمرجع داخل النص.'
        }
      ]
    }
  };

  window.PORTAL_NOTIFICATIONS = PORTAL_NOTIFICATIONS;
  window.COURSE_POWER_DATA = COURSE_POWER_DATA;
})();
