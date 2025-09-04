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

const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-height: 500px;
`;

const TreeVisualization = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 400px;
  position: relative;
`;

const TreeLevel = styled.div`
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

const TreeNode = styled(motion.div)<{ isHighlighted?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: ${({ theme, isHighlighted }) => 
    isHighlighted ? theme.colors.primary : theme.colors.gray100};
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

const EdgeContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const Edge = styled.div<{ fromX: number; fromY: number; toX: number; toY: number }>`
  position: absolute;
  top: ${({ fromY }) => fromY}px;
  left: ${({ fromX }) => fromX}px;
  width: ${({ fromX, toX }) => Math.abs(toX - fromX)}px;
  height: ${({ fromY, toY }) => Math.abs(toY - fromY)}px;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-left: ${({ fromX, toX }) => fromX > toX ? '2px solid #d1d5db' : 'none'};
    border-right: ${({ fromX, toX }) => fromX < toX ? '2px solid #d1d5db' : 'none'};
    border-top: ${({ fromY, toY }) => fromY > toY ? '2px solid #d1d5db' : 'none'};
    border-bottom: ${({ fromY, toY }) => fromY < toY ? '2px solid #d1d5db' : 'none'};
    border-top-left-radius: ${({ fromX, toX, fromY, toY }) => 
      fromX > toX && fromY > toY ? '10px' : '0'};
    border-top-right-radius: ${({ fromX, toX, fromY, toY }) => 
      fromX < toX && fromY > toY ? '10px' : '0'};
    border-bottom-left-radius: ${({ fromX, toX, fromY, toY }) => 
      fromX > toX && fromY < toY ? '10px' : '0'};
    border-bottom-right-radius: ${({ fromX, toX, fromY, toY }) => 
      fromX < toX && fromY < toY ? '10px' : '0'};
  }
`;

const EmptyTree = styled.div`
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

// Tree node type
interface TreeNodeType {
  value: number;
  left: TreeNodeType | null;
  right: TreeNodeType | null;
  x?: number;
  y?: number;
  level?: number;
  index?: number;
}

// Tree Page Component
const TreePage: React.FC = () => {
  const [root, setRoot] = useState<TreeNodeType | null>(null);
  const [value, setValue] = useState<string>('');
  const [highlightedValue, setHighlightedValue] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [edges, setEdges] = useState<{ fromX: number; fromY: number; toX: number; toY: number }[]>([]);
  
  // Initialize tree with some values
  useEffect(() => {
    resetTree();
  }, []);
  
  const resetTree = () => {
    const initialValues = [50, 30, 70, 20, 40, 60, 80];
    let newRoot: TreeNodeType | null = null;
    
    initialValues.forEach(value => {
      newRoot = insertNode(newRoot, value);
    });
    
    setRoot(newRoot);
    setHighlightedValue(null);
    setMessage('Binary Search Tree initialized with values 50, 30, 70, 20, 40, 60, 80');
    calculateNodePositions();
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  const insertNode = (node: TreeNodeType | null, value: number): TreeNodeType => {
    if (node === null) {
      return { value, left: null, right: null };
    }
    
    if (value < node.value) {
      node.left = insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = insertNode(node.right, value);
    }
    
    return node;
  };
  
  const insert = () => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    // Check if value already exists
    if (search(root, numValue)) {
      setMessage(`Value ${numValue} already exists in the tree`);
      return;
    }
    
    const newRoot = insertNode(root, numValue);
    setRoot(newRoot);
    setHighlightedValue(numValue);
    setMessage(`Inserted ${numValue} into the tree`);
    setValue('');
    calculateNodePositions();
  };
  
  const search = (node: TreeNodeType | null, value: number): boolean => {
    if (node === null) {
      return false;
    }
    
    if (node.value === value) {
      return true;
    }
    
    if (value < node.value) {
      return search(node.left, value);
    } else {
      return search(node.right, value);
    }
  };
  
  const findNode = () => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    const found = search(root, numValue);
    
    if (found) {
      setHighlightedValue(numValue);
      setMessage(`Value ${numValue} found in the tree`);
    } else {
      setHighlightedValue(null);
      setMessage(`Value ${numValue} not found in the tree`);
    }
  };
  
  const calculateNodePositions = () => {
    if (!root) {
      setEdges([]);
      return;
    }
    
    // Assign level and index to each node
    const assignLevelAndIndex = (node: TreeNodeType | null, level: number, index: number) => {
      if (node === null) return;
      
      node.level = level;
      node.index = index;
      
      assignLevelAndIndex(node.left, level + 1, index * 2);
      assignLevelAndIndex(node.right, level + 1, index * 2 + 1);
    };
    
    assignLevelAndIndex(root, 0, 0);
    
    // Calculate x and y coordinates
    const nodeWidth = 50;
    const levelHeight = 80;
    const baseWidth = 600;
    
    const calculateCoordinates = (node: TreeNodeType | null, maxLevel: number) => {
      if (node === null) return;
      
      const levelWidth = baseWidth / Math.pow(2, node.level!);
      node.x = (node.index! - Math.pow(2, node.level!) / 2 + 0.5) * levelWidth + baseWidth / 2;
      node.y = node.level! * levelHeight + nodeWidth / 2;
      
      calculateCoordinates(node.left, maxLevel);
      calculateCoordinates(node.right, maxLevel);
    };
    
    // Find max level
    const findMaxLevel = (node: TreeNodeType | null): number => {
      if (node === null) return 0;
      return Math.max(node.level!, findMaxLevel(node.left), findMaxLevel(node.right));
    };
    
    const maxLevel = findMaxLevel(root);
    calculateCoordinates(root, maxLevel);
    
    // Calculate edges
    const newEdges: { fromX: number; fromY: number; toX: number; toY: number }[] = [];
    
    const addEdges = (node: TreeNodeType | null) => {
      if (node === null) return;
      
      if (node.left) {
        newEdges.push({
          fromX: node.x!,
          fromY: node.y! + nodeWidth / 2,
          toX: node.left.x!,
          toY: node.left.y! - nodeWidth / 2
        });
        addEdges(node.left);
      }
      
      if (node.right) {
        newEdges.push({
          fromX: node.x!,
          fromY: node.y! + nodeWidth / 2,
          toX: node.right.x!,
          toY: node.right.y! - nodeWidth / 2
        });
        addEdges(node.right);
      }
    };
    
    addEdges(root);
    setEdges(newEdges);
  };
  
  // Render tree nodes
  const renderTree = (node: TreeNodeType | null) => {
    if (node === null) return null;
    
    return (
      <NodeContainer key={node.value} style={{ position: 'absolute', left: node.x, top: node.y }}>
        <TreeNode
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          isHighlighted={node.value === highlightedValue}
        >
          {node.value}
        </TreeNode>
      </NodeContainer>
    );
  };
  
  // Flatten tree for rendering
  const flattenTree = (node: TreeNodeType | null): TreeNodeType[] => {
    if (node === null) return [];
    return [...flattenTree(node.left), node, ...flattenTree(node.right)];
  };
  
  const flatNodes = root ? flattenTree(root) : [];
  
  // Code snippets
  const insertCode = `
function insert(value) {
  // Create a new node
  const newNode = { value, left: null, right: null };
  
  // If tree is empty, new node becomes root
  if (!this.root) {
    this.root = newNode;
    return;
  }
  
  // Find the correct position and insert
  const insertHelper = (node) => {
    // If value is less than node's value, go left
    if (value < node.value) {
      // If left is null, insert here
      if (node.left === null) {
        node.left = newNode;
      } else {
        // Otherwise, continue traversing left
        insertHelper(node.left);
      }
    } 
    // If value is greater than node's value, go right
    else if (value > node.value) {
      // If right is null, insert here
      if (node.right === null) {
        node.right = newNode;
      } else {
        // Otherwise, continue traversing right
        insertHelper(node.right);
      }
    }
    // Value already exists, do nothing
  };
  
  insertHelper(this.root);
}`;

  const searchCode = `
function search(value) {
  // Start from the root
  let current = this.root;
  
  // Traverse the tree
  while (current !== null) {
    // If found, return true
    if (current.value === value) {
      return true;
    }
    
    // If value is less than current, go left
    if (value < current.value) {
      current = current.left;
    } 
    // If value is greater than current, go right
    else {
      current = current.right;
    }
  }
  
  // Value not found
  return false;
}`;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Binary Search Tree Visualization</PageTitle>
        <PageDescription>
          A binary search tree is a hierarchical data structure where each node has at most two children,
          and all values in the left subtree are less than the node's value, while all values in the right subtree are greater.
          This visualization demonstrates operations like insertion and search in a binary search tree.
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
            
            <Button variant="primary" onClick={insert}>
              <FiPlus size={16} /> Insert
            </Button>
            
            <Button variant="secondary" onClick={findNode}>
              <FiSearch size={16} /> Search
            </Button>
            
            <Button onClick={resetTree}>
              <FiRefreshCw size={16} /> Reset
            </Button>
          </ControlPanel>
          
          <TreeContainer>
            <TreeVisualization>
              <EdgeContainer>
                {edges.map((edge, index) => (
                  <Edge 
                    key={index}
                    fromX={edge.fromX}
                    fromY={edge.fromY}
                    toX={edge.toX}
                    toY={edge.toY}
                  />
                ))}
              </EdgeContainer>
              
              <AnimatePresence>
                {flatNodes.map(node => renderTree(node))}
              </AnimatePresence>
              
              {!root && (
                <EmptyTree>Empty Tree</EmptyTree>
              )}
            </TreeVisualization>
            
            {message && (
              <MessageContainer>
                {message}
              </MessageContainer>
            )}
          </TreeContainer>
          
          <InfoPanel>
            <InfoTitle>About Binary Search Trees</InfoTitle>
            <InfoContent>
              <p>
                A binary search tree (BST) is a binary tree where each node has at most two children,
                and all values in the left subtree are less than the node's value, while all values in the right subtree are greater.
              </p>
              <ul>
                <li><strong>Insert:</strong> Add a new node while maintaining the BST property</li>
                <li><strong>Search:</strong> Find a node with a specific value</li>
                <li><strong>Time Complexity:</strong>
                  <ul>
                    <li>Insert: O(log n) average, O(n) worst case</li>
                    <li>Search: O(log n) average, O(n) worst case</li>
                    <li>Delete: O(log n) average, O(n) worst case</li>
                  </ul>
                </li>
                <li><strong>Applications:</strong>
                  <ul>
                    <li>Database indexing</li>
                    <li>Priority queues</li>
                    <li>Sorting algorithms</li>
                    <li>Symbol tables in compilers</li>
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
        </CodeSection>
      </VisualizerContainer>
    </PageContainer>
  );
};

export default TreePage; 