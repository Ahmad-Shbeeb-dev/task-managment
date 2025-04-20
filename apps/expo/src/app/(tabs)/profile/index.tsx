import { useState } from "react";
import { useAssets } from "expo-asset";
import {
  AlertCircleIcon,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Button,
  ButtonText,
  Center,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  HStack,
  ImageBackground,
  Input,
  InputField,
  SafeAreaView,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import Check from "assets/icons/check.svg";
import Edit from "assets/icons/edit.svg";
import ProfileChildCard from "assets/profile-child-card.svg";
import { differenceInYears } from "date-fns";
import { nanoid } from "nanoid/non-secure";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { updateUserValidation } from "@acme/api/validations";

import { api } from "~/utils/api";
import { useAuth, useSignOut } from "~/utils/auth";

export default function ProfileScreen() {
  const { signOut } = useSignOut();
  const [isEdit, setIsEdit] = useState(false);
  const session = useAuth();
  const utils = api.useUtils();

  const { data: User } = api.child.getUserChildren.useQuery({
    userId: session?.user.id ?? "",
  });

  const [assets] = useAssets([require("assets/profile-header.png")]);

  const { mutate: updateUserMutation } = api.user.updateUser.useMutation({
    onSuccess: () => {
      utils.invalidate();
      setIsEdit(false);
    },
  });

  const form = useForm<z.infer<typeof updateUserValidation>>({
    values: {
      email: User?.email ?? "",
    },
    resolver: zodResolver(updateUserValidation),
  });

  const onSubmit = async (data: z.infer<typeof updateUserValidation>) => {
    updateUserMutation({ ...data });
  };

  if (!assets || assets.length === 0) return null;

  return (
    <SafeAreaView>
      <VStack h="$full">
        <ScrollView w="$full">
          {/* Header */}
          <ImageBackground
            bgColor="#FFF"
            h={145}
            rounded="$3xl"
            src={assets[0]?.localUri ?? ""}
            resizeMode="cover"
            w="$full"
            imageStyle={{
              borderBottomLeftRadius: 25,
              borderBottomRightRadius: 25,
            }}
            display="flex"
            flexDirection="column"
            zIndex={999}
          >
            <Button
              alignSelf="flex-end"
              rounded="$full"
              px="$2"
              py="$1"
              mx="$7"
              mt="$2"
              bgColor="$white"
              $active-bgColor="#42B0ED"
              h={30}
              w={30}
              softShadow="1"
              onPress={() => {
                setIsEdit(true);
                if (isEdit) {
                  form.handleSubmit(onSubmit)();
                }
              }}
            >
              {isEdit ? <Check stroke="#292D32" /> : <Edit stroke="#292D32" />}
            </Button>
            <HStack alignItems="center" gap="$4" justifyContent="center">
              <Avatar
                maxWidth="$full"
                w={76}
                h={76}
                mx={2}
                borderColor="$white"
                borderWidth="$2"
                bgColor={session?.user.image ? "transparent" : "#F0AB25"}
              >
                <AvatarImage
                  alt="img"
                  source={session?.user.image ?? undefined}
                />
                <AvatarFallbackText>
                  {!session?.user.image && session?.user.name}
                </AvatarFallbackText>
              </Avatar>
              <VStack gap="$1">
                <Text size="xl">{session?.user.name}</Text>
                <Text color="#7C7C7C">
                  {session?.user.role.toLowerCase()} account
                </Text>
              </VStack>
            </HStack>
          </ImageBackground>

          {/* My Info */}
          <Center
            bgColor="$white"
            gap="$4"
            mx="$5"
            px="$2"
            py="$4"
            alignItems="flex-start"
            softShadow="1"
            style={{ borderBottomEndRadius: 20, borderBottomStartRadius: 20 }}
          >
            <Text
              bgColor="#F5F5F5"
              w="$full"
              color="$black"
              fontWeight="$medium"
            >
              My info
            </Text>
            <HStack gap="$2">
              <Text color="#7C7C7C" fontWeight="$light" size="sm">
                Email:
              </Text>
              {isEdit ? (
                <FormControl
                  size="md"
                  isInvalid={!!form.formState.errors.email?.message}
                  isRequired={true}
                  w="60%"
                  px="$2"
                >
                  <Input h={28}>
                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <InputField
                          fontWeight="$normal"
                          size="sm"
                          color="$black"
                          onChangeText={(val) => field.onChange(val)}
                          onBlur={field.onBlur}
                          type="text"
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
              ) : (
                <Text fontWeight="$light" size="sm" color="$black">
                  {User?.email}
                </Text>
              )}
            </HStack>
          </Center>

          {/* Children Cards */}
          <Center
            w="$full"
            mt="$4"
            gap="$3"
            flexDirection="row"
            flexWrap="wrap"
          >
            {User?.Parent?.AllChildren.map((child) => (
              <Box
                key={nanoid()}
                bgColor="#FFF"
                w={161}
                // w={128}
                rounded="$3xl"
                display="flex"
                flexDirection="column"
                softShadow="1"
                overflow="hidden"
                m="$4"
                p="$4"
              >
                <HStack position="relative" justifyContent="flex-end" mt="$1">
                  <ProfileChildCard
                    style={{
                      position: "absolute",
                      left: -35,
                      top: 0,
                    }}
                  />
                  <Avatar
                    maxWidth="$full"
                    w={60}
                    h={60}
                    mx={2}
                    rounded="$2xl"
                    borderColor="$white"
                    alignSelf="flex-end"
                    bgColor={child.image ? "transparent" : "#F0AB25"}
                  >
                    <AvatarImage
                      alt="img"
                      rounded="$2xl"
                      source={child.image ?? undefined}
                    />
                    <AvatarFallbackText>
                      {!child.image && child.nameEn}
                    </AvatarFallbackText>
                  </Avatar>
                </HStack>
              </Box>
            ))}
          </Center>

          {/* Sign Out */}
          <Center w="$full" my="$4">
            <Button
              h="$12"
              w="$56"
              bgColor="#42B0ED"
              borderRadius="$lg"
              onPress={() => signOut()}
            >
              <ButtonText color="$white">Sign Out</ButtonText>
            </Button>
          </Center>
        </ScrollView>
      </VStack>
    </SafeAreaView>
  );
}
