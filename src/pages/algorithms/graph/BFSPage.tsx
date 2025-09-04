import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward, FaRandom } from 'react-icons/fa';

// Lazy load the SyntaxHighlighter for better performance
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'));
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  width: 60px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
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
<<<<<<< HEAD
<<<<<<< HEAD
  transition: all 0.3s ease;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 1rem;
  box-shadow: ${props => props.theme.shadows.sm};
=======
=======
>>>>>>> parent of 5badfa4 (version 4.0.0)
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
  max-width: 800px;
  width: 100%;
<<<<<<< HEAD
>>>>>>> parent of 5badfa4 (version 4.0.0)
=======
>>>>>>> parent of 5badfa4 (version 4.0.0)
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

const QueueStateDisplay = styled.div`
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
  queued: boolean;
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
  queue: number[];
  visited: number[];
  description: string;
  graph: Graph;
}

const BFSPage: React.FC = () => {
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
        queued: false,
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
    setStepInfo('Graph initialized. Select a start node and click "Start" to begin BFS traversal.');
  };
  
  // Run BFS algorithm
  const runBFS = () => {
    if (graph.nodes.length === 0) return;
    
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    const steps: Step[] = [];
    const visited: number[] = [];
    const queue: number[] = [startNode];
    
    // Create a deep copy of the graph for the initial state
    const initialGraph = JSON.parse(JSON.stringify(graph)) as Graph;
    initialGraph.nodes[startNode].queued = true;
    initialGraph.nodes[startNode].color = "#ffcc00"; // Queued node color
    
    steps.push({
      currentNode: null,
      queue: [...queue],
      visited: [...visited],
      description: `Added starting node ${startNode} to the queue.`,
      graph: initialGraph
    });
    
    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      visited.push(currentNode);
      
      // Create a new graph state with the current node as processing
      const processingGraph = JSON.parse(JSON.stringify(steps[steps.length - 1].graph)) as Graph;
      processingGraph.nodes[currentNode].processing = true;
      processingGraph.nodes[currentNode].queued = false;
      processingGraph.nodes[currentNode].color = "#ff9900"; // Processing node color
      
      steps.push({
        currentNode,
        queue: [...queue],
        visited: [...visited],
        description: `Processing node ${currentNode}.`,
        graph: processingGraph
      });
      
      // Get neighbors of current node
      const neighbors = graph.adjacencyList[currentNode] || [];
      
      for (const neighbor of neighbors) {
        if (!visited.includes(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor);
          
          // Create a new graph state with the neighbor added to queue
          const neighborGraph = JSON.parse(JSON.stringify(steps[steps.length - 1].graph)) as Graph;
          neighborGraph.nodes[neighbor].queued = true;
          neighborGraph.nodes[neighbor].color = "#ffcc00"; // Queued node color
          
          // Highlight the edge
          const edgeIndex = neighborGraph.edges.findIndex(
            e => (e.source === currentNode && e.target === neighbor) ||
                 (e.source === neighbor && e.target === currentNode)
          );
          
          if (edgeIndex !== -1) {
            neighborGraph.edges[edgeIndex].color = "#3498db"; // Highlighted edge color
          }
          
          steps.push({
            currentNode,
            queue: [...queue],
            visited: [...visited],
            description: `Added node ${neighbor} to the queue.`,
            graph: neighborGraph
          });
        }
      }
      
      // Mark current node as visited
      const visitedGraph = JSON.parse(JSON.stringify(steps[steps.length - 1].graph)) as Graph;
      visitedGraph.nodes[currentNode].visited = true;
      visitedGraph.nodes[currentNode].processing = false;
      visitedGraph.nodes[currentNode].color = "#4caf50"; // Visited node color
      visitedGraph.nodes[currentNode].textColor = "#fff";
      
      steps.push({
        currentNode: null,
        queue: [...queue],
        visited: [...visited],
        description: `Marked node ${currentNode} as visited.`,
        graph: visitedGraph
      });
    }
    
    // Final step
    steps.push({
      currentNode: null,
      queue: [],
      visited,
      description: `BFS traversal complete. Visited nodes: ${visited.join(', ')}.`,
      graph: steps[steps.length - 1].graph
    });
    
    setSteps(steps);
    setCurrentStep(0);
  };
  
  // Control methods
  const startAnimation = () => {
    if (steps.length === 0) {
      runBFS();
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
      node.queued = false;
      node.processing = false;
      node.color = "#fff";
      node.textColor = "#000";
    });
    
    resetGraph.edges.forEach(edge => {
      edge.color = "#aaa";
    });
    
    renderGraph(resetGraph);
    setStepInfo('Reset. Click "Start" to begin BFS traversal.');
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
  
  // BFS algorithm code
  const bfsCode = `/**
 * Performs Breadth-First Search traversal on a graph
 * @param {Map<number, number[]>} graph - Adjacency list representation of the graph
 * @param {number} startNode - Node to start BFS from
 * @returns {number[]} - The order of visited nodes
 */
function bfs(graph, startNode) {
  // Array to store visited nodes in order
  const visited = [];
  
  // Queue for BFS, starting with the initial node
  const queue = [startNode];
  
  // Set to keep track of visited nodes
  const visitedSet = new Set([startNode]);
  
  // Continue until the queue is empty
  while (queue.length > 0) {
    // Dequeue the next node
    const currentNode = queue.shift();
    
    // Add the current node to the visited list
    visited.push(currentNode);
    
    // Get neighbors of the current node
    const neighbors = graph.get(currentNode) || [];
    
    // Process each neighbor
    for (const neighbor of neighbors) {
      // If the neighbor hasn't been visited or queued yet
      if (!visitedSet.has(neighbor)) {
        // Add to the queue and mark as visited
        queue.push(neighbor);
        visitedSet.add(neighbor);
      }
    }
  }
  
<<<<<<< HEAD
<<<<<<< HEAD
  // Legend items
  const legendItems = [
    { color: "#E2E8F0", label: "Unvisited" },
    { color: "#ECC94B", label: "Visiting (In Queue)" },
    { color: "#3B82F6", label: "Processing" },
    { color: "#10B981", label: "Visited" },
    { color: "#6366F1", label: "Discovery Edge" },
    { color: "#F59E0B", label: "Back Edge" }
  ];
  
  // Additional information panel
  const additionalInfo = (
    <>
      <InfoPanel>
        <InfoTitle>How BFS Works</InfoTitle>
        <ul>
          <li>BFS uses a queue data structure to keep track of nodes to visit</li>
          <li>It starts at a given node and explores all neighbors at the current depth before moving on</li>
          <li>BFS guarantees the shortest path in unweighted graphs</li>
          <li>It expands outward in "levels" from the starting node</li>
        </ul>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications of BFS</InfoTitle>
        <ul>
          <li>Finding shortest paths in unweighted graphs</li>
          <li>Web crawlers for indexing web pages</li>
          <li>Social network friend suggestion algorithms</li>
          <li>Puzzle solving (e.g., sliding puzzles, Rubik's cube)</li>
          <li>Connected components in undirected graphs</li>
          <li>Testing bipartiteness of a graph</li>
        </ul>
      </InfoPanel>
    </>
  );
  
  // Visualization component
  const visualizationComponent = (
    <>
      <EnhancedGraphProblemVisualizer
        problemType="bfs"
        height="650px"
        nodeRadius={25}
        showEdgeWeights={false}
        autoFit={true}
        allowZoomPan={true}
        generateNewGraph={generateBFSGraph}
        runAlgorithm={runBFSAlgorithm}
      />
      
      <LegendContainer>
        <Legend items={legendItems} />
      </LegendContainer>
    </>
  );
=======
=======
>>>>>>> parent of 5badfa4 (version 4.0.0)
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

const visitedOrder = bfs(graph, 0);
console.log("BFS traversal order:", visitedOrder);
// Output: BFS traversal order: [0, 1, 2, 3, 4, 5, 6]
`;
<<<<<<< HEAD
>>>>>>> parent of 5badfa4 (version 4.0.0)
=======
>>>>>>> parent of 5badfa4 (version 4.0.0)
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/graph">
          <FaArrowLeft /> Back to Graph Algorithms
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Breadth-First Search (BFS)</PageTitle>
        <Description>
          Breadth-First Search (BFS) is a graph traversal algorithm that explores all the vertices of a graph at the present depth 
          prior to moving on to vertices at the next depth level. BFS uses a queue data structure for its implementation, which follows 
          the First-In-First-Out (FIFO) principle. BFS is commonly used for finding the shortest path in unweighted graphs, 
          connected components, and solving puzzles.
        </Description>
      </PageHeader>
      
      <InfoPanel>
        <InfoTitle>How BFS Works:</InfoTitle>
        <InfoText>1. Select a starting node and add it to a queue.</InfoText>
        <InfoText>2. Visit the first node in the queue, mark it as visited, and remove it from the queue.</InfoText>
        <InfoText>3. Add all unvisited neighbors of the current node to the queue.</InfoText>
        <InfoText>4. Repeat steps 2-3 until the queue is empty.</InfoText>
        <InfoText>5. The order of visited nodes is the BFS traversal of the graph.</InfoText>
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
                <strong>Queue: </strong>
                {steps[currentStep].queue.length > 0 
                  ? `[${steps[currentStep].queue.join(', ')}]` 
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
        <InfoTitle>BFS Algorithm Implementation:</InfoTitle>
        <CodeContainer>
          <Suspense fallback={<div>Loading code...</div>}>
            <SyntaxHighlighter language="javascript" style={vs2015}>
              {bfsCode}
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
          <strong>Space Complexity:</strong> O(V) where V is the number of vertices. This is needed for the queue and visited set.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications of BFS:</InfoTitle>
        <InfoText>• Finding the shortest path in unweighted graphs</InfoText>
        <InfoText>• Traversing a website's pages for web crawling</InfoText>
        <InfoText>• Finding all connected components in a graph</InfoText>
        <InfoText>• Testing if a graph is bipartite</InfoText>
        <InfoText>• Building peer-to-peer networks</InfoText>
        <InfoText>• GPS navigation systems</InfoText>
        <InfoText>• Social networking websites (finding friends at a certain distance)</InfoText>
      </InfoPanel>
    </PageContainer>
  );
};

export default BFSPage; 