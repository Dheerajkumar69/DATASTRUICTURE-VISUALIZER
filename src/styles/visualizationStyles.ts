// Visualization style configurations
export interface VisualizationStyle {
  id: string;
  name: string;
  description: string;
  nodeStyles: {
    default: NodeStyle;
    highlighted: NodeStyle;
    visited: NodeStyle;
    current: NodeStyle;
    selected: NodeStyle;
  };
  edgeStyles: {
    default: EdgeStyle;
    highlighted: EdgeStyle;
    visited: EdgeStyle;
    current: EdgeStyle;
    selected: EdgeStyle;
  };
  canvasStyle: CanvasStyle;
  animationStyle: AnimationStyle;
}

export interface NodeStyle {
  radius: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

export interface EdgeStyle {
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray?: number[];
  arrowSize: number;
  arrowColor: string;
  labelColor: string;
  labelFontSize: number;
  labelFontFamily: string;
  labelBackgroundColor?: string;
  labelPadding?: number;
}

export interface CanvasStyle {
  backgroundColor: string;
  gridColor?: string;
  gridSize?: number;
  showGrid?: boolean;
  borderColor?: string;
  borderWidth?: number;
}

export interface AnimationStyle {
  duration: number; // in milliseconds
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'elastic';
  highlightDuration: number;
  pulseEffect: boolean;
  trailEffect: boolean;
  particleEffect: boolean;
}

// Predefined visualization styles
export const visualizationStyles: VisualizationStyle[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and minimalist design with subtle shadows',
    nodeStyles: {
      default: {
        radius: 25,
        fillColor: '#4F46E5',
        strokeColor: '#3730A3',
        strokeWidth: 2,
        textColor: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
        shadowColor: 'rgba(79, 70, 229, 0.3)',
        shadowBlur: 8,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
      },
      highlighted: {
        radius: 28,
        fillColor: '#7C3AED',
        strokeColor: '#5B21B6',
        strokeWidth: 3,
        textColor: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
        shadowColor: 'rgba(124, 58, 237, 0.5)',
        shadowBlur: 12,
        shadowOffsetX: 0,
        shadowOffsetY: 6,
      },
      visited: {
        radius: 25,
        fillColor: '#10B981',
        strokeColor: '#059669',
        strokeWidth: 2,
        textColor: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
        shadowColor: 'rgba(16, 185, 129, 0.3)',
        shadowBlur: 8,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
      },
      current: {
        radius: 30,
        fillColor: '#F59E0B',
        strokeColor: '#D97706',
        strokeWidth: 4,
        textColor: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '700',
        shadowColor: 'rgba(245, 158, 11, 0.6)',
        shadowBlur: 16,
        shadowOffsetX: 0,
        shadowOffsetY: 8,
      },
      selected: {
        radius: 27,
        fillColor: '#EF4444',
        strokeColor: '#DC2626',
        strokeWidth: 3,
        textColor: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
        shadowColor: 'rgba(239, 68, 68, 0.4)',
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 5,
      }
    },
    edgeStyles: {
      default: {
        strokeColor: '#6B7280',
        strokeWidth: 2,
        arrowSize: 8,
        arrowColor: '#6B7280',
        labelColor: '#374151',
        labelFontSize: 12,
        labelFontFamily: 'Inter, sans-serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        labelPadding: 4,
      },
      highlighted: {
        strokeColor: '#7C3AED',
        strokeWidth: 3,
        arrowSize: 10,
        arrowColor: '#7C3AED',
        labelColor: '#5B21B6',
        labelFontSize: 12,
        labelFontFamily: 'Inter, sans-serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.95)',
        labelPadding: 4,
      },
      visited: {
        strokeColor: '#10B981',
        strokeWidth: 2,
        arrowSize: 8,
        arrowColor: '#10B981',
        labelColor: '#065F46',
        labelFontSize: 12,
        labelFontFamily: 'Inter, sans-serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        labelPadding: 4,
      },
      current: {
        strokeColor: '#F59E0B',
        strokeWidth: 4,
        arrowSize: 12,
        arrowColor: '#F59E0B',
        labelColor: '#92400E',
        labelFontSize: 13,
        labelFontFamily: 'Inter, sans-serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.95)',
        labelPadding: 5,
      },
      selected: {
        strokeColor: '#EF4444',
        strokeWidth: 3,
        arrowSize: 10,
        arrowColor: '#EF4444',
        labelColor: '#991B1B',
        labelFontSize: 12,
        labelFontFamily: 'Inter, sans-serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        labelPadding: 4,
      }
    },
    canvasStyle: {
      backgroundColor: '#F9FAFB',
      gridColor: 'rgba(107, 114, 128, 0.1)',
      gridSize: 20,
      showGrid: true,
      borderColor: '#E5E7EB',
      borderWidth: 1,
    },
    animationStyle: {
      duration: 800,
      easing: 'easeInOut',
      highlightDuration: 400,
      pulseEffect: true,
      trailEffect: false,
      particleEffect: false,
    }
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Vibrant cyberpunk-inspired design with glowing effects',
    nodeStyles: {
      default: {
        radius: 24,
        fillColor: '#000000',
        strokeColor: '#00FFFF',
        strokeWidth: 3,
        textColor: '#00FFFF',
        fontSize: 14,
        fontFamily: 'Courier New, monospace',
        fontWeight: 'bold',
        shadowColor: '#00FFFF',
        shadowBlur: 15,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
      highlighted: {
        radius: 28,
        fillColor: '#1A1A2E',
        strokeColor: '#FF00FF',
        strokeWidth: 4,
        textColor: '#FF00FF',
        fontSize: 14,
        fontFamily: 'Courier New, monospace',
        fontWeight: 'bold',
        shadowColor: '#FF00FF',
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
      visited: {
        radius: 24,
        fillColor: '#0F0F23',
        strokeColor: '#39FF14',
        strokeWidth: 3,
        textColor: '#39FF14',
        fontSize: 14,
        fontFamily: 'Courier New, monospace',
        fontWeight: 'bold',
        shadowColor: '#39FF14',
        shadowBlur: 15,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
      current: {
        radius: 32,
        fillColor: '#2A0845',
        strokeColor: '#FFD700',
        strokeWidth: 5,
        textColor: '#FFD700',
        fontSize: 16,
        fontFamily: 'Courier New, monospace',
        fontWeight: 'bold',
        shadowColor: '#FFD700',
        shadowBlur: 25,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
      selected: {
        radius: 26,
        fillColor: '#330A0A',
        strokeColor: '#FF073A',
        strokeWidth: 4,
        textColor: '#FF073A',
        fontSize: 14,
        fontFamily: 'Courier New, monospace',
        fontWeight: 'bold',
        shadowColor: '#FF073A',
        shadowBlur: 18,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      }
    },
    edgeStyles: {
      default: {
        strokeColor: '#00FFFF',
        strokeWidth: 2,
        arrowSize: 10,
        arrowColor: '#00FFFF',
        labelColor: '#FFFFFF',
        labelFontSize: 11,
        labelFontFamily: 'Courier New, monospace',
        labelBackgroundColor: 'rgba(0, 0, 0, 0.8)',
        labelPadding: 3,
      },
      highlighted: {
        strokeColor: '#FF00FF',
        strokeWidth: 3,
        strokeDashArray: [5, 3],
        arrowSize: 12,
        arrowColor: '#FF00FF',
        labelColor: '#FF00FF',
        labelFontSize: 11,
        labelFontFamily: 'Courier New, monospace',
        labelBackgroundColor: 'rgba(26, 26, 46, 0.9)',
        labelPadding: 3,
      },
      visited: {
        strokeColor: '#39FF14',
        strokeWidth: 2,
        arrowSize: 10,
        arrowColor: '#39FF14',
        labelColor: '#39FF14',
        labelFontSize: 11,
        labelFontFamily: 'Courier New, monospace',
        labelBackgroundColor: 'rgba(15, 15, 35, 0.8)',
        labelPadding: 3,
      },
      current: {
        strokeColor: '#FFD700',
        strokeWidth: 4,
        strokeDashArray: [8, 4],
        arrowSize: 14,
        arrowColor: '#FFD700',
        labelColor: '#FFD700',
        labelFontSize: 12,
        labelFontFamily: 'Courier New, monospace',
        labelBackgroundColor: 'rgba(42, 8, 69, 0.9)',
        labelPadding: 4,
      },
      selected: {
        strokeColor: '#FF073A',
        strokeWidth: 3,
        arrowSize: 12,
        arrowColor: '#FF073A',
        labelColor: '#FF073A',
        labelFontSize: 11,
        labelFontFamily: 'Courier New, monospace',
        labelBackgroundColor: 'rgba(51, 10, 10, 0.8)',
        labelPadding: 3,
      }
    },
    canvasStyle: {
      backgroundColor: '#0D001A',
      gridColor: 'rgba(0, 255, 255, 0.1)',
      gridSize: 25,
      showGrid: true,
      borderColor: '#00FFFF',
      borderWidth: 2,
    },
    animationStyle: {
      duration: 1200,
      easing: 'elastic',
      highlightDuration: 600,
      pulseEffect: true,
      trailEffect: true,
      particleEffect: true,
    }
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional academic style with clean lines and standard colors',
    nodeStyles: {
      default: {
        radius: 22,
        fillColor: '#FFFFFF',
        strokeColor: '#000000',
        strokeWidth: 2,
        textColor: '#000000',
        fontSize: 13,
        fontFamily: 'Times New Roman, serif',
        fontWeight: 'normal',
      },
      highlighted: {
        radius: 24,
        fillColor: '#E0E0E0',
        strokeColor: '#000000',
        strokeWidth: 3,
        textColor: '#000000',
        fontSize: 13,
        fontFamily: 'Times New Roman, serif',
        fontWeight: 'bold',
      },
      visited: {
        radius: 22,
        fillColor: '#C0C0C0',
        strokeColor: '#000000',
        strokeWidth: 2,
        textColor: '#000000',
        fontSize: 13,
        fontFamily: 'Times New Roman, serif',
        fontWeight: 'normal',
      },
      current: {
        radius: 26,
        fillColor: '#FFD700',
        strokeColor: '#000000',
        strokeWidth: 3,
        textColor: '#000000',
        fontSize: 14,
        fontFamily: 'Times New Roman, serif',
        fontWeight: 'bold',
      },
      selected: {
        radius: 24,
        fillColor: '#FF6B6B',
        strokeColor: '#000000',
        strokeWidth: 3,
        textColor: '#FFFFFF',
        fontSize: 13,
        fontFamily: 'Times New Roman, serif',
        fontWeight: 'bold',
      }
    },
    edgeStyles: {
      default: {
        strokeColor: '#000000',
        strokeWidth: 2,
        arrowSize: 8,
        arrowColor: '#000000',
        labelColor: '#000000',
        labelFontSize: 12,
        labelFontFamily: 'Times New Roman, serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.8)',
        labelPadding: 2,
      },
      highlighted: {
        strokeColor: '#0000FF',
        strokeWidth: 3,
        arrowSize: 10,
        arrowColor: '#0000FF',
        labelColor: '#0000FF',
        labelFontSize: 12,
        labelFontFamily: 'Times New Roman, serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        labelPadding: 2,
      },
      visited: {
        strokeColor: '#808080',
        strokeWidth: 2,
        arrowSize: 8,
        arrowColor: '#808080',
        labelColor: '#808080',
        labelFontSize: 12,
        labelFontFamily: 'Times New Roman, serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.8)',
        labelPadding: 2,
      },
      current: {
        strokeColor: '#FF8C00',
        strokeWidth: 4,
        arrowSize: 12,
        arrowColor: '#FF8C00',
        labelColor: '#FF8C00',
        labelFontSize: 13,
        labelFontFamily: 'Times New Roman, serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        labelPadding: 3,
      },
      selected: {
        strokeColor: '#DC143C',
        strokeWidth: 3,
        arrowSize: 10,
        arrowColor: '#DC143C',
        labelColor: '#DC143C',
        labelFontSize: 12,
        labelFontFamily: 'Times New Roman, serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.8)',
        labelPadding: 2,
      }
    },
    canvasStyle: {
      backgroundColor: '#FFFFFF',
      gridColor: 'rgba(0, 0, 0, 0.1)',
      gridSize: 20,
      showGrid: false,
      borderColor: '#000000',
      borderWidth: 1,
    },
    animationStyle: {
      duration: 600,
      easing: 'linear',
      highlightDuration: 300,
      pulseEffect: false,
      trailEffect: false,
      particleEffect: false,
    }
  },
  {
    id: 'pastel',
    name: 'Pastel',
    description: 'Soft and gentle colors with rounded edges',
    nodeStyles: {
      default: {
        radius: 26,
        fillColor: '#FFE5E5',
        strokeColor: '#FFB3B3',
        strokeWidth: 2,
        textColor: '#8B5A5A',
        fontSize: 13,
        fontFamily: 'Georgia, serif',
        fontWeight: '500',
        shadowColor: 'rgba(255, 179, 179, 0.3)',
        shadowBlur: 6,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
      },
      highlighted: {
        radius: 28,
        fillColor: '#E5E5FF',
        strokeColor: '#B3B3FF',
        strokeWidth: 3,
        textColor: '#5A5A8B',
        fontSize: 13,
        fontFamily: 'Georgia, serif',
        fontWeight: '600',
        shadowColor: 'rgba(179, 179, 255, 0.4)',
        shadowBlur: 8,
        shadowOffsetX: 2,
        shadowOffsetY: 3,
      },
      visited: {
        radius: 26,
        fillColor: '#E5FFE5',
        strokeColor: '#B3FFB3',
        strokeWidth: 2,
        textColor: '#5A8B5A',
        fontSize: 13,
        fontFamily: 'Georgia, serif',
        fontWeight: '500',
        shadowColor: 'rgba(179, 255, 179, 0.3)',
        shadowBlur: 6,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
      },
      current: {
        radius: 30,
        fillColor: '#FFFFE5',
        strokeColor: '#FFFFB3',
        strokeWidth: 4,
        textColor: '#8B8B5A',
        fontSize: 14,
        fontFamily: 'Georgia, serif',
        fontWeight: '700',
        shadowColor: 'rgba(255, 255, 179, 0.5)',
        shadowBlur: 10,
        shadowOffsetX: 3,
        shadowOffsetY: 4,
      },
      selected: {
        radius: 27,
        fillColor: '#FFE5CC',
        strokeColor: '#FFB366',
        strokeWidth: 3,
        textColor: '#8B5A2B',
        fontSize: 13,
        fontFamily: 'Georgia, serif',
        fontWeight: '600',
        shadowColor: 'rgba(255, 179, 102, 0.4)',
        shadowBlur: 7,
        shadowOffsetX: 2,
        shadowOffsetY: 3,
      }
    },
    edgeStyles: {
      default: {
        strokeColor: '#D4A5A5',
        strokeWidth: 2,
        arrowSize: 8,
        arrowColor: '#D4A5A5',
        labelColor: '#8B5A5A',
        labelFontSize: 11,
        labelFontFamily: 'Georgia, serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.85)',
        labelPadding: 3,
      },
      highlighted: {
        strokeColor: '#A5A5D4',
        strokeWidth: 3,
        arrowSize: 10,
        arrowColor: '#A5A5D4',
        labelColor: '#5A5A8B',
        labelFontSize: 11,
        labelFontFamily: 'Georgia, serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        labelPadding: 3,
      },
      visited: {
        strokeColor: '#A5D4A5',
        strokeWidth: 2,
        arrowSize: 8,
        arrowColor: '#A5D4A5',
        labelColor: '#5A8B5A',
        labelFontSize: 11,
        labelFontFamily: 'Georgia, serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.85)',
        labelPadding: 3,
      },
      current: {
        strokeColor: '#D4D4A5',
        strokeWidth: 4,
        arrowSize: 12,
        arrowColor: '#D4D4A5',
        labelColor: '#8B8B5A',
        labelFontSize: 12,
        labelFontFamily: 'Georgia, serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        labelPadding: 4,
      },
      selected: {
        strokeColor: '#D4B366',
        strokeWidth: 3,
        arrowSize: 10,
        arrowColor: '#D4B366',
        labelColor: '#8B5A2B',
        labelFontSize: 11,
        labelFontFamily: 'Georgia, serif',
        labelBackgroundColor: 'rgba(255, 255, 255, 0.85)',
        labelPadding: 3,
      }
    },
    canvasStyle: {
      backgroundColor: '#FEFEFE',
      gridColor: 'rgba(212, 165, 165, 0.2)',
      gridSize: 25,
      showGrid: true,
      borderColor: '#E8E8E8',
      borderWidth: 1,
    },
    animationStyle: {
      duration: 1000,
      easing: 'easeOut',
      highlightDuration: 500,
      pulseEffect: true,
      trailEffect: false,
      particleEffect: false,
    }
  }
];

// Style utilities
export const styleUtils = {
  /**
   * Get style by ID
   */
  getStyleById(id: string): VisualizationStyle | undefined {
    return visualizationStyles.find(style => style.id === id);
  },

  /**
   * Get all available style names
   */
  getStyleNames(): string[] {
    return visualizationStyles.map(style => style.name);
  },

  /**
   * Create a custom style based on an existing style
   */
  createCustomStyle(baseStyleId: string, overrides: Partial<VisualizationStyle>): VisualizationStyle | null {
    const baseStyle = this.getStyleById(baseStyleId);
    if (!baseStyle) return null;

    return {
      ...baseStyle,
      ...overrides,
      nodeStyles: {
        ...baseStyle.nodeStyles,
        ...(overrides.nodeStyles || {})
      },
      edgeStyles: {
        ...baseStyle.edgeStyles,
        ...(overrides.edgeStyles || {})
      },
      canvasStyle: {
        ...baseStyle.canvasStyle,
        ...(overrides.canvasStyle || {})
      },
      animationStyle: {
        ...baseStyle.animationStyle,
        ...(overrides.animationStyle || {})
      }
    };
  },

  /**
   * Interpolate between two styles for smooth transitions
   */
  interpolateStyles(style1: VisualizationStyle, style2: VisualizationStyle, t: number): VisualizationStyle {
    const clamp = (value: number, min: number = 0, max: number = 1) => Math.min(Math.max(value, min), max);
    t = clamp(t);

    const interpolateColor = (color1: string, color2: string): string => {
      // Simple linear interpolation for hex colors
      const hex1 = color1.replace('#', '');
      const hex2 = color2.replace('#', '');
      
      const r1 = parseInt(hex1.substr(0, 2), 16);
      const g1 = parseInt(hex1.substr(2, 2), 16);
      const b1 = parseInt(hex1.substr(4, 2), 16);
      
      const r2 = parseInt(hex2.substr(0, 2), 16);
      const g2 = parseInt(hex2.substr(2, 2), 16);
      const b2 = parseInt(hex2.substr(4, 2), 16);
      
      const r = Math.round(r1 + (r2 - r1) * t);
      const g = Math.round(g1 + (g2 - g1) * t);
      const b = Math.round(b1 + (b2 - b1) * t);
      
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    const interpolateNumber = (num1: number, num2: number): number => {
      return num1 + (num2 - num1) * t;
    };

    return {
      id: `interpolated-${Date.now()}`,
      name: `Interpolated Style`,
      description: `Interpolated between ${style1.name} and ${style2.name}`,
      nodeStyles: {
        default: {
          ...style1.nodeStyles.default,
          radius: interpolateNumber(style1.nodeStyles.default.radius, style2.nodeStyles.default.radius),
          fillColor: interpolateColor(style1.nodeStyles.default.fillColor, style2.nodeStyles.default.fillColor),
          strokeColor: interpolateColor(style1.nodeStyles.default.strokeColor, style2.nodeStyles.default.strokeColor),
          strokeWidth: interpolateNumber(style1.nodeStyles.default.strokeWidth, style2.nodeStyles.default.strokeWidth),
          fontSize: interpolateNumber(style1.nodeStyles.default.fontSize, style2.nodeStyles.default.fontSize),
        },
        highlighted: {
          ...style1.nodeStyles.highlighted,
          radius: interpolateNumber(style1.nodeStyles.highlighted.radius, style2.nodeStyles.highlighted.radius),
          fillColor: interpolateColor(style1.nodeStyles.highlighted.fillColor, style2.nodeStyles.highlighted.fillColor),
          strokeColor: interpolateColor(style1.nodeStyles.highlighted.strokeColor, style2.nodeStyles.highlighted.strokeColor),
          strokeWidth: interpolateNumber(style1.nodeStyles.highlighted.strokeWidth, style2.nodeStyles.highlighted.strokeWidth),
          fontSize: interpolateNumber(style1.nodeStyles.highlighted.fontSize, style2.nodeStyles.highlighted.fontSize),
        },
        visited: {
          ...style1.nodeStyles.visited,
          radius: interpolateNumber(style1.nodeStyles.visited.radius, style2.nodeStyles.visited.radius),
          fillColor: interpolateColor(style1.nodeStyles.visited.fillColor, style2.nodeStyles.visited.fillColor),
          strokeColor: interpolateColor(style1.nodeStyles.visited.strokeColor, style2.nodeStyles.visited.strokeColor),
          strokeWidth: interpolateNumber(style1.nodeStyles.visited.strokeWidth, style2.nodeStyles.visited.strokeWidth),
          fontSize: interpolateNumber(style1.nodeStyles.visited.fontSize, style2.nodeStyles.visited.fontSize),
        },
        current: {
          ...style1.nodeStyles.current,
          radius: interpolateNumber(style1.nodeStyles.current.radius, style2.nodeStyles.current.radius),
          fillColor: interpolateColor(style1.nodeStyles.current.fillColor, style2.nodeStyles.current.fillColor),
          strokeColor: interpolateColor(style1.nodeStyles.current.strokeColor, style2.nodeStyles.current.strokeColor),
          strokeWidth: interpolateNumber(style1.nodeStyles.current.strokeWidth, style2.nodeStyles.current.strokeWidth),
          fontSize: interpolateNumber(style1.nodeStyles.current.fontSize, style2.nodeStyles.current.fontSize),
        },
        selected: {
          ...style1.nodeStyles.selected,
          radius: interpolateNumber(style1.nodeStyles.selected.radius, style2.nodeStyles.selected.radius),
          fillColor: interpolateColor(style1.nodeStyles.selected.fillColor, style2.nodeStyles.selected.fillColor),
          strokeColor: interpolateColor(style1.nodeStyles.selected.strokeColor, style2.nodeStyles.selected.strokeColor),
          strokeWidth: interpolateNumber(style1.nodeStyles.selected.strokeWidth, style2.nodeStyles.selected.strokeWidth),
          fontSize: interpolateNumber(style1.nodeStyles.selected.fontSize, style2.nodeStyles.selected.fontSize),
        }
      },
      edgeStyles: {
        default: {
          ...style1.edgeStyles.default,
          strokeWidth: interpolateNumber(style1.edgeStyles.default.strokeWidth, style2.edgeStyles.default.strokeWidth),
          strokeColor: interpolateColor(style1.edgeStyles.default.strokeColor, style2.edgeStyles.default.strokeColor),
          arrowSize: interpolateNumber(style1.edgeStyles.default.arrowSize, style2.edgeStyles.default.arrowSize),
          labelFontSize: interpolateNumber(style1.edgeStyles.default.labelFontSize, style2.edgeStyles.default.labelFontSize),
        },
        highlighted: {
          ...style1.edgeStyles.highlighted,
          strokeWidth: interpolateNumber(style1.edgeStyles.highlighted.strokeWidth, style2.edgeStyles.highlighted.strokeWidth),
          strokeColor: interpolateColor(style1.edgeStyles.highlighted.strokeColor, style2.edgeStyles.highlighted.strokeColor),
          arrowSize: interpolateNumber(style1.edgeStyles.highlighted.arrowSize, style2.edgeStyles.highlighted.arrowSize),
          labelFontSize: interpolateNumber(style1.edgeStyles.highlighted.labelFontSize, style2.edgeStyles.highlighted.labelFontSize),
        },
        visited: {
          ...style1.edgeStyles.visited,
          strokeWidth: interpolateNumber(style1.edgeStyles.visited.strokeWidth, style2.edgeStyles.visited.strokeWidth),
          strokeColor: interpolateColor(style1.edgeStyles.visited.strokeColor, style2.edgeStyles.visited.strokeColor),
          arrowSize: interpolateNumber(style1.edgeStyles.visited.arrowSize, style2.edgeStyles.visited.arrowSize),
          labelFontSize: interpolateNumber(style1.edgeStyles.visited.labelFontSize, style2.edgeStyles.visited.labelFontSize),
        },
        current: {
          ...style1.edgeStyles.current,
          strokeWidth: interpolateNumber(style1.edgeStyles.current.strokeWidth, style2.edgeStyles.current.strokeWidth),
          strokeColor: interpolateColor(style1.edgeStyles.current.strokeColor, style2.edgeStyles.current.strokeColor),
          arrowSize: interpolateNumber(style1.edgeStyles.current.arrowSize, style2.edgeStyles.current.arrowSize),
          labelFontSize: interpolateNumber(style1.edgeStyles.current.labelFontSize, style2.edgeStyles.current.labelFontSize),
        },
        selected: {
          ...style1.edgeStyles.selected,
          strokeWidth: interpolateNumber(style1.edgeStyles.selected.strokeWidth, style2.edgeStyles.selected.strokeWidth),
          strokeColor: interpolateColor(style1.edgeStyles.selected.strokeColor, style2.edgeStyles.selected.strokeColor),
          arrowSize: interpolateNumber(style1.edgeStyles.selected.arrowSize, style2.edgeStyles.selected.arrowSize),
          labelFontSize: interpolateNumber(style1.edgeStyles.selected.labelFontSize, style2.edgeStyles.selected.labelFontSize),
        }
      },
      canvasStyle: {
        ...style1.canvasStyle,
        backgroundColor: interpolateColor(
          style1.canvasStyle.backgroundColor, 
          style2.canvasStyle.backgroundColor
        ),
      },
      animationStyle: {
        ...style1.animationStyle,
        duration: interpolateNumber(style1.animationStyle.duration, style2.animationStyle.duration),
        highlightDuration: interpolateNumber(style1.animationStyle.highlightDuration, style2.animationStyle.highlightDuration),
      }
    };
  }
};
