/**
 * useStack
 * Shared Stack logic
 * File: useStack.js
 */

import { DIRECTION_KEYS, DIRECTIONS, SPACING_KEYS, SPACING } from './types';

const normalizeFromSet = (value, allowed, fallback) => {
  if (!value) return fallback;
  if (allowed.includes(value)) return value;
  return fallback;
};

const useStack = ({
  direction,
  spacing,
  align,
  justify,
  wrap,
}) => {
  const safeDirection = normalizeFromSet(direction, DIRECTION_KEYS, DIRECTIONS.VERTICAL);
  const safeSpacing = normalizeFromSet(spacing, SPACING_KEYS, SPACING.MD);

  return {
    direction: safeDirection,
    spacing: safeSpacing,
    align,
    justify,
    wrap: Boolean(wrap),
  };
};

export { useStack };


