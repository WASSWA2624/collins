/**
 * useInventoryItem Hook
 * File: useInventoryItem.js
 */
import useCrud from '@hooks/useCrud';
import {
  createInventoryItem,
  deleteInventoryItem,
  getInventoryItem,
  listInventoryItems,
  updateInventoryItem,
} from '@features/inventory-item';

const useInventoryItem = () =>
  useCrud({
    list: listInventoryItems,
    get: getInventoryItem,
    create: createInventoryItem,
    update: updateInventoryItem,
    remove: deleteInventoryItem,
  });

export default useInventoryItem;
