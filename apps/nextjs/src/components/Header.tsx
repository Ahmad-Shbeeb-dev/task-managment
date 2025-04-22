import { useContext, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { PopoverContent } from "@radix-ui/react-popover";
import {
  IconBell,
  IconCalendarEvent,
  IconMail,
  IconMenu2,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { startOfDay } from "date-fns";
import format from "date-fns/format";

import type { Session } from "@acme/auth";

import { PageTitleContext } from "~/utils/context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { Popover, PopoverTrigger } from "./ui/Popover";

interface Props {
  session: Session;
  navbarOpened: boolean;
  toggleNavbar: Dispatch<SetStateAction<boolean>>;
}

export const Header = ({ navbarOpened, toggleNavbar, session }: Props) => {
  const today = startOfDay(new Date());
  const formattedDate = format(today, "MMMM - EEE dd");
  const handleNavbar = () => {
    toggleNavbar((prev) => !prev);
  };
  // const pathName = usePathname();
  const segments = useSelectedLayoutSegments();

  const { pageTitle } = useContext(PageTitleContext);
  let headerTitle: null | string = null;

  // Manager pages
  if (segments.includes("home")) {
    headerTitle = formattedDate;
  }
  if (segments.includes("classes")) {
    if (segments.includes("add-class")) {
      headerTitle = "class name";
    } else if (segments.includes("update-class")) {
      headerTitle = pageTitle;
    } else {
      headerTitle = "Classes";
    }
  }
  if (segments.includes("children")) {
    if (segments.includes("add-child")) {
      headerTitle = "child name";
    } else if (segments.includes("update-child")) {
      headerTitle = pageTitle;
    } else {
      headerTitle = "Children";
    }
  }
  if (segments.includes("events")) {
    if (segments.includes("add-event")) {
      headerTitle = "event name";
    } else if (segments.includes("update-event")) {
      headerTitle = pageTitle;
    } else if (segments.includes("add-event-type")) {
      headerTitle = "event type name";
    } else if (segments.includes("update-event-type")) {
      headerTitle = pageTitle;
    } else if (
      !segments.includes("add-event-type") &&
      !segments.includes("update-event-type")
    ) {
      headerTitle = "Events";
    } else if (
      !segments.includes("add-event") &&
      !segments.includes("update-event")
    ) {
      headerTitle = "Events Types";
    }
  }
  if (segments.includes("announcements")) {
    if (segments.includes("add-announcement")) {
      headerTitle = "announcement name";
    } else if (segments.includes("update-announcement")) {
      headerTitle = pageTitle;
    } else {
      headerTitle = "Announcements";
    }
  }
  if (segments.includes("attendances")) {
    if (segments.includes("add-attendance")) {
      headerTitle = "attendance name";
    } else if (segments.includes("update-attendance")) {
      headerTitle = pageTitle;
    } else {
      headerTitle = "Attendances";
    }
  }
  if (segments.includes("employees")) {
    if (segments.includes("add-employee")) {
      headerTitle = "employee name";
    } else if (segments.includes("update-employee")) {
      headerTitle = pageTitle;
    } else {
      headerTitle = "Employees";
    }
  }
  if (segments.includes("meals")) {
    if (segments.includes("add-meal")) {
      headerTitle = "meal name";
    } else if (segments.includes("update-meal")) {
      headerTitle = pageTitle;
    } else {
      headerTitle = "Meals";
    }
  }

  // Teacher pages
  if (segments.includes("profile")) {
    headerTitle = "Profile";
  }
  if (segments.includes("reports")) {
    headerTitle = "Reports";
  }

  return (
    <header className="z-50 flex max-h-16 items-center justify-between rounded-b-xl bg-white p-5 shadow-lg">
      <div className="flex items-center gap-4">
        {navbarOpened ? (
          <Button
            size="icon"
            className="h-6 w-6 bg-transparent text-stone-700/95 hover:bg-transparent hover:text-stone-700/60"
            onClick={handleNavbar}
          >
            <IconX />
          </Button>
        ) : (
          <Button
            size="icon"
            className="h-6 w-6 bg-transparent text-stone-700/95 hover:bg-transparent hover:text-stone-700/60"
            onClick={handleNavbar}
          >
            <IconMenu2 />
          </Button>
        )}
        <IconBell className="h-6 w-6 text-stone-700/95 hover:cursor-pointer hover:text-stone-700/60" />
        <IconMail className="h-6 w-6 text-stone-700/95 hover:cursor-pointer hover:text-stone-700/60" />
        <IconCalendarEvent className="h-6 w-6 text-stone-700/95 hover:cursor-pointer hover:text-stone-700/60" />
      </div>
      <div>
        <h2 className="text-3xl font-extrabold text-[#42B4FF]">
          {headerTitle}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <h3 className="text-stone-700/95">{session.user.name}</h3>
        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarImage src={session.user.image!} alt="user-image" />
              <AvatarFallback>
                <IconUser />
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>

          <PopoverContent className="mt-1 rounded-md bg-slate-100 p-2">
            <Link href="/signout" className="hover:underline">
              Sign out
            </Link>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
