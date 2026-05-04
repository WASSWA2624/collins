/**
 * Slider Web Styles
 * Styled-components for Web platform
 * File: Slider.web.styles.jsx
 */
import styled from 'styled-components';
import { View, Pressable } from 'react-native';

const StyledSlider = styled(View).withConfig({
  displayName: 'StyledSlider',
})`
  width: 100%;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSliderTrack = styled(Pressable).withConfig({
  displayName: 'StyledSliderTrack',
})`
  width: 100%;
  height: 4px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ disabled, theme }) => (disabled ? theme.colors.background.tertiary : theme.colors.background.secondary)};
  position: relative;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const StyledSliderFill = styled(View).withConfig({
  displayName: 'StyledSliderFill',
})`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ disabled, theme }) => (disabled ? theme.colors.background.tertiary : theme.colors.primary)};
  transition: width 0.1s ease;
`;

const StyledSliderThumb = styled(View).withConfig({
  displayName: 'StyledSliderThumb',
})`
  position: absolute;
  left: ${({ percentage }) => percentage}%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ disabled, theme }) => (disabled ? theme.colors.background.tertiary : theme.colors.primary)};
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.text.inverse};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'grab')};
  transition: left 0.1s ease;
`;

export {
  StyledSlider,
  StyledSliderTrack,
  StyledSliderFill,
  StyledSliderThumb,
};



