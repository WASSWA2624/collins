/**
 * GlobalHeader Component - Android
 * Shared global header with title, actions, and breadcrumbs
 * File: GlobalHeader.android.jsx
 */
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '@platform/components/display/Text';
import Breadcrumbs from '@platform/components/navigation/Breadcrumbs';
import { useI18n } from '@hooks';
import useGlobalHeader from './useGlobalHeader';
import { ACTION_VARIANTS } from './types';
import {
  StyledHeader,
  StyledHeaderRow,
  StyledLeadingSlot,
  StyledTitleGroup,
  StyledTitleBlock,
  StyledActionsGroup,
  StyledUtilityGroup,
  StyledActionButton,
  StyledActionIcon,
  StyledBreadcrumbsRow,
} from './GlobalHeader.android.styles';

const getActionKey = (action, index) => action.key || action.id || action.label || `action-${index}`;

const buildActionItems = ({ actions, testID }) => {
  return actions.map((action, index) => {
    const actionKey = getActionKey(action, index);
    const actionTestID = action.testID || (testID ? `${testID}-action-${actionKey}` : undefined);
    const isPrimary = action.variant === ACTION_VARIANTS.PRIMARY;
    const isDisabled = action.disabled || !action.onPress;
    const isCircular = action.isCircular !== false;
    const label = action.label;
    const labelColor = isPrimary ? 'onPrimary' : 'text.primary';

    return (
      <StyledActionButton
        key={actionKey}
        onPress={action.onPress}
        disabled={isDisabled}
        isPrimary={isPrimary}
        isDisabled={isDisabled}
        isCircular={isCircular}
        accessibilityRole="button"
        accessibilityLabel={action.accessibilityLabel || label}
        testID={actionTestID}
      >
        {action.icon ? <StyledActionIcon>{action.icon}</StyledActionIcon> : null}
        {label ? (
          <Text variant="label" color={labelColor}>
            {label}
          </Text>
        ) : null}
      </StyledActionButton>
    );
  });
};

/**
 * GlobalHeader component for Android
 * @param {Object} props - GlobalHeader props
 * @param {string|React.ReactNode} props.title - Header title
 * @param {string|React.ReactNode} props.subtitle - Optional subtitle
 * @param {Array} props.breadcrumbs - Breadcrumb items
 * @param {Function} props.onBreadcrumbPress - Breadcrumb press handler
 * @param {Array} props.actions - Action definitions
 * @param {string} props.currentRole - Current user role
 * @param {React.ReactNode} props.utilitySlot - Optional utility controls
 * @param {React.ReactNode} props.leadingSlot - Optional leading controls (e.g. logo)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const GlobalHeaderAndroid = ({
  title,
  subtitle,
  breadcrumbs,
  onBreadcrumbPress,
  actions = [],
  currentRole,
  utilitySlot,
  leadingSlot,
  accessibilityLabel,
  testID,
  ...rest
}) => {
  const { t } = useI18n();
  const { top: topInset } = useSafeAreaInsets();
  const { primaryActions, secondaryActions, hasBreadcrumbs } = useGlobalHeader({
    actions,
    currentRole,
    breadcrumbs,
  });
  const resolvedTitle = title || t('navigation.mainNavigation');
  const resolvedLabel = accessibilityLabel || t('navigation.header.title');

  const secondaryActionItems = useMemo(() => {
    return buildActionItems({ actions: secondaryActions, testID });
  }, [secondaryActions, testID]);

  const primaryActionItems = useMemo(() => {
    return buildActionItems({ actions: primaryActions, testID });
  }, [primaryActions, testID]);
  const hasUtilities = primaryActionItems.length > 0 || !!utilitySlot;

  return (
    <StyledHeader
      topInset={topInset}
      accessibilityRole="header"
      accessibilityLabel={resolvedLabel}
      testID={testID}
      {...rest}
    >
      <StyledHeaderRow>
        {leadingSlot ? <StyledLeadingSlot>{leadingSlot}</StyledLeadingSlot> : null}
        <StyledTitleGroup>
          {secondaryActionItems.length > 0 ? (
            <StyledActionsGroup>{secondaryActionItems}</StyledActionsGroup>
          ) : null}
          <StyledTitleBlock>
            {typeof resolvedTitle === 'string' ? (
              <Text variant="h3">{resolvedTitle}</Text>
            ) : (
              resolvedTitle
            )}
            {subtitle
              ? typeof subtitle === 'string'
                ? (
                  <Text variant="caption" color="text.secondary">
                    {subtitle}
                  </Text>
                )
                : subtitle
              : null}
          </StyledTitleBlock>
        </StyledTitleGroup>
        {hasUtilities ? (
          <StyledActionsGroup>
            {primaryActionItems}
            {utilitySlot ? <StyledUtilityGroup>{utilitySlot}</StyledUtilityGroup> : null}
          </StyledActionsGroup>
        ) : null}
      </StyledHeaderRow>
      {hasBreadcrumbs ? (
        <StyledBreadcrumbsRow>
          <Breadcrumbs
            items={breadcrumbs}
            onItemPress={onBreadcrumbPress}
            testID={testID ? `${testID}-breadcrumbs` : undefined}
            accessibilityLabel={t('navigation.breadcrumbs.title')}
          />
        </StyledBreadcrumbsRow>
      ) : null}
    </StyledHeader>
  );
};

export default GlobalHeaderAndroid;
