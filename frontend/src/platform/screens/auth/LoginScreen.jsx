/**
 * LoginScreen
 * Minimal auth UI for password sign-in.
 * File: LoginScreen.jsx
 */
import React, { useCallback, useMemo, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import {
  AuthBrand,
  AuthFormLayout,
  Button,
  PasswordField,
  Stack,
  SystemBanner,
  Text,
  TextField,
} from '@platform/components';
import { useAuth, useI18n } from '@hooks';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getErrorMessage = (t, code) => {
  if (!code) return null;
  return t(`errors.codes.${code}`);
};

const LoginScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    clearError,
    errorCode,
    hasRestoredSession,
    isAuthenticated,
    isLoading,
    login,
    requiresActiveFacility,
    restoreSession,
    sessionErrorCode,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const trimmedEmail = email.trim();
  const canSubmit = trimmedEmail.length > 0 && password.length > 0 && !isLoading;
  const sessionMessage = getErrorMessage(t, sessionErrorCode);
  const authMessage = getErrorMessage(t, errorCode);

  const emailError = useMemo(() => {
    if (!localError || localError !== 'INVALID_EMAIL') return null;
    return t('forms.validation.invalidEmail');
  }, [localError, t]);

  const passwordError = useMemo(() => {
    if (!localError || localError !== 'PASSWORD_REQUIRED') return null;
    return t('forms.validation.required');
  }, [localError, t]);

  const handleEmailChange = useCallback((value) => {
    setEmail(value);
    setLocalError(null);
    clearError();
  }, [clearError]);

  const handlePasswordChange = useCallback((value) => {
    setPassword(value);
    setLocalError(null);
    clearError();
  }, [clearError]);

  const handleSubmit = useCallback(async () => {
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setLocalError('INVALID_EMAIL');
      return;
    }
    if (!password) {
      setLocalError('PASSWORD_REQUIRED');
      return;
    }

    await login({ email: trimmedEmail, password });
  }, [login, password, trimmedEmail]);

  const handleRetryRestore = useCallback(() => {
    clearError();
    void restoreSession();
  }, [clearError, restoreSession]);

  const handleCreateAccount = useCallback(() => {
    router.push('/register');
  }, [router]);

  if (!hasRestoredSession) return null;
  if (isAuthenticated && requiresActiveFacility) return <Redirect href="/select-facility" />;
  if (isAuthenticated) return <Redirect href="/" />;

  const status = sessionMessage || authMessage ? (
    <Stack spacing="sm">
      {sessionMessage ? (
        <SystemBanner
          variant="info"
          title={t('auth.session.noticeTitle')}
          message={sessionMessage}
          actionLabel={sessionErrorCode === 'NETWORK_ERROR' ? t('auth.session.retry') : undefined}
          onAction={sessionErrorCode === 'NETWORK_ERROR' ? handleRetryRestore : undefined}
          testID="login-session-banner"
        />
      ) : null}
      {authMessage ? (
        <SystemBanner
          variant="info"
          title={t('auth.login.errorTitle')}
          message={authMessage}
          testID="login-error-banner"
        />
      ) : null}
    </Stack>
  ) : null;

  return (
    <AuthFormLayout
      actions={
        <Button
          text={t('auth.login.submit')}
          onPress={handleSubmit}
          onClick={handleSubmit}
          disabled={!canSubmit}
          loading={isLoading}
          accessibilityLabel={t('auth.login.submit')}
          testID="login-submit"
        />
      }
      footer={(
        <Stack spacing="xs" align="center">
          <Text variant="caption" align="center">
            {t('auth.login.createPrompt')}
          </Text>
          <Button
            variant="text"
            text={t('auth.login.createAccount')}
            onPress={handleCreateAccount}
            onClick={handleCreateAccount}
            accessibilityLabel={t('auth.login.createAccount')}
            accessibilityHint={t('auth.login.createAccountHint')}
            testID="login-create-account"
          />
        </Stack>
      )}
      testID="login-screen"
      accessibilityLabel={t('auth.login.accessibilityLabel')}
    >
      <Stack spacing="md">
        <AuthBrand
          name={t('auth.brand.name')}
          logoLabel={t('auth.brand.logoLabel')}
          layout="horizontal"
          testID="login-brand"
        />
        <Text variant="h2" align="center" accessibilityLabel={t('auth.login.title')} testID="login-title">
          {t('auth.login.title')}
        </Text>
        {status}
        <TextField
          label={t('auth.login.emailLabel')}
          placeholder={t('auth.login.emailPlaceholder')}
          value={email}
          onChangeText={handleEmailChange}
          type="email"
          autoCapitalize="none"
          autoCorrect={false}
          required
          disabled={isLoading}
          errorMessage={emailError}
          testID="login-email"
        />
        <PasswordField
          label={t('auth.login.passwordLabel')}
          placeholder={t('auth.login.passwordPlaceholder')}
          value={password}
          onChangeText={handlePasswordChange}
          autoComplete="current-password"
          required
          disabled={isLoading}
          errorMessage={passwordError}
          showStrengthIndicator={false}
          testID="login-password"
        />
      </Stack>
    </AuthFormLayout>
  );
};

export default LoginScreen;
