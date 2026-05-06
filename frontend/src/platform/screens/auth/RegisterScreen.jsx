/**
 * RegisterScreen
 * Minimal account creation UI backed by the existing auth registration flow.
 * File: RegisterScreen.jsx
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
const MIN_PASSWORD_LENGTH = 8;

const getErrorMessage = (t, code) => {
  if (!code) return null;
  return t(`errors.codes.${code}`);
};

const RegisterScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    clearError,
    errorCode,
    hasRestoredSession,
    isAuthenticated,
    isLoading,
    register,
    requiresActiveFacility,
  } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const canSubmit =
    trimmedName.length > 0 && trimmedEmail.length > 0 && password.length > 0 && !isLoading;
  const authMessage = getErrorMessage(t, errorCode);

  const nameError = useMemo(() => {
    if (!localError || localError !== 'NAME_REQUIRED') return null;
    return t('forms.validation.required');
  }, [localError, t]);

  const emailError = useMemo(() => {
    if (!localError || localError !== 'INVALID_EMAIL') return null;
    return t('forms.validation.invalidEmail');
  }, [localError, t]);

  const passwordError = useMemo(() => {
    if (!localError || localError !== 'PASSWORD_TOO_SHORT') return null;
    return t('forms.validation.minLength', { min: MIN_PASSWORD_LENGTH });
  }, [localError, t]);

  const handleNameChange = useCallback((value) => {
    setName(value);
    setLocalError(null);
    clearError();
  }, [clearError]);

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
    if (trimmedName.length < 2) {
      setLocalError('NAME_REQUIRED');
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setLocalError('INVALID_EMAIL');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setLocalError('PASSWORD_TOO_SHORT');
      return;
    }

    await register({ name: trimmedName, email: trimmedEmail, password });
  }, [password, register, trimmedEmail, trimmedName]);

  const handleSignIn = useCallback(() => {
    router.push('/login');
  }, [router]);

  if (!hasRestoredSession) return null;
  if (isAuthenticated && requiresActiveFacility) return <Redirect href="/select-facility" />;
  if (isAuthenticated) return <Redirect href="/" />;

  const status = authMessage ? (
    <SystemBanner
      variant="info"
      title={t('auth.register.errorTitle')}
      message={authMessage}
      testID="register-error-banner"
    />
  ) : null;

  return (
    <AuthFormLayout
      title={t('auth.register.title')}
      description={t('auth.register.description')}
      status={status}
      actions={
        <Button
          text={t('auth.register.submit')}
          onPress={handleSubmit}
          onClick={handleSubmit}
          disabled={!canSubmit}
          loading={isLoading}
          accessibilityLabel={t('auth.register.submit')}
          testID="register-submit"
        />
      }
      footer={(
        <Stack spacing="xs" align="center">
          <Text variant="caption" align="center">
            {t('auth.register.signInPrompt')}
          </Text>
          <Button
            variant="text"
            text={t('auth.register.signIn')}
            onPress={handleSignIn}
            onClick={handleSignIn}
            accessibilityLabel={t('auth.register.signIn')}
            accessibilityHint={t('auth.register.signInHint')}
            testID="register-sign-in"
          />
        </Stack>
      )}
      testID="register-screen"
      accessibilityLabel={t('auth.register.accessibilityLabel')}
    >
      <Stack spacing="md">
        <AuthBrand
          name={t('auth.brand.name')}
          subtitle={t('auth.brand.subtitle')}
          logoLabel={t('auth.brand.logoLabel')}
          testID="register-brand"
        />
        <TextField
          label={t('auth.register.nameLabel')}
          placeholder={t('auth.register.namePlaceholder')}
          value={name}
          onChangeText={handleNameChange}
          autoComplete="name"
          required
          disabled={isLoading}
          errorMessage={nameError}
          testID="register-name"
        />
        <TextField
          label={t('auth.register.emailLabel')}
          placeholder={t('auth.register.emailPlaceholder')}
          value={email}
          onChangeText={handleEmailChange}
          type="email"
          autoCapitalize="none"
          autoCorrect={false}
          required
          disabled={isLoading}
          errorMessage={emailError}
          testID="register-email"
        />
        <PasswordField
          label={t('auth.register.passwordLabel')}
          placeholder={t('auth.register.passwordPlaceholder')}
          value={password}
          onChangeText={handlePasswordChange}
          autoComplete="new-password"
          required
          disabled={isLoading}
          errorMessage={passwordError}
          helperText={t('auth.register.passwordHelper')}
          testID="register-password"
        />
      </Stack>
    </AuthFormLayout>
  );
};

export default RegisterScreen;
