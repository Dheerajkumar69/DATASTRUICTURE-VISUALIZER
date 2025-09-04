import * as LazyRoutes from './LazyRoutes';

// Route configuration with code splitting
export const routeConfig = [
  // Core routes
  {
    path: '/',
    component: LazyRoutes.HomePage,
    loadingMessage: 'Loading home page...'
  },

  // Data structure routes (grouped for potential bundle splitting)
  {
    path: '/data-structures/array',
    component: LazyRoutes.ArrayPage,
    loadingMessage: 'Loading array visualization...'
  },
  {
    path: '/data-structures/linked-list',
    component: LazyRoutes.LinkedListPage,
    loadingMessage: 'Loading linked list visualization...'
  },
  {
    path: '/data-structures/stack',
    component: LazyRoutes.StackPage,
    loadingMessage: 'Loading stack visualization...'
  },
  {
    path: '/data-structures/queue',
    component: LazyRoutes.QueuePage,
    loadingMessage: 'Loading queue visualization...'
  },
  {
    path: '/data-structures/priority-queue',
    component: LazyRoutes.PriorityQueuePage,
    loadingMessage: 'Loading priority queue visualization...'
  },
  {
    path: '/data-structures/tree',
    component: LazyRoutes.TreePage,
    loadingMessage: 'Loading tree visualization...'
  },
  {
    path: '/data-structures/graph',
    component: LazyRoutes.GraphPage,
    loadingMessage: 'Loading graph visualization...'
  },
  {
    path: '/data-structures/hash-table',
    component: LazyRoutes.HashTablePage,
    loadingMessage: 'Loading hash table visualization...'
  },
  {
    path: '/data-structures/heap',
    component: LazyRoutes.HeapPage,
    loadingMessage: 'Loading heap visualization...'
  },
  {
    path: '/data-structures/trie',
    component: LazyRoutes.TriePage,
    loadingMessage: 'Loading trie visualization...'
  },

  // Algorithm overview routes
  {
    path: '/algorithms',
    component: LazyRoutes.AlgorithmsPage,
    loadingMessage: 'Loading algorithms overview...'
  },
  {
    path: '/algorithms/sorting',
    component: LazyRoutes.SortingPage,
    loadingMessage: 'Loading sorting algorithms...'
  },
  {
    path: '/algorithms/searching',
    component: LazyRoutes.SearchingPage,
    loadingMessage: 'Loading searching algorithms...'
  },
  {
    path: '/algorithms/graph',
    component: LazyRoutes.GraphAlgorithmsPage,
    loadingMessage: 'Loading graph algorithms...'
  },
  {
    path: '/algorithms/backtracking',
    component: LazyRoutes.BacktrackingPage,
    loadingMessage: 'Loading backtracking algorithms...'
  },
  {
    path: '/algorithms/problems',
    component: LazyRoutes.ProblemsPage,
    loadingMessage: 'Loading algorithm problems...'
  },

  // Sorting algorithm routes (can be bundled together)
  {
    path: '/algorithms/sorting/bubble-sort',
    component: LazyRoutes.BubbleSortPage,
    loadingMessage: 'Loading bubble sort...'
  },
  {
    path: '/algorithms/sorting/selection-sort',
    component: LazyRoutes.SelectionSortPage,
    loadingMessage: 'Loading selection sort...'
  },
  {
    path: '/algorithms/sorting/insertion-sort',
    component: LazyRoutes.InsertionSortPage,
    loadingMessage: 'Loading insertion sort...'
  },
  {
    path: '/algorithms/sorting/merge-sort',
    component: LazyRoutes.MergeSortPage,
    loadingMessage: 'Loading merge sort...'
  },
  {
    path: '/algorithms/sorting/quick-sort',
    component: LazyRoutes.QuickSortPage,
    loadingMessage: 'Loading quick sort...'
  },
  {
    path: '/algorithms/sorting/heap-sort',
    component: LazyRoutes.HeapSortPage,
    loadingMessage: 'Loading heap sort...'
  },
  {
    path: '/algorithms/sorting/shell-sort',
    component: LazyRoutes.ShellSortPage,
    loadingMessage: 'Loading shell sort...'
  },
  {
    path: '/algorithms/sorting/counting-sort',
    component: LazyRoutes.CountingSortPage,
    loadingMessage: 'Loading counting sort...'
  },
  {
    path: '/algorithms/sorting/radix-sort',
    component: LazyRoutes.RadixSortPage,
    loadingMessage: 'Loading radix sort...'
  },
  {
    path: '/algorithms/sorting/bucket-sort',
    component: LazyRoutes.BucketSortPage,
    loadingMessage: 'Loading bucket sort...'
  },

  // Math algorithm routes
  {
    path: '/algorithms/math/euclidean',
    component: LazyRoutes.EuclideanPage,
    loadingMessage: 'Loading euclidean algorithm...'
  },
  {
    path: '/algorithms/math/extended-euclidean',
    component: LazyRoutes.ExtendedEuclideanPage,
    loadingMessage: 'Loading extended euclidean algorithm...'
  },

  // Array algorithm routes
  {
    path: '/algorithms/array/kadane',
    component: LazyRoutes.KadanePage,
    loadingMessage: 'Loading Kadane\'s algorithm...'
  },
  {
    path: '/algorithms/array/sliding-window',
    component: LazyRoutes.SlidingWindowPage,
    loadingMessage: 'Loading sliding window algorithm...'
  },

  // Graph algorithm routes
  {
    path: '/algorithms/graph/astar',
    component: LazyRoutes.AStarPage,
    loadingMessage: 'Loading A* algorithm...'
  },
  {
    path: '/algorithms/graph/kruskal',
    component: LazyRoutes.KruskalPage,
    loadingMessage: 'Loading Kruskal\'s algorithm...'
  },
  {
    path: '/algorithms/graph/prim',
    component: LazyRoutes.PrimPage,
    loadingMessage: 'Loading Prim\'s algorithm...'
  },
  {
    path: '/algorithms/graph/undirected-cycle-detection',
    component: LazyRoutes.UndirectedCycleDetectionPage,
    loadingMessage: 'Loading cycle detection...'
  },
  {
    path: '/algorithms/graph/directed-cycle-detection',
    component: LazyRoutes.DirectedCycleDetectionPage,
    loadingMessage: 'Loading cycle detection...'
  },
  {
    path: '/algorithms/graph/eulerian-path',
    component: LazyRoutes.EulerianPathPage,
    loadingMessage: 'Loading Eulerian path...'
  },

  // Backtracking algorithm routes
  {
    path: '/algorithms/backtracking/nqueens',
    component: LazyRoutes.NQueensPage,
    loadingMessage: 'Loading N-Queens problem...'
  },
  {
    path: '/algorithms/backtracking/traveling-salesman',
    component: LazyRoutes.TravelingSalesmanPage,
    loadingMessage: 'Loading traveling salesman...'
  },

  // Problem routes
  {
    path: '/algorithms/problems/chinese-postman',
    component: LazyRoutes.ChinesePostmanPage,
    loadingMessage: 'Loading Chinese postman problem...'
  },
  {
    path: '/algorithms/problems/minimum-edges-feedback-arc',
    component: LazyRoutes.MinimumEdgesFeedbackArcPage,
    loadingMessage: 'Loading minimum feedback arc...'
  },
  {
    path: '/algorithms/problems/traveling-salesman',
    component: LazyRoutes.TravelingSalesmanProblemPage,
    loadingMessage: 'Loading traveling salesman problem...'
  },
  {
    path: '/algorithms/problems/lowest-common-ancestor',
    component: LazyRoutes.LowestCommonAncestorPage,
    loadingMessage: 'Loading lowest common ancestor...'
  },
  {
    path: '/algorithms/problems/shortest-path-grid',
    component: LazyRoutes.ShortestPathGridPage,
    loadingMessage: 'Loading shortest path in grid...'
  },
  {
    path: '/algorithms/problems/minimum-knight-moves',
    component: LazyRoutes.MinimumKnightMovesPage,
    loadingMessage: 'Loading minimum knight moves...'
  },
  {
    path: '/algorithms/problems/number-of-islands',
    component: LazyRoutes.NumberOfIslandsPage,
    loadingMessage: 'Loading number of islands...'
  },
  {
    path: '/algorithms/problems/flood-fill',
    component: LazyRoutes.FloodFillPage,
    loadingMessage: 'Loading flood fill algorithm...'
  },
  {
    path: '/algorithms/problems/maze-solving',
    component: LazyRoutes.MazeSolvingPage,
    loadingMessage: 'Loading maze solving...'
  },
  {
    path: '/algorithms/problems/knights-tour',
    component: LazyRoutes.KnightsTourPage,
    loadingMessage: 'Loading knight\'s tour...'
  },
  {
    path: '/algorithms/problems/word-ladder',
    component: LazyRoutes.WordLadderPage,
    loadingMessage: 'Loading word ladder...'
  },
];

