import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiArrowUp, FiRefreshCw, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray800};
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  max-width: 800px;
  line-height: 1.6;
`;

const VisualizerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
  }
`;

const VisualizerSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CodeSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ControlPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  width: 80px;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary : 
    variant === 'secondary' ? theme.colors.secondary : 
    variant === 'danger' ? theme.colors.danger : 
    theme.colors.gray200};
  color: ${({ variant }) => variant ? 'white' : 'inherit'};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const HeapContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-height: 500px;
`;

const HeapTreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 2rem;
  position: relative;
`;

const HeapLevel = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 2rem;
`;

const NodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1rem;
  position: relative;
`;

const HeapNode = styled(motion.div)<{ isHighlighted?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : 'white'};
  color: ${({ theme, isHighlighted }) => 
    isHighlighted ? 'white' : theme.colors.gray800};
  border-radius: 50%;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 600;
  font-size: 1.25rem;
  border: 2px solid ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : theme.colors.gray300};
  position: relative;
  z-index: 2;
`;

const EdgeContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const Edge = styled.line`
  stroke: ${({ theme }) => theme.colors.gray300};
  stroke-width: 2;
`;

const CodeBlock = styled.div`
  background-color: #1E1E1E;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

const CodeTitle = styled.div`
  padding: 0.75rem 1rem;
  background-color: #333;
  color: white;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.875rem;
`;

const InfoPanel = styled.div`
  padding: 1rem;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const InfoTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.gray800};
`;

const InfoContent = styled.div`
  color: ${({ theme }) => theme.colors.gray600};
  line-height: 1.6;
  
  ul {
    padding-left: 1.5rem;
    margin-top: 0.5rem;
  }
  
  li {
    margin-bottom: 0.25rem;
  }
`;

const MessageContainer = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const HeapVisualization = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 400px;
  position: relative;
`;

const HeapTypeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const ToggleLabel = styled.span<{ isActive?: boolean }>`
  color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : theme.colors.gray500};
`;

const HeapArrayContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const HeapArrayItem = styled.div<{ isHighlighted?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : 'white'};
  color: ${({ theme, isHighlighted }) => 
    isHighlighted ? 'white' : theme.colors.gray800};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 600;
  border: 1px solid ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : theme.colors.gray300};
  position: relative;
`;

const ArrayIndex = styled.div`
  position: absolute;
  top: -20px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray500};
  font-weight: normal;
`;

// Heap node type
interface HeapNodeType {
  value: number;
  isHighlighted: boolean;
  x?: number;
  y?: number;
}

// Heap Page Component
const HeapPage: React.FC = () => {
  const [heap, setHeap] = useState<HeapNodeType[]>([]);
  const [value, setValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isMinHeap, setIsMinHeap] = useState<boolean>(true);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [edges, setEdges] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  
  // Initialize heap
  useEffect(() => {
    resetHeap();
  }, []);
  
  // Update edges when heap changes
  useEffect(() => {
    calculateEdges();
  }, [heap]);
  
  const resetHeap = () => {
    const initialValues = isMinHeap ? [3, 5, 7, 8, 10, 15, 20] : [20, 15, 10, 8, 7, 5, 3];
    const newHeap: HeapNodeType[] = [];
    
    initialValues.forEach(value => {
      insert(value, newHeap, false);
    });
    
    setHeap(newHeap);
    setHighlightedIndex(null);
    setMessage(`${isMinHeap ? 'Min' : 'Max'} heap initialized with values ${initialValues.join(', ')}`);
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  const toggleHeapType = () => {
    setIsMinHeap(!isMinHeap);
    setTimeout(() => {
      resetHeap();
    }, 100);
  };
  
  const insert = (newValue: number, currentHeap: HeapNodeType[] = heap, updateState: boolean = true) => {
    // Add the new value to the end of the heap
    const updatedHeap = [...currentHeap, { value: newValue, isHighlighted: true }];
    
    // Get the index of the newly added element
    let currentIndex = updatedHeap.length - 1;
    
    // Heapify up
    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      
      // For min heap, if parent is greater than child, swap
      // For max heap, if parent is less than child, swap
      if ((isMinHeap && updatedHeap[parentIndex].value > updatedHeap[currentIndex].value) ||
          (!isMinHeap && updatedHeap[parentIndex].value < updatedHeap[currentIndex].value)) {
        // Swap
        [updatedHeap[parentIndex], updatedHeap[currentIndex]] = [updatedHeap[currentIndex], updatedHeap[parentIndex]];
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
    
    if (updateState) {
      setHeap(updatedHeap);
      setHighlightedIndex(currentIndex);
      setMessage(`Inserted ${newValue} into the ${isMinHeap ? 'min' : 'max'} heap`);
      setValue('');
      
      // Reset highlight after a delay
      setTimeout(() => {
        setHeap(prevHeap => 
          prevHeap.map(node => ({ ...node, isHighlighted: false }))
        );
        setHighlightedIndex(null);
      }, 1500);
    } else {
      return updatedHeap;
    }
  };
  
  const insertValue = () => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    insert(numValue);
  };
  
  const extractRoot = () => {
    if (heap.length === 0) {
      setMessage('Heap is empty');
      return;
    }
    
    // Highlight the root
    const updatedHeap = heap.map((node, index) => ({
      ...node,
      isHighlighted: index === 0
    }));
    
    setHeap(updatedHeap);
    setHighlightedIndex(0);
    
    const rootValue = heap[0].value;
    
    // After a delay, remove the root and heapify
    setTimeout(() => {
      // If there's only one element, just remove it
      if (heap.length === 1) {
        setHeap([]);
        setMessage(`Extracted ${rootValue} from the ${isMinHeap ? 'min' : 'max'} heap`);
        setHighlightedIndex(null);
        return;
      }
      
      // Replace the root with the last element
      const newHeap = [...heap];
      newHeap[0] = { ...newHeap[newHeap.length - 1], isHighlighted: true };
      newHeap.pop();
      
      // Heapify down
      let currentIndex = 0;
      const heapSize = newHeap.length;
      
      while (true) {
        const leftChildIndex = 2 * currentIndex + 1;
        const rightChildIndex = 2 * currentIndex + 2;
        let swapIndex = currentIndex;
        
        // For min heap, find the smallest value among current, left child, and right child
        // For max heap, find the largest value among current, left child, and right child
        if (leftChildIndex < heapSize) {
          if ((isMinHeap && newHeap[leftChildIndex].value < newHeap[swapIndex].value) ||
              (!isMinHeap && newHeap[leftChildIndex].value > newHeap[swapIndex].value)) {
            swapIndex = leftChildIndex;
          }
        }
        
        if (rightChildIndex < heapSize) {
          if ((isMinHeap && newHeap[rightChildIndex].value < newHeap[swapIndex].value) ||
              (!isMinHeap && newHeap[rightChildIndex].value > newHeap[swapIndex].value)) {
            swapIndex = rightChildIndex;
          }
        }
        
        // If no swap is needed, break
        if (swapIndex === currentIndex) {
          break;
        }
        
        // Swap
        [newHeap[currentIndex], newHeap[swapIndex]] = [newHeap[swapIndex], newHeap[currentIndex]];
        currentIndex = swapIndex;
      }
      
      setHeap(newHeap);
      setHighlightedIndex(currentIndex);
      setMessage(`Extracted ${rootValue} from the ${isMinHeap ? 'min' : 'max'} heap`);
      
      // Reset highlight after a delay
      setTimeout(() => {
        setHeap(prevHeap => 
          prevHeap.map(node => ({ ...node, isHighlighted: false }))
        );
        setHighlightedIndex(null);
      }, 1500);
    }, 800);
  };
  
  const calculateEdges = () => {
    if (heap.length <= 1) {
      setEdges([]);
      return;
    }
    
    const newEdges: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const nodeWidth = 50;
    const levelHeight = 80;
    const baseWidth = 600;
    
    // Calculate node positions
    const nodePositions: { x: number; y: number }[] = [];
    
    for (let i = 0; i < heap.length; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const levelWidth = baseWidth / Math.pow(2, level);
      const levelStartIndex = Math.pow(2, level) - 1;
      const levelPosition = i - levelStartIndex;
      
      const x = (levelPosition + 0.5) * levelWidth;
      const y = level * levelHeight + nodeWidth / 2;
      
      nodePositions.push({ x, y });
    }
    
    // Calculate edges
    for (let i = 0; i < heap.length; i++) {
      const parentIndex = Math.floor((i - 1) / 2);
      
      if (i > 0) {
        newEdges.push({
          x1: nodePositions[parentIndex].x,
          y1: nodePositions[parentIndex].y + nodeWidth / 2,
          x2: nodePositions[i].x,
          y2: nodePositions[i].y - nodeWidth / 2
        });
      }
    }
    
    setEdges(newEdges);
  };
  
  // Code snippets
  const insertCode = `
function insert(value) {
  // Add the new value to the end of the heap
  this.heap.push(value);
  
  // Get the index of the newly added element
  let currentIndex = this.heap.length - 1;
  
  // Heapify up
  while (currentIndex > 0) {
    const parentIndex = Math.floor((currentIndex - 1) / 2);
    
    // For min heap, if parent is greater than child, swap
    // For max heap, if parent is less than child, swap
    if ((this.isMinHeap && this.heap[parentIndex] > this.heap[currentIndex]) ||
        (!this.isMinHeap && this.heap[parentIndex] < this.heap[currentIndex])) {
      // Swap
      [this.heap[parentIndex], this.heap[currentIndex]] = 
        [this.heap[currentIndex], this.heap[parentIndex]];
      currentIndex = parentIndex;
    } else {
      break;
    }
  }
}`;

  const extractCode = `
function extractRoot() {
  if (this.heap.length === 0) {
    return null;
  }
  
  const root = this.heap[0];
  
  // If there's only one element, just remove it
  if (this.heap.length === 1) {
    this.heap.pop();
    return root;
  }
  
  // Replace the root with the last element
  this.heap[0] = this.heap.pop();
  
  // Heapify down
  let currentIndex = 0;
  const heapSize = this.heap.length;
  
  while (true) {
    const leftChildIndex = 2 * currentIndex + 1;
    const rightChildIndex = 2 * currentIndex + 2;
    let swapIndex = currentIndex;
    
    // For min heap, find the smallest value
    // For max heap, find the largest value
    if (leftChildIndex < heapSize) {
      if ((this.isMinHeap && this.heap[leftChildIndex] < this.heap[swapIndex]) ||
          (!this.isMinHeap && this.heap[leftChildIndex] > this.heap[swapIndex])) {
        swapIndex = leftChildIndex;
      }
    }
    
    if (rightChildIndex < heapSize) {
      if ((this.isMinHeap && this.heap[rightChildIndex] < this.heap[swapIndex]) ||
          (!this.isMinHeap && this.heap[rightChildIndex] > this.heap[swapIndex])) {
        swapIndex = rightChildIndex;
      }
    }
    
    // If no swap is needed, break
    if (swapIndex === currentIndex) {
      break;
    }
    
    // Swap
    [this.heap[currentIndex], this.heap[swapIndex]] = 
      [this.heap[swapIndex], this.heap[currentIndex]];
    currentIndex = swapIndex;
  }
  
  return root;
}`;

  const peekCode = `
function peek() {
  if (this.heap.length === 0) {
    return null;
  }
  
  return this.heap[0];
}`;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Heap Visualization</PageTitle>
        <PageDescription>
          A heap is a specialized tree-based data structure that satisfies the heap property.
          This visualization demonstrates operations like insertion and extraction in both min and max heaps.
        </PageDescription>
      </PageHeader>
      
      <VisualizerContainer>
        <VisualizerSection>
          <ControlPanel>
            <HeapTypeToggle>
              <ToggleLabel isActive={isMinHeap}>Min Heap</ToggleLabel>
              <Button onClick={toggleHeapType}>
                {isMinHeap ? <FiToggleLeft size={20} /> : <FiToggleRight size={20} />}
              </Button>
              <ToggleLabel isActive={!isMinHeap}>Max Heap</ToggleLabel>
            </HeapTypeToggle>
            
            <InputGroup>
              <Input 
                type="number" 
                placeholder="Value" 
                value={value} 
                onChange={handleValueChange}
              />
            </InputGroup>
            
            <Button variant="primary" onClick={insertValue}>
              <FiPlus size={16} /> Insert
            </Button>
            
            <Button variant="secondary" onClick={extractRoot}>
              <FiArrowUp size={16} /> Extract {isMinHeap ? 'Min' : 'Max'}
            </Button>
            
            <Button onClick={resetHeap}>
              <FiRefreshCw size={16} /> Reset
            </Button>
          </ControlPanel>
          
          <HeapContainer>
            <HeapTreeContainer>
              <EdgeContainer>
                {edges.map((edge, index) => (
                  <Edge 
                    key={index}
                    x1={edge.x1}
                    y1={edge.y1}
                    x2={edge.x2}
                    y2={edge.y2}
                  />
                ))}
              </EdgeContainer>
              
              <AnimatePresence>
                {heap.map((node, index) => {
                  const level = Math.floor(Math.log2(index + 1));
                  const levelWidth = 600 / Math.pow(2, level);
                  const levelStartIndex = Math.pow(2, level) - 1;
                  const levelPosition = index - levelStartIndex;
                  
                  const x = (levelPosition + 0.5) * levelWidth;
                  const y = level * 80 + 25;
                  
                  return (
                    <NodeContainer key={`${node.value}-${index}`} style={{ position: 'absolute', left: x, top: y }}>
                      <HeapNode
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3 }}
                        isHighlighted={node.isHighlighted || index === highlightedIndex}
                      >
                        {node.value}
                      </HeapNode>
                    </NodeContainer>
                  );
                })}
              </AnimatePresence>
            </HeapTreeContainer>
            
            <HeapArrayContainer>
              {heap.map((node, index) => (
                <HeapArrayItem 
                  key={`array-${node.value}-${index}`}
                  isHighlighted={node.isHighlighted || index === highlightedIndex}
                >
                  <ArrayIndex>{index}</ArrayIndex>
                  {node.value}
                </HeapArrayItem>
              ))}
            </HeapArrayContainer>
            
            {message && (
              <MessageContainer>
                {message}
              </MessageContainer>
            )}
          </HeapContainer>
          
          <InfoPanel>
            <InfoTitle>About Heaps</InfoTitle>
            <InfoContent>
              <p>
                A heap is a specialized tree-based data structure that satisfies the heap property.
                In a min heap, for any given node, the value of the node is less than or equal to the values of its children.
                In a max heap, the value of the node is greater than or equal to the values of its children.
              </p>
              <ul>
                <li><strong>Insert:</strong> Add a new element to the heap while maintaining the heap property</li>
                <li><strong>Extract Min/Max:</strong> Remove and return the minimum (for min heap) or maximum (for max heap) element</li>
                <li><strong>Peek:</strong> View the minimum (for min heap) or maximum (for max heap) element without removing it</li>
                <li><strong>Time Complexity:</strong>
                  <ul>
                    <li>Insert: O(log n)</li>
                    <li>Extract Min/Max: O(log n)</li>
                    <li>Peek: O(1)</li>
                  </ul>
                </li>
                <li><strong>Applications:</strong>
                  <ul>
                    <li>Priority queues</li>
                    <li>Heap sort</li>
                    <li>Graph algorithms (Dijkstra's, Prim's)</li>
                    <li>Median finding algorithms</li>
                  </ul>
                </li>
              </ul>
            </InfoContent>
          </InfoPanel>
        </VisualizerSection>
        
        <CodeSection>
          <CodeBlock>
            <CodeTitle>Insert Operation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {insertCode}
            </SyntaxHighlighter>
          </CodeBlock>
          
          <CodeBlock>
            <CodeTitle>Extract Min/Max Operation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {extractCode}
            </SyntaxHighlighter>
          </CodeBlock>
          
          <CodeBlock>
            <CodeTitle>Peek Operation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {peekCode}
            </SyntaxHighlighter>
          </CodeBlock>
        </CodeSection>
      </VisualizerContainer>
    </PageContainer>
  );
};

export default HeapPage; 