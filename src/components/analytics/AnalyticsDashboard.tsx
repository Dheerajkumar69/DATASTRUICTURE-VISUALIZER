import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import BigOCalculator from './BigOCalculator';
import PerformanceComparison from './PerformanceComparison';
import MemoryUsageVisualization from './MemoryUsageVisualization';
import ExecutionTimeProfiler from './ExecutionTimeProfiler';
import ComplexityHeatMap from './ComplexityHeatMap';

interface AnalyticsTool {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: React.ComponentType;
  category: 'complexity' | 'performance' | 'memory' | 'profiling' | 'visualization';
}

const DashboardContainer = styled(motion.div)`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: 24px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    color: ${({ theme }) => theme.text};
    font-size: 3rem;
    font-weight: 700;
    margin: 0 0 16px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const NavigationBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const NavButton = styled(motion.button)<{ isActive: boolean; category: string }>`
  padding: 12px 24px;
  border-radius: 25px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  background: ${({ isActive, category }) => {
    if (isActive) {
      switch (category) {
        case 'complexity': return 'linear-gradient(135deg, #667eea, #764ba2)';
        case 'performance': return 'linear-gradient(135deg, #f093fb, #f5576c)';
        case 'memory': return 'linear-gradient(135deg, #4facfe, #00f2fe)';
        case 'profiling': return 'linear-gradient(135deg, #43e97b, #38f9d7)';
        case 'visualization': return 'linear-gradient(135deg, #fa709a, #fee140)';
        default: return 'linear-gradient(135deg, #667eea, #764ba2)';
      }
    }
    return 'transparent';
  }};
  
  color: ${({ isActive, theme }) => isActive ? 'white' : theme.textSecondary};
  
  border: ${({ isActive, theme, category }) => {
    if (!isActive) {
      switch (category) {
        case 'complexity': return '2px solid #667eea40';
        case 'performance': return '2px solid #f093fb40';
        case 'memory': return '2px solid #4facfe40';
        case 'profiling': return '2px solid #43e97b40';
        case 'visualization': return '2px solid #fa709a40';
        default: return `2px solid ${theme.border}`;
      }
    }
    return 'none';
  }};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .icon {
    font-size: 1.2rem;
  }
`;

const ToolGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ToolCard = styled(motion.div)<{ category: string }>`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ category }) => {
      switch (category) {
        case 'complexity': return 'linear-gradient(90deg, #667eea, #764ba2)';
        case 'performance': return 'linear-gradient(90deg, #f093fb, #f5576c)';
        case 'memory': return 'linear-gradient(90deg, #4facfe, #00f2fe)';
        case 'profiling': return 'linear-gradient(90deg, #43e97b, #38f9d7)';
        case 'visualization': return 'linear-gradient(90deg, #fa709a, #fee140)';
        default: return 'linear-gradient(90deg, #667eea, #764ba2)';
      }
    }};
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }
`;

const ToolHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  
  .icon {
    font-size: 2rem;
    opacity: 0.8;
  }
  
  .title {
    font-size: 1.3rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
    margin: 0;
  }
`;

const ToolDescription = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
`;

const ToolContent = styled(motion.div)`
  width: 100%;
  max-width: 100%;
`;

const CategoryFilter = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)<{ isActive: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.85rem;
  
  background: ${({ isActive, theme }) => 
    isActive ? theme.primary : theme.cardBackground
  };
  color: ${({ isActive, theme }) => 
    isActive ? 'white' : theme.textSecondary
  };
  border: ${({ isActive, theme }) => 
    isActive ? 'none' : `1px solid ${theme.border}`
  };
  
  &:hover {
    transform: scale(1.05);
  }
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div<{ accent: string }>`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.border};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ accent }) => accent};
    border-radius: 12px 12px 0 0;
  }
  
  .value {
    font-size: 2rem;
    font-weight: bold;
    color: ${({ accent }) => accent};
    margin-bottom: 8px;
  }
  
  .label {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.9rem;
  }
`;

const tools: AnalyticsTool[] = [
  {
    id: 'bigo-calculator',
    title: 'Big O Calculator',
    description: 'Calculate and compare algorithmic complexity for different data structures and operations. Visualize time and space complexity with interactive charts.',
    icon: '📊',
    component: BigOCalculator,
    category: 'complexity'
  },
  {
    id: 'performance-comparison',
    title: 'Performance Comparison',
    description: 'Benchmark multiple algorithms side by side. Compare execution time, memory usage, and operations count with real-time measurement.',
    icon: '⚡',
    component: PerformanceComparison,
    category: 'performance'
  },
  {
    id: 'memory-visualization',
    title: 'Memory Usage Visualization',
    description: 'Monitor memory allocation, deallocation, and fragmentation in real-time. Track garbage collection cycles and memory leaks.',
    icon: '🧠',
    component: MemoryUsageVisualization,
    category: 'memory'
  },
  {
    id: 'execution-profiler',
    title: 'Execution Time Profiler',
    description: 'Deep dive into function-level performance analysis. Identify bottlenecks, hot spots, and optimization opportunities.',
    icon: '⏱️',
    component: ExecutionTimeProfiler,
    category: 'profiling'
  },
  {
    id: 'complexity-heatmap',
    title: 'Complexity Heat Map',
    description: 'Visualize algorithm performance across different input sizes using color-coded heat maps. Compare complexity patterns visually.',
    icon: '🌡️',
    component: ComplexityHeatMap,
    category: 'visualization'
  }
];

const categories = [
  { id: 'all', label: 'All Tools', icon: '🎯' },
  { id: 'complexity', label: 'Complexity Analysis', icon: '📊' },
  { id: 'performance', label: 'Performance', icon: '⚡' },
  { id: 'memory', label: 'Memory', icon: '🧠' },
  { id: 'profiling', label: 'Profiling', icon: '⏱️' },
  { id: 'visualization', label: 'Visualization', icon: '🌡️' }
];

export const AnalyticsDashboard: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTools = useMemo(() => {
    if (selectedCategory === 'all') return tools;
    return tools.filter(tool => tool.category === selectedCategory);
  }, [selectedCategory]);

  const handleToolSelect = useCallback((toolId: string) => {
    setSelectedTool(selectedTool === toolId ? null : toolId);
  }, [selectedTool]);

  const selectedToolData = useMemo(() => {
    return tools.find(tool => tool.id === selectedTool);
  }, [selectedTool]);

  const quickStats = useMemo(() => [
    { label: 'Available Tools', value: tools.length, accent: '#667eea' },
    { label: 'Categories', value: categories.length - 1, accent: '#f093fb' },
    { label: 'Complexity Types', value: 8, accent: '#4facfe' },
    { label: 'Metrics Tracked', value: 15, accent: '#43e97b' }
  ], []);

  return (
    <DashboardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          📊 Analytics & Insights
        </motion.h1>
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Comprehensive performance analysis tools for data structures and algorithms. 
          Measure, compare, and optimize your code with professional-grade analytics.
        </motion.p>
      </Header>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <QuickStats>
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            >
              <StatCard accent={stat.accent}>
                <div className="value">{stat.value}</div>
                <div className="label">{stat.label}</div>
              </StatCard>
            </motion.div>
          ))}
        </QuickStats>
      </motion.div>

      <CategoryFilter>
        {categories.map((category, index) => (
          <FilterButton
            key={category.id}
            isActive={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
          >
            {category.icon} {category.label}
          </FilterButton>
        ))}
      </CategoryFilter>

      <NavigationBar>
        {filteredTools.map((tool, index) => (
          <NavButton
            key={tool.id}
            isActive={selectedTool === tool.id}
            category={tool.category}
            onClick={() => handleToolSelect(tool.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.1 }}
          >
            <span className="icon">{tool.icon}</span>
            {tool.title}
          </NavButton>
        ))}
      </NavigationBar>

      <AnimatePresence mode="wait">
        {selectedTool && selectedToolData ? (
          <ToolContent
            key={selectedTool}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          >
            <selectedToolData.component />
          </ToolContent>
        ) : (
          <ToolGrid
            key="tool-grid"
          >
            {filteredTools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                category={tool.category}
                onClick={() => handleToolSelect(tool.id)}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ToolHeader>
                  <span className="icon">{tool.icon}</span>
                  <h3 className="title">{tool.title}</h3>
                </ToolHeader>
                <ToolDescription>{tool.description}</ToolDescription>
              </ToolCard>
            ))}
          </ToolGrid>
        )}
      </AnimatePresence>

      {!selectedTool && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{ 
            textAlign: 'center', 
            marginTop: '40px',
            color: '#6b7280',
            fontSize: '1rem'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🚀</div>
          Select a tool above to start analyzing your algorithms and data structures!
        </motion.div>
      )}
    </DashboardContainer>
  );
};

export default AnalyticsDashboard;
