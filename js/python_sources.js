/* ============================= PYTHON SOURCE ============================= */
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
    return -1  # not found`,

shell:`def shell_sort(arr):
    n = len(arr)
    gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            tmp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > tmp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = tmp
        gap //= 2
    return arr`,

cocktail:`def cocktail_shaker_sort(arr):
    lo, hi = 0, len(arr) - 1
    swapped = True
    while swapped and lo < hi:
        swapped = False
        for i in range(lo, hi):
            if arr[i] > arr[i + 1]:
                arr[i], arr[i + 1] = arr[i + 1], arr[i]
                swapped = True
        hi -= 1
        if not swapped:
            break
        swapped = False
        for i in range(hi, lo, -1):
            if arr[i - 1] > arr[i]:
                arr[i - 1], arr[i] = arr[i], arr[i - 1]
                swapped = True
        lo += 1
    return arr`,

interpolation_search:`def interpolation_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi and arr[lo] <= target <= arr[hi]:
        if arr[hi] == arr[lo]:
            pos = lo
        else:
            pos = lo + (target - arr[lo]) * (hi - lo) // (arr[hi] - arr[lo])
        if arr[pos] == target:
            return pos
        elif arr[pos] < target:
            lo = pos + 1
        else:
            hi = pos - 1
    return -1`,

ternary_search:`def ternary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        third = (hi - lo) // 3
        m1, m2 = lo + third, hi - third
        if arr[m1] == target:
            return m1
        if arr[m2] == target:
            return m2
        if target < arr[m1]:
            hi = m1 - 1
        elif target > arr[m2]:
            lo = m2 + 1
        else:
            lo, hi = m1 + 1, m2 - 1
    return -1`
};

export { PY };