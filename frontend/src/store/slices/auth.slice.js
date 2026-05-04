/**
 * Auth Slice
 * Global auth state (user, status, error codes)
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
  verifyEmailUseCase,
  verifyPhoneUseCase,
} from '@features/auth';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  errorCode: null,
  lastUpdated: null,
};

const normalizeErrorCode = (payload) =>
  (typeof payload === 'object' && payload?.code != null ? payload.code : payload) || 'UNKNOWN_ERROR';

const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const user = await loginUseCase(payload);
    return user || null;
  } catch (error) {
    console.error('[AUTH_THUNK_LOGIN_ERROR]', error);
    return rejectWithValue({
      code: error?.code || 'UNKNOWN_ERROR',
      message: error?.message || 'Login failed',
      status: error?.status || 500
    });
  }
});

const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const user = await registerUseCase(payload);
    return user || null;
  } catch (error) {
    console.error('[AUTH_THUNK_REGISTER_ERROR]', error);
    return rejectWithValue({
      code: error?.code || 'UNKNOWN_ERROR',
      message: error?.message || 'Registration failed',
      status: error?.status || 500
    });
  }
});

const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutUseCase();
    return true;
  } catch (error) {
    console.error('[AUTH_THUNK_LOGOUT_ERROR]', error);
    return rejectWithValue({
      code: error?.code || 'UNKNOWN_ERROR',
      message: error?.message || 'Logout failed',
      status: error?.status || 500
    });
  }
});

const refreshSession = createAsyncThunk('auth/refresh', async (_, { rejectWithValue }) => {
  try {
    const tokens = await refreshSessionUseCase();
    return tokens || null;
  } catch (error) {
    console.error('[AUTH_THUNK_REFRESH_ERROR]', error);
    return rejectWithValue({
      code: error?.code || 'UNKNOWN_ERROR',
      message: error?.message || 'Session refresh failed',
      status: error?.status || 500
    });
  }
});

const loadCurrentUser = createAsyncThunk('auth/loadCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const user = await loadCurrentUserUseCase();
    return user || null;
  } catch (error) {
    console.error('[AUTH_THUNK_LOADCURRENTUSER_ERROR]', error);
    return rejectWithValue({
      code: error?.code || 'UNKNOWN_ERROR',
      message: error?.message || 'Failed to load user',
      status: error?.status || 500
    });
  }
});

const verifyEmail = createAsyncThunk('auth/verifyEmail', async (payload, { rejectWithValue }) => {
  try {
    const result = await verifyEmailUseCase(payload);
    return result || null;
  } catch (error) {
    console.error('[AUTH_THUNK_VERIFYEMAIL_ERROR]', error);
    return rejectWithValue({
      code: error?.code || 'UNKNOWN_ERROR',
      message: error?.message || 'Email verification failed',
      status: error?.status || 500
    });
  }
});

const verifyPhone = createAsyncThunk('auth/verifyPhone', async (payload, { rejectWithValue }) => {
  try {
    const result = await verifyPhoneUseCase(payload);
    return result || null;
  } catch (error) {
    console.error('[AUTH_THUNK_VERIFYPHONE_ERROR]', error);
    return rejectWithValue({
      code: error?.code || 'UNKNOWN_ERROR',
      message: error?.message || 'Phone verification failed',
      status: error?.status || 500
    });
  }
});

const resendVerification = createAsyncThunk('auth/resendVerification', async (payload, { rejectWithValue }) => {
  try {
    const result = await resendVerificationUseCase(payload);
    return result || null;
  } catch (error) {
    console.error('[AUTH_THUNK_RESENDVERIFICATION_ERROR]', error);
    return rejectWithValue({
      code: error?.code || 'UNKNOWN_ERROR',
      message: error?.message || 'Resend verification failed',
      status: error?.status || 500
    });
  }
});

const forgotPassword = createAsyncThunk('auth/forgotPassword', async (payload, { rejectWithValue }) => {
  try {
    const result = await forgotPasswordUseCase(payload);
    return result || null;
  } catch (error) {
    console.error('[AUTH_THUNK_FORGOTPASSWORD_ERROR]', error);
    return rejectWithValue({
      code: error?.code || 'UNKNOWN_ERROR',
      message: error?.message || 'Password reset request failed',
      status: error?.status || 500
    });
  }
});

const resetPassword = createAsyncThunk('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    const result = await resetPasswordUseCase(payload);
    return result || null;
  } catch (error) {
    console.error('[AUTH_THUNK_RESETPASSWORD_ERROR]', error);
    return rejectWithValue({
      code: error?.code || 'UNKNOWN_ERROR',
      message: error?.message || 'Password reset failed',
      status: error?.status || 500
    });
  }
});

const changePassword = createAsyncThunk('auth/changePassword', async (payload, { rejectWithValue }) => {
  try {
    const result = await changePasswordUseCase(payload);
    return result || null;
  } catch (error) {
    return rejectWithValue(error?.code || 'UNKNOWN_ERROR');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.errorCode = null;
    },
    clearAuthError: (state) => {
      state.errorCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.lastUpdated = Date.now();
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.lastUpdated = Date.now();
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
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.lastUpdated = Date.now();
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(refreshSession.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(refreshSession.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
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
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.lastUpdated = Date.now();
      })
      .addCase(loadCurrentUser.rejected, (state, action) => {
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
  verifyEmail,
  verifyPhone,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
};
const reducer = authSlice.reducer;

export { actions, reducer };
export default { actions, reducer };
