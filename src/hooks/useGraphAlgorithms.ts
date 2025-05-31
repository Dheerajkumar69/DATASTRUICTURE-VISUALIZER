import { useState, useEffect, useCallback } from 'react';

// Worker instance (load lazily to avoid SSR issues)
let worker: Worker | null = null;

// Initialize worker only in browser environment
const getWorker = () => {
  if (typeof window === 'undefined') return null;
  
  if (!worker) {
    try {
      worker = new Worker(new URL('../workers/graphAlgorithms.worker.ts', import.meta.url));
    } catch (e) {
      console.error('Failed to load worker:', e);
      return null;
    }
  }
  
  return worker;
};

interface UseGraphAlgorithmsState<T> {
  result: T | null;
  loading: boolean;
  error: string | null;
}

// Generic hook for working with graph algorithms
function useGraphAlgorithms<T>() {
  const [state, setState] = useState<UseGraphAlgorithmsState<T>>({
    result: null,
    loading: false,
    error: null
  });
  
  // Setup worker message listener
  useEffect(() => {
    const worker = getWorker();
    if (!worker) return;
    
    const messageHandler = (event: MessageEvent) => {
      const { type, payload } = event.data;
      
      if (type === 'ERROR') {
        setState(prevState => ({ ...prevState, loading: false, error: payload.message }));
        return;
      }
      
      // Handle result
      setState({
        result: payload,
        loading: false,
        error: null
      });
    };
    
    worker.addEventListener('message', messageHandler);
    
    return () => {
      worker.removeEventListener('message', messageHandler);
    };
  }, []);
  
  // Find Eulerian path
  const findEulerianPath = useCallback((adjacencyList: number[][]) => {
    const worker = getWorker();
    if (!worker) {
      setState({
        result: null,
        loading: false,
        error: 'Web Workers are not supported in this environment'
      });
      return;
    }
    
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    
    worker.postMessage({
      type: 'FIND_EULERIAN_PATH',
      payload: { adjacencyList }
    });
  }, []);
  
  // Detect cycles in directed graph
  const detectCyclesDirected = useCallback((adjacencyList: number[][]) => {
    const worker = getWorker();
    if (!worker) {
      setState({
        result: null,
        loading: false,
        error: 'Web Workers are not supported in this environment'
      });
      return;
    }
    
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    
    worker.postMessage({
      type: 'DETECT_CYCLES_DIRECTED',
      payload: { adjacencyList }
    });
  }, []);
  
  // Detect cycles in undirected graph
  const detectCyclesUndirected = useCallback((adjacencyList: number[][]) => {
    const worker = getWorker();
    if (!worker) {
      setState({
        result: null,
        loading: false,
        error: 'Web Workers are not supported in this environment'
      });
      return;
    }
    
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    
    worker.postMessage({
      type: 'DETECT_CYCLES_UNDIRECTED',
      payload: { adjacencyList }
    });
  }, []);
  
  // Find word ladder
  const findWordLadder = useCallback((beginWord: string, endWord: string, wordList: string[]) => {
    const worker = getWorker();
    if (!worker) {
      setState({
        result: null,
        loading: false,
        error: 'Web Workers are not supported in this environment'
      });
      return;
    }
    
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    
    worker.postMessage({
      type: 'FIND_WORD_LADDER',
      payload: { beginWord, endWord, wordList }
    });
  }, []);
  
  // Reset state
  const reset = useCallback(() => {
    setState({
      result: null,
      loading: false,
      error: null
    });
  }, []);
  
  return {
    ...state,
    findEulerianPath,
    detectCyclesDirected,
    detectCyclesUndirected,
    findWordLadder,
    reset
  };
}

export default useGraphAlgorithms; 