/**
 * Skeleton Component - iOS
 * Loading placeholder
 * File: Skeleton.ios.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components (from barrel file) - N/A for Skeleton

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import { StyledSkeleton } from './Skeleton.ios.styles';

// 5. Component-specific hook (relative import) - N/A for Skeleton

// 6. Types and constants (relative import)
import { VARIANTS } from './types';

/**
 * Skeleton component for iOS
 * @param {Object} props - Skeleton props
 * @param {string} props.variant - Skeleton variant (text, circular, rectangular)
 * @param {number} props.width - Width (for rectangular/circular)
 * @param {number} props.height - Height (for rectangular/circular)
 * @param {number} props.lines - Number of lines (for text variant)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const SkeletonIOS = ({
  variant = VARIANTS.TEXT,
  width,
  height,
  lines = 1,
  accessibilityLabel,
  testID,
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
            accessibilityRole="none"
            accessibilityLabel={accessibilityLabel}
            testID={testID ? `${testID}-line-${index}` : undefined}
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
      accessibilityRole="none"
      accessibilityLabel={accessibilityLabel || t('common.loadingPlaceholder')}
      testID={testID}
      style={style}
      {...rest}
    />
  );
};

export default SkeletonIOS;

