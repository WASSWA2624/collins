/**
 * useBadge
 * Shared Badge logic (normalize props)
 * File: useBadge.js
 */

import { SIZES, SIZE_KEYS, VARIANTS, VARIANT_KEYS } from './types';

const normalizeFromSet = (value, allowed, fallback) => {
  if (!value) return fallback;
  if (allowed.includes(value)) return value;
  return fallback;
};

const getLabelFromChildren = (children) => {
  if (children === null || children === undefined) return undefined;
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  return undefined;
};

const useBadge = ({
  variant,
  size,
  children,
  accessibilityLabel,
}) => {
  const safeVariant = normalizeFromSet(variant, VARIANT_KEYS, VARIANTS.PRIMARY);
  const safeSize = normalizeFromSet(size, SIZE_KEYS, SIZES.MEDIUM);
  const fallbackLabel = getLabelFromChildren(children);

  return {
    variant: safeVariant,
    size: safeSize,
    accessibilityLabel: accessibilityLabel || fallbackLabel,
  };
};

export { useBadge };


