/**
 * useUserAccountMenu
 * Shared account-menu state and labels.
 * File: useUserAccountMenu.js
 */
import { useCallback, useMemo, useState } from 'react';
import { useAuth } from '@hooks';
import useFacilityContextIndicator from '@platform/components/feedback/FacilityContextIndicator/useFacilityContextIndicator';

const toTitleCase = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());

const firstText = (...values) =>
  values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim() || null;

const getDisplayName = (user, fallback) => {
  const fullName = firstText(user?.fullName, user?.displayName, user?.name);
  if (fullName) return fullName;

  const combinedName = firstText([user?.firstName, user?.lastName].filter(Boolean).join(' '));
  return combinedName || firstText(user?.username, user?.email, user?.phoneNumber, user?.phone) || fallback;
};

const getContactLabel = (user, displayName) => {
  const contact = firstText(user?.email, user?.username, user?.phoneNumber, user?.phone);
  return contact && contact !== displayName ? contact : null;
};

const getFacilityOptionLabel = (option) =>
  firstText(option?.facility?.name, option?.facilityName, option?.displayName, option?.facilityId, option?.id);

const useUserAccountMenu = () => {
  const { user, logout } = useAuth();
  const {
    t,
    activeFacilityId,
    facilityOptions,
    facilityName,
    roleLabel,
    syncStatusKey,
    syncStatusLabel,
    hasFacilityChoices,
    handleFacilityChange,
  } = useFacilityContextIndicator();
  const [isOpen, setIsOpen] = useState(false);

  const displayName = useMemo(
    () => getDisplayName(user, t('navigation.header.accountMenu.fallbackName')),
    [t, user]
  );

  const contactLabel = useMemo(() => getContactLabel(user, displayName), [displayName, user]);

  const accountTypeLabel = useMemo(
    () => firstText(user?.accountType ? toTitleCase(user.accountType) : null, roleLabel),
    [roleLabel, user?.accountType]
  );

  const facilitySelectOptions = useMemo(
    () => {
      const options = facilityOptions.map((option) => ({
        label: getFacilityOptionLabel(option) || t('facilityContext.noFacility'),
        value: option.facilityId || option.id,
      }));
      return hasFacilityChoices
        ? [{ label: t('facilityContext.allFacilities'), value: '' }, ...options]
        : options;
    },
    [facilityOptions, hasFacilityChoices, t]
  );

  const toggleMenu = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsOpen(false);
    void logout();
  }, [logout]);

  const handleSelectFacility = useCallback(
    (facilityId) => {
      handleFacilityChange(facilityId);
      setIsOpen(false);
    },
    [handleFacilityChange]
  );

  return {
    t,
    user,
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
    openMenu,
    closeMenu,
    handleLogout,
    handleSelectFacility,
  };
};

export default useUserAccountMenu;
