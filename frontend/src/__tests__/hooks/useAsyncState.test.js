/**
 * useAsyncState Hook Tests
 * File: useAsyncState.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import useAsyncState from '@hooks/useAsyncState';

const TestComponent = ({ onResult }) => {
  const api = useAsyncState();
  React.useEffect(() => {
    onResult(api);
  });
  return null;
};

describe('useAsyncState', () => {
  it('initial → start → succeed', async () => {
    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.isLoading).toBe(false);
      expect(api.errorCode).toBeNull();
      expect(api.data).toBeNull();
    });

    act(() => {
      api.start();
    });
    await waitFor(() => expect(api.isLoading).toBe(true));

    act(() => {
      api.succeed({ ok: true });
    });
    await waitFor(() => {
      expect(api.isLoading).toBe(false);
      expect(api.errorCode).toBeNull();
      expect(api.data).toEqual({ ok: true });
    });
  });

  it('initial → start → fail (stores error codes only)', async () => {
    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    act(() => {
      api.start();
      api.fail('NETWORK_ERROR');
    });

    await waitFor(() => {
      expect(api.isLoading).toBe(false);
      expect(api.errorCode).toBe('NETWORK_ERROR');
    });

    act(() => {
      api.fail({ message: 'nope' });
    });

    await waitFor(() => {
      expect(api.errorCode).toBe('UNKNOWN_ERROR');
    });
  });

  it('fail → reset', async () => {
    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    act(() => {
      api.start();
      api.fail('SERVER_ERROR');
    });

    await waitFor(() => expect(api.errorCode).toBe('SERVER_ERROR'));

    act(() => {
      api.reset();
    });

    await waitFor(() => {
      expect(api.isLoading).toBe(false);
      expect(api.errorCode).toBeNull();
      expect(api.data).toBeNull();
    });
  });

  it('start() is idempotent and deterministic', async () => {
    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    act(() => {
      api.start();
      api.start();
    });

    await waitFor(() => {
      expect(api.isLoading).toBe(true);
      expect(api.errorCode).toBeNull();
    });
  });
});

