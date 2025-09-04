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
import { 
  FaChessQueen, 
  FaRoute, 
  FaPuzzlePiece, 
  FaProjectDiagram, 
  FaTree, 
  FaChessKnight, 
  FaSearchLocation, 
  FaGlobeAmericas, 
  FaRandom, 
  FaWater, 
  FaMapMarkerAlt, 
  FaDoorOpen, 
  FaCode 
} from 'react-icons/fa';

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
<<<<<<< HEAD
    background-color: ${({ theme }) => theme.colors.primaryDark};
    color: ${({ theme }) => theme.colors.card};
=======
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: white;
>>>>>>> parent of 5badfa4 (version 4.0.0)
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.card};
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
  color: ${({ theme }) => theme.colors.card};
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

const CategoryLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textLight};
  margin: 0.75rem 0 0.25rem;
  padding-left: 0.5rem;
  font-weight: 500;
  text-transform: uppercase;
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
<<<<<<< HEAD
    background-color: ${({ theme }) => theme.colors.primaryDark};
    color: ${({ theme }) => theme.colors.card};
=======
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: white;
>>>>>>> parent of 5badfa4 (version 4.0.0)
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.card};
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
  const [backtrackingAlgorithmsOpen, setBacktrackingAlgorithmsOpen] = useState(false);
  const [problemsAlgorithmsOpen, setProblemsAlgorithmsOpen] = useState(false);
  const [mathAlgorithmsOpen, setMathAlgorithmsOpen] = useState(false);
  const [arrayAlgorithmsOpen, setArrayAlgorithmsOpen] = useState(false);
  const [isSortingOpen, setIsSortingOpen] = useState(false);
  const [isDataStructuresOpen, setIsDataStructuresOpen] = useState(false); 
  const [isTreeAlgorithmsOpen, setIsTreeAlgorithmsOpen] = useState(false);
  const [isArrayAlgorithmsOpen, setIsArrayAlgorithmsOpen] = useState(false);
  const [isMathAlgorithmsOpen, setIsMathAlgorithmsOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Keyboard navigation handler
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { key, currentTarget } = event;
    
    if (key === 'Escape' && window.innerWidth <= 768) {
      setIsOpen(false);
      return;
    }

    if (key === 'Enter' || key === ' ') {
      if (currentTarget.getAttribute('role') === 'button') {
        event.preventDefault();
        (currentTarget as HTMLElement).click();
      }
    }
  };

  return (
    <>
      <SidebarContainer 
        isOpen={isOpen}
        role="navigation"
        aria-label="Main navigation"
        onKeyDown={handleKeyDown}
      >
        <SidebarHeader>
          <SidebarTitle id="navigation-title">Navigation</SidebarTitle>
          <CloseButton 
            onClick={toggleSidebar}
            aria-label="Close navigation menu"
            title="Close navigation menu"
          >
            <FiX size={20} aria-hidden="true" />
          </CloseButton>
        </SidebarHeader>
        <SidebarContent role="menu" aria-labelledby="navigation-title">
          <SidebarSection>
            <SectionHeader 
              isOpen={dataStructuresOpen} 
              onClick={() => setDataStructuresOpen(!dataStructuresOpen)}
              role="button"
              tabIndex={0}
              aria-expanded={dataStructuresOpen}
              aria-controls="data-structures-menu"
              aria-label="Toggle data structures section"
              onKeyDown={handleKeyDown}
            >
              <SectionTitle>
                <FiDatabase size={18} aria-hidden="true" />
                Data Structures
              </SectionTitle>
              {dataStructuresOpen ? 
                <FiChevronDown size={18} aria-hidden="true" /> : 
                <FiChevronRight size={18} aria-hidden="true" />
              }
            </SectionHeader>
            <SectionItems 
              isOpen={dataStructuresOpen} 
              id="data-structures-menu"
              role="group"
              aria-labelledby="data-structures-title"
            >
              <NavItem to="/data-structures/array" aria-label="Navigate to Array data structure">
                <FiList size={16} aria-hidden="true" />
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
              <NavItem to="/algorithms">
                <FiHome size={16} />
                All Algorithms
              </NavItem>
              
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
                isOpen={mathAlgorithmsOpen}
                onClick={() => setMathAlgorithmsOpen(!mathAlgorithmsOpen)}
              >
                <span>Math Algorithms</span>
                {mathAlgorithmsOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
              </SubSectionHeader>
              <NestedSectionItems isOpen={mathAlgorithmsOpen}>
                <NestedNavItem to="/algorithms/math/euclidean">
                  <FiHash size={14} />
                  Euclidean Algorithm
                </NestedNavItem>
                <NestedNavItem to="/algorithms/math/extended-euclidean">
                  <FiHash size={14} />
                  Extended Euclidean
                </NestedNavItem>
              </NestedSectionItems>
              
              <SubSectionHeader 
                isOpen={arrayAlgorithmsOpen}
                onClick={() => setArrayAlgorithmsOpen(!arrayAlgorithmsOpen)}
              >
                <span>Array Algorithms</span>
                {arrayAlgorithmsOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
              </SubSectionHeader>
              <NestedSectionItems isOpen={arrayAlgorithmsOpen}>
                <NestedNavItem to="/algorithms/array/kadane">
                  <FiList size={14} />
                  Kadane's Algorithm
                </NestedNavItem>
                <NestedNavItem to="/algorithms/array/sliding-window">
                  <FiList size={14} />
                  Sliding Window
                </NestedNavItem>
              </NestedSectionItems>
              
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
              
              <SubSectionHeader 
                isOpen={backtrackingAlgorithmsOpen}
                onClick={() => setBacktrackingAlgorithmsOpen(!backtrackingAlgorithmsOpen)}
              >
                <span>Backtracking</span>
                {backtrackingAlgorithmsOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
              </SubSectionHeader>
              <NestedSectionItems isOpen={backtrackingAlgorithmsOpen}>
                <NestedNavItem to="/algorithms/backtracking/nqueens">
                  <FaChessQueen size={14} />
                  N-Queens
                </NestedNavItem>
                <NestedNavItem to="/algorithms/backtracking/traveling-salesman">
                  <FaRoute size={14} />
                  Traveling Salesman
                </NestedNavItem>
              </NestedSectionItems>
              
              <SubSectionHeader 
                isOpen={problemsAlgorithmsOpen}
                onClick={() => setProblemsAlgorithmsOpen(!problemsAlgorithmsOpen)}
              >
                <span>Algorithm Problems</span>
                {problemsAlgorithmsOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
              </SubSectionHeader>
              <NestedSectionItems isOpen={problemsAlgorithmsOpen}>
                <NestedNavItem to="/algorithms/problems">
                  <FaPuzzlePiece size={14} />
                  All Problems
                </NestedNavItem>
                
                <CategoryLabel>Graph Problems</CategoryLabel>
                <NestedNavItem to="/algorithms/problems/undirected-cycle-detection">
                  <FaProjectDiagram size={14} />
                  Undirected Cycle Detection
                </NestedNavItem>
                <NestedNavItem to="/algorithms/problems/directed-cycle-detection">
                  <FaProjectDiagram size={14} />
                  Directed Cycle Detection
                </NestedNavItem>
                <NestedNavItem to="/algorithms/problems/eulerian-path">
                  <FaRoute size={14} />
                  Eulerian Path
                </NestedNavItem>
                <NestedNavItem to="/algorithms/problems/chinese-postman">
                  <FaGlobeAmericas size={14} />
                  Chinese Postman
                </NestedNavItem>
                <NestedNavItem to="/algorithms/problems/minimum-edges-feedback-arc">
                  <FaRandom size={14} />
                  Feedback Arc Set
                </NestedNavItem>
                <NestedNavItem to="/algorithms/problems/traveling-salesman">
                  <FaRoute size={14} />
                  Traveling Salesman
                </NestedNavItem>
                
                <CategoryLabel>Tree Problems</CategoryLabel>
                <NestedNavItem to="/algorithms/problems/lowest-common-ancestor">
                  <FaTree size={14} />
                  Lowest Common Ancestor
                </NestedNavItem>
                
                <CategoryLabel>Grid-Based Problems</CategoryLabel>
                <NestedNavItem to="/algorithms/problems/shortest-path-grid">
                  <FaSearchLocation size={14} />
                  Shortest Path in Grid
                </NestedNavItem>
                <NestedNavItem to="/algorithms/problems/minimum-knight-moves">
                  <FaChessKnight size={14} />
                  Knight Moves
                </NestedNavItem>
                <NestedNavItem to="/algorithms/problems/number-of-islands">
                  <FaWater size={14} />
                  Number of Islands
                </NestedNavItem>
                <NestedNavItem to="/algorithms/problems/flood-fill">
                  <FaMapMarkerAlt size={14} />
                  Flood Fill
                </NestedNavItem>
                <NestedNavItem to="/algorithms/problems/maze-solving">
                  <FaDoorOpen size={14} />
                  Maze Solving
                </NestedNavItem>
                <NestedNavItem to="/algorithms/problems/knights-tour">
                  <FaChessKnight size={14} />
                  Knight's Tour
                </NestedNavItem>
                
                <CategoryLabel>Other Problems</CategoryLabel>
                <NestedNavItem to="/algorithms/problems/word-ladder">
                  <FaCode size={14} />
                  Word Ladder
                </NestedNavItem>
              </NestedSectionItems>
            </SectionItems>
          </SidebarSection>
        </SidebarContent>
      </SidebarContainer>
      
      <MobileMenuButton 
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="navigation-sidebar"
        title={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        <FiMenu size={24} aria-hidden="true" />
      </MobileMenuButton>
    </>
  );
};

export default Sidebar; 