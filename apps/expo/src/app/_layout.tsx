import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "@expo-google-fonts/poppins";

import { useFonts } from "expo-font";
import {
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import { TitanOne_400Regular } from "@expo-google-fonts/titan-one";
import { config as defaultConfig } from "@gluestack-ui/config"; // Optional if you want to use default theme
import { createConfig, GluestackUIProvider } from "@gluestack-ui/themed";

import { TRPCProvider } from "~/utils/api";

const config = createConfig({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    fonts: {
      heading: "Poppins_600SemiBold", // Heading component uses this by default
      body: "Poppins_400Regular", // Text component uses this by default
      // mono: "monospace",
      titan: "TitanOne_400Regular",
    },
    // fontSizes: {
    //   ...defaultConfig.tokens.fontSizes,
    //   newFontSize: 120,
    // },
    // ... other tokens
  },
});
// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  // can be used to change the theme of the app
  // const [theme, setTheme] = useState<"dark" | "light">('light');

  const [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
    TitanOne_400Regular,
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <TRPCProvider>
      <GluestackUIProvider config={config}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
            <StatusBar />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </GluestackUIProvider>
    </TRPCProvider>
  );
}
