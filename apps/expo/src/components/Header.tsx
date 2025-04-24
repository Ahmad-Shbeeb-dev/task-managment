import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { HStack, Text } from "@gluestack-ui/themed";
import { format } from "date-fns";

import { useTheme } from "~/utils/ThemeProvider";
import { AnimatedBox, AnimatedRepeatIcon } from "./ui/MotionComponents";
import { ThemeToggle } from "./ui/ThemeToggle";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  onRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onRefresh }) => {
  const { theme } = useTheme();
  const today = format(new Date(), "MMMM - EEE dd");
  return (
    <AnimatedBox
      animateType="fadeIn"
      style={[
        styles.container,
        {
          backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
          shadowColor: theme === "dark" ? "#000000" : "#E5E7EB",
        },
      ]}
    >
      <HStack alignItems="center" space="md">
        <AnimatedBox delay={0.2}>
          <ThemeToggle />
        </AnimatedBox>
      </HStack>

      <AnimatedBox
        animateType="fadeIn"
        delay={0.4}
        style={styles.titleContainer}
      >
        <Text
          style={[
            styles.title,
            {
              color: theme === "dark" ? "#F3F4F6" : "#1F2937",
            },
          ]}
        >
          {title ?? today}
        </Text>
      </AnimatedBox>

      <AnimatedBox delay={0.5}>
        {onRefresh ? (
          <Pressable
            style={[
              styles.iconButton,
              { backgroundColor: theme === "dark" ? "#4B5563" : "#F3F4F6" },
            ]}
            onPress={onRefresh}
          >
            <Text
              fontSize="$sm"
              color={theme === "dark" ? "#F9FAFB" : "#4B5563"}
              fontWeight="$bold"
            >
              <AnimatedRepeatIcon
                color={theme === "dark" ? "#F9FAFB" : "#4B5563"}
              />
            </Text>
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </AnimatedBox>
    </AnimatedBox>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 40,
  },
});
