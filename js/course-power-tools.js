/**
 * ==============================================================================
 * الأدوات الذكية: الشرح التفاعلي + محاكي الميدتيرم + مؤقت المذاكرة + جرس التنبيهات
 * ==============================================================================
 */
(function () {
  'use strict';

  const READ_NOTIFS_KEY = 'sem2_read_notifications_v1';
  const TIMER_SESSIONS_KEY = 'sem2_study_timer_sessions_v1';

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getReadNotifIds() {
    try {
      const raw = window.PortalStorage && typeof window.PortalStorage.getItem === 'function'
        ? window.PortalStorage.getItem(READ_NOTIFS_KEY)
        : window.localStorage.getItem(READ_NOTIFS_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  }

  function saveReadNotifIds(set) {
    try {
      const serialized = JSON.stringify([...set]);
      if (window.PortalStorage && typeof window.PortalStorage.setItem === 'function') {
        window.PortalStorage.setItem(READ_NOTIFS_KEY, serialized);
      } else {
        window.localStorage.setItem(READ_NOTIFS_KEY, serialized);
      }
    } catch {
      // Ignore storage errors
    }
  }

  function getCompletedTimerSessions() {
    try {
      const raw = window.PortalStorage && typeof window.PortalStorage.getItem === 'function'
        ? window.PortalStorage.getItem(TIMER_SESSIONS_KEY)
        : window.localStorage.getItem(TIMER_SESSIONS_KEY);
      return Math.max(0, Number(raw) || 0);
    } catch {
      return 0;
    }
  }

  function incrementCompletedTimerSessions() {
    const next = getCompletedTimerSessions() + 1;
    try {
      if (window.PortalStorage && typeof window.PortalStorage.setItem === 'function') {
        window.PortalStorage.setItem(TIMER_SESSIONS_KEY, String(next));
      } else {
        window.localStorage.setItem(TIMER_SESSIONS_KEY, String(next));
      }
    } catch {
      // Ignore storage errors
    }
    return next;
  }

  function formatTime(sec) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  }

  function initSmartTools() {
    const isSubjectPage = document.body.dataset.page === 'subject';
    const courseId = new URLSearchParams(window.location.search).get('id') || window.COURSES_DATA?.[0]?.id || 'data-structure';
    const course = (window.COURSES_DATA || []).find(c => c.id === courseId) || window.COURSES_DATA?.[0];
    if (!course) return;

    const powerData = window.COURSE_POWER_DATA?.[course.id];
    const notifications = window.PORTAL_NOTIFICATIONS || [];

    // حالة مؤقت المذاكرة (Study Timer)
    const studyTimer = {
      presetMin: 25,
      totalSec: 25 * 60,
      remainingSec: 25 * 60,
      running: false,
      intervalId: null
    };

    // 1. حقن جرس التنبيهات ومؤقت المذاكرة في شريط التنقل العلوي (.a1-header-actions)
    const headerActions = document.querySelector('.a1-header-actions');
    if (headerActions && !document.getElementById('portal-notif-bell-btn')) {
      const timerNavBtn = document.createElement('button');
      timerNavBtn.type = 'button';
      timerNavBtn.id = 'portal-timer-nav-btn';
      timerNavBtn.className = 'header-smart-btn';
      timerNavBtn.dataset.openPowerTool = 'timer';
      timerNavBtn.title = 'مؤقت المذاكرة والتركيز (Pomodoro)';
      timerNavBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span data-study-timer-readout>25:00</span>
      `;

      const bellNavBtn = document.createElement('button');
      bellNavBtn.type = 'button';
      bellNavBtn.id = 'portal-notif-bell-btn';
      bellNavBtn.className = 'header-smart-btn';
      bellNavBtn.dataset.openPowerTool = 'notifications';
      bellNavBtn.title = 'جرس التنبيهات — آخر الإضافات والتحديثات';
      bellNavBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        <span>آخر الإضافات</span>
        <span class="notif-unread-badge" data-notif-unread-badge>0</span>
      `;

      headerActions.prepend(bellNavBtn, timerNavBtn);
    }

    // 2. إنشاء شريط «الأدوات الذكية» في صفحة المادة (أو شريط التنبيهات والمؤقت في الرئيسية)
    let bar = document.querySelector('.course-power-bar');
    if (!bar) {
      bar = document.createElement('section');
      bar.className = 'course-power-bar';
      bar.setAttribute('aria-label', 'الأدوات الذكية وجرس التنبيهات ومؤقت المذاكرة');

      if (isSubjectPage) {
        bar.innerHTML = `
          <div class="course-power-intro">
            <div class="course-power-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div class="course-power-copy">
              <h3>الأدوات الذكية — ${escapeHtml(course.arabicName)}</h3>
              <p>الشرح التفاعلي المعتمد • محاكي امتحان الميدتيرم • مؤقت المذاكرة • جرس آخر الإضافات</p>
            </div>
          </div>
          <div class="course-power-actions">
            <button type="button" class="power-tool-btn is-interactive-tool" data-open-power-tool="interactive">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>الشرح التفاعلي</span>
            </button>
            <button type="button" class="power-tool-btn is-primary-tool" data-open-power-tool="midterm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              <span>محاكي الميدتيرم</span>
            </button>
            <button type="button" class="power-tool-btn" data-open-power-tool="timer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>مؤقت المذاكرة</span>
              <span class="power-tool-badge" data-study-timer-readout>25:00</span>
            </button>
            <button type="button" class="power-tool-btn is-notif-tool" data-open-power-tool="notifications">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span>جرس التنبيهات</span>
              <span class="power-tool-badge" id="power-notif-badge" data-notif-unread-badge>0</span>
            </button>
          </div>
        `;
        const materials = document.querySelector('.a1-materials') || document.getElementById('main-content');
        const resourceTabs = materials?.querySelector('.a1-resource-tabs');
        if (resourceTabs) {
          resourceTabs.after(bar);
        } else if (materials) {
          materials.prepend(bar);
        }
      } else {
        bar.innerHTML = `
          <div class="course-power-intro">
            <div class="course-power-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </div>
            <div class="course-power-copy">
              <h3>إشعارات المنصة ومؤقت المذاكرة</h3>
              <p>تابع أحدث المحاضرات والسكاشن والأكواد المضافة لحظة بلحظة ونظّم وقت مذاكرتك</p>
            </div>
          </div>
          <div class="course-power-actions">
            <button type="button" class="power-tool-btn is-notif-tool" data-open-power-tool="notifications">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span>آخر الإضافات والتنبيهات</span>
              <span class="power-tool-badge" data-notif-unread-badge>0</span>
            </button>
            <button type="button" class="power-tool-btn" data-open-power-tool="timer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>مؤقت المذاكرة</span>
              <span class="power-tool-badge" data-study-timer-readout>25:00</span>
            </button>
          </div>
        `;
        const coursesSec = document.getElementById('courses-section');
        const toolsRow = coursesSec?.querySelector('.studio-course-tools');
        if (toolsRow) {
          toolsRow.before(bar);
        }
      }
    }

    // 3. إنشاء النافذة المنبثقة الشاملة (Course Power Modal)
    let modal = document.getElementById('course-power-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'course-power-modal';
      modal.className = 'course-power-modal hidden';
      modal.setAttribute('aria-label', 'الأدوات الذكية وجرس التنبيهات');
      modal.innerHTML = `
        <div class="power-modal-shell">
          <header class="power-modal-header">
            <div class="power-modal-top-row">
              <div class="power-modal-title-wrap">
                <span class="power-modal-course-code">${escapeHtml(isSubjectPage ? course.code : 'KERNAL')}</span>
                <h2 class="power-modal-title" id="power-modal-title">${escapeHtml(isSubjectPage ? `الأدوات الذكية — ${course.arabicName}` : 'الأدوات الذكية وجرس التنبيهات')}</h2>
              </div>
              <button type="button" class="power-modal-close-btn" id="power-modal-close">
                <span>إغلاق</span>
                <span aria-hidden="true">✕</span>
              </button>
            </div>
            <div class="power-modal-tabs" role="tablist" aria-label="أقسام الأدوات الذكية">
              ${isSubjectPage ? `
                <button type="button" role="tab" class="power-modal-tab" data-power-tab="interactive" aria-selected="true">
                  <span>✨ الشرح التفاعلي</span>
                </button>
                <button type="button" role="tab" class="power-modal-tab" data-power-tab="midterm" aria-selected="false">
                  <span>📝 محاكي الميدتيرم</span>
                </button>
              ` : ''}
              <button type="button" role="tab" class="power-modal-tab" data-power-tab="timer" aria-selected="${!isSubjectPage ? 'true' : 'false'}">
                <span>⏱️ مؤقت المذاكرة (<span data-study-timer-readout>25:00</span>)</span>
              </button>
              <button type="button" role="tab" class="power-modal-tab" data-power-tab="notifications" aria-selected="false">
                <span>🔔 آخر الإضافات (<span data-notif-unread-badge>0</span>)</span>
              </button>
            </div>
          </header>
          <div class="power-modal-body" id="power-modal-body">
            <section id="power-panel-interactive" role="tabpanel" ${!isSubjectPage ? 'hidden' : ''}></section>
            <section id="power-panel-midterm" role="tabpanel" hidden></section>
            <section id="power-panel-timer" role="tabpanel" ${isSubjectPage ? 'hidden' : ''}></section>
            <section id="power-panel-notifications" role="tabpanel" hidden></section>
          </div>
        </div>
      `;
      document.body.append(modal);
    }

    const panelInteractive = document.getElementById('power-panel-interactive');
    const panelMidterm = document.getElementById('power-panel-midterm');
    const panelTimer = document.getElementById('power-panel-timer');
    const panelNotifications = document.getElementById('power-panel-notifications');

    let activeTab = isSubjectPage ? 'interactive' : 'timer';
    let notifScope = 'all';

    // حالة محاكي الميدتيرم
    let allCourseQuestions = [];
    const selectedLectures = new Set();
    let examCountSetting = '10';
    let examTimerSetting = '15';
    let activeExam = null;

    function updateNotifBadges() {
      const readSet = getReadNotifIds();
      const unreadCount = notifications.filter(n => !readSet.has(n.id)).length;
      document.querySelectorAll('[data-notif-unread-badge]').forEach(el => {
        el.textContent = String(unreadCount);
        el.classList.toggle('is-read', unreadCount === 0);
      });
    }

    function updateStudyTimerReadouts() {
      const text = formatTime(studyTimer.remainingSec);
      document.querySelectorAll('[data-study-timer-readout]').forEach(el => {
        el.textContent = text;
      });
      const bigDigits = document.getElementById('study-timer-big-digits');
      if (bigDigits) bigDigits.textContent = text;
    }

    // =========================================================================
    // 1. رندر تبويب «✨ الشرح التفاعلي للمادة»
    // =========================================================================
    function renderInteractivePanel() {
      if (!panelInteractive || !powerData?.interactiveHub) return;
      const hub = powerData.interactiveHub;
      const itemsHtml = (hub.items || []).map(item => `
        <article class="smart-card">
          <div class="smart-card-header">
            <div>
              <h3 class="smart-card-title">${escapeHtml(item.title)}</h3>
              <p class="text-xs text-[var(--text-muted)] mt-1">${escapeHtml(item.sub)}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              ${item.lectureReaderId ? `
                <button type="button" class="power-tool-btn is-primary-tool" data-launch-internal-reader="${escapeHtml(item.lectureReaderId)}">
                  <span>📖 فتح القارئ التفاعلي والكويز</span>
                </button>
              ` : ''}
              <a href="${escapeHtml(item.url)}" target="${item.url.startsWith('http') ? '_blank' : '_self'}" rel="noopener noreferrer" class="power-action-link is-interactive-tool">
                <span>🚀 فتح صفحة الشرح التفاعلي</span>
              </a>
            </div>
          </div>
        </article>
      `).join('');

      panelInteractive.innerHTML = `
        <div class="smart-card mb-4">
          <div class="smart-card-header">
            <div>
              <span class="smart-card-tag">✨ البوابة التفاعلية المعتمدة</span>
              <h3 class="smart-card-title mt-2">${escapeHtml(course.arabicName)} (${escapeHtml(course.name)})</h3>
              <p class="text-xs text-[var(--text-muted)] mt-1">${escapeHtml(hub.desc)}</p>
            </div>
            <a href="${escapeHtml(hub.mainUrl)}" target="${hub.mainUrl.startsWith('http') ? '_blank' : '_self'}" rel="noopener noreferrer" class="power-action-link is-interactive-tool" id="interactive-hub-main-link">
              <span>⚡ ${escapeHtml(hub.mainLabel)}</span>
            </a>
          </div>
        </div>
        <div class="space-y-3" id="interactive-units-list">
          ${itemsHtml}
        </div>
      `;
    }

    // =========================================================================
    // 2. رندر تبويب «📝 محاكي امتحان الميدتيرم المجمع بالتايمر»
    // =========================================================================
    async function ensureAllQuestionsLoaded() {
      if (!powerData) return [];
      const merged = [];
      const seenQuestions = new Set();

      const addQuestion = (q, lecId, lecLabel) => {
        const key = String(q.question || '').trim().toLowerCase();
        if (!key || seenQuestions.has(key)) return;
        seenQuestions.add(key);
        merged.push({
          uid: `${course.id}:${lecId}:${q.id || merged.length + 1}`,
          courseId: course.id,
          courseName: course.arabicName,
          lectureId: String(lecId),
          lectureLabel: lecLabel,
          topic: q.topic || 'مفهوم أساسي',
          question: q.question,
          options: q.options || [],
          correct: Number(q.correct || 0),
          explanation: q.explanation || ''
        });
      };

      for (const q of powerData.midtermQuestions || []) {
        addQuestion(q, q.lectureId || '1', q.lectureLabel || `محاضرة ${q.lectureId || 1}`);
      }

      if (window.PortalStudyLoader?.load) {
        try {
          const explanations = await window.PortalStudyLoader.load();
          const courseExp = explanations?.[course.id];
          if (courseExp) {
            for (const [lecId, lecData] of Object.entries(courseExp)) {
              const lecObj = (course.lectures || []).find(l => String(l.id) === String(lecId));
              const label = lecObj ? (lecObj.date || lecObj.chapter || `محاضرة ${lecId}`) : `محاضرة ${lecId}`;
              for (const q of lecData.fullQuiz || []) {
                addQuestion(q, lecId, label);
              }
            }
          }
        } catch {
          // Use built-in midterm questions
        }
      }

      allCourseQuestions = merged;
      if (selectedLectures.size === 0) {
        for (const q of allCourseQuestions) selectedLectures.add(String(q.lectureId));
      }
      return allCourseQuestions;
    }

    function stopMidtermTimer() {
      if (activeExam && activeExam.timerId) {
        window.clearInterval(activeExam.timerId);
        activeExam.timerId = null;
      }
    }

    function submitMidtermExam() {
      if (!activeExam || activeExam.submitted) return;
      stopMidtermTimer();
      activeExam.submitted = true;
      renderMidtermPanel();
    }

    function startMidtermWithQuestions(questionsPool, durationMinutes) {
      stopMidtermTimer();
      if (!questionsPool || questionsPool.length === 0) return;

      const totalSec = Number(durationMinutes) > 0 ? Number(durationMinutes) * 60 : 0;
      activeExam = {
        questions: questionsPool,
        answers: {},
        flags: new Set(),
        currentIndex: 0,
        submitted: false,
        totalSec,
        remainingSec: totalSec,
        paused: false,
        timerId: null
      };

      if (totalSec > 0) {
        activeExam.timerId = window.setInterval(() => {
          if (!activeExam || activeExam.paused || activeExam.submitted) return;
          activeExam.remainingSec = Math.max(0, activeExam.remainingSec - 1);
          const timerEl = document.getElementById('midterm-timer-display');
          if (timerEl) {
            timerEl.textContent = `⏱️ ${formatTime(activeExam.remainingSec)}`;
            timerEl.classList.toggle('is-warning', activeExam.remainingSec <= 60);
          }
          if (activeExam.remainingSec <= 0) {
            submitMidtermExam();
          }
        }, 1000);
      }

      renderMidtermPanel();
    }

    function renderMidtermPanel() {
      if (!panelMidterm) return;
      const lectureGroups = new Map();
      for (const q of allCourseQuestions) {
        if (!lectureGroups.has(q.lectureId)) {
          lectureGroups.set(q.lectureId, { id: q.lectureId, label: q.lectureLabel, count: 0 });
        }
        lectureGroups.get(q.lectureId).count += 1;
      }

      if (!activeExam) {
        const scopeChips = [...lectureGroups.values()].map(group => {
          const isSelected = selectedLectures.has(String(group.id));
          return `
            <button type="button" class="midterm-scope-chip" data-toggle-scope-lec="${escapeHtml(group.id)}" aria-pressed="${isSelected ? 'true' : 'false'}">
              <span>${isSelected ? '✓' : '○'} ${escapeHtml(group.label)} (${group.count})</span>
            </button>
          `;
        }).join('');

        const availableCount = allCourseQuestions.filter(q => selectedLectures.has(String(q.lectureId))).length;

        panelMidterm.innerHTML = `
          <div class="midterm-config-panel">
            <div>
              <h3 class="smart-card-title">إعداد محاكي امتحان الميدتيرم — ${escapeHtml(course.arabicName)}</h3>
              <p class="text-xs text-[var(--text-muted)] mt-1">حدد المحاضرات الداخلة في الامتحان، عدد الأسئلة، والوقت المحدد، واختبر استعدادك الفعلي مع التايمر والتصحيح الفوري.</p>
            </div>
            <div>
              <label class="block text-xs font-extrabold mb-2">1. اختر المحاضرات الداخلة في الامتحان (${availableCount} سؤال متاح):</label>
              <div class="midterm-scope-chips">
                ${scopeChips}
              </div>
            </div>
            <div class="midterm-config-grid">
              <div class="midterm-config-group">
                <label for="midterm-count-select">2. عدد أسئلة الامتحان:</label>
                <select id="midterm-count-select" class="midterm-select">
                  <option value="5" ${examCountSetting === '5' ? 'selected' : ''}>5 أسئلة (مراجعة سريعة)</option>
                  <option value="10" ${examCountSetting === '10' ? 'selected' : ''}>10 أسئلة (ميدتيرم قياسي)</option>
                  <option value="15" ${examCountSetting === '15' ? 'selected' : ''}>15 سؤال (امتحان شامل)</option>
                  <option value="all" ${examCountSetting === 'all' ? 'selected' : ''}>كل الأسئلة المتاحة (${availableCount})</option>
                </select>
              </div>
              <div class="midterm-config-group">
                <label for="midterm-timer-select">3. زمن الامتحان (التايمر):</label>
                <select id="midterm-timer-select" class="midterm-select">
                  <option value="10" ${examTimerSetting === '10' ? 'selected' : ''}>10 دقائق</option>
                  <option value="15" ${examTimerSetting === '15' ? 'selected' : ''}>15 دقيقة (موصى به)</option>
                  <option value="25" ${examTimerSetting === '25' ? 'selected' : ''}>25 دقيقة</option>
                  <option value="0" ${examTimerSetting === '0' ? 'selected' : ''}>بدون تايمر (تدريب مفتوح)</option>
                </select>
              </div>
              <div class="midterm-config-group flex items-end">
                <button type="button" class="midterm-start-btn" id="start-midterm-btn" ${availableCount === 0 ? 'disabled' : ''}>
                  <span>🚀 ابدأ امتحان الميدتيرم الآن (${availableCount > 0 ? (examCountSetting === 'all' ? availableCount : Math.min(Number(examCountSetting), availableCount)) : 0} سؤال)</span>
                </button>
              </div>
            </div>
          </div>
        `;
        return;
      }

      const { questions, answers, flags, currentIndex, submitted, remainingSec, totalSec, paused } = activeExam;
      const currentQ = questions[currentIndex];
      const answeredCount = Object.keys(answers).length;
      const chosenIdx = answers[currentQ.uid];

      let score = 0;
      if (submitted) {
        for (const q of questions) {
          if (answers[q.uid] === q.correct) score += 1;
        }
      }

      const pillsHtml = questions.map((q, idx) => {
        const isCurrent = idx === currentIndex;
        const isAns = answers[q.uid] !== undefined;
        const isFlag = flags.has(q.uid);
        let stateClass = '';
        if (submitted) {
          stateClass = answers[q.uid] === q.correct ? 'is-correct-pill' : 'is-wrong-pill';
        } else if (isCurrent) {
          stateClass = 'is-current';
        } else if (isFlag) {
          stateClass = 'is-flagged';
        } else if (isAns) {
          stateClass = 'is-answered';
        }
        return `
          <button type="button" class="midterm-q-pill ${stateClass}" data-midterm-jump="${idx}">
            ${idx + 1}${isFlag && !submitted ? '🚩' : ''}
          </button>
        `;
      }).join('');

      const optionsHtml = currentQ.options.map((opt, idx) => {
        let btnClass = '';
        if (submitted) {
          if (idx === currentQ.correct) btnClass = 'is-correct';
          else if (idx === chosenIdx) btnClass = 'is-wrong';
        } else if (idx === chosenIdx) {
          btnClass = 'is-selected';
        }
        return `
          <button
            type="button"
            class="midterm-opt-btn ${btnClass}"
            data-midterm-opt="${idx}"
            ${submitted ? 'disabled' : ''}
          >
            <span>${escapeHtml(opt)}</span>
            <span class="power-tool-badge">${String.fromCharCode(65 + idx)}</span>
          </button>
        `;
      }).join('');

      const summaryHtml = submitted
        ? (() => {
            const pct = Math.round((score / questions.length) * 100);
            return `
              <div class="midterm-config-panel" id="midterm-result-banner">
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 class="smart-card-title">🏆 نتيجة امتحان الميدتيرم: ${score} من ${questions.length} (${pct}%)</h3>
                    <p class="text-xs text-[var(--text-muted)] mt-1">يمكنك الآن التنقل بين أرقام الأسئلة بالأسفل لمراجعة الإجابات الصحيحة وشرح كل تريكة بالتفصيل.</p>
                  </div>
                  <button type="button" class="power-action-btn is-submit" id="midterm-new-exam-btn">
                    <span>🔄 إعداد امتحان جديد</span>
                  </button>
                </div>
              </div>
            `;
          })()
        : '';

      panelMidterm.innerHTML = `
        ${summaryHtml}
        <div class="midterm-hud-bar">
          <div class="flex flex-wrap items-center gap-2">
            <span class="midterm-timer-box ${remainingSec > 0 && remainingSec <= 60 && !submitted ? 'is-warning' : ''}" id="midterm-timer-display">
              ${totalSec > 0 ? `⏱️ ${formatTime(remainingSec)}` : '⏱️ تدريب مفتوح'}
            </span>
            ${totalSec > 0 && !submitted ? `
              <button type="button" class="power-action-btn" id="midterm-pause-btn">
                <span>${paused ? '▶️ استئناف' : '⏸️ إيقاف مؤقت'}</span>
              </button>
            ` : ''}
            <span class="text-xs font-bold">تم حل ${answeredCount} من ${questions.length}</span>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            ${!submitted ? `
              <button type="button" class="power-action-btn" id="midterm-flag-btn">
                <span>${flags.has(currentQ.uid) ? '🚩 إزالة العلامة' : '🚩 علّم للمراجعة'}</span>
              </button>
              <button type="button" class="power-action-btn is-submit" id="midterm-submit-btn">
                <span>✅ تسليم الامتحان وتصحيح الإجابات</span>
              </button>
            ` : ''}
          </div>
        </div>

        <div class="midterm-q-pills" role="navigation" aria-label="خريطة أسئلة الامتحان">
          ${pillsHtml}
        </div>

        <article class="midterm-question-card" id="midterm-active-question">
          <div class="smart-card-header mb-3">
            <span class="smart-card-title">السؤال ${currentIndex + 1} من ${questions.length} — ${escapeHtml(currentQ.topic)}</span>
            <span class="smart-card-tag">${escapeHtml(currentQ.lectureLabel)}</span>
          </div>
          <div class="midterm-q-prompt">${escapeHtml(currentQ.question)}</div>
          <div class="midterm-options-list">
            ${optionsHtml}
          </div>
          ${submitted ? `
            <div class="midterm-explanation-box" dir="rtl">
              <strong>${chosenIdx === currentQ.correct ? '🎉 إجابتك صحيحة!' : '💡 التفسير والتريكة الصحيحة:'}</strong>
              <p class="mt-1">${escapeHtml(currentQ.explanation)}</p>
            </div>
          ` : ''}
          <div class="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[var(--border-subtle)]">
            <button type="button" class="power-action-btn" data-midterm-step="prev" ${currentIndex === 0 ? 'disabled' : ''}>
              <span>→ السؤال السابق</span>
            </button>
            <span class="text-xs font-mono font-bold">${currentIndex + 1} / ${questions.length}</span>
            <button type="button" class="power-action-btn" data-midterm-step="next" ${currentIndex === questions.length - 1 ? 'disabled' : ''}>
              <span>السؤال التالي ←</span>
            </button>
          </div>
        </article>
      `;
    }

    // =========================================================================
    // 3. رندر تبويب «⏱️ مؤقت المذاكرة والتركيز (Study Timer)»
    // =========================================================================
    function renderTimerPanel() {
      if (!panelTimer) return;
      const presets = [
        [25, '25 دقيقة (بومودورو قياسي)'],
        [45, '45 دقيقة (تركيز عميق)'],
        [15, '15 دقيقة (مراجعة سريعة)'],
        [5, '5 دقائق (استراحة قصيرة)']
      ];
      const completedSessions = getCompletedTimerSessions();

      panelTimer.innerHTML = `
        <div class="study-timer-box">
          <span class="smart-card-tag">⏱️ مؤقت المذاكرة والتركيز (Pomodoro Focus Timer)</span>
          <div class="study-timer-digits" id="study-timer-big-digits">${formatTime(studyTimer.remainingSec)}</div>
          <p class="text-xs text-slate-300">يستمر المؤقت في العمل بالخلفية أثناء تصفحك للمحاضرات أو الشرح التفاعلي • الجلسات المكتملة: <strong id="timer-completed-sessions">${completedSessions}</strong></p>
          <div class="study-timer-presets" role="group" aria-label="مدد المؤقت الجاهزة">
            ${presets.map(([min, label]) => `
              <button type="button" class="power-action-btn ${studyTimer.presetMin === min ? 'is-active-preset' : ''}" data-timer-preset="${min}">
                <span>${escapeHtml(label)}</span>
              </button>
            `).join('')}
          </div>
          <div class="study-timer-controls">
            <button type="button" class="power-action-btn is-submit" id="study-timer-toggle-btn">
              <span>${studyTimer.running ? '⏸️ إيقاف مؤقت' : '▶️ ابدأ المؤقت الآن'}</span>
            </button>
            <button type="button" class="power-action-btn" id="study-timer-reset-btn">
              <span>🔄 إعادة ضبط (${studyTimer.presetMin}:00)</span>
            </button>
          </div>
        </div>
      `;
    }

    function toggleStudyTimer() {
      if (studyTimer.running) {
        studyTimer.running = false;
        if (studyTimer.intervalId) {
          window.clearInterval(studyTimer.intervalId);
          studyTimer.intervalId = null;
        }
      } else {
        if (studyTimer.remainingSec <= 0) {
          studyTimer.remainingSec = studyTimer.totalSec;
        }
        studyTimer.running = true;
        studyTimer.intervalId = window.setInterval(() => {
          if (!studyTimer.running) return;
          studyTimer.remainingSec = Math.max(0, studyTimer.remainingSec - 1);
          updateStudyTimerReadouts();
          if (studyTimer.remainingSec <= 0) {
            studyTimer.running = false;
            window.clearInterval(studyTimer.intervalId);
            studyTimer.intervalId = null;
            incrementCompletedTimerSessions();
            renderTimerPanel();
          }
        }, 1000);
      }
      renderTimerPanel();
      updateStudyTimerReadouts();
    }

    function setStudyTimerPreset(minutes) {
      if (studyTimer.intervalId) {
        window.clearInterval(studyTimer.intervalId);
        studyTimer.intervalId = null;
      }
      studyTimer.running = false;
      studyTimer.presetMin = minutes;
      studyTimer.totalSec = minutes * 60;
      studyTimer.remainingSec = minutes * 60;
      renderTimerPanel();
      updateStudyTimerReadouts();
    }

    // =========================================================================
    // 4. رندر تبويب «🔔 جرس التنبيهات — آخر الإضافات والتحديثات»
    // =========================================================================
    function renderNotificationsPanel() {
      if (!panelNotifications) return;
      const readSet = getReadNotifIds();
      const filtered = notifScope === 'course' && isSubjectPage
        ? notifications.filter(n => n.courseId === course.id)
        : notifications;

      const listHtml = filtered.map(item => {
        const isUnread = !readSet.has(item.id);
        return `
          <article class="smart-card" data-notif-id="${escapeHtml(item.id)}">
            <div class="smart-card-header">
              <div class="flex flex-wrap items-center gap-2">
                <span class="smart-card-tag ${isUnread ? 'is-new' : ''}">${escapeHtml(isUnread ? `🔔 جديد • ${item.dateLabel}` : `✓ مقروء • ${item.dateLabel}`)}</span>
                <span class="smart-card-tag">${escapeHtml(item.courseName)}</span>
                <span class="text-xs font-bold text-[var(--text-muted)]">${escapeHtml(item.typeLabel)}</span>
              </div>
              <a href="${escapeHtml(item.url)}" class="power-action-link" data-mark-notif-read="${escapeHtml(item.id)}">
                <span>فتح الإضافة الآن ←</span>
              </a>
            </div>
            <h3 class="smart-card-title">${escapeHtml(item.title)}</h3>
            <p class="text-xs text-[var(--text-muted)] leading-relaxed">${escapeHtml(item.desc)}</p>
          </article>
        `;
      }).join('');

      panelNotifications.innerHTML = `
        <div class="smart-card mb-4">
          <div class="smart-card-header">
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" class="power-action-btn ${notifScope === 'all' ? 'is-active-preset' : ''}" data-notif-scope="all">
                <span>كل المواد (${notifications.length})</span>
              </button>
              ${isSubjectPage ? `
                <button type="button" class="power-action-btn ${notifScope === 'course' ? 'is-active-preset' : ''}" data-notif-scope="course">
                  <span>إضافات ${escapeHtml(course.arabicName)} فقط (${notifications.filter(n => n.courseId === course.id).length})</span>
                </button>
              ` : ''}
            </div>
            <button type="button" class="power-action-btn is-submit" id="mark-all-notifs-read">
              <span>✓ تحديد الكل كمقروء</span>
            </button>
          </div>
        </div>
        <div class="space-y-3" id="notifications-feed-list">
          ${listHtml}
        </div>
      `;
    }

    async function switchPowerTab(tabName) {
      if (!isSubjectPage && (tabName === 'interactive' || tabName === 'midterm')) {
        tabName = 'notifications';
      }
      activeTab = tabName;
      modal.dataset.activePowerTab = activeTab;

      modal.querySelectorAll('[data-power-tab]').forEach(btn => {
        if (btn.getAttribute('role') === 'tab') {
          btn.setAttribute('aria-selected', String(btn.dataset.powerTab === tabName));
        }
      });

      if (panelInteractive) panelInteractive.hidden = tabName !== 'interactive';
      if (panelMidterm) panelMidterm.hidden = tabName !== 'midterm';
      if (panelTimer) panelTimer.hidden = tabName !== 'timer';
      if (panelNotifications) panelNotifications.hidden = tabName !== 'notifications';

      if (tabName === 'interactive') {
        renderInteractivePanel();
      } else if (tabName === 'midterm') {
        await ensureAllQuestionsLoaded();
        renderMidtermPanel();
      } else if (tabName === 'timer') {
        renderTimerPanel();
      } else if (tabName === 'notifications') {
        renderNotificationsPanel();
      }
    }

    async function openPowerModal(tabName) {
      await switchPowerTab(tabName || (isSubjectPage ? 'interactive' : 'notifications'));
      if (window.PortalDialog?.open) {
        window.PortalDialog.open(modal, { onClose: stopMidtermTimer });
      } else {
        modal.classList.remove('hidden');
      }
    }

    function closePowerModal() {
      stopMidtermTimer();
      if (window.PortalDialog?.close) {
        window.PortalDialog.close(modal);
      } else {
        modal.classList.add('hidden');
      }
    }

    // الاستماع لفتح الأدوات من الهيدر أو شريط الأدوات الذكية
    document.addEventListener('click', event => {
      const openBtn = event.target.closest('[data-open-power-tool]');
      if (openBtn) {
        openPowerModal(openBtn.dataset.openPowerTool);
      }
    });

    modal.addEventListener('click', event => {
      if (event.target === modal || event.target.closest('#power-modal-close')) {
        closePowerModal();
        return;
      }

      const tabBtn = event.target.closest('[data-power-tab]');
      if (tabBtn) {
        switchPowerTab(tabBtn.dataset.powerTab);
        return;
      }

      // فتح القارئ التفاعلي الداخلي للمحاضرة
      const readerBtn = event.target.closest('[data-launch-internal-reader]');
      if (readerBtn) {
        const lecId = readerBtn.dataset.launchInternalReader;
        closePowerModal();
        const trigger = document.querySelector(`[data-open-study-lecture="${lecId}"]`);
        if (trigger) trigger.click();
        return;
      }

      // تفاعلات مؤقت المذاكرة
      const presetBtn = event.target.closest('[data-timer-preset]');
      if (presetBtn) {
        setStudyTimerPreset(Number(presetBtn.dataset.timerPreset));
        return;
      }

      if (event.target.closest('#study-timer-toggle-btn')) {
        toggleStudyTimer();
        return;
      }

      if (event.target.closest('#study-timer-reset-btn')) {
        setStudyTimerPreset(studyTimer.presetMin);
        return;
      }

      // تفاعلات جرس التنبيهات
      const scopeBtn = event.target.closest('[data-notif-scope]');
      if (scopeBtn) {
        notifScope = scopeBtn.dataset.notifScope;
        renderNotificationsPanel();
        return;
      }

      if (event.target.closest('#mark-all-notifs-read')) {
        const readSet = getReadNotifIds();
        for (const n of notifications) readSet.add(n.id);
        saveReadNotifIds(readSet);
        updateNotifBadges();
        renderNotificationsPanel();
        return;
      }

      const markLink = event.target.closest('[data-mark-notif-read]');
      if (markLink) {
        const readSet = getReadNotifIds();
        readSet.add(markLink.dataset.markNotifRead);
        saveReadNotifIds(readSet);
        updateNotifBadges();
        closePowerModal();
        return;
      }

      // تفاعلات محاكي الميدتيرم
      const scopeChip = event.target.closest('[data-toggle-scope-lec]');
      if (scopeChip) {
        const lecId = String(scopeChip.dataset.toggleScopeLec);
        if (selectedLectures.has(lecId) && selectedLectures.size > 1) {
          selectedLectures.delete(lecId);
        } else {
          selectedLectures.add(lecId);
        }
        renderMidtermPanel();
        return;
      }

      if (event.target.closest('#start-midterm-btn')) {
        const pool = allCourseQuestions.filter(q => selectedLectures.has(String(q.lectureId)));
        const limit = examCountSetting === 'all' ? pool.length : Math.min(Number(examCountSetting) || 10, pool.length);
        startMidtermWithQuestions(pool.slice(0, limit), Number(examTimerSetting));
        return;
      }

      const optBtn = event.target.closest('[data-midterm-opt]');
      if (optBtn && activeExam && !activeExam.submitted) {
        const q = activeExam.questions[activeExam.currentIndex];
        activeExam.answers[q.uid] = Number(optBtn.dataset.midtermOpt);
        renderMidtermPanel();
        return;
      }

      const jumpBtn = event.target.closest('[data-midterm-jump]');
      if (jumpBtn && activeExam) {
        activeExam.currentIndex = Number(jumpBtn.dataset.midtermJump);
        renderMidtermPanel();
        return;
      }

      const stepBtn = event.target.closest('[data-midterm-step]');
      if (stepBtn && activeExam) {
        const delta = stepBtn.dataset.midtermStep === 'next' ? 1 : -1;
        activeExam.currentIndex = Math.max(0, Math.min(activeExam.questions.length - 1, activeExam.currentIndex + delta));
        renderMidtermPanel();
        return;
      }

      if (event.target.closest('#midterm-flag-btn') && activeExam && !activeExam.submitted) {
        const q = activeExam.questions[activeExam.currentIndex];
        if (activeExam.flags.has(q.uid)) activeExam.flags.delete(q.uid);
        else activeExam.flags.add(q.uid);
        renderMidtermPanel();
        return;
      }

      if (event.target.closest('#midterm-pause-btn') && activeExam && !activeExam.submitted) {
        activeExam.paused = !activeExam.paused;
        renderMidtermPanel();
        return;
      }

      if (event.target.closest('#midterm-submit-btn')) {
        submitMidtermExam();
        return;
      }

      if (event.target.closest('#midterm-new-exam-btn')) {
        stopMidtermTimer();
        activeExam = null;
        renderMidtermPanel();
      }
    });

    modal.addEventListener('change', event => {
      if (event.target.id === 'midterm-count-select') {
        examCountSetting = event.target.value;
        renderMidtermPanel();
      } else if (event.target.id === 'midterm-timer-select') {
        examTimerSetting = event.target.value;
        renderMidtermPanel();
      }
    });

    updateNotifBadges();
    updateStudyTimerReadouts();
  }

  document.addEventListener('DOMContentLoaded', initSmartTools);
})();
