import { errorResponse } from '../utils/apiResponse.js';

export const notFoundMiddleware = (req, res) => errorResponse(res, {
  status: 404,
  message: `Route not found: ${req.method} ${req.originalUrl}`,
});
