import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../../hooks/useAccessibility';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.cardBackground};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: 10;
  transition: all 0.3s ease-in-out;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.primaryDark};
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoTitle = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  transition: color 0.3s ease;
`;

const LogoCredit = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textLight};
  transition: color 0.3s ease;
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 0.75rem;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 700;
  font-size: 1.25rem;
  transition: background-color 0.3s ease;
`;


const Header: React.FC = () => {
  const { announceRef } = useAccessibility();

  return (
    <HeaderContainer role="banner">
      <Logo to="/">
        <LogoIcon>DS</LogoIcon>
        <LogoText>
          <LogoTitle>Data Structure Visualizer</LogoTitle>
          <LogoCredit>by Dheeraj Kumar</LogoCredit>
        </LogoText>
      </Logo>
      
      {/* Screen reader announcements */}
      <div ref={announceRef} aria-live="polite" aria-atomic="true" className="sr-only" />
    </HeaderContainer>
  );
};

export default Header; 