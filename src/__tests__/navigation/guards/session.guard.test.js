/**
 * Session Guard Hook Tests
 * File: session.guard.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { useSessionGuard } from '@navigation/guards/session.guard';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const TestComponent = ({ options, onResult }) => {
  const api = useSessionGuard(options);
  React.useEffect(() => {
    onResult(api);
  }, [api, onResult]);
  return null;
};

describe('useSessionGuard', () => {
  let mockRouter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter = { replace: jest.fn(), push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);
  });

  test('should return hasSession=true and not redirect when session exists', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ ui: { currentSessionId: 'abc' } })
    );

    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.hasSession).toBe(true);
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  test('should redirect to default /assessment when session is missing', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ ui: { currentSessionId: null } })
    );

    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.hasSession).toBe(false);
      expect(mockRouter.replace).toHaveBeenCalledWith('/assessment');
    });
  });

  test('should redirect to custom path when provided', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ ui: { currentSessionId: null } })
    );

    render(<TestComponent options={{ redirectPath: '/custom' }} onResult={() => {}} />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/custom');
    });
  });

  test('should not redirect when skipRedirect is true', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ ui: { currentSessionId: null } })
    );

    let api;
    render(<TestComponent options={{ skipRedirect: true }} onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.hasSession).toBe(false);
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  test('should be idempotent (redirect only once) when session is missing', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ ui: { currentSessionId: null } })
    );

    const { rerender } = render(<TestComponent onResult={() => {}} />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledTimes(1);
    });

    rerender(<TestComponent onResult={() => {}} />);
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledTimes(1);
    });
  });

  test('should handle missing/undefined state safely (treat as no session)', async () => {
    useSelector.mockImplementation((selector) => selector({}));

    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.hasSession).toBe(false);
      expect(mockRouter.replace).toHaveBeenCalledWith('/assessment');
    });
  });
});

