/**
 * Icon Component - Android
 * Token-driven glyph icon (no external icon dependency).
 * File: Icon.android.jsx
 */

import React from 'react';
import { StyledIconText } from './Icon.android.styles';
import useIcon from './useIcon';
import { SIZES, TONES } from './types';

/**
 * Icon component for Android.
 *
 * Note:
 * - `glyph` is the rendered character (emoji, icon-font glyph, or symbol).
 * - If `decorative` is true, the icon is hidden from accessibility.
 *
 * @param {Object} props
 * @param {string} props.glyph
 * @param {string|number} props.size
 * @param {string} props.tone
 * @param {boolean} props.decorative
 * @param {string} props.accessibilityLabel
 * @param {string} props.accessibilityHint
 * @param {string} props.testID
 * @param {Object} props.style
 */
const IconAndroid = ({
  glyph,
  size = SIZES.MD,
  tone = TONES.DEFAULT,
  decorative = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  ...rest
}) => {
  const { a11y } = useIcon({
    glyph,
    size,
    tone,
    decorative,
    accessibilityLabel,
    accessibilityHint,
  });

  return (
    <StyledIconText
      size={size}
      tone={tone}
      testID={testID}
      style={style}
      {...a11y}
      {...rest}
    >
      {glyph}
    </StyledIconText>
  );
};

export default IconAndroid;


