/* ============================= ALGO SWITCH / REBUILD ============================= */
import { CATALOG } from './algorithm_catalog.js';
import { genConnectedGraph } from './graph_algorithms.js';
import { renderPanelContent } from './panel_render.js';
import { pause } from './playback_controls.js';
import { renderSidebar } from './sidebar_render.js';
import { state } from './state.js';
import { renderFrame } from './visualization_render.js';

function ensureGraph(){
  if(!state.graph){
    state.graph = genConnectedGraph(6 + Math.floor(Math.random()*4));
    state.startNode = state.graph.nodes[0].id;
  }
}
function populateStartNodeSelect(){
  const sel = document.getElementById('startNodeSelect');
  sel.innerHTML = '';
  state.graph.nodes.forEach(n=>{
    const opt = document.createElement('option');
    opt.value = n.id; opt.textContent = n.label;
    if(n.id===state.startNode) opt.selected = true;
    sel.appendChild(opt);
  });
}
document.getElementById('btnNewGraph').onclick = ()=>{
  pause();
  state.graph = genConnectedGraph(6 + Math.floor(Math.random()*4));
  state.startNode = state.graph.nodes[0].id;
  populateStartNodeSelect();
  rebuildFrames();
};
document.getElementById('startNodeSelect').onchange = (e)=>{
  pause();
  state.startNode = e.target.value;
  rebuildFrames();
};

function rebuildFrames(){
  const algo = CATALOG[state.currentAlgo];
  if(algo.usesGraph){
    ensureGraph();
    state.frames = algo.needsStartNode ? algo.frames(state.graph, state.startNode) : algo.frames(state.graph);
  } else if(algo.needsTarget){
    state.frames = algo.frames(state.baseArray, state.target);
    document.getElementById('targetHint').textContent = `in {${state.baseArray.join(', ')}}`;
  } else if(algo.needsText){
    state.frames = algo.frames(state.baseArray, state.textInput);
  } else {
    state.frames = algo.frames(state.baseArray);
  }
  state.idx = 0;
  renderFrame();
}
function selectAlgo(key){
  pause();
  state.currentAlgo = key;
  const algo = CATALOG[key];
  document.getElementById('algoTitle').textContent = algo.name;
  const subtitleKind = algo.usesGraph ? 'graph algorithm' : (algo.renderMode==='tree' ? 'tree structure' : (algo.needsTarget ? 'search' : 'comparison-based'));
  document.getElementById('algoSub').textContent = `${algo.cat} · ${subtitleKind}`;
  renderSidebar(document.getElementById('searchInput').value);
  renderPanelContent();

  const targetBar = document.getElementById('targetBar');
  const textBar = document.getElementById('textBar');
  const graphBar = document.getElementById('graphBar');
  const customToggleBtn = document.getElementById('btnCustomToggle');
  const randomBtn = document.getElementById('btnRandom');

  targetBar.classList.add('hidden'); targetBar.classList.remove('flex');
  textBar.classList.add('hidden'); textBar.classList.remove('flex');
  graphBar.classList.add('hidden'); graphBar.classList.remove('flex');
  customToggleBtn.classList.remove('hidden');
  randomBtn.classList.remove('hidden');
  document.getElementById('customBar').classList.add('hidden');
  document.getElementById('customBar').classList.remove('flex');

  if(algo.usesGraph){
    ensureGraph();
    graphBar.classList.remove('hidden'); graphBar.classList.add('flex');
    customToggleBtn.classList.add('hidden');
    randomBtn.classList.add('hidden');
    const startLabel = document.getElementById('graphStartLabel');
    const startSelect = document.getElementById('startNodeSelect');
    if(algo.needsStartNode){ startLabel.style.display=''; startSelect.style.display=''; }
    else { startLabel.style.display='none'; startSelect.style.display='none'; }
    populateStartNodeSelect();
  } else if(algo.needsTarget){
    targetBar.classList.remove('hidden'); targetBar.classList.add('flex');
    if(algo.defaultTarget !== undefined) state.target = algo.defaultTarget;
    document.getElementById('targetInput').value = state.target;
    document.getElementById('targetLabelText').textContent = algo.targetLabel || 'Search for:';
    document.getElementById('btnTargetApply').textContent = algo.targetButtonLabel || 'Search';
    customToggleBtn.textContent = algo.renderMode==='tree' ? 'Custom Sequence' : (algo.renderMode==='linkedlist' ? 'Custom List' : 'Custom Array');
  } else if(algo.needsText){
    textBar.classList.remove('hidden'); textBar.classList.add('flex');
    state.textInput = algo.textDefault !== undefined ? algo.textDefault : '';
    document.getElementById('textInputField').value = state.textInput;
    document.getElementById('textLabelText').textContent = algo.textLabel || 'Input:';
    document.getElementById('btnTextApply').textContent = algo.textButtonLabel || 'Run';
    customToggleBtn.classList.add('hidden');
    randomBtn.classList.add('hidden');
  } else {
    customToggleBtn.textContent = algo.renderMode==='tree' ? 'Custom Sequence' : (algo.renderMode==='linkedlist' ? 'Custom List' : 'Custom Input');
  }
  rebuildFrames();
}

document.getElementById('btnTargetApply').onclick = ()=>{
  const v = parseInt(document.getElementById('targetInput').value, 10);
  if(isNaN(v)){ alert('Enter a numeric target value.'); return; }
  pause();
  state.target = v;
  rebuildFrames();
};

document.getElementById('btnTextApply').onclick = ()=>{
  const v = document.getElementById('textInputField').value;
  pause();
  state.textInput = v;
  rebuildFrames();
};

export { ensureGraph, populateStartNodeSelect, rebuildFrames, selectAlgo };
