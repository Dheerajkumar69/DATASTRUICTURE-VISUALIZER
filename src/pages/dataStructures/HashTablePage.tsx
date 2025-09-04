import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiSearch, FiRefreshCw, FiHash } from 'react-icons/fi';
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

const HashTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-height: 500px;
`;

const HashTableVisualization = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
`;

const HashTableRow = styled.div<{ isHighlighted?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem;
  background-color: ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary + '20' : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: background-color 0.3s ease;
`;

const HashTableIndex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 600;
  margin-right: 1rem;
`;

const HashTableBucket = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex: 1;
  min-height: 40px;
`;

const HashTableItem = styled(motion.div)<{ isHighlighted?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : theme.colors.gray100};
  color: ${({ theme, isHighlighted }) => 
    isHighlighted ? 'white' : theme.colors.gray800};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.875rem;
  border: 1px solid ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : theme.colors.gray300};
`;

const KeyValuePair = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Key = styled.span`
  font-weight: 600;
`;

const Value = styled.span`
  color: inherit;
  opacity: 0.8;
`;

const Separator = styled.span`
  color: inherit;
  opacity: 0.5;
`;

const HashFunction = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.875rem;
  margin-top: 1rem;
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

// Hash table item type
interface HashTableItemType {
  key: string;
  value: string;
  isHighlighted: boolean;
}

// Hash table bucket type
type HashTableBucketType = HashTableItemType[];

// Hash Table Page Component
const HashTablePage: React.FC = () => {
  const [hashTable, setHashTable] = useState<HashTableBucketType[]>([]);
  const [key, setKey] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [tableSize, setTableSize] = useState<number>(10);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  
  // Initialize hash table
  useEffect(() => {
    resetHashTable();
  }, []);
  
  const resetHashTable = () => {
    const newHashTable: HashTableBucketType[] = Array(tableSize).fill(null).map(() => []);
    
    // Add some initial key-value pairs
    const initialData = [
      { key: 'name', value: 'John' },
      { key: 'age', value: '30' },
      { key: 'city', value: 'New York' },
      { key: 'job', value: 'Developer' },
      { key: 'hobby', value: 'Coding' }
    ];
    
    initialData.forEach(item => {
      const index = hashFunction(item.key, tableSize);
      newHashTable[index].push({
        key: item.key,
        value: item.value,
        isHighlighted: false
      });
    });
    
    setHashTable(newHashTable);
    setHighlightedIndex(null);
    setMessage('Hash table initialized with 5 key-value pairs');
  };
  
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  // Simple hash function
  const hashFunction = (key: string, size: number): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % size;
    }
    return hash;
  };
  
  const insert = () => {
    if (!key) {
      setMessage('Please enter a key');
      return;
    }
    
    const index = hashFunction(key, tableSize);
    
    // Check if key already exists
    const existingItemIndex = hashTable[index].findIndex(item => item.key === key);
    
    if (existingItemIndex !== -1) {
      // Update existing key
      const newHashTable = [...hashTable];
      newHashTable[index] = [...newHashTable[index]];
      newHashTable[index][existingItemIndex] = {
        ...newHashTable[index][existingItemIndex],
        value,
        isHighlighted: true
      };
      
      setHashTable(newHashTable);
      setHighlightedIndex(index);
      setMessage(`Updated key "${key}" with value "${value}" at index ${index}`);
    } else {
      // Insert new key-value pair
      const newHashTable = [...hashTable];
      newHashTable[index] = [
        ...newHashTable[index],
        { key, value, isHighlighted: true }
      ];
      
      setHashTable(newHashTable);
      setHighlightedIndex(index);
      setMessage(`Inserted key "${key}" with value "${value}" at index ${index}`);
    }
    
    // Reset highlight after a delay
    setTimeout(() => {
      const newHashTable = [...hashTable];
      newHashTable[index] = newHashTable[index].map(item => ({
        ...item,
        isHighlighted: false
      }));
      
      setHashTable(newHashTable);
      setHighlightedIndex(null);
    }, 1500);
    
    setKey('');
    setValue('');
  };
  
  const remove = () => {
    if (!key) {
      setMessage('Please enter a key to remove');
      return;
    }
    
    const index = hashFunction(key, tableSize);
    
    // Check if key exists
    const existingItemIndex = hashTable[index].findIndex(item => item.key === key);
    
    if (existingItemIndex === -1) {
      setMessage(`Key "${key}" not found in the hash table`);
      return;
    }
    
    // Highlight the item to be removed
    const newHashTable = [...hashTable];
    newHashTable[index] = [...newHashTable[index]];
    newHashTable[index][existingItemIndex] = {
      ...newHashTable[index][existingItemIndex],
      isHighlighted: true
    };
    
    setHashTable(newHashTable);
    setHighlightedIndex(index);
    
    // Remove the item after a delay
    setTimeout(() => {
      const updatedHashTable = [...hashTable];
      updatedHashTable[index] = updatedHashTable[index].filter(item => item.key !== key);
      
      setHashTable(updatedHashTable);
      setHighlightedIndex(null);
      setMessage(`Removed key "${key}" from index ${index}`);
    }, 800);
    
    setKey('');
  };
  
  const search = () => {
    if (!key) {
      setMessage('Please enter a key to search');
      return;
    }
    
    const index = hashFunction(key, tableSize);
    
    // Check if key exists
    const existingItem = hashTable[index].find(item => item.key === key);
    
    if (!existingItem) {
      setMessage(`Key "${key}" not found in the hash table`);
      return;
    }
    
    // Highlight the found item
    const newHashTable = [...hashTable];
    newHashTable[index] = newHashTable[index].map(item => ({
      ...item,
      isHighlighted: item.key === key
    }));
    
    setHashTable(newHashTable);
    setHighlightedIndex(index);
    setMessage(`Found key "${key}" with value "${existingItem.value}" at index ${index}`);
    
    // Reset highlight after a delay
    setTimeout(() => {
      const updatedHashTable = [...hashTable];
      updatedHashTable[index] = updatedHashTable[index].map(item => ({
        ...item,
        isHighlighted: false
      }));
      
      setHashTable(updatedHashTable);
      setHighlightedIndex(null);
    }, 1500);
  };
  
  // Code snippets
  const insertCode = `
function insert(key, value) {
  // Calculate the index using hash function
  const index = this.hash(key);
  
  // Check if bucket exists
  if (!this.table[index]) {
    this.table[index] = [];
  }
  
  // Check if key already exists
  for (let i = 0; i < this.table[index].length; i++) {
    if (this.table[index][i].key === key) {
      // Update value if key exists
      this.table[index][i].value = value;
      return;
    }
  }
  
  // Add new key-value pair
  this.table[index].push({ key, value });
}`;

  const searchCode = `
function search(key) {
  // Calculate the index using hash function
  const index = this.hash(key);
  
  // Check if bucket exists
  if (!this.table[index]) {
    return null;
  }
  
  // Search for the key in the bucket
  for (let i = 0; i < this.table[index].length; i++) {
    if (this.table[index][i].key === key) {
      return this.table[index][i].value;
    }
  }
  
  // Key not found
  return null;
}`;

  const removeCode = `
function remove(key) {
  // Calculate the index using hash function
  const index = this.hash(key);
  
  // Check if bucket exists
  if (!this.table[index]) {
    return false;
  }
  
  // Find the key in the bucket
  for (let i = 0; i < this.table[index].length; i++) {
    if (this.table[index][i].key === key) {
      // Remove the key-value pair
      this.table[index].splice(i, 1);
      return true;
    }
  }
  
  // Key not found
  return false;
}`;

  const hashFunctionCode = `
function hash(key) {
  let hash = 0;
  
  // Convert string key to numeric hash
  for (let i = 0; i < key.length; i++) {
    hash += key.charCodeAt(i);
  }
  
  // Ensure hash is within table size
  return hash % this.size;
}`;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Hash Table Visualization</PageTitle>
        <PageDescription>
          A hash table is a data structure that implements an associative array abstract data type, a structure that can map keys to values.
          This visualization demonstrates operations like insertion, deletion, and lookup in hash tables with collision resolution using chaining.
        </PageDescription>
      </PageHeader>
      
      <VisualizerContainer>
        <VisualizerSection>
          <ControlPanel>
            <InputGroup>
              <Input 
                type="text" 
                placeholder="Key" 
                value={key} 
                onChange={handleKeyChange}
              />
            </InputGroup>
            
            <InputGroup>
              <Input 
                type="text" 
                placeholder="Value" 
                value={value} 
                onChange={handleValueChange}
              />
            </InputGroup>
            
            <Button variant="primary" onClick={insert}>
              <FiPlus size={16} /> Insert
            </Button>
            
            <Button variant="danger" onClick={remove}>
              <FiMinus size={16} /> Remove
            </Button>
            
            <Button variant="secondary" onClick={search}>
              <FiSearch size={16} /> Search
            </Button>
            
            <Button onClick={resetHashTable}>
              <FiRefreshCw size={16} /> Reset
            </Button>
          </ControlPanel>
          
          <HashTableContainer>
            <HashFunction>
              <FiHash size={14} style={{ marginRight: '0.5rem' }} />
              hash(key) = sum(ASCII values of characters) % {tableSize}
            </HashFunction>
            
            <HashTableVisualization>
              {hashTable.map((bucket, index) => (
                <HashTableRow key={index} isHighlighted={index === highlightedIndex}>
                  <HashTableIndex>{index}</HashTableIndex>
                  <HashTableBucket>
                    <AnimatePresence>
                      {bucket.map((item, itemIndex) => (
                        <HashTableItem
                          key={`${item.key}-${itemIndex}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                          isHighlighted={item.isHighlighted}
                        >
                          <KeyValuePair>
                            <Key>{item.key}</Key>
                            <Separator>:</Separator>
                            <Value>{item.value}</Value>
                          </KeyValuePair>
                        </HashTableItem>
                      ))}
                    </AnimatePresence>
                  </HashTableBucket>
                </HashTableRow>
              ))}
            </HashTableVisualization>
            
            {message && (
              <MessageContainer>
                {message}
              </MessageContainer>
            )}
          </HashTableContainer>
          
          <InfoPanel>
            <InfoTitle>About Hash Tables</InfoTitle>
            <InfoContent>
              <p>
                A hash table is a data structure that implements an associative array abstract data type, a structure that can map keys to values.
                It uses a hash function to compute an index into an array of buckets or slots, from which the desired value can be found.
              </p>
              <ul>
                <li><strong>Insert:</strong> Add a key-value pair to the hash table</li>
                <li><strong>Search:</strong> Find a value associated with a key</li>
                <li><strong>Remove:</strong> Delete a key-value pair from the hash table</li>
                <li><strong>Time Complexity:</strong>
                  <ul>
                    <li>Average case: O(1) for insert, search, and delete</li>
                    <li>Worst case: O(n) when many collisions occur</li>
                  </ul>
                </li>
                <li><strong>Collision Resolution:</strong>
                  <ul>
                    <li>Chaining: Store multiple key-value pairs in the same bucket (shown in this visualization)</li>
                    <li>Open addressing: Find another slot when a collision occurs</li>
                  </ul>
                </li>
                <li><strong>Applications:</strong>
                  <ul>
                    <li>Database indexing</li>
                    <li>Caches</li>
                    <li>Symbol tables in compilers</li>
                    <li>Associative arrays</li>
                  </ul>
                </li>
              </ul>
            </InfoContent>
          </InfoPanel>
        </VisualizerSection>
        
        <CodeSection>
          <CodeBlock>
            <CodeTitle>Hash Function</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {hashFunctionCode}
            </SyntaxHighlighter>
          </CodeBlock>
          
          <CodeBlock>
            <CodeTitle>Insert Operation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {insertCode}
            </SyntaxHighlighter>
          </CodeBlock>
          
          <CodeBlock>
            <CodeTitle>Search Operation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {searchCode}
            </SyntaxHighlighter>
          </CodeBlock>
          
          <CodeBlock>
            <CodeTitle>Remove Operation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {removeCode}
            </SyntaxHighlighter>
          </CodeBlock>
        </CodeSection>
      </VisualizerContainer>
    </PageContainer>
  );
};

export default HashTablePage; 