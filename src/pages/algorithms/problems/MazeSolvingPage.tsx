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

const MazeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 800px;
`;

const Maze = styled.div`
  display: grid;
  grid-template-columns: repeat(15, 40px);
  grid-template-rows: repeat(15, 40px);
  gap: 1px;
  background-color: ${props => props.theme.colors.border};
  padding: 1px;
  border-radius: 4px;
`;

const Cell = styled.div<{ isWall: boolean; isPath: boolean; isStart: boolean; isEnd: boolean }>`
  width: 40px;
  height: 40px;
  background-color: ${props => 
    props.isWall ? '#000000' :
    props.isPath ? '#4caf50' :
    props.isStart ? '#2196f3' :
    props.isEnd ? '#f44336' :
    '#ffffff'
  };
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  
  &::after {
    content: ${props => props.isStart ? '"S"' : props.isEnd ? '"E"' : ''};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
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
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
`;

interface Step {
  maze: boolean[][];
  path: { row: number; col: number }[];
  description: string;
}

const MazeSolvingPage: React.FC = () => {
  const [maze, setMaze] = useState<boolean[][]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  
  // Initialize the maze
  useEffect(() => {
    generateMaze();
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
  
  // Generate a random maze using Recursive Backtracking
  const generateMaze = () => {
    const size = 15;
    const newMaze: boolean[][] = Array(size).fill(0).map(() => Array(size).fill(true));
    
    // Start from (1,1)
    const start = { row: 1, col: 1 };
    newMaze[start.row][start.col] = false;
    
    // Recursive function to carve paths
    const carve = (row: number, col: number) => {
      const directions = [
        { dr: 0, dc: 2 },  // right
        { dr: 2, dc: 0 },  // down
        { dr: 0, dc: -2 }, // left
        { dr: -2, dc: 0 }  // up
      ];
      
      // Shuffle directions
      for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
      }
      
      // Try each direction
      for (const { dr, dc } of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        const midRow = row + dr / 2;
        const midCol = col + dc / 2;
        
        if (
          newRow > 0 && newRow < size - 1 &&
          newCol > 0 && newCol < size - 1 &&
          newMaze[newRow][newCol]
        ) {
          newMaze[midRow][midCol] = false;
          newMaze[newRow][newCol] = false;
          carve(newRow, newCol);
        }
      }
    };
    
    carve(start.row, start.col);
    
    // Set start and end points
    newMaze[1][1] = false; // Start
    newMaze[size - 2][size - 2] = false; // End
    
    setMaze(newMaze);
    setSteps([]);
    setCurrentStep(0);
  };
  
  // Run BFS to solve the maze
  const solveMaze = () => {
    if (maze.length === 0) return;
    
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    const steps: Step[] = [];
    const visited: boolean[][] = Array(15).fill(0).map(() => Array(15).fill(false));
    const queue: { row: number; col: number; path: { row: number; col: number }[] }[] = [
      { row: 1, col: 1, path: [{ row: 1, col: 1 }] }
    ];
    visited[1][1] = true;
    
    // Initial step
    steps.push({
      maze: JSON.parse(JSON.stringify(maze)),
      path: [{ row: 1, col: 1 }],
      description: 'Starting BFS from the entrance.'
    });
    
    while (queue.length > 0) {
      const { row, col, path } = queue.shift()!;
      
      // Check if we reached the end
      if (row === 13 && col === 13) {
        steps.push({
          maze: JSON.parse(JSON.stringify(maze)),
          path,
          description: 'Found the exit!'
        });
        break;
      }
      
      // Check all four directions
      const directions = [
        { dr: 0, dc: 1 },  // right
        { dr: 1, dc: 0 },  // down
        { dr: 0, dc: -1 }, // left
        { dr: -1, dc: 0 }  // up
      ];
      
      for (const { dr, dc } of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (
          newRow >= 0 && newRow < 15 &&
          newCol >= 0 && newCol < 15 &&
          !maze[newRow][newCol] &&
          !visited[newRow][newCol]
        ) {
          visited[newRow][newCol] = true;
          const newPath = [...path, { row: newRow, col: newCol }];
          queue.push({ row: newRow, col: newCol, path: newPath });
          
          steps.push({
            maze: JSON.parse(JSON.stringify(maze)),
            path: newPath,
            description: `Exploring path to (${newRow}, ${newCol}).`
          });
        }
      }
    }
    
    // Final step
    if (queue.length === 0) {
      steps.push({
        maze: JSON.parse(JSON.stringify(maze)),
        path: steps[steps.length - 1].path,
        description: 'No path to the exit found.'
      });
    }
    
    setSteps(steps);
    setCurrentStep(0);
  };
  
  // Control methods
  const startAnimation = () => {
    if (steps.length === 0) {
      solveMaze();
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
    generateMaze();
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
        <PageTitle>Maze Solving</PageTitle>
        <Description>
          The Maze Solving problem finds the shortest path from the start (S) to the end (E) in a maze using BFS.
          The maze is generated using the Recursive Backtracking algorithm.
        </Description>
      </PageHeader>
      
      <InfoPanel>
        <InfoTitle>How Maze Solving Works:</InfoTitle>
        <InfoText>1. The maze is generated using Recursive Backtracking.</InfoText>
        <InfoText>2. BFS is used to find the shortest path from start to end.</InfoText>
        <InfoText>3. The algorithm explores all possible paths level by level.</InfoText>
        <InfoText>4. The first path to reach the end is the shortest path.</InfoText>
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
      
      <MazeContainer>
        <Maze>
          {(steps.length > 0 ? steps[currentStep].maze : maze).map((row, i) => (
            row.map((isWall, j) => (
              <Cell
                key={`${i}-${j}`}
                isWall={isWall}
                isPath={steps.length > 0 && steps[currentStep].path.some(p => p.row === i && p.col === j)}
                isStart={i === 1 && j === 1}
                isEnd={i === 13 && j === 13}
              />
            ))
          ))}
        </Maze>
      </MazeContainer>
      
      {steps.length > 0 && currentStep < steps.length && (
        <InfoPanel>
          <InfoTitle>Current Step:</InfoTitle>
          <InfoText>{steps[currentStep].description}</InfoText>
          <InfoText>
            <strong>Path Length: </strong>
            {steps[currentStep].path.length}
          </InfoText>
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
        <InfoTitle>Applications of Maze Solving:</InfoTitle>
        <InfoText>• Pathfinding in games and robotics</InfoText>
        <InfoText>• Navigation systems</InfoText>
        <InfoText>• Network routing</InfoText>
        <InfoText>• Puzzle solving</InfoText>
      </InfoPanel>
    </PageContainer>
  );
};

export default MazeSolvingPage; 