/**
 * usePurchaseRequest Hook
 * File: usePurchaseRequest.js
 */
import useCrud from '@hooks/useCrud';
import {
  createPurchaseRequest,
  deletePurchaseRequest,
  getPurchaseRequest,
  listPurchaseRequests,
  updatePurchaseRequest,
} from '@features/purchase-request';

const usePurchaseRequest = () =>
  useCrud({
    list: listPurchaseRequests,
    get: getPurchaseRequest,
    create: createPurchaseRequest,
    update: updatePurchaseRequest,
    remove: deletePurchaseRequest,
  });

export default usePurchaseRequest;
