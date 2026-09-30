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

function framesShell(arr){
  const a=[...arr], frames=[], n=a.length;
  frames.push({array:[...a], note:"Initial array.", pyLine:1});
  for(let gap=Math.floor(n/2);gap>0;gap=Math.floor(gap/2)){
    frames.push({array:[...a], note:`Gap = ${gap} — gapped insertion sort.`, pyLine:4});
    for(let i=gap;i<n;i++){
      const tmp=a[i]; let j=i;
      frames.push({array:[...a], compare:[i], note:`Pick key = a[${i}] = ${tmp}`, pyLine:6});
      while(j>=gap && a[j-gap]>tmp){
        a[j]=a[j-gap];
        frames.push({array:[...a], compare:[j-gap,j], note:`Shift a[${j-gap}] to index ${j} (gap ${gap})`, pyLine:9});
        j-=gap;
      }
      a[j]=tmp;
      frames.push({array:[...a], swap:[j], note:`Place ${tmp} at index ${j}`, pyLine:11});
    }
  }
  frames.push({array:[...a], sorted:a.map((_,k)=>k), note:"Sorted!", pyLine:13});
  return frames;
}

function framesCocktail(arr){
  const a=[...arr], frames=[], sortedIdx=[];
  let lo=0, hi=a.length-1, swapped=true;
  frames.push({array:[...a], note:"Initial array.", pyLine:1});
  while(swapped && lo<hi){
    swapped=false;
    for(let i=lo;i<hi;i++){
      frames.push({array:[...a], compare:[i,i+1], sorted:[...sortedIdx], note:`Forward: compare a[${i}] and a[${i+1}]`, pyLine:7});
      if(a[i]>a[i+1]){
        [a[i],a[i+1]]=[a[i+1],a[i]]; swapped=true;
        frames.push({array:[...a], swap:[i,i+1], sorted:[...sortedIdx], note:`Swap: a[${i}] > a[${i+1}]`, pyLine:8});
      }
    }
    sortedIdx.push(hi); hi--;
    frames.push({array:[...a], sorted:[...sortedIdx], note:`Forward pass done — largest placed at index ${hi+1}.`, pyLine:10});
    if(!swapped) break;
    swapped=false;
    for(let i=hi;i>lo;i--){
      frames.push({array:[...a], compare:[i-1,i], sorted:[...sortedIdx], note:`Backward: compare a[${i-1}] and a[${i}]`, pyLine:15});
      if(a[i-1]>a[i]){
        [a[i-1],a[i]]=[a[i],a[i-1]]; swapped=true;
        frames.push({array:[...a], swap:[i-1,i], sorted:[...sortedIdx], note:`Swap: a[${i-1}] > a[${i}]`, pyLine:16});
      }
    }
    sortedIdx.push(lo); lo++;
    frames.push({array:[...a], sorted:[...sortedIdx], note:`Backward pass done — smallest placed at index ${lo-1}.`, pyLine:18});
  }
  frames.push({array:[...a], sorted:a.map((_,k)=>k), note:"Sorted!", pyLine:19});
  return frames;
}

export { framesBubble, framesSelection, framesInsertion, framesMerge, framesQuick, framesHeap, framesShell, framesCocktail };