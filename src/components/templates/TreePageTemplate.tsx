import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaStepForward, FaUndo } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlgorithmInfo } from '../../types/algorithm';

// Types
export interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  highlight?: boolean;
  visited?: boolean;
}

export interface TreeVisualizationStep {
  tree: TreeNode;
  currentNode: number | null;
  visitedNodes: number[];
  description: string;
}

// Styled Components
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

const TreeVisualizationArea = styled.div`
  height: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StepDescription = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #e9ecef;
  border-radius: 4px;
  font-size: 0.9rem;
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
  line-height: 1.6;
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

interface TreePageTemplateProps {
  algorithmInfo: AlgorithmInfo;
  initialTree: TreeNode;
  generateSteps: (tree: TreeNode) => TreeVisualizationStep[];
}

const TreePageTemplate: React.FC<TreePageTemplateProps> = ({
  algorithmInfo,
  initialTree,
  generateSteps
}) => {
  const [tree, setTree] = useState<TreeNode>(initialTree);
  const [steps, setSteps] = useState<TreeVisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [stepDescription, setStepDescription] = useState('Click Start to begin visualization');
  const [currentTab, setCurrentTab] = useState<string>('javascript');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    // Initialize the steps
    const initialSteps = generateSteps(initialTree);
    setSteps(initialSteps);
    
    // Draw the initial tree
    const canvas = canvasRef.current;
    if (canvas) {
      drawTree(initialTree, canvas);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [initialTree, generateSteps]);
  
  useEffect(() => {
    if (isAnimating && !isPaused && currentStep < steps.length) {
      const step = steps[currentStep];
      setStepDescription(step.description);
      
      // Update canvas
      const canvas = canvasRef.current;
      if (canvas) {
        drawTree(step.tree, canvas, step.currentNode, step.visitedNodes);
      }
      
      timerRef.current = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsAnimating(false);
        }
      }, speed);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isAnimating, isPaused, currentStep, steps, speed]);
  
  const startTraversal = () => {
    if (isPaused) {
      setIsPaused(false);
      return;
    }
    
    setCurrentStep(0);
    setIsAnimating(true);
    setIsPaused(false);
  };
  
  const pauseTraversal = () => {
    setIsPaused(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  
  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = steps[currentStep + 1];
      setCurrentStep(prev => prev + 1);
      setStepDescription(nextStep.description);
      
      const canvas = canvasRef.current;
      if (canvas) {
        drawTree(nextStep.tree, canvas, nextStep.currentNode, nextStep.visitedNodes);
      }
    }
  };
  
  const reset = () => {
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    setStepDescription('Click Start to begin visualization');
    
    const canvas = canvasRef.current;
    if (canvas) {
      drawTree(initialTree, canvas);
    }
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  
  // Function to draw a binary tree on canvas
  const drawTree = (
    rootNode: TreeNode, 
    canvas: HTMLCanvasElement, 
    currentNodeValue: number | null = null, 
    visitedNodes: number[] = []
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Calculate the total height of the tree
    const getTreeHeight = (node: TreeNode | undefined): number => {
      if (!node) return 0;
      return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
    };
    
    const treeHeight = getTreeHeight(rootNode);
    const nodeRadius = 20;
    const levelHeight = canvas.height / (treeHeight + 1);
    const startX = canvas.width / 2;
    const startY = nodeRadius + 10;
    
    // Function to draw a node
    const drawNode = (
      node: TreeNode | undefined, 
      x: number, 
      y: number, 
      level: number, 
      maxWidth: number
    ) => {
      if (!node) return;
      
      // Draw the node circle
      ctx.beginPath();
      
      // Set node style based on its state
      if (node.value === currentNodeValue) {
        ctx.fillStyle = '#ff9800'; // Highlight current node
      } else if (visitedNodes.includes(node.value)) {
        ctx.fillStyle = '#4caf50'; // Visited node
      } else {
        ctx.fillStyle = '#2196f3'; // Normal node
      }
      
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw node value
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.value.toString(), x, y);
      
      // Calculate spacing for the next level
      const nextLevelWidth = maxWidth / 2;
      
      // Draw left child and edge if exists
      if (node.left) {
        const leftX = x - nextLevelWidth;
        const leftY = y + levelHeight;
        
        // Draw edge to left child
        ctx.beginPath();
        ctx.strokeStyle = visitedNodes.includes(node.value) && visitedNodes.includes(node.left.value) 
          ? '#4caf50' 
          : '#aaaaaa';
        ctx.lineWidth = 2;
        ctx.moveTo(x - nodeRadius * Math.cos(Math.PI / 4), y + nodeRadius * Math.sin(Math.PI / 4));
        ctx.lineTo(leftX + nodeRadius * Math.cos(Math.PI / 4), leftY - nodeRadius * Math.sin(Math.PI / 4));
        ctx.stroke();
        
        // Draw left child
        drawNode(node.left, leftX, leftY, level + 1, nextLevelWidth);
      }
      
      // Draw right child and edge if exists
      if (node.right) {
        const rightX = x + nextLevelWidth;
        const rightY = y + levelHeight;
        
        // Draw edge to right child
        ctx.beginPath();
        ctx.strokeStyle = visitedNodes.includes(node.value) && visitedNodes.includes(node.right.value) 
          ? '#4caf50' 
          : '#aaaaaa';
        ctx.lineWidth = 2;
        ctx.moveTo(x + nodeRadius * Math.cos(Math.PI / 4), y + nodeRadius * Math.sin(Math.PI / 4));
        ctx.lineTo(rightX - nodeRadius * Math.cos(Math.PI / 4), rightY - nodeRadius * Math.sin(Math.PI / 4));
        ctx.stroke();
        
        // Draw right child
        drawNode(node.right, rightX, rightY, level + 1, nextLevelWidth);
      }
    };
    
    // Start drawing from the root
    drawNode(rootNode, startX, startY, 0, canvas.width / 2);
  };
  
  return (
    <PageContainer>
      <StickyHeader>
        <NavigationRow>
          <BackButton to="/data-structures/tree">
            ← Back to Trees
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
          <TreeVisualizationArea>
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              style={{ width: '100%', height: '100%' }}
            />
          </TreeVisualizationArea>

          <ControlsContainer>
            <Button
              onClick={isAnimating ? pauseTraversal : startTraversal}
              disabled={isAnimating && !isPaused}
            >
              {isAnimating && !isPaused ? <FaPause /> : <FaPlay />}
              {isAnimating && !isPaused ? 'Pause' : 'Start'}
            </Button>
            <Button
              onClick={stepForward}
              disabled={!isAnimating || isPaused || currentStep >= steps.length - 1}
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
          <div>
            <ControlsContainer>
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
            </ControlsContainer>
            <SyntaxHighlighter language={currentTab} style={tomorrow}>
              {algorithmInfo.implementations[currentTab]}
            </SyntaxHighlighter>
          </div>
        </CodeContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default TreePageTemplate; 