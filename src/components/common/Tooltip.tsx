import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  disabled?: boolean;
  maxWidth?: string;
  showArrow?: boolean;
  offset?: number;
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled(motion.div)<{
  $placement: string;
  $maxWidth: string;
  $offset: number;
}>`
  position: absolute;
  z-index: 1000;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.gray900};
  transition: all 0.3s ease;
  color: ${({ theme }) => theme.colors.background};
  transition: all 0.3s ease;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  line-height: ${({ theme }) => theme.lineHeights.body};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  white-space: pre-wrap;
  max-width: ${({ $maxWidth }) => $maxWidth};
  word-wrap: break-word;
  pointer-events: none;
  
  ${({ $placement, $offset }) => {
    switch ($placement) {
      case 'top':
        return `
          bottom: calc(100% + ${$offset}px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'bottom':
        return `
          top: calc(100% + ${$offset}px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'left':
        return `
          right: calc(100% + ${$offset}px);
          top: 50%;
          transform: translateY(-50%);
        `;
      case 'right':
        return `
          left: calc(100% + ${$offset}px);
          top: 50%;
          transform: translateY(-50%);
        `;
      default:
        return `
          bottom: calc(100% + ${$offset}px);
          left: 50%;
          transform: translateX(-50%);
        `;
    }
  }}
`;

const TooltipArrow = styled.div<{ $placement: string }>`
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  
  ${({ $placement, theme }) => {
    switch ($placement) {
      case 'top':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-top-color: ${theme.colors.gray900};
        `;
      case 'bottom':
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-bottom-color: ${theme.colors.gray900};
        `;
      case 'left':
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-left-color: ${theme.colors.gray900};
        `;
      case 'right':
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-right-color: ${theme.colors.gray900};
        `;
      default:
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-top-color: ${theme.colors.gray900};
        `;
    }
  }}
`;

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  trigger = 'hover',
  delay = 0,
  disabled = false,
  maxWidth = '200px',
  showArrow = true,
  offset = 8
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPlacement, setActualPlacement] = useState(placement);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const adjustPlacement = () => {
    if (!containerRef.current || !tooltipRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let newPlacement = placement;

    // Check if tooltip would go outside viewport and adjust
    switch (placement) {
      case 'top':
        if (containerRect.top - tooltipRect.height - offset < 0) {
          newPlacement = 'bottom';
        }
        break;
      case 'bottom':
        if (containerRect.bottom + tooltipRect.height + offset > viewport.height) {
          newPlacement = 'top';
        }
        break;
      case 'left':
        if (containerRect.left - tooltipRect.width - offset < 0) {
          newPlacement = 'right';
        }
        break;
      case 'right':
        if (containerRect.right + tooltipRect.width + offset > viewport.width) {
          newPlacement = 'left';
        }
        break;
    }

    setActualPlacement(newPlacement);
  };

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        // Adjust placement after tooltip becomes visible
        requestAnimationFrame(adjustPlacement);
      }, delay);
    } else {
      setIsVisible(true);
      // Adjust placement after tooltip becomes visible
      requestAnimationFrame(adjustPlacement);
    }
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      showTooltip();
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      hideTooltip();
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') {
      showTooltip();
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus') {
      hideTooltip();
    }
  };

  // Click outside to close for click trigger
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        trigger === 'click' &&
        isVisible &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        hideTooltip();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [trigger, isVisible]);

  if (!content || disabled) {
    return <>{children}</>;
  }

  return (
    <TooltipContainer
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <TooltipContent
            ref={tooltipRef}
            $placement={actualPlacement}
            $maxWidth={maxWidth}
            $offset={offset}
            initial={{
              opacity: 0,
              scale: 0.8,
              y: actualPlacement === 'top' ? 10 : actualPlacement === 'bottom' ? -10 : 0,
              x: actualPlacement === 'left' ? 10 : actualPlacement === 'right' ? -10 : 0
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: actualPlacement === 'top' ? 10 : actualPlacement === 'bottom' ? -10 : 0,
              x: actualPlacement === 'left' ? 10 : actualPlacement === 'right' ? -10 : 0
            }}
            transition={{
              duration: 0.15,
              ease: 'easeOut'
            }}
          >
            {content}
            {showArrow && <TooltipArrow $placement={actualPlacement} />}
          </TooltipContent>
        )}
      </AnimatePresence>
    </TooltipContainer>
  );
};

export default Tooltip;

// Helper component for common tooltip patterns
export const HelpTooltip: React.FC<{
  children: React.ReactNode;
  text: string;
}> = ({ children, text }) => (
  <Tooltip
    content={text}
    placement="top"
    delay={300}
    maxWidth="300px"
  >
    {children}
  </Tooltip>
);

// Keyboard shortcut tooltip
export const KeyboardShortcutTooltip: React.FC<{
  children: React.ReactNode;
  shortcut: string;
  description?: string;
}> = ({ children, shortcut, description }) => (
  <Tooltip
    content={
      <div>
        {description && <div style={{ marginBottom: '0.5rem' }}>{description}</div>}
        <div style={{ 
          fontSize: '0.75rem', 
          opacity: 0.8,
          fontFamily: 'monospace',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          {shortcut}
        </div>
      </div>
    }
    placement="bottom"
    delay={0}
  >
    {children}
  </Tooltip>
);
