import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "@expo-google-fonts/poppins";

import { TRPCProvider } from "~/utils/api";
import { ThemeProvider } from "~/utils/ThemeProvider";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  return (
    <TRPCProvider>
      <ThemeProvider>
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
      </ThemeProvider>
    </TRPCProvider>
  );
}
