/**
 * ContactDetailScreen - Android
 * File: ContactDetailScreen.android.jsx
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
} from './ContactDetailScreen.android.styles';
import useContactDetailScreen from './useContactDetailScreen';

const ContactDetailScreenAndroid = () => {
  const { t } = useI18n();
  const {
    contact,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onDelete,
  } = useContactDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="contact-detail-loading"
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
              testID="contact-detail-offline"
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
              title={t('contact.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="contact-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!contact) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('contact.detail.notFoundTitle')}
              description={t('contact.detail.notFoundMessage')}
              testID="contact-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="contact-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = contact.created_at
    ? new Date(contact.created_at).toLocaleString()
    : '';
  const updatedAt = contact.updated_at
    ? new Date(contact.updated_at).toLocaleString()
    : '';
  const value = contact?.value ?? '';
  const contactType = contact?.contact_type ?? '';
  const isPrimary = contact?.is_primary ?? false;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="contact-detail-title"
          >
            {t('contact.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="contact-detail-id">
              {t('contact.detail.idLabel')}: {contact.id}
            </Text>
          </StyledSection>
          {value ? (
            <StyledSection>
              <Text variant="body" testID="contact-detail-value">
                {t('contact.detail.valueLabel')}: {value}
              </Text>
            </StyledSection>
          ) : null}
          {contactType ? (
            <StyledSection>
              <Text variant="body" testID="contact-detail-type">
                {t('contact.detail.typeLabel')}: {contactType}
              </Text>
            </StyledSection>
          ) : null}
          <StyledSection>
            <Text variant="body" testID="contact-detail-primary">
              {t('contact.detail.primaryLabel')}: {isPrimary ? t('common.on') : t('common.off')}
            </Text>
          </StyledSection>
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="contact-detail-created">
                {t('contact.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {updatedAt ? (
            <StyledSection>
              <Text variant="body" testID="contact-detail-updated">
                {t('contact.detail.updatedLabel')}: {updatedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('contact.detail.backHint')}
              testID="contact-detail-back"
            >
              {t('common.back')}
            </Button>
            <Button
              variant="primary"
              onPress={onDelete}
              accessibilityLabel={t('contact.detail.delete')}
              accessibilityHint={t('contact.detail.deleteHint')}
              testID="contact-detail-delete"
            >
              {t('common.remove')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default ContactDetailScreenAndroid;
