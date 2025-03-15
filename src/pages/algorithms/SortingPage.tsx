import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiRefreshCw, FiChevronsRight, FiChevronsLeft } from 'react-icons/fi';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray800};
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  max-width: 800px;
  line-height: 1.6;
`;

const ComingSoonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  text-align: center;
`;

const ComingSoonTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const ComingSoonText = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  max-width: 600px;
  margin-bottom: 2rem;
`;

const AlgorithmPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

const AlgorithmBar = styled(motion.div)<{ height: number }>`
  width: 30px;
  height: ${({ height }) => `${height}px`};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
`;

const SortingPage: React.FC = () => {
  const [bars, setBars] = useState<number[]>([]);
  
  useEffect(() => {
    generateRandomBars();
  }, []);
  
  const generateRandomBars = () => {
    const newBars = Array.from({ length: 10 }, () => Math.floor(Math.random() * 150) + 50);
    setBars(newBars);
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Sorting Algorithms Visualization</PageTitle>
        <PageDescription>
          Sorting algorithms are methods for reorganizing a sequence of items in a specific order.
          This visualization will demonstrate popular sorting algorithms like Bubble Sort, Quick Sort, Merge Sort, and more.
        </PageDescription>
      </PageHeader>
      
      <ComingSoonContainer>
        <ComingSoonTitle>Coming Soon!</ComingSoonTitle>
        <ComingSoonText>
          We're working hard to bring you interactive visualizations of various sorting algorithms.
          Check back soon to explore step-by-step animations of how these algorithms work.
        </ComingSoonText>
        
        <AlgorithmPreview>
          {bars.map((height, index) => (
            <AlgorithmBar 
              key={index} 
              height={height}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            />
          ))}
        </AlgorithmPreview>
        
        <motion.div 
          style={{ marginTop: '2rem' }}
          whileHover={{ scale: 1.05 }}
        >
          <button 
            onClick={generateRandomBars}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6366F1',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <FiRefreshCw size={18} /> Generate New Array
          </button>
        </motion.div>
      </ComingSoonContainer>
    </PageContainer>
  );
};

export default SortingPage; 