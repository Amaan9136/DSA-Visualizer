/* ============================= LINKED LISTS ============================= */
// LL frames use `list` (a plain cloneable singly-linked chain), `highlight`.
let llIdCounter = 0;
function makeLLNode(val){ return {id:'ln'+(llIdCounter++), val, next:null}; }
function buildLL(values){
  llIdCounter = 0;
  let head=null, tail=null;
  for(const v of values){
    const node = makeLLNode(v);
    if(!head) head=node; else tail.next=node;
    tail=node;
  }
  return head;
}
function llToArray(head){
  const out=[]; let cur=head; const seen=new Set();
  while(cur){ if(seen.has(cur.id)) break; seen.add(cur.id); out.push(cur.val); cur=cur.next; }
  return out;
}
function cloneLL(head){
  if(!head) return null;
  const arr=[]; let c=head; while(c){ arr.push(c); c=c.next; }
  const clones = arr.map(n=>({id:n.id, val:n.val, next:null}));
  for(let i=0;i<arr.length-1;i++) clones[i].next = clones[i+1];
  return clones[0]||null;
}
function cloneAcyclicLL(head, maxNodes){
  if(!head) return null;
  const nodes=[]; let cur=head; const seen=new Set();
  while(cur && nodes.length<maxNodes){
    if(seen.has(cur.id)){ nodes.push({id:cur.id, val:cur.val, cycleBack:true}); break; }
    seen.add(cur.id); nodes.push({id:cur.id, val:cur.val, next:cur.next}); cur=cur.next;
  }
  const clones = nodes.map(n=>({id:n.id, val:n.val, next:null, cycleBack:n.cycleBack}));
  const cmap = new Map(); clones.forEach(c=>cmap.set(c.id,c));
  for(let i=0;i<nodes.length-1;i++) clones[i].next = cmap.get(nodes[i+1].id);
  return clones[0]||null;
}

function framesLLInsert(values, insertVal, insertPos){
  let head = buildLL(values);
  const frames = [];
  frames.push({list:cloneLL(head), note:`Insert ${insertVal} at position ${insertPos}.`, pyLine:6});
  if(insertPos===0){
    const node = makeLLNode(insertVal);
    node.next = head;
    head = node;
    frames.push({list:cloneLL(head), highlight:{inserted:node.id}, note:`Insert at head — new node points to old head.`, pyLine:9});
    return frames;
  }
  let cur=head, idx=0;
  while(cur && idx<insertPos-1){
    frames.push({list:cloneLL(head), highlight:{compare:[cur.id]}, note:`Walk to position ${idx}: node ${cur.val}`, pyLine:13});
    cur=cur.next; idx++;
  }
  if(!cur){
    frames.push({list:cloneLL(head), note:`Position ${insertPos} out of bounds.`, pyLine:13});
    return frames;
  }
  const node = makeLLNode(insertVal);
  node.next = cur.next;
  cur.next = node;
  frames.push({list:cloneLL(head), highlight:{inserted:node.id, compare:[cur.id]}, note:`Insert ${insertVal} after node ${cur.val}`, pyLine:15});
  return frames;
}

function framesLLDelete(values, delVal){
  let head = buildLL(values);
  const frames = [];
  frames.push({list:cloneLL(head), note:`Delete first node with value ${delVal}.`, pyLine:1});
  if(!head){
    frames.push({list:null, note:`List is empty.`, pyLine:3});
    return frames;
  }
  if(head.val===delVal){
    frames.push({list:cloneLL(head), highlight:{deleted:head.id}, note:`Head node matches — remove it, advance head.`, pyLine:5});
    head = head.next;
    frames.push({list:cloneLL(head), note:`Deletion complete.`, pyLine:5});
    return frames;
  }
  let prev=head, cur=head.next;
  while(cur){
    frames.push({list:cloneLL(head), highlight:{compare:[cur.id]}, note:`Compare node ${cur.val} with target ${delVal}`, pyLine:8});
    if(cur.val===delVal){
      prev.next = cur.next;
      frames.push({list:cloneLL(head), highlight:{deleted:cur.id}, note:`Found — unlink node ${cur.val}`, pyLine:9});
      return frames;
    }
    prev=cur; cur=cur.next;
  }
  frames.push({list:cloneLL(head), note:`Value ${delVal} not found in the list.`, pyLine:12});
  return frames;
}

function framesLLReverse(values){
  let head = buildLL(values);
  const frames = [];
  frames.push({list:cloneLL(head), note:`Reverse the linked list iteratively.`, pyLine:2});
  let prev=null, cur=head;
  while(cur){
    frames.push({list:cloneLL(head), highlight:{compare:[cur.id]}, note:`At node ${cur.val} — save next, point current.next to prev`, pyLine:5});
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
    frames.push({list:cloneLL(prev), highlight:{inserted:prev.id}, note:`Advance: prev = ${prev.val}`, pyLine:7});
  }
  head = prev;
  frames.push({list:cloneLL(head), note:`Reversal complete: [${llToArray(head).join(', ')}]`, pyLine:9});
  return frames;
}

function framesLLCycleDetect(values, cyclePos){
  let head = buildLL(values);
  const frames = [];
  if(cyclePos!==null && cyclePos>=0 && head){
    const nodes=[]; let cur=head; while(cur){ nodes.push(cur); cur=cur.next; }
    if(nodes.length>0 && cyclePos<nodes.length) nodes[nodes.length-1].next = nodes[cyclePos];
  }
  frames.push({list:cloneAcyclicLL(head,40), note:`Detect cycle using Floyd's Tortoise and Hare.`, pyLine:2});
  let slow=head, fast=head, found=false, steps=0;
  while(fast && fast.next && steps<200){
    slow = slow.next;
    fast = fast.next.next;
    steps++;
    frames.push({list:cloneAcyclicLL(head,40), highlight:{compare:[slow?slow.id:null, fast?fast.id:null].filter(Boolean)}, note:`slow moves 1 step to ${slow?slow.val:'null'}, fast moves 2 steps to ${fast?fast.val:'null'}`, pyLine:5});
    if(slow && fast && slow.id===fast.id){
      found = true;
      frames.push({list:cloneAcyclicLL(head,40), highlight:{found:slow.id}, note:`slow and fast meet at node ${slow.val} — cycle detected!`, pyLine:7});
      break;
    }
  }
  if(!found) frames.push({list:cloneAcyclicLL(head,40), note:`fast reached the end — no cycle.`, pyLine:8});
  return frames;
}

export { makeLLNode, buildLL, llToArray, cloneLL, cloneAcyclicLL, framesLLInsert, framesLLDelete, framesLLReverse, framesLLCycleDetect };
