/**
 * LoginScreen Component - iOS
 * Authentication login screen for iOS platform
 * File: LoginScreen.ios.jsx
 */
import React from 'react';
import { AuthFormLayout, Button, ErrorState, OfflineState, PasswordField, Stack, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import { StyledActions, StyledForm, StyledLinkRow } from './LoginScreen.ios.styles';
import useLoginScreen from './useLoginScreen';

/**
 * LoginScreen component for iOS
 */
const LoginScreenIOS = () => {
  const { t } = useI18n();
  const {
    identifier,
    password,
    tenantId,
    facilityId,
    errorMessage,
    isLoading,
    isOffline,
    canSubmit,
    isBiometricAvailable,
    isBiometricChecking,
    handleSubmit,
    handleChangeIdentifier,
    handleChangePassword,
    handleChangeTenantId,
    handleChangeFacilityId,
    handleGoToRegister,
    handleGoToForgotPassword,
    handleBiometricLogin,
    canAccessRegister,
  } = useLoginScreen();

  const statusSlot = isOffline ? (
    <OfflineState
      title={t('shell.banners.offline.title')}
      description={t('shell.banners.offline.message')}
      accessibilityLabel={t('shell.banners.offline.accessibilityLabel')}
      testID="login-offline-state"
    />
  ) : errorMessage ? (
    <ErrorState
      title={t('auth.login.error.title')}
      description={errorMessage}
      accessibilityLabel={t('auth.login.error.title')}
      testID="login-error-state"
    />
  ) : null;

  const actionSlot = (
    <StyledActions>
      <Stack spacing="sm">
        <Button
          variant="primary"
          size="large"
          loading={isLoading}
          disabled={!canSubmit}
          onPress={handleSubmit}
          accessibilityLabel={t('auth.login.button')}
          accessibilityHint={t('auth.login.buttonHint')}
          testID="login-button"
        >
          {t('auth.login.button')}
        </Button>
        {isBiometricAvailable ? (
          <Button
            variant="ghost"
            size="large"
            loading={isBiometricChecking}
            disabled={isBiometricChecking || isOffline}
            onPress={handleBiometricLogin}
            accessibilityLabel={t('auth.login.biometric.button')}
            accessibilityHint={t('auth.login.biometric.buttonHint')}
            testID="login-biometric"
          >
            {t('auth.login.biometric.button')}
          </Button>
        ) : null}
      </Stack>
    </StyledActions>
  );

  const footerSlot = (
    <Stack spacing="xs" align="center">
      <StyledLinkRow>
        <Button
          variant="text"
          size="small"
          onPress={handleGoToForgotPassword}
          accessibilityLabel={t('auth.login.actions.forgotPassword')}
          accessibilityHint={t('auth.login.actions.forgotPasswordHint')}
          testID="login-forgot-password"
        >
          {t('auth.login.actions.forgotPassword')}
        </Button>
      </StyledLinkRow>
      <StyledLinkRow>
        {canAccessRegister ? (
          <Button
            variant="text"
            size="small"
            onPress={handleGoToRegister}
            accessibilityLabel={t('auth.login.actions.register')}
            accessibilityHint={t('auth.login.actions.registerHint')}
            testID="login-register"
          >
            {t('auth.login.actions.register')}
          </Button>
        ) : null}
      </StyledLinkRow>
    </Stack>
  );

  return (
    <AuthFormLayout
      title={t('auth.login.title')}
      description={t('auth.login.description')}
      status={statusSlot}
      actions={actionSlot}
      footer={footerSlot}
      accessibilityLabel={t('auth.login.title')}
      testID="login-screen"
      titleTestID="login-title"
      descriptionTestID="login-description"
    >
      <StyledForm>
        <Stack spacing="md">
          <TextField
            label={t('auth.login.fields.email.label')}
            placeholder={t('auth.login.fields.email.placeholder')}
            value={identifier}
            onChangeText={handleChangeIdentifier}
            type="text"
            autoCapitalize="none"
            accessibilityLabel={t('auth.login.fields.email.label')}
            accessibilityHint={t('auth.login.fields.email.hint')}
            testID="login-identifier"
          />
          <PasswordField
            label={t('auth.login.fields.password.label')}
            placeholder={t('auth.login.fields.password.placeholder')}
            value={password}
            onChangeText={handleChangePassword}
            accessibilityLabel={t('auth.login.fields.password.label')}
            accessibilityHint={t('auth.login.fields.password.hint')}
            testID="login-password"
          />
          <TextField
            label={t('auth.login.fields.tenant.label')}
            placeholder={t('auth.login.fields.tenant.placeholder')}
            value={tenantId}
            onChangeText={handleChangeTenantId}
            accessibilityLabel={t('auth.login.fields.tenant.label')}
            accessibilityHint={t('auth.login.fields.tenant.hint')}
            testID="login-tenant-id"
          />
          <TextField
            label={t('auth.login.fields.facility.label')}
            placeholder={t('auth.login.fields.facility.placeholder')}
            value={facilityId}
            onChangeText={handleChangeFacilityId}
            accessibilityLabel={t('auth.login.fields.facility.label')}
            accessibilityHint={t('auth.login.fields.facility.hint')}
            testID="login-facility-id"
          />
        </Stack>
      </StyledForm>
    </AuthFormLayout>
  );
};

export default LoginScreenIOS;
