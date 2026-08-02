/* ============================= TREES ============================= */
// Tree frames use `tree` (a plain cloneable node graph), `highlight`, `visited`.
let treeIdCounter = 0;
function makeTreeNode(val){ return {id:'n'+(treeIdCounter++), val, left:null, right:null, height:1}; }
function cloneTree(node){
  if(!node) return null;
  return {id:node.id, val:node.val, height:node.height, left:cloneTree(node.left), right:cloneTree(node.right)};
}
function nodeHeight(n){ return n ? n.height : 0; }
function updateHeight(n){ n.height = 1 + Math.max(nodeHeight(n.left), nodeHeight(n.right)); }
function balanceFactor(n){ return n ? nodeHeight(n.left) - nodeHeight(n.right) : 0; }
function rotateRight(y){ const x=y.left; const T2=x.right; x.right=y; y.left=T2; updateHeight(y); updateHeight(x); return x; }
function rotateLeft(x){ const y=x.right; const T2=y.left; y.left=x; x.right=T2; updateHeight(x); updateHeight(y); return y; }

// Plain (non-animated) BST builder, used as the starting tree for search/delete/traversal demos.
function buildSimpleBST(values){
  treeIdCounter = 0;
  let root = null;
  for(const v of values){
    if(!root){ root = makeTreeNode(v); continue; }
    let cur = root;
    while(true){
      if(v < cur.val){ if(!cur.left){ cur.left = makeTreeNode(v); break; } cur = cur.left; }
      else if(v > cur.val){ if(!cur.right){ cur.right = makeTreeNode(v); break; } cur = cur.right; }
      else break; // duplicate, skip
    }
  }
  return root;
}

function framesBSTBuild(values){
  treeIdCounter = 0;
  let root = null;
  const frames = [{tree:null, note:"Empty tree. We'll insert each value one at a time.", pyLine:1}];
  for(const v of values){
    if(!root){
      root = makeTreeNode(v);
      frames.push({tree:cloneTree(root), highlight:{inserted:root.id}, note:`Tree is empty — ${v} becomes the root.`, pyLine:3});
      continue;
    }
    let cur = root;
    while(true){
      frames.push({tree:cloneTree(root), highlight:{compare:[cur.id]}, note:`Compare ${v} with ${cur.val}`, pyLine:6});
      if(v < cur.val){
        if(!cur.left){ cur.left = makeTreeNode(v); frames.push({tree:cloneTree(root), highlight:{inserted:cur.left.id}, note:`${v} < ${cur.val} — insert as left child`, pyLine:8}); break; }
        cur = cur.left;
      } else if(v > cur.val){
        if(!cur.right){ cur.right = makeTreeNode(v); frames.push({tree:cloneTree(root), highlight:{inserted:cur.right.id}, note:`${v} > ${cur.val} — insert as right child`, pyLine:10}); break; }
        cur = cur.right;
      } else {
        frames.push({tree:cloneTree(root), highlight:{compare:[cur.id]}, note:`${v} already exists — duplicates are ignored in a plain BST`, pyLine:11});
        break;
      }
    }
  }
  frames.push({tree:cloneTree(root), note:"Build complete.", pyLine:12});
  return frames;
}

function framesBSTSearch(values, target){
  const root = buildSimpleBST(values);
  const frames = [{tree:cloneTree(root), note:`Searching for ${target}.`, pyLine:1}];
  let cur = root;
  while(cur){
    frames.push({tree:cloneTree(root), highlight:{compare:[cur.id]}, note:`Compare ${target} with ${cur.val}`, pyLine:4});
    if(target === cur.val){ frames.push({tree:cloneTree(root), highlight:{found:cur.id}, note:`Found ${target}!`, pyLine:5}); return frames; }
    const goingLeft = target < cur.val;
    const from = cur.val;
    cur = goingLeft ? cur.left : cur.right;
    frames.push({tree:cloneTree(root), note:`${target} ${goingLeft?'<':'>'} ${from} — move to the ${goingLeft?'left':'right'} subtree`, pyLine:7});
  }
  frames.push({tree:cloneTree(root), note:`${target} not found in the tree.`, pyLine:9});
  return frames;
}

function framesBSTDelete(values, target){
  let root = buildSimpleBST(values);
  const frames = [{tree:cloneTree(root), note:`Deleting ${target} from the tree.`, pyLine:1}];
  function del(node, val){
    if(!node){ frames.push({tree:cloneTree(root), note:`${val} not found in the tree.`, pyLine:3}); return null; }
    frames.push({tree:cloneTree(root), highlight:{compare:[node.id]}, note:`Compare ${val} with ${node.val}`, pyLine:5});
    if(val < node.val){ node.left = del(node.left, val); return node; }
    if(val > node.val){ node.right = del(node.right, val); return node; }
    frames.push({tree:cloneTree(root), highlight:{found:node.id}, note:`Found ${val} — determine deletion case`, pyLine:8});
    if(!node.left && !node.right){
      frames.push({tree:cloneTree(root), highlight:{deleted:node.id}, note:`Leaf node — remove it directly`, pyLine:10});
      return null;
    }
    if(!node.left || !node.right){
      const child = node.left || node.right;
      frames.push({tree:cloneTree(root), highlight:{deleted:node.id}, note:`One child — replace this node with its child`, pyLine:13});
      return child;
    }
    let succ = node.right;
    while(succ.left) succ = succ.left;
    frames.push({tree:cloneTree(root), highlight:{compare:[succ.id]}, note:`Two children — inorder successor (min of right subtree) is ${succ.val}`, pyLine:17});
    node.val = succ.val;
    frames.push({tree:cloneTree(root), highlight:{inserted:node.id}, note:`Copy successor value ${succ.val} into this node`, pyLine:18});
    node.right = del(node.right, succ.val);
    return node;
  }
  root = del(root, target);
  frames.push({tree:cloneTree(root), note:`Deletion complete.`, pyLine:20});
  return frames;
}

function framesTraversal(values, type){
  const root = buildSimpleBST(values);
  const frames = [{tree:cloneTree(root), note:`Starting ${type.replace('order',' order')} traversal.`, pyLine:1}];
  const visitedIds = [], visitedVals = [];
  function visit(node){
    visitedIds.push(node.id); visitedVals.push(node.val);
    frames.push({tree:cloneTree(root), highlight:{compare:[node.id]}, visited:[...visitedIds], note:`Visit ${node.val}  →  order so far: ${visitedVals.join(', ')}`, pyLine: type==='preorder'?3:type==='inorder'?4:type==='postorder'?5:4});
  }
  if(type==='levelorder'){
    const q = root ? [root] : [];
    while(q.length){
      const node = q.shift();
      visit(node);
      if(node.left) q.push(node.left);
      if(node.right) q.push(node.right);
    }
  } else {
    (function walk(node){
      if(!node) return;
      if(type==='preorder') visit(node);
      walk(node.left);
      if(type==='inorder') visit(node);
      walk(node.right);
      if(type==='postorder') visit(node);
    })(root);
  }
  frames.push({tree:cloneTree(root), visited:[...visitedIds], note:`Traversal complete: ${visitedVals.join(', ')}`, pyLine:8});
  return frames;
}

function framesAVLInsert(values){
  treeIdCounter = 0;
  let root = null;
  const frames = [{tree:null, note:"Empty AVL tree. Every insertion is followed by a rebalancing check.", pyLine:1}];
  for(const val of values){
    if(!root){
      root = makeTreeNode(val);
      frames.push({tree:cloneTree(root), highlight:{inserted:root.id}, note:`Tree empty — ${val} becomes the root.`, pyLine:3});
      continue;
    }
    const path = [];
    let cur = root, skip=false;
    while(true){
      path.push(cur);
      frames.push({tree:cloneTree(root), highlight:{compare:[cur.id]}, note:`Compare ${val} with ${cur.val}`, pyLine:6});
      if(val < cur.val){
        if(!cur.left){ cur.left = makeTreeNode(val); path.push(cur.left); frames.push({tree:cloneTree(root), highlight:{inserted:cur.left.id}, note:`Insert ${val} as left child of ${cur.val}`, pyLine:8}); break; }
        cur = cur.left;
      } else if(val > cur.val){
        if(!cur.right){ cur.right = makeTreeNode(val); path.push(cur.right); frames.push({tree:cloneTree(root), highlight:{inserted:cur.right.id}, note:`Insert ${val} as right child of ${cur.val}`, pyLine:10}); break; }
        cur = cur.right;
      } else { frames.push({tree:cloneTree(root), highlight:{compare:[cur.id]}, note:`${val} already exists — skip`, pyLine:11}); skip=true; break; }
    }
    if(skip) continue;
    // Walk back up the path (excluding the new leaf) rebalancing.
    for(let i=path.length-2;i>=0;i--){
      const node = path[i];
      updateHeight(node);
      const bf = balanceFactor(node);
      frames.push({tree:cloneTree(root), highlight:{compare:[node.id]}, note:`Recompute balance factor at ${node.val}: ${bf}`, pyLine:15});
      let newSubRoot = node, label = null;
      if(bf > 1 && balanceFactor(node.left) >= 0){ newSubRoot = rotateRight(node); label = `Left-Left case — rotate right at ${node.val}`; }
      else if(bf < -1 && balanceFactor(node.right) <= 0){ newSubRoot = rotateLeft(node); label = `Right-Right case — rotate left at ${node.val}`; }
      else if(bf > 1 && balanceFactor(node.left) < 0){ node.left = rotateLeft(node.left); newSubRoot = rotateRight(node); label = `Left-Right case — rotate left then right at ${node.val}`; }
      else if(bf < -1 && balanceFactor(node.right) > 0){ node.right = rotateRight(node.right); newSubRoot = rotateLeft(node); label = `Right-Left case — rotate right then left at ${node.val}`; }
      if(newSubRoot !== node){
        if(i===0){ root = newSubRoot; }
        else {
          const parent = path[i-1];
          if(parent.left===node) parent.left = newSubRoot; else parent.right = newSubRoot;
        }
        path[i] = newSubRoot;
        frames.push({tree:cloneTree(root), highlight:{rotated:newSubRoot.id}, note:`Unbalanced (${bf}) — ${label}`, pyLine:22});
      }
    }
  }
  frames.push({tree:cloneTree(root), note:"All values inserted — tree is height-balanced.", pyLine:25});
  return frames;
}

export { makeTreeNode, cloneTree, nodeHeight, updateHeight, balanceFactor, rotateRight, rotateLeft, buildSimpleBST, framesBSTBuild, framesBSTSearch, framesBSTDelete, framesTraversal, framesAVLInsert };
