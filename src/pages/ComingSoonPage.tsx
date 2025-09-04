import React from 'react';
import styled from 'styled-components';
import { FiClock } from 'react-icons/fi';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
`;

const ComingSoonIcon = styled(FiClock)`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray800};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.gray600};
  max-width: 600px;
  line-height: 1.6;
`;

interface ComingSoonPageProps {
  title: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ title }) => {
  return (
    <PageContainer>
      <ComingSoonIcon />
      <Title>{title}</Title>
      <Description>
        This algorithm visualization is currently under development. 
        We're working hard to bring you an interactive and educational experience.
        Please check back soon!
      </Description>
    </PageContainer>
  );
};

export default ComingSoonPage; 