import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';

// Mobile breakpoints
const breakpoints = {
  xs: '320px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px'
};

// Responsive utilities
const responsive = {
  xs: (styles: any) => css`
    @media (max-width: ${breakpoints.sm}) {
      ${styles}
    }
  `,
  sm: (styles: any) => css`
    @media (min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md}) {
      ${styles}
    }
  `,
  md: (styles: any) => css`
    @media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg}) {
      ${styles}
    }
  `,
  lg: (styles: any) => css`
    @media (min-width: ${breakpoints.lg}) and (max-width: ${breakpoints.xl}) {
      ${styles}
    }
  `,
  xl: (styles: any) => css`
    @media (min-width: ${breakpoints.xl}) {
      ${styles}
    }
  `,
  mobile: (styles: any) => css`
    @media (max-width: ${breakpoints.md}) {
      ${styles}
    }
  `,
  desktop: (styles: any) => css`
    @media (min-width: ${breakpoints.md}) {
      ${styles}
    }
  `
};

// Touch-optimized button
const TouchButton = styled.button`
  min-height: 44px; /* iOS recommended touch target */
  min-width: 44px;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.card};
  font-size: 16px; /* Prevents zoom on iOS */
  font-weight: 500;
  cursor: pointer;
  touch-action: manipulation; /* Prevents double-tap zoom */
  user-select: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
    background: ${({ theme }) => theme.colors.primaryDark};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  ${responsive.mobile(css`
    font-size: 18px;
    padding: 14px 20px;
  `)}
`;

// Mobile-optimized input
const MobileInput = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 12px 16px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px; /* Prevents zoom on iOS */
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
    opacity: 1;
  }
  
  ${responsive.mobile(css`
    font-size: 18px;
    padding: 16px 20px;
  `)}
`;

// Swipe gesture handler
interface SwipeHandlerProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

const SwipeContainer = styled.div`
  touch-action: pan-y; /* Allow vertical scrolling */
  user-select: none;
`;

export const SwipeHandler: React.FC<SwipeHandlerProps> = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  children,
  threshold = 50,
  className
}) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null || startY === null) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (absX > threshold && absX > absY) {
      // Horizontal swipe
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else if (absY > threshold && absY > absX) {
      // Vertical swipe
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }
    
    setStartX(null);
    setStartY(null);
  };

  return (
    <SwipeContainer
      className={className}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </SwipeContainer>
  );
};

// Mobile navigation drawer
const DrawerOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const DrawerContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: ${({ theme }) => theme.colors.card};
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;
  z-index: 1001;
  overflow-y: auto;
`;

const DrawerContent = styled.div`
  padding: 20px;
  height: 100%;
`;

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  children
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <DrawerOverlay isOpen={isOpen} onClick={onClose} />
      <DrawerContainer isOpen={isOpen}>
        <SwipeHandler onSwipeLeft={onClose}>
          <DrawerContent>
            {children}
          </DrawerContent>
        </SwipeHandler>
      </DrawerContainer>
    </>
  );
};

// Mobile-optimized card
const MobileCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  ${responsive.mobile(css`
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 8px;
  `)}
`;

// Pull-to-refresh component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}

const PullToRefreshContainer = styled.div`
  position: relative;
  overflow-y: auto;
  height: 100%;
`;

const RefreshIndicator = styled.div<{ isVisible: boolean; pullDistance: number }>`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(${props => props.pullDistance}px);
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.2s ease;
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.card};
  border-radius: 20px;
  font-size: 14px;
  z-index: 10;
`;

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null || containerRef.current?.scrollTop !== 0) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);
    
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance * 0.5, threshold));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    setStartY(null);
  };

  return (
    <PullToRefreshContainer
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <RefreshIndicator 
        isVisible={pullDistance > 20} 
        pullDistance={Math.max(0, pullDistance - 40)}
      >
        {isRefreshing ? 'Refreshing...' : pullDistance >= threshold ? 'Release to refresh' : 'Pull to refresh'}
      </RefreshIndicator>
      {children}
    </PullToRefreshContainer>
  );
};

// Mobile-optimized grid
const ResponsiveGrid = styled.div<{ 
  cols: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
}>`
  display: grid;
  gap: ${props => props.gap || 16}px;
  
  grid-template-columns: repeat(${props => props.cols.xs || 1}, 1fr);
  
  ${props => props.cols.sm && responsive.sm(css`
    grid-template-columns: repeat(${props.cols.sm}, 1fr);
  `)}
  
  ${props => props.cols.md && responsive.md(css`
    grid-template-columns: repeat(${props.cols.md}, 1fr);
  `)}
  
  ${props => props.cols.lg && responsive.lg(css`
    grid-template-columns: repeat(${props.cols.lg}, 1fr);
  `)}
  
  ${props => props.cols.xl && responsive.xl(css`
    grid-template-columns: repeat(${props.cols.xl}, 1fr);
  `)}
`;

interface ResponsiveGridProps {
  cols: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
  children: React.ReactNode;
  className?: string;
}

export const MobileGrid: React.FC<ResponsiveGridProps> = ({
  cols,
  gap,
  children,
  className
}) => {
  return (
    <ResponsiveGrid cols={cols} gap={gap} className={className}>
      {children}
    </ResponsiveGrid>
  );
};

// Touch-friendly tabs
const TabContainer = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 4px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button<{ isActive: boolean }>`
  flex: 1;
  min-width: 120px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  background: ${props => props.isActive ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.isActive ? 'white' : props.theme.colors.text};
  font-weight: ${props => props.isActive ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-size: 14px;
  
  &:hover {
    background: ${props => props.isActive 
      ? props.theme.colors.primaryDark 
      : props.theme.colors.hover
    };
  }
  
  ${responsive.mobile(css`
    padding: 14px 20px;
    font-size: 16px;
  `)}
`;

interface MobileTabsProps {
  tabs: { id: string; label: string; content: React.ReactNode }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const MobileTabs: React.FC<MobileTabsProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  const activeTabData = tabs.find(tab => tab.id === activeTab);
  
  return (
    <div>
      <TabContainer>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            isActive={tab.id === activeTab}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabContainer>
      <div style={{ marginTop: '20px' }}>
        {activeTabData?.content}
      </div>
    </div>
  );
};

// Export utilities
export { TouchButton, MobileInput, MobileCard, responsive, breakpoints };
