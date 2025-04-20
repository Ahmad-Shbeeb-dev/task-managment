import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { VerificationCodeForm } from "~/components/forms/auth-form/VerificationCodeForm";

export default function ResetPasswordScreen() {
  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerShown: false }} />
      <VerificationCodeForm />
    </SafeAreaView>
  );
}
