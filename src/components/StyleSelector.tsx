import React, { useState, useCallback } from 'react';
import { VisualizationStyle, visualizationStyles, styleUtils } from '../styles/visualizationStyles';

export interface StyleSelectorProps {
  currentStyle: VisualizationStyle;
  onStyleChange: (style: VisualizationStyle) => void;
  allowCustomization?: boolean;
  className?: string;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  currentStyle,
  onStyleChange,
  allowCustomization = true,
  className = ''
}) => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customStyle, setCustomStyle] = useState<VisualizationStyle>(currentStyle);

  // Handle style selection from presets
  const handlePresetChange = useCallback((styleId: string) => {
    const style = styleUtils.getStyleById(styleId);
    if (style) {
      onStyleChange(style);
      setCustomStyle(style);
    }
  }, [onStyleChange]);

  // Handle custom style updates
  const handleCustomStyleUpdate = useCallback((updates: Partial<VisualizationStyle>) => {
    const updatedStyle = {
      ...customStyle,
      ...updates,
      id: `custom-${Date.now()}`,
      name: 'Custom Style'
    };
    setCustomStyle(updatedStyle);
    onStyleChange(updatedStyle);
  }, [customStyle, onStyleChange]);

  // Apply custom style
  const applyCustomStyle = useCallback(() => {
    onStyleChange(customStyle);
    setShowCustomizer(false);
  }, [customStyle, onStyleChange]);

  // Reset to original style
  const resetStyle = useCallback(() => {
    const originalStyle = styleUtils.getStyleById(currentStyle.id) || visualizationStyles[0];
    setCustomStyle(originalStyle);
    onStyleChange(originalStyle);
  }, [currentStyle.id, onStyleChange]);

  return (
    <div className={`style-selector bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Visualization Style</h3>
      
      {/* Style Presets */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preset Styles
        </label>
        <div className="grid grid-cols-2 gap-2">
          {visualizationStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handlePresetChange(style.id)}
              className={`p-3 border-2 rounded-md transition-colors text-left ${
                currentStyle.id === style.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm">{style.name}</div>
              <div className="text-xs text-gray-600 mt-1">{style.description}</div>
              
              {/* Style Preview */}
              <div className="flex items-center mt-2 space-x-1">
                {/* Node preview */}
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{
                    backgroundColor: style.nodeStyles.default.fillColor,
                    borderColor: style.nodeStyles.default.strokeColor,
                  }}
                />
                {/* Edge preview */}
                <div
                  className="w-6 h-0.5"
                  style={{ backgroundColor: style.edgeStyles.default.strokeColor }}
                />
                {/* Highlighted node preview */}
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{
                    backgroundColor: style.nodeStyles.highlighted.fillColor,
                    borderColor: style.nodeStyles.highlighted.strokeColor,
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Customization Toggle */}
      {allowCustomization && (
        <div className="mb-4">
          <button
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors font-medium"
          >
            {showCustomizer ? 'Hide Customization' : 'Customize Style'}
          </button>
        </div>
      )}

      {/* Style Customizer */}
      {showCustomizer && allowCustomization && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-800 mb-3">Custom Style Settings</h4>
          
          {/* Node Customization */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Node Appearance</h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Radius</label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={customStyle.nodeStyles.default.radius}
                  onChange={(e) => handleCustomStyleUpdate({
                    nodeStyles: {
                      ...customStyle.nodeStyles,
                      default: {
                        ...customStyle.nodeStyles.default,
                        radius: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">
                  {customStyle.nodeStyles.default.radius}px
                </span>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Fill Color</label>
                <input
                  type="color"
                  value={customStyle.nodeStyles.default.fillColor}
                  onChange={(e) => handleCustomStyleUpdate({
                    nodeStyles: {
                      ...customStyle.nodeStyles,
                      default: {
                        ...customStyle.nodeStyles.default,
                        fillColor: e.target.value
                      }
                    }
                  })}
                  className="w-full h-8 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Stroke Width</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={customStyle.nodeStyles.default.strokeWidth}
                  onChange={(e) => handleCustomStyleUpdate({
                    nodeStyles: {
                      ...customStyle.nodeStyles,
                      default: {
                        ...customStyle.nodeStyles.default,
                        strokeWidth: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">
                  {customStyle.nodeStyles.default.strokeWidth}px
                </span>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Stroke Color</label>
                <input
                  type="color"
                  value={customStyle.nodeStyles.default.strokeColor}
                  onChange={(e) => handleCustomStyleUpdate({
                    nodeStyles: {
                      ...customStyle.nodeStyles,
                      default: {
                        ...customStyle.nodeStyles.default,
                        strokeColor: e.target.value
                      }
                    }
                  })}
                  className="w-full h-8 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Edge Customization */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Edge Appearance</h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Width</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={customStyle.edgeStyles.default.strokeWidth}
                  onChange={(e) => handleCustomStyleUpdate({
                    edgeStyles: {
                      ...customStyle.edgeStyles,
                      default: {
                        ...customStyle.edgeStyles.default,
                        strokeWidth: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">
                  {customStyle.edgeStyles.default.strokeWidth}px
                </span>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Color</label>
                <input
                  type="color"
                  value={customStyle.edgeStyles.default.strokeColor}
                  onChange={(e) => handleCustomStyleUpdate({
                    edgeStyles: {
                      ...customStyle.edgeStyles,
                      default: {
                        ...customStyle.edgeStyles.default,
                        strokeColor: e.target.value
                      }
                    }
                  })}
                  className="w-full h-8 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Arrow Size</label>
                <input
                  type="range"
                  min="4"
                  max="20"
                  value={customStyle.edgeStyles.default.arrowSize}
                  onChange={(e) => handleCustomStyleUpdate({
                    edgeStyles: {
                      ...customStyle.edgeStyles,
                      default: {
                        ...customStyle.edgeStyles.default,
                        arrowSize: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">
                  {customStyle.edgeStyles.default.arrowSize}px
                </span>
              </div>
            </div>
          </div>

          {/* Canvas Customization */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Canvas Settings</h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Background</label>
                <input
                  type="color"
                  value={customStyle.canvasStyle.backgroundColor}
                  onChange={(e) => handleCustomStyleUpdate({
                    canvasStyle: {
                      ...customStyle.canvasStyle,
                      backgroundColor: e.target.value
                    }
                  })}
                  className="w-full h-8 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="flex items-center text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={customStyle.canvasStyle.showGrid || false}
                    onChange={(e) => handleCustomStyleUpdate({
                      canvasStyle: {
                        ...customStyle.canvasStyle,
                        showGrid: e.target.checked
                      }
                    })}
                    className="mr-2"
                  />
                  Show Grid
                </label>
              </div>
            </div>
          </div>

          {/* Animation Settings */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Animation Settings</h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Duration (ms)</label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={customStyle.animationStyle.duration}
                  onChange={(e) => handleCustomStyleUpdate({
                    animationStyle: {
                      ...customStyle.animationStyle,
                      duration: parseInt(e.target.value)
                    }
                  })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">
                  {customStyle.animationStyle.duration}ms
                </span>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Easing</label>
                <select
                  value={customStyle.animationStyle.easing}
                  onChange={(e) => handleCustomStyleUpdate({
                    animationStyle: {
                      ...customStyle.animationStyle,
                      easing: e.target.value as any
                    }
                  })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                >
                  <option value="linear">Linear</option>
                  <option value="easeIn">Ease In</option>
                  <option value="easeOut">Ease Out</option>
                  <option value="easeInOut">Ease In Out</option>
                  <option value="bounce">Bounce</option>
                  <option value="elastic">Elastic</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={customStyle.animationStyle.pulseEffect}
                    onChange={(e) => handleCustomStyleUpdate({
                      animationStyle: {
                        ...customStyle.animationStyle,
                        pulseEffect: e.target.checked
                      }
                    })}
                    className="mr-2"
                  />
                  Pulse Effect
                </label>
              </div>

              <div>
                <label className="flex items-center text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={customStyle.animationStyle.trailEffect}
                    onChange={(e) => handleCustomStyleUpdate({
                      animationStyle: {
                        ...customStyle.animationStyle,
                        trailEffect: e.target.checked
                      }
                    })}
                    className="mr-2"
                  />
                  Trail Effect
                </label>
              </div>
            </div>
          </div>

          {/* Custom Style Actions */}
          <div className="flex gap-2">
            <button
              onClick={applyCustomStyle}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              Apply Style
            </button>
            <button
              onClick={resetStyle}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Current Style Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <div className="text-sm font-medium text-gray-800">{currentStyle.name}</div>
        <div className="text-xs text-gray-600 mt-1">{currentStyle.description}</div>
        <div className="flex items-center mt-2 space-x-2">
          <span className="text-xs text-gray-500">Preview:</span>
          <div className="flex items-center space-x-1">
            <div
              className="w-3 h-3 rounded-full border"
              style={{
                backgroundColor: currentStyle.nodeStyles.default.fillColor,
                borderColor: currentStyle.nodeStyles.default.strokeColor,
                borderWidth: '1px'
              }}
            />
            <div
              className="w-4 h-0.5"
              style={{ backgroundColor: currentStyle.edgeStyles.default.strokeColor }}
            />
            <div
              className="w-3 h-3 rounded-full border"
              style={{
                backgroundColor: currentStyle.nodeStyles.visited.fillColor,
                borderColor: currentStyle.nodeStyles.visited.strokeColor,
                borderWidth: '1px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
