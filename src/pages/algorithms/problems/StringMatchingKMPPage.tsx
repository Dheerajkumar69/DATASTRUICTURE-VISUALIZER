import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiRotateCcw, FiSkipForward } from 'react-icons/fi';
import CodeBlock from '../../../components/common/CodeBlock';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Description = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-left: 4px solid ${({ theme }) => theme.primary};

  h3 {
    color: ${({ theme }) => theme.text};
    margin-bottom: 1rem;
  }

  p {
    color: ${({ theme }) => theme.textLight};
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .complexity {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
    
    .item {
      display: flex;
      flex-direction: column;
      
      .label {
        font-size: 0.875rem;
        color: ${({ theme }) => theme.textLight};
        margin-bottom: 0.25rem;
      }
      
      .value {
        font-weight: 600;
        color: ${({ theme }) => theme.primary};
      }
    }
  }
`;

const VisualizationArea = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const TextDisplay = styled.div`
  margin-bottom: 2rem;
  
  .label {
    color: ${({ theme }) => theme.textLight};
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  
  .text-container {
    display: flex;
    gap: 2px;
    font-family: monospace;
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
`;

const PatternDisplay = styled.div`
  margin-bottom: 2rem;
  
  .pattern-wrapper {
    position: relative;
    margin-top: 1rem;
  }
  
  .pattern-container {
    display: flex;
    gap: 2px;
    font-family: monospace;
    font-size: 1.2rem;
  }
`;

const TextChar = styled(motion.div)<{ 
  isMatched?: boolean;
  isMismatched?: boolean;
  isCurrentlyComparing?: boolean;
  isFoundMatch?: boolean;
}>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  position: relative;
  
  background: ${({ isFoundMatch, isMatched, isMismatched, isCurrentlyComparing, theme }) => {
    if (isFoundMatch) return theme.success;
    if (isMatched) return theme.primary;
    if (isMismatched) return theme.error;
    if (isCurrentlyComparing) return theme.warning;
    return theme.hover;
  }};
  
  color: ${({ isFoundMatch, isMatched, isMismatched, isCurrentlyComparing, theme }) => {
    if (isFoundMatch || isMatched || isMismatched || isCurrentlyComparing) return theme.cardBackground;
    return theme.text;
  }};
  
  border: 2px solid ${({ isCurrentlyComparing, theme }) => 
    isCurrentlyComparing ? theme.warning : 'transparent'
  };

  &::after {
    content: attr(data-index);
    position: absolute;
    bottom: -20px;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.textLight};
    font-weight: normal;
  }
`;

const PatternChar = styled(motion.div)<{ 
  isMatched?: boolean;
  isMismatched?: boolean;
  isCurrentlyComparing?: boolean;
  isFoundMatch?: boolean;
}>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  position: relative;
  
  background: ${({ isFoundMatch, isMatched, isMismatched, isCurrentlyComparing, theme }) => {
    if (isFoundMatch) return theme.success;
    if (isMatched) return theme.primary;
    if (isMismatched) return theme.error;
    if (isCurrentlyComparing) return theme.warning;
    return theme.hover;
  }};
  
  color: ${({ isFoundMatch, isMatched, isMismatched, isCurrentlyComparing, theme }) => {
    if (isFoundMatch || isMatched || isMismatched || isCurrentlyComparing) return theme.cardBackground;
    return theme.text;
  }};
  
  border: 2px solid ${({ isCurrentlyComparing, theme }) => 
    isCurrentlyComparing ? theme.warning : 'transparent'
  };

  &::after {
    content: attr(data-index);
    position: absolute;
    bottom: -20px;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.textLight};
    font-weight: normal;
  }
`;

const LPSTable = styled.div`
  margin-bottom: 2rem;
  
  h4 {
    color: ${({ theme }) => theme.text};
    margin-bottom: 1rem;
  }
  
  .lps-container {
    display: flex;
    gap: 2px;
    font-family: monospace;
    font-size: 1rem;
  }
  
  .lps-header {
    margin-bottom: 0.5rem;
    display: flex;
    gap: 2px;
  }
`;

const LPSCell = styled.div<{ isActive?: boolean }>`
  width: 40px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  
  background: ${({ isActive, theme }) => 
    isActive ? theme.primary : theme.hover
  };
  
  color: ${({ isActive, theme }) => 
    isActive ? theme.cardBackground : theme.text
  };
`;

const MatchResults = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: center;
  
  .title {
    color: ${({ theme }) => theme.text};
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .matches-found {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.success};
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .match-positions {
    color: ${({ theme }) => theme.primary};
    font-family: monospace;
    font-size: 1rem;
  }

  .no-matches {
    color: ${({ theme }) => theme.error};
    font-size: 1.1rem;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  
  ${({ variant, theme }) => variant === 'primary' ? `
    background: ${theme.primary};
    color: ${theme.cardBackground};
    &:hover { background: ${theme.primaryDark}; }
  ` : `
    background: ${theme.hover};
    color: ${theme.text};
    &:hover { background: ${theme.border}; }
  `}
`;

const InputSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    label {
      color: ${({ theme }) => theme.text};
      font-weight: 500;
    }
    
    input {
      padding: 0.5rem;
      border-radius: 4px;
      border: 1px solid ${({ theme }) => theme.border};
      background: ${({ theme }) => theme.cardBackground};
      color: ${({ theme }) => theme.text};
      font-family: monospace;
      min-width: 250px;
      
      &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primary};
      }
    }
  }
`;

const StepInfo = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  
  .step-title {
    color: ${({ theme }) => theme.primary};
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .step-description {
    color: ${({ theme }) => theme.text};
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .step-stats {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    font-size: 0.85rem;
    
    .stat {
      color: ${({ theme }) => theme.textLight};
      
      .value {
        color: ${({ theme }) => theme.primary};
        font-weight: 600;
      }
    }
  }
`;

interface KMPStep {
  textIndex: number;
  patternIndex: number;
  patternOffset: number;
  isMatch: boolean;
  isComplete: boolean;
  matchFound: boolean;
  description: string;
  lpsUsed?: number;
  matchedIndices: number[];
  currentComparison: { textIndex: number; patternIndex: number };
}

const StringMatchingKMPPage: React.FC = () => {
  const [text, setText] = useState('ABABDABACDABABCABCABCABCABC');
  const [pattern, setPattern] = useState('ABABCABCAB');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<KMPStep[]>([]);
  const [lpsArray, setLpsArray] = useState<number[]>([]);
  const [matches, setMatches] = useState<number[]>([]);

  // Build LPS (Longest Prefix Suffix) array
  const buildLPSArray = useCallback((pattern: string): number[] => {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
    return lps;
  }, []);

  // Generate KMP search steps
  const generateKMPSteps = useCallback((text: string, pattern: string): { steps: KMPStep[], matches: number[] } => {
    const steps: KMPStep[] = [];
    const lps = buildLPSArray(pattern);
    const foundMatches: number[] = [];
    
    let textIndex = 0;
    let patternIndex = 0;

    while (textIndex < text.length) {
      const isMatch = text[textIndex] === pattern[patternIndex];
      const matchedIndices: number[] = [];
      
      // Build matched indices up to current pattern index
      for (let k = 0; k < patternIndex; k++) {
        matchedIndices.push(textIndex - patternIndex + k);
      }

      steps.push({
        textIndex,
        patternIndex,
        patternOffset: textIndex - patternIndex,
        isMatch,
        isComplete: false,
        matchFound: false,
        description: isMatch 
          ? `Match: text[${textIndex}] = '${text[textIndex]}' equals pattern[${patternIndex}] = '${pattern[patternIndex]}'`
          : `Mismatch: text[${textIndex}] = '${text[textIndex]}' ≠ pattern[${patternIndex}] = '${pattern[patternIndex]}'`,
        matchedIndices,
        currentComparison: { textIndex, patternIndex }
      });

      if (isMatch) {
        textIndex++;
        patternIndex++;
        
        // Check if we found a complete match
        if (patternIndex === pattern.length) {
          const matchStart = textIndex - pattern.length;
          foundMatches.push(matchStart);
          
          const completeMatchIndices: number[] = [];
          for (let k = 0; k < pattern.length; k++) {
            completeMatchIndices.push(matchStart + k);
          }

          steps.push({
            textIndex: textIndex - 1,
            patternIndex: patternIndex - 1,
            patternOffset: matchStart,
            isMatch: true,
            isComplete: true,
            matchFound: true,
            description: `Complete match found at position ${matchStart}!`,
            matchedIndices: completeMatchIndices,
            currentComparison: { textIndex: textIndex - 1, patternIndex: patternIndex - 1 }
          });

          // Reset pattern index using LPS
          patternIndex = lps[patternIndex - 1];
        }
      } else {
        if (patternIndex !== 0) {
          const lpsValue = lps[patternIndex - 1];
          steps.push({
            textIndex,
            patternIndex,
            patternOffset: textIndex - patternIndex,
            isMatch: false,
            isComplete: false,
            matchFound: false,
            description: `Using LPS: pattern index shifts from ${patternIndex} to ${lpsValue}`,
            lpsUsed: lpsValue,
            matchedIndices: [],
            currentComparison: { textIndex, patternIndex }
          });
          patternIndex = lpsValue;
        } else {
          textIndex++;
        }
      }
    }

    setLpsArray(lps);
    return { steps, matches: foundMatches };
  }, [buildLPSArray]);

  // Initialize steps when text or pattern changes
  useEffect(() => {
    if (text.length > 0 && pattern.length > 0) {
      const { steps: newSteps, matches: foundMatches } = generateKMPSteps(text, pattern);
      setSteps(newSteps);
      setMatches(foundMatches);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [text, pattern, generateKMPSteps]);

  // Animation logic
  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= steps.length) {
          setIsPlaying(false);
        }
        return next;
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  const handleStepForward = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const currentStepData = steps[Math.min(currentStep, steps.length - 1)];
  const showFinalResult = currentStep >= steps.length;

  const kmpCode = `function buildLPS(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;
    
    while (i < pattern.length) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

function KMPSearch(text, pattern) {
    const lps = buildLPS(pattern);
    const matches = [];
    let textIndex = 0;
    let patternIndex = 0;
    
    while (textIndex < text.length) {
        if (text[textIndex] === pattern[patternIndex]) {
            textIndex++;
            patternIndex++;
            
            if (patternIndex === pattern.length) {
                matches.push(textIndex - pattern.length);
                patternIndex = lps[patternIndex - 1];
            }
        } else {
            if (patternIndex !== 0) {
                patternIndex = lps[patternIndex - 1];
            } else {
                textIndex++;
            }
        }
    }
    
    return matches;
}

// Time Complexity: O(n + m) where n = text length, m = pattern length
// Space Complexity: O(m) for LPS array`;

  return (
    <Container>
      <Title>🔍 String Matching - KMP Algorithm</Title>
      
      <Description>
        <h3>Problem Description</h3>
        <p>
          The KMP (Knuth-Morris-Pratt) algorithm efficiently finds occurrences of a pattern within a text.
          Unlike naive string matching, KMP uses a preprocessing step to create an LPS (Longest Prefix Suffix) array
          that allows the algorithm to skip comparisons when a mismatch occurs.
        </p>
        <p>
          The key insight is that when a mismatch occurs after matching some characters, we don't need to restart
          the pattern comparison from the beginning - we can use information about the pattern's structure to skip ahead.
        </p>
        
        <div className="complexity">
          <div className="item">
            <div className="label">Time Complexity</div>
            <div className="value">O(n + m)</div>
          </div>
          <div className="item">
            <div className="label">Space Complexity</div>
            <div className="value">O(m)</div>
          </div>
          <div className="item">
            <div className="label">Algorithm</div>
            <div className="value">KMP Pattern Matching</div>
          </div>
        </div>
      </Description>

      <InputSection>
        <div className="input-group">
          <label>Text:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase())}
            placeholder="ABABDABACDABABCABCABCABCABC"
          />
        </div>
        <div className="input-group">
          <label>Pattern:</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value.toUpperCase())}
            placeholder="ABABCABCAB"
          />
        </div>
      </InputSection>

      <VisualizationArea>
        <h3 style={{ color: 'inherit', marginBottom: '1rem' }}>Pattern Matching Visualization</h3>
        
        <TextDisplay>
          <div className="label">Text: {text}</div>
          <div className="text-container">
            {text.split('').map((char, index) => {
              let state = {};
              
              if (showFinalResult) {
                // Show all matches
                const isInMatch = matches.some(matchStart => 
                  index >= matchStart && index < matchStart + pattern.length
                );
                state = { isFoundMatch: isInMatch };
              } else if (currentStepData) {
                const isMatched = currentStepData.matchedIndices.includes(index);
                const isCurrentlyComparing = currentStepData.currentComparison.textIndex === index;
                const isMismatched = isCurrentlyComparing && !currentStepData.isMatch;
                const isFoundMatch = currentStepData.matchFound && currentStepData.matchedIndices.includes(index);
                
                state = { 
                  isMatched: isMatched && !isCurrentlyComparing,
                  isCurrentlyComparing,
                  isMismatched,
                  isFoundMatch
                };
              }

              return (
                <TextChar
                  key={index}
                  data-index={index}
                  {...state}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                >
                  {char}
                </TextChar>
              );
            })}
          </div>
        </TextDisplay>

        <PatternDisplay>
          <div className="label">Pattern: {pattern}</div>
          <div className="pattern-wrapper">
            <div 
              className="pattern-container"
              style={{
                marginLeft: currentStepData ? `${currentStepData.patternOffset * 42}px` : '0px',
                transition: 'margin-left 0.3s ease-in-out'
              }}
            >
              {pattern.split('').map((char, index) => {
                let state = {};
                
                if (showFinalResult) {
                  state = {};
                } else if (currentStepData) {
                  const isCurrentlyComparing = currentStepData.currentComparison.patternIndex === index;
                  const isMatched = index < currentStepData.currentComparison.patternIndex;
                  const isMismatched = isCurrentlyComparing && !currentStepData.isMatch;
                  const isFoundMatch = currentStepData.matchFound && index < pattern.length;
                  
                  state = {
                    isMatched: isMatched && !isCurrentlyComparing,
                    isCurrentlyComparing,
                    isMismatched,
                    isFoundMatch
                  };
                }

                return (
                  <PatternChar
                    key={index}
                    data-index={index}
                    {...state}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {char}
                  </PatternChar>
                );
              })}
            </div>
          </div>
        </PatternDisplay>

        <LPSTable>
          <h4>LPS Array (Longest Prefix Suffix)</h4>
          <div className="lps-header">
            {pattern.split('').map((char, index) => (
              <LPSCell key={index}>{char}</LPSCell>
            ))}
          </div>
          <div className="lps-container">
            {lpsArray.map((value, index) => (
              <LPSCell
                key={index}
                isActive={currentStepData && currentStepData.lpsUsed === value && currentStepData.patternIndex > index}
              >
                {value}
              </LPSCell>
            ))}
          </div>
        </LPSTable>

        {showFinalResult && (
          <MatchResults>
            <div className="title">Pattern Matching Results</div>
            {matches.length > 0 ? (
              <>
                <div className="matches-found">{matches.length} match(es) found!</div>
                <div className="match-positions">
                  Positions: {matches.join(', ')}
                </div>
              </>
            ) : (
              <div className="no-matches">No matches found</div>
            )}
          </MatchResults>
        )}

        {currentStepData && (
          <StepInfo>
            <div className="step-title">
              Step {currentStep + 1}: {currentStepData.isComplete ? 'Match Found!' : 'Comparing Characters'}
            </div>
            <div className="step-description">{currentStepData.description}</div>
            <div className="step-stats">
              <div className="stat">
                Text Index: <span className="value">{currentStepData.textIndex}</span>
              </div>
              <div className="stat">
                Pattern Index: <span className="value">{currentStepData.patternIndex}</span>
              </div>
              <div className="stat">
                Pattern Offset: <span className="value">{currentStepData.patternOffset}</span>
              </div>
              {currentStepData.lpsUsed !== undefined && (
                <div className="stat">
                  LPS Value Used: <span className="value">{currentStepData.lpsUsed}</span>
                </div>
              )}
            </div>
          </StepInfo>
        )}

        <Controls>
          <Button onClick={handlePlay} disabled={isPlaying} variant="primary">
            <FiPlay /> Play
          </Button>
          <Button onClick={handlePause} disabled={!isPlaying}>
            <FiPause /> Pause
          </Button>
          <Button onClick={handleStepForward} disabled={isPlaying}>
            <FiSkipForward /> Step
          </Button>
          <Button onClick={handleReset}>
            <FiRotateCcw /> Reset
          </Button>
        </Controls>
      </VisualizationArea>

      <CodeBlock
        code={kmpCode}
        language="javascript"
      />
    </Container>
  );
};

export default StringMatchingKMPPage;
