import type { ExpoConfig } from "@expo/config";

const defineConfig = (): ExpoConfig => ({
  name: "Task managment",
  slug: "task-managment",
  scheme: "task-managment",
  version: "1.0.0",
  orientation: "default",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#1F104A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.task.managment",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
    package: "com.task.managment",
    googleServicesFile:
      "/home/ahmad/Projects/task-managment-zart/apps/expo/google-services.json",
  },
  extra: {
    eas: {
      projectId: "120c6c7d-3a03-4a2f-a434-a5bd28a554b4",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    "./expo-plugins/with-modify-gradle.js",
    [
      "expo-build-properties",
      {
        android: {
          // compileSdkVersion: 31,
          // targetSdkVersion: 31,
          // buildToolsVersion: '31.0.0',
          enableProguardInReleaseBuilds: true,
        },
        // ios: {
        // deploymentTarget: '13.0',
        // },
      },
    ],
    [
      "expo-screen-orientation",
      {
        initialOrientation: "DEFAULT",
      },
    ],
  ],
});

export default defineConfig;
