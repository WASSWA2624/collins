/**
 * Lab Panel Usecase Tests
 * File: lab-panel.usecase.test.js
 */
import { listLabPanels, getLabPanel, createLabPanel, updateLabPanel, deleteLabPanel } from '@features/lab-panel';
import { labPanelApi } from '@features/lab-panel/lab-panel.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/lab-panel/lab-panel.api', () => ({
  labPanelApi: {
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

describe('lab-panel.usecase', () => {
  beforeEach(() => {
    labPanelApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    labPanelApi.get.mockResolvedValue({ data: { id: '1' } });
    labPanelApi.create.mockResolvedValue({ data: { id: '1' } });
    labPanelApi.update.mockResolvedValue({ data: { id: '1' } });
    labPanelApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listLabPanels,
      get: getLabPanel,
      create: createLabPanel,
      update: updateLabPanel,
      remove: deleteLabPanel,
    },
    { queueRequestIfOffline }
  );
});
