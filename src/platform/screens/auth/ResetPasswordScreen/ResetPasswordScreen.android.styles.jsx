/**
 * ResetPasswordScreen Android Styles
 * Styled-components for Android platform
 * File: ResetPasswordScreen.android.styles.jsx
 */
import styled from 'styled-components/native';

const StyledForm = styled.View.withConfig({
  displayName: 'StyledForm',
  componentId: 'StyledForm',
})`
  width: 100%;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'StyledActions',
  componentId: 'StyledActions',
})`
  width: 100%;
`;

const StyledLinkRow = styled.View.withConfig({
  displayName: 'StyledLinkRow',
  componentId: 'StyledLinkRow',
})`
  width: 100%;
  align-items: center;
`;

export { StyledActions, StyledForm, StyledLinkRow };

