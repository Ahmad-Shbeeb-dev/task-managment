import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

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

  return (
    <DashboardLayoutClient session={session}>
      {props.children}
    </DashboardLayoutClient>
  );
}
