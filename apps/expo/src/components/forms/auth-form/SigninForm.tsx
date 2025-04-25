import {
  AlertCircleIcon,
  Box,
  Button,
  ButtonSpinner,
  ButtonText,
  Center,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  Input,
  InputField,
  ScrollView,
  Text,
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { loginUserValidation } from "@acme/api/validations";

import { useAuth, useSignIn, useSignOut } from "~/utils/auth";

export const SigninForm = () => {
  const form = useForm<z.infer<typeof loginUserValidation>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginUserValidation),
    // reValidateMode: "onChange",
  });
  const session = useAuth();
  const { signIn, isSigningIn } = useSignIn();
  const { signOut, isSigningOut } = useSignOut();

  const onSubmit = async (data: z.infer<typeof loginUserValidation>) => {
    await signIn(data);
  };

  return (
    <Center bgColor="#7BC9EF" h="$full" w="$full">
      {/* <Box w="$full" $md-h="$full" bgColor="#7BC9EF" $md-w="$1/2" mt="-$8">
        <SignIn width={373} />
      </Box> */}

      <Text
        textAlign="center"
        color="$white"
        size="4xl"
        my="$7"
        fontFamily="$titan"
      >
        Sign In
      </Text>

      <Box w="$full" h={400} $md-h="$full" $md-w="$1/2">
        <Box
          borderTopRightRadius="$3xl"
          borderTopLeftRadius="$3xl"
          bg="$white"
          py="$10"
          px="$4"
          $md-my="auto"
        >
          <Center gap="$3" $md-my="auto" h="$full">
            <Text
              textAlign="center"
              color="#7BC9EF"
              fontFamily="$titan"
              size="4xl"
              mb="$6"
              $base-display="none"
              $lg-display="flex"
              h={50}
            >
              Sign In
            </Text>
            {session?.user?.id ? (
              <Button
                h="$12"
                w="$72"
                bgColor="#42B0ED"
                borderRadius="$lg"
                onPress={async () => await signOut()}
                isDisabled={isSigningOut}
              >
                <ButtonText color="$white">Sign Out</ButtonText>
                {isSigningOut && <ButtonSpinner ml="$4" />}
              </Button>
            ) : (
              <ScrollView p="$1">
                {/* Email */}
                <Box h="$20" w="$72">
                  <FormControl
                    size="md"
                    isInvalid={!!form.formState.errors.email?.message}
                    isRequired={true}
                  >
                    <Input>
                      <Controller
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                          <InputField
                            onChangeText={(val) => field.onChange(val)}
                            onBlur={field.onBlur}
                            type="text"
                            placeholder="Email"
                            value={field.value}
                          />
                        )}
                      />
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>
                        {form.formState.errors.email?.message}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                </Box>

                {/* Password */}
                <Box h="$16" w="$72">
                  <FormControl
                    size="md"
                    isInvalid={!!form.formState.errors.password?.message}
                    isRequired={true}
                  >
                    <Input>
                      <Controller
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                          <InputField
                            onChangeText={(val) => field.onChange(val)}
                            onBlur={field.onBlur}
                            type="password"
                            placeholder="Password"
                            value={field.value}
                          />
                        )}
                      />
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>
                        {form.formState.errors.password?.message}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                </Box>

                <Button
                  h="$12"
                  w="$72"
                  bgColor="#42B0ED"
                  borderRadius="$lg"
                  onPress={form.handleSubmit(onSubmit)}
                  my="$4"
                  isDisabled={isSigningIn}
                >
                  <ButtonText color="$white">Sign In</ButtonText>
                  {isSigningIn && <ButtonSpinner ml="$4" />}
                </Button>
              </ScrollView>
            )}
          </Center>
        </Box>
      </Box>
    </Center>
  );
};
