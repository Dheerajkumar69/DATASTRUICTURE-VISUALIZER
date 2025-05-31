import React from 'react';
import styled from 'styled-components';
import ProblemPageTemplate from '../../../components/templates/ProblemPageTemplate';
import { AlgorithmInfo } from '../../../types/algorithm';
import GraphProblemVisualizer from '../../../components/visualization/GraphProblemVisualizer';
import { Legend } from '../../../components/visualization/VisualizationComponents';

// Styled Components
const LegendContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
`;

const InfoPanel = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius};
  width: 100%;
`;

const InfoTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const InfoText = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 0.5rem;
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
  // Legend items for the visualization
  const legendItems = [
    { color: "#E2E8F0", label: "Unvisited" },
    { color: "#ECC94B", label: "Visiting" },
    { color: "#48BB78", label: "Visited" },
    { color: "#4299E1", label: "Discovery Edge" },
    { color: "#F56565", label: "Cycle Edge" },
    { color: "#38B2AC", label: "Back Edge" }
  ];

  const visualizationComponent = (
    <>
      <GraphProblemVisualizer
        problemType="undirected-cycle"
        height="500px"
        nodeRadius={25}
      />
      
      <LegendContainer>
        <Legend items={legendItems} />
      </LegendContainer>

      <InfoPanel>
        <InfoTitle>How Undirected Cycle Detection Works:</InfoTitle>
        <InfoText>
          The algorithm uses a depth-first search to detect cycles:
        </InfoText>
        <ul>
          <li>Start a DFS traversal from any vertex.</li>
          <li>For each vertex, mark it as "visiting" when first encountered.</li>
          <li>Recursively visit all adjacent unvisited vertices.</li>
          <li>If we encounter an already visited vertex that is not the parent of the current vertex, we've found a cycle.</li>
          <li>Mark vertices as "visited" once all their neighbors have been processed.</li>
        </ul>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Time & Space Complexity:</InfoTitle>
        <InfoText>
          <strong>Time Complexity:</strong> O(V + E) where V is the number of vertices and E is the number of edges.
        </InfoText>
        <InfoText>
          <strong>Space Complexity:</strong> O(V) for the recursion stack and visited array.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications of Cycle Detection:</InfoTitle>
        <ul>
          <li>Deadlock detection in operating systems</li>
          <li>Circuit analysis in electrical engineering</li>
          <li>Checking for circular dependencies in software packages</li>
          <li>Verifying that a graph is a tree (a tree is a connected graph with no cycles)</li>
          <li>Finding minimal spanning trees in networks</li>
        </ul>
      </InfoPanel>
    </>
  );

  return (
    <ProblemPageTemplate 
      algorithmInfo={undirectedCycleDetectionInfo}
      visualizationComponent={visualizationComponent}
      problemDescription={`
Given an undirected graph, determine if it contains any cycles.

A cycle in an undirected graph is a path of vertices and edges such that, starting from some vertex v, it is possible to return to the same vertex v by following the edges, without using any edge twice.

For example, in the graph with edges A -- B -- C -- A, there is a cycle involving vertices A, B, and C.

Cycle detection in undirected graphs has applications in checking if a graph is a tree (which by definition has no cycles), finding redundant connections in networks, and more.
`}
    />
  );
};

export default UndirectedCycleDetectionPage; 