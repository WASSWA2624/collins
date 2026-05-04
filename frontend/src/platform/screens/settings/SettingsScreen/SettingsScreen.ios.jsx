/**
 * SettingsScreen Component - iOS
 * File: SettingsScreen.ios.jsx
 */
// 1. External dependencies
import React, { useState } from 'react';
import { View } from 'react-native';

// 2. Platform components
import { Text, Select, Switch, TextField, Button, ThemeControls, LanguageControls } from '@platform/components';

// 3. Hooks
import { useI18n } from '@hooks';

// 4. Styles
import {
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledSection,
  StyledSectionTitle,
} from './SettingsScreen.ios.styles';

// 5. Component hook
import useSettingsScreen from './useSettingsScreen';

const SettingsScreenIOS = () => {
  const { t } = useI18n();
  const {
    testIds,
    density,
    densityOptions,
    setDensity,
    aiEnabled,
    aiProviderId,
    aiModelId,
    aiKeyConfigured,
    aiProviderOptions,
    aiModelOptions,
    setAiEnabled,
    setAiProviderId,
    setAiModelId,
    saveAiApiKey,
    clearAiApiKey,
  } = useSettingsScreen();
  const [apiKeyDraft, setApiKeyDraft] = useState('');

  const handleSaveKey = async () => {
    const ok = await saveAiApiKey(apiKeyDraft);
    if (ok) setApiKeyDraft('');
  };

  return (
    <StyledContainer accessibilityLabel={t('settings.screen.label')} testID={testIds.screen}>
      <StyledContent>
        <StyledHeader>
          <Text accessibilityRole="header" variant="h1" testID={testIds.title}>
            {t('settings.title')}
          </Text>
        </StyledHeader>

        <>
          {/* Theme Selection */}
          <StyledSection testID={testIds.themeSection}>
            <StyledSectionTitle>
              <Text variant="h3" testID={testIds.themeLabel}>
                {t('settings.theme.label')}
              </Text>
            </StyledSectionTitle>
            <ThemeControls testID={testIds.themeSelector} />
          </StyledSection>

          {/* Density Mode Selection */}
          <StyledSection testID={testIds.densitySection}>
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
          <StyledSection testID={testIds.languageSection}>
            <StyledSectionTitle>
              <Text variant="h3" testID={testIds.languageLabel}>
                {t('settings.language.label')}
              </Text>
            </StyledSectionTitle>
            <LanguageControls testID={testIds.languageSelector} />
          </StyledSection>

          {/* AI decision support */}
          <StyledSection testID={testIds.aiSection}>
            <StyledSectionTitle>
              <Text variant="h3">{t('settings.ai.sectionLabel')}</Text>
            </StyledSectionTitle>
            <Switch
              value={aiEnabled}
              onValueChange={setAiEnabled}
              label={t('settings.ai.enableLabel')}
              accessibilityLabel={t('settings.ai.enableLabel')}
              accessibilityHint={t('settings.ai.enableHint')}
              testID={testIds.aiEnableToggle}
            />
            <Select
              label={t('settings.ai.providerLabel')}
              accessibilityLabel={t('settings.ai.providerLabel')}
              accessibilityHint={t('settings.ai.providerHint')}
              options={aiProviderOptions}
              value={aiProviderId}
              onValueChange={setAiProviderId}
              testID={testIds.aiProviderSelector}
            />
            <TextField
              label={t('settings.ai.apiKeyLabel')}
              placeholder={t('settings.ai.apiKeyPlaceholder')}
              value={apiKeyDraft}
              onChangeText={setApiKeyDraft}
              secureTextEntry
              testID={testIds.aiApiKeyInput}
            />
            <View style={{ flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button variant="primary" onPress={handleSaveKey} testID={testIds.aiApiKeySave}>
                  {t('settings.ai.apiKeySave')}
                </Button>
                <Button variant="outline" onPress={clearAiApiKey} testID={testIds.aiApiKeyClear}>
                  {t('settings.ai.apiKeyClear')}
                </Button>
              </View>
              <Text variant="caption">{t(aiKeyConfigured ? 'settings.ai.keyConfigured' : 'settings.ai.keyNotConfigured')}</Text>
            </View>
            <Select
              label={t('settings.ai.modelLabel')}
              accessibilityLabel={t('settings.ai.modelLabel')}
              accessibilityHint={t('settings.ai.modelHint')}
              options={aiModelOptions}
              value={aiModelId}
              onValueChange={setAiModelId}
              testID={testIds.aiModelSelector}
            />
          </StyledSection>
        </>
      </StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenIOS;
