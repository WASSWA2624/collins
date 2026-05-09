/**
 * Tracking screen component - Web
 * File: HistoryScreen.web.jsx
 */
import React from 'react';
import { Button, Icon, Text } from '@platform/components';
import SearchBar from '@platform/patterns/SearchBar/SearchBar.web';
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
  StyledHeader,
  StyledHeaderActions,
  StyledHeaderCopy,
  StyledItem,
  StyledItemActions,
  StyledItemMain,
  StyledItemMeta,
  StyledItemRow,
  StyledList,
  StyledRiskNote,
  StyledSearchWrap,
  StyledStatusGroup,
  StyledStatusPill,
  StyledSummaryBar,
  StyledTimeline,
  StyledTimelineItem,
} from './HistoryScreen.web.styles';
import { HISTORY_TEST_IDS } from './types';

const getPatientLabel = (row, t) =>
  row.appAdmissionCode ||
  row.appPatientCode ||
  t('ventilation.tracking.patient.unknown');

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

  return (
    <StyledDetailPanel
      data-testid={HISTORY_TEST_IDS.detailPanel}
      testID={HISTORY_TEST_IDS.detailPanel}
    >
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
          icon={<Icon glyph={'\u00d7'} size="sm" tone="primary" decorative />}
          onPress={handleCloseDetails}
          aria-label={t('ventilation.tracking.actions.closeDetailsHint')}
          data-testid={HISTORY_TEST_IDS.detailClose}
          testID={HISTORY_TEST_IDS.detailClose}
        >
          {t('common.close')}
        </Button>
        <Button
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

const HistoryScreenWeb = () => {
  const { t } = useI18n();
  const {
    rows,
    activeFacility,
    isEmpty,
    isSearchEmpty,
    isHistoryLoading,
    historyErrorCode,
    localDraft,
    searchQuery,
    visibleRows,
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
  } = useHistoryScreen();

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

  return (
    <StyledContainer
      aria-label={t('ventilation.tracking.accessibilityLabel')}
      data-testid={HISTORY_TEST_IDS.screen}
      testID={HISTORY_TEST_IDS.screen}
      role="main"
    >
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

        <StyledSummaryBar
          data-testid={HISTORY_TEST_IDS.facility}
          testID={HISTORY_TEST_IDS.facility}
        >
          <Text variant="label">
            {activeFacility?.name ||
              t('ventilation.tracking.activeFacility.none')}
          </Text>
          <Text variant="caption" color="text.secondary">
            {t('ventilation.tracking.activePatients', { count: visibleRows })}
          </Text>
        </StyledSummaryBar>
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
          {rows.map((row) => (
            <StyledItem
              key={row.admissionId}
              data-testid={`${HISTORY_TEST_IDS.item}-${row.admissionId}`}
              testID={`${HISTORY_TEST_IDS.item}-${row.admissionId}`}
              role="listitem"
            >
              <StyledItemRow>
                <StyledItemMain>
                  <Text variant="label">{getPatientLabel(row, t)}</Text>
                  <StyledItemMeta>
                    <Text variant="caption">{row.admissionStatusLabel}</Text>
                    <Text variant="caption">{row.patientPathwayLabel}</Text>
                    <Text variant="caption">
                      {row.bedNumber
                        ? t('ventilation.tracking.patient.bed', {
                            bed: row.bedNumber,
                          })
                        : t('ventilation.tracking.patient.bedMissing')}
                    </Text>
                    {row.admittedAtLabel ? (
                      <Text variant="caption">
                        {t('ventilation.tracking.patient.admitted', {
                          dateTime: row.admittedAtLabel,
                        })}
                      </Text>
                    ) : null}
                  </StyledItemMeta>
                </StyledItemMain>
                <StyledStatusGroup>
                  <StyledStatusPill
                    $level={row.risk.level}
                    data-testid={HISTORY_TEST_IDS.risk}
                    testID={HISTORY_TEST_IDS.risk}
                  >
                    <Text variant="caption">{row.risk.label}</Text>
                  </StyledStatusPill>
                  <StyledStatusPill
                    data-testid={HISTORY_TEST_IDS.review}
                    testID={HISTORY_TEST_IDS.review}
                  >
                    <Text variant="caption">{row.reviewLabel}</Text>
                  </StyledStatusPill>
                  <StyledStatusPill
                    data-testid={HISTORY_TEST_IDS.sync}
                    testID={HISTORY_TEST_IDS.sync}
                  >
                    <Text variant="caption">{row.syncLabel}</Text>
                  </StyledStatusPill>
                </StyledStatusGroup>
                <StyledItemActions>
                  <Button
                    variant="outline"
                    size="small"
                    icon={
                      <Icon
                        glyph={'\u2192'}
                        size="sm"
                        tone="primary"
                        decorative
                      />
                    }
                    onPress={() => handleViewDetails(row)}
                    aria-label={t(
                      'ventilation.tracking.actions.viewDetailsHint'
                    )}
                    data-testid={HISTORY_TEST_IDS.viewDetails}
                    testID={HISTORY_TEST_IDS.viewDetails}
                  >
                    {t('ventilation.tracking.actions.viewDetails')}
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    icon={
                      <Icon glyph="+" size="sm" tone="primary" decorative />
                    }
                    onPress={() => handleUpdateTracking(row)}
                    aria-label={t(
                      'ventilation.tracking.actions.updateValuesHint'
                    )}
                    data-testid={HISTORY_TEST_IDS.updateValues}
                    testID={HISTORY_TEST_IDS.updateValues}
                  >
                    {t('ventilation.tracking.actions.updateValues')}
                  </Button>
                </StyledItemActions>
              </StyledItemRow>
              <StyledRiskNote>
                <Text variant="body">{row.risk.prompt}</Text>
              </StyledRiskNote>
              <Text
                variant="caption"
                color="text.secondary"
                data-testid={HISTORY_TEST_IDS.missingData}
                testID={HISTORY_TEST_IDS.missingData}
              >
                {t('ventilation.tracking.patient.missingData', {
                  fields: row.missingDataLabel,
                })}
              </Text>
            </StyledItem>
          ))}
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
      })}
    </StyledContainer>
  );
};

export default HistoryScreenWeb;
