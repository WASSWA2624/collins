/**
 * Slider iOS Styles
 * Styled-components for iOS platform
 * File: Slider.ios.styles.jsx
 */
import styled from 'styled-components/native';

const StyledSlider = styled.View.withConfig({
  displayName: 'StyledSlider',
})`
  width: 100%;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSliderTrack = styled.View.withConfig({
  displayName: 'StyledSliderTrack',
})`
  width: 100%;
  height: 4px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ disabled, theme }) => (disabled ? theme.colors.background.tertiary : theme.colors.background.secondary)};
  position: relative;
`;

const StyledSliderFill = styled.View.withConfig({
  displayName: 'StyledSliderFill',
})`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ disabled, theme }) => (disabled ? theme.colors.background.tertiary : theme.colors.primary)};
`;

const StyledSliderThumb = styled.View.withConfig({
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
  shadow-color: ${({ theme }) => theme.colors.text.primary};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
`;

export {
  StyledSlider,
  StyledSliderTrack,
  StyledSliderFill,
  StyledSliderThumb,
};


