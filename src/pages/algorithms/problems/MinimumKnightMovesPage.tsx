import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward } from 'react-icons/fa';

// Types
type CellState = 'default' | 'start' | 'end' | 'queued' | 'visiting' | 'visited' | 'path';

interface Cell {
  row: number;
  col: number;
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

const Chessboard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 60px);
  grid-template-rows: repeat(8, 60px);
  border: 2px solid #2d3748;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(8, 40px);
    grid-template-rows: repeat(8, 40px);
  }
`;

const ChessCell = styled.div<{ 
  isBlack: boolean; 
  cellState: CellState;
  distance: number;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: relative;
  background-color: ${props => {
    // Keep the black/white checkered pattern
    const baseColor = props.isBlack ? '#b58863' : '#f0d9b5';
    
    // Overlay the state colors
    switch (props.cellState) {
      case 'start': return '#4299e1';
      case 'end': return '#48bb78';
      case 'queued': return props.isBlack ? '#89c3a3' : '#9ae6b4';
      case 'visiting': return props.isBlack ? '#e9c979' : '#faf089';
      case 'visited': return props.isBlack ? '#80bde4' : '#90cdf4';
      case 'path': return props.isBlack ? '#e6a045' : '#f6ad55';
      default: return baseColor;
    }
  }};
  color: ${props => {
    return props.cellState === 'default' ? 
      (props.isBlack ? '#f0d9b5' : '#b58863') : 
      '#2d3748';
  }};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:before {
    content: ${props => props.distance < Infinity && props.cellState !== 'start' && props.cellState !== 'end' 
      ? `'${props.distance}'` 
      : "''"};
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 0.75rem;
  }
`;

const KnightIcon = styled.div`
  font-size: 1.5rem;
  color: #2d3748;
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

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.25rem;
  width: 3rem;
  text-align: center;
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
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
`;

const MinimumKnightMovesPage: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  const [startPosition, setStartPosition] = useState({ row: 0, col: 0 });
  const [endPosition, setEndPosition] = useState({ row: 7, col: 7 });
  
  // Initialize grid
  useEffect(() => {
    initializeGrid();
  }, [startPosition, endPosition]);
  
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
  
  // Initialize the chessboard
  const initializeGrid = () => {
    const rows = 8;
    const cols = 8;
    const newGrid: Cell[][] = [];
    
    // Initialize cells
    for (let i = 0; i < rows; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < cols; j++) {
        row.push({
          row: i,
          col: j,
          state: 'default',
          distance: Infinity,
          parent: null
        });
      }
      newGrid.push(row);
    }
    
    // Set start and end positions
    newGrid[startPosition.row][startPosition.col].state = 'start';
    newGrid[startPosition.row][startPosition.col].distance = 0;
    newGrid[endPosition.row][endPosition.col].state = 'end';
    
    setGrid(newGrid);
    setSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
    setIsPaused(false);
  };
  
  // Check if position is valid on the chessboard
  const isValidPosition = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };
  
  // Find minimum knight moves using BFS
  const findMinimumKnightMoves = () => {
    if (!grid.length) return;
    
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    const steps: Step[] = [];
    
    // Make a deep copy of the grid
    let gridCopy: Cell[][] = JSON.parse(JSON.stringify(grid));
    
    // Initial step
    steps.push({
      grid: JSON.parse(JSON.stringify(gridCopy)),
      description: 'Starting BFS algorithm to find the minimum number of knight moves. The numbers in each cell represent the distance from the start.',
      queue: [startPosition],
      currentCell: null,
      pathFound: false,
      shortestPath: []
    });
    
    // BFS queue
    const queue: { row: number; col: number }[] = [startPosition];
    let pathFound = false;
    
    // Knight moves (all 8 possible L-shaped moves)
    const knightMoves = [
      { dr: -2, dc: -1 }, { dr: -2, dc: 1 }, 
      { dr: -1, dc: -2 }, { dr: -1, dc: 2 }, 
      { dr: 1, dc: -2 }, { dr: 1, dc: 2 },
      { dr: 2, dc: -1 }, { dr: 2, dc: 1 }
    ];
    
    while (queue.length > 0 && !pathFound) {
      const current = queue.shift()!;
      
      // If we've already visited this cell, skip it
      if (gridCopy[current.row][current.col].state === 'visited') continue;
      
      // Mark current cell as visiting
      if (gridCopy[current.row][current.col].state !== 'start' && 
          gridCopy[current.row][current.col].state !== 'end') {
        gridCopy[current.row][current.col].state = 'visiting';
      }
      
      // Add step - visiting current cell
      steps.push({
        grid: JSON.parse(JSON.stringify(gridCopy)),
        description: `Visiting position (${current.row}, ${current.col}) with distance ${gridCopy[current.row][current.col].distance} from start.`,
        queue: [...queue],
        currentCell: current,
        pathFound: false,
        shortestPath: []
      });
      
      // If we've reached the end, we're done
      if (current.row === endPosition.row && current.col === endPosition.col) {
        pathFound = true;
        
        // Reconstruct the path
        const path: { row: number; col: number }[] = [];
        let currentCell = gridCopy[endPosition.row][endPosition.col];
        
        while (currentCell.parent) {
          path.unshift({ row: currentCell.row, col: currentCell.col });
          const parentPos = currentCell.parent;
          currentCell = gridCopy[parentPos.row][parentPos.col];
        }
        path.unshift({ row: startPosition.row, col: startPosition.col });
        
        // Mark the path
        for (const pos of path) {
          if (gridCopy[pos.row][pos.col].state !== 'start' && 
              gridCopy[pos.row][pos.col].state !== 'end') {
            gridCopy[pos.row][pos.col].state = 'path';
          }
        }
        
        // Add final step
        steps.push({
          grid: JSON.parse(JSON.stringify(gridCopy)),
          description: `Path found! The minimum number of knight moves from start to end is ${gridCopy[endPosition.row][endPosition.col].distance}.`,
          queue: [],
          currentCell: null,
          pathFound: true,
          shortestPath: path
        });
        
        break;
      }
      
      // Mark current cell as visited
      if (gridCopy[current.row][current.col].state !== 'start' && 
          gridCopy[current.row][current.col].state !== 'end') {
        gridCopy[current.row][current.col].state = 'visited';
      }
      
      // Try all possible knight moves
      for (const { dr, dc } of knightMoves) {
        const newRow = current.row + dr;
        const newCol = current.col + dc;
        
        // Check if the new position is valid and not visited
        if (isValidPosition(newRow, newCol) && 
            gridCopy[newRow][newCol].state !== 'visited' && 
            gridCopy[newRow][newCol].state !== 'queued') {
          
          // If it's not the end position, mark as queued
          if (gridCopy[newRow][newCol].state !== 'end') {
            gridCopy[newRow][newCol].state = 'queued';
          }
          
          // Update distance and parent
          gridCopy[newRow][newCol].distance = gridCopy[current.row][current.col].distance + 1;
          gridCopy[newRow][newCol].parent = { row: current.row, col: current.col };
          
          // Add to queue
          queue.push({ row: newRow, col: newCol });
        }
      }
      
      // Add step after exploring all possible moves
      if (!pathFound) {
        steps.push({
          grid: JSON.parse(JSON.stringify(gridCopy)),
          description: `Explored all possible knight moves from (${current.row}, ${current.col}). Added valid positions to the queue.`,
          queue: [...queue],
          currentCell: null,
          pathFound: false,
          shortestPath: []
        });
      }
    }
    
    // If no path found (shouldn't happen for a knight on a standard chessboard)
    if (!pathFound) {
      steps.push({
        grid: JSON.parse(JSON.stringify(gridCopy)),
        description: 'No path found from start to end. This should not happen with a knight on a standard chessboard.',
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
      findMinimumKnightMoves();
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
      findMinimumKnightMoves();
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
  
  const handleStartPositionChange = (type: 'row' | 'col', value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0 || numValue > 7) return;
    
    setStartPosition(prev => ({
      ...prev,
      [type]: numValue
    }));
  };
  
  const handleEndPositionChange = (type: 'row' | 'col', value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0 || numValue > 7) return;
    
    setEndPosition(prev => ({
      ...prev,
      [type]: numValue
    }));
  };
  
  // Get current grid to display
  const currentGrid = steps.length > 0 && currentStep < steps.length
    ? steps[currentStep].grid
    : grid;
  
  // Get current description
  const currentDescription = steps.length > 0 && currentStep < steps.length
    ? steps[currentStep].description
    : 'Click "Start" to run the BFS algorithm to find the minimum number of knight moves from start to end.';
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/problems">
          <FaArrowLeft /> Back to Problems
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Minimum Knight Moves on a Chessboard</PageTitle>
        <Description>
          Given a chessboard and a knight at a start position, find the minimum number of moves required
          to reach an end position. A knight can move in an L-shape: 2 squares horizontally and 1 square vertically,
          or 2 squares vertically and 1 square horizontally.
        </Description>
      </PageHeader>
      
      <InputContainer>
        <InputGroup>
          <Label>Start Row:</Label>
          <Input 
            type="number" 
            min="0" 
            max="7" 
            value={startPosition.row} 
            onChange={(e) => handleStartPositionChange('row', e.target.value)}
            disabled={isAnimating}
          />
        </InputGroup>
        <InputGroup>
          <Label>Start Col:</Label>
          <Input 
            type="number" 
            min="0" 
            max="7" 
            value={startPosition.col} 
            onChange={(e) => handleStartPositionChange('col', e.target.value)}
            disabled={isAnimating}
          />
        </InputGroup>
        <InputGroup>
          <Label>End Row:</Label>
          <Input 
            type="number" 
            min="0" 
            max="7" 
            value={endPosition.row} 
            onChange={(e) => handleEndPositionChange('row', e.target.value)}
            disabled={isAnimating}
          />
        </InputGroup>
        <InputGroup>
          <Label>End Col:</Label>
          <Input 
            type="number" 
            min="0" 
            max="7" 
            value={endPosition.col} 
            onChange={(e) => handleEndPositionChange('col', e.target.value)}
            disabled={isAnimating}
          />
        </InputGroup>
      </InputContainer>
      
      <ControlsContainer>
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
            {steps[currentStep].queue.length} positions
          </InfoText>
        )}
      </InfoPanel>
      
      <GridContainer>
        <Chessboard>
          {currentGrid.map((row, i) => 
            row.map((cell, j) => {
              const isBlack = (i + j) % 2 === 1;
              return (
                <ChessCell 
                  key={`${i}-${j}`} 
                  isBlack={isBlack}
                  cellState={cell.state}
                  distance={cell.distance}
                >
                  {(cell.state === 'start' || cell.state === 'end' || cell.state === 'path') && (
                    <KnightIcon>♞</KnightIcon>
                  )}
                </ChessCell>
              );
            })
          )}
        </Chessboard>
        
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
          1. The algorithm uses <strong>Breadth-First Search (BFS)</strong> to find the minimum number of knight moves.
        </InfoText>
        <InfoText>
          2. Starting from the knight's initial position, we explore all positions that can be reached in 1 move, then 2 moves, etc.
        </InfoText>
        <InfoText>
          3. For each position, we explore all 8 possible L-shaped knight moves and add valid positions to a queue.
        </InfoText>
        <InfoText>
          4. The number in each cell represents the minimum number of moves needed to reach that position from the start.
        </InfoText>
        <InfoText>
          5. When we reach the end position, we trace back through parent pointers to find the path of minimum moves.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Time & Space Complexity</InfoTitle>
        <InfoText>
          <strong>Time Complexity:</strong> O(N²) where N is the size of the chessboard (8×8 = 64 cells). In the worst case, we visit every cell on the board.
        </InfoText>
        <InfoText>
          <strong>Space Complexity:</strong> O(N²) for the queue, the grid representation, and the parent pointers.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Interesting Facts</InfoTitle>
        <InfoText>• On a standard 8×8 chessboard, a knight can reach any position from any other position.</InfoText>
        <InfoText>• The maximum number of moves required is 6 (proven mathematically).</InfoText>
        <InfoText>• The "Knight's Tour" is a related problem where the knight must visit every square exactly once.</InfoText>
        <InfoText>• This problem is a classic example of BFS application, as it guarantees the shortest path in an unweighted graph.</InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications</InfoTitle>
        <InfoText>• Chess engines and analysis tools</InfoText>
        <InfoText>• Puzzle games involving chess piece movements</InfoText>
        <InfoText>• Pathfinding in grid-based games with custom movement rules</InfoText>
        <InfoText>• Robot motion planning with constrained movement patterns</InfoText>
        <InfoText>• Analysis of specialized transportation networks</InfoText>
      </InfoPanel>
    </PageContainer>
  );
};

export default MinimumKnightMovesPage; 