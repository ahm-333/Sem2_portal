// Controlled browser measurements; PORTAL_PROBE_URL can also target a deployed site.
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
async function main() {
  const browser = await chromium.launch({headless:true, channel:process.env.PORTAL_BROWSER_CHANNEL || 'chrome'});
  const base = process.env.PORTAL_PROBE_URL || 'http://127.0.0.1:8877/';
  const output = path.resolve('test-results/performance'); fs.mkdirSync(output,{recursive:true});
  const results = [];
  try {
    for (const route of ['index.html','subject.html?id=database-systems']) {
      const context = await browser.newContext({viewport:{width:1440,height:900}});
      await context.addInitScript(() => {
        localStorage.setItem('sem2_first_visit_configured','true');
        window.sessionStorage.setItem('sem2-studio-rift-intro-v3','seen');
        window.probe = {frames:[],tasks:[],shifts:[]};
        new window.PerformanceObserver(list => window.probe.tasks.push(...list.getEntries().map(e=>e.duration))).observe({type:'longtask',buffered:true});
        new window.PerformanceObserver(list => window.probe.shifts.push(...list.getEntries().filter(e=>!e.hadRecentInput).map(e=>e.value))).observe({type:'layout-shift',buffered:true});
        const started = performance.now();
        function sample() {
          const main=document.querySelector('main');
          if(main && main.getClientRects().length) {
            const style=getComputedStyle(main);
            if(style.visibility!=='hidden' && style.opacity!=='0') window.probe.frames.push({time:performance.now(),atlas:!!document.querySelector('.course-atlas'),legacy:!!document.querySelector('#subject-title-en')&&!document.querySelector('.course-atlas')});
          }
          if(performance.now()-started<2500)requestAnimationFrame(sample);
        }
        requestAnimationFrame(sample);
      });
      if(process.env.PORTAL_PROBE_DELAY!=='0') await context.route('**/js/studio-course.js',async r=>{await new Promise(resolve=>setTimeout(resolve,900));await r.continue();});
      const page = await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(new URL(route,base).href);
      await page.waitForTimeout(2600);
      await page.screenshot({path:path.join(output,route.startsWith('index')?'home.png':'subject.png'),fullPage:true});
      const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');
      const before=(await cdp.send('Performance.getMetrics')).metrics;
      await page.waitForTimeout(1500);
      const after=(await cdp.send('Performance.getMetrics')).metrics;
      const value=(items,name)=>items.find(x=>x.name===name)?.value || 0;
      const result=await page.evaluate(()=>({
        legacyFrames:window.probe.frames.filter(x=>x.legacy).length,
        firstVisible:window.probe.frames[0],
        longTasks:window.probe.tasks,
        cls:window.probe.shifts.reduce((a,b)=>a+b,0),
        navigation:performance.getEntriesByType('navigation').map(x=>({domReady:x.domContentLoadedEventEnd,load:x.loadEventEnd})),
        paints:performance.getEntriesByType('paint').map(x=>({name:x.name,time:x.startTime})),
        resources:performance.getEntriesByType('resource').map(x=>({url:new URL(x.name).pathname,size:x.decodedBodySize,duration:x.duration})),
        libraryRows:document.querySelectorAll('.studio-library-row').length
      }));
      result.route=route;result.errors=errors;result.idleTaskMs=(value(after,'TaskDuration')-value(before,'TaskDuration'))*1000;
      result.idleLayouts=value(after,'LayoutCount')-value(before,'LayoutCount');
      results.push(result);await context.close();
    }
    const file=path.join(output,(process.env.PORTAL_PROBE_LABEL || 'baseline')+'.json');fs.writeFileSync(file,JSON.stringify(results,null,2));
    console.log(JSON.stringify(results.map(({route,legacyFrames,firstVisible,cls,idleTaskMs,idleLayouts,libraryRows,errors,resources})=>({route,legacyFrames,firstVisible,cls,idleTaskMs,idleLayouts,libraryRows,errors,resourceCount:resources.length,resourceBytes:resources.reduce((n,x)=>n+x.size,0)})),null,2));
    console.log(file);
  } finally {await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
