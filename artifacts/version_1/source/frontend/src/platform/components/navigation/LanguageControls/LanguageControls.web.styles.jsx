/**
 * LanguageControls Styles - Web
 * File: LanguageControls.web.styles.jsx
 */
import styled from 'styled-components';

const StyledLanguageControls = styled.div.withConfig({
  displayName: 'StyledLanguageControls',
  componentId: 'StyledLanguageControls',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-wrap: wrap;
`;

export { StyledLanguageControls };
