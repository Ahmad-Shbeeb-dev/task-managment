import React from "react";
import { StyleSheet } from "react-native";
import { Box, HStack, VStack } from "@gluestack-ui/themed";

import { useTheme } from "~/utils/ThemeProvider";

export const TaskItemSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Box
      borderWidth="$1"
      borderColor={theme === "dark" ? "#4B5563" : "#E5E7EB"}
      borderRadius="$lg"
      p="$4"
      mb="$3"
      bg={theme === "dark" ? "#1F2937" : "#FFFFFF"}
    >
      <VStack space="sm">
        <HStack justifyContent="space-between" alignItems="center">
          {/* Title Skeleton */}
          <Box
            h="$5"
            w="$3/5"
            bg={theme === "dark" ? "#6B7280" : "#E5E7EB"}
            borderRadius="$sm"
          />
          {/* Status Select Skeleton */}
          <Box
            h="$8"
            w={120}
            bg={theme === "dark" ? "#6B7280" : "#E5E7EB"}
            borderRadius="$sm"
          />
        </HStack>
        {/* Description Skeleton */}
        <Box
          h="$4"
          w="$4/5"
          bg={theme === "dark" ? "#6B7280" : "#E5E7EB"}
          borderRadius="$sm"
        />
        <HStack
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          {/* Due Date Skeleton */}
          <Box
            h="$4"
            w="$1/3"
            bg={theme === "dark" ? "#6B7280" : "#E5E7EB"}
            borderRadius="$sm"
          />
          {/* Priority Skeleton */}
          <Box
            h="$4"
            w="$16"
            bg={theme === "dark" ? "#6B7280" : "#E5E7EB"}
            borderRadius="$sm"
          />
        </HStack>
      </VStack>
    </Box>
  );
};
