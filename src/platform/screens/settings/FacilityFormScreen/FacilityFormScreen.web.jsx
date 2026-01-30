/**
 * FacilityFormScreen - Web
 * Create/edit facility form.
 */
import React from 'react';
import {
  Button,
  ErrorState,
  LoadingSpinner,
  Select,
  Switch,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './FacilityFormScreen.web.styles';
import useFacilityFormScreen from './useFacilityFormScreen';

const FacilityFormScreenWeb = () => {
  const { t } = useI18n();
  const {
    isEdit,
    name,
    setName,
    facilityType,
    setFacilityType,
    isActive,
    setIsActive,
    tenantId,
    setTenantId,
    tenantOptions,
    tenantListLoading,
    isLoading,
    hasError,
    facility,
    onSubmit,
    onCancel,
    onGoToTenants,
    typeOptions,
  } = useFacilityFormScreen();

  if (isEdit && !facility && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="facility-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !facility) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('facility.form.loadError')}
            action={
              <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                {t('common.back')}
              </Button>
            }
            testID="facility-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="facility-form-title">
          {isEdit ? t('facility.form.editTitle') : t('facility.form.createTitle')}
        </Text>

        {!isEdit && (
          <StyledSection>
            {tenantListLoading ? (
              <div style={{ marginTop: 4 }}>
                <LoadingSpinner accessibilityLabel={t('common.loading')} testID="facility-form-tenant-loading" />
              </div>
            ) : tenantOptions.length === 0 ? (
              <div role="region" aria-label={t('facility.form.tenantLabel')} data-testid="facility-form-no-tenants">
                <Text variant="body" style={{ marginBottom: 8 }}>
                  {t('facility.form.noTenantsMessage')}
                </Text>
                <Text variant="body" style={{ marginBottom: 12 }}>
                  {t('facility.form.createTenantFirst')}
                </Text>
                <Button
                  variant="primary"
                  onPress={onGoToTenants}
                  accessibilityLabel={t('facility.form.goToTenants')}
                  accessibilityHint={t('facility.form.goToTenantsHint')}
                  testID="facility-form-go-to-tenants"
                >
                  {t('facility.form.goToTenants')}
                </Button>
              </div>
            ) : (
              <Select
                label={t('facility.form.tenantLabel')}
                placeholder={t('facility.form.tenantPlaceholder')}
                options={tenantOptions}
                value={tenantId}
                onValueChange={setTenantId}
                accessibilityLabel={t('facility.form.tenantLabel')}
                accessibilityHint={t('facility.form.tenantHint')}
                testID="facility-form-tenant"
              />
            )}
          </StyledSection>
        )}

        <StyledSection>
          <TextField
            label={t('facility.form.nameLabel')}
            placeholder={t('facility.form.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            accessibilityLabel={t('facility.form.nameLabel')}
            accessibilityHint={t('facility.form.nameHint')}
            testID="facility-form-name"
          />
        </StyledSection>

        <StyledSection>
          <Select
            label={t('facility.form.typeLabel')}
            placeholder={t('facility.form.typePlaceholder')}
            options={typeOptions}
            value={facilityType}
            onValueChange={setFacilityType}
            accessibilityLabel={t('facility.form.typeLabel')}
            accessibilityHint={t('facility.form.typeHint')}
            testID="facility-form-type"
          />
        </StyledSection>

        <StyledSection>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            label={t('facility.form.activeLabel')}
            accessibilityLabel={t('facility.form.activeLabel')}
            accessibilityHint={t('facility.form.activeHint')}
            testID="facility-form-active"
          />
        </StyledSection>

        <StyledActions>
          <Button
            variant="ghost"
            onPress={onCancel}
            accessibilityLabel={t('facility.form.cancel')}
            accessibilityHint={t('facility.form.cancelHint')}
            testID="facility-form-cancel"
          >
            {t('facility.form.cancel')}
          </Button>
          <Button
            variant="primary"
            onPress={onSubmit}
            accessibilityLabel={isEdit ? t('facility.form.submitEdit') : t('facility.form.submitCreate')}
            testID="facility-form-submit"
          >
            {isEdit ? t('facility.form.submitEdit') : t('facility.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default FacilityFormScreenWeb;
