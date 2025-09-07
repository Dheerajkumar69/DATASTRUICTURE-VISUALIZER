import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiMinus, FiSearch, FiRefreshCw, FiPlay, FiPause, 
  FiSkipForward, FiSkipBack, FiEye, FiBook, FiZap, FiTarget,
  FiTrendingUp, FiLayers, FiRotateCw, FiShuffle, FiFilter
} from 'react-icons/fi';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Advanced animations
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0,-30px,0); }
  70% { transform: translate3d(0,-15px,0); }
  90% { transform: translate3d(0,-4px,0); }
`;

const rotate3D = keyframes`
  0% { transform: perspective(400px) rotateY(0deg); }
  100% { transform: perspective(400px) rotateY(360deg); }
`;

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

const PageHeader = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  border-radius: 20px;
  color: ${({ theme }) => theme.colors.card};
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageDescription = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const VisualizationSection = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TutorialPanel = styled(motion.div)`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border-left: 4px solid #667eea;
`;

const ControlsPanel = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
`;

const AdvancedControls = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
  
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
          color: ${({ theme }) => theme.colors.card};
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }
        `;
      case 'secondary':
        return `
          background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondaryLight} 0%, ${({ theme }) => theme.colors.secondary} 100%);
          color: ${({ theme }) => theme.colors.card};
          box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(79, 172, 254, 0.6);
          }
        `;
      case 'success':
        return `
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: ${({ theme }) => theme.colors.card};
          box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(17, 153, 142, 0.6);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%);
          color: ${({ theme }) => theme.colors.card};
          box-shadow: 0 4px 15px rgba(255, 95, 109, 0.4);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 95, 109, 0.6);
          }
        `;
      default:
        return `
          background: ${({ theme }) => theme.colors.gray100};
          color: ${({ theme }) => theme.colors.text};
          border: 2px solid ${({ theme }) => theme.colors.gray200};
          
          &:hover {
            background: ${({ theme }) => theme.colors.gray200};
            transform: translateY(-1px);
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ArrayContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryLight} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  border-radius: 16px;
  min-height: 200px;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.25),
      transparent
    );
    animation: ${shimmer} 2s infinite;
  }
`;

const ArrayElement = styled(motion.div)<{ 
  isHighlighted?: boolean; 
  isComparing?: boolean;
  isTarget?: boolean;
  value: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 16px;
  font-weight: bold;
  font-size: 1.2rem;
  position: relative;
  cursor: pointer;
  
  background: ${({ isHighlighted, isComparing, isTarget }) => {
    if (isHighlighted) return 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
    if (isComparing) return 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
    if (isTarget) return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)';
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }};
  
  color: ${({ isHighlighted, isComparing, isTarget }) => 
    (isHighlighted || isComparing || isTarget) ? '#333' : 'white'
  };
  
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  transform-style: preserve-3d;
  
  &:hover {
    animation: ${bounce} 0.6s;
    z-index: 10;
  }
  
  &::after {
    content: '${({ value }) => value}';
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ArrayIndex = styled.div`
  position: absolute;
  bottom: -25px;
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
  background: white;
  padding: 2px 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const TutorialStep = styled(motion.div)`
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.card};
  margin-bottom: 1rem;
`;

const StepTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepDescription = styled.p`
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const CodeVisualization = styled.div`
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1rem;
`;

const CodeHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  color: ${({ theme }) => theme.colors.card};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PerformanceMetrics = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 2px solid #e9ecef;
`;

const MetricItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
  
  &:last-child {
    border-bottom: none;
  }
`;

const MetricLabel = styled.span`
  color: #6c757d;
  font-weight: 500;
`;

const MetricValue = styled.span<{ type?: 'time' | 'space' | 'operations' }>`
  font-weight: 700;
  color: ${({ type }) => {
    switch (type) {
      case 'time': return '#ff6b6b';
      case 'space': return '#4ecdc4';
      case 'operations': return '#45b7d1';
      default: return '#333';
    }
  }};
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

// Component interfaces
interface ArrayOperation {
  type: 'insert' | 'delete' | 'search' | 'access' | 'sort' | 'reverse';
  index?: number;
  value?: number;
  description: string;
}

interface TutorialStep {
  title: string;
  description: string;
  operation?: ArrayOperation;
  code?: string;
}

interface EnhancedArrayPageTemplateProps {
  title?: string;
  description?: string;
  initialArray?: number[];
  tutorialSteps?: TutorialStep[];
  showAdvancedFeatures?: boolean;
}

const EnhancedArrayPageTemplate: React.FC<EnhancedArrayPageTemplateProps> = ({
  title = "Enhanced Array Visualization",
  description = "Experience arrays like never before with 3D visualizations, interactive tutorials, and real-time performance analytics.",
  initialArray = [42, 17, 89, 3, 56, 21, 94, 38],
  tutorialSteps = [
    {
      title: "Welcome to Arrays",
      description: "Arrays are fundamental data structures that store elements in contiguous memory locations. Let's explore their operations!",
      code: `// Array Declaration
int[] arr = new int[8];
// O(1) space complexity`
    },
    {
      title: "Array Access",
      description: "Arrays provide O(1) random access to elements using indices. Click any element to see this in action!",
      operation: { type: 'access', index: 0, description: "Accessing element at index 0" },
      code: `// Array Access
int element = arr[index];
// Time: O(1), Space: O(1)`
    },
    {
      title: "Array Insertion",
      description: "Inserting elements requires shifting existing elements, making it O(n) in the worst case.",
      operation: { type: 'insert', index: 2, value: 99, description: "Inserting 99 at index 2" },
      code: `// Array Insertion
for(int i = size; i > index; i--) {
    arr[i] = arr[i-1];
}
arr[index] = newValue;
// Time: O(n), Space: O(1)`
    },
    {
      title: "Array Deletion",
      description: "Deleting elements requires shifting remaining elements to fill the gap.",
      operation: { type: 'delete', index: 1, description: "Deleting element at index 1" },
      code: `// Array Deletion
for(int i = index; i < size-1; i++) {
    arr[i] = arr[i+1];
}
size--;
// Time: O(n), Space: O(1)`
    }
  ],
  showAdvancedFeatures = true
}) => {
  const [array, setArray] = useState<number[]>(initialArray);
  const [originalArray, setOriginalArray] = useState<number[]>(initialArray);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [message, setMessage] = useState('');
  const [operations, setOperations] = useState(0);
  const [timeComplexity, setTimeComplexity] = useState('O(1)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(1)');
  const [is3DMode, setIs3DMode] = useState(false);
  
  const animationTimeoutRef = useRef<NodeJS.Timeout>();

  // Tutorial management
  const startTutorial = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentStep, tutorialSteps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Array operations
  const insertElement = useCallback((index: number, value: number) => {
    setTimeComplexity('O(n)');
    setSpaceComplexity('O(1)');
    setOperations(prev => prev + 1);
    
    const newArray = [...array];
    newArray.splice(index, 0, value);
    setArray(newArray);
    
    // Highlight animation
    setHighlightedIndices([index]);
    setMessage(`Inserted ${value} at index ${index}. Elements shifted right.`);
    
    setTimeout(() => setHighlightedIndices([]), 2000);
  }, [array]);

  const deleteElement = useCallback((index: number) => {
    if (index < 0 || index >= array.length) return;
    
    setTimeComplexity('O(n)');
    setSpaceComplexity('O(1)');
    setOperations(prev => prev + 1);
    
    const deletedValue = array[index];
    const newArray = [...array];
    newArray.splice(index, 1);
    setArray(newArray);
    
    setMessage(`Deleted ${deletedValue} from index ${index}. Elements shifted left.`);
  }, [array]);

  const searchElement = useCallback((value: number) => {
    setTimeComplexity('O(n)');
    setSpaceComplexity('O(1)');
    setOperations(prev => prev + 1);
    
    let foundIndex = -1;
    
    // Animate search
    const searchAnimation = (index: number) => {
      if (index >= array.length) {
        setComparingIndices([]);
        if (foundIndex === -1) {
          setMessage(`${value} not found in the array`);
        }
        return;
      }
      
      setComparingIndices([index]);
      
      if (array[index] === value) {
        foundIndex = index;
        setHighlightedIndices([index]);
        setMessage(`Found ${value} at index ${index}`);
        setTimeout(() => setHighlightedIndices([]), 2000);
        return;
      }
      
      setTimeout(() => searchAnimation(index + 1), 300);
    };
    
    searchAnimation(0);
  }, [array]);

  const sortArray = useCallback(() => {
    setTimeComplexity('O(n²)');
    setSpaceComplexity('O(1)');
    setOperations(prev => prev + array.length);
    
    const newArray = [...array];
    const steps: { arr: number[], comparing: number[], highlighting: number[] }[] = [];
    
    // Bubble sort with animation steps
    for (let i = 0; i < newArray.length - 1; i++) {
      for (let j = 0; j < newArray.length - i - 1; j++) {
        steps.push({
          arr: [...newArray],
          comparing: [j, j + 1],
          highlighting: []
        });
        
        if (newArray[j] > newArray[j + 1]) {
          [newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]];
          steps.push({
            arr: [...newArray],
            comparing: [],
            highlighting: [j, j + 1]
          });
        }
      }
    }
    
    // Animate steps
    let stepIndex = 0;
    const animateSort = () => {
      if (stepIndex >= steps.length) {
        setComparingIndices([]);
        setHighlightedIndices([]);
        setMessage('Array sorted using Bubble Sort!');
        return;
      }
      
      const step = steps[stepIndex];
      setArray(step.arr);
      setComparingIndices(step.comparing);
      setHighlightedIndices(step.highlighting);
      
      stepIndex++;
      setTimeout(animateSort, 500);
    };
    
    animateSort();
  }, [array]);

  const reverseArray = useCallback(() => {
    setTimeComplexity('O(n)');
    setSpaceComplexity('O(1)');
    setOperations(prev => prev + Math.floor(array.length / 2));
    
    const newArray = [...array];
    let left = 0;
    let right = newArray.length - 1;
    
    const animateReverse = () => {
      if (left >= right) {
        setHighlightedIndices([]);
        setMessage('Array reversed!');
        return;
      }
      
      setHighlightedIndices([left, right]);
      
      setTimeout(() => {
        [newArray[left], newArray[right]] = [newArray[right], newArray[left]];
        setArray([...newArray]);
        left++;
        right--;
        animateReverse();
      }, 600);
    };
    
    animateReverse();
  }, [array]);

  const shuffleArray = useCallback(() => {
    setTimeComplexity('O(n)');
    setSpaceComplexity('O(1)');
    setOperations(prev => prev + array.length);
    
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    
    setArray(newArray);
    setMessage('Array shuffled randomly!');
  }, [array]);

  const resetArray = useCallback(() => {
    setArray([...originalArray]);
    setHighlightedIndices([]);
    setComparingIndices([]);
    setTargetIndex(null);
    setOperations(0);
    setMessage('Array reset to original state');
    setTimeComplexity('O(1)');
    setSpaceComplexity('O(1)');
  }, [originalArray]);

  return (
    <PageContainer>
      <PageHeader
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <PageTitle>{title}</PageTitle>
        <PageDescription>{description}</PageDescription>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <Button variant="primary" onClick={startTutorial}>
            <FiBook /> Interactive Tutorial
          </Button>
          <Button variant="secondary" onClick={() => setIs3DMode(!is3DMode)}>
            <FiLayers /> {is3DMode ? '2D Mode' : '3D Mode'}
          </Button>
        </div>
      </PageHeader>

      <MainContent>
        <VisualizationSection>
          <AdvancedControls>
            <InputGroup>
              <Input
                type="number"
                placeholder="Value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Index"
                value={inputIndex}
                onChange={(e) => setInputIndex(e.target.value)}
              />
            </InputGroup>
          </AdvancedControls>

          <AdvancedControls>
            <Button 
              variant="primary" 
              onClick={() => {
                const val = parseInt(inputValue);
                const idx = parseInt(inputIndex);
                if (!isNaN(val) && !isNaN(idx)) {
                  insertElement(idx, val);
                  setInputValue('');
                  setInputIndex('');
                }
              }}
            >
              <FiPlus /> Insert
            </Button>
            
            <Button 
              variant="danger" 
              onClick={() => {
                const idx = parseInt(inputIndex);
                if (!isNaN(idx)) {
                  deleteElement(idx);
                  setInputIndex('');
                }
              }}
            >
              <FiMinus /> Delete
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={() => {
                const val = parseInt(inputValue);
                if (!isNaN(val)) {
                  searchElement(val);
                  setInputValue('');
                }
              }}
            >
              <FiSearch /> Search
            </Button>
            
            <Button onClick={sortArray}>
              <FiTrendingUp /> Sort
            </Button>
            
            <Button onClick={reverseArray}>
              <FiRotateCw /> Reverse
            </Button>
            
            <Button onClick={shuffleArray}>
              <FiShuffle /> Shuffle
            </Button>
            
            <Button onClick={resetArray}>
              <FiRefreshCw /> Reset
            </Button>
          </AdvancedControls>

          <ArrayContainer style={{ 
            transform: is3DMode ? 'perspective(1000px) rotateX(15deg)' : 'none',
            transformStyle: 'preserve-3d' 
          }}>
            <AnimatePresence>
              {array.map((value, index) => (
                <ArrayElement
                  key={`${value}-${index}`}
                  value={value}
                  isHighlighted={highlightedIndices.includes(index)}
                  isComparing={comparingIndices.includes(index)}
                  isTarget={targetIndex === index}
                  initial={{ opacity: 0, scale: 0, rotateY: -180 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotateY: 0,
                    rotateX: is3DMode ? 15 : 0,
                    z: is3DMode ? Math.random() * 50 : 0
                  }}
                  exit={{ opacity: 0, scale: 0, rotateY: 180 }}
                  transition={{ 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 120
                  }}
                  onClick={() => setTargetIndex(index)}
                  whileHover={{ 
                    scale: 1.1,
                    rotateY: is3DMode ? 180 : 0,
                    transition: { duration: 0.3 }
                  }}
                >
                  <ArrayIndex>{index}</ArrayIndex>
                </ArrayElement>
              ))}
            </AnimatePresence>
          </ArrayContainer>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '12px',
                marginTop: '1rem',
                textAlign: 'center',
                fontWeight: '600'
              }}
            >
              {message}
            </motion.div>
          )}
        </VisualizationSection>

        <SidePanel>
          {isPlaying && tutorialSteps[currentStep] && (
            <TutorialPanel
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Step {currentStep + 1} of {tutorialSteps.length}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button onClick={prevStep} disabled={currentStep === 0}>
                    <FiSkipBack />
                  </Button>
                  <Button onClick={nextStep}>
                    <FiSkipForward />
                  </Button>
                </div>
              </div>
              
              <TutorialStep>
                <StepTitle>
                  <FiTarget />
                  {tutorialSteps[currentStep].title}
                </StepTitle>
                <StepDescription>
                  {tutorialSteps[currentStep].description}
                </StepDescription>
              </TutorialStep>

              {tutorialSteps[currentStep].code && (
                <CodeVisualization>
                  <CodeHeader>
                    <FiZap />
                    Code Implementation
                  </CodeHeader>
                  <SyntaxHighlighter
                    language="javascript"
                    style={vs2015}
                    customStyle={{ margin: 0, padding: '1rem' }}
                  >
                    {tutorialSteps[currentStep].code}
                  </SyntaxHighlighter>
                </CodeVisualization>
              )}
            </TutorialPanel>
          )}

          <PerformanceMetrics>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiTrendingUp />
              Performance Analytics
            </h3>
            
            <MetricItem>
              <MetricLabel>Time Complexity:</MetricLabel>
              <MetricValue type="time">{timeComplexity}</MetricValue>
            </MetricItem>
            
            <MetricItem>
              <MetricLabel>Space Complexity:</MetricLabel>
              <MetricValue type="space">{spaceComplexity}</MetricValue>
            </MetricItem>
            
            <MetricItem>
              <MetricLabel>Operations Performed:</MetricLabel>
              <MetricValue type="operations">{operations}</MetricValue>
            </MetricItem>
            
            <MetricItem>
              <MetricLabel>Array Size:</MetricLabel>
              <MetricValue>{array.length}</MetricValue>
            </MetricItem>
            
            <MetricItem>
              <MetricLabel>Memory Usage:</MetricLabel>
              <MetricValue>{array.length * 4} bytes</MetricValue>
            </MetricItem>
          </PerformanceMetrics>
        </SidePanel>
      </MainContent>
    </PageContainer>
  );
};

export default EnhancedArrayPageTemplate;
