/**
 * RegisterScreen Component - Web
 * Authentication register screen for Web platform
 * File: RegisterScreen.web.jsx
 */
import React from 'react';
import { AuthFormLayout, Button, ErrorState, OfflineState, PasswordField, Stack, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import { StyledActions, StyledForm, StyledLinkRow } from './RegisterScreen.web.styles';
import useRegisterScreen from './useRegisterScreen';
import { STEPS } from './types';

/**
 * RegisterScreen component for Web
 */
const RegisterScreenWeb = () => {
  const { t } = useI18n();
  const {
    email,
    password,
    tenantId,
    facilityId,
    phone,
    tenantIdError,
    facilityIdError,
    accessErrorMessage,
    errorMessage,
    isLoading,
    isOffline,
    canProceed,
    canSubmit,
    step,
    handleContinue,
    handleSubmit,
    handleChangeEmail,
    handleChangePassword,
    handleChangeTenantId,
    handleChangeFacilityId,
    handleChangePhone,
    handleGoToLogin,
    handleBack,
  } = useRegisterScreen();

  const statusSlot = accessErrorMessage ? (
    <ErrorState
      title={t('errors.codes.FORBIDDEN')}
      description={accessErrorMessage}
      accessibilityLabel={t('errors.codes.FORBIDDEN')}
      testID="register-access-denied"
    />
  ) : isOffline ? (
    <OfflineState
      title={t('shell.banners.offline.title')}
      description={t('shell.banners.offline.message')}
      accessibilityLabel={t('shell.banners.offline.accessibilityLabel')}
      testID="register-offline-state"
    />
  ) : errorMessage ? (
    <ErrorState
      title={t('auth.register.error.title')}
      description={errorMessage}
      accessibilityLabel={t('auth.register.error.title')}
      testID="register-error-state"
    />
  ) : null;

  const actionSlot = accessErrorMessage ? null : (
    <StyledActions>
      {step === STEPS.ORGANIZATION ? (
        <Button
          variant="primary"
          size="large"
          loading={isLoading}
          disabled={!canProceed}
          onPress={handleContinue}
          accessibilityLabel={t('common.next')}
          accessibilityHint={t('common.next')}
          testID="register-next"
        >
          {t('common.next')}
        </Button>
      ) : (
        <Stack spacing="sm">
          <Button
            variant="primary"
            size="large"
            loading={isLoading}
            disabled={!canSubmit}
            onPress={handleSubmit}
            accessibilityLabel={t('auth.register.button')}
            accessibilityHint={t('auth.register.buttonHint')}
            testID="register-button"
          >
            {t('auth.register.button')}
          </Button>
          <Button
            variant="ghost"
            size="large"
            disabled={isLoading}
            onPress={handleBack}
            accessibilityLabel={t('common.back')}
            accessibilityHint={t('common.back')}
            testID="register-back"
          >
            {t('common.back')}
          </Button>
        </Stack>
      )}
    </StyledActions>
  );

  const footerSlot = (
    <StyledLinkRow>
      <Button
        variant="text"
        size="small"
        onPress={handleGoToLogin}
        accessibilityLabel={t('auth.register.actions.login')}
        accessibilityHint={t('auth.register.actions.loginHint')}
        testID="register-login"
      >
        {t('auth.register.actions.login')}
      </Button>
    </StyledLinkRow>
  );

  return (
    <AuthFormLayout
      title={step === STEPS.ORGANIZATION ? t('auth.register.steps.organization.title') : t('auth.register.steps.details.title')}
      description={step === STEPS.ORGANIZATION ? t('auth.register.steps.organization.description') : t('auth.register.steps.details.description')}
      status={statusSlot}
      actions={actionSlot}
      footer={footerSlot}
      accessibilityLabel={step === STEPS.ORGANIZATION ? t('auth.register.steps.organization.title') : t('auth.register.steps.details.title')}
      testID="register-screen"
      titleTestID="register-title"
      descriptionTestID="register-description"
    >
      {accessErrorMessage ? null : (
        <StyledForm>
          <Stack spacing="md">
            {step === STEPS.ORGANIZATION ? (
              <>
                <TextField
                  label={t('auth.register.fields.tenant.label')}
                  placeholder={t('auth.register.fields.tenant.placeholder')}
                  value={tenantId}
                  onChangeText={handleChangeTenantId}
                  required
                  validationState={tenantIdError ? 'error' : undefined}
                  errorMessage={tenantIdError || undefined}
                  accessibilityLabel={t('auth.register.fields.tenant.label')}
                  accessibilityHint={t('auth.register.fields.tenant.hint')}
                  testID="register-tenant-id"
                />
                <TextField
                  label={t('auth.register.fields.facility.label')}
                  placeholder={t('auth.register.fields.facility.placeholder')}
                  value={facilityId}
                  onChangeText={handleChangeFacilityId}
                  validationState={facilityIdError ? 'error' : undefined}
                  errorMessage={facilityIdError || undefined}
                  accessibilityLabel={t('auth.register.fields.facility.label')}
                  accessibilityHint={t('auth.register.fields.facility.hint')}
                  testID="register-facility-id"
                />
              </>
            ) : (
              <>
                <TextField
                  label={t('auth.register.fields.email.label')}
                  placeholder={t('auth.register.fields.email.placeholder')}
                  value={email}
                  onChangeText={handleChangeEmail}
                  type="email"
                  autoCapitalize="none"
                  accessibilityLabel={t('auth.register.fields.email.label')}
                  accessibilityHint={t('auth.register.fields.email.hint')}
                  testID="register-email"
                />
                <PasswordField
                  label={t('auth.register.fields.password.label')}
                  placeholder={t('auth.register.fields.password.placeholder')}
                  value={password}
                  onChangeText={handleChangePassword}
                  accessibilityLabel={t('auth.register.fields.password.label')}
                  accessibilityHint={t('auth.register.fields.password.hint')}
                  testID="register-password"
                />
                <TextField
                  label={t('auth.register.fields.phone.label')}
                  placeholder={t('auth.register.fields.phone.placeholder')}
                  value={phone}
                  onChangeText={handleChangePhone}
                  type="tel"
                  accessibilityLabel={t('auth.register.fields.phone.label')}
                  accessibilityHint={t('auth.register.fields.phone.hint')}
                  testID="register-phone"
                />
              </>
            )}
          </Stack>
        </StyledForm>
      )}
    </AuthFormLayout>
  );
};

export default RegisterScreenWeb;

