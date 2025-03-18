import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaStepForward, FaStepBackward } from 'react-icons/fa';

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

const WordInputContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 800px;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const WordLadderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 800px;
`;

const WordStep = styled.div<{ isActive: boolean }>`
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.card};
  color: ${props => props.isActive ? '#ffffff' : props.theme.colors.text};
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 1.2rem;
  font-weight: 500;
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
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
`;

interface Step {
  word: string;
  description: string;
}

const WordLadderPage: React.FC = () => {
  const [startWord, setStartWord] = useState<string>('hit');
  const [endWord, setEndWord] = useState<string>('cog');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  
  // Sample word list (in a real application, this would be a larger dictionary)
  const wordList = [
    'hot', 'dot', 'dog', 'lot', 'log', 'cog',
    'hit', 'hat', 'cat', 'bat', 'bag', 'big',
    'pig', 'pin', 'pan', 'pen', 'pet', 'get',
    'let', 'lit', 'sit', 'sat', 'rat', 'rag',
    'tag', 'tan', 'tin', 'ton', 'toy', 'try'
  ];
  
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
  
  // Check if two words differ by exactly one letter
  const isOneLetterDifferent = (word1: string, word2: string): boolean => {
    if (word1.length !== word2.length) return false;
    let differences = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] !== word2[i]) differences++;
      if (differences > 1) return false;
    }
    return differences === 1;
  };
  
  // Find the shortest word ladder using BFS
  const findWordLadder = () => {
    if (startWord.length !== endWord.length) {
      setSteps([{
        word: startWord,
        description: 'No solution found: Words must be the same length.'
      }]);
      return;
    }
    
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    const visited = new Set<string>();
    const queue: { word: string; path: string[] }[] = [
      { word: startWord, path: [startWord] }
    ];
    visited.add(startWord);
    
    // Initial step
    setSteps([{
      word: startWord,
      description: 'Starting with the initial word.'
    }]);
    
    while (queue.length > 0) {
      const { word, path } = queue.shift()!;
      
      // Check if we reached the end word
      if (word === endWord) {
        setSteps(path.map((w, i) => ({
          word: w,
          description: i === 0 ? 'Starting word.' :
                      i === path.length - 1 ? 'Reached the target word!' :
                      `Changed one letter from "${path[i-1]}" to "${w}".`
        })));
        return;
      }
      
      // Find all words that differ by one letter
      for (const nextWord of wordList) {
        if (!visited.has(nextWord) && isOneLetterDifferent(word, nextWord)) {
          visited.add(nextWord);
          queue.push({
            word: nextWord,
            path: [...path, nextWord]
          });
        }
      }
    }
    
    // No solution found
    setSteps([{
      word: startWord,
      description: 'No solution found: No valid word ladder exists.'
    }]);
  };
  
  // Control methods
  const startAnimation = () => {
    if (steps.length === 0) {
      findWordLadder();
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
    setSteps([]);
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
        <PageTitle>Word Ladder</PageTitle>
        <Description>
          The Word Ladder problem finds the shortest sequence of words that transforms one word into another,
          where each word in the sequence differs from the previous word by exactly one letter.
        </Description>
      </PageHeader>
      
      <InfoPanel>
        <InfoTitle>How Word Ladder Works:</InfoTitle>
        <InfoText>1. Start with the initial word.</InfoText>
        <InfoText>2. Find all words that differ by exactly one letter.</InfoText>
        <InfoText>3. Use BFS to find the shortest path to the target word.</InfoText>
        <InfoText>4. Each step must be a valid word from the dictionary.</InfoText>
      </InfoPanel>
      
      <WordInputContainer>
        <Input
          type="text"
          value={startWord}
          onChange={(e) => setStartWord(e.target.value.toLowerCase())}
          placeholder="Start word"
          maxLength={4}
        />
        <Input
          type="text"
          value={endWord}
          onChange={(e) => setEndWord(e.target.value.toLowerCase())}
          placeholder="End word"
          maxLength={4}
        />
      </WordInputContainer>
      
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
      
      <WordLadderContainer>
        {steps.map((step, index) => (
          <WordStep
            key={index}
            isActive={index === currentStep}
          >
            {step.word}
          </WordStep>
        ))}
      </WordLadderContainer>
      
      {steps.length > 0 && currentStep < steps.length && (
        <InfoPanel>
          <InfoTitle>Current Step:</InfoTitle>
          <InfoText>{steps[currentStep].description}</InfoText>
          <InfoText>
            <strong>Step: </strong>
            {currentStep + 1} of {steps.length}
          </InfoText>
        </InfoPanel>
      )}
      
      <InfoPanel>
        <InfoTitle>Time & Space Complexity:</InfoTitle>
        <InfoText>
          <strong>Time Complexity:</strong> O(N × L) where N is the number of words in the dictionary and L is the length of the words.
        </InfoText>
        <InfoText>
          <strong>Space Complexity:</strong> O(N) for the visited set and queue.
        </InfoText>
      </InfoPanel>
      
      <InfoPanel>
        <InfoTitle>Applications of Word Ladder:</InfoTitle>
        <InfoText>• Spell checking and correction</InfoText>
        <InfoText>• Word games and puzzles</InfoText>
        <InfoText>• Natural language processing</InfoText>
        <InfoText>• DNA sequence analysis</InfoText>
      </InfoPanel>
    </PageContainer>
  );
};

export default WordLadderPage; 