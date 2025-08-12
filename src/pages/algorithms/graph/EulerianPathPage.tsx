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

const eulerianPathInfo: AlgorithmInfo = {
  name: "Eulerian Path",
  description: "An Eulerian path is a path in a graph that visits every edge exactly once. An Eulerian circuit is an Eulerian path that starts and ends on the same vertex. This algorithm finds an Eulerian path if one exists.",
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)'
  },
  spaceComplexity: 'O(V + E)',
  implementations: {
    javascript: `function findEulerianPath(graph) {
  // Find the in-degree and out-degree of each vertex
  const inDegree = new Array(graph.length).fill(0);
  const outDegree = graph.map(edges => edges.length);
  
  for (let i = 0; i < graph.length; i++) {
    for (const neighbor of graph[i]) {
      inDegree[neighbor]++;
    }
  }
  
  // Check if Eulerian path exists
  let startVertex = 0;
  let oddVertices = 0;
  
  for (let i = 0; i < graph.length; i++) {
    if (Math.abs(outDegree[i] - inDegree[i]) > 1) {
      return []; // No Eulerian path
    }
    
    if (outDegree[i] - inDegree[i] === 1) {
      startVertex = i;
      oddVertices++;
    } else if (inDegree[i] - outDegree[i] === 1) {
      oddVertices++;
    }
  }
  
  // For a directed graph to have an Eulerian path:
  // - Either all vertices have equal in-degree and out-degree (Eulerian circuit)
  // - Or exactly one vertex has out-degree = in-degree + 1 (start vertex)
  //   and exactly one vertex has in-degree = out-degree + 1 (end vertex)
  if (oddVertices > 2) {
    return []; // No Eulerian path
  }
  
  // Use Hierholzer's algorithm to find the path
  const path = [];
  const stack = [startVertex];
  const tempGraph = graph.map(neighbors => [...neighbors]);
  
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    
    if (tempGraph[current].length > 0) {
      const next = tempGraph[current].pop();
      stack.push(next);
    } else {
      path.push(stack.pop());
    }
  }
  
  path.reverse();
  
  // Check if all edges were used
  for (const edges of tempGraph) {
    if (edges.length > 0) {
      return []; // Not all edges were used
    }
  }
  
  return path;
}`,
    python: `def find_eulerian_path(graph):
    # Find the in-degree and out-degree of each vertex
    in_degree = [0] * len(graph)
    out_degree = [len(edges) for edges in graph]
    
    for i in range(len(graph)):
        for neighbor in graph[i]:
            in_degree[neighbor] += 1
    
    # Check if Eulerian path exists
    start_vertex = 0
    odd_vertices = 0
    
    for i in range(len(graph)):
        if abs(out_degree[i] - in_degree[i]) > 1:
            return []  # No Eulerian path
        
        if out_degree[i] - in_degree[i] == 1:
            start_vertex = i
            odd_vertices += 1
        elif in_degree[i] - out_degree[i] == 1:
            odd_vertices += 1
    
    # For a directed graph to have an Eulerian path:
    # - Either all vertices have equal in-degree and out-degree (Eulerian circuit)
    # - Or exactly one vertex has out-degree = in-degree + 1 (start vertex)
    #   and exactly one vertex has in-degree = out-degree + 1 (end vertex)
    if odd_vertices > 2:
        return []  # No Eulerian path
    
    # Use Hierholzer's algorithm to find the path
    path = []
    stack = [start_vertex]
    temp_graph = [list(neighbors) for neighbors in graph]
    
    while stack:
        current = stack[-1]
        
        if temp_graph[current]:
            next_vertex = temp_graph[current].pop()
            stack.append(next_vertex)
        else:
            path.append(stack.pop())
    
    path.reverse()
    
    # Check if all edges were used
    for edges in temp_graph:
        if edges:
            return []  # Not all edges were used
    
    return path`,
    java: `public List<Integer> findEulerianPath(List<List<Integer>> graph) {
    // Find the in-degree and out-degree of each vertex
    int[] inDegree = new int[graph.size()];
    int[] outDegree = new int[graph.size()];
    
    for (int i = 0; i < graph.size(); i++) {
        outDegree[i] = graph.get(i).size();
        for (int neighbor : graph.get(i)) {
            inDegree[neighbor]++;
        }
    }
    
    // Check if Eulerian path exists
    int startVertex = 0;
    int oddVertices = 0;
    
    for (int i = 0; i < graph.size(); i++) {
        if (Math.abs(outDegree[i] - inDegree[i]) > 1) {
            return new ArrayList<>(); // No Eulerian path
        }
        
        if (outDegree[i] - inDegree[i] == 1) {
            startVertex = i;
            oddVertices++;
        } else if (inDegree[i] - outDegree[i] == 1) {
            oddVertices++;
        }
    }
    
    // For a directed graph to have an Eulerian path:
    // - Either all vertices have equal in-degree and out-degree (Eulerian circuit)
    // - Or exactly one vertex has out-degree = in-degree + 1 (start vertex)
    //   and exactly one vertex has in-degree = out-degree + 1 (end vertex)
    if (oddVertices > 2) {
        return new ArrayList<>(); // No Eulerian path
    }
    
    // Use Hierholzer's algorithm to find the path
    List<Integer> path = new ArrayList<>();
    Stack<Integer> stack = new Stack<>();
    stack.push(startVertex);
    
    // Copy the graph
    List<List<Integer>> tempGraph = new ArrayList<>();
    for (List<Integer> edges : graph) {
        tempGraph.add(new ArrayList<>(edges));
    }
    
    while (!stack.isEmpty()) {
        int current = stack.peek();
        
        if (!tempGraph.get(current).isEmpty()) {
            int next = tempGraph.get(current).remove(tempGraph.get(current).size() - 1);
            stack.push(next);
        } else {
            path.add(stack.pop());
        }
    }
    
    Collections.reverse(path);
    
    // Check if all edges were used
    for (List<Integer> edges : tempGraph) {
        if (!edges.isEmpty()) {
            return new ArrayList<>(); // Not all edges were used
        }
    }
    
    return path;
}`,
    cpp: `vector<int> findEulerianPath(vector<vector<int>>& graph) {
    // Find the in-degree and out-degree of each vertex
    vector<int> inDegree(graph.size(), 0);
    vector<int> outDegree(graph.size(), 0);
    
    for (int i = 0; i < graph.size(); i++) {
        outDegree[i] = graph[i].size();
        for (int neighbor : graph[i]) {
            inDegree[neighbor]++;
        }
    }
    
    // Check if Eulerian path exists
    int startVertex = 0;
    int oddVertices = 0;
    
    for (int i = 0; i < graph.size(); i++) {
        if (abs(outDegree[i] - inDegree[i]) > 1) {
            return {}; // No Eulerian path
        }
        
        if (outDegree[i] - inDegree[i] == 1) {
            startVertex = i;
            oddVertices++;
        } else if (inDegree[i] - outDegree[i] == 1) {
            oddVertices++;
        }
    }
    
    // For a directed graph to have an Eulerian path:
    // - Either all vertices have equal in-degree and out-degree (Eulerian circuit)
    // - Or exactly one vertex has out-degree = in-degree + 1 (start vertex)
    //   and exactly one vertex has in-degree = out-degree + 1 (end vertex)
    if (oddVertices > 2) {
        return {}; // No Eulerian path
    }
    
    // Use Hierholzer's algorithm to find the path
    vector<int> path;
    stack<int> s;
    s.push(startVertex);
    
    // Copy the graph
    vector<vector<int>> tempGraph = graph;
    
    while (!s.empty()) {
        int current = s.top();
        
        if (!tempGraph[current].empty()) {
            int next = tempGraph[current].back();
            tempGraph[current].pop_back();
            s.push(next);
        } else {
            path.push_back(s.top());
            s.pop();
        }
    }
    
    reverse(path.begin(), path.end());
    
    // Check if all edges were used
    for (const auto& edges : tempGraph) {
        if (!edges.empty()) {
            return {}; // Not all edges were used
        }
    }
    
    return path;
}`
  }
};

// Define custom step interface with eulerianPath
interface EulerianPathStep extends VisualizationStep {
  eulerianPath?: number[];
}

// Update vertex and edge state types to use the allowed values
const unvisitedState: VertexState = 'unvisited';
const currentState: VertexState = 'visiting';
const visitedState: VertexState = 'visited';
const oddDegreeState: VertexState = 'highlighted';

const normalEdgeState: EdgeState = 'normal';
const visitedEdgeState: EdgeState = 'highlighted';
const currentEdgeState: EdgeState = 'discovery';

const EulerianPathPage: React.FC = () => {
  // Function to run the Eulerian path algorithm and generate visualization steps
  const runEulerianPathAlgorithm = useCallback((graph: { vertices: Vertex[], edges: Edge[], adjacencyList: number[][] }): EulerianPathStep[] => {
    const steps: EulerianPathStep[] = [];
    const { vertices, edges, adjacencyList } = graph;
    
    // Create a copy of the graph representation
    const adjList = adjacencyList.map(neighbors => [...neighbors]);
    
    // Create initial step
    steps.push({
      vertices: vertices.map(v => ({ ...v, state: unvisitedState })),
      edges: edges.map(e => ({ ...e, state: normalEdgeState })),
      description: "Starting Eulerian Path algorithm"
    });
    
    // Calculate in-degree and out-degree for each vertex
    const inDegree: number[] = new Array(vertices.length).fill(0);
    const outDegree: number[] = adjList.map(neighbors => neighbors.length);
    
    for (let i = 0; i < adjList.length; i++) {
      for (const neighbor of adjList[i]) {
        inDegree[neighbor]++;
      }
    }
    
    // Identify vertices with odd degree
    const oddVertices: number[] = [];
    let startVertex = 0;
    
    for (let i = 0; i < vertices.length; i++) {
      if (Math.abs(outDegree[i] - inDegree[i]) > 1) {
        // No Eulerian path possible
        steps.push({
          vertices: vertices.map(v => ({ ...v, state: unvisitedState })),
          edges: edges.map(e => ({ ...e, state: normalEdgeState })),
          description: `No Eulerian path possible: vertex ${String.fromCharCode(65 + i)} has |out-degree - in-degree| > 1`
        });
        return steps;
      }
      
      if (outDegree[i] - inDegree[i] === 1) {
        oddVertices.push(i);
        startVertex = i;
      } else if (inDegree[i] - outDegree[i] === 1) {
        oddVertices.push(i);
      }
    }
    
    // Highlight odd degree vertices
    if (oddVertices.length > 0) {
      steps.push({
        vertices: vertices.map(v => 
          oddVertices.includes(v.id) ? { ...v, state: oddDegreeState } : { ...v, state: unvisitedState }
        ),
        edges: edges.map(e => ({ ...e, state: normalEdgeState })),
        description: oddVertices.length === 2 
          ? `Found vertices with odd degree: ${oddVertices.map(v => String.fromCharCode(65 + v)).join(', ')}`
          : `All vertices have equal in-degree and out-degree (Eulerian circuit possible)`
      });
    }
    
    // Check if Eulerian path is possible
    if (oddVertices.length > 2) {
      steps.push({
        vertices: vertices.map(v => ({ ...v, state: unvisitedState })),
        edges: edges.map(e => ({ ...e, state: normalEdgeState })),
        description: `No Eulerian path possible: more than two vertices with odd degree`
      });
      return steps;
    }
    
    // Create a copy of the edges to keep track of visited edges
    const remainingEdges = new Map<string, Edge>();
    edges.forEach(edge => {
      const key = `${edge.from}-${edge.to}`;
      remainingEdges.set(key, { ...edge });
    });
    
    // Use Hierholzer's algorithm to find Eulerian path
    const path: number[] = [];
    const stack: number[] = [startVertex];
    const tempAdjList = adjList.map(neighbors => [...neighbors]);
    
    // Mark start vertex as current
    steps.push({
      vertices: vertices.map(v => 
        v.id === startVertex ? { ...v, state: currentState } : 
        oddVertices.includes(v.id) ? { ...v, state: oddDegreeState } : 
        { ...v, state: unvisitedState }
      ),
      edges: edges.map(e => ({ ...e, state: normalEdgeState })),
      description: `Starting at vertex ${String.fromCharCode(65 + startVertex)}`
    });
    
    // Perform the algorithm
    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      
      if (tempAdjList[current].length > 0) {
        // Get next neighbor
        const next = tempAdjList[current].pop()!;
        
        // Find the edge from current to next
        const edgeKey = `${current}-${next}`;
        
        // Update visualization
        const currentEdges = edges.map(e => {
          if (e.from === current && e.to === next) {
            return { ...e, state: currentEdgeState };
          }
          const key = `${e.from}-${e.to}`;
          return remainingEdges.has(key) ? { ...e, state: normalEdgeState } : { ...e, state: visitedEdgeState };
        });
        
        const currentVertices = vertices.map(v => {
          if (v.id === current) return { ...v, state: currentState };
          if (v.id === next) return { ...v, state: currentState };
          if (path.includes(v.id)) return { ...v, state: visitedState };
          if (oddVertices.includes(v.id)) return { ...v, state: oddDegreeState };
          return { ...v, state: unvisitedState };
        });
        
        steps.push({
          vertices: currentVertices,
          edges: currentEdges,
          description: `Moving from vertex ${String.fromCharCode(65 + current)} to ${String.fromCharCode(65 + next)}`
        });
        
        // Mark edge as visited
        remainingEdges.delete(edgeKey);
        
        // Push next vertex to stack
        stack.push(next);
      } else {
        // No more edges from current vertex, add to path
        const popped = stack.pop()!;
        path.push(popped);
        
        // Update visualization
        const currentVertices = vertices.map(v => {
          if (stack.length > 0 && v.id === stack[stack.length - 1]) return { ...v, state: currentState };
          if (path.includes(v.id)) return { ...v, state: visitedState };
          if (oddVertices.includes(v.id)) return { ...v, state: oddDegreeState };
          return { ...v, state: unvisitedState };
        });
        
        steps.push({
          vertices: currentVertices,
          edges: edges.map(e => {
            const key = `${e.from}-${e.to}`;
            return remainingEdges.has(key) ? { ...e, state: normalEdgeState } : { ...e, state: visitedEdgeState };
          }),
          description: `No more edges from vertex ${String.fromCharCode(65 + popped)}, adding to path`
        });
      }
    }
    
    // Reverse the path to get the correct order
    path.reverse();
    
    // Add final step showing the complete path
    const pathStr = path.map(v => String.fromCharCode(65 + v)).join(' → ');
    steps.push({
      vertices: vertices.map(v => ({ ...v, state: visitedState })),
      edges: edges.map(e => ({ ...e, state: visitedEdgeState })),
      description: `Eulerian path found: ${pathStr}`,
      eulerianPath: path
    });
    
    return steps;
  }, [unvisitedState, currentState, visitedState, oddDegreeState, normalEdgeState, visitedEdgeState, currentEdgeState]);
  
  // Generate a random graph that has an Eulerian path
  const generateRandomGraph = useCallback(() => {
    const numVertices = 6;
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
    
    // Generate a random graph with high probability of having an Eulerian path
    
    // Determine if we want a circuit (all vertices have even degree) or a path (exactly two vertices have odd degree)
    const createCircuit = Math.random() < 0.5;
    
    if (createCircuit) {
      // Create a circuit by ensuring all vertices have equal in-degree and out-degree
      
      // First, create a basic cycle to ensure connectivity
      for (let i = 0; i < numVertices; i++) {
        const nextVertex = (i + 1) % numVertices;
        edges.push({
          from: i,
          to: nextVertex,
          state: normalEdgeState
        });
        adjacencyList[i].push(nextVertex);
      }
      
      // Add some random edges to make it more interesting, ensuring balanced in/out degrees
      for (let i = 0; i < numVertices; i++) {
        for (let j = 0; j < numVertices; j++) {
          if (i !== j && Math.random() < 0.2) {
            // Add two edges to maintain balance: i->j and j->i
            if (!adjacencyList[i].includes(j)) {
              edges.push({
                from: i,
                to: j,
                state: normalEdgeState
              });
              adjacencyList[i].push(j);
            }
            
            if (!adjacencyList[j].includes(i)) {
              edges.push({
                from: j,
                to: i,
                state: normalEdgeState
              });
              adjacencyList[j].push(i);
            }
          }
        }
      }
    } else {
      // Create a path with exactly two odd-degree vertices
      
      // Choose start and end vertices
      const startVertex = 0;
      const endVertex = numVertices - 1;
      
      // Create a path from start to end
      for (let i = 0; i < numVertices - 1; i++) {
        edges.push({
          from: i,
          to: i + 1,
          state: normalEdgeState
        });
        adjacencyList[i].push(i + 1);
      }
      
      // Add random edges, maintaining in/out degree balance for all except start and end
      for (let i = 0; i < numVertices; i++) {
        for (let j = 0; j < numVertices; j++) {
          if (i !== j && Math.random() < 0.2) {
            if (i !== startVertex && i !== endVertex && j !== startVertex && j !== endVertex) {
              // For middle vertices, maintain balance
              if (!adjacencyList[i].includes(j)) {
                edges.push({
                  from: i,
                  to: j,
                  state: normalEdgeState
                });
                adjacencyList[i].push(j);
              }
              
              if (!adjacencyList[j].includes(i)) {
                edges.push({
                  from: j,
                  to: i,
                  state: normalEdgeState
                });
                adjacencyList[j].push(i);
              }
            } else if (i === startVertex && j !== endVertex) {
              // Start vertex can have one more out-degree
              if (!adjacencyList[i].includes(j)) {
                edges.push({
                  from: i,
                  to: j,
                  state: normalEdgeState
                });
                adjacencyList[i].push(j);
              }
            } else if (i !== startVertex && j === endVertex) {
              // End vertex can have one more in-degree
              if (!adjacencyList[i].includes(j)) {
                edges.push({
                  from: i,
                  to: j,
                  state: normalEdgeState
                });
                adjacencyList[i].push(j);
              }
            }
          }
        }
      }
    }
    
    return { vertices, edges, adjacencyList };
  }, [unvisitedState, normalEdgeState]);
  
  // Legend items
  const legendItems = [
    { color: "#E2E8F0", label: "Unvisited Vertex" },
    { color: "#10B981", label: "Visited Vertex" },
    { color: "#3B82F6", label: "Current Vertex" },
    { color: "#F59E0B", label: "Odd Degree Vertex" },
    { color: "#E2E8F0", label: "Unvisited Edge" },
    { color: "#10B981", label: "Visited Edge" },
    { color: "#3B82F6", label: "Current Edge" }
  ];
  
  // Additional information panel
  const additionalInfo = (
    <>
      <InfoPanel>
        <InfoTitle>Conditions for Eulerian Path</InfoTitle>
        <ul>
          <li><strong>Directed Graph:</strong> Either all vertices have equal in-degree and out-degree (Eulerian circuit), or exactly one vertex has out-degree = in-degree + 1 and exactly one vertex has in-degree = out-degree + 1 (Eulerian path)</li>
          <li><strong>Undirected Graph:</strong> Either all vertices have even degree (Eulerian circuit), or exactly two vertices have odd degree (Eulerian path)</li>
          <li>The graph must be connected (excluding isolated vertices)</li>
        </ul>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Hierholzer's Algorithm</InfoTitle>
        <ul>
          <li>Start at a vertex with odd out-degree (or any vertex if all have even degree)</li>
          <li>Follow edges, deleting them as you go, until you return to the start vertex</li>
          <li>If there are unused edges, find a vertex in the current path with unused edges and start a new trail from there</li>
          <li>Merge the new trail into the existing path</li>
          <li>Repeat until all edges are used</li>
        </ul>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications of Eulerian Path</InfoTitle>
        <ul>
          <li>Circuit design in electronics</li>
          <li>Route planning for garbage collection, snow plowing, and mail delivery</li>
          <li>DNA fragment assembly in bioinformatics</li>
          <li>Solving the "Seven Bridges of Königsberg" problem</li>
          <li>Chinese Postman Problem (finding a minimum-cost path that traverses all edges)</li>
        </ul>
      </InfoPanel>
    </>
  );
  
  // Visualization component
  const visualizationComponent = (
    <>
      <EnhancedGraphProblemVisualizer
        problemType="eulerian-path"
        height="650px"
        nodeRadius={25}
        showEdgeWeights={false}
        autoFit={true}
        allowZoomPan={true}
        generateNewGraph={generateRandomGraph}
        runAlgorithm={runEulerianPathAlgorithm}
      />
      
      <LegendContainer>
        <Legend items={legendItems} />
      </LegendContainer>
    </>
  );
  
  return (
    <GraphProblemTemplate
      algorithmInfo={eulerianPathInfo}
      visualizationComponent={visualizationComponent}
      problemDescription={`
        <p>An Eulerian path is a path in a graph that visits every edge exactly once. If the path starts and ends at the same vertex, it's called an Eulerian circuit or Eulerian cycle.</p>
        
        <p>This concept is named after the famous Swiss mathematician Leonhard Euler, who solved the Seven Bridges of Königsberg problem in 1736, laying the foundation for graph theory.</p>
        
        <p><strong>For a directed graph to have an Eulerian path:</strong></p>
        <ul>
          <li>At most one vertex can have (out-degree) - (in-degree) = 1 (the start vertex)</li>
          <li>At most one vertex can have (in-degree) - (out-degree) = 1 (the end vertex)</li>
          <li>All other vertices must have equal in-degree and out-degree</li>
          <li>All vertices with non-zero degree must be connected in the underlying undirected graph</li>
        </ul>
        
        <p><strong>For an Eulerian circuit to exist:</strong></p>
        <ul>
          <li>Every vertex must have equal in-degree and out-degree</li>
          <li>All vertices with non-zero degree must be connected in the underlying undirected graph</li>
        </ul>
        
        <p>The visualization shows Hierholzer's algorithm, an efficient method for finding Eulerian paths and circuits.</p>
      `}
      additionalInfo={additionalInfo}
    />
  );
};

export default EulerianPathPage; 