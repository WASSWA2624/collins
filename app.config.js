export default {
  expo: {
    name: "collins",
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
      output: "static",
      // PWA configuration
      name: "Collins",
      shortName: "Collins",
      description: "Collins",
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

