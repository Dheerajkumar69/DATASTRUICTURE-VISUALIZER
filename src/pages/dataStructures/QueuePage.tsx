import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiEye, FiRefreshCw } from 'react-icons/fi';
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

const QueueContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-height: 300px;
`;

const QueueVisualization = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 100px;
  position: relative;
  padding: 2rem 0;
`;

const QueueRail = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.gray300};
  transform: translateY(-50%);
`;

const QueueElement = styled(motion.div)<{ isHighlighted?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : theme.colors.gray100};
  color: ${({ theme, isHighlighted }) => 
    isHighlighted ? 'white' : theme.colors.gray800};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 600;
  font-size: 1.25rem;
  border: 2px solid ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : theme.colors.gray300};
  position: relative;
  z-index: 1;
`;

const FrontIndicator = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const RearIndicator = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
`;

const EmptyQueue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray400};
  font-style: italic;
  margin: 2rem 0;
  z-index: 1;
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

// Queue Page Component
const QueuePage: React.FC = () => {
  const [queue, setQueue] = useState<number[]>([]);
  const [value, setValue] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  
  // Initialize queue with some values
  useEffect(() => {
    resetQueue();
  }, []);
  
  const resetQueue = () => {
    const initialQueue = [10, 20, 30];
    setQueue(initialQueue);
    setHighlightedIndex(null);
    setMessage('Queue initialized with values 10, 20, 30 (front to rear)');
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  const enqueue = () => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    setQueue([...queue, numValue]);
    setHighlightedIndex(queue.length);
    setMessage(`Enqueued ${numValue} at the rear of the queue`);
    setValue('');
  };
  
  const dequeue = () => {
    if (queue.length === 0) {
      setMessage('Cannot dequeue from an empty queue');
      return;
    }
    
    const dequeuedValue = queue[0];
    setQueue(queue.slice(1));
    setHighlightedIndex(null);
    setMessage(`Dequeued ${dequeuedValue} from the front of the queue`);
  };
  
  const peek = () => {
    if (queue.length === 0) {
      setMessage('Cannot peek at an empty queue');
      return;
    }
    
    setHighlightedIndex(0);
    setMessage(`Front element is ${queue[0]}`);
  };
  
  // Code snippets
  const enqueueCode = `
function enqueue(value) {
  // Add element to the rear of the queue
  this.items.push(value);
  this.size++;
}`;

  const dequeueCode = `
function dequeue() {
  // If queue is empty, return null
  if (this.isEmpty()) {
    return null;
  }
  
  // Remove and return the front element
  this.size--;
  return this.items.shift();
}`;

  const peekCode = `
function peek() {
  // If queue is empty, return null
  if (this.isEmpty()) {
    return null;
  }
  
  // Return the front element without removing it
  return this.items[0];
}`;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Queue Visualization</PageTitle>
        <PageDescription>
          A queue is a linear data structure that follows the First In First Out (FIFO) principle.
          This visualization demonstrates operations like enqueue, dequeue, and peek on a queue.
        </PageDescription>
      </PageHeader>
      
      <VisualizerContainer>
        <VisualizerSection>
          <ControlPanel>
            <InputGroup>
              <Input 
                type="number" 
                placeholder="Value" 
                value={value} 
                onChange={handleValueChange}
              />
            </InputGroup>
            
            <Button variant="primary" onClick={enqueue}>
              <FiPlus size={16} /> Enqueue
            </Button>
            
            <Button variant="danger" onClick={dequeue}>
              <FiMinus size={16} /> Dequeue
            </Button>
            
            <Button variant="secondary" onClick={peek}>
              <FiEye size={16} /> Peek
            </Button>
            
            <Button onClick={resetQueue}>
              <FiRefreshCw size={16} /> Reset
            </Button>
          </ControlPanel>
          
          <QueueContainer>
            <QueueVisualization>
              <QueueRail />
              <AnimatePresence>
                {queue.map((value, index) => (
                  <QueueElement 
                    key={`${value}-${index}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    isHighlighted={index === highlightedIndex}
                  >
                    {value}
                    {index === 0 && queue.length > 0 && (
                      <FrontIndicator>FRONT</FrontIndicator>
                    )}
                    {index === queue.length - 1 && queue.length > 0 && (
                      <RearIndicator>REAR</RearIndicator>
                    )}
                  </QueueElement>
                ))}
              </AnimatePresence>
              {queue.length === 0 && (
                <EmptyQueue>Empty Queue</EmptyQueue>
              )}
            </QueueVisualization>
            
            {message && (
              <MessageContainer>
                {message}
              </MessageContainer>
            )}
          </QueueContainer>
          
          <InfoPanel>
            <InfoTitle>About Queues</InfoTitle>
            <InfoContent>
              <p>
                A queue is a linear data structure that follows the First In First Out (FIFO) principle.
                Elements are added at the rear and removed from the front of the queue.
              </p>
              <ul>
                <li><strong>Enqueue:</strong> Add an element to the rear of the queue</li>
                <li><strong>Dequeue:</strong> Remove an element from the front of the queue</li>
                <li><strong>Peek:</strong> View the front element without removing it</li>
                <li><strong>Time Complexity:</strong>
                  <ul>
                    <li>Enqueue: O(1)</li>
                    <li>Dequeue: O(1) with linked list implementation, O(n) with array implementation</li>
                    <li>Peek: O(1)</li>
                  </ul>
                </li>
                <li><strong>Applications:</strong>
                  <ul>
                    <li>Task scheduling</li>
                    <li>Breadth-first search</li>
                    <li>Print job management</li>
                    <li>Request handling in web servers</li>
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

export default QueuePage; 