/**
 * Main Session Sub-Layout Guard Tests
 * File: main-session-layout-guard.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import MainSessionLayout from '@app/(main)/session/_layout';
import { useSessionGuard } from '@navigation/guards';

jest.mock('@navigation/guards', () => ({
  useSessionGuard: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Slot: () => null,
}));

describe('app/(main)/session/_layout.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call useSessionGuard', () => {
    render(<MainSessionLayout />);
    expect(useSessionGuard).toHaveBeenCalled();
  });
});

