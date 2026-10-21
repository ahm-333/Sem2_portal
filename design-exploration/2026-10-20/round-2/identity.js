/* Temporary original portal mark: a gateway and a shared central node. */
(() => {
 const inner='<g fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M11 6H7v20h4M21 6h4v20h-4M16 3v6m0 14v6M3 16h6m14 0h6"/><rect x="11" y="11" width="10" height="10" rx="2.5"/><path d="m14 16 2 2 3-4"/></g>';
 window.PORTAL_MARK_INNER=inner;
 window.PORTAL_MARK='<svg class="portal-mark-svg" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">'+inner+'</svg>';
 window.PORTAL_COURSE_ICONS=['cpu','shapes','database','network','panels-top-left','file-text'];
 window.applyPortalIdentity=()=>document.querySelectorAll('.brand-mark').forEach(el=>{el.innerHTML=window.PORTAL_MARK;el.classList.add('portal-mark');});
})();
