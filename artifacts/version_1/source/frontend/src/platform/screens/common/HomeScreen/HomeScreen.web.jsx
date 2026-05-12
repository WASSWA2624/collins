/**
 * HomeScreen Component - Web
 * File: HomeScreen.web.jsx
 */
import React from 'react';
import { useRouter } from 'expo-router';
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
} from './HomeScreen.web.styles';
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

const HomeScreenWeb = () => {
  const { t } = useI18n();
  const router = useRouter();
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

  const renderStatusValue = (item) => {
    if (item.valueKey) return t(item.valueKey);
    if (item.value !== null && item.value !== undefined) return String(item.value);
    return item.fallbackKey ? t(item.fallbackKey) : '-';
  };

  const renderStatusDetail = (item) => {
    if (item.detailKey) return t(item.detailKey, { count: item.detailValue ?? 0 });
    return item.detail ? String(item.detail) : null;
  };

  const handleActionClick = React.useCallback(
    (action) => (event) => {
      if (!action.enabled || !action.path) {
        event.preventDefault();
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }

      event.preventDefault();
      router.push(action.path);
    },
    [router]
  );

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
  const handleFacilityChange = React.useCallback(
    (value) => {
      selectFacility(value === ALL_FACILITIES_VALUE ? null : value);
    },
    [selectFacility]
  );

  return (
    <StyledContainer aria-label={t('home.title')} data-testid={testIds.screen} testID={testIds.screen}>
      <StyledShell>
        <StyledHeader>
          <StyledLogoArea>
            <AppLogo size="md" accessibilityLabel={t('home.welcome.logoLabel')} testID="home-logo" />
          </StyledLogoArea>
          <StyledHeaderCopy>
            <Text accessibilityRole="header" variant="h1" testID={testIds.title}>
              {t('home.welcome.title')}
            </Text>
            <StyledMessage data-testid={testIds.message}>{t('home.welcome.message')}</StyledMessage>
          </StyledHeaderCopy>
        </StyledHeader>

        {(errorCode || notices.length > 0) && (
          <StyledNoticeList aria-label={t('home.notices.title')} data-testid={testIds.notices}>
            {errorCode && (
              <StyledNoticeItem $severity="error" data-testid={testIds.error}>
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

        <StyledFacilityPanel aria-label={t('home.facilities.title')} data-testid={testIds.facilities}>
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
          <StyledStatusGrid aria-label={t('home.status.title')} data-testid={testIds.status}>
            {statusItems.map((item) => (
              <StyledStatusItem key={item.id} $tone={item.tone}>
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

          <StyledSection aria-label={t('home.actions.title')}>
            <StyledSectionTitle>{t('home.actions.title')}</StyledSectionTitle>
            <StyledActionGrid data-testid={testIds.actions}>
              {actions.map((action) => (
                <StyledActionItem
                  key={action.id}
                  $emphasis={action.emphasis}
                  $enabled={action.enabled}
                  aria-busy={isLoading}
                  aria-disabled={!action.enabled}
                  aria-label={t('home.actions.accessibilityLabel', {
                    name: t(`home.actions.${action.id}.title`),
                  })}
                  href={action.enabled ? action.path : undefined}
                  onClick={handleActionClick(action)}
                  tabIndex={action.enabled ? 0 : -1}
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

export default HomeScreenWeb;
