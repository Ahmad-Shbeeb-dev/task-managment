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
    buildNumber: "1.0.0",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
    package: "com.task.managment",
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? // for cloud EAS build
      "/home/ahmad/Projects/MERN-Task3/apps/expo/google-services.json", // for local
    versionCode: 1,
    permissions: [
      "android.permission.RECEIVE_BOOT_COMPLETED",
      "android.permission.VIBRATE",
    ],
  },
  extra: {
    eas: {
      projectId: "5dbe962e-e536-4d15-b448-d118c89124bc",
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
    [
      "expo-notifications",
      {
        icon: "./assets/icon.png",
        color: "#ffffff",
        sounds: [],
      },
    ],
  ],
  notification: {
    icon: "./assets/icon.png",
    color: "#ffffff",
    iosDisplayInForeground: true,
    androidMode: "default",
    androidCollapsedTitle: "Task Management",
  },
});

export default defineConfig;
