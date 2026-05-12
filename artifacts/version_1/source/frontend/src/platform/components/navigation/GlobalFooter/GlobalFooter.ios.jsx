/**
 * GlobalFooter Component - iOS
 * Shared global footer with status, legal, and quick actions
 * File: GlobalFooter.ios.jsx
 */
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '@platform/components/display/Text';
import { useI18n } from '@hooks';
import { APP_ENVIRONMENT, APP_VERSION, BUILD_NUMBER } from '@config/env';
import useGlobalFooter from './useGlobalFooter';
import { ACTION_VARIANTS, FOOTER_VARIANTS, STATUS_TONES } from './types';
import {
  StyledFooter,
  StyledFooterContent,
  StyledFooterRow,
  StyledStatusGroup,
  StyledStatusBadge,
  StyledEnvironmentInfo,
  StyledLegalLinks,
  StyledLegalButton,
  StyledLegalText,
  StyledQuickActionsGroup,
  StyledQuickActionButton,
  StyledQuickActionIcon,
  StyledQuickActionsSlot,
} from './GlobalFooter.ios.styles';

const normalizeVariant = (variant) => {
  if (typeof variant !== 'string') return FOOTER_VARIANTS.MAIN;
  const normalized = variant.trim().toLowerCase();
  if (normalized === FOOTER_VARIANTS.AUTH) return FOOTER_VARIANTS.AUTH;
  if (normalized === FOOTER_VARIANTS.PATIENT) return FOOTER_VARIANTS.PATIENT;
  return FOOTER_VARIANTS.MAIN;
};

const getDefaultStatusTone = (variant) => {
  if (variant === FOOTER_VARIANTS.AUTH) return STATUS_TONES.SUCCESS;
  if (variant === FOOTER_VARIANTS.PATIENT) return STATUS_TONES.NEUTRAL;
  return STATUS_TONES.SUCCESS;
};

const getDefaultStatusLabel = (variant, t) => {
  if (variant === FOOTER_VARIANTS.AUTH) return t('navigation.footer.status.auth');
  if (variant === FOOTER_VARIANTS.PATIENT) return t('navigation.footer.status.patient');
  return t('navigation.footer.status.main');
};

const getDefaultLegalLinks = (variant, t) => {
  const baseLinks = [
    { key: 'terms', label: t('navigation.footer.legal.terms') },
    { key: 'privacy', label: t('navigation.footer.legal.privacy') },
  ];
  if (variant === FOOTER_VARIANTS.AUTH) {
    return baseLinks;
  }
  return [...baseLinks, { key: 'support', label: t('navigation.footer.legal.support') }];
};

const getItemKey = (item, index) => item.key || item.id || item.label || `item-${index}`;

const buildLegalItems = ({ links, testID }) => {
  return links.map((link, index) => {
    const itemKey = getItemKey(link, index);
    const itemTestID = link.testID || (testID ? `${testID}-legal-${itemKey}` : undefined);
    const label = link.label;
    const renderedLabel = typeof label === 'string'
      ? (
        <Text variant="caption" color="text.secondary">
          {label}
        </Text>
      )
      : label;

    if (link.onPress) {
      return (
        <StyledLegalButton
          key={itemKey}
          onPress={link.onPress}
          disabled={link.disabled}
          accessibilityRole="button"
          accessibilityLabel={link.accessibilityLabel || label}
          testID={itemTestID}
        >
          {renderedLabel}
        </StyledLegalButton>
      );
    }

    return (
      <StyledLegalText key={itemKey} testID={itemTestID} accessibilityRole="text">
        {renderedLabel}
      </StyledLegalText>
    );
  });
};

const buildQuickActionItems = ({ actions, testID }) => {
  return actions.map((action, index) => {
    const actionKey = getItemKey(action, index);
    const actionTestID = action.testID || (testID ? `${testID}-action-${actionKey}` : undefined);
    const isPrimary = action.variant === ACTION_VARIANTS.PRIMARY;
    const isDisabled = action.disabled || !action.onPress;
    const label = action.label;
    const labelColor = isPrimary ? 'onPrimary' : 'text.primary';

    return (
      <StyledQuickActionButton
        key={actionKey}
        onPress={action.onPress}
        disabled={isDisabled}
        isPrimary={isPrimary}
        isDisabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={action.accessibilityLabel || label}
        testID={actionTestID}
      >
        {action.icon ? <StyledQuickActionIcon>{action.icon}</StyledQuickActionIcon> : null}
        {label ? (
          <Text variant="label" color={labelColor}>
            {label}
          </Text>
        ) : null}
      </StyledQuickActionButton>
    );
  });
};

/**
 * GlobalFooter component for iOS
 * @param {Object} props - GlobalFooter props
 * @param {string} props.variant - Footer variant (auth/main/patient)
 * @param {string|React.ReactNode} props.status - Status content
 * @param {string} props.statusTone - Status tone (neutral/success/warning/error)
 * @param {Array} props.legalLinks - Legal link definitions
 * @param {Array} props.quickActions - Quick action definitions
 * @param {React.ReactNode} props.quickActionsSlot - Custom quick actions slot
 * @param {string} props.currentRole - Current user role
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const GlobalFooterIOS = ({
  variant = FOOTER_VARIANTS.MAIN,
  status,
  statusTone,
  legalLinks,
  quickActions = [],
  quickActionsSlot,
  currentRole,
  accessibilityLabel,
  testID,
  ...rest
}) => {
  const { t } = useI18n();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const resolvedVariant = normalizeVariant(variant);
  const resolvedStatus = status ?? getDefaultStatusLabel(resolvedVariant, t);
  const resolvedStatusTone = statusTone || getDefaultStatusTone(resolvedVariant);

  const resolvedLegalLinks = useMemo(() => {
    if (Array.isArray(legalLinks)) return legalLinks;
    if (legalLinks === null) return [];
    return getDefaultLegalLinks(resolvedVariant, t);
  }, [legalLinks, resolvedVariant, t]);

  const {
    visibleLegalLinks,
    visibleQuickActions,
    hasLegalLinks,
    hasQuickActions,
  } = useGlobalFooter({
    legalLinks: resolvedLegalLinks,
    quickActions,
    currentRole,
  });

  const quickActionItems = useMemo(() => {
    return buildQuickActionItems({ actions: visibleQuickActions, testID });
  }, [visibleQuickActions, testID]);

  const legalLinkItems = useMemo(() => {
    return buildLegalItems({ links: visibleLegalLinks, testID });
  }, [visibleLegalLinks, testID]);

  const showStatus = resolvedStatus !== null && resolvedStatus !== undefined;
  const showQuickActions = Boolean(quickActionsSlot) || hasQuickActions;
  const environmentInfo = t('navigation.footer.environment', {
    env: APP_ENVIRONMENT,
    version: APP_VERSION,
    build: BUILD_NUMBER,
  });
  const statusTextColor = resolvedStatusTone === STATUS_TONES.NEUTRAL ? 'text.secondary' : 'text.inverse';

  return (
    <StyledFooter
      accessibilityLabel={accessibilityLabel || t('navigation.footer.title')}
      testID={testID}
      {...rest}
    >
      <StyledFooterContent bottomInset={bottomInset}>
        {(showStatus || showQuickActions) && (
          <StyledFooterRow>
            <StyledStatusGroup>
              {showStatus && (
                <StyledStatusBadge tone={resolvedStatusTone} accessibilityLabel={t('navigation.footer.status.title')}>
                  {typeof resolvedStatus === 'string' ? (
                    <Text variant="caption" color={statusTextColor}>
                      {resolvedStatus}
                    </Text>
                  ) : (
                    resolvedStatus
                  )}
                </StyledStatusBadge>
              )}
              <StyledEnvironmentInfo>{environmentInfo}</StyledEnvironmentInfo>
            </StyledStatusGroup>
            {showQuickActions && (
              quickActionsSlot ? (
                <StyledQuickActionsSlot>{quickActionsSlot}</StyledQuickActionsSlot>
              ) : (
                <StyledQuickActionsGroup>{quickActionItems}</StyledQuickActionsGroup>
              )
            )}
          </StyledFooterRow>
        )}
        {hasLegalLinks && (
          <StyledFooterRow accessibilityLabel={t('navigation.footer.legal.title')}>
            <StyledLegalLinks>{legalLinkItems}</StyledLegalLinks>
          </StyledFooterRow>
        )}
      </StyledFooterContent>
    </StyledFooter>
  );
};

export default GlobalFooterIOS;
