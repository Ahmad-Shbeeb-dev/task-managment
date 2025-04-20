/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { isChrome } from "react-device-detect";

import { Button } from "./ui/Button";

export const Breadcrumb = () => {
  const router = useRouter();
  const pathName = usePathname();
  const pathSegments = pathName.split("/").filter((segment) => segment !== "");

  return (
    <div className="flex gap-8">
      <div className="flex gap-3">
        <Button
          size="icon"
          className="h-6 w-6 bg-transparent text-stone-700/95 hover:bg-transparent hover:text-stone-700/60"
          onClick={() => router.back()}
          //@ts-ignore
          disabled={isChrome ? !navigation.canGoBack : false}
        >
          <IconChevronLeft />
        </Button>
        <Button
          size="icon"
          className="h-6 w-6 bg-transparent text-stone-700/95 hover:bg-transparent hover:text-stone-700/60"
          onClick={() => router.forward()}
          //@ts-ignore
          disabled={isChrome ? !navigation.canGoForward : false}
        >
          <IconChevronRight />
        </Button>
      </div>

      <div className="flex w-full gap-1">
        {pathSegments.map(
          (segment, idx) =>
            !/update|manager/i.test(segment) && (
              <span key={nanoid()}>
                <Link href={`/${pathSegments.slice(0, idx + 1).join("/")}`}>
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
                {idx < pathSegments.length - 1 && " / "}
              </span>
            ),
        )}
      </div>
    </div>
  );
};
