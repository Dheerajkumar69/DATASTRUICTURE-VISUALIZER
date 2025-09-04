import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiSun, FiMoon, FiGithub } from 'react-icons/fi';
import { useTheme } from '../../themes/ThemeContext';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: 10;
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
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.3s ease;
`;

const LogoCredit = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray600};
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
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

<<<<<<< HEAD
<<<<<<< HEAD
const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.hover};
  color: ${({ theme }) => theme.text};
  font-weight: 500;
  font-size: 0.875rem;
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;
  border: 1px solid ${({ theme }) => theme.border};
  
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.cardBackground};
    border-color: ${({ theme }) => theme.primary};
  }
`;

=======
>>>>>>> parent of 5badfa4 (version 4.0.0)
=======
>>>>>>> parent of 5badfa4 (version 4.0.0)
const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.textLight};
  transition: ${({ theme }) => theme.transitions.default};
  border: 1px solid transparent;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray900};
    border-color: ${({ theme }) => theme.colors.border};
    
  }
`;

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <HeaderContainer role="banner">
      <Logo to="/">
        <LogoIcon>DS</LogoIcon>
        <LogoText>
          <LogoTitle>Data Structure Visualizer</LogoTitle>
          <LogoCredit>by Dheeraj Kumar</LogoCredit>
        </LogoText>
      </Logo>
      <HeaderActions>
        <IconButton onClick={toggleTheme} aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </IconButton>
        <IconButton as="a" href="https://github.com/dheerajkumargaur/DSA_Visualizer" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
          <FiGithub size={20} />
        </IconButton>
      </HeaderActions>
      
      {/* Screen reader announcements placeholder */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" />
    </HeaderContainer>
  );
};

export default Header; 