/**
 * LoadingSpinner Component - iOS
 * Indefinite horizontal thin loading spinner (progress-bar style).
 * File: LoadingSpinner.ios.jsx
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useTheme } from 'styled-components/native';
import { StyledContainer, StyledIndicator, StyledSpinner, getTrackWidth } from './LoadingSpinner.ios.styles';
import { useI18n } from '@hooks';
import { SIZES } from './types';

/**
 * Indefinite horizontal thin loading spinner for iOS.
 * @param {Object} props - LoadingSpinner props
 * @param {string} props.size - Bar length (small, medium, large); height stays thin
 * @param {string} props.color - Spinner color (overrides theme default)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const LoadingSpinnerIOS = ({
  size = SIZES.MEDIUM,
  color,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const theme = useTheme();
  const defaultAccessibilityLabel = accessibilityLabel || t('common.loading');
  
  const safeSize = useMemo(() => {
    const allowed = Object.values(SIZES);
    return allowed.includes(size) ? size : SIZES.MEDIUM;
  }, [size]);

  const getColor = () => {
    if (color) return color;
    // Use theme primary color as default
    return theme.colors.primary;
  };

  const trackWidth = useMemo(() => getTrackWidth(safeSize, theme), [safeSize, theme]);
  const indicatorWidth = useMemo(() => Math.max(1, Math.floor(trackWidth / 2)), [trackWidth]);
  const progress = useRef(new Animated.Value(0)).current;

  const translateX = useMemo(() => {
    return progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-indicatorWidth, trackWidth],
    });
  }, [progress, indicatorWidth, trackWidth]);

  useEffect(() => {
    // Avoid keeping Jest processes alive with a never-ending animation loop.
    if (process.env.JEST_WORKER_ID) return undefined;

    progress.setValue(0);
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [progress]);

  return (
    <StyledContainer
      style={style}
      testID={testID}
      accessibilityLabel={defaultAccessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="progressbar"
      {...rest}
    >
      <StyledSpinner size={safeSize}>
        <StyledIndicator color={getColor()} indicatorWidth={indicatorWidth} translateX={translateX} />
      </StyledSpinner>
    </StyledContainer>
  );
};

export default LoadingSpinnerIOS;

