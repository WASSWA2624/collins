/**
 * useShellBanners Hook
 * Produces banner data for global shell status messaging.
 * File: useShellBanners.js
 */
import { useMemo } from 'react';
import useI18n from '@hooks/useI18n';
import useNetworkBanner from '@hooks/useNetworkBanner';
import { MAINTENANCE_MESSAGE, MAINTENANCE_MODE } from '@config/feature.flags';
import { BANNER_VARIANTS } from '@utils/shellBanners';

const useShellBanners = ({ maintenanceMode, maintenanceMessage } = {}) => {
  const { t } = useI18n();
  const { isOffline, isLowQuality, showOnlineBanner } = useNetworkBanner();
  const isMaintenanceMode = maintenanceMode ?? MAINTENANCE_MODE;
  const maintenanceText = maintenanceMessage ?? MAINTENANCE_MESSAGE;

  return useMemo(() => {
    const banners = [];

    if (isMaintenanceMode) {
      banners.push({
        id: 'maintenance',
        variant: BANNER_VARIANTS.MAINTENANCE,
        title: t('shell.banners.maintenance.title'),
        message: maintenanceText || t('shell.banners.maintenance.message'),
        accessibilityLabel: t('shell.banners.maintenance.accessibilityLabel'),
      });
    }

    if (isOffline) {
      banners.push({
        id: 'offline',
        variant: BANNER_VARIANTS.OFFLINE,
        title: t('shell.banners.offline.title'),
        message: t('shell.banners.offline.message'),
        accessibilityLabel: t('shell.banners.offline.accessibilityLabel'),
      });
    }

    if (isLowQuality) {
      banners.push({
        id: 'low-quality',
        variant: BANNER_VARIANTS.LOW_QUALITY,
        title: t('shell.banners.lowQuality.title'),
        message: t('shell.banners.lowQuality.message'),
        accessibilityLabel: t('shell.banners.lowQuality.accessibilityLabel'),
      });
    }

    if (showOnlineBanner) {
      banners.push({
        id: 'online',
        variant: BANNER_VARIANTS.ONLINE,
        title: t('shell.banners.online.title'),
        message: t('shell.banners.online.message'),
        accessibilityLabel: t('shell.banners.online.accessibilityLabel'),
      });
    }

    return banners;
  }, [isLowQuality, isMaintenanceMode, isOffline, maintenanceText, showOnlineBanner, t]);
};

export default useShellBanners;
