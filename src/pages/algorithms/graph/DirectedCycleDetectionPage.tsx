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
  transition: all 0.3s ease;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
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

const directedCycleDetectionInfo: AlgorithmInfo = {
  name: "Directed Graph Cycle Detection",
  description: "Cycle detection in a directed graph identifies paths that start and end at the same vertex while following directed edges. This algorithm uses Depth-First Search (DFS) with three states of vertices to detect cycles.",
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)'
  },
  spaceComplexity: 'O(V)',
  implementations: {
    javascript: `function hasCycle(graph) {
  // 0: not visited, 1: being visited, 2: visited
  const state = new Array(graph.length).fill(0);
  
  for (let i = 0; i < graph.length; i++) {
    if (state[i] === 0) {
      if (dfs(graph, i, state)) {
        return true;
      }
    }
  }
  
  return false;
}

function dfs(graph, vertex, state) {
  // Mark current node as being visited
  state[vertex] = 1;
  
  // Visit all neighbors
  for (const neighbor of graph[vertex]) {
    // If the neighbor is being visited, we found a cycle
    if (state[neighbor] === 1) {
      return true;
    }
    
    // If the neighbor hasn't been visited yet
    if (state[neighbor] === 0) {
      if (dfs(graph, neighbor, state)) {
        return true;
      }
    }
  }
  
  // Mark current node as visited
  state[vertex] = 2;
  return false;
}`,
    python: `def has_cycle(graph):
    # 0: not visited, 1: being visited, 2: visited
    state = [0] * len(graph)
    
    for i in range(len(graph)):
        if state[i] == 0:
            if dfs(graph, i, state):
                return True
    
    return False

def dfs(graph, vertex, state):
    # Mark current node as being visited
    state[vertex] = 1
    
    # Visit all neighbors
    for neighbor in graph[vertex]:
        # If the neighbor is being visited, we found a cycle
        if state[neighbor] == 1:
            return True
        
        # If the neighbor hasn't been visited yet
        if state[neighbor] == 0:
            if dfs(graph, neighbor, state):
                return True
    
    # Mark current node as visited
    state[vertex] = 2
    return False`,
    java: `public boolean hasCycle(List<List<Integer>> graph) {
    // 0: not visited, 1: being visited, 2: visited
    int[] state = new int[graph.size()];
    
    for (int i = 0; i < graph.size(); i++) {
        if (state[i] == 0) {
            if (dfs(graph, i, state)) {
                return true;
            }
        }
    }
    
    return false;
}

private boolean dfs(List<List<Integer>> graph, int vertex, int[] state) {
    // Mark current node as being visited
    state[vertex] = 1;
    
    // Visit all neighbors
    for (int neighbor : graph.get(vertex)) {
        // If the neighbor is being visited, we found a cycle
        if (state[neighbor] == 1) {
            return true;
        }
        
        // If the neighbor hasn't been visited yet
        if (state[neighbor] == 0) {
            if (dfs(graph, neighbor, state)) {
                return true;
            }
        }
    }
    
    // Mark current node as visited
    state[vertex] = 2;
    return false;
}`,
    cpp: `bool hasCycle(vector<vector<int>>& graph) {
    // 0: not visited, 1: being visited, 2: visited
    vector<int> state(graph.size(), 0);
    
    for (int i = 0; i < graph.size(); i++) {
        if (state[i] == 0) {
            if (dfs(graph, i, state)) {
                return true;
            }
        }
    }
    
    return false;
}

bool dfs(vector<vector<int>>& graph, int vertex, vector<int>& state) {
    // Mark current node as being visited
    state[vertex] = 1;
    
    // Visit all neighbors
    for (int neighbor : graph[vertex]) {
        // If the neighbor is being visited, we found a cycle
        if (state[neighbor] == 1) {
            return true;
        }
        
        // If the neighbor hasn't been visited yet
        if (state[neighbor] == 0) {
            if (dfs(graph, neighbor, state)) {
                return true;
            }
        }
    }
    
    // Mark current node as visited
    state[vertex] = 2;
    return false;
}`
  }
};

const DirectedCycleDetectionPage: React.FC = () => {
  // Define vertex and edge states
  const unvisitedState: VertexState = 'unvisited';
  const visitingState: VertexState = 'visiting';
  const visitedState: VertexState = 'visited';
  
  const normalEdgeState: EdgeState = 'normal';
  const discoveryEdgeState: EdgeState = 'discovery';
  const cycleEdgeState: EdgeState = 'cycle';
  
  // Function to run the directed cycle detection algorithm and generate visualization steps
  const runCycleDetectionAlgorithm = useCallback((graph: { vertices: Vertex[], edges: Edge[], adjacencyList: number[][] }): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const { vertices, edges, adjacencyList } = graph;
    
    // Create initial step
    steps.push({
      vertices: vertices.map(v => ({ ...v, state: unvisitedState })),
      edges: edges.map(e => ({ ...e, state: normalEdgeState })),
      description: "Starting directed cycle detection"
    });
    
    // States for DFS: 0 = unvisited, 1 = visiting, 2 = visited
    const state: number[] = new Array(adjacencyList.length).fill(0);
    const dfsParent: number[] = new Array(adjacencyList.length).fill(-1);
    let cyclePath: number[] | null = null;
    
    // DFS function to detect cycles
    function dfs(vertex: number): boolean {
      // Mark vertex as being visited (in recursion stack)
      state[vertex] = 1;
      
      // Update vertex state for visualization
      const visitingVertices = vertices.map(v => 
        v.id === vertex ? { ...v, state: visitingState } : 
        state[v.id] === 1 ? { ...v, state: visitingState } : 
        state[v.id] === 2 ? { ...v, state: visitedState } : 
        { ...v, state: unvisitedState }
      );
      
      steps.push({
        vertices: visitingVertices,
        edges: [...edges],
        description: `Exploring vertex ${String.fromCharCode(65 + vertex)}`
      });
      
      // Explore all neighbors
      for (const neighbor of adjacencyList[vertex]) {
        // Create a new edges array with the current edge highlighted as discovery
        const currentEdges = edges.map(e => {
          if (e.from === vertex && e.to === neighbor) {
            return { ...e, state: discoveryEdgeState };
          }
          return { ...e, state: e.state };
        });
        
        steps.push({
          vertices: steps[steps.length - 1].vertices,
          edges: currentEdges,
          description: `Checking edge from ${String.fromCharCode(65 + vertex)} to ${String.fromCharCode(65 + neighbor)}`
        });
        
        // If neighbor is being visited, we found a cycle
        if (state[neighbor] === 1) {
          // Mark the cycle edge
          const cycleEdges = currentEdges.map(e => {
            if (e.from === vertex && e.to === neighbor) {
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
        
        // If neighbor hasn't been visited yet
        if (state[neighbor] === 0) {
          dfsParent[neighbor] = vertex;
          
          // If DFS from neighbor finds a cycle, propagate the result
          if (dfs(neighbor)) {
            return true;
          }
        }
        
        // If neighbor is already visited (not in current DFS path)
        if (state[neighbor] === 2) {
          steps.push({
            vertices: steps[steps.length - 1].vertices,
            edges: currentEdges,
            description: `Vertex ${String.fromCharCode(65 + neighbor)} already completely explored`
          });
        }
      }
      
      // Mark vertex as completely visited
      state[vertex] = 2;
      
      // Update vertex state for visualization
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
      if (state[i] === 0) {
        if (dfs(i)) {
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
        description: "No cycle found in the directed graph"
      });
    }
    
    return steps;
  }, [unvisitedState, visitingState, visitedState, normalEdgeState, discoveryEdgeState, cycleEdgeState]);
  
  // Generate a random directed graph
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
    
    // Create a connected graph with directed edges
    for (let i = 0; i < numVertices - 1; i++) {
      edges.push({
        from: i,
        to: i + 1,
        state: normalEdgeState
      });
      adjacencyList[i].push(i + 1);
    }
    
    // Add random edges
    for (let i = 0; i < numVertices; i++) {
      for (let j = 0; j < numVertices; j++) {
        if (i !== j && !adjacencyList[i].includes(j) && Math.random() < 0.2) {
          edges.push({
            from: i,
            to: j,
            state: normalEdgeState
          });
          adjacencyList[i].push(j);
        }
      }
    }
    
    // Ensure there's at least one cycle with reasonable probability
    if (Math.random() < 0.7) {
      // Add a backward edge from a later vertex to an earlier one
      const from = Math.floor(Math.random() * (numVertices - 2)) + 2;
      const to = Math.floor(Math.random() * from);
      
      // Only add if the edge doesn't already exist
      if (!adjacencyList[from].includes(to)) {
        edges.push({
          from,
          to,
          state: normalEdgeState
        });
        adjacencyList[from].push(to);
      }
    }
    
    return { vertices, edges, adjacencyList };
  }, [unvisitedState, normalEdgeState]);
  
  // Legend items
  const legendItems = [
    { color: "#fff", label: "Unvisited" },
    { color: "#ECC94B", label: "Visiting (In DFS stack)" },
    { color: "#10B981", label: "Visited" },
    { color: "#6366F1", label: "Discovery Edge" },
    { color: "#EF4444", label: "Cycle Edge" }
  ];
  
  // Additional information panel
  const additionalInfo = (
    <>
      <InfoPanel>
        <InfoTitle>How Directed Cycle Detection Works</InfoTitle>
        <ul>
          <li>Uses DFS traversal with three vertex states: unvisited, visiting, and visited</li>
          <li>A vertex is marked as "visiting" when first encountered in DFS</li>
          <li>If we encounter a "visiting" vertex again during DFS, we've found a cycle</li>
          <li>A vertex is marked as "visited" after all its neighbors have been processed</li>
        </ul>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications of Directed Cycle Detection</InfoTitle>
        <ul>
          <li>Detecting deadlocks in operating systems</li>
          <li>Finding circular dependencies in packages or modules</li>
          <li>Checking for cyclic dependencies in build systems</li>
          <li>Topological sorting (only possible on DAGs - directed acyclic graphs)</li>
          <li>Detecting infinite loops in program flow analysis</li>
        </ul>
      </InfoPanel>
    </>
  );
  
  // Visualization component
  const visualizationComponent = (
    <>
      <EnhancedGraphProblemVisualizer
        problemType="directed-cycle"
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
      algorithmInfo={directedCycleDetectionInfo}
      visualizationComponent={visualizationComponent}
      problemDescription={`
        <p>Cycle detection in directed graphs is a fundamental problem with applications in many fields, including computer science, mathematics, and systems analysis.</p>
        
        <p>A cycle in a directed graph is a path of vertices and edges that starts and ends at the same vertex, following the edges in their indicated direction. Unlike undirected graphs, where any edge can be traversed in either direction, in directed graphs, cycles must follow edge directions.</p>
        
        <p>This algorithm uses a depth-first search (DFS) approach with a 3-state marking system:</p>
        <ul>
          <li><strong>Unvisited:</strong> Vertex has not been processed yet</li>
          <li><strong>Visiting:</strong> Vertex is currently in the DFS recursion stack</li>
          <li><strong>Visited:</strong> Vertex and all its descendants have been completely processed</li>
        </ul>
        
        <p>A cycle is detected when, during DFS, we encounter a vertex that is currently in the "visiting" state, indicating we've found a path back to a vertex that's still being processed.</p>
      `}
      additionalInfo={additionalInfo}
    />
  );
};

export default DirectedCycleDetectionPage; 