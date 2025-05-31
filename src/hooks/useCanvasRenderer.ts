import { useRef, useEffect, RefObject, useCallback } from 'react';

type RenderFunction<T> = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  data: T,
  time: number
) => void;

/**
 * Custom hook for optimized canvas rendering using requestAnimationFrame
 * @param render The render function to call each animation frame
 * @param data The data to pass to the render function
 * @param dependencies Additional dependencies to trigger re-renders
 */
function useCanvasRenderer<T>(
  render: RenderFunction<T>, 
  data: T, 
  dependencies: any[] = []
): RefObject<HTMLCanvasElement> {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const renderFnRef = useRef<RenderFunction<T>>(render);
  const dataRef = useRef<T>(data);
  
  // Update refs when dependencies change
  useEffect(() => {
    renderFnRef.current = render;
    dataRef.current = data;
  }, [render, data, ...dependencies]);
  
  // Animation loop using requestAnimationFrame
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size to match display size
        const rect = canvas.getBoundingClientRect();
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          const dpr = window.devicePixelRatio || 1;
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          ctx.scale(dpr, dpr);
          
          // Apply styles to make the canvas scale correctly
          canvas.style.width = `${rect.width}px`;
          canvas.style.height = `${rect.height}px`;
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Call render function with current data
        renderFnRef.current(ctx, canvas, dataRef.current, time);
      }
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);
  
  // Start animation loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]); 
  
  return canvasRef;
}

export default useCanvasRenderer; 