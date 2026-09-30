/* ============================= ITERATION TAB RENDER ============================= */
import { CATALOG } from './algorithm_catalog.js';
import { escapeHtml } from './panel_render.js';
import { goTo } from './playback_controls.js';
import { PY } from './python_sources.js';
import { state } from './state.js';

let renderedForFrames = null;
let renderedModalFor = null;

function rowHtml(frame,i){
  return `
    <div class="iter-row rounded-lg px-3 py-2 mb-1" data-idx="${i}">
      <span class="font-mono text-[11px] font-semibold" style="color:var(--accent2)">Step ${i}:</span>
      <span class="text-[12.5px] font-mono">${frame.note || ''}</span>
    </div>`;
}

// Full static render — used when the Iteration tab is opened or the algorithm/input changes.
// No play-based animation here, just the list with the current step highlighted.
function metaText(){
  const sampleLine = Array.isArray(state.baseArray) && !CATALOG[state.currentAlgo].usesGraph ? `Sample Array = [${state.baseArray.join(', ')}]` : '';
  return `Total Steps: ${state.frames.length-1}${sampleLine ? '  ·  '+sampleLine : ''}`;
}

function renderIterationTab(){
  document.getElementById('iterationMeta').textContent = metaText();

  const list = document.getElementById('iterationStepsList');
  list.innerHTML = state.frames.map(rowHtml).join('');
  renderedForFrames = state.frames;

  list.querySelectorAll('.iter-row').forEach(row=>{
    row.onclick = ()=>{ goTo(parseInt(row.dataset.idx, 10)); };
  });
  syncActiveStep();
}

// Lightweight sync called on every frame change (stepping, playing, clicking a row).
// Rebuilds the full list only if the frames array itself changed (new algo/input);
// otherwise just moves the highlight so playback doesn't re-render the whole list each tick.
function syncActiveStep(){
  syncModal();
  const tab = document.getElementById('tab-iteration');
  if(tab.classList.contains('hidden')) return;
  if(renderedForFrames!==state.frames){ renderIterationTab(); return; }
  const list = document.getElementById('iterationStepsList');
  list.querySelectorAll('.iter-row').forEach(r=>{
    const isActive = parseInt(r.dataset.idx,10)===state.idx;
    r.classList.toggle('active', isActive);
    r.classList.toggle('playing', isActive && state.playing);
  });
  const activeRow = list.querySelector('.iter-row.active');
  if(activeRow) activeRow.scrollIntoView({block:'nearest'});
}

// Called from playback_controls.js when Play starts, so the Iteration tab
// comes to the front and the person can watch each step highlight live.
function switchToIterationTab(){
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  document.querySelector('.tab[data-tab="iteration"]').classList.add('active');
  ['explain','iteration','pseudo','python','complexity'].forEach(id=>{
    document.getElementById('tab-'+id).classList.toggle('hidden', id!=='iteration');
  });
  renderIterationTab();
}

function detailHtml(frame){
  const code = (PY[state.currentAlgo] || '').split('\n')[frame.pyLine-1];
  return (code!==undefined ? `<div>Line ${frame.pyLine}: ${escapeHtml(code.trim())}</div>` : '') + Object.entries(frame).map(([k,v])=>[k,JSON.stringify(v)]).filter(([k,j])=>k!=='note' && k!=='pyLine' && j!==undefined && j.length<=160).map(([k,j])=>`<div>${k}: ${escapeHtml(j)}</div>`).join('');
}

function modalRowHtml(frame,i){
  return `
    <div class="iter-row" data-idx="${i}">
      <span class="font-mono text-[11px] font-semibold" style="color:var(--accent2)">Step ${i}:</span>
      <span class="text-[12.5px] font-mono">${escapeHtml(frame.note || '')}</span>
      <div class="iter-detail">${detailHtml(frame)}</div>
    </div>`;
}

function renderIterModal(){
  document.getElementById('iterModalMeta').textContent = metaText();
  const list = document.getElementById('iterModalList');
  list.innerHTML = state.frames.map(modalRowHtml).join('');
  renderedModalFor = state.frames;
  list.querySelectorAll('.iter-row').forEach(row=>{
    row.onclick = ()=>{ goTo(parseInt(row.dataset.idx, 10)); };
  });
  syncModal();
}

function syncModal(){
  if(!document.getElementById('iterModal').classList.contains('open')) return;
  if(renderedModalFor!==state.frames){ renderIterModal(); return; }
  const list = document.getElementById('iterModalList');
  list.querySelectorAll('.iter-row').forEach(r=>{
    const isActive = parseInt(r.dataset.idx,10)===state.idx;
    r.classList.toggle('active', isActive);
    r.classList.toggle('playing', isActive && state.playing);
  });
  const activeRow = list.querySelector('.iter-row.active');
  if(activeRow) activeRow.scrollIntoView({block:'nearest'});
}

document.getElementById('btnViewIter').onclick = ()=>{
  document.getElementById('iterModal').classList.add('open');
  renderIterModal();
};
document.getElementById('btnIterClose').onclick = ()=> document.getElementById('iterModal').classList.remove('open');
document.getElementById('iterModal').onclick = (e)=>{ if(e.target===e.currentTarget) e.currentTarget.classList.remove('open'); };
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') document.getElementById('iterModal').classList.remove('open'); });
document.getElementById('btnIterBreakdown').onclick = (e)=>{
  e.currentTarget.textContent = `Breakdown: ${document.getElementById('iterModalList').classList.toggle('show-detail') ? 'On' : 'Off'}`;
};

export { renderIterationTab, syncActiveStep, switchToIterationTab };