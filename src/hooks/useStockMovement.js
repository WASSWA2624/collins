/**
 * useStockMovement Hook
 * File: useStockMovement.js
 */
import useCrud from '@hooks/useCrud';
import {
  createStockMovement,
  deleteStockMovement,
  getStockMovement,
  listStockMovements,
  updateStockMovement,
} from '@features/stock-movement';

const useStockMovement = () =>
  useCrud({
    list: listStockMovements,
    get: getStockMovement,
    create: createStockMovement,
    update: updateStockMovement,
    remove: deleteStockMovement,
  });

export default useStockMovement;
