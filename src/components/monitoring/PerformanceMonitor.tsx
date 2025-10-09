import React, { useRef, useEffect, useState, useCallback, createContext, useContext } from 'react';
import styled from 'styled-components';

// Performance monitoring configuration
interface PerformanceConfig {
  maxDatasetSize: number;
  memoryThreshold: number; // MB
  fpsThreshold: number;
  renderTimeThreshold: number; // ms
  enabled: boolean;
}

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  datasetSize: number;
  animationFrames: number;
  lastUpdate: number;
}

interface PerformanceAlert {
  type: 'memory' | 'fps' | 'renderTime' | 'datasetSize';
  severity: 'warning' | 'error';
  message: string;
  timestamp: number;
  value: number;
  threshold: number;
}

// Performance monitoring context
interface PerformanceContextType {
  metrics: PerformanceMetrics;
  alerts: PerformanceAlert[];
  config: PerformanceConfig;
  startMonitoring: (componentName: string) => void;
  stopMonitoring: () => void;
  recordDatasetSize: (size: number) => void;
  recordRenderTime: (time: number) => void;
  isMonitoring: boolean;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

// Default configuration for production environments
const defaultConfig: PerformanceConfig = {
  maxDatasetSize: 1000,
  memoryThreshold: 100, // 100MB
  fpsThreshold: 30,
  renderTimeThreshold: 16, // 60fps = ~16ms per frame
  enabled: process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_MONITORING === 'true'
};

// Performance Monitor Provider Component
export const PerformanceMonitorProvider: React.FC<{ children: React.ReactNode; config?: Partial<PerformanceConfig> }> = ({
  children,
  config: customConfig = {}
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    datasetSize: 0,
    animationFrames: 0,
    lastUpdate: Date.now()
  });

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const config = { ...defaultConfig, ...customConfig };

  // Monitoring refs
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const animationFrameRef = useRef<number | null>(null);
  const componentNameRef = useRef<string>('');

  // Memory monitoring (when available)
  const getMemoryUsage = useCallback((): number => {
    if ('memory' in performance && 'usedJSHeapSize' in (performance as any).memory) {
      return Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024);
    }
    return 0;
  }, []);

  // FPS monitoring loop
  const monitorPerformance = useCallback(() => {
    if (!isMonitoring) return;

    const currentTime = performance.now();
    frameCountRef.current++;

    // Calculate FPS every second
    if (currentTime - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current));
      const memoryUsage = getMemoryUsage();

      setMetrics(prev => {
        const updatedMetrics = {
          ...prev,
          fps,
          memoryUsage,
          animationFrames: frameCountRef.current,
          lastUpdate: currentTime
        };
        
        // Check for performance alerts with current values
        checkPerformanceThresholds(fps, memoryUsage, updatedMetrics.renderTime, updatedMetrics.datasetSize);
        
        return updatedMetrics;
      });

      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }

    animationFrameRef.current = requestAnimationFrame(monitorPerformance);
  }, [isMonitoring, getMemoryUsage]);

  // Performance threshold checking
  const checkPerformanceThresholds = useCallback((fps: number, memory: number, renderTime: number, datasetSize: number) => {
    const newAlerts: PerformanceAlert[] = [];
    const timestamp = Date.now();

    if (fps < config.fpsThreshold) {
      newAlerts.push({
        type: 'fps',
        severity: fps < config.fpsThreshold * 0.5 ? 'error' : 'warning',
        message: `Low FPS detected: ${fps} (threshold: ${config.fpsThreshold})`,
        timestamp,
        value: fps,
        threshold: config.fpsThreshold
      });
    }

    if (memory > config.memoryThreshold) {
      newAlerts.push({
        type: 'memory',
        severity: memory > config.memoryThreshold * 1.5 ? 'error' : 'warning',
        message: `High memory usage: ${memory}MB (threshold: ${config.memoryThreshold}MB)`,
        timestamp,
        value: memory,
        threshold: config.memoryThreshold
      });
    }

    if (renderTime > config.renderTimeThreshold) {
      newAlerts.push({
        type: 'renderTime',
        severity: renderTime > config.renderTimeThreshold * 2 ? 'error' : 'warning',
        message: `Slow render time: ${renderTime.toFixed(2)}ms (threshold: ${config.renderTimeThreshold}ms)`,
        timestamp,
        value: renderTime,
        threshold: config.renderTimeThreshold
      });
    }

    if (datasetSize > config.maxDatasetSize) {
      newAlerts.push({
        type: 'datasetSize',
        severity: datasetSize > config.maxDatasetSize * 1.5 ? 'error' : 'warning',
        message: `Large dataset detected: ${datasetSize} items (max: ${config.maxDatasetSize})`,
        timestamp,
        value: datasetSize,
        threshold: config.maxDatasetSize
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev.slice(-9), ...newAlerts]); // Keep last 10 alerts
    }
  }, [config]);

  // Start monitoring
  const startMonitoring = useCallback((componentName: string) => {
    if (!config.enabled) return;

    componentNameRef.current = componentName;
    setIsMonitoring(true);
    frameCountRef.current = 0;
    lastTimeRef.current = performance.now();
    
    console.log(`Performance monitoring started for: ${componentName}`);
  }, [config.enabled]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    console.log(`Performance monitoring stopped for: ${componentNameRef.current}`);
  }, []);

  // Record dataset size
  const recordDatasetSize = useCallback((size: number) => {
    setMetrics(prev => ({ ...prev, datasetSize: size }));
    
    if (size > config.maxDatasetSize) {
      checkPerformanceThresholds(metrics.fps, metrics.memoryUsage, metrics.renderTime, size);
    }
  }, [config.maxDatasetSize, metrics, checkPerformanceThresholds]);

  // Record render time
  const recordRenderTime = useCallback((time: number) => {
    setMetrics(prev => ({ ...prev, renderTime: time }));
    
    if (time > config.renderTimeThreshold) {
      checkPerformanceThresholds(metrics.fps, metrics.memoryUsage, time, metrics.datasetSize);
    }
  }, [config.renderTimeThreshold, metrics, checkPerformanceThresholds]);

  // Start monitoring loop when monitoring begins
  useEffect(() => {
    if (isMonitoring) {
      monitorPerformance();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMonitoring, monitorPerformance]);

  const contextValue: PerformanceContextType = {
    metrics,
    alerts,
    config,
    startMonitoring,
    stopMonitoring,
    recordDatasetSize,
    recordRenderTime,
    isMonitoring
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
      {config.enabled && <PerformanceOverlay />}
    </PerformanceContext.Provider>
  );
};

// Hook to use performance monitoring
export const usePerformanceMonitor = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformanceMonitor must be used within a PerformanceMonitorProvider');
  }
  return context;
};

// Performance overlay component for development
const PerformanceOverlay: React.FC = () => {
  const { metrics, alerts, isMonitoring } = usePerformanceMonitor();
  
  if (!isMonitoring) return null;

  return (
    <OverlayContainer>
      <MetricsPanel>
        <MetricItem>
          <MetricLabel>FPS:</MetricLabel>
          <MetricValue color={metrics.fps < 30 ? '#ff6b6b' : '#51cf66'}>
            {metrics.fps}
          </MetricValue>
        </MetricItem>
        
        {metrics.memoryUsage > 0 && (
          <MetricItem>
            <MetricLabel>Memory:</MetricLabel>
            <MetricValue color={metrics.memoryUsage > 100 ? '#ff6b6b' : '#74c0fc'}>
              {metrics.memoryUsage}MB
            </MetricValue>
          </MetricItem>
        )}
        
        <MetricItem>
          <MetricLabel>Render:</MetricLabel>
          <MetricValue color={metrics.renderTime > 16 ? '#ff6b6b' : '#51cf66'}>
            {metrics.renderTime.toFixed(1)}ms
          </MetricValue>
        </MetricItem>
        
        <MetricItem>
          <MetricLabel>Dataset:</MetricLabel>
          <MetricValue color={metrics.datasetSize > 1000 ? '#ff6b6b' : '#74c0fc'}>
            {metrics.datasetSize}
          </MetricValue>
        </MetricItem>
      </MetricsPanel>
      
      {alerts.length > 0 && (
        <AlertsPanel>
          {alerts.slice(-3).map((alert, index) => (
            <AlertItem key={`${alert.timestamp}-${index}`} severity={alert.severity}>
              ⚠ {alert.message}
            </AlertItem>
          ))}
        </AlertsPanel>
      )}
    </OverlayContainer>
  );
};

// Styled components for performance overlay
const OverlayContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
  font-family: monospace;
  font-size: 12px;
  pointer-events: none;
`;

const MetricsPanel = styled.div`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const MetricItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  min-width: 120px;
`;

const MetricLabel = styled.span`
  color: #ccc;
`;

const MetricValue = styled.span<{ color: string }>`
  color: ${props => props.color};
  font-weight: bold;
`;

const AlertsPanel = styled.div`
  max-width: 300px;
`;

const AlertItem = styled.div<{ severity: 'warning' | 'error' }>`
  background: ${props => props.severity === 'error' ? '#ff6b6b' : '#ffa726'};
  color: white;
  padding: 6px;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 11px;
  pointer-events: auto;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

export default PerformanceMonitorProvider;