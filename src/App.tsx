import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider } from './themes/ThemeContext';
import GlobalStyle from './themes/GlobalStyle';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/utils/ScrollToTop';
import { AnimationProvider } from './components/utils/AnimationContext';
import ResourcePreloader from './components/utils/ResourcePreloader';
import { routeConfig } from './routes/RouteConfig';
import LazyRouteWrapper from './components/common/LazyRouteWrapper';
import ErrorBoundary from './components/common/ErrorBoundary';
// import { AccessibilityProvider } from './components/accessibility/AccessibilityProvider';
// import VoiceAnnouncer from './components/accessibility/VoiceAnnouncer';
// import FocusManager, { SkipLink } from './components/accessibility/FocusManager';
// import { performanceMonitor } from './utils/performanceMonitoring';
// import './styles/accessibility.css';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const App: React.FC = () => {
  // Initialize performance monitoring
  // useEffect(() => {
  //   performanceMonitor.init();
  // }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AnimationProvider>
          <ResourcePreloader>
            <GlobalStyle />
            <AppContainer role="application" aria-label="Data Structure Visualizer">
              <ScrollToTop />
              <Header />
              <MainContent>
                <Sidebar />
                <ContentArea 
                  id="main-content" 
                  tabIndex={-1} 
                  role="main"
                  aria-label="Main visualization content"
                >
                  <ErrorBoundary>
                    <Routes>
                      {routeConfig.map((route, index) => (
                        <Route
                          key={index}
                          path={route.path}
                          element={<LazyRouteWrapper component={route.component} loadingMessage={route.loadingMessage} />}
                        />
                      ))}
                    </Routes>
                  </ErrorBoundary>
                </ContentArea>
              </MainContent>
              <Footer />
            </AppContainer>
          </ResourcePreloader>
        </AnimationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App; 