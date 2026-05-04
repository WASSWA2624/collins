/**
 * Hook Render Helper
 * File: render-hook.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';

const renderHookResult = (useHook) => {
  let result;
  const TestComponent = ({ onResult }) => {
    const hookResult = useHook();
    React.useEffect(() => {
      onResult(hookResult);
    }, [hookResult, onResult]);
    return null;
  };

  render(<TestComponent onResult={(value) => (result = value)} />);
  return result;
};

export { renderHookResult };
