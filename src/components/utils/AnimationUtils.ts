import { css, keyframes } from 'styled-components';

export const ANIMATION_DURATION = {
  SHORT: 150,
  MEDIUM: 300,
  LONG: 600,
} as const;

export const ANIMATION_EASING = {
  DEFAULT: 'ease-in-out',
  LINEAR: 'linear',
  EASE_OUT: 'ease-out',
  EASE_IN: 'ease-in',
} as const;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const scaleIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const highlight = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(99,102,241,0.6); }
  70% { box-shadow: 0 0 0 10px rgba(99,102,241,0); }
  100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
`;

export const animatedCss = css`
  animation-duration: ${ANIMATION_DURATION.MEDIUM}ms;
  animation-timing-function: ${ANIMATION_EASING.DEFAULT};
`;

export type AnimationStep<T> = {
  state: T;
  description?: string;
};

export function cloneStep<T>(step: AnimationStep<T>): AnimationStep<T> {
  return { state: JSON.parse(JSON.stringify(step.state)), description: step.description };
}

export function measureAnimationPerformance(run: () => void): number {
  const start = performance.now();
  run();
  return performance.now() - start;
}


