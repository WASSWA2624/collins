/**
 * Purchase Request Model Tests
 * File: purchase-request.model.test.js
 */
import { normalizePurchaseRequest, normalizePurchaseRequestList } from '@features/purchase-request';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('purchase-request.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizePurchaseRequest, normalizePurchaseRequestList);
  });
});
