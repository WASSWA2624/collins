/**
 * Button Hook
 * Shared logic for Button component
 * File: useButton.js
 */
import { useCallback, useState } from 'react';
import { STATES } from './types';

/**
 * Custom hook for Button component logic
 * @param {Object} props - Button props
 * @param {Function} props.onPress - Press handler
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @returns {Object} Button state and handlers
 */
const useButton = ({ onPress, disabled = false, loading = false }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = useCallback(() => {
    if (!disabled && !loading) {
      setIsPressed(true);
    }
  }, [disabled, loading]);

  const handlePressOut = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handlePress = useCallback(
    (event) => {
      if (disabled || loading) {
        return;
      }
      if (onPress) {
        onPress(event);
      }
    },
    [onPress, disabled, loading]
  );

  const getState = useCallback(() => {
    if (loading) return STATES.LOADING;
    if (disabled) return STATES.DISABLED;
    if (isPressed) return STATES.ACTIVE;
    return STATES.DEFAULT;
  }, [loading, disabled, isPressed]);

  return {
    isPressed,
    state: getState(),
    handlePress,
    handlePressIn,
    handlePressOut,
  };
};

export default useButton;

