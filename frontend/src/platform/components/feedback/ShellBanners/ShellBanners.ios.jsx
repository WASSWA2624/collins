/**
 * ShellBanners Component - iOS
 * Container for system banners
 * File: ShellBanners.ios.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import SystemBanner from '@platform/components/feedback/SystemBanner';
import { StyledContainer, StyledStack, StyledStackItem } from './ShellBanners.ios.styles';
import { STACK_SPACING } from './types';

/**
 * ShellBanners component for iOS
 * @param {Object} props - ShellBanners props
 */
const ShellBannersIOS = ({
  banners = [],
  accessibilityLabel,
  testID,
  ...rest
}) => {
  const { t } = useI18n();
  if (!banners.length) return null;

  const label = accessibilityLabel || t('shell.banners.surfaceLabel');

  return (
    <StyledContainer accessibilityLabel={label} testID={testID} {...rest}>
      <StyledStack>
        {banners.map((banner, index) => (
          <StyledStackItem
            key={banner.id}
            spacing={STACK_SPACING}
            isLast={index === banners.length - 1}
          >
            <SystemBanner {...banner} />
          </StyledStackItem>
        ))}
      </StyledStack>
    </StyledContainer>
  );
};

export default ShellBannersIOS;
