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

export { renderStackFrame };
