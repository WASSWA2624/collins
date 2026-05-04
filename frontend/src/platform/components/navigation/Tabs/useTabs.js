/**
 * Tabs Hook
 * Manages active tab state
 * File: useTabs.js
 */
import React from 'react';

/**
 * Hook for managing tabs state
 * @param {string} defaultActiveTab - Default active tab ID
 * @param {Function} onChange - Callback when tab changes
 */
const useTabs = ({ defaultActiveTab, onChange } = {}) => {
  const [activeTab, setActiveTab] = React.useState(defaultActiveTab || null);

  const handleTabChange = React.useCallback(
    (tabId) => {
      setActiveTab(tabId);
      if (onChange) {
        onChange(tabId);
      }
    },
    [onChange]
  );

  return {
    activeTab,
    setActiveTab: handleTabChange,
  };
};

export default useTabs;

