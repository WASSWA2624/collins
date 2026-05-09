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
  min-width: 0;
  min-height: 100%;
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.lg}px;
    padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    max-width: 1440px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.xl}px;
    gap: ${({ theme }) => theme.spacing.xl}px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 372px);
    grid-template-areas:
      'progress progress'
      'wizard summary';
    align-items: start;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.large ?? 1440}px) {
    max-width: 1560px;
    padding: ${({ theme }) => theme.spacing.xxl}px;
    grid-template-columns: minmax(0, 1fr) minmax(380px, 420px);
  }
`;

const StyledProgressSection = styled.div.withConfig({
  displayName: 'StyledProgressSection',
  componentId: 'StyledProgressSection',
})`
  flex-shrink: 0;
  margin-bottom: 0;
  order: 0;
  width: 100%;
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    flex-basis: 100%;
    width: 100%;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    grid-area: progress;
  }
`;

const StyledWizardPane = styled.section.withConfig({
  displayName: 'StyledWizardPane',
  componentId: 'StyledWizardPane',
})`
  flex: 1;
  min-width: min(100%, 280px);
  display: flex;
  flex-direction: column;
  order: 2;
  position: relative;
  z-index: 1;
  overflow-x: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    flex: 1 1 100%;
    min-width: 280px;
    order: 2;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    grid-area: wizard;
    width: 100%;
    min-width: 0;
    flex: initial;
    max-width: none;
    order: 1;
  }
`;

const StyledStepper = styled.div.withConfig({
  displayName: 'StyledStepper',
  componentId: 'StyledStepper',
})`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const StyledStepperItem = styled.div.withConfig({
  displayName: 'StyledStepperItem',
  componentId: 'StyledStepperItem',
})`
  position: relative;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.xs}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-right-width: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};

  &[data-status='error'] {
    border-color: ${({ theme }) => theme.colors.error};
  }

  &:last-child {
    border-right-width: 1px;
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
    justify-items: center;
    align-items: start;
    text-align: center;
    padding: 6px ${({ theme }) => theme.spacing.xs}px;
  }
`;

const StyledStepperMarker = styled.span.withConfig({
  displayName: 'StyledStepperMarker',
  componentId: 'StyledStepperMarker',
})`
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};

  &[data-status='complete'] {
    border-color: ${({ theme }) => theme.colors.success};
    background-color: ${({ theme }) => theme.colors.status?.success?.background ?? '#E8F5E9'};
    color: ${({ theme }) => theme.colors.status?.success?.text ?? '#1B5E20'};
  }

  &[data-status='current'] {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary ?? theme.colors.text.inverse};
  }

  &[data-status='error'] {
    border-color: ${({ theme }) => theme.colors.error};
    background-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.onPrimary ?? theme.colors.text.inverse};
  }
`;

const StyledStepperMeta = styled.span.withConfig({
  displayName: 'StyledStepperMeta',
  componentId: 'StyledStepperMeta',
})`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;

  @media (max-width: 420px) {
    align-items: center;
  }
`;

const StyledStepperLabel = styled.span.withConfig({
  displayName: 'StyledStepperLabel',
  componentId: 'StyledStepperLabel',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1.25;
  overflow-wrap: anywhere;
  white-space: normal;

  &[data-status='upcoming'] {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  }

  &[data-status='error'] {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const StyledStepperConnector = styled.span.withConfig({
  displayName: 'StyledStepperConnector',
  componentId: 'StyledStepperConnector',
})`
  display: none;
`;

const StyledWizardCard = styled.div.withConfig({
  displayName: 'StyledWizardCard',
  componentId: 'StyledWizardCard',
})`
  flex: 1;
  min-width: 0;
  width: 100%;
  min-height: 200px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  padding: ${({ theme }) => theme.spacing.md}px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  overflow-x: hidden;
  overflow-y: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    padding: ${({ theme }) => theme.spacing.xl}px;
  }

  @media (max-width: 420px) {
    padding: ${({ theme }) => theme.spacing.sm}px;
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
  order: 3;
  margin-bottom: 0;
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    flex-basis: 100%;
    width: 100%;
    order: 3;
    margin-bottom: 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    grid-area: summary;
    width: 100%;
    max-width: 372px;
    justify-self: end;
    flex: initial;
    order: 2;
    position: relative;
    top: auto;
    z-index: 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.large ?? 1440}px) {
    max-width: 420px;
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
  border-radius: 0;
  padding: ${({ theme }) => theme.spacing.md}px;
  box-shadow: ${({ theme }) => boxShadowFromToken(theme.shadows?.sm ?? theme.shadows?.card ?? theme.shadows)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0;
  box-sizing: border-box;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.lg}px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    max-height: calc(100vh - ${({ theme }) => theme.spacing.xxl * 2}px);
    overflow-y: auto;
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
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.25;
  white-space: normal;
  overflow-wrap: anywhere;
  min-width: 0;
`;

const StyledStepIndicator = styled.span.withConfig({
  displayName: 'StyledStepIndicator',
  componentId: 'StyledStepIndicator',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  flex-shrink: 0;

  &[data-status='error'] {
    color: ${({ theme }) => theme.colors.error};
  }
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
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;

  & > * {
    margin-bottom: 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
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

const StyledChoiceSection = styled.div.withConfig({
  displayName: 'StyledChoiceSection',
  componentId: 'StyledChoiceSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledChoiceHeader = styled.div.withConfig({
  displayName: 'StyledChoiceHeader',
  componentId: 'StyledChoiceHeader',
})`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
`;

const StyledChoiceLabel = styled.span.withConfig({
  displayName: 'StyledChoiceLabel',
  componentId: 'StyledChoiceLabel',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};

  span {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const StyledChoiceHint = styled.span.withConfig({
  displayName: 'StyledChoiceHint',
  componentId: 'StyledChoiceHint',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  line-height: 1.35;
  overflow-wrap: anywhere;
`;

const StyledChoiceGrid = styled.div.withConfig({
  displayName: 'StyledChoiceGrid',
  componentId: 'StyledChoiceGrid',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 132px), 1fr));
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;

  &[data-density='compact'] {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 120px), 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    grid-template-columns: repeat(auto-fit, minmax(148px, 1fr));

    &[data-density='compact'] {
      grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    grid-template-columns: repeat(auto-fit, minmax(148px, 1fr));

    &[data-density='compact'] {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
  }

  @media (max-width: 420px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    &[data-density='compact'] {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 320px) {
    grid-template-columns: 1fr;

    &[data-density='compact'] {
      grid-template-columns: 1fr;
    }
  }
`;

const StyledChoiceOption = styled.button.withConfig({
  displayName: 'StyledChoiceOption',
  componentId: 'StyledChoiceOption',
})`
  min-width: 0;
  width: 100%;
  min-height: 50px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'label'
    'meta';
  align-items: center;
  gap: 2px;
  padding: 7px ${({ theme }) => theme.spacing.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-left-width: 3px;
  border-left-color: transparent;
  border-radius: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;

  &[data-density='compact'] {
    min-height: 40px;
    grid-template-areas: 'label';
    padding: 6px ${({ theme }) => theme.spacing.sm}px;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &[data-selected='true'] {
    border-color: ${({ theme }) => theme.colors.primary};
    border-left-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

const StyledChoiceText = styled.span.withConfig({
  displayName: 'StyledChoiceText',
  componentId: 'StyledChoiceText',
})`
  grid-area: label;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1.25;
  overflow-wrap: anywhere;
  white-space: normal;
`;

const StyledChoiceMeta = styled.span.withConfig({
  displayName: 'StyledChoiceMeta',
  componentId: 'StyledChoiceMeta',
})`
  grid-area: meta;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  line-height: 1.3;
  overflow-wrap: anywhere;
  white-space: normal;
`;

const StyledInlineError = styled.span.withConfig({
  displayName: 'StyledInlineError',
  componentId: 'StyledInlineError',
})`
  color: ${({ theme }) => theme.colors.error};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
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
  border-radius: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
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
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledSummaryGroup = styled.div.withConfig({
  displayName: 'StyledSummaryGroup',
  componentId: 'StyledSummaryGroup',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
`;

const StyledSummaryGroupTitle = styled.span.withConfig({
  displayName: 'StyledSummaryGroupTitle',
  componentId: 'StyledSummaryGroupTitle',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0;
`;

const StyledSummaryGrid = styled.div.withConfig({
  displayName: 'StyledSummaryGrid',
  componentId: 'StyledSummaryGrid',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 112px), 1fr));
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSummaryCard = styled.div.withConfig({
  displayName: 'StyledSummaryCard',
  componentId: 'StyledSummaryCard',
})`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
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
  display: block;
  margin-top: 2px;
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
`;

const StyledActionsRow = styled.div.withConfig({
  displayName: 'StyledActionsRow',
  componentId: 'StyledActionsRow',
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: env(safe-area-inset-bottom, 0px);
  width: 100%;

  & button {
    border-radius: 0;
  }

  @media (max-width: 420px) {
    gap: ${({ theme }) => theme.spacing.xs}px;

    & > * {
      flex: 1 1 0;
      min-width: 0;
    }
  }
`;

const StyledLoadingPane = styled.section.withConfig({
  displayName: 'StyledLoadingPane',
  componentId: 'StyledLoadingPane',
})`
  width: 100%;
  min-height: min(420px, 70vh);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledLoadingTitle = styled.h2.withConfig({
  displayName: 'StyledLoadingTitle',
  componentId: 'StyledLoadingTitle',
})`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledLoadingMessage = styled.p.withConfig({
  displayName: 'StyledLoadingMessage',
  componentId: 'StyledLoadingMessage',
})`
  margin: 0;
  max-width: 420px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: 1.5;
`;

const StyledMissingTests = styled.div.withConfig({
  displayName: 'StyledMissingTests',
  componentId: 'StyledMissingTests',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFFBF0'};
  color: ${({ theme }) => theme.colors.status?.warning?.text ?? '#856404'};
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.colors.warning ?? 'rgba(255, 149, 0, 0.35)'};
  border-left: 4px solid ${({ theme }) => theme.colors.warning ?? '#FF9500'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm ?? 14}px;
`;

const StyledMissingTestsTitle = styled.div.withConfig({
  displayName: 'StyledMissingTestsTitle',
  componentId: 'StyledMissingTestsTitle',
})`
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold ?? 600};
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm ?? 14}px;
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
  gap: ${({ theme }) => theme.spacing.md}px;
  min-width: 0;
`;

const StyledStepDescription = styled.p.withConfig({
  displayName: 'StyledStepDescription',
  componentId: 'StyledStepDescription',
})`
  margin: 0;
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
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
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
  border-radius: 0;
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
  StyledChoiceGrid,
  StyledChoiceHeader,
  StyledChoiceHint,
  StyledChoiceLabel,
  StyledChoiceMeta,
  StyledChoiceOption,
  StyledChoiceSection,
  StyledChoiceText,
  StyledContainer,
  StyledExpandButton,
  StyledSummaryWrap,
  StyledFieldGroup,
  StyledFieldGrid,
  StyledFieldGridFull,
  StyledFieldWithHint,
  StyledInlineError,
  StyledLoadingMessage,
  StyledLoadingPane,
  StyledLoadingTitle,
  StyledMissingTests,
  StyledMissingTestsHint,
  StyledMissingTestsList,
  StyledMissingTestsTitle,
  StyledModelRow,
  StyledObservationRow,
  StyledProgressSection,
  StyledStepper,
  StyledStepperConnector,
  StyledStepperItem,
  StyledStepperLabel,
  StyledStepperMarker,
  StyledStepperMeta,
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
  StyledSummaryCard,
  StyledSummaryGrid,
  StyledSummaryGroup,
  StyledSummaryGroupTitle,
  StyledSummaryHeader,
  StyledSummaryLabel,
  StyledSummaryPane,
  StyledSummaryTitle,
  StyledSummaryValue,
  StyledWizardCard,
  StyledWizardPane,
};

