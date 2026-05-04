export const successResponse = (res, { status = 200, message = 'OK', data = null, meta = undefined } = {}) => {
  const payload = { success: true, message, data };
  if (meta !== undefined) payload.meta = meta;
  return res.status(status).json(payload);
};

export const errorResponse = (res, { status = 500, message = 'Internal server error', errors = [] } = {}) => {
  return res.status(status).json({ success: false, message, errors });
};

export const plannedResponse = (res, featureName) => successResponse(res, {
  status: 202,
  message: `${featureName} endpoint registered; implementation is planned for the next backend phase.`,
  data: { planned: true, featureName },
});
