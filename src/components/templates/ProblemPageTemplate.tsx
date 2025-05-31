import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaUndo, FaStepForward } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlgorithmInfo } from '../../types/algorithm';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  background: white;
  padding: 1rem 0;
  z-index: 100;
`;

const NavigationRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-size: 0.9rem;
  margin-right: 1rem;
  
  &:hover {
    color: #007bff;
  }
`;

const PageHeader = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: #333;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const VisualizationContainer = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 400px;
`;

const ProblemDescription = styled.div`
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CodeContainer = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  overflow: auto;
`;

const AlgorithmInfoContainer = styled.div`
  margin-bottom: 2rem;
`;

const InfoSection = styled.div`
  margin-bottom: 1rem;
`;

const InfoTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const InfoText = styled.p`
  margin: 0;
  color: #666;
  line-height: 1.5;
`;

const TimeComplexityContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TimeComplexityItem = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
`;

const TimeComplexityLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const TimeComplexityValue = styled.div`
  font-weight: bold;
  color: #333;
`;

const VisualizationArea = styled.div`
  height: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
`;

interface ProblemPageTemplateProps {
  algorithmInfo: AlgorithmInfo;
  visualizationComponent: ReactNode;
  problemDescription: string;
}

const ProblemPageTemplate: React.FC<ProblemPageTemplateProps> = ({
  algorithmInfo,
  visualizationComponent,
  problemDescription
}) => {
  const [currentTab, setCurrentTab] = useState<string>('javascript');

  return (
    <PageContainer>
      <StickyHeader>
        <NavigationRow>
          <BackButton to="/algorithms/problems">
            ← Back to Problems
          </BackButton>
        </NavigationRow>
        <PageHeader>{algorithmInfo.name}</PageHeader>
      </StickyHeader>

      <AlgorithmInfoContainer>
        <InfoSection>
          <InfoTitle>Description</InfoTitle>
          <InfoText>{algorithmInfo.description}</InfoText>
        </InfoSection>

        <ProblemDescription>
          <InfoTitle>Problem</InfoTitle>
          <InfoText>{problemDescription}</InfoText>
        </ProblemDescription>

        <TimeComplexityContainer>
          <TimeComplexityItem>
            <TimeComplexityLabel>Best Case</TimeComplexityLabel>
            <TimeComplexityValue>{algorithmInfo.timeComplexity.best}</TimeComplexityValue>
          </TimeComplexityItem>
          <TimeComplexityItem>
            <TimeComplexityLabel>Average Case</TimeComplexityLabel>
            <TimeComplexityValue>{algorithmInfo.timeComplexity.average}</TimeComplexityValue>
          </TimeComplexityItem>
          <TimeComplexityItem>
            <TimeComplexityLabel>Worst Case</TimeComplexityLabel>
            <TimeComplexityValue>{algorithmInfo.timeComplexity.worst}</TimeComplexityValue>
          </TimeComplexityItem>
        </TimeComplexityContainer>

        <InfoSection>
          <InfoTitle>Space Complexity</InfoTitle>
          <InfoText>{algorithmInfo.spaceComplexity}</InfoText>
        </InfoSection>
      </AlgorithmInfoContainer>

      <ContentContainer>
        <VisualizationContainer>
          <VisualizationArea>
            {visualizationComponent}
          </VisualizationArea>
          <ButtonContainer>
            <Button>
              <FaPlay />
              Play
            </Button>
            <Button>
              <FaPause />
              Pause
            </Button>
            <Button>
              <FaStepForward />
              Step
            </Button>
            <Button>
              <FaUndo />
              Reset
            </Button>
          </ButtonContainer>
        </VisualizationContainer>

        <CodeContainer>
          <InfoTitle>Implementation</InfoTitle>
          <div>
            <ButtonContainer>
              {Object.keys(algorithmInfo.implementations).map(language => (
                <Button 
                  key={language} 
                  onClick={() => setCurrentTab(language)}
                  style={{ 
                    background: currentTab === language ? '#007bff' : '#6c757d'
                  }}
                >
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </Button>
              ))}
            </ButtonContainer>
            <SyntaxHighlighter language={currentTab} style={tomorrow}>
              {algorithmInfo.implementations[currentTab]}
            </SyntaxHighlighter>
          </div>
        </CodeContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default ProblemPageTemplate; 