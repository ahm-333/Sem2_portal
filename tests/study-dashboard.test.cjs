const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function createMockElement(tagName = 'div', attributes = {}) {
  const children = [];
  const classListSet = new Set((attributes.className || '').split(/\s+/).filter(Boolean));
  const dataset = {};
  for (const [k, v] of Object.entries(attributes.dataset || {})) {
    dataset[k] = String(v);
  }
  const attrs = new Map();
  for (const [k, v] of Object.entries(attributes)) {
    if (k !== 'className' && k !== 'dataset') attrs.set(k, String(v));
  }

  const el = {
    tagName: tagName.toUpperCase(),
    dataset,
    hidden: Boolean(attributes.hidden),
    style: { cssText: '' },
    get className() { return Array.from(classListSet).join(' '); },
    set className(val) {
      classListSet.clear();
      String(val || '').split(/\s+/).filter(Boolean).forEach(c => classListSet.add(c));
    },
    classList: {
      add(...tokens) { tokens.forEach(t => classListSet.add(t)); },
      remove(...tokens) { tokens.forEach(t => classListSet.delete(t)); },
      contains(t) { return classListSet.has(t); },
      toggle(t, force) {
        if (force === true) classListSet.add(t);
        else if (force === false) classListSet.delete(t);
        else if (classListSet.has(t)) classListSet.delete(t);
        else classListSet.add(t);
      }
    },
    getAttribute(name) {
      if (name === 'class') return el.className;
      if (name.startsWith('data-')) {
        const camel = name.slice(5).replace(/-([a-z])/g, (_, l) => l.toUpperCase());
        return dataset[camel] ?? attrs.get(name) ?? null;
      }
      return attrs.get(name) ?? null;
    },
    setAttribute(name, val) {
      attrs.set(name, String(val));
      if (name === 'class') el.className = val;
      if (name.startsWith('data-')) {
        const camel = name.slice(5).replace(/-([a-z])/g, (_, l) => l.toUpperCase());
        dataset[camel] = String(val);
      }
    },
    removeAttribute(name) {
      attrs.delete(name);
      if (name === 'class') classListSet.clear();
      if (name.startsWith('data-')) {
        const camel = name.slice(5).replace(/-([a-z])/g, (_, l) => l.toUpperCase());
        delete dataset[camel];
      }
    },
    hasAttribute(name) {
      if (name === 'class') return classListSet.size > 0;
      if (name.startsWith('data-')) {
        const camel = name.slice(5).replace(/-([a-z])/g, (_, l) => l.toUpperCase());
        if (dataset[camel] !== undefined) return true;
      }
      return attrs.has(name);
    },
    append(...nodes) {
      for (const n of nodes) {
        if (typeof n === 'string') {
          // text node placeholder
        } else if (n) {
          n.parentElement = el;
          children.push(n);
        }
      }
    },
    prepend(...nodes) {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (n && typeof n !== 'string') {
          n.parentElement = el;
          children.unshift(n);
        }
      }
    },
    replaceChildren(...nodes) {
      children.length = 0;
      el.append(...nodes);
    },
    remove() {
      if (el.parentElement) {
        const idx = el.parentElement.children.indexOf(el);
        if (idx >= 0) el.parentElement.children.splice(idx, 1);
        el.parentElement = null;
      }
    },
    replaceWith(newNode) {
      if (el.parentElement) {
        const idx = el.parentElement.children.indexOf(el);
        if (idx >= 0) {
          newNode.parentElement = el.parentElement;
          el.parentElement.children.splice(idx, 1, newNode);
        }
        el.parentElement = null;
      }
    },
    insertAdjacentHTML(position, html) {
      const container = createMockElement('div');
      parseSimpleHtml(container, html);
      const nodes = [...container.children];
      if (position === 'beforebegin') {
        if (el.parentElement) {
          const idx = el.parentElement.children.indexOf(el);
          if (idx >= 0) {
            nodes.forEach(n => { n.parentElement = el.parentElement; });
            el.parentElement.children.splice(idx, 0, ...nodes);
          }
        }
      } else if (position === 'afterbegin') {
        el.prepend(...nodes);
      } else if (position === 'beforeend') {
        el.append(...nodes);
      } else if (position === 'afterend') {
        if (el.parentElement) {
          const idx = el.parentElement.children.indexOf(el);
          if (idx >= 0) {
            nodes.forEach(n => { n.parentElement = el.parentElement; });
            el.parentElement.children.splice(idx + 1, 0, ...nodes);
          }
        }
      }
    },
    querySelector(sel) {
      return el.querySelectorAll(sel)[0] || null;
    },
    querySelectorAll(sel) {
      const parts = sel.trim().split(/\s+/);
      if (parts.length > 1) {
        let current = el.querySelectorAll(parts[0]);
        for (let i = 1; i < parts.length; i++) {
          const next = [];
          for (const item of current) {
            next.push(...item.querySelectorAll(parts[i]));
          }
          current = next;
        }
        return current;
      }
      const matches = [];
      function walk(node) {
        for (const child of node.children) {
          if (typeof child !== 'object' || !child) continue;
          if (matchesSelector(child, sel)) matches.push(child);
          walk(child);
        }
      }
      walk(el);
      return matches;
    },
    get children() { return children; },
    get firstChild() { return children[0] || null; },
    parentElement: null,
    _innerHTML: '',
    get innerHTML() { return el._innerHTML; },
    set innerHTML(html) {
      el._innerHTML = String(html || '');
      children.length = 0;
      parseSimpleHtml(el, html);
    },
    textContent: ''
  };

  return el;
}

function parseSimpleHtml(parent, html) {
  if (!html) return;
  let cursor = 0;
  while (cursor < html.length) {
    const tagStart = html.indexOf('<', cursor);
    if (tagStart === -1) {
      const text = html.slice(cursor).trim();
      if (text) parent.textContent = (parent.textContent ? parent.textContent + ' ' : '') + text;
      break;
    }
    if (tagStart > cursor) {
      const text = html.slice(cursor, tagStart).trim();
      if (text) parent.textContent = (parent.textContent ? parent.textContent + ' ' : '') + text;
    }
    const tagEnd = html.indexOf('>', tagStart);
    if (tagEnd === -1) break;
    const tagContent = html.slice(tagStart + 1, tagEnd).trim();
    if (tagContent.startsWith('/')) {
      cursor = tagEnd + 1;
      continue;
    }
    const isSelfClosing = tagContent.endsWith('/');
    const spaceIdx = tagContent.indexOf(' ');
    const tagName = (spaceIdx === -1 ? tagContent : tagContent.slice(0, spaceIdx)).replace(/\/$/, '');
    const rawAttrs = spaceIdx === -1 ? '' : tagContent.slice(spaceIdx).replace(/\/$/, '');

    const child = createMockElement(tagName);
    const attrRegex = /([a-zA-Z0-9-]+)(?:="([^"]*)")?/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
      child.setAttribute(attrMatch[1], attrMatch[2] !== undefined ? attrMatch[2] : '');
    }

    if (isSelfClosing) {
      parent.append(child);
      cursor = tagEnd + 1;
      continue;
    }

    const openTagPrefix = '<' + tagName;
    const closeTag = '</' + tagName + '>';
    let depth = 1;
    let searchPos = tagEnd + 1;
    let closingTagPos = -1;

    while (depth > 0 && searchPos < html.length) {
      const nextOpen = html.indexOf(openTagPrefix, searchPos);
      const nextClose = html.indexOf(closeTag, searchPos);
      if (nextClose === -1) break;

      if (nextOpen !== -1 && nextOpen < nextClose) {
        const charAfter = html[nextOpen + openTagPrefix.length];
        if (charAfter === '>' || charAfter === ' ' || charAfter === '/') {
          depth++;
        }
        searchPos = html.indexOf('>', nextOpen) + 1;
      } else {
        depth--;
        if (depth === 0) {
          closingTagPos = nextClose;
          break;
        }
        searchPos = nextClose + closeTag.length;
      }
    }

    if (closingTagPos !== -1) {
      const inner = html.slice(tagEnd + 1, closingTagPos);
      child._innerHTML = inner;
      parseSimpleHtml(child, inner);
      cursor = closingTagPos + closeTag.length;
    } else {
      cursor = tagEnd + 1;
    }
    parent.append(child);
  }
}

function matchesSelector(el, sel) {
  sel = sel.trim();
  if (sel.startsWith('#')) return el.getAttribute('id') === sel.slice(1);
  if (sel.startsWith('.')) return el.classList.contains(sel.slice(1));
  if (sel.startsWith('[') && sel.endsWith(']')) {
    const inside = sel.slice(1, -1);
    if (inside.includes('=')) {
      const [k, rawV] = inside.split('=');
      const v = rawV.replace(/^["']|["']$/g, '');
      return el.getAttribute(k) === v;
    }
    return el.hasAttribute(inside);
  }
  return el.tagName.toLowerCase() === sel.toLowerCase();
}

function setupDashboardTestEnv(options = {}) {
  const inMemoryStorage = (() => {
    let store = new Map(Object.entries(options.storage || {}));
    return {
      getItem(k) { return store.has(k) ? store.get(k) : null; },
      setItem(k, v) { store.set(k, String(v)); return true; },
      removeItem(k) { store.delete(k); },
      clear() { store.clear(); },
      get length() { return store.size; },
      key(i) { return [...store.keys()][i] || null; }
    };
  })();

  const elementsById = new Map();
  const body = createMockElement('body', { dataset: { page: 'home' } });
  const resumeEl = createMockElement('div', { id: 'studio-resume', hidden: true });
  const continueResultsEl = createMockElement('div', { id: 'continue-results' });
  const coursesGridEl = createMockElement('div', { id: 'courses-grid' });
  const scheduleSectionEl = createMockElement('section', { id: 'schedule-section' });

  elementsById.set('studio-resume', resumeEl);
  elementsById.set('continue-results', continueResultsEl);
  elementsById.set('courses-grid', coursesGridEl);
  elementsById.set('schedule-section', scheduleSectionEl);
  body.append(resumeEl, continueResultsEl, coursesGridEl, scheduleSectionEl);

  const listeners = {};
  const mockDocument = {
    body,
    documentElement: createMockElement('html'),
    getElementById(id) { return elementsById.get(id) || null; },
    querySelector(sel) {
      if (sel.startsWith('#')) return elementsById.get(sel.slice(1)) || null;
      return body.querySelector(sel);
    },
    querySelectorAll(sel) {
      return body.querySelectorAll(sel);
    },
    createElement(tag) { return createMockElement(tag); },
    addEventListener(type, fn) {
      listeners[type] = listeners[type] || [];
      listeners[type].push(fn);
    }
  };

  const windowListeners = {};
  const mockLocation = new URL('http://localhost/Sem2_portal/index.html');
  const scope = {
    console,
    URL,
    URLSearchParams,
    location: mockLocation,
    setTimeout,
    clearTimeout,
    document: mockDocument,
    localStorage: inMemoryStorage,
    sessionStorage: inMemoryStorage,
    MutationObserver: class {
      constructor(cb) { this.cb = cb; }
      observe() {}
      disconnect() {}
    },
    ResizeObserver: class {
      observe() {}
      disconnect() {}
    },
    CustomEvent: class {
      constructor(type, init = {}) {
        this.type = type;
        this.detail = init.detail;
      }
    },
    addEventListener(type, fn) {
      windowListeners[type] = windowListeners[type] || [];
      windowListeners[type].push(fn);
    },
    dispatchEvent(event) {
      const fns = windowListeners[event.type] || [];
      for (const fn of fns) fn(event);
      return true;
    }
  };
  scope.window = scope;
  vm.createContext(scope);

  function loadFile(file) {
    const code = fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(code, scope, { filename: path.join(root, file) });
  }

  loadFile('js/shared/storage.js');
  loadFile('js/courses-data.js');
  loadFile('js/schedule-data.js');
  loadFile('js/a1-identity.js');
  loadFile('js/study-catalog.js');
  loadFile('js/study-modules.js');
  loadFile('js/shared/content-catalog.js');
  loadFile('js/shared/content-links.js');
  loadFile('js/shared/study-state.js');
  loadFile('js/shared/study-progress.js');
  loadFile('js/shared/content-search.js');
  loadFile('js/content-navigation.js');
  loadFile('js/studio.js');

  return { scope, storage: inMemoryStorage, elementsById, body, mockDocument };
}

test('dashboard: resumeOptions consumes PortalContentNavigation.resolveAction for valid lastAction', () => {
  const { scope } = setupDashboardTestEnv();
  const catalog = scope.window.PortalCatalog;
  const studio = scope.window.PortalStudio;
  assert.ok(studio, 'PortalStudio should be exposed');
  assert.equal(typeof studio.resumeOptions, 'function');

  // Key with external action (e.g. driveViewUrl or drivePreviewUrl)
  const key = catalog.key('data-structure', 'lecture', 0);
  const entry = catalog.get(key);
  assert.ok(entry);

  const driveAction = entry.actions.find(a => a.id === 'drivePreviewUrl') || entry.actions[0];
  const last = { key, actionId: driveAction.id, updatedAt: new Date().toISOString() };
  const item = { startedAt: last.updatedAt };

  const options = studio.resumeOptions(entry, item, last);
  assert.equal(options.actionId, driveAction.id, 'Valid actionId must be preserved in resumeOptions');
});

test('dashboard: resumeOptions falls back within same entry when last.actionId is invalid or unavailable', () => {
  const { scope } = setupDashboardTestEnv();
  const catalog = scope.window.PortalCatalog;
  const studio = scope.window.PortalStudio;

  const key = catalog.key('database-systems', 'lecture', 2);
  const entry = catalog.get(key);
  assert.ok(entry);
  assert.ok(entry.study);

  // Invented/alien actionId
  const last = { key, actionId: 'non-existent-action-xyz', updatedAt: new Date().toISOString() };
  const item = { startedAt: last.updatedAt, reader: { slideId: 3, tab: 'quiz' } };

  const options = studio.resumeOptions(entry, item, last);
  // Must NOT use non-existent-action-xyz, but recover within the SAME entry to internal-study
  assert.equal(options.actionId, 'internal-study');
  assert.equal(options.slide, 3);
  assert.equal(options.tab, 'quiz');
});

test('dashboard: resumeOptions restores reader slide and tab, and validates standalone bridge anchor', () => {
  const { scope, storage } = setupDashboardTestEnv();
  const catalog = scope.window.PortalCatalog;
  const studio = scope.window.PortalStudio;

  const key = catalog.key('data-structure', 'lecture', 1);
  const entry = catalog.get(key);
  assert.ok(entry);

  const ts = new Date().toISOString();
  // Valid bridge
  storage.setItem('sem2_standalone_v1:' + encodeURIComponent(key), JSON.stringify({
    version: 1,
    anchor: 'valid-section-anchor',
    updatedAt: ts
  }));

  const item = { reader: { slideId: 5, tab: 'explanation', updatedAt: ts } };
  const options = studio.resumeOptions(entry, item, null);
  assert.equal(options.slide, 5);
  assert.equal(options.tab, 'explanation');
  assert.equal(options.anchor, 'valid-section-anchor');

  // Mismatched updatedAt must safely discard anchor
  const staleItem = { reader: { slideId: 5, tab: 'explanation', updatedAt: '2020-01-01T00:00:00.000Z' } };
  const staleOptions = studio.resumeOptions(entry, staleItem, null);
  assert.equal(staleOptions.anchor, undefined, 'Mismatched timestamp bridge must be discarded');
});

test('dashboard: readingHistory in fresh state leaves #studio-resume hidden and renders empty continue state', () => {
  const { scope, elementsById } = setupDashboardTestEnv();
  const studio = scope.window.PortalStudio;

  studio.readingHistory();

  const resume = elementsById.get('studio-resume');
  const continueResults = elementsById.get('continue-results');

  assert.equal(resume.hidden, true, '#studio-resume must be hidden on fresh state');
  assert.equal(resume.innerHTML, '');
  assert.ok(continueResults.innerHTML.includes('studio-empty'), 'Empty continue state must be displayed');
  assert.ok(continueResults.innerHTML.includes('#library'), 'Empty continue state must offer link to #library');
});

test('dashboard: readingHistory shows continue card when valid lastUsed exists', () => {
  const { scope, elementsById } = setupDashboardTestEnv();
  const studio = scope.window.PortalStudio;
  const state = scope.window.PortalStudyState;
  const catalog = scope.window.PortalCatalog;

  const key = catalog.key('database-systems', 'lecture', 2);
  state.setLastUsed({ key, actionId: 'internal-study' });
  state.updateItem(key, { startedAt: new Date().toISOString(), reader: { slideId: 2, tab: 'explanation' } });

  studio.readingHistory();

  const resume = elementsById.get('studio-resume');
  assert.equal(resume.hidden, false, '#studio-resume must be visible');
  assert.ok(resume.innerHTML.includes('studio-resume-link'));
  assert.ok(resume.innerHTML.includes('كمّل من آخر مرة'));
  assert.ok(resume.innerHTML.includes('item=%5B%22database-systems%22%2C%22lecture%22%2C%222%22%5D'));
});

test('dashboard: readingHistory provides explicit recovery when lastUsed item is deleted or unavailable without deleting orphan history', () => {
  const { scope, elementsById } = setupDashboardTestEnv();
  const studio = scope.window.PortalStudio;
  const state = scope.window.PortalStudyState;

  // Set lastUsed to an item not present in catalog
  const orphanKey = '["non-existent-course","lecture","999"]';
  state.setLastUsed({ key: orphanKey, actionId: 'internal-study' });
  state.updateItem(orphanKey, { startedAt: new Date().toISOString() });

  studio.readingHistory();

  const resume = elementsById.get('studio-resume');
  assert.equal(resume.hidden, false, '#studio-resume must be visible with recovery state');
  assert.ok(resume.innerHTML.includes('studio-resume-recovery') || resume.innerHTML.includes('المصدر السابق لم يعد متاحاً'), 'Must render explicit recovery message');
  assert.ok(resume.innerHTML.includes('#library'), 'Recovery must provide link to current library resources');

  // Verify orphan record was NOT deleted from state!
  const snapshot = state.getSnapshot();
  assert.equal(snapshot.lastUsed?.key, orphanKey, 'Orphan lastUsed must be preserved in storage');
  assert.ok(snapshot.items[orphanKey], 'Orphan item state must be preserved in storage');
});

test('dashboard: course card summary reflects separate lecture/section completed/remaining counts from PortalStudyProgress', () => {
  const { scope, elementsById } = setupDashboardTestEnv();
  const studio = scope.window.PortalStudio;
  const progress = scope.window.PortalStudyProgress;
  const coursesGrid = elementsById.get('courses-grid');

  // Create article element for database-systems
  const article = createMockElement('article', {
    className: 'a1-course',
    dataset: { courseId: 'database-systems' }
  });
  coursesGrid.append(article);

  // Decorate course
  studio.decorateCourses();

  const summaryEl = article.querySelector('.studio-course-summary');
  assert.ok(summaryEl, 'Course card must have .studio-course-summary');

  // In fresh state: 0 completed, 4 lectures remaining
  assert.ok(summaryEl.innerHTML.includes('المحاضرات'));
  assert.ok(summaryEl.innerHTML.includes('السكاشن'));
  assert.ok(summaryEl.innerHTML.includes('0%'));

  // Complete one lecture without full quiz (Lecture 4)
  progress.setManualComplete('["database-systems","lecture","4"]', true);
  studio.updateCourseSummaries();

  const updatedSummary = article.querySelector('.studio-course-summary');
  assert.ok(updatedSummary.innerHTML.includes('1'), 'Should show 1 completed lecture');
});

test('dashboard: course card summary includes scope explanation and grade disclaimer', () => {
  const { scope, elementsById } = setupDashboardTestEnv();
  const studio = scope.window.PortalStudio;
  const coursesGrid = elementsById.get('courses-grid');

  const article = createMockElement('article', {
    className: 'a1-course',
    dataset: { courseId: 'database-systems' }
  });
  coursesGrid.append(article);

  studio.decorateCourses();

  const summaryEl = article.querySelector('.studio-course-summary');
  assert.ok(summaryEl);
  // Published-content scope
  assert.ok(summaryEl.innerHTML.includes('المحتوى المنشور على المنصة'));
  // Grade separation disclaimer
  assert.ok(summaryEl.innerHTML.includes('الدرج') || summaryEl.innerHTML.includes('إتقان'));
});

test('dashboard: updating profile updates course card section counts for new TA without losing progress', () => {
  const { scope, elementsById } = setupDashboardTestEnv();
  const studio = scope.window.PortalStudio;
  const progress = scope.window.PortalStudyProgress;
  const sp = scope.window.StudentProfile;
  const coursesGrid = elementsById.get('courses-grid');

  const article = createMockElement('article', {
    className: 'a1-course',
    dataset: { courseId: 'computer-architecture' }
  });
  coursesGrid.append(article);

  sp.set('B1', 1);
  studio.decorateCourses();

  // Complete section 1 for B1/1
  const sec1Key = '["computer-architecture","section","1"]';
  progress.setManualComplete(sec1Key, true);
  studio.updateCourseSummaries();

  let summaryEl = article.querySelector('.studio-course-summary');
  assert.ok(summaryEl.innerHTML.includes('1'), 'Section 1 should be completed for B1/1');

  // Switch to B2/6 (different TA)
  sp.set('B2', 6);
  scope.window.dispatchEvent(new scope.CustomEvent('studentProfileChanged'));

  summaryEl = article.querySelector('.studio-course-summary');
  assert.ok(summaryEl, 'Summary should be updated for B2/6');

  // Switch back to B1/1: progress preserved!
  sp.set('B1', 1);
  scope.window.dispatchEvent(new scope.CustomEvent('studentProfileChanged'));
  summaryEl = article.querySelector('.studio-course-summary');
  assert.ok(summaryEl.innerHTML.includes('1'), 'Section 1 completion must be preserved');
});

test('dashboard: course progress and continue state never leak into #schedule-section', () => {
  const { elementsById } = setupDashboardTestEnv();
  const scheduleSection = elementsById.get('schedule-section');
  assert.equal(scheduleSection.querySelector('.studio-course-summary'), null);
  assert.equal(scheduleSection.querySelector('.studio-resume-link'), null);
  assert.equal(scheduleSection.querySelector('.studio-resume-recovery'), null);
});
