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

  .operations {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    flex-wrap: wrap;
    
    .operation {
      background: ${({ theme }) => theme.background};
      padding: 0.75rem 1rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .icon {
        width: 20px;
        height: 20px;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: bold;
        color: ${({ theme }) => theme.cardBackground};
      }
      
      .icon.insert { background: ${({ theme }) => theme.success}; }
      .icon.delete { background: ${({ theme }) => theme.error}; }
      .icon.substitute { background: ${({ theme }) => theme.warning}; }
      
      .text {
        color: ${({ theme }) => theme.text};
        font-size: 0.9rem;
      }
    }
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

const StringChar = styled(motion.div)<{ 
  isHighlighted?: boolean; 
  operationType?: 'insert' | 'delete' | 'substitute' | 'match';
}>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  
  background: ${({ operationType, isHighlighted, theme }) => {
    if (operationType === 'insert') return theme.success;
    if (operationType === 'delete') return theme.error;
    if (operationType === 'substitute') return theme.warning;
    if (operationType === 'match') return theme.primary;
    if (isHighlighted) return theme.primaryLight || theme.hover;
    return theme.hover;
  }};
  
  color: ${({ operationType, isHighlighted, theme }) => {
    if (operationType || isHighlighted) return theme.cardBackground;
    return theme.text;
  }};
  
  border: 2px solid ${({ isHighlighted, theme }) => 
    isHighlighted ? theme.primary : 'transparent'
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
  grid-template-columns: repeat(${({ cols }) => cols}, 60px);
  gap: 2px;
  margin: 1rem 0;
`;

const TableCell = styled(motion.div)<{ 
  isHeader?: boolean; 
  isActive?: boolean; 
  isPath?: boolean;
  value?: number;
  operationType?: 'insert' | 'delete' | 'substitute' | 'match';
}>`
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: ${({ isHeader }) => isHeader ? 'bold' : '600'};
  font-size: ${({ isHeader }) => isHeader ? '1rem' : '1.1rem'};
  position: relative;
  
  background: ${({ isPath, operationType, isActive, isHeader, theme }) => {
    if (isPath && operationType === 'insert') return theme.success;
    if (isPath && operationType === 'delete') return theme.error;
    if (isPath && operationType === 'substitute') return theme.warning;
    if (isPath && operationType === 'match') return theme.primary;
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
  
  &::after {
    content: '${({ operationType }) => {
      if (operationType === 'insert') return 'I';
      if (operationType === 'delete') return 'D';
      if (operationType === 'substitute') return 'S';
      if (operationType === 'match') return 'M';
      return '';
    }}';
    position: absolute;
    bottom: 2px;
    right: 4px;
    font-size: 0.7rem;
    font-weight: bold;
    opacity: 0.8;
  }
`;

const EditSequenceDisplay = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  
  .title {
    color: ${({ theme }) => theme.text};
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .sequence {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .operation {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9rem;
    
    .op-icon {
      width: 18px;
      height: 18px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: bold;
      color: ${({ theme }) => theme.cardBackground};
    }
    
    &.insert {
      background: ${({ theme }) => theme.success}20;
      color: ${({ theme }) => theme.success};
      .op-icon { background: ${({ theme }) => theme.success}; }
    }
    
    &.delete {
      background: ${({ theme }) => theme.error}20;
      color: ${({ theme }) => theme.error};
      .op-icon { background: ${({ theme }) => theme.error}; }
    }
    
    &.substitute {
      background: ${({ theme }) => theme.warning}20;
      color: ${({ theme }) => theme.warning};
      .op-icon { background: ${({ theme }) => theme.warning}; }
    }
    
    &.match {
      background: ${({ theme }) => theme.primary}20;
      color: ${({ theme }) => theme.primary};
      .op-icon { background: ${({ theme }) => theme.primary}; }
    }
  }
  
  .distance-result {
    margin-top: 1rem;
    padding: 0.75rem;
    background: ${({ theme }) => theme.cardBackground};
    border-radius: 6px;
    text-align: center;
    
    .distance {
      font-size: 1.5rem;
      font-weight: bold;
      color: ${({ theme }) => theme.primary};
      margin-bottom: 0.25rem;
    }
    
    .label {
      color: ${({ theme }) => theme.textLight};
      font-size: 0.9rem;
    }
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

interface EditStep {
  i: number;
  j: number;
  dp: number[][];
  char1: string;
  char2: string;
  operation: 'match' | 'insert' | 'delete' | 'substitute';
  cost: number;
  description: string;
  operationPath: Array<{ i: number; j: number; operation: 'match' | 'insert' | 'delete' | 'substitute' }>;
}

interface EditOperation {
  type: 'insert' | 'delete' | 'substitute' | 'match';
  char1?: string;
  char2?: string;
  description: string;
}

const EditDistancePage: React.FC = () => {
  const [string1, setString1] = useState('INTENTION');
  const [string2, setString2] = useState('EXECUTION');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<EditStep[]>([]);
  const [editSequence, setEditSequence] = useState<EditOperation[]>([]);
  const [minDistance, setMinDistance] = useState(0);

  // Generate edit distance steps using dynamic programming
  const generateEditSteps = useCallback((s1: string, s2: string): { steps: EditStep[], sequence: EditOperation[], distance: number } => {
    const m = s1.length;
    const n = s2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    const steps: EditStep[] = [];

    // Initialize base cases
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    // Fill the DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const char1 = s1[i - 1];
        const char2 = s2[j - 1];
        
        if (char1 === char2) {
          dp[i][j] = dp[i - 1][j - 1];
          steps.push({
            i,
            j,
            dp: dp.map(row => [...row]),
            char1,
            char2,
            operation: 'match',
            cost: 0,
            description: `Match: '${char1}' = '${char2}', dp[${i}][${j}] = dp[${i-1}][${j-1}] = ${dp[i][j]}`,
            operationPath: []
          });
        } else {
          const insertCost = dp[i][j - 1] + 1;
          const deleteCost = dp[i - 1][j] + 1;
          const substituteCost = dp[i - 1][j - 1] + 1;
          
          const minCost = Math.min(insertCost, deleteCost, substituteCost);
          dp[i][j] = minCost;
          
          let operation: 'insert' | 'delete' | 'substitute';
          let description: string;
          
          if (minCost === substituteCost) {
            operation = 'substitute';
            description = `Substitute: '${char1}' → '${char2}', dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`;
          } else if (minCost === deleteCost) {
            operation = 'delete';
            description = `Delete: '${char1}', dp[${i}][${j}] = dp[${i-1}][${j}] + 1 = ${dp[i][j]}`;
          } else {
            operation = 'insert';
            description = `Insert: '${char2}', dp[${i}][${j}] = dp[${i}][${j-1}] + 1 = ${dp[i][j]}`;
          }
          
          steps.push({
            i,
            j,
            dp: dp.map(row => [...row]),
            char1,
            char2,
            operation,
            cost: 1,
            description,
            operationPath: []
          });
        }
      }
    }

    // Backtrack to find the edit sequence
    const sequence: EditOperation[] = [];
    let i = m, j = n;
    const path: Array<{ i: number; j: number; operation: 'match' | 'insert' | 'delete' | 'substitute' }> = [];
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
        sequence.unshift({
          type: 'match',
          char1: s1[i - 1],
          char2: s2[j - 1],
          description: `Keep '${s1[i - 1]}'`
        });
        path.unshift({ i, j, operation: 'match' });
        i--;
        j--;
      } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
        sequence.unshift({
          type: 'substitute',
          char1: s1[i - 1],
          char2: s2[j - 1],
          description: `Substitute '${s1[i - 1]}' → '${s2[j - 1]}'`
        });
        path.unshift({ i, j, operation: 'substitute' });
        i--;
        j--;
      } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
        sequence.unshift({
          type: 'delete',
          char1: s1[i - 1],
          description: `Delete '${s1[i - 1]}'`
        });
        path.unshift({ i, j, operation: 'delete' });
        i--;
      } else {
        sequence.unshift({
          type: 'insert',
          char2: s2[j - 1],
          description: `Insert '${s2[j - 1]}'`
        });
        path.unshift({ i, j, operation: 'insert' });
        j--;
      }
    }

    // Add path information to steps
    steps.forEach(step => {
      step.operationPath = path;
    });

    return { steps, sequence, distance: dp[m][n] };
  }, []);

  // Initialize steps when strings change
  useEffect(() => {
    if (string1.length > 0 && string2.length > 0) {
      const { steps: newSteps, sequence, distance } = generateEditSteps(string1, string2);
      setSteps(newSteps);
      setEditSequence(sequence);
      setMinDistance(distance);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [string1, string2, generateEditSteps]);

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

  const editDistanceCode = `function editDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Base cases: converting empty string
    for (let i = 0; i <= m; i++) dp[i][0] = i; // deletions
    for (let j = 0; j <= n; j++) dp[0][j] = j; // insertions
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                // Characters match, no operation needed
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // Take minimum of three operations
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],     // Delete
                    dp[i][j - 1],     // Insert
                    dp[i - 1][j - 1]  // Substitute
                );
            }
        }
    }
    
    return dp[m][n];
}

// Time Complexity: O(m * n)
// Space Complexity: O(m * n)`;

  return (
    <Container>
      <Title>✏️ Edit Distance (Levenshtein Distance)</Title>
      
      <Description>
        <h3>Problem Description</h3>
        <p>
          Given two strings <code>word1</code> and <code>word2</code>, return the minimum number of operations 
          required to convert <code>word1</code> to <code>word2</code>. This is also known as the 
          Levenshtein Distance.
        </p>
        <p>
          You have the following three operations permitted on a word:
        </p>
        
        <div className="operations">
          <div className="operation">
            <div className="icon insert">I</div>
            <div className="text">Insert a character</div>
          </div>
          <div className="operation">
            <div className="icon delete">D</div>
            <div className="text">Delete a character</div>
          </div>
          <div className="operation">
            <div className="icon substitute">S</div>
            <div className="text">Replace a character</div>
          </div>
        </div>
        
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
            placeholder="INTENTION"
          />
        </div>
        <div className="input-group">
          <label>String 2:</label>
          <input
            type="text"
            value={string2}
            onChange={(e) => setString2(e.target.value.toUpperCase())}
            placeholder="EXECUTION"
          />
        </div>
      </InputSection>

      <VisualizationArea>
        <h3 style={{ color: 'inherit', marginBottom: '1rem' }}>String Transformation</h3>
        
        <StringDisplay>
          <div className="string-container">
            <div className="label">String 1: {string1}</div>
            <div className="string">
              {string1.split('').map((char, index) => (
                <StringChar
                  key={index}
                  isHighlighted={
                    currentStepData && 
                    currentStepData.char1 === char &&
                    currentStepData.i - 1 === index
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
                    currentStepData.char2 === char &&
                    currentStepData.j - 1 === index
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
              <TableCell isHeader>ε</TableCell>
              {string2.split('').map((char, j) => (
                <TableCell key={j} isHeader>{char}</TableCell>
              ))}

              {/* Data rows */}
              {Array.from({ length: string1.length + 2 }, (_, i) => (
                <React.Fragment key={i}>
                  <TableCell isHeader>
                    {i === 0 ? ' ' : i === 1 ? 'ε' : string1[i - 2]}
                  </TableCell>
                  {Array.from({ length: string2.length + 1 }, (_, j) => {
                    const realI = i - 1;
                    const realJ = j;
                    const isActive = currentStepData && currentStepData.i === realI && currentStepData.j === realJ;
                    const pathEntry = showFinalResult && currentStepData ? 
                      currentStepData.operationPath.find(p => p.i === realI && p.j === realJ) : null;
                    
                    return (
                      <TableCell
                        key={j}
                        isActive={isActive}
                        isPath={!!pathEntry}
                        operationType={pathEntry?.operation}
                        value={currentStepData && realI >= 0 ? currentStepData.dp[realI]?.[realJ] : 0}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: (i * (string2.length + 1) + j) * 0.02 }}
                      >
                        {currentStepData && realI >= 0 ? (currentStepData.dp[realI]?.[realJ] ?? 0) : (realI === -1 && realJ >= 0 ? realJ : realI >= 0 ? realI : 0)}
                      </TableCell>
                    );
                  })}
                </React.Fragment>
              ))}
            </TableGrid>
          </div>
        </DPTable>

        {showFinalResult && (
          <EditSequenceDisplay>
            <div className="title">Edit Operations Sequence</div>
            <div className="sequence">
              {editSequence.map((op, index) => (
                <div key={index} className={`operation ${op.type}`}>
                  <div className="op-icon">
                    {op.type === 'insert' ? 'I' : 
                     op.type === 'delete' ? 'D' : 
                     op.type === 'substitute' ? 'S' : 'M'}
                  </div>
                  <span>{op.description}</span>
                </div>
              ))}
            </div>
            <div className="distance-result">
              <div className="distance">{minDistance}</div>
              <div className="label">Minimum Edit Distance</div>
            </div>
          </EditSequenceDisplay>
        )}

        {currentStepData && (
          <StepInfo>
            <div className="step-title">
              Step {currentStep + 1}: Comparing '{currentStepData.char1}' and '{currentStepData.char2}'
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
        code={editDistanceCode}
        language="javascript"
      />
    </Container>
  );
};

export default EditDistancePage;
