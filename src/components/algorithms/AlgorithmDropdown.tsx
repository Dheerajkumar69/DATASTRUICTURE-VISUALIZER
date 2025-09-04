import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const DropdownContainer = styled.div`
  position: relative;
  width: 250px;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const DropdownContent = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: ${({ isOpen }) => (isOpen ? '300px' : '0')};
  overflow-y: auto;
  background-color: white;
  border-radius: 0 0 ${({ theme }) => theme.borderRadius} ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 10;
  transition: max-height 0.3s ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.gray800};
  text-decoration: none;
  transition: background-color 0.2s;
  font-size: 0.9rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  }
`;

interface AlgorithmOption {
  name: string;
  path: string;
}

interface AlgorithmDropdownProps {
  buttonText?: string;
  options: AlgorithmOption[];
}

const AlgorithmDropdown: React.FC<AlgorithmDropdownProps> = ({ 
  buttonText = "Switch Algorithm", 
  options 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.algorithm-dropdown')) {
      setIsOpen(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <DropdownContainer className="algorithm-dropdown">
      <DropdownButton onClick={toggleDropdown}>
        <span>{buttonText}</span>
        <FiChevronDown />
      </DropdownButton>
      <DropdownContent isOpen={isOpen}>
        {options.map((option, index) => (
          <DropdownItem 
            key={index} 
            to={option.path}
            onClick={() => setIsOpen(false)}
          >
            {option.name}
          </DropdownItem>
        ))}
      </DropdownContent>
    </DropdownContainer>
  );
};

export default AlgorithmDropdown;