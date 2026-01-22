/**
 * useAuthFormLayout Hook
 * Shared behavior for AuthFormLayout component.
 * File: useAuthFormLayout.js
 */
import { useMemo } from 'react';
import { SIZES, SIZE_KEYS } from './types';

const normalizeSize = (size) => (SIZE_KEYS.includes(size) ? size : SIZES.MD);

const useAuthFormLayout = ({ size = SIZES.MD } = {}) => {
  const normalizedSize = useMemo(() => normalizeSize(size), [size]);

  return useMemo(
    () => ({
      size: normalizedSize,
    }),
    [normalizedSize]
  );
};

export default useAuthFormLayout;

