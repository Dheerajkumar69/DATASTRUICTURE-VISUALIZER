# Test Suite Setup and Usage Guide

## Overview

This project includes a comprehensive Jest/React Testing Library test suite that covers:

- ✅ **Unit Tests** - Individual component and utility function tests
- ✅ **Integration Tests** - Component interaction and routing tests
- ✅ **Accessibility Tests** - Keyboard navigation and screen reader support
- ✅ **User Interaction Tests** - Form submissions, button clicks, theme switching
- ✅ **Context Tests** - Theme and animation context providers
- ✅ **Error Handling Tests** - Edge cases and error scenarios

## Setup

The test environment is already configured with:

- **Jest** - Test runner and framework
- **React Testing Library** - Component testing utilities
- **User Event** - User interaction simulation
- **Jest DOM** - Additional DOM matchers
- **Styled Components Testing** - Snapshot serializers for styled components

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD (no watch mode)
npm run test:ci
```

### Specialized Commands

```bash
# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only component tests
npm run test:components

# Run only utility function tests
npm run test:utils

# Debug tests (with Node.js inspector)
npm run test:debug

# Clear Jest cache
npm run test:clear-cache
```

## Test Structure

```
src/
├── setupTests.ts                 # Test setup and global mocks
├── test-utils/                   # Testing utilities and custom render
│   └── index.tsx                # Custom render with providers
├── App.test.tsx                 # Main App component tests
├── components/
│   ├── layout/
│   │   └── Header.test.tsx      # Header component tests
│   ├── algorithms/
│   │   └── ArrayControls.test.tsx # Array controls tests
│   └── utils/
│       ├── AnimationContext.test.tsx # Context tests
│       └── AnimationUtils.test.ts    # Utility function tests
└── tests/
    └── integration/
        └── Navigation.test.tsx   # Integration tests
```

## Test Coverage

The test suite aims for:

- **70%+ Line Coverage**
- **70%+ Function Coverage**
- **70%+ Branch Coverage**
- **70%+ Statement Coverage**

View coverage report by running:
```bash
npm run test:coverage
```

## What's Tested

### Components
- ✅ **App.tsx** - Main application structure and routing
- ✅ **Header.tsx** - Navigation, theme toggle, logo functionality
- ✅ **ArrayControls.tsx** - Form inputs, validation, user interactions

### Contexts
- ✅ **AnimationContext** - Animation state management
- ✅ **ThemeContext** - Theme switching functionality (via integration tests)

### Utilities
- ✅ **AnimationUtils** - Animation constants, helper functions, performance utilities

### Integration
- ✅ **Navigation** - Routing, layout consistency, provider availability

## Writing New Tests

### Component Test Template

```typescript
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  const defaultProps = {
    // Define default props here
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    render(<YourComponent {...defaultProps} />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  test('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<YourComponent {...defaultProps} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(/* assertion */).toBeTruthy();
  });
});
```

### Utility Test Template

```typescript
import { yourUtilFunction } from './YourUtilFile';

describe('yourUtilFunction', () => {
  test('handles normal case', () => {
    const result = yourUtilFunction('input');
    expect(result).toBe('expected output');
  });

  test('handles edge case', () => {
    const result = yourUtilFunction(null);
    expect(result).toBe(/* expected behavior */);
  });
});
```

## Best Practices

### Testing Guidelines

1. **Test Behavior, Not Implementation**
   - Test what the user sees and can interact with
   - Avoid testing internal state or implementation details

2. **Use Semantic Queries**
   - Prefer `getByRole`, `getByLabelText`, `getByText`
   - Avoid `getByTestId` unless necessary

3. **Test Accessibility**
   - Check for proper ARIA attributes
   - Test keyboard navigation
   - Verify screen reader compatibility

4. **Mock External Dependencies**
   - Mock API calls, complex libraries, and external services
   - Keep tests focused and fast

5. **Write Clear Test Names**
   - Use descriptive test names that explain the expected behavior
   - Follow the pattern: "should [expected behavior] when [condition]"

### Common Patterns

```typescript
// Testing user interactions
const user = userEvent.setup();
await user.click(screen.getByRole('button'));
await user.type(screen.getByLabelText(/email/i), 'test@example.com');

// Testing form submissions
await user.type(input, 'value');
await user.click(submitButton);
expect(mockSubmitHandler).toHaveBeenCalledWith(expectedData);

// Testing error states
expect(screen.getByText(/error message/i)).toBeInTheDocument();

// Testing loading states
expect(screen.getByText(/loading/i)).toBeInTheDocument();

// Testing async operations
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

## Debugging Tests

### Common Issues

1. **Tests timeout**: Increase timeout or check for infinite loops
2. **Element not found**: Check if element is rendered conditionally
3. **Act warnings**: Wrap state updates in `act()` or use `await`
4. **Mock not working**: Ensure mocks are imported before the tested module

### Debug Commands

```bash
# Run specific test file
npm test -- Header.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="theme toggle"

# Run with verbose output
npm test -- --verbose

# Run in debug mode (opens Chrome DevTools)
npm run test:debug
```

## Continuous Integration

The test suite is configured for CI environments:

```bash
# CI command (no watch mode, generates coverage)
npm run test:ci
```

This command:
- Runs all tests once
- Generates coverage report
- Creates JUnit XML output for CI systems
- Fails if coverage thresholds aren't met

## Future Improvements

Consider adding:

- **Visual Regression Tests** - Screenshot comparison for UI components
- **End-to-End Tests** - Full user workflow testing with Cypress or Playwright
- **Performance Tests** - Animation performance and rendering benchmarks
- **Accessibility Automation** - Automated a11y testing with axe-core
- **Snapshot Tests** - For stable component markup (use sparingly)

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Guide](https://testing-library.com/docs/react-testing-library/intro/)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Best Practices](https://testing-library.com/docs/guiding-principles)
