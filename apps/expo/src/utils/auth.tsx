import { router } from "expo-router";
import type { z } from "zod";

import type { loginUserValidation } from "@acme/api/validations";

import { api } from "./api";
import { deleteToken, setToken } from "./session-store";

type LoginInputs = z.infer<typeof loginUserValidation>;

// magic link signIn
// export const signIn = async (loginInputs: LoginInputs) => {
// const signInUrl = `${getBaseUrl()}/api/auth/signin`;
// const redirectTo = Linking.createURL("/login");
// const result = await Browser.openAuthSessionAsync(
//   `${signInUrl}?expo-redirect=${encodeURIComponent(redirectTo)}`,
// );
// if (result.type !== "success") return;
// const url = Linking.parse(result.url);
// const sessionToken = String(url.queryParams?.session_token);
// if (!sessionToken) return;
// await setToken(sessionToken);
// };

export const useAuth = () => {
  const { data: session } = api.auth.getSession.useQuery();
  return session ?? null;
};

export const useSignIn = () => {
  const utils = api.useUtils();
  const { mutateAsync: signInMutation, isLoading: isSigningIn } =
    api.auth.signIn.useMutation();

  async function signIn(loginInputs: LoginInputs) {
    try {
      const result = await signInMutation(loginInputs);
      const sessionToken = String(result?.sessionToken);
      if (!sessionToken) return;

      await setToken(sessionToken);
      await utils.invalidate();
      router.replace("/(tabs)/tasks/");
    } catch (err) {
      console.error(err);
    }
  }

  return { signIn, isSigningIn };
};

export const useSignOut = () => {
  const utils = api.useUtils();
  const { mutateAsync: signOutMutation, isLoading: isSigningOut } =
    api.auth.signOut.useMutation();

  async function signOut() {
    try {
      await signOutMutation();
      router.replace("/signin/");
      await utils.invalidate();
      await deleteToken();
    } catch (err) {
      console.error(err);
    }
  }

  return { signOut, isSigningOut };
};
