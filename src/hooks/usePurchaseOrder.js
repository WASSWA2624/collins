/**
 * usePurchaseOrder Hook
 * File: usePurchaseOrder.js
 */
import useCrud from '@hooks/useCrud';
import {
  createPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrder,
  listPurchaseOrders,
  updatePurchaseOrder,
} from '@features/purchase-order';

const usePurchaseOrder = () =>
  useCrud({
    list: listPurchaseOrders,
    get: getPurchaseOrder,
    create: createPurchaseOrder,
    update: updatePurchaseOrder,
    remove: deletePurchaseOrder,
  });

export default usePurchaseOrder;
