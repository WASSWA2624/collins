/**
 * Chip Component - Web
 * Filter tags and removable items
 * File: Chip.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import { StyledChip, StyledChipText, StyledRemoveButton } from './Chip.web.styles';

// 5. Component-specific hook (relative import)
import { useChip } from './useChip';

/**
 * Chip component for Web
 * @param {Object} props - Chip props
 * @param {string} props.variant - Chip variant (default, primary, outline)
 * @param {string} props.size - Chip size (small, medium, large)
 * @param {string|React.ReactNode} props.children - Chip content
 * @param {boolean} props.removable - Show remove button
 * @param {Function} props.onRemove - Remove handler
 * @param {Function} props.onPress - Press handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const ChipWeb = ({
  variant,
  size,
  children,
  removable = false,
  onRemove,
  onPress,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const handleClick = onPress || rest.onClick;
  const chip = useChip({ variant, size, onPress: handleClick, removable, onRemove });

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
      onClick={chip.onPress}
      disabled={!chip.isInteractive}
      role={chip.isInteractive ? 'button' : 'text'}
      aria-label={accessibilityLabel || children?.toString()}
      data-testid={testID}
      className={className}
      style={style}
      {...rest}
    >
      <StyledChipText variant={chip.variant} size={chip.size}>
        {children}
      </StyledChipText>
      {chip.isRemovable && chip.onRemove && (
        <StyledRemoveButton
          onClick={handleRemove}
          role="button"
          aria-label={t('common.remove')}
          data-testid={testID ? `${testID}-remove` : undefined}
        >
          <StyledChipText variant={chip.variant} size={chip.size}>×</StyledChipText>
        </StyledRemoveButton>
      )}
    </StyledChip>
  );
};

export default ChipWeb;

