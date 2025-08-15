import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  margin-bottom: 2rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
    transform: translateX(-2px);
  }
`;

const Header = styled.div`
  margin-bottom: 3rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.5rem 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0 0 1rem 0;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const MetaBadge = styled.div<{ color?: string }>`
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${({ color = '#E5E7EB' }) => color};
  color: ${({ color }) => color === '#E5E7EB' ? '#374151' : 'white'};
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
  max-width: 800px;
  margin: 1.5rem auto 0;
  line-height: 1.6;
`;

const ComplexityInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem auto;
  max-width: 600px;
`;

const ComplexityCard = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`;

const ComplexityLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const ComplexityValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
`;

const ContentWrapper = styled.div`
  width: 100%;
`;

interface ProblemData {
  title: string;
  subtitle?: string;
  difficulty: string;
  category: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  approach?: string;
}

interface SimpleProblemPageTemplateProps {
  problemData: ProblemData;
  children: ReactNode;
}

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return '#10B981';
    case 'medium': return '#F59E0B';
    case 'hard': return '#EF4444';
    default: return '#6B7280';
  }
};

const SimpleProblemPageTemplate: React.FC<SimpleProblemPageTemplateProps> = ({
  problemData,
  children
}) => {
  return (
    <PageContainer>
      <BackButton to="/algorithms/problems-index">
        <FiArrowLeft />
        Back to Algorithm Problems
      </BackButton>
      
      <Header>
        <Title>{problemData.title}</Title>
        {problemData.subtitle && (
          <Subtitle>{problemData.subtitle}</Subtitle>
        )}
        
        <MetaInfo>
          <MetaBadge color={getDifficultyColor(problemData.difficulty)}>
            {problemData.difficulty}
          </MetaBadge>
          <MetaBadge>
            {problemData.category}
          </MetaBadge>
        </MetaInfo>
        
        <Description>
          {problemData.description}
        </Description>
        
        <ComplexityInfo>
          <ComplexityCard>
            <ComplexityLabel>Time Complexity</ComplexityLabel>
            <ComplexityValue>{problemData.timeComplexity}</ComplexityValue>
          </ComplexityCard>
          <ComplexityCard>
            <ComplexityLabel>Space Complexity</ComplexityLabel>
            <ComplexityValue>{problemData.spaceComplexity}</ComplexityValue>
          </ComplexityCard>
        </ComplexityInfo>
        
        {problemData.approach && (
          <Description style={{ fontSize: '1rem', fontStyle: 'italic' }}>
            Approach: {problemData.approach}
          </Description>
        )}
      </Header>
      
      <ContentWrapper>
        {children}
      </ContentWrapper>
    </PageContainer>
  );
};

export default SimpleProblemPageTemplate;
