// lib/algorithms.js — a reference glossary of named algorithms, grouped by
// category. Separate from the DSA phase's pattern-based topics: this is a
// flat "have I learned this named algorithm?" checklist, not tied to
// practice problems. Progress keys use the 'algo::' prefix so they never
// collide with topic/subtopic question ids in the same progress blob.

const GFG = (q) => 'https://www.geeksforgeeks.org/?s=' + encodeURIComponent(q);

export const ALGO_CATEGORIES = [
  {
    name: 'Sorting',
    items: [
      { slug: 'bubble-sort', t: 'Bubble Sort', d: 'Repeatedly swaps adjacent out-of-order elements — simple, O(n²), rarely used in practice but a good first sort to implement by hand.' },
      { slug: 'selection-sort', t: 'Selection Sort', d: 'Repeatedly selects the minimum remaining element and swaps it into place — O(n²), minimal swaps.' },
      { slug: 'insertion-sort', t: 'Insertion Sort', d: 'Builds the sorted array one element at a time — O(n²) worst case, but fast and adaptive on nearly-sorted data.' },
      { slug: 'merge-sort', t: 'Merge Sort', d: 'Divide-and-conquer: split, sort each half, merge — stable, O(n log n) guaranteed.' },
      { slug: 'quick-sort', t: 'Quick Sort', d: 'Partition around a pivot, recurse on each side — O(n log n) average, in-place, the usual default in practice.' },
      { slug: 'heap-sort', t: 'Heap Sort', d: 'Builds a max-heap, then repeatedly extracts the max — O(n log n), in-place, not stable.' },
      { slug: 'counting-sort', t: 'Counting Sort', d: 'Counts occurrences of each value — O(n+k) for a small known range of integer keys, not comparison-based.' },
      { slug: 'radix-sort', t: 'Radix Sort', d: 'Sorts integers digit by digit using a stable sub-sort — O(nk) for k digits, no comparisons.' },
      { slug: 'bucket-sort', t: 'Bucket Sort', d: 'Distributes elements into buckets, sorts each bucket, concatenates — fast when input is uniformly distributed.' },
      { slug: 'shell-sort', t: 'Shell Sort', d: 'Insertion sort generalized with a shrinking gap sequence — beats plain insertion sort without the overhead of merge/quick sort.' },
      { slug: 'timsort', t: 'Timsort', d: 'Hybrid merge/insertion sort exploiting existing order in real-world data — what Java\'s Collections.sort and Python\'s sorted() actually use.' },
    ],
  },
  {
    name: 'Searching',
    items: [
      { slug: 'linear-search', t: 'Linear Search', d: 'Checks every element in order — O(n), works on unsorted data, the baseline everything else beats.' },
      { slug: 'binary-search', t: 'Binary Search', d: 'Halves the search space each step on sorted data — O(log n).' },
      { slug: 'ternary-search', t: 'Ternary Search', d: 'Splits the range into three parts each step — used for finding an extremum of a unimodal function.' },
      { slug: 'interpolation-search', t: 'Interpolation Search', d: 'Guesses the likely position based on value distribution instead of always checking the midpoint — faster than binary search on uniformly distributed sorted data.' },
      { slug: 'exponential-search', t: 'Exponential Search', d: 'Finds a range by doubling, then binary-searches within it — useful for unbounded/infinite sorted lists.' },
      { slug: 'jump-search', t: 'Jump Search', d: 'Jumps ahead by fixed block size, then linearly scans back — O(√n), a middle ground between linear and binary search.' },
    ],
  },
  {
    name: 'Graph Traversal & Shortest Path',
    items: [
      { slug: 'bfs', t: 'Breadth-First Search (BFS)', d: 'Explores a graph layer by layer using a queue — finds shortest paths in unweighted graphs.' },
      { slug: 'dfs', t: 'Depth-First Search (DFS)', d: 'Explores as deep as possible before backtracking — natural for connectivity, cycle detection, topological sort.' },
      { slug: 'dijkstra', t: "Dijkstra's Algorithm", d: 'Shortest paths from one source in a weighted graph with non-negative edges, using a min-heap.' },
      { slug: 'bellman-ford', t: 'Bellman-Ford Algorithm', d: 'Shortest paths from one source, slower than Dijkstra but handles negative edge weights and detects negative cycles.' },
      { slug: 'floyd-warshall', t: 'Floyd-Warshall Algorithm', d: 'All-pairs shortest paths via dynamic programming over intermediate nodes — O(V³), simple to implement.' },
      { slug: 'a-star', t: 'A* Search Algorithm', d: "Dijkstra plus a heuristic estimate of remaining distance — the standard pathfinding algorithm in games and maps." },
      { slug: 'johnsons-algorithm', t: "Johnson's Algorithm", d: 'All-pairs shortest paths for sparse graphs with negative edges — reweights via Bellman-Ford, then runs Dijkstra from every node.' },
    ],
  },
  {
    name: 'Minimum Spanning Tree & Connectivity',
    items: [
      { slug: 'kruskals-algorithm', t: "Kruskal's Algorithm", d: 'Builds a minimum spanning tree by adding the cheapest edge that doesn\'t create a cycle, using Union-Find.' },
      { slug: 'prims-algorithm', t: "Prim's Algorithm", d: 'Builds a minimum spanning tree by growing one connected tree, always adding the cheapest edge leaving it.' },
      { slug: 'union-find', t: 'Union-Find (Disjoint Set)', d: 'Answers "are these connected?" and "would this edge create a cycle?" in near-constant time with path compression + union by rank.' },
      { slug: 'tarjans-scc-algorithm', t: "Tarjan's SCC Algorithm", d: 'Finds strongly connected components in a directed graph in one DFS pass, using discovery times and low-link values.' },
      { slug: 'kosarajus-algorithm', t: "Kosaraju's Algorithm", d: 'Finds strongly connected components using two DFS passes — one on the graph, one on its transpose.' },
      { slug: 'topological-sort', t: 'Topological Sort', d: 'Orders the nodes of a DAG so every edge points forward — via DFS finishing order or Kahn\'s BFS-based algorithm.' },
    ],
  },
  {
    name: 'String Matching & Processing',
    items: [
      { slug: 'kmp-algorithm', t: 'Knuth-Morris-Pratt (KMP)', d: 'Substring search in O(n+m) using a precomputed "failure function" to avoid re-checking matched characters.' },
      { slug: 'rabin-karp-algorithm', t: 'Rabin-Karp Algorithm', d: 'Substring search using a rolling hash — compares hashes first, characters only on a hash match.' },
      { slug: 'z-algorithm', t: 'Z-Algorithm', d: 'Computes, for every position, the length of the longest match with the string\'s prefix — powers fast pattern matching in O(n+m).' },
      { slug: 'manachers-algorithm', t: "Manacher's Algorithm", d: 'Finds the longest palindromic substring in O(n), beating the naive O(n²) expand-around-center approach.' },
      { slug: 'boyer-moore-algorithm', t: 'Boyer-Moore Algorithm', d: 'Substring search that skips ahead using bad-character and good-suffix rules — often sub-linear in practice.' },
      { slug: 'trie', t: 'Trie (Prefix Tree)', d: 'Stores strings character-by-character along shared paths — O(word length) prefix lookup, the base for autocomplete.' },
      { slug: 'aho-corasick-algorithm', t: 'Aho-Corasick Algorithm', d: 'Matches many patterns against a text simultaneously in one pass, using a trie with failure links.' },
    ],
  },
  {
    name: 'Dynamic Programming Techniques',
    items: [
      { slug: '0-1-knapsack', t: '0/1 Knapsack', d: 'Choose a subset of items with weight/value to maximize value under a weight limit — classic 2D DP.' },
      { slug: 'longest-common-subsequence', t: 'Longest Common Subsequence (LCS)', d: 'Longest sequence appearing (in order, not necessarily contiguous) in both of two strings — dp[i][j] over positions.' },
      { slug: 'longest-increasing-subsequence', t: 'Longest Increasing Subsequence (LIS)', d: 'Longest strictly increasing subsequence of an array — O(n²) DP or O(n log n) with binary search.' },
      { slug: 'matrix-chain-multiplication', t: 'Matrix Chain Multiplication', d: 'Finds the cheapest way to parenthesize a chain of matrix multiplications — classic interval DP.' },
      { slug: 'edit-distance', t: 'Edit Distance (Levenshtein)', d: 'Minimum insert/delete/replace operations to turn one string into another — 2D DP over both strings\' positions.' },
      { slug: 'coin-change-problem', t: 'Coin Change', d: 'Fewest coins (or number of ways) to make a target amount — 1D DP over amounts.' },
      { slug: 'rod-cutting-problem', t: 'Rod Cutting', d: 'Maximize revenue by cutting a rod into pieces of given prices per length — a foundational unbounded-knapsack-style DP.' },
    ],
  },
  {
    name: 'Greedy Algorithms',
    items: [
      { slug: 'huffman-coding', t: 'Huffman Coding', d: 'Builds an optimal prefix-free binary code by repeatedly merging the two least-frequent symbols — the classic compression algorithm.' },
      { slug: 'activity-selection-problem', t: 'Activity Selection Problem', d: 'Pick the maximum number of non-overlapping intervals by always choosing the one that finishes earliest.' },
      { slug: 'fractional-knapsack-problem', t: 'Fractional Knapsack', d: 'Unlike 0/1 Knapsack, items can be split — sort by value/weight ratio and greedily fill the bag.' },
      { slug: 'job-sequencing-problem', t: 'Job Sequencing with Deadlines', d: 'Schedule jobs with deadlines and profits to maximize total profit — greedily pick the highest-profit job that still fits.' },
    ],
  },
  {
    name: 'Backtracking',
    items: [
      { slug: 'n-queen-problem', t: 'N-Queens', d: 'Place N queens on an N×N board so none attack each other — the textbook backtracking problem.' },
      { slug: 'sudoku-solver', t: 'Sudoku Solver', d: 'Fill a partially-completed grid respecting row/column/box constraints, backtracking on dead ends.' },
      { slug: 'rat-in-a-maze', t: 'Rat in a Maze', d: 'Find a path from start to end through a grid of blocked/open cells, backtracking when a path dead-ends.' },
      { slug: 'subset-sum-problem', t: 'Subset Sum (Backtracking)', d: 'Decide whether some subset of a set sums to a target — include/exclude each element, backtrack on failure.' },
      { slug: 'graph-colouring-problem', t: 'Graph Coloring', d: 'Assign colors to graph nodes so no two adjacent nodes share a color, using the fewest colors possible.' },
    ],
  },
  {
    name: 'Divide & Conquer',
    items: [
      { slug: 'closest-pair-of-points', t: 'Closest Pair of Points', d: 'Finds the two closest points in a plane in O(n log n) by splitting the point set and combining across the boundary.' },
      { slug: 'karatsuba-algorithm-for-fast-multiplication-using-divide-and-conquer-algorithm', t: 'Karatsuba Multiplication', d: 'Multiplies large numbers faster than the grade-school method by splitting digits and recursing — O(n^1.585).' },
      { slug: 'strassens-matrix-multiplication', t: "Strassen's Matrix Multiplication", d: 'Multiplies matrices in O(n^2.807) instead of O(n³) by cleverly reducing the number of recursive multiplications.' },
    ],
  },
  {
    name: 'Number Theory & Math',
    items: [
      { slug: 'sieve-of-eratosthenes', t: 'Sieve of Eratosthenes', d: 'Finds all primes up to N in O(N log log N) by iteratively marking multiples of each prime as composite.' },
      { slug: 'euclidean-algorithms-basic-and-extended', t: 'Euclidean Algorithm (GCD)', d: 'Finds the greatest common divisor of two numbers by repeated remainder — one of the oldest known algorithms.' },
      { slug: 'extended-euclidean-algorithms', t: 'Extended Euclidean Algorithm', d: 'Finds GCD(a,b) plus integer coefficients x,y such that ax+by=GCD(a,b) — the basis for modular inverses.' },
      { slug: 'modular-exponentiation-power-in-modular-arithmetic', t: 'Fast (Binary) Exponentiation', d: 'Computes x^n mod m in O(log n) by repeated squaring instead of n multiplications.' },
      { slug: 'primality-test', t: 'Primality Testing (Miller-Rabin)', d: 'Probabilistically tests whether a large number is prime — used where trial division is too slow (cryptography-scale numbers).' },
      { slug: 'sieve-of-sundaram', t: 'Sieve of Sundaram', d: 'An alternative prime-sieving method that only marks composites of the form i+j+2ij — a good exercise in sieve variants.' },
    ],
  },
  {
    name: 'Bit Manipulation Tricks',
    items: [
      { slug: 'brian-kernighans-algorithm', t: "Brian Kernighan's Algorithm", d: 'Counts set bits by repeatedly clearing the lowest set bit with n & (n-1) — runs in O(number of set bits), not O(bit width).' },
      { slug: 'xor-swap-algorithm', t: 'XOR Swap', d: 'Swaps two integers without a temporary variable using three XOR operations — a classic bit-trick, mostly of historical/interview interest.' },
      { slug: 'bitmasking-and-dynamic-programming-set-1', t: 'Bitmasking for Subsets', d: 'Represents a subset of up to ~20 elements as a single integer\'s bits — the standard trick behind subset-enumeration DP (e.g. Traveling Salesman DP).' },
    ],
  },
  {
    name: 'Compression & Hashing',
    items: [
      { slug: 'run-length-encoding', t: 'Run-Length Encoding', d: 'Compresses runs of repeated values into (value, count) pairs — simple, effective on data with long repeated runs.' },
      { slug: 'rolling-hash', t: 'Rolling Hash', d: 'Recomputes a hash for a sliding window in O(1) instead of O(window size) — the mechanism behind Rabin-Karp.' },
    ],
  },
];

export function algoKey(slug) {
  return 'algo::' + slug;
}

export function algoLearnMore(item) {
  return { label: 'GeeksforGeeks — ' + item.t, url: GFG(item.t) };
}

export function totalAlgorithms() {
  return ALGO_CATEGORIES.reduce((n, c) => n + c.items.length, 0);
}
