/**
 * AddressDetailScreen - Android
 * File: AddressDetailScreen.android.jsx
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
} from './AddressDetailScreen.android.styles';
import useAddressDetailScreen from './useAddressDetailScreen';

const AddressDetailScreenAndroid = () => {
  const { t } = useI18n();
  const {
    address,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onDelete,
  } = useAddressDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="address-detail-loading"
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
              testID="address-detail-offline"
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
              title={t('address.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="address-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!address) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('address.detail.notFoundTitle')}
              description={t('address.detail.notFoundMessage')}
              testID="address-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="address-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = address.created_at
    ? new Date(address.created_at).toLocaleString()
    : '';
  const updatedAt = address.updated_at
    ? new Date(address.updated_at).toLocaleString()
    : '';
  const line1 = address?.line1 ?? '';
  const line2 = address?.line2 ?? '';
  const city = address?.city ?? '';
  const state = address?.state ?? '';
  const postalCode = address?.postal_code ?? '';
  const country = address?.country ?? '';
  const addressType = address?.address_type ?? '';

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="address-detail-title"
          >
            {t('address.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="address-detail-id">
              {t('address.detail.idLabel')}: {address.id}
            </Text>
          </StyledSection>
          {addressType ? (
            <StyledSection>
              <Text variant="body" testID="address-detail-type">
                {t('address.detail.typeLabel')}: {addressType}
              </Text>
            </StyledSection>
          ) : null}
          {line1 ? (
            <StyledSection>
              <Text variant="body" testID="address-detail-line1">
                {t('address.detail.line1Label')}: {line1}
              </Text>
            </StyledSection>
          ) : null}
          {line2 ? (
            <StyledSection>
              <Text variant="body" testID="address-detail-line2">
                {t('address.detail.line2Label')}: {line2}
              </Text>
            </StyledSection>
          ) : null}
          {city ? (
            <StyledSection>
              <Text variant="body" testID="address-detail-city">
                {t('address.detail.cityLabel')}: {city}
              </Text>
            </StyledSection>
          ) : null}
          {state ? (
            <StyledSection>
              <Text variant="body" testID="address-detail-state">
                {t('address.detail.stateLabel')}: {state}
              </Text>
            </StyledSection>
          ) : null}
          {postalCode ? (
            <StyledSection>
              <Text variant="body" testID="address-detail-postalCode">
                {t('address.detail.postalCodeLabel')}: {postalCode}
              </Text>
            </StyledSection>
          ) : null}
          {country ? (
            <StyledSection>
              <Text variant="body" testID="address-detail-country">
                {t('address.detail.countryLabel')}: {country}
              </Text>
            </StyledSection>
          ) : null}
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="address-detail-created">
                {t('address.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="address-detail-updated">
                {t('address.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('address.detail.backHint')}
              testID="address-detail-back"
            >
              {t('common.back')}
            </Button>
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('address.detail.delete')}
              accessibilityHint={t('address.detail.deleteHint')}
              testID="address-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default AddressDetailScreenAndroid;
