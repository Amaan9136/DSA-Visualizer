/* ============================= THEME ============================= */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
themeToggle.onclick = () => {
  root.classList.toggle('dark');
  root.classList.toggle('light', !root.classList.contains('dark'));
};

/* ============================= ALGORITHM DEFINITIONS ============================= */
// Each algorithm produces an array of "frames". A frame:
// { array, compare:[i,j], swap:[i,j], sorted:[...idx], pivot:idx, note, pyLine }

function framesBubble(arr){
  const a=[...arr], frames=[], n=a.length, sortedIdx=[];
  frames.push({array:[...a], sorted:[...sortedIdx], note:"Initial array.", pyLine:1});
  for(let i=0;i<n-1;i++){
    let swapped=false;
    for(let j=0;j<n-i-1;j++){
      frames.push({array:[...a], compare:[j,j+1], sorted:[...sortedIdx], note:`Compare a[${j}] and a[${j+1}]`, pyLine:4});
      if(a[j]>a[j+1]){
        [a[j],a[j+1]]=[a[j+1],a[j]]; swapped=true;
        frames.push({array:[...a], swap:[j,j+1], sorted:[...sortedIdx], note:`Swap: a[${j}] > a[${j+1}]`, pyLine:5});
      }
    }
    sortedIdx.unshift(n-1-i);
    frames.push({array:[...a], sorted:[...sortedIdx], note:`Pass ${i+1} complete — largest remaining bubbled to position ${n-1-i}.`, pyLine:2});
    if(!swapped){ frames.push({array:[...a], sorted:a.map((_,k)=>k), note:"No swaps made — array is sorted early.", pyLine:6}); break; }
  }
  frames.push({array:[...a], sorted:a.map((_,k)=>k), note:"Sorted!", pyLine:6});
  return frames;
}

function framesSelection(arr){
  const a=[...arr], frames=[], n=a.length, sortedIdx=[];
  frames.push({array:[...a], sorted:[...sortedIdx], note:"Initial array.", pyLine:1});
  for(let i=0;i<n-1;i++){
    let minIdx=i;
    frames.push({array:[...a], compare:[i,minIdx], sorted:[...sortedIdx], note:`Assume a[${i}] is the minimum of the unsorted region.`, pyLine:3});
    for(let j=i+1;j<n;j++){
      frames.push({array:[...a], compare:[minIdx,j], sorted:[...sortedIdx], note:`Compare current min a[${minIdx}] with a[${j}]`, pyLine:5});
      if(a[j]<a[minIdx]){ minIdx=j;
        frames.push({array:[...a], compare:[minIdx,j], sorted:[...sortedIdx], note:`New minimum found at index ${minIdx}`, pyLine:6}); }
    }
    if(minIdx!==i){ [a[i],a[minIdx]]=[a[minIdx],a[i]];
      frames.push({array:[...a], swap:[i,minIdx], sorted:[...sortedIdx], note:`Swap a[${i}] with minimum a[${minIdx}]`, pyLine:8}); }
    sortedIdx.push(i);
    frames.push({array:[...a], sorted:[...sortedIdx], note:`Index ${i} is now finalized.`, pyLine:8});
  }
  frames.push({array:[...a], sorted:a.map((_,k)=>k), note:"Sorted!", pyLine:9});
  return frames;
}

function framesInsertion(arr){
  const a=[...arr], frames=[], n=a.length;
  frames.push({array:[...a], sorted:[0], note:"First element is trivially sorted.", pyLine:1});
  for(let i=1;i<n;i++){
    let key=a[i], j=i-1;
    frames.push({array:[...a], compare:[i], sorted:Array.from({length:i},(_,k)=>k), note:`Pick key = a[${i}] = ${key}`, pyLine:3});
    while(j>=0 && a[j]>key){
      a[j+1]=a[j];
      frames.push({array:[...a], compare:[j,j+1], note:`Shift a[${j}] right (it's greater than key ${key})`, pyLine:6});
      j--;
    }
    a[j+1]=key;
    frames.push({array:[...a], swap:[j+1], sorted:Array.from({length:i+1},(_,k)=>k), note:`Insert key ${key} at index ${j+1}`, pyLine:7});
  }
  frames.push({array:[...a], sorted:a.map((_,k)=>k), note:"Sorted!", pyLine:8});
  return frames;
}

function framesMerge(arr){
  const frames=[], a=[...arr];
  frames.push({array:[...a], note:"Initial array.", pyLine:1});
  function merge(lo,mid,hi){
    let left=a.slice(lo,mid+1), right=a.slice(mid+1,hi+1);
    let i=0,j=0,k=lo;
    frames.push({array:[...a], compare:[lo,hi], note:`Merging subarrays [${lo}..${mid}] and [${mid+1}..${hi}]`, pyLine:14});
    while(i<left.length && j<right.length){
      frames.push({array:[...a], compare:[k], note:`Compare ${left[i]} and ${right[j]}`, pyLine:16});
      if(left[i]<=right[j]){ a[k]=left[i]; i++; } else { a[k]=right[j]; j++; }
      frames.push({array:[...a], swap:[k], note:`Place ${a[k]} at index ${k}`, pyLine:19});
      k++;
    }
    while(i<left.length){ a[k]=left[i]; frames.push({array:[...a], swap:[k], note:`Copy remaining left element ${a[k]}`, pyLine:22}); i++; k++; }
    while(j<right.length){ a[k]=right[j]; frames.push({array:[...a], swap:[k], note:`Copy remaining right element ${a[k]}`, pyLine:24}); j++; k++; }
  }
  function sort(lo,hi){
    if(lo>=hi) return;
    const mid=Math.floor((lo+hi)/2);
    frames.push({array:[...a], compare:[lo,hi], note:`Split [${lo}..${hi}] at midpoint ${mid}`, pyLine:9});
    sort(lo,mid); sort(mid+1,hi); merge(lo,mid,hi);
  }
  sort(0,a.length-1);
  frames.push({array:[...a], sorted:a.map((_,k)=>k), note:"Sorted!", pyLine:26});
  return frames;
}

function framesQuick(arr){
  const frames=[], a=[...arr];
  frames.push({array:[...a], note:"Initial array.", pyLine:1});
  function partition(lo,hi){
    const pivot=a[hi];
    frames.push({array:[...a], pivot:hi, note:`Choose pivot = a[${hi}] = ${pivot}`, pyLine:4});
    let i=lo-1;
    for(let j=lo;j<hi;j++){
      frames.push({array:[...a], pivot:hi, compare:[j], note:`Compare a[${j}]=${a[j]} with pivot ${pivot}`, pyLine:7});
      if(a[j]<pivot){ i++; [a[i],a[j]]=[a[j],a[i]];
        frames.push({array:[...a], pivot:hi, swap:[i,j], note:`a[${j}] < pivot — swap into position ${i}`, pyLine:9}); }
    }
    [a[i+1],a[hi]]=[a[hi],a[i+1]];
    frames.push({array:[...a], swap:[i+1,hi], note:`Place pivot at its sorted position ${i+1}`, pyLine:11});
    return i+1;
  }
  function sort(lo,hi){
    if(lo<hi){ const p=partition(lo,hi); sort(lo,p-1); sort(p+1,hi); }
  }
  sort(0,a.length-1);
  frames.push({array:[...a], sorted:a.map((_,k)=>k), note:"Sorted!", pyLine:14});
  return frames;
}

function framesHeap(arr){
  const a=[...arr], frames=[], n=a.length, sortedIdx=[];
  frames.push({array:[...a], note:"Initial array.", pyLine:1});
  function heapify(size,i){
    let largest=i, l=2*i+1, r=2*i+2;
    frames.push({array:[...a], compare:[i], sorted:[...sortedIdx], note:`Heapify at index ${i}`, pyLine:5});
    if(l<size && a[l]>a[largest]) largest=l;
    if(r<size && a[r]>a[largest]) largest=r;
    if(largest!==i){
      [a[i],a[largest]]=[a[largest],a[i]];
      frames.push({array:[...a], swap:[i,largest], sorted:[...sortedIdx], note:`Swap a[${i}] with larger child a[${largest}]`, pyLine:9});
      heapify(size,largest);
    }
  }
  for(let i=Math.floor(n/2)-1;i>=0;i--) heapify(n,i);
  frames.push({array:[...a], sorted:[...sortedIdx], note:"Max-heap built.", pyLine:15});
  for(let i=n-1;i>0;i--){
    [a[0],a[i]]=[a[i],a[0]];
    sortedIdx.unshift(i);
    frames.push({array:[...a], swap:[0,i], sorted:[...sortedIdx], note:`Move max (root) to position ${i}`, pyLine:18});
    heapify(i,0);
  }
  frames.push({array:[...a], sorted:a.map((_,k)=>k), note:"Sorted!", pyLine:8});
  return frames;
}

/* ============================= SEARCHING ============================= */
// Searching frames use `target`, `found` idx, `range:[lo,hi]` for narrowing algorithms.

function framesLinearSearch(arr, target){
  const frames=[];
  frames.push({array:[...arr], note:`Searching for target = ${target}. Scan from the left, one element at a time.`, pyLine:1});
  for(let i=0;i<arr.length;i++){
    frames.push({array:[...arr], compare:[i], note:`Check index ${i}: is a[${i}]=${arr[i]} equal to ${target}?`, pyLine:3});
    if(arr[i]===target){
      frames.push({array:[...arr], found:[i], note:`Found ${target} at index ${i}!`, pyLine:4});
      return frames;
    }
  }
  frames.push({array:[...arr], note:`Target ${target} not found in the array.`, pyLine:6});
  return frames;
}

function framesBinarySearch(arrIn, target){
  const arr=[...arrIn].sort((a,b)=>a-b);
  const frames=[];
  frames.push({array:[...arr], note:`Array must be sorted first. Searching for target = ${target}.`, pyLine:1});
  let lo=0, hi=arr.length-1;
  while(lo<=hi){
    const mid=Math.floor((lo+hi)/2);
    frames.push({array:[...arr], range:[lo,hi], compare:[mid], note:`Range [${lo}..${hi}]. Check midpoint a[${mid}]=${arr[mid]}`, pyLine:5});
    if(arr[mid]===target){
      frames.push({array:[...arr], found:[mid], note:`Found ${target} at index ${mid}!`, pyLine:6});
      return frames;
    } else if(arr[mid]<target){
      frames.push({array:[...arr], range:[mid+1,hi], note:`a[${mid}]=${arr[mid]} < ${target} — search right half`, pyLine:8});
      lo=mid+1;
    } else {
      frames.push({array:[...arr], range:[lo,mid-1], note:`a[${mid}]=${arr[mid]} > ${target} — search left half`, pyLine:10});
      hi=mid-1;
    }
  }
  frames.push({array:[...arr], note:`Target ${target} not found — range is empty.`, pyLine:11});
  return frames;
}

function framesJumpSearch(arrIn, target){
  const arr=[...arrIn].sort((a,b)=>a-b);
  const frames=[]; const n=arr.length;
  const step=Math.max(1,Math.floor(Math.sqrt(n)));
  frames.push({array:[...arr], note:`Array sorted. Jump size = √n ≈ ${step}. Searching for ${target}.`, pyLine:1});
  let prev=0, curr=Math.min(step,n)-1;
  while(curr<n && arr[curr]<target){
    frames.push({array:[...arr], compare:[curr], note:`Block boundary a[${curr}]=${arr[curr]} < ${target} — jump to next block`, pyLine:5});
    prev=curr+1;
    curr=Math.min(curr+step,n-1);
    if(prev>=n){ frames.push({array:[...arr], note:`Passed end of array — target not present.`, pyLine:6}); return frames; }
  }
  frames.push({array:[...arr], range:[prev,curr], note:`Target may be in block [${prev}..${curr}] — linear scan this block`, pyLine:8});
  for(let i=prev;i<=curr && i<n;i++){
    frames.push({array:[...arr], compare:[i], range:[prev,curr], note:`Check a[${i}]=${arr[i]}`, pyLine:9});
    if(arr[i]===target){ frames.push({array:[...arr], found:[i], note:`Found ${target} at index ${i}!`, pyLine:10}); return frames; }
  }
  frames.push({array:[...arr], note:`Target ${target} not found.`, pyLine:12});
  return frames;
}

function framesExponentialSearch(arrIn, target){
  const arr=[...arrIn].sort((a,b)=>a-b);
  const frames=[]; const n=arr.length;
  frames.push({array:[...arr], note:`Array sorted. Find a range by doubling, then binary search inside it.`, pyLine:1});
  if(arr[0]===target){ frames.push({array:[...arr], found:[0], note:`Found ${target} at index 0!`, pyLine:2}); return frames; }
  let i=1;
  while(i<n && arr[i]<=target){
    frames.push({array:[...arr], compare:[i], note:`a[${i}]=${arr[i]} ≤ ${target} — double the bound`, pyLine:4});
    i*=2;
  }
  const lo=Math.floor(i/2), hi=Math.min(i,n-1);
  frames.push({array:[...arr], range:[lo,hi], note:`Range found: [${lo}..${hi}]. Binary search within it.`, pyLine:6});
  let l=lo,h=hi;
  while(l<=h){
    const mid=Math.floor((l+h)/2);
    frames.push({array:[...arr], range:[l,h], compare:[mid], note:`Binary search: check a[${mid}]=${arr[mid]}`, pyLine:7});
    if(arr[mid]===target){ frames.push({array:[...arr], found:[mid], note:`Found ${target} at index ${mid}!`, pyLine:7}); return frames; }
    else if(arr[mid]<target) l=mid+1; else h=mid-1;
  }
  frames.push({array:[...arr], note:`Target ${target} not found.`, pyLine:8});
  return frames;
}

/* ============================= ARRAYS ============================= */
function parseValAtPos(text){
  const parts = String(text).split('@');
  const val = parseInt(parts[0],10);
  const pos = parts.length>1 ? parseInt(parts[1],10) : 0;
  return [isNaN(val)?0:val, isNaN(pos)?0:pos];
}
// Array-technique frames reuse `array`, plus `pointers:{left,right}`, `window:[lo,hi]`, `prefixArr`.

function framesTwoPointer(arrIn, target){
  const a=[...arrIn].sort((x,y)=>x-y);
  const frames=[];
  frames.push({array:[...a], note:`Array sorted first. Find a pair summing to target = ${target} using two pointers.`, pyLine:2});
  let lo=0, hi=a.length-1;
  frames.push({array:[...a], pointers:{left:lo,right:hi}, note:`Initialize left=0, right=${hi} (last index)`, pyLine:3});
  while(lo<hi){
    const sum=a[lo]+a[hi];
    frames.push({array:[...a], pointers:{left:lo,right:hi}, note:`left=${lo} (${a[lo]}), right=${hi} (${a[hi]}) → sum=${sum}`, pyLine:5});
    if(sum===target){
      frames.push({array:[...a], pointers:{left:lo,right:hi}, found:[lo,hi], note:`sum ${sum} == target ${target} — pair found!`, pyLine:7});
      return frames;
    } else if(sum<target){
      frames.push({array:[...a], pointers:{left:lo,right:hi}, note:`sum ${sum} < target — move left pointer right`, pyLine:9});
      lo++;
    } else {
      frames.push({array:[...a], pointers:{left:lo,right:hi}, note:`sum ${sum} > target — move right pointer left`, pyLine:11});
      hi--;
    }
  }
  frames.push({array:[...a], note:`No pair sums to ${target}.`, pyLine:12});
  return frames;
}

function framesSlidingWindow(arr, k){
  const frames=[]; const n=arr.length;
  frames.push({array:[...arr], note:`Find the maximum sum of any contiguous subarray of size k=${k}.`, pyLine:1});
  if(k>n || k<=0){ frames.push({array:[...arr], note:`Invalid window size k=${k} for array length ${n}.`, pyLine:1}); return frames; }
  let windowSum=0;
  for(let i=0;i<k;i++) windowSum+=arr[i];
  let maxSum=windowSum, maxStart=0;
  frames.push({array:[...arr], window:[0,k-1], note:`Initial window [0..${k-1}] sum = ${windowSum}`, pyLine:3});
  for(let i=k;i<n;i++){
    windowSum += arr[i]-arr[i-k];
    frames.push({array:[...arr], window:[i-k+1,i], note:`Slide window to [${i-k+1}..${i}]: add a[${i}]=${arr[i]}, remove a[${i-k}]=${arr[i-k]} → sum=${windowSum}`, pyLine:6});
    if(windowSum>maxSum){
      maxSum=windowSum; maxStart=i-k+1;
      frames.push({array:[...arr], window:[i-k+1,i], note:`New maximum sum = ${maxSum}`, pyLine:8});
    }
  }
  frames.push({array:[...arr], window:[maxStart,maxStart+k-1], note:`Best window is [${maxStart}..${maxStart+k-1}] with sum = ${maxSum}`, pyLine:9});
  return frames;
}

function framesKadane(arr){
  const frames=[];
  frames.push({array:[...arr], note:`Find the maximum sum of any contiguous subarray (Kadane's algorithm).`, pyLine:1});
  let maxSoFar=arr[0], maxEndingHere=arr[0], start=0, end=0, tempStart=0;
  frames.push({array:[...arr], window:[0,0], note:`Initialize: max_so_far = max_ending_here = a[0] = ${arr[0]}`, pyLine:2});
  for(let i=1;i<arr.length;i++){
    if(arr[i]>maxEndingHere+arr[i]){
      maxEndingHere=arr[i]; tempStart=i;
      frames.push({array:[...arr], window:[tempStart,i], compare:[i], note:`a[${i}]=${arr[i]} alone is better than extending — start new subarray here`, pyLine:5});
    } else {
      maxEndingHere=maxEndingHere+arr[i];
      frames.push({array:[...arr], window:[tempStart,i], compare:[i], note:`Extend current subarray: max_ending_here = ${maxEndingHere}`, pyLine:7});
    }
    if(maxEndingHere>maxSoFar){
      maxSoFar=maxEndingHere; start=tempStart; end=i;
      frames.push({array:[...arr], window:[start,end], note:`New overall maximum = ${maxSoFar}`, pyLine:9});
    }
  }
  frames.push({array:[...arr], window:[start,end], note:`Maximum subarray sum = ${maxSoFar}, range [${start}..${end}]`, pyLine:10});
  return frames;
}

function framesPrefixSum(arr){
  const frames=[]; const n=arr.length;
  frames.push({array:[...arr], note:`Build a prefix sum array so range-sum queries become O(1).`, pyLine:2});
  const prefix=new Array(n+1).fill(0);
  frames.push({array:[...arr], prefixArr:[...prefix], note:`prefix[0] = 0 (empty prefix)`, pyLine:2});
  for(let i=0;i<n;i++){
    prefix[i+1]=prefix[i]+arr[i];
    frames.push({array:[...arr], prefixArr:[...prefix], compare:[i], note:`prefix[${i+1}] = prefix[${i}] + a[${i}] = ${prefix[i]} + ${arr[i]} = ${prefix[i+1]}`, pyLine:4});
  }
  frames.push({array:[...arr], prefixArr:[...prefix], note:`Prefix sums complete: [${prefix.join(', ')}]`, pyLine:5});
  return frames;
}

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

/* ============================= STACK ============================= */
// Stack frames use `stack` (array, top = last element), plus array-specific fields for NGE.

function framesBalancedParens(str){
  const frames=[]; const stack=[];
  const pairs={')':'(', ']':'[', '}':'{'};
  const opens=new Set(['(','[','{']);
  frames.push({stack:[...stack], note:`Check if "${str}" has balanced brackets using a stack.`, pyLine:2});
  let balanced=true;
  for(let i=0;i<str.length;i++){
    const ch=str[i];
    if(opens.has(ch)){
      stack.push(ch);
      frames.push({stack:[...stack], compare:i, note:`'${ch}' is an opening bracket — push onto stack`, pyLine:6});
    } else if(pairs[ch]){
      frames.push({stack:[...stack], compare:i, note:`'${ch}' is a closing bracket — check top of stack`, pyLine:7});
      if(stack.length===0 || stack[stack.length-1]!==pairs[ch]){
        balanced=false;
        frames.push({stack:[...stack], compare:i, mismatch:true, note:`Mismatch — expected '${pairs[ch]}' but stack ${stack.length===0?'is empty':`has '${stack[stack.length-1]}'`}`, pyLine:9});
        break;
      }
      stack.pop();
      frames.push({stack:[...stack], compare:i, note:`Matched '${pairs[ch]}${ch}' — pop from stack`, pyLine:10});
    }
  }
  if(balanced && stack.length>0){
    balanced=false;
    frames.push({stack:[...stack], note:`String fully scanned but stack not empty — unmatched opening brackets remain.`, pyLine:11});
  }
  frames.push({stack:[...stack], note: balanced ? `Balanced!` : `Not balanced.`, pyLine:11});
  return frames;
}

function framesNextGreaterElement(arr){
  const frames=[]; const n=arr.length;
  const result=new Array(n).fill(-1);
  const stack=[];
  frames.push({array:[...arr], stack:[...stack], note:`Find next greater element for each item using a monotonic stack.`, pyLine:4});
  for(let i=0;i<n;i++){
    frames.push({array:[...arr], stack:[...stack], compare:[i], note:`Process a[${i}]=${arr[i]}`, pyLine:5});
    while(stack.length && arr[stack[stack.length-1]]<arr[i]){
      const idx=stack.pop();
      result[idx]=arr[i];
      frames.push({array:[...arr], stack:[...stack], compare:[i], resolved:[idx], note:`a[${i}]=${arr[i]} > a[${idx}]=${arr[idx]} — pop; next greater of a[${idx}] is ${arr[i]}`, pyLine:8});
    }
    stack.push(i);
    frames.push({array:[...arr], stack:[...stack], compare:[i], note:`Push index ${i} onto stack`, pyLine:9});
  }
  frames.push({array:[...arr], stack:[...stack], note:`Remaining stack indices have no greater element — result: [${result.join(', ')}]`, pyLine:10});
  return frames;
}

/* ============================= QUEUE ============================= */
// Queue frames use `queue` (array, front = index 0) or `circBuf`+`front`+`size`+`capacity` for circular.

function parseOpsString(str){
  return str.split(',').map(s=>s.trim()).filter(Boolean).map(tok=>{
    if(/^[Ee]/.test(tok)) return {type:'enqueue', value:parseInt(tok.slice(1),10)||0};
    return {type:'dequeue'};
  });
}

function framesQueueFIFO(ops){
  const frames=[]; const queue=[];
  frames.push({queue:[...queue], note:`Simulate a FIFO queue: enqueue adds to the rear, dequeue removes from the front.`, pyLine:4});
  for(const op of ops){
    if(op.type==='enqueue'){
      queue.push(op.value);
      frames.push({queue:[...queue], highlight:{rear:queue.length-1}, note:`Enqueue ${op.value} — added to the rear`, pyLine:8});
    } else {
      if(queue.length===0){
        frames.push({queue:[...queue], note:`Dequeue attempted — queue is empty`, pyLine:10});
      } else {
        const v = queue.shift();
        frames.push({queue:[...queue], highlight:{dequeuedVal:v}, note:`Dequeue ${v} — removed from the front`, pyLine:10});
      }
    }
  }
  frames.push({queue:[...queue], note:`Final queue: [${queue.join(', ')}]`, pyLine:11});
  return frames;
}

function framesCircularQueue(capacity, ops){
  const frames=[];
  const buf=new Array(capacity).fill(null);
  let front=0, size=0;
  frames.push({circBuf:[...buf], front, size, capacity, note:`Circular queue with capacity ${capacity}.`, pyLine:3});
  for(const op of ops){
    if(op.type==='enqueue'){
      if(size===capacity){
        frames.push({circBuf:[...buf], front, size, capacity, note:`Enqueue ${op.value} failed — queue is full`, pyLine:10});
      } else {
        const rear=(front+size)%capacity;
        buf[rear]=op.value; size++;
        frames.push({circBuf:[...buf], front, size, capacity, highlight:{rear}, note:`Enqueue ${op.value} at slot ${rear} (rear = (front+size) % capacity)`, pyLine:13});
      }
    } else {
      if(size===0){
        frames.push({circBuf:[...buf], front, size, capacity, note:`Dequeue failed — queue is empty`, pyLine:18});
      } else {
        const v = buf[front];
        buf[front] = null;
        frames.push({circBuf:[...buf], front, size, capacity, highlight:{dequeuedVal:v, dequeuedSlot:front}, note:`Dequeue ${v} from slot ${front}`, pyLine:19});
        front = (front+1)%capacity; size--;
        frames.push({circBuf:[...buf], front, size, capacity, note:`Advance front to slot ${front} (wraps with modulo)`, pyLine:20});
      }
    }
  }
  const logicalOrder=[];
  for(let i=0;i<size;i++) logicalOrder.push(buf[(front+i)%capacity]);
  frames.push({circBuf:[...buf], front, size, capacity, note:`Final logical contents: [${logicalOrder.join(', ')}]`, pyLine:22});
  return frames;
}

/* ============================= HASH TABLE ============================= */
// Hash table frames use `buckets` (array of chains, each chain an array of {key,value}), `highlight`.

function hashFn(key, size){
  let h=0;
  const s=String(key);
  for(let i=0;i<s.length;i++) h = h + s.charCodeAt(i);
  return h % size;
}
function cloneBuckets(buckets){ return buckets.map(chain=>chain.map(e=>({key:e.key, value:e.value}))); }

function parseHashOpsString(str){
  return str.split(',').map(s=>s.trim()).filter(Boolean).map(tok=>{
    const parts = tok.split(':');
    const type = {I:'insert', S:'search', D:'delete'}[parts[0].toUpperCase()] || 'insert';
    if(type==='insert') return {type, key:parts[1]||'', value:parseInt(parts[2],10)||0};
    return {type, key:parts[1]||''};
  });
}

function framesHashTable(size, ops){
  const frames=[];
  const buckets = Array.from({length:size}, ()=>[]);
  frames.push({buckets:cloneBuckets(buckets), size, note:`Hash table with ${size} buckets, collisions resolved via chaining.`, pyLine:4});
  for(const op of ops){
    const idx = hashFn(op.key, size);
    if(op.type==='insert'){
      frames.push({buckets:cloneBuckets(buckets), size, highlight:{bucket:idx}, note:`hash("${op.key}") = ${idx}`, pyLine:10});
      const chain = buckets[idx];
      const existing = chain.find(e=>e.key===op.key);
      if(existing){
        existing.value = op.value;
        frames.push({buckets:cloneBuckets(buckets), size, highlight:{bucket:idx}, note:`Key "${op.key}" already in bucket ${idx} — update value to ${op.value}`, pyLine:13});
      } else {
        chain.push({key:op.key, value:op.value});
        frames.push({buckets:cloneBuckets(buckets), size, highlight:{bucket:idx, inserted:chain.length-1}, note:`Insert ("${op.key}", ${op.value}) into bucket ${idx}${chain.length>1?` — collision, appended to chain (length ${chain.length})`:''}`, pyLine:15});
      }
    } else if(op.type==='search'){
      frames.push({buckets:cloneBuckets(buckets), size, highlight:{bucket:idx}, note:`Search "${op.key}" — hash = ${idx}`, pyLine:18});
      const chain = buckets[idx];
      let found = null;
      for(let i=0;i<chain.length;i++){
        frames.push({buckets:cloneBuckets(buckets), size, highlight:{bucket:idx, compare:i}, note:`Check chain[${i}]: key "${chain[i].key}"`, pyLine:19});
        if(chain[i].key===op.key){ found = chain[i].value; break; }
      }
      frames.push({buckets:cloneBuckets(buckets), size, highlight:{bucket:idx, found:found!==null}, note: found!==null ? `Found "${op.key}" → ${found}` : `"${op.key}" not found`, pyLine:21});
    } else if(op.type==='delete'){
      frames.push({buckets:cloneBuckets(buckets), size, highlight:{bucket:idx}, note:`Delete "${op.key}" — hash = ${idx}`, pyLine:25});
      const chain = buckets[idx];
      const pos = chain.findIndex(e=>e.key===op.key);
      if(pos===-1){
        frames.push({buckets:cloneBuckets(buckets), size, highlight:{bucket:idx}, note:`"${op.key}" not found in bucket ${idx}`, pyLine:31});
      } else {
        chain.splice(pos,1);
        frames.push({buckets:cloneBuckets(buckets), size, highlight:{bucket:idx}, note:`Removed "${op.key}" from bucket ${idx}`, pyLine:30});
      }
    }
  }
  frames.push({buckets:cloneBuckets(buckets), size, note:`Operations complete.`, pyLine:31});
  return frames;
}

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
    g.appendChild(svgEl('circle',{cx:p.px,cy:p.py,r:19,fill,stroke:'var(--border)','stroke-width':1.5}));
    const t = svgEl('text',{x:p.px,y:p.py+4,'text-anchor':'middle','font-size':12,'font-family':'JetBrains Mono, monospace',fill:'#0b0d12','font-weight':700});
    t.textContent = node.val;
    g.appendChild(t);
    svg.appendChild(g);
    drawNodes(node.left); drawNodes(node.right);
  })(root);
}

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

/* ============================= GRAPH LAYOUT + RENDER ============================= */
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

/* ============================= LINKED LIST RENDER ============================= */
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

/* ============================= STACK RENDER ============================= */
function renderStackFrame(frame){
  const wrap = document.getElementById('canvasWrap');
  wrap.classList.remove('items-start'); wrap.classList.add('items-end');
  wrap.innerHTML = '';
  if(frame.array){
    const arr = frame.array;
    const max = Math.max(...arr, 1);
    const w = Math.min(52, 100/arr.length);
    const row = document.createElement('div');
    row.className = 'flex items-end justify-center gap-1 h-full w-full pb-16';
    arr.forEach((val,i)=>{
      const bar = document.createElement('div');
      let bg = 'linear-gradient(180deg,var(--accent2),var(--accent))';
      if(frame.compare && (Array.isArray(frame.compare)?frame.compare.includes(i):frame.compare===i)) bg = 'var(--warn)';
      if(frame.resolved && frame.resolved.includes(i)) bg = 'var(--good)';
      bar.className = 'bar rounded-t-md relative flex items-end justify-center';
      bar.style.cssText = `width:${w}%; max-width:52px; height:${(Math.abs(val)/max*70)}%; background:${bg};`;
      const label = document.createElement('span');
      label.className='font-mono text-[10px] pb-1'; label.style.color='#0b0d12'; label.textContent=val;
      bar.appendChild(label);
      row.appendChild(bar);
    });
    wrap.appendChild(row);
    const stackWrap = document.createElement('div');
    stackWrap.className = 'absolute right-4 bottom-4 flex flex-col-reverse gap-1 items-center';
    const stackLbl = document.createElement('div');
    stackLbl.className = 'text-[10px] font-mono mb-1'; stackLbl.style.color='var(--text-dim)'; stackLbl.textContent='stack (indices)';
    (frame.stack||[]).forEach(idx=>{
      const cell = document.createElement('div');
      cell.className = 'glass2 rounded px-2 py-1 font-mono text-[11px]';
      cell.style.cssText = 'border:1px solid var(--accent2); min-width:36px; text-align:center;';
      cell.textContent = idx;
      stackWrap.appendChild(cell);
    });
    stackWrap.appendChild(stackLbl);
    wrap.appendChild(stackWrap);
    return;
  }
  const col = document.createElement('div');
  col.className = 'flex flex-col-reverse gap-1.5 items-center justify-start h-full py-4';
  const stack = frame.stack||[];
  stack.forEach((ch,i)=>{
    const cell = document.createElement('div');
    let bg = 'var(--accent2)';
    if(frame.mismatch && i===stack.length-1) bg='var(--danger)';
    cell.className = 'rounded-md flex items-center justify-center font-mono font-bold text-[16px]';
    cell.style.cssText = `width:44px; height:38px; background:${bg}; color:#0b0d12;`;
    cell.textContent = ch;
    col.appendChild(cell);
  });
  if(stack.length===0){
    const empty = document.createElement('div');
    empty.className='text-[12px] font-mono'; empty.style.color='var(--text-dim)'; empty.textContent='(empty stack)';
    col.appendChild(empty);
  }
  const base = document.createElement('div');
  base.style.cssText = 'width:60px; height:3px; background:var(--border); border-radius:2px;';
  wrap.appendChild(col);
  wrap.appendChild(base);
}

/* ============================= QUEUE RENDER ============================= */
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
    cellWrap.appendChild(cell);
    const lbl = document.createElement('div');
    lbl.className = 'text-[10px] font-mono'; lbl.style.color='var(--text-dim)';
    lbl.textContent = i===0 ? 'front' : (i===queue.length-1 ? 'rear' : '');
    cellWrap.appendChild(lbl);
    row.appendChild(cellWrap);
  });
  wrap.appendChild(row);
}

/* ============================= HASH TABLE RENDER ============================= */
function renderHashTableFrame(frame){
  const wrap = document.getElementById('canvasWrap');
  wrap.classList.remove('items-end'); wrap.classList.add('items-start');
  wrap.innerHTML = '';
  const h = frame.highlight || {};
  const col = document.createElement('div');
  col.className = 'flex flex-col gap-1.5 w-full max-w-md mx-auto py-2 overflow-y-auto h-full';
  frame.buckets.forEach((chain,i)=>{
    const row = document.createElement('div');
    row.className = 'flex items-center gap-2';
    const idxLbl = document.createElement('div');
    idxLbl.className = 'font-mono text-[11px] w-6 text-right shrink-0';
    idxLbl.style.color = h.bucket===i ? 'var(--warn)' : 'var(--text-dim)';
    idxLbl.textContent = i;
    row.appendChild(idxLbl);
    const bucketBox = document.createElement('div');
    bucketBox.className = 'glass2 rounded-md flex items-center gap-1 px-2 py-1.5 flex-1 flex-wrap min-h-[34px]';
    bucketBox.style.cssText = h.bucket===i ? 'border:1.5px solid var(--warn)' : 'border:1px solid var(--border)';
    if(chain.length===0){
      const dash = document.createElement('span');
      dash.className='font-mono text-[11px]'; dash.style.color='var(--text-dim)'; dash.textContent='—';
      bucketBox.appendChild(dash);
    }
    chain.forEach((entry,j)=>{
      const pill = document.createElement('div');
      let bg = 'var(--panel)';
      if(h.bucket===i && h.compare===j) bg='var(--warn)';
      if(h.bucket===i && h.inserted===j) bg='var(--accent)';
      pill.className = 'rounded px-2 py-0.5 font-mono text-[11px]';
      pill.style.cssText = `background:${bg}; border:1px solid var(--border); color:${bg==='var(--panel)'?'var(--text)':'#0b0d12'};`;
      pill.textContent = `${entry.key}:${entry.value}`;
      bucketBox.appendChild(pill);
      if(j<chain.length-1){
        const arrow = document.createElement('span');
        arrow.className='font-mono text-[11px]'; arrow.style.color='var(--text-dim)'; arrow.textContent='→';
        bucketBox.appendChild(arrow);
      }
    });
    row.appendChild(bucketBox);
    col.appendChild(row);
  });
  wrap.appendChild(col);
}

/* ============================= PYTHON SOURCE (line-numbered logically) ============================= */
const PY = {
array_two_pointer:`def two_pointer_pair_sum(arr, target):
    arr = sorted(arr)
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return arr[left], arr[right]
        elif s < target:
            left += 1
        else:
            right -= 1
    return None`,

array_sliding_window:`def max_sum_subarray(arr, k):
    n = len(arr)
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, n):
        window_sum += arr[i] - arr[i - k]
        if window_sum > max_sum:
            max_sum = window_sum
    return max_sum`,

array_kadane:`def kadane(arr):
    max_so_far = max_ending_here = arr[0]
    for i in range(1, len(arr)):
        if arr[i] > max_ending_here + arr[i]:
            max_ending_here = arr[i]
        else:
            max_ending_here += arr[i]
        if max_ending_here > max_so_far:
            max_so_far = max_ending_here
    return max_so_far`,

array_prefix_sum:`def prefix_sums(arr):
    prefix = [0] * (len(arr) + 1)
    for i in range(len(arr)):
        prefix[i + 1] = prefix[i] + arr[i]
    return prefix`,

ll_insert:`class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def insert_at(head, val, pos):
    new_node = Node(val)
    if pos == 0:
        new_node.next = head
        return new_node
    curr = head
    for _ in range(pos - 1):
        curr = curr.next
    new_node.next = curr.next
    curr.next = new_node
    return head`,

ll_delete:`def delete_value(head, val):
    if head is None:
        return None
    if head.val == val:
        return head.next
    prev, curr = head, head.next
    while curr is not None:
        if curr.val == val:
            prev.next = curr.next
            return head
        prev, curr = curr, curr.next
    return head`,

ll_reverse:`def reverse_list(head):
    prev = None
    curr = head
    while curr is not None:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`,

ll_cycle:`def has_cycle(head):
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,

stack_balanced:`def is_balanced(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
    return len(stack) == 0`,

stack_next_greater:`def next_greater_elements(arr):
    n = len(arr)
    result = [-1] * n
    stack = []
    for i in range(n):
        while stack and arr[stack[-1]] < arr[i]:
            idx = stack.pop()
            result[idx] = arr[i]
        stack.append(i)
    return result`,

queue_fifo:`from collections import deque

def simulate_queue(ops):
    queue = deque()
    output = []
    for op, value in ops:
        if op == 'enqueue':
            queue.append(value)
        else:
            output.append(queue.popleft() if queue else None)
    return output`,

queue_circular:`class CircularQueue:
    def __init__(self, capacity):
        self.buf = [None] * capacity
        self.capacity = capacity
        self.front = 0
        self.size = 0

    def enqueue(self, val):
        if self.size == self.capacity:
            return False
        rear = (self.front + self.size) % self.capacity
        self.buf[rear] = val
        self.size += 1
        return True

    def dequeue(self):
        if self.size == 0:
            return None
        val = self.buf[self.front]
        self.front = (self.front + 1) % self.capacity
        self.size -= 1
        return val`,

hash_chaining:`class HashTable:
    def __init__(self, size):
        self.size = size
        self.buckets = [[] for _ in range(size)]

    def _hash(self, key):
        return sum(ord(c) for c in key) % self.size

    def insert(self, key, value):
        idx = self._hash(key)
        for entry in self.buckets[idx]:
            if entry[0] == key:
                entry[1] = value
                return
        self.buckets[idx].append([key, value])

    def search(self, key):
        idx = self._hash(key)
        for k, v in self.buckets[idx]:
            if k == key:
                return v
        return None

    def delete(self, key):
        idx = self._hash(key)
        chain = self.buckets[idx]
        for i, (k, v) in enumerate(chain):
            if k == key:
                del chain[i]
                return True
        return False`,

bubble:`def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr  # early-exit variant checks a 'swapped' flag`,

selection:`def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,

insertion:`def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,

merge:`def merge_sort(arr, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo >= hi:
        return arr
    mid = (lo + hi) // 2
    merge_sort(arr, lo, mid)
    merge_sort(arr, mid + 1, hi)
    merge(arr, lo, mid, hi)
    return arr

def merge(arr, lo, mid, hi):
    left, right = arr[lo:mid+1], arr[mid+1:hi+1]
    i = j = 0
    k = lo
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            arr[k] = left[i]; i += 1
        else:
            arr[k] = right[j]; j += 1
        k += 1
    while i < len(left):
        arr[k] = left[i]; i += 1; k += 1
    while j < len(right):
        arr[k] = right[j]; j += 1; k += 1
    return arr`,

quick:`def quick_sort(arr, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo < hi:
        p = partition(arr, lo, hi)
        quick_sort(arr, lo, p - 1)
        quick_sort(arr, p + 1, hi)
    return arr

def partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    return i + 1`,

heap:`def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr

def heapify(arr, size, i):
    largest, l, r = i, 2*i + 1, 2*i + 2
    if l < size and arr[l] > arr[largest]:
        largest = l
    if r < size and arr[r] > arr[largest]:
        largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, size, largest)`,

linear_search:`def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1  # not found`,

binary_search:`def binary_search(arr, target):
    # arr must be sorted
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1  # not found`,

jump_search:`import math

def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    curr = min(step, n) - 1
    while curr < n and arr[curr] < target:
        prev = curr + 1
        curr = min(curr + step, n - 1)
        if prev >= n:
            return -1
    for i in range(prev, min(curr + 1, n)):
        if arr[i] == target:
            return i
    return -1  # not found`,

bst_build:`class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if root is None:
        return Node(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    # equal values are ignored (no duplicates)
    return root

def build_bst(values):
    root = None
    for v in values:
        root = insert(root, v)
    return root`,

bst_search:`def search(root, target):
    current = root
    while current is not None:
        if target == current.val:
            return current
        elif target < current.val:
            current = current.left
        else:
            current = current.right
    return None  # not found`,

bst_delete:`def delete(root, val):
    if root is None:
        return None
    if val < root.val:
        root.left = delete(root.left, val)
    elif val > root.val:
        root.right = delete(root.right, val)
    else:
        # Case 1: leaf, Case 2: one child
        if root.left is None:
            return root.right
        if root.right is None:
            return root.left
        # Case 3: two children — replace with inorder successor
        succ = root.right
        while succ.left is not None:
            succ = succ.left
        root.val = succ.val
        root.right = delete(root.right, succ.val)
    return root`,

traverse_inorder:`def inorder(node, result=None):
    if result is None:
        result = []
    if node is not None:
        inorder(node.left, result)
        result.append(node.val)
        inorder(node.right, result)
    return result`,

traverse_preorder:`def preorder(node, result=None):
    if result is None:
        result = []
    if node is not None:
        result.append(node.val)
        preorder(node.left, result)
        preorder(node.right, result)
    return result`,

traverse_postorder:`def postorder(node, result=None):
    if result is None:
        result = []
    if node is not None:
        postorder(node.left, result)
        postorder(node.right, result)
        result.append(node.val)
    return result`,

traverse_levelorder:`from collections import deque

def level_order(root):
    if root is None:
        return []
    result = []
    queue = deque([root])
    while queue:
        node = queue.popleft()
        result.append(node.val)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return result`,

avl_insert:`class AVLNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.height = 1

def height(n):
    return n.height if n else 0

def balance_factor(n):
    return height(n.left) - height(n.right) if n else 0

def rotate_right(y):
    x = y.left
    y.left = x.right
    x.right = y
    y.height = 1 + max(height(y.left), height(y.right))
    x.height = 1 + max(height(x.left), height(x.right))
    return x

def rotate_left(x):
    y = x.right
    x.right = y.left
    y.left = x
    x.height = 1 + max(height(x.left), height(x.right))
    y.height = 1 + max(height(y.left), height(y.right))
    return y

def avl_insert(node, val):
    if node is None:
        return AVLNode(val)
    if val < node.val:
        node.left = avl_insert(node.left, val)
    elif val > node.val:
        node.right = avl_insert(node.right, val)
    else:
        return node  # no duplicates

    node.height = 1 + max(height(node.left), height(node.right))
    bf = balance_factor(node)

    if bf > 1 and balance_factor(node.left) >= 0:      # Left-Left
        return rotate_right(node)
    if bf < -1 and balance_factor(node.right) <= 0:    # Right-Right
        return rotate_left(node)
    if bf > 1 and balance_factor(node.left) < 0:       # Left-Right
        node.left = rotate_left(node.left)
        return rotate_right(node)
    if bf < -1 and balance_factor(node.right) > 0:     # Right-Left
        node.right = rotate_right(node.right)
        return rotate_left(node)
    return node`,

bfs:`from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order`,

dfs:`def dfs(graph, start, visited=None, order=None):
    if visited is None:
        visited, order = set(), []
    visited.add(start)
    order.append(start)
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited, order)
    return order`,

dijkstra:`import heapq

def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    visited = set()
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if u in visited:
            continue
        visited.add(u)
        for v, weight in graph[u]:
            candidate = d + weight
            if candidate < dist[v]:
                dist[v] = candidate
                heapq.heappush(pq, (candidate, v))
    return dist`,

kruskal:`class DisjointSet:
    def __init__(self, nodes):
        self.parent = {n: n for n in nodes}

    def find(self, x):
        while self.parent[x] != x:
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        self.parent[ra] = rb
        return True

def kruskal(nodes, edges):
    # edges: list of (weight, u, v)
    dsu = DisjointSet(nodes)
    mst, total = [], 0
    for weight, u, v in sorted(edges):
        if dsu.union(u, v):
            mst.append((u, v, weight))
            total += weight
    return mst, total`,

exponential_search:`def exponential_search(arr, target):
    n = len(arr)
    if arr[0] == target:
        return 0
    i = 1
    while i < n and arr[i] <= target:
        i *= 2
    lo, hi = i // 2, min(i, n - 1)
    return binary_search_range(arr, target, lo, hi)

def binary_search_range(arr, target, lo, hi):
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1  # not found`
};

/* ============================= ALGORITHM CATALOG ============================= */
const CATALOG = {
  array_two_pointer:{ name:"Two-Pointer Technique", cat:"Arrays", needsTarget:true, targetLabel:"Pair sum target:", targetButtonLabel:"Find Pair",
    frames:(arr,target)=>framesTwoPointer(arr,target),
    explain:"Uses two indices moving toward each other from opposite ends of a sorted array. If the sum at the two pointers is too small, move the left pointer right to increase it; if too large, move the right pointer left to decrease it. This finds a target pair in linear time without nested loops, since each step eliminates at least one candidate.",
    pseudo:`arr = sorted(arr)
left, right = 0, n-1
while left < right:
  sum = a[left] + a[right]
  if sum == target: return (a[left], a[right])
  elif sum < target: left += 1
  else: right -= 1`,
    complexity:{best:"O(n) — after the O(n log n) sort",avg:"O(n log n) — dominated by sorting",worst:"O(n log n)",space:"O(1) — excluding sort",stable:"—"}},

  array_sliding_window:{ name:"Sliding Window — Max Sum Subarray", cat:"Arrays", needsTarget:true, targetLabel:"Window size k:", targetButtonLabel:"Run", defaultTarget:3,
    frames:(arr,k)=>framesSlidingWindow(arr,k),
    explain:"Maintains a running sum over a fixed-size window and slides it one position at a time: add the incoming element, subtract the outgoing one. Avoids recomputing the whole window sum from scratch each time, turning an O(n·k) brute force into O(n).",
    pseudo:`window_sum = sum(a[0:k])
max_sum = window_sum
for i in k..n-1:
  window_sum += a[i] - a[i-k]
  max_sum = max(max_sum, window_sum)`,
    complexity:{best:"O(n)",avg:"O(n)",worst:"O(n)",space:"O(1)",stable:"—"}},

  array_kadane:{ name:"Kadane's Algorithm", cat:"Arrays", frames:(arr)=>framesKadane(arr),
    explain:"Finds the maximum-sum contiguous subarray in one pass. At each position it decides whether to extend the current subarray or start a new one from here — extending only makes sense if the running sum is still positive. Tracks the best sum seen so far separately from the current running sum.",
    pseudo:`max_so_far = max_ending_here = a[0]
for i in 1..n-1:
  max_ending_here = max(a[i], max_ending_here + a[i])
  max_so_far = max(max_so_far, max_ending_here)`,
    complexity:{best:"O(n)",avg:"O(n)",worst:"O(n)",space:"O(1)",stable:"—"}},

  array_prefix_sum:{ name:"Prefix Sums", cat:"Arrays", frames:(arr)=>framesPrefixSum(arr),
    explain:"Precomputes a running total so that the sum of any subarray [i..j] can be answered in O(1) as prefix[j+1] - prefix[i], instead of re-summing the range each time. A simple but powerful preprocessing trick used throughout range-query problems.",
    pseudo:`prefix[0] = 0
for i in 0..n-1:
  prefix[i+1] = prefix[i] + a[i]
# sum(i..j) = prefix[j+1] - prefix[i]`,
    complexity:{best:"O(n) — build",avg:"O(n) — build, O(1) per query",worst:"O(n)",space:"O(n)",stable:"—"}},

  ll_insert:{ name:"Linked List — Insert", cat:"Linked Lists", renderMode:"linkedlist", needsText:true, textLabel:"value@position (e.g. 7@2):", textDefault:"7@2", textButtonLabel:"Insert",
    frames:(arr,text)=>{ const [v,p]=parseValAtPos(text); return framesLLInsert(arr,v,p); },
    explain:"Inserting into a singly-linked list means creating a new node and re-pointing links around it — no shifting of other elements is needed, unlike an array. Inserting at the head is O(1). Inserting elsewhere requires first walking to the node just before the target position, then splicing the new node in.",
    pseudo:`insert_at(head, val, pos):
  new_node = Node(val)
  if pos == 0: new_node.next = head; return new_node
  curr = head
  for _ in range(pos-1): curr = curr.next
  new_node.next = curr.next
  curr.next = new_node
  return head`,
    complexity:{best:"O(1) — insert at head",avg:"O(n)",worst:"O(n) — insert at tail",space:"O(1)",stable:"—"}},

  ll_delete:{ name:"Linked List — Delete", cat:"Linked Lists", renderMode:"linkedlist", needsTarget:true, targetLabel:"Delete value:", targetButtonLabel:"Delete",
    frames:(arr,target)=>framesLLDelete(arr,target),
    explain:"Deleting a value means finding the node that holds it and re-pointing the previous node's `next` to skip over it — the deleted node is simply left unreferenced. Deleting the head is a special case (no predecessor to update). Requires a linear scan since there's no direct indexing into a linked list.",
    pseudo:`delete_value(head, val):
  if head.val == val: return head.next
  prev, curr = head, head.next
  while curr:
    if curr.val == val:
      prev.next = curr.next; return head
    prev, curr = curr, curr.next
  return head`,
    complexity:{best:"O(1) — value is at head",avg:"O(n)",worst:"O(n) — value at tail or absent",space:"O(1)",stable:"—"}},

  ll_reverse:{ name:"Linked List — Reverse", cat:"Linked Lists", renderMode:"linkedlist", frames:(arr)=>framesLLReverse(arr),
    explain:"Reverses the direction of every `next` pointer in a single pass using three tracking variables: the previous node, the current node, and a saved reference to the next node (saved before the link is overwritten). After the loop, what was the tail is now the head.",
    pseudo:`reverse(head):
  prev = None; curr = head
  while curr:
    next_node = curr.next
    curr.next = prev
    prev = curr; curr = next_node
  return prev  # new head`,
    complexity:{best:"O(n)",avg:"O(n)",worst:"O(n)",space:"O(1) — iterative",stable:"—"}},

  ll_cycle:{ name:"Linked List — Cycle Detection (Floyd's)", cat:"Linked Lists", renderMode:"linkedlist", needsTarget:true, targetLabel:"Cycle back to index (-1 = none):", targetButtonLabel:"Detect",
    frames:(arr,target)=>framesLLCycleDetect(arr,target),
    explain:"Floyd's Tortoise and Hare uses two pointers moving at different speeds: slow advances one node per step, fast advances two. If there's a cycle, fast eventually laps slow and they meet at the same node — like two runners on a circular track. If fast reaches the end (null), there's no cycle. Uses O(1) extra space, unlike a hash-set approach.",
    pseudo:`has_cycle(head):
  slow = fast = head
  while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow is fast: return True
  return False`,
    complexity:{best:"O(1) — cycle immediately at head",avg:"O(n)",worst:"O(n)",space:"O(1)",stable:"—"}},

  stack_balanced:{ name:"Stack — Balanced Parentheses", cat:"Stack", renderMode:"stack", needsText:true, textLabel:"Bracket string:", textDefault:"{[()]}", textButtonLabel:"Check",
    frames:(arr,text)=>framesBalancedParens(text),
    explain:"Scans the string left to right: every opening bracket is pushed onto a stack, and every closing bracket must match the type on top of the stack (which is then popped). Any mismatch, or leftover brackets at the end, means the string is unbalanced. The stack's last-in-first-out order naturally mirrors how nested brackets must close in reverse order of opening.",
    pseudo:`is_balanced(s):
  stack = []
  for ch in s:
    if ch is opening: stack.push(ch)
    elif ch is closing:
      if stack empty or stack.top != matching_open(ch): return False
      stack.pop()
  return stack is empty`,
    complexity:{best:"O(n)",avg:"O(n)",worst:"O(n)",space:"O(n) — worst case all opening brackets",stable:"—"}},

  stack_next_greater:{ name:"Stack — Next Greater Element", cat:"Stack", renderMode:"stack", frames:(arr)=>framesNextGreaterElement(arr),
    explain:"A monotonic stack keeps indices whose next-greater value hasn't been found yet, always in decreasing order of value from bottom to top. When a new element is bigger than the value at the top index, that's the answer for it — pop and record, then repeat until the stack's top is bigger (or empty). Every index is pushed and popped at most once, giving O(n) total despite the nested-looking while loop.",
    pseudo:`next_greater(arr):
  result = [-1] * n
  stack = []  # indices, decreasing values
  for i in 0..n-1:
    while stack not empty and a[stack.top] < a[i]:
      idx = stack.pop(); result[idx] = a[i]
    stack.push(i)
  return result`,
    complexity:{best:"O(n)",avg:"O(n)",worst:"O(n) — amortized, each index pushed/popped once",space:"O(n)",stable:"—"}},

  queue_fifo:{ name:"Queue — FIFO Enqueue/Dequeue", cat:"Queue", renderMode:"queue", needsText:true, textLabel:"Ops (E5,E3,D,E9,...):", textDefault:"E5,E3,D,E9,E2", textButtonLabel:"Run",
    frames:(arr,text)=>framesQueueFIFO(parseOpsString(text)),
    explain:"A queue processes items First-In-First-Out: new items join at the rear (enqueue), and the next item to leave is always the one that's been waiting longest, removed from the front (dequeue). This models real-world queues — the first person in line is the first one served.",
    pseudo:`enqueue(queue, val): queue.push_back(val)
dequeue(queue):
  if queue empty: return None
  return queue.pop_front()`,
    complexity:{best:"O(1) — per operation",avg:"O(1)",worst:"O(1)",space:"O(n)",stable:"—"}},

  queue_circular:{ name:"Queue — Circular Queue", cat:"Queue", renderMode:"queue", needsText:true, textLabel:"Ops, capacity 4 (E5,E3,D,E9,...):", textDefault:"E5,E3,D,E9,E2,E4",
    frames:(arr,text)=>framesCircularQueue(4, parseOpsString(text)),
    explain:"A circular queue reuses a fixed-size buffer by wrapping indices around with the modulo operator, avoiding the need to shift elements or grow the array like a naive queue would. `front` and `rear` chase each other around the buffer; the queue is full when size equals capacity, and empty when size is zero — both checked explicitly since front alone can't distinguish full from empty.",
    pseudo:`enqueue(val):
  if size == capacity: return False  # full
  rear = (front + size) % capacity
  buf[rear] = val; size += 1
dequeue():
  if size == 0: return None  # empty
  val = buf[front]
  front = (front + 1) % capacity; size -= 1
  return val`,
    complexity:{best:"O(1)",avg:"O(1)",worst:"O(1)",space:"O(capacity) — fixed-size buffer",stable:"—"}},

  hash_chaining:{ name:"Hash Table — Insert/Search/Delete (Chaining)", cat:"Hash Tables", renderMode:"hashtable", needsText:true, textLabel:"Ops (I:key:val, S:key, D:key):", textDefault:"I:cat:5,I:dog:3,I:bat:9,S:cat,D:dog",
    frames:(arr,text)=>framesHashTable(5, parseHashOpsString(text)),
    explain:"A hash table maps keys to array indices ('buckets') via a hash function, giving average O(1) access. When two different keys hash to the same bucket — a collision — chaining resolves it by storing a small list at that bucket instead of a single slot. Insert, search, and delete all hash the key once, then scan the (usually short) chain at that bucket for a match.",
    pseudo:`hash(key): sum(ord(c) for c in key) % table_size

insert(key, val):
  idx = hash(key)
  if key already in buckets[idx]: update it
  else: buckets[idx].append((key, val))

search(key):
  idx = hash(key)
  scan buckets[idx] for key, return its value or None

delete(key):
  idx = hash(key)
  remove (key, val) from buckets[idx] if present`,
    complexity:{best:"O(1) — no collision",avg:"O(1) — with a good hash function",worst:"O(n) — all keys collide into one bucket",space:"O(n)",stable:"—"}},

  bubble:{ name:"Bubble Sort", cat:"Sorting", frames:framesBubble,
    explain:"Repeatedly steps through the array, comparing adjacent elements and swapping them if they're in the wrong order. Each full pass 'bubbles' the largest remaining value to its final position at the end of the unsorted region. Simple to reason about, but quadratic — mostly useful for teaching and for nearly-sorted data.",
    pseudo:`for i in 0..n-1:
  for j in 0..n-i-2:
    if a[j] > a[j+1]:
      swap(a[j], a[j+1])`,
    complexity:{best:"O(n) — already sorted, with early exit",avg:"O(n²)",worst:"O(n²)",space:"O(1)",stable:"Yes"}},

  selection:{ name:"Selection Sort", cat:"Sorting", frames:framesSelection,
    explain:"Divides the array into a sorted and an unsorted region. On each pass it scans the unsorted region to find the minimum element and swaps it into place at the front of that region. It always does exactly n passes regardless of input order, making at most n swaps — useful when writes are expensive.",
    pseudo:`for i in 0..n-2:
  min_idx = i
  for j in i+1..n-1:
    if a[j] < a[min_idx]: min_idx = j
  swap(a[i], a[min_idx])`,
    complexity:{best:"O(n²)",avg:"O(n²)",worst:"O(n²)",space:"O(1)",stable:"No"}},

  insertion:{ name:"Insertion Sort", cat:"Sorting", frames:framesInsertion,
    explain:"Builds the sorted array one element at a time, similar to sorting a hand of playing cards: it takes the next element (the 'key') and shifts every larger element in the sorted prefix one step right until it finds the key's correct slot. Excellent for small or nearly-sorted arrays, and used as the base case inside hybrid sorts like Timsort.",
    pseudo:`for i in 1..n-1:
  key = a[i]; j = i-1
  while j >= 0 and a[j] > key:
    a[j+1] = a[j]; j -= 1
  a[j+1] = key`,
    complexity:{best:"O(n) — already sorted",avg:"O(n²)",worst:"O(n²)",space:"O(1)",stable:"Yes"}},

  merge:{ name:"Merge Sort", cat:"Sorting", frames:framesMerge,
    explain:"A divide-and-conquer algorithm: it recursively splits the array in half until each piece has one element, then merges pairs of sorted pieces back together in sorted order. Guarantees O(n log n) in every case, at the cost of O(n) extra space for the merge buffers.",
    pseudo:`merge_sort(a, lo, hi):
  if lo >= hi: return
  mid = (lo+hi)/2
  merge_sort(a, lo, mid)
  merge_sort(a, mid+1, hi)
  merge(a, lo, mid, hi)`,
    complexity:{best:"O(n log n)",avg:"O(n log n)",worst:"O(n log n)",space:"O(n)",stable:"Yes"}},

  quick:{ name:"Quick Sort", cat:"Sorting", frames:framesQuick,
    explain:"Also divide-and-conquer, but does the hard work during the split: it picks a pivot, partitions the array so everything smaller comes before it and everything larger after, then recurses on each side. In-place and typically the fastest general-purpose sort in practice, though a poor pivot choice degrades it to O(n²).",
    pseudo:`quick_sort(a, lo, hi):
  if lo < hi:
    p = partition(a, lo, hi)
    quick_sort(a, lo, p-1)
    quick_sort(a, p+1, hi)`,
    complexity:{best:"O(n log n)",avg:"O(n log n)",worst:"O(n²) — poor pivot choices",space:"O(log n)",stable:"No"}},

  heap:{ name:"Heap Sort", cat:"Sorting", frames:framesHeap,
    explain:"First rearranges the array into a max-heap (a binary tree where every parent is ≥ its children), then repeatedly swaps the root — the current maximum — to the end and re-heapifies the shrinking remainder. In-place with guaranteed O(n log n) worst case, though usually slower in practice than quicksort due to cache behavior.",
    pseudo:`build max-heap from a
for i in n-1..1:
  swap(a[0], a[i])
  heapify(a, i, 0)`,
    complexity:{best:"O(n log n)",avg:"O(n log n)",worst:"O(n log n)",space:"O(1)",stable:"No"}},

  linear_search:{ name:"Linear Search", cat:"Searching", needsTarget:true, frames:(arr,target)=>framesLinearSearch(arr,target),
    explain:"Checks every element in order until it finds the target or reaches the end. Makes no assumptions about the data — works on unsorted arrays — but in the worst case has to look at everything.",
    pseudo:`for i in 0..n-1:
  if a[i] == target:
    return i
return -1`,
    complexity:{best:"O(1) — target is first",avg:"O(n)",worst:"O(n)",space:"O(1)",stable:"—"}},

  binary_search:{ name:"Binary Search", cat:"Searching", needsTarget:true, frames:(arr,target)=>framesBinarySearch(arr,target),
    explain:"Requires a sorted array. Repeatedly checks the middle element of the current range: if it matches, done; if the target is smaller, discard the right half; if larger, discard the left half. Halving the search space each step gives logarithmic time.",
    pseudo:`lo, hi = 0, n-1
while lo <= hi:
  mid = (lo+hi)/2
  if a[mid] == target: return mid
  elif a[mid] < target: lo = mid+1
  else: hi = mid-1
return -1`,
    complexity:{best:"O(1) — target is the midpoint",avg:"O(log n)",worst:"O(log n)",space:"O(1)",stable:"—"}},

  jump_search:{ name:"Jump Search", cat:"Searching", needsTarget:true, frames:(arr,target)=>framesJumpSearch(arr,target),
    explain:"Requires a sorted array. Jumps ahead in fixed-size blocks of √n until it finds a block that could contain the target, then does a linear scan inside just that block. A middle ground between linear and binary search, useful when jumping backward is costly (e.g. slow disk seeks).",
    pseudo:`step = sqrt(n)
while a[min(step,n)-1] < target:
  jump forward by step
linear scan the identified block`,
    complexity:{best:"O(1)",avg:"O(√n)",worst:"O(√n)",space:"O(1)",stable:"—"}},

  exponential_search:{ name:"Exponential Search", cat:"Searching", needsTarget:true, frames:(arr,target)=>framesExponentialSearch(arr,target),
    explain:"Requires a sorted array. Starts at index 1 and doubles the bound (1, 2, 4, 8…) until it finds a range that must contain the target, then runs binary search inside just that range. Particularly good for unbounded or very large sorted lists where the target is likely near the start.",
    pseudo:`i = 1
while a[i] <= target: i *= 2
binary_search(a, target, i/2, min(i,n-1))`,
    complexity:{best:"O(1)",avg:"O(log n)",worst:"O(log n)",space:"O(1)",stable:"—"}},

  bst_build:{ name:"BST — Build (Insert)", cat:"Trees", renderMode:"tree", frames:(arr)=>framesBSTBuild(arr),
    explain:"A Binary Search Tree keeps every node's left subtree smaller and right subtree larger. Inserting a new value means walking down from the root, going left or right based on comparisons, until an empty spot is found. No rebalancing is done, so a BST built from already-sorted input degenerates into a straight line (O(n) operations) — this is exactly the problem AVL and Red-Black trees solve.",
    pseudo:`insert(root, val):
  if root is empty: return new Node(val)
  if val < root.val: root.left = insert(root.left, val)
  elif val > root.val: root.right = insert(root.right, val)
  return root`,
    complexity:{best:"O(log n) — balanced tree",avg:"O(log n)",worst:"O(n) — degenerate/skewed tree",space:"O(n)",stable:"—"}},

  bst_search:{ name:"BST — Search", cat:"Trees", renderMode:"tree", needsTarget:true, targetLabel:"Search for:", targetButtonLabel:"Search",
    frames:(arr,target)=>framesBSTSearch(arr,target),
    explain:"Starting at the root, compare the target to the current node: equal means found, smaller means go left, larger means go right. Each comparison eliminates an entire subtree, so search is fast on a balanced tree — but only as fast as the tree's height, which is why keeping trees balanced matters.",
    pseudo:`search(root, target):
  while root is not empty:
    if target == root.val: return root
    elif target < root.val: root = root.left
    else: root = root.right
  return not found`,
    complexity:{best:"O(1) — target is the root",avg:"O(log n)",worst:"O(n) — degenerate tree",space:"O(1)",stable:"—"}},

  bst_delete:{ name:"BST — Delete", cat:"Trees", renderMode:"tree", needsTarget:true, targetLabel:"Delete value:", targetButtonLabel:"Delete",
    frames:(arr,target)=>framesBSTDelete(arr,target),
    explain:"Deletion has three cases. A leaf is simply removed. A node with one child is replaced by that child. A node with two children is trickier: it's replaced by its inorder successor (the smallest value in its right subtree), and then that successor is deleted from its original spot — which is always a simpler case (it has at most one child).",
    pseudo:`delete(root, val):
  if val < root.val: root.left = delete(root.left, val)
  elif val > root.val: root.right = delete(root.right, val)
  else:
    if root has ≤1 child: return that child (or None)
    succ = min(root.right)
    root.val = succ.val
    root.right = delete(root.right, succ.val)
  return root`,
    complexity:{best:"O(log n) — balanced tree",avg:"O(log n)",worst:"O(n) — degenerate tree",space:"O(1)",stable:"—"}},

  traverse_inorder:{ name:"Traversal — Inorder", cat:"Trees", renderMode:"tree", frames:(arr)=>framesTraversal(arr,'inorder'),
    explain:"Visits left subtree, then the current node, then right subtree. On a BST this visits every value in ascending sorted order — a direct consequence of the BST ordering property.",
    pseudo:`inorder(node):
  if node: inorder(node.left); visit(node); inorder(node.right)`,
    complexity:{best:"O(n)",avg:"O(n)",worst:"O(n)",space:"O(h) — recursion stack, h = height",stable:"—"}},

  traverse_preorder:{ name:"Traversal — Preorder", cat:"Trees", renderMode:"tree", frames:(arr)=>framesTraversal(arr,'preorder'),
    explain:"Visits the current node before its children (node, then left, then right). Useful for copying a tree or producing a prefix-style serialization that can rebuild the exact same tree shape.",
    pseudo:`preorder(node):
  if node: visit(node); preorder(node.left); preorder(node.right)`,
    complexity:{best:"O(n)",avg:"O(n)",worst:"O(n)",space:"O(h)",stable:"—"}},

  traverse_postorder:{ name:"Traversal — Postorder", cat:"Trees", renderMode:"tree", frames:(arr)=>framesTraversal(arr,'postorder'),
    explain:"Visits both children before the current node (left, then right, then node). Useful when children must be processed before their parent — for example, deleting a tree from the leaves up, or evaluating an expression tree.",
    pseudo:`postorder(node):
  if node: postorder(node.left); postorder(node.right); visit(node)`,
    complexity:{best:"O(n)",avg:"O(n)",worst:"O(n)",space:"O(h)",stable:"—"}},

  traverse_levelorder:{ name:"Traversal — Level Order (BFS)", cat:"Trees", renderMode:"tree", frames:(arr)=>framesTraversal(arr,'levelorder'),
    explain:"Visits nodes level by level, top to bottom, using a queue rather than recursion: dequeue a node, visit it, enqueue its children. This is breadth-first search applied to a tree, and it's the natural way to process a tree 'row by row'.",
    pseudo:`level_order(root):
  queue = [root]
  while queue not empty:
    node = queue.pop_front()
    visit(node)
    queue.push_back(node.left, node.right if present)`,
    complexity:{best:"O(n)",avg:"O(n)",worst:"O(n)",space:"O(n) — widest level of the tree",stable:"—"}},

  avl_insert:{ name:"AVL Tree — Insert", cat:"Trees", renderMode:"tree", frames:(arr)=>framesAVLInsert(arr),
    explain:"A self-balancing BST: after every insertion, it walks back up from the new leaf to the root, and at each ancestor checks the balance factor (left height − right height). If it exceeds ±1, one of four rotations (LL, RR, LR, RL) restores balance. This guarantees O(log n) height at all times, unlike a plain BST which can degenerate into a line.",
    pseudo:`insert(node, val):
  ... standard BST insert ...
  update height(node)
  bf = balance_factor(node)
  if bf > 1 and val < node.left.val: return rotate_right(node)      # LL
  if bf < -1 and val > node.right.val: return rotate_left(node)     # RR
  if bf > 1 and val > node.left.val: node.left = rotate_left(node.left); return rotate_right(node)   # LR
  if bf < -1 and val < node.right.val: node.right = rotate_right(node.right); return rotate_left(node) # RL
  return node`,
    complexity:{best:"O(log n)",avg:"O(log n)",worst:"O(log n) — height always balanced",space:"O(log n) — recursion stack",stable:"—"}},

  bfs:{ name:"Graph — BFS", cat:"Graphs", renderMode:"graph", usesGraph:true, needsStartNode:true, frames:(graph,start)=>framesBFS(graph,start),
    explain:"Breadth-First Search explores a graph one 'layer' at a time: visit the start node, then all its direct neighbors, then all of their unvisited neighbors, and so on — using a queue to keep the order first-in-first-out. This guarantees the shortest path (by edge count) from the start node to every reachable node in an unweighted graph.",
    pseudo:`bfs(graph, start):
  visited = {start}; queue = [start]
  while queue not empty:
    node = queue.pop_front()
    for neighbor in graph[node]:
      if neighbor not in visited:
        visited.add(neighbor); queue.push_back(neighbor)`,
    complexity:{best:"O(V+E)",avg:"O(V+E)",worst:"O(V+E)",space:"O(V)",stable:"—"}},

  dfs:{ name:"Graph — DFS", cat:"Graphs", renderMode:"graph", usesGraph:true, needsStartNode:true, frames:(graph,start)=>framesDFS(graph,start),
    explain:"Depth-First Search dives as deep as possible down one path before backtracking: visit a node, then recurse into an unvisited neighbor, and only return to try other neighbors once that branch is fully explored. Natural for tasks like cycle detection, topological sorting, and exploring maze-like structures.",
    pseudo:`dfs(graph, node, visited):
  visited.add(node)
  for neighbor in graph[node]:
    if neighbor not in visited:
      dfs(graph, neighbor, visited)`,
    complexity:{best:"O(V+E)",avg:"O(V+E)",worst:"O(V+E)",space:"O(V) — recursion stack",stable:"—"}},

  dijkstra:{ name:"Dijkstra's Shortest Path", cat:"Graphs", renderMode:"graph", usesGraph:true, needsStartNode:true, frames:(graph,start)=>framesDijkstra(graph,start),
    explain:"Finds the shortest-distance path from a start node to every other node in a graph with non-negative edge weights. It repeatedly picks the unvisited node with the smallest known distance, 'relaxes' each of its edges (checks whether going through it gives a shorter path to the neighbor), and marks it visited. Once a node is visited its distance is final.",
    pseudo:`dijkstra(graph, start):
  dist[start] = 0; others = ∞
  while unvisited nodes remain:
    u = unvisited node with smallest dist
    mark u visited
    for (v, weight) in graph[u]:
      if dist[u]+weight < dist[v]: dist[v] = dist[u]+weight`,
    complexity:{best:"O((V+E) log V) — with a min-heap",avg:"O((V+E) log V)",worst:"O((V+E) log V)",space:"O(V)",stable:"—"}},

  kruskal:{ name:"Kruskal's MST", cat:"Graphs", renderMode:"graph", usesGraph:true, needsStartNode:false, frames:(graph)=>framesKruskal(graph),
    explain:"Builds a Minimum Spanning Tree — the cheapest set of edges connecting every node with no cycles — by greedily considering edges from lightest to heaviest, adding an edge only if it connects two previously-disconnected components. A Union-Find (Disjoint Set) structure tracks components and detects cycles in near-constant time per operation.",
    pseudo:`kruskal(nodes, edges):
  sort edges by weight ascending
  dsu = DisjointSet(nodes)
  for (u, v, weight) in edges:
    if dsu.find(u) != dsu.find(v):
      dsu.union(u, v); add (u,v) to MST`,
    complexity:{best:"O(E log E)",avg:"O(E log E)",worst:"O(E log E) — dominated by the sort",space:"O(V)",stable:"—"}},
};

const SIDEBAR_STRUCTURE = [
  {cat:"Sorting", items:["bubble","selection","insertion","merge","quick","heap"], open:true},
  {cat:"Searching", items:["linear_search","binary_search","jump_search","exponential_search"], open:true},
  {cat:"Arrays", items:["array_two_pointer","array_sliding_window","array_kadane","array_prefix_sum"], open:true},
  {cat:"Linked Lists", items:["ll_insert","ll_delete","ll_reverse","ll_cycle"], open:true},
  {cat:"Stack", items:["stack_balanced","stack_next_greater"], open:true},
  {cat:"Queue", items:["queue_fifo","queue_circular"], open:true},
  {cat:"Hash Tables", items:["hash_chaining"], open:true},
  {cat:"Trees", items:["bst_build","bst_search","bst_delete","traverse_inorder","traverse_preorder","traverse_postorder","traverse_levelorder","avl_insert"], open:true},
  {cat:"Graphs", items:["bfs","dfs","dijkstra","kruskal"], open:true},
  {cat:"Dynamic Programming", items:[], soon:true},
  {cat:"Greedy", items:[], soon:true},
  {cat:"Recursion", items:[], soon:true},
  {cat:"Backtracking", items:[], soon:true},
  {cat:"Divide & Conquer", items:[], soon:true},
  {cat:"Strings", items:[], soon:true},
];

/* ============================= STATE ============================= */
let state = {
  currentAlgo:'bubble',
  baseArray:[62,35,80,17,54,21,45,9,71,28],
  target:45,
  textInput:'',
  graph:null,
  startNode:null,
  frames:[],
  idx:0,
  playing:false,
  timer:null,
};

/* ============================= SIDEBAR RENDER ============================= */
function renderSidebar(filter=''){
  const el = document.getElementById('sidebar');
  el.innerHTML = '';
  SIDEBAR_STRUCTURE.forEach(group=>{
    const items = group.items.filter(key => !filter || CATALOG[key].name.toLowerCase().includes(filter.toLowerCase()));
    if(filter && items.length===0 && !group.cat.toLowerCase().includes(filter.toLowerCase())) return;

    const headWrap = document.createElement('div');
    headWrap.className = 'px-3 pt-3 pb-1 flex items-center justify-between cat-head text-[11px] uppercase tracking-wider font-semibold';
    headWrap.innerHTML = `<span>${group.cat}</span>` + (group.soon ? `<span class="badge">soon</span>` : `<span>${items.length}</span>`);
    el.appendChild(headWrap);

    if(group.soon){
      const s = document.createElement('div');
      s.className = 'soon px-3 pb-1 text-[12px]';
      s.style.color='var(--text-dim)';
      s.textContent = 'Coming in next milestone';
      el.appendChild(s);
      return;
    }

    items.forEach(key=>{
      const d = document.createElement('div');
      d.className = 'nav-item px-3 py-1.5 text-[13px]' + (key===state.currentAlgo?' active':'');
      d.textContent = CATALOG[key].name;
      d.onclick = ()=> selectAlgo(key);
      el.appendChild(d);
    });
  });
}
document.getElementById('searchInput').oninput = (e)=> renderSidebar(e.target.value);

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

/* ============================= RENDER RIGHT PANEL CONTENT ============================= */
function renderPanelContent(){
  const algo = CATALOG[state.currentAlgo];
  document.getElementById('tab-explain').innerHTML = `<p>${algo.explain}</p>`;
  document.getElementById('tab-pseudo').textContent = algo.pseudo;
  const c = algo.complexity;
  document.getElementById('tab-complexity').innerHTML = `
    <div class="grid grid-cols-2 gap-3">
      ${[['Best',c.best],['Average',c.avg],['Worst',c.worst],['Space',c.space],['Stable',c.stable]].map(([k,v])=>`
        <div class="glass2 rounded-lg p-3">
          <div class="text-[11px] uppercase tracking-wide" style="color:var(--text-dim)">${k}</div>
          <div class="font-mono font-semibold mt-1">${v}</div>
        </div>`).join('')}
    </div>`;
  const pyCode = document.getElementById('pyCode');
  pyCode.textContent = PY[state.currentAlgo];
  wrapPythonLines();
  Prism.highlightElement(pyCode);
}

// Wrap each source line in a span so we can highlight the active one.
function wrapPythonLines(){
  const pyCode = document.getElementById('pyCode');
  const lines = PY[state.currentAlgo].split('\n');
  pyCode.innerHTML = lines.map((l,i)=>`<span class="pyline" data-line="${i+1}">${escapeHtml(l)||' '}</span>`).join('\n');
}
function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

document.getElementById('btnCopyPy').onclick = ()=>{
  navigator.clipboard.writeText(PY[state.currentAlgo]);
  const b=document.getElementById('btnCopyPy'); const t=b.textContent; b.textContent='Copied!'; setTimeout(()=>b.textContent=t,1000);
};
document.getElementById('btnDownloadPy').onclick = ()=>{
  const blob = new Blob([PY[state.currentAlgo]], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download = state.currentAlgo+'_sort.py'; a.click();
  URL.revokeObjectURL(url);
};
document.getElementById('pySearch').oninput = (e)=>{
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('#pyCode .pyline').forEach(span=>{
    span.style.background = (q && span.textContent.toLowerCase().includes(q)) ? 'rgba(242,201,76,.18)' : '';
  });
};

/* ============================= VISUALIZATION RENDER ============================= */
function renderBarsFrame(frame){
  const wrap = document.getElementById('canvasWrap');
  wrap.classList.remove('items-start'); wrap.classList.add('items-end');
  const arr = frame.array;
  const max = Math.max(...arr.map(Math.abs), 1);
  const w = 100/arr.length;

  wrap.innerHTML = '';
  const p = frame.pointers;
  arr.forEach((val,i)=>{
    const barWrap = document.createElement('div');
    barWrap.className = 'relative flex flex-col items-center justify-end';
    barWrap.style.cssText = `width:${w}%; max-width:52px; height:100%;`;
    const bar = document.createElement('div');
    let bg = 'linear-gradient(180deg,var(--accent2),var(--accent))';
    if(frame.sorted && frame.sorted.includes(i)) bg = 'var(--good)';
    if(frame.range && (i<frame.range[0] || i>frame.range[1])) bg = 'var(--panel2)';
    if(frame.window && (i<frame.window[0] || i>frame.window[1])) bg = 'var(--panel2)';
    if(frame.compare && frame.compare.includes(i)) bg = 'var(--warn)';
    if(frame.swap && frame.swap.includes(i)) bg = 'var(--danger)';
    if(frame.pivot===i) bg = '#c084fc';
    if(frame.found && frame.found.includes(i)) bg = 'var(--good)';
    if(p && (p.left===i || p.right===i)) bg = 'var(--accent)';
    bar.className = 'bar rounded-t-md relative flex items-end justify-center';
    bar.style.cssText = `width:100%; max-width:52px; height:${(Math.abs(val)/max*100)}%; background:${bg};`;
    const label = document.createElement('span');
    label.className='font-mono text-[10px] pb-1';
    label.style.color = '#0b0d12';
    label.textContent = val;
    bar.appendChild(label);
    barWrap.appendChild(bar);
    if(p){
      if(p.left===i){
        const tag=document.createElement('div');
        tag.className='absolute -top-5 font-mono text-[10px] font-bold'; tag.style.color='var(--accent2)'; tag.textContent='L';
        barWrap.appendChild(tag);
      }
      if(p.right===i){
        const tag=document.createElement('div');
        tag.className='absolute -top-5 font-mono text-[10px] font-bold'; tag.style.color='var(--danger)'; tag.textContent='R';
        barWrap.appendChild(tag);
      }
    }
    wrap.appendChild(barWrap);
  });

  if(frame.prefixArr){
    const strip = document.createElement('div');
    strip.className = 'absolute left-0 right-0 bottom-1 flex items-center justify-center gap-1 px-6';
    frame.prefixArr.forEach((val,i)=>{
      const cell = document.createElement('div');
      let bg = i===frame.prefixArr.length-1 && frame.compare===undefined ? 'var(--panel2)' : 'var(--panel2)';
      if(frame.compare && frame.compare.includes(i-1)) bg = 'var(--warn)';
      cell.className = 'rounded px-1.5 py-0.5 font-mono text-[10px]';
      cell.style.cssText = `background:${bg}; border:1px solid var(--border); color:var(--text);`;
      cell.textContent = val;
      strip.appendChild(cell);
    });
    document.getElementById('canvasWrap').appendChild(strip);
  }
}

function renderFrame(){
  const frame = state.frames[state.idx];
  const mode = CATALOG[state.currentAlgo].renderMode || 'bars';
  if(mode==='tree') renderTreeFrame(frame);
  else if(mode==='graph') renderGraphFrame(frame);
  else if(mode==='linkedlist') renderLinkedListFrame(frame);
  else if(mode==='stack') renderStackFrame(frame);
  else if(mode==='queue') renderQueueFrame(frame);
  else if(mode==='hashtable') renderHashTableFrame(frame);
  else renderBarsFrame(frame);

  document.getElementById('frameCounter').textContent = `Step ${state.idx} / ${state.frames.length-1}`;
  const noteEl = document.getElementById('stepNote');
  if(frame.note){ noteEl.style.display='block'; noteEl.textContent = frame.note; } else { noteEl.style.display='none'; }

  document.querySelectorAll('#pyCode .pyline').forEach(s=>s.classList.remove('active'));
  const activeLine = document.querySelector(`#pyCode .pyline[data-line="${frame.pyLine}"]`);
  if(activeLine){ activeLine.classList.add('active'); activeLine.scrollIntoView({block:'center', behavior:'smooth'}); }

  document.getElementById('btnPrev').disabled = state.idx===0;
  document.getElementById('btnNext').disabled = state.idx===state.frames.length-1;
}

/* ============================= PLAYBACK CONTROLS ============================= */
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
  document.getElementById('playIcon').innerHTML = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';
  document.getElementById('playLabel').textContent = 'Pause';
  const speed = document.getElementById('speedSlider').value;
  const delay = 850 - speed*75;
  state.timer = setInterval(()=>{
    if(state.idx>=state.frames.length-1){ pause(); return; }
    stepNext();
  }, Math.max(60,delay));
}
function pause(){
  state.playing=false;
  clearInterval(state.timer);
  document.getElementById('playIcon').innerHTML = '<path d="M8 5v14l11-7z"/>';
  document.getElementById('playLabel').textContent = 'Play';
}
document.getElementById('btnPlay').onclick = ()=> state.playing ? pause() : play();
document.getElementById('btnNext').onclick = ()=>{ pause(); stepNext(); };
document.getElementById('btnPrev').onclick = stepPrev;
document.getElementById('btnReset').onclick = ()=>{ pause(); rebuildFrames(); };
document.getElementById('speedSlider').oninput = ()=>{ if(state.playing){ pause(); play(); } };

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

/* ============================= ALGO SWITCH / REBUILD ============================= */
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

/* ============================= INIT ============================= */
renderSidebar();
renderPanelContent();
rebuildFrames();