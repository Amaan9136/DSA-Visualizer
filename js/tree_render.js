/* ============================= TREE LAYOUT + RENDER ============================= */
function layoutTree(root){
  let counter = 0;
  const pos = {};
  (function assignX(node, depth){
    if(!node) return;
    assignX(node.left, depth+1);
    pos[node.id] = {slot:counter, depth};
    counter++;
    assignX(node.right, depth+1);
  })(root, 0);
  const n = Math.max(counter,1);
  const W = 840, topMargin = 34, rowH = 68;
  Object.values(pos).forEach(p=>{ p.px = (p.slot+0.5)/n*W + 30; p.py = topMargin + p.depth*rowH; });
  return pos;
}
const SVGNS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs){
  const e = document.createElementNS(SVGNS, tag);
  for(const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}
function renderTreeFrame(frame){
  const wrap = document.getElementById('canvasWrap');
  wrap.innerHTML = '';
  wrap.classList.add('items-start');
  const svg = svgEl('svg', {width:'100%', height:'100%', viewBox:'0 0 900 400', style:'overflow:visible'});
  wrap.appendChild(svg);
  const root = frame.tree;
  if(!root){
    svg.appendChild(svgEl('text', {x:450, y:200, 'text-anchor':'middle', fill:'var(--text-dim)', 'font-size':14}));
    svg.lastChild.textContent = 'Empty tree';
    return;
  }
  const pos = layoutTree(root);
  (function drawEdges(node){
    if(!node) return;
    const p = pos[node.id];
    [node.left, node.right].forEach(child=>{
      if(child){ const cp = pos[child.id];
        svg.appendChild(svgEl('line',{x1:p.px,y1:p.py,x2:cp.px,y2:cp.py,stroke:'var(--border)','stroke-width':2}));
        drawEdges(child);
      }
    });
  })(root);
  const h = frame.highlight || {};
  (function drawNodes(node){
    if(!node) return;
    const p = pos[node.id];
    let fill = 'var(--accent2)';
    if(frame.visited && frame.visited.includes(node.id)) fill = 'var(--good)';
    if(h.compare && h.compare.includes(node.id)) fill = 'var(--warn)';
    if(h.inserted===node.id) fill = 'var(--accent)';
    if(h.found===node.id) fill = 'var(--good)';
    if(h.deleted===node.id) fill = 'var(--danger)';
    if(h.rotated===node.id) fill = '#c084fc';
    const g = svgEl('g',{});
    g.setAttribute('data-tip', `Node ${node.val} · Depth ${p.depth}`);
    g.appendChild(svgEl('circle',{cx:p.px,cy:p.py,r:19,fill,stroke:'var(--border)','stroke-width':1.5}));
    const t = svgEl('text',{x:p.px,y:p.py+4,'text-anchor':'middle','font-size':12,'font-family':'JetBrains Mono, monospace',fill:'#0b0d12','font-weight':700});
    t.textContent = node.val;
    g.appendChild(t);
    svg.appendChild(g);
    drawNodes(node.left); drawNodes(node.right);
  })(root);
}

export { layoutTree, svgEl, renderTreeFrame };