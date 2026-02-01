/**
 * SettingsScreen Component - Web
 * File: SettingsScreen.web.jsx
 */
// 1. External dependencies
import React, { useState } from 'react';

// 2. Platform components
import { Text, Select, Switch, TextField, Button, ThemeControls, LanguageControls, Stack } from '@platform/components';

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
  const {
    testIds,
    density,
    densityOptions,
    setDensity,
    aiEnabled,
    aiModelId,
    aiKeyConfigured,
    aiModelOptions,
    setAiEnabled,
    setAiModelId,
    saveAiApiKey,
    clearAiApiKey,
  } = useSettingsScreen();
  const [apiKeyDraft, setApiKeyDraft] = useState('');

  const handleSaveKey = async () => {
    const ok = await saveAiApiKey(apiKeyDraft);
    if (ok) setApiKeyDraft('');
  };

  const handleClearKey = async () => {
    await clearAiApiKey();
    setApiKeyDraft('');
  };

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

          {/* AI decision support (opt-in) */}
          <StyledSection data-testid={testIds.aiSection}>
            <StyledSectionTitle>
              <Text variant="h3" testID={testIds.aiEnableToggle}>
                {t('settings.ai.sectionLabel')}
              </Text>
            </StyledSectionTitle>
            <Stack spacing="md">
              <Switch
                value={aiEnabled}
                onValueChange={setAiEnabled}
                label={t('settings.ai.enableLabel')}
                accessibilityLabel={t('settings.ai.enableLabel')}
                accessibilityHint={t('settings.ai.enableHint')}
                testID={testIds.aiEnableToggle}
              />
              <TextField
                label={t('settings.ai.apiKeyLabel')}
                placeholder={t('settings.ai.apiKeyPlaceholder')}
                value={apiKeyDraft}
                onChange={(e) => setApiKeyDraft(e?.target?.value ?? '')}
                type="password"
                autoComplete="off"
                testID={testIds.aiApiKeyInput}
                data-testid={testIds.aiApiKeyInput}
              />
              <Stack direction="horizontal" spacing="sm">
                <Button variant="primary" onPress={handleSaveKey} testID={testIds.aiApiKeySave} data-testid={testIds.aiApiKeySave}>
                  {t('settings.ai.apiKeySave')}
                </Button>
                <Button variant="outline" onPress={handleClearKey} testID={testIds.aiApiKeyClear} data-testid={testIds.aiApiKeyClear}>
                  {t('settings.ai.apiKeyClear')}
                </Button>
                {aiKeyConfigured && <Text variant="caption" color="text.secondary">{t('settings.ai.keyConfigured')}</Text>}
              </Stack>
              <Select
                label={t('settings.ai.modelLabel')}
                accessibilityLabel={t('settings.ai.modelLabel')}
                accessibilityHint={t('settings.ai.modelHint')}
                options={aiModelOptions}
                value={aiModelId}
                onValueChange={setAiModelId}
                testID={testIds.aiModelSelector}
              />
            </Stack>
          </StyledSection>
        </>
      </StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenWeb;
