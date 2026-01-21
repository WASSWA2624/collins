/**
 * Formulary Item Usecase Tests
 * File: formulary-item.usecase.test.js
 */
import {
  listFormularyItems,
  getFormularyItem,
  createFormularyItem,
  updateFormularyItem,
  deleteFormularyItem,
} from '@features/formulary-item';
import { formularyItemApi } from '@features/formulary-item/formulary-item.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/formulary-item/formulary-item.api', () => ({
  formularyItemApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('formulary-item.usecase', () => {
  beforeEach(() => {
    formularyItemApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    formularyItemApi.get.mockResolvedValue({ data: { id: '1' } });
    formularyItemApi.create.mockResolvedValue({ data: { id: '1' } });
    formularyItemApi.update.mockResolvedValue({ data: { id: '1' } });
    formularyItemApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listFormularyItems,
      get: getFormularyItem,
      create: createFormularyItem,
      update: updateFormularyItem,
      remove: deleteFormularyItem,
    },
    { queueRequestIfOffline }
  );
});
