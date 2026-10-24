(function(){
  'use strict';
  const data=window.OSPilotLesson;
  const unit=window.OSSelectedUnit||{id:'os-01',chapter:1,pages:[4,5,6,7,8],sourceDirectory:'sources'};
  const answers=new Map();
  function updateScore(){
    const right=[...answers.values()].filter(Boolean).length;
    document.getElementById('session-score').textContent=`جاوبت ${right} صح من ${answers.size} سؤال راجعتهم. الدرس فيه ${data.questions.length} أسئلة.`;
  }
  const el=(tag,attrs={},text)=>{const e=document.createElement(tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;return e;};
  const paragraph=(text,className)=>{
    const p=el('p',className?{class:className}:{});
    if(className==='fingerprint'){p.setAttribute('lang','en');p.textContent=text;return p;}
    // Isolate English terms without interpreting author text as HTML.
    const runs=String(text).split(/([A-Za-z][A-Za-z0-9]*(?:[ /.-][A-Za-z0-9]+)*)/g);
    for(const run of runs)p.append(/^[A-Za-z]/.test(run)?el('bdi',{lang:'en',dir:'ltr'},run):document.createTextNode(run));
    return p;
  };
  const rich=text=>{const p=el('p');p.innerHTML=text;return p;}; // Only versioned, local author text.
  function anchors(refs){
    const row=el('div',{class:'source-anchors'});row.append(el('span',{},'من المصدر:'));
    for(const ref of refs){
      if(/^current-ch[1-3]$/.test(ref.sourceId)&&Array.isArray(ref.slides)) for(const n of ref.slides)row.append(el('a',{href:`#source-${n}`},`سلايد ${n}`));
      else row.append(el('a',{href:data.sources.find(s=>s.id===ref.sourceId).url,target:'_blank',rel:'noopener'},`الورقة الأصلية · سؤال ${ref.item}`));
    }return row;
  }
  function definitionGrid(terms){
    const dl=el('dl',{class:'term-grid'});
    for(const t of terms){const d=el('div');const dt=el('dt');dt.append(el('bdi',{lang:'en'},t.term));d.append(dt,el('dd',{},t.text));dl.append(d);}return dl;
  }
  function diagram(){
    const d=data.diagram;const fig=el('figure',{class:'role-figure',id:d.id});
    fig.append(el('figcaption',{},'مين بيعمل إيه؟'),paragraph('اضغط على أي دور لو عايز توضيح أكتر.','figure-note'));
    const stack=el('div',{class:'role-stack'}),detail=paragraph(d.actors[0].detail,'role-detail');detail.id='role-detail';detail.setAttribute('role','status');
    d.actors.forEach((a,i)=>{
      const node=el('div',{class:'role-node'});const button=el('button',{type:'button',lang:'en',dir:'ltr','aria-pressed':String(i===0),'aria-controls':'role-detail'},a.label);
      button.addEventListener('click',()=>{for(const b of stack.querySelectorAll('button'))b.setAttribute('aria-pressed','false');button.setAttribute('aria-pressed','true');detail.textContent=a.detail;});
      node.append(button,el('span',{class:'role-number','aria-hidden':'true'},String(i+1)),paragraph(a.example));stack.append(node);
      if(i<d.actors.length-1)stack.append(el('div',{class:'role-arrow','aria-hidden':'true'},'↓'));
    });
    fig.append(stack,detail,paragraph(d.arrowMeaning,'figure-note'),paragraph(d.boundary,'figure-note'));return fig;
  }
  function story(){
    const s=data.scenario,box=el('div',{class:'story'});box.append(el('h3',{},s.title));const ol=el('ol');
    for(const step of s.steps){const li=el('li');li.append(el('h4',{lang:'en',dir:'ltr'},step.title),paragraph(step.text));ol.append(li);}
    box.append(ol,paragraph(s.limit,'figure-note'));return box;
  }
  function originalBlock(item){
    const box=el('div',{class:'original-reference'});box.append(el('p',{lang:'en',dir:'ltr'},item.originalPrompt));
    for(const option of item.originalOptions||[])box.append(el('p',{lang:'en',dir:'ltr'},option));
    box.append(paragraph(item.note,'small'));return box;
  }
  function optionText(option,type){
    const text=el('span',{lang:'en',dir:'ltr'});
    if(type==='true-false'){
      const [english,arabic]=option.text.split(' · ');
      text.append(el('bdi',{lang:'en'},english),document.createTextNode(' · '),el('bdi',{lang:'ar'},arabic));
    }else text.textContent=option.text;
    return text;
  }
  function question(q){
    const box=el('div',{class:'question','data-question':q.id});
    const meta=el('div',{class:'question-meta'});meta.append(el('span',{},q.type==='mcq'?'اختيار من متعدد':'صح أو غلط'));
    const label=q.provenance.kind==='original'?'من الورقة القديمة · نص أصلي':q.provenance.kind==='adapted'?'مقتبس من سؤال قديم':'سؤال تدريبي جديد';
    meta.append(el('span',{class:'provenance-label'},label));box.append(meta);
    const form=el('form'),fieldset=el('fieldset');fieldset.append(el('legend',{lang:'en',dir:'ltr'},q.prompt));
    for(const option of q.options){const label=el('label');label.append(el('input',{type:'radio',name:q.id,value:option.id,id:`${q.id}-${option.id}`}),optionText(option,q.type));fieldset.append(label);}
    const submit=el('button',{type:'submit'},'راجع الإجابة');
    const validation=paragraph('اختار إجابة الأول، وبعدها راجع السبب.','validation-message');validation.hidden=true;validation.setAttribute('role','alert');
    form.append(fieldset,submit,validation);box.append(form);
    const feedback=el('div',{class:'feedback',role:'status','aria-live':'polite',hidden:''});box.append(feedback);
    box.append(anchors(q.sourceRefs));
    if(q.provenance.kind!=='new'){
      const details=el('details');details.append(el('summary',{},'أصل السؤال ونوع الإجابة'),originalBlock(data.historicalItems.find(x=>x.id===q.provenance.originalId)));
      if(q.provenance.changes)details.append(paragraph(q.provenance.changes));box.append(details);
    }
    form.addEventListener('submit',e=>{
      e.preventDefault();if(answers.has(q.id))return;
      const selected=form.querySelector('input:checked');
      if(!selected){validation.hidden=false;return;}
      validation.hidden=true;
      const correct=selected.value===q.correctOptionId;answers.set(q.id,correct);
      feedback.classList.toggle('correct',correct);feedback.replaceChildren(el('strong',{},correct?'إجابة صحيحة':'إجابة محتاجة تصحيح'),paragraph(q.feedback[selected.value]));
      if(!correct){const p=paragraph('الإجابة الصحيحة: ');p.append(optionText(q.options.find(o=>o.id===q.correctOptionId),q.type));feedback.append(p,paragraph(q.feedback[q.correctOptionId]));}
      feedback.hidden=false;fieldset.disabled=true;submit.disabled=true;updateScore();
    });
    return box;
  }
  const content=document.getElementById('lesson-content');
  const heading=document.querySelector('.intro h1');heading.textContent=data.title;heading.setAttribute('lang',/[\u0600-\u06ff]/.test(data.title)?'ar':'en');heading.setAttribute('dir',/[\u0600-\u06ff]/.test(data.title)?'rtl':'ltr');
  document.querySelector('.intro .lead').replaceWith(paragraph(data.subtitle,'lead'));
  document.querySelector('.lesson-label bdi').textContent=unit.id.toUpperCase();
  document.querySelector('.intro .primary').href='#'+data.concepts[0].id;
  document.getElementById('review-status').textContent=unit.reviewed?'راجعه وكيل ذكاء اصطناعي مستقل مع الرجوع للمصادر؛ دي مش مراجعة مُحاضر':'نسخة شغل لسه قيد المراجعة؛ متتعاملش معاها كمحتوى معتمد.';
  const chapterLabel=document.querySelector('.lesson-label span');chapterLabel.textContent=`Chapter ${unit.chapter}`;chapterLabel.setAttribute('lang','en');chapterLabel.setAttribute('dir','ltr');
  document.querySelector('.scope').textContent=`Chapter ${unit.chapter} · Slides ${unit.pages[0]}–${unit.pages.at(-1)} · ${unit.id==='os-01'?'ابدأ هنا حتى لو لسه ما حضرتش المحاضرة.':'راجع الدرس اللي قبله لو المصطلحات لسه جديدة عليك.'}`;
  document.title=`${unit.id.toUpperCase()} · ${data.title} | Study Hub`;
  const lessonNav=document.querySelector('.lesson-index nav');lessonNav.replaceChildren();
  for(const c of data.concepts)lessonNav.append(el('a',{href:`#${c.id}`,lang:'en'},c.title));
  if(data.questions.some(q=>q.placement==='mixed'))lessonNav.append(el('a',{href:'#mixed'},'جرّب بنفسك'));else document.getElementById('mixed').hidden=true;
  lessonNav.append(el('a',{href:'#sources'},'السلايدات والمصادر'),el('a',{href:'#glossary'},'كل المصطلحات'));
  const unitList=window.OSCourseCatalog?.units||[],position=unitList.findIndex(u=>u.id===unit.id),pagination=document.getElementById('unit-pagination');
  for(const [offset,label]of [[-1,'الدرس اللي فات'],[1,'الدرس اللي بعده']]){const target=unitList[position+offset];if(target?.reviewed)pagination.append(el('a',{href:`?unit=${target.id}`},`${label} · ${target.id.toUpperCase()}`));}
  for(const c of data.concepts){
    const section=el('section',{id:c.id,class:'lesson-section','aria-labelledby':`${c.id}-title`});
    section.append(paragraph(c.eyebrow,'eyebrow'),el('h2',{id:`${c.id}-title`,lang:'en',dir:'ltr'},c.title));
    if(c.summary)section.append(el('p',{class:'concept-summary',lang:'en',dir:'ltr'},c.summary));
    for(const p of c.paragraphs)section.append(rich(p));
    if(c.terms)section.append(definitionGrid(c.terms));
    if(c.roles){const row=el('div',{class:'role-purposes'});for(const role of c.roles){const item=el('div',{class:'role-purpose'}),h=el('h3');h.append(el('bdi',{lang:'en'},role.term),document.createTextNode(role.title));item.append(h,paragraph(role.text));row.append(item);}section.append(row);}
    if(c.comparison)section.append(paragraph(c.comparison,'notice'));
    if(c.clarification)section.append(paragraph(c.clarification,'notice'));
    if(c.clarificationSource)section.append(el('a',{class:'text-link small',href:c.clarificationSource.url,target:'_blank',rel:'noopener'},c.clarificationSource.title));
    section.append(anchors(c.sourceRefs));
    if(c.id==='roles'&&data.diagram&&data.scenario)section.append(diagram(),story());
    for(const visual of (data.visualizations||[]).filter(v=>v.conceptId===c.id))section.append(window.OSVisuals.render(visual),anchors(visual.sourceRefs));
    for(const q of data.questions.filter(q=>q.placement===c.id))section.append(question(q));content.append(section);
  }
  for(const q of data.questions.filter(q=>q.placement==='mixed'))document.getElementById('mixed-questions').append(question(q));
  if(!data.essayReferences?.length)document.getElementById('essay').hidden=true;
  for(const reference of data.essayReferences||[]){
    const item=(data.historicalItems||[]).find(i=>i.id===reference.originalId),box=item?originalBlock(item):el('div',{class:'original-reference'});
    if(!item)box.append(el('p',{lang:'en',dir:'ltr'},reference.prompt));
    box.append(paragraph('إجابة للمذاكرة · حل مستقل','small'),el('p',{class:'answer',lang:'en',dir:'ltr'},reference.answer));
    if(reference.explanation)box.append(paragraph(reference.explanation,'answer-explanation'));
    box.append(anchors(reference.sourceRefs));document.getElementById('essay-content').append(box);
  }
  const slideNames={4:'Four components of a computer system',5:'Computer system structure',6:'What is an operating system?',7:'What operating systems do',8:'Operating system definition'};
  document.getElementById('original-source-link').href=data.sources[0].url;
  for(const n of unit.pages){
    const details=el('details',{class:'source-slide',id:`source-${n}`});
    const slideTitle=unit.id==='os-01'?slideNames[n]:`Chapter ${unit.chapter}`;
    const summary=el('summary');summary.append(document.createTextNode(`سلايد ${n} · `),el('bdi',{lang:'en',dir:'ltr'},slideTitle));details.append(summary);
    const file=`${unit.sourceDirectory}/slide-${String(n).padStart(2,'0')}.png`;
    details.append(el('img',{src:file,width:'1600',height:'1200',loading:'lazy',alt:`سلايد ${n} من المحاضرة الأصلية: ${slideTitle}. شرح الفكرة موجود فوق.`}));
    const cap=el('div',{class:'caption'});cap.append(el('a',{href:file,target:'_blank',rel:'noopener'},`افتح صورة سلايد ${n} بالحجم الكامل`));details.append(cap);document.getElementById('source-slides').append(details);
  }
  const provenance=el('div',{class:'provenance'});provenance.append(paragraph(data.sources[0].credit||`Original course source · Chapter ${unit.chapter}`));
  provenance.append(paragraph('صور السلايدات من نسخة محوّلة لملف المحاضرة. تقدر تفتح الأصل وتقارنه بالشرح.'));
  for(const source of data.sources.slice(1))provenance.append(el('a',{href:source.url,target:'_blank',rel:'noopener'},source.title),paragraph(source.note||'مصدر إضافي مرتبط بالدرس.'));
  const fingerprint=el('details');fingerprint.append(el('summary',{},'هوية المصادر ونسخة الدرس'));
  for(const s of data.sources)fingerprint.append(paragraph(s.title),paragraph(`SHA-256: ${s.sha256}`,'fingerprint'));
  fingerprint.append(paragraph(`نسخة الدرس ${data.version} · دليل التأليف ${data.guideVersion}`));provenance.append(fingerprint);document.getElementById('provenance').append(provenance);
  for(const term of data.glossary){
    const card=el('article',{class:'glossary-entry','aria-labelledby':`term-${term.id}`});
    const translation=paragraph(term.translation,'term-translation'),explanation=paragraph(term.explanation,'term-explanation');translation.setAttribute('lang','ar');explanation.setAttribute('lang','ar');
    card.append(el('h3',{id:`term-${term.id}`,lang:'en',dir:'ltr'},term.term),translation,el('p',{class:'term-definition',lang:'en',dir:'ltr'},term.definition),explanation);
    document.getElementById('glossary-content').append(card);
  }
  function openSourceAnchor(hash=window.location.hash){const details=document.getElementById(hash.slice(1));if(/^#source-\d+$/.test(hash)&&details?.tagName==='DETAILS')details.open=true;}
  window.addEventListener('hashchange',()=>openSourceAnchor());
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#source-"]');
    if(link)openSourceAnchor(link.getAttribute('href'));
  });
  openSourceAnchor();
  document.getElementById('reset').addEventListener('click',()=>{
    answers.clear();
    for(const box of document.querySelectorAll('.question')){
      box.querySelector('form').reset();box.querySelector('fieldset').disabled=false;box.querySelector('button').disabled=false;
      const feedback=box.querySelector('.feedback');feedback.hidden=true;feedback.replaceChildren();box.querySelector('.validation-message').hidden=true;
    }updateScore();
  });
  updateScore();
})();
