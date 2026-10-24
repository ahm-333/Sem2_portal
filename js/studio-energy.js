/* Persistent, bounded Canvas constellation. Visual energy stays inside the page. */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded',() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    for (const host of document.querySelectorAll('.studio-hero,.course-atlas')) {
      const canvas = document.createElement('canvas'); canvas.className = 'studio-energy'; canvas.setAttribute('aria-hidden','true'); host.prepend(canvas);
      const ctx = canvas.getContext('2d'); if (!ctx) {canvas.remove();continue;}
      let width=1,height=1,frame=0,last=0,visible=false,time=0,bursts=[],shock=null;
      let pointerX=0,pointerY=0,actualX=0,actualY=0;
      const points = Array.from({length:56},(_,i) => {
        const y=1-(i/55)*2,r=Math.sqrt(1-y*y),a=i*2.399963;
        return {x:Math.cos(a)*r,y,z:Math.sin(a)*r};
      });
      function resize() {
        const rect=host.getBoundingClientRect();width=rect.width;height=rect.height;
        const ratio=Math.min(window.devicePixelRatio || 1,1.5);
        canvas.width=Math.max(1,Math.round(width*ratio));canvas.height=Math.max(1,Math.round(height*ratio));
        ctx.setTransform(ratio,0,0,ratio,0,0);
        if (reduce.matches) draw(0);
      }
      function explode(x,y) {
        if (reduce.matches) return;
        shock={x,y,r:0,alpha:.65};
        bursts=[];
        for(let i=0;i<68;i++){const a=i/68*Math.PI*2;const speed=2+Math.random()*5;bursts.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:1,size:1+Math.random()*2});}
        canvas.dataset.pulses=String(Number(canvas.dataset.pulses || 0)+1);
      }
      function draw(delta) {
        time+=delta*.00016;actualX+=(pointerX-actualX)*.035;actualY+=(pointerY-actualY)*.035;
        ctx.clearRect(0,0,width,height);
        const radius=Math.min(width*.31,height*.65,220),cx=width*.3+actualX*12,cy=height*.52+actualY*12;
        const angle=time+actualX*.3,cos=Math.cos(angle),sin=Math.sin(angle);
        const plotted=points.map(point=>{const x=point.x*cos-point.z*sin,z=point.x*sin+point.z*cos;const depth=1+z*.22;return{x:cx+x*radius*depth,y:cy+point.y*radius*.66*depth,z,alpha:.12+(z+1)*.13};});
        ctx.lineWidth=.65;
        for(let i=0;i<plotted.length;i++){
          const a=plotted[i];
          for(let j=i+1;j<Math.min(plotted.length,i+9);j++){
            const b=plotted[j],distance=Math.hypot(a.x-b.x,a.y-b.y);
            if(distance<radius*.6){ctx.strokeStyle=`rgba(211,225,255,${(1-distance/(radius*.6))*.24})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
          }
          ctx.fillStyle=`rgba(226,238,255,${a.alpha})`;ctx.beginPath();ctx.arc(a.x,a.y,1.3+(a.z+1)*.7,0,Math.PI*2);ctx.fill();
        }
        for(const particle of bursts){particle.x+=particle.vx;particle.y+=particle.vy;particle.vx*=.975;particle.vy*=.975;particle.life-=.024;ctx.strokeStyle=`rgba(218,235,255,${Math.max(0,particle.life)})`;ctx.lineWidth=particle.size;ctx.beginPath();ctx.moveTo(particle.x,particle.y);ctx.lineTo(particle.x-particle.vx*4,particle.y-particle.vy*4);ctx.stroke();}
        bursts=bursts.filter(particle=>particle.life>0);
        if(shock){shock.r+=7;shock.alpha*=.94;ctx.strokeStyle=`rgba(219,232,255,${shock.alpha})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(shock.x,shock.y,shock.r,0,Math.PI*2);ctx.stroke();if(shock.alpha<.015)shock=null;}
      }
      function tick(stamp) {
        frame=0;
        if (!visible || document.hidden || reduce.matches) return;
        if(stamp-last>=30){draw(Math.min(50,stamp-last));last=stamp;}
        frame=window.requestAnimationFrame(tick);
      }
      function sync() {
        if(frame)window.cancelAnimationFrame(frame);frame=0;
        host.classList.toggle('energy-awake',visible && !document.hidden && !reduce.matches);
        if(visible && !document.hidden && !reduce.matches){last=window.performance.now();frame=window.requestAnimationFrame(tick);}else if(reduce.matches)draw(0);
      }
      host.addEventListener('pointerdown',event=>{const rect=host.getBoundingClientRect();explode(event.clientX-rect.left,event.clientY-rect.top);});
      const observer=new window.IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05});observer.observe(host);
      const size=new window.ResizeObserver(resize);size.observe(host);resize();
      if(!reduce.matches)explode(width*.3,height*.5);
      document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);
      window.addEventListener('pagehide',()=>{visible=false;sync();observer.disconnect();size.disconnect();});
      window.addEventListener('pageshow',()=>{observer.observe(host);size.observe(host);});
      window.addEventListener('portal:family-changed',()=>{if(visible)explode(width*.7,height*.5);});
    }
  });
})();
