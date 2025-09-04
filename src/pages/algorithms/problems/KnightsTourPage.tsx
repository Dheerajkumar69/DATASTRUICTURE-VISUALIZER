import React, { useState, useEffect } from 'react';
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

interface Step {
  board: number[][];
  currentPosition: { row: number; col: number };
  moveNumber: number;
  description: string;
}

const KnightsTourPage: React.FC = () => {
  const [board, setBoard] = useState<number[][]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  const [startPosition, setStartPosition] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  
  // Initialize the board
  useEffect(() => {
    generateBoard();
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
  
  // Generate the board
  const generateBoard = () => {
    const newBoard: number[][] = Array(8).fill(0).map(() => Array(8).fill(0));
    setBoard(newBoard);
    setSteps([]);
    setCurrentStep(0);
  };
  
  // Run Knight's Tour algorithm
  const runKnightsTour = () => {
    if (board.length === 0) return;
    
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    const steps: Step[] = [];
    const visited: number[][] = Array(8).fill(0).map(() => Array(8).fill(0));
    const currentPos = { ...startPosition };
    let moveNumber = 1;
    
    // Initial step
    visited[currentPos.row][currentPos.col] = moveNumber;
    steps.push({
      board: JSON.parse(JSON.stringify(visited)),
      currentPosition: { ...currentPos },
      moveNumber,
      description: `Starting at position (${currentPos.row}, ${currentPos.col}).`
    });
    
    // Possible moves for a knight
    const moves = [
      { dr: -2, dc: -1 }, { dr: -2, dc: 1 },
      { dr: -1, dc: -2 }, { dr: -1, dc: 2 },
      { dr: 1, dc: -2 },  { dr: 1, dc: 2 },
      { dr: 2, dc: -1 },  { dr: 2, dc: 1 }
    ];
    
    // Try to find a valid tour
    while (moveNumber < 64) {
      let nextMove = null;
      let minMoves = 9; // Maximum possible moves from any position
      
      // Try each possible move
      for (const { dr, dc } of moves) {
        const newRow = currentPos.row + dr;
        const newCol = currentPos.col + dc;
        
        if (
          newRow >= 0 && newRow < 8 &&
          newCol >= 0 && newCol < 8 &&
          !visited[newRow][newCol]
        ) {
          // Count available moves from this position
          let availableMoves = 0;
          for (const move of moves) {
            const nextRow = newRow + move.dr;
            const nextCol = newCol + move.dc;
            
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
      currentPos.row = nextMove.row;
      currentPos.col = nextMove.col;
      moveNumber++;
      visited[currentPos.row][currentPos.col] = moveNumber;
      
      steps.push({
        board: JSON.parse(JSON.stringify(visited)),
        currentPosition: { ...currentPos },
        moveNumber,
        description: `Move ${moveNumber}: Knight moves to (${currentPos.row}, ${currentPos.col}).`
      });
    }
    
    // Final step
    steps.push({
      board: JSON.parse(JSON.stringify(visited)),
      currentPosition: { ...currentPos },
      moveNumber,
      description: moveNumber === 64 
        ? 'Knight\'s Tour completed successfully!'
        : 'No valid tour found from this starting position.'
    });
    
    setSteps(steps);
    setCurrentStep(0);
  };
  
  // Control methods
  const startAnimation = () => {
    if (steps.length === 0) {
      runKnightsTour();
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
    generateBoard();
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
  
  const handleCellClick = (row: number, col: number) => {
    if (isAnimating && !isPaused) return;
    
    setStartPosition({ row, col });
    generateBoard();
  };
  
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
      
      <BoardContainer>
        <Board>
          {(steps.length > 0 ? steps[currentStep].board : board).map((row, i) => (
            row.map((value, j) => (
              <Cell
                key={`${i}-${j}`}
                isVisited={value > 0}
                isCurrent={steps.length > 0 && 
                  steps[currentStep].currentPosition.row === i && 
                  steps[currentStep].currentPosition.col === j}
                onClick={() => handleCellClick(i, j)}
              >
                {value > 0 && value}
              </Cell>
            ))
          ))}
        </Board>
      </BoardContainer>
      
      {steps.length > 0 && currentStep < steps.length && (
        <InfoPanel>
          <InfoTitle>Current Step:</InfoTitle>
          <InfoText>{steps[currentStep].description}</InfoText>
          <InfoText>
            <strong>Move Number: </strong>
            {steps[currentStep].moveNumber}
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