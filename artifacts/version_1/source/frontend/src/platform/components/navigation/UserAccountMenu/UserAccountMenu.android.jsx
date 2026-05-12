/**
 * UserAccountMenu Component - Android
 * Compact avatar trigger for account, facility, sync status, and logout.
 * File: UserAccountMenu.android.jsx
 */
import React from 'react';
import { Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '@platform/components/display/Avatar';
import Text from '@platform/components/display/Text';
import useUserAccountMenu from './useUserAccountMenu';
import {
  StyledAccountMenu,
  StyledAvatarButton,
  StyledFacilityOption,
  StyledFacilityOptions,
  StyledFieldLabel,
  StyledFieldValue,
  StyledIdentityText,
  StyledInlineStatusDot,
  StyledLogoutButton,
  StyledMenuBackdrop,
  StyledMenuBody,
  StyledMenuDivider,
  StyledMenuField,
  StyledMenuHeader,
  StyledMenuRoot,
  StyledMenuSurface,
  StyledStatusDot,
  StyledStatusValue,
} from './UserAccountMenu.android.styles';

const UserAccountMenuAndroid = ({ testID = 'user-account-menu', style }) => {
  const {
    t,
    displayName,
    contactLabel,
    accountTypeLabel,
    activeFacilityId,
    facilityName,
    facilitySelectOptions,
    hasFacilityChoices,
    syncStatusKey,
    syncStatusLabel,
    isOpen,
    toggleMenu,
    closeMenu,
    handleLogout,
    handleSelectFacility,
  } = useUserAccountMenu();
  const { top: topInset } = useSafeAreaInsets();
  const menuLabel = t('navigation.header.accountMenu.accessibilityLabel', { name: displayName });

  return (
    <StyledAccountMenu testID={testID} style={style}>
      <StyledAvatarButton
        onPress={toggleMenu}
        accessibilityRole="button"
        accessibilityLabel={menuLabel}
        accessibilityState={{ expanded: isOpen }}
        testID={`${testID}-trigger`}
        android_ripple={{ color: 'rgba(0, 122, 255, 0.12)', borderless: false }}
      >
        <Avatar size="small" name={displayName} accessibilityLabel={menuLabel} testID={`${testID}-avatar`} />
        <StyledStatusDot $status={syncStatusKey} />
      </StyledAvatarButton>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={closeMenu}>
        <StyledMenuRoot>
          <StyledMenuBackdrop
            onPress={closeMenu}
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
          />
          <StyledMenuSurface $topOffset={(topInset || 0) + 64} testID={`${testID}-menu`}>
            <StyledMenuHeader>
              <Avatar size="medium" name={displayName} accessibilityLabel={displayName} />
              <StyledIdentityText>
                <Text variant="label" numberOfLines={1}>
                  {displayName}
                </Text>
                {contactLabel ? (
                  <Text variant="caption" color="text.secondary" numberOfLines={1}>
                    {contactLabel}
                  </Text>
                ) : null}
              </StyledIdentityText>
            </StyledMenuHeader>

            <StyledMenuBody>
              <StyledMenuField>
                <StyledFieldLabel>
                  <Text variant="caption" color="text.tertiary">
                    {t('navigation.header.accountMenu.accountType')}
                  </Text>
                </StyledFieldLabel>
                <StyledFieldValue>
                  <Text variant="label" numberOfLines={1}>
                    {accountTypeLabel}
                  </Text>
                </StyledFieldValue>
              </StyledMenuField>

              <StyledMenuField>
                <StyledFieldLabel>
                  <Text variant="caption" color="text.tertiary">
                    {t('facilityContext.activeFacility')}
                  </Text>
                </StyledFieldLabel>
                {hasFacilityChoices ? (
                  <StyledFacilityOptions>
                    {facilitySelectOptions.map((option) => (
                      <StyledFacilityOption
                        key={option.value}
                        onPress={() => handleSelectFacility(option.value)}
                        accessibilityRole="menuitem"
                        accessibilityLabel={option.label}
                        $selected={option.value ? option.value === activeFacilityId : !activeFacilityId}
                        testID={`${testID}-facility-${option.value || 'all'}`}
                      >
                        <Text variant="label" numberOfLines={1}>
                          {option.label}
                        </Text>
                      </StyledFacilityOption>
                    ))}
                  </StyledFacilityOptions>
                ) : (
                  <StyledFieldValue>
                    <Text variant="label" numberOfLines={1}>
                      {facilityName}
                    </Text>
                  </StyledFieldValue>
                )}
              </StyledMenuField>

              <StyledMenuField>
                <StyledFieldLabel>
                  <Text variant="caption" color="text.tertiary">
                    {t('facilityContext.syncStatus')}
                  </Text>
                </StyledFieldLabel>
                <StyledStatusValue>
                  <StyledInlineStatusDot $status={syncStatusKey} />
                  <Text variant="label" numberOfLines={1}>
                    {syncStatusLabel}
                  </Text>
                </StyledStatusValue>
              </StyledMenuField>
            </StyledMenuBody>

            <StyledMenuDivider />
            <StyledLogoutButton
              onPress={handleLogout}
              accessibilityRole="menuitem"
              accessibilityLabel={t('auth.logout')}
              testID={`${testID}-logout`}
            >
              <Text variant="label" color="error">
                {t('auth.logout')}
              </Text>
            </StyledLogoutButton>
          </StyledMenuSurface>
        </StyledMenuRoot>
      </Modal>
    </StyledAccountMenu>
  );
};

export default UserAccountMenuAndroid;
