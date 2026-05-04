/**
 * CRUD Usecase Test Helpers
 * File: crud-usecase-runner.js
 */
const runCrudUsecaseTests = (
  {
    list,
    get,
    create,
    update,
    remove,
    extraActions = [],
  },
  {
    queueRequestIfOffline,
    payload = { name: 'value' },
    id = '1',
    listParams = { page: 1 },
  }
) => {
  it('runs online usecases', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    if (list) {
      await expect(list(listParams)).resolves.toBeDefined();
      await expect(list()).resolves.toBeDefined();
    }
    if (get) {
      await expect(get(id)).resolves.toBeDefined();
    }
    if (create) {
      await expect(create(payload)).resolves.toBeDefined();
    }
    if (update) {
      await expect(update(id, payload)).resolves.toBeDefined();
    }
    if (remove) {
      await expect(remove(id)).resolves.toBeDefined();
    }

    for (const action of extraActions) {
      await expect(action.fn(...(action.args || []))).resolves.toBeDefined();
    }
  });

  it('queues offline writes', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    if (create) {
      await expect(create(payload)).resolves.toEqual(payload);
    }
    if (update) {
      await expect(update(id, payload)).resolves.toEqual({ id, ...payload });
    }
    if (remove) {
      await expect(remove(id)).resolves.toEqual({ id });
    }
  });

  if (get) {
    it('rejects invalid ids', async () => {
      await expect(get(null)).rejects.toBeDefined();
    });
  }
};

export { runCrudUsecaseTests };
