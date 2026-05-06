/**
 * UserAccountMenu Component - Web
 * Compact avatar trigger for account, facility, sync status, and logout.
 * File: UserAccountMenu.web.jsx
 */
import React, { useEffect, useRef } from 'react';
import Avatar from '@platform/components/display/Avatar';
import Text from '@platform/components/display/Text';
import useUserAccountMenu from './useUserAccountMenu';
import {
  StyledAccountMenu,
  StyledAvatarButton,
  StyledFacilitySelect,
  StyledFieldLabel,
  StyledFieldValue,
  StyledIdentityText,
  StyledInlineStatusDot,
  StyledLogoutButton,
  StyledMenu,
  StyledMenuBody,
  StyledMenuDivider,
  StyledMenuField,
  StyledMenuHeader,
  StyledStatusDot,
  StyledStatusValue,
  StyledTruncatedText,
} from './UserAccountMenu.web.styles';

const UserAccountMenuWeb = ({ testID = 'user-account-menu', className, style }) => {
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
  const rootRef = useRef(null);
  const menuLabel = t('navigation.header.accountMenu.accessibilityLabel', { name: displayName });

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  return (
    <StyledAccountMenu ref={rootRef} className={className} style={style} data-testid={testID}>
      <StyledAvatarButton
        type="button"
        onClick={toggleMenu}
        aria-label={menuLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        data-testid={`${testID}-trigger`}
      >
        <Avatar size="small" name={displayName} accessibilityLabel={menuLabel} testID={`${testID}-avatar`} />
        <StyledStatusDot $status={syncStatusKey} aria-hidden="true" />
      </StyledAvatarButton>

      {isOpen ? (
        <StyledMenu role="menu" aria-label={t('common.userMenu')} data-testid={`${testID}-menu`}>
          <StyledMenuHeader>
            <Avatar size="medium" name={displayName} accessibilityLabel={displayName} />
            <StyledIdentityText>
              <StyledTruncatedText>
                <Text variant="label">{displayName}</Text>
              </StyledTruncatedText>
              {contactLabel ? (
                <StyledTruncatedText>
                  <Text variant="caption" color="text.secondary">
                    {contactLabel}
                  </Text>
                </StyledTruncatedText>
              ) : null}
            </StyledIdentityText>
          </StyledMenuHeader>

          <StyledMenuBody>
            <StyledMenuField>
              <StyledFieldLabel>{t('navigation.header.accountMenu.accountType')}</StyledFieldLabel>
              <StyledFieldValue title={accountTypeLabel}>{accountTypeLabel}</StyledFieldValue>
            </StyledMenuField>

            <StyledMenuField>
              <StyledFieldLabel>{t('facilityContext.activeFacility')}</StyledFieldLabel>
              {hasFacilityChoices ? (
                <StyledFacilitySelect
                  aria-label={t('facilityContext.facilitySelectLabel')}
                  value={activeFacilityId || ''}
                  onChange={(event) => handleSelectFacility(event.target.value)}
                  data-testid={`${testID}-facility-select`}
                >
                  {facilitySelectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </StyledFacilitySelect>
              ) : (
                <StyledFieldValue title={facilityName}>{facilityName}</StyledFieldValue>
              )}
            </StyledMenuField>

            <StyledMenuField>
              <StyledFieldLabel>{t('facilityContext.syncStatus')}</StyledFieldLabel>
              <StyledStatusValue>
                <StyledInlineStatusDot $status={syncStatusKey} aria-hidden="true" />
                {syncStatusLabel}
              </StyledStatusValue>
            </StyledMenuField>
          </StyledMenuBody>

          <StyledMenuDivider />
          <StyledLogoutButton type="button" onClick={handleLogout} role="menuitem" data-testid={`${testID}-logout`}>
            {t('auth.logout')}
          </StyledLogoutButton>
        </StyledMenu>
      ) : null}
    </StyledAccountMenu>
  );
};

export default UserAccountMenuWeb;
