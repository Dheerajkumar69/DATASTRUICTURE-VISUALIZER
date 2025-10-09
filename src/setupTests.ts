// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Comprehensive Canvas API Mock - Centralized to avoid duplication
const createCanvasMock = () => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ 
    data: new Uint8ClampedArray(4).fill(255),
    width: 1,
    height: 1
  })),
  putImageData: jest.fn(),
  createImageData: jest.fn((width: number = 1, height: number = 1) => ({ 
    data: new Uint8ClampedArray(width * height * 4).fill(255),
    width,
    height
  })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn((text: string) => ({ 
    width: text.length * 8,
    actualBoundingBoxLeft: 0,
    actualBoundingBoxRight: text.length * 8,
    actualBoundingBoxAscent: 12,
    actualBoundingBoxDescent: 4
  })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
  createPattern: jest.fn(() => ({})),
  createLinearGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  getTransform: jest.fn(() => ({
    a: 1, b: 0, c: 0, d: 1, e: 0, f: 0
  })),
  resetTransform: jest.fn(),
  isPointInPath: jest.fn(() => false),
  isPointInStroke: jest.fn(() => false),
  // Canvas properties
  canvas: {
    width: 800,
    height: 600,
    toDataURL: jest.fn(() => 'data:image/png;base64,'),
    toBlob: jest.fn((callback) => callback && callback(new Blob())),
    getBoundingClientRect: jest.fn(() => ({
      top: 0, left: 0, right: 800, bottom: 600, width: 800, height: 600
    }))
  },
  // Canvas context properties with getters/setters
  _fillStyle: '#000000',
  get fillStyle() { return this._fillStyle; },
  set fillStyle(value) { this._fillStyle = value; },
  _strokeStyle: '#000000',
  get strokeStyle() { return this._strokeStyle; },
  set strokeStyle(value) { this._strokeStyle = value; },
  _lineWidth: 1,
  get lineWidth() { return this._lineWidth; },
  set lineWidth(value) { this._lineWidth = value; },
  _font: '10px sans-serif',
  get font() { return this._font; },
  set font(value) { this._font = value; },
  _textAlign: 'start',
  get textAlign() { return this._textAlign; },
  set textAlign(value) { this._textAlign = value; },
  _textBaseline: 'alphabetic',
  get textBaseline() { return this._textBaseline; },
  set textBaseline(value) { this._textBaseline = value; },
  _globalAlpha: 1,
  get globalAlpha() { return this._globalAlpha; },
  set globalAlpha(value) { this._globalAlpha = value; },
  _globalCompositeOperation: 'source-over',
  get globalCompositeOperation() { return this._globalCompositeOperation; },
  set globalCompositeOperation(value) { this._globalCompositeOperation = value; },
  _lineCap: 'butt',
  get lineCap() { return this._lineCap; },
  set lineCap(value) { this._lineCap = value; },
  _lineJoin: 'miter',
  get lineJoin() { return this._lineJoin; },
  set lineJoin(value) { this._lineJoin = value; },
  _miterLimit: 10,
  get miterLimit() { return this._miterLimit; },
  set miterLimit(value) { this._miterLimit = value; },
  _shadowBlur: 0,
  get shadowBlur() { return this._shadowBlur; },
  set shadowBlur(value) { this._shadowBlur = value; },
  _shadowColor: 'rgba(0, 0, 0, 0)',
  get shadowColor() { return this._shadowColor; },
  set shadowColor(value) { this._shadowColor = value; },
  _shadowOffsetX: 0,
  get shadowOffsetX() { return this._shadowOffsetX; },
  set shadowOffsetX(value) { this._shadowOffsetX = value; },
  _shadowOffsetY: 0,
  get shadowOffsetY() { return this._shadowOffsetY; },
  set shadowOffsetY(value) { this._shadowOffsetY = value; }
});

// Mock HTMLCanvasElement getContext method
HTMLCanvasElement.prototype.getContext = jest.fn((contextType: string) => {
  if (contextType === '2d') {
    return createCanvasMock();
  }
  if (contextType === 'webgl' || contextType === 'experimental-webgl') {
    return {
      getExtension: jest.fn(),
      createShader: jest.fn(),
      shaderSource: jest.fn(),
      compileShader: jest.fn(),
      createProgram: jest.fn(),
      attachShader: jest.fn(),
      linkProgram: jest.fn(),
      useProgram: jest.fn(),
      createBuffer: jest.fn(),
      bindBuffer: jest.fn(),
      bufferData: jest.fn(),
      getAttribLocation: jest.fn(() => 0),
      getUniformLocation: jest.fn(() => ({})),
      enableVertexAttribArray: jest.fn(),
      vertexAttribPointer: jest.fn(),
      uniform1f: jest.fn(),
      uniform2f: jest.fn(),
      uniform3f: jest.fn(),
      uniform4f: jest.fn(),
      uniformMatrix4fv: jest.fn(),
      clear: jest.fn(),
      clearColor: jest.fn(),
      enable: jest.fn(),
      disable: jest.fn(),
      drawArrays: jest.fn(),
      drawElements: jest.fn(),
      viewport: jest.fn(),
      // WebGL constants
      VERTEX_SHADER: 35633,
      FRAGMENT_SHADER: 35632,
      ARRAY_BUFFER: 34962,
      ELEMENT_ARRAY_BUFFER: 34963,
      STATIC_DRAW: 35044,
      FLOAT: 5126,
      COLOR_BUFFER_BIT: 16384,
      DEPTH_BUFFER_BIT: 256,
      DEPTH_TEST: 2929
    };
  }
  return null;
}) as any;

// Enhanced Canvas element mocking
HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
HTMLCanvasElement.prototype.toBlob = jest.fn((callback) => {
  if (callback) {
    setTimeout(() => callback(new Blob(['fake-canvas-blob'], { type: 'image/png' })), 0);
  }
});

// Make canvas mock available globally for tests that need to access it
(global as any).createCanvasMock = createCanvasMock;

// Enhanced animation frame mocking with better performance tracking
let animationFrameId = 1;
const animationFrameCallbacks = new Map<number, FrameRequestCallback>();

global.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  const id = animationFrameId++;
  animationFrameCallbacks.set(id, callback);
  // Simulate 60fps timing
  setTimeout(() => {
    const cb = animationFrameCallbacks.get(id);
    if (cb) {
      animationFrameCallbacks.delete(id);
      cb(performance.now());
    }
  }, 16.67);
  return id;
});

global.cancelAnimationFrame = jest.fn((id: number) => {
  animationFrameCallbacks.delete(id);
});

// Utility function to flush all pending animation frames (for tests)
(global as any).flushAnimationFrames = () => {
  const callbacks = Array.from(animationFrameCallbacks.values());
  animationFrameCallbacks.clear();
  callbacks.forEach(callback => callback(performance.now()));
};

// Mock performance API for consistent timing in tests
if (!global.performance) {
  global.performance = {} as any;
}

const mockPerformanceNow = (() => {
  let time = 0;
  return jest.fn(() => (time += 16.67)); // Simulate 60fps
})();

global.performance.now = mockPerformanceNow;

// Enhanced console suppression with better filtering
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

beforeAll(() => {
  console.error = (...args: any[]) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      (
        message.includes('Warning: ReactDOM.render is no longer supported') ||
        message.includes('Warning: componentWillReceiveProps') ||
        message.includes('Warning: componentWillUpdate') ||
        message.includes('act(...)') ||
        message.includes('Canvas') ||
        message.includes('WebGL') ||
        message.includes('THREE.') ||
        message.includes('Warning: Each child in a list should have a unique "key" prop') ||
        message.includes('Warning: Failed prop type')
      )
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      (
        message.includes('componentWillReceiveProps') ||
        message.includes('componentWillUpdate') ||
        message.includes('deprecated') ||
        message.includes('Canvas') ||
        message.includes('WebGL') ||
        message.includes('THREE.')
      )
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
});

// Jest cache clearing utilities
afterEach(() => {
  // Clear all mocks after each test to prevent conflicts
  jest.clearAllMocks();
  
  // Reset performance timing
  mockPerformanceNow.mockClear();
  
  // Clear animation frame callbacks
  animationFrameCallbacks.clear();
  animationFrameId = 1;
});

beforeEach(() => {
  // Reset canvas mock call counts
  if ((global as any).createCanvasMock) {
    const canvasMock = (global as any).createCanvasMock();
    Object.values(canvasMock).forEach(method => {
      if (typeof method === 'function' && typeof (method as any).mockClear === 'function') {
        (method as any).mockClear();
      }
    });
  }
});

// Utility function for tests to clear Jest cache manually
(global as any).clearJestCache = () => {
  if (jest.clearAllMocks) {
    jest.clearAllMocks();
  }
  
  // Clear module cache
  const moduleCache = require.cache;
  Object.keys(moduleCache).forEach(key => {
    if (key.includes('node_modules') === false) {
      delete moduleCache[key];
    }
  });
};

// Error boundary for tests
(global as any).TestErrorBoundary = class extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Test Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', { 'data-testid': 'error-boundary' }, 'Something went wrong.');
    }
    return this.props.children;
  }
};
