/**
 * CRUD Model Tests
 * File: crudModel.test.js
 */
import { createCrudModel } from '@utils/crudModel';

describe('crudModel', () => {
  it('normalizes entities and lists', () => {
    const model = createCrudModel();
    expect(model.normalize(null)).toBeNull();
    expect(model.normalize({ id: 1, name: 'Test' })).toEqual({ id: 1, name: 'Test' });
    expect(model.normalizeList(null)).toEqual([]);
    expect(model.normalizeList([{ id: 1 }, null, { id: 2 }])).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });
});
