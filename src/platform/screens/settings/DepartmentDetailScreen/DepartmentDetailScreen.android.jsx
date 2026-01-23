/**
 * DepartmentDetailScreen - Android
 * File: DepartmentDetailScreen.android.jsx
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
} from './DepartmentDetailScreen.android.styles';
import useDepartmentDetailScreen from './useDepartmentDetailScreen';

const DepartmentDetailScreenAndroid = () => {
  const { t } = useI18n();
  const {
    department,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onDelete,
  } = useDepartmentDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="department-detail-loading"
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
              testID="department-detail-offline"
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
              title={t('department.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="department-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!department) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('department.detail.notFoundTitle')}
              description={t('department.detail.notFoundMessage')}
              testID="department-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="department-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = department.created_at
    ? new Date(department.created_at).toLocaleString()
    : '';
  const updatedAt = department.updated_at
    ? new Date(department.updated_at).toLocaleString()
    : '';
  const name = department?.name ?? '';
  const departmentType = department?.department_type ?? '';
  const isActive = department?.is_active ?? false;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="department-detail-title"
          >
            {t('department.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="department-detail-id">
              {t('department.detail.idLabel')}: {department.id}
            </Text>
          </StyledSection>
          {name ? (
            <StyledSection>
              <Text variant="body" testID="department-detail-name">
                {t('department.detail.nameLabel')}: {name}
              </Text>
            </StyledSection>
          ) : null}
          {departmentType ? (
            <StyledSection>
              <Text variant="body" testID="department-detail-type">
                {t('department.detail.typeLabel')}: {departmentType}
              </Text>
            </StyledSection>
          ) : null}
          <StyledSection>
            <Text variant="body" testID="department-detail-active">
              {t('department.detail.activeLabel')}: {isActive ? t('common.on') : t('common.off')}
            </Text>
          </StyledSection>
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="department-detail-created">
                {t('department.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="department-detail-updated">
                {t('department.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('department.detail.backHint')}
              testID="department-detail-back"
            >
              {t('common.back')}
            </Button>
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('department.detail.delete')}
              accessibilityHint={t('department.detail.deleteHint')}
              testID="department-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default DepartmentDetailScreenAndroid;
