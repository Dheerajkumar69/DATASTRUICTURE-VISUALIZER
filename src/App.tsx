import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider } from './themes/ThemeContext';
import { AnimationProvider } from './components/utils/AnimationContext';
import GlobalStyle from './themes/GlobalStyle';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/utils/ScrollToTop';
import HomePage from './pages/HomePage';
import ArrayPage from './pages/dataStructures/ArrayPage';
import LinkedListPage from './pages/dataStructures/LinkedListPage';
import StackPage from './pages/dataStructures/StackPage';
import QueuePage from './pages/dataStructures/QueuePage';
import PriorityQueuePage from './pages/dataStructures/PriorityQueuePage';
import TreePage from './pages/dataStructures/TreePage';
import GraphPage from './pages/dataStructures/GraphPage';
import HashTablePage from './pages/dataStructures/HashTablePage';
import HeapPage from './pages/dataStructures/HeapPage';
import TriePage from './pages/dataStructures/TriePage';
import SortingPage from './pages/algorithms/SortingPage';
import SearchingPage from './pages/algorithms/SearchingPage';
import AlgorithmsPage from './pages/algorithms/AlgorithmsPage';

// Import sorting algorithm pages
import BubbleSortPage from './pages/algorithms/sorting/BubbleSortPage';
import SelectionSortPage from './pages/algorithms/sorting/SelectionSortPage';
import InsertionSortPage from './pages/algorithms/sorting/InsertionSortPage';
import MergeSortPage from './pages/algorithms/sorting/MergeSortPage';
import QuickSortPage from './pages/algorithms/sorting/QuickSortPage';
import HeapSortPage from './pages/algorithms/sorting/HeapSortPage';
import ShellSortPage from './pages/algorithms/sorting/ShellSortPage';
import CountingSortPage from './pages/algorithms/sorting/CountingSortPage';
import RadixSortPage from './pages/algorithms/sorting/RadixSortPage';
import BucketSortPage from './pages/algorithms/sorting/BucketSortPage';

// Import math algorithm pages
import EuclideanPage from './pages/algorithms/math/EuclideanPage';
import ExtendedEuclideanPage from './pages/algorithms/math/ExtendedEuclideanPage';

// Import array algorithm pages
import KadanePage from './pages/algorithms/array/KadanePage';
import SlidingWindowPage from './pages/algorithms/array/SlidingWindowPage';

// Import graph algorithm pages
import GraphAlgorithmsPage from './pages/algorithms/GraphAlgorithmsPage';
import AStarPage from './pages/algorithms/graph/AStarPage';
import KruskalPage from './pages/algorithms/graph/KruskalPage';
import PrimPage from './pages/algorithms/graph/PrimPage';

// Import backtracking algorithm pages
import BacktrackingPage from './pages/algorithms/backtracking/BacktrackingPage';
import NQueensPage from './pages/algorithms/backtracking/NQueensPage';
import TravelingSalesmanPage from './pages/algorithms/backtracking/TravelingSalesmanPage';

// Import algorithm problems pages
import ProblemsPage from './pages/algorithms/ProblemsPage';
import UndirectedCycleDetectionPage from './pages/algorithms/graph/UndirectedCycleDetectionPage';
import DirectedCycleDetectionPage from './pages/algorithms/graph/DirectedCycleDetectionPage';
import EulerianPathPage from './pages/algorithms/graph/EulerianPathPage';
import ChinesePostmanPage from './pages/algorithms/problems/ChinesePostmanPage';
import MinimumEdgesFeedbackArcPage from './pages/algorithms/problems/MinimumEdgesFeedbackArcPage';
import TravelingSalesmanProblemPage from './pages/algorithms/problems/TravelingSalesmanPage';
import LowestCommonAncestorPage from './pages/algorithms/problems/LowestCommonAncestorPage';
import ShortestPathGridPage from './pages/algorithms/problems/ShortestPathGridPage';
import MinimumKnightMovesPage from './pages/algorithms/problems/MinimumKnightMovesPage';
import NumberOfIslandsPage from './pages/algorithms/problems/NumberOfIslandsPage';
import FloodFillPage from './pages/algorithms/problems/FloodFillPage';
import MazeSolvingPage from './pages/algorithms/problems/MazeSolvingPage';
import KnightsTourPage from './pages/algorithms/problems/KnightsTourPage';
import WordLadderPage from './pages/algorithms/problems/WordLadderPage';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  position: relative;
  transition: all 0.3s ease;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: background-color 0.3s ease, color 0.3s ease;
  min-height: calc(100vh - 100px); /* Account for header and footer */
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1.5rem 1rem;
  }
`;

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AnimationProvider>
        <GlobalStyle />
        <AppContainer>
          <ScrollToTop />
          <Header />
          <MainContent>
            <Sidebar />
            <ContentArea>
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
                
                {/* Graph Algorithm Routes */}
                <Route path="/algorithms/graph/undirected-cycle-detection" element={<UndirectedCycleDetectionPage />} />
                <Route path="/algorithms/graph/directed-cycle-detection" element={<DirectedCycleDetectionPage />} />
                <Route path="/algorithms/graph/eulerian-path" element={<EulerianPathPage />} />
              </Routes>
            </ContentArea>
          </MainContent>
          <Footer />
        </AppContainer>
      </AnimationProvider>
    </ThemeProvider>
  );
};

export default App; 