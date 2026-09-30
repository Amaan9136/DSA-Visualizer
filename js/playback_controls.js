/* ============================= PLAYBACK CONTROLS ============================= */
import { rebuildFrames } from './algo_switch.js';
import { switchToIterationTab, syncActiveStep } from './iteration_render.js';
import { state } from './state.js';
import { renderFrame } from './visualization_render.js';

function goTo(i){
  state.idx = Math.max(0, Math.min(state.frames.length-1, i));
  renderFrame();
}
function stepNext(){
  if(state.idx>=state.frames.length-1){ pause(); return; }
  goTo(state.idx+1);
}
function stepPrev(){ pause(); goTo(state.idx-1); }

function play(){
  if(state.idx>=state.frames.length-1) goTo(0);
  state.playing = true;
  switchToIterationTab();
  document.getElementById('playIcon').className = 'fa-solid fa-pause';
  document.getElementById('playLabel').textContent = 'Pause';
  const delay = document.getElementById('speedSlider').value*1000;
  state.timer = setInterval(()=>{
    if(state.idx>=state.frames.length-1){ pause(); return; }
    stepNext();
  }, delay);
}
function pause(){
  state.playing=false;
  clearInterval(state.timer);
  document.getElementById('playIcon').className = 'fa-solid fa-play';
  document.getElementById('playLabel').textContent = 'Play';
  syncActiveStep();
}
document.getElementById('btnPlay').onclick = ()=> state.playing ? pause() : play();
document.getElementById('btnNext').onclick = ()=>{ pause(); stepNext(); };
document.getElementById('btnPrev').onclick = stepPrev;
document.getElementById('btnReset').onclick = ()=>{ pause(); rebuildFrames(); };
const setSpeed = ({target:t})=>{
  const s = document.getElementById('speedSlider'), i = document.getElementById('speedInput');
  if(t.value==='') return;
  s.value = t.value;
  if(t===s || (+i.value && +i.value!==+s.value)) i.value = s.value;
  if(state.playing){ pause(); play(); }
};
document.getElementById('speedSlider').oninput = document.getElementById('speedInput').oninput = setSpeed;

export { goTo, stepNext, stepPrev, play, pause };