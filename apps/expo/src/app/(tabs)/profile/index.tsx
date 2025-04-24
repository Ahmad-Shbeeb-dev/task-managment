import { useState } from "react";
import {
  AlertCircleIcon,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Button,
  ButtonText,
  Card,
  CheckIcon,
  EditIcon,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  HStack,
  Icon,
  Input,
  InputField,
  SafeAreaView,
  ScrollView,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
  VStack,
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { updateUserValidation } from "@acme/api/validations";

import { api } from "~/utils/api";
import { useAuth, useSignOut } from "~/utils/auth";
import { useTheme } from "~/utils/ThemeProvider";
import { Header } from "~/components/Header";

export default function ProfileScreen() {
  const { signOut } = useSignOut();
  const [isEdit, setIsEdit] = useState(false);
  const session = useAuth();
  const utils = api.useUtils();
  const { theme } = useTheme();
  const toast = useToast();

  const isDark = theme === "dark";

  const { data: userProfile, isLoading } = api.user.getUserProfile.useQuery();

  const { mutate: updateUserMutation } = api.user.updateUser.useMutation({
    onSuccess: () => {
      void utils.invalidate();
      setIsEdit(false);

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={"toast-" + id} action="success" variant="accent">
            <VStack space="xs">
              <ToastTitle>Success</ToastTitle>
              <ToastDescription>Profile updated successfully!</ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    },
    onError: (error) => {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={"toast-" + id} action="error" variant="accent">
            <VStack space="xs">
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>
                Failed to update profile: {error.message}
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    },
  });
  // Handle refresh (pull to refresh)
  const handleRefresh = () => {
    void utils.user.getUserProfile.invalidate();
  };

  const form = useForm<z.infer<typeof updateUserValidation>>({
    values: {
      email: userProfile?.email ?? "",
      name: userProfile?.name ?? "",
    },
    resolver: zodResolver(updateUserValidation),
  });

  const onSubmit = async (data: z.infer<typeof updateUserValidation>) => {
    updateUserMutation({ ...data });
  };

  if (isLoading) {
    return (
      <SafeAreaView>
        <VStack
          h="$full"
          p="$4"
          space="md"
          bgColor={isDark ? "#111827" : "$white"}
        >
          <Box
            h="$32"
            w="$full"
            bgColor={isDark ? "#6B7280" : "$lightgray"}
            borderRadius="$lg"
          />
          <VStack space="md" alignItems="center">
            <Box
              h="$24"
              w="$24"
              borderRadius="$full"
              bgColor={isDark ? "#6B7280" : "$lightgray"}
            />
            <Box h="$6" w="$32" bgColor={isDark ? "#6B7280" : "$lightgray"} />
            <Box h="$4" w="$24" bgColor={isDark ? "#6B7280" : "$lightgray"} />
          </VStack>
          <VStack space="md" mt="$6">
            <Box h="$5" w="$12" bgColor={isDark ? "#6B7280" : "$lightgray"} />
            <Box
              h="$10"
              w="$full"
              bgColor={isDark ? "#6B7280" : "$lightgray"}
            />
            <Box h="$5" w="$12" bgColor={isDark ? "#6B7280" : "$lightgray"} />
            <Box
              h="$10"
              w="$full"
              bgColor={isDark ? "#6B7280" : "$lightgray"}
            />
          </VStack>
        </VStack>
      </SafeAreaView>
    );
  }

  if (!userProfile) return null;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#111827" : "#F9FAFB",
      }}
    >
      <Header onRefresh={handleRefresh} />

      <ScrollView
        w="$full"
        bgColor={isDark ? "#111827" : "#F9FAFB"}
        flex={1}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 40,
        }}
      >
        <Card
          mx="$5"
          my="$5"
          borderRadius="$lg"
          bgColor={isDark ? "#1F2937" : "$white"}
          borderColor={isDark ? "#4B5563" : "#E5E7EB"}
          borderWidth="$1"
          softShadow="2"
        >
          <Box
            bgColor={isDark ? "#1F2937" : "$white"}
            borderBottomWidth="$0"
            px="$5"
            py="$3"
            borderTopLeftRadius="$lg"
            borderTopRightRadius="$lg"
          >
            <HStack justifyContent="space-between" alignItems="center">
              <Heading size="md" color={isDark ? "#F9FAFB" : "#1F2937"}>
                Profile
              </Heading>
              <Button
                rounded="$full"
                p="$2"
                bgColor={isDark ? "#374151" : "$backgroundLight100"}
                $active-bgColor={isDark ? "#4B5563" : "$backgroundLight200"}
                h="$10"
                w="$10"
                onPress={() => {
                  if (isEdit) {
                    void form.handleSubmit(onSubmit)();
                  } else {
                    setIsEdit(true);
                  }
                }}
              >
                {isEdit ? (
                  <Icon as={CheckIcon} color={isDark ? "#F9FAFB" : "#292D32"} />
                ) : (
                  <Icon as={EditIcon} color={isDark ? "#F9FAFB" : "#292D32"} />
                )}
              </Button>
            </HStack>
          </Box>
          <Box p="$5">
            <VStack space="md" alignItems="center" mb="$4">
              <Avatar
                size="xl"
                borderRadius="$full"
                w="$24"
                h="$24"
                bgColor={session?.user.image ? "transparent" : "#F0AB25"}
              >
                <AvatarImage
                  alt="Profile"
                  source={session?.user.image ?? undefined}
                />
                <AvatarFallbackText>
                  {session?.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallbackText>
              </Avatar>
              <VStack space="xs" alignItems="center">
                <Text
                  size="xl"
                  fontWeight="$semibold"
                  color={isDark ? "#F9FAFB" : "#1F2937"}
                >
                  {userProfile.name}
                </Text>
                <Text color={isDark ? "#D1D5DB" : "#6B7280"} size="sm">
                  Role: {userProfile.role.toLowerCase()}
                </Text>
              </VStack>
            </VStack>

            <VStack space="md" w="$full">
              <FormControl
                isInvalid={!!form.formState.errors.name?.message}
                isRequired={true}
                w="$full"
              >
                <FormControlLabel>
                  <FormControlLabelText color={isDark ? "#F9FAFB" : "#1F2937"}>
                    Name
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <InputField
                        editable={isEdit}
                        color={
                          isEdit
                            ? isDark
                              ? "#F9FAFB"
                              : "#1F2937"
                            : isDark
                              ? "#D1D5DB"
                              : "#6B7280"
                        }
                        bgColor={isDark ? "#374151" : "$white"}
                        borderColor={isDark ? "#4B5563" : "#E5E7EB"}
                        onChangeText={(val) => field.onChange(val)}
                        onBlur={field.onBlur}
                        value={field.value}
                      />
                    )}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {form.formState.errors.name?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl
                isInvalid={!!form.formState.errors.email?.message}
                isRequired={true}
                w="$full"
              >
                <FormControlLabel>
                  <FormControlLabelText color={isDark ? "#F9FAFB" : "#1F2937"}>
                    Email
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <InputField
                        editable={isEdit}
                        color={
                          isEdit
                            ? isDark
                              ? "#F9FAFB"
                              : "#1F2937"
                            : isDark
                              ? "#D1D5DB"
                              : "#6B7280"
                        }
                        bgColor={isDark ? "#374151" : "$white"}
                        borderColor={isDark ? "#4B5563" : "#E5E7EB"}
                        onChangeText={(val) => field.onChange(val)}
                        onBlur={field.onBlur}
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
            </VStack>
          </Box>
        </Card>

        {/* Sign Out */}
        <Box alignItems="center" w="$full" my="$4">
          <Button
            h="$12"
            w="$56"
            bgColor="#3B82F6"
            borderRadius="$lg"
            onPress={() => signOut()}
          >
            <ButtonText color="$white">Sign Out</ButtonText>
          </Button>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
