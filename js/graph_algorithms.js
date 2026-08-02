/* ============================= GRAPHS ============================= */
// Graph = {nodes:[{id,label}], edges:[{id,from,to,weight}]}. Undirected throughout.
function labelOf(graph, id){ const n = graph.nodes.find(n=>n.id===id); return n ? n.label : id; }
function buildAdj(graph){
  const adj = {};
  graph.nodes.forEach(n=> adj[n.id]=[]);
  graph.edges.forEach(e=>{
    adj[e.from].push({to:e.to, weight:e.weight, edgeId:e.id});
    adj[e.to].push({to:e.from, weight:e.weight, edgeId:e.id});
  });
  return adj;
}
function genConnectedGraph(n){
  const nodeIds = Array.from({length:n}, (_,i)=>i);
  const nodes = nodeIds.map(i=>({id:'g'+i, label:String.fromCharCode(65+i)}));
  let edgeId=0;
  const edges=[];
  const existing = new Set();
  // Guarantee connectivity: random spanning tree via random insertion order.
  const order = [...nodeIds].sort(()=>Math.random()-0.5);
  for(let i=1;i<order.length;i++){
    const a = order[i], b = order[Math.floor(Math.random()*i)];
    const key = [a,b].sort((x,y)=>x-y).join('-');
    existing.add(key);
    edges.push({id:'e'+(edgeId++), from:'g'+a, to:'g'+b, weight:1+Math.floor(Math.random()*20)});
  }
  // A few extra edges for cycles (needed to make MST/Dijkstra non-trivial).
  let extra = Math.max(1, Math.floor(n*0.5)), attempts=0;
  while(extra>0 && attempts<60){
    attempts++;
    const a = nodeIds[Math.floor(Math.random()*n)], b = nodeIds[Math.floor(Math.random()*n)];
    if(a===b) continue;
    const key = [a,b].sort((x,y)=>x-y).join('-');
    if(existing.has(key)) continue;
    existing.add(key);
    edges.push({id:'e'+(edgeId++), from:'g'+a, to:'g'+b, weight:1+Math.floor(Math.random()*20)});
    extra--;
  }
  return {nodes, edges};
}

function framesBFS(graph, startId){
  const adj = buildAdj(graph);
  const frames = [];
  const visited = new Set([startId]);
  const queue = [startId];
  const treeEdges = [];
  const order = [];
  frames.push({graph, showWeights:false, highlight:{visited:[...visited], current:null, treeEdges:[]}, note:`Start BFS at ${labelOf(graph,startId)} — enqueue it.`, pyLine:4});
  while(queue.length){
    const cur = queue.shift();
    order.push(cur);
    frames.push({graph, showWeights:false, highlight:{visited:[...visited], current:cur, treeEdges:[...treeEdges]}, note:`Dequeue and visit ${labelOf(graph,cur)}.`, pyLine:6});
    for(const nb of adj[cur]){
      if(!visited.has(nb.to)){
        visited.add(nb.to); queue.push(nb.to); treeEdges.push(nb.edgeId);
        frames.push({graph, showWeights:false, highlight:{visited:[...visited], current:cur, treeEdges:[...treeEdges], edgeActive:[nb.edgeId]}, note:`Discover ${labelOf(graph,nb.to)} — enqueue it.`, pyLine:9});
      }
    }
  }
  frames.push({graph, showWeights:false, highlight:{visited:[...visited], current:null, treeEdges:[...treeEdges]}, note:`BFS complete. Visit order: ${order.map(id=>labelOf(graph,id)).join(', ')}`, pyLine:12});
  return frames;
}

function framesDFS(graph, startId){
  const adj = buildAdj(graph);
  const visited = new Set();
  const treeEdges = [];
  const order = [];
  const frames = [{graph, showWeights:false, highlight:{visited:[], current:null, treeEdges:[]}, note:`Start DFS at ${labelOf(graph,startId)}.`, pyLine:3}];
  (function visit(id){
    visited.add(id); order.push(id);
    frames.push({graph, showWeights:false, highlight:{visited:[...visited], current:id, treeEdges:[...treeEdges]}, note:`Visit ${labelOf(graph,id)}.`, pyLine:5});
    for(const nb of adj[id]){
      if(!visited.has(nb.to)){
        treeEdges.push(nb.edgeId);
        frames.push({graph, showWeights:false, highlight:{visited:[...visited], current:id, treeEdges:[...treeEdges], edgeActive:[nb.edgeId]}, note:`Explore edge to unvisited ${labelOf(graph,nb.to)} — recurse.`, pyLine:8});
        visit(nb.to);
      }
    }
    frames.push({graph, showWeights:false, highlight:{visited:[...visited], current:id, treeEdges:[...treeEdges]}, note:`Backtrack from ${labelOf(graph,id)} — all neighbors explored.`, pyLine:9});
  })(startId);
  frames.push({graph, showWeights:false, highlight:{visited:[...visited], current:null, treeEdges:[...treeEdges]}, note:`DFS complete. Visit order: ${order.map(id=>labelOf(graph,id)).join(', ')}`, pyLine:9});
  return frames;
}

function framesDijkstra(graph, startId){
  const adj = buildAdj(graph);
  const dist = {}; graph.nodes.forEach(n=>dist[n.id]=Infinity);
  dist[startId] = 0;
  const visited = new Set();
  const treeEdges = [];
  const frames = [{graph, showWeights:true, highlight:{visited:[], current:null, dist:{...dist}, treeEdges:[]}, note:`Initialize: distance to ${labelOf(graph,startId)} = 0, all others = ∞.`, pyLine:5}];
  while(visited.size < graph.nodes.length){
    let u=null, best=Infinity;
    graph.nodes.forEach(n=>{ if(!visited.has(n.id) && dist[n.id]<best){ best=dist[n.id]; u=n.id; } });
    if(u===null) break;
    visited.add(u);
    frames.push({graph, showWeights:true, highlight:{visited:[...visited], current:u, dist:{...dist}, treeEdges:[...treeEdges]}, note:`Select unvisited node with smallest distance: ${labelOf(graph,u)} (${dist[u]}).`, pyLine:9});
    for(const nb of adj[u]){
      if(visited.has(nb.to)) continue;
      const cand = dist[u] + nb.weight;
      const curLabel = dist[nb.to]===Infinity ? '∞' : dist[nb.to];
      frames.push({graph, showWeights:true, highlight:{visited:[...visited], current:u, dist:{...dist}, treeEdges:[...treeEdges], edgeActive:[nb.edgeId]}, note:`Relax edge ${labelOf(graph,u)}→${labelOf(graph,nb.to)}: ${dist[u]}+${nb.weight}=${cand} vs current ${curLabel}`, pyLine:12});
      if(cand < dist[nb.to]){
        dist[nb.to] = cand; treeEdges.push(nb.edgeId);
        frames.push({graph, showWeights:true, highlight:{visited:[...visited], current:u, dist:{...dist}, treeEdges:[...treeEdges], edgeActive:[nb.edgeId]}, note:`Shorter path found — update distance to ${labelOf(graph,nb.to)} = ${cand}.`, pyLine:14});
      }
    }
  }
  frames.push({graph, showWeights:true, highlight:{visited:[...visited], current:null, dist:{...dist}, treeEdges:[...treeEdges]}, note:`Dijkstra complete — shortest distances from ${labelOf(graph,startId)} shown above each node.`, pyLine:17});
  return frames;
}

function framesKruskal(graph){
  const parent = {}; graph.nodes.forEach(n=>parent[n.id]=n.id);
  function find(x){ while(parent[x]!==x) x=parent[x]; return x; }
  function union(a,b){ const ra=find(a), rb=find(b); if(ra===rb) return false; parent[ra]=rb; return true; }
  const sorted = [...graph.edges].sort((a,b)=>a.weight-b.weight);
  const frames = [{graph, showWeights:true, highlight:{mstEdges:[]}, note:`Sort edges by weight: ${sorted.map(e=>e.weight).join(', ')}`, pyLine:5}];
  const mst = []; let total=0;
  for(const e of sorted){
    frames.push({graph, showWeights:true, highlight:{mstEdges:[...mst], edgeActive:[e.id]}, note:`Consider edge ${labelOf(graph,e.from)}–${labelOf(graph,e.to)} (weight ${e.weight}).`, pyLine:9});
    if(find(e.from)!==find(e.to)){
      union(e.from,e.to); mst.push(e.id); total+=e.weight;
      frames.push({graph, showWeights:true, highlight:{mstEdges:[...mst]}, note:`No cycle — add to MST. Total weight so far: ${total}.`, pyLine:11});
    } else {
      frames.push({graph, showWeights:true, highlight:{mstEdges:[...mst], edgeRejected:[e.id]}, note:`${labelOf(graph,e.from)} and ${labelOf(graph,e.to)} already connected — would form a cycle. Skip.`, pyLine:13});
    }
    if(mst.length === graph.nodes.length-1) break;
  }
  frames.push({graph, showWeights:true, highlight:{mstEdges:[...mst]}, note:`MST complete. Total weight: ${total}.`, pyLine:16});
  return frames;
}

export { labelOf, buildAdj, genConnectedGraph, framesBFS, framesDFS, framesDijkstra, framesKruskal };
