/**
 * useInventoryStock Hook
 * File: useInventoryStock.js
 */
import useCrud from '@hooks/useCrud';
import {
  createInventoryStock,
  deleteInventoryStock,
  getInventoryStock,
  listInventoryStocks,
  updateInventoryStock,
} from '@features/inventory-stock';

const useInventoryStock = () =>
  useCrud({
    list: listInventoryStocks,
    get: getInventoryStock,
    create: createInventoryStock,
    update: updateInventoryStock,
    remove: deleteInventoryStock,
  });

export default useInventoryStock;
