/**
 * Supplier Use Cases
 * File: supplier.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { supplierApi } from './supplier.api';
import { normalizeSupplier, normalizeSupplierList } from './supplier.model';
import { parseSupplierId, parseSupplierListParams, parseSupplierPayload } from './supplier.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listSuppliers = async (params = {}) =>
  execute(async () => {
    const parsed = parseSupplierListParams(params);
    const response = await supplierApi.list(parsed);
    return normalizeSupplierList(response.data);
  });

const getSupplier = async (id) =>
  execute(async () => {
    const parsedId = parseSupplierId(id);
    const response = await supplierApi.get(parsedId);
    return normalizeSupplier(response.data);
  });

const createSupplier = async (payload) =>
  execute(async () => {
    const parsed = parseSupplierPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SUPPLIERS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeSupplier(parsed);
    }
    const response = await supplierApi.create(parsed);
    return normalizeSupplier(response.data);
  });

const updateSupplier = async (id, payload) =>
  execute(async () => {
    const parsedId = parseSupplierId(id);
    const parsed = parseSupplierPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SUPPLIERS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeSupplier({ id: parsedId, ...parsed });
    }
    const response = await supplierApi.update(parsedId, parsed);
    return normalizeSupplier(response.data);
  });

const deleteSupplier = async (id) =>
  execute(async () => {
    const parsedId = parseSupplierId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.SUPPLIERS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeSupplier({ id: parsedId });
    }
    const response = await supplierApi.remove(parsedId);
    return normalizeSupplier(response.data);
  });

export { listSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier };
