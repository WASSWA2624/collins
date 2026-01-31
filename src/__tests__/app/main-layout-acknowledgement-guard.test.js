/**
 * Main Layout Acknowledgement Guard Tests
 * File: main-layout-acknowledgement-guard.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import MainLayout from '@app/(main)/_layout';
import { useAcknowledgementGuard } from '@navigation/guards';

jest.mock('@navigation/guards', () => ({
  useAcknowledgementGuard: jest.fn(),
}));

jest.mock('@platform/layouts', () => ({
  MainRouteLayout: () => null,
}));

describe('app/(main)/_layout.jsx - acknowledgement guard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call useAcknowledgementGuard', () => {
    render(<MainLayout />);
    expect(useAcknowledgementGuard).toHaveBeenCalled();
  });
});

