/**
 * TextArea Hook
 * Reuses TextField logic (validation, debounce)
 * File: useTextArea.js
 */

import useTextField from '../TextField/useTextField';

/**
 * Custom hook for TextArea component logic
 * @param {Object} props - TextArea props (same contract subset as TextField)
 * @returns {Object} TextArea state and handlers
 */
const useTextArea = (props) => {
  return useTextField({ ...props, type: 'text', autoFormat: false });
};

export default useTextArea;


