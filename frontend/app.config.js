import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const ENVIRONMENT_ALIASES = {
  dev: "development",
  local: "development",
  prod: "production",
};

const SUPPORTED_ENVIRONMENTS = new Set(["development", "production"]);

const normalizeEnvironment = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
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
  const event = String(lifecycleEvent || "").toLowerCase();
  if (!event) return null;

  if (
    event.includes("eas")
    || event.includes("apk")
    || event.includes("build")
    || event.includes("export")
    || event.includes("release")
  ) {
    return "production";
  }

  if (
    event.includes("start")
    || event.includes("android")
    || event.includes("ios")
    || event.includes("web")
    || event.includes("test")
    || event.includes("debug")
  ) {
    return "development";
  }

  return null;
};

const parseEnvFile = (content) => {
  const values = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^(['"])(.*)\1$/, "$2");

    if (key) values[key] = value;
  }

  return values;
};

const resolveEnvironmentName = () => (
  normalizeEnvironment(process.env.COLLINS_ENV)
  || normalizeEnvironment(process.env.APP_ENV)
  || getEnvironmentFromArgs(process.argv)
  || getEnvironmentFromLifecycle(process.env.npm_lifecycle_event)
  || normalizeEnvironment(process.env.EXPO_PUBLIC_APP_ENVIRONMENT)
  || normalizeEnvironment(process.env.NODE_ENV)
  || "development"
);

const readEnvironmentFile = (environment) => {
  const envFile = path.resolve(process.cwd(), `.env.${environment}`);
  return {
    envFile,
    values: existsSync(envFile) ? parseEnvFile(readFileSync(envFile, "utf8")) : {},
  };
};

const wasLoadedFromAnotherManagedEnvFile = ({
  currentValue,
  environment,
  key,
  managedValuesByEnvironment,
  nextValue,
}) => {
  if (currentValue === undefined || currentValue === nextValue) return false;

  return Object.entries(managedValuesByEnvironment).some(
    ([candidateEnvironment, values]) =>
      candidateEnvironment !== environment && values[key] === currentValue
  );
};

const loadEnvironmentFile = () => {
  const environment = resolveEnvironmentName();
  const lifecycleEnvironment = getEnvironmentFromLifecycle(process.env.npm_lifecycle_event);
  const managedValuesByEnvironment = Object.fromEntries(
    [...SUPPORTED_ENVIRONMENTS].map((candidateEnvironment) => [
      candidateEnvironment,
      readEnvironmentFile(candidateEnvironment).values,
    ])
  );
  const { envFile, values } = readEnvironmentFile(environment);

  for (const [key, value] of Object.entries(values)) {
    if (
      process.env[key] === undefined
      || wasLoadedFromAnotherManagedEnvFile({
        currentValue: process.env[key],
        environment,
        key,
        managedValuesByEnvironment,
        nextValue: value,
      })
    ) {
      process.env[key] = value;
    }
  }

  const npmForcedProduction = process.env.NODE_ENV === "production"
    && lifecycleEnvironment === environment
    && environment !== "production";

  if (!process.env.NODE_ENV || npmForcedProduction) {
    process.env.NODE_ENV = environment;
  }

  process.env.EXPO_PUBLIC_APP_ENVIRONMENT ??= environment;

  return { environment, envFile };
};

loadEnvironmentFile();

export default {
  expo: {
    name: "AI Vent",
    slug: "collins",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./public/logos/logo-light.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./public/logos/logo-light.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.collins.ios",
    },
    android: {
      versionCode: 4,
      adaptiveIcon: {
        foregroundImage: "./public/logos/logo-light.png",
        backgroundColor: "#ffffff",
      },
      package: "com.collins.android",
    },
    web: {
      favicon: "./public/logos/logo-light.png",
      manifest: "./public/manifest.json",
      bundler: "metro",
      output: "single",
      // PWA configuration
      name: "AI Vent",
      shortName: "AI Vent",
      description: "AI Vent ventilation decision support",
      themeColor: "#007AFF",
      backgroundColor: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      startUrl: "/",
      scope: "/",
    },
    plugins: ["expo-router", "expo-secure-store"],
    scheme: "collins",
    extra: {
      eas: {
        projectId: "d96f59ef-ed62-4008-98f2-f4a2ac762cbd",
      },
    },
  },
};

