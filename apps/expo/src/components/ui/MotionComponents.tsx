import React, { useEffect } from "react";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// Base motion props
interface BaseProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  animateType?:
    | "fadeIn"
    | "slideInLeft"
    | "slideInRight"
    | "slideInTop"
    | "slideInBottom"
    | "scaleUp";
  delay?: number;
}

// AnimatedBox component
export const AnimatedBox = ({
  children,
  style,
  animateType = "fadeIn",
  delay = 0,
  ...props
}: BaseProps & Record<string, any>) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    switch (animateType) {
      case "fadeIn":
        opacity.value = withDelay(
          delay * 1000,
          withTiming(1, { duration: 400 }),
        );
        break;
      case "slideInLeft":
        translateX.value = -20;
        opacity.value = 0;
        translateX.value = withDelay(
          delay * 1000,
          withTiming(0, { duration: 300 }),
        );
        opacity.value = withDelay(
          delay * 1000,
          withTiming(1, { duration: 300 }),
        );
        break;
      case "slideInRight":
        translateX.value = 20;
        opacity.value = 0;
        translateX.value = withDelay(
          delay * 1000,
          withTiming(0, { duration: 300 }),
        );
        opacity.value = withDelay(
          delay * 1000,
          withTiming(1, { duration: 300 }),
        );
        break;
      case "slideInTop":
        translateY.value = -20;
        opacity.value = 0;
        translateY.value = withDelay(
          delay * 1000,
          withTiming(0, { duration: 300 }),
        );
        opacity.value = withDelay(
          delay * 1000,
          withTiming(1, { duration: 300 }),
        );
        break;
      case "slideInBottom":
        translateY.value = 20;
        opacity.value = 0;
        translateY.value = withDelay(
          delay * 1000,
          withTiming(0, { duration: 300 }),
        );
        opacity.value = withDelay(
          delay * 1000,
          withTiming(1, { duration: 300 }),
        );
        break;
      case "scaleUp":
        scale.value = 0.95;
        opacity.value = 0;
        scale.value = withDelay(delay * 1000, withTiming(1, { duration: 300 }));
        opacity.value = withDelay(
          delay * 1000,
          withTiming(1, { duration: 300 }),
        );
        break;
      default:
        opacity.value = withDelay(
          delay * 1000,
          withTiming(1, { duration: 400 }),
        );
    }
  }, [animateType, delay, opacity, translateX, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]} {...props}>
      {children}
    </Animated.View>
  );
};

// AnimatedCard component
export const AnimatedCard = ({
  children,
  style,
  animateType = "fadeIn",
  delay = 0,
  ...props
}: BaseProps & Record<string, any>) => {
  return (
    <AnimatedBox
      style={[
        {
          borderRadius: 8,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        } as ViewStyle,
        style,
      ]}
      animateType={animateType}
      delay={delay}
      {...props}
    >
      {children}
    </AnimatedBox>
  );
};

// AnimatedList component for staggered list animations
export const AnimatedList = ({
  children,
  style,
  ...props
}: BaseProps & Record<string, any>) => {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
};

// AnimatedListItem component for items in staggered lists
export const AnimatedListItem = ({
  children,
  style,
  delay = 0,
  ...props
}: BaseProps & Record<string, any>) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(delay * 1000, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(
      delay * 1000,
      withTiming(0, { duration: 400 }),
    );
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]} {...props}>
      {children}
    </Animated.View>
  );
};

// AnimatedPressable component
export const AnimatedPressable = ({
  children,
  style,
  onPressIn,
  onPressOut,
  ...props
}: BaseProps & {
  onPressIn?: () => void;
  onPressOut?: () => void;
  [key: string]: any;
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 10, stiffness: 100 });
    onPressIn?.();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    onPressOut?.();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={[style, animatedStyle]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      {...props}
    >
      {children}
    </Animated.View>
  );
};
