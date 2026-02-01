/**
 * SettingsScreen Component - Web
 * File: SettingsScreen.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components
import { Text, Select, ThemeControls, LanguageControls } from '@platform/components';

// 3. Hooks
import { useI18n } from '@hooks';

// 4. Styles
import {
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledSection,
  StyledSectionTitle,
} from './SettingsScreen.web.styles';

// 5. Component hook
import useSettingsScreen from './useSettingsScreen';

const SettingsScreenWeb = () => {
  const { t } = useI18n();
  const { testIds, density, densityOptions, setDensity } = useSettingsScreen();

  return (
    <StyledContainer aria-label={t('settings.screen.label')} data-testid={testIds.screen}>
      <StyledContent>
        <StyledHeader>
          <Text accessibilityRole="header" variant="h1" data-testid={testIds.title}>
            {t('settings.title')}
          </Text>
        </StyledHeader>

        <>
          {/* Theme Selection */}
          <StyledSection data-testid={testIds.themeSection}>
            <StyledSectionTitle>
              <Text variant="h3" testID={testIds.themeLabel}>
                {t('settings.theme.label')}
              </Text>
            </StyledSectionTitle>
            <ThemeControls testID={testIds.themeSelector} />
          </StyledSection>

          {/* Density Mode Selection */}
          <StyledSection data-testid={testIds.densitySection}>
            <StyledSectionTitle>
              <Text variant="h3" testID={testIds.densityLabel}>
                {t('settings.density.label')}
              </Text>
            </StyledSectionTitle>
            <Select
              label={t('settings.density.label')}
              accessibilityLabel={t('settings.density.accessibilityLabel')}
              accessibilityHint={t('settings.density.hint')}
              options={densityOptions}
              value={density}
              onValueChange={setDensity}
              testID={testIds.densitySelector}
            />
          </StyledSection>

          {/* Language Selection */}
          <StyledSection data-testid={testIds.languageSection}>
            <StyledSectionTitle>
              <Text variant="h3" testID={testIds.languageLabel}>
                {t('settings.language.label')}
              </Text>
            </StyledSectionTitle>
            <LanguageControls testID={testIds.languageSelector} />
          </StyledSection>
        </>
      </StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenWeb;
