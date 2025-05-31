import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { FaArrowRight } from 'react-icons/fa';
import ProblemPageTemplate from '../../../components/templates/ProblemPageTemplate';
import { AlgorithmInfo } from '../../../types/algorithm';
import VisualizationControls from '../../../components/visualization/VisualizationControls';
import {
  VisualizationContainer,
  StepInfo,
  InfoPanel,
  Input,
  TextArea,
  Legend
} from '../../../components/visualization/VisualizationComponents';
import useVisualizationState from '../../../hooks/useVisualizationState';

// Styled components specific to WordLadder
const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
`;

const WordNode = styled.div<{ state: 'current' | 'visited' | 'unvisited' | 'start' | 'end' | 'path' | 'rejected' }>`
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  background-color: ${props => {
    switch (props.state) {
      case 'current': return props.theme.colors.primary;
      case 'visited': return props.theme.colors.secondary;
      case 'path': return props.theme.colors.success;
      case 'start': return props.theme.colors.info;
      case 'end': return props.theme.colors.warning;
      case 'rejected': return props.theme.colors.danger;
      default: return props.theme.colors.background;
    }
  }};
  color: ${props => 
    props.state === 'unvisited' ? props.theme.colors.text : 'white'
  };
  border-radius: ${props => props.theme.borderRadius};
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const LevelIndicator = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: ${props => props.theme.colors.textLight};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
`;

const WordPath = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1.5rem 0;
  width: 100%;
`;

const ArrowIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.textLight};
  margin: 0 0.5rem;
`;

const VisitedWordsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius};
  background-color: rgba(0, 0, 0, 0.02);
`;

const RejectedWordsContainer = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 1.5rem;
`;

const WordListInput = styled(TextArea)`
  width: 300px;
  height: 100px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: 0.75rem;
  font-size: 0.9rem;
`;

const QueueItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.5rem;
`;

const QueueItemLevel = styled.span`
  font-size: 0.7rem;
  margin-top: 0.25rem;
  color: ${props => props.theme.colors.textLight};
  font-weight: bold;
`;

// Types for visualization
interface Step {
  currentWord: string;
  visited: Set<string>;
  queue: Array<{word: string, path: string[], level: number}>;
  description: string;
  pathFound: boolean;
  finalPath: string[] | null;
  rejected: Array<{word: string, reason: string}>;
}

// Word Ladder Algorithm
const wordLadderInfo: AlgorithmInfo = {
  name: "Word Ladder",
  description: "Word Ladder is a graph problem where we need to find the shortest transformation sequence from a start word to an end word, such that only one letter can be changed at a time, and each transformed word must exist in a given word list.",
  timeComplexity: {
    best: 'O(n * m^2)',
    average: 'O(n * m^2)',
    worst: 'O(n * m^2)'
  },
  spaceComplexity: 'O(n * m)',
  implementations: {
    javascript: `function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  
  // If the end word is not in the dictionary, return 0
  if (!wordSet.has(endWord)) return 0;
  
  // Create a queue for BFS
  const queue = [];
  queue.push({ word: beginWord, length: 1 });
  
  // To avoid visiting the same word again
  const visited = new Set();
  visited.add(beginWord);
  
  while (queue.length > 0) {
    const { word, length } = queue.shift();
    
    // Try changing each character of the word
    for (let i = 0; i < word.length; i++) {
      // Try replacing the character with all letters
      for (let c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
        const newChar = String.fromCharCode(c);
        
        // Skip if it's the same character
        if (word[i] === newChar) continue;
        
        // Create a new word by replacing the character
        const newWord = word.slice(0, i) + newChar + word.slice(i + 1);
        
        // If we reached the end word, return the length + 1
        if (newWord === endWord) return length + 1;
        
        // If the word is in the dictionary and not visited
        if (wordSet.has(newWord) && !visited.has(newWord)) {
          visited.add(newWord);
          queue.push({ word: newWord, length: length + 1 });
        }
      }
    }
  }
  
  // If no transformation sequence is found
  return 0;
}`,
    python: `def ladder_length(begin_word, end_word, word_list):
    word_set = set(word_list)
    
    # If the end word is not in the dictionary, return 0
    if end_word not in word_set:
        return 0
    
    # Create a queue for BFS
    queue = [(begin_word, 1)]
    
    # To avoid visiting the same word again
    visited = {begin_word}
    
    while queue:
        word, length = queue.pop(0)
        
        # Try changing each character of the word
        for i in range(len(word)):
            # Try replacing the character with all letters
            for c in 'abcdefghijklmnopqrstuvwxyz':
                # Skip if it's the same character
                if word[i] == c:
                    continue
                
                # Create a new word by replacing the character
                new_word = word[:i] + c + word[i+1:]
                
                # If we reached the end word, return the length + 1
                if new_word == end_word:
                    return length + 1
                
                # If the word is in the dictionary and not visited
                if new_word in word_set and new_word not in visited:
                    visited.add(new_word)
                    queue.append((new_word, length + 1))
    
    # If no transformation sequence is found
    return 0`,
    java: `public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> wordSet = new HashSet<>(wordList);
    
    // If the end word is not in the dictionary, return 0
    if (!wordSet.contains(endWord)) return 0;
    
    // Create a queue for BFS
    Queue<Pair<String, Integer>> queue = new LinkedList<>();
    queue.offer(new Pair<>(beginWord, 1));
    
    // To avoid visiting the same word again
    Set<String> visited = new HashSet<>();
    visited.add(beginWord);
    
    while (!queue.isEmpty()) {
        Pair<String, Integer> current = queue.poll();
        String word = current.getKey();
        int length = current.getValue();
        
        // Try changing each character of the word
        for (int i = 0; i < word.length(); i++) {
            char[] wordChars = word.toCharArray();
            
            // Try replacing the character with all letters
            for (char c = 'a'; c <= 'z'; c++) {
                // Skip if it's the same character
                if (word.charAt(i) == c) continue;
                
                wordChars[i] = c;
                String newWord = new String(wordChars);
                
                // If we reached the end word, return the length + 1
                if (newWord.equals(endWord)) return length + 1;
                
                // If the word is in the dictionary and not visited
                if (wordSet.contains(newWord) && !visited.contains(newWord)) {
                    visited.add(newWord);
                    queue.offer(new Pair<>(newWord, length + 1));
                }
            }
        }
    }
    
    // If no transformation sequence is found
    return 0;
}`,
    cpp: `int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> wordSet(wordList.begin(), wordList.end());
    
    // If the end word is not in the dictionary, return 0
    if (wordSet.find(endWord) == wordSet.end()) return 0;
    
    // Create a queue for BFS
    queue<pair<string, int>> q;
    q.push({beginWord, 1});
    
    // To avoid visiting the same word again
    unordered_set<string> visited;
    visited.insert(beginWord);
    
    while (!q.empty()) {
        auto current = q.front(); q.pop();
        string word = current.first;
        int length = current.second;
        
        // Try changing each character of the word
        for (int i = 0; i < word.size(); i++) {
            char originalChar = word[i];
            
            // Try replacing the character with all letters
            for (char c = 'a'; c <= 'z'; c++) {
                // Skip if it's the same character
                if (word[i] == c) continue;
                
                word[i] = c;
                
                // If we reached the end word, return the length + 1
                if (word == endWord) return length + 1;
                
                // If the word is in the dictionary and not visited
                if (wordSet.find(word) != wordSet.end() && visited.find(word) == visited.end()) {
                    visited.insert(word);
                    q.push({word, length + 1});
                }
            }
            
            // Revert the change
            word[i] = originalChar;
        }
    }
    
    // If no transformation sequence is found
    return 0;
}`
  }
};

const problemDescription = `
Given two words, beginWord and endWord, and a dictionary wordList, find the length of the shortest transformation sequence from beginWord to endWord.

Rules for transformation:
1. Only one letter can be changed at a time.
2. Each transformed word must exist in the wordList.
3. beginWord is not a part of wordList, but endWord is.

For example, given:
- beginWord = "hit"
- endWord = "cog"
- wordList = ["hot", "dot", "dog", "lot", "log", "cog"]

The shortest transformation sequence would be: "hit" -> "hot" -> "dot" -> "dog" -> "cog"
So the length of the shortest transformation sequence is 5.

The algorithm uses a breadth-first search (BFS) approach to find the shortest path from beginWord to endWord. For each word, it tries changing each character to every possible letter and checks if the new word exists in the dictionary and hasn't been visited yet.
`;

// Helper function to find if two words differ by exactly one character
const differByOne = (word1: string, word2: string): boolean => {
  if (word1.length !== word2.length) return false;
  
  let diffCount = 0;
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] !== word2[i]) diffCount++;
    if (diffCount > 1) return false;
  }
  
  return diffCount === 1;
};

// Main component
const WordLadderPage: React.FC = () => {
  // State for inputs
  const [beginWord, setBeginWord] = useState<string>('hit');
  const [endWord, setEndWord] = useState<string>('cog');
  const [wordListInput, setWordListInput] = useState<string>('hot,dot,dog,lot,log,cog');
  
  // Use our custom hook for visualization state
  const visualization = useVisualizationState<Step>();
  
  // Legend data
  const legendItems = useMemo(() => [
    { color: '#4299E1', label: 'Start Word' },  // info color
    { color: '#ED8936', label: 'End Word' },    // warning color
    { color: '#4A5568', label: 'Unvisited Word' }, // background color
    { color: '#3182CE', label: 'Current Word' }, // primary color
    { color: '#718096', label: 'Visited Word' }, // secondary color
    { color: '#48BB78', label: 'Path Word' },   // success color
    { color: '#E53E3E', label: 'Rejected Word' } // danger color
  ], []);
  
  // Bi-directional BFS implementation
  const findWordLadderBidirectional = useCallback(() => {
    if (!beginWord || !endWord) return;
    
    // Parse word list
    const wordList = wordListInput.split(',').map(w => w.trim());
    const wordSet = new Set(wordList);
    
    // Check if end word is in the dictionary
    if (!wordSet.has(endWord)) {
      alert('End word must be in the word list!');
      return;
    }
    
    const steps: Step[] = [];
    
    // Initialize BFS from start side
    const startQueue: Array<{word: string, path: string[], level: number}> = [];
    startQueue.push({ word: beginWord, path: [beginWord], level: 1 });
    
    // Initialize BFS from end side
    const endQueue: Array<{word: string, path: string[], level: number}> = [];
    endQueue.push({ word: endWord, path: [endWord], level: 1 });
    
    const startVisited = new Map<string, string[]>();
    startVisited.set(beginWord, [beginWord]);
    
    const endVisited = new Map<string, string[]>();
    endVisited.set(endWord, [endWord]);
    
    const rejected: Array<{word: string, reason: string}> = [];
    
    // Initial step
    steps.push({
      currentWord: beginWord,
      visited: new Set([beginWord]),
      queue: [...startQueue],
      description: `Starting bidirectional BFS between "${beginWord}" and "${endWord}". This will search from both ends simultaneously.`,
      pathFound: false,
      finalPath: null,
      rejected: []
    });
    
    // Keep track of the shortest path found
    let shortestPath: string[] | null = null;
    
    // While both queues are not empty
    while (startQueue.length > 0 && endQueue.length > 0) {
      // Process level by level to ensure shortest path
      // Expand from start side
      const startLevel = startQueue[0].level;
      const startQueueSize = startQueue.length;
      
      for (let i = 0; i < startQueueSize; i++) {
        const { word, path, level } = startQueue.shift()!;
        
        // If we've already found a shorter path, skip
        if (shortestPath !== null && path.length >= shortestPath.length) continue;
        
        // Check each possible transformation
        for (let j = 0; j < word.length; j++) {
          for (let c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
            const newChar = String.fromCharCode(c);
            
            if (word[j] === newChar) continue;
            
            const newWord = word.slice(0, j) + newChar + word.slice(j + 1);
            
            // Skip if already visited from start side
            if (startVisited.has(newWord)) continue;
            
            // Check if in dictionary
            if (!wordSet.has(newWord) && newWord !== endWord) {
              // Record rejected word
              rejected.push({
                word: newWord,
                reason: "Not in dictionary"
              });
              continue;
            }
            
            // Create new path
            const newPath = [...path, newWord];
            
            // Check if the word has been visited from the end side
            if (endVisited.has(newWord)) {
              // We found a meeting point - construct full path
              const endPath = endVisited.get(newWord)!;
              const fullPath = [...newPath.slice(0, -1), ...endPath.reverse()];
              
              // Update shortest path if this is shorter
              if (shortestPath === null || fullPath.length < shortestPath.length) {
                shortestPath = fullPath;
              }
              
              steps.push({
                currentWord: newWord,
                visited: new Set([...Array.from(startVisited.keys()), ...Array.from(endVisited.keys())]),
                queue: [],
                description: `Found meeting point at "${newWord}"! Created path with length ${fullPath.length}.`,
                pathFound: true,
                finalPath: fullPath,
                rejected: [...rejected]
              });
              
              // We can exit early if we're at the last level
              if (i === startQueueSize - 1) {
                visualization.setSteps(steps);
                return;
              }
            }
            
            // Add to queue and visited
            startQueue.push({ word: newWord, path: newPath, level: level + 1 });
            startVisited.set(newWord, newPath);
            
            // Add step
            steps.push({
              currentWord: newWord,
              visited: new Set([...Array.from(startVisited.keys()), ...Array.from(endVisited.keys())]),
              queue: [...startQueue, ...endQueue],
              description: `From start side: Visiting "${newWord}" at level ${level + 1}.`,
              pathFound: false,
              finalPath: null,
              rejected: [...rejected]
            });
          }
        }
      }
      
      // Expand from end side
      const endLevel = endQueue[0].level;
      const endQueueSize = endQueue.length;
      
      for (let i = 0; i < endQueueSize; i++) {
        const { word, path, level } = endQueue.shift()!;
        
        // If we've already found a shorter path, skip
        if (shortestPath !== null && path.length >= shortestPath.length) continue;
        
        // Check each possible transformation
        for (let j = 0; j < word.length; j++) {
          for (let c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
            const newChar = String.fromCharCode(c);
            
            if (word[j] === newChar) continue;
            
            const newWord = word.slice(0, j) + newChar + word.slice(j + 1);
            
            // Skip if already visited from end side
            if (endVisited.has(newWord)) continue;
            
            // Check if in dictionary
            if (!wordSet.has(newWord) && newWord !== beginWord) {
              // Record rejected word
              rejected.push({
                word: newWord,
                reason: "Not in dictionary"
              });
              continue;
            }
            
            // Create new path (note: path is stored in reverse order for end side)
            const newPath = [newWord, ...path];
            
            // Check if the word has been visited from the start side
            if (startVisited.has(newWord)) {
              // We found a meeting point - construct full path
              const startPath = startVisited.get(newWord)!;
              const fullPath = [...startPath, ...path.slice(1).reverse()];
              
              // Update shortest path if this is shorter
              if (shortestPath === null || fullPath.length < shortestPath.length) {
                shortestPath = fullPath;
              }
              
              steps.push({
                currentWord: newWord,
                visited: new Set([...Array.from(startVisited.keys()), ...Array.from(endVisited.keys())]),
                queue: [],
                description: `Found meeting point at "${newWord}"! Created path with length ${fullPath.length}.`,
                pathFound: true,
                finalPath: fullPath,
                rejected: [...rejected]
              });
              
              // We can exit early if we're at the last level
              if (i === endQueueSize - 1) {
                visualization.setSteps(steps);
                return;
              }
            }
            
            // Add to queue and visited
            endQueue.push({ word: newWord, path: newPath, level: level + 1 });
            endVisited.set(newWord, newPath);
            
            // Add step
            steps.push({
              currentWord: newWord,
              visited: new Set([...Array.from(startVisited.keys()), ...Array.from(endVisited.keys())]),
              queue: [...startQueue, ...endQueue],
              description: `From end side: Visiting "${newWord}" at level ${level + 1}.`,
              pathFound: false,
              finalPath: null,
              rejected: [...rejected]
            });
          }
        }
      }
    }
    
    // If no path is found
    if (shortestPath === null) {
      steps.push({
        currentWord: beginWord,
        visited: new Set([...Array.from(startVisited.keys()), ...Array.from(endVisited.keys())]),
        queue: [],
        description: `No transformation sequence found from "${beginWord}" to "${endWord}".`,
        pathFound: false,
        finalPath: null,
        rejected: [...rejected]
      });
    }
    
    visualization.setSteps(steps);
  }, [beginWord, endWord, wordListInput, visualization]);
  
  // UI Handlers
  const handleStart = () => {
    if (visualization.steps.length === 0) {
      findWordLadderBidirectional();
    } else {
      visualization.startAnimation();
    }
  };
  
  // Render visualization
  const renderVisualization = () => {
    const currentStepData = visualization.currentStepData;
    
    if (!currentStepData) {
      return (
        <StepInfo>
          Configure the word ladder problem and click "Start" to see the visualization.
        </StepInfo>
      );
    }
    
    // Render path if found
    if (currentStepData.pathFound && currentStepData.finalPath) {
      return (
        <>
          <StepInfo>{currentStepData.description}</StepInfo>
          <WordPath>
            {currentStepData.finalPath.map((word, index) => (
              <React.Fragment key={index}>
                <WordNode 
                  state={
                    index === 0 ? 'start' : 
                    index === currentStepData.finalPath!.length - 1 ? 'end' : 
                    'path'
                  }
                  aria-label={`${word} - ${
                    index === 0 ? 'start word' : 
                    index === currentStepData.finalPath!.length - 1 ? 'end word' : 
                    'path word'
                  }`}
                >
                  {word}
                  <LevelIndicator>{index + 1}</LevelIndicator>
                </WordNode>
                {index < currentStepData.finalPath!.length - 1 && (
                  <ArrowIcon aria-hidden="true">
                    <FaArrowRight />
                  </ArrowIcon>
                )}
              </React.Fragment>
            ))}
          </WordPath>
        </>
      );
    }
    
    // Render current state
    return (
      <>
        <StepInfo>{currentStepData.description}</StepInfo>
        <WordPath>
          <WordNode state="current" aria-label={`Current word: ${currentStepData.currentWord}`}>
            {currentStepData.currentWord}
          </WordNode>
        </WordPath>
        
        <InfoPanel>
          <h4>Queue (Next Words to Process):</h4>
          <WordPath>
            {currentStepData.queue.map((item, index) => (
              <QueueItemContainer key={index}>
                <WordNode 
                  state="unvisited"
                  aria-label={`Queued word: ${item.word}, level: ${item.level}`}
                >
                  {item.word}
                </WordNode>
                <QueueItemLevel>Level: {item.level}</QueueItemLevel>
              </QueueItemContainer>
            )).slice(0, 10)}
            {currentStepData.queue.length > 10 && <span>... and {currentStepData.queue.length - 10} more</span>}
          </WordPath>
          
          <h4>Visited Words:</h4>
          <VisitedWordsContainer>
            {Array.from(currentStepData.visited).map((word, index) => (
              <WordNode 
                key={index} 
                state={
                  word === beginWord ? 'start' : 
                  word === endWord ? 'end' : 
                  word === currentStepData.currentWord ? 'current' : 
                  'visited'
                }
                aria-label={`${word} - ${
                  word === beginWord ? 'start word' : 
                  word === endWord ? 'end word' : 
                  word === currentStepData.currentWord ? 'current word' : 
                  'visited word'
                }`}
              >
                {word}
              </WordNode>
            ))}
          </VisitedWordsContainer>
          
          {currentStepData.rejected.length > 0 && (
            <RejectedWordsContainer>
              <h4>Rejected Words:</h4>
              <VisitedWordsContainer>
                {currentStepData.rejected.slice(-10).map((item, index) => (
                  <WordNode 
                    key={index} 
                    state="rejected"
                    aria-label={`Rejected word: ${item.word}, reason: ${item.reason}`}
                    title={item.reason}
                  >
                    {item.word}
                  </WordNode>
                ))}
                {currentStepData.rejected.length > 10 && <span>... and {currentStepData.rejected.length - 10} more</span>}
              </VisitedWordsContainer>
            </RejectedWordsContainer>
          )}
        </InfoPanel>
      </>
    );
  };
  
  // Main visualization component
  const visualizationComponent = (
    <VisualizationContainer>
      <InputContainer>
        <InputGroup>
          <Label htmlFor="begin-word">Begin Word:</Label>
          <Input 
            id="begin-word"
            value={beginWord} 
            onChange={(e) => setBeginWord(e.target.value)} 
            disabled={visualization.isAnimating}
            aria-label="Begin word"
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="end-word">End Word:</Label>
          <Input 
            id="end-word"
            value={endWord} 
            onChange={(e) => setEndWord(e.target.value)} 
            disabled={visualization.isAnimating}
            aria-label="End word"
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="word-list">Word List (comma-separated):</Label>
          <WordListInput 
            id="word-list"
            value={wordListInput} 
            onChange={(e) => setWordListInput(e.target.value)} 
            disabled={visualization.isAnimating}
            aria-label="Word list (comma-separated)"
          />
        </InputGroup>
      </InputContainer>
      
      <VisualizationControls
        onStart={handleStart}
        onPause={visualization.pauseAnimation}
        onReset={visualization.resetAnimation}
        onStepForward={visualization.stepForward}
        onStepBackward={visualization.stepBackward}
        onSpeedChange={visualization.setAnimationSpeed}
        isAnimating={visualization.isAnimating}
        isPaused={visualization.isPaused}
        hasSteps={visualization.hasSteps}
        isFirstStep={visualization.isFirstStep}
        isLastStep={visualization.isLastStep}
        currentSpeed={visualization.animationSpeed}
      />
      
      {renderVisualization()}
      
      <Legend items={legendItems} />
    </VisualizationContainer>
  );

  return (
    <ProblemPageTemplate 
      algorithmInfo={wordLadderInfo}
      visualizationComponent={visualizationComponent}
      problemDescription={problemDescription}
    />
  );
};

export default WordLadderPage; 