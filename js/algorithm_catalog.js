/* ============================= ALGORITHM CATALOG ============================= */
import { framesKadane, framesPrefixSum, framesSlidingWindow, framesTwoPointer, parseValAtPos } from './array_algorithms.js';
import { framesBFS, framesDFS, framesDijkstra, framesKruskal } from './graph_algorithms.js';
import { framesHashTable, parseHashOpsString } from './hash_table_algorithms.js';
import { framesLLCycleDetect, framesLLDelete, framesLLInsert, framesLLReverse } from './linked_list_algorithms.js';
import { framesCircularQueue, framesQueueFIFO, parseOpsString } from './queue_algorithms.js';
import { framesBinarySearch, framesExponentialSearch, framesInterpolationSearch, framesJumpSearch, framesLinearSearch, framesTernarySearch } from './searching_algorithms.js';
import { framesBubble, framesCocktail, framesHeap, framesInsertion, framesMerge, framesQuick, framesSelection, framesShell } from './sorting_algorithms.js';
import { framesBalancedParens, framesNextGreaterElement } from './stack_algorithms.js';
import { framesAVLInsert, framesBSTBuild, framesBSTDelete, framesBSTSearch, framesTraversal } from './tree_algorithms.js';

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

  shell:{ name:"Shell Sort", cat:"Sorting", frames:framesShell,
    explain:"A generalization of insertion sort that first compares and moves elements far apart, then progressively shrinks the gap down to 1. Early large-gap passes move out-of-place elements close to their final position quickly, so the final gap-1 pass (a plain insertion sort) has very little left to do.",
    pseudo:`gap = n // 2
while gap > 0:
  for i in gap..n-1:
    tmp = a[i]; j = i
    while j >= gap and a[j-gap] > tmp:
      a[j] = a[j-gap]; j -= gap
    a[j] = tmp
  gap //= 2`,
    complexity:{best:"O(n log n)",avg:"Depends on gap sequence — about O(n^1.3) to O(n²)",worst:"O(n²) with the simple n/2 sequence",space:"O(1)",stable:"No"}},

  cocktail:{ name:"Cocktail Shaker Sort", cat:"Sorting", frames:framesCocktail,
    explain:"A bidirectional bubble sort. Each round has a forward pass that pushes the largest remaining value to the right end, followed by a backward pass that pulls the smallest remaining value to the left end. It handles small values sitting near the end of the array better than plain bubble sort, and stops as soon as a pass makes no swaps.",
    pseudo:`lo, hi = 0, n-1
while swapped and lo < hi:
  for i in lo..hi-1: if a[i] > a[i+1]: swap
  hi -= 1
  for i in hi..lo+1: if a[i-1] > a[i]: swap
  lo += 1`,
    complexity:{best:"O(n) — already sorted",avg:"O(n²)",worst:"O(n²)",space:"O(1)",stable:"Yes"}},

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

  interpolation_search:{ name:"Interpolation Search", cat:"Searching", needsTarget:true, frames:(arr,target)=>framesInterpolationSearch(arr,target),
    explain:"Requires a sorted array. Instead of always probing the middle like binary search, it estimates where the target should be by interpolating between the values at both ends of the current range — the way a person opens a phone book near the back when looking for a name starting with W. Very fast on uniformly distributed data, but can degrade badly on skewed data.",
    pseudo:`lo, hi = 0, n-1
while lo <= hi and a[lo] <= target <= a[hi]:
  pos = lo + (target - a[lo]) * (hi - lo) / (a[hi] - a[lo])
  if a[pos] == target: return pos
  elif a[pos] < target: lo = pos + 1
  else: hi = pos - 1`,
    complexity:{best:"O(1)",avg:"O(log log n) — uniformly distributed data",worst:"O(n) — highly skewed data",space:"O(1)",stable:"—"}},

  ternary_search:{ name:"Ternary Search", cat:"Searching", needsTarget:true, frames:(arr,target)=>framesTernarySearch(arr,target),
    explain:"Requires a sorted array. Splits the current range into three parts using two midpoints, compares the target against both, and discards the two thirds that cannot contain it. It makes more comparisons per step than binary search, so it is mainly of educational interest for sorted lists, and is more useful for finding the peak of unimodal functions.",
    pseudo:`lo, hi = 0, n-1
while lo <= hi:
  m1 = lo + (hi-lo)/3; m2 = hi - (hi-lo)/3
  if a[m1] == target: return m1
  if a[m2] == target: return m2
  if target < a[m1]: hi = m1 - 1
  elif target > a[m2]: lo = m2 + 1
  else: lo, hi = m1 + 1, m2 - 1`,
    complexity:{best:"O(1)",avg:"O(log₃ n)",worst:"O(log₃ n)",space:"O(1)",stable:"—"}},

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
  {cat:"Sorting", items:["bubble","selection","insertion","merge","quick","heap","shell","cocktail"], open:true},
  {cat:"Searching", items:["linear_search","binary_search","jump_search","exponential_search","interpolation_search","ternary_search"], open:true},
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

export { CATALOG, SIDEBAR_STRUCTURE };