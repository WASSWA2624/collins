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
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xl}px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    max-width: 1280px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.xxl}px ${({ theme }) => theme.spacing.xl}px;
    gap: ${({ theme }) => theme.spacing.xxl}px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.large ?? 1440}px) {
    max-width: 1440px;
    padding: ${({ theme }) => theme.spacing.xxl}px ${({ theme }) => theme.spacing.xxl}px;
    gap: ${({ theme }) => theme.spacing.xxl}px;
  }
`;

const StyledProgressSection = styled.div.withConfig({
  displayName: 'StyledProgressSection',
  componentId: 'StyledProgressSection',
})`
  flex-shrink: 0;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  order: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    flex-basis: 100%;
    width: 100%;
  }
`;

const CARD_MAX_WIDTH_TABLET = 560;
const CARD_MAX_WIDTH_DESKTOP = 640;
const CARD_MAX_WIDTH_LARGE = 720;

const StyledWizardPane = styled.section.withConfig({
  displayName: 'StyledWizardPane',
  componentId: 'StyledWizardPane',
})`
  flex: 1;
  min-width: min(100%, 280px);
  display: flex;
  flex-direction: column;
  order: 2;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    flex-basis: 100%;
    width: 100%;
    min-width: 280px;
    max-width: ${CARD_MAX_WIDTH_TABLET}px;
    margin: 0 auto;
    order: 2;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    max-width: ${CARD_MAX_WIDTH_DESKTOP}px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.large ?? 1440}px) {
    max-width: ${CARD_MAX_WIDTH_LARGE}px;
  }
`;

const StyledWizardCard = styled.div.withConfig({
  displayName: 'StyledWizardCard',
  componentId: 'StyledWizardCard',
})`
  flex: 1;
  min-width: 0;
  min-height: 200px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius?.md ?? 8}px;
  padding: ${({ theme }) => theme.spacing.xl}px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  overflow-y: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    padding: ${({ theme }) => theme.spacing.xxl}px;
  }
`;

const StyledSummaryWrap = styled.div.withConfig({
  displayName: 'StyledSummaryWrap',
  componentId: 'StyledSummaryWrap',
})`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  order: 1;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    flex-basis: 100%;
    width: 100%;
    order: 1;
    margin-bottom: 0;
  }
`;

const StyledSummaryPane = styled.aside.withConfig({
  displayName: 'StyledSummaryPane',
  componentId: 'StyledSummaryPane',
})`
  width: 100%;
  max-width: 100%;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius?.lg ?? theme.radius?.md ?? 8}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  box-shadow: ${({ theme }) => boxShadowFromToken(theme.shadows?.sm ?? theme.shadows?.card ?? theme.shadows)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0;
  box-sizing: border-box;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    width: 100%;
    max-width: ${CARD_MAX_WIDTH_TABLET}px;
    padding: ${({ theme }) => theme.spacing.xl}px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    max-width: ${CARD_MAX_WIDTH_DESKTOP}px;
    padding: ${({ theme }) => theme.spacing.xl}px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.large ?? 1440}px) {
    max-width: ${CARD_MAX_WIDTH_LARGE}px;
    padding: ${({ theme }) => theme.spacing.xxl}px;
  }
`;

const StyledStepHeader = styled.header.withConfig({
  displayName: 'StyledStepHeader',
  componentId: 'StyledStepHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  flex-shrink: 0;
  min-width: 0;
`;

const StyledStepTitle = styled.h2.withConfig({
  displayName: 'StyledStepTitle',
  componentId: 'StyledStepTitle',
})`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

const StyledStepIndicator = styled.span.withConfig({
  displayName: 'StyledStepIndicator',
  componentId: 'StyledStepIndicator',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  flex-shrink: 0;
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

const StyledFieldWithHint = styled.div.withConfig({
  displayName: 'StyledFieldWithHint',
  componentId: 'StyledFieldWithHint',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
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
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  min-width: 0;
`;

const StyledSummaryTitle = styled.span.withConfig({
  displayName: 'StyledSummaryTitle',
  componentId: 'StyledSummaryTitle',
})`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  & > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const StyledExpandButton = styled.button.withConfig({
  displayName: 'StyledExpandButton',
  componentId: 'StyledExpandButton',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;

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
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSummaryRow = styled.div.withConfig({
  displayName: 'StyledSummaryRow',
  componentId: 'StyledSummaryRow',
})`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};

  &:last-child {
    border-bottom: none;
  }
`;

const StyledSummaryLabel = styled.span.withConfig({
  displayName: 'StyledSummaryLabel',
  componentId: 'StyledSummaryLabel',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: 1.4;
  min-width: 0;
  word-break: break-word;
`;

const StyledSummaryValue = styled.span.withConfig({
  displayName: 'StyledSummaryValue',
  componentId: 'StyledSummaryValue',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-align: right;
  white-space: nowrap;
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
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px ${({ theme }) => theme.spacing.xl}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFFBF0'};
  color: ${({ theme }) => theme.colors.status?.warning?.text ?? '#856404'};
  border-radius: ${({ theme }) => theme.radius?.md ?? 8}px;
  border: 1px solid ${({ theme }) => theme.colors.warning ?? 'rgba(255, 149, 0, 0.35)'};
  border-left: 4px solid ${({ theme }) => theme.colors.warning ?? '#FF9500'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm ?? 14}px;
`;

const StyledMissingTestsTitle = styled.div.withConfig({
  displayName: 'StyledMissingTestsTitle',
  componentId: 'StyledMissingTestsTitle',
})`
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold ?? 600};
  font-size: ${({ theme }) => theme.typography?.fontSize?.md ?? 16}px;
`;

const StyledMissingTestsList = styled.ul.withConfig({
  displayName: 'StyledMissingTestsList',
  componentId: 'StyledMissingTestsList',
})`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
  list-style: disc;
`;

const StyledMissingTestsHint = styled.p.withConfig({
  displayName: 'StyledMissingTestsHint',
  componentId: 'StyledMissingTestsHint',
})`
  margin: 0;
  opacity: 0.95;
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm ?? 14}px;
`;

const StyledFieldGroup = styled.div.withConfig({
  displayName: 'StyledFieldGroup',
  componentId: 'StyledFieldGroup',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0;
`;

const StyledStepDescription = styled.p.withConfig({
  displayName: 'StyledStepDescription',
  componentId: 'StyledStepDescription',
})`
  margin: 0 0 ${({ theme }) => theme.spacing.md}px 0;
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm ?? 14}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

const StyledRecommendationSource = styled.div.withConfig({
  displayName: 'StyledRecommendationSource',
  componentId: 'StyledRecommendationSource',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  min-width: 0;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    margin-top: ${({ theme }) => theme.spacing.lg}px;
    padding-top: ${({ theme }) => theme.spacing.lg}px;
  }
`;

const StyledRecommendationSourceTitle = styled.h3.withConfig({
  displayName: 'StyledRecommendationSourceTitle',
  componentId: 'StyledRecommendationSourceTitle',
})`
  margin: 0 0 ${({ theme }) => theme.spacing.sm}px 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.md}px;
    margin-bottom: ${({ theme }) => theme.spacing.md}px;
  }
`;

const StyledSourceOptionsList = styled.div.withConfig({
  displayName: 'StyledSourceOptionsList',
  componentId: 'StyledSourceOptionsList',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    gap: ${({ theme }) => theme.spacing.md}px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.md}px;
  }
`;

const StyledSourceOption = styled.label.withConfig({
  displayName: 'StyledSourceOption',
  componentId: 'StyledSourceOption',
})`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius?.md ?? 8}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  min-width: 0;

  &:hover {
    border-color: ${({ theme }) => theme.colors.background.tertiary};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  &[data-selected='true'] {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
    gap: ${({ theme }) => theme.spacing.md}px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm}px;
  }
`;

const StyledSourceOptionContent = styled.div.withConfig({
  displayName: 'StyledSourceOptionContent',
  componentId: 'StyledSourceOptionContent',
})`
  flex: 1;
  min-width: 0;
`;

const StyledSourceOptionLabel = styled.span.withConfig({
  displayName: 'StyledSourceOptionLabel',
  componentId: 'StyledSourceOptionLabel',
})`
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold ?? 600};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  }
`;

const StyledSourceOptionDesc = styled.span.withConfig({
  displayName: 'StyledSourceOptionDesc',
  componentId: 'StyledSourceOptionDesc',
})`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.xs ?? 12}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  line-height: 1.4;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm ?? 14}px;
  }
`;

const StyledModelRow = styled.div.withConfig({
  displayName: 'StyledModelRow',
  componentId: 'StyledModelRow',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    margin-top: ${({ theme }) => theme.spacing.lg}px;
    padding-top: ${({ theme }) => theme.spacing.lg}px;
  }
`;

export {
  StyledActionsRow,
  StyledContainer,
  StyledExpandButton,
  StyledSummaryWrap,
  StyledFieldGroup,
  StyledFieldGrid,
  StyledFieldGridFull,
  StyledFieldWithHint,
  StyledMissingTests,
  StyledMissingTestsHint,
  StyledMissingTestsList,
  StyledMissingTestsTitle,
  StyledModelRow,
  StyledObservationRow,
  StyledProgressSection,
  StyledRecommendationSource,
  StyledRecommendationSourceTitle,
  StyledSourceOption,
  StyledSourceOptionContent,
  StyledSourceOptionDesc,
  StyledSourceOptionsList,
  StyledSourceOptionLabel,
  StyledStepContent,
  StyledStepDescription,
  StyledStepHeader,
  StyledStepIndicator,
  StyledStepTitle,
  StyledSummaryBody,
  StyledSummaryHeader,
  StyledSummaryLabel,
  StyledSummaryPane,
  StyledSummaryRow,
  StyledSummaryTitle,
  StyledSummaryValue,
  StyledWizardCard,
  StyledWizardPane,
};
