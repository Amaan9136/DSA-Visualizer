/* ============================= GRAPH LAYOUT + RENDER ============================= */
import { svgEl } from './tree_render.js';

function layoutGraph(nodes){
  const n = nodes.length, cx=430, cy=185, r=145;
  const pos = {};
  nodes.forEach((node,i)=>{
    const angle = (i/n)*2*Math.PI - Math.PI/2;
    pos[node.id] = {px: cx+r*Math.cos(angle), py: cy+r*Math.sin(angle)};
  });
  return pos;
}
function renderGraphFrame(frame){
  const wrap = document.getElementById('canvasWrap');
  wrap.innerHTML=''; wrap.classList.add('items-start');
  const svg = svgEl('svg', {width:'100%', height:'100%', viewBox:'0 0 860 370', style:'overflow:visible'});
  wrap.appendChild(svg);
  const {nodes, edges} = frame.graph;
  const pos = layoutGraph(nodes);
  const h = frame.highlight || {};
  const treeSet = new Set(h.treeEdges||[]);
  const mstSet = new Set(h.mstEdges||[]);
  const activeSet = new Set(h.edgeActive||[]);
  const rejectSet = new Set(h.edgeRejected||[]);

  edges.forEach(e=>{
    const p1=pos[e.from], p2=pos[e.to];
    let stroke='var(--border)', width=2, dash=null;
    if(treeSet.has(e.id) || mstSet.has(e.id)){ stroke='var(--good)'; width=3; }
    if(rejectSet.has(e.id)){ stroke='var(--danger)'; width=2; dash='4,3'; }
    if(activeSet.has(e.id)){ stroke='var(--warn)'; width=3.5; }
    const attrs = {x1:p1.px,y1:p1.py,x2:p2.px,y2:p2.py,stroke,'stroke-width':width};
    const line = svgEl('line', attrs);
    if(dash) line.setAttribute('stroke-dasharray', dash);
    svg.appendChild(line);
    if(frame.showWeights){
      const mx=(p1.px+p2.px)/2, my=(p1.py+p2.py)/2;
      svg.appendChild(svgEl('rect',{x:mx-11,y:my-9,width:22,height:16,fill:'var(--panel)',rx:3}));
      const t = svgEl('text',{x:mx,y:my+3,'text-anchor':'middle','font-size':10,'font-family':'JetBrains Mono, monospace',fill:'var(--text)'});
      t.textContent = e.weight;
      svg.appendChild(t);
    }
  });

  const visitedSet = new Set(h.visited||[]);
  nodes.forEach(n=>{
    const p = pos[n.id];
    let fill='var(--panel2)', textColor='var(--text)';
    if(visitedSet.has(n.id)){ fill='var(--accent2)'; textColor='#0b0d12'; }
    if(h.current===n.id){ fill='var(--warn)'; textColor='#0b0d12'; }
    const g = svgEl('g',{});
    g.setAttribute('data-tip', `Node ${n.label}${h.dist && h.dist[n.id]!==undefined ? ' · Distance '+(h.dist[n.id]===Infinity?'∞':h.dist[n.id]) : ''}`);
    g.appendChild(svgEl('circle',{cx:p.px,cy:p.py,r:20,fill,stroke:'var(--border)','stroke-width':1.5}));
    const t = svgEl('text',{x:p.px,y:p.py+4,'text-anchor':'middle','font-size':12,'font-family':'JetBrains Mono, monospace',fill:textColor,'font-weight':700});
    t.textContent = n.label;
    g.appendChild(t);
    svg.appendChild(g);
    if(h.dist){
      const d = h.dist[n.id];
      const label = d===undefined ? '' : (d===Infinity ? '∞' : String(d));
      const dt = svgEl('text',{x:p.px,y:p.py-28,'text-anchor':'middle','font-size':11,'font-family':'JetBrains Mono, monospace',fill:'var(--accent)','font-weight':700});
      dt.textContent = label;
      svg.appendChild(dt);
    }
  });
}

export { layoutGraph, renderGraphFrame };