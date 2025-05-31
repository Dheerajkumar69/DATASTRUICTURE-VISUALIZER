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
  if (!graph.length) return [];
  
  // Count in-degrees and out-degrees
  const inDegree = new Array(graph.length).fill(0);
  const outDegree = new Array(graph.length).fill(0);
  
  for (let i = 0; i < graph.length; i++) {
    outDegree[i] = graph[i].length;
    for (const j of graph[i]) {
      inDegree[j]++;
    }
  }
  
  // Check if Eulerian path exists
  let startVertex = 0;
  let endVertex = 0;
  let startVertices = 0;
  let endVertices = 0;
  
  for (let i = 0; i < graph.length; i++) {
    if (outDegree[i] - inDegree[i] > 1 || inDegree[i] - outDegree[i] > 1) {
      // No Eulerian path exists
      return [];
    }
    
    if (outDegree[i] - inDegree[i] === 1) {
      startVertices++;
      startVertex = i;
    } else if (inDegree[i] - outDegree[i] === 1) {
      endVertices++;
      endVertex = i;
    }
  }
  
  // For Eulerian path, either:
  // 1. All vertices have in-degree = out-degree (Eulerian circuit)
  // 2. One vertex has out-degree - in-degree = 1 and another has in-degree - out-degree = 1
  if (!(startVertices === 0 && endVertices === 0) && 
      !(startVertices === 1 && endVertices === 1)) {
    return [];
  }
  
  // Find Eulerian path using Hierholzer's algorithm
  const path = [];
  const tempGraph = graph.map(arr => [...arr]); // Copy the graph
  
  function dfs(vertex) {
    while (tempGraph[vertex].length > 0) {
      const next = tempGraph[vertex].pop();
      dfs(next);
    }
    path.push(vertex);
  }
  
  dfs(startVertex);
  path.reverse(); // Reverse to get the correct order
  
  // Check if we've used all edges
  for (let i = 0; i < tempGraph.length; i++) {
    if (tempGraph[i].length > 0) {
      return []; // Not all edges were traversed
    }
  }
  
  return path;
}`,
    python: `def find_eulerian_path(graph):
    if not graph:
        return []
    
    # Count in-degrees and out-degrees
    in_degree = [0] * len(graph)
    out_degree = [0] * len(graph)
    
    for i in range(len(graph)):
        out_degree[i] = len(graph[i])
        for j in graph[i]:
            in_degree[j] += 1
    
    # Check if Eulerian path exists
    start_vertex = 0
    end_vertex = 0
    start_vertices = 0
    end_vertices = 0
    
    for i in range(len(graph)):
        if out_degree[i] - in_degree[i] > 1 or in_degree[i] - out_degree[i] > 1:
            # No Eulerian path exists
            return []
        
        if out_degree[i] - in_degree[i] == 1:
            start_vertices += 1
            start_vertex = i
        elif in_degree[i] - out_degree[i] == 1:
            end_vertices += 1
            end_vertex = i
    
    # For Eulerian path, either:
    # 1. All vertices have in-degree = out-degree (Eulerian circuit)
    # 2. One vertex has out-degree - in-degree = 1 and another has in-degree - out-degree = 1
    if not ((start_vertices == 0 and end_vertices == 0) or 
           (start_vertices == 1 and end_vertices == 1)):
        return []
    
    # Find Eulerian path using Hierholzer's algorithm
    path = []
    temp_graph = [list(edges) for edges in graph]  # Copy the graph
    
    def dfs(vertex):
        while temp_graph[vertex]:
            next_vertex = temp_graph[vertex].pop()
            dfs(next_vertex)
        path.append(vertex)
    
    dfs(start_vertex)
    path.reverse()  # Reverse to get the correct order
    
    # Check if we've used all edges
    for edges in temp_graph:
        if edges:
            return []  # Not all edges were traversed
    
    return path`,
    java: `public List<Integer> findEulerianPath(List<List<Integer>> graph) {
    if (graph.isEmpty()) return new ArrayList<>();
    
    // Count in-degrees and out-degrees
    int[] inDegree = new int[graph.size()];
    int[] outDegree = new int[graph.size()];
    
    for (int i = 0; i < graph.size(); i++) {
        outDegree[i] = graph.get(i).size();
        for (int j : graph.get(i)) {
            inDegree[j]++;
        }
    }
    
    // Check if Eulerian path exists
    int startVertex = 0;
    int endVertex = 0;
    int startVertices = 0;
    int endVertices = 0;
    
    for (int i = 0; i < graph.size(); i++) {
        if (outDegree[i] - inDegree[i] > 1 || inDegree[i] - outDegree[i] > 1) {
            // No Eulerian path exists
            return new ArrayList<>();
        }
        
        if (outDegree[i] - inDegree[i] == 1) {
            startVertices++;
            startVertex = i;
        } else if (inDegree[i] - outDegree[i] == 1) {
            endVertices++;
            endVertex = i;
        }
    }
    
    // For Eulerian path, either:
    // 1. All vertices have in-degree = out-degree (Eulerian circuit)
    // 2. One vertex has out-degree - in-degree = 1 and another has in-degree - out-degree = 1
    if (!((startVertices == 0 && endVertices == 0) || 
         (startVertices == 1 && endVertices == 1))) {
        return new ArrayList<>();
    }
    
    // Find Eulerian path using Hierholzer's algorithm
    List<Integer> path = new ArrayList<>();
    List<List<Integer>> tempGraph = new ArrayList<>();
    
    // Copy the graph
    for (List<Integer> edges : graph) {
        tempGraph.add(new ArrayList<>(edges));
    }
    
    dfs(tempGraph, startVertex, path);
    Collections.reverse(path); // Reverse to get the correct order
    
    // Check if we've used all edges
    for (List<Integer> edges : tempGraph) {
        if (!edges.isEmpty()) {
            return new ArrayList<>(); // Not all edges were traversed
        }
    }
    
    return path;
}

private void dfs(List<List<Integer>> graph, int vertex, List<Integer> path) {
    while (!graph.get(vertex).isEmpty()) {
        int next = graph.get(vertex).remove(graph.get(vertex).size() - 1);
        dfs(graph, next, path);
    }
    path.add(vertex);
}`,
    cpp: `vector<int> findEulerianPath(vector<vector<int>>& graph) {
    if (graph.empty()) return {};
    
    // Count in-degrees and out-degrees
    vector<int> inDegree(graph.size(), 0);
    vector<int> outDegree(graph.size(), 0);
    
    for (int i = 0; i < graph.size(); i++) {
        outDegree[i] = graph[i].size();
        for (int j : graph[i]) {
            inDegree[j]++;
        }
    }
    
    // Check if Eulerian path exists
    int startVertex = 0;
    int endVertex = 0;
    int startVertices = 0;
    int endVertices = 0;
    
    for (int i = 0; i < graph.size(); i++) {
        if (outDegree[i] - inDegree[i] > 1 || inDegree[i] - outDegree[i] > 1) {
            // No Eulerian path exists
            return {};
        }
        
        if (outDegree[i] - inDegree[i] == 1) {
            startVertices++;
            startVertex = i;
        } else if (inDegree[i] - outDegree[i] == 1) {
            endVertices++;
            endVertex = i;
        }
    }
    
    // For Eulerian path, either:
    // 1. All vertices have in-degree = out-degree (Eulerian circuit)
    // 2. One vertex has out-degree - in-degree = 1 and another has in-degree - out-degree = 1
    if (!((startVertices == 0 && endVertices == 0) || 
         (startVertices == 1 && endVertices == 1))) {
        return {};
    }
    
    // Find Eulerian path using Hierholzer's algorithm
    vector<int> path;
    vector<vector<int>> tempGraph = graph; // Copy the graph
    
    function<void(int)> dfs = [&](int vertex) {
        while (!tempGraph[vertex].empty()) {
            int next = tempGraph[vertex].back();
            tempGraph[vertex].pop_back();
            dfs(next);
        }
        path.push_back(vertex);
    };
    
    dfs(startVertex);
    reverse(path.begin(), path.end()); // Reverse to get the correct order
    
    // Check if we've used all edges
    for (const auto& edges : tempGraph) {
        if (!edges.empty()) {
            return {}; // Not all edges were traversed
        }
    }
    
    return path;
}`
  }
};

const EulerianPathPage: React.FC = () => {
  // Legend items for the visualization
  const legendItems = [
    { color: "#E2E8F0", label: "Unvisited" },
    { color: "#ECC94B", label: "Visiting" },
    { color: "#48BB78", label: "Visited" },
    { color: "#4299E1", label: "Path Edge" },
    { color: "#805AD5", label: "Highlighted Path" }
  ];

  const visualizationComponent = (
    <>
      <GraphProblemVisualizer
        problemType="eulerian-path"
        height="500px"
        nodeRadius={25}
        showEdgeWeights={false}
      />
      
      <LegendContainer>
        <Legend items={legendItems} />
      </LegendContainer>

      <InfoPanel>
        <InfoTitle>How Eulerian Path Detection Works:</InfoTitle>
        <InfoText>
          The algorithm uses Hierholzer's algorithm to find an Eulerian path:
        </InfoText>
        <ul>
          <li>Check if an Eulerian path exists by analyzing in-degrees and out-degrees of all vertices.</li>
          <li>For a directed graph to have an Eulerian path, one of these conditions must be met:
            <ul>
              <li>All vertices have equal in-degree and out-degree (Eulerian circuit)</li>
              <li>One vertex has out-degree = in-degree + 1 (start vertex), and another has in-degree = out-degree + 1 (end vertex)</li>
            </ul>
          </li>
          <li>Start from the start vertex and follow edges, removing them as they're traversed.</li>
          <li>When stuck at a vertex with no outgoing edges, add it to the path.</li>
          <li>The final path is found by reversing the constructed path.</li>
        </ul>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Conditions for Eulerian Path:</InfoTitle>
        <InfoText>
          <strong>Directed Graph:</strong>
        </InfoText>
        <ul>
          <li>The graph must be connected (ignoring edge directions).</li>
          <li>Either:
            <ul>
              <li>All vertices have equal in-degree and out-degree (for Eulerian circuit), or</li>
              <li>Exactly one vertex has out-degree = in-degree + 1, and exactly one has in-degree = out-degree + 1 (for Eulerian path)</li>
            </ul>
          </li>
        </ul>
          <InfoText>
          <strong>Undirected Graph:</strong>
          </InfoText>
        <ul>
          <li>The graph must be connected.</li>
          <li>Either:
            <ul>
              <li>All vertices have even degree (for Eulerian circuit), or</li>
              <li>Exactly two vertices have odd degree (for Eulerian path)</li>
            </ul>
          </li>
        </ul>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications:</InfoTitle>
        <ul>
          <li>Solving the Chinese Postman Problem (route planning for mail delivery, garbage collection)</li>
          <li>Genome assembly in bioinformatics</li>
          <li>Circuit design in electronics</li>
          <li>Network flow optimization</li>
          <li>Drawing figures without lifting the pen or retracing edges</li>
        </ul>
      </InfoPanel>
    </>
  );

  return (
    <ProblemPageTemplate 
      algorithmInfo={eulerianPathInfo}
      visualizationComponent={visualizationComponent}
      problemDescription={`
Given a directed graph, find an Eulerian path if one exists.

An Eulerian path is a path in a graph that visits every edge exactly once. An Eulerian circuit is an Eulerian path that starts and ends at the same vertex.

For a directed graph to have an Eulerian path:
- The graph must be connected (when edge directions are ignored)
- Either all vertices must have equal in-degree and out-degree (Eulerian circuit), or exactly one vertex has out-degree = in-degree + 1 (start vertex) and exactly one has in-degree = out-degree + 1 (end vertex)

This problem has applications in route planning, genome assembly in bioinformatics, and circuit design.
`}
    />
  );
};

export default EulerianPathPage; 