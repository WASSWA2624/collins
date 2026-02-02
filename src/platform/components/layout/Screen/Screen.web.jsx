/**
 * Screen Component - Web
 * Safe-area aware screen wrapper (optionally scrollable)
 * File: Screen.web.jsx
 */

import React from 'react';
import { StyledContent, StyledRoot } from './Screen.web.styles';
import useScreen from './useScreen';
import { BACKGROUNDS, PADDING } from './types';

/**
 * Screen component for Web
 * @param {Object} props - Screen props
 * @param {React.ReactNode} props.children - Screen content
 * @param {boolean} props.scroll - Enable scrolling
 * @param {boolean} props.safeArea - Respect safe area (default true)
 * @param {string} props.padding - Padding scale (none|sm|md|lg)
 * @param {string} props.background - Background (default|surface)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 */
const ScreenWeb = ({
  children,
  scroll: _scroll = false,
  safeArea = true,
  padding = PADDING.MD,
  background = BACKGROUNDS.DEFAULT,
  accessibilityLabel,
  accessibilityHint,
  testID,
  className,
  ...rest
}) => {
  const resolved = useScreen({
    scroll: false,
    safeArea,
    padding,
    background,
    accessibilityLabel,
    testID,
  });

  return (
    <StyledRoot
      safeArea={resolved.safeArea}
      padding={resolved.padding}
      background={resolved.background}
      aria-label={resolved.accessibilityLabel}
      aria-description={accessibilityHint}
      data-testid={testID}
      className={className}
      {...rest}
    >
      <StyledContent data-testid={testID ? `${testID}-content` : undefined}>
        {children}
      </StyledContent>
    </StyledRoot>
  );
};

export default ScreenWeb;


