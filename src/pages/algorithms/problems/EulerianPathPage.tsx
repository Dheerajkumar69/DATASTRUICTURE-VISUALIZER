import React from 'react';
import styled from 'styled-components';
import ProblemPageTemplate from '../../../components/templates/ProblemPageTemplate';
import { AlgorithmInfo } from '../../../types/algorithm';

// Styled Components (kept minimal here; visualization handled inside templates/visualizers)
const InfoPanel = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.card};
  transition: all 0.3s ease;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
`;

const eulerianPathInfo: AlgorithmInfo = {
  name: "Eulerian Path Detection",
  description: "An Eulerian path in a graph is a path that visits every edge exactly once. A graph has an Eulerian path if and only if at most two vertices have an odd degree, and all other vertices have an even degree.",
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)'
  },
  spaceComplexity: 'O(V + E)',
  implementations: {
    javascript: `function hasEulerianPath(graph) {
  // Count vertices with odd degree
  let oddCount = 0;
  
  for (let i = 0; i < graph.length; i++) {
    if (graph[i].length % 2 !== 0) {
      oddCount++;
    }
  }
  
  // Check if Eulerian path exists
  return oddCount === 0 || oddCount === 2;
}

function findEulerianPath(graph) {
  if (!hasEulerianPath(graph)) return null;
  
  // Find starting vertex (odd degree or any if all even)
  let start = 0;
  for (let i = 0; i < graph.length; i++) {
    if (graph[i].length % 2 !== 0) {
      start = i;
      break;
    }
  }
  
  // Make a copy of the graph
  const adjacencyList = [];
  for (let i = 0; i < graph.length; i++) {
    adjacencyList[i] = [...graph[i]];
  }
  
  const path = [];
  dfs(adjacencyList, start, path);
  
  return path.reverse();
}

function dfs(graph, vertex, path) {
  while (graph[vertex].length > 0) {
    const next = graph[vertex].pop();
    
    // Remove the edge in the other direction as well
    const index = graph[next].indexOf(vertex);
    if (index !== -1) {
      graph[next].splice(index, 1);
    }
    
    dfs(graph, next, path);
  }
  
  path.push(vertex);
}`,
    python: `def has_eulerian_path(graph):
    # Count vertices with odd degree
    odd_count = 0
    
    for edges in graph:
        if len(edges) % 2 != 0:
            odd_count += 1
    
    # Check if Eulerian path exists
    return odd_count == 0 or odd_count == 2

def find_eulerian_path(graph):
    if not has_eulerian_path(graph):
        return None
    
    # Find starting vertex (odd degree or any if all even)
    start = 0
    for i in range(len(graph)):
        if len(graph[i]) % 2 != 0:
            start = i
            break
    
    # Make a copy of the graph
    adjacency_list = [list(edges) for edges in graph]
    
    path = []
    dfs(adjacency_list, start, path)
    
    return path[::-1]

def dfs(graph, vertex, path):
    while graph[vertex]:
        next_vertex = graph[vertex].pop()
        
        # Remove the edge in the other direction as well
        if vertex in graph[next_vertex]:
            graph[next_vertex].remove(vertex)
        
        dfs(graph, next_vertex, path)
    
    path.append(vertex)`,
    java: `public boolean hasEulerianPath(List<List<Integer>> graph) {
    // Count vertices with odd degree
    int oddCount = 0;
    
    for (List<Integer> edges : graph) {
        if (edges.size() % 2 != 0) {
            oddCount++;
        }
    }
    
    // Check if Eulerian path exists
    return oddCount == 0 || oddCount == 2;
}

public List<Integer> findEulerianPath(List<List<Integer>> graph) {
    if (!hasEulerianPath(graph)) return null;
    
    // Find starting vertex (odd degree or any if all even)
    int start = 0;
    for (int i = 0; i < graph.size(); i++) {
        if (graph.get(i).size() % 2 != 0) {
            start = i;
            break;
        }
    }
    
    // Make a copy of the graph
    List<List<Integer>> adjacencyList = new ArrayList<>();
    for (List<Integer> edges : graph) {
        adjacencyList.add(new ArrayList<>(edges));
    }
    
    List<Integer> path = new ArrayList<>();
    dfs(adjacencyList, start, path);
    
    Collections.reverse(path);
    return path;
}

private void dfs(List<List<Integer>> graph, int vertex, List<Integer> path) {
    while (!graph.get(vertex).isEmpty()) {
        int next = graph.get(vertex).remove(0);
        
        // Remove the edge in the other direction as well
        int index = graph.get(next).indexOf(vertex);
        if (index != -1) {
            graph.get(next).remove(index);
        }
        
        dfs(graph, next, path);
    }
    
    path.add(vertex);
}`,
    cpp: `bool hasEulerianPath(vector<vector<int>>& graph) {
    // Count vertices with odd degree
    int oddCount = 0;
    
    for (const auto& edges : graph) {
        if (edges.size() % 2 != 0) {
            oddCount++;
        }
    }
    
    // Check if Eulerian path exists
    return oddCount == 0 || oddCount == 2;
}

vector<int> findEulerianPath(vector<vector<int>>& graph) {
    if (!hasEulerianPath(graph)) return {};
    
    // Find starting vertex (odd degree or any if all even)
    int start = 0;
    for (int i = 0; i < graph.size(); i++) {
        if (graph[i].size() % 2 != 0) {
            start = i;
            break;
        }
    }
    
    // Make a copy of the graph
    vector<vector<int>> adjacencyList = graph;
    
    vector<int> path;
    dfs(adjacencyList, start, path);
    
    reverse(path.begin(), path.end());
    return path;
}

void dfs(vector<vector<int>>& graph, int vertex, vector<int>& path) {
    while (!graph[vertex].empty()) {
        int next = graph[vertex].back();
        graph[vertex].pop_back();
        
        // Remove the edge in the other direction as well
        auto it = find(graph[next].begin(), graph[next].end(), vertex);
        if (it != graph[next].end()) {
            graph[next].erase(it);
        }
        
        dfs(graph, next, path);
    }
    
    path.push_back(vertex);
}`
  }
};

const problemDescription = `
Given an undirected graph, determine if it has an Eulerian path, and if so, find one.

An Eulerian path is a path in a graph that visits every edge exactly once. For an undirected graph to have an Eulerian path:
- Either all vertices have an even degree (number of edges connected to them), or
- Exactly two vertices have an odd degree, and the rest have an even degree.

If all vertices have an even degree, the graph has an Eulerian circuit (a closed path). If exactly two vertices have an odd degree, the Eulerian path must start at one of these vertices and end at the other.

The algorithm works by:
1. Checking if an Eulerian path exists by counting vertices with odd degrees
2. Finding a starting vertex (one with an odd degree if any)
3. Using a modified DFS to traverse the graph, removing edges as they are traversed
4. Constructing the path by adding vertices in reverse order of the DFS completion
`;

const EulerianPathPage: React.FC = () => {
  const visualizationComponent = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <p>Graph visualization will be displayed here</p>
    </div>
  );

  return (
    <ProblemPageTemplate 
      algorithmInfo={eulerianPathInfo}
      visualizationComponent={visualizationComponent}
      problemDescription={problemDescription}
    />
  );
};

export default EulerianPathPage; 