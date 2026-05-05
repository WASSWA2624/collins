/**
 * Review Slice
 * Reviewer queue state.
 * File: review.slice.js
 */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { listReviewQueueUseCase, saveReviewActionUseCase } from '@features/review';

const initialState = {
  items: [],
  meta: {
    total: 0,
    page: 1,
    limit: 20,
    hasNextPage: false,
  },
  filters: {
    entityType: '',
    facilityId: null,
  },
  isLoading: false,
  actionLoadingById: {},
  errorCode: null,
  lastUpdated: null,
};

const normalizeErrorCode = (payload) =>
  (typeof payload === 'object' && payload?.code != null ? payload.code : payload) || 'UNKNOWN_ERROR';

const loadReviewQueue = createAsyncThunk('review/loadQueue', async (params = {}, { rejectWithValue }) => {
  try {
    return await listReviewQueueUseCase(params);
  } catch (error) {
    return rejectWithValue({
      code: error?.code || 'REVIEW_QUEUE_LOAD_FAILED',
      message: error?.message || 'Review queue failed to load',
      status: error?.status || 500,
    });
  }
});

const saveReviewAction = createAsyncThunk('review/saveAction', async (payload = {}, { rejectWithValue }) => {
  try {
    return await saveReviewActionUseCase(payload);
  } catch (error) {
    return rejectWithValue({
      code: error?.code || 'REVIEW_ACTION_FAILED',
      message: error?.message || 'Review action failed',
      status: error?.status || 500,
      entityId: payload.entityId,
    });
  }
});

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    setReviewFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...(action.payload || {}),
      };
    },
    clearReviewError: (state) => {
      state.errorCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadReviewQueue.pending, (state, action) => {
        state.isLoading = true;
        state.errorCode = null;
        state.filters = {
          ...state.filters,
          entityType: action.meta.arg?.entityType || '',
          facilityId: action.meta.arg?.facilityId || null,
        };
      })
      .addCase(loadReviewQueue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.items || [];
        state.meta = {
          ...state.meta,
          ...(action.payload?.meta || {}),
        };
        state.lastUpdated = Date.now();
      })
      .addCase(loadReviewQueue.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(saveReviewAction.pending, (state, action) => {
        const entityId = action.meta.arg?.entityId;
        if (entityId) state.actionLoadingById[entityId] = true;
        state.errorCode = null;
      })
      .addCase(saveReviewAction.fulfilled, (state, action) => {
        const entityId = action.meta.arg?.entityId;
        if (entityId) delete state.actionLoadingById[entityId];
        state.items = state.items.filter((item) => item.entityId !== entityId);
        state.lastUpdated = Date.now();
        if (state.meta.total > 0) state.meta.total -= 1;
      })
      .addCase(saveReviewAction.rejected, (state, action) => {
        const entityId = action.payload?.entityId || action.meta.arg?.entityId;
        if (entityId) delete state.actionLoadingById[entityId];
        state.errorCode = normalizeErrorCode(action.payload);
      });
  },
});

const actions = {
  ...reviewSlice.actions,
  loadReviewQueue,
  saveReviewAction,
};
const reducer = reviewSlice.reducer;

export { actions, reducer };
export default { actions, reducer };
