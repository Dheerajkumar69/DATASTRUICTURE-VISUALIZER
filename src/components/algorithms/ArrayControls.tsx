import React, { useState } from 'react';
import styled from 'styled-components';
import { FiRefreshCw } from 'react-icons/fi';
import CustomArrayInput from './CustomArrayInput';

interface ArrayControlsProps {
  onGenerateRandom: (size: number) => void;
  onCustomArray: (array: number[]) => void;
  arraySize: number;
  onSizeChange: (size: number) => void;
  disabled?: boolean;
  maxValue?: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray800};
  margin: 0;
`;

const RandomArrayControls = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const SizeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SizeLabel = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray700};
`;

const SizeSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: white;
  font-size: 0.9rem;
`;

const GenerateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray200};
  margin: 0.5rem 0;
`;

const ArrayControls: React.FC<ArrayControlsProps> = ({
  onGenerateRandom,
  onCustomArray,
  arraySize,
  onSizeChange,
  disabled = false,
  maxValue = 100
}) => {
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = parseInt(e.target.value, 10);
    onSizeChange(size);
  };

  const handleGenerateClick = () => {
    onGenerateRandom(arraySize);
  };

  return (
    <Container>
      <Section>
        <SectionTitle>Random Array</SectionTitle>
        <RandomArrayControls>
          <SizeControl>
            <SizeLabel>Size:</SizeLabel>
            <SizeSelect value={arraySize} onChange={handleSizeChange} disabled={disabled}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </SizeSelect>
          </SizeControl>
          <GenerateButton onClick={handleGenerateClick} disabled={disabled}>
            <FiRefreshCw size={16} />
            Generate Random Array
          </GenerateButton>
        </RandomArrayControls>
      </Section>
      
      <Divider />
      
      <Section>
        <SectionTitle>Custom Array</SectionTitle>
        <CustomArrayInput onApply={onCustomArray} maxValue={maxValue} />
      </Section>
    </Container>
  );
};

export default ArrayControls; 