/**
 * RoomDetailScreen - Android
 * File: RoomDetailScreen.android.jsx
 */
import React from 'react';
import { ScrollView } from 'react-native';
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingSpinner,
  OfflineState,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledContent,
  StyledSection,
  StyledActions,
} from './RoomDetailScreen.android.styles';
import useRoomDetailScreen from './useRoomDetailScreen';

const RoomDetailScreenAndroid = () => {
  const { t } = useI18n();
  const {
    room,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onDelete,
  } = useRoomDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="room-detail-loading"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (isOffline) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <OfflineState
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="room-detail-offline"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (hasError) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <ErrorState
              title={t('room.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="room-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!room) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('room.detail.notFoundTitle')}
              description={t('room.detail.notFoundMessage')}
              testID="room-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="room-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = room.created_at
    ? new Date(room.created_at).toLocaleString()
    : '';
  const updatedAt = room.updated_at
    ? new Date(room.updated_at).toLocaleString()
    : '';
  const name = room?.name ?? '';
  const floor = room?.floor ?? '';

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="room-detail-title"
          >
            {t('room.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="room-detail-id">
              {t('room.detail.idLabel')}: {room.id}
            </Text>
          </StyledSection>
          {name ? (
            <StyledSection>
              <Text variant="body" testID="room-detail-name">
                {t('room.detail.nameLabel')}: {name}
              </Text>
            </StyledSection>
          ) : null}
          {floor ? (
            <StyledSection>
              <Text variant="body" testID="room-detail-floor">
                {t('room.detail.floorLabel')}: {floor}
              </Text>
            </StyledSection>
          ) : null}
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="room-detail-created">
                {t('room.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="room-detail-updated">
                {t('room.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('room.detail.backHint')}
              testID="room-detail-back"
            >
              {t('common.back')}
            </Button>
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('room.detail.delete')}
              accessibilityHint={t('room.detail.deleteHint')}
              testID="room-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default RoomDetailScreenAndroid;
