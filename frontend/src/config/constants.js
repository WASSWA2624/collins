/**
 * Application Constants
 * File: constants.js
 */

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const TIMEOUTS = {
  API_REQUEST: 30000,
  NETWORK_CHECK: 5000,
};

export const AUTH = {
  REGISTER_ROLES: ['admin'],
};

/** Key names for AI API keys in SecureStore (value never in Redux/logs). One per provider. */
export const VENTILATION_AI_API_KEY_STORAGE_KEY = 'VENTILATION_AI_API_KEY';
export const AI_API_KEY_CONFIGURED_ASYNC_KEY = 'ai_api_key_configured';
const AI_STORAGE_KEY = (provider) => `VENTILATION_AI_API_KEY_${provider.toUpperCase()}`;
const AI_CONFIGURED_KEY = (provider) => `ai_api_key_configured_${provider}`;

/** Default AI provider and model (AI SDK v5–style provider/model). */
export const AI_DEFAULT_PROVIDER_ID = 'openai';
export const AI_DEFAULT_MODEL_ID = 'gpt-4o-mini';

/**
 * AI providers and models (aligned with AI SDK v5 provider/model concepts).
 * Each provider: id, labelKey (i18n), storageKey (SecureStore), configuredAsyncKey, models[].
 * Current client implements OpenAI only; other providers require client extension.
 */
export const AI_PROVIDERS = Object.freeze([
  {
    id: 'openai',
    labelKey: 'settings.ai.providers.openai',
    storageKey: VENTILATION_AI_API_KEY_STORAGE_KEY,
    configuredAsyncKey: AI_API_KEY_CONFIGURED_ASYNC_KEY,
    models: Object.freeze([
      { id: 'gpt-4o-mini', labelKey: 'settings.ai.models.gpt-4o-mini' },
      { id: 'gpt-4o', labelKey: 'settings.ai.models.gpt-4o' },
      { id: 'gpt-4-turbo', labelKey: 'settings.ai.models.gpt-4-turbo' },
      { id: 'gpt-4', labelKey: 'settings.ai.models.gpt-4' },
      { id: 'gpt-3.5-turbo', labelKey: 'settings.ai.models.gpt-3.5-turbo' },
    ]),
  },
  {
    id: 'anthropic',
    labelKey: 'settings.ai.providers.anthropic',
    storageKey: AI_STORAGE_KEY('anthropic'),
    configuredAsyncKey: AI_CONFIGURED_KEY('anthropic'),
    models: Object.freeze([
      { id: 'claude-sonnet-4-20250514', labelKey: 'settings.ai.models.claude-sonnet-4' },
      { id: 'claude-3-5-sonnet-20241022', labelKey: 'settings.ai.models.claude-3-5-sonnet' },
      { id: 'claude-3-5-haiku-20241022', labelKey: 'settings.ai.models.claude-3-5-haiku' },
      { id: 'claude-3-opus-20240229', labelKey: 'settings.ai.models.claude-3-opus' },
    ]),
  },
  {
    id: 'google',
    labelKey: 'settings.ai.providers.google',
    storageKey: AI_STORAGE_KEY('google'),
    configuredAsyncKey: AI_CONFIGURED_KEY('google'),
    models: Object.freeze([
      { id: 'gemini-1.5-pro', labelKey: 'settings.ai.models.gemini-1.5-pro' },
      { id: 'gemini-1.5-flash', labelKey: 'settings.ai.models.gemini-1.5-flash' },
      { id: 'gemini-1.0-pro', labelKey: 'settings.ai.models.gemini-1.0-pro' },
    ]),
  },
  {
    id: 'groq',
    labelKey: 'settings.ai.providers.groq',
    storageKey: AI_STORAGE_KEY('groq'),
    configuredAsyncKey: AI_CONFIGURED_KEY('groq'),
    models: Object.freeze([
      { id: 'llama-3.3-70b-versatile', labelKey: 'settings.ai.models.llama-3.3-70b' },
      { id: 'llama-3.1-8b-instant', labelKey: 'settings.ai.models.llama-3.1-8b' },
      { id: 'mixtral-8x7b-32768', labelKey: 'settings.ai.models.mixtral-8x7b' },
    ]),
  },
  {
    id: 'mistral',
    labelKey: 'settings.ai.providers.mistral',
    storageKey: AI_STORAGE_KEY('mistral'),
    configuredAsyncKey: AI_CONFIGURED_KEY('mistral'),
    models: Object.freeze([
      { id: 'mistral-large-latest', labelKey: 'settings.ai.models.mistral-large' },
      { id: 'mistral-medium-latest', labelKey: 'settings.ai.models.mistral-medium' },
      { id: 'mistral-small-latest', labelKey: 'settings.ai.models.mistral-small' },
    ]),
  },
  {
    id: 'deepseek',
    labelKey: 'settings.ai.providers.deepseek',
    storageKey: AI_STORAGE_KEY('deepseek'),
    configuredAsyncKey: AI_CONFIGURED_KEY('deepseek'),
    models: Object.freeze([
      { id: 'deepseek-chat', labelKey: 'settings.ai.models.deepseek-chat' },
      { id: 'deepseek-reasoner', labelKey: 'settings.ai.models.deepseek-reasoner' },
    ]),
  },
  {
    id: 'cohere',
    labelKey: 'settings.ai.providers.cohere',
    storageKey: AI_STORAGE_KEY('cohere'),
    configuredAsyncKey: AI_CONFIGURED_KEY('cohere'),
    models: Object.freeze([
      { id: 'command-r-plus', labelKey: 'settings.ai.models.command-r-plus' },
      { id: 'command-r', labelKey: 'settings.ai.models.command-r' },
    ]),
  },
  {
    id: 'xai',
    labelKey: 'settings.ai.providers.xai',
    storageKey: AI_STORAGE_KEY('xai'),
    configuredAsyncKey: AI_CONFIGURED_KEY('xai'),
    models: Object.freeze([
      { id: 'grok-3', labelKey: 'settings.ai.models.grok-3' },
      { id: 'grok-3-mini', labelKey: 'settings.ai.models.grok-3-mini' },
    ]),
  },
]);

/** Models across all providers (for AssessmentScreen); use getModelsForProvider(providerId) for provider-scoped list. */
export const AI_MODELS = Object.freeze(
  AI_PROVIDERS.flatMap((p) => p.models.map((m) => ({ id: m.id, labelKey: m.labelKey, provider: p.id })))
);

/** Returns models for a provider (AI SDK v5–style). */
export const getModelsForProvider = (providerId) => {
  const p = AI_PROVIDERS.find((x) => x.id === providerId);
  return p ? [...p.models] : [];
};

/** Returns provider config by id. */
export const getAiProviderConfig = (providerId) => AI_PROVIDERS.find((x) => x.id === providerId) ?? null;

