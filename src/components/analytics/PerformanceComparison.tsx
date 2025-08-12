import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface BenchmarkResult {
  name: string;
  executionTime: number;
  memoryUsage: number;
  operations: number;
  operationsPerSecond: number;
  complexity: string;
}

interface TestConfiguration {
  dataSize: number;
  iterations: number;
  algorithm: string;
  dataType: 'array' | 'linkedlist' | 'tree' | 'hash';
}

const PerformanceContainer = styled(motion.div)`
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

const ConfigurationPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const ConfigGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    color: ${({ theme }) => theme.text};
    font-weight: 500;
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
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

const RunButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 24px;
`;

const ResultCard = styled(motion.div)<{ rank: number }>`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${({ theme, rank }) => {
    switch (rank) {
      case 1: return '#ffd700';
      case 2: return '#c0c0c0';
      case 3: return '#cd7f32';
      default: return theme.border;
    }
  }};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ rank }) => {
      switch (rank) {
        case 1: return 'linear-gradient(90deg, #ffd700, #ffed4e)';
        case 2: return 'linear-gradient(90deg, #c0c0c0, #e5e5e5)';
        case 3: return 'linear-gradient(90deg, #cd7f32, #daa520)';
        default: return 'transparent';
      }
    }};
  }
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h3 {
    color: ${({ theme }) => theme.text};
    font-size: 1.2rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const RankBadge = styled.span<{ rank: number }>`
  background: ${({ rank }) => {
    switch (rank) {
      case 1: return '#ffd700';
      case 2: return '#c0c0c0';
      case 3: return '#cd7f32';
      default: return '#6b7280';
    }
  }};
  color: ${({ rank }) => rank <= 3 ? '#000' : '#fff'};
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`;

const MetricItem = styled.div`
  text-align: center;
  
  .value {
    font-size: 1.4rem;
    font-weight: bold;
    color: ${({ theme }) => theme.primary};
    display: block;
  }
  
  .label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textSecondary};
    margin-top: 4px;
  }
`;

const ComparisonChart = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  margin-top: 24px;
`;

const ChartContainer = styled.div`
  position: relative;
  height: 300px;
  margin: 16px 0;
`;

const ChartBar = styled(motion.div)<{ height: number; color: string; width: number }>`
  position: absolute;
  bottom: 0;
  background: ${({ color }) => color};
  border-radius: 4px 4px 0 0;
  height: ${({ height }) => height}%;
  width: ${({ width }) => width}px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4px;
`;

const ChartLabel = styled.div`
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  writing-mode: vertical-rl;
  text-orientation: mixed;
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  z-index: 10;
`;

const LoadingContent = styled.div`
  text-align: center;
  color: white;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto 16px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Benchmark algorithms
const benchmarkAlgorithms = {
  'Bubble Sort': (arr: number[]) => {
    const result = [...arr];
    let operations = 0;
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result.length - i - 1; j++) {
        operations++;
        if (result[j] > result[j + 1]) {
          [result[j], result[j + 1]] = [result[j + 1], result[j]];
        }
      }
    }
    return { result, operations };
  },
  
  'Quick Sort': (arr: number[]) => {
    let operations = 0;
    
    const quickSort = (array: number[], low = 0, high = array.length - 1): number[] => {
      if (low < high) {
        const pi = partition(array, low, high);
        quickSort(array, low, pi - 1);
        quickSort(array, pi + 1, high);
      }
      return array;
    };
    
    const partition = (array: number[], low: number, high: number): number => {
      const pivot = array[high];
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        operations++;
        if (array[j] < pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      return i + 1;
    };
    
    const result = quickSort([...arr]);
    return { result, operations };
  },
  
  'Merge Sort': (arr: number[]) => {
    let operations = 0;
    
    const mergeSort = (array: number[]): number[] => {
      if (array.length <= 1) return array;
      
      const mid = Math.floor(array.length / 2);
      const left = mergeSort(array.slice(0, mid));
      const right = mergeSort(array.slice(mid));
      
      return merge(left, right);
    };
    
    const merge = (left: number[], right: number[]): number[] => {
      const result = [];
      let leftIdx = 0;
      let rightIdx = 0;
      
      while (leftIdx < left.length && rightIdx < right.length) {
        operations++;
        if (left[leftIdx] < right[rightIdx]) {
          result.push(left[leftIdx]);
          leftIdx++;
        } else {
          result.push(right[rightIdx]);
          rightIdx++;
        }
      }
      
      return result.concat(left.slice(leftIdx)).concat(right.slice(rightIdx));
    };
    
    const result = mergeSort([...arr]);
    return { result, operations };
  },
  
  'Linear Search': (arr: number[], target: number) => {
    let operations = 0;
    for (let i = 0; i < arr.length; i++) {
      operations++;
      if (arr[i] === target) {
        return { result: i, operations };
      }
    }
    return { result: -1, operations };
  },
  
  'Binary Search': (arr: number[], target: number) => {
    const sortedArr = [...arr].sort((a, b) => a - b);
    let operations = 0;
    let left = 0;
    let right = sortedArr.length - 1;
    
    while (left <= right) {
      operations++;
      const mid = Math.floor((left + right) / 2);
      if (sortedArr[mid] === target) {
        return { result: mid, operations };
      } else if (sortedArr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return { result: -1, operations };
  }
};

export const PerformanceComparison: React.FC = () => {
  const [configuration, setConfiguration] = useState<TestConfiguration>({
    dataSize: 1000,
    iterations: 100,
    algorithm: 'sort',
    dataType: 'array'
  });

  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState('');
  const workerRef = useRef<Worker | null>(null);

  const generateTestData = useCallback((size: number, type: string) => {
    switch (type) {
      case 'random':
        return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
      case 'sorted':
        return Array.from({ length: size }, (_, i) => i);
      case 'reverse':
        return Array.from({ length: size }, (_, i) => size - i);
      case 'nearly-sorted':
        const arr = Array.from({ length: size }, (_, i) => i);
        // Shuffle 10% of elements
        for (let i = 0; i < size * 0.1; i++) {
          const idx1 = Math.floor(Math.random() * size);
          const idx2 = Math.floor(Math.random() * size);
          [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
        }
        return arr;
      default:
        return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
    }
  }, []);

  const runBenchmark = useCallback(async () => {
    setIsRunning(true);
    setResults([]);
    setProgress('Preparing benchmarks...');

    const testData = generateTestData(configuration.dataSize, 'random');
    const algorithms = configuration.algorithm === 'sort' 
      ? ['Bubble Sort', 'Quick Sort', 'Merge Sort']
      : ['Linear Search', 'Binary Search'];

    const benchmarkResults: BenchmarkResult[] = [];

    for (let i = 0; i < algorithms.length; i++) {
      const algorithmName = algorithms[i];
      setProgress(`Running ${algorithmName}...`);

      const startTime = performance.now();
      const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0;
      
      let totalOperations = 0;
      
      // Run multiple iterations for more accurate results
      for (let iteration = 0; iteration < configuration.iterations; iteration++) {
        const algorithm = benchmarkAlgorithms[algorithmName as keyof typeof benchmarkAlgorithms];
        
        if (algorithmName.includes('Search')) {
          const target = testData[Math.floor(Math.random() * testData.length)];
          const result = (algorithm as (arr: number[], target: number) => { result: any, operations: number })(testData, target);
          totalOperations += result.operations;
        } else {
          const result = (algorithm as (arr: number[]) => { result: any, operations: number })(testData);
          totalOperations += result.operations;
        }
      }

      const endTime = performance.now();
      const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;
      
      const executionTime = endTime - startTime;
      const memoryUsage = Math.max(0, memoryAfter - memoryBefore);
      const operationsPerSecond = (totalOperations / executionTime) * 1000;

      const complexityMap: { [key: string]: string } = {
        'Bubble Sort': 'O(n²)',
        'Quick Sort': 'O(n log n)',
        'Merge Sort': 'O(n log n)',
        'Linear Search': 'O(n)',
        'Binary Search': 'O(log n)'
      };

      benchmarkResults.push({
        name: algorithmName,
        executionTime,
        memoryUsage,
        operations: totalOperations,
        operationsPerSecond,
        complexity: complexityMap[algorithmName] || 'O(n)'
      });

      // Update results incrementally
      setResults([...benchmarkResults]);
    }

    // Sort results by execution time (ascending)
    benchmarkResults.sort((a, b) => a.executionTime - b.executionTime);
    setResults(benchmarkResults);
    setIsRunning(false);
    setProgress('');
  }, [configuration, generateTestData]);

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => a.executionTime - b.executionTime);
  }, [results]);

  const formatTime = useCallback((time: number) => {
    if (time < 1) return `${time.toFixed(3)}ms`;
    if (time < 1000) return `${time.toFixed(1)}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  }, []);

  const formatMemory = useCallback((bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }, []);

  const formatOperations = useCallback((ops: number) => {
    if (ops < 1000) return ops.toString();
    if (ops < 1000000) return `${(ops / 1000).toFixed(1)}K`;
    return `${(ops / 1000000).toFixed(1)}M`;
  }, []);

  const getBarColor = useCallback((index: number) => {
    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    return colors[index % colors.length];
  }, []);

  const maxTime = Math.max(...sortedResults.map(r => r.executionTime), 1);

  return (
    <PerformanceContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isRunning && (
        <LoadingOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoadingContent>
            <div className="spinner"></div>
            <div>{progress}</div>
          </LoadingContent>
        </LoadingOverlay>
      )}

      <Header>
        <h2>
          ⚡ Performance Comparison Tool
        </h2>
        <RunButton
          onClick={runBenchmark}
          disabled={isRunning}
          whileHover={{ scale: isRunning ? 1 : 1.05 }}
          whileTap={{ scale: isRunning ? 1 : 0.95 }}
        >
          {isRunning ? '🔄 Running...' : '▶️ Run Benchmark'}
        </RunButton>
      </Header>

      <ConfigurationPanel>
        <ConfigGroup>
          <label>Data Size</label>
          <Input
            type="number"
            value={configuration.dataSize}
            onChange={(e) => setConfiguration(prev => ({
              ...prev,
              dataSize: parseInt(e.target.value) || 1000
            }))}
            min="10"
            max="10000"
          />
        </ConfigGroup>

        <ConfigGroup>
          <label>Iterations</label>
          <Input
            type="number"
            value={configuration.iterations}
            onChange={(e) => setConfiguration(prev => ({
              ...prev,
              iterations: parseInt(e.target.value) || 100
            }))}
            min="1"
            max="1000"
          />
        </ConfigGroup>

        <ConfigGroup>
          <label>Algorithm Type</label>
          <Select
            value={configuration.algorithm}
            onChange={(e) => setConfiguration(prev => ({
              ...prev,
              algorithm: e.target.value
            }))}
          >
            <option value="sort">Sorting Algorithms</option>
            <option value="search">Search Algorithms</option>
          </Select>
        </ConfigGroup>

        <ConfigGroup>
          <label>Data Structure</label>
          <Select
            value={configuration.dataType}
            onChange={(e) => setConfiguration(prev => ({
              ...prev,
              dataType: e.target.value as any
            }))}
          >
            <option value="array">Array</option>
            <option value="linkedlist">Linked List</option>
            <option value="tree">Binary Tree</option>
            <option value="hash">Hash Table</option>
          </Select>
        </ConfigGroup>
      </ConfigurationPanel>

      <ResultsContainer>
        {sortedResults.map((result, index) => (
          <ResultCard
            key={result.name}
            rank={index + 1}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ResultHeader>
              <h3>
                {index === 0 && '🥇'} 
                {index === 1 && '🥈'} 
                {index === 2 && '🥉'}
                {result.name}
              </h3>
              <RankBadge rank={index + 1}>
                #{index + 1}
              </RankBadge>
            </ResultHeader>

            <MetricGrid>
              <MetricItem>
                <span className="value">{formatTime(result.executionTime)}</span>
                <div className="label">Execution Time</div>
              </MetricItem>

              <MetricItem>
                <span className="value">{formatMemory(result.memoryUsage)}</span>
                <div className="label">Memory Usage</div>
              </MetricItem>

              <MetricItem>
                <span className="value">{formatOperations(result.operations)}</span>
                <div className="label">Operations</div>
              </MetricItem>

              <MetricItem>
                <span className="value">{formatOperations(Math.round(result.operationsPerSecond))}</span>
                <div className="label">Ops/Second</div>
              </MetricItem>

              <MetricItem>
                <span className="value">{result.complexity}</span>
                <div className="label">Complexity</div>
              </MetricItem>
            </MetricGrid>
          </ResultCard>
        ))}
      </ResultsContainer>

      {sortedResults.length > 0 && (
        <ComparisonChart>
          <h3>Execution Time Comparison</h3>
          <ChartContainer>
            {sortedResults.map((result, index) => (
              <ChartBar
                key={result.name}
                height={(result.executionTime / maxTime) * 90}
                color={getBarColor(index)}
                width={Math.max(60, 300 / sortedResults.length - 10)}
                style={{ 
                  left: `${index * (300 / sortedResults.length) + 10}px` 
                }}
                initial={{ height: 0 }}
                animate={{ 
                  height: (result.executionTime / maxTime) * 90 
                }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <ChartLabel>{result.name}</ChartLabel>
              </ChartBar>
            ))}
          </ChartContainer>
        </ComparisonChart>
      )}
    </PerformanceContainer>
  );
};

export default PerformanceComparison;
