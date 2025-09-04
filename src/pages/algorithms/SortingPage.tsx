import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlay, FiPause, FiRefreshCw, FiChevronsRight, FiChevronsLeft, FiClock, FiArrowRight, FiChevronDown } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray800};
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 800px;
  line-height: 1.6;
`;

const AlgorithmsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const AlgorithmGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
`;

const AlgorithmCard = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  transition: ${({ theme }) => theme.transitions.default};
  text-decoration: none;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AlgorithmTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.gray800};
`;

const AlgorithmDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

const ComingSoonBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primaryDark};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ComplexityInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray500};
`;

const ViewButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  font-size: 0.875rem;
`;

const AlgorithmsDropdown = styled.div`
  position: relative;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 300px;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.card};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
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
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 0 0 ${({ theme }) => theme.borderRadius} ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 10;
  transition: max-height 0.3s ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.gray800};
  text-decoration: none;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  }
`;

const SortingPage: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  // Sorting algorithms data
  const algorithms = [
    {
      name: "Bubble Sort",
      path: "/algorithms/sorting/bubble-sort",
      description: "A simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      implemented: true
    },
    {
      name: "Selection Sort",
      path: "/algorithms/sorting/selection-sort",
      description: "An in-place comparison sorting algorithm that divides the input list into two parts: a sorted sublist and an unsorted sublist.",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      implemented: true
    },
    {
      name: "Insertion Sort",
      path: "/algorithms/sorting/insertion-sort",
      description: "Builds the final sorted array one item at a time. Efficient for small data sets and mostly sorted arrays.",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      implemented: true
    },
    {
      name: "Merge Sort",
      path: "/algorithms/sorting/merge-sort",
      description: "An efficient, stable, comparison-based, divide and conquer algorithm. Divides the array into halves, sorts them, and then merges them.",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      implemented: true
    },
    {
      name: "Quicksort",
      path: "/algorithms/sorting/quick-sort",
      description: "A divide-and-conquer algorithm that works by selecting a 'pivot' element and partitioning the array around the pivot.",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(log n)",
      implemented: true
    },
    {
      name: "Counting Sort",
      path: "/algorithms/sorting/counting-sort",
      description: "An integer sorting algorithm that operates by counting the number of objects that have each distinct key value.",
      timeComplexity: "O(n+k)",
      spaceComplexity: "O(n+k)",
      implemented: true
    },
    {
      name: "Radix Sort",
      path: "/algorithms/sorting/radix-sort",
      description: "A non-comparative sorting algorithm that sorts data with integer keys by grouping keys by individual digits.",
      timeComplexity: "O(nk)",
      spaceComplexity: "O(n+k)",
      implemented: true
    },
    {
      name: "Bucket Sort",
      path: "/algorithms/sorting/bucket-sort",
      description: "A distribution sort that works by distributing the elements into a number of buckets, then sorting each bucket individually.",
      timeComplexity: "O(n+k)",
      spaceComplexity: "O(n)",
      implemented: true
    },
    {
      name: "Heap Sort",
      path: "/algorithms/sorting/heap-sort",
      description: "A comparison-based sorting algorithm that uses a binary heap data structure to sort elements.",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(1)",
      implemented: true
    },
    {
      name: "Shell Sort",
      path: "/algorithms/sorting/shell-sort",
      description: "An in-place comparison sort that generalizes insertion sort by allowing the exchange of items that are far apart.",
      timeComplexity: "O(n log² n)",
      spaceComplexity: "O(1)",
      implemented: true
    }
  ];
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.algorithms-dropdown')) {
      setDropdownOpen(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Sorting Algorithms</PageTitle>
        <PageDescription>
          Sorting algorithms are methods for reorganizing a sequence of items in a specific order.
          Explore various sorting algorithms and learn about their implementations, time and space complexities.
        </PageDescription>
      </PageHeader>
      
      <AlgorithmsDropdown className="algorithms-dropdown">
        <DropdownButton onClick={toggleDropdown}>
          <span>Select Sorting Algorithm</span>
          <FiChevronDown />
        </DropdownButton>
        <DropdownContent isOpen={dropdownOpen}>
          {algorithms.map((algorithm, index) => (
            <DropdownItem 
              key={index} 
              to={algorithm.path}
              onClick={() => setDropdownOpen(false)}
            >
              {algorithm.name}
            </DropdownItem>
          ))}
        </DropdownContent>
      </AlgorithmsDropdown>
      
      <AlgorithmsContainer>
        <AlgorithmGrid>
          {algorithms.map((algorithm, index) => (
            <AlgorithmCard key={index} to={algorithm.path}>
              <AlgorithmTitle>{algorithm.name}</AlgorithmTitle>
              <AlgorithmDescription>{algorithm.description}</AlgorithmDescription>
              <ComplexityInfo>
                Time: {algorithm.timeComplexity} | Space: {algorithm.spaceComplexity}
              </ComplexityInfo>
              <ViewButton>
                View Details <FiArrowRight size={14} />
              </ViewButton>
              {!algorithm.implemented && <ComingSoonBadge>Coming Soon</ComingSoonBadge>}
            </AlgorithmCard>
          ))}
        </AlgorithmGrid>
      </AlgorithmsContainer>
    </PageContainer>
  );
};

export default SortingPage;