// import { writeFile } from "fs/promises";
import fs from "fs/promises";
import path from "path";
import type { NextRequest, NextResponse } from "next/server";

import type { Session } from "@acme/auth";
import { auth } from "@acme/auth";

import type { ImageCategory } from "~/types";

async function isDirectoryExists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function writeFile(filePath: string, data: Buffer) {
  try {
    const dirname = path.dirname(filePath);
    const exist = await isDirectoryExists(dirname);
    if (!exist) {
      await fs.mkdir(dirname, { recursive: true });
    }

    await fs.writeFile(filePath, data);
  } catch (err) {
    throw new Error("Write file error in upload api.");
  }
}

interface FileType {
  name: string;
}

type ExtendedFileType = (File & FileType) | (Blob & FileType) | undefined;

export const POST = async (req: NextRequest, res: NextResponse) => {
  const ALLOWED_EXTENSTIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".bmp",
    ".pdf",
  ];
  const MAX_SIZE_LIMIT = 1000000;
  const formData = await req.formData();
  const session: Session | null = await auth();

  // console.log("🚀 ~ file: route.ts:37 ~ POST ~ formData:", {
  //   formData: [...formData],
  // });

  if (!session || session.user.role !== "ADMIN")
    Response.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const fileCategory = formData.get("category") as ImageCategory | undefined;
  const file = formData.get("file") as ExtendedFileType;
  if (!file) {
    return Response.json({ error: "No files received." }, { status: 400 });
  }
  const extension = path.extname(file.name ?? "");

  if (!ALLOWED_EXTENSTIONS.includes(extension)) {
    return Response.json({ error: "Extension not allowed!!" }, { status: 400 });
  }
  if (file.size > MAX_SIZE_LIMIT) {
    return Response.json(
      { error: "Max size limit exceeded!!" },
      { status: 400 },
    );
  }

  const extensionName = extension.split(".").pop();
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64File = buffer.toString("base64");

  let base64FileStr = "";
  if (extensionName === "pdf")
    base64FileStr = `data:application/${extensionName};base64,${base64File}`;
  else base64FileStr = `data:image/${extensionName};base64,${base64File}`;

  let savePath = "";
  if (fileCategory === "childVaccine") {
    savePath = path.join(
      process.cwd(),
      "images/children/vaccines/" + file.name,
    );
  } else if (fileCategory === "childAttachment") {
    savePath = path.join(
      process.cwd(),
      "images/children/attachments/" + file.name,
    );
  } else if (fileCategory === "childImage") {
    savePath = path.join(process.cwd(), "images/children/" + file.name);
  } else if (fileCategory === "employeeAttachment") {
    savePath = path.join(process.cwd(), "images/employees/" + file.name);
  } else {
    savePath = path.join(process.cwd(), "images/other/" + file.name);
  }

  // console.log("🚀 ~ file: route.ts:16 ~ POST ~ file:", {
  //   file,
  //   extension,
  //   extensionName,
  // });

  try {
    await writeFile(savePath, buffer);
    return Response.json(
      {
        savePath,
        base64FileStr,
        Message: "Success",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("File upload error!!", error);
    return Response.json(
      {
        savePath,
        base64FileStr,
        Message: "File upload error!!",
      },
      { status: 500 },
    );
  }
};
