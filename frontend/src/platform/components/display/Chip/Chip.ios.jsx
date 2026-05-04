/**
 * Chip Component - iOS
 * Filter tags and removable items
 * File: Chip.ios.jsx
 */

import React from 'react';
import { StyledChip, StyledChipText, StyledRemoveButton } from './Chip.ios.styles';
import { useChip } from './useChip';
import { useI18n } from '@hooks';

/**
 * Chip component for iOS
 * @param {Object} props - Chip props
 * @param {string} props.variant - Chip variant (default, primary, outline)
 * @param {string} props.size - Chip size (small, medium, large)
 * @param {string|React.ReactNode} props.children - Chip content
 * @param {boolean} props.removable - Show remove button
 * @param {Function} props.onRemove - Remove handler
 * @param {Function} props.onPress - Press handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const ChipIOS = ({
  variant,
  size,
  children,
  removable = false,
  onRemove,
  onPress,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const chip = useChip({ variant, size, onPress, removable, onRemove });

  const handleRemove = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <StyledChip
      variant={chip.variant}
      size={chip.size}
      onPress={chip.onPress}
      disabled={!chip.isInteractive}
      accessibilityRole={chip.isInteractive ? 'button' : 'text'}
      accessibilityLabel={accessibilityLabel || children?.toString()}
      testID={testID}
      style={style}
      {...rest}
    >
      <StyledChipText variant={chip.variant} size={chip.size}>
        {children}
      </StyledChipText>
      {chip.isRemovable && chip.onRemove && (
        <StyledRemoveButton
          onPress={handleRemove}
          accessibilityRole="button"
          accessibilityLabel={t('common.remove')}
          testID={testID ? `${testID}-remove` : undefined}
        >
          <StyledChipText variant={chip.variant} size={chip.size}>×</StyledChipText>
        </StyledRemoveButton>
      )}
    </StyledChip>
  );
};

export default ChipIOS;

