import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiArrowUp, FiRefreshCw } from 'react-icons/fi';
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
  color: ${({ theme }) => theme.colors.textLight};
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
  background-color: ${({ theme }) => theme.colors.card};
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

const PriorityQueueContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.card};
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

const PriorityNode = styled(motion.div)<{ isHighlighted?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 50px;
  background-color: ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : theme.colors.card};
  color: ${({ theme, isHighlighted }) => 
    isHighlighted ? 'white' : theme.colors.gray800};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 600;
  font-size: 1rem;
  border: 2px solid ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : theme.colors.gray300};
  position: relative;
  z-index: 2;
`;

const PriorityLabel = styled.div`
  position: absolute;
  top: -20px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray500};
  font-weight: normal;
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

const QueueArrayContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const QueueArrayItem = styled.div<{ isHighlighted?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 50px;
  background-color: ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : theme.colors.card};
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

const CodeBlock = styled.div`
  background-color: #1E1E1E;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

const CodeTitle = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.card};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.875rem;
`;

const InfoPanel = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.card};
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
  color: ${({ theme }) => theme.colors.textLight};
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

// Priority Queue node type
interface PriorityQueueNode {
  value: string;
  priority: number;
  isHighlighted: boolean;
  x?: number;
  y?: number;
}

// PriorityQueuePage Component
const PriorityQueuePage: React.FC = () => {
  const [queue, setQueue] = useState<PriorityQueueNode[]>([]);
  const [value, setValue] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [edges, setEdges] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  
  // Initialize queue
  useEffect(() => {
    resetQueue();
  }, []);
  
  // Update edges when queue changes
  useEffect(() => {
    calculateEdges();
  }, [queue]);
  
  const resetQueue = () => {
    const initialNodes: PriorityQueueNode[] = [
      { value: 'Task A', priority: 3, isHighlighted: false },
      { value: 'Task B', priority: 1, isHighlighted: false },
      { value: 'Task C', priority: 4, isHighlighted: false },
      { value: 'Task D', priority: 2, isHighlighted: false },
      { value: 'Task E', priority: 5, isHighlighted: false }
    ];
    
    const newQueue: PriorityQueueNode[] = [];
    
    initialNodes.forEach(node => {
      enqueue(node.value, node.priority, newQueue, false);
    });
    
    setQueue(newQueue);
    setHighlightedIndex(null);
    setMessage('Priority queue initialized with 5 tasks');
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriority(e.target.value);
  };
  
  const enqueue = (
    newValue: string, 
    newPriority: number, 
    currentQueue: PriorityQueueNode[] = queue, 
    updateState: boolean = true
  ) => {
    // Add the new node to the end of the queue
    const updatedQueue = [...currentQueue, { 
      value: newValue, 
      priority: newPriority, 
      isHighlighted: true 
    }];
    
    // Get the index of the newly added element
    let currentIndex = updatedQueue.length - 1;
    
    // Heapify up (min-heap based on priority)
    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      
      // If parent has higher priority (higher number means lower priority)
      if (updatedQueue[parentIndex].priority > updatedQueue[currentIndex].priority) {
        // Swap
        [updatedQueue[parentIndex], updatedQueue[currentIndex]] = 
          [updatedQueue[currentIndex], updatedQueue[parentIndex]];
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
    
    if (updateState) {
      setQueue(updatedQueue);
      setHighlightedIndex(currentIndex);
      setMessage(`Enqueued "${newValue}" with priority ${newPriority}`);
      setValue('');
      setPriority('');
      
      // Reset highlight after a delay
      setTimeout(() => {
        setQueue(prevQueue => 
          prevQueue.map(node => ({ ...node, isHighlighted: false }))
        );
        setHighlightedIndex(null);
      }, 1500);
    } else {
      return updatedQueue;
    }
  };
  
  const dequeue = () => {
    if (queue.length === 0) {
      setMessage('Priority queue is empty');
      return;
    }
    
    // Highlight the root (highest priority item)
    const updatedQueue = queue.map((node, index) => ({
      ...node,
      isHighlighted: index === 0
    }));
    
    setQueue(updatedQueue);
    setHighlightedIndex(0);
    
    const highestPriorityItem = queue[0];
    
    // After a delay, remove the root and heapify
    setTimeout(() => {
      // If there's only one element, just remove it
      if (queue.length === 1) {
        setQueue([]);
        setMessage(`Dequeued "${highestPriorityItem.value}" with priority ${highestPriorityItem.priority}`);
        setHighlightedIndex(null);
        return;
      }
      
      // Replace the root with the last element
      const newQueue = [...queue];
      newQueue[0] = { ...newQueue[newQueue.length - 1], isHighlighted: true };
      newQueue.pop();
      
      // Heapify down
      let currentIndex = 0;
      const heapSize = newQueue.length;
      
      while (true) {
        const leftChildIndex = 2 * currentIndex + 1;
        const rightChildIndex = 2 * currentIndex + 2;
        let smallestIndex = currentIndex;
        
        // Find the smallest priority value among current, left child, and right child
        if (leftChildIndex < heapSize && 
            newQueue[leftChildIndex].priority < newQueue[smallestIndex].priority) {
          smallestIndex = leftChildIndex;
        }
        
        if (rightChildIndex < heapSize && 
            newQueue[rightChildIndex].priority < newQueue[smallestIndex].priority) {
          smallestIndex = rightChildIndex;
        }
        
        // If no swap is needed, break
        if (smallestIndex === currentIndex) {
          break;
        }
        
        // Swap
        [newQueue[currentIndex], newQueue[smallestIndex]] = 
          [newQueue[smallestIndex], newQueue[currentIndex]];
        currentIndex = smallestIndex;
      }
      
      setQueue(newQueue);
      setHighlightedIndex(currentIndex);
      setMessage(`Dequeued "${highestPriorityItem.value}" with priority ${highestPriorityItem.priority}`);
      
      // Reset highlight after a delay
      setTimeout(() => {
        setQueue(prevQueue => 
          prevQueue.map(node => ({ ...node, isHighlighted: false }))
        );
        setHighlightedIndex(null);
      }, 1500);
    }, 800);
  };
  
  const calculateEdges = () => {
    if (queue.length <= 1) {
      setEdges([]);
      return;
    }
    
    const newEdges: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const nodeWidth = 80;
    const nodeHeight = 50;
    const levelHeight = 100;
    const baseWidth = 800;
    
    // Calculate node positions
    const nodePositions: { x: number; y: number }[] = [];
    
    for (let i = 0; i < queue.length; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const levelWidth = baseWidth / Math.pow(2, level);
      const levelStartIndex = Math.pow(2, level) - 1;
      const levelPosition = i - levelStartIndex;
      
      const x = (levelPosition + 0.5) * levelWidth;
      const y = level * levelHeight + nodeHeight / 2;
      
      nodePositions.push({ x, y });
    }
    
    // Calculate edges
    for (let i = 0; i < queue.length; i++) {
      const parentIndex = Math.floor((i - 1) / 2);
      
      if (i > 0) {
        newEdges.push({
          x1: nodePositions[parentIndex].x,
          y1: nodePositions[parentIndex].y + nodeHeight / 2,
          x2: nodePositions[i].x,
          y2: nodePositions[i].y - nodeHeight / 2
        });
      }
    }
    
    setEdges(newEdges);
  };
  
  const handleEnqueue = () => {
    if (!value.trim()) {
      setMessage('Please enter a value');
      return;
    }
    
    const priorityNum = parseInt(priority);
    if (isNaN(priorityNum) || priorityNum < 1) {
      setMessage('Please enter a valid priority (1 or higher)');
      return;
    }
    
    enqueue(value, priorityNum);
  };
  
  // Code snippets
  const enqueueCode = `
function enqueue(value, priority) {
  // Add the new node to the end of the queue
  this.heap.push({ value, priority });
  
  // Get the index of the newly added element
  let currentIndex = this.heap.length - 1;
  
  // Heapify up (min-heap based on priority)
  while (currentIndex > 0) {
    const parentIndex = Math.floor((currentIndex - 1) / 2);
    
    // If parent has higher priority value (higher number means lower priority)
    if (this.heap[parentIndex].priority > this.heap[currentIndex].priority) {
      // Swap
      [this.heap[parentIndex], this.heap[currentIndex]] = 
        [this.heap[currentIndex], this.heap[parentIndex]];
      currentIndex = parentIndex;
    } else {
      break;
    }
  }
}`;

  const dequeueCode = `
function dequeue() {
  if (this.heap.length === 0) {
    return null;
  }
  
  const highestPriorityItem = this.heap[0];
  
  // If there's only one element, just remove it
  if (this.heap.length === 1) {
    this.heap.pop();
    return highestPriorityItem;
  }
  
  // Replace the root with the last element
  this.heap[0] = this.heap.pop();
  
  // Heapify down
  let currentIndex = 0;
  const heapSize = this.heap.length;
  
  while (true) {
    const leftChildIndex = 2 * currentIndex + 1;
    const rightChildIndex = 2 * currentIndex + 2;
    let smallestIndex = currentIndex;
    
    // Find the smallest priority value
    if (leftChildIndex < heapSize && 
        this.heap[leftChildIndex].priority < this.heap[smallestIndex].priority) {
      smallestIndex = leftChildIndex;
    }
    
    if (rightChildIndex < heapSize && 
        this.heap[rightChildIndex].priority < this.heap[smallestIndex].priority) {
      smallestIndex = rightChildIndex;
    }
    
    // If no swap is needed, break
    if (smallestIndex === currentIndex) {
      break;
    }
    
    // Swap
    [this.heap[currentIndex], this.heap[smallestIndex]] = 
      [this.heap[smallestIndex], this.heap[currentIndex]];
    currentIndex = smallestIndex;
  }
  
  return highestPriorityItem;
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
        <PageTitle>Priority Queue Visualization</PageTitle>
        <PageDescription>
          A priority queue is an abstract data type similar to a regular queue, but where each element has a priority associated with it.
          Elements with higher priority are served before elements with lower priority.
        </PageDescription>
      </PageHeader>
      
      <VisualizerContainer>
        <VisualizerSection>
          <ControlPanel>
            <InputGroup>
              <Input 
                type="text" 
                placeholder="Value" 
                value={value} 
                onChange={handleValueChange}
              />
            </InputGroup>
            
            <InputGroup>
              <Input 
                type="number" 
                placeholder="Priority" 
                value={priority} 
                onChange={handlePriorityChange}
                min="1"
              />
            </InputGroup>
            
            <Button variant="primary" onClick={handleEnqueue}>
              <FiPlus size={16} /> Enqueue
            </Button>
            
            <Button variant="secondary" onClick={dequeue}>
              <FiMinus size={16} /> Dequeue
            </Button>
            
            <Button onClick={resetQueue}>
              <FiRefreshCw size={16} /> Reset
            </Button>
          </ControlPanel>
          
          <PriorityQueueContainer>
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
                {queue.map((node, index) => {
                  const level = Math.floor(Math.log2(index + 1));
                  const levelWidth = 800 / Math.pow(2, level);
                  const levelStartIndex = Math.pow(2, level) - 1;
                  const levelPosition = index - levelStartIndex;
                  
                  const x = (levelPosition + 0.5) * levelWidth;
                  const y = level * 100 + 25;
                  
                  return (
                    <NodeContainer key={`${node.value}-${index}`} style={{ position: 'absolute', left: x, top: y }}>
                      <PriorityNode
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3 }}
                        isHighlighted={node.isHighlighted || index === highlightedIndex}
                      >
                        <PriorityLabel>Priority: {node.priority}</PriorityLabel>
                        {node.value}
                      </PriorityNode>
                    </NodeContainer>
                  );
                })}
              </AnimatePresence>
            </HeapTreeContainer>
            
            <QueueArrayContainer>
              {queue.map((node, index) => (
                <QueueArrayItem 
                  key={`array-${node.value}-${index}`}
                  isHighlighted={node.isHighlighted || index === highlightedIndex}
                >
                  <ArrayIndex>{index}</ArrayIndex>
                  {node.value}
                  <div style={{ fontSize: '0.75rem' }}>Priority: {node.priority}</div>
                </QueueArrayItem>
              ))}
            </QueueArrayContainer>
            
            {message && (
              <MessageContainer>
                {message}
              </MessageContainer>
            )}
          </PriorityQueueContainer>
          
          <InfoPanel>
            <InfoTitle>About Priority Queues</InfoTitle>
            <InfoContent>
              <p>
                A priority queue is an abstract data type similar to a regular queue, but where each element has a priority associated with it.
                Elements with higher priority are served before elements with lower priority.
              </p>
              <ul>
                <li><strong>Enqueue:</strong> Add an element with a priority to the queue</li>
                <li><strong>Dequeue:</strong> Remove and return the element with the highest priority</li>
                <li><strong>Peek:</strong> View the element with the highest priority without removing it</li>
                <li><strong>Time Complexity:</strong>
                  <ul>
                    <li>Enqueue: O(log n)</li>
                    <li>Dequeue: O(log n)</li>
                    <li>Peek: O(1)</li>
                  </ul>
                </li>
                <li><strong>Implementation:</strong> Priority queues are typically implemented using binary heaps, but can also be implemented using other data structures like binary search trees or arrays.</li>
                <li><strong>Applications:</strong>
                  <ul>
                    <li>Dijkstra's algorithm for finding shortest paths in a graph</li>
                    <li>Prim's algorithm for finding minimum spanning trees</li>
                    <li>Huffman coding for data compression</li>
                    <li>Task scheduling in operating systems</li>
                    <li>Event-driven simulation</li>
                  </ul>
                </li>
              </ul>
            </InfoContent>
          </InfoPanel>
        </VisualizerSection>
        
        <CodeSection>
          <CodeBlock>
            <CodeTitle>Enqueue Operation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {enqueueCode}
            </SyntaxHighlighter>
          </CodeBlock>
          
          <CodeBlock>
            <CodeTitle>Dequeue Operation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {dequeueCode}
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

export default PriorityQueuePage; 