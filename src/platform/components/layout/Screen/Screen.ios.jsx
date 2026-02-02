/**
 * Screen Component - iOS
 * Safe-area aware screen wrapper (optionally scrollable)
 * File: Screen.ios.jsx
 */

import React from 'react';
import { StyledContent, StyledRoot, StyledSafeArea } from './Screen.ios.styles';
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
  scroll: _scroll = false,
  safeArea = true,
  padding = PADDING.MD,
  background = BACKGROUNDS.DEFAULT,
  accessibilityLabel,
  accessibilityHint,
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

  const body = (
    <StyledContent padding={resolved.padding} testID={testID ? `${testID}-content` : undefined}>
      {children}
    </StyledContent>
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


