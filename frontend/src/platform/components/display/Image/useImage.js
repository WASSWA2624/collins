/**
 * Image Hook
 * Shared logic for Image component (loading, error handling)
 * File: useImage.js
 */
import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for Image component logic
 * @param {Object} props - Image props
 * @param {string|Object} props.source - Image source URI (string or {uri: string})
 * @param {string|Object} props.fallback - Fallback image source
 * @param {Function} props.onLoad - Load handler
 * @param {Function} props.onError - Error handler
 * @returns {Object} Image state and handlers
 */
const useImage = ({ source, fallback, onLoad, onError }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSource, setCurrentSource] = useState(source);
  const currentSourceRef = useRef(source);
  const fallbackRef = useRef(fallback);
  const onErrorRef = useRef(onError);

  // Update refs when props change
  useEffect(() => {
    fallbackRef.current = fallback;
    onErrorRef.current = onError;
  }, [fallback, onError]);

  // Update currentSource when source prop changes
  useEffect(() => {
    if (source !== currentSourceRef.current) {
      currentSourceRef.current = source;
      setCurrentSource(source);
      setIsLoading(true);
      setHasError(false);
    }
  }, [source]);

  const handleLoad = useCallback(
    (event) => {
      setIsLoading(false);
      setHasError(false);
      if (onLoad) {
        onLoad(event);
      }
    },
    [onLoad]
  );

  const handleError = useCallback(
    (event) => {
      setIsLoading(false);
      // Normalize sources for comparison (handle both string and object formats)
      const prevSource = currentSourceRef.current;
      const prevSourceStr = typeof prevSource === 'string' ? prevSource : prevSource?.uri;
      const fallback = fallbackRef.current;
      const fallbackStr = typeof fallback === 'string' ? fallback : fallback?.uri;
      
      if (fallback && prevSourceStr !== fallbackStr) {
        // Switch to fallback synchronously
        currentSourceRef.current = fallback;
        setCurrentSource(fallback);
        setHasError(false);
        setIsLoading(true);
        if (onErrorRef.current) {
          onErrorRef.current(event);
        }
      } else {
        setHasError(true);
        if (onErrorRef.current) {
          onErrorRef.current(event);
        }
      }
    },
    []
  );

  return {
    isLoading,
    hasError,
    currentSource,
    handleLoad,
    handleError,
  };
};

export default useImage;

