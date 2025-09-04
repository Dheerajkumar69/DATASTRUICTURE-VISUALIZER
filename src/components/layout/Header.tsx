import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiGithub } from 'react-icons/fi';
import { Expand } from "@theme-toggles/react";
import { useTheme } from '../../themes/ThemeContext';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 100;
  transition: ${({ theme }) => theme.transitions.default};

  ${({ theme }) => theme.media.tablet} {
    padding: 0.75rem 1rem;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 0.5rem 1rem;
  }
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

  ${({ theme }) => theme.media.tablet} {
    font-size: 1.25rem;
  }

  ${({ theme }) => theme.media.mobile} {
    font-size: 1.125rem;
  }
`;

const LogoCredit = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLight};
  transition: color 0.3s ease;

  ${({ theme }) => theme.media.mobile} {
    display: none;
  }
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

  ${({ theme }) => theme.media.tablet} {
    width: 36px;
    height: 36px;
    font-size: 1.125rem;
    margin-right: 0.5rem;
  }

  ${({ theme }) => theme.media.mobile} {
    width: 32px;
    height: 32px;
    font-size: 1rem;
    margin-right: 0.5rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  button {
    color: ${({ theme }) => theme.colors.text} !important;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray200} !important;
    }
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
  const { isDarkMode, toggleTheme } = useTheme();

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
        <ThemeToggleWrapper>
          <Expand 
            duration={750} 
            toggled={isDarkMode}
            toggle={toggleTheme}
            {...({} as any)}
          />
        </ThemeToggleWrapper>
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