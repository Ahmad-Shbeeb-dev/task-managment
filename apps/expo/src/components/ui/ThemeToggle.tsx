import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Button, Icon, MoonIcon, SunIcon } from "@gluestack-ui/themed";

import { useTheme } from "~/utils/ThemeProvider";
import { AnimatedPressable } from "./MotionComponents";

interface ThemeToggleProps {
  style?: StyleProp<ViewStyle>;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ style }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <AnimatedPressable
      style={[
        {
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme === "dark" ? "#374151" : "#F3F4F6",
        },
        style,
      ]}
      onPressIn={toggleTheme}
    >
      {theme === "dark" ? (
        <SunIcon size="md" color="$amber500" />
      ) : (
        <MoonIcon size="md" color="$blue500" />
      )}
    </AnimatedPressable>
  );
};
