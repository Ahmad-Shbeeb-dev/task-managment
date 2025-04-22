import type { RecurringType } from "@acme/db";

import type { ExpoNotificationMessage } from "./src";

// Helper function to calculate the next occurrence date
export const calculateNextOccurrence = (
  startDate: Date,
  type: RecurringType,
): Date => {
  const nextDate = new Date(startDate);
  switch (type) {
    case "DAILY":
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "WEEKLY":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "MONTHLY":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
  }
  return nextDate;
};

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
export async function sendPushNotification(message: ExpoNotificationMessage) {
  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.log("sendPushNotification Error: ", JSON.stringify(error, null, 2));
  }
}
