import React, { useState } from 'react';
import styled from 'styled-components';

interface CustomArrayInputProps {
  onApply: (array: number[]) => void;
  maxValue?: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  flex: 1;
  min-width: 200px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.9rem;
`;

const InfoText = styled.div`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: 0.9rem;
`;

const CustomArrayInput: React.FC<CustomArrayInputProps> = ({ onApply, maxValue = 100 }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError(null);
  };

  const parseAndValidateArray = (input: string): number[] | null => {
    // Remove all whitespace and split by commas
    const values = input.replace(/\s/g, '').split(',');
    
    if (values.length === 0 || (values.length === 1 && values[0] === '')) {
      setError('Please enter at least one number');
      return null;
    }
    
    if (values.length > 20) {
      setError('Please enter at most 20 numbers for better visualization');
      return null;
    }
    
    const numbers: number[] = [];
    
    for (const value of values) {
      const num = Number(value);
      
      if (isNaN(num)) {
        setError(`"${value}" is not a valid number`);
        return null;
      }
      
      if (num < 1) {
        setError('All numbers must be greater than 0');
        return null;
      }
      
      if (num > maxValue) {
        setError(`All numbers must be less than or equal to ${maxValue}`);
        return null;
      }
      
      numbers.push(num);
    }
    
    return numbers;
  };

  const handleApply = () => {
    const parsedArray = parseAndValidateArray(inputValue);
    
    if (parsedArray) {
      onApply(parsedArray);
      // Clear input after successful application
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <Container>
      <InputRow>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter comma-separated numbers (e.g., 5, 12, 8, 3, 17)"
        />
        <Button onClick={handleApply} disabled={!inputValue.trim()}>
          Apply
        </Button>
      </InputRow>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <InfoText>Enter up to 20 numbers between 1 and {maxValue}, separated by commas.</InfoText>
    </Container>
  );
};

export default CustomArrayInput; 