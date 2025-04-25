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
  HStack,
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  LockIcon,
  MailIcon,
  Pressable,
  ScrollView,
  Text,
  useColorMode,
  VStack,
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { loginUserValidation } from "@acme/api/validations";

import { useAuth, useSignIn, useSignOut } from "~/utils/auth";
import { useTheme } from "~/utils/ThemeProvider";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Define theme colors
  const bgColor = isDark ? "#111827" : "#F9FAFB";
  const cardBgColor = isDark ? "#1F2937" : "#FFFFFF";
  const primaryColor = "#3B82F6"; // Blue
  const primaryColorDark = "#2563EB";
  const borderColor = isDark ? "#4B5563" : "#E5E7EB";
  const textColor = isDark ? "#F9FAFB" : "#1F2937";
  const secondaryTextColor = isDark ? "#D1D5DB" : "#6B7280";
  const inputBgColor = isDark ? "#374151" : "#FFFFFF";

  const onSubmit = async (data: z.infer<typeof loginUserValidation>) => {
    await signIn(data);
  };

  return (
    <Center bg={bgColor} h="$full" w="$full">
      {/* <Box w="$full" $md-h="$full" bgColor="#7BC9EF" $md-w="$1/2" mt="-$8">
        <SignIn width={373} />
      </Box> */}

      <Box w="$full" h="$full" $md-h="$full" $md-w="$1/2">
        <Box
          h="$full"
          bg={cardBgColor}
          py="$8"
          px="$5"
          $md-my="auto"
          $md-borderRadius="$3xl"
        >
          <VStack space="lg" justifyContent="center" h="$full">
            <Text
              textAlign="center"
              color={primaryColor}
              fontFamily="$titan"
              size="4xl"
              mb="$6"
            >
              Sign In
            </Text>

            {session?.user?.id ? (
              <Box alignItems="center">
                <Button
                  h="$12"
                  w="$72"
                  bgColor={isDark ? primaryColor : primaryColorDark}
                  borderRadius="$lg"
                  onPress={async () => await signOut()}
                  isDisabled={isSigningOut}
                  shadowColor={isDark ? "transparent" : "$black"}
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.2}
                  shadowRadius={3}
                >
                  <ButtonText color="$white">Sign Out</ButtonText>
                  {isSigningOut && <ButtonSpinner ml="$4" />}
                </Button>
              </Box>
            ) : (
              <ScrollView>
                <VStack space="md" w="$full" alignItems="center">
                  {/* Email */}
                  <Box w="$80" maxWidth="100%">
                    <FormControl
                      size="md"
                      isInvalid={!!form.formState.errors.email?.message}
                      isRequired={true}
                      mb="$4"
                    >
                      <Text color={textColor} mb="$2" fontWeight="$medium">
                        Email
                      </Text>
                      <Input
                        size="md"
                        borderRadius="$lg"
                        borderColor={borderColor}
                        borderWidth="$1"
                        bgColor={inputBgColor}
                      >
                        <InputSlot pl="$3">
                          <InputIcon as={MailIcon} color={secondaryTextColor} />
                        </InputSlot>
                        <Controller
                          name="email"
                          control={form.control}
                          render={({ field }) => (
                            <InputField
                              onChangeText={(val) => field.onChange(val)}
                              onBlur={field.onBlur}
                              type="text"
                              placeholder="Enter your email"
                              value={field.value}
                              color={textColor}
                              pl="$2"
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
                  <Box w="$80" maxWidth="100%">
                    <FormControl
                      size="md"
                      isInvalid={!!form.formState.errors.password?.message}
                      isRequired={true}
                      mb="$4"
                    >
                      <Text color={textColor} mb="$2" fontWeight="$medium">
                        Password
                      </Text>
                      <Input
                        size="md"
                        borderRadius="$lg"
                        borderColor={borderColor}
                        borderWidth="$1"
                        bgColor={inputBgColor}
                      >
                        <InputSlot pl="$3">
                          <InputIcon as={LockIcon} color={secondaryTextColor} />
                        </InputSlot>
                        <Controller
                          name="password"
                          control={form.control}
                          render={({ field }) => (
                            <InputField
                              onChangeText={(val) => field.onChange(val)}
                              onBlur={field.onBlur}
                              type="password"
                              placeholder="Enter your password"
                              value={field.value}
                              color={textColor}
                              pl="$2"
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
                    w="$80"
                    maxWidth="100%"
                    bgColor={isDark ? primaryColor : primaryColorDark}
                    borderRadius="$lg"
                    onPress={form.handleSubmit(onSubmit)}
                    my="$4"
                    isDisabled={isSigningIn}
                    shadowColor={isDark ? "transparent" : "$black"}
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.2}
                    shadowRadius={3}
                  >
                    <ButtonText color="$white" fontWeight="$bold">
                      Sign In
                    </ButtonText>
                    {isSigningIn && <ButtonSpinner ml="$4" />}
                  </Button>
                </VStack>
              </ScrollView>
            )}
          </VStack>
        </Box>
      </Box>
    </Center>
  );
};
