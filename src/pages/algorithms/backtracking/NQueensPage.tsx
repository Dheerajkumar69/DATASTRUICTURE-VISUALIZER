import React, { useState, useEffect, useCallback, memo, lazy, Suspense } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Lazy load the SyntaxHighlighter to improve initial load time
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'));

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

const SizeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SizeLabel = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
  white-space: nowrap;
`;

const SizeSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
`;

const ChessboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 800px;
`;

const Chessboard = styled.div<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 1fr);
  grid-template-rows: repeat(${props => props.size}, 1fr);
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1;
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const Cell = styled.div<{
  isDark: boolean;
  hasQueen: boolean;
  isAttacked: boolean;
  isTesting: boolean;
}>`
  position: relative;
  background-color: ${props => 
    props.isDark 
      ? props.theme.colors.gray300 
      : props.theme.colors.gray100};
  border: 1px solid ${props => props.theme.colors.border};
  
  ${props => props.isAttacked && css`
    background-color: ${props.theme.colors.error}40;
  `}
  
  ${props => props.isTesting && css`
    background-color: ${props.theme.colors.warning}60;
    animation: ${pulseAnimation} 0.6s infinite;
  `}
  
  &::after {
    content: ${props => props.hasQueen ? "'♛'" : "''"};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: min(5vw, 2.5rem);
    color: ${props => props.isAttacked ? props.theme.colors.error : props.theme.colors.primary};
  }
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

const CodeContainer = styled.div`
  max-width: 800px;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-top: 1rem;
`;

// Types
interface Cell {
  row: number;
  col: number;
  hasQueen: boolean;
  isAttacked: boolean;
  isTesting: boolean;
}

interface Step {
  board: Cell[][];
  row: number;
  col: number;
  description: string;
  isPlacingQueen: boolean;
  isRemovingQueen: boolean;
  isCheckingAttack: boolean;
  isSolutionFound: boolean;
}

// Cell component
const ChessCell: React.FC<{
  isDark: boolean;
  hasQueen: boolean;
  isAttacked: boolean;
  isTesting: boolean;
}> = memo(({ isDark, hasQueen, isAttacked, isTesting }) => (
  <Cell 
    isDark={isDark} 
    hasQueen={hasQueen} 
    isAttacked={isAttacked} 
    isTesting={isTesting} 
  />
));

const NQueensPage: React.FC = () => {
  const [boardSize, setBoardSize] = useState<number>(8);
  const [board, setBoard] = useState<Cell[][]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepInfo, setStepInfo] = useState<string>('');
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  const [solutions, setSolutions] = useState<number>(0);
  
  // Initialize the board
  useEffect(() => {
    initializeBoard();
  }, [boardSize]);
  
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
  
  // Update board and info when step changes
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      setBoard(step.board);
      setStepInfo(step.description);
      
      if (step.isSolutionFound) {
        setSolutions(prev => prev + 1);
      }
    }
  }, [currentStep, steps]);
  
  // Initialize the board
  const initializeBoard = () => {
    const newBoard: Cell[][] = [];
    
    for (let i = 0; i < boardSize; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < boardSize; j++) {
        row.push({
          row: i,
          col: j,
          hasQueen: false,
          isAttacked: false,
          isTesting: false
        });
      }
      newBoard.push(row);
    }
    
    setBoard(newBoard);
    setSteps([]);
    setCurrentStep(0);
    setStepInfo('Board initialized. Click "Start" to begin solving.');
    setSolutions(0);
  };
  
  // Check if a position is safe for a queen
  const isSafe = (board: Cell[][], row: number, col: number): boolean => {
    // Check row to the left
    for (let i = 0; i < col; i++) {
      if (board[row][i].hasQueen) {
        return false;
      }
    }
    
    // Check upper diagonal
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j].hasQueen) {
        return false;
      }
    }
    
    // Check lower diagonal
    for (let i = row, j = col; i < boardSize && j >= 0; i++, j--) {
      if (board[i][j].hasQueen) {
        return false;
      }
    }
    
    return true;
  };
  
  // Mark cells that are under attack
  const markAttackedCells = (board: Cell[][], row: number, col: number, isAttacked: boolean): Cell[][] => {
    const newBoard = JSON.parse(JSON.stringify(board));
    
    // Mark the entire row
    for (let j = 0; j < boardSize; j++) {
      if (j !== col) {
        newBoard[row][j].isAttacked = isAttacked;
      }
    }
    
    // Mark the entire column
    for (let i = 0; i < boardSize; i++) {
      if (i !== row) {
        newBoard[i][col].isAttacked = isAttacked;
      }
    }
    
    // Mark diagonals
    // Upper-left diagonal
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      newBoard[i][j].isAttacked = isAttacked;
    }
    // Upper-right diagonal
    for (let i = row - 1, j = col + 1; i >= 0 && j < boardSize; i--, j++) {
      newBoard[i][j].isAttacked = isAttacked;
    }
    // Lower-left diagonal
    for (let i = row + 1, j = col - 1; i < boardSize && j >= 0; i++, j--) {
      newBoard[i][j].isAttacked = isAttacked;
    }
    // Lower-right diagonal
    for (let i = row + 1, j = col + 1; i < boardSize && j < boardSize; i++, j++) {
      newBoard[i][j].isAttacked = isAttacked;
    }
    
    return newBoard;
  };
  
  // Solve N-Queens
  const solveNQueens = () => {
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    setSteps([]);
    setSolutions(0);
    
    const initialBoard = initializeEmptyBoard();
    const initialStep: Step = {
      board: initialBoard,
      row: 0,
      col: 0,
      description: 'Starting to solve the N-Queens problem.',
      isPlacingQueen: false,
      isRemovingQueen: false,
      isCheckingAttack: false,
      isSolutionFound: false
    };
    
    const steps: Step[] = [initialStep];
    
    const solveBacktrack = (board: Cell[][], col: number) => {
      if (col >= boardSize) {
        // Found a solution
        steps.push({
          board: JSON.parse(JSON.stringify(board)),
          row: -1,
          col: -1,
          description: `Solution found! ${steps.length > 0 ? 'This is solution #' + (solutions + 1) : ''}`,
          isPlacingQueen: false,
          isRemovingQueen: false,
          isCheckingAttack: false,
          isSolutionFound: true
        });
        return true;
      }
      
      for (let row = 0; row < boardSize; row++) {
        // Try placing a queen at (row, col)
        const testingBoard = JSON.parse(JSON.stringify(board));
        testingBoard[row][col].isTesting = true;
        
        steps.push({
          board: testingBoard,
          row,
          col,
          description: `Trying to place a queen at position (${row}, ${col}).`,
          isPlacingQueen: false,
          isRemovingQueen: false,
          isCheckingAttack: true,
          isSolutionFound: false
        });
        
        if (isSafe(board, row, col)) {
          // Place queen
          board[row][col].hasQueen = true;
          const boardWithAttacks = markAttackedCells(board, row, col, true);
          
          steps.push({
            board: JSON.parse(JSON.stringify(boardWithAttacks)),
            row,
            col,
            description: `Placed a queen at position (${row}, ${col}). Marking attacked cells.`,
            isPlacingQueen: true,
            isRemovingQueen: false,
            isCheckingAttack: false,
            isSolutionFound: false
          });
          
          // Recur to place the rest of the queens
          if (solveBacktrack(boardWithAttacks, col + 1)) {
            return true;
          }
          
          // If placing a queen at (row, col) doesn't lead to a solution, remove it
          board[row][col].hasQueen = false;
          const boardWithoutAttacks = markAttackedCells(board, row, col, false);
          
          steps.push({
            board: JSON.parse(JSON.stringify(boardWithoutAttacks)),
            row,
            col,
            description: `Removing queen from position (${row}, ${col}) as it doesn't lead to a solution.`,
            isPlacingQueen: false,
            isRemovingQueen: true,
            isCheckingAttack: false,
            isSolutionFound: false
          });
        } else {
          steps.push({
            board: JSON.parse(JSON.stringify(board)),
            row,
            col,
            description: `Position (${row}, ${col}) is under attack. Can't place a queen here.`,
            isPlacingQueen: false,
            isRemovingQueen: false,
            isCheckingAttack: false,
            isSolutionFound: false
          });
        }
      }
      
      return false;
    };
    
    const emptyBoard = initializeEmptyBoard();
    solveBacktrack(emptyBoard, 0);
    
    // If no solution is found
    if (!steps.some(step => step.isSolutionFound)) {
      steps.push({
        board: initializeEmptyBoard(),
        row: -1,
        col: -1,
        description: 'No solution found for this board size.',
        isPlacingQueen: false,
        isRemovingQueen: false,
        isCheckingAttack: false,
        isSolutionFound: false
      });
    }
    
    setSteps(steps);
    setCurrentStep(0);
  };
  
  const initializeEmptyBoard = (): Cell[][] => {
    const newBoard: Cell[][] = [];
    
    for (let i = 0; i < boardSize; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < boardSize; j++) {
        row.push({
          row: i,
          col: j,
          hasQueen: false,
          isAttacked: false,
          isTesting: false
        });
      }
      newBoard.push(row);
    }
    
    return newBoard;
  };
  
  // Control methods
  const startAnimation = () => {
    if (steps.length === 0) {
      solveNQueens();
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
    initializeBoard();
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
  
  const handleBoardSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setBoardSize(newSize);
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    setSteps([]);
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnimationSpeed(parseInt(e.target.value, 10));
  };
  
  // Implementation code
  const nQueensCode = `// Backtracking algorithm to solve N-Queens problem
function solveNQueens(n) {
  const result = [];
  const board = Array(n).fill().map(() => Array(n).fill('.'));
  
  function isSafe(row, col) {
    // Check row to the left
    for (let i = 0; i < col; i++) {
      if (board[row][i] === 'Q') return false;
    }
    
    // Check upper diagonal
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    
    // Check lower diagonal
    for (let i = row, j = col; i < n && j >= 0; i++, j--) {
      if (board[i][j] === 'Q') return false;
    }
    
    return true;
  }
  
  function backtrack(col) {
    // Base case: all queens are placed
    if (col >= n) {
      // Add solution to result
      const solution = board.map(row => row.join(''));
      result.push(solution);
      return;
    }
    
    // Try placing queen in each row of the current column
    for (let row = 0; row < n; row++) {
      if (isSafe(row, col)) {
        // Place queen
        board[row][col] = 'Q';
        
        // Recur to place rest of the queens
        backtrack(col + 1);
        
        // Backtrack - remove queen to try other positions
        board[row][col] = '.';
      }
    }
  }
  
  backtrack(0);
  return result;
}

// Example: Print all solutions for 4-Queens
const solutions = solveNQueens(4);
console.log(\`Found \${solutions.length} solutions:\`);
solutions.forEach((solution, index) => {
  console.log(\`Solution \${index + 1}:\`);
  solution.forEach(row => console.log(row));
  console.log('');
});`;
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/backtracking">
          <FaArrowLeft /> Back to Backtracking Algorithms
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>N-Queens Backtracking</PageTitle>
        <Description>
          The N-Queens problem is the challenge of placing N chess queens on an N×N chessboard so that 
          no two queens threaten each other. A solution requires that no two queens share the same row, 
          column, or diagonal. This visualization shows how backtracking is used to solve this classic problem.
        </Description>
      </PageHeader>
      
      <InfoPanel>
        <InfoTitle>How to use this visualization:</InfoTitle>
        <InfoText>1. Select the board size (N) using the dropdown.</InfoText>
        <InfoText>2. Click &ldquo;Start&rdquo; to begin the visualization of the backtracking algorithm.</InfoText>
        <InfoText>3. Use the controls to pause, step forward/backward, or reset the visualization.</InfoText>
        <InfoText>4. Watch as the algorithm tries different queen placements and backtracks when necessary.</InfoText>
        <InfoText>5. A successful solution will show N queens placed on the board with no conflicts.</InfoText>
      </InfoPanel>
      
      <ControlsContainer>
        <SizeSelector>
          <SizeLabel>Board Size:</SizeLabel>
          <SizeSelect value={boardSize} onChange={handleBoardSizeChange} disabled={isAnimating && !isPaused}>
            <option value="4">4×4</option>
            <option value="5">5×5</option>
            <option value="6">6×6</option>
            <option value="7">7×7</option>
            <option value="8">8×8</option>
          </SizeSelect>
        </SizeSelector>
        
        <SizeSelector>
          <SizeLabel>Speed:</SizeLabel>
          <SizeSelect value={animationSpeed} onChange={handleSpeedChange}>
            <option value="1000">Slow</option>
            <option value="500">Medium</option>
            <option value="200">Fast</option>
          </SizeSelect>
        </SizeSelector>
        
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
      
      {stepInfo && (
        <InfoPanel>
          <InfoTitle>Current Step:</InfoTitle>
          <InfoText>{stepInfo}</InfoText>
          {solutions > 0 && <InfoText>Solutions found: {solutions}</InfoText>}
        </InfoPanel>
      )}
      
      <ChessboardContainer>
        <Chessboard size={boardSize}>
          {board.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <ChessCell
                key={`${rowIndex}-${colIndex}`}
                isDark={(rowIndex + colIndex) % 2 === 1}
                hasQueen={cell.hasQueen}
                isAttacked={cell.isAttacked}
                isTesting={cell.isTesting}
              />
            ))
          )}
        </Chessboard>
      </ChessboardContainer>
      
      <InfoPanel>
        <InfoTitle>Implementation Code:</InfoTitle>
        <CodeContainer>
          <Suspense fallback={<div>Loading code...</div>}>
            <SyntaxHighlighter language="javascript" style={vs2015}>
              {nQueensCode}
            </SyntaxHighlighter>
          </Suspense>
        </CodeContainer>
      </InfoPanel>
    </PageContainer>
  );
};

export default NQueensPage; 