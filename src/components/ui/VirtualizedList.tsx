import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useVirtualization } from '../../hooks/useVirtualization';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  width?: string | number;
  renderItem: (props: { item: T; index: number }) => React.ReactNode;
  className?: string;
}

const Container = styled.div<{ width?: string | number; height: number }>`
  width: ${props => typeof props.width === 'number' ? `${props.width}px` : props.width || '100%'};
  height: ${props => props.height}px;
  overflow: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.card};
`;

const VirtualizedContainer = styled.div<{ totalHeight: number }>`
  height: ${props => props.totalHeight}px;
  position: relative;
`;

const VisibleArea = styled.div<{ offsetY: number }>`
  transform: translateY(${props => props.offsetY}px);
`;

function VirtualizedList<T>({
  items,
  itemHeight,
  height,
  width,
  renderItem,
  className
}: VirtualizedListProps<T>) {
  const containerHeight = height;
  
  const {
    visibleItems,
    visibleRange,
    totalHeight,
    offsetY,
    handleScroll
  } = useVirtualization(items, {
    itemHeight,
    containerHeight,
    overscan: 5
  });

  const visibleElements = useMemo(() => {
    return visibleItems.map((item, localIndex) => {
      const globalIndex = localIndex + (visibleRange?.startIndex || 0);
      return (
        <div
          key={globalIndex}
          style={{
            height: itemHeight,
            display: 'flex',
            alignItems: 'center',
            padding: '0 1rem'
          }}
        >
          {renderItem({ item, index: globalIndex })}
        </div>
      );
    });
  }, [visibleItems, itemHeight, renderItem, visibleRange]);

  return (
    <Container 
      width={width} 
      height={height} 
      className={className}
      onScroll={handleScroll}
      data-testid="virtualized-container"
    >
      <VirtualizedContainer totalHeight={totalHeight}>
        <VisibleArea offsetY={offsetY}>
          {visibleElements}
        </VisibleArea>
      </VirtualizedContainer>
    </Container>
  );
}

export { VirtualizedList };
export type { VirtualizedListProps };