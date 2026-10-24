/* Always-on local interaction; operating-system reduced motion remains supported. */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const gsap = window.gsap;
    if (!gsap) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    let enabled = !reduce.matches;
    let particles = 0;
    const wired = new WeakSet();
    document.body.dataset.motion = enabled ? 'on' : 'reduced';
    function stop() {
      gsap.killTweensOf('.a1-course,.a1-course-icon,.studio-book,.studio-button,.filter-chip,.studio-library-row,.studio-hero-copy,.studio-greeting,.studio-hero-orbit');
      gsap.set('.a1-course,.a1-course-icon,.studio-book,.studio-button,.filter-chip,.studio-library-row,.studio-hero-copy,.studio-greeting,.studio-hero-orbit', {clearProps:'transform,opacity,filter,boxShadow'});
      document.querySelectorAll('.studio-particle').forEach(particle => { gsap.killTweensOf(particle); particle.remove(); }); particles = 0;
    }
    reduce.addEventListener('change', () => { enabled = !reduce.matches; if (!enabled) stop(); document.body.dataset.motion = enabled ? 'on' : 'reduced'; });
    function burst(x, y, count = 12) {
      if (!enabled || particles >= 45) return;
      const colors = ['#4653d6', '#bd83d2', '#74b79a', '#e9ac6d', '#df86a3'];
      for (let i = 0; i < count && particles < 45; i++) {
        particles++;
        const particle = document.createElement('span'); particle.className = 'studio-particle'; particle.setAttribute('aria-hidden', 'true');
        particle.style.cssText = `left:${x}px;top:${y}px;background:${colors[i % colors.length]};`;
        document.body.append(particle);
        const angle = i / count * Math.PI * 2, length = 45 + Math.random() * 85;
        gsap.to(particle, {x:Math.cos(angle) * length,y:Math.sin(angle) * length + 40,rotation:Math.random() * 340,scale:0,opacity:0,duration:.7 + Math.random() * .35,ease:'power2.out',onComplete:() => { particle.remove(); particles = Math.max(0, particles - 1); }});
      }
    }
    function wireCard(card) {
      if (wired.has(card)) return;
      wired.add(card);
      card.addEventListener('pointerenter', () => {
        if (!enabled || !fine.matches) return;
        gsap.to(card, {y:-17,scale:1.045,duration:.65,ease:'elastic.out(1,.45)',boxShadow:'0 24px 40px rgba(0,0,0,.16)',overwrite:'auto'});
        const icon = card.querySelector('.a1-course-icon');
        if (icon) gsap.fromTo(icon, {y:0,rotation:0}, {y:-14,rotation:-15,duration:.4,ease:'back.out(3)',overwrite:true});
      });
      card.addEventListener('pointerleave', () => {
        if (!enabled) return;
        gsap.to(card, {x:0,y:0,rotationX:0,rotationY:0,scale:1,boxShadow:'0 0px 0px rgba(0,0,0,0)',duration:.7,ease:'elastic.out(1,.45)',overwrite:true});
        const icon = card.querySelector('.a1-course-icon'); if (icon) gsap.to(icon, {y:0,rotation:0,duration:.7,ease:'elastic.out(1,.35)',overwrite:true});
      });
      card.addEventListener('focusin', () => { if (enabled) gsap.to(card, {y:-6,duration:.25,ease:'power2.out'}); });
      card.addEventListener('focusout', event => { if (enabled && !card.contains(event.relatedTarget)) gsap.to(card, {y:0,duration:.35,ease:'back.out(2)'}); });
    }
    function cards() { document.querySelectorAll('.a1-course').forEach(wireCard); }
    cards();
    const grid = document.getElementById('courses-grid');
    if (grid) new window.MutationObserver(() => {
      cards();
      if (enabled) gsap.fromTo([...grid.children], {y:20,rotation:2,scale:.97}, {y:0,rotation:0,scale:1,duration:.5,stagger:.035,ease:'back.out(1.8)',overwrite:true});
    }).observe(grid, {childList:true});
    document.querySelectorAll('.studio-button,.filter-chip').forEach(button => {
      button.addEventListener('pointerleave', () => { if (enabled) gsap.to(button,{x:0,y:0,duration:.6,ease:'elastic.out(1,.3)',overwrite:true}); });
    });
    document.addEventListener('click', event => {
      const button = event.target.closest('button.filter-chip,button[data-resource-kind]');
      if (!enabled || !button) return;
      const box = button.getBoundingClientRect();
      burst(box.left+box.width/2,box.top+box.height/2,10);
    });
    const books = [...document.querySelectorAll('.studio-book')];
    books.forEach((book, i) => {
      let pointer = null, startX = 0, startY = 0, dragged = false;
      book.addEventListener('pointerenter', () => { if (enabled && fine.matches && pointer === null) gsap.to(book,{y:-14,scale:1.07,rotation:0,duration:.55,ease:'elastic.out(1,.4)',overwrite:true}); });
      function reset() { if (enabled) gsap.to(book,{x:0,y:0,scale:1,rotation:[-7,4,-3][i],duration:.8,ease:'elastic.out(1,.3)',overwrite:true}); book.classList.remove('is-dragging'); }
      book.addEventListener('pointerleave', () => { if (pointer === null) reset(); });
      book.addEventListener('pointerdown', event => {
        if (!enabled || event.button !== 0 || !fine.matches) return;
        pointer = event.pointerId; startX = event.clientX; startY = event.clientY; dragged = false;
        book.classList.add('is-dragging');
      });
      book.addEventListener('pointermove', event => {
        if (pointer !== event.pointerId) return;
        const x=event.clientX-startX,y=event.clientY-startY;
        if (Math.abs(x)+Math.abs(y)>8) { dragged=true; book.setPointerCapture(pointer); }
        if (dragged) gsap.to(book,{x:Math.max(-100,Math.min(100,x)),y:Math.max(-70,Math.min(70,y)),rotation:x*.1,scale:1.09,duration:.12,overwrite:true});
      });
      book.addEventListener('pointerup', event => { if (pointer !== event.pointerId) return; pointer=null; reset(); if (dragged) burst(event.clientX,event.clientY,15); });
      book.addEventListener('pointercancel', () => { pointer=null;dragged=false;reset(); });
      book.addEventListener('click', event => { if (dragged) {event.preventDefault();dragged=false;} });
    });
    const hero = document.querySelector('.studio-hero');
    if (hero) {
      const orbit = document.createElement('span'); orbit.className='studio-hero-orbit';orbit.setAttribute('aria-hidden','true');hero.prepend(orbit);
      if (enabled && !document.querySelector('[aria-modal="true"]')) {
        gsap.fromTo(books,{x:60,y:30,rotation:12},{x:0,y:0,rotation:index=>[-7,4,-3][index],duration:1.05,stagger:.12,ease:'elastic.out(1,.6)',clearProps:'transform'});
      }
    }
    window.addEventListener('hashchange', () => {
      if (!enabled) return;
      const visible = [...document.querySelectorAll('main>section')].find(section => !section.hidden);
      if (visible) gsap.fromTo(visible,{opacity:.45,y:15},{opacity:1,y:0,duration:.35,ease:'power3.out',clearProps:'transform,opacity',overwrite:true});
    });
    window.addEventListener('pagehide', stop);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  });
})();
