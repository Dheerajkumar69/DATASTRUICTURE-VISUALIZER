import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { AlgorithmInfo } from '../../types/algorithm';
import { Tabs, TabContent } from '../common/Tabs';
import CodeBlock from '../common/CodeBlock';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavigationRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  text-decoration: none;
  margin-right: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textLight};
  max-width: 800px;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ContentSection = styled.div`
  margin-bottom: 2rem;
  max-width: 800px;
`;

const VisualizationSection = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  min-height: 650px;
  display: flex;
  flex-direction: column;
`;

const InfoCard = styled.div`
  padding: 1.5rem;
  background-color: ${props => props.theme.colors.card};
  transition: all 0.3s ease;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  margin-bottom: 1.5rem;
`;

const InfoTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ComplexityTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
`;

const ComplexityRow = styled.tr`
  &:nth-child(even) {
    background-color: ${props => props.theme.colors.background};
  transition: all 0.3s ease;
  }
`;

const ComplexityCell = styled.td`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ComplexityHeader = styled.th`
  padding: 0.5rem;
  text-align: left;
  background-color: ${props => props.theme.colors.background};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.colors.border};
  font-weight: 500;
`;

interface GraphProblemTemplateProps {
  algorithmInfo: AlgorithmInfo;
  visualizationComponent: ReactNode;
  problemDescription: string;
  additionalInfo?: ReactNode;
}

const GraphProblemTemplate: React.FC<GraphProblemTemplateProps> = ({
  algorithmInfo,
  visualizationComponent,
  problemDescription,
  additionalInfo
}) => {
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms">
          <FaArrowLeft /> Back to Algorithms
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>{algorithmInfo.name}</PageTitle>
        <Description>{algorithmInfo.description}</Description>
      </PageHeader>
      
      <VisualizationSection>
        {visualizationComponent}
      </VisualizationSection>
      
      <Tabs defaultTab="problem">
        <TabContent label="Problem" value="problem">
          <ContentSection>
            <InfoCard>
              <div dangerouslySetInnerHTML={{ __html: problemDescription }} />
            </InfoCard>
          </ContentSection>
        </TabContent>
        
        <TabContent label="Complexity" value="complexity">
          <ContentSection>
            <InfoCard>
              <InfoTitle>Time & Space Complexity</InfoTitle>
              <ComplexityTable>
                <thead>
                  <ComplexityRow>
                    <ComplexityHeader>Complexity Type</ComplexityHeader>
                    <ComplexityHeader>Value</ComplexityHeader>
                  </ComplexityRow>
                </thead>
                <tbody>
                  {typeof algorithmInfo.timeComplexity === 'object' ? (
                    <>
                      <ComplexityRow>
                        <ComplexityCell>Time (Best Case)</ComplexityCell>
                        <ComplexityCell>{algorithmInfo.timeComplexity.best}</ComplexityCell>
                      </ComplexityRow>
                      <ComplexityRow>
                        <ComplexityCell>Time (Average Case)</ComplexityCell>
                        <ComplexityCell>{algorithmInfo.timeComplexity.average}</ComplexityCell>
                      </ComplexityRow>
                      <ComplexityRow>
                        <ComplexityCell>Time (Worst Case)</ComplexityCell>
                        <ComplexityCell>{algorithmInfo.timeComplexity.worst}</ComplexityCell>
                      </ComplexityRow>
                    </>
                  ) : (
                    <ComplexityRow>
                      <ComplexityCell>Time Complexity</ComplexityCell>
                      <ComplexityCell>{algorithmInfo.timeComplexity}</ComplexityCell>
                    </ComplexityRow>
                  )}
                  <ComplexityRow>
                    <ComplexityCell>Space Complexity</ComplexityCell>
                    <ComplexityCell>{algorithmInfo.spaceComplexity}</ComplexityCell>
                  </ComplexityRow>
                </tbody>
              </ComplexityTable>
            </InfoCard>
          </ContentSection>
        </TabContent>
        
        <TabContent label="Code" value="code">
          <ContentSection>
            <Tabs defaultTab="javascript">
              {Object.entries(algorithmInfo.implementations).map(([language, code]) => (
                <TabContent key={language} label={language} value={language}>
                  <CodeBlock code={code} language={language} />
                </TabContent>
              ))}
            </Tabs>
          </ContentSection>
        </TabContent>
        
        {additionalInfo && (
          <TabContent label="More Info" value="more-info">
            <ContentSection>
              {additionalInfo}
            </ContentSection>
          </TabContent>
        )}
      </Tabs>
    </PageContainer>
  );
};

export default GraphProblemTemplate; 