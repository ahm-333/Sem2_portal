/* Preview-only UI polish: a fixed navbar and measured space above the page. */
(() => {
 document.body.classList.add('ui-fixed-nav');
 let observer=null,refresh=null,last=0;
 function measure(){const bar=document.querySelector('.preview-bar'),nav=document.querySelector('.topbar');if(!bar||!nav)return;const a=Math.ceil(bar.getBoundingClientRect().height),b=Math.ceil(nav.getBoundingClientRect().height),total=a+b;document.documentElement.style.setProperty('--review-bar-height',a+'px');document.documentElement.style.setProperty('--portal-nav-height',b+'px');document.documentElement.style.setProperty('--ui-top-offset',total+'px');if(last!==total){last=total;refresh?.kill();if(window.ScrollTrigger?.getAll().length)refresh=gsap.delayedCall(.04,()=>ScrollTrigger.refresh());}}
 addEventListener('portal:render',()=>{observer?.disconnect();measure();observer=new ResizeObserver(measure);observer.observe(document.querySelector('.preview-bar'));observer.observe(document.querySelector('.topbar'));});
 addEventListener('portal:intro-end',measure);
 addEventListener('pagehide',()=>{observer?.disconnect();refresh?.kill();});
 window.fixedNavDiagnostics=()=>({position:document.querySelector('.topbar')?getComputedStyle(document.querySelector('.topbar')).position:null,offset:last});
})();
