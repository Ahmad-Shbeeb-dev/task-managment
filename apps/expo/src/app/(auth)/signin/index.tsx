import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { SigninForm } from "~/components/forms/auth-form/SigninForm";

export default function SinginScreen() {
  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_right",
          statusBarColor: "#00000060",
          statusBarTranslucent: true,
        }}
      />
      <SigninForm />
    </SafeAreaView>
  );
}
