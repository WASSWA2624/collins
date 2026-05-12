/**
 * Tracking screen component - Android
 * File: HistoryScreen.android.jsx
 */
import React from 'react';
import { Button, Icon, Text } from '@platform/components';
import SearchBar from '@platform/patterns/SearchBar/SearchBar.android';
import FacilitySearchSelect from '../../auth/FacilitySearchSelect';
import { useI18n } from '@hooks';
import { formatDateTime } from '@features/tracking';
import useHistoryScreen from './useHistoryScreen';
import {
  StyledBanner,
  StyledContainer,
  StyledControlsRow,
  StyledDetailPanel,
  StyledEmpty,
  StyledEmptyActions,
  StyledErrorBanner,
  StyledFacilityFilter,
  StyledHeader,
  StyledHeaderActions,
  StyledHeaderCopy,
  StyledItem,
  StyledItemMain,
  StyledItemRow,
  StyledList,
  StyledListCodeCell,
  StyledListDateCell,
  StyledListHeader,
  StyledListHeaderCell,
  StyledListNumberCell,
  StyledListScroller,
  StyledListTimeCell,
  StyledPatientDataGrid,
  StyledPatientDataItem,
  StyledPatientDataSection,
  StyledPatientRowButton,
  StyledPatientRowCell,
  StyledPatientRowNumber,
  StyledScreenContent,
  StyledSearchWrap,
  StyledStatusGroup,
  StyledStatusPill,
  StyledTimeline,
  StyledTimelineItem,
} from './HistoryScreen.android.styles';
import {
  getPatientLabel,
  getTrackingPatientDataRows,
} from './trackingDetailData';
import { HISTORY_TEST_IDS } from './types';

const COMPACT_BUTTON_STYLE = {
  minHeight: 40,
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 2,
};

const renderDetailPanel = ({
  t,
  selectedAdmissionId,
  selectedTracking,
  isDetailLoading,
  detailErrorCode,
  handleCloseDetails,
  handleUpdateTracking,
}) => {
  if (!selectedAdmissionId) return null;
  const row = selectedTracking?.row;
  const timeline = selectedTracking?.timeline || [];
  const patientDataRows = getTrackingPatientDataRows(row, t);

  return (
    <StyledDetailPanel testID={HISTORY_TEST_IDS.detailPanel}>
      <StyledItemRow>
        <StyledItemMain>
          <Text variant="label">
            {row
              ? getPatientLabel(row, t)
              : t('ventilation.tracking.detail.title')}
          </Text>
          <Text variant="caption" color="text.secondary">
            {row?.bedNumber
              ? t('ventilation.tracking.patient.bed', { bed: row.bedNumber })
              : t('ventilation.tracking.patient.bedMissing')}
          </Text>
        </StyledItemMain>
        <Button
          variant="outline"
          size="small"
          style={COMPACT_BUTTON_STYLE}
          icon={<Icon glyph={'\u00d7'} size="sm" tone="primary" decorative />}
          onPress={handleCloseDetails}
          accessibilityLabel={t(
            'ventilation.tracking.actions.closeDetailsHint'
          )}
          testID={HISTORY_TEST_IDS.detailClose}
        >
          {t('common.close')}
        </Button>
        <Button
          variant="outline"
          size="small"
          style={COMPACT_BUTTON_STYLE}
          icon={<Icon glyph="+" size="sm" tone="primary" decorative />}
          onPress={() => handleUpdateTracking(row)}
          accessibilityLabel={t(
            'ventilation.tracking.actions.updateValuesHint'
          )}
          testID={HISTORY_TEST_IDS.updateValues}
        >
          {t('ventilation.tracking.actions.updateValues')}
        </Button>
      </StyledItemRow>
      {isDetailLoading ? (
        <Text variant="body">
          {t('ventilation.tracking.states.loadingDetail')}
        </Text>
      ) : detailErrorCode ? (
        <Text variant="body" color="status.error.text">
          {t('ventilation.tracking.states.detailError')}
        </Text>
      ) : (
        <>
          {patientDataRows.length > 0 ? (
            <StyledPatientDataSection
              testID={HISTORY_TEST_IDS.detailPatientData}
            >
              <Text variant="label">
                {t('ventilation.tracking.patientData.title')}
              </Text>
              <StyledPatientDataGrid>
                {patientDataRows.map((item) => (
                  <StyledPatientDataItem
                    key={item.key}
                    testID={`${HISTORY_TEST_IDS.detailPatientDataItem}-${item.key}`}
                  >
                    <Text variant="caption" color="text.secondary">
                      {item.label}
                    </Text>
                    <Text variant="caption">{item.value}</Text>
                  </StyledPatientDataItem>
                ))}
              </StyledPatientDataGrid>
            </StyledPatientDataSection>
          ) : null}
          <StyledStatusGroup>
            <StyledStatusPill
              level={row?.risk?.level}
              testID={HISTORY_TEST_IDS.risk}
            >
              <Text variant="caption">{row?.risk?.label}</Text>
            </StyledStatusPill>
            <StyledStatusPill testID={HISTORY_TEST_IDS.review}>
              <Text variant="caption">{row?.reviewLabel}</Text>
            </StyledStatusPill>
            <StyledStatusPill testID={HISTORY_TEST_IDS.sync}>
              <Text variant="caption">{row?.syncLabel}</Text>
            </StyledStatusPill>
          </StyledStatusGroup>
          <Text variant="body">{row?.risk?.prompt}</Text>
          <Text
            variant="caption"
            color="text.secondary"
            testID={HISTORY_TEST_IDS.missingData}
          >
            {t('ventilation.tracking.patient.missingData', {
              fields: row?.missingDataLabel,
            })}
          </Text>
          <Text variant="label">
            {t('ventilation.tracking.detail.historyTitle')}
          </Text>
          <StyledTimeline testID={HISTORY_TEST_IDS.detailTimeline}>
            {timeline.length > 0 ? (
              timeline.slice(0, 6).map((entry) => (
                <StyledTimelineItem
                  key={`${entry.entityType}-${entry.entityId}-${entry.occurredAt}`}
                >
                  <Text variant="caption">
                    {entry.eventType || entry.entityType} |{' '}
                    {formatDateTime(entry.occurredAt)}
                  </Text>
                </StyledTimelineItem>
              ))
            ) : (
              <StyledTimelineItem>
                <Text variant="caption">
                  {t('ventilation.tracking.detail.noTimeline')}
                </Text>
              </StyledTimelineItem>
            )}
          </StyledTimeline>
        </>
      )}
    </StyledDetailPanel>
  );
};

const HistoryScreenAndroid = ({ detailMode = false } = {}) => {
  const { t } = useI18n();
  const {
    rows,
    activeFacility,
    isEmpty,
    isDetailMode,
    isSearchEmpty,
    isHistoryLoading,
    historyErrorCode,
    localDraft,
    searchQuery,
    facilitySearch,
    showAdmittedBanner,
    selectedAdmissionId,
    selectedTracking,
    isDetailLoading,
    detailErrorCode,
    handleRefresh,
    handleSearchQueryChange,
    handleOpenAdmit,
    handleUpdateTracking,
    handleViewDetails,
    handleCloseDetails,
  } = useHistoryScreen({ detailMode });

  if (isHistoryLoading) {
    return (
      <StyledContainer testID={HISTORY_TEST_IDS.screen}>
        <StyledScreenContent>
          <StyledEmpty>
            <Text>{t('ventilation.tracking.states.loading')}</Text>
          </StyledEmpty>
        </StyledScreenContent>
      </StyledContainer>
    );
  }

  if (isDetailMode) {
    return (
      <StyledContainer
        accessibilityLabel={t('ventilation.tracking.accessibilityLabel')}
        testID={HISTORY_TEST_IDS.screen}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <StyledScreenContent>
          <StyledHeader>
            <StyledHeaderCopy>
              <Text variant="h1">{t('ventilation.tracking.detail.title')}</Text>
              <Text variant="body" color="text.secondary">
                {activeFacility?.name ||
                  t('ventilation.tracking.activeFacility.none')}
              </Text>
            </StyledHeaderCopy>
            <StyledHeaderActions>
              <Button
                variant="outline"
                size="small"
                style={COMPACT_BUTTON_STYLE}
                icon={
                  <Icon glyph={'\u21bb'} size="sm" tone="primary" decorative />
                }
                onPress={handleRefresh}
                accessibilityLabel={t('ventilation.tracking.actions.refreshHint')}
                testID={HISTORY_TEST_IDS.refresh}
              >
                {t('ventilation.tracking.actions.refresh')}
              </Button>
            </StyledHeaderActions>
          </StyledHeader>

          {showAdmittedBanner && (
            <StyledBanner tone="success" testID={HISTORY_TEST_IDS.admittedBanner}>
              <Text variant="body" color="status.success.text">
                {t('ventilation.tracking.admittedBanner')}
              </Text>
            </StyledBanner>
          )}

          {localDraft && (
            <StyledBanner testID={HISTORY_TEST_IDS.draftBanner}>
              <Text variant="body" color="status.warning.text">
                {t('ventilation.tracking.localDraft')}
              </Text>
            </StyledBanner>
          )}

          {renderDetailPanel({
            t,
            selectedAdmissionId,
            selectedTracking,
            isDetailLoading,
            detailErrorCode,
            handleCloseDetails,
            handleUpdateTracking,
          })}
        </StyledScreenContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer
      accessibilityLabel={t('ventilation.tracking.accessibilityLabel')}
      testID={HISTORY_TEST_IDS.screen}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <StyledScreenContent>
        <StyledHeader>
          <StyledHeaderCopy>
            <Text variant="h1">{t('ventilation.tracking.title')}</Text>
            <Text variant="body" color="text.secondary">
              {t('ventilation.tracking.subtitle')}
            </Text>
          </StyledHeaderCopy>
          <StyledHeaderActions>
            <Button
              variant="outline"
              size="small"
              style={COMPACT_BUTTON_STYLE}
              icon={
                <Icon glyph={'\u21bb'} size="sm" tone="primary" decorative />
              }
              onPress={handleRefresh}
              accessibilityLabel={t('ventilation.tracking.actions.refreshHint')}
              testID={HISTORY_TEST_IDS.refresh}
            >
              {t('ventilation.tracking.actions.refresh')}
            </Button>
          </StyledHeaderActions>
        </StyledHeader>

        <StyledControlsRow>
          <StyledSearchWrap>
            <SearchBar
              value={searchQuery}
              onChangeText={handleSearchQueryChange}
              placeholder={t('ventilation.tracking.search.placeholder')}
              accessibilityLabel={t(
                'ventilation.tracking.search.accessibilityLabel'
              )}
              testID={HISTORY_TEST_IDS.search}
              debounceMs={150}
            />
          </StyledSearchWrap>

          <StyledFacilityFilter testID={HISTORY_TEST_IDS.facility}>
            <FacilitySearchSelect
              placeholder={t('ventilation.tracking.facility.placeholder')}
              query={facilitySearch.query}
              onQueryChange={facilitySearch.onQueryChange}
              value={facilitySearch.value}
              onValueChange={facilitySearch.onValueChange}
              onClear={facilitySearch.onClear}
              options={facilitySearch.options}
              noResultsText={t('ventilation.tracking.facility.noResults')}
              loadingText={t('ventilation.tracking.facility.loading')}
              clearLabel={t('ventilation.tracking.facility.clear')}
              disabled={isHistoryLoading}
              loading={facilitySearch.loading}
              errorText={facilitySearch.error}
              accessibilityHint={t('ventilation.tracking.facility.hint')}
              testID={HISTORY_TEST_IDS.facilitySelect}
            />
          </StyledFacilityFilter>
        </StyledControlsRow>

        {showAdmittedBanner && (
          <StyledBanner tone="success" testID={HISTORY_TEST_IDS.admittedBanner}>
            <Text variant="body" color="status.success.text">
              {t('ventilation.tracking.admittedBanner')}
            </Text>
          </StyledBanner>
        )}

        {localDraft && (
          <StyledBanner testID={HISTORY_TEST_IDS.draftBanner}>
            <Text variant="body" color="status.warning.text">
              {t('ventilation.tracking.localDraft')}
            </Text>
          </StyledBanner>
        )}

        {historyErrorCode && (
          <StyledErrorBanner testID={HISTORY_TEST_IDS.errorBanner}>
            <Text variant="body" color="status.error.text">
              {t('ventilation.tracking.states.error')}
            </Text>
          </StyledErrorBanner>
        )}

        {isEmpty && !isHistoryLoading ? (
          <StyledEmpty testID={HISTORY_TEST_IDS.empty}>
            <Text variant="label">{t('ventilation.tracking.empty')}</Text>
            <Text variant="body" color="text.secondary">
              {t('ventilation.tracking.emptyHint')}
            </Text>
            <StyledEmptyActions>
              <Button
                variant="primary"
                onPress={handleOpenAdmit}
                testID={HISTORY_TEST_IDS.resume}
              >
                {t('ventilation.tracking.actions.admitFirst')}
              </Button>
            </StyledEmptyActions>
          </StyledEmpty>
        ) : isSearchEmpty ? (
          <StyledEmpty testID={HISTORY_TEST_IDS.searchEmpty}>
            <Text variant="label">
              {t('ventilation.tracking.search.empty')}
            </Text>
            <Text variant="body" color="text.secondary">
              {t('ventilation.tracking.search.emptyHint')}
            </Text>
          </StyledEmpty>
        ) : (
          <StyledListScroller horizontal showsHorizontalScrollIndicator>
            <StyledList testID={HISTORY_TEST_IDS.list}>
              <StyledListHeader testID={HISTORY_TEST_IDS.listHeader}>
                <StyledListNumberCell>
                  <Text variant="caption" color="text.secondary" numberOfLines={1}>
                    {t('ventilation.tracking.list.rowNumber')}
                  </Text>
                </StyledListNumberCell>
                <StyledListCodeCell>
                  <Text variant="caption" color="text.secondary" numberOfLines={1}>
                    {t('ventilation.tracking.list.patientCode')}
                  </Text>
                </StyledListCodeCell>
                <StyledListHeaderCell>
                  <Text variant="caption" color="text.secondary" numberOfLines={1}>
                    {t('ventilation.tracking.list.patientName')}
                  </Text>
                </StyledListHeaderCell>
                <StyledListDateCell>
                  <Text variant="caption" color="text.secondary" numberOfLines={1}>
                    {t('ventilation.tracking.list.admissionDate')}
                  </Text>
                </StyledListDateCell>
                <StyledListTimeCell>
                  <Text variant="caption" color="text.secondary" numberOfLines={1}>
                    {t('ventilation.tracking.list.admissionTime')}
                  </Text>
                </StyledListTimeCell>
              </StyledListHeader>
              {rows.map((row, index) => (
                <StyledItem
                  key={row.admissionId}
                  testID={`${HISTORY_TEST_IDS.item}-${row.admissionId}`}
                >
                  <StyledPatientRowButton
                    accessibilityRole="button"
                    accessibilityLabel={t(
                      'ventilation.tracking.actions.openPatientHint',
                      { patient: getPatientLabel(row, t) }
                    )}
                    onPress={() => handleViewDetails(row)}
                    testID={`${HISTORY_TEST_IDS.rowButton}-${row.admissionId}`}
                  >
                    <StyledPatientRowNumber
                      testID={`${HISTORY_TEST_IDS.rowNumber}-${row.admissionId}`}
                    >
                      <Text variant="caption" color="text.secondary" numberOfLines={1}>
                        {index + 1}
                      </Text>
                    </StyledPatientRowNumber>
                    <StyledListCodeCell>
                      <Text variant="caption" numberOfLines={1}>
                        {row.patientCode ||
                          t('ventilation.tracking.patient.notRecorded')}
                      </Text>
                    </StyledListCodeCell>
                    <StyledPatientRowCell>
                      <Text variant="caption" numberOfLines={1}>
                        {getPatientLabel(row, t)}
                      </Text>
                    </StyledPatientRowCell>
                    <StyledListDateCell>
                      <Text variant="caption" numberOfLines={1}>
                        {row.admittedDateLabel ||
                          t('ventilation.tracking.patient.notRecorded')}
                      </Text>
                    </StyledListDateCell>
                    <StyledListTimeCell>
                      <Text variant="caption" numberOfLines={1}>
                        {row.admittedTimeLabel ||
                          t('ventilation.tracking.patient.notRecorded')}
                      </Text>
                    </StyledListTimeCell>
                  </StyledPatientRowButton>
                </StyledItem>
              ))}
            </StyledList>
          </StyledListScroller>
        )}

        {renderDetailPanel({
          t,
          selectedAdmissionId,
          selectedTracking,
          isDetailLoading,
          detailErrorCode,
          handleCloseDetails,
          handleUpdateTracking,
        })}
      </StyledScreenContent>
    </StyledContainer>
  );
};

export default HistoryScreenAndroid;
