import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
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
  width: 120px;
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

const TrieContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-height: 500px;
`;

const TrieVisualization = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 2rem;
  position: relative;
  overflow: auto;
`;

const NodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const LevelContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 2rem;
`;

const TrieNode = styled(motion.div)<{ 
  isHighlighted?: boolean; 
  isEndOfWord?: boolean;
  isRoot?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ isRoot }) => isRoot ? '60px' : '40px'};
  height: ${({ isRoot }) => isRoot ? '60px' : '40px'};
  background-color: ${({ theme, isHighlighted, isEndOfWord }) => 
    isHighlighted ? theme.colors.primary : 
    isEndOfWord ? theme.colors.secondaryLight : 'white'};
  color: ${({ theme, isHighlighted, isEndOfWord }) => 
    (isHighlighted || isEndOfWord) ? 'white' : theme.colors.gray800};
  border-radius: 50%;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 600;
  font-size: ${({ isRoot }) => isRoot ? '1.25rem' : '1rem'};
  border: 2px solid ${({ theme, isHighlighted, isEndOfWord }) => 
    isHighlighted ? theme.colors.primary : 
    isEndOfWord ? theme.colors.secondaryLight : theme.colors.gray300};
  position: relative;
  z-index: 2;
  margin: 0 0.5rem;
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

const EdgeLabel = styled.text`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  fill: ${({ theme }) => theme.colors.textLight};
`;

const WordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const WordItem = styled.div<{ isHighlighted?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : 'white'};
  color: ${({ theme, isHighlighted }) => 
    isHighlighted ? 'white' : theme.colors.gray800};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 500;
  border: 1px solid ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : theme.colors.gray300};
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

const ResultContainer = styled.div<{ success?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: ${({ theme, success }) => 
    success ? theme.colors.success + '20' : theme.colors.danger + '20'};
  color: ${({ theme, success }) => 
    success ? theme.colors.success : theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 500;
  margin-top: 1rem;
`;

// Trie node type
interface TrieNodeType {
  char: string;
  isEndOfWord: boolean;
  children: { [key: string]: TrieNodeType };
  x?: number;
  y?: number;
  level?: number;
  isHighlighted?: boolean;
  isRoot?: boolean;
}

// Edge type
interface EdgeType {
  from: { x: number; y: number };
  to: { x: number; y: number };
  char: string;
}

// TriePage Component
const TriePage: React.FC = () => {
  const [root, setRoot] = useState<TrieNodeType>({
    char: '',
    isEndOfWord: false,
    children: {},
    isRoot: true
  });
  const [word, setWord] = useState<string>('');
  const [prefix, setPrefix] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [searchResult, setSearchResult] = useState<{ success: boolean; message: string } | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
  const [edges, setEdges] = useState<EdgeType[]>([]);
  const [nodes, setNodes] = useState<TrieNodeType[]>([]);
  
  // Initialize trie
  useEffect(() => {
    resetTrie();
  }, []);
  
  // Update visualization when root changes
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = calculateNodesAndEdges(root);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [root]);
  
  const resetTrie = () => {
    const initialWords = ['apple', 'app', 'application', 'banana', 'ball', 'cat', 'car'];
    
    const newRoot: TrieNodeType = {
      char: '',
      isEndOfWord: false,
      children: {},
      isRoot: true
    };
    
    initialWords.forEach(word => {
      insertWord(word, newRoot);
    });
    
    setRoot(newRoot);
    setWords(initialWords);
    setHighlightedWords([]);
    setMessage('Trie initialized with 7 words');
    setSearchResult(null);
  };
  
  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value.toLowerCase());
  };
  
  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrefix(e.target.value.toLowerCase());
  };
  
  const insertWord = (word: string, currentRoot: TrieNodeType = root) => {
    let current = currentRoot;
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      
      if (!current.children[char]) {
        current.children[char] = {
          char,
          isEndOfWord: false,
          children: {}
        };
      }
      
      current = current.children[char];
    }
    
    current.isEndOfWord = true;
    return currentRoot;
  };
  
  const handleInsert = () => {
    if (!word.trim()) {
      setMessage('Please enter a word to insert');
      return;
    }
    
    if (words.includes(word)) {
      setMessage(`Word "${word}" already exists in the trie`);
      return;
    }
    
    const newRoot = JSON.parse(JSON.stringify(root));
    insertWord(word, newRoot);
    
    setRoot(newRoot);
    setWords([...words, word]);
    setMessage(`Inserted "${word}" into the trie`);
    setWord('');
    
    // Highlight the path of the inserted word
    highlightPath(word);
  };
  
  const searchWord = (word: string, currentRoot: TrieNodeType = root): boolean => {
    let current = currentRoot;
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      
      if (!current.children[char]) {
        return false;
      }
      
      current = current.children[char];
    }
    
    return current.isEndOfWord;
  };
  
  const handleSearch = () => {
    if (!word.trim()) {
      setMessage('Please enter a word to search');
      return;
    }
    
    const found = searchWord(word);
    
    setSearchResult({
      success: found,
      message: found ? `Word "${word}" found in the trie` : `Word "${word}" not found in the trie`
    });
    
    // Highlight the path of the searched word
    highlightPath(word);
  };
  
  const searchPrefix = (prefix: string, currentRoot: TrieNodeType = root): string[] => {
    let current = currentRoot;
    
    // Navigate to the end of the prefix
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      
      if (!current.children[char]) {
        return [];
      }
      
      current = current.children[char];
    }
    
    // Collect all words with this prefix
    const result: string[] = [];
    collectWords(current, prefix, result);
    return result;
  };
  
  const collectWords = (node: TrieNodeType, prefix: string, result: string[]) => {
    if (node.isEndOfWord) {
      result.push(prefix);
    }
    
    for (const char in node.children) {
      collectWords(node.children[char], prefix + char, result);
    }
  };
  
  const handlePrefixSearch = () => {
    if (!prefix.trim()) {
      setMessage('Please enter a prefix to search');
      return;
    }
    
    const wordsWithPrefix = searchPrefix(prefix);
    
    if (wordsWithPrefix.length > 0) {
      setHighlightedWords(wordsWithPrefix);
      setMessage(`Found ${wordsWithPrefix.length} words with prefix "${prefix}"`);
    } else {
      setHighlightedWords([]);
      setMessage(`No words found with prefix "${prefix}"`);
    }
    
    // Highlight the path of the prefix
    highlightPath(prefix, false);
  };
  
  const highlightPath = (str: string, requireEndOfWord: boolean = true) => {
    // Reset all highlights
    const newNodes = nodes.map(node => ({
      ...node,
      isHighlighted: false
    }));
    
    let current = root;
    let path = [];
    let found = true;
    
    // Navigate through the trie following the string
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      
      if (!current.children[char]) {
        found = false;
        break;
      }
      
      current = current.children[char];
      path.push(current.char);
    }
    
    // If we need to check if it's a complete word and it's not, don't highlight
    if (requireEndOfWord && !current.isEndOfWord) {
      found = false;
    }
    
    if (found) {
      // Highlight the nodes in the path
      for (let i = 0; i < newNodes.length; i++) {
        const nodeLevel = newNodes[i].level;
        if (path.includes(newNodes[i].char) && typeof nodeLevel === 'number' && nodeLevel <= str.length) {
          newNodes[i].isHighlighted = true;
        }
      }
      
      setNodes(newNodes);
      
      // Reset highlights after a delay
      setTimeout(() => {
        setNodes(nodes.map(node => ({
          ...node,
          isHighlighted: false
        })));
      }, 2000);
    }
  };
  
  const calculateNodesAndEdges = (root: TrieNodeType) => {
    const nodes: TrieNodeType[] = [];
    const edges: EdgeType[] = [];
    const nodeWidth = 40;
    const nodeHeight = 40;
    const levelHeight = 80;
    const horizontalSpacing = 60;
    
    // BFS to calculate positions
    const queue: { node: TrieNodeType; level: number; parent: TrieNodeType | null; parentX?: number; parentY?: number }[] = [
      { node: root, level: 0, parent: null }
    ];
    
    // Add root node
    root.level = 0;
    root.x = 400; // Center of the visualization
    root.y = 40;
    nodes.push(root);
    
    while (queue.length > 0) {
      const { node, level, parent, parentX, parentY } = queue.shift()!;
      
      const children = Object.values(node.children);
      
      if (children.length > 0) {
        const totalWidth = (children.length - 1) * horizontalSpacing;
        let startX = (node.x || 400) - totalWidth / 2;
        
        children.forEach((child, index) => {
          child.level = level + 1;
          child.x = startX + index * horizontalSpacing;
          child.y = (level + 1) * levelHeight + nodeHeight / 2;
          
          nodes.push(child);
          
          if (parent) {
            edges.push({
              from: { x: parentX || 0, y: parentY || 0 },
              to: { x: child.x, y: child.y - nodeHeight / 2 },
              char: child.char
            });
          }
          
          queue.push({ 
            node: child, 
            level: level + 1, 
            parent: node,
            parentX: child.x,
            parentY: child.y
          });
        });
      }
    }
    
    return { nodes, edges };
  };
  
  // Code snippets
  const insertCode = `
function insert(word) {
  let current = this.root;
  
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    
    // If the character doesn't exist in the current node's children,
    // create a new node for it
    if (!current.children[char]) {
      current.children[char] = {
        char,
        isEndOfWord: false,
        children: {}
      };
    }
    
    // Move to the next node
    current = current.children[char];
  }
  
  // Mark the end of the word
  current.isEndOfWord = true;
}`;

  const searchCode = `
function search(word) {
  let current = this.root;
  
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    
    // If the character doesn't exist in the current node's children,
    // the word is not in the trie
    if (!current.children[char]) {
      return false;
    }
    
    // Move to the next node
    current = current.children[char];
  }
  
  // Check if this is a complete word
  return current.isEndOfWord;
}`;

  const prefixSearchCode = `
function startsWith(prefix) {
  let current = this.root;
  
  // Navigate to the end of the prefix
  for (let i = 0; i < prefix.length; i++) {
    const char = prefix[i];
    
    if (!current.children[char]) {
      return [];
    }
    
    current = current.children[char];
  }
  
  // Collect all words with this prefix
  const result = [];
  this.collectWords(current, prefix, result);
  return result;
}

function collectWords(node, prefix, result) {
  if (node.isEndOfWord) {
    result.push(prefix);
  }
  
  for (const char in node.children) {
    this.collectWords(node.children[char], prefix + char, result);
  }
}`;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Trie (Prefix Tree) Visualization</PageTitle>
        <PageDescription>
          A trie, also called a prefix tree, is a tree-like data structure used to store a dynamic set of strings.
          Tries are particularly useful for implementing autocomplete and spell-checking features.
        </PageDescription>
      </PageHeader>
      
      <VisualizerContainer>
        <VisualizerSection>
          <ControlPanel>
            <InputGroup>
              <Input 
                type="text" 
                placeholder="Word" 
                value={word} 
                onChange={handleWordChange}
              />
            </InputGroup>
            
            <Button variant="primary" onClick={handleInsert}>
              <FiPlus size={16} /> Insert
            </Button>
            
            <Button variant="secondary" onClick={handleSearch}>
              <FiSearch size={16} /> Search
            </Button>
            
            <InputGroup>
              <Input 
                type="text" 
                placeholder="Prefix" 
                value={prefix} 
                onChange={handlePrefixChange}
              />
            </InputGroup>
            
            <Button onClick={handlePrefixSearch}>
              <FiSearch size={16} /> Prefix Search
            </Button>
            
            <Button onClick={resetTrie}>
              <FiRefreshCw size={16} /> Reset
            </Button>
          </ControlPanel>
          
          <TrieContainer>
            <TrieVisualization>
              <EdgeContainer>
                {edges.map((edge, index) => (
                  <React.Fragment key={index}>
                    <Edge 
                      x1={edge.from.x}
                      y1={edge.from.y}
                      x2={edge.to.x}
                      y2={edge.to.y}
                    />
                    <EdgeLabel
                      x={(edge.from.x + edge.to.x) / 2}
                      y={(edge.from.y + edge.to.y) / 2 - 5}
                      textAnchor="middle"
                    >
                      {edge.char}
                    </EdgeLabel>
                  </React.Fragment>
                ))}
              </EdgeContainer>
              
              <AnimatePresence>
                {nodes.map((node, index) => (
                  <NodeContainer 
                    key={`${node.char}-${index}`} 
                    style={{ 
                      position: 'absolute', 
                      left: node.x, 
                      top: node.y 
                    }}
                  >
                    <TrieNode
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3 }}
                      isHighlighted={node.isHighlighted}
                      isEndOfWord={node.isEndOfWord}
                      isRoot={node.isRoot}
                    >
                      {node.isRoot ? 'Root' : node.char}
                    </TrieNode>
                  </NodeContainer>
                ))}
              </AnimatePresence>
            </TrieVisualization>
            
            <WordList>
              {words.map((w, index) => (
                <WordItem 
                  key={index}
                  isHighlighted={highlightedWords.includes(w)}
                >
                  {w}
                </WordItem>
              ))}
            </WordList>
            
            {message && (
              <MessageContainer>
                {message}
              </MessageContainer>
            )}
            
            {searchResult && (
              <ResultContainer success={searchResult.success}>
                {searchResult.success ? (
                  <FiCheck size={18} />
                ) : (
                  <FiX size={18} />
                )}
                {searchResult.message}
              </ResultContainer>
            )}
          </TrieContainer>
          
          <InfoPanel>
            <InfoTitle>About Tries (Prefix Trees)</InfoTitle>
            <InfoContent>
              <p>
                A trie (pronounced "try") is a tree-like data structure used to store a dynamic set of strings.
                Unlike a binary search tree, nodes in a trie do not store their associated key. Instead, a node's position in the tree defines the key with which it is associated.
              </p>
              <ul>
                <li><strong>Insert:</strong> Add a word to the trie</li>
                <li><strong>Search:</strong> Check if a word exists in the trie</li>
                <li><strong>Prefix Search:</strong> Find all words that start with a given prefix</li>
                <li><strong>Time Complexity:</strong>
                  <ul>
                    <li>Insert: O(m) where m is the length of the word</li>
                    <li>Search: O(m) where m is the length of the word</li>
                    <li>Prefix Search: O(n) where n is the number of nodes in the trie</li>
                  </ul>
                </li>
                <li><strong>Space Complexity:</strong> O(ALPHABET_SIZE * m * n) where m is the average length of words and n is the number of words</li>
                <li><strong>Applications:</strong>
                  <ul>
                    <li>Autocomplete and predictive text</li>
                    <li>Spell checking</li>
                    <li>IP routing (longest prefix matching)</li>
                    <li>Word games (finding valid words)</li>
                    <li>Lexicographic sorting</li>
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
            <CodeTitle>Search Operation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {searchCode}
            </SyntaxHighlighter>
          </CodeBlock>
          
          <CodeBlock>
            <CodeTitle>Prefix Search Operation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {prefixSearchCode}
            </SyntaxHighlighter>
          </CodeBlock>
        </CodeSection>
      </VisualizerContainer>
    </PageContainer>
  );
};

export default TriePage; 