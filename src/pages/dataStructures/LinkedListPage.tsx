import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiSearch, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
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

const LinkedListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-height: 200px;
`;

const LinkedListRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;

const NodeContainer = styled(motion.div)<{ isHighlighted?: boolean }>`
  display: flex;
  align-items: center;
`;

const Node = styled.div<{ isHighlighted?: boolean }>`
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
  position: relative;
  border: 2px solid ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : theme.colors.gray300};
`;

const Pointer = styled(motion.div)`
  display: flex;
  align-items: center;
  margin: 0 0.5rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const HeadPointer = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const TailPointer = styled.div`
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
`;

const NullPointer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: 2px dashed ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.gray400};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.875rem;
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

// Node type for linked list
interface ListNode {
  value: number;
  id: number;
}

// Linked List Page Component
const LinkedListPage: React.FC = () => {
  const [nodes, setNodes] = useState<ListNode[]>([]);
  const [value, setValue] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [highlightedNodeId, setHighlightedNodeId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [nextId, setNextId] = useState<number>(0);
  
  // Initialize linked list with some values
  useEffect(() => {
    resetList();
  }, []);
  
  const resetList = () => {
    const initialNodes = [
      { value: 10, id: 0 },
      { value: 20, id: 1 },
      { value: 30, id: 2 },
    ];
    setNodes(initialNodes);
    setNextId(3);
    setHighlightedNodeId(null);
    setMessage('Linked list initialized with values 10, 20, 30');
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(e.target.value);
  };
  
  const insertAtHead = () => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    const newNode = { value: numValue, id: nextId };
    setNodes([newNode, ...nodes]);
    setNextId(nextId + 1);
    setHighlightedNodeId(newNode.id);
    setMessage(`Inserted ${numValue} at the head of the list`);
    setValue('');
  };
  
  const insertAtTail = () => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    const newNode = { value: numValue, id: nextId };
    setNodes([...nodes, newNode]);
    setNextId(nextId + 1);
    setHighlightedNodeId(newNode.id);
    setMessage(`Inserted ${numValue} at the tail of the list`);
    setValue('');
  };
  
  const insertAtPosition = () => {
    const numValue = parseInt(value);
    const numPosition = parseInt(position);
    
    if (isNaN(numValue)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    if (isNaN(numPosition) || numPosition < 0 || numPosition > nodes.length) {
      setMessage(`Please enter a valid position between 0 and ${nodes.length}`);
      return;
    }
    
    const newNode = { value: numValue, id: nextId };
    const newNodes = [...nodes];
    newNodes.splice(numPosition, 0, newNode);
    setNodes(newNodes);
    setNextId(nextId + 1);
    setHighlightedNodeId(newNode.id);
    setMessage(`Inserted ${numValue} at position ${numPosition}`);
    setValue('');
    setPosition('');
  };
  
  const removeFromHead = () => {
    if (nodes.length === 0) {
      setMessage('The list is empty');
      return;
    }
    
    const removedNode = nodes[0];
    setNodes(nodes.slice(1));
    setHighlightedNodeId(null);
    setMessage(`Removed ${removedNode.value} from the head of the list`);
  };
  
  const removeFromTail = () => {
    if (nodes.length === 0) {
      setMessage('The list is empty');
      return;
    }
    
    const removedNode = nodes[nodes.length - 1];
    setNodes(nodes.slice(0, -1));
    setHighlightedNodeId(null);
    setMessage(`Removed ${removedNode.value} from the tail of the list`);
  };
  
  const removeAtPosition = () => {
    const numPosition = parseInt(position);
    
    if (nodes.length === 0) {
      setMessage('The list is empty');
      return;
    }
    
    if (isNaN(numPosition) || numPosition < 0 || numPosition >= nodes.length) {
      setMessage(`Please enter a valid position between 0 and ${nodes.length - 1}`);
      return;
    }
    
    const removedNode = nodes[numPosition];
    const newNodes = [...nodes];
    newNodes.splice(numPosition, 1);
    setNodes(newNodes);
    setHighlightedNodeId(null);
    setMessage(`Removed ${removedNode.value} from position ${numPosition}`);
    setPosition('');
  };
  
  const searchValue = () => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    const foundIndex = nodes.findIndex(node => node.value === numValue);
    
    if (foundIndex === -1) {
      setMessage(`Value ${numValue} not found in the list`);
      setHighlightedNodeId(null);
    } else {
      setMessage(`Value ${numValue} found at position ${foundIndex}`);
      setHighlightedNodeId(nodes[foundIndex].id);
    }
  };
  
  // Code snippets
  const insertAtHeadCode = `
function insertAtHead(value) {
  // Create a new node
  const newNode = { value, next: null };
  
  // If list is empty, new node becomes head and tail
  if (!this.head) {
    this.head = newNode;
    this.tail = newNode;
  } else {
    // New node points to current head
    newNode.next = this.head;
    // Update head to new node
    this.head = newNode;
  }
  
  this.length++;
}`;

  const insertAtTailCode = `
function insertAtTail(value) {
  // Create a new node
  const newNode = { value, next: null };
  
  // If list is empty, new node becomes head and tail
  if (!this.head) {
    this.head = newNode;
    this.tail = newNode;
  } else {
    // Current tail points to new node
    this.tail.next = newNode;
    // Update tail to new node
    this.tail = newNode;
  }
  
  this.length++;
}`;

  const removeFromHeadCode = `
function removeFromHead() {
  // If list is empty, return null
  if (!this.head) {
    return null;
  }
  
  const removedNode = this.head;
  
  // If only one node, update head and tail
  if (this.head === this.tail) {
    this.head = null;
    this.tail = null;
  } else {
    // Update head to next node
    this.head = this.head.next;
  }
  
  this.length--;
  return removedNode.value;
}`;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Linked List Visualization</PageTitle>
        <PageDescription>
          A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node in the sequence.
          This visualization demonstrates operations like insertion, deletion, and traversal in singly linked lists.
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
            
            <InputGroup>
              <Input 
                type="number" 
                placeholder="Position" 
                value={position} 
                onChange={handlePositionChange}
              />
            </InputGroup>
            
            <Button variant="primary" onClick={insertAtHead}>
              <FiPlus size={16} /> Insert at Head
            </Button>
            
            <Button variant="primary" onClick={insertAtTail}>
              <FiPlus size={16} /> Insert at Tail
            </Button>
            
            <Button variant="primary" onClick={insertAtPosition}>
              <FiPlus size={16} /> Insert at Position
            </Button>
            
            <Button variant="danger" onClick={removeFromHead}>
              <FiMinus size={16} /> Remove from Head
            </Button>
            
            <Button variant="danger" onClick={removeFromTail}>
              <FiMinus size={16} /> Remove from Tail
            </Button>
            
            <Button variant="danger" onClick={removeAtPosition}>
              <FiMinus size={16} /> Remove at Position
            </Button>
            
            <Button onClick={searchValue}>
              <FiSearch size={16} /> Search
            </Button>
            
            <Button onClick={resetList}>
              <FiRefreshCw size={16} /> Reset
            </Button>
          </ControlPanel>
          
          <LinkedListContainer>
            <LinkedListRow>
              <AnimatePresence>
                {nodes.map((node, index) => (
                  <NodeContainer 
                    key={node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    isHighlighted={node.id === highlightedNodeId}
                  >
                    <Node isHighlighted={node.id === highlightedNodeId}>
                      {index === 0 && <HeadPointer>HEAD</HeadPointer>}
                      {index === nodes.length - 1 && <TailPointer>TAIL</TailPointer>}
                      {node.value}
                    </Node>
                    {index < nodes.length - 1 && (
                      <Pointer>
                        <FiArrowRight size={20} />
                      </Pointer>
                    )}
                    {index === nodes.length - 1 && (
                      <Pointer>
                        <FiArrowRight size={20} />
                        <NullPointer>NULL</NullPointer>
                      </Pointer>
                    )}
                  </NodeContainer>
                ))}
                {nodes.length === 0 && (
                  <NullPointer>Empty List</NullPointer>
                )}
              </AnimatePresence>
            </LinkedListRow>
            
            {message && (
              <MessageContainer>
                {message}
              </MessageContainer>
            )}
          </LinkedListContainer>
          
          <InfoPanel>
            <InfoTitle>About Linked Lists</InfoTitle>
            <InfoContent>
              <p>
                A linked list is a linear data structure where each element (node) contains a value and a reference to the next node.
                Unlike arrays, linked lists don't require contiguous memory allocation, making insertions and deletions more efficient.
              </p>
              <ul>
                <li><strong>Head:</strong> The first node in the list</li>
                <li><strong>Tail:</strong> The last node in the list</li>
                <li><strong>Time Complexity:</strong>
                  <ul>
                    <li>Access: O(n)</li>
                    <li>Search: O(n)</li>
                    <li>Insertion at head/tail: O(1)</li>
                    <li>Insertion at position: O(n)</li>
                    <li>Deletion at head: O(1)</li>
                    <li>Deletion at tail/position: O(n)</li>
                  </ul>
                </li>
              </ul>
            </InfoContent>
          </InfoPanel>
        </VisualizerSection>
        
        <CodeSection>
          <CodeBlock>
            <CodeTitle>Insert at Head</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {insertAtHeadCode}
            </SyntaxHighlighter>
          </CodeBlock>
          
          <CodeBlock>
            <CodeTitle>Insert at Tail</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {insertAtTailCode}
            </SyntaxHighlighter>
          </CodeBlock>
          
          <CodeBlock>
            <CodeTitle>Remove from Head</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {removeFromHeadCode}
            </SyntaxHighlighter>
          </CodeBlock>
        </CodeSection>
      </VisualizerContainer>
    </PageContainer>
  );
};

export default LinkedListPage; 