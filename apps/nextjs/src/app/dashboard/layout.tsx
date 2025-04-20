// import { DashboardLayoutClient } from "~/components/DashboardLayoutClient";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { convertImagePathsToBase64 } from "@acme/api/utils";
import { auth } from "@acme/auth";

// force run on client only even without 1st render on server
const DashboardLayoutClient = dynamic(
  () => import("~/components/DashboardLayoutClient"),
  {
    ssr: false,
  },
);

export default async function DashboardLayout(props: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/signin");

  const base64UserImage = await convertImagePathsToBase64([
    { image: session.user.image },
  ]);
  session.user.image = base64UserImage[0]?.image;

  return (
    <DashboardLayoutClient session={session}>
      {props.children}
    </DashboardLayoutClient>
  );
}
