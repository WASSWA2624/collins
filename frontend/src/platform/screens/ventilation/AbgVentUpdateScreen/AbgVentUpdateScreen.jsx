/**
 * ABG and ventilator setting update screen
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Select, Text, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import useAbgVentUpdateScreen from './useAbgVentUpdateScreen';

const renderValue = (value, fallback = '-') =>
  value === undefined || value === null || value === ''
    ? fallback
    : String(value);

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
            'ventilation.abgVentUpdate.ventilator.modePlaceholder'
          )}
          searchPlaceholder={t(
            'ventilation.abgVentUpdate.ventilator.modeSearchPlaceholder'
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

const AbgVentUpdateScreen = () => {
  const { t } = useI18n();
  const screen = useAbgVentUpdateScreen();
  const { latestAbg, latestVentilator } = screen.latestValues;
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
      accessibilityLabel={t('ventilation.abgVentUpdate.accessibilityLabel')}
    >
      <View style={styles.header}>
        <Text variant="h1">{t('ventilation.abgVentUpdate.title')}</Text>
        <Text variant="body">{t('ventilation.abgVentUpdate.subtitle')}</Text>
      </View>

      {screen.status.kind !== 'idle' ? (
        <View
          style={[styles.banner, statusStyle]}
          testID={screen.testIds.statusBanner}
        >
          <Text variant="body">{screen.status.message}</Text>
          {screen.status.conflict?.serverRecord?.createdAt ? (
            <Text variant="caption">
              {t('ventilation.abgVentUpdate.conflict.serverRecord', {
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
          {t('ventilation.abgVentUpdate.sections.admission')}
        </Text>
        {hasAdmissions ? (
          <Select
            label={t('ventilation.abgVentUpdate.admission.label')}
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
                : t('ventilation.abgVentUpdate.admission.empty')}
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
              {t('ventilation.abgVentUpdate.sections.latest')}
            </Text>
            <View style={styles.columns}>
              <View style={styles.column}>
                <Text variant="label">
                  {t('ventilation.abgVentUpdate.latest.abg')}
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
                  {t('ventilation.abgVentUpdate.latest.ventilator')}
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
              {t('ventilation.abgVentUpdate.sections.abg')}
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
              {t('ventilation.abgVentUpdate.sections.ventilator')}
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

          {screen.missingData.length > 0 ? (
            <View style={styles.section} testID={screen.testIds.missingData}>
              <Text variant="h2">
                {t('ventilation.abgVentUpdate.sections.missing')}
              </Text>
              {screen.missingData.map((item) => (
                <Text key={item.field} variant="body">
                  {item.message}
                </Text>
              ))}
            </View>
          ) : null}

          {screen.advisoryFlags.length > 0 ? (
            <View style={styles.section} testID={screen.testIds.advisoryFlags}>
              <Text variant="h2">
                {t('ventilation.abgVentUpdate.sections.advisory')}
              </Text>
              {screen.advisoryFlags.slice(0, 6).map((flag, index) => (
                <Text key={`${flag.code || 'flag'}-${index}`} variant="body">
                  {flag.message}
                </Text>
              ))}
            </View>
          ) : null}

          <View style={styles.section} testID={screen.testIds.history}>
            <Text variant="h2">
              {t('ventilation.abgVentUpdate.sections.history')}
            </Text>
            {screen.history.length === 0 ? (
              <Text variant="body">
                {t('ventilation.abgVentUpdate.history.empty')}
              </Text>
            ) : (
              screen.history.slice(0, 8).map((event) => (
                <View
                  key={`${event.type}-${event.id || event.recordedAt}`}
                  style={styles.historyRow}
                >
                  <Text variant="label">
                    {t(`ventilation.abgVentUpdate.history.${event.type}`)}
                  </Text>
                  <Text variant="caption">
                    {t('ventilation.abgVentUpdate.history.version', {
                      version: renderValue(event.version),
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
                ? t('ventilation.abgVentUpdate.actions.saving')
                : t('ventilation.abgVentUpdate.actions.save')}
            </Button>
            {screen.isOffline ? (
              <Text variant="caption">
                {t('ventilation.abgVentUpdate.offline')}
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
  actions: {
    gap: 8,
    alignItems: 'flex-start',
  },
});

export default AbgVentUpdateScreen;
