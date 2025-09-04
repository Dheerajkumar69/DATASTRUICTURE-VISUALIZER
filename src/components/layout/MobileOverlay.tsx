import React from 'react';
import styled from 'styled-components';

interface MobileOverlayProps {
  isOpen: boolean;
  onClick: () => void;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  
  ${({ theme }) => theme.media.desktop} {
    display: none;
  }
`;

const MobileOverlay: React.FC<MobileOverlayProps> = ({ isOpen, onClick }) => {
  return <Overlay isOpen={isOpen} onClick={onClick} />;
};

export default MobileOverlay;
