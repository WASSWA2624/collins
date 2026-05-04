/**
 * useIcon Hook
 * Shared logic for Icon component across platforms.
 * File: useIcon.js
 */

import { SIZES, TONES } from './types';

/**
 * @param {Object} params
 * @param {string} params.glyph
 * @param {string|number} params.size
 * @param {string} params.tone
 * @param {string} params.accessibilityLabel
 * @param {string} params.accessibilityHint
 * @param {boolean} params.decorative
 */
const useIcon = ({
  glyph,
  size = SIZES.MD,
  tone = TONES.DEFAULT,
  accessibilityLabel,
  accessibilityHint,
  decorative = false,
}) => {
  const isDecorative = Boolean(decorative) || !accessibilityLabel;

  const a11y = isDecorative
    ? {
        accessible: false,
        accessibilityElementsHidden: true,
        importantForAccessibility: 'no-hide-descendants',
      }
    : {
        accessible: true,
        accessibilityRole: 'image',
        accessibilityLabel: accessibilityLabel,
        accessibilityHint: accessibilityHint,
      };

  return {
    glyph,
    size,
    tone,
    a11y,
  };
};

export default useIcon;


