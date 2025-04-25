import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";

import { getToken } from "~/utils/session-store";
import { LoadingSpinner } from "~/components/LoadingSpinner";

export default function Index() {
  useLayoutEffect(() => {
    const getTokenAsync = async () => {
      const secureToken = await getToken();
      if (secureToken) {
        router.replace("/tasks/");
      } else {
        router.replace("/(auth)/signin/");
      }
    };
    void getTokenAsync();
  }, []);

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_right",
          statusBarColor: "#1F2937",
        }}
      />
      <LoadingSpinner />
    </SafeAreaView>
  );
}
