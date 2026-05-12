/**
 * Screen Component - Web
 * Safe-area aware screen wrapper (optionally scrollable)
 * File: Screen.web.jsx
 */

import React, { useRef } from 'react';
import { StyledContent, StyledRoot, StyledScroll } from './Screen.web.styles';
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
  scroll = false,
  safeArea = true,
  padding = PADDING.MD,
  background = BACKGROUNDS.DEFAULT,
  accessibilityLabel,
  accessibilityHint,
  testID,
  className,
  onRefresh,
  refreshing = false,
  ...rest
}) => {
  const touchStartYRef = useRef(null);
  const resolved = useScreen({
    scroll,
    safeArea,
    padding,
    background,
    accessibilityLabel,
    testID,
  });

  const refreshHandlers = onRefresh
    ? {
        onTouchStart: (event) => {
          touchStartYRef.current = event?.touches?.[0]?.clientY ?? null;
        },
        onTouchEnd: (event) => {
          const startY = touchStartYRef.current;
          touchStartYRef.current = null;
          const endY = event?.changedTouches?.[0]?.clientY ?? null;
          if (!refreshing && startY !== null && endY !== null && endY - startY > 80) {
            onRefresh();
          }
        },
      }
    : {};

  const body = (
    <StyledContent
      $scroll={resolved.scroll}
      data-testid={testID ? `${testID}-content` : undefined}
      testID={testID ? `${testID}-content` : undefined}
    >
      {children}
    </StyledContent>
  );

  const content = resolved.scroll ? (
    <StyledScroll
      data-testid={testID ? `${testID}-scroll` : undefined}
      testID={testID ? `${testID}-scroll` : undefined}
      {...refreshHandlers}
    >
      {body}
    </StyledScroll>
  ) : body;

  return (
    <StyledRoot
      safeArea={resolved.safeArea}
      padding={resolved.padding}
      background={resolved.background}
      aria-label={resolved.accessibilityLabel}
      aria-description={accessibilityHint}
      data-testid={testID}
      testID={testID}
      $scroll={resolved.scroll}
      className={className}
      {...rest}
    >
      {content}
    </StyledRoot>
  );
};

export default ScreenWeb;
