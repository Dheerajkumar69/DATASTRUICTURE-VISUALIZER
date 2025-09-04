import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider } from './themes/ThemeContext';
// import { AnimationProvider } from './components/utils/AnimationContext';
import GlobalStyle from './themes/GlobalStyle';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/utils/ScrollToTop';
import ErrorBoundary from './components/utils/ErrorBoundary';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ArrayPage = React.lazy(() => import('./pages/dataStructures/ArrayPage'));
const LinkedListPage = React.lazy(() => import('./pages/dataStructures/LinkedListPage'));
const StackPage = React.lazy(() => import('./pages/dataStructures/StackPage'));
const QueuePage = React.lazy(() => import('./pages/dataStructures/QueuePage'));
const PriorityQueuePage = React.lazy(() => import('./pages/dataStructures/PriorityQueuePage'));
const TreePage = React.lazy(() => import('./pages/dataStructures/TreePage'));
const GraphPage = React.lazy(() => import('./pages/dataStructures/GraphPage'));
const HashTablePage = React.lazy(() => import('./pages/dataStructures/HashTablePage'));
const HeapPage = React.lazy(() => import('./pages/dataStructures/HeapPage'));
const TriePage = React.lazy(() => import('./pages/dataStructures/TriePage'));
const SortingPage = React.lazy(() => import('./pages/algorithms/SortingPage'));
const SearchingPage = React.lazy(() => import('./pages/algorithms/SearchingPage'));
const AlgorithmsPage = React.lazy(() => import('./pages/algorithms/AlgorithmsPage'));

// Lazy load sorting algorithm pages
const BubbleSortPage = React.lazy(() => import('./pages/algorithms/sorting/BubbleSortPage'));
const SelectionSortPage = React.lazy(() => import('./pages/algorithms/sorting/SelectionSortPage'));
const InsertionSortPage = React.lazy(() => import('./pages/algorithms/sorting/InsertionSortPage'));
const MergeSortPage = React.lazy(() => import('./pages/algorithms/sorting/MergeSortPage'));
const QuickSortPage = React.lazy(() => import('./pages/algorithms/sorting/QuickSortPage'));
const HeapSortPage = React.lazy(() => import('./pages/algorithms/sorting/HeapSortPage'));
const ShellSortPage = React.lazy(() => import('./pages/algorithms/sorting/ShellSortPage'));
const CountingSortPage = React.lazy(() => import('./pages/algorithms/sorting/CountingSortPage'));
const RadixSortPage = React.lazy(() => import('./pages/algorithms/sorting/RadixSortPage'));
const BucketSortPage = React.lazy(() => import('./pages/algorithms/sorting/BucketSortPage'));

// Lazy load math algorithm pages
const EuclideanPage = React.lazy(() => import('./pages/algorithms/math/EuclideanPage'));
const ExtendedEuclideanPage = React.lazy(() => import('./pages/algorithms/math/ExtendedEuclideanPage'));

// Lazy load array algorithm pages
const KadanePage = React.lazy(() => import('./pages/algorithms/array/KadanePage'));
const SlidingWindowPage = React.lazy(() => import('./pages/algorithms/array/SlidingWindowPage'));

// Lazy load graph algorithm pages
const GraphAlgorithmsPage = React.lazy(() => import('./pages/algorithms/GraphAlgorithmsPage'));
const AStarPage = React.lazy(() => import('./pages/algorithms/graph/AStarPage'));
const KruskalPage = React.lazy(() => import('./pages/algorithms/graph/KruskalPage'));
const PrimPage = React.lazy(() => import('./pages/algorithms/graph/PrimPage'));

// Lazy load backtracking algorithm pages
const BacktrackingPage = React.lazy(() => import('./pages/algorithms/backtracking/BacktrackingPage'));
const NQueensPage = React.lazy(() => import('./pages/algorithms/backtracking/NQueensPage'));
const TravelingSalesmanPage = React.lazy(() => import('./pages/algorithms/backtracking/TravelingSalesmanPage'));

// Lazy load algorithm problems pages
const ProblemsPage = React.lazy(() => import('./pages/algorithms/ProblemsPage'));
const UndirectedCycleDetectionPage = React.lazy(() => import('./pages/algorithms/problems/UndirectedCycleDetectionPage'));
const DirectedCycleDetectionPage = React.lazy(() => import('./pages/algorithms/problems/DirectedCycleDetectionPage'));
const EulerianPathPage = React.lazy(() => import('./pages/algorithms/problems/EulerianPathPage'));
const ChinesePostmanPage = React.lazy(() => import('./pages/algorithms/problems/ChinesePostmanPage'));
const MinimumEdgesFeedbackArcPage = React.lazy(() => import('./pages/algorithms/problems/MinimumEdgesFeedbackArcPage'));
const TravelingSalesmanProblemPage = React.lazy(() => import('./pages/algorithms/problems/TravelingSalesmanPage'));
const LowestCommonAncestorPage = React.lazy(() => import('./pages/algorithms/problems/LowestCommonAncestorPage'));
const ShortestPathGridPage = React.lazy(() => import('./pages/algorithms/problems/ShortestPathGridPage'));
const MinimumKnightMovesPage = React.lazy(() => import('./pages/algorithms/problems/MinimumKnightMovesPage'));
const NumberOfIslandsPage = React.lazy(() => import('./pages/algorithms/problems/NumberOfIslandsPage'));
const FloodFillPage = React.lazy(() => import('./pages/algorithms/problems/FloodFillPage'));
const MazeSolvingPage = React.lazy(() => import('./pages/algorithms/problems/MazeSolvingPage'));
const KnightsTourPage = React.lazy(() => import('./pages/algorithms/problems/KnightsTourPage'));
const WordLadderPage = React.lazy(() => import('./pages/algorithms/problems/WordLadderPage'));

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;

  ${({ theme }) => theme.media.tablet} {
    padding: 1.5rem;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 1rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <AppContainer>
        <ScrollToTop />
        <Header />
        <MainContent>
          <Sidebar />
          <ContentArea>
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner>Loading...</LoadingSpinner>}>
                <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/data-structures/array" element={<ArrayPage />} />
                <Route path="/data-structures/linked-list" element={<LinkedListPage />} />
                <Route path="/data-structures/stack" element={<StackPage />} />
                <Route path="/data-structures/queue" element={<QueuePage />} />
                <Route path="/data-structures/priority-queue" element={<PriorityQueuePage />} />
                <Route path="/data-structures/tree" element={<TreePage />} />
                <Route path="/data-structures/graph" element={<GraphPage />} />
                <Route path="/data-structures/hash-table" element={<HashTablePage />} />
                <Route path="/data-structures/heap" element={<HeapPage />} />
                <Route path="/data-structures/trie" element={<TriePage />} />
                <Route path="/algorithms" element={<AlgorithmsPage />} />
                <Route path="/algorithms/sorting" element={<SortingPage />} />
                <Route path="/algorithms/searching" element={<SearchingPage />} />
                <Route path="/algorithms/graph" element={<GraphAlgorithmsPage />} />
                <Route path="/algorithms/backtracking" element={<BacktrackingPage />} />
                <Route path="/algorithms/problems" element={<ProblemsPage />} />
              
              {/* Sorting Algorithm Routes */}
              <Route path="/algorithms/sorting/bubble-sort" element={<BubbleSortPage />} />
              <Route path="/algorithms/sorting/selection-sort" element={<SelectionSortPage />} />
              <Route path="/algorithms/sorting/insertion-sort" element={<InsertionSortPage />} />
              <Route path="/algorithms/sorting/merge-sort" element={<MergeSortPage />} />
              <Route path="/algorithms/sorting/quick-sort" element={<QuickSortPage />} />
              <Route path="/algorithms/sorting/heap-sort" element={<HeapSortPage />} />
              <Route path="/algorithms/sorting/shell-sort" element={<ShellSortPage />} />
              <Route path="/algorithms/sorting/counting-sort" element={<CountingSortPage />} />
              <Route path="/algorithms/sorting/radix-sort" element={<RadixSortPage />} />
              <Route path="/algorithms/sorting/bucket-sort" element={<BucketSortPage />} />
              
              {/* Math Algorithm Routes */}
              <Route path="/algorithms/math/euclidean" element={<EuclideanPage />} />
              <Route path="/algorithms/math/extended-euclidean" element={<ExtendedEuclideanPage />} />
              
              {/* Array Algorithm Routes */}
              <Route path="/algorithms/array/kadane" element={<KadanePage />} />
              <Route path="/algorithms/array/sliding-window" element={<SlidingWindowPage />} />
              
              {/* Graph Algorithm Routes */}
              <Route path="/algorithms/graph/astar" element={<AStarPage />} />
              <Route path="/algorithms/graph/kruskal" element={<KruskalPage />} />
              <Route path="/algorithms/graph/prim" element={<PrimPage />} />
              
              {/* Backtracking Algorithm Routes */}
              <Route path="/algorithms/backtracking/nqueens" element={<NQueensPage />} />
              <Route path="/algorithms/backtracking/traveling-salesman" element={<TravelingSalesmanPage />} />
              
              {/* Algorithm Problems Routes */}
              <Route path="/algorithms/problems/undirected-cycle-detection" element={<UndirectedCycleDetectionPage />} />
              <Route path="/algorithms/problems/directed-cycle-detection" element={<DirectedCycleDetectionPage />} />
              <Route path="/algorithms/problems/eulerian-path" element={<EulerianPathPage />} />
              <Route path="/algorithms/problems/chinese-postman" element={<ChinesePostmanPage />} />
              <Route path="/algorithms/problems/minimum-edges-feedback-arc" element={<MinimumEdgesFeedbackArcPage />} />
              <Route path="/algorithms/problems/traveling-salesman" element={<TravelingSalesmanProblemPage />} />
              <Route path="/algorithms/problems/lowest-common-ancestor" element={<LowestCommonAncestorPage />} />
              <Route path="/algorithms/problems/shortest-path-grid" element={<ShortestPathGridPage />} />
              <Route path="/algorithms/problems/minimum-knight-moves" element={<MinimumKnightMovesPage />} />
              <Route path="/algorithms/problems/number-of-islands" element={<NumberOfIslandsPage />} />
              <Route path="/algorithms/problems/flood-fill" element={<FloodFillPage />} />
              <Route path="/algorithms/problems/maze-solving" element={<MazeSolvingPage />} />
              <Route path="/algorithms/problems/knights-tour" element={<KnightsTourPage />} />
              <Route path="/algorithms/problems/word-ladder" element={<WordLadderPage />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </ContentArea>
        </MainContent>
        <Footer />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App; 