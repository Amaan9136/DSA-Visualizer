/* ============================= VISUALIZATION RENDER ============================= */
import { CATALOG } from './algorithm_catalog.js';
import { renderGraphFrame } from './graph_render.js';
import { renderHashTableFrame } from './hash_table_render.js';
import { renderLinkedListFrame } from './linked_list_render.js';
import { renderQueueFrame } from './queue_render.js';
import { renderStackFrame } from './stack_render.js';
import { state } from './state.js';
import { renderTreeFrame } from './tree_render.js';

function renderBarsFrame(frame){
  const wrap = document.getElementById('canvasWrap');
  wrap.classList.remove('items-start'); wrap.classList.add('items-end');
  const arr = frame.array;
  const max = Math.max(...arr.map(Math.abs), 1);
  const w = 100/arr.length;

  wrap.innerHTML = '';
  const p = frame.pointers;
  arr.forEach((val,i)=>{
    const barWrap = document.createElement('div');
    barWrap.className = 'relative flex flex-col items-center justify-end';
    barWrap.style.cssText = `width:${w}%; max-width:52px; height:100%;`;
    const bar = document.createElement('div');
    let bg = 'linear-gradient(180deg,var(--accent2),var(--accent))';
    if(frame.sorted && frame.sorted.includes(i)) bg = 'var(--good)';
    if(frame.range && (i<frame.range[0] || i>frame.range[1])) bg = 'var(--panel2)';
    if(frame.window && (i<frame.window[0] || i>frame.window[1])) bg = 'var(--panel2)';
    if(frame.compare && frame.compare.includes(i)) bg = 'var(--warn)';
    if(frame.swap && frame.swap.includes(i)) bg = 'var(--danger)';
    if(frame.pivot===i) bg = '#c084fc';
    if(frame.found && frame.found.includes(i)) bg = 'var(--good)';
    if(p && (p.left===i || p.right===i)) bg = 'var(--accent)';
    bar.className = 'bar rounded-t-md relative flex items-end justify-center';
    bar.style.cssText = `width:100%; max-width:52px; height:${(Math.abs(val)/max*100)}%; background:${bg};`;
    const label = document.createElement('span');
    label.className='font-mono text-[10px] pb-1';
    label.style.color = '#0b0d12';
    label.textContent = val;
    bar.appendChild(label);
    barWrap.appendChild(bar);
    if(p){
      if(p.left===i){
        const tag=document.createElement('div');
        tag.className='absolute -top-5 font-mono text-[10px] font-bold'; tag.style.color='var(--accent2)'; tag.textContent='L';
        barWrap.appendChild(tag);
      }
      if(p.right===i){
        const tag=document.createElement('div');
        tag.className='absolute -top-5 font-mono text-[10px] font-bold'; tag.style.color='var(--danger)'; tag.textContent='R';
        barWrap.appendChild(tag);
      }
    }
    wrap.appendChild(barWrap);
  });

  if(frame.prefixArr){
    const strip = document.createElement('div');
    strip.className = 'absolute left-0 right-0 bottom-1 flex items-center justify-center gap-1 px-6';
    frame.prefixArr.forEach((val,i)=>{
      const cell = document.createElement('div');
      let bg = i===frame.prefixArr.length-1 && frame.compare===undefined ? 'var(--panel2)' : 'var(--panel2)';
      if(frame.compare && frame.compare.includes(i-1)) bg = 'var(--warn)';
      cell.className = 'rounded px-1.5 py-0.5 font-mono text-[10px]';
      cell.style.cssText = `background:${bg}; border:1px solid var(--border); color:var(--text);`;
      cell.textContent = val;
      strip.appendChild(cell);
    });
    document.getElementById('canvasWrap').appendChild(strip);
  }
}

function renderFrame(){
  const frame = state.frames[state.idx];
  const mode = CATALOG[state.currentAlgo].renderMode || 'bars';
  if(mode==='tree') renderTreeFrame(frame);
  else if(mode==='graph') renderGraphFrame(frame);
  else if(mode==='linkedlist') renderLinkedListFrame(frame);
  else if(mode==='stack') renderStackFrame(frame);
  else if(mode==='queue') renderQueueFrame(frame);
  else if(mode==='hashtable') renderHashTableFrame(frame);
  else renderBarsFrame(frame);

  document.getElementById('frameCounter').textContent = `Step ${state.idx} / ${state.frames.length-1}`;
  const noteEl = document.getElementById('stepNote');
  if(frame.note){ noteEl.style.display='block'; noteEl.textContent = frame.note; } else { noteEl.style.display='none'; }

  document.querySelectorAll('#pyCode .pyline').forEach(s=>s.classList.remove('active'));
  const activeLine = document.querySelector(`#pyCode .pyline[data-line="${frame.pyLine}"]`);
  if(activeLine){ activeLine.classList.add('active'); activeLine.scrollIntoView({block:'center', behavior:'smooth'}); }

  document.getElementById('btnPrev').disabled = state.idx===0;
  document.getElementById('btnNext').disabled = state.idx===state.frames.length-1;
}

export { renderBarsFrame, renderFrame };
