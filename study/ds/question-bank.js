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

  // Safe reviewed Markdown to HTML formatter
  function formatMarkdown(text) {
    if (!text || typeof text !== 'string') return '';

    // Handle Markdown tables
    if (text.includes('|') && text.includes('---')) {
      const lines = text.trim().split('\n');
      let inTable = false;
      let tableHtml = '<table class="solution-table"><thead>';
      const newLines = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('|') && line.endsWith('|')) {
          if (!inTable) {
            inTable = true;
            const cols = line.split('|').filter(c => c.trim() !== '');
            tableHtml += '<tr>' + cols.map(c => '<th>' + escapeHtml(c.trim()) + '</th>').join('') + '</tr></thead><tbody>';
            if (i + 1 < lines.length && lines[i + 1].includes('---')) i++;
          } else {
            const cols = line.split('|').filter(c => c.trim() !== '');
            tableHtml += '<tr>' + cols.map(c => '<td>' + escapeHtml(c.trim()) + '</td>').join('') + '</tr>';
          }
        } else {
          if (inTable) {
            tableHtml += '</tbody></table>';
            newLines.push(tableHtml);
            inTable = false;
          }
          newLines.push(line);
        }
      }
      if (inTable) {
        tableHtml += '</tbody></table>';
        newLines.push(tableHtml);
      }
      text = newLines.join('\n');
    }

    // Code blocks ```cpp ... ```
    text = text.replace(/```(?:cpp|c\+\+|text)?([\s\S]*?)```/g, function (_, code) {
      return '<pre><code>' + escapeHtml(code.trim()) + '</code></pre>';
    });

    // Inline code `...`
    text = text.replace(/`([^`]+)`/g, function (_, code) {
      return '<code>' + escapeHtml(code) + '</code>';
    });

    // Bold **...**
    text = text.replace(/\*\*([^*]+)\*\*/g, function (_, content) {
      return '<strong>' + escapeHtml(content) + '</strong>';
    });

    // Paragraphs & newlines
    text = text.replace(/\n\n+/g, '</p><p>');
    text = text.replace(/\n/g, '<br>');
    return '<p>' + text + '</p>';
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

      if (currentType === 'bookmarked') {
        if (!bookmarkedIds.has(q.id)) return false;
      } else if (currentType !== 'all' && q.type !== currentType) {
        return false;
      }

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
      const activeTypeBtn = document.querySelector('#typeFilters .filter-chip.active');
      const typeLabel = activeTypeBtn ? activeTypeBtn.textContent.trim() : 'جميع الأنواع';
      activeFilterNameEl.textContent = lecLabel + ' • ' + typeLabel;
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
          optionsHtml += '<div class="' + optionClass + '" role="listitem">' + escapeHtml(opt) + '</div>';
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

  // Toggle single solution
  function toggleSolution(cardId) {
    const solEl = document.getElementById('sol-' + cardId);
    const btnEl = document.getElementById('btn-sol-' + cardId);
    if (!solEl || !btnEl) return;

    const isShown = solEl.classList.contains('show');
    if (isShown) {
      solEl.classList.remove('show');
      btnEl.classList.remove('active');
      btnEl.textContent = '👁️ إظهار الحل والشرح بالعربي';
      btnEl.setAttribute('aria-expanded', 'false');
    } else {
      solEl.classList.add('show');
      btnEl.classList.add('active');
      btnEl.textContent = '🙈 إخفاء الحل';
      btnEl.setAttribute('aria-expanded', 'true');
    }
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

    if (currentType === 'bookmarked') {
      render();
    }
  }

  // Event Listeners setup
  function initEvents() {
    const questions = window.DS_QUESTION_BANK_DATA || [];

    // Lecture Tabs
    document.querySelectorAll('#lectureTabs .tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#lectureTabs .tab-btn').forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        currentLecture = btn.getAttribute('data-lec') || 'all';
        render();
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
    document.querySelectorAll('#typeFilters .filter-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('#typeFilters .filter-chip').forEach(function (c) {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        currentType = chip.getAttribute('data-type') || 'all';
        render();
      });
    });

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
        if (showAllSolutions) {
          toggleAllBtn.textContent = '🙈 إخفاء كافة الحلول';
          toggleAllBtn.setAttribute('aria-expanded', 'true');
          document.querySelectorAll('.solution-wrapper').forEach(function (w) {
            w.classList.add('show');
          });
          document.querySelectorAll('.solution-toggle-btn').forEach(function (b) {
            b.classList.add('active');
            b.textContent = '🙈 إخفاء الحل';
            b.setAttribute('aria-expanded', 'true');
          });
        } else {
          toggleAllBtn.textContent = '👁️ إظهار كافة الحلول';
          toggleAllBtn.setAttribute('aria-expanded', 'false');
          document.querySelectorAll('.solution-wrapper').forEach(function (w) {
            w.classList.remove('show');
          });
          document.querySelectorAll('.solution-toggle-btn').forEach(function (b) {
            b.classList.remove('active');
            b.textContent = '👁️ إظهار الحل والشرح بالعربي';
            b.setAttribute('aria-expanded', 'false');
          });
        }
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
