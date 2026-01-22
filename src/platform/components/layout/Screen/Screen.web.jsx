/**
 * Screen Component - Web
 * Safe-area aware screen wrapper (optionally scrollable)
 * File: Screen.web.jsx
 */

import React, { useCallback, useRef } from 'react';
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
  refreshing = false,
  onRefresh,
  testID,
  className,
  ...rest
}) => {
  const resolved = useScreen({
    scroll,
    safeArea,
    padding,
    background,
    accessibilityLabel,
    testID,
  });

  const pullStateRef = useRef({
    startY: 0,
    isPulling: false,
    shouldTrigger: false,
  });
  const canRefresh = typeof onRefresh === 'function';
  const refreshThreshold = 80;

  const handleTouchStart = useCallback(
    (event) => {
      if (!canRefresh || refreshing) return;
      const target = event.currentTarget;
      if (target && target.scrollTop > 0) return;
      const touch = event.touches?.[0];
      if (!touch) return;
      pullStateRef.current = {
        startY: touch.clientY,
        isPulling: true,
        shouldTrigger: false,
      };
    },
    [canRefresh, refreshing]
  );

  const handleTouchMove = useCallback((event) => {
    if (!pullStateRef.current.isPulling) return;
    const touch = event.touches?.[0];
    if (!touch) return;
    const distance = touch.clientY - pullStateRef.current.startY;
    if (distance > refreshThreshold) {
      pullStateRef.current.shouldTrigger = true;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const { isPulling, shouldTrigger } = pullStateRef.current;
    pullStateRef.current = { startY: 0, isPulling: false, shouldTrigger: false };
    if (canRefresh && !refreshing && isPulling && shouldTrigger) {
      onRefresh();
    }
  }, [canRefresh, onRefresh, refreshing]);

  const content = (
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
      {resolved.scroll ? (
        <StyledScroll
          data-testid={testID ? `${testID}-scroll` : undefined}
          aria-busy={refreshing || undefined}
          onTouchStart={canRefresh ? handleTouchStart : undefined}
          onTouchMove={canRefresh ? handleTouchMove : undefined}
          onTouchEnd={canRefresh ? handleTouchEnd : undefined}
          onTouchCancel={canRefresh ? handleTouchEnd : undefined}
        >
          <StyledContent data-testid={testID ? `${testID}-content` : undefined}>
            {children}
          </StyledContent>
        </StyledScroll>
      ) : (
        children
      )}
    </StyledRoot>
  );

  return content;
};

export default ScreenWeb;


