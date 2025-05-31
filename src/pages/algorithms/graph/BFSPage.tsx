import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Legend } from '../../../components/visualization/VisualizationComponents';
import GraphProblemTemplate from '../../../components/templates/GraphProblemTemplate';
import EnhancedGraphProblemVisualizer from '../../../components/visualization/EnhancedGraphProblemVisualizer';
import { AlgorithmInfo } from '../../../types/algorithm';
import { Vertex, Edge, VertexState, EdgeState } from '../../../components/visualization/GraphVisualizer';
import { VisualizationStep } from '../../../components/visualization/EnhancedGraphProblemVisualizer';

// Styled Components
const LegendContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
`;

const InfoPanel = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius};
  margin-bottom: 1rem;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const InfoTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const bfsInfo: AlgorithmInfo = {
  name: "Breadth-First Search (BFS)",
  description: "Breadth-First Search is a graph traversal algorithm that explores all vertices at the present depth before moving on to vertices at the next depth level. It is commonly used to find the shortest path in unweighted graphs.",
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)'
  },
  spaceComplexity: 'O(V)',
  implementations: {
    javascript: `function bfs(graph, startNode) {
  const visited = new Set();
  const queue = [startNode];
  const result = [];
  
  // Mark the start node as visited
  visited.add(startNode);
  
  while (queue.length > 0) {
    // Remove the first node from the queue
    const currentNode = queue.shift();
    result.push(currentNode);
    
    // Visit all adjacent nodes
    for (const neighbor of graph[currentNode]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`,
    python: `def bfs(graph, start_node):
    visited = set()
    queue = [start_node]
    result = []
    
    # Mark the start node as visited
    visited.add(start_node)
    
    while queue:
        # Remove the first node from the queue
        current_node = queue.pop(0)
        result.append(current_node)
        
        # Visit all adjacent nodes
        for neighbor in graph[current_node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result`,
    java: `public List<Integer> bfs(List<List<Integer>> graph, int startNode) {
    boolean[] visited = new boolean[graph.size()];
    Queue<Integer> queue = new LinkedList<>();
    List<Integer> result = new ArrayList<>();
    
    // Mark the start node as visited and enqueue it
    visited[startNode] = true;
    queue.add(startNode);
    
    while (!queue.isEmpty()) {
        // Remove the first node from the queue
        int currentNode = queue.poll();
        result.add(currentNode);
        
        // Visit all adjacent nodes
        for (int neighbor : graph.get(currentNode)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.add(neighbor);
            }
        }
    }
    
    return result;
}`,
    cpp: `vector<int> bfs(vector<vector<int>>& graph, int startNode) {
    vector<bool> visited(graph.size(), false);
    queue<int> q;
    vector<int> result;
    
    // Mark the start node as visited and enqueue it
    visited[startNode] = true;
    q.push(startNode);
    
    while (!q.empty()) {
        // Remove the first node from the queue
        int currentNode = q.front();
        q.pop();
        result.push_back(currentNode);
        
        // Visit all adjacent nodes
        for (int neighbor : graph[currentNode]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
    
    return result;
}`
  }
};

const BFSPage: React.FC = () => {
  const [startNode, setStartNode] = useState<number>(0);
  
  // Function to run BFS on a graph and generate visualization steps
  const runBFSAlgorithm = useCallback((graph: { vertices: Vertex[], edges: Edge[], adjacencyList: number[][] }): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const { vertices, edges, adjacencyList } = graph;
    
    // Define the states we'll use
    const unvisitedState: VertexState = 'unvisited';
    const visitingState: VertexState = 'visiting';
    const visitedState: VertexState = 'visited';
    const processedState: VertexState = 'processed';
    
    const normalEdgeState: EdgeState = 'normal';
    const discoveryEdgeState: EdgeState = 'discovery';
    const backEdgeState: EdgeState = 'back';
    
    // Create initial step
    steps.push({
      vertices: vertices.map(v => ({ ...v, state: unvisitedState })),
      edges: edges.map(e => ({ ...e, state: normalEdgeState })),
      description: `Starting BFS from node ${String.fromCharCode(65 + startNode)}`
    });
    
    // Initialize BFS variables
    const queue: number[] = [startNode];
    const visited: Set<number> = new Set([startNode]);
    
    // Create step for marking start node as visiting
    const startVertices = vertices.map(v => 
      v.id === startNode ? { ...v, state: visitingState } : { ...v, state: unvisitedState }
    );
    
    steps.push({
      vertices: startVertices,
      edges: edges.map(e => ({ ...e, state: normalEdgeState })),
      description: `Enqueue start node ${String.fromCharCode(65 + startNode)} and mark it as visiting`
    });
    
    // Run BFS
    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      
      // Create step for processing current node
      const processingVertices = vertices.map(v => {
        if (v.id === currentNode) return { ...v, state: processedState };
        if (visited.has(v.id)) return { ...v, state: visitedState };
        return { ...v, state: unvisitedState };
      });
      
      const processingEdges = edges.map(e => ({ ...e, state: normalEdgeState }));
      
      steps.push({
        vertices: processingVertices,
        edges: processingEdges,
        description: `Processing node ${String.fromCharCode(65 + currentNode)}`
      });
      
      // Visit all neighbors
      for (const neighbor of adjacencyList[currentNode]) {
        if (!visited.has(neighbor)) {
          // Mark edge as discovery
          const currentEdges = edges.map(e => {
            if ((e.from === currentNode && e.to === neighbor) || 
                (e.bidirectional && e.from === neighbor && e.to === currentNode)) {
              return { ...e, state: discoveryEdgeState };
            }
            return { ...e, state: e.state };
          });
          
          // Mark neighbor as visiting
          const currentVertices = vertices.map(v => {
            if (v.id === neighbor) return { ...v, state: visitingState };
            if (v.id === currentNode) return { ...v, state: processedState };
            if (visited.has(v.id)) return { ...v, state: visitedState };
            return { ...v, state: unvisitedState };
          });
          
          steps.push({
            vertices: currentVertices,
            edges: currentEdges,
            description: `Visit neighbor ${String.fromCharCode(65 + neighbor)} of node ${String.fromCharCode(65 + currentNode)}`
          });
          
          // Add neighbor to queue and visited
          queue.push(neighbor);
          visited.add(neighbor);
        } else {
          // Mark edge as back edge (already visited)
          const currentEdges = edges.map(e => {
            if ((e.from === currentNode && e.to === neighbor) || 
                (e.bidirectional && e.from === neighbor && e.to === currentNode)) {
              return { ...e, state: backEdgeState };
            }
            return { ...e, state: e.state };
          });
          
          steps.push({
            vertices: steps[steps.length - 1].vertices,
            edges: currentEdges,
            description: `Node ${String.fromCharCode(65 + neighbor)} has already been visited`
          });
        }
      }
      
      // Mark current node as visited
      const visitedVertices = vertices.map(v => {
        if (v.id === currentNode) return { ...v, state: visitedState };
        if (visited.has(v.id)) return { ...v, state: v.state };
        return { ...v, state: unvisitedState };
      });
      
      steps.push({
        vertices: visitedVertices,
        edges: steps[steps.length - 1].edges,
        description: `Finished processing node ${String.fromCharCode(65 + currentNode)}`
      });
    }
    
    // Final step
    steps.push({
      vertices: vertices.map(v => ({ ...v, state: visited.has(v.id) ? visitedState : unvisitedState })),
      edges: steps[steps.length - 1].edges,
      description: 'BFS traversal complete'
    });
    
    return steps;
  }, [startNode]);
  
  // Generate a random graph specifically for BFS
  const generateBFSGraph = useCallback(() => {
    // Create a connected graph with 8 nodes
    const numVertices = 8;
    const vertices: Vertex[] = [];
    const edges: Edge[] = [];
    const adjacencyList: number[][] = Array(numVertices).fill(0).map(() => []);
    
    const unvisitedState: VertexState = 'unvisited';
    const normalEdgeState: EdgeState = 'normal';
    
    // Create vertices in a circle
    for (let i = 0; i < numVertices; i++) {
      const angle = (i * 2 * Math.PI) / numVertices;
      vertices.push({
        id: i,
        x: 400 + 220 * Math.cos(angle),
        y: 300 + 220 * Math.sin(angle),
        name: String.fromCharCode(65 + i), // A, B, C, ...
        state: unvisitedState
      });
    }
    
    // Ensure graph is connected (create a spanning tree)
    for (let i = 1; i < numVertices; i++) {
      const parent = Math.floor(Math.random() * i);
      edges.push({
        from: parent,
        to: i,
        state: normalEdgeState,
        bidirectional: true
      });
      
      adjacencyList[parent].push(i);
      adjacencyList[i].push(parent);
    }
    
    // Add some random edges
    for (let i = 0; i < numVertices; i++) {
      for (let j = i + 1; j < numVertices; j++) {
        if (!adjacencyList[i].includes(j) && Math.random() < 0.2) {
          edges.push({
            from: i,
            to: j,
            state: normalEdgeState,
            bidirectional: true
          });
          
          adjacencyList[i].push(j);
          adjacencyList[j].push(i);
        }
      }
    }
    
    return { vertices, edges, adjacencyList };
  }, []);
  
  // Legend items
  const legendItems = [
    { color: "#D1D5DB", label: "Unvisited" },
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
  
  return (
    <GraphProblemTemplate
      algorithmInfo={bfsInfo}
      visualizationComponent={visualizationComponent}
      problemDescription={`
        <p>Breadth-First Search (BFS) is one of the most fundamental graph traversal algorithms. It starts at a given node (the "source" or "root") and explores all neighbor nodes at the present depth level before moving on to nodes at the next depth level.</p>
        
        <p>Unlike Depth-First Search (DFS) which explores as far as possible along each branch before backtracking, BFS explores the neighbor nodes first, before moving to the next level neighbors.</p>
        
        <p>BFS is implemented using a queue data structure, which follows the First-In-First-Out (FIFO) principle. This ensures that vertices are visited in order of their distance from the source vertex.</p>
        
        <p><strong>Key Properties:</strong></p>
        <ul>
          <li>BFS finds the shortest path in an unweighted graph</li>
          <li>It visits nodes in increasing order of their distance from the source</li>
          <li>It requires O(V+E) time and O(V) space where V is the number of vertices and E is the number of edges</li>
        </ul>
      `}
      additionalInfo={additionalInfo}
    />
  );
};

export default BFSPage; 