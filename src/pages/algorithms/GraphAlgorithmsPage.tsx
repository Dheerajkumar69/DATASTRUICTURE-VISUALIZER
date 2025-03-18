import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaCompass, FaNetworkWired, FaProjectDiagram } from 'react-icons/fa';

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

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const AlgorithmsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin: 2rem 0 1.5rem;
  color: ${props => props.theme.colors.text};
  border-bottom: 2px solid ${props => props.theme.colors.primary};
  padding-bottom: 0.5rem;
  width: fit-content;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const AlgorithmCard = styled.div`
  background-color: ${props => props.theme.colors.card};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid ${props => props.theme.colors.border};
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const AlgorithmTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
`;

const AlgorithmIcon = styled.div`
  margin-right: 0.75rem;
  color: ${props => props.theme.colors.primary};
`;

const AlgorithmDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex: 1;
`;

const AlgorithmLink = styled(Link)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  text-decoration: none;
  text-align: center;
  font-weight: 500;
  transition: background-color 0.2s ease;
  display: inline-block;
  align-self: flex-start;

  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const GraphAlgorithmsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Graph Algorithms</PageTitle>
      <PageDescription>
        Graph algorithms are a set of instructions that traverse, search, or manipulate graphs. These algorithms are fundamental to solving many complex problems in computer science, ranging from finding the shortest path between two points to detecting cycles in a graph.
      </PageDescription>

      <SectionTitle>Pathfinding Algorithms</SectionTitle>
      <AlgorithmsGrid>
        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaCompass size={24} />
            </AlgorithmIcon>
            A* Search Algorithm
          </AlgorithmTitle>
          <AlgorithmDescription>
            A* (pronounced "A star") is a popular pathfinding algorithm that combines Dijkstra's algorithm and greedy best-first search. It uses a heuristic to guide its search, making it more efficient while guaranteeing an optimal path.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/graph/astar">Visualize A* Search</AlgorithmLink>
        </AlgorithmCard>
      </AlgorithmsGrid>

      <SectionTitle>Minimum Spanning Tree Algorithms</SectionTitle>
      <AlgorithmsGrid>
        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaNetworkWired size={24} />
            </AlgorithmIcon>
            Kruskal's Algorithm
          </AlgorithmTitle>
          <AlgorithmDescription>
            Kruskal's algorithm finds a minimum spanning tree for a connected weighted graph. It follows a greedy approach by adding the edge with the least weight that doesn't form a cycle with edges already in the tree.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/graph/kruskal">Visualize Kruskal's</AlgorithmLink>
        </AlgorithmCard>
        
        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaProjectDiagram size={24} />
            </AlgorithmIcon>
            Prim's Algorithm
          </AlgorithmTitle>
          <AlgorithmDescription>
            Prim's algorithm also finds a minimum spanning tree for a weighted undirected graph. It starts from a vertex and grows the tree by adding the cheapest edge that connects a vertex in the tree to a vertex outside the tree.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/graph/prim">Visualize Prim's</AlgorithmLink>
        </AlgorithmCard>
      </AlgorithmsGrid>
    </PageContainer>
  );
};

export default GraphAlgorithmsPage; 