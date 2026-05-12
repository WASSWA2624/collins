/**
 * Hook Render Helper
 * File: render-hook.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';

const renderHookResult = (useHook, options = {}) => {
  const { wrapper: Wrapper } = options;
  let result;
  const TestComponent = ({ onResult }) => {
    const hookResult = useHook();
    React.useEffect(() => {
      onResult(hookResult);
    }, [hookResult, onResult]);
    return null;
  };

  const element = <TestComponent onResult={(value) => (result = value)} />;
  render(Wrapper ? <Wrapper>{element}</Wrapper> : element);
  return result;
};

export { renderHookResult };
