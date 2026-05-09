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
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSearchIcon = styled.span.withConfig({
  displayName: 'StyledSearchIcon',
  componentId: 'StyledSearchIcon',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  min-width: 24px;
  height: 24px;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  line-height: 24px;
`;

const StyledTextFieldWrapper = styled.div.withConfig({
  displayName: 'StyledTextFieldWrapper',
  componentId: 'StyledTextFieldWrapper',
})`
  flex: 1;
`;

export { StyledContainer, StyledSearchIcon, StyledTextFieldWrapper };
