import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

// Mock complex pages to avoid rendering heavy components in integration tests
jest.mock('../../pages/HomePage', () => {
  return function HomePage() {
    return <div data-testid="home-page">Home Page Content</div>;
  };
});

jest.mock('../../pages/dataStructures/ArrayPage', () => {
  return function ArrayPage() {
    return <div data-testid="array-page">Array Page Content</div>;
  };
});

jest.mock('../../pages/algorithms/SortingPage', () => {
  return function SortingPage() {
    return <div data-testid="sorting-page">Sorting Page Content</div>;
  };
});

jest.mock('../../pages/algorithms/sorting/BubbleSortPage', () => {
  return function BubbleSortPage() {
    return <div data-testid="bubble-sort-page">Bubble Sort Page Content</div>;
  };
});

describe('Navigation Integration Tests', () => {
  const renderWithRouter = (initialRoute: string = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    );
  };

  test('renders home page by default', () => {
    renderWithRouter('/');
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('navigates to data structures page', () => {
    renderWithRouter('/data-structures/array');
    expect(screen.getByTestId('array-page')).toBeInTheDocument();
  });

  test('navigates to algorithms page', () => {
    renderWithRouter('/algorithms/sorting');
    expect(screen.getByTestId('sorting-page')).toBeInTheDocument();
  });

  test('navigates to specific sorting algorithm page', () => {
    renderWithRouter('/algorithms/sorting/bubble-sort');
    expect(screen.getByTestId('bubble-sort-page')).toBeInTheDocument();
  });

  test('logo click navigates to home page', async () => {
    const user = userEvent.setup();
    renderWithRouter('/algorithms/sorting');

    // Verify we start on sorting page
    expect(screen.getByTestId('sorting-page')).toBeInTheDocument();

    // Click logo to go home
    const logoLink = screen.getByRole('link', { name: /data structure visualizer/i });
    await user.click(logoLink);

    // Should now be on home page
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('theme toggle works across navigation', async () => {
    const user = userEvent.setup();
    renderWithRouter('/');

    const themeToggle = screen.getByLabelText(/switch to (light|dark) mode/i);
    const initialLabel = themeToggle.getAttribute('aria-label');

    // Toggle theme
    await user.click(themeToggle);

    // Verify theme changed
    const newLabel = themeToggle.getAttribute('aria-label');
    expect(newLabel).not.toBe(initialLabel);
  });

  test('maintains theme state during navigation', async () => {
    const user = userEvent.setup();
    
    // Custom render with providers but wrapped in MemoryRouter
    const { rerender } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Toggle theme on home page
    const themeToggle = screen.getByLabelText(/switch to (light|dark) mode/i);
    await user.click(themeToggle);
    const themeLabel = themeToggle.getAttribute('aria-label');

    // Navigate to different page
    rerender(
      <MemoryRouter initialEntries={['/algorithms/sorting']}>
        <App />
      </MemoryRouter>
    );

    // Theme should be maintained
    const newThemeToggle = screen.getByLabelText(/switch to (light|dark) mode/i);
    expect(newThemeToggle.getAttribute('aria-label')).toBe(themeLabel);
  });

  test('sidebar navigation is present on all pages', () => {
    // Test multiple routes
    const routes = ['/', '/data-structures/array', '/algorithms/sorting'];

    routes.forEach(route => {
      renderWithRouter(route);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  test('header is present on all pages', () => {
    const routes = ['/', '/data-structures/array', '/algorithms/sorting'];

    routes.forEach(route => {
      renderWithRouter(route);
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
    });
  });

  test('footer is present on all pages', () => {
    const routes = ['/', '/data-structures/array', '/algorithms/sorting'];

    routes.forEach(route => {
      renderWithRouter(route);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  test('github link works on all pages', () => {
    const routes = ['/', '/data-structures/array', '/algorithms/sorting'];

    routes.forEach(route => {
      renderWithRouter(route);
      const githubLink = screen.getByLabelText('GitHub repository');
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/dheerajkumargaur/DSA_Visualizer');
    });
  });

  test('handles unknown routes gracefully', () => {
    // This would typically show a 404 page, but since we don't have one mocked,
    // it should still render the layout without crashing
    renderWithRouter('/unknown-route');
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('animation provider context is available across routes', () => {
    const routes = ['/', '/data-structures/array', '/algorithms/sorting'];

    routes.forEach(route => {
      renderWithRouter(route);
      
      // The AnimationProvider should be wrapping all content
      // We can't directly test the context without a test component,
      // but we can verify the app renders without context errors
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  test('theme provider context is available across routes', () => {
    const routes = ['/', '/data-structures/array', '/algorithms/sorting'];

    routes.forEach(route => {
      renderWithRouter(route);
      
      // Theme toggle should be available, indicating ThemeProvider is working
      expect(screen.getByLabelText(/switch to (light|dark) mode/i)).toBeInTheDocument();
    });
  });

  test('scroll to top component works on navigation', () => {
    // This is difficult to test directly without mocking window.scrollTo
    // But we can verify the component is present
    renderWithRouter('/');
    
    // ScrollToTop component doesn't render visible content,
    // but it should be included in the app structure
    // We verify by checking that navigation works without errors
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('responsive layout structure is maintained across routes', () => {
    const routes = ['/', '/data-structures/array', '/algorithms/sorting'];

    routes.forEach(route => {
      renderWithRouter(route);
      
      // Check for main layout elements
      expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
      expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
      expect(screen.getByRole('navigation')).toBeInTheDocument(); // Sidebar
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
    });
  });
});
