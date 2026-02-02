/**
 * AppFrame Component - iOS
 * Base application frame with slots for header, footer, and overlays
 * File: AppFrame.ios.jsx
 */

import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import { useI18n } from '@hooks';
import {
  StyledBanner,
  StyledBreadcrumbs,
  StyledContainer,
  StyledContent,
  StyledFooter,
  StyledHeader,
  StyledOverlay,
  StyledScrollView,
  StyledSidebar,
} from './AppFrame.ios.styles';
import useAppFrame from './useAppFrame';

/**
 * AppFrame component for iOS
 * @param {Object} props - AppFrame props
 * @param {React.ReactNode} props.children - Main content
 * @param {React.ReactNode} props.header - Header slot
 * @param {React.ReactNode} props.footer - Footer slot
 * @param {React.ReactNode} props.sidebar - Sidebar slot
 * @param {React.ReactNode} props.breadcrumbs - Breadcrumbs slot
 * @param {React.ReactNode} props.overlay - Overlay slot
 * @param {React.ReactNode} props.banner - Banner slot
 * @param {React.ReactNode} props.notices - Notices slot
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const AppFrameIOS = ({
  children,
  header,
  footer,
  sidebar,
  breadcrumbs,
  overlay,
  banner,
  notices,
  accessibilityLabel,
  testID,
}) => {
  const { t } = useI18n();
  const theme = useTheme();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const { hasBanner, hasBreadcrumbs, hasFooter, hasHeader, hasOverlay, hasSidebar } = useAppFrame({
    header,
    footer,
    sidebar,
    breadcrumbs,
    overlay,
    banner,
  });

  const scrollContentStyle = useMemo(
    () => ({
      flexGrow: 1,
      paddingBottom: bottomInset + (theme?.spacing?.md ?? 16),
    }),
    [bottomInset, theme?.spacing?.md]
  );

  return (
    <StyledContainer accessibilityRole="main" accessibilityLabel={accessibilityLabel} testID={testID}>
      {hasHeader && (
        <StyledHeader accessibilityRole="banner">
          {header}
        </StyledHeader>
      )}
      {hasBanner && (
        <StyledBanner accessibilityRole="region">
          {banner}
        </StyledBanner>
      )}
      {hasBreadcrumbs && (
        <StyledBreadcrumbs accessibilityRole="navigation" accessibilityLabel={t('navigation.breadcrumbs.label')}>
          {breadcrumbs}
        </StyledBreadcrumbs>
      )}
      <StyledScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={scrollContentStyle}
      >
        {hasSidebar && <StyledSidebar>{sidebar}</StyledSidebar>}
        <StyledContent>{children}</StyledContent>
      </StyledScrollView>
      {hasFooter && (
        <StyledFooter accessibilityRole="contentinfo" bottomInset={bottomInset}>
          {footer}
        </StyledFooter>
      )}
      {notices}
      {hasOverlay && <StyledOverlay>{overlay}</StyledOverlay>}
    </StyledContainer>
  );
};

export default AppFrameIOS;
