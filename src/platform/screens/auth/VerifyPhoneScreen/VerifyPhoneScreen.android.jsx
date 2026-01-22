/**
 * VerifyPhoneScreen Component - Android
 * Phone verification screen for Android platform
 * File: VerifyPhoneScreen.android.jsx
 */
import React from 'react';
import { AuthFormLayout, Button, ErrorState, OfflineState, Stack, Text, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import { StyledActions, StyledForm, StyledLinkRow } from './VerifyPhoneScreen.android.styles';
import useVerifyPhoneScreen from './useVerifyPhoneScreen';

/**
 * VerifyPhoneScreen component for Android
 */
const VerifyPhoneScreenAndroid = () => {
  const { t } = useI18n();
  const {
    token,
    phone,
    isSubmitted,
    errorMessage,
    isLoading,
    isOffline,
    canSubmit,
    handleSubmit,
    handleChangeToken,
    handleChangePhone,
    handleGoToLogin,
  } = useVerifyPhoneScreen();

  const successSlot = isSubmitted ? (
    <Stack spacing="xs" align="center">
      <Text variant="body" align="center" testID="verify-phone-success-message">
        {t('auth.verifyPhone.success.message')}
      </Text>
    </Stack>
  ) : null;

  const statusSlot = isOffline ? (
    <OfflineState
      title={t('shell.banners.offline.title')}
      description={t('shell.banners.offline.message')}
      accessibilityLabel={t('shell.banners.offline.accessibilityLabel')}
      testID="verify-phone-offline-state"
    />
  ) : errorMessage ? (
    <ErrorState
      title={t('auth.verifyPhone.error.title')}
      description={errorMessage}
      accessibilityLabel={t('auth.verifyPhone.error.title')}
      testID="verify-phone-error-state"
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
        accessibilityLabel={t('auth.verifyPhone.button')}
        accessibilityHint={t('auth.verifyPhone.buttonHint')}
        testID="verify-phone-button"
      >
        {t('auth.verifyPhone.button')}
      </Button>
    </StyledActions>
  );

  const footerSlot = (
    <StyledLinkRow>
      <Button
        variant="text"
        size="small"
        onPress={handleGoToLogin}
        accessibilityLabel={t('auth.verifyPhone.actions.login')}
        accessibilityHint={t('auth.verifyPhone.actions.loginHint')}
        testID="verify-phone-login"
      >
        {t('auth.verifyPhone.actions.login')}
      </Button>
    </StyledLinkRow>
  );

  return (
    <AuthFormLayout
      title={t('auth.verifyPhone.title')}
      description={t('auth.verifyPhone.description')}
      status={statusSlot}
      actions={actionSlot}
      footer={footerSlot}
      accessibilityLabel={t('auth.verifyPhone.title')}
      testID="verify-phone-screen"
      titleTestID="verify-phone-title"
      descriptionTestID="verify-phone-description"
    >
      <StyledForm>
        <Stack spacing="md">
          <TextField
            label={t('auth.verifyPhone.fields.token.label')}
            placeholder={t('auth.verifyPhone.fields.token.placeholder')}
            value={token}
            onChangeText={handleChangeToken}
            accessibilityLabel={t('auth.verifyPhone.fields.token.label')}
            accessibilityHint={t('auth.verifyPhone.fields.token.hint')}
            testID="verify-phone-token"
          />
          <TextField
            label={t('auth.verifyPhone.fields.phone.label')}
            placeholder={t('auth.verifyPhone.fields.phone.placeholder')}
            value={phone}
            onChangeText={handleChangePhone}
            type="tel"
            accessibilityLabel={t('auth.verifyPhone.fields.phone.label')}
            accessibilityHint={t('auth.verifyPhone.fields.phone.hint')}
            testID="verify-phone-number"
          />
        </Stack>
      </StyledForm>
    </AuthFormLayout>
  );
};

export default VerifyPhoneScreenAndroid;

