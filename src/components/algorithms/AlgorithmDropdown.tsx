import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface AlgorithmOption {
  name: string;
  path: string;
}

interface AlgorithmDropdownProps {
  buttonText?: string;
  options: AlgorithmOption[];
}

// Styled components
const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
  
  svg {
    margin-left: 0.5rem;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 0.25rem;
  max-height: ${props => (props.isOpen ? '300px' : '0')};
  overflow-y: auto;
  transition: all 0.2s ease;
  z-index: 10;
  opacity: ${props => (props.isOpen ? '1' : '0')};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
`;

const Option = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  transition: all 0.1s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

const AlgorithmDropdown: React.FC<AlgorithmDropdownProps> = ({
  buttonText = 'Select Algorithm',
  options
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <DropdownContainer>
      <DropdownButton onClick={toggleDropdown}>
        {buttonText}
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </DropdownButton>
      <DropdownMenu isOpen={isOpen}>
        {options.map((option, index) => (
          <Option key={index} to={option.path}>
            {option.name}
          </Option>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default AlgorithmDropdown; 