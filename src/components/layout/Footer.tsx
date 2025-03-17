import React from 'react';
import styled from 'styled-components';
import { FiHeart, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const FooterContainer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  text-align: center;
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: 1rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const FooterLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.gray600};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HeartIcon = styled(FiHeart)`
  color: #FF0000; /* Bright red color */
  margin: 0 0.25rem;
  fill: #FF0000; /* Fill the heart icon */
  stroke-width: 2px; /* Make the outline thicker */
  font-size: 1.2em; /* Make it slightly larger */
`;

const Footer: React.FC = () => {
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
          <FooterLink href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FiGithub size={20} />
          </FooterLink>
          <FooterLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FiTwitter size={20} />
          </FooterLink>
          <FooterLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FiLinkedin size={20} />
          </FooterLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 