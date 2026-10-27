const browserNames=['window','document','navigator','localStorage','URL','CustomEvent','console','alert','prompt','confirm','setTimeout','clearTimeout','requestAnimationFrame','cancelAnimationFrame','MutationObserver','performance','fetch','AbortController','location','history','getComputedStyle','globalThis','COURSES_DATA','SCHEDULE_CONFIG','StudentProfile','LECTURE_EXPLANATIONS'];
browserNames.push('URLSearchParams','PortalTheme','Storage','sessionStorage');
const nodeNames=['require','module','exports','process','__dirname','Buffer','global','Infinity'];
module.exports=[
  {ignores:['node_modules/**','js/vendor/**','automation/**','tools/*.js','materials/**']},
  {files:['**/*.js','**/*.cjs'],languageOptions:{ecmaVersion:2022,sourceType:'script',globals:Object.fromEntries([...browserNames,...nodeNames].map(name=>[name,'readonly']))},rules:{'no-undef':'error','no-unreachable':'error','no-dupe-keys':'error','no-dupe-args':'error','valid-typeof':'error','no-unused-vars':['error',{args:'none',caughtErrors:'none',varsIgnorePattern:'^_'}]}}
];
