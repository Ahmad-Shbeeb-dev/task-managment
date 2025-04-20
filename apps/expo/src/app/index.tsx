import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, Stack } from "expo-router";

import { useAuth } from "~/utils/auth";
import { WelcomeScreen } from "~/components/WelcomeScreen";

export default function Index() {
  const session = useAuth();

  if (session?.user) return <Redirect href="/home/" />;

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
