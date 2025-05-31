declare namespace NodeJS {
  interface Timeout {
    _idleTimeout: number;
    _idlePrev: any;
    _idleNext: any;
    _idleStart: number;
    _onTimeout: () => void;
    _timerArgs: any[];
    _repeat: Function | null;
    _destroyed: boolean;
    [Symbol.toPrimitive](): number;
  }
}

interface Window {
  requestAnimationFrame: (callback: FrameRequestCallback) => number;
  cancelAnimationFrame: (handle: number) => void;
} 