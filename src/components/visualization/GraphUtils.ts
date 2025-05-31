import { Vertex, Edge } from './GraphVisualizer';

/**
 * Generate a random graph with vertices arranged in a circle
 * @param numVertices Number of vertices in the graph
 * @param edgeProbability Probability (0-1) of creating an edge between any two vertices
 * @param directed Whether the graph is directed
 * @param radius Radius of the circle to position vertices
 * @param centerX X coordinate of the center of the circle
 * @param centerY Y coordinate of the center of the circle
 * @param allowCycles Whether to allow cycles in the graph (if false, will create a DAG)
 */
export function generateRandomGraph(
  numVertices: number = 7,
  edgeProbability: number = 0.3,
  directed: boolean = true,
  radius: number = 220,
  centerX: number = 400,
  centerY: number = 250,
  allowCycles: boolean = true
): { vertices: Vertex[], edges: Edge[], adjacencyList: number[][] } {
  // Create vertices in a circle layout
  const vertices: Vertex[] = [];
  for (let i = 0; i < numVertices; i++) {
    const angle = (i * 2 * Math.PI) / numVertices;
    vertices.push({
      id: i,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      name: String.fromCharCode(65 + i), // A, B, C, ...
      state: 'unvisited'
    });
  }
  
  // Initialize adjacency list
  const adjacencyList: number[][] = Array(numVertices).fill(0).map(() => []);
  
  // Create edges
  const edges: Edge[] = [];
  
  // First, ensure the graph is connected by creating a path through all vertices
  for (let i = 0; i < numVertices - 1; i++) {
    edges.push({
      from: i,
      to: i + 1,
      state: 'normal',
      bidirectional: !directed
    });
    
    adjacencyList[i].push(i + 1);
    if (!directed) {
      adjacencyList[i + 1].push(i);
    }
  }
  
  // Add random edges
  for (let i = 0; i < numVertices; i++) {
    for (let j = 0; j < numVertices; j++) {
      // Skip self-loops and existing edges
      if (i === j || adjacencyList[i].includes(j)) continue;
      
      // If not allowing cycles and edge would create a cycle in a directed graph, skip
      if (!allowCycles && directed && j < i) continue;
      
      // Add edge with given probability
      if (Math.random() < edgeProbability) {
        edges.push({
          from: i,
          to: j,
          state: 'normal',
          bidirectional: !directed
        });
        
        adjacencyList[i].push(j);
        if (!directed) {
          adjacencyList[j].push(i);
        }
      }
    }
  }
  
  // Ensure there's at least one cycle if allowed and directed
  if (allowCycles && directed && Math.random() > 0.5) {
    // Add a backward edge to create a cycle
    const from = Math.floor(Math.random() * (numVertices - 2)) + 2;
    const to = Math.floor(Math.random() * from);
    
    // Only add if the edge doesn't already exist
    if (!adjacencyList[from].includes(to)) {
      edges.push({
        from,
        to,
        state: 'normal'
      });
      adjacencyList[from].push(to);
    }
  }
  
  return { vertices, edges, adjacencyList };
}

/**
 * Apply a force-directed layout algorithm to improve the graph visualization
 * @param vertices The vertices to arrange
 * @param edges The edges between vertices
 * @param iterations Number of iterations to run the algorithm
 * @param width Canvas width
 * @param height Canvas height
 * @param margin Margin to maintain from edges
 */
export function applyForceDirectedLayout(
  vertices: Vertex[],
  edges: Edge[],
  iterations: number = 50,
  width: number = 600,
  height: number = 400,
  margin: number = 50
): Vertex[] {
  // Create a deep copy of vertices to avoid modifying the original
  const newVertices = JSON.parse(JSON.stringify(vertices)) as Vertex[];
  
  // Parameters for the force-directed algorithm
  const k = Math.sqrt((width - 2 * margin) * (height - 2 * margin) / newVertices.length); // Optimal distance
  const repulsionForce = (d: number) => k * k / d;
  const attractionForce = (d: number) => d * d / k;
  
  // Create an adjacency matrix for quick lookups
  const adjacent: boolean[][] = [];
  for (let i = 0; i < newVertices.length; i++) {
    adjacent[i] = [];
    for (let j = 0; j < newVertices.length; j++) {
      adjacent[i][j] = false;
    }
  }
  
  for (const edge of edges) {
    adjacent[edge.from][edge.to] = true;
    if (edge.bidirectional) {
      adjacent[edge.to][edge.from] = true;
    }
  }
  
  // Run force-directed algorithm
  for (let iter = 0; iter < iterations; iter++) {
    // Calculate repulsive forces between all pairs of vertices
    const displacement: { x: number, y: number }[] = newVertices.map(() => ({ x: 0, y: 0 }));
    
    for (let i = 0; i < newVertices.length; i++) {
      for (let j = 0; j < newVertices.length; j++) {
        if (i === j) continue;
        
        const dx = newVertices[j].x - newVertices[i].x;
        const dy = newVertices[j].y - newVertices[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.1; // Avoid division by zero
        
        // Apply repulsive force
        const force = repulsionForce(distance);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        
        displacement[i].x -= fx;
        displacement[i].y -= fy;
        displacement[j].x += fx;
        displacement[j].y += fy;
      }
    }
    
    // Calculate attractive forces along edges
    for (const edge of edges) {
      const i = edge.from;
      const j = edge.to;
      
      const dx = newVertices[j].x - newVertices[i].x;
      const dy = newVertices[j].y - newVertices[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
      
      // Apply attractive force
      const force = attractionForce(distance);
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      
      displacement[i].x += fx;
      displacement[i].y += fy;
      displacement[j].x -= fx;
      displacement[j].y -= fy;
    }
    
    // Apply displacements with a decreasing factor
    const factor = 0.9 * (1 - iter / iterations);
    for (let i = 0; i < newVertices.length; i++) {
      const dx = displacement[i].x;
      const dy = displacement[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
      
      // Limit displacement to avoid explosions
      const maxDisplacement = Math.min(distance, 10);
      
      newVertices[i].x += (dx / distance) * maxDisplacement * factor;
      newVertices[i].y += (dy / distance) * maxDisplacement * factor;
      
      // Keep vertices within bounds
      newVertices[i].x = Math.max(margin, Math.min(width - margin, newVertices[i].x));
      newVertices[i].y = Math.max(margin, Math.min(height - margin, newVertices[i].y));
    }
  }
  
  return newVertices;
}

/**
 * Detect cycles in a directed graph using DFS
 * @param adjacencyList Adjacency list representation of the graph
 * @returns Object containing whether a cycle was found and the cycle path if found
 */
export function detectDirectedCycle(adjacencyList: number[][]): { 
  hasCycle: boolean, 
  cyclePath: number[] | null,
  steps: Array<{
    vertices: Vertex[],
    edges: Edge[],
    description: string,
    currentVertex: number | null,
    cyclePath: number[] | null
  }>
} {
  const n = adjacencyList.length;
  // 0: not visited, 1: being visited, 2: visited
  const state: number[] = new Array(n).fill(0);
  const parent: number[] = new Array(n).fill(-1);
  let hasCycle = false;
  let cyclePath: number[] | null = null;
  
  // For tracking steps
  let vertices: Vertex[] = [];
  let edges: Edge[] = [];
  const steps: Array<{
    vertices: Vertex[],
    edges: Edge[],
    description: string,
    currentVertex: number | null,
    cyclePath: number[] | null
  }> = [];
  
  // Create vertices for visualization
  for (let i = 0; i < n; i++) {
    vertices.push({
      id: i,
      x: 100 + 150 * Math.cos((i * 2 * Math.PI) / n),
      y: 100 + 150 * Math.sin((i * 2 * Math.PI) / n),
      name: String.fromCharCode(65 + i),
      state: 'unvisited'
    });
  }
  
  // Create edges for visualization
  for (let i = 0; i < n; i++) {
    for (const j of adjacencyList[i]) {
      edges.push({
        from: i,
        to: j,
        state: 'normal'
      });
    }
  }
  
  steps.push({
    vertices: JSON.parse(JSON.stringify(vertices)),
    edges: JSON.parse(JSON.stringify(edges)),
    description: "Starting cycle detection in the directed graph",
    currentVertex: null,
    cyclePath: null
  });
  
  function dfs(vertex: number): boolean {
    // Mark as being visited
    state[vertex] = 1;
    vertices = vertices.map(v => 
      v.id === vertex ? { ...v, state: 'visiting' } : v
    );
    
    steps.push({
      vertices: JSON.parse(JSON.stringify(vertices)),
      edges: JSON.parse(JSON.stringify(edges)),
      description: `Exploring vertex ${String.fromCharCode(65 + vertex)}`,
      currentVertex: vertex,
      cyclePath: null
    });
    
    // Visit all neighbors
    for (const neighbor of adjacencyList[vertex]) {
      // Update edge state to discovery
      edges = edges.map(e => 
        e.from === vertex && e.to === neighbor ? { ...e, state: 'discovery' } : e
      );
      
      steps.push({
        vertices: JSON.parse(JSON.stringify(vertices)),
        edges: JSON.parse(JSON.stringify(edges)),
        description: `Checking neighbor ${String.fromCharCode(65 + neighbor)} of vertex ${String.fromCharCode(65 + vertex)}`,
        currentVertex: vertex,
        cyclePath: null
      });
      
      // If neighbor is being visited, we found a cycle
      if (state[neighbor] === 1) {
        // Found a back edge, which indicates a cycle
        hasCycle = true;
        
        // Update edge state to cycle
        edges = edges.map(e => 
          e.from === vertex && e.to === neighbor ? { ...e, state: 'cycle' } : e
        );
        
        // Reconstruct the cycle path
        cyclePath = [vertex, neighbor];
        let current = vertex;
        while (parent[current] !== -1 && !cyclePath.includes(parent[current])) {
          cyclePath.unshift(parent[current]);
          current = parent[current];
        }
        
        steps.push({
          vertices: JSON.parse(JSON.stringify(vertices)),
          edges: JSON.parse(JSON.stringify(edges)),
          description: `Cycle detected! Found a back edge from ${String.fromCharCode(65 + vertex)} to ${String.fromCharCode(65 + neighbor)}`,
          currentVertex: vertex,
          cyclePath
        });
        
        return true;
      }
      
      // If neighbor hasn't been visited yet, visit it
      if (state[neighbor] === 0) {
        parent[neighbor] = vertex;
        
        if (dfs(neighbor)) {
          return true;
        }
      }
    }
    
    // Mark vertex as visited
    state[vertex] = 2;
    vertices = vertices.map(v => 
      v.id === vertex ? { ...v, state: 'visited' } : v
    );
    
    steps.push({
      vertices: JSON.parse(JSON.stringify(vertices)),
      edges: JSON.parse(JSON.stringify(edges)),
      description: `Finished exploring vertex ${String.fromCharCode(65 + vertex)}`,
      currentVertex: vertex,
      cyclePath
    });
    
    return false;
  }
  
  // Start DFS from each unvisited vertex
  for (let i = 0; i < n; i++) {
    if (state[i] === 0) {
      if (dfs(i)) {
        break;
      }
    }
  }
  
  if (!hasCycle) {
    steps.push({
      vertices: JSON.parse(JSON.stringify(vertices)),
      edges: JSON.parse(JSON.stringify(edges)),
      description: "No cycle found in the graph",
      currentVertex: null,
      cyclePath: null
    });
  }
  
  return { hasCycle, cyclePath, steps };
}

/**
 * Detect cycles in an undirected graph using DFS
 * @param adjacencyList Adjacency list representation of the graph
 * @returns Object containing whether a cycle was found and the cycle path if found
 */
export function detectUndirectedCycle(adjacencyList: number[][]): { 
  hasCycle: boolean, 
  cyclePath: number[] | null,
  steps: Array<{
    vertices: Vertex[],
    edges: Edge[],
    description: string,
    currentVertex: number | null,
    cyclePath: number[] | null
  }>
} {
  const n = adjacencyList.length;
  const visited: boolean[] = new Array(n).fill(false);
  const parent: number[] = new Array(n).fill(-1);
  let hasCycle = false;
  let cyclePath: number[] | null = null;
  
  // For tracking steps
  let vertices: Vertex[] = [];
  let edges: Edge[] = [];
  const steps: Array<{
    vertices: Vertex[],
    edges: Edge[],
    description: string,
    currentVertex: number | null,
    cyclePath: number[] | null
  }> = [];
  
  // Create vertices for visualization
  for (let i = 0; i < n; i++) {
    vertices.push({
      id: i,
      x: 100 + 150 * Math.cos((i * 2 * Math.PI) / n),
      y: 100 + 150 * Math.sin((i * 2 * Math.PI) / n),
      name: String.fromCharCode(65 + i),
      state: 'unvisited'
    });
  }
  
  // Create edges for visualization (make sure they're bidirectional)
  const edgeSet = new Set<string>();
  for (let i = 0; i < n; i++) {
    for (const j of adjacencyList[i]) {
      const minNode = Math.min(i, j);
      const maxNode = Math.max(i, j);
      const edgeKey = `${minNode}-${maxNode}`;
      
      if (!edgeSet.has(edgeKey)) {
        edges.push({
          from: i,
          to: j,
          state: 'normal',
          bidirectional: true
        });
        edgeSet.add(edgeKey);
      }
    }
  }
  
  steps.push({
    vertices: JSON.parse(JSON.stringify(vertices)),
    edges: JSON.parse(JSON.stringify(edges)),
    description: "Starting cycle detection in the undirected graph",
    currentVertex: null,
    cyclePath: null
  });
  
  function dfs(vertex: number, parentVertex: number): boolean {
    // Mark as visited
    visited[vertex] = true;
    vertices = vertices.map(v => 
      v.id === vertex ? { ...v, state: 'visiting' } : v
    );
    
    steps.push({
      vertices: JSON.parse(JSON.stringify(vertices)),
      edges: JSON.parse(JSON.stringify(edges)),
      description: `Exploring vertex ${String.fromCharCode(65 + vertex)}`,
      currentVertex: vertex,
      cyclePath: null
    });
    
    // Visit all neighbors
    for (const neighbor of adjacencyList[vertex]) {
      // Skip the parent vertex
      if (neighbor === parentVertex) continue;
      
      // Update edge state to discovery or back depending on whether neighbor is visited
      const edgeIndex = edges.findIndex(e => 
        (e.from === vertex && e.to === neighbor) || (e.from === neighbor && e.to === vertex)
      );
      
      if (edgeIndex !== -1) {
        edges[edgeIndex].state = visited[neighbor] ? 'back' : 'discovery';
      }
      
      steps.push({
        vertices: JSON.parse(JSON.stringify(vertices)),
        edges: JSON.parse(JSON.stringify(edges)),
        description: `Checking neighbor ${String.fromCharCode(65 + neighbor)} of vertex ${String.fromCharCode(65 + vertex)}`,
        currentVertex: vertex,
        cyclePath: null
      });
      
      // If neighbor is visited and not the parent, we found a cycle
      if (visited[neighbor]) {
        if (neighbor !== parentVertex) {
          hasCycle = true;
          
          // Update edge state to cycle
          if (edgeIndex !== -1) {
            edges[edgeIndex].state = 'cycle';
          }
          
          // Reconstruct the cycle path
          cyclePath = [vertex, neighbor];
          let current = vertex;
          while (parent[current] !== -1 && current !== neighbor) {
            cyclePath.unshift(parent[current]);
            current = parent[current];
          }
          
          steps.push({
            vertices: JSON.parse(JSON.stringify(vertices)),
            edges: JSON.parse(JSON.stringify(edges)),
            description: `Cycle detected! Found a back edge from ${String.fromCharCode(65 + vertex)} to ${String.fromCharCode(65 + neighbor)}`,
            currentVertex: vertex,
            cyclePath
          });
          
          return true;
        }
      } else {
        // Set parent for the neighbor
        parent[neighbor] = vertex;
        
        // Recursively visit the neighbor
        if (dfs(neighbor, vertex)) {
          return true;
        }
      }
    }
    
    // Mark vertex as completely visited
    vertices = vertices.map(v => 
      v.id === vertex ? { ...v, state: 'visited' } : v
    );
    
    steps.push({
      vertices: JSON.parse(JSON.stringify(vertices)),
      edges: JSON.parse(JSON.stringify(edges)),
      description: `Finished exploring vertex ${String.fromCharCode(65 + vertex)}`,
      currentVertex: vertex,
      cyclePath
    });
    
    return false;
  }
  
  // Start DFS from each unvisited vertex
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      parent[i] = -1;
      if (dfs(i, -1)) {
        break;
      }
    }
  }
  
  if (!hasCycle) {
    steps.push({
      vertices: JSON.parse(JSON.stringify(vertices)),
      edges: JSON.parse(JSON.stringify(edges)),
      description: "No cycle found in the graph",
      currentVertex: null,
      cyclePath: null
    });
  }
  
  return { hasCycle, cyclePath, steps };
}

/**
 * Find Eulerian path in a directed graph
 * @param adjacencyList Adjacency list representation of the graph
 * @returns Object containing the Eulerian path if found
 */
export function findEulerianPath(adjacencyList: number[][]): {
  hasEulerianPath: boolean,
  path: number[] | null,
  steps: Array<{
    vertices: Vertex[],
    edges: Edge[],
    description: string,
    currentVertex: number | null,
    path: number[] | null
  }>
} {
  const n = adjacencyList.length;
  
  // Check if graph has an Eulerian path
  const inDegree: number[] = new Array(n).fill(0);
  const outDegree: number[] = new Array(n).fill(0);
  
  for (let i = 0; i < n; i++) {
    outDegree[i] = adjacencyList[i].length;
    for (const j of adjacencyList[i]) {
      inDegree[j]++;
    }
  }
  
  // For tracking steps
  let vertices: Vertex[] = [];
  let edges: Edge[] = [];
  const steps: Array<{
    vertices: Vertex[],
    edges: Edge[],
    description: string,
    currentVertex: number | null,
    path: number[] | null
  }> = [];
  
  // Create vertices for visualization
  for (let i = 0; i < n; i++) {
    vertices.push({
      id: i,
      x: 100 + 150 * Math.cos((i * 2 * Math.PI) / n),
      y: 100 + 150 * Math.sin((i * 2 * Math.PI) / n),
      name: String.fromCharCode(65 + i),
      state: 'unvisited'
    });
  }
  
  // Create edges for visualization
  for (let i = 0; i < n; i++) {
    for (const j of adjacencyList[i]) {
      edges.push({
        from: i,
        to: j,
        state: 'normal'
      });
    }
  }
  
  steps.push({
    vertices: JSON.parse(JSON.stringify(vertices)),
    edges: JSON.parse(JSON.stringify(edges)),
    description: "Starting Eulerian path detection",
    currentVertex: null,
    path: null
  });
  
  // Check if Eulerian path exists
  let startVertex = 0;
  let endVertex = 0;
  let countDiff1 = 0;
  let countDiffMinus1 = 0;
  
  for (let i = 0; i < n; i++) {
    const diff = outDegree[i] - inDegree[i];
    
    if (diff > 1 || diff < -1) {
      // If any vertex has in-degree - out-degree more than 1, no Eulerian path
      steps.push({
        vertices: JSON.parse(JSON.stringify(vertices)),
        edges: JSON.parse(JSON.stringify(edges)),
        description: `No Eulerian path exists: vertex ${String.fromCharCode(65 + i)} has in-degree ${inDegree[i]} and out-degree ${outDegree[i]}`,
        currentVertex: null,
        path: null
      });
      
      return { hasEulerianPath: false, path: null, steps };
    }
    
    if (diff === 1) {
      countDiff1++;
      startVertex = i;
    } else if (diff === -1) {
      countDiffMinus1++;
      endVertex = i;
    }
  }
  
  // For Eulerian path, we need either:
  // 1. All vertices have in-degree = out-degree (Eulerian circuit)
  // 2. Exactly one vertex has out-degree - in-degree = 1 (start vertex)
  //    and exactly one vertex has in-degree - out-degree = 1 (end vertex)
  if (!(countDiff1 === 0 && countDiffMinus1 === 0) && 
      !(countDiff1 === 1 && countDiffMinus1 === 1)) {
    steps.push({
      vertices: JSON.parse(JSON.stringify(vertices)),
      edges: JSON.parse(JSON.stringify(edges)),
      description: "No Eulerian path exists: in-degree and out-degree conditions not satisfied",
      currentVertex: null,
      path: null
    });
    
    return { hasEulerianPath: false, path: null, steps };
  }
  
  // If all vertices have in-degree = out-degree, we can start from any vertex
  if (countDiff1 === 0) {
    startVertex = 0;
    
    // Find a vertex with out-degree > 0 to start from
    for (let i = 0; i < n; i++) {
      if (outDegree[i] > 0) {
        startVertex = i;
        break;
      }
    }
  }
  
  steps.push({
    vertices: JSON.parse(JSON.stringify(vertices)),
    edges: JSON.parse(JSON.stringify(edges)),
    description: `Eulerian path exists. Starting vertex: ${String.fromCharCode(65 + startVertex)}`,
    currentVertex: startVertex,
    path: null
  });
  
  // Find Eulerian path using Hierholzer's algorithm
  const path: number[] = [];
  const tempAdjList: number[][] = adjacencyList.map(arr => [...arr]);
  
  function dfs(vertex: number) {
    while (tempAdjList[vertex].length > 0) {
      const neighbor = tempAdjList[vertex].pop()!;
      
      // Update edge state
      const edgeIndex = edges.findIndex(e => e.from === vertex && e.to === neighbor);
      if (edgeIndex !== -1) {
        edges[edgeIndex].state = 'discovery';
      }
      
      vertices = vertices.map(v => 
        v.id === vertex ? { ...v, state: 'visiting' } : v
      );
      
      steps.push({
        vertices: JSON.parse(JSON.stringify(vertices)),
        edges: JSON.parse(JSON.stringify(edges)),
        description: `Moving from vertex ${String.fromCharCode(65 + vertex)} to ${String.fromCharCode(65 + neighbor)}`,
        currentVertex: vertex,
        path: null
      });
      
      dfs(neighbor);
    }
    
    // Mark vertex as visited
    vertices = vertices.map(v => 
      v.id === vertex ? { ...v, state: 'visited' } : v
    );
    
    path.push(vertex);
    
    steps.push({
      vertices: JSON.parse(JSON.stringify(vertices)),
      edges: JSON.parse(JSON.stringify(edges)),
      description: `Adding vertex ${String.fromCharCode(65 + vertex)} to the path`,
      currentVertex: vertex,
      path: [...path].reverse()
    });
  }
  
  dfs(startVertex);
  
  // Reverse the path to get the correct order
  path.reverse();
  
  // Check if we've used all edges
  let allEdgesUsed = true;
  for (let i = 0; i < n; i++) {
    if (tempAdjList[i].length > 0) {
      allEdgesUsed = false;
      break;
    }
  }
  
  if (!allEdgesUsed) {
    steps.push({
      vertices: JSON.parse(JSON.stringify(vertices)),
      edges: JSON.parse(JSON.stringify(edges)),
      description: "Not all edges could be traversed. The graph may not be connected.",
      currentVertex: null,
      path: null
    });
    
    return { hasEulerianPath: false, path: null, steps };
  }
  
  // Highlight the final path
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    
    const edgeIndex = edges.findIndex(e => e.from === from && e.to === to);
    if (edgeIndex !== -1) {
      edges[edgeIndex].state = 'highlighted';
    }
  }
  
  steps.push({
    vertices: JSON.parse(JSON.stringify(vertices)),
    edges: JSON.parse(JSON.stringify(edges)),
    description: `Found Eulerian path: ${path.map(v => String.fromCharCode(65 + v)).join(' → ')}`,
    currentVertex: null,
    path
  });
  
  return { hasEulerianPath: true, path, steps };
} 