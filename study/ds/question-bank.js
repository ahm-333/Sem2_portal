/**
 * Data Structures Question Bank Controller
 * Manages search, multi-dimensional filtering, bookmarks with scoped PortalStorage,
 * expand/collapse of model solutions and Arabic explanations, and accessibility.
 */

(function () {
  'use strict';

  // Storage helper with graceful fallback
  const PRIMARY_STORAGE_KEY = 'sem2_ds_question_bank_bookmarks';
  const LEGACY_STORAGE_KEY = 'ds_bookmarks';

  function getStorage() {
    if (typeof window !== 'undefined' && window.PortalStorage && typeof window.PortalStorage.getItem === 'function') {
      return window.PortalStorage;
    }
    return {
      getItem(key) {
        try {
          return window.localStorage.getItem(key);
        } catch (_) {
          return null;
        }
      },
      setItem(key, value) {
        try {
          window.localStorage.setItem(key, String(value));
          return true;
        } catch (_) {
          return false;
        }
      }
    };
  }

  // Load bookmarks with legacy key compatibility
  function loadInitialBookmarks() {
    const storage = getStorage();
    try {
      const primaryData = storage.getItem(PRIMARY_STORAGE_KEY);
      if (primaryData) {
        const parsed = JSON.parse(primaryData);
        if (Array.isArray(parsed)) return new Set(parsed);
      }
      // Check legacy standalone key
      const legacyData = storage.getItem(LEGACY_STORAGE_KEY);
      if (legacyData) {
        const parsedLegacy = JSON.parse(legacyData);
        if (Array.isArray(parsedLegacy)) {
          const bookmarkSet = new Set(parsedLegacy);
          // Migrate into scoped key
          storage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(Array.from(bookmarkSet)));
          return bookmarkSet;
        }
      }
    } catch (_) {
      // In-memory fallback
    }
    return new Set();
  }

  function saveBookmarks(bookmarkSet) {
    const storage = getStorage();
    try {
      storage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(Array.from(bookmarkSet)));
    } catch (_) {
      // Graceful degradation when storage quota is exhausted or blocked
    }
  }

  // State
  let currentLecture = 'all';
  let currentSource = 'all';
  let currentType = 'all';
  let bookmarksOnly = false;
  let searchQuery = '';
  let showAllSolutions = false;
  let bookmarkedIds = loadInitialBookmarks();

  // Escape HTML utility for XSS safety
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Format the authored bank's small set of math commands on already escaped text.
  function formatMath(text) {
    const symbols = { infty: '∞', rightarrow: '→', times: '×', log: 'log', '{': '{', '}': '}' };
    const formatted = text
      .replace(/\times\b/g, '×') // Some source multiplication signs have a literal tab before "imes".
      .replace(/\\+(mathbf|text)\{([^{}]+)\}/g, function (_, command, content) {
        return command === 'mathbf' ? '<strong>' + content + '</strong>' : content;
      })
      .replace(/\\+(infty|rightarrow|times|log|[{}])/g, function (_, command) {
        return symbols[command];
      })
      .replace(/\^([a-zA-Z0-9]+)/g, '<sup>$1</sup>');
    return '<bdi dir="ltr">' + formatted + '</bdi>';
  }

  function formatInline(text) {
    return text.replace(/\x60([^\x60\n]+)\x60|\*\*([^*\n]+)\*\*|(\b[A-Za-z0-9]+(?:[ \t]+\$\\+rightarrow\$[ \t]+[A-Za-z0-9]+)+)|\$([^$\n]+)\$|\n/g,
      function (token, code, bold, path, math) {
        if (code !== undefined) return '<code>' + code + '</code>';
        if (bold !== undefined) return '<strong>' + formatInline(bold) + '</strong>';
        if (path !== undefined) return formatMath(path.replace(/\$/g, ''));
        if (math !== undefined) return formatMath(math);
        return '<br>';
      });
  }

  function formatTable(block) {
    const rows = block.trim().split('\n').map(line => line.trim().slice(1, -1).split('|'));
    const [header, , ...body] = rows;
    const renderRow = (cells, tag) => '<tr>' + cells.map(cell =>
      '<' + tag + '>' + formatInline(cell.trim()) + '</' + tag + '>'
    ).join('') + '</tr>';
    return '<div class="solution-table-scroll" tabindex="0" role="region" aria-label="جدول الحل">' +
      '<table class="solution-table"><thead>' + renderRow(header, 'th') + '</thead><tbody>' +
      body.map(row => renderRow(row, 'td')).join('') + '</tbody></table></div>';
  }

  function formatMarkdown(text) {
    if (!text || typeof text !== 'string') return '';

    const escaped = escapeHtml(text);
    const blocks = /\x60{3}(?:cpp|c\+\+|text)?([\s\S]*?)\x60{3}|(^[ \t]*\|[^\n]*\|[ \t]*\n[ \t]*\|[ \t:|-]+\|[ \t]*(?:\n[ \t]*\|[^\n]*\|[ \t]*)*)/gm;
    const paragraphs = value => value.trim().split(/\n\n+/).filter(Boolean)
      .map(paragraph => '<p>' + formatInline(paragraph) + '</p>').join('');
    let html = '';
    let cursor = 0;
    for (const match of escaped.matchAll(blocks)) {
      const [block, code, table] = match;
      html += paragraphs(escaped.slice(cursor, match.index));
      html += table ? formatTable(table) : '<pre><code>' + code.trim() + '</code></pre>';
      cursor = match.index + block.length;
    }
    return html + paragraphs(escaped.slice(cursor));
  }

  // Update lecture and stats counters
  function updateCounters(questions) {
    const counts = { all: questions.length, lec1: 0, lec2: 0, lec3: 0, lec4: 0, lec5: 0, adv: 0 };
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (typeof counts[q.lecture] === 'number') {
        counts[q.lecture]++;
      }
    }

    for (const key in counts) {
      const el = document.getElementById('count-' + key);
      if (el) el.textContent = String(counts[key]);
    }

    const statTotalEl = document.getElementById('statTotal');
    if (statTotalEl) statTotalEl.textContent = String(questions.length);

    const statBookmarksEl = document.getElementById('statBookmarks');
    if (statBookmarksEl) statBookmarksEl.textContent = String(bookmarkedIds.size);
  }

  // Render question cards list
  function render() {
    const questions = window.DS_QUESTION_BANK_DATA || [];
    const container = document.getElementById('questionsContainer');
    const displayedCountEl = document.getElementById('displayedCount');
    const activeFilterNameEl = document.getElementById('activeFilterName');

    if (!container) return;

    // Filter questions
    const filtered = questions.filter(function (q) {
      if (currentLecture !== 'all' && q.lecture !== currentLecture) return false;
      if (currentSource !== 'all' && q.source !== currentSource) return false;

      if (currentType !== 'all' && q.type !== currentType) return false;
      if (bookmarksOnly && !bookmarkedIds.has(q.id)) return false;

      if (searchQuery) {
        const textToSearch = (
          (q.title || '') + ' ' +
          (q.questionEn || '') + ' ' +
          (q.correctAnswerEn || '') + ' ' +
          (q.explanationAr || '') + ' ' +
          (q.options ? q.options.join(' ') : '')
        ).toLowerCase();
        if (!textToSearch.includes(searchQuery)) return false;
      }

      return true;
    });

    if (displayedCountEl) displayedCountEl.textContent = String(filtered.length);

    // Active filter label
    if (activeFilterNameEl) {
      const activeLecBtn = document.querySelector('#lectureTabs .tab-btn.active');
      const lecLabel = activeLecBtn ? activeLecBtn.textContent.replace(/\d+$/, '').trim() : 'جميع المحاضرات';
      const activeTypeBtn = document.querySelector('#typeFilters [data-type].active');
      const typeLabel = activeTypeBtn ? activeTypeBtn.textContent.trim() : 'جميع الأنواع';
      activeFilterNameEl.textContent = lecLabel + ' • ' + typeLabel + (bookmarksOnly ? ' • المفضلة فقط' : '');
    }

    if (filtered.length === 0) {
      container.innerHTML = 
        '<div class="empty-state" role="status">' +
          '<div class="empty-icon" aria-hidden="true">🔍</div>' +
          '<h3>لم يتم العثور على أسئلة مطابقة</h3>' +
          '<p>جرب تغيير خيارات الفلترة أو كتابة مصطلح بحث آخر.</p>' +
        '</div>';
      return;
    }

    let cardsHtml = '';
    for (let idx = 0; idx < filtered.length; idx++) {
      const q = filtered[idx];
      const isBookmarked = bookmarkedIds.has(q.id);
      const isSolVisible = showAllSolutions;

      // MCQ options rendering
      let optionsHtml = '';
      if (q.options && q.options.length > 0) {
        optionsHtml = '<div class="options-container" role="list">';
        for (let o = 0; o < q.options.length; o++) {
          const opt = q.options[o];
          const isCorrect = q.correctAnswerEn && opt.toLowerCase().includes(q.correctAnswerEn.toLowerCase().substring(0, 15));
          const optionClass = 'option-item' + (isSolVisible && isCorrect ? ' correct-option' : '');
          optionsHtml += '<div class="' + optionClass + '" role="listitem"' +
            (isCorrect ? ' data-correct-choice' : '') + '>' + escapeHtml(opt) + '</div>';
        }
        optionsHtml += '</div>';
      }

      // Safe formatted bodies
      const qBodyFormatted = formatMarkdown(q.questionEn);
      const enSolFormatted = formatMarkdown(q.correctAnswerEn);
      const arExpFormatted = formatMarkdown(q.explanationAr);

      cardsHtml +=
        '<article class="question-card" id="card-' + escapeHtml(q.id) + '">' +
          '<div class="card-header-bar">' +
            '<div class="badges-list">' +
              '<span class="badge badge-lec">' + escapeHtml(q.lectureName || q.lecture) + '</span>' +
              '<span class="badge badge-source">📝 ' + escapeHtml(q.sourceName || q.source) + '</span>' +
              '<span class="badge badge-type">🏷️ ' + escapeHtml(q.typeName || q.type) + '</span>' +
            '</div>' +
            '<button class="bookmark-btn' + (isBookmarked ? ' bookmarked' : '') + '" ' +
                    'data-question-id="' + escapeHtml(q.id) + '" ' +
                    'title="' + (isBookmarked ? 'في المفضلة' : 'حفظ في المفضلة') + '" ' +
                    'aria-label="' + (isBookmarked ? 'إزالة السؤال من المفضلة' : 'حفظ السؤال في المفضلة') + '" ' +
                    'aria-pressed="' + String(isBookmarked) + '">' +
              (isBookmarked ? '★' : '☆') +
            '</button>' +
          '</div>' +

          '<h3 class="question-title">' +
            '<span class="question-number">#' + (idx + 1) + '</span>' +
            '<span>' + escapeHtml(q.title) + '</span>' +
          '</h3>' +

          '<div class="question-body-en">' +
            qBodyFormatted +
          '</div>' +

          optionsHtml +

          '<button class="solution-toggle-btn' + (isSolVisible ? ' active' : '') + '" ' +
                  'id="btn-sol-' + escapeHtml(q.id) + '" ' +
                  'data-target-sol="sol-' + escapeHtml(q.id) + '" ' +
                  'aria-expanded="' + String(isSolVisible) + '" ' +
                  'aria-controls="sol-' + escapeHtml(q.id) + '">' +
            (isSolVisible ? '🙈 إخفاء الحل' : '👁️ إظهار الحل والشرح بالعربي') +
          '</button>' +

          '<div class="solution-wrapper' + (isSolVisible ? ' show' : '') + '" id="sol-' + escapeHtml(q.id) + '">' +
            '<div class="solution-en-box">' +
              '<div class="solution-en-header">' +
                '<span aria-hidden="true">🇬🇧</span>' +
                '<span>Model Solution (English)</span>' +
              '</div>' +
              '<div class="solution-en-content">' +
                enSolFormatted +
              '</div>' +
            '</div>' +

            '<div class="explanation-ar-box">' +
              '<div class="explanation-ar-header">' +
                '<span aria-hidden="true">💡</span>' +
                '<span>الشرح التفصيلي باللغة العربية والخطوات</span>' +
              '</div>' +
              '<div class="explanation-ar-content">' +
                arExpFormatted +
              '</div>' +
            '</div>' +
          '</div>' +
        '</article>';
    }

    container.innerHTML = cardsHtml;
  }

  function setSolutionVisibility(button, solution, visible) {
    solution.classList.toggle('show', visible);
    button.classList.toggle('active', visible);
    button.textContent = visible ? '🙈 إخفاء الحل' : '👁️ إظهار الحل والشرح بالعربي';
    button.setAttribute('aria-expanded', String(visible));
    button.closest('.question-card').querySelectorAll('[data-correct-choice]').forEach(function (option) {
      option.classList.toggle('correct-option', visible);
    });
  }

  function toggleSolution(cardId) {
    const solution = document.getElementById('sol-' + cardId);
    const button = document.getElementById('btn-sol-' + cardId);
    if (solution && button) setSolutionVisibility(button, solution, !solution.classList.contains('show'));
  }

  // Toggle bookmark
  function toggleBookmark(id, buttonEl) {
    if (bookmarkedIds.has(id)) {
      bookmarkedIds.delete(id);
      if (buttonEl) {
        buttonEl.classList.remove('bookmarked');
        buttonEl.textContent = '☆';
        buttonEl.title = 'حفظ في المفضلة';
        buttonEl.setAttribute('aria-label', 'حفظ السؤال في المفضلة');
        buttonEl.setAttribute('aria-pressed', 'false');
      }
    } else {
      bookmarkedIds.add(id);
      if (buttonEl) {
        buttonEl.classList.add('bookmarked');
        buttonEl.textContent = '★';
        buttonEl.title = 'في المفضلة';
        buttonEl.setAttribute('aria-label', 'إزالة السؤال من المفضلة');
        buttonEl.setAttribute('aria-pressed', 'true');
      }
    }
    saveBookmarks(bookmarkedIds);

    const statBookmarksEl = document.getElementById('statBookmarks');
    if (statBookmarksEl) statBookmarksEl.textContent = String(bookmarkedIds.size);

    if (bookmarksOnly) {
      const restoreFocus = buttonEl === document.activeElement;
      const card = buttonEl?.closest('.question-card');
      const neighbor = card?.nextElementSibling || card?.previousElementSibling;
      render();
      if (restoreFocus) {
        const nextButton = document.getElementById(neighbor?.id)?.querySelector('.bookmark-btn');
        (nextButton || document.getElementById('bookmarkFilterBtn')).focus();
      }
    }
  }

  // Event Listeners setup
  function initEvents() {
    const questions = window.DS_QUESTION_BANK_DATA || [];

    // Lecture tabs use manual activation so browsing labels does not rerender the results.
    const lectureTabs = [...document.querySelectorAll('#lectureTabs .tab-btn')];
    const lecturePanel = document.getElementById('lecturePanel');
    lectureTabs.forEach(function (btn, index) {
      btn.addEventListener('click', function () {
        lectureTabs.forEach(function (tab) {
          const selected = tab === btn;
          tab.classList.toggle('active', selected);
          tab.setAttribute('aria-selected', String(selected));
          tab.tabIndex = selected ? 0 : -1;
        });
        lecturePanel.setAttribute('aria-labelledby', btn.id);
        currentLecture = btn.dataset.lec;
        render();
      });
      btn.addEventListener('keydown', function (event) {
        const last = lectureTabs.length - 1;
        const rtl = getComputedStyle(btn).direction === 'rtl';
        const targets = {
          Home: 0,
          End: last,
          ArrowLeft: (index + (rtl ? 1 : last)) % lectureTabs.length,
          ArrowRight: (index + (rtl ? last : 1)) % lectureTabs.length
        };
        if (!Object.hasOwn(targets, event.key)) return;
        event.preventDefault();
        lectureTabs[targets[event.key]].focus();
      });
    });

    // Source Filter Chips
    document.querySelectorAll('#sourceFilters .filter-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('#sourceFilters .filter-chip').forEach(function (c) {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        currentSource = chip.getAttribute('data-source') || 'all';
        render();
      });
    });

    // Type Filter Chips
    document.querySelectorAll('#typeFilters [data-type]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('#typeFilters [data-type]').forEach(function (c) {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        currentType = chip.getAttribute('data-type') || 'all';
        render();
      });
    });

    const bookmarkFilterBtn = document.getElementById('bookmarkFilterBtn');
    if (bookmarkFilterBtn) {
      bookmarkFilterBtn.addEventListener('click', function () {
        bookmarksOnly = !bookmarksOnly;
        bookmarkFilterBtn.classList.toggle('active', bookmarksOnly);
        bookmarkFilterBtn.setAttribute('aria-pressed', String(bookmarksOnly));
        render();
      });
    }

    // Search input with debounce
    const searchInput = document.getElementById('searchInput');
    let searchTimer;
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
          searchQuery = e.target.value.trim().toLowerCase();
          render();
        }, 150);
      });
    }

    // Toggle All Solutions
    const toggleAllBtn = document.getElementById('toggleAllSolBtn');
    if (toggleAllBtn) {
      toggleAllBtn.addEventListener('click', function () {
        showAllSolutions = !showAllSolutions;
        toggleAllBtn.textContent = showAllSolutions ? '🙈 إخفاء كافة الحلول' : '👁️ إظهار كافة الحلول';
        toggleAllBtn.setAttribute('aria-expanded', String(showAllSolutions));
        document.querySelectorAll('.solution-toggle-btn').forEach(function (button) {
          const solution = document.getElementById(button.getAttribute('aria-controls'));
          setSolutionVisibility(button, solution, showAllSolutions);
        });
      });
    }

    // Delegation for dynamic question card buttons (Bookmark & Solution Toggle)
    const container = document.getElementById('questionsContainer');
    if (container) {
      container.addEventListener('click', function (e) {
        const bookmarkBtn = e.target.closest('.bookmark-btn');
        if (bookmarkBtn) {
          const qId = bookmarkBtn.getAttribute('data-question-id');
          if (qId) toggleBookmark(qId, bookmarkBtn);
          return;
        }

        const solBtn = e.target.closest('.solution-toggle-btn');
        if (solBtn) {
          const targetId = solBtn.getAttribute('data-target-sol');
          if (targetId && targetId.startsWith('sol-')) {
            const qId = targetId.slice(4);
            toggleSolution(qId);
          }
        }
      });
    }

    // Back to top button
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 350) backToTopBtn.classList.add('show');
        else backToTopBtn.classList.remove('show');
      });
      backToTopBtn.addEventListener('click', function () {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.querySelector('.hero-title').focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
      });
    }

    // Initial counter update & render
    updateCounters(questions);
    render();
  }

  // Bootstrap when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEvents);
  } else {
    initEvents();
  }

  // Export functions for testing if needed
  window.DSQuestionBank = {
    render: render,
    toggleSolution: toggleSolution,
    toggleBookmark: toggleBookmark
  };
})();
