import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiSun, FiMoon, FiGithub } from 'react-icons/fi';
import { useThemeContext } from '../../themes/ThemeContext';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: 10;
  transition: all 0.3s ease-in-out;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
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
  color: ${({ theme }) => theme.colors.textLight};
  transition: color 0.3s ease;
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 700;
  font-size: 1.25rem;
  transition: background-color 0.3s ease;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.gray200};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 0.875rem;
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray300};
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.gray600};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray200};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <HeaderContainer>
      <Logo to="/">
        <LogoIcon>DS</LogoIcon>
        <LogoText>
          <LogoTitle>Data Structure Visualizer</LogoTitle>
          <LogoCredit>by Dheeraj Kumar</LogoCredit>
        </LogoText>
      </Logo>
      <HeaderActions>
        <ThemeToggle onClick={toggleTheme} aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          {isDarkMode ? (
            <>
              <FiSun size={16} /> Light Mode
            </>
          ) : (
            <>
              <FiMoon size={16} /> Dark Mode
            </>
          )}
        </ThemeToggle>
        <IconButton 
          as="a" 
          href="https://github.com/dheerajkumargaur/DSA_Visualizer" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="GitHub repository"
        >
          <FiGithub size={20} />
        </IconButton>
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header; 