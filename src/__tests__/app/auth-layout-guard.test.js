/**
 * Auth Layout Guard Tests
 * 
 * Tests for auth layout with auth guard integration covering:
 * - Unauthenticated users can access auth routes (no redirect)
 * - Authenticated users are redirected to home route when accessing auth routes
 * - All branches (authenticated vs unauthenticated states)
 * - Integration between layout and guard hook
 * 
 * Coverage: 100% required (critical path: auth/access control)
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import AuthLayout from '@app/(auth)/_layout';
import { useAuth } from '@hooks';
import { useAuthGuard } from '@navigation/guards';
import { usePathname, useRouter } from 'expo-router';

// Mock dependencies
jest.mock('@navigation/guards', () => ({
  useAuthGuard: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/login'),
  Slot: ({ children }) => children || null,
}));

jest.mock('@hooks', () => ({
  useAuth: jest.fn(),
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
  }),
  useUiState: () => ({ isLoading: false }),
  useShellBanners: () => [],
}));

jest.mock('@platform/components', () => ({
  GlobalHeader: jest.fn(({ children, ...props }) => (
    <div {...props}>{children || 'GlobalHeader'}</div>
  )),
  LoadingOverlay: jest.fn(({ children, ...props }) => (
    <div {...props}>{children || 'LoadingOverlay'}</div>
  )),
  NoticeSurface: jest.fn(({ children, ...props }) => (
    <div {...props}>{children || 'NoticeSurface'}</div>
  )),
  ShellBanners: jest.fn(({ children, ...props }) => (
    <div {...props}>{children || 'ShellBanners'}</div>
  )),
}));

describe('AuthLayout with Auth Guard', () => {
  let mockRouter;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup router mock
    mockRouter = {
      replace: jest.fn(),
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);
    usePathname.mockReturnValue('/login');

    // Default: unauthenticated
    useAuth.mockReturnValue({ isAuthenticated: false, logout: jest.fn(), roles: [] });
    useAuthGuard.mockReturnValue({
      authenticated: false,
      user: null,
    });
  });

  it('should render Slot for unauthenticated users', async () => {
    useAuthGuard.mockReturnValue({
      authenticated: false,
      user: null,
    });

    const { getByTestId } = render(<AuthLayout />);

    await waitFor(() => {
      // Layout should render without redirecting
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  it('should redirect authenticated users to home route', async () => {
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });

    render(<AuthLayout />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/home');
    });
  });

  it('should allow register route for authorized roles', async () => {
    usePathname.mockReturnValue('/register');
    useAuth.mockReturnValue({ isAuthenticated: true, logout: jest.fn(), roles: ['admin'] });
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });

    render(<AuthLayout />);

    await waitFor(() => {
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  it('should redirect from register route without access', async () => {
    usePathname.mockReturnValue('/register');
    useAuth.mockReturnValue({ isAuthenticated: true, logout: jest.fn(), roles: [] });
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });

    render(<AuthLayout />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/home');
    });
  });

  it('should only redirect once per authenticated state (idempotent)', async () => {
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });

    const { rerender } = render(<AuthLayout />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      expect(mockRouter.replace).toHaveBeenCalledWith('/home');
    });

    // Rerender should not trigger another redirect
    rerender(<AuthLayout />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle transition from unauthenticated to authenticated', async () => {
    let authenticated = false;

    useAuthGuard.mockImplementation(() => ({
      authenticated,
      user: authenticated ? { id: '1', email: 'test@example.com' } : null,
    }));

    const { rerender } = render(<AuthLayout />);

    await waitFor(() => {
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    // Transition to authenticated
    authenticated = true;
    mockRouter.replace.mockClear();

    rerender(<AuthLayout />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/home');
    });
  });

  it('should handle transition from authenticated to unauthenticated', async () => {
    let authenticated = true;

    useAuthGuard.mockImplementation(() => ({
      authenticated,
      user: authenticated ? { id: '1', email: 'test@example.com' } : null,
    }));

    const { rerender } = render(<AuthLayout />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/home');
    });

    // Transition to unauthenticated
    authenticated = false;
    mockRouter.replace.mockClear();

    rerender(<AuthLayout />);

    await waitFor(() => {
      // Should not redirect when unauthenticated
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  it('should reset redirect flag when transitioning from authenticated to unauthenticated', async () => {
    let authenticated = true;

    useAuthGuard.mockImplementation(() => ({
      authenticated,
      user: authenticated ? { id: '1', email: 'test@example.com' } : null,
    }));

    const { rerender } = render(<AuthLayout />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/home');
    });

    // Transition to unauthenticated
    authenticated = false;
    mockRouter.replace.mockClear();

    rerender(<AuthLayout />);

    await waitFor(() => {
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    // Transition back to authenticated (should redirect again)
    authenticated = true;

    rerender(<AuthLayout />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/home');
    });
  });

  it('should call useAuthGuard hook', () => {
    render(<AuthLayout />);

    expect(useAuthGuard).toHaveBeenCalled();
  });

  it('should pass login action when unauthenticated', () => {
    render(<AuthLayout />);
    const GlobalHeader = require('@platform/components').GlobalHeader;
    const headerCall = GlobalHeader.mock.calls[0];
    const actionIds = headerCall[0].actions.map((action) => action.id);
    expect(actionIds).toContain('login');
    expect(actionIds).not.toContain('logout');
  });

  it('should pass logout action when authenticated', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, logout: jest.fn(), roles: ['admin'] });
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });
    render(<AuthLayout />);
    const GlobalHeader = require('@platform/components').GlobalHeader;
    const headerCall = GlobalHeader.mock.calls[0];
    const actionIds = headerCall[0].actions.map((action) => action.id);
    expect(actionIds).toContain('logout');
    expect(actionIds).not.toContain('login');
    expect(actionIds).not.toContain('register');
  });

  it('should call useRouter hook', () => {
    render(<AuthLayout />);

    expect(useRouter).toHaveBeenCalled();
  });

  it('should handle router errors gracefully', () => {
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });

    mockRouter.replace.mockImplementation(() => {
      throw new Error('Router error');
    });

    // Should throw error (router error propagates)
    expect(() => {
      render(<AuthLayout />);
    }).toThrow('Router error');
  });

  it('should handle useAuthGuard returning undefined authenticated', async () => {
    useAuthGuard.mockReturnValue({
      authenticated: undefined,
      user: null,
    });

    render(<AuthLayout />);

    await waitFor(() => {
      // Should not redirect if authenticated is undefined/falsy
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  it('should handle useAuthGuard returning null user for authenticated state', async () => {
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: null,
    });

    render(<AuthLayout />);

    await waitFor(() => {
      // Should still redirect if authenticated is true, even if user is null
      expect(mockRouter.replace).toHaveBeenCalledWith('/home');
    });
  });
});

