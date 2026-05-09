/**
 * HomeScreen Component - Web
 * File: HomeScreen.web.jsx
 */
import React from 'react';
import { AppLogo, Badge, Icon, Text } from '@platform/components';
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
  StyledFacilityBody,
  StyledFacilityButton,
  StyledFacilityChevron,
  StyledFacilityHeader,
  StyledFacilityIcon,
  StyledFacilityList,
  StyledFacilityMeta,
  StyledFacilityName,
  StyledFacilityPanel,
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
import useHomeScreen from './useHomeScreen';

const badgeVariantForTone = (tone) => {
  if (tone === 'error') return 'error';
  if (tone === 'warning') return 'warning';
  if (tone === 'success') return 'success';
  return 'primary';
};

const actionGlyphs = Object.freeze({
  admit: '+',
  tracking: 'T',
  abgVentUpdate: 'ABG',
  datasetCapture: 'D',
  reviewQueue: 'R',
  dashboard: '#',
  settings: '*',
});

const statusGlyphs = Object.freeze({
  facility: 'F',
  network: 'N',
  activeAdmissions: 'A',
  drafts: 'D',
  syncAttention: '!',
  reviewNeeds: 'R',
});

const facilityMeta = (facility) =>
  [facility.district, facility.region, facility.type].filter(Boolean).join(' / ');

const HomeScreenWeb = () => {
  const { t } = useI18n();
  const {
    activeFacility,
    actions,
    availableFacilities,
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

  const showFacilitySelector = !activeFacility && availableFacilities.length > 1;

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

        {showFacilitySelector && (
          <StyledFacilityPanel aria-label={t('home.facilities.title')} data-testid={testIds.facilities}>
            <StyledFacilityHeader>
              <StyledSectionTitle>{t('home.facilities.title')}</StyledSectionTitle>
              <Badge variant="primary" size="small">
                {availableFacilities.length}
              </Badge>
            </StyledFacilityHeader>
            <StyledFacilityList>
              {availableFacilities.map((facility) => {
                const isSelected = selectedFacilityId === facility.id;

                return (
                  <StyledFacilityButton
                    key={facility.id}
                    type="button"
                    $selected={isSelected}
                    aria-pressed={isSelected}
                    aria-label={t('home.facilities.select', { name: facility.name })}
                    onClick={() => selectFacility(facility.id)}
                  >
                    <StyledFacilityIcon $selected={isSelected}>
                      <Icon glyph={isSelected ? 'OK' : '+'} size={isSelected ? 12 : 'md'} decorative />
                    </StyledFacilityIcon>
                    <StyledFacilityBody>
                      <StyledFacilityName>{facility.name}</StyledFacilityName>
                      {facilityMeta(facility) && (
                        <StyledFacilityMeta>{facilityMeta(facility)}</StyledFacilityMeta>
                      )}
                    </StyledFacilityBody>
                    <StyledFacilityChevron aria-hidden="true">&gt;</StyledFacilityChevron>
                  </StyledFacilityButton>
                );
              })}
            </StyledFacilityList>
          </StyledFacilityPanel>
        )}

        <StyledDashboardGrid>
          <StyledStatusGrid aria-label={t('home.status.title')} data-testid={testIds.status}>
            {statusItems.map((item) => (
              <StyledStatusItem key={item.id} $tone={item.tone}>
                <StyledStatusHeader>
                  <StyledStatusIcon $tone={item.tone}>
                    <Icon glyph={statusGlyphs[item.id] || 'i'} size="sm" decorative />
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
                  tabIndex={action.enabled ? 0 : -1}
                >
                  <StyledActionIcon $emphasis={action.emphasis} $enabled={action.enabled}>
                    <Icon glyph={actionGlyphs[action.id] || '>'} size="sm" decorative />
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
