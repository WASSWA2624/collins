/**
 * SearchBar iOS Styles
 * Styled-components for iOS platform
 * File: SearchBar.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex-direction: row;
  align-items: center;
  width: 100%;
  min-height: 48px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledSearchIcon = styled.Text.withConfig({
  displayName: 'StyledSearchIcon',
  componentId: 'StyledSearchIcon',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  width: 22px;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
`;

const StyledTextFieldWrapper = styled.View.withConfig({
  displayName: 'StyledTextFieldWrapper',
  componentId: 'StyledTextFieldWrapper',
})`
  flex: 1;
  min-width: 0px;
`;

const StyledClearButtonWrapper = styled.View.withConfig({
  displayName: 'StyledClearButtonWrapper',
  componentId: 'StyledClearButtonWrapper',
})`
  min-width: 30px;
  min-height: 30px;
  align-items: center;
  justify-content: center;
`;

export {
  StyledContainer,
  StyledSearchIcon,
  StyledTextFieldWrapper,
  StyledClearButtonWrapper,
};
