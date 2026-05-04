/**
 * useErrorState
 * Shared ErrorState logic
 * File: useErrorState.js
 */

import { SIZES } from './types';

const normalizeFromSet = (value, allowed, fallback) => {
  if (!value) return fallback;
  if (allowed.includes(value)) return value;
  return fallback;
};

const useErrorState = ({
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

export { useErrorState };

