import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { useRobustAnimation } from '../../../hooks/useRobustAnimation';
import { AnimationStep, createAnimatedStep, measureAnimationPerformance } from '../../../components/utils/AnimationUtils';

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

const Button = styled.button<{ primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background-color: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.card};
  color: ${props => props.primary ? '#ffffff' : props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.primary ? props.theme.colors.primaryDark : props.theme.colors.hover};
  }
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 800px;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 60px);
  grid-template-rows: repeat(8, 60px);
  gap: 1px;
  background-color: ${props => props.theme.colors.border};
  padding: 1px;
  border-radius: 4px;
`;

const Cell = styled.div<{ isVisited: boolean; isCurrent: boolean }>`
  width: 60px;
  height: 60px;
  background-color: ${props => props.isVisited ? '#4caf50' : '#ffffff'};
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: ${props => props.isCurrent ? '#ffffff' : '#000000'};
  position: relative;
  
  &::after {
    content: '♞';
    font-size: 2rem;
    position: absolute;
    display: ${props => props.isCurrent ? 'block' : 'none'};
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
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
`;

// Define the step interface
interface StepData {
  board: number[][];
  currentPosition: { row: number; col: number };
  moveNumber: number;
  description: string;
}

const KnightsTourPage: React.FC = () => {
  const [board, setBoard] = useState<number[][]>([]);
  const [startPosition, setStartPosition] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  
  // Use our enhanced animation hook
  const {
    currentState: currentStepData,
    currentStep,
    isAnimating,
    isPaused,
    animationSpeed,
    startAnimation: startAnimationBase,
    pauseAnimation,
    resetAnimation: resetAnimationBase,
    stepForward,
    stepBackward,
    setAnimationSpeed,
    setSteps,
    hasError,
    errorMessage
  } = useRobustAnimation<StepData>({
    initialState: {
      board: Array(8).fill(0).map(() => Array(8).fill(0)),
      currentPosition: { row: 0, col: 0 },
      moveNumber: 0,
      description: 'Click on any square to start the tour from that position.'
    },
    useRAF: true,
    animationId: 'knights-tour-animation'
  });
  
  // Initialize the board
  useEffect(() => {
    generateBoard();
  }, []);
  
  // Generate the board
  const generateBoard = () => {
    const newBoard: number[][] = Array(8).fill(0).map(() => Array(8).fill(0));
    setBoard(newBoard);
    setSteps([]);
  };
  
  // Enhanced start animation with error handling
  const startAnimation = () => {
    try {
      if (!currentStepData || currentStep === 0) {
        runKnightsTour();
      } else {
        startAnimationBase();
      }
    } catch (error) {
      console.error("Error starting Knight's Tour animation:", error);
    }
  };
  
  // Enhanced reset animation
  const resetAnimation = () => {
    try {
      resetAnimationBase();
      generateBoard();
    } catch (error) {
      console.error("Error resetting Knight's Tour:", error);
    }
  };
  
  // Run Knight's Tour algorithm with performance measurement
  const runKnightsTour = () => {
    if (board.length === 0) return;
    
    measureAnimationPerformance(() => {
      try {
        const stepsData: StepData[] = [];
        const visited: number[][] = Array(8).fill(0).map(() => Array(8).fill(0));
        const currentPos = { ...startPosition };
        let moveNumber = 1;
        
        // Initial step
        visited[currentPos.row][currentPos.col] = moveNumber;
        stepsData.push({
          board: JSON.parse(JSON.stringify(visited)),
          currentPosition: { ...currentPos },
          moveNumber,
          description: `Starting at position (${currentPos.row}, ${currentPos.col}).`
        });
        
        // Possible moves for a knight
        const rowMoves = [-2, -2, -1, -1, 1, 1, 2, 2];
        const colMoves = [-1, 1, -2, 2, -2, 2, -1, 1];
        
        // Try to find a valid tour
        while (moveNumber < 64) {
          // Find the move with minimum degree
          let minMoves = Infinity;
          let nextMove: { row: number; col: number } | null = null;
          
          for (let k = 0; k < 8; k++) {
            const newRow = currentPos.row + rowMoves[k];
            const newCol = currentPos.col + colMoves[k];
            
            if (
              newRow >= 0 && newRow < 8 &&
              newCol >= 0 && newCol < 8 &&
              !visited[newRow][newCol]
            ) {
              // Count future moves from this position (Warnsdorff's rule)
              let availableMoves = 0;
              
              for (let m = 0; m < 8; m++) {
                const nextRow = newRow + rowMoves[m];
                const nextCol = newCol + colMoves[m];
                
                if (
                  nextRow >= 0 && nextRow < 8 &&
                  nextCol >= 0 && nextCol < 8 &&
                  !visited[nextRow][nextCol]
                ) {
                  availableMoves++;
                }
              }
              
              // Update if this move has fewer available next moves
              if (availableMoves < minMoves) {
                minMoves = availableMoves;
                nextMove = { row: newRow, col: newCol };
              }
            }
          }
          
          // If no valid move found, break
          if (!nextMove) break;
          
          // Make the move
          currentPos.row = (nextMove as { row: number; col: number }).row;
          currentPos.col = (nextMove as { row: number; col: number }).col;
          moveNumber++;
          visited[currentPos.row][currentPos.col] = moveNumber;
          
          stepsData.push({
            board: JSON.parse(JSON.stringify(visited)),
            currentPosition: { ...currentPos },
            moveNumber,
            description: `Move ${moveNumber}: Knight moves to (${currentPos.row}, ${currentPos.col}).`
          });
        }
        
        // Final step
        const finalDescription = moveNumber === 64 
          ? 'Knight\'s Tour completed successfully!'
          : 'No valid tour found from this starting position.';
          
        stepsData.push({
          board: JSON.parse(JSON.stringify(visited)),
          currentPosition: { ...currentPos },
          moveNumber,
          description: finalDescription
        });
        
        // Convert to animation steps
        const animationSteps = stepsData.map(data => createAnimatedStep(
          data,
          data.description,
          [],
          moveNumber === 64 ? 'complete' : 'move'
        ));
        
        setSteps(animationSteps);
        startAnimationBase();
      } catch (error) {
        console.error("Error running Knight's Tour algorithm:", error);
      }
    }, "Knight's Tour Algorithm Performance");
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnimationSpeed(parseInt(e.target.value, 10));
  };
  
  const handleCellClick = (row: number, col: number) => {
    if (isAnimating && !isPaused) return;
    
    setStartPosition({ row, col });
    generateBoard();
  };
  
  // Display error state
  if (hasError) {
    return (
      <PageContainer>
        <NavigationRow>
          <BackButton to="/algorithms/problems">
            <FaArrowLeft /> Back to Problems
          </BackButton>
        </NavigationRow>
        
        <PageHeader>
          <PageTitle>Knight's Tour - Error</PageTitle>
          <Description>
            An error occurred during the animation: {errorMessage}
          </Description>
          <Button onClick={resetAnimation}>Reset</Button>
        </PageHeader>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/problems">
          <FaArrowLeft /> Back to Problems
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Knight's Tour</PageTitle>
        <Description>
          The Knight's Tour is a sequence of moves by a knight on a chessboard such that the knight visits every square exactly once.
          Click on any square to start the tour from that position.
        </Description>
      </PageHeader>
      
      <InfoPanel>
        <InfoTitle>How Knight's Tour Works:</InfoTitle>
        <InfoText>1. Select a starting position by clicking on a square.</InfoText>
        <InfoText>2. The algorithm uses Warnsdorff's rule to choose the next move.</InfoText>
        <InfoText>3. For each possible move, it counts the number of available moves from that position.</InfoText>
        <InfoText>4. It chooses the move that leads to the position with the fewest available moves.</InfoText>
      </InfoPanel>
      
      <ControlsContainer>
        <Select value={animationSpeed} onChange={handleSpeedChange}>
          <option value="1000">Slow</option>
          <option value="500">Medium</option>
          <option value="200">Fast</option>
        </Select>
        
        {isAnimating ? (
          <Button onClick={pauseAnimation}>
            <FaPause /> Pause
          </Button>
        ) : (
          <Button onClick={startAnimation}>
            <FaPlay /> Start
          </Button>
        )}
        
        <Button onClick={stepBackward} disabled={currentStep === 0}>
          <FaStepBackward /> Back
        </Button>
        
        <Button onClick={stepForward} disabled={!currentStepData || (currentStepData.moveNumber >= 64)}>
          <FaStepForward /> Forward
        </Button>
        
        <Button onClick={resetAnimation} disabled={isAnimating}>
          <FaUndo /> Reset
        </Button>
      </ControlsContainer>
      
      <BoardContainer>
        <Board>
          {(currentStepData ? currentStepData.board : board).map((row, i) => (
            row.map((value, j) => (
              <Cell
                key={`${i}-${j}`}
                isVisited={value > 0}
                isCurrent={currentStepData && 
                  currentStepData.currentPosition.row === i && 
                  currentStepData.currentPosition.col === j}
                onClick={() => handleCellClick(i, j)}
              >
                {value > 0 && value}
              </Cell>
            ))
          ))}
        </Board>
      </BoardContainer>
      
      {currentStepData && (
        <InfoPanel>
          <InfoTitle>Current Step:</InfoTitle>
          <InfoText>{currentStepData.description}</InfoText>
          <InfoText>
            <strong>Move Number: </strong>
            {currentStepData.moveNumber}
          </InfoText>
        </InfoPanel>
      )}
      
      <InfoPanel>
        <InfoTitle>Time & Space Complexity:</InfoTitle>
        <InfoText>
          <strong>Time Complexity:</strong> O(8^(N×N)) where N is the board size (8 in this case).
        </InfoText>
        <InfoText>
          <strong>Space Complexity:</strong> O(N×N) for the board and visited arrays.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications of Knight's Tour:</InfoTitle>
        <InfoText>• Chess programming and analysis</InfoText>
        <InfoText>• Puzzle solving</InfoText>
        <InfoText>• Algorithm design and optimization</InfoText>
        <InfoText>• Game development</InfoText>
      </InfoPanel>
    </PageContainer>
  );
};

export default KnightsTourPage; 