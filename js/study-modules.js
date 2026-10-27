/* Stable identities for the available, local study lessons. */
(function (root) {
  'use strict';
  const modules = [];
  function add(courseId, type, id, title, url) {
    modules.push({key: JSON.stringify([courseId, type, String(id)]), courseId, type, id, title, url});
  }
  add('data-structure', 'lecture', 1, 'Data Structures · Lecture 1', 'study/ds/lecture-1.html');
  add('data-structure', 'lecture', 2, 'Data Structures · Lecture 2', 'study/ds/lecture-2.html');
  add('data-structure', 'lecture', 3, 'Data Structures · Lecture 3', 'study/ds/lecture-3.html');
  add('database-systems', 'lecture', 2, 'Database · Chapter 1', 'study/db/chapter-1.html');
  add('database-systems', 'lecture', 3, 'Database · Chapter 2', 'study/db/chapter-2.html');
  add('computer-architecture', 'lecture', 5, 'Input / Output & DMA', 'study/arch/chapter-7.html');
  const units = ['Computer-system roles', 'Computer startup', 'I/O and interrupts', 'Memory, storage and caching', 'Processors, cores and clusters', 'Multiprogramming and time sharing', 'Modes, protection and timers', 'Resource management overview', 'Operating-system services', 'APIs, system calls and parameters', 'Historical execution models', 'Operating-system organizations', 'Programs, processes and memory', 'Process states and context switching', 'Threads and Linux representation', 'Scheduling queues and schedulers', 'Historical mobile multitasking', 'Process creation and termination', 'Cooperation and IPC'];
  units.forEach((title, index) => {
    const id = 'os-' + String(index + 1).padStart(2, '0');
    add('operating-system', 'theory-resource', id, id.toUpperCase() + ' · ' + title, 'education-preview/os/index.html?unit=' + id);
  });
  root.PortalStudyModules = modules;
  if (typeof module !== 'undefined' && module.exports) module.exports = modules;
})(typeof window !== 'undefined' ? window : globalThis);
