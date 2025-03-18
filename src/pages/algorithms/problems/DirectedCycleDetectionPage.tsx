import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaPlay, FaPause, FaStepForward, FaStepBackward, FaRedo } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Vertex and Edge Types
type VertexState = 'unvisited' | 'visiting' | 'visited';
type EdgeState = 'normal' | 'discovery' | 'back' | 'cross' | 'cycle';

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
  description: string;
  cycleFound: boolean;
  cyclePath: number[] | null;
}

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavigationRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #3182ce;
  margin-right: auto;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.5;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 8px 16px;
  background-color: ${props => (props.primary ? '#3182ce' : '#e2e8f0')};
  color: ${props => (props.primary ? 'white' : '#4a5568')};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background-color: ${props => (props.primary ? '#2c5282' : '#cbd5e0')};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GraphContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;
`;

const CanvasContainer = styled.div`
  flex: 1;
  min-width: 500px;
  max-width: 100%;
  min-height: 500px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const InfoPanel = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 100%;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
`;

const InfoTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
`;

const InfoText = styled.div`
  font-size: 0.9rem;
  line-height: 1.5;
  color: #4a5568;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #4a5568;
`;

const DirectedCycleDetectionPage: React.FC = () => {
  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // State for graph data
  const [vertices, setVertices] = useState<Vertex[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [adjList, setAdjList] = useState<number[][]>([]);
  
  // Animation states
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000);
  const [graphType, setGraphType] = useState<'random' | 'cyclic' | 'acyclic'>('random');
  
  // Animation timer
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Generate random graph
  const generateGraph = () => {
    // Clear previous data
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }
    
    const numVertices = 6; // Fixed number for better visualization
    
    // Generate vertices in a circle for better visualization
    const newVertices: Vertex[] = [];
    const radius = 150;
    const centerX = 250;
    const centerY = 250;
    
    for (let i = 0; i < numVertices; i++) {
      const angle = (2 * Math.PI * i) / numVertices;
      newVertices.push({
        id: i,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        name: String.fromCharCode(65 + i), // A, B, C, ...
        state: 'unvisited'
      });
    }
    
    // Generate edges based on graph type
    const newEdges: Edge[] = [];
    const newAdjList: number[][] = Array(numVertices).fill(null).map(() => []);
    
    // Function to add an edge
    const addEdge = (from: number, to: number) => {
      newEdges.push({ from, to, state: 'normal' });
      newAdjList[from].push(to);
      // Note: we don't add the reverse edge as this is a directed graph
    };
    
    if (graphType === 'random') {
      // Generate random edges with ~40% density (for better visualization)
      for (let i = 0; i < numVertices; i++) {
        for (let j = 0; j < numVertices; j++) {
          if (i !== j && Math.random() < 0.3) {
            addEdge(i, j);
          }
        }
      }
    } else if (graphType === 'cyclic') {
      // Create a graph with a guaranteed cycle (a circle)
      for (let i = 0; i < numVertices; i++) {
        addEdge(i, (i + 1) % numVertices);
      }
      
      // Add some random extra edges for variety
      for (let i = 0; i < numVertices; i++) {
        for (let j = 0; j < numVertices; j++) {
          if (i !== j && (j !== (i + 1) % numVertices) && Math.random() < 0.2) {
            addEdge(i, j);
          }
        }
      }
    } else if (graphType === 'acyclic') {
      // Create a DAG (guaranteed to be acyclic)
      // We ensure that edges only go from lower-indexed vertices to higher-indexed ones
      for (let i = 0; i < numVertices - 1; i++) {
        for (let j = i + 1; j < numVertices; j++) {
          if (Math.random() < 0.3) {
            addEdge(i, j);
          }
        }
      }
    }
    
    setVertices(newVertices);
    setEdges(newEdges);
    setAdjList(newAdjList);
    
    // Set initial step
    setSteps([{
      vertices: [...newVertices],
      edges: [...newEdges],
      description: 'Initial graph. Starting cycle detection...',
      cycleFound: false,
      cyclePath: null
    }]);
    
    // Render the graph
    setTimeout(() => renderGraph(), 100);
  };
  
  // Run DFS to detect cycles in a directed graph
  const detectCycles = () => {
    // Make copies to avoid modifying state directly
    let verticesCopy: Vertex[] = JSON.parse(JSON.stringify(vertices));
    let edgesCopy: Edge[] = JSON.parse(JSON.stringify(edges));
    
    const steps: Step[] = [{
      vertices: [...verticesCopy],
      edges: [...edgesCopy],
      description: 'Starting DFS to detect cycles in the directed graph.',
      cycleFound: false,
      cyclePath: null
    }];
    
    // Recursion stack to track vertices on the current path
    const recursionStack: boolean[] = Array(vertices.length).fill(false);
    
    // Array to track the path for cycle detection
    const path: number[] = [];
    
    // DFS function to detect cycle
    const dfs = (vertex: number): boolean => {
      // Mark current vertex as visiting
      verticesCopy = verticesCopy.map((v, idx) => 
        idx === vertex ? { ...v, state: 'visiting' } : v
      );
      
      // Add to recursion stack
      recursionStack[vertex] = true;
      path.push(vertex);
      
      steps.push({
        vertices: [...verticesCopy],
        edges: [...edgesCopy],
        description: `Visiting vertex ${verticesCopy[vertex].name}. Adding to recursion stack.`,
        cycleFound: false,
        cyclePath: null
      });
      
      // Check all adjacent vertices
      for (const neighbor of adjList[vertex]) {
        // Find the edge index
        const edgeIndex = edgesCopy.findIndex(e => 
          e.from === vertex && e.to === neighbor
        );
        
        // If the neighbor is unvisited
        if (verticesCopy[neighbor].state === 'unvisited') {
          // Mark edge as discovery edge
          edgesCopy = edgesCopy.map((e, idx) => 
            idx === edgeIndex ? { ...e, state: 'discovery' } : e
          );
          
          steps.push({
            vertices: [...verticesCopy],
            edges: [...edgesCopy],
            description: `Exploring edge from ${verticesCopy[vertex].name} to ${verticesCopy[neighbor].name}.`,
            cycleFound: false,
            cyclePath: null
          });
          
          // Recursively check neighbor
          if (dfs(neighbor)) {
            return true; // Cycle found
          }
        } 
        // If the neighbor is in the recursion stack, we found a cycle
        else if (recursionStack[neighbor]) {
          // Mark edge as cycle edge
          edgesCopy = edgesCopy.map((e, idx) => 
            idx === edgeIndex ? { ...e, state: 'cycle' } : e
          );
          
          // Construct the cycle path
          const cycleStartIndex = path.indexOf(neighbor);
          const cyclePath = path.slice(cycleStartIndex);
          
          steps.push({
            vertices: [...verticesCopy],
            edges: [...edgesCopy],
            description: `Cycle detected! Found back edge from ${verticesCopy[vertex].name} to ${verticesCopy[neighbor].name}, which is already in the recursion stack.`,
            cycleFound: true,
            cyclePath
          });
          
          return true; // Cycle found
        }
        // If the neighbor is already visited but not in recursion stack
        else if (verticesCopy[neighbor].state === 'visited') {
          // Mark edge as cross edge
          edgesCopy = edgesCopy.map((e, idx) => 
            idx === edgeIndex ? { ...e, state: 'cross' } : e
          );
          
          steps.push({
            vertices: [...verticesCopy],
            edges: [...edgesCopy],
            description: `Found cross edge from ${verticesCopy[vertex].name} to ${verticesCopy[neighbor].name}. Not part of a cycle.`,
            cycleFound: false,
            cyclePath: null
          });
        }
      }
      
      // Mark current vertex as visited and remove from recursion stack
      verticesCopy = verticesCopy.map((v, idx) => 
        idx === vertex ? { ...v, state: 'visited' } : v
      );
      
      recursionStack[vertex] = false;
      path.pop();
      
      steps.push({
        vertices: [...verticesCopy],
        edges: [...edgesCopy],
        description: `Finished exploring vertex ${verticesCopy[vertex].name}. Removing from recursion stack.`,
        cycleFound: false,
        cyclePath: null
      });
      
      return false; // No cycle found in this DFS path
    };
    
    // Run DFS from each unvisited vertex
    let cycleFound = false;
    for (let i = 0; i < verticesCopy.length && !cycleFound; i++) {
      if (verticesCopy[i].state === 'unvisited') {
        if (dfs(i)) {
          cycleFound = true;
        }
      }
    }
    
    // If no cycle was found, add a final step
    if (!cycleFound) {
      steps.push({
        vertices: [...verticesCopy],
        edges: [...edgesCopy],
        description: 'DFS complete. No cycles detected in the graph.',
        cycleFound: false,
        cyclePath: null
      });
    }
    
    setSteps(steps);
    setCurrentStep(0);
  };
  
  // Render the graph on canvas
  const renderGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get current step data
    const currentStepData = steps[currentStep];
    if (!currentStepData) return;
    
    const { vertices: currentVertices, edges: currentEdges, cyclePath } = currentStepData;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    for (const edge of currentEdges) {
      const from = currentVertices[edge.from];
      const to = currentVertices[edge.to];
      
      // Calculate direction vector
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Normalize direction vector
      const ndx = dx / length;
      const ndy = dy / length;
      
      // Calculate start and end points (offset by vertex radius)
      const startX = from.x + ndx * 20;
      const startY = from.y + ndy * 20;
      const endX = to.x - ndx * 20;
      const endY = to.y - ndy * 20;
      
      // Set edge color based on state
      switch (edge.state) {
        case 'normal':
          ctx.strokeStyle = '#A0AEC0';
          break;
        case 'discovery':
          ctx.strokeStyle = '#3182CE';
          break;
        case 'back':
          ctx.strokeStyle = '#DD6B20';
          break;
        case 'cross':
          ctx.strokeStyle = '#6B46C1';
          break;
        case 'cycle':
          ctx.strokeStyle = '#E53E3E';
          break;
      }
      
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Draw arrowhead
      const arrowSize = 10;
      const angle = Math.atan2(endY - startY, endX - startX);
      
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowSize * Math.cos(angle - Math.PI / 6),
        endY - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - arrowSize * Math.cos(angle + Math.PI / 6),
        endY - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
    }
    
    // Draw vertices
    for (const vertex of currentVertices) {
      // Determine if this vertex is part of the cycle path
      const isInCyclePath = cyclePath && cyclePath.includes(vertex.id);
      
      // Set vertex color based on state
      switch (vertex.state) {
        case 'unvisited':
          ctx.fillStyle = isInCyclePath ? '#FEB2B2' : '#E2E8F0';
          break;
        case 'visiting':
          ctx.fillStyle = isInCyclePath ? '#FC8181' : '#4299E1';
          break;
        case 'visited':
          ctx.fillStyle = isInCyclePath ? '#F56565' : '#2B6CB0';
          break;
      }
      
      // Draw vertex circle
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw vertex border
      ctx.strokeStyle = isInCyclePath ? '#C53030' : '#2D3748';
      ctx.lineWidth = isInCyclePath ? 3 : 1;
      ctx.stroke();
      
      // Draw vertex label
      ctx.font = '16px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(vertex.name, vertex.x, vertex.y);
    }
  };
  
  // Animation controls
  const startAnimation = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    
    setIsRunning(true);
  };
  
  const pauseAnimation = () => {
    setIsRunning(false);
  };
  
  const resetAnimation = () => {
    setIsRunning(false);
    setCurrentStep(0);
  };
  
  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Reset and run algorithm when graph type changes
  useEffect(() => {
    generateGraph();
  }, [graphType]);
  
  // Run algorithm when graph is generated
  useEffect(() => {
    if (vertices.length > 0 && edges.length > 0) {
      detectCycles();
    }
  }, [vertices, edges]);
  
  // Animation loop
  useEffect(() => {
    if (isRunning && currentStep < steps.length - 1) {
      animationTimerRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (isRunning && currentStep >= steps.length - 1) {
      setIsRunning(false);
    }
    
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [isRunning, currentStep, steps, speed]);
  
  // Render the graph when the current step changes
  useEffect(() => {
    renderGraph();
  }, [currentStep]);
  
  // Make sure canvas dimensions are set correctly
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      renderGraph();
    }
    
    // Handle window resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        renderGraph();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms">
          <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Algorithms
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Detecting Cycles in a Directed Graph</PageTitle>
        <Description>
          Learn how to detect cycles in a directed graph using Depth-First Search (DFS) 
          and a recursion stack. This visualization demonstrates how the algorithm 
          identifies cycles by keeping track of vertices in the current DFS path.
        </Description>
      </PageHeader>
      
      <ControlsContainer>
        <Select 
          value={graphType}
          onChange={(e) => setGraphType(e.target.value as 'random' | 'cyclic' | 'acyclic')}
        >
          <option value="random">Random Graph</option>
          <option value="cyclic">Cyclic Graph</option>
          <option value="acyclic">Acyclic Graph</option>
        </Select>
        
        <Button onClick={generateGraph}>
          <FaRedo /> New Graph
        </Button>
        
        <Select 
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        >
          <option value="2000">Slow</option>
          <option value="1000">Normal</option>
          <option value="500">Fast</option>
        </Select>
        
        {isRunning ? (
          <Button primary onClick={pauseAnimation}>
            <FaPause /> Pause
          </Button>
        ) : (
          <Button primary onClick={startAnimation}>
            <FaPlay /> Start
          </Button>
        )}
        
        <Button onClick={stepBackward} disabled={currentStep === 0}>
          <FaStepBackward /> Back
        </Button>
        
        <Button onClick={stepForward} disabled={currentStep === steps.length - 1}>
          <FaStepForward /> Forward
        </Button>
        
        <Button onClick={resetAnimation}>
          Reset
        </Button>
      </ControlsContainer>
      
      <GraphContainer>
        <CanvasContainer>
          <Canvas ref={canvasRef} width={500} height={500} />
        </CanvasContainer>
        
        <InfoPanel>
          <InfoTitle>Current Step</InfoTitle>
          <InfoText>
            {steps[currentStep]?.description || 'Initializing...'}
          </InfoText>
          
          <InfoTitle>How It Works</InfoTitle>
          <InfoText>
            <p>The algorithm uses Depth-First Search (DFS) to traverse the graph and detect cycles in directed graphs.</p>
            <p>In a directed graph, a cycle exists if we encounter a vertex that is currently in the recursion stack (being processed in the current DFS path).</p>
            <p>Color coding:</p>
            <ul>
              <li><span style={{ color: '#E2E8F0' }}>■</span> White: Unvisited vertices</li>
              <li><span style={{ color: '#4299E1' }}>■</span> Blue: Vertices currently being visited</li>
              <li><span style={{ color: '#2B6CB0' }}>■</span> Dark Blue: Visited vertices</li>
              <li><span style={{ color: '#A0AEC0' }}>➡</span> Gray: Normal edges</li>
              <li><span style={{ color: '#3182CE' }}>➡</span> Blue: Discovery edges</li>
              <li><span style={{ color: '#6B46C1' }}>➡</span> Purple: Cross edges</li>
              <li><span style={{ color: '#E53E3E' }}>➡</span> Red: Edges that form cycles</li>
            </ul>
          </InfoText>
          
          <InfoTitle>Time and Space Complexity</InfoTitle>
          <InfoText>
            <p><strong>Time Complexity:</strong> O(V + E) where V is the number of vertices and E is the number of edges.</p>
            <p><strong>Space Complexity:</strong> O(V) for the recursion stack and visited array.</p>
          </InfoText>
          
          <InfoTitle>Applications</InfoTitle>
          <InfoText>
            <ul>
              <li>Detecting deadlocks in operating systems</li>
              <li>Checking for circular dependencies in software packages</li>
              <li>Cycle detection in dependency graphs</li>
              <li>Finding circular references in databases</li>
              <li>Detecting infinite loops in state transitions</li>
              <li>Checking if a directed graph is a Directed Acyclic Graph (DAG)</li>
            </ul>
          </InfoText>
        </InfoPanel>
      </GraphContainer>
    </PageContainer>
  );
};

export default DirectedCycleDetectionPage; 