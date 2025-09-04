import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaRedo, FaStepForward, FaStepBackward, FaRandom } from 'react-icons/fa';
import GraphVisualizer, { Vertex, Edge, GraphData } from './GraphVisualizer';
import * as GraphUtils from './GraphUtils';

// Types
export interface VisualizationStep {
  vertices: Vertex[];
  edges: Edge[];
  description: string;
  currentVertex?: number | null;
  cyclePath?: number[] | null;
  path?: number[] | null;
}

interface EnhancedGraphProblemVisualizerProps {
  problemType: 'directed-cycle' | 'undirected-cycle' | 'eulerian-path' | 'minimum-spanning-tree' | 'shortest-path' | 'custom' | string;
  customSteps?: VisualizationStep[];
  width?: string | number;
  height?: string | number;
  onStepChange?: (step: number, totalSteps: number) => void;
  showControls?: boolean;
  autoStart?: boolean;
  animationSpeed?: number;
  nodeRadius?: number;
  showNodeValues?: boolean;
  showEdgeWeights?: boolean;
  autoFit?: boolean;
  allowZoomPan?: boolean;
  generateNewGraph?: () => { vertices: Vertex[], edges: Edge[], adjacencyList: number[][] };
  runAlgorithm?: (graph: { vertices: Vertex[], edges: Edge[], adjacencyList: number[][] }) => VisualizationStep[];
}

// Styled Components
const VisualizationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  background-color: ${props => props.theme.colors.card};
  box-shadow: ${props => props.theme.shadows.md};
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: ${({ theme }) => theme.colors.card};
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StepInfo = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors.background};
  border-top: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const AnimationSpeedContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
`;

const SpeedLabel = styled.label`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
`;

const SpeedSlider = styled.input`
  width: 100px;
`;

const GraphContainer = styled.div<{ containerHeight?: string | number }>`
  padding: 1rem;
  width: 100%;
  height: ${props => typeof props.containerHeight === 'number' ? `${props.containerHeight}px` : props.containerHeight || '100%'};
  min-height: 500px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const EnhancedGraphProblemVisualizer: React.FC<EnhancedGraphProblemVisualizerProps> = ({
  problemType,
  customSteps,
  width = '100%',
  height = '600px',
  onStepChange,
  showControls = true,
  autoStart = false,
  animationSpeed: initialAnimationSpeed = 1000,
  nodeRadius = 25,
  showNodeValues = false,
  showEdgeWeights = false,
  autoFit = true,
  allowZoomPan = true,
  generateNewGraph,
  runAlgorithm
}) => {
  const [graph, setGraph] = useState<{ vertices: Vertex[], edges: Edge[], adjacencyList: number[][] }>({
    vertices: [],
    edges: [],
    adjacencyList: []
  });
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(initialAnimationSpeed);
  
  // Initialize graph and steps
  useEffect(() => {
    if (customSteps && customSteps.length > 0) {
      setSteps(customSteps);
      return;
    }
    
    generateRandomGraph();
  }, [problemType, customSteps]);
  
  // Start animation if autoStart is true
  useEffect(() => {
    if (autoStart && steps.length > 0) {
      setIsAnimating(true);
    }
  }, [autoStart, steps]);
  
  // Animation timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isAnimating && !isPaused && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, animationSpeed);
    } else if (currentStep >= steps.length - 1) {
      setIsAnimating(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAnimating, isPaused, currentStep, steps, animationSpeed]);
  
  // Call onStepChange callback when step changes
  useEffect(() => {
    if (onStepChange && steps.length > 0) {
      onStepChange(currentStep, steps.length);
    }
  }, [currentStep, steps, onStepChange]);
  
  // Generate a random graph and run the algorithm
  const generateRandomGraph = useCallback(() => {
    let newGraph;
    
    if (generateNewGraph) {
      newGraph = generateNewGraph();
    } else {
      // Default graph generation based on problem type
      switch (problemType) {
        case 'directed-cycle':
          newGraph = GraphUtils.generateRandomGraph(7, 0.3, true, 180, 300, 200, true);
          break;
        case 'undirected-cycle':
          newGraph = GraphUtils.generateRandomGraph(7, 0.3, false, 180, 300, 200, true);
          break;
        case 'eulerian-path':
          // Generate a more densely connected graph for Eulerian path
          newGraph = GraphUtils.generateRandomGraph(6, 0.6, true, 180, 300, 200, true);
          break;
        case 'minimum-spanning-tree':
          // Generate an undirected weighted graph
          newGraph = GraphUtils.generateRandomGraph(7, 0.4, false, 180, 300, 200, true);
          // Add weights to edges
          newGraph.edges = newGraph.edges.map(edge => ({
            ...edge,
            weight: Math.floor(Math.random() * 9) + 1
          }));
          break;
        case 'shortest-path':
          // Generate a directed weighted graph
          newGraph = GraphUtils.generateRandomGraph(7, 0.3, true, 180, 300, 200, true);
          // Add weights to edges
          newGraph.edges = newGraph.edges.map(edge => ({
            ...edge,
            weight: Math.floor(Math.random() * 9) + 1
          }));
          break;
        case 'bfs':
        case 'dfs':
          newGraph = GraphUtils.generateRandomGraph(8, 0.25, problemType === 'bfs', 180, 300, 200, true);
          break;
        case 'dijkstra':
        case 'bellman-ford':
          newGraph = GraphUtils.generateRandomGraph(7, 0.3, true, 180, 300, 200, true);
          // Add weights to edges
          newGraph.edges = newGraph.edges.map(edge => ({
            ...edge,
            weight: Math.floor(Math.random() * 9) + 1
          }));
          break;
        case 'prim':
        case 'kruskal':
          newGraph = GraphUtils.generateRandomGraph(7, 0.4, false, 180, 300, 200, true);
          // Add weights to edges
          newGraph.edges = newGraph.edges.map(edge => ({
            ...edge,
            weight: Math.floor(Math.random() * 9) + 1
          }));
          break;
        default:
          newGraph = GraphUtils.generateRandomGraph(7, 0.3, true, 180, 300, 200, true);
      }
    }
    
    // Apply force-directed layout for better visualization
    newGraph.vertices = GraphUtils.applyForceDirectedLayout(
      newGraph.vertices, 
      newGraph.edges, 
      50, 
      typeof width === 'number' ? width : 600, 
      typeof height === 'number' ? height : 500
    );
    
    setGraph(newGraph);
    
    // Generate algorithm steps
    let algorithmSteps: VisualizationStep[] = [];
    
    if (runAlgorithm) {
      algorithmSteps = runAlgorithm(newGraph);
    } else {
      // Default algorithm based on problem type
      switch (problemType) {
        case 'directed-cycle': {
          const result = GraphUtils.detectDirectedCycle(newGraph.adjacencyList);
          algorithmSteps = result.steps;
          break;
        }
        case 'undirected-cycle': {
          const result = GraphUtils.detectUndirectedCycle(newGraph.adjacencyList);
          algorithmSteps = result.steps;
          break;
        }
        case 'eulerian-path': {
          const result = GraphUtils.findEulerianPath(newGraph.adjacencyList);
          algorithmSteps = result.steps;
          break;
        }
        default:
          // For other problem types, just show the initial graph
          algorithmSteps = [{
            vertices: newGraph.vertices,
            edges: newGraph.edges,
            description: 'Initial graph'
          }];
      }
    }
    
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setIsAnimating(false);
    setIsPaused(false);
  }, [problemType, width, height, generateNewGraph, runAlgorithm]);
  
  // UI Handlers
  const handleStart = () => {
    if (steps.length === 0) {
      generateRandomGraph();
    } else {
      setIsAnimating(true);
      setIsPaused(false);
    }
  };
  
  const handlePause = () => {
    setIsPaused(true);
  };
  
  const handleReset = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setIsPaused(false);
  };
  
  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert slider value (0-100) to animation speed (2000-100ms)
    const speed = 2100 - parseInt(e.target.value) * 20;
    setAnimationSpeed(speed);
  };
  
  // Prepare current step data for visualization
  const currentGraphData: GraphData = steps.length > 0 && currentStep < steps.length
    ? {
        vertices: steps[currentStep].vertices,
        edges: steps[currentStep].edges,
        cyclePath: steps[currentStep].cyclePath,
        description: steps[currentStep].description
      }
    : { vertices: [], edges: [] };
  
  return (
    <VisualizationContainer>
      {showControls && (
        <ControlsContainer>
          <Button onClick={generateRandomGraph} disabled={isAnimating && !isPaused}>
            <FaRandom /> New Graph
          </Button>
          
          <Button onClick={handleStart} disabled={isAnimating && !isPaused}>
            <FaPlay /> Start
          </Button>
          
          <Button onClick={handlePause} disabled={!isAnimating || isPaused}>
            <FaPause /> Pause
          </Button>
          
          <Button onClick={handleReset} disabled={steps.length === 0}>
            <FaRedo /> Reset
          </Button>
          
          <Button onClick={handleStepBackward} disabled={isAnimating || currentStep === 0}>
            <FaStepBackward /> Prev
          </Button>
          
          <Button onClick={handleStepForward} disabled={isAnimating || currentStep === steps.length - 1}>
            <FaStepForward /> Next
          </Button>
          
          <AnimationSpeedContainer>
            <SpeedLabel>Speed:</SpeedLabel>
            <SpeedSlider 
              type="range" 
              min="0" 
              max="100" 
              value={(2100 - animationSpeed) / 20}
              onChange={handleSpeedChange} 
            />
          </AnimationSpeedContainer>
        </ControlsContainer>
      )}
      
      <GraphContainer containerHeight={height}>
        <GraphVisualizer 
          data={currentGraphData}
          width={width as number | string}
          height={"100%"}
          nodeRadius={nodeRadius}
          showWeights={showEdgeWeights}
          highlightPath={
            currentGraphData.cyclePath || 
            (steps[currentStep]?.path as number[] | undefined)
          }
        />
      </GraphContainer>
      
      {steps.length > 0 && currentStep < steps.length && (
        <StepInfo>{steps[currentStep].description}</StepInfo>
      )}
    </VisualizationContainer>
  );
};

export default EnhancedGraphProblemVisualizer; 