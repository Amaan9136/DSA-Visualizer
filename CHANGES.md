# Changes

A chronological record of the development and changes made to DSA Visualizer.

## 2026-08-02

### Initial Project Setup
* Initialized repository with MIT license ([`cfe4216`](https://github.com/Amaan9136/DSA-Visualizer/commit/cfe42161412fc57d52f363678348e32da82e1153)).
* Added core visualizer scaffold containing interactive playback controls (play, pause, step forward/backward, speed adjustments) and randomized data generators ([`5989428`](https://github.com/Amaan9136/DSA-Visualizer/commit/59894284db2d86f69a2d89d0584d7cb8ba62c1a6)).
* Implemented initial algorithm sets with step animations, synchronized Python code line highlights, pseudocode, and complexity breakdowns:
  * **Sorting**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort.
  * **Searching**: Linear Search, Binary Search, Jump Search, Exponential Search.
  * **Trees**: Binary Search Tree (build, search, delete), Tree Traversals (inorder, preorder, postorder, level-order), AVL Tree (insertion with rebalancing rotations).
  * **Graphs**: Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's Shortest Path, Kruskal's Minimum Spanning Tree (MST).

### CI/CD Deployment
* Added GitHub Actions workflow (`.github/workflows/static.yml`) for automated static deployment to GitHub Pages on pushes to `main` ([`5a1aa47`](https://github.com/Amaan9136/DSA-Visualizer/commit/5a1aa4782640366460f8425bd94dda53b0dee630)).

### Styling & Algorithmic Expansion
* Extracted inline presentation rules into dedicated `styles.css` with light and dark mode CSS variables ([`07fb741`](https://github.com/Amaan9136/DSA-Visualizer/commit/07fb741f7b71c9a17269aa0d218f91c1d2b12c4c)).
* Implemented additional data structure visualizers and dedicated render pipelines:
  * **Arrays**: Two-Pointer Technique (target pair sum), Sliding Window (maximum sum subarray), Kadane's Algorithm, Prefix Sums.
  * **Linked Lists**: Insert, Delete, In-place Reversal, Floyd's Cycle Detection.
  * **Stacks**: Balanced Parentheses validation, Next Greater Element via monotonic stack.
  * **Queues**: FIFO Enqueue/Dequeue, Circular Queue buffer wrapping.
  * **Hash Tables**: Separate Chaining collision handling (insert, search, delete).
* Updated project documentation detailing all 35 operational algorithms across 9 categories.

### Modular Architecture Refactor
* Deconstructed monolithic scripts into specialized ES modules under `js/` ([`23bba60`](https://github.com/Amaan9136/DSA-Visualizer/commit/23bba60a1dcdef950ef2b9753f37e92a05d32182)):
  * `js/state.js` for centralized application state management.
  * Dedicated algorithm definition files (`sorting_algorithms.js`, `tree_algorithms.js`, `graph_algorithms.js`, etc.).
  * Dedicated canvas and DOM rendering modules (`visualization_render.js`, `tree_render.js`, `graph_render.js`, `linked_list_render.js`, etc.).
  * Modular playback controls, Python sources, and sidebar components.
* Streamlined `app.js` to serve as the orchestrator entry point.
* Added repository `.gitignore`.

### Iteration Step Inspection
* Added an iteration step modal to inspect intermediate frame state details ([`a1d9560`](https://github.com/Amaan9136/DSA-Visualizer/commit/a1d95606de1bc6ef4e4493a54a868cc5bf2e631d)).
* Added a dedicated iteration tab alongside the code and complexity panels for seamless step-through tracking ([`f438658`](https://github.com/Amaan9136/DSA-Visualizer/commit/f4386584fe7e20b73bca58e7aa362977d593f9e4)).
* Fixed unresolved module import path for `syncActiveStep` inside `js/visualization_render.js` ([`d9a9a74`](https://github.com/Amaan9136/DSA-Visualizer/commit/d9a9a7400cc7643dc4cec5f8b4fb48b4b0cbb96b)).

## 2026-09-30

### UI, Algorithm Additions & Open Source Governance
* Integrated full iteration inspection modal support directly into the primary control bar ([`91ba22a`](https://github.com/Amaan9136/DSA-Visualizer/commit/91ba22aae27768920cda964e34e78e425565f450)).
* Improved layout responsiveness for smaller screen viewports and mobile navigation.
* Expanded algorithm catalog coverage across foundational modules.
* Added standard community and open-source project documentation (`CONTRIBUTING.md`, issue templates, and conduct guidelines).