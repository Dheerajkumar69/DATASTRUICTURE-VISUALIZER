import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward, FaRandom } from 'react-icons/fa';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'));

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

interface Node {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  textColor: string;
  visited: boolean;
  inQueue: boolean;
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
  priorityQueue: number[];
  distances: number[];
  previous: (number | null)[];
  description: string;
  graph: Graph;
}

const DijkstraPage: React.FC = () => {
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [], adjacencyList: {} });
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  const [startNode, setStartNode] = useState<number>(0);
  const [endNode, setEndNode] = useState<number>(1);
  const [nodeCount, setNodeCount] = useState<number>(8);
  const [stepInfo, setStepInfo] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateRandomGraph();
  }, [nodeCount]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating && !isPaused && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(prev => prev + 1), animationSpeed);
    } else if (currentStep >= steps.length - 1) {
      setIsAnimating(false);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [isAnimating, isPaused, currentStep, steps, animationSpeed]);

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      setStepInfo(step.description);
      renderGraph(step.graph);
    }
  }, [currentStep, steps]);

  const renderGraph = (graphToRender: Graph) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graphToRender.edges.forEach(edge => {
      const s = graphToRender.nodes[edge.source];
      const t = graphToRender.nodes[edge.target];
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.strokeStyle = edge.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      const midX = (s.x + t.x) / 2;
      const midY = (s.y + t.y) / 2;
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.fillText(edge.weight.toString(), midX, midY);
    });
    graphToRender.nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = node.textColor;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });
  };

  const generateRandomGraph = () => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const newAdjacencyList: { [key: number]: number[] } = {};
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
        color: '#fff',
        textColor: '#000',
        visited: false,
        inQueue: false,
        processing: false,
        label: i.toString()
      });
      newAdjacencyList[i] = [];
    }
    for (let i = 0; i < nodeCount; i++) {
      const numConnections = Math.floor(Math.random() * 2) + 2;
      for (let j = 0; j < numConnections; j++) {
        const target = Math.floor(Math.random() * nodeCount);
        if (target === i || newAdjacencyList[i].includes(target)) continue;
        const weight = Math.floor(Math.random() * 9) + 1;
        newEdges.push({ source: i, target, weight, color: '#aaa' });
        newEdges.push({ source: target, target: i, weight, color: '#aaa' });
        newAdjacencyList[i].push(target);
        newAdjacencyList[target].push(i);
      }
    }
    const newGraph: Graph = { nodes: newNodes, edges: newEdges, adjacencyList: newAdjacencyList };
    setGraph(newGraph);
    renderGraph(newGraph);
    setSteps([]);
    setCurrentStep(0);
    setStepInfo('Graph initialized. Select start and end nodes and click "Start" to run Dijkstra.');
  };

  const runDijkstra = () => {
    if (graph.nodes.length === 0) return;
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    const steps: Step[] = [];
    const distances: number[] = Array(graph.nodes.length).fill(Infinity);
    const previous: (number | null)[] = Array(graph.nodes.length).fill(null);
    distances[startNode] = 0;
    const pq: number[] = [startNode];

    const initialGraph = JSON.parse(JSON.stringify(graph)) as Graph;
    initialGraph.nodes[startNode].inQueue = true;
    initialGraph.nodes[startNode].color = '#ffcc00';
    steps.push({
      currentNode: null,
      priorityQueue: [...pq],
      distances: [...distances],
      previous: [...previous],
      description: `Initialize distances. Start at ${startNode}.`,
      graph: initialGraph
    });

    const getWeight = (u: number, v: number): number | null => {
      const e = graph.edges.find(edge => edge.source === u && edge.target === v);
      return e ? e.weight : null;
    };

    const visited = new Set<number>();
    while (pq.length > 0) {
      pq.sort((a, b) => distances[a] - distances[b]);
      const u = pq.shift()!;
      if (visited.has(u)) continue;
      visited.add(u);

      const g1 = JSON.parse(JSON.stringify(steps[steps.length - 1].graph)) as Graph;
      g1.nodes[u].processing = true;
      g1.nodes[u].inQueue = false;
      g1.nodes[u].color = '#ff9900';
      steps.push({
        currentNode: u,
        priorityQueue: [...pq],
        distances: [...distances],
        previous: [...previous],
        description: `Extract-min ${u} from priority queue.`,
        graph: g1
      });

      const neighbors = graph.adjacencyList[u] || [];
      for (const v of neighbors) {
        if (visited.has(v)) continue;
        const w = getWeight(u, v);
        if (w == null) continue;
        const alt = distances[u] + w;
        const g2 = JSON.parse(JSON.stringify(steps[steps.length - 1].graph)) as Graph;
        const edgeIndex = g2.edges.findIndex(e => (e.source === u && e.target === v));
        if (edgeIndex !== -1) {
          g2.edges[edgeIndex].color = '#3498db';
        }
        steps.push({
          currentNode: u,
          priorityQueue: [...pq],
          distances: [...distances],
          previous: [...previous],
          description: `Relax edge (${u} → ${v}) with weight ${w}.`,
          graph: g2
        });
        if (alt < distances[v]) {
          distances[v] = alt;
          previous[v] = u;
          if (!pq.includes(v)) pq.push(v);
          const g3 = JSON.parse(JSON.stringify(g2)) as Graph;
          g3.nodes[v].inQueue = true;
          g3.nodes[v].color = '#ffcc00';
          steps.push({
            currentNode: u,
            priorityQueue: [...pq],
            distances: [...distances],
            previous: [...previous],
            description: `Update dist[${v}] = ${alt}, prev[${v}] = ${u}. Enqueue ${v}.`,
            graph: g3
          });
        }
      }

      const g4 = JSON.parse(JSON.stringify(steps[steps.length - 1].graph)) as Graph;
      g4.nodes[u].visited = true;
      g4.nodes[u].processing = false;
      g4.nodes[u].color = '#4caf50';
      g4.nodes[u].textColor = '#fff';
      steps.push({
        currentNode: null,
        priorityQueue: [...pq],
        distances: [...distances],
        previous: [...previous],
        description: `Mark ${u} as finalized.`,
        graph: g4
      });
    }

    // Highlight shortest path if endNode is reachable
    const path: number[] = [];
    if (distances[endNode] < Infinity) {
      let cur: number | null = endNode;
      while (cur !== null) {
        path.unshift(cur);
        cur = previous[cur];
      }
      const g5 = JSON.parse(JSON.stringify(steps[steps.length - 1].graph)) as Graph;
      for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i + 1];
        const idx = g5.edges.findIndex(e => e.source === u && e.target === v);
        if (idx !== -1) g5.edges[idx].color = '#e74c3c';
        g5.nodes[u].color = '#8e44ad';
        g5.nodes[u].textColor = '#fff';
      }
      g5.nodes[endNode].color = '#8e44ad';
      g5.nodes[endNode].textColor = '#fff';
      steps.push({
        currentNode: null,
        priorityQueue: [],
        distances: [...distances],
        previous: [...previous],
        description: `Shortest path ${path.join(' → ')} with distance ${distances[endNode]}.`,
        graph: g5
      });
    }

    setSteps(steps);
    setCurrentStep(0);
  };

  const startAnimation = () => {
    if (steps.length === 0) runDijkstra();
    setIsAnimating(true);
    setIsPaused(false);
  };
  const pauseAnimation = () => setIsPaused(true);
  const resetAnimation = () => {
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    const resetGraph = JSON.parse(JSON.stringify(graph)) as Graph;
    resetGraph.nodes.forEach(n => {
      n.visited = false; n.inQueue = false; n.processing = false; n.color = '#fff'; n.textColor = '#000';
    });
    resetGraph.edges.forEach(e => { e.color = '#aaa'; });
    renderGraph(resetGraph);
    setStepInfo('Reset. Click "Start" to run Dijkstra.');
  };
  const stepForward = () => { if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1); };
  const stepBackward = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };

  const handleNodeCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    if (!isNaN(count) && count >= 3 && count <= 12) setNodeCount(count);
  };
  const handleStartNodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setStartNode(parseInt(e.target.value, 10));
  const handleEndNodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setEndNode(parseInt(e.target.value, 10));
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => setAnimationSpeed(parseInt(e.target.value, 10));

  const dijkstraCode = `/**
* Dijkstra's algorithm for non-negative weighted graphs
* @param {Map<number, Array<[number, number]>>} graph - adjacency list with [neighbor, weight]
* @param {number} start - start node
* @returns {{dist: Map<number, number>, prev: Map<number, number|null>}}
*/
function dijkstra(graph, start) {
  const dist = new Map();
  const prev = new Map();
  const visited = new Set();
  const pq = [];
  for (const v of graph.keys()) { dist.set(v, Infinity); prev.set(v, null); }
  dist.set(start, 0);
  pq.push(start);
  while (pq.length > 0) {
    pq.sort((a, b) => dist.get(a) - dist.get(b));
    const u = pq.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    for (const [v, w] of graph.get(u) || []) {
      if (visited.has(v)) continue;
      const alt = dist.get(u) + w;
      if (alt < dist.get(v)) { dist.set(v, alt); prev.set(v, u); pq.push(v); }
    }
  }
  return { dist, prev };
}`;

  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/graph">
          <FaArrowLeft /> Back to Graph Algorithms
        </BackButton>
      </NavigationRow>

      <PageHeader>
        <PageTitle>Dijkstra's Shortest Path</PageTitle>
        <Description>
          Dijkstra's algorithm finds shortest paths from a source to all vertices in a graph with non-negative edge weights.
        </Description>
      </PageHeader>

      <InfoPanel>
        <InfoTitle>Graph Settings:</InfoTitle>
        <InputGroup>
          <Label>Number of Nodes:</Label>
          <Input type="number" min="3" max="12" value={nodeCount} onChange={handleNodeCountChange} disabled={isAnimating && !isPaused} />
          <Button onClick={generateRandomGraph} disabled={isAnimating && !isPaused}><FaRandom /> Regenerate Graph</Button>
        </InputGroup>
        <InputGroup>
          <Label>Start Node:</Label>
          <Select value={startNode} onChange={handleStartNodeChange}>
            {Array.from({ length: nodeCount }, (_, i) => (<option key={i} value={i}>{i}</option>))}
          </Select>
        </InputGroup>
        <InputGroup>
          <Label>End Node:</Label>
          <Select value={endNode} onChange={handleEndNodeChange}>
            {Array.from({ length: nodeCount }, (_, i) => (<option key={i} value={i}>{i}</option>))}
          </Select>
        </InputGroup>
      </InfoPanel>

      <ControlsContainer>
        <Select value={animationSpeed} onChange={handleSpeedChange}>
          <option value="1000">Slow</option>
          <option value="500">Medium</option>
          <option value="200">Fast</option>
        </Select>
        {(!isAnimating || isPaused) ? (
          <Button onClick={startAnimation}><FaPlay /> {isPaused ? 'Resume' : 'Start'}</Button>
        ) : (
          <Button onClick={pauseAnimation}><FaPause /> Pause</Button>
        )}
        <Button onClick={stepBackward} disabled={currentStep === 0 || (isAnimating && !isPaused)}><FaStepBackward /> Back</Button>
        <Button onClick={stepForward} disabled={currentStep >= steps.length - 1 || (isAnimating && !isPaused)}><FaStepForward /> Forward</Button>
        <Button onClick={resetAnimation} disabled={isAnimating && !isPaused}><FaUndo /> Reset</Button>
      </ControlsContainer>

      {stepInfo && (
        <InfoPanel>
          <InfoTitle>Current Step:</InfoTitle>
          <InfoText>{stepInfo}</InfoText>
          {steps.length > 0 && currentStep < steps.length && (
            <div>
              <InfoText><strong>Priority Queue:</strong> {steps[currentStep].priorityQueue.length > 0 ? `[${steps[currentStep].priorityQueue.join(', ')}]` : 'Empty'}</InfoText>
              <InfoText><strong>Distances:</strong> [{steps[currentStep].distances.map(d => (d === Infinity ? '∞' : d)).join(', ')}]</InfoText>
            </div>
          )}
        </InfoPanel>
      )}

      <GraphContainer>
        <Canvas ref={canvasRef} />
      </GraphContainer>

      <InfoPanel>
        <InfoTitle>Dijkstra Implementation:</InfoTitle>
        <CodeContainer>
          <Suspense fallback={<div>Loading code...</div>}>
            <SyntaxHighlighter language="javascript" style={vs2015}>
{dijkstraCode}
            </SyntaxHighlighter>
          </Suspense>
        </CodeContainer>
      </InfoPanel>

      <InfoPanel>
        <InfoTitle>Time & Space Complexity:</InfoTitle>
        <InfoText><strong>Time:</strong> O((V + E) log V) with a binary heap PQ.</InfoText>
        <InfoText><strong>Space:</strong> O(V + E) for graph + O(V) for dist/prev.</InfoText>
      </InfoPanel>
    </PageContainer>
  );
};

export default DijkstraPage;


