/**
 * Tracking screen component - Web
 * File: HistoryScreen.web.jsx
 */
import React from 'react';
import { Button, Icon, Text } from '@platform/components';
import SearchBar from '@platform/patterns/SearchBar/SearchBar.web';
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
  StyledListHeader,
  StyledListHeaderCell,
  StyledPatientDataGrid,
  StyledPatientDataItem,
  StyledPatientDataSection,
  StyledPatientRowButton,
  StyledPatientRowCell,
  StyledPatientRowNumber,
  StyledPrintHeader,
  StyledSearchWrap,
  StyledStatusGroup,
  StyledStatusPill,
  StyledTimeline,
  StyledTimelineItem,
  TrackingPrintStyles,
} from './HistoryScreen.web.styles';
import {
  getPatientLabel,
  getTrackingPatientDataRows,
} from './trackingDetailData';
import { HISTORY_TEST_IDS } from './types';

const renderDetailPanel = ({
  t,
  selectedAdmissionId,
  selectedTracking,
  isDetailLoading,
  detailErrorCode,
  handleCloseDetails,
  handleUpdateTracking,
  handlePrintDetails,
}) => {
  if (!selectedAdmissionId) return null;
  const row = selectedTracking?.row;
  const timeline = selectedTracking?.timeline || [];
  const patientDataRows = getTrackingPatientDataRows(row, t);

  return (
    <StyledDetailPanel
      data-print-root={row ? 'true' : undefined}
      data-testid={HISTORY_TEST_IDS.detailPanel}
      testID={HISTORY_TEST_IDS.detailPanel}
    >
      <StyledPrintHeader>
        <Text variant="h2">{t('ventilation.tracking.print.title')}</Text>
        <Text variant="caption" color="text.secondary">
          {t('ventilation.tracking.print.generatedAt', {
            dateTime: formatDateTime(new Date()),
          })}
        </Text>
      </StyledPrintHeader>
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
          data-print-hidden="true"
          variant="outline"
          size="small"
          icon={<Icon glyph={'\u00d7'} size="sm" tone="primary" decorative />}
          onPress={handleCloseDetails}
          aria-label={t('ventilation.tracking.actions.closeDetailsHint')}
          data-testid={HISTORY_TEST_IDS.detailClose}
          testID={HISTORY_TEST_IDS.detailClose}
        >
          {t('common.close')}
        </Button>
        <Button
          data-print-hidden="true"
          variant="outline"
          size="small"
          icon={<Icon glyph="+" size="sm" tone="primary" decorative />}
          onPress={() => handleUpdateTracking(row)}
          aria-label={t('ventilation.tracking.actions.updateValuesHint')}
          data-testid={HISTORY_TEST_IDS.updateValues}
          testID={HISTORY_TEST_IDS.updateValues}
        >
          {t('ventilation.tracking.actions.updateValues')}
        </Button>
        <Button
          data-print-hidden="true"
          variant="outline"
          size="small"
          icon={<Icon glyph={'\u2399'} size="sm" tone="primary" decorative />}
          onPress={handlePrintDetails}
          aria-label={t('ventilation.tracking.actions.printDetailsHint')}
          data-testid={HISTORY_TEST_IDS.printDetails}
          testID={HISTORY_TEST_IDS.printDetails}
        >
          {t('ventilation.tracking.actions.printDetails')}
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
              data-testid={HISTORY_TEST_IDS.detailPatientData}
              testID={HISTORY_TEST_IDS.detailPatientData}
            >
              <Text variant="label">
                {t('ventilation.tracking.patientData.title')}
              </Text>
              <StyledPatientDataGrid>
                {patientDataRows.map((item) => (
                  <StyledPatientDataItem
                    key={item.key}
                    data-testid={`${HISTORY_TEST_IDS.detailPatientDataItem}-${item.key}`}
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
              $level={row?.risk?.level}
              data-testid={HISTORY_TEST_IDS.risk}
              testID={HISTORY_TEST_IDS.risk}
            >
              <Text variant="caption">{row?.risk?.label}</Text>
            </StyledStatusPill>
            <StyledStatusPill
              data-testid={HISTORY_TEST_IDS.review}
              testID={HISTORY_TEST_IDS.review}
            >
              <Text variant="caption">{row?.reviewLabel}</Text>
            </StyledStatusPill>
            <StyledStatusPill
              data-testid={HISTORY_TEST_IDS.sync}
              testID={HISTORY_TEST_IDS.sync}
            >
              <Text variant="caption">{row?.syncLabel}</Text>
            </StyledStatusPill>
          </StyledStatusGroup>
          <Text variant="body">{row?.risk?.prompt}</Text>
          <Text
            variant="caption"
            color="text.secondary"
            data-testid={HISTORY_TEST_IDS.missingData}
            testID={HISTORY_TEST_IDS.missingData}
          >
            {t('ventilation.tracking.patient.missingData', {
              fields: row?.missingDataLabel,
            })}
          </Text>
          <Text variant="label">
            {t('ventilation.tracking.detail.historyTitle')}
          </Text>
          <StyledTimeline
            data-testid={HISTORY_TEST_IDS.detailTimeline}
            testID={HISTORY_TEST_IDS.detailTimeline}
          >
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

const HistoryScreenWeb = ({ detailMode = false } = {}) => {
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
    handlePrintDetails,
  } = useHistoryScreen({ detailMode });

  if (isHistoryLoading) {
    return (
      <StyledContainer
        aria-label={t('ventilation.tracking.accessibilityLabel')}
        data-testid={HISTORY_TEST_IDS.screen}
        testID={HISTORY_TEST_IDS.screen}
      >
        <StyledEmpty role="status" aria-live="polite">
          <Text variant="label">
            {t('ventilation.tracking.states.loading')}
          </Text>
        </StyledEmpty>
      </StyledContainer>
    );
  }

  if (isDetailMode) {
    return (
      <StyledContainer
        aria-label={t('ventilation.tracking.accessibilityLabel')}
        data-testid={HISTORY_TEST_IDS.screen}
        testID={HISTORY_TEST_IDS.screen}
        role="main"
      >
        <TrackingPrintStyles />
        <StyledHeader>
          <StyledHeaderCopy>
            <Text variant="h1">{t('ventilation.tracking.detail.title')}</Text>
            <Text variant="body" color="text.secondary">
              {activeFacility?.name || t('ventilation.tracking.activeFacility.none')}
            </Text>
          </StyledHeaderCopy>
          <StyledHeaderActions>
            <Button
              variant="outline"
              size="small"
              icon={<Icon glyph={'\u21bb'} size="sm" tone="primary" decorative />}
              onPress={handleRefresh}
              aria-label={t('ventilation.tracking.actions.refreshHint')}
              data-testid={HISTORY_TEST_IDS.refresh}
              testID={HISTORY_TEST_IDS.refresh}
            >
              {t('ventilation.tracking.actions.refresh')}
            </Button>
          </StyledHeaderActions>
        </StyledHeader>

        {showAdmittedBanner && (
          <StyledBanner
            $tone="success"
            data-testid={HISTORY_TEST_IDS.admittedBanner}
            testID={HISTORY_TEST_IDS.admittedBanner}
          >
            <Text variant="body" color="status.success.text">
              {t('ventilation.tracking.admittedBanner')}
            </Text>
          </StyledBanner>
        )}

        {localDraft && (
          <StyledBanner
            data-testid={HISTORY_TEST_IDS.draftBanner}
            testID={HISTORY_TEST_IDS.draftBanner}
          >
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
          handlePrintDetails,
        })}
      </StyledContainer>
    );
  }

  return (
    <StyledContainer
      aria-label={t('ventilation.tracking.accessibilityLabel')}
      data-testid={HISTORY_TEST_IDS.screen}
      testID={HISTORY_TEST_IDS.screen}
      role="main"
    >
      <TrackingPrintStyles />
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
            icon={<Icon glyph={'\u21bb'} size="sm" tone="primary" decorative />}
            onPress={handleRefresh}
            aria-label={t('ventilation.tracking.actions.refreshHint')}
            data-testid={HISTORY_TEST_IDS.refresh}
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
            onChange={handleSearchQueryChange}
            placeholder={t('ventilation.tracking.search.placeholder')}
            accessibilityLabel={t(
              'ventilation.tracking.search.accessibilityLabel'
            )}
            testID={HISTORY_TEST_IDS.search}
            debounceMs={150}
          />
        </StyledSearchWrap>

        <StyledFacilityFilter
          data-testid={HISTORY_TEST_IDS.facility}
          testID={HISTORY_TEST_IDS.facility}
        >
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
        <StyledBanner
          $tone="success"
          data-testid={HISTORY_TEST_IDS.admittedBanner}
          testID={HISTORY_TEST_IDS.admittedBanner}
        >
          <Text variant="body" color="status.success.text">
            {t('ventilation.tracking.admittedBanner')}
          </Text>
        </StyledBanner>
      )}

      {localDraft && (
        <StyledBanner
          data-testid={HISTORY_TEST_IDS.draftBanner}
          testID={HISTORY_TEST_IDS.draftBanner}
        >
          <Text variant="body" color="status.warning.text">
            {t('ventilation.tracking.localDraft')}
          </Text>
        </StyledBanner>
      )}

      {historyErrorCode && (
        <StyledErrorBanner
          data-testid={HISTORY_TEST_IDS.errorBanner}
          testID={HISTORY_TEST_IDS.errorBanner}
        >
          <Text variant="body" color="status.error.text">
            {t('ventilation.tracking.states.error')}
          </Text>
        </StyledErrorBanner>
      )}

      {isEmpty && !isHistoryLoading ? (
        <StyledEmpty
          data-testid={HISTORY_TEST_IDS.empty}
          testID={HISTORY_TEST_IDS.empty}
        >
          <Text variant="label">{t('ventilation.tracking.empty')}</Text>
          <Text variant="body" color="text.secondary">
            {t('ventilation.tracking.emptyHint')}
          </Text>
          <StyledEmptyActions>
            <Button
              variant="primary"
              onPress={handleOpenAdmit}
              data-testid={HISTORY_TEST_IDS.resume}
              testID={HISTORY_TEST_IDS.resume}
            >
              {t('ventilation.tracking.actions.admitFirst')}
            </Button>
          </StyledEmptyActions>
        </StyledEmpty>
      ) : isSearchEmpty ? (
        <StyledEmpty
          data-testid={HISTORY_TEST_IDS.searchEmpty}
          testID={HISTORY_TEST_IDS.searchEmpty}
        >
          <Text variant="label">{t('ventilation.tracking.search.empty')}</Text>
          <Text variant="body" color="text.secondary">
            {t('ventilation.tracking.search.emptyHint')}
          </Text>
        </StyledEmpty>
      ) : (
        <StyledList
          aria-label={t('ventilation.tracking.title')}
          data-testid={HISTORY_TEST_IDS.list}
          testID={HISTORY_TEST_IDS.list}
          role="list"
        >
          <StyledListHeader
            role="presentation"
            data-testid={HISTORY_TEST_IDS.listHeader}
            {...(process.env.NODE_ENV === 'test'
              ? { testID: HISTORY_TEST_IDS.listHeader }
              : {})}
          >
            <StyledListHeaderCell>
              {t('ventilation.tracking.list.rowNumber')}
            </StyledListHeaderCell>
            <StyledListHeaderCell>
              {t('ventilation.tracking.list.patientCode')}
            </StyledListHeaderCell>
            <StyledListHeaderCell>
              {t('ventilation.tracking.list.patientName')}
            </StyledListHeaderCell>
            <StyledListHeaderCell>
              {t('ventilation.tracking.list.admissionDate')}
            </StyledListHeaderCell>
            <StyledListHeaderCell>
              {t('ventilation.tracking.list.admissionTime')}
            </StyledListHeaderCell>
          </StyledListHeader>
          {rows.map((row, index) => {
            const rowTestProps =
              process.env.NODE_ENV === 'test'
                ? {
                    onPress: () => handleViewDetails(row),
                    testID: `${HISTORY_TEST_IDS.rowButton}-${row.admissionId}`,
                  }
                : {};
            return (
              <StyledItem
                key={row.admissionId}
                data-testid={`${HISTORY_TEST_IDS.item}-${row.admissionId}`}
                testID={`${HISTORY_TEST_IDS.item}-${row.admissionId}`}
                role="listitem"
              >
                <StyledPatientRowButton
                  type="button"
                  onClick={() => handleViewDetails(row)}
                  aria-label={t('ventilation.tracking.actions.openPatientHint', {
                    patient: getPatientLabel(row, t),
                  })}
                  data-testid={`${HISTORY_TEST_IDS.rowButton}-${row.admissionId}`}
                  {...rowTestProps}
                >
                  <StyledPatientRowNumber
                    data-testid={`${HISTORY_TEST_IDS.rowNumber}-${row.admissionId}`}
                    {...(process.env.NODE_ENV === 'test'
                      ? {
                          testID: `${HISTORY_TEST_IDS.rowNumber}-${row.admissionId}`,
                        }
                      : {})}
                  >
                    {index + 1}
                  </StyledPatientRowNumber>
                  <StyledPatientRowCell>
                    {row.patientCode || t('ventilation.tracking.patient.notRecorded')}
                  </StyledPatientRowCell>
                  <StyledPatientRowCell>{getPatientLabel(row, t)}</StyledPatientRowCell>
                  <StyledPatientRowCell>
                    {row.admittedDateLabel || t('ventilation.tracking.patient.notRecorded')}
                  </StyledPatientRowCell>
                  <StyledPatientRowCell>
                    {row.admittedTimeLabel || t('ventilation.tracking.patient.notRecorded')}
                  </StyledPatientRowCell>
                </StyledPatientRowButton>
              </StyledItem>
            );
          })}
        </StyledList>
      )}

      {renderDetailPanel({
        t,
        selectedAdmissionId,
        selectedTracking,
        isDetailLoading,
        detailErrorCode,
        handleCloseDetails,
        handleUpdateTracking,
        handlePrintDetails,
      })}
    </StyledContainer>
  );
};

export default HistoryScreenWeb;
