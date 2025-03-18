import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaPlay, FaPause, FaStepForward, FaStepBackward, FaRedo } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Vertex and Edge Types
type VertexState = 'unvisited' | 'visiting' | 'visited' | 'sorted';
type EdgeState = 'normal' | 'discovery' | 'back' | 'removed' | 'permanent';

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
  removedEdges: Edge[];
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

const RemovedEdgesContainer = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: #FEF2F2;
  border-radius: 4px;
  border: 1px solid #FCA5A5;
`;

const RemovedEdge = styled.div`
  display: inline-block;
  padding: 2px 6px;
  margin: 2px;
  background-color: #FEE2E2;
  border-radius: 4px;
  font-weight: 500;
`;

const MinimumEdgesFeedbackArcPage: React.FC = () => {
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
  const [graphSize, setGraphSize] = useState<number>(6);
  
  // Animation timer
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Generate random directed graph
  const generateGraph = () => {
    // Clear previous data
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }
    
    const numVertices = graphSize; // Configurable size
    
    // Generate vertices in a circle for better visualization
    const newVertices: Vertex[] = [];
    const radius = 180;
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
    
    // Generate edges with ~40% density (for better visualization)
    // We guarantee that we have at least one cycle for a more interesting visualization
    const newEdges: Edge[] = [];
    const newAdjList: number[][] = Array(numVertices).fill(null).map(() => []);
    
    // Function to add an edge
    const addEdge = (from: number, to: number) => {
      newEdges.push({ from, to, state: 'normal' });
      newAdjList[from].push(to);
    };
    
    // First, add edges to form a guaranteed cycle
    for (let i = 0; i < numVertices; i++) {
      addEdge(i, (i + 1) % numVertices);
    }
    
    // Then add some random additional edges for variety
    for (let i = 0; i < numVertices; i++) {
      for (let j = 0; j < numVertices; j++) {
        if (i !== j && j !== (i + 1) % numVertices && Math.random() < 0.15) {
          addEdge(i, j);
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
      description: 'Initial graph with cycles. We will find the minimum number of edges to remove to break all cycles.',
      removedEdges: []
    }]);
    
    // Render the graph
    setTimeout(() => renderGraph(), 100);
  };
  
  // Run algorithm to find minimum feedback arc set
  const findMinimumFeedbackArcSet = () => {
    // Make copies to avoid modifying state directly
    let verticesCopy: Vertex[] = JSON.parse(JSON.stringify(vertices));
    let edgesCopy: Edge[] = JSON.parse(JSON.stringify(edges));
    let adjListCopy: number[][] = JSON.parse(JSON.stringify(adjList));
    
    const steps: Step[] = [{
      vertices: [...verticesCopy],
      edges: [...edgesCopy],
      description: 'Starting to find the minimum feedback arc set using DFS and greedy removal of back edges.',
      removedEdges: []
    }];
    
    const removedEdges: Edge[] = [];
    
    // Function to run DFS and identify back edges
    const findBackEdgesWithDFS = () => {
      // Reset vertex states
      verticesCopy = verticesCopy.map(v => ({ ...v, state: 'unvisited' }));
      
      steps.push({
        vertices: [...verticesCopy],
        edges: [...edgesCopy],
        description: 'Starting DFS to identify back edges in the graph.',
        removedEdges: [...removedEdges]
      });
      
      // Recursion stack to track vertices on the current path
      const recursionStack: boolean[] = Array(vertices.length).fill(false);
      
      // Flag to check if any cycle was found
      let cycleFound = false;
      
      // DFS function to detect cycle
      const dfs = (vertex: number): boolean => {
        // Mark current vertex as visiting
        verticesCopy = verticesCopy.map((v, idx) => 
          idx === vertex ? { ...v, state: 'visiting' } : v
        );
        
        // Add to recursion stack
        recursionStack[vertex] = true;
        
        steps.push({
          vertices: [...verticesCopy],
          edges: [...edgesCopy],
          description: `Visiting vertex ${verticesCopy[vertex].name}. Adding to recursion stack.`,
          removedEdges: [...removedEdges]
        });
        
        // Check all adjacent vertices
        for (const neighbor of [...adjListCopy[vertex]]) {
          // Find the edge index
          const edgeIndex = edgesCopy.findIndex(e => 
            e.from === vertex && e.to === neighbor && e.state !== 'removed'
          );
          
          if (edgeIndex === -1) continue; // Skip removed edges
          
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
              removedEdges: [...removedEdges]
            });
            
            // Recursively check neighbor
            if (dfs(neighbor)) {
              cycleFound = true;
              // We continue the DFS even after finding a cycle, to find and remove all back edges
            }
          } 
          // If the neighbor is in the recursion stack, we found a cycle
          else if (recursionStack[neighbor]) {
            // Mark edge as a back edge that forms a cycle
            edgesCopy = edgesCopy.map((e, idx) => 
              idx === edgeIndex ? { ...e, state: 'back' } : e
            );
            
            // This edge should be removed to break the cycle
            const edgeToRemove = { ...edgesCopy[edgeIndex] };
            removedEdges.push(edgeToRemove);
            
            // Mark it as removed
            edgesCopy = edgesCopy.map((e, idx) => 
              idx === edgeIndex ? { ...e, state: 'removed' } : e
            );
            
            // Actually remove the edge from our working adjacency list
            adjListCopy[vertex] = adjListCopy[vertex].filter(adj => adj !== neighbor);
            
            steps.push({
              vertices: [...verticesCopy],
              edges: [...edgesCopy],
              description: `Cycle detected! Found back edge from ${verticesCopy[vertex].name} to ${verticesCopy[neighbor].name}. This edge will be removed to break the cycle.`,
              removedEdges: [...removedEdges]
            });
            
            cycleFound = true;
          }
        }
        
        // Mark current vertex as visited and remove from recursion stack
        verticesCopy = verticesCopy.map((v, idx) => 
          idx === vertex ? { ...v, state: 'visited' } : v
        );
        
        recursionStack[vertex] = false;
        
        steps.push({
          vertices: [...verticesCopy],
          edges: [...edgesCopy],
          description: `Finished exploring vertex ${verticesCopy[vertex].name}. Removing from recursion stack.`,
          removedEdges: [...removedEdges]
        });
        
        return cycleFound;
      };
      
      // Run DFS from each unvisited vertex
      let anyCycleFound = false;
      for (let i = 0; i < verticesCopy.length; i++) {
        if (verticesCopy[i].state === 'unvisited') {
          if (dfs(i)) {
            anyCycleFound = true;
          }
        }
      }
      
      return anyCycleFound;
    };
    
    // Iteratively remove back edges until no cycles remain
    let iterationCount = 0;
    const maxIterations = 5; // Limit iterations to avoid potential infinite loops
    
    while (findBackEdgesWithDFS() && iterationCount < maxIterations) {
      steps.push({
        vertices: [...verticesCopy],
        edges: [...edgesCopy],
        description: `Iteration ${iterationCount + 1} complete. Checking if there are still cycles in the graph.`,
        removedEdges: [...removedEdges]
      });
      
      iterationCount++;
    }
    
    // Mark remaining edges as permanent (part of the DAG)
    edgesCopy = edgesCopy.map(e => 
      e.state !== 'removed' ? { ...e, state: 'permanent' } : e
    );
    
    // Final step
    steps.push({
      vertices: [...verticesCopy],
      edges: [...edgesCopy],
      description: `Algorithm complete. Removed ${removedEdges.length} edge${removedEdges.length !== 1 ? 's' : ''} to break all cycles. The resulting graph is a Directed Acyclic Graph (DAG).`,
      removedEdges: [...removedEdges]
    });
    
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
    
    const { vertices: currentVertices, edges: currentEdges } = currentStepData;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    for (const edge of currentEdges) {
      // Skip removed edges
      if (edge.state === 'removed') continue;
      
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
          ctx.strokeStyle = '#E53E3E';
          break;
        case 'permanent':
          ctx.strokeStyle = '#38A169';
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
    
    // Draw removed edges with dashed lines
    for (const edge of currentEdges) {
      if (edge.state !== 'removed') continue;
      
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
      
      // Set dashed line for removed edges
      ctx.strokeStyle = '#F56565';
      ctx.setLineDash([4, 2]);
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Reset dash
      ctx.setLineDash([]);
    }
    
    // Draw vertices
    for (const vertex of currentVertices) {
      // Set vertex color based on state
      switch (vertex.state) {
        case 'unvisited':
          ctx.fillStyle = '#E2E8F0';
          break;
        case 'visiting':
          ctx.fillStyle = '#4299E1';
          break;
        case 'visited':
          ctx.fillStyle = '#2B6CB0';
          break;
        case 'sorted':
          ctx.fillStyle = '#38A169';
          break;
      }
      
      // Draw vertex circle
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw vertex border
      ctx.strokeStyle = '#2D3748';
      ctx.lineWidth = 1;
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
  
  // Reset and run algorithm when graph size changes
  useEffect(() => {
    generateGraph();
  }, [graphSize]);
  
  // Run algorithm when graph is generated
  useEffect(() => {
    if (vertices.length > 0 && edges.length > 0) {
      findMinimumFeedbackArcSet();
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
  
  // Current step information
  const currentStepData = steps[currentStep];
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms">
          <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Algorithms
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Minimum Edges to Remove to Break All Cycles</PageTitle>
        <Description>
          Learn how to find the minimum number of edges to remove from a directed graph to make it acyclic.
          This is known as the Feedback Arc Set problem, and it has many applications in scheduling, circuit design, and more.
        </Description>
      </PageHeader>
      
      <ControlsContainer>
        <Select 
          value={graphSize}
          onChange={(e) => setGraphSize(Number(e.target.value))}
        >
          <option value="4">4 Vertices</option>
          <option value="5">5 Vertices</option>
          <option value="6">6 Vertices</option>
          <option value="7">7 Vertices</option>
          <option value="8">8 Vertices</option>
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
            {currentStepData?.description || 'Initializing...'}
            
            {currentStepData?.removedEdges.length > 0 && (
              <RemovedEdgesContainer>
                <p><strong>Removed Edges:</strong></p>
                {currentStepData.removedEdges.map((edge, index) => (
                  <RemovedEdge key={index}>
                    {vertices[edge.from]?.name} → {vertices[edge.to]?.name}
                  </RemovedEdge>
                ))}
              </RemovedEdgesContainer>
            )}
          </InfoText>
          
          <InfoTitle>How It Works</InfoTitle>
          <InfoText>
            <p>The algorithm finds a minimum feedback arc set (FAS) - the smallest set of edges to remove to make a directed graph acyclic.</p>
            <p>Steps:</p>
            <ol>
              <li>Run a DFS to find back edges that form cycles.</li>
              <li>Remove those back edges to break cycles.</li>
              <li>Continue until no cycles remain.</li>
            </ol>
            <p>Color coding:</p>
            <ul>
              <li><span style={{ color: '#E2E8F0' }}>■</span> White: Unvisited vertices</li>
              <li><span style={{ color: '#4299E1' }}>■</span> Blue: Vertices currently being visited</li>
              <li><span style={{ color: '#2B6CB0' }}>■</span> Dark Blue: Visited vertices</li>
              <li><span style={{ color: '#A0AEC0' }}>➡</span> Gray: Normal edges</li>
              <li><span style={{ color: '#3182CE' }}>➡</span> Blue: Discovery edges</li>
              <li><span style={{ color: '#E53E3E' }}>➡</span> Red (solid): Back edges forming cycles</li>
              <li><span style={{ color: '#F56565' }}>- - -</span> Red (dashed): Removed edges</li>
              <li><span style={{ color: '#38A169' }}>➡</span> Green: Edges in the resulting DAG</li>
            </ul>
          </InfoText>
          
          <InfoTitle>Time and Space Complexity</InfoTitle>
          <InfoText>
            <p><strong>Time Complexity:</strong> O(V·(V+E)) where V is the number of vertices and E is the number of edges. This is because we may need to run DFS multiple times (up to V times in the worst case) to remove all cycles.</p>
            <p><strong>Space Complexity:</strong> O(V+E) for the graph representation and recursion stack.</p>
            <p>Note: Finding the minimum feedback arc set is actually NP-hard in general, so this greedy algorithm may not always give the optimal solution, but it works well in practice.</p>
          </InfoText>
          
          <InfoTitle>Applications</InfoTitle>
          <InfoText>
            <ul>
              <li><strong>Scheduling Problems:</strong> Converting cyclic dependencies into linear ordering</li>
              <li><strong>Circuit Design:</strong> Breaking feedback loops in electronic circuits</li>
              <li><strong>Dependency Resolution:</strong> Resolving circular dependencies in software packages</li>
              <li><strong>Deadlock Prevention:</strong> Breaking potential deadlocks in resource allocation</li>
              <li><strong>Tournament Rankings:</strong> Creating a consistent ranking from incomplete tournament results</li>
              <li><strong>Biology:</strong> Analyzing regulatory networks in gene expression</li>
            </ul>
          </InfoText>
        </InfoPanel>
      </GraphContainer>
    </PageContainer>
  );
};

export default MinimumEdgesFeedbackArcPage; 