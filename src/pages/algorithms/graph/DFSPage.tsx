import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward, FaRandom } from 'react-icons/fa';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Lazy load the SyntaxHighlighter for better performance
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'));

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

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textLight};
  max-width: 800px;
  line-height: 1.6;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 800px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.5rem;
  }
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

  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.8rem;
    
    svg {
      margin-right: 0.25rem;
    }
  }
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
  white-space: nowrap;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  width: 60px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
`;

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 800px;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 400px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.background};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const InfoText = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 0.5rem;
  line-height: 1.5;
  font-size: 0.9rem;
`;

const CodeContainer = styled.div`
  max-width: 800px;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-top: 1rem;
  width: 100%;
`;

const StackStateDisplay = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-family: monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
`;

interface Node {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  textColor: string;
  visited: boolean;
  inStack: boolean;
  processing: boolean;
  label: string;
}

interface Edge {
  source: number;
  target: number;
  weight: number;
  color: string;
}

interface Graph {
  nodes: Node[];
  edges: Edge[];
  adjacencyList: { [key: number]: number[] };
}

interface Step {
  currentNode: number | null;
  stack: number[];
  visited: number[];
  description: string;
  graph: Graph;
}

const DFSPage: React.FC = () => {
  const [graph, setGraph] = useState<Graph>({
    nodes: [],
    edges: [],
    adjacencyList: {}
  });
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  const [startNode, setStartNode] = useState<number>(0);
  const [nodeCount, setNodeCount] = useState<number>(8);
  const [stepInfo, setStepInfo] = useState<string>('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize the graph
  useEffect(() => {
    generateRandomGraph();
  }, [nodeCount]);
  
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
  
  // Update graph and info when step changes
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      setStepInfo(step.description);
      
      // Update graph
      renderGraph(step.graph);
    }
  }, [currentStep, steps]);
  
  // Render the graph on canvas
  const renderGraph = (graphToRender: Graph) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    graphToRender.edges.forEach(edge => {
      const source = graphToRender.nodes[edge.source];
      const target = graphToRender.nodes[edge.target];
      
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = edge.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw weight
      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;
      
      ctx.fillStyle = "#666";
      ctx.font = "12px Arial";
      ctx.fillText(edge.weight.toString(), midX, midY);
    });
    
    // Draw nodes
    graphToRender.nodes.forEach(node => {
      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw node label
      ctx.fillStyle = node.textColor;
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y);
    });
  };
  
  // Generate a random graph
  const generateRandomGraph = () => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const newAdjacencyList: { [key: number]: number[] } = {};
    
    // Generate nodes in a circle layout
    const centerX = 400;
    const centerY = 200;
    const radius = 150;
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      newNodes.push({
        id: i,
        x,
        y,
        radius: 20,
        color: "#fff",
        textColor: "#000",
        visited: false,
        inStack: false,
        processing: false,
        label: i.toString()
      });
      
      newAdjacencyList[i] = [];
    }
    
    // Generate random edges
    for (let i = 0; i < nodeCount; i++) {
      // Each node will have 2-3 random connections
      const numConnections = Math.floor(Math.random() * 2) + 2;
      
      for (let j = 0; j < numConnections; j++) {
        // Generate a random target node
        const target = Math.floor(Math.random() * nodeCount);
        
        // Skip self-loops and duplicate edges
        if (target === i || newAdjacencyList[i].includes(target)) {
          continue;
        }
        
        // Add edge
        const weight = Math.floor(Math.random() * 9) + 1;
        newEdges.push({
          source: i,
          target,
          weight,
          color: "#aaa"
        });
        
        // Update adjacency list
        newAdjacencyList[i].push(target);
        newAdjacencyList[target].push(i);
      }
    }
    
    // Create the graph
    const newGraph: Graph = {
      nodes: newNodes,
      edges: newEdges,
      adjacencyList: newAdjacencyList
    };
    
    setGraph(newGraph);
    renderGraph(newGraph);
    setSteps([]);
    setCurrentStep(0);
    setStepInfo('Graph initialized. Select a start node and click "Start" to begin DFS traversal.');
  };
  
  // Run DFS algorithm
  const runDFS = () => {
    if (graph.nodes.length === 0) return;
    
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    const steps: Step[] = [];
    const visited: number[] = [];
    const stack: number[] = [startNode];
    
    // Create a deep copy of the graph for the initial state
    const initialGraph = JSON.parse(JSON.stringify(graph)) as Graph;
    initialGraph.nodes[startNode].inStack = true;
    initialGraph.nodes[startNode].color = "#9c27b0"; // Stack node color (purple)
    
    steps.push({
      currentNode: null,
      stack: [...stack],
      visited: [...visited],
      description: `Added starting node ${startNode} to the stack.`,
      graph: initialGraph
    });
    
    while (stack.length > 0) {
      const currentNode = stack.pop()!;
      
      if (visited.includes(currentNode)) {
        continue;
      }
      
      visited.push(currentNode);
      
      // Create a new graph state with the current node as processing
      const processingGraph = JSON.parse(JSON.stringify(steps[steps.length - 1].graph)) as Graph;
      processingGraph.nodes[currentNode].processing = true;
      processingGraph.nodes[currentNode].inStack = false;
      processingGraph.nodes[currentNode].color = "#ff9900"; // Processing node color (orange)
      
      steps.push({
        currentNode,
        stack: [...stack],
        visited: [...visited],
        description: `Processing node ${currentNode}.`,
        graph: processingGraph
      });
      
      // Get neighbors of current node
      const neighbors = [...(graph.adjacencyList[currentNode] || [])];
      
      // Reverse to get correct DFS order (since we're using a stack)
      neighbors.reverse();
      
      for (const neighbor of neighbors) {
        if (!visited.includes(neighbor) && !stack.includes(neighbor)) {
          stack.push(neighbor);
          
          // Create a new graph state with the neighbor added to stack
          const neighborGraph = JSON.parse(JSON.stringify(steps[steps.length - 1].graph)) as Graph;
          neighborGraph.nodes[neighbor].inStack = true;
          neighborGraph.nodes[neighbor].color = "#9c27b0"; // Stack node color (purple)
          
          // Highlight the edge
          const edgeIndex = neighborGraph.edges.findIndex(
            e => (e.source === currentNode && e.target === neighbor) ||
                 (e.source === neighbor && e.target === currentNode)
          );
          
          if (edgeIndex !== -1) {
            neighborGraph.edges[edgeIndex].color = "#3498db"; // Highlighted edge color (blue)
          }
          
          steps.push({
            currentNode,
            stack: [...stack],
            visited: [...visited],
            description: `Added node ${neighbor} to the stack.`,
            graph: neighborGraph
          });
        }
      }
      
      // Mark current node as visited
      const visitedGraph = JSON.parse(JSON.stringify(steps[steps.length - 1].graph)) as Graph;
      visitedGraph.nodes[currentNode].visited = true;
      visitedGraph.nodes[currentNode].processing = false;
      visitedGraph.nodes[currentNode].color = "#4caf50"; // Visited node color (green)
      visitedGraph.nodes[currentNode].textColor = "#fff";
      
      steps.push({
        currentNode: null,
        stack: [...stack],
        visited: [...visited],
        description: `Marked node ${currentNode} as visited.`,
        graph: visitedGraph
      });
    }
    
    // Final step
    steps.push({
      currentNode: null,
      stack: [],
      visited,
      description: `DFS traversal complete. Visited nodes: ${visited.join(', ')}.`,
      graph: steps[steps.length - 1].graph
    });
    
    setSteps(steps);
    setCurrentStep(0);
  };
  
  // Control methods
  const startAnimation = () => {
    if (steps.length === 0) {
      runDFS();
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
    
    // Reset graph
    const resetGraph = JSON.parse(JSON.stringify(graph)) as Graph;
    resetGraph.nodes.forEach(node => {
      node.visited = false;
      node.inStack = false;
      node.processing = false;
      node.color = "#fff";
      node.textColor = "#000";
    });
    
    resetGraph.edges.forEach(edge => {
      edge.color = "#aaa";
    });
    
    renderGraph(resetGraph);
    setStepInfo('Reset. Click "Start" to begin DFS traversal.');
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
  
  const handleNodeCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    if (!isNaN(count) && count >= 3 && count <= 12) {
      setNodeCount(count);
    }
  };
  
  const handleStartNodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const node = parseInt(e.target.value, 10);
    setStartNode(node);
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnimationSpeed(parseInt(e.target.value, 10));
  };
  
  // DFS algorithm code
  const dfsCode = `/**
 * Performs Depth-First Search traversal on a graph
 * @param {Map<number, number[]>} graph - Adjacency list representation of the graph
 * @param {number} startNode - Node to start DFS from
 * @returns {number[]} - The order of visited nodes
 */
function dfs(graph, startNode) {
  // Array to store visited nodes in order
  const visited = [];
  
  // Set to keep track of visited nodes
  const visitedSet = new Set();
  
  // Stack for DFS (iterative implementation)
  const stack = [startNode];
  
  while (stack.length > 0) {
    // Pop the top node from the stack
    const currentNode = stack.pop();
    
    // Skip if already visited
    if (visitedSet.has(currentNode)) {
      continue;
    }
    
    // Mark as visited and add to result
    visitedSet.add(currentNode);
    visited.push(currentNode);
    
    // Get neighbors of the current node
    const neighbors = graph.get(currentNode) || [];
    
    // Add neighbors to stack in reverse order
    // (to process them in the original order when popped)
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      if (!visitedSet.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }
  
  return visited;
}

// Recursive DFS implementation
function dfsRecursive(graph, startNode) {
  const visited = [];
  const visitedSet = new Set();
  
  function explore(node) {
    // Mark the current node as visited
    visitedSet.add(node);
    visited.push(node);
    
    // Explore all unvisited neighbors
    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visitedSet.has(neighbor)) {
        explore(neighbor);
      }
    }
  }
  
  explore(startNode);
  return visited;
}

// Example usage:
const graph = new Map();
graph.set(0, [1, 2]);
graph.set(1, [0, 3, 4]);
graph.set(2, [0, 5]);
graph.set(3, [1]);
graph.set(4, [1, 6]);
graph.set(5, [2]);
graph.set(6, [4]);

const visitedOrder = dfs(graph, 0);
// Example output: DFS traversal order: [0, 2, 5, 1, 4, 6, 3]`;
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/graph">
          <FaArrowLeft /> Back to Graph Algorithms
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Depth-First Search (DFS)</PageTitle>
        <Description>
          Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking. 
          DFS uses a stack data structure (or recursion) for its implementation, which follows the Last-In-First-Out (LIFO) principle. 
          DFS is commonly used for cycle detection, topological sorting, finding connected components, and solving puzzles like mazes.
        </Description>
      </PageHeader>
      
      <InfoPanel>
        <InfoTitle>How DFS Works:</InfoTitle>
        <InfoText>1. Select a starting node, mark it as visited, and add it to a stack.</InfoText>
        <InfoText>2. Pop a node from the stack and explore all its unvisited adjacent nodes.</InfoText>
        <InfoText>3. For each unvisited neighbor, mark it, add it to the stack, and recursively apply step 2.</InfoText>
        <InfoText>4. Backtrack when all neighbors of a node have been visited.</InfoText>
        <InfoText>5. Repeat steps 2-4 until the stack is empty.</InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Graph Settings:</InfoTitle>
        <InputGroup>
          <Label>Number of Nodes:</Label>
          <Input 
            type="number" 
            min="3" 
            max="12" 
            value={nodeCount}
            onChange={handleNodeCountChange}
            disabled={isAnimating && !isPaused}
          />
          <Button onClick={generateRandomGraph} disabled={isAnimating && !isPaused}>
            <FaRandom /> Regenerate Graph
          </Button>
        </InputGroup>
        
        <InputGroup>
          <Label>Start Node:</Label>
          <Select value={startNode} onChange={handleStartNodeChange}>
            {Array.from({ length: nodeCount }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </Select>
        </InputGroup>
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
      
      {stepInfo && (
        <InfoPanel>
          <InfoTitle>Current Step:</InfoTitle>
          <InfoText>{stepInfo}</InfoText>
          
          {steps.length > 0 && currentStep < steps.length && (
            <div>
              <InfoText>
                <strong>Stack: </strong>
                {steps[currentStep].stack.length > 0 
                  ? `[${steps[currentStep].stack.join(', ')}]` 
                  : 'Empty'}
              </InfoText>
              <InfoText>
                <strong>Visited: </strong>
                {steps[currentStep].visited.length > 0 
                  ? `[${steps[currentStep].visited.join(', ')}]` 
                  : 'None'}
              </InfoText>
            </div>
          )}
        </InfoPanel>
      )}
      
      <GraphContainer>
        <Canvas ref={canvasRef} />
      </GraphContainer>
      
      <InfoPanel>
        <InfoTitle>DFS Algorithm Implementation:</InfoTitle>
        <CodeContainer>
          <Suspense fallback={<div>Loading code...</div>}>
            <SyntaxHighlighter language="javascript" style={vs2015}>
              {dfsCode}
            </SyntaxHighlighter>
          </Suspense>
        </CodeContainer>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Time & Space Complexity:</InfoTitle>
        <InfoText>
          <strong>Time Complexity:</strong> O(V + E) where V is the number of vertices and E is the number of edges in the graph.
          Each vertex and edge is visited once.
        </InfoText>
        <InfoText>
          <strong>Space Complexity:</strong> O(V) where V is the number of vertices. This is needed for the stack (or recursion stack) and visited set.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications of DFS:</InfoTitle>
        <InfoText>• Cycle detection in graphs</InfoText>
        <InfoText>• Topological sorting for DAGs (Directed Acyclic Graphs)</InfoText>
        <InfoText>• Finding strongly connected components in directed graphs</InfoText>
        <InfoText>• Solving puzzles such as mazes</InfoText>
        <InfoText>• Generating spanning trees</InfoText>
        <InfoText>• Pathfinding in games</InfoText>
        <InfoText>• Analyzing and traversing file systems</InfoText>
      </InfoPanel>
    </PageContainer>
  );
};

export default DFSPage; 