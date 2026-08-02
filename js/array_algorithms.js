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

export { parseValAtPos, framesTwoPointer, framesSlidingWindow, framesKadane, framesPrefixSum };
