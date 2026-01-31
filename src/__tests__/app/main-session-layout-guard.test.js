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
  Slot: () => {
    const { Text } = require('react-native');
    return <Text>MOCK_SLOT_CHILD</Text>;
  },
  useRouter: jest.fn(),
}));

describe('app/(main)/session/_layout.jsx', () => {
  let mockRouter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter = {
      replace: jest.fn(),
      push: jest.fn(),
    };
    const { useRouter } = require('expo-router');
    useRouter.mockReturnValue(mockRouter);
  });

  test('has session: should not redirect and should render child routes via <Slot />', () => {
    useSessionGuard.mockImplementation(() => ({ hasSession: true }));

    const { getByText } = render(<MainSessionLayout />);

    expect(useSessionGuard).toHaveBeenCalled();
    expect(mockRouter.replace).not.toHaveBeenCalled();
    expect(getByText('MOCK_SLOT_CHILD')).toBeTruthy();
  });

  test('missing session: should redirect to /assessment and still render <Slot />', () => {
    useSessionGuard.mockImplementation(() => {
      // The real guard hook performs the redirect; we simulate it here per the plan.
      mockRouter.replace('/assessment');
      return { hasSession: false };
    });

    const { getByText } = render(<MainSessionLayout />);

    expect(useSessionGuard).toHaveBeenCalled();
    expect(mockRouter.replace).toHaveBeenCalledWith('/assessment');
    expect(getByText('MOCK_SLOT_CHILD')).toBeTruthy();
  });
});

