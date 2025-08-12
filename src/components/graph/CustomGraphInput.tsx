import React, { useState } from 'react';
import styled from 'styled-components';

interface Vertex {
  id: number;
  x: number;
  y: number;
}

interface CustomEdge {
  source: number;
  target: number;
  weight: number;
}

interface CustomGraphInputProps {
  onApply: (vertices: Vertex[], edges: CustomEdge[]) => void;
  maxVertices?: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 800px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TextAreaLabel = styled.label`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  font-family: monospace;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  resize: vertical;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: ${({ theme }) => theme.colors.card};
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger};
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const InfoText = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 0.5rem;
  line-height: 1.4;
`;

// Example graph in JSON format
const exampleGraph = {
  vertices: [
    { id: 0, x: 200, y: 100 },
    { id: 1, x: 400, y: 100 },
    { id: 2, x: 600, y: 100 },
    { id: 3, x: 300, y: 300 },
    { id: 4, x: 500, y: 300 }
  ],
  edges: [
    { source: 0, target: 1, weight: 5 },
    { source: 1, target: 2, weight: 8 },
    { source: 0, target: 3, weight: 9 },
    { source: 1, target: 3, weight: 2 },
    { source: 1, target: 4, weight: 7 },
    { source: 2, target: 4, weight: 3 },
    { source: 3, target: 4, weight: 4 }
  ]
};

const CustomGraphInput: React.FC<CustomGraphInputProps> = ({ 
  onApply, 
  maxVertices = 20 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    setError(null);
  };

  const loadExample = () => {
    setInputValue(JSON.stringify(exampleGraph, null, 2));
    setError(null);
  };

  const handleApply = () => {
    try {
      if (!inputValue.trim()) {
        setError('Please enter graph data');
        return;
      }

      const parsedData = JSON.parse(inputValue);
      
      // Validate vertices
      if (!parsedData.vertices || !Array.isArray(parsedData.vertices)) {
        setError('Invalid format: "vertices" must be an array');
        return;
      }
      
      if (parsedData.vertices.length === 0) {
        setError('Graph must have at least one vertex');
        return;
      }
      
      if (parsedData.vertices.length > maxVertices) {
        setError(`Too many vertices. Maximum allowed is ${maxVertices}`);
        return;
      }
      
      for (const vertex of parsedData.vertices) {
        if (!('id' in vertex && 'x' in vertex && 'y' in vertex)) {
          setError('Each vertex must have id, x, and y properties');
          return;
        }
        if (typeof vertex.id !== 'number' || typeof vertex.x !== 'number' || typeof vertex.y !== 'number') {
          setError('Vertex id, x, and y must be numbers');
          return;
        }
      }
      
      // Validate edges
      if (!parsedData.edges || !Array.isArray(parsedData.edges)) {
        setError('Invalid format: "edges" must be an array');
        return;
      }
      
      const vertexIds = new Set(parsedData.vertices.map((v: Vertex) => v.id));
      
      for (const edge of parsedData.edges) {
        if (!('source' in edge && 'target' in edge && 'weight' in edge)) {
          setError('Each edge must have source, target, and weight properties');
          return;
        }
        if (typeof edge.source !== 'number' || typeof edge.target !== 'number' || typeof edge.weight !== 'number') {
          setError('Edge source, target, and weight must be numbers');
          return;
        }
        if (!vertexIds.has(edge.source) || !vertexIds.has(edge.target)) {
          setError(`Edge references a vertex id that doesn't exist`);
          return;
        }
      }
      
      // If validation passes, apply the graph
      onApply(parsedData.vertices, parsedData.edges);
      setError(null);
    } catch (err) {
      setError(`Invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <Container>
      <InputArea>
        <TextAreaLabel>Enter custom graph (JSON format):</TextAreaLabel>
        <StyledTextArea
          value={inputValue}
          onChange={handleInputChange}
          placeholder='{"vertices": [...], "edges": [...]}'
        />
        <InfoText>
          Format: A JSON object with "vertices" and "edges" arrays. Each vertex needs id, x, and y coordinates. 
          Each edge needs source, target (vertex ids), and weight. See the example for details.
        </InfoText>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputArea>
      <ButtonRow>
        <Button onClick={loadExample}>Load Example</Button>
        <Button onClick={handleApply}>Apply Custom Graph</Button>
      </ButtonRow>
    </Container>
  );
};

export default CustomGraphInput; 