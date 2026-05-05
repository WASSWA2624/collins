/**
 * FacilitySelectionScreen
 * Blocks clinical workflows until an authenticated user has an active facility.
 * File: FacilitySelectionScreen.jsx
 */
import React, { useCallback, useMemo } from 'react';
import { Redirect } from 'expo-router';
import { AuthFormLayout, Button, Stack, SystemBanner, Text } from '@platform/components';
import { getFacilityOptionsForUser } from '@config/accessControl';
import { useAuth, useI18n } from '@hooks';

const formatRoles = (roles = []) => roles.map((role) => String(role).replaceAll('_', ' ')).join(', ');

const FacilitySelectionScreen = () => {
  const { t } = useI18n();
  const {
    errorCode,
    isAuthenticated,
    isLoading,
    logout,
    requiresActiveFacility,
    selectActiveFacility,
    user,
  } = useAuth();

  const facilities = useMemo(() => getFacilityOptionsForUser(user), [user]);

  const handleSelect = useCallback(
    (facilityId) => () => {
      void selectActiveFacility({ activeFacilityId: facilityId });
    },
    [selectActiveFacility]
  );

  const handleLogout = useCallback(() => {
    void logout();
  }, [logout]);

  if (!isAuthenticated) return <Redirect href="/login" />;
  if (!requiresActiveFacility) return <Redirect href="/" />;

  const status = errorCode ? (
    <SystemBanner
      variant="info"
      title={t('auth.facility.errorTitle')}
      message={t(`errors.codes.${errorCode}`)}
      testID="facility-selection-error"
    />
  ) : null;

  return (
    <AuthFormLayout
      title={t('auth.facility.title')}
      description={t('auth.facility.description')}
      status={status}
      actions={
        <Button
          variant="outline"
          text={t('auth.logout')}
          onPress={handleLogout}
          onClick={handleLogout}
          disabled={isLoading}
          testID="facility-selection-logout"
        />
      }
      testID="facility-selection-screen"
      accessibilityLabel={t('auth.facility.accessibilityLabel')}
    >
      <Stack spacing="md">
        {facilities.length > 0 ? (
          facilities.map((facility) => {
            const name = facility.facility?.name || facility.name || facility.facilityId;
            const roleText = formatRoles(facility.roles);
            return (
              <Button
                key={facility.facilityId}
                variant="secondary"
                text={name}
                onPress={handleSelect(facility.facilityId)}
                onClick={handleSelect(facility.facilityId)}
                disabled={isLoading}
                accessibilityLabel={t('auth.facility.selectFacility', { name })}
                accessibilityHint={roleText || undefined}
                testID={`facility-option-${facility.facilityId}`}
              />
            );
          })
        ) : (
          <Text variant="body" testID="facility-selection-empty">
            {t('auth.facility.empty')}
          </Text>
        )}
      </Stack>
    </AuthFormLayout>
  );
};

export default FacilitySelectionScreen;

