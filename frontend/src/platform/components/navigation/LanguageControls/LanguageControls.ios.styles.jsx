/**
 * LanguageControls Styles - iOS
 * File: LanguageControls.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledLanguageControls = styled(View).withConfig({
  displayName: 'StyledLanguageControls',
  componentId: 'StyledLanguageControls',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-wrap: wrap;
`;

export { StyledLanguageControls };
