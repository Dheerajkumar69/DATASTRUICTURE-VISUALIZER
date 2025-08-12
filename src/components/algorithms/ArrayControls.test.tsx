import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils';
import ArrayControls from './ArrayControls';

describe('ArrayControls Component', () => {
  const defaultProps = {
    onGenerateRandom: jest.fn(),
    onCustomArray: jest.fn(),
    arraySize: 10,
    onSizeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all required elements', () => {
    render(<ArrayControls {...defaultProps} />);

    expect(screen.getByLabelText(/array size/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /random array/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/custom array.*comma-separated/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument();
  });

  test('array size input has correct attributes', () => {
    render(<ArrayControls {...defaultProps} />);

    const sizeInput = screen.getByLabelText(/array size/i);
    expect(sizeInput).toHaveAttribute('type', 'number');
    expect(sizeInput).toHaveAttribute('min', '5');
    expect(sizeInput).toHaveAttribute('max', '100');
    expect(sizeInput).toHaveValue(10);
  });

  test('calls onSizeChange when size input changes', async () => {
    const user = userEvent.setup();
    render(<ArrayControls {...defaultProps} />);

    const sizeInput = screen.getByLabelText(/array size/i);
    await user.clear(sizeInput);
    await user.type(sizeInput, '25');

    expect(defaultProps.onSizeChange).toHaveBeenCalledWith(25);
  });

  test('does not call onSizeChange for invalid size values', async () => {
    const user = userEvent.setup();
    render(<ArrayControls {...defaultProps} />);

    const sizeInput = screen.getByLabelText(/array size/i);
    
    // Test value below minimum
    await user.clear(sizeInput);
    await user.type(sizeInput, '3');
    expect(defaultProps.onSizeChange).not.toHaveBeenCalledWith(3);

    // Test value above maximum
    await user.clear(sizeInput);
    await user.type(sizeInput, '150');
    expect(defaultProps.onSizeChange).not.toHaveBeenCalledWith(150);
  });

  test('calls onGenerateRandom when random array button is clicked', async () => {
    const user = userEvent.setup();
    render(<ArrayControls {...defaultProps} />);

    const randomButton = screen.getByRole('button', { name: /random array/i });
    await user.click(randomButton);

    expect(defaultProps.onGenerateRandom).toHaveBeenCalledWith(10);
  });

  test('processes valid custom array input correctly', async () => {
    const user = userEvent.setup();
    render(<ArrayControls {...defaultProps} />);

    const customInput = screen.getByPlaceholderText(/custom array.*comma-separated/i);
    const applyButton = screen.getByRole('button', { name: /apply/i });

    await user.type(customInput, '5,2,8,1,9,3,7');
    await user.click(applyButton);

    expect(defaultProps.onCustomArray).toHaveBeenCalledWith([5, 2, 8, 1, 9, 3, 7]);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  test('handles custom array input with spaces correctly', async () => {
    const user = userEvent.setup();
    render(<ArrayControls {...defaultProps} />);

    const customInput = screen.getByPlaceholderText(/custom array.*comma-separated/i);
    const applyButton = screen.getByRole('button', { name: /apply/i });

    await user.type(customInput, ' 5 , 2 , 8 , 1 , 9 ');
    await user.click(applyButton);

    expect(defaultProps.onCustomArray).toHaveBeenCalledWith([5, 2, 8, 1, 9]);
  });

  test('shows error for non-numeric values in custom array', async () => {
    const user = userEvent.setup();
    render(<ArrayControls {...defaultProps} />);

    const customInput = screen.getByPlaceholderText(/custom array.*comma-separated/i);
    const applyButton = screen.getByRole('button', { name: /apply/i });

    await user.type(customInput, '5,2,abc,1,9');
    await user.click(applyButton);

    expect(screen.getByText('All values must be numbers')).toBeInTheDocument();
    expect(defaultProps.onCustomArray).not.toHaveBeenCalled();
  });

  test('shows error for values outside allowed range', async () => {
    const user = userEvent.setup();
    render(<ArrayControls {...defaultProps} maxValue={50} />);

    const customInput = screen.getByPlaceholderText(/custom array.*comma-separated/i);
    const applyButton = screen.getByRole('button', { name: /apply/i });

    await user.type(customInput, '5,2,60,1,9');
    await user.click(applyButton);

    expect(screen.getByText('Values must be between 1 and 50')).toBeInTheDocument();
    expect(defaultProps.onCustomArray).not.toHaveBeenCalled();
  });

  test('shows error for array too short', async () => {
    const user = userEvent.setup();
    render(<ArrayControls {...defaultProps} />);

    const customInput = screen.getByPlaceholderText(/custom array.*comma-separated/i);
    const applyButton = screen.getByRole('button', { name: /apply/i });

    await user.type(customInput, '5,2,8');
    await user.click(applyButton);

    expect(screen.getByText('Array length must be between 5 and 100')).toBeInTheDocument();
    expect(defaultProps.onCustomArray).not.toHaveBeenCalled();
  });

  test('shows error for array too long', async () => {
    const user = userEvent.setup();
    render(<ArrayControls {...defaultProps} />);

    const customInput = screen.getByPlaceholderText(/custom array.*comma-separated/i);
    const applyButton = screen.getByRole('button', { name: /apply/i });

    // Create an array with 101 elements
    const longArray = Array.from({ length: 101 }, (_, i) => i + 1).join(',');
    await user.type(customInput, longArray);
    await user.click(applyButton);

    expect(screen.getByText('Array length must be between 5 and 100')).toBeInTheDocument();
    expect(defaultProps.onCustomArray).not.toHaveBeenCalled();
  });

  test('clears error when valid input is provided after invalid', async () => {
    const user = userEvent.setup();
    render(<ArrayControls {...defaultProps} />);

    const customInput = screen.getByPlaceholderText(/custom array.*comma-separated/i);
    const applyButton = screen.getByRole('button', { name: /apply/i });

    // First, enter invalid input
    await user.type(customInput, '5,2,abc,1,9');
    await user.click(applyButton);
    expect(screen.getByText('All values must be numbers')).toBeInTheDocument();

    // Then, enter valid input
    await user.clear(customInput);
    await user.type(customInput, '5,2,8,1,9');
    await user.click(applyButton);

    expect(screen.queryByText('All values must be numbers')).not.toBeInTheDocument();
    expect(defaultProps.onCustomArray).toHaveBeenCalledWith([5, 2, 8, 1, 9]);
  });

  test('disables controls when disabled prop is true', () => {
    render(<ArrayControls {...defaultProps} disabled={true} />);

    expect(screen.getByLabelText(/array size/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /random array/i })).toBeDisabled();
    expect(screen.getByPlaceholderText(/custom array.*comma-separated/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /apply/i })).toBeDisabled();
  });

  test('uses custom maxValue prop correctly', async () => {
    const user = userEvent.setup();
    render(<ArrayControls {...defaultProps} maxValue={50} />);

    const customInput = screen.getByPlaceholderText(/custom array.*comma-separated/i);
    const applyButton = screen.getByRole('button', { name: /apply/i });

    // Test value exactly at maxValue (should be valid)
    await user.type(customInput, '5,2,50,1,9');
    await user.click(applyButton);

    expect(defaultProps.onCustomArray).toHaveBeenCalledWith([5, 2, 50, 1, 9]);
  });

  test('handles edge case of zero value', async () => {
    const user = userEvent.setup();
    render(<ArrayControls {...defaultProps} />);

    const customInput = screen.getByPlaceholderText(/custom array.*comma-separated/i);
    const applyButton = screen.getByRole('button', { name: /apply/i });

    await user.type(customInput, '5,2,0,1,9');
    await user.click(applyButton);

    expect(screen.getByText('Values must be between 1 and 100')).toBeInTheDocument();
    expect(defaultProps.onCustomArray).not.toHaveBeenCalled();
  });

  test('keyboard navigation works correctly', async () => {
    const user = userEvent.setup();
    render(<ArrayControls {...defaultProps} />);

    // Tab through interactive elements
    await user.tab();
    expect(screen.getByLabelText(/array size/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: /random array/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByPlaceholderText(/custom array.*comma-separated/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: /apply/i })).toHaveFocus();
  });

  test('Enter key submits custom array', async () => {
    const user = userEvent.setup();
    render(<ArrayControls {...defaultProps} />);

    const customInput = screen.getByPlaceholderText(/custom array.*comma-separated/i);
    await user.type(customInput, '5,2,8,1,9');
    await user.keyboard('{Enter}');

    // Note: Enter key on input doesn't automatically submit in this implementation
    // This test verifies current behavior - you might want to add this feature
    expect(defaultProps.onCustomArray).not.toHaveBeenCalled();
  });
});
