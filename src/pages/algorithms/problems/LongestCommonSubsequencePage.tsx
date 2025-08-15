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
  gap: 2rem;
  justify-content: center;
  margin-bottom: 2rem;
  
  .string-container {
    text-align: center;
    
    .label {
      color: ${({ theme }) => theme.textLight};
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
    
    .string {
      display: flex;
      gap: 4px;
      font-family: monospace;
      font-size: 1.2rem;
    }
  }
`;

const StringChar = styled(motion.div)<{ isHighlighted?: boolean; isMatched?: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  
  background: ${({ isMatched, isHighlighted, theme }) => {
    if (isMatched) return theme.success;
    if (isHighlighted) return theme.primary;
    return theme.hover;
  }};
  
  color: ${({ isMatched, isHighlighted, theme }) => {
    if (isMatched || isHighlighted) return theme.cardBackground;
    return theme.text;
  }};
  
  border: 2px solid ${({ isHighlighted, theme }) => 
    isHighlighted ? theme.primaryDark : 'transparent'
  };
`;

const DPTable = styled.div`
  overflow-x: auto;
  margin-bottom: 2rem;
  
  .table-container {
    display: inline-block;
    min-width: 100%;
  }
`;

const TableGrid = styled.div<{ cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ cols }) => cols}, 50px);
  gap: 2px;
  margin: 1rem 0;
`;

const TableCell = styled(motion.div)<{ 
  isHeader?: boolean; 
  isActive?: boolean; 
  isPath?: boolean;
  value?: number;
}>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: ${({ isHeader }) => isHeader ? 'bold' : '600'};
  font-size: ${({ isHeader }) => isHeader ? '1rem' : '1.1rem'};
  
  background: ${({ isPath, isActive, isHeader, theme }) => {
    if (isPath) return theme.success;
    if (isActive) return theme.warning;
    if (isHeader) return theme.primary;
    return theme.hover;
  }};
  
  color: ${({ isPath, isActive, isHeader, theme }) => {
    if (isPath || isActive || isHeader) return theme.cardBackground;
    return theme.text;
  }};
  
  border: 2px solid ${({ isActive, theme }) => 
    isActive ? theme.warning : 'transparent'
  };

  font-family: ${({ isHeader }) => isHeader ? 'inherit' : 'monospace'};
`;

const LCSDisplay = styled.div`
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
  
  .lcs-result {
    font-family: monospace;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.success};
    font-weight: bold;
    letter-spacing: 2px;
  }
  
  .lcs-length {
    color: ${({ theme }) => theme.primary};
    font-size: 1.2rem;
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
      min-width: 200px;
      
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
`;

interface LCSStep {
  i: number;
  j: number;
  dp: number[][];
  currentChar1: string;
  currentChar2: string;
  isMatch: boolean;
  description: string;
}

const LongestCommonSubsequencePage: React.FC = () => {
  const [string1, setString1] = useState('ABCDGH');
  const [string2, setString2] = useState('AEDFHR');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<LCSStep[]>([]);
  const [lcsResult, setLcsResult] = useState({ subsequence: '', length: 0, path: new Set<string>() });

  // Generate LCS steps using dynamic programming
  const generateLCSSteps = useCallback((s1: string, s2: string): { steps: LCSStep[], result: any } => {
    const m = s1.length;
    const n = s2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    const steps: LCSStep[] = [];

    // Fill the DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const char1 = s1[i - 1];
        const char2 = s2[j - 1];
        const isMatch = char1 === char2;

        if (isMatch) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }

        steps.push({
          i,
          j,
          dp: dp.map(row => [...row]),
          currentChar1: char1,
          currentChar2: char2,
          isMatch,
          description: isMatch 
            ? `Match found: '${char1}' = '${char2}', dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`
            : `No match: '${char1}' ≠ '${char2}', dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = ${dp[i][j]}`
        });
      }
    }

    // Backtrack to find the LCS
    let lcs = '';
    let i = m, j = n;
    const path = new Set<string>();
    
    while (i > 0 && j > 0) {
      path.add(`${i}-${j}`);
      if (s1[i - 1] === s2[j - 1]) {
        lcs = s1[i - 1] + lcs;
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    return {
      steps,
      result: {
        subsequence: lcs,
        length: dp[m][n],
        path
      }
    };
  }, []);

  // Initialize steps when strings change
  useEffect(() => {
    if (string1.length > 0 && string2.length > 0) {
      const { steps: newSteps, result } = generateLCSSteps(string1, string2);
      setSteps(newSteps);
      setLcsResult(result);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [string1, string2, generateLCSSteps]);

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
    }, 1000);

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

  const lcsCode = `function longestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // Backtrack to find the actual LCS
    let lcs = '';
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (text1[i - 1] === text2[j - 1]) {
            lcs = text1[i - 1] + lcs;
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return { length: dp[m][n], subsequence: lcs };
}

// Time Complexity: O(m * n)
// Space Complexity: O(m * n)`;

  return (
    <Container>
      <Title>🔍 Longest Common Subsequence (LCS)</Title>
      
      <Description>
        <h3>Problem Description</h3>
        <p>
          Given two strings <code>text1</code> and <code>text2</code>, return the length of their longest common subsequence. 
          If there is no common subsequence, return 0.
        </p>
        <p>
          A subsequence is a sequence that can be derived from another sequence by deleting some or no elements 
          without changing the order of the remaining elements.
        </p>
        
        <div className="complexity">
          <div className="item">
            <div className="label">Time Complexity</div>
            <div className="value">O(m × n)</div>
          </div>
          <div className="item">
            <div className="label">Space Complexity</div>
            <div className="value">O(m × n)</div>
          </div>
          <div className="item">
            <div className="label">Algorithm</div>
            <div className="value">Dynamic Programming</div>
          </div>
        </div>
      </Description>

      <InputSection>
        <div className="input-group">
          <label>String 1:</label>
          <input
            type="text"
            value={string1}
            onChange={(e) => setString1(e.target.value.toUpperCase())}
            placeholder="ABCDGH"
          />
        </div>
        <div className="input-group">
          <label>String 2:</label>
          <input
            type="text"
            value={string2}
            onChange={(e) => setString2(e.target.value.toUpperCase())}
            placeholder="AEDFHR"
          />
        </div>
      </InputSection>

      <VisualizationArea>
        <h3 style={{ color: 'inherit', marginBottom: '1rem' }}>String Comparison</h3>
        
        <StringDisplay>
          <div className="string-container">
            <div className="label">String 1: {string1}</div>
            <div className="string">
              {string1.split('').map((char, index) => (
                <StringChar
                  key={index}
                  isHighlighted={
                    currentStepData && 
                    currentStepData.currentChar1 === char &&
                    currentStepData.i - 1 === index
                  }
                  isMatched={
                    showFinalResult && 
                    lcsResult.subsequence.includes(char)
                  }
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {char}
                </StringChar>
              ))}
            </div>
          </div>
          
          <div className="string-container">
            <div className="label">String 2: {string2}</div>
            <div className="string">
              {string2.split('').map((char, index) => (
                <StringChar
                  key={index}
                  isHighlighted={
                    currentStepData && 
                    currentStepData.currentChar2 === char &&
                    currentStepData.j - 1 === index
                  }
                  isMatched={
                    showFinalResult && 
                    lcsResult.subsequence.includes(char)
                  }
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {char}
                </StringChar>
              ))}
            </div>
          </div>
        </StringDisplay>

        <h4 style={{ color: 'inherit', textAlign: 'center', marginBottom: '1rem' }}>
          Dynamic Programming Table
        </h4>

        <DPTable>
          <div className="table-container">
            <TableGrid cols={string2.length + 2}>
              {/* Header row */}
              <TableCell isHeader> </TableCell>
              <TableCell isHeader> </TableCell>
              {string2.split('').map((char, j) => (
                <TableCell key={j} isHeader>{char}</TableCell>
              ))}

              {/* Data rows */}
              {Array.from({ length: string1.length + 1 }, (_, i) => (
                <React.Fragment key={i}>
                  <TableCell isHeader>
                    {i === 0 ? ' ' : string1[i - 1]}
                  </TableCell>
                  {Array.from({ length: string2.length + 1 }, (_, j) => (
                    <TableCell
                      key={j}
                      isActive={currentStepData && currentStepData.i === i && currentStepData.j === j}
                      isPath={showFinalResult && lcsResult.path.has(`${i}-${j}`)}
                      value={currentStepData ? currentStepData.dp[i][j] : 0}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (i * (string2.length + 1) + j) * 0.02 }}
                    >
                      {currentStepData ? currentStepData.dp[i][j] : 0}
                    </TableCell>
                  ))}
                </React.Fragment>
              ))}
            </TableGrid>
          </div>
        </DPTable>

        {showFinalResult && (
          <LCSDisplay>
            <div className="title">Longest Common Subsequence</div>
            <div className="lcs-result">"{lcsResult.subsequence}"</div>
            <div className="lcs-length">Length: {lcsResult.length}</div>
          </LCSDisplay>
        )}

        {currentStepData && (
          <StepInfo>
            <div className="step-title">
              Step {currentStep + 1}: Comparing '{currentStepData.currentChar1}' and '{currentStepData.currentChar2}'
            </div>
            <div className="step-description">{currentStepData.description}</div>
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
        code={lcsCode}
        language="javascript"
      />
    </Container>
  );
};

export default LongestCommonSubsequencePage;
