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

export { framesBalancedParens, framesNextGreaterElement };
