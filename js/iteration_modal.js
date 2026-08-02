/* ============================= ITERATION STEPS MODAL ============================= */
import { CATALOG } from './algorithm_catalog.js';
import { goTo } from './playback_controls.js';
import { state } from './state.js';

let breakdownOn = false;

// Generic heuristic split of a step's note into a short action label and the rest.
// Works for any algorithm's note text since it only looks at punctuation/casing, not algo-specific wording.
function breakdownNote(note){
  if(!note) return { action:'Step', detail:'' };
  const sepMatch = note.match(/^(.*?)\s*[—:]\s*(.+)$/);
  if(sepMatch) return { action:sepMatch[1], detail:sepMatch[2] };
  const words = note.split(' ');
  const action = words.slice(0, Math.min(2, words.length)).join(' ');
  const detail = words.slice(Math.min(2, words.length)).join(' ');
  return { action, detail };
}

function renderIterationList(){
  const list = document.getElementById('iterationStepsList');
  const algo = CATALOG[state.currentAlgo];
  document.getElementById('iterationModalTitle').textContent = `Iteration Steps — ${algo.name}`;
  const sampleLine = Array.isArray(state.baseArray) && !algo.usesGraph ? `Sample Array = [${state.baseArray.join(', ')}]` : '';
  document.getElementById('iterationModalMeta').textContent = `Total Steps: ${state.frames.length-1}${sampleLine ? '  ·  '+sampleLine : ''}`;

  list.innerHTML = state.frames.map((frame,i)=>{
    const activeCls = i===state.idx ? ' active' : '';
    if(breakdownOn){
      const { action, detail } = breakdownNote(frame.note);
      return `
        <div class="iter-row rounded-lg px-3 py-2 mb-1${activeCls}" data-idx="${i}">
          <div class="flex items-center gap-2">
            <span class="font-mono text-[11px] font-semibold" style="color:var(--accent2)">Step ${i}</span>
            <span class="iter-chip">${action || 'Step'}</span>
          </div>
          ${detail ? `<div class="text-[12px] font-mono mt-1" style="color:var(--text-dim)">${detail}</div>` : ''}
        </div>`;
    }
    return `
      <div class="iter-row rounded-lg px-3 py-2 mb-1${activeCls}" data-idx="${i}">
        <span class="font-mono text-[11px] font-semibold" style="color:var(--accent2)">Step ${i}:</span>
        <span class="text-[12.5px] font-mono">${frame.note || ''}</span>
      </div>`;
  }).join('');

  list.querySelectorAll('.iter-row').forEach(row=>{
    row.onclick = ()=>{
      goTo(parseInt(row.dataset.idx, 10));
      list.querySelectorAll('.iter-row').forEach(r=>r.classList.remove('active'));
      row.classList.add('active');
    };
  });
}

function openIterationModal(){
  renderIterationList();
  const modal = document.getElementById('iterationModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}
function closeIterationModal(){
  const modal = document.getElementById('iterationModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

document.getElementById('btnViewIteration').onclick = openIterationModal;
document.getElementById('btnIterationClose').onclick = closeIterationModal;
document.getElementById('iterationModal').onclick = (e)=>{
  if(e.target.id==='iterationModal') closeIterationModal();
};
document.getElementById('btnBreakdownToggle').onclick = ()=>{
  breakdownOn = !breakdownOn;
  document.getElementById('btnBreakdownToggle').textContent = breakdownOn ? 'Simple View' : 'Breakdown';
  renderIterationList();
};

function syncActiveStep(){
  const modal = document.getElementById('iterationModal');
  if(modal.classList.contains('hidden')) return;
  const list = document.getElementById('iterationStepsList');
  list.querySelectorAll('.iter-row').forEach(r=>r.classList.toggle('active', parseInt(r.dataset.idx,10)===state.idx));
  const activeRow = list.querySelector('.iter-row.active');
  if(activeRow) activeRow.scrollIntoView({block:'nearest'});
}

export { openIterationModal, closeIterationModal, syncActiveStep };