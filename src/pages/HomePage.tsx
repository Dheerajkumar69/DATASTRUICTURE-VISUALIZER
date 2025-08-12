import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiDatabase, FiBarChart2, FiCode, FiLayers, FiGrid, FiLink, FiGitBranch, FiServer, FiList, FiHash, FiPieChart, FiSearch, FiAlignLeft } from 'react-icons/fi';
import { MobileGrid, MobileCard, TouchButton, responsive } from '../components/mobile/MobileOptimizations';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  
  ${responsive.mobile(`
    gap: 2rem;
  `)}
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.primaryDark});
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.cardBackground};
  margin-bottom: 2rem;
  
  ${responsive.mobile(`
    padding: 1.5rem 1rem;
    margin-bottom: 1.5rem;
  `)}
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 3rem;
  }
  
  ${responsive.mobile(`
    font-size: 2rem;
    margin-bottom: 0.75rem;
  `)}
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 800px;
  margin-bottom: 2rem;
  
  ${responsive.mobile(`
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  `)}
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: ${({ theme }) => theme.transitions.default};
  min-height: 44px;
  touch-action: manipulation;
  text-decoration: none;
  
  svg {
    margin-left: 0.5rem;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
    transform: translateY(-2px);
  }
  
  ${responsive.mobile(`
    padding: 1rem 2rem;
    font-size: 1.1rem;
  `)}
`;

const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled(MobileCard)`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  color: ${({ theme }) => theme.text};
  
  ${responsive.mobile(`
    padding: 1.25rem;
  `)}
`;

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.textLight};
  line-height: 1.6;
`;

const DataStructuresSection = styled.section`
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
`;

const DataStructureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const DataStructureCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.cardBackground};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: ${({ theme }) => theme.transitions.default};
  position: relative;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  min-height: 44px;
  touch-action: manipulation;
  
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.cardBackground};
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    
    h3, p {
      color: ${({ theme }) => theme.cardBackground};
    }
    
    p {
      color: white !important;
    }
  }
  
  ${responsive.mobile(`
    padding: 1.25rem;
  `)}
`;

const ComingSoonBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.cardBackground};
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  z-index: 1;
`;

const DataStructureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.primary};
`;

const DataStructureName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
`;

const DataStructureDescription = styled.p`
  color: ${({ theme }) => theme.textLight};
  text-align: center;
  font-size: 0.875rem;
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>Data Structure Visualizer</HeroTitle>
        <HeroSubtitle>
          A beautiful, interactive, and responsive tool for visualizing data structures and algorithms.
          Perfect for students, developers, and professionals alike.
        </HeroSubtitle>
        <CTAButton to="/data-structures/array">
          Get Started <FiArrowRight size={18} />
        </CTAButton>
      </HeroSection>
      
      <FeaturesSection>
        <FeatureCard>
          <FeatureIcon>
            <FiDatabase size={24} />
          </FeatureIcon>
          <FeatureTitle>Multiple Data Structures</FeatureTitle>
          <FeatureDescription>
            Visualize arrays, linked lists, stacks, queues, trees, graphs, hash tables, heaps, and more.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FiBarChart2 size={24} />
          </FeatureIcon>
          <FeatureTitle>Algorithm Animations</FeatureTitle>
          <FeatureDescription>
            Watch sorting and searching algorithms unfold step by step with detailed animations.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FiCode size={24} />
          </FeatureIcon>
          <FeatureTitle>Code Preview & Explanation</FeatureTitle>
          <FeatureDescription>
            Learn by seeing code alongside visual output with detailed explanations.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
      
      <DataStructuresSection>
        <SectionTitle>Explore Data Structures</SectionTitle>
        <DataStructureGrid>
          <DataStructureCard to="/data-structures/array">
            <DataStructureIcon>
              <FiLayers size={24} />
            </DataStructureIcon>
            <DataStructureName>Array</DataStructureName>
            <DataStructureDescription>
              Visualize operations on arrays and understand their time complexity.
            </DataStructureDescription>
          </DataStructureCard>
          
          <DataStructureCard to="/data-structures/linked-list">
            <DataStructureIcon>
              <FiLink size={24} />
            </DataStructureIcon>
            <DataStructureName>Linked List</DataStructureName>
            <DataStructureDescription>
              Explore singly and doubly linked lists with interactive visualizations.
            </DataStructureDescription>
          </DataStructureCard>
          
          <DataStructureCard to="/data-structures/stack">
            <DataStructureIcon>
              <FiServer size={24} />
            </DataStructureIcon>
            <DataStructureName>Stack</DataStructureName>
            <DataStructureDescription>
              Learn about LIFO data structure and its applications.
            </DataStructureDescription>
          </DataStructureCard>
          
          <DataStructureCard to="/data-structures/queue">
            <DataStructureIcon>
              <FiList size={24} />
            </DataStructureIcon>
            <DataStructureName>Queue</DataStructureName>
            <DataStructureDescription>
              Understand FIFO operations and queue implementations.
            </DataStructureDescription>
          </DataStructureCard>
          
          <DataStructureCard to="/data-structures/priority-queue">
            <DataStructureIcon>
              <FiServer size={24} />
            </DataStructureIcon>
            <DataStructureName>Priority Queue</DataStructureName>
            <DataStructureDescription>
              Explore priority-based queues implemented with binary heaps.
            </DataStructureDescription>
          </DataStructureCard>
          
          <DataStructureCard to="/data-structures/tree">
            <DataStructureIcon>
              <FiGitBranch size={24} />
            </DataStructureIcon>
            <DataStructureName>Tree</DataStructureName>
            <DataStructureDescription>
              Understand binary trees, BSTs, AVL trees, and tree traversals.
            </DataStructureDescription>
          </DataStructureCard>
          
          <DataStructureCard to="/data-structures/graph">
            <DataStructureIcon>
              <FiGrid size={24} />
            </DataStructureIcon>
            <DataStructureName>Graph</DataStructureName>
            <DataStructureDescription>
              Visualize graph algorithms like BFS, DFS, and shortest paths.
            </DataStructureDescription>
          </DataStructureCard>
          
          <DataStructureCard to="/data-structures/hash-table">
            <DataStructureIcon>
              <FiHash size={24} />
            </DataStructureIcon>
            <DataStructureName>Hash Table</DataStructureName>
            <DataStructureDescription>
              Learn about hash functions, collision resolution, and applications.
            </DataStructureDescription>
          </DataStructureCard>
          
          <DataStructureCard to="/data-structures/heap">
            <DataStructureIcon>
              <FiPieChart size={24} />
            </DataStructureIcon>
            <DataStructureName>Heap</DataStructureName>
            <DataStructureDescription>
              Explore min-heaps, max-heaps, and priority queue implementations.
            </DataStructureDescription>
          </DataStructureCard>
          
          <DataStructureCard to="/data-structures/trie">
            <DataStructureIcon>
              <FiAlignLeft size={24} />
            </DataStructureIcon>
            <DataStructureName>Trie</DataStructureName>
            <DataStructureDescription>
              Visualize prefix trees for efficient string operations and autocomplete.
            </DataStructureDescription>
          </DataStructureCard>
        </DataStructureGrid>
      </DataStructuresSection>
      
      <DataStructuresSection>
        <SectionTitle>Explore Algorithms</SectionTitle>
        <DataStructureGrid>
          <DataStructureCard to="/algorithms/sorting">
            <DataStructureIcon>
              <FiBarChart2 size={24} />
            </DataStructureIcon>
            <DataStructureName>Sorting Algorithms</DataStructureName>
            <DataStructureDescription>
              Visualize bubble sort, quick sort, merge sort, and more.
            </DataStructureDescription>
          </DataStructureCard>
          
          <DataStructureCard to="/algorithms/searching">
            <DataStructureIcon>
              <FiSearch size={24} />
            </DataStructureIcon>
            <DataStructureName>Searching Algorithms</DataStructureName>
            <DataStructureDescription>
              Learn about linear search, binary search, and other techniques.
            </DataStructureDescription>
          </DataStructureCard>
        </DataStructureGrid>
      </DataStructuresSection>
    </HomeContainer>
  );
};

export default HomePage; 