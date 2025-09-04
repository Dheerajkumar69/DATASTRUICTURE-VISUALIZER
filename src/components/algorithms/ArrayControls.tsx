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
  margin-bottom: 2rem;
`;

const ControlRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
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
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ primary, theme }) => 
      primary ? theme.colors.primaryDark : theme.colors.gray100};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Slider = styled.input`
  -webkit-appearance: none;
  width: 150px;
  height: 8px;
  background: ${({ theme }) => theme.colors.gray200};
  outline: none;
  border-radius: 4px;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    border-radius: 50%;
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    border-radius: 50%;
  }
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CustomArrayInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.8rem;
  margin: 0.25rem 0 0 0;
`;

interface ArrayControlsProps {
  onGenerateRandom: (size: number) => void;
  onCustomArray: (array: number[]) => void;
  arraySize: number;
  onSizeChange: (size: number) => void;
  disabled?: boolean;
  maxValue?: number;
}

=======
>>>>>>> parent of 5badfa4 (version 4.0.0)
const ArrayControls: React.FC<ArrayControlsProps> = ({
  onGenerateRandom,
  onCustomArray,
  arraySize,
  onSizeChange,
  disabled = false,
  maxValue = 100
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customArrayInput, setCustomArrayInput] = useState('');
  const [error, setError] = useState('');
  
  const handleGenerateRandom = () => {
    onGenerateRandom(arraySize);
    setShowCustomInput(false);
    setError('');
  };
  
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    if (newSize >= 2 && newSize <= 50) {
      onSizeChange(newSize);
    }
  };
  
  const toggleCustomInput = () => {
    setShowCustomInput(!showCustomInput);
    setError('');
  };
  
  const handleCustomArraySubmit = () => {
    try {
      // Parse the input string to an array of numbers
      const array = customArrayInput
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '')
        .map(item => {
          const num = Number(item);
          if (isNaN(num)) {
            throw new Error(`"${item}" is not a valid number`);
          }
          if (num < 0) {
            throw new Error(`Numbers cannot be negative`);
          }
          if (num > maxValue) {
            throw new Error(`Numbers cannot exceed ${maxValue}`);
          }
          return num;
        });
      
      if (array.length < 2) {
        throw new Error('Please enter at least 2 numbers');
      }
      
      if (array.length > 50) {
        throw new Error('Array cannot exceed 50 elements');
      }
      
      onCustomArray(array);
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid input');
      }
    }
  };
  
  return (
    <Container>
      <ControlRow>
        <Button 
          primary 
          onClick={handleGenerateRandom}
          disabled={disabled}
        >
          <FiRefreshCw />
          Generate Random Array
        </Button>
        
        <Button 
          onClick={toggleCustomInput}
          disabled={disabled}
        >
          <FiEdit2 />
          {showCustomInput ? 'Hide Custom Input' : 'Custom Array'}
        </Button>
        
        <SliderContainer>
          <Label>Size:</Label>
          <Slider 
            type="range" 
            min="2" 
            max="50" 
            value={arraySize}
            onChange={handleSizeChange}
            disabled={disabled}
          />
          <Input 
            type="number" 
            min="2" 
            max="50" 
            value={arraySize}
            onChange={handleSizeChange}
            disabled={disabled}
          />
        </SliderContainer>
      </ControlRow>
      
      {showCustomInput && (
        <ControlRow>
          <CustomArrayInput 
            placeholder="Enter numbers separated by commas (e.g., 5, 3, 8, 1, 2)"
            value={customArrayInput}
            onChange={(e) => setCustomArrayInput(e.target.value)}
            disabled={disabled}
          />
          <Button 
            primary
            onClick={handleCustomArraySubmit}
            disabled={disabled || !customArrayInput.trim()}
          >
            Apply
          </Button>
          {error && <ErrorText>{error}</ErrorText>}
        </ControlRow>
      )}
    </Container>
  );
};

export default ArrayControls; 