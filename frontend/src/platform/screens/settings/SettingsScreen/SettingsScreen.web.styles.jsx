/**
 * SettingsScreen Web Styles
 * Compact responsive settings layout. Per theme-design.mdc: responsive, theme tokens.
 * File: SettingsScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: min-content;
  padding: ${({ theme }) => theme.spacing.md}px
    ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    padding: ${({ theme }) => theme.spacing.lg}px;
  }
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  grid-column: 1 / -1;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
  shouldForwardProp: (prop) => !String(prop).startsWith('$'),
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  box-sizing: border-box;
  grid-column: ${({ $span }) => ($span === 'full' ? '1 / -1' : 'auto')};
  padding: ${({ theme }) => theme.spacing.md}px;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    grid-column: ${({ $span }) => {
      if ($span === 'full') return '1 / -1';
      if ($span === 'wide') return 'span 2';
      return 'auto';
    }};
  }
`;

const StyledSectionTitle = styled.div.withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  font-size: ${({ theme }) => theme.typography?.fontSize?.md ?? 16}px;
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold ?? 600};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledSectionBody = styled.div.withConfig({
  displayName: 'StyledSectionBody',
  componentId: 'StyledSectionBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFieldGrid = styled.div.withConfig({
  displayName: 'StyledFieldGrid',
  componentId: 'StyledFieldGrid',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  width: 100%;
`;

const StyledControlItem = styled.div.withConfig({
  displayName: 'StyledControlItem',
  componentId: 'StyledControlItem',
  shouldForwardProp: (prop) => !String(prop).startsWith('$'),
})`
  min-width: 0;
  width: 100%;
`;

const StyledActionsRow = styled.div.withConfig({
  displayName: 'StyledActionsRow',
  componentId: 'StyledActionsRow',
})`
  display: flex;
  justify-content: flex-start;
  margin-top: ${({ theme }) => -theme.spacing.xs}px;
`;

const StyledStatusGrid = styled.div.withConfig({
  displayName: 'StyledStatusGrid',
  componentId: 'StyledStatusGrid',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  width: 100%;
`;

const StyledSettingRow = styled.div.withConfig({
  displayName: 'StyledSettingRow',
  componentId: 'StyledSettingRow',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-height: 34px;
  padding: ${({ theme }) => theme.spacing.xs}px 0;
  width: 100%;
`;

const StyledValuePill = styled.span.withConfig({
  displayName: 'StyledValuePill',
  componentId: 'StyledValuePill',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 58%;
  min-height: 24px;
  padding: 2px ${({ theme }) => theme.spacing.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  text-align: right;
  overflow-wrap: anywhere;
`;

const StyledModelBlock = styled.div.withConfig({
  displayName: 'StyledModelBlock',
  componentId: 'StyledModelBlock',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

export {
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledSection,
  StyledSectionBody,
  StyledSectionTitle,
  StyledFieldGrid,
  StyledControlItem,
  StyledActionsRow,
  StyledStatusGrid,
  StyledSettingRow,
  StyledValuePill,
  StyledModelBlock,
};
