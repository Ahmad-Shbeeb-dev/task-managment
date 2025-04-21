import { Redirect, Tabs } from "expo-router";
import { Box, Center, Spinner, Text } from "@gluestack-ui/themed";
import Home from "assets/icons/home.svg";
import Profile from "assets/icons/profile.svg";
import Updates from "assets/icons/updates.svg";
import { nanoid } from "nanoid/non-secure";

import { api } from "~/utils/api";
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
    name: "updates/index",
    label: "Updates",
    icon: Updates,
  },
  {
    name: "profile/index",
    label: "Profile",
    icon: Profile,
  },
] as const;

export default function TabsLayout() {
  const { expoPushToken, notification } = useRegisterNotification();

  const { data: session, isLoading, isError } = api.auth.getSession.useQuery();

  if (isLoading) {
    return (
      <Center flex={1}>
        <Spinner size="large" />
      </Center>
    );
  }

  if (isError || !session?.user) {
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
        tabBarActiveTintColor: "#42B0ED",
        tabBarInactiveTintColor: "#7C7C7C",
        tabBarStyle: { paddingBottom: 8, minHeight: 78 },
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
                }}
              >
                {focused && (
                  <Box
                    bg={color}
                    marginTop="-$6"
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
