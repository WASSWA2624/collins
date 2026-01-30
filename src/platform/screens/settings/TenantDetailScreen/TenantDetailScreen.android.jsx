/**
 * TenantDetailScreen - Android
 * File: TenantDetailScreen.android.jsx
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
} from './TenantDetailScreen.android.styles';
import useTenantDetailScreen from './useTenantDetailScreen';

const TenantDetailScreenAndroid = () => {
  const { t } = useI18n();
  const {
    tenant,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useTenantDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="tenant-detail-loading"
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
              testID="tenant-detail-offline"
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
              title={t('tenant.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="tenant-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!tenant) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('tenant.detail.notFoundTitle')}
              description={t('tenant.detail.notFoundMessage')}
              testID="tenant-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="tenant-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = tenant.created_at
    ? new Date(tenant.created_at).toLocaleString()
    : '';
  const updatedAt = tenant.updated_at
    ? new Date(tenant.updated_at).toLocaleString()
    : '';
  const name = tenant?.name ?? '';
  const slug = tenant?.slug ?? '';
  const isActive = tenant?.is_active ?? false;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="tenant-detail-title"
          >
            {t('tenant.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="tenant-detail-id">
              {t('tenant.detail.idLabel')}: {tenant.id}
            </Text>
          </StyledSection>
          {name ? (
            <StyledSection>
              <Text variant="body" testID="tenant-detail-name">
                {t('tenant.detail.nameLabel')}: {name}
              </Text>
            </StyledSection>
          ) : null}
          {slug ? (
            <StyledSection>
              <Text variant="body" testID="tenant-detail-slug">
                {t('tenant.detail.slugLabel')}: {slug}
              </Text>
            </StyledSection>
          ) : null}
          <StyledSection>
            <Text variant="body" testID="tenant-detail-active">
              {t('tenant.detail.activeLabel')}: {isActive ? t('common.on') : t('common.off')}
            </Text>
          </StyledSection>
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="tenant-detail-created">
                {t('tenant.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="tenant-detail-updated">
                {t('tenant.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('tenant.detail.backHint')}
              testID="tenant-detail-back"
            >
              {t('common.back')}
            </Button>
            {onEdit && (
              <Button
                variant="secondary"
                onPress={onEdit}
                accessibilityLabel={t('tenant.detail.edit')}
                accessibilityHint={t('tenant.detail.editHint')}
                testID="tenant-detail-edit"
              >
                {t('tenant.detail.edit')}
              </Button>
            )}
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('tenant.detail.delete')}
              accessibilityHint={t('tenant.detail.deleteHint')}
              testID="tenant-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default TenantDetailScreenAndroid;
