/* Shared controls for the Trees and BST/Graphs standalone lessons. */
(function () {
  'use strict';

  const drawer = document.getElementById('sidebar-toc');
  const backdrop = document.getElementById('toc-backdrop');
  document.getElementById('btn-open-toc').addEventListener('click', () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
  });

  const pills = [...document.querySelectorAll('.chapter-pill')];
  const sections = new Map(pills.filter(pill => pill.dataset.target !== 'all')
    .map(pill => [pill.dataset.target, document.getElementById(pill.dataset.target)]));

  function showSection(id) {
    pills.forEach(pill => {
      const active = pill.dataset.target === id;
      pill.classList.toggle('active', active);
      pill.setAttribute('aria-pressed', String(active));
    });
    sections.forEach((section, key) => {
      section.classList.toggle('hidden', id !== 'all' && id !== key);
    });
  }

  showSection('all');
  pills.forEach(pill => pill.addEventListener('click', () => {
    showSection(pill.dataset.target);
    const linkedSection = sections.get(window.location.hash.slice(1));
    if (linkedSection?.classList.contains('hidden')) {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    }
  }));

  function revealSection(hash) {
    const id = hash.slice(1);
    const target = sections.get(id);
    if (!target?.classList.contains('hidden')) return;
    showSection(id);
    return target;
  }

  // Reveal the target before the shell focuses it and the browser follows the link.
  drawer.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => revealSection(link.hash));
  });
  window.addEventListener('hashchange', () => revealSection(window.location.hash)?.scrollIntoView());

  window.updateDsQuizCard = (card, answeredHtml, chosen) => {
    const template = document.createElement('template');
    template.innerHTML = answeredHtml;
    const options = template.content.querySelectorAll('.quiz-option');
    card.querySelectorAll('.quiz-option').forEach(option => {
      const update = options[Number(option.dataset.opt)];
      option.className = update.className;
      if (option.innerHTML !== update.innerHTML) option.innerHTML = update.innerHTML;
      option.setAttribute('aria-disabled', 'true');
      option.tabIndex = option === chosen ? 0 : -1;
    });
    card.append(template.content.querySelector('.quiz-feedback'));
  };
})();
