import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationContext } from '../utils/AnimationContext';
import VisualizationControls from '../common/VisualizationControls';
import LoadingSpinner from '../common/LoadingSpinner';
import FullscreenWrapper, { useFullscreen } from '../common/FullscreenWrapper';
import BookmarkManager from '../common/BookmarkManager';
import ShareButton, { useShareContent } from '../common/ShareButton';
import Tooltip, { HelpTooltip, KeyboardShortcutTooltip } from '../common/Tooltip';
import ErrorBoundary from '../common/ErrorBoundary';

interface EnhancedAlgorithmPageProps {
  algorithmName: string;
  algorithmComponent: React.ComponentType<any>;
  defaultConfiguration?: any;
  children?: React.ReactNode;
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PageActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const VisualizationSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AlgorithmContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.card};
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  min-height: 400px;
  position: relative;
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.background}cc;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 300px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-width: 100%;
  }
`;

const MainContent = styled.div`
  display: flex;
  gap: 2rem;
  flex: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
  }
`;

const HelpIcon = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
  cursor: help;
`;

const EnhancedAlgorithmPage: React.FC<EnhancedAlgorithmPageProps> = ({
  algorithmName,
  algorithmComponent: AlgorithmComponent,
  defaultConfiguration = {},
  children
}) => {
  const { 
    speed, 
    setSpeed, 
    isLoading, 
    setIsLoading, 
    loadingMessage, 
    setLoadingMessage,
    progress,
    setProgress
  } = useAnimationContext();

  const [isPlaying, setIsPlaying] = useState(false);
  const [configuration, setConfiguration] = useState(defaultConfiguration);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
  
  // Generate share content
  const shareContent = useShareContent(algorithmName, configuration);

  // Simulate algorithm processing with loading states
  const handlePlay = async () => {
    setIsLoading(true);
    setLoadingMessage(`Initializing ${algorithmName}...`);
    setProgress(0);

    // Simulate initialization
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setLoadingMessage(`Running ${algorithmName}...`);
    setIsLoading(false);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = async () => {
    setIsPlaying(false);
    setIsLoading(true);
    setLoadingMessage('Resetting visualization...');
    
    // Simulate reset time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsLoading(false);
    setConfiguration(defaultConfiguration);
  };

  const handleNext = () => {
    // Implement step-forward logic
    console.log('Next step');
  };

  const handlePrevious = () => {
    // Implement step-backward logic
    console.log('Previous step');
  };

  const handleBookmarkLoad = (bookmarkConfiguration: any) => {
    setConfiguration(bookmarkConfiguration);
    console.log('Loaded bookmark:', bookmarkConfiguration);
  };

  // Show loading overlay when processing
  const showLoadingOverlay = isLoading && loadingMessage;

  return (
    <FullscreenWrapper
      isFullscreen={isFullscreen}
      onFullscreenChange={toggleFullscreen}
    >
      <PageContainer>
        <PageHeader>
          <PageTitle>
            🔬 {algorithmName}
            <HelpTooltip text={`Interactive visualization of ${algorithmName} algorithm. Use the controls below to play, pause, and adjust the speed of the animation.`}>
              <HelpIcon>?</HelpIcon>
            </HelpTooltip>
          </PageTitle>
          
          <PageActions>
            <KeyboardShortcutTooltip shortcut="F" description="Toggle fullscreen mode">
              <ShareButton {...shareContent} />
            </KeyboardShortcutTooltip>
          </PageActions>
        </PageHeader>

        <VisualizationControls
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
          onNext={handleNext}
          onPrevious={handlePrevious}
          speed={speed}
          onSpeedChange={setSpeed}
          onFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          showSpeedControl={true}
          showStepControls={true}
          showFullscreenControl={true}
        />

        <MainContent>
          <VisualizationSection>
            <ErrorBoundary>
              <AlgorithmContainer
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AlgorithmComponent
                  isPlaying={isPlaying}
                  speed={speed}
                  configuration={configuration}
                  onConfigurationChange={setConfiguration}
                />

                <AnimatePresence>
                  {showLoadingOverlay && (
                    <LoadingOverlay
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <LoadingSpinner
                        size="lg"
                        type="spinner"
                        message={loadingMessage}
                        progress={progress}
                      />
                    </LoadingOverlay>
                  )}
                </AnimatePresence>
              </AlgorithmContainer>
            </ErrorBoundary>

            {children && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {children}
              </motion.div>
            )}
          </VisualizationSection>

          <SidePanel>
            <ErrorBoundary>
              <BookmarkManager
                currentConfiguration={configuration}
                algorithmName={algorithmName}
                onLoadBookmark={handleBookmarkLoad}
              />
            </ErrorBoundary>
            
            {/* Additional side panel content can go here */}
          </SidePanel>
        </MainContent>
      </PageContainer>
    </FullscreenWrapper>
  );
};

export default EnhancedAlgorithmPage;

// Example usage component
export const ExampleAlgorithmComponent: React.FC<{
  isPlaying: boolean;
  speed: number;
  configuration: any;
  onConfigurationChange: (config: any) => void;
}> = ({ isPlaying, speed, configuration, onConfigurationChange }) => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h3>Algorithm Visualization Area</h3>
      <p>Playing: {isPlaying ? '▶️' : '⏸️'}</p>
      <p>Speed: {speed}x</p>
      <p>Configuration: {JSON.stringify(configuration)}</p>
      <div style={{ marginTop: '2rem' }}>
        <p>This is where your algorithm visualization would render.</p>
        <p>The component receives props for controlling playback state, speed, and configuration.</p>
      </div>
    </div>
  );
};
