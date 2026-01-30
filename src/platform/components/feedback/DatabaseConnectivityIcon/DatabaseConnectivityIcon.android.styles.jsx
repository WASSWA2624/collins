/**
 * DatabaseConnectivityIcon Styles - Android
 * File: DatabaseConnectivityIcon.android.styles.jsx
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
  color: ${({ theme, $connected }) => ($connected ? theme.colors.success : theme.colors.error)};
`;

export { StyledIconWrap, StyledIconText };
