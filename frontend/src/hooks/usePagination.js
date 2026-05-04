/**
 * usePagination Hook
 * Generic pagination state helper.
 * File: usePagination.js
 */
import { useCallback, useMemo, useState } from 'react';

const toPositiveInt = (value, fallback) => {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  const floored = Math.floor(n);
  return floored >= 1 ? floored : fallback;
};

const usePagination = ({ initialPage = 1, initialLimit = 20 } = {}) => {
  const initial = useMemo(
    () => ({
      page: toPositiveInt(initialPage, 1),
      limit: toPositiveInt(initialLimit, 20),
    }),
    [initialPage, initialLimit]
  );

  const [page, setPageState] = useState(initial.page);
  const [limit, setLimitState] = useState(initial.limit);

  const setPage = useCallback((next) => {
    setPageState((prev) =>
      toPositiveInt(typeof next === 'function' ? next(prev) : next, prev)
    );
  }, []);

  const setLimit = useCallback((next) => {
    setLimitState((prev) =>
      toPositiveInt(typeof next === 'function' ? next(prev) : next, prev)
    );
  }, []);

  const reset = useCallback(() => {
    setPageState(initial.page);
    setLimitState(initial.limit);
  }, [initial.page, initial.limit]);

  const nextPage = useCallback(() => {
    setPageState((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPageState((prev) => Math.max(1, prev - 1));
  }, []);

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    reset,
  };
};

export default usePagination;

