import { nanoid } from "nanoid";

export const handleThumbnailDownload = (base64File: string) => {
  const downloadLink = document.createElement("a");
  const extension = base64File.split("/")[1]?.split(";")[0];
  const fileName = `${nanoid()}.${extension}`;

  downloadLink.href = base64File;
  downloadLink.download = fileName;
  downloadLink.click();
};
