/**
 * useCrud Hook Tests
 * File: useCrud.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import useCrud from '@hooks/useCrud';

const TestComponent = ({ actions, onResult }) => {
  const api = useCrud(actions);
  React.useEffect(() => {
    onResult(api);
  });
  return null;
};

describe('useCrud', () => {
  it('runs actions and updates async state', async () => {
    const action = jest.fn().mockResolvedValue({ ok: true });
    let api;
    render(<TestComponent actions={{ list: action }} onResult={(value) => (api = value)} />);

    await waitFor(() => {
      expect(api.isLoading).toBe(false);
      expect(api.errorCode).toBeNull();
    });

    await act(async () => {
      await api.list();
    });

    await waitFor(() => {
      expect(api.isLoading).toBe(false);
      expect(api.data).toEqual({ ok: true });
    });
  });

  it('stores error codes when action fails', async () => {
    const action = jest.fn().mockRejectedValue({ code: 'UNAUTHORIZED' });
    let api;
    render(<TestComponent actions={{ get: action }} onResult={(value) => (api = value)} />);

    await act(async () => {
      try {
        await api.get('1');
      } catch (error) {
        expect(error.code).toBe('UNAUTHORIZED');
      }
    });

    await waitFor(() => {
      expect(api.errorCode).toBe('UNAUTHORIZED');
    });
  });
});
