/**
 * Avatar iOS Styles
 * Styled-components for iOS platform
 * File: Avatar.ios.styles.jsx
 */

import styled from 'styled-components/native';

const getAvatarDimensionPx = (size, theme) => {
  const s = theme.spacing;
  const sizes = {
    small: s.xl,
    medium: s.xl + s.sm,
    large: s.xl + s.lg,
    xlarge: s.xl + s.xxl,
  };
  return sizes[size] || sizes.medium;
};

const StyledAvatar = styled.View.withConfig({
  displayName: 'StyledAvatar',
})`
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  overflow: hidden;
  width: ${({ size, theme }) => getAvatarDimensionPx(size, theme)}px;
  height: ${({ size, theme }) => getAvatarDimensionPx(size, theme)}px;
`;

const StyledAvatarImage = styled.Image.withConfig({
  displayName: 'StyledAvatarImage',
})`
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

const StyledAvatarText = styled.Text.withConfig({
  displayName: 'StyledAvatarText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ size, theme }) => {
    const sizes = {
      small: theme.typography.fontSize.xs,
      medium: theme.typography.fontSize.sm,
      large: theme.typography.fontSize.md,
      xlarge: theme.typography.fontSize.lg,
    };
    return sizes[size] || sizes.medium;
  }}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

export { StyledAvatar, StyledAvatarImage, StyledAvatarText };


