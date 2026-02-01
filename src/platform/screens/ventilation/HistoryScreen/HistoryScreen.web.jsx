/**
 * HistoryScreen Component - Web
 * File: HistoryScreen.web.jsx
 */
import React from 'react';
import { useRouter } from 'expo-router';
import { Button, Text } from '@platform/components';
import { useI18n } from '@hooks';
import useHistoryScreen from './useHistoryScreen';
import {
  StyledBanner,
  StyledConfirmActions,
  StyledConfirmBox,
  StyledContainer,
  StyledEmpty,
  StyledErrorBanner,
  StyledItem,
  StyledItemActions,
  StyledItemMeta,
  StyledItemRow,
  StyledList,
  StyledModalOverlay,
} from './HistoryScreen.web.styles';
import { HISTORY_TEST_IDS } from './types';

const HistoryScreenWeb = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    rows,
    isEmpty,
    isHistoryLoading,
    historyErrorCode,
    isCorrupt,
    sessionIdToDelete,
    handleResume,
    handleDeleteRequest,
    handleDeleteConfirm,
    handleDeleteCancel,
  } = useHistoryScreen();

  const handleViewDetails = (entry) => {
    handleResume(entry);
    router.push('/session/recommendation');
  };

  const handleResumePress = (entry) => {
    handleResume(entry);
    router.push('/session/recommendation');
  };

  if (isHistoryLoading) {
    return (
      <StyledContainer aria-label={t('ventilation.history.accessibilityLabel')} data-testid={HISTORY_TEST_IDS.screen}>
        <Text>{t('ventilation.history.states.loading')}</Text>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer
      aria-label={t('ventilation.history.accessibilityLabel')}
      data-testid={HISTORY_TEST_IDS.screen}
      role="main"
    >
      {isCorrupt && (
        <StyledBanner data-testid={HISTORY_TEST_IDS.corruptBanner}>
          <Text variant="body" color="status.warning.text">{t('ventilation.history.corruptRecovery')}</Text>
        </StyledBanner>
      )}
      {historyErrorCode && !isCorrupt && (
        <StyledErrorBanner data-testid={HISTORY_TEST_IDS.errorBanner}>
          <Text variant="body" color="status.error.text">{t('ventilation.history.states.error')}</Text>
        </StyledErrorBanner>
      )}
      {isEmpty && !isHistoryLoading ? (
        <StyledEmpty data-testid={HISTORY_TEST_IDS.empty}>
          <Text variant="body">{t('ventilation.history.empty')}</Text>
        </StyledEmpty>
      ) : (
        <StyledList aria-label={t('ventilation.history.title')} data-testid={HISTORY_TEST_IDS.list} role="list">
          {rows.map(({ entry, dateTime, condition, tierKey }) => (
            <StyledItem
              key={entry.sessionId}
              data-testid={`${HISTORY_TEST_IDS.item}-${entry.sessionId}`}
              role="listitem"
            >
              <StyledItemRow>
                <StyledItemMeta>
                  <Text variant="body">{t('ventilation.history.session.dateTime', { dateTime })}</Text>
                  {condition ? (
                    <Text variant="caption">{t('ventilation.history.session.condition', { condition })}</Text>
                  ) : null}
                  <Text variant="caption">{t(`ventilation.recommendation.confidence.${tierKey}`)}</Text>
                </StyledItemMeta>
                <StyledItemActions>
                  <Button
                    variant="primary"
                    onPress={() => handleResumePress(entry)}
                    aria-label={t('ventilation.history.actions.resumeHint')}
                    data-testid={HISTORY_TEST_IDS.resume}
                  >
                    {t('ventilation.history.actions.resume')}
                  </Button>
                  <Button
                    variant="outline"
                    onPress={() => handleViewDetails(entry)}
                    aria-label={t('ventilation.history.actions.viewDetailsHint')}
                    data-testid={HISTORY_TEST_IDS.viewDetails}
                  >
                    {t('ventilation.history.actions.viewDetails')}
                  </Button>
                  <Button
                    variant="outline"
                    onPress={() => handleDeleteRequest(entry.sessionId)}
                    aria-label={t('ventilation.history.actions.deleteHint')}
                    data-testid={HISTORY_TEST_IDS.delete}
                  >
                    {t('ventilation.history.actions.delete')}
                  </Button>
                </StyledItemActions>
              </StyledItemRow>
            </StyledItem>
          ))}
        </StyledList>
      )}
      {sessionIdToDelete ? (
        <StyledModalOverlay role="dialog" aria-modal="true" aria-labelledby="history-delete-title">
          <StyledConfirmBox data-testid={HISTORY_TEST_IDS.deleteConfirm}>
            <Text id="history-delete-title" variant="label">
              {t('ventilation.history.deleteConfirm.title')}
            </Text>
            <Text variant="body">{t('ventilation.history.deleteConfirm.message')}</Text>
            <StyledConfirmActions>
              <Button
                variant="outline"
                onPress={handleDeleteCancel}
                data-testid={HISTORY_TEST_IDS.deleteConfirmCancel}
              >
                {t('ventilation.history.deleteConfirm.cancel')}
              </Button>
              <Button variant="primary" onPress={handleDeleteConfirm}>
                {t('ventilation.history.deleteConfirm.confirm')}
              </Button>
            </StyledConfirmActions>
          </StyledConfirmBox>
        </StyledModalOverlay>
      ) : null}
    </StyledContainer>
  );
};

export default HistoryScreenWeb;
