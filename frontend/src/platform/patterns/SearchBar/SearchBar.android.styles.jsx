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
`;

const StyledSearchIcon = styled.Text.withConfig({
  displayName: 'StyledSearchIcon',
  componentId: 'StyledSearchIcon',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-right: ${({ theme }) => theme.spacing.xs}px;
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


