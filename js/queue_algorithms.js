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

export { parseOpsString, framesQueueFIFO, framesCircularQueue };
