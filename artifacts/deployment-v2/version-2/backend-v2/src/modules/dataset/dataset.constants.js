export const UNSAFE_DATASET_SOURCE_TYPE_PATTERN = /(^|[^a-z0-9])(demo|sample|seed|fixture|test|training)([^a-z0-9]|$)/i;

export const UNSAFE_DATASET_SOURCE_TYPE_MESSAGE = 'Demo, sample, seed, test, fixture, or existing training sources cannot enter approved dataset flows.';
