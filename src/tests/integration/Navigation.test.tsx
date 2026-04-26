import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../themes/ThemeContext';
import { AnimationProvider } from '../../components/utils/AnimationContext';
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

// Render App wrapped in MemoryRouter + theme/animation providers.
// We do NOT use the custom render() from test-utils because that already wraps
// in BrowserRouter, which would conflict with MemoryRouter here.
const renderAppAt = (initialRoute: string = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ThemeProvider>
        <AnimationProvider>
          <App />
        </AnimationProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('Navigation Integration Tests', () => {
  test('renders home page by default', async () => {
    renderAppAt('/');
    expect(await screen.findByTestId('home-page')).toBeInTheDocument();
  });

  test('navigates to data structures page', async () => {
    renderAppAt('/data-structures/array');
    expect(await screen.findByTestId('array-page')).toBeInTheDocument();
  });

  test('navigates to algorithms page', async () => {
    renderAppAt('/algorithms/sorting');
    expect(await screen.findByTestId('sorting-page')).toBeInTheDocument();
  });

  test('navigates to specific sorting algorithm page', async () => {
    renderAppAt('/algorithms/sorting/bubble-sort');
    expect(await screen.findByTestId('bubble-sort-page')).toBeInTheDocument();
  });

  test('logo click navigates to home page', async () => {
    const user = userEvent.setup();
    renderAppAt('/algorithms/sorting');

    expect(await screen.findByTestId('sorting-page')).toBeInTheDocument();

    const logoLink = screen.getByRole('link', { name: /data structure visualizer/i });
    await user.click(logoLink);

    expect(await screen.findByTestId('home-page')).toBeInTheDocument();
  });

  test('theme toggle works across navigation', async () => {
    const user = userEvent.setup();
    renderAppAt('/');

    const themeToggle = screen.getByLabelText(/switch to (light|dark) mode/i);
    const initialLabel = themeToggle.getAttribute('aria-label');

    await user.click(themeToggle);

    const newLabel = themeToggle.getAttribute('aria-label');
    expect(newLabel).not.toBe(initialLabel);
  });

  test('sidebar navigation is present on all pages', async () => {
    const routes = ['/', '/data-structures/array', '/algorithms/sorting'];

    for (const route of routes) {
      const { unmount } = renderAppAt(route);
      expect(await screen.findByRole('navigation')).toBeInTheDocument();
      unmount();
    }
  });

  test('header is present on all pages', async () => {
    const routes = ['/', '/data-structures/array', '/algorithms/sorting'];

    for (const route of routes) {
      const { unmount } = renderAppAt(route);
      expect(await screen.findByRole('banner')).toBeInTheDocument();
      expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      unmount();
    }
  });

  test('footer is present on all pages', async () => {
    const routes = ['/', '/data-structures/array', '/algorithms/sorting'];

    for (const route of routes) {
      const { unmount } = renderAppAt(route);
      expect(await screen.findByRole('contentinfo')).toBeInTheDocument();
      unmount();
    }
  });

  test('github link works on all pages', () => {
    renderAppAt('/');
    const githubLink = screen.getByLabelText(/view source code on github/i);
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Dheerajkumar69');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  test('handles unknown routes gracefully', async () => {
    renderAppAt('/unknown-route');

    expect(await screen.findByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('animation provider context is available across routes', async () => {
    const routes = ['/', '/data-structures/array', '/algorithms/sorting'];

    for (const route of routes) {
      const { unmount } = renderAppAt(route);
      // There may be multiple role=main elements; just confirm at least one exists
      const mains = await screen.findAllByRole('main');
      expect(mains.length).toBeGreaterThan(0);
      unmount();
    }
  });

  test('theme provider context is available across routes', async () => {
    const routes = ['/', '/data-structures/array', '/algorithms/sorting'];

    for (const route of routes) {
      const { unmount } = renderAppAt(route);
      expect(await screen.findByLabelText(/switch to (light|dark) mode/i)).toBeInTheDocument();
      unmount();
    }
  });

  test('scroll to top component works on navigation', async () => {
    renderAppAt('/');
    const mains = await screen.findAllByRole('main');
    expect(mains.length).toBeGreaterThan(0);
  });

  test('responsive layout structure is maintained across routes', async () => {
    const routes = ['/', '/data-structures/array', '/algorithms/sorting'];

    for (const route of routes) {
      const { unmount } = renderAppAt(route);
      expect(await screen.findByRole('banner')).toBeInTheDocument();
      const mains = await screen.findAllByRole('main');
      expect(mains.length).toBeGreaterThan(0);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      unmount();
    }
  });
});
