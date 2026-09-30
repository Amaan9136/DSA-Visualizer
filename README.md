# Algorithm Visualizer

Interactive visualizations of algorithms and data structures to help students and developers learn core CS concepts through step-by-step animations and hands-on experimentation.

## Features

- **Sorting Visualizations** – Watch algorithms like Bubble Sort operate step by step on arrays.
- **Graph Visualizations** – Explore graph structures, perform searches, and generate random graphs.
- **Custom Input** – Enter your own data to see how algorithms behave on specific cases.
- **Interactive Controls** – Play, pause, and adjust speed to follow each operation closely.
- **Randomized Examples** – Generate new random arrays and graphs for endless practice.
- **Responsive Layout** – Works on phones, tablets, and desktops, with slide-in drawers for the algorithm list and the explanation, pseudocode, Python, and complexity panel.
- **Iteration Viewer** – Open a scrollable list of every step with its message, and toggle a per-step breakdown of the Python line and frame state.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Amaan9136/DSA-Visualizer.git
   cd DSA-Visualizer
   ```
2. Open `index.html` in your browser:
   ```bash
   # Option 1: Directly
   # Open index.html in Chrome, Firefox, etc.

   # Option 2: Using a local server (recommended)
   npx serve .
   # or
   python -m http.server
   ```
3. Navigate to the local URL (e.g., `http://localhost:3000` or `http://localhost:8000`) and start exploring.

## Usage

- **Sorting**: Generate a random array or enter custom values, then press Play to visualize the sorting process. Adjust speed to slow down or speed up the animation.
- **Graphs**: Create a new random graph, set a start node, and run search algorithms to see traversal in action.

## Implemented Algorithms

The visualizer currently covers **39 algorithms** across **9 categories**, each with step-by-step animation, pseudocode, an explanation, complexity analysis, and a matching Python reference implementation.

| Category | Algorithms |
|---|---|
| Sorting | Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort, Shell Sort, Cocktail Shaker Sort |
| Searching | Linear Search, Binary Search, Jump Search, Exponential Search, Interpolation Search, Ternary Search |
| Arrays | Two-Pointer Technique, Sliding Window (Max Sum Subarray), Kadane's Algorithm, Prefix Sums |
| Linked Lists | Insert, Delete, Reverse, Cycle Detection (Floyd's Tortoise and Hare) |
| Stack | Balanced Parentheses, Next Greater Element (Monotonic Stack) |
| Queue | FIFO Enqueue/Dequeue, Circular Queue |
| Hash Tables | Insert / Search / Delete with Collision Handling via Chaining |
| Trees | BST Build, BST Search, BST Delete, Inorder/Preorder/Postorder/Level-order Traversal, AVL Insert (with rotations) |
| Graphs | BFS, DFS, Dijkstra's Shortest Path, Kruskal's MST |

## Pending / Roadmap

The following are planned but not yet implemented:

| Category | Planned algorithms |
|---|---|
| Dynamic Programming | Knapsack, Longest Common Subsequence (LCS), Longest Increasing Subsequence (LIS), Coin Change, Edit Distance |
| Greedy | Activity Selection, Fractional Knapsack, Huffman Coding |
| Recursion | Factorial, Fibonacci, Tower of Hanoi |
| Backtracking | N-Queens, Sudoku Solver, Rat in a Maze, Word Search |
| Divide & Conquer | Closest Pair of Points, Matrix Exponentiation |
| Strings | KMP, Rabin-Karp, Z-Algorithm, Trie-based Search |
| Advanced Structures | Tries, Segment Trees, Fenwick Trees (BIT), Red-Black Trees, Union-Find (standalone) |
| Advanced Graphs | Bellman-Ford, Floyd-Warshall, A* Search, Prim's MST, Kosaraju's / Tarjan's (SCC) |

## Technologies

- HTML, CSS, Tailwind CSS, JavaScript
- No external frameworks required (vanilla JS)

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, coding conventions, and how to add a new algorithm. Please follow the [Code of Conduct](CODE_OF_CONDUCT.md). To report a vulnerability, see [SECURITY.md](SECURITY.md).

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

Built as an educational tool to make learning algorithms more visual, intuitive, and engaging.

Created by [Amaan MK](https://github.com/Amaan9136). If you use or build on this project, please keep the copyright notice and credit the author.