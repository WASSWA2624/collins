/**
 * ResetPasswordScreen Component - iOS
 * Password reset screen for iOS platform
 * File: ResetPasswordScreen.ios.jsx
 */
import React from 'react';
import { AuthFormLayout, Button, ErrorState, OfflineState, PasswordField, Stack, Text, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import { StyledActions, StyledForm, StyledLinkRow } from './ResetPasswordScreen.ios.styles';
import useResetPasswordScreen from './useResetPasswordScreen';

/**
 * ResetPasswordScreen component for iOS
 */
const ResetPasswordScreenIOS = () => {
  const { t } = useI18n();
  const {
    token,
    password,
    confirmPassword,
    isSubmitted,
    errorMessage,
    isLoading,
    isOffline,
    passwordMismatch,
    canSubmit,
    handleSubmit,
    handleChangeToken,
    handleChangePassword,
    handleChangeConfirmPassword,
    handleGoToLogin,
  } = useResetPasswordScreen();

  const successSlot = isSubmitted ? (
    <Stack spacing="xs" align="center">
      <Text variant="body" align="center" testID="reset-success-message">
        {t('auth.resetPassword.success.message')}
      </Text>
    </Stack>
  ) : null;

  const statusSlot = isOffline ? (
    <OfflineState
      title={t('shell.banners.offline.title')}
      description={t('shell.banners.offline.message')}
      accessibilityLabel={t('shell.banners.offline.accessibilityLabel')}
      testID="reset-offline-state"
    />
  ) : errorMessage ? (
    <ErrorState
      title={t('auth.resetPassword.error.title')}
      description={errorMessage}
      accessibilityLabel={t('auth.resetPassword.error.title')}
      testID="reset-error-state"
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
        accessibilityLabel={t('auth.resetPassword.button')}
        accessibilityHint={t('auth.resetPassword.buttonHint')}
        testID="reset-button"
      >
        {t('auth.resetPassword.button')}
      </Button>
    </StyledActions>
  );

  const footerSlot = (
    <StyledLinkRow>
      <Button
        variant="text"
        size="small"
        onPress={handleGoToLogin}
        accessibilityLabel={t('auth.resetPassword.actions.login')}
        accessibilityHint={t('auth.resetPassword.actions.loginHint')}
        testID="reset-login"
      >
        {t('auth.resetPassword.actions.login')}
      </Button>
    </StyledLinkRow>
  );

  return (
    <AuthFormLayout
      title={t('auth.resetPassword.title')}
      description={t('auth.resetPassword.description')}
      status={statusSlot}
      actions={actionSlot}
      footer={footerSlot}
      accessibilityLabel={t('auth.resetPassword.title')}
      testID="reset-password-screen"
      titleTestID="reset-title"
      descriptionTestID="reset-description"
    >
      <StyledForm>
        <Stack spacing="md">
          <TextField
            label={t('auth.resetPassword.fields.token.label')}
            placeholder={t('auth.resetPassword.fields.token.placeholder')}
            value={token}
            onChangeText={handleChangeToken}
            accessibilityLabel={t('auth.resetPassword.fields.token.label')}
            accessibilityHint={t('auth.resetPassword.fields.token.hint')}
            testID="reset-token"
          />
          <PasswordField
            label={t('auth.resetPassword.fields.password.label')}
            placeholder={t('auth.resetPassword.fields.password.placeholder')}
            value={password}
            onChangeText={handleChangePassword}
            accessibilityLabel={t('auth.resetPassword.fields.password.label')}
            accessibilityHint={t('auth.resetPassword.fields.password.hint')}
            testID="reset-password"
          />
          <PasswordField
            label={t('auth.resetPassword.fields.confirm.label')}
            placeholder={t('auth.resetPassword.fields.confirm.placeholder')}
            value={confirmPassword}
            onChangeText={handleChangeConfirmPassword}
            validationState={passwordMismatch ? 'error' : undefined}
            errorMessage={passwordMismatch ? t('auth.resetPassword.fields.confirm.errorMismatch') : undefined}
            accessibilityLabel={t('auth.resetPassword.fields.confirm.label')}
            accessibilityHint={t('auth.resetPassword.fields.confirm.hint')}
            testID="reset-confirm-password"
          />
        </Stack>
      </StyledForm>
    </AuthFormLayout>
  );
};

export default ResetPasswordScreenIOS;

