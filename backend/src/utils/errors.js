export class AppError extends Error {
  constructor(message, status = 500, errors = [], meta = undefined) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.errors = errors;
    this.meta = meta;
  }
}

export const badRequest = (message, errors = []) => new AppError(message, 400, errors);
export const unauthorized = (message = 'Authentication required') => new AppError(message, 401);
export const forbidden = (message = 'Insufficient permissions') => new AppError(message, 403);
export const notFound = (message = 'Resource not found') => new AppError(message, 404);
export const conflict = (message = 'Conflict detected', errors = [], meta = undefined) => new AppError(message, 409, errors, meta);
export const reviewerRequired = (message = 'Reviewer action is required', errors = [], meta = undefined) => new AppError(message, 422, errors, meta);
