/**
 * Training API (stub)
 * Reserved for future remote content sync/augmentation.
 * File: training.api.js
 */
 
const TRAINING_API_ERROR_CODES = Object.freeze({
  NOT_IMPLEMENTED: 'TRAINING_ONLINE_CONTENT_NOT_IMPLEMENTED',
});
 
const syncTrainingContentApi = async () => {
  return { ok: false, errorCode: TRAINING_API_ERROR_CODES.NOT_IMPLEMENTED };
};
 
export { TRAINING_API_ERROR_CODES, syncTrainingContentApi };

