import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiRefreshCw, FiSkipForward, FiSkipBack, FiClock, FiCode } from 'react-icons/fi';
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
  gap: 0.75rem;
  flex: 1;
  min-width: 180px;
`;

const SpeedLabel = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.gray700};
  white-space: nowrap;
`;

const SpeedSlider = styled.input`
  flex: 1;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  height: 4px;
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

// ─── Progress Bar ────────────────────────────────────────────────────────────
const ProgressWrapper = styled.div`
  margin: 0.5rem 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const ProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.gray600 || theme.colors.textLight};
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ pct: number }>`
  height: 100%;
  width: ${({ pct }) => pct}%;
  background: linear-gradient(to right, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary || theme.colors.primary});
  border-radius: 999px;
  transition: width 0.2s ease;
`;

// ─── Pseudocode Panel ────────────────────────────────────────────────────────
const glowLine = keyframes`
  0%   { box-shadow: 0 0 0px #f59e0b00; }
  50%  { box-shadow: 0 0 8px #f59e0b80; }
  100% { box-shadow: 0 0 4px #f59e0b40; }
`;

const PseudocodePanel = styled.div`
  background: #1e1e1e;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.82rem;
`;

const PseudoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #2d2d2d;
  color: #aaa;
  padding: 0.5rem 0.75rem;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PseudoLine = styled.div<{ active: boolean; indent?: number }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.3rem 0.75rem 0.3rem ${({ indent }) => `${0.75 + (indent || 0) * 1.2}rem`};
  background: ${({ active }) => active ? 'rgba(245, 158, 11, 0.18)' : 'transparent'};
  border-left: 3px solid ${({ active }) => active ? '#f59e0b' : 'transparent'};
  color: ${({ active }) => active ? '#fde68a' : '#9ca3af'};
  transition: all 0.15s ease;
  animation: ${({ active }) => active ? glowLine : 'none'} 1s ease-in-out infinite;
  white-space: pre;
`;

const LineNum = styled.span`
  color: #4b5563;
  min-width: 1.5rem;
  text-align: right;
  user-select: none;
  font-size: 0.75rem;
  padding-top: 0.05rem;
`;

const LineText = styled.span<{ active: boolean }>`
  color: ${({ active }) => active ? '#fde68a' : '#d1d5db'};
  font-size: 0.82rem;
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
  /** Optional pseudocode for live line-highlight panel */
  pseudocode?: { text: string; indent?: number }[];
}

export interface AnimationStep {
  type: 'compare' | 'swap' | 'sorted' | 'set';
  indices: number[];
  description: string;
  /** 0-based index of the pseudocode line to highlight (from algorithmInfo.pseudocode) */
  pseudocodeLine?: number;
  /** For 'set' steps: map of index → new value */
  newValues?: number[];
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
  const [visualArray, setVisualArray] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [speed, setSpeed] = useState<number>(500);
  const [arraySize, setArraySize] = useState<number>(10);
  const [stepDescription, setStepDescription] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const [initialArray, setInitialArray] = useState<number[]>([]);

  // Enhanced animation state management with race condition prevention
  const animationRef = useRef<number | null>(null);
  const sortTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAnimatingRef = useRef<boolean>(false);
  const currentStepRef = useRef<number>(0);
  
  // Sync refs with state to prevent race conditions
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);
  
  useEffect(() => {
    isAnimatingRef.current = isSorting && !isPaused;
  }, [isSorting, isPaused]);
  
  // Enhanced cleanup effect
  useEffect(() => {
    return () => {
      if (sortTimeoutRef.current) {
        clearTimeout(sortTimeoutRef.current);
        sortTimeoutRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      isAnimatingRef.current = false;
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
    if (sortTimeoutRef.current) { clearTimeout(sortTimeoutRef.current); sortTimeoutRef.current = null; }
    if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null; }
    isAnimatingRef.current = false;
    currentStepRef.current = 0;
    setArray(newArray);
    setInitialArray([...newArray]);
    setVisualArray([...newArray]);
    setActiveIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setIsSorting(false);
    setIsPaused(false);
    setCurrentStep(0);
    setStepDescription('');
    setHighlightedLine(null);
    const steps = generateSteps([...newArray]);
    setAnimationSteps(steps);
  };

  // Enhanced start sorting with race condition prevention
  const startSorting = () => {
    // Clear any existing timers first
    if (sortTimeoutRef.current) {
      clearTimeout(sortTimeoutRef.current);
      sortTimeoutRef.current = null;
    }
    
    if (isPaused) {
      setIsPaused(false);
      scheduleNextStep();
      return;
    }
    
    if (currentStep >= animationSteps.length) {
      resetArrayState([...array]);
      return;
    }
    
    setIsSorting(true);
    setIsPaused(false);
    isAnimatingRef.current = true;
    
    scheduleNextStep();
  };
  
  // Centralized animation scheduling with safety checks
  const scheduleNextStep = useCallback(() => {
    if (!isAnimatingRef.current || currentStepRef.current >= animationSteps.length) {
      setIsSorting(false);
      isAnimatingRef.current = false;
      return;
    }
    
    // Execute current step
    const step = animationSteps[currentStepRef.current];
    if (step) {
      executeAnimationStep(step);
    }
    
    // Schedule next step
    const nextStep = currentStepRef.current + 1;
    if (nextStep < animationSteps.length && isAnimatingRef.current) {
      sortTimeoutRef.current = setTimeout(() => {
        if (isAnimatingRef.current) { // Double-check still animating
          setCurrentStep(nextStep);
          currentStepRef.current = nextStep;
          scheduleNextStep();
        }
      }, speed);
    } else {
      setIsSorting(false);
      isAnimatingRef.current = false;
    }
  }, [animationSteps, speed]);
  
  const executeAnimationStep = (step: AnimationStep) => {
    setStepDescription(step.description);
    if (step.pseudocodeLine !== undefined) setHighlightedLine(step.pseudocodeLine);

    if (step.type === 'compare') {
      setComparingIndices(step.indices);
      setActiveIndices([]);
    } else if (step.type === 'swap') {
      setActiveIndices(step.indices);
      setComparingIndices([]);
      if (step.indices.length === 2) {
        setVisualArray(prev => {
          const next = [...prev];
          [next[step.indices[0]], next[step.indices[1]]] = [next[step.indices[1]], next[step.indices[0]]];
          return next;
        });
        setArray(prev => {
          const next = [...prev];
          [next[step.indices[0]], next[step.indices[1]]] = [next[step.indices[1]], next[step.indices[0]]];
          return next;
        });
      }
    } else if (step.type === 'set' && step.newValues) {
      setVisualArray(prev => {
        const next = [...prev];
        step.indices.forEach((idx, i) => { next[idx] = step.newValues![i]; });
        return next;
      });
      setArray(prev => {
        const next = [...prev];
        step.indices.forEach((idx, i) => { next[idx] = step.newValues![i]; });
        return next;
      });
      setActiveIndices(step.indices);
      setComparingIndices([]);
    } else if (step.type === 'sorted') {
      setActiveIndices([]);
      setComparingIndices([]);
      setSortedIndices(prev => [...prev, ...step.indices]);
    }
  };

  const pauseAnimation = () => {
    setIsPaused(true);
    isAnimatingRef.current = false;
    if (sortTimeoutRef.current) { clearTimeout(sortTimeoutRef.current); sortTimeoutRef.current = null; }
  };

  const resetAnimation = () => {
    isAnimatingRef.current = false;
    if (sortTimeoutRef.current) { clearTimeout(sortTimeoutRef.current); sortTimeoutRef.current = null; }
    resetArrayState([...initialArray]);
  };

  // Safe step forward
  const stepForward = () => {
    if (currentStep < animationSteps.length) {
      // Clear any running animation
      if (sortTimeoutRef.current) {
        clearTimeout(sortTimeoutRef.current);
        sortTimeoutRef.current = null;
      }
      
      const step = animationSteps[currentStep];
      if (step) {
        executeAnimationStep(step);
        setCurrentStep(currentStep + 1);
        currentStepRef.current = currentStep + 1;
      }
    }
  };
  
  const stepBackward = () => {
    if (currentStep > 0) {
      // Clear any running animation
      if (sortTimeoutRef.current) {
        clearTimeout(sortTimeoutRef.current);
        sortTimeoutRef.current = null;
      }
      isAnimatingRef.current = false;
      
      // Reset to initial state
      setActiveIndices([]);
      setComparingIndices([]);
      setSortedIndices([]);
      
      const newStep = currentStep - 1;
      
      // Replay all steps up to the new step
      const tempArray = [...array];
      const newSortedIndices: number[] = [];
      
      // Reset array to initial state
      const initialArray = [...animationSteps[0] ? 
        (generateSteps(tempArray).length > 0 ? tempArray : array) : array];
      
      // Apply all steps up to newStep
      for (let i = 0; i < newStep; i++) {
        const step = animationSteps[i];
        if (!step) continue;
        
        if (step.type === 'swap' && step.indices.length === 2) {
          const [j, k] = step.indices;
          [initialArray[j], initialArray[k]] = [initialArray[k], initialArray[j]];
        } else if (step.type === 'sorted') {
          newSortedIndices.push(...step.indices);
        }
      }
      
      setArray(initialArray);
      setSortedIndices(newSortedIndices);
      setCurrentStep(newStep);
      currentStepRef.current = newStep;
      
      // Set the visual state for the current step
      if (newStep > 0 && animationSteps[newStep - 1]) {
        const currentAnimation = animationSteps[newStep - 1];
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
        setStepDescription('Ready to start');
        setActiveIndices([]);
        setComparingIndices([]);
      }
    }
  };
  
  // Initialize random array on mount
  useEffect(() => {
    generateRandomArray();
  }, []);

  // Keyboard shortcuts: Space=play/pause, →=step fwd, ←=step back, R=reset
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.code === 'Space')   { e.preventDefault(); isSorting && !isPaused ? pauseAnimation() : startSorting(); }
      if (e.code === 'ArrowRight') { e.preventDefault(); stepForward(); }
      if (e.code === 'ArrowLeft')  { e.preventDefault(); stepBackward(); }
      if (e.code === 'KeyR')       { resetAnimation(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSorting, isPaused, currentStep, animationSteps]);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              <ControlButton onClick={startSorting} active={true}>
                <FiPlay size={16} />
                {isPaused ? 'Resume' : 'Start Sorting'}
              </ControlButton>
            ) : (
              <ControlButton onClick={pauseAnimation}>
                <FiPause size={16} />
                Pause
              </ControlButton>
            )}

            <ControlButton onClick={resetAnimation} disabled={(!isSorting && !isPaused) && currentStep === 0}>
              <FiRefreshCw size={16} />
              Reset
            </ControlButton>

            <ControlButton onClick={stepBackward} disabled={currentStep <= 0 || (isSorting && !isPaused)}>
              <FiSkipBack size={16} />
              Step Back
            </ControlButton>

            <ControlButton onClick={stepForward} disabled={currentStep >= animationSteps.length || (isSorting && !isPaused)}>
              <FiSkipForward size={16} />
              Step Forward
            </ControlButton>

            <SpeedControl>
              <FiClock size={14} />
              <SpeedLabel>{Math.round(speed / 10) * 10}ms</SpeedLabel>
              <SpeedSlider
                type="range"
                min={50}
                max={2000}
                step={50}
                value={speed}
                onChange={handleSpeedChange}
              />
            </SpeedControl>
          </ControlsContainer>

          {/* Step progress bar */}
          {animationSteps.length > 0 && (
            <ProgressWrapper>
              <ProgressMeta>
                <span>Step {currentStep} / {animationSteps.length}</span>
                <span>{Math.round((currentStep / animationSteps.length) * 100)}%</span>
              </ProgressMeta>
              <ProgressTrack>
                <ProgressFill pct={animationSteps.length > 0 ? (currentStep / animationSteps.length) * 100 : 0} />
              </ProgressTrack>
            </ProgressWrapper>
          )}

          <BarContainer>
            {visualArray.map((value, index) => (
              <Bar
                key={index}
                height={value}
                isActive={activeIndices.includes(index)}
                isComparing={comparingIndices.includes(index)}
                isSorted={sortedIndices.includes(index)}
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                transition={{ duration: 0.25 }}
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
          <h2 style={{ marginBottom: '1rem' }}>Implementation</h2>

          {/* Pseudocode with live line highlighting */}
          {algorithmInfo.pseudocode && algorithmInfo.pseudocode.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                marginBottom: '0.5rem', fontSize: '0.85rem',
                fontWeight: 600, color: 'inherit', opacity: 0.7 
              }}>
                <FiCode size={14} /> PSEUDOCODE
                {highlightedLine !== null && (
                  <span style={{ marginLeft: 'auto', color: '#f59e0b', fontSize: '0.75rem' }}>
                    ● Line {highlightedLine + 1} executing
                  </span>
                )}
              </div>
              <PseudocodePanel>
                <PseudoHeader><FiCode size={12} /> Pseudocode — live execution</PseudoHeader>
                {algorithmInfo.pseudocode.map((line, i) => (
                  <PseudoLine key={i} active={highlightedLine === i} indent={line.indent || 0}>
                    <LineNum>{i + 1}</LineNum>
                    <LineText active={highlightedLine === i}>{line.text}</LineText>
                  </PseudoLine>
                ))}
              </PseudocodePanel>
            </div>
          )}

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

          {algorithmInfo.implementations.map(impl =>
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
          )}
        </CodeContainer>

      </ContentContainer>
    </PageContainer>
  );
};

export default SortingPageTemplate; 