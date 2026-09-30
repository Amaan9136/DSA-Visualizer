/* ============================= SIDEBAR RENDER ============================= */
import { selectAlgo } from './algo_switch.js';
import { CATALOG, SIDEBAR_STRUCTURE } from './algorithm_catalog.js';
import { state } from './state.js';

function renderSidebar(filter=''){
  const el = document.getElementById('sidebar');
  el.innerHTML = '';
  SIDEBAR_STRUCTURE.forEach(group=>{
    const items = group.items.filter(key => !filter || CATALOG[key].name.toLowerCase().includes(filter.toLowerCase()));
    if(filter && items.length===0 && !group.cat.toLowerCase().includes(filter.toLowerCase())) return;

    const headWrap = document.createElement('div');
    headWrap.className = 'px-3 pt-3 pb-1 flex items-center justify-between cat-head text-[11px] uppercase tracking-wider font-semibold';
    headWrap.innerHTML = `<span>${group.cat}</span>` + (group.soon ? `<span class="badge">soon</span>` : `<span>${items.length}</span>`);
    el.appendChild(headWrap);

    if(group.soon){
      const s = document.createElement('div');
      s.className = 'soon px-3 pb-1 text-[12px]';
      s.style.color='var(--text-dim)';
      s.textContent = 'Coming in next milestone';
      el.appendChild(s);
      return;
    }

    items.forEach(key=>{
      const d = document.createElement('div');
      d.className = 'nav-item px-3 py-1.5 text-[13px]' + (key===state.currentAlgo?' active':'');
      d.textContent = CATALOG[key].name;
      d.onclick = ()=>{ selectAlgo(key); ['navDrawer','drawerBackdrop'].forEach(id=>document.getElementById(id).classList.remove('open')); };
      el.appendChild(d);
    });
  });
}
['searchInput','searchInputMobile'].forEach(id=>{ document.getElementById(id).oninput = (e)=>{ ['searchInput','searchInputMobile'].forEach(k=>document.getElementById(k).value = e.target.value); renderSidebar(e.target.value); }; });

export { renderSidebar };