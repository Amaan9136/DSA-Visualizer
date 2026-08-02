/* ============================= LINKED LIST RENDER ============================= */
import { svgEl } from './tree_render.js';

function renderLinkedListFrame(frame){
  const wrap = document.getElementById('canvasWrap');
  wrap.innerHTML=''; wrap.classList.add('items-start');
  const nodes=[]; let cur=frame.list; const seen=new Set();
  while(cur){ if(seen.has(cur.id)) break; seen.add(cur.id); nodes.push(cur); cur=cur.next; }
  const gapX = 110, r=26, cy=90;
  const W = Math.max(320, nodes.length*gapX + 80);
  const svg = svgEl('svg', {width:'100%', height:'100%', viewBox:`0 0 ${W} 200`, style:'overflow:visible'});
  wrap.appendChild(svg);
  if(nodes.length===0){
    svg.appendChild(svgEl('text', {x:W/2, y:cy, 'text-anchor':'middle', fill:'var(--text-dim)', 'font-size':14}));
    svg.lastChild.textContent = 'Empty list';
    return;
  }
  const h = frame.highlight || {};
  nodes.forEach((n,i)=>{
    const x = 60 + i*gapX;
    if(n.next){
      const idxNext = nodes.findIndex(m=>m.id===n.next.id);
      if(idxNext!==-1){
        const x2 = 60 + idxNext*gapX;
        if(idxNext===i+1){
          svg.appendChild(svgEl('line',{x1:x+r,y1:cy,x2:x2-r,y2:cy,stroke:'var(--border)','stroke-width':2,'marker-end':'url(#llArrow)'}));
        } else {
          const midY = cy - 60;
          const path = svgEl('path',{d:`M ${x+r} ${cy-10} Q ${(x+x2)/2} ${midY} ${x2-r} ${cy-10}`, fill:'none', stroke:'var(--danger)','stroke-width':2,'marker-end':'url(#llArrowRed)'});
          svg.appendChild(path);
        }
      }
    } else if(n.cycleBack){
      const y2 = cy+40;
      svg.appendChild(svgEl('text',{x:x,y:y2+16,'text-anchor':'middle','font-size':10,'font-family':'JetBrains Mono, monospace',fill:'var(--danger)'}));
      svg.lastChild.textContent = '↺ cycles back';
    }
  });
  const defs = svgEl('defs',{});
  const marker = svgEl('marker',{id:'llArrow', markerWidth:8, markerHeight:8, refX:6, refY:3, orient:'auto'});
  marker.appendChild(svgEl('path',{d:'M0,0 L6,3 L0,6 Z', fill:'var(--border)'}));
  defs.appendChild(marker);
  const marker2 = svgEl('marker',{id:'llArrowRed', markerWidth:8, markerHeight:8, refX:6, refY:3, orient:'auto'});
  marker2.appendChild(svgEl('path',{d:'M0,0 L6,3 L0,6 Z', fill:'var(--danger)'}));
  defs.appendChild(marker2);
  svg.insertBefore(defs, svg.firstChild);
  nodes.forEach((n,i)=>{
    const x = 60 + i*gapX;
    let fill = 'var(--accent2)';
    if(h.compare && h.compare.includes(n.id)) fill = 'var(--warn)';
    if(h.inserted===n.id) fill = 'var(--accent)';
    if(h.deleted===n.id) fill = 'var(--danger)';
    if(h.found===n.id) fill = 'var(--good)';
    const g = svgEl('g',{});
    g.appendChild(svgEl('rect',{x:x-r,y:cy-r,width:r*2,height:r*2,rx:8,fill,stroke:'var(--border)','stroke-width':1.5}));
    const t = svgEl('text',{x:x,y:cy+4,'text-anchor':'middle','font-size':13,'font-family':'JetBrains Mono, monospace',fill:'#0b0d12','font-weight':700});
    t.textContent = n.val;
    g.appendChild(t);
    svg.appendChild(g);
    if(i===0){
      const lbl = svgEl('text',{x:x,y:cy-r-10,'text-anchor':'middle','font-size':10,'font-family':'JetBrains Mono, monospace',fill:'var(--text-dim)'});
      lbl.textContent='head';
      svg.appendChild(lbl);
    }
  });
}

export { renderLinkedListFrame };
