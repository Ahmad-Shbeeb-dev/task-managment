import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/PageHeader";
import { Shell } from "~/components/shells/Shell";
import { Skeleton } from "~/components/ui/Skeleton";

export default function SignOutPage() {
  return (
    <Shell className="max-w-xs">
      <PageHeader className="text-center">
        <PageHeaderHeading size="sm">Sign out</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Are you sure you want to sign out?
        </PageHeaderDescription>
      </PageHeader>
      <div className="flex w-full items-center space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </Shell>
  );
}
