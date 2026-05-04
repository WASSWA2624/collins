/**
 * useOfflineState
 * Shared OfflineState logic
 * File: useOfflineState.js
 */

import { SIZES } from './types';

const normalizeFromSet = (value, allowed, fallback) => {
  if (!value) return fallback;
  if (allowed.includes(value)) return value;
  return fallback;
};

const useOfflineState = ({
  size,
}) => {
  const safeSize = normalizeFromSet(
    size,
    Object.values(SIZES),
    SIZES.MEDIUM
  );

  return {
    size: safeSize,
  };
};

export { useOfflineState };

