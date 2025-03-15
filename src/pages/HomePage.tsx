import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiDatabase, FiBarChart2, FiCode, FiLayers, FiGrid, FiLink, FiGitBranch, FiServer, FiList, FiHash, FiPieChart, FiSearch } from 'react-icons/fi';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryDark});
  border-radius: ${({ theme }) => theme.borderRadius};
  color: white;
  margin-bottom: 2rem;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 800px;
  margin-bottom: 2rem;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: ${({ theme }) => theme.transitions.default};
  
  svg {
    margin-left: 0.5rem;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
    transform: translateY(-2px);
  }
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

const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  line-height: 1.6;
`;

const DataStructuresSection = styled.section`
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.gray800};
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
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: ${({ theme }) => theme.transitions.default};
  position: relative;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    transform: translateY(-3px);
    
    p {
      color: rgba(255, 255, 255, 0.8);
    }
  }
`;

const ComingSoonBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
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
`;

const DataStructureName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const DataStructureDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
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
        </DataStructureGrid>
      </DataStructuresSection>
      
      <DataStructuresSection>
        <SectionTitle>Explore Algorithms</SectionTitle>
        <DataStructureGrid>
          <DataStructureCard to="/algorithms/sorting">
            <ComingSoonBadge>Coming Soon</ComingSoonBadge>
            <DataStructureIcon>
              <FiBarChart2 size={24} />
            </DataStructureIcon>
            <DataStructureName>Sorting Algorithms</DataStructureName>
            <DataStructureDescription>
              Visualize bubble sort, quick sort, merge sort, and more.
            </DataStructureDescription>
          </DataStructureCard>
          
          <DataStructureCard to="/algorithms/searching">
            <ComingSoonBadge>Coming Soon</ComingSoonBadge>
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