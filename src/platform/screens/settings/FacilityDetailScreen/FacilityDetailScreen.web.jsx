/**
 * FacilityDetailScreen - Web
 * File: FacilityDetailScreen.web.jsx
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
} from './FacilityDetailScreen.web.styles';
import useFacilityDetailScreen from './useFacilityDetailScreen';

const FacilityDetailScreenWeb = () => {
  const { t } = useI18n();
  const {
    facility,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useFacilityDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="facility-detail-loading"
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
              testID="facility-detail-offline"
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
              title={t('facility.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="facility-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!facility) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('facility.detail.notFoundTitle')}
              description={t('facility.detail.notFoundMessage')}
              testID="facility-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="facility-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = facility.created_at
    ? new Date(facility.created_at).toLocaleString()
    : '';
  const updatedAt = facility.updated_at
    ? new Date(facility.updated_at).toLocaleString()
    : '';
  const name = facility?.name ?? '';
  const facilityType = facility?.facility_type ?? '';
  const isActive = facility?.is_active ?? false;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="facility-detail-title"
          >
            {t('facility.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="facility-detail-id">
              {t('facility.detail.idLabel')}: {facility.id}
            </Text>
          </StyledSection>
          {name ? (
            <StyledSection>
              <Text variant="body" testID="facility-detail-name">
                {t('facility.detail.nameLabel')}: {name}
              </Text>
            </StyledSection>
          ) : null}
          {facilityType ? (
            <StyledSection>
              <Text variant="body" testID="facility-detail-type">
                {t('facility.detail.typeLabel')}: {facilityType}
              </Text>
            </StyledSection>
          ) : null}
          <StyledSection>
            <Text variant="body" testID="facility-detail-active">
              {t('facility.detail.activeLabel')}: {isActive ? t('common.on') : t('common.off')}
            </Text>
          </StyledSection>
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="facility-detail-created">
                {t('facility.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="facility-detail-updated">
                {t('facility.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('facility.detail.backHint')}
              testID="facility-detail-back"
            >
              {t('common.back')}
            </Button>
            {onEdit && (
              <Button
                variant="secondary"
                onPress={onEdit}
                accessibilityLabel={t('facility.detail.edit')}
                accessibilityHint={t('facility.detail.editHint')}
                testID="facility-detail-edit"
              >
                {t('facility.detail.edit')}
              </Button>
            )}
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('facility.detail.delete')}
              accessibilityHint={t('facility.detail.deleteHint')}
              testID="facility-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default FacilityDetailScreenWeb;
