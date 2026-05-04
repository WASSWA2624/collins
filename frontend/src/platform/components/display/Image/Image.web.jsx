/**
 * Image Component - Web
 * Optimized image component for Web platform
 * File: Image.web.jsx
 */
// 1. External dependencies
import React from 'react';
import { useTheme } from 'styled-components';

// 2. Platform components (direct import to avoid require cycle)
import Text from '@platform/components/display/Text';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import { StyledContainer, StyledImage, StyledPlaceholder, StyledErrorContainer, StyledSpinner } from './Image.web.styles';

// 5. Component-specific hook (relative import)
import useImage from './useImage';

/**
 * Image component for Web
 * @param {Object} props - Image props
 * @param {string} props.source - Image source URI
 * @param {string} props.fallback - Fallback image source
 * @param {React.ReactNode} props.placeholder - Placeholder component
 * @param {React.ReactNode} props.errorComponent - Error component
 * @param {string} props.resizeMode - Resize mode (cover, contain, stretch, repeat, center)
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 * @param {boolean} props.lazy - Enable lazy loading (default: true)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {Function} props.onLoad - Load handler
 * @param {Function} props.onError - Error handler
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const ImageWeb = ({
  source,
  fallback,
  placeholder,
  errorComponent,
  resizeMode = 'cover',
  width,
  height,
  lazy = true,
  accessibilityLabel,
  accessibilityHint,
  testID,
  onLoad,
  onError,
  className,
  style,
  ...rest
}) => {
  const { isLoading, hasError, currentSource, handleLoad, handleError } = useImage({
    source,
    fallback,
    onLoad,
    onError,
  });

  const theme = useTheme();
  const { t } = useI18n();
  const imageSrc = typeof currentSource === 'string' ? currentSource : currentSource?.uri || '';
  const resolvedSrc = imageSrc ? imageSrc : undefined;

  // Compute object-fit CSS value from resizeMode
  const getObjectFit = (mode) => {
    const modes = {
      cover: 'cover',
      contain: 'contain',
      stretch: 'fill',
      repeat: 'none',
      center: 'none',
    };
    return modes[mode] || 'cover';
  };

  const objectFitValue = getObjectFit(resizeMode);
  const objectPositionValue = resizeMode === 'center' ? 'center' : 'center';

  const defaultPlaceholder = (
    <StyledPlaceholder>
      <StyledSpinner />
    </StyledPlaceholder>
  );

  const defaultError = (
    <StyledErrorContainer>
      <Text variant="caption" color={theme.colors.text.tertiary}>
        {t('common.imageLoadError')}
      </Text>
    </StyledErrorContainer>
  );

  // Filter out non-DOM props from rest to prevent passing them to DOM elements
  const {
    resizeMode: _resizeMode,
    lazy: _lazy,
    fallback: _fallback,
    placeholder: _placeholder,
    errorComponent: _errorComponent,
    source: _source,
    accessibilityRole: _accessibilityRole,
    accessibilityLabel: _accessibilityLabel,
    accessibilityHint: _accessibilityHint,
    testID: _testID,
    ...domProps
  } = rest;

  return (
    <StyledContainer
      width={width}
      height={height}
      style={style}
      className={className}
      data-testid={testID ? `${testID}-container` : undefined}
    >
      <StyledImage
        src={resolvedSrc}
        style={{
          objectFit: objectFitValue,
          objectPosition: objectPositionValue,
        }}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        alt={accessibilityLabel || t('common.imageDefaultAlt')}
        aria-label={accessibilityLabel}
        title={accessibilityHint}
        data-testid={testID}
        {...domProps}
      />
      {isLoading && (placeholder || defaultPlaceholder)}
      {hasError && !isLoading && (errorComponent || defaultError)}
    </StyledContainer>
  );
};

export default ImageWeb;

