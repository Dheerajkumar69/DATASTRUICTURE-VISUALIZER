// Define message types
type MessageData = {
  type: 'FIND_EULERIAN_PATH' | 'DETECT_CYCLES_DIRECTED' | 'DETECT_CYCLES_UNDIRECTED' | 'FIND_WORD_LADDER';
  payload: any;
};

type AdjacencyList = number[][];


// Detect if a directed graph has cycles
const detectCyclesDirected = (adjacencyList: AdjacencyList): { hasCycle: boolean; cyclePath: number[] | null } => {
  const n = adjacencyList.length;
  const visited = new Array(n).fill(0); // 0: not visited, 1: visiting, 2: visited
  const parent = new Array(n).fill(-1);
  let cyclePath: number[] | null = null;

  const dfs = (vertex: number): boolean => {
    visited[vertex] = 1; // Mark as visiting

    for (const neighbor of adjacencyList[vertex]) {
      if (visited[neighbor] === 1) {
        // Cycle detected - reconstruct path
        const path = [vertex, neighbor];
        let current = vertex;
        while (parent[current] !== -1) {
          path.unshift(parent[current]);
          current = parent[current];
          if (current === neighbor) break; // Stop if we've completed the cycle
        }
        cyclePath = path;
        return true;
      }

      if (visited[neighbor] === 0) {
        parent[neighbor] = vertex;
        if (dfs(neighbor)) {
          return true;
        }
      }
    }

    visited[vertex] = 2; // Mark as visited
    return false;
  };

  for (let i = 0; i < n; i++) {
    if (visited[i] === 0) {
      if (dfs(i)) {
        return { hasCycle: true, cyclePath };
      }
    }
  }

  return { hasCycle: false, cyclePath: null };
};

// Detect if an undirected graph has cycles
const detectCyclesUndirected = (adjacencyList: AdjacencyList): { hasCycle: boolean; cyclePath: number[] | null } => {
  const n = adjacencyList.length;
  const visited = new Set<number>();
  const parent = new Array(n).fill(-1);
  let cyclePath: number[] | null = null;

  const dfs = (vertex: number, parentVertex: number): boolean => {
    visited.add(vertex);

    for (const neighbor of adjacencyList[vertex]) {
      if (neighbor === parentVertex) continue;

      if (visited.has(neighbor)) {
        // Cycle detected - reconstruct path
        const path = [vertex, neighbor];
        let current = vertex;
        while (parent[current] !== -1 && current !== neighbor) {
          path.unshift(parent[current]);
          current = parent[current];
        }
        cyclePath = path;
        return true;
      }

      parent[neighbor] = vertex;
      if (dfs(neighbor, vertex)) {
        return true;
      }
    }

    return false;
  };

  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      if (dfs(i, -1)) {
        return { hasCycle: true, cyclePath };
      }
    }
  }

  return { hasCycle: false, cyclePath: null };
};

// Find Eulerian path in a graph
const findEulerianPath = (adjacencyList: AdjacencyList): { hasPath: boolean; path: number[] | null } => {
  const n = adjacencyList.length;
  
  // Count odd degree vertices
  const oddVertices: number[] = [];
  for (let i = 0; i < n; i++) {
    if (adjacencyList[i].length % 2 !== 0) {
      oddVertices.push(i);
    }
  }
  
  // Check if Eulerian path exists
  if (oddVertices.length !== 0 && oddVertices.length !== 2) {
    return { hasPath: false, path: null };
  }
  
  // Clone adjacency list to avoid mutating input
  const adjListCopy: AdjacencyList = [];
  for (let i = 0; i < n; i++) {
    adjListCopy[i] = [...adjacencyList[i]];
  }
  
  // Choose starting vertex
  let start = 0;
  if (oddVertices.length === 2) {
    start = oddVertices[0];
  }
  
  const path: number[] = [];
  const dfs = (vertex: number) => {
    while (adjListCopy[vertex].length > 0) {
      const next = adjListCopy[vertex].pop()!;
      
      // Remove the edge in the other direction as well
      const index = adjListCopy[next].indexOf(vertex);
      if (index !== -1) {
        adjListCopy[next].splice(index, 1);
      }
      
      dfs(next);
    }
    
    path.push(vertex);
  };
  
  dfs(start);
  
  // Check if all edges were used
  for (let i = 0; i < n; i++) {
    if (adjListCopy[i].length > 0) {
      return { hasPath: false, path: null };
    }
  }
  
  return { hasPath: true, path: path.reverse() };
};

// Find Word Ladder with bidirectional BFS
const findWordLadder = (
  beginWord: string, 
  endWord: string, 
  wordList: string[]
): { found: boolean; path: string[] | null } => {
  const wordSet = new Set(wordList);
  
  // Check if end word is in the dictionary
  if (!wordSet.has(endWord)) {
    return { found: false, path: null };
  }
  
  // Initialize BFS from start side
  const startQueue: Array<{word: string, path: string[]}> = [];
  startQueue.push({ word: beginWord, path: [beginWord] });
  
  // Initialize BFS from end side
  const endQueue: Array<{word: string, path: string[]}> = [];
  endQueue.push({ word: endWord, path: [endWord] });
  
  const startVisited = new Map<string, string[]>();
  startVisited.set(beginWord, [beginWord]);
  
  const endVisited = new Map<string, string[]>();
  endVisited.set(endWord, [endWord]);
  
  // Keep track of the shortest path found
  let shortestPath: string[] | null = null;
  
  // While both queues are not empty
  while (startQueue.length > 0 && endQueue.length > 0) {
    // Process level by level to ensure shortest path
    // Expand from start side
    const startQueueSize = startQueue.length;
    
    for (let i = 0; i < startQueueSize; i++) {
      const { word, path } = startQueue.shift()!;
      
      // If we've already found a shorter path, skip
      if (shortestPath !== null && path.length >= shortestPath.length) continue;
      
      // Check each possible transformation
      for (let j = 0; j < word.length; j++) {
        for (let c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
          const newChar = String.fromCharCode(c);
          
          if (word[j] === newChar) continue;
          
          const newWord = word.slice(0, j) + newChar + word.slice(j + 1);
          
          // Skip if already visited from start side
          if (startVisited.has(newWord)) continue;
          
          // Check if in dictionary
          if (!wordSet.has(newWord) && newWord !== endWord) continue;
          
          // Create new path
          const newPath = [...path, newWord];
          
          // Check if the word has been visited from the end side
          if (endVisited.has(newWord)) {
            // We found a meeting point - construct full path
            const endPath = endVisited.get(newWord)!;
            const fullPath = [...newPath.slice(0, -1), ...endPath.reverse()];
            
            // Update shortest path if this is shorter
            if (shortestPath === null || fullPath.length < shortestPath.length) {
              shortestPath = fullPath;
            }
            
            // We can exit early if we're at the last level
            if (i === startQueueSize - 1) {
              return { found: true, path: shortestPath };
            }
          }
          
          // Add to queue and visited
          startQueue.push({ word: newWord, path: newPath });
          startVisited.set(newWord, newPath);
        }
      }
    }
    
    // Expand from end side
    const endQueueSize = endQueue.length;
    
    for (let i = 0; i < endQueueSize; i++) {
      const { word, path } = endQueue.shift()!;
      
      // If we've already found a shorter path, skip
      if (shortestPath !== null && path.length >= shortestPath.length) continue;
      
      // Check each possible transformation
      for (let j = 0; j < word.length; j++) {
        for (let c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
          const newChar = String.fromCharCode(c);
          
          if (word[j] === newChar) continue;
          
          const newWord = word.slice(0, j) + newChar + word.slice(j + 1);
          
          // Skip if already visited from end side
          if (endVisited.has(newWord)) continue;
          
          // Check if in dictionary
          if (!wordSet.has(newWord) && newWord !== beginWord) continue;
          
          // Create new path (note: path is stored in reverse order for end side)
          const newPath = [newWord, ...path];
          
          // Check if the word has been visited from the start side
          if (startVisited.has(newWord)) {
            // We found a meeting point - construct full path
            const startPath = startVisited.get(newWord)!;
            const fullPath = [...startPath, ...path.slice(1).reverse()];
            
            // Update shortest path if this is shorter
            if (shortestPath === null || fullPath.length < shortestPath.length) {
              shortestPath = fullPath;
            }
            
            // We can exit early if we're at the last level
            if (i === endQueueSize - 1) {
              return { found: true, path: shortestPath };
            }
          }
          
          // Add to queue and visited
          endQueue.push({ word: newWord, path: newPath });
          endVisited.set(newWord, newPath);
        }
      }
    }
  }
  
  return { found: shortestPath !== null, path: shortestPath };
};

// Message event handler
// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', (event: MessageEvent<MessageData>) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'FIND_EULERIAN_PATH':
      const eulerianResult = findEulerianPath(payload.adjacencyList);
      // eslint-disable-next-line no-restricted-globals
      self.postMessage({
        type: 'EULERIAN_PATH_RESULT',
        payload: eulerianResult
      });
      break;
      
    case 'DETECT_CYCLES_DIRECTED':
      const directedResult = detectCyclesDirected(payload.adjacencyList);
      // eslint-disable-next-line no-restricted-globals
      self.postMessage({
        type: 'DIRECTED_CYCLES_RESULT',
        payload: directedResult
      });
      break;
      
    case 'DETECT_CYCLES_UNDIRECTED':
      const undirectedResult = detectCyclesUndirected(payload.adjacencyList);
      // eslint-disable-next-line no-restricted-globals
      self.postMessage({
        type: 'UNDIRECTED_CYCLES_RESULT',
        payload: undirectedResult
      });
      break;
      
    case 'FIND_WORD_LADDER':
      const wordLadderResult = findWordLadder(
        payload.beginWord,
        payload.endWord,
        payload.wordList
      );
      // eslint-disable-next-line no-restricted-globals
      self.postMessage({
        type: 'WORD_LADDER_RESULT',
        payload: wordLadderResult
      });
      break;
      
    default:
      // eslint-disable-next-line no-restricted-globals
      self.postMessage({
        type: 'ERROR',
        payload: { message: `Unknown message type: ${type}` }
      });
  }
});

// TypeScript worker export
export default {} as typeof Worker & { new (): Worker }; 