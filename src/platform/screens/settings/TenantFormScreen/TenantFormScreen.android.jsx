/**
 * TenantFormScreen - Android
 */
import React from 'react';
import { ScrollView } from 'react-native';
import {
  Button,
  ErrorState,
  LoadingSpinner,
  Switch,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './TenantFormScreen.android.styles';
import useTenantFormScreen from './useTenantFormScreen';

const TenantFormScreenAndroid = () => {
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContainer>
          <StyledContent>
            <LoadingSpinner accessibilityLabel={t('common.loading')} testID="tenant-form-loading" />
          </StyledContent>
        </StyledContainer>
      </ScrollView>
    );
  }

  if (isEdit && hasError && !tenant) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
              onChangeText={setName}
              testID="tenant-form-name"
            />
          </StyledSection>
          <StyledSection>
            <TextField
              label={t('tenant.form.slugLabel')}
              placeholder={t('tenant.form.slugPlaceholder')}
              value={slug}
              onChangeText={setSlug}
              testID="tenant-form-slug"
            />
          </StyledSection>
          <StyledSection>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              label={t('tenant.form.activeLabel')}
              testID="tenant-form-active"
            />
          </StyledSection>
          <StyledActions>
            <Button variant="ghost" onPress={onCancel} testID="tenant-form-cancel">
              {t('tenant.form.cancel')}
            </Button>
            <Button variant="primary" onPress={onSubmit} testID="tenant-form-submit">
              {isEdit ? t('tenant.form.submitEdit') : t('tenant.form.submitCreate')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default TenantFormScreenAndroid;
