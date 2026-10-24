// Self-contained CI runner: owns its loopback server and always closes it.
const http=require('node:http'),path=require('node:path'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'../..');
(async()=>{
 const probe=http.createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r));
 const server=spawn(process.execPath,[path.join(root,'tools/serve.cjs')],{cwd:root,env:{...process.env,PORT:String(port)},windowsHide:true,stdio:['ignore','pipe','pipe']});
 try{
  await new Promise((resolve,reject)=>{server.stdout.on('data',d=>{if(String(d).includes('Portal:'))resolve();});server.once('error',reject);server.once('exit',code=>{if(code!==null)reject(Error(`OS test server exited ${code}`));});});
  const env={...process.env,OS_PREVIEW_URL:`http://127.0.0.1:${port}/education-preview/os/`,PORTAL_ORIGIN:`http://127.0.0.1:${port}/`};
  for(const script of ['education-preview/os/validate-course.cjs','education-preview/os/verify-course.cjs','education-preview/os/verify-visual-motion.cjs','tests/os-brand-browser.cjs','tests/os-entry-browser.cjs'])await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[path.join(root,script)],{cwd:root,env,windowsHide:true,stdio:'inherit'});child.once('error',reject);child.once('exit',code=>code===0?resolve():reject(Error(`${script} failed (${code})`)));});
 }finally{server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
