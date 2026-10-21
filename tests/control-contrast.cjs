/* Run in the page: audit real painted action labels/icons against their composited surface. */
function auditActionContrast(rootSelector = 'body') {
  const rgba = value => {
    const parts = value.match(/[\d.]+/g)?.map(Number);
    return parts?.length >= 3 ? [parts[0], parts[1], parts[2], parts[3] ?? 1] : null;
  };
  const over = (top, bottom) => {
    const alpha = top[3] + bottom[3] * (1 - top[3]);
    return [0, 1, 2].map(i => (top[i] * top[3] + bottom[i] * bottom[3] * (1 - top[3])) / (alpha || 1)).concat(alpha);
  };
  const background = element => {
    const layers = [];
    for (let node = element; node; node = node.parentElement) layers.push(rgba(getComputedStyle(node).backgroundColor));
    return layers.reverse().reduce((surface, layer) => layer ? over(layer, surface) : surface, [255, 255, 255, 1]);
  };
  const luminance = rgb => {
    const values = rgb.slice(0, 3).map(c => c / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
  };
  const ratio = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
  const issues = [];
  const root = document.querySelector(rootSelector);
  if (!root) return issues;
  const disclosed = element => {
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      if (parent.tagName === 'DETAILS' && !parent.open && !parent.querySelector(':scope > summary')?.contains(element)) return false;
    }
    return true;
  };
  const selector = 'button,a[href],summary,select,input,label:has(input)';
  const actions = [...root.querySelectorAll(selector)];
  if (root.matches(selector)) actions.unshift(root);
  for (const action of actions) {
    const style = getComputedStyle(action);
    if (!action.getClientRects().length || style.visibility !== 'visible' || !disclosed(action) || action.closest('[inert]') || action.disabled) continue;
    const name = action.getAttribute('aria-label') || action.getAttribute('title') || action.innerText?.trim().slice(0, 70) || action.id || action.tagName;
    const check = (element, color, kind, required) => {
      const fg = rgba(color); if (!fg) return;
      const bg = background(element);
      let opacity = 1;
      for (let node = element; node; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity);
      fg[3] *= opacity;
      const contrast = ratio(over(fg, bg), bg);
      if (contrast + .02 < required) issues.push({name, kind, contrast: Number(contrast.toFixed(2)), required, color, background: bg.slice(0, 3).map(Math.round), tag: action.tagName, classes: action.className});
    };
    const walker = document.createTreeWalker(action, window.NodeFilter.SHOW_TEXT);
    let text;
    while ((text = walker.nextNode())) {
      const element = text.parentElement;
      if (!text.textContent.trim() || element.closest('svg,[aria-hidden="true"]') || !element.getClientRects().length) continue;
      const s = getComputedStyle(element);
      if (s.visibility !== 'visible') continue;
      const size = Number.parseFloat(s.fontSize), weight = Number.parseFloat(s.fontWeight);
      check(element, s.webkitTextFillColor || s.color, 'text', size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5);
    }
    for (const icon of action.querySelectorAll('svg')) {
      if (!icon.getClientRects().length) continue;
      const painted = [...icon.querySelectorAll('path,line,rect,circle,polyline,polygon')].find(el => getComputedStyle(el).stroke !== 'none' || getComputedStyle(el).fill !== 'none');
      const s = getComputedStyle(painted || icon);
      check(painted || icon, s.stroke !== 'none' ? s.stroke : s.fill, 'icon', 3);
    }
  }
  return issues;
}
module.exports = {auditActionContrast};
