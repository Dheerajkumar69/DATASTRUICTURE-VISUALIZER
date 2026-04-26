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
import { findWordLadder, validateWordLadderInput, WordLadderStep } from '../../../utils/wordLadderAlgorithm';

// Configuration constants
const WORD_LADDER_CONFIG = {
  maxWordListSize: 5000,
  maxWordLength: 50,
  maxComputationSteps: 10000,
  displayLimitQueue: 10,
  displayLimitRejected: 10
};

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
  transition: all 0.3s ease;
  color: ${props => 
    props.state === 'unvisited' ? props.theme.colors.text : 'white'
  };
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
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
  transition: all 0.3s ease;
  color: ${({ theme }) => theme.colors.card};
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
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
`;

const RejectedWordsContainer = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 1.5rem;
`;

const ErrorMessage = styled.div`
  background-color: ${props => props.theme.colors.danger};
  color: white;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius};
  margin-bottom: 1rem;
  border-left: 4px solid ${props => props.theme.colors.danger};
  font-weight: 500;
`;

const WordListInput = styled(TextArea)`
  width: 300px;
  height: 100px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
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

// Types for visualization (now imported from utility)
// Step is imported as WordLadderStep from wordLadderAlgorithm

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

// Main component
const WordLadderPage: React.FC = () => {
  // State for inputs
  const [beginWord, setBeginWord] = useState<string>('hit');
  const [endWord, setEndWord] = useState<string>('cog');
  const [wordListInput, setWordListInput] = useState<string>('hot,dot,dog,lot,log,cog');
  const [error, setError] = useState<string | null>(null);
  
  // Use our custom hook for visualization state
  const visualization = useVisualizationState<WordLadderStep>();
  
  // Legend data - static, moved outside component
  const legendItems = [
    { color: '#4299E1', label: 'Start Word' },  // info color
    { color: '#ED8936', label: 'End Word' },    // warning color
    { color: '#4A5568', label: 'Unvisited Word' }, // background color
    { color: '#3182CE', label: 'Current Word' }, // primary color
    { color: '#718096', label: 'Visited Word' }, // secondary color
    { color: '#48BB78', label: 'Path Word' },   // success color
    { color: '#E53E3E', label: 'Rejected Word' } // danger color
  ];
  
  // Algorithm execution - now uses extracted utility function
  const handleFindWordLadder = useCallback(() => {
    // Clear previous error
    setError(null);

    try {
      // Parse word list
      const wordList = wordListInput
        .split(',')
        .map(w => w.trim())
        .filter(w => w.length > 0);

      // Run algorithm (includes validation)
      const steps = findWordLadder(beginWord, endWord, wordList, WORD_LADDER_CONFIG);
      visualization.setSteps(steps);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('[WordLadder] Error:', message);
      setError(message);
    }
  }, [beginWord, endWord, wordListInput, visualization]);
  
  // UI Handlers
  const handleStart = useCallback(() => {
    if (visualization.steps.length === 0) {
      handleFindWordLadder();
    } else {
      visualization.startAnimation();
    }
  }, [visualization, handleFindWordLadder]);
  
  // Render visualization
  const renderVisualization = () => {
    // Show error if present
    if (error) {
      return (
        <ErrorMessage role="alert" aria-live="polite">
          {error}
        </ErrorMessage>
      );
    }

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
            )).slice(0, WORD_LADDER_CONFIG.displayLimitQueue)}
            {currentStepData.queue.length > WORD_LADDER_CONFIG.displayLimitQueue && (
              <span>... and {currentStepData.queue.length - WORD_LADDER_CONFIG.displayLimitQueue} more</span>
            )}
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
                {currentStepData.rejected.slice(-WORD_LADDER_CONFIG.displayLimitRejected).map((item, index) => (
                  <WordNode 
                    key={index} 
                    state="rejected"
                    aria-label={`Rejected word: ${item.word}, reason: ${item.reason}`}
                    title={item.reason}
                  >
                    {item.word}
                  </WordNode>
                ))}
                {currentStepData.rejected.length > WORD_LADDER_CONFIG.displayLimitRejected && (
                  <span>... and {currentStepData.rejected.length - WORD_LADDER_CONFIG.displayLimitRejected} more</span>
                )}
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
      {error && (
        <ErrorMessage role="alert" aria-live="polite">
          {error}
        </ErrorMessage>
      )}
      
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