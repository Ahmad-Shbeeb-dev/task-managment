// Must be in protected route (home page after login) to get userId and associate it with notificationToken

import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { api } from "~/utils/api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      projectId: Constants.expoConfig!.extra!.eas.projectId,
    });
    // console.log("registerForPushNotificationsAsync:", token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token?.data;
}

export const useRegisterNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const { mutate: upsertNotificationTokenMutation } =
    api.user.upsertNotificationToken.useMutation();

  const utils = api.useUtils();

  useEffect(() => {
    async function registerForNotifications() {
      try {
        const token = await registerForPushNotificationsAsync();
        if (!token)
          throw new Error(
            "useRegisterNotification -> registerForNotifications error!!",
          );

        setExpoPushToken(token);
        upsertNotificationTokenMutation({ notificationToken: token });

        notificationListener.current =
          Notifications.addNotificationReceivedListener(
            async (notification) => {
              //action when receiving notifiction and the app in foreground : refetch Today's news
              setNotification(notification);
              await utils.invalidate();
            },
          );

        responseListener.current =
          Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("useRegisterNotification:", response);
          });
      } catch (error) {
        console.error("Error registering for notifications:", error);
      }
    }

    void registerForNotifications();

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!,
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};
