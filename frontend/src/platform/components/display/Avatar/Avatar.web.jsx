/**
 * Avatar Component - Web
 * User/product image with fallback
 * File: Avatar.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 4. Styles (relative import - platform-specific)
import { StyledAvatar, StyledAvatarImage, StyledAvatarText } from './Avatar.web.styles';

// 5. Component-specific hook (relative import)
import useAvatar from './useAvatar';

/**
 * Avatar component for Web
 * @param {Object} props - Avatar props
 * @param {string} props.size - Avatar size (small, medium, large, xlarge)
 * @param {string} props.source - Image source URI
 * @param {string} props.name - Name for fallback initials
 * @param {string} props.alt - Alt text for image
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const AvatarWeb = ({
  size,
  source,
  name,
  alt,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { size: resolvedSize, label, hasImage, initials, handleImageError } = useAvatar({
    size,
    source,
    name,
    alt,
    accessibilityLabel,
  });

  return (
    <StyledAvatar
      size={resolvedSize}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      {hasImage ? (
        <StyledAvatarImage
          alt={alt || name || ''}
          src={typeof source === 'string' ? source : source?.uri}
          onError={handleImageError}
          data-testid={testID ? `${testID}-image` : undefined}
        />
      ) : (
        <StyledAvatarText data-testid={testID ? `${testID}-initials` : undefined} size={resolvedSize}>
          {initials}
        </StyledAvatarText>
      )}
    </StyledAvatar>
  );
};

export default AvatarWeb;

