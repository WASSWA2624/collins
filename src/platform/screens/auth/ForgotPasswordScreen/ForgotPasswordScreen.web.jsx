/**
 * ForgotPasswordScreen Component - Web
 * Password recovery screen for Web platform
 * File: ForgotPasswordScreen.web.jsx
 */
import React from 'react';
import { AuthFormLayout, Button, ErrorState, OfflineState, Stack, Text, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import { StyledActions, StyledForm, StyledLinkRow } from './ForgotPasswordScreen.web.styles';
import useForgotPasswordScreen from './useForgotPasswordScreen';

/**
 * ForgotPasswordScreen component for Web
 */
const ForgotPasswordScreenWeb = () => {
  const { t } = useI18n();
  const {
    email,
    tenantId,
    isSubmitted,
    errorMessage,
    isLoading,
    isOffline,
    canSubmit,
    handleSubmit,
    handleChangeEmail,
    handleChangeTenantId,
    handleGoToLogin,
  } = useForgotPasswordScreen();

  const successSlot = isSubmitted ? (
    <Stack spacing="xs" align="center">
      <Text variant="body" align="center" testID="forgot-success-message">
        {t('auth.forgotPassword.success.message')}
      </Text>
    </Stack>
  ) : null;

  const statusSlot = isOffline ? (
    <OfflineState
      title={t('shell.banners.offline.title')}
      description={t('shell.banners.offline.message')}
      accessibilityLabel={t('shell.banners.offline.accessibilityLabel')}
      testID="forgot-offline-state"
    />
  ) : errorMessage ? (
    <ErrorState
      title={t('auth.forgotPassword.error.title')}
      description={errorMessage}
      accessibilityLabel={t('auth.forgotPassword.error.title')}
      testID="forgot-error-state"
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
        accessibilityLabel={t('auth.forgotPassword.button')}
        accessibilityHint={t('auth.forgotPassword.buttonHint')}
        testID="forgot-button"
      >
        {t('auth.forgotPassword.button')}
      </Button>
    </StyledActions>
  );

  const footerSlot = (
    <StyledLinkRow>
      <Button
        variant="text"
        size="small"
        onPress={handleGoToLogin}
        accessibilityLabel={t('auth.forgotPassword.actions.login')}
        accessibilityHint={t('auth.forgotPassword.actions.loginHint')}
        testID="forgot-login"
      >
        {t('auth.forgotPassword.actions.login')}
      </Button>
    </StyledLinkRow>
  );

  return (
    <AuthFormLayout
      title={t('auth.forgotPassword.title')}
      description={t('auth.forgotPassword.description')}
      status={statusSlot}
      actions={actionSlot}
      footer={footerSlot}
      accessibilityLabel={t('auth.forgotPassword.title')}
      testID="forgot-password-screen"
      titleTestID="forgot-title"
      descriptionTestID="forgot-description"
    >
      <StyledForm>
        <Stack spacing="md">
          <TextField
            label={t('auth.forgotPassword.fields.email.label')}
            placeholder={t('auth.forgotPassword.fields.email.placeholder')}
            value={email}
            onChangeText={handleChangeEmail}
            type="email"
            autoCapitalize="none"
            accessibilityLabel={t('auth.forgotPassword.fields.email.label')}
            accessibilityHint={t('auth.forgotPassword.fields.email.hint')}
            testID="forgot-email"
          />
          <TextField
            label={t('auth.forgotPassword.fields.tenant.label')}
            placeholder={t('auth.forgotPassword.fields.tenant.placeholder')}
            value={tenantId}
            onChangeText={handleChangeTenantId}
            accessibilityLabel={t('auth.forgotPassword.fields.tenant.label')}
            accessibilityHint={t('auth.forgotPassword.fields.tenant.hint')}
            testID="forgot-tenant-id"
          />
        </Stack>
      </StyledForm>
    </AuthFormLayout>
  );
};

export default ForgotPasswordScreenWeb;

