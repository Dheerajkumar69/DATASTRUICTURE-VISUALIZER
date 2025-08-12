import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaStepForward, FaUndo } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlgorithmInfo } from '../../types/algorithm';

// Define the Step type
export interface Step {
  array: number[];
  activeIndices: number[];
  comparingIndices: number[];
  stepDescription: string;
}

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.background};
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
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.9rem;
  margin-right: 1rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PageHeader = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
`;

const VisualizationContainer = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 400px;
`;

const ArrayContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const ArrayElement = styled.div<{ isActive?: boolean; isComparing?: boolean }>`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => 
    props.isActive ? props.theme.colors.primary : 
    props.isComparing ? props.theme.colors.warning : 
    props.theme.colors.gray200};
  color: ${props => props.isActive || props.isComparing ? 'white' : props.theme.colors.text};
  border-radius: 4px;
  font-weight: bold;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.card};
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray400};
    cursor: not-allowed;
  }
`;

const StepDescription = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.gray100};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const CodeContainer = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
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
  color: ${({ theme }) => theme.colors.text};
`;

const InfoText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textLight};
`;

const TimeComplexityContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TimeComplexityItem = styled.div`
  background: ${({ theme }) => theme.colors.gray100};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem;
  border-radius: 4px;
`;

const TimeComplexityLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const TimeComplexityValue = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

interface ArrayPageTemplateProps {
  algorithmInfo: AlgorithmInfo;
  generateSteps: (array: number[]) => Step[];
  defaultArray?: number[];
}

const ArrayPageTemplate: React.FC<ArrayPageTemplateProps> = ({
  algorithmInfo,
  generateSteps,
  defaultArray
}) => {
  const [array, setArray] = useState<number[]>(defaultArray || []);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<Step[]>([]);
  const [speed, setSpeed] = useState(1000);
  const [stepDescription, setStepDescription] = useState('Click Start to begin visualization');
  const timerRef = useRef<NodeJS.Timeout>();

  const startSorting = () => {
    if (isPaused) {
      setIsPaused(false);
      return;
    }

    const steps = generateSteps(array);
    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsSorting(true);
    setIsPaused(false);
  };

  const pauseSorting = () => {
    setIsPaused(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const stepForward = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const reset = () => {
    setIsSorting(false);
    setIsPaused(false);
    setCurrentStep(0);
    setActiveIndices([]);
    setComparingIndices([]);
    setStepDescription('Click Start to begin visualization');
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  useEffect(() => {
    if (isSorting && !isPaused && currentStep < animationSteps.length) {
      const step = animationSteps[currentStep];
      setArray(step.array);
      setActiveIndices(step.activeIndices);
      setComparingIndices(step.comparingIndices);
      setStepDescription(step.stepDescription);

      timerRef.current = setTimeout(() => {
        if (currentStep < animationSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsSorting(false);
        }
      }, speed);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isSorting, isPaused, currentStep, animationSteps, speed]);

  return (
    <PageContainer>
      <StickyHeader>
        <NavigationRow>
          <BackButton to="/algorithms">
            ← Back to Algorithms
          </BackButton>
        </NavigationRow>
        <PageHeader>{algorithmInfo.name}</PageHeader>
      </StickyHeader>

      <AlgorithmInfoContainer>
        <InfoSection>
          <InfoTitle>Description</InfoTitle>
          <InfoText>{algorithmInfo.description}</InfoText>
        </InfoSection>

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
          <ArrayContainer>
            {array.map((value, index) => (
              <ArrayElement
                key={index}
                isActive={activeIndices.includes(index)}
                isComparing={comparingIndices.includes(index)}
              >
                {value}
              </ArrayElement>
            ))}
          </ArrayContainer>

          <ControlsContainer>
            <Button
              onClick={isSorting ? pauseSorting : startSorting}
              disabled={isSorting && !isPaused}
            >
              {isSorting && !isPaused ? <FaPause /> : <FaPlay />}
              {isSorting && !isPaused ? 'Pause' : 'Start'}
            </Button>
            <Button
              onClick={stepForward}
              disabled={!isSorting || isPaused || currentStep >= animationSteps.length - 1}
            >
              <FaStepForward />
              Step
            </Button>
            <Button onClick={reset}>
              <FaUndo />
              Reset
            </Button>
          </ControlsContainer>

          <StepDescription>
            {stepDescription}
          </StepDescription>
        </VisualizationContainer>

        <CodeContainer>
          <InfoTitle>Implementation</InfoTitle>
          {Object.entries(algorithmInfo.implementations).map(([language, code]) => (
            <div key={language}>
              <InfoText>{language.charAt(0).toUpperCase() + language.slice(1)}</InfoText>
              <SyntaxHighlighter language={language} style={tomorrow}>
                {code}
              </SyntaxHighlighter>
            </div>
          ))}
        </CodeContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default ArrayPageTemplate; 