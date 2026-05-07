/**
 * SettingsScreenContent
 * Shared cross-platform settings screen composition.
 */
import React from 'react';
import {
  Button,
  LanguageControls,
  Select,
  Stack,
  Switch,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useSettingsScreen from './useSettingsScreen';

const boolTextKey = (value) => (value ? 'common.on' : 'common.off');
const fullWidthStyle = { width: '100%' };
const rowLabelStyle = { flex: 1, minWidth: 0 };

const SettingsRow = ({ label, value, testID }) => (
  <Stack direction="horizontal" spacing="sm" align="center" justify="space-between" wrap testID={testID} style={fullWidthStyle}>
    <Text variant="body" style={rowLabelStyle}>{label}</Text>
    <Text variant="label">{value}</Text>
  </Stack>
);

const SwitchRow = ({
  label,
  hint,
  value,
  onValueChange,
  disabled = false,
  testID,
}) => (
  <Stack direction="horizontal" spacing="md" align="center" justify="space-between" wrap style={fullWidthStyle}>
    <Stack spacing="xs" style={rowLabelStyle}>
      <Text variant="body">{label}</Text>
      {hint ? <Text variant="caption" color="text.secondary">{hint}</Text> : null}
    </Stack>
    <Switch
      value={Boolean(value)}
      onValueChange={onValueChange}
      disabled={disabled}
      accessibilityLabel={label}
      accessibilityHint={hint}
      testID={testID}
    />
  </Stack>
);

const Section = ({ StyledSection, StyledSectionTitle, testProps, testID, title, children }) => (
  <StyledSection {...testProps(testID)}>
    <StyledSectionTitle>
      <Text variant="h3">{title}</Text>
    </StyledSectionTitle>
    <Stack spacing="md">{children}</Stack>
  </StyledSection>
);

const SettingsScreenContent = ({ platform, styles }) => {
  const { t } = useI18n();
  const {
    testIds,
    isLoading,
    isSaving,
    errorCode,
    errorMessageKey,
    statusMessageKey,
    refreshSettings,
    userSettings,
    facilitySettings,
    accountDraft,
    accountErrors,
    setAccountField,
    saveAccountSettings,
    facilityOptions,
    hasAssignedFacilities,
    activeFacilityValue,
    setActiveFacility,
    activeRole,
    roleOptions,
    setActiveRole,
    approvedRoleLabels,
    activeFacilityRoleLabels,
    canManageActiveFacility,
    canSeeGovernance,
    isOnline,
    isSyncing,
    networkQuality,
    theme,
    themeOptions,
    setThemePreference,
    density,
    densityOptions,
    setDensity,
    footerVisible,
    setFooterVisible,
    syncIntervalOptions,
    purgeDraftOptions,
    referenceScopeOptions,
    updateOfflineSyncPreference,
    updatePrivacyControl,
    updateFacilitySection,
  } = useSettingsScreen();

  const {
    StyledContainer,
    StyledContent,
    StyledHeader,
    StyledSection,
    StyledSectionTitle,
  } = styles;

  const isTestEnv = Boolean(process.env.JEST_WORKER_ID);
  const testProps = (id) => (
    platform === 'web'
      ? { 'data-testid': id, ...(isTestEnv ? { testID: id } : {}) }
      : { testID: id }
  );
  const rootProps = platform === 'web'
    ? { 'aria-label': t('settings.screen.label'), ...testProps(testIds.screen) }
    : { accessibilityLabel: t('settings.screen.label'), ...testProps(testIds.screen) };

  const offline = userSettings?.offlineSyncPreferences || {};
  const privacy = userSettings?.privacyControls || {};
  const reference = facilitySettings?.referenceSettings || {};
  const workflow = facilitySettings?.workflowSettings || {};
  const facilityPrivacy = facilitySettings?.privacyControls || {};
  const governance = facilitySettings?.governanceSettings || {};
  const modelVisibility = facilitySettings?.modelVisibility || {};
  const activeFacilityName = facilitySettings?.facility?.name || t('settings.account.noActiveFacility');
  const canRetryStatus = errorMessageKey === 'settings.status.loadError';

  return (
    <StyledContainer {...rootProps}>
      <StyledContent>
        <StyledHeader>
          <Text accessibilityRole="header" variant="h1" testID={testIds.title}>
            {t('settings.title')}
          </Text>
          {isLoading ? (
            <Text variant="caption" testID={testIds.statusMessage}>
              {t('settings.status.loading')}
            </Text>
          ) : null}
          {statusMessageKey ? (
            <Text variant="caption" color="success" testID={testIds.statusMessage}>
              {t(statusMessageKey)}
            </Text>
          ) : null}
          {errorMessageKey ? (
            <Stack spacing="sm">
              <Text variant="caption" color="error" testID={testIds.statusMessage}>
                {t(errorMessageKey, { code: errorCode })}
              </Text>
              {canRetryStatus ? (
                <Button variant="outline" onPress={refreshSettings} disabled={isLoading}>
                  {t('common.retry')}
                </Button>
              ) : null}
            </Stack>
          ) : null}
        </StyledHeader>

        <Section
          StyledSection={StyledSection}
          StyledSectionTitle={StyledSectionTitle}
          testProps={testProps}
          testID={testIds.accountSection}
          title={t('settings.account.title')}
        >
          <TextField
            label={t('settings.account.name')}
            value={accountDraft.name}
            onChangeText={(value) => setAccountField('name', value)}
            required
            maxLength={160}
            validationState={accountErrors.name ? 'error' : undefined}
            errorMessage={accountErrors.name}
            disabled={!userSettings || isSaving}
            testID={testIds.accountNameInput}
          />
          <TextField
            label={t('settings.account.phone')}
            value={accountDraft.phone}
            onChangeText={(value) => setAccountField('phone', value)}
            type="tel"
            maxLength={40}
            validationState={accountErrors.phone ? 'error' : undefined}
            errorMessage={accountErrors.phone}
            disabled={!userSettings || isSaving}
            testID={testIds.accountPhoneInput}
          />
          <Button
            variant="primary"
            onPress={saveAccountSettings}
            disabled={!userSettings || isSaving}
            loading={isSaving}
            testID={testIds.accountSaveButton}
          >
            {t('settings.account.saveProfile')}
          </Button>
          <Select
            label={t('settings.account.activeFacility')}
            options={facilityOptions}
            value={activeFacilityValue}
            onValueChange={setActiveFacility}
            disabled={!userSettings || !hasAssignedFacilities || isSaving}
            helperText={
              hasAssignedFacilities
                ? t('settings.account.activeFacilityHelper')
                : t('settings.account.noAssignedFacility')
            }
            testID={testIds.activeFacilitySelector}
          />
          <Select
            label={t('settings.account.activeRole')}
            options={roleOptions}
            value={activeRole}
            onValueChange={setActiveRole}
            disabled={!userSettings || isSaving || roleOptions.length === 0}
            helperText={
              roleOptions.length > 0
                ? t('settings.account.activeRoleHelper')
                : t('settings.account.noActiveRole')
            }
            testID={testIds.activeRoleSelector}
          />
          <SettingsRow
            label={t('settings.account.approvedRoles')}
            value={
              (activeFacilityRoleLabels.length ? activeFacilityRoleLabels : approvedRoleLabels).join(', ') ||
              t('settings.account.none')
            }
          />
        </Section>

        <Section
          StyledSection={StyledSection}
          StyledSectionTitle={StyledSectionTitle}
          testProps={testProps}
          testID={testIds.themeSection}
          title={t('settings.accessibility.title')}
        >
          <Stack spacing="sm">
            <Text variant="label" testID={testIds.themeLabel}>{t('settings.theme.label')}</Text>
            <Select
              label={t('settings.theme.label')}
              options={themeOptions}
              value={theme}
              onValueChange={setThemePreference}
              disabled={isSaving}
              accessibilityLabel={t('settings.theme.accessibilityLabel')}
              accessibilityHint={t('settings.theme.hint')}
              testID={testIds.themeSelector}
            />
          </Stack>
          <Stack spacing="sm" {...testProps(testIds.densitySection)}>
            <Text variant="label" testID={testIds.densityLabel}>{t('settings.density.label')}</Text>
            <Select
              label={t('settings.density.label')}
              accessibilityLabel={t('settings.density.accessibilityLabel')}
              accessibilityHint={t('settings.density.hint')}
              options={densityOptions}
              value={density}
              onValueChange={setDensity}
              testID={testIds.densitySelector}
            />
          </Stack>
          <Stack spacing="sm" {...testProps(testIds.languageSection)}>
            <Text variant="label" testID={testIds.languageLabel}>{t('settings.language.label')}</Text>
            <LanguageControls testID={testIds.languageSelector} />
          </Stack>
          <SwitchRow
            label={t('settings.footerVisible.label')}
            hint={t('settings.footerVisible.hint')}
            value={footerVisible}
            onValueChange={setFooterVisible}
            testID={testIds.footerToggle}
          />
        </Section>

        <Section
          StyledSection={StyledSection}
          StyledSectionTitle={StyledSectionTitle}
          testProps={testProps}
          testID={testIds.syncSection}
          title={t('settings.sync.title')}
        >
          <SettingsRow label={t('settings.sync.network')} value={isOnline ? t('navigation.network.status.online') : t('navigation.network.status.offline')} />
          <SettingsRow label={t('settings.sync.status')} value={isSyncing ? t('navigation.network.status.syncing') : t('settings.sync.idle')} />
          <SettingsRow label={t('settings.sync.quality')} value={networkQuality || t('settings.sync.unknownQuality')} />
          <SwitchRow
            label={t('settings.sync.offlineModeEnabled')}
            value={offline.offlineModeEnabled}
            disabled={!userSettings || isSaving}
            onValueChange={(value) => updateOfflineSyncPreference('offlineModeEnabled', value)}
            testID={testIds.offlineModeToggle}
          />
          <SwitchRow
            label={t('settings.sync.syncOnWifiOnly')}
            value={offline.syncOnWifiOnly}
            disabled={!userSettings || isSaving}
            onValueChange={(value) => updateOfflineSyncPreference('syncOnWifiOnly', value)}
            testID={testIds.wifiOnlyToggle}
          />
          <SwitchRow
            label={t('settings.sync.autoSyncEnabled')}
            value={offline.autoSyncEnabled}
            disabled={!userSettings || isSaving}
            onValueChange={(value) => updateOfflineSyncPreference('autoSyncEnabled', value)}
            testID={testIds.autoSyncToggle}
          />
          <SwitchRow
            label={t('settings.sync.backgroundSyncEnabled')}
            value={offline.backgroundSyncEnabled}
            disabled={!userSettings || isSaving}
            onValueChange={(value) => updateOfflineSyncPreference('backgroundSyncEnabled', value)}
            testID={testIds.backgroundSyncToggle}
          />
          <SwitchRow
            label={t('settings.sync.retryFailedSyncAutomatically')}
            value={offline.retryFailedSyncAutomatically}
            disabled={!userSettings || isSaving}
            onValueChange={(value) => updateOfflineSyncPreference('retryFailedSyncAutomatically', value)}
            testID={testIds.retrySyncToggle}
          />
          <Select
            label={t('settings.sync.syncIntervalMinutes')}
            options={syncIntervalOptions}
            value={offline.syncIntervalMinutes}
            onValueChange={(value) => updateOfflineSyncPreference('syncIntervalMinutes', value)}
            disabled={!userSettings || isSaving}
            testID={testIds.syncIntervalSelector}
          />
          <Select
            label={t('settings.sync.purgeSyncedDraftsAfterDays')}
            options={purgeDraftOptions}
            value={offline.purgeSyncedDraftsAfterDays}
            onValueChange={(value) => updateOfflineSyncPreference('purgeSyncedDraftsAfterDays', value)}
            disabled={!userSettings || isSaving}
            testID={testIds.purgeDraftsSelector}
          />
          <SettingsRow label={t('settings.sync.conflictResolutionMode')} value={t('settings.sync.manualReview')} />
        </Section>

        <Section
          StyledSection={StyledSection}
          StyledSectionTitle={StyledSectionTitle}
          testProps={testProps}
          testID={testIds.privacySection}
          title={t('settings.privacyControls.title')}
        >
          <SwitchRow
            label={t('settings.privacyControls.hidePatientIdentifiersInLists')}
            value={privacy.hidePatientIdentifiersInLists}
            disabled={!userSettings || isSaving}
            onValueChange={(value) => updatePrivacyControl('hidePatientIdentifiersInLists', value)}
            testID={testIds.hideIdentifiersToggle}
          />
          <SwitchRow
            label={t('settings.privacyControls.requireUnlockForIdentifiers')}
            value={privacy.requireUnlockForIdentifiers}
            disabled={!userSettings || isSaving}
            onValueChange={(value) => updatePrivacyControl('requireUnlockForIdentifiers', value)}
            testID={testIds.requireUnlockToggle}
          />
          <SwitchRow
            label={t('settings.privacyControls.shareUsageDiagnostics')}
            value={privacy.shareUsageDiagnostics}
            disabled={!userSettings || isSaving}
            onValueChange={(value) => updatePrivacyControl('shareUsageDiagnostics', value)}
            testID={testIds.diagnosticsToggle}
          />
          <SwitchRow
            label={t('settings.privacyControls.allowDeidentifiedAnalytics')}
            value={privacy.allowDeidentifiedAnalytics}
            disabled={!userSettings || isSaving}
            onValueChange={(value) => updatePrivacyControl('allowDeidentifiedAnalytics', value)}
            testID={testIds.analyticsToggle}
          />
          <SwitchRow
            label={t('settings.privacyControls.allowDeidentifiedTrainingDatasetContribution')}
            value={privacy.allowDeidentifiedTrainingDatasetContribution}
            disabled={!userSettings || isSaving}
            onValueChange={(value) => updatePrivacyControl('allowDeidentifiedTrainingDatasetContribution', value)}
            testID={testIds.trainingContributionToggle}
          />
        </Section>

        <Section
          StyledSection={StyledSection}
          StyledSectionTitle={StyledSectionTitle}
          testProps={testProps}
          testID={testIds.governanceSection}
          title={t('settings.governance.title')}
        >
          <SettingsRow label={t('settings.governance.activeFacility')} value={activeFacilityName} />
          <SettingsRow label={t('settings.governance.manageAccess')} value={canManageActiveFacility ? t('common.on') : t('common.off')} />
          <SettingsRow label={t('settings.governance.visibility')} value={canSeeGovernance ? t('common.on') : t('common.off')} />
          <Select
            label={t('settings.governance.defaultReferenceRuleScope')}
            options={referenceScopeOptions}
            value={reference.defaultReferenceRuleScope}
            onValueChange={(value) => updateFacilitySection('referenceSettings', 'defaultReferenceRuleScope', value)}
            disabled={!facilitySettings || !canManageActiveFacility || isSaving}
            testID={testIds.referenceScopeSelector}
          />
          <SwitchRow
            label={t('settings.governance.showReferenceVersionToClinicians')}
            value={reference.showReferenceVersionToClinicians}
            disabled={!facilitySettings || !canManageActiveFacility || isSaving}
            onValueChange={(value) => updateFacilitySection('referenceSettings', 'showReferenceVersionToClinicians', value)}
            testID={testIds.referenceVersionToggle}
          />
          <SettingsRow label={t('settings.governance.requireVerifiedReferenceRules')} value={t(boolTextKey(reference.requireVerifiedReferenceRules))} />
          <SettingsRow label={t('settings.governance.activeReferenceRules')} value={String(reference.activeReferenceRuleIds?.length || 0)} />
          <SwitchRow
            label={t('settings.governance.requireReasonForClinicalOverride')}
            value={workflow.requireReasonForClinicalOverride}
            disabled={!facilitySettings || !canManageActiveFacility || isSaving}
            onValueChange={(value) => updateFacilitySection('workflowSettings', 'requireReasonForClinicalOverride', value)}
            testID={testIds.clinicalOverrideToggle}
          />
          <SwitchRow
            label={t('settings.governance.requireSecondReviewerForCriticalFlags')}
            value={workflow.requireSecondReviewerForCriticalFlags}
            disabled={!facilitySettings || !canManageActiveFacility || isSaving}
            onValueChange={(value) => updateFacilitySection('workflowSettings', 'requireSecondReviewerForCriticalFlags', value)}
            testID={testIds.criticalReviewerToggle}
          />
          <SettingsRow label={t('settings.governance.lockReviewedClinicalRecords')} value={t(boolTextKey(workflow.lockReviewedClinicalRecords))} />
          <SwitchRow
            label={t('settings.governance.allowDeidentifiedExports')}
            value={facilityPrivacy.allowDeidentifiedExports}
            disabled={!facilitySettings || !canManageActiveFacility || isSaving}
            onValueChange={(value) => updateFacilitySection('privacyControls', 'allowDeidentifiedExports', value)}
            testID={testIds.deidentifiedExportsToggle}
          />
          <SettingsRow label={t('settings.governance.requireExportAuditReason')} value={t(boolTextKey(facilityPrivacy.requireExportAuditReason))} />
          <SettingsRow label={t('settings.governance.exportPatientIdentifiers')} value={t(boolTextKey(facilityPrivacy.exportPatientIdentifiers))} />
          <SettingsRow label={t('settings.governance.allowRawNotesInExports')} value={t(boolTextKey(facilityPrivacy.allowRawNotesInExports))} />
          <SettingsRow label={t('settings.governance.datasetExportsRequireEthicsApproval')} value={t(boolTextKey(governance.datasetExportsRequireEthicsApproval))} />
          <SettingsRow label={t('settings.governance.datasetExportsRequireReview')} value={t(boolTextKey(governance.datasetExportsRequireReview))} />
          <SettingsRow label={t('settings.governance.allowUnreviewedDatasetExports')} value={t(boolTextKey(governance.allowUnreviewedDatasetExports))} />
          <Stack spacing="sm" testID={testIds.modelVisibilityStatus}>
            <Text variant="label">{t('settings.governance.modelVisibility')}</Text>
            <SettingsRow label={t('settings.governance.liveClinicalPredictionEnabled')} value={t(boolTextKey(modelVisibility.liveClinicalPredictionEnabled))} />
            <SettingsRow label={t('settings.governance.clinicianVisibleModelVersionIds')} value={String(modelVisibility.clinicianVisibleModelVersionIds?.length || 0)} />
            <SettingsRow label={t('settings.governance.showShadowModelOutputsToClinicians')} value={t(boolTextKey(modelVisibility.showShadowModelOutputsToClinicians))} />
            <Text variant="caption" color="text.secondary">
              {facilitySettings?.safetyStatement || t('settings.governance.modelVisibilityLocked')}
            </Text>
          </Stack>
        </Section>
      </StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenContent;
