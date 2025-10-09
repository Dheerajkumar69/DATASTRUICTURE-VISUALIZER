import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ArrayItem {
  value: number;
  index: number;
  state: 'default' | 'active' | 'comparing' | 'sorted';
}

interface ArrayVisualizerProps {
  data: ArrayItem[];
  width?: number;
  height?: number;
  className?: string;
}

const Container = styled.div<{ width?: number; height?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.width ? `${props.width}px` : '100%'};
  height: ${props => props.height ? `${props.height}px` : 'auto'};
  min-height: 100px;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ArrayContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
`;

const ArrayElement = styled(motion.div)<{ state: string }>`
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  border: 2px solid;
  
  background-color: ${({ state, theme }) => {
    switch (state) {
      case 'active':
        return theme.colors.primary;
      case 'comparing':
        return theme.colors.warning;
      case 'sorted':
        return theme.colors.success;
      default:
        return theme.colors.gray200;
    }
  }};
  
  color: ${({ state, theme }) => {
    switch (state) {
      case 'active':
      case 'comparing':
      case 'sorted':
        return '#ffffff';
      default:
        return theme.colors.text;
    }
  }};
  
  border-color: ${({ state, theme }) => {
    switch (state) {
      case 'active':
        return theme.colors.primaryDark;
      case 'comparing':
        return theme.colors.warning;
      case 'sorted':
        return theme.colors.success;
      default:
        return theme.colors.border;
    }
  }};
`;

const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  data,
  width,
  height,
  className
}) => {
  return (
    <Container width={width} height={height} className={className}>
      <ArrayContainer>
        {data.map((item, index) => (
          <ArrayElement
            key={`${item.index}-${index}`}
            state={item.state}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {item.value}
          </ArrayElement>
        ))}
      </ArrayContainer>
    </Container>
  );
};

export default ArrayVisualizer;