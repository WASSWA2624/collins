/**
 * Auth Slice
 * Single Redux owner for auth and session state.
 * File: auth.slice.js
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  changePasswordUseCase,
  forgotPasswordUseCase,
  loadCurrentUserUseCase,
  loginUseCase,
  logoutUseCase,
  refreshSessionUseCase,
  registerUseCase,
  resendVerificationUseCase,
  resetPasswordUseCase,
  restoreSessionUseCase,
  selectActiveFacilityUseCase,
  verifyEmailUseCase,
  verifyPhoneUseCase,
} from '@features/auth';

const SESSION_STATUS = {
  IDLE: 'idle',
  RESTORING: 'restoring',
  AUTHENTICATING: 'authenticating',
  AUTHENTICATED: 'authenticated',
  FACILITY_REQUIRED: 'facilityRequired',
  UNAUTHENTICATED: 'unauthenticated',
  EXPIRED: 'expired',
  ERROR: 'error',
};

const initialState = {
  user: null,
  activeFacility: null,
  requiresActiveFacility: false,
  isAuthenticated: false,
  isLoading: false,
  hasRestoredSession: false,
  sessionStatus: SESSION_STATUS.IDLE,
  errorCode: null,
  sessionErrorCode: null,
  lastUpdated: null,
};

const normalizeErrorCode = (payload) =>
  (typeof payload === 'object' && payload?.code != null ? payload.code : payload) || 'UNKNOWN_ERROR';

const toRejectedAuthPayload = (error, fallbackMessage) => ({
  code: error?.code || 'UNKNOWN_ERROR',
  message: error?.message || fallbackMessage,
  status: error?.status || 500,
});

const getMemberships = (user) => (Array.isArray(user?.memberships) ? user.memberships : []);

const getActiveFacility = (user) => user?.activeFacility || null;

const userRequiresActiveFacility = (user) => {
  if (!user) return false;
  if (getActiveFacility(user)) return false;
  return getMemberships(user).some((membership) => membership?.status === 'APPROVED' && membership?.facilityId);
};

const applyUnauthenticatedState = (state, status = SESSION_STATUS.UNAUTHENTICATED) => {
  state.user = null;
  state.activeFacility = null;
  state.requiresActiveFacility = false;
  state.isAuthenticated = false;
  state.isLoading = false;
  state.sessionStatus = status;
  state.lastUpdated = Date.now();
};

const applyUserState = (state, user) => {
  const activeFacility = getActiveFacility(user);
  const requiresActiveFacility = userRequiresActiveFacility(user);

  state.user = user || null;
  state.activeFacility = activeFacility;
  state.requiresActiveFacility = requiresActiveFacility;
  state.isAuthenticated = Boolean(user);
  state.isLoading = false;
  state.sessionStatus = !user
    ? SESSION_STATUS.UNAUTHENTICATED
    : requiresActiveFacility
      ? SESSION_STATUS.FACILITY_REQUIRED
      : SESSION_STATUS.AUTHENTICATED;
  state.lastUpdated = Date.now();
};

const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const user = await loginUseCase(payload);
    return user || null;
  } catch (error) {
    return rejectWithValue(toRejectedAuthPayload(error, 'Login failed'));
  }
});

const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const user = await registerUseCase(payload);
    return user || null;
  } catch (error) {
    return rejectWithValue(toRejectedAuthPayload(error, 'Registration failed'));
  }
});

const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutUseCase();
    return true;
  } catch (error) {
    return rejectWithValue(toRejectedAuthPayload(error, 'Logout failed'));
  }
});

const refreshSession = createAsyncThunk('auth/refresh', async (payload, { rejectWithValue }) => {
  try {
    const tokens = await refreshSessionUseCase(payload);
    return tokens || null;
  } catch (error) {
    return rejectWithValue(toRejectedAuthPayload(error, 'Session refresh failed'));
  }
});

const loadCurrentUser = createAsyncThunk('auth/loadCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const user = await loadCurrentUserUseCase();
    return user || null;
  } catch (error) {
    return rejectWithValue(toRejectedAuthPayload(error, 'Failed to load user'));
  }
});

const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    const user = await restoreSessionUseCase();
    return user || null;
  } catch (error) {
    return rejectWithValue(toRejectedAuthPayload(error, 'Session restore failed'));
  }
});

const selectActiveFacility = createAsyncThunk('auth/selectActiveFacility', async (payload, { rejectWithValue }) => {
  try {
    const user = await selectActiveFacilityUseCase(payload);
    return user || null;
  } catch (error) {
    return rejectWithValue(toRejectedAuthPayload(error, 'Facility selection failed'));
  }
});

const verifyEmail = createAsyncThunk('auth/verifyEmail', async (payload, { rejectWithValue }) => {
  try {
    const result = await verifyEmailUseCase(payload);
    return result || null;
  } catch (error) {
    return rejectWithValue(toRejectedAuthPayload(error, 'Email verification failed'));
  }
});

const verifyPhone = createAsyncThunk('auth/verifyPhone', async (payload, { rejectWithValue }) => {
  try {
    const result = await verifyPhoneUseCase(payload);
    return result || null;
  } catch (error) {
    return rejectWithValue(toRejectedAuthPayload(error, 'Phone verification failed'));
  }
});

const resendVerification = createAsyncThunk('auth/resendVerification', async (payload, { rejectWithValue }) => {
  try {
    const result = await resendVerificationUseCase(payload);
    return result || null;
  } catch (error) {
    return rejectWithValue(toRejectedAuthPayload(error, 'Resend verification failed'));
  }
});

const forgotPassword = createAsyncThunk('auth/forgotPassword', async (payload, { rejectWithValue }) => {
  try {
    const result = await forgotPasswordUseCase(payload);
    return result || null;
  } catch (error) {
    return rejectWithValue(toRejectedAuthPayload(error, 'Password reset request failed'));
  }
});

const resetPassword = createAsyncThunk('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    const result = await resetPasswordUseCase(payload);
    return result || null;
  } catch (error) {
    return rejectWithValue(toRejectedAuthPayload(error, 'Password reset failed'));
  }
});

const changePassword = createAsyncThunk('auth/changePassword', async (payload, { rejectWithValue }) => {
  try {
    const result = await changePasswordUseCase(payload);
    return result || null;
  } catch (error) {
    return rejectWithValue(toRejectedAuthPayload(error, 'Password change failed'));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      applyUnauthenticatedState(state);
      state.errorCode = null;
      state.sessionErrorCode = null;
      state.hasRestoredSession = true;
    },
    clearAuthError: (state) => {
      state.errorCode = null;
      state.sessionErrorCode = null;
    },
    markSessionExpired: (state, action) => {
      applyUnauthenticatedState(state, SESSION_STATUS.EXPIRED);
      state.hasRestoredSession = true;
      state.errorCode = normalizeErrorCode(action.payload) || 'SESSION_EXPIRED';
      state.sessionErrorCode = state.errorCode;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
        state.sessionStatus = SESSION_STATUS.RESTORING;
        state.errorCode = null;
        state.sessionErrorCode = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.hasRestoredSession = true;
        applyUserState(state, action.payload);
        state.errorCode = null;
        state.sessionErrorCode = null;
      })
      .addCase(restoreSession.rejected, (state, action) => {
        const code = normalizeErrorCode(action.payload);
        applyUnauthenticatedState(
          state,
          code === 'NETWORK_ERROR' ? SESSION_STATUS.ERROR : SESSION_STATUS.EXPIRED
        );
        state.hasRestoredSession = true;
        state.errorCode = code;
        state.sessionErrorCode = code;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.sessionStatus = SESSION_STATUS.AUTHENTICATING;
        state.errorCode = null;
        state.sessionErrorCode = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.hasRestoredSession = true;
        applyUserState(state, action.payload);
        state.errorCode = null;
        state.sessionErrorCode = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.sessionStatus = SESSION_STATUS.UNAUTHENTICATED;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.hasRestoredSession = true;
        applyUserState(state, action.payload);
        state.errorCode = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(logout.fulfilled, (state) => {
        applyUnauthenticatedState(state);
        state.hasRestoredSession = true;
        state.errorCode = null;
        state.sessionErrorCode = null;
      })
      .addCase(logout.rejected, (state, action) => {
        applyUnauthenticatedState(state);
        state.hasRestoredSession = true;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(refreshSession.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(refreshSession.fulfilled, (state) => {
        state.isLoading = false;
        state.hasRestoredSession = true;
        state.lastUpdated = Date.now();
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(loadCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.hasRestoredSession = true;
        applyUserState(state, action.payload);
        state.errorCode = null;
      })
      .addCase(loadCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(selectActiveFacility.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(selectActiveFacility.fulfilled, (state, action) => {
        state.hasRestoredSession = true;
        applyUserState(state, action.payload);
        state.errorCode = null;
        state.sessionErrorCode = null;
      })
      .addCase(selectActiveFacility.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(verifyPhone.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(verifyPhone.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(verifyPhone.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(resendVerification.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      });
  },
});

const actions = {
  ...authSlice.actions,
  login,
  register,
  logout,
  refreshSession,
  loadCurrentUser,
  restoreSession,
  selectActiveFacility,
  verifyEmail,
  verifyPhone,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
};
const reducer = authSlice.reducer;

export { actions, reducer, SESSION_STATUS };
export default { actions, reducer, SESSION_STATUS };

