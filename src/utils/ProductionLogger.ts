// Production-grade logging and monitoring system

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  category: string;
  data?: any;
  userId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
  referrer: string;
  stackTrace?: string;
  performance?: {
    memory?: number;
    timing?: PerformanceTiming;
    fps?: number;
  };
}

export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  batchSize: number;
  batchTimeout: number;
  maxStoredLogs: number;
  enablePerformanceTracking: boolean;
  enableUserTracking: boolean;
  enableErrorTracking: boolean;
}

class ProductionLogger {
  private static instance: ProductionLogger;
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private sessionId: string;
  private batchTimer: NodeJS.Timeout | null = null;

  private constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      minLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
      enableConsole: process.env.NODE_ENV === 'development',
      enableRemote: process.env.NODE_ENV === 'production',
      remoteEndpoint: process.env.REACT_APP_LOG_ENDPOINT || '/api/logs',
      batchSize: 10,
      batchTimeout: 30000, // 30 seconds
      maxStoredLogs: 1000,
      enablePerformanceTracking: true,
      enableUserTracking: true,
      enableErrorTracking: true,
      ...config
    };

    this.sessionId = this.generateSessionId();
    this.initializeErrorHandling();
    this.initializePerformanceTracking();
  }

  public static getInstance(config?: Partial<LoggerConfig>): ProductionLogger {
    if (!ProductionLogger.instance) {
      ProductionLogger.instance = new ProductionLogger(config);
    }
    return ProductionLogger.instance;
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeErrorHandling(): void {
    if (!this.config.enableErrorTracking) return;

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', 'system', {
        reason: event.reason,
        promise: event.promise
      });
    });

    // Catch JavaScript errors
    window.addEventListener('error', (event) => {
      this.error('JavaScript Error', 'system', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    // Catch resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.warn('Resource Loading Error', 'system', {
          element: (event.target as Element)?.tagName,
          source: (event.target as any)?.src || (event.target as any)?.href
        });
      }
    }, true);
  }

  private initializePerformanceTracking(): void {
    if (!this.config.enablePerformanceTracking) return;

    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
        
        this.info('Page Load Performance', 'performance', {
          loadTime,
          domContentLoaded,
          dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
          tcpConnect: timing.connectEnd - timing.connectStart,
          serverResponse: timing.responseEnd - timing.requestStart,
          domProcessing: timing.domComplete - timing.domLoading
        });
      }, 0);
    });

    // Track FPS (if supported)
    if ('requestAnimationFrame' in window) {
      this.trackFPS();
    }

    // Track memory usage (if supported)
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB threshold
          this.warn('High Memory Usage', 'performance', {
            usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024),
            totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024),
            jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
          });
        }
      }, 60000); // Check every minute
    }
  }

  private trackFPS(): void {
    let lastTime = performance.now();
    let frameCount = 0;

    const countFPS = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) { // Every second
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        if (fps < 30) { // Log low FPS
          this.warn('Low FPS Detected', 'performance', { fps });
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(countFPS);
    };

    countFPS();
  }

  private createLogEntry(level: LogLevel, message: string, category: string, data?: any): LogEntry {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      category,
      data,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };

    // Add performance data if available
    if (this.config.enablePerformanceTracking && 'memory' in performance) {
      const memory = (performance as any).memory;
      entry.performance = {
        memory: Math.round(memory.usedJSHeapSize / 1024 / 1024)
      };
    }

    // Add stack trace for errors
    if (level >= LogLevel.ERROR) {
      entry.stackTrace = new Error().stack;
    }

    return entry;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.minLevel;
  }

  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);

    // Maintain buffer size
    if (this.logBuffer.length > this.config.maxStoredLogs) {
      this.logBuffer = this.logBuffer.slice(-this.config.maxStoredLogs);
    }

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Batch for remote logging
    if (this.config.enableRemote) {
      this.scheduleBatchSend();
    }
  }

  private logToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${LogLevel[entry.level]}] [${entry.category}]`;
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.data);
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.data);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(prefix, entry.message, entry.data);
        break;
    }
  }

  private scheduleBatchSend(): void {
    if (this.logBuffer.length >= this.config.batchSize) {
      this.sendBatch();
    } else if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        this.sendBatch();
      }, this.config.batchTimeout);
    }
  }

  private async sendBatch(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    try {
      const response = await fetch(this.config.remoteEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: logsToSend })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      // If remote logging fails, add logs back to buffer and log to console
      this.logBuffer.unshift(...logsToSend);
      if (this.config.enableConsole) {
        console.error('Failed to send logs to remote endpoint:', error);
      }
    }
  }

  // Public logging methods
  public debug(message: string, category: string = 'app', data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry = this.createLogEntry(LogLevel.DEBUG, message, category, data);
      this.addToBuffer(entry);
    }
  }

  public info(message: string, category: string = 'app', data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry = this.createLogEntry(LogLevel.INFO, message, category, data);
      this.addToBuffer(entry);
    }
  }

  public warn(message: string, category: string = 'app', data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry = this.createLogEntry(LogLevel.WARN, message, category, data);
      this.addToBuffer(entry);
    }
  }

  public error(message: string, category: string = 'app', data?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry = this.createLogEntry(LogLevel.ERROR, message, category, data);
      this.addToBuffer(entry);
    }
  }

  public fatal(message: string, category: string = 'app', data?: any): void {
    if (this.shouldLog(LogLevel.FATAL)) {
      const entry = this.createLogEntry(LogLevel.FATAL, message, category, data);
      this.addToBuffer(entry);
      // Immediately send fatal errors
      this.sendBatch();
    }
  }

  // Utility methods
  public setUserId(userId: string): void {
    // Add userId to future log entries
    this.info('User ID set', 'auth', { userId });
  }

  public trackUserAction(action: string, data?: any): void {
    if (this.config.enableUserTracking) {
      this.info(`User Action: ${action}`, 'user', data);
    }
  }

  public trackPageView(page: string): void {
    this.info('Page View', 'navigation', { page, timestamp: Date.now() });
  }

  public trackPerformance(operation: string, duration: number, data?: any): void {
    if (this.config.enablePerformanceTracking) {
      this.info(`Performance: ${operation}`, 'performance', {
        duration,
        ...data
      });
    }
  }

  public getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logBuffer.filter(log => log.level === level);
    }
    return [...this.logBuffer];
  }

  public clearLogs(): void {
    this.logBuffer = [];
  }

  public exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }

  // Flush all pending logs (useful before page unload)
  public flush(): void {
    if (this.logBuffer.length > 0) {
      this.sendBatch();
    }
  }
}

// Initialize global logger
const logger = ProductionLogger.getInstance();

// Add page unload handler to flush logs
window.addEventListener('beforeunload', () => {
  logger.flush();
});

// Export singleton instance and utilities
export default logger;
export { ProductionLogger };

// Convenience functions
export const log = {
  debug: (message: string, category?: string, data?: any) => logger.debug(message, category, data),
  info: (message: string, category?: string, data?: any) => logger.info(message, category, data),
  warn: (message: string, category?: string, data?: any) => logger.warn(message, category, data),
  error: (message: string, category?: string, data?: any) => logger.error(message, category, data),
  fatal: (message: string, category?: string, data?: any) => logger.fatal(message, category, data)
};