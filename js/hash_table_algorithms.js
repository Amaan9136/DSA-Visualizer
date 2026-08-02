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

export { hashFn, cloneBuckets, parseHashOpsString, framesHashTable };
