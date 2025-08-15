import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiBarChart2, 
  FiMaximize2, 
  FiDroplet, 
  FiRotateCw,
  FiLayers,
  FiType,
  FiGrid,
  FiSearch,
  FiEdit,
  FiShuffle,
  FiPlay
} from 'react-icons/fi';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Description = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 3rem;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  text-align: center;

  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 1rem;
  }

  p {
    color: ${({ theme }) => theme.colors.textLight};
    line-height: 1.6;
    font-size: 1.1rem;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CategoryTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
`;

const ProblemsGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const ProblemCard = styled(Link)<{ difficulty: 'Easy' | 'Medium' | 'Hard' }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    transform: translateX(4px);
  }
`;

const ProblemInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ProblemTitle = styled.h4`
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
`;

const ProblemDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
`;

const DifficultyBadge = styled.span<{ difficulty: 'Easy' | 'Medium' | 'Hard' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 1rem;
  
  background-color: ${({ difficulty }) => 
    difficulty === 'Easy' ? '#D1FAE5' :
    difficulty === 'Medium' ? '#FEF3C7' : '#FEE2E2'};
  
  color: ${({ difficulty }) => 
    difficulty === 'Easy' ? '#065F46' :
    difficulty === 'Medium' ? '#92400E' : '#991B1B'};
`;

const StatsSection = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  .label {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .value {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 2rem;
    font-weight: 700;
  }
`;

const AlgorithmProblemsIndexPage: React.FC = () => {
  const arrayProblems = [
    {
      title: "Maximum Subarray Sum (Kadane's)",
      description: "Find the contiguous subarray with the largest sum",
      route: "/algorithms/problems/maximum-subarray",
      difficulty: "Medium" as const,
      icon: <FiBarChart2 />
    },
    {
      title: "Sliding Window Maximum",
      description: "Find maximum in each sliding window of size k",
      route: "/algorithms/problems/sliding-window-maximum",
      difficulty: "Hard" as const,
      icon: <FiMaximize2 />
    },
    {
      title: "Trapping Rain Water",
      description: "Calculate how much rainwater can be trapped",
      route: "/algorithms/problems/trapping-rain-water",
      difficulty: "Hard" as const,
      icon: <FiDroplet />
    },
    {
      title: "Rotate Array",
      description: "Rotate array to the right by k steps (multiple approaches)",
      route: "/algorithms/problems/rotate-array",
      difficulty: "Medium" as const,
      icon: <FiRotateCw />
    },
    {
      title: "Merge Intervals",
      description: "Merge all overlapping intervals",
      route: "/algorithms/problems/merge-intervals",
      difficulty: "Medium" as const,
      icon: <FiLayers />
    },
    {
      title: "Search in 2D Matrix",
      description: "Search for a target in a sorted 2D matrix",
      route: "/algorithms/problems/search-2d-matrix",
      difficulty: "Medium" as const,
      icon: <FiSearch />
    },
    {
      title: "Spiral Order Traversal",
      description: "Traverse a matrix in spiral order",
      route: "/algorithms/problems/spiral-traversal",
      difficulty: "Medium" as const,
      icon: <FiShuffle />
    },
    {
      title: "Kadane Algorithm",
      description: "Maximum subarray sum using dynamic programming",
      route: "/algorithms/problems/kadane-algorithm",
      difficulty: "Medium" as const,
      icon: <FiBarChart2 />
    }
  ];

  const stringProblems = [
    {
      title: "Longest Common Subsequence (LCS)",
      description: "Find the longest common subsequence between two strings",
      route: "/algorithms/problems/longest-common-subsequence",
      difficulty: "Medium" as const,
      icon: <FiType />
    },
    {
      title: "Longest Palindromic Substring",
      description: "Find the longest palindromic substring",
      route: "/algorithms/problems/longest-palindromic-substring",
      difficulty: "Medium" as const,
      icon: <FiType />
    },
    {
      title: "String Matching (KMP)",
      description: "Pattern matching using KMP algorithm",
      route: "/algorithms/problems/string-matching-kmp",
      difficulty: "Medium" as const,
      icon: <FiSearch />
    },
    {
      title: "Edit Distance",
      description: "Calculate minimum edit distance between two strings",
      route: "/algorithms/problems/edit-distance",
      difficulty: "Medium" as const,
      icon: <FiEdit />
    },
    {
      title: "Two Sum",
      description: "Find two numbers that add up to a target",
      route: "/algorithms/problems/two-sum",
      difficulty: "Easy" as const,
      icon: <FiBarChart2 />
    }
  ];

  const matrixProblems = [
    {
      title: "Matrix Rotation (90°, 180°)",
      description: "Rotate matrix by various angles in-place",
      route: "/algorithms/problems/matrix-rotation",
      difficulty: "Medium" as const,
      icon: <FiRotateCw />
    },
    {
      title: "Game of Life",
      description: "Simulate Conway's Game of Life transitions",
      route: "/algorithms/problems/game-of-life",
      difficulty: "Medium" as const,
      icon: <FiGrid />
    }
  ];

  const totalProblems = arrayProblems.length + stringProblems.length + matrixProblems.length;
  const easyProblems = [...arrayProblems, ...stringProblems, ...matrixProblems].filter(p => p.difficulty === 'Easy').length;
  const mediumProblems = [...arrayProblems, ...stringProblems, ...matrixProblems].filter(p => p.difficulty === 'Medium').length;
  const hardProblems = [...arrayProblems, ...stringProblems, ...matrixProblems].filter(p => p.difficulty === 'Hard').length;

  return (
    <Container>
      <Title>
        <FiPlay />
        Algorithm Problems Visualizer
      </Title>

      <Description>
        <h3>Interactive Algorithm Problem Solutions</h3>
        <p>
          Explore classic algorithm problems with step-by-step visualizations. 
          Each problem includes multiple solution approaches, complexity analysis, and interactive demonstrations
          to help you understand the underlying concepts and patterns.
        </p>
      </Description>

      <StatsSection>
        <h3 style={{ color: 'inherit', marginBottom: '1rem' }}>Problem Statistics</h3>
        <StatsGrid>
          <StatCard>
            <div className="label">Total Problems</div>
            <div className="value">{totalProblems}</div>
          </StatCard>
          <StatCard>
            <div className="label">Easy</div>
            <div className="value" style={{ color: '#10B981' }}>{easyProblems}</div>
          </StatCard>
          <StatCard>
            <div className="label">Medium</div>
            <div className="value" style={{ color: '#F59E0B' }}>{mediumProblems}</div>
          </StatCard>
          <StatCard>
            <div className="label">Hard</div>
            <div className="value" style={{ color: '#EF4444' }}>{hardProblems}</div>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      <CategoriesGrid>
        <CategoryCard>
          <CategoryTitle>
            <FiBarChart2 />
            Array & Dynamic Programming
          </CategoryTitle>
          <ProblemsGrid>
            {arrayProblems.map((problem, index) => (
              <ProblemCard key={index} to={problem.route} difficulty={problem.difficulty}>
                <ProblemInfo>
                  <ProblemTitle>{problem.title}</ProblemTitle>
                  <ProblemDescription>{problem.description}</ProblemDescription>
                </ProblemInfo>
                <DifficultyBadge difficulty={problem.difficulty}>
                  {problem.difficulty}
                </DifficultyBadge>
              </ProblemCard>
            ))}
          </ProblemsGrid>
        </CategoryCard>

        <CategoryCard>
          <CategoryTitle>
            <FiType />
            String Algorithms
          </CategoryTitle>
          <ProblemsGrid>
            {stringProblems.map((problem, index) => (
              <ProblemCard key={index} to={problem.route} difficulty={problem.difficulty}>
                <ProblemInfo>
                  <ProblemTitle>{problem.title}</ProblemTitle>
                  <ProblemDescription>{problem.description}</ProblemDescription>
                </ProblemInfo>
                <DifficultyBadge difficulty={problem.difficulty}>
                  {problem.difficulty}
                </DifficultyBadge>
              </ProblemCard>
            ))}
          </ProblemsGrid>
        </CategoryCard>

        <CategoryCard>
          <CategoryTitle>
            <FiGrid />
            Matrix & 2D Problems
          </CategoryTitle>
          <ProblemsGrid>
            {matrixProblems.map((problem, index) => (
              <ProblemCard key={index} to={problem.route} difficulty={problem.difficulty}>
                <ProblemInfo>
                  <ProblemTitle>{problem.title}</ProblemTitle>
                  <ProblemDescription>{problem.description}</ProblemDescription>
                </ProblemInfo>
                <DifficultyBadge difficulty={problem.difficulty}>
                  {problem.difficulty}
                </DifficultyBadge>
              </ProblemCard>
            ))}
          </ProblemsGrid>
        </CategoryCard>
      </CategoriesGrid>
    </Container>
  );
};

export default AlgorithmProblemsIndexPage;
