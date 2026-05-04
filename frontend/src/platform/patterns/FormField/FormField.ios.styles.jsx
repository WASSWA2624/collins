/**
 * FormField iOS Styles
 * Styled-components for iOS platform
 * File: FormField.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledLabel = styled.Text.withConfig({
  displayName: 'StyledLabel',
  componentId: 'StyledLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledContainer,
  StyledLabel,
};


