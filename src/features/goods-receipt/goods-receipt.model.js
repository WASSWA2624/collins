/**
 * Goods Receipt Model
 * File: goods-receipt.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeGoodsReceipt = (value) => normalize(value);
const normalizeGoodsReceiptList = (value) => normalizeList(value);

export { normalizeGoodsReceipt, normalizeGoodsReceiptList };
