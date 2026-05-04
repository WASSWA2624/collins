/**
 * CRUD Test Assertions
 * File: crud-assertions.js
 */

const expectIdParser = (parseId) => {
  expect(parseId('1')).toBe('1');
  expect(parseId(2)).toBe(2);
};

const expectPayloadParser = (parsePayload) => {
  expect(parsePayload({ name: 'value' })).toEqual({ name: 'value' });
  expect(parsePayload()).toEqual({});
};

const expectListParamsParser = (parseListParams) => {
  expect(parseListParams({ page: 1, limit: 10 })).toEqual({ page: 1, limit: 10 });
  expect(parseListParams()).toEqual({});
};

const expectModelNormalizers = (normalize, normalizeList) => {
  expect(normalize(null)).toBeNull();
  expect(normalize({ id: '1' })).toEqual({ id: '1' });
  expect(normalizeList(null)).toEqual([]);
  expect(normalizeList([{ id: '1' }, null, { id: '2' }])).toEqual([{ id: '1' }, { id: '2' }]);
};

export { expectIdParser, expectPayloadParser, expectListParamsParser, expectModelNormalizers };
