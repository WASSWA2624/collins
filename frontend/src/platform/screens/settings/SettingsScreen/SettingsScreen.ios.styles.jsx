/**
 * SettingsScreen iOS Styles
 * File: SettingsScreen.ios.styles.jsx
 * Per theme-design.mdc: iOS HIG, card patterns, theme tokens.
 */
import styled from 'styled-components/native';
import { ScrollView, View } from 'react-native';

const StyledContainer = styled(ScrollView)
  .withConfig({
    displayName: 'StyledContainer',
    componentId: 'StyledContainer',
  })
  .attrs({
    contentInsetAdjustmentBehavior: 'automatic',
    keyboardShouldPersistTaps: 'handled',
  })`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
  shouldForwardProp: (prop) => !String(prop).startsWith('$'),
})`
  width: 100%;
  max-width: 1180px;
  align-self: center;
  flex-direction: ${({ $isWideLayout }) => ($isWideLayout ? 'row' : 'column')};
  flex-wrap: ${({ $isWideLayout }) => ($isWideLayout ? 'wrap' : 'nowrap')};
  align-items: stretch;
  padding: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.xxl}px;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
  shouldForwardProp: (prop) => !String(prop).startsWith('$'),
})`
  width: ${({ $span, $isWideLayout }) =>
    !$isWideLayout || $span === 'full' || $span === 'wide' ? '100%' : '48%'};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: 0;
  padding: ${({ theme }) => theme.spacing.md}px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledSectionTitle = styled(View).withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionBody = styled(View).withConfig({
  displayName: 'StyledSectionBody',
  componentId: 'StyledSectionBody',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFieldGrid = styled(View).withConfig({
  displayName: 'StyledFieldGrid',
  componentId: 'StyledFieldGrid',
})`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledControlItem = styled(View).withConfig({
  displayName: 'StyledControlItem',
  componentId: 'StyledControlItem',
  shouldForwardProp: (prop) => !String(prop).startsWith('$'),
})`
  width: ${({ $isWideLayout }) => ($isWideLayout ? '48%' : '100%')};
  min-width: 0;
`;

const StyledActionsRow = styled(View).withConfig({
  displayName: 'StyledActionsRow',
  componentId: 'StyledActionsRow',
})`
  align-items: flex-start;
  margin-top: ${({ theme }) => -theme.spacing.xs}px;
`;

const StyledStatusGrid = styled(View).withConfig({
  displayName: 'StyledStatusGrid',
  componentId: 'StyledStatusGrid',
})`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSettingRow = styled(View).withConfig({
  displayName: 'StyledSettingRow',
  componentId: 'StyledSettingRow',
})`
  min-height: 34px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledValuePill = styled(View).withConfig({
  displayName: 'StyledValuePill',
  componentId: 'StyledValuePill',
})`
  max-width: 58%;
  min-height: 24px;
  align-items: center;
  justify-content: center;
  padding-vertical: 2px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledModelBlock = styled(View).withConfig({
  displayName: 'StyledModelBlock',
  componentId: 'StyledModelBlock',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
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
