import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward } from 'react-icons/fa';

// Types
type CellState = 'water' | 'land' | 'visiting' | 'visited' | 'completed';

interface Cell {
  row: number;
  col: number;
  state: CellState;
  islandId: number | null;
}

interface Step {
  grid: Cell[][];
  description: string;
  islandCount: number;
  currentIsland: number | null;
  currentCell: { row: number; col: number } | null;
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
  grid-template-columns: repeat(10, 40px);
  grid-template-rows: repeat(10, 40px);
  gap: 2px;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(10, 30px);
    grid-template-rows: repeat(10, 30px);
  }
`;

const Cell = styled.div<{ state: CellState; islandId: number | null }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 4px;
  background-color: ${props => {
    switch (props.state) {
      case 'water': return '#a0d2eb';
      case 'land': return '#8d8741';
      case 'visiting': return '#ff9800';
      case 'visited': return '#4caf50';
      case 'completed': return props.islandId !== null 
        ? `hsl(${(props.islandId * 60) % 360}, 80%, 60%)` 
        : '#a0d2eb';
      default: return '#a0d2eb';
    }
  }};
  color: ${props => 
    props.state === 'water' || props.state === 'completed' ? 'white' : 'black'
  };
  transition: all 0.3s ease;
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

const NumberOfIslandsPage: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  
  // Initialize grid
  useEffect(() => {
    generateRandomGrid();
  }, []);
  
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
    const rows = 10;
    const cols = 10;
    const newGrid: Cell[][] = [];
    
    for (let i = 0; i < rows; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < cols; j++) {
        // 30% chance of being land
        const isLand = Math.random() < 0.3;
        row.push({
          row: i,
          col: j,
          state: isLand ? 'land' : 'water',
          islandId: null
        });
      }
      newGrid.push(row);
    }
    
    setGrid(newGrid);
    setSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
    setIsPaused(false);
  };
  
  // Find number of islands
  const findIslands = () => {
    if (!grid.length) return;
    
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    const steps: Step[] = [];
    const rows = grid.length;
    const cols = grid[0].length;
    
    // Make a deep copy of the grid
    const gridCopy: Cell[][] = JSON.parse(JSON.stringify(grid));
    
    // Initial step
    steps.push({
      grid: JSON.parse(JSON.stringify(gridCopy)),
      description: 'Starting the island count algorithm. We will use DFS to explore connected land cells.',
      islandCount: 0,
      currentIsland: null,
      currentCell: null
    });
    
    // Helper function for DFS
    const exploreIsland = (row: number, col: number, islandId: number) => {
      // Check bounds
      if (row < 0 || row >= rows || col < 0 || col >= cols) return;
      
      // Check if water or already visited
      if (gridCopy[row][col].state !== 'land') return;
      
      // Mark as visiting
      gridCopy[row][col].state = 'visiting';
      gridCopy[row][col].islandId = islandId;
      
      // Add step - visiting a cell
      steps.push({
        grid: JSON.parse(JSON.stringify(gridCopy)),
        description: `Exploring land at (${row}, ${col}) as part of island #${islandId}.`,
        islandCount: islandId,
        currentIsland: islandId,
        currentCell: { row, col }
      });
      
      // Mark as visited
      gridCopy[row][col].state = 'visited';
      
      // Add step - marking as visited
      steps.push({
        grid: JSON.parse(JSON.stringify(gridCopy)),
        description: `Marked land at (${row}, ${col}) as visited.`,
        islandCount: islandId,
        currentIsland: islandId,
        currentCell: { row, col }
      });
      
      // Explore neighbors (4-directional)
      exploreIsland(row + 1, col, islandId); // Down
      exploreIsland(row - 1, col, islandId); // Up
      exploreIsland(row, col + 1, islandId); // Right
      exploreIsland(row, col - 1, islandId); // Left
      
      // Mark as completed
      gridCopy[row][col].state = 'completed';
    };
    
    // Find all islands
    let islandCount = 0;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (gridCopy[i][j].state === 'land') {
          islandCount++;
          
          // Add step - found a new island
          steps.push({
            grid: JSON.parse(JSON.stringify(gridCopy)),
            description: `Found new island starting at (${i}, ${j}). This will be island #${islandCount}.`,
            islandCount: islandCount,
            currentIsland: islandCount,
            currentCell: { row: i, col: j }
          });
          
          // Explore the island
          exploreIsland(i, j, islandCount);
        }
      }
    }
    
    // Final step
    steps.push({
      grid: JSON.parse(JSON.stringify(gridCopy)),
      description: `Algorithm complete. Found ${islandCount} islands.`,
      islandCount: islandCount,
      currentIsland: null,
      currentCell: null
    });
    
    setSteps(steps);
  };
  
  // Control methods
  const startAnimation = () => {
    if (steps.length === 0) {
      findIslands();
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
      findIslands();
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
  
  // Get current grid to display
  const currentGrid = steps.length > 0 && currentStep < steps.length
    ? steps[currentStep].grid
    : grid;
  
  // Get current description
  const currentDescription = steps.length > 0 && currentStep < steps.length
    ? steps[currentStep].description
    : 'The Number of Islands problem involves counting connected components in a grid.';
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/problems">
          <FaArrowLeft /> Back to Problems
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Number of Islands</PageTitle>
        <Description>
          Given a 2D grid map of '1's (land) and '0's (water), count the number of islands.
          An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.
        </Description>
      </PageHeader>
      
      <ControlsContainer>
        <Button onClick={generateRandomGrid}>
          Generate New Grid
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
        {steps.length > 0 && currentStep < steps.length && (
          <InfoText>
            <strong>Islands found so far: </strong>
            {steps[currentStep].islandCount}
          </InfoText>
        )}
      </InfoPanel>
      
      <GridContainer>
        <Grid>
          {currentGrid.map((row, i) => 
            row.map((cell, j) => (
              <Cell 
                key={`${i}-${j}`} 
                state={cell.state}
                islandId={cell.islandId}
              >
                {cell.islandId !== null ? cell.islandId : ''}
              </Cell>
            ))
          )}
        </Grid>
      </GridContainer>
      
      <InfoPanel>
        <InfoTitle>How It Works</InfoTitle>
        <InfoText>
          1. We start with a grid where each cell is either land or water.
        </InfoText>
        <InfoText>
          2. To count islands, we scan the grid and when we find an unvisited land cell, we increment our island count.
        </InfoText>
        <InfoText>
          3. For each land cell, we use Depth-First Search (DFS) to explore all connected land cells, marking them as visited.
        </InfoText>
        <InfoText>
          4. After all cells have been explored, the island count represents the number of distinct islands in the grid.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Time & Space Complexity</InfoTitle>
        <InfoText>
          <strong>Time Complexity:</strong> O(R × C) where R is the number of rows and C is the number of columns. We visit each cell once.
        </InfoText>
        <InfoText>
          <strong>Space Complexity:</strong> O(R × C) for the visited array and recursion stack in the worst case.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications</InfoTitle>
        <InfoText>• Image Processing: Connected component labeling to identify distinct objects</InfoText>
        <InfoText>• Game Development: Determining walkable areas or territory boundaries</InfoText>
        <InfoText>• Computer Vision: Object detection and counting</InfoText>
        <InfoText>• Geographic Information Systems: Identifying land masses or regions</InfoText>
        <InfoText>• Network Analysis: Finding isolated network components</InfoText>
      </InfoPanel>
    </PageContainer>
  );
};

export default NumberOfIslandsPage; 