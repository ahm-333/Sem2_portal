(function(){
 'use strict';
 const catalog=window.OSCourseCatalog;
 const requested=new URLSearchParams(location.search).get('unit')||'os-01';
 const selected=catalog.units.find(u=>u.id===requested);
 const failure=()=>{const box=document.createElement('p');box.id='lesson-load-error';box.className='notice';box.setAttribute('role','alert');box.textContent='الدرس ده مش متاح دلوقتي. ';const a=document.createElement('a');a.href='?unit=os-01';a.textContent='ارجع للدرس الأول';box.append(a);document.getElementById('lesson-content').replaceChildren(box);};
 const index=document.getElementById('course-index');
 for(const chapter of [1,2,3]){const section=document.createElement('section');const h=document.createElement('h3');h.textContent=`Chapter ${chapter}`;h.lang='en';section.append(h);const list=document.createElement('ol');for(const unit of catalog.units.filter(u=>u.chapter===chapter)){const li=document.createElement('li');const a=document.createElement(unit.reviewed?'a':'span');if(unit.reviewed)a.href=`?unit=${unit.id}`;else a.setAttribute('aria-disabled','true');a.textContent=`${unit.id.toUpperCase()} · ${unit.title}${unit.reviewed?'':' · قيد المراجعة'}`;a.lang='en';if(unit.id===requested)a.setAttribute('aria-current','page');li.append(a);list.append(li);}section.append(list);index.append(section);}
 if(!selected){failure();return;}
 window.OSSelectedUnit=selected;
 const script=document.createElement('script');script.src=selected.file;script.onerror=failure;script.onload=()=>{
  if(window.OSPilotLesson?.id!==selected.id){failure();return;}
  const runtime=document.createElement('script');runtime.src='lesson.js';runtime.onerror=failure;document.head.append(runtime);
 };
 document.head.append(script);
})();
