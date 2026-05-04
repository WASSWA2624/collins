/**
 * Text Component - Android
 * Typography component for Android platform
 * File: Text.android.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components (from barrel file) - N/A for Text

// 3. Hooks and utilities (absolute imports via aliases) - N/A for Text

// 4. Styles (relative import - platform-specific)
import { StyledText } from './Text.android.styles';

// 5. Component-specific hook (relative import) - N/A for Text

// 6. Types and constants (relative import)
import { VARIANTS } from './types';

/**
 * Text component for Android
 * @param {Object} props - Text props
 * @param {string} props.variant - Text variant (h1, h2, h3, body, caption, label)
 * @param {string} props.color - Text color (overrides theme default)
 * @param {string} props.align - Text alignment (left, center, right, justify)
 * @param {React.ReactNode} props.children - Text content
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.accessibilityRole - Accessibility role
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const TextAndroid = ({
  variant = VARIANTS.BODY,
  color,
  align,
  children,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  ...rest
}) => {
  // Do not set accessibilityRole on Android - header/text cause native crashes.
  // Rely on accessibilityLabel for screen reader support.

  return (
    <StyledText
      variant={variant}
      color={color}
      align={align}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
      style={style}
      {...rest}
    >
      {children}
    </StyledText>
  );
};

export default TextAndroid;

