/* ============================= RENDER RIGHT PANEL CONTENT ============================= */
import { CATALOG } from './algorithm_catalog.js';
import { PY } from './python_sources.js';
import { state } from './state.js';

function renderPanelContent(){
  const algo = CATALOG[state.currentAlgo];
  document.getElementById('tab-explain').innerHTML = `<p>${algo.explain}</p>`;
  document.getElementById('tab-pseudo').textContent = algo.pseudo;
  const c = algo.complexity;
  document.getElementById('tab-complexity').innerHTML = `
    <div class="grid grid-cols-2 gap-3">
      ${[['Best',c.best],['Average',c.avg],['Worst',c.worst],['Space',c.space],['Stable',c.stable]].map(([k,v])=>`
        <div class="glass2 rounded-lg p-3">
          <div class="text-[11px] uppercase tracking-wide" style="color:var(--text-dim)">${k}</div>
          <div class="font-mono font-semibold mt-1">${v}</div>
        </div>`).join('')}
    </div>`;
  const pyCode = document.getElementById('pyCode');
  pyCode.textContent = PY[state.currentAlgo];
  wrapPythonLines();
  Prism.highlightElement(pyCode);
}

// Wrap each source line in a span so we can highlight the active one.
function wrapPythonLines(){
  const pyCode = document.getElementById('pyCode');
  const lines = PY[state.currentAlgo].split('\n');
  pyCode.innerHTML = lines.map((l,i)=>`<span class="pyline" data-line="${i+1}">${escapeHtml(l)||' '}</span>`).join('\n');
}
function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

document.getElementById('btnCopyPy').onclick = ()=>{
  navigator.clipboard.writeText(PY[state.currentAlgo]);
  const b=document.getElementById('btnCopyPy'); const t=b.textContent; b.textContent='Copied!'; setTimeout(()=>b.textContent=t,1000);
};
document.getElementById('btnDownloadPy').onclick = ()=>{
  const blob = new Blob([PY[state.currentAlgo]], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download = state.currentAlgo+'_sort.py'; a.click();
  URL.revokeObjectURL(url);
};
document.getElementById('pySearch').oninput = (e)=>{
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('#pyCode .pyline').forEach(span=>{
    span.style.background = (q && span.textContent.toLowerCase().includes(q)) ? 'rgba(242,201,76,.18)' : '';
  });
};

export { renderPanelContent, wrapPythonLines, escapeHtml };
