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

function framesInterpolationSearch(arrIn, target){
  const arr=[...arrIn].sort((a,b)=>a-b);
  const frames=[];
  frames.push({array:[...arr], note:`Array sorted. Estimate where target = ${target} sits by interpolating between the range ends.`, pyLine:1});
  let lo=0, hi=arr.length-1;
  while(lo<=hi && target>=arr[lo] && target<=arr[hi]){
    const pos = arr[hi]===arr[lo] ? lo : lo+Math.floor((target-arr[lo])*(hi-lo)/(arr[hi]-arr[lo]));
    frames.push({array:[...arr], range:[lo,hi], compare:[pos], note:`Range [${lo}..${hi}]. Estimated position ${pos}: a[${pos}]=${arr[pos]}`, pyLine:7});
    if(arr[pos]===target){
      frames.push({array:[...arr], found:[pos], note:`Found ${target} at index ${pos}!`, pyLine:9});
      return frames;
    } else if(arr[pos]<target){
      lo=pos+1;
      frames.push({array:[...arr], range:[lo,hi], note:`a[${pos}]=${arr[pos]} < ${target} — search right of index ${pos}`, pyLine:11});
    } else {
      hi=pos-1;
      frames.push({array:[...arr], range:[lo,hi], note:`a[${pos}]=${arr[pos]} > ${target} — search left of index ${pos}`, pyLine:13});
    }
  }
  frames.push({array:[...arr], note:`Target ${target} not found.`, pyLine:14});
  return frames;
}

function framesTernarySearch(arrIn, target){
  const arr=[...arrIn].sort((a,b)=>a-b);
  const frames=[];
  frames.push({array:[...arr], note:`Array sorted. Split the range into three parts using two midpoints. Searching for target = ${target}.`, pyLine:1});
  let lo=0, hi=arr.length-1;
  while(lo<=hi){
    const third=Math.floor((hi-lo)/3), m1=lo+third, m2=hi-third;
    frames.push({array:[...arr], range:[lo,hi], compare:[m1,m2], note:`Range [${lo}..${hi}]. Check a[${m1}]=${arr[m1]} and a[${m2}]=${arr[m2]}`, pyLine:5});
    if(arr[m1]===target){ frames.push({array:[...arr], found:[m1], note:`Found ${target} at index ${m1}!`, pyLine:7}); return frames; }
    if(arr[m2]===target){ frames.push({array:[...arr], found:[m2], note:`Found ${target} at index ${m2}!`, pyLine:9}); return frames; }
    if(target<arr[m1]){
      hi=m1-1;
      frames.push({array:[...arr], range:[lo,hi], note:`${target} < a[${m1}] — search the left third`, pyLine:11});
    } else if(target>arr[m2]){
      lo=m2+1;
      frames.push({array:[...arr], range:[lo,hi], note:`${target} > a[${m2}] — search the right third`, pyLine:13});
    } else {
      lo=m1+1; hi=m2-1;
      frames.push({array:[...arr], range:[lo,hi], note:`${target} lies between a[${m1}] and a[${m2}] — search the middle third`, pyLine:15});
    }
  }
  frames.push({array:[...arr], note:`Target ${target} not found.`, pyLine:16});
  return frames;
}

export { framesLinearSearch, framesBinarySearch, framesJumpSearch, framesExponentialSearch, framesInterpolationSearch, framesTernarySearch };