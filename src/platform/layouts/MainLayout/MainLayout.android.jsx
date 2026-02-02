/**
 * MainLayout Component - Android
 * Main application layout for Android platform
 * File: MainLayout.android.jsx
 */

import React from 'react';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledHeader,
  StyledContentArea,
  StyledContent,
  StyledFooter,
  StyledBreadcrumbs,
} from './MainLayout.android.styles';

/**
 * MainLayout component for Android
 * @param {Object} props - MainLayout props
 * @param {React.ReactNode} props.children - Main content
 * @param {React.ReactNode} props.header - Header content
 * @param {React.ReactNode} props.footer - Footer content
 * @param {React.ReactNode} props.breadcrumbs - Breadcrumbs navigation
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const MainLayoutAndroid = ({
  children,
  header,
  footer,
  breadcrumbs,
  accessibilityLabel,
  testID,
}) => {
  const { t } = useI18n();

  return (
    <StyledContainer
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      accessibilityRole="main"
    >
      {header && (
        <StyledHeader accessibilityRole="banner">
          {header}
        </StyledHeader>
      )}
      {breadcrumbs && (
        <StyledBreadcrumbs accessibilityRole="navigation" accessibilityLabel={t('navigation.breadcrumbs.label')}>
          {breadcrumbs}
        </StyledBreadcrumbs>
      )}
      <StyledContentArea>
        <StyledContent>
          {children}
        </StyledContent>
      </StyledContentArea>
      {footer && (
        <StyledFooter accessibilityRole="contentinfo">
          {footer}
        </StyledFooter>
      )}
    </StyledContainer>
  );
};

export default MainLayoutAndroid;

