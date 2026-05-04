/**
 * CRUD Model Factory
 * Shared normalization for CRUD features
 * File: crudModel.js
 */

const normalizeEntity = (value) => {
  if (!value || typeof value !== 'object') return null;
  return { ...value };
};

const normalizeEntityList = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map(normalizeEntity).filter(Boolean);
};

const createCrudModel = () => ({
  normalize: normalizeEntity,
  normalizeList: normalizeEntityList,
});

export { createCrudModel };
