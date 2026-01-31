/**
 * Training Layout Acknowledgement Guard Tests
 * File: training-layout-acknowledgement-guard.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import TrainingLayout from '@app/(training)/_layout';
import { useAcknowledgementGuard } from '@navigation/guards';

jest.mock('@navigation/guards', () => ({
  useAcknowledgementGuard: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Slot: () => null,
}));

describe('app/(training)/_layout.jsx - acknowledgement guard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call useAcknowledgementGuard', () => {
    render(<TrainingLayout />);
    expect(useAcknowledgementGuard).toHaveBeenCalled();
  });
});

