/**
 * useAvatar Hook
 * Shared Avatar logic (initials, image resolution, a11y label, fallback on load error)
 * File: useAvatar.js
 */

import { useState } from 'react';
import { SIZES } from './types';

/**
 * Build initials from a display name.
 * @param {string} name
 * @returns {string}
 */
const getInitials = (name) => {
  if (typeof name !== 'string') return '?';
  const trimmed = name.trim().replace(/\s+/g, ' ');
  if (!trimmed) return '?';

  const parts = trimmed.split(' ');
  if (parts.length >= 2) {
    // After trim/normalize, parts[0] and parts[parts.length - 1] are guaranteed to be non-empty strings
    // Therefore parts[0][0] and parts[parts.length - 1][0] always exist
    const first = parts[0][0];
    const last = parts[parts.length - 1][0];
    const combined = `${first}${last}`;
    return combined.toUpperCase();
  }

  return trimmed.substring(0, 2).toUpperCase();
};

/**
 * Shared Avatar logic hook.
 * @param {Object} params
 * @param {string} params.size
 * @param {string|Object} params.source
 * @param {string} params.name
 * @param {string} params.alt
 * @param {string} params.accessibilityLabel
 * @returns {Object}
 */
const useAvatar = ({ size, source, name, alt, accessibilityLabel }) => {
  const [hasImageError, setHasImageError] = useState(false);

  const normalizedSize = size || SIZES.MEDIUM;
  const label = accessibilityLabel || alt || name || undefined;

  const imageSource = typeof source === 'string' ? { uri: source } : source;
  const hasImage = !!source && !hasImageError;
  const initials = getInitials(name);

  const handleImageError = () => setHasImageError(true);

  return {
    size: normalizedSize,
    label,
    hasImage,
    imageSource,
    initials,
    handleImageError,
  };
};

export default useAvatar;
export { getInitials };


