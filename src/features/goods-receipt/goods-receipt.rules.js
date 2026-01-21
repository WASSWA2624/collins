/**
 * Goods Receipt Rules
 * File: goods-receipt.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseGoodsReceiptId = (value) => parseId(value);
const parseGoodsReceiptPayload = (value) => parsePayload(value);
const parseGoodsReceiptListParams = (value) => parseListParams(value);

export { parseGoodsReceiptId, parseGoodsReceiptPayload, parseGoodsReceiptListParams };
