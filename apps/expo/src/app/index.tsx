import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";

import { useAuth } from "~/utils/auth";
import { WelcomeScreen } from "~/components/WelcomeScreen";

export default function Index() {
  const session = useAuth();

  useLayoutEffect(() => {
    if (session?.user) {
      router.replace("/tasks/");
    }
  }, [session?.user]);

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_right",
          statusBarColor: "#7BC9EF",
        }}
      />
      <WelcomeScreen />
    </SafeAreaView>
  );
}
