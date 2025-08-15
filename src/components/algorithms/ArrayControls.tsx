import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';

interface ArrayControlsProps {
  onGenerateRandom: (size: number) => void;
  onCustomArray: (array: number[]) => void;
  arraySize: number;
  onSizeChange: (size: number) => void;
  disabled?: boolean;
  maxValue?: number;
}

// Styled components
const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Button = styled.button<{ primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background-color: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.card};
  color: ${props => props.primary ? '#ffffff' : props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.primary ? props.theme.colors.primaryDark : props.theme.colors.hover};
  }
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;


const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CustomArrayInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger};
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const ArrayControls: React.FC<ArrayControlsProps> = ({
  onGenerateRandom,
  onCustomArray,
  arraySize,
  onSizeChange,
  disabled = false,
  maxValue = 100
}) => {
  const [customArrayInput, setCustomArrayInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    if (size >= 10 && size <= 10) {
      onSizeChange(size);
    }
  };
  
  const handleCustomArraySubmit = () => {
    try {
      // Parse the input string to an array of numbers
      const array = customArrayInput.split(',').map(item => {
        const num = parseInt(item.trim(), 10);
        if (isNaN(num)) {
          throw new Error('All values must be numbers');
        }
        if (num < 1 || num > maxValue) {
          throw new Error(`Values must be between 1 and ${maxValue}`);
        }
        return num;
      });
      
      if (array.length < 10 || array.length > 10) {
        setError(`Array length must be 10`);
        return;
      }
      
      setError(null);
      onCustomArray(array);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid input');
      }
    }
  };
  
  return (
    <ControlsContainer>
      <InputGroup>
        <Label>Array Size:</Label>
        <Input
          type="number"
          min="10"
          max="10"
          value={arraySize}
          onChange={handleSizeChange}
          disabled={disabled}
        />
        <Button
          onClick={() => onGenerateRandom(arraySize)}
          disabled={disabled}
        >
          <FiRefreshCw /> Random Array
        </Button>
      </InputGroup>
      
      <InputGroup>
        <CustomArrayInput
          type="text"
          placeholder="Custom array (10 numbers: 5,2,8,1,9,3,7,4,6,1)"
          value={customArrayInput}
          onChange={(e) => setCustomArrayInput(e.target.value)}
          disabled={disabled}
        />
        <Button
          onClick={handleCustomArraySubmit}
          disabled={disabled}
          primary
        >
          <FiPlus /> Apply
        </Button>
      </InputGroup>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </ControlsContainer>
  );
};

export default ArrayControls; 