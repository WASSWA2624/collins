/**
 * Icon Component - Web
 * Token-driven glyph icon (no external icon dependency).
 * File: Icon.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 4. Styles (relative import - platform-specific)
import { StyledIcon } from './Icon.web.styles';

// 5. Component-specific hook (relative import)
import useIcon from './useIcon';

// 6. Types and constants (relative import)
import { SIZES, TONES } from './types';

/**
 * Icon component for Web.
 *
 * a11y:
 * - Decorative icons are hidden via `aria-hidden`.
 * - Meaningful icons use `role="img"` + `aria-label`.
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
const IconWeb = ({
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

  const isDecorative = Boolean(a11y.accessible) === false;

  return (
    <StyledIcon
      size={size}
      tone={tone}
      data-testid={testID}
      style={style}
      aria-hidden={isDecorative ? 'true' : undefined}
      role={!isDecorative ? 'img' : undefined}
      aria-label={!isDecorative ? accessibilityLabel : undefined}
      title={accessibilityHint}
      {...rest}
    >
      {glyph}
    </StyledIcon>
  );
};

export default IconWeb;


