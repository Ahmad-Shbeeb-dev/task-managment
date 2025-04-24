import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "@gluestack-ui/themed";

import { useTheme } from "~/utils/ThemeProvider";
import { AnimatedBox } from "~/components/ui/MotionComponents";

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No tasks found. Add a task to get started!",
}) => {
  const { theme } = useTheme();

  return (
    <AnimatedBox animateType="fadeIn" delay={0.2} style={styles.container}>
      <Text style={{ color: theme === "dark" ? "#9CA3AF" : "#6B7280" }}>
        {message}
      </Text>
    </AnimatedBox>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
