import React, { useState } from 'react';
import styled from 'styled-components';

type CellType = 'empty' | 'wall' | 'start' | 'end';

interface Position {
  x: number;
  y: number;
}

interface CustomGridInputProps {
  onApply: (grid: CellType[][], startPos: Position, endPos: Position) => void;
  gridSize?: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 800px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TextAreaLabel = styled.label`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 0.75rem;
  font-family: monospace;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  resize: vertical;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger};
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const InfoText = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 0.5rem;
  line-height: 1.4;
`;

// Example grid
const createExampleGrid = (size: number): string => {
  const grid: string[] = [];
  grid.push(`// Use the following symbols:`);
  grid.push(`// . = empty cell`);
  grid.push(`// # = wall`);
  grid.push(`// S = start position`);
  grid.push(`// E = end position`);
  grid.push(``);
  
  for (let y = 0; y < size; y++) {
    let row = '';
    for (let x = 0; x < size; x++) {
      if (x === 1 && y === 1) {
        row += 'S';
      } else if (x === size - 2 && y === size - 2) {
        row += 'E';
      } else if (
        (x === 3 && y >= 2 && y <= 6) ||
        (x === 6 && y >= 3 && y <= 7)
      ) {
        row += '#';
      } else {
        row += '.';
      }
    }
    grid.push(row);
  }
  
  return grid.join('\n');
};

const CustomGridInput: React.FC<CustomGridInputProps> = ({ 
  onApply, 
  gridSize = 10
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    setError(null);
  };

  const loadExample = () => {
    setInputValue(createExampleGrid(gridSize));
    setError(null);
  };

  const handleApply = () => {
    try {
      if (!inputValue.trim()) {
        setError('Please enter grid data');
        return;
      }

      const lines = inputValue.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('//'));
      
      if (lines.length === 0) {
        setError('No valid grid data found');
        return;
      }
      
      // Check if grid is square
      const width = lines[0].length;
      if (lines.some(line => line.length !== width)) {
        setError('Grid must be square (all rows must have the same length)');
        return;
      }
      
      if (width > gridSize) {
        setError(`Grid size too large. Maximum allowed is ${gridSize}x${gridSize}`);
        return;
      }
      
      // Parse the grid
      let startFound = false;
      let endFound = false;
      let startPos: Position = { x: 0, y: 0 };
      let endPos: Position = { x: 0, y: 0 };
      
      const parsedGrid: CellType[][] = [];
      
      for (let y = 0; y < lines.length; y++) {
        const row: CellType[] = [];
        const line = lines[y];
        
        for (let x = 0; x < line.length; x++) {
          const char = line[x];
          
          switch (char) {
            case '.':
              row.push('empty');
              break;
            case '#':
              row.push('wall');
              break;
            case 'S':
              if (startFound) {
                setError('Multiple start positions found');
                return;
              }
              startFound = true;
              startPos = { x, y };
              row.push('start');
              break;
            case 'E':
              if (endFound) {
                setError('Multiple end positions found');
                return;
              }
              endFound = true;
              endPos = { x, y };
              row.push('end');
              break;
            default:
              setError(`Invalid character '${char}' at position (${x},${y})`);
              return;
          }
        }
        
        parsedGrid.push(row);
      }
      
      if (!startFound) {
        setError('No start position (S) found');
        return;
      }
      
      if (!endFound) {
        setError('No end position (E) found');
        return;
      }
      
      // If validation passes, apply the grid
      onApply(parsedGrid, startPos, endPos);
      setError(null);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <Container>
      <InputArea>
        <TextAreaLabel>Enter custom grid:</TextAreaLabel>
        <StyledTextArea
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Use . for empty cells, # for walls, S for start, and E for end"
        />
        <InfoText>
          Use the following symbols:
          <br />• "." (period) for empty cells
          <br />• "#" (hash) for walls
          <br />• "S" for the start position (only one)
          <br />• "E" for the end position (only one)
          <br />The grid must be square, with all rows having the same length.
        </InfoText>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputArea>
      <ButtonRow>
        <Button onClick={loadExample}>Load Example</Button>
        <Button onClick={handleApply}>Apply Custom Grid</Button>
      </ButtonRow>
    </Container>
  );
};

export default CustomGridInput; 