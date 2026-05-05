/**
 * Auth Slice Tests
 * File: auth.slice.test.js
 */
import { configureStore } from '@reduxjs/toolkit';

jest.mock('@features/auth', () => ({
  changePasswordUseCase: jest.fn(),
  forgotPasswordUseCase: jest.fn(),
  loginUseCase: jest.fn(),
  registerUseCase: jest.fn(),
  logoutUseCase: jest.fn(),
  refreshSessionUseCase: jest.fn(),
  loadCurrentUserUseCase: jest.fn(),
  restoreSessionUseCase: jest.fn(),
  selectActiveFacilityUseCase: jest.fn(),
  resendVerificationUseCase: jest.fn(),
  resetPasswordUseCase: jest.fn(),
  verifyEmailUseCase: jest.fn(),
  verifyPhoneUseCase: jest.fn(),
}));

import { actions, reducer } from '@store/slices/auth.slice';
import {
  loginUseCase,
  registerUseCase,
  logoutUseCase,
  refreshSessionUseCase,
  loadCurrentUserUseCase,
  restoreSessionUseCase,
  selectActiveFacilityUseCase,
  verifyEmailUseCase,
  verifyPhoneUseCase,
  resendVerificationUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  changePasswordUseCase,
} from '@features/auth';

const createStore = () =>
  configureStore({
    reducer: {
      auth: reducer,
    },
  });

describe('auth.slice', () => {
  beforeEach(() => {
    loginUseCase.mockResolvedValue({ id: '1' });
    registerUseCase.mockResolvedValue({ id: '2' });
    logoutUseCase.mockResolvedValue(true);
    refreshSessionUseCase.mockResolvedValue({ accessToken: 'a', refreshToken: 'b' });
    loadCurrentUserUseCase.mockResolvedValue({ id: '3' });
    restoreSessionUseCase.mockResolvedValue({ id: '4', activeFacility: { facilityId: 'f1', roles: ['CLINICIAN'] } });
    selectActiveFacilityUseCase.mockResolvedValue({ id: '5', activeFacility: { facilityId: 'f2', roles: ['ICU_NURSE'] } });
    verifyEmailUseCase.mockResolvedValue({ verified: true });
    verifyPhoneUseCase.mockResolvedValue({ verified: true });
    resendVerificationUseCase.mockResolvedValue({ sent: true });
    forgotPasswordUseCase.mockResolvedValue({ sent: true });
    resetPasswordUseCase.mockResolvedValue({ reset: true });
    changePasswordUseCase.mockResolvedValue({ changed: true });
  });

  it('handles login/register/logout flows', async () => {
    const store = createStore();
    await store.dispatch(actions.login({
      email: 'user@example.com',
      password: 'pass',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000'
    }));
    expect(store.getState().auth.isAuthenticated).toBe(true);
    await store.dispatch(actions.register({ email: 'user' }));
    expect(store.getState().auth.user).toEqual({ id: '2' });
    await store.dispatch(actions.logout());
    expect(store.getState().auth.user).toBeNull();
  });

  it('handles refresh and load current user', async () => {
    const store = createStore();
    await store.dispatch(actions.refreshSession());
    expect(store.getState().auth.hasRestoredSession).toBe(true);
    await store.dispatch(actions.loadCurrentUser());
    expect(store.getState().auth.user).toEqual({ id: '3' });
  });

  it('restores session and selects active facility', async () => {
    const store = createStore();
    await store.dispatch(actions.restoreSession());
    expect(store.getState().auth.hasRestoredSession).toBe(true);
    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.activeFacility.facilityId).toBe('f1');

    await store.dispatch(actions.selectActiveFacility({ activeFacilityId: 'f2' }));
    expect(store.getState().auth.activeFacility.facilityId).toBe('f2');
    expect(selectActiveFacilityUseCase).toHaveBeenCalledWith({ activeFacilityId: 'f2' });
  });

  it('blocks authenticated users that need facility context', async () => {
    const store = createStore();
    loginUseCase.mockResolvedValueOnce({
      id: '1',
      memberships: [
        {
          id: 'm1',
          facilityId: 'f1',
          status: 'APPROVED',
          role: 'CLINICIAN',
        },
        {
          id: 'm2',
          facilityId: 'f2',
          status: 'APPROVED',
          role: 'ICU_NURSE',
        },
      ],
    });

    await store.dispatch(actions.login({
      email: 'user@example.com',
      password: 'pass',
    }));

    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.requiresActiveFacility).toBe(true);
    expect(store.getState().auth.sessionStatus).toBe('facilityRequired');
  });

  it('stores error codes on failures', async () => {
    const store = createStore();
    loginUseCase.mockRejectedValueOnce({ code: 'UNAUTHORIZED' });
    await store.dispatch(actions.login({
      email: 'user@example.com',
      password: 'pass',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000'
    }));
    expect(store.getState().auth.errorCode).toBe('UNAUTHORIZED');
  });

  it('handles verification and password flows', async () => {
    const store = createStore();
    await store.dispatch(actions.verifyEmail({ token: 'token' }));
    await store.dispatch(actions.verifyPhone({ token: 'token', phone: '1234567890' }));
    await store.dispatch(actions.resendVerification({ type: 'email', email: 'user@example.com' }));
    await store.dispatch(actions.forgotPassword({ email: 'user@example.com', tenant_id: 'tenant' }));
    await store.dispatch(actions.resetPassword({ token: 'token', new_password: 'Pass123!', confirm_password: 'Pass123!' }));
    await store.dispatch(actions.changePassword({ old_password: 'Pass123!', new_password: 'Pass456!', confirm_password: 'Pass456!' }));
    expect(store.getState().auth.isLoading).toBe(false);
    expect(store.getState().auth.errorCode).toBeNull();
  });

  it('stores error codes on verification failures', async () => {
    const store = createStore();
    verifyEmailUseCase.mockRejectedValueOnce({ code: 'FORBIDDEN' });
    await store.dispatch(actions.verifyEmail({ token: 'token' }));
    expect(store.getState().auth.errorCode).toBe('FORBIDDEN');
  });

  it('clears auth state', () => {
    const state = reducer(
      {
        user: { id: '1' },
        activeFacility: { facilityId: 'f1' },
        requiresActiveFacility: false,
        isAuthenticated: true,
        isLoading: false,
        hasRestoredSession: true,
        sessionStatus: 'authenticated',
        errorCode: 'ERROR',
        sessionErrorCode: 'ERROR',
        lastUpdated: null,
      },
      actions.clearAuth()
    );
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.hasRestoredSession).toBe(true);
    const clearedError = reducer(state, actions.clearAuthError());
    expect(clearedError.errorCode).toBeNull();
  });

  it('marks session expiry without retaining user data', () => {
    const state = reducer(
      {
        user: { id: '1' },
        activeFacility: { facilityId: 'f1' },
        requiresActiveFacility: false,
        isAuthenticated: true,
        isLoading: false,
        hasRestoredSession: true,
        sessionStatus: 'authenticated',
        errorCode: null,
        sessionErrorCode: null,
        lastUpdated: null,
      },
      actions.markSessionExpired({ code: 'SESSION_EXPIRED' })
    );

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.sessionStatus).toBe('expired');
    expect(state.sessionErrorCode).toBe('SESSION_EXPIRED');
  });
});
