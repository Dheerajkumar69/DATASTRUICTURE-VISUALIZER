import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme } from './themes/lightTheme';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ArrayPage from './pages/dataStructures/ArrayPage';
import LinkedListPage from './pages/dataStructures/LinkedListPage';
import StackPage from './pages/dataStructures/StackPage';
import QueuePage from './pages/dataStructures/QueuePage';
import TreePage from './pages/dataStructures/TreePage';
import GraphPage from './pages/dataStructures/GraphPage';
import HashTablePage from './pages/dataStructures/HashTablePage';
import HeapPage from './pages/dataStructures/HeapPage';
import SortingPage from './pages/algorithms/SortingPage';
import SearchingPage from './pages/algorithms/SearchingPage';

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
`;

const App: React.FC = () => {
  return (
    <ThemeProvider theme={lightTheme}>
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
              <Route path="/data-structures/tree" element={<TreePage />} />
              <Route path="/data-structures/graph" element={<GraphPage />} />
              <Route path="/data-structures/hash-table" element={<HashTablePage />} />
              <Route path="/data-structures/heap" element={<HeapPage />} />
              <Route path="/algorithms/sorting" element={<SortingPage />} />
              <Route path="/algorithms/searching" element={<SearchingPage />} />
            </Routes>
          </ContentArea>
        </MainContent>
        <Footer />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App; 