/**
 * ProgressBar Component - iOS
 * Linear progress indicator
 * File: ProgressBar.ios.jsx
 */

import React from 'react';
import { StyledProgressBar, StyledProgressBarTrack, StyledProgressBarFill } from './ProgressBar.ios.styles';
import useProgressBar from './useProgressBar';
import { useI18n } from '@hooks';

/**
 * ProgressBar component for iOS
 * @param {Object} props - ProgressBar props
 * @param {number} props.value - Progress value (0-100)
 * @param {string} props.variant - ProgressBar variant (primary, success, warning, error)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const ProgressBarIOS = ({
  value = 0,
  variant,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const progressBar = useProgressBar({ value, variant });
  const { t } = useI18n();
  const defaultAccessibilityLabel = accessibilityLabel || t('common.progress', { value: progressBar.value });

  return (
    <StyledProgressBar
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: progressBar.value }}
      accessibilityLabel={defaultAccessibilityLabel}
      testID={testID}
      style={style}
      {...rest}
    >
      <StyledProgressBarTrack>
        <StyledProgressBarFill variant={progressBar.variant} value={progressBar.value} />
      </StyledProgressBarTrack>
    </StyledProgressBar>
  );
};

export default ProgressBarIOS;

