// Export configuration interface
export interface ExportConfig {
  format: 'gif' | 'mp4' | 'webm' | 'png' | 'svg';
  quality: number; // 0-1 for video, ignored for GIF
  fps: number; // frames per second
  duration?: number; // in seconds, for looped animations
  width?: number;
  height?: number;
  backgroundColor?: string;
}

// GIF.js library interface (to be imported)
declare global {
  interface Window {
    GIF: any;
  }
}

/**
 * Canvas recorder for creating animated GIFs and videos
 */
export class VisualizationExporter {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private frames: ImageData[] = [];
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
  }

  /**
   * Start recording frames for GIF export
   */
  startFrameCapture(): void {
    this.frames = [];
    this.isRecording = true;
  }

  /**
   * Capture current frame for GIF
   */
  captureFrame(): void {
    if (!this.isRecording) return;
    
    const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.frames.push(imageData);
  }

  /**
   * Stop recording frames
   */
  stopFrameCapture(): void {
    this.isRecording = false;
  }

  /**
   * Export captured frames as GIF
   */
  async exportAsGIF(config: Partial<ExportConfig> = {}): Promise<Blob> {
    const defaultConfig: ExportConfig = {
      format: 'gif',
      quality: 0.8,
      fps: 10,
      width: this.canvas.width,
      height: this.canvas.height,
      backgroundColor: '#ffffff'
    };

    const finalConfig = { ...defaultConfig, ...config };

    return new Promise((resolve, reject) => {
      try {
        // Load GIF.js library dynamically if not already loaded
        if (!window.GIF) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js';
          script.onload = () => this.createGIF(finalConfig, resolve, reject);
          script.onerror = () => reject(new Error('Failed to load GIF.js library'));
          document.head.appendChild(script);
        } else {
          this.createGIF(finalConfig, resolve, reject);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private createGIF(config: ExportConfig, resolve: (blob: Blob) => void, reject: (error: Error) => void): void {
    try {
      const gif = new window.GIF({
        workers: 2,
        quality: 10,
        width: config.width!,
        height: config.height!,
        workerScript: 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js'
      });

      // Add frames to GIF
      const delay = 1000 / config.fps;
      this.frames.forEach((frame, index) => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = config.width!;
        tempCanvas.height = config.height!;
        const tempContext = tempCanvas.getContext('2d')!;
        tempContext.putImageData(frame, 0, 0);
        
        gif.addFrame(tempCanvas, { delay });
      });

      gif.on('finished', (blob: Blob) => {
        resolve(blob);
      });

      gif.on('error', (error: Error) => {
        reject(error);
      });

      gif.render();
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Unknown error creating GIF'));
    }
  }

  /**
   * Start video recording using MediaRecorder API
   */
  async startVideoRecording(config: Partial<ExportConfig> = {}): Promise<void> {
    const defaultConfig: ExportConfig = {
      format: 'webm',
      quality: 0.8,
      fps: 30,
      width: this.canvas.width,
      height: this.canvas.height,
    };

    const finalConfig = { ...defaultConfig, ...config };

    try {
      // Check if MediaRecorder is supported
      if (!MediaRecorder.isTypeSupported(`video/${finalConfig.format};codecs=vp9`)) {
        throw new Error(`Video format ${finalConfig.format} is not supported`);
      }

      const stream = this.canvas.captureStream(finalConfig.fps);
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: `video/${finalConfig.format};codecs=vp9`,
        videoBitsPerSecond: finalConfig.quality * 2500000 // Adjust bitrate based on quality
      });

      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      this.isRecording = true;

    } catch (error) {
      throw new Error(`Failed to start video recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Stop video recording and return the video blob
   */
  async stopVideoRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording found'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, {
          type: this.mediaRecorder!.mimeType
        });
        this.isRecording = false;
        resolve(blob);
      };

      this.mediaRecorder.onerror = (event) => {
        reject(new Error('Recording failed'));
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Export current canvas as static image
   */
  exportAsImage(config: Partial<ExportConfig> = {}): Promise<Blob> {
    const defaultConfig: ExportConfig = {
      format: 'png',
      quality: 0.92,
      fps: 0, // Not used for static images
      width: this.canvas.width,
      height: this.canvas.height,
    };

    const finalConfig = { ...defaultConfig, ...config };

    return new Promise((resolve) => {
      if (finalConfig.format === 'svg') {
        // For SVG export, we need to recreate the drawing commands
        const svgContent = this.generateSVG(finalConfig);
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        resolve(blob);
      } else {
        this.canvas.toBlob((blob) => {
          resolve(blob!);
        }, `image/${finalConfig.format}`, finalConfig.quality);
      }
    });
  }

  private generateSVG(config: ExportConfig): string {
    // Basic SVG generation - would need to be expanded based on actual drawing needs
    return `<?xml version="1.0" encoding="UTF-8"?>
      <svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${config.backgroundColor || '#ffffff'}"/>
        <!-- Canvas content would be converted to SVG elements here -->
      </svg>`;
  }

  /**
   * Download a blob as a file
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * Get recording status
   */
  getRecordingStatus(): { isRecording: boolean; frameCount: number } {
    return {
      isRecording: this.isRecording,
      frameCount: this.frames.length
    };
  }

  /**
   * Clear captured frames
   */
  clearFrames(): void {
    this.frames = [];
  }
}

/**
 * Utility functions for common export operations
 */
export const exportUtils = {
  /**
   * Create a filename with timestamp
   */
  createFilename(prefix: string, extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    return `${prefix}-${timestamp}.${extension}`;
  },

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Validate export configuration
   */
  validateConfig(config: Partial<ExportConfig>): string[] {
    const errors: string[] = [];
    
    if (config.quality && (config.quality < 0 || config.quality > 1)) {
      errors.push('Quality must be between 0 and 1');
    }
    
    if (config.fps && config.fps <= 0) {
      errors.push('FPS must be greater than 0');
    }
    
    if (config.width && config.width <= 0) {
      errors.push('Width must be greater than 0');
    }
    
    if (config.height && config.height <= 0) {
      errors.push('Height must be greater than 0');
    }
    
    return errors;
  },

  /**
   * Check browser support for different export formats
   */
  checkBrowserSupport(): {
    gif: boolean;
    mp4: boolean;
    webm: boolean;
    mediaRecorder: boolean;
  } {
    return {
      gif: typeof window !== 'undefined',
      mp4: typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('video/mp4'),
      webm: typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('video/webm'),
      mediaRecorder: typeof MediaRecorder !== 'undefined'
    };
  }
};
