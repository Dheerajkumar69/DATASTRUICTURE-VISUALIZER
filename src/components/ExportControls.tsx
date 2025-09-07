import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '../themes/ThemeContext';
import { VisualizationExporter, ExportConfig, exportUtils } from '../utils/exportUtils';

export interface ExportControlsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onExportStart?: () => void;
  onExportComplete?: (filename: string, fileSize: number) => void;
  onExportError?: (error: string) => void;
  className?: string;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  canvasRef,
  onExportStart,
  onExportComplete,
  onExportError,
  className = ''
}) => {
  const theme = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [recordingStats, setRecordingStats] = useState({ frameCount: 0, isRecording: false });
  const exporterRef = useRef<VisualizationExporter | null>(null);
  const [exportConfig, setExportConfig] = useState<Partial<ExportConfig>>({
    format: 'gif',
    quality: 0.8,
    fps: 10,
    backgroundColor: '#ffffff'
  });

  // Initialize exporter when canvas is available
  React.useEffect(() => {
    if (canvasRef.current && !exporterRef.current) {
      exporterRef.current = new VisualizationExporter(canvasRef.current);
    }
  }, [canvasRef]);

  // Update recording stats periodically
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording && exporterRef.current) {
      interval = setInterval(() => {
        const stats = exporterRef.current!.getRecordingStatus();
        setRecordingStats(stats);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const handleStartGifRecording = useCallback(() => {
    if (!exporterRef.current) return;
    
    try {
      exporterRef.current.startFrameCapture();
      setIsRecording(true);
      onExportStart?.();
    } catch (error) {
      onExportError?.(`Failed to start GIF recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [onExportStart, onExportError]);

  const handleStopGifRecording = useCallback(async () => {
    if (!exporterRef.current) return;
    
    try {
      setIsExporting(true);
      exporterRef.current.stopFrameCapture();
      setIsRecording(false);
      
      const blob = await exporterRef.current.exportAsGIF(exportConfig);
      const filename = exportUtils.createFilename('visualization', 'gif');
      
      exporterRef.current.downloadBlob(blob, filename);
      onExportComplete?.(filename, blob.size);
    } catch (error) {
      onExportError?.(`Failed to export GIF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  }, [exportConfig, onExportComplete, onExportError]);

  const handleStartVideoRecording = useCallback(async () => {
    if (!exporterRef.current) return;
    
    try {
      await exporterRef.current.startVideoRecording({
        ...exportConfig,
        format: exportConfig.format === 'mp4' ? 'mp4' : 'webm'
      });
      setIsRecording(true);
      onExportStart?.();
    } catch (error) {
      onExportError?.(`Failed to start video recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [exportConfig, onExportStart, onExportError]);

  const handleStopVideoRecording = useCallback(async () => {
    if (!exporterRef.current) return;
    
    try {
      setIsExporting(true);
      const blob = await exporterRef.current.stopVideoRecording();
      setIsRecording(false);
      
      const extension = exportConfig.format === 'mp4' ? 'mp4' : 'webm';
      const filename = exportUtils.createFilename('visualization', extension);
      
      exporterRef.current.downloadBlob(blob, filename);
      onExportComplete?.(filename, blob.size);
    } catch (error) {
      onExportError?.(`Failed to export video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  }, [exportConfig, onExportComplete, onExportError]);

  const handleExportImage = useCallback(async () => {
    if (!exporterRef.current) return;
    
    try {
      setIsExporting(true);
      const blob = await exporterRef.current.exportAsImage({
        ...exportConfig,
        format: exportConfig.format as 'png' | 'svg' || 'png'
      });
      
      const extension = exportConfig.format === 'svg' ? 'svg' : 'png';
      const filename = exportUtils.createFilename('visualization', extension);
      
      exporterRef.current.downloadBlob(blob, filename);
      onExportComplete?.(filename, blob.size);
    } catch (error) {
      onExportError?.(`Failed to export image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  }, [exportConfig, onExportComplete, onExportError]);

  const handleCaptureFrame = useCallback(() => {
    if (!exporterRef.current || !isRecording) return;
    exporterRef.current.captureFrame();
  }, [isRecording]);

  const browserSupport = React.useMemo(() => exportUtils.checkBrowserSupport(), []);

  const updateConfig = useCallback((key: keyof ExportConfig, value: any) => {
    setExportConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const configErrors = React.useMemo(() => {
    return exportUtils.validateConfig(exportConfig);
  }, [exportConfig]);

  return (
    <div
      className={`export-controls rounded-lg shadow-md p-4 ${className}`}
      style={{ backgroundColor: theme.colors.card, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3" style={{ color: theme.colors.text }}>Export Visualization</h3>
        
        {/* Export Configuration */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
              Format
            </label>
            <select
              value={exportConfig.format}
              onChange={(e) => updateConfig('format', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none"
              style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card, color: theme.colors.text }}
            >
              {browserSupport.gif && <option value="gif">GIF</option>}
              {browserSupport.webm && <option value="webm">WebM Video</option>}
              {browserSupport.mp4 && <option value="mp4">MP4 Video</option>}
              <option value="png">PNG Image</option>
              <option value="svg">SVG Image</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
              Quality
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={exportConfig.quality}
              onChange={(e) => updateConfig('quality', parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs" style={{ color: theme.colors.textLight }}>
              {Math.round((exportConfig.quality || 0.8) * 100)}%
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
              FPS
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={exportConfig.fps}
              onChange={(e) => updateConfig('fps', parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none"
              style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card, color: theme.colors.text }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
              Background
            </label>
            <input
              type="color"
              value={exportConfig.backgroundColor}
              onChange={(e) => updateConfig('backgroundColor', e.target.value)}
              className="w-full h-10 border rounded-md focus:outline-none"
              style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card, color: theme.colors.text }}
            />
          </div>
        </div>

        {/* Configuration Errors */}
        {configErrors.length > 0 && (
          <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: theme.colors.hover, border: `1px solid ${theme.colors.border}` }}>
            <h4 className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>Configuration Issues:</h4>
            <ul className="text-xs" style={{ color: theme.colors.textLight }}>
              {configErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recording Status */}
      {(isRecording || recordingStats.frameCount > 0) && (
        <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: theme.colors.hover, border: `1px solid ${theme.colors.border}` }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: theme.colors.text }}>
              {isRecording ? (
                <>
                  <span className="animate-pulse inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: theme.colors.danger || '#ef4444' }}></span>
                  Recording...
                </>
              ) : (
                'Recording Stopped'
              )}
            </span>
            <span className="text-xs" style={{ color: theme.colors.textLight }}>
              {recordingStats.frameCount} frames
            </span>
          </div>
          {isRecording && (
            <button
              onClick={handleCaptureFrame}
              className="mt-2 text-xs px-2 py-1 rounded"
              style={{ backgroundColor: theme.colors.hover, color: theme.colors.text }}
            >
              Capture Frame
            </button>
          )}
        </div>
      )}

      {/* Export Buttons */}
      <div className="space-y-2">
        {/* GIF Export */}
        {browserSupport.gif && exportConfig.format === 'gif' && (
          <div className="flex gap-2">
            {!isRecording ? (
              <button
                onClick={handleStartGifRecording}
                disabled={isExporting || configErrors.length > 0}
                className="flex-1 px-4 py-2 rounded-md transition-colors font-medium"
                style={{ backgroundColor: theme.colors.success || '#22c55e', color: theme.colors.card, opacity: (isExporting || configErrors.length > 0) ? 0.6 : 1 }}
              >
                {isExporting ? 'Starting...' : 'Start GIF Recording'}
              </button>
            ) : (
              <button
                onClick={handleStopGifRecording}
                disabled={isExporting}
                className="flex-1 px-4 py-2 rounded-md transition-colors font-medium"
                style={{ backgroundColor: theme.colors.danger || '#ef4444', color: theme.colors.card, opacity: isExporting ? 0.6 : 1 }}
              >
                {isExporting ? 'Processing...' : 'Stop & Export GIF'}
              </button>
            )}
          </div>
        )}

        {/* Video Export */}
        {browserSupport.mediaRecorder && (exportConfig.format === 'webm' || exportConfig.format === 'mp4') && (
          <div className="flex gap-2">
            {!isRecording ? (
              <button
                onClick={handleStartVideoRecording}
                disabled={isExporting || configErrors.length > 0}
                className="flex-1 px-4 py-2 rounded-md transition-colors font-medium"
                style={{ backgroundColor: theme.colors.accent || '#8b5cf6', color: theme.colors.card, opacity: (isExporting || configErrors.length > 0) ? 0.6 : 1 }}
              >
                {isExporting ? 'Starting...' : `Start ${exportConfig.format?.toUpperCase()} Recording`}
              </button>
            ) : (
              <button
                onClick={handleStopVideoRecording}
                disabled={isExporting}
                className="flex-1 px-4 py-2 rounded-md transition-colors font-medium"
                style={{ backgroundColor: theme.colors.danger || '#ef4444', color: theme.colors.card, opacity: isExporting ? 0.6 : 1 }}
              >
                {isExporting ? 'Processing...' : `Stop & Export ${exportConfig.format?.toUpperCase()}`}
              </button>
            )}
          </div>
        )}

        {/* Image Export */}
        {(exportConfig.format === 'png' || exportConfig.format === 'svg') && (
          <button
            onClick={handleExportImage}
            disabled={isExporting || configErrors.length > 0}
            className="w-full px-4 py-2 rounded-md transition-colors font-medium"
            style={{ backgroundColor: theme.colors.primary, color: theme.colors.card, opacity: (isExporting || configErrors.length > 0) ? 0.6 : 1 }}
          >
            {isExporting ? 'Exporting...' : `Export ${exportConfig.format?.toUpperCase()} Image`}
          </button>
        )}

        {/* Clear Frames */}
        {recordingStats.frameCount > 0 && !isRecording && (
          <button
            onClick={() => {
              exporterRef.current?.clearFrames();
              setRecordingStats({ frameCount: 0, isRecording: false });
            }}
            className="w-full px-4 py-2 rounded-md transition-colors"
            style={{ backgroundColor: theme.colors.gray500 || theme.colors.hover, color: theme.colors.card }}
          >
            Clear Frames
          </button>
        )}
      </div>

      {/* Browser Support Warning */}
      {(!browserSupport.mediaRecorder && !browserSupport.gif) && (
        <div className="mt-4 p-3 rounded-md" style={{ backgroundColor: theme.colors.hover, border: `1px solid ${theme.colors.border}` }}>
          <p className="text-sm" style={{ color: theme.colors.text }}>
            ⚠️ Limited export support detected. Only static image export is available in your browser.
          </p>
        </div>
      )}
    </div>
  );
};
