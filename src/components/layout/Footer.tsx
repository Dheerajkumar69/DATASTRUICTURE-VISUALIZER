import React from 'react';
import styled from 'styled-components';
import { FiHeart, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const FooterContainer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  text-align: center;
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1rem;
  transition: color 0.3s ease;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const FooterLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.textLight};
  background-color: ${({ theme }) => theme.colors.gray200};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray300};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const HeartIcon = styled(FiHeart)`
  color: ${({ theme }) => theme.colors.danger};
  margin: 0 0.25rem;
  fill: ${({ theme }) => theme.colors.danger};
  stroke-width: 2px;
  font-size: 1.2em;
  animation: heartbeat 1.5s ease infinite;
  
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }
`;

const Copyright = styled.div`
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  opacity: 0.8;
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>
          Data Structure Visualizer is an interactive tool designed to help you understand and visualize data structures and algorithms.
        </FooterText>
        <FooterText>
          Made with <HeartIcon /> by Dheeraj Kumar
        </FooterText>
        <FooterLinks>
          <FooterLink 
            href="https://github.com/dheerajkumargaur/DSA_Visualizer" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="GitHub"
          >
            <FiGithub size={20} />
          </FooterLink>
          <FooterLink 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Twitter"
          >
            <FiTwitter size={20} />
          </FooterLink>
          <FooterLink 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="LinkedIn"
          >
            <FiLinkedin size={20} />
          </FooterLink>
        </FooterLinks>
        <Copyright>© {currentYear} Data Structure Visualizer. All rights reserved.</Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 