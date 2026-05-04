/**
 * useAsyncState Hook
 * Standard async state shape: loading + errorCode + data.
 * File: useAsyncState.js
 */
import { useCallback, useReducer } from 'react';

const DEFAULT_ERROR_CODE = 'UNKNOWN_ERROR';

const toErrorCode = (value) => {
  if (typeof value === 'string' && value.trim()) return value.trim();
  return DEFAULT_ERROR_CODE;
};

const initialState = {
  isLoading: false,
  errorCode: null,
  data: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'START':
      return { ...state, isLoading: true, errorCode: null };
    case 'SUCCEED':
      return { ...state, isLoading: false, errorCode: null, data: action.data ?? null };
    case 'FAIL':
      return { ...state, isLoading: false, errorCode: toErrorCode(action.errorCode) };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const useAsyncState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const start = useCallback(() => dispatch({ type: 'START' }), []);
  const succeed = useCallback((data) => dispatch({ type: 'SUCCEED', data }), []);
  const fail = useCallback((errorCode) => dispatch({ type: 'FAIL', errorCode }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    isLoading: state.isLoading,
    errorCode: state.errorCode,
    data: state.data,
    start,
    succeed,
    fail,
    reset,
  };
};

export default useAsyncState;

