import React, { useState, useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface ComplexityDataPoint {
  inputSize: number;
  executionTime: number;
  memoryUsage: number;
  operations: number;
  algorithm: string;
}

interface HeatMapCell {
  x: number;
  y: number;
  value: number;
  algorithm: string;
  inputSize: number;
  intensity: number;
}

interface AlgorithmMetrics {
  name: string;
  color: string;
  complexity: string;
  dataPoints: ComplexityDataPoint[];
  averagePerformance: number;
  scalability: number;
}

const HeatMapContainer = styled(motion.div)`
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
  justify-content: space-between;
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

const ControlPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-weight: 500;
    color: ${({ theme }) => theme.text};
    font-size: 0.9rem;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
`;

const RangeInput = styled.input`
  width: 100%;
  margin: 8px 0;
  
  &[type="range"] {
    appearance: none;
    height: 6px;
    border-radius: 3px;
    background: ${({ theme }) => theme.border};
    outline: none;
    
    &::-webkit-slider-thumb {
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: ${({ theme }) => theme.primary};
      cursor: pointer;
    }
    
    &::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: ${({ theme }) => theme.primary};
      cursor: pointer;
      border: none;
    }
  }
`;

const RangeLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  background: ${({ variant, theme }) => 
    variant === 'primary' ? theme.primary : theme.cardBackground
  };
  color: ${({ variant, theme }) => 
    variant === 'primary' ? 'white' : theme.text
  };
  border: ${({ variant, theme }) => 
    variant === 'secondary' ? `1px solid ${theme.border}` : 'none'
  };
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const HeatMapGrid = styled.div<{ rows: number; cols: number }>`
  display: grid;
  grid-template-rows: repeat(${({ rows }) => rows}, 1fr);
  grid-template-columns: repeat(${({ cols }) => cols}, 1fr);
  gap: 2px;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 24px;
  aspect-ratio: 1.4;
  max-height: 500px;
`;

const HeatMapCell = styled(motion.div)<{ 
  intensity: number; 
  algorithmColor: string; 
  isHighlighted?: boolean;
}>`
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 500;
  color: ${({ intensity }) => intensity > 0.5 ? 'white' : '#333'};
  
  background: ${({ intensity, algorithmColor }) => {
    if (intensity === 0) return '#f3f4f6';
    const alpha = Math.max(0.3, intensity);
    return `${algorithmColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
  }};
  
  border: 2px solid ${({ isHighlighted, theme }) => 
    isHighlighted ? theme.primary : 'transparent'
  };
  
  &:hover {
    transform: scale(1.1);
    z-index: 10;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: ${({ theme }) => theme.colors.card};
  padding: 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  z-index: 100;
  pointer-events: none;
  white-space: nowrap;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
  }
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const ColorScale = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  .scale {
    flex: 1;
    height: 20px;
    background: linear-gradient(
      to right,
      #f3f4f6,
      #fbbf24,
      #f59e0b,
      #dc2626,
      #991b1b
    );
    border-radius: 10px;
    position: relative;
  }
  
  .scale-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const AlgorithmLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  
  .algorithm-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: ${({ theme }) => theme.cardBackground};
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.border};
    
    .color-indicator {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
    
    .algorithm-info {
      .name {
        font-weight: 500;
        color: ${({ theme }) => theme.text};
      }
      
      .complexity {
        font-size: 0.8rem;
        color: ${({ theme }) => theme.textSecondary};
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      }
    }
  }
`;

const AxisLabels = styled.div`
  display: grid;
  gap: 16px;
  margin-bottom: 16px;
`;

const XAxisLabels = styled.div<{ cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ cols }) => cols}, 1fr);
  gap: 2px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
  margin-bottom: 8px;
`;

const YAxisLabels = styled.div<{ rows: number }>`
  display: grid;
  grid-template-rows: repeat(${({ rows }) => rows}, 1fr);
  gap: 2px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textSecondary};
  text-align: right;
  padding-right: 8px;
  justify-items: end;
  align-items: center;
`;

const StatsPanel = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 12px;
  background: ${({ theme }) => theme.background};
  border-radius: 6px;
  
  .value {
    font-size: 1.4rem;
    font-weight: bold;
    color: ${({ theme }) => theme.primary};
    display: block;
    margin-bottom: 4px;
  }
  
  .label {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

// Mock data generation
const generateComplexityData = (
  algorithms: string[],
  inputSizes: number[],
  metric: 'time' | 'memory' | 'operations'
): AlgorithmMetrics[] => {
  const algorithmColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];
  
  const complexityMultipliers = {
    'Bubble Sort': (n: number) => n * n,
    'Quick Sort': (n: number) => n * Math.log2(n),
    'Merge Sort': (n: number) => n * Math.log2(n),
    'Linear Search': (n: number) => n,
    'Binary Search': (n: number) => Math.log2(n),
    'Hash Table Insert': (n: number) => 1,
    'BST Insert': (n: number) => Math.log2(n),
    'Array Access': (n: number) => 1
  };
  
  return algorithms.map((algorithm, index) => {
    const multiplier = complexityMultipliers[algorithm as keyof typeof complexityMultipliers] || ((n: number) => n);
    const baseTime = Math.random() * 5 + 1;
    
    const dataPoints: ComplexityDataPoint[] = inputSizes.map(size => {
      const complexity = multiplier(size);
      const variance = 0.8 + Math.random() * 0.4; // Random variance
      
      return {
        inputSize: size,
        executionTime: baseTime * complexity * variance / 1000,
        memoryUsage: size * (8 + Math.random() * 16),
        operations: Math.floor(complexity * variance),
        algorithm
      };
    });
    
    const averagePerformance = dataPoints.reduce((sum, dp) => sum + dp.executionTime, 0) / dataPoints.length;
    const scalability = dataPoints[dataPoints.length - 1].executionTime / dataPoints[0].executionTime;
    
    return {
      name: algorithm,
      color: algorithmColors[index % algorithmColors.length],
      complexity: getComplexityNotation(algorithm),
      dataPoints,
      averagePerformance,
      scalability
    };
  });
};

const getComplexityNotation = (algorithm: string): string => {
  const complexityMap: { [key: string]: string } = {
    'Bubble Sort': 'O(n²)',
    'Quick Sort': 'O(n log n)',
    'Merge Sort': 'O(n log n)',
    'Linear Search': 'O(n)',
    'Binary Search': 'O(log n)',
    'Hash Table Insert': 'O(1)',
    'BST Insert': 'O(log n)',
    'Array Access': 'O(1)'
  };
  
  return complexityMap[algorithm] || 'O(n)';
};

export const ComplexityHeatMap: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'time' | 'memory' | 'operations'>('time');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([
    'Bubble Sort', 'Quick Sort', 'Merge Sort', 'Linear Search'
  ]);
  const [inputSizeRange, setInputSizeRange] = useState({ min: 10, max: 1000 });
  const [hoveredCell, setHoveredCell] = useState<HeatMapCell | null>(null);
  const [gridDimensions] = useState({ rows: 8, cols: 10 });

  const availableAlgorithms = [
    'Bubble Sort', 'Quick Sort', 'Merge Sort', 'Linear Search',
    'Binary Search', 'Hash Table Insert', 'BST Insert', 'Array Access'
  ];

  const inputSizes = useMemo(() => {
    const { min, max } = inputSizeRange;
    const step = (max - min) / (gridDimensions.cols - 1);
    return Array.from({ length: gridDimensions.cols }, (_, i) => 
      Math.round(min + i * step)
    );
  }, [inputSizeRange, gridDimensions.cols]);

  const algorithmData = useMemo(() => {
    return generateComplexityData(selectedAlgorithms, inputSizes, selectedMetric);
  }, [selectedAlgorithms, inputSizes, selectedMetric]);

  const heatMapData = useMemo((): HeatMapCell[] => {
    const cells: HeatMapCell[] = [];
    
    // Find max value for normalization
    const allValues = algorithmData.flatMap(alg => 
      alg.dataPoints.map(dp => {
        switch (selectedMetric) {
          case 'time': return dp.executionTime;
          case 'memory': return dp.memoryUsage;
          case 'operations': return dp.operations;
        }
      })
    );
    const maxValue = Math.max(...allValues);
    
    algorithmData.forEach((algorithm, algIndex) => {
      algorithm.dataPoints.forEach((dataPoint, sizeIndex) => {
        const value = (() => {
          switch (selectedMetric) {
            case 'time': return dataPoint.executionTime;
            case 'memory': return dataPoint.memoryUsage;
            case 'operations': return dataPoint.operations;
          }
        })();
        
        cells.push({
          x: sizeIndex,
          y: algIndex,
          value,
          algorithm: algorithm.name,
          inputSize: dataPoint.inputSize,
          intensity: value / maxValue
        });
      });
    });
    
    return cells;
  }, [algorithmData, selectedMetric]);

  const handleAlgorithmToggle = useCallback((algorithm: string) => {
    setSelectedAlgorithms(prev => {
      if (prev.includes(algorithm)) {
        return prev.filter(a => a !== algorithm);
      } else if (prev.length < gridDimensions.rows) {
        return [...prev, algorithm];
      }
      return prev;
    });
  }, [gridDimensions.rows]);

  const formatValue = useCallback((value: number, metric: string) => {
    switch (metric) {
      case 'time':
        if (value < 1) return `${(value * 1000).toFixed(1)}ms`;
        return `${value.toFixed(2)}s`;
      case 'memory':
        if (value < 1024) return `${value.toFixed(0)}B`;
        if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)}KB`;
        return `${(value / (1024 * 1024)).toFixed(1)}MB`;
      case 'operations':
        if (value < 1000) return value.toFixed(0);
        if (value < 1000000) return `${(value / 1000).toFixed(1)}K`;
        return `${(value / 1000000).toFixed(1)}M`;
      default:
        return value.toString();
    }
  }, []);

  const generateInsights = useMemo(() => {
    if (algorithmData.length === 0) return [];
    
    const sortedByPerformance = [...algorithmData].sort((a, b) => a.averagePerformance - b.averagePerformance);
    const sortedByScalability = [...algorithmData].sort((a, b) => a.scalability - b.scalability);
    
    return [
      `🚀 Best performing: ${sortedByPerformance[0]?.name} with average ${selectedMetric} of ${formatValue(sortedByPerformance[0]?.averagePerformance || 0, selectedMetric)}`,
      `📈 Most scalable: ${sortedByScalability[0]?.name} with ${sortedByScalability[0]?.scalability.toFixed(2)}x performance ratio`,
      `⚠️ Least scalable: ${sortedByScalability[sortedByScalability.length - 1]?.name} showing ${sortedByScalability[sortedByScalability.length - 1]?.scalability.toFixed(2)}x performance degradation`
    ];
  }, [algorithmData, selectedMetric, formatValue]);

  return (
    <HeatMapContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <h2>
          🌡️ Complexity Heat Map
        </h2>
      </Header>

      <ControlPanel>
        <ControlGroup>
          <label>Performance Metric</label>
          <Select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
          >
            <option value="time">Execution Time</option>
            <option value="memory">Memory Usage</option>
            <option value="operations">Operation Count</option>
          </Select>
        </ControlGroup>

        <ControlGroup>
          <label>Input Size Range</label>
          <RangeInput
            type="range"
            min="10"
            max="10000"
            value={inputSizeRange.max}
            onChange={(e) => setInputSizeRange(prev => ({
              ...prev,
              max: parseInt(e.target.value)
            }))}
          />
          <RangeLabel>
            <span>{inputSizeRange.min}</span>
            <span>{inputSizeRange.max}</span>
          </RangeLabel>
        </ControlGroup>
      </ControlPanel>

      <Legend>
        <div>
          <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>Performance Intensity</h4>
          <ColorScale>
            <div className="scale">
              <div className="scale-labels">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Critical</span>
              </div>
            </div>
          </ColorScale>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>
            Algorithms ({selectedAlgorithms.length}/{gridDimensions.rows})
          </h4>
          <AlgorithmLegend>
            {availableAlgorithms.map((algorithm, index) => {
              const isSelected = selectedAlgorithms.includes(algorithm);
              const algorithmData = generateComplexityData([algorithm], [100], selectedMetric)[0];
              
              return (
                <motion.div
                  key={algorithm}
                  className="algorithm-item"
                  onClick={() => handleAlgorithmToggle(algorithm)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    opacity: isSelected ? 1 : 0.5,
                    cursor: 'pointer',
                    transform: isSelected ? 'none' : 'grayscale(100%)'
                  }}
                >
                  <div 
                    className="color-indicator" 
                    style={{ backgroundColor: algorithmData.color }}
                  />
                  <div className="algorithm-info">
                    <div className="name">{algorithm}</div>
                    <div className="complexity">{algorithmData.complexity}</div>
                  </div>
                </motion.div>
              );
            })}
          </AlgorithmLegend>
        </div>
      </Legend>

      {selectedAlgorithms.length > 0 && (
        <>
          <AxisLabels>
            <div style={{ display: 'flex', alignItems: 'end' }}>
              <YAxisLabels rows={selectedAlgorithms.length}>
                {selectedAlgorithms.map(algorithm => (
                  <div key={algorithm}>{algorithm}</div>
                ))}
              </YAxisLabels>
              <div style={{ flex: 1 }}>
                <XAxisLabels cols={gridDimensions.cols}>
                  {inputSizes.map(size => (
                    <div key={size}>{size}</div>
                  ))}
                </XAxisLabels>
                <HeatMapGrid rows={selectedAlgorithms.length} cols={gridDimensions.cols}>
                  <AnimatePresence>
                    {heatMapData.map((cell, index) => {
                      const algorithmColor = algorithmData.find(a => a.name === cell.algorithm)?.color || '#6b7280';
                      
                      return (
                        <HeatMapCell
                          key={`${cell.x}-${cell.y}`}
                          intensity={cell.intensity}
                          algorithmColor={algorithmColor}
                          isHighlighted={hoveredCell?.x === cell.x && hoveredCell?.y === cell.y}
                          onMouseEnter={() => setHoveredCell(cell)}
                          onMouseLeave={() => setHoveredCell(null)}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.01 }}
                          whileHover={{ scale: 1.1, zIndex: 10 }}
                        >
                          {hoveredCell?.x === cell.x && hoveredCell?.y === cell.y && (
                            <Tooltip
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                            >
                              <div><strong>{cell.algorithm}</strong></div>
                              <div>Input Size: {cell.inputSize.toLocaleString()}</div>
                              <div>{selectedMetric}: {formatValue(cell.value, selectedMetric)}</div>
                              <div>Intensity: {(cell.intensity * 100).toFixed(1)}%</div>
                            </Tooltip>
                          )}
                        </HeatMapCell>
                      );
                    })}
                  </AnimatePresence>
                </HeatMapGrid>
              </div>
            </div>
          </AxisLabels>

          <StatsPanel>
            <h3>Performance Analysis</h3>
            <StatsGrid>
              {algorithmData.map(algorithm => (
                <StatCard key={algorithm.name}>
                  <span className="value">
                    {formatValue(algorithm.averagePerformance, selectedMetric)}
                  </span>
                  <div className="label">{algorithm.name} Avg</div>
                </StatCard>
              ))}
            </StatsGrid>

            <div style={{ marginTop: '20px' }}>
              <h4>Key Insights</h4>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {generateInsights.map((insight, index) => (
                  <li key={index} style={{ margin: '8px 0', color: '#6b7280' }}>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </StatsPanel>
        </>
      )}

      {selectedAlgorithms.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          color: '#6b7280',
          fontSize: '1.1rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌡️</div>
          Select algorithms to visualize their complexity patterns
        </div>
      )}
    </HeatMapContainer>
  );
};

export default ComplexityHeatMap;
