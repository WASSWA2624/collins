/**
 * Avatar Component - iOS
 * User/product image with fallback
 * File: Avatar.ios.jsx
 */

import React from 'react';
import { StyledAvatar, StyledAvatarImage, StyledAvatarText } from './Avatar.ios.styles';
import useAvatar from './useAvatar';

/**
 * Avatar component for iOS
 * @param {Object} props - Avatar props
 * @param {string} props.size - Avatar size (small, medium, large, xlarge)
 * @param {string|Object} props.source - Image source URI or object
 * @param {string} props.name - Name for fallback initials
 * @param {string} props.alt - Alt text for image
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const AvatarIOS = ({
  size,
  source,
  name,
  alt,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { size: resolvedSize, label, hasImage, imageSource, initials, handleImageError } = useAvatar({
    size,
    source,
    name,
    alt,
    accessibilityLabel,
  });

  return (
    <StyledAvatar
      size={resolvedSize}
      accessibilityRole="image"
      accessibilityLabel={label}
      accessibilityElementsHidden={!label}
      importantForAccessibility={label ? 'auto' : 'no-hide-descendants'}
      accessible={!!label}
      testID={testID}
      style={style}
      {...rest}
    >
      {hasImage ? (
        <StyledAvatarImage
          size={resolvedSize}
          source={imageSource}
          onError={handleImageError}
          testID={testID ? `${testID}-image` : undefined}
        />
      ) : (
        <StyledAvatarText size={resolvedSize} testID={testID ? `${testID}-initials` : undefined}>
          {initials}
        </StyledAvatarText>
      )}
    </StyledAvatar>
  );
};

export default AvatarIOS;

