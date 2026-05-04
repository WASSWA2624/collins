/**
 * Skeleton Component - Web
 * Loading placeholder
 * File: Skeleton.web.jsx
 */

import React from 'react';
import { useI18n } from '@hooks';
import { StyledSkeleton } from './Skeleton.web.styles';
import { VARIANTS } from './types';

/**
 * Skeleton component for Web
 * @param {Object} props - Skeleton props
 * @param {string} props.variant - Skeleton variant (text, circular, rectangular)
 * @param {number} props.width - Width (for rectangular/circular)
 * @param {number} props.height - Height (for rectangular/circular)
 * @param {number} props.lines - Number of lines (for text variant)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const SkeletonWeb = ({
  variant = VARIANTS.TEXT,
  width,
  height,
  lines = 1,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const lineCount = Math.max(1, lines || 1);
  
  if (variant === VARIANTS.TEXT) {
    return (
      <>
        {Array.from({ length: lineCount }).map((_, index) => (
          <StyledSkeleton
            key={index}
            variant={variant}
            width={width || '100%'}
            height={height}
            role="presentation"
            aria-label={accessibilityLabel}
            aria-hidden="true"
            data-testid={testID ? `${testID}-line-${index}` : undefined}
            className={className}
            style={style}
            isLastLine={index === lineCount - 1}
            {...rest}
          />
        ))}
      </>
    );
  }

  return (
    <StyledSkeleton
      variant={variant}
      width={width}
      height={height}
      role="presentation"
      aria-label={accessibilityLabel || t('common.loadingPlaceholder')}
      aria-hidden="true"
      data-testid={testID}
      className={className}
      style={style}
      {...rest}
    />
  );
};

export default SkeletonWeb;

