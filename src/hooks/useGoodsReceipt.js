/**
 * useGoodsReceipt Hook
 * File: useGoodsReceipt.js
 */
import useCrud from '@hooks/useCrud';
import {
  createGoodsReceipt,
  deleteGoodsReceipt,
  getGoodsReceipt,
  listGoodsReceipts,
  updateGoodsReceipt,
} from '@features/goods-receipt';

const useGoodsReceipt = () =>
  useCrud({
    list: listGoodsReceipts,
    get: getGoodsReceipt,
    create: createGoodsReceipt,
    update: updateGoodsReceipt,
    remove: deleteGoodsReceipt,
  });

export default useGoodsReceipt;
