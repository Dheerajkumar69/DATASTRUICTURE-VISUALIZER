import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaRandom } from 'react-icons/fa';
import { 
  AnimatedGridCell, 
  AnimationControls,
  InfoPanel, 
  InfoTitle, 
  Button,
  Select 
} from '../../../components/utils/AnimatedComponents';
import { useAlgorithmAnimation } from '../../../components/utils/useAlgorithmAnimation';
import { AnimationStep, createAnimatedStep } from '../../../components/utils/AnimationUtils';

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
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 800px;
  align-items: center;
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
  gap: 2px;
  background-color: ${props => props.theme.colors.gray200};
  transition: all 0.3s ease;
  padding: 2px;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ColorPicker = styled.input`
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  margin-right: 1rem;
`;

const InfoText = styled.p`
  color: ${props => props.theme.colors.gray700};
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

// Interface for the FloodFill algorithm state
interface FloodFillState {
  grid: string[][];
  visited: number[][];
}

const FloodFillPage: React.FC = () => {
  // Grid state and color selection
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#ff0000');
  const [startCell, setStartCell] = useState<{ row: number; col: number } | null>(null);
  
  // Initialize the animation hook
  const {
    currentState,
    currentStep,
    isAnimating,
    isPaused,
    animationSpeed,
    currentDescription,
    setSteps,
    startAnimation,
    pauseAnimation,
    resetAnimation,
    stepForward,
    stepBackward,
    setAnimationSpeed,
    canStepForward,
    canStepBackward
  } = useAlgorithmAnimation<FloodFillState>({ 
    initialState: { grid: [], visited: [] } 
  });
  
  // Initialize the grid
  useEffect(() => {
    generateRandomGrid();
  }, []);
  
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
    
    const animationSteps: AnimationStep<FloodFillState>[] = [];
    const visited: number[][] = Array(10).fill(0).map(() => Array(10).fill(0));
    const queue: { row: number; col: number }[] = [{ row: startRow, col: startCol }];
    const targetColor = grid[startRow][startCol];
    
    // Initial step
    const initialGrid = JSON.parse(JSON.stringify(grid)) as string[][];
    initialGrid[startRow][startCol] = selectedColor;
    visited[startRow][startCol] = 1;
    
    animationSteps.push(createAnimatedStep(
      { grid: initialGrid, visited },
      `Starting flood fill from cell (${startRow}, ${startCol}).`,
      [startRow * 10 + startCol],
      'highlight'
    ));
    
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
          const newGrid = JSON.parse(JSON.stringify(animationSteps[animationSteps.length - 1].state.grid)) as string[][];
          newGrid[newRow][newCol] = selectedColor;
          
          const newVisited = JSON.parse(JSON.stringify(visited)) as number[][];
          
          animationSteps.push(createAnimatedStep(
            { grid: newGrid, visited: newVisited },
            `Filling cell (${newRow}, ${newCol}).`,
            [newRow * 10 + newCol],
            'add'
          ));
        }
      }
    }
    
    // Final step
    if (animationSteps.length > 0) {
      animationSteps.push(createAnimatedStep(
        animationSteps[animationSteps.length - 1].state,
        `Flood fill complete. Filled ${animationSteps.length - 1} cells.`,
        [],
        'default'
      ));
    }
    
    setSteps(animationSteps);
  };
  
  // Custom reset that also regenerates the grid
  const handleReset = () => {
    resetAnimation();
    generateRandomGrid();
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
        
        <AnimationControls
          isAnimating={isAnimating}
          isPaused={isPaused}
          onStart={startAnimation}
          onPause={pauseAnimation}
          onReset={handleReset}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onSpeedChange={setAnimationSpeed}
          currentSpeed={animationSpeed}
          canStepForward={canStepForward}
          canStepBackward={canStepBackward}
        />
        
        <Button onClick={generateRandomGrid} disabled={isAnimating && !isPaused}>
          <FaRandom /> New Grid
        </Button>
      </ControlsContainer>
      
      {currentDescription && (
        <InfoPanel>
          <InfoText>{currentDescription}</InfoText>
        </InfoPanel>
      )}
      
      <GridContainer>
        <Grid>
          {(currentState?.grid.length > 0 ? currentState.grid : grid).map((row, rowIndex) => (
            row.map((cell, colIndex) => {
              const index = rowIndex * 10 + colIndex;
              const isVisited = currentState?.visited[rowIndex]?.[colIndex] === 1;
              const isStartCell = startCell?.row === rowIndex && startCell?.col === colIndex;
              const isHighlighted = currentState?.grid && 
                currentState?.grid[rowIndex]?.[colIndex] !== grid[rowIndex]?.[colIndex];
                
              return (
                <AnimatedGridCell
                  key={`${rowIndex}-${colIndex}`}
                  style={{ backgroundColor: cell }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  isHighlighted={isHighlighted}
                  isActive={isStartCell}
                  isVisited={isVisited}
                  animationType={isStartCell ? 'highlight' : isVisited ? 'add' : 'default'}
                />
              );
            })
          ))}
        </Grid>
      </GridContainer>
    </PageContainer>
  );
};

export default FloodFillPage; 