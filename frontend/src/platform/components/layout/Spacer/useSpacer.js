/**
 * useSpacer
 * Shared Spacer logic
 * File: useSpacer.js
 */

import { AXIS, AXIS_KEYS, SPACING, SPACING_KEYS } from './types';

const normalizeFromSet = (value, allowed, fallback) => {
  if (!value) return fallback;
  if (allowed.includes(value)) return value;
  return fallback;
};

const useSpacer = ({ axis, size }) => {
  const safeAxis = normalizeFromSet(axis, AXIS_KEYS, AXIS.VERTICAL);
  const safeSize = normalizeFromSet(size, SPACING_KEYS, SPACING.MD);

  return {
    axis: safeAxis,
    size: safeSize,
  };
};

export { useSpacer };


