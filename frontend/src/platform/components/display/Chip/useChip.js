/**
 * useChip
 * Shared Chip logic
 * File: useChip.js
 */

import { VARIANTS, SIZES } from './types';

const normalizeFromSet = (value, allowed, fallback) => {
  if (!value) return fallback;
  if (allowed.includes(value)) return value;
  return fallback;
};

const useChip = ({
  variant,
  size,
  onPress,
  removable,
  onRemove,
}) => {
  const safeVariant = normalizeFromSet(
    variant,
    Object.values(VARIANTS),
    VARIANTS.DEFAULT
  );
  const safeSize = normalizeFromSet(
    size,
    Object.values(SIZES),
    SIZES.MEDIUM
  );

  return {
    variant: safeVariant,
    size: safeSize,
    isInteractive: Boolean(onPress),
    isRemovable: Boolean(removable && onRemove),
    onPress: onPress || undefined,
    onRemove: onRemove || undefined,
  };
};

export { useChip };

