/**
 * RegisterScreen
 * Minimal account creation UI backed by the existing auth registration flow.
 * File: RegisterScreen.jsx
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { searchFacilitiesUseCase } from '@features/facilities';
import { useAuth, useDebounce, useI18n } from '@hooks';
import { BANNER_VARIANTS } from '@utils/shellBanners';
import FacilitySearchSelect from './FacilitySearchSelect';

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
  const [facilityQuery, setFacilityQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [facilityError, setFacilityError] = useState(null);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(false);
  const [localError, setLocalError] = useState(null);
  const debouncedFacilityQuery = useDebounce(facilityQuery, 250);
  const facilitiesRequestRef = useRef(0);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const selectedFacilityId = selectedFacility?.id || null;
  const canSubmit =
    trimmedName.length > 0 &&
    trimmedEmail.length > 0 &&
    password.length > 0 &&
    Boolean(selectedFacilityId) &&
    !isLoading;
  const authMessage = getErrorMessage(t, errorCode);

  useEffect(() => {
    const requestId = facilitiesRequestRef.current + 1;
    facilitiesRequestRef.current = requestId;
    setIsLoadingFacilities(true);
    setFacilityError(null);

    searchFacilitiesUseCase({
      q: debouncedFacilityQuery || undefined,
      page: 1,
      limit: 25,
    })
      .then((response) => {
        if (facilitiesRequestRef.current === requestId) {
          setFacilityOptions(Array.isArray(response?.facilities) ? response.facilities : []);
        }
      })
      .catch((error) => {
        if (facilitiesRequestRef.current === requestId) {
          setFacilityOptions([]);
          setFacilityError(error?.safeMessage || error?.message || t('auth.register.facilityLoadError'));
        }
      })
      .finally(() => {
        if (facilitiesRequestRef.current === requestId) setIsLoadingFacilities(false);
      });
  }, [debouncedFacilityQuery, t]);

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

  const facilityValidationError = useMemo(() => {
    if (!localError || localError !== 'FACILITY_REQUIRED') return null;
    return t('forms.validation.required');
  }, [localError, t]);

  const selectedFacilityHelper = useMemo(() => {
    if (!selectedFacility) return null;
    return [
      selectedFacility.district || selectedFacility.region,
      selectedFacility.ownership || selectedFacility.type,
    ].filter(Boolean).join(' - ') || selectedFacility.name;
  }, [selectedFacility]);

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

  const handleFacilityQueryChange = useCallback((value) => {
    const nextQuery = String(value ?? '');
    setFacilityQuery(nextQuery);
    if (selectedFacility && nextQuery.trim() !== selectedFacility.name) {
      setSelectedFacility(null);
    }
    setLocalError(null);
    clearError();
  }, [clearError, selectedFacility]);

  const handleFacilitySelect = useCallback((facility) => {
    setSelectedFacility(facility);
    setFacilityQuery(facility?.name || '');
    setLocalError(null);
    clearError();
  }, [clearError]);

  const handleFacilityClear = useCallback(() => {
    setSelectedFacility(null);
    setFacilityQuery('');
    setLocalError(null);
    clearError();
  }, [clearError]);

  const handleSubmit = useCallback(async () => {
    if (isLoading) return;
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
    if (!selectedFacilityId) {
      setLocalError('FACILITY_REQUIRED');
      return;
    }

    await register({
      name: trimmedName,
      email: trimmedEmail,
      password,
      facilityId: selectedFacilityId,
    });
  }, [isLoading, password, register, selectedFacilityId, trimmedEmail, trimmedName]);

  const handleSignIn = useCallback(() => {
    router.push('/login');
  }, [router]);

  if (!hasRestoredSession) return null;
  if (isAuthenticated && requiresActiveFacility) return <Redirect href="/select-facility" />;
  if (isAuthenticated) return <Redirect href="/" />;

  const status = authMessage ? (
    <SystemBanner
      variant={BANNER_VARIANTS.ERROR}
      title={t('auth.register.errorTitle')}
      message={authMessage}
      testID="register-error-banner"
    />
  ) : null;

  return (
    <AuthFormLayout
      size="sm"
      status={status}
      actions={
        <Button
          text={isLoading ? t('auth.register.submitting') : t('auth.register.submit')}
          onPress={handleSubmit}
          onClick={handleSubmit}
          disabled={!canSubmit}
          loading={isLoading}
          accessibilityLabel={t('auth.register.submit')}
          style={{ width: '100%' }}
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
      <Stack spacing="md" align="stretch" style={{ width: '100%' }}>
        <AuthBrand
          name={t('auth.brand.name')}
          logoLabel={t('auth.brand.logoLabel')}
          layout="horizontal"
          testID="register-brand"
        />
        <Stack spacing="xs" align="center" style={{ width: '100%' }}>
          <Text variant="h2" align="center" accessibilityLabel={t('auth.register.title')} testID="register-title">
            {t('auth.register.title')}
          </Text>
          <Text variant="caption" align="center" testID="register-description">
            {t('auth.register.description')}
          </Text>
        </Stack>
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
        <FacilitySearchSelect
          label={t('auth.register.facilityLabel')}
          placeholder={t('auth.register.facilityPlaceholder')}
          query={facilityQuery}
          onQueryChange={handleFacilityQueryChange}
          value={selectedFacility}
          onValueChange={handleFacilitySelect}
          onClear={handleFacilityClear}
          options={facilityOptions}
          helperText={t('auth.register.facilityHelper')}
          selectedHelper={selectedFacilityHelper
            ? t('auth.register.facilitySelectedHelper', { facility: selectedFacilityHelper })
            : undefined}
          noResultsText={t('auth.register.facilityNoResults')}
          loadingText={t('auth.register.facilityLoading')}
          errorText={facilityValidationError || facilityError}
          clearLabel={t('auth.register.facilityClear')}
          disabled={isLoading}
          loading={isLoadingFacilities}
          accessibilityHint={t('auth.register.facilityHint')}
          testID="register-facility"
        />
      </Stack>
    </AuthFormLayout>
  );
};

export default RegisterScreen;
