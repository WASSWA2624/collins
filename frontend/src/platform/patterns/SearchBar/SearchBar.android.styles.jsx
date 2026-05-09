/**
 * SearchBar Android Styles
 * Styled-components for Android platform
 * File: SearchBar.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSearchIcon = styled.Text.withConfig({
  displayName: 'StyledSearchIcon',
  componentId: 'StyledSearchIcon',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  width: 24px;
  min-width: 24px;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
`;

const StyledTextFieldWrapper = styled.View.withConfig({
  displayName: 'StyledTextFieldWrapper',
  componentId: 'StyledTextFieldWrapper',
})`
  flex: 1;
`;

const StyledClearButtonWrapper = styled.View.withConfig({
  displayName: 'StyledClearButtonWrapper',
  componentId: 'StyledClearButtonWrapper',
})`
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledContainer,
  StyledSearchIcon,
  StyledTextFieldWrapper,
  StyledClearButtonWrapper,
};
