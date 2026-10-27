/* Choice presentation only. Authored answer identities and teaching data stay unchanged. */
(function () {
  'use strict';
  let sequence = 0, pageSeed;
  const prefix = /^\s*(?:\(([A-D])\)|([A-D])[).])\s*/i;
  function cleanOptions(options) {
    const labelled = options.every((text, index) => {
      const match = String(text).match(prefix);
      return match && (match[1] || match[2]).toUpperCase() === String.fromCharCode(65 + index);
    });
    return options.map(text => labelled ? String(text).replace(prefix, '') : String(text));
  }
  function dependent(options, prompt = '') {
    const text = [prompt, ...cleanOptions(options)].join(' ');
    return /\b(?:above|below)\b|\b[A-D]\s*(?:and|or|&|\+|,)\s*[A-D]\b|\b(?:option|choice|statement)s?\s+[A-D]\b|(?:كل|جميع|لا شيء|أي|اى)\s*(?:ما|مما)\s*(?:سبق|أعلاه|اعلاه)|(?:الأول|الاول|الثاني|الثانى|الثالث|الرابع)(?:ة|ى)?\s*(?:و|أو)/i.test(text);
  }
  function hash(text) {
    let value = 2166136261;
    for (let i = 0; i < text.length; i++) { value ^= text.charCodeAt(i); value = Math.imul(value, 16777619); }
    return value >>> 0;
  }
  function newSeed() { return ((Math.random() * 0x100000000) ^ Math.imul(++sequence, 0x9e3779b9)) >>> 0; }
  function permute(seed, key, options, prompt) {
    const order = options.map((_, index) => index);
    if (dependent(options, prompt)) return order;
    let value = hash(seed + ':' + key + ':' + options.join('\u001f')) || 1;
    for (let i = order.length - 1; i > 0; i--) {
      value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
      const j = Math.floor((value >>> 0) / 0x100000000 * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }
  function references(text, order) {
    const letter = original => {
      const position = order.indexOf(original.toUpperCase().charCodeAt(0) - 65);
      return position < 0 ? original : String.fromCharCode(65 + position);
    };
    return String(text || '').replace(/\b(option|choice|answer)\s+([A-D])\b/gi, (_, label, old) => label + ' ' + letter(old))
      .replace(/(خيار|اختيار|الإجابة|الاختيار)\s+([A-D])\b/gi, (_, label, old) => label + ' ' + letter(old));
  }
  function attempt(seed) {
    return {present(question, key = question.uid || question.id || question.question) {
      const order = permute(seed, key, question.options, question.question);
      if (dependent(question.options, question.question) || /\b(?:first|second|third|fourth)\s+(?:option|choice)|(?:الخيار|الاختيار|الإجابة)\s+(?:الأول|الثاني|الثالث|الرابع)/i.test(question.explanation || '')) return {...question, options: [...question.options]};
      const texts = cleanOptions(question.options);
      return {...question, options: order.map(index => texts[index]), correct: order.indexOf(question.correct), explanation: references(question.explanation, order)};
    }};
  }
  const scope = window.location.pathname + window.location.search;
  const savedKey = 'sem2_quiz_choices_v1:' + scope;
  function seed() {
    if (pageSeed !== undefined) return pageSeed;
    try {
      const saved = window.sessionStorage.getItem(savedKey);
      if (saved !== null && /^\d+$/.test(saved) && Number(saved) <= 0xffffffff) pageSeed = Number(saved);
    } catch { /* A blocked store still keeps the choice order stable in this page. */ }
    if (pageSeed === undefined) {
      pageSeed = newSeed();
      try { window.sessionStorage.setItem(savedKey, String(pageSeed)); } catch { /* Session fallback. */ }
    }
    return pageSeed;
  }
  window.PortalQuizChoices = {
    createAttempt: () => attempt(newSeed()),
    present: (question, key) => attempt(seed()).present(question, key),
    order: (key, options, prompt) => permute(seed(), key, options, prompt),
    renew() {
      pageSeed = newSeed();
      try { window.sessionStorage.setItem(savedKey, String(pageSeed)); } catch { /* Session fallback. */ }
    }
  };
  const processed = new WeakMap();
  function shuffleGroups(root, force = false) {
    const groups = new Set([...root.querySelectorAll('.quiz-option,.quiz-opt-btn,article[id^="q-card-"] > .space-y-3 > button,.question fieldset > label')].map(button => button.parentElement));
    for (const group of groups) {
      if (!force && processed.has(group)) continue;
      const previous = processed.get(group);
      const buttons = previous?.buttons || [...group.querySelectorAll(group.matches('fieldset') ? ':scope > label' : ':scope > button')];
      const card = group.parentElement;
      const prompt = previous?.prompt || group.querySelector('legend')?.textContent || card.querySelector('h3,h4,p[dir="ltr"]')?.textContent || '';
      const texts = previous?.texts || buttons.map(button => button.querySelector('span').textContent);
      const key = card.id + ':' + (buttons[0].dataset.qid || buttons[0].querySelector('input')?.name || '') + ':' + prompt;
      const order = window.PortalQuizChoices.order(key, texts, prompt);
      processed.set(group, {buttons, texts, prompt});
      const cleaned = cleanOptions(texts);
      const labelled = cleaned.some((text, index) => text !== texts[index]);
      order.forEach((original, position) => {
        const button = buttons[original], text = button.querySelector('span');
        if (!dependent(texts, prompt) && labelled) {
          const strong = text.firstElementChild;
          if (strong && prefix.test(strong.textContent)) strong.textContent = '(' + String.fromCharCode(65 + position) + ')';
          else if (text.firstChild?.nodeType === 3) text.firstChild.nodeValue = text.firstChild.nodeValue.replace(prefix, String.fromCharCode(65 + position) + ') ');
        }
        group.append(button);
      });
      const feedback = group.nextElementSibling;
      if (feedback && !dependent(texts, prompt)) {
        const walker = document.createTreeWalker(feedback, window.NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          const remapped = references(node.nodeValue, order);
          if (node.nodeValue !== remapped) node.nodeValue = remapped;
        }
        // The native Architecture renderer repeats the labelled correct choice in its heading.
        const heading = feedback.querySelector('div');
        if (heading && /التفسير المعماري للإجابة/.test(heading.textContent)) {
          heading.textContent = heading.textContent.replace(/\(([A-D])\)/, (_, old) => '(' + String.fromCharCode(65 + order.indexOf(old.charCodeAt(0) - 65)) + ')');
        }
      }
    }
  }
  function install() {
    const roots = [...document.querySelectorAll('#quiz-questions-container,#quizQuestionsContainer,#quizContainer,#lesson-content,#mixed-questions')];
    if (!roots.length) return;
    roots.forEach(root => {
      shuffleGroups(root);
      new MutationObserver(() => shuffleGroups(root)).observe(root, {childList: true, subtree: true});
    });
    document.addEventListener('click', event => {
      if (event.target.closest('[onclick="resetQuiz()"],#btnResetQuiz,#reset')) {
        window.PortalQuizChoices.renew();
        window.queueMicrotask(() => roots.forEach(root => shuffleGroups(root, true)));
      }
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
