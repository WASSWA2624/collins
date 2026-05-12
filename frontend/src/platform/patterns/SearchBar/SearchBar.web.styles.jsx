/**
 * SearchBar Web Styles
 * Styled-components for Web platform
 * File: SearchBar.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  min-height: 48px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: 0 ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  background: ${({ theme }) => theme.colors.background.primary};
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}15;
  }
`;

const StyledSearchIcon = styled.span.withConfig({
  displayName: 'StyledSearchIcon',
  componentId: 'StyledSearchIcon',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  min-width: 22px;
  height: 22px;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  line-height: 22px;
`;

const StyledTextFieldWrapper = styled.div.withConfig({
  displayName: 'StyledTextFieldWrapper',
  componentId: 'StyledTextFieldWrapper',
})`
  flex: 1;
  min-width: 0;
`;

const StyledClearButton = styled.span.withConfig({
  displayName: 'StyledClearButton',
  componentId: 'StyledClearButton',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  button {
    min-width: 30px;
    min-height: 30px;
    padding: 0;
    border-radius: 0;
  }
`;

export {
  StyledClearButton,
  StyledContainer,
  StyledSearchIcon,
  StyledTextFieldWrapper,
};
