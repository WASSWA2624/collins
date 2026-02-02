/**
 * HelpScreen - Web (P013)
 */
import React from 'react';
import { Text, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import useHelpScreen from './useHelpScreen';
import { StyledContainer, StyledContent, StyledSection, StyledSectionTitle, StyledItem } from './HelpScreen.web.styles';

const HelpScreenWeb = () => {
  const { t } = useI18n();
  const {
    query,
    setSearchQuery,
    glossaryKeys,
    troubleshootingKeys,
    guideKeys,
    hasResults,
    testIds,
    glossaryLabel,
    troubleshootingTitle,
    troubleshootingBody,
    guideLabel,
  } = useHelpScreen();

  return (
    <StyledContainer aria-label={t('settings.help.accessibilityLabel')} data-testid={testIds.screen} role="main">
      <StyledContent>
        <Text as="h1" variant="h1">{t('settings.help.title')}</Text>
        <TextField
          label={t('settings.help.searchPlaceholder')}
          value={query}
          onChangeText={setSearchQuery}
          placeholder={t('settings.help.searchPlaceholder')}
          accessibilityLabel={t('settings.help.searchPlaceholder')}
          testID={testIds.search}
        />
        {!hasResults ? (
          <Text variant="body" data-testid={testIds.empty}>{t('settings.help.states.empty')}</Text>
        ) : (
          <>
            {glossaryKeys.length > 0 && (
              <StyledSection data-testid={testIds.glossary}>
                <StyledSectionTitle>{t('settings.help.sections.glossary')}</StyledSectionTitle>
                {glossaryKeys.map((key) => (
                  <StyledItem key={key}>
                    <Text variant="label">{key}</Text>
                    <Text variant="body">{glossaryLabel(key)}</Text>
                  </StyledItem>
                ))}
              </StyledSection>
            )}
            {troubleshootingKeys.length > 0 && (
              <StyledSection data-testid={testIds.troubleshooting}>
                <StyledSectionTitle>{t('settings.help.sections.troubleshooting')}</StyledSectionTitle>
                {troubleshootingKeys.map((key) => (
                  <StyledItem key={key}>
                    <Text variant="label">{troubleshootingTitle(key)}</Text>
                    <Text variant="body">{troubleshootingBody(key)}</Text>
                  </StyledItem>
                ))}
              </StyledSection>
            )}
            {guideKeys.length > 0 && (
              <StyledSection data-testid={testIds.guides}>
                <StyledSectionTitle>{t('settings.help.sections.guides')}</StyledSectionTitle>
                {guideKeys.map((key) => (
                  <StyledItem key={key}>
                    <Text variant="body">{guideLabel(key)}</Text>
                  </StyledItem>
                ))}
              </StyledSection>
            )}
          </>
        )}
      </StyledContent>
    </StyledContainer>
  );
};

export default HelpScreenWeb;
