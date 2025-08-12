import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiRefreshCw, FiSkipForward, FiSkipBack, FiClock } from 'react-icons/fi';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ArrayControls from '../algorithms/ArrayControls';

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 10;
  padding-bottom: 1rem;
`;

const NavigationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray800};
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 800px;
  line-height: 1.6;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const VisualizationContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const CodeContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ControlButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: ${({ active, theme }) => active ? theme.colors.primary : 'white'};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.gray700};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.primaryDark : theme.colors.gray100};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SpeedControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SpeedLabel = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray700};
`;

const SpeedSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.card};
  font-size: 0.9rem;
`;

const BarContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 300px;
  gap: 4px;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.gray50};
`;

const Bar = styled(motion.div)<{ height: number; isActive: boolean; isComparing: boolean; isSorted: boolean }>`
  width: 30px;
  height: ${({ height }) => `${height}%`};
  background-color: ${({ isActive, isComparing, isSorted, theme }) => 
    isActive 
      ? theme.colors.warning
      : isComparing
        ? theme.colors.highlight
        : isSorted
          ? theme.colors.success
          : theme.colors.primary};
  border-radius: 4px 4px 0 0;
  position: relative;
  
  &::after {
    content: '${({ height }) => Math.round(height)}';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.gray700};
  }
`;

const StepInfo = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const StepDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray700};
  margin: 0;
`;

const CodeHighlight = styled.span`
  font-family: 'Fira Code', monospace;
  background-color: ${({ theme }) => theme.colors.gray200};
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
`;

const ComplexityInfo = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ComplexityItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius};
  
  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`;

const ComplexityLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray700};
`;

const ComplexityValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.primary};
`;

const CodeBlock = styled.div`
  background-color: #1E1E1E;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CodeTitle = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.card};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.875rem;
`;

const CodeContent = styled.div`
  flex: 1;
  overflow: auto;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray400};
  margin-bottom: 1rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${({ active }) => active ? '#333' : '#222'};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.gray400};
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.card};
  }
`;

// Types for the template
export interface CodeImplementation {
  language: string;
  title: string;
  code: string;
}

export interface SortingAlgorithmInfo {
  name: string;
  description: string;
  timeComplexityBest: string;
  timeComplexityAverage: string;
  timeComplexityWorst: string;
  spaceComplexity: string;
  stability: string;
  implementations: CodeImplementation[];
}

export interface AnimationStep {
  type: 'compare' | 'swap' | 'sorted';
  indices: number[];
  description: string;
}

interface SortingPageTemplateProps {
  algorithmInfo: SortingAlgorithmInfo;
  generateSteps: (arr: number[]) => AnimationStep[];
}

const SortingPageTemplate: React.FC<SortingPageTemplateProps> = ({ 
  algorithmInfo,
  generateSteps
}) => {
  const [array, setArray] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [speed, setSpeed] = useState<number>(500); // milliseconds
  const [arraySize, setArraySize] = useState<number>(10);
  const [stepDescription, setStepDescription] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  
  const animationRef = useRef<number | null>(null);
  const sortTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    generateRandomArray();
    return () => {
      if (sortTimeoutRef.current) {
        clearTimeout(sortTimeoutRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  const generateRandomArray = (size: number = arraySize) => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10);
    resetArrayState(newArray);
  };

  const handleCustomArray = (customArray: number[]) => {
    resetArrayState(customArray);
  };

  const resetArrayState = (newArray: number[]) => {
    setArray(newArray);
    setActiveIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setIsSorting(false);
    setIsPaused(false);
    setCurrentStep(0);
    setStepDescription('');
    
    if (sortTimeoutRef.current) {
      clearTimeout(sortTimeoutRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const steps = generateSteps([...newArray]);
    setAnimationSteps(steps);
  };
  
  const startSorting = () => {
    if (isPaused) {
      setIsPaused(false);
      return;
    }
    
    if (currentStep >= animationSteps.length) {
      resetArrayState([...array]);
      return;
    }
    
    setIsSorting(true);
    
    const animate = () => {
      if (currentStep < animationSteps.length) {
        animateStep(currentStep);
        const nextStep = currentStep + 1;
        
        if (nextStep < animationSteps.length) {
          sortTimeoutRef.current = setTimeout(() => {
            setCurrentStep(nextStep);
          }, speed);
        } else {
          setIsSorting(false);
        }
      }
    };
    
    animate();
  };
  
  const animateStep = (step: number) => {
    if (step < animationSteps.length) {
      const { type, indices, description } = animationSteps[step];
      
      setStepDescription(description);
      
      if (type === 'compare') {
        setComparingIndices(indices);
        setActiveIndices([]);
      } else if (type === 'swap') {
        setActiveIndices(indices);
        setComparingIndices([]);
        
        // Update array with swapped elements
        if (indices.length === 2) {
          const newArray = [...array];
          [newArray[indices[0]], newArray[indices[1]]] = [newArray[indices[1]], newArray[indices[0]]];
          setArray(newArray);
        }
      } else if (type === 'sorted') {
        setActiveIndices([]);
        setComparingIndices([]);
        setSortedIndices(prev => [...prev, ...indices]);
      }
    }
  };
  
  const pauseAnimation = () => {
    setIsPaused(true);
    if (sortTimeoutRef.current) {
      clearTimeout(sortTimeoutRef.current);
    }
  };
  
  const resetAnimation = () => {
    if (sortTimeoutRef.current) {
      clearTimeout(sortTimeoutRef.current);
    }
    
    resetArrayState([...array]);
  };
  
  const stepForward = () => {
    if (currentStep < animationSteps.length) {
      if (sortTimeoutRef.current) {
        clearTimeout(sortTimeoutRef.current);
      }
      
      animateStep(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };
  
  const stepBackward = () => {
    if (currentStep > 0) {
      if (sortTimeoutRef.current) {
        clearTimeout(sortTimeoutRef.current);
      }
      
      // Reset to initial state
      const newArray = [...array];
      setActiveIndices([]);
      setComparingIndices([]);
      setSortedIndices([]);
      
      const newStep = currentStep - 2 >= 0 ? currentStep - 2 : -1;
      
      // Then replay all steps up to the new step
      const tempArray = [...array];
      const newSortedIndices: number[] = [];
      
      for (let i = 0; i <= newStep; i++) {
        const step = animationSteps[i];
        
        if (step.type === 'swap' && step.indices.length === 2) {
          const [j, k] = step.indices;
          [tempArray[j], tempArray[k]] = [tempArray[k], tempArray[j]];
        } else if (step.type === 'sorted') {
          newSortedIndices.push(...step.indices);
        }
      }
      
      setArray(tempArray);
      setSortedIndices(newSortedIndices);
      setCurrentStep(newStep + 1);
      
      // Set the description and visual state for the current step
      const currentAnimation = animationSteps[newStep];
      if (currentAnimation) {
        setStepDescription(currentAnimation.description);
        
        if (currentAnimation.type === 'compare') {
          setComparingIndices(currentAnimation.indices);
          setActiveIndices([]);
        } else if (currentAnimation.type === 'swap') {
          setActiveIndices(currentAnimation.indices);
          setComparingIndices([]);
        } else {
          setActiveIndices([]);
          setComparingIndices([]);
        }
      } else {
        setStepDescription('');
      }
    }
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpeed(Number(e.target.value));
  };
  
  return (
    <PageContainer>
      <StickyHeader>
        <NavigationRow>
          <BackButton to="/algorithms/sorting">
            <FaArrowLeft />
            <span style={{ marginLeft: '0.5rem' }}>Back to Sorting Algorithms</span>
          </BackButton>
        </NavigationRow>
        
        <PageHeader>
          <PageTitle>{algorithmInfo.name}</PageTitle>
          <PageDescription>
            {algorithmInfo.description}
          </PageDescription>
        </PageHeader>
      </StickyHeader>
      
      <ContentContainer>
        <VisualizationContainer>
          <ArrayControls
            onGenerateRandom={generateRandomArray}
            onCustomArray={handleCustomArray}
            arraySize={arraySize}
            onSizeChange={setArraySize}
            disabled={isSorting && !isPaused}
            maxValue={100}
          />
          
          <ControlsContainer>
            {!isSorting || isPaused ? (
              <ControlButton 
                onClick={startSorting} 
                active={true}
              >
                <FiPlay size={16} />
                {isPaused ? 'Resume' : 'Start Sorting'}
              </ControlButton>
            ) : (
              <ControlButton 
                onClick={pauseAnimation}
              >
                <FiPause size={16} />
                Pause
              </ControlButton>
            )}
            
            <ControlButton 
              onClick={resetAnimation} 
              disabled={(!isSorting && !isPaused) && currentStep === 0}
            >
              <FiRefreshCw size={16} />
              Reset
            </ControlButton>
            
            <ControlButton 
              onClick={stepBackward} 
              disabled={currentStep <= 0 || (isSorting && !isPaused)}
            >
              <FiSkipBack size={16} />
              Step Back
            </ControlButton>
            
            <ControlButton 
              onClick={stepForward} 
              disabled={currentStep >= animationSteps.length || (isSorting && !isPaused)}
            >
              <FiSkipForward size={16} />
              Step Forward
            </ControlButton>
            
            <SpeedControl>
              <FiClock size={16} />
              <SpeedLabel>Speed:</SpeedLabel>
              <SpeedSelect value={speed} onChange={handleSpeedChange}>
                <option value="1000">Slow</option>
                <option value="500">Medium</option>
                <option value="200">Fast</option>
                <option value="50">Very Fast</option>
              </SpeedSelect>
            </SpeedControl>
          </ControlsContainer>
          
          <BarContainer>
            {array.map((value, index) => (
              <Bar
                key={index}
                height={value}
                isActive={activeIndices.includes(index)}
                isComparing={comparingIndices.includes(index)}
                isSorted={sortedIndices.includes(index)}
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </BarContainer>
          
          {stepDescription && (
            <StepInfo>
              <StepDescription>
                {stepDescription}
              </StepDescription>
            </StepInfo>
          )}
          
          <ComplexityInfo>
            <ComplexityItem>
              <ComplexityLabel>Time Complexity (Best):</ComplexityLabel>
              <ComplexityValue>{algorithmInfo.timeComplexityBest}</ComplexityValue>
            </ComplexityItem>
            <ComplexityItem>
              <ComplexityLabel>Time Complexity (Average):</ComplexityLabel>
              <ComplexityValue>{algorithmInfo.timeComplexityAverage}</ComplexityValue>
            </ComplexityItem>
            <ComplexityItem>
              <ComplexityLabel>Time Complexity (Worst):</ComplexityLabel>
              <ComplexityValue>{algorithmInfo.timeComplexityWorst}</ComplexityValue>
            </ComplexityItem>
            <ComplexityItem>
              <ComplexityLabel>Space Complexity:</ComplexityLabel>
              <ComplexityValue>{algorithmInfo.spaceComplexity}</ComplexityValue>
            </ComplexityItem>
            <ComplexityItem>
              <ComplexityLabel>Stability:</ComplexityLabel>
              <ComplexityValue>{algorithmInfo.stability}</ComplexityValue>
            </ComplexityItem>
          </ComplexityInfo>
        </VisualizationContainer>
        
        <CodeContainer>
          <h2>Implementation</h2>
          
          <TabContainer>
            {algorithmInfo.implementations.map(impl => (
              <Tab 
                key={impl.language}
                active={selectedLanguage === impl.language}
                onClick={() => setSelectedLanguage(impl.language)}
              >
                {impl.language.charAt(0).toUpperCase() + impl.language.slice(1)}
              </Tab>
            ))}
          </TabContainer>
          
          {algorithmInfo.implementations.map(impl => (
            impl.language === selectedLanguage && (
              <CodeBlock key={impl.language}>
                <CodeTitle>{impl.title}</CodeTitle>
                <CodeContent>
                  <SyntaxHighlighter language={impl.language} style={vs2015} showLineNumbers>
                    {impl.code}
                  </SyntaxHighlighter>
                </CodeContent>
              </CodeBlock>
            )
          ))}
        </CodeContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default SortingPageTemplate; 