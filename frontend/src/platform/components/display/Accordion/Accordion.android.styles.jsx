/**
 * Accordion Android Styles
 * Styled-components for Android platform
 * File: Accordion.android.styles.jsx
 */
import styled from 'styled-components/native';

const StyledAccordion = styled.View.withConfig({
  displayName: 'StyledAccordion',
})`
  width: 100%;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
  elevation: 1;
`;

const StyledAccordionHeader = styled.Pressable.withConfig({
  displayName: 'StyledAccordionHeader',
})`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledAccordionIcon = styled.Text.withConfig({
  displayName: 'StyledAccordionIcon',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  transform: rotate(${({ expanded }) => (expanded ? 180 : 0)}deg);
`;

const StyledAccordionContent = styled.View.withConfig({
  displayName: 'StyledAccordionContent',
})`
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
`;

export {
  StyledAccordion,
  StyledAccordionHeader,
  StyledAccordionContent,
  StyledAccordionIcon,
};


