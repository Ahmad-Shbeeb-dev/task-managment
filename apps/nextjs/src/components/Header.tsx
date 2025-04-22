import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { PopoverContent } from "@radix-ui/react-popover";
import { IconBell, IconMenu2, IconUser, IconX } from "@tabler/icons-react";
import { startOfDay } from "date-fns";
import format from "date-fns/format";

import type { Session } from "@acme/auth";

import { ThemeToggle } from "./theme/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { Popover, PopoverTrigger } from "./ui/Popover";

interface Props {
  session: Session;
  navbarOpened: boolean;
  toggleNavbar: Dispatch<SetStateAction<boolean>>;
}

export const Header = ({ navbarOpened, toggleNavbar, session }: Props) => {
  const today = format(startOfDay(new Date()), "MMMM - EEE dd");
  const handleNavbar = () => {
    toggleNavbar((prev) => !prev);
  };

  return (
    <header className="z-50 flex max-h-16 items-center justify-between rounded-b-xl bg-white p-5 shadow-lg dark:bg-gray-800 dark:text-white">
      <div className="flex items-center gap-4">
        {navbarOpened ? (
          <Button
            size="icon"
            className="h-6 w-6 bg-transparent text-stone-700/95 hover:bg-transparent hover:text-stone-700/60 dark:text-stone-100/95 dark:hover:text-stone-100/60"
            onClick={handleNavbar}
          >
            <IconX />
          </Button>
        ) : (
          <Button
            size="icon"
            className="h-6 w-6 bg-transparent text-stone-700/95 hover:bg-transparent hover:text-stone-700/60 dark:text-stone-100/95 dark:hover:text-stone-100/60"
            onClick={handleNavbar}
          >
            <IconMenu2 />
          </Button>
        )}
        <IconBell className="h-6 w-6 text-stone-700/95 hover:cursor-pointer hover:text-stone-700/60 dark:text-stone-100/95 dark:hover:text-stone-100/60" />
        <ThemeToggle />
      </div>
      <div>
        <h2 className="text-3xl font-extrabold text-[#42B4FF] dark:text-[#5abeff]">
          {today}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <h3 className="text-stone-700/95 dark:text-stone-100/95">
          {session.user.name}
        </h3>
        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarImage src={session.user.image!} alt="user-image" />
              <AvatarFallback>
                <IconUser />
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>

          <PopoverContent className="mt-1 rounded-md bg-slate-100 p-2 dark:bg-gray-800">
            <Link href="/signout" className="hover:underline">
              Sign out
            </Link>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
