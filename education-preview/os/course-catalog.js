(function(root){
 'use strict';
 const definitions=[
  [1,1,4,8,'Computer-system roles'],[2,1,9,9,'Computer startup'],[3,1,10,12,'I/O and interrupts'],[4,1,13,16,'Memory, storage and caching'],[5,1,17,21,'Processors, cores and clusters'],[6,1,22,23,'Multiprogramming and time sharing'],[7,1,24,25,'Modes, protection and timers'],[8,1,26,30,'Resource management overview'],
  [9,2,4,5,'Operating-system services'],[10,2,6,12,'APIs, system calls and parameters'],[11,2,13,13,'Historical execution models'],[12,2,14,23,'Operating-system organizations'],
  [13,3,4,6,'Programs, processes and memory'],[14,3,7,10,'Process states and context switching'],[15,3,11,12,'Threads and Linux representation'],[16,3,13,16,'Scheduling queues and schedulers'],[17,3,17,17,'Historical mobile multitasking'],[18,3,18,24,'Process creation and termination'],[19,3,25,30,'Cooperation and IPC']
 ];
 const catalog={version:'2.0.0',courseId:'operating-system',units:definitions.map(([n,chapter,first,last,title])=>({id:`os-${String(n).padStart(2,'0')}`,chapter,title,pages:Array.from({length:last-first+1},(_,i)=>first+i),file:n===1?'lesson-data.js':`units/os-${String(n).padStart(2,'0')}.js`,sourceDirectory:n===1?'sources':`sources/ch${chapter}`,reviewed:true}))};
 if(typeof module==='object'&&module.exports)module.exports=catalog;else root.OSCourseCatalog=catalog;
})(typeof window!=='undefined'?window:globalThis);
