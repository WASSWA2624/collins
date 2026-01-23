/**
 * UserSessionDetailScreen - iOS
 * File: UserSessionDetailScreen.ios.jsx
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
} from './UserSessionDetailScreen.ios.styles';
import useUserSessionDetailScreen from './useUserSessionDetailScreen';

const UserSessionDetailScreenIOS = () => {
  const { t } = useI18n();
  const {
    session,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onRevoke,
  } = useUserSessionDetailScreen();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner
              accessibilityLabel={t('common.loading')}
              testID="user-session-detail-loading"
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
              testID="user-session-detail-offline"
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
              title={t('userSession.detail.errorTitle')}
              description={errorMessage}
              action={
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')}>
                  {t('common.retry')}
                </Button>
              }
              testID="user-session-detail-error"
            />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (!session) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <EmptyState
              title={t('userSession.detail.notFoundTitle')}
              description={t('userSession.detail.notFoundMessage')}
              testID="user-session-detail-not-found"
            />
            <StyledActions>
              <Button
                variant="primary"
                onPress={onBack}
                accessibilityLabel={t('common.back')}
                testID="user-session-detail-back"
              >
                {t('common.back')}
              </Button>
            </StyledActions>
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  const createdAt = session.created_at
    ? new Date(session.created_at).toLocaleString()
    : '';
  const expiresAt = session.expires_at
    ? new Date(session.expires_at).toLocaleString()
    : '';
  const revokedAt = session.revoked_at
    ? new Date(session.revoked_at).toLocaleString()
    : null;
  const email = session?.user?.email ?? '';

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="user-session-detail-title"
          >
            {t('userSession.detail.title')}
          </Text>
          <StyledSection>
            <Text variant="body" testID="user-session-detail-id">
              {t('userSession.detail.idLabel')}: {session.id}
            </Text>
          </StyledSection>
          {email ? (
            <StyledSection>
              <Text variant="body" testID="user-session-detail-email">
                {t('userSession.detail.emailLabel')}: {email}
              </Text>
            </StyledSection>
          ) : null}
          {createdAt ? (
            <StyledSection>
              <Text variant="body" testID="user-session-detail-created">
                {t('userSession.detail.createdLabel')}: {createdAt}
              </Text>
            </StyledSection>
          ) : null}
          {expiresAt ? (
            <StyledSection>
              <Text variant="body" testID="user-session-detail-expires">
                {t('userSession.detail.expiresLabel')}: {expiresAt}
              </Text>
            </StyledSection>
          ) : null}
          {revokedAt ? (
            <StyledSection>
              <Text variant="body" testID="user-session-detail-revoked">
                {t('userSession.detail.revokedLabel')}: {revokedAt}
              </Text>
            </StyledSection>
          ) : null}
          <StyledActions>
            <Button
              variant="ghost"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('userSession.detail.backHint')}
              testID="user-session-detail-back"
            >
              {t('common.back')}
            </Button>
            {!session.revoked_at ? (
              <Button
                variant="primary"
                onPress={onRevoke}
                accessibilityLabel={t('userSession.detail.revoke')}
                accessibilityHint={t('userSession.detail.revokeHint')}
                testID="user-session-detail-revoke"
              >
                {t('common.remove')}
              </Button>
            ) : null}
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default UserSessionDetailScreenIOS;
