
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import styled from 'styled-components';

const StyledMotionDiv = styled(motion.div)`
  width: 100%;
  height: 100%;
`;

interface AnimatedContainerProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className,
  ...motionProps
}) => {
  return (
    <StyledMotionDiv
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      {...motionProps}
    >
      {children}
    </StyledMotionDiv>
  );
};
