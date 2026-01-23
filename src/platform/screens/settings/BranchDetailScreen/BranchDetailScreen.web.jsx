/**
 * BranchDetailScreen - Web
 * File: BranchDetailScreen.web.jsx
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
} from './BranchDetailScreen.web.styles';
import useBranchDetailScreen from './useBranchDetailScreen';

const BranchDetailScreenWeb = () => {
  const { t } = useI18n();
  const {
    branch,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onDelete,
  } = useBranchDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="branch-detail-loading"
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
              testID="branch-detail-offline"
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
              title={t('branch.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="branch-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!branch) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('branch.detail.notFoundTitle')}
              description={t('branch.detail.notFoundMessage')}
              testID="branch-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="branch-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = branch.created_at
    ? new Date(branch.created_at).toLocaleString()
    : '';
  const updatedAt = branch.updated_at
    ? new Date(branch.updated_at).toLocaleString()
    : '';
  const name = branch?.name ?? '';
  const isActive = branch?.is_active ?? false;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="branch-detail-title"
          >
            {t('branch.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="branch-detail-id">
              {t('branch.detail.idLabel')}: {branch.id}
            </Text>
          </StyledSection>
          {name ? (
            <StyledSection>
              <Text variant="body" testID="branch-detail-name">
                {t('branch.detail.nameLabel')}: {name}
              </Text>
            </StyledSection>
          ) : null}
          <StyledSection>
            <Text variant="body" testID="branch-detail-active">
              {t('branch.detail.activeLabel')}: {isActive ? t('common.on') : t('common.off')}
            </Text>
          </StyledSection>
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="branch-detail-created">
                {t('branch.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="branch-detail-updated">
                {t('branch.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('branch.detail.backHint')}
              testID="branch-detail-back"
            >
              {t('common.back')}
            </Button>
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('branch.detail.delete')}
              accessibilityHint={t('branch.detail.deleteHint')}
              testID="branch-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default BranchDetailScreenWeb;
