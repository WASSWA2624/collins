/**
 * Ventilation Slice Tests (Session persistence)
 * File: ventilation.slice.test.js
 */
import { configureStore } from '@reduxjs/toolkit';

jest.mock('@services/storage', () => ({
  ventilationSession: {
    loadDraft: jest.fn(),
    saveDraft: jest.fn(),
    clearDraft: jest.fn(),
    appendHistory: jest.fn(),
  },
}));

jest.mock('@errors', () => ({
  handleError: jest.fn((error) => ({ code: error?.code || 'UNKNOWN_ERROR' })),
}));

import { actions, reducer } from '@store/slices/ventilation.slice';
import { ventilationSession } from '@services/storage';

const createStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      ventilation: reducer,
    },
    preloadedState,
  });

describe('ventilation.slice (session persistence)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(1000);
  });

  afterEach(() => {
    Date.now.mockRestore();
  });

  it('has a stable initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      currentSessionId: null,
      currentInputs: null,
      lastRecommendationSummary: null,
      isHydrating: false,
      hydratedAt: null,
      errorCode: null,
    });
  });

  it('is reducer-pure (does not mutate frozen previous state)', () => {
    const prev = Object.freeze(reducer(undefined, { type: 'unknown' }));
    const next = reducer(prev, actions.startSession(' s1 '));
    expect(next.currentSessionId).toBe('s1');
    expect(prev.currentSessionId).toBeNull();
  });

  it('startSession trims and sets id (or null)', () => {
    const a = reducer(undefined, actions.startSession('  abc  '));
    expect(a.currentSessionId).toBe('abc');

    const b = reducer(a, actions.startSession('   '));
    expect(b.currentSessionId).toBeNull();
  });

  it('setInputs and setRecommendationSummary accept objects only', () => {
    const a = reducer(undefined, actions.setInputs({ spo2: 92 }));
    expect(a.currentInputs).toEqual({ spo2: 92 });
    const b = reducer(a, actions.setInputs('nope'));
    expect(b.currentInputs).toBeNull();

    const c = reducer(undefined, actions.setRecommendationSummary({ source: { confidenceTier: 'high' } }));
    expect(c.lastRecommendationSummary).toEqual({ source: { confidenceTier: 'high' } });
    const d = reducer(c, actions.setRecommendationSummary(123));
    expect(d.lastRecommendationSummary).toBeNull();
  });

  it('hydrates to null when no draft exists', async () => {
    ventilationSession.loadDraft.mockResolvedValue({ ok: true, draft: null, errorCode: null });
    const store = createStore();

    await store.dispatch(actions.hydrateVentilationSession());

    const state = store.getState().ventilation;
    expect(state.isHydrating).toBe(false);
    expect(state.hydratedAt).toBe(1000);
    expect(state.currentSessionId).toBeNull();
    expect(state.errorCode).toBeNull();
  });

  it('hydrates fields when a draft exists', async () => {
    ventilationSession.loadDraft.mockResolvedValue({
      ok: true,
      draft: {
        sessionId: 's1',
        inputs: { spo2: 90 },
        recommendationSummary: { source: { confidenceTier: 'medium' } },
        updatedAt: 10,
      },
      errorCode: null,
    });
    const store = createStore();

    await store.dispatch(actions.hydrateVentilationSession());

    const state = store.getState().ventilation;
    expect(state.currentSessionId).toBe('s1');
    expect(state.currentInputs).toEqual({ spo2: 90 });
    expect(state.lastRecommendationSummary).toEqual({ source: { confidenceTier: 'medium' } });
    expect(state.errorCode).toBeNull();
  });

  it('stores error code when hydration detects corruption', async () => {
    ventilationSession.loadDraft.mockResolvedValue({ ok: false, draft: null, errorCode: 'VENTILATION_SESSION_DRAFT_CORRUPT' });
    const store = createStore();

    await store.dispatch(actions.hydrateVentilationSession());

    expect(store.getState().ventilation.errorCode).toBe('VENTILATION_SESSION_DRAFT_CORRUPT');
  });

  it('persistDraft is a no-op when sessionId is missing', async () => {
    const store = createStore();
    await store.dispatch(actions.persistVentilationSessionDraft());
    expect(ventilationSession.saveDraft).not.toHaveBeenCalled();
  });

  it('persistDraft saves current snapshot when sessionId exists', async () => {
    ventilationSession.saveDraft.mockResolvedValue({ ok: true, errorCode: null });
    const store = createStore({
      ventilation: {
        currentSessionId: 's1',
        currentInputs: { spo2: 91 },
        lastRecommendationSummary: { x: 1 },
        isHydrating: false,
        hydratedAt: null,
        errorCode: null,
      },
    });

    await store.dispatch(actions.persistVentilationSessionDraft());

    expect(ventilationSession.saveDraft).toHaveBeenCalledWith({
      sessionId: 's1',
      inputs: { spo2: 91 },
      recommendationSummary: { x: 1 },
      updatedAt: 1000,
    });
  });

  it('sets error code when persistDraft fails', async () => {
    ventilationSession.saveDraft.mockResolvedValue({ ok: false, errorCode: 'VENTILATION_SESSION_DRAFT_SAVE_FAILED' });
    const store = createStore({
      ventilation: {
        currentSessionId: 's1',
        currentInputs: {},
        lastRecommendationSummary: {},
        isHydrating: false,
        hydratedAt: null,
        errorCode: null,
      },
    });

    await store.dispatch(actions.persistVentilationSessionDraft());
    expect(store.getState().ventilation.errorCode).toBe('VENTILATION_SESSION_DRAFT_SAVE_FAILED');
  });

  it('sets error code when clearDraft fails', async () => {
    ventilationSession.clearDraft.mockResolvedValue({ ok: false, errorCode: 'VENTILATION_SESSION_DRAFT_CLEAR_FAILED' });
    const store = createStore();
    await store.dispatch(actions.clearVentilationSessionDraft());
    expect(store.getState().ventilation.errorCode).toBe('VENTILATION_SESSION_DRAFT_CLEAR_FAILED');
  });

  it('appends to history using current snapshot and records failure code', async () => {
    ventilationSession.appendHistory.mockResolvedValue({ ok: false, errorCode: 'VENTILATION_SESSION_HISTORY_SAVE_FAILED' });
    const store = createStore({
      ventilation: {
        currentSessionId: 's1',
        currentInputs: { spo2: 92 },
        lastRecommendationSummary: { y: 2 },
        isHydrating: false,
        hydratedAt: null,
        errorCode: null,
      },
    });

    await store.dispatch(actions.appendVentilationSessionToHistory());
    expect(ventilationSession.appendHistory).toHaveBeenCalledWith({
      sessionId: 's1',
      inputs: { spo2: 92 },
      recommendationSummary: { y: 2 },
      updatedAt: 1000,
    });
    expect(store.getState().ventilation.errorCode).toBe('VENTILATION_SESSION_HISTORY_SAVE_FAILED');
  });
});

