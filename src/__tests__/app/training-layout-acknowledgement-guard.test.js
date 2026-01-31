/**
 * Training Layout Acknowledgement Guard Tests
 * File: training-layout-acknowledgement-guard.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import TrainingLayout from '@app/(training)/_layout';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { useAcknowledgementGuard } from '@navigation/guards/acknowledgement.guard';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Slot: () => null,
}));

describe('app/(training)/_layout.jsx - acknowledgement guard', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ replace: mockReplace, push: jest.fn() });
  });

  test('should not redirect when acknowledged', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ ui: { disclaimerAcknowledged: true } })
    );

    render(<TrainingLayout />);

    await waitFor(() => {
      expect(useAcknowledgementGuard).toBeDefined();
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  test('should redirect to /disclaimer when unacknowledged', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ ui: { disclaimerAcknowledged: false } })
    );

    render(<TrainingLayout />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/disclaimer');
    });
  });
});

