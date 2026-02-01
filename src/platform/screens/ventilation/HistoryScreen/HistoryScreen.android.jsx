/**
 * HistoryScreen Component - Android
 * File: HistoryScreen.android.jsx
 */
import React from 'react';
import { FlatList } from 'react-native';
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
  StyledModalOverlay,
} from './HistoryScreen.android.styles';
import { HISTORY_TEST_IDS } from './types';

const HistoryScreenAndroid = () => {
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
      <StyledContainer testID={HISTORY_TEST_IDS.screen}>
        <Text>{t('ventilation.history.states.loading')}</Text>
      </StyledContainer>
    );
  }

  const renderItem = ({ item }) => {
    const { entry, dateTime, condition, tierKey } = item;
    return (
      <StyledItem testID={`${HISTORY_TEST_IDS.item}-${entry.sessionId}`}>
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
              accessibilityLabel={t('ventilation.history.actions.resumeHint')}
              testID={HISTORY_TEST_IDS.resume}
            >
              {t('ventilation.history.actions.resume')}
            </Button>
            <Button
              variant="outline"
              onPress={() => handleViewDetails(entry)}
              accessibilityLabel={t('ventilation.history.actions.viewDetailsHint')}
              testID={HISTORY_TEST_IDS.viewDetails}
            >
              {t('ventilation.history.actions.viewDetails')}
            </Button>
            <Button
              variant="outline"
              onPress={() => handleDeleteRequest(entry.sessionId)}
              accessibilityLabel={t('ventilation.history.actions.deleteHint')}
              testID={HISTORY_TEST_IDS.delete}
            >
              {t('ventilation.history.actions.delete')}
            </Button>
          </StyledItemActions>
        </StyledItemRow>
      </StyledItem>
    );
  };

  return (
    <StyledContainer
      accessibilityLabel={t('ventilation.history.accessibilityLabel')}
      testID={HISTORY_TEST_IDS.screen}
    >
      {isCorrupt && (
        <StyledBanner testID={HISTORY_TEST_IDS.corruptBanner}>
          <Text variant="body">{t('ventilation.history.corruptRecovery')}</Text>
        </StyledBanner>
      )}
      {historyErrorCode && !isCorrupt && (
        <StyledErrorBanner testID={HISTORY_TEST_IDS.errorBanner}>
          <Text variant="body">{t('ventilation.history.states.error')}</Text>
        </StyledErrorBanner>
      )}
      {isEmpty && !isHistoryLoading ? (
        <StyledEmpty testID={HISTORY_TEST_IDS.empty}>
          <Text variant="body">{t('ventilation.history.empty')}</Text>
        </StyledEmpty>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(row) => row.entry.sessionId}
          renderItem={renderItem}
          testID={HISTORY_TEST_IDS.list}
          listKey="history-list"
        />
      )}
      {sessionIdToDelete ? (
        <StyledModalOverlay>
          <StyledConfirmBox testID={HISTORY_TEST_IDS.deleteConfirm}>
            <Text variant="label">{t('ventilation.history.deleteConfirm.title')}</Text>
            <Text variant="body">{t('ventilation.history.deleteConfirm.message')}</Text>
            <StyledConfirmActions>
              <Button
                variant="outline"
                onPress={handleDeleteCancel}
                testID={HISTORY_TEST_IDS.deleteConfirmCancel}
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

export default HistoryScreenAndroid;
