/**
 * AuthFormLayout Web Styles
 * Styled-components for Web platform
 * File: AuthFormLayout.web.styles.jsx
 */
import styled from 'styled-components';

const resolveMaxWidth = (theme, size) => {
  const base = theme.spacing.xxl;
  const widths = {
    sm: base * 10,
    md: base * 12,
    lg: base * 14,
  };
  return widths[size] || widths.md;
};

const StyledAuthFormContainer = styled.div.withConfig({
  displayName: 'StyledAuthFormContainer',
  componentId: 'StyledAuthFormContainer',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md}px;
  ${({ $isTwoColumn, theme }) =>
    $isTwoColumn
      ? `
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
    padding: 0;
    margin: 0;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    max-width: 100%;
  `
      : ''}
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    padding: ${({ theme, $isTwoColumn }) => ($isTwoColumn ? '0' : `${theme.spacing.sm}px`)};
    align-items: ${({ $isTwoColumn }) => ($isTwoColumn ? 'stretch' : 'flex-start')};
    justify-content: ${({ $isTwoColumn }) => ($isTwoColumn ? 'flex-start' : 'center')};
    padding-top: ${({ theme, $isTwoColumn }) => ($isTwoColumn ? '0' : `${theme.spacing.lg}px`)};
    ${({ $isTwoColumn }) => ($isTwoColumn ? 'margin: 0;' : '')}
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile * 1.5}px) {
    padding: ${({ theme, $isTwoColumn }) => ($isTwoColumn ? '0' : `${theme.spacing.xs}px`)};
    padding-top: ${({ theme, $isTwoColumn }) => ($isTwoColumn ? '0' : `${theme.spacing.md}px`)};
    ${({ $isTwoColumn }) => ($isTwoColumn ? 'margin: 0;' : '')}
  }
`;

const StyledAuthFormCardWrapper = styled.div.withConfig({
  displayName: 'StyledAuthFormCardWrapper',
  componentId: 'StyledAuthFormCardWrapper',
})`
  width: 100%;
  max-width: ${({ theme, size }) => resolveMaxWidth(theme, size)}px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile * 1.5}px) {
    max-width: 100%;
  }
  
  /* Reduce Card padding for compact layout */
  article {
    padding: ${({ theme }) => theme.spacing.sm}px !important;
  }
  
  /* Reduce Card header padding */
  article > div:first-child {
    padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px !important;
  }
  
  /* Reduce Card body padding */
  article > div:nth-child(2) {
    padding: ${({ theme }) => theme.spacing.sm}px !important;
  }
  
  /* Reduce Card footer padding */
  article > div:last-child {
    padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.sm}px !important;
  }
`;

const StyledAuthFormStatus = styled.div.withConfig({
  displayName: 'StyledAuthFormStatus',
  componentId: 'StyledAuthFormStatus',
})`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledAuthFormActions = styled.div.withConfig({
  displayName: 'StyledAuthFormActions',
  componentId: 'StyledAuthFormActions',
})`
  width: 100%;
`;

const StyledAuthFormFooter = styled.div.withConfig({
  displayName: 'StyledAuthFormFooter',
  componentId: 'StyledAuthFormFooter',
})`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const StyledTwoColumnContainer = styled.div.withConfig({
  displayName: 'StyledTwoColumnContainer',
  componentId: 'StyledTwoColumnContainer',
})`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  max-width: 100%;
  
  /* Desktop and above - two columns with padding for visual distinction */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
    flex-direction: row;
    padding: ${({ theme }) => theme.spacing.lg}px;
    box-sizing: border-box;
    height: 100vh;
    align-items: stretch;
  }
  
  /* Tablet - stacked with padding for visual distinction */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) and (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    padding: ${({ theme }) => theme.spacing.md}px;
    box-sizing: border-box;
  }
  
  /* Mobile - no padding, full width */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    padding: 0;
  }
`;

const StyledLeftPanel = styled.div.withConfig({
  displayName: 'StyledLeftPanel',
  componentId: 'StyledLeftPanel',
})`
  width: 50%;
  height: 100%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  padding: ${({ theme }) => theme.spacing.xxl}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.inverse};
  position: relative;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  box-shadow: ${({ theme }) => {
    if (theme.shadows?.lg) {
      const shadow = theme.shadows.lg;
      return `${shadow.shadowOffset.width}px ${shadow.shadowOffset.height}px ${shadow.shadowRadius * 2}px rgba(0, 0, 0, ${shadow.shadowOpacity * 0.3})`;
    }
    return '0 4px 20px rgba(0, 0, 0, 0.1)';
  }};
  
  /* Desktop (1024px - 1439px) */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) and (max-width: ${({ theme }) => theme.breakpoints.large - 1}px) {
    width: 50%;
    height: calc(100vh - ${({ theme }) => theme.spacing.lg * 2}px);
    padding: ${({ theme }) => theme.spacing.xxl}px;
    margin: ${({ theme }) => theme.spacing.lg}px 0;
  }
  
  /* Large Desktop (≥ 1440px) */
  @media (min-width: ${({ theme }) => theme.breakpoints.large}px) {
    width: 50%;
    height: calc(100vh - ${({ theme }) => theme.spacing.lg * 2}px);
    padding: ${({ theme }) => theme.spacing.xxl}px;
    margin: ${({ theme }) => theme.spacing.lg}px 0;
  }
  
  /* Tablet (768px - 1023px) */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) and (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    width: 100%;
    height: auto;
    min-height: ${({ theme }) => theme.spacing.xxl * 4 + theme.spacing.md}px;
    padding: ${({ theme }) => theme.spacing.lg}px;
    margin: ${({ theme }) => theme.spacing.md}px 0;
    border-radius: ${({ theme }) => theme.radius.md}px;
  }
  
  /* Mobile (481px - 767px) */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile * 1.5 + 1}px) and (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    width: 100%;
    height: auto;
    min-height: ${({ theme }) => theme.spacing.xxl * 3 + theme.spacing.sm}px;
    padding: ${({ theme }) => theme.spacing.md}px;
  }
  
  /* Small Mobile (320px - 480px) */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile * 1.5}px) {
    width: 100%;
    height: auto;
    min-height: ${({ theme }) => theme.spacing.xxl * 2 + theme.spacing.md}px;
    padding: ${({ theme }) => theme.spacing.sm}px;
  }
  
  /* Landscape orientation on mobile/tablet */
  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) and (orientation: landscape) {
    min-height: ${({ theme }) => theme.spacing.xxl * 2 + theme.spacing.md}px;
    padding: ${({ theme }) => theme.spacing.md}px;
  }
  
  /* Very small landscape screens */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) and (orientation: landscape) and (max-height: 600px) {
    min-height: ${({ theme }) => theme.spacing.xxl * 1.5}px;
    padding: ${({ theme }) => theme.spacing.sm}px;
  }
  
  /* Decorative shapes - Desktop and Large Desktop */
  &::before {
    content: '';
    position: absolute;
    width: ${({ theme }) => theme.spacing.xxl * 4 + theme.spacing.md}px;
    height: ${({ theme }) => theme.spacing.xxl * 4 + theme.spacing.md}px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    top: -${({ theme }) => theme.spacing.xxl}px;
    right: -${({ theme }) => theme.spacing.xxl}px;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: ${({ theme }) => theme.spacing.xxl * 3 + theme.spacing.sm}px;
    height: ${({ theme }) => theme.spacing.xxl * 3 + theme.spacing.sm}px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    bottom: -${({ theme }) => theme.spacing.lg}px;
    left: -${({ theme }) => theme.spacing.lg}px;
  }
  
  /* Hide decorative shapes on tablet */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) and (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    &::before,
    &::after {
      opacity: 0.5;
      transform: scale(0.7);
    }
  }
  
  /* Hide decorative shapes on mobile */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    &::before,
    &::after {
      display: none;
    }
  }
`;

const StyledRightPanel = styled.div.withConfig({
  displayName: 'StyledRightPanel',
  componentId: 'StyledRightPanel',
})`
  width: 50%;
  height: 100%;
  background: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xl}px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  box-shadow: ${({ theme }) => {
    if (theme.shadows?.lg) {
      const shadow = theme.shadows.lg;
      return `${shadow.shadowOffset.width}px ${shadow.shadowOffset.height}px ${shadow.shadowRadius * 2}px rgba(0, 0, 0, ${shadow.shadowOpacity * 0.2})`;
    }
    return '0 4px 20px rgba(0, 0, 0, 0.08)';
  }};
  
  /* Desktop (1024px - 1439px) */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) and (max-width: ${({ theme }) => theme.breakpoints.large - 1}px) {
    width: 50%;
    height: calc(100vh - ${({ theme }) => theme.spacing.lg * 2}px);
    max-height: calc(100vh - ${({ theme }) => theme.spacing.lg * 2}px);
    padding: ${({ theme }) => theme.spacing.xl + theme.spacing.md}px;
    margin: ${({ theme }) => theme.spacing.lg}px 0;
    padding-top: ${({ theme }) => theme.spacing.xl}px;
    padding-bottom: ${({ theme }) => theme.spacing.xl}px;
  }
  
  /* Large Desktop (≥ 1440px) */
  @media (min-width: ${({ theme }) => theme.breakpoints.large}px) {
    width: 50%;
    height: calc(100vh - ${({ theme }) => theme.spacing.lg * 2}px);
    max-height: calc(100vh - ${({ theme }) => theme.spacing.lg * 2}px);
    padding: ${({ theme }) => theme.spacing.xxl}px;
    margin: ${({ theme }) => theme.spacing.lg}px 0;
    padding-top: ${({ theme }) => theme.spacing.xxl}px;
    padding-bottom: ${({ theme }) => theme.spacing.xxl}px;
  }
  
  /* Tablet (768px - 1023px) */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) and (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    width: 100%;
    height: auto;
    max-height: calc(100vh - ${({ theme }) => theme.spacing.md * 2}px);
    min-height: calc(100vh - ${({ theme }) => theme.spacing.xxl * 4 + theme.spacing.md + theme.spacing.md * 2}px);
    padding: ${({ theme }) => theme.spacing.lg}px;
    margin: ${({ theme }) => theme.spacing.md}px 0;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: ${({ theme }) => theme.radius.md}px;
    padding-top: ${({ theme }) => theme.spacing.lg}px;
    padding-bottom: ${({ theme }) => theme.spacing.lg}px;
  }
  
  /* Mobile (481px - 767px) */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile * 1.5 + 1}px) and (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    width: 100%;
    height: auto;
    max-height: 100vh;
    min-height: calc(100vh - ${({ theme }) => theme.spacing.xxl * 3 + theme.spacing.sm}px);
    padding: ${({ theme }) => theme.spacing.md}px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: ${({ theme }) => theme.spacing.md}px;
    padding-bottom: ${({ theme }) => theme.spacing.md}px;
  }
  
  /* Small Mobile (320px - 480px) */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile * 1.5}px) {
    width: 100%;
    height: auto;
    max-height: 100vh;
    min-height: calc(100vh - ${({ theme }) => theme.spacing.xxl * 2 + theme.spacing.md}px);
    padding: ${({ theme }) => theme.spacing.md}px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: ${({ theme }) => theme.spacing.md}px;
    padding-bottom: ${({ theme }) => theme.spacing.md}px;
  }
  
  /* Landscape orientation on mobile/tablet */
  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) and (orientation: landscape) {
    max-height: 100vh;
    min-height: calc(100vh - ${({ theme }) => theme.spacing.xxl * 2 + theme.spacing.md}px);
    padding: ${({ theme }) => theme.spacing.md}px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: ${({ theme }) => theme.spacing.md}px;
    padding-bottom: ${({ theme }) => theme.spacing.md}px;
  }
  
  /* Very small landscape screens */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) and (orientation: landscape) and (max-height: 600px) {
    max-height: 100vh;
    min-height: calc(100vh - ${({ theme }) => theme.spacing.xxl * 1.5}px);
    padding: ${({ theme }) => theme.spacing.sm}px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: ${({ theme }) => theme.spacing.sm}px;
    padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  }
`;

const StyledWelcomeContent = styled.div.withConfig({
  displayName: 'StyledWelcomeContent',
  componentId: 'StyledWelcomeContent',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 12.5}px;
  position: relative;
  z-index: 1;
  text-align: center;
  
  /* Desktop and Large Desktop - keep max-width */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
    max-width: ${({ theme }) => theme.spacing.xxl * 12.5}px;
  }
  
  /* Tablet and Mobile - full width */
  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    max-width: 100%;
  }
`;

const StyledFormContent = styled.div.withConfig({
  displayName: 'StyledFormContent',
  componentId: 'StyledFormContent',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 10 + theme.spacing.md}px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 0 auto;
  min-width: 0; /* Prevents flex items from overflowing */
  box-sizing: border-box;
  gap: ${({ theme }) => theme.spacing.sm}px; /* Consistent spacing between form elements */
  padding-top: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.md}px;
  
  /* Large Desktop (≥ 1440px) - increased max-width with centered spacing */
  @media (min-width: ${({ theme }) => theme.breakpoints.large}px) {
    max-width: ${({ theme }) => theme.spacing.xxl * 12.5}px;
    padding: 0 ${({ theme }) => theme.spacing.md}px;
  }
  
  /* Desktop (1024px - 1439px) - standard max-width with centered spacing */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) and (max-width: ${({ theme }) => theme.breakpoints.large - 1}px) {
    max-width: ${({ theme }) => theme.spacing.xxl * 10 + theme.spacing.md}px;
    padding: 0 ${({ theme }) => theme.spacing.sm}px;
  }
  
  /* Tablet - full width with side padding */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) and (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    max-width: 100%;
    padding: 0 ${({ theme }) => theme.spacing.md}px;
    box-sizing: border-box;
  }
  
  /* Mobile - full width with side padding */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    max-width: 100%;
    padding: 0 ${({ theme }) => theme.spacing.sm}px;
    box-sizing: border-box;
  }
`;

const StyledWelcomeTitle = styled.div.withConfig({
  displayName: 'StyledWelcomeTitle',
  componentId: 'StyledWelcomeTitle',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl + theme.spacing.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  color: inherit;
`;

const StyledWelcomeDescription = styled.div.withConfig({
  displayName: 'StyledWelcomeDescription',
  componentId: 'StyledWelcomeDescription',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.md - 1}px;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: rgba(255, 255, 255, 0.85);
  max-width: 80%;
`;

const StyledFormTitle = styled.div.withConfig({
  displayName: 'StyledFormTitle',
  componentId: 'StyledFormTitle',
})`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
  
  /* Desktop and Large Desktop - full size */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
    margin-bottom: ${({ theme }) => theme.spacing.xl}px;
  }
  
  /* Tablet - slightly reduced */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) and (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
    margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  }
  
  /* Mobile - reduced */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
    margin-bottom: ${({ theme }) => theme.spacing.md}px;
    letter-spacing: 0.5px;
  }
`;

export {
  StyledAuthFormContainer,
  StyledAuthFormCardWrapper,
  StyledAuthFormStatus,
  StyledAuthFormActions,
  StyledAuthFormFooter,
  StyledTwoColumnContainer,
  StyledLeftPanel,
  StyledRightPanel,
  StyledWelcomeContent,
  StyledFormContent,
  StyledWelcomeTitle,
  StyledWelcomeDescription,
  StyledFormTitle,
};


