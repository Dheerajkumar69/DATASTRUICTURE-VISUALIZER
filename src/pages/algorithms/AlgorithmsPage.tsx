import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FiBarChart2, 
  FiSearch, 
  FiGrid, 
  FiCode, 
  FiArrowRight 
} from 'react-icons/fi';
import { FaChessQueen, FaRoute, FaNetworkWired, FaProjectDiagram, FaRegCompass } from 'react-icons/fa';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.textLight};
  max-width: 800px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const CategoryCard = styled(Link)`
  background-color: ${props => props.theme.colors.card};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid ${props => props.theme.colors.border};
  text-decoration: none;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background-color: ${props => props.theme.colors.primary}05;
    border-radius: 50%;
    transform: translate(30%, -30%);
    z-index: 0;
  }
`;

const CategoryIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary}15;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  position: relative;
  z-index: 1;
  color: ${props => props.theme.colors.primary};
`;

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.colors.text};
  position: relative;
  z-index: 1;
`;

const CategoryDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex: 1;
  position: relative;
  z-index: 1;
`;

const AlgorithmsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
`;

const AlgorithmItem = styled.li`
  padding: 0.5rem 0;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;

  &::before {
    content: "•";
    color: ${props => props.theme.colors.primary};
    font-weight: bold;
    display: inline-block;
    width: 1rem;
    margin-right: 0.5rem;
  }
`;

const ViewButton = styled.span`
  display: flex;
  align-items: center;
  font-weight: 500;
  color: ${props => props.theme.colors.primary};
  position: relative;
  z-index: 1;
  
  svg {
    margin-left: 0.5rem;
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
`;

const AlgorithmsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Algorithms</PageTitle>
      <PageDescription>
        Algorithms are step-by-step procedures for solving problems or accomplishing tasks. This interactive
        visualizer helps you understand various algorithms through animated visualizations and code implementations.
        Explore different categories of algorithms to see how they work and learn their practical applications.
      </PageDescription>

      <CategoriesGrid>
        <CategoryCard to="/algorithms/sorting">
          <CategoryIcon>
            <FiBarChart2 size={28} />
          </CategoryIcon>
          <CategoryTitle>Sorting Algorithms</CategoryTitle>
          <CategoryDescription>
            Algorithms that arrange elements in a specific order, typically in ascending or descending sequence.
          </CategoryDescription>
          <AlgorithmsList>
            <AlgorithmItem>Bubble Sort, Selection Sort, Insertion Sort</AlgorithmItem>
            <AlgorithmItem>Merge Sort, Quick Sort, Heap Sort</AlgorithmItem>
            <AlgorithmItem>Radix Sort, Counting Sort, Bucket Sort</AlgorithmItem>
          </AlgorithmsList>
          <ViewButton>
            Explore Sorting Algorithms <FiArrowRight size={16} />
          </ViewButton>
        </CategoryCard>

        <CategoryCard to="/algorithms/searching">
          <CategoryIcon>
            <FiSearch size={28} />
          </CategoryIcon>
          <CategoryTitle>Searching Algorithms</CategoryTitle>
          <CategoryDescription>
            Algorithms designed to retrieve information stored within some data structure or calculated in the search space.
          </CategoryDescription>
          <AlgorithmsList>
            <AlgorithmItem>Linear Search, Binary Search</AlgorithmItem>
            <AlgorithmItem>BFS (Breadth-First Search), DFS (Depth-First Search)</AlgorithmItem>
            <AlgorithmItem>Jump Search, Interpolation Search</AlgorithmItem>
          </AlgorithmsList>
          <ViewButton>
            Explore Searching Algorithms <FiArrowRight size={16} />
          </ViewButton>
        </CategoryCard>

        <CategoryCard to="/algorithms/graph">
          <CategoryIcon>
            <FiGrid size={28} />
          </CategoryIcon>
          <CategoryTitle>Graph Algorithms</CategoryTitle>
          <CategoryDescription>
            Algorithms that perform computations on graphs or networks, including pathfinding and minimum spanning trees.
          </CategoryDescription>
          <AlgorithmsList>
            <AlgorithmItem>A* Search Algorithm</AlgorithmItem>
            <AlgorithmItem>Kruskal's Algorithm (Minimum Spanning Tree)</AlgorithmItem>
            <AlgorithmItem>Prim's Algorithm (Minimum Spanning Tree)</AlgorithmItem>
          </AlgorithmsList>
          <ViewButton>
            Explore Graph Algorithms <FiArrowRight size={16} />
          </ViewButton>
        </CategoryCard>

        <CategoryCard to="/algorithms/backtracking">
          <CategoryIcon>
            <FaChessQueen size={24} />
          </CategoryIcon>
          <CategoryTitle>Backtracking Algorithms</CategoryTitle>
          <CategoryDescription>
            Algorithms that build solutions incrementally and abandon a path when they determine it cannot lead to a valid solution.
          </CategoryDescription>
          <AlgorithmsList>
            <AlgorithmItem>N-Queens Problem</AlgorithmItem>
            <AlgorithmItem>Traveling Salesman Problem</AlgorithmItem>
          </AlgorithmsList>
          <ViewButton>
            Explore Backtracking Algorithms <FiArrowRight size={16} />
          </ViewButton>
        </CategoryCard>
      </CategoriesGrid>
    </PageContainer>
  );
};

export default AlgorithmsPage; 