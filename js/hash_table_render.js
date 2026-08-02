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

export { renderHashTableFrame };
