import React, { useEffect, useState, useRef } from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';

interface VoiceAnnouncerProps {
  algorithm?: string;
  currentStep?: string;
  stepNumber?: number;
  totalSteps?: number;
  isRunning?: boolean;
  isPaused?: boolean;
  data?: any;
  comparison?: { 
    indices: number[];
    action: 'comparing' | 'swapping' | 'moving' | 'found';
    values?: any[];
  };
}

interface SpeechSynthesisOptions {
  enabled: boolean;
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
  volume: number;
}

export const VoiceAnnouncer: React.FC<VoiceAnnouncerProps> = ({
  algorithm = '',
  currentStep = '',
  stepNumber = 0,
  totalSteps = 0,
  isRunning = false,
  isPaused = false,
  data,
  comparison
}) => {
  const { announce } = useAccessibility();
  const [speechOptions, setSpeechOptions] = useState<SpeechSynthesisOptions>({
    enabled: false,
    voice: null,
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8
  });
  
  const [isAvailable, setIsAvailable] = useState(false);
  const previousStepRef = useRef<string>('');
  const speechQueue = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);

  // Check for speech synthesis support
  useEffect(() => {
    const checkSpeechSupport = () => {
      if ('speechSynthesis' in window) {
        setIsAvailable(true);
        
        // Load voices
        const loadVoices = () => {
          const voices = speechSynthesis.getVoices();
          const englishVoice = voices.find(voice => 
            voice.lang.startsWith('en') && !voice.name.includes('Google')
          ) || voices[0];
          
          setSpeechOptions(prev => ({
            ...prev,
            voice: englishVoice || null
          }));
        };

        loadVoices();
        speechSynthesis.addEventListener('voiceschanged', loadVoices);
        
        return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
    };

    checkSpeechSupport();
  }, []);

  // Speech synthesis function
  const speak = (text: string, priority: 'low' | 'high' = 'low') => {
    if (!speechOptions.enabled || !isAvailable) {
      // Fallback to screen reader announcements
      announce(text, priority === 'high' ? 'assertive' : 'polite');
      return;
    }

    if (priority === 'high') {
      // Cancel current speech and clear queue for high priority
      speechSynthesis.cancel();
      speechQueue.current = [];
      isSpeakingRef.current = false;
    }

    speechQueue.current.push(text);
    processQueue();
  };

  const processQueue = () => {
    if (isSpeakingRef.current || speechQueue.current.length === 0) {
      return;
    }

    const text = speechQueue.current.shift()!;
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (speechOptions.voice) {
      utterance.voice = speechOptions.voice;
    }
    
    utterance.rate = speechOptions.rate;
    utterance.pitch = speechOptions.pitch;
    utterance.volume = speechOptions.volume;
    
    utterance.onstart = () => {
      isSpeakingRef.current = true;
    };
    
    utterance.onend = () => {
      isSpeakingRef.current = false;
      setTimeout(processQueue, 100); // Small delay between utterances
    };
    
    utterance.onerror = () => {
      isSpeakingRef.current = false;
      processQueue();
    };

    speechSynthesis.speak(utterance);
  };

  // Algorithm state announcements
  useEffect(() => {
    if (isRunning && !isPaused && algorithm) {
      speak(`${algorithm} algorithm started`, 'high');
    } else if (isPaused) {
      speak('Algorithm paused', 'high');
    } else if (!isRunning && previousStepRef.current) {
      speak(`${algorithm} algorithm completed`, 'high');
    }
  }, [isRunning, isPaused, algorithm]);

  // Step announcements
  useEffect(() => {
    if (currentStep && currentStep !== previousStepRef.current) {
      const stepAnnouncement = totalSteps > 0 
        ? `Step ${stepNumber} of ${totalSteps}: ${currentStep}`
        : `Step ${stepNumber}: ${currentStep}`;
      
      speak(stepAnnouncement);
      previousStepRef.current = currentStep;
    }
  }, [currentStep, stepNumber, totalSteps]);

  // Comparison announcements
  useEffect(() => {
    if (comparison && speechOptions.enabled) {
      const { indices, action, values } = comparison;
      
      let announcement = '';
      
      switch (action) {
        case 'comparing':
          if (values && values.length >= 2) {
            announcement = `Comparing values ${values[0]} and ${values[1]} at positions ${indices[0]} and ${indices[1]}`;
          } else {
            announcement = `Comparing elements at positions ${indices.join(' and ')}`;
          }
          break;
          
        case 'swapping':
          if (values && values.length >= 2) {
            announcement = `Swapping ${values[0]} and ${values[1]}`;
          } else {
            announcement = `Swapping elements at positions ${indices.join(' and ')}`;
          }
          break;
          
        case 'moving':
          if (values && values.length >= 1) {
            announcement = `Moving ${values[0]} to position ${indices[0]}`;
          } else {
            announcement = `Moving element to position ${indices[0]}`;
          }
          break;
          
        case 'found':
          if (values && values.length >= 1) {
            announcement = `Found target value ${values[0]} at position ${indices[0]}`;
          } else {
            announcement = `Found target at position ${indices[0]}`;
          }
          break;
      }
      
      if (announcement) {
        speak(announcement);
      }
    }
  }, [comparison, speechOptions.enabled]);

  // Settings UI
  const toggleVoiceAnnouncements = () => {
    setSpeechOptions(prev => ({ ...prev, enabled: !prev.enabled }));
    if (!speechOptions.enabled) {
      speak('Voice announcements enabled');
    } else {
      announce('Voice announcements disabled');
    }
  };

  const handleRateChange = (rate: number) => {
    setSpeechOptions(prev => ({ ...prev, rate }));
    speak(`Speech rate set to ${rate}`, 'low');
  };

  const handleVolumeChange = (volume: number) => {
    setSpeechOptions(prev => ({ ...prev, volume }));
    speak(`Volume set to ${Math.round(volume * 100)}%`, 'low');
  };

  if (!isAvailable) {
    return null; // Speech synthesis not supported
  }

  return (
    <div role="region" aria-label="Voice announcement settings">
      {/* Settings Panel - can be toggled on/off */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        left: '10px', 
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              checked={speechOptions.enabled}
              onChange={toggleVoiceAnnouncements}
              aria-label="Enable voice announcements"
            />
            Voice Announcements
          </label>
        </div>
        
        {speechOptions.enabled && (
          <>
            <div style={{ marginBottom: '8px' }}>
              <label htmlFor="speech-rate" style={{ display: 'block', marginBottom: '2px' }}>
                Speed: {speechOptions.rate}x
              </label>
              <input
                id="speech-rate"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechOptions.rate}
                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                style={{ width: '100%' }}
                aria-label="Adjust speech rate"
              />
            </div>
            
            <div>
              <label htmlFor="speech-volume" style={{ display: 'block', marginBottom: '2px' }}>
                Volume: {Math.round(speechOptions.volume * 100)}%
              </label>
              <input
                id="speech-volume"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={speechOptions.volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                style={{ width: '100%' }}
                aria-label="Adjust speech volume"
              />
            </div>
          </>
        )}
      </div>
      
      {/* Hidden live region for fallback screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
        aria-label="Algorithm step announcements"
      />
    </div>
  );
};

// Hook for easy integration with algorithm components
export const useVoiceAnnouncer = () => {
  const [announcer, setAnnouncer] = useState<{
    announce: (text: string, priority?: 'low' | 'high') => void;
  } | null>(null);

  const announceStep = (step: string, priority: 'low' | 'high' = 'low') => {
    if (announcer) {
      announcer.announce(step, priority);
    }
  };

  const announceComparison = (
    indices: number[], 
    action: 'comparing' | 'swapping' | 'moving' | 'found',
    values?: any[]
  ) => {
    const comparison = { indices, action, values };
    // This would be handled by the VoiceAnnouncer component
    console.log('Comparison:', comparison);
  };

  return {
    announceStep,
    announceComparison,
    setAnnouncer
  };
};

export default VoiceAnnouncer;
