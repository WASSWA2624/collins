export const successResponse = (res, { status = 200, message = 'OK', data = null, meta = undefined } = {}) => {
  const payload = { success: true, message, data };
  const requestId = res.req?.id;
  const mergedMeta = { ...(meta || {}) };
  if (requestId) mergedMeta.requestId = requestId;
  if (Object.keys(mergedMeta).length > 0) payload.meta = mergedMeta;
  return res.status(status).json(payload);
};

export const errorResponse = (res, {
  status = 500,
  message = 'Internal server error',
  errors = [],
  meta = undefined,
} = {}) => {
  const requestId = res.req?.id;
  const mergedMeta = { ...(meta || {}) };
  if (requestId) mergedMeta.requestId = requestId;

  return res.status(status).json({
    success: false,
    message,
    errors,
    ...(Object.keys(mergedMeta).length > 0 ? { meta: mergedMeta } : {}),
  });
};

export const plannedResponse = (res, featureName) => successResponse(res, {
  status: 202,
  message: `${featureName} endpoint registered; implementation is planned for the next backend phase.`,
  data: { planned: true, featureName },
});
