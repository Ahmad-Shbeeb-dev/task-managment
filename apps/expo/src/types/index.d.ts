import type { RouterOutputs } from "@acme/api";

export interface ExpoNotificationMessage {
  /**
   * An Expo push token or an array of Expo push tokens specifying the recipient(s) of this message.
   */
  to: string | string[];
  /**
   * A JSON object delivered to your app. It may be up to about 4KiB; the total notification payload sent to Apple and Google must be at most 4KiB or else you will get a "Message Too Big" error.
   */
  data?: Record<string, any>;
  /**
   * The title to display in the notification. Often displayed above the notification body.
   */
  title?: string;
  /**
   * The message to display in the notification.
   */
  body?: string;
  /**
   * Time to Live: the number of seconds for which the message may be kept around for redelivery if it hasn't been delivered yet. Defaults to undefined to use the respective defaults of each provider (0 for iOS/APNs and 2419200 (4 weeks) for Android/FCM).
   */
  ttl?: number;
  /**
   * Timestamp since the Unix epoch specifying when the message expires. Same effect as ttl (ttl takes precedence over expiration).
   */
  expiration?: number;
  /**
   * The delivery priority of the message. Specify "default" or omit this field to use the default priority on each platform ("normal" on Android and "high" on iOS).
   */
  priority?: "default" | "normal" | "high";
  /**
   * The subtitle to display in the notification below the title. (iOS Only)
   */
  subtitle?: string;
  /**
   * Play a sound when the recipient receives this notification. Specify "default" to play the device's default notification sound, or omit this field to play no sound. Custom sounds are not supported. (iOS Only)
   */
  sound?: "default" | null;
  /**
   * Number to display in the badge on the app icon. Specify zero to clear the badge. (iOS Only)
   */
  badge?: number;
  /**
   * ID of the Notification Channel through which to display this notification. If an ID is specified but the corresponding channel does not exist on the device (that has not yet been created by your app), the notification will not be displayed to the user. (Android Only)
   */
  channelId?: string;
  /**
   * ID of the notification category that this notification is associated with. Must be on at least SDK 41 or bare workflow. (Android and iOS)
   */
  categoryId?: string;
  /**
   * Specifies whether this notification can be intercepted by the client app. In Expo Go, this defaults to true, and if you change that to false, you may experience issues. In standalone and bare apps, this defaults to false. (iOS Only)
   */
  mutableContent?: boolean;
}

// Infer the output type for a single task
export type TaskOutput = RouterOutputs["task"]["getAll"]["tasks"][number];
