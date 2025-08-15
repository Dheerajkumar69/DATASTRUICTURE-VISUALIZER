import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiDatabase, FiBarChart2, FiCode, FiLayers, FiGrid, FiLink, FiGitBranch, FiServer, FiList, FiHash, FiPieChart, FiSearch, FiAlignLeft, FiPlay, FiUsers, FiTrendingUp, FiAward, FiStar, FiZap } from 'react-icons/fi';
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

// Advanced animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(100, 200, 255, 0.3); }
  50% { box-shadow: 0 0 30px rgba(100, 200, 255, 0.6); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`;

// New Premium Components
const InteractiveDemo = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  color: white;
  text-align: center;
  animation: ${glow} 3s ease-in-out infinite;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;
`;

const StatCard = styled(motion.div)`
  background: ${({ theme }) => theme.cardBackground};
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.border};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.5rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.textLight};
  font-weight: 500;
`;

const TestimonialsSection = styled.section`
  margin: 4rem 0;
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const TestimonialCard = styled(motion.div)`
  background: ${({ theme }) => theme.cardBackground};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.border};
  position: relative;
  
  &::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 20px;
    font-size: 4rem;
    color: ${({ theme }) => theme.primary};
    opacity: 0.3;
  }
`;

const TestimonialText = styled.p`
  color: ${({ theme }) => theme.text};
  font-style: italic;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
  }
  
  .info {
    .name {
      font-weight: 600;
      color: ${({ theme }) => theme.text};
    }
    .title {
      color: ${({ theme }) => theme.textLight};
      font-size: 0.875rem;
    }
  }
`;

const LiveStatsDisplay = styled(motion.div)`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  color: white;
  text-align: center;
`;

const HomePage: React.FC = () => {
  const [stats, setStats] = useState({
    algorithms: 45,
    dataStructures: 12,
    users: 10000,
    visualizations: 50000
  });
  
  const [currentDemo, setCurrentDemo] = useState(0);
  
  useEffect(() => {
    // Animate numbers on mount
    const timer = setTimeout(() => {
      setStats({
        algorithms: 45,
        dataStructures: 12,
        users: 10247,
        visualizations: 52891
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const testimonials = [
    {
      text: "This visualizer completely transformed how I understand algorithms. The interactive demos make complex concepts crystal clear!",
      author: "Sarah Chen",
      title: "Computer Science Student, MIT",
      avatar: "SC"
    },
    {
      text: "As a software engineer, this tool helps me explain algorithms to my team. The performance comparisons are incredibly detailed.",
      author: "Marcus Johnson",
      title: "Senior Software Engineer, Google",
      avatar: "MJ"
    },
    {
      text: "I use this in my data structures course. Students love the real-time visualizations and code examples in multiple languages.",
      author: "Dr. Emily Rodriguez",
      title: "Professor, Stanford University",
      avatar: "ER"
    }
  ];
  
  return (
    <HomeContainer>
      <HeroSection>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>Data Structure Visualizer</HeroTitle>
          <HeroSubtitle>
            The world's most advanced interactive learning platform for data structures and algorithms.
            Trusted by 10,000+ students and professionals worldwide.
          </HeroSubtitle>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <CTAButton to="/data-structures/array">
              <FiPlay /> Start Learning
            </CTAButton>
            <CTAButton to="/demo" style={{ background: 'transparent', border: '2px solid white' }}>
              <FiZap /> Live Demo
            </CTAButton>
          </div>
        </motion.div>
      </HeroSection>
      
      <InteractiveDemo
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>🚀 Try it Live!</h3>
        <p>Watch algorithms come to life with real-time visualizations</p>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: 'inline-block', margin: '1rem', fontSize: '2rem' }}
        >
          📊📈📉
        </motion.div>
      </InteractiveDemo>
      
      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatNumber>{stats.algorithms}</StatNumber>
          <StatLabel>Algorithms</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StatNumber>{stats.dataStructures}</StatNumber>
          <StatLabel>Data Structures</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <StatNumber>{stats.users.toLocaleString()}</StatNumber>
          <StatLabel>Happy Users</StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <StatNumber>{stats.visualizations.toLocaleString()}</StatNumber>
          <StatLabel>Visualizations Created</StatLabel>
        </StatCard>
      </StatsGrid>
      
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
      
      <TestimonialsSection>
        <SectionTitle style={{ textAlign: 'center' }}>What Our Users Say</SectionTitle>
        <TestimonialGrid>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <TestimonialText>{testimonial.text}</TestimonialText>
              <TestimonialAuthor>
                <div className="avatar">{testimonial.avatar}</div>
                <div className="info">
                  <div className="name">{testimonial.author}</div>
                  <div className="title">{testimonial.title}</div>
                </div>
              </TestimonialAuthor>
            </TestimonialCard>
          ))}
        </TestimonialGrid>
      </TestimonialsSection>
      
      <LiveStatsDisplay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
          🏆 Join the Learning Revolution
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>99%</div>
            <div style={{ fontSize: '0.9rem' }}>Success Rate</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>4.9/5</div>
            <div style={{ fontSize: '0.9rem' }}>User Rating</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>24/7</div>
            <div style={{ fontSize: '0.9rem' }}>Available</div>
          </div>
        </div>
      </LiveStatsDisplay>
      
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