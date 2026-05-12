/**
 * DisclaimerLayout - Web
 * Minimal layout for disclaimer screen: centered header, no sidebar/TabBar
 * File: DisclaimerLayout.web.jsx
 */
import React from 'react';
import Text from '@platform/components/display/Text';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledHeader,
  StyledHeaderTitle,
  StyledContent,
} from './DisclaimerLayout.web.styles';

const DisclaimerLayoutWeb = ({ children, accessibilityLabel, testID }) => {
  const { t } = useI18n();

  return (
    <StyledContainer
      aria-label={accessibilityLabel ?? t('settings.disclaimer.screen.label')}
      data-testid={testID ?? 'disclaimer-layout'}
    >
      <StyledHeader>
        <StyledHeaderTitle>
          <Text as="h1" variant="h2" data-testid="disclaimer-title">{t('settings.disclaimer.title')}</Text>
        </StyledHeaderTitle>
      </StyledHeader>
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  );
};

export default DisclaimerLayoutWeb;
