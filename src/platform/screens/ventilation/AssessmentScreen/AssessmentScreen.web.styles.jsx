/**
 * AssessmentScreen Web Styles
 * File: AssessmentScreen.web.styles.jsx
 */
import styled from 'styled-components';

const boxShadowFromToken = (token) => {
  if (!token || typeof token !== 'object') return '0 1px 3px rgba(0,0,0,0.08)';
  const { shadowOffset = {}, shadowRadius = 2, shadowOpacity = 0.1 } = token;
  const h = shadowOffset.height ?? 1;
  const w = shadowOffset.width ?? 0;
  return `${w}px ${h}px ${(shadowRadius || 2) * 2}px rgba(0,0,0,${shadowOpacity})`;
};

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    flex-direction: row;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xl}px;
  }
`;

const StyledProgressSection = styled.div.withConfig({
  displayName: 'StyledProgressSection',
  componentId: 'StyledProgressSection',
})`
  flex-shrink: 0;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledWizardPane = styled.section.withConfig({
  displayName: 'StyledWizardPane',
  componentId: 'StyledWizardPane',
})`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    max-width: 600px;
  }
`;

const StyledWizardCard = styled.div.withConfig({
  displayName: 'StyledWizardCard',
  componentId: 'StyledWizardCard',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius?.lg ?? 12}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  box-shadow: ${({ theme }) => boxShadowFromToken(theme.shadows?.sm)};
  overflow-y: auto;
`;

const StyledSummaryPane = styled.aside.withConfig({
  displayName: 'StyledSummaryPane',
  componentId: 'StyledSummaryPane',
})`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius?.lg ?? 12}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  box-shadow: ${({ theme }) => boxShadowFromToken(theme.shadows?.sm)};

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    width: 340px;
    flex-shrink: 0;
    position: sticky;
    top: ${({ theme }) => theme.spacing.xl}px;
  }
`;

const StyledStepHeader = styled.header.withConfig({
  displayName: 'StyledStepHeader',
  componentId: 'StyledStepHeader',
})`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  flex-shrink: 0;
`;

const StyledStepTitle = styled.h2.withConfig({
  displayName: 'StyledStepTitle',
  componentId: 'StyledStepTitle',
})`
  margin: 0 0 ${({ theme }) => theme.spacing.xs}px 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const StyledStepIndicator = styled.span.withConfig({
  displayName: 'StyledStepIndicator',
  componentId: 'StyledStepIndicator',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const StyledStepContent = styled.div.withConfig({
  displayName: 'StyledStepContent',
  componentId: 'StyledStepContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGrid = styled.div.withConfig({
  displayName: 'StyledFieldGrid',
  componentId: 'StyledFieldGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StyledFieldGridFull = styled.div.withConfig({
  displayName: 'StyledFieldGridFull',
  componentId: 'StyledFieldGridFull',
})`
  grid-column: 1 / -1;
`;

const StyledObservationRow = styled.div.withConfig({
  displayName: 'StyledObservationRow',
  componentId: 'StyledObservationRow',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: flex-end;
`;

const StyledSummaryHeader = styled.div.withConfig({
  displayName: 'StyledSummaryHeader',
  componentId: 'StyledSummaryHeader',
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledExpandButton = styled.button.withConfig({
  displayName: 'StyledExpandButton',
  componentId: 'StyledExpandButton',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledSummaryBody = styled.div.withConfig({
  displayName: 'StyledSummaryBody',
  componentId: 'StyledSummaryBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledSummaryRow = styled.div.withConfig({
  displayName: 'StyledSummaryRow',
  componentId: 'StyledSummaryRow',
})`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.sm}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
`;

const StyledActionsRow = styled.div.withConfig({
  displayName: 'StyledActionsRow',
  componentId: 'StyledActionsRow',
})`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  flex-wrap: wrap;
`;

const StyledMissingTests = styled.div.withConfig({
  displayName: 'StyledMissingTests',
  componentId: 'StyledMissingTests',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFF3CD'};
  border-radius: ${({ theme }) => theme.radius?.sm ?? 4}px;
  font-size: ${({ theme }) => theme.typography?.body?.fontSize ?? 14}px;
`;

const StyledFieldGroup = styled.div.withConfig({
  displayName: 'StyledFieldGroup',
  componentId: 'StyledFieldGroup',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledActionsRow,
  StyledContainer,
  StyledExpandButton,
  StyledFieldGroup,
  StyledFieldGrid,
  StyledFieldGridFull,
  StyledObservationRow,
  StyledMissingTests,
  StyledProgressSection,
  StyledStepContent,
  StyledStepHeader,
  StyledStepIndicator,
  StyledStepTitle,
  StyledSummaryBody,
  StyledSummaryHeader,
  StyledSummaryPane,
  StyledSummaryRow,
  StyledWizardCard,
  StyledWizardPane,
};
