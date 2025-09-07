import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { FiPlay, FiPause, FiRotateCcw, FiLayers } from 'react-icons/fi';
import SimpleProblemPageTemplate from '../../../components/templates/SimpleProblemPageTemplate';

const VisualizationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.md};
`;

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
  position: relative;
`;

const TimelineRow = styled.div<{ isActive: boolean; isMerged: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => 
    props.isMerged ? '#D1FAE5' :
    props.isActive ? '#FEF3C7' : 
    props.theme.colors.card};
  border: 2px solid ${props => 
    props.isMerged ? '#10B981' :
    props.isActive ? '#F59E0B' : 
    props.theme.colors.border};
  transition: all 0.3s ease;
  
  transform: ${props => props.isActive ? 'scale(1.02)' : 'scale(1)'};
`;

const IntervalLabel = styled.div`
  min-width: 100px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const TimelineBar = styled.div`
  flex: 1;
  height: 40px;
  position: relative;
  background: linear-gradient(to right, #F3F4F6 0%, #E5E7EB 100%);
  border-radius: 4px;
  overflow: hidden;
`;

const TimelineScale = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${props => props.theme.colors.textLight};
  margin: 0.5rem 0;
  padding: 0 1rem;
`;

const IntervalBar = styled.div<{ 
  start: number; 
  end: number; 
  maxValue: number;
  color: string;
  isActive?: boolean;
}>`
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: ${props => (props.start / props.maxValue) * 100}%;
  width: ${props => ((props.end - props.start) / props.maxValue) * 100}%;
  background-color: ${props => props.color};
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.card};
  font-weight: 600;
  font-size: 12px;
  transition: all 0.3s ease;
  
  ${props => props.isActive && `
    animation: pulse 0.5s infinite alternate;
    @keyframes pulse {
      from { transform: scaleY(0.9); }
      to { transform: scaleY(1.1); }
    }
  `}
`;

const StatsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.card};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const ControlButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius};
  font-weight: 600;
  transition: all 0.2s ease;
  
  background-color: ${props => 
    props.variant === 'primary' ? props.theme.colors.primary : props.theme.colors.card};
  color: ${props => 
    props.variant === 'primary' ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => 
    props.variant === 'primary' ? props.theme.colors.primary : props.theme.colors.border};
  
  &:hover {
    background-color: ${props => 
      props.variant === 'primary' ? props.theme.colors.primaryDark : props.theme.colors.hover};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

const Input = styled.textarea`
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  width: 300px;
  height: 80px;
  resize: vertical;
  font-family: monospace;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 250px;
  }
`;

const AlgorithmExplanation = styled.div`
  background-color: ${props => props.theme.colors.card};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${props => props.theme.colors.border};
  margin: 2rem 0;
`;

const SectionTitle = styled.h4`
  color: ${props => props.theme.colors.text};
  margin: 1rem 0;
  text-align: center;
`;

interface Interval {
  start: number;
  end: number;
  id: number;
}

const MergeIntervalsPage: React.FC = () => {
  const [intervals, setIntervals] = useState<Interval[]>([
    { start: 1, end: 3, id: 0 },
    { start: 2, end: 6, id: 1 },
    { start: 8, end: 10, id: 2 },
    { start: 15, end: 18, id: 3 }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mergedIntervals, setMergedIntervals] = useState<Interval[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [inputIntervals, setInputIntervals] = useState('');
  const [sortedIntervals, setSortedIntervals] = useState<Interval[]>([]);
  const [currentPhase, setCurrentPhase] = useState<'sorting' | 'merging' | 'completed'>('sorting');

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setMergedIntervals([]);
    setIsPlaying(false);
    setIsCompleted(false);
    setCurrentPhase('sorting');
    
    // Sort intervals by start time
    const sorted = [...intervals].sort((a, b) => a.start - b.start);
    setSortedIntervals(sorted);
  }, [intervals]);

  const step = useCallback(() => {
    if (currentPhase === 'sorting') {
      setCurrentPhase('merging');
      setMergedIntervals([sortedIntervals[0]]);
      setCurrentIndex(1);
      return;
    }

    if (currentPhase === 'merging') {
      if (currentIndex >= sortedIntervals.length) {
        setCurrentPhase('completed');
        setIsCompleted(true);
        setIsPlaying(false);
        return;
      }

      const currentInterval = sortedIntervals[currentIndex];
      const lastMerged = mergedIntervals[mergedIntervals.length - 1];

      if (currentInterval.start <= lastMerged.end) {
        // Merge intervals
        const newMerged = [...mergedIntervals];
        newMerged[newMerged.length - 1] = {
          ...lastMerged,
          end: Math.max(lastMerged.end, currentInterval.end)
        };
        setMergedIntervals(newMerged);
      } else {
        // Add as new interval
        setMergedIntervals([...mergedIntervals, currentInterval]);
      }

      setCurrentIndex(currentIndex + 1);

      if (currentIndex + 1 >= sortedIntervals.length) {
        setCurrentPhase('completed');
        setIsCompleted(true);
        setIsPlaying(false);
      }
    }
  }, [currentPhase, currentIndex, sortedIntervals, mergedIntervals]);

  const play = useCallback(() => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      step();
    }, 1200);

    const checkCompletion = setInterval(() => {
      if (isCompleted) {
        clearInterval(interval);
        clearInterval(checkCompletion);
        setIsPlaying(false);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(checkCompletion);
    };
  }, [step, isCompleted]);

  const handleIntervalsInput = (value: string) => {
    try {
      const lines = value.trim().split('\n');
      const newIntervals: Interval[] = [];
      
      lines.forEach((line, index) => {
        const match = line.match(/\[(\d+),\s*(\d+)\]/);
        if (match) {
          newIntervals.push({
            start: parseInt(match[1]),
            end: parseInt(match[2]),
            id: index
          });
        }
      });

      if (newIntervals.length > 0) {
        setIntervals(newIntervals);
        setInputIntervals('');
      }
    } catch (error) {
      console.error('Invalid intervals input');
    }
  };

  const generateRandomIntervals = () => {
    const count = Math.floor(Math.random() * 4) + 3;
    const newIntervals: Interval[] = [];
    
    for (let i = 0; i < count; i++) {
      const start = Math.floor(Math.random() * 15) + 1;
      const end = start + Math.floor(Math.random() * 5) + 1;
      newIntervals.push({ start, end, id: i });
    }
    
    setIntervals(newIntervals);
  };

  React.useEffect(() => {
    reset();
  }, [intervals, reset]);

  const maxValue = Math.max(...intervals.map(i => i.end), ...mergedIntervals.map(i => i.end)) + 2;
  const scaleMarks = Array.from({ length: 6 }, (_, i) => Math.floor((i * maxValue) / 5));

  const getIntervalColor = (index: number) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    return colors[index % colors.length];
  };

  const problemData = {
    title: "Merge Intervals",
    subtitle: "Merge all overlapping intervals",
    difficulty: "Medium",
    category: "Array / Sorting",
    description: "Given an array of intervals, merge all overlapping intervals and return the result.",
    timeComplexity: "O(n log n) due to sorting",
    spaceComplexity: "O(n) for the result array",
    approach: "Sort intervals by start time, then merge overlapping intervals"
  };

  return (
    <SimpleProblemPageTemplate 
      problemData={problemData}
    >
      <VisualizationContainer>
        <InputContainer>
          <Input
            placeholder={`Enter intervals, one per line:
[1,3]
[2,6]
[8,10]
[15,18]`}
            value={inputIntervals}
            onChange={(e) => setInputIntervals(e.target.value)}
          />
          <ControlButton onClick={() => handleIntervalsInput(inputIntervals)}>
            Set Intervals
          </ControlButton>
          <ControlButton onClick={generateRandomIntervals}>
            Random Intervals
          </ControlButton>
        </InputContainer>

        <div>
          <SectionTitle>Original Intervals</SectionTitle>
          <TimelineContainer>
            {intervals.map((interval, index) => (
              <TimelineRow key={`orig-${interval.id}`} isActive={false} isMerged={false}>
                <IntervalLabel>[{interval.start}, {interval.end}]</IntervalLabel>
                <TimelineBar>
                  <IntervalBar
                    start={interval.start}
                    end={interval.end}
                    maxValue={maxValue}
                    color={getIntervalColor(index)}
                  >
                    [{interval.start}, {interval.end}]
                  </IntervalBar>
                </TimelineBar>
              </TimelineRow>
            ))}
            <TimelineScale>
              {scaleMarks.map((mark, i) => (
                <span key={i}>{mark}</span>
              ))}
            </TimelineScale>
          </TimelineContainer>
        </div>

        {currentPhase === 'merging' && (
          <div>
            <SectionTitle>Sorted Intervals (Processing)</SectionTitle>
            <TimelineContainer>
              {sortedIntervals.map((interval, index) => (
                <TimelineRow 
                  key={`sorted-${interval.id}`} 
                  isActive={index === currentIndex}
                  isMerged={index < currentIndex}
                >
                  <IntervalLabel>[{interval.start}, {interval.end}]</IntervalLabel>
                  <TimelineBar>
                    <IntervalBar
                      start={interval.start}
                      end={interval.end}
                      maxValue={maxValue}
                      color={index < currentIndex ? '#10B981' : 
                             index === currentIndex ? '#F59E0B' : getIntervalColor(index)}
                      isActive={index === currentIndex}
                    >
                      [{interval.start}, {interval.end}]
                    </IntervalBar>
                  </TimelineBar>
                </TimelineRow>
              ))}
              <TimelineScale>
                {scaleMarks.map((mark, i) => (
                  <span key={i}>{mark}</span>
                ))}
              </TimelineScale>
            </TimelineContainer>
          </div>
        )}

        {mergedIntervals.length > 0 && (
          <div>
            <SectionTitle>Merged Intervals</SectionTitle>
            <TimelineContainer>
              {mergedIntervals.map((interval, index) => (
                <TimelineRow key={`merged-${index}`} isActive={false} isMerged={true}>
                  <IntervalLabel>[{interval.start}, {interval.end}]</IntervalLabel>
                  <TimelineBar>
                    <IntervalBar
                      start={interval.start}
                      end={interval.end}
                      maxValue={maxValue}
                      color="#10B981"
                    >
                      [{interval.start}, {interval.end}]
                    </IntervalBar>
                  </TimelineBar>
                </TimelineRow>
              ))}
              <TimelineScale>
                {scaleMarks.map((mark, i) => (
                  <span key={i}>{mark}</span>
                ))}
              </TimelineScale>
            </TimelineContainer>
          </div>
        )}

        <StatsPanel>
          <StatCard>
            <StatLabel>Original Count</StatLabel>
            <StatValue>{intervals.length}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Current Phase</StatLabel>
            <StatValue style={{ fontSize: '1rem' }}>
              {currentPhase === 'sorting' ? 'Sorting' :
               currentPhase === 'merging' ? 'Merging' : 'Completed'}
            </StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Processing Index</StatLabel>
            <StatValue>{currentIndex} / {sortedIntervals.length}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Merged Count</StatLabel>
            <StatValue style={{ color: '#10B981' }}>{mergedIntervals.length}</StatValue>
          </StatCard>
        </StatsPanel>

        <ControlsContainer>
          <ControlButton
            variant="primary"
            onClick={isPlaying ? () => setIsPlaying(false) : play}
            disabled={isCompleted}
          >
            {isPlaying ? <FiPause /> : <FiPlay />}
            {isPlaying ? 'Pause' : 'Play'}
          </ControlButton>
          <ControlButton onClick={step} disabled={isPlaying || isCompleted}>
            Step
          </ControlButton>
          <ControlButton onClick={reset}>
            <FiRotateCcw />
            Reset
          </ControlButton>
        </ControlsContainer>

        <AlgorithmExplanation>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiLayers />
            Merge Intervals Algorithm
          </h3>
          
          <h4 style={{ marginBottom: '0.5rem' }}>Algorithm Steps:</h4>
          <ol style={{ marginLeft: '2rem', marginBottom: '1rem', lineHeight: 1.8 }}>
            <li><strong>Sort intervals</strong> by their start times</li>
            <li><strong>Initialize result</strong> with the first interval</li>
            <li>For each remaining interval:
              <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
                <li>If it overlaps with the last merged interval, merge them</li>
                <li>Otherwise, add it as a new interval to the result</li>
              </ul>
            </li>
          </ol>
          
          <h4 style={{ marginBottom: '0.5rem' }}>Key Insight:</h4>
          <p style={{ lineHeight: 1.6 }}>
            Two intervals [a, b] and [c, d] overlap if and only if max(a, c) ≤ min(b, d).
            After sorting, we only need to check if the current interval's start is ≤ the last merged interval's end.
          </p>
        </AlgorithmExplanation>
      </VisualizationContainer>
    </SimpleProblemPageTemplate>
  );
};

export default MergeIntervalsPage;
