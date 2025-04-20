import { Tabs } from "expo-router";
import { Box, Center, Text } from "@gluestack-ui/themed";
import Gallery from "assets/icons/gallery.svg";
import Home from "assets/icons/home.svg";
import Messages from "assets/icons/messages.svg";
import Profile from "assets/icons/profile.svg";
import Updates from "assets/icons/updates.svg";
import { nanoid } from "nanoid/non-secure";

import { useRegisterNotification } from "~/hooks/useRegisterNotification";

const TABS = [
  {
    name: "gallery/index",
    label: "Gallery",
    icon: Gallery,
  },
  {
    name: "updates/index",
    label: "Updates",
    icon: Updates,
  },
  {
    name: "home/index",
    label: "Home",
    icon: Home,
  },
  {
    name: "messages/index",
    label: "Messages",
    icon: Messages,
  },
  {
    name: "profile/index",
    label: "Profile",
    icon: Profile,
  },
] as const;

export default function TabsLayout() {
  const { expoPushToken, notification } = useRegisterNotification();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#42B0ED",
        tabBarInactiveTintColor: "#7C7C7C",
        tabBarStyle: { paddingBottom: 8, minHeight: 78 },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={nanoid()}
          name={tab.name}
          options={{
            // tabBarBadge: 1,
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
