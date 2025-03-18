import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaChessQueen, FaRoute, FaArrowLeft } from 'react-icons/fa';

// Styled components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavigationRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  text-decoration: none;
  margin-right: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textLight};
  max-width: 800px;
  line-height: 1.6;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const AlgorithmsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const AlgorithmCard = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background-color: ${props => props.theme.colors.card};
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary}20;
  margin-right: 1rem;
  color: ${props => props.theme.colors.primary};
`;

const AlgorithmTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  margin: 0;
`;

const AlgorithmDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
  line-height: 1.5;
  flex-grow: 1;
`;

const ComplexityInfo = styled.div`
  margin-top: 1rem;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textLight};
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 0.75rem;
`;

const ComplexityItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

const ComplexityLabel = styled.span`
  font-weight: 500;
`;

const ComplexityValue = styled.span`
  font-family: monospace;
`;

const BacktrackingPage: React.FC = () => {
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms">
          <FaArrowLeft /> Back to Algorithms
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Backtracking Algorithms</PageTitle>
        <Description>
          Backtracking is a general algorithmic technique that incrementally builds candidates to a solution and abandons
          a candidate ("backtracks") as soon as it determines that the candidate cannot be extended to a valid solution.
          Backtracking algorithms are particularly useful for solving constraint satisfaction problems, such as puzzles, 
          combinatorial optimization problems, and other search-based challenges.
        </Description>
      </PageHeader>
      
      <AlgorithmsGrid>
        <AlgorithmCard to="/algorithms/backtracking/nqueens">
          <CardHeader>
            <IconWrapper>
              <FaChessQueen size={24} />
            </IconWrapper>
            <AlgorithmTitle>N-Queens</AlgorithmTitle>
          </CardHeader>
          <AlgorithmDescription>
            The N-Queens problem asks how to place N chess queens on an N×N chessboard so that no two queens threaten each other.
            This classic problem demonstrates the power of backtracking to find valid arrangements by trying different queen placements
            and undoing those that lead to conflicts.
          </AlgorithmDescription>
          <ComplexityInfo>
            <ComplexityItem>
              <ComplexityLabel>Time Complexity:</ComplexityLabel>
              <ComplexityValue>O(N!)</ComplexityValue>
            </ComplexityItem>
            <ComplexityItem>
              <ComplexityLabel>Space Complexity:</ComplexityLabel>
              <ComplexityValue>O(N)</ComplexityValue>
            </ComplexityItem>
          </ComplexityInfo>
        </AlgorithmCard>
        
        <AlgorithmCard to="/algorithms/backtracking/traveling-salesman">
          <CardHeader>
            <IconWrapper>
              <FaRoute size={24} />
            </IconWrapper>
            <AlgorithmTitle>Traveling Salesman</AlgorithmTitle>
          </CardHeader>
          <AlgorithmDescription>
            The Traveling Salesman Problem (TSP) is about finding the shortest possible route that visits each city exactly once
            and returns to the origin city. This visualization shows how backtracking with pruning can be used to find the optimal
            route through a set of cities.
          </AlgorithmDescription>
          <ComplexityInfo>
            <ComplexityItem>
              <ComplexityLabel>Time Complexity:</ComplexityLabel>
              <ComplexityValue>O(N!)</ComplexityValue>
            </ComplexityItem>
            <ComplexityItem>
              <ComplexityLabel>Space Complexity:</ComplexityLabel>
              <ComplexityValue>O(N)</ComplexityValue>
            </ComplexityItem>
          </ComplexityInfo>
        </AlgorithmCard>
      </AlgorithmsGrid>
    </PageContainer>
  );
};

export default BacktrackingPage; 