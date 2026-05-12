/**
 * HelpScreen - Android (P013)
 */
import React from 'react';
import { Text, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import useHelpScreen from './useHelpScreen';
import { StyledContainer, StyledContent, StyledSection, StyledItem } from './HelpScreen.android.styles';

const HelpScreenAndroid = () => {
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
    <StyledContainer testID={testIds.screen} accessibilityLabel={t('settings.help.accessibilityLabel')}>
      <StyledContent>
        <Text variant="h1">{t('settings.help.title')}</Text>
        <TextField
          label={t('settings.help.searchPlaceholder')}
          value={query}
          onChangeText={setSearchQuery}
          placeholder={t('settings.help.searchPlaceholder')}
          accessibilityLabel={t('settings.help.searchPlaceholder')}
          testID={testIds.search}
        />
        {!hasResults ? (
          <Text variant="body" testID={testIds.empty}>{t('settings.help.states.empty')}</Text>
        ) : (
          <>
            {glossaryKeys.length > 0 && (
              <StyledSection testID={testIds.glossary}>
                <Text variant="h3">{t('settings.help.sections.glossary')}</Text>
                {glossaryKeys.map((key) => (
                  <StyledItem key={key}>
                    <Text variant="label">{key}</Text>
                    <Text variant="body">{glossaryLabel(key)}</Text>
                  </StyledItem>
                ))}
              </StyledSection>
            )}
            {troubleshootingKeys.length > 0 && (
              <StyledSection testID={testIds.troubleshooting}>
                <Text variant="h3">{t('settings.help.sections.troubleshooting')}</Text>
                {troubleshootingKeys.map((key) => (
                  <StyledItem key={key}>
                    <Text variant="label">{troubleshootingTitle(key)}</Text>
                    <Text variant="body">{troubleshootingBody(key)}</Text>
                  </StyledItem>
                ))}
              </StyledSection>
            )}
            {guideKeys.length > 0 && (
              <StyledSection testID={testIds.guides}>
                <Text variant="h3">{t('settings.help.sections.guides')}</Text>
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

export default HelpScreenAndroid;
