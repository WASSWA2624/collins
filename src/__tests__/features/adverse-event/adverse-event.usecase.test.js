/**
 * Adverse Event Usecase Tests
 * File: adverse-event.usecase.test.js
 */
import {
  listAdverseEvents,
  getAdverseEvent,
  createAdverseEvent,
  updateAdverseEvent,
  deleteAdverseEvent,
} from '@features/adverse-event';
import { adverseEventApi } from '@features/adverse-event/adverse-event.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/adverse-event/adverse-event.api', () => ({
  adverseEventApi: {
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

describe('adverse-event.usecase', () => {
  beforeEach(() => {
    adverseEventApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    adverseEventApi.get.mockResolvedValue({ data: { id: '1' } });
    adverseEventApi.create.mockResolvedValue({ data: { id: '1' } });
    adverseEventApi.update.mockResolvedValue({ data: { id: '1' } });
    adverseEventApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listAdverseEvents,
      get: getAdverseEvent,
      create: createAdverseEvent,
      update: updateAdverseEvent,
      remove: deleteAdverseEvent,
    },
    { queueRequestIfOffline }
  );
});
