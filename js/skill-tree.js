/**
 * ==============================================================================
 * شجرة مهارات المقررات (Skill Tree / Electronic Circuit Concept Graph)
 * ==============================================================================
 * يحول عرض المحاضرات التقليدي إلى مخطط عقدي تفاعلي (Node Graph) مستوحى من مسارات
 * الدوائر الإلكترونية (PCB Traces)، يوضح المتطلبات السابقة لكل محاضرة ومفهوم،
 * ويضيء العقد المكتملة باللون الأخضر مع فتح المسارات المعتمدة عليها تلقائياً.
 */
(function () {
  'use strict';

  const MILESTONE_STORAGE_KEY = 'sem2_skill_milestones_v1';

  // خريطة المفاهيم والمتطلبات السابقة لكل مقرر (DAG Skill Tree)
  const SKILL_TREE_GRAPHS = {
    'data-structure': {
      subtitle: 'مسار بناء هياكل البيانات في الذاكرة: من المؤشرات (Pointers) وحجز الذاكرة إلى القوائم المتصلة (Linked Lists) وصولاً إلى الأشجار (Trees & BST).',
      nodes: [
        {
          id: '0',
          code: 'NODE 00 • Pointers & Memory',
          shortLabel: 'Pointers & C++ Foundations',
          prereqs: [],
          row: 1,
          col: 'center',
          reason: 'نقطة الانطلاق الأساسية: إتقان الـ Pointers وحجز الذاكرة الديناميكي (new / delete) هو حجر الأساس لبناء أي عقدة (Node) في الهياكل المتقدمة.'
        },
        {
          id: '1',
          code: 'NODE 01 • Arrays & Templates',
          shortLabel: 'Arrays & Templates',
          prereqs: ['0'],
          row: 2,
          col: 1,
          reason: 'مبنية على تأسيس C++ والـ Pointers لفهم تخزين المصفوفات المتجاورة في الذاكرة وبناء القوالب العامة (Templates & ADTs).'
        },
        {
          id: '2',
          code: 'NODE 02 • Linked Lists (SLL/DLL/CLL)',
          shortLabel: 'Linked Lists',
          prereqs: ['0'],
          row: 2,
          col: 2,
          reason: 'مينفعش تذاكر الـ Linked Lists قبل ما تقفل الـ Pointers! لأن ربط العقد ببعضها في الذاكرة بيعتمد كلياً على مؤشرات next و prev.'
        },
        {
          id: '3',
          code: 'NODE 03 • Recursion & Call Stack',
          shortLabel: 'Recursion & Tracing',
          prereqs: ['0', '2'],
          row: 3,
          col: 1,
          reason: 'تتبع الـ Call Stack والـ Recursion على هياكل البيانات (مثل طباعة وعكس Linked List) يتطلب إتقان الـ Pointers والـ Linked Lists.'
        },
        {
          id: '4',
          code: 'NODE 04 • Stacks ADT (LIFO)',
          shortLabel: 'Stacks Data Structure',
          prereqs: ['1', '2'],
          row: 3,
          col: 2,
          reason: 'الـ Stack بيتبني بطريقتين (Array-based و Linked-List-based)؛ لذلك يتطلب إقفال الـ Arrays والـ Linked Lists أولاً.'
        },
        {
          id: '5',
          code: 'NODE 05 • Queues & Priority Queues',
          shortLabel: 'Queues & STL',
          prereqs: ['2', '4'],
          row: 4,
          col: 1,
          reason: 'بناء الطوابير الدائرية (Circular Queues) وطوابير الأولويات يعتمد على إتقان الـ Linked Lists ومقارنة سلوك FIFO مع LIFO في الـ Stacks.'
        },
        {
          id: 'trees',
          isMilestone: true,
          marker: 'T1',
          code: 'APEX NODE • Trees & Binary Search Trees',
          shortLabel: 'Trees & BST',
          title: 'Trees, Binary Trees & Binary Search Trees (BST)',
          arabicTitle: 'الأشجار الثنائية وأشجار البحث (Trees & BST) — عقدة تتويج المفاهيم',
          meta: 'مفهوم متقدم مبني على المسار · Non-Linear Hierarchical Structure',
          topics: [
            'Tree Terminology: Root, Node, Edge, Parent, Leaf, Height & Depth',
            'Binary Tree Node Structure using Left & Right Pointers',
            'Tree Traversals via Recursion: Preorder, Inorder, Postorder',
            'Binary Search Tree (BST): Insertion, Search & Deletion Logic'
          ],
          prereqs: ['0', '2'],
          row: 4,
          col: 2,
          reason: 'مينفعش تذاكر الـ Trees في الـ Data Structures قبل ما تقفل الـ Pointers والـ Linked Lists! كل عقدة في الشجرة بتتكون من مؤشرين (Left/Right Pointers) بنفس فكرة ربط العقد في الـ Linked Lists.'
        }
      ]
    },

    'computer-architecture': {
      subtitle: 'مسار تدفق البيانات داخل المعالج والذاكرة: من بنية معالج IAS ودورة التعليمة إلى هرم الذاكرة (Cache & DRAM) ووحدات الإدخال والإخراج (DMA).',
      nodes: [
        {
          id: '1',
          code: 'NODE 01 • CPU & IAS Evolution',
          shortLabel: 'Basic Concepts & IAS',
          prereqs: [],
          row: 1,
          col: 'center',
          reason: 'نقطة البداية: تأسيس الفرق بين المعمارية والتنظيم وفهم مسجلات معالج IAS الأربعة (MBR, MAR, IR, PC).'
        },
        {
          id: '2',
          code: 'NODE 02 • Instruction Cycle & Buses',
          shortLabel: 'Instruction Cycle & Buses',
          prereqs: ['1'],
          row: 2,
          col: 'center',
          reason: 'مبنية على المحاضرة 1: لا يمكن فهم دورة جلب وتنفيذ التعليمة (Fetch-Execute) والمقاطعات بدون إتقان مسجلات المعالج.'
        },
        {
          id: '3',
          code: 'NODE 03 • Cache Memory & Mapping',
          shortLabel: 'Cache Memory',
          prereqs: ['2'],
          row: 3,
          col: 1,
          reason: 'مينفعش تذاكر الـ Cache Mapping (Direct / Associative) قبل ما تقفل خطوط العناوين والبيانات (Address & Data Bus) في المحاضرة 2.'
        },
        {
          id: '4',
          code: 'NODE 04 • Internal Memory (SRAM/DRAM)',
          shortLabel: 'Internal Memory',
          prereqs: ['2'],
          row: 3,
          col: 2,
          reason: 'مبنية على توصيلات المعالج بالذاكرة لتفكيك خلايا الـ SRAM والـ DRAM وأنواع الـ ROM.'
        },
        {
          id: '5',
          code: 'NODE 05 • External Memory, RAID & DMA',
          shortLabel: 'External Memory & DMA',
          prereqs: ['3', '4'],
          row: 4,
          col: 'center',
          reason: 'عقدة التجميع النهائية: تتطلب إقفال الـ Cache Memory والـ Internal Memory لاستيعاب التسلسل الهرمي الكامل للذاكرة ونقل البيانات عبر الـ DMA.'
        }
      ]
    },

    'computer-graphics': {
      subtitle: 'مسار خوارزميات الرسم الرقمي (Rasterization Pipeline): من فيزياء الشاشات والـ Frame Buffer إلى خوارزميات الخط والدائرة والقطع الناقص.',
      nodes: [
        {
          id: '1',
          code: 'NODE 01 • Graphics Pipeline',
          shortLabel: 'Intro & Pipeline',
          prereqs: [],
          row: 1,
          col: 1,
          reason: 'نقطة الانطلاق: فهم مراحل الـ Graphics Pipeline والفرق بين الرسم بالحاسوب ومعالجة الصور.'
        },
        {
          id: '2',
          code: 'NODE 02 • Raster Scan & Frame Buffer',
          shortLabel: 'Displays & Frame Buffer',
          prereqs: ['1'],
          row: 1,
          col: 2,
          reason: 'مبنية على المحاضرة 1: توضح كيف تتحول المشاهد إلى مصفوفة بكسلات داخل الـ Frame Buffer على شاشات الـ Raster.'
        },
        {
          id: '3',
          code: 'NODE 03 • Line Drawing (DDA & Bresenham)',
          shortLabel: 'DDA & Bresenham Line',
          prereqs: ['2'],
          row: 2,
          col: 'center',
          reason: 'مينفعش تذاكر خوارزميات رسم الخط (DDA & Bresenham) قبل ما تقفل شبكة البكسلات والـ Frame Buffer في المحاضرة 2.'
        },
        {
          id: '4',
          code: 'NODE 04 • Midpoint Circle Algorithm',
          shortLabel: 'Midpoint Circle',
          prereqs: ['3'],
          row: 3,
          col: 1,
          reason: 'مبنية مباشرة على فكرة معامل القرار (Decision Parameter P) اللي اتأسست في خوارزمية Bresenham بالمحاضرة 3.'
        },
        {
          id: '5',
          code: 'NODE 05 • Midpoint Ellipse Algorithm',
          shortLabel: 'Midpoint Ellipse',
          prereqs: ['3', '4'],
          row: 3,
          col: 2,
          reason: 'مينفعش تذاكر الـ Midpoint Ellipse (المنطقة 1 والمنطقة 2) قبل ما تقفل اشتقاق معامل القرار والتماثل في خوارزمية الدائرة (Midpoint Circle).'
        }
      ]
    },

    'database-systems': {
      subtitle: 'مسار هندسة قواعد البيانات: من مفاهيم الـ DBMS ومعمارية الـ Three-Schema إلى نمذجة الكيانات والعلاقات (ER Diagrams).',
      nodes: [
        {
          id: '2',
          code: 'NODE 01 • Databases & DBMS Users',
          shortLabel: 'Databases & Users',
          prereqs: [],
          row: 1,
          col: 1,
          reason: 'نقطة الانطلاق الأولى: تأسيس مفاهيم الـ Mini-world والـ DBMS والـ Meta-data وتصنيف المستخدمين.'
        },
        {
          id: '3',
          code: 'NODE 02 • Three-Schema Architecture',
          shortLabel: 'Concepts & 3-Schema',
          prereqs: [],
          row: 1,
          col: 2,
          reason: 'الركيزة المعمارية: فهم نماذج البيانات (Conceptual / Logical / Physical) واستقلالية البيانات (Data Independence).'
        },
        {
          id: '4',
          code: 'NODE 03 • Elmasri Textbook & SQL Core',
          shortLabel: 'Elmasri Reference',
          prereqs: ['2', '3'],
          row: 2,
          col: 1,
          reason: 'يتطلب إتمام مفاهيم الـ DBMS ومعمارية الـ Three-Schema للاستفادة من الفصول المرجعية والنماذج العلائقية.'
        },
        {
          id: '5',
          code: 'NODE 04 • ER Data Modeling (Lec 4 & 5)',
          shortLabel: 'ER Model & Diagrams',
          prereqs: ['2', '3'],
          row: 2,
          col: 2,
          reason: 'مينفعش تذاكر الـ ER Model وتصميم الكيانات والعلاقات قبل ما تقفل الـ Conceptual Schema والـ Data Models في المحاضرتين السابقتين.'
        }
      ]
    },

    'operating-system': {
      subtitle: 'مسار قلب نظام التشغيل (Kernel Path): من بنية العتاد والـ Interrupts إلى استدعاءات النظام (System Calls) وإدارة العمليات (Processes & PCB).',
      nodes: [
        {
          id: '1',
          code: 'NODE 01 • OS Core, Dual-Mode & Interrupts',
          shortLabel: 'Intro & Dual-Mode',
          prereqs: [],
          row: 1,
          col: 'center',
          reason: 'نقطة البداية: فهم دور نظام التشغيل، آلية المقاطعات (Interrupts)، والفرق بين User Mode و Kernel Mode.'
        },
        {
          id: '2',
          code: 'NODE 02 • System Calls & Kernel Design',
          shortLabel: 'System Calls & Structures',
          prereqs: ['1'],
          row: 2,
          col: 1,
          reason: 'مبنية على الفصل الأول: استدعاءات النظام (System Calls) هي البوابة البرمجية للانتقال من User Mode إلى Kernel Mode عبر Trap/Interrupt.'
        },
        {
          id: '3',
          code: 'NODE 03 • Processes, PCB & Scheduling',
          shortLabel: 'Processes & IPC',
          prereqs: ['1', '2'],
          row: 2,
          col: 2,
          reason: 'مينفعش تذاكر دورة حياة الـ Process والـ Context Switch والـ fork/exec قبل ما تقفل الـ Interrupts والـ System Calls.'
        }
      ]
    },

    'report-writing': {
      subtitle: 'مسار التوثيق الهندسي والعلمي: من تحليل الجمهور والتخطيط إلى هيكلة التقرير، عرض البيانات بصرياً، ومعايير التوثيق العالمية (IEEE/APA).',
      nodes: [
        {
          id: '1',
          code: 'NODE 01 • Technical Writing Foundations',
          shortLabel: 'Intro & Audience Analysis',
          prereqs: [],
          row: 1,
          col: 'center',
          reason: 'نقطة البداية: إتقان معايير الكتابة الفنية (الدقة، الوضوح، الإيجاز) وتحليل الجمهور المستهدف.'
        },
        {
          id: '2',
          code: 'NODE 02 • Report Structure & Tone',
          shortLabel: 'Report Structure',
          prereqs: ['1'],
          row: 2,
          col: 1,
          reason: 'مبنية على المحاضرة 1: تقسيم التقرير (Abstract, Methodology, Results) يعتمد على تحديد الهدف والجمهور أولاً.'
        },
        {
          id: '3',
          code: 'NODE 03 • Visuals, Tables & Graphs',
          shortLabel: 'Data Presentation & Graphs',
          prereqs: ['1'],
          row: 2,
          col: 2,
          reason: 'مبنية على المحاضرة 1: تحويل البيانات المعقدة إلى جداول ورسوم بيانية واضحة دون تضليل بصري.'
        },
        {
          id: '4',
          code: 'NODE 04 • Citations (IEEE/APA) & Checklist',
          shortLabel: 'Citations & Summary',
          prereqs: ['2', '3'],
          row: 3,
          col: 1,
          reason: 'تجميع ومراجعة التقرير النهائي وتوثيق المراجع يتطلب إقفال هيكل التقرير والرسوم التوضيحية أولاً.'
        },
        {
          id: '5',
          code: 'NODE 05 • Presentation & Full Reference',
          shortLabel: 'Presentation Skills',
          prereqs: ['4'],
          row: 3,
          col: 2,
          reason: 'مهارات العرض التقديمي الشفهي وتصميم الشرائح تأتي كخطوة تتويجية بعد اكتمال كتابة ومراجعة التقرير الفني.'
        }
      ]
    }
  };

  let milestoneMemory = {};

  function readMilestones() {
    try {
      const saved = window.PortalStorage?.getJSON(MILESTONE_STORAGE_KEY, null);
      if (saved && typeof saved === 'object') {
        milestoneMemory = { ...milestoneMemory, ...saved };
      }
    } catch {
      // Ignore storage access errors in restricted modes
    }
    return milestoneMemory;
  }

  function writeMilestone(courseId, nodeId, completed) {
    const current = readMilestones();
    const key = `${courseId}:${nodeId}`;
    if (completed) current[key] = true;
    else delete current[key];
    milestoneMemory = current;
    try {
      window.PortalStorage?.setJSON(MILESTONE_STORAGE_KEY, current);
    } catch {
      // Session fallback remains in milestoneMemory
    }
  }

  function isMilestoneComplete(courseId, nodeId) {
    const current = readMilestones();
    return Boolean(current[`${courseId}:${nodeId}`]);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]));
  }

  function getContentKey(courseId, lectureId) {
    if (window.PortalCatalog && typeof window.PortalCatalog.key === 'function') {
      return window.PortalCatalog.key(courseId, 'lecture', lectureId);
    }
    return JSON.stringify([String(courseId), 'lecture', String(lectureId)]);
  }

  function isLectureComplete(courseId, lectureId) {
    const key = getContentKey(courseId, lectureId);
    const item = window.PortalStudyState?.getItem(key);
    return Boolean(item?.manualComplete || item?.quiz?.lastCompleted);
  }

  function initSkillTree() {
    if (document.body.dataset.page !== 'subject') return;

    const courseId = new URL(window.location.href).searchParams.get('id') || window.COURSES_DATA?.[0]?.id;
    const course = window.COURSES_DATA?.find(c => c.id === courseId);
    const lecturesList = document.getElementById('lectures-list');
    if (!course || !lecturesList) return;

    const graphConfig = SKILL_TREE_GRAPHS[course.id];
    if (!graphConfig) return;

    const lecturesPanel = lecturesList.parentElement;
    if (!lecturesPanel) return;

    // 1. إنشاء لوحة تحكم شجرة المهارات (HUD) أعلى شبكة المحاضرات
    let hud = lecturesPanel.querySelector('.skill-tree-hud');
    if (!hud) {
      hud = document.createElement('div');
      hud.className = 'skill-tree-hud';
      hud.setAttribute('role', 'region');
      hud.setAttribute('aria-label', 'شجرة مهارات المقرر ومسار المفاهيم');
      hud.innerHTML = `
        <div class="skill-tree-hud-top">
          <div class="skill-tree-hud-title-group">
            <div class="skill-tree-hud-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><circle cx="20" cy="18" r="3"/><path d="M14.47 14.48 20 20"/><path d="M8.12 8.12 12 12"/></svg>
            </div>
            <div class="skill-tree-hud-copy">
              <span class="skill-tree-hud-eyebrow">⚡ Skill Tree &amp; Electronic Concept Graph</span>
              <h4>شجرة مهارات المقرر ومسار تسلسل المفاهيم</h4>
              <p>${escapeHtml(graphConfig.subtitle)}</p>
            </div>
          </div>
          <div class="skill-tree-hud-actions">
            <button type="button" class="skill-reset-btn" id="skill-tree-reset-btn" title="إعادة ضبط تقدم شجرة المهارات لهذه المادة">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              <span>إعادة ضبط المسار</span>
            </button>
          </div>
        </div>
        <div class="skill-tree-telemetry">
          <div class="skill-tree-telemetry-row">
            <div class="skill-tree-progress-stat">
              <span id="skill-tree-progress-label">0 من 0 عقد مكتملة</span>
              <span class="skill-tree-progress-pct" id="skill-tree-progress-pct">0%</span>
            </div>
            <div class="skill-tree-legend" aria-label="دليل حالات العقد">
              <span class="skill-legend-item"><span class="skill-legend-dot is-done" aria-hidden="true"></span><span>مكتملة (تنور بالأخضر)</span></span>
              <span class="skill-legend-item"><span class="skill-legend-dot is-open" aria-hidden="true"></span><span>متاحة للمذاكرة</span></span>
              <span class="skill-legend-item"><span class="skill-legend-dot is-lock" aria-hidden="true"></span><span>مقفلة (تتطلب ما قبلها)</span></span>
            </div>
          </div>
          <div class="skill-tree-meter" aria-hidden="true">
            <div class="skill-tree-meter-fill" id="skill-tree-meter-fill" style="width: 0%;"></div>
          </div>
        </div>
        <div class="skill-tree-alert" id="skill-tree-alert" role="status" aria-live="polite" data-alert-tone="info">
          <span class="skill-tree-alert-text" id="skill-tree-alert-text">ابدأ بالعقدة المفتوحة في بداية المسار، وعند إتمامها ستضيء باللون الأخضر وتفتح العقد المبنية عليها.</span>
        </div>
      `;
      lecturesList.before(hud);
    }

    lecturesList.classList.add('skill-tree-board');

    // إنشاء طبقة مسارات الدوائر الإلكترونية (SVG Circuit Layer)
    let svg = lecturesList.querySelector('.skill-tree-svg');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('skill-tree-svg');
      svg.setAttribute('aria-hidden', 'true');
      lecturesList.prepend(svg);
    }

    const nodeMetaMap = new Map(graphConfig.nodes.map(n => [String(n.id), n]));
    const dependentsMap = new Map();
    for (const node of graphConfig.nodes) {
      dependentsMap.set(String(node.id), []);
    }
    for (const node of graphConfig.nodes) {
      for (const prereqId of node.prereqs) {
        const list = dependentsMap.get(String(prereqId)) || [];
        list.push(node);
        dependentsMap.set(String(prereqId), list);
      }
    }

    let highlightedTargetId = null;
    let highlightTimer = null;
    let internalMutating = false;

    function isNodeDone(nodeId) {
      const meta = nodeMetaMap.get(String(nodeId));
      if (!meta) return false;
      if (meta.isMilestone) return isMilestoneComplete(course.id, nodeId);
      return isLectureComplete(course.id, nodeId);
    }

    function getCompletedSet() {
      const done = new Set();
      for (const node of graphConfig.nodes) {
        if (isNodeDone(node.id)) done.add(String(node.id));
      }
      return done;
    }

    function getNodeState(nodeId, doneSet) {
      const meta = nodeMetaMap.get(String(nodeId));
      if (!meta) return { status: 'unlocked', missing: [] };
      if (doneSet.has(String(nodeId))) {
        return { status: 'completed', missing: [] };
      }
      const missing = meta.prereqs.filter(p => !doneSet.has(String(p)));
      if (missing.length === 0) {
        return { status: 'unlocked', missing: [] };
      }
      return { status: 'locked', missing };
    }

    function ensureMilestoneNodes() {
      for (const meta of graphConfig.nodes) {
        if (!meta.isMilestone) continue;
        let milestoneEl = lecturesList.querySelector(`[data-skill-node-id="${meta.id}"]`);
        if (!milestoneEl) {
          milestoneEl = document.createElement('div');
          milestoneEl.className = 'skill-milestone-node skill-node';
          milestoneEl.dataset.a1Row = 'true';
          milestoneEl.dataset.skillNodeId = String(meta.id);
          milestoneEl.dataset.milestoneNode = 'true';

          const topicsList = (meta.topics || []).map(t => `<span class="text-[11px] px-2.5 py-0.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]">${escapeHtml(t)}</span>`).join('');

          milestoneEl.innerHTML = `
            <span class="atlas-source-marker" aria-hidden="true">${escapeHtml(meta.marker || '★')}</span>
            <div class="a1-source-copy">
              <h4 dir="auto">${escapeHtml(meta.title)}</h4>
              <p>${escapeHtml(meta.arabicTitle)}</p>
              <p class="a1-source-meta">${escapeHtml(meta.meta || 'عقدة مفاهيم متقدمة')}</p>
            </div>
            <div class="a1-source-actions">
              <button type="button" class="a1-action-primary studio-button" data-open-milestone-exp="${escapeHtml(meta.id)}">
                استكشاف شرح المفهوم التفاعلي
              </button>
            </div>
            <details class="a1-source-details">
              <summary>التفاصيل والمحاور</summary>
              <div class="mt-3 pt-3 border-t border-[var(--border-subtle)]">
                <div class="flex flex-wrap gap-1.5">${topicsList}</div>
              </div>
            </details>
          `;
          lecturesList.append(milestoneEl);
        }
      }
    }

    function setAlert(message, tone = 'info', jumpTargetId = null, jumpLabel = '') {
      const alertBox = document.getElementById('skill-tree-alert');
      if (!alertBox) return;
      alertBox.dataset.alertTone = tone;
      const jumpHtml = jumpTargetId
        ? `<button type="button" class="skill-alert-jump-btn" data-jump-skill-node="${escapeHtml(jumpTargetId)}">${escapeHtml(jumpLabel || 'الانتقال للمتطلب السابق ↰')}</button>`
        : '';
      alertBox.innerHTML = `<span class="skill-tree-alert-text">${escapeHtml(message)}</span>${jumpHtml}`;
    }

    function focusAndScrollNode(nodeId) {
      const targetEl = lecturesList.querySelector(`[data-skill-node-id="${nodeId}"]`);
      if (!targetEl) return;
      const header = document.querySelector('header');
      const offset = header ? header.getBoundingClientRect().height + 20 : 90;
      const rect = targetEl.getBoundingClientRect();
      window.scrollTo({
        top: Math.max(0, window.scrollY + rect.top - offset),
        behavior: document.body.dataset.motion === 'reduced' ? 'instant' : 'smooth'
      });
      if (!targetEl.hasAttribute('tabindex')) targetEl.setAttribute('tabindex', '-1');
      targetEl.focus({ preventScroll: true });
    }

    function triggerLockedWarning(nodeId) {
      const meta = nodeMetaMap.get(String(nodeId));
      if (!meta) return;
      const doneSet = getCompletedSet();
      const { missing } = getNodeState(nodeId, doneSet);
      if (missing.length === 0) return;

      const missingNames = missing.map(id => nodeMetaMap.get(String(id))?.shortLabel || `محاضرة ${id}`).join(' + ');
      const firstMissing = missing[0];
      const firstMissingMeta = nodeMetaMap.get(String(firstMissing));

      setAlert(
        `⚡ مسار إلكتروني مغلق: مينفعش تذاكر «${meta.shortLabel}» قبل ما تقفل «${missingNames}» الأول! خلّص العقدة المطلوبة عشان تنور بالأخضر وتفتح المسار ده.`,
        'warning',
        firstMissing,
        `الانتقال إلى ${firstMissingMeta?.shortLabel || 'المتطلب'} ↰`
      );

      const lockedEl = lecturesList.querySelector(`[data-skill-node-id="${nodeId}"]`);
      if (lockedEl) {
        lockedEl.classList.remove('is-shaking');
        void lockedEl.offsetWidth;
        lockedEl.classList.add('is-shaking');
      }

      highlightedTargetId = String(nodeId);
      lecturesList.querySelectorAll('.skill-node').forEach(el => {
        el.classList.toggle('is-prereq-target', missing.includes(el.dataset.skillNodeId));
      });
      drawCircuit();

      if (highlightTimer) clearTimeout(highlightTimer);
      highlightTimer = setTimeout(() => {
        highlightedTargetId = null;
        lecturesList.querySelectorAll('.skill-node.is-prereq-target').forEach(el => el.classList.remove('is-prereq-target'));
        drawCircuit();
      }, 3600);
    }

    function toggleNodeCompletion(nodeId) {
      const meta = nodeMetaMap.get(String(nodeId));
      if (!meta) return;

      const beforeDone = getCompletedSet();
      const state = getNodeState(nodeId, beforeDone);
      if (state.status === 'locked') {
        triggerLockedWarning(nodeId);
        return;
      }

      const wasCompleted = state.status === 'completed';
      const nextCompleted = !wasCompleted;

      // حساب العقد التي كانت مقفلة قبل التحديث
      const previouslyLocked = graphConfig.nodes
        .filter(n => getNodeState(n.id, beforeDone).status === 'locked')
        .map(n => String(n.id));

      if (meta.isMilestone) {
        writeMilestone(course.id, nodeId, nextCompleted);
      } else {
        const key = getContentKey(course.id, nodeId);
        const existing = window.PortalStudyState?.getItem(key);
        const patch = {
          manualComplete: nextCompleted,
          startedAt: existing?.startedAt || new Date().toISOString()
        };
        if (existing?.reader) patch.reader = existing.reader;
        if (existing?.quiz) patch.quiz = existing.quiz;
        window.PortalStudyState?.updateItem(key, patch);
      }

      syncSkillTree();

      if (nextCompleted) {
        const afterDone = getCompletedSet();
        const newlyUnlocked = previouslyLocked
          .filter(id => getNodeState(id, afterDone).status === 'unlocked')
          .map(id => nodeMetaMap.get(id)?.shortLabel || `عقدة ${id}`);

        if (newlyUnlocked.length > 0) {
          setAlert(
            `🟢 عاااش! العقدة «${meta.shortLabel}» نورت باللون الأخضر وفتحتلك المسار لـ: ${newlyUnlocked.join(' ، ')}!`,
            'success'
          );
        } else {
          setAlert(
            `🟢 تم إقفال «${meta.shortLabel}» بنجاح ونورت باللون الأخضر في شجرة المهارات!`,
            'success'
          );
        }
      } else {
        setAlert(
          `تم إلغاء إتمام «${meta.shortLabel}» — أعد إقفالها لإضاءة المسار وفتح العقد المعتمدة عليها.`,
          'info'
        );
      }
    }

    function decorateSkillNodes() {
      internalMutating = true;
      try {
        if (!lecturesList.querySelector('.skill-tree-svg')) {
          lecturesList.prepend(svg);
        }
        ensureMilestoneNodes();

        const rows = [...lecturesList.querySelectorAll(':scope > .a1-source-row, :scope > .skill-milestone-node')];
        for (const row of rows) {
          let nodeId = row.dataset.skillNodeId;
          if (!nodeId) {
            const rawKey = row.getAttribute('data-content-key') || row.dataset.contentKey;
            if (rawKey) {
              try {
                const parsed = JSON.parse(rawKey);
                if (Array.isArray(parsed) && parsed[2] !== undefined) {
                  nodeId = String(parsed[2]);
                }
              } catch {
                // fallback
              }
            }
          }
          if (!nodeId) continue;

          row.dataset.skillNodeId = nodeId;
          row.classList.add('skill-node');

          const meta = nodeMetaMap.get(nodeId);
          if (meta) {
            row.style.setProperty('--node-row', String(meta.row));
            if (meta.col === 'center') {
              row.dataset.nodeSpan = 'center';
              row.style.removeProperty('--node-col');
            } else {
              delete row.dataset.nodeSpan;
              row.style.setProperty('--node-col', String(meta.col));
            }
          }

          // إضافة منافذ الدائرة الإلكترونية (PCB Ports)
          if (!row.querySelector('.skill-port-in')) {
            const portIn = document.createElement('span');
            portIn.className = 'skill-port skill-port-in';
            portIn.setAttribute('aria-hidden', 'true');
            const portOut = document.createElement('span');
            portOut.className = 'skill-port skill-port-out';
            portOut.setAttribute('aria-hidden', 'true');
            row.append(portIn, portOut);
          }

          // إضافة شريط معلومات العقدة والمتطلبات (Chrome)
          if (!row.querySelector('.skill-node-chrome')) {
            const chrome = document.createElement('div');
            chrome.className = 'skill-node-chrome';
            row.prepend(chrome);
          }

          // إضافة شريط أزرار الإتمام / القفل أسفل العقدة
          if (!row.querySelector('.skill-node-control-bar')) {
            const controlBar = document.createElement('div');
            controlBar.className = 'skill-node-control-bar';
            row.append(controlBar);
          }
        }
      } finally {
        internalMutating = false;
      }
    }

    function syncSkillTree() {
      decorateSkillNodes();

      const doneSet = getCompletedSet();
      const totalNodes = graphConfig.nodes.length;
      const doneCount = doneSet.size;
      const pct = totalNodes > 0 ? Math.round((doneCount / totalNodes) * 100) : 0;

      const labelEl = document.getElementById('skill-tree-progress-label');
      const pctEl = document.getElementById('skill-tree-progress-pct');
      const fillEl = document.getElementById('skill-tree-meter-fill');
      if (labelEl) labelEl.textContent = `${doneCount} من ${totalNodes} عقد مكتملة`;
      if (pctEl) pctEl.textContent = `${pct}%`;
      if (fillEl) fillEl.style.width = `${pct}%`;

      internalMutating = true;
      try {
        for (const meta of graphConfig.nodes) {
          const nodeId = String(meta.id);
          const row = lecturesList.querySelector(`[data-skill-node-id="${nodeId}"]`);
          if (!row) continue;

          const { status, missing } = getNodeState(nodeId, doneSet);
          row.classList.toggle('is-completed', status === 'completed');
          row.classList.toggle('is-unlocked', status === 'unlocked');
          row.classList.toggle('is-locked', status === 'locked');
          row.dataset.skillStatus = status;

          const portIn = row.querySelector('.skill-port-in');
          const portOut = row.querySelector('.skill-port-out');
          if (portIn) portIn.hidden = meta.prereqs.length === 0;
          const dependents = dependentsMap.get(nodeId) || [];
          if (portOut) portOut.hidden = dependents.length === 0;

          const statusText = status === 'completed'
            ? '✓ مكتملة • المسار مضاء بالأخضر'
            : status === 'unlocked'
              ? '⚡ متاحة للمذاكرة الآن'
              : '🔒 مقفلة • أكمل المتطلبات أولاً';

          // بناء شرائح المتطلبات السابقة
          let prereqsHtml = '';
          if (meta.prereqs.length === 0) {
            prereqsHtml = `
              <div class="skill-deps-row">
                <span class="skill-deps-label">نقطة البداية:</span>
                <span class="skill-unlocks-tag">⚡ عقدة تأسيسية مفتوحة تلقائياً</span>
              </div>
            `;
          } else {
            const chips = meta.prereqs.map(pId => {
              const pMeta = nodeMetaMap.get(String(pId));
              const isMet = doneSet.has(String(pId));
              const icon = isMet ? '✓' : '🔒';
              return `<button type="button" class="skill-prereq-chip ${isMet ? 'is-met' : 'is-missing'}" data-jump-skill-node="${escapeHtml(pId)}" title="الانتقال إلى ${escapeHtml(pMeta?.shortLabel || pId)}"><span>${icon}</span><span>${escapeHtml(pMeta?.shortLabel || `محاضرة ${pId}`)}</span></button>`;
            }).join('');
            prereqsHtml = `
              <div class="skill-deps-row">
                <span class="skill-deps-label">مبني على:</span>
                ${chips}
              </div>
            `;
          }

          // بناء شرائح العقد التي تفتحها هذه العقدة
          let unlocksHtml = '';
          if (dependents.length > 0) {
            const tags = dependents.map(d => `<span class="skill-unlocks-tag">↳ ${escapeHtml(d.shortLabel)}</span>`).join('');
            unlocksHtml = `
              <div class="skill-deps-row">
                <span class="skill-deps-label">يفتح بعدها:</span>
                ${tags}
              </div>
            `;
          }

          // بناء شارة ترتيب الدكتور الرسمي مقابل شجرة المفاهيم
          const lectureIdx = (course.lectures || []).findIndex(l => String(l.id) === nodeId);
          const lectureObj = lectureIdx >= 0 ? course.lectures[lectureIdx] : null;
          const doctorOrderText = meta.isMilestone
            ? '✨ عقدة مفاهيم إضافية — تأتي بعد المحاضرات الحالية للدكتور'
            : `📌 ترتيب الدكتور الرسمي: #${lectureIdx + 1} (${lectureObj?.date || lectureObj?.chapter || `محاضرة ${nodeId}`})`;
          const doctorOrderHtml = `
            <div class="skill-deps-row">
              <span class="skill-deps-label">ترتيب المنهج:</span>
              <span class="skill-unlocks-tag">${escapeHtml(doctorOrderText)}</span>
            </div>
          `;

          const chrome = row.querySelector('.skill-node-chrome');
          if (chrome) {
            chrome.innerHTML = `
              <div class="skill-node-header-bar">
                <span class="skill-node-chip-id" dir="ltr">${escapeHtml(meta.code)}</span>
                <span class="skill-node-status-pill">${escapeHtml(statusText)}</span>
              </div>
              <div class="skill-node-deps-box">
                ${doctorOrderHtml}
                ${prereqsHtml}
                ${unlocksHtml}
                <p class="skill-node-reason">${escapeHtml(meta.reason)}</p>
              </div>
            `;
          }

          const controlBar = row.querySelector('.skill-node-control-bar');
          if (controlBar) {
            if (status === 'locked') {
              const missingLabels = missing.map(id => nodeMetaMap.get(String(id))?.shortLabel || `محاضرة ${id}`).join(' + ');
              controlBar.innerHTML = `
                <button type="button" class="skill-lock-gate-btn" data-locked-gate="${escapeHtml(nodeId)}">
                  <span>🔒 مقفلة: يجب إقفال (${escapeHtml(missingLabels)}) أولاً — اضغط لتتبع المسار</span>
                </button>
              `;
            } else if (status === 'completed') {
              controlBar.innerHTML = `
                <button type="button" class="skill-complete-btn is-done" data-complete-node="${escapeHtml(nodeId)}" aria-pressed="true">
                  <span>✓ تم إتقان العقدة وإضاءة المسار (اضغط لإلغاء الإتمام)</span>
                </button>
              `;
            } else {
              controlBar.innerHTML = `
                <button type="button" class="skill-complete-btn" data-complete-node="${escapeHtml(nodeId)}" aria-pressed="false">
                  <span>إتمام العقدة وإضاءة المسار التالي بالأخضر ✓</span>
                </button>
              `;
            }
          }
        }
      } finally {
        internalMutating = false;
      }

      drawCircuit();
    }

    function buildPcbPath(x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;

      // إذا كانت العقدتان على نفس العمود تقريباً
      if (Math.abs(dx) < 14) {
        return {
          d: `M ${x1} ${y1} L ${x2} ${y2}`,
          joints: [[(x1 + x2) / 2, (y1 + y2) / 2]]
        };
      }

      // إذا كانت العقدتان في نفس الصف (أفقياً)
      if (Math.abs(dy) < 28) {
        const midX = (x1 + x2) / 2;
        return {
          d: `M ${x1} ${y1} C ${midX} ${y1 - 22}, ${midX} ${y2 - 22}, ${x2} ${y2}`,
          joints: [[midX, (y1 + y2) / 2 - 16]]
        };
      }

      // مسار دائرة إلكترونية (PCB Trace) بزوايا 45 درجة مشطوفة (Chamfered Corners)
      const midY = y1 + dy * 0.5;
      const chamfer = Math.min(14, Math.abs(dx) * 0.25, Math.abs(dy) * 0.22);
      const dirX = dx > 0 ? 1 : -1;
      const dirY = dy > 0 ? 1 : -1;

      const p1y = midY - dirY * chamfer;
      const p2x = x1 + dirX * chamfer;
      const p3x = x2 - dirX * chamfer;
      const p4y = midY + dirY * chamfer;

      const d = [
        `M ${x1} ${y1}`,
        `L ${x1} ${p1y}`,
        `L ${p2x} ${midY}`,
        `L ${p3x} ${midY}`,
        `L ${x2} ${p4y}`,
        `L ${x2} ${y2}`
      ].join(' ');

      return {
        d,
        joints: [
          [p2x, midY],
          [p3x, midY]
        ]
      };
    }

    function drawCircuit() {
      if (!svg || !lecturesList.getClientRects().length) return;
      const boardBox = lecturesList.getBoundingClientRect();
      if (!boardBox.width || !boardBox.height) return;

      svg.setAttribute('viewBox', `0 0 ${boardBox.width} ${boardBox.height}`);
      svg.replaceChildren();

      const doneSet = getCompletedSet();
      const highlightMissing = highlightedTargetId
        ? new Set(getNodeState(highlightedTargetId, doneSet).missing.map(String))
        : new Set();

      for (const toMeta of graphConfig.nodes) {
        const toId = String(toMeta.id);
        const toEl = lecturesList.querySelector(`[data-skill-node-id="${toId}"]`);
        if (!toEl) continue;

        const toPort = toEl.querySelector('.skill-port-in') || toEl;
        const toBox = toPort.getBoundingClientRect();
        const x2 = toBox.left - boardBox.left + toBox.width / 2;
        const y2 = toBox.top - boardBox.top + toBox.height / 2;

        for (const rawFromId of toMeta.prereqs) {
          const fromId = String(rawFromId);
          const fromEl = lecturesList.querySelector(`[data-skill-node-id="${fromId}"]`);
          if (!fromEl) continue;

          const fromPort = fromEl.querySelector('.skill-port-out') || fromEl;
          const fromBox = fromPort.getBoundingClientRect();
          const x1 = fromBox.left - boardBox.left + fromBox.width / 2;
          const y1 = fromBox.top - boardBox.top + fromBox.height / 2;

          const { d, joints } = buildPcbPath(x1, y1, x2, y2);
          const isEnergized = doneSet.has(fromId);
          const isPrereqPulse = highlightedTargetId === toId && highlightMissing.has(fromId);

          const basePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          basePath.setAttribute('d', d);
          basePath.setAttribute('class', 'skill-trace-base');
          svg.append(basePath);

          const livePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          livePath.setAttribute('d', d);
          livePath.dataset.from = fromId;
          livePath.dataset.to = toId;
          livePath.setAttribute(
            'class',
            'skill-trace-live' +
              (isEnergized ? ' is-energized' : '') +
              (isPrereqPulse ? ' is-prereq-highlight' : '')
          );
          svg.append(livePath);

          for (const [jx, jy] of [[x1, y1], ...joints, [x2, y2]]) {
            const via = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            via.setAttribute('cx', String(jx));
            via.setAttribute('cy', String(jy));
            via.setAttribute('r', '4');
            via.setAttribute(
              'class',
              'skill-circuit-via' +
                (isEnergized ? ' is-energized' : '') +
                (isPrereqPulse ? ' is-prereq-highlight' : '')
            );
            svg.append(via);
          }
        }
      }
    }

    // التعامل مع نقرات المستخدم داخل شجرة المهارات ولوحة التحكم
    lecturesPanel.addEventListener('click', event => {
      const completeBtn = event.target.closest('[data-complete-node]');
      if (completeBtn) {
        event.preventDefault();
        toggleNodeCompletion(completeBtn.dataset.completeNode);
        return;
      }

      const lockGateBtn = event.target.closest('[data-locked-gate]');
      if (lockGateBtn) {
        event.preventDefault();
        triggerLockedWarning(lockGateBtn.dataset.lockedGate);
        return;
      }

      const jumpBtn = event.target.closest('[data-jump-skill-node]');
      if (jumpBtn) {
        event.preventDefault();
        focusAndScrollNode(jumpBtn.dataset.jumpSkillNode);
        return;
      }

      const milestoneExpBtn = event.target.closest('[data-open-milestone-exp]');
      if (milestoneExpBtn) {
        event.preventDefault();
        const nodeId = milestoneExpBtn.dataset.openMilestoneExp;
        const doneSet = getCompletedSet();
        if (getNodeState(nodeId, doneSet).status === 'locked') {
          triggerLockedWarning(nodeId);
          return;
        }
        const expBtn = document.getElementById('exp-main-btn');
        if (expBtn && expBtn.href) {
          window.open(expBtn.href, '_blank', 'noopener,noreferrer');
        }
        return;
      }

      if (event.target.closest('#skill-tree-reset-btn')) {
        event.preventDefault();
        for (const meta of graphConfig.nodes) {
          if (meta.isMilestone) {
            writeMilestone(course.id, meta.id, false);
          } else {
            const key = getContentKey(course.id, meta.id);
            const existing = window.PortalStudyState?.getItem(key);
            if (existing?.manualComplete) {
              const patch = { manualComplete: false };
              if (existing.startedAt) patch.startedAt = existing.startedAt;
              if (existing.reader) patch.reader = existing.reader;
              if (existing.quiz) patch.quiz = existing.quiz;
              window.PortalStudyState?.updateItem(key, patch);
            }
          }
        }
        syncSkillTree();
        setAlert('تمت إعادة ضبط شجرة المهارات — ابدأ من العقدة الأولى لإضاءة المسار من جديد.', 'info');
        return;
      }

      // اعتراض محاولة فتح محاضرة مقفلة وتوجيه الطالب للمتطلب السابق
      const actionControl = event.target.closest('.a1-source-actions a, .a1-source-actions button');
      if (actionControl && !actionControl.matches('[data-os-course-link]')) {
        const parentNode = actionControl.closest('.skill-node');
        if (parentNode && parentNode.classList.contains('is-locked')) {
          event.preventDefault();
          event.stopImmediatePropagation();
          triggerLockedWarning(parentNode.dataset.skillNodeId);
        }
      }
    }, true);

    // إعادة رسم مسارات الدائرة عند فتح أو إغلاق التفاصيل
    lecturesList.addEventListener('toggle', () => {
      window.requestAnimationFrame(drawCircuit);
    }, true);

    // مراقبة تغير حجم الشبكة
    const resizeObserver = new window.ResizeObserver(() => {
      drawCircuit();
    });
    resizeObserver.observe(lecturesList);

    // مراقبة إعادة رندر المحاضرات عند تغيير بروفايل الطالب
    const mutationObserver = new window.MutationObserver(() => {
      if (internalMutating) return;
      syncSkillTree();
    });
    mutationObserver.observe(lecturesList, { childList: true });

    // الاشتراك في تحديثات حالة المذاكرة
    const unsubscribeState = window.PortalStudyState?.subscribe
      ? window.PortalStudyState.subscribe(() => syncSkillTree())
      : null;

    window.addEventListener('portal:family-changed', () => {
      window.requestAnimationFrame(drawCircuit);
    });

    window.addEventListener('portal:content-ready', () => {
      syncSkillTree();
    });

    window.addEventListener('pagehide', () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      if (typeof unsubscribeState === 'function') unsubscribeState();
    });

    window.addEventListener('pageshow', () => {
      resizeObserver.observe(lecturesList);
      mutationObserver.observe(lecturesList, { childList: true });
      syncSkillTree();
    });

    syncSkillTree();
  }

  document.addEventListener('DOMContentLoaded', initSkillTree);
})();
