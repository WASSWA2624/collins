/**
 * Shared option helpers for Select variants.
 */

const normalizeToken = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

const toSearchValues = (option) =>
  [option?.label, option?.value, option?.searchText, option?.keywords]
    .flat()
    .filter((value) => value !== null && value !== undefined);

const optionMatchesQuery = (option, query) => {
  const normalizedQuery = normalizeToken(query);
  if (!normalizedQuery) return true;

  return toSearchValues(option).some((entry) =>
    normalizeToken(entry).includes(normalizedQuery)
  );
};

const optionExactlyMatchesQuery = (option, query) => {
  const normalizedQuery = normalizeToken(query);
  if (!normalizedQuery) return false;

  return toSearchValues(option).some(
    (entry) => normalizeToken(entry) === normalizedQuery
  );
};

const getOptionIcon = (option) => option?.icon || null;

export { getOptionIcon, optionExactlyMatchesQuery, optionMatchesQuery };
