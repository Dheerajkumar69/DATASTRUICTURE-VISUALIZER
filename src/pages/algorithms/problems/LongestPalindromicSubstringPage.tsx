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

const StringDisplay = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  
  .string {
    display: flex;
    gap: 2px;
    font-family: monospace;
    font-size: 1.2rem;
  }
`;

const StringChar = styled(motion.div)<{ 
  isCenter?: boolean;
  isExpanded?: boolean;
  isPalindrome?: boolean;
  isLongestPalindrome?: boolean;
  index?: number;
}>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  position: relative;
  
  background: ${({ isLongestPalindrome, isPalindrome, isCenter, isExpanded, theme }) => {
    if (isLongestPalindrome) return theme.success;
    if (isPalindrome) return theme.primary;
    if (isCenter) return theme.warning;
    if (isExpanded) return theme.primaryLight || theme.hover;
    return theme.hover;
  }};
  
  color: ${({ isLongestPalindrome, isPalindrome, isCenter, theme }) => {
    if (isLongestPalindrome || isPalindrome || isCenter) return theme.cardBackground;
    return theme.text;
  }};
  
  border: 2px solid ${({ isCenter, theme }) => 
    isCenter ? theme.warning : 'transparent'
  };

  &::after {
    content: '${({ index }) => typeof index !== 'undefined' ? index : ''}';
    position: absolute;
    bottom: -20px;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.textLight};
    font-weight: normal;
  }
`;

const PalindromeDisplay = styled.div`
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
  
  .current-palindrome {
    font-family: monospace;
    font-size: 1.3rem;
    color: ${({ theme }) => theme.primary};
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .longest-palindrome {
    font-family: monospace;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.success};
    font-weight: bold;
    letter-spacing: 1px;
  }
  
  .palindrome-info {
    color: ${({ theme }) => theme.textLight};
    font-size: 0.9rem;
    margin-top: 0.5rem;
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
      min-width: 300px;
      
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

interface PalindromeStep {
  center: number;
  left: number;
  right: number;
  isOddLength: boolean;
  currentPalindrome: string;
  isValidPalindrome: boolean;
  description: string;
  expandedIndices: number[];
}

const LongestPalindromicSubstringPage: React.FC = () => {
  const [inputString, setInputString] = useState('babad');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<PalindromeStep[]>([]);
  const [longestPalindrome, setLongestPalindrome] = useState({ value: '', start: 0, length: 0 });

  // Generate palindrome expansion steps
  const generatePalindromeSteps = useCallback((s: string): PalindromeStep[] => {
    const steps: PalindromeStep[] = [];
    let maxLength = 0;
    let maxStart = 0;
    let maxPalindrome = '';

    // Function to expand around center and generate steps
    const expandAroundCenter = (left: number, right: number, isOdd: boolean) => {
      while (left >= 0 && right < s.length && s[left] === s[right]) {
        const currentPalindrome = s.substring(left, right + 1);
        const expandedIndices = [];
        for (let i = left; i <= right; i++) {
          expandedIndices.push(i);
        }

        steps.push({
          center: isOdd ? left : Math.floor((left + right) / 2),
          left,
          right,
          isOddLength: isOdd,
          currentPalindrome,
          isValidPalindrome: true,
          description: `Found palindrome "${currentPalindrome}" from index ${left} to ${right} (length: ${right - left + 1})`,
          expandedIndices
        });

        // Update longest palindrome if current is longer
        if (right - left + 1 > maxLength) {
          maxLength = right - left + 1;
          maxStart = left;
          maxPalindrome = currentPalindrome;
        }

        left--;
        right++;
      }

      // Add a step showing where expansion stopped (if we tried to expand)
      if (left >= 0 && right < s.length && s[left] !== s[right]) {
        steps.push({
          center: isOdd ? left + 1 : Math.floor((left + 1 + right - 1) / 2),
          left: left + 1,
          right: right - 1,
          isOddLength: isOdd,
          currentPalindrome: s.substring(left + 1, right),
          isValidPalindrome: false,
          description: `Cannot expand further: s[${left}]='${s[left]}' ≠ s[${right}]='${s[right]}'`,
          expandedIndices: []
        });
      }
    };

    // Check each possible center
    for (let i = 0; i < s.length; i++) {
      // Odd length palindromes (single character center)
      expandAroundCenter(i, i, true);
      
      // Even length palindromes (between two characters)
      if (i < s.length - 1) {
        expandAroundCenter(i, i + 1, false);
      }
    }

    setLongestPalindrome({ 
      value: maxPalindrome, 
      start: maxStart, 
      length: maxLength 
    });

    return steps;
  }, []);

  // Initialize steps when string changes
  useEffect(() => {
    if (inputString.length > 0) {
      const newSteps = generatePalindromeSteps(inputString);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [inputString, generatePalindromeSteps]);

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
    }, 1200);

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

  // Helper function to determine character display state
  const getCharacterState = (index: number) => {
    if (showFinalResult) {
      return {
        isLongestPalindrome: index >= longestPalindrome.start && 
                           index < longestPalindrome.start + longestPalindrome.length
      };
    }

    if (!currentStepData) return {};

    return {
      isCenter: currentStepData.isOddLength 
        ? index === currentStepData.center 
        : (index === currentStepData.center || index === currentStepData.center + 1),
      isExpanded: currentStepData.expandedIndices.includes(index),
      isPalindrome: currentStepData.isValidPalindrome && 
                   currentStepData.expandedIndices.includes(index)
    };
  };

  const palindromeCode = `function longestPalindrome(s) {
    if (!s || s.length < 2) return s;
    
    let start = 0;
    let maxLength = 1;
    
    // Helper function to expand around center
    function expandAroundCenter(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            const currentLength = right - left + 1;
            if (currentLength > maxLength) {
                start = left;
                maxLength = currentLength;
            }
            left--;
            right++;
        }
    }
    
    for (let i = 0; i < s.length; i++) {
        // Check for odd length palindromes (center at i)
        expandAroundCenter(i, i);
        
        // Check for even length palindromes (center between i and i+1)
        expandAroundCenter(i, i + 1);
    }
    
    return s.substring(start, start + maxLength);
}

// Time Complexity: O(n²)
// Space Complexity: O(1)`;

  return (
    <Container>
      <Title>🔄 Longest Palindromic Substring</Title>
      
      <Description>
        <h3>Problem Description</h3>
        <p>
          Given a string <code>s</code>, return the longest palindromic substring in <code>s</code>. 
          A palindrome is a string that reads the same forward and backward.
        </p>
        <p>
          The algorithm uses the "expand around centers" technique, checking each possible center position 
          (both single characters and between characters) and expanding outward while characters match.
        </p>
        
        <div className="complexity">
          <div className="item">
            <div className="label">Time Complexity</div>
            <div className="value">O(n²)</div>
          </div>
          <div className="item">
            <div className="label">Space Complexity</div>
            <div className="value">O(1)</div>
          </div>
          <div className="item">
            <div className="label">Algorithm</div>
            <div className="value">Expand Around Centers</div>
          </div>
        </div>
      </Description>

      <InputSection>
        <div className="input-group">
          <label>Input String:</label>
          <input
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value.toLowerCase())}
            placeholder="babad"
          />
        </div>
      </InputSection>

      <VisualizationArea>
        <h3 style={{ color: 'inherit', marginBottom: '1rem', textAlign: 'center' }}>
          Palindrome Detection Visualization
        </h3>
        
        <StringDisplay>
          <div className="string">
            {inputString.split('').map((char, index) => {
              const state = getCharacterState(index);
              return (
                <StringChar
                  key={index}
                  index={index}
                  {...state}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {char}
                </StringChar>
              );
            })}
          </div>
        </StringDisplay>

        <PalindromeDisplay>
          {showFinalResult ? (
            <>
              <div className="title">Longest Palindromic Substring</div>
              <div className="longest-palindrome">"{longestPalindrome.value}"</div>
              <div className="palindrome-info">
                Length: {longestPalindrome.length} | 
                Start Index: {longestPalindrome.start}
              </div>
            </>
          ) : currentStepData ? (
            <>
              <div className="title">Current Detection</div>
              {currentStepData.isValidPalindrome ? (
                <div className="current-palindrome">
                  "{currentStepData.currentPalindrome}"
                </div>
              ) : (
                <div className="palindrome-info">
                  Expansion stopped - characters don't match
                </div>
              )}
            </>
          ) : (
            <div className="title">Ready to start detection</div>
          )}
        </PalindromeDisplay>

        {currentStepData && (
          <StepInfo>
            <div className="step-title">
              Step {currentStep + 1}: 
              {currentStepData.isOddLength 
                ? ` Checking odd-length center at position ${currentStepData.center}`
                : ` Checking even-length center between positions ${currentStepData.center} and ${currentStepData.center + 1}`
              }
            </div>
            <div className="step-description">{currentStepData.description}</div>
            <div className="step-stats">
              <div className="stat">
                Left: <span className="value">{currentStepData.left}</span>
              </div>
              <div className="stat">
                Right: <span className="value">{currentStepData.right}</span>
              </div>
              <div className="stat">
                Length: <span className="value">{currentStepData.right - currentStepData.left + 1}</span>
              </div>
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
        code={palindromeCode}
        language="javascript"
      />
    </Container>
  );
};

export default LongestPalindromicSubstringPage;
