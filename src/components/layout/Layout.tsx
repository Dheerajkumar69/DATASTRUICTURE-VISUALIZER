import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled.header`
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.colors.card};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Footer = styled.footer`
  padding: 1.5rem 2rem;
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FooterText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.875rem;
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header role="banner">
        <Logo to="/">Data Structure Visualizer</Logo>
        <Navigation role="navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/data-structures/array">Data Structures</NavLink>
          <NavLink to="/algorithms/sorting">Algorithms</NavLink>
        </Navigation>
      </Header>
      <MainContent role="main">
        {children}
      </MainContent>
      <Footer role="contentinfo">
        <FooterText>
          &copy; {new Date().getFullYear()} Data Structure Visualizer | 
          <a href="https://github.com/dheerajkumargaur/DSA_Visualizer" aria-label="GitHub repository" style={{ marginLeft: '0.5rem', color: 'inherit' }}>GitHub</a>
        </FooterText>
      </Footer>
    </LayoutContainer>
  );
};

export default Layout;