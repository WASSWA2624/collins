/**
 * NetworkConnectivityIcon Styles - iOS
 * File: NetworkConnectivityIcon.ios.styles.jsx
 */
import styled from 'styled-components/native';

const StyledIconWrap = styled.View.withConfig({
  displayName: 'StyledIconWrap',
  componentId: 'StyledIconWrap',
})`
  align-items: center;
  justify-content: center;
`;

const StyledIconText = styled.Text.withConfig({
  displayName: 'StyledIconText',
  componentId: 'StyledIconText',
})`
  font-size: 18px;
  color: ${({ theme, $offline }) => ($offline ? theme.colors.error : theme.colors.text.secondary)};
`;

export { StyledIconWrap, StyledIconText };
