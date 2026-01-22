/**
 * AuthFormLayout Web Styles
 * Styled-components for Web platform
 * File: AuthFormLayout.web.styles.jsx
 */
import styled from 'styled-components';

const resolveMaxWidth = (theme, size) => {
  const base = theme.spacing.xxl;
  const widths = {
    sm: base * 10,
    md: base * 12,
    lg: base * 14,
  };
  return widths[size] || widths.md;
};

const StyledAuthFormContainer = styled.div.withConfig({
  displayName: 'StyledAuthFormContainer',
  componentId: 'StyledAuthFormContainer',
})`
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledAuthFormCardWrapper = styled.div.withConfig({
  displayName: 'StyledAuthFormCardWrapper',
  componentId: 'StyledAuthFormCardWrapper',
})`
  width: 100%;
  max-width: ${({ theme, size }) => resolveMaxWidth(theme, size)}px;
`;

const StyledAuthFormStatus = styled.div.withConfig({
  displayName: 'StyledAuthFormStatus',
  componentId: 'StyledAuthFormStatus',
})`
  width: 100%;
`;

const StyledAuthFormActions = styled.div.withConfig({
  displayName: 'StyledAuthFormActions',
  componentId: 'StyledAuthFormActions',
})`
  width: 100%;
`;

const StyledAuthFormFooter = styled.div.withConfig({
  displayName: 'StyledAuthFormFooter',
  componentId: 'StyledAuthFormFooter',
})`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export {
  StyledAuthFormContainer,
  StyledAuthFormCardWrapper,
  StyledAuthFormStatus,
  StyledAuthFormActions,
  StyledAuthFormFooter,
};

