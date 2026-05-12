/**
 * Screen Component - Android
 * Safe-area aware screen wrapper (optionally scrollable)
 * File: Screen.android.jsx
 */

import React from 'react';
import { RefreshControl } from 'react-native';
import { StyledContent, StyledRoot, StyledSafeArea, StyledScroll } from './Screen.android.styles';
import useScreen from './useScreen';
import { BACKGROUNDS, PADDING } from './types';

/**
 * Screen component for Android
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
const ScreenAndroid = ({
  children,
  scroll = false,
  safeArea = true,
  padding = PADDING.MD,
  background = BACKGROUNDS.DEFAULT,
  accessibilityLabel,
  accessibilityHint,
  testID,
  onRefresh,
  refreshing = false,
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

  const body = (
    <StyledContent
      padding={resolved.padding}
      scroll={resolved.scroll}
      testID={testID ? `${testID}-content` : undefined}
    >
      {children}
    </StyledContent>
  );

  const content = resolved.scroll ? (
    <StyledScroll
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        onRefresh
          ? <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} />
          : undefined
      }
      testID={testID ? `${testID}-scroll` : undefined}
    >
      {body}
    </StyledScroll>
  ) : body;

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
            {content}
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
          {content}
        </StyledRoot>
      )}
    </>
  );
};

export default ScreenAndroid;
