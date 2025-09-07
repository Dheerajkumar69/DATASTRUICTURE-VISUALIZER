import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiMinus, FiSearch, FiRefreshCw } from 'react-icons/fi';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { motion } from 'framer-motion';

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

const ArrayContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-height: 200px;
  align-items: center;
  justify-content: center;
`;

const ArrayElement = styled(motion.div)<{ isHighlighted?: boolean }>`
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
`;

const ArrayIndex = styled.div`
  position: absolute;
  bottom: -20px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
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
    color: ${({ theme }) => theme.colors.text};
  }
  
  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;

// Array Page Component
const ArrayPage: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [value, setValue] = useState<string>('');
  const [index, setIndex] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  
  // Initialize array with random values
  useEffect(() => {
    resetArray();
  }, []);
  
  const resetArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100));
    setArray(newArray);
    setHighlightedIndex(null);
    setMessage('Array initialized with random values');
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  const handleIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIndex(e.target.value);
  };
  
  const insertAtIndex = () => {
    const numValue = parseInt(value);
    const numIndex = parseInt(index);
    
    if (isNaN(numValue)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    if (isNaN(numIndex) || numIndex < 0 || numIndex > array.length) {
      setMessage(`Please enter a valid index between 0 and ${array.length}`);
      return;
    }
    
    const newArray = [...array];
    newArray.splice(numIndex, 0, numValue);
    setArray(newArray);
    setHighlightedIndex(numIndex);
    setMessage(`Inserted ${numValue} at index ${numIndex}`);
    setValue('');
    setIndex('');
  };
  
  const removeAtIndex = () => {
    const numIndex = parseInt(index);
    
    if (isNaN(numIndex) || numIndex < 0 || numIndex >= array.length) {
      setMessage(`Please enter a valid index between 0 and ${array.length - 1}`);
      return;
    }
    
    const newArray = [...array];
    const removedValue = newArray.splice(numIndex, 1)[0];
    setArray(newArray);
    setHighlightedIndex(null);
    setMessage(`Removed ${removedValue} from index ${numIndex}`);
    setIndex('');
  };
  
  const searchValue = () => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    const foundIndex = array.indexOf(numValue);
    if (foundIndex !== -1) {
      setHighlightedIndex(foundIndex);
      setMessage(`Found ${numValue} at index ${foundIndex}`);
    } else {
      setHighlightedIndex(null);
      setMessage(`${numValue} not found in the array`);
    }
    setValue('');
  };
  
  const insertCode = `// Insert element at specific index
function insertAt(arr, index, element) {
  // Create a copy of the array
  const newArray = [...arr];
  
  // Use splice to insert the element
  newArray.splice(index, 0, element);
  
  return newArray;
}`;

  const removeCode = `// Remove element at specific index
function removeAt(arr, index) {
  // Create a copy of the array
  const newArray = [...arr];
  
  // Use splice to remove the element
  const removedElement = newArray.splice(index, 1)[0];
  
  return { newArray, removedElement };
}`;

  const searchCode = `// Search for an element in the array
function search(arr, element) {
  // Use indexOf to find the element
  const index = arr.indexOf(element);
  
  // Return the index (or -1 if not found)
  return index;
}`;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Array Visualization</PageTitle>
        <PageDescription>
          An array is a collection of elements stored at contiguous memory locations. 
          This visualization demonstrates common array operations like insertion, deletion, and searching.
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
                aria-label="Value"
              />
              <Input 
                type="number" 
                placeholder="Index" 
                value={index} 
                onChange={handleIndexChange}
                aria-label="Index"
              />
            </InputGroup>
            
            <Button variant="primary" onClick={insertAtIndex}>
              <FiPlus size={16} /> Insert
            </Button>
            
            <Button variant="danger" onClick={removeAtIndex}>
              <FiMinus size={16} /> Remove
            </Button>
            
            <Button variant="secondary" onClick={searchValue}>
              <FiSearch size={16} /> Search
            </Button>
            
            <Button onClick={resetArray}>
              <FiRefreshCw size={16} /> Reset
            </Button>
          </ControlPanel>
          
          <ArrayContainer>
            {array.map((item, idx) => (
              <ArrayElement 
                key={idx} 
                isHighlighted={idx === highlightedIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {item}
                <ArrayIndex>{idx}</ArrayIndex>
              </ArrayElement>
            ))}
          </ArrayContainer>
          
          {message && (
            <InfoPanel>
              <InfoContent aria-live="polite">{message}</InfoContent>
            </InfoPanel>
          )}
          
          <InfoPanel>
            <InfoTitle>Array Operations</InfoTitle>
            <InfoContent>
              <ul>
                <li><strong>Insert:</strong> Add an element at a specific index (O(n) time complexity)</li>
                <li><strong>Remove:</strong> Delete an element at a specific index (O(n) time complexity)</li>
                <li><strong>Search:</strong> Find an element in the array (O(n) time complexity)</li>
                <li><strong>Access:</strong> Get an element at a specific index (O(1) time complexity)</li>
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
            <CodeTitle>Remove Operation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {removeCode}
            </SyntaxHighlighter>
          </CodeBlock>
          
          <CodeBlock>
            <CodeTitle>Search Operation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {searchCode}
            </SyntaxHighlighter>
          </CodeBlock>
        </CodeSection>
      </VisualizerContainer>
    </PageContainer>
  );
};

export default ArrayPage; 