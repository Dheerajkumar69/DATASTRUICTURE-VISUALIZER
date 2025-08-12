import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward } from 'react-icons/fa';

// Types
type CellType = 'empty' | 'obstacle' | 'start' | 'end';
type CellState = 'default' | 'queued' | 'visiting' | 'visited' | 'path';

interface Cell {
  row: number;
  col: number;
  type: CellType;
  state: CellState;
  distance: number;
  parent: { row: number; col: number } | null;
}

interface Step {
  grid: Cell[][];
  description: string;
  queue: { row: number; col: number }[];
  currentCell: { row: number; col: number } | null;
  pathFound: boolean;
  shortestPath: { row: number; col: number }[];
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

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(15, 35px);
  grid-template-rows: repeat(15, 35px);
  gap: 2px;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(15, 25px);
    grid-template-rows: repeat(15, 25px);
  }
`;

const CellElement = styled.div<{ 
  cellType: CellType; 
  cellState: CellState;
  distance: number;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 4px;
  background-color: ${props => {
    if (props.cellType === 'obstacle') return '#2d3748';
    if (props.cellType === 'start') return '#4299e1';
    if (props.cellType === 'end') return '#48bb78';
    
    switch (props.cellState) {
      case 'queued': return '#9ae6b4';
      case 'visiting': return '#faf089';
      case 'visited': return '#90cdf4';
      case 'path': return '#f6ad55';
      default: return '#edf2f7';
    }
  }};
  color: ${props => {
    if (props.cellType === 'obstacle') return 'white';
    if (props.cellState === 'path') return 'black';
    if (props.cellType === 'start' || props.cellType === 'end') return 'white';
    return props.distance < Infinity ? '#2d3748' : '#a0aec0';
  }};
  font-size: 0.75rem;
  transition: all 0.3s ease;
  
  &:after {
    content: ${props => props.distance < Infinity && props.cellType !== 'start' && props.cellType !== 'end' && props.cellType !== 'obstacle' 
      ? `'${props.distance}'` 
      : "''"};
  }
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
  border-radius: 4px;
  background-color: ${props => props.color};
  margin-right: 0.5rem;
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

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
`;

const ShortestPathGridPage: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  const [obstaclePercentage, setObstaclePercentage] = useState<number>(20);
  
  // Initialize grid
  useEffect(() => {
    generateRandomGrid();
  }, [obstaclePercentage]);
  
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
  
  // Generate a random grid
  const generateRandomGrid = () => {
    const rows = 15;
    const cols = 15;
    const newGrid: Cell[][] = [];
    
    // Initialize with empty cells
    for (let i = 0; i < rows; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < cols; j++) {
        row.push({
          row: i,
          col: j,
          type: 'empty',
          state: 'default',
          distance: Infinity,
          parent: null
        });
      }
      newGrid.push(row);
    }
    
    // Add obstacles (random)
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (Math.random() * 100 < obstaclePercentage) {
          newGrid[i][j].type = 'obstacle';
        }
      }
    }
    
    // Set start position (top-left corner)
    newGrid[0][0].type = 'start';
    newGrid[0][0].distance = 0;
    
    // Set end position (bottom-right corner)
    newGrid[rows - 1][cols - 1].type = 'end';
    
    setGrid(newGrid);
    setSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
    setIsPaused(false);
  };
  
  // Find shortest path using BFS
  const findShortestPath = () => {
    if (!grid.length) return;
    
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    const steps: Step[] = [];
    const rows = grid.length;
    const cols = grid[0].length;
    
    // Make a deep copy of the grid
    const gridCopy: Cell[][] = JSON.parse(JSON.stringify(grid));
    
    // Find start and end positions
    let startPos = { row: 0, col: 0 };
    let endPos = { row: rows - 1, col: cols - 1 };
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (gridCopy[i][j].type === 'start') {
          startPos = { row: i, col: j };
          gridCopy[i][j].distance = 0;
        } else if (gridCopy[i][j].type === 'end') {
          endPos = { row: i, col: j };
        }
      }
    }
    
    // Initial step
    steps.push({
      grid: JSON.parse(JSON.stringify(gridCopy)),
      description: 'Starting BFS algorithm to find the shortest path. The numbers in each cell represent the distance from the start.',
      queue: [startPos],
      currentCell: null,
      pathFound: false,
      shortestPath: []
    });
    
    // BFS queue
    const queue: { row: number; col: number }[] = [startPos];
    let pathFound = false;
    
    // Directions (4-directional: up, right, down, left)
    const directions = [
      { dr: -1, dc: 0 },  // Up
      { dr: 0, dc: 1 },   // Right
      { dr: 1, dc: 0 },   // Down
      { dr: 0, dc: -1 }   // Left
    ];
    
    while (queue.length > 0 && !pathFound) {
      const current = queue.shift()!;
      
      // Skip if cell is an obstacle
      if (gridCopy[current.row][current.col].type === 'obstacle') continue;
      
      // If we've already visited this cell, skip it
      if (gridCopy[current.row][current.col].state === 'visited') continue;
      
      // Mark current cell as visiting
      gridCopy[current.row][current.col].state = 'visiting';
      
      // Add step - visiting current cell
      steps.push({
        grid: JSON.parse(JSON.stringify(gridCopy)),
        description: `Visiting cell at (${current.row}, ${current.col}) with distance ${gridCopy[current.row][current.col].distance}.`,
        queue: [...queue],
        currentCell: current,
        pathFound: false,
        shortestPath: []
      });
      
      // If we've reached the end, we're done
      if (current.row === endPos.row && current.col === endPos.col) {
        pathFound = true;
        
        // Reconstruct the path
        const path: { row: number; col: number }[] = [];
        let currentCell = gridCopy[endPos.row][endPos.col];
        
        while (currentCell.parent) {
          path.unshift({ row: currentCell.row, col: currentCell.col });
          const parentPos = currentCell.parent;
          currentCell = gridCopy[parentPos.row][parentPos.col];
        }
        path.unshift({ row: startPos.row, col: startPos.col });
        
        // Mark the path
        for (const pos of path) {
          if (gridCopy[pos.row][pos.col].type !== 'start' && gridCopy[pos.row][pos.col].type !== 'end') {
            gridCopy[pos.row][pos.col].state = 'path';
          }
        }
        
        // Add final step
        steps.push({
          grid: JSON.parse(JSON.stringify(gridCopy)),
          description: `Path found! The shortest path from start to end has length ${gridCopy[endPos.row][endPos.col].distance}.`,
          queue: [],
          currentCell: null,
          pathFound: true,
          shortestPath: path
        });
        
        break;
      }
      
      // Mark current cell as visited
      gridCopy[current.row][current.col].state = 'visited';
      
      // Check all four directions
      for (const { dr, dc } of directions) {
        const newRow = current.row + dr;
        const newCol = current.col + dc;
        
        // Check bounds
        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) continue;
        
        // Skip obstacles and already visited cells
        if (gridCopy[newRow][newCol].type === 'obstacle' || gridCopy[newRow][newCol].state === 'visited' || gridCopy[newRow][newCol].state === 'queued') continue;
        
        // Update distance and parent
        gridCopy[newRow][newCol].distance = gridCopy[current.row][current.col].distance + 1;
        gridCopy[newRow][newCol].parent = { row: current.row, col: current.col };
        
        // Mark as queued
        gridCopy[newRow][newCol].state = 'queued';
        
        // Add to queue
        queue.push({ row: newRow, col: newCol });
      }
      
      // Add step after exploring all neighbors
      if (!pathFound) {
        steps.push({
          grid: JSON.parse(JSON.stringify(gridCopy)),
          description: `Finished exploring cell at (${current.row}, ${current.col}). Added unvisited neighbors to the queue.`,
          queue: [...queue],
          currentCell: null,
          pathFound: false,
          shortestPath: []
        });
      }
    }
    
    // If no path found
    if (!pathFound) {
      steps.push({
        grid: JSON.parse(JSON.stringify(gridCopy)),
        description: 'No path found from start to end. The end position is not reachable.',
        queue: [],
        currentCell: null,
        pathFound: false,
        shortestPath: []
      });
    }
    
    setSteps(steps);
  };
  
  // Control methods
  const startAnimation = () => {
    if (steps.length === 0) {
      findShortestPath();
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
      findShortestPath();
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
  
  const handleObstaclePercentageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setObstaclePercentage(parseInt(e.target.value, 10));
  };
  
  // Get current grid to display
  const currentGrid = steps.length > 0 && currentStep < steps.length
    ? steps[currentStep].grid
    : grid;
  
  // Get current description
  const currentDescription = steps.length > 0 && currentStep < steps.length
    ? steps[currentStep].description
    : 'Click "Start" to run the BFS algorithm to find the shortest path from start to end.';
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/problems">
          <FaArrowLeft /> Back to Problems
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Shortest Path in a Grid with Obstacles</PageTitle>
        <Description>
          Given a 2D grid with obstacles, find the shortest path from the top-left corner to the bottom-right corner.
          You can only move up, down, left, or right (4-directional movement), and cannot move through obstacles.
        </Description>
      </PageHeader>
      
      <ControlsContainer>
        <Select 
          value={obstaclePercentage} 
          onChange={handleObstaclePercentageChange}
        >
          <option value="10">10% Obstacles</option>
          <option value="20">20% Obstacles</option>
          <option value="30">30% Obstacles</option>
          <option value="40">40% Obstacles</option>
        </Select>
        
        <Button onClick={generateRandomGrid}>
          New Grid
        </Button>
        
        <Select value={animationSpeed} onChange={handleSpeedChange}>
          <option value="1000">Slow</option>
          <option value="500">Medium</option>
          <option value="200">Fast</option>
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
        {steps.length > 0 && currentStep < steps.length && steps[currentStep].queue.length > 0 && (
          <InfoText>
            <strong>Queue size: </strong>
            {steps[currentStep].queue.length} cells
          </InfoText>
        )}
      </InfoPanel>
      
      <GridContainer>
        <Grid>
          {currentGrid.map((row, i) => 
            row.map((cell, j) => (
              <CellElement 
                key={`${i}-${j}`} 
                cellType={cell.type}
                cellState={cell.state}
                distance={cell.distance}
              />
            ))
          )}
        </Grid>
        
        <Legend>
          <LegendItem>
            <LegendColor color="#4299e1" />
            Start
          </LegendItem>
          <LegendItem>
            <LegendColor color="#48bb78" />
            End
          </LegendItem>
          <LegendItem>
            <LegendColor color="#2d3748" />
            Obstacle
          </LegendItem>
          <LegendItem>
            <LegendColor color="#9ae6b4" />
            Queued
          </LegendItem>
          <LegendItem>
            <LegendColor color="#faf089" />
            Visiting
          </LegendItem>
          <LegendItem>
            <LegendColor color="#90cdf4" />
            Visited
          </LegendItem>
          <LegendItem>
            <LegendColor color="#f6ad55" />
            Path
          </LegendItem>
        </Legend>
      </GridContainer>
      
      <InfoPanel>
        <InfoTitle>How It Works</InfoTitle>
        <InfoText>
          1. The algorithm uses <strong>Breadth-First Search (BFS)</strong> to find the shortest path in an unweighted grid.
        </InfoText>
        <InfoText>
          2. Starting from the start cell, we explore cells in layers - first visiting all cells at distance 1, then distance 2, etc.
        </InfoText>
        <InfoText>
          3. For each cell, we explore its 4 adjacent neighbors (up, right, down, left) and add unvisited non-obstacle cells to a queue.
        </InfoText>
        <InfoText>
          4. The number in each cell represents the shortest distance from the start.
        </InfoText>
        <InfoText>
          5. When we reach the end cell, we trace back through parent pointers to find the shortest path.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Time & Space Complexity</InfoTitle>
        <InfoText>
          <strong>Time Complexity:</strong> O(R × C) where R is the number of rows and C is the number of columns. In the worst case, we visit every cell in the grid.
        </InfoText>
        <InfoText>
          <strong>Space Complexity:</strong> O(R × C) for the queue, the grid representation, and the parent pointers.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications</InfoTitle>
        <InfoText>• Robotics: Path planning for robots in environments with obstacles</InfoText>
        <InfoText>• Video Games: Finding paths for characters through game maps</InfoText>
        <InfoText>• Networks: Routing in networks with blocked or congested nodes</InfoText>
        <InfoText>• Maze Solving: Finding the shortest solution to a maze</InfoText>
        <InfoText>• Logistics: Planning delivery routes avoiding restricted areas</InfoText>
      </InfoPanel>
    </PageContainer>
  );
};

export default ShortestPathGridPage; 