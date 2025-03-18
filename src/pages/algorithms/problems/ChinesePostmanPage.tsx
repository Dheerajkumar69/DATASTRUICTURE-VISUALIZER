import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward, FaRandom } from 'react-icons/fa';

// Styled components
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
  
  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  border-radius: 0.5rem;
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

interface Vertex {
  id: number;
  x: number;
  y: number;
  name: string;
}

interface Edge {
  from: number;
  to: number;
  weight: number;
  visited: boolean;
  duplicated: boolean;
}

interface Graph {
  vertices: Vertex[];
  edges: Edge[];
}

interface Step {
  edges: Edge[];
  currentPath: number[];
  description: string;
  currentStep: string;
  totalDistance: number;
}

const ChinesePostmanPage: React.FC = () => {
  const [graph, setGraph] = useState<Graph>({ vertices: [], edges: [] });
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize graph
  useEffect(() => {
    generateRandomGraph();
  }, []);
  
  // Setup canvas and render
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        renderGraph(ctx);
      }
    }
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
  
  // Generate a random graph with some odd-degree vertices
  const generateRandomGraph = () => {
    const vertices: Vertex[] = [];
    const edges: Edge[] = [];
    
    // Create vertices in a circular pattern
    const numVertices = 6;
    const centerX = 300;
    const centerY = 200;
    const radius = 150;
    
    for (let i = 0; i < numVertices; i++) {
      const angle = (2 * Math.PI * i) / numVertices;
      vertices.push({
        id: i,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        name: String.fromCharCode(65 + i) // A, B, C, ...
      });
    }
    
    // Create edges to ensure some odd-degree vertices
    // First, connect vertices in a cycle
    for (let i = 0; i < vertices.length; i++) {
      const from = i;
      const to = (i + 1) % vertices.length;
      const dx = vertices[from].x - vertices[to].x;
      const dy = vertices[from].y - vertices[to].y;
      const weight = Math.round(Math.sqrt(dx * dx + dy * dy) / 10);
      
      edges.push({ 
        from, 
        to, 
        weight,
        visited: false,
        duplicated: false
      });
    }
    
    // Add a few more random edges
    const additionalEdges = 2;
    for (let i = 0; i < additionalEdges; i++) {
      const from = Math.floor(Math.random() * vertices.length);
      let to = Math.floor(Math.random() * vertices.length);
      
      // Avoid self-loops and existing edges
      while (
        from === to || 
        edges.some(e => 
          (e.from === from && e.to === to) || 
          (e.from === to && e.to === from)
        )
      ) {
        to = Math.floor(Math.random() * vertices.length);
      }
      
      const dx = vertices[from].x - vertices[to].x;
      const dy = vertices[from].y - vertices[to].y;
      const weight = Math.round(Math.sqrt(dx * dx + dy * dy) / 10);
      
      edges.push({ 
        from, 
        to, 
        weight,
        visited: false,
        duplicated: false
      });
    }
    
    setGraph({ vertices, edges });
    setSteps([]);
    setCurrentStep(0);
  };
  
  // Solve the Chinese Postman Problem
  const solveChinesePostman = () => {
    if (graph.vertices.length === 0 || graph.edges.length === 0) return;
    
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    const steps: Step[] = [];
    const edgesCopy = graph.edges.map(edge => ({ ...edge, visited: false, duplicated: false }));
    
    // Step 1: Find vertices with odd degree
    const degree: number[] = Array(graph.vertices.length).fill(0);
    edgesCopy.forEach(edge => {
      degree[edge.from]++;
      degree[edge.to]++;
    });
    
    const oddVertices = degree
      .map((deg, idx) => ({ id: idx, degree: deg }))
      .filter(v => v.degree % 2 === 1)
      .map(v => v.id);
    
    steps.push({
      edges: [...edgesCopy],
      currentPath: [],
      description: `Step 1: Identify vertices with odd degree.`,
      currentStep: `Found ${oddVertices.length} vertices with odd degree: ${oddVertices.map(v => graph.vertices[v].name).join(', ')}`,
      totalDistance: 0
    });
    
    // If graph is Eulerian (no odd-degree vertices), skip to Eulerian circuit
    if (oddVertices.length === 0) {
      steps.push({
        edges: [...edgesCopy],
        currentPath: [],
        description: `The graph already has an Eulerian circuit, so no additional edges are needed.`,
        currentStep: `Since all vertices have even degree, we can find an Eulerian circuit directly.`,
        totalDistance: calculateTotalWeight(edgesCopy)
      });
    } else {
      // Step A: Calculate all-pairs shortest paths using Floyd-Warshall
      steps.push({
        edges: [...edgesCopy],
        currentPath: [],
        description: `Step 2: Calculate shortest paths between odd-degree vertices.`,
        currentStep: `Using Floyd-Warshall algorithm to find all-pairs shortest paths.`,
        totalDistance: calculateTotalWeight(edgesCopy)
      });
      
      const { dist, next } = floydWarshall(graph.vertices.length, edgesCopy);
      
      // Step B: Find minimum weight perfect matching for odd-degree vertices
      steps.push({
        edges: [...edgesCopy],
        currentPath: [],
        description: `Step 3: Find minimum-weight perfect matching for odd-degree vertices.`,
        currentStep: `Using a greedy approach to match odd-degree vertices.`,
        totalDistance: calculateTotalWeight(edgesCopy)
      });
      
      // Simple greedy matching for demonstration
      const matchedEdges: { from: number; to: number; weight: number }[] = [];
      const unmatched = [...oddVertices];
      
      while (unmatched.length > 0) {
        const v1 = unmatched.pop()!;
        let minDist = Infinity;
        let bestMatch = -1;
        
        for (let i = 0; i < unmatched.length; i++) {
          const v2 = unmatched[i];
          if (dist[v1][v2] < minDist) {
            minDist = dist[v1][v2];
            bestMatch = i;
          }
        }
        
        if (bestMatch !== -1) {
          const v2 = unmatched[bestMatch];
          unmatched.splice(bestMatch, 1);
          
          // Reconstruct shortest path between v1 and v2
          const pathEdges = reconstructPath(v1, v2, next, dist);
          matchedEdges.push(...pathEdges);
          
          steps.push({
            edges: [...edgesCopy],
            currentPath: [],
            description: `Matching vertices ${graph.vertices[v1].name} and ${graph.vertices[v2].name}.`,
            currentStep: `Adding shortest path between vertices, distance: ${dist[v1][v2]}`,
            totalDistance: calculateTotalWeight(edgesCopy)
          });
        }
      }
      
      // Add duplicated edges to graph
      for (const matchedEdge of matchedEdges) {
        // Find the original edge or add a duplicate
        const existingEdgeIndex = edgesCopy.findIndex(
          e => (e.from === matchedEdge.from && e.to === matchedEdge.to) ||
               (e.from === matchedEdge.to && e.to === matchedEdge.from)
        );
        
        if (existingEdgeIndex !== -1) {
          // Duplicate existing edge
          edgesCopy.push({
            ...edgesCopy[existingEdgeIndex],
            duplicated: true
          });
        } else {
          // This is a sequence of edges forming a path, add them individually
          edgesCopy.push({
            from: matchedEdge.from,
            to: matchedEdge.to,
            weight: matchedEdge.weight,
            visited: false,
            duplicated: true
          });
        }
      }
      
      steps.push({
        edges: [...edgesCopy],
        currentPath: [],
        description: `Step 4: Add duplicate edges to balance the graph.`,
        currentStep: `Added ${matchedEdges.length} duplicate edges to make all vertices have even degree.`,
        totalDistance: calculateTotalWeight(edgesCopy)
      });
    }
    
    // Step C: Find Eulerian Circuit in the modified graph
    steps.push({
      edges: [...edgesCopy],
      currentPath: [],
      description: `Step 5: Find an Eulerian circuit in the modified graph.`,
      currentStep: `Using Hierholzer's algorithm to find the circuit.`,
      totalDistance: calculateTotalWeight(edgesCopy)
    });
    
    // Find Eulerian Circuit using Hierholzer's algorithm
    const circuit = findEulerianCircuit(graph.vertices.length, edgesCopy);
    
    // Mark all edges as visited in the final step
    const finalEdges = edgesCopy.map(edge => ({ ...edge, visited: true }));
    
    steps.push({
      edges: [...finalEdges],
      currentPath: circuit,
      description: `Final Chinese Postman tour.`,
      currentStep: `Total distance: ${calculateTotalWeight(finalEdges)}`,
      totalDistance: calculateTotalWeight(finalEdges)
    });
    
    setSteps(steps);
    setCurrentStep(0);
  };
  
  // Calculate total weight of all edges
  const calculateTotalWeight = (edges: Edge[]): number => {
    return edges.reduce((total, edge) => total + edge.weight, 0);
  };
  
  // Floyd-Warshall algorithm for all-pairs shortest paths
  const floydWarshall = (numVertices: number, edges: Edge[]) => {
    // Initialize distance matrix
    const dist: number[][] = Array(numVertices)
      .fill(0)
      .map(() => Array(numVertices).fill(Infinity));
    
    // Initialize next vertex matrix for path reconstruction
    const next: number[][] = Array(numVertices)
      .fill(0)
      .map(() => Array(numVertices).fill(-1));
    
    // Set diagonal to 0
    for (let i = 0; i < numVertices; i++) {
      dist[i][i] = 0;
    }
    
    // Set edge weights
    for (const edge of edges) {
      dist[edge.from][edge.to] = edge.weight;
      dist[edge.to][edge.from] = edge.weight; // Assuming undirected graph
      
      next[edge.from][edge.to] = edge.to;
      next[edge.to][edge.from] = edge.from;
    }
    
    // Floyd-Warshall algorithm
    for (let k = 0; k < numVertices; k++) {
      for (let i = 0; i < numVertices; i++) {
        for (let j = 0; j < numVertices; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            next[i][j] = next[i][k];
          }
        }
      }
    }
    
    return { dist, next };
  };
  
  // Reconstruct path from next matrix
  const reconstructPath = (
    start: number,
    end: number,
    next: number[][],
    dist: number[][]
  ): { from: number; to: number; weight: number }[] => {
    if (next[start][end] === -1) return [];
    
    const path: number[] = [start];
    let current = start;
    
    while (current !== end) {
      current = next[current][end];
      path.push(current);
    }
    
    // Convert path to edges
    const edges: { from: number; to: number; weight: number }[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      edges.push({
        from: path[i],
        to: path[i + 1],
        weight: dist[path[i]][path[i + 1]]
      });
    }
    
    return edges;
  };
  
  // Find Eulerian Circuit in the graph
  const findEulerianCircuit = (numVertices: number, edges: Edge[]): number[] => {
    // Create adjacency list
    const adjList: Array<Array<{ to: number; edgeIndex: number }>> = 
      Array(numVertices).fill(0).map(() => []);
    
    edges.forEach((edge, idx) => {
      adjList[edge.from].push({ to: edge.to, edgeIndex: idx });
      adjList[edge.to].push({ to: edge.from, edgeIndex: idx });
    });
    
    // Hierholzer's algorithm
    const circuit: number[] = [];
    const stack: number[] = [0]; // Start from vertex 0
    const edgeUsed: boolean[] = Array(edges.length).fill(false);
    
    while (stack.length > 0) {
      const v = stack[stack.length - 1];
      
      // Find an unused edge
      let foundEdge = false;
      for (let i = 0; i < adjList[v].length; i++) {
        const { to, edgeIndex } = adjList[v][i];
        
        if (!edgeUsed[edgeIndex]) {
          edgeUsed[edgeIndex] = true;
          stack.push(to);
          foundEdge = true;
          break;
        }
      }
      
      if (!foundEdge) {
        circuit.push(stack.pop()!);
      }
    }
    
    return circuit.reverse();
  };
  
  // Render the graph on canvas
  const renderGraph = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    graph.edges.forEach((edge, index) => {
      let isVisited = false;
      let isDuplicated = false;
      
      if (steps.length > 0 && currentStep < steps.length && index < steps[currentStep].edges.length) {
        isVisited = steps[currentStep].edges[index].visited;
        isDuplicated = steps[currentStep].edges[index].duplicated;
      } else if (index < graph.edges.length) {
        isDuplicated = edge.duplicated;
      }
      
      const from = graph.vertices[edge.from];
      const to = graph.vertices[edge.to];
      
      // Calculate offset for duplicated edges
      const offsetX = isDuplicated ? (to.y - from.y) * 0.1 : 0;
      const offsetY = isDuplicated ? (from.x - to.x) * 0.1 : 0;
      
      ctx.beginPath();
      ctx.strokeStyle = isVisited ? '#4caf50' : isDuplicated ? '#ff9800' : '#aaaaaa';
      ctx.lineWidth = 2;
      
      // Draw curved path for duplicated edges
      if (isDuplicated) {
        ctx.moveTo(from.x, from.y);
        const midX = (from.x + to.x) / 2 + offsetX;
        const midY = (from.y + to.y) / 2 + offsetY;
        ctx.quadraticCurveTo(midX, midY, to.x, to.y);
      } else {
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
      }
      
      ctx.stroke();
      
      // Draw edge weight
      const weightX = (from.x + to.x) / 2 + offsetX;
      const weightY = (from.y + to.y) / 2 + offsetY;
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(weightX, weightY, 10, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(edge.weight.toString(), weightX, weightY);
    });
    
    // Draw vertices
    graph.vertices.forEach(vertex => {
      const isInPath = steps.length > 0 &&
        currentStep < steps.length &&
        steps[currentStep].currentPath.includes(vertex.id);
      
      ctx.beginPath();
      ctx.fillStyle = isInPath ? '#4caf50' : '#2196f3';
      ctx.arc(vertex.x, vertex.y, 20, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw vertex name
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(vertex.name, vertex.x, vertex.y);
    });
  };
  
  // Control methods
  const startAnimation = () => {
    if (steps.length === 0) {
      solveChinesePostman();
    }
    setIsAnimating(true);
    setIsPaused(false);
  };
  
  const pauseAnimation = () => {
    setIsPaused(true);
  };
  
  const resetAnimation = () => {
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    generateRandomGraph();
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
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnimationSpeed(parseInt(e.target.value, 10));
  };
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/problems">
          <FaArrowLeft /> Back to Problems
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Chinese Postman Problem</PageTitle>
        <Description>
          The Chinese Postman Problem (also known as the Route Inspection Problem) aims to find the shortest
          route that visits every edge of a graph at least once, returning to the starting point.
        </Description>
      </PageHeader>
      
      <InfoPanel>
        <InfoTitle>How Chinese Postman Problem Works:</InfoTitle>
        <InfoText>1. If all vertices have even degree, the graph has an Eulerian circuit, which is the optimal solution.</InfoText>
        <InfoText>2. If some vertices have odd degree, identify them and compute the shortest paths between each pair.</InfoText>
        <InfoText>3. Find a minimum-weight perfect matching for the odd-degree vertices.</InfoText>
        <InfoText>4. Add duplicate edges to the graph according to the matching.</InfoText>
        <InfoText>5. Find an Eulerian circuit in the resulting graph.</InfoText>
      </InfoPanel>
      
      <ControlsContainer>
        <Select value={animationSpeed} onChange={handleSpeedChange}>
          <option value="1000">Slow</option>
          <option value="500">Medium</option>
          <option value="200">Fast</option>
        </Select>
        
        {!isAnimating || isPaused ? (
          <Button onClick={startAnimation}>
            <FaPlay /> {isPaused ? 'Resume' : 'Start'}
          </Button>
        ) : (
          <Button onClick={pauseAnimation}>
            <FaPause /> Pause
          </Button>
        )}
        
        <Button onClick={stepBackward} disabled={currentStep === 0 || (isAnimating && !isPaused)}>
          <FaStepBackward /> Back
        </Button>
        
        <Button onClick={stepForward} disabled={currentStep >= steps.length - 1 || (isAnimating && !isPaused)}>
          <FaStepForward /> Forward
        </Button>
        
        <Button onClick={resetAnimation} disabled={isAnimating && !isPaused}>
          <FaUndo /> Reset
        </Button>
      </ControlsContainer>
      
      <GraphContainer>
        <CanvasContainer>
          <Canvas 
            ref={canvasRef} 
            width={600} 
            height={400}
          />
        </CanvasContainer>
      </GraphContainer>
      
      {steps.length > 0 && currentStep < steps.length && (
        <InfoPanel>
          <InfoTitle>Current Step:</InfoTitle>
          <InfoText>{steps[currentStep].description}</InfoText>
          <InfoText>{steps[currentStep].currentStep}</InfoText>
          {steps[currentStep].totalDistance > 0 && (
            <InfoText>
              <strong>Total Distance: </strong>
              {steps[currentStep].totalDistance}
            </InfoText>
          )}
        </InfoPanel>
      )}
      
      <InfoPanel>
        <InfoTitle>Time & Space Complexity:</InfoTitle>
        <InfoText>
          <strong>Time Complexity:</strong> O(V³) where V is the number of vertices, dominated by the Floyd-Warshall algorithm.
        </InfoText>
        <InfoText>
          <strong>Space Complexity:</strong> O(V² + E) for the distance matrix and the graph representation.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications of Chinese Postman Problem:</InfoTitle>
        <InfoText>• Mail delivery and route planning for postal services</InfoText>
        <InfoText>• Street sweeping and snow removal</InfoText>
        <InfoText>• Garbage collection</InfoText>
        <InfoText>• Network maintenance and inspection</InfoText>
        <InfoText>• DNA sequencing</InfoText>
      </InfoPanel>
    </PageContainer>
  );
};

export default ChinesePostmanPage; 