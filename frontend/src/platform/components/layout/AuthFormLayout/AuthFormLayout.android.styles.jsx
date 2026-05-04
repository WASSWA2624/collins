/**
 * AuthFormLayout Android Styles
 * Styled-components for Android platform
 * File: AuthFormLayout.android.styles.jsx
 */
import styled from 'styled-components/native';

const resolveMaxWidth = (theme, size) => {
  const base = theme.spacing.xxl;
  const widths = {
    sm: base * 10,
    md: base * 12,
    lg: base * 14,
  };
  return widths[size] || widths.md;
};

const StyledAuthFormContainer = styled.View.withConfig({
  displayName: 'StyledAuthFormContainer',
  componentId: 'StyledAuthFormContainer',
})`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const StyledAuthFormCardWrapper = styled.View.withConfig({
  displayName: 'StyledAuthFormCardWrapper',
  componentId: 'StyledAuthFormCardWrapper',
})`
  width: 100%;
  max-width: ${({ theme, size }) => resolveMaxWidth(theme, size)}px;
`;

const StyledAuthFormStatus = styled.View.withConfig({
  displayName: 'StyledAuthFormStatus',
  componentId: 'StyledAuthFormStatus',
})`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledAuthFormActions = styled.View.withConfig({
  displayName: 'StyledAuthFormActions',
  componentId: 'StyledAuthFormActions',
})`
  width: 100%;
`;

const StyledAuthFormFooter = styled.View.withConfig({
  displayName: 'StyledAuthFormFooter',
  componentId: 'StyledAuthFormFooter',
})`
  width: 100%;
  align-items: center;
`;

export {
  StyledAuthFormContainer,
  StyledAuthFormCardWrapper,
  StyledAuthFormStatus,
  StyledAuthFormActions,
  StyledAuthFormFooter,
};

