/**
 * SettingsScreenContent
 * Shared cross-platform settings screen composition.
 */
import React from 'react';
import { useWindowDimensions } from 'react-native';
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
const compactControlStyle = { width: '100%', marginBottom: 0 };
const compactActionStyle = { alignSelf: 'flex-start' };
const rowLabelStyle = { flex: 1, minWidth: 0 };

const SettingsRow = ({ label, value, styles }) => {
  const { StyledSettingRow, StyledValuePill } = styles;

  return (
    <StyledSettingRow>
      <Text variant="body" style={rowLabelStyle}>
        {label}
      </Text>
      <StyledValuePill>
        <Text variant="caption">{value}</Text>
      </StyledValuePill>
    </StyledSettingRow>
  );
};

const SwitchRow = ({
  label,
  hint,
  value,
  onValueChange,
  disabled = false,
  testID,
  styles,
}) => {
  const { StyledSettingRow } = styles;

  return (
    <StyledSettingRow>
      <Stack spacing="xs" style={rowLabelStyle}>
        <Text variant="body">{label}</Text>
        {hint ? (
          <Text variant="caption" color="text.secondary">
            {hint}
          </Text>
        ) : null}
      </Stack>
      <Switch
        value={Boolean(value)}
        onValueChange={onValueChange}
        disabled={disabled}
        accessibilityLabel={label}
        accessibilityHint={hint}
        testID={testID}
      />
    </StyledSettingRow>
  );
};

const Section = ({
  StyledSection,
  StyledSectionTitle,
  StyledSectionBody,
  testProps,
  testID,
  title,
  span = 'single',
  isWideLayout,
  children,
}) => (
  <StyledSection
    {...testProps(testID)}
    $span={span}
    $isWideLayout={isWideLayout}
  >
    <StyledSectionTitle>
      <Text variant="h3">{title}</Text>
    </StyledSectionTitle>
    <StyledSectionBody>{children}</StyledSectionBody>
  </StyledSection>
);

const SettingsScreenContent = ({ platform, styles }) => {
  const { t } = useI18n();
  const { width } = useWindowDimensions();
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
    StyledSectionBody,
    StyledSectionTitle,
    StyledFieldGrid,
    StyledControlItem,
    StyledActionsRow,
    StyledStatusGrid,
    StyledModelBlock,
  } = styles;
  const isWideLayout = width >= 768;

  const isTestEnv = Boolean(process.env.JEST_WORKER_ID);
  const testProps = (id) =>
    platform === 'web'
      ? { 'data-testid': id, ...(isTestEnv ? { testID: id } : {}) }
      : { testID: id };
  const rootProps =
    platform === 'web'
      ? {
          'aria-label': t('settings.screen.label'),
          ...testProps(testIds.screen),
        }
      : {
          accessibilityLabel: t('settings.screen.label'),
          ...testProps(testIds.screen),
        };

  const offline = userSettings?.offlineSyncPreferences || {};
  const privacy = userSettings?.privacyControls || {};
  const reference = facilitySettings?.referenceSettings || {};
  const workflow = facilitySettings?.workflowSettings || {};
  const facilityPrivacy = facilitySettings?.privacyControls || {};
  const governance = facilitySettings?.governanceSettings || {};
  const modelVisibility = facilitySettings?.modelVisibility || {};
  const activeFacilityName =
    facilitySettings?.facility?.name || t('settings.account.noActiveFacility');
  const canRetryStatus = errorMessageKey === 'settings.status.loadError';
  const Row = (props) => <SettingsRow styles={styles} {...props} />;
  const Toggle = (props) => <SwitchRow styles={styles} {...props} />;

  return (
    <StyledContainer {...rootProps}>
      <StyledContent $isWideLayout={isWideLayout}>
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
            <Text
              variant="caption"
              color="success"
              testID={testIds.statusMessage}
            >
              {t(statusMessageKey)}
            </Text>
          ) : null}
          {errorMessageKey ? (
            <Stack spacing="sm">
              <Text
                variant="caption"
                color="error"
                testID={testIds.statusMessage}
              >
                {t(errorMessageKey, { code: errorCode })}
              </Text>
              {canRetryStatus ? (
                <Button
                  variant="outline"
                  size="small"
                  onPress={refreshSettings}
                  disabled={isLoading}
                  style={compactActionStyle}
                >
                  {t('common.retry')}
                </Button>
              ) : null}
            </Stack>
          ) : null}
        </StyledHeader>

        <Section
          StyledSection={StyledSection}
          StyledSectionTitle={StyledSectionTitle}
          StyledSectionBody={StyledSectionBody}
          testProps={testProps}
          testID={testIds.accountSection}
          title={t('settings.account.title')}
          span="full"
          isWideLayout={isWideLayout}
        >
          <StyledFieldGrid>
            <StyledControlItem $isWideLayout={isWideLayout}>
              <TextField
                label={t('settings.account.name')}
                value={accountDraft.name}
                onChangeText={(value) => setAccountField('name', value)}
                required
                maxLength={160}
                validationState={accountErrors.name ? 'error' : undefined}
                errorMessage={accountErrors.name}
                disabled={!userSettings || isSaving}
                style={compactControlStyle}
                testID={testIds.accountNameInput}
              />
            </StyledControlItem>
            <StyledControlItem $isWideLayout={isWideLayout}>
              <TextField
                label={t('settings.account.phone')}
                value={accountDraft.phone}
                onChangeText={(value) => setAccountField('phone', value)}
                type="tel"
                maxLength={40}
                validationState={accountErrors.phone ? 'error' : undefined}
                errorMessage={accountErrors.phone}
                disabled={!userSettings || isSaving}
                style={compactControlStyle}
                testID={testIds.accountPhoneInput}
              />
            </StyledControlItem>
          </StyledFieldGrid>
          <StyledActionsRow>
            <Button
              variant="primary"
              size="small"
              onPress={saveAccountSettings}
              disabled={!userSettings || isSaving}
              loading={isSaving}
              style={compactActionStyle}
              testID={testIds.accountSaveButton}
            >
              {t('settings.account.saveProfile')}
            </Button>
          </StyledActionsRow>
          <StyledFieldGrid>
            <StyledControlItem $isWideLayout={isWideLayout}>
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
                compact
                style={compactControlStyle}
                testID={testIds.activeFacilitySelector}
              />
            </StyledControlItem>
            <StyledControlItem $isWideLayout={isWideLayout}>
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
                compact
                style={compactControlStyle}
                testID={testIds.activeRoleSelector}
              />
            </StyledControlItem>
          </StyledFieldGrid>
          <Row
            label={t('settings.account.approvedRoles')}
            value={
              (activeFacilityRoleLabels.length
                ? activeFacilityRoleLabels
                : approvedRoleLabels
              ).join(', ') || t('settings.account.none')
            }
          />
        </Section>

        <Section
          StyledSection={StyledSection}
          StyledSectionTitle={StyledSectionTitle}
          StyledSectionBody={StyledSectionBody}
          testProps={testProps}
          testID={testIds.themeSection}
          title={t('settings.accessibility.title')}
          isWideLayout={isWideLayout}
        >
          <StyledFieldGrid>
            <StyledControlItem
              $isWideLayout={false}
              {...testProps(testIds.themeLabel)}
            >
              <Select
                label={t('settings.theme.label')}
                options={themeOptions}
                value={theme}
                onValueChange={setThemePreference}
                disabled={isSaving}
                accessibilityLabel={t('settings.theme.accessibilityLabel')}
                accessibilityHint={t('settings.theme.hint')}
                compact
                style={compactControlStyle}
                testID={testIds.themeSelector}
              />
            </StyledControlItem>
            <StyledControlItem
              $isWideLayout={false}
              {...testProps(testIds.densitySection)}
            >
              <Select
                label={t('settings.density.label')}
                accessibilityLabel={t('settings.density.accessibilityLabel')}
                accessibilityHint={t('settings.density.hint')}
                options={densityOptions}
                value={density}
                onValueChange={setDensity}
                compact
                style={compactControlStyle}
                testID={testIds.densitySelector}
              />
            </StyledControlItem>
            <StyledControlItem
              $isWideLayout={false}
              {...testProps(testIds.languageSection)}
            >
              <LanguageControls
                compact
                style={compactControlStyle}
                testID={testIds.languageSelector}
              />
            </StyledControlItem>
          </StyledFieldGrid>
          <Toggle
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
          StyledSectionBody={StyledSectionBody}
          testProps={testProps}
          testID={testIds.syncSection}
          title={t('settings.sync.title')}
          span="wide"
          isWideLayout={isWideLayout}
        >
          <StyledStatusGrid>
            <Row
              label={t('settings.sync.network')}
              value={
                isOnline
                  ? t('navigation.network.status.online')
                  : t('navigation.network.status.offline')
              }
            />
            <Row
              label={t('settings.sync.status')}
              value={
                isSyncing
                  ? t('navigation.network.status.syncing')
                  : t('settings.sync.idle')
              }
            />
            <Row
              label={t('settings.sync.quality')}
              value={networkQuality || t('settings.sync.unknownQuality')}
            />
          </StyledStatusGrid>
          <Toggle
            label={t('settings.sync.offlineModeEnabled')}
            value={offline.offlineModeEnabled}
            disabled={!userSettings || isSaving}
            onValueChange={(value) =>
              updateOfflineSyncPreference('offlineModeEnabled', value)
            }
            testID={testIds.offlineModeToggle}
          />
          <Toggle
            label={t('settings.sync.syncOnWifiOnly')}
            value={offline.syncOnWifiOnly}
            disabled={!userSettings || isSaving}
            onValueChange={(value) =>
              updateOfflineSyncPreference('syncOnWifiOnly', value)
            }
            testID={testIds.wifiOnlyToggle}
          />
          <Toggle
            label={t('settings.sync.autoSyncEnabled')}
            value={offline.autoSyncEnabled}
            disabled={!userSettings || isSaving}
            onValueChange={(value) =>
              updateOfflineSyncPreference('autoSyncEnabled', value)
            }
            testID={testIds.autoSyncToggle}
          />
          <Toggle
            label={t('settings.sync.backgroundSyncEnabled')}
            value={offline.backgroundSyncEnabled}
            disabled={!userSettings || isSaving}
            onValueChange={(value) =>
              updateOfflineSyncPreference('backgroundSyncEnabled', value)
            }
            testID={testIds.backgroundSyncToggle}
          />
          <Toggle
            label={t('settings.sync.retryFailedSyncAutomatically')}
            value={offline.retryFailedSyncAutomatically}
            disabled={!userSettings || isSaving}
            onValueChange={(value) =>
              updateOfflineSyncPreference('retryFailedSyncAutomatically', value)
            }
            testID={testIds.retrySyncToggle}
          />
          <StyledFieldGrid>
            <StyledControlItem $isWideLayout={isWideLayout}>
              <Select
                label={t('settings.sync.syncIntervalMinutes')}
                options={syncIntervalOptions}
                value={offline.syncIntervalMinutes}
                onValueChange={(value) =>
                  updateOfflineSyncPreference('syncIntervalMinutes', value)
                }
                disabled={!userSettings || isSaving}
                compact
                style={compactControlStyle}
                testID={testIds.syncIntervalSelector}
              />
            </StyledControlItem>
            <StyledControlItem $isWideLayout={isWideLayout}>
              <Select
                label={t('settings.sync.purgeSyncedDraftsAfterDays')}
                options={purgeDraftOptions}
                value={offline.purgeSyncedDraftsAfterDays}
                onValueChange={(value) =>
                  updateOfflineSyncPreference(
                    'purgeSyncedDraftsAfterDays',
                    value
                  )
                }
                disabled={!userSettings || isSaving}
                compact
                style={compactControlStyle}
                testID={testIds.purgeDraftsSelector}
              />
            </StyledControlItem>
          </StyledFieldGrid>
          <Row
            label={t('settings.sync.conflictResolutionMode')}
            value={t('settings.sync.manualReview')}
          />
        </Section>

        <Section
          StyledSection={StyledSection}
          StyledSectionTitle={StyledSectionTitle}
          StyledSectionBody={StyledSectionBody}
          testProps={testProps}
          testID={testIds.privacySection}
          title={t('settings.privacyControls.title')}
          isWideLayout={isWideLayout}
        >
          <Toggle
            label={t('settings.privacyControls.hidePatientIdentifiersInLists')}
            value={privacy.hidePatientIdentifiersInLists}
            disabled={!userSettings || isSaving}
            onValueChange={(value) =>
              updatePrivacyControl('hidePatientIdentifiersInLists', value)
            }
            testID={testIds.hideIdentifiersToggle}
          />
          <Toggle
            label={t('settings.privacyControls.requireUnlockForIdentifiers')}
            value={privacy.requireUnlockForIdentifiers}
            disabled={!userSettings || isSaving}
            onValueChange={(value) =>
              updatePrivacyControl('requireUnlockForIdentifiers', value)
            }
            testID={testIds.requireUnlockToggle}
          />
          <Toggle
            label={t('settings.privacyControls.shareUsageDiagnostics')}
            value={privacy.shareUsageDiagnostics}
            disabled={!userSettings || isSaving}
            onValueChange={(value) =>
              updatePrivacyControl('shareUsageDiagnostics', value)
            }
            testID={testIds.diagnosticsToggle}
          />
          <Toggle
            label={t('settings.privacyControls.allowDeidentifiedAnalytics')}
            value={privacy.allowDeidentifiedAnalytics}
            disabled={!userSettings || isSaving}
            onValueChange={(value) =>
              updatePrivacyControl('allowDeidentifiedAnalytics', value)
            }
            testID={testIds.analyticsToggle}
          />
          <Toggle
            label={t(
              'settings.privacyControls.allowDeidentifiedTrainingDatasetContribution'
            )}
            value={privacy.allowDeidentifiedTrainingDatasetContribution}
            disabled={!userSettings || isSaving}
            onValueChange={(value) =>
              updatePrivacyControl(
                'allowDeidentifiedTrainingDatasetContribution',
                value
              )
            }
            testID={testIds.trainingContributionToggle}
          />
        </Section>

        <Section
          StyledSection={StyledSection}
          StyledSectionTitle={StyledSectionTitle}
          StyledSectionBody={StyledSectionBody}
          testProps={testProps}
          testID={testIds.governanceSection}
          title={t('settings.governance.title')}
          span="full"
          isWideLayout={isWideLayout}
        >
          <StyledStatusGrid>
            <Row
              label={t('settings.governance.activeFacility')}
              value={activeFacilityName}
            />
            <Row
              label={t('settings.governance.manageAccess')}
              value={canManageActiveFacility ? t('common.on') : t('common.off')}
            />
            <Row
              label={t('settings.governance.visibility')}
              value={canSeeGovernance ? t('common.on') : t('common.off')}
            />
          </StyledStatusGrid>
          <StyledFieldGrid>
            <StyledControlItem $isWideLayout={isWideLayout}>
              <Select
                label={t('settings.governance.defaultReferenceRuleScope')}
                options={referenceScopeOptions}
                value={reference.defaultReferenceRuleScope}
                onValueChange={(value) =>
                  updateFacilitySection(
                    'referenceSettings',
                    'defaultReferenceRuleScope',
                    value
                  )
                }
                disabled={
                  !facilitySettings || !canManageActiveFacility || isSaving
                }
                compact
                style={compactControlStyle}
                testID={testIds.referenceScopeSelector}
              />
            </StyledControlItem>
          </StyledFieldGrid>
          <Toggle
            label={t('settings.governance.showReferenceVersionToClinicians')}
            value={reference.showReferenceVersionToClinicians}
            disabled={!facilitySettings || !canManageActiveFacility || isSaving}
            onValueChange={(value) =>
              updateFacilitySection(
                'referenceSettings',
                'showReferenceVersionToClinicians',
                value
              )
            }
            testID={testIds.referenceVersionToggle}
          />
          <Row
            label={t('settings.governance.requireVerifiedReferenceRules')}
            value={t(boolTextKey(reference.requireVerifiedReferenceRules))}
          />
          <Row
            label={t('settings.governance.activeReferenceRules')}
            value={String(reference.activeReferenceRuleIds?.length || 0)}
          />
          <Toggle
            label={t('settings.governance.requireReasonForClinicalOverride')}
            value={workflow.requireReasonForClinicalOverride}
            disabled={!facilitySettings || !canManageActiveFacility || isSaving}
            onValueChange={(value) =>
              updateFacilitySection(
                'workflowSettings',
                'requireReasonForClinicalOverride',
                value
              )
            }
            testID={testIds.clinicalOverrideToggle}
          />
          <Toggle
            label={t(
              'settings.governance.requireSecondReviewerForCriticalFlags'
            )}
            value={workflow.requireSecondReviewerForCriticalFlags}
            disabled={!facilitySettings || !canManageActiveFacility || isSaving}
            onValueChange={(value) =>
              updateFacilitySection(
                'workflowSettings',
                'requireSecondReviewerForCriticalFlags',
                value
              )
            }
            testID={testIds.criticalReviewerToggle}
          />
          <Row
            label={t('settings.governance.lockReviewedClinicalRecords')}
            value={t(boolTextKey(workflow.lockReviewedClinicalRecords))}
          />
          <Toggle
            label={t('settings.governance.allowDeidentifiedExports')}
            value={facilityPrivacy.allowDeidentifiedExports}
            disabled={!facilitySettings || !canManageActiveFacility || isSaving}
            onValueChange={(value) =>
              updateFacilitySection(
                'privacyControls',
                'allowDeidentifiedExports',
                value
              )
            }
            testID={testIds.deidentifiedExportsToggle}
          />
          <Row
            label={t('settings.governance.requireExportAuditReason')}
            value={t(boolTextKey(facilityPrivacy.requireExportAuditReason))}
          />
          <Row
            label={t('settings.governance.exportPatientIdentifiers')}
            value={t(boolTextKey(facilityPrivacy.exportPatientIdentifiers))}
          />
          <Row
            label={t('settings.governance.allowRawNotesInExports')}
            value={t(boolTextKey(facilityPrivacy.allowRawNotesInExports))}
          />
          <Row
            label={t('settings.governance.datasetExportsRequireEthicsApproval')}
            value={t(
              boolTextKey(governance.datasetExportsRequireEthicsApproval)
            )}
          />
          <Row
            label={t('settings.governance.datasetExportsRequireReview')}
            value={t(boolTextKey(governance.datasetExportsRequireReview))}
          />
          <Row
            label={t('settings.governance.allowUnreviewedDatasetExports')}
            value={t(boolTextKey(governance.allowUnreviewedDatasetExports))}
          />
          <StyledModelBlock {...testProps(testIds.modelVisibilityStatus)}>
            <Text variant="label">
              {t('settings.governance.modelVisibility')}
            </Text>
            <Row
              label={t('settings.governance.liveClinicalPredictionEnabled')}
              value={t(
                boolTextKey(modelVisibility.liveClinicalPredictionEnabled)
              )}
            />
            <Row
              label={t('settings.governance.clinicianVisibleModelVersionIds')}
              value={String(
                modelVisibility.clinicianVisibleModelVersionIds?.length || 0
              )}
            />
            <Row
              label={t(
                'settings.governance.showShadowModelOutputsToClinicians'
              )}
              value={t(
                boolTextKey(modelVisibility.showShadowModelOutputsToClinicians)
              )}
            />
            <Text variant="caption" color="text.secondary">
              {facilitySettings?.safetyStatement ||
                t('settings.governance.modelVisibilityLocked')}
            </Text>
          </StyledModelBlock>
        </Section>
      </StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenContent;
