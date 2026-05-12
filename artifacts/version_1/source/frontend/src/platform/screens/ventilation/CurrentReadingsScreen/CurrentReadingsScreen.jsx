/**
 * Current patient readings update screen
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Select, Text, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import useCurrentReadingsScreen from './useCurrentReadingsScreen';

const renderValue = (value, fallback = '-') =>
  value === undefined || value === null || value === ''
    ? fallback
    : String(value);

const getRecommendationSettings = (recommendation) =>
  recommendation?.initialVentilatorSettings?.settings || null;

const RECOMMENDATION_SETTING_ROWS = Object.freeze([
  ['mode', 'Mode'],
  ['tidalVolume', 'Tidal volume'],
  ['respiratoryRate', 'Respiratory rate'],
  ['peep', 'PEEP'],
  ['pressureSupport', 'Pressure support'],
  ['ieRatio', 'I:E ratio'],
]);

const renderField = ({
  disabled,
  error,
  field,
  value,
  onChange,
  prefix,
  modeOptions,
  t,
}) => {
  if (field.key === 'mode') {
    return (
      <View key={field.key} style={[styles.field, styles.modeField]}>
        <Select
          label={field.label}
          options={modeOptions}
          value={value[field.key] || undefined}
          onValueChange={(next) => onChange(field.key, next)}
          placeholder={t(
            'ventilation.currentReadings.ventilator.modePlaceholder'
          )}
          searchPlaceholder={t(
            'ventilation.currentReadings.ventilator.modeSearchPlaceholder'
          )}
          accessibilityLabel={field.label}
          testID={`${prefix}-${field.key}`}
          disabled={disabled}
          validationState={error ? 'error' : undefined}
          errorMessage={error || undefined}
          searchable
        />
      </View>
    );
  }

  return (
    <View key={field.key} style={styles.field}>
      <TextField
        label={field.unit ? `${field.label} (${field.unit})` : field.label}
        value={value[field.key] ?? ''}
        onChangeText={(next) => onChange(field.key, next)}
        type={field.min !== undefined ? 'number' : 'text'}
        keyboardType={field.min !== undefined ? 'decimal-pad' : undefined}
        inputMode={field.min !== undefined ? 'decimal' : undefined}
        validationState={error ? 'error' : undefined}
        errorMessage={error || undefined}
        accessibilityLabel={field.label}
        testID={`${prefix}-${field.key}`}
        disabled={disabled}
        debounceMs={0}
      />
    </View>
  );
};

const CurrentReadingsScreen = () => {
  const { t } = useI18n();
  const screen = useCurrentReadingsScreen();
  const { latestVitals, latestAbg, latestVentilator } = screen.latestValues;
  const recommendationSettings = getRecommendationSettings(
    screen.ventilatorRecommendation
  );
  const hasAdmissions = screen.admissionOptions.length > 0;
  const isFormDisabled =
    !hasAdmissions ||
    !screen.hasValidAdmissionContext ||
    screen.status.kind === 'load_error' ||
    screen.isSaving ||
    screen.isLoading ||
    screen.isAdmissionLoading;
  const statusStyle =
    screen.status.kind === 'conflict'
      ? styles.warning
      : ['error', 'load_error'].includes(screen.status.kind)
        ? styles.error
        : ['synced', 'queued'].includes(screen.status.kind)
          ? styles.success
          : styles.info;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      testID={screen.testIds.screen}
      accessibilityLabel={t('ventilation.currentReadings.accessibilityLabel')}
    >
      <View style={styles.header}>
        <Text variant="h1">{t('ventilation.currentReadings.title')}</Text>
        <Text variant="body">{t('ventilation.currentReadings.subtitle')}</Text>
      </View>

      {screen.status.kind !== 'idle' ? (
        <View
          style={[styles.banner, statusStyle]}
          testID={screen.testIds.statusBanner}
        >
          <Text variant="body">{screen.status.message}</Text>
          {screen.status.conflict?.serverRecord?.createdAt ? (
            <Text variant="caption">
              {t('ventilation.currentReadings.conflict.serverRecord', {
                dateTime: screen.toDisplayDate(
                  screen.status.conflict.serverRecord.createdAt
                ),
              })}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View style={styles.section}>
        <Text variant="h2">
          {t('ventilation.currentReadings.sections.admission')}
        </Text>
        {hasAdmissions ? (
          <Select
            label={t('ventilation.currentReadings.admission.label')}
            options={screen.admissionOptions}
            value={screen.selectedAdmissionId}
            onValueChange={screen.setSelectedAdmissionId}
            disabled={screen.isSaving || screen.isLoading}
            testID={screen.testIds.admissionSelect}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text variant="label">
              {screen.isLoading
                ? t('ventilation.tracking.states.loading')
                : t('ventilation.currentReadings.admission.empty')}
            </Text>
            {!screen.isLoading ? (
              <Text variant="body">{t('ventilation.tracking.emptyHint')}</Text>
            ) : null}
          </View>
        )}
        {screen.selectedLabel ? (
          <Text variant="caption">{screen.selectedLabel}</Text>
        ) : null}
        {screen.isAdmissionLoading ? (
          <Text variant="caption">
            {t('ventilation.tracking.states.loadingDetail')}
          </Text>
        ) : null}
        {screen.patientDetails.length > 0 ? (
          <View
            style={styles.patientDetails}
            testID={screen.testIds.patientDetails}
          >
            {screen.patientDetails.map((item) => (
              <View key={item.label} style={styles.patientDetailItem}>
                <Text variant="caption">{item.label}</Text>
                <Text variant="label">{item.value}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {hasAdmissions ? (
        <>
          <View style={styles.section} testID={screen.testIds.latestValues}>
            <Text variant="h2">
              {t('ventilation.currentReadings.sections.latest')}
            </Text>
            <View style={styles.columns}>
              <View style={styles.column}>
                <Text variant="label">
                  {t('ventilation.currentReadings.latest.vitals')}
                </Text>
                <Text variant="body">
                  SpO2: {renderValue(latestVitals?.spo2)}
                </Text>
                <Text variant="body">
                  RR: {renderValue(latestVitals?.respiratoryRate)}
                </Text>
                <Text variant="body">
                  HR: {renderValue(latestVitals?.heartRate)}
                </Text>
                <Text variant="caption">
                  {screen.toDisplayDate(latestVitals?.measuredAt)}
                </Text>
              </View>
              <View style={styles.column}>
                <Text variant="label">
                  {t('ventilation.currentReadings.latest.abg')}
                </Text>
                <Text variant="body">pH: {renderValue(latestAbg?.ph)}</Text>
                <Text variant="body">PaO2: {renderValue(latestAbg?.pao2)}</Text>
                <Text variant="body">
                  PaCO2: {renderValue(latestAbg?.paco2)}
                </Text>
                <Text variant="caption">
                  {screen.toDisplayDate(latestAbg?.collectedAt)}
                </Text>
              </View>
              <View style={styles.column}>
                <Text variant="label">
                  {t('ventilation.currentReadings.latest.ventilator')}
                </Text>
                <Text variant="body">
                  Mode: {renderValue(latestVentilator?.mode)}
                </Text>
                <Text variant="body">
                  FiO2: {renderValue(latestVentilator?.fio2)}
                </Text>
                <Text variant="body">
                  PEEP: {renderValue(latestVentilator?.peep)}
                </Text>
                <Text variant="caption">
                  {screen.toDisplayDate(latestVentilator?.measuredAt)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="h2">
              {t('ventilation.currentReadings.sections.vitals')}
            </Text>
            <View style={styles.fieldGrid}>
              {screen.vitalsFields.map((field) =>
                renderField({
                  disabled: isFormDisabled,
                  error: screen.fieldErrors.vitals[field.key],
                  field,
                  value: screen.vitals,
                  onChange: screen.setVitalsField,
                  prefix: 'vitals-update',
                  t,
                })
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="h2">
              {t('ventilation.currentReadings.sections.abg')}
            </Text>
            <View style={styles.fieldGrid}>
              {screen.abgFields.map((field) =>
                renderField({
                  disabled: isFormDisabled,
                  error: screen.fieldErrors.abg[field.key],
                  field,
                  value: screen.abg,
                  onChange: screen.setAbgField,
                  prefix: 'abg-update',
                  t,
                })
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="h2">
              {t('ventilation.currentReadings.sections.ventilator')}
            </Text>
            <View style={styles.fieldGrid}>
              {screen.ventilatorFields.map((field) =>
                renderField({
                  disabled: isFormDisabled,
                  error: screen.fieldErrors.ventilator[field.key],
                  field,
                  value: screen.ventilator,
                  onChange: screen.setVentilatorField,
                  prefix: 'vent-update',
                  modeOptions: screen.ventilatorModeOptions,
                  t,
                })
              )}
            </View>
          </View>

          <View style={styles.section} testID={screen.testIds.advisoryFlags}>
            <Text variant="h2">
              {t('ventilation.currentReadings.sections.advisory')}
            </Text>
            <View style={styles.advisoryBlock}>
              <Text variant="label">
                {t('ventilation.currentReadings.progress.title')}: {screen.progressAssessment.label}
              </Text>
              <Text variant="body">{screen.progressAssessment.recommendation}</Text>
              {screen.progressAssessment.reasons.slice(0, 4).map((reason) => (
                <Text key={reason} variant="caption">
                  {reason}
                </Text>
              ))}
            </View>
            {recommendationSettings ? (
              <View style={styles.advisoryBlock}>
                <Text variant="label">
                  {t('ventilation.currentReadings.recommendation.title')}
                </Text>
                {RECOMMENDATION_SETTING_ROWS.filter(
                  ([key]) =>
                    recommendationSettings[key] !== undefined &&
                    recommendationSettings[key] !== null &&
                    recommendationSettings[key] !== ''
                ).map(([key, label]) => (
                  <Text key={key} variant="body">
                    {label}: {renderValue(recommendationSettings[key])}
                  </Text>
                ))}
                {screen.ventilatorRecommendation?.safety?.intendedUseWarning ? (
                  <Text variant="caption">
                    {screen.ventilatorRecommendation.safety.intendedUseWarning}
                  </Text>
                ) : null}
              </View>
            ) : screen.progressAssessment.action === 'suggest_new_settings' ? (
              <Text variant="body">
                {screen.recommendationError
                  ? t('ventilation.currentReadings.recommendation.error')
                  : t('ventilation.currentReadings.recommendation.empty')}
              </Text>
            ) : null}
            {screen.missingData.length > 0 ? (
              <View
                style={styles.advisoryBlock}
                testID={screen.testIds.missingData}
              >
                <Text variant="label">
                  {t('ventilation.currentReadings.sections.missing')}
                </Text>
                {screen.missingData.map((item) => (
                  <Text key={item.field} variant="body">
                    {item.message}
                  </Text>
                ))}
              </View>
            ) : null}
            {screen.advisoryFlags.length > 0 ? (
              <View style={styles.advisoryBlock}>
                <Text variant="label">
                  {t('ventilation.currentReadings.advisory.title')}
                </Text>
                {screen.advisoryFlags.slice(0, 6).map((flag, index) => (
                  <Text key={`${flag.code || 'flag'}-${index}`} variant="body">
                    {flag.message}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>

          <View style={styles.section} testID={screen.testIds.history}>
            <Text variant="h2">
              {t('ventilation.currentReadings.sections.history')}
            </Text>
            {screen.history.length === 0 ? (
              <Text variant="body">
                {t('ventilation.currentReadings.history.empty')}
              </Text>
            ) : (
              screen.history.slice(0, 8).map((event) => (
                <View
                  key={`${event.type}-${event.id || event.recordedAt}`}
                  style={styles.historyRow}
                >
                  <Text variant="label">
                    {t(`ventilation.currentReadings.history.${event.type}`)}
                  </Text>
                  <Text variant="caption">
                    {event.version
                      ? t('ventilation.currentReadings.history.version', {
                          version: renderValue(event.version),
                          dateTime: screen.toDisplayDate(event.recordedAt),
                        })
                      : t('ventilation.currentReadings.history.recorded', {
                          dateTime: screen.toDisplayDate(event.recordedAt),
                        })}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.actions}>
            <Button
              variant="primary"
              onPress={screen.handleSubmit}
              disabled={isFormDisabled}
              loading={screen.isSaving}
              testID={screen.testIds.submit}
            >
              {screen.isSaving
                ? t('ventilation.currentReadings.actions.saving')
                : t('ventilation.currentReadings.actions.save')}
            </Button>
            {screen.isOffline ? (
              <Text variant="caption">
                {t('ventilation.currentReadings.offline')}
              </Text>
            ) : null}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  banner: {
    borderLeftWidth: 4,
    padding: 12,
    gap: 4,
  },
  info: {
    borderLeftColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  warning: {
    borderLeftColor: '#B45309',
    backgroundColor: '#FFFBEB',
  },
  success: {
    borderLeftColor: '#047857',
    backgroundColor: '#ECFDF5',
  },
  error: {
    borderLeftColor: '#B91C1C',
    backgroundColor: '#FEF2F2',
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 20,
    gap: 12,
  },
  emptyState: {
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  patientDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  patientDetailItem: {
    flexBasis: 180,
    flexGrow: 1,
    gap: 2,
  },
  columns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  column: {
    flexGrow: 1,
    flexBasis: 260,
    gap: 4,
  },
  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  field: {
    flexGrow: 1,
    flexBasis: 220,
  },
  modeField: {
    position: 'relative',
    zIndex: 50,
    elevation: 50,
  },
  historyRow: {
    gap: 2,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  advisoryBlock: {
    gap: 4,
  },
  actions: {
    gap: 8,
    alignItems: 'flex-start',
  },
});

export default CurrentReadingsScreen;
