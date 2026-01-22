/**
 * VerifyEmailScreen Component - Android
 * Email verification screen for Android platform
 * File: VerifyEmailScreen.android.jsx
 */
import React from 'react';
import { AuthFormLayout, Button, ErrorState, OfflineState, Stack, Text, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import { StyledActions, StyledForm, StyledLinkRow } from './VerifyEmailScreen.android.styles';
import useVerifyEmailScreen from './useVerifyEmailScreen';

/**
 * VerifyEmailScreen component for Android
 */
const VerifyEmailScreenAndroid = () => {
  const { t } = useI18n();
  const {
    token,
    email,
    isSubmitted,
    errorMessage,
    isLoading,
    isOffline,
    canSubmit,
    handleSubmit,
    handleChangeToken,
    handleChangeEmail,
    handleGoToLogin,
  } = useVerifyEmailScreen();

  const successSlot = isSubmitted ? (
    <Stack spacing="xs" align="center">
      <Text variant="body" align="center" testID="verify-email-success-message">
        {t('auth.verifyEmail.success.message')}
      </Text>
    </Stack>
  ) : null;

  const statusSlot = isOffline ? (
    <OfflineState
      title={t('shell.banners.offline.title')}
      description={t('shell.banners.offline.message')}
      accessibilityLabel={t('shell.banners.offline.accessibilityLabel')}
      testID="verify-email-offline-state"
    />
  ) : errorMessage ? (
    <ErrorState
      title={t('auth.verifyEmail.error.title')}
      description={errorMessage}
      accessibilityLabel={t('auth.verifyEmail.error.title')}
      testID="verify-email-error-state"
    />
  ) : successSlot;

  const actionSlot = (
    <StyledActions>
      <Button
        variant="primary"
        size="large"
        loading={isLoading}
        disabled={!canSubmit}
        onPress={handleSubmit}
        accessibilityLabel={t('auth.verifyEmail.button')}
        accessibilityHint={t('auth.verifyEmail.buttonHint')}
        testID="verify-email-button"
      >
        {t('auth.verifyEmail.button')}
      </Button>
    </StyledActions>
  );

  const footerSlot = (
    <StyledLinkRow>
      <Button
        variant="text"
        size="small"
        onPress={handleGoToLogin}
        accessibilityLabel={t('auth.verifyEmail.actions.login')}
        accessibilityHint={t('auth.verifyEmail.actions.loginHint')}
        testID="verify-email-login"
      >
        {t('auth.verifyEmail.actions.login')}
      </Button>
    </StyledLinkRow>
  );

  return (
    <AuthFormLayout
      title={t('auth.verifyEmail.title')}
      description={t('auth.verifyEmail.description')}
      status={statusSlot}
      actions={actionSlot}
      footer={footerSlot}
      accessibilityLabel={t('auth.verifyEmail.title')}
      testID="verify-email-screen"
      titleTestID="verify-email-title"
      descriptionTestID="verify-email-description"
    >
      <StyledForm>
        <Stack spacing="md">
          <TextField
            label={t('auth.verifyEmail.fields.token.label')}
            placeholder={t('auth.verifyEmail.fields.token.placeholder')}
            value={token}
            onChangeText={handleChangeToken}
            accessibilityLabel={t('auth.verifyEmail.fields.token.label')}
            accessibilityHint={t('auth.verifyEmail.fields.token.hint')}
            testID="verify-email-token"
          />
          <TextField
            label={t('auth.verifyEmail.fields.email.label')}
            placeholder={t('auth.verifyEmail.fields.email.placeholder')}
            value={email}
            onChangeText={handleChangeEmail}
            type="email"
            autoCapitalize="none"
            accessibilityLabel={t('auth.verifyEmail.fields.email.label')}
            accessibilityHint={t('auth.verifyEmail.fields.email.hint')}
            testID="verify-email-address"
          />
        </Stack>
      </StyledForm>
    </AuthFormLayout>
  );
};

export default VerifyEmailScreenAndroid;

