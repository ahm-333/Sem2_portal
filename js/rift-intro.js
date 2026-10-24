/* Study Rift: original scroll-directed 3D sculpture, tunnel flight and aperture.
 * Three.js r186 is vendored locally. Native scroll owns progress; nothing captures wheel input.
 */
(function () {
  'use strict';
  let current = null;
  const clamp = value => Math.max(0,Math.min(1,value));
  const smooth = (a,b,value) => {const x=clamp((value-a)/(b-a));return x*x*(3-2*x);};
  const stages = [
    ['كل فكرة، عالم تاني.','اسكرول… وسيب الفضول ياخدك أبعد.'],
    ['غيّر زاوية تفكيرك.','الطريق مش لازم يكون خط مستقيم.'],
    ['ادخل جوّه الفكرة.','كمّل… الصورة لسه بتتكوّن.'],
    ['وصلت. نبدأ؟','موادك ومصادرك في انتظارك.']
  ];
  function createFallback() {
    const canvas=document.createElement('canvas'),context=canvas.getContext('2d');
    if(!context)throw new Error('Canvas rendering is unavailable');
    let width=1,height=1;
    return {canvas,mode:'canvas',resize(w,h){width=w;height=h;canvas.width=w;canvas.height=h;},draw(time,p,pointer,impulse){
      const ctx=context,cx=width*.5+pointer.x*25,cy=height*.49+pointer.y*25;
      ctx.fillStyle='#080b22';ctx.fillRect(0,0,width,height);
      const glow=ctx.createRadialGradient(cx,cy,10,cx,cy,Math.max(width,height)*.65);
      glow.addColorStop(0,'#18204e');glow.addColorStop(.5,'#111538');glow.addColorStop(1,'#080b22');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
      for(let i=39;i>=0;i--){const depth=((i/40+p*1.8)%1);const radius=22+Math.pow(depth,2)*Math.min(width,height)*.77;const twist=time*.13+i*.13+p*2.4;
        ctx.save();ctx.translate(cx,cy);ctx.rotate(twist);ctx.strokeStyle=['#a6b6ff','#68d3c8','#f2a18d','#a496f2'][i%4];ctx.globalAlpha=.15+depth*.65;ctx.lineWidth=1+depth*6;ctx.beginPath();
        for(let k=0;k<=100;k++){const a=k/100*Math.PI*2;const r=radius*(1+.12*Math.cos(a*3+twist));const x=Math.cos(a)*r,y=Math.sin(a)*r*.72;k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.stroke();ctx.restore();
      }
      if(impulse>0){ctx.strokeStyle=`rgba(225,234,255,${impulse*.6})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,(1-impulse)*Math.max(width,height),0,Math.PI*2);ctx.stroke();}
    },dispose(){canvas.width=1;canvas.height=1;}};
  }
  function createWebGL(THREE) {
    const renderer=new THREE.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance'});
    renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;
    const scene=new THREE.Scene();scene.background=new THREE.Color('#080b22');
    const camera=new THREE.PerspectiveCamera(50,1,.1,190);
    const uniforms={uTime:{value:0},uProgress:{value:0},uImpulse:{value:0},uPointer:{value:new THREE.Vector2()}};
    const surface=new THREE.ShaderMaterial({uniforms,side:THREE.DoubleSide,
      vertexShader:`uniform float uTime;uniform float uProgress;varying vec3 vNormal;varying vec3 vView;varying vec2 vUv;varying float vDepth;
      void main(){vec4 local=vec4(position,1.0);vec3 n=normal;
      #ifdef USE_INSTANCING
        local=instanceMatrix*local;n=mat3(instanceMatrix)*n;
      #else
        local.xyz+=normal*smoothstep(.12,.33,uProgress)*(.35+.2*sin(position.x*3.0+uTime));
      #endif
        vec4 mv=modelViewMatrix*local;vNormal=normalize(normalMatrix*n);vView=-mv.xyz;vUv=uv;vDepth=-mv.z;gl_Position=projectionMatrix*mv;}`,
      fragmentShader:`uniform float uTime;uniform float uProgress;uniform float uImpulse;varying vec3 vNormal;varying vec3 vView;varying vec2 vUv;varying float vDepth;
      void main(){vec3 n=normalize(vNormal);vec3 v=normalize(vView);float rim=pow(1.0-abs(dot(n,v)),2.1);
        float bands=.5+.5*sin(vUv.x*19.0+vUv.y*4.0+uTime*.6+uProgress*8.0);
        vec3 ink=mix(vec3(.12,.25,.66),vec3(.25,.83,.72),smoothstep(.1,.85,bands));
        ink=mix(ink,vec3(.95,.39,.28),pow(.5+.5*sin(vUv.x*7.0-uTime*.2),5.0)*.8);
        float diffuse=.35+.65*abs(dot(n,normalize(vec3(-.4,.8,1.0))));
        float spec=pow(max(dot(reflect(-normalize(vec3(.4,.6,1.0)),n),v),0.0),36.0);
        vec3 col=ink*diffuse+vec3(.72,.82,1.0)*rim*.9+vec3(1.0,.89,.78)*spec*1.6;
        col+=uImpulse*rim*.5;col*=exp(-max(0.0,vDepth-10.0)*.009);
        gl_FragColor=vec4(col,1.0);}`});
    const knotGeometry=new THREE.TorusKnotGeometry(2.35,.61,200,20,2,3);
    const knot=new THREE.Mesh(knotGeometry,surface);knot.position.set(-.4,.35,0);scene.add(knot);
    const orbitGeometry=new THREE.TorusGeometry(4.25,.028,5,144);
    const orbitMaterial=new THREE.MeshBasicMaterial({color:'#bac7ff',transparent:true,opacity:.35});
    const orbit=new THREE.Mesh(orbitGeometry,orbitMaterial);orbit.rotation.x=.65;scene.add(orbit);
    const ringGeometry=new THREE.TorusGeometry(4.5,.13,6,112);
    const rings=new THREE.InstancedMesh(ringGeometry,surface,48);rings.instanceMatrix.setUsage(THREE.DynamicDrawUsage);rings.frustumCulled=false;scene.add(rings);
    const dummy=new THREE.Object3D();
    const starsGeometry=new THREE.OctahedronGeometry(.045,0),starsMaterial=new THREE.MeshBasicMaterial({color:'#ced6ff'});
    const stars=new THREE.InstancedMesh(starsGeometry,starsMaterial,150);
    for(let i=0;i<150;i++){const a=i*2.399963;const radius=6+(i%13)*.6;dummy.position.set(Math.cos(a)*radius,Math.sin(a)*radius,-i*.8);dummy.rotation.set(a,a*.7,0);dummy.scale.setScalar(.5+(i%5)*.3);dummy.updateMatrix();stars.setMatrixAt(i,dummy.matrix);}
    scene.add(stars);
    const backgroundMaterial=new THREE.ShaderMaterial({uniforms,depthWrite:false,depthTest:false,
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,.9999,1.0);}',
      fragmentShader:`varying vec2 vUv;uniform float uTime;uniform float uProgress;uniform vec2 uPointer;
      void main(){vec2 p=vUv-.5-uPointer*.015;float r=length(p);float a=atan(p.y,p.x);
        float rays=pow(.5+.5*cos(a*11.0+uTime*.13+uProgress*6.0),18.0);
        float wave=pow(.5+.5*cos(r*42.0-uProgress*25.0+uTime*.2),12.0);
        vec3 col=vec3(.008,.012,.035)+vec3(.045,.055,.14)*exp(-r*2.5);
        col+=vec3(.04,.09,.15)*rays*exp(-r*3.0)*(.15+uProgress*.6);
        col+=vec3(.015,.025,.05)*wave*exp(-r*4.0);gl_FragColor=vec4(col,1.0);}`});
    const quadGeometry=new THREE.PlaneGeometry(2,2);const background=new THREE.Mesh(quadGeometry,backgroundMaterial);background.frustumCulled=false;background.renderOrder=-100;scene.add(background);
    const target=new THREE.WebGLRenderTarget(1,1,{depthBuffer:true});
    const postScene=new THREE.Scene(),postCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
    const postUniforms={image:{value:target.texture},resolution:{value:new THREE.Vector2(1,1)},...uniforms};
    const postMaterial=new THREE.ShaderMaterial({uniforms:postUniforms,depthTest:false,depthWrite:false,
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',
      fragmentShader:`uniform sampler2D image;uniform vec2 resolution;uniform float uProgress;uniform float uImpulse;varying vec2 vUv;
      void main(){vec2 dir=vUv-.5;vec2 offset=dir*(.0006+uProgress*.0016+uImpulse*.003);
        vec3 col=vec3(texture2D(image,vUv+offset).r,texture2D(image,vUv).g,texture2D(image,vUv-offset).b);
        vec3 bloom=vec3(0.0);for(int i=0;i<8;i++){float angle=float(i)*.785398;vec2 d=vec2(cos(angle),sin(angle))*3.0/resolution;
          bloom+=max(texture2D(image,vUv+d).rgb-.55,vec3(0.0));}
        col+=bloom*.11;col=vec3(1.0)-exp(-col*1.45);col*=1.0-.24*pow(length(dir)*1.25,2.0);
        gl_FragColor=vec4(col,1.0);
        #include <colorspace_fragment>
      }`});
    postScene.add(new THREE.Mesh(quadGeometry,postMaterial));
    return {canvas:renderer.domElement,mode:'webgl',resize(width,height){
      const scale=Math.min(1.25,window.devicePixelRatio || 1,1600/width);
      renderer.setSize(width,height,false);target.setSize(Math.round(width*scale),Math.round(height*scale));postUniforms.resolution.value.set(target.width,target.height);camera.aspect=width/height;camera.updateProjectionMatrix();
    },draw(time,p,pointer,impulse){
      uniforms.uTime.value=time;uniforms.uProgress.value=p;uniforms.uImpulse.value=impulse;uniforms.uPointer.value.set(pointer.x,pointer.y);
      const travel=smooth(.14,.84,p),closing=smooth(.85,1,p);
      camera.position.set(pointer.x*.6,pointer.y*.4,12-travel*75);camera.lookAt(pointer.x*.2,pointer.y*.1,camera.position.z-20);camera.rotation.z=travel*.27*Math.sin(p*Math.PI*2);
      const scale=Math.max(.001,1-smooth(.15,.36,p));knot.scale.setScalar(scale*(1+impulse*.12));knot.visible=p<.37;
      knot.rotation.set(time*.13+p*1.5,time*.19+p*2.0,-.35+p*2.4);
      orbit.rotation.z=time*.1;orbit.scale.setScalar(1+p*.4);orbit.visible=p<.3;
      for(let i=0;i<48;i++){const a=i*.21+time*.055+p*1.2;const r=1+.12*Math.sin(i*.55+time*.18);
        dummy.position.set(Math.sin(i*.22)*.45,Math.cos(i*.25)*.35,-i*2.2-5);dummy.rotation.set(Math.sin(a)*.2,Math.cos(a)*.18,a);dummy.scale.set(r,r,1);dummy.updateMatrix();rings.setMatrixAt(i,dummy.matrix);}
      rings.instanceMatrix.needsUpdate=true;rings.rotation.z=p*.45+pointer.x*.04;stars.rotation.z=time*.025;
      if(closing>0)camera.fov=50+closing*20;else camera.fov=50;camera.updateProjectionMatrix();
      renderer.setRenderTarget(target);renderer.render(scene,camera);renderer.setRenderTarget(null);renderer.render(postScene,postCamera);
    },dispose(){
      for(const geometry of [knotGeometry,orbitGeometry,ringGeometry,starsGeometry,quadGeometry])geometry.dispose();
      for(const material of [surface,orbitMaterial,starsMaterial,backgroundMaterial,postMaterial])material.dispose();
      rings.dispose();stars.dispose();target.dispose();renderer.dispose();renderer.forceContextLoss();
    }};
  }
  window.mountRiftIntro=async({host,onSeen,onSkip,cancelled=()=>false}) => {
    const gsap=window.gsap,ScrollTrigger=window.ScrollTrigger;
    if(!gsap || !ScrollTrigger)return null;
    const element=document.createElement('section');element.className='rift-intro';element.setAttribute('aria-label','رحلة Study Rift التفاعلية');
    element.innerHTML='<div class="rift-scene"><div class="rift-stage" aria-hidden="true"></div><header class="rift-header"><a href="index.html" class="rift-wordmark" lang="en">Study Hub<span aria-hidden="true"> / </span><span>Rift</span></a><button type="button" class="rift-skip" data-intro-skip>تخطّي المقدمة <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 7v11h11"/></svg></button></header><div class="rift-copy"><h1></h1><p></p></div><div class="rift-final" aria-hidden="true"><strong lang="en">Study Hub</strong><span>الفضول يبدأ من هنا.</span></div><footer class="rift-footer"><div class="rift-scroll-cue"><span class="rift-mouse" aria-hidden="true"></span><span>اسكرول عشان تغيّر المشهد</span></div><span class="rift-caption">حرّك الماوس. غيّر المنظور.</span><span class="rift-percent" aria-hidden="true">0%</span></footer><div class="rift-progress" aria-hidden="true"><span></span></div><p class="sr-only" role="status" aria-live="polite" data-rift-status></p></div>';
    host.before(element);
    let graphics;
    try {
      const THREE=await import(new URL('js/vendor/three/three.module.js',document.baseURI).href);
      if(cancelled() || !element.isConnected)return null;
      graphics=createWebGL(THREE);
    } catch {if(cancelled() || !element.isConnected)return null;graphics=createFallback();}
    const stage=element.querySelector('.rift-stage');stage.append(graphics.canvas);element.dataset.renderMode=graphics.mode;
    let destroyed=false,frame=0,last=0,time=0,progress=0,phase=-1,frames=0,renderMs=0,notified=false,impulse=0;
    graphics.canvas.addEventListener('webglcontextlost',event=>{
      if(destroyed)return;event.preventDefault();graphics.dispose();graphics=createFallback();stage.replaceChildren(graphics.canvas);element.dataset.renderMode=graphics.mode;resize();
    },{once:true});
    const pointer={x:0,y:0},target={x:0,y:0};
    const scene=element.querySelector('.rift-scene'),copy=element.querySelector('.rift-copy'),title=copy.querySelector('h1'),description=copy.querySelector('p');
    function resize(){if(destroyed)return;const rect=scene.getBoundingClientRect();graphics.resize(Math.max(1,rect.width),Math.max(1,rect.height));}
    function setProgress(p){
      progress=p;
      const next=p<.2?0:p<.49?1:p<.83?2:3;
      if(next!==phase){phase=next;title.textContent=stages[phase][0];description.textContent=stages[phase][1];element.querySelector('[data-rift-status]').textContent=stages[phase][0];element.dataset.phase=String(phase);}
      const final=smooth(.82,.98,p);
      copy.style.opacity=String(1-final);copy.style.transform=`translateY(${final*-35}px)`;
      copy.style.visibility=final>.9?'hidden':'visible';
      element.querySelector('.rift-final').style.opacity=String(final);element.querySelector('.rift-final').style.transform=`translateY(${(1-final)*40}px) scale(${.88+final*.12})`;
      element.querySelector('.rift-progress>span').style.transform=`scaleX(${p})`;
      element.querySelector('.rift-percent').textContent=Math.round(p*100)+'%';
      if(p>.99&&!notified){notified=true;onSeen();}
    }
    function tick(stamp){
      frame=0;if(destroyed || document.hidden)return;
      const delta=Math.min(50,stamp-last);last=stamp;time+=delta*.001;pointer.x+=(target.x-pointer.x)*.05;pointer.y+=(target.y-pointer.y)*.05;impulse*=.96;
      const start=window.performance.now();graphics.draw(time,progress,pointer,impulse);renderMs=window.performance.now()-start;frames++;
      frame=window.requestAnimationFrame(tick);
    }
    function visibility(){if(frame)window.cancelAnimationFrame(frame);frame=0;if(!document.hidden&&!destroyed){last=window.performance.now();frame=window.requestAnimationFrame(tick);}}
    element.addEventListener('pointermove',event=>{const box=scene.getBoundingClientRect();target.x=(event.clientX-box.left)/box.width-.5;target.y=-((event.clientY-box.top)/box.height-.5);});
    element.addEventListener('pointerleave',()=>{target.x=0;target.y=0;});
    element.addEventListener('pointerdown',event=>{if(!event.target.closest('button,a'))impulse=1;});
    element.querySelector('[data-intro-skip]').addEventListener('click',onSkip);
    element.querySelector('.rift-wordmark').addEventListener('click',event=>{event.preventDefault();onSkip();});
    const driver={p:0};const timeline=gsap.to(driver,{p:1,duration:1,paused:true,ease:'none',onUpdate:()=>setProgress(driver.p)});
    const distance=()=>Math.min(2600,Math.max(1800,window.innerHeight*2.4));
    element.style.height=(window.innerHeight+distance())+'px';
    const trigger=ScrollTrigger.create({id:'sem2-rift-intro',trigger:element,start:'top top',end:()=>'+='+distance(),pin:scene,pinSpacing:false,scrub:.55,animation:timeline,invalidateOnRefresh:true,onRefresh:()=>{element.style.height=(scene.getBoundingClientRect().height+distance())+'px';resize();}});
    const observer=new window.ResizeObserver(resize);observer.observe(scene);
    document.addEventListener('visibilitychange',visibility);resize();setProgress(0);visibility();
    const handle={element,trigger,timeline,destroy(){
      if(destroyed)return;destroyed=true;if(frame)window.cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',visibility);trigger.kill();timeline.kill();graphics.dispose();element.remove();if(current===handle)current=null;
    },diagnostics:()=>({progress,phase,mode:graphics.mode,frames,renderMs:Number(renderMs.toFixed(2)),impulse,pointer:{...pointer},destroyed})};
    current=handle;return handle;
  };
  window.riftDiagnostics=()=>current?.diagnostics() || null;
})();
