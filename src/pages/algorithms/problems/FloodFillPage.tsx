import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward, FaRandom } from 'react-icons/fa';

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
  max-width: 800px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 40px);
  grid-template-rows: repeat(10, 40px);
<<<<<<< HEAD
  gap: 2px;
  background-color: ${props => props.theme.colors.gray200};
  transition: all 0.3s ease;
  padding: 2px;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
=======
  gap: 1px;
  background-color: ${props => props.theme.colors.border};
  padding: 1px;
  border-radius: 4px;
`;

const Cell = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  background-color: ${props => props.color};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
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
>>>>>>> parent of 5badfa4 (version 4.0.0)
`;

const ColorPicker = styled.input`
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
<<<<<<< HEAD
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
=======
  border-radius: 4px;
>>>>>>> parent of 5badfa4 (version 4.0.0)
  cursor: pointer;
  margin-right: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
`;

interface Step {
  grid: string[][];
  description: string;
  visited: number[][];
}

const FloodFillPage: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  const [selectedColor, setSelectedColor] = useState<string>('#ff0000');
  const [startCell, setStartCell] = useState<{ row: number; col: number } | null>(null);
  const [targetColor, setTargetColor] = useState<string>('#ffffff');
  
  // Initialize the grid
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
    const newGrid: string[][] = [];
    const colors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff'];
    
    for (let i = 0; i < 10; i++) {
      const row: string[] = [];
      for (let j = 0; j < 10; j++) {
        row.push(colors[Math.floor(Math.random() * colors.length)]);
      }
      newGrid.push(row);
    }
    
    setGrid(newGrid);
    setSteps([]);
    setCurrentStep(0);
    setStartCell(null);
  };
  
  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (isAnimating && !isPaused) return;
    
    setStartCell({ row, col });
    runFloodFill(row, col);
  };
  
  // Run Flood Fill algorithm
  const runFloodFill = (startRow: number, startCol: number) => {
    if (grid.length === 0) return;
    
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    const steps: Step[] = [];
    const visited: number[][] = Array(10).fill(0).map(() => Array(10).fill(0));
    const queue: { row: number; col: number }[] = [{ row: startRow, col: startCol }];
    const targetColor = grid[startRow][startCol];
    
    // Initial step
    const initialGrid = JSON.parse(JSON.stringify(grid)) as string[][];
    initialGrid[startRow][startCol] = selectedColor;
    visited[startRow][startCol] = 1;
    
    steps.push({
      grid: initialGrid,
      description: `Starting flood fill from cell (${startRow}, ${startCol}).`,
      visited: JSON.parse(JSON.stringify(visited))
    });
    
    // Process queue
    while (queue.length > 0) {
      const { row, col } = queue.shift()!;
      
      // Check all four directions
      const directions = [
        { dr: -1, dc: 0 }, // up
        { dr: 1, dc: 0 },  // down
        { dr: 0, dc: -1 }, // left
        { dr: 0, dc: 1 }   // right
      ];
      
      for (const { dr, dc } of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (
          newRow >= 0 && newRow < 10 &&
          newCol >= 0 && newCol < 10 &&
          !visited[newRow][newCol] &&
          grid[newRow][newCol] === targetColor
        ) {
          queue.push({ row: newRow, col: newCol });
          visited[newRow][newCol] = 1;
          
          // Create a new grid state
          const newGrid = JSON.parse(JSON.stringify(steps[steps.length - 1].grid)) as string[][];
          newGrid[newRow][newCol] = selectedColor;
          
          steps.push({
            grid: newGrid,
            description: `Filling cell (${newRow}, ${newCol}).`,
            visited: JSON.parse(JSON.stringify(visited))
          });
        }
      }
    }
    
    // Final step
    steps.push({
      grid: steps[steps.length - 1].grid,
      description: `Flood fill complete. Filled ${steps.length - 1} cells.`,
      visited: JSON.parse(JSON.stringify(visited))
    });
    
    setSteps(steps);
    setCurrentStep(0);
  };
  
  // Control methods
  const startAnimation = () => {
    if (steps.length === 0 && startCell) {
      runFloodFill(startCell.row, startCell.col);
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
    setStartCell(null);
    generateRandomGrid();
  };
  
  const stepForward = () => {
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
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/problems">
          <FaArrowLeft /> Back to Problems
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Flood Fill Algorithm</PageTitle>
        <Description>
          The Flood Fill algorithm is used to fill a connected region of cells with a new color.
          Click on any cell to start the flood fill from that position.
        </Description>
      </PageHeader>
      
      <InfoPanel>
        <InfoTitle>How Flood Fill Works:</InfoTitle>
        <InfoText>1. Select a starting cell by clicking on it.</InfoText>
        <InfoText>2. The algorithm checks all four adjacent cells (up, down, left, right).</InfoText>
        <InfoText>3. For each adjacent cell that matches the target color, it is filled with the new color.</InfoText>
        <InfoText>4. This process continues until no more cells can be filled.</InfoText>
      </InfoPanel>
      
      <ControlsContainer>
        <ColorPicker
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          disabled={isAnimating && !isPaused}
        />
        
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
      
      <GridContainer>
        <Grid>
          {(steps.length > 0 ? steps[currentStep].grid : grid).map((row, i) => (
            row.map((color, j) => (
              <Cell
                key={`${i}-${j}`}
                color={color}
                onClick={() => handleCellClick(i, j)}
              />
            ))
          ))}
        </Grid>
      </GridContainer>
      
      {steps.length > 0 && currentStep < steps.length && (
        <InfoPanel>
          <InfoTitle>Current Step:</InfoTitle>
          <InfoText>{steps[currentStep].description}</InfoText>
        </InfoPanel>
      )}
      
      <InfoPanel>
        <InfoTitle>Time & Space Complexity:</InfoTitle>
        <InfoText>
          <strong>Time Complexity:</strong> O(R × C) where R is the number of rows and C is the number of columns.
        </InfoText>
        <InfoText>
          <strong>Space Complexity:</strong> O(R × C) for the visited array and queue.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications of Flood Fill:</InfoTitle>
        <InfoText>• Image editing tools (paint bucket tool)</InfoText>
        <InfoText>• Game development (terrain generation)</InfoText>
        <InfoText>• Computer vision (region detection)</InfoText>
        <InfoText>• Maze solving</InfoText>
      </InfoPanel>
    </PageContainer>
  );
};

export default FloodFillPage; 