const wrap = document.getElementById('canvasWrap');
const tip = document.getElementById('tooltip');
let last = null;

function show(x,y){
  const el = document.elementFromPoint(x,y);
  const t = el && wrap.contains(el) ? el.closest('[data-tip]') : null;
  if(!t){ tip.style.display='none'; return; }
  const box = tip.parentElement.getBoundingClientRect();
  tip.textContent = t.getAttribute('data-tip');
  tip.style.display = 'block';
  tip.style.left = Math.max(4, Math.min(box.width-tip.offsetWidth-4, x-box.left-tip.offsetWidth/2)) + 'px';
  tip.style.top = Math.max(4, y-box.top-tip.offsetHeight-14) + 'px';
}
function refreshTip(){ if(last) show(last.x,last.y); }
['pointermove','pointerdown'].forEach(ev=>wrap.addEventListener(ev, (e)=>{ last={x:e.clientX,y:e.clientY}; show(e.clientX,e.clientY); }));
wrap.addEventListener('pointerleave', ()=>{ last=null; tip.style.display='none'; });

export { refreshTip };
