/**
 * ReviewQueueScreen Component - Android
 * File: ReviewQueueScreen.android.jsx
 */

import React from 'react';
import { Button, Text, TextArea } from '@platform/components';
import useReviewQueueScreen from './useReviewQueueScreen';
import {
  StyledActionRow,
  StyledBanner,
  StyledContainer,
  StyledContent,
  StyledFilterRow,
  StyledHeader,
  StyledItem,
  StyledList,
  StyledMetaRow,
  StyledSummaryItem,
  StyledSummaryRow,
} from './ReviewQueueScreen.android.styles';

const SummaryItem = ({ label, value }) => (
  <StyledSummaryItem>
    <Text variant="caption">{label}</Text>
    <Text variant="h3">{String(value)}</Text>
  </StyledSummaryItem>
);

const DetailText = ({ label, value }) => (
  <Text variant="caption">
    {label}: {value || '-'}
  </Text>
);

const ReviewQueueScreenAndroid = () => {
  const {
    t,
    testIds,
    canReview,
    items,
    summary,
    filterOptions,
    selectedEntityType,
    setSelectedEntityType,
    commentsById,
    setComment,
    isLoading,
    actionLoadingById,
    errorCode,
    refresh,
    actions,
    handleAction,
  } = useReviewQueueScreen();

  if (!canReview) {
    return (
      <StyledContainer testID={testIds.screen}>
        <StyledContent testID={testIds.forbidden}>
          <Text variant="h2">{t('reviewQueue.forbidden.title')}</Text>
          <Text variant="body">{t('reviewQueue.forbidden.message')}</Text>
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer testID={testIds.screen} accessibilityLabel={t('reviewQueue.accessibilityLabel')}>
      <StyledContent>
        <StyledHeader>
          <Text variant="h1">{t('reviewQueue.title')}</Text>
          <Text variant="body">{t('reviewQueue.subtitle')}</Text>
          <Button variant="outline" onPress={refresh} testID={testIds.refresh}>
            {t('reviewQueue.actions.refresh')}
          </Button>
        </StyledHeader>

        <StyledSummaryRow testID={testIds.summary}>
          <SummaryItem label={t('reviewQueue.summary.total')} value={summary.total} />
          <SummaryItem label={t('reviewQueue.summary.urgent')} value={summary.urgent} />
          <SummaryItem label={t('reviewQueue.summary.conflicts')} value={summary.conflicts} />
          <SummaryItem label={t('reviewQueue.summary.datasetReady')} value={summary.datasetReady} />
        </StyledSummaryRow>

        <StyledFilterRow testID={testIds.filters}>
          {filterOptions.map((option) => (
            <Button
              key={option.value || 'all'}
              variant={selectedEntityType === option.value ? 'primary' : 'outline'}
              onPress={() => setSelectedEntityType(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </StyledFilterRow>

        {isLoading ? (
          <Text testID={testIds.loading}>{t('reviewQueue.states.loading')}</Text>
        ) : null}
        {errorCode ? (
          <StyledBanner testID={testIds.error}>
            <Text variant="body">{t('reviewQueue.states.error')}</Text>
          </StyledBanner>
        ) : null}
        {!isLoading && items.length === 0 ? (
          <Text testID={testIds.empty}>{t('reviewQueue.states.empty')}</Text>
        ) : null}

        <StyledList testID={testIds.list}>
          {items.map((item) => {
            const loading = actionLoadingById[item.entityId] === true;
            const comment = commentsById[item.entityId] || '';
            return (
              <StyledItem key={`${item.entityType}:${item.entityId}`} testID={`${testIds.item}-${item.entityId}`}>
                <Text variant="h3">{item.title}</Text>
                <StyledMetaRow>
                  <DetailText label={t('reviewQueue.fields.type')} value={t(`reviewQueue.entityTypes.${item.entityType}`)} />
                  <DetailText label={t('reviewQueue.fields.status')} value={item.reviewStatus} />
                  <DetailText label={t('reviewQueue.fields.priority')} value={item.triage.priority} />
                  <DetailText label={t('reviewQueue.fields.validation')} value={item.triage.validationStatus} />
                </StyledMetaRow>
                {item.triage.missingData.length ? (
                  <Text variant="body">
                    {t('reviewQueue.fields.missingData')}: {item.triage.missingData.join(', ')}
                  </Text>
                ) : null}
                {item.triage.uncertainty ? (
                  <Text variant="body">
                    {t('reviewQueue.fields.uncertainty')}: {item.triage.uncertainty.reason || item.triage.uncertainty.fields?.join(', ')}
                  </Text>
                ) : null}
                {item.triage.syncConflict ? (
                  <Text variant="body">
                    {t('reviewQueue.fields.conflict')}: {item.triage.syncConflict.resolution || item.triage.syncConflict.errorMessage}
                  </Text>
                ) : null}
                {item.datasetReadiness ? (
                  <Text variant="body">
                    {t('reviewQueue.fields.datasetReadiness')}: {item.datasetReadiness.approvedForDataset ? t('reviewQueue.dataset.datasetApproved') : t('reviewQueue.dataset.notDatasetApproved')}
                  </Text>
                ) : null}
                <TextArea
                  value={comment}
                  onChangeText={(value) => setComment(item.entityId, value)}
                  placeholder={t('reviewQueue.commentPlaceholder')}
                  testID={`${testIds.comment}-${item.entityId}`}
                />
                <StyledActionRow>
                  <Button
                    variant="primary"
                    disabled={loading || (item.triage.needsOverrideReason && !comment.trim())}
                    loading={loading}
                    onPress={() => handleAction(item, actions.APPROVE)}
                    testID={`${testIds.approve}-${item.entityId}`}
                  >
                    {t('reviewQueue.actions.approve')}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={loading}
                    onPress={() => handleAction(item, actions.REQUEST_CORRECTION)}
                    testID={`${testIds.correction}-${item.entityId}`}
                  >
                    {t('reviewQueue.actions.requestCorrection')}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={loading || !comment.trim()}
                    onPress={() => handleAction(item, actions.EXCLUDE)}
                    testID={`${testIds.exclude}-${item.entityId}`}
                  >
                    {t('reviewQueue.actions.exclude')}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={loading}
                    onPress={() => handleAction(item, actions.TRIAGE)}
                    testID={`${testIds.defer}-${item.entityId}`}
                  >
                    {t('reviewQueue.actions.defer')}
                  </Button>
                </StyledActionRow>
              </StyledItem>
            );
          })}
        </StyledList>
      </StyledContent>
    </StyledContainer>
  );
};

export default ReviewQueueScreenAndroid;
