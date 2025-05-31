import React, { useState, useEffect, useCallback, memo, lazy, Suspense } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaCode, FaRandom } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomGraphInput from '../../../components/graph/CustomGraphInput';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Lazy load the SyntaxHighlighter to improve initial load time
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

const CodeToggleButton = styled(Button)`
  margin-bottom: 1rem;
`;

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  height: 500px;
  overflow: auto;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.card};
  
  @media (max-width: 768px) {
    height: 400px;
  }
  
  @media (max-width: 480px) {
    height: 350px;
  }
`;

const GraphSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const pulseAnimation = keyframes`
  0% {
    stroke-width: 2;
    opacity: 0.9;
  }
  50% {
    stroke-width: 4;
    opacity: 1;
  }
  100% {
    stroke-width: 2;
    opacity: 0.9;
  }
`;

const EdgePath = styled.path<{
  included: boolean;
  current: boolean;
  mstEdge: boolean;
}>`
  stroke: ${props => 
    props.mstEdge ? '#4CAF50' : 
    props.current ? '#E91E63' : 
    props.included ? '#64B5F6' : '#888'};
  stroke-width: ${props => (props.mstEdge || props.current) ? 3 : 2};
  stroke-linecap: round;
  transition: stroke 0.3s ease, stroke-width 0.3s ease;
  
  ${props => props.current && css`
    animation: ${pulseAnimation} 1s infinite;
  `}
`;

const NodeCircle = styled.circle<{ inMst: boolean; current: boolean }>`
  fill: ${props => 
    props.current ? '#E91E63' : 
    props.inMst ? '#4CAF50' : 
    props => props.theme.colors.card};
  stroke: #555;
  stroke-width: 2;
  cursor: pointer;
  transition: fill 0.3s ease;
  
  ${props => props.current && css`
    animation: ${pulseAnimation} 1s infinite;
  `}
`;

const NodeLabel = styled.text`
  fill: ${props => props.theme.colors.text};
  text-anchor: middle;
  dominant-baseline: central;
  font-size: 12px;
  user-select: none;
`;

const EdgeLabel = styled.text`
  fill: ${props => props.theme.colors.text};
  text-anchor: middle;
  dominant-baseline: central;
  font-size: 12px;
  font-weight: bold;
  user-select: none;
  background-color: ${props => props.theme.colors.card};
  paint-order: stroke;
  stroke: ${props => props.theme.colors.card};
  stroke-width: 3px;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const InfoPanel = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors.card};
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
  max-width: 800px;
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

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const LegendColor = styled.div<{ color: string }>`
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background-color: ${props => props.color};
  margin-right: 0.5rem;
`;

const LegendCircle = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 0.5rem;
  border: 1px solid #555;
`;

const CodeContainer = styled.div`
  margin-top: 2rem;
  max-width: 800px;
  border-radius: 0.5rem;
  overflow: hidden;
`;

// Types
interface Vertex {
  id: number;
  x: number;
  y: number;
  inMst: boolean;
  current: boolean;
}

interface Edge {
  id: number;
  source: number;
  target: number;
  weight: number;
  included: boolean;
  current: boolean;
  mstEdge: boolean;
}

// MemoizedEdge component
const MemoizedEdge = memo(({ 
  edge, 
  vertices,
}: { 
  edge: Edge;
  vertices: Vertex[];
}) => {
  const sourceVertex = vertices.find(v => v.id === edge.source);
  const targetVertex = vertices.find(v => v.id === edge.target);
  
  if (!sourceVertex || !targetVertex) return null;
  
  const path = `M ${sourceVertex.x} ${sourceVertex.y} L ${targetVertex.x} ${targetVertex.y}`;
  
  // Calculate midpoint for edge label
  const midX = (sourceVertex.x + targetVertex.x) / 2;
  const midY = (sourceVertex.y + targetVertex.y) / 2;
  
  return (
    <>
      <EdgePath 
        d={path} 
        included={edge.included}
        current={edge.current}
        mstEdge={edge.mstEdge}
      />
      <EdgeLabel x={midX} y={midY - 10}>{edge.weight}</EdgeLabel>
    </>
  );
});

// MemoizedNode component
const MemoizedNode = memo(({ 
  vertex 
}: { 
  vertex: Vertex;
}) => (
  <>
    <NodeCircle 
      cx={vertex.x} 
      cy={vertex.y} 
      r={20} 
      inMst={vertex.inMst}
      current={vertex.current}
    />
    <NodeLabel x={vertex.x} y={vertex.y}>{vertex.id}</NodeLabel>
  </>
));

const PrimPage: React.FC = () => {
  const [vertices, setVertices] = useState<Vertex[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<any[]>([]);
  const [stepInfo, setStepInfo] = useState<string>('');
  const [showCustomGraph, setShowCustomGraph] = useState(false);
  
  // Initialize graph
  useEffect(() => {
    generateRandomGraph();
  }, []);
  
  // Generate a random connected graph
  const generateRandomGraph = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setStepInfo('');
    
    // Create vertices in a circle
    const numVertices = 7;
    const radius = 200;
    const center = { x: 400, y: 250 };
    
    const newVertices: Vertex[] = [];
    for (let i = 0; i < numVertices; i++) {
      const angle = (i * 2 * Math.PI) / numVertices;
      newVertices.push({
        id: i,
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
        inMst: false,
        current: false
      });
    }
    
    // Create edges (not fully connected, to keep it interesting)
    const newEdges: Edge[] = [];
    let edgeId = 0;
    
    // Create a spanning tree to ensure connectivity
    for (let i = 1; i < numVertices; i++) {
      newEdges.push({
        id: edgeId++,
        source: Math.floor(Math.random() * i), // Connect to a random existing vertex
        target: i,
        weight: Math.floor(Math.random() * 20) + 1, // Random weight between 1 and 20
        included: false,
        current: false,
        mstEdge: false,
      });
    }
    
    // Add some additional random edges
    const additionalEdges = Math.floor(numVertices * 0.8);
    for (let i = 0; i < additionalEdges; i++) {
      const source = Math.floor(Math.random() * numVertices);
      let target = Math.floor(Math.random() * numVertices);
      
      // Ensure we don't create self-loops or duplicate edges
      while (
        source === target ||
        newEdges.some(e => 
          (e.source === source && e.target === target) || 
          (e.source === target && e.target === source)
        )
      ) {
        target = Math.floor(Math.random() * numVertices);
      }
      
      newEdges.push({
        id: edgeId++,
        source,
        target,
        weight: Math.floor(Math.random() * 20) + 1,
        included: false,
        current: false,
        mstEdge: false,
      });
    }
    
    setVertices(newVertices);
    setEdges(newEdges);
    setAnimationSteps([]);
  };

  // Prim's algorithm
  const primMST = () => {
    // Reset previous visualization
    resetVisualization();
    
    const steps: any[] = [];
    const numVertices = vertices.length;
    
    // Create a copy of vertices and edges with their initial state
    const initialVertices = vertices.map(vertex => ({
      ...vertex,
      inMst: false,
      current: false
    }));
    
    const initialEdges = edges.map(edge => ({
      ...edge,
      included: false,
      current: false,
      mstEdge: false,
    }));
    
    // Record initial state
    steps.push({
      vertices: initialVertices,
      edges: initialEdges,
      info: 'Starting Prim\'s Algorithm: Select any vertex to start'
    });
    
    // Start with vertex 0
    const startVertex = 0;
    
    // Set of vertices included in MST
    const mstVertices = new Set<number>([startVertex]);
    
    // Mark start vertex as in MST
    const verticesWithStart = initialVertices.map(vertex => ({
      ...vertex,
      inMst: vertex.id === startVertex,
      current: vertex.id === startVertex
    }));
    
    // Record step with start vertex highlighted
    steps.push({
      vertices: verticesWithStart,
      edges: initialEdges,
      info: `Selected vertex ${startVertex} as the starting vertex`
    });
    
    // Continue until all vertices are included in MST
    while (mstVertices.size < numVertices) {
      let minEdge: Edge | null = null;
      let minWeight = Infinity;
      
      // Find all edges that connect MST vertices to non-MST vertices
      const candidateEdges: Edge[] = [];
      
      for (const edge of initialEdges) {
        const sourceInMst = mstVertices.has(edge.source);
        const targetInMst = mstVertices.has(edge.target);
        
        // Edge connects MST vertex to non-MST vertex
        if ((sourceInMst && !targetInMst) || (!sourceInMst && targetInMst)) {
          candidateEdges.push(edge);
          
          // Check if this is the minimum weight edge
          if (edge.weight < minWeight) {
            minWeight = edge.weight;
            minEdge = edge;
          }
        }
      }
      
      // Mark candidate edges
      const edgesWithCandidates = steps[steps.length - 1].edges.map((edge: Edge) => ({
        ...edge,
        included: candidateEdges.some(e => e.id === edge.id),
        current: false,
        mstEdge: edge.mstEdge
      }));
      
      // Record step with candidate edges highlighted
      steps.push({
        vertices: steps[steps.length - 1].vertices,
        edges: edgesWithCandidates,
        info: `Identified ${candidateEdges.length} candidate edges that connect to non-MST vertices`
      });
      
      if (minEdge) {
        // Highlight the minimum weight edge
        const edgesWithMin = edgesWithCandidates.map((edge: Edge) => ({
          ...edge,
          current: edge.id === minEdge?.id,
        }));
        
        // Record step with min edge highlighted
        steps.push({
          vertices: steps[steps.length - 1].vertices,
          edges: edgesWithMin,
          info: `Selected edge (${minEdge.source}-${minEdge.target}) with minimum weight ${minEdge.weight}`
        });
        
        // Determine which vertex to add to MST
        const vertexToAdd = mstVertices.has(minEdge.source) ? minEdge.target : minEdge.source;
        mstVertices.add(vertexToAdd);
        
        // Update vertices and edges
        const updatedVertices = steps[steps.length - 1].vertices.map((vertex: Vertex) => ({
          ...vertex,
          inMst: mstVertices.has(vertex.id),
          current: vertex.id === vertexToAdd
        }));
        
        const updatedEdges = edgesWithMin.map((edge: Edge) => ({
          ...edge,
          mstEdge: edge.id === minEdge?.id ? true : edge.mstEdge,
          current: false,
        }));
        
        // Record step with new vertex and edge added to MST
        steps.push({
          vertices: updatedVertices,
          edges: updatedEdges,
          info: `Added vertex ${vertexToAdd} and edge (${minEdge.source}-${minEdge.target}) to MST`
        });
      } else {
        // No more edges to add (should not happen in a connected graph)
        break;
      }
    }
    
    // Final step
    const finalVertices = steps[steps.length - 1].vertices.map((vertex: Vertex) => ({
      ...vertex,
      current: false
    }));
    
    steps.push({
      vertices: finalVertices,
      edges: steps[steps.length - 1].edges,
      info: 'MST complete! All vertices connected with minimum total weight.'
    });
    
    setAnimationSteps(steps);
    return steps;
  };
  
  // Reset visualization
  const resetVisualization = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setStepInfo('');
    
    // Reset vertex and edge states
    const resetVertices = vertices.map(vertex => ({
      ...vertex,
      inMst: false,
      current: false
    }));
    
    const resetEdges = edges.map(edge => ({
      ...edge,
      included: false,
      current: false,
      mstEdge: false,
    }));
    
    setVertices(resetVertices);
    setEdges(resetEdges);
  };
  
  // Start animation
  const startAnimation = useCallback(() => {
    const steps = primMST();
    setAnimationSteps(steps);
    setIsAnimating(true);
    setCurrentStep(0);
  }, [vertices, edges]);
  
  // Step through animation
  const stepForward = useCallback(() => {
    if (currentStep < animationSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setVertices(animationSteps[nextStep].vertices);
      setEdges(animationSteps[nextStep].edges);
      setStepInfo(animationSteps[nextStep].info);
    }
  }, [currentStep, animationSteps]);
  
  // Animation effect
  useEffect(() => {
    let animationTimer: NodeJS.Timeout;
    
    if (isAnimating && currentStep < animationSteps.length - 1) {
      animationTimer = setTimeout(() => {
        stepForward();
      }, 1000);
    } else if (currentStep >= animationSteps.length - 1) {
      setIsAnimating(false);
    }
    
    return () => {
      if (animationTimer) {
        clearTimeout(animationTimer);
      }
    };
  }, [isAnimating, currentStep, animationSteps, stepForward]);
  
  // Prim's algorithm code
  const primCode = `function primMST(vertices, edges) {
  const n = vertices.length;
  
  // Track vertices in MST
  const inMST = new Array(n).fill(false);
  
  // Track minimum edge weights
  const key = new Array(n).fill(Infinity);
  
  // Track parent of each vertex in MST
  const parent = new Array(n).fill(-1);
  
  // Start with vertex 0
  key[0] = 0;
  
  // Create adjacency list
  const adjList = Array(n).fill(null).map(() => []);
  for (const edge of edges) {
    const { source, target, weight } = edge;
    adjList[source].push({ vertex: target, weight });
    adjList[target].push({ vertex: source, weight });
  }
  
  // Find MST with n vertices
  const mstEdges = [];
  
  for (let count = 0; count < n; count++) {
    // Find vertex with minimum key value
    let u = -1;
    let minKey = Infinity;
    
    for (let v = 0; v < n; v++) {
      if (!inMST[v] && key[v] < minKey) {
        minKey = key[v];
        u = v;
      }
    }
    
    // Add vertex to MST
    inMST[u] = true;
    
    // Add edge to MST (except for the first vertex)
    if (parent[u] !== -1) {
      const edgeToAdd = edges.find(e => 
        (e.source === u && e.target === parent[u]) || 
        (e.source === parent[u] && e.target === u)
      );
      if (edgeToAdd) {
        mstEdges.push(edgeToAdd);
      }
    }
    
    // Update key values of adjacent vertices
    for (const neighbor of adjList[u]) {
      const v = neighbor.vertex;
      const weight = neighbor.weight;
      
      if (!inMST[v] && weight < key[v]) {
        parent[v] = u;
        key[v] = weight;
      }
    }
  }
  
  return mstEdges;
}`;

  // Handle custom graph input
  const handleApplyCustomGraph = (newVertices: { id: number; x: number; y: number; }[], 
                                  newEdges: { source: number; target: number; weight: number; }[]) => {
    if (isAnimating) {
      setIsAnimating(false);
      if (animationSteps.length > 0) {
        setCurrentStep(0);
        setStepInfo('');
      }
    }
    
    // Convert the input format to the format used by this component
    const formattedVertices = newVertices.map(v => ({
      ...v,
      inMst: false,
      current: false
    }));
    
    const formattedEdges = newEdges.map((edge, idx) => ({
      id: idx,
      source: edge.source,
      target: edge.target,
      weight: edge.weight,
      included: false,
      current: false,
      mstEdge: false
    }));
    
    setVertices(formattedVertices);
    setEdges(formattedEdges);
    setShowCustomGraph(false);
  };

  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/graph">
          <FaArrowLeft /> Back to Graph Algorithms
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Prim's Algorithm</PageTitle>
        <Description>
          Prim's algorithm is a greedy algorithm that finds a minimum spanning tree for a weighted undirected graph. 
          It finds a subset of the edges that forms a tree that includes every vertex, where the total weight of all the edges in the tree is minimized.
        </Description>
      </PageHeader>
      
      <InfoPanel>
        <InfoTitle>How to use this visualization:</InfoTitle>
        <InfoText>1. The graph shows vertices and weighted edges</InfoText>
        <InfoText>2. Use the controls to start, pause, or reset the visualization</InfoText>
        <InfoText>3. You can generate a new random graph to see how the algorithm works with different inputs</InfoText>
        <InfoText>4. You can also provide your own custom graph data</InfoText>
        
        <Legend>
          <LegendItem>
            <LegendCircle color="#4CAF50" /> MST Vertex
          </LegendItem>
          <LegendItem>
            <LegendCircle color="#E91E63" /> Current Vertex
          </LegendItem>
          <LegendItem>
            <LegendColor color="#4CAF50" /> MST Edge
          </LegendItem>
          <LegendItem>
            <LegendColor color="#E91E63" /> Current Edge
          </LegendItem>
          <LegendItem>
            <LegendColor color="#64B5F6" /> Candidate Edge
          </LegendItem>
          <LegendItem>
            <LegendColor color="#888" /> Unprocessed Edge
          </LegendItem>
        </Legend>
      </InfoPanel>
      
      <ControlsContainer>
        <Button onClick={generateRandomGraph}>
          <FaRandom /> New Graph
        </Button>
        <Button onClick={() => setShowCustomGraph(!showCustomGraph)}>
          {showCustomGraph ? 'Hide Custom Input' : 'Custom Graph'}
        </Button>
        <Button onClick={startAnimation} disabled={isAnimating}>
          <FaPlay /> Start
        </Button>
        <Button onClick={() => setIsAnimating(false)} disabled={!isAnimating}>
          <FaPause /> Pause
        </Button>
        <Button onClick={resetVisualization}>
          <FaUndo /> Reset
        </Button>
        <Button onClick={stepForward} disabled={isAnimating || currentStep >= animationSteps.length - 1}>
          <FaStepForward /> Step
        </Button>
      </ControlsContainer>
      
      {showCustomGraph && (
        <InfoPanel>
          <InfoTitle>Custom Graph Input</InfoTitle>
          <CustomGraphInput onApply={handleApplyCustomGraph} />
        </InfoPanel>
      )}
      
      {stepInfo && (
        <InfoPanel>
          <InfoTitle>Current Step:</InfoTitle>
          <InfoText>{stepInfo}</InfoText>
        </InfoPanel>
      )}
      
      <GraphContainer>
        <GraphSvg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
          {edges.map(edge => (
            <MemoizedEdge key={edge.id} edge={edge} vertices={vertices} />
          ))}
          {vertices.map(vertex => (
            <MemoizedNode key={vertex.id} vertex={vertex} />
          ))}
        </GraphSvg>
      </GraphContainer>
      
      <InfoPanel>
        <InfoTitle>Implementation Code:</InfoTitle>
        <CodeContainer>
          <Suspense fallback={<div>Loading code...</div>}>
            <SyntaxHighlighter language="javascript" style={vs2015}>
              {primCode}
            </SyntaxHighlighter>
          </Suspense>
        </CodeContainer>
      </InfoPanel>
    </PageContainer>
  );
};

export default PrimPage; 