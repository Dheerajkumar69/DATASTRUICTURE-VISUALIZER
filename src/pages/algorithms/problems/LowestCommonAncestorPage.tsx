import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward } from 'react-icons/fa';

// Types
type NodeState = 'default' | 'highlight' | 'selected' | 'path' | 'lca';

interface TreeNode {
  id: number;
  value: string;
  state: NodeState;
  x: number;
  y: number;
  children: TreeNode[];
  parent: TreeNode | null;
}

interface Step {
  tree: TreeNode;
  description: string;
  nodePath1: number[];
  nodePath2: number[];
  lca: number | null;
  currentNodeId: number | null;
}

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavigationRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  text-decoration: none;
  margin-right: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textLight};
  max-width: 800px;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 800px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
  width: 100%;
  height: 500px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: ${props => props.theme.colors.card};
`;

const NodeSelectionContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const NodeSelectionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
`;

const InfoPanel = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors.card};
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
  max-width: 800px;
  width: 100%;
`;

const InfoTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
`;

const InfoText = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 0.5rem;
  line-height: 1.5;
  font-size: 0.9rem;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
`;

const LegendColor = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 0.5rem;
`;

const LowestCommonAncestorPage: React.FC = () => {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1000);
  const [node1Id, setNode1Id] = useState<number>(0);
  const [node2Id, setNode2Id] = useState<number>(0);
  const [allNodes, setAllNodes] = useState<{ id: number; value: string }[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Initialize the tree
  useEffect(() => {
    const exampleTree = createExampleTree();
    setTree(exampleTree);
    
    // Collect all node IDs for the dropdowns
    const nodes: { id: number; value: string }[] = [];
    collectNodes(exampleTree, nodes);
    setAllNodes(nodes);
    
    if (nodes.length >= 2) {
      setNode1Id(nodes[1].id); // Set to second node (index 1)
      setNode2Id(nodes[nodes.length - 1].id); // Set to last node
    }
  }, []);
  
  // Helper to collect all nodes
  const collectNodes = (node: TreeNode, result: { id: number; value: string }[]): void => {
    result.push({ id: node.id, value: node.value });
    for (const child of node.children) {
      collectNodes(child, result);
    }
  };
  
  // Create an example balanced binary tree
  const createExampleTree = (): TreeNode => {
    const root: TreeNode = {
      id: 1,
      value: '1',
      state: 'default',
      x: 0,
      y: 0,
      children: [],
      parent: null
    };
    
    const node2: TreeNode = {
      id: 2,
      value: '2',
      state: 'default',
      x: 0,
      y: 0,
      children: [],
      parent: root
    };
    
    const node3: TreeNode = {
      id: 3,
      value: '3',
      state: 'default',
      x: 0,
      y: 0,
      children: [],
      parent: root
    };
    
    const node4: TreeNode = {
      id: 4,
      value: '4',
      state: 'default',
      x: 0,
      y: 0,
      children: [],
      parent: node2
    };
    
    const node5: TreeNode = {
      id: 5,
      value: '5',
      state: 'default',
      x: 0,
      y: 0,
      children: [],
      parent: node2
    };
    
    const node6: TreeNode = {
      id: 6,
      value: '6',
      state: 'default',
      x: 0,
      y: 0,
      children: [],
      parent: node3
    };
    
    const node7: TreeNode = {
      id: 7,
      value: '7',
      state: 'default',
      x: 0,
      y: 0,
      children: [],
      parent: node3
    };
    
    node2.children = [node4, node5];
    node3.children = [node6, node7];
    root.children = [node2, node3];
    
    return root;
  };
  
  // Animation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isAnimating && !isPaused && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, animationSpeed);
    } else if (currentStep >= steps.length - 1) {
      setIsAnimating(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAnimating, isPaused, currentStep, steps, animationSpeed]);
  
  // Find the lowest common ancestor
  const findLCA = () => {
    if (!tree) return;
    
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    const steps: Step[] = [];
    let treeCopy = deepCopyTree(tree);
    
    // Initial step
    steps.push({
      tree: treeCopy,
      description: `Starting LCA algorithm to find the lowest common ancestor of nodes ${node1Id} and ${node2Id}.`,
      nodePath1: [],
      nodePath2: [],
      lca: null,
      currentNodeId: null
    });
    
    // Find paths from root to both nodes
    const path1: number[] = [];
    const path2: number[] = [];
    
    findPathToNode(treeCopy, node1Id, path1);
    findPathToNode(treeCopy, node2Id, path2);
    
    // Reset tree state after finding paths
    treeCopy = deepCopyTree(tree);
    
    // Add step to show the paths
    treeCopy = deepCopyTree(tree);
    steps.push({
      tree: treeCopy,
      description: `Found paths from root to both nodes. Path to node ${node1Id}: [${path1.join(' → ')}], Path to node ${node2Id}: [${path2.join(' → ')}]`,
      nodePath1: [...path1],
      nodePath2: [...path2],
      lca: null,
      currentNodeId: null
    });
    
    // Find LCA by comparing paths
    let i = 0;
    while (i < path1.length && i < path2.length && path1[i] === path2[i]) {
      // Highlight current common ancestor
      treeCopy = deepCopyTree(tree);
      highlightNode(treeCopy, path1[i], 'highlight');
      
      steps.push({
        tree: treeCopy,
        description: `Checking if node ${path1[i]} is a common ancestor...`,
        nodePath1: [...path1],
        nodePath2: [...path2],
        lca: null,
        currentNodeId: path1[i]
      });
      
      i++;
    }
    
    let lca = path1[i - 1]; // The last common node is the LCA
    
    // Mark the LCA node
    treeCopy = deepCopyTree(tree);
    highlightNodesInPath(treeCopy, path1, 'path');
    highlightNodesInPath(treeCopy, path2, 'path');
    highlightNode(treeCopy, lca, 'lca');
    
    // Mark the selected nodes
    highlightNode(treeCopy, node1Id, 'selected');
    highlightNode(treeCopy, node2Id, 'selected');
    
    steps.push({
      tree: treeCopy,
      description: `Found the Lowest Common Ancestor: node ${lca}`,
      nodePath1: [...path1],
      nodePath2: [...path2],
      lca: lca,
      currentNodeId: lca
    });
    
    setSteps(steps);
  };
  
  // Helper to deep copy a tree
  const deepCopyTree = (node: TreeNode): TreeNode => {
    const copy: TreeNode = { ...node, children: [], parent: null };
    copy.children = node.children.map(child => {
      const childCopy = deepCopyTree(child);
      childCopy.parent = copy;
      return childCopy;
    });
    return copy;
  };
  
  // Find path from root to a specific node
  const findPathToNode = (
    node: TreeNode,
    targetId: number,
    path: number[] = []
  ): boolean => {
    path.push(node.id);
    
    if (node.id === targetId) {
      return true;
    }
    
    for (const child of node.children) {
      if (findPathToNode(child, targetId, path)) {
        return true;
      }
    }
    
    path.pop();
    return false;
  };
  
  // Highlight a specific node in the tree
  const highlightNode = (node: TreeNode, nodeId: number, state: NodeState): void => {
    if (node.id === nodeId) {
      node.state = state;
      return;
    }
    
    for (const child of node.children) {
      highlightNode(child, nodeId, state);
    }
  };
  
  // Highlight all nodes in a path
  const highlightNodesInPath = (node: TreeNode, path: number[], state: NodeState): void => {
    for (const nodeId of path) {
      if (node.id === nodeId) {
        node.state = state;
        return;
      }
      
      for (const child of node.children) {
        highlightNodesInPath(child, path, state);
      }
    }
  };
  
  // Calculate tree layout for visualization
  const calculateTreeLayout = (
    node: TreeNode,
    x: number = 400,
    y: number = 50,
    level: number = 0,
    index: number = 0,
    totalWidth: number = 800
  ): void => {
    node.x = x;
    node.y = y;
    
    if (node.children.length === 0) return;
    
    const nextY = y + 80;
    const childWidth = totalWidth / (2 ** level);
    
    for (let i = 0; i < node.children.length; i++) {
      const childX = x - totalWidth / 2 + childWidth * (i + 0.5);
      calculateTreeLayout(
        node.children[i],
        childX,
        nextY,
        level + 1,
        i,
        totalWidth
      );
    }
  };
  
  // Draw the tree on canvas
  const drawTree = () => {
    const canvas = canvasRef.current;
    if (!canvas || !tree) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate layout
    calculateTreeLayout(tree, canvas.width / 2, 50);
    
    // Draw edges
    drawEdges(ctx, tree);
    
    // Draw nodes
    drawNodes(ctx, tree);
  };
  
  // Draw edges between nodes
  const drawEdges = (ctx: CanvasRenderingContext2D, node: TreeNode): void => {
    for (const child of node.children) {
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(child.x, child.y);
      
      // Color edges based on whether they're part of path1 or path2
      const currentStepData = steps.length > 0 ? steps[currentStep] : null;
      
      if (currentStepData) {
        const path1 = currentStepData.nodePath1;
        const path2 = currentStepData.nodePath2;
        
        if (
          path1.includes(node.id) && 
          path1.includes(child.id) && 
          Math.abs(path1.indexOf(node.id) - path1.indexOf(child.id)) === 1
        ) {
          ctx.strokeStyle = '#4299e1'; // Path 1 color
        } else if (
          path2.includes(node.id) && 
          path2.includes(child.id) && 
          Math.abs(path2.indexOf(node.id) - path2.indexOf(child.id)) === 1
        ) {
          ctx.strokeStyle = '#48bb78'; // Path 2 color
        } else {
          ctx.strokeStyle = '#a0aec0'; // Default edge color
        }
      } else {
        ctx.strokeStyle = '#a0aec0'; // Default edge color
      }
      
      ctx.lineWidth = 2;
      ctx.stroke();
      
      drawEdges(ctx, child);
    }
  };
  
  // Draw nodes
  const drawNodes = (ctx: CanvasRenderingContext2D, node: TreeNode): void => {
    // Draw node
    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
    
    // Fill based on state
    switch (node.state) {
      case 'highlight':
        ctx.fillStyle = '#faf089'; // Yellow
        break;
      case 'selected':
        ctx.fillStyle = '#4299e1'; // Blue
        break;
      case 'path':
        ctx.fillStyle = '#90cdf4'; // Light blue
        break;
      case 'lca':
        ctx.fillStyle = '#f56565'; // Red
        break;
      default:
        ctx.fillStyle = '#e2e8f0'; // Default gray
    }
    
    ctx.fill();
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw node label
    ctx.font = '16px Arial';
    ctx.fillStyle = '#2d3748';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.value, node.x, node.y);
    
    // Draw children
    for (const child of node.children) {
      drawNodes(ctx, child);
    }
  };
  
  // Update tree visualization when tree or current step changes
  useEffect(() => {
    if (!tree) return;
    
    drawTree();
  }, [tree, currentStep, steps]);
  
  // Update canvas size on resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawTree();
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [tree]);
  
  // Control methods
  const startAnimation = () => {
    if (steps.length === 0) {
      findLCA();
    }
    setIsAnimating(true);
    setIsPaused(false);
  };
  
  const pauseAnimation = () => {
    setIsPaused(true);
  };
  
  const resetAnimation = () => {
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
  };
  
  const stepForward = () => {
    if (steps.length === 0) {
      findLCA();
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnimationSpeed(parseInt(e.target.value, 10));
  };
  
  // Get current description
  const currentDescription = steps.length > 0 && currentStep < steps.length
    ? steps[currentStep].description
    : 'Click "Start" to run the LCA algorithm to find the lowest common ancestor.';
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/problems">
          <FaArrowLeft /> Back to Problems
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Lowest Common Ancestor in a Tree</PageTitle>
        <Description>
          Given a tree and two nodes, find the lowest common ancestor (LCA),
          which is the deepest node that has both nodes as descendants.
          The LCA of a node and itself is the node itself.
        </Description>
      </PageHeader>
      
      <NodeSelectionContainer>
        <NodeSelectionGroup>
          <Label>Node 1:</Label>
          <Select 
            value={node1Id} 
            onChange={(e) => setNode1Id(parseInt(e.target.value, 10))}
            disabled={isAnimating}
          >
            {allNodes.map(node => (
              <option key={node.id} value={node.id}>
                Node {node.value}
              </option>
            ))}
          </Select>
        </NodeSelectionGroup>
        
        <NodeSelectionGroup>
          <Label>Node 2:</Label>
          <Select 
            value={node2Id} 
            onChange={(e) => setNode2Id(parseInt(e.target.value, 10))}
            disabled={isAnimating}
          >
            {allNodes.map(node => (
              <option key={node.id} value={node.id}>
                Node {node.value}
              </option>
            ))}
          </Select>
        </NodeSelectionGroup>
      </NodeSelectionContainer>
      
      <ControlsContainer>
        <Select value={animationSpeed} onChange={handleSpeedChange}>
          <option value="2000">Slow</option>
          <option value="1000">Medium</option>
          <option value="500">Fast</option>
        </Select>
        
        {!isAnimating || isPaused ? (
          <Button onClick={startAnimation}>
            <FaPlay /> {isPaused ? 'Resume' : 'Start'}
          </Button>
        ) : (
          <Button onClick={pauseAnimation}>
            <FaPause /> Pause
          </Button>
        )}
        
        <Button onClick={stepBackward} disabled={currentStep === 0 || (isAnimating && !isPaused)}>
          <FaStepBackward /> Back
        </Button>
        
        <Button onClick={stepForward} disabled={currentStep >= steps.length - 1 || (isAnimating && !isPaused)}>
          <FaStepForward /> Forward
        </Button>
        
        <Button onClick={resetAnimation} disabled={isAnimating && !isPaused}>
          <FaUndo /> Reset
        </Button>
      </ControlsContainer>
      
      <InfoPanel>
        <InfoTitle>Current Step</InfoTitle>
        <InfoText>{currentDescription}</InfoText>
        {steps.length > 0 && currentStep < steps.length && steps[currentStep].lca && (
          <InfoText>
            <strong>LCA: </strong>
            Node {steps[currentStep].lca}
          </InfoText>
        )}
      </InfoPanel>
      
      <TreeContainer>
        <canvas ref={canvasRef} width={800} height={500} style={{ width: '100%', height: '100%' }} />
      </TreeContainer>
      
      <Legend>
        <LegendItem>
          <LegendColor color="#e2e8f0" />
          Default Node
        </LegendItem>
        <LegendItem>
          <LegendColor color="#4299e1" />
          Selected Node
        </LegendItem>
        <LegendItem>
          <LegendColor color="#90cdf4" />
          Path Node
        </LegendItem>
        <LegendItem>
          <LegendColor color="#faf089" />
          Common Ancestor
        </LegendItem>
        <LegendItem>
          <LegendColor color="#f56565" />
          Lowest Common Ancestor
        </LegendItem>
      </Legend>
      
      <InfoPanel>
        <InfoTitle>How It Works</InfoTitle>
        <InfoText>
          1. The algorithm finds the path from the root to each of the two target nodes.
        </InfoText>
        <InfoText>
          2. These paths are stored as sequences of node IDs.
        </InfoText>
        <InfoText>
          3. The algorithm compares these paths from the beginning (root) until they diverge.
        </InfoText>
        <InfoText>
          4. The last common node in these paths is the Lowest Common Ancestor (LCA).
        </InfoText>
        <InfoText>
          5. This approach works because the LCA is the deepest node that is present in both paths.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Time & Space Complexity</InfoTitle>
        <InfoText>
          <strong>Time Complexity:</strong> O(n) where n is the number of nodes in the tree. In the worst case, we need to visit every node in the tree to find the paths.
        </InfoText>
        <InfoText>
          <strong>Space Complexity:</strong> O(h) where h is the height of the tree. This is required for the recursion stack and storing the paths.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications</InfoTitle>
        <InfoText>• Phylogenetic Trees: Finding common ancestors in evolutionary biology</InfoText>
        <InfoText>• File Systems: Finding common parent directories</InfoText>
        <InfoText>• Computational Geometry: Finding common ancestors in hierarchy trees</InfoText>
        <InfoText>• Social Networks: Finding common connections between users</InfoText>
        <InfoText>• Natural Language Processing: Finding relationships in parse trees</InfoText>
      </InfoPanel>
    </PageContainer>
  );
};

export default LowestCommonAncestorPage; 