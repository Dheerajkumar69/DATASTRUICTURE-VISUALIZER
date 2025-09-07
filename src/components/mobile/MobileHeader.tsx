import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes, FaHome, FaList, FaCode, FaGithub, FaMoon, FaSun } from 'react-icons/fa';
import { MobileDrawer, responsive, TouchButton } from './MobileOptimizations';
import { useThemeContext } from '../../themes/ThemeContext';

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.card};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 64px;
  max-width: 1200px;
  margin: 0 auto;
  
  ${responsive.mobile(`
    padding: 0 12px;
    height: 56px;
  `)}
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 20px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  ${responsive.mobile(`
    font-size: 18px;
  `)}
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border-radius: 8px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.card};
  font-weight: bold;
  font-size: 16px;
  
  ${responsive.mobile(`
    width: 28px;
    height: 28px;
    margin-right: 8px;
    font-size: 14px;
  `)}
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${responsive.mobile(`
    display: none;
  `)}
`;

const MobileActions = styled.div`
  display: none;
  align-items: center;
  gap: 8px;
  
  ${responsive.mobile(`
    display: flex;
  `)}
`;

const NavLink = styled(Link)<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text};
  background: ${props => props.isActive ? props.theme.colors.primaryLight + '20' : 'transparent'};
  font-weight: ${props => props.isActive ? '600' : '400'};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const MobileNavLink = styled(NavLink)`
  padding: 16px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 4px;
  font-size: 16px;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ExternalLink = styled.a<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 4px;
  font-size: 16px;
  text-decoration: none;
  color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text};
  background: ${props => props.isActive ? props.theme.colors.primaryLight + '20' : 'transparent'};
  font-weight: ${props => props.isActive ? '600' : '400'};
  transition: all 0.2s ease;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const MenuButton = styled(TouchButton)`
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  padding: 8px;
  min-width: 40px;
  min-height: 40px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ThemeToggle = styled(TouchButton)`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px;
  min-width: 40px;
  min-height: 40px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DrawerHeader = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 20px;
`;

const DrawerTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  font-weight: 600;
`;

const DrawerSubtitle = styled.p`
  margin: 4px 0 0 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
`;

const NavSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DrawerFooter = styled.div`
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ThemeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ThemeLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

const navItems = [
  { path: '/', label: 'Home', icon: FaHome },
  { path: '/algorithms', label: 'Algorithms', icon: FaCode },
  { path: '/data-structures', label: 'Data Structures', icon: FaList },
];

export const MobileHeader: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useThemeContext();
  const location = useLocation();

  // Close drawer when route changes
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <Logo to="/">
            <LogoIcon>DS</LogoIcon>
            DataStructure Visualizer
          </Logo>
          
          <DesktopNav>
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink 
                  key={item.path} 
                  to={item.path}
                  isActive={location.pathname === item.path}
                >
                  <Icon />
                  {item.label}
                </NavLink>
              );
            })}
            
            <ThemeToggle 
              onClick={toggleTheme}
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </ThemeToggle>
          </DesktopNav>
          
          <MobileActions>
            <ThemeToggle 
              onClick={toggleTheme}
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </ThemeToggle>
            
            <MenuButton 
              onClick={() => setIsDrawerOpen(true)}
              title="Open menu"
            >
              <FaBars />
            </MenuButton>
          </MobileActions>
        </HeaderContent>
      </HeaderContainer>
      
      <MobileDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose}>
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerSubtitle>DataStructure Visualizer</DrawerSubtitle>
        </DrawerHeader>
        
        <NavSection>
          <SectionTitle>Main Pages</SectionTitle>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <MobileNavLink 
                key={item.path} 
                to={item.path}
                isActive={location.pathname === item.path}
                onClick={handleDrawerClose}
              >
                <Icon />
                {item.label}
              </MobileNavLink>
            );
          })}
        </NavSection>
        
        <NavSection>
          <SectionTitle>External Links</SectionTitle>
          <ExternalLink 
            href="https://github.com/dheerajkumargaur/DSA_Visualizer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
            View on GitHub
          </ExternalLink>
        </NavSection>
        
        <DrawerFooter>
          <ThemeSection>
            <ThemeLabel>Theme:</ThemeLabel>
            <ThemeToggle 
              onClick={toggleTheme}
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </ThemeToggle>
          </ThemeSection>
        </DrawerFooter>
      </MobileDrawer>
    </>
  );
};
