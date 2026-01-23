/**
 * BedDetailScreen - Android
 * File: BedDetailScreen.android.jsx
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
} from './BedDetailScreen.android.styles';
import useBedDetailScreen from './useBedDetailScreen';

const BedDetailScreenAndroid = () => {
  const { t } = useI18n();
  const {
    bed,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onDelete,
  } = useBedDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="bed-detail-loading"
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
              testID="bed-detail-offline"
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
              title={t('bed.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="bed-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!bed) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('bed.detail.notFoundTitle')}
              description={t('bed.detail.notFoundMessage')}
              testID="bed-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="bed-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = bed.created_at
    ? new Date(bed.created_at).toLocaleString()
    : '';
  const updatedAt = bed.updated_at
    ? new Date(bed.updated_at).toLocaleString()
    : '';
  const label = bed?.label ?? '';
  const status = bed?.status ?? '';

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="bed-detail-title"
          >
            {t('bed.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="bed-detail-id">
              {t('bed.detail.idLabel')}: {bed.id}
            </Text>
          </StyledSection>
          {label ? (
            <StyledSection>
              <Text variant="body" testID="bed-detail-label">
                {t('bed.detail.labelLabel')}: {label}
              </Text>
            </StyledSection>
          ) : null}
          {status ? (
            <StyledSection>
              <Text variant="body" testID="bed-detail-status">
                {t('bed.detail.statusLabel')}: {status}
              </Text>
            </StyledSection>
          ) : null}
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="bed-detail-created">
                {t('bed.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="bed-detail-updated">
                {t('bed.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('bed.detail.backHint')}
              testID="bed-detail-back"
            >
              {t('common.back')}
            </Button>
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('bed.detail.delete')}
              accessibilityHint={t('bed.detail.deleteHint')}
              testID="bed-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default BedDetailScreenAndroid;
