/**
 * ThemeControls Styles - Web
 * File: ThemeControls.web.styles.jsx
 */
import styled from 'styled-components';

const StyledThemeControls = styled.div.withConfig({
  displayName: 'StyledThemeControls',
  componentId: 'StyledThemeControls',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-wrap: wrap;
`;

export { StyledThemeControls };
