import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { 
  FiChevronDown, 
  FiChevronRight, 
  FiList, 
  FiLink, 
  FiLayers, 
  FiDatabase,
  FiGrid,
  FiHash,
  FiBarChart2,
  FiSearch,
  FiMenu,
  FiX,
  FiGitBranch,
  FiServer,
  FiAlignLeft,
  FiShuffle,
  FiFilter,
  FiArrowUp,
  FiArrowDown,
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiArrowUpRight,
  FiArrowDownRight,
  FiArrowUpLeft,
  FiArrowDownLeft,
  FiArrowRightCircle,
  FiArrowLeftCircle,
  FiGitMerge,
  FiCompass,
  FiGitCommit,
  FiHome
} from 'react-icons/fi';

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  width: 280px;
  background-color: ${({ theme }) => theme.colors.background};
  border-right: 1px solid ${({ theme }) => theme.colors.gray200};
  height: 100%;
  overflow-y: auto;
  transition: transform 0.3s ease;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    z-index: 100;
    transform: translateX(${({ isOpen }) => (isOpen ? '0' : '-100%')});
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const SidebarTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray800};
`;

const CloseButton = styled.button`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: ${({ theme }) => theme.borderRadius};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray100};
    }
  }
`;

const SidebarContent = styled.div`
  padding: 1rem;
`;

const SidebarSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionHeader = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray700};
  
  svg {
    margin-right: 0.5rem;
  }
`;

const SectionItems = styled.div<{ isOpen: boolean }>`
  margin-top: 0.5rem;
  padding-left: 1rem;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.gray600};
  transition: ${({ theme }) => theme.transitions.default};
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray900};
  }
  
  &.active {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: white;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      color: white;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 50;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const NestedSectionItems = styled.div<{ isOpen: boolean }>`
  margin-top: 0.5rem;
  padding-left: 1rem;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const NestedNavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.gray600};
  transition: ${({ theme }) => theme.transitions.default};
  font-size: 0.9rem;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray900};
  }
  
  &.active {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: white;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      color: white;
    }
  }
`;

const SubSectionHeader = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.gray700};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`;

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [dataStructuresOpen, setDataStructuresOpen] = useState(true);
  const [algorithmsOpen, setAlgorithmsOpen] = useState(true);
  const [sortingAlgorithmsOpen, setSortingAlgorithmsOpen] = useState(false);
  const [graphAlgorithmsOpen, setGraphAlgorithmsOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <SidebarTitle>Navigation</SidebarTitle>
          <CloseButton onClick={toggleSidebar}>
            <FiX size={20} />
          </CloseButton>
        </SidebarHeader>
        <SidebarContent>
          <SidebarSection>
            <SectionHeader 
              isOpen={dataStructuresOpen} 
              onClick={() => setDataStructuresOpen(!dataStructuresOpen)}
            >
              <SectionTitle>
                <FiDatabase size={18} />
                Data Structures
              </SectionTitle>
              {dataStructuresOpen ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
            </SectionHeader>
            <SectionItems isOpen={dataStructuresOpen}>
              <NavItem to="/data-structures/array">
                <FiList size={16} />
                Array
              </NavItem>
              <NavItem to="/data-structures/linked-list">
                <FiLink size={16} />
                Linked List
              </NavItem>
              <NavItem to="/data-structures/stack">
                <FiLayers size={16} />
                Stack
              </NavItem>
              <NavItem to="/data-structures/queue">
                <FiList size={16} />
                Queue
              </NavItem>
              <NavItem to="/data-structures/priority-queue">
                <FiServer size={16} />
                Priority Queue
              </NavItem>
              <NavItem to="/data-structures/tree">
                <FiGitBranch size={16} />
                Tree
              </NavItem>
              <NavItem to="/data-structures/graph">
                <FiGrid size={16} />
                Graph
              </NavItem>
              <NavItem to="/data-structures/hash-table">
                <FiHash size={16} />
                Hash Table
              </NavItem>
              <NavItem to="/data-structures/heap">
                <FiBarChart2 size={16} />
                Heap
              </NavItem>
              <NavItem to="/data-structures/trie">
                <FiAlignLeft size={16} />
                Trie
              </NavItem>
            </SectionItems>
          </SidebarSection>
          
          <SidebarSection>
            <SectionHeader 
              isOpen={algorithmsOpen} 
              onClick={() => setAlgorithmsOpen(!algorithmsOpen)}
            >
              <SectionTitle>
                <FiBarChart2 size={18} />
                Algorithms
              </SectionTitle>
              {algorithmsOpen ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
            </SectionHeader>
            <SectionItems isOpen={algorithmsOpen}>
              <SubSectionHeader 
                isOpen={sortingAlgorithmsOpen}
                onClick={() => setSortingAlgorithmsOpen(!sortingAlgorithmsOpen)}
              >
                <span>Sorting</span>
                {sortingAlgorithmsOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
              </SubSectionHeader>
              <NestedSectionItems isOpen={sortingAlgorithmsOpen}>
                <NestedNavItem to="/algorithms/sorting/bubble-sort">
                  <FiArrowUpRight size={14} />
                  Bubble Sort
                </NestedNavItem>
                <NestedNavItem to="/algorithms/sorting/selection-sort">
                  <FiArrowUpCircle size={14} />
                  Selection Sort
                </NestedNavItem>
                <NestedNavItem to="/algorithms/sorting/insertion-sort">
                  <FiArrowRightCircle size={14} />
                  Insertion Sort
                </NestedNavItem>
                <NestedNavItem to="/algorithms/sorting/merge-sort">
                  <FiGitMerge size={14} />
                  Merge Sort
                </NestedNavItem>
                <NestedNavItem to="/algorithms/sorting/quick-sort">
                  <FiArrowUpRight size={14} />
                  Quick Sort
                </NestedNavItem>
                <NestedNavItem to="/algorithms/sorting/heap-sort">
                  <FiArrowDownCircle size={14} />
                  Heap Sort
                </NestedNavItem>
                <NestedNavItem to="/algorithms/sorting/shell-sort">
                  <FiArrowLeftCircle size={14} />
                  Shell Sort
                </NestedNavItem>
                <NestedNavItem to="/algorithms/sorting/counting-sort">
                  <FiHash size={14} />
                  Counting Sort
                </NestedNavItem>
                <NestedNavItem to="/algorithms/sorting/radix-sort">
                  <FiFilter size={14} />
                  Radix Sort
                </NestedNavItem>
                <NestedNavItem to="/algorithms/sorting/bucket-sort">
                  <FiLayers size={14} />
                  Bucket Sort
                </NestedNavItem>
              </NestedSectionItems>
              
              <NavItem to="/algorithms/searching">
                <FiSearch size={16} />
                Searching
              </NavItem>
              
              <SubSectionHeader 
                isOpen={graphAlgorithmsOpen}
                onClick={() => setGraphAlgorithmsOpen(!graphAlgorithmsOpen)}
              >
                <span>Graph Algorithms</span>
                {graphAlgorithmsOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
              </SubSectionHeader>
              <NestedSectionItems isOpen={graphAlgorithmsOpen}>
                <NestedNavItem to="/algorithms/graph/astar">
                  <FiCompass size={14} />
                  A* Search
                </NestedNavItem>
                <NestedNavItem to="/algorithms/graph/kruskal">
                  <FiGitMerge size={14} />
                  Kruskal's Algorithm
                </NestedNavItem>
                <NestedNavItem to="/algorithms/graph/prim">
                  <FiGitCommit size={14} />
                  Prim's Algorithm
                </NestedNavItem>
              </NestedSectionItems>
            </SectionItems>
          </SidebarSection>
        </SidebarContent>
      </SidebarContainer>
      
      <MobileMenuButton onClick={toggleSidebar}>
        <FiMenu size={24} />
      </MobileMenuButton>
    </>
  );
};

export default Sidebar; 