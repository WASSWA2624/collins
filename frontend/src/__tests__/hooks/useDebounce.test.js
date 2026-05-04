/**
 * useDebounce Hook Tests
 * File: useDebounce.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import useDebounce from '@hooks/useDebounce';

const TestComponent = ({ value, delayMs, onResult }) => {
  const debouncedValue = useDebounce(value, delayMs);
  React.useEffect(() => {
    onResult(debouncedValue);
  });
  return null;
};

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('delays updates until delayMs', async () => {
    const results = [];
    const { rerender } = render(
      <TestComponent value="a" delayMs={300} onResult={(v) => results.push(v)} />
    );

    await waitFor(() => expect(results[0]).toBe('a'));

    rerender(<TestComponent value="b" delayMs={300} onResult={(v) => results.push(v)} />);

    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(results[results.length - 1]).toBe('a');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(results[results.length - 1]).toBe('b');
  });

  it('cancels the previous timer on rapid changes (only emits last value)', async () => {
    const results = [];
    const { rerender } = render(
      <TestComponent value="a" delayMs={200} onResult={(v) => results.push(v)} />
    );

    await waitFor(() => expect(results[0]).toBe('a'));

    rerender(<TestComponent value="b" delayMs={200} onResult={(v) => results.push(v)} />);
    rerender(<TestComponent value="c" delayMs={200} onResult={(v) => results.push(v)} />);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(results[results.length - 1]).toBe('c');
  });

  it('clears timers on unmount (no post-unmount state update)', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const results = [];
    const { rerender, unmount } = render(
      <TestComponent value="a" delayMs={100} onResult={(v) => results.push(v)} />
    );

    await waitFor(() => expect(results[0]).toBe('a'));

    rerender(<TestComponent value="b" delayMs={100} onResult={(v) => results.push(v)} />);
    unmount();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('applies delay changes deterministically', async () => {
    const results = [];
    const { rerender } = render(
      <TestComponent value="a" delayMs={200} onResult={(v) => results.push(v)} />
    );

    await waitFor(() => expect(results[0]).toBe('a'));

    rerender(<TestComponent value="b" delayMs={500} onResult={(v) => results.push(v)} />);

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(results[results.length - 1]).toBe('a');

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(results[results.length - 1]).toBe('b');
  });

  it('treats invalid delays as 0ms (immediate debounce)', async () => {
    const results = [];
    const { rerender } = render(
      <TestComponent value="a" delayMs={NaN} onResult={(v) => results.push(v)} />
    );

    await waitFor(() => expect(results[0]).toBe('a'));

    rerender(<TestComponent value="b" delayMs={-5} onResult={(v) => results.push(v)} />);

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(results[results.length - 1]).toBe('b');
  });
});

