/**
 * useEmptyState
 * Shared EmptyState logic
 * File: useEmptyState.js
 */

import { SIZES } from './types';

const normalizeFromSet = (value, allowed, fallback) => {
  if (!value) return fallback;
  if (allowed.includes(value)) return value;
  return fallback;
};

const useEmptyState = ({
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

export { useEmptyState };

