(function(){
 'use strict';
 const make=(tag,attrs={},text)=>{const e=document.createElement(tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;return e;};
 window.OSVisuals={render(v){
  const figure=make('figure',{class:'teaching-visual',id:v.id});figure.append(make('figcaption',{lang:'en',dir:'ltr'},v.title),make('p',{},v.description));
  const canvas=make('div',{class:'visual-canvas',tabindex:'0',role:'group','aria-label':`${v.title} · الرسم قابل للتمرير أفقيًا`});canvas.innerHTML=v.svg;
  const svg=canvas.querySelector('svg');if(svg){
   svg.setAttribute('dir','ltr');svg.setAttribute('lang','en');svg.style.direction='ltr';
   const viewWidth=svg.viewBox?.baseVal?.width;if(viewWidth)svg.style.minWidth=Math.max(700,viewWidth)+'px';
   const ids=new Map();for(const item of [svg,...svg.querySelectorAll('[id]')])if(item.id){ids.set(item.id,`${v.id}-svg-${item.id}`);item.id=ids.get(item.id);}
   for(const item of [svg,...svg.querySelectorAll('*')])for(const attr of [...item.attributes]){let value=attr.value.replace(/url\(#([^\)]+)\)/g,(_,id)=>`url(#${ids.get(id)||id})`);if(['href','xlink:href'].includes(attr.name)&&value.startsWith('#'))value='#'+(ids.get(value.slice(1))||value.slice(1));if(['aria-labelledby','aria-describedby'].includes(attr.name))value=value.split(/\s+/).map(id=>ids.get(id)||id).join(' ');if(value!==attr.value)item.setAttribute(attr.name,value);}
   svg.setAttribute('role','img');svg.setAttribute('aria-label',v.title);
  }
  figure.append(canvas,make('p',{class:'figure-note'},v.legend));
  const controls=make('div',{class:'visual-controls'}),previous=make('button',{type:'button'},'الخطوة اللي فاتت'),next=make('button',{type:'button'},'الخطوة اللي بعدها'),play=make('button',{type:'button','aria-pressed':'false'},'شغّل الخطوات');
  const status=make('div',{class:'visual-step',role:'status','aria-live':'polite'}),counter=make('p',{class:'small'});let current=0,timer=null;
  const stop=()=>{if(timer!==null)clearInterval(timer);timer=null;play.textContent='شغّل الخطوات';play.setAttribute('aria-pressed','false');};
  const paint=()=>{const step=v.steps[current];for(const node of canvas.querySelectorAll('[data-node]'))node.setAttribute('data-focused',String((step.focus||[]).includes(node.getAttribute('data-node'))));status.replaceChildren(make('strong',{lang:'en',dir:'ltr'},step.title),make('p',{},step.detail));counter.textContent=`خطوة ${current+1} من ${v.steps.length} · التمييز في الرسم بيوضح الخطوة الحالية بس.`;previous.disabled=current===0;next.disabled=current===v.steps.length-1;figure.dataset.step=String(current);};
  previous.addEventListener('click',()=>{stop();if(current>0)current--;paint();});next.addEventListener('click',()=>{stop();if(current<v.steps.length-1)current++;paint();});
  const motion=matchMedia('(prefers-reduced-motion: reduce)');play.disabled=motion.matches;motion.addEventListener('change',()=>{stop();play.disabled=motion.matches;});
  play.addEventListener('click',()=>{if(timer!==null){stop();return;}if(current===v.steps.length-1)current=0;paint();play.textContent='وقّف الخطوات';play.setAttribute('aria-pressed','true');timer=setInterval(()=>{current++;paint();if(current>=v.steps.length-1)stop();},2200);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);
  controls.append(previous,next,play);figure.append(controls,counter,status);
  const all=make('details',{class:'visual-static'});all.append(make('summary',{},'كل خطوات الرسم من غير حركة'));const list=make('ol');for(const step of v.steps){const li=make('li');li.append(make('strong',{lang:'en',dir:'ltr'},step.title),make('p',{},step.detail));list.append(li);}all.append(list);figure.append(all);paint();return figure;
 }};
})();
