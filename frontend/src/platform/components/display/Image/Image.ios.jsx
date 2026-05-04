/**
 * Image Component - iOS
 * Optimized image component for iOS platform
 * File: Image.ios.jsx
 */
// 1. External dependencies
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components/native';

// 2. Platform components (direct import to avoid require cycle)
import Text from '@platform/components/display/Text';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import { StyledContainer, StyledImage, StyledPlaceholder, StyledErrorContainer } from './Image.ios.styles';

// 5. Component-specific hook (relative import)
import useImage from './useImage';

/**
 * Image component for iOS
 * @param {Object} props - Image props
 * @param {string|Object} props.source - Image source (URI string or {uri: string})
 * @param {string|Object} props.fallback - Fallback image source
 * @param {React.ReactNode} props.placeholder - Placeholder component
 * @param {React.ReactNode} props.errorComponent - Error component
 * @param {string} props.resizeMode - Resize mode (cover, contain, stretch, repeat, center)
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {Function} props.onLoad - Load handler
 * @param {Function} props.onError - Error handler
 * @param {Object} props.style - Additional styles
 */
const ImageIOS = ({
  source,
  fallback,
  placeholder,
  errorComponent,
  resizeMode = 'cover',
  width,
  height,
  accessibilityLabel,
  accessibilityHint,
  testID,
  onLoad,
  onError,
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
  const imageSource = typeof currentSource === 'string' ? { uri: currentSource } : currentSource;

  const defaultPlaceholder = (
    <StyledPlaceholder>
      <ActivityIndicator size="small" color={theme.colors.text.tertiary} />
    </StyledPlaceholder>
  );

  const defaultError = (
    <StyledErrorContainer>
      <Text variant="caption" color={theme.colors.text.tertiary}>
        {t('common.imageLoadError')}
      </Text>
    </StyledErrorContainer>
  );

  return (
    <StyledContainer
      style={[
        {
          width,
          height,
        },
        style,
      ]}
      testID={testID}
    >
      <StyledImage
        source={imageSource}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        {...rest}
      />
      {isLoading && (placeholder || defaultPlaceholder)}
      {hasError && !isLoading && (errorComponent || defaultError)}
    </StyledContainer>
  );
};

export default ImageIOS;

