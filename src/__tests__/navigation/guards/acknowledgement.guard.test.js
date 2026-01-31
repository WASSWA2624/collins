/**
 * Acknowledgement Guard Hook Tests
 * File: acknowledgement.guard.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { useAcknowledgementGuard } from '@navigation/guards/acknowledgement.guard';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const TestComponent = ({ options, onResult }) => {
  const api = useAcknowledgementGuard(options);
  React.useEffect(() => {
    onResult(api);
  }, [api, onResult]);
  return null;
};

describe('useAcknowledgementGuard', () => {
  let mockRouter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter = { replace: jest.fn(), push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);
  });

  test('should return acknowledged=true and not redirect when acknowledged', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ ui: { disclaimerAcknowledged: true } })
    );

    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.acknowledged).toBe(true);
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  test('should redirect to default /disclaimer when unacknowledged', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ ui: { disclaimerAcknowledged: false } })
    );

    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.acknowledged).toBe(false);
      expect(mockRouter.replace).toHaveBeenCalledWith('/disclaimer');
    });
  });

  test('should redirect to custom path when provided', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ ui: { disclaimerAcknowledged: false } })
    );

    render(<TestComponent options={{ redirectPath: '/custom' }} onResult={() => {}} />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/custom');
    });
  });

  test('should not redirect when skipRedirect is true', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ ui: { disclaimerAcknowledged: false } })
    );

    let api;
    render(<TestComponent options={{ skipRedirect: true }} onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.acknowledged).toBe(false);
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  test('should be idempotent (redirect only once) when unacknowledged', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ ui: { disclaimerAcknowledged: false } })
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

  test('should handle missing/undefined state safely (treat as unacknowledged)', async () => {
    useSelector.mockImplementation((selector) => selector({}));

    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.acknowledged).toBe(false);
      expect(mockRouter.replace).toHaveBeenCalledWith('/disclaimer');
    });
  });

  test('should handle corrupted persisted flag safely (treat non-boolean true as unacknowledged)', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ ui: { disclaimerAcknowledged: 'yes' } })
    );

    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.acknowledged).toBe(false);
      expect(mockRouter.replace).toHaveBeenCalledWith('/disclaimer');
    });
  });
});

