/* Original scroll composition. GSAP Draggable + Inertia own the free-play phase. */
(() => {
 const G=window.gsap,S=window.ScrollTrigger,D=window.Draggable,I=window.InertiaPlugin;
 if(G&&D&&I)G.registerPlugin(D,I);
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
 const phases=['حرّك المواد','توصيل المسارات','تشغيل المعالج','Kernal جاهز'];let current=null,serial=0;
 window.mountProcessorIntro=({host,onSeen,onSkip})=>{
  if(!G||!S||!D||!I)return null;
  const prefix='processor-'+(++serial),nodeW=110,nodeH=94,positions=[[126,116],[944,104],[166,450],[944,450],[540,58],[554,512]],orbit=[[236,136],[864,136],[236,434],[864,434],[550,57],[550,519]];
  const codes=['CS221','CS222','IS211','CS213','CS214','HUM201'],names=['معمارية الحاسوب','الرسم بالحاسوب','قواعد البيانات','هياكل البيانات','أنظمة التشغيل','كتابة التقارير'];
  const icons=window.PORTAL_COURSE_ICONS || ['cpu','shapes','database','network','panels-top-left','file-text'];
  const englishNames=['Architecture','Graphics','Databases','Data Structures','Operating Systems','Report Writing'];
  const el=document.createElement('section');el.className='desktop-intro processor-intro';el.setAttribute('aria-label','مقدمة Kernal التفاعلية');
  let controls=null,observer=null,trigger=null,timeline=null,visibility=null,keyHandler=null,clampScroll=null;
  try {
  let traces='',vias='',pins='',cells='';
  // Forty-eight routed signal paths and twenty-four vias around the central die.
  for(let side=0;side<4;side++)for(let n=0;n<12;n++){
   const y=185+n*16,x1=454+(n%3)*7,x2=489+(n%4)*5,target=245+(n%6)*14;
   const points=[[438,y],[x1,y],[x1,target],[x2,target],[x2,241+(n%7)*12],[503,241+(n%7)*12]];
   const rotate=([x,y])=>{let u=x-550,v=y-290;for(let i=0;i<side;i++)[u,v]=[-v,u];return[u+550,v+290];};
   const d=points.map((p,i)=>{const q=rotate(p);return(i?'L':'M')+q[0]+','+q[1];}).join(' ');
   traces+=`<path class="chip-trace-base" d="${d}"/><path class="chip-trace-live" data-trace="${side*12+n}" d="${d}"/>`;
   if(n%2===0){const q=rotate([x1,y]);vias+=`<circle class="chip-via" cx="${q[0]}" cy="${q[1]}" r="2.5"/>`;}
  }
  for(let i=0;i<13;i++){const v=188+i*17;for(const [x1,y1,x2,y2]of [[413,v,432,v],[668,v,687,v],[448+i*17,153,448+i*17,172],[448+i*17,408,448+i*17,427]])pins+=`<path d="M${x1},${y1} L${x2},${y2}"/>`;}
  for(let r=0;r<7;r++)for(let c=0;c<7;c++)cells+=`<rect class="die-cell" x="${508+c*12}" y="${248+r*12}" width="8" height="8" rx="1.5"/>`;
  const wires=Array.from({length:6},(_,i)=>`<path class="feed-base" data-feed-base="${i}"/><path class="feed-live" data-feed="${i}"/><circle class="signal-packet" data-packet="${i}" r="3.3"/>`).join('');
  const markInner=window.PORTAL_MARK_INNER || '<g fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M11 6H7v20h4M21 6h4v20h-4M16 3v6m0 14v6M3 16h6m14 0h6"/><rect x="11" y="11" width="10" height="10" rx="2.5"/><path d="m14 16 2 2 3-4"/></g>';
  const socketScrews='<circle cx="448" cy="183" r="5" fill="#142844" stroke="#48729c" stroke-width="1"/><path d="M445 183 h6 M448 180 v6" stroke="#94a3b8" stroke-width="0.9"/><circle cx="652" cy="183" r="5" fill="#142844" stroke="#48729c" stroke-width="1"/><path d="M649 183 h6 M652 180 v6" stroke="#94a3b8" stroke-width="0.9"/><circle cx="448" cy="387" r="5" fill="#142844" stroke="#48729c" stroke-width="1"/><path d="M445 387 h6 M448 384 v6" stroke="#94a3b8" stroke-width="0.9"/><circle cx="652" cy="387" r="5" fill="#142844" stroke="#48729c" stroke-width="1"/><path d="M649 387 h6 M652 384 v6" stroke="#94a3b8" stroke-width="0.9"/>';
  const pcbMarkings='<g class="pcb-silkscreen" opacity="0.65"><path d="M 370 140 H 400 M 370 140 V 170" stroke="#38bdf8" stroke-width="1.6" fill="none" opacity="0.4"/><path d="M 730 140 H 700 M 730 140 V 170" stroke="#38bdf8" stroke-width="1.6" fill="none" opacity="0.4"/><path d="M 370 430 H 400 M 370 430 V 400" stroke="#38bdf8" stroke-width="1.6" fill="none" opacity="0.4"/><path d="M 730 430 H 700 M 730 430 V 400" stroke="#38bdf8" stroke-width="1.6" fill="none" opacity="0.4"/><rect x="360" y="110" width="380" height="350" rx="28" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 6" opacity="0.22"/><circle cx="550" cy="285" r="215" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.12"/><text x="375" y="130" fill="#7ba5cb" font-family="monospace" font-size="8.5" letter-spacing="1.5">SOCKET-LGA2026 // 6-CH BUS</text><text x="725" y="445" text-anchor="end" fill="#7ba5cb" font-family="monospace" font-size="8.5" letter-spacing="1.5">KERNAL ARCHITECTURE // 64-BIT</text><circle cx="380" cy="285" r="2.5" fill="#0b172a" stroke="#f59e0b" stroke-width="1"/><circle cx="720" cy="285" r="2.5" fill="#0b172a" stroke="#f59e0b" stroke-width="1"/></g>';
  const defs=`<defs><clipPath id="${prefix}-clip"><rect x="440" y="177" width="220" height="226" rx="17"/></clipPath><linearGradient id="${prefix}-chip-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#152b47"/><stop offset="50%" stop-color="#0d1e34"/><stop offset="100%" stop-color="#081424"/></linearGradient><linearGradient id="${prefix}-die-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#091b33"/><stop offset="50%" stop-color="#051122"/><stop offset="100%" stop-color="#030913"/></linearGradient><linearGradient id="${prefix}-gold-pins" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f59e0b"/><stop offset="50%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#d97706"/></linearGradient></defs>`;
  el.innerHTML=`<div class="processor-scene"><div class="processor-stage"><div class="processor-board"><svg class="processor-svg" viewBox="0 0 1100 580" aria-hidden="true">${defs}${pcbMarkings}<g class="processor-feed-wires">${wires}</g><g class="processor-core"><g class="chip-pins">${pins}</g><rect class="chip-shadow" x="430" y="177" width="240" height="240" rx="25"/><rect class="chip-shell" x="430" y="165" width="240" height="240" rx="25" fill="url(#${prefix}-chip-grad)"/><rect class="chip-bezel-border" x="434" y="169" width="232" height="232" rx="21" fill="none" stroke="rgba(148,197,255,0.35)" stroke-width="1.5"/><g class="chip-socket-screws" opacity="0.8">${socketScrews}</g><text x="550" y="196" text-anchor="middle" fill="rgba(186,215,250,0.45)" font-family="monospace" font-size="8.5" font-weight="600" letter-spacing="2">KERNAL-CORE 8X // 4.8 GHz</text><rect class="chip-inner" x="440" y="175" width="220" height="220" rx="18"/><g clip-path="url(#${prefix}-clip)">${traces}${vias}</g><rect class="chip-die" x="497" y="237" width="106" height="106" rx="11" fill="url(#${prefix}-die-grad)"/><rect class="die-edge-line" x="497" y="237" width="106" height="106" rx="11" fill="none" stroke="#38bdf8" stroke-width="1.2" opacity="0.6"/><g class="die-cells">${cells}</g><g class="processor-seal" transform="translate(516 252) scale(2.15)">${markInner}</g><rect class="chip-charge-edge" x="430" y="165" width="240" height="240" rx="25"/><circle class="processor-pulse" cx="550" cy="285" r="120"/><circle class="processor-wave" cx="550" cy="285" r="120"/></g></svg>${codes.map((code,i)=>`<div class="processor-node" data-node="${i}" tabindex="0" role="group" aria-roledescription="رمز مادة قابل للتحريك" aria-label="${names[i]}، استخدم الأسهم للتحريك" aria-describedby="processor-help"><div class="node-accent-strip" aria-hidden="true"></div><div class="node-meta-row" aria-hidden="true"><span class="node-slot-tag">CH-0${i+1}</span><span class="node-led"></span></div><span class="processor-node-icon"><i data-lucide="${icons[i]}" aria-hidden="true"></i></span><bdi class="processor-node-code">${code}</bdi><span class="processor-node-name" lang="en" dir="ltr">${englishNames[i]}</span><span class="processor-node-ar">${names[i]}</span><div class="node-connector-pins" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></div>`).join('')}<div class="processor-ready" aria-hidden="true"><div class="ready-badge"><span class="ready-pulse-dot"></span><span>SYSTEM ONLINE // تم التجميع</span></div><div class="ready-brand-group"><h2 class="ready-brand-title">Kernal</h2><p class="ready-brand-sub">The core of every study • سنة ثانية — الترم الأول</p></div><button class="processor-enter-btn" data-processor-enter data-processor-skip aria-label="دخول المنصة"><span>دخول المنصة</span><i data-lucide="arrow-left" aria-hidden="true"></i></button><span class="ready-hint">اضغط لدخول المنصة والبدء</span></div></div></div><p id="processor-help" class="sr-only">اسحب رموز المواد أو استخدم الأسهم للتحريك، ثم مرّر الصفحة.</p><div class="sr-only" role="status" aria-live="polite"><span data-phase-label>حرّك المواد</span></div><div class="processor-scroll-meter" aria-hidden="true" style="display:none"><span></span></div></div>`;
  controls=document.createElement('details');controls.className='processor-move-tools processor-lab-controls';controls.innerHTML=`<summary>تحريك الرموز</summary><div class="processor-move-panel"><label>المادة<select data-processor-select>${names.map((n,i)=>`<option value="${i}">${englishNames[i]} — ${n}</option>`).join('')}</select></label><div class="processor-move-arrows"><button data-move-node="left" aria-label="تحريك لليسار">←</button><button data-move-node="up" aria-label="تحريك لأعلى">↑</button><button data-move-node="down" aria-label="تحريك لأسفل">↓</button><button data-move-node="right" aria-label="تحريك لليمين">→</button></div></div>`;document.querySelector('.preview-bar')?.append(controls);
  host.before(el);window.lucide?.createIcons();
  const board=el.querySelector('.processor-board'),stage=el.querySelector('.processor-stage'),nodes=[...el.querySelectorAll('.processor-node')],live=[...el.querySelectorAll('.chip-trace-live')],die=[...el.querySelectorAll('.die-cell')],feeds=[...el.querySelectorAll('.feed-live')],backs=[...el.querySelectorAll('.feed-base')],packets=[...el.querySelectorAll('.signal-packet')],readyEl=el.querySelector('.processor-ready');
  let destroyed=false,progress=0,phase=-1,assembled=false,draggers=[],snapshots=positions.map((p,i)=>({x:p[0]-nodeW/2,y:p[1]-nodeH/2,rotation:[-11,8,-7,12,-5,6][i]})),cachedPaths=[],lengths=[],selected=null,renderTime=0;
  nodes.forEach((n,i)=>G.set(n,{x:snapshots[i].x,y:snapshots[i].y,rotation:snapshots[i].rotation}));
  const traceLengths=live.map(p=>p.getTotalLength());live.forEach((p,i)=>{p.style.strokeDasharray=traceLengths[i];p.style.strokeDashoffset=traceLengths[i];});
  const readFree=()=>nodes.map(n=>({x:Number(G.getProperty(n,'x')),y:Number(G.getProperty(n,'y')),rotation:Number(G.getProperty(n,'rotation'))}));
  const bindDraggers=()=>{draggers=D.create(nodes,{type:'x,y',bounds:board,inertia:true,throwResistance:2300,maxDuration:1.1,minDuration:.2,overshootTolerance:0,edgeResistance:.8,dragClickables:true,zIndexBoost:true,onPress(){selected=this.target;controls.querySelector('[data-processor-select]').value=this.target.dataset.node;G.killTweensOf(this.target);this.target.classList.add('is-dragging');},onDrag(){G.set(this.target,{rotation:0,overwrite:'auto'});},onRelease(){this.target.classList.remove('is-dragging');G.set(this.target,{rotation:0,overwrite:'auto'});},onThrowComplete(){if(progress<.06)snapshots=readFree();}});};
  bindDraggers();
  const resize=()=>{if(destroyed)return;const scale=Math.min(stage.clientWidth/1100,stage.clientHeight/580,1.12);G.set(board,{xPercent:-50,yPercent:-50,scale});draggers.forEach(d=>d.applyBounds());};
  observer=new window.ResizeObserver(resize);observer.observe(stage);resize();
  const ports=[[430,225],[670,225],[430,345],[670,345],[550,165],[550,405]];
  const route=(i,x,y)=>{const [px,py]=ports[i];if(i<4){const middle=i%2===0?350:750;return`M${x},${y} H${middle} V${py} H${px}`;}return`M${x},${y} V${py}`;};
  const getWirePoint=(i,x,y,t)=>{
   const [px,py]=ports[i];
   if(i>=4)return {x,y:y+(py-y)*t};
   const middle=i%2===0?350:750,l1=Math.abs(middle-x),l2=Math.abs(py-y),l3=Math.abs(px-middle),total=l1+l2+l3,dist=total*t;
   if(dist<=l1)return {x:x+(middle-x)*(dist/(l1||1)),y};
   if(dist<=l1+l2)return {x:middle,y:y+(py-y)*((dist-l1)/(l2||1))};
   return {x:middle+(px-middle)*((dist-l1-l2)/(l3||1)),y:py};
  };
  const getWireLength=(i,x,y)=>{
   const [px,py]=ports[i];
   if(i>=4)return Math.abs(py-y);
   const middle=i%2===0?350:750;
   return Math.abs(middle-x)+Math.abs(py-y)+Math.abs(px-middle);
  };
  const lastAmounts=new Float32Array(48),lastCellOpacities=new Float32Array(49);
  const setPhase=n=>{if(n===phase)return;phase=n;el.dataset.phase=String(n);nodes.forEach(node=>{node.tabIndex=n===0?0:-1;node.setAttribute('aria-disabled',String(n!==0));});el.querySelector('[data-phase-label]').textContent=phases[n];el.querySelector('#processor-help').textContent=n===0?'اسحب رموز المواد وارميها، وبعدها اسكرول.':n===1?'الرموز بتتجمع، والمسارات بتتوصّل. كمّل السكرول.':n===2?'الإشارات بتملأ المسارات الداخلية للمعالج.':'المعالج جاهز بالكامل. اضغط دخول المنصة.';};
  function render(p){const started=performance.now();if(destroyed)return;progress=p;const gathering=smooth((p-.06)/.29),charge=clamp((p-.35)/.49),finale=clamp((p-.84)/.16);
   if(p>=.06&&!assembled){snapshots=readFree();draggers.forEach(d=>{d.disable();d.tween?.kill();});nodes.forEach(n=>G.killTweensOf(n));assembled=true;}
   if(p<.06&&assembled){nodes.forEach((n,i)=>G.set(n,snapshots[i]));draggers.forEach(d=>d.enable());assembled=false;}
   if(assembled)nodes.forEach((n,i)=>G.set(n,{x:snapshots[i].x+(orbit[i][0]-nodeW/2-snapshots[i].x)*gathering,y:snapshots[i].y+(orbit[i][1]-nodeH/2-snapshots[i].y)*gathering,rotation:snapshots[i].rotation*(1-gathering)}));
   const feedIn=clamp((p-.20)/.23);
   for(let i=0;i<6;i++){
    const x=Number(G.getProperty(nodes[i],'x'))+nodeW/2,y=Number(G.getProperty(nodes[i],'y'))+nodeH/2,d=route(i,x,y);
    if(cachedPaths[i]!==d){
      feeds[i].setAttribute('d',d);
      backs[i].setAttribute('d',d);
      lengths[i]=getWireLength(i,x,y);
      feeds[i].style.strokeDasharray=lengths[i];
      cachedPaths[i]=d;
    }
    const v=clamp((feedIn-i*.05)*1.3);
    feeds[i].style.strokeDashoffset=lengths[i]*(1-v);
    feeds[i].style.opacity=String(clamp(feedIn*3));
    backs[i].style.opacity=String(clamp(feedIn*1.5)*.45);
    const t=clamp((p-.34-i*.013)/.27);
    if(t>0&&t<1){
      const q=getWirePoint(i,x,y,t);
      packets[i].setAttribute('cx',q.x);
      packets[i].setAttribute('cy',q.y);
      packets[i].style.opacity=String(Math.sin(t*Math.PI));
    } else packets[i].style.opacity='0';
   }
   for(let i=0;i<48;i++){
    const amount=clamp((charge-(i%12)*.034-Math.floor(i/12)*.035)*2.15);
    if(Math.abs(amount-lastAmounts[i])>0.008||(amount===1&&lastAmounts[i]!==1)||(amount===0&&lastAmounts[i]!==0)){
      live[i].style.strokeDashoffset=traceLengths[i]*(1-amount);
      lastAmounts[i]=amount;
    }
   }
   for(let i=0;i<49;i++){
    const amount=clamp((p-.49-i*.0046)*7);
    const opacity=.1+amount*.9;
    if(Math.abs(opacity-lastCellOpacities[i])>0.01||(amount===1&&lastCellOpacities[i]!==1)||(amount===0&&lastCellOpacities[i]!==0.1)){
      die[i].style.opacity=String(opacity);
      lastCellOpacities[i]=opacity;
    }
   }
   G.set(el.querySelector('.processor-core'),{scale:1+Math.sin(finale*Math.PI)*.045,svgOrigin:'550 285'});
   G.set(el.querySelector('.processor-seal'),{opacity:smooth((finale-.24)/.5)});
   G.set(el.querySelector('.die-cells'),{opacity:1-clamp((finale-.2)*1.25)*.9});
   const readyActive=finale>0.45;
   readyEl.style.pointerEvents=readyActive?'auto':'none';
   G.set(readyEl,{opacity:smooth((finale-.45)/.5),y:15*(1-smooth((finale-.45)/.5))});
   G.set(el.querySelector('.processor-pulse'),{attr:{r:120+finale*75},opacity:Math.sin(finale*Math.PI)*.85});
   G.set(el.querySelector('.processor-wave'),{attr:{r:120+finale*280},opacity:Math.sin(finale*Math.PI)*.4});
   el.querySelector('.chip-charge-edge').style.opacity=String(charge*.8+finale*.2);
   const meter=el.querySelector('.processor-scroll-meter span');if(meter)meter.style.transform=`scaleX(${p})`;
   setPhase(p<.06?0:p<.49?1:p<.92?2:3);
   renderTime=performance.now()-started;
  }
  const driver={p:0};timeline=G.to(driver,{p:1,duration:1,ease:'none',paused:true,onUpdate:()=>render(driver.p)});
  const distance=()=>Math.min(1400,Math.max(1000,window.innerHeight*1.5));const availableHeight=()=>el.querySelector('.processor-scene').getBoundingClientRect().height;el.style.height=`${availableHeight()+distance()}px`;
  trigger=S.create({id:'sem2-processor-intro',trigger:el,start:()=> 'top '+(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ui-top-offset'))||0)+'px',end:()=>'+='+distance(),pin:el.querySelector('.processor-scene'),pinSpacing:false,scrub:true,animation:timeline,invalidateOnRefresh:true,onRefresh:()=>{el.style.height=`${availableHeight()+distance()}px`;resize();}});
  let clamping=false;
  clampScroll=()=>{
   if(!destroyed&&trigger&&window.scrollY>trigger.end+4){
    if(!clamping){
     clamping=true;
     requestAnimationFrame(()=>{
      if(!destroyed&&trigger&&window.scrollY>trigger.end)window.scrollTo(0,trigger.end);
      clamping=false;
     });
    }
   }
  };
  window.addEventListener('scroll',clampScroll,{passive:true});
  el.querySelector('[data-processor-enter]')?.addEventListener('click',()=>onSkip());
  el.querySelector('[data-processor-skip]')?.addEventListener('click',()=>onSkip());
  controls.addEventListener('toggle',()=>{if(controls.open&&progress>=.06){window.scrollTo({top:0,behavior:'instant'});S.update();timeline.progress(0);render(0);}});
  controls.querySelectorAll('[data-move-node]').forEach(button=>button.addEventListener('click',()=>{if(progress>=.06)return;const i=Number(controls.querySelector('[data-processor-select]').value),n=nodes[i],direction=button.dataset.moveNode;G.killTweensOf(n);draggers[i].tween?.kill();G.set(n,{x:clamp(Number(G.getProperty(n,'x'))+(direction==='left'?-30:direction==='right'?30:0),0,1100-nodeW),y:clamp(Number(G.getProperty(n,'y'))+(direction==='up'?-30:direction==='down'?30:0),0,580-nodeH),rotation:0});draggers[i].update();selected=n;snapshots=readFree();}));
  controls.addEventListener('keydown',e=>{if(e.key==='Escape')controls.open=false;});
  keyHandler=e=>{if(e.key==='Escape')onSkip();};document.addEventListener('keydown',keyHandler);
  visibility=()=>{if(document.hidden){draggers.forEach(d=>d.tween?.kill());G.killTweensOf(nodes);}};document.addEventListener('visibilitychange',visibility);
  nodes.forEach(n=>n.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)||progress>=.06)return;e.preventDefault();const x=Number(G.getProperty(n,'x'))+(e.key==='ArrowLeft'?-22:e.key==='ArrowRight'?22:0),y=Number(G.getProperty(n,'y'))+(e.key==='ArrowUp'?-22:e.key==='ArrowDown'?22:0);G.set(n,{x:clamp(x,0,1100-nodeW),y:clamp(y,0,580-nodeH),rotation:0});D.get(n)?.update();selected=n;snapshots=readFree();}));
  render(0);S.refresh();
  const handle={element:el,timeline,trigger,destroy(){if(destroyed)return;destroyed=true;document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',keyHandler);window.removeEventListener('scroll',clampScroll);observer.disconnect();trigger.kill();timeline.kill();draggers.forEach(d=>{d.tween?.kill();d.kill();});G.killTweensOf(nodes);el.remove();controls.remove();if(current===handle)current=null;},diagnostics:()=>({progress,phase,assembled,nodes:nodes.length,draggables:draggers.filter(d=>d.enabled()).length,traces:live.length,dieCells:die.length,renderMs:Number(renderTime.toFixed(2)),positions:readFree().map(p=>({x:Math.round(p.x),y:Math.round(p.y)})),selected:selected?.dataset.node??null})};
  current=handle;return handle;
  } catch(error) {
   if(visibility)document.removeEventListener('visibilitychange',visibility);
   if(keyHandler)document.removeEventListener('keydown',keyHandler);
   if(clampScroll)window.removeEventListener('scroll',clampScroll);
   observer?.disconnect();trigger?.kill();timeline?.kill();
   el.querySelectorAll('.processor-node').forEach(node=>{const dragger=D.get(node);dragger?.tween?.kill();dragger?.kill();});
   G.killTweensOf([...el.querySelectorAll('*')]);
   controls?.remove();el.remove();throw error;
  }
 };
 window.processorDiagnostics=()=>current?.diagnostics()||{mounted:false,nodes:0,draggables:0,traces:0};
 window.riftDiagnostics=()=>window.processorDiagnostics();
 window.mountRiftIntro=(opts)=>window.mountProcessorIntro(opts);
})();