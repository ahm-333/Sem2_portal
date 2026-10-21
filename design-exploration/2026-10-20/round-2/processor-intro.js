/* Original scroll composition. GSAP Draggable + Inertia own the free-play phase. */
(() => {
 const G=window.gsap,S=window.ScrollTrigger,D=window.Draggable,I=window.InertiaPlugin;
 if(G&&D&&I)G.registerPlugin(D,I);
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
 const phases=['حرّك المواد','توصيل المسارات','تشغيل المعالج','البوابة جاهزة'];let current=null,serial=0;
 window.mountProcessorIntro=({host,onSeen,onSkip})=>{
  if(!G||!S||!D||!I)return null;
  const prefix='processor-'+(++serial),nodeW=110,nodeH=94,positions=[[126,116],[944,104],[166,450],[944,450],[540,58],[554,512]],orbit=[[236,136],[864,136],[236,434],[864,434],[550,57],[550,519]];
  const codes=['CS221','CS222','IS211','CS213','CS214','HUM201'],names=['معمارية الحاسوب','الرسم بالحاسوب','قواعد البيانات','تراكيب البيانات','أنظمة التشغيل','كتابة التقارير'];
  const icons=window.PORTAL_COURSE_ICONS;
  const englishNames=['Architecture','Graphics','Databases','Data Structures','Operating Systems','Report Writing'];
  const el=document.createElement('section');el.className='desktop-intro processor-intro';el.setAttribute('aria-label','مقدمة تفاعلية: المواد تغذّي معالج البوابة');
  let controls=null,observer=null,trigger=null,timeline=null,visibility=null;
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
  el.innerHTML=`<div class="processor-scene"><header class="processor-head"><button class="processor-skip" data-processor-skip>تخطّي الإنترو <span aria-hidden="true">↙</span></button></header><div class="processor-stage"><div class="processor-board"><svg class="processor-svg" viewBox="0 0 1100 580" aria-hidden="true"><defs><clipPath id="${prefix}-clip"><rect x="440" y="177" width="220" height="226" rx="17"/></clipPath><filter id="${prefix}-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter></defs><g class="processor-feed-wires">${wires}</g><g class="processor-core"><g class="chip-pins">${pins}</g><rect class="chip-shadow" x="430" y="177" width="240" height="240" rx="25"/><rect class="chip-shell" x="430" y="165" width="240" height="240" rx="25"/><rect class="chip-inner" x="440" y="175" width="220" height="220" rx="18"/><g clip-path="url(#${prefix}-clip)">${traces}${vias}</g><rect class="chip-die" x="497" y="237" width="106" height="106" rx="11"/><g class="die-cells">${cells}</g><g class="processor-seal" transform="translate(516 252) scale(2.15)">${window.PORTAL_MARK_INNER}</g><rect class="chip-charge-edge" x="430" y="165" width="240" height="240" rx="25"/><circle class="processor-pulse" cx="550" cy="285" r="120"/><circle class="processor-wave" cx="550" cy="285" r="120"/></g></svg>${codes.map((code,i)=>`<div class="processor-node" data-node="${i}" tabindex="0" role="group" aria-roledescription="رمز مادة قابل للتحريك" aria-label="${names[i]}، استخدم الأسهم للتحريك" aria-describedby="processor-help"><span class="processor-node-icon"><i data-lucide="${icons[i]}" aria-hidden="true"></i></span><bdi class="processor-node-code">${code}</bdi><span class="processor-node-name" lang="en" dir="ltr">${englishNames[i]}</span><span class="processor-node-ar">${names[i]}</span></div>`).join('')}<div class="processor-ready" aria-hidden="true"><strong>البوابة جاهزة.</strong><span>اختار مادتك وابدأ.</span></div></div></div><p id="processor-help" class="sr-only">اسحب رموز المواد أو استخدم الأسهم للتحريك، ثم مرّر الصفحة.</p><div class="sr-only" role="status" aria-live="polite"><span data-phase-label>حرّك المواد</span></div><div class="processor-scroll-meter" aria-hidden="true"><span></span></div></div>`;
  controls=document.createElement('details');controls.className='processor-move-tools processor-lab-controls';controls.innerHTML=`<summary>تحريك الرموز</summary><div class="processor-move-panel"><label>المادة<select data-processor-select>${names.map((n,i)=>`<option value="${i}">${englishNames[i]} — ${n}</option>`).join('')}</select></label><div class="processor-move-arrows"><button data-move-node="left" aria-label="تحريك لليسار">←</button><button data-move-node="up" aria-label="تحريك لأعلى">↑</button><button data-move-node="down" aria-label="تحريك لأسفل">↓</button><button data-move-node="right" aria-label="تحريك لليمين">→</button></div></div>`;document.querySelector('.preview-bar')?.append(controls);
  host.before(el);window.lucide?.createIcons();
  const board=el.querySelector('.processor-board'),stage=el.querySelector('.processor-stage'),nodes=[...el.querySelectorAll('.processor-node')],live=[...el.querySelectorAll('.chip-trace-live')],die=[...el.querySelectorAll('.die-cell')],feeds=[...el.querySelectorAll('.feed-live')],backs=[...el.querySelectorAll('.feed-base')],packets=[...el.querySelectorAll('.signal-packet')];
  let destroyed=false,progress=0,phase=-1,assembled=false,draggers=[],snapshots=positions.map((p,i)=>({x:p[0]-nodeW/2,y:p[1]-nodeH/2,rotation:[-11,8,-7,12,-5,6][i]})),cachedPaths=[],lengths=[],selected=null,renderTime=0,notified=false;
  nodes.forEach((n,i)=>G.set(n,{x:snapshots[i].x,y:snapshots[i].y,rotation:snapshots[i].rotation}));
  const traceLengths=live.map(p=>p.getTotalLength());live.forEach((p,i)=>{p.style.strokeDasharray=traceLengths[i];p.style.strokeDashoffset=traceLengths[i];});
  const readFree=()=>nodes.map(n=>({x:Number(G.getProperty(n,'x')),y:Number(G.getProperty(n,'y')),rotation:Number(G.getProperty(n,'rotation'))}));
  const bindDraggers=()=>{draggers=D.create(nodes,{type:'x,y',bounds:board,inertia:true,throwResistance:2300,maxDuration:1.1,minDuration:.2,overshootTolerance:0,edgeResistance:.8,dragClickables:true,zIndexBoost:true,onPress(){selected=this.target;controls.querySelector('[data-processor-select]').value=this.target.dataset.node;G.killTweensOf(this.target);this.target.classList.add('is-dragging');},onDrag(){G.to(this.target,{rotation:clamp(this.deltaX*.35,-12,12),duration:.12,overwrite:'auto'});},onRelease(){this.target.classList.remove('is-dragging');G.to(this.target,{rotation:0,duration:.4,ease:'power3.out',overwrite:'auto'});},onThrowComplete(){if(progress<.06)snapshots=readFree();}});};
  bindDraggers();
  const resize=()=>{if(destroyed)return;const scale=Math.min(stage.clientWidth/1100,stage.clientHeight/580,1.12);G.set(board,{xPercent:-50,yPercent:-50,scale});draggers.forEach(d=>d.applyBounds());};
  observer=new window.ResizeObserver(resize);observer.observe(stage);resize();
  const ports=[[430,225],[670,225],[430,345],[670,345],[550,165],[550,405]];
  const route=(i,x,y)=>{const [px,py]=ports[i];if(i<4){const middle=i%2===0?350:750;return`M${x},${y} H${middle} V${py} H${px}`;}return`M${x},${y} V${py}`;};
  const setPhase=n=>{if(n===phase)return;phase=n;el.dataset.phase=String(n);nodes.forEach(node=>{node.tabIndex=n===0?0:-1;node.setAttribute('aria-disabled',String(n!==0));});el.querySelector('[data-phase-label]').textContent=phases[n];el.querySelector('#processor-help').textContent=n===0?'اسحب رموز المواد وارميها، وبعدها اسكرول.':n===1?'الرموز بتتجمع، والمسارات بتتوصّل. كمّل السكرول.':n===2?'الإشارات بتملأ المسارات الداخلية للمعالج.':'كل المسارات اتجمعت. جاهز تدخل لموادك.';};
  function render(p){const started=performance.now();if(destroyed)return;progress=p;const gathering=smooth((p-.06)/.29),charge=clamp((p-.35)/.49),finale=clamp((p-.84)/.16);
   if(p>=.06&&!assembled){snapshots=readFree();draggers.forEach(d=>{d.disable();d.tween?.kill();});nodes.forEach(n=>G.killTweensOf(n));assembled=true;}
   if(p<.06&&assembled){nodes.forEach((n,i)=>G.set(n,snapshots[i]));draggers.forEach(d=>d.enable());assembled=false;}
   if(assembled)nodes.forEach((n,i)=>G.set(n,{x:snapshots[i].x+(orbit[i][0]-nodeW/2-snapshots[i].x)*gathering,y:snapshots[i].y+(orbit[i][1]-nodeH/2-snapshots[i].y)*gathering,rotation:snapshots[i].rotation*(1-gathering)}));
   const feedIn=clamp((p-.20)/.23);feeds.forEach((line,i)=>{const x=Number(G.getProperty(nodes[i],'x'))+nodeW/2,y=Number(G.getProperty(nodes[i],'y'))+nodeH/2,d=route(i,x,y);if(cachedPaths[i]!==d){line.setAttribute('d',d);backs[i].setAttribute('d',d);lengths[i]=line.getTotalLength();line.style.strokeDasharray=lengths[i];cachedPaths[i]=d;}const v=clamp((feedIn-i*.05)*1.3);line.style.strokeDashoffset=lengths[i]*(1-v);line.style.opacity=String(clamp(feedIn*3));backs[i].style.opacity=String(clamp(feedIn*1.5)*.45);const t=clamp((p-.34-i*.013)/.27);if(t>0&&t<1){const q=line.getPointAtLength(lengths[i]*t);packets[i].setAttribute('cx',q.x);packets[i].setAttribute('cy',q.y);packets[i].style.opacity=String(Math.sin(t*Math.PI));}else packets[i].style.opacity='0';});
   live.forEach((path,i)=>{const amount=clamp((charge-(i%12)*.034-Math.floor(i/12)*.035)*2.15);path.style.strokeDashoffset=traceLengths[i]*(1-amount);});
   die.forEach((cell,i)=>{const amount=clamp((p-.49-i*.0046)*7);cell.style.opacity=String(.1+amount*.9);});
   G.set(el.querySelector('.processor-core'),{scale:1+Math.sin(finale*Math.PI)*.045,svgOrigin:'550 285'});
   G.set(el.querySelector('.processor-seal'),{opacity:smooth((finale-.24)/.5)});
   G.set(el.querySelector('.die-cells'),{opacity:1-clamp((finale-.2)*1.25)*.9});
   G.set(el.querySelector('.processor-ready'),{opacity:smooth((finale-.45)/.5),y:15*(1-smooth((finale-.45)/.5))});
   G.set(el.querySelector('.processor-pulse'),{attr:{r:120+finale*75},opacity:Math.sin(finale*Math.PI)*.85});
   G.set(el.querySelector('.processor-wave'),{attr:{r:120+finale*280},opacity:Math.sin(finale*Math.PI)*.4});
   el.querySelector('.chip-charge-edge').style.opacity=String(charge*.8+finale*.2);
   el.querySelector('.processor-scroll-meter span').style.transform=`scaleX(${p})`;
   setPhase(p<.06?0:p<.49?1:p<.92?2:3);if(p>.985&&!notified){notified=true;onSeen();}renderTime=performance.now()-started;
  }
  const driver={p:0};timeline=G.to(driver,{p:1,duration:1,ease:'none',paused:true,onUpdate:()=>render(driver.p)});
  const distance=()=>Math.min(1400,Math.max(1000,window.innerHeight*1.5));const availableHeight=()=>el.querySelector('.processor-scene').getBoundingClientRect().height;el.style.height=`${availableHeight()+distance()}px`;
  trigger=S.create({id:'sem2-processor-intro',trigger:el,start:()=> 'top '+(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ui-top-offset'))||0)+'px',end:()=>'+='+distance(),pin:el.querySelector('.processor-scene'),pinSpacing:false,scrub:.38,animation:timeline,invalidateOnRefresh:true,onRefresh:()=>{el.style.height=`${availableHeight()+distance()}px`;resize();}});
  function jump(p){window.scrollTo({top:trigger.start+(trigger.end-trigger.start)*p,behavior:'smooth'});}
  el.querySelector('[data-processor-skip]').addEventListener('click',()=>onSkip());
  el.querySelector('.processor-brand')?.addEventListener('click',e=>{e.preventDefault();onSkip();});
  el.querySelector('[data-processor-next]')?.addEventListener('click',()=>{if(progress<.06)jump(.46);else if(progress<.92)jump(1);else onSkip();});
  el.querySelector('[data-processor-reset]')?.addEventListener('click',()=>{if(progress>=.06){window.scrollTo({top:Math.max(0,trigger.start-2),behavior:'instant'});timeline.progress(0);render(0);}nodes.forEach((n,i)=>G.to(n,{x:positions[i][0]-nodeW/2,y:positions[i][1]-nodeH/2,rotation:[-11,8,-7,12,-5,6][i],duration:.45,ease:'power3.out',overwrite:true,onComplete:()=>draggers[i]?.update()}));});
  controls.addEventListener('toggle',()=>{if(controls.open&&progress>=.06){window.scrollTo({top:0,behavior:'instant'});S.update();timeline.progress(0);render(0);}});
  controls.querySelectorAll('[data-move-node]').forEach(button=>button.addEventListener('click',()=>{if(progress>=.06)return;const i=Number(controls.querySelector('[data-processor-select]').value),n=nodes[i],direction=button.dataset.moveNode;G.killTweensOf(n);draggers[i].tween?.kill();G.set(n,{x:clamp(Number(G.getProperty(n,'x'))+(direction==='left'?-30:direction==='right'?30:0),0,1100-nodeW),y:clamp(Number(G.getProperty(n,'y'))+(direction==='up'?-30:direction==='down'?30:0),0,580-nodeH),rotation:0});draggers[i].update();selected=n;snapshots=readFree();}));
  controls.addEventListener('keydown',e=>{if(e.key==='Escape')controls.open=false;});
  visibility=()=>{if(document.hidden){draggers.forEach(d=>d.tween?.kill());G.killTweensOf(nodes);}};document.addEventListener('visibilitychange',visibility);
  nodes.forEach(n=>n.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)||progress>=.06)return;e.preventDefault();const x=Number(G.getProperty(n,'x'))+(e.key==='ArrowLeft'?-22:e.key==='ArrowRight'?22:0),y=Number(G.getProperty(n,'y'))+(e.key==='ArrowUp'?-22:e.key==='ArrowDown'?22:0);G.set(n,{x:clamp(x,0,1100-nodeW),y:clamp(y,0,580-nodeH),rotation:0});D.get(n)?.update();selected=n;snapshots=readFree();}));
  render(0);S.refresh();
  const handle={element:el,timeline,trigger,destroy(){if(destroyed)return;destroyed=true;document.removeEventListener('visibilitychange',visibility);observer.disconnect();trigger.kill();timeline.kill();draggers.forEach(d=>{d.tween?.kill();d.kill();});G.killTweensOf(nodes);el.remove();controls.remove();if(current===handle)current=null;},diagnostics:()=>({progress,phase,assembled,nodes:nodes.length,draggables:draggers.filter(d=>d.enabled()).length,traces:live.length,dieCells:die.length,renderMs:Number(renderTime.toFixed(2)),positions:readFree().map(p=>({x:Math.round(p.x),y:Math.round(p.y)})),selected:selected?.dataset.node??null})};
  current=handle;return handle;
  } catch(error) {
   if(visibility)document.removeEventListener('visibilitychange',visibility);
   observer?.disconnect();trigger?.kill();timeline?.kill();
   el.querySelectorAll('.processor-node').forEach(node=>{const dragger=D.get(node);dragger?.tween?.kill();dragger?.kill();});
   G.killTweensOf([...el.querySelectorAll('*')]);
   controls?.remove();el.remove();throw error;
  }
 };
 window.processorDiagnostics=()=>current?.diagnostics()||{mounted:false,nodes:0,draggables:0,traces:0};
})();
