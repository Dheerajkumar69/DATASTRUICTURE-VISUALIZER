import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useAccessibility } from '../accessibility/AccessibilityProvider';

// Advanced easing functions
const easings = {
  easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

// Smooth entrance animations
const slideInLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(100px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-100px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const scaleIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
`;

const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const rotateIn = keyframes`
  0% {
    opacity: 0;
    transform: rotate(-200deg);
  }
  100% {
    opacity: 1;
    transform: rotate(0);
  }
`;

const flipInX = keyframes`
  0% {
    opacity: 0;
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
  }
  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
  }
  60% {
    opacity: 1;
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
  }
  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }
  100% {
    opacity: 1;
    transform: perspective(400px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const shake = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`;

const wobble = keyframes`
  0% {
    transform: translateX(0%);
  }
  15% {
    transform: translateX(-25%) rotate(-5deg);
  }
  30% {
    transform: translateX(20%) rotate(3deg);
  }
  45% {
    transform: translateX(-15%) rotate(-3deg);
  }
  60% {
    transform: translateX(10%) rotate(2deg);
  }
  75% {
    transform: translateX(-5%) rotate(-1deg);
  }
  100% {
    transform: translateX(0%);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px ${props => props.theme?.colors?.primary || '#4F46E5'};
  }
  50% {
    box-shadow: 0 0 20px ${props => props.theme?.colors?.primary || '#4F46E5'}, 
                0 0 30px ${props => props.theme?.colors?.primary || '#4F46E5'};
  }
`;

// Staggered animation utilities
const staggerDelay = (index: number, baseDelay: number = 0.1) => css`
  animation-delay: ${index * baseDelay}s;
`;

// Animation components
interface AnimatedElementProps {
  animation: string;
  duration?: number;
  delay?: number;
  easing?: keyof typeof easings;
  children: React.ReactNode;
  className?: string;
  infinite?: boolean;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

const AnimationWrapper = styled.div<{
  $animation: any;
  $duration: number;
  $delay: number;
  $easing: string;
  $infinite: boolean;
  $direction: string;
  $reduceMotion: boolean;
}>`
  ${props => !props.$reduceMotion && css`
    animation: ${props.$animation} ${props.$duration}s ${props.$easing} ${props.$delay}s ${props.$infinite ? 'infinite' : 'both'};
    animation-direction: ${props.$direction};
  `}
`;

export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  animation,
  duration = 0.6,
  delay = 0,
  easing = 'easeOutCubic',
  children,
  className,
  infinite = false,
  direction = 'normal'
}) => {
  const { settings } = useAccessibility();
  
  const animationMap = {
    slideInLeft,
    slideInRight,
    slideInUp,
    slideInDown,
    fadeIn,
    scaleIn,
    bounceIn,
    rotateIn,
    flipInX,
    pulse,
    shake,
    wobble,
    glow
  };
  
  const selectedAnimation = animationMap[animation as keyof typeof animationMap] || fadeIn;
  
  return (
    <AnimationWrapper
      $animation={selectedAnimation}
      $duration={duration}
      $delay={delay}
      $easing={easings[easing]}
      $infinite={infinite}
      $direction={direction}
      $reduceMotion={settings.reduceMotion}
      className={className}
    >
      {children}
    </AnimationWrapper>
  );
};

// Staggered list animation
interface StaggeredListProps {
  children: React.ReactNode[];
  animation?: string;
  staggerDelay?: number;
  className?: string;
}

const StaggeredContainer = styled.div`
  display: contents;
`;

const StaggeredItem = styled.div<{
  $index: number;
  $staggerDelay: number;
  $animation: any;
  $reduceMotion: boolean;
}>`
  ${props => !props.$reduceMotion && css`
    animation: ${props.$animation} 0.6s ${easings.easeOutCubic} ${props.$index * props.$staggerDelay}s both;
  `}
`;

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  animation = 'slideInUp',
  staggerDelay = 0.1,
  className
}) => {
  const { settings } = useAccessibility();
  
  const animationMap = {
    slideInLeft,
    slideInRight,
    slideInUp,
    slideInDown,
    fadeIn,
    scaleIn,
    bounceIn
  };
  
  const selectedAnimation = animationMap[animation as keyof typeof animationMap] || slideInUp;
  
  return (
    <StaggeredContainer className={className}>
      {React.Children.map(children, (child, index) => (
        <StaggeredItem
          key={index}
          $index={index}
          $staggerDelay={staggerDelay}
          $animation={selectedAnimation}
          $reduceMotion={settings.reduceMotion}
        >
          {child}
        </StaggeredItem>
      ))}
    </StaggeredContainer>
  );
};

// Interactive hover effects
const HoverEffect = styled.div<{ effect: string; $reduceMotion: boolean }>`
  transition: all 0.3s ${easings.easeOutCubic};
  
  ${props => !props.$reduceMotion && css`
    &:hover {
      ${props.effect === 'lift' && css`
        transform: translateY(-8px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      `}
      
      ${props.effect === 'scale' && css`
        transform: scale(1.05);
      `}
      
      ${props.effect === 'rotate' && css`
        transform: rotate(5deg);
      `}
      
      ${props.effect === 'glow' && css`
        box-shadow: 0 0 20px ${props.theme.colors.primary}40;
      `}
      
      ${props.effect === 'slide' && css`
        transform: translateX(10px);
      `}
    }
  `}
`;

interface HoverAnimationProps {
  effect: 'lift' | 'scale' | 'rotate' | 'glow' | 'slide';
  children: React.ReactNode;
  className?: string;
}

export const HoverAnimation: React.FC<HoverAnimationProps> = ({
  effect,
  children,
  className
}) => {
  const { settings } = useAccessibility();
  
  return (
    <HoverEffect 
      effect={effect} 
      $reduceMotion={settings.reduceMotion}
      className={className}
    >
      {children}
    </HoverEffect>
  );
};

// Page transition animations
const pageSlideLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pageSlideRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pageFade = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const PageTransition = styled.div<{
  $animation: any;
  $reduceMotion: boolean;
}>`
  ${props => !props.$reduceMotion && css`
    animation: ${props.$animation} 0.4s ${easings.easeOutQuad} both;
  `}
`;

interface PageTransitionProps {
  type?: 'slide-left' | 'slide-right' | 'fade';
  children: React.ReactNode;
}

export const PageTransitionWrapper: React.FC<PageTransitionProps> = ({
  type = 'fade',
  children
}) => {
  const { settings } = useAccessibility();
  
  const transitionMap = {
    'slide-left': pageSlideLeft,
    'slide-right': pageSlideRight,
    'fade': pageFade
  };
  
  return (
    <PageTransition
      $animation={transitionMap[type]}
      $reduceMotion={settings.reduceMotion}
    >
      {children}
    </PageTransition>
  );
};
