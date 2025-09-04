import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { MobileHeader } from '../mobile/MobileHeader';
import { responsive } from '../mobile/MobileOptimizations';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  ${responsive.mobile(`
    padding: 16px;
  `)}
`;

const Footer = styled.footer`
  padding: 20px;
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  margin-top: auto;
  
  ${responsive.mobile(`
    padding: 16px;
  `)}
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.textLight};
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 14px;
  
  ${responsive.mobile(`
    font-size: 13px;
  `)}
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 12px;
  
  ${responsive.mobile(`
    gap: 16px;
    margin-top: 8px;
  `)}
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: underline;
  }
  
  ${responsive.mobile(`
    font-size: 13px;
  `)}
`;

interface MobileLayoutProps {
  children: ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <MobileHeader />
      <MainContent>
        {children}
      </MainContent>
      <Footer>
        <FooterContent>
          <FooterText>
            © 2024 DataStructure Visualizer. Built with React, TypeScript, and styled-components.
          </FooterText>
          <FooterLinks>
            <FooterLink href="https://github.com/yourusername/datastructure-visualizer" target="_blank" rel="noopener noreferrer">
              GitHub
            </FooterLink>
            <FooterLink href="mailto:your.email@example.com">
              Contact
            </FooterLink>
            <FooterLink href="/privacy">
              Privacy
            </FooterLink>
          </FooterLinks>
        </FooterContent>
      </Footer>
    </LayoutContainer>
  );
};
