import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ComplexityData {
  operation: string;
  bestCase: string;
  averageCase: string;
  worstCase: string;
  spaceComplexity: string;
  description: string;
}

interface AlgorithmComplexity {
  [key: string]: {
    [operation: string]: ComplexityData;
  };
}

const BigOContainer = styled(motion.div)`
  background: ${({ theme }) => theme.background};
  border-radius: 12px;
  padding: 24px;
  margin: 16px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.border};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 24px;
  
  h2 {
    color: ${({ theme }) => theme.text};
    font-size: 1.5rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const SelectionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
`;

const ComplexityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const ComplexityCard = styled(motion.div)`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const ComplexityTitle = styled.h3`
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ComplexityValue = styled.span<{ complexity: string }>`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-weight: bold;
  font-size: 1.1rem;
  color: ${({ complexity, theme }) => {
    switch (complexity) {
      case 'O(1)': return '#22c55e';
      case 'O(log n)': return '#84cc16';
      case 'O(n)': return '#eab308';
      case 'O(n log n)': return '#f97316';
      case 'O(n²)': return '#ef4444';
      case 'O(n³)': return '#dc2626';
      case 'O(2^n)': return '#991b1b';
      case 'O(n!)': return '#7f1d1d';
      default: return theme.text;
    }
  }};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
  margin: 12px 0 0 0;
  line-height: 1.5;
`;

const ComplexityChart = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  margin-top: 24px;
`;

const ChartContainer = styled.div`
  position: relative;
  height: 200px;
  margin: 16px 0;
`;

const ChartBar = styled(motion.div)<{ height: number; color: string }>`
  position: absolute;
  bottom: 0;
  width: 60px;
  background: ${({ color }) => color};
  border-radius: 4px 4px 0 0;
  height: ${({ height }) => height}%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4px;
`;

const ChartLabel = styled.div`
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const complexityData: AlgorithmComplexity = {
  'Array': {
    'Access': {
      operation: 'Access',
      bestCase: 'O(1)',
      averageCase: 'O(1)',
      worstCase: 'O(1)',
      spaceComplexity: 'O(1)',
      description: 'Direct index access provides constant time complexity'
    },
    'Search': {
      operation: 'Search',
      bestCase: 'O(1)',
      averageCase: 'O(n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'Linear search through array elements'
    },
    'Insertion': {
      operation: 'Insertion',
      bestCase: 'O(1)',
      averageCase: 'O(n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'Insertion may require shifting elements'
    },
    'Deletion': {
      operation: 'Deletion',
      bestCase: 'O(1)',
      averageCase: 'O(n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'Deletion may require shifting elements'
    }
  },
  'Linked List': {
    'Access': {
      operation: 'Access',
      bestCase: 'O(1)',
      averageCase: 'O(n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'Sequential traversal required to reach element'
    },
    'Search': {
      operation: 'Search',
      bestCase: 'O(1)',
      averageCase: 'O(n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'Linear search through linked nodes'
    },
    'Insertion': {
      operation: 'Insertion',
      bestCase: 'O(1)',
      averageCase: 'O(1)',
      worstCase: 'O(1)',
      spaceComplexity: 'O(1)',
      description: 'Insertion at known position is constant time'
    },
    'Deletion': {
      operation: 'Deletion',
      bestCase: 'O(1)',
      averageCase: 'O(1)',
      worstCase: 'O(1)',
      spaceComplexity: 'O(1)',
      description: 'Deletion at known position is constant time'
    }
  },
  'Binary Search Tree': {
    'Access': {
      operation: 'Access',
      bestCase: 'O(log n)',
      averageCase: 'O(log n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'Logarithmic search in balanced tree, linear in worst case'
    },
    'Search': {
      operation: 'Search',
      bestCase: 'O(log n)',
      averageCase: 'O(log n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'Binary search property provides logarithmic complexity'
    },
    'Insertion': {
      operation: 'Insertion',
      bestCase: 'O(log n)',
      averageCase: 'O(log n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'Insert while maintaining BST property'
    },
    'Deletion': {
      operation: 'Deletion',
      bestCase: 'O(log n)',
      averageCase: 'O(log n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'Delete while maintaining BST property'
    }
  },
  'Hash Table': {
    'Access': {
      operation: 'Access',
      bestCase: 'O(1)',
      averageCase: 'O(1)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'Direct hash-based access, degrades with collisions'
    },
    'Search': {
      operation: 'Search',
      bestCase: 'O(1)',
      averageCase: 'O(1)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'Hash function provides constant time lookup'
    },
    'Insertion': {
      operation: 'Insertion',
      bestCase: 'O(1)',
      averageCase: 'O(1)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'Insert via hash function, handle collisions'
    },
    'Deletion': {
      operation: 'Deletion',
      bestCase: 'O(1)',
      averageCase: 'O(1)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'Delete via hash function, handle collisions'
    }
  }
};

const getComplexityScore = (complexity: string): number => {
  const scores = {
    'O(1)': 1,
    'O(log n)': 2,
    'O(n)': 3,
    'O(n log n)': 4,
    'O(n²)': 5,
    'O(n³)': 6,
    'O(2^n)': 7,
    'O(n!)': 8
  };
  return scores[complexity as keyof typeof scores] || 0;
};

const getComplexityColor = (complexity: string): string => {
  const colors = {
    'O(1)': '#22c55e',
    'O(log n)': '#84cc16',
    'O(n)': '#eab308',
    'O(n log n)': '#f97316',
    'O(n²)': '#ef4444',
    'O(n³)': '#dc2626',
    'O(2^n)': '#991b1b',
    'O(n!)': '#7f1d1d'
  };
  return colors[complexity as keyof typeof colors] || '#6b7280';
};

export const BigOCalculator: React.FC = () => {
  const [selectedDataStructure, setSelectedDataStructure] = useState<string>('Array');
  const [selectedOperation, setSelectedOperation] = useState<string>('Access');

  const availableOperations = useMemo(() => {
    return Object.keys(complexityData[selectedDataStructure] || {});
  }, [selectedDataStructure]);

  const currentComplexity = useMemo(() => {
    return complexityData[selectedDataStructure]?.[selectedOperation];
  }, [selectedDataStructure, selectedOperation]);

  const handleDataStructureChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDataStructure = e.target.value;
    setSelectedDataStructure(newDataStructure);
    
    const newOperations = Object.keys(complexityData[newDataStructure] || {});
    if (newOperations.length > 0) {
      setSelectedOperation(newOperations[0]);
    }
  }, []);

  const complexityComparison = useMemo(() => {
    if (!currentComplexity) return [];
    
    return [
      { case: 'Best', complexity: currentComplexity.bestCase },
      { case: 'Average', complexity: currentComplexity.averageCase },
      { case: 'Worst', complexity: currentComplexity.worstCase }
    ];
  }, [currentComplexity]);

  return (
    <BigOContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <h2>
          📊 Big O Complexity Calculator
        </h2>
      </Header>

      <SelectionContainer>
        <div>
          <label htmlFor="data-structure">Data Structure:</label>
          <Select
            id="data-structure"
            value={selectedDataStructure}
            onChange={handleDataStructureChange}
          >
            {Object.keys(complexityData).map(ds => (
              <option key={ds} value={ds}>{ds}</option>
            ))}
          </Select>
        </div>
        
        <div>
          <label htmlFor="operation">Operation:</label>
          <Select
            id="operation"
            value={selectedOperation}
            onChange={(e) => setSelectedOperation(e.target.value)}
          >
            {availableOperations.map(op => (
              <option key={op} value={op}>{op}</option>
            ))}
          </Select>
        </div>
      </SelectionContainer>

      {currentComplexity && (
        <>
          <ComplexityGrid>
            <ComplexityCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ComplexityTitle>Best Case</ComplexityTitle>
              <ComplexityValue complexity={currentComplexity.bestCase}>
                {currentComplexity.bestCase}
              </ComplexityValue>
            </ComplexityCard>

            <ComplexityCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ComplexityTitle>Average Case</ComplexityTitle>
              <ComplexityValue complexity={currentComplexity.averageCase}>
                {currentComplexity.averageCase}
              </ComplexityValue>
            </ComplexityCard>

            <ComplexityCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ComplexityTitle>Worst Case</ComplexityTitle>
              <ComplexityValue complexity={currentComplexity.worstCase}>
                {currentComplexity.worstCase}
              </ComplexityValue>
            </ComplexityCard>

            <ComplexityCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ComplexityTitle>Space Complexity</ComplexityTitle>
              <ComplexityValue complexity={currentComplexity.spaceComplexity}>
                {currentComplexity.spaceComplexity}
              </ComplexityValue>
            </ComplexityCard>
          </ComplexityGrid>

          <ComplexityChart>
            <h3>Complexity Comparison</h3>
            <ChartContainer>
              {complexityComparison.map((item, index) => (
                <ChartBar
                  key={item.case}
                  height={getComplexityScore(item.complexity) * 12.5}
                  color={getComplexityColor(item.complexity)}
                  style={{ left: `${index * 80 + 20}px` }}
                  initial={{ height: 0 }}
                  animate={{ height: getComplexityScore(item.complexity) * 12.5 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <ChartLabel>{item.case}</ChartLabel>
                </ChartBar>
              ))}
            </ChartContainer>
          </ComplexityChart>

          <Description>{currentComplexity.description}</Description>
        </>
      )}
    </BigOContainer>
  );
};

export default BigOCalculator;
