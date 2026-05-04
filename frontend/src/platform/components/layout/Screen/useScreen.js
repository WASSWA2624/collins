/**
 * useScreen Hook
 * Shared logic for the Screen primitive
 * File: useScreen.js
 */

import React from 'react';
import { BACKGROUNDS, PADDING } from './types';

/**
 * @param {Object} params
 * @param {boolean} params.scroll
 * @param {boolean} params.safeArea
 * @param {string} params.padding
 * @param {string} params.background
 * @param {string} params.accessibilityLabel
 * @param {string} params.testID
 */
const useScreen = ({
  scroll,
  safeArea,
  padding,
  background,
  accessibilityLabel,
  testID,
}) => {
  return React.useMemo(() => {
    const resolvedPadding = Object.values(PADDING).includes(padding) ? padding : PADDING.MD;
    const resolvedBackground = Object.values(BACKGROUNDS).includes(background)
      ? background
      : BACKGROUNDS.DEFAULT;

    const computedA11yLabel =
      accessibilityLabel || (typeof testID === 'string' && testID.length > 0 ? testID : undefined);

    return {
      scroll: !!scroll,
      safeArea: safeArea !== false,
      padding: resolvedPadding,
      background: resolvedBackground,
      accessibilityLabel: computedA11yLabel,
    };
  }, [scroll, safeArea, padding, background, accessibilityLabel, testID]);
};

export default useScreen;


