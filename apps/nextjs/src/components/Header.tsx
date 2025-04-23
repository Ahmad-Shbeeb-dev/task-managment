import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { PopoverContent } from "@radix-ui/react-popover";
import {
  IconBell,
  IconMenu2,
  IconMoon,
  IconSun,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { startOfDay } from "date-fns";
import format from "date-fns/format";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import type { Session } from "@acme/auth";

import { slideInFromTop } from "~/utils/animation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { MotionDiv } from "./ui/MotionComponents";
import { Popover, PopoverTrigger } from "./ui/Popover";

interface Props {
  session: Session;
  navbarOpened: boolean;
  toggleNavbar: Dispatch<SetStateAction<boolean>>;
}

export const Header = ({ navbarOpened, toggleNavbar, session }: Props) => {
  const today = format(startOfDay(new Date()), "MMMM - EEE dd");
  const { theme, setTheme } = useTheme();

  const handleNavbar = () => {
    toggleNavbar((prev) => !prev);
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={slideInFromTop()}
      className="bg-card/80  top-0 z-50 flex max-h-16 items-center justify-between rounded-none p-5 shadow-sm backdrop-blur-md dark:bg-gray-800 dark:text-white lg:rounded-b-xl"
    >
      <div className="flex items-center gap-4">
        <motion.div
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          style={{ zIndex: 60 }}
        >
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-stone-700/95 hover:text-stone-700/60 dark:text-stone-100/95 dark:hover:text-stone-100/60"
            onClick={handleNavbar}
          >
            <motion.div
              animate={{ rotate: navbarOpened ? 90 : 0 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              {navbarOpened ? (
                <IconX className="h-5 w-5" />
              ) : (
                <IconMenu2 className="h-5 w-5" />
              )}
            </motion.div>
          </Button>
        </motion.div>

        <MotionDiv className="hidden sm:flex" animateType="fadeIn" delay={0.2}>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-stone-700/95 hover:text-stone-700/60 dark:text-stone-100/95 dark:hover:text-stone-100/60"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <IconSun className="h-5 w-5" />
            ) : (
              <IconMoon className="h-5 w-5" />
            )}
          </Button>
        </MotionDiv>

        <MotionDiv className="relative" animateType="fadeIn" delay={0.3}>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-stone-700/95 hover:text-stone-700/60 dark:text-stone-100/95 dark:hover:text-stone-100/60"
          >
            <IconBell className="h-5 w-5" />
          </Button>
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-500"></span>
        </MotionDiv>
      </div>

      <MotionDiv
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center"
        animateType="fadeIn"
      >
        <h2 className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-blue-600 md:text-3xl">
          {today}
        </h2>
      </MotionDiv>

      <div className="flex items-center gap-3">
        <h3 className="hidden text-sm text-stone-700/95 dark:text-stone-100/95 md:block">
          {session.user.name}
        </h3>
        <Popover>
          <PopoverTrigger>
            <Avatar className="h-8 w-8 transition-transform hover:scale-105">
              <AvatarImage src={session.user.image!} alt="user-image" />
              <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                <IconUser className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>

          <PopoverContent className="bg-card mt-1 rounded-lg border-none p-3 shadow-md dark:bg-gray-800">
            <div className="flex flex-col gap-2">
              <div className="mb-1 border-b pb-2 text-sm font-medium">
                {session.user.name}
              </div>
              <Link
                href="/signout"
                className="text-destructive hover:bg-destructive/10 flex w-full items-center justify-center rounded-md py-1.5 text-sm transition-colors"
              >
                Sign out
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </motion.header>
  );
};
