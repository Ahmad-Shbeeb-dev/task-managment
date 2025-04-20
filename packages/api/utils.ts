/* eslint-disable @typescript-eslint/ban-ts-comment */
import { promises as fs } from "fs";
import path from "path";

import type { ExpoNotificationMessage } from "./src";

export async function convertImagePathsToBase64<
  T extends {
    image?: string | null; // for children & employees
    attachments?: string[] | null; // for children & employees
    vaccines?: string[] | null; //only on children
  },
>(data: T[]): Promise<T[]> {
  try {
    const FSimages = await Promise.allSettled([
      ...data.map((data) => (data?.image ? fs.readFile(data.image) : null)),
      ...data.map((data) => {
        return Promise.allSettled(
          data.attachments
            ? data.attachments.map((attachment) =>
                attachment ? fs.readFile(attachment) : null,
              )
            : [],
        );
      }),
      ...data.map((data) => {
        return Promise.allSettled(
          data.vaccines
            ? data.vaccines.map((vaccine) =>
                vaccine ? fs.readFile(vaccine) : null,
              )
            : [],
        );
      }),
    ]);

    const convert = (savePath: string | null, buffer: Buffer | null) => {
      if (!savePath || !buffer) return null;

      const extension = path.extname(savePath);
      const extensionName = extension.split(".").pop();
      const base64Image = buffer.toString("base64");

      let base64ImageStr = "";
      if (extensionName === "pdf") {
        base64ImageStr = `data:application/${extensionName};base64,${base64Image}`;
      } else {
        base64ImageStr = `data:image/${extensionName};base64,${base64Image}`;
      }
      return base64ImageStr;
    };

    return data.map((data, index) => {
      let base64Image: string | null = null;
      let base64Attachments: (string | null)[] = [];
      let base64Vaccines: (string | null)[] = [];

      //child/employee image
      if (data?.image) {
        if (FSimages[0]?.status === "fulfilled") {
          // @ts-ignore
          const childEmployeeImage = FSimages[index]?.value as Buffer | null;
          base64Image = convert(data.image ?? null, childEmployeeImage);
        }
      }

      //child/employee attachments
      if (data?.attachments) {
        if (FSimages[1]?.status === "fulfilled") {
          const childAttachments = FSimages[1]?.value as
            | PromiseSettledResult<Buffer | null>[]
            | null;
          base64Attachments = data.attachments.map((attachment, idx) => {
            const attachmentImg = childAttachments?.[idx];

            if (attachmentImg?.status === "fulfilled") {
              return convert(attachment, attachmentImg.value);
            } else {
              return null;
            }
          });
        }
      }

      //child vaccines
      if (data?.vaccines) {
        if (FSimages[2]?.status === "fulfilled") {
          const childVaccines = FSimages[2]?.value as
            | PromiseSettledResult<Buffer | null>[]
            | null;

          base64Vaccines = data.vaccines.map((vaccine, idx) => {
            const vaccineImg = childVaccines?.[idx];

            if (vaccineImg?.status === "fulfilled") {
              return convert(vaccine, vaccineImg.value);
            } else {
              return null;
            }
          });
        }
      }

      return {
        ...data,
        image: base64Image,
        attachments: base64Attachments.filter(Boolean),
        vaccines: base64Vaccines.filter(Boolean),
      };
    });
  } catch (error) {
    console.error("image deleted (no such file or directory)!!", error);
    return data;
  }
}

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
