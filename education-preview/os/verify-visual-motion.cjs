const {chromium}=require('playwright');const assert=require('node:assert/strict');
const base=process.env.OS_PREVIEW_URL||'http://127.0.0.1:8765/education-preview/os/';
(async()=>{const b=await chromium.launch(require('./browser-options.cjs'));try{
 const c=await b.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'}),p=await c.newPage();
 await p.goto(base+'?unit=os-02');await p.locator('.teaching-visual').first().waitFor();await p.clock.install();
 const v=p.locator('.teaching-visual').first(),play=v.getByRole('button',{name:'شغّل الخطوات',exact:true});assert.equal(await play.isEnabled(),true);await play.click();assert.equal(await v.locator('[aria-pressed=true]').count(),1);await p.clock.runFor(2250);assert.equal(await v.getAttribute('data-step'),'1');await v.getByRole('button',{name:'وقّف الخطوات',exact:true}).click();await p.clock.runFor(6000);assert.equal(await v.getAttribute('data-step'),'1','Paused animation must not advance');
 await v.getByRole('button',{name:'شغّل الخطوات',exact:true}).click();const total=await p.evaluate(()=>window.OSPilotLesson.visualizations[0].steps.length);for(let i=1;i<total;i++)await p.clock.runFor(2250);assert.equal(await v.getAttribute('data-step'),String(total-1));assert.equal(await v.locator('[aria-pressed=true]').count(),0,'Playback stops at the final step');
 await v.getByRole('button',{name:'شغّل الخطوات',exact:true}).click();assert.equal(await v.getAttribute('data-step'),'0','Replay restarts from first step');await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await v.getByRole('button',{name:'شغّل الخطوات',exact:true}).isDisabled(),true);await p.clock.runFor(5000);assert.equal(await v.getAttribute('data-step'),'0','Reduced-motion change stops active playback');
 await c.close();console.log('PASS visual motion: play, advance, pause, finite stop, replay and dynamic reduced-motion preference.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
