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

const StackContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-height: 400px;
`;

const StackVisualization = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 0.5rem;
  min-height: 300px;
  position: relative;
`;

const StackBase = styled.div`
  width: 200px;
  height: 10px;
  background-color: ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-top: 0.5rem;
`;

const StackElement = styled(motion.div)<{ isHighlighted?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 50px;
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
`;

const TopIndicator = styled.div`
  position: absolute;
  right: -60px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const EmptyStack = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray400};
  font-style: italic;
  margin: 2rem 0;
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

// Stack Page Component
const StackPage: React.FC = () => {
  const [stack, setStack] = useState<number[]>([]);
  const [value, setValue] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  
  // Initialize stack with some values
  useEffect(() => {
    resetStack();
  }, []);
  
  const resetStack = () => {
    const initialStack = [30, 20, 10];
    setStack(initialStack);
    setHighlightedIndex(null);
    setMessage('Stack initialized with values 10, 20, 30 (bottom to top)');
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  const push = () => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    setStack([...stack, numValue]);
    setHighlightedIndex(stack.length);
    setMessage(`Pushed ${numValue} onto the stack`);
    setValue('');
  };
  
  const pop = () => {
    if (stack.length === 0) {
      setMessage('Cannot pop from an empty stack');
      return;
    }
    
    const poppedValue = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setHighlightedIndex(null);
    setMessage(`Popped ${poppedValue} from the stack`);
  };
  
  const peek = () => {
    if (stack.length === 0) {
      setMessage('Cannot peek at an empty stack');
      return;
    }
    
    setHighlightedIndex(stack.length - 1);
    setMessage(`Top element is ${stack[stack.length - 1]}`);
  };
  
  // Code snippets
  const pushCode = `
function push(value) {
  // Add element to the top of the stack
  this.items.push(value);
  this.size++;
}`;

  const popCode = `
function pop() {
  // If stack is empty, return null
  if (this.isEmpty()) {
    return null;
  }
  
  // Remove and return the top element
  this.size--;
  return this.items.pop();
}`;

  const peekCode = `
function peek() {
  // If stack is empty, return null
  if (this.isEmpty()) {
    return null;
  }
  
  // Return the top element without removing it
  return this.items[this.size - 1];
}`;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Stack Visualization</PageTitle>
        <PageDescription>
          A stack is a linear data structure that follows the Last In First Out (LIFO) principle.
          This visualization demonstrates operations like push, pop, and peek on a stack.
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
            
            <Button variant="primary" onClick={push}>
              <FiPlus size={16} /> Push
            </Button>
            
            <Button variant="danger" onClick={pop}>
              <FiMinus size={16} /> Pop
            </Button>
            
            <Button variant="secondary" onClick={peek}>
              <FiEye size={16} /> Peek
            </Button>
            
            <Button onClick={resetStack}>
              <FiRefreshCw size={16} /> Reset
            </Button>
          </ControlPanel>
          
          <StackContainer>
            <StackVisualization>
              <StackBase />
              <AnimatePresence>
                {stack.map((value, index) => (
                  <StackElement 
                    key={`${value}-${index}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                    isHighlighted={index === highlightedIndex}
                  >
                    {value}
                    {index === stack.length - 1 && (
                      <TopIndicator>TOP</TopIndicator>
                    )}
                  </StackElement>
                ))}
              </AnimatePresence>
              {stack.length === 0 && (
                <EmptyStack>Empty Stack</EmptyStack>
              )}
            </StackVisualization>
            
            {message && (
              <MessageContainer>
                {message}
              </MessageContainer>
            )}
          </StackContainer>
          
          <InfoPanel>
            <InfoTitle>About Stacks</InfoTitle>
            <InfoContent>
              <p>
                A stack is a linear data structure that follows the Last In First Out (LIFO) principle.
                Elements are added and removed from the same end, called the "top" of the stack.
              </p>
              <ul>
                <li><strong>Push:</strong> Add an element to the top of the stack</li>
                <li><strong>Pop:</strong> Remove the top element from the stack</li>
                <li><strong>Peek:</strong> View the top element without removing it</li>
                <li><strong>Time Complexity:</strong>
                  <ul>
                    <li>Push: O(1)</li>
                    <li>Pop: O(1)</li>
                    <li>Peek: O(1)</li>
                  </ul>
                </li>
                <li><strong>Applications:</strong>
                  <ul>
                    <li>Function call management (call stack)</li>
                    <li>Expression evaluation</li>
                    <li>Undo/Redo operations</li>
                    <li>Backtracking algorithms</li>
                  </ul>
                </li>
              </ul>
            </InfoContent>
          </InfoPanel>
        </VisualizerSection>
        
        <CodeSection>
          <CodeBlock>
            <CodeTitle>Push Operation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {pushCode}
            </SyntaxHighlighter>
          </CodeBlock>
          
          <CodeBlock>
            <CodeTitle>Pop Operation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {popCode}
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

export default StackPage; 