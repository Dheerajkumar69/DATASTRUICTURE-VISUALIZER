import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiPlay, FiRefreshCw, FiZap } from 'react-icons/fi';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray800};
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 800px;
  line-height: 1.6;
`;

const VisualizerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
  }
`;

const VisualizerSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CodeSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ControlPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  width: 80px;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary : 
    variant === 'secondary' ? theme.colors.secondary : 
    variant === 'danger' ? theme.colors.danger : 
    theme.colors.gray200};
  color: ${({ variant }) => variant ? 'white' : 'inherit'};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-height: 500px;
`;

const GraphVisualization = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

const EdgeContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const Edge = styled.line<{ isVisited?: boolean }>`
  stroke: ${({ theme, isVisited }) => 
    isVisited ? theme.colors.primary : theme.colors.gray300};
  stroke-width: 2;
  transition: stroke 0.3s ease;
`;

const NodeContainer = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

const GraphNode = styled(motion.div)<{ isVisited?: boolean; isStart?: boolean; isEnd?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${({ theme, isVisited, isStart, isEnd }) => 
    isStart ? theme.colors.secondary : 
    isEnd ? theme.colors.danger : 
    isVisited ? theme.colors.primary : theme.colors.gray100};
  color: ${({ theme, isVisited, isStart, isEnd }) => 
    isVisited || isStart || isEnd ? 'white' : theme.colors.gray800};
  border-radius: 50%;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 600;
  font-size: 1rem;
  border: 2px solid ${({ theme, isVisited, isStart, isEnd }) => 
    isStart ? theme.colors.secondary : 
    isEnd ? theme.colors.danger : 
    isVisited ? theme.colors.primary : theme.colors.gray300};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const AlgorithmSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.card};
  font-family: ${({ theme }) => theme.fonts.sans};
`;

const CodeBlock = styled.div`
  background-color: #1E1E1E;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

const CodeTitle = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.card};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.875rem;
`;

const InfoPanel = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const InfoTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.gray800};
`;

const InfoContent = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
  
  ul {
    padding-left: 1.5rem;
    margin-top: 0.5rem;
  }
  
  li {
    margin-bottom: 0.25rem;
  }
`;

const MessageContainer = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 0.875rem;
  margin-top: 1rem;
`;

// Graph node type
interface GraphNodeType {
  id: string;
  x: number;
  y: number;
  isVisited: boolean;
  isStart: boolean;
  isEnd: boolean;
}

// Graph edge type
interface GraphEdgeType {
  from: string;
  to: string;
  isVisited: boolean;
}

// Graph Page Component
const GraphPage: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNodeType[]>([]);
  const [edges, setEdges] = useState<GraphEdgeType[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('bfs');
  const [message, setMessage] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startNode, setStartNode] = useState<string | null>(null);
  const [endNode, setEndNode] = useState<string | null>(null);
  const [nodeIdCounter, setNodeIdCounter] = useState<number>(0);
  const graphRef = useRef<HTMLDivElement>(null);
  
  // Initialize graph with some nodes and edges
  useEffect(() => {
    resetGraph();
  }, []);
  
  const resetGraph = () => {
    // Create nodes
    const newNodes: GraphNodeType[] = [
      { id: '0', x: 200, y: 100, isVisited: false, isStart: true, isEnd: false },
      { id: '1', x: 100, y: 200, isVisited: false, isStart: false, isEnd: false },
      { id: '2', x: 300, y: 200, isVisited: false, isStart: false, isEnd: false },
      { id: '3', x: 150, y: 300, isVisited: false, isStart: false, isEnd: false },
      { id: '4', x: 250, y: 300, isVisited: false, isStart: false, isEnd: false },
      { id: '5', x: 200, y: 400, isVisited: false, isStart: false, isEnd: true }
    ];
    
    // Create edges
    const newEdges: GraphEdgeType[] = [
      { from: '0', to: '1', isVisited: false },
      { from: '0', to: '2', isVisited: false },
      { from: '1', to: '3', isVisited: false },
      { from: '2', to: '4', isVisited: false },
      { from: '3', to: '5', isVisited: false },
      { from: '4', to: '5', isVisited: false },
      { from: '1', to: '2', isVisited: false },
      { from: '3', to: '4', isVisited: false }
    ];
    
    setNodes(newNodes);
    setEdges(newEdges);
    setStartNode('0');
    setEndNode('5');
    setNodeIdCounter(6);
    setMessage('Graph initialized with 6 nodes and 8 edges');
  };
  
  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAlgorithm(e.target.value);
  };
  
  const addNode = () => {
    if (!graphRef.current) return;
    
    const rect = graphRef.current.getBoundingClientRect();
    const x = Math.random() * (rect.width - 80) + 40;
    const y = Math.random() * (rect.height - 80) + 40;
    
    const newNode: GraphNodeType = {
      id: nodeIdCounter.toString(),
      x,
      y,
      isVisited: false,
      isStart: false,
      isEnd: false
    };
    
    setNodes([...nodes, newNode]);
    setNodeIdCounter(nodeIdCounter + 1);
    setMessage(`Added node ${newNode.id}`);
  };
  
  const addEdge = () => {
    if (nodes.length < 2) {
      setMessage('Need at least 2 nodes to add an edge');
      return;
    }
    
    // Randomly select two different nodes
    const fromIndex = Math.floor(Math.random() * nodes.length);
    let toIndex = Math.floor(Math.random() * nodes.length);
    
    while (fromIndex === toIndex) {
      toIndex = Math.floor(Math.random() * nodes.length);
    }
    
    const fromId = nodes[fromIndex].id;
    const toId = nodes[toIndex].id;
    
    // Check if edge already exists
    const edgeExists = edges.some(
      edge => (edge.from === fromId && edge.to === toId) || 
              (edge.from === toId && edge.to === fromId)
    );
    
    if (edgeExists) {
      setMessage('Edge already exists');
      return;
    }
    
    const newEdge: GraphEdgeType = {
      from: fromId,
      to: toId,
      isVisited: false
    };
    
    setEdges([...edges, newEdge]);
    setMessage(`Added edge from ${fromId} to ${toId}`);
  };
  
  const handleNodeClick = (nodeId: string) => {
    if (isRunning) return;
    
    // If no start node is selected, set this as start
    if (!startNode) {
      setStartNode(nodeId);
      setNodes(nodes.map(node => 
        node.id === nodeId 
          ? { ...node, isStart: true, isEnd: false } 
          : { ...node, isStart: false }
      ));
      setMessage(`Node ${nodeId} set as start node`);
      return;
    }
    
    // If no end node is selected, set this as end
    if (!endNode) {
      setEndNode(nodeId);
      setNodes(nodes.map(node => 
        node.id === nodeId 
          ? { ...node, isEnd: true, isStart: false } 
          : { ...node, isEnd: node.isStart ? false : node.isEnd }
      ));
      setMessage(`Node ${nodeId} set as end node`);
      return;
    }
    
    // If this is the start node, unset it
    if (nodeId === startNode) {
      setStartNode(null);
      setNodes(nodes.map(node => 
        node.id === nodeId 
          ? { ...node, isStart: false } 
          : node
      ));
      setMessage(`Node ${nodeId} unset as start node`);
      return;
    }
    
    // If this is the end node, unset it
    if (nodeId === endNode) {
      setEndNode(null);
      setNodes(nodes.map(node => 
        node.id === nodeId 
          ? { ...node, isEnd: false } 
          : node
      ));
      setMessage(`Node ${nodeId} unset as end node`);
      return;
    }
    
    // Otherwise, set this as the new start node
    setStartNode(nodeId);
    setNodes(nodes.map(node => 
      node.id === nodeId 
        ? { ...node, isStart: true, isEnd: false } 
        : { ...node, isStart: false }
    ));
    setMessage(`Node ${nodeId} set as start node`);
  };
  
  const runAlgorithm = async () => {
    if (!startNode) {
      setMessage('Please select a start node');
      return;
    }
    
    // Reset visited state
    setNodes(nodes.map(node => ({ ...node, isVisited: false })));
    setEdges(edges.map(edge => ({ ...edge, isVisited: false })));
    
    setIsRunning(true);
    
    if (selectedAlgorithm === 'bfs') {
      await runBFS();
    } else if (selectedAlgorithm === 'dfs') {
      await runDFS();
    }
    
    setIsRunning(false);
  };
  
  const runBFS = async () => {
    if (!startNode) return;
    
    const queue: string[] = [startNode];
    const visited = new Set<string>();
    const delay = 500; // ms
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      
      if (visited.has(currentId)) continue;
      visited.add(currentId);
      
      // Mark node as visited
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === currentId 
            ? { ...node, isVisited: true } 
            : node
        )
      );
      
      setMessage(`BFS visiting node ${currentId}`);
      
      // If we reached the end node, stop
      if (currentId === endNode) {
        setMessage(`BFS found path to end node ${endNode}`);
        break;
      }
      
      // Find all connected nodes
      const connectedEdges = edges.filter(edge => 
        edge.from === currentId || edge.to === currentId
      );
      
      for (const edge of connectedEdges) {
        const neighborId = edge.from === currentId ? edge.to : edge.from;
        
        if (!visited.has(neighborId)) {
          queue.push(neighborId);
          
          // Mark edge as visited
          setEdges(prevEdges => 
            prevEdges.map(e => 
              (e.from === edge.from && e.to === edge.to) 
                ? { ...e, isVisited: true } 
                : e
            )
          );
        }
      }
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    if (!visited.has(endNode!)) {
      setMessage(`BFS could not find path to end node ${endNode}`);
    }
  };
  
  const runDFS = async () => {
    if (!startNode) return;
    
    const visited = new Set<string>();
    const delay = 500; // ms
    
    const dfs = async (nodeId: string) => {
      if (visited.has(nodeId)) return false;
      visited.add(nodeId);
      
      // Mark node as visited
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === nodeId 
            ? { ...node, isVisited: true } 
            : node
        )
      );
      
      setMessage(`DFS visiting node ${nodeId}`);
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // If we reached the end node, stop
      if (nodeId === endNode) {
        setMessage(`DFS found path to end node ${endNode}`);
        return true;
      }
      
      // Find all connected nodes
      const connectedEdges = edges.filter(edge => 
        edge.from === nodeId || edge.to === nodeId
      );
      
      for (const edge of connectedEdges) {
        const neighborId = edge.from === nodeId ? edge.to : edge.from;
        
        if (!visited.has(neighborId)) {
          // Mark edge as visited
          setEdges(prevEdges => 
            prevEdges.map(e => 
              (e.from === edge.from && e.to === edge.to) 
                ? { ...e, isVisited: true } 
                : e
            )
          );
          
          const found = await dfs(neighborId);
          if (found) return true;
        }
      }
      
      return false;
    };
    
    const found = await dfs(startNode);
    
    if (!found) {
      setMessage(`DFS could not find path to end node ${endNode}`);
    }
  };
  
  // Code snippets
  const bfsCode = `
function bfs(graph, startNode, endNode) {
  const queue = [startNode];
  const visited = new Set();
  const parent = {};
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (visited.has(current)) continue;
    visited.add(current);
    
    // If we reached the end node, we can reconstruct the path
    if (current === endNode) {
      return reconstructPath(parent, startNode, endNode);
    }
    
    // Visit all neighbors
    for (const neighbor of graph[current]) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
        parent[neighbor] = current;
      }
    }
  }
  
  // No path found
  return null;
}`;

  const dfsCode = `
function dfs(graph, startNode, endNode) {
  const visited = new Set();
  const parent = {};
  
  function dfsHelper(node) {
    if (visited.has(node)) return false;
    visited.add(node);
    
    // If we reached the end node, we can reconstruct the path
    if (node === endNode) {
      return true;
    }
    
    // Visit all neighbors
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        parent[neighbor] = node;
        if (dfsHelper(neighbor)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  if (dfsHelper(startNode)) {
    return reconstructPath(parent, startNode, endNode);
  }
  
  // No path found
  return null;
}`;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Graph Visualization</PageTitle>
        <PageDescription>
          A graph is a non-linear data structure consisting of nodes and edges.
          This visualization demonstrates graph traversal algorithms like BFS and DFS.
          Click on nodes to set start and end points, then run the algorithm to see the traversal.
        </PageDescription>
      </PageHeader>
      
      <VisualizerContainer>
        <VisualizerSection>
          <ControlPanel>
            <AlgorithmSelect value={selectedAlgorithm} onChange={handleAlgorithmChange}>
              <option value="bfs">Breadth-First Search (BFS)</option>
              <option value="dfs">Depth-First Search (DFS)</option>
            </AlgorithmSelect>
            
            <Button variant="primary" onClick={runAlgorithm} disabled={isRunning || !startNode}>
              <FiPlay size={16} /> Run Algorithm
            </Button>
            
            <Button onClick={addNode} disabled={isRunning}>
              <FiPlus size={16} /> Add Node
            </Button>
            
            <Button onClick={addEdge} disabled={isRunning}>
              <FiPlus size={16} /> Add Edge
            </Button>
            
            <Button onClick={resetGraph} disabled={isRunning}>
              <FiRefreshCw size={16} /> Reset
            </Button>
          </ControlPanel>
          
          <GraphContainer>
            <GraphVisualization ref={graphRef}>
              <EdgeContainer>
                {edges.map((edge, index) => {
                  const fromNode = nodes.find(node => node.id === edge.from);
                  const toNode = nodes.find(node => node.id === edge.to);
                  
                  if (!fromNode || !toNode) return null;
                  
                  return (
                    <Edge
                      key={`${edge.from}-${edge.to}`}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      isVisited={edge.isVisited}
                    />
                  );
                })}
              </EdgeContainer>
              
              <AnimatePresence>
                {nodes.map(node => (
                  <NodeContainer
                    key={node.id}
                    style={{ left: node.x, top: node.y }}
                  >
                    <GraphNode
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3 }}
                      isVisited={node.isVisited}
                      isStart={node.isStart}
                      isEnd={node.isEnd}
                      onClick={() => handleNodeClick(node.id)}
                    >
                      {node.id}
                    </GraphNode>
                  </NodeContainer>
                ))}
              </AnimatePresence>
            </GraphVisualization>
            
            {message && (
              <MessageContainer>
                {message}
              </MessageContainer>
            )}
          </GraphContainer>
          
          <InfoPanel>
            <InfoTitle>About Graphs</InfoTitle>
            <InfoContent>
              <p>
                A graph is a non-linear data structure consisting of nodes (vertices) and edges.
                Graphs are used to represent networks of communication, data organization, computational devices, flow of computation, etc.
              </p>
              <ul>
                <li><strong>BFS (Breadth-First Search):</strong> Explores all neighbors at the present depth before moving on to nodes at the next depth level.</li>
                <li><strong>DFS (Depth-First Search):</strong> Explores as far as possible along each branch before backtracking.</li>
                <li><strong>Time Complexity:</strong>
                  <ul>
                    <li>BFS: O(V + E) where V is the number of vertices and E is the number of edges</li>
                    <li>DFS: O(V + E) where V is the number of vertices and E is the number of edges</li>
                  </ul>
                </li>
                <li><strong>Applications:</strong>
                  <ul>
                    <li>Social networks</li>
                    <li>Web page ranking</li>
                    <li>GPS navigation</li>
                    <li>Network routing</li>
                  </ul>
                </li>
              </ul>
            </InfoContent>
          </InfoPanel>
        </VisualizerSection>
        
        <CodeSection>
          <CodeBlock>
            <CodeTitle>BFS Algorithm</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {bfsCode}
            </SyntaxHighlighter>
          </CodeBlock>
          
          <CodeBlock>
            <CodeTitle>DFS Algorithm</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {dfsCode}
            </SyntaxHighlighter>
          </CodeBlock>
        </CodeSection>
      </VisualizerContainer>
    </PageContainer>
  );
};

export default GraphPage; 