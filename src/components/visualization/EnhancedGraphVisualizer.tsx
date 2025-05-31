import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import GraphVisualizer, { GraphData, Vertex, Edge } from './GraphVisualizer';
import { FaSearchPlus, FaSearchMinus, FaExpand, FaCompress } from 'react-icons/fa';

interface EnhancedGraphVisualizerProps {
  data: GraphData;
  width?: number | string;
  height?: number | string;
  nodeRadius?: number;
  edgeWidth?: number;
  arrowSize?: number;
  showWeights?: boolean;
  showDirections?: boolean;
  highlightPath?: number[] | null;
  onVertexClick?: (vertex: Vertex) => void;
  onEdgeClick?: (edge: Edge) => void;
  autoFit?: boolean;
  allowZoomPan?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
`;

const ControlsOverlay = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
  z-index: 10;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

const EnhancedGraphVisualizer: React.FC<EnhancedGraphVisualizerProps> = ({
  data,
  width = '100%',
  height = '100%',
  nodeRadius = 25,
  edgeWidth = 2,
  arrowSize = 10,
  showWeights = false,
  showDirections = true,
  highlightPath = null,
  onVertexClick,
  onEdgeClick,
  autoFit = true,
  allowZoomPan = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [transformedData, setTransformedData] = useState<GraphData>(data);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  // Track container size changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerSize({ width: clientWidth, height: clientHeight });
      }
    };
    
    // Call once initially
    updateSize();
    
    // Set up resize observer to detect container size changes
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    
    // Clean up
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);
  
  // Auto-fit the graph to the canvas whenever container size or data changes
  useEffect(() => {
    if (!autoFit || !data.vertices.length || containerSize.width === 0 || containerSize.height === 0) return;
    
    // Calculate graph bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    data.vertices.forEach(vertex => {
      minX = Math.min(minX, vertex.x);
      minY = Math.min(minY, vertex.y);
      maxX = Math.max(maxX, vertex.x);
      maxY = Math.max(maxY, vertex.y);
    });
    
    // Add padding
    const padding = nodeRadius * 2;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    
    // Calculate scale to fit
    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    
    if (graphWidth <= 0 || graphHeight <= 0) return;
    
    const scaleX = containerSize.width / graphWidth;
    const scaleY = containerSize.height / graphHeight;
    const newScale = Math.min(scaleX, scaleY, 2); // Limit max scale to 2x
    
    // Calculate position to center
    const newX = (containerSize.width - graphWidth * newScale) / 2 - minX * newScale;
    const newY = (containerSize.height - graphHeight * newScale) / 2 - minY * newScale;
    
    setScale(newScale);
    setPosition({ x: newX, y: newY });
  }, [data, autoFit, nodeRadius, containerSize]);
  
  // Transform data based on scale and position
  useEffect(() => {
    const transformedVertices = data.vertices.map(vertex => ({
      ...vertex,
      x: vertex.x * scale + position.x,
      y: vertex.y * scale + position.y
    }));
    
    setTransformedData({
      ...data,
      vertices: transformedVertices
    });
  }, [data, scale, position]);
  
  // Handle zoom in
  const handleZoomIn = () => {
    setScale(prevScale => prevScale * 1.2);
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setScale(prevScale => prevScale / 1.2);
  };
  
  // Handle reset view
  const handleResetView = () => {
    if (autoFit && containerSize.width > 0 && containerSize.height > 0) {
      // Recalculate fit
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      data.vertices.forEach(vertex => {
        minX = Math.min(minX, vertex.x);
        minY = Math.min(minY, vertex.y);
        maxX = Math.max(maxX, vertex.x);
        maxY = Math.max(maxY, vertex.y);
      });
      
      // Add padding
      const padding = nodeRadius * 2;
      minX -= padding;
      minY -= padding;
      maxX += padding;
      maxY += padding;
      
      // Calculate scale to fit
      const graphWidth = maxX - minX;
      const graphHeight = maxY - minY;
      
      if (graphWidth <= 0 || graphHeight <= 0) return;
      
      const scaleX = containerSize.width / graphWidth;
      const scaleY = containerSize.height / graphHeight;
      const newScale = Math.min(scaleX, scaleY, 2);
      
      // Calculate position to center
      const newX = (containerSize.width - graphWidth * newScale) / 2 - minX * newScale;
      const newY = (containerSize.height - graphHeight * newScale) / 2 - minY * newScale;
      
      setScale(newScale);
      setPosition({ x: newX, y: newY });
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };
  
  // Handle mouse down for dragging
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!allowZoomPan) return;
    
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !allowZoomPan) return;
    
    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;
    
    setPosition(prevPosition => ({
      x: prevPosition.x + dx,
      y: prevPosition.y + dy
    }));
    
    setDragStart({ x: event.clientX, y: event.clientY });
  };
  
  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle mouse wheel for zooming
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!allowZoomPan) return;
    
    event.preventDefault();
    
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    
    // Calculate cursor position relative to container
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const cursorX = event.clientX - containerRect.left;
    const cursorY = event.clientY - containerRect.top;
    
    // Calculate new scale
    const newScale = scale * zoomFactor;
    
    // Calculate new position to zoom into cursor position
    const newX = cursorX - (cursorX - position.x) * zoomFactor;
    const newY = cursorY - (cursorY - position.y) * zoomFactor;
    
    setScale(newScale);
    setPosition({ x: newX, y: newY });
  };
  
  return (
    <Container 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {allowZoomPan && (
        <ControlsOverlay>
          <ControlButton onClick={handleZoomIn} title="Zoom In">
            <FaSearchPlus />
          </ControlButton>
          <ControlButton onClick={handleZoomOut} title="Zoom Out">
            <FaSearchMinus />
          </ControlButton>
          <ControlButton onClick={handleResetView} title="Reset View">
            <FaExpand />
          </ControlButton>
        </ControlsOverlay>
      )}
      <GraphVisualizer
        data={transformedData}
        width={width}
        height={height}
        nodeRadius={nodeRadius * scale}
        edgeWidth={edgeWidth * scale}
        arrowSize={arrowSize * scale}
        showWeights={showWeights}
        showDirections={showDirections}
        highlightPath={highlightPath}
        onVertexClick={onVertexClick}
        onEdgeClick={onEdgeClick}
      />
    </Container>
  );
};

export default EnhancedGraphVisualizer; 