/**
 * LoadingSpinner Web Styles
 * Indefinite horizontal thin bar: width by size, height theme.spacing.xs.
 * File: LoadingSpinner.web.styles.jsx
 */

import styled from 'styled-components';

/**
 * Get track height based on size
 * @param {string} size - Spinner size
 * @param {Object} theme - Theme object
 * @returns {string} Track height (px)
 */
const getBorderWidth = (size, theme) => {
  // Keep the spinner thin and theme-driven
  const heights = {
    small: theme.spacing.xs,
    medium: theme.spacing.xs,
    large: theme.spacing.xs,
  };
  return `${(heights[size] || heights.medium)}px`;
};

/**
 * Get spinner width based on size (horizontal bar)
 * @param {string} size - Spinner size
 * @param {Object} theme - Theme object
 * @returns {string} Spinner width (px)
 */
const getSpinnerDimension = (size, theme) => {
  const sizes = {
    small: theme.spacing.xl,
    medium: theme.spacing.xxl,
    large: theme.spacing.xxl + theme.spacing.md,
  };
  return `${sizes[size] || sizes.medium}px`;
};

/**
 * Get track color (fallback to theme)
 * @param {string} color - Custom color
 * @param {Object} theme - Theme object
 * @returns {string} Track color
 */
const getBorderColor = (color, theme) => {
  return color || theme.colors.background.tertiary;
};

/**
 * Get indicator color (fallback to theme primary)
 * @param {string} color - Custom color
 * @param {Object} theme - Theme object
 * @returns {string} Indicator color
 */
const getBorderTopColor = (color, theme) => {
  return color || theme.colors.primary;
};

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const StyledSpinner = styled.div.withConfig({
  displayName: 'StyledSpinner',
  componentId: 'StyledSpinner',
})`
  position: relative;
  width: ${({ size, theme }) => getSpinnerDimension(size, theme)};
  height: ${({ size, theme }) => getBorderWidth(size, theme)};
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -40%;
    height: 100%;
    width: 40%;
    border-radius: ${({ theme }) => theme.radius.full}px;
    background-color: ${({ color, theme }) => getBorderTopColor(color, theme)};
    animation: indeterminate 1.2s ease-in-out infinite;
  }

  @keyframes indeterminate {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(350%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
      left: 0;
      width: 100%;
    }
  }
`;

export { StyledContainer, StyledSpinner, getBorderWidth, getSpinnerDimension, getBorderColor, getBorderTopColor };



