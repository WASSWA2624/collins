/**
 * ShellBanners Component - Web
 * Container for system banners
 * File: ShellBanners.web.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import SystemBanner from '@platform/components/feedback/SystemBanner';
import { StyledContainer, StyledStack, StyledStackItem } from './ShellBanners.web.styles';
import { STACK_SPACING } from './types';

/**
 * ShellBanners component for Web
 * @param {Object} props - ShellBanners props
 * @param {Array} props.banners - Banner configurations
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 */
const ShellBannersWeb = ({
  banners = [],
  accessibilityLabel,
  testID,
  className,
  ...rest
}) => {
  const { t } = useI18n();
  if (!banners.length) return null;

  const label = accessibilityLabel || t('shell.banners.surfaceLabel');

  return (
    <StyledContainer
      role="region"
      aria-label={label}
      data-testid={testID}
      testID={testID}
      className={className}
      {...rest}
    >
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

export default ShellBannersWeb;
