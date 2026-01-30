/**
 * LoadingSpinner Component - Web
 * Indefinite horizontal thin loading spinner (progress-bar style).
 * File: LoadingSpinner.web.jsx
 */

import React from 'react';
import { StyledContainer, StyledSpinner } from './LoadingSpinner.web.styles';
import { useI18n } from '@hooks';
import { SIZES } from './types';

/**
 * Indefinite horizontal thin loading spinner for Web.
 * @param {Object} props - LoadingSpinner props
 * @param {string} props.size - Bar length (small, medium, large); height stays thin
 * @param {string} props.color - Spinner color (overrides theme default)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const LoadingSpinnerWeb = ({
  size = SIZES.MEDIUM,
  color,
  accessibilityLabel,
  accessibilityHint,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const defaultAccessibilityLabel = accessibilityLabel || t('common.loading');
  
  return (
    <StyledContainer
      style={style}
      className={className}
      testID={testID}
      role="status"
      aria-label={defaultAccessibilityLabel}
      aria-live="polite"
      aria-description={accessibilityHint}
      data-testid={testID}
      {...rest}
    >
      <StyledSpinner size={size} color={color} />
    </StyledContainer>
  );
};

export default LoadingSpinnerWeb;

