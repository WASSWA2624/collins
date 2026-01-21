/**
 * ICU Stay Usecase Tests
 * File: icu-stay.usecase.test.js
 */
import { listIcuStays, getIcuStay, createIcuStay, updateIcuStay, deleteIcuStay } from '@features/icu-stay';
import { icuStayApi } from '@features/icu-stay/icu-stay.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/icu-stay/icu-stay.api', () => ({
  icuStayApi: {
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

describe('icu-stay.usecase', () => {
  beforeEach(() => {
    icuStayApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    icuStayApi.get.mockResolvedValue({ data: { id: '1' } });
    icuStayApi.create.mockResolvedValue({ data: { id: '1' } });
    icuStayApi.update.mockResolvedValue({ data: { id: '1' } });
    icuStayApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listIcuStays,
      get: getIcuStay,
      create: createIcuStay,
      update: updateIcuStay,
      remove: deleteIcuStay,
    },
    { queueRequestIfOffline }
  );
});
