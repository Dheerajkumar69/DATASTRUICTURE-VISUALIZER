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

const directedCycleDetectionInfo: AlgorithmInfo = {
  name: "Directed Graph Cycle Detection",
  description: "Cycle detection in a directed graph is the problem of identifying if a graph contains any cycles, which are paths that start and end at the same vertex while following directed edges. This algorithm uses Depth-First Search (DFS) with three states of vertices to detect cycles.",
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
  // Legend items for the visualization
  const legendItems = [
    { color: "#E2E8F0", label: "Unvisited" },
    { color: "#ECC94B", label: "Visiting" },
    { color: "#48BB78", label: "Visited" },
    { color: "#4299E1", label: "Discovery Edge" },
    { color: "#F56565", label: "Cycle Edge" }
  ];

  const visualizationComponent = (
    <>
      <GraphProblemVisualizer
        problemType="directed-cycle"
        height="500px"
        nodeRadius={25}
      />
      
      <LegendContainer>
      <Legend items={legendItems} />
      </LegendContainer>
      
      <InfoPanel>
        <InfoTitle>How Directed Cycle Detection Works:</InfoTitle>
        <InfoText>
          The algorithm uses a depth-first search with vertex coloring:
        </InfoText>
          <ul>
            <li><strong>Unvisited:</strong> Vertex has not been processed.</li>
            <li><strong>Visiting:</strong> Vertex is being processed (in the recursion stack).</li>
            <li><strong>Visited:</strong> Vertex and all its descendants have been processed.</li>
          </ul>
        <InfoText>
          A cycle is detected when we encounter a vertex that is currently in the 'visiting' state.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications:</InfoTitle>
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

  return (
    <ProblemPageTemplate 
      algorithmInfo={directedCycleDetectionInfo}
      visualizationComponent={visualizationComponent}
      problemDescription={`
Given a directed graph, determine if it contains any cycles.

A cycle in a directed graph is a path of vertices and edges such that, starting from some vertex v, it is possible to return to the same vertex v by following the edges in their direction.

For example, in the graph A → B → C → A, there is a cycle involving vertices A, B, and C.

Cycle detection has many practical applications, including deadlock detection in operating systems, finding circular dependencies in packages, and more.
      `}
    />
  );
};

export default DirectedCycleDetectionPage; 