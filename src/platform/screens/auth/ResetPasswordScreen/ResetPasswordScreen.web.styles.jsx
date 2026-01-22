/**
 * ResetPasswordScreen Web Styles
 * Styled-components for Web platform
 * File: ResetPasswordScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledForm = styled.div.withConfig({
  displayName: 'StyledForm',
  componentId: 'StyledForm',
})`
  width: 100%;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'StyledActions',
  componentId: 'StyledActions',
})`
  width: 100%;
`;

const StyledLinkRow = styled.div.withConfig({
  displayName: 'StyledLinkRow',
  componentId: 'StyledLinkRow',
})`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export { StyledActions, StyledForm, StyledLinkRow };

