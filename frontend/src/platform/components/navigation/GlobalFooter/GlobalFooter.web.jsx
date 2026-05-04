/**
 * GlobalFooter Component - Web
 * Minimal footer: app name, logo, copyright, support email & phone
 * File: GlobalFooter.web.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '@config/env';
import AppLogo from '@platform/components/display/AppLogo';
import {
  StyledFooter,
  StyledFooterRow,
  StyledFooterLogo,
  StyledFooterBrand,
  StyledFooterAppName,
  StyledFooterCopyright,
  StyledFooterLink,
  StyledFooterSeparator,
} from './GlobalFooter.web.styles';

const GlobalFooterWeb = ({
  accessibilityLabel,
  testID,
  className,
  ...rest
}) => {
  const { t } = useI18n();
  const appName = t('app.name');
  const year = new Date().getFullYear();
  const copyright = t('navigation.footer.copyright', { year, appName });
  const showEmail = Boolean(SUPPORT_EMAIL);
  const showPhone = Boolean(SUPPORT_PHONE);

  return (
    <StyledFooter
      role="contentinfo"
      aria-label={accessibilityLabel || t('navigation.footer.title')}
      data-testid={testID}
      testID={testID}
      className={className}
      {...rest}
    >
      <StyledFooterRow>
        <StyledFooterBrand>
          <StyledFooterLogo aria-hidden="true"><AppLogo size="sm" /></StyledFooterLogo>
          <StyledFooterAppName>{appName}</StyledFooterAppName>
        </StyledFooterBrand>
        <StyledFooterCopyright>{copyright}</StyledFooterCopyright>
        {showEmail && (
          <>
            <StyledFooterSeparator aria-hidden="true">·</StyledFooterSeparator>
            <StyledFooterLink
              href={`mailto:${SUPPORT_EMAIL}`}
              aria-label={t('navigation.footer.supportEmail')}
              data-testid={testID ? `${testID}-email` : undefined}
            >
              {SUPPORT_EMAIL}
            </StyledFooterLink>
          </>
        )}
        {showPhone && (
          <>
            <StyledFooterSeparator aria-hidden="true">·</StyledFooterSeparator>
            <StyledFooterLink
              href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}
              aria-label={t('navigation.footer.supportPhone')}
              data-testid={testID ? `${testID}-phone` : undefined}
            >
              {SUPPORT_PHONE}
            </StyledFooterLink>
          </>
        )}
      </StyledFooterRow>
    </StyledFooter>
  );
};

export default GlobalFooterWeb;
