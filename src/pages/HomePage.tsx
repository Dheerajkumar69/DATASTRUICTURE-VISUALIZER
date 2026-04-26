import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight, FiDatabase, FiBarChart2, FiCode, FiLayers, FiGrid, FiLink,
  FiGitBranch, FiServer, FiList, FiHash, FiPieChart, FiSearch, FiAlignLeft,
  FiPlay, FiZap, FiEye, FiCpu, FiSliders
} from 'react-icons/fi';
import { MobileGrid, MobileCard, TouchButton, responsive } from '../components/mobile/MobileOptimizations';

// ─── Keyframes ────────────────────────────────────────────────────────────────
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
`;

const barGrow = keyframes`
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
`;

// ─── Global containers ────────────────────────────────────────────────────────
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  ${responsive.mobile(`gap: 2.5rem;`)}
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────
const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  padding: 3rem 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    text-align: center;
  }

  ${responsive.mobile(`padding: 2rem 0;`)}
`;

const HeroLeft = styled.div``;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.25rem;

  span {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { font-size: 2.5rem; }
  ${responsive.mobile(`font-size: 2rem;`)}
`;

const HeroSubtitle = styled.p`
  font-size: 1.15rem;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) { margin: 0 auto 2rem; }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) { justify-content: center; }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.75rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 4px 16px ${({ theme }) => theme.colors.primary}40;

  &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px ${({ theme }) => theme.colors.primary}60; }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.75rem;
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;

  &:hover { transform: translateY(-2px); background: ${({ theme }) => theme.colors.hover}; }
`;

// ─── Live Mini Sorting Demo (right side of hero) ───────────────────────────────
const DemoCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  animation: ${float} 4s ease-in-out infinite;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) { display: none; }
`;

const DemoTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const BarsContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 140px;
  padding: 0 0.25rem;
`;

const DemoBar = styled.div<{ height: number; color: string }>`
  flex: 1;
  height: ${({ height }) => height}%;
  background: ${({ color }) => color};
  border-radius: 4px 4px 0 0;
  transform-origin: bottom;
  animation: ${barGrow} 0.6s ease-out forwards;
  transition: height 0.4s ease;
`;

const DemoStep = styled.div`
  margin-top: 1rem;
  padding: 0.6rem 0.75rem;
  background: ${({ theme }) => theme.colors.primary}15;
  border-radius: 8px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`;

// ─── Feature Cards ─────────────────────────────────────────────────────────────
const FeaturesGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { grid-template-columns: 1fr 1fr; }
  ${responsive.mobile(`grid-template-columns: 1fr;`)}
`;

const FeatureCard = styled(MobileCard)`
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-4px); box-shadow: ${({ theme }) => theme.shadows.lg}; }
`;

const FeatureIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeatureTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const FeatureDesc = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
`;

// ─── Data Structures Grid ──────────────────────────────────────────────────────
const SectionHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.4rem;
`;

const SectionSubtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const DSGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { grid-template-columns: repeat(2, 1fr); }
  ${responsive.mobile(`grid-template-columns: 1fr 1fr;`)}
`;

const DSCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 1.5rem 1rem;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s;
  text-align: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary}08;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px ${({ theme }) => theme.colors.primary}20;
  }
`;

const DSIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
`;

const DSName = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const DSDesc = styled.p`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.4;
`;

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 2.5rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border-radius: 16px;
  color: white;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { grid-template-columns: repeat(2, 1fr); }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNum = styled.div`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.3rem;
`;

const StatLbl = styled.div`
  font-size: 0.85rem;
  opacity: 0.85;
  font-weight: 500;
`;

// ─── CTA Banner ───────────────────────────────────────────────────────────────
const CTABanner = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const CTASubtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 550px;
`;

// ─── Live sorting demo data ────────────────────────────────────────────────────
const DEMO_FRAMES = [
  { bars: [85, 40, 65, 20, 90, 55, 30, 75], step: 'Comparing 85 and 40…', active: [0,1] },
  { bars: [40, 85, 65, 20, 90, 55, 30, 75], step: 'Swapped! 40 moves left', active: [0,1] },
  { bars: [40, 65, 85, 20, 90, 55, 30, 75], step: 'Comparing 85 and 65…', active: [1,2] },
  { bars: [40, 65, 20, 85, 90, 55, 30, 75], step: 'Swapped! 85 → position 3', active: [2,3] },
  { bars: [40, 65, 20, 85, 55, 90, 30, 75], step: 'Comparing 90 and 55…', active: [4,5] },
  { bars: [40, 20, 65, 55, 85, 30, 75, 90], step: '90 bubbled to the end ✓', active: [7] },
  { bars: [20, 40, 55, 65, 30, 75, 85, 90], step: 'Pass 3 complete!', active: [6,7] },
  { bars: [20, 40, 55, 30, 65, 75, 85, 90], step: 'Almost sorted…', active: [3,4] },
  { bars: [20, 30, 40, 55, 65, 75, 85, 90], step: '🎉 Array fully sorted!', active: [] },
];

const BAR_COLORS = (index: number, active: number[], frame: number) => {
  if (frame === DEMO_FRAMES.length - 1) return '#22c55e'; // green when sorted
  if (active.includes(index)) return '#f59e0b'; // yellow for comparing
  return '#6366f1'; // indigo default
};

// ─── Component ────────────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const [demoFrame, setDemoFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setDemoFrame(f => (f + 1) % DEMO_FRAMES.length);
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const frame = DEMO_FRAMES[demoFrame];

  return (
    <HomeContainer>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <HeroSection>
        <HeroLeft>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <HeroBadge><FiZap size={12} /> Interactive Learning</HeroBadge>
            <HeroTitle>
              Learn DSA <span>Visually</span>,<br />Not Theoretically
            </HeroTitle>
            <HeroSubtitle>
              Step through algorithms one operation at a time. See which line of code
              executes, watch the data structure transform, and understand <em>why</em> it works —
              not just that it does.
            </HeroSubtitle>
            <ButtonRow>
              <PrimaryButton to="/data-structures/array">
                <FiPlay size={16} /> Start Visualizing
              </PrimaryButton>
              <SecondaryButton to="/algorithms/sorting/bubble-sort">
                <FiEye size={16} /> Watch Bubble Sort
              </SecondaryButton>
            </ButtonRow>
          </motion.div>
        </HeroLeft>

        {/* Live mini demo */}
        <DemoCard
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <DemoTitle>🎬 Live Demo — Bubble Sort</DemoTitle>
          <BarsContainer>
            {frame.bars.map((h, i) => (
              <DemoBar key={i} height={h} color={BAR_COLORS(i, frame.active, demoFrame)} />
            ))}
          </BarsContainer>
          <DemoStep>{frame.step}</DemoStep>
        </DemoCard>
      </HeroSection>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>
          <SectionTitle>Everything you need to master DSA</SectionTitle>
          <SectionSubtitle>From interactive visualizations to multi-language code examples</SectionSubtitle>
        </SectionHeader>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon><FiEye size={20} /></FeatureIcon>
            <FeatureTitle>Step-by-Step Animations</FeatureTitle>
            <FeatureDesc>
              Play, pause, step forward and backward through every operation. See exactly
              what changes at each moment with colour-coded elements.
            </FeatureDesc>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><FiCode size={20} /></FeatureIcon>
            <FeatureTitle>Live Code Highlighting</FeatureTitle>
            <FeatureDesc>
              As the algorithm runs, the corresponding line of pseudocode highlights in
              real time — so you always know <em>what</em> the computer is doing.
            </FeatureDesc>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><FiSliders size={20} /></FeatureIcon>
            <FeatureTitle>Speed & Size Control</FeatureTitle>
            <FeatureDesc>
              Adjust animation speed from super-slow (1 step/2s) to blazing fast.
              Choose array size, enter custom values, or generate random data.
            </FeatureDesc>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><FiCpu size={20} /></FeatureIcon>
            <FeatureTitle>Multi-Language Code</FeatureTitle>
            <FeatureDesc>
              View implementations in JavaScript, Python, Java, and C++ side-by-side
              with full syntax highlighting and complexity analysis.
            </FeatureDesc>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><FiGitBranch size={20} /></FeatureIcon>
            <FeatureTitle>Graph Algorithms</FeatureTitle>
            <FeatureDesc>
              Interactive canvas-based graph visualizations for Dijkstra, BFS, DFS
              with step-by-step shortest path discovery.
            </FeatureDesc>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><FiDatabase size={20} /></FeatureIcon>
            <FeatureTitle>10+ Data Structures</FeatureTitle>
            <FeatureDesc>
              Array, Linked List, Stack, Queue, Tree, Graph, Heap, Hash Table, Trie,
              Priority Queue — all with interactive operations.
            </FeatureDesc>
          </FeatureCard>
        </FeaturesGrid>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <StatsBar>
        <StatItem>
          <StatNum>10+</StatNum>
          <StatLbl>Data Structures</StatLbl>
        </StatItem>
        <StatItem>
          <StatNum>40+</StatNum>
          <StatLbl>Algorithms</StatLbl>
        </StatItem>
        <StatItem>
          <StatNum>4</StatNum>
          <StatLbl>Languages</StatLbl>
        </StatItem>
        <StatItem>
          <StatNum>100%</StatNum>
          <StatLbl>Free & Open Source</StatLbl>
        </StatItem>
      </StatsBar>

      {/* ── Data Structures grid ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>
          <SectionTitle>Explore Data Structures</SectionTitle>
          <SectionSubtitle>Click any card to start an interactive visualization</SectionSubtitle>
        </SectionHeader>
        <DSGrid>
          {[
            { to: '/data-structures/array',         icon: <FiLayers size={18}/>,   name: 'Array',          desc: 'Insert, delete, search in O(1)–O(n)' },
            { to: '/data-structures/linked-list',   icon: <FiLink size={18}/>,     name: 'Linked List',    desc: 'Singly & doubly linked nodes' },
            { to: '/data-structures/stack',         icon: <FiServer size={18}/>,   name: 'Stack',          desc: 'LIFO push, pop, peek operations' },
            { to: '/data-structures/queue',         icon: <FiList size={18}/>,     name: 'Queue',          desc: 'FIFO enqueue and dequeue' },
            { to: '/data-structures/priority-queue',icon: <FiServer size={18}/>,   name: 'Priority Queue', desc: 'Min-heap based priority' },
            { to: '/data-structures/tree',          icon: <FiGitBranch size={18}/>,name: 'Tree',           desc: 'BST, AVL, traversals' },
            { to: '/data-structures/graph',         icon: <FiGrid size={18}/>,     name: 'Graph',          desc: 'Adjacency list & matrix' },
            { to: '/data-structures/hash-table',    icon: <FiHash size={18}/>,     name: 'Hash Table',     desc: 'Hashing & collision resolution' },
            { to: '/data-structures/heap',          icon: <FiPieChart size={18}/>, name: 'Heap',           desc: 'Min-heap and max-heap' },
            { to: '/data-structures/trie',          icon: <FiAlignLeft size={18}/>,name: 'Trie',           desc: 'Prefix trees & autocomplete' },
          ].map(ds => (
            <DSCard key={ds.to} to={ds.to}>
              <DSIcon>{ds.icon}</DSIcon>
              <DSName>{ds.name}</DSName>
              <DSDesc>{ds.desc}</DSDesc>
            </DSCard>
          ))}
        </DSGrid>
      </section>

      {/* ── Algorithms ───────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>
          <SectionTitle>Explore Algorithms</SectionTitle>
          <SectionSubtitle>Animated step-by-step with live code highlighting</SectionSubtitle>
        </SectionHeader>
        <DSGrid>
          {[
            { to: '/algorithms/sorting',     icon: <FiBarChart2 size={18}/>, name: 'Sorting',    desc: 'Bubble, Quick, Merge, Heap, Shell…' },
            { to: '/algorithms/searching',   icon: <FiSearch size={18}/>,    name: 'Searching',  desc: 'Linear, Binary, Exponential search' },
            { to: '/algorithms/graph/bfs',   icon: <FiGrid size={18}/>,      name: 'BFS',        desc: 'Breadth-first traversal' },
            { to: '/algorithms/graph/dfs',   icon: <FiGitBranch size={18}/>, name: 'DFS',        desc: 'Depth-first traversal & backtacking' },
            { to: '/algorithms/graph/dijkstra', icon: <FiZap size={18}/>,   name: "Dijkstra's",  desc: 'Shortest path with priority queue' },
          ].map(algo => (
            <DSCard key={algo.to} to={algo.to}>
              <DSIcon>{algo.icon}</DSIcon>
              <DSName>{algo.name}</DSName>
              <DSDesc>{algo.desc}</DSDesc>
            </DSCard>
          ))}
        </DSGrid>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <CTABanner>
        <CTATitle>Ready to learn by seeing?</CTATitle>
        <CTASubtitle>
          Pick any algorithm or data structure and watch it come alive.
          No installation, no account — just open and go.
        </CTASubtitle>
        <PrimaryButton to="/data-structures/array">
          <FiArrowRight size={16} /> Get Started — It's Free
        </PrimaryButton>
      </CTABanner>
    </HomeContainer>
  );
};

export default HomePage;