import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface MemoryBlock {
  id: string;
  size: number;
  type: 'allocated' | 'free' | 'fragmented';
  startAddress: number;
  endAddress: number;
  operation: string;
  timestamp: number;
  lifespan?: number;
}

interface MemorySnapshot {
  timestamp: number;
  totalMemory: number;
  usedMemory: number;
  freeMemory: number;
  fragmentation: number;
  blocks: MemoryBlock[];
}

interface MemoryStats {
  peakUsage: number;
  averageUsage: number;
  fragmentationLevel: number;
  allocationCount: number;
  deallocationCount: number;
  garbageCollections: number;
}

const MemoryContainer = styled(motion.div)`
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
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  
  background: ${({ variant, theme }) => {
    switch (variant) {
      case 'primary': return theme.primary;
      case 'danger': return '#ef4444';
      default: return theme.cardBackground;
    }
  }};
  
  color: ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
      case 'danger': return 'white';
      default: return theme.text;
    }
  }};
  
  border: ${({ variant, theme }) => 
    variant === 'secondary' ? `1px solid ${theme.border}` : 'none'
  };
  
  &:hover {
    opacity: 0.8;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled(motion.div)`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.border};
  text-align: center;
  
  .value {
    font-size: 1.8rem;
    font-weight: bold;
    color: ${({ theme }) => theme.primary};
    display: block;
    margin-bottom: 4px;
  }
  
  .label {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.9rem;
  }
  
  .trend {
    font-size: 0.8rem;
    margin-top: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
`;

const MemoryVisualization = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 24px;
`;

const MemoryGraph = styled.div`
  position: relative;
  height: 300px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  margin: 16px 0;
  overflow: hidden;
`;

const MemoryTimeline = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: flex-end;
`;

const TimelineBar = styled(motion.div)<{ height: number; color: string }>`
  flex: 1;
  background: ${({ color }) => color};
  height: ${({ height }) => height}%;
  margin: 0 1px;
  border-radius: 2px 2px 0 0;
  position: relative;
  
  &:hover {
    opacity: 0.8;
  }
`;

const MemoryBlockVisualization = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 24px;
`;

const BlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  min-height: 200px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  padding: 8px;
  margin: 16px 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    ${({ theme }) => theme.border}20 10px,
    ${({ theme }) => theme.border}20 20px
  );
`;

const MemoryBlockEl = styled(motion.div)<{ 
  blockType: 'allocated' | 'free' | 'fragmented';
  size: number; 
}>`
  height: 30px;
  width: ${({ size }) => Math.max(size / 10, 4)}px;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  
  background: ${({ blockType }) => {
    switch (blockType) {
      case 'allocated': return 'linear-gradient(135deg, #22c55e, #16a34a)';
      case 'free': return 'linear-gradient(135deg, #6b7280, #4b5563)';
      case 'fragmented': return 'linear-gradient(135deg, #ef4444, #dc2626)';
      default: return '#6b7280';
    }
  }};
  
  border: 2px solid ${({ blockType }) => {
    switch (blockType) {
      case 'allocated': return '#16a34a';
      case 'free': return '#374151';
      case 'fragmented': return '#dc2626';
      default: return '#4b5563';
    }
  }};
  
  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }
`;

const BlockTooltip = styled(motion.div)`
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: ${({ theme }) => theme.colors.card};
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  z-index: 100;
  pointer-events: none;
  white-space: nowrap;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  
  .color-box {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1px solid ${({ theme }) => theme.border};
  }
`;

const FragmentationAnalysis = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const FragmentationChart = styled.div`
  height: 150px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  margin: 16px 0;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 8px;
`;

const FragmentationBar = styled(motion.div)<{ height: number; index: number }>`
  flex: 1;
  background: linear-gradient(
    to top,
    #ef4444,
    #f97316,
    #eab308,
    #22c55e
  );
  height: ${({ height }) => height}%;
  margin: 0 1px;
  border-radius: 2px;
  position: relative;
`;

// Simulation data
const generateMemorySnapshot = (timestamp: number, operation?: string): MemorySnapshot => {
  const totalMemory = 1024 * 1024; // 1MB
  const blocks: MemoryBlock[] = [];
  let currentAddress = 0;
  let usedMemory = 0;
  
  // Simulate memory allocation patterns
  const allocationSizes = [64, 128, 256, 512, 1024, 2048];
  const numBlocks = Math.floor(Math.random() * 20) + 10;
  
  for (let i = 0; i < numBlocks; i++) {
    const size = allocationSizes[Math.floor(Math.random() * allocationSizes.length)];
    const blockType: 'allocated' | 'free' | 'fragmented' = 
      Math.random() > 0.3 ? 'allocated' : 
      Math.random() > 0.7 ? 'fragmented' : 'free';
    
    blocks.push({
      id: `block-${timestamp}-${i}`,
      size,
      type: blockType,
      startAddress: currentAddress,
      endAddress: currentAddress + size,
      operation: operation || `Operation ${i}`,
      timestamp,
      lifespan: blockType === 'allocated' ? Math.random() * 5000 : undefined
    });
    
    if (blockType === 'allocated') {
      usedMemory += size;
    }
    
    currentAddress += size;
  }
  
  const freeMemory = totalMemory - usedMemory;
  const fragmentation = blocks.filter(b => b.type === 'fragmented').length / blocks.length;
  
  return {
    timestamp,
    totalMemory,
    usedMemory,
    freeMemory,
    fragmentation,
    blocks
  };
};

export const MemoryUsageVisualization: React.FC = () => {
  const [snapshots, setSnapshots] = useState<MemorySnapshot[]>([]);
  const [currentSnapshot, setCurrentSnapshot] = useState<MemorySnapshot | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<MemoryBlock | null>(null);
  const [stats, setStats] = useState<MemoryStats>({
    peakUsage: 0,
    averageUsage: 0,
    fragmentationLevel: 0,
    allocationCount: 0,
    deallocationCount: 0,
    garbageCollections: 0
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setSnapshots([]);
    
    intervalRef.current = setInterval(() => {
      const timestamp = Date.now();
      const snapshot = generateMemorySnapshot(timestamp);
      
      setSnapshots(prev => {
        const newSnapshots = [...prev, snapshot].slice(-50); // Keep last 50 snapshots
        setCurrentSnapshot(snapshot);
        return newSnapshots;
      });
    }, 500);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearData = useCallback(() => {
    setSnapshots([]);
    setCurrentSnapshot(null);
    setSelectedBlock(null);
    setStats({
      peakUsage: 0,
      averageUsage: 0,
      fragmentationLevel: 0,
      allocationCount: 0,
      deallocationCount: 0,
      garbageCollections: 0
    });
  }, []);

  const simulateGarbageCollection = useCallback(() => {
    if (currentSnapshot) {
      const timestamp = Date.now();
      const gcSnapshot = generateMemorySnapshot(timestamp, 'Garbage Collection');
      
      // Reduce fragmentation after GC
      gcSnapshot.blocks = gcSnapshot.blocks.map(block => ({
        ...block,
        type: block.type === 'fragmented' ? 'free' : block.type
      }));
      
      setCurrentSnapshot(gcSnapshot);
      setSnapshots(prev => [...prev, gcSnapshot]);
      setStats(prev => ({
        ...prev,
        garbageCollections: prev.garbageCollections + 1
      }));
    }
  }, [currentSnapshot]);

  // Calculate statistics
  useEffect(() => {
    if (snapshots.length > 0) {
      const usages = snapshots.map(s => s.usedMemory);
      const fragmentations = snapshots.map(s => s.fragmentation);
      
      setStats(prev => ({
        ...prev,
        peakUsage: Math.max(...usages),
        averageUsage: usages.reduce((a, b) => a + b, 0) / usages.length,
        fragmentationLevel: fragmentations.reduce((a, b) => a + b, 0) / fragmentations.length,
        allocationCount: prev.allocationCount + 1
      }));
    }
  }, [snapshots]);

  const formatBytes = useCallback((bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }, []);

  const getFragmentationColor = useCallback((level: number) => {
    if (level < 0.2) return '#22c55e';
    if (level < 0.5) return '#eab308';
    if (level < 0.8) return '#f97316';
    return '#ef4444';
  }, []);

  const maxUsage = Math.max(...snapshots.map(s => s.usedMemory), 1);

  return (
    <MemoryContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <h2>
          🧠 Memory Usage Visualization
        </h2>
      </Header>

      <ControlPanel>
        <Button
          variant="primary"
          onClick={isRecording ? stopRecording : startRecording}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRecording ? '⏹️ Stop' : '▶️ Start'} Recording
        </Button>
        
        <Button
          onClick={simulateGarbageCollection}
          disabled={!currentSnapshot}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🗑️ Trigger GC
        </Button>
        
        <Button
          variant="danger"
          onClick={clearData}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🧹 Clear Data
        </Button>
      </ControlPanel>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="value">{formatBytes(stats.peakUsage)}</span>
          <div className="label">Peak Usage</div>
          <div className="trend">
            📈 Maximum allocation
          </div>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="value">{formatBytes(stats.averageUsage)}</span>
          <div className="label">Average Usage</div>
          <div className="trend">
            📊 Mean allocation
          </div>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="value">{(stats.fragmentationLevel * 100).toFixed(1)}%</span>
          <div className="label">Fragmentation</div>
          <div className="trend" style={{ color: getFragmentationColor(stats.fragmentationLevel) }}>
            🔴 Memory holes
          </div>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="value">{stats.garbageCollections}</span>
          <div className="label">GC Collections</div>
          <div className="trend">
            🗑️ Cleanup cycles
          </div>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="value">{snapshots.length}</span>
          <div className="label">Snapshots</div>
          <div className="trend">
            📸 Data points
          </div>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="value">
            {currentSnapshot ? formatBytes(currentSnapshot.usedMemory) : '0B'}
          </span>
          <div className="label">Current Usage</div>
          <div className="trend">
            ⚡ Real-time
          </div>
        </StatCard>
      </StatsGrid>

      {snapshots.length > 0 && (
        <MemoryVisualization>
          <h3>Memory Usage Timeline</h3>
          <MemoryGraph>
            <MemoryTimeline>
              {snapshots.map((snapshot, index) => (
                <TimelineBar
                  key={snapshot.timestamp}
                  height={(snapshot.usedMemory / maxUsage) * 90}
                  color={`hsl(${220 - (snapshot.usedMemory / maxUsage) * 60}, 70%, 50%)`}
                  initial={{ height: 0 }}
                  animate={{ height: (snapshot.usedMemory / maxUsage) * 90 }}
                  transition={{ delay: index * 0.02, duration: 0.3 }}
                />
              ))}
            </MemoryTimeline>
          </MemoryGraph>
        </MemoryVisualization>
      )}

      {currentSnapshot && (
        <MemoryBlockVisualization>
          <h3>Current Memory Layout</h3>
          <BlockContainer>
            <AnimatePresence>
              {currentSnapshot.blocks.map((block, index) => (
                <MemoryBlockEl
                  key={block.id}
                  blockType={block.type}
                  size={block.size}
                  onClick={() => setSelectedBlock(block)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: index * 0.01 }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                >
                  {selectedBlock?.id === block.id && (
                    <BlockTooltip
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <div>Size: {formatBytes(block.size)}</div>
                      <div>Type: {block.type}</div>
                      <div>Address: 0x{block.startAddress.toString(16)}</div>
                      <div>Operation: {block.operation}</div>
                    </BlockTooltip>
                  )}
                </MemoryBlockEl>
              ))}
            </AnimatePresence>
          </BlockContainer>
          
          <Legend>
            <LegendItem>
              <div className="color-box" style={{ background: '#22c55e' }} />
              Allocated Memory
            </LegendItem>
            <LegendItem>
              <div className="color-box" style={{ background: '#6b7280' }} />
              Free Memory
            </LegendItem>
            <LegendItem>
              <div className="color-box" style={{ background: '#ef4444' }} />
              Fragmented Memory
            </LegendItem>
          </Legend>
        </MemoryBlockVisualization>
      )}

      {snapshots.length > 0 && (
        <FragmentationAnalysis>
          <h3>Fragmentation Analysis</h3>
          <FragmentationChart>
            {snapshots.slice(-20).map((snapshot, index) => (
              <FragmentationBar
                key={snapshot.timestamp}
                height={snapshot.fragmentation * 100}
                index={index}
                initial={{ height: 0 }}
                animate={{ height: snapshot.fragmentation * 100 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              />
            ))}
          </FragmentationChart>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
            High fragmentation levels indicate inefficient memory usage and may impact performance.
            Consider running garbage collection to consolidate free memory blocks.
          </p>
        </FragmentationAnalysis>
      )}
    </MemoryContainer>
  );
};

export default MemoryUsageVisualization;
