import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileEntry {
  id: string;
  functionName: string;
  startTime: number;
  endTime: number;
  duration: number;
  callCount: number;
  totalDuration: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  parentFunction?: string;
  depth: number;
  memoryUsage?: number;
  cpuUsage?: number;
}

interface CallStackEntry {
  functionName: string;
  startTime: number;
  depth: number;
  children: CallStackEntry[];
}

interface ProfilingSession {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  totalDuration: number;
  entries: ProfileEntry[];
  callStack: CallStackEntry[];
}

interface HotSpot {
  functionName: string;
  totalTime: number;
  percentage: number;
  callCount: number;
  avgTime: number;
}

const ProfilerContainer = styled(motion.div)`
  background: ${({ theme }) => theme.background};
  border-radius: 12px;
  padding: 24px;
  margin: 16px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.border};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  
  h2 {
    color: ${({ theme }) => theme.text};
    font-size: 1.5rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  background: ${({ variant, theme }) => {
    switch (variant) {
      case 'primary': return theme.primary;
      case 'success': return '#22c55e';
      case 'danger': return '#ef4444';
      default: return theme.cardBackground;
    }
  }};
  
  color: ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
      case 'success':
      case 'danger': return 'white';
      default: return theme.text;
    }
  }};
  
  border: ${({ variant, theme }) => 
    variant === 'secondary' ? `1px solid ${theme.border}` : 'none'
  };
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusIndicator = styled.div<{ isRecording: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  background: ${({ isRecording }) => isRecording ? '#22c55e20' : '#6b728020'};
  border: 1px solid ${({ isRecording }) => isRecording ? '#22c55e' : '#6b7280'};
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ isRecording }) => isRecording ? '#22c55e' : '#6b7280'};
    animation: ${({ isRecording }) => isRecording ? 'pulse 1s infinite' : 'none'};
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Tab = styled(motion.button)<{ isActive: boolean }>`
  padding: 12px 20px;
  border: none;
  background: none;
  color: ${({ theme, isActive }) => isActive ? theme.primary : theme.textSecondary};
  font-weight: ${({ isActive }) => isActive ? '600' : '400'};
  cursor: pointer;
  position: relative;
  border-bottom: 2px solid ${({ theme, isActive }) => isActive ? theme.primary : 'transparent'};
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ProfilingResults = styled.div`
  display: grid;
  gap: 24px;
`;

const HotSpotsSection = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const HotSpotsList = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 16px;
`;

const HotSpotItem = styled(motion.div)<{ severity: 'high' | 'medium' | 'low' }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid ${({ severity }) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
    }
  }};
  background: ${({ theme, severity }) => {
    switch (severity) {
      case 'high': return theme.background + '20';
      case 'medium': return '#f59e0b10';
      case 'low': return '#22c55e10';
    }
  }};
`;

const HotSpotInfo = styled.div`
  flex: 1;
  
  .function-name {
    font-weight: 600;
    color: ${({ theme }) => theme.text};
    margin-bottom: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }
  
  .metrics {
    display: flex;
    gap: 16px;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const HotSpotPercentage = styled.div<{ percentage: number }>`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ percentage }) => {
    if (percentage > 20) return '#ef4444';
    if (percentage > 10) return '#f59e0b';
    return '#22c55e';
  }};
`;

const TimelineSection = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const TimelineChart = styled.div`
  position: relative;
  height: 400px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  margin: 16px 0;
  overflow: hidden;
  background: ${({ theme }) => theme.background};
`;

const TimelineTrack = styled.div<{ depth: number }>`
  position: absolute;
  left: ${({ depth }) => depth * 20}px;
  height: 20px;
  margin: 2px 0;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 3px;
  font-size: 0.75rem;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scaleY(1.1);
    z-index: 10;
  }
`;

const FunctionStatsSection = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const StatsTable = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
  
  .header {
    font-weight: 600;
    color: ${({ theme }) => theme.text};
    padding: 12px 8px;
    background: ${({ theme }) => theme.background};
    border-radius: 4px;
    font-size: 0.85rem;
  }
  
  .cell {
    padding: 12px 8px;
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.85rem;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    display: flex;
    align-items: center;
  }
  
  .function-cell {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
  }
`;

const CallGraphSection = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const CallGraphNode = styled(motion.div)<{ depth: number }>`
  margin-left: ${({ depth }) => depth * 24}px;
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  .function-name {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
  }
  
  .duration {
    color: ${({ theme }) => theme.primary};
    font-size: 0.8rem;
    margin-left: auto;
  }
  
  &:hover {
    background: ${({ theme }) => theme.primary}10;
  }
`;

const PerformanceInsights = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const InsightItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  margin: 8px 0;
  border-radius: 6px;
  background: ${({ theme }) => theme.background};
  
  .icon {
    font-size: 1.2rem;
    margin-top: 2px;
  }
  
  .content {
    flex: 1;
    
    .title {
      font-weight: 600;
      color: ${({ theme }) => theme.text};
      margin-bottom: 4px;
    }
    
    .description {
      font-size: 0.9rem;
      color: ${({ theme }) => theme.textSecondary};
    }
  }
`;

// Mock profiling data
const generateMockProfilingData = (): ProfilingSession => {
  const functions = [
    'quickSort', 'partition', 'mergeSort', 'merge', 'bubbleSort',
    'binarySearch', 'linearSearch', 'insertionSort', 'heapify', 'heapSort'
  ];
  
  const entries: ProfileEntry[] = [];
  const startTime = Date.now();
  
  functions.forEach((func, index) => {
    const callCount = Math.floor(Math.random() * 100) + 1;
    const durations = Array.from({ length: callCount }, () => Math.random() * 50 + 1);
    const totalDuration = durations.reduce((sum, d) => sum + d, 0);
    
    entries.push({
      id: `${func}-${index}`,
      functionName: func,
      startTime: startTime + index * 10,
      endTime: startTime + index * 10 + Math.max(...durations),
      duration: Math.max(...durations),
      callCount,
      totalDuration,
      averageDuration: totalDuration / callCount,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      depth: Math.floor(index / 3),
      memoryUsage: Math.random() * 1024 * 1024,
      cpuUsage: Math.random() * 100
    });
  });
  
  return {
    id: `session-${Date.now()}`,
    name: 'Algorithm Profiling Session',
    startTime,
    endTime: startTime + 1000,
    totalDuration: 1000,
    entries,
    callStack: []
  };
};

export const ExecutionTimeProfiler: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState('hotspots');
  const [currentSession, setCurrentSession] = useState<ProfilingSession | null>(null);
  const [sessions, setSessions] = useState<ProfilingSession[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  
  const sessionRef = useRef<ProfilingSession | null>(null);

  const startProfiling = useCallback(() => {
    setIsRecording(true);
    const session = generateMockProfilingData();
    sessionRef.current = session;
    
    // Simulate real-time profiling updates
    setTimeout(() => {
      setCurrentSession(session);
      setIsRecording(false);
      setSessions(prev => [...prev, session]);
    }, 2000);
  }, []);

  const stopProfiling = useCallback(() => {
    setIsRecording(false);
    if (sessionRef.current) {
      setCurrentSession(sessionRef.current);
      setSessions(prev => [...prev, sessionRef.current!]);
    }
  }, []);

  const clearSessions = useCallback(() => {
    setSessions([]);
    setCurrentSession(null);
    setSelectedFunction(null);
  }, []);

  const hotSpots = useMemo((): HotSpot[] => {
    if (!currentSession) return [];
    
    return currentSession.entries
      .map(entry => ({
        functionName: entry.functionName,
        totalTime: entry.totalDuration,
        percentage: (entry.totalDuration / currentSession.totalDuration) * 100,
        callCount: entry.callCount,
        avgTime: entry.averageDuration
      }))
      .sort((a, b) => b.totalTime - a.totalTime)
      .slice(0, 10);
  }, [currentSession]);

  const formatTime = useCallback((ms: number) => {
    if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }, []);

  const getHotSpotSeverity = useCallback((percentage: number): 'high' | 'medium' | 'low' => {
    if (percentage > 20) return 'high';
    if (percentage > 10) return 'medium';
    return 'low';
  }, []);

  const generateInsights = useMemo(() => {
    if (!currentSession) return [];
    
    const insights = [];
    
    // Identify expensive functions
    const expensiveFunctions = hotSpots.filter(h => h.percentage > 15);
    if (expensiveFunctions.length > 0) {
      insights.push({
        icon: '🔥',
        title: 'Performance Bottlenecks Detected',
        description: `${expensiveFunctions.length} functions are consuming more than 15% of total execution time. Consider optimizing: ${expensiveFunctions.map(f => f.functionName).join(', ')}`
      });
    }
    
    // Check for frequently called functions
    const frequentFunctions = currentSession.entries.filter(e => e.callCount > 50);
    if (frequentFunctions.length > 0) {
      insights.push({
        icon: '📞',
        title: 'High Call Frequency',
        description: `Functions called more than 50 times may benefit from caching or memoization: ${frequentFunctions.map(f => f.functionName).join(', ')}`
      });
    }
    
    // Memory usage warnings
    const memoryIntensiveFunctions = currentSession.entries.filter(e => e.memoryUsage && e.memoryUsage > 500 * 1024);
    if (memoryIntensiveFunctions.length > 0) {
      insights.push({
        icon: '🧠',
        title: 'High Memory Usage',
        description: `Some functions are using significant memory. Consider memory optimization for: ${memoryIntensiveFunctions.map(f => f.functionName).join(', ')}`
      });
    }
    
    // Performance recommendations
    const avgExecutionTime = currentSession.entries.reduce((sum, e) => sum + e.averageDuration, 0) / currentSession.entries.length;
    if (avgExecutionTime > 10) {
      insights.push({
        icon: '⚡',
        title: 'Optimization Opportunity',
        description: `Average function execution time is ${formatTime(avgExecutionTime)}. Consider algorithmic improvements or parallel processing.`
      });
    }
    
    return insights;
  }, [currentSession, hotSpots, formatTime]);

  const tabs = [
    { id: 'hotspots', label: 'Hot Spots', icon: '🔥' },
    { id: 'timeline', label: 'Timeline', icon: '📊' },
    { id: 'functions', label: 'Functions', icon: '📋' },
    { id: 'callgraph', label: 'Call Graph', icon: '🌳' },
    { id: 'insights', label: 'Insights', icon: '💡' }
  ];

  return (
    <ProfilerContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <h2>
          ⏱️ Execution Time Profiler
        </h2>
        <StatusIndicator isRecording={isRecording}>
          <div className="status-dot" />
          {isRecording ? 'Recording...' : 'Idle'}
        </StatusIndicator>
      </Header>

      <ControlPanel>
        <Button
          variant={isRecording ? 'danger' : 'success'}
          onClick={isRecording ? stopProfiling : startProfiling}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRecording ? '⏹️ Stop' : '▶️ Start'} Profiling
        </Button>
        
        <Button
          onClick={clearSessions}
          disabled={sessions.length === 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🧹 Clear Sessions
        </Button>
        
        <span style={{ marginLeft: 'auto', fontSize: '0.9rem', color: '#6b7280' }}>
          Sessions: {sessions.length}
        </span>
      </ControlPanel>

      {currentSession && (
        <>
          <TabContainer>
            {tabs.map(tab => (
              <Tab
                key={tab.id}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.icon} {tab.label}
              </Tab>
            ))}
          </TabContainer>

          <ProfilingResults>
            {activeTab === 'hotspots' && (
              <HotSpotsSection>
                <h3>Performance Hot Spots</h3>
                <HotSpotsList>
                  {hotSpots.map((hotSpot, index) => (
                    <HotSpotItem
                      key={hotSpot.functionName}
                      severity={getHotSpotSeverity(hotSpot.percentage)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <HotSpotInfo>
                        <div className="function-name">{hotSpot.functionName}</div>
                        <div className="metrics">
                          <span>Calls: {hotSpot.callCount}</span>
                          <span>Total: {formatTime(hotSpot.totalTime)}</span>
                          <span>Avg: {formatTime(hotSpot.avgTime)}</span>
                        </div>
                      </HotSpotInfo>
                      <HotSpotPercentage percentage={hotSpot.percentage}>
                        {hotSpot.percentage.toFixed(1)}%
                      </HotSpotPercentage>
                    </HotSpotItem>
                  ))}
                </HotSpotsList>
              </HotSpotsSection>
            )}

            {activeTab === 'timeline' && (
              <TimelineSection>
                <h3>Execution Timeline</h3>
                <TimelineChart>
                  {currentSession.entries.map((entry, index) => (
                    <TimelineTrack
                      key={entry.id}
                      depth={entry.depth}
                      style={{
                        top: `${index * 24 + 10}px`,
                        width: `${(entry.duration / currentSession.totalDuration) * 80}%`,
                        left: `${(entry.startTime - currentSession.startTime) / currentSession.totalDuration * 80 + entry.depth * 20}px`
                      }}
                      onClick={() => setSelectedFunction(entry.functionName)}
                    >
                      {entry.functionName}
                    </TimelineTrack>
                  ))}
                </TimelineChart>
              </TimelineSection>
            )}

            {activeTab === 'functions' && (
              <FunctionStatsSection>
                <h3>Function Statistics</h3>
                <StatsTable>
                  <div className="header">Function</div>
                  <div className="header">Calls</div>
                  <div className="header">Total Time</div>
                  <div className="header">Avg Time</div>
                  <div className="header">Min Time</div>
                  <div className="header">Max Time</div>
                  
                  {currentSession.entries.map(entry => (
                    <React.Fragment key={entry.id}>
                      <div className="cell function-cell">{entry.functionName}</div>
                      <div className="cell">{entry.callCount}</div>
                      <div className="cell">{formatTime(entry.totalDuration)}</div>
                      <div className="cell">{formatTime(entry.averageDuration)}</div>
                      <div className="cell">{formatTime(entry.minDuration)}</div>
                      <div className="cell">{formatTime(entry.maxDuration)}</div>
                    </React.Fragment>
                  ))}
                </StatsTable>
              </FunctionStatsSection>
            )}

            {activeTab === 'callgraph' && (
              <CallGraphSection>
                <h3>Call Graph</h3>
                {currentSession.entries.map((entry, index) => (
                  <CallGraphNode
                    key={entry.id}
                    depth={entry.depth}
                    onClick={() => setSelectedFunction(entry.functionName)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="function-name">{entry.functionName}</div>
                    <div className="duration">{formatTime(entry.duration)}</div>
                  </CallGraphNode>
                ))}
              </CallGraphSection>
            )}

            {activeTab === 'insights' && (
              <PerformanceInsights>
                <h3>Performance Insights</h3>
                {generateInsights.map((insight, index) => (
                  <InsightItem key={index}>
                    <div className="icon">{insight.icon}</div>
                    <div className="content">
                      <div className="title">{insight.title}</div>
                      <div className="description">{insight.description}</div>
                    </div>
                  </InsightItem>
                ))}
              </PerformanceInsights>
            )}
          </ProfilingResults>
        </>
      )}

      {!currentSession && !isRecording && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          color: '#6b7280',
          fontSize: '1.1rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏱️</div>
          Click "Start Profiling" to begin analyzing execution performance
        </div>
      )}
    </ProfilerContainer>
  );
};

export default ExecutionTimeProfiler;
