/**
 * WardDetailScreen - iOS
 * File: WardDetailScreen.ios.jsx
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
} from './WardDetailScreen.ios.styles';
import useWardDetailScreen from './useWardDetailScreen';

const WardDetailScreenIOS = () => {
  const { t } = useI18n();
  const {
    ward,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onDelete,
  } = useWardDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="ward-detail-loading"
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
              testID="ward-detail-offline"
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
              title={t('ward.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="ward-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!ward) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('ward.detail.notFoundTitle')}
              description={t('ward.detail.notFoundMessage')}
              testID="ward-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="ward-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = ward.created_at
    ? new Date(ward.created_at).toLocaleString()
    : '';
  const updatedAt = ward.updated_at
    ? new Date(ward.updated_at).toLocaleString()
    : '';
  const name = ward?.name ?? '';
  const wardType = ward?.ward_type ?? '';
  const isActive = ward?.is_active ?? false;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="ward-detail-title"
          >
            {t('ward.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="ward-detail-id">
              {t('ward.detail.idLabel')}: {ward.id}
            </Text>
          </StyledSection>
          {name ? (
            <StyledSection>
              <Text variant="body" testID="ward-detail-name">
                {t('ward.detail.nameLabel')}: {name}
              </Text>
            </StyledSection>
          ) : null}
          {wardType ? (
            <StyledSection>
              <Text variant="body" testID="ward-detail-type">
                {t('ward.detail.typeLabel')}: {wardType}
              </Text>
            </StyledSection>
          ) : null}
          <StyledSection>
            <Text variant="body" testID="ward-detail-active">
              {t('ward.detail.activeLabel')}: {isActive ? t('common.on') : t('common.off')}
            </Text>
          </StyledSection>
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="ward-detail-created">
                {t('ward.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="ward-detail-updated">
                {t('ward.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('ward.detail.backHint')}
              testID="ward-detail-back"
            >
              {t('common.back')}
            </Button>
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('ward.detail.delete')}
              accessibilityHint={t('ward.detail.deleteHint')}
              testID="ward-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default WardDetailScreenIOS;
