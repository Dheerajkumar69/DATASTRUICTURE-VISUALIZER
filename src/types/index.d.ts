// Type definitions for application

// Common Types
declare namespace DataStructures {
  // Basic interfaces
  interface NodeJS {
    Timeout: any;
  }
  
  // Animation related interfaces
  interface AnimationStep<T> {
    state: T;
    description: string;
    highlightedIndices?: number[];
    animationType?: string;
    timestamp?: number;
    metadata?: Record<string, any>;
  }
  
  // UI Component Props
  interface AnimationControlsProps {
    isAnimating: boolean;
    isPaused: boolean;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onStepForward: () => void;
    onStepBackward: () => void;
    onSpeedChange: (speed: number) => void;
    currentSpeed: number;
    canStepForward?: boolean;
    canStepBackward?: boolean;
    className?: string;
  }
  
  interface AlgorithmOption {
    name: string;
    path: string;
  }
  
  interface AlgorithmDropdownProps {
    buttonText?: string;
    options: AlgorithmOption[];
  }
  
  interface ArrayControlsProps {
    onGenerateRandom: (size: number) => void;
    onCustomArray: (array: number[]) => void;
    arraySize: number;
    onSizeChange: (size: number) => void;
    disabled?: boolean;
    maxValue?: number;
  }
  
  // UI Component Styled Component Props
  interface StyledBarProps {
    height: number;
    isActive?: boolean;
    isComparing?: boolean;
    isSorted?: boolean;
  }
  
  interface StyledGridCellProps {
    isVisited?: boolean;
    isPath?: boolean;
    isWall?: boolean;
    isStart?: boolean;
    isTarget?: boolean;
    isEnd?: boolean;
    isHighlighted?: boolean;
    isActive?: boolean;
    animationType?: string;
    cellState?: any;
    islandId?: number;
    distance?: number;
  }
  
  interface StyledNodeProps {
    isHighlighted?: boolean;
    isActive?: boolean;
    isVisited?: boolean;
    animationType?: string;
  }
  
  // Algorithm Info Types
  interface CodeImplementation {
    language: string;
    title: string;
    code: string;
  }
  
  interface SortingAlgorithmInfo {
    name: string;
    description: string;
    timeComplexityBest: string;
    timeComplexityAverage: string;
    timeComplexityWorst: string;
    spaceComplexity: string;
    stability: boolean;
    implementations: CodeImplementation[];
  }
  
  interface VisualizationControlsProps {
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onStepForward: () => void;
    onStepBackward: () => void;
    onGenerateNew?: () => void;
    onSpeedChange: (speed: number) => void;
    isAnimating: boolean;
    isPaused: boolean;
    hasSteps: boolean;
    isFirstStep: boolean;
    isLastStep: boolean;
    currentSpeed: number;
    showNewButton?: boolean;
  }
  
  // Template Page Props
  interface SortingPageTemplateProps {
    algorithmInfo: SortingAlgorithmInfo;
    generateSteps: (arr: number[]) => AnimationStep<any>[];
  }
  
  interface ArrayPageTemplateProps {
    algorithmInfo: any;
    generateSteps: (array: number[]) => {
      array: number[];
      activeIndices: number[];
      comparingIndices: number[];
      stepDescription: string;
    }[];
    defaultArray?: number[];
  }
  
  interface ProblemPageTemplateProps {
    algorithmInfo: any;
    visualizationComponent: React.ReactNode;
    problemDescription: string;
  }
  
  // Rendering and Animation Hook Types
  interface RenderFunction<T> {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    data: T;
    time: number;
  }
  
  // Custom Hook Return Types
  interface UseAlgorithmAnimationProps<T> {
    initialState: T;
    steps?: AnimationStep<T>[];
    useRAF?: boolean;
  }
  
  interface UseAlgorithmAnimationReturn<T> {
    currentState: T;
    currentStep: number;
    isAnimating: boolean;
    isPaused: boolean;
    animationSpeed: number;
    currentDescription: string;
    highlightedIndices: number[];
    animationType: string;
    startAnimation: () => void;
    pauseAnimation: () => void;
    resetAnimation: () => void;
    stepForward: () => void;
    stepBackward: () => void;
    setAnimationSpeed: (speed: number) => void;
    setSteps: React.Dispatch<React.SetStateAction<AnimationStep<T>[]>>;
    canStepForward: boolean;
    canStepBackward: boolean;
    isLastStep: boolean;
    hasError: boolean;
    errorMessage: string | null;
  }
  
  interface UseRobustAnimationOptions<T> {
    initialState: T;
    steps?: AnimationStep<T>[];
    useRAF?: boolean;
    animationId?: string;
    animationSpeed?: number;
  }
  
  // State Related Types
  interface Action {
    type: 'SET_STEPS' | 'SET_CURRENT_STEP' | 'START_ANIMATION' | 'PAUSE_ANIMATION' | 'RESET_ANIMATION' | 'STEP_FORWARD' | 'STEP_BACKWARD' | 'SET_ANIMATION_SPEED';
    payload?: any;
  }
  
  interface State<T> {
    steps: AnimationStep<T>[];
    currentStep: number;
    isAnimating: boolean;
    isPaused: boolean;
    animationSpeed: number;
  }
}

// Export the namespace to be used in the application
export = DataStructures;
export as namespace DataStructures; 