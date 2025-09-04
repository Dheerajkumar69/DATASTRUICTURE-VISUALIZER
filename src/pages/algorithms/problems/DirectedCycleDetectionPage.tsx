import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaPlay, FaPause, FaStepForward, FaStepBackward, FaRedo } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ProblemPageTemplate from '../../../components/templates/ProblemPageTemplate';
import { AlgorithmInfo } from '../../../types/algorithm';

// Vertex and Edge Types
type VertexState = 'unvisited' | 'visiting' | 'visited';
type EdgeState = 'normal' | 'discovery' | 'back' | 'cross' | 'cycle';

interface Vertex {
  id: number;
  x: number;
  y: number;
  name: string;
  state: VertexState;
}

interface Edge {
  from: number;
  to: number;
  state: EdgeState;
}

interface Step {
  vertices: Vertex[];
  edges: Edge[];
  description: string;
  cycleFound: boolean;
  cyclePath: number[] | null;
}

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavigationRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #3182ce;
  margin-right: auto;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.5;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 8px 16px;
  background-color: ${props => (props.primary ? '#3182ce' : '#e2e8f0')};
  color: ${props => (props.primary ? 'white' : '#4a5568')};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background-color: ${props => (props.primary ? '#2c5282' : '#cbd5e0')};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GraphContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;
`;

const CanvasContainer = styled.div`
  flex: 1;
  min-width: 500px;
  max-width: 100%;
  min-height: 500px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const InfoPanel = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 100%;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
`;

const InfoTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
`;

const InfoText = styled.div`
  font-size: 0.9rem;
  line-height: 1.5;
  color: #4a5568;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #4a5568;
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
  return (
    <ProblemPageTemplate 
      algorithmInfo={directedCycleDetectionInfo}
      visualizationComponent={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <p>Graph visualization will be displayed here</p>
        </div>
      }
      problemDescription={`
Given a directed graph, determine if it contains any cycles.

A cycle in a directed graph is a path of vertices and edges such that, starting from some vertex v, it is possible to return to the same vertex v by following the edges in their direction.

For example, in a directed graph with vertices A, B, C, and edges A→B, B→C, and C→A, there is a cycle A → B → C → A.

The algorithm uses a depth-first search (DFS) traversal with three states for each vertex:
- State 0: Not yet visited
- State 1: Currently being visited (in the recursion stack)
- State 2: Completely visited (all descendants have been processed)

If during the DFS traversal, we encounter a vertex that is currently in state 1 (being visited), then we have found a cycle.
      `}
    />
  );
};

export default DirectedCycleDetectionPage; 