import React from "react";
import {
  AlertCircleIcon,
  Box,
  Button,
  ButtonText,
  Center,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  Input,
  InputField,
  Text,
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import Verification from "assets/verification.svg";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { resetPasswordCodeValidation } from "@acme/api/validations";

export const VerificationCodeForm = () => {
  const form = useForm<z.infer<typeof resetPasswordCodeValidation>>({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(resetPasswordCodeValidation),
    reValidateMode: "onChange",
  });

  const onSubmit = (data: z.infer<typeof resetPasswordCodeValidation>) => {
    console.log("data passed validation", data);
  };
  return (
    <Box>
      <Box w="$full" h="$2/5" $md-h="$full" $md-w="$1/2">
        <Verification width="100%" height="100%" />
      </Box>
      <Text color="$black" fontWeight="$bold" pl="$1/6">
        Verification Code
      </Text>
      <Text pl="$1/6" pr="$1/4">
        We have sent the verification code to your email address
      </Text>
      <Box h="$48" w="$72" m="$10">
        <FormControl
          size="md"
          isDisabled={false}
          isInvalid={!!form.formState.errors.code?.message}
          isReadOnly={false}
          isRequired={true}
        >
          <Input>
            <Controller
              control={form.control}
              render={({ field }) => (
                <InputField
                  onChangeText={(val) => field.onChange(val)}
                  onBlur={() => field.onBlur}
                  type="text"
                  value={field.value}
                />
              )}
              name="code"
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>
              {form.formState.errors.code?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <Center>
          <Button
            h="$12"
            w="$72"
            mt="$12"
            bgColor="#42B0ED"
            borderRadius="$2xl"
            onPress={form.handleSubmit(onSubmit)}
          >
            <ButtonText color="$white">Confirm</ButtonText>
          </Button>
        </Center>
      </Box>
    </Box>
  );
};
