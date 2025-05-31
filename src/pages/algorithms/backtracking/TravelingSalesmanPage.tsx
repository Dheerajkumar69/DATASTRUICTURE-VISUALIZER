import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
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

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 800px;
  width: 100%;
`;

const Canvas = styled.canvas`
  width: 100%;
  max-width: 600px;
  min-height: 400px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.background};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  width: 100%;
`;

const DistanceMatrix = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  max-width: 800px;
  width: 100%;
  overflow-x: auto;
`;

const MatrixRow = styled.div`
  display: flex;
  justify-content: center;
`;

const MatrixCell = styled.div<{ isHeader?: boolean }>`
  font-family: monospace;
  padding: 0.5rem;
  min-width: 3rem;
  text-align: center;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.isHeader ? props.theme.colors.hover : props.theme.colors.card};
  color: ${props => props.theme.colors.text};
`;

// Types
interface City {
  id: number;
  x: number;
  y: number;
  name: string;
}

interface Path {
  cityIds: number[];
  distance: number;
}

interface Step {
  path: number[];
  currentPath: number[];
  bestPath: number[];
  bestDistance: number;
  currentDistance: number;
  description: string;
}

const TravelingSalesmanPage: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [distances, setDistances] = useState<number[][]>([]);
  const [numCities, setNumCities] = useState<number>(5);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepInfo, setStepInfo] = useState<string>('');
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  const [bestPath, setBestPath] = useState<number[]>([]);
  const [bestDistance, setBestDistance] = useState<number>(Infinity);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize the cities and distances
  useEffect(() => {
    generateRandomCities();
  }, [numCities]);
  
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
  
  // Update info when step changes
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      setStepInfo(step.description);
      setBestPath(step.bestPath);
      setBestDistance(step.bestDistance);
      drawGraph(step);
    }
  }, [currentStep, steps]);
  
  // Draw the graph on canvas
  const drawGraph = useCallback((step?: Step) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scaling
    const padding = 40;
    const maxX = Math.max(...cities.map(city => city.x));
    const maxY = Math.max(...cities.map(city => city.y));
    const scaleX = (canvas.width - padding * 2) / maxX;
    const scaleY = (canvas.height - padding * 2) / maxY;
    
    // Draw connections
    if (step) {
      // Draw current path connections
      if (step.currentPath.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < step.currentPath.length - 1; i++) {
          const city1 = cities.find(c => c.id === step.currentPath[i]);
          const city2 = cities.find(c => c.id === step.currentPath[i + 1]);
          
          if (city1 && city2) {
            ctx.moveTo(padding + city1.x * scaleX, padding + city1.y * scaleY);
            ctx.lineTo(padding + city2.x * scaleX, padding + city2.y * scaleY);
          }
        }
        
        ctx.stroke();
      }
      
      // Draw best path connections
      if (step.bestPath.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 3;
        
        for (let i = 0; i < step.bestPath.length; i++) {
          const city1 = cities.find(c => c.id === step.bestPath[i]);
          const city2 = cities.find(c => c.id === step.bestPath[(i + 1) % step.bestPath.length]);
          
          if (city1 && city2) {
            ctx.moveTo(padding + city1.x * scaleX, padding + city1.y * scaleY);
            ctx.lineTo(padding + city2.x * scaleX, padding + city2.y * scaleY);
          }
        }
        
        ctx.stroke();
      }
    }
    
    // Draw cities
    cities.forEach(city => {
      ctx.beginPath();
      ctx.arc(
        padding + city.x * scaleX,
        padding + city.y * scaleY,
        10,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = '#3498db';
      ctx.fill();
      ctx.strokeStyle = '#2980b9';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw city name
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(city.name, padding + city.x * scaleX, padding + city.y * scaleY);
    });
  }, [cities]);
  
  // Generate random cities
  const generateRandomCities = useCallback(() => {
    const newCities: City[] = [];
    const maxCoord = 100;
    
    for (let i = 0; i < numCities; i++) {
      newCities.push({
        id: i,
        x: Math.floor(Math.random() * maxCoord),
        y: Math.floor(Math.random() * maxCoord),
        name: String.fromCharCode(65 + i) // A, B, C, ...
      });
    }
    
    setCities(newCities);
    calculateDistances(newCities);
    setBestPath([]);
    setBestDistance(Infinity);
    setCurrentStep(0);
    setSteps([]);
    setStepInfo('Cities generated. Click "Start" to begin solving.');
  }, [numCities]);
  
  // Calculate distances between cities
  const calculateDistances = (cities: City[]) => {
    const newDistances: number[][] = [];
    
    for (let i = 0; i < cities.length; i++) {
      newDistances[i] = [];
      for (let j = 0; j < cities.length; j++) {
        if (i === j) {
          newDistances[i][j] = 0;
        } else {
          const dx = cities[i].x - cities[j].x;
          const dy = cities[i].y - cities[j].y;
          newDistances[i][j] = Math.floor(Math.sqrt(dx * dx + dy * dy));
        }
      }
    }
    
    setDistances(newDistances);
    drawGraph();
  };
  
  // Calculate the distance of a path
  const calculatePathDistance = (path: number[]): number => {
    let totalDistance = 0;
    
    for (let i = 0; i < path.length - 1; i++) {
      totalDistance += distances[path[i]][path[i + 1]];
    }
    
    // Add distance from last city back to first
    if (path.length > 1) {
      totalDistance += distances[path[path.length - 1]][path[0]];
    }
    
    return totalDistance;
  };
  
  // Solve TSP using backtracking
  const solveTSP = () => {
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    setSteps([]);
    setBestPath([]);
    setBestDistance(Infinity);
    
    const initialStep: Step = {
      path: [],
      currentPath: [0], // Start from city 0
      bestPath: [],
      bestDistance: Infinity,
      currentDistance: 0,
      description: 'Starting TSP solution. Beginning at city ' + cities[0].name
    };
    
    const steps: Step[] = [initialStep];
    let bestPathFound: number[] = [];
    let bestDistanceFound = Infinity;
    
    const backtrack = (path: number[], visitedCities: Set<number>, currentDistance: number) => {
      // If all cities have been visited
      if (visitedCities.size === cities.length) {
        // Add distance back to starting city to complete the tour
        const completeDistance = currentDistance + distances[path[path.length - 1]][path[0]];
        const completePath = [...path];
        
        if (completeDistance < bestDistanceFound) {
          bestDistanceFound = completeDistance;
          bestPathFound = [...completePath];
          
          steps.push({
            path: [...path],
            currentPath: [...path],
            bestPath: [...bestPathFound],
            bestDistance: bestDistanceFound,
            currentDistance: completeDistance,
            description: `Found new best path with distance ${bestDistanceFound}: ${bestPathFound.map(id => cities[id].name).join(' → ')} → ${cities[bestPathFound[0]].name}`
          });
        } else {
          steps.push({
            path: [...path],
            currentPath: [...path],
            bestPath: [...bestPathFound],
            bestDistance: bestDistanceFound,
            currentDistance: completeDistance,
            description: `Path complete but not better than best (${completeDistance} > ${bestDistanceFound}): ${path.map(id => cities[id].name).join(' → ')} → ${cities[path[0]].name}`
          });
        }
        
        return;
      }
      
      // If the current path is already worse than the best path, prune it
      if (currentDistance >= bestDistanceFound) {
        steps.push({
          path: [...path],
          currentPath: [...path],
          bestPath: [...bestPathFound],
          bestDistance: bestDistanceFound,
          currentDistance,
          description: `Pruning path as current distance ${currentDistance} is already >= best distance ${bestDistanceFound}`
        });
        return;
      }
      
      // Try visiting each unvisited city
      for (let i = 0; i < cities.length; i++) {
        if (!visitedCities.has(i)) {
          const lastCity = path[path.length - 1];
          const newDistance = currentDistance + distances[lastCity][i];
          
          steps.push({
            path: [...path],
            currentPath: [...path, i],
            bestPath: [...bestPathFound],
            bestDistance: bestDistanceFound,
            currentDistance: newDistance,
            description: `Trying city ${cities[i].name} from ${cities[lastCity].name}. Distance so far: ${newDistance}`
          });
          
          path.push(i);
          visitedCities.add(i);
          
          backtrack(path, visitedCities, newDistance);
          
          // Backtrack
          path.pop();
          visitedCities.delete(i);
          
          steps.push({
            path: [...path],
            currentPath: [...path],
            bestPath: [...bestPathFound],
            bestDistance: bestDistanceFound,
            currentDistance,
            description: `Backtracking from ${cities[i].name} to ${cities[lastCity].name}`
          });
        }
      }
    };
    
    const startingCity = 0;
    const initialPath = [startingCity];
    const initialVisited = new Set<number>([startingCity]);
    
    backtrack(initialPath, initialVisited, 0);
    
    const finalStep: Step = {
      path: [],
      currentPath: [],
      bestPath: [...bestPathFound],
      bestDistance: bestDistanceFound,
      currentDistance: 0,
      description: `Solution complete! Best tour has distance ${bestDistanceFound}: ${bestPathFound.map(id => cities[id].name).join(' → ')} → ${cities[bestPathFound[0]].name}`
    };
    
    steps.push(finalStep);
    
    setSteps(steps);
    setCurrentStep(0);
  };
  
  // Control methods
  const startAnimation = () => {
    if (steps.length === 0) {
      solveTSP();
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
    setBestPath([]);
    setBestDistance(Infinity);
    drawGraph();
    setStepInfo('Reset. Click "Start" to begin solving.');
  };
  
  const regenerateCities = () => {
    setIsAnimating(false);
    setIsPaused(false);
    generateRandomCities();
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
  
  const handleNumCitiesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setNumCities(newSize);
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnimationSpeed(parseInt(e.target.value, 10));
  };
  
  // Implementation code
  const tspCode = `// Solving Traveling Salesman Problem using backtracking
function solveTSP(distanceMatrix) {
  const n = distanceMatrix.length;
  let bestPath = [];
  let bestDistance = Infinity;
  
  // Start with city 0
  const startCity = 0;
  const visited = new Set([startCity]);
  const path = [startCity];
  
  function backtrack(currentPath, visitedCities, currentDistance) {
    // Base case: all cities visited
    if (visitedCities.size === n) {
      // Add distance from last city back to start
      const lastCity = currentPath[currentPath.length - 1];
      const completeDistance = currentDistance + distanceMatrix[lastCity][startCity];
      
      // Check if this is a better tour
      if (completeDistance < bestDistance) {
        bestDistance = completeDistance;
        bestPath = [...currentPath];
        console.log(\`New best tour: \${bestDistance}\`);
      }
      return;
    }
    
    // Pruning: if current distance is already worse than best, stop
    if (currentDistance >= bestDistance) {
      return;
    }
    
    // Try each unvisited city as next step
    const lastCity = currentPath[currentPath.length - 1];
    for (let nextCity = 0; nextCity < n; nextCity++) {
      if (!visitedCities.has(nextCity)) {
        // Add city to path
        const newDistance = currentDistance + distanceMatrix[lastCity][nextCity];
        
        currentPath.push(nextCity);
        visitedCities.add(nextCity);
        
        // Recur to build rest of path
        backtrack(currentPath, visitedCities, newDistance);
        
        // Backtrack
        currentPath.pop();
        visitedCities.delete(nextCity);
      }
    }
  }
  
  backtrack(path, visited, 0);
  
  // Complete the cycle by adding start city to the end
  const completeTour = [...bestPath, startCity];
  return { tour: completeTour, distance: bestDistance };
}

// Example usage:
const distances = [
  [0, 10, 15, 20],
  [10, 0, 35, 25],
  [15, 35, 0, 30],
  [20, 25, 30, 0]
];

const { tour, distance } = solveTSP(distances);
console.log(\`Best tour: \${tour.join(' → ')}\`);
console.log(\`Tour distance: \${distance}\`);`;
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/backtracking">
          <FaArrowLeft /> Back to Backtracking Algorithms
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Traveling Salesman Problem</PageTitle>
        <Description>
          The Traveling Salesman Problem (TSP) asks: &ldquo;Given a list of cities and the distances between each pair of cities, 
          what is the shortest possible route that visits each city exactly once and returns to the origin city?&rdquo; 
          This is an NP-hard problem in combinatorial optimization. This visualization shows how backtracking with pruning
          can be used to find the optimal solution.
        </Description>
      </PageHeader>
      
      <InfoPanel>
        <InfoTitle>How to use this visualization:</InfoTitle>
        <InfoText>1. Select the number of cities using the dropdown.</InfoText>
        <InfoText>2. Click &ldquo;Regenerate&rdquo; to create a new random set of cities.</InfoText>
        <InfoText>3. Click &ldquo;Start&rdquo; to begin the visualization of the backtracking algorithm.</InfoText>
        <InfoText>4. Use the controls to pause, step forward/backward, or reset the visualization.</InfoText>
        <InfoText>5. The current path being explored is shown in orange, while the best path found so far is shown in green.</InfoText>
      </InfoPanel>
      
      <ControlsContainer>
        <SizeSelector>
          <SizeLabel>Cities:</SizeLabel>
          <SizeSelect value={numCities} onChange={handleNumCitiesChange} disabled={isAnimating && !isPaused}>
            <option value="4">4 Cities</option>
            <option value="5">5 Cities</option>
            <option value="6">6 Cities</option>
            <option value="7">7 Cities</option>
            <option value="8">8 Cities</option>
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
        
        <Button onClick={regenerateCities} disabled={isAnimating && !isPaused}>
          Regenerate
        </Button>
        
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
          {bestDistance !== Infinity && (
            <InfoText>Best distance found: {bestDistance}</InfoText>
          )}
        </InfoPanel>
      )}
      
      <GraphContainer>
        <Canvas ref={canvasRef} />
      </GraphContainer>
      
      <InfoPanel>
        <InfoTitle>Distance Matrix:</InfoTitle>
        <DistanceMatrix>
          <MatrixRow>
            <MatrixCell isHeader>Cities</MatrixCell>
            {cities.map(city => (
              <MatrixCell key={city.id} isHeader>{city.name}</MatrixCell>
            ))}
          </MatrixRow>
          {cities.map((city, i) => (
            <MatrixRow key={city.id}>
              <MatrixCell isHeader>{city.name}</MatrixCell>
              {cities.map((otherCity, j) => (
                <MatrixCell key={`${i}-${j}`}>
                  {distances[i] && distances[i][j] !== undefined ? distances[i][j] : '-'}
                </MatrixCell>
              ))}
            </MatrixRow>
          ))}
        </DistanceMatrix>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Implementation Code:</InfoTitle>
        <CodeContainer>
          <Suspense fallback={<div>Loading code...</div>}>
            <SyntaxHighlighter language="javascript" style={vs2015}>
              {tspCode}
            </SyntaxHighlighter>
          </Suspense>
        </CodeContainer>
      </InfoPanel>
    </PageContainer>
  );
};

export default TravelingSalesmanPage; 