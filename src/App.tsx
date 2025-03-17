import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider } from './themes/ThemeContext';
import GlobalStyle from './themes/GlobalStyle';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
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

// Import placeholder component for unimplemented algorithms
import ComingSoonPage from './pages/ComingSoonPage';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <AppContainer>
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
              <Route path="/algorithms/sorting" element={<SortingPage />} />
              <Route path="/algorithms/searching" element={<SearchingPage />} />
              
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
            </Routes>
          </ContentArea>
        </MainContent>
        <Footer />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App; 