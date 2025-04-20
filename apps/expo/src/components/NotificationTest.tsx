import {
  Button,
  ButtonText,
  SafeAreaView,
  Text,
  View,
} from "@gluestack-ui/themed";

import { sendPushNotification } from "@acme/api/utils";

import { useRegisterNotification } from "~/hooks/useRegisterNotification";

export const NotificationTest = () => {
  const { expoPushToken, notification } = useRegisterNotification();
  return (
    <SafeAreaView>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>Title: {notification?.request.content.title} </Text>
        <Text>Body: {notification?.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <Button
        onPress={async () => {
          await sendPushNotification({
            to: expoPushToken,
            sound: "default",
            title: "Original Title",
            body: "And here is the body! ewq",
            data: { someData: "goes here" },
          });
        }}
      >
        <ButtonText>Press to Send Notification </ButtonText>
      </Button>
    </SafeAreaView>
  );
};
