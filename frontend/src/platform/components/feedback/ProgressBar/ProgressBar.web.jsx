/**
 * ProgressBar Component - Web
 * Linear progress indicator
 * File: ProgressBar.web.jsx
 */

import React from 'react';
import { StyledProgressBar, StyledProgressBarTrack, StyledProgressBarFill } from './ProgressBar.web.styles';
import useProgressBar from './useProgressBar';
import { useI18n } from '@hooks';

/**
 * ProgressBar component for Web
 * @param {Object} props - ProgressBar props
 * @param {number} props.value - Progress value (0-100)
 * @param {string} props.variant - ProgressBar variant (primary, success, warning, error)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const ProgressBarWeb = ({
  value = 0,
  variant,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const progressBar = useProgressBar({ value, variant });
  const { t } = useI18n();
  const defaultAccessibilityLabel = accessibilityLabel || t('common.progress', { value: progressBar.value });

  return (
    <StyledProgressBar
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressBar.value}
      aria-label={defaultAccessibilityLabel}
      data-testid={testID}
      className={className}
      style={style}
      {...rest}
    >
      <StyledProgressBarTrack>
        <StyledProgressBarFill variant={progressBar.variant} value={progressBar.value} />
      </StyledProgressBarTrack>
    </StyledProgressBar>
  );
};

export default ProgressBarWeb;

