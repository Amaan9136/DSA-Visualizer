/* ============================= APP ENTRYPOINT ============================= */
import './js/theme.js';
import './js/sorting_algorithms.js';
import './js/searching_algorithms.js';
import './js/array_algorithms.js';
import './js/linked_list_algorithms.js';
import './js/stack_algorithms.js';
import './js/queue_algorithms.js';
import './js/hash_table_algorithms.js';
import './js/tree_algorithms.js';
import './js/tree_render.js';
import './js/graph_algorithms.js';
import './js/graph_render.js';
import './js/linked_list_render.js';
import './js/stack_render.js';
import './js/queue_render.js';
import './js/hash_table_render.js';
import './js/python_sources.js';
import './js/algorithm_catalog.js';
import { state } from './js/state.js';
import { renderSidebar } from './js/sidebar_render.js';
import { renderPanelContent } from './js/panel_render.js';
import './js/visualization_render.js';
import { pause } from './js/playback_controls.js';
import { rebuildFrames } from './js/algo_switch.js';
import './js/iteration_modal.js';

/* ============================= TABS ============================= */
document.querySelectorAll('.tab').forEach(t=>{
  t.onclick = ()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    ['explain','pseudo','python','complexity'].forEach(id=>{
      document.getElementById('tab-'+id).classList.toggle('hidden', id!==t.dataset.tab);
    });
  };
});

/* ============================= INPUT CONTROLS ============================= */
document.getElementById('btnRandom').onclick = ()=>{
  pause();
  const n = 8 + Math.floor(Math.random()*6);
  state.baseArray = Array.from({length:n}, ()=> 5+Math.floor(Math.random()*95));
  rebuildFrames();
};
document.getElementById('btnCustomToggle').onclick = ()=>{
  document.getElementById('customBar').classList.toggle('hidden');
  document.getElementById('customBar').classList.toggle('flex');
};
document.getElementById('btnCustomApply').onclick = ()=>{
  const raw = document.getElementById('customInput').value;
  const nums = raw.split(',').map(s=>parseInt(s.trim(),10)).filter(n=>!isNaN(n) && n>0 && n<=999);
  if(nums.length<2){ alert('Enter at least 2 comma-separated positive numbers.'); return; }
  pause();
  state.baseArray = nums.slice(0,20);
  rebuildFrames();
};

/* ============================= INIT ============================= */
renderSidebar();
renderPanelContent();
rebuildFrames();