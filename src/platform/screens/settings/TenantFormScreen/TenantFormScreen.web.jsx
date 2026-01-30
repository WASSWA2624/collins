/**
 * TenantFormScreen - Web
 */
import React from 'react';
import {
  Button,
  ErrorState,
  LoadingSpinner,
  Switch,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './TenantFormScreen.web.styles';
import useTenantFormScreen from './useTenantFormScreen';

const TenantFormScreenWeb = () => {
  const { t } = useI18n();
  const {
    isEdit,
    name,
    setName,
    slug,
    setSlug,
    isActive,
    setIsActive,
    isLoading,
    hasError,
    tenant,
    onSubmit,
    onCancel,
  } = useTenantFormScreen();

  if (isEdit && !tenant && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="tenant-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !tenant) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('tenant.form.loadError')}
            action={
              <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                {t('common.back')}
              </Button>
            }
            testID="tenant-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="tenant-form-title">
          {isEdit ? t('tenant.form.editTitle') : t('tenant.form.createTitle')}
        </Text>

        <StyledSection>
          <TextField
            label={t('tenant.form.nameLabel')}
            placeholder={t('tenant.form.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            accessibilityLabel={t('tenant.form.nameLabel')}
            accessibilityHint={t('tenant.form.nameHint')}
            testID="tenant-form-name"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('tenant.form.slugLabel')}
            placeholder={t('tenant.form.slugPlaceholder')}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            accessibilityLabel={t('tenant.form.slugLabel')}
            accessibilityHint={t('tenant.form.slugHint')}
            testID="tenant-form-slug"
          />
        </StyledSection>

        <StyledSection>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            label={t('tenant.form.activeLabel')}
            accessibilityLabel={t('tenant.form.activeLabel')}
            accessibilityHint={t('tenant.form.activeHint')}
            testID="tenant-form-active"
          />
        </StyledSection>

        <StyledActions>
          <Button
            variant="ghost"
            onPress={onCancel}
            accessibilityLabel={t('tenant.form.cancel')}
            accessibilityHint={t('tenant.form.cancelHint')}
            testID="tenant-form-cancel"
          >
            {t('tenant.form.cancel')}
          </Button>
          <Button
            variant="primary"
            onPress={onSubmit}
            accessibilityLabel={isEdit ? t('tenant.form.submitEdit') : t('tenant.form.submitCreate')}
            testID="tenant-form-submit"
          >
            {isEdit ? t('tenant.form.submitEdit') : t('tenant.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default TenantFormScreenWeb;
