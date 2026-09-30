/* ============================= QUEUE RENDER ============================= */
import { svgEl } from './tree_render.js';

function renderQueueFrame(frame){
  const wrap = document.getElementById('canvasWrap');
  wrap.classList.remove('items-end'); wrap.classList.add('items-start');
  wrap.innerHTML = '';
  const h = frame.highlight || {};
  if(frame.circBuf){
    const cx=170, cy=100, R=110;
    const svg = svgEl('svg', {width:'100%', height:'100%', viewBox:'0 0 340 220', style:'overflow:visible'});
    wrap.appendChild(svg);
    const n = frame.capacity;
    frame.circBuf.forEach((val,i)=>{
      const angle = (i/n)*2*Math.PI - Math.PI/2;
      const px = cx+R*Math.cos(angle), py = cy+R*Math.sin(angle);
      let fill = val===null ? 'var(--panel2)' : 'var(--accent2)';
      if(i===frame.front && frame.size>0) fill='var(--warn)';
      if(h.rear===i) fill='var(--accent)';
      if(h.dequeuedSlot===i) fill='var(--danger)';
      const g = svgEl('g',{});
      g.setAttribute('data-tip', `Slot ${i} · ${val===null?'empty':'Value '+val}${i===frame.front&&frame.size>0?' · front':''}`);
      g.appendChild(svgEl('circle',{cx:px,cy:py,r:22,fill,stroke:'var(--border)','stroke-width':1.5}));
      const t = svgEl('text',{x:px,y:py+4,'text-anchor':'middle','font-size':12,'font-family':'JetBrains Mono, monospace',fill:'#0b0d12','font-weight':700});
      t.textContent = val===null?'·':val;
      g.appendChild(t);
      svg.appendChild(g);
      const lbl = svgEl('text',{x:px,y:py-30,'text-anchor':'middle','font-size':9,'font-family':'JetBrains Mono, monospace',fill:'var(--text-dim)'});
      lbl.textContent = i===frame.front ? 'front' : '';
      svg.appendChild(lbl);
    });
    wrap.appendChild(svg);
    return;
  }
  const queue = frame.queue||[];
  const row = document.createElement('div');
  row.className = 'flex items-center justify-center gap-1.5 h-full';
  if(queue.length===0){
    const empty = document.createElement('div');
    empty.className='text-[12px] font-mono'; empty.style.color='var(--text-dim)'; empty.textContent='(empty queue)';
    row.appendChild(empty);
  }
  queue.forEach((val,i)=>{
    const cellWrap = document.createElement('div');
    cellWrap.className = 'flex flex-col items-center gap-1';
    let bg = 'var(--accent2)';
    if(h.rear===i) bg='var(--accent)';
    const cell = document.createElement('div');
    cell.className = 'rounded-md flex items-center justify-center font-mono font-bold text-[15px]';
    cell.style.cssText = `width:46px; height:40px; background:${bg}; color:#0b0d12;`;
    cell.textContent = val;
    cell.dataset.tip = `Position ${i} · Value ${val}${i===0?' · front':''}${i===queue.length-1?' · rear':''}`;
    cellWrap.appendChild(cell);
    const lbl = document.createElement('div');
    lbl.className = 'text-[10px] font-mono'; lbl.style.color='var(--text-dim)';
    lbl.textContent = i===0 ? 'front' : (i===queue.length-1 ? 'rear' : '');
    cellWrap.appendChild(lbl);
    row.appendChild(cellWrap);
  });
  wrap.appendChild(row);
}

export { renderQueueFrame };