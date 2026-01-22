/**
 * Screen Component - iOS
 * Safe-area aware screen wrapper (optionally scrollable)
 * File: Screen.ios.jsx
 */

import React from 'react';
import { RefreshControl } from 'react-native';
import { StyledContent, StyledRoot, StyledSafeArea, StyledScroll } from './Screen.ios.styles';
import useScreen from './useScreen';
import { BACKGROUNDS, PADDING } from './types';

/**
 * Screen component for iOS
 * @param {Object} props - Screen props
 * @param {React.ReactNode} props.children - Screen content
 * @param {boolean} props.scroll - Enable scrolling
 * @param {boolean} props.safeArea - Respect safe area (default true)
 * @param {string} props.padding - Padding scale (none|sm|md|lg)
 * @param {string} props.background - Background (default|surface)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 */
const ScreenIOS = ({
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

  const content = (
    <StyledContent padding={resolved.padding} testID={testID ? `${testID}-content` : undefined}>
      {children}
    </StyledContent>
  );

  const body = resolved.scroll ? (
    <StyledScroll
      testID={testID ? `${testID}-scroll` : undefined}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={Boolean(refreshing)}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
    >
      {content}
    </StyledScroll>
  ) : (
    content
  );

  return (
    <>
      {resolved.safeArea ? (
        <StyledSafeArea>
          <StyledRoot
            background={resolved.background}
            accessibilityLabel={resolved.accessibilityLabel}
            accessibilityHint={accessibilityHint}
            testID={testID}
            {...rest}
          >
            {body}
          </StyledRoot>
        </StyledSafeArea>
      ) : (
        <StyledRoot
          background={resolved.background}
          accessibilityLabel={resolved.accessibilityLabel}
          accessibilityHint={accessibilityHint}
          testID={testID}
          {...rest}
        >
          {body}
        </StyledRoot>
      )}
    </>
  );
};

export default ScreenIOS;


