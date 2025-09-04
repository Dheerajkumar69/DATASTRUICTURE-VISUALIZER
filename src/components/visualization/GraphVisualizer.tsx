import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../themes/ThemeContext';

// Types
export type VertexState = 'unvisited' | 'visiting' | 'visited' | 'highlighted' | 'processed';
export type EdgeState = 'normal' | 'discovery' | 'back' | 'cross' | 'cycle' | 'tree' | 'highlighted';

export interface Vertex {
  id: number;
  x: number;
  y: number;
  name: string;
  state: VertexState;
  value?: any; // Optional value for the vertex
}

export interface Edge {
  from: number;
  to: number;
  state: EdgeState;
  weight?: number; // Optional weight for weighted graphs
  bidirectional?: boolean; // Whether the edge is bidirectional
}

export interface GraphData {
  vertices: Vertex[];
  edges: Edge[];
  cyclePath?: number[] | null;
  description?: string;
}

interface GraphVisualizerProps {
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
}

// Styled Components
const CanvasContainer = styled.div<{ width: number | string, height: number | string }>`
  width: ${props => typeof props.width === 'number' ? `${props.width}px` : props.width};
  height: ${props => typeof props.height === 'number' ? `${props.height}px` : props.height};
  position: relative;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

// Helper functions for rendering
const getVertexColor = (state: VertexState, theme: any) => {
  switch (state) {
    case 'visiting': return theme.colors.warning;
    case 'visited': return theme.colors.success;
    case 'highlighted': return theme.colors.accent;
    case 'processed': return theme.colors.info;
    default: return theme.colors.gray300;
  }
};

const getEdgeColor = (state: EdgeState, theme: any) => {
  switch (state) {
    case 'discovery': return theme.colors.primary;
    case 'back': return theme.colors.warning;
    case 'cross': return theme.colors.info;
    case 'cycle': return theme.colors.danger;
    case 'tree': return theme.colors.success;
    case 'highlighted': return theme.colors.accent;
    default: return theme.colors.gray400;
  }
};

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  data,
  width = '100%',
  height = '400px',
  nodeRadius = 25,
  edgeWidth = 2,
  arrowSize = 10,
  showWeights = false,
  showDirections = true,
  highlightPath = null,
  onVertexClick,
  onEdgeClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = useTheme();
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<{ from: number, to: number } | null>(null);
  
  // Handle canvas interactions
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if a vertex was clicked
    for (const vertex of data.vertices) {
      const dx = vertex.x - x;
      const dy = vertex.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= nodeRadius && onVertexClick) {
        onVertexClick(vertex);
        return;
      }
    }
    
    // Check if an edge was clicked
    if (onEdgeClick) {
      for (const edge of data.edges) {
        const fromVertex = data.vertices.find(v => v.id === edge.from);
        const toVertex = data.vertices.find(v => v.id === edge.to);
        
        if (fromVertex && toVertex) {
          // Check if the click is close to the edge line
          const isClose = isPointCloseToLine(
            x, y,
            fromVertex.x, fromVertex.y,
            toVertex.x, toVertex.y,
            10 // Tolerance in pixels
          );
          
          if (isClose) {
            onEdgeClick(edge);
            return;
          }
        }
      }
    }
  };
  
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check for hovered vertex
    let foundHoveredNode = false;
    for (const vertex of data.vertices) {
      const dx = vertex.x - x;
      const dy = vertex.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= nodeRadius) {
        setHoveredNode(vertex.id);
        foundHoveredNode = true;
        break;
      }
    }
    
    if (!foundHoveredNode) {
      setHoveredNode(null);
    }
    
    // Check for hovered edge
    let foundHoveredEdge = false;
    for (const edge of data.edges) {
      const fromVertex = data.vertices.find(v => v.id === edge.from);
      const toVertex = data.vertices.find(v => v.id === edge.to);
      
      if (fromVertex && toVertex) {
        const isClose = isPointCloseToLine(
          x, y,
          fromVertex.x, fromVertex.y,
          toVertex.x, toVertex.y,
          10 // Tolerance in pixels
        );
        
        if (isClose) {
          setHoveredEdge({ from: edge.from, to: edge.to });
          foundHoveredEdge = true;
          break;
        }
      }
    }
    
    if (!foundHoveredEdge) {
      setHoveredEdge(null);
    }
  };
  
  // Helper to check if a point is close to a line
  const isPointCloseToLine = (
    px: number, py: number,
    x1: number, y1: number,
    x2: number, y2: number,
    tolerance: number
  ) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate the projection of point onto the line
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (length * length)));
    
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    
    // Calculate distance from point to projection
    const distX = px - projX;
    const distY = py - projY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    
    return distance <= tolerance;
  };
  
  // Main rendering function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size based on container
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate edge curves for parallel edges
    const edgeCounts: Record<string, number> = {};
    const edgeIndices: Record<string, number> = {};
    
    for (const edge of data.edges) {
      const edgeKey = `${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}`;
      edgeCounts[edgeKey] = (edgeCounts[edgeKey] || 0) + 1;
    }
    
    for (const edge of data.edges) {
      const edgeKey = `${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}`;
      edgeIndices[`${edge.from}-${edge.to}`] = edgeCounts[edgeKey] > 1 ? 
        (edgeIndices[`${edge.from}-${edge.to}`] || 0) + 1 : 0;
    }
    
    // Draw edges (normal edges first, then special edges)
    const edgeTypes: EdgeState[] = ['normal', 'discovery', 'back', 'cross', 'cycle', 'tree', 'highlighted'];
    
    for (const edgeType of edgeTypes) {
      data.edges
        .filter(edge => edge.state === edgeType)
        .forEach(edge => {
          const source = data.vertices.find(v => v.id === edge.from);
          const target = data.vertices.find(v => v.id === edge.to);
          
          if (!source || !target) return;
          
          // Check if edge is in highlighted path
          const isHighlighted = highlightPath && 
            highlightPath.includes(edge.from) && 
            highlightPath.includes(edge.to) &&
            highlightPath.indexOf(edge.from) === highlightPath.indexOf(edge.to) - 1;
          
          // Calculate if there are parallel edges
          const edgeKey = `${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}`;
          const isParallel = edgeCounts[edgeKey] > 1;
          const edgeIndex = edgeIndices[`${edge.from}-${edge.to}`] || 0;
          
          // Determine edge curvature for parallel edges
          let controlPointOffset = 0;
          if (isParallel) {
            const offsetAmount = 30;
            controlPointOffset = offsetAmount * (edgeIndex - (edgeCounts[edgeKey] - 1) / 2);
          }
          
          // Calculate direction vector
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          
          // Normalized perpendicular vector for control point
          const perpX = -dy / length;
          const perpY = dx / length;
          
          // Calculate control point for curved edges
          const controlX = (source.x + target.x) / 2 + perpX * controlPointOffset;
          const controlY = (source.y + target.y) / 2 + perpY * controlPointOffset;
          
          // Calculate start and end points adjusted for node radius
          const startX = source.x + (nodeRadius * dx) / length;
          const startY = source.y + (nodeRadius * dy) / length;
          
          let endX = target.x - (nodeRadius * dx) / length;
          let endY = target.y - (nodeRadius * dy) / length;
          
          // If bidirectional, adjust end points to not overlap with the other arrow
          if (edge.bidirectional) {
            endX = target.x - (nodeRadius * 1.2 * dx) / length;
            endY = target.y - (nodeRadius * 1.2 * dy) / length;
          }
          
          // Set edge style
          ctx.strokeStyle = isHighlighted ? 
            theme.colors.accent : 
            hoveredEdge && hoveredEdge.from === edge.from && hoveredEdge.to === edge.to ?
              theme.colors.highlight :
              getEdgeColor(edge.state, theme);
          
          ctx.lineWidth = isHighlighted ? edgeWidth * 2 : edgeWidth;
          
          // Draw the edge (curved if parallel)
          ctx.beginPath();
          
          if (isParallel) {
            ctx.moveTo(startX, startY);
            ctx.quadraticCurveTo(controlX, controlY, endX, endY);
          } else {
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
          }
          
          ctx.stroke();
          
          // Draw arrowhead if directed
          if (showDirections && !edge.bidirectional) {
            // Get the end point of the curve
            let endPointX, endPointY, endAngle;
            
            if (isParallel) {
              // For curved lines, calculate the tangent at the end point
              const t = 1; // End of the curve
              const dx = 2 * (1 - t) * (controlX - startX) + 2 * t * (endX - controlX);
              const dy = 2 * (1 - t) * (controlY - startY) + 2 * t * (endY - controlY);
              endAngle = Math.atan2(dy, dx);
              endPointX = endX;
              endPointY = endY;
            } else {
              // For straight lines
              endAngle = Math.atan2(dy, dx);
              endPointX = endX;
              endPointY = endY;
            }
            
            // Draw arrowhead
            ctx.beginPath();
            ctx.moveTo(endPointX, endPointY);
            ctx.lineTo(
              endPointX - arrowSize * Math.cos(endAngle - Math.PI / 6),
              endPointY - arrowSize * Math.sin(endAngle - Math.PI / 6)
            );
            ctx.lineTo(
              endPointX - arrowSize * Math.cos(endAngle + Math.PI / 6),
              endPointY - arrowSize * Math.sin(endAngle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = isHighlighted ? theme.colors.accent : getEdgeColor(edge.state, theme);
            ctx.fill();
          }
          
          // Draw bidirectional arrows if needed
          if (edge.bidirectional) {
            // Draw arrow from source to target
            const angleToTarget = Math.atan2(dy, dx);
            
            // Draw first arrowhead (source to target)
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
              endX - arrowSize * Math.cos(angleToTarget - Math.PI / 6),
              endY - arrowSize * Math.sin(angleToTarget - Math.PI / 6)
            );
            ctx.lineTo(
              endX - arrowSize * Math.cos(angleToTarget + Math.PI / 6),
              endY - arrowSize * Math.sin(angleToTarget + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = isHighlighted ? theme.colors.accent : getEdgeColor(edge.state, theme);
            ctx.fill();
            
            // Draw second arrowhead (target to source)
            const revStartX = target.x + (nodeRadius * -dx) / length;
            const revStartY = target.y + (nodeRadius * -dy) / length;
            const revEndX = source.x - (nodeRadius * -dx) / length;
            const revEndY = source.y - (nodeRadius * -dy) / length;
            
            ctx.beginPath();
            ctx.moveTo(revStartX, revStartY);
            ctx.lineTo(
              revStartX - arrowSize * Math.cos(angleToTarget + Math.PI - Math.PI / 6),
              revStartY - arrowSize * Math.sin(angleToTarget + Math.PI - Math.PI / 6)
            );
            ctx.lineTo(
              revStartX - arrowSize * Math.cos(angleToTarget + Math.PI + Math.PI / 6),
              revStartY - arrowSize * Math.sin(angleToTarget + Math.PI + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = isHighlighted ? theme.colors.accent : getEdgeColor(edge.state, theme);
            ctx.fill();
          }
          
          // Draw weight if needed
          if (showWeights && edge.weight !== undefined) {
            ctx.font = '12px Arial';
            ctx.fillStyle = theme.colors.text;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const textX = isParallel ? controlX : (source.x + target.x) / 2;
            const textY = isParallel ? controlY : (source.y + target.y) / 2;
            
            // Add a white background for better readability
            const weightText = edge.weight.toString();
            const textWidth = ctx.measureText(weightText).width;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(textX - textWidth / 2 - 3, textY - 8, textWidth + 6, 16);
            
            ctx.fillStyle = theme.colors.text;
            ctx.fillText(weightText, textX, textY);
          }
        });
    }
    
    // Draw vertices
    data.vertices.forEach(vertex => {
      // Check if vertex is in highlighted path
      const isInPath = highlightPath?.includes(vertex.id) ?? false;
      const isHovered = hoveredNode === vertex.id;
      
      // Draw node circle
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, nodeRadius, 0, Math.PI * 2);
      
      const fillColor = isInPath ? 
        theme.colors.accent : 
        isHovered ? 
          theme.colors.highlight : 
          getVertexColor(vertex.state, theme);
      
      ctx.fillStyle = fillColor;
      ctx.fill();
      
      // Draw border with thicker stroke for highlighted/hovered nodes
      ctx.strokeStyle = isInPath || isHovered ? theme.colors.text : theme.colors.border;
      ctx.lineWidth = isInPath || isHovered ? 3 : 1;
      ctx.stroke();
      
      // Draw vertex label
      ctx.fillStyle = 
        (vertex.state === 'unvisited' && !isInPath && !isHovered) ? 
          theme.colors.text : 
          '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(vertex.name, vertex.x, vertex.y);
      
      // Draw value if present
      if (vertex.value !== undefined) {
        ctx.font = '12px Arial';
        ctx.fillStyle = theme.colors.text;
        ctx.fillText(`(${vertex.value})`, vertex.x, vertex.y + nodeRadius + 15);
      }
    });
    
  }, [data, nodeRadius, edgeWidth, arrowSize, showWeights, showDirections, highlightPath, hoveredNode, hoveredEdge, theme]);
  
  return (
    <CanvasContainer width={width} height={height}>
      <Canvas 
        ref={canvasRef} 
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
      />
    </CanvasContainer>
  );
};

export default GraphVisualizer; 