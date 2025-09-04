import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { EnhancedErrorBoundary } from './components/common/EnhancedErrorBoundary';
import { GlobalStyles } from './styles/GlobalStyles';
import { AppRoutes } from './routes/AppRoutes';

const App: React.FC = () => {
  return (
    <EnhancedErrorBoundary>
      <ThemeProvider>
        <GlobalStyles />
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </EnhancedErrorBoundary>
  );
};

export default App;