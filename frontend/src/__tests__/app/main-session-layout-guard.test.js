/**
 * Session Layout Guard Tests
 * File: main-session-layout-guard.test.js
 *
 * Tests for src/app/(main)/session/_layout.jsx (P011 11.S.2).
 * - Uses useSessionGuard; redirects to /assessment when missing session (via hook).
 * - Renders <Slot /> when session exists and ready.
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import SessionLayout from '@app/(main)/session/_layout';

const mockReplace = jest.fn();
jest.mock('expo-router', () => {
  const R = require('react');
  return {
    Slot: () => R.createElement(Text, { testID: 'session-slot' }, 'MOCK_SLOT_CHILD'),
    useRouter: () => ({ replace: mockReplace }),
  };
});

let mockHasSession = true;
let mockIsReady = true;
jest.mock('@hooks', () => ({
  useSessionGuard: () => ({ hasSession: mockHasSession, isReady: mockIsReady }),
}));

describe('app/(main)/session/_layout.jsx (session guard)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHasSession = true;
    mockIsReady = true;
  });

  it('renders Slot when session exists and ready', () => {
    const { getByTestId, getByText } = render(<SessionLayout />);
    expect(getByTestId('session-slot')).toBeDefined();
    expect(getByText('MOCK_SLOT_CHILD')).toBeTruthy();
  });

  it('renders nothing when session is missing', () => {
    mockHasSession = false;
    mockIsReady = true;
    const { queryByTestId } = render(<SessionLayout />);
    expect(queryByTestId('session-slot')).toBeNull();
  });

  it('renders nothing when not ready (hydrating)', () => {
    mockHasSession = true;
    mockIsReady = false;
    const { queryByTestId } = render(<SessionLayout />);
    expect(queryByTestId('session-slot')).toBeNull();
  });

  it('renders nothing when both missing session and not ready', () => {
    mockHasSession = false;
    mockIsReady = false;
    const { queryByTestId } = render(<SessionLayout />);
    expect(queryByTestId('session-slot')).toBeNull();
  });
});
