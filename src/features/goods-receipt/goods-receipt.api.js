/**
 * Goods Receipt API
 * File: goods-receipt.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const goodsReceiptApi = createCrudApi(endpoints.GOODS_RECEIPTS);

export { goodsReceiptApi };
