/**
 * Ventilation Slice (Session persistence - local only)
 * Tracks current ventilation assessment session + minimal persisted snapshot.
 * File: ventilation.slice.js
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { handleError } from '@errors';
import { ventilationSession as ventilationSessionStorage } from '@services/storage';

const initialState = {
  currentSessionId: null,
  currentInputs: null,
  lastRecommendationSummary: null,
  isHydrating: false,
  hydratedAt: null,
  errorCode: null,
  sessionHistory: null,
  historyErrorCode: null,
  isHistoryLoading: false,
};

const normalizeErrorCode = (errorOrPayload, fallback = 'UNKNOWN_ERROR') => {
  if (typeof errorOrPayload === 'string' && errorOrPayload.trim()) return errorOrPayload.trim();
  if (errorOrPayload && typeof errorOrPayload === 'object') {
    if (typeof errorOrPayload.code === 'string' && errorOrPayload.code.trim()) return errorOrPayload.code.trim();
    if (typeof errorOrPayload.errorCode === 'string' && errorOrPayload.errorCode.trim()) return errorOrPayload.errorCode.trim();
  }
  return fallback;
};

const hydrateVentilationSession = createAsyncThunk('ventilation/hydrateSession', async (_, { rejectWithValue }) => {
  try {
    const result = await ventilationSessionStorage.loadDraft();
    if (!result.ok) {
      return rejectWithValue({ errorCode: result.errorCode || 'VENTILATION_SESSION_DRAFT_LOAD_FAILED' });
    }
    return result.draft || null;
  } catch (error) {
    const normalized = handleError(error, { scope: 'store.slices.ventilation.hydrate' });
    return rejectWithValue({ errorCode: normalized.code || 'VENTILATION_SESSION_DRAFT_LOAD_FAILED' });
  }
});

const persistVentilationSessionDraft = createAsyncThunk(
  'ventilation/persistDraft',
  async (_, { getState, rejectWithValue }) => {
    try {
      const ventilation = getState()?.ventilation ?? {};
      const sessionId = ventilation?.currentSessionId;
      if (!sessionId) return true;

      const draft = {
        sessionId,
        inputs: ventilation?.currentInputs ?? null,
        recommendationSummary: ventilation?.lastRecommendationSummary ?? null,
        updatedAt: Date.now(),
      };

      const result = await ventilationSessionStorage.saveDraft(draft);
      if (!result.ok) {
        return rejectWithValue({ errorCode: result.errorCode || 'VENTILATION_SESSION_DRAFT_SAVE_FAILED' });
      }
      return true;
    } catch (error) {
      const normalized = handleError(error, { scope: 'store.slices.ventilation.persistDraft' });
      return rejectWithValue({ errorCode: normalized.code || 'VENTILATION_SESSION_DRAFT_SAVE_FAILED' });
    }
  }
);

const clearVentilationSessionDraft = createAsyncThunk(
  'ventilation/clearDraft',
  async (_, { rejectWithValue }) => {
    try {
      const result = await ventilationSessionStorage.clearDraft();
      if (!result.ok) {
        return rejectWithValue({ errorCode: result.errorCode || 'VENTILATION_SESSION_DRAFT_CLEAR_FAILED' });
      }
      return true;
    } catch (error) {
      const normalized = handleError(error, { scope: 'store.slices.ventilation.clearDraft' });
      return rejectWithValue({ errorCode: normalized.code || 'VENTILATION_SESSION_DRAFT_CLEAR_FAILED' });
    }
  }
);

const appendVentilationSessionToHistory = createAsyncThunk(
  'ventilation/appendHistory',
  async (_, { getState, rejectWithValue }) => {
    try {
      const ventilation = getState()?.ventilation ?? {};
      const sessionId = ventilation?.currentSessionId;
      if (!sessionId) return true;

      const entry = {
        sessionId,
        inputs: ventilation?.currentInputs ?? null,
        recommendationSummary: ventilation?.lastRecommendationSummary ?? null,
        updatedAt: Date.now(),
      };

      const result = await ventilationSessionStorage.appendHistory(entry);
      if (!result.ok) {
        return rejectWithValue({ errorCode: result.errorCode || 'VENTILATION_SESSION_HISTORY_SAVE_FAILED' });
      }
      return true;
    } catch (error) {
      const normalized = handleError(error, { scope: 'store.slices.ventilation.appendHistory' });
      return rejectWithValue({ errorCode: normalized.code || 'VENTILATION_SESSION_HISTORY_SAVE_FAILED' });
    }
  }
);

const loadVentilationHistory = createAsyncThunk(
  'ventilation/loadHistory',
  async (_, { rejectWithValue }) => {
    try {
      const result = await ventilationSessionStorage.loadHistory();
      return { history: result.history ?? [], errorCode: result.errorCode ?? null };
    } catch (error) {
      const normalized = handleError(error, { scope: 'store.slices.ventilation.loadHistory' });
      return rejectWithValue({ errorCode: normalized.code || 'VENTILATION_SESSION_HISTORY_LOAD_FAILED' });
    }
  }
);

const removeVentilationSessionFromHistory = createAsyncThunk(
  'ventilation/removeFromHistory',
  async (sessionId, { rejectWithValue }) => {
    try {
      const result = await ventilationSessionStorage.removeHistoryEntry(sessionId);
      if (!result.ok) {
        return rejectWithValue({ errorCode: result.errorCode || 'VENTILATION_SESSION_HISTORY_DELETE_FAILED' });
      }
      return sessionId;
    } catch (error) {
      const normalized = handleError(error, { scope: 'store.slices.ventilation.removeFromHistory' });
      return rejectWithValue({ errorCode: normalized.code || 'VENTILATION_SESSION_HISTORY_DELETE_FAILED' });
    }
  }
);

const ventilationSlice = createSlice({
  name: 'ventilation',
  initialState,
  reducers: {
    startSession: (state, action) => {
      const sessionId = typeof action.payload === 'string' && action.payload.trim() ? action.payload.trim() : null;
      state.currentSessionId = sessionId;
      state.errorCode = null;
    },
    setInputs: (state, action) => {
      const inputs = action.payload;
      state.currentInputs = inputs && typeof inputs === 'object' ? inputs : null;
    },
    setRecommendationSummary: (state, action) => {
      const summary = action.payload;
      state.lastRecommendationSummary = summary && typeof summary === 'object' ? summary : null;
    },
    clearVentilationError: (state) => {
      state.errorCode = null;
    },
    resetSession: (state) => {
      state.currentSessionId = null;
      state.currentInputs = null;
      state.lastRecommendationSummary = null;
      state.errorCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateVentilationSession.pending, (state) => {
        state.isHydrating = true;
        state.errorCode = null;
      })
      .addCase(hydrateVentilationSession.fulfilled, (state, action) => {
        state.isHydrating = false;
        state.hydratedAt = Date.now();
        state.errorCode = null;

        const draft = action.payload;
        if (!draft) {
          state.currentSessionId = null;
          state.currentInputs = null;
          state.lastRecommendationSummary = null;
          return;
        }

        state.currentSessionId = draft.sessionId || null;
        state.currentInputs = draft.inputs ?? null;
        state.lastRecommendationSummary = draft.recommendationSummary ?? null;
      })
      .addCase(hydrateVentilationSession.rejected, (state, action) => {
        state.isHydrating = false;
        state.hydratedAt = Date.now();
        state.errorCode = normalizeErrorCode(action.payload, 'VENTILATION_SESSION_DRAFT_LOAD_FAILED');
      })
      .addCase(persistVentilationSessionDraft.rejected, (state, action) => {
        state.errorCode = normalizeErrorCode(action.payload, 'VENTILATION_SESSION_DRAFT_SAVE_FAILED');
      })
      .addCase(clearVentilationSessionDraft.rejected, (state, action) => {
        state.errorCode = normalizeErrorCode(action.payload, 'VENTILATION_SESSION_DRAFT_CLEAR_FAILED');
      })
      .addCase(appendVentilationSessionToHistory.rejected, (state, action) => {
        state.errorCode = normalizeErrorCode(action.payload, 'VENTILATION_SESSION_HISTORY_SAVE_FAILED');
      })
      .addCase(loadVentilationHistory.pending, (state) => {
        state.isHistoryLoading = true;
        state.historyErrorCode = null;
      })
      .addCase(loadVentilationHistory.fulfilled, (state, action) => {
        state.isHistoryLoading = false;
        state.sessionHistory = action.payload?.history ?? [];
        state.historyErrorCode = action.payload?.errorCode ?? null;
      })
      .addCase(loadVentilationHistory.rejected, (state, action) => {
        state.isHistoryLoading = false;
        state.sessionHistory = [];
        state.historyErrorCode = normalizeErrorCode(action.payload, 'VENTILATION_SESSION_HISTORY_LOAD_FAILED');
      })
      .addCase(removeVentilationSessionFromHistory.fulfilled, (state, action) => {
        const id = action.payload;
        if (Array.isArray(state.sessionHistory)) {
          state.sessionHistory = state.sessionHistory.filter((item) => item.sessionId !== id);
        }
      })
      .addCase(removeVentilationSessionFromHistory.rejected, (state, action) => {
        state.historyErrorCode = normalizeErrorCode(action.payload, 'VENTILATION_SESSION_HISTORY_DELETE_FAILED');
      });
  },
});

const actions = {
  ...ventilationSlice.actions,
  hydrateVentilationSession,
  persistVentilationSessionDraft,
  clearVentilationSessionDraft,
  appendVentilationSessionToHistory,
  loadVentilationHistory,
  removeVentilationSessionFromHistory,
};

const reducer = ventilationSlice.reducer;

export { actions, reducer };
export default { actions, reducer };

