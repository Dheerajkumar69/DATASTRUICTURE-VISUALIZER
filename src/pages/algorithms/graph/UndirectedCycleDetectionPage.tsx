import React, { useCallback } from 'react';
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

const undirectedCycleDetectionInfo: AlgorithmInfo = {
  name: "Undirected Graph Cycle Detection",
  description: "Cycle detection in an undirected graph is the problem of identifying if a graph contains any cycles, which are paths that start and end at the same vertex. This algorithm uses Depth-First Search (DFS) to detect cycles.",
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)'
  },
  spaceComplexity: 'O(V)',
  implementations: {
    javascript: `function hasCycle(graph) {
  const visited = new Set();
  
  function dfs(vertex, parent) {
    visited.add(vertex);
    
    for (const neighbor of graph[vertex]) {
      // If the neighbor is the parent, skip it
      if (neighbor === parent) continue;
      
      // If the neighbor is already visited, we found a cycle
      if (visited.has(neighbor)) {
        return true;
      }
      
      // Recursively check for cycles
      if (dfs(neighbor, vertex)) {
        return true;
      }
    }
    
    return false;
  }
  
  // Check for cycles starting from each unvisited vertex
  for (let vertex = 0; vertex < graph.length; vertex++) {
    if (!visited.has(vertex)) {
      if (dfs(vertex, -1)) {
        return true;
      }
    }
  }
  
  return false;
}`,
    python: `def has_cycle(graph):
    visited = set()
    
    def dfs(vertex, parent):
        visited.add(vertex)
        
        for neighbor in graph[vertex]:
            # Skip the parent vertex
            if neighbor == parent:
                continue
            
            # If the neighbor is already visited, we found a cycle
            if neighbor in visited:
                return True
            
            # Recursively check for cycles
            if dfs(neighbor, vertex):
                return True
        
        return False
    
    # Check for cycles starting from each unvisited vertex
    for vertex in range(len(graph)):
        if vertex not in visited:
            if dfs(vertex, -1):
                return True
    
    return False`,
    java: `public boolean hasCycle(List<List<Integer>> graph) {
    Set<Integer> visited = new HashSet<>();
    
    for (int vertex = 0; vertex < graph.size(); vertex++) {
        if (!visited.contains(vertex)) {
            if (dfs(graph, vertex, -1, visited)) {
                return true;
            }
        }
    }
    
    return false;
}

private boolean dfs(List<List<Integer>> graph, int vertex, int parent, Set<Integer> visited) {
    visited.add(vertex);
    
    for (int neighbor : graph.get(vertex)) {
        // Skip the parent vertex
        if (neighbor == parent) {
            continue;
        }
        
        // If the neighbor is already visited, we found a cycle
        if (visited.contains(neighbor)) {
            return true;
        }
        
        // Recursively check for cycles
        if (dfs(graph, neighbor, vertex, visited)) {
            return true;
        }
    }
    
    return false;
}`,
    cpp: `bool hasCycle(vector<vector<int>>& graph) {
    unordered_set<int> visited;
    
    for (int vertex = 0; vertex < graph.size(); vertex++) {
        if (visited.find(vertex) == visited.end()) {
            if (dfs(graph, vertex, -1, visited)) {
                return true;
            }
        }
    }
    
    return false;
}

bool dfs(vector<vector<int>>& graph, int vertex, int parent, unordered_set<int>& visited) {
    visited.insert(vertex);
    
    for (int neighbor : graph[vertex]) {
        // Skip the parent vertex
        if (neighbor == parent) {
            continue;
        }
        
        // If the neighbor is already visited, we found a cycle
        if (visited.find(neighbor) != visited.end()) {
            return true;
        }
        
        // Recursively check for cycles
        if (dfs(graph, neighbor, vertex, visited)) {
            return true;
        }
    }
    
    return false;
}`
  }
};

const UndirectedCycleDetectionPage: React.FC = () => {
  // Define vertex and edge states
  const unvisitedState: VertexState = 'unvisited';
  const visitingState: VertexState = 'visiting';
  const visitedState: VertexState = 'visited';
  
  const normalEdgeState: EdgeState = 'normal';
  const discoveryEdgeState: EdgeState = 'discovery';
  const cycleEdgeState: EdgeState = 'cycle';
  const backEdgeState: EdgeState = 'back';
  
  // Function to run the undirected cycle detection algorithm and generate visualization steps
  const runCycleDetectionAlgorithm = useCallback((graph: { vertices: Vertex[], edges: Edge[], adjacencyList: number[][] }): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const { vertices, edges, adjacencyList } = graph;
    
    // Create initial step
    steps.push({
      vertices: vertices.map(v => ({ ...v, state: unvisitedState })),
      edges: edges.map(e => ({ ...e, state: normalEdgeState })),
      description: "Starting undirected cycle detection"
    });
    
    // For DFS traversal
    const visited = new Set<number>();
    const dfsParent: number[] = new Array(adjacencyList.length).fill(-1);
    let cyclePath: number[] | null = null;
    
    // DFS function to detect cycles
    function dfs(vertex: number, parent: number): boolean {
      // Mark current vertex as visiting
      visited.add(vertex);
      
      // Update vertex state for visualization
      const visitingVertices = vertices.map(v => 
        v.id === vertex ? { ...v, state: visitingState } : 
        visited.has(v.id) ? { ...v, state: visitedState } : 
        { ...v, state: unvisitedState }
      );
      
      steps.push({
        vertices: visitingVertices,
        edges: [...edges],
        description: `Exploring vertex ${String.fromCharCode(65 + vertex)}${parent !== -1 ? ` from parent ${String.fromCharCode(65 + parent)}` : ''}`
      });
      
      // Check all neighbors
      for (const neighbor of adjacencyList[vertex]) {
        // Skip the parent vertex
        if (neighbor === parent) {
          // Just highlight the edge to show we're skipping it
          const currentEdges = edges.map(e => {
            if ((e.from === vertex && e.to === neighbor) || 
                (e.bidirectional && e.from === neighbor && e.to === vertex)) {
              return { ...e, state: backEdgeState };
            }
            return { ...e, state: e.state };
          });
          
          steps.push({
            vertices: steps[steps.length - 1].vertices,
            edges: currentEdges,
            description: `Skipping edge to parent ${String.fromCharCode(65 + neighbor)}`
          });
          
          continue;
        }
        
        // Highlight the current edge we're exploring
        const currentEdges = edges.map(e => {
          if ((e.from === vertex && e.to === neighbor) || 
              (e.bidirectional && e.from === neighbor && e.to === vertex)) {
            return { ...e, state: discoveryEdgeState };
          }
          return { ...e, state: e.state };
        });
        
        steps.push({
          vertices: steps[steps.length - 1].vertices,
          edges: currentEdges,
          description: `Checking edge from ${String.fromCharCode(65 + vertex)} to ${String.fromCharCode(65 + neighbor)}`
        });
        
        // If the neighbor is already visited but not the parent, we found a cycle
        if (visited.has(neighbor)) {
          // Mark the cycle edge
          const cycleEdges = currentEdges.map(e => {
            if ((e.from === vertex && e.to === neighbor) || 
                (e.bidirectional && e.from === neighbor && e.to === vertex)) {
              return { ...e, state: cycleEdgeState };
            }
            return { ...e, state: e.state };
          });
          
          // Reconstruct the cycle path
          cyclePath = [vertex, neighbor];
          let current = vertex;
          while (dfsParent[current] !== -1) {
            cyclePath.unshift(dfsParent[current]);
            current = dfsParent[current];
            if (current === neighbor) break; // Avoid infinite loop
          }
          
          steps.push({
            vertices: steps[steps.length - 1].vertices,
            edges: cycleEdges,
            description: `Cycle detected! Found back edge from ${String.fromCharCode(65 + vertex)} to ${String.fromCharCode(65 + neighbor)}`,
            cyclePath
          });
          
          return true;
        }
        
        // If the neighbor is not visited, continue DFS from there
        if (!visited.has(neighbor)) {
          dfsParent[neighbor] = vertex;
          
          // Recursively check for cycles
          if (dfs(neighbor, vertex)) {
            return true;
          }
        }
      }
      
      // Mark vertex as completely visited
      const updatedVertices = steps[steps.length - 1].vertices.map(v => 
        v.id === vertex ? { ...v, state: visitedState } : v
      );
      
      steps.push({
        vertices: updatedVertices,
        edges: steps[steps.length - 1].edges,
        description: `Finished exploring vertex ${String.fromCharCode(65 + vertex)}`
      });
      
      return false;
    }
    
    // Start DFS from each unvisited vertex
    for (let i = 0; i < adjacencyList.length; i++) {
      if (!visited.has(i)) {
        if (dfs(i, -1)) {
          // Cycle was found, no need to continue
          break;
        }
      }
    }
    
    // Final step - indicate if no cycle was found
    if (!cyclePath) {
      steps.push({
        vertices: steps[steps.length - 1].vertices,
        edges: steps[steps.length - 1].edges,
        description: "No cycle found in the undirected graph"
      });
    }
    
    return steps;
  }, [unvisitedState, visitingState, visitedState, normalEdgeState, discoveryEdgeState, cycleEdgeState, backEdgeState]);
  
  // Generate a random undirected graph
  const generateRandomGraph = useCallback(() => {
    const numVertices = 7;
    const vertices: Vertex[] = [];
    const edges: Edge[] = [];
    const adjacencyList: number[][] = Array(numVertices).fill(0).map(() => []);
    
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
    
    // Create a spanning tree to ensure the graph is connected
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
    
    // Add some random edges to potentially create cycles
    for (let i = 0; i < numVertices; i++) {
      for (let j = i + 1; j < numVertices; j++) {
        if (!adjacencyList[i].includes(j) && Math.random() < 0.3) {
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
  }, [unvisitedState, normalEdgeState]);
  
  // Legend items
  const legendItems = [
    { color: "#D1D5DB", label: "Unvisited" },
    { color: "#ECC94B", label: "Visiting" },
    { color: "#10B981", label: "Visited" },
    { color: "#6366F1", label: "Discovery Edge" },
    { color: "#EF4444", label: "Cycle Edge" },
    { color: "#F59E0B", label: "Parent Edge" }
  ];
  
  // Additional information panel
  const additionalInfo = (
    <>
      <InfoPanel>
        <InfoTitle>How Undirected Cycle Detection Works</InfoTitle>
        <ul>
          <li>Uses DFS traversal to explore the graph</li>
          <li>For each vertex, we explore all unvisited neighbors</li>
          <li>We keep track of the parent vertex to avoid false cycles</li>
          <li>If we encounter an already visited vertex that is not the parent, we've found a cycle</li>
        </ul>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Key Differences from Directed Cycle Detection</InfoTitle>
        <ul>
          <li>Must track the parent vertex to avoid considering the edge we just came from as a cycle</li>
          <li>In undirected graphs, an edge from A to B is the same as an edge from B to A</li>
          <li>All edges are bidirectional, meaning we can move in either direction</li>
        </ul>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications of Undirected Cycle Detection</InfoTitle>
        <ul>
          <li>Detecting redundant connections in networks</li>
          <li>Verifying that a graph is a tree (a tree is a connected graph with no cycles)</li>
          <li>Circuit analysis in electrical engineering</li>
          <li>Finding minimal spanning trees in networks</li>
          <li>Detecting circular dependencies in systems</li>
        </ul>
      </InfoPanel>
    </>
  );
  
  // Visualization component
  const visualizationComponent = (
    <>
      <EnhancedGraphProblemVisualizer
        problemType="undirected-cycle"
        height="650px"
        nodeRadius={25}
        showEdgeWeights={false}
        autoFit={true}
        allowZoomPan={true}
        generateNewGraph={generateRandomGraph}
        runAlgorithm={runCycleDetectionAlgorithm}
      />
      
      <LegendContainer>
        <Legend items={legendItems} />
      </LegendContainer>
    </>
  );
  
  return (
    <GraphProblemTemplate
      algorithmInfo={undirectedCycleDetectionInfo}
      visualizationComponent={visualizationComponent}
      problemDescription={`
        <p>Cycle detection in undirected graphs is a fundamental problem with applications in various fields of computer science and engineering.</p>
        
        <p>A cycle in an undirected graph is a path of vertices and edges that starts and ends at the same vertex, with no vertices or edges repeated except for the start/end vertex.</p>
        
        <p>The algorithm uses depth-first search (DFS) with a key modification:</p>
        <ul>
          <li>When visiting neighbors, we ignore the vertex we just came from (the parent)</li>
          <li>If we encounter an already visited vertex that's not the parent, we've found a cycle</li>
          <li>This approach properly handles the undirected nature of edges</li>
        </ul>
        
        <p>The algorithm is simple but powerful, with linear time complexity of O(V + E) where V is the number of vertices and E is the number of edges.</p>
      `}
      additionalInfo={additionalInfo}
    />
  );
};

export default UndirectedCycleDetectionPage; 