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

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 800px;
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 600px;
  height: 400px;
  background-color: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
  }
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
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

interface City {
  id: number;
  x: number;
  y: number;
  name: string;
}

interface Step {
  path: number[];
  currentDistance: number;
  bestPath: number[];
  bestDistance: number;
  description: string;
}

const TravelingSalesmanPage: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  const [numCities, setNumCities] = useState<number>(6);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize cities
  useEffect(() => {
    generateRandomCities();
  }, [numCities]);
  
  // Setup canvas and render
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        renderGraph(ctx);
      }
    }
  }, [cities, currentStep, steps]);
  
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
  
  // Generate random cities
  const generateRandomCities = () => {
    const newCities: City[] = [];
    const canvasWidth = 600;
    const canvasHeight = 400;
    const padding = 50;
    
    const cityNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    for (let i = 0; i < numCities; i++) {
      newCities.push({
        id: i,
        x: Math.random() * (canvasWidth - 2 * padding) + padding,
        y: Math.random() * (canvasHeight - 2 * padding) + padding,
        name: cityNames[i]
      });
    }
    
    setCities(newCities);
    setSteps([]);
    setCurrentStep(0);
  };
  
  // Calculate distance between two cities
  const calculateDistance = (city1: City, city2: City): number => {
    const dx = city1.x - city2.x;
    const dy = city1.y - city2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Calculate total distance of a path
  const calculatePathDistance = (path: number[]): number => {
    let distance = 0;
    
    for (let i = 0; i < path.length - 1; i++) {
      distance += calculateDistance(cities[path[i]], cities[path[i + 1]]);
    }
    
    // Add distance from last city back to first
    if (path.length > 0) {
      distance += calculateDistance(cities[path[path.length - 1]], cities[path[0]]);
    }
    
    return distance;
  };
  
  // Run TSP algorithm (Nearest Neighbor + 2-opt for demonstration)
  const runTSP = () => {
    if (cities.length === 0) return;
    
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    const steps: Step[] = [];
    
    // Initialize with Nearest Neighbor algorithm
    const nnPath = nearestNeighborPath();
    const nnDistance = calculatePathDistance(nnPath);
    
    steps.push({
      path: [...nnPath],
      currentDistance: nnDistance,
      bestPath: [...nnPath],
      bestDistance: nnDistance,
      description: 'Initial path using Nearest Neighbor algorithm.'
    });
    
    // Apply 2-opt improvement
    let bestPath = [...nnPath];
    let bestDistance = nnDistance;
    let improved = true;
    
    while (improved) {
      improved = false;
      
      for (let i = 1; i < bestPath.length - 1; i++) {
        for (let j = i + 1; j < bestPath.length; j++) {
          // Skip adjacent edges
          if (j - i === 1) continue;
          
          // Create new path with edges between i-1 to i and j to j+1 replaced
          const newPath = [...bestPath];
          // Reverse the segment between i and j
          reverseSegment(newPath, i, j);
          
          const newDistance = calculatePathDistance(newPath);
          
          if (newDistance < bestDistance) {
            bestPath = [...newPath];
            bestDistance = newDistance;
            improved = true;
            
            steps.push({
              path: [...newPath],
              currentDistance: newDistance,
              bestPath: [...newPath],
              bestDistance: newDistance,
              description: `2-opt improvement: Swapped edges between ${cities[bestPath[i-1]].name}-${cities[bestPath[i]].name} and ${cities[bestPath[j]].name}-${cities[bestPath[(j+1) % bestPath.length]].name}.`
            });
          }
        }
      }
    }
    
    // Final step
    steps.push({
      path: [...bestPath],
      currentDistance: bestDistance,
      bestPath: [...bestPath],
      bestDistance: bestDistance,
      description: `Final TSP tour with distance ${bestDistance.toFixed(2)}.`
    });
    
    setSteps(steps);
    setCurrentStep(0);
  };
  
  // Helper function to reverse a segment of array
  const reverseSegment = (arr: number[], i: number, j: number) => {
    while (i < j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
      j--;
    }
  };
  
  // Nearest Neighbor algorithm
  const nearestNeighborPath = (): number[] => {
    const path: number[] = [0]; // Start from first city
    const unvisited = new Set(cities.map((_, i) => i).filter(i => i !== 0));
    
    while (unvisited.size > 0) {
      const lastCity = cities[path[path.length - 1]];
      let minDistance = Infinity;
      let nextCityId = -1;
      
      for (const cityId of Array.from(unvisited)) {
        const distance = calculateDistance(lastCity, cities[cityId]);
        if (distance < minDistance) {
          minDistance = distance;
          nextCityId = cityId;
        }
      }
      
      path.push(nextCityId);
      unvisited.delete(nextCityId);
    }
    
    return path;
  };
  
  // Render the graph on canvas
  const renderGraph = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    if (steps.length > 0 && currentStep < steps.length) {
      const currentPath = steps[currentStep].path;
      
      ctx.beginPath();
      ctx.strokeStyle = '#4caf50';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < currentPath.length; i++) {
        const city1 = cities[currentPath[i]];
        const city2 = cities[currentPath[(i + 1) % currentPath.length]];
        
        ctx.moveTo(city1.x, city1.y);
        ctx.lineTo(city2.x, city2.y);
      }
      
      ctx.stroke();
    }
    
    // Draw cities
    cities.forEach(city => {
      ctx.beginPath();
      ctx.fillStyle = '#2196f3';
      ctx.arc(city.x, city.y, 10, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw city name
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(city.name, city.x, city.y);
    });
  };
  
  // Control methods
  const startAnimation = () => {
    if (steps.length === 0) {
      runTSP();
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
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnimationSpeed(parseInt(e.target.value, 10));
  };
  
  const handleNumCitiesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumCities(parseInt(e.target.value, 10));
  };
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/problems">
          <FaArrowLeft /> Back to Problems
        </BackButton>
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Traveling Salesman Problem</PageTitle>
        <Description>
          The Traveling Salesman Problem (TSP) is a classic optimization problem where the goal is to find
          the shortest route that visits each city exactly once and returns to the origin city.
        </Description>
      </PageHeader>
      
      <InfoPanel>
        <InfoTitle>How TSP Works:</InfoTitle>
        <InfoText>1. Start with a set of cities and distances between each pair.</InfoText>
        <InfoText>2. Find an initial path using the Nearest Neighbor algorithm.</InfoText>
        <InfoText>3. Apply the 2-opt algorithm to improve the path by swapping edges.</InfoText>
        <InfoText>4. Continue until no more improvements can be made.</InfoText>
      </InfoPanel>
      
      <ControlsContainer>
        <Select value={numCities} onChange={handleNumCitiesChange}>
          <option value="4">4 Cities</option>
          <option value="5">5 Cities</option>
          <option value="6">6 Cities</option>
          <option value="7">7 Cities</option>
          <option value="8">8 Cities</option>
        </Select>
        
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
      
      <GraphContainer>
        <CanvasContainer>
          <Canvas 
            ref={canvasRef} 
            width={600} 
            height={400}
          />
        </CanvasContainer>
      </GraphContainer>
      
      {steps.length > 0 && currentStep < steps.length && (
        <InfoPanel>
          <InfoTitle>Current Step:</InfoTitle>
          <InfoText>{steps[currentStep].description}</InfoText>
          <InfoText>
            <strong>Current Distance: </strong>
            {steps[currentStep].currentDistance.toFixed(2)} units
          </InfoText>
          {steps[currentStep].bestDistance !== steps[currentStep].currentDistance && (
            <InfoText>
              <strong>Best Distance: </strong>
              {steps[currentStep].bestDistance.toFixed(2)} units
            </InfoText>
          )}
        </InfoPanel>
      )}
      
      <InfoPanel>
        <InfoTitle>Time & Space Complexity:</InfoTitle>
        <InfoText>
          <strong>Time Complexity:</strong> O(n!) for the exact solution. The 2-opt heuristic is O(n²).
        </InfoText>
        <InfoText>
          <strong>Space Complexity:</strong> O(n) for storing the tour.
        </InfoText>
        <InfoText>
          <strong>Note:</strong> TSP is NP-hard, meaning there's no known polynomial-time exact algorithm.
          This visualization uses a heuristic approach that finds reasonably good but not necessarily optimal solutions.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications of TSP:</InfoTitle>
        <InfoText>• Logistics and transportation planning</InfoText>
        <InfoText>• Circuit board drilling in manufacturing</InfoText>
        <InfoText>• DNA sequencing in bioinformatics</InfoText>
        <InfoText>• Delivery route optimization</InfoText>
        <InfoText>• Telescope scheduling for astronomical observations</InfoText>
      </InfoPanel>
    </PageContainer>
  );
};

export default TravelingSalesmanPage; 