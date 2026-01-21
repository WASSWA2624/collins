/**
 * useStockAdjustment Hook
 * File: useStockAdjustment.js
 */
import useCrud from '@hooks/useCrud';
import {
  createStockAdjustment,
  deleteStockAdjustment,
  getStockAdjustment,
  listStockAdjustments,
  updateStockAdjustment,
} from '@features/stock-adjustment';

const useStockAdjustment = () =>
  useCrud({
    list: listStockAdjustments,
    get: getStockAdjustment,
    create: createStockAdjustment,
    update: updateStockAdjustment,
    remove: deleteStockAdjustment,
  });

export default useStockAdjustment;
