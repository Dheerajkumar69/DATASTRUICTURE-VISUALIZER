import { lazy } from 'react';

// Lazy load main pages
export const HomePage = lazy(() => import('../pages/HomePage'));
export const ComingSoonPage = lazy(() => import('../pages/ComingSoonPage'));

// Lazy load data structure pages
export const ArrayPage = lazy(() => import('../pages/dataStructures/ArrayPage'));
export const LinkedListPage = lazy(() => import('../pages/dataStructures/LinkedListPage'));
export const StackPage = lazy(() => import('../pages/dataStructures/StackPage'));
export const QueuePage = lazy(() => import('../pages/dataStructures/QueuePage'));
export const PriorityQueuePage = lazy(() => import('../pages/dataStructures/PriorityQueuePage'));
export const TreePage = lazy(() => import('../pages/dataStructures/TreePage'));
export const GraphPage = lazy(() => import('../pages/dataStructures/GraphPage'));
export const HashTablePage = lazy(() => import('../pages/dataStructures/HashTablePage'));
export const HeapPage = lazy(() => import('../pages/dataStructures/HeapPage'));
export const TriePage = lazy(() => import('../pages/dataStructures/TriePage'));

// Lazy load algorithm overview pages
export const AlgorithmsPage = lazy(() => import('../pages/algorithms/AlgorithmsPage'));
export const SortingPage = lazy(() => import('../pages/algorithms/SortingPage'));
export const SearchingPage = lazy(() => import('../pages/algorithms/SearchingPage'));
export const GraphAlgorithmsPage = lazy(() => import('../pages/algorithms/GraphAlgorithmsPage'));
export const BacktrackingPage = lazy(() => import('../pages/algorithms/backtracking/BacktrackingPage'));
export const ProblemsPage = lazy(() => import('../pages/algorithms/ProblemsPage'));

// Lazy load sorting algorithm pages
export const BubbleSortPage = lazy(() => import('../pages/algorithms/sorting/BubbleSortPage'));
export const SelectionSortPage = lazy(() => import('../pages/algorithms/sorting/SelectionSortPage'));
export const InsertionSortPage = lazy(() => import('../pages/algorithms/sorting/InsertionSortPage'));
export const MergeSortPage = lazy(() => import('../pages/algorithms/sorting/MergeSortPage'));
export const QuickSortPage = lazy(() => import('../pages/algorithms/sorting/QuickSortPage'));
export const HeapSortPage = lazy(() => import('../pages/algorithms/sorting/HeapSortPage'));
export const ShellSortPage = lazy(() => import('../pages/algorithms/sorting/ShellSortPage'));
export const CountingSortPage = lazy(() => import('../pages/algorithms/sorting/CountingSortPage'));
export const RadixSortPage = lazy(() => import('../pages/algorithms/sorting/RadixSortPage'));
export const BucketSortPage = lazy(() => import('../pages/algorithms/sorting/BucketSortPage'));

// Lazy load searching algorithm pages
export const BinarySearchPage = lazy(() => import('../pages/algorithms/searching/BinarySearchPage'));
export const LinearSearchPage = lazy(() => import('../pages/algorithms/searching/LinearSearchPage'));

// Lazy load math algorithm pages
export const EuclideanPage = lazy(() => import('../pages/algorithms/math/EuclideanPage'));
export const ExtendedEuclideanPage = lazy(() => import('../pages/algorithms/math/ExtendedEuclideanPage'));

// Lazy load array algorithm pages
export const KadanePage = lazy(() => import('../pages/algorithms/array/KadanePage'));
export const SlidingWindowPage = lazy(() => import('../pages/algorithms/array/SlidingWindowPage'));

// Lazy load graph algorithm pages
export const AStarPage = lazy(() => import('../pages/algorithms/graph/AStarPage'));
export const KruskalPage = lazy(() => import('../pages/algorithms/graph/KruskalPage'));
export const PrimPage = lazy(() => import('../pages/algorithms/graph/PrimPage'));
export const BFSPage = lazy(() => import('../pages/algorithms/graph/BFSPage'));
export const DFSPage = lazy(() => import('../pages/algorithms/graph/DFSPage'));
export const UndirectedCycleDetectionPage = lazy(() => import('../pages/algorithms/graph/UndirectedCycleDetectionPage'));
export const DirectedCycleDetectionPage = lazy(() => import('../pages/algorithms/graph/DirectedCycleDetectionPage'));
export const EulerianPathPage = lazy(() => import('../pages/algorithms/graph/EulerianPathPage'));
export const DijkstraPage = lazy(() => import('../pages/algorithms/graph/DijkstraPage'));
export const BellmanFordPage = lazy(() => import('../pages/algorithms/graph/BellmanFordPage'));
export const FloydWarshallPage = lazy(() => import('../pages/algorithms/graph/FloydWarshallPage'));
export const TopologicalSortPage = lazy(() => import('../pages/algorithms/graph/TopologicalSortPage'));
export const SCCPage = lazy(() => import('../pages/algorithms/graph/SCCPage'));
export const BridgesArticulationPage = lazy(() => import('../pages/algorithms/graph/BridgesArticulationPage'));
export const BipartiteCheckPage = lazy(() => import('../pages/algorithms/graph/BipartiteCheckPage'));
export const UnionFindPage = lazy(() => import('../pages/algorithms/graph/UnionFindPage'));
export const MaxFlowPage = lazy(() => import('../pages/algorithms/graph/MaxFlowPage'));
export const DAGPathsPage = lazy(() => import('../pages/algorithms/graph/DAGPathsPage'));

// Lazy load tree algorithm pages
export const BinarySearchTreePage = lazy(() => import('../pages/algorithms/tree/BinarySearchTreePage'));
export const BinaryTreeTraversalPage = lazy(() => import('../pages/algorithms/tree/BinaryTreeTraversalPage'));

// Lazy load backtracking algorithm pages
export const NQueensPage = lazy(() => import('../pages/algorithms/backtracking/NQueensPage'));
export const TravelingSalesmanPage = lazy(() => import('../pages/algorithms/backtracking/TravelingSalesmanPage'));

// Lazy load problem pages
export const ChinesePostmanPage = lazy(() => import('../pages/algorithms/problems/ChinesePostmanPage'));
export const MinimumEdgesFeedbackArcPage = lazy(() => import('../pages/algorithms/problems/MinimumEdgesFeedbackArcPage'));
export const TravelingSalesmanProblemPage = lazy(() => import('../pages/algorithms/problems/TravelingSalesmanPage'));
export const LowestCommonAncestorPage = lazy(() => import('../pages/algorithms/problems/LowestCommonAncestorPage'));
export const ShortestPathGridPage = lazy(() => import('../pages/algorithms/problems/ShortestPathGridPage'));
export const MinimumKnightMovesPage = lazy(() => import('../pages/algorithms/problems/MinimumKnightMovesPage'));
export const NumberOfIslandsPage = lazy(() => import('../pages/algorithms/problems/NumberOfIslandsPage'));
export const FloodFillPage = lazy(() => import('../pages/algorithms/problems/FloodFillPage'));
export const MazeSolvingPage = lazy(() => import('../pages/algorithms/problems/MazeSolvingPage'));
export const KnightsTourPage = lazy(() => import('../pages/algorithms/problems/KnightsTourPage'));
export const WordLadderPage = lazy(() => import('../pages/algorithms/problems/WordLadderPage'));

// New algorithm problem pages
export const AlgorithmProblemsIndexPage = lazy(() => import('../pages/algorithms/AlgorithmProblemsIndexPage'));
export const MaximumSubarrayPage = lazy(() => import('../pages/algorithms/problems/MaximumSubarrayPage'));
export const SlidingWindowMaxPage = lazy(() => import('../pages/algorithms/problems/SlidingWindowMaxPage'));
export const RotateArrayPage = lazy(() => import('../pages/algorithms/problems/RotateArrayPage'));
export const MergeIntervalsPage = lazy(() => import('../pages/algorithms/problems/MergeIntervalsPage'));
export const TwoSumPage = lazy(() => import('../pages/algorithms/problems/TwoSumPage'));
export const KadaneAlgorithmPage = lazy(() => import('../pages/algorithms/problems/KadaneAlgorithmPage'));
export const LongestCommonSubsequencePage = lazy(() => import('../pages/algorithms/problems/LongestCommonSubsequencePage'));
export const LongestPalindromicSubstringPage = lazy(() => import('../pages/algorithms/problems/LongestPalindromicSubstringPage'));
export const StringMatchingKMPPage = lazy(() => import('../pages/algorithms/problems/StringMatchingKMPPage'));
export const TrappingRainWaterPage = lazy(() => import('../pages/algorithms/problems/TrappingRainWaterPage'));
export const SlidingWindowMaximumPage = lazy(() => import('../pages/algorithms/problems/SlidingWindowMaximumPage'));
