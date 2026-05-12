/**
 * HomeScreen Component - Native
 * File: HomeScreen.native.jsx
 */
import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { AppLogo, Badge, Icon, Select, Text } from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledActionBody,
  StyledActionGrid,
  StyledActionIcon,
  StyledActionItem,
  StyledActionMeta,
  StyledActionTitle,
  StyledContainer,
  StyledDashboardGrid,
  StyledFacilityHeader,
  StyledFacilityPanel,
  StyledFacilitySelectWrap,
  StyledFacilitySummary,
  StyledHeader,
  StyledHeaderCopy,
  StyledLogoArea,
  StyledMessage,
  StyledNoticeItem,
  StyledNoticeList,
  StyledNoticeMessage,
  StyledSection,
  StyledSectionTitle,
  StyledShell,
  StyledStatusDetail,
  StyledStatusGrid,
  StyledStatusHeader,
  StyledStatusIcon,
  StyledStatusItem,
  StyledStatusLabel,
  StyledStatusValue,
} from './HomeScreen.native.styles';
import {
  ACTION_GLYPHS,
  STATUS_GLYPHS,
  findFacilityById,
  getFacilityMeta,
  getFacilitySelectOptions,
} from './presentation';
import useHomeScreen from './useHomeScreen';

const badgeVariantForTone = (tone) => {
  if (tone === 'error') return 'error';
  if (tone === 'warning') return 'warning';
  if (tone === 'success') return 'success';
  return 'primary';
};

const ALL_FACILITIES_VALUE = '__all_facilities__';

const HomeScreenNative = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isCompact = width < 600;
  const {
    activeFacility,
    actions,
    availableFacilities,
    canSelectFacility,
    errorCode,
    isLoading,
    notices,
    selectFacility,
    selectedFacilityId,
    statusItems,
    testIds,
  } = useHomeScreen();

  const handleActionPress = useCallback(
    (action) => () => {
      if (action.enabled && action.path) router.push(action.path);
    },
    [router]
  );

  const renderStatusValue = (item) => {
    if (item.valueKey) return t(item.valueKey);
    if (item.value !== null && item.value !== undefined) return String(item.value);
    return item.fallbackKey ? t(item.fallbackKey) : '-';
  };

  const renderStatusDetail = (item) => {
    if (item.detailKey) return t(item.detailKey, { count: item.detailValue ?? 0 });
    return item.detail ? String(item.detail) : null;
  };

  const facilityOptions = React.useMemo(
    () => {
      const options = getFacilitySelectOptions(availableFacilities, activeFacility)
        .filter((option) => !String(option.value || '').startsWith('__'));
      if (!canSelectFacility) return options;
      return [
        {
          label: t('home.facilities.all'),
          value: ALL_FACILITIES_VALUE,
          icon: 'F',
          searchText: [t('home.facilities.all')],
        },
        ...options,
      ];
    },
    [activeFacility, availableFacilities, canSelectFacility, t]
  );
  const facilitySelectValue = canSelectFacility
    ? selectedFacilityId || ALL_FACILITIES_VALUE
    : selectedFacilityId || activeFacility?.id || null;
  const selectedFacility = findFacilityById(
    availableFacilities,
    facilitySelectValue === ALL_FACILITIES_VALUE ? null : facilitySelectValue,
    activeFacility
  );
  const selectedFacilityMeta = getFacilityMeta(selectedFacility);
  const hasFacilityOptions = facilityOptions.length > 0;
  const facilityCount = canSelectFacility ? Math.max(facilityOptions.length - 1, 0) : facilityOptions.length;
  const facilityHelperText = isLoading
    ? t('common.loading')
    : hasFacilityOptions
      ? null
      : t('settings.account.noAssignedFacility');
  const handleFacilityChange = useCallback(
    (value) => {
      selectFacility(value === ALL_FACILITIES_VALUE ? null : value);
    },
    [selectFacility]
  );

  return (
    <StyledContainer
      accessibilityLabel={t('home.title')}
      contentContainerStyle={{ flexGrow: 1 }}
      testID={testIds.screen}
    >
      <StyledShell $compact={isCompact}>
        <StyledHeader>
          <StyledLogoArea>
            <AppLogo size="md" accessibilityLabel={t('home.welcome.logoLabel')} testID="home-logo" />
          </StyledLogoArea>
          <StyledHeaderCopy>
            <Text accessibilityRole="header" variant="h1" testID={testIds.title}>
              {t('home.welcome.title')}
            </Text>
            <StyledMessage testID={testIds.message}>{t('home.welcome.message')}</StyledMessage>
          </StyledHeaderCopy>
        </StyledHeader>

        {(errorCode || notices.length > 0) && (
          <StyledNoticeList accessibilityLabel={t('home.notices.title')} testID={testIds.notices}>
            {errorCode && (
              <StyledNoticeItem $severity="error" testID={testIds.error}>
                <StyledNoticeMessage>{t(`errors.codes.${errorCode}`)}</StyledNoticeMessage>
              </StyledNoticeItem>
            )}
            {notices.map((notice) => (
              <StyledNoticeItem key={`${notice.code}-${notice.message}`} $severity={notice.severity}>
                <StyledNoticeMessage>{notice.message}</StyledNoticeMessage>
                {Number.isFinite(notice.count) && (
                  <Badge variant={badgeVariantForTone(notice.severity)} size="small">
                    {notice.count}
                  </Badge>
                )}
              </StyledNoticeItem>
            ))}
          </StyledNoticeList>
        )}

        <StyledFacilityPanel accessibilityLabel={t('home.facilities.title')} testID={testIds.facilities}>
          <StyledFacilityHeader>
            <StyledSectionTitle>{t('home.facilities.title')}</StyledSectionTitle>
            {facilityCount > 0 && (
              <Badge variant="primary" size="small">
                {facilityCount}
              </Badge>
            )}
          </StyledFacilityHeader>
          <StyledFacilitySelectWrap>
            {canSelectFacility ? (
              <Select
                compact
                disabled={isLoading || !hasFacilityOptions}
                helperText={facilityHelperText}
                options={facilityOptions}
                placeholder={t('home.status.facility.empty')}
                searchPlaceholder={t('common.searchPlaceholder')}
                searchable
                style={{ width: '100%' }}
                testID={`${testIds.facilities}-select`}
                value={facilitySelectValue}
                onValueChange={handleFacilityChange}
                accessibilityLabel={t('home.facilities.title')}
              />
            ) : (
              <StyledFacilitySummary>
                {selectedFacility?.name || t('home.status.facility.empty')}
              </StyledFacilitySummary>
            )}
            {selectedFacilityMeta ? (
              <StyledFacilitySummary>{selectedFacilityMeta}</StyledFacilitySummary>
            ) : null}
          </StyledFacilitySelectWrap>
        </StyledFacilityPanel>

        <StyledDashboardGrid>
          <StyledStatusGrid $compact={isCompact} accessibilityLabel={t('home.status.title')} testID={testIds.status}>
            {statusItems.map((item) => (
              <StyledStatusItem key={item.id} $compact={isCompact} $tone={item.tone}>
                <StyledStatusHeader>
                  <StyledStatusIcon $tone={item.tone}>
                    <Icon glyph={STATUS_GLYPHS[item.id] || 'i'} size="sm" tone={item.tone} decorative />
                  </StyledStatusIcon>
                  <StyledStatusLabel>{t(`home.status.${item.id}.label`)}</StyledStatusLabel>
                </StyledStatusHeader>
                <StyledStatusValue>{renderStatusValue(item)}</StyledStatusValue>
                {renderStatusDetail(item) && (
                  <StyledStatusDetail>{renderStatusDetail(item)}</StyledStatusDetail>
                )}
              </StyledStatusItem>
            ))}
          </StyledStatusGrid>

          <StyledSection accessibilityLabel={t('home.actions.title')}>
            <StyledSectionTitle>{t('home.actions.title')}</StyledSectionTitle>
            <StyledActionGrid $compact={isCompact} testID={testIds.actions}>
              {actions.map((action) => (
                <StyledActionItem
                  key={action.id}
                  $compact={isCompact}
                  $emphasis={action.emphasis}
                  $enabled={action.enabled}
                  accessibilityLabel={t('home.actions.accessibilityLabel', {
                    name: t(`home.actions.${action.id}.title`),
                  })}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !action.enabled, busy: isLoading }}
                  disabled={!action.enabled}
                  onPress={handleActionPress(action)}
                >
                  <StyledActionIcon $emphasis={action.emphasis} $enabled={action.enabled}>
                    <Icon
                      glyph={ACTION_GLYPHS[action.id] || '>'}
                      size="sm"
                      tone={action.emphasis === 'primary' ? 'inverse' : 'muted'}
                      decorative
                    />
                  </StyledActionIcon>
                  <StyledActionBody>
                    <StyledActionTitle>{t(`home.actions.${action.id}.title`)}</StyledActionTitle>
                    <StyledActionMeta>
                      {action.enabled
                        ? t('home.actions.meta.open')
                        : t(`home.actions.disabled.${action.disabledReason}`)}
                    </StyledActionMeta>
                  </StyledActionBody>
                  {Number.isFinite(action.count) && (
                    <Badge variant="primary" size="small">
                      {action.count}
                    </Badge>
                  )}
                </StyledActionItem>
              ))}
            </StyledActionGrid>
          </StyledSection>
        </StyledDashboardGrid>
      </StyledShell>
    </StyledContainer>
  );
};

export default HomeScreenNative;
