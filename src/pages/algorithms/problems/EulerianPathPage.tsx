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
  visited: boolean;
}

interface Graph {
  vertices: Vertex[];
  edges: Edge[];
}

interface Step {
  edges: Edge[];
  currentPath: number[];
  description: string;
}

const EulerianPathPage: React.FC = () => {
  const [graph, setGraph] = useState<Graph>({ vertices: [], edges: [] });
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  const [graphType, setGraphType] = useState<string>("circuit");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize graph
  useEffect(() => {
    generateRandomGraph();
  }, [graphType]);
  
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
  
  // Generate a random graph with Eulerian properties
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
    
    // Create edges to ensure Eulerian properties
    if (graphType === "circuit") {
      // For Eulerian Circuit: all vertices must have even degree
      createEulerianCircuit(vertices, edges);
    } else {
      // For Eulerian Path: exactly 2 vertices have odd degree
      createEulerianPath(vertices, edges);
    }
    
    setGraph({ vertices, edges });
    setSteps([]);
    setCurrentStep(0);
  };
  
  // Create a graph with an Eulerian Circuit
  const createEulerianCircuit = (vertices: Vertex[], edges: Edge[]) => {
    // First, connect vertices in a cycle
    for (let i = 0; i < vertices.length; i++) {
      const from = i;
      const to = (i + 1) % vertices.length;
      edges.push({ from, to, visited: false });
    }
    
    // Add more random edges to maintain even degree
    const maxExtraEdges = 6;
    let extraEdgesCount = 0;
    
    while (extraEdgesCount < maxExtraEdges) {
      const from = Math.floor(Math.random() * vertices.length);
      const to = Math.floor(Math.random() * vertices.length);
      
      // Don't create self-loops or duplicate edges
      if (from !== to && !edges.some(e => 
        (e.from === from && e.to === to) || 
        (e.from === to && e.to === from)
      )) {
        edges.push({ from, to, visited: false });
        extraEdgesCount += 2; // Add two edges at a time to maintain even degree
        edges.push({ from: (from + 2) % vertices.length, to: (to + 2) % vertices.length, visited: false });
      }
    }
  };
  
  // Create a graph with an Eulerian Path (not a circuit)
  const createEulerianPath = (vertices: Vertex[], edges: Edge[]) => {
    // Choose two vertices to have odd degree
    const oddVertex1 = 0;
    const oddVertex2 = 3;
    
    // First, connect vertices in a path (not a cycle)
    for (let i = 0; i < vertices.length - 1; i++) {
      const from = i;
      const to = i + 1;
      edges.push({ from, to, visited: false });
    }
    
    // Add more random edges to maintain even degree for all except the odd vertices
    const maxExtraEdges = 6;
    let extraEdgesCount = 0;
    
    while (extraEdgesCount < maxExtraEdges) {
      const from = Math.floor(Math.random() * vertices.length);
      const to = Math.floor(Math.random() * vertices.length);
      
      // Don't create self-loops or duplicate edges
      if (from !== to && !edges.some(e => 
        (e.from === from && e.to === to) || 
        (e.from === to && e.to === from)
      )) {
        edges.push({ from, to, visited: false });
        extraEdgesCount++;
      }
    }
    
    // Ensure oddVertex1 and oddVertex2 have odd degree
    const degree = new Array(vertices.length).fill(0);
    edges.forEach(edge => {
      degree[edge.from]++;
      degree[edge.to]++;
    });
    
    // Adjust degrees to ensure exactly two vertices have odd degree
    for (let i = 0; i < vertices.length; i++) {
      if ((i === oddVertex1 || i === oddVertex2) && degree[i] % 2 === 0) {
        // Make odd
        const to = (i + 1) % vertices.length;
        edges.push({ from: i, to, visited: false });
      } else if (i !== oddVertex1 && i !== oddVertex2 && degree[i] % 2 === 1) {
        // Make even
        const to = (i + 2) % vertices.length;
        edges.push({ from: i, to, visited: false });
      }
    }
  };
  
  // Find Eulerian Path or Circuit
  const findEulerianPath = () => {
    if (graph.vertices.length === 0 || graph.edges.length === 0) return;
    
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    const steps: Step[] = [];
    const edgesCopy = graph.edges.map(edge => ({ ...edge, visited: false }));
    
    // Create adjacency list
    const adjList: number[][] = Array(graph.vertices.length).fill(0).map(() => []);
    edgesCopy.forEach((edge, index) => {
      adjList[edge.from].push(edge.to);
      adjList[edge.to].push(edge.from); // Assuming undirected graph
    });
    
    // Count degrees
    const degree = adjList.map(neighbors => neighbors.length);
    
    // Find starting vertex
    let startVertex = 0;
    if (graphType === "path") {
      // Start from a vertex with odd degree
      for (let i = 0; i < degree.length; i++) {
        if (degree[i] % 2 === 1) {
          startVertex = i;
          break;
        }
      }
    }
    
    // Initial step
    steps.push({
      edges: [...edgesCopy],
      currentPath: [startVertex],
      description: `Starting from vertex ${graph.vertices[startVertex].name}.`
    });
    
    const path: number[] = [];
    const edgeVisited: boolean[] = Array(edgesCopy.length).fill(false);
    
    // Hierholzer's algorithm (iterative approach)
    const findPath = (start: number) => {
      const stack: number[] = [start];
      const currentPath: number[] = [];
      
      while (stack.length > 0) {
        const vertex = stack[stack.length - 1];
        
        // Find an unvisited edge
        let found = false;
        for (let i = 0; i < edgesCopy.length; i++) {
          const edge = edgesCopy[i];
          if (edgeVisited[i]) continue;
          
          if (edge.from === vertex || edge.to === vertex) {
            const nextVertex = edge.from === vertex ? edge.to : edge.from;
            
            // Mark edge as visited
            edgeVisited[i] = true;
            edgesCopy[i].visited = true;
            
            stack.push(nextVertex);
            
            steps.push({
              edges: [...edgesCopy],
              currentPath: [...stack],
              description: `Visiting edge ${graph.vertices[vertex].name}-${graph.vertices[nextVertex].name}.`
            });
            
            found = true;
            break;
          }
        }
        
        if (!found) {
          // No unvisited edges, backtrack
          currentPath.push(stack.pop()!);
          
          if (stack.length > 0) {
            steps.push({
              edges: [...edgesCopy],
              currentPath: [...stack],
              description: `Backtracking to vertex ${graph.vertices[stack[stack.length - 1]].name}.`
            });
          }
        }
      }
      
      return currentPath.reverse();
    };
    
    const eulerianPath = findPath(startVertex);
    
    // Final step
    steps.push({
      edges: [...edgesCopy],
      currentPath: eulerianPath,
      description: `Found ${graphType === "circuit" ? "Eulerian Circuit" : "Eulerian Path"}: ${eulerianPath.map(v => graph.vertices[v].name).join(" → ")}`
    });
    
    setSteps(steps);
    setCurrentStep(0);
  };
  
  // Render the graph on canvas
  const renderGraph = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    graph.edges.forEach((edge, index) => {
      const from = graph.vertices[edge.from];
      const to = graph.vertices[edge.to];
      
      let isHighlighted = false;
      let isCurrentEdge = false;
      
      if (steps.length > 0 && currentStep < steps.length) {
        isHighlighted = steps[currentStep].edges[index].visited;
        
        // Check if it's the current edge being traversed
        if (currentStep > 0 && steps[currentStep].edges[index].visited && !steps[currentStep - 1].edges[index].visited) {
          isCurrentEdge = true;
        }
      }
      
      ctx.beginPath();
      ctx.strokeStyle = isCurrentEdge ? '#ff9800' : isHighlighted ? '#4caf50' : '#aaaaaa';
      ctx.lineWidth = isCurrentEdge ? 4 : 2;
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      
      // Draw edge direction (small arrow in the middle)
      const dirX = (to.x - from.x) / 2;
      const dirY = (to.y - from.y) / 2;
      const arrowLength = 10;
      const angle = Math.atan2(dirY, dirX);
      
      const midX = from.x + dirX;
      const midY = from.y + dirY;
      
      // Draw small circle at midpoint
      ctx.beginPath();
      ctx.fillStyle = isCurrentEdge ? '#ff9800' : isHighlighted ? '#4caf50' : '#aaaaaa';
      ctx.arc(midX, midY, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw vertices
    graph.vertices.forEach((vertex, index) => {
      let isHighlighted = false;
      let isCurrent = false;
      
      if (steps.length > 0 && currentStep < steps.length) {
        const path = steps[currentStep].currentPath;
        isHighlighted = path.includes(vertex.id);
        isCurrent = path[path.length - 1] === vertex.id;
      }
      
      ctx.beginPath();
      ctx.fillStyle = isCurrent ? '#ff9800' : isHighlighted ? '#4caf50' : '#2196f3';
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
      findEulerianPath();
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
  
  const handleGraphTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGraphType(e.target.value);
  };
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/problems">
          <FaArrowLeft /> Back to Problems
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Eulerian Path and Circuit</PageTitle>
        <Description>
          An Eulerian Path is a path in a graph that visits every edge exactly once.
          An Eulerian Circuit is an Eulerian Path that starts and ends at the same vertex.
        </Description>
      </PageHeader>
      
      <InfoPanel>
        <InfoTitle>How Eulerian Path/Circuit Works:</InfoTitle>
        <InfoText>1. For a graph to have an Eulerian Path, either all vertices have even degree, or exactly two vertices have odd degree.</InfoText>
        <InfoText>2. For a graph to have an Eulerian Circuit, all vertices must have even degree.</InfoText>
        <InfoText>3. Hierholzer's algorithm is used to find the Eulerian Path or Circuit.</InfoText>
        <InfoText>4. The algorithm maintains a current path and extends it until no more edges can be traversed.</InfoText>
      </InfoPanel>
      
      <ControlsContainer>
        <Select value={graphType} onChange={handleGraphTypeChange}>
          <option value="circuit">Eulerian Circuit</option>
          <option value="path">Eulerian Path</option>
        </Select>
        
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
          <InfoText>
            <strong>Current Path: </strong>
            {steps[currentStep].currentPath.map(v => graph.vertices[v].name).join(" → ")}
          </InfoText>
        </InfoPanel>
      )}
      
      <InfoPanel>
        <InfoTitle>Time & Space Complexity:</InfoTitle>
        <InfoText>
          <strong>Time Complexity:</strong> O(E) where E is the number of edges.
        </InfoText>
        <InfoText>
          <strong>Space Complexity:</strong> O(V + E) for the adjacency list and visited edges.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications of Eulerian Path/Circuit:</InfoTitle>
        <InfoText>• Postal delivery route planning (Chinese Postman Problem)</InfoText>
        <InfoText>• Circuit design and testing in electronics</InfoText>
        <InfoText>• DNA fragment assembly in bioinformatics</InfoText>
        <InfoText>• Network flow and routing</InfoText>
        <InfoText>• Solving maze puzzles</InfoText>
      </InfoPanel>
    </PageContainer>
  );
};

export default EulerianPathPage; 