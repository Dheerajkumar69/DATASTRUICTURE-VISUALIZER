import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward } from 'react-icons/fa';
import ProblemPageTemplate from '../../../components/templates/ProblemPageTemplate';
import { AlgorithmInfo } from '../../../types/algorithm';

// Define vertex and edge types
type VertexState = 'unvisited' | 'visiting' | 'visited';
type EdgeState = 'normal' | 'discovery' | 'cycle';

interface Vertex {
  id: number;
  x: number;
  y: number;
  name: string;
  state: VertexState;
}

interface Edge {
  from: number;
  to: number;
  state: EdgeState;
}

interface Step {
  vertices: Vertex[];
  edges: Edge[];
  currentVertex: number | null;
  cyclePath: number[] | null;
  description: string;
}

interface Graph {
  vertices: Vertex[];
  edges: Edge[];
  adjList: number[][];
}

// Styled components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  @media (max-width: 768px) { padding: 1rem; }
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
  
  &:hover { text-decoration: underline; }
  svg { margin-right: 0.5rem; }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textLight};
  max-width: 800px;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 800px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover { background-color: ${props => props.theme.colors.hover}; }
  svg { margin-right: 0.5rem; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 800px;
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 600px;
  height: 400px;
  background-color: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
  }
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
`;

const InfoPanel = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors.card};
  transition: all 0.3s ease;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
  max-width: 800px;
  width: 100%;
`;

const InfoTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
`;

const InfoText = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 0.5rem;
  line-height: 1.5;
  font-size: 0.9rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
`;

// Separate components for better modularity
const AlgorithmExplanation = () => (
  <InfoPanel>
    <InfoTitle>How Cycle Detection Works in Undirected Graphs:</InfoTitle>
    <InfoText>1. Start a DFS traversal from any vertex.</InfoText>
    <InfoText>2. For each vertex, mark it as "visiting" when first encountered.</InfoText>
    <InfoText>3. Recursively visit all adjacent unvisited vertices.</InfoText>
    <InfoText>4. If we encounter an already "visiting" vertex that is not the parent of the current vertex, we've found a cycle.</InfoText>
    <InfoText>5. Mark vertices as "visited" once all their neighbors have been processed.</InfoText>
  </InfoPanel>
);

const Complexity = () => (
  <InfoPanel>
    <InfoTitle>Time & Space Complexity:</InfoTitle>
    <InfoText>
      <strong>Time Complexity:</strong> O(V + E) where V is the number of vertices and E is the number of edges.
    </InfoText>
    <InfoText>
      <strong>Space Complexity:</strong> O(V) for the recursion stack and visited array.
    </InfoText>
  </InfoPanel>
);

const Applications = () => (
  <InfoPanel>
    <InfoTitle>Applications of Cycle Detection:</InfoTitle>
    <InfoText>• Deadlock detection in operating systems</InfoText>
    <InfoText>• Circuit analysis in electrical engineering</InfoText>
    <InfoText>• Checking for circular dependencies in software packages</InfoText>
    <InfoText>• Verifying that a graph is a tree (a tree is a connected graph with no cycles)</InfoText>
    <InfoText>• Finding minimal spanning trees in networks</InfoText>
  </InfoPanel>
);

const undirectedCycleDetectionInfo: AlgorithmInfo = {
  name: "Undirected Graph Cycle Detection",
  description: "Cycle detection in an undirected graph is the problem of identifying if a graph contains any cycles, which are paths that start and end at the same vertex. This algorithm uses Depth-First Search (DFS) to detect cycles.",
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)'
  },
  spaceComplexity: 'O(V)',
  implementations: {
    javascript: `function hasCycle(graph) {
  const visited = new Set();
  
  function dfs(vertex, parent) {
    visited.add(vertex);
    
    for (const neighbor of graph[vertex]) {
      // If the neighbor is the parent, skip it
      if (neighbor === parent) continue;
      
      // If the neighbor is already visited, we found a cycle
      if (visited.has(neighbor)) {
        return true;
      }
      
      // Recursively check for cycles
      if (dfs(neighbor, vertex)) {
        return true;
      }
    }
    
    return false;
  }
  
  // Check for cycles starting from each unvisited vertex
  for (let vertex = 0; vertex < graph.length; vertex++) {
    if (!visited.has(vertex)) {
      if (dfs(vertex, -1)) {
        return true;
      }
    }
  }
  
  return false;
}`,
    python: `def has_cycle(graph):
    visited = set()
    
    def dfs(vertex, parent):
        visited.add(vertex)
        
        for neighbor in graph[vertex]:
            # If the neighbor is the parent, skip it
            if neighbor == parent:
                continue
            
            # If the neighbor is already visited, we found a cycle
            if neighbor in visited:
                return True
            
            # Recursively check for cycles
            if dfs(neighbor, vertex):
                return True
        
        return False
    
    # Check for cycles starting from each unvisited vertex
    for vertex in range(len(graph)):
        if vertex not in visited:
            if dfs(vertex, -1):
                return True
    
    return False`,
    java: `public boolean hasCycle(List<List<Integer>> graph) {
    boolean[] visited = new boolean[graph.size()];
    
    for (int i = 0; i < graph.size(); i++) {
        if (!visited[i]) {
            if (dfs(graph, i, -1, visited)) {
                return true;
            }
        }
    }
    
    return false;
}

private boolean dfs(List<List<Integer>> graph, int vertex, int parent, boolean[] visited) {
    visited[vertex] = true;
    
    for (int neighbor : graph.get(vertex)) {
        if (neighbor == parent) {
            continue;
        }
        
        if (visited[neighbor]) {
            return true;
        }
        
        if (dfs(graph, neighbor, vertex, visited)) {
            return true;
        }
    }
    
    return false;
}`,
    cpp: `bool hasCycle(vector<vector<int>>& graph) {
    vector<bool> visited(graph.size(), false);
    
    for (int i = 0; i < graph.size(); i++) {
        if (!visited[i]) {
            if (dfs(graph, i, -1, visited)) {
                return true;
            }
        }
    }
    
    return false;
}

bool dfs(vector<vector<int>>& graph, int vertex, int parent, vector<bool>& visited) {
    visited[vertex] = true;
    
    for (int neighbor : graph[vertex]) {
        if (neighbor == parent) {
            continue;
        }
        
        if (visited[neighbor]) {
            return true;
        }
        
        if (dfs(graph, neighbor, vertex, visited)) {
            return true;
        }
    }
    
    return false;
}`
  }
};

const problemDescription = `
Given an undirected graph, determine if it contains any cycles.

A cycle in a graph is a path of edges and vertices wherein a vertex is reachable from itself through the path, without repetition of edges.

For example, in a graph with vertices A, B, C, and edges connecting A-B, B-C, and C-A, there is a cycle A → B → C → A.

The algorithm uses a depth-first search (DFS) traversal to explore the graph. When traversing, if we encounter a vertex that has already been visited and it is not the parent of the current vertex, then a cycle exists.
`;

const UndirectedCycleDetectionPage: React.FC = () => {
  const [graph, setGraph] = useState<Graph>({
    vertices: [],
    edges: [],
    adjList: []
  });
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1000);
  const [graphType, setGraphType] = useState<'random' | 'cyclic' | 'acyclic'>('random');
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Initialize graph on component mount
  useEffect(() => {
    generateRandomGraph();
  }, []);
  
  // Generate a random graph
  const generateRandomGraph = useCallback(() => {
    const newVertices: Vertex[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      name: String.fromCharCode(65 + i),
      state: 'unvisited'
    }));
    
    const newEdges: Edge[] = [];
    const adjList: number[][] = Array(8).fill(null).map(() => []);
    
    // Generate random edges
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 8; j++) {
        if (Math.random() < 0.3) {
          newEdges.push({
            from: i,
            to: j,
            state: 'normal'
          });
          adjList[i].push(j);
          adjList[j].push(i);
        }
      }
    }
    
    // Ensure graph is connected
    for (let i = 0; i < 7; i++) {
      if (adjList[i].length === 0) {
        const j = i + 1;
        newEdges.push({
          from: i,
          to: j,
          state: 'normal'
        });
        adjList[i].push(j);
        adjList[j].push(i);
      }
    }
    
    // Position vertices in a circle
    const centerX = 400;
    const centerY = 300;
    const radius = 200;
    
    newVertices.forEach((vertex, i) => {
      const angle = (i * 2 * Math.PI) / newVertices.length;
      vertex.x = centerX + radius * Math.cos(angle);
      vertex.y = centerY + radius * Math.sin(angle);
    });
    
    setGraph({
      vertices: newVertices,
      edges: newEdges,
      adjList
    });
    setSteps([]);
    setCurrentStep(0);
  }, []);
  
  // Setup canvas and render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    renderGraph(ctx);
  }, [graph, currentStep, steps]);
  
  // Animation timer
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
  
  // Run DFS to detect cycles
  const detectCycle = useCallback(() => {
    if (graph.vertices.length === 0) return;
    
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    const newSteps: Step[] = [];
    
    // Make copies of vertices and edges
    let verticesCopy: Vertex[] = graph.vertices.map(v => ({ ...v, state: 'unvisited' }));
    let edgesCopy: Edge[] = graph.edges.map(e => ({ ...e, state: 'normal' }));
    
    // Initial step
    newSteps.push({
      vertices: [...verticesCopy],
      edges: [...edgesCopy],
      currentVertex: null,
      cyclePath: null,
      description: `Starting cycle detection from vertex ${verticesCopy[0].name} using DFS.`
    });
    
    // Create adjacency list
    const adjList: number[][] = Array(verticesCopy.length).fill(0).map(() => []);
    edgesCopy.forEach((edge) => {
      adjList[edge.from].push(edge.to);
      adjList[edge.to].push(edge.from); // Undirected graph
    });
    
    // DFS function to detect cycle
    const dfs = (vertex: number, parentVertex: number): boolean => {
      // Update state of current vertex to 'visiting'
      verticesCopy = [...verticesCopy];
      verticesCopy[vertex] = { ...verticesCopy[vertex], state: 'visiting' };
      
      newSteps.push({
        vertices: [...verticesCopy],
        edges: [...edgesCopy],
        currentVertex: vertex,
        cyclePath: null,
        description: `Visiting vertex ${verticesCopy[vertex].name}`
      });
      
      for (let i = 0; i < edgesCopy.length; i++) {
        const edge = edgesCopy[i];
        const neighbor = edge.from === vertex ? edge.to : (edge.to === vertex ? edge.from : -1);
        
        if (neighbor === -1 || neighbor === parentVertex) continue;
        
        if (verticesCopy[neighbor].state === 'unvisited') {
          // Update edge to 'discovery'
          edgesCopy = [...edgesCopy];
          edgesCopy[i] = { ...edgesCopy[i], state: 'discovery' };
          
          newSteps.push({
            vertices: [...verticesCopy],
            edges: [...edgesCopy],
            currentVertex: vertex,
            cyclePath: null,
            description: `Found unvisited neighbor ${verticesCopy[neighbor].name}, marking edge as discovery edge`
          });
          
          if (dfs(neighbor, vertex)) {
            return true;
          }
        } 
        else if (verticesCopy[neighbor].state === 'visiting') {
          // Update edge to 'cycle'
          edgesCopy = [...edgesCopy];
          edgesCopy[i] = { ...edgesCopy[i], state: 'cycle' };
          
          newSteps.push({
            vertices: [...verticesCopy],
            edges: [...edgesCopy],
            currentVertex: vertex,
            cyclePath: null,
            description: `Found back edge to vertex ${verticesCopy[neighbor].name}, marking edge as cycle edge`
          });
          
          return true;
        }
      }
      
      // Update state of current vertex to 'visited'
      verticesCopy = [...verticesCopy];
      verticesCopy[vertex] = { ...verticesCopy[vertex], state: 'visited' };
      
      newSteps.push({
        vertices: [...verticesCopy],
        edges: [...edgesCopy],
        currentVertex: vertex,
        cyclePath: null,
        description: `Finished visiting vertex ${verticesCopy[vertex].name}, marking as visited`
      });
      
      return false;
    };
    
    // Start DFS from vertex 0
    const cycleFound = dfs(0, -1);
    
    // Final step
    if (!cycleFound) {
      newSteps.push({
        vertices: [...verticesCopy],
        edges: [...edgesCopy],
        currentVertex: null,
        cyclePath: null,
        description: `DFS completed. No cycle detected in the graph.`
      });
    }
    
    setSteps(newSteps);
    setCurrentStep(0);
  }, [graph]);
  
  // Render the graph on canvas
  const renderGraph = useCallback((ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let verticesToRender = graph.vertices;
    let edgesToRender = graph.edges;
    
    if (steps.length > 0 && currentStep < steps.length) {
      verticesToRender = steps[currentStep].vertices;
      edgesToRender = steps[currentStep].edges;
    }
    
    // Draw edges
    edgesToRender.forEach(edge => {
      const from = verticesToRender[edge.from];
      const to = verticesToRender[edge.to];
      
      ctx.beginPath();
      
      // Set edge style based on state
      switch (edge.state) {
        case 'discovery':
          ctx.strokeStyle = '#2196f3'; // Blue
          ctx.lineWidth = 3;
          break;
        case 'cycle':
          ctx.strokeStyle = '#f44336'; // Red
          ctx.lineWidth = 4;
          break;
        default:
          ctx.strokeStyle = '#aaaaaa'; // Gray
          ctx.lineWidth = 2;
      }
      
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    });
    
    // Draw vertices
    verticesToRender.forEach(vertex => {
      ctx.beginPath();
      
      // Set vertex style based on state
      switch (vertex.state) {
        case 'visiting':
          ctx.fillStyle = '#ff9800'; // Orange
          break;
        case 'visited':
          ctx.fillStyle = '#4caf50'; // Green
          break;
        default:
          ctx.fillStyle = '#2196f3'; // Blue
      }
      
      // Highlight cycle vertices - with proper null checking
      const currentStepData = steps[currentStep];
      if (steps.length > 0 && 
          currentStep < steps.length && 
          currentStepData?.cyclePath && 
          currentStepData.cyclePath.includes(vertex.id)) {
        ctx.fillStyle = '#f44336'; // Red
      }
      
      ctx.arc(vertex.x, vertex.y, 20, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw vertex name
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(vertex.name, vertex.x, vertex.y);
    });
  }, [graph, steps, currentStep]);
  
  // Control methods
  const startAnimation = useCallback(() => {
    if (steps.length === 0) {
      detectCycle();
    }
    setIsAnimating(true);
    setIsPaused(false);
  }, [steps.length, detectCycle]);
  
  const pauseAnimation = useCallback(() => {
    setIsPaused(true);
  }, []);
  
  const resetAnimation = useCallback(() => {
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    generateRandomGraph();
  }, [generateRandomGraph]);
  
  const stepForward = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);
  
  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);
  
  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnimationSpeed(parseInt(e.target.value, 10));
  }, []);
  
  const handleGraphTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setGraphType(e.target.value as 'random' | 'cyclic' | 'acyclic');
  }, []);
  
  // Memoize step description component
  const StepDescription = useMemo(() => {
    if (steps.length === 0 || currentStep >= steps.length) return null;
    
    const currentStepData = steps[currentStep];
    return (
      <InfoPanel>
        <InfoTitle>Current Step:</InfoTitle>
        <InfoText>{currentStepData.description}</InfoText>
        {currentStepData.cyclePath && (
          <InfoText>
            <strong>Cycle Path: </strong>
            {currentStepData.cyclePath.map(v => graph.vertices[v]?.name || '').filter(Boolean).join(" → ")}
          </InfoText>
        )}
      </InfoPanel>
    );
  }, [steps, currentStep, graph.vertices]);
  
  const visualizationComponent = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <p>Graph visualization will be displayed here</p>
    </div>
  );

  return (
    <ProblemPageTemplate 
      algorithmInfo={undirectedCycleDetectionInfo}
      visualizationComponent={visualizationComponent}
      problemDescription={problemDescription}
    />
  );
};

export default UndirectedCycleDetectionPage; 