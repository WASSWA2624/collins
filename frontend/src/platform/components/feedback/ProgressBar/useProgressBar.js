/**
 * useProgressBar
 * Shared ProgressBar logic
 * File: useProgressBar.js
 */

import { VARIANTS } from './types';

const normalizeFromSet = (value, allowed, fallback) => {
  if (!value) return fallback;
  if (allowed.includes(value)) return value;
  return fallback;
};

const clampValue = (value) => {
  if (typeof value !== 'number') return 0;
  return Math.min(Math.max(value, 0), 100);
};

const useProgressBar = ({
  value = 0,
  variant,
}) => {
  const safeVariant = normalizeFromSet(
    variant,
    Object.values(VARIANTS),
    VARIANTS.PRIMARY
  );
  const clampedValue = clampValue(value);

  return {
    value: clampedValue,
    variant: safeVariant,
  };
};

export default useProgressBar;

