import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaProjectDiagram,
  FaTree,
  FaChessKnight,
  FaNetworkWired,
  FaRegCompass,
  FaRandom,
  FaRoute,
  FaGlobeAmericas,
  FaWater,
  FaPuzzlePiece,
  FaMapMarkerAlt,
  FaSearchLocation,
  FaDoorOpen,
  FaCode,
  FaLaptopCode
} from 'react-icons/fa';

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
  color: ${({ theme }) => theme.colors.card};
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

const ProblemsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Algorithm Problems</PageTitle>
      <PageDescription>
        Explore interactive visualizations of classic algorithm problems. These visualizations help you understand how different algorithms solve specific problems, step by step.
      </PageDescription>

      <SectionTitle>Graph Problems</SectionTitle>
      <AlgorithmsGrid>
        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaProjectDiagram size={24} />
            </AlgorithmIcon>
            Cycle Detection in Undirected Graph
          </AlgorithmTitle>
          <AlgorithmDescription>
            Visualize how depth-first search (DFS) can be used to detect cycles in an undirected graph, a common problem in graph theory.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/problems/undirected-cycle-detection">Visualize Cycle Detection</AlgorithmLink>
        </AlgorithmCard>

        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaNetworkWired size={24} />
            </AlgorithmIcon>
            Directed Cycle Detection
          </AlgorithmTitle>
          <AlgorithmDescription>
            Learn how to detect cycles in directed graphs, which is essential for identifying circular dependencies and potential deadlocks.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/problems/directed-cycle-detection">Visualize Directed Cycle Detection</AlgorithmLink>
        </AlgorithmCard>

        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaRoute size={24} />
            </AlgorithmIcon>
            Eulerian Path
          </AlgorithmTitle>
          <AlgorithmDescription>
            Explore Eulerian paths and circuits, which visit every edge exactly once. This concept has applications in circuit design and network traversal.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/problems/eulerian-path">Visualize Eulerian Path</AlgorithmLink>
        </AlgorithmCard>

        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaGlobeAmericas size={24} />
            </AlgorithmIcon>
            Chinese Postman Problem
          </AlgorithmTitle>
          <AlgorithmDescription>
            Explore the Chinese Postman Problem, which finds the shortest path that visits every edge at least once, with applications in route planning.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/problems/chinese-postman">Visualize Chinese Postman</AlgorithmLink>
        </AlgorithmCard>

        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaRandom size={24} />
            </AlgorithmIcon>
            Minimum Edges Feedback Arc
          </AlgorithmTitle>
          <AlgorithmDescription>
            Visualize the Feedback Arc Set problem, which involves finding the minimum number of edges to remove to make a directed graph acyclic.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/problems/minimum-edges-feedback-arc">Visualize Feedback Arc Set</AlgorithmLink>
        </AlgorithmCard>

        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaRoute size={24} />
            </AlgorithmIcon>
            Traveling Salesman Problem
          </AlgorithmTitle>
          <AlgorithmDescription>
            Explore one of the most famous NP-hard problems in computer science: finding the shortest possible route that visits every city once and returns to the origin.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/problems/traveling-salesman">Visualize TSP</AlgorithmLink>
        </AlgorithmCard>
      </AlgorithmsGrid>

      <SectionTitle>Tree Problems</SectionTitle>
      <AlgorithmsGrid>
        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaTree size={24} />
            </AlgorithmIcon>
            Lowest Common Ancestor
          </AlgorithmTitle>
          <AlgorithmDescription>
            Visualize how to find the lowest common ancestor of two nodes in a tree, a problem with applications in networking, computational biology, and more.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/problems/lowest-common-ancestor">Visualize LCA</AlgorithmLink>
        </AlgorithmCard>
      </AlgorithmsGrid>

      <SectionTitle>Grid-Based Problems</SectionTitle>
      <AlgorithmsGrid>
        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaSearchLocation size={24} />
            </AlgorithmIcon>
            Shortest Path in Grid
          </AlgorithmTitle>
          <AlgorithmDescription>
            Find the shortest path between two points in a grid with obstacles using breadth-first search (BFS).
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/problems/shortest-path-grid">Visualize Grid Pathfinding</AlgorithmLink>
        </AlgorithmCard>

        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaChessKnight size={24} />
            </AlgorithmIcon>
            Minimum Knight Moves
          </AlgorithmTitle>
          <AlgorithmDescription>
            Visualize how to find the minimum number of moves a knight needs to reach a target position on a chessboard.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/problems/minimum-knight-moves">Visualize Knight Moves</AlgorithmLink>
        </AlgorithmCard>

        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaWater size={24} />
            </AlgorithmIcon>
            Number of Islands
          </AlgorithmTitle>
          <AlgorithmDescription>
            Count the number of islands (connected land cells) in a 2D grid representing a map. This problem demonstrates the use of DFS or BFS for connected component analysis.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/problems/number-of-islands">Visualize Island Counting</AlgorithmLink>
        </AlgorithmCard>

        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaMapMarkerAlt size={24} />
            </AlgorithmIcon>
            Flood Fill
          </AlgorithmTitle>
          <AlgorithmDescription>
            Visualize the flood fill algorithm, similar to the "paint bucket" tool in image editing programs, which fills connected regions with a new color.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/problems/flood-fill">Visualize Flood Fill</AlgorithmLink>
        </AlgorithmCard>

        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaDoorOpen size={24} />
            </AlgorithmIcon>
            Maze Solving
          </AlgorithmTitle>
          <AlgorithmDescription>
            See how algorithms like DFS, BFS, and A* can solve mazes by finding a path from the entrance to the exit.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/problems/maze-solving">Visualize Maze Solving</AlgorithmLink>
        </AlgorithmCard>

        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaChessKnight size={24} />
            </AlgorithmIcon>
            Knight's Tour
          </AlgorithmTitle>
          <AlgorithmDescription>
            Visualize the Knight's Tour problem, where a knight visits every square on a chessboard exactly once.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/problems/knights-tour">Visualize Knight's Tour</AlgorithmLink>
        </AlgorithmCard>
      </AlgorithmsGrid>

      <SectionTitle>Other Problems</SectionTitle>
      <AlgorithmsGrid>
        <AlgorithmCard>
          <AlgorithmTitle>
            <AlgorithmIcon>
              <FaCode size={24} />
            </AlgorithmIcon>
            Word Ladder
          </AlgorithmTitle>
          <AlgorithmDescription>
            Visualize how to transform one word into another by changing one letter at a time, with each intermediate word being valid.
          </AlgorithmDescription>
          <AlgorithmLink to="/algorithms/problems/word-ladder">Visualize Word Ladder</AlgorithmLink>
        </AlgorithmCard>
      </AlgorithmsGrid>
    </PageContainer>
  );
};

export default ProblemsPage; 