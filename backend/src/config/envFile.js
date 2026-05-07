import path from 'node:path';
import dotenv from 'dotenv';

const ENVIRONMENT_ALIASES = {
  dev: 'development',
  local: 'development',
  prod: 'production',
};

const SUPPORTED_ENVIRONMENTS = new Set(['development', 'production']);

const normalizeEnvironment = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return null;

  const environment = ENVIRONMENT_ALIASES[normalized] || normalized;
  return SUPPORTED_ENVIRONMENTS.has(environment) ? environment : null;
};

const getEnvironmentFromArgs = (argv = []) => {
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const inlineMatch = /^--(?:app-)?env(?:ironment)?=(.+)$/i.exec(arg);
    if (inlineMatch) return normalizeEnvironment(inlineMatch[1]);

    if (/^--(?:app-)?env(?:ironment)?$/i.test(arg)) {
      return normalizeEnvironment(argv[index + 1]);
    }
  }

  return null;
};

const getEnvironmentFromLifecycle = (lifecycleEvent) => {
  const event = String(lifecycleEvent || '').toLowerCase();
  if (!event) return null;

  if (event.includes('migrate:deploy') || event === 'start' || event === 'prestart') {
    return 'production';
  }

  if (
    event.includes('dev')
    || event.includes('test')
    || event.includes('migrate')
    || event.includes('studio')
    || event.includes('seed')
    || event.includes('generate')
  ) {
    return 'development';
  }

  return null;
};

export const resolveEnvironmentName = ({
  source = process.env,
  argv = process.argv,
  fallback = 'development',
} = {}) => (
  normalizeEnvironment(source.COLLINS_ENV)
  || normalizeEnvironment(source.APP_ENV)
  || getEnvironmentFromArgs(argv)
  || normalizeEnvironment(source.NODE_ENV)
  || getEnvironmentFromLifecycle(source.npm_lifecycle_event)
  || fallback
);

export const getEnvironmentFileName = (environment) => `.env.${environment}`;

export const loadEnvironmentFile = ({
  projectRoot,
  source = process.env,
  argv = process.argv,
} = {}) => {
  const environment = resolveEnvironmentName({ source, argv });
  const fileName = getEnvironmentFileName(environment);
  const filePath = path.join(projectRoot || process.cwd(), fileName);

  dotenv.config({ path: filePath, quiet: true });
  source.NODE_ENV ||= environment;

  return { environment, fileName, filePath };
};
