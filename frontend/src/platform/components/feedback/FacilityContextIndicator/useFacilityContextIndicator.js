import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFacilityOptionsForUser } from '@config/accessControl';
import { actions as authActions } from '@store/slices/auth.slice';
import {
  selectActiveFacility,
  selectIsOnline,
  selectIsSyncing,
  selectNetworkQuality,
  selectUser,
} from '@store/selectors';
import { useI18n } from '@hooks';
import { NETWORK_QUALITY } from '@utils/networkQuality';

const toTitleCase = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());

const getFacilityName = (facility) =>
  facility?.name ||
  facility?.facility?.name ||
  facility?.facilityName ||
  facility?.displayName ||
  null;

const getFacilityId = (facility) => facility?.facilityId || facility?.id || null;

const getSyncStatusKey = ({ isOnline, isSyncing, networkQuality }) => {
  if (isSyncing) return 'syncing';
  if (!isOnline) return 'offline';
  if (networkQuality === NETWORK_QUALITY.LOW) return 'unstable';
  return 'online';
};

const useFacilityContextIndicator = () => {
  const dispatch = useDispatch();
  const { t } = useI18n();
  const user = useSelector(selectUser);
  const activeFacility = useSelector(selectActiveFacility);
  const isOnline = useSelector(selectIsOnline);
  const isSyncing = useSelector(selectIsSyncing);
  const networkQuality = useSelector(selectNetworkQuality);

  const facilityOptions = useMemo(() => getFacilityOptionsForUser(user), [user]);
  const activeFacilityId = getFacilityId(activeFacility);
  const facilityName = getFacilityName(activeFacility) || t('facilityContext.noFacility');
  const roles = Array.isArray(activeFacility?.roles) ? activeFacility.roles : [];
  const roleLabel = roles.length > 0
    ? roles.map(toTitleCase).join(', ')
    : t('facilityContext.noRole');
  const syncStatusKey = getSyncStatusKey({ isOnline, isSyncing, networkQuality });
  const syncStatusLabel = t(`facilityContext.status.${syncStatusKey}`);

  const handleFacilityChange = useCallback((facilityId) => {
    dispatch(authActions.setActiveFacilityId(facilityId));
  }, [dispatch]);

  return {
    t,
    activeFacility,
    activeFacilityId,
    facilityOptions,
    facilityName,
    roleLabel,
    syncStatusKey,
    syncStatusLabel,
    hasFacilityChoices: facilityOptions.length > 1,
    handleFacilityChange,
  };
};

export default useFacilityContextIndicator;
