import React, { useState, useEffect, useCallback, memo, lazy, Suspense } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaCode } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomGridInput from '../../../components/graph/CustomGridInput';

// Lazy load the SyntaxHighlighter to improve initial load time
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'));
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Styled components
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

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textLight};
  max-width: 800px;
  line-height: 1.6;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 800px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.5rem;
  }
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

  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.8rem;
    
    svg {
      margin-right: 0.25rem;
    }
  }
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  overflow: auto;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.card};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 50px);
  grid-template-rows: repeat(10, 50px);
  gap: 1px;
  padding: 1px;
  background-color: ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(10, 40px);
    grid-template-rows: repeat(10, 40px);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(10, 30px);
    grid-template-rows: repeat(10, 30px);
  }
`;

const cellColorMap = {
  empty: 'transparent',
  wall: '#333',
  start: '#4CAF50',
  end: '#FF5722',
  visited: '#64B5F6',
  path: '#FFC107',
  current: '#E91E63',
  open: '#81C784',
  closed: '#E57373'
};

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
`;

const Cell = styled.div<{
  cellType: keyof typeof cellColorMap;
  isAnimating?: boolean;
}>`
  width: 100%;
  height: 100%;
  background-color: ${props => cellColorMap[props.cellType]};
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  
  ${props => props.isAnimating && css`
    animation: ${pulseAnimation} 1s infinite;
  `}
`;

const InfoPanel = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors.card};
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
  max-width: 800px;
`;

const InfoTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
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
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const LegendColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 2px;
  background-color: ${props => props.color};
  margin-right: 0.5rem;
`;

const CodeContainer = styled.div`
  margin-top: 2rem;
  max-width: 800px;
  border-radius: 0.5rem;
  overflow: hidden;
`;

// Cell type for the grid
type CellType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path' | 'current' | 'open' | 'closed';

// Node structure for A* algorithm
interface Node {
  x: number;
  y: number;
  g: number; // cost from start to current node
  h: number; // heuristic (estimated cost from current to end)
  f: number; // total cost (g + h)
  parent: Node | null;
  cellType: CellType;
}

// Position interface
interface Position {
  x: number;
  y: number;
}

const MemoizedCell = memo(({ cellType, isAnimating, onClick }: { 
  cellType: CellType; 
  isAnimating?: boolean; 
  onClick: () => void 
}) => (
  <Cell cellType={cellType} isAnimating={isAnimating} onClick={onClick} />
));

const AStarPage: React.FC = () => {
  const gridSize = 10;
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [startPos, setStartPos] = useState<Position>({ x: 1, y: 1 });
  const [endPos, setEndPos] = useState<Position>({ x: 8, y: 8 });
  const [currentTool, setCurrentTool] = useState<'wall' | 'start' | 'end'>('wall');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500); // ms
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<any[]>([]);
  const [stepInfo, setStepInfo] = useState<string>('');
  const [showCustomGrid, setShowCustomGrid] = useState(false);
  
  // Initialize grid
  useEffect(() => {
    const initialGrid: CellType[][] = [];
    for (let y = 0; y < gridSize; y++) {
      const row: CellType[] = [];
      for (let x = 0; x < gridSize; x++) {
        if (x === startPos.x && y === startPos.y) {
          row.push('start');
        } else if (x === endPos.x && y === endPos.y) {
          row.push('end');
        } else {
          row.push('empty');
        }
      }
      initialGrid.push(row);
    }
    setGrid(initialGrid);
  }, []);

  // Helper to calculate the Manhattan distance heuristic
  const calculateHeuristic = (pos1: Position, pos2: Position): number => {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  };

  // Function to reset the visualization
  const resetVisualization = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setStepInfo('');
    
    // Reset grid but keep walls
    const newGrid = grid.map((row, y) => 
      row.map((cell, x) => {
        if (x === startPos.x && y === startPos.y) return 'start';
        if (x === endPos.x && y === endPos.y) return 'end';
        if (cell === 'wall') return 'wall';
        return 'empty';
      })
    );
    
    setGrid(newGrid);
  };

  // Handle cell click
  const handleCellClick = (x: number, y: number) => {
    if (isAnimating) return;
    
    const currentCell = grid[y][x];
    
    // Don't allow changing start/end positions during animation
    if ((currentCell === 'start' || currentCell === 'end') && currentTool !== 'start' && currentTool !== 'end') {
      return;
    }
    
    const newGrid = [...grid];
    
    // If we're setting a new start/end position
    if (currentTool === 'start') {
      // Clear old start position
      newGrid[startPos.y][startPos.x] = 'empty';
      // Set new start position
      newGrid[y][x] = 'start';
      setStartPos({ x, y });
    } else if (currentTool === 'end') {
      // Clear old end position
      newGrid[endPos.y][endPos.x] = 'empty';
      // Set new end position
      newGrid[y][x] = 'end';
      setEndPos({ x, y });
    } else {
      // Toggle wall
      if (currentCell === 'empty') {
        newGrid[y][x] = 'wall';
      } else if (currentCell === 'wall') {
        newGrid[y][x] = 'empty';
      }
    }
    
    setGrid(newGrid);
  };

  // A* Search algorithm
  const aStarSearch = () => {
    // Reset previous visualization
    resetVisualization();
    
    const steps: any[] = [];
    const gridCopy = [...grid];
    
    // Create initial node
    const startNode: Node = {
      x: startPos.x,
      y: startPos.y,
      g: 0,
      h: calculateHeuristic(startPos, endPos),
      f: calculateHeuristic(startPos, endPos),
      parent: null,
      cellType: 'start'
    };
    
    const openSet: Node[] = [startNode];
    const closedSet: Node[] = [];
    
    // Directions: up, right, down, left
    const directions = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 }
    ];
    
    let found = false;
    let currentNode: Node | undefined;
    
    while (openSet.length > 0 && !found) {
      // Find node with lowest f value
      openSet.sort((a, b) => a.f - b.f);
      currentNode = openSet.shift();
      
      if (!currentNode) break;
      
      // Add current node to closed set
      closedSet.push(currentNode);
      
      // Record step - update grid to show current state
      const stepGrid = gridCopy.map(row => [...row]);
      
      // Mark closed nodes
      closedSet.forEach(node => {
        if (stepGrid[node.y][node.x] !== 'start' && stepGrid[node.y][node.x] !== 'end') {
          stepGrid[node.y][node.x] = 'closed';
        }
      });
      
      // Mark open nodes
      openSet.forEach(node => {
        if (stepGrid[node.y][node.x] !== 'start' && stepGrid[node.y][node.x] !== 'end') {
          stepGrid[node.y][node.x] = 'open';
        }
      });
      
      // Mark current node
      if (stepGrid[currentNode.y][currentNode.x] !== 'start' && stepGrid[currentNode.y][currentNode.x] !== 'end') {
        stepGrid[currentNode.y][currentNode.x] = 'current';
      }
      
      steps.push({
        grid: stepGrid,
        info: `Examining node at (${currentNode.x}, ${currentNode.y}) with f=${currentNode.f}, g=${currentNode.g}, h=${currentNode.h}`
      });
      
      // Check if we've reached the end
      if (currentNode.x === endPos.x && currentNode.y === endPos.y) {
        found = true;
        break;
      }
      
      // Explore neighbors
      for (const dir of directions) {
        const newX = currentNode.x + dir.x;
        const newY = currentNode.y + dir.y;
        
        // Check if position is valid
        if (
          newX < 0 || newX >= gridSize || 
          newY < 0 || newY >= gridSize || 
          grid[newY][newX] === 'wall' ||
          closedSet.some(node => node.x === newX && node.y === newY)
        ) {
          continue;
        }
        
        // Calculate g, h, and f values
        const g = currentNode.g + 1;
        const h = calculateHeuristic({ x: newX, y: newY }, endPos);
        const f = g + h;
        
        // Check if node is already in open set with a better path
        const existingOpenNode = openSet.find(node => node.x === newX && node.y === newY);
        if (existingOpenNode && existingOpenNode.g <= g) {
          continue;
        }
        
        // Create new node
        const newNode: Node = {
          x: newX,
          y: newY,
          g,
          h,
          f,
          parent: currentNode,
          cellType: 'open'
        };
        
        // Add to open set if not already there
        if (!existingOpenNode) {
          openSet.push(newNode);
        } else {
          // Update existing node with better path
          existingOpenNode.g = g;
          existingOpenNode.f = f;
          existingOpenNode.parent = currentNode;
        }
      }
    }
    
    // If path found, trace it
    if (found && currentNode) {
      const path: Node[] = [];
      let current: Node | null = currentNode;
      
      while (current) {
        path.unshift(current);
        current = current.parent;
      }
      
      // Add steps to show path
      const pathGrid = steps[steps.length - 1].grid.map((row: CellType[]) => [...row]);
      
      path.forEach((node, index) => {
        if (pathGrid[node.y][node.x] !== 'start' && pathGrid[node.y][node.x] !== 'end') {
          pathGrid[node.y][node.x] = 'path';
        }
        
        steps.push({
          grid: pathGrid.map((row: CellType[]) => [...row]),
          info: `Building path: Step ${index + 1} of ${path.length}`
        });
      });
      
      steps.push({
        grid: pathGrid,
        info: `Path found! Total length: ${path.length - 1} steps.`
      });
    } else {
      steps.push({
        grid: steps[steps.length - 1].grid,
        info: 'No path found to destination!'
      });
    }
    
    setAnimationSteps(steps);
    return steps;
  };

  // Start animation
  const startAnimation = useCallback(() => {
    const steps = aStarSearch();
    setAnimationSteps(steps);
    setIsAnimating(true);
    setCurrentStep(0);
  }, [grid, startPos, endPos]);

  // Step through animation
  const stepForward = useCallback(() => {
    if (currentStep < animationSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setGrid(animationSteps[nextStep].grid);
      setStepInfo(animationSteps[nextStep].info);
    }
  }, [currentStep, animationSteps]);

  // Animation effect
  useEffect(() => {
    let animationTimer: NodeJS.Timeout;
    
    if (isAnimating && currentStep < animationSteps.length - 1) {
      animationTimer = setTimeout(() => {
        stepForward();
      }, animationSpeed);
    } else if (currentStep >= animationSteps.length - 1) {
      setIsAnimating(false);
    }
    
    return () => {
      if (animationTimer) {
        clearTimeout(animationTimer);
      }
    };
  }, [isAnimating, currentStep, animationSteps, animationSpeed, stepForward]);

  // Apply custom grid
  const handleApplyCustomGrid = (newGrid: CellType[][], newStartPos: Position, newEndPos: Position) => {
    if (isAnimating) {
      setIsAnimating(false);
      if (animationSteps.length > 0) {
        setCurrentStep(0);
        setStepInfo('');
      }
    }
    
    setGrid(newGrid);
    setStartPos(newStartPos);
    setEndPos(newEndPos);
    setShowCustomGrid(false);
  };

  // A* algorithm code
  const aStarCode = `function astar(grid, start, end) {
  // Helper to calculate Manhattan distance
  const heuristic = (pos1, pos2) => {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  };

  // Create start node
  const startNode = {
    x: start.x,
    y: start.y,
    g: 0,
    h: heuristic(start, end),
    f: heuristic(start, end),
    parent: null
  };

  const openSet = [startNode];
  const closedSet = [];
  const directions = [
    { x: 0, y: -1 }, // up
    { x: 1, y: 0 },  // right
    { x: 0, y: 1 },  // down
    { x: -1, y: 0 }  // left
  ];

  while (openSet.length > 0) {
    // Find node with lowest f value
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    
    // Add to closed set
    closedSet.push(current);
    
    // Check if reached end
    if (current.x === end.x && current.y === end.y) {
      // Reconstruct path
      const path = [];
      let temp = current;
      while (temp) {
        path.unshift(temp);
        temp = temp.parent;
      }
      return path;
    }
    
    // Check neighbors
    for (const dir of directions) {
      const newX = current.x + dir.x;
      const newY = current.y + dir.y;
      
      // Skip invalid positions
      if (
        newX < 0 || newX >= grid[0].length ||
        newY < 0 || newY >= grid.length ||
        grid[newY][newX] === 'wall' ||
        closedSet.some(node => node.x === newX && node.y === newY)
      ) {
        continue;
      }
      
      // Calculate costs
      const g = current.g + 1;
      const h = heuristic({x: newX, y: newY}, end);
      const f = g + h;
      
      // Check if already in open set with better path
      const openNode = openSet.find(node => node.x === newX && node.y === newY);
      if (openNode && openNode.g <= g) {
        continue;
      }
      
      // Add to open set
      if (!openNode) {
        openSet.push({
          x: newX,
          y: newY,
          g,
          h,
          f,
          parent: current
        });
      } else {
        // Update existing node
        openNode.g = g;
        openNode.f = f;
        openNode.parent = current;
      }
    }
  }
  
  // No path found
  return null;
}`;

  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/graph">
          <FaArrowLeft /> Back to Graph Algorithms
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>A* Search Algorithm</PageTitle>
        <Description>
          A* (pronounced "A star") is a popular pathfinding algorithm that combines the benefits of Dijkstra's algorithm and greedy best-first search.
          It uses a heuristic to guide its search, making it more efficient than Dijkstra's algorithm while guaranteeing an optimal path.
        </Description>
      </PageHeader>
      
      <InfoPanel>
        <InfoTitle>How to use this visualization:</InfoTitle>
        <InfoText>1. Click on the grid to add/remove walls</InfoText>
        <InfoText>2. Use the controls to start, pause, or reset the visualization</InfoText>
        <InfoText>3. You can also click the button below to place the start or end position</InfoText>
        <InfoText>4. You can provide a custom grid using the "Custom Grid" button</InfoText>
        
        <Legend>
          <LegendItem>
            <LegendColor color={cellColorMap.start} /> Start
          </LegendItem>
          <LegendItem>
            <LegendColor color={cellColorMap.end} /> End
          </LegendItem>
          <LegendItem>
            <LegendColor color={cellColorMap.wall} /> Wall
          </LegendItem>
          <LegendItem>
            <LegendColor color={cellColorMap.open} /> Open Set
          </LegendItem>
          <LegendItem>
            <LegendColor color={cellColorMap.closed} /> Closed Set
          </LegendItem>
          <LegendItem>
            <LegendColor color={cellColorMap.current} /> Current Node
          </LegendItem>
          <LegendItem>
            <LegendColor color={cellColorMap.path} /> Path
          </LegendItem>
        </Legend>
      </InfoPanel>
      
      <ControlsContainer>
        <Button onClick={() => setCurrentTool('wall')}>
          {currentTool === 'wall' ? '✓ Place Wall' : 'Place Wall'}
        </Button>
        <Button onClick={() => setCurrentTool('start')}>
          {currentTool === 'start' ? '✓ Set Start' : 'Set Start'}
        </Button>
        <Button onClick={() => setCurrentTool('end')}>
          {currentTool === 'end' ? '✓ Set End' : 'Set End'}
        </Button>
        <Button onClick={() => setShowCustomGrid(!showCustomGrid)}>
          {showCustomGrid ? 'Hide Custom Grid' : 'Custom Grid'}
        </Button>
        <Button onClick={startAnimation} disabled={isAnimating}>
          <FaPlay /> Start
        </Button>
        <Button onClick={() => setIsAnimating(false)} disabled={!isAnimating}>
          <FaPause /> Pause
        </Button>
        <Button onClick={resetVisualization}>
          <FaUndo /> Reset
        </Button>
        <Button onClick={stepForward} disabled={isAnimating || currentStep >= animationSteps.length - 1}>
          <FaStepForward /> Step
        </Button>
      </ControlsContainer>
      
      {showCustomGrid && (
        <InfoPanel>
          <InfoTitle>Custom Grid Input</InfoTitle>
          <CustomGridInput onApply={handleApplyCustomGrid} gridSize={gridSize} />
        </InfoPanel>
      )}
      
      {stepInfo && (
        <InfoPanel>
          <InfoTitle>Current Step:</InfoTitle>
          <InfoText>{stepInfo}</InfoText>
        </InfoPanel>
      )}
      
      <GridContainer>
        <Grid>
          {grid.map((row, y) =>
            row.map((cellType, x) => (
              <MemoizedCell
                key={`${x}-${y}`}
                cellType={cellType}
                isAnimating={cellType === 'current'}
                onClick={() => handleCellClick(x, y)}
              />
            ))
          )}
        </Grid>
      </GridContainer>
      
      <InfoPanel>
        <InfoTitle>Implementation Code:</InfoTitle>
        <CodeContainer>
          <Suspense fallback={<div>Loading code...</div>}>
            <SyntaxHighlighter language="javascript" style={vs2015}>
              {aStarCode}
            </SyntaxHighlighter>
          </Suspense>
        </CodeContainer>
      </InfoPanel>
    </PageContainer>
  );
};

export default AStarPage; 