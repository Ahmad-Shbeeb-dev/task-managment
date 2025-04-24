import { Redirect, Tabs } from "expo-router";
import { Box, Center, Spinner, Text } from "@gluestack-ui/themed";
import Home from "assets/icons/home.svg";
import Profile from "assets/icons/profile.svg";
import { nanoid } from "nanoid/non-secure";

import { api } from "~/utils/api";
import { useTheme } from "~/utils/ThemeProvider";
import { useRegisterNotification } from "~/hooks/useRegisterNotification";

interface TabDefinition {
  name: string;
  label: string;
  icon: React.FC<any>;
  roles?: readonly string[];
}

const TABS: readonly TabDefinition[] = [
  {
    name: "tasks/index",
    label: "Tasks",
    icon: Home,
  },
  {
    name: "profile/index",
    label: "Profile",
    icon: Profile,
  },
] as const;

export default function TabsLayout() {
  const { expoPushToken, notification } = useRegisterNotification();
  console.log(
    "🚀 ~ TabsLayout ~ expoPushToken, notification :",
    expoPushToken,
    notification,
  );
  const { theme } = useTheme();

  const { data: session, isLoading, isError } = api.auth.getSession.useQuery();

  // Light/dark theme colors
  const activeColor = theme === "dark" ? "#60A5FA" : "#42B0ED";
  const inactiveColor = theme === "dark" ? "#9CA3AF" : "#7C7C7C";
  const tabBarBgColor = theme === "dark" ? "#1F2937" : "#FFFFFF";

  if (isLoading) {
    return (
      <Center flex={1}>
        <Spinner size="large" />
      </Center>
    );
  }

  if (isError || !session?.user.id) {
    return <Redirect href="/(auth)/signin" />;
  }

  const userRole = session.user.role;

  const filteredTabs = TABS.filter(
    (tab) =>
      !tab.roles || (tab.roles && userRole && tab.roles.includes(userRole)),
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          paddingBottom: 4,
          minHeight: 60,
          backgroundColor: tabBarBgColor,
          borderTopColor: theme === "dark" ? "#374151" : "#E5E7EB",
        },
      }}
    >
      {filteredTabs.map((tab) => (
        <Tabs.Screen
          key={nanoid()}
          name={tab.name}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, focused }) => (
              <Center
                style={{
                  marginBottom: focused ? -14 : 14,
                  width: 100,
                }}
              >
                {focused && (
                  <Box
                    bg={color}
                    marginTop="-$4"
                    marginBottom="$2"
                    h="$2"
                    w="$12"
                    borderBottomEndRadius={20}
                    borderBottomStartRadius={20}
                  />
                )}
                <tab.icon stroke={color} />

                {focused && (
                  <Text size="xs" fontWeight="$semibold" color={color}>
                    {tab.label}
                  </Text>
                )}
              </Center>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
